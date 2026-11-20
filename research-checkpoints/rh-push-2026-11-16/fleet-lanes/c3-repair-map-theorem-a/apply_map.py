# Applies campaign/MAP_PENDING.md to push/OBSTRUCTION_MAP.md entry by entry, then the round-2 additions.
# Text of each MAP_PENDING entry is taken verbatim from MAP_PENDING.md (blockquote lines). Idempotence is not attempted:
# run once on the file saved as OBSTRUCTION_MAP.before.md.
import re, sys, json
BASE = 'tmp/research-2026-11-16/'
src = open(BASE + 'push/c3-repair-map-theorem-a/OBSTRUCTION_MAP.before.md').read()
pend = open(BASE + 'campaign/MAP_PENDING.md').read()
L = src.split('\n')
log = []
def quotes(tag):
    """blockquote lines of the MAP_PENDING subsection whose heading starts with '### tag.' or '## tag.'"""
    m = re.search(r'^#{2,3} ' + re.escape(tag) + r'\. .*?$', pend, re.M)
    assert m, tag
    rest = pend[m.end():]
    n = re.search(r'^#{2,3} ', rest, re.M)
    body = rest[:n.start()] if n else rest
    return [l[2:] for l in body.split('\n') if l.startswith('> ')]
def find(prefix, start=0):
    idx = [i for i, l in enumerate(L) if l.startswith(prefix) and i >= start]
    assert len(idx) == 1, (prefix, idx)
    return idx[0]
sec6 = find('## 6. What is not covered'); sec7 = find('## 7. Referee-broken claims index')
def item6(n):
    idx = [i for i in range(sec6, sec7) if L[i].startswith('%d. **' % n)]
    assert len(idx) == 1, n
    return idx[0]
def cols(line): return line.split(' | ')
# ---- A: section 6
for tag, n, mode in [('A1', 6, 'replace'), ('A2', 7, 'replace'), ('A3', 8, 'replace'), ('A4', 10, 'append'),
                     ('A5', 11, 'replace'), ('A6', 12, 'append'), ('A7', 14, 'replace')]:
    q = quotes(tag); assert len(q) == 1, tag
    i = item6(n)
    L[i] = q[0] if mode == 'replace' else L[i] + ' ' + q[0]
    log.append((tag, 'section 6 item %d %s' % (n, mode), i))
q = quotes('A8'); assert len(q) == 5
i = item6(15); L[i+1:i+1] = q; log.append(('A8', 'section 6 new items 16-20', i + 1))
# ---- B: section 2
i = find('| TW- |'); c = cols(L[i]); assert len(c) == 5
c[4] = c[4].rstrip(' |') + '. ' + quotes('B1')[0] + ' |'; L[i] = ' | '.join(c); log.append(('B1', 'section 2 row TW-, Use', i))
i = find('| DH | Davenport'); old = 'positive even theta kernel, Csordas convexity (measured)'; assert old in L[i]
L[i] = L[i].replace(old, quotes('B2')[0]); log.append(('B2', 'section 2 row DH, Has', i))
i = find('| HEAT |'); c = cols(L[i]); assert len(c) == 5
c[3] = c[3] + '. ' + quotes('B3')[0]; L[i] = ' | '.join(c); log.append(('B3', 'section 2 row HEAT, Lacks', i))
i = find('- Auxiliary controls used in single lanes'); L[i] = L[i] + ' ' + quotes('B4')[0]; log.append(('B4', 'section 2 notes, auxiliary controls', i))
# ---- C: existing rows
i = find('| P29 |'); c = cols(L[i]); assert len(c) == 6
c[2] = c[2] + ' ' + quotes('C1')[0]; c[5] = c[5].rstrip(' |') + '; `c1-pd-log-strip` |'; L[i] = ' | '.join(c); log.append(('C1', 'row P29', i))
i = find('| Q12 |'); q = quotes('C2'); assert len(q) == 1 and q[0].startswith('| Q12 |'); L[i] = q[0]; log.append(('C2', 'row Q12 replaced', i))
i = find('| P14 |'); c = cols(L[i]); assert len(c) == 6; c[2] = c[2] + ' ' + quotes('C3')[0]; L[i] = ' | '.join(c); log.append(('C3', 'row P14', i))
i = find('| Q4 |'); c = cols(L[i]); assert len(c) == 6; c[2] = c[2] + ' ' + quotes('C4')[0]; L[i] = ' | '.join(c); log.append(('C4', 'row Q4', i))
# ---- D: new rows, appended after the last row of each table
D = quotes('D'); assert len(D) == 14, len(D)
def last_row(prefix_letter):
    idx = [i for i, l in enumerate(L) if re.match(r'\| %s\d+ \|' % prefix_letter, l)]
    return idx[-1]
for letter in 'PGQSZF':
    rows = [r for r in D if re.match(r'\| %s\d+ \|' % letter, r)]
    i = last_row(letter); L[i+1:i+1] = rows
    log.append(('D', 'section 3 new rows ' + ', '.join(r.split(' | ')[0].strip('| ') for r in rows), i + 1))
# ---- E: section 4 (numbered list continues at 41)
E = quotes('E'); assert len(E) == 5
sec5 = find('## 5. The common wall')
i = max(j for j in range(find('## 4. Proved results worth keeping'), sec5) if re.match(r'\d+\. ', L[j]))
last = int(L[i].split('.')[0])
L[i+1:i+1] = ['%d. %s' % (last + 1 + k, e[2:]) for k, e in enumerate(E)]; log.append(('E', 'section 4 items %d-%d' % (last + 1, last + 5), i + 1))
# ---- F: section 5
i = find('Corollary used as a filter:'); L[i+1:i+1] = ['', quotes('F')[0]]; log.append(('F', 'section 5 paragraph after the corollary', i + 2))
# ---- G: section 7
G = quotes('G'); assert len(G) == 10
i = max(j for j, l in enumerate(L) if l.startswith('| ') and j > find('## 7. Referee-broken claims index'))
L[i+1:i+1] = G; log.append(('G', 'section 7 ten rows', i + 1))
open(BASE + 'push/c3-repair-map-theorem-a/OBSTRUCTION_MAP.stage1.md', 'w').write('\n'.join(L))
json.dump(log, open(BASE + 'push/c3-repair-map-theorem-a/apply_map_stage1.json', 'w'), indent=1)
for t in log: print(t)
