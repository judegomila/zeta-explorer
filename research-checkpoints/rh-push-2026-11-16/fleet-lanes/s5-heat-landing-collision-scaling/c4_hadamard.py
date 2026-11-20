"""Combination 4, function side at the zeros (Hadamard identity; python-flint balls, 160 bits; MEASURED: the Cauchy sampling and the tail are not enclosed).
At a simple zero t_i of f(t) = Lambda(1/2 + i t) (Lambda the completed function, entire of order 1):
   sum over all other zeros t_j of 1/(t_i - t_j)^2  =  (f''/(2 f'))^2 - f'''/(3 f')  =  -(Lambda''/(2 Lambda'))^2 + Lambda'''/(3 Lambda')   at rho_i.
Function side: derivatives from a Cauchy integral on a circle around rho_i.  Zero side: the on-line list (both signs), density tail beyond the list.
The difference is the sum over the off-line zeros; it is compared with the pair formula from the table of off-line zeros.
Usage: c4_hadamard.py OBJ TMAX OUT.json     OBJ in ZETA, DH, TNR, L4, L5
Environment: RH_BATTERY_CODE (battery/), RH_BATTERY (tables/), RH_DH (npz), RH_L4, RH_L5 (npy lists), RH_ZETA."""
import sys, os, json, math, numpy as np
from flint import acb, arb, ctx, dirichlet_char
sys.path.insert(0, os.environ.get('RH_BATTERY_CODE', '../c12-control-battery-harness/battery'))
import core
import hl
obj, tmax, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
B = os.environ.get('RH_BATTERY', '../c12-control-battery-harness/tables/')
ctx.prec = 160
offx = np.zeros(0); offg = np.zeros(0)
if obj == 'ZETA':
    fn = os.environ.get('RH_ZETA', '../s1-zero-flow-dynamics/data/zeta_1e7.npy'); on = np.array(np.load(fn, mmap_mode='r')[:200000]); Q = 1.0
    comp = core.by_code('ZETA').completed
elif obj == 'DH':
    d = np.load(os.environ.get('RH_DH', '../s3-heat-zero-velocity-channels/data/DH.npz')); on = d['on']; offx = np.abs(d['offx']); offg = d['offg']; Q = 5.0
    comp = core.by_code('DH').completed
elif obj == 'TNR':
    fn = os.environ.get('RH_ZETA', '../s1-zero-flow-dynamics/data/zeta_1e7.npy'); on = np.array(np.load(fn, mmap_mode='r')[:200000]); Q = 9.0
    t = core.by_code('TNR'); comp = t.completed; b = math.acosh(1.1) / math.log(3)
    offg = (2 * np.arange(0, int(on[-1] * math.log(3) / (2 * math.pi))) + 1) * math.pi / math.log(3); offx = np.full(len(offg), b)
elif obj in ('L4', 'L5'):
    q, num, par = (4, 3, 1) if obj == 'L4' else (5, 4, 0)
    fn = os.environ.get('RH_' + obj, '../s3-heat-zero-velocity-channels/data/L4_on.npy' if obj == 'L4' else 'data/L5_on.npy')
    if not os.path.exists(fn): fn = 'data/%s_on.npy' % obj
    on = np.load(fn); Q = float(q)
    ch = dirichlet_char(q, num)
    def comp(s): return (acb(q) / acb.pi()) ** (s / 2) * ((s + par) / 2).gamma() * ch.l(s)
Hl = float(on[-1])
sel = on[on < tmax]
NODE = 48; rad = 0.25
def fside(gam):
    rho = acb(0.5, gam); d1 = acb(0); d2 = acb(0); d3 = acb(0)
    for k in range(NODE):
        w = (acb(0, 2 * k) * acb.pi() / NODE).exp(); v = comp(rho + rad * w)
        d1 += v / w; d2 += v / (w * w); d3 += v / (w * w * w)
    d1 = d1 / (NODE * rad); d2 = 2 * d2 / (NODE * rad ** 2); d3 = 6 * d3 / (NODE * rad ** 3)
    val = -(d2 / (2 * d1)) ** 2 + d3 / (3 * d1)
    return float(val.real.mid()), float(val.imag.mid())
# refine the list ordinates of the selected zeros with Newton on the completed function (the lists are float64 to ~1e-9 .. 1e-11)
def refine(gam):
    s = acb(0.5, gam)
    for _ in range(3):
        h = acb(1e-12); f = comp(s); fp = (comp(s + h) - comp(s - h)) / (2 * h); s = s - f / fp
    return float(s.imag.mid())
rows = []
for i, gam in enumerate(sel):
    gr = refine(float(gam))
    F, Fim = fside(gr)
    oth = np.delete(on, i)
    Z = float((1 / (gr - oth) ** 2).sum() + (1 / (gr + on) ** 2).sum())
    # tail of all zeros beyond the list: int_H^inf dens(s) (1/(s - g)^2 + 1/(s + g)^2) ds, dens = log(Q s/2pi)/2pi
    sg = np.geomspace(Hl, Hl * 1e8, 4000); dens = np.log(Q * sg / (2 * math.pi)) / (2 * math.pi)
    Z += float(np.trapezoid(dens * (1 / (sg - gr) ** 2 + 1 / (sg + gr) ** 2), sg))
    O = 0.0; near = None
    if len(offg):
        zz = offg - 1j * offx
        O = float((2 * (1 / (gr - zz) ** 2).real + 2 * (1 / (gr + zz) ** 2).real).sum())
        # on-line zeros missing from the density tail are accounted by the off-line pairs only inside the list
        k = int(np.argmin(np.abs(offg - gr))); near = float((2 * (1 / (gr - zz[k]) ** 2).real))
    rows.append(dict(gamma=gr, shift=gr - float(gam), F=F, F_imag=Fim, Z_online=Z, offline_pair_formula=O, nearest_pair_term=near,
                     mismatch=F - Z, residual=F - Z - O))
    if i % 100 == 0: hl.log(obj, i, len(sel), rows[-1])
M = np.array([r['mismatch'] for r in rows]); Rr = np.array([r['residual'] for r in rows]); G = np.array([r['gamma'] for r in rows])
res = dict(obj=obj, tmax=tmax, n=len(rows), list_height=Hl, n_offline_pairs=int(len(offg)), first_offline_height=float(offg.min()) if len(offg) else None,
           max_abs_F_imag=float(max(abs(r['F_imag']) for r in rows)), rms_F=float(np.sqrt(np.mean([r['F'] ** 2 for r in rows]))),
           max_abs_mismatch=float(np.abs(M).max()), rms_mismatch=float(np.sqrt((M ** 2).mean())), max_abs_residual=float(np.abs(Rr).max()), rms_residual=float(np.sqrt((Rr ** 2).mean())))
if len(offg):
    below = G < offg.min(); nr = np.array([r['nearest_pair_term'] for r in rows])
    res.update(n_zeros_below_first_offline=int(below.sum()), max_abs_mismatch_below_first_offline=float(np.abs(M[below]).max()) if below.any() else None,
               mismatch_below_first_offline=[dict(gamma=float(a), mismatch=float(b), nearest_pair_term=float(c), all_pairs=float(r['offline_pair_formula'])) for a, b, c, r in zip(G[below][:60], M[below][:60], nr[below][:60], [rows[j] for j in np.nonzero(below)[0][:60]])],
               frac_abs_mismatch_gt_abs_nearest=float((np.abs(M) > np.abs(nr) * 1.0000001).mean()), frac_abs_mismatch_gt_twice_nearest=float((np.abs(M) > 2 * np.abs(nr)).mean()))
res['rows'] = rows
hl.jdump(res, out); print(json.dumps({k: v for k, v in res.items() if k not in ('rows', 'mismatch_below_first_offline')}, indent=0)); print(res.get('mismatch_below_first_offline', [])[:6])
