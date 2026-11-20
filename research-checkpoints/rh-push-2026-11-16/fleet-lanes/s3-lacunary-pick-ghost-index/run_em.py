"""Combination (4): anticausal energy E_-(a; T) = || P_-(chi_T R_a) ||^2 of the boundary values R_a(it) = F(it - a)/F(it + a)
= conj(F(a + it))/F(a + it), |t| <= T.  P_+ = boundary values of H^2(Re w > 0) (Fourier support e^{-itx}, x > 0).
  vals <code> <a> <T> <dt>          boundary values on t_j = (j + 1/2) dt, 0 < t < T (Arb at 96 bits -> complex128), saved as npy
  (analysis functions are imported by analyze_em.py)
Identity used as a check:  E_- = T - (1/2pi) int int sin(theta(s) - theta(t))/(t - s) ds dt,  R = e^{i theta}."""
import sys, os, json, math, time
import numpy as np

def fname(code, a, T, dt):
    return 'em_%s_a%s_T%g_dt%g.npy' % (code.replace('/', '_').replace(':', '_'), a, T, dt)

def _chunk(args):
    code, a, j0, j1, dt = args
    from flint import acb, arb, ctx
    import lib
    ctx.prec = 96
    o = lib.get(code); aa = arb(a)
    out = np.empty(j1 - j0, dtype=np.complex128)
    for j in range(j0, j1):
        u = lib.val(o, acb(aa, (j + 0.5) * dt))
        g = u.conjugate() / u
        out[j - j0] = complex(float(g.real.mid()), float(g.imag.mid()))
    return j0, out

def vals(code, a, T, dt, workers):
    from multiprocessing import Pool
    N = int(round(T / dt)); fn = fname(code, a, T, dt)
    if os.path.exists(fn): return np.load(fn)
    print('planned allocation: %d complex128 = %.2f GB' % (N, N * 16 / 1e9), flush=True)
    g = np.empty(N, dtype=np.complex128); step = 2000; t0 = time.time()
    with Pool(workers) as pool:
        for j0, out in pool.imap_unordered(_chunk, [(code, a, j, min(N, j + step), dt) for j in range(0, N, step)]):
            g[j0:j0 + len(out)] = out
    np.save(fn, g); print('vals', fn, 'sec %.1f' % (time.time() - t0), flush=True)
    return g

def full(ghalf, n=None):
    """values on t_j = (j + 1/2) dt, j = -n..n-1, from the half line (g(-t) = conj g(t))"""
    h = ghalf if n is None else ghalf[:n]
    return np.concatenate([np.conj(h[::-1]), h])

def eminus(g, dt, pad=4, xp=np):
    """anticausal energy of the sampled windowed function (zero-padded FFT). Anticausal = components e^{+i omega t}, omega > 0."""
    N = len(g); M = 1
    while M < pad * N: M *= 2
    F = xp.fft.fft(xp.asarray(g), n=M)
    P = F.real ** 2; P += F.imag ** 2; del F
    e = P[1:M // 2].sum() + 0.5 * (P[0] + P[M // 2])
    return float(e) * dt / M

def tgrid(n, dt):
    return (np.arange(-n, n) + 0.5) * dt

def planted_factor(t, a, delta, gamma):
    """Q(it - a)/Q(it + a) for the quadruple +-delta +- i gamma"""
    w = 1j * t; f = np.ones_like(w)
    for z in (delta + 1j * gamma, delta - 1j * gamma, -delta + 1j * gamma, -delta - 1j * gamma):
        f *= (w - a - z) / (w + a - z)
    return f

def fix_factor(t, a, delta, gamma):
    """Blaschke factor removing the poles of R_a at (delta - a) +- i gamma (delta > a): prod (w - p)/(w + conj p)"""
    w = 1j * t; f = np.ones_like(w); x0 = delta - a
    for p in (x0 + 1j * gamma, x0 - 1j * gamma):
        f *= (w - p) / (w + np.conj(p))
    return f

if __name__ == '__main__':
    if sys.argv[1] == 'vals':
        vals(sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5]), int(os.environ.get('RH_WORKERS', '4')))
