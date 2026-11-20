# Backward-heat control for (I2). MEASURED only: M_t is evaluated by a fixed Gauss-Legendre rule in mpmath (60 digits) and passed
# to the ball LDL as midpoints; the quadrature error is not enclosed. Accepted sign statements: pivots with relative size > 1e-30.
# Planned memory: < 100 MB per worker.
import sys, os, json, random, math, time
from multiprocessing import Pool
import mpmath as mp
from flint import acb, arb, ctx
import k2
from heat import Heat
_H = {}
def getH(t):
    if t not in _H: _H[t] = Heat(t, dps=60)
    return _H[t]
def to_acb(z):
    return acb(arb(mp.nstr(mp.re(z), 55)), arb(mp.nstr(mp.im(z), 55)))
def M_heat(t):
    h = getH(t)
    def M(u):
        um = mp.mpc(mp.mpf(str(u.real.mid())), mp.mpf(str(u.imag.mid())))
        return to_acb(h.M(um))
    return M
def find_zeros(t):
    h = getH(t); out = []
    for y0 in [x/2 for x in range(10, 121, 3)]:
        for x0 in (0.6, 0.9, 1.3):
            try:
                r = mp.findroot(h.f, mp.mpc(x0, y0), tol=1e-30, maxsteps=40)
            except Exception:
                continue
            if abs(h.f(r)) < mp.mpf(10)**-25*abs(h.f(r+0.3)) and mp.re(r) > 0.5+1e-8 and 0 < mp.im(r) < 70:
                if all(abs(r-q) > 1e-6 for q in out): out.append(r)
    return sorted(out, key=lambda z: float(mp.im(z)))
def task(a):
    t, fam, n, T, seed, zs = a
    mp.mp.dps = 60; ctx.prec = 200
    rng = random.Random(seed)
    def low(): return complex(rng.uniform(0.02, 1.5), rng.uniform(-6, 6))
    def high(): return complex(rng.uniform(0.02, 1.5), rng.uniform(-40, 40))
    pts = []
    while len(pts) < n:
        if fam == 'low': z1, z2 = low(), low()
        elif fam == 'high': z1, z2 = high(), high()
        else:
            # near the off-line zeros rho of f_t: zeros of M_t at rho and 1 - conj(rho); poles of M_t at rho - 1 when Re rho > 1
            r = rng.choice(zs) if zs else complex(0.5, 14.1)
            s = rng.choice([r, complex(1-r.real, r.imag), r.conjugate(), complex(r.real-1, r.imag) if r.real > 1.05 else r])
            d = 10**rng.uniform(-4, -0.5)*complex(math.cos(rng.uniform(0, 6.3)), math.sin(rng.uniform(0, 6.3)))
            if rng.random() < 0.5: z2 = s + d; z1 = rng.choice([low, high])()
            else: z1 = s + d; z2 = rng.choice([low, high])()
        if z1.real > 1e-6 and z2.real > 1e-6: pts.append((z1, z2))
    M = M_heat(t)
    G = k2.gram([(acb(a.real, a.imag), acb(b.real, b.imag)) for (a, b) in pts], M, T)
    st, npos, nneg, piv = k2.ldl_inertia(G)
    logs = [float(abs(x).log().mid())/math.log(10) for x in piv] or [0]
    rel = None
    if nneg:
        rel = max(float(abs(x).log().mid())/math.log(10) for x in piv if x < 0) - max(logs)
    return dict(t=t, family=fam, n=n, T=list(T), seed=seed, status=st, npos=npos, nneg=nneg, log10_negpiv_rel=rel, log10_rel_min=min(logs)-max(logs))
if __name__ == '__main__':
    workers = int(os.environ.get('RH_WORKERS', '4'))
    mp.mp.dps = 60
    res = dict(zeros={}, cells=[])
    tasks = []; seed = 0
    for t in (0, -1, -5, -10):
        zs = find_zeros(t) if t < 0 else []
        res['zeros'][str(t)] = [[mp.nstr(mp.re(z), 12), mp.nstr(mp.im(z), 12)] for z in zs]
        print('t', t, 'off-line zeros found (Re > 1/2, 0 < Im < 70):', res['zeros'][str(t)], flush=True)
        zc = [complex(z) for z in zs]
        for fam in ('low', 'high', 'special'):
            for (n, reps) in ((1, 40), (2, 20), (4, 12), (8, 8)):
                for T in ((0, 0), (0.3, 0.3), (1, 1)):
                    for r in range(reps):
                        seed += 1; tasks.append((t, fam, n, T, seed, zc))
    print('tasks', len(tasks), 'workers', workers, flush=True)
    agg = {}
    with Pool(workers) as pool:
        for r in pool.imap_unordered(task, tasks, chunksize=2):
            k = (r['t'], r['family'], r['n'], tuple(r['T']))
            v = agg.setdefault(k, [0, 0, 0, None])
            neg = r['nneg'] > 0 and (r['log10_negpiv_rel'] is not None and r['log10_negpiv_rel'] > -30)
            v[0] += 1; v[1] += neg; v[2] += (r['status'] != 'ok')
            if neg: v[3] = max(v[3] or -999, r['log10_negpiv_rel'])
    for k, v in sorted(agg.items()):
        res['cells'].append(dict(t=k[0], family=k[1], n=k[2], T=list(k[3]), count=v[0], negative=v[1], undecided=v[2], largest_log10_negpiv_rel=v[3]))
    tot = {}
    for c in res['cells']:
        a = tot.setdefault(c['t'], [0, 0]); a[0] += c['count']; a[1] += c['negative']
    res['totals'] = {str(k): v for k, v in tot.items()}
    print('totals [count, negative] per t:', res['totals'], flush=True)
    json.dump(res, open('heat_control.json', 'w'), indent=1)
    print('DONE')
