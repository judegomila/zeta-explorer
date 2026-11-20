"""Combination 4, prime side: Var N(ell) = 2 Var S - 2 Cov(S(t), S(t + tau)), tau = 2 pi ell / L, with the diagonal prime sum
Cov(tau) = (1/(2 pi^2)) sum_{p^k <= P} cos(tau k log p)/(k^2 p^k)   (P = 1e7; remainder oscillatory, bounded by 1/(tau log P) / (2 pi^2)),
Var S from the s3 lane (measured on the same lists). Compared with the measured ladder of c4b."""
import json, math, numpy as np, w3
PI = math.pi
n, p, k = w3.prime_powers(10 ** 7)
wt = 1.0 / (k.astype(float) ** 2 * n.astype(float)); ln = np.log(n.astype(float))
VARS = {'Z7': (0.206284, 14.36), 'Z8': (0.213607, 16.62), 'Z9': (0.220040, 18.89), 'Z10': (0.225821, 21.19), 'Z11': (0.231014, 23.49), 'Z12': (0.235737, 25.79)}
out = {}
for name, (vs, L) in VARS.items():
    r = json.load(open('out/c4b/c4_%s.json' % name)); rows = []
    for q in r['rows']:
        ell = q['ell']
        if ell < 16 or ell > 20000: continue
        tau = 2 * PI * ell / L
        cov = float((wt * np.cos(tau * ln)).sum()) / (2 * PI ** 2)
        pred = 2 * vs - 2 * cov
        rows.append(dict(ell=ell, measured=q['var'], err=q['var_err'], predicted=pred, diff=q['var'] - pred, rho=q['rho'],
                         rho_pred=None))
    # adjacent-box correlation: Cov(N1, N2) = -VarS + 2 C(tau) - C(2 tau)
    for row in rows:
        tau = 2 * PI * row['ell'] / L
        c1 = float((wt * np.cos(tau * ln)).sum()) / (2 * PI ** 2); c2 = float((wt * np.cos(2 * tau * ln)).sum()) / (2 * PI ** 2)
        row['rho_pred'] = (-vs + 2 * c1 - c2) / (2 * vs - 2 * c1)
    out[name] = rows
    print(name, ' | '.join('%g: %.4f/%.4f rho %.4f/%.4f' % (x['ell'], x['measured'], x['predicted'], x['rho'], x['rho_pred']) for x in rows))
json.dump(out, open('out/c4_prime.json', 'w'), indent=1)
