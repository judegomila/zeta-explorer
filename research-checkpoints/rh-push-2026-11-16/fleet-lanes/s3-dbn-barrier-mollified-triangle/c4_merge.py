"""Merge the zeta margin scans at y0 (local_c4 and local_c4/s*) and test monotonicity in N."""
import glob, numpy as np, json
fs = sorted(glob.glob('local_c4/c4_zeta_y0.1873.npy') + glob.glob('local_c4/s*/c4_zeta_y0.1873.npy'))
R = np.concatenate([np.load(f) for f in fs]); _, i = np.unique(R[:, 0], return_index=True); R = R[i]; N = R[:, 0]
out = {'files': len(fs), 'distinct_N': len(N)}
for name, v in (('best', R[:, 4:].max(axis=1) - R[:, 1]), ('P3', R[:, 4] - R[:, 1]), ('P5', R[:, 5] - R[:, 1]), ('P7', R[:, 6] - R[:, 1]), ('P11', R[:, 7] - R[:, 1])):
    d = np.diff(v); bad = np.nonzero(d < 0)[0]; pos = np.nonzero(v > 0)[0]
    out[name] = dict(violations=int(len(bad)), largest_N_with_violation=(int(N[bad + 1].max()) if len(bad) else None), largest_drop=(float(-d.min()) if len(bad) else 0.0), first_positive_N=int(N[pos[0]]), last_nonpositive_N=int(N[pos[0] - 1]),
                     nonpositive_after_first_positive=int((v[pos[0]:] <= 0).sum()), violations_above_first_positive=int((bad >= pos[0]).sum()))
    print(name, out[name])
i = np.searchsorted(N, 690988); j = len(N) - 1; best = R[:, 4:].max(axis=1) - R[:, 1]
out['ratio_DII_over_DI'] = [float((R[:, 3] / R[:, 2]).min()), float((R[:, 3] / R[:, 2]).max())]
out['at_690988'] = dict(DI=float(R[i, 2]), DII=float(R[i, 3]), delta=float(best[i]), panels_per_unit_x_I=float(R[i, 2] / (np.pi * best[i])))
out['at_3840000'] = dict(DI=float(R[j, 2]), DII=float(R[j, 3]), delta=float(best[j]), panels_per_unit_x_I=float(R[j, 2] / (np.pi * best[j])))
k = np.searchsorted(N, 1000000); out['at_about_1e6'] = dict(N=int(N[k]), DI=float(R[k, 2]), DII=float(R[k, 3]), delta=float(best[k]), panels_per_unit_x_I=float(R[k, 2] / (np.pi * best[k])))
print(json.dumps({k: v for k, v in out.items() if k.startswith('at') or k.startswith('ratio') or k in ('files', 'distinct_N')}))
json.dump(out, open('c4_zeta_merged.json', 'w'), indent=1)
