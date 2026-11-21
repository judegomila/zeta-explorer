"""Outward-rounded finite Fourier certificate for the actual signed xi Hankel kernel.

Only the window a=1/4, L=3/2 is addressed. Arithmetic is mpmath.iv;
SciPy supplies candidate congruence matrices, whose properties are then verified.
No quadrature error estimate or unchecked eigenvalue is used in the certificate.
"""
from pathlib import Path
import sys,json,time
import numpy as np
from scipy.linalg import eigh
from mpmath import iv
ROOT=Path(__file__).resolve().parent
iv.dps=80
ONE=iv.mpf(1);ZERO=iv.mpf(0);a=ONE/4
V=2*iv.log(ONE*3/2);C=2*iv.pi**a/iv.gamma(a)
N=16;DEG=512;delta=ONE*17/20;alpha=1-delta

def realpad(x,e):return x+iv.mpf([-e.b,e.b])
def cpad(z,e):return iv.mpc(realpad(z.real,e),realpad(z.imag,e))
def beta_series(Q,r,M=DEG):
 """B_Q(a,r) with rigorous geometric tail; Re r>0, Q in (0,1)."""
 c=iv.mpc(1);s=c/a;power=ONE
 for j in range(1,M+1):
  c=c*(j-r)/j;power*=Q;s+=c*power/(j+a)
 cn=c*(M+1-r)/(M+1)
 first=abs(cn)*Q**(M+1)/(M+1+a)
 # For j>=M+2, |1-r/j|^2 is convex in 1/j. Its max is at
 # j=M+2 or j=infinity. Dropping the denominator factor <1 is safe.
 endpoint=abs(1-r/(M+2));mx=iv.mpf([1,max(ONE.b,endpoint.b)])
 ratio=Q*mx
 assert ratio.b<1
 tail=first/(1-ratio)
 z=Q**a*cpad(s,tail)
 return z, Q**a*tail

def primitive(T,w):
 Q=-iv.expm1(-2*T);p=a-ONE/2+iv.mpc(0,w)
 r=(ONE*5/2-a+iv.mpc(0,w))/2
 J,e=beta_series(Q,r);J0,e0=beta_series(Q,ONE*3/2-a)
 val=C*((ONE/2-a/p)*J+(a/p)*iv.exp(-p*T)*J0)
 return val,max(float(e.b),float(e0.b))

def coeff(k):
 w=iv.pi*k/V;v=iv.mpc(0);err=0.
 for b,c in [(ZERO,ONE),(iv.log(2),2**a-2**(-a))]:
  val,e=primitive(V-b,w)
  v+=c*iv.exp(-b/2)*iv.exp(iv.mpc(0,-w*b))*val;err=max(err,e)
 return v,err

def midreal(x):return float(x.a)
def upperabs(x):return max(abs(x.a),abs(x.b))
def ivzero_matrix(n):return iv.matrix(n,n)
def sinhalf(k):
 # sin(pi*k/2) exactly for every integer k.
 return [0,1,0,-1][k%4]
def sinc_half(k):return ONE/2 if k==0 else sinhalf(k)/(iv.pi*k)
def gram(n):
 G=ivzero_matrix(2*n+1);G[0,0]=ONE/2
 for k in range(1,n+1):
  G[0,k]=G[k,0]=iv.sqrt(2)*sinc_half(k)
  for j in range(1,n+1):
   G[k,j]=sinc_half(k-j)+sinc_half(k+j)
   G[n+k,n+j]=sinc_half(k-j)-sinc_half(k+j)
 return G

def build_S(z,sign,G):
 m=2*N+1;S=-G/alpha
 z0=sign*z[0].real-delta
 assert z0.a>0 or z0.b<0
 neg=1 if z0.b<0 else 0
 b_gap=abs(z0)
 S[0,0]+=1/z0
 for k in range(1,N+1):
  re=sign*z[k].real;im=-sign*z[k].imag;rad=abs(z[k])
  lower=rad-delta;upper=-rad-delta
  assert lower.a>0 or lower.b<0
  neg+=1+int(lower.b<0)
  bg=min(abs(lower).a,abs(upper).a)
  if bg<b_gap.a:b_gap=iv.mpf(bg)
  det=delta**2-re**2-im**2
  assert det.a>0 or det.b<0
  S[k,k]+=(-re-delta)/det
  S[N+k,N+k]+=(re-delta)/det
  S[k,N+k]+=-im/det;S[N+k,k]+=-im/det
 return S,neg,b_gap

def maxrowsum(M):
 return max(sum(upperabs(M[i,j]) for j in range(M.cols)).b for i in range(M.rows))

def certify_inertia(S,neg_B,sign):
 m=S.rows
 Smid=np.array([[midreal(S[i,j]) for j in range(m)] for i in range(m)])
 ev,Q=eigh(Smid)
 # Every binary64 entry is embedded exactly, not its printed decimal approximation.
 Qi=iv.matrix([[iv.mpf(float(Q[i,j])) for j in range(m)] for i in range(m)])
 E=Qi.T*Qi-iv.eye(m);eta=maxrowsum(E)
 assert eta<1
 R=Qi.T*S*Qi
 neg=0;gap=iv.inf;minrow=None
 for i in range(m):
  rad=sum(upperabs(R[i,j]) for j in range(m) if j!=i).b
  d=R[i,i]
  if d.a>rad:rowgap=(d.a-rad).a
  elif d.b< -rad:neg+=1;rowgap=(-d.b-rad).a
  else:raise ArithmeticError(f'Uncertified Gershgorin row {i}: {d}, rad {rad}')
  if rowgap<gap:gap=rowgap;minrow=i
 assert neg==neg_B,(neg,neg_B)
 # ||S^-1|| <= ||Q||^2 ||R^-1|| <= (1+eta)/gap.
 g=(gap/(1+eta)).a
 opgap=(alpha**2*g/(1+alpha*g)).a
 assert opgap>ONE/50000
 return {'sign':sign,'dimension':m,'negative_count_B':neg_B,'negative_count_S':neg,'congruence_orthogonality_error_upper':str(eta),'Gershgorin_gap_lower':str(gap),'limiting_row':minrow,'certified_S_spectral_gap_lower':str(g),'certified_I_minus_sign_H_gap_lower':str(opgap),'candidate_eigenvalues':[float(x) for x in ev],'congruence_float_hex':[[float(x).hex() for x in row] for row in Q]}

def tail_constants():
 # f=D t^(a-1) F-P. For the remainder r=f-Dt^(a-1),
 # TV(r) <= D(2-a)L_T T^a/a+P(T); see accompanying proof.
 D=(2*iv.pi)**a/iv.gamma(a);rho=(2**a-2**(-a))/iv.sqrt(2)
 AA=(2*iv.pi)**a*(1+rho);BB=ZERO;parts=[]
 for T,weight in [(V,ONE),(V-iv.log(2),rho)]:
  Q=-iv.expm1(-2*T);J0,e=beta_series(Q,ONE*3/2-a)
  # J0 is mathematically real; imaginary enclosure merely reflects tail padding.
  P=C*a*iv.exp((ONE/2-a)*T)*J0.real
  F=iv.exp(-ONE*3*T/2)*(T/((iv.exp(T)-iv.exp(-T))/2))**(1-a)
  f=D*T**(a-1)*F-P
  L=ONE*3/2+(1-a)*T/3
  tv=D*(2-a)*L*T**a/a+P
  part=abs(f)+tv+D*T**(a-1);BB+=weight*part
  parts.append({'T':str(T),'weight':str(weight),'f_endpoint':str(f),'variation_upper_interval':str(tv),'endpoint_constant':str(part)})
 omega=iv.pi*(N+1)/V
 tail=AA*omega**(-a)+BB/omega
 assert tail.b<delta.a
 return {'leading_constant':str(AA),'remainder_constant':str(BB),'tail_bound_at_N_plus_1':str(tail),'chosen_delta':'17/20','tail_below_delta':True,'parts':parts}

if __name__=='__main__':
 start=time.time();z=[];tails=[]
 for k in range(N+1):
  v,e=coeff(k);z.append(v);tails.append(e)
 print('Coefficients enclosed in',time.time()-start,'seconds',flush=True)
 out={'parameters':{'a':'1/4','L':'3/2','V':'2 log(3/2)','circle_length':'2V','Fourier_cutoff':N,'dimension':2*N+1,'precision_digits':iv.dps,'beta_series_degree':DEG},'coefficients':[{'k':k,'real':str(v.real),'imag':str(v.imag)} for k,v in enumerate(z)],'max_beta_tail_display':max(tails),'tail':tail_constants()}
 G=gram(N);results=[]
 for sign in [1,-1]:
  S,neg,bgap=build_S(z,sign,G)
  r=certify_inertia(S,neg,sign);r['B_invertibility_gap_lower']=str(bgap.a)
  results.append(r);print({k:v for k,v in r.items() if k not in ['candidate_eigenvalues','congruence_float_hex']},flush=True)
 out['inertia_certificates']=results
 out['signed_strict_contraction_certified']=True
 out['simplified_rational_norm_upper']='49999/50000'
 out['simplified_rational_energy_gap_lower']='1/50000'
 out['claim']='Both I-H and I+H are strictly positive at a=1/4, L=3/2.'
 out['seconds']=time.time()-start
 (ROOT/'signed_certificate.json').write_text(json.dumps(out,indent=2))
 print('Completed',out['seconds'],'seconds',flush=True)
