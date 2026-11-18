# Off-line zeros of xi_X = E_X + E_X^# strictly inside 1/2 < Re s < 1, 0 < t < 60 (float64 grid, mpmath refinement).
import numpy as np, mpmath as mp, math, json, time
T0=time.time()
from mpmath import fp
from stage import PR, Theta
mp.mp.dps=30
sig=np.arange(0.505,1.0,0.005); tt=np.arange(0.05,60.0,0.01)
print('grid',len(sig),'x',len(tt),'=',len(sig)*len(tt)*16/1e6,'MB',flush=True)
S,T=np.meshgrid(sig,tt,indexing='ij'); s=S+1j*T
lg=np.vectorize(lambda z: complex(fp.loggamma(complex(z))),otypes=[complex])
th0=np.exp((-(1-s)/2*math.log(math.pi)+lg((1-s)/2))-(-(s)/2*math.log(math.pi)+lg(s/2)))
res=[]
th=th0.copy(); k=0
for X in (2,3,5,7,11,13,23,47):
    while k<len(PR) and PR[k]<=X:
        p=PR[k]; th=th*(1-p**(-s))/(1-p**(s-1)); k+=1
    a=np.abs(1+th); c=a[1:-1,1:-1]
    m=(c<a[:-2,1:-1])&(c<a[2:,1:-1])&(c<a[1:-1,:-2])&(c<a[1:-1,2:])&(c<0.3)
    ii,jj=np.where(m); roots=[]
    for i,j in zip(ii,jj):
        z0=mp.mpc(sig[i+1],tt[j+1])
        def f(z,z0=z0):
            if abs(z-z0)>0.5: raise ValueError('left the cell')
            return 1+Theta(z,X)
        try: r=mp.findroot(f,z0,tol=1e-18,maxsteps=30)
        except Exception: continue
        if 0.5+1e-5<r.real<1 and 0<r.imag<60 and abs(1+Theta(r,X))<1e-12 and all(abs(r-q)>1e-6 for q in roots): roots.append(r)
    roots.sort(key=lambda z:z.imag)
    # on-line zeros: sign changes of arg, counted as crossings of Theta=-1 on sigma=1/2
    t1=np.arange(0.05,60.0,0.002); s1=0.5+1j*t1
    l1=np.exp((-(1-s1)/2*math.log(math.pi)+lg((1-s1)/2))-(-(s1)/2*math.log(math.pi)+lg(s1/2)))
    for p in PR:
        if p>X: break
        l1=l1*(1-p**(-s1))/(1-p**(s1-1))
    ph=np.unwrap(np.angle(-l1)); online=int(np.sum(np.floor(ph[1:]/(2*np.pi))!=np.floor(ph[:-1]/(2*np.pi))))
    d=dict(X=X,candidates=int(len(ii)),offline_in_strip=len(roots),online_crossings_t_lt_60=online,
           frac_grid_abs_theta_gt_1=round(float(np.mean(np.abs(th)>1)),4),zeros=[mp.nstr(r,12) for r in roots[:10]])
    d['elapsed_s']=round(time.time()-T0,1); res.append(d); print(d,flush=True); json.dump(res,open('strip.json','w'),indent=1)
json.dump(res,open('strip.json','w'),indent=1)
