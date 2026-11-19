#!/usr/bin/env python3
"""build_index.py -- compact text index of the mathexplorer research corpus.

Pure text processing: every repo file is read as text, line by line. No JS is
imported or executed. Output: 14 chunk files (each <= about 180 KB) in
engine/index/, one tagged line per item, plus MANIFEST.md and an optional
longer per-module lookup file in index/full/.

Run:  scripts/memcap.sh 8 python3 tmp/research-2026-11-16/engine/build_index.py
Options: --no-fetch  (do not git-fetch missing PR refs)
"""
import os, re, sys, glob, hashlib, subprocess, json

ROOT = '.'
GH = '~/Documents/GitHub'
ENGINE = ROOT + '/tmp/research-2026-11-16/engine'
OUT = ENGINE + '/index'
MEM = '~/.claude/projects/[project]/memory'
CAP = 180_000          # bytes per chunk
NO_FETCH = '--no-fetch' in sys.argv
MANIFEST = []          # (file, bytes, lines, covers, notes)

# ---------------------------------------------------------------- helpers
WS = re.compile(r'\s+')
def clean(s): return WS.sub(' ', s).strip()
def blen(tag, body): return len(tag.encode('utf-8')) + len(body.encode('utf-8')) + 2
def trunc(s, n):
    return s if len(s) <= n else s[:max(1, n - 1)].rstrip() + '…'

def fit(items, budget, minlen=80):
    """items: list of (tag, body). Shorten bodies to one common length so the
    total fits the byte budget; if still too large at minlen, sample evenly.
    Returns (items, note)."""
    total = sum(blen(t, b) for t, b in items)
    if total <= budget or not items:
        return items, ''
    def size(L): return sum(blen(t, trunc(b, L)) for t, b in items)
    lo, hi = minlen, max(len(b) for _, b in items)
    if size(lo) > budget:
        cut = [(t, trunc(b, lo)) for t, b in items]
        n = len(cut); k = max(1, int(n * budget / size(lo)) - 1)
        idx = sorted(set(int(i * n / k) for i in range(k)))
        out = [cut[i] for i in idx]
        while sum(blen(t, b) for t, b in out) > budget: out.pop()
        return out, 'bodies cut to %d chars and evenly sampled %d of %d' % (lo, len(out), n)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if size(mid) <= budget: lo = mid
        else: hi = mid - 1
    return [(t, trunc(b, lo)) for t, b in items], 'bodies cut to at most %d chars' % lo

def waterfill(needs, total):
    """Give each source min(need, level) with sum <= total."""
    n = len(needs); budgets = [0] * n
    order = sorted(range(n), key=lambda i: needs[i]); remaining = total
    for pos, i in enumerate(order):
        share = remaining // (n - pos)
        budgets[i] = min(needs[i], share); remaining -= budgets[i]
    return budgets

def fit_groups(groups, budget, minlen=80):
    """groups: list of lists of (tag, body). Water-fill the budget across the
    groups, then fit each group."""
    needs = [sum(blen(t, b) for t, b in g) for g in groups]
    budgets = waterfill(needs, budget)
    out = []; cut = 0
    for g, b in zip(groups, budgets):
        f, note = fit(g, b, minlen)
        if note: cut += 1
        out.extend(f)
    return out, ('%d of %d sources shortened to fit' % (cut, len(groups))) if cut else ''

def fit_outline(items, budget, floor=150):
    """Fit markdown-outline items: shorten bodies down to `floor` chars, then
    drop heading-only runs and deep headings, then keep an even sample."""
    def total(xs): return sum(blen(t, b) for t, b in xs)
    def search(xs):
        if total(xs) <= budget: return xs
        def size(L): return sum(blen(t, trunc(b, L)) for t, b in xs)
        if size(floor) > budget: return None
        lo, hi = floor, max(len(b) for _, b in xs)
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if size(mid) <= budget: lo = mid
            else: hi = mid - 1
        return [(t, trunc(b, lo)) for t, b in xs]
    stages = [lambda b: False,
              lambda b: b.startswith('headings:') or b.startswith('####'),
              lambda b: b.startswith('headings:') or b.startswith('###')]
    xs = items
    for drop in stages:
        xs = [(t, b) for t, b in items if not drop(b)] or items[:1]
        r = search(xs)
        if r is not None: return r, ('' if total(r) == total(items) else 'shortened')
    return fit(xs, budget, minlen=floor)[0], 'sampled'

def fit_groups_outline(groups, budget, floor=150, weights=None):
    needs = [sum(blen(t, b) for t, b in g) for g in groups]
    ws = weights or [1] * len(groups)
    budgets = waterfill([int(n / w) for n, w in zip(needs, ws)], budget)
    alloc = [min(n, int(b * w)) for n, b, w in zip(needs, budgets, ws)]
    sc = min(1.0, budget / max(1, sum(alloc)))
    out = []; cut = 0; samp = 0
    for g, a in zip(groups, alloc):
        f, note = fit_outline(g, int(a * sc), floor)
        cut += bool(note); samp += (note == 'sampled')
        out.extend(f)
    # hand unused bytes back is not needed: allocations are upper bounds
    return out, ('%d of %d sources shortened (%d by dropping/sampling sections)' % (cut, len(groups), samp)) if cut else ''

def fit_weighted(items, weights, budget, minlen=40):
    """One common body length L; item i is cut to L*weights[i] chars."""
    def size(L): return sum(blen(t, trunc(b, max(minlen, int(L * w)))) for (t, b), w in zip(items, weights))
    if sum(blen(t, b) for t, b in items) <= budget: return items, ''
    lo, hi = 1, max(len(b) for _, b in items)
    if size(lo) > budget: return fit(items, budget, minlen)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if size(mid) <= budget: lo = mid
        else: hi = mid - 1
    return ([(t, trunc(b, max(minlen, int(lo * w)))) for (t, b), w in zip(items, weights)],
            'record bodies cut to %d chars x module weight' % lo)

def head(items, budget, marker_tag, where):
    """Keep leading lines within the budget; add a truncation marker."""
    total = sum(blen(t, b) for t, b in items)
    if total <= budget: return items
    out = []; used = 0
    for t, b in items:
        s = blen(t, b)
        if used + s > budget - 200: break
        out.append((t, b)); used += s
    out.append((marker_tag, '(truncated: %d of %d bytes shown; full text at %s)' % (used, total, where)))
    return out

def write_chunk(name, header, items, covers, note=''):
    path = os.path.join(OUT, name)
    with open(path, 'w', encoding='utf-8') as f:
        f.write('# ' + header + '\n')
        for t, b in items:
            f.write(t + ' ' + b + '\n')
    size = os.path.getsize(path)
    MANIFEST.append((path, size, len(items), covers, note))
    print('%-28s %7d bytes %6d lines  %s' % (name, size, len(items), note), flush=True)

def read_lines(path, maxlines=None):
    out = []
    try:
        with open(path, 'r', encoding='utf-8', errors='replace') as f:
            for i, line in enumerate(f):
                if maxlines is not None and i >= maxlines: break
                out.append(line.rstrip('\n'))
    except OSError:
        pass
    return out

def read_literal(text):
    """Read a JS string literal (or '+'-concatenation / array of literals) at
    the start of text. Returns the string or None."""
    i = 0; n = len(text); parts = []; in_arr = False
    while True:
        while i < n and text[i] in ' \t\r\n(': i += 1
        if text.startswith('Object.freeze', i): i += 13; continue
        if text.startswith('String.raw', i): i += 10; continue
        if i < n and text[i] == '[' and not parts: in_arr = True; i += 1; continue
        if i < n and text[i:i+2] == '//':
            j = text.find('\n', i); i = n if j < 0 else j + 1; continue
        if i >= n or text[i] not in '\'"`': break
        q = text[i]; j = i + 1; buf = []
        while j < n and text[j] != q:
            if text[j] == '\\' and j + 1 < n:
                buf.append({'n': ' ', 't': ' '}.get(text[j+1], text[j+1])); j += 2
            else:
                buf.append(text[j]); j += 1
        parts.append(''.join(buf)); i = j + 1
        while i < n and text[i] in ' \t\r\n': i += 1
        if i < n and (text[i] == '+' or (in_arr and text[i] == ',')): i += 1; continue
        break
    s = clean(' '.join(parts))
    return s or None

def md_outline(lines, para_len=320, claims_only=False, max_items=None):
    """Return list of 'heading :: first paragraph' strings for a markdown text."""
    CLAIM = re.compile(r'result|claim|verdict|theorem|lemma|status|summary|conclusion|obstruction|finding|abstract|outcome|proved|refut|wall|closed|open|main|what is|gap|next|certif|bound', re.I)
    out = []; cur = '(preamble)'; para = []; done = False; fence = False
    def flush():
        nonlocal para, done
        p = clean(' '.join(para))
        if cur != '(preamble)' or p:
            if claims_only and not CLAIM.search(cur) and cur != '(preamble)':
                out.append((cur, ''))
            else:
                out.append((cur, trunc(p, para_len)))
        para = []; done = False
    for ln in lines:
        s = ln.strip()
        if s.startswith('```'): fence = not fence; continue
        if fence: continue
        m = re.match(r'^(#{1,4})\s+(.*)', s)
        if m:
            flush(); cur = m.group(1) + ' ' + clean(m.group(2)); continue
        if done or not s: continue
        if s.startswith('---') or s.startswith('<!--') or re.match(r'^[|:\- ]+$', s): continue
        para.append(s)
        if sum(len(x) for x in para) > para_len: done = True
    flush()
    # merge runs of heading-only entries
    res = []; run = []
    for h, p in out:
        if p: 
            if run: res.append('headings: ' + ' ; '.join(run)); run = []
            res.append(h + ' :: ' + p)
        else:
            run.append(h)
    if run: res.append('headings: ' + ' ; '.join(run))
    return res[:max_items] if max_items else res

def lead_comment(lines, maxchars=500):
    """Text of the leading comment block of a JS/JSX file."""
    buf = []; n = 0; started = False
    for ln in lines[:120]:
        s = ln.strip()
        if not s:
            if started and n > 150: break
            continue
        if s.startswith('/*') or s.startswith('*') or s.startswith('//'):
            started = True
            s = re.sub(r'^(/\*+|\*+/|\*+|//+)\s?', '', s).rstrip('*/ ').strip()
            if not s or re.match(r'^[-=─━]{4,}$', s): continue
            if s.startswith('@module'): continue
            s = re.sub(r'^@fileoverview\s*', '', s)
            buf.append(s); n += len(s) + 1
            if n >= maxchars: break
        else:
            break
    return trunc(clean(' '.join(buf)), maxchars)

def git(*args, timeout=120):
    try:
        r = subprocess.run(['git', '-C', ROOT] + list(args), capture_output=True, timeout=timeout,
                           env=dict(os.environ, GIT_TRACE2_EVENT='0', GIT_TERMINAL_PROMPT='0'))
        return r.returncode, r.stdout.decode('utf-8', 'replace')
    except Exception as e:
        return 1, ''

# ---------------------------------------------------------------- 1-6 imp modules
KEY = re.compile(r'^\s*(?://\s*)?(?:export\s+)?(?:const\s+|let\s+)?([A-Za-z_][A-Za-z_0-9]*)\s*[:=]\s*(.*)$')
def kind_of(name):
    n = name.lower()
    if 'allowed' in n or n.startswith('is') or n.startswith('carries') or 'assert' in n: return None
    if 'verdict' in n: return 'V'
    if 'finding' in n or 'headline' in n or 'conclusion' in n: return 'F'
    if 'title' in n: return 'T'
    if 'summary' in n: return 'S'
    if 'status' in n: return 'St'
    return None

def imp_record(path):
    lines = read_lines(path, 2500)
    got = {}
    for i, ln in enumerate(lines):
        if len(got) == 5: break
        if ':' not in ln and '=' not in ln: continue
        m = KEY.match(ln)
        if not m: continue
        k = kind_of(m.group(1))
        if not k or k in got: continue
        lit = read_literal(m.group(2) + '\n' + '\n'.join(lines[i+1:i+12]))
        if lit and len(lit) >= 3: got[k] = lit
    got['D'] = lead_comment(lines, 420)
    return got

def build_imp():
    files = glob.glob(ROOT + '/src/data/imp-*.js')
    def key(p):
        b = os.path.basename(p); m = re.match(r'imp-(\d+)', b)
        return (0, int(m.group(1)), b) if m else (1, 0, b)
    files.sort(key=key)
    full = []; compact = []
    for p in files:
        slug = os.path.basename(p)[:-3]
        g = imp_record(p)
        tag = '[imp:%s]' % slug
        order_full = [('T', 'T'), ('V', 'V'), ('F', 'F'), ('S', 'S'), ('St', 'status'), ('D', 'D')]
        fb = ' | '.join('%s: %s' % (lab, trunc(g[k], 260)) for k, lab in order_full if g.get(k))
        full.append((tag, trunc(fb, 600)))
        # compact: verdict first, then the most specific remaining text
        parts = []
        if g.get('V'): parts.append('V: ' + trunc(g['V'], 130))
        rest = g.get('F') or g.get('S') or g.get('D') or g.get('T') or ''
        if not g.get('V') and g.get('St'): parts.append('status: ' + trunc(g['St'], 60))
        if rest: parts.append(rest)
        compact.append((tag, ' | '.join(parts) if parts else '(no title/verdict literal found)'))
    os.makedirs(OUT + '/full', exist_ok=True)
    with open(OUT + '/full/imp_modules_600.txt', 'w', encoding='utf-8') as f:
        f.write('# Longer lookup (not one of the 14 chunks): every src/data/imp-*.js, up to 600 chars each. T=title V=verdict F=finding/conclusion S=summary D=leading doc comment.\n')
        for t, b in full: f.write(t + ' ' + b + '\n')
    items, note = fit(compact, 6 * (CAP - 400), minlen=60)
    total = sum(blen(t, b) for t, b in items); target = total / 6.0
    chunks = [[] for _ in range(6)]; acc = 0
    for t, b in items:
        ci = min(5, int(acc / target)); chunks[ci].append((t, b)); acc += blen(t, b)
    for ci, ch in enumerate(chunks):
        first = ch[0][0][5:-1]; last = ch[-1][0][5:-1]
        rng = '%s .. %s' % (first[:28], last[:28])
        write_chunk('%02d_imp_modules_%d.txt' % (ci + 1, ci + 1),
                    'src/data/imp-*.js result modules, part %d of 6 (%d modules, id order: %s). Line: [imp:<file slug>] V: verdict | finding/summary/doc. Full 600-char records: index/full/imp_modules_600.txt' % (ci + 1, len(ch), rng),
                    ch, 'src/data/imp-*.js result modules %d/6 (%d modules, %s): file slug, verdict literal, then finding/summary/leading doc comment' % (ci + 1, len(ch), rng),
                    note + ' (%d modules total; full 600-char records in index/full/imp_modules_600.txt)' % len(files))

# ---------------------------------------------------------------- 7 improvements.js
KW = ['riemann', 'zero', 'zeta', 'weil', 'positivity', 'bridge', 'ladder', 'twin', 'torus', 'klein', 'spinor',
      'twistor', 'shear', 'vortex', 'channel', 'hecke', 'theta', 'euler', 'prime', 'pick', 'de branges',
      'li coefficient', 'mollifier', 'pair correlation', 'hilbert', 'polya', 'pólya', 'trace formula', 'selberg',
      'explicit formula', 'heat flow', 'de bruijn', 'lambda', 'λ']
KWRE = re.compile('|'.join(re.escape(k) for k in KW))
def build_improvements():
    path = ROOT + '/src/data/improvements.js'
    head_re = re.compile(r'^\s*\{\s*id:\s*(\d+)\s*,(.*)$')
    cat_re = re.compile(r'category:\s*["\']([^"\']*)["\']')
    st_re = re.compile(r'\bstatus:\s*["\']([^"\']*)["\']')
    items = []; n_all = 0; n_match = 0; cats = {}
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        for line in f:
            m = head_re.match(line)
            if not m: continue
            n_all += 1
            low = line.lower()
            if not KWRE.search(low): continue
            n_match += 1
            rest = m.group(2)
            c = cat_re.search(rest[:300]); cat = c.group(1) if c else '?'
            cats[cat] = cats.get(cat, 0) + 1
            k = rest.find('summary:')
            summ = read_literal(rest[k + 8:k + 8 + 1500]) if k >= 0 else None
            st = st_re.search(rest)
            body = cat + ' | ' + (summ or '(no summary literal)')
            if st: body += ' | status: ' + st.group(1)
            items.append((cat, '[impr:%s]' % m.group(1), body, bool(summ and KWRE.search(summ.lower()))))
    del line
    # research-bearing categories first: drop interface-only categories, then entries whose summary itself lacks a keyword
    UI = {'ux', 'visual', 'performance', 'bug', 'meta', 'a11y', 'accessibility', 'style', 'refactor', 'test', 'infra', 'docs'}
    kept = [(t, b) for c, t, b, s in items if c not in UI and s]
    dropped_extra = ''
    if sum(blen(t, b) for t, b in kept) > CAP:
        UI |= {'content', 'feature'}; dropped_extra = ' (content/feature page-copy entries also dropped to fit)'
        kept = [(t, b) for c, t, b, s in items if c not in UI and s]
    out, note = fit(kept, CAP - 900, minlen=150)
    note += dropped_extra
    catline = ', '.join('%s=%d' % kv for kv in sorted(cats.items(), key=lambda kv: -kv[1])[:14])
    write_chunk('07_improvements_log.txt',
                'src/data/improvements.js (streamed as text). %d entries; %d match the RH keyword list anywhere in the entry; %d kept after dropping interface categories (%s) and entries whose summary has no keyword; %d written. Entries have no title/status fields: line = [impr:<id>] category | summary. Category counts among matches: %s'
                % (n_all, n_match, len(kept), ','.join(sorted(UI)), len(out), catline),
                out, 'src/data/improvements.js: id, category and summary of RH-keyword entries (%d of %d entries written)' % (len(out), n_all), note)

# ---------------------------------------------------------------- 8 DAG / roadmap modules
DAG_FILES = ['rh-dag.js', 'rh-landscape-dag.js', 'insight-dag.js', 'program-dag.js', 'project-attempts-dag.js',
             'frontier-dag.js', 'lambda-roadmap.js', 'research-routes-roadmap.js',
             'rh-novel-routes-roadmap-2026-09-23.js', 'concepts-registry.js']
R_ID = re.compile(r'^\s*(?:Object\.freeze\()?\{?\s*(?:id|key)\s*:\s*[\'"`]?([\w\-.:/§]+)')
R_CALL = re.compile(r'^\s*([A-Za-z_]\w{0,7})\(\s*[\'"`]([^\'"`]+)[\'"`]')
R_NUM = re.compile(r'^\s*(\d+)\s*:\s*(?:Object\.freeze\()?\{')
R_EXP = re.compile(r'^(?:export\s+)?const\s+(\w+)\s*=')
R_FUNC = re.compile(r'^(?:export\s+)?(?:async\s+)?function\b')
R_EDGE = re.compile(r'^\s*(dependsOn|deps|parents|children|requires|from|to|edges|unlocks|blocks|feeds|prerequisites|related|closesIf|needs|inputs|outputs|target|source)\s*:')
R_NOISE = re.compile(r'^\s*(commit|tree|sha\w*|manifestSha256|timestamp|repositoryVisibility|peerReviewed|published|accepted|established|countsAs\w+|claimedUnconditional|tag)\s*:')
R_E1 = re.compile(r"^\s*\[\s*'([^']+)'\s*,\s*'([^']+)'(?:\s*,\s*'([^']+)')?")
R_E2 = re.compile(r"^\s*\{\s*(?:from|source)\s*:\s*'([^']+)'\s*,\s*(?:to|target)\s*:\s*'([^']+)'(?:\s*,\s*\w+\s*:\s*'([^']+)')?")
R_E3 = re.compile(r"^\s*(?:e|E|edge)\(\s*'([^']+)'\s*,\s*'([^']+)'(?:\s*,\s*'([^']+)')?")
def dag_records(fname):
    lines = read_lines(ROOT + '/src/data/' + fname)
    base = fname[:-3]; recs = []; cur = None; skipping = False; section = ''
    edges = {}; nedges = 0
    def close():
        nonlocal cur
        if cur:
            rid, first, edges, rest = cur
            body = clean(' '.join([first] + edges + rest))
            body = body.replace('Object.freeze(', '')
            body = re.sub(r"^\{?\s*(?:id|key)\s*:\s*['\"`]?[\w\-.:/]+['\"`]?\s*,?\s*", '', body)
            body = re.sub(r"^[A-Za-z_]\w{0,7}\(\s*['\"`][^'\"`]+['\"`]\s*,\s*", '', body)
            body = re.sub(r"^\d+\s*:\s*\{?\s*", '', body)
            if len(body) > 12: recs.append(('[dag:%s#%s]' % (base, rid), body))
        cur = None
    for ln in lines:
        s = ln.strip()
        if not s or s.startswith('//') or s.startswith('*') or s.startswith('/*'): continue
        if s.startswith('import '): continue
        m = R_EXP.match(ln)
        if m:
            close(); section = m.group(1)
            skipping = bool(re.search(r'ASSERT|TRIPWIRE|CHECK', section, re.I))
            if not skipping and not re.search(r'=>|new Set|new Map|\(\(\)', s): cur = ('§' + section, s, [], [])
            continue
        if R_FUNC.match(ln):
            close(); skipping = True; continue
        if skipping: continue
        me = R_E1.match(ln) or R_E2.match(ln) or R_E3.match(ln)
        if me:
            edges.setdefault(me.group(1), []).append(me.group(2) + (' (%s)' % me.group(3) if me.group(3) else ''))
            nedges += 1; continue
        if re.match(r'^[\]\[\}\{\)\(;,\s]*$', s): continue
        if R_NOISE.match(ln): continue
        m = R_ID.match(ln) or R_NUM.match(ln)
        m2 = None if m else R_CALL.match(ln)
        if m:
            close(); cur = (m.group(1), s, [], []); continue
        if m2 and m2.group(1) not in ('R', 'require', 'String', 'Number', 'parseInt'):
            close(); cur = (m2.group(2)[:60].replace(' ', '_'), s, [], []); continue
        if cur is None: cur = ('§top', s, [], []); continue
        if R_EDGE.match(ln): cur[2].append(s)
        else: cur[3].append(s)
    close()
    # edges grouped by source node, several sources per line
    line = []; size = 0; erecs = []
    for a, bs in edges.items():
        part = '%s -> %s' % (a, ', '.join(bs))
        if size + len(part) > 900 and line:
            erecs.append(('[dag:%s#edges]' % base, ' ;; '.join(line))); line = []; size = 0
        line.append(part); size += len(part)
    if line: erecs.append(('[dag:%s#edges]' % base, ' ;; '.join(line)))
    DAG_EDGE_COUNT[base] = nedges
    return recs + erecs

DAG_EDGE_COUNT = {}
def build_dags():
    groups = [dag_records(f) for f in DAG_FILES]
    counts = ', '.join('%s=%d (+%d edges)' % (f[:-3], sum(1 for t, _ in g if not t.endswith('#edges]')), DAG_EDGE_COUNT.get(f[:-3], 0)) for f, g in zip(DAG_FILES, groups))
    W = {'project-attempts-dag.js': 2.0, 'frontier-dag.js': 2.0, 'research-routes-roadmap.js': 2.0,
         'rh-novel-routes-roadmap-2026-09-23.js': 2.5, 'program-dag.js': 1.6, 'lambda-roadmap.js': 1.4,
         'rh-dag.js': 1.2, 'insight-dag.js': 1.0, 'rh-landscape-dag.js': 1.0, 'concepts-registry.js': 0.8}
    flat = []; ws = []
    for f, g in zip(DAG_FILES, groups):
        for it in g: flat.append(it); ws.append(1000 if it[0].endswith('#edges]') else W[f])
    os.makedirs(OUT + '/full', exist_ok=True)
    with open(OUT + '/full/dags_full.txt', 'w', encoding='utf-8') as f:
        f.write('# Longer lookup (not one of the 14 chunks): every DAG/roadmap record of chunk 08 without shortening.\n')
        for t, b in flat: f.write(t + ' ' + b + '\n')
    items, note = fit_weighted(flat, ws, CAP - 1100, minlen=60)
    note += '; unshortened records in index/full/dags_full.txt'
    write_chunk('08_dags_roadmaps.txt',
                'DAG and roadmap modules in src/data, parsed as text. One line per record: [dag:<module>#<node id>] first line, then edge fields (dependsOn/from/to/...), then remaining fields (the leading id is in the tag). All records kept; bodies cut to a common length times a module weight (project-attempts, frontier, routes roadmaps longest). Helper-call rows keep source order of arguments (id, group/kind, status, title, description, source). #§NAME = start of a top-level constant. #edges lines list edges in full, grouped by source node: a -> b (type), c (type) ;; d -> e. Records per module: ' + counts,
                items, 'DAG/roadmap modules (rh-dag, rh-landscape-dag, insight-dag, program-dag, project-attempts-dag, frontier-dag, lambda-roadmap, research-routes-roadmap, rh-novel-routes-roadmap, concepts-registry): node ids, titles, statuses, edges', note)

# ---------------------------------------------------------------- 9 fifty routes
def build_routes():
    items = []
    for p in sorted(glob.glob(ROOT + '/formalization/routes/*.md')):
        tag = '[routes-md:%s]' % os.path.basename(p)
        for ln in read_lines(p):
            if ln.strip(): items.append((tag, ln.rstrip()))
    used = sum(blen(t, b) for t, b in items)
    rfiles = glob.glob(ROOT + '/src/data/route-*.js')
    def rk(p):
        m = re.match(r'route-(\d+)', os.path.basename(p)); return (int(m.group(1)) if m else 999, p)
    rfiles.sort(key=rk)
    rl = []
    for p in rfiles:
        lines = read_lines(p, 400)
        doc = lead_comment(lines, 2400)
        rl.append(('[route:%s]' % os.path.basename(p)[:-3], doc or '(no leading comment)'))
    rl, note = fit(rl, CAP - 500 - used, minlen=200)
    write_chunk('09_fifty_routes.txt',
                'The fifty routes: formalization/routes/*.md in full (blank lines removed), then one line per src/data/route-*.js (leading doc comment: route number, what was run, PROVED/MEASURED/verdict text).',
                items + rl, 'formalization/routes/*.md in full + one line per src/data/route-*.js (%d modules)' % len(rfiles), note)

# ---------------------------------------------------------------- 10 formalization
PRUNE = {'.lake', '.venv', 'node_modules', '.git', '__pycache__', 'site-packages'}
def walk(top, exts):
    for d, dirs, files in os.walk(top):
        dirs[:] = sorted(x for x in dirs if x not in PRUNE)
        for f in sorted(files):
            if f.endswith(exts): yield os.path.join(d, f)

def build_formalization():
    top = ROOT + '/formalization'
    groups = []; nmd = 0; skipped = 0
    for p in walk(top, ('.md',)):
        rel = os.path.relpath(p, top)
        if rel.startswith('review-packet-sub0145/inputs/') or rel.startswith('review-packet-sub0145/work/'):
            skipped += 1; continue      # copies of files indexed at their primary path
        nmd += 1
        g = [('[form:%s]' % rel, x) for x in md_outline(read_lines(p), para_len=300)]
        if g: groups.append(g)
    # more room for the directories named in the task
    def weight(g):
        r = g[0][0]
        return 3 if ('rh-attempts/' in r or 'routes/' in r or 'ENTIRE_ROADMAP' in r or 'POLYNOMIAL_DE_BRUIJN' in r) else (2 if 'paper/' in r else 1)
    LEAN_BUDGET = 38_000
    md_items, mnote = fit_groups_outline(groups, CAP - 1000 - LEAN_BUDGET, floor=150, weights=[weight(g) for g in groups])
    R_THM = re.compile(r'^\s*(?:@\[[^\]]*\]\s*)?(?:(?:private|protected|noncomputable)\s+)*(theorem|lemma)\s+([^\s:({\[]+)')
    bydir = {}; nthm = 0; nlean = 0
    for p in walk(top, ('.lean',)):
        names = []
        for ln in read_lines(p):
            m = R_THM.match(ln)
            if m: names.append(m.group(2))
        nlean += 1
        if names:
            nthm += len(names)
            rel = os.path.relpath(p, top)
            bydir.setdefault(os.path.dirname(rel), []).append('%s(%d): %s' % (os.path.basename(rel)[:-5], len(names), ', '.join(names)))
    lean = [('[lean:%s/]' % d, ' ;; '.join(v)) for d, v in sorted(bydir.items())]
    lean, lnote = fit(lean, LEAN_BUDGET, minlen=200)
    write_chunk('10_formalization.txt',
                'formalization/: for each of %d .md files, lines "heading :: first paragraph" ([form:<path under formalization/>]; rh-attempts, routes, roadmap files and paper/ get more room); then theorem/lemma names from %d .lean files (%d names; one line per directory: [lean:<dir>/] File(count): names ;; File(count): names). Skipped: .lake/.venv trees and %d duplicate copies under review-packet-sub0145/{inputs,work}.'
                % (nmd, nlean, nthm, skipped),
                md_items + lean, 'formalization/: headings + first paragraphs of %d .md files (paper, rh-attempts, routes, review packets, ENTIRE_ROADMAP, POLYNOMIAL_DE_BRUIJN, ...) and %d theorem/lemma names from %d Lean files' % (nmd, nthm, nlean),
                'md: ' + (mnote or 'complete') + '; lean: ' + (lnote or 'all names listed'))

# ---------------------------------------------------------------- 11 pages
def build_pages():
    R_T = [re.compile(r'<(?:EditorialHeader|PageHeader|PostLayout|PageShell|Header)[^>]*?\btitle=\{?\s*["\'`]([^"\'`]{3,160})'),
           re.compile(r'\btitle=\{?\s*["\'`]([^"\'`]{3,160})'),
           re.compile(r'<h1[^>]*>\s*([^<{]{3,160})'),
           re.compile(r'document\.title\s*=\s*["\'`]([^"\'`]{3,160})'),
           re.compile(r'\b(?:title|TITLE|heading)\s*[:=]\s*["\'`]([^"\'`]{3,160})')]
    R_SUB = re.compile(r'\b(?:subtitle|dek|kicker|description|lede|tagline)\s*[:=]\s*\{?\s*["\'`]([^"\'`]{8,300})')
    items = []
    files = sorted(os.listdir(ROOT + '/src/pages'))
    for fn in files:
        p = ROOT + '/src/pages/' + fn
        if not os.path.isfile(p) or not fn.endswith(('.jsx', '.js', '.tsx', '.mdx')): continue
        lines = read_lines(p, 900)
        title = None
        for r in R_T:
            for ln in lines:
                m = r.search(ln)
                if m: title = clean(m.group(1)); break
            if title: break
        if not title:   # h1 with text on the next line
            for i, ln in enumerate(lines[:-1]):
                if re.search(r'<h1[^>]*>\s*$', ln):
                    t = clean(re.sub(r'<[^>]+>|\{[^}]*\}', ' ', lines[i + 1]))
                    if len(t) >= 3: title = t; break
        sub = None
        for ln in lines:
            m = R_SUB.search(ln)
            if m: sub = clean(m.group(1)); break
        doc = lead_comment(lines, 520)
        body = 'title: ' + (title or '(none found)')
        if sub: body += ' | ' + sub
        if doc: body += ' | doc: ' + doc
        items.append(('[page:%s]' % os.path.splitext(fn)[0], body))
    n = len(items)
    items, note = fit(items, CAP - 500, minlen=90)
    write_chunk('11_pages.txt',
                'src/pages: %d page components. Line: [page:<component file>] title: first title/heading string | subtitle/description string if any | doc: leading comment of the file.' % n,
                items, 'src/pages: %d page components with first title/heading string, subtitle and leading comment (user-facing statement of each concept/visualization)' % n, note)

# ---------------------------------------------------------------- 12 open PRs
def build_prs():
    titles = {}
    try:
        r = subprocess.run(['gh', 'pr', 'list', '--state', 'all', '--limit', '200', '--json', 'number,title,state'],
                           cwd=ROOT, capture_output=True, timeout=40)
        for e in json.loads(r.stdout.decode() or '[]'): titles[e['number']] = (e['title'], e['state'])
    except Exception:
        pass
    rc, base_ref = git('rev-parse', '--verify', '-q', 'origin/main')
    base_ref = 'origin/main' if rc == 0 else 'main'
    ATLAS = 'research/rh/modules/historical-routes.md'
    atlas_items = []; groups = []; missing = []; fetched = []
    for n in range(6, 58):
        ref = 'refs/pr/%d' % n
        rc, _ = git('rev-parse', '--verify', '-q', ref)
        if rc != 0 and not NO_FETCH:
            rc2, _ = git('fetch', '--no-tags', 'origin', 'pull/%d/head:%s' % (n, ref), timeout=90)
            rc, _ = git('rev-parse', '--verify', '-q', ref)
            if rc == 0: fetched.append(n)
        tag = '[pr:%d]' % n
        ti = titles.get(n)
        if rc != 0:
            missing.append(n)
            groups.append([(tag, 'ref not available locally (fetch failed or PR number unused)' + ((' | title: %s | state: %s' % ti) if ti else ''))])
            continue
        _, subj = git('log', '-1', '--format=%s (%ad)', '--date=short', ref)
        _, mb = git('merge-base', base_ref, ref); mb = mb.strip() or base_ref
        _, ns = git('diff', '--numstat', '--no-renames', mb, ref, timeout=180)
        rows = []
        for ln in ns.splitlines():
            a = ln.split('\t')
            if len(a) == 3: rows.append((int(a[0]) if a[0].isdigit() else 0, int(a[1]) if a[1].isdigit() else 0, a[2]))
        add = sum(r[0] for r in rows); dele = sum(r[1] for r in rows)
        g = [(tag, 'title: %s | state: %s | tip: %s | diff vs merge-base with %s: %d files, +%d -%d'
              % (ti[0] if ti else '(gh title unavailable)', ti[1] if ti else '?', trunc(clean(subj), 110), base_ref, len(rows), add, dele))]
        dirs = {}
        for a, d, f in rows:
            k = '/'.join(f.split('/')[:3]); dirs[k] = dirs.get(k, 0) + 1
        g.append((tag, 'dirs: ' + ', '.join('%s(%d)' % kv for kv in sorted(dirs.items(), key=lambda kv: -kv[1])[:6])))
        top = sorted(rows, key=lambda r: -r[0])[:6]
        g.append((tag, 'largest files: ' + ', '.join('%s(+%d)' % (f, a) for a, d, f in top)))
        mds = [r for r in rows if r[2].endswith('.md') and r[0] > 0]
        def prio(r):
            f = r[2].lower(); s = r[0]
            if re.search(r'result|synthesis|readme|summary|verdict|referee|status|obstruction|roadmap|modules/', f): s += 100000
            return -s
        mds.sort(key=prio)
        for a, d, f in mds[:10]:
            rc3, txt = git('show', '%s:%s' % (ref, f), timeout=60)
            if rc3 != 0 or not txt: continue
            lines = txt.splitlines()
            if n == 27 and f == ATLAS:
                atlas_items = [('[pr:27:atlas]', x.rstrip()) for x in lines if x.strip()]
                continue
            for x in md_outline(lines[:6000], para_len=420, claims_only=True, max_items=40):
                g.append(('[pr:%d:%s]' % (n, f), x))
        if len(mds) > 10: g.append((tag, '%d further .md files not outlined' % (len(mds) - 10)))
        groups.append(g)
    if not atlas_items:
        rc3, txt = git('show', 'refs/pr/27:' + ATLAS)
        if rc3 == 0: atlas_items = [('[pr:27:atlas]', x.rstrip()) for x in txt.splitlines() if x.strip()]
    atlas_items = head(atlas_items, 60_000, '[pr:27:atlas]', 'git show refs/pr/27:' + ATLAS)
    used = sum(blen(t, b) for t, b in atlas_items)
    groups = [[(t, trunc(b, 420)) if t.count(':') == 1 else (t, b) for t, b in g] for g in groups]
    items, note = fit_groups_outline(groups, CAP - 1300 - used, floor=170)
    write_chunk('12_open_prs.txt',
                'PRs 6-57 read through git refs/pr/N (text only). Per PR: [pr:N] title/state (from gh if reachable), tip commit, diff size vs merge-base, directories, largest files; then [pr:N:<path>] "heading :: paragraph" for result/claim/verdict/status sections of up to 10 main .md files (other headings listed without body). The route atlas research/rh/modules/historical-routes.md of PR 27 is included in full as [pr:27:atlas] at the top. Refs fetched this run: %s. Not available: %s.'
                % (fetched or 'none', missing or 'none'),
                atlas_items + items, 'PRs 6-57: route atlas (PR 27 historical-routes.md) in full; per PR title, diff stat, and result/claim sections of main .md files (%d PR refs read, %d unavailable)' % (52 - len(missing), len(missing)), note)

# ---------------------------------------------------------------- 13 renderer + sibling repos
def build_repos():
    zv = GH + '/zeta-view'
    zgroups = []
    mdfiles = [zv + '/README.md'] + sorted(glob.glob(zv + '/docs/*.md'))
    for p in mdfiles:
        rel = os.path.relpath(p, zv)
        g = [('[zv:%s]' % rel, x) for x in md_outline(read_lines(p), para_len=900)]
        if g: zgroups.append(g)
    listing = []
    for sub in ('scripts', 'scripts/experiments', 'tests', 'dist', 'docs'):
        d = zv + '/' + sub
        if os.path.isdir(d):
            names = sorted(x for x in os.listdir(d) if not x.startswith('.'))
            listing.append(('[zv:%s/]' % sub, 'files (%d): ' % len(names) + ', '.join(names[:140])))
    exp = []
    for p in walk(zv + '/scripts', ('.mjs', '.js', '.py', '.md')):
        rel = os.path.relpath(p, zv); lines = read_lines(p, 200)
        if p.endswith('.md'):
            for x in md_outline(lines, para_len=300, max_items=12): exp.append(('[zv:%s]' % rel, x))
        else:
            doc = lead_comment(lines, 500)
            if not doc and lines and lines[0].startswith('#!') : doc = lead_comment(lines[1:], 500)
            if not doc:   # python docstring
                j = ' '.join(lines[:30]); m = re.search(r'"""(.*?)"""', j, re.S)
                doc = trunc(clean(m.group(1)), 500) if m else ''
            exp.append(('[zv:%s]' % rel, doc or '(no leading comment)'))
    zgroups.append(exp)
    ZV_BUDGET = 120_000
    zitems, znote = fit_groups_outline(zgroups, ZV_BUDGET - sum(blen(t, b) for t, b in listing), floor=200)
    # sibling repos: README + top-level .md (and docs/*.md); identical files across worktrees indexed once
    seen = {}; sgroups = []; dup = []; seen_base = {}
    repos = sorted(glob.glob(GH + '/dbn-lambda-*')) + [GH + '/morethan2-3rd']
    for r in repos:
        if not os.path.isdir(r): continue
        name = os.path.basename(r)
        files = sorted(glob.glob(r + '/*.md'), key=lambda p: (os.path.basename(p) != 'README.md', p))
        files += sorted(glob.glob(r + '/docs/*.md')) + sorted(glob.glob(r + '/research/*.md'))
        tops = sorted(x for x in os.listdir(r) if not x.startswith('.'))
        sgroups.append([('[sib:%s/]' % name, 'top level: ' + ', '.join(tops[:60]))])
        same = []
        for p in files:
            try:
                with open(p, 'rb') as f: h = hashlib.sha1(f.read()).hexdigest()
            except OSError: continue
            rel = name + '/' + os.path.relpath(p, r)
            if h in seen: same.append('%s = %s' % (os.path.relpath(p, r), seen[h])); continue
            seen[h] = rel
            bn = os.path.relpath(p, r)
            if name.startswith('dbn-lambda-') and bn != 'README.md' and bn in seen_base:
                same.append('%s differs from %s (variant not outlined)' % (bn, seen_base[bn])); continue
            if name.startswith('dbn-lambda-'): seen_base[bn] = rel
            g = [('[sib:%s]' % rel, x) for x in md_outline(read_lines(p), para_len=300, max_items=30)]
            if g: sgroups.append(g)
        if same: dup.append(('[sib:%s/]' % name, 'not outlined again (same file name already indexed from an earlier dbn-lambda worktree): ' + '; '.join(same)))
    dups, _ = fit(dup, 6000, minlen=200)
    used = sum(blen(t, b) for t, b in listing + zitems + dups)
    sitems, snote = fit_groups_outline(sgroups, CAP - 1200 - used, floor=150)
    write_chunk('13_renderer_and_sibling_repos.txt',
                'Renderer repo zeta-view: README and docs/*.md as "heading :: first paragraph" ([zv:<path>]), file lists, and leading comments of scripts/ and scripts/experiments. Then sibling repos dbn-lambda-* and morethan2-3rd: top-level listing, README and top-level/docs .md outlines ([sib:<repo>/<path>]); a file name that recurs across the dbn-lambda worktrees is outlined once (first repo in name order) and later copies are listed as identical or differing.',
                listing + zitems + sitems + dups, 'zeta-view (README, docs, scripts/experiments, file lists) + sibling repos dbn-lambda-* and morethan2-3rd (README and top-level docs)', '; '.join(x for x in (znote, snote) if x))

# ---------------------------------------------------------------- 14 memory notes
def build_memory():
    files = sorted(glob.glob(MEM + '/*.md'), key=lambda p: (os.path.basename(p) != 'MEMORY.md', p))
    groups = []; total = 0
    for p in files:
        tag = '[mem:%s]' % os.path.basename(p)
        g = [(tag, ln.rstrip()) for ln in read_lines(p) if ln.strip() and not re.match(r'^(---|\s*(modified|created|updated|originSessionId)\s*:.*)$', ln.strip())]
        total += sum(blen(t, b) for t, b in g)
        groups.append((p, g))
    needs = [sum(blen(t, b) for t, b in g) for _, g in groups]
    budgets = waterfill(needs[1:], CAP - 700 - needs[0]) if len(needs) > 1 else []
    items = list(groups[0][1]) if groups else []
    ncut = 0
    for (p, g), n, b in zip(groups[1:], needs[1:], budgets):
        if n > b: ncut += 1
        items.extend(head(g, b, g[0][0] if g else '[mem]', p))
    write_chunk('14_memory_notes.txt',
                'Memory notes %s/*.md (%d files, %d bytes of non-blank lines). MEMORY.md (the index) in full; every other note from its first line (frontmatter description first) up to a common per-file byte limit; %d notes end with a truncation marker giving the path of the full file.' % (MEM, len(files), total, ncut),
                items, 'memory notes (%d files): MEMORY.md index in full, each topic note from its start up to a common per-file limit (%d notes truncated with a marker)' % (len(files), ncut),
                '%d of %d notes truncated (source is %d bytes, cap %d)' % (ncut, len(files), total, CAP) if ncut else 'in full')

# ---------------------------------------------------------------- main
def main():
    os.makedirs(OUT, exist_ok=True)
    steps = [build_imp, build_improvements, build_dags, build_routes, build_formalization,
             build_pages, build_prs, build_repos, build_memory]
    only = [a for a in sys.argv[1:] if not a.startswith('--')]
    for s in steps:
        if only and s.__name__[6:] not in only: continue
        s()
    with open(OUT + '/MANIFEST.md', 'w', encoding='utf-8') as f:
        f.write('# Corpus index manifest\n\nBuilt by tmp/research-2026-11-16/engine/build_index.py (text processing only; no JS imported or run).\n'
                'Every line of a chunk starts with a source tag in square brackets; cite the tag.\n\n')
        for path, size, n, covers, note in MANIFEST:
            f.write('- `%s` (%d bytes, %d lines): %s.%s\n' % (os.path.relpath(path, ENGINE), size, n, covers, (' Note: ' + note + '.') if note else ''))
        f.write('- `index/full/imp_modules_600.txt`: longer lookup (not a chunk), every imp module at up to 600 characters.\n')
        f.write('- `index/full/dags_full.txt`: longer lookup (not a chunk), every DAG/roadmap record unshortened.\n')
    over = [m for m in MANIFEST if m[1] > 190_000]
    print('chunks written: %d; over 190 KB: %d' % (len(MANIFEST), len(over)))

if __name__ == '__main__':
    main()
