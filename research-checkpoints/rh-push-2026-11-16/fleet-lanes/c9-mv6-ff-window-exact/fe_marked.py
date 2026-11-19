"""fe_marked.py q d lam Nmax nP : exact check of the reflection of the marked completed rows, one marked prime at a time (trivial weight).
For a prime P of degree lam and m of degree d, (m, P) = 1, in units G_2^(N + lam):
  M_N(m; P)  = sum_j Jbar^j sum_{n monic, deg n = j, P !| n} chi_n(m)^3 sum_{A' monic, deg A' = N - 3j, P A' squarefree} zeta6^{g(P A')} chi_{P A'}(m),
the P-part of the marked completed row of total length N + lam (exactly so for N < 2 lam; the terms with P | n start at N = 2 lam).
g(P A') = g(P) + g(A') + x(P, A'): the row is zeta6^{g(P)} chi_P(m) times the completed row of length N of the twist Psi(A') = chi_A'(m) zeta6^{x(P, A')}.
Companion (dual) family: the same with Psi replaced by its conjugate,
  M'_N(m; P) = sum_j Jbar^j sum_n chi_n(m)^3 sum_{A'} zeta6^{g(A') - x(P, A')} conj(chi_A'(m)).
Checks, all in exact integers:
  (a) M_N = 0 and M'_N = 0 for N > D := 2 (d + lam) - 2   (the completed row is a coefficient of a polynomial of degree D);
  (b) norm(M'_{D-N}) = q^(d + lam - 1 - N) norm(M_N) for every N and every pair (P, m)   (modulus form of the functional equation N <-> D - N);
  (c) the squarefree rows alone (j = 0) do not satisfy (a)."""
import sys
from ffpy import *
q = int(sys.argv[1]); d = int(sys.argv[2]); lam = int(sys.argv[3]); Nmax = int(sys.argv[4]); nP = int(sys.argv[5])
F = FF(q); nm = q**d; ms = [F.idx2poly(i, d) for i in range(nm)]; D = 2*(d + lam) - 2
primes = [P for P in (F.idx2poly(i, lam) for i in range(q**lam)) if F.irreducible(P)]
step = max(1, len(primes)//nP); primes = primes[::step][:nP]
print(f'q={q} d={d} lam={lam} D={D}: {len(primes)} marked primes tested: indices', [sum(c*q**i for i, c in enumerate(P[:-1])) for P in primes])
tot = {N: [0]*7 for N in range(Nmax+1)}; fe = {N: [0, 0] for N in range(D+1)}
for P in primes:
    gP = F.gphase(P, 2); chiPm = [F.chi(P, m) for m in ms]
    S = {}; S2 = {}
    for N in range(Nmax+1):
        acc = [[0]*6 for _ in range(nm)]; acc2 = [[0]*6 for _ in range(nm)]
        for ai in range(q**N):
            A = F.idx2poly(ai, N); g = F.gphase(F.pmul(P, A), 2)
            if g is None: continue
            gA = F.gphase(A, 2); x = (g - gP - gA) % 6
            for mi, m in enumerate(ms):
                if chiPm[mi] is None: continue
                c = F.chi(A, m)
                if c is None: continue
                acc[mi][(g + c + chiPm[mi]) % 6] += 1
                acc2[mi][(gA - x - c) % 6] += 1
        S[N] = [(H[0]-H[2]-H[3]+H[5], H[1]+H[2]-H[4]-H[5]) for H in acc]
        S2[N] = [(H[0]-H[2]-H[3]+H[5], H[1]+H[2]-H[4]-H[5]) for H in acc2]
    V = {}
    for j in range(Nmax//3 + 1):
        V[j] = []
        for m in ms:
            s_ = 0
            for i in range(q**j):
                n = F.idx2poly(i, j)
                if j >= lam and not F.pmod(n, P): continue
                c = F.chi(n, m)
                if c is not None: s_ += -1 if c & 1 else 1
            V[j].append(s_)
    C = {}; C2 = {}
    for N in range(Nmax+1):
        C[N] = {}; C2[N] = {}
        for mi in range(nm):
            if chiPm[mi] is None: continue
            c = (0, 0); c2 = (0, 0); f = (1, 0)
            for j in range(N//3 + 1):
                c = add(c, mul(mul(f, (V[j][mi], 0)), S[N-3*j][mi])); c2 = add(c2, mul(mul(f, (V[j][mi], 0)), S2[N-3*j][mi])); f = mul(f, F.Jb)
            C[N][mi] = c; C2[N][mi] = c2
            t = tot[N]; t[0] += 1; t[1] += (c != (0, 0)); t[2] += norm(c); t[3] += (c2 != (0, 0)); t[4] += norm(c2); t[5] += (S[N][mi] != (0, 0)); t[6] += norm(S[N][mi])
    for N in range(D+1):
        if N > Nmax or D - N > Nmax: continue
        for mi in C[N]:
            e = d + lam - 1 - N; a, b = norm(C2[D-N][mi]), norm(C[N][mi])
            fe[N][0] += 1; fe[N][1] += (a == q**e * b) if e >= 0 else (a * q**(-e) == b)
print('(b) modulus relation norm(M\'_{D-N}) = q^(d+lam-1-N) norm(M_N):  N: (pairs, pairs satisfying it):', {N: tuple(v) for N, v in fe.items() if v[0]})
print('N | pairs (P, m) | completed M_N: # nonzero | sum of norms | companion M\'_N: # nonzero | sum of norms | squarefree only: # nonzero | sum of norms')
for N in range(Nmax+1): print(N, '|', ' | '.join(str(x) for x in tot[N]))
