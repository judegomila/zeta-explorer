import sys, numpy as np, pickle
from fflib import *
from t4_analyse import pstar
res = pickle.load(open('ck_n6.pkl', 'rb')); rows = pickle.load(open('rows.pkl', 'rb'))
u0 = q ** (-7 / 6)
print('=== completed row polynomial T_m(u) = [sum_N R_N u^N][sum_j L_j (q^2 u^3)^j]: max_m |t_N| / q^N ===')
def trow(d, nm, e, N, mode=0):
    tot = 0
    for j in range(0, 3):
        if N - 3 * j < 0 or (d, nm, e, N - 3 * j) not in rows: break
        tot = tot + rows[(d, nm, e, N - 3 * j)] * q ** (2 * j) * rows[(d, nm, 'L', j)]
    return tot
for d in (1, 2, 3, 4):
    for nm in ('triv', 'T1', 'Q1'):
        for e in (1, 5):
            if (d, nm, e, 6) not in rows: continue
            raw = [np.abs(rows[(d, nm, e, N)]).max() / q ** N for N in range(7)]
            t = [trow(d, nm, e, N) for N in range(7)]
            # also (1-q^4u^3) T and (1 - q^4 u^3)/(1-q^3u^3) T
            t2 = [t[N] - (q ** 4 * t[N - 3] if N >= 3 else 0) for N in range(7)]
            print(f' d={d} nu={nm} e={e}: R_N: ' + ' '.join(f'{x:.3f}' for x in raw))
            print(f'                 T: ' + ' '.join(f'{np.abs(x).max()/q**N:.3f}' for N, x in enumerate(t)) +
                  '   (1-q^4u^3)T: ' + ' '.join(f'{np.abs(x).max()/q**N:.3f}' for N, x in enumerate(t2)))
print()
print('=== normalised correlations r = |sum_m rho(m) B_N(m)| / (|rho| |B_N|);  null ~ q^(-d/2) ===')
def r(a, b):
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    if na < 1e-12 or nb < 1e-12: return float('nan')
    return abs(np.sum(a * b)) / (na * nb)
for d in (3, 4):
    if not all((d, k) in res for k in range(d + 2)): continue
    ps = [(1 - 1 / q) * pstar(res, 6, d, j) * u0 ** j for j in range(d + 2)]
    tot = sum(ps)
    print(f'--- d={d}, null q^(-d/2) = {q**(-d/2):.4f}; rows R_N (squarefree A, cubic Gauss sum, sextic symbol^e, target nu) ---')
    for nm in ('triv', 'T1', 'T2', 'Q1'):
        for e in (1, 5):
            if (d, nm, e, 6) not in rows: continue
            for conj in (0, 1):
                print(f' nu={nm} e={e} {"sesq" if conj else "bilin"}:')
                for lab, vec in [('total', tot)] + [(f'cls{j}', ps[j]) for j in range(1, d + 2)]:
                    vals = []
                    for N in range(1, 7):
                        B = rows[(d, nm, e, N)]
                        vals.append(r(vec, np.conj(B) if conj else B))
                    print(f'    {lab:6s} N=1..6: ' + ' '.join(f'{x:.4f}' for x in vals))
