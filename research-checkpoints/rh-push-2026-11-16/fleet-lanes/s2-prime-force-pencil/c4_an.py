"""tables for combination 4 from c4_phase.py output."""
import sys, json, math, numpy as np
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
CHI = [0, 1, 1j, -1j, -1]; ADH = [0, 1, KAPPA, -KAPPA, -1]
d = json.load(open(sys.argv[1])); G = d['glob']; P = np.array([g['P'] for g in G]); Q = np.array([g['sum_log2_over_p'] for g in G])
dQ = np.diff(np.concatenate([[0], Q])); lp = np.log(P)
sel = [i for i, p in enumerate(P) if abs(math.log10(p) - round(math.log10(p))) < 1e-9 and p >= 99]
out = {}
for nm, L in d['lists'].items():
    Lc = 0.5 * (np.array(L['L_edges'][1:]) + np.array(L['L_edges'][:-1])); wL = np.array(L['L_hist']) / sum(L['L_hist'])
    m = np.array([(wL * np.minimum(1 / np.maximum(Lc, 0.3), 1 / l)).sum() for l in lp])     # E_gamma min(1/L, 1/log p)
    pred = -np.cumsum(dQ * m); landau = -Q * (wL / np.maximum(Lc, 0.3)).sum()
    A = {f: np.array([c[f][0] + 1j * c[f][1] for c in L['cps']]) for f in L['cps'][0] if f != 'P'}
    B = [A['r%d' % r] for r in range(5)]
    fam = dict(true=A['true'].real, rsign=A['rsign'].real, thin=(A['true'] - 2 * A['thin']).real, uni1=A['uni1'].real, uni025=A['uni2'].real,
               chi=sum((CHI[r] * np.conj(B[r])).real for r in range(5)), chibar=sum((np.conj(CHI[r]) * np.conj(B[r])).real for r in range(5)),
               dhc=sum(ADH[r] * B[r].real for r in range(5)))
    for q in (2, 101, 1000003):
        fam['tnr%d' % q] = A['true'].real + np.where(P >= q, 2.2 * math.log(q) * L['qvals'][str(q)][0], 0.0)
    dr = np.array(L['direct'])
    print('\n## %s  M=%d  T in [%.4g, %.4g]  cond %g  L mean %.3f (min %.2f max %.2f) ; nufft vs direct: max abs diff %.1e over %d primes' % (nm, L['M'], L['T_lo'], L['T_hi'], L['cond'], L['L_mean'], L['L_min'], L['L_max'], dr[:, 1].max(), len(dr)))
    print('| P | alpha=logP/L | pred F=min(a,1) | Landau diag | true | chi | chibar | dhc | rsign | thin | uni b=1 | uni b=.25 | tnr2 | tnr101 | tnr1e6+3 |')
    print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
    for i in sel:
        print('| 1e%d | %.2f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3f |' % (round(math.log10(P[i])), lp[i] / L['L_mean'], pred[i], landau[i], fam['true'][i], fam['chi'][i], fam['chibar'][i], fam['dhc'][i], fam['rsign'][i], fam['thin'][i], fam['uni1'][i], fam['uni025'][i], fam['tnr2'][i], fam['tnr101'][i], fam['tnr1000003'][i]))
    # apparent coefficients per class in the Landau range (P = 1e3): -B_r * L / Q_r with Q_r ~ Q/4
    i3 = sel[1]; Lm = 1 / (wL / np.maximum(Lc, 0.3)).sum()
    app = [complex(-B[r][i3] * Lm / (Q[i3] / 4)) for r in range(1, 5)]
    print('apparent class coefficients at P=1e3 (complete L-function with coefficient a(p): a on class r): ' + ', '.join('r=%d: %.3f%+.3fi' % (r + 1, a.real, a.imag) for r, a in enumerate(app)))
    print('single primes: ' + ', '.join('q=%s: mean cos(gamma log q) %.5f (Landau %.5f)' % (q, v[0], -math.log(int(q)) / math.sqrt(int(q)) / Lm) for q, v in L['qvals'].items()))
    out[nm] = dict(P=[float(P[i]) for i in sel], pred=[float(pred[i]) for i in sel], **{k: [float(v[i]) for i in sel] for k, v in fam.items()})
json.dump(out, open(sys.argv[1].replace('.json', '_table.json'), 'w'))
