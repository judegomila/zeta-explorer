import numpy as np
from scipy.integrate import solve_ivp
def force(x):
    d=x[:,None]-x[None,:]; np.fill_diagonal(d,np.inf); return -2*(1/d).sum(1)
def thetas(x):
    N=len(x); out=np.empty(N-1)
    for i in range(N-1):
        g=x[i+1]-x[i]
        m=np.ones(N,bool); m[i]=m[i+1]=False
        out[i]=g*g*np.sum(1/((x[i]-x[m])*(x[i+1]-x[m])))/2
    return out
def rho(x,i):
    g=x[i+1]-x[i]; ds=[]
    if i>0: ds.append(x[i]-x[i-1])
    if i+2<len(x): ds.append(x[i+2]-x[i+1])
    return g/min(ds)
def run(x0,floor=1e-3,nmax=200000,rtol=1e-11):
    """integrate in log-time of the min gap: returns list of (s, minidx, Theta_min, m, rho)"""
    x=np.array(x0,float); s=0.0; rec=[]
    m0=np.min(np.diff(x))
    for it in range(nmax):
        g=np.diff(x); i=int(np.argmin(g)); m=g[i]
        th=thetas(x)
        rec.append((s,i,th[i],m,rho(x,i)))
        if m<floor*m0: break
        h=2e-4*m*m   # resolves 1/g^2 scale
        k1=force(x); k2=force(x+0.5*h*k1); k3=force(x+0.5*h*k2); k4=force(x+h*k3)
        x=x+h*(k1+2*k2+2*k3+k4)/6; s+=h
        if np.any(np.diff(x)<=0): break
    return rec
