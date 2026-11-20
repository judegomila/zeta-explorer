"""s1-antibridge-cutoff-energy, combination (1): kernel-side layer forms.
M_x(d) = int a e^{xa} kappa(a+d) kappa(a-d) da = int_0^inf 2a sinh(xa) kappa(a+d) kappa(a-d) da  (kappa even),
W(x,t) = Re(F' conj F)(x+it) = int M_x(b) cos(tb) db   (PR 43 gram_twistor note; re-derived in RESULT.md).
For nodes b_j = j*delta and a real vector c:  sum c_j c_k M_x(b_j-b_k) = (1/2pi) int W(x,t) |c^(t)|^2 dt.
Trapezoid rule on a grid eta | delta (kappa analytic in |Im u| < pi/2: error ~ exp(-pi^2/eta)); python-flint balls used as
multiprecision numbers (MEASURED, not an interval certificate; negative sections are re-checked by a direct quadratic form
at higher precision).
Modes:
  fixed   : Q(1/20), the integrated form of c = (-2,9,-19,24,-19,9,-2), x-scan, smallest eigen-direction of the 7-node section
  lev     : Levinson recursion of the Toeplitz sections T_N = [M_x((j-k) delta)], first N with a negative pivot
"""
import sys, os, json, math, time
from flint import arb, acb, ctx, arb_poly, arb_mat
import flib

C7 = [-2, 9, -19, 24, -19, 9, -2]

def make_kernel(name, eta, digits):
    if name == 'HEAT': return flib.Kernel('HEAT', eta, digits, tau='-0.5')
    if name == 'EA': return flib.Kernel('EA', eta, digits, ea='0.25')
    if name == 'TNR': return flib.Kernel('TNR', eta, digits, tnr=(3, '2.2'))
    return flib.Kernel(name, eta, digits)

def eta_for(name, delta_target, m):
    """grid step: eta = delta/m; for TNR eta must divide 2 log 3, delta is adjusted"""
    if name == 'TNR':
        l3 = 2 * math.log(3); k = max(1, int(round(l3 / (float(delta_target) / m))))
        return arb(3).log() * 2 / k
    return arb(delta_target) / m

def Mx_table(K, x, step, kmax):
    """r_k = M_x(k*step*eta), k = 0..kmax"""
    n = len(K.k); x = arb(x)
    g = [v * (x * K.eta * (i - K.J) / 2).exp() for i, v in enumerate(K.k)]
    g1 = arb_poly([gi * (K.eta * (i - K.J) / 2) for i, gi in enumerate(g)])
    grev = arb_poly(g[::-1])
    P = g1 * grev
    out = []
    for k in range(kmax + 1):
        D = 2 * k * step
        if D > n - 1: out.append(arb(0)); continue
        out.append((P[n - 1 + D] + P[n - 1 - D]) * K.eta)
    return out

def W_exact(name, x, t):
    o = flib.OBJ[name] if name != 'HEAT' else None
    if o is None: return None
    c = o.taylor(acb(x, t), 2)
    return (c[1] * c[0].conjugate()).real

def mid(v):
    return v.mid()

def levinson(r, Nmax, report=None, stop_at_negative=True):
    """returns list of (n, E_n) samples, first n with E_n <= 0 (or None), and the predictor a at that n"""
    B = len(r) - 1
    while B > 0 and float(abs(r[B]).mid() / abs(r[0]).mid()) == 0.0 and abs(r[B]) == 0: B -= 1
    a = [arb(1)]; E = mid(r[0]); hist = [(0, float(E))]; t0 = time.time()
    emin = (float('inf'), 0); kmax = 0.0; quiet = 0
    for n in range(1, Nmax):
        acc = arb(0)
        j0 = max(0, n - B)
        for j in range(j0, n):
            acc += a[j] * r[n - j]
        k = mid(-acc / E)
        a.append(arb(0))
        ar = a[::-1]
        a = [mid(a[j] + k * ar[j]) for j in range(n + 1)]
        E = mid(E * (1 - k * k))
        fk = abs(float(k)); kmax = max(kmax, fk)
        fe = float(E)
        if n % 50 == 0 or n < 20: hist.append((n, fe, fk))
        if report and n % report == 0:
            print('  n %d E %.6e |k| %.12f kmax %.12f elapsed %.0f s' % (n, fe, fk, kmax, time.time() - t0), flush=True)
        if not (E > 0):
            hist.append((n, fe, fk))
            if stop_at_negative: return hist, n, a, kmax
        # early stop: reflection coefficients below 1e-30 for 3 band-lengths (the pivots have converged; Szego limit)
        quiet = quiet + 1 if fk < 1e-30 else 0
        if quiet > 3 * B + 50 and n > 6 * B:
            hist.append((n, fe, fk)); hist.append(('converged_at', n, fe))
            print('  converged: |k| < 1e-30 for %d steps at n = %d, E = %.6e' % (quiet, n, fe), flush=True)
            return hist, None, a, kmax
    return hist, None, a, kmax

def quad_form(a, r):
    """exact-style re-check: sum a_i a_j r_|i-j| with the current precision"""
    B = len(r) - 1; n = len(a); tot = arb(0)
    for i in range(n):
        s = a[i] * r[0]
        for d in range(1, min(B, n - 1) + 1):
            if i - d >= 0: s += a[i - d] * r[d]
            if i + d < n: s += a[i + d] * r[d]
        tot += a[i] * s
    return tot

def spectrum(a, delta, ts):
    """|a^(t)|^2 at given t"""
    out = []
    for t in ts:
        w = (acb(0, 1) * arb(t) * delta).exp(); s = acb(0); p = acb(1)
        for v in a:
            s += v * p; p *= w
        out.append(float((abs(s) ** 2).mid().log().mid()) / math.log(10))
    return out

def run_fixed(name, bits, outdir):
    ctx.prec = bits; digits = int(bits * 0.30103) - 20
    eta = eta_for(name, '0.15', 6); step = 6
    K = make_kernel(name, eta, digits)
    delta = K.eta * step
    res = dict(obj=name, bits=bits, eta=float(K.eta), delta=float(delta), grid=len(K.k))
    def kap(i): 
        j = i + K.J
        return K.k[j] if 0 <= j < len(K.k) else arb(0)
    # Q(a) at a = delta/3 (= 1/20 when delta = 0.15), layers on a grid
    def Qa(ia):
        s = arb(0)
        for j, cj in enumerate(C7):
            for k, ck in enumerate(C7):
                d = (j - k) * step
                s += cj * ck * kap(ia + d) * kap(ia - d)
        return s
    res['Q_at_delta_over_3'] = float(Qa(2))
    res['Q_layers'] = [[float(K.eta * ia), float(Qa(ia))] for ia in range(0, int(4 / float(K.eta)) + 1, 2)]
    res['Q_negative_a'] = [a for a, q in res['Q_layers'] if q < 0]
    scan = []
    xs = [0.01, 0.02, 0.05] + [0.1 * i for i in range(1, 21)] + [0.25]
    for x in sorted(xs):
        r = Mx_table(K, x, step, 6)
        I = arb(0)
        for j, cj in enumerate(C7):
            for k, ck in enumerate(C7): I += cj * ck * r[abs(j - k)]
        # 7-node section: Levinson pivots, and minimum Rayleigh quotient through the pivots
        hist, neg, a, kmax = levinson(r, 7)
        scan.append(dict(x=x, I=float(I), pivots=[h[1] for h in hist], first_negative=neg, r0=float(r[0])))
    res['x_scan'] = scan
    if name not in ('HEAT',):
        # known-answer check: sum_k r_k cos(k delta t) delta (2 - delta_k0) = W(x,t)
        chk = []
        for (x, t) in [(0.25, 0.0), (0.25, 3.0), (0.1, 10.0)]:
            r = Mx_table(K, x, 1, (len(K.k) - 1) // 2)
            s = r[0] * K.eta
            for k in range(1, len(r)): s += 2 * r[k] * (arb(t) * K.eta * k).cos() * K.eta
            w = W_exact(name, x, t)
            chk.append(dict(x=x, t=t, kernel_side=float(s), W_closed_form=float(w), rel=float(abs(s / w - 1).mid())))
        res['identity_check'] = chk
    json.dump(res, open(os.path.join(outdir, 'fixed_%s.json' % name), 'w'), indent=1)
    print(json.dumps({k: v for k, v in res.items() if k not in ('Q_layers',)}, indent=1)[:3000])

def run_lev(name, delta_s, x, Nmax, bits, outdir, tag=''):
    ctx.prec = bits; digits = int(bits * 0.30103) - 20
    eta = eta_for(name, delta_s, 1)
    t0 = time.time()
    K = make_kernel(name, eta, digits)
    delta = K.eta
    kmax = (len(K.k) - 1) // 2
    print('lev %s delta %.6f x %s bits %d grid %d band %d Nmax %d  (planned memory: %.1f MB for the kernel, %.1f MB for the predictor)'
          % (name, float(delta), x, bits, len(K.k), kmax, Nmax, len(K.k) * (bits / 8 + 64) * 4 / 1e6, Nmax * (bits / 8 + 64) * 3 / 1e6), flush=True)
    r = [mid(v) for v in Mx_table(K, x, 1, kmax)]
    while len(r) > 2 and float(abs(r[-1] / r[0])) < 10.0 ** (-digits): r.pop()
    print('  kernel + table %.0f s; band used %d; r0 %.6e r1/r0 %.6f' % (time.time() - t0, len(r) - 1, float(r[0]), float(r[1] / r[0])), flush=True)
    # symbol of the Toeplitz sections on the fundamental cell: sigma(t) = sum_k r_k e^{i k delta t} = (1/delta) sum_m W(x, t + 2 pi m/delta)
    nt = int(math.pi / float(delta) / 0.02) + 1
    sym = []
    w0 = acb(0, 1) * delta
    rp = arb_poly(r)
    for i in range(nt + 1):
        t = arb(i) * arb.pi() / delta / nt
        z = (w0 * t).exp()
        v = acb(0); p = acb(1)
        for k, rk in enumerate(r):
            v += (rk if k == 0 else 2 * rk) * p.real; p *= z
        sym.append((float(t), v.real))
    negset = []; cur = None
    for t, v in sym:
        if v < 0:
            if cur is None: cur = [t, t]
            else: cur[1] = t
        elif cur is not None:
            negset.append(cur); cur = None
    if cur is not None: negset.append(cur)
    lg = [(t, (1 if v > 0 else -1) * float(abs(v).log()) / math.log(10)) for t, v in sym]
    print('  symbol: %d samples on [0, %.2f], negative intervals %s  (%.0f s)' % (nt + 1, math.pi / float(delta), negset[:12], time.time() - t0), flush=True)
    hist, neg, a, kmx = levinson(r, Nmax, report=max(200, Nmax // 40))
    res = dict(obj=name, delta=float(delta), nyquist_t=math.pi / float(delta), x=float(x), bits=bits, band=len(r) - 1, Nmax=Nmax,
               first_negative_n=neg, last_n=hist[-1][1] if hist[-1][0] == 'converged_at' else (neg if neg is not None else Nmax - 1), converged_early=(hist[-1][0] == 'converged_at'), max_reflection=kmx, symbol_negative_intervals=negset, symbol_step=math.pi / float(delta) / nt, symbol_signed_log10=lg[::max(1, len(lg) // 300)], pivots=[list(h) for h in (hist[:20] + hist[20::max(1, len(hist) // 60)] + hist[-3:])], elapsed=time.time() - t0)
    if neg is not None:
        ctx.prec = bits + 256
        K2 = make_kernel(name, eta_for(name, delta_s, 1), int((bits + 256) * 0.30103) - 20)
        r2 = Mx_table(K2, x, 1, len(r) - 1)
        q = quad_form(a, r2)
        res['recheck_quadratic_form'] = q.str(20); res['recheck_negative_certain'] = bool(q < 0)
        res['span'] = float(delta) * neg
        ts = [0.5 * i for i in range(0, int(2 * math.pi / float(delta)) + 1)]
        sp = spectrum(a, K2.eta, ts)
        im = max(range(len(sp)), key=lambda i: sp[i])
        res['predictor_log10_spectrum'] = [[t, round(s, 2)] for t, s in zip(ts, sp)][::max(1, len(ts) // 200)]
        # refine the peak
        tf = [ts[im] - 0.5 + 0.02 * i for i in range(51)]
        sf = spectrum(a, K2.eta, tf); jm = max(range(51), key=lambda i: sf[i])
        res['predictor_peak_t'] = tf[jm]; res['predictor_peak_log10'] = sf[jm]
    json.dump(res, open(os.path.join(outdir, 'lev_%s_%s%s.json' % (name, delta_s, tag)), 'w'), indent=1)
    print(json.dumps({k: v for k, v in res.items() if k not in ('pivots', 'predictor_log10_spectrum', 'symbol_signed_log10')}, indent=1), flush=True)

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'fixed':
        for nm in sys.argv[3:]: run_fixed(nm, int(sys.argv[2]), 'out')
    elif mode == 'lev':
        # lev NAME delta x Nmax bits [tag]
        run_lev(sys.argv[2], sys.argv[3], sys.argv[4], int(sys.argv[5]), int(sys.argv[6]), 'out', sys.argv[7] if len(sys.argv) > 7 else '')
