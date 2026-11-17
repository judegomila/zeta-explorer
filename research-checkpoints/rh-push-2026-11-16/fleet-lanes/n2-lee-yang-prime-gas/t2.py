# Test 2: non-rank-one ferromagnetic couplings with exact row sums (1/2) log p.  Statistic: sup |log|Theta_S * zeta|| on the compact.
import sys; from lib import *
S=grid(dt=0.5); lz=logabs_target(S,"zeta"); S12=grid(sigmas=(1.2,),dt=0.5); z12=logabs_target(S12,"zeta")
def patterns(P):
    k=len(P); lp=np.log(P); i=np.arange(k); I,Jx=np.meshgrid(i,i,indexing="ij")
    top=np.maximum(I,Jx)>=k-max(2,k//3)
    return {"MF (all ones)":np.ones((k,k)),
            "BAND w=0.5 (log-distance)":np.exp(-(lp[:,None]-lp[None,:])**2/(2*0.5**2)),
            "BAND w=1.5":np.exp(-(lp[:,None]-lp[None,:])**2/(2*1.5**2)),
            "INDEX-DIST 1/(1+|i-j|)^2":1.0/(1+abs(I-Jx))**2,
            "TOP-soft (1 if touching top third, else 0.05)":np.where(top,1.0,0.05),
            "BIP-soft (1 small-large, 0.05 within)":np.where((I<k//2)^(Jx<k//2),1.0,0.05),
            "MAXPOW max(p,q)^-1":1.0/np.maximum(P[:,None],P[None,:]),
            "MINPOW min(p,q)^-1":1.0/np.minimum(P[:,None],P[None,:])}
def stat(P,J,cp=None):
    lp=np.log(P); ln,mu=subset_logs(lp); coef=mu*np.exp(pair_form(J))
    d=np.log(abs(dsum(coef,ln,S)))+lz; d12=np.log(abs(dsum(coef,ln,S12)))+z12
    return float(abs(d).max()), float(abs(d[S.imag>10]).max()), float(abs(d12).max())
mode=sys.argv[1]
if mode=="families":
    out={}
    for k in (6,8,10,12,14,16,18):
        P=first_primes(k); lp=np.log(P); r=0.5*lp
        if k>=16: print(f"[alloc k={k}: 2^k={2**k} terms, exp chunk <= 600 MB]")
        eu=np.log(abs(np.prod(1-np.exp(-np.outer(S,lp)),axis=1)))+lz
        print(f"k={k} pmax={P[-1]:.0f} L={lp.sum():.2f}   bare Euler product (J=0, not admissible): sup={abs(eu).max():.4f}",flush=True)
        for name,M in patterns(P).items():
            J,res=scale_rows(M,r)
            if not np.isfinite(res) or res>1e-8: print(f"   {name:46s} scaling failed (res {res:.1e})"); continue
            a,b,c=stat(P,J); out.setdefault(name,[]).append([k,a,b,c,float(J.max())])
            print(f"   {name:46s} sup={a:.4f}  sup(t>10)={b:.4f}  sup on sigma=1.2: {c:.4f}  max J={J.max():.3f}",flush=True)
        # smooth cutoff in p of the row sums: R_p = c_p log p, c_p = (1/2)(1-log p/log(2 pmax))  (zero-free for Re s>1/2 kept)
        cp=0.5*(1-lp/np.log(2*P[-1])); J,res=scale_rows(np.ones((k,k)),cp*lp); a,b,c=stat(P,J)
        out.setdefault("CUTROW",[]).append([k,a,b,c,float(J.max())])
        print(f"   {'CUTROW c_p=(1/2)(1-log p/log 2pmax), MF':34s} sup={a:.4f}  sup(t>10)={b:.4f}  sup on sigma=1.2: {c:.4f}  max J={J.max():.3f}",flush=True)
    json.dump(out,open(HERE+"/t2_families.json","w"),indent=1)
if mode=="opt":
    from scipy.optimize import minimize
    k=int(sys.argv[2]); maxiter=int(sys.argv[3]); P=first_primes(k); lp=np.log(P); r=0.5*lp; ln,mu=subset_logs(lp); iu=np.triu_indices(k,1)
    def build(th):
        M=np.zeros((k,k)); M[iu]=np.exp(np.clip(th,-30,30)); M=M+M.T; return scale_rows(M,r,iters=3000,tol=1e-12)
    def obj(th,p=24):
        J,res=build(th)
        if not np.isfinite(res) or res>1e-6: return 1e3
        d=np.log(abs(dsum(mu*np.exp(pair_form(J)),ln,S)))+lz
        m=abs(d).max(); return m*np.mean((abs(d)/m)**p)**(1/p)*len(d)**(1/p)     # smooth surrogate of the sup (p-norm)
    rng=np.random.default_rng(k); best=None
    starts={"MF":np.zeros(len(iu[0])),"BAND":(-(lp[:,None]-lp[None,:])**2/0.5)[iu],"rand1":rng.normal(size=len(iu[0])),"rand2":2*rng.normal(size=len(iu[0]))}
    for name,th0 in starts.items():
        t0=time.time(); r_=minimize(obj,th0,method="L-BFGS-B",options=dict(maxiter=maxiter,maxfun=maxiter*(len(th0)+1)*2))
        J,res=build(r_.x); a,b,c=stat(P,J); J0,_=build(th0); a0,_,_=stat(P,J0)
        print(f"k={k} start {name:6s}: sup {a0:.4f} -> {a:.4f}   sup(t>10)={b:.4f}  sup on sigma=1.2: {c:.4f}  max J={J.max():.3f}  rowres={res:.1e}  ({time.time()-t0:.0f}s, {r_.nit} it)",flush=True)
        if best is None or a<best[0]: best=(a,b,c,J.tolist(),name)
    eu=np.log(abs(np.prod(1-np.exp(-np.outer(S,lp)),axis=1)))+lz
    print(f"k={k} BEST sup={best[0]:.4f} (start {best[4]});  floor from zeta's zero near the compact: sup|log|zeta|| on compact = {abs(lz).max():.4f}; bare Euler {abs(eu).max():.4f}")
    json.dump(dict(k=k,best_sup=best[0],best_high=best[1],best_s12=best[2],J=best[3],start=best[4]),open(HERE+f"/t2_opt_k{k}.json","w"))
