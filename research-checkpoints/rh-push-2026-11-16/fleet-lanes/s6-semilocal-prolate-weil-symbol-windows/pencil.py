#!/usr/bin/env python3
"""Combination 4: Weil quadratic forms on L^2(-a,a) (orthonormal Legendre Galerkin, N modes), g real, h = g * g~.
  Arch_k(h) = (1/2pi) int hhat(t) [Re psi(k/2 + 1/4... ) ] : even (zeta) Re psi(1/4+it/2) - log pi ; odd Re psi(3/4+it/2) - log pi
            = -(gamma + log pi) h(0) + 2 int_0^inf [ e^{-2u} h(0) - e^{-e0 u} h(u) ] / (1 - e^{-2u}) du,  e0 = 1/2 (even), 3/2 (odd)
  P_n(h)    = h(log n) + h(-log n)        (prime-power term enters as Lambda(n)/sqrt(n) * P_n)
  Pole(h)   = hhat(i/2) + hhat(-i/2) = 2 ghat(i/2) ghat(-i/2)
  zeta: W = Pole + Arch - sum Lambda(n)/sqrt n P_n ; on the pole-free subspace (ghat(+-i/2) = 0) W = Arch - sum.
h(u) = c^T H(u) c with H_mn(u) = int phi_m(v) phi_n(v+u) dv, a polynomial in u on (0, 2a): all u-integrals by Gauss-Legendre.
usage: pencil.py MODE N [OUT]"""
import sys, math, json, os, time
import numpy as np
EULER = 0.5772156649015329; LOGPI = math.log(math.pi)
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)

def legendre(N, a, u):
    """orthonormal Legendre on [-a,a] at points u: array (len(u), N)"""
    x = np.asarray(u) / a; P = np.zeros((len(x), N)); P[:, 0] = 1.0
    if N > 1: P[:, 1] = x
    for n in range(1, N - 1): P[:, n + 1] = ((2 * n + 1) * x * P[:, n] - n * P[:, n - 1]) / (n + 1)
    return P * np.sqrt((2 * np.arange(N) + 1) / (2 * a))[None, :]

class Forms:
    def __init__(self, a, N):
        self.a = a; self.N = N
        self.gv, self.gwv = np.polynomial.legendre.leggauss(N + 8)
    def H(self, u):
        """symmetrised autocorrelation matrix Hs(u), 0 <= u < 2a"""
        a, N = self.a, self.N
        if u >= 2 * a: return np.zeros((N, N))
        lo, hi = -a, a - u; h = (hi - lo) / 2; v = lo + h + h * self.gv
        F1 = legendre(N, a, v); F2 = legendre(N, a, v + u)
        M = F1.T @ (F2 * (h * self.gwv)[:, None])
        return 0.5 * (M + M.T)
    def arch(self, e0=0.5):
        a, N = self.a, self.N
        nq = 2 * N + 48
        gx, gw = np.polynomial.legendre.leggauss(nq); u = a + a * gx; w = a * gw     # nodes on (0, 2a)
        # scalar part: -gamma - log pi + 2 int_0^inf (e^{-2u} - e^{-e0 u} 1_{u<2a})/(1-e^{-2u}) du
        cst = -EULER - LOGPI + 2 * np.sum(w * (np.exp(-2 * u) - np.exp(-e0 * u)) / (-np.expm1(-2 * u))) - math.log(-math.expm1(-4 * a))
        A = cst * np.eye(N)
        k = 2 * np.exp(-e0 * u) / (-np.expm1(-2 * u))
        I = np.eye(N)
        for i in range(nq): A += (w[i] * k[i]) * (I - self.H(u[i]))
        return A
    def pole_vecs(self):
        gx, gw = np.polynomial.legendre.leggauss(self.N + 40); u = self.a * gx; w = self.a * gw
        F = legendre(self.N, self.a, u)
        return F.T @ (w * np.exp(-u / 2)), F.T @ (w * np.exp(u / 2))
    def expmul(self, s, Nbig):
        """matrix (Nbig x N) of multiplication by e^{s u} from the N-basis into the Nbig-basis"""
        gx, gw = np.polynomial.legendre.leggauss(Nbig + self.N + 40); u = self.a * gx; w = self.a * gw
        return legendre(Nbig, self.a, u).T @ (legendre(self.N, self.a, u) * (w * np.exp(s * u))[:, None])

def complement(vecs, N):
    if not vecs: return np.eye(N)
    Q, _ = np.linalg.qr(np.array(vecs).T, mode='complete')
    return Q[:, len(vecs):]
def lmin(M, B=None):
    if B is not None: M = B.T @ M @ B
    return float(np.linalg.eigvalsh(0.5 * (M + M.T))[0])
def interval(Afn, lo0, hi0, x_in):
    """admissible set {x : lmin(Afn(x)) >= 0} is an interval (lmin is concave in x); bisect both ends starting from x_in"""
    if lmin(Afn(x_in)) < 0: return None
    def edge(far):
        if lmin(Afn(far)) >= 0: return far
        a_, b_ = x_in, far
        for _ in range(60):
            m = 0.5 * (a_ + b_)
            if lmin(Afn(m)) >= 0: a_ = m
            else: b_ = m
        return a_
    return edge(lo0), edge(hi0)

LN2, LN3, LN5 = math.log(2), math.log(3), math.log(5)
C2, C3, C4 = LN2 / math.sqrt(2), LN3 / math.sqrt(3), LN2 / 2      # Lambda(n)/sqrt(n) at n = 2, 3, 4

def build(a, N):
    F = Forms(a, N); t0 = time.time()
    d = dict(F=F, I=np.eye(N), Ae=F.arch(0.5), Ao=F.arch(1.5))
    for n in (2, 3, 4): d[f'P{n}'] = 2 * F.H(math.log(n))        # h(log n) + h(-log n)
    av, bv = F.pole_vecs(); d['av'] = av; d['bv'] = bv
    d['Pole'] = np.outer(av, bv) + np.outer(bv, av)
    d['B'] = complement([av, bv], N); d['sec'] = time.time() - t0
    return d

if __name__ == '__main__':
    mode = sys.argv[1]; N = int(sys.argv[2]); OUT = sys.argv[3] if len(sys.argv) > 3 else 'out'
    os.makedirs(OUT, exist_ok=True)
    print(f'[{mode}] N={N}; planned dense work: {(2*N+48)} quadrature matrices of {N}x{N} = {(N+8)*N*8*3/2**20:.1f} MB at a time', flush=True)
    res = []
    if mode == 'xint':
        # admissible x for Arch - x*C2*P2 on the pole-free subspace, 2a in (ln 2, ln 3 + 0.06]
        grid = sorted(set([0.60, 0.65, LN2 - 1e-9, 0.70, 0.72, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00, 1.03, 1.06, 1.08, LN3 - 1e-9, 1.11, 1.12, 1.13, 1.1316, 1.14, 1.16]))
        for twoa in grid:
            d = build(twoa / 2, N); B = d['B']; Ae = B.T @ d['Ae'] @ B; P2 = B.T @ d['P2'] @ B * C2
            iv = interval(lambda x: Ae - x * P2, -60.0, 60.0, 0.0)
            l1 = lmin(Ae - P2); l0 = lmin(Ae)
            # same on the full space with the pole term (zeta: W = Pole + Arch - P2)
            full = d['Pole'] + d['Ae']; ivf = interval(lambda x: full - x * C2 * d['P2'], -60.0, 60.0, 1.0)
            row = dict(twoa=twoa, N=N, xminus=iv[0] if iv else None, xplus=iv[1] if iv else None, lmin_x1=l1, lmin_arch=l0,
                       full_xminus=ivf[0] if ivf else None, full_xplus=ivf[1] if ivf else None, lmin_full_x1=lmin(full - C2 * d['P2']))
            res.append(row); print(json.dumps(row), flush=True)
    elif mode == 'controls':
        c21, c22 = 2.1, 2.2
        grid = sorted(set([0.50, LN2 - 1e-9, 0.75, 0.85, 0.95, 1.05, LN3 - 1e-9, 1.15, 1.25, 2 * LN2 - 1e-9, 1.45, 1.55, LN5 - 1e-9]))
        for twoa in grid:
            d = build(twoa / 2, N); B = d['B']; I = d['I']; Ae, Ao = d['Ae'], d['Ao']
            P2, P3, P4 = C2 * d['P2'], C3 * d['P3'], C4 * d['P4']
            row = dict(twoa=twoa, N=N)
            row['zeta_pf'] = lmin(Ae - P2 - P3 - P4, B)
            row['zeta_full'] = lmin(d['Pole'] + Ae - P2 - P3 - P4)
            row['chi5_full'] = lmin(Ae + LN5 * I + P2 + P3 - P4)                         # L(s, chi_5): chi(2) = chi(3) = -1, even, conductor 5
            row['chim4_full'] = lmin(Ao + 2 * LN2 * I + P3)                              # L(s, chi_-4): chi(2) = 0, chi(3) = -1, odd, conductor 4
            row['sign2_pf'] = lmin(Ae + P2 - P3 - P4, B)                                 # sign twist at 2 (eps completely multiplicative), zeta's gamma factor and pole
            row['sign23_pf'] = lmin(Ae + P2 + P3 - P4, B)                                # sign twist at 2 and 3 with zeta's gamma factor and pole (compare chi5_full)
            row['liouville_pf'] = lmin(Ae + P2 + P3 - P4, B)
            row['dh_full'] = lmin(Ao + LN5 * I - KAPPA * P2 + KAPPA * P3 + (2 + KAPPA ** 2) * P4)   # Davenport-Heilbronn: Lambda_f(2) = kappa log 2, Lambda_f(3) = -kappa log 3, Lambda_f(4) = -(2+kappa^2) log 2
            row['tnr2_pf'] = lmin(Ae + 2 * LN2 * I - (1 + c21 * math.sqrt(2)) * P2 - P3 - (1 - 2 * (c21 ** 2 - 2)) * P4, B)   # T-NR q = 2, c = 2.1
            row['tnr3_pf'] = lmin(Ae + 2 * LN3 * I - P2 - (1 + c22 * math.sqrt(3)) * P3 - P4, B)                          # T-NR q = 3, c = 2.2
            # E_a = zeta(s+a) zeta(s-a), a = 0.2: W_E(g) = 2 B_zeta(g e^{a u}, g e^{-a u}), full space (poles included)
            Nb = N + 24; db = build(twoa / 2, Nb)
            W0 = db['Pole'] + db['Ae'] - C2 * db['P2'] - C3 * db['P3'] - C4 * db['P4']
            for ash in (0.1, 0.2, 0.4):
                Ep = d['F'].expmul(ash, Nb); Em = d['F'].expmul(-ash, Nb)
                ME = Ep.T @ W0 @ Em; row[f'ea{ash}_full'] = lmin(ME + ME.T)
            # unimodular twist n^{-i tau}: coefficient at 2 gets phase e^{i phi}; hermitian form on the complex pole-free space; phi grid
            S2 = d['F'].H(LN2)   # symmetrised; need the unsymmetrised shift for the phase -> recompute
            a_ = twoa / 2; lo, hi = -a_, a_ - LN2
            if hi > lo:
                gv, gw = d['F'].gv, d['F'].gwv; h = (hi - lo) / 2; v = lo + h + h * gv
                Sh = legendre(N, a_, v).T @ (legendre(N, a_, v + LN2) * (h * gw)[:, None])
            else: Sh = np.zeros((N, N))
            uni = {}
            for phi in (0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, math.pi):
                M = Ae.astype(complex) - C2 * (np.exp(1j * phi) * Sh + np.exp(-1j * phi) * Sh.T)
                M = B.T @ M @ B; uni[f'{phi:.2f}'] = float(np.linalg.eigvalsh(0.5 * (M + M.conj().T))[0])
            row['uni2_pf_by_phi'] = uni
            res.append(row); print(json.dumps(row), flush=True)
    elif mode == 'joint':
        # admissible ranges of the coefficients at 2, 3, 4 around (1,1,1): Arch - x2 C2 P2 - x3 C3 P3 - x4 C4 P4 >= 0 on the pole-free subspace
        for twoa in (1.15, 1.25, 2 * LN2 - 1e-9, 1.45, 1.55, LN5 - 1e-9):
            d = build(twoa / 2, N); B = d['B']
            Ae = B.T @ d['Ae'] @ B; P = [B.T @ d[f'P{n}'] @ B * c for n, c in ((2, C2), (3, C3), (4, C4))]
            base = Ae - P[0] - P[1] - P[2]
            row = dict(twoa=twoa, N=N, lmin_111=lmin(base))
            for i, nm in enumerate(('x2', 'x3', 'x4')):
                iv = interval(lambda x: base - (x - 1) * P[i], -60.0, 60.0, 1.0) if row['lmin_111'] >= 0 else None
                row[nm] = list(iv) if iv else None
            res.append(row); print(json.dumps(row), flush=True)
    json.dump(res, open(f'{OUT}/pencil_{mode}_N{N}.json', 'w'))
