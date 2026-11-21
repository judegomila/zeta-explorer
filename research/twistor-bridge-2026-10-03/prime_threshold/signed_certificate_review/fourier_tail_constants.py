"""Interval-enclose explicit full Fourier-tail constants for the signed kernel.

No full signed-operator norm is certified by this script.
"""
from pathlib import Path
import sys,json
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent))
from certify_absolute_obstruction import iv,greg
iv.dps=40
one=iv.mpf(1);a=one/4
V=2*iv.log(iv.mpf(3)/2)
D=(2*iv.pi)**a/iv.gamma(a)
rho=(2**a-2**(-a))/iv.sqrt(2)
A=(2*iv.pi)**a*(1+rho)
terms=[];B=iv.mpf(0);endpoints=[]
for n,T,weight in [(1,V,one),(2,V-iv.log(2),rho)]:
 f=iv.exp(-T/2)*greg(T)*T**(a-1)
 endpoints.append(f)
 F=iv.exp(-iv.mpf(3)*T/2)*(T/((iv.exp(T)-iv.exp(-T))/2))**(1-a)
 first=D*T**(a-1)*F
 beta_part=first-f
 L=iv.mpf(3)/2+(1-a)*T/3
 variation_bound=D*(2-a)*L*T**a/a+beta_part
 abs_f=-f if n==1 else f
 endpoint_constant=abs_f+variation_bound+D*T**(a-1)
 B+=weight*endpoint_constant
 terms.append({'n':n,'T':str(T),'f_endpoint':str(f),'positive_beta_part':str(beta_part),'variation_bound':str(variation_bound),'endpoint_constant':str(endpoint_constant),'weight':str(weight)})
rows=[]
for N in [8,16,32,64,128,256,512,1024]:
 omega=iv.pi*(N+1)/V
 delta=A*omega**(-a)+B/omega
 rows.append({'cutoff_N':N,'uniform_tail_bound_interval':str(delta),'upper_float_for_display':float(delta.b),'upper_below_one':bool(delta.b<1)})
eta=2*(1-a)
A_simple=D*(eta**a/a+2*eta**(a-1))*(1+rho)
B_simple=-2*endpoints[0]
omega257=iv.pi*257/V
simple_delta=A_simple*omega257**(-a)+B_simple/omega257
simple={'A_interval':str(A_simple),'B_interval':str(B_simple),'bound_at_k_257':str(simple_delta),'certifies_delta_0_6':bool(simple_delta.b<iv.mpf(3)/5),'conditions':'tau=3/(2 omega)<=min(1/10,T2); valid for all |k|>=4'}
result={'a':'1/4','L':'3/2','period':'2V, V=2 log(3/2)','multiplier':'lambda_k=integral_0^V K(v) exp(-i*pi*k*v/V) dv','bound':'|lambda_k| <= A |omega_k|^(-1/4)+B/|omega_k|, omega_k=pi*k/V','A_interval':str(A),'B_interval':str(B),'elementary_monotonicity_bound':simple,'terms':terms,'cutoffs':rows,'full_signed_norm_certified':False}
(ROOT/'fourier_tail_constants.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
