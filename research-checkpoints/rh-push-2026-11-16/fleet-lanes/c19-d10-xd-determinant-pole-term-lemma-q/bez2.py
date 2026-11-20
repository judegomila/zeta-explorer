# The W-invariant "rank-2 Bezoutian" LL(x,y) = sum_w psi(wx) psi(wy) / ((w nu)_1 (w nu)_2), nu = x+y  (diagonal part of N).
# N(lam,mu) = sum_v sgn(v) LL(v lam, mu). Exact inertia of LL on the full polynomial space and of its isotypic parts.
from flint import fmpq, fmpq_mat
from fractions import Fraction as Fr
import random, sys
from xd import bpoly, inertia_q
def W(x):
    z1, z2 = x
    return [((z1, z2), 1), ((-z1, z1+z2), -1), ((z1+z2, -z2), -1), ((z2, -z1-z2), 1), ((-z1-z2, z1), 1), ((-z2, -z1), -1)]
def mk(b):
    def bev(u):
        r = fmpq(0)
        for c in reversed(b): r = r*u + c
        return r
    psi = lambda x: bev(x[0])*bev(x[1])*bev(x[0]+x[1])
    def LL(x, y):
        s = fmpq(0)
        for (wx, _), (wy, _) in zip(W(x), W(y)):
            s += psi(wx)*psi(wy)/((wx[0]+wy[0])*(wx[1]+wy[1]))
        return s
    return LL
def study(specs, base='pole', seed=1):
    b = bpoly(specs, base); n = len(b)-1; LL = mk(b); rng = random.Random(seed)
    D = 3*n; mons = [(i, j) for i in range(D+1) for j in range(D+1-i)]; m = len(mons)
    pts = [(fmpq(rng.randint(1, 400), rng.randint(3, 50)), fmpq(rng.randint(1, 400), rng.randint(3, 50))) for _ in range(m)]
    V = fmpq_mat(m, m, [p[0]**i*p[1]**j for p in pts for (i, j) in mons]); Vi = V.inv()
    G = fmpq_mat(m, m, [LL(p, q) for p in pts for q in pts])
    H = Vi*G*Vi.transpose()   # coefficient matrix in monomials
    # representation of W on monomials (x -> w x): matrices R_w with mon(wx) = R_w mon(x)
    def rep(wi):
        rows = []
        for p in pts:
            wp = W(p)[wi][0]; rows.append([wp[0]**i*wp[1]**j for (i, j) in mons])
        return Vi*fmpq_mat(m, m, [x for r in rows for x in r])   # mon(w p_k) = sum_l ... ; R such that V R^T = Vw
    Rs = [rep(k).transpose() for k in range(6)]   # V_w = V R^T  => mon(wp) = R mon(p)
    sg = [1, -1, -1, 1, 1, -1]
    tot = inertia_q([[H[i, j] for j in range(m)] for i in range(m)])
    out = dict(n=n, total=tot)
    # projections: P_triv = (1/6) sum R_w, P_sign = (1/6) sum sgn R_w ; form on component = P^T H P
    for name, ch in (('triv', [1]*6), ('sign', sg)):
        P = Rs[0]*0
        for k in range(6): P = P + Rs[k]*fmpq(ch[k], 6)
        Hc = P.transpose()*H*P
        out[name] = inertia_q([[Hc[i, j] for j in range(m)] for i in range(m)])
    out['std'] = (tot[0]-out['triv'][0]-out['sign'][0], tot[1]-out['triv'][1]-out['sign'][1])
    return out
if __name__ == '__main__':
    cases = [('b=u-1', [], 'pole'), ('b=u+a Hurwitz', [('s', '2/3')], 'minus'), ('pole + left real 1/4', [('s', '1/4')], 'pole'), ('pole + right real 3/4', [('s', '3/4')], 'pole'),
             ('sym real pair', [('r', '1/4')], 'pole'), ('sym line pair', [('l', '1')], 'pole'), ('left pair', [('p', '1/5', '2')], 'pole'), ('right pair', [('p', '4/5', '2')], 'pole'),
             ('left pair, minus', [('p', '1/5', '2')], 'minus'), ('real 1/4,2/3 pole', [('s', '1/4'), ('s', '2/3')], 'pole'), ('real 1/4,1/3 pole', [('s', '1/4'), ('s', '1/3')], 'pole'), ('real 3/5,2/3 pole', [('s', '3/5'), ('s', '2/3')], 'pole')]
    if len(sys.argv) > 1: cases = [('quartet', [('q', '1/4', '1')], 'pole'), ('quartet minus', [('q', '1/4', '1')], 'minus'), ('two left pairs', [('p', '1/5', '2'), ('p', '1/3', '1')], 'pole')]
    for name, sp, base in cases: print(name, study(sp, base), flush=True)
