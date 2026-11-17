# Gaussian (Hubbard-Stratonovich) evaluation: Theta_S(s) = E_g prod_{p in S} (1 - eps_p p^{-s+g/sqrt(L)}),  g ~ N(0,1), rank-one coupling.
import sys; from lib import *
def theta_gauss(P,eps,S,gmin=-10.0,gmax=45.0,h=0.1):
    lp=np.log(P); L=lp.sum(); g=np.arange(gmin,gmax+1e-9,h); u=g/np.sqrt(L)
    print(f"  [alloc: {len(g)}x{len(P)} complex = {len(g)*len(P)*16/1e6:.0f} MB per s-point]",flush=True)
    A=np.exp(np.outer(u,lp))*eps[None,:]          # eps_p p^{u}
    out=np.empty(len(S),complex); cond=np.empty(len(S))
    for i,s in enumerate(S):
        lg=np.log(1-A*np.exp(-s*lp)[None,:]).sum(1)-g**2/2    # principal logs; only exp(lg) is used
        m=lg.real.max(); w=np.exp(lg-m); tot=w.sum()
        out[i]=np.log(abs(tot))+m+np.log(h/np.sqrt(2*np.pi)) ; cond[i]=abs(w).sum()/abs(tot)
    return out.real,cond    # log|Theta|, cancellation factor
def euler_log(P,eps,S):
    lp=np.log(P); return np.array([np.log(abs(1-eps*np.exp(-s*lp))).sum() for s in S])
if __name__=="__main__":
    S=grid(dt=1.0); res=[]
    # check against exact 2^22 sum
    P=first_primes(22); lp=np.log(P); ln,mu=subset_logs(lp); ex=np.log(abs(dsum(mu*np.exp(ln**2/(2*lp.sum())),ln,S)))
    gq,cond=theta_gauss(P,np.ones(22),S); print("k=22 check: max |log|Theta|_quad - exact| =",abs(gq-ex).max()," max cancellation factor",cond.max(),flush=True)
    chk=float(abs(gq-ex).max())
    for kind in ("zeta","chi4","liouville"):
        lz=logabs_target(S,kind)
        for x in (79,300,1000,3000,10**4,3*10**4,10**5,3*10**5):
            P=primes_upto(x).astype(float); L=np.log(P).sum()
            eps=np.ones(len(P))
            if kind=="chi4": eps=np.where(P%4==3,-1.0,1.0)
            if kind=="liouville": eps=-eps
            SS=S; lzz=lz
            t0=time.time(); lt,cond=theta_gauss(P,eps,SS); le=euler_log(P,eps,SS); d=lt+lzz
            i=abs(d).argmax(); tt=SS.imag
            row=dict(kind=kind,x=x,k=len(P),L=float(L),sup_logTh=float(abs(lt).max()),dev=float(abs(d).max()),argmax=[SS[i].real,SS[i].imag],
                     dev_high=float(abs(d[tt>10]).max()),dev_sig=[float(abs(d[abs(SS.real-sg)<1e-9]).max()) for sg in (0.6,0.7,0.8,0.9)],
                     ratio_to_euler=float(abs(lt-le).max()),cond=float(cond.max()),secs=time.time()-t0)
            res.append(row); print(row,flush=True)
            json.dump(dict(check_k22=chk,rows=res),open(HERE+"/t1b.json","w"),indent=1)
