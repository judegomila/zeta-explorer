"""First decisive test. Flow F_t = (1/4) F_zz (forward de Bruijn direction; zeros move toward the axis Re z = 0).
Zeros: rho_j' = -(1/2) sum_{i != j} 1/(rho_j - rho_i).
Part A: exact arithmetic in Q(i) (Fractions) for functionals of the zero configuration of F.
Part B: float64 (numpy) central differences along the exact polynomial flow for the finite-alpha
        Hankel block Gamma_- of S = (F - alpha F')/(F + alpha F').
"""
import sys, json, random, math
from fractions import Fraction as Fr
import numpy as np

class G:  # Gaussian rational
    __slots__=("a","b")
    def __init__(s,a,b=Fr(0)): s.a=Fr(a); s.b=Fr(b)
    def __add__(s,o): return G(s.a+o.a,s.b+o.b)
    def __sub__(s,o): return G(s.a-o.a,s.b-o.b)
    def __neg__(s): return G(-s.a,-s.b)
    def __mul__(s,o): return G(s.a*o.a-s.b*o.b, s.a*o.b+s.b*o.a)
    def conj(s): return G(s.a,-s.b)
    def inv(s):
        n=s.a*s.a+s.b*s.b; return G(s.a/n,-s.b/n)
    def iszero(s): return s.a==0 and s.b==0
    def c(s): return complex(float(s.a),float(s.b))
ZERO=G(0)

def rnd(lo,hi,den=20):
    d=random.randint(1,den); return Fr(random.randint(int(lo*d),int(hi*d)),d)

def config(mode, n_max=12):
    """returns list of zeros (G). class H: symmetric under rho -> -conj rho. even: also under rho -> -rho."""
    while True:
        zs=[]
        if mode=="H":
            q=random.randint(1,3); m=random.randint(0,n_max-2*q)
            for _ in range(q):
                s=rnd(0.05,2); s=s if s>0 else Fr(1,7); b=rnd(-3,3)
                zs+= [G(s,b),G(-s,b)]
            for _ in range(m): zs.append(G(0,rnd(-3,3)))
        else:
            kind=random.choice(["quartet","quartet","real","two"])
            if kind=="quartet": offs=[("q",)]
            elif kind=="real": offs=[("r",)]
            else: offs=[random.choice([("q",),("r",)]),random.choice([("q",),("r",)])]
            for o in offs:
                s=rnd(0.05,2); s=s if s>0 else Fr(1,7)
                if o[0]=="q":
                    b=rnd(0.05,3); b=b if b>0 else Fr(1,9)
                    zs+=[G(s,b),G(-s,b),G(s,-b),G(-s,-b)]
                else: zs+=[G(s,0),G(-s,0)]
            m=random.randint(0,(n_max-len(zs))//2)
            for _ in range(m):
                g=rnd(0.05,3); g=g if g>0 else Fr(1,11); zs+=[G(0,g),G(0,-g)]
        key=set((z.a,z.b) for z in zs)
        if len(key)==len(zs) and len(zs)<=n_max: return zs

def vel(zs):
    out=[]
    for j,z in enumerate(zs):
        s=ZERO
        for i,w in enumerate(zs):
            if i!=j: s=s+(z-w).inv()
        out.append(G(-s.a/2,-s.b/2))
    return out

def exactA(zs):
    v=vel(zs)
    R=[j for j,z in enumerate(zs) if z.a>0]
    res={}
    # E1: Phi2 = sum_{j,k in RHP} 1/(rho_j + conj rho_k)^2 ; d/dt = sum -2 (v_j + conj v_k)/(rho_j+conj rho_k)^3
    d=ZERO; val=ZERO
    for j in R:
        for k in R:
            w=(zs[j]+zs[k].conj()).inv(); w2=w*w
            val=val+w2
            d=d+ (v[j]+v[k].conj())*w2*w*G(-2)
    assert d.b==0 and val.b==0
    res["E1_HS_alpha0"]=(val.a,d.a)
    # E2: max Re rho
    mx=max(zs[j].a for j in R); arg=[j for j in R if zs[j].a==mx]
    dv=set(v[j].a for j in arg)
    res["E2_maxRe"]=(mx, max(dv))   # derivative of max = max of derivatives at ties
    # E3: sum Re over RHP
    res["E3_sumRe"]=(sum(zs[j].a for j in R), sum(v[j].a for j in R))
    # E4: log|Disc| ; d/dt = -4 sum_k v_k^2 (real)
    s=ZERO
    for x in v: s=s+x*x
    assert s.b==0
    res["E4_logDisc"]=(None,-4*s.a)
    # E5: logdet of small-alpha Gamma*Gamma: 2[sum_{j<k} log|rho_j-rho_k|^2 - sum_{j,k} log|rho_j+conj rho_k|]
    d=Fr(0)
    for a_,j in enumerate(R):
        for k in R[a_+1:]:
            d+= 2*((v[j]-v[k])*(zs[j]-zs[k]).inv()).a
    for j in R:
        for k in R:
            d-= ((v[j]+v[k].conj())*(zs[j]+zs[k].conj()).inv()).a
    res["E5_logdet_alpha0"]=(None,2*d)
    # E6: min Re over RHP
    mn=min(zs[j].a for j in R); arg=[j for j in R if zs[j].a==mn]
    res["E6_minRe"]=(mn,min(v[j].a for j in arg))
    # E7: sum over RHP of Re(rho)^2
    res["E7_sumRe2"]=(None,sum(2*zs[j].a*v[j].a for j in R))
    return res,len(R)

# ---------- Part B
def flow_poly(c,t):
    """c: coefficients highest first (numpy complex). returns exp(t/4 d^2/dz^2) c."""
    p=np.poly1d(c); out=np.poly1d(c); term=p; k=0
    while True:
        k+=1; term=term.deriv(2)*(t/4)/k
        if term.order==0 and term.coeffs[0]==0: break
        out=out+term
        if term.order<2: break
    return out

def gamma_invariants(Fp,alpha):
    D=Fp+alpha*Fp.deriv(); 
    roots=D.roots; P=roots[roots.real>1e-9]
    if len(P)==0: return dict(HS=0.0,op=0.0,nuc=0.0,logdet=-np.inf,logdet1m=0.0,kappa=0), P
    r=2*Fp(P)/D.deriv()(P)
    A=1.0/(np.conj(P)[:,None]+P[None,:])
    T=np.diag(np.conj(r))@A@np.diag(r)@np.conj(A)
    ev=np.sort(np.linalg.eigvals(T).real)[::-1]
    evc=np.clip(ev,1e-300,None)
    return dict(HS=float(ev.sum()),op=float(ev[0]),nuc=float(np.sqrt(evc).sum()),
                logdet=float(np.log(evc).sum()),logdet1m=float(np.log(np.clip(1-ev,1e-300,None)).sum()),
                kappa=len(P),evmax=float(ev[0]),evmin=float(ev[-1])), P

def partB(zs,alphas,h=1e-5):
    c=np.poly(np.array([z.c() for z in zs]))
    out={}
    for al in alphas:
        f0,_=gamma_invariants(np.poly1d(c),al)
        fp,_=gamma_invariants(flow_poly(c,h),al); fm,_=gamma_invariants(flow_poly(c,-h),al)
        if not (fp["kappa"]==fm["kappa"]==f0["kappa"]): out[al]=None; continue
        out[al]={k:((fp[k]-fm[k])/(2*h), f0[k]) for k in ("HS","op","nuc","logdet","logdet1m")}
        out[al]["evmax"]=f0["evmax"]; out[al]["evmin"]=f0["evmin"]
    return out

def main(N=10000,seed=1):
    random.seed(seed)
    alphas=[0.3,1.0,10.0]
    from collections import defaultdict
    cnt=defaultdict(lambda:[0,0,0])   # neg, zero, pos
    exA=defaultdict(dict); evmax=0.0; skipped=0; witness={}
    def bucket(k): return "kappa=1" if k==1 else ("kappa=2" if k==2 else "kappa>=3")
    for it in range(N):
        mode="H" if it%2==0 else "even"
        zs=config(mode)
        A,kap=exactA(zs)
        for name,(val,d) in A.items():
            sgn=0 if d==0 else (2 if d>0 else 0) if False else (1 if d==0 else (2 if d>0 else 0))
            for key in ("all",mode,bucket(kap)):
                cnt[("A",name,key)][sgn]+=1
            w=("A",name,"pos" if d>0 else "neg")
            if d!=0 and w not in witness: witness[w]=dict(zeros=[[str(z.a),str(z.b)] for z in zs],deriv=str(d),kappa=kap)
        B=partB(zs,alphas)
        for al,res in B.items():
            if res is None: skipped+=1; continue
            evmax=max(evmax,res["evmax"])
            for name in ("HS","op","nuc","logdet","logdet1m"):
                d,v=res[name]
                if not np.isfinite(d): continue
                tol=1e-6*max(1.0,abs(v))
                sgn=1 if abs(d)<tol else (2 if d>0 else 0)
                for key in ("all",mode,bucket(kap)):
                    cnt[("B",f"{name}@alpha={al}",key)][sgn]+=1
                w=("B",f"{name}@alpha={al}","pos" if d>0 else "neg")
                if sgn!=1 and w not in witness: witness[w]=dict(zeros=[[str(z.a),str(z.b)] for z in zs],deriv=d,value=v,kappa=kap)
    rows=[]
    for (part,name,key),v in sorted(cnt.items()):
        rows.append(dict(part=part,functional=name,stratum=key,neg=v[0],zero=v[1],pos=v[2]))
    json.dump(dict(N=N,seed=seed,rows=rows,max_singular_value_sq=evmax,skipped_B=skipped,
                   witnesses={"|".join(k):v for k,v in witness.items()}),open(f"test1_seed{seed}.json","w"),indent=1)
    print("N",N,"max eig of Gamma*Gamma",evmax,"skipped B",skipped)
    for r in rows:
        print(f'{r["part"]} {r["functional"]:22s} {r["stratum"]:9s} neg {r["neg"]:6d} zero {r["zero"]:5d} pos {r["pos"]:6d}')

if __name__=="__main__":
    # sanity: single pair, HS^2 = alpha^2/(alpha^2+sigma^2)
    for al in (0.3,1.0,10.0):
        f,_=gamma_invariants(np.poly1d(np.poly([0.7,-0.7])),al); assert abs(f["HS"]-al*al/(al*al+0.49))<1e-12,(f,al)
    main(int(sys.argv[1]) if len(sys.argv)>1 else 10000, int(sys.argv[2]) if len(sys.argv)>2 else 1)
