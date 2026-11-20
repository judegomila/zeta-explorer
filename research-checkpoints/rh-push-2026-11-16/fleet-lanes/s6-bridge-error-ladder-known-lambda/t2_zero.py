"""Test 2, zero side: curvature c = |u_0''(x_0 + i y_N)|, u_0 = 2 m, m(z) = sum over zeros 1/(z - x_rho), x_rho = gamma - i (beta - 1/2),
so c = 4 |sum 1/(z - x_rho)^3| = 2 |(xi'/xi)''(1/2 + y_N + i x_0)| (sign conventions aside); y_N = sqrt(2 pi / N); pole scale c_pole = 4 / y_N^3.
(i) first-N ladder: footer x_0 = midpoint of the closest pair among the first N ordinates.
(ii) blocks: NB consecutive blocks of the list, footer = midpoint of the closest pair of the block, every y_N of the ladder.
Usage: t2_zero.py LIST.npy NAME OUT.json [VARIANT]
  VARIANT: none | TNR-<q>-<c> (adds the off-line progression of T-NR to the zeta list) | EA-<a> (every zero replaced by the pair gamma -+ i a)
           | DH:<DH.npz> (list = 'on' of the npz; off-line pairs added in a second pass)"""
import sys, json, math, numpy as np, bl, hl
fn, name, out = sys.argv[1], sys.argv[2], sys.argv[3]; var = sys.argv[4] if len(sys.argv) > 4 else 'none'
offg = offx = None
if var.startswith('DH:'):
    d = np.load(var[3:]); g = np.sort(np.asarray(d['on'], float)); o = np.argsort(d['offg']); offg = np.asarray(d['offg'], float)[o]; offx = np.abs(np.asarray(d['offx'], float))[o]
else: g = np.array(np.load(fn, mmap_mode='r'), dtype=np.float64)
n = len(g); gap = np.diff(g); K = min(3000, (n - 4) // 2)
Ns = [N for N in (1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7, 3e7, 1e8)]
hl.log('%s (%s): %d ordinates; chunk arrays %.2f GB' % (name, var, n, 16e-9 * 500 * 2 * K * 2))

def curv(idx, y, extra=None, ea=None):
    """c at the footers x0 = midpoint of (idx, idx+1), height y (scalar or array per footer); zeros with index within K of the pair.
    extra(x0) -> complex array (nf, m) of additional zeros x_rho;  ea: every zero becomes the pair gamma -+ i ea."""
    idx = np.asarray(idx); c = np.empty(len(idx)); cp = np.empty(len(idx)); y = np.broadcast_to(np.asarray(y, float), idx.shape)
    for s0 in range(0, len(idx), 500):
        ii = idx[s0:s0 + 500]; x0 = 0.5 * (g[ii] + g[ii + 1]); yy = y[s0:s0 + 500]
        lo = np.clip(ii - K, 0, n - 2 * K - 2); J = lo[:, None] + np.arange(2 * K + 2)[None, :]
        z = (x0 + 1j * yy)[:, None]; w = g[J] - x0[:, None]                      # distances are formed before the complex cast (heights up to 1e12)
        d = (1j * yy)[:, None] - w
        if ea is None: s = (1 / d ** 3).sum(1)
        else: s = (1 / (d + 1j * ea) ** 3 + 1 / (d - 1j * ea) ** 3).sum(1)
        if extra is not None:
            e = extra(x0); s = s + (1 / ((1j * yy)[:, None] - e) ** 3).sum(1)   # e = x_rho - x0 (complex)
        h = 0.5 * (g[ii + 1] - g[ii])
        c[s0:s0 + 500] = 4 * np.abs(s); cp[s0:s0 + 500] = 4 * np.abs(1 / (1j * yy - h) ** 3 + 1 / (1j * yy + h) ** 3)
    return c, cp

extra = None; ea = None
if var.startswith('TNR-'):
    _, q, cc = var.split('-'); q = float(q); cc = float(cc); b = math.acosh(cc / 2) / math.log(q); stp = 2 * math.pi / math.log(q)
    def extra(x0):
        k0 = np.round((x0 - math.pi / math.log(q)) / stp); kk = np.arange(-400, 401)
        hgt = (k0[:, None] + kk[None, :]) * stp + math.pi / math.log(q) - x0[:, None]
        return np.concatenate([hgt - 1j * b, hgt + 1j * b], 1)
elif var.startswith('EA-'): ea = float(var[3:])
def extra_dh(x0):
    j = np.searchsorted(offg, x0); J = np.clip(j[:, None] + np.arange(-150, 150)[None, :], 0, len(offg) - 1)
    hgt = offg[J] - x0[:, None]; return np.concatenate([hgt - 1j * offx[J], hgt + 1j * offx[J]], 1)

res = dict(name=name, variant=var, n=n)
# (i) first-N ladder
rm = np.minimum.accumulate(gap); rec = np.concatenate([[0], np.nonzero(rm[1:] < rm[:-1])[0] + 1])
lad = []
for N in [N for N in Ns if N <= n * 1.002]:
    Ni = int(min(N, n)); a = int(rec[np.searchsorted(rec, Ni - 2, side='right') - 1]); y = math.sqrt(2 * math.pi / N)
    a_ = np.array([min(max(a, 0), n - 2)])
    c, cp = curv(a_, y, extra, ea); row = dict(N=N, y=y, index=a, height=float(g[a]), gap=float(gap[a]), r=float(gap[a] / (2 * y)), c=float(c[0]), c_pair=float(cp[0]), c_pole=4 / y ** 3,
                                               nu=float(c[0] * y ** 3 / 4), C_H=float(math.sqrt(2 / c[0])), C_H_pole=y ** 1.5 / math.sqrt(2))
    if offg is not None: c2, _ = curv(a_, y, extra_dh); row.update(c_full=float(c2[0]), nu_full=float(c2[0] * y ** 3 / 4))
    lad.append(row)
res['ladder'] = lad
if len(lad) >= 3:
    res['ladder_fit'] = dict(p_c=float(np.polyfit(np.log([r['N'] for r in lad]), np.log([r['c'] for r in lad]), 1)[0]), p_pole=1.5,
                             p_nu=float(np.polyfit(np.log([r['N'] for r in lad]), np.log([r['nu'] for r in lad]), 1)[0]),
                             p_r=float(np.polyfit(np.log([r['N'] for r in lad]), np.log([r['r'] for r in lad]), 1)[0]))
# (ii) blocks
NB = int(min(10000, n // 500)); Wb = n // NB
mg = gap[:NB * Wb - 1]; mg = np.concatenate([mg, [np.inf]]).reshape(NB, Wb); mg[:, -1] = np.inf
ia = mg.argmin(1) + np.arange(NB) * Wb; del mg
res['blocks'] = dict(NB=NB, W=Wb)
if offg is not None:
    x0 = 0.5 * (g[ia] + g[ia + 1]); j = np.searchsorted(offg, x0); dn = np.minimum(np.abs(offg[np.clip(j, 0, len(offg) - 1)] - x0), np.abs(offg[np.clip(j - 1, 0, len(offg) - 1)] - x0))
    rho = 1 / (2 * math.pi) * np.log(5 * x0 / (2 * math.pi)); far = dn * rho > 10
    res['blocks']['far_blocks'] = int(far.sum())
bk = []
dens_b = np.array([(Wb - 1) / (g[min((k + 1) * Wb - 1, n - 1)] - g[k * Wb]) for k in range(NB)])
for N in Ns:
    y = math.sqrt(2 * math.pi / N)
    c, cp = curv(ia, y, extra, ea); nu = c * y ** 3 / 4
    row = dict(N=N, y=y, y_over_spacing_median=float(np.median(y * dens_b)), c_min=float(c.min()), c_q01=float(np.quantile(c, 0.01)), c_median=float(np.median(c)), c_max=float(c.max()),
               nu_min=float(nu.min()), nu_q01=float(np.quantile(nu, 0.01)), nu_median=float(np.median(nu)), nu_max=float(nu.max()),
               frac_nu_gt_half=float((nu > 0.5).mean()), c_over_pair_q=[float(v) for v in np.quantile(c / cp, [0.0, 0.01, 0.5, 0.99, 1.0])],
               r_q=[float(v) for v in np.quantile(gap[ia] / (2 * y), [0.0, 0.01, 0.5, 0.99, 1.0])])
    if offg is not None:
        c2, _ = curv(ia, y, extra_dh); nu2 = c2 * y ** 3 / 4
        row.update(full_c_min=float(c2.min()), full_nu_min=float(nu2.min()), full_nu_median=float(np.median(nu2)), rel_change_far_max=float(np.abs(c2[far] / c[far] - 1).max()) if far.any() else None,
                   rel_change_far_median=float(np.median(np.abs(c2[far] / c[far] - 1))) if far.any() else None, rel_change_near_median=float(np.median(np.abs(c2[~far] / c[~far] - 1))),
                   far_c_min=float(c[far].min()) if far.any() else None, far_nu_min=float(nu[far].min()) if far.any() else None, far_nu_median=float(np.median(nu[far])) if far.any() else None)
    bk.append(row)
res['blocks']['rows'] = bk
lN = np.log([b['N'] for b in bk])
res['blocks']['envelope_exponent_c_min'] = float(np.polyfit(lN, np.log([b['c_min'] for b in bk]), 1)[0])
res['blocks']['envelope_exponent_c_q01'] = float(np.polyfit(lN, np.log([b['c_q01'] for b in bk]), 1)[0])
res['blocks']['exponent_c_median'] = float(np.polyfit(lN, np.log([b['c_median'] for b in bk]), 1)[0])
res['blocks']['envelope_exponent_nu_min'] = float(np.polyfit(lN, np.log([b['nu_min'] for b in bk]), 1)[0])
# footers for the prime side (300 blocks spread over the list)
sel = ia[np.linspace(0, NB - 1, min(300, NB)).astype(int)]
np.save(out.replace('.json', '_footers.npy'), np.stack([0.5 * (g[sel] + g[sel + 1]), gap[sel], sel.astype(float)]))
bl.jdump(res, out)
print(json.dumps(dict(ladder=[(r['N'], round(r['r'], 3), '%.3g' % r['nu'], '%.3g' % r['C_H']) for r in lad], fit=res.get('ladder_fit'),
                      blocks=[(b['N'], '%.3g' % b['nu_min'], '%.3g' % b['nu_median'], '%.3g' % b['c_min']) for b in bk], exps={k: v for k, v in res['blocks'].items() if 'exponent' in k})))
