# Second-pass checks, written separately from checks.py (own Estermann routine by character expansion, mp.quad for the remainder).
# Planned allocations: lists of < 1e4 mpf. Run through scripts/memcap.sh 8.
from mpmath import mp, mpf, mpc, zeta, gamma, pi, exp, log, sin, fabs, re, im, nstr, quad, factorial, linspace
mp.dps = 30
I = mpc(0, 1)
def e(x): return exp(2 * pi * I * x)
def primroot(q):
    for g in range(2, q):
        seen, x = set(), 1
        for _ in range(q - 1):
            x = x * g % q; seen.add(x)
        if len(seen) == q - 1: return g
def chars(q):
    g = primroot(q); ind = {}; x = 1
    for m in range(q - 1):
        ind[x] = m; x = x * g % q
    return [{r: e(mpf(k * ind[r]) / (q - 1)) for r in range(1, q)} for k in range(q - 1)]
def L(s, chi, q): return mpf(q) ** (-s) * sum(chi[r] * zeta(s, mpf(r) / q) for r in range(1, q))

# (i) Estermann by a route different from checks.py: periodic zeta F(u,x) = sum e(nx) n^-u = k^-u sum_r e(rx) zeta(u, r/k);
#     D(u,w;h/k) = sum_m m^-u F(u-w, mh/k) = k^-u sum_r zeta(u, r/k) F(u-w, rh/k)
def periodic(u, h, k):
    return mpf(k) ** (-u) * sum(e(mpf(r * h % k) / k) * zeta(u, mpf(r) / k) for r in range(1, k + 1))
def D(u, w, h, k):
    if k == 1: return zeta(u) * zeta(u - w)
    return mpf(k) ** (-u) * sum(zeta(u, mpf(r) / k) * periodic(u - w, r * h % k, k) for r in range(1, k + 1))
def chi_fe(u): return 2 ** u * pi ** (u - 1) * sin(pi * u / 2) * gamma(1 - u)
def Q(j, s):
    p = mpf(1)
    for l in range(j): p *= (mpf(1) / 2 + l) ** 2 - s ** 2
    return p
def check(a, q, s, J, V, c):
    x = mpf(a) / q; y = x / (2 * pi * I); h = mpf(1) / 2
    lhs = D(h + s, 2 * s, a, q); main = mpc(0)
    for j in range(J + 1):
        cj = (-1) ** j * Q(j, s) / factorial(j)
        zs = sum((-1) ** (j - l) / factorial(j - l) * zeta(h + l + s) * zeta(h + l - s) * y ** l for l in range(j + 1))
        pol = sum(gamma(h + sg * s - j) * zeta(1 + 2 * sg * s) * (2 * pi / x) ** (-(h + sg * s)) * exp(-(h + sg * s) * pi * I / 2) for sg in (1, -1))
        main += cj * (y ** j * D(h + s + j, 2 * s, (-q) % a, a) - zs - pol)
    lg = log(2 * pi / x) + I * pi / 2
    def f(v):
        w = c + I * v
        Hk = (2 * pi) ** (2 * w) * gamma(-w) / (chi_fe(h + w - s) * chi_fe(h + w + s))
        T = sum((-1) ** j * Q(j, s) / factorial(j) * gamma(w - j) for j in range(J + 1))
        return (Hk - T) * zeta(h + w - s) * zeta(h + w + s) * exp(-w * lg)
    pts = [mpf(-45)] + [mpf(v) for v in range(-44, int(V) + 1, 1)]
    EJ = quad(f, pts, maxdegree=5) / (2 * pi)
    print(f"  (i) a={a} q={q} s_B={nstr(s,5)} J={J} c={nstr(c,3)}: D_0(a/q)={nstr(lhs,12)}; |D_0 - main - E_J| = {nstr(fabs(lhs-main-EJ),3)}; |E_J|={nstr(fabs(EJ),6)}", flush=True)
check(3, 11, mpc(0, 1.7), 5, 200, mpf(-0.7))
check(5, 7, mpc(0, 3.2), 6, 220, mpf(-0.8))   # a/q close to 1, both moduli > 2

# (ii) sign of the rotated pair = parity of sign changes of the Hardy function Z_chi on (-t, t)
mp.dps = 18
q = 5; CH = chars(q); chi = CH[1]; chib = CH[3]; kap = 1
def Lam(s, c): return (mpf(q) / pi) ** ((s + kap) / 2) * gamma((s + kap) / 2) * L(s, c, q)
ph = Lam(mpf(1) / 2, chi); ph = ph / fabs(ph)
def Z(t):
    v = Lam(mpc(0.5, t), chi) / ph / fabs(gamma(mpc(0.5 + kap, t) / 2))
    return v
grid = [mpf(i) / 50 for i in range(-1250, 1251)]
zv = []; worst = mpf(0)
for t in grid:
    v = Z(t); worst = max(worst, fabs(im(v))); zv.append(re(v))
ok = 0; tot = 0
for t in [mpf("2.31"), mpf("5.05"), mpf("7.77"), mpf("11.9"), mpf("13.33"), mpf("17.01"), mpf("20.5"), mpf("24.97")]:
    idx = [i for i, g in enumerate(grid) if -t < g < t]
    sc = sum(1 for i in idx[:-1] if zv[i] * zv[i + 1] < 0)
    s = mpc(0.5, t)
    R = re(Lam(s, chi) * Lam(s, chib) / fabs(gamma((s + kap) / 2)) ** 2)
    pred = 1 if sc % 2 == 0 else -1; tot += 1; ok += (pred == (1 if R > 0 else -1))
    print(f"  (ii) t={nstr(t,5)}: sign changes of Z_chi on (-t,t) = {sc}; R_chi(t) = {nstr(R,6)}; parity rule {'ok' if pred == (1 if R > 0 else -1) else 'FAIL'}; Z(t)Z(-t)/R = {nstr(Z(t)*Z(-t)/R,10)}")
print(f"  (ii) max |Im Z_chi| on the grid = {nstr(worst,3)}; parity rule {ok}/{tot}")

# (iii) T-NR five-term identity for the nonprincipal bilinear moment, on and off the line
q0, c = 2, mpf("2.1"); n = q - 1
for s in [mpc(0.5, 3.3), mpc(0.72, 6.1)]:
    y = mpf(q0) ** (mpf(1) / 2 - s)
    def S(a): return sum(CH[k][a % q] * L(s, CH[k], q) * L(s, CH[n - k], q) for k in range(1, n))
    q0i = pow(q0, q - 2, q)
    for a in [1, 2]:
        twin = sum(CH[k][a % q] * L(s, CH[k], q) * (CH[k][q0].conjugate() / y + c + CH[k][q0] * y) * L(s, CH[n - k], q) * (CH[n - k][q0].conjugate() / y + c + CH[n - k][q0] * y) for k in range(1, n))
        five = (y ** 2 + y ** -2 + c * c) * S(a) + c * (y + 1 / y) * (S(a * q0) + S(a * q0i)) + S(a * q0 * q0) + S(a * q0i * q0i)
        print(f"  (iii) s={nstr(s,4)} a={a}: twin moment={nstr(twin,10)}; |twin - five-term| = {nstr(fabs(twin-five),3)}")
