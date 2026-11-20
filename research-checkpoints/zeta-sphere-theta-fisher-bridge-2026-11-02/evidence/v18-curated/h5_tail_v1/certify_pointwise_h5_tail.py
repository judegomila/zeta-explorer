"""Original interval certificate for complete-theta pointwise H5 above z=4.
Uses exact first-term log derivatives and full-tail log correction.
"""
import mpmath as mp
from math import comb,factorial
import json,time
from pathlib import Path
iv=mp.iv;iv.dps=45;mp.mp.dps=60
K=11
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
 for k in [2,4,6,8,10]:
  bound=hi(abs(wide[k+1]/(2*Z))*iv.mpf(rad))
  ell[k]+=iv.mpf([-bound,bound])
 x=-ell[2];y=ell[4];z=-ell[6];w=ell[8];v=-ell[10]
 P=192*v*x**4+144*v*x*x*y+8*v*x*z-8*v*y*y-8*w*w*x+9600*w*x**5+3360*w*x**3*y-80*w*x*x*z-1360*w*x*y*y+16*w*y*z+368640*x**9+1198080*x**7*y+168960*x**6*z+867840*x**5*y*y+115200*x**4*y*z+220800*x**3*y**3-992*x**3*z*z+53440*x*x*y*y*z-56000*x*y**4+3536*x*y*z*z-2240*y**3*z-8*z**3
 return x,P-10000*x**9,P/x**9
if __name__=='__main__':
 begin=time.time();N=5600;minx=mp.inf;minmargin=mp.inf;minratio=mp.inf
 for i in range(N):
  Z=4+iv.mpf([i,i+1])/200
  x,margin,ratio=point(Z)
  assert lo(x)>17,(i,x)
  assert lo(margin)>0,(i,margin)
  minx=min(minx,lo(x));minmargin=min(minmargin,lo(margin));minratio=min(minratio,lo(ratio))
  if i%500==0:print(i,mp.nstr(minmargin,15),flush=True)
 out={'z_domain':['4','32'],'subintervals':N,'width':'1/200','finite_theta_N':6,'interval_decimal_precision':iv.dps,'proved':'X>17,H5_odd_det>10000*X^9','minimum_X_lower':str(minx),'minimum_margin_lower':str(minmargin),'minimum_odd_det_over_X9_lower':str(minratio),'elapsed_seconds':time.time()-begin}
 Path(__file__).with_name('certificate_h5_tail.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
