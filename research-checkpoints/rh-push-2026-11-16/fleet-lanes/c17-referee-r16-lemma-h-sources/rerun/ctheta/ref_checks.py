"""Second-pass checks written separately from cluster.py (mpmath only, 30 digits).
A. pair identity K_u(b+iy)+K_u(-b+iy) real part = 2 Re F_u(y+ib).
B. Poisson identity for a row (Theorem B), both regimes.
C. Lemma T algebra: int G_u(tau) w_phi(tau) dtau = D_u + Re[e^{-i phi} S_u(v0)], S_u(v0) = pi sum_zeta e^{-i v0 (zeta-t)} [(1-v0/u) B(zeta-t) - B1(zeta-t)/u],
   and u2 S_u2 - u1 S_u1 = pi (u2-u1) T(v0).
D. Lemma R bound on E(y,b) = 2 Re F_u(y+ib) - 2 F_u(y).
E. Turan second main theorem (constant 8e), random trials, and the continuous form used in Lemma T."""
import mpmath as mp, random, json, os
mp.mp.dps = 30
HERE = os.path.dirname(os.path.abspath(__file__))
out = {}
def F(u, z): return (1 - mp.cos(u * z)) / (u * z * z)
def K(u, w): return 1 / w - (1 - mp.exp(-u * w)) / (u * w * w)
# A
d = 0
for (u, y, b) in [(3.3, 0.7, 0.4), (12.0, -2.2, 0.21), (20.7, 0.31, 0.49)]:
    d = max(d, abs(mp.re(K(u, mp.mpc(b, y)) + K(u, mp.mpc(-b, y))) - 2 * mp.re(F(u, mp.mpc(y, b)))))
out["A_max_diff"] = float(d); print("A", d)
# B
res = []
for (dd, b, u, y) in [(0.25, 0.45, 20.0, 0.113), (0.30, 0.3, 20.7, 1.7), (0.40, 0.2, 20.0, 0.05), (0.50, 0.1, 20.0, 0.21)]:
    s = mp.nsum(lambda j: 2 * mp.re(F(u, mp.mpc(y - j * dd, b))), [-mp.inf, mp.inf])
    v1 = 2 * mp.pi / dd
    pred = v1 * (1 + sum((1 - k * v1 / u) * 2 * mp.cosh(k * v1 * b) * mp.cos(k * v1 * y) for k in range(1, 20) if k * v1 < u))
    res.append((dd, b, u, float(s), float(pred), float(abs(s - pred))))
    print("B", res[-1])
out["B"] = res
# C
delta = mp.mpf("0.3")
def B(z): return delta / (2 * mp.pi) * (mp.sin(delta * z / 2) / (delta * z / 2)) ** 2 if z != 0 else delta / (2 * mp.pi)
def bhat(eta): return max(0, 1 - abs(eta) / delta)
def B1(z):   # (1/2pi) int eta bhat(eta) e^{-i eta z} d eta
    return mp.quad(lambda e: e * bhat(e) * mp.exp(-1j * e * z), [-delta, 0, delta]) / (2 * mp.pi)
t = mp.mpf(0)
online = [mp.mpf(x) for x in (-3.1, -1.7, -0.4, 0.9, 2.2, 3.6)]
pairs = [(mp.mpf("0.2"), mp.mpf("0.35")), (mp.mpf("-0.6"), mp.mpf("0.15"))]
zetas = [mp.mpc(g, 0) for g in online] + [mp.mpc(g, b) for g, b in pairs] + [mp.mpc(g, -b) for g, b in pairs]
def G(u, tau): return sum(F(u, tau - g) for g in online) + sum(2 * mp.re(F(u, mp.mpc(tau - g, b))) for g, b in pairs)
def S(u, v0): return mp.pi * sum(mp.exp(-1j * v0 * (z - t)) * ((1 - v0 / u) * B(z - t) - B1(z - t) / u) for z in zetas)
def D(u): return sum(mp.quad(lambda xi: (1 - abs(xi) / u) * bhat(xi) * mp.exp(-1j * xi * (z - t)), [-delta, 0, delta]) / 2 for z in zetas)
u, v0, phi = mp.mpf(8), mp.mpf("3.1"), mp.mpf("0.9")
# direct integral, truncated at |tau| <= R with the tail bounded by the 1/tau^2 decay of B
R = 3000
pts = [mp.mpf(x) for x in range(-R, R + 1, 25)]
I = mp.quad(lambda tau: G(u, tau) * B(tau - t) * (1 + mp.cos(v0 * (tau - t) + phi)), mp.linspace(-R, R, 2401))
rhs = D(u) + mp.re(mp.exp(-1j * phi) * S(u, v0))
print("C direct", I, "formula", rhs)
u1 = mp.mpf(5)
T = sum(B(z - t) * mp.exp(-1j * v0 * (z - t)) for z in zetas)
lhs = u * S(u, v0) - u1 * S(u1, v0)
print("C two-u identity", abs(lhs - mp.pi * (u - u1) * T))
out["C_direct"] = float(mp.re(I)); out["C_formula"] = float(mp.re(rhs)); out["C_two_u_diff"] = float(abs(lhs - mp.pi * (u - u1) * T))
# D
worst = 0
for u in (3.0, 10.0, 20.0):
    for b in (0.01, 0.05, 0.2, 0.5):
        for k in range(1, 400):
            y = k * 0.037
            E = 2 * mp.re(F(u, mp.mpc(y, b))) - 2 * F(u, y)
            bound = min(u * (mp.cosh(u * b) - 1), (2 / y ** 2) * (3 * (mp.cosh(u * b) - 1) / u + b * mp.sinh(u * b)))
            worst = max(worst, abs(E) / bound)
print("D max |E|/bound", worst); out["D_max_ratio"] = float(worst)
# E: Turan second main theorem, random trials; ratio = max_{nu in [m+1,m+n]} |s_nu| / (2 (n/(8e(m+n)))^n min_k |b_1+..+b_k|) must be >= 1
random.seed(7); wr = mp.inf
for trial in range(3000):
    n = random.choice([1, 2, 3, 4, 5]); m = random.choice([0, 1, 2, 5, 10])
    zs = sorted([mp.mpc(mp.rect(random.random(), random.uniform(0, 2 * 3.14159265))) for _ in range(n)], key=lambda z: -abs(z))
    zs = [z / abs(zs[0]) for z in zs]
    bs = [mp.mpc(random.gauss(0, 1), random.gauss(0, 1)) for _ in range(n)]
    part = min(abs(sum(bs[: k + 1])) for k in range(n))
    mx = max(abs(sum(b * z ** nu for b, z in zip(bs, zs))) for nu in range(m + 1, m + n + 1))
    wr = min(wr, mx / (2 * (mp.mpf(n) / (8 * mp.e * (m + n))) ** n * part))
print("E min ratio over 3000 trials (>= 1 expected)", wr); out["E_min_ratio"] = float(wr)
json.dump(out, open(os.path.join(HERE, "ref_checks.json"), "w"), indent=1)
