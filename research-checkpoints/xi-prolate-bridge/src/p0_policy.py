"""Fail-closed policy checks for P0 artifacts and configurations."""
from __future__ import annotations
import copy
import mpmath as mp
from source_boundary import source_commutator_metrics
from weil_matrix import blocks_split, decimal_square_floor, inversion, parse_decimal, von_mangoldt_terms


ALLOWED_TERMINAL={"P0_EXACT_FORMULAS_PASS","P0_DIAGNOSTIC_PASS","P0_UNRESOLVED","P0_INVALIDATED"}


def validate_p0_artifact(a: dict) -> None:
    """Validate at the precision declared by the artifact itself.

    Reconstructing logarithmic breakpoints at the caller's ambient mpmath
    precision can falsely reject a valid high-precision artifact.  The
    context is local, so validation does not mutate the caller's precision.
    """
    inputs=a.get('inputs',{})
    try:
        declared_dps=int(inputs['precision_decimal_digits'])
    except (KeyError,TypeError,ValueError) as exc:
        raise ValueError('artifact precision is missing or invalid') from exc
    if declared_dps<15:
        raise ValueError('artifact precision is too small')
    with mp.workdps(declared_dps):
        _validate_p0_artifact(a)


def _validate_p0_artifact(a: dict) -> None:
    if a.get('terminal_state') not in ALLOWED_TERMINAL: raise ValueError('forbidden terminal state')
    p=a.get('provenance',{})
    if p.get('uses_assumed_real_zeta_zeros') is not False or 'zeta_zeros' in a: raise ValueError('zeta-zero table forbidden')
    if p.get('assumes_global_weil_positivity') is not False: raise ValueError('global Weil positivity forbidden')
    if p.get('lambda_parameter_representation')!='decimal_string': raise ValueError('binary64 decimal path forbidden')
    lam=parse_decimal(a['inputs']['lambda'])
    expected=[n for n,_ in von_mangoldt_terms(decimal_square_floor(a['inputs']['lambda']))]
    got=[row['n'] for row in a['source_enumeration']['terms']]
    if a['source_enumeration'].get('prime_power_cutoff')!='lambda^2' or got!=expected: raise ValueError('prime-power cutoff/enumeration mismatch')
    if p.get('prime_block_sign')!='minus': raise ValueError('source prime minus sign missing')
    if a['normalizations'].get('Fourier_mode_sign')!='U_n uses exp(+2*pi*i*n*x/L)': raise ValueError('Fourier sign changed')
    if p.get('inversion_reflection_included') is not True or a['normalizations'].get('evenization')!='k_plus=(k+Jk)/2': raise ValueError('inversion reflection dropped')
    projection=a.get('projection')
    if projection is not None:
        direct_error=mp.mpf(projection.get('projection_error','0'))
        if direct_error<=0:
            raise ValueError('projection error must be resolved as a positive value')
        if projection.get('projection_error_method')!='direct_residual_quadrature':
            raise ValueError('projection error must use direct residual quadrature')
        dps=int(a['inputs']['precision_decimal_digits'])
        projection_tol=mp.power(10,-max(10,dps//2))
        parseval_sq=mp.mpf(projection['projection_error_parseval_error_sq'])
        squared_defect=mp.mpf(projection['projection_error_squared_crosscheck_discrepancy'])
        if abs(squared_defect-(direct_error**2-parseval_sq))>projection_tol:
            raise ValueError('projection squared cross-check is inconsistent')
        parseval_error=projection.get('projection_error_parseval_crosscheck')
        scalar_defect=projection.get('projection_error_crosscheck_discrepancy')
        if parseval_sq>0:
            if parseval_error is None or scalar_defect is None:
                raise ValueError('positive Parseval cross-check is missing')
            parseval_error=mp.mpf(parseval_error)
            if abs(parseval_error**2-parseval_sq)>projection_tol:
                raise ValueError('Parseval projection cross-check is inconsistent')
            if abs(mp.mpf(scalar_defect)-abs(direct_error-parseval_error))>projection_tol:
                raise ValueError('projection error cross-check discrepancy is inconsistent')
        elif parseval_error is not None or scalar_defect is not None:
            raise ValueError('nonpositive Parseval square cannot have a real error cross-check')
        L=2*mp.log(lam);expected_points={mp.mpf(0),L}
        for m in range(1,decimal_square_floor(a['inputs']['lambda'])+1):
            logm=mp.log(m)
            for point in (logm,L-logm):
                if 0<point<L: expected_points.add(point)
        got_points=[mp.mpf(value) for value in projection.get('logarithmic_breakpoints_t',[])]
        expected_points=sorted(expected_points)
        if len(got_points)!=len(expected_points) or any(abs(x-y)>projection_tol for x,y in zip(got_points,expected_points)):
            raise ValueError('projection arithmetic breakpoint set is incomplete')
    gap=mp.mpf(a['residual_gap']['Delta'])
    if gap<=0 and (a.get('finite_residual_gap_hypotheses_diagnostic_pass') or a.get('terminal_state')=='P0_DIAGNOSTIC_PASS'):
        raise ValueError('nonpositive complementary gap cannot pass')
    residual=a['residual_gap']
    if 'sector_refined_bridge_diagnostic_pass' in residual:
        q=mp.mpf(residual['q']);r=mp.mpf(residual['r'])
        alpha=mp.mpf(residual['inversion_even_sector_floor'])
        omega=mp.mpf(residual['inversion_odd_sector_floor'])
        delta_even=mp.mpf(residual['Delta_even'])
        u=mp.mpf(residual['two_dimensional_ritz_upper_u'])
        gamma=mp.mpf(residual['even_complement_floor_minus_ritz_upper'])
        odd_margin=mp.mpf(residual['odd_floor_minus_ritz_upper'])
        tol=mp.power(10,-max(10,int(a['inputs']['precision_decimal_digits'])//2))
        if abs(delta_even-(alpha-q))>tol: raise ValueError('even gap is inconsistent with its compression floor')
        if abs(gamma-(alpha-u))>tol: raise ValueError('even Ritz gap is inconsistent with alpha-u')
        if abs(odd_margin-(omega-u))>tol: raise ValueError('odd Ritz margin is inconsistent with omega-u')
        c=residual.get('residual_direction_rayleigh_c')
        expected_u=q if r==0 else (q+mp.mpf(c)-mp.sqrt((mp.mpf(c)-q)**2+4*r*r))/2
        if (r==0 and c is not None) or (r!=0 and c is None) or abs(u-expected_u)>tol:
            raise ValueError('two-dimensional Ritz value is inconsistent with q,r,c')
        ratio=residual.get('r_over_even_ritz_gap')
        if gamma>0:
            if ratio is None or abs(mp.mpf(ratio)-r/gamma)>tol*max(1,abs(r/gamma)):
                raise ValueError('sector residual ratio is inconsistent with r/Gamma')
        elif ratio is not None:
            raise ValueError('nonpositive even Ritz gap cannot have a residual ratio')
        sector_pass=bool(residual['sector_refined_bridge_diagnostic_pass'])
        if sector_pass!=(gamma>0 and odd_margin>0):
            raise ValueError('sector-refined pass does not match both strict Ritz gaps')
        if bool(a.get('sector_refined_bridge_diagnostic_pass'))!=sector_pass:
            raise ValueError('top-level sector-refined pass mismatch')
        boundary=a.get('boundary',{})
        if 'resolvent_weighted_bound_diagnostic_pass' in residual:
            if abs(mp.mpf(residual['resolvent_Gamma'])-gamma)>tol:
                raise ValueError('resolvent Gamma is inconsistent with the Ritz gap')
            if residual.get('resolvent_evaluation_path')!='spectral_decomposition_of_even_complement':
                raise ValueError('producer weighted resolvent must use the spectral path')
            if residual.get('resolvent_weighted_bound_certification')!='finite_arbitrary_precision_diagnostic_not_interval_certified':
                raise ValueError('weighted resolvent certification class is misstated')
            rhs_norm=mp.mpf(residual['resolvent_rhs_norm'])
            rhs_defect=mp.mpf(residual['resolvent_rhs_norm_minus_r_abs'])
            if abs(rhs_defect-abs(rhs_norm-r))>tol or rhs_defect>tol*max(1,r):
                raise ValueError('weighted resolvent right-hand side is inconsistent with r')
            tau=residual.get('resolvent_weighted_tau')
            chordal=residual.get('resolvent_weighted_chordal_distance_bound')
            solve_residual=residual.get('resolvent_solve_residual_norm')
            scalar_upper=residual.get('resolvent_comparison_r_over_Gamma')
            signed_defect=residual.get('resolvent_tau_minus_r_over_Gamma')
            upper_defect=residual.get('resolvent_tau_le_r_over_Gamma_defect')
            if gamma>0:
                if any(value is None for value in (tau,chordal,solve_residual,scalar_upper,signed_defect,upper_defect)):
                    raise ValueError('positive Ritz gap requires weighted resolvent values')
                tau=mp.mpf(tau);solve_residual=mp.mpf(solve_residual)
                chordal=mp.mpf(chordal)
                scalar_upper=mp.mpf(scalar_upper);signed_defect=mp.mpf(signed_defect)
                upper_defect=mp.mpf(upper_defect);expected_upper=r/gamma
                expected_chordal=tau*mp.sqrt(2/(mp.sqrt(1+tau*tau)*(mp.sqrt(1+tau*tau)+1)))
                if abs(chordal-expected_chordal)>tol*max(1,abs(expected_chordal)):
                    raise ValueError('weighted chordal distance bound is inconsistent with tau')
                if tau<0 or abs(scalar_upper-expected_upper)>tol*max(1,abs(expected_upper)):
                    raise ValueError('weighted scalar comparison is inconsistent')
                if abs(signed_defect-(tau-scalar_upper))>tol*max(1,abs(scalar_upper)):
                    raise ValueError('weighted signed comparison defect is inconsistent')
                if abs(upper_defect-max(mp.mpf(0),signed_defect))>tol*max(1,abs(scalar_upper)):
                    raise ValueError('weighted upper comparison defect is inconsistent')
                tau_le=bool(signed_defect<=tol*max(1,abs(scalar_upper)))
                if residual.get('resolvent_tau_le_r_over_Gamma') is not tau_le:
                    raise ValueError('weighted tau comparison boolean is inconsistent')
                solve_ok=bool(solve_residual<=tol*max(1,rhs_norm))
            else:
                if any(value is not None for value in (tau,chordal,solve_residual,scalar_upper,signed_defect,upper_defect)):
                    raise ValueError('nonpositive Ritz gap cannot have weighted resolvent values')
                tau_le=False;solve_ok=False;tau=None;chordal=None
            weighted_pass=bool(sector_pass and tau_le and solve_ok and rhs_defect<=tol*max(1,r))
            if bool(residual['resolvent_weighted_bound_diagnostic_pass'])!=weighted_pass:
                raise ValueError('weighted resolvent pass boolean is inconsistent')
            if bool(a.get('resolvent_weighted_bound_diagnostic_pass'))!=weighted_pass:
                raise ValueError('top-level weighted resolvent pass mismatch')
            projected_delta=mp.mpf(boundary['projected_even_complement_delta_norm'])
            delta_norm=mp.mpf(boundary['delta_norm']);delta_value=mp.mpf(boundary['delta_kappa_abs'])
            if projected_delta<0 or projected_delta>delta_norm+tol:
                raise ValueError('projected boundary-functional norm is invalid')
            if tau is not None:
                reserve=delta_value-projected_delta*tau
                full_reserve=delta_value-delta_norm*tau
                chordal_full_reserve=delta_value-delta_norm*chordal
                if abs(mp.mpf(boundary['generic_reserve'])-reserve)>tol*max(1,abs(reserve)):
                    raise ValueError('projected weighted boundary reserve is inconsistent')
                if bool(boundary['generic_reserve_diagnostic_pass'])!=bool(weighted_pass and reserve>0):
                    raise ValueError('projected weighted boundary reserve boolean is inconsistent')
                if abs(mp.mpf(boundary['resolvent_full_delta_norm_reserve_legacy'])-full_reserve)>tol*max(1,abs(full_reserve)):
                    raise ValueError('full-norm weighted boundary reserve is inconsistent')
                if abs(mp.mpf(boundary['resolvent_full_delta_norm_reserve'])-chordal_full_reserve)>tol*max(1,abs(chordal_full_reserve)):
                    raise ValueError('full-norm chordal boundary reserve is inconsistent')
                if bool(boundary['resolvent_full_delta_norm_reserve_diagnostic_pass'])!=bool(weighted_pass and chordal_full_reserve>0):
                    raise ValueError('full-norm chordal boundary reserve boolean is inconsistent')
    evidence=p.get('determinant_convergence_evidence')
    if evidence in {'real_axis_eigenvalue_agreement','pointwise_real_axis','assumed_zero_table'}:
        raise ValueError('real-axis evidence is not locally uniform determinant convergence')
    if a.get('analytic_uniform_claim') and evidence!='locally_uniform_closed_substrips_with_rigorous_bounds':
        raise ValueError('analytic uniform claim lacks required evidence')
    if a['normalizations'].get('locked_transform_limit')!='Xi/4': raise ValueError('locked factor-four discrepancy not recorded')
    raw=a.get('raw_matrices')
    if not raw: raise ValueError('raw block matrices required')
    N=int(a['inputs']['N']);dps=int(a['inputs']['precision_decimal_digits']);dim=2*N+1
    required=('pole','archimedean_unsigned','prime_unsigned','Q_equals_pole_minus_arch_minus_prime')
    if any(k not in raw or len(raw[k])!=dim or any(len(row)!=dim for row in raw[k]) for k in required):
        raise ValueError('raw matrix dimensions/blocks invalid')
    reconstructed=blocks_split(a['inputs']['lambda'],N,dps)
    expected_prime=reconstructed[4];tol=mp.power(10,-max(10,dps//2))
    for i in range(dim):
      for j in range(dim):
        P=mp.mpf(raw['pole'][i][j]);A=mp.mpf(raw['archimedean_unsigned'][i][j]);R=mp.mpf(raw['prime_unsigned'][i][j]);Q=mp.mpf(raw['Q_equals_pole_minus_arch_minus_prime'][i][j])
        if abs(R-expected_prime[i,j])>tol:raise ValueError('prime block does not contain exact enumerated sum')
        if abs(Q-(P-A-R))>tol:raise ValueError('Q does not preserve pole-minus-arch-minus-prime signs')
    if 'sector_refined_bridge_diagnostic_pass' in residual:
        boundary=a.get('boundary',{})
        source=source_commutator_metrics(
            reconstructed[5],inversion(N),list(range(-N,N+1)),tol=tol)
        source_pass=bool(source['source_commutator_matrix_form_diagnostic_pass'])
        if bool(boundary.get('source_commutator_matrix_form_diagnostic_pass'))!=source_pass:
            raise ValueError('source commutator matrix-form boolean is inconsistent')
        if bool(a.get('source_commutator_matrix_form_diagnostic_pass'))!=source_pass:
            raise ValueError('top-level source commutator boolean is inconsistent')
        raw_beta=boundary.get('source_commutator_beta_modes_minusN_to_N')
        if not isinstance(raw_beta,list) or len(raw_beta)!=dim:
            raise ValueError('source commutator beta vector is missing')
        if any(abs(mp.mpf(raw_beta[i])-source['beta'][i])>tol for i in range(dim)):
            raise ValueError('source commutator beta vector is inconsistent')
        raw_defects=boundary.get('source_commutator_defects',{})
        for name,value in source['defects'].items():
            if name not in raw_defects or abs(mp.mpf(raw_defects[name])-value)>tol:
                raise ValueError('source commutator defect is inconsistent')
        if boundary.get('source_boundary_proof_reference')!=source['source_boundary_proof_reference']:
            raise ValueError('source boundary proof reference is inconsistent')
        if boundary.get('source_boundary_route_certification')!='finite_arbitrary_precision_diagnostic_not_interval_certified':
            raise ValueError('source boundary route certification is misstated')
        source_conclusion=bool(residual['sector_refined_bridge_diagnostic_pass'] and source_pass)
        if bool(boundary.get('source_simple_even_hypotheses_diagnostic_pass'))!=source_conclusion:
            raise ValueError('source simple-even diagnostic is inconsistent')
        if bool(boundary.get('source_boundary_nonzero_conditional_diagnostic_conclusion'))!=source_conclusion:
            raise ValueError('source boundary conclusion is inconsistent')


def tampered(a: dict, path: tuple[str,...], value):
    b=copy.deepcopy(a);cur=b
    for key in path[:-1]:cur=cur[key]
    cur[path[-1]]=value;return b
