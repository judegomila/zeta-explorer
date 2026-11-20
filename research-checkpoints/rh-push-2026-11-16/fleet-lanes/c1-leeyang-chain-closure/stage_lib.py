"""Stage-level tests, float64 (MEASURED, not certified). Every stage is an exponential sum F(s) = sum_k A_k exp(-s w_k).
Zeros are located by Newton iteration from a grid in the box -1.5 < Re s < 2.5, 0 < t < T and compared with the count
(w_max - w_min) T / (2 pi). Largest allocation: chunk 2000 starts x 2048 terms complex128 = 66 MB (printed)."""
import numpy as np, itertools, json, sys
from scipy.optimize import least_squares, linprog
rng = np.random.default_rng(11)
T = 40.0
def zeros_box(A, om, T=T, smin=-1.5, smax=2.5, ds=0.1, dt=0.05, line=0.5, label=""):
    A = np.asarray(A, dtype=complex); om = np.asarray(om, dtype=float)
    S, Tt = np.meshgrid(np.arange(smin, smax + 1e-9, ds), np.arange(dt / 2, T, dt))
    z = (S + 1j * Tt).ravel(); found = []
    ch = 2000
    for i in range(0, len(z), ch):
        s = z[i:i + ch].copy()
        for it in range(40):
            E = np.exp(-np.outer(s, om)); F = E @ A; dF = -(E @ (A * om))
            step = F / np.where(np.abs(dF) > 1e-300, dF, 1e-300)
            step = np.where(np.abs(step) > 0.5, 0.5 * step / np.abs(step), step); s = s - step
        E = np.exp(-np.outer(s, om)); F = E @ A; dF = -(E @ (A * om))
        scale = np.abs(E) @ np.abs(A)
        good = (np.abs(F) < 1e-9 * scale) & (s.imag > 0) & (s.imag < T) & (s.real > smin) & (s.real < smax)
        found.extend(s[good].tolist())
    found = np.array(sorted(found, key=lambda c: (c.imag, c.real))); uniq = []
    for c in found:
        if not uniq or abs(c - uniq[-1]) > 1e-6:
            if all(abs(c - u) > 1e-6 for u in uniq[-6:]): uniq.append(c)
    uniq = np.array(uniq); expct = (om.max() - om.min()) * T / (2 * np.pi)
    dev = np.abs(uniq.real - line)
    res = dict(label=label, terms=len(A), found=len(uniq), expected=round(float(expct), 1), on_line_1e6=int((dev < 1e-6).sum()), off_line=int((dev >= 1e-6).sum()),
               max_dev=float(dev.max()) if len(uniq) else None, re_min=float(uniq.real.min()), re_max=float(uniq.real.max()))
    print(json.dumps(res)); sys.stdout.flush(); return res, uniq
def spin_stage(primes, J, chi=None, extra=None):
    """symmetric form: sum over sigma in {+-1}^S of exp(sum_{p<q} J_pq s_p s_q) prod chi_p^{(1+s_p)/2} exp(-(s-1/2) sum s_p l_p/2).
    extra = (lq, rho(3 weights for tau=-1,0,1), Jq vector): one spin-1 site with frequency tau*lq."""
    l = np.log(np.array(primes, dtype=float)); n = len(primes)
    sig = np.array(list(itertools.product([-1, 1], repeat=n)), dtype=float)
    en = np.einsum('ki,ij,kj->k', sig, np.triu(J, 1), sig)
    A = np.exp(en).astype(complex); om = sig @ l / 2
    if chi is not None: A = A * np.prod(np.where(sig > 0, np.asarray(chi)[None, :], 1.0), axis=1)
    if extra is not None:
        lq, rho, Jq = extra; As = []; oms = []
        for tau, r in zip((-1, 0, 1), rho):
            As.append(A * r * np.exp(tau * (sig @ Jq))); oms.append(om + tau * lq)
        A = np.concatenate(As); om = np.concatenate(oms)
    return A * np.exp(om / 2), om   # F(s) = sum A exp(-(s-1/2) om) = sum [A e^{om/2}] e^{-s om}
