"""tables from sectors.py output. usage: python sec_table.py out.json [more.json ...]"""
import json, sys, glob, os
def load(f):
    if os.path.exists(f): return json.load(open(f))['results']
    res = {}
    for p in glob.glob(f + '.part.*.json'):
        s = p[len(f) + 6:-5]; res[s] = json.load(open(p))
    return res
def g(x): return 'n/a' if x is None else '%.2e' % x
for f in sys.argv[1:]:
    R = load(f)
    sups = sorted(R, key=float)
    sups = [s for s in sups if 'objects' in R[s]]
    if not sups: continue
    objs = list(R[sups[0]]['objects'])
    print('## %s  (N = %s, %s bits)\n' % (f, R[sups[0]]['N'], R[sups[0]]['prec']))
    print('### onsets: first support 2a on the grid with a negative value\n')
    print('| object | pole block | full form, even | full form, odd | pole-free, even | pole-free, odd | Schur complement < 0 while pole-free block > 0: supports (even) | same (odd) |')
    print('|---|---|---|---|---|---|---|---|')
    for o in objs:
        def first(pn, key):
            for s in sups:
                if o not in R[s]['objects']: continue
                if R[s]['objects'][o][pn][key]['lam'] < 0: return s
            return '> ' + sups[-1]
        def sch(pn):
            out = []
            for s in sups:
                if o not in R[s]['objects']: continue
                r = R[s]['objects'][o][pn]
                if 'S_min' in r['schur'] and r['schur']['S_min'] < 0 and r['pf']['lam'] > 0: out.append(s)
            if not out: return 'none'
            return out[0] + ' .. ' + out[-1] + ' (%d)' % len(out)
        blk = R[sups[0]]['objects'][o]['even']['block']
        print('| %s | %s | %s | %s | %s | %s | %s | %s |' % (o, blk, first('even', 'full'), first('odd', 'full'), first('even', 'pf'), first('odd', 'pf'), sch('even'), sch('odd')))
    for o in [x for x in ('ZETA', 'CHI-3', 'CHI5', 'DH', 'EA-1/8', 'TNR-q2-c2.2', 'TNR-q2-c1.0', 'FLIP2', 'U-00(Re)') if x in objs]:
        print('\n### %s: lowest eigenvalues and Schur complement by support\n' % o)
        print('| 2a | full even | full odd | pole-free even | pole-free odd | S even (min eig) | S odd (min eig) | E even | E odd | S/E even | S/E odd |' + (' literal {cosh, x sinh} block: complement D min | 2x2 S eigenvalues |' if o == 'ZETA' else ''))
        print('|---|---|---|---|---|---|---|---|---|---|---|' + ('---|---|' if o == 'ZETA' else ''))
        for s in sups:
            if o not in R[s]['objects']: continue
            r = R[s]['objects'][o]; e, od = r['even'], r['odd']
            def sv(x, k): return x['schur'].get(k)
            def ratio(x):
                a, b = sv(x, 'S_min'), sv(x, 'E_min')
                return 'n/a' if a is None or not b else '%.2e' % (a / b)
            row = '| %s | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s |' % (s, g(e['full']['lam']), g(od['full']['lam']), g(e['pf']['lam']), g(od['pf']['lam']),
                  g(sv(e, 'S_min')), g(sv(od, 'S_min')), g(sv(e, 'E_min')), g(sv(od, 'E_min')), ratio(e), ratio(od))
            if o == 'ZETA':
                row += ' %s | %s |' % (g(e.get('pf2', {}).get('lam')), ', '.join('%.2e' % x for x in (e.get('schur2', {}).get('S_eigs') or [])))
            print(row)
    print()
