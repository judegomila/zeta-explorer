import numpy as np, math
from cm2 import *
from numpy.polynomial.hermite import hermgauss
rng=np.random.default_rng(11)
def gen(kind):
    N=int(rng.integers(3,25))
    if kind==0: gaps=1+rng.exponential(0.5,N-1)
    elif kind==1: gaps=1+rng.random(N-1)*0.05           # near-lattice
    elif kind==2:
        z,_=hermgauss(N); z=np.sort(z)*(1+0.0*rng.random()); gaps=np.diff(z)*(1+0.03*rng.standard_normal(N-1)); 
    elif kind==3: gaps=np.exp(rng.standard_normal(N-1))  # wild
    else:
        gaps=1+0.02*rng.random(N-1); k=rng.integers(0,N-1); gaps[k]=1-0.3*rng.random()
    return np.concatenate([[0],np.cumsum(gaps)])
worst_mono=np.inf; worst_jump=-np.inf; maxR=0; argR=None; maxexc=0; argexc=None; cnt=0
for t in range(1500):
    kind=t%5; x=gen(kind)
    rec=run(x,floor=2e-2)
    eta=1-rec[:,2]; m=rec[:,3]; q=eta/m
    dq=np.diff(q)/q[:-1]
    worst_mono=min(worst_mono,dq.min())
    sw=np.nonzero(np.diff(rec[:,1])!=0)[0]
    if len(sw): worst_jump=max(worst_jump,np.max(rec[sw+1,2]-rec[sw,2]))
    tc=tc_est(rec); R=8*eta[0]*tc/m[0]**2
    assert tc<=m[0]**2/(4*eta[0])*(1+1e-6) and tc>=m[0]**2/8*(1-1e-6)
    if R>maxR: maxR=R; argR=(kind,len(x))
    exc=rec[:,2].max()-rec[0,2]
    if exc>maxexc: maxexc=exc; argexc=(kind,len(x),rec[0,2],rec[:,2].max())
    cnt+=1
print("runs",cnt)
print("min relative step-increment of eta_min/m (theorem: >=0):",worst_mono)
print("max Theta jump at index switch (theorem: <=0):",worst_jump)
print("max R = 8 eta0 tc / m0^2 (theorem: 1<=... R<=2):",maxR,argR)
print("max excursion sup Theta_min - Theta_min(0):",maxexc,argexc)
