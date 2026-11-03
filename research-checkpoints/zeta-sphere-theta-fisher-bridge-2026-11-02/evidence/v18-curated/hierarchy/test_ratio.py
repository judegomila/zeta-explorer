"""Exploratory floating-point tests only, not certified positivity."""
import numpy as np
from scipy.integrate import quad
from scipy.special import logsumexp
from scipy.fft import dct
from math import pi, exp, log, log1p, sinh, cosh

def lp(u):
    u=abs(u)
    if u>350:return -float('inf')
    r=pi*np.arange(1,7,dtype=float)**2*exp(2*u)
    return log(4)+u/2+logsumexp(np.log(r)+np.log(2*r-3)-r)

def corr(u):
    r=pi*exp(2*abs(u))
    c=log1p(-1.5/r)
    if r>30:return c
    return c+log1p(sum(k*k*(2*r*k*k-3)/(2*r-3)*exp(-r*(k*k-1)) for k in range(2,7)))

def ratio(v,n):
    scale=exp(-v); c0=2*corr(v)
    def den(s):
        h=s*scale
        if h<=v:z=-4*pi*exp(2*v)*sinh(h)**2
        else:z=9*(h-v)-2*pi*exp(2*h)*cosh(2*v)+2*pi*exp(2*v)
        z+=corr(h-v)+corr(h+v)-c0
        return s**(2*n)*exp(z) if z>-740 else 0.
    A=quad(den,0,12,epsabs=1e-12,epsrel=1e-10)[0]
    B=quad(lambda s:s*s*den(s),0,12,epsabs=1e-12,epsrel=1e-10)[0]
    return scale*scale*B/A
if __name__=='__main__':
    V=8.; N=512; vs=np.linspace(0,V,N+1)
    for n in [0,1,2,4]:
        rs=np.array([ratio(v,n) for v in vs]); tr=dct(rs,type=1)*(V/N)
        bad=np.where(tr < -1e-9)[0]
        print(n,'ratio0',rs[0],'min DCT',tr.min(),'first neg',bad[:5], flush=True)
        np.savez(f'/workspace/shared/zeta_sphere_campaign/hierarchy/ratio_n{n}.npz',v=vs,ratio=rs,transform=tr)
