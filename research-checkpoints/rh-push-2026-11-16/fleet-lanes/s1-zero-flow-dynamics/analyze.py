"""Tables from the tests.py outputs. Usage: analyze.py out/t_*.json"""
import sys, json, math, numpy as np
import predict2 as P
GUE = lambda d: math.pi ** 2 * d ** 3 / 9          # P(s < d), leading order
def fit_ab(N, t):
    A = np.vstack([np.ones(len(N)), 1.0 / np.array(N)]).T
    c, *_ = np.linalg.lstsq(A, np.array(t), rcond=None); return c
for f in sys.argv[1:]:
    r = json.load(open(f)); kind = r['kind']; name = f.split('/')[-1][2:-5]
    print('\n=== %s  n=%d  T in [%.1f, %.4g]' % (name, r['n'], r['Tmin'], r['Tmax']))
    print(' (1),(2) windows:  T_med  L  f_off | Q+1 +- err | prime prediction | V | P(s<.05)/GUE P(s<.1)/GUE P(s<.2)/GUE | close pairs, closing (R>1), max R, R>1 fraction of all pairs')
    for w in r['windows']:
        pred = P.predict(w['L'], 5 if kind == 'dir' else None)
        print('   %9.4g %5.2f %7.4f | %7.4f +- %6.4f | %7.4f | %.4f | %6.2f %6.2f %6.3f | %7d %4d %6.3f %.2e' % (w['Tmed'], w['L'], w['foff'], w['Q'] + 1, w['Qerr'], pred, w['V'],
              w['P'][2] / GUE(.05), w['P'][3] / GUE(.1), w['P'][4] / 0.00853, w['nclose'], w['nclosing'], w['Rclose_q'][-1] if w['Rclose_q'] else float('nan'), w['Rall_gt1']))
    print(' (3),(4) grid: N  T  s_min | t_c pair, t_c flow (full / local), retardation | beta(N,0.5) full / local, beta*f*gmin... prod at 0.05')
    Ns = []; tcs = []; bs = []
    for g in r['grid']:
        tc = g.get('tc_full') or g.get('tc_local'); bf = (g.get('beta_full') or {}).get('0.5'); bl = (g.get('beta_local') or {}).get('0.5')
        pr = (g.get('prod_full') or g.get('prod_local') or {}).get('0.05')
        b = bf or bl
        print('   %9d %9.4g %.5f | %.4e %s %s %s | %s %s %s' % (g['N'], g['T'], g['smin'], g['tc_pair'], '%.4e' % g['tc_full'] if g.get('tc_full') else '    -     ',
              '%.4e' % g['tc_local'] if g.get('tc_local') else '    -     ', '%.4f' % (tc / g['tc_pair']) if tc else '-', '%.4g' % bf if bf else '-', '%.4g' % bl if bl else '-', '%.4f' % pr if pr else '-'))
        if tc: Ns.append(g['N']); tcs.append(tc)
        if b: bs.append((g['N'], b))
    Ns = np.array(Ns); tcs = np.array(tcs)
    for lab, m in [('N <= 1000', Ns <= 1000), ('N <= 1e4', Ns <= 1e4), ('all N', Ns > 0), ('N >= 1e4', Ns >= 1e4)]:
        if m.sum() >= 3:
            c = fit_ab(Ns[m], tcs[m]); sl = np.polyfit(np.log(Ns[m]), np.log(tcs[m]), 1)
            print('   fit t_c = a + b/N on %-9s: a = %.4e  b = %.4g ; log-log slope %.3f' % (lab, c[0], c[1], sl[0]))
    bs = np.array(bs)
    for lab, m in [('N <= 200', bs[:, 0] <= 200), ('all N', bs[:, 0] > 0), ('N >= 1e4', bs[:, 0] >= 1e4)]:
        if m.sum() >= 3: print('   beta(N,0.5) log-log slope on %-9s: %.3f' % (lab, np.polyfit(np.log(bs[m, 0]), np.log(bs[m, 1]), 1)[0]))
