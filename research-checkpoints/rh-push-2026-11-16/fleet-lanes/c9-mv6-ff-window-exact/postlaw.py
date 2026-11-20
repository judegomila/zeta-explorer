"""postlaw.py : POST-HOC refinement of the coherent law (written after PREREG.md; not an advance prediction).
The law of round 8 counts the sixth-power dual frequencies without their coprimality to A.  Refinement: a frequency a l^6 (a in F_q^*, l monic of
degree j) is counted only if (l, A) = 1, i.e. the factor q^j of the count is replaced by cop_j(A) inside the Moebius sum:
  class 6 | k - N - lam :  G(A) = (q-1) sum_{j <= floor((r-1)/6)} cop_j(A) - [6 | r] cop_{r/6}(A)      (r >= 1)
  other classes, 6 | r  :  G(A) = sqrt(q) cop_{r/6}(A)
  S*(k) = sum_{A = P A'} mu(A) W(A) cop_k(A) G(A) = - pi(lam) sum_{A'} u(A') mu(A') cop_k(A') G(A')        (lam > N, lam > r/6)
  B_corr = sum_{k <= d/2} q^(2d) S*(k)^2 / (||c_k||^2 q^(N+lam) diagsum).
Squarefree rows only (for N = 3 the comparison is with the squarefree row).  Output: postlaw.txt."""
import json, math
from fractions import Fraction as Fr
from ffpy import FF
from plan import *
res = json.load(open('results.json')); L = []; stats = {}
cache = {}
def tables(q, N, d):
    if (q, N, d) in cache: return cache[(q, N, d)]
    F = FF(q); Wq = weights(q); As = [F.idx2poly(i, N) for i in range(q**N)]
    mu = []; cop = []
    for A in As:
        g = F.gphase(A, 0); mu.append(0 if g is None else (-1 if (3*N + g) % 6 == 3 else 1))
        cop.append([sum(1 for i in range(q**j) if F.res(F.idx2poly(i, j), A) != 0) for j in range(3)])
    U = {}
    for name in PROBE[q] + ['mu']:
        mode, p1, p2, p3 = Wq[name]
        if name == 'one': U[name] = [1]*len(As)
        elif name == 'mu': U[name] = mu[:]
        else:
            Fp = F.idx2poly(p2, p1); U[name] = []
            for A in As:
                R = F.res(Fp, A); U[name].append(0 if R == 0 else (-1 if (p3*F.L6[R]) % 6 == 3 else 1))
    cache[(q, N, d)] = (mu, cop, U); return cache[(q, N, d)]
L.append('q (N,lam,d) weight | e (squarefree row) | B_coh (round-8 law) | B_corr (post hoc) | n = e - B_corr')
for rec in res:
    if not rec['run']: continue
    q, N, lam, d = rec['q'], rec['N'], rec['lam'], rec['d']; mu, cop, U = tables(q, N, d); npr = rec['np']
    for name in PROBE[q] + ['mu']:
        r_ = rec['w'][name]; e = Fr(r_['e_sqf']); diagsum = r_['diag']; B = 0.0
        for k in range(d//2 + 1):
            r = k + N + lam - 1 - d; princ = (k - N - lam) % 6 == 0
            if r // 6 > 2: raise SystemExit('r too large for the tables')
            s = 0; fac = 1.0
            for i in range(len(mu)):
                if mu[i] == 0 or U[name][i] == 0: continue
                if princ: G = (q-1)*sum(cop[i][j] for j in range((r-1)//6 + 1)) - (cop[i][r//6] if r % 6 == 0 else 0)
                elif r % 6 == 0: G = cop[i][r//6]
                else: G = 0
                s += U[name][i]*mu[i]*cop[i][k]*G
            if not princ: fac = q
            nck = q**d if k == 0 else q**(d+2*k)*(1 - 1/q)
            B += fac * q**(2*d) * (npr*s)**2 / (nck * q**(N+lam) * diagsum)
        n = float(e) - B; cls = 'active' if B > 0 else 'inactive'
        stats.setdefault((cls, 'target' if name not in ('one', 'mu') else name), []).append(n)
        L.append(f"{q} ({N},{lam},{d}) {name} | {float(e):.4g} | {r_.get('B_coh', float('nan')):.4g} | {B:.4g} | {n:.4g}")
L.append('')
L.append('non-coherent part n = e - B_corr: class/vector: count, min, median, max')
for k, v in sorted(stats.items()):
    v = sorted(v); L.append(f'{k[0]}/{k[1]}: {len(v)}, {v[0]:.3g}, {v[len(v)//2]:.3g}, {v[-1]:.3g}')
open('postlaw.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L[-8:]))
