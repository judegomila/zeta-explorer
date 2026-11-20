"""Ball-arithmetic re-evaluation (python-flint acb, 160 bits) of a float64 survivor.
usage: arbcheck.py T layout m delta theta.npy [DV]
For the unimodular completely multiplicative a(n) defined by theta (float64 values taken as exact), evaluates
A_X(s)[a] = (DV/2pi) sum_u G1(u) X^u D(s+u) + chi(s) (DV/2pi) sum_u G2(u) X^-u Dc(1-s+u),  D(w) = sum a(n) n^-w, Dc(w) = sum conj(a(n)) n^-w,
at off-grid points of each of the m windows and at s0, for X in {1/R, 1/sqrt R, 1, sqrt R, R}; reports max |A_X - A_1| and |A_1(s0)|.
The balls enclose the trapezoid sums (rounding only); the quadrature step is checked by running DV = 0.1 and 0.05."""
import sys, json, numpy as np
from flint import acb, arb, ctx
from mw import primes_upto, expo_matrix, heights, C0, H
ctx.prec = 160
T = float(sys.argv[1]); layout = sys.argv[2]; m = int(sys.argv[3]); delta = float(sys.argv[4]); th = np.load(sys.argv[5]); DV = float(sys.argv[6]) if len(sys.argv) > 6 else 0.1
BETA = arb("0.003"); VMAX = (36.0 / 0.003)**0.5; nv = int(round(2 * VMAX / DV)) + 1
N = int(round(3.2 * np.sqrt(T / (2 * np.pi)))); ps = primes_upto(N); E = expo_matrix(N, ps).astype(int)
tharb = [arb(float(x)) for x in th]
phi = [sum((int(E[n, i]) * tharb[i] for i in np.nonzero(E[n])[0]), arb(0)) for n in range(N)]
a = [acb(0, 1).__mul__(acb(p)).exp() for p in phi]; ac = [x.conjugate() for x in a]
logn = [arb(n).log() for n in range(1, N + 1)]; pi = arb.pi(); I = acb(0, 1)
def lg(s): return -s * pi.log() / 2 + (s / 2).lgamma()
def AX(s, Xs):
    us = [acb(arb("0.5"), arb(-VMAX + k * DV)) for k in range(nv)]
    S1 = [acb(0)] * len(Xs); S2 = [acb(0)] * len(Xs); lgs = lg(s); lg1s = lg(1 - s); lX = [arb(X).log() for X in Xs]
    for u in us:
        G1 = (lg(s + u) - lgs + BETA * u * u - I * pi * u / 4).exp() / u
        G2 = (lg(1 - s + u) - lg1s + BETA * u * u + I * pi * u / 4).exp() / u
        w1 = -(s + u); w2 = -(1 - s + u); D = acb(0); Dc = acb(0)
        for n in range(N):
            D += a[n] * (w1 * logn[n]).exp(); Dc += ac[n] * (w2 * logn[n]).exp()
        for i in range(len(Xs)):
            S1[i] += G1 * (u * lX[i]).exp() * D; S2[i] += G2 * (-u * lX[i]).exp() * Dc
    chi = (lg1s - lgs).exp(); c = arb(DV) / (2 * pi)
    return [c * (S1[i] + chi * S2[i]) for i in range(len(Xs))]
out = dict(T=T, layout=layout, m=m, delta=delta, DV=DV, N=N, file=sys.argv[5], windows=[])
hs = heights(T, layout, max(m, 2))[:m]; worst = 0.0; rad = 0.0
for Tj in hs:
    R = N / (C0 * np.sqrt(Tj / (2 * np.pi))); Xs = [1 / R, R**-0.5, 1.0, R**0.5, R]
    for t in (Tj + 0.37, Tj + 1.63):
        v = AX(acb(arb("0.5"), arb(t)), Xs); d = [abs(x - v[2]) for x in v]
        dm = max(float(x.upper()) for x in d); worst = max(worst, dm); rad = max(rad, max(float(x.rad()) for x in d))
        out["windows"].append(dict(Tj=Tj, t=t, max_defect_upper=dm, absA1=float(abs(v[2]).mid()))); print(out["windows"][-1], flush=True)
R = N / (C0 * np.sqrt(T / (2 * np.pi))); Xs = [1 / R, R**-0.5, 1.0, R**0.5, R]
v = AX(acb(arb(0.5 + delta), arb(T + H / 2)), Xs)
out.update(max_defect_upper=worst, max_ball_radius=rad, absF_s0_upper=float(abs(v[2]).upper()), s0_xindep_upper=max(float(abs(x - v[2]).upper()) for x in v))
print(json.dumps({k: out[k] for k in out if k != "windows"})); open("arbcheck.jsonl", "a").write(json.dumps(out) + "\n")
