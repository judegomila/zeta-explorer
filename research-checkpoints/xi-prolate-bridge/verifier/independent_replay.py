#!/usr/bin/env python3
"""Independent P0 replay from source parameters.

This file intentionally imports no producer module.  It reconstructs the
finite Weil matrix, prolate Galerkin state, arithmetic transform, projection,
and residual--gap values from the JSON input parameters.  It shares mpmath
with the producer; that limitation is explicit in its output.
"""
from __future__ import annotations
import argparse, json
from fractions import Fraction
from pathlib import Path
import mpmath as mp


def dec(x):
    if not isinstance(x,str): raise TypeError('lambda must be a decimal string')
    return mp.mpf(x)


def replay_acceptance_scale(supplied_value, reconstructed_value):
    """Explicit absolute/relative scale for a dimensionless replay value."""
    if supplied_value is None or reconstructed_value is None:
        return mp.mpf(1)
    return max(mp.mpf(1),abs(dec(supplied_value)),abs(reconstructed_value))


def lambda_squared_floor_exact(lambda_text):
    """Recover floor(lambda^2) from the input decimal, with no MP rounding."""
    if not isinstance(lambda_text,str): raise TypeError('lambda must be a decimal string')
    value=Fraction(lambda_text)
    if value<=0: raise ValueError('lambda must be positive')
    return value.numerator**2//value.denominator**2


def qfun(n,m,x,L):
    if n==m: return 2*(L-x)*mp.cos(2*mp.pi*n*x/L)/L
    return (mp.sin(2*mp.pi*m*x/L)-mp.sin(2*mp.pi*n*x/L))/(mp.pi*(n-m))


def lambda_terms(bound):
    result=[]
    for k in range(2,bound+1):
        divisors=[p for p in range(2,k+1) if all(p%d for d in range(2,int(mp.sqrt(p))+1)) and k%p==0]
        if len(divisors)==1:
            p=divisors[0]; t=k
            while t%p==0:t//=p
            if t==1: result.append((k,mp.log(p)))
    return result


def matrix_from_source(lambda_text,N,dps):
    mp.mp.dps=dps; lam=dec(lambda_text); L=2*mp.log(lam); modes=list(range(-N,N+1)); d=len(modes)
    P=mp.matrix(d); A=mp.matrix(d); R=mp.matrix(d); terms=lambda_terms(lambda_squared_floor_exact(lambda_text))
    for i,n in enumerate(modes):
      for j,m in enumerate(modes):
        P[i,j]=32*L*mp.sinh(L/4)**2*(L**2-16*mp.pi**2*m*n)/((L**2+16*mp.pi**2*m*m)*(L**2+16*mp.pi**2*n*n))
        f0=qfun(n,m,mp.mpf('0'),L)
        eps=mp.power(10,-dps//2)
        integrand=lambda x:(mp.exp(x/2)*qfun(n,m,x,L)-f0)/(mp.exp(x)-mp.exp(-x))
        A[i,j]=(mp.euler+mp.log(4*mp.pi))*f0/2+mp.quad(integrand,[eps,L])+eps*integrand(eps)-f0*mp.log((mp.exp(L)+1)/(mp.exp(L)-1))/2
        R[i,j]=mp.fsum(v/mp.sqrt(k)*qfun(n,m,mp.log(k),L) for k,v in terms)
    return P,A,R,P-A-R,terms


def pvals(z,maxdeg):
    p=[mp.mpf(1)]
    if maxdeg==0:return p
    p.append(z)
    for l in range(1,maxdeg):p.append(((2*l+1)*z*p[l]-l*p[l-1])/(l+1))
    return p


def basis(z,M):
    p=pvals(z,2*M-2)
    return [mp.sqrt(mp.mpf(4*j+1)/2)*p[2*j] for j in range(M)]


def prolate_quadrature(lambda_text,M,dps):
    mp.mp.dps=dps; lam=dec(lambda_text); c=2*mp.pi*lam**2; W=mp.matrix(M)
    for i in range(M):
      for j in range(i,min(M,i+2)):
        def integrand(z):
          bs=basis(z,M);return z*z*bs[i]*bs[j]
        integ=mp.quad(integrand,[-1,0,1])
        W[i,j]=W[j,i]=c*c*integ+(2*i)*(2*i+1)*(1 if i==j else 0)
    values,vectors=mp.eigsy(W)
    functions=[]
    for label in (0,4):
      col=label//2; coeff=mp.matrix([vectors[i,col] for i in range(M)])
      if mp.fsum(coeff[i]*basis(0,M)[i] for i in range(M))<0:coeff=-coeff
      functions.append((values[col],coeff))
    return functions


class H:
  def __init__(self,lambda_text,h0,h4):
    self.lt=lambda_text;self.lam=dec(lambda_text);self.h0=h0;self.h4=h4
    self.a4=mp.sqrt(3)/mp.power(2,mp.mpf(11)/4)
    self.a0=self.a4*self.integral(h4)/self.integral(h0)
  def one(self,item,x):
    if abs(x)>self.lam:return mp.mpf(0)
    coeff=item[1];bs=basis(mp.mpf(x)/self.lam,coeff.rows)
    return mp.fsum(coeff[i]*bs[i] for i in range(coeff.rows))/mp.sqrt(self.lam)
  def integral(self,item):return mp.sqrt(2*self.lam)*item[1][0]
  def __call__(self,x):return self.a4*self.one(self.h4,x)-self.a0*self.one(self.h0,x)


def E(h,u):
    count=int(mp.floor(h.lam/u));return mp.sqrt(u)*mp.fsum(h(k*u) for k in range(1,count+1))


def projection(h,N):
    L=2*mp.log(h.lam); bound=lambda_squared_floor_exact(h.lt); pts={mp.mpf(0),L}
    for m in range(1,bound+1):
      # The two summands in k^+ have different jump sets: E(h,e^t/lambda)
      # jumps at log(lambda^2/m), while E(h,lambda/e^t) jumps at log(m).
      # Retain both rather than relying on adaptive quadrature to discover a
      # discontinuity in either reflected arithmetic sum.  Construct the
      # first as L-log(m), its algebraically equal form, so reflection is
      # preserved at the working precision.
      logm=mp.log(m)
      for t in (L-logm,logm):
        if 0<t<L:pts.add(t)
    pts=sorted(pts)
    kp=lambda t:(E(h,mp.exp(t)/h.lam)+E(h,h.lam/mp.exp(t)))/2
    cs=[]
    for n in range(N+1):
      fn=lambda t,n=n:kp(t)*mp.cos(2*mp.pi*n*t/L)/mp.sqrt(L)
      cs.append(mp.fsum(mp.quad(fn,[a,b]) for a,b in zip(pts[:-1],pts[1:])))
    norm2=mp.fsum(mp.quad(lambda t:kp(t)**2,[a,b]) for a,b in zip(pts[:-1],pts[1:]))
    pn2=cs[0]**2+2*mp.fsum(x*x for x in cs[1:]); vec=mp.matrix([cs[abs(n)] for n in range(-N,N+1)])

    # Reconstruct the real Fourier projection independently of Parseval.  In
    # particular, do not obtain the error from ``norm2 - pn2``: that
    # subtraction both shares the coefficient-norm path and can lose most of
    # its significant digits when the projection is accurate.
    def reconstruction(t):
      theta=2*mp.pi*t/L
      return (cs[0]+2*mp.fsum(cs[n]*mp.cos(n*theta) for n in range(1,N+1)))/mp.sqrt(L)
    error2=mp.fsum(mp.quad(lambda t:(kp(t)-reconstruction(t))**2,[a,b])
                   for a,b in zip(pts[:-1],pts[1:]))
    if error2<=0:raise ArithmeticError('direct projection-error square is nonpositive; increase dps')
    parseval_error2=norm2-pn2
    parseval_error=mp.sqrt(parseval_error2) if parseval_error2>0 else None
    direct_error=mp.sqrt(error2)
    checks={
      'projection_error_method':'direct_residual_quadrature',
      'projection_error_parseval_crosscheck':parseval_error,
      'projection_error_parseval_error_sq':parseval_error2,
      'projection_error_squared_crosscheck_discrepancy':error2-parseval_error2,
      'projection_error_crosscheck_discrepancy':(
        abs(direct_error-parseval_error) if parseval_error is not None else None),
      'logarithmic_breakpoints_t':pts,
    }
    return vec/mp.sqrt(pn2),vec,direct_error,mp.sqrt(pn2),mp.sqrt(norm2),checks


def norm(v):return mp.sqrt(mp.fsum(v[i]**2 for i in range(v.rows)))
def dot(x,A,y):return (x.T*A*y)[0]
def complement(k):
    e=mp.matrix(k.rows,1);e[0]=1;s=1 if k[0]>=0 else -1;v=k+s*e;Hh=mp.eye(k.rows)-2*v*v.T/dot(v,mp.eye(k.rows),v);return Hh[:,1:k.rows]


def metrics(Q,k):
    q=dot(k,Q,k);rv=Q*k-q*k;B=complement(k);ev,_=mp.eigsy(B.T*Q*B);return q,norm(rv),ev[0]-q,rv


def sector_metrics(Q,k,N):
    """Independent parity-sector, Ritz, and weighted-resolvent replay.

    The producer may evaluate the weighted quantity through spectral data.
    This replay instead solves ``(A-uI)y=b_K`` directly on the inversion-even
    complement and sets ``tau=||y||``.  Thus no producer eigenvectors or
    cached complement matrices are trusted.
    """
    d=2*N+1
    plus=mp.matrix(d,N+1);minus=mp.matrix(d,N)
    plus[N,0]=1
    for n in range(1,N+1):
      plus[N-n,n]=plus[N+n,n]=1/mp.sqrt(2)
      minus[N+n,n-1]=1/mp.sqrt(2);minus[N-n,n-1]=-1/mp.sqrt(2)
    ke=plus.T*k;Qe=plus.T*Q*plus;Qo=minus.T*Q*minus
    ce=complement(ke);Acomp=ce.T*Qe*ce;ee,_=mp.eigsy(Acomp);oe,_=mp.eigsy(Qo)
    q=dot(k,Q,k);b=Q*k-q*k;r=norm(b)
    if r==0:
      c=None;u=q
    else:
      w=b/r;c=dot(w,Q,w);u=(q+c-mp.sqrt((c-q)**2+4*r*r))/2
    de=ee[0]-q;gamma=ee[0]-u;margin=oe[0]-u
    rhs=ce.T*(plus.T*b);rhs_norm=norm(rhs)
    rhs_norm_defect=rhs_norm-r
    diagnostic_tol=mp.power(10,-max(12,mp.mp.dps//2))
    if gamma>0:
      shifted=Acomp-u*mp.eye(Acomp.rows)
      solution=mp.lu_solve(shifted,rhs)
      tau=norm(solution);comparison=r/gamma
      tau_defect=tau-comparison
      tau_upper_defect=max(mp.mpf(0),tau_defect)
      solve_residual=norm(shifted*solution-rhs)
      tau_tol=diagnostic_tol*max(1,abs(comparison))
      tau_le=bool(tau_defect<=tau_tol)
      chordal=mp.sqrt(2-2/mp.sqrt(1+tau*tau))
    else:
      tau=None;comparison=None;tau_defect=None;tau_upper_defect=None
      solve_residual=None;chordal=None;tau_le=False
    sector_pass=bool(gamma>0 and margin>0)
    weighted_pass=bool(sector_pass and tau is not None and tau>=0 and tau_le
      and abs(rhs_norm_defect)<=diagnostic_tol*max(1,r)
      and solve_residual is not None
      and solve_residual<=diagnostic_tol*max(1,rhs_norm))
    return {'Delta_even':de,'r_over_Delta_even':r/de if de>0 else None,
      'residual_direction_rayleigh_c':c,'two_dimensional_ritz_upper_u':u,
      'even_complement_floor_minus_ritz_upper':gamma,
      'r_over_even_ritz_gap':r/gamma if gamma>0 else None,
      'resolvent_weighted_tau':tau,'resolvent_Gamma':gamma,
      'resolvent_weighted_chordal_distance_bound':chordal,
      'resolvent_comparison_r_over_Gamma':comparison,
      'resolvent_tau_minus_r_over_Gamma':tau_defect,
      'resolvent_tau_le_r_over_Gamma_defect':tau_upper_defect,
      'resolvent_tau_le_r_over_Gamma':tau_le,
      'resolvent_rhs_norm':rhs_norm,
      'resolvent_rhs_norm_minus_r_abs':abs(rhs_norm_defect),
      'resolvent_solve_residual_norm':solve_residual,
      'resolvent_evaluation_path':'direct_lu_solve_on_even_complement',
      'resolvent_weighted_bound_certification':'finite_arbitrary_precision_diagnostic_not_interval_certified',
      'resolvent_weighted_bound_diagnostic_pass':weighted_pass,
      'odd_floor_minus_ritz_upper':margin,
      'sector_refined_bridge_diagnostic_pass':sector_pass}


def weighted_boundary_metrics(k,N,L,sector):
    """Reconstruct the sharp boundary reserve without producer booleans."""
    d=2*N+1;plus=mp.matrix(d,N+1);plus[N,0]=1
    for n in range(1,N+1):
      plus[N-n,n]=plus[N+n,n]=1/mp.sqrt(2)
    ke=plus.T*k;ce=complement(ke)
    delta=mp.matrix([1/mp.sqrt(L)]*d)
    projected_norm=norm(ce.T*(plus.T*delta))
    delta_norm=norm(delta);delta_kappa=abs((delta.T*k)[0])
    tau=sector['resolvent_weighted_tau']
    chordal=sector['resolvent_weighted_chordal_distance_bound']
    if tau is None:
      reserve=None;full_reserve=None;legacy=None
      reserve_pass=False;full_reserve_pass=False;legacy_pass=False
    else:
      reserve=delta_kappa-projected_norm*tau
      full_reserve=delta_kappa-delta_norm*chordal
      legacy=delta_kappa-delta_norm*tau
      reserve_pass=bool(sector['sector_refined_bridge_diagnostic_pass']
        and sector['resolvent_weighted_bound_diagnostic_pass'] and reserve>0)
      full_reserve_pass=bool(sector['sector_refined_bridge_diagnostic_pass']
        and sector['resolvent_weighted_bound_diagnostic_pass'] and full_reserve>0)
      legacy_pass=bool(sector['sector_refined_bridge_diagnostic_pass']
        and sector['resolvent_weighted_bound_diagnostic_pass'] and legacy>0)
    return {
      'projected_even_complement_delta_norm':projected_norm,
      'generic_reserve_ratio_convention':'|delta(kappa)|-||P_K delta||*tau, K=even intersection kappa-perp',
      'generic_reserve':reserve,'generic_reserve_diagnostic_pass':reserve_pass,
      'resolvent_full_delta_norm_reserve_convention':'|delta(kappa)|-||delta||*resolvent_weighted_chordal_distance_bound',
      'resolvent_full_delta_norm_reserve':full_reserve,
      'resolvent_full_delta_norm_reserve_diagnostic_pass':full_reserve_pass,
      'resolvent_full_delta_norm_reserve_legacy_convention':'|delta(kappa)|-||delta||*tau',
      'resolvent_full_delta_norm_reserve_legacy':legacy,
      'resolvent_full_delta_norm_reserve_legacy_diagnostic_pass':legacy_pass,
    }


def source_commutator_metrics(Q,N,sector):
    """Independent CCM (5.2)--(5.3) audit using the n,-n entries.

    The producer reconstructs b_n from Q_(n,0).  Here inversion oddness gives
    the distinct formula b_n=n Q_(n,-n), after which the full Cauchy form and
    rank-two commutator are replayed.
    """
    modes=list(range(-N,N+1));d=2*N+1
    beta=mp.matrix(d,1);eta=mp.matrix([mp.mpf(1)]*d);M=mp.matrix(d)
    J=mp.matrix(d)
    for i,n in enumerate(modes):
      M[i,i]=n;J[i,d-1-i]=1
      beta[i]=0 if n==0 else n*Q[i,N-n]
    cauchy=mp.mpf(0)
    for i,n in enumerate(modes):
      for j,m in enumerate(modes):
        if i!=j:
          cauchy=max(cauchy,abs(Q[i,j]-(beta[i]-beta[j])/(n-m)))
    rank_two=beta*eta.T-eta*beta.T
    max_abs=lambda A:max((abs(A[i,j]) for i in range(A.rows) for j in range(A.cols)),default=mp.mpf(0))
    defects={
      'source_cauchy_offdiagonal':cauchy,
      'source_rank_two_commutator':max_abs(M*Q-Q*M-rank_two),
      'source_beta_inversion_odd':norm(J*beta+beta),
      'source_eta_inversion_even':norm(J*eta-eta),
      'source_mode_inversion_anticommutator':max_abs(M*J+J*M),
    }
    tol=mp.power(10,-max(12,mp.mp.dps//2))
    matrix_pass=all(value<=tol for value in defects.values())
    conclusion=bool(matrix_pass and sector['sector_refined_bridge_diagnostic_pass'])
    return {
      'source_commutator_beta_modes_minusN_to_N':beta,
      'source_commutator_defects':defects,
      'source_commutator_matrix_form_diagnostic_pass':matrix_pass,
      'source_boundary_proof_reference':'CCM-ZST-v1 Lemma 5.1 (5.2), Lemma 5.2(ii) (5.3), post-Definition 5.3 argument, and (5.15)',
      'source_boundary_route_certification':'finite_arbitrary_precision_diagnostic_not_interval_certified',
      'source_simple_even_hypotheses_diagnostic_pass':conclusion,
      'source_boundary_nonzero_conditional_diagnostic_conclusion':conclusion,
    }


def maxdiff_matrix(raw,A):
    return max(abs(dec(raw[i][j])-A[i,j]) for i in range(A.rows) for j in range(A.cols))
def maxdiff_vector(raw,v):return max(abs(dec(raw[i])-v[i]) for i in range(v.rows))
def maxdiff_list(raw,values):
    if len(raw)!=len(values):return mp.inf
    return max((abs(dec(x)-y) for x,y in zip(raw,values)),default=mp.mpf(0))
def optional_diff(raw,value):
    if raw is None or value is None:return mp.mpf(0) if raw is None and value is None else mp.inf
    return abs(dec(raw)-value)


def main():
    ap=argparse.ArgumentParser();ap.add_argument('producer',type=Path);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args()
    supplied=json.loads(a.producer.read_text());inputs=supplied['inputs'];dps=int(inputs['precision_decimal_digits']);mp.mp.dps=dps
    lt=inputs['lambda'];N=int(inputs['N']);M=int(inputs['prolate_even_legendre_basis_size'])
    P,A,R,Q,terms=matrix_from_source(lt,N,dps)
    fs=prolate_quadrature(lt,M,dps);h=H(lt,fs[0],fs[1]);k,coeff,perr,pnorm,snorm,projection_checks=projection(h,N);q,r,gap,rv=metrics(Q,k)
    sector=sector_metrics(Q,k,N);boundary=weighted_boundary_metrics(k,N,2*mp.log(dec(lt)),sector)
    source_boundary=source_commutator_metrics(Q,N,sector)
    supplied_sector=supplied['residual_gap'];supplied_projection=supplied['projection'];supplied_boundary=supplied['boundary']
    defects={
      'Q_entrywise':maxdiff_matrix(supplied['raw_matrices']['Q_equals_pole_minus_arch_minus_prime'],Q),
      'pole_entrywise':maxdiff_matrix(supplied['raw_matrices']['pole'],P),
      'arch_entrywise':maxdiff_matrix(supplied['raw_matrices']['archimedean_unsigned'],A),
      'prime_entrywise':maxdiff_matrix(supplied['raw_matrices']['prime_unsigned'],R),
      'h0_eigenvalue':abs(dec(supplied['prolate_checks']['h0_eigenvalue'])-fs[0][0]),
      'h4_eigenvalue':abs(dec(supplied['prolate_checks']['h4_eigenvalue'])-fs[1][0]),
      'a0':abs(dec(supplied['normalizations']['h_a0_lambda'])-h.a0),
      'projection_coefficients':maxdiff_vector(supplied['projection']['coefficients_modes_minusN_to_N'],coeff),
      'projection_error':abs(dec(supplied['projection']['projection_error'])-perr),
      'projection_error_method':(mp.mpf(0) if supplied_projection['projection_error_method']==projection_checks['projection_error_method'] else mp.inf),
      'projection_error_parseval_crosscheck':optional_diff(supplied_projection['projection_error_parseval_crosscheck'],projection_checks['projection_error_parseval_crosscheck']),
      'projection_error_parseval_error_sq':optional_diff(supplied_projection['projection_error_parseval_error_sq'],projection_checks['projection_error_parseval_error_sq']),
      'projection_error_squared_crosscheck_discrepancy':optional_diff(supplied_projection['projection_error_squared_crosscheck_discrepancy'],projection_checks['projection_error_squared_crosscheck_discrepancy']),
      'projection_error_crosscheck_discrepancy':optional_diff(supplied_projection['projection_error_crosscheck_discrepancy'],projection_checks['projection_error_crosscheck_discrepancy']),
      'logarithmic_breakpoints_t':maxdiff_list(supplied_projection['logarithmic_breakpoints_t'],projection_checks['logarithmic_breakpoints_t']),
      'q':abs(dec(supplied['residual_gap']['q'])-q),'r':abs(dec(supplied['residual_gap']['r'])-r),
      'Delta':abs(dec(supplied['residual_gap']['Delta'])-gap),
      'Delta_even':abs(dec(supplied_sector['Delta_even'])-sector['Delta_even']),
      'r_over_Delta_even':(abs(dec(supplied_sector['r_over_Delta_even'])-sector['r_over_Delta_even'])
        if supplied_sector['r_over_Delta_even'] is not None and sector['r_over_Delta_even'] is not None
        else mp.mpf(0) if supplied_sector['r_over_Delta_even'] is None and sector['r_over_Delta_even'] is None else mp.inf),
      'residual_direction_rayleigh_c':(abs(dec(supplied_sector['residual_direction_rayleigh_c'])-sector['residual_direction_rayleigh_c'])
        if supplied_sector['residual_direction_rayleigh_c'] is not None and sector['residual_direction_rayleigh_c'] is not None
        else mp.mpf(0) if supplied_sector['residual_direction_rayleigh_c'] is None and sector['residual_direction_rayleigh_c'] is None else mp.inf),
      'two_dimensional_ritz_upper_u':abs(dec(supplied_sector['two_dimensional_ritz_upper_u'])-sector['two_dimensional_ritz_upper_u']),
      'even_complement_floor_minus_ritz_upper':abs(dec(supplied_sector['even_complement_floor_minus_ritz_upper'])-sector['even_complement_floor_minus_ritz_upper']),
      'r_over_even_ritz_gap':(abs(dec(supplied_sector['r_over_even_ritz_gap'])-sector['r_over_even_ritz_gap'])
        if supplied_sector['r_over_even_ritz_gap'] is not None and sector['r_over_even_ritz_gap'] is not None
        else mp.mpf(0) if supplied_sector['r_over_even_ritz_gap'] is None and sector['r_over_even_ritz_gap'] is None else mp.inf),
      'resolvent_weighted_tau':optional_diff(supplied_sector['resolvent_weighted_tau'],sector['resolvent_weighted_tau']),
      'resolvent_weighted_chordal_distance_bound':optional_diff(supplied_sector['resolvent_weighted_chordal_distance_bound'],sector['resolvent_weighted_chordal_distance_bound']),
      'resolvent_Gamma':abs(dec(supplied_sector['resolvent_Gamma'])-sector['resolvent_Gamma']),
      'resolvent_comparison_r_over_Gamma':optional_diff(supplied_sector['resolvent_comparison_r_over_Gamma'],sector['resolvent_comparison_r_over_Gamma']),
      'resolvent_tau_minus_r_over_Gamma':optional_diff(supplied_sector['resolvent_tau_minus_r_over_Gamma'],sector['resolvent_tau_minus_r_over_Gamma']),
      'resolvent_tau_le_r_over_Gamma_defect':optional_diff(supplied_sector['resolvent_tau_le_r_over_Gamma_defect'],sector['resolvent_tau_le_r_over_Gamma_defect']),
      'resolvent_tau_le_r_over_Gamma':(mp.mpf(0)
        if supplied_sector['resolvent_tau_le_r_over_Gamma']==sector['resolvent_tau_le_r_over_Gamma'] else mp.inf),
      'resolvent_rhs_norm':abs(dec(supplied_sector['resolvent_rhs_norm'])-sector['resolvent_rhs_norm']),
      'resolvent_rhs_norm_minus_r_abs':abs(dec(supplied_sector['resolvent_rhs_norm_minus_r_abs'])-sector['resolvent_rhs_norm_minus_r_abs']),
      'resolvent_solve_residual_norm':optional_diff(supplied_sector['resolvent_solve_residual_norm'],sector['resolvent_solve_residual_norm']),
      'producer_resolvent_evaluation_path':(mp.mpf(0)
        if supplied_sector['resolvent_evaluation_path']=='spectral_decomposition_of_even_complement' else mp.inf),
      'resolvent_weighted_bound_certification':(mp.mpf(0)
        if supplied_sector['resolvent_weighted_bound_certification']==sector['resolvent_weighted_bound_certification'] else mp.inf),
      'resolvent_weighted_bound_diagnostic_pass':(mp.mpf(0)
        if supplied_sector['resolvent_weighted_bound_diagnostic_pass']==sector['resolvent_weighted_bound_diagnostic_pass'] else mp.inf),
      'resolvent_weighted_bound_top_level_pass':(mp.mpf(0)
        if supplied['resolvent_weighted_bound_diagnostic_pass']==sector['resolvent_weighted_bound_diagnostic_pass'] else mp.inf),
      'odd_floor_minus_ritz_upper':abs(dec(supplied_sector['odd_floor_minus_ritz_upper'])-sector['odd_floor_minus_ritz_upper']),
      'sector_refined_bridge_diagnostic_pass':(mp.mpf(0)
        if supplied_sector['sector_refined_bridge_diagnostic_pass']==sector['sector_refined_bridge_diagnostic_pass'] else mp.inf),
      'sector_refined_bridge_top_level_pass':(mp.mpf(0)
        if supplied['sector_refined_bridge_diagnostic_pass']==sector['sector_refined_bridge_diagnostic_pass'] else mp.inf),
      'projected_even_complement_delta_norm':abs(dec(supplied_boundary['projected_even_complement_delta_norm'])-boundary['projected_even_complement_delta_norm']),
      'generic_reserve_ratio_convention':(mp.mpf(0)
        if supplied_boundary['generic_reserve_ratio_convention']==boundary['generic_reserve_ratio_convention'] else mp.inf),
      'weighted_generic_reserve':optional_diff(supplied_boundary['generic_reserve'],boundary['generic_reserve']),
      'weighted_generic_reserve_diagnostic_pass':(mp.mpf(0)
        if supplied_boundary['generic_reserve_diagnostic_pass']==boundary['generic_reserve_diagnostic_pass'] else mp.inf),
      'resolvent_full_delta_norm_reserve_convention':(mp.mpf(0)
        if supplied_boundary['resolvent_full_delta_norm_reserve_convention']==boundary['resolvent_full_delta_norm_reserve_convention'] else mp.inf),
      'resolvent_full_delta_norm_reserve':optional_diff(supplied_boundary['resolvent_full_delta_norm_reserve'],boundary['resolvent_full_delta_norm_reserve']),
      'resolvent_full_delta_norm_reserve_diagnostic_pass':(mp.mpf(0)
        if supplied_boundary['resolvent_full_delta_norm_reserve_diagnostic_pass']==boundary['resolvent_full_delta_norm_reserve_diagnostic_pass'] else mp.inf),
      'resolvent_full_delta_norm_reserve_legacy_convention':(mp.mpf(0)
        if supplied_boundary['resolvent_full_delta_norm_reserve_legacy_convention']==boundary['resolvent_full_delta_norm_reserve_legacy_convention'] else mp.inf),
      'resolvent_full_delta_norm_reserve_legacy':optional_diff(supplied_boundary['resolvent_full_delta_norm_reserve_legacy'],boundary['resolvent_full_delta_norm_reserve_legacy']),
      'resolvent_full_delta_norm_reserve_legacy_diagnostic_pass':(mp.mpf(0)
        if supplied_boundary['resolvent_full_delta_norm_reserve_legacy_diagnostic_pass']==boundary['resolvent_full_delta_norm_reserve_legacy_diagnostic_pass'] else mp.inf),
      'source_commutator_beta_modes_minusN_to_N':maxdiff_vector(
        supplied_boundary['source_commutator_beta_modes_minusN_to_N'],
        source_boundary['source_commutator_beta_modes_minusN_to_N']),
      'source_cauchy_offdiagonal':abs(
        dec(supplied_boundary['source_commutator_defects']['source_cauchy_offdiagonal'])
        - source_boundary['source_commutator_defects']['source_cauchy_offdiagonal']),
      'source_rank_two_commutator':abs(
        dec(supplied_boundary['source_commutator_defects']['source_rank_two_commutator'])
        - source_boundary['source_commutator_defects']['source_rank_two_commutator']),
      'source_beta_inversion_odd':abs(
        dec(supplied_boundary['source_commutator_defects']['source_beta_inversion_odd'])
        - source_boundary['source_commutator_defects']['source_beta_inversion_odd']),
      'source_eta_inversion_even':abs(
        dec(supplied_boundary['source_commutator_defects']['source_eta_inversion_even'])
        - source_boundary['source_commutator_defects']['source_eta_inversion_even']),
      'source_mode_inversion_anticommutator':abs(
        dec(supplied_boundary['source_commutator_defects']['source_mode_inversion_anticommutator'])
        - source_boundary['source_commutator_defects']['source_mode_inversion_anticommutator']),
      'source_commutator_matrix_form_diagnostic_pass':(mp.mpf(0)
        if supplied_boundary['source_commutator_matrix_form_diagnostic_pass']==source_boundary['source_commutator_matrix_form_diagnostic_pass'] else mp.inf),
      'source_commutator_top_level_pass':(mp.mpf(0)
        if supplied['source_commutator_matrix_form_diagnostic_pass']==source_boundary['source_commutator_matrix_form_diagnostic_pass'] else mp.inf),
      'source_boundary_proof_reference':(mp.mpf(0)
        if supplied_boundary['source_boundary_proof_reference']==source_boundary['source_boundary_proof_reference'] else mp.inf),
      'source_boundary_route_certification':(mp.mpf(0)
        if supplied_boundary['source_boundary_route_certification']==source_boundary['source_boundary_route_certification'] else mp.inf),
      'source_simple_even_hypotheses_diagnostic_pass':(mp.mpf(0)
        if supplied_boundary['source_simple_even_hypotheses_diagnostic_pass']==source_boundary['source_simple_even_hypotheses_diagnostic_pass'] else mp.inf),
      'source_boundary_nonzero_conditional_diagnostic_conclusion':(mp.mpf(0)
        if supplied_boundary['source_boundary_nonzero_conditional_diagnostic_conclusion']==source_boundary['source_boundary_nonzero_conditional_diagnostic_conclusion'] else mp.inf),
      'combined_residual_vector':maxdiff_vector(supplied['residual_gap']['combined_residual_vector_before_norm'],rv),
    }
    # Point-value replay defects are judged absolutely for quantities of size
    # at most one and relatively for the few ratios that can be very large.
    # Without this scale audit, a 40-digit reconstruction of a ratio near
    # 2.4e5 can be rejected for a 2e-20 absolute difference even though its
    # relative defect is about 1e-25.  Raw absolute defects remain serialized.
    defect_acceptance_scales={key:mp.mpf(1) for key in defects}
    for key,supplied_value,reconstructed_value in (
      ('r_over_Delta_even',supplied_sector['r_over_Delta_even'],sector['r_over_Delta_even']),
      ('r_over_even_ritz_gap',supplied_sector['r_over_even_ritz_gap'],sector['r_over_even_ritz_gap']),
      ('resolvent_comparison_r_over_Gamma',supplied_sector['resolvent_comparison_r_over_Gamma'],sector['resolvent_comparison_r_over_Gamma']),
      ('resolvent_tau_minus_r_over_Gamma',supplied_sector['resolvent_tau_minus_r_over_Gamma'],sector['resolvent_tau_minus_r_over_Gamma']),
    ):
      if supplied_value is not None and reconstructed_value is not None:
        defect_acceptance_scales[key]=replay_acceptance_scale(
          supplied_value,reconstructed_value)
    scaled_defects={
      key:value/defect_acceptance_scales[key]
      for key,value in defects.items()
    }
    tol=mp.power(10,-max(12,dps//2))
    passed=all(value<=tol for value in scaled_defects.values())
    reconstructed_sector={key:(value if isinstance(value,(bool,str)) or value is None else mp.nstr(value,dps))
      for key,value in sector.items()}
    reconstructed_boundary={key:(value if isinstance(value,(bool,str)) or value is None else mp.nstr(value,dps))
      for key,value in boundary.items()}
    reconstructed_source_boundary={
      key:(value if isinstance(value,(bool,str))
        else [mp.nstr(value[i],dps) for i in range(value.rows)] if isinstance(value,mp.matrix)
        else {name:mp.nstr(defect,dps) for name,defect in value.items()} if isinstance(value,dict)
        else mp.nstr(value,dps))
      for key,value in source_boundary.items()}
    reconstructed_boundary.update(reconstructed_source_boundary)
    result={'replay_agrees':passed,'tolerance':mp.nstr(tol,dps),
      'tolerance_convention':'absolute below unit scale; relative after explicit max(1,|producer|,|reconstruction|) scaling',
      'defects':{k:mp.nstr(v,dps) for k,v in defects.items()},
      'defect_acceptance_scales':{k:mp.nstr(v,dps) for k,v in defect_acceptance_scales.items()},
      'scaled_defects':{k:mp.nstr(v,dps) for k,v in scaled_defects.items()},
      'reconstructed_sector_refined_diagnostics':reconstructed_sector,
      'reconstructed_weighted_boundary_diagnostics':reconstructed_boundary,
      'reconstructed_projection':{
        key:(value if isinstance(value,str) or value is None else [mp.nstr(x,dps) for x in value] if key=='logarithmic_breakpoints_t' else mp.nstr(value,dps))
        for key,value in projection_checks.items()},
      'reconstructed_prime_powers':[n for n,_ in terms],
      'producer_values_ignored_except_for_comparison':True,
      'shared_arithmetic_library_limitation':'producer and verifier both use mpmath; verifier independently reconstructs formulas and quadrature matrices',
      'analytic_uniform_claim':False}
    text=json.dumps(result,indent=2,sort_keys=True)+'\n';a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(text);print(text,end='')
    if not passed:raise SystemExit(1)
if __name__=='__main__':main()
