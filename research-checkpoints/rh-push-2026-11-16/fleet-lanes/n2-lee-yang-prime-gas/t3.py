# Controls on exact sums (k<=20) and Gaussian evaluation (large x): c-family, Beurling sets, random signs.
from lib import *; from t1b import theta_gauss, euler_log
S=grid(dt=1.0); lz=logabs_target(S,"zeta"); out=[]
print("== c-family (rank-one, coefficient exp(c log^2 n / L), zeros on Re s = c), exact sums: sup|log|Theta*zeta|| on the compact")
for c in (0.0,0.1,0.3,0.5):
    row=[]
    for k in (8,12,16,20):
        P=first_primes(k); lp=np.log(P); ln,mu=subset_logs(lp)
        d=np.log(abs(dsum(mu*np.exp(c*ln**2/lp.sum()),ln,S)))+lz; row.append(float(abs(d).max()))
    print(f"  c={c}: k=8,12,16,20 ->",["%.4f"%v for v in row]); out.append(dict(c=c,dev=row))
print("== Beurling prime sets and random sign twists (Gaussian evaluation): sup|log|Theta||, sup|log|Euler product||, sup|log(Theta/Euler)|, and at s=0.6")
rng=np.random.default_rng(7)
for x in (1000,10**4,10**5):
    P=primes_upto(x).astype(float); k=len(P); j=np.arange(1,k+1)
    sets={"primes":(P,np.ones(k)),"Beurling p_j(1+0.1 sin j)":(P*(1+0.1*np.sin(j)),np.ones(k)),
          "Beurling b_j=1.5+j^1.2":(1.5+j**1.2,np.ones(k)),"random signs":(P,rng.choice([-1.0,1.0],k)),
          "chi4 signs":(P,np.where(P%4==3,-1.0,1.0))}
    for name,(B,eps) in sets.items():
        lt,cond=theta_gauss(B,eps,S); le=euler_log(B,eps,S)
        row=dict(x=x,name=name,sup_logTh=float(abs(lt).max()),sup_logEuler=float(abs(le).max()),ratio=float(abs(lt-le).max()),at06=float(lt[0]),cond=float(cond.max()))
        out.append(row); print("  ",row,flush=True)
json.dump(out,open(HERE+"/t3.json","w"),indent=1)
