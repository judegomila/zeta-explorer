"""Same-session audit (not an independent referee). Three checks with code paths different from the experiments.
1. Translate identity: |F - chi conj F| / |F| for F = zeta(s + i alpha) evaluated from mp.zeta and the gamma-factor chi(s), against 2|sin(Psi/2)|.
2. Off-line zeros of the combinations: winding number of F on a circle of radius 0.01, 48 digits.
3. Survivors of contig.py: window defect at random (t, X) off the design grid; exact multiplicativity of a(n)."""
import mpmath as mp, numpy as np, json
mp.mp.dps = 48
def chi(s): return mp.pi**(s - mp.mpf(1) / 2) * mp.gamma((1 - s) / 2) / mp.gamma(s / 2)
def Psi(t, al): return 2 * (mp.siegeltheta(t + al) - mp.siegeltheta(t))
res = dict(identity=[], zeros=[], survivors=[])
for T, al in ((10030.0, 0.8515322655932238), (100300.0, 0.6491989714694907), (1003000.0, 0.5244446517715131), (1003000.0, 27.2711)):
    for dt in (0.0, 13.7, 31.9):
        t = mp.mpf(T) + dt; s = mp.mpc(0.5, t); F = mp.zeta(s + 1j * mp.mpf(al))
        lhs = abs(F - chi(s) * mp.conj(F)) / abs(F); rhs = 2 * abs(mp.sin(Psi(t, mp.mpf(al)) / 2))
        res["identity"].append([T, al, dt, float(lhs), float(rhs), float(abs(lhs - rhs))])
print("identity max |lhs - rhs| =", max(r[5] for r in res["identity"]), " sample:", res["identity"][0], res["identity"][-1], flush=True)
def winding(F, z0, r=mp.mpf("0.01"), n=64):
    tot = 0; prev = mp.arg(F(z0 + r))
    for k in range(1, n + 1):
        cur = mp.arg(F(z0 + r * mp.exp(2j * mp.pi * k / n))); d = cur - prev
        while d > mp.pi: d -= 2 * mp.pi
        while d < -mp.pi: d += 2 * mp.pi
        tot += d; prev = cur
    return float(tot / (2 * mp.pi))
for sign, al, zs in ((+1, 0.5244446517715131, [(0.6214296408733061, 1003003.2950764798)]),
                     (-1, 0.8515322655932238, [(0.8947065986189371, 10084.778352651363), (0.6132136464164205, 10093.442200140486)]),
                     (-1, 0.6491989714694907, [(0.8474227456152688, 100306.4573048041), (0.6895216408413035, 100356.54154199049)])):
    F = lambda s, sign=sign, al=al: (mp.zeta(s) + sign * mp.zeta(s + 1j * mp.mpf(al))) / 2
    for x, y in zs:
        z = mp.findroot(F, mp.mpc(x, y), tol=1e-40)
        res["zeros"].append(dict(sign=sign, alpha=al, re=float(z.real), im=float(z.imag), absF=float(abs(F(z))), winding=winding(F, z)))
        print("zero", res["zeros"][-1], flush=True)
from afe import coeff_rows
rng = np.random.default_rng(77)
for T, seed, K in ((1e5, 0, 16), (1e5, 1, 32), (1e6, 1, 128), (1e6, 0, 64)):
    th = np.load(f"surv_T{T:g}_s{seed}_K{K}.npy"); r0 = np.random.default_rng(1000 + seed); Ts = T * (1 + 0.01 * r0.random())
    N = int(round(3.2 * np.sqrt(T / (2 * np.pi)))); ps = [p for p in range(2, N + 1) if all(p % d for d in range(2, int(p**0.5) + 1))]
    a = np.ones(N + 1, complex)
    for n in range(2, N + 1):   # multiplicative construction by smallest prime factor (different from the exponent matrix)
        p = next(p for p in ps if n % p == 0); a[n] = a[n // p] * np.exp(1j * th[ps.index(p)])
    a = a[1:]; q = np.sqrt(Ts / (2 * np.pi)); R = N / (1.6 * q); worst = 0.0; wz = 0.0
    for _ in range(24):
        t = Ts + K * rng.random(); Xs = np.exp(np.log(R) * 0.95 * (2 * rng.random(4) - 1)); Xs = np.concatenate([[1.0], Xs])
        c1, c2 = coeff_rows(complex(0.5, t), Xs, N); v = c1 @ a + c2 @ np.conj(a); worst = max(worst, float(np.abs(v[1:] - v[0]).max()))
        vz = (c1 + c2).sum(1); wz = max(wz, float(np.abs(vz[1:] - vz[0]).max()))
    c1, c2 = coeff_rows(complex(0.6, Ts + 0.5), np.array([1.0, 0.7, 1.4]), N); v = c1 @ a + c2 @ np.conj(a); vz = (c1 + c2).sum(1)
    res["survivors"].append(dict(T=T, seed=seed, K=K, offgrid_defect=worst, zeta_same_points=wz, F_s0=float(abs(v[0])), xdep_s0=float(np.abs(v[1:] - v[0]).max()), zeta_at_s0=float(abs(vz[0]))))
    print("survivor", res["survivors"][-1], flush=True)
json.dump(res, open("audit.json", "w"), indent=1)
