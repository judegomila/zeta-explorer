# tables for RESULT.md from the server outputs in out_server/
import json, sys, os, math
import numpy as np
D = sys.argv[1] if len(sys.argv) > 1 else 'out_server'
L = lambda f: json.load(open(os.path.join(D, f)))
if os.path.exists(os.path.join(D, 'c1.json')):
    r = L('c1.json'); a = np.array(r['a'])
    pick = [int(np.argmin(abs(a - x))) for x in (0.01, 0.1, 1.0, 5.0, 10.0, 20.0)]
    print('## c1  a =', [round(float(a[i]), 4) for i in pick])
    print('| kernel | U_F | off(e=0.1) at a = 0.01, 0.1, 1, 5, 10, 20 | min..max over a | cov(d=0.05) min..max | A-weighted overflow at a = 1, 5, 20 | support-normalised overflow at a = 5, 20 |')
    print('|---|---|---|---|---|---|---|')
    env = {}
    for k, v in r['kernels'].items():
        if ' x' in k: continue
        off = np.array(v['off'])[:, 1]; cov = np.array(v['cov'])[:, 0]; ovA = np.array(v['ovA']); ovS = np.array(v['ovS'])
        env[k] = (off.min(), off.max(), cov.min(), cov.max())
        print('| %s | %.3f | %s | %.4f..%.4f | %.4f..%.4f | %s | %s |' % (k, v['UF'], ', '.join('%.4f' % off[i] for i in pick), off.min(), off.max(), cov.min(), cov.max(),
              ', '.join('%.3g' % ovA[i] for i in pick[2:6:1] if True)[:60], ', '.join('%.4f' % ovS[i] for i in (pick[3], pick[5]))))
    for nm in ('zeta', 'DH'):
        base = np.array(r['kernels'][nm]['off'])
        d = max(float(abs(np.array(r['kernels']['%s x%g' % (nm, c)]['off']) - base).max()) for c in (3, 10, 100, 1000))
        print('scale invariance %s: max change over c = 3..1000: %.2e' % (nm, d))
    ref = ['zeta', 'chi-3', 'chi-4', 'chi5', 'chi-7']
    hi = max(env[k][1] for k in ref); lo = min(env[k][0] for k in ref)
    print('envelope of off(e=0.1) over zeta and the four characters: [%.4f, %.4f]' % (lo, hi))
    for k in env:
        if k in ref: continue
        print('  %-14s range [%.4f, %.4f]  %s' % (k, env[k][0], env[k][1], 'inside the envelope for some a' if (env[k][0] <= hi and env[k][1] >= lo) else 'outside'))
if os.path.exists(os.path.join(D, 'c2.json')):
    r = L('c2.json')
    for fb in ('c2b_test.json', 'c2b_1.json', 'c2b_2.json', 'c2b_3.json'):
        if os.path.exists(os.path.join(D, fb)):
            for k, v in L(fb).items():
                for N, row in v['rows'].items():
                    if int(N) > 6400: r[k]['rows'][N] = row
    print('\n## c2')
    print('| kernel | theta0 | band | N = largest | max pair split / lambda_1 (max over N) | C N^2 at largest N | C/C_pred at N = 800, 6400, largest | ladder residual at largest N | L3/L2, L4/L2, L5/L2, L6/L2 at largest N |')
    print('|---|---|---|---|---|---|---|---|---|')
    for k, v in r.items():
        rows = v['rows']; Ns = sorted(int(x) for x in rows); Nm = Ns[-1]; rm = rows[str(Nm)]
        ms = max(max(rows[str(n)]['split']) for n in Ns)
        cc = [rows[str(n)]['C']/rows[str(n)]['Cpred'] for n in (800, 6400, Nm) if str(n) in rows]
        Lr = rm['L']
        print('| %s | %.4f | %d | %d | %.1e | %.4f | %s | %.1e | %s |' % (k, v['symbol']['theta0'], v['symbol']['band'], Nm, ms, rm['C']*Nm*Nm,
              ', '.join('%.5f' % x for x in cc), rm['resid'], ', '.join('%.5f' % (Lr[j]/Lr[1]) for j in (2, 3, 4, 5))))
    print('exact ratios: 8/3 = 2.66667, 5, 8, 35/3 = 11.66667')
    k = 'zeta_repo'
    print('source replay (zeta_repo): -log(lambda_3/lambda_1) at N = 800:', r[k]['rows']['800']['L'][1], ' source 0.0009625430796462755; N = 1600:', r[k]['rows']['1600']['L'][1])
if os.path.exists(os.path.join(D, 'c3.json')):
    r = L('c3.json')
    print('\n## c3 (W0: weight-free, function of s = aU)')
    print('| s | ' + ' | '.join('d=%d' % d for d in r['deg']) + ' | full core d=200 |')
    for s, v in r['W0'].items():
        print('| %s | ' % s + ' | '.join('%.3f' % v[str(d)][0] for d in r['deg']) + ' | %.6f |' % v['200'][2])
    print('\n(WA: lag weight A_F) norm with diagonal core, d = 4, 16, 64, 200; then full core d = 200')
    for nm, v in r['WA'].items():
        print('| %s | %.3f | ' % (nm, v['UF']) + ' | '.join('a=%s: ' % a + ', '.join('%.3f' % v['rows'][a][str(d)][0] for d in (4, 16, 64, 200)) + '; full %.4f' % v['rows'][a]['200'][2]
              for a in ('0.05', '0.5', '2.0', '20.0')) + ' |')
    print('smallest degree with norm > 1 (diagonal core), per kernel at a = 0.05, 0.5, 2, 20:')
    for nm, v in r['WA'].items():
        o = []
        for a in ('0.05', '0.5', '2.0', '20.0'):
            dd = [d for d in r['deg'] if v['rows'][a][str(d)][0] > 1]
            o.append(str(dd[0]) if dd else '>200')
        print('  %-14s %s' % (nm, ' '.join(o)))
for f in ('c4_A.json', 'c4_heat.json'):
    if os.path.exists(os.path.join(D, f)):
        r = L(f)
        print('\n## %s  (float64 screen; a value counts as negative when pmin < -1e-9)' % f)
        for k, v in r.items():
            rows = v['rows']
            neg = [x for x in rows if x['pmin'] < -1e-9]
            mn = min(x['pmin'] for x in rows)
            print('%-40s n<=%d top<=%.1f  min pmin %+.2e  max pmax %.6f  cond<=%.1e  first negative: %s' % (
                k, rows[-1]['n'], rows[-1]['top'], mn, max(x['pmax'] for x in rows), max(x['condS'] for x in rows),
                ('n=%d top=%.2f pmin=%.2e (previous prefix top=%.2f pmin=%+.1e)' % (neg[0]['n'], neg[0]['top'], neg[0]['pmin'],
                  rows[rows.index(neg[0]) - 1]['top'] if rows.index(neg[0]) else 0, rows[rows.index(neg[0]) - 1]['pmin'] if rows.index(neg[0]) else 0)) if neg else 'none'))
for fB in ('c4_B.json', 'c4_B400.json', 'c4_Bscan.json'):
  if os.path.exists(os.path.join(D, fB)):
    r = L(fB); print(fB)
    print('\n## c4_B (high precision)')
    for k, v in r.items():
        import decimal; fl = decimal.Decimal(v['smallest_abs_rel']); ok = abs(fl) > decimal.Decimal(10)**(-(v['dps'] - 25))
        print(k, '| neg', v['neg'] if ok else '%s (NOT VALID: smallest eigenvalue at the working precision)' % v['neg'], '| min/max', v['min_rel'], '| smallest |eig|/max', v['smallest_abs_rel'], '| max|R|', v['maxabsR'], '|', v.get('note', ''))
