"""Independent referee checks (c15-referee-r14-independent-checkpoint). mpmath + numpy, local, small.
Every check is run at two truncations. Largest planned array: 20001 complex128 (0.3 MB)."""
import sys, json, math, cmath, random
import numpy as np
import mpmath as mp
mp.mp.dps = 30
OUT = sys.argv[1]
R = {}
rng = random.Random(150001)

def primes_upto(n):
    sv = bytearray([1]) * (n + 1); sv[0:2] = b"\0\0"
    for i in range(2, int(n ** .5) + 1):
        if sv[i]: sv[i * i::i] = bytearray(len(sv[i * i::i]))
    return [i for i in range(n + 1) if sv[i]]
def jacobi(a, n):
    a %= n; t = 1
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): t = -t
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: t = -t
        a %= n
    return t if n == 1 else 0
chi5 = lambda n: (0, 1, -1, -1, 1)[n % 5]            # real even primitive mod 5
w7 = cmath.exp(2j * math.pi / 6)
_ind7 = {1: 0, 3: 1, 2: 2, 6: 3, 4: 4, 5: 5}         # powers of the primitive root 3 mod 7
chi7 = lambda n: 0 if n % 7 == 0 else w7 ** _ind7[n % 7]   # complex odd primitive mod 7 (order 6)

# ---------- item 1: Lemma J1 and the T-NR lift ----------
def K3z(u, N):   # zeta kernel without polar terms (Phi-type), even
    return sum((2 * math.pi ** 2 * n ** 4 * math.exp(4.5 * u) - 3 * math.pi * n * n * math.exp(2.5 * u)) * math.exp(-math.pi * n * n * math.exp(2 * u)) for n in range(1, N + 1))
def Kchi(u, N, chi, q, d):
    return sum(chi(n) * n ** d * cmath.exp((0.5 + d) * u) * math.exp(-math.pi * n * n * math.exp(2 * u) / q) for n in range(1, N + 1))
def jc2(KA, KB, u, h, lam):
    return (KA(u - h) * np.conj(KA(u + h))).real * abs(KB(u)) ** 2 - lam * abs(KA(u)) ** 2 * (KB(u - h) * np.conj(KB(u + h))).real
def jc1(KA, KB, u, h, lam, s=1):
    return (KA(u - s * h) * KB(u + s * h) - lam * KA(u) * KB(u)).real
out = {}
for N in (12, 40):
    worst2 = 0; worst1 = 0; signs = 0; tot = 0
    for _ in range(400):
        tau = -10 ** rng.uniform(-1.7, 0.3); u = rng.uniform(-1.2, 1.2); h = rng.uniform(0.02, 0.8); lam = rng.uniform(-2, 4)
        g = lambda x: math.exp(tau * x * x / 4)
        A = lambda x: K3z(x, N); B = lambda x: Kchi(x, N, chi7, 7, 1)
        Ah = lambda x: g(x) * A(x); Bh = lambda x: g(x) * B(x)
        v_h = jc2(Ah, Bh, u, h, lam); v_p = g(u) ** 4 * math.exp(tau * h * h / 2) * jc2(A, B, u, h, lam)
        sc = abs(v_h) + abs(v_p) + 1e-300
        worst2 = max(worst2, abs(v_h - v_p) / sc)
        w_h = jc1(Ah, Bh, u, h, lam); w_p = g(u) ** 2 * math.exp(tau * h * h / 2) * jc1(A, B, u, h, lam * math.exp(-tau * h * h / 2))
        worst1 = max(worst1, abs(w_h - w_p) / (abs(w_h) + abs(w_p) + 1e-300))
        tot += 1; signs += (v_h > 0) == (jc2(A, B, u, h, lam) > 0)
    out["N=%d" % N] = {"J1_i_rel_defect": worst2, "J1_ii_rel_defect": worst1, "JC2_equal_signs": "%d/%d" % (signs, tot)}
# unequal tau on the two members: identity (i) must fail
tauA, tauB = -0.5, -0.1; u, h, lam = 0.3, 0.6, 1.0
A = lambda x: K3z(x, 40); B = lambda x: Kchi(x, 40, chi7, 7, 1)
v = jc2(lambda x: math.exp(tauA * x * x / 4) * A(x), lambda x: math.exp(tauB * x * x / 4) * B(x), u, h, lam)
vp = math.exp(tauA * u * u / 2 + tauB * u * u / 2) * (math.exp(tauA * h * h / 2) * (A(u - h) * np.conj(A(u + h))).real * abs(B(u)) ** 2 - lam * math.exp(tauB * h * h / 2) * abs(A(u)) ** 2 * (B(u - h) * np.conj(B(u + h))).real)
out["unequal_tau"] = {"value": v, "two_factor_formula": vp, "rel_defect": abs(v - vp) / abs(v)}
# T-NR lift: functional equation K_B(-u) = conj K_B(u) after omega normalisation, p0 = 3, c = 2.2, chi7
fe = {}
for N in (30, 60):
    k = lambda x: Kchi(x, N, chi7, 7, 1)
    eps = k(-0.3) / np.conj(k(0.3)); om = cmath.sqrt(eps)
    kk = lambda x: k(x) / om
    l = math.log(3); c = 2.2; x3 = chi7(3)
    T = lambda x: np.conj(x3) * kk(x - l) + c * kk(x) + x3 * kk(x + l)
    Twrong = lambda x: x3 * kk(x - l) + c * kk(x) + np.conj(x3) * kk(x + l)
    Tsame = lambda x: kk(x - l) + c * kk(x) + kk(x + l)
    res = lambda f, x: abs(f(-x) - np.conj(f(x))) / (abs(f(-x)) + abs(f(x)))
    fe["N=%d" % N] = {"abs_eps": abs(eps), "K_chi_residual_u0.9": res(kk, 0.9), "TNR_lift_residual_u0.9": res(T, 0.9),
                      "untwisted_multiplier_residual_u0.9": res(Tsame, 0.9), "swapped_phases_residual_u0.9": res(Twrong, 0.9)}
out["TNR_lift_FE"] = fe
R["item1_J1_and_TNR_lift"] = out

# ---------- item 2: Lemma C, identity TW, exponent of Lemma A ----------
out = {}
s = 3 + 2j
def lemmaC(p0, c, chi, q, N):
    n = np.arange(1, N + 1)
    a = np.ones(N) + c * math.sqrt(p0) * (n % p0 == 0) + p0 * (n % (p0 * p0) == 0)
    ch = np.array([chi(int(k)) for k in n], dtype=complex)
    return (a * ch * n ** (-s)).sum() / (a * n ** (-s)).sum()
Q = complex(mp.dirichlet(s, [0, 1, -1, -1, 1]) / mp.zeta(s))
for N in (2000, 20000):
    out["N=%d" % N] = {"split p0=11 (chi5(11)=1): |ratio - L/zeta|": abs(lemmaC(11, 2.5, chi5, 5, N) - Q),
                       "inert p0=3 (chi5(3)=-1): |ratio - L/zeta|": abs(lemmaC(3, 2.2, chi5, 5, N) - Q)}
x = (-2.5 + math.sqrt(2.5 ** 2 - 4)) / 2
out["zero_of_D_p0=11_c=2.5"] = {"x": x, "Re_s": 0.5 - math.log(abs(x)) / math.log(11), "c_max": 11 ** .5 + 11 ** -.5}
# TW
M = 6; delta = math.log(1 + 1 / M); wd = delta / 2
cm = {m: complex(rng.gauss(0, 1), rng.gauss(0, 1)) for m in range(1, M + 1)}
def phi(r):
    r = np.asarray(r, dtype=float); o = np.zeros_like(r); m = np.abs(r) < wd
    o[m] = np.exp(-1.0 / (1 - (r[m] / wd) ** 2)); return o
def gfun(coef, r): return sum(coef[m] * phi(r - math.log(m)) for m in coef)
def auto(coef, x, G):
    r = np.linspace(-wd, math.log(M) + wd, G); dr = r[1] - r[0]
    return (gfun(coef, r) * np.conj(gfun(coef, r - x))).sum() * dr
def mangoldt(n):
    for p in primes_upto(n):
        if n % p == 0:
            while n % p == 0: n //= p
            return math.log(p) if n == 1 else 0.0
    return 0.0
for chi, q, name in ((chi5, 5, "chi5 (even real)"), (chi7, 7, "chi7 (odd complex)")):
    c0 = {m: (cm[m] if math.gcd(m, q) == 1 else 0) for m in cm}
    ct = {m: c0[m] * chi(m) for m in c0}
    rec = {}
    for G, NN in ((4001, 40), (16001, 120)):
        Pchi = 0; Pz = 0; worst = 0; off = 0
        for n in range(2, NN + 1):
            L = mangoldt(n)
            a0 = auto(c0, math.log(n), G); at = auto(ct, math.log(n), G)
            worst = max(worst, abs(at - chi(n) * a0))
            if n > M: off = max(off, abs(a0), abs(at))
            if L:
                Pchi += n ** -.5 * 2 * (chi(n) * L * a0).real; Pz += n ** -.5 * 2 * (L * at).real
        nphi = (phi(np.linspace(-wd, wd, G)) ** 2).sum() * (2 * wd / (G - 1))
        rec["grid=%d,n<=%d" % (G, NN)] = {"P_chi(g_c)": Pchi, "P_zeta(g_c_chi)": Pz, "defect": abs(Pchi - Pz),
            "max |auto_twisted(log n) - chi(n) auto(log n)|": worst, "max |auto(log n)| for n > M": off,
            "||g_c||^2 / (||phi||^2 ||c||^2)": (auto(c0, 0.0, G) / (nphi * sum(abs(v) ** 2 for v in c0.values()))).real}
    out["TW " + name] = rec
th = lambda sg: 3 * (1 - sg) / (2 - sg)
out["LemmaA_exponent"] = {"theta(1/2)": th(.5), "theta(4/5)": th(.8), "2(1-s)/s at 4/5": 2 * .2 / .8, "theta(0.9) by first formula (outside its range)": th(.9), "2(1-s)/s at 0.9": 2 * .1 / .9}
R["item2_pair_design"] = out

# ---------- item 3: weight-1/2 coefficients ----------
out = {}
def eps_d(d): return 1 if d % 4 == 1 else 1j
def Kloo(ms, c):
    ds = [d for d in range(1, c, 2) if math.gcd(d, c) == 1]
    wts = np.array([eps_d(d) * jacobi(c, d) for d in ds]); dd = np.array(ds)
    return [complex((wts * np.exp(2j * math.pi * m * dd / c)).sum()) for m in ms]
ms = [1, 4, 9, 36, 0, 2]
s_ = mp.mpf("1.8"); u_ = 2 * s_ - mp.mpf(1) / 2
zf = mp.zeta(u_) / ((1 + 2 ** (-u_)) * mp.zeta(2 * u_))
W0 = (1 + 1j) * 2 ** (-4 * s_) * (1 + 2 ** (1 - u_))
W1 = (1 + 1j) * (2 ** (-4 * s_) + 4 * 2 ** (-8 * s_)) + 16 * mp.exp(1j * mp.pi / 4) * 2 ** (-10 * s_)
x3 = mp.mpf(3) ** (-2 * s_); L3 = (1 + 6 * x3 ** 2 + mp.mpf(3) ** 2.5 * x3 ** 3) / (1 + mp.mpf(3) ** (-u_))
closed = {1: W0 * zf, 4: W1 * zf, 9: W0 * zf * L3, 36: W1 * zf * L3,
          0: (1 + 1j) * 2 ** (-4 * s_) * mp.zeta(4 * s_ - 2) / ((1 - 2 ** (1 - 4 * s_)) * mp.zeta(4 * s_ - 1))}
acc = {m: 0j for m in ms}
for C in (800, 1600):
    for c in range(4 if C == 800 else 804, C + 1, 4):
        ks = Kloo(ms, c)
        for m, kv in zip(ms, ks): acc[m] += kv * c ** (-2 * float(s_))
    out["c<=%d" % C] = {("A(%d)" % m): {"series": [acc[m].real, acc[m].imag], "closed": ([float(mp.re(closed[m])), float(mp.im(closed[m]))] if m in closed else None),
                         "abs_diff": (abs(acc[m] - complex(closed[m])) if m in closed else None)} for m in ms}
# output inequality (C): P - 1 <= w*(P, d)
def wstar(P, d):
    A = (d - 1) / 2 + d * (P - 1); return (A * P - (P - 1)) / (A + 1)
out["min over grid of w*(1+b0,d) - b0"] = min(wstar(1 + b / 100, d) - b / 100 for d in (2, 3, 4, 6, 9, 16) for b in range(0, 51))
R["item3_weight_half"] = out

# ---------- item 4: Lax-Phillips norms ----------
out = {}
lam = lambda nu, n: sum((mp.mpf(d) / (n // d)) ** nu for d in range(1, n + 1) if n % d == 0)
worst = 0
for (m, n) in ((6, 10), (12, 18), (8, 4), (9, 27), (30, 42), (16, 64)):
    th_ = mp.mpf("0.23")
    worst = max(worst, abs(lam(th_, m) * lam(th_, n) - sum(lam(th_, m * n // (d * d)) for d in range(1, math.gcd(m, n) + 1) if math.gcd(m, n) % d == 0)))
out["Hecke_rule_for_lambda_theta_max_defect"] = float(worst)
lampk = lambda nu, p, k: sum(mp.mpf(p) ** ((2 * j - k) * nu) for j in range(k + 1))     # lambda_nu(p^k)
def supratio(mu, th_, K, p=2):
    return max(float(abs(lampk(mu, p, k)) / lampk(mp.mpf(th_), p, k)) for k in range(0, K + 1))
g1 = mp.im(mp.zetazero(1))
for K in (30, 60):
    out["H2 sup over k<=%d, p=2" % K] = {"a=0.25 (first zero), theta=0.25": supratio(mp.mpc(-0.25, g1 / 2), 0.25, K),
        "a=0.25, theta=0.20": supratio(mp.mpc(-0.25, g1 / 2), 0.20, K), "a=0.10, theta=0.20": supratio(mp.mpc(-0.10, g1 / 2), 0.20, K),
        "a=0.26, theta=0.25": supratio(mp.mpc(-0.26, g1 / 2), 0.25, K)}
def ht(x, y):
    z = complex(x, y)
    for _ in range(10000):
        z = complex(z.real - round(z.real), z.imag)
        if abs(z) < 1 - 1e-13: z = -1 / z
        else: break
    return z.imag
for NS in (300, 1500):
    mn = 1e9
    r2 = random.Random(150002)
    for _ in range(NS):
        x = r2.uniform(-.5, .5); y = math.exp(r2.uniform(-3, 2)); p = r2.choice([2, 3, 5, 7]); sp = r2.uniform(0.05, 1.3)
        Tu = p ** -.5 * (ht(p * x, p * y) ** sp + sum(ht((x + b) / p, y / p) ** sp for b in range(p)))
        mn = min(mn, Tu / ((p ** (sp - .5) + p ** (.5 - sp)) * ht(x, y) ** sp))
    out["Theorem L: min of T_p ht^s'/(lambda ht^s') over %d points" % NS] = mn
# Lemma Q inequality sum_{dd'=n} e^{theta|log d/d'|} <= 2 lambda_theta(n)
out["Lemma Q max ratio"] = max(float(sum(mp.e ** (mp.mpf(t) * abs(mp.log(mp.mpf(d) / (n // d)))) for d in range(1, n + 1) if n % d == 0) / (2 * lam(mp.mpf(t), n))) for n in range(1, 121) for t in (0.1, 0.25, 0.4))
# mean-zero subspace: sup over 0<=Re nu<=a of |p^nu + p^-nu| equals p^a + p^-a
a = 0.25; p = 2
out["mean-zero cap: max |lambda_nu(2)| on Re nu in [0,a], vs p^a+p^-a"] = [max(abs(p ** complex(a * i / 20, t / 10) + p ** -complex(a * i / 20, t / 10)) for i in range(21) for t in range(0, 200)), p ** a + p ** -a]
R["item4_lax_phillips"] = out

# ---------- item 5: Lemma T, Proposition E ----------
out = {}
nu = complex(0.15, 7.0)
def rs_check(N):
    tau = np.zeros(N + 1, dtype=complex)
    n = np.arange(1, N + 1)
    for d in range(1, N + 1):
        k = np.arange(d, N + 1, d)            # n = d * e
        tau[k] += (d * d / k) ** nu           # (d/e)^nu, e = n/d
    ch = np.array([chi5(int(k)) for k in n])
    return (np.abs(tau[1:]) ** 2 * ch * n ** (-3.0)).sum()
s3 = mp.mpf(3); ch5 = [0, 1, -1, -1, 1]
prod = mp.mpf(1)
for l in (2 * nu.real, -2 * nu.real, 2j * nu.imag, -2j * nu.imag): prod *= mp.dirichlet(s3 + l, ch5)
rhs = complex(prod / mp.zeta(2 * s3) / (1 - mp.mpf(5) ** (-2 * s3)) ** -1 * 1)   # L(2s, chi^2) = zeta(2s)(1 - 5^-2s)
rhs = complex(prod / (mp.zeta(2 * s3) * (1 - mp.mpf(5) ** (-2 * s3))))
for N in (2000, 20000):
    v = rs_check(N); out["Lemma T(i), std x conj(std)~ twisted by chi5, N=%d" % N] = {"series": [v.real, v.imag], "product": [rhs.real, rhs.imag], "abs_diff": abs(v - rhs)}
out["L(0,chi) even primitive: chi5"] = float(abs(mp.dirichlet(0, ch5)))
out["L(0,chi) odd primitive: chi mod 4 (not zero)"] = float(abs(mp.dirichlet(0, [0, 1, 0, -1])))
xi = lambda u: mp.pi ** (-u / 2) * mp.gamma(u / 2) * mp.zeta(u)
pe = {}
for dps in (20, 40):
    mp.mp.dps = dps
    rec = {}
    for k in (1, 2, 3):
        rho = mp.zetazero(k)
        rec["zero %d" % k] = {"|xi(rho)|": float(abs(xi(rho))), "|xi(2-rho)|": float(abs(xi(2 - rho))), "|xi(rho-1)|": float(abs(xi(rho - 1)))}
    t = mp.mpf("7.3")
    rec["edge t=7.3"] = {"|xi(1+2it)|": float(abs(xi(1 + 2j * t))), "|xi(2it)|": float(abs(xi(2j * t)))}
    pe["dps=%d" % dps] = rec
mp.mp.dps = 30
out["Proposition E"] = pe
R["item5_x2_catalogue"] = out

# ---------- item 6: Lemma F, Q-B ----------
out = {}
def Theta(z, aa): return (z - aa) * (z - np.conj(aa)) / ((z + aa) * (z + np.conj(aa)))
Mf = lambda z: 0.9 * (1 - z) / (1 + z) * np.exp(-0.3 * z)        # a Schur function on Re z > 0
aa = 0.3 + 2.1j
r3 = random.Random(150003)
for order in (6, 10):
    zs = np.array([complex(r3.uniform(0.2, 2.5), r3.uniform(-4, 4)) for _ in range(order)])
    def pick(f): return np.array([[(1 - f(z) * np.conj(f(w))) / (z + np.conj(w)) for w in zs] for z in zs])
    f1 = Mf; f2 = lambda z: Mf(z) * Theta(z, aa); f3 = lambda z: Mf(z) / Theta(z, aa)
    idd = max(abs((1 - f2(z) * np.conj(f2(w))) - ((1 - Theta(z, aa) * np.conj(Theta(w, aa))) + Theta(z, aa) * (1 - Mf(z) * np.conj(Mf(w))) * np.conj(Theta(w, aa)))) for z in zs for w in zs)
    ev = lambda f: [float(x) for x in np.linalg.eigvalsh(pick(f))[[0, -1]]]
    out["order %d" % order] = {"B3 identity defect": idd, "Pick eig (min,max) M": ev(f1), "M Theta": ev(f2), "M / Theta": ev(f3)}
# T-NR quotient D(z)/D(z+1): unimodular on the axis, bounded by 1 in Re z > 0
p0, c = 3, 2.2
D = lambda z: p0 ** (z - .5) + p0 ** (.5 - z) + c
per = 2 * math.pi / math.log(p0)
for G in (60, 240):
    sup = 0; ax = 0
    for i in range(G):
        t = per * i / G
        ax = max(ax, abs(abs(D(1j * t) / D(1j * t + 1)) - 1))
        for j in range(1, G):
            xr = 3.0 * j / G
            sup = max(sup, abs(D(complex(xr, t)) / D(complex(xr, t) + 1)))
    out["T-NR quotient, grid %d" % G] = {"max | |Theta| - 1 | on axis": ax, "sup |Theta| on 0 < Re z <= 3": sup, "limit 1/p0": 1 / p0}
R["item6_lemma_F"] = out

json.dump(R, open(OUT, "w"), indent=1, default=str)
print(json.dumps(R, indent=1, default=str))
