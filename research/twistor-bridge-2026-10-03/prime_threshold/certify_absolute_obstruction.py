"""Outward-rounded interval rectangle certificate for one scalar lower witness.

This does NOT certify the norm of the signed Hankel operator. It certifies a
lower bound >1 for the absolute-kernel operator, with an explicit beta-series
remainder. Requires mpmath; no Arb or point-sampled singular quadrature is used.
"""
from pathlib import Path
from mpmath import iv
import json,time
ROOT=Path(__file__).resolve().parent
iv.dps=40
Z=iv.mpf(0);ONE=iv.mpf(1);a=ONE/4
V=2*iv.log(iv.mpf(3)/2);b2=iv.log(2)
C=2*iv.pi**a/iv.gamma(a)
Q=iv.mpf(65)/81
M=40
coeff=[];c=ONE
for k in range(M+2):
 if k: c=c*(k-1-a)/k
 coeff.append(c/(k+a))
T=(-coeff[M+1])*Q**(M+1)/(1-Q)
tail=iv.mpf([0,T.b])

def ratio(t):
 """r(t)=(1-exp(-2t))/t is decreasing; r(0)=2."""
 lower=(-iv.expm1(-2*t.b))/t.b if t.b else iv.mpf(2)
 upper=iv.mpf(2) if t.a==0 else (-iv.expm1(-2*t.a))/t.a
 return iv.mpf([lower.a,upper.b])

def greg(t):
 q=-iv.expm1(-2*t)
 r=ratio(t)
 S=coeff[M]
 for k in range(M-1,-1,-1):S=S*q+coeff[k]
 S=S-tail
 return C*(iv.exp(-(2-a)*t)*r**(a-1)-a*iv.exp(-(a-1)*t)*t*r**a*S)

cuts=[Z,iv.mpf(3)/10,b2,iv.mpf(3)/4,V]
signs=[1,-1,1,-1]
terms=[(Z,ONE),(b2,2**a-2**(-a))]

def certify(N):
 total=Z;parts=[]
 for j,(left,right,sign) in enumerate(zip(cuts,cuts[1:],signs)):
  part=Z
  for n,(b,c) in enumerate(terms):
   if n==1 and j<2:continue
   starts_at_threshold=(n==0 and j==0) or (n==1 and j==2)
   subt=Z
   for i in range(N):
    x=iv.mpf([ (iv.mpf(i)/N).a, (iv.mpf(i+1)/N).b ])
    if starts_at_threshold:
     d=right-b;t=d*x**4;u=b+t
     # t^(a-1) times the Jacobian 4*d*x^3 is exactly 4*d^a.
     value=c*iv.exp(-u/2)*greg(t)*4*d**a*(V-u)/V
    else:
     width=right-left;u=left+width*x;t=u-b
     value=c*iv.exp(-u/2)*greg(t)*t**(a-1)*(V-u)/V*width
    subt+=value/N
   part+=sign*subt
  total+=part
  parts.append({'segment':j,'interval':str(part)})
 return total,parts

if __name__=='__main__':
 results=[]
 for N in [128,256,512,1024]:
  start=time.time();bound,parts=certify(N)
  record={'rectangles_per_segment_component':N,'interval':str(bound),'lower_float_for_display':float(bound.a),'upper_float_for_display':float(bound.b),'lower_bound_exceeds_one':bool(bound.a>ONE),'seconds':time.time()-start,'parts':parts}
  results.append(record);print(record,flush=True)
  if record['lower_bound_exceeds_one']:break
 output={'precision_decimal_digits':iv.dps,'beta_series_degree':M,'uniform_beta_series_tail_upper_interval':str(T),'q_global_bound':'65/81','target':'||H_absolute|| >= integral (V-v) qsign(v) K(v) dv / V','results':results,'certified_absolute_operator_norm_gt_one':results[-1]['lower_bound_exceeds_one'],'signed_operator_certified':False}
 (ROOT/'interval_certificate.json').write_text(json.dumps(output,indent=2))
