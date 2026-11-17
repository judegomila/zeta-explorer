"""Exact det(1-M_chi(u)), split by the parity operator P=rho(diag(-1,1)) (q=3).
Arithmetic in K[u], K=Q(zeta_order(chi)); sympy DomainMatrix (fraction-free det)."""
import sys, time, math
import sympy as sp
from sympy import QQ
from sympy.polys.matrices import DomainMatrix
from ffm import *
u=sp.symbols('u')
def setup(q,n,k,idx=0):
    N=irreducibles(q,n)[idx]; R=Ring(q,N); S=R.size; m=S-1
    g=math.gcd(k,m); order=m//g; kk=(k//g)%order
    if order<=2: K=QQ; prim=None; zeta=QQ(1) if order==1 else QQ(-1)
    else:
        prim=sp.I if order==4 else sp.exp(2*sp.pi*sp.I/order)
        K=QQ.algebraic_field(prim); zeta=K.from_sympy(prim)
    chi={x: zeta**((kk*l)%order) for x,l in R.log.items()}
    return R,K,prim,chi,order
def exact_dets(q,n,k,idx=0,verbose=True,split=True,sgn=1):
    R,K,prim,chi,order=setup(q,n,k,idx); S=R.size; dim=S+1
    Ku=K.poly_ring(u); U=Ku.convert(u); one=Ku.one
    # c_r(u)*(1-qu) = (1-qu) u^{deg r}[deg r>=1] + (q-1)u^n
    tail=(q-1)*U**n
    cr=[tail + ((one-q*U)*U**R.deg[r] if R.deg[r]>=1 else Ku.zero) for r in range(S)]
    A=[[Ku.zero]*dim for _ in range(dim)]          # (1-qu) M(u)
    for r in range(S):
        for (i,j),v in rho_g(R,r,chi).items():
            A[i][j]=A[i][j]+Ku.convert_from(K.convert(v) if isinstance(v,int) else v,K)*cr[r]
    chim1=chi[R.neg(1)]
    out={}
    def basis(sign):
        vecs=[]; seen=set()
        for x in range(S):
            y=R.neg(x)
            if x in seen: continue
            seen.add(x); seen.add(y)
            if x==y:
                if sign==1: vecs.append({x:1})
            else: vecs.append({x:1,y:sign})
        if chim1==K.convert(sign): vecs.append({S:1})
        return vecs
    spaces=[("V+",basis(1)),("V-",basis(-1))] if split else [("V",[{x:1} for x in range(dim)])]
    for label,vecs in spaces:
        d=len(vecs); lead=[min(e) for e in vecs]
        Mr=[[Ku.zero]*d for _ in range(d)]
        for b,e in enumerate(vecs):
            for a,l in enumerate(lead):
                Mr[a][b]=sum((A[l][j]*c for j,c in e.items()),Ku.zero)
        t0=time.time()
        D=DomainMatrix([[ ((one-q*U) if a==b else Ku.zero)-sgn*Mr[a][b] for b in range(d)] for a in range(d)],(d,d),Ku).det()
        P=sp.Poly(Ku.to_sympy(D),u,domain=K)
        fl=P.factor_list()
        # remove (1-qu)^d
        out[label]=(d,P,fl)
        if verbose:
            print(f"[{label}] dim {d}; (1-{q}u)^{d}*det(1-M) has degree {P.degree()}  ({time.time()-t0:.1f}s)")
            print("    const:",fl[0])
            for f,e in fl[1]: print("    factor^%d:"%e, f.as_expr())
    return R,K,prim,chi,out
if __name__=="__main__":
    q=int(sys.argv[1]); n=int(sys.argv[2]); idx=int(sys.argv[4]) if len(sys.argv)>4 else 0
    for k in [int(x) for x in sys.argv[3].split(',')]:
        R,K,prim,chi,out=exact_dets(q,n,k,idx,verbose=False)
        R,K,prim,chi,outm=exact_dets(q,n,k,idx,verbose=False,sgn=-1)
        Lc=L_poly(R,chi)
        print(f"== q={q} N={R.N} k={k} chi(-1)={chi[R.neg(1)]}")
        print("   L(u,chi) =", sp.factor(sum(K.to_sympy(c if not isinstance(c,int) else K.convert(c))*u**i for i,c in enumerate(Lc)),extension=prim) if prim is not None else sp.factor(sum(c*u**i for i,c in enumerate(Lc))))
        for label,(d,P,fl) in out.items():
            print(f"   [{label}] dim {d}: (1-{q}u)^{d} det(1-M) = {fl[0]} * " + " * ".join(f"({f.as_expr()})^{e}" for f,e in fl[1]))
        for label,(d,P,fl) in outm.items():
            print(f"   [{label}] dim {d}: (1-{q}u)^{d} det(1+M) = {fl[0]} * " + " * ".join(f"({f.as_expr()})^{e}" for f,e in fl[1]))
        sys.stdout.flush()
