"""Stage 2b: ball-arithmetic refinement of the off-line candidates of heat_fill_a.py.
F_tau(z) = h sum_j g(y_j) F_0(z + i y_j), y_j = j h, h = 0.05, |y_j| <= 7.5, g = density of N(0, |tau|/2), F_0(z) = xi(1/2+z)/2
(trapezoid rule for an entire integrand: discretisation error below e^(-2 pi^2 s2/h^2); tail below 1e-40 relative; neither is
enclosed in the ball: MEASURED). Newton on midpoints at 192 bits until |dz| < 1e-33; residual |F/F'| from balls.
Usage: python heat_fill_b.py <heat_a.json> <zeros_HEAT.json (table)> <out.json> [workers]"""
import sys, json, math, time, multiprocessing as mp
from flint import acb, arb, ctx, acb_series
PREC = 192; HH = 0.05; J = 150
_tau = None; _g = None
def init(tau):
    global _tau, _g
    ctx.prec = PREC; _tau = tau; s2 = abs(arb(str(tau))) / 2          # decimal string: arb(0.1) would be the binary float
    _g = [((-(arb(j) / 20) ** 2 / (2 * s2)).exp() / (2 * arb.pi() * s2).sqrt() / 20, arb(j) / 20) for j in range(-J, J + 1)]
def F(z, deriv=True):
    f = acb(0); d = acb(0)
    for g, y in _g:
        s = acb(1) / 2 + z + acb(0, y)
        x = acb_series([s, 1], prec=2)
        v = x * (x - 1) / 2 * (-(x / 2) * arb.pi().log()).exp() * (x / 2).gamma() * x.zeta()
        f += g * v[0]; d += g * v[1]
    return f, d
def newton(c):
    x0, t0 = c[0], c[1]
    starts = [(x0, t0)] if c[2] != 0 else [(0.03, t0), (0.01, t0), (0.045, t0)]
    for xs, ts in starts:
        z = acb(xs, ts); ok = False
        for it in range(40):
            f, d = F(z); dz = f / d
            z = acb(z.real.mid(), z.imag.mid()) - acb(dz.real.mid(), dz.imag.mid())
            if abs(float(z.imag.mid()) - t0) > 0.6 or abs(float(z.real.mid())) > 3.5: break
            if abs(dz) < arb(10) ** -33: ok = True; break
        if ok:
            f, d = F(z)
            return [c, abs(z.real).str(34, radius=False), z.imag.str(34, radius=False), float((abs(f) / abs(d)).upper()), it]
    return [c, None, None, None, None]
if __name__ == '__main__':
    A = json.load(open(sys.argv[1])); old = json.load(open(sys.argv[2])); tau = A['tau']; Wk = int(sys.argv[4]) if len(sys.argv) > 4 else 6
    T0 = time.time()
    bad = [(b['a'], b['b']) for b in A['boxes'] if b['deficit'] != 0]
    ax = [c for c in A['axis'] if any(a < c[1] < b for a, b in bad)]
    near = [[float(o[0]), float(o[1]), 2] for o in old['offline'] if float(o[0]) < 0.05 and float(o[1]) > A['t_first']]
    tasks = A['cand'] + ax + near
    print('table pairs with Re z < 0.05 restarted from the table value:', len(near), flush=True)
    print('tau', tau, 'candidates: %d cells, %d axis minima in boxes with a deficit' % (len(A['cand']), len(ax)), flush=True)
    with mp.get_context('fork').Pool(Wk, initializer=init, initargs=(tau,)) as p:
        res = p.map(newton, tasks, chunksize=2)
    roots = []; fail = 0; online_hits = 0
    for c, re_, im_, r, it in res:
        if re_ is None:
            if c[2] != 0: fail += 1
            continue
        if float(re_) < 1e-9: online_hits += 1; continue
        if all(abs(float(re_) - float(q[0])) + abs(float(im_) - float(q[1])) > 1e-9 for q in roots): roots.append([re_, im_, r])
    roots.sort(key=lambda q: float(q[1]))
    print('refined: %d distinct off-line zeros with Re z > 0; cell candidates without convergence: %d; axis starts that fell on the line: %d; %.0f s'
          % (len(roots), fail, online_hits, time.time() - T0), flush=True)
    tab = old['offline']; mx = 0.0; matched = 0; new = []
    for q in roots:
        dd = [abs(float(q[0]) - float(o[0])) + abs(float(q[1]) - float(o[1])) for o in tab]
        k = min(range(len(dd)), key=dd.__getitem__) if dd else None
        if k is not None and dd[k] < 1e-6:
            init(tau); dz = abs(arb(q[0]) - arb(tab[k][0])) + abs(arb(q[1]) - arb(tab[k][1])); mx = max(mx, float(dz.upper())); matched += 1
        else: new.append(q)
    lost = [o for o in tab if all(abs(float(q[0]) - float(o[0])) + abs(float(q[1]) - float(o[1])) > 1e-6 for q in roots) and float(o[1]) > A['t_first']]
    print('table pairs %d; matched %d (largest |difference| %.2e); new pairs %d; table pairs above t = %.2f not found here: %d' % (len(tab), matched, mx, len(new), A['t_first'], len(lost)))
    for q in new: print('  new', q[0][:22], q[1][:24], '%.1e' % q[2])
    # box balance with the new list
    allp = roots + [o for o in tab if float(o[1]) <= A['t_first']]
    defs = [b['count'] - b['online'] - 2 * sum(1 for q in roots if b['a'] < float(q[1]) < b['b']) for b in A['boxes']]
    print('sum over boxes: count %d, on-line %d, pairs %d' % (sum(b['count'] for b in A['boxes']), sum(b['online'] for b in A['boxes']), sum(1 for q in roots if A['boxes'][0]['a'] < float(q[1]) < A['boxes'][-1]['b'])))
    print('boxes: %d; boxes with count != on-line + 2 pairs after the fill: %d' % (len(defs), sum(1 for x in defs if x != 0)))
    json.dump(dict(tau=tau, roots=roots, new=new, lost=lost, matched=matched, max_difference_from_table=mx, box_deficits_after=defs, max_residual=max(q[2] for q in roots)), open(sys.argv[3], 'w'), indent=0)
