import json, random, itertools, sys
from sq import *
out = {}
# ---------- A. family of prime cubics ----------
fam = []
for F in PR[3]:
    L = Lcoef(F, 3); assert L[0] == 1 and L[2] == q and L[3] == 0, (F, L)
    a = -L[1]; t = traces(a, [1, -a, q], 12); assert t[1] == a and t[2] == a*a-2*q
    fam.append((F, a, t))
print('A. prime cubics:', len(fam), ' trace histogram:', sorted({a: sum(1 for f in fam if f[1] == a) for a in set(f[1] for f in fam)}.items()))
Fa = (2, 0, 0, 1); Fb = (1, 1, 0, 1)
ta = next(f for f in fam if f[0] == Fa); tb = next(f for f in fam if f[0] == Fb)
print('   target a = T^3+2: a =', ta[1], ' target b = T^3+T+1: a =', tb[1])
# ---------- B. point counts on C_F : y^2 = -F(T) ----------
def fq_count(F, n):
    M = PR[n][0] if n > 1 else None
    def red(a): return tuple((list(pmod(a, M))+[0]*n)[:n]) if n > 1 else (a[0] % q if a else 0,)
    def mm(a, b): return red(mul(a, b)) if n > 1 else ((a[0]*b[0]) % q,)
    def pw(a, e):
        r = tuple([1]+[0]*(n-1))
        while e:
            if e & 1: r = mm(r, a)
            a = mm(a, a); e >>= 1
        return r
    one = tuple([1]+[0]*(n-1)); zero = tuple([0]*n); cnt = 1  # point at infinity
    for x in itertools.product(range(q), repeat=n):
        v = zero; xp = one
        for c in F:
            v = tuple((vi + c*xi) % q for vi, xi in zip(v, xp)); xp = mm(xp, x)
        v = tuple((-vi) % q for vi in v)
        if v == zero: cnt += 1
        elif pw(v, (q**n-1)//2) == one: cnt += 2
    return cnt
bad = 0
for F, a, t in fam:
    for n in (1, 2): bad += fq_count(F, n) != q**n+1-t[n]
for F, a, t in (ta, tb): bad += fq_count(F, 3) != q**3+1-t[3]
print('B. brute point counts #C_F(F_q^n) = q^n + 1 - t_n: n = 1, 2 for 112 curves, n = 3 for targets a, b; mismatches', bad)
out['pointcount_mismatch'] = bad
PR6 = primes_upto(6)
va = nu(Fa); spl = {}
for d in range(1, 7): spl[d] = [sum(1 for P in PR6[d] if va(P) == s) for s in (1, -1, 0)]
bad6 = 0
for n in range(1, 7):
    Nn = 1
    for d in range(1, n+1):
        if n % d == 0: Nn += d*(2*spl[d][0] + spl[d][2])
        if n % (2*d) == 0: Nn += 2*d*spl[d][1]
    bad6 += Nn != q**n+1-ta[2][n]
print('   closed-point counts from splitting of primes of degree <= 6 (target a), n = 1..6: mismatches', bad6, ' N_n =', [q**n+1-ta[2][n] for n in range(1, 7)])
out['closedpoint_mismatch'] = bad6
# ---------- C. first lemma: S_cop(k) = sum_j c_j t_j with c independent of the curve; then the square ----------
print('C. S_cop(k; F) = sum_j c_j t_j(F) fitted on N+1 curves, checked on all 112; then S_cop^2 = -D.D/(2 q^N), D = sum_j c_j (P_{N+j} + q^j P_{N-j})')
rows = []; tot_fit = tot_sq = n_fit = 0
for N in (1, 2, 3):
    # N+1 curves with distinct traces
    pick = []; seen = set()
    for f in fam:
        if f[1] not in seen: seen.add(f[1]); pick.append(f)
    for lam in (0, 1, 2, 3, 7, 10, 12):
        kmax = 3
        S = {f[0]: scop(lambda A, ps, v=nu(f[0]): v(A), N, lam, kmax) for f in fam}
        for k in range(kmax+1):
            best = None
            c = solve([[f[2][j] for j in range(N+1)] for f in pick[:N+1]], [S[f[0]][k] for f in pick[:N+1]])
            mis = sum(1 for f in fam if sum(cj*f[2][j] for j, cj in enumerate(c)) != S[f[0]][k])
            x = xvec(c, N); mis2 = 0; famS = 0; famD = Fr(0)
            for f in fam:
                G = gram(f[2], 2*N, 1); mDD = qf(G, x)
                mis2 += (Fr(S[f[0]][k])**2 != mDD/(2*q**N)); famS += S[f[0]][k]**2; famD += mDD/(2*q**N)
            n_fit += 1; tot_fit += mis; tot_sq += mis2
            rows.append({'N': N, 'lam': lam, 'k': k, 'c': [str(z) for z in c], 'fit_mismatch': mis, 'square_mismatch': mis2, 'S_a': S[Fa][k], 'famS2': famS, 'famDD': str(famD)})
            if lam in (0, 7) or (lam == 2 and k <= 2):
                print(f"   N={N} lam={lam} k={k}: c = {[str(z) for z in c]}  S_cop(a) = {S[Fa][k]}  fit mismatches {mis}/112, square mismatches {mis2}/112, family sum S^2 = {famS} = sum -D.D/(2q^N): {famS == famD}")
print(f'   totals over {n_fit} (N, lam, k): fit mismatches {tot_fit}, square mismatches {tot_sq}')
out['C_rows'] = rows; out['C_fit_mismatch'] = tot_fit; out['C_sq_mismatch'] = tot_sq
# closed form for k = 0, lam > N: S_cop(0) = -pi(lam) M_N, M_N = h_N(alpha, alphabar) = t_N + q t_{N-2} + .. (+ q^(N/2) t_0/2)
for N in (1, 2, 3):
    r = next(r for r in rows if r['N'] == N and r['lam'] == 7 and r['k'] == 0)
    pred = [Fr(0)]*(N+1)
    for i in range(N//2+1):
        j = N-2*i; pred[j] += Fr(q**i, 2 if j == 0 else 1)
    print(f"   closed form N={N}: c/(-pi(7)) = {[str(Fr(z)/(-npr(7))) for z in r['c']]}  Chebyshev prediction {[str(z) for z in pred]}")
# family mean of M_N^2 / q^N (monodromy value 1 for SU(2))
for N in (1, 2, 3):
    r = next(r for r in rows if r['N'] == N and r['lam'] == 0 and r['k'] == 0)
    print(f"   family mean of M_{N}^2/q^{N} over 112 curves = {r['famS2']}/{112*q**N} = {r['famS2']/(112*q**N):.4f}")
# ---------- D. B_coh of the round-8 law for target a, from these S_cop, against c9 predictions.json; and as intersection numbers ----------
def wt2(r, k, N, lam):
    if (k-N-lam) % 6 == 0:
        if r == 0: return Fr(1)
        w = (q-1)*sum(q**i for i in range((r-1)//6+1)) - (q**(r//6) if r % 6 == 0 else 0)
        return Fr(w*w)
    return Fr(q*q**(r//3)) if r % 6 == 0 else Fr(0)
pred = json.load(open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), '../c9-mv6-ff-window-exact/predictions.json')))
print('D. B_coh(target) = sum_k kappa_k (-D_k.D_k), kappa_k = wt_k^2 q^(2d) / (2 q^N ||c_k||^2 q^(N+lam) diagsum); against c9 predictions.json')
nD = badD = 0; Drows = []
for key, v in pred.items():
    qq, N, lam, d, name = key.split(); N, lam, d = int(N), int(lam), int(d)
    if qq != '7' or name not in ('a', 'b') or lam <= N: continue
    f = ta if name == 'a' else tb
    S = scop(lambda A, ps, vv=nu(f[0]): vv(A), N, lam, d)
    DN = v['D_N']; diagsum = npr(lam)*DN; B1 = Fr(0); B2 = Fr(0)
    okS = (S[:len(v['S_cop'])] == v['S_cop'])
    for k in range(d//2+1):
        r = k+N+lam-1-d; w2 = wt2(r, k, N, lam); nck = Fr(q**d) if k == 0 else Fr(q**(d+2*k))*(1-Fr(1, q))
        B1 += w2*q**(2*d)*S[k]**2/(nck*q**(N+lam)*diagsum)
        rr = next(x for x in rows if x['N'] == N and x['lam'] == lam and x['k'] == k) if lam in (7, 10, 12) else None
        if rr is not None: c = [Fr(z) for z in rr['c']]
        else:
            pick = []; seen = set()
            for g in fam:
                if g[1] not in seen: seen.add(g[1]); pick.append(g)
            c = solve([[g[2][j] for j in range(N+1)] for g in pick[:N+1]], [scop(lambda A, ps, vv=nu(g[0]): vv(A), N, lam, d)[k] for g in pick[:N+1]])
        mDD = qf(gram(f[2], 2*N, 1), xvec(c, N))
        B2 += w2*q**(2*d)*mDD/(2*q**N*nck*q**(N+lam)*diagsum)
    nD += 1; ok = (B1 == B2) and okS and abs(float(B1)-v['B_coh']) < 1e-9*max(1, v['B_coh']); badD += not ok
    Drows.append({'key': key, 'B_coh': str(B1), 'float': float(B1), 'equal_intersection': B1 == B2, 'S_cop_equal_ffx': okS})
    if lam in (7, 10, 12): print(f"   {key}: B_coh = {float(B1):.6f} (c9: {v['B_coh']:.6f}); S_cop equal to ffx sc: {okS}; equal to the intersection-number expression: {B1 == B2}")
print(f'   {nD} configurations (targets a, b; q = 7; all lam of the c9 plan): failures {badD}')
out['D_rows'] = Drows; out['D_fail'] = badD
json.dump(out, open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), 'main.json'), 'w'), indent=0)
