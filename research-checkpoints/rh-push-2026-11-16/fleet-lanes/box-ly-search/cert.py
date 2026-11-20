#!/usr/bin/env python3
"""Certified (Arb) tests for the objects screened by fscreen.  python cert.py <tasks.jsonl> <out.jsonl>
Task: {mode:'fail'|'pass', scheme, input, size, weight, ...}
  fail: x, B, Y, eta  -> certified zero count in the rectangle [x, x+B] x [e, Y] for e = eta, eta/8, eta/64.
        count >= 1 is a certified zero off the real axis (verdict FAIL).
  pass: T0, T1, Y, eta -> for consecutive blocks of length Bc: certified n_up = 0 in [x1,x2] x [eta,Y], certified
        n_band = zeros in |Im z| < eta (symmetric contour), certified sign changes n_real; block passes iff
        n_up = 0 and n_band = n_real (then all zeros in the block window are real and simple).
Parallel over RH_WORKERS processes; resumable; one JSON line per task."""
import json, math, os, sys, time
import multiprocessing as mp
import lylib as L
from flint import arb, acb, ctx


def arb_weights(kind, N):
    LN = arb(N + 1).log()
    out = [arb(0)]
    for n in range(1, N + 1):
        lg = arb(n).log() / LN
        if kind == 'sharp':
            w = arb(1)
        elif kind.startswith('riesz'):
            w = (1 - lg) ** int(kind[5:])
        elif kind.startswith('lin'):
            w = (1 - arb(n) / (N + 1)) ** int(kind[3:])
        elif kind == 'cos':
            w = (arb.pi() / 2 * lg).cos() ** 2
        elif kind.startswith('gaus'):
            w = (-arb(kind[4:]) * lg * lg).exp()
        elif kind == 'selb':
            w = 2 * (1 - lg)
            w = arb(1) if w > 1 else (w if w < 1 else None)
            if w is None:
                raise ValueError('selb weight undecided at n=%d' % n)
        else:
            raise ValueError(kind)
        out.append(w)
    return out


def arb_coef(inp, n):
    if inp == 'chi4':
        return arb([0, 1, 0, -1][n % 4])
    if inp == 'tw3m':
        return arb((-1) ** L._factor(n).get(3, 0))
    return L.coef(inp, n)


def Gfac(inp, s):
    if inp == 'chi4':
        return ((s / 2) * (arb(4) / arb.pi()).log()).exp() * ((s + 1) / 2).gamma()
    return L.Gfac('zeta' if inp == 'tw3m' else inp, s)


def logGz(s):
    return s.log() + (s - 1).log() - arb(2).log() - (s / 2) * arb.pi().log() + (s / 2).lgamma()


def logG(inp, s):
    """A branch of log G(s) (any branch: only exp(logG - c0) is used)."""
    k = inp.split(':')[0]
    if k == 'dh':
        return (s / 2) * (arb(5) / arb.pi()).log() + ((s + 1) / 2).lgamma()
    if k == 'chi4':
        return (s / 2) * (arb(4) / arb.pi()).log() + ((s + 1) / 2).lgamma()
    if k == 'ea':
        a = arb(inp.split(':')[1])
        return logGz(s + a) + logGz(s - a)
    return logGz(s)


def make(t, xmid=None):
    """Arb object F(z) for a task (afe/afep with the weights of fscreen; euler through lylib).
    With xmid given, the object is F / exp(c0), c0 = Re log G(1/2 + i xmid) rounded to a float (a positive
    constant factor: same zeros), evaluated through log G so that the working precision does not grow with
    the height."""
    sch, inp, N = t['scheme'], t['input'], t['size']
    if sch == 'euler':
        return L.make_object('euler', inp, N)[0]
    w = arb_weights(t.get('weight', 'sharp'), N)
    corr = []
    if sch == 'afep':
        wt = t.get('weight', 'sharp')
        kk = 0 if wt == 'sharp' else int(wt[5:])
        k0 = inp.split(':')[0]
        if k0 == 'ea':
            a = arb(inp.split(':')[1])
            pl = [(1 + a, (1 + 2 * a).zeta()), (1 - a, (1 - 2 * a).zeta())]
        else:
            pl = {'zeta': [(arb(1), arb(1))], 'tw2m': [(arb(1), arb(1) / 3)], 'tw2h': [(arb(1), arb(2) / 3)],
                  'tw3m': [(arb(1), arb(1) / 2)], 'dh': [], 'chi4': []}[k0]
        lM = arb(N + 1).log()
        corr = [(b, r * arb(math.factorial(kk)) / lM ** kk, kk, lM) for b, r in pl]
    terms = [(arb(n).log(), w[n] * arb_coef(inp, n)) for n in range(1, N + 1)]
    terms = [(lg, c) for lg, c in terms if not c.is_zero()]
    half, I = arb(1) / 2, acb(0, 1)
    c0 = None
    if xmid is not None:
        c0 = arb(float(logG(inp, acb(half, arb(xmid))).real.mid()))

    def A(s):
        D = acb(0)
        for lg, c in terms:
            D += c * (-s * lg).exp()
        for b, cc, kk, lM in corr:
            D -= cc * ((b - s) * lM).exp() / (b - s) ** (kk + 1)
        if c0 is not None:
            return (logG(inp, s) - c0).exp() * D
        return Gfac(inp, s) * D

    def F(z):
        s = half + I * z
        return A(s) + A(1 - s)
    return F


def rect_count(F, x1, x2, y1, y2, budget):
    cache, stats = {}, {'budget': budget}
    c = complex
    tot = (L.darg(F, c(x1, y1), c(x2, y1), cache, stats) + L.darg(F, c(x2, y1), c(x2, y2), cache, stats)
           + L.darg(F, c(x2, y2), c(x1, y2), cache, stats) + L.darg(F, c(x1, y2), c(x1, y1), cache, stats))
    return L._round_count(tot / (2 * math.pi)), stats.get('box', 0)


def band_count(F, x1, x2, eta, budget):
    cache, stats = {}, {'budget': budget}
    c = complex
    tot = (L.darg(F, c(x2, 0), c(x2, eta), cache, stats) + L.darg(F, c(x2, eta), c(x1, eta), cache, stats)
           + L.darg(F, c(x1, eta), c(x1, 0), cache, stats))
    return L._round_count(2 * tot / (2 * math.pi))


def real_changes(F, x1, x2, h):
    n = max(1, int(math.ceil((x2 - x1) / h)))
    last, cnt = 0, 0
    for k in range(n + 1):
        v = F(acb(x1 + (x2 - x1) * k / n)).real
        sg = 1 if v > 0 else (-1 if v < 0 else 0)
        if sg and last and sg != last:
            cnt += 1
        if sg:
            last = sg
    return cnt


def run(t):
    t0 = time.time()
    budget = int(os.environ.get('RH_BOX_BUDGET', 4_000_000))
    try:
        if t['mode'] == 'fail':
            x1, x2 = t['x'], t['x'] + t.get('B', 1.0)
            hi = x2 > 150 and t['scheme'] != 'euler'
            ctx.prec = (200 + int(math.log2(x2 + 2)) + int(0.6 * (x2 - x1))) if hi else 160 + int(1.5 * abs(x2))
            F = make(t, (x1 + x2) / 2) if hi else make(t)
            last = None
            for e in (t.get('eta', 0.02), t.get('eta', 0.02) / 8, t.get('eta', 0.02) / 64):
                for sh in (0.0, 0.0137):
                    try:
                        n, boxes = rect_count(F, x1 - sh, x2 + sh, e, t['Y'], budget)
                    except L.Unresolved as ex:
                        last = str(ex)
                        continue
                    if n >= 1:
                        return dict(verdict='FAIL', zeros_above=n, rect=[x1 - sh, x2 + sh, e, t['Y']], prec=ctx.prec,
                                    seconds=round(time.time() - t0, 2))
                    last = 'count 0 above %g' % e
                    break
            return dict(verdict='NOT_CONFIRMED', why=last, prec=ctx.prec, seconds=round(time.time() - t0, 2))
        T0, T1, Bc, eta, Y = t['T0'], t['T1'], t.get('Bc', 4.0), t.get('eta', 0.02), t['Y']
        hi = T1 > 150 and T0 > 20 and t['scheme'] != 'euler'
        ctx.prec = (200 + int(math.log2(T1 + 2)) + int(0.6 * (T1 - T0))) if hi else 160 + int(1.5 * abs(T1))
        F = make(t, (T0 + T1) / 2) if hi else make(t)
        x, nreal, bad, unres = T0, 0, [], []
        while x < T1 - 1e-9:
            x2 = min(T1, x + Bc)
            ok = False
            for sh in (0.0, 0.0171, -0.0293):
                xe = x2 + (sh if x2 < T1 else 0.0)
                try:
                    nu, _ = rect_count(F, x, xe, eta, Y, budget)
                    if nu != 0:
                        bad.append([x, xe, nu])
                        ok = True
                        break
                    nb = band_count(F, x, xe, eta, budget)
                    nr = real_changes(F, x, xe, 0.05)
                    if nr != nb:
                        nr = real_changes(F, x, xe, 0.05 / 16)
                    if nr != nb:
                        bad.append([x, xe, 'band %d real %d' % (nb, nr)])
                    nreal += nr
                    ok = True
                    break
                except L.Unresolved as ex:
                    last = str(ex)
            if not ok:
                unres.append([x, x2, last])
                xe = x2
            x = xe
        v = 'FAIL' if any(isinstance(b[2], int) for b in bad) else ('UNRESOLVED' if (bad or unres) else 'PASS')
        return dict(verdict=v, n_real=nreal, bad=bad[:10], unresolved=unres[:10], prec=ctx.prec,
                    seconds=round(time.time() - t0, 2))
    except Exception as ex:                                  # noqa
        import traceback
        return dict(verdict='ERROR', why=repr(ex), trace=traceback.format_exc()[-800:])


def work(t):
    return t, run(t)


def main():
    tasks = [json.loads(l) for l in open(sys.argv[1]) if l.strip()]
    out = sys.argv[2]
    key = lambda t: json.dumps(t, sort_keys=True, separators=(',', ':'))
    done = set()
    if os.path.exists(out):
        for l in open(out):
            try:
                done.add(json.loads(l)['key'])
            except ValueError:
                pass
    todo = [t for t in tasks if key(t) not in done]
    W = int(os.environ.get('RH_WORKERS', '4'))
    print('[cert] tasks=%d todo=%d workers=%d' % (len(tasks), len(todo), W), flush=True)
    f = open(out, 'a')
    with mp.get_context('fork').Pool(W, maxtasksperchild=20) as pool:
        for i, (t, res) in enumerate(pool.imap_unordered(work, todo)):
            f.write(json.dumps(dict(key=key(t), task=t, res=res)) + '\n')
            f.flush()
            print('[cert %d/%d] %s %s %s' % (i + 1, len(todo), res.get('verdict'), key(t), res.get('seconds')), flush=True)
    print('[cert] finished', flush=True)


if __name__ == '__main__':
    main()
