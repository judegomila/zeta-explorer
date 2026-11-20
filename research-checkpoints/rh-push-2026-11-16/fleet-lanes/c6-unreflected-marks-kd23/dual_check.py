"""dual_check.py -- brute-force check of step 3 of Lemma D (Gauss-sum factorisation of the dual kernel) and of the
Hasse-Davenport step 4.  For coprime squarefree primary c, c' and k coprime to c c':
   S(c, c'; k) = (q_c q_c')^(-1/2) sum_{v mod c c'} chi_c(v) conj(chi_c'(v)) e(k v / (c c'))
   claim: S = eps * gamma_1(c) conj(gamma_1(c')) conj(chi_c(k)) chi_c'(k),  eps = chi_c(c') conj(chi_c'(c)) chi_c'(-1),
   and eps in {+1, -1}.  gamma_j by brute force (zomega.gauss_brute)."""
import itertools, math, cmath
import zomega as Z
Z6 = Z.ZETA6
ps = [7, 13, 19, 31, 37]
primes = []
for p in ps:
    pi = Z.split_primary(p)
    primes.append(Z.PrimeO(pi, p, False)); primes.append(Z.PrimeO(Z.conj(pi) if Z.is_primary(Z.conj(pi)) else Z.primary_assoc(Z.conj(pi)), p, False))
primes.append(Z.PrimeO((-5, 0), 5, True))
def prod(fs):
    r = (1, 0)
    for P in fs: r = Z.mul(r, P.pi)
    return r
mods = [[P] for P in primes[:7]] + [[primes[0], primes[2]], [primes[1], primes[4]], [primes[0], primes[3]]]
worst = 0.0; n = 0; epsvals = set(); worst_hd = 0.0
gam = {}
for fs in mods:
    c = prod(fs)
    g1 = Z.gauss_brute(c, fs, 1); g2 = Z.gauss_brute(c, fs, 2); g3 = Z.gauss_brute(c, fs, 3)
    gam[c] = (g1, g2, g3)
    mu = (-1) ** len(fs); al = Z.to_c(c) / abs(Z.to_c(c))
    e4 = Z.chi_composite(fs, (4, 0))
    G = Z6[e4] * g3                                   # G(c) = chi_c(4) gamma_3(c)   (paper (4.7))
    Gc = Z6[(-e4) % 6] * g3
    worst_hd = max(worst_hd, min(abs(g1 * g2 - mu * al * G), abs(g1 * g2 - mu * al * Gc)), abs(g2 ** 3 - mu * al))
for fs, ft in itertools.permutations(mods, 2):
    if set(id(P) for P in fs) & set(id(P) for P in ft): continue
    c = prod(fs); cp = prod(ft)
    if Z.norm(c) * Z.norm(cp) > 4000: continue
    m = Z.mul(c, cp); mc = Z.to_c(m)
    for k in [(1, 0), (2, 1), (-3, 5), (4, -7)]:
        kc = Z.chi_composite(fs, k); kcp = Z.chi_composite(ft, k)
        if kc is None or kcp is None: continue
        s = 0j
        for v in Z.hnf_residues(m):
            a = Z.chi_composite(fs, v); b = Z.chi_composite(ft, v)
            if a is None or b is None: continue
            s += Z6[(a - b) % 6] * Z.e_add(Z.to_c(Z.mul(k, v)) / mc)
        s /= math.sqrt(Z.norm(m))
        eps_e = (Z.chi_composite(fs, cp) - Z.chi_composite(ft, c) + Z.chi_composite(ft, (-1, 0))) % 6
        pred = Z6[eps_e] * gam[c][0] * gam[cp][0].conjugate() * Z6[(-kc) % 6] * Z6[kcp]
        worst = max(worst, abs(s - pred)); n += 1; epsvals.add(int(eps_e))
print(f"kernel factorisation: {n} triples (c, c', k), max |S - prediction| = {worst:.2e}; exponents of eps seen: {sorted(epsvals)} (0 -> +1, 3 -> -1)")
print(f"gamma_2^3 = mu alpha and gamma_1 gamma_2 = mu alpha G on {len(mods)} moduli (brute force): max deviation {worst_hd:.2e}")
