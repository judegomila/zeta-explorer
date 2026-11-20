"""s5 combination 2: table of the susceptibility per object and height (out/t2_*.json)."""
import json, glob, os, math, numpy as np
rows = []
for f in sorted(glob.glob('out/t2_*.json')):
    d = json.load(open(f))
    if 'rows' not in d: continue
    XS = d['XS']; R = d['rows']
    ch = np.array([r['chi'] for r in R]); ca = np.array([r['chi_abs'] for r in R]); cg = np.array([r['chi_arg'] for r in R])
    D = list(d['prime_side_D']); o = d['object']
    m1 = np.array([r['mean_logabs'] for r in R]); va = ca - m1 ** 2
    # object-specific prime-side value: remove the primes with chi(p) = 0; truncated products: primes to 1e5 only
    for i, x in enumerate(XS):
        s2 = 1 + 2 * x
        if o == 'L4': D[i] -= sum(2.0 ** (-k * s2) / k ** 2 for k in range(1, 60))
        if o == 'L5': D[i] -= sum(5.0 ** (-k * s2) / k ** 2 for k in range(1, 60))
        if o.startswith('EP') and x > 0: D[i] -= 1e5 ** (1 - s2) / ((s2 - 1) * math.log(1e5))
        if o == 'TNRQ': D[i] += 2.2 ** 2 * 1000003.0 ** (-2 * x)
    pkv = [XS[int(np.argmax(v))] for v in va]
    pk = [r['peak_x'] for r in R]; pka = [r['peak_x_abs'] for r in R]
    i25 = XS.index(0.25); i10 = XS.index(0.1); i50 = XS.index(0.5); i40 = XS.index(0.4)
    rows.append({'file': os.path.basename(f), 'object': d['object'], 'T0': R[0]['T0'], 'nwin': len(R), 'H': R[0]['H'],
                 'peak_x_values': sorted(set(pk)), 'peak_x_abs_values': sorted(set(pka)), 'peak_x_var_values': sorted(set(pkv)), 'var_abs_mean': va.mean(axis=0).tolist(), 'n_peak_off': sum(1 for p in pk if p != 0), 'n_peak_abs_off': sum(1 for p in pka if p != 0),
                 'chi0': float(ch[:, 0].mean()), 'chi_abs0': float(ca[:, 0].mean()), 'cusp_abs': float(np.mean([r['cusp_abs'] for r in R])),
                 'chi_over_D': {str(XS[i]): float(ch[:, i].mean() / D[i]) for i in (i10, i25, i40, i50)}, 'chi_abs_over_halfD': {str(XS[i]): float(ca[:, i].mean() / (D[i] / 2)) for i in (i10, i25, i40, i50)},
                 'chi_mean': ch.mean(axis=0).tolist(), 'chi_abs_mean': ca.mean(axis=0).tolist(), 'max_jump': max(r['max_jump_unwrap'] for r in R)})
json.dump(rows, open('out/t2_table.json', 'w'), indent=1)
print('D = own prime-side value sum over prime powers of abs(coefficient of log F)^2 n^(-2 sigma) (zeta value; p = 2 removed for L4, p = 5 for L5; primes <= 1e5 for EP*; + c^2 q^(-2x) for TNRQ; zeta value used unchanged for DH, EA, TNR3)')
print('%-7s %-10s %4s  %-14s %-14s %8s %8s %8s  %s' % ('object', 'T0', 'win', 'peak x (chi)', 'peak x (var)', 'chi(1/2)', 'abs(1/2)', 'cusp', 'chi/D at x = 0.1, 0.25, 0.4, 0.5'))
for r in sorted(rows, key=lambda r: (r['object'], r['T0'])):
    print('%-7s %-10.6g %4d  %-14s %-14s %8.3f %8.3f %8.2f  %s' % (r['object'], r['T0'], r['nwin'], r['peak_x_values'], r['peak_x_var_values'], r['chi0'], r['chi_abs0'], r['cusp_abs'], ' '.join('%.3f' % v for v in r['chi_over_D'].values())))
