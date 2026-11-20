"""Decisive test: Poisson summation in k of the Lemma B residue sum, S = {p}.
 LHS  = (1/L) sum_{k != 0} (zeta'/zeta)(1+it_k) F(t_k),  t_k = 2 pi k/L, L = log p, F(t) = W(1/2+it) conj W(-1/2+it) = int h(x) e^{-itx} dx, h(x) = e^{-x/2} C_w(x)
 RHS  = -PrimeReg - (gamma/L) F(0) - int h(x) ({x/L} - 1/2) dx
 PrimeReg = lim_Y [ sum_{n <= e^Y} Lambda(n) n^-1/2 sum_j p^-j/2 C_w(jL - log n)  -  int_0^Y H(y) dy ],  H(y) = sum_j h(jL - y).
Also the full Lemma B at T = 0 with the k = 0 residue written out:
 zero side = arch + 2 Re (p/(p-1)) [ LHS + F(0)/(p-1) + (1/L) int x h(x) dx + (gamma/L + 1/2) F(0) ] + third line."""
import numpy as np, math, json, sys
from lib3 import *
def simpson(f, h): return h / 3 * (f[0] + f[-1] + 4 * np.sum(f[1:-1:2]) + 2 * np.sum(f[2:-1:2]))
def run(p, Tw, T, Xs, m=3, zero_check=False, g=None):
    L = math.log(p); out = dict(p=p, Tw=Tw, T=T, m=m)
    # grid for h
    N = 400000; xg = np.linspace(-Tw, Tw, N + 1); dx = xg[1] - xg[0]
    hg = np.exp(-xg / 2) * Cw(xg, T, Tw, m)
    F0 = simpson(hg, dx); F0d = (Wfun(np.array([0.5 + 0j]), T, Tw, m) * np.conj(Wfun(np.array([-0.5 + 0j]), T, Tw, m)))[0]
    saw = simpson(hg * ((xg / L) - np.floor(xg / L) - 0.5), dx) if False else None
    # sawtooth and floor integrals: split at the discontinuities x = jL
    def piecewise(fun):
        tot = 0.0; js = range(int(math.floor(-Tw / L)), int(math.floor(Tw / L)) + 1)
        for j in js:
            a, b = max(-Tw, j * L), min(Tw, (j + 1) * L)
            if b <= a: continue
            xx = np.linspace(a, b, 100001); tot += simpson(np.exp(-xx / 2) * Cw(xx, T, Tw, m) * fun(xx, j), xx[1] - xx[0])
        return tot
    sawI = piecewise(lambda xx, j: xx / L - j - 0.5)
    floorI = piecewise(lambda xx, j: j + 0 * xx)
    xhI = simpson(xg * hg, dx)
    # LHS
    om = 2 * math.pi * m / Tw; K = int((abs(T) + 30 * om) * L / (2 * math.pi)) + 1
    ks = np.array([k for k in range(-K, K + 1) if k != 0]); t = 2 * math.pi * ks / L
    Fk = Wfun(0.5 + 1j * t, T, Tw, m) * np.conj(Wfun(-0.5 + 1j * t, T, Tw, m))
    keep = np.abs(Fk) > 1e-19 * np.max(np.abs(Fk)); t = t[keep]; Fk = Fk[keep]
    ld = np.array([zlogder(x) for x in t])
    LHS = np.sum(ld * Fk) / L
    polesum = np.sum(Fk / (1j * t)) / L
    out.update(F0=[F0.real, F0.imag], F0_direct_err=abs(F0 - F0d), LHS=[LHS.real, LHS.imag], npts=int(len(t)),
               polesum_minus_saw=abs(polesum - sawI), sum_absF_over_L=float(np.sum(np.abs(Fk)) / L))
    # prime side
    Xmax = max(Xs); print('p', p, 'Tw', Tw, 'T', T, 'lattice pts', len(t), 'sieve to %.0e (%.0f MB bool)' % (Xmax, Xmax / 1e6), flush=True)
    n, lam = prime_powers(Xmax); logn = np.log(n)
    # cumulative of h for int_0^Y H
    cum = np.concatenate([[0], np.cumsum((hg[1:] + hg[:-1]) / 2 * dx)])  # trapezoid cumulative (N = 4e5: error ~ dx^2)
    cum += (F0 - cum[-1]) * (xg + Tw) / (2 * Tw)  # distribute the tiny trapezoid/Simpson mismatch
    def Ih(x):
        x = np.clip(x, -Tw, Tw); return np.interp(x, xg, cum.real) + 1j * np.interp(x, xg, cum.imag)
    rows = []
    for X in sorted(Xs):
        Y = math.log(X); sel = n <= X; S = 0j; jmax = int((Y + Tw) / L) + 1; jmin = int(math.floor(-Tw / L))
        IH = 0j
        for j in range(jmin, jmax + 1):
            lo = np.searchsorted(logn, j * L - Tw, 'left'); hi = np.searchsorted(logn, min(j * L + Tw, Y), 'right')
            if hi > lo:
                xx = j * L - logn[lo:hi]
                S += np.sum(lam[lo:hi] / n[lo:hi] * np.exp(-xx / 2) * Cw(xx, T, Tw, m))
            IH += Ih(np.array([j * L]))[0] - Ih(np.array([j * L - Y]))[0]
        PR = S - IH
        RHS = -PR - EULER / L * F0 - sawI
        rows.append(dict(X=X, prime_sum=[S.real, S.imag], intH=[IH.real, IH.imag], PrimeReg=[PR.real, PR.imag], RHS=[RHS.real, RHS.imag],
                         diff=abs(LHS - RHS), rel=abs(LHS - RHS) / abs(LHS), rel_to_sumabs=abs(LHS - RHS) / out['sum_absF_over_L']))
        print('   X %.0e  LHS %.10g%+.10gi  RHS %.10g%+.10gi  |diff| %.3e  rel %.2e  (|diff| sqrt X = %.3f)' % (X, LHS.real, LHS.imag, RHS.real, RHS.imag, abs(LHS - RHS), abs(LHS - RHS) / abs(LHS), abs(LHS - RHS) * math.sqrt(X)), flush=True)
    out['rows'] = rows
    # closed combined form: LHS + k0 pieces = -PrimeReg + int h floor(x/L) + F0 p/(p-1)
    k0_inside = F0 / (p - 1) + xhI / L + (EULER / L + 0.5) * F0
    comb_direct = LHS + k0_inside
    PRb = complex(*rows[-1]['PrimeReg']); comb_prime = -PRb + floorI + F0 * p / (p - 1)
    out.update(k0_inside=[k0_inside.real, k0_inside.imag], combined_direct=[comb_direct.real, comb_direct.imag], combined_prime=[comb_prime.real, comb_prime.imag])
    print('   combined (residues incl. k=0): direct %.10g  prime form %.10g' % (comb_direct.real, comb_prime.real), flush=True)
    if zero_check:
        X = 40 * om + abs(T); hh = min(0.002, 0.05 / Tw); tau = np.arange(-X, X, hh) + hh / 2
        print('   zero-side grid', tau.size, '(%.0f MB)' % (tau.size * 16 * 4 / 1e6), flush=True)
        f = np.abs(zS(0.5 + 1j * tau, [p])) ** 2 * np.abs(Wfun(1j * tau, T, Tw, m)) ** 2
        arch = hh * np.sum(f * Omega(tau)) / (2 * math.pi); den = hh * np.sum(f) / (2 * math.pi)
        gg = np.concatenate([g, -g]); gg = gg[np.abs(gg) < g[-1]]
        zero = float(np.sum(np.abs(zS(0.5 + 1j * gg, [p])) ** 2 * np.abs(Wfun(1j * gg, T, Tw, m)) ** 2))
        # third line
        third = 0.0; eT = math.exp(Tw); nterm = 0
        a = 0
        while p ** (a + 1) * 2 <= eT:
            bb = 0
            while p ** (a + 1 + bb) * 2 <= eT:
                for nn in range(2, int(eT / p ** (a + 1 + bb)) + 1):
                    lamn = 0.0
                    for q in range(2, nn + 1):
                        if all(q % d for d in range(2, int(q ** 0.5) + 1)):
                            r = nn
                            while r % q == 0: r //= q
                            if r == 1 and nn % q == 0: lamn = math.log(q)
                    if lamn:
                        third += 2 * (lamn * math.sqrt(p * p ** a / (p ** bb * nn)) * Cw(np.array([-math.log(p * p ** a * p ** bb * nn)]), T, Tw, m)[0]).real; nterm += 1
                bb += 1
            a += 1
        resid_no_k0 = 2 * (p / (p - 1)) * LHS.real; k0 = 2 * (p / (p - 1)) * k0_inside.real
        total = arch + resid_no_k0 + k0 + third
        out.update(zero_side=zero, arch=arch, den=den, residues_kne0=resid_no_k0, k0_term=k0, third=third, third_terms=nterm,
                   rel_full=(zero - total) / zero, rel_without_k0=(zero - total + k0) / zero)
        print('   FULL: zero %.12g arch %.12g residues(k!=0) %.12g k0 %.12g third %.6g (%d terms)  rel diff %.2e (without k0 term %.2e)' % (zero, arch, resid_no_k0, k0, third, nterm, out['rel_full'], out['rel_without_k0']), flush=True)
    return out
if __name__ == "__main__":
    g = zeta_zeros(); res = []
    Xs = [1e5, 1e6, 1e7, 1e8]
    for (p, Tw, T, zc) in [(2, 0.65, 0.0, True), (3, 1.05, 0.0, True), (2, 1.3, 0.0, True), (5, 1.6, 0.0, True), (2, 2.5, 0.0, True),
                           (2, 0.65, 40.0, False), (3, 1.05, 100.0, False), (7, 1.9, 60.0, False)]:
        res.append(run(p, Tw, T, Xs, zero_check=zc, g=g))
        json.dump(res, open(os.path.join(HERE, 'poisson_test.json'), 'w'), indent=1)
