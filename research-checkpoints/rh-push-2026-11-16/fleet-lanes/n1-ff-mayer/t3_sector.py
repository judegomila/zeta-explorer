"""Certified-ball numerics (flint acb) for the four sector determinants det(1 -+ M | V+-) for q=3 (parity P),
or the torus-invariant sector for general q.  Output: deflated polynomial roots and comparison with L zeros.
usage: t3_sector.py q n k[,k..] [idx]"""
import sys, math, cmath
import numpy as np
import mpmath as mp
from flint import acb, acb_mat, arb, ctx
from ffm import *
PREC=600
ctx.prec=PREC; mp.mp.prec=PREC

def to_mpc(z):
    return mp.mpc(mp.mpf(z.real.mid().str(170,radius=False)), mp.mpf(z.imag.mid().str(170,radius=False)))
def rad(z): return max(float(z.real.rad()), float(z.imag.rad()))

def sector_basis(R, chi_m1_is_one, sign, q):
    """q=3: +-1 eigenspace of P (x -> -x on affine points; inf fixed with eigenvalue chi(-1)=1)."""
    S=R.size; vecs=[]; seen=set()
    for x in range(S):
        if x in seen: continue
        y=R.neg(x); seen.add(x); seen.add(y)
        if x==y:
            if sign==1: vecs.append({x:1})
        else: vecs.append({x:1,y:sign})
    if sign==1: vecs.append({S:1})
    return vecs
def invariant_basis(R,q):
    """general q: functions constant on F_q^*-orbits of x, plus inf."""
    S=R.size; vecs=[]; seen=set()
    consts=[c for c in range(1,q)]
    for x in range(S):
        if x in seen: continue
        orb={R.mul(c,x) for c in consts}; seen|=orb
        vecs.append({y:1 for y in orb})
    vecs.append({S:1})
    return vecs
def restrict(A,vecs):
    lead=[min(e) for e in vecs]; d=len(vecs)
    out=np.zeros((d,d),dtype=complex)
    for b,e in enumerate(vecs):
        for a,l in enumerate(lead):
            out[a,b]=sum(A[l,j]*c for j,c in e.items())
    return out
def acbm(Mat):
    d=Mat.shape[0]
    return acb_mat(d,d,[acb(float(z.real),float(z.imag)) for z in Mat.flatten()])
def exact_chi_mats(R,k):
    """coefficient matrices with exact-ish acb entries: build with acb roots of unity (not float)."""
    m=R.size-1
    zeta=[ (acb(0,2*j)/m*acb.pi()).exp() if j else acb(1) for j in range(m)]
    chi={x: zeta[(k*l)%m] for x,l in R.log.items()}
    return chi
def sector_poly(R,k,sign_sector,s,vecs,q):
    """returns mp coefficient list of (1-qu)^d det(1 - s M | sector), d, and max ball radius"""
    S=R.size; n=R.n; dim=S+1; m=S-1
    chi=exact_chi_mats(R,k)
    d=len(vecs); lead=[min(e) for e in vecs]
    # restricted coefficient matrices (acb) : Br[deg] , Br[0]=C
    Br=[[[acb(0)]*d for _ in range(d)] for _ in range(n)]
    for r in range(S):
        mm=rho_g(R,r,chi)
        rows={}
        for (i,j),v in mm.items(): rows.setdefault(i,{})[j]=v
        for a,l in enumerate(lead):
            row=rows.get(l,{})
            for b,e in enumerate(vecs):
                val=None
                for j,c in e.items():
                    if j in row:
                        t=row[j]*c if not isinstance(row[j],int) else acb(row[j]*c)
                        val=t if val is None else val+t
                if val is not None:
                    Br[0][a][b]=Br[0][a][b]+val
                    if R.deg[r]>=1: Br[R.deg[r]][a][b]=Br[R.deg[r]][a][b]+val
    deg=n*d; K=deg+1; rr=acb(1)/2
    vals=[]
    for jj in range(K):
        w=(acb(0,2*jj)/K*acb.pi()).exp(); uu=rr*w
        ent=[]
        for a in range(d):
            for b in range(d):
                t=-(q-1)*uu**n*Br[0][a][b]
                for dd in range(1,n): t=t-(1-q*uu)*uu**dd*Br[dd][a][b]
                t=t*s
                if a==b: t=t+(1-q*uu)
                ent.append(t)
        vals.append(acb_mat(d,d,ent).det())
    co=[]; mr=0.0
    for kk in range(K):
        acc=acb(0)
        for jj in range(K):
            acc=acc+vals[jj]*(acb(0,-2*((jj*kk)%K))/K*acb.pi()).exp()
        c=acc/K*acb(2)**kk
        mr=max(mr,rad(c)); co.append(to_mpc(c))
    return co,d,mr
def deflate(co,root,tol=mp.mpf(10)**(-60)):
    """divide by (1-u/root) while exact; co low->high. returns (co,mult)"""
    mult=0
    while True:
        # P(u)=(1-u/root)Q(u): q_0=p_0, q_k=p_k+q_{k-1}/root
        Q=[co[0]]
        for kk in range(1,len(co)): Q.append(co[kk]+Q[-1]/root)
        rem=Q[-1]
        scale=max(abs(c) for c in co)
        if abs(rem)<tol*scale and len(co)>1:
            co=Q[:-1]; mult+=1
        else: break
    return co,mult
def trim(co,tol=mp.mpf(10)**(-60)):
    scale=max(abs(c) for c in co)
    while len(co)>1 and abs(co[-1])<tol*scale: co=co[:-1]
    return co
def analyse(R,k,q,s,label,vecs):
    co,d,mr=sector_poly(R,k,None,s,vecs,q)
    co=trim(co)
    co,m3=deflate(co,mp.mpf(1)/q)
    co,m1=deflate(co,mp.mpf(1)); co,mm1=deflate(co,mp.mpf(-1))
    rts=mp.polyroots(co[::-1],maxsteps=500,extraprec=PREC) if len(co)>1 else []
    rts=sorted(rts,key=lambda z:(float(abs(z)),float(mp.arg(z))))
    return dict(label=label,s=s,d=d,pole=d-m3,m1=m1,mm1=mm1,roots=rts,ballrad=mr,co=co)
def Lroots(R,k):
    m=R.size-1
    chi={x: mp.exp(2j*mp.pi*((k*l)%m)/m) for x,l in R.log.items()}
    co=L_poly(R,chi); co=[mp.mpc(c) for c in co]
    co=trim(co)
    co,m1=deflate(co,mp.mpf(1))
    rts=mp.polyroots(co[::-1],maxsteps=500,extraprec=PREC) if len(co)>1 else []
    return m1,sorted(rts,key=lambda z:(float(abs(z)),float(mp.arg(z))))
def fmt(rts): return "[" + ", ".join(f"{float(abs(z)):.6f}@{float(mp.arg(z)/mp.pi):+.4f}pi" for z in rts) + "]"
if __name__=="__main__":
    q=int(sys.argv[1]); n=int(sys.argv[2]); idx=int(sys.argv[4]) if len(sys.argv)>4 else 0
    N=irreducibles(q,n)[idx]; R=Ring(q,N)
    print(f"q={q} N={N} dim={R.size+1}  radii: q^-1/2={q**-0.5:.6f} 1/q={1/q:.6f}")
    for k in [int(x) for x in sys.argv[3].split(',')]:
        m=R.size-1
        assert (k*(m//(q-1)))%m==0, "chi must be even"
        t1,Lr=Lroots(R,k)
        print(f"== k={k} order {m//math.gcd(k,m)}:  L(u,chi)=(1-u)^{t1} * roots {fmt(Lr)}")
        if q==3: secs=[("V+",sector_basis(R,True,1,q)),("V-",sector_basis(R,True,-1,q))]
        else: secs=[("Vinv",invariant_basis(R,q))]
        for label,vecs in secs:
            for s in (1,-1):
                r=analyse(R,k,q,s,label,vecs)
                geo = (label in("V+","Vinv") and s==1) or (label=="V-" and s==-1)
                print(f"   det(1{'-' if s==1 else '+'}M|{label}) dim {r['d']} [{'geometric' if geo else 'non-geometric'}]: (1-{q}u)^(-{r['pole']}) (1-u)^{r['m1']} (1+u)^{r['mm1']} * roots {fmt(r['roots'])}   (ball rad {r['ballrad']:.1e})")
        sys.stdout.flush()
