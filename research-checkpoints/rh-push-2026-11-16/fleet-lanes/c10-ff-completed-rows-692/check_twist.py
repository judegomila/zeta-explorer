"""check_twist.py d lam f Fidx Pidx Nmax : polynomiality of the marked completed row for a TWISTED vector (referee debt of c9: completion formula untested for twisted vectors).
q = 7.  u(A) = chi_0^3(Res(F, A)) (quadratic character of conductor F, deg F = f; f = 0: trivial vector).  One marked prime P of degree lam, m of degree d coprime to P:
   C_N(m) = sum_{j <= N/3} Jbar^j V_j(m) S_{N-3j}(m),  S_N = sum_{A' deg N, P A' squarefree} zeta6^{g(P A')} u(A') chi_{P A'}(m),  V_j = sum_{deg n = j, P !| n} u(n)^3 chi_n(m)^3.
Printed per N: number of rows with C_N != 0, sum of norms of C_N, sum of norms of the squarefree row S_N.  If the formula is the completion for the twisted vector,
C_N vanishes identically above the degree of a polynomial (trivial vector: 2(d + lam) - 2)."""
import sys
from ffpy import *
q = 7; F = FF(q)
d, lam, f, Fidx, Pidx, Nmax = [int(x) for x in sys.argv[1:7]]
ms = [F.idx2poly(i, d) for i in range(q**d)]; nm = len(ms)
primes = [P for P in (F.idx2poly(i, lam) for i in range(q**lam)) if F.irreducible(P)]; P = primes[Pidx]
Fp = F.idx2poly(Fidx, f) if f else None
def u(A):
    if Fp is None: return 1
    R = F.res(Fp, A); return 0 if R == 0 else (-1 if (3*F.L6[R]) % 6 == 3 else 1)
chiP = [F.chi(P, m) for m in ms]; rowsok = [mi for mi in range(nm) if chiP[mi] is not None]
S = {}
for N in range(Nmax + 1):
    acc = [[0]*6 for _ in range(nm)]
    for ai in range(q**N):
        A = F.idx2poly(ai, N); uA = u(A)
        if uA == 0: continue
        g = F.gphase(F.pmul(P, A), 2)
        if g is None: continue
        sh = 3 if uA < 0 else 0
        for mi in rowsok:
            c = F.chi(A, ms[mi])
            if c is None: continue
            acc[mi][(g + c + chiP[mi] + sh) % 6] += 1
    S[N] = [(H[0]-H[2]-H[3]+H[5], H[1]+H[2]-H[4]-H[5]) for H in acc]
V = {}
for j in range(Nmax//3 + 1):
    V[j] = []
    for m in ms:
        s = 0
        for i in range(q**j):
            n = F.idx2poly(i, j)
            if j >= lam and not F.pmod(n, P): continue
            c = F.chi(n, m)
            if c is not None: s += u(n) * (-1 if c & 1 else 1)
        V[j].append(s)
print(f'q=7 d={d} lam={lam} P={P} F={Fp} rows coprime to P: {len(rowsok)}')
for N in range(Nmax + 1):
    C = []
    for mi in rowsok:
        c = (0, 0); fct = (1, 0)
        for j in range(N//3 + 1): c = add(c, mul(mul(fct, (V[j][mi], 0)), S[N-3*j][mi])); fct = mul(fct, F.Jb)
        C.append(c)
    copF = [Fp is None or F.res(Fp, ms[mi]) != 0 for mi in rowsok]
    print(f'N={N}: completed: nonzero rows {sum(1 for c in C if c != (0, 0))}, sum of norms {sum(norm(c) for c in C)}; on the {sum(copF)} rows coprime to F: nonzero {sum(1 for c, k in zip(C, copF) if k and c != (0, 0))}, sum of norms {sum(norm(c) for c, k in zip(C, copF) if k)} | squarefree row: sum of norms {sum(norm(S[N][mi]) for mi in rowsok)}', flush=True)
