# Checks: (1) I(a,b) = a b int_0^inf {t/a}{t/b} dt/t^2 (Vasyunin closed form vs direct piecewise integration)
#         (2) K = int_0^1 A = (3/4)(log 2pi - gamma) - 1/4 by direct quadrature of the t-integral
import math, numpy as np
from math import gcd, log, pi
G=0.5772156649015329; C=(log(2*pi)-G)/2
def V(a,b):
    m=np.arange(1,b); return float(np.sum(((m*a)%b)/b/np.tan(pi*m/b)))
def Iv(a,b): return C*(a+b)+0.5*(a-b)*log(b/a)-(pi/2)*(V(a,b)+V(b,a))
def Idirect(a,b,Kper=4000):
    # exact piecewise integral on [0,T], T=a*b*Kper, plus tail mean/T
    P=a*b; T=P*Kper
    br=np.unique(np.concatenate([np.arange(0,T+1,a),np.arange(0,T+1,b)])).astype(np.float64)
    lo=br[:-1]; hi=br[1:]
    i=np.floor(lo/a+1e-9); j=np.floor(lo/b+1e-9)
    # integrand (t/a-i)(t/b-j)/t^2 = 1/(ab) - (i/b+j/a)/t + ij/t^2
    s=0.0
    # first piece from 0: i=j=0 -> hi/(ab)
    with np.errstate(divide='ignore',invalid='ignore'):
        val=(hi-lo)/(a*b) - (i/b+j/a)*np.log(np.where(lo>0,hi/np.where(lo>0,lo,1),1)) + i*j*(np.where(lo>0,1/np.where(lo>0,lo,1),0)-1/hi)
    s=float(np.sum(val[1:]))+hi[0]/(a*b)
    # tail: mean of {t/a}{t/b} over a period, exact = 1/4 + 1/(12ab) for coprime a,b
    mean=0.25+1.0/(12*a*b)
    s+=mean/T
    return a*b*s
for (a,b) in [(1,2),(2,3),(2,5),(3,7),(5,13),(7,30),(11,31),(1,17)]:
    print(a,b,"Vasyunin I=%.9f"%Iv(a,b),"direct=%.9f"%Idirect(a,b),"lower bd a(1+L)=%.6f"%a)
K=0.75*(log(2*pi)-G)-0.25
print("K closed form",K)
# direct: K = 1/2 + sum_n int_0^1 x(n+x^2)/(2(n+x)^3) dx
import mpmath as mp
mp.mp.dps=25
tot=mp.mpf(1)/2
tot+=mp.nsum(lambda n: mp.quad(lambda x: x*(n+x*x)/(2*(n+x)**3),[0,1]),[1,mp.inf])
print("K by quadrature",tot)
