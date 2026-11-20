"""Rouche returns of the DH zero rho0: tau with max_{|s-rho0|=r}|f(s+i tau)-f(s)| < min_{|s-rho0|=r}|f(s)|."""
import numpy as np, json, sys
from lib import *
T=float(sys.argv[1]); dt=0.05; J=48
Z=json.load(open(f'census_dh_{int(T)}.json'))['zeros']; zr=np.array([z[0] for z in Z]); zi=np.array([z[1] for z in Z])
M=int(round(T/dt)); M+=M%2; tau=dt*np.arange(M)
out={'T':T,'n_zeros_census':len(Z)}
# zero counts N(sigma,T) and growth
out['N_sigma']={str(s):[int(((zr>=s)&(zi<=h)).sum()) for h in (1e3,3e3,1e4,3e4,1e5)] for s in (0.55,0.6,0.65,0.7085,0.7585,0.8,0.9,1.0)}
def onesep(ts):
    c=0; last=-9
    for x in ts:
        if x-last>=1: c+=1; last=x
    return c
for r in (0.1,0.05,0.02):
    th=2*np.pi*np.arange(J)/J; sj=RHO0+r*np.exp(1j*th)
    fine=RHO0+r*np.exp(2j*np.pi*np.arange(2000)/2000)
    mmin=float(np.min(np.abs(point(DH,fine)))); f0=point(DH,sj)
    Mx=np.zeros(M)
    for j in range(J):
        f=line(DH,sj[j].real,sj[j].imag,dt,M,tmax=T+200)
        Mx=np.maximum(Mx,np.abs(f-f0[j]))
    res={'min_on_circle':mmin}
    for eta in (1.0,0.9):
        ret=tau[(Mx<eta*mmin)&(tau>=1)]
        res[f'eta{eta}']={'measure':float(len(ret)*dt),'one_separated':onesep(ret),
          'one_sep_by_height':[onesep(ret[ret<=h]) for h in (1e3,3e3,1e4,3e4,1e5)],
          'needed_exponent_huxley_12/5':2.4*(1-RHO0.real+r)}
    ret=tau[(Mx<mmin)&(tau>=1)]
    # zeros within r of rho0+i tau: tau-measure and one-separated count
    near=np.abs(zr-RHO0.real)<r
    half=np.sqrt(np.maximum(r*r-(zr[near]-RHO0.real)**2,0)); ctr=zi[near]-RHO0.imag
    keep=ctr>1
    res['zeros_in_disc']={'count':int(keep.sum()),'tau_measure':float(2*half[keep].sum()),'by_height':[int((keep&(ctr<=h)).sum()) for h in (1e3,3e3,1e4,3e4,1e5)]}
    # every return must have a zero in its disc (Rouche): check
    if len(ret):
        d=np.min(np.abs((zr[None,:]+1j*zi[None,:])-(RHO0+1j*ret[:,None])),axis=1) if len(ret)*len(Z)<5e7 else None
        res['returns_with_zero_in_disc']=None if d is None else [int((d<r).sum()),int(len(ret))]
    # Bohr statistics: |p^{-i tau}-1| on returns vs baseline 4/pi
    res['bohr']={str(p):[float(np.mean(np.abs(np.exp(-1j*ret*np.log(p))-1))) if len(ret) else None] for p in (2,3,7,11,13,101)}
    # conditional frequency inside Bohr sets of small primes
    cond={}
    for P in ([2],[2,3],[2,3,7],[2,3,7,11]):
        for dl in (0.5,0.25):
            inb=np.ones(M,bool)
            for p in P: inb&=np.abs(np.exp(-1j*tau*np.log(p))-1)<dl
            inb&=tau>=1
            nb=int(inb.sum()); nr=int((inb&(Mx<mmin)).sum())
            cond[f'{P}|{dl}']=[nb*dt,nr*dt,(nr/nb if nb else None)]
    res['bohr_conditional(measure_bohr,measure_returns_in_bohr,fraction)']=cond
    res['unconditional_fraction']=float(len(ret)*dt/T)
    out[f'r{r}']=res
    print(r,json.dumps(res)[:1500],flush=True)
json.dump(out,open(f'returns_dh_{int(T)}.json','w'),indent=1)
print(json.dumps(out['N_sigma']))
