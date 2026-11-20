"""s1-klein-annulus-energy, combination (2): Li-type coefficients as Fourier coefficients on a circle |w| = rho.
w = 1 - 1/s (s = 1/(1-w); the elliptic chart with lens L = 1; |w| < 1 is Re s > 1/2; w = 1 is s = infinity).
phi(w) = w d/dw log F(s(w)) = w s^2 (F'/F)(s) = sum_{n>=1} lambda_n w^n near w = 0,
lambda_n = sum_rho [1 - (1 - 1/rho)^n].  On |w| = rho = 1 - 1/(2H):
   c_n = (1/N) sum_j phi(w_j) e^{-i n theta_j}:  n > 0: rho^n (lambda_n + sum_{|w_k|<rho} w_k^{-n});  n = 0: number of zeros with |w_k| < rho;
   n < 0: rho^{-|n|} sum_{|w_k|<rho} w_k^{|n|}   (w_k = images of the zeros of F inside the circle; none for zeta under RH).
float64 screen; --recheck recomputes single coefficients in ball arithmetic (prec 160).
usage: li.py CODE H log2N NMAX out.npz [--recheck n1,n2,...]
"""
import sys, os, math, time, json
import numpy as np
from multiprocessing import Pool
import lines

def _init(code, delta, N, prec, recheck):
    global CODE, DELTA, NN, RECHECK
    from flint import ctx
    ctx.prec = prec
    CODE = code; DELTA = delta; NN = N; RECHECK = recheck

def _arith_logder(s):
    """A'/A at acb s through acb_series"""
    from flint import acb, arb, acb_series
    x = acb_series([s, 1], prec=2); c = CODE
    if c == 'ZETA':
        v = x.zeta()
    elif c == 'LCHI3':
        v = (x.zeta(arb(1) / 3) - x.zeta(arb(2) / 3)) * (-x * arb(3).log()).exp()
    elif c == 'DH':
        r5 = arb(5).sqrt(); k = ((10 - 2 * r5).sqrt() - 2) / (r5 - 1)
        v = (x.zeta(arb(1) / 5) + k * x.zeta(arb(2) / 5) - k * x.zeta(arb(3) / 5) - x.zeta(arb(4) / 5)) * (-x * arb(5).log()).exp()
    elif c.startswith('EA'):
        num, den = c.split(':')[1].split('/'); a = arb(int(num)) / int(den)
        v = (x + a).zeta() * (x - a).zeta()
    elif c.startswith('TNR'):
        lq = arb(3).log(); cc = arb('2.2')
        v = x.zeta() * (1 + cc * ((arb(1) / 2 - x) * lq).exp() + ((1 - 2 * x) * lq).exp())
    else:
        raise KeyError(c)
    return v[1] / v[0]

def _pt(j):
    th = 2 * math.pi * j / NN
    rho = 1 - DELTA
    omw = complex(DELTA + rho * 2 * math.sin(th / 2) ** 2, -rho * math.sin(th))     # 1 - w
    return th, rho, 1 / omw

def _chunk(rng):
    from flint import acb
    j0, j1 = rng
    out = np.zeros(j1 - j0, dtype=complex)
    for j in range(j0, j1):
        th, rho, s = _pt(j)
        if s.real > 64: continue
        v = _arith_logder(acb(s.real, s.imag))
        out[j - j0] = complex(float(v.real.mid()), float(v.imag.mid()))
    return j0, out

def _gamma_logder_arb(s):
    """g'/g in ball arithmetic (recheck mode)"""
    from flint import acb, arb
    c = CODE; lp = arb.pi().log()
    if c == 'ZETA' or c.startswith('TNR'):
        v = 1 / s + 1 / (s - 1) - lp / 2 + (s / 2).digamma() / 2
        if c.startswith('TNR'): v += arb(3).log()
        return v
    if c in ('LCHI3', 'DH'):
        q = 3 if c == 'LCHI3' else 5
        return (arb(q) / arb.pi()).log() / 2 + ((s + 1) / 2).digamma() / 2
    if c.startswith('EA'):
        num, den = c.split(':')[1].split('/'); a = arb(int(num)) / int(den); v = 0
        for u in (s + a, s - a):
            v = v + 1 / u + 1 / (u - 1) - lp / 2 + (u / 2).digamma() / 2
        return v
    raise KeyError(c)

def _chunk_recheck(rng):
    """ball-arithmetic partial sums of phi(w_j) e^{-i n theta_j} for n in RECHECK, j in [j0,j1) of the full circle"""
    from flint import acb, arb
    j0, j1 = rng
    acc = [acb(0) for _ in RECHECK]
    delta = arb(DELTA); rho = 1 - delta; twopi = 2 * arb.pi()
    for j in range(j0, j1):
        th = twopi * j / NN
        w = rho * acb(th.cos(), th.sin())
        s = 1 / (1 - w)
        Ls = _gamma_logder_arb(s)
        if float(s.real.mid()) <= 200: Ls = Ls + _arith_logder(s)
        ph = w * s * s * Ls
        for i, n in enumerate(RECHECK):
            a = th * n
            acc[i] += ph * acb(a.cos(), -a.sin())
    return [(str(v.real), str(v.imag)) for v in acc]

def run(code, H, log2N, nmax, outf, recheck=None):
    workers = int(os.environ.get('RH_WORKERS', '4'))
    N = 1 << log2N; delta = 1 / (2 * H); rho = 1 - delta
    print('li: %s H %g rho 1-%g N 2^%d = %d nmax %d; arrays %.0f MB; amplification rho^-nmax = %.3g; alias rho^N = %.3g'
          % (code, H, delta, log2N, N, nmax, N * 16 * 4 / 1e6, rho ** (-nmax), rho ** N), flush=True)
    t0 = time.time()
    if recheck:
        from flint import arb, ctx
        ctx.prec = 160
        csz = max(64, N // (workers * 64)); rngs = [(a, min(N, a + csz)) for a in range(0, N, csz)]
        with Pool(workers, initializer=_init, initargs=(code, delta, N, 160, recheck)) as p:
            res = p.map(_chunk_recheck, rngs, chunksize=1)
        out = {}
        for i, n in enumerate(recheck):
            re = sum((arb(r[i][0]) for r in res), arb(0)) / N; im = sum((arb(r[i][1]) for r in res), arb(0)) / N
            lam = re / (1 - arb(delta)) ** n
            out[str(n)] = dict(c_re=str(re), c_im=str(im), lambda_from_c=str(lam))
            print('recheck n=%d c_n = %s + %s i ; c_n rho^-n = %s' % (n, re, im, lam), flush=True)
        json.dump(dict(code=code, H=H, log2N=log2N, recheck=out, seconds=time.time() - t0), open(outf, 'w'), indent=1)
        return
    half = N // 2 + 1
    csz = max(256, half // (workers * 64)); rngs = [(a, min(half, a + csz)) for a in range(0, half, csz)]
    with Pool(workers, initializer=_init, initargs=(code, delta, N, 64, None)) as p:
        res = p.map(_chunk, rngs, chunksize=1)
    al = np.zeros(half, dtype=complex)
    for j0, o in res: al[j0:j0 + len(o)] = o
    print('li: arithmetic part evaluated in %.1f s' % (time.time() - t0), flush=True)
    j = np.arange(half); th = 2 * math.pi * j / N
    omw = (delta + rho * 2 * np.sin(th / 2) ** 2) - 1j * rho * np.sin(th)
    s = 1 / omw; w = 1 - omw
    la, l1, l2 = lines.gamma_parts(code, s)
    ph_half = w * s * s * (l1 + al)
    ph = np.empty(N, dtype=complex); ph[:half] = ph_half; ph[half:] = np.conj(ph_half[1:N // 2][::-1])    # phi(conj w) = conj phi(w)
    c = np.fft.fft(ph) / N
    n = np.arange(1, nmax + 1)
    lam = c[1:nmax + 1].real * np.exp(-n * math.log1p(-delta))          # lambda_n if no zero image inside the circle
    cneg = c[-1:-nmax - 1:-1]                                           # c_{-n}, n = 1..nmax
    pneg = cneg * np.exp(n * math.log1p(-delta))                        # sum_k w_k^n over zero images inside
    Eplus = float(np.sum(np.abs(c[1:N // 2]) ** 2 / np.arange(1, N // 2))); Eminus = float(np.sum(np.abs(c[N // 2 + 1:]) ** 2 / np.arange(N // 2 - 1, 0, -1)))
    neg = np.nonzero(lam < 0)[0]
    first_neg = int(neg[0] + 1) if len(neg) else None
    print('li: c_0 = %.6f %+.2ei  (number of zeros inside the circle)' % (c[0].real, c[0].imag))
    print('li: lambda_1..5 =', lam[:5])
    print('li: first negative n:', first_neg, ' min lambda_n/n: %.6g at n=%d' % (float((lam / n).min()), int(np.argmin(lam / n)) + 1))
    print('li: energy split E_minus/E_plus = %.3e ; max|c_-n| rho^n = %.3e ; max imag c_n = %.3e' % (Eminus / Eplus, float(np.abs(pneg).max()), float(np.abs(c[1:nmax + 1].imag).max())), flush=True)
    np.savez(outf, code=code, H=H, log2N=log2N, nmax=nmax, lam=lam, pneg=pneg, c0=c[0], Eplus=Eplus, Eminus=Eminus,
             first_neg=-1 if first_neg is None else first_neg, cpos=c[1:nmax + 1])
    print('wrote', outf, 'in %.1f s' % (time.time() - t0), flush=True)

if __name__ == '__main__':
    code = sys.argv[1]; H = float(sys.argv[2]); log2N = int(sys.argv[3]); nmax = int(sys.argv[4]); outf = sys.argv[5]
    rc = None
    if '--recheck' in sys.argv:
        rc = [int(v) for v in sys.argv[sys.argv.index('--recheck') + 1].split(',')]
    run(code, H, log2N, nmax, outf, rc)
