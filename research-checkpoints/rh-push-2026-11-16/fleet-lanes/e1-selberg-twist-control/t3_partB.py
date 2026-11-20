"""Part B: PSL2(Z) Selberg zeta. Orders of Z at s = 1, 1/2, rho_1/2, 1/2 + i r_1 by the argument principle;
the same for Z(s)/zeta(2s); sign structure of the coupled Landau measure d(psi_Gamma - psi)."""
import sys, time, json, math, cmath
import numpy as np, mpmath as mp
sys.path.insert(0, 'tmp/research-2026-11-16/push/e1-selberg-twist-control')
from sel import *
out = {}; t0 = time.time()
def winding(f, c, r, n=96):
    vals = [f(c + r * cmath.exp(2j * math.pi * k / n)) for k in range(n)]
    ang = np.unwrap([cmath.phase(v) for v in vals + [vals[0]]])
    return (ang[-1] - ang[0]) / (2 * math.pi), min(abs(v) for v in vals)
Zc = {}
def Z(s):
    return Zmod(s, K=44)
def W(s):
    return Zmod(s, K=44) / complex(mp.zeta(2 * mp.mpmathify(s)))
g1 = 14.134725141734693790; r1 = 9.53369526135355755
pts = {'s=1': (1.0, 0.2), 's=1/2': (0.5, 0.2), 's=rho1/2': (complex(0.25, g1 / 2), 0.2), 's=1/2+i r1': (complex(0.5, r1), 0.2),
       's=0.75 (control point, no zero)': (0.75, 0.04)}
rows = []
for name, (c, r) in pts.items():
    wz, mz = winding(Z, c, r); ww, mw = winding(W, c, r)
    rows.append({'point': name, 'radius': r, 'ord_Z': wz, 'ord_Z_over_zeta(2s)': ww, 'min|Z| on circle': mz})
    print(json.dumps(rows[-1]), round(time.time() - t0, 1), flush=True)
out['orders'] = rows
for e in (1e-2, 1e-3, 1e-4):
    v = [(Z(0.5 + e) * e), (Z(0.5 - e) * (-e))]
    print('(s-1/2) Z(s) at 1/2 +- %g:' % e, v, flush=True); out['pole_half_%g' % e] = [str(x) for x in v]
print('Z(1) =', Z(1.0), ' Z(rho1/2) =', Z(complex(0.25, g1 / 2)), ' Z(1/2+i r1) =', Z(complex(0.5, r1)))
# convergence in K at one off-axis point
print('K-convergence Z(0.25+7i):', [Zmod(complex(0.25, 7.0), K=K) for K in (30, 38, 44, 50)])

# coupled Landau measure: psi_Gamma(x) - psi(x) for PSL2(Z); jumps
def geodesic_events(tmax):
    ev = []
    stack = [((1, 0, 0, 1), 0)]
    while stack:
        (p, q, r, t), k = stack.pop()
        n = 1
        while True:
            p1, q1, r1_, t1 = p, q + n * p, r, t + n * r
            m = 1; ok = False
            while True:
                p2, q2, r2, t2 = p1 + m * q1, q1, r1_ + m * t1, t1
                tr = p2 + t2
                if tr > tmax: break
                ok = True
                N = ((tr + math.sqrt(tr * tr - 4)) / 2) ** 2
                ev.append((N, math.log(N) / (k + 1)))
                stack.append(((p2, q2, r2, t2), k + 1)); m += 1
            if not ok: break
            n += 1
    ev.sort(); return ev
tmax = 1000
ev = geodesic_events(tmax)
Ns = np.array([e[0] for e in ev]); cg = np.cumsum([e[1] for e in ev])   # sum log N0 over gamma0^j, N <= x  (Ruelle weights)
X = int(Ns[-1])
lam = np.zeros(X + 1)
sieve = np.ones(X + 1, dtype=bool); sieve[:2] = False
for p in range(2, X + 1):
    if sieve[p]:
        sieve[p * p::p] = False
        q = p
        while q <= X: lam[q] = math.log(p); q *= p
psi = np.cumsum(lam)
tab = []
for x in (1e2, 1e3, 1e4, 1e5, 9.9e5):
    i = np.searchsorted(Ns, x, side='right') - 1
    pg = float(cg[i]) if i >= 0 else 0.0
    tab.append({'x': x, 'psi_Gamma': pg, 'psi': float(psi[int(x)]), 'diff': pg - float(psi[int(x)]), 'diff_over_sqrt_x': (pg - float(psi[int(x)])) / math.sqrt(x)})
    print(json.dumps(tab[-1]), flush=True)
out['psi_diff'] = tab
out['negative_jumps_below_first_geodesic'] = [n for n in range(2, 7) if lam[n] > 0]
out['count_negative_jumps_x<=1e5'] = int((lam[:100001] > 0).sum()); out['count_positive_jumps_x<=1e5'] = int((Ns <= 1e5).sum())
print(out['negative_jumps_below_first_geodesic'], out['count_negative_jumps_x<=1e5'], out['count_positive_jumps_x<=1e5'])
json.dump(out, open('tmp/research-2026-11-16/push/e1-selberg-twist-control/t3_partB.json', 'w'), indent=1, default=str)
