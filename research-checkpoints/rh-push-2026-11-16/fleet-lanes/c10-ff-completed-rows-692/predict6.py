"""predict6.py : numbers fixed BEFORE the (6, 9, 2) run, q = 7.
(1) Law numbers (round-8 law with exact inputs from `ffx sc`, `ffx en` at lam = 0; no row data):
    B0_law = wt(12,0)^2 q^(2d) S_cop(0)^2 / (q^d q^(N+lam) np D_6)   [squarefree row S_6: only k = 0 is active: r = 12, class "other", wt^2 = q * q^4]
    eU_law = (np / q^lam) * q * q^2                                    [companion row S_0 at (0, 9, 2): k = 0, r = 6]
    Delta2_law = q^2 * mean_m |V_2(m)|^2 * eU_law * np * q^d / D_c     [cube term j = 2, |S_0|^2 spread evenly over m]
(2) Exact parts of the completed (6, 9, 2) row that do not need the new run (stored exact rows of c9 at (3, 9, 2) and (0, 9, 2)):
    E_1 = q sum |V_1|^2 |S_3|^2, E_2 = q^2 sum |V_2|^2 |S_0|^2, cross_12, and the diagonal D_c (D_6 from `ffx en` at lam = 0 for the real vectors).
Output: predictions6.json, predictions6.txt."""
import subprocess, json
from assemble6 import *
def run(args): return subprocess.run(['./ffx'] + [str(x) for x in args], capture_output=True, text=True).stdout
N, lam, d = 6, 9, 2; np_ = 4483696
W3 = load('ref/q7_N3_lam9_d2.txt'); W0 = load('ref/q7_N0_lam9_d2.txt'); assert W3[0]['np'] == np_
out = {}; L = ['vector | D_6 | S_cop(0) of S_6 | B0_law | mean V_1^2 | mean V_2^2 | eU_law | Delta2_law | exact from stored rows: E_1/D_c | E_2/D_c | cross_12/D_c | K = sum | D_0/D_c | D_c | D_c naive']
for name in ('one', 'a', 'b', 'mu'):
    w = VEC[name]
    D6 = int(run(['en', q, d, N, 0, w[0], w[1], w[2], w[3], 0]).split('|')[3])
    S0c = int(run(['sc', q, d, N, lam, w[0], w[1], w[2], w[3], 0]).split('|')[1].split()[0])
    B0 = Fr(q * q**4 * q**(2*d) * S0c**2, q**d * q**(N+lam) * np_ * D6)
    fake = {'np': np_, 'diag': np_ * D6, 'rows': [(0, 0)] * q**d}
    c = completed(N, d, name, {6: fake, 3: pick(W3, name), 0: pick(W0, 'one')})
    mV = {j: Fr(sum(norm(v) for v in c['V2'][j]), q**d) for j in (1, 2)}
    eU = Fr(np_ * q**3, q**lam); D2 = q*q * mV[2] * eU * np_ * q**d / c['D']
    K = Fr(c['E'], c['D'])
    out[name] = {'D6': D6, 'Scop0': S0c, 'B0_law': float(B0), 'meanV1sq': float(mV[1]), 'meanV2sq': float(mV[2]), 'eU_law': float(eU), 'Delta2_law': float(D2),
                 'E1_over_Dc': float(Fr(c['Ej'][1], c['D'])), 'E2_over_Dc': float(Fr(c['Ej'][2], c['D'])), 'cross12_over_Dc': float(Fr(c['cross']['12'], c['D'])), 'K': float(K),
                 'D0_over_Dc': float(Fr(c['diag'][0], c['D'])), 'D_c': c['D'], 'D_c_naive': c['D_naive'], 'E1': c['Ej'][1], 'E2': c['Ej'][2], 'cross12': c['cross']['12'],
                 'V2': [v[0] for v in c['V2'][2]], 'V1': [v[0] for v in c['V2'][1]]}
    o = out[name]
    L.append(f"{name} | {D6} | {S0c} | {o['B0_law']:.4g} | {o['meanV1sq']:.4g} | {o['meanV2sq']:.4g} | {o['eU_law']:.4g} | {o['Delta2_law']:.4g} | {o['E1_over_Dc']:.4g} | {o['E2_over_Dc']:.4g} | {o['cross12_over_Dc']:.4g} | {o['K']:.4g} | {o['D0_over_Dc']:.4g} | {c['D']} | {c['D_naive']}")
json.dump(out, open('predictions6.json', 'w'), indent=0); open('predictions6.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
