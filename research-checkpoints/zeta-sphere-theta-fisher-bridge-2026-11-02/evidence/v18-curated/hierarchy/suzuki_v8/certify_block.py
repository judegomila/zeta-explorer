"""Original finite-block certificate. See BLOCK_CERTIFICATE.md for analytic and floating error budget.
No external code is fetched or executed. Polynomial evaluation replaces special-function array calls.
"""
import numpy as np, mpmath as mp, json, math, time
from pathlib import Path
OUT=Path(__file__).parent
mp.iv.dps=50;mp.mp.dps=55
w=mp.iv.mpf(2)/5
Civ=mp.iv.pi**w/mp.iv.gamma(w)
Lv=mp.iv.ln(2)
def ends(z):return [str(mp.mpf(z.a)),str(mp.mpf(z.b))]
C=float(mp.mpf(Civ.mid));log2=float(mp.mpf(Lv.mid))
assert float(mp.mpf(Civ.delta))<1e-40
n=100;m=4000000;M=m//n
R=log2*m/(m-1);dx=R/m;h=R/n
# Elementary polynomial exp, with absolute truncation <1e-24 on |x|<=1.5.
def expt(x):
 return np.polynomial.polynomial.polyval(x,[1/math.factorial(j) for j in range(31)])
def coeff(alpha):
 p=1.;arr=[2.5]
 for k in range(1,129):
  p*= (k-1-alpha)/k
  arr.append(p/(.4+k))
 return arr
cf1=coeff(.05);cf2=coeff(.1)
r=np.arange(m+1,dtype=np.float64)*dx
x=2*r
z=x*np.polynomial.polynomial.polyval(-x,[1/math.factorial(j+1) for j in range(30)])
z[0]=0
y=np.power(z,.4);y[0]=0
# Candidate fifth roots validated by residual; does not assume np.power accuracy.
res=np.max(np.abs((y[1:]*y[1:]*y[1:]*y[1:]*y[1:])/(z[1:]*z[1:])-1))
assert res<1e-12
F1=np.polynomial.polynomial.polyval(z,cf1)
F2=np.polynomial.polynomial.polyval(z,cf2)
Qs=C*y*(9*F1-8*expt(.1*r)*F2);Qs[0]=0
# q(R) from the same series, with a very generous 1e-8 enclosure allowance.
qR=2*C*expt(-2.1*R)*y[-1]/z[-1]-.8*C*expt(.1*R)*y[-1]*F2[-1]
qRh=2*C*expt(-2.1*(R-h))*y[m-M]/z[m-M]-.8*C*expt(.1*(R-h))*y[m-M]*F2[m-M]
assert qRh+1e-8<0
# Arithmetic coefficient c_2/sqrt2 evaluated and enclosed independently by iv.
civ=(mp.iv.power(2,w)-mp.iv.power(2,-w))/mp.iv.sqrt(2)
c2=float(mp.mpf(civ.mid))
dcalc=2*Qs[M]+2*h*abs(qR)+2*c2*Qs[1]
assert dcalc+1e-6<.656
# Free large temporary vectors before matrix accumulation.
del r,x,z,y,F1,F2

def at(idx):return Qs[np.maximum(idx,0)]
A=np.zeros((n,n));EA=np.zeros((n,n));S=np.zeros((n,n));err2=0.
for row in range(n):
 i=np.arange(row*M,(row+1)*M)[:,None]
 hi=i+(np.arange(n)[None,:]+1)*M-m
 vl=(at(hi)-at(hi-M))/np.sqrt(h)
 vr=(at(hi+1)-at(hi+1-M))/np.sqrt(h)
 ran=abs(vr-vl)
 if row==n-1:
  vr[-1,-1]+=c2*Qs[1]/np.sqrt(h);ran[-1,-1]+=c2*Qs[1]/np.sqrt(h)
 V=(vl+vr)/2
 A[row]=dx/np.sqrt(h)*V.sum(axis=0)
 EA[row]=dx/(2*np.sqrt(h))*ran.sum(axis=0)
 S+=dx*(V.T@V);err2+=dx/4*np.sum(ran**2)
 if row%20==0:print('row',row,flush=True)
G=S-A.T@A
step=float(np.sqrt(err2));aerr=float(np.sqrt(EA.sum(axis=0).max()*EA.sum(axis=1).max()))
rnorm=float(np.sqrt(np.abs(G).sum(axis=1).max()))
assert step+2e-6 < .000215
assert aerr+1e-6 < .00001
assert rnorm+1e-5 < .114
assert np.diag(S).max()<1
# Safe operator budgets including elementary-function and accumulated rounding errors.
e=.000215;ae=.00001;ge=2*.114*e+e*e+1e-7
rho=.9999;d=.656;E=.0002
assert ae+ge/(rho-d)<E
# Store matrices for independent replay; symmetric part only, deviation included by ae.
A=(A+A.T)/2;G=(G+G.T)/2
payload={'n':n,'m':m,'w':'2/5','R':'m*log(2)/(m-1)','C_interval':ends(Civ),'log2_interval':ends(Lv),'c2_interval':ends(civ),'root_relative_residual':float(res),'q_R_minus_h':float(qRh),'d_calc':float(dcalc),'step_HS':step,'A_error_calc':aerr,'residual_norm_calc':rnorm,'S_maxdiag':float(np.diag(S).max()),'budgets':{'Q_abs_error':1e-9,'HP_HS_error':e,'A_operator_error':ae,'G_operator_error':ge,'d':d,'rho':rho,'E':E},'A':A.tolist(),'G':G.tolist()}
(OUT/'block_certificate_data.json').write_text(json.dumps(payload))
# Interval Cholesky of rho I +/- A - G/(rho-d) - E I.
# +/-1e-10 per stored entry vastly exceeds serialization and arithmetic uncertainty;
# analytic discretization errors are separately included in E.
I=mp.iv;eta=I.mpf('1e-10');den=I.mpf('.9999')-I.mpf('.656')
records=[]
for sign in [-1,1]:
 mat=[]
 for i in range(n):
  row=[]
  for j in range(n):
   av=I.mpf([str(A[i,j]-1e-10),str(A[i,j]+1e-10)])
   gv=I.mpf([str(G[i,j]-1e-10),str(G[i,j]+1e-10)])
   row.append((I.mpf('.9997') if i==j else I.mpf(0))+sign*av-gv/den)
  mat.append(row)
 L=[[I.mpf(0) for _ in range(n)] for _ in range(n)]
 piv=[]
 for i in range(n):
  for j in range(i+1):
   v=mat[i][j]-sum((L[i][k]*L[j][k] for k in range(j)),I.mpf(0))
   if i==j:
    assert mp.mpf(v.a)>0,(sign,i,v)
    piv.append(ends(v));L[i][j]=I.sqrt(v)
   else:L[i][j]=v/L[j][j]
 print('interval Cholesky PASS sign',sign,'min pivot lower',min(mp.mpf(p[0]) for p in piv),flush=True)
 records.append({'sign':sign,'pivots':piv})
(OUT/'block_cholesky_certificate.json').write_text(json.dumps(records,indent=2))
print('CERTIFICATE COMPUTATION PASS; analytic proof/error budget must also be reviewed.',flush=True)
