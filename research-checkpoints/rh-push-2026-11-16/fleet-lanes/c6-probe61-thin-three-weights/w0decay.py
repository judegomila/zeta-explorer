import numpy as np, math
from scipy.special import j0
import prep6 as P6
SQ3=math.sqrt(3)
rr=np.linspace(1,1.25,4001); wr=P6.bump(rr,1,1.25); dr=rr[1]-rr[0]
s=np.linspace(0,60,60001)
W=np.empty(len(s))
for i in range(0,len(s),2000):
    J=j0(4*math.pi*np.outer(s[i:i+2000],np.sqrt(rr))/SQ3)*wr[None,:]
    W[i:i+2000]=(2*math.pi/SQ3)*(J[:,1:]+J[:,:-1]).sum(axis=1)*dr/2
print('W0~(0)=',W[0])
env=np.maximum.accumulate(np.abs(W[::-1]))[::-1]
for frac in (0.5,0.1,0.01,1e-3,1e-4):
    k=int(np.argmax(env<=frac*W[0])); print(f"sup_(t>=T)|W0~| <= {frac} W0~(0) from sqrt(T) = {s[k]:.2f}, T = {s[k]**2:.1f}")
for lg in (10,14,18,22,26,30,34,38):
    Z=2.0**lg; print(lg, 'X 7^6/Z = %.3g' % (Z**0.5*7**6/Z))
