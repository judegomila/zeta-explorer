"""Check, pair by pair (c,A squarefree coprime monic, deg k,N, 6 !| (N-k)), the functional-equation identity
   sum_{deg m=d} chi_A(m) conj chi_c(m) = eps * q^(d-D+1/2) * g6(1,A) conj(g6(1,c)) * conj( sum_{deg m'=r} chi_A(m') conj chi_c(m') ),
   D=k+N, r=D-1-d>=0, |eps|=1 depending only on (k,N,d).
 and the summed block identity with the Moebius-target sum."""
import numpy as np, itertools
from fflib import *
s6, s3 = Sym(6), Sym(3)
def issf(A): return len(A) == 1 or pres(A, deriv(A)) != 0
def mu(A):
    f = factor(A); return 0 if any(a > 1 for _, a in f) else (-1) ** len(f)
def chitab(As, Ms):
    T = np.zeros((len(As), len(Ms)), dtype=complex)
    for i, A in enumerate(As):
        for j, m in enumerate(Ms):
            r = pres(A, m)
            if r: T[i, j] = Z6[int(LOG[r])]
    return T
NUS = {'triv': None, 'Q1': ((3, 0, 1), 1), 'T1': ((0, 1), 1)}
def nuval(nu, A):
    if nu is None: return 1
    r = pres(A, nu[0]); return 0 if r == 0 else Z6[(nu[1] * int(LOG[r])) % 6]
for (d, k, N) in [(2, 1, 2), (2, 1, 3), (3, 1, 3), (2, 2, 3), (3, 2, 3), (3, 1, 4)]:
    D = k + N; r = D - 1 - d
    cs = [c for c in monics(k) if issf(c)]; As = [A for A in monics(N) if issf(A)]
    Md, Mr = monics(d), monics(r)
    Tc_d, Tc_r = chitab(cs, Md), chitab(cs, Mr)
    TA_d, TA_r = chitab(As, Md), chitab(As, Mr)
    gc = np.array([g1_sf(s6, c) for c in cs]); gA6 = np.array([g1_sf(s6, A) for A in As]); gA3 = np.array([g1_sf(s3, A) for A in As])
    S_d = TA_d @ np.conj(Tc_d).T          # [A,c] = sum_m chi_A(m) conj chi_c(m)
    S_r = TA_r @ np.conj(Tc_r).T
    cop = np.array([[pres(A, c) != 0 for c in cs] for A in As])
    pred = q ** (d - D + 0.5) * gA6[:, None] * np.conj(gc)[None, :] * np.conj(S_r)
    mask = cop & (np.abs(pred) > 1e-9)
    ratio = S_d[mask] / pred[mask]
    print(f'd={d} k={k} N={N} r={r}: pairs {mask.sum()}; |ratio| in [{abs(ratio).min():.12f},{abs(ratio).max():.12f}]; phase spread {abs(ratio - ratio[0]).max():.2e}; eps={ratio[0]:.4f};'
          f' max|S_d| where pred=0: {abs(S_d[cop & ~mask]).max() if (cop & ~mask).any() else 0:.1e}')
    eps = ratio[0]
    for nm, nu in NUS.items():
        nuA = np.array([nuval(nu, A) for A in As]); muA = np.array([mu(A) for A in As])
        lhs = np.sum((gA3 * nuA)[:, None] * gc[None, :] * S_d * cop)
        # Euler side: eps q^(d-D+1/2) q^k sum_{m'} sum_{A,c coprime} (g6 g3)(A) nu(A) conj chi_A(m') chi_c(m')
        kap = (gA6 * gA3) / (muA * q ** N)          # should be constant unit kappa_N
        rhs = eps * q ** (d + 0.5) * kap[0] * np.sum((muA * nuA)[:, None] * cop * np.conj(S_r))
        # main term: sixth-power frequencies only (r=0: m'=1)
        cs_norm = np.sqrt(len(Md) * 1.0)
        print(f'    nu={nm}: |block|={abs(lhs):.6e} |block - Euler side|={abs(lhs-rhs):.2e}; kappa const: {abs(kap-kap[0]).max():.1e};'
              f' |sum_(A,c coprime) mu nu conj(S_r)| = {abs(np.sum((muA*nuA)[:,None]*cop*np.conj(S_r))):.3f} vs trivial {q**(k+N+r)}')
