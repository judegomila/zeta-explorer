"""check_slot.py -- numeric check of the slot identities used in RESULT section 4 (float screen):
 (a) tau_{pi c'} = tau_pi tau_{c'} chi_{c'}(pi)^4 for pi prime, c' squarefree prime to pi (tau = gamma_2 conj(alpha));
 (b) mu G version: (mu G)(pi c') = (mu G)(pi) (mu G)(c') * (bicharacter) -- only |.| = 1 is used, not checked here."""
import sys, numpy as np
from ek_common import *
T = Tab(float(sys.argv[1]) if len(sys.argv) > 1 else 40000.0)
key = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(T.na, T.nb))}
worst = 0.0; cnt = 0; miss = 0
for j in range(len(T.pp)):
    if T.pq[j] > 60: continue
    pi = (int(T.pa[j]), int(T.pb[j]))
    ipi = key.get(pi)
    if ipi is None: miss += 1; continue
    E = T.node_exps(T.prime_exps(np.array([pi[0]]), np.array([pi[1]])))[:, 0]      # exponent of chi_c(pi)
    for c in range(1, T.n):
        if E[c] >= 64 or T.N[c] * T.pq[j] > T.N.max(): continue
        prod = Zm.mul((int(T.na[c]), int(T.nb[c])), pi)
        ic = key.get((int(prod[0]), int(prod[1])))
        if ic is None: miss += 1; continue
        lhs = T.tau[ic]; rhs = T.tau[ipi] * T.tau[c] * Z6[(4 * E[c]) % 6]
        worst = max(worst, abs(lhs - rhs)); cnt += 1
print(f"checked {cnt} pairs (pi, c'), q_pi <= 60, q_pi q_c' <= {T.N.max():.0f}; lookups missed {miss}; max |tau(pi c') - tau(pi) tau(c') chi_c'(pi)^4| = {worst:.3e}")
