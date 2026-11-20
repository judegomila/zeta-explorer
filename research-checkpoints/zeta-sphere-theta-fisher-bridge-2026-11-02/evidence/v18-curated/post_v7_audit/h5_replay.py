"""Original interval certificate for complete-theta pointwise H4.
Uses exact first-term log derivatives and full-tail log correction.
"""
import mpmath as mp
from math import comb,factorial
import json,time
from pathlib import Path
iv=mp.iv;iv.dps=45;mp.mp.dps=60
K=10
S=[[0]*(K+1) for _ in range(K+1)];S[0][0]=1
for n in range(1,K+1):
 for k in range(1,n+1):S[n][k]=k*S[n-1][k]+S[n-1][k-1]
def lo(x):return mp.mpf(x._mpi_[0])
def hi(x):return mp.mpf(x._mpi_[1])
def derivatives(Z):
 # T = Sprofile - first linear summand; full ordinary-z derivatives.
 vals=[]
 for k in range(K+1):
  val=iv.mpf(0)
  for n in range(2,7):
   d=n*n-1;pol=(-d)**k*(2*n*n*Z-3)
   if k:pol+=2*k*n*n*(-d)**(k-1)
   val+=n*n*pol*iv.exp(-d*Z)
  # Tail ratio <= (8/7)^(2K+4) exp(-15 Zlo)<1/2.
  tail=2*7**(2*k+4)*(2*Z+2*k)*iv.exp(-48*Z);T=hi(tail)
  val+=iv.mpf([-T,T]);vals.append(val)
 # T=(2z-3)r. This isolates the harmless linear head before log differentiation.
 r=[]
 for k in range(K+1):r.append((vals[k]-(2*k*r[k-1] if k else 0))/(2*Z-3))
 s=[1+r[0]]+r[1:];q=[iv.mpf(0)]*(K+1)
 for k in range(1,K+1):q[k]=(s[k]-sum(comb(k-1,j-1)*q[j]*s[k-j] for j in range(1,k)))/s[0]
 t=iv.mpf(3)/(2*Z);ans={}
 for k in range(2,K+1):
  geom=sum(S[k-1][j]*factorial(j)*t**j/(1-t)**(j+1) for j in range(1,k))
  ans[k]=-2**k*Z-(-2)**k*geom+2**k*sum(S[k][j]*Z**j*q[j] for j in range(1,k+1))
 return ans

if __name__=='__main__':
 ell=derivatives(iv.pi)
 coeff=[iv.mpf(1)]
 for n in range(1,6):
  coeff.append(sum(j*(2*ell[2*j]/factorial(2*j))*coeff[n-j] for j in range(1,n+1))/n)
 mu=[(-1)**j*factorial(2*j)*coeff[j] for j in range(6)]
 a,b,c,d,e=mu[1:6]
 det=a*(c*e-d*d)-b*(b*e-c*d)+c*(b*d-c*c)
 assert hi(det)<0
 out={'point':'h=0, z=pi enclosed by mpmath.iv.pi','finite_theta_N':6,'infinite_tail_enclosed':True,'precision':iv.dps,'moments':[[str(lo(v)),str(hi(v))] for v in mu],'odd_3x3_determinant':[str(lo(det)),str(hi(det))],'scope':'pointwise product kernel only; not the h-integrated bridge kernel'}
 Path(__file__).with_name('pointwise_h5_obstruction.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
