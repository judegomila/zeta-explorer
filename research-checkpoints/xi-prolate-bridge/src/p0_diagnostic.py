#!/usr/bin/env python3
"""Proof-item-zero residual--gap diagnostic producer.

All outputs are finite numerical diagnostics.  Nothing here establishes an
unbounded lambda sequence or locally uniform determinant convergence.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import platform
import sys

import mpmath as mp

from prolate_state import (
    normalized_even_basis_values,
    projected_even_state,
    source_combination,
)
from sector_bridge import sector_refined_metrics
from source_boundary import source_commutator_metrics
from weil_matrix import blocks_direct, blocks_split, inversion, max_abs, parse_decimal


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T*A*y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i])**2 for i in range(x.rows)))


def _identity(n: int) -> mp.matrix:
    return mp.eye(n)


def _orthogonal_complement(unit: mp.matrix) -> mp.matrix:
    """Householder columns spanning unit^perp in real arithmetic."""
    n = unit.rows
    if n < 2:
        raise ValueError("complement requires dimension at least two")
    e0 = mp.matrix(n,1); e0[0] = 1
    sign = 1 if unit[0] >= 0 else -1
    v = unit + sign*e0
    H = _identity(n)-2*(v*v.T)/_dot(v,_identity(n),v)
    return H[:,1:n]


def _sector_bases(N: int) -> tuple[mp.matrix,mp.matrix]:
    d=2*N+1
    even=mp.matrix(d,N+1); odd=mp.matrix(d,N)
    even[N,0]=1
    for k in range(1,N+1):
        even[N-k,k]=1/mp.sqrt(2); even[N+k,k]=1/mp.sqrt(2)
        odd[N+k,k-1]=1/mp.sqrt(2); odd[N-k,k-1]=-1/mp.sqrt(2)
    return even,odd


def _serialize_real(x: mp.mpf, digits: int) -> str:
    return mp.nstr(mp.mpf(x),digits)


def _serialize_vector(x: mp.matrix, digits: int) -> list[str]:
    return [_serialize_real(x[i],digits) for i in range(x.rows)]


def _serialize_matrix(x: mp.matrix, digits: int) -> list[list[str]]:
    return [[_serialize_real(x[i,j],digits) for j in range(x.cols)] for i in range(x.rows)]


def _matrix_hash(Q: mp.matrix, digits: int) -> str:
    payload="\n".join(_serialize_real(Q[i,j],digits) for i in range(Q.rows) for j in range(Q.cols))
    return hashlib.sha256(payload.encode('ascii')).hexdigest()


def analyze_pilot(lambda_text: str, N: int, dps: int, prolate_basis_size: int) -> dict[str,object]:
    if N < 1:
        raise ValueError("pilot requires N>=1 for both inversion sectors")
    mp.mp.dps=dps
    lam=parse_decimal(lambda_text); L=2*mp.log(lam)

    direct=blocks_direct(lambda_text,N,dps)
    split=blocks_split(lambda_text,N,dps)
    modes,terms,pole,arch,prime,Q=direct
    path_defect=max_abs(Q-split[-1])
    J=inversion(N)
    source_boundary=source_commutator_metrics(Q,J,modes)

    h=source_combination(lambda_text,prolate_basis_size,dps,'recurrence')
    projection=projected_even_state(h,N)
    kappa=projection['kappa']
    q=_dot(kappa,Q,kappa)
    residual_vector=Q*kappa-q*kappa
    residual=_norm(residual_vector)

    complement=_orthogonal_complement(kappa)
    compressed=complement.T*Q*complement
    comp_evals,_=mp.eigsy(compressed)
    complement_floor=comp_evals[0]
    gap=complement_floor-q

    even,odd=_sector_bases(N)
    k_even=even.T*kappa
    even_complement=_orthogonal_complement(k_even)
    Q_even=even.T*Q*even
    even_evals,_=mp.eigsy(even_complement.T*Q_even*even_complement)
    Q_odd=odd.T*Q*odd
    odd_evals,_=mp.eigsy(Q_odd)
    even_floor=even_evals[0]
    odd_floor=odd_evals[0]
    even_gap=even_floor-q; odd_gap=odd_floor-q

    sector=sector_refined_metrics(Q,kappa,J)
    sector_c=sector['residual_direction_rayleigh_c']
    sector_ratio=sector['r_over_Delta_even']
    sector_ritz_ratio=sector['r_over_even_ritz_gap']
    sector_tau=sector['resolvent_weighted_tau']
    sector_chordal_bound=sector['resolvent_weighted_chordal_distance_bound']

    signed_blocks=[pole,-arch,-prime]
    block_names=['pole','archimedean_signed','prime_signed']
    block_data={}
    combined_check=mp.matrix(Q.rows,1)
    q_parts=[]
    for name,B in zip(block_names,signed_blocks):
        qb=_dot(kappa,B,kappa)
        rv=B*kappa-qb*kappa
        combined_check += rv
        q_parts.append(qb)
        block_data[name]={"rayleigh":_serialize_real(qb,dps),
                          "signed_residual_vector":_serialize_vector(rv,dps),
                          "separate_residual_norm":_serialize_real(_norm(rv),dps),
                          "operator_action_norm":_serialize_real(_norm(B*kappa),dps)}

    delta=mp.matrix([1/mp.sqrt(L)]*(2*N+1))
    delta_value=abs((delta.T*kappa)[0]); delta_norm=_norm(delta)
    projected_even_complement_delta_norm=_norm(even_complement.T*even.T*delta)
    ratio=residual/gap if gap>0 else mp.inf
    full_complement_reserve=delta_value-delta_norm*ratio if gap>0 else mp.ninf
    sector_reserve=(delta_value-delta_norm*sector_ritz_ratio
                    if sector_ritz_ratio is not None else mp.ninf)
    resolvent_weighted_reserve=(
        delta_value-projected_even_complement_delta_norm*sector_tau
        if sector_tau is not None else mp.ninf)
    resolvent_full_delta_norm_reserve=(delta_value-delta_norm*sector_tau
        if sector_tau is not None else mp.ninf)
    resolvent_chordal_full_delta_norm_reserve=(
        delta_value-delta_norm*sector_chordal_bound
        if sector_chordal_bound is not None else mp.ninf)

    full_evals,full_vecs=mp.eigsy(Q)
    ground=full_vecs[:,0]
    ground_overlap=abs((ground.T*kappa)[0])

    # Galerkin truncation audit at a larger basis, comparing intrinsic source
    # data and fixed physical sample values without importing stored states.
    larger=source_combination(lambda_text,prolate_basis_size+10,dps,'recurrence')
    sample_x=[lam*mp.mpf(j)/8 for j in range(0,9)]
    sample_defect=max(abs(h(x)-larger(x)) for x in sample_x)

    tolerance=mp.power(10,-max(12,dps//2))
    structural_diagnostic_pass=(max_abs(Q-Q.T)<=tolerance
        and max_abs(Q*J-J*Q)<=tolerance and _norm(J*kappa-kappa)<=tolerance)
    theorem_diagnostic_pass=bool(gap>0 and structural_diagnostic_pass)
    sector_diagnostic_pass=bool(
        sector['sector_refined_bridge_diagnostic_pass'] and structural_diagnostic_pass)
    resolvent_weighted_diagnostic_pass=bool(
        sector['resolvent_weighted_bound_diagnostic_pass']
        and structural_diagnostic_pass)
    source_commutator_diagnostic_pass=bool(
        source_boundary['source_commutator_matrix_form_diagnostic_pass']
        and structural_diagnostic_pass)
    source_simple_even_diagnostic_pass=bool(
        sector_diagnostic_pass and source_commutator_diagnostic_pass)

    return {
      "terminal_state":"P0_INVALIDATED",
      "invalidation_reason":"locked CCM-ZST-v1 equations (3.5),(7.1),(7.2) give Xi/4, not the Xi limit asserted by Lemmas 7.1/7.3",
      "claim_class":"DIAGNOSTIC",
      "analytic_uniform_claim":False,
      "inputs":{"lambda":lambda_text,"N":N,"precision_decimal_digits":dps,
                "prolate_even_legendre_basis_size":prolate_basis_size,
                "modes":modes,"L":_serialize_real(L,dps)},
      "normalizations":{"domain":"[-lambda,lambda] with Lebesgue measure; zero extension",
        "prolate_eigenfunctions":"L2 unit norm, sign positive at zero, source Hermite limit",
        "h_a4":_serialize_real(h.a4,dps),"h_a0_lambda":_serialize_real(h.a0,dps),
        "h_zero_integral_defect":_serialize_real(abs(h.integral()),dps),
        "arithmetic_transform":"E(h)(u)=u^(1/2) sum_{m>=1}h(mu)",
        "evenization":"k_plus=(k+Jk)/2","Fourier_mode_sign":"U_n uses exp(+2*pi*i*n*x/L)",
        "locked_transform_limit":"Xi/4","explicit_final_characteristic_repair":"multiply final characteristic function by 4"},
      "provenance":{"uses_assumed_real_zeta_zeros":False,"assumes_global_weil_positivity":False,
        "lambda_parameter_representation":"decimal_string","inversion_reflection_included":True,
        "prime_block_sign":"minus","determinant_convergence_evidence":"not_attempted"},
      "source_enumeration":{"prime_power_cutoff":"lambda^2","terms":[{"n":n,"Lambda":_serialize_real(v,dps)} for n,v in terms]},
      "matrix_checks":{"independent_assembly_max_abs_disagreement":_serialize_real(path_defect,dps),
        "hermitian_defect_max_abs":_serialize_real(max_abs(Q-Q.T),dps),
        "inversion_commutator_max_abs":_serialize_real(max_abs(Q*J-J*Q),dps),
        "matrix_decimal_hash":_matrix_hash(Q,dps)},
      "raw_matrices":{"pole":_serialize_matrix(pole,dps),"archimedean_unsigned":_serialize_matrix(arch,dps),
        "prime_unsigned":_serialize_matrix(prime,dps),"Q_equals_pole_minus_arch_minus_prime":_serialize_matrix(Q,dps)},
      "prolate_checks":{"h0_eigenvalue":_serialize_real(h.h0.eigenvalue,dps),
        "h4_eigenvalue":_serialize_real(h.h4.eigenvalue,dps),
        "larger_basis_sample_max_abs_defect":_serialize_real(sample_defect,dps),
        "comparison_sample_x":[_serialize_real(x,dps) for x in sample_x],
        "h_lambda_sample_values":[_serialize_real(h(x),dps) for x in sample_x]},
      "projection":{"state_norm":_serialize_real(projection['state_norm'],dps),
        "projected_norm":_serialize_real(projection['projected_norm'],dps),
        "projection_error":_serialize_real(projection['projection_error'],dps),
        "projection_error_method":projection['projection_error_method'],
        "projection_error_parseval_crosscheck":(_serialize_real(projection['projection_error_parseval_crosscheck'],dps)
          if projection['projection_error_parseval_crosscheck'] is not None else None),
        "projection_error_parseval_error_sq":_serialize_real(projection['projection_error_parseval_error_sq'],dps),
        "projection_error_squared_crosscheck_discrepancy":_serialize_real(projection['projection_error_squared_crosscheck_discrepancy'],dps),
        "projection_error_crosscheck_discrepancy":(_serialize_real(projection['projection_error_crosscheck_discrepancy'],dps)
          if projection['projection_error_crosscheck_discrepancy'] is not None else None),
        "logarithmic_breakpoints_t":[_serialize_real(t,dps) for t in projection['breakpoints']],
        "coefficients_modes_minusN_to_N":_serialize_vector(projection['coefficients'],dps),
        "kappa":_serialize_vector(kappa,dps),"inversion_even_defect":_serialize_real(_norm(J*kappa-kappa),dps)},
      "residual_gap":{"q":_serialize_real(q,dps),"combined_residual_vector_before_norm":_serialize_vector(residual_vector,dps),
        "r":_serialize_real(residual,dps),"complement_floor":_serialize_real(complement_floor,dps),
        "Delta":_serialize_real(gap,dps),"r_over_Delta":_serialize_real(ratio,dps) if gap>0 else None,
        "inversion_even_sector_floor":_serialize_real(even_floor,dps),"inversion_even_sector_gap":_serialize_real(even_gap,dps),
        "inversion_odd_sector_floor":_serialize_real(odd_floor,dps),"inversion_odd_sector_gap":_serialize_real(odd_gap,dps),
        "Delta_even":_serialize_real(sector['Delta_even'],dps),
        "r_over_Delta_even":_serialize_real(sector_ratio,dps) if sector_ratio is not None else None,
        "residual_direction_rayleigh_c":_serialize_real(sector_c,dps) if sector_c is not None else None,
        "two_dimensional_ritz_upper_u":_serialize_real(sector['two_dimensional_ritz_upper_u'],dps),
        "even_complement_floor_minus_ritz_upper":_serialize_real(sector['even_complement_floor_minus_ritz_upper'],dps),
        "r_over_even_ritz_gap":_serialize_real(sector_ritz_ratio,dps) if sector_ritz_ratio is not None else None,
        "odd_floor_minus_ritz_upper":_serialize_real(sector['odd_floor_minus_ritz_upper'],dps),
        "resolvent_Gamma":_serialize_real(sector['resolvent_Gamma'],dps),
        "resolvent_rhs_norm":_serialize_real(sector['resolvent_rhs_norm'],dps),
        "resolvent_rhs_norm_minus_r_abs":_serialize_real(sector['resolvent_rhs_norm_minus_r_abs'],dps),
        "resolvent_weighted_tau":(_serialize_real(sector_tau,dps)
          if sector_tau is not None else None),
        "resolvent_weighted_chordal_distance_bound":(
          _serialize_real(sector_chordal_bound,dps)
          if sector_chordal_bound is not None else None),
        "resolvent_solve_residual_norm":(_serialize_real(sector['resolvent_solve_residual_norm'],dps)
          if sector['resolvent_solve_residual_norm'] is not None else None),
        "resolvent_comparison_r_over_Gamma":(_serialize_real(sector['resolvent_comparison_r_over_Gamma'],dps)
          if sector['resolvent_comparison_r_over_Gamma'] is not None else None),
        "resolvent_tau_minus_r_over_Gamma":(_serialize_real(sector['resolvent_tau_minus_r_over_Gamma'],dps)
          if sector['resolvent_tau_minus_r_over_Gamma'] is not None else None),
        "resolvent_tau_le_r_over_Gamma_defect":(_serialize_real(sector['resolvent_tau_le_r_over_Gamma_defect'],dps)
          if sector['resolvent_tau_le_r_over_Gamma_defect'] is not None else None),
        "resolvent_tau_le_r_over_Gamma":sector['resolvent_tau_le_r_over_Gamma'],
        "resolvent_weighted_bound_certification":sector['resolvent_weighted_bound_certification'],
        "resolvent_evaluation_path":sector['resolvent_evaluation_path'],
        "resolvent_weighted_bound_diagnostic_pass":resolvent_weighted_diagnostic_pass,
        "sector_refined_bridge_diagnostic_pass":sector_diagnostic_pass,
        "full_ground_eigenvalue":_serialize_real(full_evals[0],dps),"full_second_eigenvalue":_serialize_real(full_evals[1],dps),
        "ground_comparison_overlap_abs":_serialize_real(ground_overlap,dps)},
      "residual_decomposition":{"identity":"(Q-q)kappa=sum_B (B-q_B I)kappa for B=P,-A,-R",
        "blocks":block_data,"combined_reassembly_defect":_serialize_real(_norm(combined_check-residual_vector),dps),
        "sum_block_rayleigh_minus_q_defect":_serialize_real(abs(mp.fsum(q_parts)-q),dps)},
      "boundary":{"delta_vector_convention":"L^(-1/2) sum_{|n|<=N} V_n",
        "delta_norm":_serialize_real(delta_norm,dps),"delta_kappa_abs":_serialize_real(delta_value,dps),
        "projected_even_complement_delta_norm":_serialize_real(projected_even_complement_delta_norm,dps),
        "source_commutator_beta_modes_minusN_to_N":_serialize_vector(source_boundary['beta'],dps),
        "source_commutator_defects":{
          key:_serialize_real(value,dps)
          for key,value in source_boundary['defects'].items()},
        "source_commutator_matrix_form_diagnostic_pass":source_commutator_diagnostic_pass,
        "source_boundary_proof_reference":source_boundary['source_boundary_proof_reference'],
        "source_boundary_route_certification":"finite_arbitrary_precision_diagnostic_not_interval_certified",
        "source_simple_even_hypotheses_diagnostic_pass":source_simple_even_diagnostic_pass,
        "source_boundary_nonzero_conditional_diagnostic_conclusion":source_simple_even_diagnostic_pass,
        "source_simple_even_hypotheses_full_complement_legacy":theorem_diagnostic_pass,
        "generic_reserve_ratio_convention":"|delta(kappa)|-||P_K delta||*tau, K=even intersection kappa-perp",
        "generic_reserve":(_serialize_real(resolvent_weighted_reserve,dps)
          if sector_tau is not None else None),
        "generic_reserve_diagnostic_pass":bool(resolvent_weighted_diagnostic_pass
          and resolvent_weighted_reserve>0),
        "resolvent_full_delta_norm_reserve_convention":"|delta(kappa)|-||delta||*resolvent_weighted_chordal_distance_bound",
        "resolvent_full_delta_norm_reserve":(
          _serialize_real(resolvent_chordal_full_delta_norm_reserve,dps)
          if sector_chordal_bound is not None else None),
        "resolvent_full_delta_norm_reserve_diagnostic_pass":bool(
          resolvent_weighted_diagnostic_pass
          and resolvent_chordal_full_delta_norm_reserve>0),
        "resolvent_full_delta_norm_reserve_legacy_convention":"|delta(kappa)|-||delta||*tau",
        "resolvent_full_delta_norm_reserve_legacy":(
          _serialize_real(resolvent_full_delta_norm_reserve,dps)
          if sector_tau is not None else None),
        "resolvent_full_delta_norm_reserve_legacy_diagnostic_pass":bool(
          resolvent_weighted_diagnostic_pass and resolvent_full_delta_norm_reserve>0),
        "ritz_gap_reserve_legacy_ratio_convention":"r/(even_complement_floor-two_dimensional_ritz_upper_u)",
        "ritz_gap_reserve_legacy":_serialize_real(sector_reserve,dps) if sector_ritz_ratio is not None else None,
        "ritz_gap_reserve_legacy_diagnostic_pass":bool(sector_diagnostic_pass and sector_reserve>0),
        "full_complement_reserve_legacy":_serialize_real(full_complement_reserve,dps) if gap>0 else None,
        "full_complement_reserve_legacy_diagnostic_pass":bool(gap>0 and full_complement_reserve>0)},
      "finite_residual_gap_hypotheses_diagnostic_pass":theorem_diagnostic_pass,
      "sector_refined_bridge_diagnostic_pass":sector_diagnostic_pass,
      "resolvent_weighted_bound_diagnostic_pass":resolvent_weighted_diagnostic_pass,
      "source_commutator_matrix_form_diagnostic_pass":source_commutator_diagnostic_pass,
      "limitations":["no interval/ball enclosure in this producer","finite Galerkin truncation only",
        "resolvent-weighted tau is a finite arbitrary-precision diagnostic, not an interval certificate",
        "no unbounded-sequence estimate","no locally uniform determinant convergence"],
      "runtime":{"python":sys.version.split()[0],"mpmath":mp.__version__,"platform":platform.platform()},
    }


def main() -> None:
    p=argparse.ArgumentParser()
    p.add_argument('--lambda',dest='lambda_text',required=True)
    p.add_argument('--N',type=int,required=True)
    p.add_argument('--dps',type=int,default=40)
    p.add_argument('--prolate-basis-size',type=int,default=30)
    p.add_argument('--output',type=Path,required=True)
    a=p.parse_args()
    result=analyze_pilot(a.lambda_text,a.N,a.dps,a.prolate_basis_size)
    from p0_policy import validate_p0_artifact
    validate_p0_artifact(result)
    text=json.dumps(result,indent=2,sort_keys=True,allow_nan=False)+'\n'
    a.output.parent.mkdir(parents=True,exist_ok=True); a.output.write_text(text)
    print(text,end='')


if __name__=='__main__': main()
