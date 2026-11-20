"""Derived tables from the server output (out/ after rsync): effective bandwidth, second-moment bound, shortfalls, sign-twist reflection."""
import json, glob, math, numpy as np, gw
PI = math.pi
rows = [json.loads(l) for f in sorted(glob.glob('out/c1*.jsonl')) for l in open(f) if l.strip()]
# A(w), B(w): C_lam(w) = A/lam + lam B
s = np.linspace(-0.5, 0.5, 20001); q, Cw, Cs = gw.mt_window(4)
p = q[0] + 2 * sum(q[j] * np.cos(2 * PI * j * s) for j in range(1, 5)); w = p * p
A = float(np.trapezoid(w * w, s) / np.trapezoid(w, s) ** 2); Bw = Cw - A
print('J4 window: A = %.6f, B = %.6f, C = %.6f; box: A = 1, B = 1/3' % (A, Bw, Cw))
def key(r): return (r['T'], r['family'], r.get('a', 0), r['lam'], r['nu0'])
print('\n| family | T | nu0 | lam | n | X | prime powers | zeros in window (smooth) | lam_eff | min eig | n - N_0 | n - N_0.1 | nearest eig to 0 | m2/m1 | bound 1/lam_eff + lam_eff/3 | bound - value | C_mt | bound A/lam_eff + lam_eff B | bound - value | listed (on-line) zeros | (smooth - listed)/2 |')
print('|' + '---|' * 21)
out = []
for r in sorted(rows, key=key):
    P = r['prime_side']; n = r['n']; le = n / r['N_smooth']
    b1 = 1 / le + le / 3; v1 = P['m'][1] / P['m'][0]
    fam = r['family'] + (' a=%g' % r['a'] if r['family'] == 'EA' else '')
    if 'mt' in r:
        le2 = r['mt']['dim'] / (r['N_smooth'] * r['mt']['dim'] / n); b2 = A / le2 + le2 * Bw; v2 = r['mt']['C_meas']
    liw = r.get('list_in_window')
    print('| %s | %g | %.6g | %g | %d | %.4g | %d | %.0f | %.4f | %.4f | %d | %d | %.1e | %.4f | %.4f | %+.4f | %.4f | %.4f | %+.4f | %s | %s |' % (
        fam, r['T'], r['nu0'], r['lam'], n, r['X'], r['nterms'], r['N_smooth'], le, P['lam_min'], n - P['N_theta']['0.0'], n - P['N_theta']['0.1'], P['gap_theta']['0.0'],
        v1, b1, b1 - v1, v2, b2, b2 - v2, liw if liw is not None else '-', ('%.0f' % ((r['N_smooth'] - liw) / 2)) if liw is not None else '-'))
# zero-side comparisons
print('\n| family | T | lam | n | listed zeros in window | max entry diff prime - list | eig of difference: n(>0.1), n(<-0.1), n(>1), n(<-1) | list-side min eig | list-side m2/m1 |')
print('|' + '---|' * 9)
for r in sorted(rows, key=key):
    if 'diff' not in r: continue
    d = r['diff']; z = r['zero_side']
    print('| %s | %g | %g | %d | %d | %.3g | %d, %d, %d, %d | %.4g | %.4f |' % (r['family'], r['T'], r['lam'], r['n'], r['list_in_window'], r['diff_absmax'], d['n_above']['0.1'], d['n_below']['0.1'], d['n_above']['1.0'], d['n_below']['1.0'], z['lam_min'], z['m'][1] / z['m'][0]))
# sign-twist reflection: spectrum(LIOU) against 2 m1 - spectrum(ZETA)
print('\nsign-twist reflection (same T, lam, n): eigenvalues of the twist against 2*mean - eigenvalues of zeta, sorted')
for f in sorted(glob.glob('out/c1*_LIOU_*_ev.npy')) + sorted(glob.glob('out/c1*_UNI_*_ev.npy')) + sorted(glob.glob('out/c1*_RSGN_*_ev.npy')):
    fam = 'LIOU' if '_LIOU_' in f else ('UNI' if '_UNI_' in f else 'RSGN')
    fz = f.replace('_%s_' % fam, '_ZETA_')
    try: ez = np.sort(np.load(fz)); el = np.sort(np.load(f))
    except Exception: continue
    refl = np.sort(2 * ez.mean() - ez)
    print('  %s: twist min %.4f, n_neg %d | reflected zeta: min %.4f, n_neg %d | max |sorted difference| %.3f, rms %.4f | zeta eig above 2*mean: %d' % (
        f.split('/')[-1], el[0], (el < 0).sum(), refl[0], (refl < 0).sum(), np.abs(el - refl).max(), np.sqrt(np.mean((el - refl) ** 2)), (ez > 2 * ez.mean()).sum()))
