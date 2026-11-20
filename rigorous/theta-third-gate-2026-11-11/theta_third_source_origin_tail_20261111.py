"""Rigorous infinite-anchor source-origin certificate for third theta preservation.

The fresh compact companion and the new global kappa^(14) bound
supply the declared inputs; all new tail bounds are explicit and replayed.
"""
import json
import sympy as sp
from flint import arb,arb_poly,ctx
from math import comb
from collections import Counter
from theta_third_source_origin_20261111 import source_expressions
from theta_second_origin_20261111 import moment
from theta_preservation_origin_20261110 import Theta
from theta_second_source_origin_20261111 import evaluate_coefficient


def certify_global_fourteenth(theta,k0):
 maximum=arb(0);cells=2048
 for i in range(cells):
  midpoint=arb(2*i+1)/1024;radius=arb(1)/1024
  jm=theta.jets(midpoint);ji=theta.jets(midpoint+arb(0,radius))
  bound=(jm[14]/k0).abs_upper()+radius*(jm[15]/k0).abs_upper()+radius**2/2*(ji[16]/k0).abs_upper()
  assert bound<14000000000,(i,bound)
  if bound.upper()>maximum:maximum=bound.upper()
 e4=arb(4).exp()
 assert 3*e4>arb(65)/4
 assert arb(2)**32*(-9*e4).exp()<arb(1)/2
 tail=2*theta.norms[14]*(4*e4)**16*(1-3*e4).exp()/k0
 assert tail<14000000000
 return {"status":"passed","cells":cells,"global_bound":14000000000,"core_upper_bound":str(maximum),"tail_upper_bound":str(tail),"scope":"All real spatial arguments, using evenness, interval Taylor bounds on[0,4], and monotone analytic theta tail."}

def certify():
 ctx.prec=256
 th=Theta(16,16);jets=th.jets(0);k0=jets[0]
 hball=moment(th,1,A=2)/(4*k0)
 info=source_expressions();q,c,b,g,h=info['variables'];N,d=info['symbols']
 a,t,p,v,j8,j10,j12,Nd=sp.symbols('a t p v j8 j10 j12 Nd')
 values={c:-jets[2]/k0,b:jets[4]/k0,g:jets[6]/k0,j8:jets[8]/k0,j10:jets[10]/k0,j12:jets[12]/k0,h:hball}
 js=[1,-c,b,g,j8,j10,j12]
 N0=sum(4**j*js[j]*(p/a**(2*j+1)+(2*j+1)/a**(2*j+2)) for j in range(7))
 def deriv(expr):return sp.diff(expr,a)+sp.diff(expr,p)*v/a+sp.diff(expr,N)*Nd
 def allcoeff(expr):
  # Every source expression has powers a<=9; shift by t^12 explicitly.
  poly=sp.Poly(sp.expand(expr.subs(a,1/t))*t**12,t,p,v)
  return {(i-12,j,k):co for (i,j,k),co in poly.terms() if co!=0}
 def ballcoeff(expr):return {key:evaluate_coefficient(co,values) for key,co in allcoeff(expr).items()}
 A=arb(100);M=arb(14000000000);pratio=arb(701)/50000;vratio=arb(5)/14;pinverse=arb(5)/7
 audit=[]
 def check(value,name):
  if not value:raise AssertionError(name)
  audit.append(name)
 def bound(co,lead,target_p=1,extra_p=0,extra_t=0):
  """Sum abs monomial bounds after division by p^target_p/a^lead."""
  total=arb(0)
  for (n,j,k),C in co.items():
   degree=j+k+extra_p-target_p
   if degree<0:
    check(degree==-1 and j+k+extra_p==0,'inverse_p_power')
    factor=pinverse;power=n+extra_t-lead
   else:
    factor=pratio**degree*vratio**k;power=n+extra_t-lead-degree
   check(power>=0,'nonnegative_tail_decay_power')
   total+=C.abs_upper()*factor/A**power
  return total
 def positive_parameter_rectangle(co,lead,error,name):
  # T=100/a, p=pmin+(rho/a^{-1}-pmin)q, 0<=q<=1.
  # Multiplying by a^{-1} removes the only possible negative power.
  # Omega is affine in v=a*p_prime, so v=0 and v=1/2 suffice.
  pmin=arb(7)/5;rho=pratio;records=[];cells=64;normalized_lower=None
  for endpoint in [arb(0),arb(1)/2]:
   coeff={}
   for (n,j,k),C in co.items():
    check(j<=2 and k<=1,name+'_parameter_degrees')
    for m in range(j+1):
     for ll in range(j-m+1):
      power=n+1-lead-m;qpower=m+ll
      check(power>=0,name+'_rectangle_nonnegative_power')
      cc=C*endpoint**k*comb(j,m)*comb(j-m,ll)*(-1)**ll*pmin**(j-m)*rho**m/100**power
      coeff[power,qpower]=coeff.get((power,qpower),arb(0))+cc
   # Subtract error * (p/a), namely error*(pmin*T/100*(1-q)+rho*q).
   for key,val in [((1,0),-error*pmin/100),((1,1),error*pmin/100),((0,1),-error*rho)]:
    coeff[key]=coeff.get(key,arb(0))+val
   deg=max(k[0] for k in coeff)
   powers=[arb_poly([coeff.get((ii,jj),arb(0)) for ii in range(deg+1)]) for jj in range(3)]
   bern=[powers[0],powers[0]+powers[1]*(arb(1)/2),powers[0]+powers[1]+powers[2]]
   check(bern[0][0]==0,name+'_zero_edge_exact_deflation')
   bern[0]=arb_poly(bern[0].coeffs()[1:])
   minima=[]
   for j,poly in enumerate(bern):
    low=None
    for i in range(cells):
     T=arb(2*i+1)/(2*cells)+arb(0,arb(1)/(2*cells))
     value=poly(T)
     check(value>0,name+'_rectangle_cell')
     if low is None or value.lower()<low:low=value.lower()
    minima.append(low)
   candidates=[100*minima[0]/pmin,minima[1]/(pmin/200+rho/2),minima[2]/rho]
   ll=min(z.lower() for z in candidates)
   if normalized_lower is None or ll<normalized_lower:normalized_lower=ll
   records.append({'v_endpoint':str(endpoint),'Bernstein_q_coefficient_minima':[str(z) for z in minima]})
  return {'status':'passed','T_cells_per_coefficient':cells,'q_Bernstein_degree':2,'v_endpoints':2,
   'interval_cell_count':cells*3*2,'normalized_Omega_margin_lower':str(normalized_lower),'endpoint_records':records}
 records={}
 qq,tt,pp,rr=sp.symbols('qq tt pp rr')
 for jj in range(3):
  expanded=sum(comb(jj,mm)*comb(jj-mm,ll)*(-1)**ll*pp**(jj-mm)*rr**mm*qq**(mm+ll)/tt**mm for mm in range(jj+1) for ll in range(jj-mm+1))
  check(sp.expand(expanded-(pp+(rr/tt-pp)*qq)**jj)==0,'rectangle_binomial_identity_'+str(jj))
 U0,U1,U2=sp.symbols('U0 U1 U2')
 check(sp.expand(U0*(1-qq)**2+2*(U0+U1/2)*qq*(1-qq)+(U0+U1+U2)*qq**2-(U0+U1*qq+U2*qq**2))==0,'Bernstein_identity')
 check(sp.Rational(2)**14*(1+sp.Rational(15,140))<18200,'N_remainder_rounding')
 check(sp.Rational(2)**14*(sp.Rational(5,14)+15+sp.Rational(240,140))<280000,'N_prime_remainder_rounding')
 for name,offset,lead in [('H',0,6),('P',2,8)]:
  f0,f1=[z.subs({q:a*a,d:1+a*p}) for z in info['raw'][offset:offset+2]]
  # The exact derivative polynomial is affine in N' and quadratic in N.
  omega=sp.expand(f0*deriv(f1)-deriv(f0)*f1)
  poly=sp.Poly(omega,N,Nd)
  AA=poly.coeff_monomial(N*N);BB=poly.coeff_monomial(N);DD=poly.coeff_monomial(Nd);CC=poly.coeff_monomial(1)
  check(sp.expand(omega-AA*N*N-BB*N-CC-DD*Nd)==0,name+'_quadratic_affine_identity')
  fp0=sp.expand(f0.subs(N,N0));fp1=sp.expand(f1.subs(N,N0))
  N0d=sp.diff(N0,a)+sp.diff(N0,p)*v/a
  model=sp.expand(omega.subs({N:N0,Nd:N0d}))
  # Independent Wronskian-of-model identity.
  check(sp.expand(model-(fp0*deriv(fp1)-deriv(fp0)*fp1))==0,name+'_model_derivative_identity')
  raw=allcoeff(model);co={key:evaluate_coefficient(z,values) for key,z in raw.items()}
  check(min(n for n,j,k in co)==lead,name+'_leading_power')
  check(set(key for key in co if key[0]==lead)=={(lead,1,0),(lead,0,1)},name+'_exact_leading_monomials')
  leadp=co[lead,1,0];leadv=co[lead,0,1]
  check(leadp>0,name+'_leading_positive_coefficient')
  sign=-1 if name=='H' else 1
  check(sp.expand(raw[lead,0,1]-sign*raw[lead,1,0])==0,name+'_leading_p_v_structure')
  lower=leadp*(1-vratio) if name=='H' else leadp
  rest={key:C for key,C in co.items() if key[0]>lead}
  penalty=bound({key:C for key,C in rest.items() if not C>=0},lead)
  # Exact perturbation identity for epsilon=N-N0, epsilon1=N'-N0'.
  linear=ballcoeff(sp.expand(2*AA*N0+BB));ndcoeff=ballcoeff(DD);quadratic=ballcoeff(AA)
  err0=18200*M*bound(linear,lead,extra_p=1,extra_t=15)
  err1=280000*M*bound(ndcoeff,lead,extra_p=1,extra_t=16)
  err2=(18200*M)**2*bound(quadratic,lead,extra_p=2,extra_t=30)
  rectangle=positive_parameter_rectangle(co,lead,err0+err1+err2,name)
  margin=arb(rectangle['normalized_Omega_margin_lower'])
  check(margin>(arb('4.38e-5') if name=='H' else 459000000),name+'_positive_Omega_tail_margin')
  # Positivity of Phi0, needed by the mixed logarithmic source criterion.
  fco=ballcoeff(fp0);fraw=allcoeff(fp0)
  fpower=min(n for n,j,k in fco)
  ftarget=0 if name=='H' else 1
  flead=fco[fpower,ftarget,0]
  check(flead>0,name+'_positive_Phi_leading')
  check(all(n>fpower or (j==ftarget and k==0) for n,j,k in fco),name+'_Phi_leading_structure')
  fpenalty=bound({key:C for key,C in fco.items() if key[0]>fpower and not C>=0},fpower,target_p=ftarget)
  fA=sp.diff(f0,N)
  ferr=18200*M*bound(ballcoeff(fA),fpower,target_p=ftarget,extra_p=1,extra_t=15)
  fmargin=flead-fpenalty-ferr
  check(fmargin>(arb('.002074') if name=='H' else 6446),name+'_positive_Phi_tail_margin')
  records[name]={'Omega_power':lead,'Omega_normalization':f'p(a)/a^{lead}',
   'Omega_quantity':'Cleared source determinant using a-derivatives; equals 2*a*H1^4*Omega_v for H and 2*a*B1^4*Omega_v for P.',
   'leading_coefficient_lower':str(lower),'polynomial_penalty_upper':str(penalty),
   'N_error_upper':str(err0),'N_prime_error_upper':str(err1),'quadratic_error_upper':str(err2),
   'Omega_positive_margin':str(margin),'parameter_rectangle':rectangle,'Phi_power':fpower,'Phi_p_power':ftarget,
   'Phi_leading':str(flead),'Phi_polynomial_penalty':str(fpenalty),'Phi_remainder_error':str(ferr),
   'Phi_positive_margin':str(fmargin)}
 derivative=certify_global_fourteenth(th,k0)
 return {'status':'passed','anchor_interval':'a>=100','precision_bits':ctx.prec,
  'theta_values':{str(k):str(vv) for k,vv in values.items()},'gates':records,
  'exact_and_bound_assertion_count':len(audit),'audit_check_frequencies':dict(sorted(Counter(audit).items())),
  'anchor_tail_cells':sum(vv['parameter_rectangle']['interval_cell_count'] for vv in records.values()),'global_fourteenth_certificate':derivative,
  'prior_dependencies':'p>=1.4,0<a*p_prime<.5,p/a<.01402 for a>=100; the first two are PR53 plus the fresh compact p100<1.402 bound, and p/a decreases since a*p_prime<p.',
  'conclusion':'Both Phi source-origin values and their mixed logarithmic derivative numerators Omega are strictly positive for every a>=100; combine with the compact companion for all-anchor source-origin positivity.',
  'scope':'Spatial origin only; no global positive-spatial-source claim.'}

if __name__=='__main__':
 if not __debug__:raise RuntimeError('Do not run certificates under Python -O')
 r=certify()
 with open('theta_third_source_origin_tail_replay_20261111.json','w') as f:json.dump(r,f,indent=2)
 print(json.dumps(r,indent=2))
