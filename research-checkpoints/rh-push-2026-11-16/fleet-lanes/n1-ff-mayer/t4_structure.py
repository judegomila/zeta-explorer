"""Structure tests and controls for M_chi(u) (q=3). double precision unless stated.
usage: t4_structure.py n k"""
import sys, math, cmath
import numpy as np
from ffm import *
np.set_printoptions(precision=5, suppress=True, linewidth=200)
q=3; n=int(sys.argv[1]); k=int(sys.argv[2])
N=irreducibles(q,n)[0]; R=Ring(q,N); S=R.size; dim=S+1; m=S-1
chi=chi_k(R,k)
rng=np.random.default_rng(1)
def rho(g):
    """g=((a,b),(c,d)) entries in R (codes). (rho(g)f)(v)=f(v g)."""
    (a,b),(c,d)=g; Mx=np.zeros((dim,dim),dtype=complex)
    for i in range(dim):
        v=(i,1) if i<S else (1,0)
        w=(R.add(R.mul(v[0],a),R.mul(v[1],c)), R.add(R.mul(v[0],b),R.mul(v[1],d)))
        if w[1]!=0:
            lam=w[1]; j=R.mul(w[0],R.inv[lam])
        else:
            lam=w[0]; j=S
        Mx[i,j]=chi[lam]
    return Mx
W=rho(((0,1),(1,0)))
def cr(r,u): return (u**R.deg[r] if R.deg[r]>=1 else 0)+(q-1)*u**n/(1-q*u)
Nr=[rho(((1,r),(0,1))) for r in range(S)]
def D(u): return sum(cr(r,u)*Nr[r] for r in range(S))
Bs,C=coeff_mats(R,chi)
def M(u): return M_of_u(R,Bs,C,u)
u0=0.21+0.17j
print(f"q={q} N={N} k={k} dim={dim}")
print("[S1] ||M - W D|| =",np.linalg.norm(M(u0)-W@D(u0)), " ||W W^* - 1|| =",np.linalg.norm(W@W.conj().T-np.eye(dim)), " ||W - W^*|| =",np.linalg.norm(W-W.conj().T)," ||W^2-1|| =",np.linalg.norm(W@W-np.eye(dim)))
Du=D(u0); print("     ||[D,D^*]|| =",np.linalg.norm(Du@Du.conj().T-Du.conj().T@Du), "  ||D(u)^* - D(conj u)|| =",np.linalg.norm(Du.conj().T-D(u0.conjugate())))
ev=np.linalg.eigvals(Du)
def chat(j,u):
    z=q*u
    if j==1: return 0
    return ((q-1)*z-q*z**(j-1)+z**j)/(1-z)
kap=(q-1)*q*u0/(1-q*u0)
pred=[(kap,2)]+[(chat(j,u0),(q-1)*q**(n-j)) for j in range(1,n+1)]
ok=True; cnt=[]
for val,mult in pred:
    c=int(np.sum(np.abs(ev-val)<1e-8)); cnt.append((complex(np.round(val,5)),mult,c)); ok&=(c==mult)
print("     eigenvalues of D(u): (value, predicted multiplicity, found):",cnt," all match:",ok)
print("[S2] Krein symmetry ||M(u)^* W - W M(conj u)|| =",np.linalg.norm(M(u0).conj().T@W-W@M(u0.conjugate())), "  signature of W: (+%d,-%d)"%(int(round((dim+np.trace(W).real)/2)),int(round((dim-np.trace(W).real)/2))))
# parity
P=np.zeros((dim,dim)); 
for x in range(S): P[x,R.neg(x)]=1
P[S,S]=1
print("     ||[M,P]|| =",np.linalg.norm(M(u0)@P-P@M(u0)),"||[W,P]|| =",np.linalg.norm(W@P-P@W),"||[D,P]|| =",np.linalg.norm(Du@P-P@Du))
# orthonormal bases of V+ and V-
def onb(sign):
    cols=[];seen=set()
    for x in range(S):
        if x in seen: continue
        y=R.neg(x); seen|={x,y}
        v=np.zeros(dim)
        if x==y:
            if sign==1: v[x]=1; cols.append(v)
        else: v[x]=1/math.sqrt(2); v[y]=sign/math.sqrt(2); cols.append(v)
    if sign==1: v=np.zeros(dim); v[S]=1; cols.append(v)
    return np.array(cols).T
Bp=onb(1); Bm=onb(-1)
def Mp(u): return Bp.T@M(u)@Bp
def Mm(u): return Bm.T@M(u)@Bm
r0=q**-0.5
Mx=Mp(r0*cmath.exp(0.7j))
print("[S3] normality defect at |u|=q^-1/2: ||[M,M^*]||/||M||^2 on V+ =",np.linalg.norm(Mx@Mx.conj().T-Mx.conj().T@Mx)/np.linalg.norm(Mx)**2)
# norm and spectral radius scan on V+
print("[S4] scan over |u|=r (360 angles): max operator norm, max spectral radius of M|V+ ; and of M|V-")
for r in [0.05,1/9,0.15,0.2,0.25,0.3,0.4,0.5,r0]:
    nm=0;sr=0;srm=0
    for t in np.linspace(0,2*np.pi,360,endpoint=False):
        u=r*cmath.exp(1j*t)
        if abs(1-q*u)<1e-9: continue
        A=Mp(u); nm=max(nm,np.linalg.norm(A,2)); sr=max(sr,np.max(np.abs(np.linalg.eigvals(A))))
        srm=max(srm,np.max(np.abs(np.linalg.eigvals(Mm(u)))))
    print(f"     r={r:.4f}: max||M+||={nm:8.3f}  max specrad(M+)={sr:8.3f}  max specrad(M-)={srm:8.3f}")
# Theorem 1 check: ev_0 (1-M)^{-1} = Phi_all/((q-1) L)
def Phi_all(u):
    """functional as row vector over basis points: sum_{n!=0, deg n<nN} sum_{deg m<deg n} u^deg n ev_{(m,n)}"""
    row=np.zeros(dim,dtype=complex)
    for nn in range(1,S):
        d=R.deg[nn]
        for mm in range(q**d):   # all m with deg m<d (codes < q^d), includes m=0
            # ev_{(mm,nn)} = chi(nn) ev_{(mm/nn,1)}
            row[R.mul(mm,R.inv[nn])]+=chi[nn]*u**d
    return row
Lc=L_poly(R,chi)
def L(u): return sum(c*u**i for i,c in enumerate(Lc))
e0=np.zeros(dim); e0[0]=1   # point x=0 i.e. v=(0,1)
for u in [0.1+0.05j,0.4-0.3j,-0.7+0.2j]:
    lhs=e0@np.linalg.inv(np.eye(dim)-M(u)); rhs=Phi_all(u)/((q-1)*L(u))
    print(f"[T1] u={u}: ||ev_0(1-M)^-1 - Phi_all/((q-1)L)|| = {np.linalg.norm(lhs-rhs):.2e}   (||lhs||={np.linalg.norm(lhs):.3f})")
Lr=np.roots(Lc[::-1])
for z in Lr:
    print(f"     L zero u0={z:.5f} |u0|={abs(z):.5f}: ||Phi_all(u0)||={np.linalg.norm(Phi_all(z)):.4f}, smallest singular value of 1-M(u0) on V+ = {np.linalg.svd(np.eye(Bp.shape[1])-Mp(z),compute_uv=False)[-1]:.2e}")
# deformation control: W' = Q W Q^*, Q = exp(i eps H), H random Hermitian commuting with P
print("[C-def] deformation W -> Q W Q^* (Q unitary, commutes with P): radii of the zeros of det(1 - W'D | V+) that start at the L zeros")
H=rng.normal(size=(dim,dim))+1j*rng.normal(size=(dim,dim)); H=H+H.conj().T; H=(H+P@H@P)/2; H/=np.linalg.norm(H,2)
w_,v_=np.linalg.eigh(H)
def newton(F,z,steps=60):
    for _ in range(steps):
        h=1e-6; f=F(z); df=(F(z+h)-F(z-h))/(2*h)
        dz=f/df; z=z-dz
        if abs(dz)<1e-13: break
    return z
Lstar=[z for z in Lr if abs(abs(z)-r0)<1e-6]
for eps in [0,1e-3,1e-2,5e-2]:
    Q=v_@np.diag(np.exp(1j*eps*w_))@v_.conj().T
    Wd=Q@W@Q.conj().T
    F=lambda u: np.linalg.det(np.eye(Bp.shape[1])-Bp.T@(Wd@D(u))@Bp)
    out=[]
    for z in Lstar:
        zz=newton(F,z); out.append(abs(zz))
    print(f"     eps={eps}: |u| = {np.round(out,6).tolist()}   (q^-1/2={r0:.6f})")
