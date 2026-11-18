"""Task 3a: Lemma B for the Davenport-Heilbronn function f (conductor 5, odd, xi_f(s) = (5/pi)^(s/2) Gamma((s+1)/2) f(s) = xi_f(1-s)).
  sum over nontrivial zeros of Phi = (1/2pi) int Omega_f |zeta_S W|^2 + 2 Re sum_{p in S} sum_k (1/log p) zeta_S(1+it) zeta_{S-p}(-it) (f'/f)(1+it) W(1/2+it) conj W(-1/2+it)
     + 2 (-1)^(|S|+1) Re sum Lambda_f(n) (N m/(m' n))^1/2 C_w(-log(N m m' n))   [n >= 2 all integers; Lambda_f from -f'/f]
  Omega_f(tau) = log(5/pi) + Re psi(3/4 + i tau/2).  No pole term.  Contour Re z = c to the right of all zeros of f.
Zero side: 848 on-line zeros and 28 off-line pairs below height 1000 (c2-euler-at-zeros/dh_zeros_1000.json, read as data)."""
import numpy as np, math, json, os, itertools
from lib3 import *
from flint import dirichlet_char
ctx.prec = 200
K = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
c2 = dirichlet_char(5, 2); c3 = dirichlet_char(5, 3); A = acb(0.5, -K / 2); B = acb(0.5, K / 2)
def f(s): return A * c2.l(s) + B * c3.l(s)
def flogder(t):
    s = acb(1, float(t)); h = acb(2) ** (-60)
    v = (f(s + h) - f(s - h)) / (2 * h) / f(s)
    return complex(float(v.real.mid()), float(v.imag.mid()))
def a_dh(n): return [0.0, 1.0, K, -K, -1.0][n % 5]
def lambda_f(N):
    lam = [0.0] * (N + 1)
    for n in range(2, N + 1):
        v = a_dh(n) * math.log(n)
        for d in range(2, n):
            if n % d == 0: v -= lam[d] * a_dh(n // d)
        lam[n] = v
    return lam
def smooth(S, X):
    v = [1]
    for p in S:
        new = []
        for x in v:
            y = x
            while y <= X: new.append(y); y *= p
        v = new
    return sorted(v)
d = json.load(open(os.path.join(HERE, '..', 'c2-euler-at-zeros', 'dh_zeros_1000.json')))
on = np.array(d['online']); off = np.array(d['offline'])
def OmegaF(tau): return math.log(5 / math.pi) + np.real(digamma(0.75 + 0.5j * np.asarray(tau)))
def run(S, Tw, T, m=3):
    N = int(np.prod(S)); om = 2 * math.pi * m / Tw; X = 25 * om
    assert T - X > 5 and T + X < 995, (T, X)
    hh = min(0.002, 0.05 / Tw); tau = np.arange(T - X, T + X, hh)
    fz = np.abs(zS(0.5 + 1j * tau, S)) ** 2 * np.abs(Wfun(1j * tau, T, Tw, m)) ** 2
    den = hh * np.sum(fz) / (2 * math.pi); arch = hh * np.sum(fz * OmegaF(tau)) / (2 * math.pi)
    g = on[(on > T - X) & (on < T + X)]
    z_on = float(np.sum(np.abs(zS(0.5 + 1j * g, S)) ** 2 * np.abs(Wfun(1j * g, T, Tw, m)) ** 2))
    z_off = 0.0; npair = 0
    for b, gm in off:
        if T - X < gm < T + X:
            z = np.array([b - 0.5 + 1j * gm])
            z_off += 2 * float((zS(0.5 + z, S) * zS(0.5 - z, S) * Wfun(z, T, Tw, m) * np.conj(Wfun(-np.conj(z), T, Tw, m)))[0].real); npair += 1
    res = 0.0; npts = 0; Mmax = 0.0
    for p in S:
        lp = math.log(p); ks = np.arange(int((T - X) * lp / (2 * math.pi)) + 1, int((T + X) * lp / (2 * math.pi)) + 1); t = 2 * math.pi * ks / lp
        ww = Wfun(0.5 + 1j * t, T, Tw, m) * np.conj(Wfun(-0.5 + 1j * t, T, Tw, m))
        keep = np.abs(ww) > 1e-18 * np.max(np.abs(ww)); t = t[keep]; ww = ww[keep]; npts += len(t)
        ld = np.array([flogder(x) for x in t]); Mmax = max(Mmax, float(np.max(np.abs(ld))))
        rest = [q for q in S if q != p]
        term = zS(1 + 1j * t, S) * zS(-1j * t, rest) * ld * ww / lp
        res += 2 * float(np.sum(term.real))
    third = 0.0; nterm = 0; eT = math.exp(Tw)
    if eT >= 2 * N:
        lam = lambda_f(int(eT / N) + 1); sm = smooth(S, eT / N)
        for mm in sm:
            for mp in sm:
                for n in range(2, int(eT / (N * mm * mp)) + 1):
                    if lam[n] != 0.0:
                        third += 2 * (-1) ** (len(S) + 1) * (lam[n] * math.sqrt(N * mm / (mp * n)) * Cw(np.array([-math.log(N * mm * mp * n)]), T, Tw, m)[0]).real; nterm += 1
    zero = z_on + z_off; tot = arch + res + third
    r = dict(S=list(S), Tw=Tw, logN=math.log(N), log2N=math.log(2 * N), T=T, zero_side=zero, zero_online=z_on, zero_offline_pairs=z_off, pairs_in_window=npair, arch=arch, residues=res,
             third=third, third_terms=nterm, diff=zero - tot, rel=(zero - tot) / zero, rel_without_third=(zero - arch - res) / zero, rel_without_offline=(z_on - tot) / zero,
             R=zero / den, Obar=arch / den, max_flogder_on_lattice=Mmax, npts=npts)
    print('S %s Tw %.2f T %.1f | zero %.10g (on-line %.10g, %d pairs %.6g) arch %.10g residues %.10g third %.6g (%d) | rel diff %.2e ; without third %.2e ; without off-line pairs %.2e | R %.3f Obar %.3f max|f\'/f| %.2f' % (
        list(S), Tw, T, zero, z_on, npair, z_off, arch, res, third, nterm, r['rel'], r['rel_without_third'], r['rel_without_offline'], r['R'], r['Obar'], Mmax), flush=True)
    return r
if __name__ == "__main__":
    lam = lambda_f(12); print('Lambda_f(2..12):', [round(x, 6) for x in lam[2:]])
    out = []
    for S, Tw, T in [((2, 3), 2.4, 500.0), ((7,), 2.5, 500.0), ((2, 3, 5), 3.3, 450.0), ((2, 3, 5), 3.3, 560.0), ((2,), 2.5, 500.0), ((3,), 3.2, 520.0), ((2, 3), 4.0, 400.0), ((5,), 1.55, 500.0)]:
        out.append(run(S, Tw, T)); json.dump(out, open(os.path.join(HERE, 'dh_form.json'), 'w'), indent=1)
