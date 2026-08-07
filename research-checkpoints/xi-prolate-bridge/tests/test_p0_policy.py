import sys,unittest
from pathlib import Path
import mpmath as mp
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'src'))
from p0_policy import validate_p0_artifact,tampered
from source_boundary import source_commutator_metrics
from weil_matrix import blocks_split,inversion

def smat(A):return [[str(A[i,j]) for j in range(A.cols)] for i in range(A.rows)]

def valid():
 return {'terminal_state':'P0_INVALIDATED','analytic_uniform_claim':False,
  'inputs':{'lambda':'2','N':1,'precision_decimal_digits':30},
  'provenance':{'uses_assumed_real_zeta_zeros':False,'assumes_global_weil_positivity':False,
   'lambda_parameter_representation':'decimal_string','inversion_reflection_included':True,
   'prime_block_sign':'minus','determinant_convergence_evidence':'not_attempted'},
  'source_enumeration':{'prime_power_cutoff':'lambda^2','terms':[{'n':2},{'n':3},{'n':4}]},
  'normalizations':{'Fourier_mode_sign':'U_n uses exp(+2*pi*i*n*x/L)',
   'evenization':'k_plus=(k+Jk)/2','locked_transform_limit':'Xi/4'},
  'residual_gap':{'Delta':'0.001'},'finite_residual_gap_hypotheses_diagnostic_pass':True,
  **(lambda x:{'raw_matrices':{'pole':smat(x[2]),'archimedean_unsigned':smat(x[3]),'prime_unsigned':smat(x[4]),'Q_equals_pole_minus_arch_minus_prime':smat(x[5])}})(blocks_split('2',1,30))}

def valid_with_sector():
 a=valid();q=mp.mpf('1');r=mp.mpf('0.2');alpha=mp.mpf('0.9');omega=mp.mpf('0.8');c=mp.mpf('0.9')
 u=(q+c-mp.sqrt((c-q)**2+4*r*r))/2;gamma=alpha-u;margin=omega-u
 a['residual_gap'].update({'q':str(q),'r':str(r),'inversion_even_sector_floor':str(alpha),
  'inversion_odd_sector_floor':str(omega),'Delta_even':str(alpha-q),
  'residual_direction_rayleigh_c':str(c),'two_dimensional_ritz_upper_u':str(u),
  'even_complement_floor_minus_ritz_upper':str(gamma),'r_over_even_ritz_gap':str(r/gamma),
  'odd_floor_minus_ritz_upper':str(margin),'sector_refined_bridge_diagnostic_pass':True})
 a['sector_refined_bridge_diagnostic_pass']=True
 source=source_commutator_metrics(blocks_split('2',1,30)[5],inversion(1),[-1,0,1])
 a['boundary']={'source_commutator_beta_modes_minusN_to_N':[str(source['beta'][i]) for i in range(3)],
  'source_commutator_defects':{name:str(value) for name,value in source['defects'].items()},
  'source_commutator_matrix_form_diagnostic_pass':True,
  'source_boundary_proof_reference':source['source_boundary_proof_reference'],
  'source_boundary_route_certification':'finite_arbitrary_precision_diagnostic_not_interval_certified',
  'source_simple_even_hypotheses_diagnostic_pass':True,
  'source_boundary_nonzero_conditional_diagnostic_conclusion':True}
 a['source_commutator_matrix_form_diagnostic_pass']=True
 return a

def valid_with_projection():
 a=valid();mp.mp.dps=50;L=2*mp.log(2)
 points=sorted({mp.mpf(0),L,mp.log(2),mp.log(3),L-mp.log(3)})
 a['projection']={'projection_error':'0.1','projection_error_method':'direct_residual_quadrature',
  'projection_error_parseval_crosscheck':'0.1','projection_error_parseval_error_sq':'0.01',
  'projection_error_squared_crosscheck_discrepancy':'0',
  'projection_error_crosscheck_discrepancy':'0',
  'logarithmic_breakpoints_t':[mp.nstr(x,50) for x in points]}
 return a

def valid_with_weighted_resolvent():
 a=valid_with_sector();r=a['residual_gap'];mp.mp.dps=50
 gamma=mp.mpf(r['even_complement_floor_minus_ritz_upper']);residual=mp.mpf(r['r'])
 tau=residual/gamma;s=mp.sqrt(1+tau*tau);chordal=tau*mp.sqrt(2/(s*(s+1)))
 r.update({'resolvent_Gamma':str(gamma),'resolvent_rhs_norm':str(residual),
  'resolvent_rhs_norm_minus_r_abs':'0','resolvent_weighted_tau':str(tau),
  'resolvent_weighted_chordal_distance_bound':str(chordal),
  'resolvent_solve_residual_norm':'0','resolvent_comparison_r_over_Gamma':str(tau),
  'resolvent_tau_minus_r_over_Gamma':'0','resolvent_tau_le_r_over_Gamma_defect':'0',
  'resolvent_tau_le_r_over_Gamma':True,
  'resolvent_weighted_bound_certification':'finite_arbitrary_precision_diagnostic_not_interval_certified',
  'resolvent_evaluation_path':'spectral_decomposition_of_even_complement',
  'resolvent_weighted_bound_diagnostic_pass':True})
 a['resolvent_weighted_bound_diagnostic_pass']=True
 a['boundary'].update({'delta_norm':'1','delta_kappa_abs':'1',
  'projected_even_complement_delta_norm':'0.5',
  'generic_reserve':str(1-mp.mpf('0.5')*tau),
  'generic_reserve_diagnostic_pass':bool(1-mp.mpf('0.5')*tau>0),
  'resolvent_full_delta_norm_reserve':str(1-chordal),
  'resolvent_full_delta_norm_reserve_diagnostic_pass':bool(1-chordal>0),
  'resolvent_full_delta_norm_reserve_legacy':str(1-tau)})
 return a

class PolicyTests(unittest.TestCase):
 def test_valid_control(self):validate_p0_artifact(valid())
 def reject(self,path,value):
  with self.assertRaises(ValueError):validate_p0_artifact(tampered(valid(),path,value))
 def test_reject_assumed_real_zeros(self):self.reject(('provenance','uses_assumed_real_zeta_zeros'),True)
 def test_reject_global_weil_positivity(self):self.reject(('provenance','assumes_global_weil_positivity'),True)
 def test_reject_omitted_prime_power(self):self.reject(('source_enumeration','terms'),[{'n':2},{'n':3}])
 def test_reject_fourier_sign(self):self.reject(('normalizations','Fourier_mode_sign'),'U_n uses exp(-2*pi*i*n*x/L)')
 def test_reject_lambda_not_lambda_squared(self):self.reject(('source_enumeration','prime_power_cutoff'),'lambda')
 def test_reject_dropped_reflection(self):self.reject(('provenance','inversion_reflection_included'),False)
 def test_reject_binary64_parameter_path(self):self.reject(('provenance','lambda_parameter_representation'),'binary64')
 def test_reject_nonpositive_gap_pass(self):
  a=tampered(valid(),('residual_gap','Delta'),'0')
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_real_axis_substitute(self):self.reject(('provenance','determinant_convergence_evidence'),'real_axis_eigenvalue_agreement')
 def test_reject_unrepaired_source_scalar_claim(self):self.reject(('normalizations','locked_transform_limit'),'Xi')
 def test_reject_prime_list_that_is_not_used_in_matrix(self):
  a=valid();a['raw_matrices']['prime_unsigned'][0][0]='0'
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_prime_block_sign_flip(self):
  a=valid();P=a['raw_matrices']['pole'];A=a['raw_matrices']['archimedean_unsigned'];R=a['raw_matrices']['prime_unsigned']
  a['raw_matrices']['Q_equals_pole_minus_arch_minus_prime']=[[str(float(P[i][j])-float(A[i][j])+float(R[i][j])) for j in range(3)] for i in range(3)]
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_sector_refined_control_allows_negative_old_even_gap(self):
  a=valid_with_sector();self.assertLess(mp.mpf(a['residual_gap']['Delta_even']),0);validate_p0_artifact(a)
 def test_reject_false_sector_pass_from_nonpositive_gamma(self):
  a=valid_with_sector();a['residual_gap']['even_complement_floor_minus_ritz_upper']='0'
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_false_sector_pass_from_nonpositive_odd_margin(self):
  a=valid_with_sector();a['residual_gap']['odd_floor_minus_ritz_upper']='-0.1'
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_tampered_sector_ritz_value(self):
  a=valid_with_sector();a['residual_gap']['two_dimensional_ritz_upper_u']='0.7'
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_tampered_sector_ratio(self):
  a=valid_with_sector();a['residual_gap']['r_over_even_ritz_gap']='1'
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_trusted_source_commutator_boolean(self):
  a=valid_with_sector();a['boundary']['source_commutator_matrix_form_diagnostic_pass']=False
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_tampered_source_commutator_beta(self):
  a=valid_with_sector();a['boundary']['source_commutator_beta_modes_minusN_to_N'][0]='0'
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_unresolved_zero_projection_error(self):
  a=valid();a['projection']={'projection_error':'0'}
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_projection_direct_residual_control(self):validate_p0_artifact(valid_with_projection())
 def test_validation_uses_declared_precision_and_restores_ambient_precision(self):
  a=valid_with_projection();a['inputs']['precision_decimal_digits']=45
  old=mp.mp.dps;mp.mp.dps=15
  try:
   validate_p0_artifact(a)
   self.assertEqual(mp.mp.dps,15)
  finally:mp.mp.dps=old
 def test_reject_projection_norm_subtraction_method(self):
  a=valid_with_projection();a['projection']['projection_error_method']='norm_subtraction'
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_missing_reflected_arithmetic_breakpoint(self):
  a=valid_with_projection();a['projection']['logarithmic_breakpoints_t'].pop(-2)
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_weighted_resolvent_control(self):validate_p0_artifact(valid_with_weighted_resolvent())
 def test_reject_weighted_tau_above_scalar_bound(self):
  a=valid_with_weighted_resolvent();a['residual_gap']['resolvent_weighted_tau']='2'
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_weighted_resolvent_bad_solve(self):
  a=valid_with_weighted_resolvent();a['residual_gap']['resolvent_solve_residual_norm']='1'
  with self.assertRaises(ValueError):validate_p0_artifact(a)
 def test_reject_impossible_projected_boundary_norm(self):
  a=valid_with_weighted_resolvent();a['boundary']['projected_even_complement_delta_norm']='2'
  with self.assertRaises(ValueError):validate_p0_artifact(a)

if __name__=='__main__':unittest.main()
