"""Original interval proof of the full theta pointwise H3 sufficient inequality.
All intervals include an analytic infinite theta tail. No acquired code used.
"""
import mpmath as mp
from math import comb
import json,time
from pathlib import Path
iv=mp.iv; iv.dps=45
S=[[0]*7 for _ in range(7)]; S[0][0]=1
for n in range(1,7):
 for k in range(1,n+1): S[n][k]=k*S[n-1][k]+S[n-1][k-1]
def lo(x):return mp.mpf(x._mpi_[0])
def hi(x):return mp.mpf(x._mpi_[1])
# midpoint-endpoint conversion uses mp exact tuples; mp.dps preserves more than iv.dps.
mp.mp.dps=60
def point(Z):
 vals=[]
 for k in range(7):
  val=(2*Z-3 if k==0 else iv.mpf(2) if k==1 else iv.mpf(0))
  for n in range(2,7):
   d=n*n-1
   pol=(-d)**k*(2*n*n*Z-3)
   if k: pol+=2*k*n*n*(-d)**(k-1)
   val+=n*n*pol*iv.exp(-d*Z)
  # n>=7 absolute tail: n^(2k+4)(2Z+2k)exp(-(n²-1)Z).
  # ratio of successive terms <= (8/7)^16 exp(-15 Zlo) < 1/2 for Z>=3.
  tail=2*7**(2*k+4)*(2*Z+2*k)*iv.exp(-48*Z)
  T=hi(tail)
  val+=iv.mpf([-T,T]);vals.append(val)
 logs=[iv.mpf(0)]*7
 for k in range(1,7):
  logs[k]=(vals[k]-sum(comb(k-1,j-1)*logs[j]*vals[k-j] for j in range(1,k)))/vals[0]
 ell={k:2**k*(-Z+sum(S[k][j]*Z**j*logs[j] for j in range(1,k+1))) for k in [2,4,6]}
 x=-ell[2];y=ell[4];z=-ell[6]
 P=x*z+18*x*x*y+24*x**4-y*y
 return x,P-8*x**4,P/x**4
if __name__=='__main__':
 t=time.time(); N=13000
 minx=mp.inf; minmargin=mp.inf; minratio=mp.inf
 for i in range(N):
  Z=3+iv.mpf([i,i+1])/1000
  x,margin,ratio=point(Z)
  assert lo(x)>17,(i,x)
  assert lo(margin)>0,(i,margin)
  minx=min(minx,lo(x));minmargin=min(minmargin,lo(margin));minratio=min(minratio,lo(ratio))
  if i%1000==0: print(i,mp.nstr(minx,15),mp.nstr(minmargin,15),flush=True)
 out={'z_domain':['3','16'],'subintervals':N,'width':'1/1000','finite_theta_N':6,'interval_decimal_precision':iv.dps,'proved':'x>17 and P>8*x^4 on every interval','minimum_x_lower':str(minx),'minimum_margin_lower':str(minmargin),'minimum_P_over_x4_lower':str(minratio),'elapsed_seconds':time.time()-t}
 Path(__file__).with_name('certificate.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
