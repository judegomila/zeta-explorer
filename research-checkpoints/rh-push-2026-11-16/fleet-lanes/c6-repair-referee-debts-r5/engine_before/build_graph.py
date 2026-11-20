#!/usr/bin/env python3
"""build_graph.py: merge the node files into IDEA_GRAPH.json.

Inputs (all read as text/JSON; nothing from the repo is imported or executed):
  nodes/nodes-*.json          node records written by the corpus readers
  ../push/OBSTRUCTION_MAP.md  controls, obstruction rows, positive list, uncovered items
  ../push/SYNTHESIS*.md       extra obstruction rows (tables whose first header cell is '#')
  underused.json              ids flagged by readers as under-used (optional)
  outcomes.json               results of attacks launched from this engine (optional)

Output: IDEA_GRAPH.json  {meta, nodes, edges}

Run:  python3 build_graph.py
Standard library only. Memory: a few tens of MB.
"""
import glob
import json
import math
import os
import re
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
PUSH = os.path.normpath(os.path.join(HERE, '..', 'push'))
OUT = os.path.join(HERE, 'IDEA_GRAPH.json')

MERGE_COS = 0.69      # cosine above which two node records are treated as one node
RESTATE_COS = 0.50    # cosine above which a 'restates' edge is added
COMPOSE_TOP = 10      # composes-with edges kept per node

# ----------------------------------------------------------------------------- tags
TAG_ALIAS = {
    'dyson-flow': 'heat-flow', 'zero-dynamics': 'heat-flow', 'control-dh': 'control',
    'von-mangoldt': 'euler-product', 'mv-cap': 'mean-value', 'vasyunin': 'nyman-beurling',
    'bettin-conrey': 'cotangent-sum', 'gram-matrix': 'gram', 'hardy-space': 'de-branges',
    'paley-wiener': 'de-branges', 'zero-density': 'density', 'gue': 'pair-correlation',
    'schur-complement': 'pick', 'fejer-riesz': 'toeplitz', 'beurling-selberg': 'explicit-formula',
    'liouville': 'moebius', 'mertens': 'euler-product', 'interval-arithmetic': 'certificate',
    'dual-certificate': 'certificate', 'lp-duality': 'certificate', 'modular': 'theta',
    'real-rooted': 'jensen', 'laguerre': 'jensen', 'krein': 'de-branges',
}
TAG_DROP = {'tool', 'numerics', 'model-diagnostic', 'dependency', 'conditioning'}

# keyword -> tag, used for text that has no reader-assigned tags (map rows) and to
# add missing tags to reader nodes (kept separately in 'tagsInferred').
KEYTAGS = [
    (r'\bpick\b|nevanlinna|carath', 'pick'), (r'\bweil\b', 'weil'),
    (r'heat|de bruijn|backward flow|dyson|calogero|H_t\b', 'heat-flow'),
    (r'\bLambda\s*(<=|<|>=|bound|cert)|newman|floor-only', 'lambda'),
    (r'euler product|prime chain|multiplicativ|von mangoldt|Lambda\(n\)|prime side', 'euler-product'),
    (r'hecke', 'hecke'), (r'theta', 'theta'), (r'toeplitz', 'toeplitz'),
    (r'lee-yang|ferromagnet', 'lee-yang'), (r'sieve', 'large-sieve'), (r'mollif', 'mollifier'),
    (r'zero-free|7/8|half-plane|TRO6|abscissa', 'zero-free'),
    (r'pair correlation|montgomery|GUE|number variance', 'pair-correlation'),
    (r'nyman|baez|vasyunin', 'nyman-beurling'),
    (r'de branges|canonical system|krein|hermite-biehler', 'de-branges'),
    (r'function field|F_q|frobenius', 'function-field'),
    (r'klein', 'klein'), (r'\btorus\b|bohr', 'torus'), (r'twistor', 'twistor'),
    (r'spinor|spin\b', 'spinor'), (r'metaplectic|double cover|kubota', 'metaplectic'),
    (r'landau', 'landau'), (r'mean[- ]value|mean square|MV-CAP|moment', 'mean-value'),
    (r'antibridge', 'antibridge'), (r'\bbridge\b', 'bridge'),
    (r'trace formula|selberg|connes', 'trace-formula'), (r'hodge|intersection form', 'hodge'),
    (r'\bLi coefficient|keiper', 'li'), (r'jensen|hyperbolic', 'jensen'),
    (r'suzuki|screw', 'suzuki-screw'), (r'hankel|nehari|causal', 'hankel'),
    (r'transfer operator|mayer', 'transfer-operator'), (r'explicit formula', 'explicit-formula'),
    (r'shear', 'shear'), (r'ladder', 'twin-ladder'), (r'verified height|platt', 'verified-height'),
    (r'zero channel|vortex', 'zero-channel'), (r'eisenstein|maass|automorphic|rankin', 'automorphic'),
    (r'passive|cascade|lossless', 'passive'), (r'schur', 'pick'),
    (r'density|proportion', 'density'), (r'moebius|mobius', 'moebius'),
]
KEYTAGS = [(re.compile(p, re.I), t) for p, t in KEYTAGS]

# ----------------------------------------------------------------------------- controls
# Canonical controls. Rows DH..B are also parsed from the map; this table fixes
# ids, the property each control lacks, and the keywords used to link reader nodes.
CONTROLS = {
    'DH': dict(name='Davenport-Heilbronn function',
               lacks='Euler product (first defect at n = 6), Lambda >= 0',
               has='functional equation, positive even theta kernel',
               kills='anything using only the functional equation and kernel-side positivity',
               kw=r'davenport|\bDH\b'),
    'HEAT': dict(name='backward heat family e^{tau u^2/16} kappa, tau < 0',
                 lacks='any fixed-gamma ordinary Dirichlet series',
                 has='evenness, order one, every kernel-side positivity input',
                 kills='every flow-stable hypothesis',
                 kw=r'backward heat|\bHEAT\b|flow-blind'),
    'TW+': dict(name='sign twist Lambda(n) -> eps_n Lambda(n), 0 <= eps_n <= 1',
                lacks='functional equation', has='Lambda >= 0, size, support, Euler product',
                kills='arguments using positivity, size or support of Lambda', kw=r'TW\+|sign[- ]twist'),
    'TW-': dict(name='signed twist Lambda(n) -> eps_n Lambda(n), |eps_n| <= 1',
                lacks='functional equation, Lambda >= 0', has='size, support, Euler product',
                kills='arguments using only |Lambda(n)| <= log n or mean values', kw=r'TW-|signed twist'),
    'EA': dict(name='E_a(s) = zeta(s+a) zeta(s-a)',
               lacks='size normalisation (local parameters p^{+-a})',
               has='Euler product, Lambda >= 0, functional equation',
               kills='anything from explicit formula + positivity + FE without size', kw=r'\bE_a\b|zeta\(s\+a\)'),
    'NR': dict(name='T-NR twin xi(s)(2 cosh((s-1/2) log q) + c), |c| > 2',
               lacks='temperedness at the single prime q',
               has='multiplicative coefficients, gamma factor, functional equation',
               kills='anything invariant under a local test-vector change at one prime', kw=r'T-NR|\bNR\b twin'),
    'B': dict(name='Beurling zeta', lacks='functional equation, integers',
              has='Euler product, Lambda >= 0, pole at 1',
              kills='prime positivity + pole without the functional equation', kw=r'beurling (zeta|system|prime)'),
    'U': dict(name='unimodular twist sum chi(n) n^{-s}, chi completely multiplicative, |chi| = 1',
              lacks='functional equation', has='complete multiplicativity, unimodular local parameters',
              kills='arguments using multiplicativity with unimodular parameters but not the functional equation',
              kw=r'unimodular twist'),
    'THW': dict(name='theta^w family (Lagarias-Rains) through zeta at w = 1',
                lacks='on-line zeros for w outside a window shrinking with height',
                has='functional equation, pole, positive kernel',
                kills='any condition open in the kernel at w = 1', kw=r'theta\^w|lagarias-rains'),
    'PA': dict(name='phase-rotated transfer operator (M -> e^{i phi} M, M -> -M)',
               lacks='the arithmetic normalisation of the operator',
               has='the same spaces, factorisations, norms and Krein form',
               kills='any property invariant under rotating the transfer operator', kw=r'phase[- ]rotat|sign-flipped operator'),
    # added after batch 1 (lanes e1-selberg-twist-control, e1-heegner-averaged-nb-span)
    'SEL': dict(name='twisted Selberg zeta Z_{Gamma(2)}(s, chi_{a,b}) (measured, not interval-certified)',
                lacks='the integers (additive structure), order one, finite degree, zeta\'s sign of the zero side',
                has='Euler product over primitive geodesics, functional equation s <-> 1-s, real exceptional zeros off the line',
                kills='anything using only an Euler product, a functional equation and a self-adjoint operator',
                kw=r'twisted selberg zeta|\bSEL\b'),
    'PERM': dict(name='block-permuted non-multiplicative Nyman-Beurling family',
                 lacks='multiplicativity', has='the same span dimension and coefficient sizes',
                 kills='distance or ratio statistics of Nyman-Beurling spans chosen by an arithmetic family',
                 kw=r'block-permuted'),
    # added in campaign round 3 (lane c3-repair-map-theorem-a; sources c2-euler-cone-fe-rigidity, map section 2 notes)
    'WT': dict(name='window translate zeta(s + i alpha_k), alpha_k = 2 pi k/log(T/2 pi); also L(s + i alpha, chi_5) at height T/5',
               lacks='the functional equation at all heights (it holds only inside one window, defect about (|alpha| H + alpha^2)/(2T))',
               has='Euler product with unimodular local parameters, zeta\'s functional equation in one window',
               kills='any argument whose functional-equation input is local to one window',
               kw=r'window[- ]translate|lattice (height )?translates?'),
    'FM': dict(name='finite modification: finitely many Euler factors changed, e.g. zeta(s)(1 - q^(b-s)) (zeros on Re s = b) or the T-NR twin',
               lacks='zeta\'s local factor at finitely many primes (and, except for T-NR, the functional equation)',
               has='every Euler factor at p > P_0, every tail property of the prime sequence, multiplicative coefficients',
               kills='any argument whose hypotheses do not change when finitely many local factors change (tail properties, limits in P)',
               kw=r'finite modification|finitely many (euler|local) factors|finite twist'),
    # built by lane c4-thin-twist-control-78 (refereed once; map section 2, row THIN). Status stays conjectural until
    # lane c5-thin-walk-replay re-reads the short-interval theorem the construction rests on (cited from memory).
    # Text replaced by c5-repair-engine-map-r4 (the proposed form had a double zero and exponent b; both were wrong).
    'THIN': dict(name='thin sign twist: eps completely multiplicative, -1 on a set S of primes with pi_S(x) = '
                      '(1/2) int_2^x t^(b-1) dt/log t + O(x^(b-eta)), +1 elsewhere; F = zeta(s)(s - b)W(s), 1/2 < b < 1',
                 lacks='periodicity of the coefficients modulo any ideal (hence the functional equation of every twist); Lambda >= 0',
                 has='complete multiplicativity, unimodular local parameters at every prime, ordinary Dirichlet series, '
                     'continuation past b, one simple pole at 1, eps(p) = 1 on primes of relative density one; simple zero at '
                     's = b (PROVED relative to a short-interval theorem cited from memory; numerics to 1e9, b = 0.9); partial '
                     'sums c x + O(x^(b+eps)) proved, measured exponent near b/2',
                 kills='any argument for a zero-free half-plane that uses the target only through multiplicativity, local '
                       'size, continuation and the pole; first unavailable step of the 7/8 proof: periodicity of the target '
                       'weight (Prop. 5.1 / Lemma 5.8), argued from hypotheses, not replayed',
                 kw=r'thin twist|thin sign twist|\bTHIN\b', status='conjectural'),
}
# Control-to-control and control-to-row edges stated in OBSTRUCTION_MAP.md section 2 (notes on use) and rows Q21, S12,
# which the keyword rules do not produce. (source, target, type, why). Added by c4-repair-map-engine-r3.
EXTRA_EDGES = [
    ('ctl-WT', 'ctl-U', 'special-case-of', 'WT is U with chi(n) = n^{-i alpha} at a lattice shift (map section 2)'),
    ('ctl-NR', 'ctl-FM', 'special-case-of', 'the T-NR twin is a finite modification that keeps the functional equation (map section 2)'),
    ('ctl-THIN', 'ctl-U', 'special-case-of', 'a real unimodular completely multiplicative twist (map section 2, row THIN)'),
    ('ctl-THIN', 'fam-helson-discrepancy-zerofree', 'control-defeats', 'thin twists carry real zeros right of the discrepancy exponent (measured); Theorem 1 holds for them'),
    ('ctl-WT', 'row-Q21', 'control-defeats', 'at fixed P the stage of U is a limit of height translates of zeta\'s stage (row Q21)'),
    ('ctl-WT', 'row-S12', 'control-defeats', 'height translate passes any fixed number of windows (row S12)'),
    ('ctl-WT', 'out-c2-euler-cone-fe-rigidity', 'control-defeats', 'lane that introduced the window translate'),
    ('ctl-WT', 'fam-fixed-window-count-rigidity', 'control-defeats', 'family closed by the height translate'),
    ('ctl-FM', 'fam-tail-generic-selector', 'control-defeats', 'finite modifications share the tail class of zeta'),
]
CONTROL_CODE_RE = re.compile(r'(?<![A-Za-z])(DH|HEAT|TW\+-|TW\+|TW-|TW|EA|NR|THW|THIN|PA|WT|FM|U|B)(?![A-Za-z_0-9(])')

# ----------------------------------------------------------------------------- roles
CROSSING_RE = re.compile(
    r'limit\b|compact|normal famil|montel|continuation|uniform in N|N-uniform|monoton|convex|'
    r'induct|closure|semicontinu|tightness|transport|propagat|hurwitz|bootstrap|maximum principle|'
    r'phragm|subharmonic|interpolat|completion|recurren|ergodic|equidistrib|kronecker|universality|'
    r'cofinal|all large|eventual', re.I)
SEPARATOR_RE = re.compile(
    r'(DH|davenport-heilbronn)[^.;]{0,60}(fails|violates|breaks|is detected|negative|does not)|'
    r'(fails|false|violated|breaks|detect\w*|distinguish\w*|separat\w*)[^.;]{0,60}(for|on|from|by)?[^.;]{0,20}(DH|davenport)|'
    r'fails for every (sign )?twist|no analogue for (DH|davenport)|uses? (the )?(euler product|multiplicativity) (in an essential|essentially)|'
    r'needs both|use both|both at height',
    re.I)
RH_EQUIV_RE = re.compile(r'\bRH iff\b|iff RH\b|equivalent to RH|RH is equivalent|is RH\b|<=> RH|RH-equivalent', re.I)
FEW_PRIMES_RE = re.compile(r'S ?= ?\{|semilocal|one-prime|p ?= ?2\b|\{inf, ?2|single prime|five primes|25 primes', re.I)
SURROGATE_RE = re.compile(r'E_trunc|E_flow|E_coll|surrogate|E\(N\)|sigma ?= ?E_coll', re.I)
# ---- curated crossing devices (c5-repair-engine-map-r4): curated/devices.json replaces the keyword role
# 'crossing'. CROSSING_RE is kept only to count how many nodes the old rule matched (meta.counts.crossingKeyword).
def load_devices():
    path = os.path.join(HERE, 'curated', 'devices.json')
    out = {}
    if os.path.exists(path):
        for d in json.load(open(path, encoding='utf-8')).get('devices', []):
            for nid in d['nodes']:
                out[nid] = dict(type=d['id'], state=d['state'], evidence=d.get('evidence', ''))
    return out


ROW_ID_RE = re.compile(r'\b([PGQSZFTLNA]\d{1,2})\b')

STATUS_RANK = {'proved': 5, 'certified': 4, 'measured': 3, 'conjectural': 2, 'closed': 1, 'refuted': 0}
WORD_RE = re.compile(r'[a-z][a-z0-9_]{2,}')
STOP = set('the and for with that this from are not all its has have any one two each only into than '
           'but can its been was were which when where both also over under per via'.split())


def norm_tag(t):
    t = re.sub(r'[\s_]+', '-', t.strip().lower())
    return TAG_ALIAS.get(t, t)


def infer_tags(text):
    return sorted({t for rx, t in KEYTAGS if rx.search(text)})


def tokens(text):
    return [w for w in WORD_RE.findall(text.lower()) if w not in STOP]


def source_kind(src):
    s = src.strip().lstrip('[')
    m = re.match(r'(imp|impr|form|route|pr|dag|page|mem|zv|sib|lean|routes-md)\b[:\-]', s)
    if m:
        k = m.group(1)
        return 'imp' if k.startswith('imp') else k
    if 'src/data/imp' in s:
        return 'imp'
    if 'OBSTRUCTION_MAP' in s:
        return 'map'
    return 'other'


def primary_imp(src):
    m = re.search(r'imp-\d+', src)
    return m.group(0) if m else None


# ----------------------------------------------------------------------------- load nodes
def load_reader_nodes():
    files = sorted(glob.glob(os.path.join(HERE, 'nodes', 'nodes-*.json')),
                   key=lambda p: int(re.search(r'nodes-(\d+)', p).group(1)))
    recs = []
    for f in files:
        try:
            data = json.load(open(f, encoding='utf-8'))
        except Exception as e:  # a reader may still be writing its file
            print(f'WARN: skipped {os.path.basename(f)}: {e}', file=sys.stderr)
            continue
        if isinstance(data, dict):
            data = data.get('nodes', [])
        chunk = os.path.basename(f)
        for n in data:
            if not isinstance(n, dict) or 'id' not in n:
                continue
            n = dict(n)
            n['_chunk'] = chunk
            recs.append(n)
    return recs, [os.path.basename(f) for f in files]


def merge_records(group):
    """Merge records that describe one node. Keep the longest statement, the best
    status, the union of tags and all provenance."""
    group = sorted(group, key=lambda n: (-len(n.get('statement', '')), n['id']))
    base = dict(group[0])
    ids = sorted({g['id'] for g in group})
    base['id'] = min(ids, key=lambda i: (i.startswith('mem-'), len(i), i))
    base['aliases'] = [i for i in ids if i != base['id']]
    base['provenance'] = [{'file': g['_chunk'], 'id': g['id'], 'source': g.get('source', '')} for g in group]
    base['source'] = '; '.join(dict.fromkeys(g.get('source', '') for g in group if g.get('source')))
    tags = []
    for g in group:
        tags += g.get('tags', [])
    base['tags'] = tags
    sts = [g.get('status', 'conjectural') for g in group]
    # a closed or refuted record wins: the filter must not lose it
    if 'refuted' in sts:
        base['status'] = 'refuted'
    elif 'closed' in sts:
        base['status'] = 'closed'
    else:
        base['status'] = max(sts, key=lambda s: STATUS_RANK.get(s, 2))
    for key in ('usesMultiplicativity', 'heightUniform'):
        vals = [g.get(key, 'unknown') for g in group]
        base[key] = 'yes' if 'yes' in vals and 'no' not in vals else ('no' if 'no' in vals and 'yes' not in vals
                                                                    else ('mixed' if 'yes' in vals else 'unknown'))
    for key in ('closedBy', 'obstructionRow'):
        vals = [g[key] for g in group if g.get(key)]
        if vals:
            base[key] = '; '.join(dict.fromkeys(vals))
    if any(g.get('type') == 'obstruction' for g in group):
        base['type'] = 'obstruction'
    base.pop('_chunk', None)
    return base


def tfidf_vectors(texts):
    df = Counter()
    toks = []
    for t in texts:
        tk = tokens(t)
        toks.append(tk)
        df.update(set(tk))
    n = len(texts)
    vecs = []
    for tk in toks:
        tf = Counter(tk)
        v = {w: (1 + math.log(c)) * math.log((n + 1) / (df[w] + 0.5)) for w, c in tf.items()}
        norm = math.sqrt(sum(x * x for x in v.values())) or 1.0
        vecs.append({w: x / norm for w, x in v.items()})
    return vecs, df


def similar_pairs(vecs, df, lo):
    """All pairs with cosine >= lo, through an inverted index on the rarer terms."""
    inv = defaultdict(list)
    for i, v in enumerate(vecs):
        for w in v:
            if df[w] <= 60:
                inv[w].append(i)
    acc = defaultdict(float)
    for w, lst in inv.items():
        for a in range(len(lst)):
            va = vecs[lst[a]][w]
            for b in range(a + 1, len(lst)):
                acc[(lst[a], lst[b])] += va * vecs[lst[b]][w]
    out = {}
    for (i, j), partial in acc.items():
        if partial < lo * 0.5:
            continue
        vi, vj = vecs[i], vecs[j]
        if len(vi) > len(vj):
            vi, vj = vj, vi
        c = sum(x * vj.get(w, 0.0) for w, x in vi.items())
        if c >= lo:
            out[(i, j)] = c
    return out


# ----------------------------------------------------------------------------- parse the map
def split_row(line):
    cells = [c.strip() for c in line.strip().strip('|').split('|')]
    return cells


def parse_tables(path):
    """Yield (section_heading, header_cells, [row_cells...]) for each markdown table."""
    heading = ''
    lines = open(path, encoding='utf-8').read().split('\n')
    i = 0
    while i < len(lines):
        ln = lines[i]
        if ln.startswith('#'):
            heading = ln.lstrip('#').strip()
        if ln.startswith('|') and i + 1 < len(lines) and re.match(r'^\|[\s:\-|]+\|?\s*$', lines[i + 1]):
            header = split_row(ln)
            rows = []
            i += 2
            while i < len(lines) and lines[i].startswith('|'):
                rows.append(split_row(lines[i]))
                i += 1
            yield heading, header, rows
            continue
        i += 1


def controls_in(text):
    out = []
    for m in CONTROL_CODE_RE.finditer(text):
        c = m.group(1)
        if c in ('TW', 'TW+-'):
            out += ['TW+', 'TW-']
        elif c in ('U', 'B'):
            # single letters: accept only as a list item (followed by comma, star, semicolon, end, or space+paren)
            tail = text[m.end():m.end() + 2]
            head = text[max(0, m.start() - 2):m.start()]
            if (tail[:1] in (',', '*', ';', '') or tail.strip() == '') and (head.strip() in ('', ',', ';') or head.endswith(', ')):
                out.append(c)
        else:
            out.append(c)
    return sorted(set(out))


def parse_map():
    rows, positives, opens = [], [], []
    seen = {}
    files = [os.path.join(PUSH, 'OBSTRUCTION_MAP.md')] + sorted(glob.glob(os.path.join(PUSH, 'SYNTHESIS*.md')))
    for path in files:
        if not os.path.exists(path):
            print(f'WARN: missing {path}', file=sys.stderr)
            continue
        fname = os.path.basename(path)
        for heading, header, trows in parse_tables(path):
            h0 = header[0].strip().lower() if header else ''
            if h0 not in ('#', 'row', 'row id'):
                continue
            hl = [h.lower() for h in header]

            def col(*names):
                for nm in names:
                    for k, h in enumerate(hl):
                        if nm in h:
                            return k
                return None
            c_route = col('route', 'mechanism')
            c_stop = col('where it stops', 'obstruction', 'stops', 'nature')
            c_status, c_def, c_src = col('status'), col('defeated', 'control'), col('source')
            for r in trows:
                rid = r[0].strip('* ')
                if not re.match(r'^([A-Z]{1,2}\d{1,2}[a-z]?|OBS-[A-Z\-]+)$', rid) or len(r) < 3:
                    continue
                get = lambda k: (r[k] if k is not None and k < len(r) else '')
                rec = dict(row=rid, route=get(c_route) or r[1], stops=get(c_stop) or (r[2] if len(r) > 2 else ''),
                           status=get(c_status), defeatedBy=get(c_def), src=get(c_src), file=fname, section=heading)
                if rid in seen:
                    # same row repeated in a synthesis: keep the map's version, note the other file
                    seen[rid].setdefault('alsoIn', []).append(fname)
                    continue
                seen[rid] = rec
                rows.append(rec)
    # positive list (section 4) and uncovered items (section 6) of the map
    path = os.path.join(PUSH, 'OBSTRUCTION_MAP.md')
    if os.path.exists(path):
        text = open(path, encoding='utf-8').read()
        m4 = re.search(r'\n## 4\. .*?\n(.*?)\n## 5\. ', text, re.S)
        if m4:
            group = ''
            for ln in m4.group(1).split('\n'):
                g = re.match(r'^\*\*(.+?)\*\*\s*$', ln)
                if g:
                    group = g.group(1)
                it = re.match(r'^(\d+)\. (.*)$', ln)
                if it:
                    positives.append(dict(n=int(it.group(1)), text=it.group(2), group=group))
        m6 = re.search(r'\n## 6\. .*?\n(.*?)\n## 7\. ', text, re.S)
        if m6:
            for ln in m6.group(1).split('\n'):
                it = re.match(r'^(\d+)\. \*\*(.+?)\*\* (.*)$', ln)
                if it:
                    opens.append(dict(n=int(it.group(1)), title=it.group(2).rstrip('.'), text=it.group(3)))
    return rows, positives, opens


# ----------------------------------------------------------------------------- main build
def main():
    recs, files = load_reader_nodes()
    if not recs:
        sys.exit('no node files found under nodes/')
    n_raw = len(recs)

    # 1. merge by id, then by meaning
    by_id = defaultdict(list)
    for r in recs:
        by_id[r['id']].append(r)
    groups = [g for _, g in sorted(by_id.items())]
    texts = [(g[0].get('name', '') + ' ') * 2 + max((x.get('statement', '') for x in g), key=len) for g in groups]
    vecs, df = tfidf_vectors(texts)
    sims = similar_pairs(vecs, df, RESTATE_COS)
    parent = list(range(len(groups)))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    merged_pairs = 0
    for (i, j), c in sims.items():
        ti = {x.get('type') for x in groups[i]}
        tj = {x.get('type') for x in groups[j]}
        wall_i, wall_j = 'obstruction' in ti, 'obstruction' in tj
        if c >= MERGE_COS and wall_i == wall_j:
            a, b = find(i), find(j)
            if a != b:
                parent[b] = a
                merged_pairs += 1
    comp = defaultdict(list)
    for i, g in enumerate(groups):
        comp[find(i)] += g
    nodes = [merge_records(g) for _, g in sorted(comp.items())]
    idx_of_group = {}
    id_alias = {}
    for n in nodes:
        for a in [n['id']] + n.get('aliases', []):
            id_alias[a] = n['id']
    for i, g in enumerate(groups):
        idx_of_group[i] = id_alias[g[0]['id']]

    # 2. normalise tags, derive roles
    under_path = os.path.join(HERE, 'underused.json')
    underused = {}
    if os.path.exists(under_path):
        for u in json.load(open(under_path, encoding='utf-8')):
            underused[id_alias.get(u['id'], u['id'])] = u.get('why', '')
        missing = [u for u in underused if u not in {n['id'] for n in nodes}]
        if missing:
            print('WARN: underused ids not found: ' + ', '.join(missing), file=sys.stderr)

    for n in nodes:
        text = n.get('name', '') + '. ' + n.get('statement', '')
        tags = []
        for t in n.get('tags', []):
            t = norm_tag(t)
            if t and t not in TAG_DROP and t not in tags:
                tags.append(t)
        n['tags'] = sorted(tags)
        n['tagsInferred'] = [t for t in infer_tags(text) if t not in tags]
        n['sourceKinds'] = sorted({source_kind(p['source']) for p in n['provenance']})
        n['origin'] = 'corpus'

    # 3. map rows, controls, positive list, uncovered items
    rows, positives, opens = parse_map()
    row_ids = {r['row'] for r in rows}
    extra = []
    for code, c in CONTROLS.items():
        extra.append(dict(id='ctl-' + code, type='control', name=c['name'], status=c.get('status', 'proved'),
                          statement=f"Has: {c['has']}. Lacks: {c['lacks']}. Kills: {c['kills']}.",
                          usesMultiplicativity='n/a', heightUniform='n/a', source='OBSTRUCTION_MAP.md section 2; syntheses',
                          tags=['control'], tagsInferred=[], provenance=[], sourceKinds=['map'], origin='map',
                          lacks=c['lacks']))
    extra.append(dict(id='target-rh', type='target', name='Riemann hypothesis', status='open',
                      statement='All non-trivial zeros of zeta have real part 1/2.', usesMultiplicativity='n/a',
                      heightUniform='yes', source='', tags=[], tagsInferred=[], provenance=[], sourceKinds=['map'],
                      origin='map'))
    for r in rows:
        text = r['route'] + '. ' + r['stops']
        ctl = controls_in(r['defeatedBy'])
        extra.append(dict(id='row-' + r['row'], type='obstruction', name=re.sub(r'\s+', ' ', r['route'])[:200],
                          statement=r['stops'], status='closed', mapStatus=r['status'], defeatedBy=r['defeatedBy'],
                          defeatedByControls=ctl, restatesTarget=bool(re.search(r'\btarget\b', r['defeatedBy'])),
                          usesMultiplicativity='n/a', heightUniform='n/a',
                          source=f"{r['file']} ({r['section']}): {r['src']}",
                          lanes=sorted(set(re.findall(r'`([a-z0-9][a-z0-9\-]+)`', r['src']))),
                          tags=infer_tags(text), tagsInferred=[], provenance=[], sourceKinds=['map'], origin='map',
                          row=r['row']))
    for p in positives:
        arith = bool(re.search(r'prime-side|zero-free', p['group'], re.I))
        extra.append(dict(id=f"map-pos-{p['n']}", type='identity', name=p['text'].split(';')[0][:160],
                          statement=p['text'], status='proved', usesMultiplicativity='yes' if arith else 'no',
                          heightUniform='unknown', source='OBSTRUCTION_MAP.md section 4 (' + p['group'] + ')',
                          tags=infer_tags(p['text']), tagsInferred=[], provenance=[], sourceKinds=['map'], origin='map',
                          holdsForDH='all hold for DH' in p['group'],
                          lanes=sorted(set(re.findall(r'`([a-z0-9][a-z0-9\-/]+)`', p['text'])))))
    for o in opens:
        extra.append(dict(id=f"map-open-{o['n']}", type='open-direction', name=o['title'][:200],
                          statement=o['text'], status='conjectural', usesMultiplicativity='unknown',
                          heightUniform='unknown', source='OBSTRUCTION_MAP.md section 6',
                          tags=infer_tags(o['title'] + ' ' + o['text']), tagsInferred=[], provenance=[],
                          sourceKinds=['map'], origin='map'))

    # outcomes of engine-launched attacks
    out_path = os.path.join(HERE, 'outcomes.json')
    outcomes = json.load(open(out_path, encoding='utf-8')) if os.path.exists(out_path) else []
    for o in outcomes:
        if o.get('verdict') in ('closed', 'refuted'):
            extra.append(dict(id='out-' + o['slug'], type='obstruction', name=o.get('title', o['slug']),
                              statement=o.get('note', ''), status='closed', usesMultiplicativity='n/a',
                              heightUniform='n/a', source='outcomes.json: ' + o.get('path', ''),
                              defeatedByControls=o.get('defeatedBy', []), tags=[norm_tag(t) for t in o.get('tags', [])],
                              closedNodes=o.get('nodes', []), launchedNodes=o.get('launchedNodes', []),
                              lesson=o.get('lesson', ''),
                              tagsInferred=[], provenance=[], sourceKinds=['engine'], origin='outcome'))
    fam_path = os.path.join(HERE, 'closed_families.json')
    families = json.load(open(fam_path, encoding='utf-8')) if os.path.exists(fam_path) else []
    for f in families:
        extra.append(dict(id=f['id'], type='obstruction', name=f['name'],
                          statement='Closed combination family (lane ' + f['closedBy']
                                    + (', map row ' + f['row'] if f.get('row') else '') + '). Rejected when all of: '
                                    + '; '.join(f['all']) + ' match the joint text of a candidate'
                                    + (', unless ' + f['unless'] + ' matches.' if f.get('unless') else '.'),
                          status='closed', usesMultiplicativity='n/a', heightUniform='n/a',
                          source='closed_families.json', closedByLane=f['closedBy'], tags=[],
                          tagsInferred=[], provenance=[], sourceKinds=['engine'], origin='outcome'))

    nodes += extra
    ids = {n['id'] for n in nodes}
    assert len(ids) == len(nodes), 'duplicate node ids after merge'
    node = {n['id']: n for n in nodes}

    # 4. row attachment and roles
    devices = load_devices()
    crossing_keyword = 0
    for n in nodes:
        text = n.get('name', '') + '. ' + n.get('statement', '')
        if n['id'] in devices:
            n['device'] = devices[n['id']]
        if CROSSING_RE.search(text):
            crossing_keyword += 1
        att = set()
        if n['origin'] == 'corpus':
            for key in ('closedBy', 'obstructionRow'):
                for m in ROW_ID_RE.findall(n.get(key, '') or ''):
                    if m in row_ids:
                        att.add(m)
            for m in re.finditer(r'(?:map|obstruction map)[^.;]{0,25}?rows?\s+((?:[PGQSZFTLNA]\d{1,2}[,/\- and]*)+)',
                                 text + ' ' + n.get('source', ''), re.I):
                for rid in ROW_ID_RE.findall(m.group(1)):
                    if rid in row_ids:
                        att.add(rid)
            if re.search(r'MV-CAP', n.get('closedBy', '') or ''):
                att.add('P29') if 'P29' in row_ids else None
        n['rows'] = sorted(att, key=lambda s: (s[0], int(re.sub(r'\D', '', s) or 0)))
        roles = []
        wall = n['type'] in ('obstruction', 'control', 'target') or n.get('status') in ('closed', 'refuted')
        if wall:
            roles.append('wall')
        else:
            if n.get('usesMultiplicativity') in ('yes', 'mixed'):
                roles.append('arith')
                if FEW_PRIMES_RE.search(text):
                    roles.append('few-primes')
            if n.get('heightUniform') == 'yes':
                roles.append('uniform')
            if n['type'] in ('identity', 'object', 'tool', 'mechanism') and n.get('status') in ('proved', 'certified'):
                roles.append('rigid')
            # c5-repair: role 'device' comes from curated/devices.json only (states closed / floored / open in
            # n['device']); the keyword role 'crossing' is no longer assigned
            if n['id'] in devices:
                roles.append('device')
            if n['type'] == 'measured-phenomenon':
                roles.append('phenomenon')
            if n['type'] in ('mechanism', 'identity') and n.get('status') in ('proved', 'certified'):
                roles.append('explainer')
            if n['type'] in ('open-lemma', 'conjecture', 'open-direction'):
                roles.append('lemma')
            if SEPARATOR_RE.search(text):
                roles.append('separator')
            if RH_EQUIV_RE.search(text):
                roles.append('rh-equivalent')
            if SURROGATE_RE.search(text):
                roles.append('surrogate')
            alltags = set(n['tags'])
            if alltags & {'heat-flow', 'lambda'} and 'arith' not in roles:
                roles.append('flow-stable')
            if n['id'] in underused:
                roles.append('underused')
        n['roles'] = roles
        if n['id'] in underused:
            n['underusedWhy'] = underused[n['id']]

    # 5. edges
    edges = []
    seen_e = set()

    def add(a, b, typ, **kw):
        if a == b or a not in node or b not in node:
            return
        key = (a, b, typ)
        if key in seen_e:
            return
        seen_e.add(key)
        e = dict(source=a, target=b, type=typ)
        e.update(kw)
        edges.append(e)

    # restates (similarity), from the pre-merge similarity list
    for (i, j), c in sorted(sims.items()):
        a, b = idx_of_group[i], idx_of_group[j]
        if a != b:
            add(a, b, 'restates', weight=round(c, 3), why='text similarity')
    for n in nodes:
        if n['origin'] != 'corpus':
            if n.get('restatesTarget'):
                add(n['id'], 'target-rh', 'restates', why='map: target is RH itself')
            for c in n.get('defeatedByControls', []):
                add('ctl-' + c, n['id'], 'control-defeats',
                    why='control named in the lane record' if n['origin'] == 'outcome' else 'map column "Defeated by"')
            # engine outcomes: the closed combination obstructs its members; a family node hangs off its lane
            for m in n.get('closedNodes', []):
                add(n['id'], id_alias.get(m, m), 'obstructs', why='member of the closed combination')
            for m in n.get('launchedNodes', []):
                if m not in n.get('closedNodes', []):
                    add(n['id'], id_alias.get(m, m), 'uses', why='launched with this node; not part of the closed set')
            if n.get('closedByLane'):
                add('out-' + n['closedByLane'], n['id'], 'special-case-of', why='family closed by this lane')
            continue
        text = n.get('name', '') + '. ' + n.get('statement', '')
        if 'rh-equivalent' in n['roles']:
            add(n['id'], 'target-rh', 'restates', why='statement is an equivalence with RH')
        cb = set(ROW_ID_RE.findall(n.get('closedBy', '') or '')) & row_ids
        ob = set(ROW_ID_RE.findall(n.get('obstructionRow', '') or '')) & row_ids
        for r in n['rows']:
            if r in ob:
                add(n['id'], 'row-' + r, 'restates', why='node records this map row')
            elif r in cb:
                add('row-' + r, n['id'], 'obstructs', why='closedBy')
                add(n['id'], 'row-' + r, 'special-case-of', why='closedBy')
            else:
                add('row-' + r, n['id'], 'obstructs', why='row cited in the node text')
            for c in node['row-' + r].get('defeatedByControls', []):
                add('ctl-' + c, n['id'], 'control-defeats', why='inherited from row ' + r, inherited=True)
        # control mentions in reader nodes
        for code, c in CONTROLS.items():
            if re.search(c['kw'], text):
                if n['type'] == 'control':
                    add(n['id'], 'ctl-' + code, 'restates', why='reader node describes this control')
                elif 'separator' in n['roles'] and code == 'DH':
                    add(n['id'], 'ctl-DH', 'separates-from', why='statement records a failure of DH')
                elif 'wall' in n['roles']:
                    add('ctl-' + code, n['id'], 'control-defeats', why='control named in a closed node')

    for a, b, typ, why in EXTRA_EDGES:
        add(a, b, typ, why=why, curated=True)

    # uses: literal id mention, or citation of another node's primary imp module
    by_imp = defaultdict(list)
    for n in nodes:
        if n['origin'] == 'corpus':
            p = primary_imp(n.get('source', ''))
            if p:
                by_imp[p].append(n['id'])
    id_re = re.compile(r'[a-z0-9]+(?:-[a-z0-9]+){1,}')
    for n in nodes:
        if n['origin'] != 'corpus':
            continue
        text = n.get('statement', '')
        for m in set(id_re.findall(text)):
            if m in id_alias and id_alias[m] != n['id']:
                add(n['id'], id_alias[m], 'uses', why='id cited in statement')
        own = primary_imp(n.get('source', ''))
        cited = set(re.findall(r'imp-\d+', n.get('source', '') + ' ' + text))
        for imp in cited:
            if imp == own:
                continue
            for tgt in by_imp.get(imp, [])[:3]:
                add(n['id'], tgt, 'uses', why='cites ' + imp)
    # special-case-of between corpus nodes: few-prime versions of an all-prime node with high similarity
    for (i, j), c in sims.items():
        a, b = node[idx_of_group[i]], node[idx_of_group[j]]
        if a['id'] == b['id']:
            continue
        fa, fb = 'few-primes' in a['roles'], 'few-primes' in b['roles']
        if fa != fb:
            s, t = (a, b) if fa else (b, a)
            add(s['id'], t['id'], 'special-case-of', why='restricted set of primes', weight=round(c, 3))

    # composes-with: shared object tag + complementary properties
    live = [n for n in nodes if 'wall' not in n['roles'] and n['origin'] in ('corpus', 'map')]
    tagdf = Counter()
    for n in live:
        tagdf.update(set(n['tags']) | set(n['tagsInferred']))
    idf = {t: math.log((len(live) + 1) / (c + 1)) for t, c in tagdf.items()}
    by_tag = defaultdict(list)
    for n in live:
        for t in set(n['tags']) | set(n['tagsInferred']):
            by_tag[t].append(n['id'])

    def complement(a, b):
        ra, rb = set(a['roles']), set(b['roles'])
        why = []
        if ('arith' in ra) != ('arith' in rb):
            x, y = (a, b) if 'arith' in ra else (b, a)
            if 'uniform' in y['roles'] and 'uniform' not in x['roles']:
                why.append('multiplicativity + height-uniform')
            elif 'rigid' in y['roles']:
                why.append('multiplicativity + rigid structure')
        if ('phenomenon' in ra and 'explainer' in rb) or ('phenomenon' in rb and 'explainer' in ra):
            why.append('measured phenomenon + mechanism')
        if ('lemma' in ra and 'rigid' in rb) or ('lemma' in rb and 'rigid' in ra):
            why.append('open lemma + proved tool')
        if ('device' in ra) != ('device' in rb) and ('arith' in ra or 'arith' in rb):
            why.append('limit mechanism + arithmetic input')
        if ('separator' in ra) != ('separator' in rb):
            why.append('one member fails for DH')
        return why

    cand = defaultdict(dict)
    for t, lst in by_tag.items():
        if len(lst) > 400 or idf.get(t, 0) < 0.8:
            continue
        for x in range(len(lst)):
            for y in range(x + 1, len(lst)):
                key = (lst[x], lst[y])
                cand[key][t] = idf[t]
    best = defaultdict(list)
    for (a, b), shared in cand.items():
        why = complement(node[a], node[b])
        if not why:
            continue
        if set(node[a]['sourceKinds']) == set(node[b]['sourceKinds']) and primary_imp(node[a]['source']) and \
                primary_imp(node[a]['source']) == primary_imp(node[b]['source']):
            continue  # same module: not a combination
        w = round(sum(shared.values()) + 0.5 * len(why), 3)
        rec = (w, a, b, sorted(shared), why)
        best[a].append(rec)
        best[b].append(rec)
    keep = set()
    for nid, lst in best.items():
        for rec in sorted(lst, key=lambda r: (-r[0], r[1], r[2]))[:COMPOSE_TOP]:
            keep.add(rec[1:3])
            add(rec[1], rec[2], 'composes-with', weight=rec[0], shared=rec[3], why='; '.join(rec[4]))

    # 6. write
    for n in nodes:
        for k in ('_chunk',):
            n.pop(k, None)
    nodes.sort(key=lambda n: n['id'])
    edges.sort(key=lambda e: (e['type'], e['source'], e['target']))
    meta = dict(
        nodeFiles=files, rawRecords=n_raw, mergedPairs=merged_pairs,
        counts=dict(nodes=len(nodes), edges=len(edges),
                    byType=dict(Counter(n['type'] for n in nodes)),
                    byOrigin=dict(Counter(n['origin'] for n in nodes)),
                    edgesByType=dict(Counter(e['type'] for e in edges)),
                    live=sum(1 for n in nodes if 'wall' not in n['roles']),
                    rows=len(rows), controls=len(CONTROLS), underused=len(underused),
                    devices=dict(Counter(n['device']['state'] for n in nodes if n.get('device'))),
                    devicesLive=dict(Counter(n['device']['state'] for n in nodes if n.get('device') and 'wall' not in n['roles'])),
                    crossingKeyword=crossing_keyword),
        thresholds=dict(merge=MERGE_COS, restates=RESTATE_COS, composePerNode=COMPOSE_TOP),
        tagIdf={t: round(v, 3) for t, v in sorted(idf.items())},
        edgeTypes=['uses', 'restates', 'special-case-of', 'obstructs', 'control-defeats', 'separates-from',
                   'composes-with'],
        note='Roles and tags are derived from reader labels and keyword rules; they are heuristics, not verdicts.')
    json.dump(dict(meta=meta, nodes=nodes, edges=edges), open(OUT, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    c = meta['counts']
    print(f"records {n_raw} -> nodes {c['byOrigin'].get('corpus', 0)} corpus + {len(extra)} map/control/outcome "
          f"= {c['nodes']}; live {c['live']}; rows {c['rows']}; edges {c['edges']}")
    print('edges by type: ' + ', '.join(f'{k} {v}' for k, v in sorted(c['edgesByType'].items())))
    print('wrote ' + OUT)


if __name__ == '__main__':
    main()
