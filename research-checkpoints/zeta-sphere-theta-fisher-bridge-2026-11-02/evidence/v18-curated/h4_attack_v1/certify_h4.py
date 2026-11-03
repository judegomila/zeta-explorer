"""Original interval certificate for complete-theta pointwise H4.
Uses exact first-term log derivatives and full-tail log correction.
"""
import mpmath as mp
from math import comb,factorial
import json,time
from pathlib import Path
iv=mp.iv;iv.dps=45;mp.mp.dps=60
K=9
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
def point(Z):
 wide=derivatives(Z)
 mid=(lo(Z)+hi(Z))/2;rad=(hi(Z)-lo(Z))/2
 ell=derivatives(iv.mpf(mid))
 for k in [2,4,6,8]:
  bound=hi(abs(wide[k+1]/(2*Z))*iv.mpf(rad))
  ell[k]+=iv.mpf([-bound,bound])
 x=-ell[2];y=ell[4];z=-ell[6];w=ell[8]
 P=4*(4*w*x*x+w*y+768*x**6+1344*x**4*y+128*x**3*z+304*x*x*y*y+68*y**3-z*z)
 A=2*y+8*x*x
 return x,A,P-500*x**6,P/x**6
if __name__=='__main__':
 begin=time.time();N=13000;minx=mp.inf;mina=mp.inf;minmargin=mp.inf;minratio=mp.inf
 for i in range(N):
  Z=3+iv.mpf([i,i+1])/1000
  x,A,margin,ratio=point(Z)
  assert lo(x)>17,(i,x)
  assert lo(A)>0,(i,A)
  assert lo(margin)>0,(i,margin)
  minx=min(minx,lo(x));mina=min(mina,lo(A));minmargin=min(minmargin,lo(margin));minratio=min(minratio,lo(ratio))
  if i%1000==0:print(i,mp.nstr(minmargin,15),flush=True)
 out={'z_domain':['3','16'],'subintervals':N,'width':'1/1000','finite_theta_N':6,'interval_decimal_precision':iv.dps,'proved':'X>17,A>0,H4_even_det>500*X^6','minimum_X_lower':str(minx),'minimum_A_lower':str(mina),'minimum_margin_lower':str(minmargin),'minimum_even_det_over_X6_lower':str(minratio),'elapsed_seconds':time.time()-begin}
 Path(__file__).with_name('certificate_h4.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
