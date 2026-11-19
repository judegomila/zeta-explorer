"""analyze6.py : exact statistics of the (6, 9, 2) run (PREREG sections 2, 5, 6).  Reads results/q7_N6_lam9_d2.txt and the stored rows in ref/.
Every ratio is an exact Fraction; floats only for display.  Writes summary6.txt and results6.json."""
import json
from assemble6 import *
N, lam, d = 6, 9, 2
W6 = load('results/q7_N6_lam9_d2.txt'); W3 = load('ref/q7_N3_lam9_d2.txt'); W0 = load('ref/q7_N0_lam9_d2.txt')
P = json.load(open('predictions6.json'))
ms, m0, ns, sqof, chi3, A3, sqf3, copA3 = geometry(d)
vecs = [('one', 'one', None, 0), ('a', 'a', None, 0), ('b', 'b', None, 0), ('mu', 'mu', None, 0), ('al', 'al', None, 0), ('r11', 'r', 11, 0), ('r12', 'r', 12, 1), ('r13', 'r', 13, 2)]
out = {}; L = []
def f(x, k=4): return f'{float(x):.{k}g}'
for label, name, seed, i in vecs:
    if name == 'r': S = {6: pick(W6, 'r', seed), 3: pick(W3, 'r'), 0: pick(W0, 'r')}
    elif name == 'al': S = {6: pick(W6, 'al'), 3: pick(W3, 'al'), 0: pick(W0, 'al')}
    else: S = {6: pick(W6, name), 3: pick(W3, name), 0: pick(W0, 'one')}
    c = completed(N, d, name, S, 20261119 + i); D = c['D']; D0 = c['diag'][0]; E0 = c['Ej'][0]
    r = {'np': c['np'], 'E_c': c['E'], 'D_c': D, 'D_c_naive': c['D_naive'], 'E_0': E0, 'D_0': D0, 'E_1': c['Ej'][1], 'E_2': c['Ej'][2], 'cross': c['cross'], 'diag_parts': c['diag'],
         'e_c': Fr(c['E'], D), 'e_c_naive': Fr(c['E'], c['D_naive']), 'e_s': Fr(E0, D0), 'b_s': Fr(c['J0sq_sqf'], q**d * D0), 'b_c': Fr(c['J0sq_completed'], q**d * D),
         'E_sq_rows': c['E_sq_rows'], 'E0_sq_rows': c['E0_sq_rows']}
    # split of V_2 into the n = l^2 part and the squarefree-n part (text comparison with MS section 7.2): energies of the two parts of the j = 2 term
    if name != 'r' and name != 'al':
        V2 = [v[0] for v in c['V2'][2]]
        cf2 = [coef(name, n, m0)[0] for n in ns[2]]
        Vsq = [sum(cf2[i]*chi3[2][i][mi] for i, n in enumerate(ns[2]) if tuple(n) in sqof) for mi in range(len(ms))]
        Vsf = [V2[mi] - Vsq[mi] for mi in range(len(ms))]
        S0 = S[0]['rows']
        r['E2_square_n'] = q*q*sum(Vsq[mi]**2 * norm(S0[mi]) for mi in range(len(ms))); r['E2_sqfree_n'] = q*q*sum(Vsf[mi]**2 * norm(S0[mi]) for mi in range(len(ms)))
        r['E2_mixed'] = c['Ej'][2] - r['E2_square_n'] - r['E2_sqfree_n']; r['meanVsq2'] = Fr(sum(v*v for v in Vsq), len(ms)); r['meanVsf2'] = Fr(sum(v*v for v in Vsf), len(ms))
    out[label] = r
hdr = 'vector | e_c = E_c/D_c | x_c = e_c - 1 | e_s = E_0/D_0 | x_s | b_s (Bessel, c_0) | E_0/D_c | E_1/D_c | E_2/D_c | cross_01/D_c | cross_02/D_c | cross_12/D_c | e_c with naive diagonal | share of E_c on the 7 square rows'
L.append('TABLE 1. (N, lam, d) = (6, 9, 2), q = 7, np = %d. Exact rationals shown as floats.' % out['a']['np']); L.append(hdr)
for label, r in out.items():
    D = r['D_c']
    L.append(' | '.join([label, f(r['e_c'], 6), f(r['e_c'] - 1, 5), f(r['e_s'], 6), f(r['e_s'] - 1, 5), f(r['b_s'], 5), f(Fr(r['E_0'], D)), f(Fr(r['E_1'], D)), f(Fr(r['E_2'], D)),
                         f(Fr(r['cross']['01'], D)), f(Fr(r['cross']['02'], D)), f(Fr(r['cross']['12'], D)), f(r['e_c_naive'], 6), f(Fr(r['E_sq_rows'], r['E_c']), 3)]))
L.append(''); L.append('TABLE 2. Coherent part of the squarefree row against the law (B_0 law from predictions6.json).'); L.append('vector | b_s | B_0 law | ratio')
for v in ('one', 'a', 'b', 'mu'):
    B = P[v]['B0_law']; L.append(f"{v} | {f(out[v]['b_s'], 5)} | {B:.5g} | {(float(out[v]['b_s'])/B if B else float('nan')):.4f}")
L.append(''); L.append('TABLE 3. Cube term j = 2 split by the type of n (units D_c): n = l^2 part | squarefree-n part | mixed | mean (V_2 square part)^2 | mean (V_2 squarefree part)^2')
for v in ('one', 'a', 'b', 'mu'):
    r = out[v]; D = r['D_c']; L.append(f"{v} | {f(Fr(r['E2_square_n'], D))} | {f(Fr(r['E2_sqfree_n'], D))} | {f(Fr(r['E2_mixed'], D))} | {f(r['meanVsq2'])} | {f(r['meanVsf2'])}")
L.append(''); L.append('TABLE 4 (post hoc). Part of the row energy along the constant direction c_0 (Bessel): b_c = |sum_m R_m|^2/(q^d D_c) for the completed row, b_s for the squarefree row; share of E_0 on the 7 square rows.'); L.append('vector | b_c | b_c / e_c | b_s | b_s / e_s | share of E_0 on square rows')
for label, r in out.items(): L.append(f"{label} | {f(r['b_c'], 5)} | {f(r['b_c']/r['e_c'], 3)} | {f(r['b_s'], 5)} | {f(r['b_s']/r['e_s'], 3)} | {f(Fr(r['E0_sq_rows'], r['E_0']), 3)}")
# rule
a, b, one, mu = out['a'], out['b'], out['one'], out['mu']; xa = a['e_c'] - 1; xb = b['e_c'] - 1
rnd = [out[k] for k in ('r11', 'r12', 'r13')]
C_r = all(Fr(4, 7) <= r['e_s'] <= Fr(10, 7) and Fr(4, 7) <= r['e_c'] <= Fr(10, 7) and Fr(r['E_2'], r['D_c']) <= Fr(1, 5) for r in rnd)
C_al = out['al']['e_c'] >= 100; C_mu = mu['e_s'] >= 500 and mu['e_c'] >= 500
sep = C_r and C_al and C_mu and a['e_c'] > Fr(10, 7) and b['e_c'] > Fr(10, 7)
Lr = Fr(3, 5) <= xa <= 1; Lb = Fr(15, 1000) <= a['b_s'] <= Fr(25, 1000)
X = (0.99 <= float(xa) <= 1.65) and (0.95 <= float(xb) <= 1.58)
Bt = all(0.55 <= float(out[v]['b_s'])/P[v]['B0_law'] <= 1.25 for v in ('a', 'b')) and one['b_s'] == 0
St = all(out[v]['e_s'] <= Fr(6, 5) for v in ('a', 'b', 'one'))
L += ['', 'RULE (PREREG sections 5, 6).',
      f"(L) literal: x_c(a) = {f(xa, 5)} in [0.6, 1.0]: {Lr};  b_s(a) = {f(a['b_s'], 5)} in [0.015, 0.025]: {Lb}",
      f"(X) x_c(a) = {f(xa, 5)} in [0.99, 1.65] and x_c(b) = {f(xb, 5)} in [0.95, 1.58]: {X}",
      f"(B) b_s / B_0 law in [0.55, 1.25] for a and b, b_s(one) = 0: {Bt}",
      f"(S) e_s <= 1.2 for a, b, one: {St}  ({f(a['e_s'], 5)}, {f(b['e_s'], 5)}, {f(one['e_s'], 5)})",
      f"(C) random vectors inside [0.571, 1.429] with E_2/D_c <= 0.2: {C_r}; al >= 100: {C_al}; mu >= 500: {C_mu}; controls separated (and e_c(a), e_c(b) > 1.429): {sep}",
      f"Outcome 1 (CONFIRMED-AS-STATED): {Lr and Lb and sep}",
      f"Outcome 2 (CONFIRMED-EXACT-INPUTS): {X and Bt and St and sep}"]
open('summary6.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
def ser(o):
    if isinstance(o, Fr): return {'num': str(o.numerator), 'den': str(o.denominator), 'float': float(o)}
    if isinstance(o, dict): return {str(k): ser(v) for k, v in o.items()}
    if isinstance(o, int): return str(o) if abs(o) > 2**53 else o
    return o
json.dump(ser(out), open('results6.json', 'w'), indent=0)
