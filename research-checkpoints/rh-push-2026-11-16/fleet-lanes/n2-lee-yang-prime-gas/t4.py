# Pivot test: Gaussian cutoff in log p.  E_Lam(s) = prod_p (1 - w_p p^{-s}),  w_p = exp(-log^2 p/(2 Lam)), primes <= 1e7 (w_p < 1e-13 beyond for Lam<=4).
# Also the coupled version is not needed: E_Lam is zero-free for Re s >= 0 without any coupling.
# Prediction: log|E_Lam * zeta| bounded outside the triangle |t| < 1-sigma, growth ~ sqrt(2 pi Lam) exp(((1-sigma)^2-t^2) Lam/2)/(|1-s| Lam) inside.
from lib import *
X=10**7; P=primes_upto(X).astype(float); lp=np.log(P)
print(f"[alloc: {len(P)} primes, arrays {len(P)*16/1e6:.0f} MB per s-point]")
pts=[complex(sg,t) for sg in (0.6,0.75,0.9) for t in (0,0.2,0.5,1,2,5,10,20,30,40,50,60)]
mp.mp.dps=20; lz=np.array([float(mp.log(abs(mp.zeta(mp.mpc(s.real,s.imag))))) for s in pts]); out=[]
def run(eps,kind,lzz):
    for Lam in (0.5,1,2,3,4):
        w=np.exp(-lp**2/(2*Lam)); tail=w[-1]
        d=np.array([np.log(abs(1-eps*w*np.exp(-s*lp))).sum() for s in pts])+lzz
        ins=np.array([abs(s.imag)<1-s.real for s in pts])
        print(f"{kind} Lam={Lam}: w(pmax)={tail:.1e}  sup|log|E*L|| inside triangle {abs(d[ins]).max():.4f} ; outside triangle {abs(d[~ins]).max():.4f} (at s={pts[int(np.argmax(np.where(~ins,abs(d),0)))]}) ; outside, t>=1: {abs(d[[s.imag>=1 for s in pts]]).max():.4f}",flush=True)
        out.append(dict(kind=kind,Lam=Lam,d=d.tolist()))
run(np.ones(len(P)),"zeta",lz)
e4=np.where(P%4==3,-1.0,1.0); l4=np.array([float(mp.log(abs(mp.dirichlet(mp.mpc(s.real,s.imag),[0,1,0,-1])/(1-mp.mpf(2)**(-mp.mpc(s.real,s.imag)))))) for s in pts])
run(e4,"chi4-twist",l4)
json.dump(dict(pts=[[s.real,s.imag] for s in pts],rows=out),open(HERE+"/t4.json","w"))
