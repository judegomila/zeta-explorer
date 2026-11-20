"""Toy check of step S5 (Frobenius divisibility of the greedy-pivot determinant).
B = Q(a,b), a^2=d, b^2=2. Elements = integer 4-vectors in basis (1,a,b,ab).
theta_n = n0 + n1 a + n2 b + n3 ab, n in [0,N)^4.  Rows R_alpha(j) = theta^a0 * sigma(theta)^a1 * (sigma tau)(theta)^a2,
sigma: a->-a, tau: b->-b. Weight w = a0 + H(a1+a2). Greedy pivots in weight order.
Norm_{B/Q}(Delta) = det of the 4M x 4M integer block matrix (regular representation).
Prediction (Lean: source_character_global_greedy_determinant_master_bounds, clause hdiv):
  p > H, p not | 2q, (d/p) = -1  ==>  v_p(Norm Delta) >= 4 * sum_i floor(alpha_i0 / p).
Control: primes with (d/p) = +1 carry no such prediction.
"""
import sys, itertools
from flint import fmpz_mat, nmod_mat, fmpz
def mul(x,y,d):
    x0,x1,x2,x3=x; y0,y1,y2,y3=y
    return (x0*y0+d*x1*y1+2*x2*y2+2*d*x3*y3,
            x0*y1+x1*y0+2*(x2*y3+x3*y2),
            x0*y2+x2*y0+d*(x1*y3+x3*y1),
            x0*y3+x3*y0+x1*y2+x2*y1)
def pw(x,k,d):
    r=(1,0,0,0)
    for _ in range(k): r=mul(r,x,d)
    return r
def regrep(x,d):
    cols=[mul(x,e,d) for e in [(1,0,0,0),(0,1,0,0),(0,0,1,0),(0,0,0,1)]]
    return [[cols[c][r] for c in range(4)] for r in range(4)]
def legendre(d,p):
    r=pow(d%p,(p-1)//2,p); return -1 if r==p-1 else r
def vp(n,p):
    n=abs(int(n)); v=0
    while n%p==0: n//=p; v+=1
    return v
def run(d,N,H,q):
    pts=list(itertools.product(range(N),repeat=4)); M=len(pts)
    print(f"d={d} N={N} H={H} M={M}; block matrix {4*M}x{4*M} integers (planned < 50 MB)")
    th=[p for p in pts]; sg=[(n[0],-n[1],n[2],-n[3]) for n in pts]; st=[(n[0],-n[1],-n[2],n[3]) for n in pts]
    L=(1<<61)-1
    def row(al):
        return [mul(mul(pw(th[j],al[0],d),pw(sg[j],al[1],d),d),pw(st[j],al[2],d),d) for j in range(M)]
    def blockrows(r):
        out=[[0]*(4*M) for _ in range(4)]
        for j,x in enumerate(r):
            m=regrep(x,d)
            for a in range(4):
                for c in range(4): out[a][4*j+c]=m[a][c]
        return out
    piv=[]; rows=[]; modrows=[]
    W=0
    while len(piv)<M:
        cands=[(a0,a1,a2) for a1 in range(W//H+1) for a2 in range(W//H+1-a1) for a0 in [W-H*(a1+a2)] if a0>=0]
        cands.sort()
        for al in cands:
            if len(piv)==M: break
            r=row(al); br=blockrows(r)
            test=modrows+[[v%L for v in x] for x in br]
            rk=nmod_mat(len(test),4*M,[v for x in test for v in x],L).rank()
            if rk==4*(len(piv)+1):
                piv.append(al); rows+=br; modrows=test
        W+=1
    A=fmpz_mat(4*M,4*M,[v for x in rows for v in x]); nd=A.det()
    S1=sum(a[0] for a in piv); S2=sum(a[1]+a[2] for a in piv)
    print(f" max weight {W-1}; S1={S1} S2={S2}; log10|Norm| ~ {len(str(abs(int(nd))))}")
    assert nd!=0
    for p in [3,5,7,11,13,17,19,23,29,31,37]:
        if p<=H or (2*q)%p==0: continue
        E=sum(a[0]//p for a in piv); v=vp(nd,p); chi=legendre(d,p)
        print(f"  p={p:2d} chi(p)={chi:+d}  4E={4*E:5d}  v_p(Norm)={v:5d}  {'predicted v>=4E: '+('OK' if v>=4*E else 'VIOLATED') if chi==-1 else ('no prediction; v>=4E '+('holds' if v>=4*E else 'fails'))}")
import sys
for (d,N,H,q) in eval(sys.argv[1]):
    run(d,N,H,q)
