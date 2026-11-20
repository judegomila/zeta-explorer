"""Combination 1, zeta: the t = 0 rate bound (A5 of rh-bridge-mirror-descent-2026-09-25) on a grid of hypothetical zero
positions rho = beta + i gamma, x = beta - 1/2, y = 2x:
   B5(eta) = -1/y + 4y/(eta^2 - y^2) - (y/eta) [ Re arch(sigma + i gamma) + zeta'/zeta(sigma) ],  sigma = (1 + eta)/2, eta >= max(sqrt5 y, 1+)
with the exact archimedean term (the source uses ln N = (1/2) log(gamma/2pi) + O(1/gamma)).  W(eta) = -(y/eta)[...] is the
wide-Poisson term fed by the Euler product.  mpmath, 30 digits."""
import json, mpmath as mp
mp.mp.dps = 30
def arch(s): return (1 / s + 1 / (s - 1) - mp.log(mp.pi) / 2 + mp.digamma(s / 2) / 2).real
def zld(sig): return mp.zeta(sig, derivative=1) / mp.zeta(sig)
rows = []
xs = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4]
gs = [10 ** k for k in (2, 3, 4, 5, 6, 8, 10)]
for x in xs:
    y = 2 * mp.mpf(x)
    for g in gs:
        emin = max(mp.sqrt(5) * y, mp.mpf('1.0005'))
        def B(eta):
            sig = (1 + eta) / 2
            br = arch(mp.mpc(sig, g)) + zld(sig)
            return -1 / y + 4 * y / (eta * eta - y * y) - (y / eta) * br, -(y / eta) * br, br
        best = None
        for i in range(0, 1400):
            eta = emin * mp.mpf(1.004) ** i
            if eta > 60: break
            b, w, br = B(eta)
            if best is None or b < best[0]: best = (b, w, br, eta)
        b0, w0, br0 = B(emin)
        # smallest sigma at which the Euler bracket turns positive
        lo, hi = mp.mpf('1.0000001'), mp.mpf(40)
        f = lambda s: arch(mp.mpc(s, g)) + zld(s)
        for _ in range(80):
            m = (lo + hi) / 2
            if f(m) > 0: hi = m
            else: lo = m
        rows.append({'x': x, 'gamma': g, 'deBruijn': float(-1 / y), 'B5': float(best[0]), 'eta_opt': float(best[3]), 'W_opt': float(best[1]),
                     'bracket_opt': float(best[2]), 'eta_min': float(emin), 'bracket_at_eta_min': float(br0), 'W_at_eta_min': float(w0),
                     'B5_at_eta_min': float(b0), 'sigma_bracket_zero': float(hi), 'gain_over_deBruijn': float((-1 / y - best[0]) * y)})
json.dump(rows, open('out/grid1.json', 'w'), indent=0)
print('    x   gamma     -1/y        B5   eta_opt    W_opt  gain*y | bracket(eta_min)  W(eta_min)  sign  sigma0')
for r in rows:
    print('%6.3f %7.0e %9.3f %9.3f %8.3f %8.4f %7.4f | %10.3f %10.4f   %s  %7.4f' % (r['x'], r['gamma'], r['deBruijn'], r['B5'], r['eta_opt'], r['W_opt'], r['gain_over_deBruijn'], r['bracket_at_eta_min'], r['W_at_eta_min'], 'W>0 (no pull)' if r['W_at_eta_min'] > 0 else 'W<0', r['sigma_bracket_zero']))
