"""Combination 1: landing time of every off-line pair of a control under d_t H = -H_zz (zero ODE, all zeros below a height
moving together, mirror zeros and a density tail included).  z = 2 gamma +- 2 i (beta - 1/2).
Usage: c1_flow.py OBJ HGAMMA [ld]     OBJ in DH, HEAT--0.1, HEAT--0.5, EA-<a>, TNR-<q>-<c>
Environment: RH_BATTERY (tables), RH_DH (npz with on, offx, offg), RH_ZETA (npy of zeta ordinates).
Output: out/c1_<OBJ>_<HGAMMA>[_ld].json  (per pair: X, Y0, landing time, de Bruijn Y0^2/2, frozen-rung time, Poisson mass)."""
import sys, os, json, math, numpy as np, hl
obj = sys.argv[1]; Hg = float(sys.argv[2]); ld = len(sys.argv) > 3 and sys.argv[3] == 'ld'
B = os.environ.get('RH_BATTERY', '../c12-control-battery-harness/tables/')
def zeta_list(H):
    fn = os.environ.get('RH_ZETA')
    if fn and os.path.exists(fn):
        g = np.load(fn, mmap_mode='r'); return np.array(g[:np.searchsorted(g, H)])
    g = np.array(json.load(open(B + 'zeros_ZETA_2H.json'))['gamma'], dtype=float); assert H <= 4000; return g[g < H]
if obj == 'DH':
    fn = os.environ.get('RH_DH')
    if fn and os.path.exists(fn):
        d = np.load(fn); on = d['on']; ox = d['offx']; og = d['offg']
    else:
        d = json.load(open(B + 'zeros_DH.json')); on = np.array(sorted(float(v) for v in d['online']))
        off = np.array([[float(a) - 0.5, float(b)] for a, b, *_ in d['offline']]); ox = off[:, 0]; og = off[:, 1]
    on = np.sort(on[on < Hg]); k = og < Hg; ox = np.abs(ox[k]); og = og[k]; tail = (1, math.log(5 / (4 * math.pi)))
elif obj.startswith('HEAT'):
    d = json.load(open(B + 'zeros_%s.json' % obj)); on = np.array(sorted(float(v) for v in d['online']))
    off = np.array([[float(a), float(b)] for a, b, *_ in d['offline']]); ox = off[:, 0]; og = off[:, 1]
    on = on[on < Hg]; k = og < Hg; ox = ox[k]; og = og[k]; tail = (1, math.log(1 / (4 * math.pi)))
elif obj.startswith('EA-'):
    a = float(obj[3:]); og = zeta_list(Hg); ox = np.full(len(og), a); on = np.zeros(0); tail = (2, math.log(1 / (4 * math.pi)))
elif obj.startswith('TNR-'):
    _, q, c = obj.split('-'); q = float(q); c = float(c)
    on = zeta_list(Hg); b = math.acosh(c / 2) / math.log(q)
    og = (2 * np.arange(0, int(Hg * math.log(q) / (2 * math.pi)) + 2) + 1) * math.pi / math.log(q); og = og[og < Hg]
    ox = np.full(len(og), b); tail = (1, math.log(q * q / (4 * math.pi)))
else: raise SystemExit('unknown object')
o = np.argsort(og); og = og[o]; ox = ox[o]
ns, npair = len(on), len(og); M = ns + 2 * npair
hl.log('%s H_gamma=%g: %d real, %d pairs, %d particles; pair terms per evaluation %.2e; state %.1f MB' % (obj, Hg, ns, npair, M, 2.0 * M * M, 8e-6 * (ns + 2 * npair) * 12))
X = 2 * og; Y0 = 2 * ox; H = 2 * Hg
fl = hl.Flow(2 * on, X, -4 * Y0 ** 2, mirror=True, tail=tail + (H,), ld=ld)
snaps = {}
def on_stop(f, t):
    r, c, u = f.split(f.s)
    un = np.asarray(u < 0)
    snaps['%g' % t] = dict(t=t, unlanded=int(un.sum()), unlanded_X=np.asarray(c, dtype=float)[un].tolist(), unlanded_Y=(np.sqrt(-np.asarray(u, dtype=float)[un]) / 2).tolist(),
                           real_zero_count=int(ns + 2 * (~un).sum()), total_zero_count=int(ns + 2 * npair), deficit=int(2 * un.sum()))
    hl.log('snapshot t=%g: unlanded pairs %d of %d' % (t, int(un.sum()), npair))
tend = 0.5 * float(Y0.max()) ** 2 * 1.0001 + 1e-6
tol = dict(rtol=1e-11, atol=1e-13) if ld else dict(rtol=1e-9, atol=1e-10)
fl.run(max(tend, 0.0500001), stops=(0.01, 0.05), on_stop=on_stop, **tol)
hl.log('done t=%.6f steps %d rejected %d evaluations %d' % (fl.t, fl.steps, fl.rejected, fl.nev))
# static estimates
reals = 2 * on; rho = float(hl.rho_gamma(max(og.mean(), 10.0), 1.0)) / 2
tr = np.zeros(npair); P0 = np.zeros(npair)
if ns:
    for i in range(npair): tr[i], P0[i] = hl.rung_time(X[i], Y0[i], reals, rho)
else: tr = Y0 ** 2 / 2
tdb = Y0 ** 2 / 2; land = fl.land
ok = ~np.isnan(land); inner = X < 0.8 * H
sp = tdb / land
res = dict(obj=obj, Hgamma=Hg, ld=ld, n_real=ns, n_pairs=npair, steps=fl.steps, landed=int(ok.sum()),
           Lambda_max_landing_inner=float(np.nanmax(land[inner])) if inner.any() else None,
           argmax_gamma=float(og[inner][np.nanargmax(land[inner])]) if inner.any() else None,
           argmax_x=float(ox[inner][np.nanargmax(land[inner])]) if inner.any() else None,
           debruijn_bound=float(tdb.max()), speedup_quantiles=[float(v) for v in np.nanquantile(sp[inner], [0, 0.05, 0.5, 0.95, 1])],
           land_over_rung_quantiles=[float(v) for v in np.nanquantile((land / tr)[inner], [0, 0.05, 0.5, 0.95, 1])],
           frac_land_gt_rung=float(np.nanmean((land > tr * (1 + 1e-9))[inner])),
           violations_debruijn=int(np.nansum(land > tdb * (1 + 1e-9))), snapshots=snaps,
           pairs=dict(gamma=og.tolist(), x=ox.tolist(), land=land.tolist(), debruijn=tdb.tolist(), rung=tr.tolist(), P0=P0.tolist()))
# speed-up against height (inner pairs)
bins = np.unique(np.concatenate([[0], np.geomspace(50, max(Hg, 51), 13)]))
res['by_height'] = [dict(lo=float(a), hi=float(b), n=int(((og >= a) & (og < b) & inner).sum()),
                         median_speedup=float(np.nanmedian(sp[(og >= a) & (og < b) & inner])) if ((og >= a) & (og < b) & inner).any() else None,
                         max_land=float(np.nanmax(land[(og >= a) & (og < b) & inner])) if ((og >= a) & (og < b) & inner).any() else None) for a, b in zip(bins[:-1], bins[1:])]
fn = 'out/c1_%s_%g%s.json' % (obj, Hg, '_ld' if ld else ''); hl.jdump(res, fn)
print(json.dumps({k: v for k, v in res.items() if k not in ("pairs", "snapshots", "by_height")}))
print({k: {kk: vv for kk, vv in v.items() if not kk.startswith('unlanded_')} for k, v in snaps.items()})
