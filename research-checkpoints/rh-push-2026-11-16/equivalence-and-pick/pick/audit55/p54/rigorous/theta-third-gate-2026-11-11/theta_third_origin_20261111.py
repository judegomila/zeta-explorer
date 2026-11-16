"""Third canonical theta origin: exact divided-difference criterion and certificates.

Fresh moment enclosures are recomputed by the PR53 helper. No diagnostic cache
is accepted as a proof input. Companion note contains the analytic argument.
"""
import json
from math import factorial
from flint import arb,arb_poly,ctx
from theta_second_origin_20261111 import certify_compact as second_compact,derivative_poly

def exact_checks():
 import sympy as s
 l,A,C,D,ha,hc,hd,hl,ma,mc,md=s.symbols('l A C D ha hc hd hl ma mc md')
 hAC=(hc-ha)/(C-A);hCD=(hd-hc)/(D-C);hAL=(hl-ha)/(l-A)
 hACL=(hAL-hAC)/(l-C);hACD=(hCD-hAC)/(D-A)
 hACDL=(hACL-hACD)/(l-D)
 # Third numerator determinant equals the symmetric three-anchor determinant.
 c1=hAC*hACDL-hACD*hACL
 hs=s.Matrix([[1,ha,(hl-ha)/(l-A)],[1,hc,(hl-hc)/(l-C)],[1,hd,(hl-hd)/(l-D)]]).det()/((C-A)*(D-C)*(D-A))
 assert s.factor(c1-hs)==0
 # Change of anchor coordinate has a strictly positive Vandermonde ratio.
 mdd=((md-mc)/(hd-hc)-(mc-ma)/(hc-ha))/(hd-ha)
 det=s.Matrix([[1,ha,ma],[1,hc,mc],[1,hd,md]]).det()
 assert s.factor(mdd-det/((hc-ha)*(hd-hc)*(hd-ha)))==0
 # Generic spectral recurrence at the third step.
 aa,cc,dd=s.symbols('aa cc dd',positive=True)
 sa=ha/A;sc=hc/C;sl=hl/l
 sAC=(sc-sa)/(C-A);sACL=((sl-sa)/(l-A)-sAC)/(l-C)
 V=s.symbols('V')
 n2=-aa*sa*V*hACL/hAC
 b2=aa*cc*V*(hAC*sACL-sAC*hACL)/hAC
 bd=b2.subs({l:D,hl:hd});nd=n2.subs({l:D,hl:hd})
 n3=(l*b2-D*bd/nd*n2)/(l-D)
 expected=aa*cc*sAC*V*c1/(hAC*hACD)
 assert s.factor(n3-expected)==0
 # Origin matrix curvature and reparameterization identities.
 x,L,N,Nx,Nxx,hp,hpp,c=s.symbols('x L N Nx Nxx hp hpp c')
 Y=L*x*N-1-s.symbols('h');Yx=L*N+L*x*Nx-hp;Yxx=2*L*Nx+L*x*Nxx-hpp
 Zx=L*Y+L*x*Yx+4*c*hp;Zxx=2*L*Yx+L*x*Yxx+4*c*hpp
 TN=hp*Nxx-hpp*Nx;TY=hp*Yxx-hpp*Yx;TZ=hp*Zxx-hpp*Zx
 hh=s.symbols('h')
 target=TN*L*(2*L*hp*N-2*hp**2+hpp*(hh+1))-L**2*(2*hp*Nx-hpp*N)**2
 assert s.factor(TN*TZ-TY**2-target)==0
 # h-coordinate simplification with lambda derivatives.
 lam,lp,lpp,n,n1,n2v,hh=s.symbols('lam lp lpp n n1 n2 hh')
 y=lam*n-1-hh;y1=lp*n+lam*n1-1;y2=lpp*n+2*lp*n1+lam*n2v
 z2=lpp*y+2*lp*y1+lam*y2
 assert s.factor(n2v*z2-y2**2-(n2v*(2*lp**2*n-(1+hh)*lpp-2*lp)-(2*lp*n1+lpp*n)**2))==0
 # Cleared compact determinant; e/o formal derivatives are independent jets.
 e,ep,epp,eppp,o,op,opp,oppp,K,xx=s.symbols('e ep epp eppp o op opp oppp K xx')
 def diff(q):
  return s.diff(q,xx)+sum(s.diff(q,v)*dv for v,dv in [(e,ep),(ep,epp),(epp,eppp),(o,op),(op,opp),(opp,oppp)])
 P=e*o+2*xx*(e*op-ep*o)
 Pd=-ep*o+3*e*op+2*xx*(e*opp-epp*o)
 Pdd=-3*epp*o+2*ep*op+5*e*opp+2*xx*(ep*opp+e*oppp-eppp*o-epp*op)
 assert s.expand(diff(P)-Pd)==0
 assert s.expand(diff(Pd)-Pdd)==0
 Q=Pd*e-P*ep;Qd=Pdd*e-P*epp;Qh=Qd*e-2*Q*ep
 S=2*e*ep+2*xx*(e*epp-ep**2);Sd=4*e*epp+2*xx*(e*eppp-ep*epp);Sh=Sd*e-2*S*ep
 assert s.expand(diff(Q)-Qd)==0
 assert s.expand(diff(S)-Sd)==0
 T=e+2*xx*ep;E=S*Qh-Sh*Q;C0=2*S*Q-Sh*P
 G=E*(2*L*S*P*e-2*K*S*S+K*Sh*T)-L*C0*C0*e
 subs={N:P/(K*e),Nx:Q/(K*e**2),Nxx:Qh/(K*e**3),hp:S/e**2,hpp:Sh/e**3,s.Symbol("h"):2*xx*ep/e}
 expr=target.subs(subs,simultaneous=True)
 assert s.factor(expr-L*G/(K*K*e**9))==0
 return {'status':'passed','exact_checks':10,'scope':'Third kernel, anchor symmetry, origin matrix, and compact polynomial identities.'}

def certify_compact(prior_models=None):
 # An integrated runner may share this in-process pair with another certificate.
 # The pair must be the direct result of a fresh second_compact(return_models=True).
 prior,models=second_compact(return_models=True) if prior_models is None else prior_models
 A=models['A'];xmax=models['xmax'];K=models['K0'];cs=models['raw_moment_coefficients'];E_A=models['moment_sum_bound'];degree=300
 p100=arb(200)/A**2*models['ep'](xmax)/models['e'](xmax)
 assert arb('1.4')<p100<arb('1.402')
 allmodels=[];errors=[]
 for parity in [0,1]:
  pars=[]
  for j in range(4):
   poly=derivative_poly(cs[parity::2],j);first=degree+1
   rho=xmax*(first+1)/(first+1-j)
   err=E_A*arb(factorial(first)//factorial(first-j))*xmax**(first-j)/(1-rho)
   poly+=arb_poly([arb(0,err)]);pars.append(poly);errors.append(str(err))
  allmodels.append(pars)
 (e,ep,epp,eppp),(o,op,opp,oppp)=allmodels
 x=arb_poly([0,1]);L=A*A
 P=e*o+2*x*(e*op-ep*o)
 Pd=-ep*o+3*e*op+2*x*(e*opp-epp*o)
 Pdd=-3*epp*o+2*ep*op+5*e*opp+2*x*(ep*opp+e*oppp-eppp*o-epp*op)
 Q=Pd*e-P*ep;Qd=Pdd*e-P*epp;Qh=Qd*e-2*Q*ep
 S=2*e*ep+2*x*(e*epp-ep*ep)
 Sd=4*e*epp+2*x*(e*eppp-ep*epp);Sh=Sd*e-2*S*ep
 T=e+2*x*ep;En=S*Qh-Sh*Q;Cn=2*S*Q-Sh*P
 G=En*(2*L*S*P*e-2*K*S*S+K*Sh*T)-L*Cn*Cn*e
 cells=4096;lower_n=None;lower_d=None
 for i in range(cells):
  lo=xmax*i/cells;hi=xmax*(i+1)/cells;xx=(lo+hi)/2+arb(0,(hi-lo)/2)
  ev=e(xx);sv=S(xx);en=En(xx);gv=G(xx)
  assert ev>0 and sv>0,(i,ev,sv)
  assert en>0,(i,en)
  assert gv>0,(i,gv)
  nxx=en*ev/(K*sv**3)
  det=L*gv*ev**3/(K*K*sv**6)
  assert nxx>0 and det>0
  if lower_n is None or nxx.lower()<lower_n:lower_n=nxx.lower()
  if lower_d is None or det.lower()<lower_d:lower_d=det.lower()
 assert lower_n>arb('4.19e-7') and lower_d>arb('1.09e-10')
 return {'status':'passed','anchor_interval':'0<a<=100','anchor_coordinate':'h=a*L(a)',
  'cells':cells,'precision_bits':ctx.prec,'degree':degree,'fresh_moment_count':len(cs),
  'prior_second_origin_replay':prior,'derivative_remainders':errors,
  'cleared_degrees':{'N_hh':En.degree(),'det_M_hh':G.degree()},
  'lower_N_hh':str(lower_n),'lower_det_M_hh':str(lower_d),
  'p100_for_tail':str(p100),
  'claim':"J_3''(0)>0 for all positive triples with every anchor <=100, including repeated anchors; infinite-anchor tail not part of this function."}

def certify_tail(replay_twelfth=True):
 """Exact rational majorants on a>=100; actual theta constants are enclosed."""
 import sympy as s
 from theta_preservation_origin_20261110 import Theta
 from theta_second_source_origin_20261111 import certify_global_twelfth
 ctx.prec=256
 audit=[]
 def check(value,name):
  if not value:raise AssertionError(name)
  audit.append(name)
 th=Theta(14,16);jets=th.jets(0);k0=jets[0]
 cval=-jets[2]/k0;bval=jets[4]/k0
 assert 0<cval<arb('4.7') and arb('56.8')<bval<57
 assert (jets[6]/k0).abs_upper()<888
 assert (jets[8]/k0).abs_upper()<7973
 assert (jets[10]/k0).abs_upper()<716959
 derivative=certify_global_twelfth(th,k0) if replay_twelfth else {
  'global_bound':150000000,'source_pr':53,'source_commit':'5d64d45acf37f4957a8f65c036b502e1b49292d0',
  'scope':'Fixed proved input; set replay_twelfth=True to replay 4096 cells.'}
 a,p,v,w,t,c,b,g,j8,j10=s.symbols('a p v w t c b g j8 j10')
 js=[1,-c,b,g,j8,j10]
 N=sum(4**j*js[j]*(p/a**(2*j+1)+(2*j+1)/a**(2*j+2)) for j in range(6))
 def diff(q):return s.diff(q,a)+s.diff(q,p)*v/a+s.diff(q,v)*(v+w)/a
 k=p+v;l=2*v+w;d=1+a*p
 T=k*diff(diff(N))-l*diff(N)/a
 B=8*a*a*k*N-2*d*(k-l)-4*a*k*k
 C=4*a*k*diff(N)+2*(k-l)*N
 D=s.Poly(s.expand(T*B-C*C).subs(a,1/t),t)
 G=p*p+p*v+p*w-2*v*v
 check(D.coeff_monomial(t**6)==s.expand(64*(b-c*c)*G*G),'sixth_power_leading_identity')
 check(D.coeff_monomial(t**7)==s.expand(384*(b-c*c)*(3*p+5*v+w)*G),'seventh_power_identity')
 check(all(D.coeff_monomial(t**j)==0 for j in range(6)),'all_lower_powers_vanish')
 bounds={c:s.Rational(47,10),b:s.Integer(57),g:s.Integer(888),j8:s.Integer(7973),j10:s.Integer(716959)}
 def norm(co,degree):
  total=0
  for powers,coef in s.Poly(co,p,v,w,c,b,g,j8,j10).terms():
   pp,vv,ww,*theta=powers
   assert pp+vv+ww<=degree
   term=abs(coef)*s.Rational(5,14)**vv*s.Rational(51,140)**ww*s.Rational(5,7)**(degree-pp-vv-ww)
   for name,power in zip([c,b,g,j8,j10],theta):term*=bounds[name]**power
   total+=term
  return total
 A=s.Integer(100);M=s.Integer(150000000)
 leading=64*(s.Rational(284,5)-s.Rational(47,10)**2)*s.Rational(89,140)**2
 terms={n:norm(co,4)/A**(n-6) for (n,),co in D.terms() if n>7}
 penalty=sum(terms.values());polynomial_margin=leading-penalty
 check(polynomial_margin>295,'positive_polynomial_margin')
 # All three factors obey |T0|<4p²/a³, |B0|<4ap², |C0|<4p²/a.
 factor_bounds={}
 for name,F,lead in [('T',T,3),('B',B,-1),('C',C,1)]:
  poly=s.Poly(s.expand(F/a if lead==-1 else F).subs(a,1/t),t)
  normalized_lead=0 if lead==-1 else lead
  check(poly.coeff_monomial(t**normalized_lead)==s.expand((-2 if name=='C' else 2)*G),name+'_leading_factor_identity')
  other=sum(norm(co,2)/A**(n-normalized_lead) for (n,),co in poly.terms() if n>normalized_lead)
  check(s.Rational(241,70)+other<4,name+'_absolute_factor_bound')
  factor_bounds[name]={'other_terms_bound':str(other),'absolute_coefficient_bound':4}
  if name=='T':check(s.Rational(89,70)-other>1,'T_positive_lower_bound')
 # Laplace Taylor error through derivative order two.
 e0=4096*(1+s.Rational(13,140))
 e1=4096*(s.Rational(5,14)+13+s.Rational(182,140))
 e2=4096*(s.Rational(51,140)+26*s.Rational(5,14)+182+s.Rational(2730,140))
 check(e0<4500,'N_remainder_bound')
 check(e1<61000,'N_prime_remainder_bound')
 check(e2<865000,'N_second_remainder_bound')
 check(s.Rational(19,14)*865000+s.Rational(151,140)*61000<1250000,'T_remainder_bound')
 check(8*s.Rational(19,14)*4500<50000,'B_remainder_bound')
 check(4*s.Rational(19,14)*61000+2*s.Rational(241,140)*4500<350000,'C_remainder_bound')
 check(4*1250000+4*50000+8*350000==8000000,'linear_error_coefficient')
 check(1250000*50000+350000**2==185000000000,'quadratic_error_coefficient')
 error=8000000*M/A**8+185000000000*M*M/A**20
 margin=polynomial_margin-error
 check(margin>295,'final_tail_determinant_margin')
 check(1250000*M/A**12<s.Rational(1,100),'positive_N_hh_after_remainder')
 # Elementary polygamma/Dirichlet bounds supply |a²p''|<.51.
 check(1+2/(A-4)<2,'Dirichlet_moment_bound')
 BB=s.Rational(2)**(4-A)
 check(BB+3*BB**2+2*BB**3<2*BB,'log_zeta_third_bound')
 check(A*A*s.Rational(2)**(5-A)<s.Rational(1,100),'scaled_zeta_tail')
 check(2/A<s.Rational(1,2),'scaled_zeta_tail_decreases')
 check(2/A+2*A*A/(A-s.Rational(1,2))**3+s.Rational(1,100)<s.Rational(51,100),'p_second_upper_bound')
 # The integral coefficients used for the Taylor and derivative bounds.
 z=s.symbols('z',positive=True)
 for j in range(6):
  # Integrating t^(2j)/(2j)! against exp(-a t/2).
  I0=s.factorial(2*j)*(2/a)**(2*j+1)/s.factorial(2*j)
  I1=s.factorial(2*j+1)*(2/a)**(2*j+2)/s.factorial(2*j)
  check(s.factor((I1+2*p*I0)/4-4**j*(p/a**(2*j+1)+(2*j+1)/a**(2*j+2)))==0,'Laplace_coefficient_'+str(j))
 return {'status':'passed','anchor_interval':'a>=100','precision_bits':ctx.prec,
  'exact_check_count':len(audit),'exact_checks':audit,'global_twelfth_derivative':derivative,
  'theta_jet_enclosures':{str(j):str(jets[j]/k0) for j in range(0,11,2)},
  'normalized_polynomial_leading_lower':str(leading),'normalized_polynomial_tail_upper':str(penalty),
  'coefficient_penalties':{str(k):str(v) for k,v in sorted(terms.items())},
  'factor_bounds':factor_bounds,'normalized_remainder_error_upper':str(error),
  'final_margin_exact':str(margin),'final_margin_decimal':str(s.N(margin,25)),
  'prior_dependency':"p(a)>=p(100)>1.4 and 0<a p'(a)<1/2; p100 is recomputed in the compact certificate; the derivative bound is the PR53 analytic tail theorem.",
  'conclusion':'det M_hh >295 p(a)^4/[a^6(p(a)+a p_prime(a))^6] and N_hh>0 for every a>=100.'}

if __name__=='__main__':
 if not __debug__:raise RuntimeError('Do not run proof checks with Python -O')
 out={'exact':exact_checks(),'compact':certify_compact(),'tail':certify_tail()}
 with open('theta_third_origin_replay_20261111.json','w') as f:json.dump(out,f,indent=2)
 print(json.dumps(out,indent=2))
