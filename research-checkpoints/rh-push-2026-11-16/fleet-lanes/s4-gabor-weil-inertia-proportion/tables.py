"""Compact markdown tables for RESULT.md from out/ (after rsync)."""
import json, glob, math, numpy as np
rows = [json.loads(l) for f in ('out/c1.jsonl', 'out/c1b.jsonl') for l in (open(f) if glob.glob(f) else []) if l.strip()]
A, Bw = 1.006113, 0.321406
def lab(r): return r['family'] + (' a=%g' % r['a'] if r['family'] == 'EA' else '')
def cell(r):
    P = r['prime_side']; n = r['n']
    return '%d (%.3g)' % (n - P['N_theta']['0.0'], P['lam_min'])
fams = ['ZETA', 'CHI5R', 'WT', 'DH', 'TNR', 'EA a=0.02', 'EA a=0.1', 'EA a=0.3', 'LIOU', 'RSGN', 'UNI']
main = [r for r in rows if r['nu0'] == r['T'] and 'c1b' not in r.get('src', '')]
# bandwidth relative to zeta's density at the same L: EA lam_own = lam/2
def lamz(r): return 2 * r['lam'] if r['family'] == 'EA' else r['lam']
print('#### T1: number of eigenvalues below 0 (smallest eigenvalue), prime side, one window per cell\n')
keys = sorted({(r['T'], lamz(r)) for r in rows if r['n'] != 24000})
print('| T | lam | n (zeta) | X (zeta) | prime powers (zeta) | ' + ' | '.join(fams) + ' |')
print('|' + '---|' * (5 + len(fams)))
for T, lz in keys:
    sel = {lab(r): r for r in rows if r['T'] == T and abs(lamz(r) - lz) < 1e-9 and r['n'] != 24000}
    z = sel.get('ZETA')
    print('| %g | %g | %s | %s | %s | ' % (T, lz, z['n'] if z else '-', ('%.4g' % z['X']) if z else '-', z['nterms'] if z else '-') + ' | '.join(cell(sel[f]) if f in sel else '-' for f in fams) + ' |')
print('\n#### T2: second moment: bound minus value, box window: (1/lam_eff + lam_eff/3) - m2/m1 (negative = bound exceeded)\n')
print('| T | lam | ' + ' | '.join(fams) + ' |')
print('|' + '---|' * (2 + len(fams)))
for T, lz in keys:
    sel = {lab(r): r for r in rows if r['T'] == T and abs(lamz(r) - lz) < 1e-9 and r['n'] != 24000}
    def c2(r):
        le = r['n'] / r['N_smooth']; P = r['prime_side']
        return '%+.4f' % (1 / le + le / 3 - P['m'][1] / P['m'][0])
    print('| %g | %g | ' % (T, lz) + ' | '.join(c2(sel[f]) if f in sel else '-' for f in fams) + ' |')
print('\n#### T3: Montgomery-Taylor window (J = 4 cosine approximation of sqrt(cos(sqrt2 s))), bandwidth 1, prime side: C = tr(G_w^2)/(w0 tr G_w)\n')
print('| family | T | n | X | terms | lam_eff | C measured | A/lam_eff + lam_eff B | bound - C | m2/m1^2 | m3/m1^3 | m4/m1^4 | mu5 |')
print('|' + '---|' * 13)
for r in sorted(rows, key=lambda r: (r['family'], r['T'])):
    if r['lam'] != 1.0 or r['n'] == 24000 or r['family'] in ('TNR', 'EA'): continue
    le = r['n'] / r['N_smooth']; b = A / le + le * Bw; m = r['prime_side']['m']
    mu5 = ''
    try:
        e = np.load('out/c1_%s_%g_%g_%d_a%g_s%d_ev.npy' % (r['family'], r['T'], r['lam'], r['n'], r['a'], r['seed'])); c = e - e.mean(); mu5 = '%+.4f' % (c ** 5).mean()
    except Exception: pass
    print('| %s | %g | %d | %.4g | %d | %.4f | %.5f | %.5f | %+.5f | %.4f | %.4f | %.4f | %s |' % (r['family'], r['T'], r['n'], r['X'], r['nterms'], le, r['mt']['C_meas'], b, b - r['mt']['C_meas'], m[1] / m[0] ** 2, m[2] / m[0] ** 3, m[3] / m[0] ** 4, mu5))
print('\n#### T4: consecutive windows at T = 1e5, n = 24000 each (block 4)\n')
print('| family | lam | window start | n | X | zeros in window (smooth) | listed on-line zeros | (smooth - listed)/2 | min eig | eig < 0 | eig < 0.1 | nearest eig to 0 | m2/m1 | bound | bound - value |')
print('|' + '---|' * 15)
tot = {}
for r in sorted(rows, key=lambda r: (r['family'], r['lam'], r['nu0'])):
    if r['n'] != 24000: continue
    P = r['prime_side']; n = r['n']; le = n / r['N_smooth']; liw = r.get('list_in_window')
    print('| %s | %g | %.1f | %d | %.4g | %.0f | %s | %s | %.4g | %d | %d | %.1e | %.4f | %.4f | %+.4f |' % (r['family'], r['lam'], r['nu0'], n, r['X'], r['N_smooth'], liw if liw is not None else '-',
          ('%.0f' % ((r['N_smooth'] - liw) / 2)) if liw is not None else '-', P['lam_min'], n - P['N_theta']['0.0'], n - P['N_theta']['0.1'], P['gap_theta']['0.0'], P['m'][1] / P['m'][0], 1 / le + le / 3, 1 / le + le / 3 - P['m'][1] / P['m'][0]))
    k = (r['family'], r['lam']); t = tot.setdefault(k, [0, 0, 0, 0.0]); t[0] += n; t[1] += n - P['N_theta']['0.0']; t[2] += 1; t[3] += ((r['N_smooth'] - liw) / 2) if liw is not None else 0
for k, t in tot.items(): print('\ntotal %s lam=%g: %d windows, dimension %d, eigenvalues below 0: %d, off-line pairs (smooth - listed)/2: %.0f' % (k[0], k[1], t[2], t[0], t[1], t[3]))
