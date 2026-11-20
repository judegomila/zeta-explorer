import numpy as np, math, sys, warnings
warnings.filterwarnings("ignore")
from scipy.optimize import minimize
from cm2 import *
rng=np.random.default_rng(3)
def cfg(u): return np.concatenate([[0],np.cumsum(np.exp(np.clip(u,-2,2)))])
def stats(u):
    try:
        rec=run(cfg(u),floor=4e-2,c=1e-2,nmax=20000)
        eta=1-rec[:,2]; m=rec[:,3]
        R=8*eta[0]*tc_est(rec)/m[0]**2
        if not np.isfinite(R) or rec[-1,3]>4.1e-2*m[0]: return 0.0,1.0,1.0
        return R, rec[0,2], rec[:,2].max()
    except Exception: return 0.0,1.0,1.0
def search(obj,N,trials,label):
    best=(-1,None)
    for trial in range(trials):
        u0=(0.1 if trial%2 else 0.4)*rng.standard_normal(N-1)
        res=minimize(lambda u:-obj(stats(u)),u0,method='Nelder-Mead',options={'maxiter':300,'xatol':1e-4,'fatol':1e-8})
        if -res.fun>best[0]: best=(-res.fun,res.x)
    R,t0,tmax=stats(best[1]); gp=np.exp(np.clip(best[1],-2,2))
    print(label,"N",N,"R",round(R,5),"Theta0",round(t0,4),"Theta_max",round(tmax,4),"excursion",round(tmax-t0,5),"gaps/min",np.round(gp/gp.min(),4)); sys.stdout.flush()
for N in (3,4,5,6,7): search(lambda s:s[0],N,5,"maxR")
for N in (4,5,6,7): search(lambda s:s[2]-s[1],N,5,"maxExc")
# relative excursion: (eta0 - eta_min_over_time)/eta0
for N in (4,5,6,7): search(lambda s:(s[2]-s[1])/(1-s[1]) if s[1]<1 else 0,N,5,"maxRelExc")
