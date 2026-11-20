import numpy as np
def force(x):
    d=x[:,None]-x[None,:]; np.fill_diagonal(d,np.inf); return -2*(1/d).sum(1)
def theta_i(x,i):
    g=x[i+1]-x[i]
    a=x[i]-x; b=x[i+1]-x
    a=np.delete(a,[i,i+1]); b=np.delete(b,[i,i+1])
    return g*g*np.sum(1/(a*b))/2
def rho_i(x,i):
    g=x[i+1]-x[i]; ds=[]
    if i>0: ds.append(x[i]-x[i-1])
    if i+2<len(x): ds.append(x[i+2]-x[i+1])
    return g/min(ds)
def run(x0,floor=1e-3,c=4e-3,nmax=10**6):
    x=np.array(x0,float); s=0.0; rec=[]
    m0=np.min(np.diff(x))
    for it in range(nmax):
        g=np.diff(x); i=int(np.argmin(g)); m=g[i]
        rec.append((s,i,theta_i(x,i),m,rho_i(x,i)))
        if m<floor*m0: break
        h=c*m*m
        k1=force(x); k2=force(x+0.5*h*k1); k3=force(x+0.5*h*k2); k4=force(x+h*k3)
        x=x+h*(k1+2*k2+2*k3+k4)/6; s+=h
    return np.array(rec)
def tc_est(rec):
    # extrapolate: near collision m^2 ~ 8 (tc - s)(1-Theta)
    s,i,th,m,r=rec[-1]; return s+m*m/(8*(1-th))
