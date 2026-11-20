"""Combination 4: Pick pencil P_S(eps) of F'/F for the heat family F_{-eps} at nested real nodes; inertia by LDL^T in balls.
   P_ij = (phi(z_i) + phi(z_j)) / (z_i + z_j), phi = d/dz log F(1/2 + z), nodes z_k > 0 (s = 1/2 + z in (1/2, 4]).
   usage: combo4.py BITS NMAX OUT.json [family]      family: vdc (default) | geo | src
   Units: F_tau(z) = int e^{tau u^2/16} kappa(u) e^{zu/2} du, tau = -eps = de Bruijn-Newman time t (Lambda scale)."""
import sys, json, math, os, time
from multiprocessing import Pool
from flint import arb, acb, ctx, acb_series
import core, heatlib

def vdc(k):
    x = 0.0; f = 0.5
    while k: x += f * (k & 1); k >>= 1; f /= 2
    return x

def nodes(family, n):
    if family == 'vdc': return [arb(3.5) * arb(vdc(k)) for k in range(1, n + 1)]          # nested, dense in (0, 3.5)
    if family == 'geo': return [arb(3.5) * arb(2) ** (-k) for k in range(n)]            # lacunary (Blaschke) comparison
    if family == 'src': return [arb(1), arb(2), arb(4)][:n]
    raise ValueError

def ldl_pivots(P):
    """pivots of LDL^T without pivoting (leading principal minors ratios); stops when a pivot ball contains 0."""
    n = len(P); L = [[arb(0)] * n for _ in range(n)]; d = []
    for j in range(n):
        s = P[j][j]
        for k in range(j): s -= L[j][k] * L[j][k] * d[k]
        d.append(s)
        if s.contains(0): break
        for i in range(j + 1, n):
            t = P[i][j]
            for k in range(j): t -= L[i][k] * L[j][k] * d[k]
            L[i][j] = t / s
    return d

def summarize(d):
    out = []; nstar = None; undec = None
    for k, x in enumerate(d):
        if x.contains(0): undec = k + 1; break
        if x < 0 and nstar is None: nstar = k + 1
    neg = sum(1 for x in d if (not x.contains(0)) and x < 0)
    return dict(n_decided=len(d) if undec is None else undec - 1, n_star=nstar, undecided_at=undec, negatives=neg,
                log10_abs_pivots=[round(float(abs(x).log().mid()) / math.log(10), 2) if not x.contains(0) else None for x in d],
                signs=''.join('?' if x.contains(0) else ('+' if x > 0 else '-') for x in d),
                min_rel_accuracy_bits=min([int(x.rel_accuracy_bits()) for x in d if not x.contains(0)] or [0]))

def pick(phi, z):
    n = len(z)
    return [[(phi[i] + phi[j]) / (z[i] + z[j]) for j in range(n)] for i in range(n)]

def heat_job(a):
    bits, nmax, family, epss = a
    ctx.prec = bits
    H = heatlib.Heat(bits, 8.0)
    z = nodes(family, nmax); res = {}
    for eps in epss:
        t0 = time.time(); phi = []
        for zk in z:
            f, d = H.F(-eps, acb(zk), True); phi.append((d / f).real)
        dd = ldl_pivots(pick(phi, z)); r = summarize(dd); r['phi_first3'] = [float(p.mid()) for p in phi[:3]]; r['sec'] = time.time() - t0
        res['HEAT eps=%g' % eps] = r
        print('HEAT eps=%g' % eps, {k: r[k] for k in ('n_decided', 'n_star', 'undecided_at', 'negatives', 'min_rel_accuracy_bits')}, r['signs'], flush=True)
    return res

def closed_job(a):
    bits, nmax, family, code = a
    ctx.prec = bits
    z = nodes(family, nmax)
    if code == 'LCHI5':
        class L5:
            def completed(self, s):
                v = s.zeta(arb(1) / 5) - s.zeta(arb(2) / 5) - s.zeta(arb(3) / 5) + s.zeta(arb(4) / 5)
                return core._powconst(5 / arb.pi(), s / 2) * (s / 2).gamma() * v * core._powconst(5, -s)
        obj = L5()
    else: obj = core.by_code(code)
    phi = []
    for zk in z:
        s = acb_series([acb(zk) + arb(1) / 2, 1], prec=2)
        F = obj.completed(s); phi.append((F[1] / F[0]).real)
    dd = ldl_pivots(pick(phi, z)); r = summarize(dd); r['phi_first3'] = [float(p.mid()) for p in phi[:3]]
    print(code, {k: r[k] for k in ('n_decided', 'n_star', 'undecided_at', 'negatives', 'min_rel_accuracy_bits')}, r['signs'], flush=True)
    return {code: r}

if __name__ == '__main__':
    bits = int(sys.argv[1]); nmax = int(sys.argv[2]); out = sys.argv[3]; family = sys.argv[4] if len(sys.argv) > 4 else 'vdc'
    EPS = [0.0, 1e-6, 1e-4, 1e-2, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 30.0, 50.0, 100.0, 1000.0]
    CODES = ['ZETA', 'LCHI5', 'DH', 'TNR', 'EA-1/8', 'EA-1/4', 'EA-1/2']
    nw = int(os.environ.get('RH_WORKERS', '4'))
    jobs_h = [(bits, nmax, family, EPS[i::max(1, nw - 2)]) for i in range(max(1, nw - 2))]
    res = dict(bits=bits, nmax=nmax, family=family, nodes_z=[float(x.mid()) for x in nodes(family, nmax)])
    with Pool(nw) as p:
        rc = p.map_async(closed_job, [(bits, nmax, family, c) for c in CODES], chunksize=1)
        rh = p.map_async(heat_job, jobs_h, chunksize=1)
        for r in rc.get() + rh.get(): res.update(r)
    json.dump(res, open(out, 'w'), indent=1)
    print('DONE', out)
