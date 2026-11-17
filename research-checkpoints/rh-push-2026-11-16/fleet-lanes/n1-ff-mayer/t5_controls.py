"""(i) lambda-rotation: zeros of det(1 - lam M | V+), lam=e^{i theta}  (ball arithmetic pipeline of t3)
   (ii) DH analogue at n=4: f = r1 eps1^{-1/2} L*_1 + r2 eps2^{-1/2} L*_2 with off-circle zeros; determinant test."""
import sys, math, cmath
import numpy as np, mpmath as mp
from flint import acb
from ffm import *
import t3_sector as T
q=3; n=int(sys.argv[1]); k=int(sys.argv[2])
N=irreducibles(q,n)[0]; R=Ring(q,N); S=R.size; dim=S+1; m=S-1
r0=q**-0.5
vecs=T.sector_basis(R,True,1,q)
print(f"q={q} N={N} k={k}: zeros of det(1 - e^(i theta) M | V+) after removing (1-qu),(1-u),(1+u) factors")
for num,den in ([(0,1),(1,16),(1,8),(1,4),(1,2),(3,4),(1,1)] if n<4 else []):
    lam=(acb(0,num)/den*acb.pi()).exp() if num else acb(1)
    r=T.analyse(R,k,q,lam,"V+",vecs)
    rad=[float(abs(z)) for z in r['roots']]
    onL=sum(1 for x in rad if abs(x-r0)<1e-9); onC=sum(1 for x in rad if abs(x-1/q)<1e-9)
    print(f"  theta={num}/{den} pi: pole order {r['pole']}, (1-u)^{r['m1']} (1+u)^{r['mm1']}, #roots {len(rad)}, at q^-1/2: {onL}, at 1/q: {onC}, other radii: {[round(x,5) for x in rad if abs(x-r0)>1e-9 and abs(x-1/q)>1e-9]}")
    sys.stdout.flush()
if n<4: sys.exit()
# ---- DH analogue
print("\nDH analogue (n=4): L*(u,chi)=L/(1-u)=c0+c1 u+c2 u^2")
def Lstar(kk):
    chi=chi_k(R,kk); c=L_poly(R,chi)   # degree 3, divisible by (1-u)
    # divide by (1-u): b0=c0, b1=c1+b0, b2=c2+b1
    b0=c[0]; b1=c[1]+b0; b2=c[2]+b1
    return np.array([b0,b1,b2])
data={}
for kk in range(2,m,2):
    b=Lstar(kk); eps=b[2]/q   # |eps|=1
    h=cmath.sqrt(eps)         # normalised g = L*/h : g0=1/h, g1=b1/h real, g2=q*conj(g0)
    g=b/h
    data[kk]=(b,eps,g)
ks=sorted(data)
print("  check: |eps|=1 and Im g1 = 0 for all even chi: max||eps|-1| =",max(abs(abs(data[x][1])-1) for x in ks),"  max|Im g1| =",max(abs(data[x][2][1].imag) for x in ks), "  max |g1|/(2 sqrt q) =",max(abs(data[x][2][1].real) for x in ks)/(2*math.sqrt(q)))
best=None
for i in ks:
    for j in ks:
        if j<=i or (i+j)%m==0: continue
        for r2 in [-1.0,1.0,-0.5,0.5,-2,2]:
            f=data[i][2]+r2*data[j][2]
            if abs(f[2])<1e-6 or abs(f[0])<1e-6: continue
            rts=np.roots(f[::-1]); dev=max(abs(abs(z)-r0) for z in rts)
            if best is None or dev>best[0]: best=(dev,i,j,r2,f,rts)
dev,i,j,r2,f,rts=best
print(f"  DH pair: k1={i}, k2={j}, f = g_k1 + ({r2}) g_k2, coefficients {np.round(f,5).tolist()}")
print(f"  f satisfies f(u) = q u^2 conj(f)(1/(q conj u)): |f2 - q conj(f0)| = {abs(f[2]-q*f[0].conjugate()):.2e}, Im f1 = {f[1].imag:.2e}")
print(f"  zeros of f: {[(round(abs(z),6), round(cmath.phase(z)/math.pi,4)) for z in rts]}  (product of radii {abs(rts[0])*abs(rts[1]):.6f} = 1/q)")
# determinant on V_k1 (+) V_k2, V+ sectors
def onb():
    cols=[];seen=set()
    for x in range(S):
        if x in seen: continue
        y=R.neg(x); seen|={x,y}
        v=np.zeros(dim)
        if x==y: v[x]=1
        else: v[x]=v[y]=1/math.sqrt(2)
        cols.append(v)
    v=np.zeros(dim); v[S]=1; cols.append(v)
    return np.array(cols).T
Bp=onb()
mats={}
for kk in (i,j):
    chi=chi_k(R,kk); Bs,C=coeff_mats(R,chi); mats[kk]=(Bs,C,chi)
def Mp(kk,u): 
    Bs,C,chi=mats[kk]; return Bp.T@M_of_u(R,Bs,C,u)@Bp
def Lval(kk,u): return sum(c*u**t for t,c in enumerate(L_poly(R,mats[kk][2])))
for z in rts:
    sv=[np.linalg.svd(np.eye(Bp.shape[1])-Mp(kk,z),compute_uv=False)[-1] for kk in (i,j)]
    print(f"  at DH zero u*={z:.6f}: smallest singular values of 1-M_k1, 1-M_k2 on V+: {sv[0]:.4f}, {sv[1]:.4f};  L(u*,chi1)={Lval(i,z):.4f}, L(u*,chi2)={Lval(j,z):.4f}")
    # the functional identity for the combination: E_h (1-M)^{-1} has no pole at u*: norm of resolvent rows
    e0=np.zeros(dim); e0[0]=1
    nr=[np.linalg.norm(e0@np.linalg.inv(np.eye(dim)-M_of_u(R,mats[kk][0],mats[kk][1],z))) for kk in (i,j)]
    print(f"     ||ev_0 (1-M_k)^-1|| at u*: {nr[0]:.4f}, {nr[1]:.4f}  (finite: no eigenvalue 1)")
