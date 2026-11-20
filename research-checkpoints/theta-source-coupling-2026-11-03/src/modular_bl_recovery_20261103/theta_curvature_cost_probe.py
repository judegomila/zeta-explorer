import numpy as np
from scipy.special import roots_legendre
from scipy.optimize import minimize_scalar
x,w=roots_legendre(400); h=1.25*(x+1); w=1.25*w; z=np.pi*np.arange(1,9)[None,:]**2*np.exp(2*h[:,None]);psi=4*np.exp(h[:,None]/2-z)*(2*z*z-3*z);p=psi.sum(axis=1); t=np.linspace(0,100,4001); ph=np.outer(t,h); ch=np.cos(ph); sh=np.sin(ph)
F=2*(ch@(w*p));F1=-2*(sh@(w*p*h));F2=-2*(ch@(w*p*h*h));F4=2*(ch@(w*p*h**4));l=2*(F1**2-F*F2);l2=2*(F2**2-F*F4);D=2*np.trapz(l,t);Q=2*np.trapz(t*t*l,t)
def I(C):return 2*np.trapz(t*t*np.maximum(l2-C*l,0),t)
r=minimize_scalar(I,bounds=(0,100),method='bounded');print('D',D,'Q',Q,'minI/D',r.fun/D,'Cmin',r.x)
for C in [0,0.5,1,2,4,8,12,16,24,32,48,64,100]:print(C,I(C)/D)
