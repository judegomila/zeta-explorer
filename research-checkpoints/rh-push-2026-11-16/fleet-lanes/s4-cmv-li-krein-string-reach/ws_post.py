"""Line statistics from a ws.py output (.npz): three spectra on the same window.
  D(tau) = sum_n w(gamma_n) exp(-i tau gamma_n)                 (zero list itself; exactly linear: explicit formula, lines at log n
                                                                 with amplitude proportional to |Lambda_F(n)|/sqrt(n))
  R(tau) = sum_n r_n w(gamma_n) exp(-i tau gamma_n)             (level residuals against V_WS; first order |Lambda|/(sqrt(n) log n),
                                                                 second order: lines at log(n1 n2) from products)
  G(tau) = h sum_i dV_i w(u_i) exp(-i tau u_i), u = V_WS(x)     (the correction; lines at log n + c (log n)^3)
  python ws_post.py file.npz kind [nmax]"""
import sys, json, math
import numpy as np
from ws import lam_coeffs
f = sys.argv[1]; kind = sys.argv[2]
d = np.load(f); dV = d['dV']; u = d['Vws']; h = float(d['h']); g = d['g']; r0 = d['r0']; N = len(g)
ua = g[max(5, N // 50)]; ub = g[-1] * 0.98
w = np.where((u > ua) & (u < ub), np.sin(math.pi * (u - ua) / (ub - ua)) ** 2, 0.0)
wg = np.where((g > ua) & (g < ub), np.sin(math.pi * (g - ua) / (ub - ua)) ** 2, 0.0)
width = 2 * math.pi / (ub - ua)
nmax = int(sys.argv[3]) if len(sys.argv) > 3 else max(12, min(60, int(0.2 / width))); ns = list(range(2, nmax + 1))
Lam = lam_coeffs(kind, nmax)
def is_pp(n):
    for p in range(2, n + 1):
        if n % p == 0:
            while n % p == 0: n //= p
            return n == 1
taus = np.arange(0.5, math.log(nmax) + 0.15, width / 4)
def spectrum(vals, pos, wt):
    out = np.empty(len(taus))
    for a0 in range(0, len(taus), 128):
        tt = taus[a0:a0 + 128]
        out[a0:a0 + 128] = np.abs(np.exp(-1j * np.outer(tt, pos)) @ (vals * wt))
    return out
def analyse(spec, shape, c=0.0):
    hw = 6
    rm = np.array([spec[max(0, i - hw):i + hw + 1].max() for i in range(len(spec))])
    bg = float(np.median(rm))
    amp = {}
    for n in ns:
        i = int(round((math.log(n) + c * math.log(n) ** 3 - taus[0]) / (taus[1] - taus[0])))
        amp[n] = float(rm[i]) / bg if 0 <= i < len(rm) else float('nan')
    A = np.array([amp[n] for n in ns]); Pd = np.array([shape(n) for n in ns]); ok = np.isfinite(A)
    sc = float(np.sum(A[ok] * Pd[ok]) / np.sum(Pd[ok] ** 2))
    supp = [n for n in ns if abs(Lam[n]) > 1e-9]; nosupp = [n for n in ns if abs(Lam[n]) <= 1e-9]
    npp = [n for n in ns if not is_pp(n)]
    return dict(background=bg, corr_with_Lambda_shape=float(np.corrcoef(A[ok], Pd[ok])[0, 1]),
                amp_over_bg={n: round(amp[n], 2) for n in ns}, pred_over_bg={n: round(sc * shape(n), 2) for n in ns},
                max_non_prime_power=max((amp[n], n) for n in npp), mean_non_prime_power=float(np.nanmean([amp[n] for n in npp])),
                mean_prime=float(np.nanmean([amp[n] for n in ns if is_pp(n) and all(n % q for q in range(2, n))])),
                max_outside_Lambda_support=(max((amp[n], n) for n in nosupp) if nosupp else None),
                lines_above_5bg=[n for n in ns if amp[n] > 5], lines_above_3bg=[n for n in ns if amp[n] > 3])
res = dict(file=f, kind=kind, N=N, window=[float(ua), float(ub)], line_width=width, nmax=nmax)
res['zero_list'] = analyse(spectrum(np.ones(N), g, wg), lambda n: abs(Lam[n]) / math.sqrt(n))
res['residual_list'] = analyse(spectrum(r0, g, wg), lambda n: abs(Lam[n]) / (math.sqrt(n) * math.log(n)))
specG = spectrum(dV * h, u, w)
top = sorted(ns, key=lambda n: -res['zero_list']['amp_over_bg'][n])[:2]
cs = []
for n in top:
    t0 = math.log(n); m = (taus > t0 - 0.02) & (taus < t0 + 0.25 * t0)
    cs.append((taus[m][np.argmax(specG[m])] - t0) / t0 ** 3)
c = float(np.mean(cs))
res['dV_spectrum'] = analyse(specG, lambda n: abs(Lam[n]) / math.sqrt(n * math.log(n)), c); res['dV_spectrum']['dispersion_c'] = c
json.dump(res, open(f.replace('.npz', '_lines.json'), 'w'), indent=1)
for k in ('zero_list', 'residual_list', 'dV_spectrum'):
    x = res[k]; print(k, 'corr', round(x['corr_with_Lambda_shape'], 3), 'mean prime', round(x['mean_prime'], 1), 'non-pp: max', (round(x['max_non_prime_power'][0], 1), x['max_non_prime_power'][1]), 'mean', round(x['mean_non_prime_power'], 2), '>5bg', x['lines_above_5bg'])
