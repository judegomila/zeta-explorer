#!/usr/bin/env python3
"""Referee rerun: second implementation (mpmath, pure-python set generation, no import of the lane's modules)."""
import mpmath as mp, numpy as np, math, json
mp.mp.dps = 34
M64 = (1 << 64) - 1
def smix(k, seed):
    z = (k + 0x9E3779B97F4A7C15 * (seed + 1)) & M64
    z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & M64
    z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & M64
    z ^= z >> 31
    return (z >> 11) / 9007199254740992.0
def is_prime(n):
    if n < 2: return False
    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        if n % p == 0: return n == p
    d = n - 1; s = 0
    while d % 2 == 0: d //= 2; s += 1
    for a in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        x = pow(a, d, n)
        if x in (1, n - 1): continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1: break
        else: return False
    return True
def nearest_prime(x):
    n = int(mp.floor(x)); a = n
    while not is_prime(a): a -= 1
    b = n + 1
    while not is_prime(b): b += 1
    return a if (x - a) <= (b - x) else b
def y_direct(lams, thetas, t, js):
    out = []
    for j in js:
        d = mp.mpf(2) ** (-j); z = mp.mpc(d, t); L = 32.0 / float(d); acc = mp.mpf(0)
        for lf, la, th in zip(*lams, thetas):
            if lf > L: break
            acc -= mp.log(abs(1 - mp.exp(mp.mpc(0, th) - la * z)))
        out.append(acc)
    return out
res = {}
# cell A: CYC, closed form log|1 - 3^(-z)| against the census product (three heights: telescoped pole, pole-class, generic)
z = np.load('out1/CYC.npz'); t, y, js, cls = z['t'], z['y'], z['js'], z['cls']
A = []
for c in (3, 0, 1):
    i = int(np.nonzero(cls == c)[0][2]); tt = mp.mpf(float(t[i]))
    cf = [mp.log(abs(1 - mp.exp(-mp.mpc(mp.mpf(2) ** (-int(j)), tt) * mp.log(3)))) for j in js]
    A.append(dict(cls=c, t=float(t[i]), max_abs_diff=float(max(abs(a - mp.mpf(float(b))) for a, b in zip(cf, y[i]))), y_last=float(cf[-1])))
res['A_CYC_closed_form'] = A; print(A, flush=True)
# cell B: D1_rand1, first generic height, j = 4..10
z = np.load('out1/D1_rand1.npz'); t, y, js, cls = z['t'], z['y'], z['js'], z['cls']
i = int(np.nonzero(cls == 1)[0][0]); tt = mp.mpf(float(t[i]))
K = 32 * 1024
head = []
for k in range(1, 31):
    p = nearest_prime(mp.exp(k)); head.append((k, p))
seen = set(); lf = []; la = []; th = []
for k, p in head:
    if p in seen: continue
    seen.add(p); lf.append(math.log(p)); la.append(mp.log(p)); th.append(mp.mpf(2 * math.pi * smix(k, 1001)))
for k in range(31, K + 1):
    lf.append(float(k)); la.append(mp.mpf(k)); th.append(mp.mpf(2 * math.pi * smix(k, 1001)))
yy = y_direct((lf, la), th, tt, [int(j) for j in js[:7]])
res['B_D1_rand1'] = dict(t=float(t[i]), js=[int(js[0]), int(js[6])], max_abs_diff=float(max(abs(a - mp.mpf(float(b))) for a, b in zip(yy, y[i][:7]))), y_j10=float(yy[-1]))
print(res['B_D1_rand1'], flush=True)
# cell C: D2_+, first generic height, j = 0..4
z = np.load('out1/D2_+.npz'); t, y, js, cls = z['t'], z['y'], z['js'], z['cls']
i = int(np.nonzero(cls == 1)[0][0]); tt = mp.mpf(float(t[i]))
seen = set(); lf = []; la = []
for k in range(1, 901):
    p = nearest_prime(mp.exp(mp.sqrt(k)))
    if p in seen: continue
    seen.add(p); lf.append(math.log(p)); la.append(mp.log(p))
o = sorted(range(len(lf)), key=lambda a: lf[a]); lf = [lf[a] for a in o]; la = [la[a] for a in o]
for k in range(901, (32 * 16) ** 2 + 1):
    lf.append(math.sqrt(k)); la.append(mp.mpf(math.sqrt(k)))
yy = y_direct((lf, la), [mp.mpf(0)] * len(lf), tt, [int(j) for j in js[:5]])
res['C_D2_plus'] = dict(t=float(t[i]), js=[int(js[0]), int(js[4])], max_abs_diff=float(max(abs(a - mp.mpf(float(b))) for a, b in zip(yy, y[i][:5]))), y_j4=float(yy[-1]))
print(res['C_D2_plus'], flush=True)
# cell D: statistic 2 for CYC by Poisson summation: I(omega) e^(-i omega yc) = -2 pi T(y1) e^(i omega (y1 - yc)), y1 = 2 pi/log 3
def bspl(u):
    v = abs(2 * u)
    if v <= 1: return 2 * (mp.mpf(2) / 3 - v * v + v ** 3 / 2)
    if v <= 2: return 2 * (2 - v) ** 3 / 6
    return mp.mpf(0)
y1 = 2 * mp.pi / mp.log(3); amp = 2 * mp.pi * bspl((y1 - mp.mpf('5.5')) / mp.mpf('1.5'))
R = json.load(open('out2/CYC.json')); D = []
for om, re_, im_ in R['probe'][-1]:
    pred = -amp * mp.exp(mp.mpc(0, mp.mpf(om) * (y1 - mp.mpf('5.5'))))
    D.append(dict(omega=om, float=[re_, im_], poisson=[float(pred.real), float(pred.imag)], abs_diff=float(abs(pred - mp.mpc(re_, im_)))))
res['D_CYC_stat2'] = dict(probes=D, MoverV_pred=float(amp ** 2), MoverV_float=R['M'][-1] / R['V'][-1])
print(res['D_CYC_stat2'], flush=True)
json.dump(res, open('referee_out.json', 'w'), indent=1)
