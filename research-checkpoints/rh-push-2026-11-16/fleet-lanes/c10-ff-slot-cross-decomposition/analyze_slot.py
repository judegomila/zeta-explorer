"""analyze_slot.py : exact slot split from results/*.txt (ffs ens output).  Every quantity is an exact Fraction of exact integers; floats only for display.
  e = E/D, s = SD/D, c = CR/D = e - s, beta = B/D (B = |Pi R|^2, Pi = projection on span{v_0, v_1}; v_1 only for d >= 2), sb = SB/D,
  c_coh = beta - sb, c_perp = c - c_coh, n = e - beta.   Variant 1 (completed rows, N = 3): also beta4, sb4 for the span {v_0, v_1, V v_0, V v_1}.
Writes slot_results.json and prints the tables used in RESULT.md."""
import glob, re, json, sys, os, math
from fractions import Fraction as Fr
from wlist import wlist
class Z:  # element of Q(zeta_6), a + b zeta
    __slots__ = ('a', 'b')
    def __init__(s, a, b=0): s.a = Fr(a); s.b = Fr(b)
    def __add__(s, o): return Z(s.a + o.a, s.b + o.b)
    def __sub__(s, o): return Z(s.a - o.a, s.b - o.b)
    def __mul__(s, o): return Z(s.a*o.a - s.b*o.b, s.a*o.b + s.b*o.a + s.b*o.b)
    def conj(s): return Z(s.a + s.b, -s.b)
    def norm(s): return s.a*s.a + s.a*s.b + s.b*s.b
    def inv(s): n = s.norm(); c = s.conj(); return Z(c.a/n, c.b/n)
    def zero(s): return s.a == 0 and s.b == 0
def proj(G, J, M, K):
    """B = J^* G^+ J and SB = sum_ij (G^+)_ij conj(M_ij) on a maximal independent subset of the K vectors (exact)."""
    S = []
    def inv_sub(S):
        n = len(S); A = [[G[S[i]][S[j]] for j in range(n)] + [Z(1 if i == j else 0) for j in range(n)] for i in range(n)]
        for c in range(n):
            p = next((r for r in range(c, n) if not A[r][c].zero()), None)
            if p is None: return None
            A[c], A[p] = A[p], A[c]; iv = A[c][c].inv(); A[c] = [x*iv for x in A[c]]
            for r in range(n):
                if r != c and not A[r][c].zero():
                    f = A[r][c]; A[r] = [x - f*y for x, y in zip(A[r], A[c])]
        return [row[n:] for row in A]
    Gi = []
    for k in range(K):
        t = inv_sub(S + [k])
        if t is not None: S.append(k); Gi = t
    B = Z(0); SB = Z(0)
    for i, si in enumerate(S):
        for j, sj in enumerate(S):
            B = B + J[si].conj()*Gi[i][j]*J[sj]; SB = SB + Gi[i][j]*M[si][sj].conj()
    assert B.b == 0 and SB.b == 0, 'projection not rational'
    return B.a, SB.a, len(S)
def load(fn):
    recs = []; cur = None
    for line in open(fn):
        if line.startswith('ENS'):
            f = [x.strip() for x in line.split('|')]; h = f[0].split()
            cur = dict(q=int(h[1]), d=int(h[2]), N=int(h[3]), lam=int(h[4]), spec=' '.join(h[5:10]), var=int(h[10]), np=int(f[1]), E=int(f[2]), D=int(f[3]), SD=int(f[4]),
                       N0=int(f[5]), N1=int(f[6]), SB0=int(f[7]), SB1=int(f[8]), nv0=int(f[9]), nv1=int(f[10]), EH=int(f[11])); recs.append(cur)
        elif line.startswith('PRJ'):
            f = line.split('|'); K = int(f[0].split()[3]); g = [int(x) for x in f[1].split()]; j = [int(x) for x in f[2].split()]; m = [int(x) for x in f[3].split()]
            cur['K'] = K; cur['G'] = [[Z(g[2*(i*K+k)], g[2*(i*K+k)+1]) for k in range(K)] for i in range(K)]; cur['J'] = [Z(j[2*i], j[2*i+1]) for i in range(K)]
            cur['M'] = [[Z(m[2*(i*K+k)], m[2*(i*K+k)+1]) for k in range(K)] for i in range(K)]
    return recs
def stats(r):
    D = Fr(r['D']); o = {}
    o['e'] = r['E']/D; o['s'] = Fr(r['SD'])/D; o['c'] = o['e'] - o['s']
    B2, SB2, rk2 = proj(r['G'], r['J'], r['M'], 2)
    # cross-check with the scalar fields
    Bs = Fr(r['N0'], r['nv0']) + (Fr(r['N1'], r['nv1']) if r['nv1'] else 0); SBs = Fr(r['SB0'], r['nv0']) + (Fr(r['SB1'], r['nv1']) if r['nv1'] else 0)
    assert B2 == Bs and SB2 == SBs, 'projection fields disagree'
    o['beta'] = B2/D; o['sb'] = SB2/D; o['dim'] = rk2; o['c_coh'] = o['beta'] - o['sb']; o['c_perp'] = o['c'] - o['c_coh']; o['n'] = o['e'] - o['beta']
    if r['var'] == 1:
        B4, SB4, rk4 = proj(r['G'], r['J'], r['M'], 4); o['beta4'] = B4/D; o['sb4'] = SB4/D; o['dim4'] = rk4; o['c_perp4'] = o['c'] - (o['beta4'] - o['sb4'])
    assert o['n'] >= 0 and o['sb'] >= 0 and o['s'] - o['sb'] >= 0
    return o
INCLUDE_M = False
def main():
    R = {}
    for fn in sorted(glob.glob('results/q*_N*_lam*_d*_*.txt')):
        if 'DONE' not in open(fn).read()[-10:]: continue
        kind = fn.split('_')[-1][0]
        if kind == 'M' and not INCLUDE_M: continue      # optional runs (5 weights) are reported separately (optional.py) and do not enter the rule counts
        recs = load(fn)
        if not recs: continue
        q = recs[0]['q']; names = {w: n for n, w in wlist(q)}
        for r in recs:
            assert r['var'] == 1 or r['E'] == r['EH']
            key = (r['q'], r['N'], r['lam'], r['d'], r['var'], names[r['spec']])
            if key in R and R[key]['kind'] == 'F': continue
            st = stats(r); st.update(kind=kind, np=r['np'], E=r['E'], D=r['D'], SD=r['SD']); R[key] = st
    json.dump([dict(q=k[0], N=k[1], lam=k[2], d=k[3], var=k[4], w=k[5], **{a: (float(b) if isinstance(b, Fr) else b) for a, b in v.items()},
                    exact={a: f'{b.numerator}/{b.denominator}' for a, b in v.items() if isinstance(b, Fr)}) for k, v in sorted(R.items())], open('slot_results.json', 'w'), indent=0)
    return R
if __name__ == '__main__':
    R = main(); print(len(R), 'records')
