# Control for Theorem B(iii): Xi_c(z)=cos(pi*rho*z)*((z-g)^2+b^2)*((z+g)^2+b^2), z real axis = critical line.
# Laguerre L(z)=Xi'^2-Xi Xi'' ; L/Xi^2 = -(log Xi)'' = pi^2 rho^2/cos^2(pi rho z) + sum_pairs 2(d^2-b^2)/(d^2+b^2)^2
import numpy as np
def lag(z,rho,g,b):
    on=(np.pi*rho)**2/np.cos(np.pi*rho*z)**2
    p=lambda d: 2*(d*d-b*b)/(d*d+b*b)**2
    return on+p(z-g)+p(z+g)
z=np.linspace(-40,40,2_000_001)
b=0.5; g=10.3
for rho in [0.5,0.85,0.89,0.9004,0.91,1.2]:
    m=lag(z,rho,g,b).min()
    print('rho=%.4f  rho*b*pi/sqrt2=%.4f  min L/Xi^2 on axis=%.5f  -> axis Laguerre %s (zeros off axis at %g +- %gi in all cases)'%(rho,rho*b*np.pi/np.sqrt(2),m,'HOLDS' if m>0 else 'fails',g,b))
# direct finite-difference confirmation of L>=0 at rho=1.2 using the function itself
import mpmath as mp
mp.mp.dps=30
rho=mp.mpf('1.2'); 
X=lambda z: mp.cos(mp.pi*rho*z)*((z-g)**2+b*b)*((z+g)**2+b*b)
mn=min(mp.diff(X,t)**2-X(t)*mp.diff(X,t,2) for t in [mp.mpf(k)/200 for k in range(1800,2300)])
print('direct min of Xi\'^2-Xi Xi\'\' on [9,11.5], rho=1.2:',mn)
# horizon: mean zero density of zeta = log(T/2pi)/(2pi) equals sqrt2/(pi b)
for b in [0.5,0.375]:
    r=np.sqrt(2)/(np.pi*b); print('b=%.3f critical density %.4f  -> T* = 2pi exp(2pi rho) = %.1f'%(b,r,2*np.pi*np.exp(2*np.pi*r)))
