"""Original validation wrapper for support_linear_probe.py output.
Special-function candidate values are checked against elementary polynomials,
not trusted as interval evaluations. See SUPPORT_CONTINUATION.md.
"""
import numpy as np,mpmath as mp,json,math,hashlib
from pathlib import Path
P=Path(__file__).parent;mp.iv.dps=50;mp.mp.dps=55;I=mp.iv
w=I.mpf(2)/5;Civ=I.pi**w/I.gamma(w);C=float(mp.mpf(Civ.mid));l2=I.ln(2)
n=256;m=4194304;M=m//n;R=16/15*np.log(2);dx=R/m;h=R/n
civ=(I.power(2,w)-I.power(2,-w))/I.sqrt(2);c2=(2**.4-2**(-.4))/np.sqrt(2)
assert abs(mp.mpf(float(np.log(2)))-mp.mpf(l2.mid))<mp.mpf('1e-15')
assert abs(mp.mpf(float(c2))-mp.mpf(civ.mid))<mp.mpf('1e-15')
def expt(x):return np.polynomial.polynomial.polyval(x,[1/math.factorial(j) for j in range(31)])
def coeff(alpha):
 p=1.;out=[2.5]
 for k in range(1,129):p*=(k-1-alpha)/k;out.append(p/(.4+k))
 return out
r=np.arange(m+1)*dx;x=2*r
z=x*np.polynomial.polynomial.polyval(-x,[1/math.factorial(j+1) for j in range(30)])
y=np.power(z,.4);y[0]=0
rootres=np.max(abs(y[1:]*y[1:]*y[1:]*y[1:]*y[1:]/(z[1:]*z[1:])-1));assert rootres<1e-12
F1=np.polynomial.polynomial.polyval(z,coeff(.05));F2=np.polynomial.polynomial.polyval(z,coeff(.1))
Qpoly=C*y*(9*F1-8*expt(.1*r)*F2);Qpoly[0]=0
# Recompute exactly the same candidate endpoint table used by the generator.
from scipy.special import beta,betainc,gamma
Q1=np.pi**.4/gamma(.4)*beta(.4,1.25-.4/2)*betainc(.4,1.25-.4/2,-np.expm1(-2*r))
q2=2*np.pi**.4/gamma(.4)*.4*np.exp((.5-.4)*r)*beta(.4,1.5-.4)*betainc(.4,1.5-.4,-np.expm1(-2*r))
Qc=((.5+.4)*Q1-q2)/(.5-.4)
maxdiff=np.max(abs(Qc-Qpoly));assert maxdiff<1e-10
# Elementary endpoint q evaluations; allowance1e-8.
def qidx(j):return 2*C*expt(-2.1*r[j])*y[j]/z[j]-.8*C*expt(.1*r[j])*y[j]*F2[j]
qR=qidx(m);qRh=qidx(m-M);qdelta=qidx(m//16)
assert qRh+1e-8<0 and qdelta-1e-8>0
dcalc=2*(1+c2)*Qpoly[M]+2*h*abs(qR);assert dcalc+1e-6<.638
# Exact interval analytic residual budgets.
Ri=I.mpf(16)/15*l2;di=Ri/m;hi=Ri/n;ci=(2*I.pi)**w/I.gamma(w);Ki=ci/w;Di=I.mpf('6.5')*ci/(w+1)
Is=I.mpf(1)/18;Js=I.mpf(3)/14
sing=Ki*di**(w+I.mpf('.5'))*I.sqrt(Is)+2*Di*di**(w+I.mpf('1.5'))
other=ci*di**(w+I.mpf('.5'))/8*(I.mpf('.6')*I.sqrt(1+I.mpf(1)/I.mpf('2.2'))+I.mpf('2.9')*di*I.sqrt(6)+I.mpf('.4')*di**I.mpf('1.6')*I.sqrt(m))

l1=Ki*di**(w+1)*Js+2*Di*di**(w+2)+ci*di**(w+1)/8*(I.mpf('.6')*(1+I.mpf(1)/I.mpf('.6'))+I.mpf('2.9')*di*(1+(I.mpf(m)**I.mpf('.4')-1)/I.mpf('.4'))+I.mpf('.4')*di**I.mpf('1.6')*m)
em=ci*di**I.mpf('2.5')/8*(I.mpf('.6')*hi**I.mpf('-1.6')+I.mpf('2.9')*hi**I.mpf('-.6')+I.mpf('.4'))
# l1 includes the singular L1 error; isolate nonsingular part for the L2-sequence sum.
sing1=Ki*di**(w+1)*Js+2*Di*di**(w+2)
overlap=em*(sing+(l1-sing1)/I.sqrt(di))
ebase=I.sqrt(n/hi)*I.sqrt(2*(sing*sing+other*other)+2*overlap)
ecalc=ebase*(1+civ/4)+I.mpf('.000002')
aecalc=2*(1+civ)*l1/hi+I.mpf('.000002')
assert mp.mpf(ecalc.b)<mp.mpf('.00022') and mp.mpf(aecalc.b)<mp.mpf('.000003')
Z=np.load(P/'support_linear_probe.npz');A=Z['A'];G=Z['G']
assert np.max(abs(A-A.T))<1e-8
assert np.sqrt(np.max(np.abs(G).sum(axis=1)))+1e-5<.1
assert np.diag(G+A.T@A).max()<.064
A=(A+A.T)/2;G=(G+G.T)/2
rho=I.mpf('.99995');d=I.mpf('.638');E=I.mpf('.00014');e=I.mpf('.00022');ae=I.mpf('.000003')
ge=2*I.mpf('.1')*e+e*e+I.mpf('.0000002')
assert mp.mpf((ae+ge/(rho-d)).b)<mp.mpf(E.a)
def ends(x):return [str(mp.mpf(x.a)),str(mp.mpf(x.b))]
data={'n':n,'m':m,'R':'16log(2)/15','rootres':float(rootres),'candidate_Q_maxdiff':float(maxdiff),'qR':float(qR),'qRh':float(qRh),'qdelta':float(qdelta),'d_calc':float(dcalc),'e_calc':ends(ecalc),'ae_calc':ends(aecalc),'budgets':{'rho':'.99995','d':'.638','E':'.00014','e':'.00022','ae':'.000003','ge':ends(ge)},'generator_sha256':hashlib.sha256((P/'support_linear_probe.py').read_bytes()).hexdigest(),'matrix_sha256':hashlib.sha256((P/'support_linear_probe.npz').read_bytes()).hexdigest(),'A':A.tolist(),'G':G.tolist()}
(P/'support_certificate_data.json').write_text(json.dumps(data))
# Certified finite matrices with conservative entry inflation.
results=[]
for sign in [-1,1]:
 L=[[I.mpf(0) for _ in range(n)] for _ in range(n)];piv=[]
 for i in range(n):
  for j in range(i+1):
   av=I.mpf([str(A[i,j]-1e-10),str(A[i,j]+1e-10)])
   gv=I.mpf([str(G[i,j]-1e-10),str(G[i,j]+1e-10)])
   v=(rho-E if i==j else I.mpf(0))+sign*av-gv/(rho-d)-sum((L[i][k]*L[j][k] for k in range(j)),I.mpf(0))
   if i==j:
    assert mp.mpf(v.a)>0,(sign,i,v)
    piv.append(ends(v));L[i][j]=I.sqrt(v)
   else:L[i][j]=v/L[j][j]
  if i%64==0:print('Cholesky',sign,i,flush=True)
 print('PASS',sign,'min pivot',min(mp.mpf(x[0]) for x in piv),flush=True)
 results.append({'sign':sign,'pivots':piv})
(P/'support_cholesky_certificate.json').write_text(json.dumps(results,indent=2))
print('SUPPORT CERTIFICATE COMPUTATION PASS; independent analytic audit required.',flush=True)
