"""s5 combination 1: table of resolvent norms N_M(s) on Re s = 1/2 + c (out/t1_*.json), and the peaks against the off-line zeros."""
import json, glob, os, math, numpy as np
OFF = {'DH': [(0.80851718, 85.69934849), (0.65083008, 114.16334273), (0.57435605, 166.47930591)], 'TNR3': [(0.5 + math.acosh(1.1) / math.log(3), math.pi * (2 * k + 1) / math.log(3)) for k in range(35)],
       'TNRQ': [(0.5 + math.acosh(1.1) / math.log(1000003), math.pi * (2 * k + 1) / math.log(1000003)) for k in range(440)]}
z = json.load(open('tables_zeros_DH.json')); OFF['DH'] = [(float(r[0]), float(r[1])) for r in z['offline'] if float(r[1]) < 260]
out = []
print('%-5s %5s | %-37s | %-28s | %9s %8s | %s' % ('obj', 'c', 'max over t of N_M, M = 1e2 1e3 1e4 1e5', 'max ratios N(10M)/N(M)', 'min abs F', 'at t', 'largest peaks of N_1e5: t (N; abs F; nearest off-line zero: distance in t, Re)'))
for f in sorted(glob.glob('out/t1_*_*.json')):
    d = json.load(open(f)); R = sorted(d['rows'], key=lambda r: r['t']); o = d['object']; c = d['c']; s0 = d['sigma0']
    t = np.array([r['t'] for r in R]); N = np.array([r['N'] for r in R]); aF = np.array([r['absF'] for r in R]); r1 = np.array([r['rank_one'] for r in R])
    pk = [i for i in range(1, len(t) - 1) if N[i, 3] > N[i - 1, 3] and N[i, 3] >= N[i + 1, 3]]
    pk = sorted(pk, key=lambda i: -N[i, 3])[:4]; desc = []
    for i in pk:
        if o in OFF:
            b, g = min(OFF[o], key=lambda zz: abs(zz[1] - t[i])); desc.append('%.3f (%.1f; %.3g; dt %.2f, Re %.4f)' % (t[i], N[i, 3], aF[i], abs(g - t[i]), b))
        else: desc.append('%.3f (%.1f; %.3g)' % (t[i], N[i, 3], aF[i]))
    rat = [float((N[:, k + 1] / N[:, k]).max()) for k in range(3)]
    far = None
    if o in OFF:   # largest N at points more than 20 from every off-line zero, against the same quantity for all points
        dist = np.array([min(abs(g - tt) for b, g in OFF[o]) for tt in t]); m = dist > 20
        far = float(N[m, 3].max()) if m.any() else None
    out.append({'object': o, 'c': c, 'sigma0': s0, 'maxN': N.max(axis=0).tolist(), 'medianN': np.median(N, axis=0).tolist(), 'ratios': rat, 'min_absF': float(aF.min()), 'argmin_t': float(t[aF.argmin()]),
                'peaks': desc, 'max_N_far_from_offline_zeros(>20)': far, 'corr_logN_logabsF': float(np.corrcoef(np.log(N[:, 3]), np.log(aF))[0, 1]),
                'N*absF_range': [float((N[:, 3] * aF).min()), float((N[:, 3] * aF).max())], 'rank_one_over_N_range': [float((r1[:, 3] / N[:, 3]).min()), float((r1[:, 3] / N[:, 3]).max())]})
    print('%-5s %5.2f | %8.2f %8.2f %8.2f %8.2f | %8.5f %8.5f %8.5f | %9.3g %8.3f | %s%s' % (o, c, *N.max(axis=0), *rat, aF.min(), t[aF.argmin()], '; '.join(desc), ('  || far: %.2f' % far) if far else ''))
json.dump(out, open('out/t1_table.json', 'w'), indent=1)
