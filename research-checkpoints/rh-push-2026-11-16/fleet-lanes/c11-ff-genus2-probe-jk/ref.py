"""ref.py: second implementation for REFEREE.md (nothing imported from sq_q.py). q = 3 (all squarefree F of degree 5 and 7) and
q = 5 (seeded 300 of degree 5); lam in {4, 5} and 1, k = 0..3 with cop_k by brute-force gcd counts; residue symbol by Euler's
criterion mod F is replaced by the product over roots in an extension-free way: nu_F(A) = Legendre(Res) with Res by the Sylvester determinant mod q."""
import sys, itertools, random, cmath
from fractions import Fraction as Fr
def run(q, DEG, nF, lams, seed=7):
    g = (DEG-1)//2
    leg = lambda x: 0 if x % q == 0 else (1 if pow(x % q, (q-1)//2, q) == 1 else -1)
    def det_mod(M):
        M = [r[:] for r in M]; n = len(M); d = 1
        for i in range(n):
            p = next((r for r in range(i, n) if M[r][i] % q), None)
            if p is None: return 0
            if p != i: M[i], M[p] = M[p], M[i]; d = -d
            d = d*M[i][i] % q; inv = pow(M[i][i], q-2, q)
            for r in range(i+1, n):
                f = M[r][i]*inv % q
                if f: M[r] = [(x-f*y) % q for x, y in zip(M[r], M[i])]
        return d % q
    def sylv(f, h):   # f, h high->low coefficient lists
        m, n = len(f)-1, len(h)-1; M = []
        for i in range(n): M.append([0]*i + f + [0]*(n-1-i))
        for i in range(m): M.append([0]*i + h + [0]*(m-1-i))
        return det_mod(M) if M else 1
    def monics(n): return [(1,)+c for c in itertools.product(range(q), repeat=n)]   # high->low
    def pmul(a, b):
        c = [0]*(len(a)+len(b)-1)
        for i, x in enumerate(a):
            for j, y in enumerate(b): c[i+j] = (c[i+j]+x*y) % q
        return tuple(c)
    def pmodp(a, b):
        a = list(a)
        while len(a) >= len(b):
            f = a[0]
            if f:
                for i in range(len(b)): a[i] = (a[i]-f*b[i]) % q
            a.pop(0)
        while a and a[0] == 0: a.pop(0)
        return a
    def pgcd_deg(a, b):
        a, b = list(a), list(b)
        while b:
            r = pmodp(a, b); a, b = b, r
            if b:
                inv = pow(b[0], q-2, q); b = [x*inv % q for x in b]
        return len(a)-1
    # irreducibles and squarefree A' with factor degrees, by trial multiplication
    red = set()
    for n in range(2, 4):
        for i in range(1, n//2+1):
            for a in monics(i):
                for b in monics(n-i): red.add(pmul(a, b))
    irr = [p for n in (1, 2, 3) for p in monics(n) if p not in red]
    sqf = {}
    for N in (1, 2, 3):
        d = {}
        for r in range(1, N+1):
            for comb in itertools.combinations(irr, r):
                if sum(len(p)-1 for p in comb) == N:
                    A = (1,)
                    for p in comb: A = pmul(A, p)
                    d[A] = [len(p)-1 for p in comb]
        sqf[N] = d
    KM = 3
    cop = {}
    for N in (1, 2, 3):
        for A in sqf[N]:
            cop[A] = [sum(1 for c in monics(k) if pgcd_deg(c, A) == 0) for k in range(KM+1)]
    def pi(lam):
        mu = {1: 1, 2: -1, 3: -1, 4: 0, 5: -1, 6: 1, 7: -1}
        return sum(mu[e]*q**(lam//e) for e in range(1, lam+1) if lam % e == 0)//lam
    random.seed(seed); allF = monics(DEG); random.shuffle(allF); data = {}; cnt = 0
    for F in allF:
        dF = [(DEG-i)*c % q for i, c in enumerate(F)][:-1]
        while dF and dF[0] == 0: dF.pop(0)
        if not dF or sylv(list(F), dF) == 0: continue
        if cnt >= nF: break
        cnt += 1
        nu = lambda A: leg(sylv(list(F), list(A)))
        L = [sum(nu(A) for A in monics(n)) for n in (1, 2, 3)]
        r = sum(1 for a in range(q) if sum(c*pow(a, DEG-i, q) for i, c in enumerate(F)) % q == 0)
        S = []
        for N in (1, 2, 3):
            w = {A: nu(A) for A in sqf[N]}
            for lam in lams:
                for k in range(KM+1):
                    s = 0
                    for A, degs in sqf[N].items():
                        mu = (-1)**len(degs); nfl = degs.count(lam)
                        s -= w[A]*mu*(pi(lam)-nfl)*(cop[A][k]-(cop[A][k-lam] if k >= lam else 0))
                    S.append(s)
        key = (r, L[0], L[1], L[2] if g >= 3 else 0)
        if key in data: assert data[key] == S, "S is not a function of (r, L)"
        else: data[key] = S
    # tests
    nlin1 = nnon = 0; ineq = 0; tot = 0; viol = 0
    byr = {}
    for (r, L1, L2, L3), S in data.items(): byr.setdefault(r, []).append((L1, L2, L3, S))
    nvec = 3*len(lams)*(KM+1); per = len(lams)*(KM+1); lin2_fail = lin2_tested = 0; n1_ok = n1_tested = 0
    for r, pts in byr.items():
        if len(pts) < 6: continue
        for v in range(per):                      # N = 1: S = c L1
            n1_tested += 1; base = next((p for p in pts if p[0] != 0), None)
            c = Fr(base[3][v], base[0]); n1_ok += all(p[3][v] == c*p[0] for p in pts)
        for v in range(per, 2*per):               # N = 2: affine in (L1, L2) [= span of t_0, t_1, t_2 without the square]?
            lin2_tested += 1
            # fit a + b L1 + c L2 on three non-collinear points, test the rest
            import itertools as it
            for tri in it.combinations(pts[:8], 3):
                (x1, y1, _, s1), (x2, y2, _, s2), (x3, y3, _, s3) = tri
                dd = (x2-x1)*(y3-y1) - (x3-x1)*(y2-y1)
                if dd: break
            b = Fr((s2[v]-s1[v])*(y3-y1) - (s3[v]-s1[v])*(y2-y1), dd); c = Fr((x2-x1)*(s3[v]-s1[v]) - (x3-x1)*(s2[v]-s1[v]), dd); a = s1[v] - b*x1 - c*y1
            lin2_fail += any(p[3][v] != a + b*p[0] + c*p[1] for p in pts)
    # inequality with own Gram G_jk = q^min(j,k) t_|j-k| and the closed form, per distinct L
    Ls = {}
    for (r, L1, L2, L3) in data: Ls[(L1, L2, L3)] = 1
    for (L1, L2, L3) in Ls:
        Lp = [1, L1, L2, q*L1, q*q] if g == 2 else [1, L1, L2, L3, q*L2, q*q*L1, q**3]
        e = [(-1)**i*c for i, c in enumerate(Lp)]; t = [2*g]
        for n in range(1, 3):
            t.append(sum((-1)**(i-1)*e[i]*t[n-i] for i in range(1, n)) + (-1)**(n-1)*n*e[n])
        G = lambda j, k: q**min(j, k)*t[abs(j-k)]
        x = {0: q, 2: 1}; ddn = sum(x[i]*x[j]*G(i, j) for i in x for j in x); H = Fr(g, 2)*ddn/q
        e1 = -L1; e2 = L2 - g*q; assert ddn == 2*q*(e1*e1 - 2*e2), "closed form -D.D = 2 q sum s_m^2"
        tot += 1; ineq += (t[1]**2 <= H); viol += (t[1]**2 > H)
    print(f"ref q={q} deg={DEG} lams={lams}: curves {cnt}, distinct (r,L) {len(data)}; S function of (r,L): yes; N=1 S = c L1: {n1_ok}/{n1_tested} vector-strata; N=2 affine in (L1,L2) fails: {lin2_fail}/{lin2_tested}; N=1 inequality on distinct L: {ineq}/{tot} (violations {viol}); closed form -D.D = 2q sum s^2: all")
run(3, 5, 10**9, [1, 4, 5]); run(3, 7, 10**9, [1, 4]); run(5, 5, 300, [1, 4])
# algebraic identity with random real data, floats: -D.D = 2 q^N sum_m f(alpha_m)^2 for symmetric classes, antisymmetric = 2 q^N sum (4q - s^2) G(s)^2, cross = 0
random.seed(11); worst = 0.0
for trial in range(2000):
    q = random.choice([3, 5, 7, 11]); g = random.choice([2, 3]); N = random.randint(1, 3)
    s = [complex(random.uniform(-9, 9), 0) for _ in range(g)]
    if random.random() < 0.4: s[0] = complex(random.uniform(-6, 6), random.uniform(0.5, 4)); s[1] = s[0].conjugate()
    al = []
    for sm in s:
        d = cmath.sqrt(sm*sm - 4*q); al += [(sm+d)/2, (sm-d)/2]
    t = [sum(a**n for a in al) for n in range(2*N+1)]
    Gm = lambda j, k: q**min(j, k)*t[abs(j-k)]
    c = [random.uniform(-2, 2) for _ in range(N+1)]; a = [0.0] + [random.uniform(-2, 2) for _ in range(N)]
    xs = [0.0]*(2*N+1); xa = [0.0]*(2*N+1)
    for j in range(N+1):
        xs[N+j] += c[j]; xs[N-j] += c[j]*q**j
        if j: xa[N+j] += a[j]; xa[N-j] -= a[j]*q**j
    bil = lambda x, y: sum(x[i]*y[j]*Gm(i, j) for i in range(2*N+1) for j in range(2*N+1))
    f = lambda z: sum(c[j]*(z**j + (q/z)**j) for j in range(N+1)); fa = lambda z: sum(a[j]*(z**j - (q/z)**j) for j in range(1, N+1))
    ss = 2*q**N*sum(f(al[2*m])**2 for m in range(g)); aa = -2*q**N*sum(fa(al[2*m])**2 for m in range(g))
    sc = max(1.0, abs(ss), abs(aa))
    worst = max(worst, abs(bil(xs, xs)-ss)/sc, abs(bil(xa, xa)-aa)/sc, abs(bil(xs, xa))/sc)
print(f"ref identities (2000 random real/complex s, float): max relative deviation {worst:.2e}")
