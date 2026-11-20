"""s5 combination 2: susceptibility chi(sigma) = int |log F(sigma + it)|^2 w(t) dt / int w, w = Hann window on [T, T+H].
   log F = log|F| + i arg F, arg by continuation from the right along the horizontal line (principal value at the right end of
   the sigma grid, unwrapped leftwards on a grid of step 0.01).  chi = chi_abs + chi_arg.
   Evaluators (float64, numpy or cupy; a screen, checked against Arb in mode 'validate'):
     zeta family (ZETA, EA, TNR3, TNRQ) : Riemann-Siegel evaluator zgpu.Win (copied unchanged from s2-derivative-zeros-two-line)
     Hurwitz combinations (L4, L5, DH, ZETAH, LIOU) : Euler-Maclaurin, class by class
     truncated Euler products with twists (EP1, EPL, EPS<seed>, EPU<seed>) : direct sums over primes <= P
   Usage: t2_chi.py run OBJ T H dt nwin out.json        (nwin consecutive windows starting at T)
          t2_chi.py validate
          t2_chi.py dhwin                               (windows of DH free of off-line zeros, from the c12 table)"""
import sys, os, json, math, time
import numpy as np
GPU = False
try:
    if os.environ.get('RH_BACKEND') == 'cpu': raise ImportError
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=int(os.environ.get('RH_POOL_GB', '12')) * 1024 ** 3)
    xp.zeros(4).sum(); GPU = True
except Exception:
    import numpy as xp
def asnp(a): return xp.asnumpy(a) if GPU else np.asarray(a)
def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)

XU = [round(0.01 * i, 3) for i in range(0, 71)]                 # sigma - 1/2 on the unwrapping grid: 0 .. 0.70
XS = [0, 0.01, 0.02, 0.03, 0.05, 0.07, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6, -3617 / 510]

def hurwitz_classes(classes, q, sig, t, scale=1.0, tscale=1.0, budget=3e7):
    """sum_a c_a zeta(s, a/q) q^{-s} at s = scale*(sig_j) + i tscale*t_k; returns complex [nsig, nt].  Euler-Maclaurin with
    N = |t|max*tscale + 40 terms per class and 8 Bernoulli terms (relative truncation error below 1e-12)."""
    sig = np.asarray(sig, dtype=np.float64) * scale; tt = np.asarray(t, dtype=np.float64) * tscale
    N = int(abs(tt).max()) + 40
    out = np.zeros((len(sig), len(tt)), dtype=np.complex128)
    B = max(4, int(budget // N))
    sg = xp.asarray(sig)
    for a, c in classes:
        al = a / q
        m = xp.arange(N, dtype=xp.float64) + al; lm = xp.log(m)
        W = xp.exp(-xp.outer(lm, sg)).astype(xp.complex128)                     # [N, nsig]
        acc = np.empty((len(tt), len(sig)), dtype=np.complex128)
        for s0 in range(0, len(tt), B):
            ph = xp.outer(xp.asarray(tt[s0:s0 + B]), lm)
            acc[s0:s0 + B] = asnp(xp.exp(-1j * ph) @ W)
        x = N + al; lx = math.log(x)
        for j, sgj in enumerate(sig):
            s = sgj + 1j * tt
            xs_ = np.exp(-s * lx)                                                # x^{-s}
            tail = xs_ * x / (s - 1) + 0.5 * xs_
            poch = s.copy(); xp_ = xs_ / x; f = 2.0
            for k in range(1, 9):
                tail = tail + B2K[k - 1] / f * poch * xp_
                poch = poch * (s + 2 * k - 1) * (s + 2 * k); xp_ = xp_ / (x * x); f = f * (2 * k + 1) * (2 * k + 2)
            out[j] += c * (acc[:, j] + tail)
    for j, sgj in enumerate(sig):
        out[j] *= np.exp(-(sgj + 1j * tt) * math.log(q))
    return out

def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]

def euler_trunc(kind, P, sig, t, budget=2e7):
    """log F_P(s) = -sum_{p <= P} log(1 - eps_p p^{-s}) directly (returns the logarithm, [nsig, nt])."""
    pr = primes_upto(P).astype(np.float64); lp = np.log(pr)
    if kind == 'EP1': eps = np.ones(len(pr), dtype=np.complex128)
    elif kind == 'EPL': eps = -np.ones(len(pr), dtype=np.complex128)
    elif kind.startswith('EPS'): eps = np.random.default_rng(int(kind[3:])).choice([-1.0, 1.0], size=len(pr)).astype(np.complex128)
    elif kind.startswith('EPU'): eps = np.exp(2j * np.pi * np.random.default_rng(int(kind[3:])).random(len(pr)))
    out = np.empty((len(sig), len(t)), dtype=np.complex128)
    B = max(4, int(budget // len(pr))); lpg = xp.asarray(lp); eg = xp.asarray(eps)
    for s0 in range(0, len(t), B):
        U = xp.exp(-1j * xp.outer(xp.asarray(np.asarray(t[s0:s0 + B], dtype=np.float64)), lpg)) * eg[None, :]
        for j, sg in enumerate(sig):
            out[j, s0:s0 + B] = asnp(-xp.log1p(-U * xp.exp(-sg * lpg)[None, :]).sum(axis=1))
    return out

def values(obj, T, tgrid):
    """returns (x list on which F is given, F [nx, nt], log-direct flag)"""
    sig = [0.5 + x for x in XU]
    if obj in ('ZETA', 'TNR3', 'TNRQ', 'EA'):
        import zgpu
        w = zgpu.Win(T)
        if obj == 'EA':
            xe = [round(0.01 * i, 3) for i in range(-25, 96)]
            z = w.zeta(tgrid - T, xe, order=1)[0]
            return ('EA', xe, z)
        z = w.zeta(tgrid - T, XU, order=1)[0]
        if obj != 'ZETA':
            q = 3.0 if obj == 'TNR3' else 1000003.0
            for j, x in enumerate(XU):
                wv = x + 1j * tgrid
                z[j] = z[j] * (1 + 2.2 * np.exp(-wv * math.log(q)) + np.exp(-2 * wv * math.log(q)))
        return ('F', XU, z)
    if obj == 'ZETAH': return ('F', XU, hurwitz_classes([(1, 1.0)], 1, sig, tgrid))
    if obj == 'L4': return ('F', XU, hurwitz_classes([(1, 1.0), (3, -1.0)], 4, sig, tgrid))
    if obj == 'L5': return ('F', XU, hurwitz_classes([(1, 1.0), (2, -1.0), (3, -1.0), (4, 1.0)], 5, sig, tgrid))
    if obj == 'DH': return ('F', XU, hurwitz_classes([(1, 1.0), (2, KAPPA), (3, -KAPPA), (4, -1.0)], 5, sig, tgrid))
    if obj == 'LIOU':
        return ('F', XU, hurwitz_classes([(1, 1.0)], 1, sig, tgrid, scale=2.0, tscale=2.0) / hurwitz_classes([(1, 1.0)], 1, sig, tgrid))
    if obj.startswith('EP'): return ('LOG', XU, euler_trunc(obj, int(float(os.environ.get('RH_P', '1e5'))), sig, tgrid))
    raise KeyError(obj)

def unwrap_from_right(F):
    """log F on rows ordered by increasing x: principal log on the last row, phase unwrapped towards smaller x."""
    la = np.log(np.abs(F)); ph = np.angle(F)
    for j in range(F.shape[0] - 2, -1, -1):
        d = ph[j] - ph[j + 1]
        ph[j] = ph[j + 1] + (d + np.pi) % (2 * np.pi) - np.pi
    return la, ph

def prime_side(x):
    """D(sigma) = sum_p sum_k p^{-2k sigma}/k^2 (mean of |log zeta|^2 for sigma > 1/2 as T -> infinity), primes to 1e7 + tail"""
    s2 = 1.0 + 2 * x
    if s2 <= 1.0 + 1e-12: return float('inf')
    pr = prime_side.pr
    tot = 0.0
    for k in range(1, 40):
        tot += float(np.sum(pr ** (-k * s2))) / k ** 2
    P = 1e7
    return tot + P ** (1 - s2) / ((s2 - 1) * math.log(P))      # tail of the k = 1 term by the prime number theorem
prime_side.pr = None

def run(obj, T, H, dt, nwin, out):
    rows = []
    prime_side.pr = primes_upto(10 ** 7).astype(np.float64)
    D = [prime_side(x) for x in XS]
    for wi in range(nwin):
        T0 = T + wi * H
        if obj in ('ZETA', 'TNR3', 'TNRQ', 'EA'):
            import zgpu
            T0 = zgpu.safe_T0(T0, H)
        n = int(round(H / dt)); tg = T0 + dt * (np.arange(n) + 0.5)
        wgt = np.sin(np.pi * (tg - T0) / H) ** 2; wgt /= wgt.sum()
        kind, xs, V = values(obj, T0, tg)
        if kind == 'EA':
            la, ph = unwrap_from_right(V); ix = {x: i for i, x in enumerate(xs)}
            LA = np.array([la[ix[round(x + 0.25, 3)]] + la[ix[round(x - 0.25, 3)]] for x in XU]); PH = np.array([ph[ix[round(x + 0.25, 3)]] + ph[ix[round(x - 0.25, 3)]] for x in XU])
        elif kind == 'LOG': LA, PH = V.real, V.imag
        else: LA, PH = unwrap_from_right(V)
        iu = {x: i for i, x in enumerate(XU)}
        ca = [float((LA[iu[x]] ** 2) @ wgt) for x in XS]; cg = [float((PH[iu[x]] ** 2) @ wgt) for x in XS]
        m1 = [float(LA[iu[x]] @ wgt) for x in XS]
        ch = [a + b for a, b in zip(ca, cg)]
        jp = int(np.argmax(ch)); ja = int(np.argmax(ca))
        rows.append({'T0': T0, 'H': H, 'dt': dt, 'chi_abs': ca, 'chi_arg': cg, 'chi': ch, 'mean_logabs': m1, 'peak_x': XS[jp], 'peak_x_abs': XS[ja],
                     'cusp_abs': (ca[0] - ca[1]) / (0.01 * math.log(100.0)), 'max_jump_unwrap': float(np.abs(np.diff(PH, axis=0)).max())})
        log(obj, 'T0 %.8g' % T0, 'peak x (chi, chi_abs) = %.2f %.2f' % (XS[jp], XS[ja]), 'chi_abs:', ' '.join('%.4f' % v for v in ca[:8]), '| chi(0), chi(0.25), chi(0.5) = %.4f %.4f %.4f' % (ch[0], ch[9], ch[14]))
    json.dump({'object': obj, 'XS': XS, 'prime_side_D': D, 'backend': 'cupy' if GPU else 'numpy', 'rows': rows}, open(out, 'w'))

def validate():
    from flint import acb, arb, ctx
    ctx.prec = 200
    worst = {}
    for T in (1000.0, 20000.0):
        tg = T + np.array([0.123, 1.77, 3.5]); sig = [0.5, 0.63, 1.2]
        for nm, cl, q in (('ZETAH', [(1, 1.0)], 1), ('L4', [(1, 1.0), (3, -1.0)], 4), ('DH', [(1, 1.0), (2, KAPPA), (3, -KAPPA), (4, -1.0)], 5)):
            v = hurwitz_classes(cl, q, sig, tg)
            for j, sg in enumerate(sig):
                for k, t in enumerate(tg):
                    s = acb(arb(sg), arb(float(t)))
                    r = sum(arb(c) * s.zeta(arb(a) / q) for a, c in cl) * (-s * arb(q).log()).exp()
                    r = complex(float(r.real.mid()), float(r.imag.mid()))
                    worst[nm] = max(worst.get(nm, 0), abs(v[j, k] - r) / abs(r))
    print('Euler-Maclaurin evaluator against Arb, worst relative error:', worst, flush=True)
    import zgpu
    T0 = zgpu.safe_T0(1e6, 20); w = zgpu.Win(T0); d = np.array([0.3, 7.7]); z = w.zeta(d, [0.0, 0.25, 0.7], order=1)[0]; e = 0
    for j, x in enumerate([0.0, 0.25, 0.7]):
        for k in range(2):
            r = zgpu.arb_zeta_jet(0.5 + x, T0, float(d[k]), n=1)[0]; e = max(e, abs(z[j, k] - r) / abs(r))
    print('Riemann-Siegel evaluator against Arb at 1e6, worst relative error: %.2e' % e)
    # truncated Euler product against log zeta at sigma = 1.2 (P = 1e5): difference bounded by the prime tail
    tg = 1000.0 + np.array([0.5, 1.5]); le = euler_trunc('EP1', 100000, [1.2, 2.0], tg); lz = np.log(hurwitz_classes([(1, 1.0)], 1, [1.2, 2.0], tg))
    print('log of truncated Euler product (P = 1e5) minus log zeta at sigma = 1.2, 2.0:', np.abs(le - lz).max(axis=1))

def dhwin():
    z = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tables_zeros_DH.json')))
    g = sorted(float(r[1]) for r in z['offline'])
    gaps = [(g[i + 1] - g[i], g[i], g[i + 1]) for i in range(len(g) - 1)]
    gaps.sort(reverse=True)
    print('first off-line ordinates:', g[:6]); print('largest gaps between consecutive off-line ordinates below 2000:', [(round(a, 2), round(b, 2), round(c, 2)) for a, b, c in gaps[:8]])

if __name__ == '__main__':
    if sys.argv[1] == 'run': run(sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]), int(sys.argv[6]), sys.argv[7])
    elif sys.argv[1] == 'validate': validate()
    elif sys.argv[1] == 'dhwin': dhwin()
