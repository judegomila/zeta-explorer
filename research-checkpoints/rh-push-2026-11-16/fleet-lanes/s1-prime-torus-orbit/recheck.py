"""Higher-precision re-check of the float64 pipeline at production sizes (mpmath, 40 digits, CPU).
(a) truncated Euler logs and prime sums at heights near 1e12 with all primes <= 1e6;
(b) Z(t) of zeta near 1e12 against mpmath.siegelz, and Z of L(chi), DH near 1e6 against mpmath.dirichlet;
(c) zeta off the line near 1e10 (approximate functional equation as used in test 4) against mpmath.zeta.
"""
import math, json
import numpy as np, mpmath as mp
import torus as T

mp.mp.dps = 40
res = {}
P = 10 ** 6
pr = T.sieve(P); hi, lo = T.fixed_logs(pr, cache='flog_1000000.npz')
U = T.families(pr)
ti = np.array([987654321098, 512345678901, 1000], dtype=np.int64); dl = np.array([0.3, 7.925, 0.5]); sg = np.array([0.5, T.SIGB, 0.5])
out, e3 = T.euler_logs(ti, dl, sg, [U['ZETA'], U['CHI'], U['SGN']], pr, hi, lo, [1e6])
logs = [mp.log(int(p)) for p in pr]
err = 0
for k in range(3):
    s = mp.mpc(sg[k], int(ti[k]) + mp.mpf(float(dl[k])))
    for f, name in enumerate(['ZETA', 'CHI', 'SGN']):
        u = U[name]
        ref = mp.fsum(-mp.log(1 - complex(u[i]) * mp.exp(-s * logs[i])) for i in range(len(pr)))
        d = abs(complex(ref) - out[k, f, 0]); err = max(err, d)
res['euler_log_P1e6_maxerr'] = float(err)
print('(a)', res, flush=True)

# (b)
N = int(math.sqrt(5e12 / (2 * math.pi))) + 5
lev = T.Levels(N); hp, lp = T.fixed_logs(lev.primes)
tz = [mp.mpf(10) ** 12 * mp.mpf('0.731') + k * mp.mpf('0.137') for k in range(12)]
ti = np.array([int(mp.floor(x)) for x in tz], dtype=np.int64); dl = np.array([float(x - mp.floor(x)) for x in tz])
t = ti + dl
tau = np.sqrt(t / (2 * math.pi)); M = np.floor(tau).astype(np.int64); p = tau - M
one = np.ones((N + 1, 1), dtype=complex); one[0] = 0
S = T.dir_sums(ti, dl, 0.5, M, one, lev, hp, lp)[:, 0]
ph = np.array([float(mp.fmod(T.theta_F(x), 2 * mp.pi)) for x in tz])
Z = 2 * (np.exp(1j * ph) * S).real + (-1.0) ** (M - 1) * tau ** -0.5 * np.cos(2 * math.pi * (p * p - p - 1 / 16)) / np.cos(2 * math.pi * p)
ref = np.array([float(mp.siegelz(x)) for x in tz])
res['zeta_Z_1e12_maxerr'] = float(np.abs(Z - ref).max()); res['zeta_Z_1e12_values'] = ref.tolist()
print('(b1)', res['zeta_Z_1e12_maxerr'], flush=True)

# (c) zeta in the strip near 1e10
tz = [mp.mpf(10) ** 10 * mp.mpf('0.6180339') + k * mp.mpf('0.211') for k in range(6)]
sgs = [0.52, 0.67, 0.75, 0.83, 0.9, 0.98]
ti = np.array([int(mp.floor(x)) for x in tz], dtype=np.int64); dl = np.array([float(x - mp.floor(x)) for x in tz]); sg = np.array(sgs)
t = ti + dl; M = np.floor(np.sqrt(t / (2 * math.pi))).astype(np.int64)
S1 = T.dir_sums(ti, dl, sg, M, one, lev, hp, lp)[:, 0]; S2 = T.dir_sums(ti, dl, 1 - sg, M, one, lev, hp, lp)[:, 0]
X = np.array([complex(T.X_factor(mp.mpc(sgs[k], tz[k]), 1, 0, 1.0)) for k in range(6)])
val = S1 + X * np.conj(S2)
ref = np.array([complex(mp.zeta(mp.mpc(sgs[k], tz[k]))) for k in range(6)])
res['zeta_strip_1e10_err'] = np.abs(val - ref).tolist(); res['zeta_strip_1e10_abs'] = np.abs(ref).tolist()
print('(c)', res['zeta_strip_1e10_err'], flush=True)
json.dump(res, open('recheck.json', 'w'), indent=1)
print('done')
