"""validate.py -- known-answer checks of the shared code (local, small)."""
import math, json, sys
import numpy as np
import mpmath as mp
from fractions import Fraction
import pklib as L

res = {}
# 1. theta_phys against the recorded imp-95917 / imp-95898 numbers ----------------------------------
def vm(n):
    if n < 2: return 0.0
    m = n; q = 2
    while q * q <= m:
        if m % q == 0:
            while m % q == 0: m //= q
            return math.log(q) if m == 1 else 0.0
        q += 1
    return math.log(n)
ns = np.arange(1, 8001)
lam = np.array([vm(int(n)) for n in ns])
w = lam * np.exp(-((ns - 3000) / 1200.0) ** 2)
rec_phys = {(5, 5): 0.063451, (7, 6): 0.028574, (11, 7): 0.010205, (3, 4): 0.250922}
rec_uni = {(5, 5): 0.062728, (7, 6): 0.027870, (11, 7): 0.010036, (3, 4): 0.250662}
t1 = []
for (p, k) in rec_phys:
    Fh = np.array([np.sum(w * np.exp(-2j * np.pi * D * ns / p)) for D in range(p)])
    th = L.theta_from_fourier(p, k, Fh).real
    tu = L.theta_uniform(p, k)
    t1.append({"p": p, "k": k, "theta_phys": th, "recorded": rec_phys[(p, k)], "theta_uniform": tu, "recorded_uniform": rec_uni[(p, k)],
               "min_G": L.gram_diag_sums(p, k)[3]})
    assert abs(th - rec_phys[(p, k)]) < 2e-6 and abs(tu - rec_uni[(p, k)]) < 2e-6, (p, k, th, tu)
res["theta_phys_recorded"] = t1
print("1 ok", t1)

# 2. all-integer smooth sum equals the main term -------------------------------------------------------
t2 = []
for (T0, p, h, k) in [(1e8, 7, 6, 1), (3e12, 2, 1, 1), (1e10, 97, 96, 2), (1e7, 97, 96, 1)]:
    g = L.Grid(T0, 3, 2.0, p, h, k)
    n = np.arange(g.lo, g.hi, dtype=np.uint64)
    if len(n) > 4e7: continue
    V, Pm, M1, M2 = L.run_table(g, n, np.ones(len(n)))
    Fh = np.fft.fft(V, axis=-1)
    A = Fh[:, 0, h % p]
    mt = L.main_term(g)
    other = np.abs(np.delete(Fh[:, 0, :], h % p, axis=-1)).max() / np.abs(A).max()
    t2.append({"T0": T0, "p": p, "h": h, "k": k, "H": float(g.H[0]), "rel_err_main": float(np.abs(A - mt).max() / np.abs(mt).max()),
               "max_other_twist_rel": float(other), "rho_smooth": float((np.abs(A) / M1[:, 0]).mean())})
    assert t2[-1]["rel_err_main"] < 1e-6, t2[-1]
res["smooth_main_term"] = t2
print("2 ok", t2)

# 3. C sieve engine against a direct mpmath sum ---------------------------------------------------------
mp.mp.dps = 40
def mp_check(T0, p, h, k, j=1, W=3):
    g = L.Grid(T0, W, 2.0, p, h, k)
    V, Pm, M1, M2, cnt = L.run_block(g)
    pr = L.primes_range(g.lo, g.hi)
    c = mp.mpf(float(g.cj[j])); H = mp.mpf(float(g.H[j])); xi = mp.mpf(k * p - h) / p
    Vr = [[mp.mpc(0) for _ in range(p)] for _ in range(L.NV)]
    M1r = [mp.mpf(0)] * L.NV
    # prime powers
    items = [(int(q), int(q), 1) for q in pr]
    for jj in range(2, 64):
        qmax = int(g.hi ** (1.0 / jj)) + 2
        if qmax < 2: break
        for q in L.primes_range(2, qmax + 1):
            n = int(q) ** jj
            if g.lo <= n < g.hi: items.append((n, int(q), jj))
    for (n, q, jj) in items:
        x = (mp.mpf(n) - c) / H
        if abs(x) > g.X: continue
        lg = mp.log(mp.mpf(n) / c)
        amp = mp.exp(-x * x / 2 - mp.mpf(L.SIGMA_B) * lg)
        ph = mp.exp(-2j * mp.pi * xi * c * lg)
        cf = L.coef_ref(q, jj)
        cf[4] = cf[4] * (mp.exp(L.EA_A * lg) + mp.mpf(float(g.cm2a[j])) * mp.exp(-L.EA_A * lg))
        for v in range(L.NV):
            Vr[v][n % p] += mp.mpmathify(cf[v]) * amp * ph
            M1r[v] += abs(mp.mpmathify(cf[v])) * amp
    err = 0.0
    for v in range(L.NV):
        for r in range(p):
            err = max(err, float(abs(Vr[v][r] - mp.mpmathify(complex(V[j, v, r]))) / M1r[v]))
    errM = max(float(abs(M1r[v] - M1[j, v]) / M1r[v]) for v in range(L.NV))
    return {"T0": T0, "p": p, "h": h, "k": k, "terms": len(items), "max_abs_err_over_M1": err, "M1_rel_err": errM,
            "sqrt_cancel_scale": float(math.sqrt(M2[j, 0]) / M1[j, 0])}
t3 = [mp_check(1e9, 3, 1, 2), mp_check(1e6, 97, 96, 1), mp_check(2e4, 5, 2, 3)]
if "--big" in sys.argv:
    t3.append(mp_check(3e12, 2, 1, 1))
for t in t3:
    assert t["max_abs_err_over_M1"] < 1e-9 and t["M1_rel_err"] < 1e-12, t
res["engine_vs_mpmath"] = t3
print("3 ok", t3)

# 4. random-sign control: mean z^2 = 1 (exact expectation over the hash) -------------------------------
g = L.Grid(1e9, 400, 2.0, 7, 6, 1)
V, Pm, M1, M2, cnt = L.run_block(g)
st = L.stats_block(g, V, Pm, M1, M2)
z2 = (st["z"] ** 2).mean(0)
res["mean_z2_T1e9_p7_h6"] = dict(zip(L.VARIANTS, [float(x) for x in z2]))
res["mean_z2_stderr"] = float(1 / math.sqrt(400))
print("4", res["mean_z2_T1e9_p7_h6"])
assert abs(z2[2] - 1) < 0.2 and abs(z2[3] - 1) < 0.2

# 5. Lambda_DH: convolution identity and -f'/f(3) -------------------------------------------------------
N = 200000
Ld = L.dh_lambda(N)
kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
a5 = [0, 1, kap, -kap, -1]
worst = 0.0
for n in [6, 30, 97, 1024, 30030, 199999, 200000, 123456]:
    s = sum(a5[d % 5] * Ld[n // d] for d in range(1, n + 1) if n % d == 0)
    worst = max(worst, abs(s - a5[n % 5] * math.log(n)))
mp.mp.dps = 25
def f(s):
    return sum(a5[r] * mp.zeta(s, mp.mpf(r) / 5) for r in range(1, 5)) / mp.mpf(5) ** s
s0 = mp.mpf(3)
lhs = -mp.diff(f, s0) / f(s0)
nn = np.arange(1, N + 1)
rhs = float(np.sum(Ld[1:] * nn ** -3.0))
res["dh_lambda"] = {"convolution_residual": worst, "minus_f'/f(3)": float(lhs), "sum_Lambda_DH_n^-3": rhs, "Lambda_DH(6)": Ld[6],
                    "max_abs_Lambda_DH_le_2e5": float(np.abs(Ld).max())}
print("5", res["dh_lambda"])
assert worst < 1e-9 and abs(float(lhs) - rhs) < 1e-7
json.dump(res, open("validate.json", "w"), indent=1, default=float)
print("ALL OK")
