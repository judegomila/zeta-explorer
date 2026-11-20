"""Certify zeros of F_N right of the critical line with arb balls (interval Newton). No cupy import here.
For s0 = 1/2 + ds + i(T0' + u) and the square D of half-side r about s0: if s0 - F(s0)/F'(D) lies in the interior of D,
F has exactly one zero in D; D lies in Re s > 1/2 when ds > r."""
import sys, json, math, os, time
from flint import arb, acb, ctx
PREC = 128
_state = {}
def init(kind, T0eff, N):
    ctx.prec = PREC
    s5 = arb(5).sqrt(); kap = ((10 - 2 * s5).sqrt() - 2) / (s5 - 1)
    if kind in ('zeta', 'transl'): per = None
    elif kind == 'dh': per = [acb(0), acb(1), acb(kap), acb(-kap), acb(-1)]
    elif kind == 'chi5': per = [acb(0), acb(1), acb(0, 1), acb(0, -1), acb(-1)]
    elif kind == 'per3': per = [acb(1), acb(1), acb(-1)]
    else: raise ValueError(kind)
    _state.update(kind=kind, T0=arb(int(T0eff)), N=N, per=per, ln=[arb(n).log() for n in range(1, N + 1)])
def cert_one(z):
    ctx.prec = PREC
    ds, u = z; st = _state; N = st['N']; per = st['per']; ln = st['ln']
    r = min(1e-6, ds / 4)
    if r < 1e-12: return (ds, u, False, 'too close to the line')
    re0 = arb(0.5) + arb(ds); im0 = st['T0'] + arb(u)
    s0 = acb(re0, im0); D = acb(arb(0.5) + arb(ds, r), st['T0'] + arb(u, r))
    F = acb(0); Fp = acb(0); P = len(per) if per else 0
    for n in range(1, N + 1):
        l = ln[n - 1]
        if per is None:
            F += (-(s0 * l)).exp(); Fp -= l * (-(D * l)).exp()
        else:
            a = per[n % P]
            if n % P == 0 and st['kind'] != 'per3': continue
            F += a * (-(s0 * l)).exp(); Fp -= a * l * (-(D * l)).exp()
    if Fp.contains(0): return (ds, u, False, 'derivative ball contains 0')
    Nw = s0 - F / Fp
    okr = (Nw.real - re0).abs_upper() < r; oki = (Nw.imag - im0).abs_upper() < r
    ok = bool(okr) and bool(oki) and ds - r > 0
    return (ds, u, ok, float(abs(F).abs_upper()) if True else None)
def main():
    import multiprocessing as mp
    src, dst = sys.argv[1], sys.argv[2]; cap = int(sys.argv[3]) if len(sys.argv) > 3 else 10 ** 9
    R = json.load(open(src)); out = dict(label=R['label'], kind=R['kind'], T0=R['T0'], segs=[]); t0 = time.time()
    T0eff = int(R['T0']) * (1 + int(R.get('alpha_mult', 0)))
    import random; rng = random.Random(7)
    for sg in R['segs']:
        zs = [(z[0], z[1]) for z in sg['right_zeros']]
        nz = len(zs)
        if nz > cap: zs = rng.sample(zs, cap)
        with mp.get_context('fork').Pool(int(os.environ.get('RH_WORKERS', '4')), initializer=init, initargs=(R['kind'], T0eff, sg['N'])) as pool:
            res = pool.map(cert_one, zs, chunksize=max(1, len(zs) // 200))
        good = sum(1 for x in res if x[2])
        out['segs'].append(dict(N=sg['N'], ua=sg['ua'], ub=sg['ub'], screen_right=nz, attempted=len(zs), certified=good,
                                failed=[x for x in res if not x[2]], min_ds_certified=min([x[0] for x in res if x[2]], default=None),
                                max_abs_F_upper=max([x[3] for x in res if x[2]], default=None)))
        print(R['label'], 'N', sg['N'], 'attempted', len(zs), 'certified', good, f'{time.time() - t0:.0f}s', flush=True)
    out['certified_total'] = sum(s['certified'] for s in out['segs']); out['attempted_total'] = sum(s['attempted'] for s in out['segs'])
    out['screen_right_total'] = sum(s['screen_right'] for s in out['segs']); out['seconds'] = time.time() - t0; out['prec'] = PREC
    json.dump(out, open(dst, 'w'))
if __name__ == '__main__': main()
