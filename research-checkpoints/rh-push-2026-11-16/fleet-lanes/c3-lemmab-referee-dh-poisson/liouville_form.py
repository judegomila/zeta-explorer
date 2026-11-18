"""Task 3b: the form of Lemma B for zeta(2s)/zeta(s) (Liouville).  The zero/pole divisor in the strip is {rho/2} - {rho}; it is not
symmetric under J, so there is no Krein sum.  Identity (T_w < log(2 N_S); terms at z = 0 and k = 0 of size |W(0)|^2, |W(1/2) W(-1/2)| omitted):
  sum_rho Phi(rho/2 - 1/2) - sum_rho Phi(rho - 1/2)
     = -(1/2pi) int Phi(i tau) [2 g(1+2 i tau) + Omega(tau)] d tau
       - 2 Re sum (1/log p) B_k zeta'/zeta(1+it_k)  +  2 sum (1/log p) [ B_k zeta'/zeta(2+2it_k) + conj( B_k zeta'/zeta(1+2it_k) ) ],
  g(s) = log pi - psi(s/2)/2 - psi((1-s)/2)/2,  B_k = zeta_S(1+it) zeta_{S-p}(-it) W(1/2+it) conj W(-1/2+it).
The second zero sum and the first residue sum are Lemma B; checked here is the zeta(2s) part:
  sum_rho Phi(rho/2 - 1/2) = -(1/pi) int Phi(i tau) g(1+2 i tau) d tau + 2 sum (1/log p) [ B_k zeta'/zeta(2+2it_k) + conj(B_k zeta'/zeta(1+2it_k)) ]."""
import numpy as np, math, json
from lib3 import *
g0 = zeta_zeros()
def gfun(s): return math.log(math.pi) - 0.5 * digamma(s / 2) - 0.5 * digamma((1 - s) / 2)
def run(S, Tw, T, m=3):
    om = 2 * math.pi * m / Tw; X = 25 * om
    assert 2 * (T + X) < g0[-1] and T - X > 10
    hh = min(0.002, 0.05 / Tw); tau = np.arange(T - X, T + X, hh)
    Phi = np.abs(zS(0.5 + 1j * tau, S)) ** 2 * np.abs(Wfun(1j * tau, T, Tw, m)) ** 2
    arch2 = -hh * np.sum(Phi * gfun(1 + 2j * tau)) / math.pi
    lemB_arch = hh * np.sum(Phi * Omega(tau)) / (2 * math.pi)
    gg = g0[(g0 > 2 * (T - X)) & (g0 < 2 * (T + X))]
    z = -0.25 + 0.5j * gg
    PhiZ = zS(0.5 + z, S) * zS(0.5 - z, S) * Wfun(z, T, Tw, m) * np.conj(Wfun(-np.conj(z), T, Tw, m))
    zero2 = np.sum(PhiZ)
    herm = float(np.sum(np.abs(zS(0.5 + z, S)) ** 2 * np.abs(Wfun(z, T, Tw, m)) ** 2))
    res2 = 0j; resB = 0.0
    for p in S:
        lp = math.log(p); ks = np.arange(int((T - X) * lp / (2 * math.pi)) + 1, int((T + X) * lp / (2 * math.pi)) + 1); t = 2 * math.pi * ks / lp
        ww = Wfun(0.5 + 1j * t, T, Tw, m) * np.conj(Wfun(-0.5 + 1j * t, T, Tw, m))
        keep = np.abs(ww) > 1e-18 * np.max(np.abs(ww)); t = t[keep]; ww = ww[keep]
        rest = [q for q in S if q != p]
        Bk = zS(1 + 1j * t, S) * zS(-1j * t, rest) * ww / lp
        l22 = np.array([zlogder(2 * x, 2.0) for x in t]); l12 = np.array([zlogder(2 * x, 1.0) for x in t]); l11 = np.array([zlogder(x, 1.0) for x in t])
        res2 += 2 * np.sum(Bk * l22 + np.conj(Bk * l12)); resB += 2 * float(np.sum((Bk * l11).real))
    g1 = g0[(g0 > T - X) & (g0 < T + X)]
    zero1 = float(np.sum(np.abs(zS(0.5 + 1j * g1, S)) ** 2 * np.abs(Wfun(1j * g1, T, Tw, m)) ** 2))
    rhs = arch2 + res2
    r = dict(S=list(S), Tw=Tw, T=T, zero_sum_2s=[zero2.real, zero2.imag], arch_2s=[arch2.real, arch2.imag], residues_2s=[res2.real, res2.imag],
             absdiff=abs(zero2 - rhs), rel=abs(zero2 - rhs) / abs(zero2), hermitian_sum_at_rho_over_2=herm,
             lemmaB_zero=zero1, lemmaB_arch=lemB_arch, lemmaB_res=resB, lemmaB_rel=(zero1 - lemB_arch - resB) / zero1,
             liouville_divisor_sum=[(zero2 - zero1).real, zero2.imag])
    print('S %s Tw %.2f T %.0f | sum Phi(rho/2-1/2) = %.10g%+.10gi ; arch %.10g%+.10gi ; residues %.10g%+.10gi ; |diff| %.2e rel %.2e | Lemma B (zeta) rel %.1e | Hermitian sum at rho/2: %.6g' % (
        list(S), Tw, T, zero2.real, zero2.imag, arch2.real, arch2.imag, res2.real, res2.imag, r['absdiff'], r['rel'], r['lemmaB_rel'], herm), flush=True)
    return r
if __name__ == "__main__":
    out = []
    for S, Tw, T in [((2,), 0.65, 3000.0), ((3,), 1.05, 2000.0), ((2, 3), 1.7, 3000.0), ((2, 3, 5), 3.3, 4000.0), ((7,), 2.5, 5000.0)]:
        out.append(run(S, Tw, T)); json.dump(out, open(os.path.join(HERE, 'liouville_form.json'), 'w'), indent=1)
