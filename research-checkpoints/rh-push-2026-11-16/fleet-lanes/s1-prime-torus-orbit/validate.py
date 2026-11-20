"""Known-answer checks for torus.py (run before any test)."""
import sys, math, json
import numpy as np, mpmath as mp
import torus as T
from torus import xp

mp.mp.dps = 40
res = {}

# 1. fixed-point phases against mpmath at t ~ 1e12
pr = T.sieve(2000)
hi, lo = T.fixed_logs(pr)
tt = np.array([999999999989, 123456789012, 7, 1099511627775], dtype=np.uint64)
C = T.asnp(T.base_cycles(tt, hi, lo))
err = 0
for i, t in enumerate(tt):
    for j in (0, 1, 5, 100, len(pr) - 1):
        x = mp.mpf(int(t)) * mp.log(int(pr[j])) / (2 * mp.pi)
        x = x - mp.floor(x)
        d = abs(float(x) - C[i, j]); d = min(d, 1 - d)
        err = max(err, d)
res['phase_err_cycles'] = err
assert err < 1e-13, err

# 2. truncated Euler product against mpmath product, and DH/log-derivative identities right of 1
t_int = np.array([1000, 31415926535], dtype=np.int64); delta = np.array([0.25, 0.5]); sig = np.array([0.5, 0.75])
U = T.families(pr)
out, e3 = T.euler_logs(t_int, delta, sig, [U['ZETA'], U['CHI']], pr, hi, lo, [100, 2000])
for k in range(2):
    s = mp.mpc(sig[k], int(t_int[k]) + delta[k])
    ref = sum(-mp.log(1 - mp.mpf(int(p)) ** (-s)) for p in pr if p <= 100)
    ref2 = sum(-mp.log(1 - complex(T.chi5(p)) * mp.mpf(int(p)) ** (-s)) for p in pr)
    e = abs(complex(ref) - out[k, 0, 0]); e2 = abs(complex(ref2) - out[k, 1, 1])
    res[f'euler_err_{k}'] = max(e, e2)
    assert max(e, e2) < 1e-9, (e, e2)
    assert abs(e3[k] - complex(mp.mpf(3) ** (-1j * (int(t_int[k]) + delta[k])))) < 1e-10

# 3. Dirichlet sums via composite levels against direct mpmath sums
N = 3000
lev = T.Levels(N)
hp, lp = T.fixed_logs(lev.primes)
coef = np.stack([np.ones(N + 1), T.chi5(np.arange(N + 1))], axis=1).astype(complex); coef[0] = 0
S = T.dir_sums(t_int, delta, sig, np.array([3000, 1777]), coef, lev, hp, lp)
for k, M in enumerate([3000, 1777]):
    s = mp.mpc(sig[k], int(t_int[k]) + delta[k])
    ref = mp.fsum(mp.mpf(n) ** (-s) for n in range(1, M + 1))
    ref2 = mp.fsum(complex(T.chi5(n)) * mp.mpf(n) ** (-s) for n in range(1, M + 1))
    e = max(abs(complex(ref) - S[k, 0]), abs(complex(ref2) - S[k, 1]))
    res[f'dirsum_err_{k}'] = e
    assert e < 1e-9, e

# 4. DH: functional equation and coefficient/log-derivative recursion
chi = [0, 1, 1j, -1j, -1]; chib = [0, 1, -1j, 1j, -1]
def DH(s):
    return T.DH_C1 * mp.dirichlet(s, chi) + T.DH_C2 * mp.dirichlet(s, chib)
def xiDH(s):
    return (mp.mpf(5) / mp.pi) ** (s / 2) * mp.gamma((s + 1) / 2) * DH(s)
s = mp.mpc(0.3, 7.7)
fe = abs(xiDH(s) - xiDH(1 - s)) / abs(xiDH(s))
res['dh_fe_rel'] = float(fe); assert fe < 1e-14
a = T.dh_coeffs(4000); LD = T.log_derivative_coeffs(a)
s = mp.mpf(6)
lhs = -mp.diff(DH, s) / DH(s)
rhs = mp.fsum(LD[n] * mp.mpf(n) ** (-s) for n in range(2, 4001))
res['dh_logder_err'] = float(abs(lhs - rhs)); assert abs(lhs - rhs) < 1e-12
# root number: L(s,chi) = X(s) L(1-s,chibar)
s = mp.mpc(0.3, 7.7)
e = abs(mp.dirichlet(s, chi) - T.X_factor(s, 5, 1, complex(T.W5)) * mp.dirichlet(1 - s, chib))
res['chi_fe_err'] = float(e); assert e < 1e-13
e = abs(mp.zeta(s) - T.X_factor(s, 1, 0, 1.0) * mp.zeta(1 - s)); assert e < 1e-20

# 5. T-NR log-derivative coefficients (right of the abscissa) and zero location
LT = T.tnr_lambda(3 ** 9)
s = mp.mpf(4)
m = lambda s: mp.mpf(3) ** (s - 0.5) + T.TNR_C + mp.mpf(3) ** (0.5 - s)
lhs = -mp.diff(lambda s: mp.zeta(s) * m(s), s) / (mp.zeta(s) * m(s)) + mp.log(3)
LZ = T.mangoldt(3 ** 9)
rhs = -mp.diff(mp.zeta, s) / mp.zeta(s) + mp.fsum((LT[n] - LZ[n]) * mp.mpf(n) ** (-s) for n in range(2, 3 ** 9 + 1) if LT[n] != LZ[n])
res['tnr_logder_err'] = float(abs(lhs - rhs)); assert abs(lhs - rhs) < 1e-6
z0 = mp.mpc(0.5 + T.TNR_B, mp.pi / mp.log(3))
assert abs(m(z0)) < 1e-12
res['tnr_zero'] = [0.5 + T.TNR_B, float(mp.pi / mp.log(3))]

# 6. Gram points of zeta against mpmath
for n in (100, 10 ** 6):
    g = T.gram_point(n)
    e = abs(g - mp.grampoint(n)); assert e < 1e-20, e
res['gram_ok'] = True
print(json.dumps(res, indent=1, default=float))
print('GPU', T.GPU, 'ALL CHECKS PASSED')
