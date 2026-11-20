"""c18-u6c job2: the diagonal array t(m) = conj(gamma_2(m)) (cubic Gauss sums, m squarefree primary coprime to 6),
which by the lemma of RESULT.md section 2 carries the Whittaker coefficients tau(m, m) of the cubic theta function on
GL(3) up to N(m)^(-1/6). First 1e5 indices by norm. Checks: modulus, cube identity at primes, and the candidate sign
inequality (C3)  Re S_w(X) > 0,  S_w(X) = sum_m t(m) w(N m / X), w(t) = (1 - t)^3, against twins xi(m) t(m) with xi
completely multiplicative and unimodular (same modulus, same support, same twisted-multiplicativity cocycle).
Usage: python job2.py table.npz count out.json"""
import sys, json, math
import numpy as np
d = np.load(sys.argv[1]); cnt = int(float(sys.argv[2]))
N = d['N']; order = np.argsort(N, kind='stable')[:cnt]
print(f"planned: {cnt} indices, arrays < 50 MB", flush=True)
Nn = N[order].astype(float); g = d['g2'][order]; a = d['na'][order].astype(float); b = d['nb'][order].astype(float)
depth = d['depth'][order]; m9 = d['m9'][order]
t = np.conj(g)
z = a - b / 2 + 1j * b * math.sqrt(3) / 2
out = {'count': cnt, 'Nmax': float(Nn.max()), 'mod_dev': float(np.abs(np.abs(t) - 1).max())}
pr = depth == 1
u = z[pr] / np.abs(z[pr])
out['cube_dev_gam3_plus_unit'] = float(np.abs(g[pr] ** 3 + u).max())            # gamma^3 = -pi/|pi| ?
out['cube_dev_gam3_plus_conj'] = float(np.abs(g[pr] ** 3 + np.conj(u)).max())   # or -conj(pi)/|pi|
out['n_primes'] = int(pr.sum())
# cubic character mod the first prime of norm 7 (table prime 0), by Euler's criterion
pa, pb, pp, pw = int(d['pa'][0]), int(d['pb'][0]), int(d['pp'][0]), int(d['pw'][0])
r = (d['na'][order] % pp + (d['nb'][order] % pp) * pw) % pp
val = np.array([pow(int(x), (pp - 1) // 3, pp) for x in r])
om = np.exp(2j * np.pi / 3)
chi7 = np.where(val == 1, 1, np.where(val == pw, om, np.where(val == (pw * pw) % pp, om ** 2, 0)))
twins = {'theta (xi = 1)': np.ones(cnt, dtype=complex),
         'Liouville twist xi = (-1)^Omega': (-1.0) ** depth + 0j,
         'angular twist xi = (m/|m|)^3': (z / np.abs(z)) ** 3,
         'cubic character twist xi = (m/P7)_3': chi7,
         'class m = 1 mod 9 only': (m9 == 0) + 0j,
         'class index 1 mod 9 only': (m9 == 1) + 0j,
         'class index 4 mod 9 only': (m9 == 4) + 0j}
grid = np.unique(np.round(np.geomspace(30, Nn.max(), 400)))
res = {}
for name, xi in twins.items():
    v = t * xi
    S = np.array([(v * np.where(Nn < X, (1 - np.minimum(Nn / X, 1)) ** 3, 0)).sum() for X in grid])
    neg = grid[S.real <= 0]
    lead = S[-1] / grid[-1] ** (5 / 6)
    res[name] = {'S_last': [S[-1].real, S[-1].imag], 'S_last_over_X^(5/6)': [lead.real, lead.imag],
                 'arg_last_deg': float(np.degrees(np.angle(S[-1]))),
                 'n_grid_with_Re_le_0': int(len(neg)), 'last_X_with_Re_le_0': float(neg.max()) if len(neg) else None,
                 'min_Re_over_abs': float((S.real / np.abs(S)).min()),
                 'abs_S_over_X^(5/6) at X/8, X/4, X/2, X': [float(abs(S[np.searchsorted(grid, grid[-1] / k) - (k > 1)]) /
                                                         grid[np.searchsorted(grid, grid[-1] / k) - (k > 1)] ** (5 / 6)) for k in (8, 4, 2, 1)]}
    print(name, json.dumps(res[name]), flush=True)
out['inequality_C3'] = res; out['grid_points'] = int(len(grid))
json.dump(out, open(sys.argv[3], 'w'), indent=1)
print(json.dumps({k: v for k, v in out.items() if k != 'inequality_C3'}))
