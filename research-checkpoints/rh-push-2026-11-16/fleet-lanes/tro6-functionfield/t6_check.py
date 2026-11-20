import sys, numpy as np, pickle
from fflib import *
from t4_analyse import pstar
res = pickle.load(open('ck_n6.pkl', 'rb')); rows = pickle.load(open('rows.pkl', 'rb'))
u0 = q ** (-7 / 6)
NUS = {'triv': None, 'T1': ((0, 1), 1), 'T2': ((0, 1), 2), 'Q1': ((3, 0, 1), 1)}
s6, s3 = Sym(6), Sym(3)
def nuval(nu, A):
    if nu is None: return 1
    r = pres(A, nu[0]); return 0 if r == 0 else Z6[(nu[1] * int(LOG[r])) % 6]
def mu(A):
    f = factor(A); return 0 if any(a > 1 for _, a in f) else (-1) ** len(f)
def phi(A):
    v = 1
    for P, a in factor(A): v *= q ** (len(P) - 1) - 1
    return v
print('=== Theorem 1 check: sum_{deg m=d} c_j(m) R_N(m) = delta_{jN} q^(d-N) sum_A g6(1,A) g3(1,A) nu(A) phi(A),  j+N<=d ===')
for d in (2, 3, 4):
    Ms = monics(d)
    for nm, nu in NUS.items():
        for N in range(1, d):
            if (d, nm, 1, N) not in rows: continue
            for j in range(0, d - N + 1):
                lhs = np.sum(res[(d, j)] * rows[(d, nm, 1, N)])
                rhs = 0
                if j == N:
                    for A in monics(N):
                        if mu(A) == 0: continue
                        rhs += g1_sf(s6, A) * g1_sf(s3, A) * nuval(nu, A) * phi(A)
                    rhs *= q ** (d - N)
                    # Euler side: kappa_N q^d sum mu nu phi
                    S = sum(mu(A) * nuval(nu, A) * phi(A) for A in monics(N))
                    extra = f'  |sum mu nu phi|={abs(S):.3f}  q^(3N/2)={q**(1.5*N):.2f} q^(2N)={q**(2*N)}  | |lhs|/(q^(d+N)|S|)={abs(lhs)/(q**(d+N)*abs(S)) if abs(S)>1e-9 else float("nan"):.6f}'
                else:
                    extra = ''
                print(f' d={d} nu={nm} N={N} j={j}: |lhs|={abs(lhs):.4e} |lhs-rhs|={abs(lhs-rhs):.2e}' + extra)
print()
print('=== central-value rows: Theta(d) = sum_m rho(m) T_m(1/q) ; r = |Theta|/(|rho||T|), null q^(-d/2) ===')
def r(a, b):
    return abs(np.sum(a * b)) / (np.linalg.norm(a) * np.linalg.norm(b))
for d in (1, 2, 3, 4):
    ps = [(1 - 1 / q) * pstar(res, 6, d, j) * u0 ** j for j in range(d + 2)]
    tot = sum(ps)
    for nm in NUS:
        for e in (1, 5):
            if (d, nm, e, 6) not in rows or (d, nm, 'L', 0) not in rows: continue
            t = []
            for N in range(7):
                v = 0
                for j in range(3):
                    if N - 3 * j < 0: break
                    v = v + rows[(d, nm, e, N - 3 * j)] * q ** (2 * j) * rows[(d, nm, 'L', j)]
                t.append(v)
            tail = max(np.abs(t[5]).max() / q ** 5, np.abs(t[6]).max() / q ** 6)
            deg = max([N for N in range(7) if np.abs(t[N]).max() > 1e-9] + [0])
            if tail < 1e-9:
                cen = sum(t[N] * q ** (-N) for N in range(7))
                kind = f'polynomial deg {deg}; central value'
                vec = cen
            else:
                kind = f'not terminated by N=6 (pole or degree>6); using t_6'
                vec = t[6]
            out = [f'total {r(tot, vec):.4f}/{r(tot, np.conj(vec)):.4f}']
            for j in range(1, d + 2):
                if np.linalg.norm(ps[j]) > 1e-12:
                    out.append(f'cls{j} {r(ps[j], vec):.4f}/{r(ps[j], np.conj(vec)):.4f}')
            print(f' d={d} nu={nm} e={e} [{kind}] null={q**(-d/2):.4f}: ' + ' '.join(out))
