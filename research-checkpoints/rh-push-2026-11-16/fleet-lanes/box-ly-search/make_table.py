"""make_table.py: combine screen (float64) and cert (Arb) outputs into the scheme x input table (markdown)."""
import json, glob, collections, sys
scr = collections.defaultdict(dict)       # (scheme, weight, input, Y) -> N -> (T1, first_bad, n_bad)
for fn in glob.glob('results/box/screen_*.jsonl'):
    if 'smoke' in fn: continue
    for l in open(fn):
        try: r = json.loads(l)
        except ValueError: continue
        t, res = r['task'], r['res']
        if 'error' in res: continue
        k = (t['scheme'], t.get('weight', 'sharp'), t['input'], round(res['Y'], 2))
        N = t['size']
        old = scr[k].get(N)
        fb = res['first_bad'][0] if res.get('first_bad') else None
        if old is None or res['T1'] > old[0]:
            scr[k][N] = (res['T1'], fb, res['n_bad'])
cert = collections.defaultdict(lambda: collections.defaultdict(lambda: dict(P=[], F=[], U=0)))
for fn in glob.glob('results/box/cert_*.jsonl'):
    if 'tasks' in fn: continue
    for l in open(fn):
        try: r = json.loads(l)
        except ValueError: continue
        t, res = r['task'], r['res']
        k = (t['scheme'], t.get('weight', 'sharp'), t['input'], round(t['Y'], 2))
        c = cert[k][t['size']]
        v = res.get('verdict')
        if t['mode'] == 'pass':
            if v == 'PASS': c['P'].append((t['T0'], t['T1']))
            elif v == 'FAIL': c['F'].append(res['bad'][0][0])
            else: c['U'] += 1
        else:
            if v == 'FAIL': c['F'].append(t['x'])
            else: c['U'] += 1
def covered(iv):
    iv = sorted(iv); x = None
    for a, b in iv:
        if x is None:
            if a > 0: return None
            x = b
        elif a <= x + 1e-6: x = max(x, b)
        else: break
    return x
rows = []
for k in sorted(scr):
    d = scr[k]
    Ns = sorted(d)
    clean = [N for N in Ns if d[N][1] is None]
    fail = [N for N in Ns if d[N][1] is not None]
    first_fail = fail[0] if fail else None
    below = [N for N in clean if first_fail is None or N < first_fail]
    cP = {N: covered(c['P']) for N, c in cert[k].items() if c['P'] and not c['F']}
    cP = {N: x for N, x in cP.items() if x}
    cF = sorted(N for N, c in cert[k].items() if c['F'])
    Tmax = max(d[N][0] for N in Ns)
    rows.append((k, len(Ns), Ns[-1], Tmax, (below[-1] if below else None), first_fail, (d[first_fail][1] if first_fail else None),
                 len(clean), len(cP), (max(cP) if cP else None), (min(cP.values()) if cP else None), (cF[0] if cF else None), len(cF)))
print('| scheme | weight | input | window Y | N tested (count, max) | T screened (max) | screened: all N pass up to | screened: first N failing (height of lowest off-axis zero block) | screened clean N (count) | certified PASS: N count, max N, min height covered | certified FAIL: smallest N, count |')
print('|---|---|---|---|---|---|---|---|---|---|---|')
for (k, nN, Nmax, Tmax, below, ff, ffx, nclean, ncP, maxcP, minT, cF0, ncF) in rows:
    print('| %s | %s | %s | %s | %d, %d | %g | %s | %s | %d | %s | %s |' % (k[0], k[1], k[2], k[3], nN, Nmax, Tmax, below, ('%d (x=%g)' % (ff, ffx) if ff else 'none'), nclean,
          ('%d, %d, %g' % (ncP, maxcP, minT) if ncP else '-'), ('%d, %d' % (cF0, ncF) if ncF else '-')))
