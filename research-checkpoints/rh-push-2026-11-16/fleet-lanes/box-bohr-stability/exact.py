"""Exact stage (python-flint / Arb).  python exact.py <tasks.json> <out.jsonl>
Task kinds:
  win   : certified zero counts of a diagonal section in the window T1 < t < T2, |sigma-1/2| < Y.
          n_up (argument principle on eta < sigma-1/2 < Y), n_tot (full window, half contour x 2), n_real
          (certified sign changes).  FAIL iff n_up > 0;  PASS iff n_up == 0 and n_tot == n_real.
  s1zero: certified zero of the lifted Dirichlet factor in the OPEN unit polydisc (|w_p| < 1 for all p):
          all variables but one fixed at explicit points, univariate roots isolated by acb_poly.roots().
  s1pass: certified zero-freeness on the CLOSED unit polydisc for polys in <= 3 variables:
          interval subdivision on the torus + roots of the diagonal slice (DeCarlo-Murray-Saeks / Strintzis).
"""
import sys, json, math, os, time
from multiprocessing import Pool
from flint import arb, acb, acb_poly, ctx
import lylib as L

I = acb(0, 1)
CHI5 = {0: acb(0), 1: acb(1), 2: acb(0, 1), 3: acb(0, -1), 4: acb(-1)}


def c1_dh():
    return (1 - I * L.kappa_dh()) / 2


def make_F(spec):
    """spec: dict(scheme='afe'|'euler', inp, size, K).  Returns F(z), s = 1/2 + i z."""
    sch, inp, size = spec['scheme'], spec['inp'], spec['size']
    if sch == 'true':
        half0 = arb(1) / 2
        if inp == 'zeta':
            def Ft(z):
                s = half0 + I * z
                return L.Gz(s) * s.zeta()
            return Ft
        kp = L.kappa_dh()

        def Fd(z):
            s = half0 + I * z
            f = (-s * arb(5).log()).exp() * (s.zeta(arb(1) / 5) + kp * s.zeta(arb(2) / 5) - kp * s.zeta(arb(3) / 5) - s.zeta(arb(4) / 5))
            return L.Gfac('dh', s) * f
        return Fd
    if sch in ('afe', 'thalf') and not spec.get('phi'):
        return L.make_object(sch, inp, size)[0]
    if sch in ('afe', 'thalf'):
        # torus translate: coefficient a_n omega(n) in the direct part, a_n conj(omega(n)) in the reflected part,
        # omega completely multiplicative with omega(p) = exp(-i phi_p).  zeta-type gamma factor only.
        phi = {int(k): arb(v) for k, v in spec['phi'].items()}
        half = arb(1) / 2
        pi = arb.pi(); lp = pi.log()
        terms = []
        for n in range(1, size + 1):
            a = L.coef(inp, n)
            if a.is_zero():
                continue
            ang = arb(0)
            for p, k in L._factor(n).items():
                ang += k * phi.get(p, arb(0))
            om = (-I * ang).exp()
            terms.append((a * om, a * acb(om.real, -om.imag), arb(n).log(), acb(pi * n * n)))

        def g(s, Ln, x):
            if sch == 'afe':
                return L.Gz(s) * (-s * Ln).exp()
            return (-(s / 2) * lp - s * Ln).exp() * (2 * x.gamma_upper(s / 2 + 2) - 3 * x.gamma_upper(s / 2 + 1))

        def Fw(z):
            s = half + I * z
            r = acb(0)
            for c1, c2, Ln, x in terms:
                r += c1 * g(s, Ln, x) + c2 * g(1 - s, Ln, x)
            return r
        return Fw
    K = spec.get('K', 1)
    ps = L.primes_upto(size)
    half = arb(1) / 2
    kind = inp.split(':')[0]

    def loc(y):
        if K == 0:
            return 1 / (1 - y)
        f = acb(1); yy = acb(1)
        for _ in range(K):
            yy = yy * y; f = f + yy
        return f

    phis = {int(k): arb(v) for k, v in (spec.get('phi') or {}).items()}

    def E(s, sgn=-1):
        if sch == 'ladder':
            # additive twin ladder of PR 13 (sources/twin-ladder.js, weights beta = P = 0): sum_p sum_{m<=M} p^{-ms}
            r = acb(0)
            for p in ps:
                r += loc((-s * arb(p).log() + sgn * I * phis.get(p, arb(0))).exp())
            return r
        if kind == 'dh':
            a = acb(1); b = acb(1)
            for p in ps:
                if p == 5:
                    continue
                y = (-s * arb(p).log() + sgn * I * phis.get(p, arb(0))).exp()
                a *= loc(CHI5[p % 5] * y); b *= loc(CHI5[p % 5].conjugate() * y) if hasattr(acb, 'conjugate') else loc(acb(CHI5[p % 5].real, -CHI5[p % 5].imag) * y)
            c1 = c1_dh()
            return c1 * a + acb(c1.real, -c1.imag) * b
        r = acb(1)
        for p in ps:
            y = (-s * arb(p).log() + sgn * I * phis.get(p, arb(0))).exp()
            if kind == 'ea':
                a = L.ea_shift(inp); pa = (a * arb(p).log()).exp()
                if K == 0:
                    r *= 1 / ((1 - pa * y) * (1 - y / pa))
                else:
                    f = acb(1); yy = acb(1)
                    for j in range(1, K + 1):
                        yy = yy * y
                        cj = arb(0)
                        for i in range(j + 1):
                            cj += pa ** (2 * i - j)
                        f = f + cj * yy
                    r *= f
            else:
                e = {'zeta': 1, 'nr': 1, 'tw2m': -1 if p == 2 else 1, 'liou': -1}.get(kind)
                e = (arb(1) / 2 if p == 2 else arb(1)) if kind == 'tw2h' else arb(e)
                r *= loc(e * y)
        if kind == 'nr':
            q = arb(inp.split(':')[1]); cc = arb(inp.split(':')[2])
            r *= cc + 2 * ((s - half) * q.log()).cosh()
        return r

    def F(z):
        s = half + I * z
        return L.Gfac(inp, s) * E(s) + L.Gfac(inp, 1 - s) * E(1 - s, 1)
    return F


def cert_window(F, T1, T2, Y, eta=0.02, h=0.02, budget=3_000_000):
    cache, st = {}, {'budget': budget}
    c = complex
    out = {}
    d = (L.darg(F, c(T1, eta), c(T2, eta), cache, st) + L.darg(F, c(T2, eta), c(T2, Y), cache, st)
         + L.darg(F, c(T2, Y), c(T1, Y), cache, st) + L.darg(F, c(T1, Y), c(T1, eta), cache, st))
    out['n_up'] = L._round_count(d / (2 * math.pi))
    d2 = (L.darg(F, c(T2, 0), c(T2, eta), cache, st) + L.darg(F, c(T2, eta), c(T2, Y), cache, st)
          + L.darg(F, c(T2, Y), c(T1, Y), cache, st) + L.darg(F, c(T1, Y), c(T1, eta), cache, st)
          + L.darg(F, c(T1, eta), c(T1, 0), cache, st))
    out['n_tot'] = L._round_count(2 * d2 / (2 * math.pi))
    for hh in (h, h / 8, h / 64):
        n = int(math.ceil((T2 - T1) / hh)); last = 0; cnt = 0; und = 0
        for k in range(n + 1):
            v = F(acb(T1 + (T2 - T1) * k / n)).real
            sg = 1 if v > 0 else (-1 if v < 0 else 0)
            if sg == 0:
                und += 1; continue
            if last and sg != last:
                cnt += 1
            last = sg
        out['n_real'], out['undecided'] = cnt, und
        if cnt >= out['n_tot'] - 2 * out['n_up']:
            break
    if out['n_up'] > 0:
        out['verdict'] = 'FAIL'
    elif out['n_tot'] == out['n_real']:
        out['verdict'] = 'PASS'
    else:
        out['verdict'] = 'UNRESOLVED'
    out['boxes'] = st.get('box', 0)
    return out


def pt_window(F, T1, T2, Y, h=0.02):
    """Point-sampled version: n_real = certified sign changes (lower bound for real zeros); n_tot = winding of the
    half contour from point values (high precision, NOT interval-certified).  For objects whose ball enclosures
    on wide inputs are useless (incomplete-gamma forms)."""
    import cmath

    def unit(z):
        w = F(acb(z.real, z.imag))
        if w.contains(0):
            raise L.Unresolved('point enclosure contains 0 at %r' % (z,))
        a = max(abs(w.real.mid()), abs(w.imag.mid()))
        v = complex(w / a)
        return v / abs(v)

    def seg(a, b, n):
        pts = [a + (b - a) * k / n for k in range(n + 1)]
        vals = [unit(p) for p in pts]
        tot = 0.0; ms = 0.0
        stack = list(zip(pts[:-1], pts[1:], vals[:-1], vals[1:]))
        while stack:
            p, q, vp, vq = stack.pop()
            d = cmath.phase(vq / vp)
            if abs(d) > 0.5 and abs(q - p) > 1e-6:
                m = (p + q) / 2; vm = unit(m)
                stack.append((p, m, vp, vm)); stack.append((m, q, vm, vq))
            else:
                tot += d; ms = max(ms, abs(d))
        return tot, ms
    c = complex
    out = {}
    tot = 0.0; ms = 0.0
    for a, b in ((c(T2, 0), c(T2, Y)), (c(T2, Y), c(T1, Y)), (c(T1, Y), c(T1, 0))):
        d, m = seg(a, b, max(8, int(abs(b - a) / h)))
        tot += d; ms = max(ms, m)
    w = 2 * tot / (2 * math.pi)
    out['n_tot'] = int(round(w)); out['wind_frac'] = round(w - round(w), 5); out['maxstep'] = round(ms, 3)
    for hh in (h, h / 8, h / 64):
        n = int(math.ceil((T2 - T1) / hh)); last = 0; cnt = 0
        for k in range(n + 1):
            v = F(acb(T1 + (T2 - T1) * k / n)).real
            sg = 1 if v > 0 else (-1 if v < 0 else 0)
            if sg and last and sg != last:
                cnt += 1
            if sg:
                last = sg
        out['n_real'] = cnt
        if cnt >= out['n_tot']:
            break
    out['verdict'] = 'PASS_screened_total' if out['n_tot'] == out['n_real'] else ('FAIL_screened_total' if out['n_tot'] > out['n_real'] else 'UNRESOLVED')
    return out


def d_window(spec, T1, T2, X=3.0, x0=0.0, budget=600000):
    """Certified number of zeros of the Dirichlet factor D_N(s) = sum_{n<=N} a_n n^{-s} (sharp AFE main sum) in
    1/2 + x0 < Re s < 1/2 + X, T1 < t < T2 (argument principle, Arb enclosures on every contour piece)."""
    N, inp = spec['size'], spec['inp']
    phi = {int(k): arb(v) for k, v in (spec.get('phi') or {}).items()}

    def om(n):
        ang = arb(0)
        for p, k in L._factor(n).items():
            ang += k * phi.get(p, arb(0))
        return (-I * ang).exp()
    terms = [(arb(n).log(), L.coef(inp, n)) for n in range(1, N + 1)]
    terms = [(Ln, acb(c) * om(n + 1)) for n, (Ln, c) in enumerate(terms) if not c.is_zero()]
    half = arb(1) / 2

    def D(z):
        s = half + I * z
        r = acb(0)
        for Ln, c in terms:
            r += c * (-s * Ln).exp()
        return r
    cache, st = {}, {'budget': budget}
    c = complex
    # z = t - i x ; rectangle t in [T1,T2], x in [x0, X]  (counterclockwise in z: lower edge first)
    d = (L.darg(D, c(T1, -X), c(T2, -X), cache, st) + L.darg(D, c(T2, -X), c(T2, -x0), cache, st)
         + L.darg(D, c(T2, -x0), c(T1, -x0), cache, st) + L.darg(D, c(T1, -x0), c(T1, -X), cache, st))
    n = L._round_count(d / (2 * math.pi))
    return {'n_right': n, 'verdict': 'PASS' if n == 0 else 'FAIL', 'boxes': st.get('box', 0)}


# ---------------------------------------------------------------- exact polys
def exact_poly(spec):
    """list of (coefficient acb, exponent dict p->k) for the lifted Dirichlet factor in w_p = sqrt(p) z_p."""
    sch, inp, size = spec['scheme'], spec['inp'], spec['size']
    if sch == 'afe':
        out = []
        wts = L.weights(spec.get('weight', 'sharp'), size)
        for n in range(1, size + 1):
            a = L.coef(inp, n) * wts[n]
            if a.is_zero():
                continue
            out.append((acb(a / arb(n).sqrt()), L._factor(n)))
        return out
    K = spec.get('K', 1)
    assert inp == 'dh'
    ps = [p for p in L.primes_upto(size) if p != 5]

    def expand(conj):
        terms = [(acb(1), {})]
        for p in ps:
            ch = CHI5[p % 5]
            if conj:
                ch = acb(ch.real, -ch.imag)
            sq = arb(p).sqrt()
            fac = {0: acb(1), 1: -acb(ch.real, -ch.imag) / sq} if K == 0 else {j: (ch / sq) ** j for j in range(K + 1)}
            new = []
            for cc, e in terms:
                for k, a in fac.items():
                    e2 = dict(e)
                    if k:
                        e2[p] = k
                    new.append((cc * a, e2))
            terms = new
        return terms
    A, Bq = expand(False), expand(True)
    c1 = c1_dh(); c2 = acb(c1.real, -c1.imag)
    return [(c1 * a[0] + c2 * b[0], a[1]) for a, b in zip(A, Bq)]


def eval_poly(terms, w):
    r = acb(0)
    for cc, e in terms:
        t = cc
        for p, k in e.items():
            t = t * w[p] ** k
        r += t
    return r


def s1_zero(spec, x, th, primes):
    """Certify a zero in the open unit polydisc near w_p = p^{-x} e^{-i th_p}."""
    terms = exact_poly(spec)
    w = {p: (-(arb(x) * arb(p).log()) - I * arb(t)).exp() for p, t in zip(primes, th)}
    best = None
    for q in primes:
        deg = max(e.get(q, 0) for _, e in terms)
        if deg == 0:
            continue
        co = [acb(0)] * (deg + 1)
        for cc, e in terms:
            t = cc
            for p, k in e.items():
                if p != q:
                    t = t * w[p] ** k
            co[e.get(q, 0)] += t
        try:
            roots = acb_poly(co).roots()
        except Exception as ex:
            continue
        for r in roots:
            a = abs(r)
            if a < 1:
                others = max(float(abs(w[p]).upper()) for p in primes if p != q) if len(primes) > 1 else 0.0
                cand = dict(var=q, root=[float(r.real.mid()), float(r.imag.mid())], root_rad=float(r.rad()),
                            abs_root_upper=float(a.upper()), max_abs_other_vars_upper=others)
                if best is None or cand['abs_root_upper'] < best['abs_root_upper']:
                    best = cand
    if best is None:
        return {'verdict': 'UNRESOLVED'}
    best['verdict'] = 'ZERO_IN_OPEN_POLYDISC' if best['abs_root_upper'] < 1 and best['max_abs_other_vars_upper'] < 1 else 'UNRESOLVED'
    best['x'] = x
    return best


def s1_pass(spec, budget=400000):
    terms = exact_poly(spec)
    primes = sorted({p for _, e in terms for p in e})
    m = len(primes)
    if m > 3:
        return {'verdict': 'SKIPPED', 'why': 'more than 3 variables'}
    # diagonal slice
    deg = max(sum(e.values()) for _, e in terms)
    co = [acb(0)] * (deg + 1)
    for cc, e in terms:
        co[sum(e.values())] += cc
    roots = acb_poly(co).roots()
    mind = min(float(abs(r).lower()) for r in roots) if roots else math.inf
    if not all(abs(r) > 1 for r in roots):
        return {'verdict': 'UNRESOLVED', 'why': 'diagonal slice root not certified outside the closed disc', 'min_abs_diag_root': mind}
    # torus by subdivision; boxes in th in [0, 2 pi]^m
    twopi = 2 * arb.pi()
    stack = [tuple((0.0, 1.0) for _ in range(m))]
    nb = 0; minlow = math.inf
    while stack:
        box = stack.pop(); nb += 1
        if nb > budget:
            return {'verdict': 'UNRESOLVED', 'why': 'budget'}
        w = {}
        for p, (a, b) in zip(primes, box):
            ang = twopi * arb((a + b) / 2, (b - a) / 2)
            w[p] = (I * ang).exp()
        v = eval_poly(terms, w)
        if not v.contains(0):
            minlow = min(minlow, float(abs(v).abs_lower()))
            continue
        j = max(range(m), key=lambda i: box[i][1] - box[i][0])
        a, b = box[j]
        if b - a < 1e-9:
            return {'verdict': 'UNRESOLVED', 'why': 'zero on torus suspected', 'box': box}
        mid = (a + b) / 2
        stack.append(box[:j] + ((a, mid),) + box[j + 1:]); stack.append(box[:j] + ((mid, b),) + box[j + 1:])
    return {'verdict': 'ZERO_FREE_ON_CLOSED_POLYDISC', 'boxes': nb, 'min_abs_torus_lower': minlow, 'min_abs_diag_root': mind, 'vars': primes}


def run(task):
    ctx.prec = task.get('prec', 128)
    t0 = time.time()
    try:
        if task['kind'] == 'win':
            r = cert_window(make_F(task), task['T1'], task['T2'], task.get('Y', 1.0), eta=task.get('eta', 0.02), h=task.get('h', 0.02), budget=task.get('budget', 3000000))
        elif task['kind'] == 'dwin':
            r = d_window(task, task['T1'], task['T2'], x0=task.get('x0', 0.0))
        elif task['kind'] == 'winpt':
            r = pt_window(make_F(task), task['T1'], task['T2'], task.get('Y', 1.0))
        elif task['kind'] == 's1zero':
            r = s1_zero(task, task['x'], task['th'], task['primes'])
        else:
            r = s1_pass(task)
    except L.Unresolved as e:
        r = {'verdict': 'UNRESOLVED', 'why': str(e)}
    except Exception as e:  # noqa
        r = {'verdict': 'ERROR', 'why': repr(e)}
    r['wall'] = round(time.time() - t0, 1)
    return dict(task=task, result=r)


if __name__ == '__main__':
    tasks = json.load(open(sys.argv[1]))
    done = set()
    if os.path.exists(sys.argv[2]):
        for ln in open(sys.argv[2]):
            try:
                done.add(json.dumps({k: v for k, v in json.loads(ln)['task'].items() if k != 'budget'}, sort_keys=True))
            except Exception:
                pass
    tasks = [t for t in tasks if json.dumps({k: v for k, v in t.items() if k != 'budget'}, sort_keys=True) not in done]
    nw = int(os.environ.get('RH_WORKERS', '2'))
    print('tasks', len(tasks), 'workers', nw, flush=True)
    with Pool(nw) as pool, open(sys.argv[2], 'a') as fo:
        for r in pool.imap_unordered(run, tasks, chunksize=1):
            fo.write(json.dumps(r) + '\n'); fo.flush()
            t = r['task']
            print({k: v for k, v in t.items() if k not in ('th', 'primes')}, r['result'], flush=True)
    print('EXACT DONE', flush=True)
