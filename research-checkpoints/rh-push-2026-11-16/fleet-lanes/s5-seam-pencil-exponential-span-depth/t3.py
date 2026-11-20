"""Combination 3.
(a) EV-OCT onsets x*(m), m = 6..40 (coalescent closed form; reproduces 11.31664319 at m = 6), and the m-uniform onset 27.035582.
(b) dyadic skeleton with the object's coefficients: rates n in {2^k, 5 2^(k-2)} (twin ratio 5/4), k = 2..m+1, amplitudes a_F(n):
    theta = a^T G a / |a|^T G |a| (G_ij = 1/(n_i+n_j)); PHASE-CERT fires (R < 1/2) for y > ln(1/theta), PHASE-AM for y > ln((1+theta)/(2 theta)), y = 2 x;
    exact tail ratio of the object's own combination at depth x (in units of the smallest rate).
(c) all integers n <= N: theta_F(N) = sum_s (a*conj a)(s)/s / sum_s (|a|*|a|)(s)/s  (FFT autoconvolution; cupy if present).
usage: t3.py out.json tables_dir|none Nmax"""
import sys, json, math, os, time, numpy as np
import pen
outp, tables, Nmax = sys.argv[1], sys.argv[2], int(float(sys.argv[3]))
res = {}
# (a)
res['evoct_onsets'] = {m: pen.bisect(lambda x: pen.evoct_cert(m, x), 2, 60) for m in range(6, 41)}
b = lambda n: (2.0 ** n - 1.3) / (2.0 ** n + 1.3)
phi_unif = math.exp(2 * sum(8 * math.log(b(n)) for n in range(1, 200)))
res['phi_unif'] = phi_unif
res['evoct_unif_onset'] = pen.bisect(lambda x: ((math.exp(-x) * (1 + 2 * x) + 2 * math.exp(-1.5 * x)) / math.sqrt(phi_unif)) ** 2, 16, 60)
# exact pencil onsets of the coalescent twin skeleton (Arb), m = 6, 12, 24, 40
def exact_onset(m):
    nu = [repr(2.0 ** k) for k in range(m - 1, -1, -1) for _ in (0, 1)]
    f = lambda x: math.exp(pen.lam_arb(nu, None, x, 256 + 8 * m)['logLam'])
    return pen.bisect(f, 0.01, 8, it=30)
res['exact_pencil_first_x_below_1_is_0'] = 'Lambda < 1 for every x > 0; value at x = 1, 3.56, 11.3166:'
res['exact_coalescent_twin_Lambda'] = {m: [math.exp(pen.lam_arb([repr(2.0 ** k) for k in range(m - 1, -1, -1) for _ in (0, 1)], None, x, 256 + 8 * m)['logLam']) for x in (1.0, 3.56, 11.31664319)] for m in (6, 12, 24, 40)}
# coefficients
kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
def mixs(p):
    z = (p + 0x9e3779b97f4a7c15) & (2 ** 64 - 1); z = ((z ^ (z >> 30)) * 0xbf58476d1ce4e5b9) & (2 ** 64 - 1); z = ((z ^ (z >> 27)) * 0x94d049bb133111eb) & (2 ** 64 - 1); return z ^ (z >> 31)
loc = {  # a(2), a(5) -> a(2^i 5^j) for completely multiplicative objects; DH and EA, TNR by formula
    'ZETA': lambda i, j: 1.0, 'LCHI4': lambda i, j: 0.0 if i else 1.0, 'LCHI5': lambda i, j: 0.0 if j else (-1.0) ** i, 'LIOU': lambda i, j: (-1.0) ** (i + j),
    'SGN(hash)': lambda i, j: (-1.0 if mixs(2) & 1 else 1.0) ** i * (-1.0 if mixs(5) & 1 else 1.0) ** j,
    'DH': lambda i, j: 0.0 if j else [0, 1.0, kap, -kap, -1.0][pow(2, i, 5)],
    'EA-1/4': lambda i, j: sum(2.0 ** ((2 * u - i) * 0.25) for u in range(i + 1)) * sum(5.0 ** ((2 * u - j) * 0.25) for u in range(j + 1)),
    'TNR-q3': lambda i, j: 1.0, 'TNR-q1000003': lambda i, j: 1.0,
    'WT': lambda i, j: complex(np.exp(-1j * 1.2393168126993495 * (i * math.log(2) + j * math.log(5)))),
    'UNI(hash)': lambda i, j: complex(np.exp(2j * math.pi * (((mixs(2) >> 20) & 4095) * i + ((mixs(5) >> 20) & 4095) * j) / 4096.0)),
}
sk = {}
for name, fa in loc.items():
    rows = []
    for m in (6, 12, 24, 40):
        ns = []; am = []
        for k in range(2, m + 2):
            ns += [2.0 ** k, 5 * 2.0 ** (k - 2)]; am += [fa(k, 0), fa(k - 2, 1)]
        ns = np.array(ns); a = np.array(am, dtype=complex); G = 1 / (ns[:, None] + ns[None, :])
        TT = (a.conj() @ G @ a).real; Tg = np.abs(a) @ G @ np.abs(a)
        if Tg == 0 or TT <= 0: rows.append(dict(m=m, theta=None, nonzero=int((a != 0).sum()))); continue
        th = TT / Tg; row = dict(m=m, theta=th, nonzero=int((a != 0).sum()), y_phase_cert=math.log(1 / th), y_phase_am=math.log((1 + th) / (2 * th)))
        row['x_phase_cert'] = row['y_phase_cert'] / 2; row['x_phase_am'] = row['y_phase_am'] / 2
        tail = {}
        for x in (0.5, 1.0, 3.56, 11.31664319, 27.04):
            d = x / 4.0; w = a * np.exp(-d * ns); tail[x] = float((w.conj() @ G @ w).real / TT)
        row['own_tail_ratio'] = tail; rows.append(row)
    sk[name] = rows
res['skeleton'] = sk
# (c)
try:
    import cupy as xp; xp.get_default_memory_pool().set_limit(size=24 * 1024 ** 3)
except Exception:
    xp = np
def theta_all(a):
    a = xp.asarray(a); n = len(a) - 1; L = 1
    while L < 2 * n + 2: L *= 2
    out = []
    for N in [10 ** k for k in range(2, 10) if 10 ** k <= n]:
        LL = 1
        while LL < 2 * N + 2: LL *= 2
        v = xp.zeros(LL, dtype=xp.complex128); v[1:N + 1] = a[1:N + 1]
        s = xp.arange(LL, dtype=xp.float64); s[0] = 1.0
        c1 = xp.fft.ifft(xp.fft.fft(v) * xp.fft.fft(xp.conj(v))); c1[0] = 0
        va = xp.abs(v) + 0j; c2 = xp.fft.ifft(xp.fft.fft(va) ** 2); c2[0] = 0
        T = float((c1.real / s).sum()); Tg = float((c2.real / s).sum())
        out.append(dict(N=N, T=T, Tg=Tg, theta=T / Tg if Tg > 0 else None, sum_abs2_over_2n=float((xp.abs(v[1:]) ** 2 / (2 * s[1:])).sum())))
        del v, c1, c2, va
    return out
allr = {}
print('planned memory: FFT length up to %d complex128 x 4 = %.2f GB' % (2 ** math.ceil(math.log2(2 * Nmax + 2)), 4 * 16 * 2 ** math.ceil(math.log2(2 * Nmax + 2)) / 1e9), flush=True)
n = np.arange(Nmax + 1)
gen = {'ZETA': np.ones(Nmax + 1), 'LCHI4': np.array([0, 1, 0, -1.0])[n % 4], 'LCHI5': np.array([0, 1, -1, -1, 1.0])[n % 5], 'DH': np.array([0, 1, kap, -kap, -1.0])[n % 5]}
for k, a in gen.items():
    a = a.copy(); a[0] = 0; allr[k] = theta_all(a); print(k, allr[k][-1], flush=True)
if tables != 'none':
    for code in ['SGN-LIOU', 'SGN-00', 'SGN-01', 'SGN-02', 'U-00', 'U-01', 'EA-1_4', 'EA-1_8', 'TNR', 'WT', 'THIN-0.9', 'DEL-0.9']:
        p = os.path.join(tables, 'coef_%s.npy' % code)
        if not os.path.exists(p): continue
        a = np.load(p, mmap_mode='r')[:Nmax + 1]; allr[code] = theta_all(np.array(a)); print(code, allr[code][-1], flush=True)
res['all_integers'] = allr
json.dump(res, open(outp, 'w'), indent=1)
print(json.dumps({k: res[k] for k in ('evoct_unif_onset', 'phi_unif')}), res['evoct_onsets'][6], res['evoct_onsets'][40])
