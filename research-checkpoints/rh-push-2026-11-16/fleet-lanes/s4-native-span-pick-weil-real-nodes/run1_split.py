"""Combination (1): inertia of the three parts of the zeta form on real nodes s_i = 1/2 + nu_i > 1.
c = arch + pole + prime, arch = psi(s/2)/2 - log(pi)/2, pole = 1/s + 1/(s-1), prime = zeta'/zeta(s) = -Z.
Each part gives a Loewner matrix [(f_i + f_j)/(nu_i + nu_j)]; LDL pivot signs by the Schur recursion (ball arithmetic).
usage: run1_split.py <out.jsonl> <family> <n> <bits>"""
import sys, json
from flint import arb, ctx
import lib, lib2
out, family, n, bits = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
ctx.prec = bits
nu = [lib2.node(family, k) for k in range(n)]
P = [lib2.parts(t) for t in nu]
def inertia(c):
    piv = lib.schur_real(nu, c, stop_at_negative=False)
    return dict(pos=sum(1 for p in piv if p[1] > 0), neg=sum(1 for p in piv if p[1] < 0), undecided_at=next((p[0] for p in piv if p[1] == 0), None),
                log2_last=piv[-1][2])
rec = dict(kind='split', family=family, n=n, bits=bits,
           arch=inertia([p[0] for p in P]), pole=inertia([p[1] for p in P]), prime=inertia([p[2] for p in P]),
           arch_plus_pole=inertia([p[0] + p[1] for p in P]), arch_plus_prime=inertia([p[0] + p[2] for p in P]),
           pole_plus_prime=inertia([p[1] + p[2] for p in P]), total=inertia([p[0] + p[1] + p[2] for p in P]),
           values_at_first_node=[float(x.mid()) for x in P[0]], first_node=float(nu[0].mid()))
open(out, 'a').write(json.dumps(rec) + '\n'); print(json.dumps(rec))
