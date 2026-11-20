"""c3: Lemma B with shifted multiplier zeta_S(s + sigma0 - 1) (poles of Phi on Re s = sigma0 and 1 - sigma0).
 delta = sigma0 - 1/2.  Phi(z) = zeta_S(delta+z) zeta_S(delta-z) W(z) W#(-z).
 zero side  = sum_gamma |zeta_S(delta+i gamma)|^2 |W(i gamma)|^2      (zeros of zeta below 1.8e4, on the line)
 arch       = (1/2pi) int Omega |zeta_S(delta+i tau)|^2 |W(i tau)|^2
 residues   = 2 Re sum_p sum_k (1/log p) zeta_S(2 delta+it) zeta_{S-p}(-it) zeta'/zeta(sigma0+it) W(delta+it) conj W(-delta+it), t = 2 pi k/log p
 Control E_a: L = zeta(s+a) zeta(s-a), zeros z = +-a + i gamma, same multiplier, own log-derivative, own arch factor.
 MEASURED: float64 + mpmath for zeta'/zeta."""
import numpy as np, math, json, sys, os, mpmath as mp
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'c2-euler-at-zeros'))
from lib import zeta_zeros, zS
from scipy.special import digamma
mp.mp.dps = 20
g = zeta_zeros()
def Wfun(z, T, Tw, m=3):
    u = np.asarray(z, dtype=np.complex128) - 1j * T
    out = np.zeros(u.shape, np.complex128)
    for j in range(-m, m + 1):
        c = math.comb(2 * m, m - abs(j)) * (-1) ** j / 4.0 ** m
        a = u - 2j * math.pi * j / Tw
        a = np.where(np.abs(a) < 1e-12, 1e-12, a)
        out += c * (-np.expm1(-a * Tw)) / a
    return out
def G2(x, tau):
    """2 Re G(x + i tau), G(z) = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2), s = 1/2 + z."""
    s = 0.5 + x + 1j * np.asarray(tau)
    return np.real(2 / s + 2 / (s - 1) - math.log(math.pi) + digamma(s / 2))
def ld(sig, t):
    return complex(mp.zeta(mp.mpc(sig, t), derivative=1) / mp.zeta(mp.mpc(sig, t)))
def run(S, Tw, T, sigma0, a=0.0, m=3):
    S = np.array(S); d = sigma0 - 0.5; om = 2 * math.pi * m / Tw; X = 25 * om
    assert T - X > 20 and T + X < g[-1], (T, X)
    h = min(0.002, 0.05 / Tw); tau = np.arange(T - X, T + X, h)
    print('S', S.tolist(), 'Tw', Tw, 'sigma0', sigma0, 'a', a, 'T', T, 'grid', tau.size, '(%.0f MB)' % (tau.size * 16 * 4 / 1e6), flush=True)
    f = np.abs(zS(d + 1j * tau, S)) ** 2 * np.abs(Wfun(1j * tau, T, Tw, m)) ** 2
    den = h * np.sum(f) / (2 * math.pi)
    Om = G2(0.0, tau) if a == 0 else G2(a, tau) + G2(-a, tau)
    arch = h * np.sum(f * Om) / (2 * math.pi)
    gg = g[(g > T - X) & (g < T + X)]
    if a == 0:
        zero = float(np.sum(np.abs(zS(d + 1j * gg, S)) ** 2 * np.abs(Wfun(1j * gg, T, Tw, m)) ** 2)); nneg = 0
    else:
        ph = zS(d + a + 1j * gg, S) * zS(d - a - 1j * gg, S) * Wfun(a + 1j * gg, T, Tw, m) * np.conj(Wfun(-a + 1j * gg, T, Tw, m))
        zero = 2 * float(np.sum(ph.real)); nneg = int(np.sum(ph.real < 0))
    res = 0.0; absres = 0.0; npts = 0; M = 0.0
    for p in S:
        lp = math.log(p); ks = np.arange(int((T - X) * lp / (2 * math.pi)) + 1, int((T + X) * lp / (2 * math.pi)) + 1)
        t = 2 * math.pi * ks / lp
        ww = Wfun(d + 1j * t, T, Tw, m) * np.conj(Wfun(-d + 1j * t, T, Tw, m))
        keep = np.abs(ww) > 1e-17 * np.max(np.abs(ww)); t = t[keep]; ww = ww[keep]; npts += len(t)
        if a == 0: L = np.array([ld(sigma0, x) for x in t])
        else: L = np.array([ld(sigma0 + a, x) + ld(sigma0 - a, x) for x in t])
        big = np.abs(ww) > 1e-3 * np.max(np.abs(ww)); M = max(M, float(np.max(np.abs(L[big]))))
        rest = S[S != p]
        zr = zS(-1j * t, rest) if len(rest) else np.ones(len(t), complex)
        term = zS(2 * d + 1j * t, S) * zr * L * ww / lp
        res += 2 * float(np.sum(term.real)); absres += 2 * float(np.sum(np.abs(term)))
    r = dict(S=S.tolist(), Tw=Tw, T=T, sigma0=sigma0, a=a, den=den, zero_side=zero, arch=arch, residues=res, abs_residues=absres,
             diff=zero - arch - res, rel=(zero - arch - res) / abs(arch), R=zero / den, Obar=arch / den, E=res / den, absE=absres / den, M=M, npts=npts, pair_terms_negative=nneg)
    if len(S) == 1:
        p = float(S[0]); r['B1_bound'] = 2 / (1 - p ** (-2 * d)) * (1 + p ** -d) ** 2 * math.exp(d * Tw) * M
    print('   zero %.10g arch %.10g res %.10g | rel diff %.2e | R %.4f Obar %.4f E %.4f sum|res|/den %.4f M %.3f %s' % (zero, arch, res, r['rel'], r['R'], r['Obar'], r['E'], r['absE'], M, ('B1 bound %.3f' % r['B1_bound']) if 'B1_bound' in r else ''), flush=True)
    return r
if __name__ == "__main__":
    out = []
    cases = []
    for s0 in [0.88, 0.9, 0.95, 1.0, 1.25, 2.0]: cases.append(([2], 0.65, 3000.0, s0, 0.0))
    for s0 in [0.9, 1.0, 1.25]: cases.append(([3], 1.05, 9000.0, s0, 0.0))
    for s0 in [0.9, 1.0, 1.25]: cases.append(([2, 3], 1.7, 3000.0, s0, 0.0))
    for s0 in [0.9, 1.0]: cases.append(([2, 3, 5], 3.3, 6000.0, s0, 0.0))
    for s0 in [0.9, 1.0]: cases.append(([7], 2.5, 5000.0, s0, 0.0))     # log 7 = 1.946 < Tw < log 14 = 2.639: threshold stays log(2 N_S)
    cases.append(([2], 1.2, 3000.0, 0.9, 0.0))                           # log 2 < Tw < log 4
    # control E_a (off-line zeros at 1/2 +- a), same multiplier class
    for (a, s0) in [(0.2, 1.0), (0.2, 1.25), (0.3, 1.0), (0.45, 1.0), (0.45, 1.25)]: cases.append(([2], 0.65, 3000.0, s0, a))
    for (a, s0) in [(0.2, 1.0)]: cases.append(([2, 3], 1.7, 3000.0, s0, a))
    for c in cases: out.append(run(*c))
    json.dump(out, open('t1.json', 'w'), indent=1)
