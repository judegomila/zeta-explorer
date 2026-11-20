"""Lane s6-flow-grade-kappa-landing-heatop, shared: Taylor coefficients of completed functions at the centre of the strip.
Variable: s = 1/2 + i w.  Xi_F(w) = int_R K_F(v) e^{i w v} dv, K_F real and even.
  zeta:   K(v) = sum_n (4 pi^2 n^4 e^{9v/2} - 6 pi n^2 e^{5v/2}) exp(-pi n^2 e^{2v})                 (Xi = xi(1/2 + i w))
  odd q:  K(v) = 2 e^{3v/2} sum_n a(n) n exp(-pi n^2 e^{2v}/q)       (L4: chi_-4; DH: a = (1, k, -k, -1, 0) mod 5)
  even q: K(v) = 2 e^{v/2}  sum_n a(n)   exp(-pi n^2 e^{2v}/q)       (L5: real character mod 5)
Moments M_j = int_R K(v) g(v) v^j dv by the trapezoid rule on v >= 0 (step h; the integrand is analytic in a strip and the
error is controlled by comparing two steps).  Variants g: heat e^{t v^2/4} (t = de Bruijn time, z = 2w, d_t H = -H_zz),
tilt e^{a v} (all j; Xi(w - i a)).
Output: pickle {name: [python ints m_j * 2^prec ...]} with j = 0, 2, 4, .. (even variants) or 0, 1, 2, .. (tilt)."""
import sys, os, math, time, pickle
from multiprocessing import Pool
from flint import arb, ctx, fmpz

def dh_kappa():
    return ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)

def coeff_table(obj):
    """(q, parity, list a(n) for n = 0..q-1)"""
    if obj == 'ZETA': return None
    if obj == 'L4': return 4, 1, [0, 1, 0, -1]
    if obj == 'L5': return 5, 0, [0, 1, -1, -1, 1]
    if obj == 'L3': return 3, 1, [0, 1, -1]
    if obj == 'DH':
        k = dh_kappa(); return 5, 1, [0, 1, k, -k, -1]
    raise ValueError(obj)

def K(obj, v):
    """kernel value at v (arb), current precision.  Version 2 (2026-11-20): the cut of the theta sum is relative to its first term.
    Version 1 cut at an absolute size 2^-(prec+40) e^-60, which sets K = 0 beyond v_cut = (1/2) log((lim + 60) q/pi) and truncates the
    high moments (tables mom_main.pkl, mom_local.pkl: see jl.Tables.arbs for the resulting error radius)."""
    prec = ctx.prec; pi = arb.pi(); x = (2 * v).exp()
    lim = (prec + 40) * math.log(2)
    if obj == 'ZETA':
        s = arb(0); n = 1; x94 = (v * 9 / 2).exp(); x54 = (v * 5 / 2).exp()
        while True:
            e = pi * n * n * x
            if n > 1 and float((pi * (n * n - 1) * x).mid()) > lim + 60: break
            s += (4 * pi * pi * n ** 4 * x94 - 6 * pi * n * n * x54) * (-e).exp(); n += 1
        return s
    q, par, a = coeff_table(obj)
    s = arb(0); n = 1
    while True:
        e = pi * n * n * x / q
        if n > 1 and float((pi * (n * n - 1) * x / q).mid()) > lim + 60: break
        c = a[n % q]
        if not (isinstance(c, int) and c == 0):
            s += c * (n if par else 1) * (-e).exp()
        n += 1
    return 2 * s * (v * (3 if par else 1) / 2).exp()

def _work(args):
    obj, variants, i0, i1, h_num, h_den, jmax, prec = args
    ctx.prec = prec + 64
    sums = [None] * len(variants)
    for vi, (kind, par) in enumerate(variants):
        sums[vi] = [arb(0)] * (jmax // 2 + 1 if kind == 'heat' else jmax + 1)
        sums[vi] = list(sums[vi])
    for i in range(i0, i1):
        v = arb(i) * h_num / h_den
        k = K(obj, v) * h_num / h_den
        if i == 0: k = k / 2
        v2 = v * v
        for vi, (kind, par) in enumerate(variants):
            S = sums[vi]
            if kind == 'heat':
                c = 2 * k * (arb(par[0]) / par[1] * v2 / 4).exp() if par[0] else 2 * k
                p = c
                for j in range(len(S)):
                    S[j] += p; p *= v2
            else:
                ea = (arb(par[0]) / par[1] * v).exp(); cp = k * (ea + 1 / ea); cm = k * (ea - 1 / ea)
                pe = cp; po = cm * v
                for j in range(0, len(S) - 1, 2):
                    S[j] += pe; S[j + 1] += po; pe *= v2; po *= v2
                if len(S) % 2: S[-1] += pe
    sc = arb(2) ** prec
    out = [[int((x.mid() * sc).floor().unique_fmpz()) for x in S] for S in sums]
    return out

def moments(obj, variants, jmax, prec, h_den, vmax, workers, chunk=64):
    """variants: list of ('heat', (num, den)) [t = num/den] or ('tilt', (num, den)) [a = num/den]; returns list of int lists (scaled 2^prec)"""
    N = int(vmax * h_den) + 1
    jobs = [(obj, variants, a, min(a + chunk, N), 1, h_den, jmax, prec) for a in range(0, N, chunk)]
    tot = None; t0 = time.time()
    with Pool(workers) as p:
        for n, r in enumerate(p.imap_unordered(_work, jobs)):
            if tot is None: tot = r
            else:
                for a, b in zip(tot, r):
                    for j in range(len(a)): a[j] += b[j]
            if n % max(1, len(jobs) // 10) == 0: print('  %s chunk %d/%d %.0fs' % (obj, n + 1, len(jobs), time.time() - t0), flush=True)
    return tot

def vmax_for(obj, jmax, prec):
    """v beyond which K(v) v^jmax is below 2^-(prec) of its maximum"""
    q = 1 if obj == 'ZETA' else coeff_table(obj)[0]
    f = lambda v: jmax * math.log(max(v, 1e-9)) - math.pi * math.exp(2 * v) / q + 4.5 * v
    vs = [0.01 * i for i in range(1, 1500)]; fm = max(f(v) for v in vs)
    for v in vs[::-1]:
        if f(v) > fm - (prec + 64) * math.log(2) - 50: return v + 0.02
    return 2.0

if __name__ == '__main__':
    # mom.py OUT PREC JMAX HDEN WORKERS OBJ[:variant,variant..] ...   variant: h<num>/<den> or a<num>/<den>
    out, prec, jmax, hden, workers = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
    res = dict(prec=prec, jmax=jmax, hden=hden, tables={}, kversion=2)
    if os.path.exists(out): res = pickle.load(open(out, 'rb'))
    for spec in sys.argv[6:]:
        obj, _, vs = spec.partition(':')
        variants = []
        for s in (vs.split(',') if vs else ['h0/1']):
            num, den = s[1:].split('/'); variants.append(('heat' if s[0] == 'h' else 'tilt', (int(num), int(den))))
        vmax = vmax_for(obj, jmax, prec); N = int(vmax * hden) + 1
        print('%s variants %s: nodes %d (h = 1/%d, vmax %.2f), jmax %d, prec %d bits; multiplications about %.2e; result memory %.1f MB'
              % (obj, variants, N, hden, vmax, jmax, prec, N * jmax * len(variants) * 1.0, sum(jmax * prec / 8e6 for _ in variants)), flush=True)
        t0 = time.time()
        tabs = moments(obj, variants, jmax, prec, hden, vmax, workers)
        for (kind, par), tab in zip(variants, tabs):
            res['tables']['%s|%s|%d/%d' % (obj, kind, par[0], par[1])] = tab
        print('%s done %.0fs' % (obj, time.time() - t0), flush=True)
        pickle.dump(res, open(out + '.tmp', 'wb')); os.replace(out + '.tmp', out)
