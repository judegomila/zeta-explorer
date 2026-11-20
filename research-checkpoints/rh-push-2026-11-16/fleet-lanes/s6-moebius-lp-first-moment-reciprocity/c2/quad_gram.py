"""Gram entries by quadrature for objects without a finite formula:
I_F(a,b) = sqrt(ab) (1/2pi) int W_F(t) (a/b)^{it} dt,  W_F(t) = |F(1/2+it)|^2/(1/4+t^2), cos^2 taper on [T/2, T].
Objects: zeta (check against Vasyunin), E_a = zeta(s+a) zeta(s-a) (a = 0.02, 0.25), U = zeta(s + i alpha) (alpha = 1).
First moment F(b) = sum_{a=2,(a,b)=1}^{b-1} I(a,b), kappa(b) = F/(phi b), second moment Q(b) = sum I^2/a^2, Cauchy-Schwarz loss Q S/F^2."""
import numpy as np, math, json, sys, subprocess
T = float(sys.argv[1]); h = float(sys.argv[2]); BMAX = int(sys.argv[3])
BERN = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6, -3617 / 510, 43867 / 798, -174611 / 330]
def zeta_line(sig, t):
    """zeta(sig + i t), Euler-Maclaurin, vectorised in blocks of equal N"""
    out = np.empty(len(t), dtype=np.complex128)
    Ns = (np.abs(t) / 3 + 30).astype(np.int64); Ns = (Ns // 16 + 1) * 16
    for N in np.unique(Ns):
        m = Ns == N; s = sig + 1j * t[m]
        n = np.arange(1, N, dtype=np.float64); ln = np.log(n)
        acc = np.zeros(m.sum(), dtype=np.complex128)
        for i0 in range(0, len(n), 256):
            acc += np.exp(-s[:, None] * ln[None, i0:i0 + 256]).sum(1)
        lN = math.log(N); Ns_ = np.exp(-s * lN)
        acc += Ns_ * N / (s - 1) + Ns_ / 2
        term = s * Ns_ / N; fact = 2.0
        for j, B in enumerate(BERN, start=1):
            acc += B / fact * term
            term = term * (s + 2 * j - 1) * (s + 2 * j) / (N * N); fact *= (2 * j + 1) * (2 * j + 2)
        out[m] = acc
    return out
print(f"# planned memory: grid {int(2*T/h)} points, blocks 256 terms: under 1 GB", flush=True)
t = np.arange(-T, T + h / 2, h)
taper = np.where(np.abs(t) <= T / 2, 1.0, np.cos(math.pi * (np.abs(t) - T / 2) / T) ** 2)
z0 = zeta_line(0.5, t)
objs = {'zeta': np.abs(z0) ** 2}
for a in (0.02, 0.25):
    zp = zeta_line(0.5 + a, t); zm = zeta_line(0.5 - a, t); objs[f'Ea{a}'] = np.abs(zp * zm) ** 2
zu = zeta_line(0.5, t + 1.0); objs['unimod1'] = np.abs(zu) ** 2
import mpmath as mp
print('# zeta check', abs(z0[len(t) // 2 + 1234] - complex(mp.zeta(0.5 + 1j * t[len(t) // 2 + 1234]))), abs(zeta_line(0.52, np.array([3000.0]))[0] - complex(mp.zeta(0.52 + 3000j))), flush=True)
phi = lambda b: sum(1 for a in range(1, b + 1) if math.gcd(a, b) == 1)
res = {}
for name, F2 in objs.items():
    W = F2 / (0.25 + t * t) * taper
    kap = float((W * 3 / (4 * math.pi) / (2.25 + t * t)).sum() * h)       # kappa_F = (3/4pi) int W/(9/4+t^2)
    rows = []
    for b in range(3, BMAX + 1):
        Fs = 0.0; Q = 0.0; S = 0.0; n = 0
        for a in range(2, b):
            if math.gcd(a, b) != 1: continue
            L = math.log(a / b)
            I = math.sqrt(a * b) * (W * np.exp(1j * t * L)).sum() * h / (2 * math.pi)
            Fs += I.real; Q += abs(I) ** 2 / a ** 2; S += a * a; n += 1
            if name == 'zeta' and (a, b) in ((2, 5), (3, 7), (7, 11), (5, 12)): print('#   I(%d,%d) = %.8f' % (a, b, I.real), flush=True)
        if name == 'zeta' and b in (5, 7, 11, 12): print('# zeta pair check I(2,5),I(3,7),I(7,11),I(5,12) target 3.16405234, 4.63587159, 9.33400853, 7.77474706; b =', b, 'last I(b-?)', flush=True)
        rows.append(dict(b=b, F=Fs, kappa_b=Fs / (phi(b) * b), Q=Q, loss=Q * S / Fs ** 2 if Fs else None))
    res[name] = dict(kappa_F=kap, rows=rows)
    print(name, 'kappa_F', round(kap, 6), ' kappa(b) at b=', [(r['b'], round(r['kappa_b'], 5)) for r in rows if r['b'] in (5, 11, 23, 30, 37, 59, 60, BMAX)], ' min kappa(b)', round(min(r['kappa_b'] for r in rows), 5), ' loss range, top half of b', [round(x, 3) for x in (min(r['loss'] for r in rows if r['b'] >= BMAX // 2), max(r['loss'] for r in rows if r['b'] >= BMAX // 2))], flush=True)
json.dump(res, open('../out/quad_gram.json', 'w'))
