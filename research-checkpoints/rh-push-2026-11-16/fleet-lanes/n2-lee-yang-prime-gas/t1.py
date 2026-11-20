# Test 1: exact 2^k sums for the rank-one (mean-field) Lee-Yang gas, S = first k primes.
import sys; from lib import *
S=grid(); tt=S.imag; lz=logabs_target(S,"zeta")
low=tt<=10; res=[]
print("grid points",len(S),"; sigma in {0.6,0.7,0.8,0.9}, t in [0,60] step 0.2")
print(" k   pmax      L   sup|log|Th||  sup|log|Th*zeta|| (all)  (t<=10)  (t>10)   sup|log|Euler_S*zeta||  sup|log(Th/Euler_S)|")
for k in range(4,23):
    P=first_primes(k); lp=np.log(P); L=lp.sum()
    N=2**k; chunk=max(1,int(6e8/(16*N)))
    if k>=20: print(f"  [alloc k={k}: arrays 2x{N*8/1e6:.0f} MB, exp matrix chunk {chunk}x{N} complex = {chunk*N*16/1e6:.0f} MB]",flush=True)
    ln,mu=subset_logs(lp)
    th=dsum(mu*np.exp(ln**2/(2*L)),ln,S)
    eu=np.prod(1-np.exp(-np.outer(S,lp)),axis=1)
    lt=np.log(abs(th)); d=lt+lz; de=np.log(abs(eu))+lz; r=np.log(abs(th/eu))
    row=dict(k=k,pmax=P[-1],L=L,sup_logTh=float(abs(lt).max()),dev=float(abs(d).max()),dev_low=float(abs(d[low]).max()),
             dev_high=float(abs(d[~low]).max()),dev_euler=float(abs(de).max()),ratio=float(abs(r).max()),
             argmax=[float(S[abs(d).argmax()].real),float(S[abs(d).argmax()].imag)])
    res.append(row)
    print(f"{k:2d} {P[-1]:5.0f} {L:7.3f} {row['sup_logTh']:9.4f} {row['dev']:14.4f} {row['dev_low']:14.4f} {row['dev_high']:8.4f} {row['dev_euler']:12.4f} {row['ratio']:14.4f}  argmax s={row['argmax']}",flush=True)
json.dump(res,open(HERE+"/t1.json","w"),indent=1)
