"""Collect out/*.json into summary tables (text) for RESULT.md."""
import json, glob, math, numpy as np
PI = math.pi; G0 = 0.5772156649015329; G1 = -0.0728158454836767
print('== combination 1: pair correlation fits (R = 40, bins 0.01) ==')
rows = []
for f in sorted(glob.glob('out/pc_*.json')):
    if 'local' in f: continue
    for r in json.load(open(f)):
        if 'pc' in r: rows.append(r)
order = ['Z0', 'Z7', 'Z8', 'Z9', 'Z10', 'Z11', 'Z12', 'CHI', 'CHIBAR', 'DH', 'HEATa', 'HEATb', 'HEATc']
rows.sort(key=lambda r: order.index(r['pc']['name']) if r['pc']['name'] in order else 99)
for r in rows:
    p = r['pc']
    print('%-6s T=[%.3g,%.3g] n=%d a=%.4f+-%.4f a_diag=%.4f+-%.4f a_osc=%.4f+-%.4f chi2/bin gue %.3f bk %.3f' % (p['name'], p['T_lo'], p['T_hi'], p['n_zeros'], *p['a'], *p['a_diag'], *p['a_osc'], p['chi2_gue'] / p['nbins_total'], p['chi2_bk'] / p['nbins_total']))
    print('        A_n: ' + ' '.join('%s:%.3f+-%.3f(%.3f)' % (k, v[0], v[1], v[2]) for k, v in p['A_n'].items()))
z = [r['pc'] for r in rows if r['pc']['name'].startswith('Z')]
if z:
    for key in ('a', 'a_diag', 'a_osc'):
        v = np.array([p[key][0] for p in z]); s = np.array([p[key][1] for p in z]); w = 1 / s ** 2
        print('zeta combined %s = %.5f +- %.5f  (chi2 of the 7 values about 1: %.1f)' % (key, (w * v).sum() / w.sum(), 1 / math.sqrt(w.sum()), (((v - 1) / s) ** 2).sum()))
    for k in z[0]['A_n']:
        v = np.array([p['A_n'][k][0] for p in z]); s = np.array([p['A_n'][k][1] for p in z]); w = 1 / s ** 2
        print('  zeta combined A_%s = %.4f +- %.4f  expected %.4f  (T-NR own coefficient at 3, 9 differs; see RESULT)' % (k, (w * v).sum() / w.sum(), 1 / math.sqrt(w.sum()), z[0]['A_n'][k][2]))
print('== combination 2: Var S ==')
Ls = []; Ks = []; Es = []
for r in rows:
    v = r['varS']
    print('%-6s T~%.3g n=%d VarS=%.6f+-%.6f (chunk-mean-removed %.6f) L=%.3f K[loglog(qT/2pi)]=%.4f+-%.4f K[loglog T]=%.4f S in [%.2f,%.2f]' % (v['name'], v['T_mid'], v['n_zeros'], v['var_S'], v['se'], v['var_S_chunk_mean_removed'], v['L_mean'], v['K_with_loglog_qT_over_2pi'], v['K_se'], v['K_with_loglog_T'], v['S_min'], v['S_max']))
    if 'tnr' in r: t = r['tnr']; print('        T-NR: Var S sampled %.6f, sawtooth var %.4f, cov %.5f, Var S_TNR (argument principle) %.5f' % (t['var_S_sampled'], t['var_saw'], t['cov'], t['var_S_TNR_argument_principle']))
    Kc = 2 * PI ** 2 * v['var_S_chunk_mean_removed'] - v['mean_loglog_qT_2pi'] - v['M_q'] - v['P2_q']
    print('        K from the chunk-mean-removed variance: %.4f   (K - 1) L^2 = %.3f' % (Kc, (Kc - 1) * v['L_mean'] ** 2))
    if v['name'].startswith('Z') and v['name'] != 'Z0': Ls.append(v['L_mean']); Ks.append(Kc); Es.append(max(v['K_se'], 1e-4))
if len(Ls) >= 3:
    Ls = np.array(Ls); Ks = np.array(Ks)
    for nm, X in (('K = K0 + c/L^2', np.stack([np.ones_like(Ls), 1 / Ls ** 2], 1)), ('K = K0 + c/L', np.stack([np.ones_like(Ls), 1 / Ls], 1))):
        co, res, *_ = np.linalg.lstsq(X, Ks, rcond=None)
        print('fit %s: K0 = %.4f, c = %.3f, rms residual %.5f' % (nm, co[0], co[1], float(np.sqrt(np.mean((X @ co - Ks) ** 2)))))
    print('fit K = 1 + c/L^2: c = %.3f rms %.5f' % (float(np.mean((Ks - 1) * Ls ** 2)), float(np.std((Ks - 1) * Ls ** 2 - np.mean((Ks - 1) * Ls ** 2)) / 1)))
print('== combination 4: J_1 ==')
c3 = G0 ** 2 - 2 * G1
for f in sorted(glob.glob('out/j1_Z*.json')) + ['out/j1_lz.json']:
    try: d = json.load(open(f))
    except Exception: continue
    for r in (d if isinstance(d, list) else [d]):
        l = r['l_mean']; gq = G0 + (math.log(5) / 4 if r['q'] == 5 else 0)
        m2 = l ** 3 / 12 + 2 * gq / 3 * l ** 2
        three = (m2 * r['ratio_two_term']) / (m2 + c3 * l) if r['q'] == 1 else float('nan')
        print('%-18s n=%d l=%.2f ratio: leading %.4f two-term %.4f (+-%.4f) three-term(zeta) %.4f residual/l %.3f | windows of 2000: sd %.4f range [%.3f, %.3f] outside[0.9,1.1] %.3f | windows of 200: sd %.3f outside %.3f' % (
            r['name'], r['n'], l, r['ratio_leading'], r['ratio_two_term'], r['se_ratio'] or 0, three, r['residual_over_l'], r['window_ratio_sd'] or 0, r['window_ratio_min'] or 0, r['window_ratio_max'] or 0, r['frac_windows_outside_0p9_1p1'] or 0, r.get('window_ratio_sd_200', 0), r.get('frac_outside_200', 0)))
        if 'tnr_ratio_J1' in r: print('        T-NR: J1 ratio to zeta %.4f (independent phases 6.84), weighted <cos g log3> %.4f, <cos 2g log3> %.4f, plain <cos> %.4f; window sd %.3f range [%.2f, %.2f]' % (r['tnr_ratio_J1'], r['weighted_mean_cos_g_log3'], r['weighted_mean_cos_2g_log3'], r['plain_mean_cos_g_log3'], r['tnr_window_ratio_sd'], r['tnr_window_ratio_min'], r['tnr_window_ratio_max']))
        print('        small gaps (Rolle): ' + ' '.join('c=%s: %d / GUE %.1f = %.3f+-%.3f' % (c, v['count'], v['gue'], v['ratio'], v['ratio'] * v['se']) for c, v in r['rolle'].items()))
