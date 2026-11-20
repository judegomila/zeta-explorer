"""Merge the parts of c3_packets.py and print the per-family statistics of rho, pilot and |E|."""
import sys, glob, json, numpy as np
REX = 0.2796881955526244
files = sorted(glob.glob(sys.argv[1])); FUN = None; acc = {}
for fn in files:
    z = np.load(fn); sel = z['sel'].copy(); sel[-1] = False
    if FUN is None: FUN = [k for k in z.files if k not in ('sel', 'x', 'N', 'null')]
    for k in FUN + ['x', 'N', 'null']: acc.setdefault(k, []).append(z[k][sel])
A = {k: np.concatenate(v) for k, v in acc.items()}
x = A['x']; n = len(x); edges = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13]
print('files %d, samples %d, x from %.3e to %.3e, sum of N %.3e' % (len(files), n, x.min(), x.max(), float(A['N'].sum())))
out = {'samples': n, 'families': {}}
def stats(name, rho, pil, absE, tel=None):
    o = {'rho_inf': float(rho.min()), 'rho_q01': float(np.quantile(rho, 0.01)), 'rho_med': float(np.median(rho)), 'rho_q99': float(np.quantile(rho, 0.99)), 'rho_q9999': float(np.quantile(rho, 0.9999)), 'rho_sup': float(rho.max()),
         'x_at_rho_sup': float(x[np.argmax(rho)]), 'decades': []}
    if tel is not None: o['max_telescope_err'] = float(tel.max())
    for a, b in zip(edges, edges[1:]):
        m = (x >= a) & (x < b)
        o['decades'].append({'n': int(m.sum()), 'rho_sup': float(rho[m].max()), 'rho_med': float(np.median(rho[m])), 'pilot_sup': float(pil[m].max()), 'pilot_med': float(np.median(pil[m])), 'absE_sup': float(absE[m].max()),
                             'frac_pilot_gt_Rex': float((pil[m] > REX).mean()), 'frac_absE_gt_Rex': float((absE[m] > REX).mean())})
    out['families'][name] = o
    print('%-34s rho inf %.4f q01 %.4f med %.4f q99 %.4f q99.99 %.4f sup %.4f (x = %.3e)%s' % (name, o['rho_inf'], o['rho_q01'], o['rho_med'], o['rho_q99'], o['rho_q9999'], o['rho_sup'], o['x_at_rho_sup'], (' telescope %.1e' % o['max_telescope_err']) if tel is not None else ''))
    print('    sup rho per decade   : ' + ' '.join('%.4f' % d['rho_sup'] for d in o['decades']))
    print('    sup pilot per decade : ' + ' '.join('%.4f' % d['pilot_sup'] for d in o['decades']))
    print('    sup |E| per decade   : ' + ' '.join('%.4f' % d['absE_sup'] for d in o['decades']))
    print('    frac pilot > Rex     : ' + ' '.join('%.2e' % d['frac_pilot_gt_Rex'] for d in o['decades']))
    print('    frac |E| > Rex       : ' + ' '.join('%.2e' % d['frac_absE_gt_Rex'] for d in o['decades']))
for f in FUN:
    r = A[f]; stats(f, r[:, 0] / r[:, 1], r[:, 1], r[:, 0], r[:, 2])
z = A['ZETA']
stats('ZETA packets, random signs', A['null'][:, 0], z[:, 1], A['null'][:, 0] * z[:, 1]); stats('ZETA packet moduli, random phases', A['null'][:, 1], z[:, 1], A['null'][:, 1] * z[:, 1])
# growth of the running sup of rho with the number of samples (zeta)
rho = z[:, 0] / z[:, 1]; rng = np.random.default_rng(1); perm = rng.permutation(n)
print('running sup of rho (zeta) over random subsamples: ' + ' '.join('%d: %.4f' % (k, rho[perm[:k]].max()) for k in (100, 1000, 10000, 100000, n) if k <= n))
top = (x >= 1e12)
print('zeta, x >= 1e12: n %d, sup pilot %.5f, sup |E| %.5f, sup rho %.4f ; fraction of samples with rho > 0.9: %.2e' % (top.sum(), z[top, 1].max(), z[top, 0].max(), rho[top].max(), (rho > 0.9).mean()))
json.dump(out, open(sys.argv[2], 'w'), indent=1)
