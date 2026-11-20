"""posthoc6.py : POST HOC (after the result was seen).  For the text comparison with MS section 7.2: how much of each part of the completed (6, 9, 2) row lies along the
constant direction c_0 = 1 (the direction read by the principal probe J_0 = sum_m R_m).  share(X) = |sum_m X_m|^2 / (q^d sum_m |X_m|^2), exact rationals."""
from assemble6 import *
d = 2; W6 = load('results/q7_N6_lam9_d2.txt'); W3 = load('ref/q7_N3_lam9_d2.txt'); W0 = load('ref/q7_N0_lam9_d2.txt')
ms, m0, ns, sqof, chi3, A3, sqf3, copA3 = geometry(d); nm = len(ms); Jb2 = mul(F.Jb, F.Jb)
def share(X):
    t = (0, 0)
    for x in X: t = add(t, x)
    E = sum(norm(x) for x in X); return (Fr(norm(t), nm*E) if E else Fr(0)), E
S0 = pick(W0, 'one')['rows']; L = ['vector | share along c_0 of: S_6 | Jbar V_1 S_3 | Jbar^2 V_2 S_0 | its n = l^2 part | its squarefree-n part | completed row | companion S_0 (all vectors): %.4f' % float(share(S0)[0]),
     '   and, in units of D_c, the c_0-component |sum_m X_m|^2/(q^d D_c) of: the n = l^2 part | the completed row']
import json; R = json.load(open('results6.json'))
for name in ('one', 'a', 'b', 'mu'):
    S6 = pick(W6, name)['rows']; S3 = pick(W3, name)['rows']
    cf = {j: [coef(name, n, m0)[0] for n in ns[j]] for j in (1, 2)}
    V1 = [sum(cf[1][i]*chi3[1][i][mi] for i in range(q)) for mi in range(nm)]
    Vsq = [sum(cf[2][i]*chi3[2][i][mi] for i, n in enumerate(ns[2]) if tuple(n) in sqof) for mi in range(nm)]
    Vsf = [sum(cf[2][i]*chi3[2][i][mi] for i, n in enumerate(ns[2]) if tuple(n) not in sqof) for mi in range(nm)]
    T1 = [mul(F.Jb, mul((V1[mi], 0), S3[mi])) for mi in range(nm)]
    Tq = [mul(Jb2, mul((Vsq[mi], 0), S0[mi])) for mi in range(nm)]; Tf = [mul(Jb2, mul((Vsf[mi], 0), S0[mi])) for mi in range(nm)]
    T2 = [add(Tq[mi], Tf[mi]) for mi in range(nm)]; Rw = [add(S6[mi], add(T1[mi], T2[mi])) for mi in range(nm)]
    Dc = int(R[name]['D_c']); assert sum(norm(x) for x in Rw) == int(R[name]['E_c'])
    sh = [share(X) for X in (S6, T1, T2, Tq, Tf, Rw)]
    L.append(f"{name} | " + ' | '.join(f'{float(s[0]):.4f}' for s in sh) + f" || {float(sh[3][0]*sh[3][1]/Dc):.4f} | {float(sh[5][0]*sh[5][1]/Dc):.4f}")
open('posthoc6.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
