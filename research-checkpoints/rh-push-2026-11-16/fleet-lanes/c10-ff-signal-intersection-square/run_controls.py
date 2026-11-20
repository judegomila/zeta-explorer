import json, random, os
from sq import *
HERE = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(HERE, 'main.json'))); rows = M['C_rows']
out = {}
fam = []
for F in PR[3]:
    L = Lcoef(F, 2); a = -L[1]; fam.append((F, a, traces(a, [1, -a, q], 12)))
pick = []; seen = set()
for f in fam:
    if f[1] not in seen: seen.add(f[1]); pick.append(f)
# ---------- 1. Weil-type fakes of genus 1 (no curve): L = 1 - a u + q u^2, |a| > 2 sqrt(q) ----------
print('1. genus-1 fakes 1 - a u + 7 u^2 with the vectors c of the family (84 rows of C), a in -20..20')
bad = neg = 0; n = 0; indef = []
for a in range(-20, 21):
    t = traces(a, [1, -a, q], 12); G = gram(t, 6, 1)
    for r in rows:
        c = [Fr(z) for z in r['c']]; N = r['N']; S = sum(cj*t[j] for j, cj in enumerate(c)); mDD = qf(G, xvec(c, N))
        n += 1; bad += (S*S != mDD/(2*q**N)); neg += (mDD < 0)
    v = qf(G, [Fr(a), Fr(-2)] + [Fr(0)]*5)
    if v < 0: indef.append(a)
print(f'   identity S^2 = -D.D/(2q^N): {n} cases, failures {bad}; cases with -D.D < 0 on the symmetrised vectors: {neg}')
print(f'   form indefinite (x = a P_0 - 2 P_1 gives -x.x = 8q - 2a^2 < 0) exactly for a in {indef}')
t6 = traces(-6, [1, 6, q], 6)
print('   a = -6: M_N = h_N for N = 1, 2, 3:', [t6[1], t6[2]+q, t6[3]+q*t6[1]], ' Weil bound (N+1) q^(N/2):', [round((N+1)*q**(N/2), 2) for N in (1, 2, 3)])
out['fake'] = {'cases': n, 'identity_failures': bad, 'negative_on_sym': neg, 'indefinite_a': indef}
# ---------- 2. Hodge index as an upper bound: S_cop^2 <= (max over the unit circle) -- family ----------
mx = {N: max(Fr((f[2][N] + (q*f[2][N-2] if N >= 2 else 0) if N != 2 else f[2][2]+q)**2, q**N) for f in fam) for N in (1, 2, 3)}
print('2. family maximum of M_N^2/q^N (Weil bound (N+1)^2):', {N: (str(v), float(v)) for N, v in mx.items()})
# ---------- 3. genus 2: prime quintics ----------
PR5 = primes_upto(5)[5]; random.seed(20261118); samp = random.sample(PR5, 80)
g2 = []
for F in samp:
    v = nu(F); L = [sum(v(A) for A in mono(n)) for n in range(4)]
    assert L[3] == q*L[1], (F, L)
    t = traces(None, [1, L[1], L[2], q*L[1], q*q], 8)
    M1 = -L[1]; M2 = L[1]**2 - L[2]
    g2.append((F, t, M1, M2))
print('3. genus 2 (80 seeded prime quintics, y^2 = +-F): functional equation coefficient check passed (80/80)')
fit = solve([[1]+g[1][1:5] for g in g2[:5]], [g[3] for g in g2[:5]]) if True else None
mis = sum(1 for g in g2 if sum(c*x for c, x in zip(fit, [1]+g[1][1:5])) != g[3])
print(f'   M_2 as an affine function of (t_1..t_4), fitted on 5 curves: mismatches on the 80: {mis}')
eq = 0; gaps = []
for F, t, M1, M2 in g2:
    G = gram(t, 2, 2); mDD = qf(G, xvec([Fr(0), Fr(1)], 1))
    assert M1 == t[1]
    gap = mDD/q - M1*M1            # = (phi_1 - phi_2)^2
    assert gap == 2*t[2] + 8*q - t[1]**2 and gap >= 0
    eq += (Fr(M1*M1) == mDD/(2*q)); gaps.append(gap)
print(f'   N = 1 (signal linear, c = e_1): M_1^2 = -D.D/(2q) in {eq}/80; M_1^2 = (g/2)(-D.D)/q - (phi_1 - phi_2)^2 in 80/80; gap zero in {sum(1 for x in gaps if x == 0)}/80; gap min {min(gaps)}, max {max(gaps)}')
out['genus2'] = {'M2_affine_mismatch': mis, 'N1_equal': eq, 'gap_zero': sum(1 for x in gaps if x == 0)}
# ---------- 4. trivial target and Liouville-twisted vector (w = mu): no curve ----------
print('4. trivial target (w = 1) and w = mu: S_cop(k), k = 0..3 (genus 0: every primitive class is 0, so -D.D = 0)')
for N in (1, 2, 3):
    for lam in (0, 2, 7, 11):
        s1 = scop(lambda A, ps: 1, N, lam, 3); s2 = scop(lambda A, ps: (-1 if len(ps) % 2 else 1), N, lam, 3)
        print(f'   N={N} lam={lam}: one {s1}   mu {s2}')
# ---------- 5. twisted targets across the family: does a curve-independent c exist? ----------
print('5. S_cop(k; F) for w = eps * nu_F over the 112 curves: fit c on N+1 curves, mismatches on 112 (k = 0..2, lam in 0, 2, 7)')
def lin_test(mk, label):
    tot = 0; cnt = 0; sqbad = 0
    for N in (1, 2, 3):
        for lam in (0, 2, 7):
            S = {f[0]: scop(mk(f[0]), N, lam, 2) for f in fam}
            for k in range(3):
                try: c = solve([[f[2][j] for j in range(N+1)] for f in pick[:N+1]], [S[f[0]][k] for f in pick[:N+1]])
                except StopIteration: c = None
                m = sum(1 for f in fam if sum(cj*f[2][j] for j, cj in enumerate(c)) != S[f[0]][k])
                cnt += 1; tot += m
                if m == 0: sqbad += sum(1 for f in fam if Fr(S[f[0]][k])**2 != qf(gram(f[2], 2*N, 1), xvec(c, N))/(2*q**N))
    print(f'   {label}: {cnt} (N, lam, k); curves not on the fitted line, total {tot} of {cnt*112}; where the fit is exact, square identity failures {sqbad}')
    return tot
out['twist'] = {}
out['twist']['liouville'] = lin_test(lambda F: (lambda A, ps, v=nu(F): v(A)*(-1 if len(ps) % 2 else 1)), 'Liouville-twisted target w = mu nu_F')
for seed in (1, 2, 3):
    rng = random.Random(seed); sg = {A: rng.choice((1, -1)) for n in range(4) for A, ps in SQF[n]}
    out['twist'][f'n1_{seed}'] = lin_test(lambda F: (lambda A, ps, v=nu(F): v(A)*sg[A]), f'random signs on A (not multiplicative), seed {seed}')
    rng = random.Random(100+seed); sp = {p: rng.choice((1, -1)) for d in (1, 2, 3) for p in PR[d]}
    def mk(F):
        v = nu(F)
        def w(A, ps):
            s = v(A)
            for p in ps: s *= sp[p]
            return s
        return w
    out['twist'][f'th_{seed}'] = lin_test(mk, f'random completely multiplicative signs on primes, seed {seed}')
# ---------- 6. aligned vector: w(A') = conj chi_{A'}(m0), m0 prime of degree 2 ----------
g0 = 3; L6 = {pow(g0, e, q): e for e in range(6)}
print('6. aligned vector w(A) = conj chi_A(m0), chi_A(m) = chi_0(Res(A, m)): norm of M_N(w) = sum mu(A) w(A) in Z[zeta_6]')
res_al = {}
for N in (1, 2, 3):
    norms = set()
    for m0 in PR[2]:
        cnt = [0]*6
        for A, ps in SQF[N]:
            R = res(A, m0)
            if R: cnt[(-L6[R]) % 6] += (-1 if len(ps) % 2 else 1)
        # zeta^0..5 -> a + b zeta: 1, z, z-1, -1, -z, 1-z
        a = cnt[0]-cnt[2]-cnt[3]+cnt[5]; b = cnt[1]+cnt[2]-cnt[4]-cnt[5]
        norms.add(a*a+a*b+b*b)
    res_al[N] = sorted(norms); print(f'   N={N}: norms over the 21 prime m0: {sorted(norms)}  (q^N = {q**N})')
out['aligned'] = res_al
json.dump(out, open(os.path.join(HERE, 'controls.json'), 'w'), indent=0)
