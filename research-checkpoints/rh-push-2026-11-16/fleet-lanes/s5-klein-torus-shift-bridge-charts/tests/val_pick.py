"""Engine check on functions with known answers (same nodes as the DH geometry, n = 200, 4000 bits):
 B1: finite Blaschke product of 6 factors (Schur on Re w > 0; Pick matrix of rank 6: pivots 7.. are exactly zero -> 'undetermined at 7')
 E1: exp(-w) (Schur, infinite rank): no negative pivot
 E2: exp(-w) (w - 3)/(w + 3) ... still Schur
 N1: exp(-w) (w + 3 - 5i)/(w - 3 - 5i): a pole at 3 + 5i -> one negative square
 Z : completed zeta ratio with xi evaluated by mpmath for 40 nodes against the flint value (same S)"""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from flint import acb, arb, ctx
import pick, objs
bits = 4000; ctx.prec = bits; n = 200
nd = pick.nodes(0.01, 2, -21, 21, n)
W = [acb(arb(x), arb(y)) for x, y in nd]
def run(name, f):
    S = [f(w) for w in W]; Sc = [s.conjugate() for s in S]
    A = [[(1 - S[i] * Sc[j]) / (W[i] + W[j].conjugate()) for j in range(i + 1)] for i in range(n)]
    piv = pick.ldl(A, n)
    signs = [(-1 if p < 0 else (1 if p > 0 else 0)) for p in piv]
    print(name, 'pivots computed', len(piv), 'negative at', [k + 1 for k, s in enumerate(signs) if s < 0][:10], 'undetermined at', [k + 1 for k, s in enumerate(signs) if s == 0][:3], flush=True)
zk = [acb(1, 2), acb(0.5, -7), acb(2, 15), acb(0.1, 0), acb(3, -19), acb(0.7, 9)]
def B1(w):
    p = acb(1)
    for z in zk: p *= (w - z) / (w + z.conjugate())
    return p
run('B1', B1)
run('E1', lambda w: (-w).exp())
run('E2', lambda w: (-w).exp() * (w - 3) / (w + 3))
run('N1', lambda w: (-w).exp() * (w + acb(3, 5)) / (w - acb(3, 5)))
