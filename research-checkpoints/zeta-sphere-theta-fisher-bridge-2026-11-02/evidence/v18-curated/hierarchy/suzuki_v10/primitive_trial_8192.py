"""Original finite Rayleigh witness; exploratory eigenvector, interval verification."""
import numpy as np, scipy.special as sp, scipy.linalg as la, mpmath as mp,json
from pathlib import Path
P=Path(__file__).parent;n=8192;K=768;w=.4;R=np.log(3);h=R/n;c2=(2**w-2**(-w))/np.sqrt(2)
def fcoeff(alpha):
 p=1.;out=[1/w]
 for j in range(1,K+1):p*= (j-1-alpha)/j;out.append(p/(w+j))
 return np.array(out)
b=np.ones(K+1)
for j in range(1,K+1):b[j]=b[j-1]*(j+.05)/j
coef=(9*np.cumsum(fcoeff(.05))-8*np.convolve(fcoeff(.1),b)[:K+1])/(w+np.arange(K+1)+1)*np.pi**w/sp.gamma(w)/2
def T(r):
 z=-np.expm1(-2*np.maximum(r,0));return z**(w+1)*np.polynomial.polynomial.polyval(z,coef)
r=np.arange(2*n+1)*h-R
seq=(np.diff(T(r),n=2)+c2*np.diff(T(r-np.log(2)),n=2))/h
from scipy.sparse.linalg import LinearOperator,eigsh
from scipy.signal import fftconvolve
op=LinearOperator((n,n),matvec=lambda v:fftconvolve(seq,v[::-1])[n-1:2*n-1],dtype=float)
e,v=eigsh(op,k=1,which='LA',tol=1e-12)
ci=np.rint(v[:,0]*10**9).astype(np.int64)
print('candidate eigenvalue',e[0],flush=True)
# Exact integer anti-diagonal weights, normalized only in interval arithmetic.
cc=[int(x) for x in ci];norm=sum(x*x for x in cc)
assert norm<2**63
# Every partial absolute sum of products is <=norm by Cauchy-Schwarz.
conv=[int(x) for x in np.convolve(ci,ci)]

mp.iv.dps=45;mp.mp.dps=55;I=mp.iv;wi=I.mpf(2)/5;Ri=I.ln(3);hi=Ri/n;c2i=(2**wi-2**(-wi))/I.sqrt(2)
def fci(alpha):
 p=I.mpf(1);out=[1/wi]
 for j in range(1,K+1):p*= (j-1-alpha)/j;out.append(p/(wi+j))
 return out
f=fci(I.mpf(1)/20);g=fci(I.mpf(1)/10);b=[I.mpf(1)]
for j in range(1,K+1):b.append(b[-1]*(j+I.mpf(1)/20)/j)
co=[];pref=I.pi**wi/I.gamma(wi)/2;fs=I.mpf(0)
for j in range(K+1):
 fs+=f[j];co.append(pref*(9*fs-8*sum((g[k]*b[j-k] for k in range(j+1)),I.mpf(0)))/(wi+j+1))
# For |F_j|<=5/2 and b_j<=j+1, absolute integrated coefficient before C/2 is <=33(j+2)^2.
# Geometric polynomial tail sum bounded by 2 (K+3)^2 z^(K+1)/(1-z)^3, z<=8/9.
tail=abs(pref)*66*(K+3)**2*(I.mpf(8)/9)**(K+1)/(1-I.mpf(8)/9)**3
print('uniform T tail',tail,flush=True)
def Ti(r):
 if mp.mpf(r.b)<=0:return I.mpf(0)
 assert mp.mpf(r.a)>=0, 'activation interval straddles zero; refine enclosure'
 z=1-I.exp(-2*r);s=co[-1]
 for c in co[-2::-1]:s=c+z*s
 return z**(wi+1)*s+I.mpf([-1,1])*mp.mpf(tail.b)
Ts=[];Us=[]
for k in range(2*n+1):
 r=(I.mpf(k)/n-1)*Ri
 Ts.append(Ti(r));Us.append(Ti(r-I.ln(2)))
 if k%256==0:print('endpoint',k,flush=True)
val=I.mpf(0)
for k,c in enumerate(conv):val+=c*((Ts[k+2]-2*Ts[k+1]+Ts[k])+c2i*(Us[k+2]-2*Us[k+1]+Us[k]))
val/=hi*norm
print('CERTIFIED RAYLEIGH',val,flush=True)
assert mp.mpf(val.a)>mp.mpf('.9999948')
(P/'primitive_trial_8192_certificate.json').write_text(json.dumps({'n':n,'terms':K,'ci':cc,'norm':str(norm),'rayleigh':[str(mp.mpf(val.a)),str(mp.mpf(val.b))],'tail_upper':str(mp.mpf(tail.b))},indent=2))
