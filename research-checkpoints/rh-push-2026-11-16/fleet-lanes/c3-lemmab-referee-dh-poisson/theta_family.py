"""Pivot check: shifted multiplier zeta_p(s - theta), 0 < theta < 1/2 (test g = sum_j p^{j(theta-1/2)} w(. - j log p)), T_w < log(2p):
  sum_gamma |zeta_p(1/2 - theta + i gamma)|^2 |W(i gamma)|^2
    = (1/2pi) int Omega |zeta_p(1/2 - theta + i tau) W(i tau)|^2 d tau + 2 Re[ zeta_p(1-theta) zeta_p(-theta) W(1/2) conj W(-1/2) ]
      + 2 Re sum_{k in Z} (1/log p) zeta_p(1 - 2 theta + it_k) (zeta'/zeta)(1 - theta + it_k) W(1/2 - theta + it_k) conj W(-1/2 + theta + it_k).
Lattice samples of zeta'/zeta on Re s = 1 - theta, inside the strip.  (Zero side uses the zeros of the list, all on the line.)"""
import numpy as np, math, json
from lib3 import *
g0 = zeta_zeros()
def run(p, th, Tw, T, m=3):
    L = math.log(p); om = 2 * math.pi * m / Tw; X = 25 * om
    hh = min(0.002, 0.05 / Tw); tau = np.arange(T - X, T + X, hh)
    f = np.abs(zS(0.5 - th + 1j * tau, [p])) ** 2 * np.abs(Wfun(1j * tau, T, Tw, m)) ** 2
    den = hh * np.sum(f) / (2 * math.pi); arch = hh * np.sum(f * Omega(tau)) / (2 * math.pi)
    g = g0[(g0 > T - X) & (g0 < T + X)]
    zero = float(np.sum(np.abs(zS(0.5 - th + 1j * g, [p])) ** 2 * np.abs(Wfun(1j * g, T, Tw, m)) ** 2))
    pole = 2 * float((zS(np.array([1 - th + 0j]), [p]) * zS(np.array([-th + 0j]), [p]) * Wfun(np.array([0.5 + 0j]), T, Tw, m) * np.conj(Wfun(np.array([-0.5 + 0j]), T, Tw, m)))[0].real)
    ks = np.arange(int((T - X) * L / (2 * math.pi)) + 1, int((T + X) * L / (2 * math.pi)) + 1); t = 2 * math.pi * ks / L
    ww = Wfun(0.5 - th + 1j * t, T, Tw, m) * np.conj(Wfun(-0.5 + th + 1j * t, T, Tw, m))
    ld = np.array([zlogder(x, 1 - th) for x in t])
    term = zS(1 - 2 * th + 1j * t, [p]) * ld * ww / L
    res = 2 * float(np.sum(term.real)); absres = 2 * float(np.sum(np.abs(term)))
    r = dict(p=p, theta=th, Tw=Tw, T=T, zero_side=zero, arch=arch, pole=pole, residues=res, rel=(zero - arch - pole - res) / zero, R=zero / den, Obar=arch / den, E=res / den,
             abs_res_over_den=absres / den, max_logder=float(np.max(np.abs(ld[np.abs(ww) > 1e-3 * np.max(np.abs(ww))]))))
    print('p %d theta %.2f Tw %.2f T %.0f | zero %.10g arch %.10g residues %.10g pole %.1e | rel diff %.2e | R %.3f Obar %.3f E %.3f sum|res|/Den %.2f max|zeta\'/zeta(1-theta+it_k)| %.2f' % (
        p, th, Tw, T, zero, arch, res, pole, r['rel'], r['R'], r['Obar'], r['E'], r['abs_res_over_den'], r['max_logder']), flush=True)
    return r
out = []
for p, Tw, T in [(2, 0.65, 3000.0), (3, 1.05, 9000.0), (7, 2.5, 5000.0)]:
    for th in (0.0, 0.1, 0.2, 0.3, 0.4, 0.45, 0.49):
        if th == 0.0: th = 1e-9
        out.append(run(p, th, Tw, T))
json.dump(out, open(os.path.join(HERE, 'theta_family.json'), 'w'), indent=1)
