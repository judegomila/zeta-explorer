"""Test 4, second statistic: small-ball law of the recurrence distance at torus level.
d_F(tau) = max_{|z|=r} |F_P(s0+z+i tau) - F_P(s0+z)| / max |F_P(s0+z)| for N random tau in [Tlo, Thi] (orbit) and for
N Haar points, F_P the truncated torus functions of zeta, L(chi), DH, T-NR, E_a, sign twist, unimodular twist.
Output: quantiles of d_F, minimum, and the exponent d log P(d < eps) / d log eps (the decay rate of the minimum over
n samples is n^(-1/exponent))."""
import sys, math, json, time, argparse
import numpy as np
import torus as T

ap = argparse.ArgumentParser()
ap.add_argument('--N', type=int, default=300000)
ap.add_argument('--P', type=float, default=1e4)
ap.add_argument('--r', type=float, default=0.08)
ap.add_argument('--sigma0', type=float, default=0.75)
ap.add_argument('--tb', type=float, default=1000.3)
ap.add_argument('--npts', type=int, default=12)
ap.add_argument('--Tlo', type=float, default=1e6)
ap.add_argument('--Thi', type=float, default=1e12)
ap.add_argument('--out', default='t4b.json')
a = ap.parse_args()
t00 = time.time()
rng = np.random.default_rng(44)
pr = T.sieve(int(a.P)); hi, lo = T.fixed_logs(pr); U = T.families(pr)
AE = 0.15
ang = 2 * math.pi * np.arange(a.npts) / a.npts
zr, zi = a.r * np.cos(ang), a.r * np.sin(ang)
FL = [U['ZETA'], U['CHI'], U['CHIB'], U['SGN'], U['UNI']]
NAMES = ['ZETA', 'CHI', 'DH', 'TNR', 'EA', 'SGN', 'UNI']


def values(tau, haar):
    """tau: (n,) floats (0 for the base). Returns dict name -> (n, npts) complex."""
    n = len(tau)
    t = (a.tb + tau)[:, None] + zi[None, :]
    ti = np.floor(t).astype(np.int64).reshape(-1); dl = (t - np.floor(t)).reshape(-1)
    hb = None
    if haar:
        base = rng.random((n, len(pr)))
        hb = np.repeat(base, a.npts, axis=0)
        ti = np.zeros(n * a.npts, dtype=np.int64); dl = np.tile(zi, n)       # flow offset of the disc only
    sg = np.tile(a.sigma0 + zr, n)
    L0, e3 = T.euler_logs(ti, dl, sg, FL, pr, hi, lo, [a.P], haar_base=hb)
    Lp, _ = T.euler_logs(ti, dl, sg + AE, FL[:1], pr, hi, lo, [a.P], haar_base=hb)
    Lm, _ = T.euler_logs(ti, dl, sg - AE, FL[:1], pr, hi, lo, [a.P], haar_base=hb)
    E = np.exp(L0[:, :, 0])
    aq = T.TNR_Q ** (sg - 0.5)
    m = aq * np.conj(e3) + T.TNR_C + e3 / aq
    out = {'ZETA': E[:, 0], 'CHI': E[:, 1], 'DH': T.DH_C1 * E[:, 1] + T.DH_C2 * E[:, 2], 'TNR': E[:, 0] * m,
           'EA': np.exp(Lp[:, 0, 0] + Lm[:, 0, 0]), 'SGN': E[:, 3], 'UNI': E[:, 4]}
    return {k: v.reshape(n, a.npts) for k, v in out.items()}


base = values(np.zeros(1), False)
res = {'meta': dict(vars(a)), 'rows': {}}
B = 4000
D = {('orbit', k): [] for k in NAMES}; D.update({('haar', k): [] for k in NAMES})
for mode in ('orbit', 'haar'):
    for i in range(0, a.N, B):
        n = min(B, a.N - i)
        tau = np.exp(rng.uniform(math.log(a.Tlo), math.log(a.Thi), n))
        v = values(tau, mode == 'haar')
        for k in NAMES:
            D[(mode, k)].append(np.abs(v[k] - base[k]).max(axis=1) / np.abs(base[k]).max())
    print(mode, 'done', f'{time.time()-t00:.0f}s', flush=True)
qs = [1e-4, 3e-4, 1e-3, 3e-3, 1e-2, 3e-2, 0.1, 0.5]
for (mode, k), v in D.items():
    d = np.sort(np.concatenate(v))
    qv = [float(d[max(0, int(q * len(d)) - 1)]) for q in qs]
    # small-ball exponent between the 3e-4 and 3e-2 quantiles
    ex = (math.log(3e-2) - math.log(3e-4)) / (math.log(qv[5]) - math.log(qv[1]))
    res['rows'][f'{mode}|{k}'] = dict(n=len(d), min=float(d[0]), quantiles=dict(zip(map(str, qs), qv)), small_ball_exponent=ex,
                                      base_min_over_max=float(np.abs(base[k]).min() / np.abs(base[k]).max()))
    print(f'{mode:5s} {k:5s} min {d[0]:.4f} q1e-3 {qv[2]:.4f} q1e-2 {qv[4]:.4f} median {qv[7]:.3f} exponent {ex:.2f}', flush=True)
json.dump(res, open(a.out, 'w'), indent=1)
print('done', time.time() - t00)
