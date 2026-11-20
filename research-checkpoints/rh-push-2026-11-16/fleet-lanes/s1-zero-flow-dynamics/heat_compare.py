"""Heat windows against the tau = 0 window: off-line fraction, loop defect, small gaps, and the composition law of the collision time,
t_c[heat tau](N) = t_c[tau = 0](N) - |t_raw| while the window holds no off-line pair (t_raw = |tau| (2 pi / L)^2).
Usage: heat_compare.py PREFIX   (reads PREFIX_<tau>.json for tau in 0 -1e-4 -5e-4 -2e-3 -1e-2)"""
import sys, json, math
pre = sys.argv[1]; taus = ['0', '-1e-4', '-5e-4', '-2e-3', '-1e-2']
R = {t: json.load(open('%s_%s.json' % (pre, t))) for t in taus}
print('whole-window statistics (largest window of each list)')
print('  tau      zeros   f_off     Q+1 +- err        V       P(<.02)  P(<.05)   P(<.1)    P(<.2)  | closing/close  maxR')
for t in taus:
    w = max(R[t]['windows'], key=lambda w: w['n'])
    print('  %-7s %7d  %.5f  %.4f +- %.4f  %.4f  %.2e %.2e %.2e %.2e | %d/%d %.3f' % (t, R[t]['n'], w['foff'], w['Q'] + 1, w['Qerr'], w['V'], w['P'][1], w['P'][2], w['P'][3], w['P'][4], w['nclosing'], w['nclose'], w['Rclose_q'][-1]))
g0 = {r['N']: r for r in R['0']['grid']}
for t in taus[1:]:
    Lw = R[t]['windows'][0]['L']; traw = abs(float(t)) * (2 * math.pi / Lw) ** 2
    print('tau = %s : |t_raw| = %.4e (L = %.2f)' % (t, traw, Lw))
    print('      N    t_c[0](N)    t_c[tau](N)   t_c[0]-|t_raw|   ratio t_c[tau]/t_c[0]   real zeros lost among the first N of tau=0 (from counts)')
    for r in R[t]['grid']:
        N = r['N']
        if N not in g0: continue
        a = g0[N].get('tc_full') or g0[N].get('tc_local'); b = r.get('tc_full') or r.get('tc_local')
        if a is None or b is None: continue
        print('  %7d  %.4e  %.4e  %+.4e  %.4f   T: %.6g vs %.6g' % (N, a, b, a - traw, b / a, g0[N]['T'], r['T']))
