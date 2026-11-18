import numpy as np, math, sys
from scipy.linalg import eigvalsh, eigh, cho_factor, cho_solve
from scipy.special import digamma
N=int(sys.argv[1]); print(f"planned allocation: {6*16*N*N/1e6:.0f} MB peak")
names={0:'zeta',1:'chi3',2:'chi4',3:'chi5 complex',4:'chi5 real',5:'DH'}
k=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
cs={1:(3,[0,1,-1]),2:(4,[0,1,0,-1]),3:(5,[0,1,1j,-1j,-1]),4:(5,[0,1,-1,-1,1]),5:(5,[0,1,k,-k,-1])}
idx=np.arange(1,N+1); g=np.gcd.outer(idx,idx)
grid=[n for n in [25,50,100,200,400,800,1000,1400,2000,2800,4000] if n<=N]
out={}
for m in range(6):
    Gc=np.fromfile(f'g{N}_{m}.bin',dtype=np.complex128).reshape(N,N)
    G=Gc[(idx[:,None]//g)-1,(idx[None,:]//g)-1]/g
    herm=np.abs(G-G.conj().T).max()
    if m!=3: G=G.real.copy()
    if m==0: b=(np.log(idx)+1-0.5772156649015329)/idx; L1=None
    else:
        q,c=cs[m]; L1=-sum(c[r]*digamma(r/q) for r in range(1,q))/q; b=np.abs(L1)/idx
    rows=[]
    for n in grid:
        Gn=G[:n,:n]; lam=eigvalsh(Gn,subset_by_index=[0,0])[0]; lmax=eigvalsh(Gn,subset_by_index=[n-1,n-1])[0]
        x=np.linalg.solve(Gn,b[:n].astype(Gn.dtype)); d2=1-np.real(np.vdot(b[:n],x))
        rows.append((n,lam,lmax,d2))
    out[m]=rows
    print(f"\n== {names[m]}  (herm defect {herm:.1e}, |L(1)|={abs(L1) if L1 is not None else float('nan'):.6f})")
    print("    N   lam_min      lam_min*N^2  lam_min*N^2/logN  lam_max   d_N^2       d_N^2*logN   local exponent")
    prev=None
    for (n,lam,lmax,d2) in rows:
        le='' if prev is None else f"{math.log(lam/prev[1])/math.log(n/prev[0]):.3f}"
        print(f"{n:5d}  {lam:.6e}  {lam*n*n:.4f}  {lam*n*n/math.log(n):.4f}  {lmax:.4f}  {d2:.6e}  {d2*math.log(n):.5f}  {le}")
        prev=(n,lam)
    ns=np.array([r[0] for r in rows if r[0]>=200]); ls=np.array([r[1] for r in rows if r[0]>=200])
    p=np.polyfit(np.log(ns),np.log(ls),1); print(f"  fit N>=200: lam_min ~ {math.exp(p[1]):.4f} N^{p[0]:.4f}")
    p2=np.polyfit(np.log(ns),np.log(ls/np.log(ns)),1); print(f"  fit N>=200: lam_min/logN ~ {math.exp(p2[1]):.4f} N^{p2[0]:.4f}")
    if m in (0,5) :
        w,v=eigh(G,subset_by_index=[0,0]); v=v[:,0]; 
        print("  bottom eigenvector: mass on n>N/2:",float(np.sum(np.abs(v[N//2:])**2)), " largest |v| at n=",np.argsort(-np.abs(v))[:6]+1)
