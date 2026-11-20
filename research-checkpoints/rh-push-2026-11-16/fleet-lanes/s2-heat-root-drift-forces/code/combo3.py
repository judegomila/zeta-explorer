"""Combination 3: Weil form of a control at support a (f in L^2[-a,a], ordinate variable; paper's z-type T = a/2, T_RES = a),
   prime side with the control's own coefficients, Fourier basis e_k(x) = exp(i pi k x / a), |k| <= K.
     Q_kl = (-1)^(k-l) (2a / (pi (k-l))) (sigma(w_l) - sigma(w_k))   (k != l),   Q_kk = tau(w_k),   w_k = pi k / a
     sigma(w) = int_{0<v<=2a} sin(w v) dmu(v),   tau(w) = 2a mu({0}) + 2 int_{0<v<=2a} (2a - v) cos(w v) dmu(v)
   mu = Weil distribution of the control (ctl.py).  lambda = eig(Q) / (2a) (Rayleigh quotient against ||f||^2).
   Finite K gives an upper bound for the infimum: a negative value is a failure of positivity; a positive value is not a proof."""
import sys, json, math, os, time, numpy as np
from scipy.special import sici, exp1
import ctl
EULER = 0.5772156649015329

def gl(n, L):
    x, w = np.polynomial.legendre.leggauss(n); return (x + 1) * L / 2, w * L / 2

def sigma_tau(code, a, K, vc=None, xp=np):
    sp = ctl.spec(code); L = 2 * a; w = np.pi * np.arange(K + 1) / a
    sig = np.zeros(K + 1); tau = np.full(K + 1, sp['const'] * L)
    # poles: density 2cosh(c v)
    for c in sp['poles']:
        for lam0 in (c, -c):
            lam = lam0 + 1j * w
            small = np.abs(lam) < 1e-9; lam_s = np.where(small, 1.0, lam)
            I = np.where(small, L, (np.exp(lam_s * L) - 1) / lam_s)
            J = np.where(small, L * L / 2, (np.exp(lam_s * L) - 1 - lam_s * L) / lam_s ** 2)
            sig += I.imag; tau += 2 * J.real
    # archimedean kernels k_e(v) = e^{-e v}/(1-e^{-2v}) = 1/(2v) + regular
    nq = 6 * K + 400; v, wq = gl(nq, L)
    Si, Ci = sici(np.maximum(w * L, 1e-300)); Si[0] = 0.0
    Cin = np.where(w > 0, EULER + np.log(np.maximum(w * L, 1e-300)) - Ci, 0.0)
    Ein = EULER + math.log(2 * L) + exp1(2 * L)
    for e in sp['gam']:
        ke = np.exp(-e * v) / (-np.expm1(-2 * v))
        reg = ke - 1 / (2 * v)
        r = 2 * (L - v) * ke - L / v
        # chunk over frequencies to bound memory: nq x chunk doubles
        s_arch = np.zeros(K + 1); t_arch = np.zeros(K + 1); ch = max(1, int(2e7 // nq))
        for i in range(0, K + 1, ch):
            ph = np.outer(w[i:i + ch], v)
            s_arch[i:i + ch] = np.sin(ph) @ (wq * reg); t_arch[i:i + ch] = np.cos(ph) @ (wq * r)
        sig += -(s_arch + Si / 2)
        tau += L * (Cin - Ein) - t_arch + L * exp1(2 * L)
    # primes
    if vc is None: vc = ctl.coeffs(code, math.exp(L) * (1 + 1e-12))
    vv, cc = vc; m = vv <= L * (1 + 1e-15); vv = vv[m]; cc = cc[m]
    S1 = ctl.expsum_uniform(vv, cc, a, K); S2 = ctl.expsum_uniform(vv, cc * (L - vv), a, K)
    sig += -S1.imag; tau += -2 * S2.real
    return w, sig, tau, len(vv)

def build_Q(a, K, sig, tau):
    k = np.arange(-K, K + 1); s = np.sign(k) * sig[np.abs(k)]; t = tau[np.abs(k)]
    print('Q: dim %d planned %.2f GB' % (len(k), 8 * len(k) ** 2 * 3 / 1e9), flush=True)
    d = k[:, None] - k[None, :]
    with np.errstate(divide='ignore', invalid='ignore'):
        Q = np.where(d != 0, (2 * a / np.pi) * (s[None, :] - s[:, None]) / np.where(d == 0, 1, d), 0.0)
    Q *= np.where(d % 2 == 0, 1.0, -1.0)
    Q[np.diag_indices(len(k))] = t
    return Q

def analyse(code, a, wmax, vc=None, kcap=6000, want_vec=False):
    K = min(kcap, int(math.ceil(wmax * a / np.pi)))
    t0 = time.time(); w, sig, tau, nterms = sigma_tau(code, a, K, vc)
    Q = build_Q(a, K, sig, tau); asym = float(np.abs(Q - Q.T).max())
    ev, V = np.linalg.eigh(Q); lam = ev / (2 * a)
    x = V[:, 0]; k = np.arange(-K, K + 1); pk = np.abs(x) ** 2
    wpeak = float(np.abs(k[np.argmax(pk)]) * np.pi / a); wmean = float(np.sum(pk * np.abs(k)) * np.pi / a)
    r = dict(code=code, a=a, T_paper=a / 2, K=K, wmax=float(K * np.pi / a), nterms=int(nterms), lam_min=float(lam[0]), lam_2=float(lam[1]),
             n_neg=int(np.sum(lam < -1e-9 * max(1.0, abs(lam[-1])))), lam_max=float(lam[-1]), vec_peak_freq=wpeak, vec_mean_freq=wmean, asym=asym, sec=time.time() - t0)
    print(json.dumps(r), flush=True)
    return (r, x, Q) if want_vec else r

if __name__ == '__main__':
    out = sys.argv[1]; wmax = float(sys.argv[2]); amax = float(sys.argv[3]); codes = sys.argv[4].split(',')
    A = [x for x in [0.25, 0.4, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.2] if x <= amax]
    if len(sys.argv) > 5: A = [float(x) for x in sys.argv[5].split(',')]
    res = []
    for code in codes:
        vc = ctl.coeffs(code, math.exp(2 * amax) * (1 + 1e-12))
        for a in A:
            res.append(analyse(code, a, wmax, vc))
            json.dump(res, open(out, 'w'), indent=0)
    print('DONE')
