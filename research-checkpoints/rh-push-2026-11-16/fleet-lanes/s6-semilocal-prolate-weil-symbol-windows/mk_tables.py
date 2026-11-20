#!/usr/bin/env python3
"""tables.md from the JSON outputs (out1, out2, out3, out3_local, out4, out4_local, out4arb)"""
import json, glob, os, math
L = []
def P(s=''): L.append(s)
def fmt(x, f='%.4g'): return '-' if x is None else f % x
# ---------------- combination 1
rows = {}
for dd in ('out1', 'out1_local'):
    for fn in glob.glob(dd + '/c1_*.json'):
        r = json.load(open(fn)); r['where'] = 'server' if dd == 'out1' else 'local'; rows[(r['family'], r['k'], r['delta'], dd)] = r
P('## T1. Combination 1: A_S = P_1 F_S P_1, S = {inf, 2, ..., p_k}\n')
P('Columns: gap = 1 - sup abs(lambda) (singular value for the complex family uni); lambda_2 = second largest modulus; Sigma = sum abs(lambda)^3 / sqrt(1 - lambda^2) (converged top states exactly + stochastic Lanczos quadrature on the complement, error = standard error over probes); Tr3 = sum abs(lambda)^3; Tr4 = sum lambda^4; model = (1/4)(prod G_p - 1) and (1/8)(prod (1-1/p)^-1 - 1) of imp-96143 (tail only, zeta-type factors).\n')
P('| family | k | delta | grid points | gap | lambda_2 | Sigma | Sigma error | Tr3 | Tr3 minus two top states | model cubic tail | Tr4 | Tr4 minus two top | model quartic tail | sum of lambda^2 on the complement | seconds | device |')
P('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for key in sorted(rows, key=lambda k: (k[0] != 'arch', k[0] != 'zeta', k[0], -k[2], k[1], k[3])):
    r = rows[key]; v = sorted([abs(x) for x in r['values']], reverse=True); m = max(int(k[1:]) for k in r if k.startswith('m') and k[1:].isdigit())
    t2 = sum(x ** 3 for x in v[:2]); q2 = sum(x ** 4 for x in v[:2])
    P(f"| {r['family']} | {r['k']} | {r['delta']:g} | {r['L']} | {r['gap']:.6e} | {v[1]:.8f} | {r['Sigma']:.3f} | {r['Sigma_err']:.3f} | {r['Tr3']:.4f} | {r['Tr3']-t2:.4f} | {r['model_tail3']:.4f} | {r['Tr4']:.4f} | {r['Tr4']-q2:.4f} | {r['model_tail4']:.4f} | {r['tr2_rest'][0]:.1f} | {r['seconds']:.0f} | {r['where']} {'GPU' if r['gpu'] else 'CPU'} |")
P()
# ---------------- combination 2
P('## T2. Combination 2: negative set of w_P on [0, 1e4] and crude certificates, band a = (1/2) log(P+)\n')
P('Columns: w(0); windows = number of maximal intervals of [0, T] with w < 0; frac = their share of [0, T]; width max / median; depth = -min w; median of the window minima; mu_0 = largest eigenvalue of 1_N B_a 1_N for N = {w < 0} (two-sided); bathtub = (a/pi) * integral of the symbol over its lowest set of measure pi/a (floor of the form per unit norm); sigma_2 columns: same for (t^2+1/4)^2 w (pole-free subspace). "cert" = the smallest value over the tested levels m of mu_m (m + D)/m; a certificate needs a value below 1. Levels: m/D = 0.01 .. 3 (sigma_2) and m = 0.1 .. 10 (w) for zeta and p2only; m/D = 0.1, 1 (sigma_2) and m = 1, 10 (w) for the other objects, so entries 1.333 and 2 are the value (1 + D/m) reached with mu_m = 1. For P >= 30 the sigma_2 depth is attained near the end of the t-range and depends on T.\n')
P('| object | P | 2a = log(P+) | w(0) | windows | frac % | width max | width median | depth | median window min | mu_0 | bathtub (w) | cert (w) | depth (sigma_2) | at t | bathtub (sigma_2) | cert (sigma_2) |')
P('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for o in ('p2only', 'zeta', 'chim4', 'chi5', 'ea0.2', 'tnr', 'dh', 'liou', 'uni'):
    fn = f'out2/c2_{o}.json'
    if not os.path.exists(fn): continue
    for x in json.load(open(fn)):
        p, s = x['plain'], x['sigma2']
        P(f"| {o} | {x['P']} | {2*x['a']:.4f} | {x['w0']:+.3f} | {x['windows_0T']} | {100*x['measure_0T']/1e4:.2f} | {p['width_max']:.3f} | {p['width_median']:.3f} | {p['depth']:.4g} | {p['median_window_min']:.3f} | {p['levels'][0]['mu'] if p['levels'] else 0:.6f} | {p['bathtub_floor']:.5g} | {fmt(p['best_ratio'])} | {s['depth']:.5g} | {s['argmin']:.1f} | {s['bathtub_floor']:.6g} | {fmt(s['best_ratio'])} |")
P()
fn = 'out2/c2_p2only.json'
if os.path.exists(fn):
    x = json.load(open(fn))[-1]
    P('First windows of the symbol with all powers of 2 up to 2^19 (source: [0, 3.597), minimum -8.719; six p = 2 windows of widths 1.730 to 0.650 and depths -2.981 to -1.188):\n')
    P('| lo | hi | width | min |'); P('|---|---|---|---|')
    for w in x['first_windows']: P(f"| {w['lo']:.3f} | {w['hi']:.3f} | {w['width']:.3f} | {w['min']:.3f} |")
    P()
# ---------------- combination 3
P('## T3. Combination 3: trace-side multiplier and the region in the local parameter\n')
P('T3a. Consistent swaps, one prime p = 2 (and zeta at p = 3): Lhat = 2theta\' + 2Re L_p\'/L_p + deltahat of the swapped operator, minimum over the t-range.\n')
P('| kernel | Lhat(0) | deltahat(0) | min of Lhat | at t | t-range | spikes | source-style variant |'); P('|---|---|---|---|---|---|---|---|')
def keyf(fn):
    r = json.load(open(fn)); s = r['spec']; return (r['p'], 9 if s == 'dropcos' else float(s.split(':')[1]))
for d in ('out3',):
    for fn in sorted(glob.glob(f'{d}/c3sym_*.json'), key=keyf):
        r = json.load(open(fn)); ex = ''
        if 'flip_m2_only' in r: ex = f"sign of m_2 flipped, deltahat of zeta kept: min {r['flip_m2_only']['min']:+.4f} at t = {r['flip_m2_only']['at']:.2f}"
        if 'with_zeta_m2' in r: ex = 'kernel without the -cos(pi t) term (not unitary), m_2 of zeta'
        P(f"| {r['spec']} at p = {r['p']} | {r['L0']:+.5f} | {r['hat0']:.5f} | {r['minL']:+.5f} | {r['argmin']:.3f} | [0, {r['TMAX']:g}] step {r['TSTEP']:g} | {r['KMAX']} | {ex} |")
P()
if os.path.exists('out3/c3map.json'):
    r = json.load(open('out3/c3map.json'))
    P(f"T3b. Source-style map (Euler term of 1/(1 - alpha 2^-s), remainder of zeta kept), {r['G']} x {r['G']} grid on [-1.5, 1.5]^2, {r['tpoints']} t-points on [0, {r['tmax']:g}] (both signs of t):\n")
    P(f"- minimum at alpha = 1: {r['min_at_alpha1']:+.5f}; cells inside the region: {r['cells_inside']} (area {r['area']:.4f}); bounding box Re alpha in [{r['region_bbox'][0]:.3f}, {r['region_bbox'][1]:.3f}], Im alpha in [{r['region_bbox'][2]:.3f}, {r['region_bbox'][3]:.3f}]")
    P(f"- distance from alpha = 1 to the boundary (64 rays, exact minimum over all t-points): {r['dist']:.5f} at angle {r['dist_angle']:.3f}; largest difference between binned and exact minima at the named points: {r['bin_error_max']:.1e}")
    P('- minimum of the multiplier at named parameters: ' + ', '.join(f"{k}: {v:+.4f}" for k, v in r['values'].items()))
    P('- boundary distance along rays from alpha = 1 (angle: distance): ' + ', '.join(f"{a:.2f}: {'>0.4' if d is None else '%.4f' % d}" for a, d in r['rays'][::4]))
    P()
for fn in sorted(glob.glob('out3_local/c3corner_N*.json')):
    r = json.load(open(fn))
    P(f'T3c. Pencil Arch - sum x_n C_n P_n on the pole-free subspace ({os.path.basename(fn)}); k = dimension of the low-moment corner (first k pole-free Legendre directions).\n')
    P('Support 2a = ln 3 (only n = 2; region = strip x_- <= Re alpha_2 <= x_+):\n')
    P('| k | lambda_min at alpha = 1 | x_- | x_+ | distance of 1 from the boundary | share of abs(ghat)^2 of the binding direction in (8.145, 9.875) | share in [0, 3.597) |'); P('|---|---|---|---|---|---|---|')
    for x in r['ln3']: P(f"| {x['k']} | {x['lmin_x1']:.6e} | {x['xminus']:.5f} | {x['xplus'] if x['xplus'] < 79 else float('inf'):.6f} | {x['dist']:.6f} | {fmt(x.get('window_fraction'), '%.4f')} | {fmt(x.get('arch_window_fraction'), '%.4f')} |")
    P(); P('Support 2a = ln 4 (n = 2, 3; region in (x_2, x_3) = (Re alpha_2, Re alpha_3), grid 200 x 200 on [-3, 3]^2):\n')
    P('| k | lambda_min at (1, 1) | area of the region | distance of (1, 1) from the boundary | lambda_min at (-1, 1) | at (-1, -1) | at (0, 1) |'); P('|---|---|---|---|---|---|---|')
    for x in r['ln4']: P(f"| {x['k']} | {x['lmin_11']:.4e} | {x['area']:.4f} | {x['dist']:.4e} | {x['sign2']:+.4f} | {x['sign23']:+.4f} | {x['drop2']:+.4f} |")
    P(); P('Support 2a = 1.5 (n = 2, 3, 4; complex alpha_2 with x_2 = Re alpha, x_4 = Re alpha^2; alpha_3 = 1; grid 200 x 200 on [-1.5, 1.5]^2):\n')
    P('| k | area of the region | distance of alpha = 1 from the boundary | ' + ' | '.join(r['a1.5'][0]['values'].keys()) + ' |'); P('|---|---|---|' + '---|' * len(r['a1.5'][0]['values']))
    for x in r['a1.5']: P(f"| {x['k']} | {x['area']:.5f} | {x['dist']:.4e} | " + ' | '.join('%+.3e' % v for v in x['values'].values()) + ' |')
    P()
# ---------------- combination 4
P('## T4. Combination 4: Weil form on Gaussian graph classes at u = log n, n <= M (all integers)\n')
P('T4a. float64 screen (Jacobi-scaled leading blocks; a negative eigenvalue of Z = an extra positive eigenvalue of the intersection form). onset = first M with lambda_min/lambda_max < -1e-10.\n')
P('| object | width s | M reached | onset M* | log M* | lambda_min/lambda_max at M reached | negative eigenvalues below -1e-10 lambda_max at M reached | numerical rank (1e-10) at M reached | machine |'); P('|---|---|---|---|---|---|---|---|---|')
for d, mach in (('out4_local', 'local CPU'), ('out4', 'server (GPU for M <= 6144, CPU for M = 16384)')):
    for fn in sorted(glob.glob(f'{d}/c4_*.json')):
        r = json.load(open(fn)); last = [x for x in r['rows'] if 'M' in x][-1]
        P(f"| {r['obj']} | {r['s']:g} | {r['MMAX']} | {fmt(r['onset'], '%d')} | {fmt(math.log(r['onset']) if r['onset'] else None, '%.3f')} | {last['rel']:+.3e} | {last['n_neg_1e10']} | {last['rank_1e10']} | {mach} |")
P()
P('T4b. Certified inertia (ball arithmetic, code of push/box-hodge-signature with all integers n <= X as nodes).\n')
P('| object | width s | X (nodes 1..X) | stages certified | extra positive eigenvalues | first node with an extra positive eigenvalue | min log10 abs pivot | digits |'); P('|---|---|---|---|---|---|---|---|')
for fn in sorted(glob.glob('out4arb/*.json')):
    r = json.load(open(fn))
    P(f"| {r['obj']} | {r['s']} | {r['X']} | {r['determined']}/{r['n']} | {len(r['pos_pivot_stages'])} | {fmt(r['first_pos_q'], '%d')} | {fmt(r['min_log10_abs_pivot'], '%.1f')} | {r['dps']} |")
P()
open('tables.md', 'w').write('\n'.join(L) + '\n'); print('tables.md written,', len(L), 'lines')
