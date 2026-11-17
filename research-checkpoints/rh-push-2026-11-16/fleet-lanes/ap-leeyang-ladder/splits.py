"""Hermite-Biehler splits xi = A + A^# on the critical line; boundary-phase test.
(1) smooth AFE split A_lam(s) = (1/2 pi i) int_(c) xi(s+w) exp(lam^2 w^2) dw/w
(2) sharp theta cut (Riesz projection) A(s) = sum_n pi^{-s/2} n^{-s} Gamma(s/2, pi n^2) - 1/(1-s)
(3) Jensen polynomials, shift 0.
zeta and Davenport-Heilbronn.  mpmath for function values, float64 convolution.
Necessary condition for |A^#/A| <= 1 on Re s > 1/2: arg A(1/2+it) nondecreasing in t.
"""
import json, math, sys
import numpy as np
import mpmath as mp
mp.mp.dps = 25
KAP = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
CH = [0, 1, 1j, -1j, -1]; CHB = [0, 1, -1j, 1j, -1]

def xi_zeta(s):
    return s * (s - 1) / 2 * mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
def f_dh(s):
    return ((1 - 1j * KAP) * mp.dirichlet(s, CH) + (1 + 1j * KAP) * mp.dirichlet(s, CHB)) / 2
def xi_dh(s):
    return (5 / mp.pi) ** (s / 2) * mp.gamma((s + 1) / 2) * f_dh(s)

out = {}
# --- validation of the DH control
s0 = mp.mpc('0.31', '7.3')
out['dh_FE_relerr'] = float(abs(xi_dh(s0) - xi_dh(1 - s0)) / abs(xi_dh(s0)))
z0 = mp.findroot(f_dh, mp.mpc('0.8085171825', '85.6993484854'))
out['dh_offline_zero'] = [float(z0.real), float(z0.imag), float(abs(f_dh(z0)))]
print('DH check', out['dh_FE_relerr'], out['dh_offline_zero'], flush=True)

# --- (1) smooth AFE split
c = 0.25; h = 0.02; TA = -16.0; TB = 146.0
taus = np.arange(TA, TB + h / 2, h)
res = {}
for name, xi in (('zeta', xi_zeta), ('dh', xi_dh)):
    g = np.array([complex(xi(mp.mpc(0.5 + c, float(t)))) for t in taus])
    line = None
    rows = {}
    for lam in (0.5, 1.0, 2.0, 4.0, 8.0):
        V = min(14.0, 7.5 / lam)
        v = np.arange(-V, V + h / 2, h)
        K = np.exp(lam ** 2 * (c + 1j * v) ** 2) / (c + 1j * v)
        # A(t) = (h/2pi) sum_v g(t+v) K(v)
        A = np.correlate(g, np.conj(K), mode='valid') * h / (2 * math.pi)   # sum g[i+j] K[j]
        tA = taus[0] + V + h * np.arange(len(A))
        sel = (tA >= 10.0) & (tA <= 125.0)
        tA = tA[sel]; A = A[sel]
        if line is None or len(line[0]) != len(tA):
            idx = np.arange(0, len(tA), 250)
            line = (idx, np.array([complex(xi(mp.mpc(0.5, float(tA[i])))) for i in idx]))
        idx, X = line
        val = float(np.max(np.abs(2 * A[idx].real - X.real) / (np.abs(A[idx]) + 1e-300)))
        ph = np.unwrap(np.angle(A)); d = np.diff(ph) / h
        neg = d < 0
        starts = np.where(neg & ~np.r_[False, neg[:-1]])[0]
        rows[str(lam)] = dict(identity_relerr=val, n_decreasing_intervals=int(len(starts)),
                              first_decreasing_t=(float(tA[starts[0]]) if len(starts) else None),
                              decreasing_starts=[round(float(tA[i]), 2) for i in starts[:40]],
                              frac_decreasing=float(np.mean(neg)), min_dphase=float(d.min()),
                              total_phase_over_pi=float((ph[-1] - ph[0]) / math.pi),
                              sign_changes_of_X=int(np.sum(np.sign(A.real[1:]) != np.sign(A.real[:-1]))))
        print(name, lam, rows[str(lam)], flush=True)
    res[name] = rows
out['smooth_afe'] = res

# --- (2) sharp cut
def A_sharp(s, kind):
    if kind == 'zeta':
        tot = mp.mpf(0)
        for n in range(1, 8):
            tot += mp.pi ** (-s / 2) * n ** (-s) * mp.gammainc(s / 2, mp.pi * n * n)
        return tot - 1 / (1 - s)
sh = []
prev = None
for t in np.arange(8.0, 60.01, 0.5):
    s = mp.mpc(0.5, float(t)); a = A_sharp(s, 'zeta')
    xs = mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
    sh.append([float(t), float(a.real), float(a.imag), float(abs(2 * a.real - xs.real) / abs(xs))])
out['sharp_cut_zeta'] = sh
ang = np.array([math.atan2(r[2], r[1]) for r in sh])
out['sharp_cut_phase_range_minus_halfpi'] = [float(np.min(ang - math.pi / 2)), float(np.max(ang - math.pi / 2))]
print('sharp', out['sharp_cut_phase_range_minus_halfpi'], sh[0], sh[-1], flush=True)

# --- (3) Jensen, shift 0
mp.mp.dps = 60
jr = {}
for name, xi in (('zeta', xi_zeta), ('dh', xi_dh)):
    D = 16
    co = mp.taylor(lambda z: xi(mp.mpf(1) / 2 + 1j * z), 0, 2 * D)
    gam = [mp.factorial(k) * co[2 * k].real * (-1) ** k for k in range(D + 1)]
    rows = {}
    for d in range(2, D + 1, 2):
        poly = [mp.binomial(d, j) * gam[j] for j in range(d, -1, -1)]
        rts = mp.polyroots(poly, maxsteps=400, extraprec=400)
        rows[d] = int(sum(1 for r in rts if abs(r.imag) > mp.mpf(10) ** (-20) * (1 + abs(r))))
    jr[name] = rows
    print('jensen', name, rows, flush=True)
out['jensen_nonreal_roots_shift0'] = jr
json.dump(out, open(sys.argv[1], 'w'), indent=1)
