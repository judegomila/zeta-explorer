"""Per-row law.  B_{m,w}(X) = sum_c mu(c) w(c) conj(gamma_1(c)) chi_c(m) q_c^(-1/2) V(q_c/X) for fixed rows m, X = 2^5 .. 2^LMAX.
Kubota-Patterson (CLASSICAL): for w = Liouville the row is a smoothed sum of sextic Gauss sums conj(g(m, c)), with a
pole of its Dirichlet series at s = 2/3, so B_m(X) = r(m) Vhat(1/6) X^(1/6) + (terms decaying in X).  For w = 1 no pole."""
import sys, json, time, numpy as np, lib7
LMAX = float(sys.argv[1]); t0 = time.time()
D = lib7.build(int(2 * 2 ** LMAX) + 1); pl, qc, gam, inc, mu = D['pl'], D['qc'], D['gam'], D['inc'], D['mu']
print('primes', len(pl), 'c', len(qc), 'build s', round(time.time() - t0, 1), flush=True)
u, v, qm = lib7.lattice(31); keep = qm > 0; u, v, qm = u[keep], v[keep], qm[keep]
ch = np.zeros((len(qc), len(u)), dtype=complex)
for s in range(0, len(qc), 2000):
    T, Zm = lib7.sym_table(pl, u, v); ch[s:s + 2000] = lib7.chi_c(inc[s:s + 2000], T, Zm)
q = qc.astype(float); alpha = 1.0
WT = {'liou': np.ones(len(qc), complex), 'one': mu.astype(complex), 'tw_liou': q ** (-1j * alpha), 'tw_one': mu * q ** (-1j * alpha)}
logs = np.arange(5, LMAX + 1e-9, 0.5); out = {}
for k, wt in WT.items():
    rows = []
    for lg in logs:
        X = 2.0 ** lg; coef = wt * np.conj(gam) * lib7.bump(q / X) / np.sqrt(q)
        rows.append(coef @ ch)
    out[k] = np.array(rows)                       # scales x rows
i1 = int(np.nonzero((u == 1) & (v == 0))[0][0])
print('row m = 1:  log2X, B_liou, |B_liou|/X^(1/6), B_one, |B_tw_liou|/X^(1/6)')
for j, lg in enumerate(logs):
    b = out['liou'][j, i1]; b1 = out['one'][j, i1]; bt = out['tw_liou'][j, i1]
    print('  %5.1f  %+.5f%+.5fi  %.5f   %+.5f%+.5fi   %.5f' % (lg, b.real, b.imag, abs(b) / 2 ** (lg / 6), b1.real, b1.imag, abs(bt) / 2 ** (lg / 6)))
print('rms over the %d rows 0 < q_m <= 31 of |B_m(X)|, and fitted exponent in X over the upper half of the scales' % len(u))
fit = {}
for k in WT:
    rms = np.sqrt(np.mean(np.abs(out[k]) ** 2, axis=1)); h = len(logs) // 2
    sl = np.polyfit(logs[h:] * np.log(2), np.log(rms[h:]), 1)[0]; fit[k] = float(sl)
    print('  %-8s' % k, ' '.join('%.3f' % x for x in rms[::2]), '  exponent %.3f' % sl)
# stability of the normalised residue r(m) = B_m(X)/X^(1/6) between the top two octaves
r1 = out['liou'][-1] / 2 ** (logs[-1] / 6); r0 = out['liou'][-3] / 2 ** (logs[-3] / 6)
print('liou: median |r(X_top) - r(X_top/2)| / |r(X_top)| over rows: %.4f ;  mean |r|^2 = %.5f ; rows with |r| < 0.05: %d of %d' % (
    float(np.median(np.abs(r1 - r0) / np.abs(r1))), float(np.mean(np.abs(r1) ** 2)), int(np.sum(np.abs(r1) < 0.05)), len(u)))
bynorm = {}
for n in sorted(set(qm.tolist())):
    bynorm[int(n)] = float(np.mean(np.abs(r1[qm == n]) ** 2))
print('mean |r(m)|^2 by norm of m:', ' '.join('%d:%.3f' % (n, x) for n, x in bynorm.items()))
json.dump(dict(logs=logs.tolist(), fit=fit, bynorm=bynorm, m1_liou=[(float(z.real), float(z.imag)) for z in out['liou'][:, i1]],
               m1_one=[(float(z.real), float(z.imag)) for z in out['one'][:, i1]]), open(sys.argv[2], 'w'), indent=1)
