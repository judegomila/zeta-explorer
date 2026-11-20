"""Combination 2, second part: the Li-Weil form at the anchor s = 1 (a = 1/2) with the first K zeta zeros moved to beta + i gamma_k.
The repository matrix (src/math/weil-breaking-point.js, read as text) adds for an off-line zero the Gram matrix of the real 2-vectors
(Re, Im)(1 - w^j): that matrix is positive semidefinite for every N and every K by construction (PROVED: it is a sum of Gram matrices).
The Hermitian form attached to xi is the Toeplitz matrix of the Taylor data at a = 1/2 (congruent to the Li matrix); here its sections
are tested with (i) 'quad': each moved zero replaced by the FE-symmetric pair beta, 1-beta (and conjugates);
(ii) 'moved': each zero moved to beta without its partner (the functional equation is lost; closest to the repository construction).
Output: first section size N that is indefinite, for K = 1, 2, 5, 10, 20, 50, 100, 200 and beta = 0.6, 0.75, 0.9."""
import json, sys
from flint import arb, acb, ctx
import core
ctx.prec = int(sys.argv[2]) if len(sys.argv) > 2 else 6000
N = int(sys.argv[1]) if len(sys.argv) > 1 else 120
a = arb(1) / 2
c = [x.mid() for x in core.moments('ZETA', a, N)]
r = core.levinson(c); print('base: last index', r[-1][0], 'sign', core.sign(r[-1][2]), 'log2 E', core._l2(r[-1][2]), 'c0', c[0].str(15), flush=True)
Z = json.load(open('zeros_ZETA.json'))[:200]
on = [core.zero_moment(arb(0), arb(g), a, N) for g in Z]
res = dict(N=N, prec=ctx.prec, base_last_index=r[-1][0], base_log2E=core._l2(r[-1][2]), rows=[])
for beta in ('0.6', '0.75', '0.9'):
    d = arb(beta) - arb(1) / 2
    plus = [core.zero_moment(d, arb(g), a, N) for g in Z]
    minus = [core.zero_moment(-d, arb(g), a, N) for g in Z]
    for K in (1, 2, 5, 10, 20, 50, 100, 200):
        row = dict(beta=beta, K=K)
        for mode in ('quad', 'moved'):
            c2 = list(c)
            for k in range(K):
                for j in range(N):
                    c2[j] = c2[j] - on[k][j] + plus[k][j] + (minus[k][j] if mode == 'quad' else 0)
            rr = core.levinson(c2); n, kk, E = rr[-1]
            row[mode] = (n + 1) if not (E > 0) else None
        res['rows'].append(row); print(row, flush=True)
json.dump(res, open('li_weil.json', 'w'), indent=1)
