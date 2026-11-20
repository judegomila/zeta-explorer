"""Combination 4: Wu-Sprung potential plus Gauss-Newton minimum-norm correction reproducing N ordinates; Fourier lines of dV.
  python ws.py zeros.json|.bin N q out.json [ppw=40]
Operator: -psi'' + V psi on (0, x_max), Dirichlet ends, second-order finite differences on a uniform grid (float64).
V_WS (half line) from x(V) = (2/pi)[sqrt(V-V0) ln(V0/(c e^2)) + sqrt(V) ln((sqrt V + sqrt(V-V0))/(sqrt V - sqrt(V-V0)))], c = 2 pi/q,
V0 = 3.10073 pi/q  (q = 1: Wu-Sprung; q = conductor for the comparison lists: smooth count (E/2pi) ln(qE/(2 pi e))).
Gauss-Newton: dE_n/dV_i = psi_n(x_i)^2 (discrete normalisation), minimum-norm update dV += S^T (S S^T)^+ r.
Statistic: G(tau) = h sum_i dV_i w(u_i) exp(-i tau u_i), u_i = V_WS(x_i) (first-order WKB: dV(u) x'(u) is the Abel transform
of the count fluctuation, so a term sin(tau E) in the count gives a line at tau, amplitude proportional to sqrt(tau))."""
import sys, json, math, time
import numpy as np
from scipy.linalg import eigh_tridiagonal

def x_of_V(V, q):
    c = 2 * math.pi / q; V0 = 3.10073 * math.pi / q
    V = np.asarray(V, dtype=float); r = np.sqrt(np.maximum(V - V0, 0.0)); s = np.sqrt(V)
    # half line with a wall at 0: x(V) = 2 int_{V0}^{V} N'(E) (V-E)^(-1/2) dE, N' = (1/2pi) ln(E/c)  (twice the full-line formula)
    return 2 * (r * math.log(V0 / (c * math.e ** 2)) + s * np.log((s + r) / np.maximum(s - r, 1e-300))) / math.pi

def lam_coeffs(kind, nmax):
    """Lambda_F(n) (coefficients of -F'/F) for n <= nmax"""
    if kind == 'DH':
        kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1); cf = [0, 1, kap, -kap, -1]
        a = [0] + [cf[n % 5] for n in range(1, nmax + 1)]
    elif kind == 'LCHI4': a = [0] + [(0, 1, 0, -1)[n % 4] for n in range(1, nmax + 1)]
    else: a = [0] + [1] * nmax
    L = [0.0] * (nmax + 1)
    for n in range(2, nmax + 1):
        s = a[n] * math.log(n)
        for d in range(2, n):
            if n % d == 0: s -= a[n // d] * L[d]
        L[n] = s
    return L

USE_GPU = False
try:
    import os
    if os.environ.get('WS_GPU') == '1':
        import cupy as cp
        cp.get_default_memory_pool().set_limit(size=10 * 1024 ** 3); USE_GPU = True
except Exception as ex:
    print('no gpu:', repr(ex)[:80])

if __name__ == '__main__':
    zf = sys.argv[1]; N = int(sys.argv[2]); q = float(sys.argv[3]); out = sys.argv[4]
    ppw = float(sys.argv[5]) if len(sys.argv) > 5 else 40.0
    kind = sys.argv[6] if len(sys.argv) > 6 else 'ZETA'
    rc = float(sys.argv[7]) if len(sys.argv) > 7 else 1e-10
    g = np.fromfile(zf) if zf.endswith('.bin') else np.array([float(x) for x in json.load(open(zf))])
    g = np.sort(g)[:N]; N = len(g)
    V0 = 3.10073 * math.pi / q
    Emax = g[-1]
    # grid
    xm = float(x_of_V(Emax * 1.02 + 20, q)) + 4.0
    h = 2 * math.pi / math.sqrt(Emax) / ppw
    M = int(xm / h)
    print('N', N, 'Emax', Emax, 'x_max', xm, 'h', h, 'M', M, 'planned memory GB: eigenvectors', N * M * 8 / 1e9, 'Gram', N * N * 8 / 1e9, flush=True)
    x = h * np.arange(1, M + 1)
    Vt = np.concatenate([V0 + np.linspace(0, 1, 20001)[1:] ** 2 * (Emax * 3 + 1000 - V0)]); Vt = np.concatenate([[V0], Vt])
    xt = x_of_V(Vt, q)
    Vws = np.interp(x, xt, Vt)
    assert x[-1] < xt[-1]
    off = -np.ones(M - 1) / h ** 2
    dV = np.zeros(M)
    hist = []
    t0 = time.time()
    NIT = 30
    for it in range(NIT):
        E, psi = eigh_tridiagonal(2.0 / h ** 2 + Vws + dV, off, select='i', select_range=(0, N - 1))
        r = g - E
        if it == 0: r0 = r.copy()
        hist.append(dict(it=it, max_abs_res=float(np.abs(r).max()), rms_res=float(np.sqrt(np.mean(r ** 2))), dV_l2=float(np.sqrt(h * np.sum(dV ** 2))), dV_max=float(np.abs(dV).max())))
        print(json.dumps(hist[-1]), round(time.time() - t0, 1), flush=True)
        if hist[-1]['max_abs_res'] < 1e-9 or it == NIT - 1: break
        np.square(psi, out=psi)                     # psi[i, n]^2 = dE_n/dV_i, in place (M x N)
        G = None
        if USE_GPU:
            try:
                Sg = cp.asarray(psi); G = cp.asnumpy(Sg.T @ Sg); del Sg; cp.get_default_memory_pool().free_all_blocks()
            except Exception as ex:
                print('gpu gram failed, cpu fallback:', repr(ex)[:100], flush=True); G = None
        if G is None: G = psi.T @ psi
        # truncated eigen-decomposition of the Gram matrix (relative cut-off rc): minimum-norm step on the retained directions
        wv, U = np.linalg.eigh(G)
        keep = wv > rc * wv[-1]
        c = U[:, keep] @ ((U[:, keep].T @ r) / wv[keep])
        hist[-1]['gram_cond'] = float(wv[-1] / max(wv[0], 1e-300)); hist[-1]['kept'] = int(keep.sum())
        dV = dV + psi @ c
        del psi, G
    res = dict(kind=kind, N=N, q=q, Emax=float(Emax), h=h, M=M, history=hist)
    # ---- Fourier lines.  (a) level residuals r_n = gamma_n - E_n(V_WS) (the linear input of the correction):
    #      R(tau) = sum_n r_n w(gamma_n) exp(-i tau gamma_n); first-order prediction |R(log n)| proportional to |Lambda_F(n)|/(sqrt(n) log n)
    # (b) the correction: G(tau) = h sum_i dV_i w(u_i) exp(-i tau u_i), u_i = V_WS(x_i); the lines of G sit at
    #      tau_n = log n + c (log n)^3 (c fitted on the two strongest lines; a dispersion effect of the fast part of psi^2)
    u = Vws; ua = g[max(5, N // 50)]; ub = g[-1] * 0.98
    w = np.where((u > ua) & (u < ub), np.sin(math.pi * (u - ua) / (ub - ua)) ** 2, 0.0)
    wg = np.where((g > ua) & (g < ub), np.sin(math.pi * (g - ua) / (ub - ua)) ** 2, 0.0)
    width = 2 * math.pi / (ub - ua)
    nmax = max(12, min(60, int(0.2 / width))); ns = list(range(2, nmax + 1))
    Lam = lam_coeffs(kind, nmax)
    def is_pp(n):
        for p in range(2, n + 1):
            if n % p == 0:
                while n % p == 0: n //= p
                return n == 1
    taus = np.arange(0.5, 4.2, width / 4)
    def spectrum(vals, pos, wt):
        out = np.empty(len(taus))
        for a0 in range(0, len(taus), 256):
            tt = taus[a0:a0 + 256]
            out[a0:a0 + 256] = np.abs(np.exp(-1j * np.outer(tt, pos)) @ (vals * wt))
        return out
    def analyse(spec, shape, c=0.0):
        centres = {n: math.log(n) + c * math.log(n) ** 3 for n in ns}
        # amplitude = maximum of the spectrum within 1.5 line widths of the centre; background = median of the same
        # running maximum over the whole range 0.5 <= tau <= log(nmax) + 0.1
        hw = 6                                              # 1.5 widths at step width/4
        rm = np.array([spec[max(0, i - hw):i + hw + 1].max() for i in range(len(spec))])
        rng_ = taus <= math.log(nmax) + 0.1
        bg = float(np.median(rm[rng_]))
        amp = {}
        for n in ns:
            i = int(round((centres[n] - taus[0]) / (taus[1] - taus[0])))
            amp[n] = float(rm[i]) / bg if 0 <= i < len(rm) else float('nan')
        A = np.array([amp[n] for n in ns]); Pd = np.array([shape(n) for n in ns])
        ok = np.isfinite(A)
        sc = float(np.sum(A[ok] * Pd[ok]) / np.sum(Pd[ok] ** 2))
        npp = [n for n in ns if not is_pp(n)]
        return dict(background=bg, corr_with_Lambda_shape=float(np.corrcoef(A[ok], Pd[ok])[0, 1]), scale=sc,
                    amp_over_bg={n: round(amp[n], 2) for n in ns}, pred_over_bg={n: round(sc * shape(n), 2) for n in ns},
                    max_non_prime_power=max((amp[n], n) for n in npp), mean_non_prime_power=float(np.nanmean([amp[n] for n in npp])),
                    lines_above_5bg=[n for n in ns if amp[n] > 5])
    specR = spectrum(r0, g, wg)
    res['residual_list'] = analyse(specR, lambda n: abs(Lam[n]) / (math.sqrt(n) * math.log(n)))
    specG = spectrum(dV * h, u, w)
    # dispersion constant from the strongest line of the residual list
    top = sorted(ns, key=lambda n: -res['residual_list']['amp_over_bg'][n])[:2]
    cs = []
    for n in top:
        t0_ = math.log(n); m = (taus > t0_ - 0.02) & (taus < t0_ + 0.25 * t0_)
        tp = taus[m][np.argmax(specG[m])]; cs.append((tp - t0_) / t0_ ** 3)
    cdisp = float(np.mean(cs))
    res['dV_spectrum'] = analyse(specG, lambda n: abs(Lam[n]) / math.sqrt(n * math.log(n)), cdisp)
    res['dV_spectrum']['dispersion_c'] = cdisp; res['dV_spectrum']['c_from'] = top
    res['dV_spectrum_unshifted'] = {k: v for k, v in analyse(specG, lambda n: abs(Lam[n]) / math.sqrt(n * math.log(n)), 0.0).items() if k in ('corr_with_Lambda_shape', 'max_non_prime_power', 'lines_above_5bg')}
    res.update(window=[float(ua), float(ub)], line_width=width)
    res['dV_l2'] = float(np.sqrt(h * np.sum(dV ** 2))); res['dV_max'] = float(np.abs(dV).max())
    res['seconds'] = round(time.time() - t0, 1)
    np.savez(out.replace('.json', '.npz'), dV=dV, Vws=Vws, h=h, g=g, r0=r0)
    json.dump(res, open(out, 'w'), indent=1)
    for key in ('residual_list', 'dV_spectrum'):
        d = res[key]; print(key, 'corr', round(d['corr_with_Lambda_shape'], 3), 'max non-prime-power', d['max_non_prime_power'], 'lines>5bg', d['lines_above_5bg'], 'c', d.get('dispersion_c'))
