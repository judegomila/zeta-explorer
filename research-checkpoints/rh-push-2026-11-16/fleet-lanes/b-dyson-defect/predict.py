"""Prime-sum prediction of the Dyson defect:  Q(L)+1 = sum_n c_n K(k_n) - int_0^{kc} K(k) k/(2 pi) dk,
c_n = (2 pi / L^2) Lambda(n)^2 / n, k_n = 2 pi log n / L, K(k) = 2 pi Psi(k) / k  (Psi from CUE Monte Carlo, psi_mc.py)."""
import numpy as np, math, json, sys
from scipy.interpolate import CubicSpline
V_INF = 0.17999
def kernel(psifile, usevar=False):
    d = json.load(open(psifile)); k = np.array(d['k']); psi = np.array(d['psi']); S = np.array(d['S']); r4 = np.array(d['r4'])
    m = k <= 2 * math.pi + 1e-9
    k = k[m]; psi = psi[m]; S = S[m]; r4 = r4[m]
    # ratio rho(k) = -pi Psi / (1 - cos k) is smooth with rho(0) = E[g^2] = 1 + V ; use it for k <= pi, Psi directly above
    Kv = 2 * math.pi * psi / k
    if usevar: Kv = k * psi / (2 * math.pi * (r4 - S * S))
    kk = np.concatenate([[0.0], k]); KK = np.concatenate([[0.0], Kv])
    cs = CubicSpline(kk, KK, bc_type=((1, -(1 + V_INF)), 'not-a-knot'))
    return cs, d
X = 10 ** 8
sieve = np.ones(X + 1, dtype=bool); sieve[:2] = False
for i in range(2, int(X ** 0.5) + 1):
    if sieve[i]: sieve[i * i::i] = False
pr = np.nonzero(sieve)[0].astype(np.float64); lp = np.log(pr)
def predict(L, K, kc=2 * math.pi):
    ymax = kc * L / (2 * math.pi)
    tot = 0.0
    for m in range(1, 200):
        y = m * lp
        msk = y < ymax
        if not msk.any(): break
        tot += np.sum(lp[msk] ** 2 * np.exp(-y[msk]) * K(2 * math.pi * y[msk] / L))
    a = math.log(X)
    ylo = min(a, ymax)
    # primes above X: smooth density cancels the ramp there; ramp integral only up to ylo
    ys = np.linspace(0, ylo, 400001); ramp = np.trapezoid(ys * K(2 * math.pi * ys / L), ys)
    return (2 * math.pi / L ** 2) * (tot - ramp)
if __name__ == '__main__':
    LAM = 1.5731510713
    files = sys.argv[1:]
    meas = [[6.99, -0.8485, 0.0154], [7.96, -0.8843, 0.0095], [9.00, -0.8981, 0.0056], [10.01, -0.9135, 0.0034], [10.74, -0.9329, 0.0033],
            [11.26, -0.9346, 0.0029], [11.67, -0.9400, 0.0029], [11.98, -0.9414, 0.0027]]
    try:
        for ln in open('qstat.jsonl'):
            s = json.loads(ln); meas.append([s['L'], s['Q'], s['Qerr']])
    except FileNotFoundError: pass
    meas.sort()
    Ks = [(f, kernel(f)[0]) for f in files] + [(files[-1] + ':var', kernel(files[-1], True)[0])]
    print('     L   meas Q+1    err  | ' + ' | '.join('%-22s' % f[-22:] for f, _ in Ks) + ' | kc=pi(last)  harmonic')
    Wh = lambda k: -(2 * math.pi - k) * (1 - np.cos(k)) / (math.pi * np.maximum(k, 1e-12))
    chi = [0.0] * len(Ks)
    for L, Q, e in meas + [[30.4, None, None], [36, None, None], [46.8, None, None], [100, None, None], [300, None, None], [1000, None, None]]:
        ps = [predict(L, K) for _, K in Ks]
        pp = predict(L, Ks[-2][1], math.pi); ph = predict(L, Wh)
        if Q is not None:
            for i, p in enumerate(ps): chi[i] += ((Q + 1 - p) / e) ** 2
        print('%6.2f  %s | ' % (L, ('%8.5f %7.5f' % (Q + 1, e)) if Q is not None else '       -       -') + ' | '.join('%8.5f c=%.3f L3=%5.1f' % (p, p * L * L / (12 * LAM), p * L ** 3) for p in ps) + ' | %8.5f  %8.5f' % (pp, ph))
    print('chi2 (n=%d):' % len(meas), ['%.1f' % c for c in chi])
