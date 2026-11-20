"""Exponent statistic of the pinned LP value = psi_k^F(X)/X^k: excess over the polar terms, sup and rms per decade."""
import json, sys, math, numpy as np, mpmath as mp
T = json.load(open(sys.argv[1])); X = np.array(T['X'], dtype=np.float64); P = {k: np.array(v) for k, v in T['psi'].items()}
tn = T['tnr']; q, c, al, be = tn['q'], tn['c'], tn['alpha'], tn['beta']
FACT = [1, 1, 2]
def poly(s, k): return np.prod([s + j for j in range(k + 1)])
mp.mp.dps = 25
c0_zeta = -math.log(2 * math.pi)
def c0E(a): return float(-mp.zeta(a, derivative=1) / mp.zeta(a) - mp.zeta(-a, derivative=1) / mp.zeta(-a))
out = {}
def stats(name, E):
    rows = []
    for m in range(2, int(round(math.log10(X[-1])))):
        sel = (X >= 10 ** m) & (X < 10 ** (m + 1)); rows.append([m, float(np.abs(E[sel]).max()), float(np.sqrt((np.abs(E[sel]) ** 2).mean()))])
    out[name] = rows
    return rows
for k in (0, 1, 2):
    Ez = (P['zeta'][:, k] - X / FACT[k] / (k + 1) - c0_zeta / FACT[k]) / np.sqrt(X); stats(f'zeta k={k}', Ez)
    for a, key in ((0.02, 'Ea0.02'), (0.1, 'Ea0.1')):
        main = sum(X ** s / poly(s, k) for s in (1 + a, 1 - a)) + c0E(a) / FACT[k]
        E = (P[key][:, k] - main) / np.sqrt(X); stats(f'{key} k={k} (over 2 sqrt X)', E / 2)
    # T-NR: zeta plus atoms at q^j
    Pt = P['zeta'][:, k].copy(); j = 1; qq = q
    while qq <= X[-1]:
        Pt += np.where(X >= qq, (-1) ** (j + 1) * (al ** j + be ** j) * math.log(q) * np.maximum(1 - qq / X, 0) ** k / FACT[k], 0.0); qq *= q; j += 1
    stats(f'TNR k={k}', (Pt - X / FACT[k] / (k + 1) - c0_zeta / FACT[k]) / np.sqrt(X))
    for key in ('chi4', 'chi5', 'randsign'): stats(f'{key} k={k}', P[key][:, k] / np.sqrt(X))
    stats(f'ded4 k={k}', (P['zeta'][:, k] + P['chi4'][:, k] - X / FACT[k] / (k + 1)) / np.sqrt(X))
    lmain = -X / FACT[k] / (k + 1) + np.sqrt(X) / poly(0.5, k)
    stats(f'liouville k={k}', (P['liouville'][:, k] - lmain) / np.sqrt(X))
    s = 1 - 1j; um = X ** s / poly(s, k)
    stats(f'unimod k={k}', (P['unimod_re'][:, k] + 1j * P['unimod_im'][:, k] - um) / np.sqrt(X))
json.dump(out, open(sys.argv[2], 'w'), indent=0)
for k in (0, 1, 2):
    print(f"k={k}: sup over the decade [10^m, 10^(m+1)) of |excess|/sqrt X   (E_a divided by 2)")
    names = [f'zeta k={k}', f'Ea0.02 k={k} (over 2 sqrt X)', f'Ea0.1 k={k} (over 2 sqrt X)', f'TNR k={k}', f'chi4 k={k}', f'chi5 k={k}', f'ded4 k={k}', f'liouville k={k}', f'randsign k={k}', f'unimod k={k}']
    print('  m   ' + '  '.join(n.split(' k=')[0][:9].rjust(9) for n in names))
    for i in range(len(out[names[0]])):
        print(f"  {out[names[0]][i][0]}   " + '  '.join(f"{out[n][i][1]:9.4f}" for n in names))
    z = out[names[0]]; e = out[names[1]]; e1 = out[names[2]]
    print('  ratio E_a/zeta (a=0.02):', [round(e[i][1] / z[i][1], 3) for i in range(len(z))], ' cosh(a log X) mid-decade:', [round(math.cosh(0.02 * math.log(10) * (z[i][0] + 0.5)), 3) for i in range(len(z))])
    print('  ratio E_a/zeta (a=0.1): ', [round(e1[i][1] / z[i][1], 3) for i in range(len(z))], ' cosh:', [round(math.cosh(0.1 * math.log(10) * (z[i][0] + 0.5)), 3) for i in range(len(z))])
