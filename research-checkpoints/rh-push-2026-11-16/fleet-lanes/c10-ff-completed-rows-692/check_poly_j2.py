"""check_poly_j2.py : exact check of the j = 2 completion (Jbar^2 V_2, the terms n = l^2 included with coefficient 1) by polynomiality.
Fact used (c9 fe_marked.py, verified there one prime at a time): the marked completed row with trivial vector vanishes for N > 2(d + lam) - 2.
Here q = 7, d = 2, lam = 1 (2(d+lam)-2 = 4), N = 6, one marked linear prime P at a time, m of degree 2 coprime to P:
   S_6 + Jbar V_1 S_3 + Jbar^2 V_2 S_0 = 0,   S_N(m) = sum_{A' monic deg N, P A' squarefree} zeta6^{g(P A')} chi_{P A'}(m),  V_j = sum_{deg n = j, P !| n} chi_n(m)^3.
(A first version at d = 1, lam = 3, N = 7 was vacuous: every piece, V_1 and V_2 included, is 0 at d = 1; it is not counted as a check.)
Variants that must NOT vanish: without the n = l^2 terms; J in place of Jbar; the squarefree row alone.  V_j is taken from assemble6.geometry (the code used for the result)."""
import sys
from assemble6 import *
d = 2; ms, m0, ns, sqof, chi3, A3, sqf3, copA3 = geometry(d); nm = len(ms)
ok = True
for pi in [int(x) for x in sys.argv[1:]]:
    P = F.idx2poly(pi, 1); chiP = [F.chi(P, m) for m in ms]
    S = {}
    for N in (6, 3, 0):
        acc = [[0]*6 for _ in range(nm)]
        for ai in range(q**N):
            A = F.idx2poly(ai, N); g = F.gphase(F.pmul(P, A), 2)
            if g is None: continue
            for mi, m in enumerate(ms):
                if chiP[mi] is None: continue
                c = F.chi(A, m)
                if c is None: continue
                acc[mi][(g + c + chiP[mi]) % 6] += 1
        S[N] = [(H[0]-H[2]-H[3]+H[5], H[1]+H[2]-H[4]-H[5]) for H in acc]
    def V(j, skip_sq=False): return [sum(chi3[j][i][mi] for i, n in enumerate(ns[j]) if F.pmod(n, P) and not (skip_sq and tuple(n) in sqof)) for mi in range(nm)]
    V1 = V(1); V2 = V(2); V2n = V(2, True)
    def comb(Jx, V2x): return [add(S[6][mi], add(mul(Jx, mul((V1[mi], 0), S[3][mi])), mul(mul(Jx, Jx), mul((V2x[mi], 0), S[0][mi])))) for mi in range(nm) if chiP[mi] is not None]
    full = comb(F.Jb, V2); z = all(x == (0, 0) for x in full); ok &= z
    print(f'P = T + {P[0]}: completed row N = 6 over {len(full)} rows: sum of norms {sum(norm(x) for x in full)} (vanishes: {z}); without n = l^2: {sum(norm(x) for x in comb(F.Jb, V2n))}; '
          f'J in place of Jbar: {sum(norm(x) for x in comb(F.J, V2))}; squarefree row alone: {sum(norm(S[6][mi]) for mi in range(nm))}; sum_m V_2^2 = {sum(v*v for v in V2)}', flush=True)
print('CHECK', 'PASSED' if ok else 'FAILED')
