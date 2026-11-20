#!/bin/sh
set -eu
cd "$(dirname "$0")"

test "$(shasum -a 256 vendor/CCM-ZST-2511.22755v1.pdf | awk '{print $1}')" = "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
test "$(shasum -a 256 vendor/CCM-PROLATE-2310.18423v2.pdf | awk '{print $1}')" = "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e"
test "$(shasum -a 256 vendor/KRD-PSWF-2006.00427v2.pdf | awk '{print $1}')" = "7c56255db5bd6454e3fc926952052fe466ffd49c4961ad8206638dcac1dd39a0"
test "$(shasum -a 256 vendor/BBK-DPSWF-1905.08354v1.pdf | awk '{print $1}')" = "928759f7eebeeb59883ae2de305ebe8062f412c2ad0d275bb9ad4320c897ff6b"
test "$(shasum -a 256 vendor/FKS-PNT-2204.02588v3.pdf | awk '{print $1}')" = "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4"
test "$(shasum -a 256 vendor/SLEPIAN-PSWF-IV-1964.pdf | awk '{print $1}')" = "86efb6b69f405a046914f19c07161329b3f455a93a58467cc8107cfa4a135351"
test "$(shasum -a 256 vendor/EGIDI-SEELMANN-LS-2010.11901v2.tex.gz | awk '{print $1}')" = "8cad2763fb84f09e44c7309ebecffa295e8b193ba9e506749451b305b50adf5c"
test "$(gzip -dc vendor/EGIDI-SEELMANN-LS-2010.11901v2.tex.gz | shasum -a 256 | awk '{print $1}')" = "b459dd2a485b061edb1dc94e5313830acf6e12b2af07098e3f8642993e676907"
test "$(shasum -a 256 vendor/MTY-ZFR-2212.06867v1.pdf | awk '{print $1}')" = "127c32eb86d0aea264cc5b1ba96cc83243ef6b763451591e1560edaca1767300"
test "$(shasum -a 256 vendor/HSW-ZC-2107.06506v1.pdf | awk '{print $1}')" = "3fc4c89f49249924e61cb0d289d81559faed53fcbb838628ea32dc7ec6f89fbf"
test "$(shasum -a 256 vendor/PT-RH-VERIFY-2004.09765v1.pdf | awk '{print $1}')" = "3362f66af9fa9373977eee70e2282ec33989d5d8b97e0852df9e32cc25b52885"
test "$(shasum -a 256 vendor/BK-PSWF-1405.3676v2.pdf | awk '{print $1}')" = "9fe8dc39e4440200a29ff94bb640b693c06a176d28b7e38a468dce98afa7d7b8"

python3 -B - <<'PY'
import json
from pathlib import Path

required = {
    "actual_prolate_complex_sector_relative_mellin_factorization_proved": True,
    "actual_prolate_subturning_birkhoff_connection_theorem_proved": True,
    "actual_prolate_uniform_minimal_green_function_and_t_derivative_bound_proved": True,
    "subturning_factorization_unconditional_proved": True,
    "subturning_first_cherry_global_positive_support_wiener_uniform_closure_invalidated": True,
    "subturning_first_cherry_c_two_thirds_tv_lower_bound_proved": True,
    "subturning_first_cherry_band_local_closure_invalidated": False,
    "subturning_thirteen_order_weighted_c1_residual_bound_proved": True,
    "subturning_polynomial_green_loss_newton_correction_proved": True,
    "subturning_label04_factorization_one_t_derivative_proved": True,
    "adaptive_gonek_dyadic_shifted_zero_moment_selection_proved_under_rh": True,
    "adaptive_gonek_compact_physical_singleton_pw1_proved_under_rh": True,
    "literal_ceiling_compact_physical_pw1_proved": False,
    "adaptive_gonek_singleton_endpoint_frame_ny_proved": True,
    "adaptive_gonek_finite_gate_intersection_proved": False,
    "checkpoint147_focused_tests_passed": True,
    "checkpoint147_full_suite_recount_completed": False,
    "adaptive_gonek_same_ordinate_singleton_pw1_ny_proved_under_rh": True,
    "adaptive_gonek_singleton_endpoint_frame_C_E_O_L_proved_under_rh": True,
    "adaptive_gonek_adjacent_ideal_quotient_Omega_L_proved_under_rh": True,
    "adaptive_gonek_weighted_dyadic_formula_6_8_proved": False,
    "adaptive_gonek_literal_locked_origin_selection_proved": False,
    "checkpoint148_focused_tests_passed": True,
    "checkpoint148_full_suite_recount_completed": False,
    "adaptive_prolate_actual_endpoint_common_mode_defect_bound_proved_under_rh": True,
    "adaptive_prolate_far_endpoint_and_row_value_tail_bound_proved_under_rh": True,
    "adaptive_prolate_complete_exterior_selected_row_bound_proved_under_rh": True,
    "adaptive_prolate_cancellation_safe_newton_multiplier_transfer_proved_under_rh": True,
    "adaptive_prolate_actual_adjacent_quotient_Omega_L_proved_under_rh": True,
    "adaptive_prolate_eta_pr_squared_O_L_inverse_proved_under_rh": True,
    "adaptive_prolate_differentiated_far_endpoint_tail_bound_proved": False,
    "adaptive_prolate_finite_gate_intersection_proved": False,
    "adaptive_prolate_literal_ceiling_transfer_proved": False,
    "adaptive_prolate_reserve_saturation_gate_proved": False,
    "checkpoint149_focused_tests_passed": True,
    "checkpoint149_full_suite_recount_completed": False,
    "rh_actual_odd_ground_endpoint_zero_even_primitive_identity_proved": True,
    "rh_actual_odd_ground_primitive_rayleigh_christoffel_criterion_proved": True,
    "rh_actual_odd_ground_christoffel_criterion_implies_simple_even_boundary_proved": True,
    "positive_integer_evaluation_gram_simple_even_parity_nonimplication_proved": True,
    "rh_actual_odd_ground_christoffel_mean_orientation_proved": False,
    "adaptive_prolate_larger_row_absolute_relative_selection_proved_under_rh": True,
    "adaptive_prolate_q_r_selected_carrier_lower_scale_proved_under_rh": True,
    "adaptive_prolate_spectral_cluster_upper_bound_extended_to_O_L_schedule_proved_under_rh": True,
    "adaptive_prolate_derivative_saturation_exponential_divergence_proved_under_rh": True,
    "adaptive_prolate_bottom_cluster_sampling_energy_nonconcentration_proved_under_rh": True,
    "adaptive_prolate_derivative_sufficient_reserve_criterion_invalidated_under_rh": True,
    "adaptive_prolate_true_ground_inverse_fourth_moment_orientation_reduction_proved_under_rh": True,
    "adaptive_prolate_bottom_cluster_hilbert_angle_bound_proved": False,
    "adaptive_prolate_actual_even_reserve_orientation_proved": False,
    "checkpoint150_focused_tests_passed": True,
    "checkpoint150_full_suite_recount_completed": False,
    "rh_actual_odd_ground_boundary_functional_identity_proved": True,
    "rh_actual_odd_ground_christoffel_derivative_identity_proved": True,
    "rh_actual_odd_ground_source_commutator_scalar_reduction_proved": True,
    "rh_actual_even_ground_squared_commutator_scalar_identity_proved": True,
    "rh_actual_even_ground_second_christoffel_scalar_identity_proved": True,
    "rh_actual_even_ground_low_row_logarithmic_response_identity_proved": True,
    "rh_actual_even_ground_low_row_concavity_reduction_proved": True,
    "positive_N2_integer_evaluation_odd_christoffel_sign_nonimplication_proved": True,
    "positive_N2_source_cauchy_even_theta_orientation_nonimplication_proved": True,
    "rh_actual_ground_scalar_sign_orientation_proved": False,
    "rh_actual_even_ground_theta_upper_bound_proved": False,
    "rh_actual_even_ground_relative_row_deletion_stability_proved": False,
    "checkpoint151_focused_tests_passed": True,
    "checkpoint151_full_suite_recount_completed": False,
    "critical_near_nyquist_lerch_symbol_asymptotic_proved": True,
    "critical_two_branch_r_o_l_gain_collapse_proved": True,
    "critical_fixed_zero_moving_offset_log_gain_loss_proved": True,
    "critical_finite_mode_endpoint_nonzero_row_nullspace_proved": True,
    "critical_fixed_grid_first_poisson_alias_survival_proved": True,
    "critical_fixed_grid_first_poisson_alias_elimination_proved": False,
    "critical_actual_zero_energy_covariance_gap_proved": False,
    "critical_prime_power_divisor_shifted_convolution_gate_proved": False,
    "critical_density_prolate_transport_T_j_proved": True,
    "critical_density_prolate_normalized_defect_O_c_inverse2_proved": True,
    "critical_density_prolate_forward_minimal_green_O_sqrt_c_proved": True,
    "critical_density_prolate_critical_line_connection_proved": True,
    "critical_density_prolate_positive_leading_source_multiplier_proved": True,
    "critical_density_prolate_relative_connection_error_O_c_inverse_half_proved": True,
    "critical_density_prolate_operator_relative_stokes_transfer_proved": False,
    "critical_density_prolate_supercritical_abel_tail_t_ge_c_proved": True,
    "checkpoint152_focused_tests_passed": True,
    "checkpoint152_full_suite_recount_completed": False,
    "adaptive_critical_exact_carrier_tangent_same_zero_covariance_proved_under_rh": True,
    "adaptive_critical_same_ordinate_log_L_squared_gain_proved_under_rh": True,
    "adaptive_critical_same_ordinate_absolute_row_floor_proved_under_rh": True,
    "supercritical_full_source_abel_tail_from_0p9c_exp_2c_over5_proved": True,
    "supercritical_full_source_abel_tail_from_c_exp_c_over2_proved": True,
    "supercritical_full_source_arbitrary_real_lambda_periodization_proved": True,
    "supercritical_full_source_carrier_safe_sampled_row_proved": True,
    "adaptive_critical_actual_one_cutoff_scalar_transfer_proved_under_rh": True,
    "adaptive_critical_actual_quotient_Omega_log_L_squared_proved_under_rh": True,
    "adaptive_critical_eta_pr_squared_O_log_L_inverse2_proved_under_rh": True,
    "adaptive_critical_literal_ceiling_transfer_proved": False,
    "adaptive_critical_finite_gate_synchronization_proved": False,
    "checkpoint153_focused_tests_passed": True,
    "checkpoint153_full_suite_recount_completed": False,
    "adaptive_critical_varying_density_odd_halfgrid_literal_ceiling_proved_under_rh": True,
    "adaptive_critical_odd_halfgrid_tangent_filter_stability_proved_under_rh": True,
    "adaptive_critical_odd_halfgrid_actual_scalar_transfer_proved_under_rh": True,
    "adaptive_critical_prescribed_fixed_density_literal_ceiling_proved_under_rh": False,
    "adaptive_critical_old_gevrey_literal_ceiling_transfer_proved_under_rh": False,
    "critical_actual_low_zero_row_nullity_lower_bound_proved_under_rh": True,
    "critical_low_zero_nullspace_wrong_minimax_direction_barrier_proved_under_rh": True,
    "positive_N2_paired_real_evaluation_odd_ground_nonimplication_proved": True,
    "critical_true_odd_ground_row_deletion_parity_sufficient_criterion_proved_under_rh": True,
    "critical_true_even_ground_row_deletion_reserve_sufficient_criterion_proved_under_rh": True,
    "positive_source_cauchy_scalar_quotient_uniform_reserve_nonimplication_proved": True,
    "critical_actual_primitive_determinant_Delta_N_positive_proved_under_rh": False,
    "critical_actual_shifted_sector_margin_Sigma_N_positive_proved_under_rh": False,
    "critical_actual_true_ground_reserve_proved_under_rh": False,
    "critical_actual_zeta_finite_gate_failure_proved_under_rh": False,
    "checkpoint154_focused_tests_passed": True,
    "checkpoint154_full_suite_recount_completed": False,
    "critical_odd_ground_mixed_cofactor_bordered_determinant_equivalence_proved_under_rh": True,
    "critical_odd_ground_christoffel_geronimus_derivative_equivalence_proved_under_rh": True,
    "critical_odd_ground_origin_atom_constant_one_identity_proved_under_rh": True,
    "critical_odd_ground_mixed_vandermonde_alternating_expansion_proved_under_rh": True,
    "positive_growing_evaluation_gram_odd_ground_cofactor_sign_nonimplication_proved": True,
    "critical_actual_odd_ground_mixed_vandermonde_cofactor_sign_proved_under_rh": False,
    "critical_ground_negative_sobolev_support_sufficient_criteria_proved_under_rh": True,
    "positive_source_cauchy_negative_sobolev_ground_control_nonimplication_proved": True,
    "positive_integer_evaluation_gram_negative_sobolev_ground_control_nonimplication_proved": True,
    "hsw_count_negative_sobolev_ground_control_nonimplication_proved": True,
    "critical_actual_ground_negative_sobolev_lower_bound_proved_under_rh": False,
    "checkpoint155_focused_tests_passed": True,
    "checkpoint155_full_suite_recount_completed": False,
    "unconditional_natural_halfgrid_cross_root_cofinal_schedule_proved": True,
    "unconditional_natural_halfgrid_hsw_phase_good_subsequence_proved": True,
    "natural_halfgrid_hsw_certified_rounding_scale_N_o_lambda_L_proved": True,
    "natural_halfgrid_cross_root_projective_schedule_rates_proved": True,
    "natural_halfgrid_gate_restricted_alignment_average_sufficiency_proved": True,
    "unconditional_critical_halfgrid_hsw_phase_good_schedule_proved": False,
    "unconditional_gevrey_halfgrid_hsw_phase_good_schedule_proved": False,
    "natural_halfgrid_actual_gate_restricted_alignment_average_bound_proved": False,
    "cross_root_even_simple_line_complement_reduction_proved": True,
    "cross_root_even_multiplicity_safe_canonical_projector_reduction_proved": True,
    "cross_root_projective_alignment_signed_response_equivalence_proved": True,
    "cross_root_global_parity_odd_shift_simple_boundary_true_reserve_not_required_proved": True,
    "positive_padded_source_cauchy_projective_alignment_nonimplication_proved": True,
    "checkpoint153_155_scalar_inputs_cross_root_projective_alignment_proved": False,
    "checkpoint156_focused_tests_passed": True,
    "checkpoint156_full_suite_recount_completed": False,
    "first_zero_support_gap_exact_carrier_hypergeometric_statistics_proved": True,
    "first_zero_support_gap_count_root_location_free_weight_alignment_nonimplication_proved": True,
    "first_zero_support_gap_actual_zeta_mixed_cofactor_negative_proved_under_rh": False,
    "natural_crossroot_codimension_two_projector_gram_identity_proved": True,
    "natural_crossroot_multiplicity_safe_weighted_cofactor_equivalence_proved": True,
    "natural_crossroot_simple_complete_source_inverse_response_equivalence_proved": True,
    "natural_crossroot_weighted_projector_average_selection_sufficiency_proved": True,
    "natural_crossroot_actual_arithmetic_weighted_projector_average_bound_proved": False,
    "natural_crossroot_finite_good_set_nonempty_proved": False,
    "natural_crossroot_dyadic_total_visibility_positive_proved": False,
    "checkpoint157_focused_tests_passed": True,
    "checkpoint157_full_suite_recount_completed": False,
    "natural_halfgrid_hsw_even_shell_covariance_factorization_proved_under_rh": True,
    "natural_halfgrid_hsw_frozen_shell_even_complement_floor_zero_proved_under_rh": True,
    "natural_halfgrid_hsw_phase_scalar_to_complete_even_frame_nonimplication_proved": True,
    "natural_halfgrid_complete_signed_source_covariance_to_alignment_reduction_proved": True,
    "natural_halfgrid_actual_complete_signed_projected_covariance_gate_proved": False,
    "natural_halfgrid_actual_complete_signed_relative_schur_average_bound_proved": False,
    "natural_outer_shell_actual_even_source_polylog_prefix_mean_square_bound_proved": True,
    "natural_outer_shell_simple_ground_adaptive_inverse_response_identity_proved": True,
    "natural_outer_shell_raw_prefix_to_weighted_inverse_spread_nonimplication_proved": True,
    "natural_outer_shell_actual_gate_weighted_inverse_spread_bound_proved": False,
    "checkpoint158_focused_tests_passed": True,
    "checkpoint158_full_suite_recount_completed": False,
    "natural_gevrey_odd_halfgrid_adjacent_projection_error_exponential_class_proved": True,
    "natural_gevrey_complete_sampled_remainder_shift_rayleigh_residual_exponential_class_proved": True,
    "natural_gevrey_temple_davis_kahan_relative_gap_alignment_reduction_proved": True,
    "natural_gevrey_absolute_data_to_projective_orientation_nonimplication_proved": True,
    "natural_gevrey_actual_relative_gap_and_canonical_projector_orientation_proved": False,
    "natural_adjugate_scale_free_null_projector_identity_proved": True,
    "natural_adjugate_positive_second_plucker_bordered_determinant_identity_proved": True,
    "natural_adjugate_source_displacement_two_inverse_christoffel_generator_reduction_proved": True,
    "natural_adjugate_inverse_christoffel_positivity_uniform_bound_nonimplication_proved": True,
    "natural_adjugate_simple_branch_anchor_weight_automatic_nonvanishing_proved": True,
    "natural_adjugate_actual_gate_weighted_normalized_plucker_covariance_bound_proved": False,
    "checkpoint159_focused_tests_passed": True,
    "checkpoint159_full_suite_recount_completed": False,
    "natural_centered_gate_simple_ground_axis_root_eta_free_normalization_proved": True,
    "natural_centered_gate_affine_source_exact_ritz_ratio_r_zero_closure_proved": True,
    "natural_centered_gate_anchor_cofactor_count_characterization_proved": True,
    "natural_centered_gate_cubic_moment_determinant_threshold_reduction_proved": True,
    "natural_centered_gate_source_cauchy_nonemptiness_eta_visibility_nonimplications_proved": True,
    "natural_centered_gate_actual_cofinal_good_set_and_eta_free_covariance_proved": False,
    "natural_complete_source_centered_scalar_cancellation_signed_gate_reduction_proved": True,
    "natural_complete_source_rank_deficit_kappa_deflated_coframe_upper_obstruction_proved_under_rh": True,
    "natural_complete_source_one_sided_anchor_bound_gate_failure_nonimplication_proved": True,
    "natural_complete_source_off_rh_zero_gram_loewner_nonimplication_proved": True,
    "natural_complete_source_actual_centered_gate_proved": False,
    "checkpoint160_focused_tests_passed": True,
    "checkpoint160_full_suite_recount_completed": False,
    "halfgrid_gevrey_roundable_schedule_actual_projection_scalar_residual_R_over_L_class_proved": True,
    "halfgrid_gevrey_general_kappa_deflated_coframe_exponent_and_optimizer_proved_under_rh": True,
    "halfgrid_gevrey_roundable_uniform_coframe_exponent_mismatch_proved_under_rh": True,
    "halfgrid_gevrey_bridge_ratio_near_quadratic_rounding_escape_nonimplication_proved": True,
    "halfgrid_gevrey_one_sided_q_and_off_rh_positive_gram_nonimplications_proved": True,
    "halfgrid_gevrey_actual_centered_gate_or_gate_failure_proved": False,
    "natural_multiple_ground_axis_rooted_cone_selector_closure_nonselection_proved": True,
    "natural_multiple_ground_coordinate_shell_qualitative_visible_selection_proved": True,
    "natural_multiple_ground_shell_average_low_projective_tail_transfer_reduction_proved": True,
    "natural_multiple_ground_adjacent_cutoff_rank_obstruction_trace_nonnecessity_proved": True,
    "natural_multiple_ground_actual_low_visibility_quantitative_selector_rate_proved": False,
    "checkpoint161_focused_tests_passed": True,
    "checkpoint161_full_suite_recount_completed": False,
    "natural_projected_anchor_raw_secular_coefficient_recurrence_proved": True,
    "natural_projected_anchor_shifted_routh_hurwitz_collar_criterion_proved": True,
    "natural_projected_anchor_relative_endpoint_moment_rouche_reduction_proved": True,
    "natural_projected_anchor_checkerboard_flat_jet_prescribed_collar_nonimplication_proved": True,
    "natural_projected_anchor_high_shell_endpoint_jet_stability_nonimplication_proved": True,
    "natural_projected_anchor_actual_shrinking_collar_routh_margin_proved": False,
    "natural_direct_bottom_projector_eta_free_overlap_alignment_reduction_proved": True,
    "natural_direct_bottom_projector_global_adjugate_gram_ratio_proved": True,
    "natural_direct_bottom_projector_multiple_coordinate_selector_reduction_proved": True,
    "natural_direct_bottom_projector_analytic_perron_trace_sufficiency_nonimplications_proved": True,
    "natural_direct_bottom_projector_actual_anchor_diagonal_source_cauchy_nonimplication_proved": True,
    "natural_direct_bottom_projector_actual_relative_cofactor_orientation_rate_proved": False,
    "checkpoint162_focused_tests_passed": True,
    "checkpoint162_full_suite_recount_completed": False,
    "jensen_unshifted_classical_xi_limit_proved": True,
    "jensen_wedge_shift_to_degree_ratio_zero_proved": True,
    "jensen_wedge_origin_diagonal_exponential_gaussian_limit_proved": True,
    "jensen_wedge_centered_nonzero_entire_limit_excluded": True,
    "jensen_wedge_almost_total_derivative_prefix_loss_proved": True,
    "jensen_reverse_integration_hyperbolicity_shortcut_invalidated": True,
    "jensen_inverse_shift_multiplier_hyperbolicity_proved": False,
    "jensen_wedge_unshifted_hyperbolicity_transfer_proved": False,
    "cutoff_free_prolate_anchor_graph_domain_scalar_residual_transfer_proved": True,
    "cutoff_free_prolate_domain_exhaustion_norm_resolvent_oscillator_obstruction_proved": True,
    "cutoff_free_prolate_full_ground_projector_residual_inequality_proved": True,
    "cutoff_free_prolate_nonvanishing_full_ground_overlap_implies_rh_proved": True,
    "cutoff_free_prolate_rh_false_forces_halfgrid_overlap_zero_proved": True,
    "cutoff_free_prolate_even_bottom_parity_ordering_nonimplication_proved": True,
    "cutoff_free_prolate_relative_alignment_spectral_isolation_reduction_proved": True,
    "cutoff_free_prolate_actual_full_ground_overlap_or_isolation_proved": False,
    "checkpoint163_focused_tests_passed": True,
    "checkpoint163_full_suite_recount_completed": False,
    "cutoff_free_multi_anchor_bottom_projector_inequality_proved": True,
    "cutoff_free_multi_anchor_operator_frame_reduction_proved": True,
    "cutoff_free_label4_explicit_residual_envelope_proved": True,
    "cutoff_free_multi_anchor_residual_weighted_correlation_implies_rh_proved": True,
    "cutoff_free_multi_anchor_rank_one_load_resolvent_residue_identities_proved": True,
    "cutoff_free_multi_anchor_paired_translate_translation_frame_obstruction_proved": True,
    "cutoff_free_multi_anchor_phase_volume_shannon_capture_mismatch_proved": True,
    "cutoff_free_actual_multi_anchor_ground_frame_or_phase_volume_capture_proved": False,
    "actual_phase_volume_centered_pnt_stieltjes_split_proved": True,
    "actual_phase_volume_continuous_pnt_main_polynomial_bound_proved": True,
    "actual_phase_volume_bounded_logarithmic_remainder_sufficiency_proved": True,
    "actual_phase_volume_high_time_centered_remainder_reduction_proved": True,
    "actual_phase_volume_pinned_pnt_short_time_control_proved": True,
    "actual_phase_volume_mean_square_higher_moment_nonclosure_proved": True,
    "actual_phase_volume_centered_remainder_reverse_equivalence_proved": False,
    "actual_phase_volume_centered_high_time_remainder_bound_proved": False,
    "cutoff_free_weighted_radical_coframe_minimum_defect_right_inverse_proved": True,
    "cutoff_free_weighted_radical_operator_synthesis_no_dimension_loss_proved": True,
    "cutoff_free_weighted_radical_principal_angle_hard_prefix_floor_proved": True,
    "cutoff_free_weighted_radical_krd_shannon_stopping_line_proved": True,
    "cutoff_free_weighted_radical_explicit_right_inverse_approximation_criterion_proved": True,
    "cutoff_free_weighted_radical_orientation_countermodel_proved": True,
    "cutoff_free_weighted_radical_uniform_graph_tail_transfer_proved": True,
    "cutoff_free_actual_weighted_radical_coframe_capture_rate_proved": False,
    "checkpoint164_focused_tests_passed": True,
    "checkpoint164_full_suite_recount_completed": False,
    "cutoff_free_uniform_radical_locked_m2400_margin_proved": True,
    "cutoff_free_uniform_radical_polynomial_residual_constant_proved": True,
    "cutoff_free_uniform_radical_actual_normalized_capture_lower_bound_proved": False,
    "cutoff_free_full_source_even_zero_integral_adjoint_formula_proved": True,
    "cutoff_free_full_source_prolate_rank_one_capture_formula_proved": True,
    "cutoff_free_full_source_ground_residual_evacuation_bound_proved": True,
    "cutoff_free_full_source_exact_arithmetic_coercivity_countermodel_proved": True,
    "cutoff_free_full_source_actual_near_shannon_capture_lower_bound_proved": False,
    "actual_centered_remainder_prime_fourth_moment_lower_bound_proved": True,
    "actual_centered_remainder_high_time_near_one_upper_target_obstruction_proved": True,
    "actual_centered_remainder_actual_phase_volume_lower_bound_proved": False,
    "actual_centered_remainder_all_alpha_upper_target_obstruction_proved": False,
    "cutoff_free_dense_mixed_prefix_density_proved": True,
    "cutoff_free_dense_mixed_exact_bridge_cross_grams_proved": True,
    "cutoff_free_dense_mixed_uniform_graph_tail_transfer_proved": True,
    "cutoff_free_dense_mixed_modal_defect_residual_exponential_lower_bound_proved": True,
    "cutoff_free_dense_mixed_two_row_bump_aware_metric_proved": True,
    "cutoff_free_dense_mixed_scalar_normalized_angle_stopping_line_obstructed": True,
    "cutoff_free_dense_mixed_augmented_weighted_stopping_line_reduction_proved": True,
    "cutoff_free_dense_mixed_actual_augmented_weighted_decay_proved": False,
    "cutoff_free_bridge_rank_one_innovation_decomposition_proved": True,
    "cutoff_free_bridge_explicit_schur_scalar_shear_invariance_proved": True,
    "cutoff_free_bridge_minimum_defect_theta_elimination_criterion_proved": True,
    "cutoff_free_bridge_kappa_quantitative_bulk_floor_proved": True,
    "cutoff_free_bridge_codimension_one_floor_nullity_two_obstruction_proved": True,
    "cutoff_free_bridge_actual_leverage_scalar_lower_bound_proved": False,
    "cutoff_free_bridge_actual_phase_bulk_elimination_proved": False,
    "checkpoint165_focused_tests_passed": True,
    "checkpoint165_full_suite_recount_completed": False,
    "actual_centered_remainder_normalized_prime_third_moment_vanishing_proved": True,
    "actual_centered_remainder_below_unit_normalized_positive_excess_proved": True,
    "actual_centered_remainder_fixed_alpha_above_half_upper_target_obstruction_proved": True,
    "actual_centered_remainder_alpha_at_or_below_half_upper_target_obstruction_proved": False,
    "checkpoint166_focused_tests_passed": True,
    "checkpoint166_full_suite_recount_completed": False,
    "cutoff_free_bridge_ordinary_source_innovation_formula_proved": True,
    "cutoff_free_bridge_defect_orthogonal_representative_uniform_norm_proved": True,
    "cutoff_free_bridge_source_defect_prefactor_favorable_lower_bound_proved": True,
    "cutoff_free_bridge_mixed_adjoint_tail_threshold_equivalence_proved": True,
    "cutoff_free_bridge_mixed_adjoint_tail_polynomial_reserve_sufficient_floor_proved": True,
    "cutoff_free_bridge_codimension_one_kappa_branch_separation_proved": True,
    "cutoff_free_bridge_literal_adjoint_tail_gate_nonimplication_proved": True,
    "cutoff_free_bridge_actual_mixed_adjoint_tail_polynomial_reserve_proved": False,
    "cutoff_free_bridge_actual_missed_line_nonvanishing_proved": False,
    "checkpoint167_focused_tests_passed": True,
    "checkpoint167_full_suite_recount_completed": False,
    "actual_centered_remainder_long_block_gaussian_moments_through_degree_two_k_proved": True,
    "actual_centered_remainder_long_block_hermite_positive_excess_below_rho_k_proved": True,
    "actual_centered_remainder_fixed_alpha_above_k4_hermite_threshold_upper_target_obstruction_proved": True,
    "actual_centered_remainder_integer_long_block_k4_threshold_optimality_proved": True,
    "actual_centered_remainder_original_x2_first_four_gaussian_moment_level_one_nonimplication_proved": True,
    "actual_centered_remainder_alpha_at_or_below_k4_hermite_threshold_upper_target_obstruction_proved": False,
    "cutoff_free_multiplier_dangerous_normalized_prolate_capture_gram_formula_proved": True,
    "cutoff_free_multiplier_dangerous_complete_bottom_multiplicity_obstruction_proved": True,
    "cutoff_free_actual_multiplier_physical_dangerous_angle_bound_proved": True,
    "cutoff_free_multiplier_dangerous_prolate_cross_angle_triangle_reduction_proved": True,
    "cutoff_free_multiplier_dangerous_literal_edge_cross_angle_nonimplication_proved": True,
    "cutoff_free_actual_multiplier_dangerous_prolate_cross_angle_lower_bound_proved": False,
    "cutoff_free_actual_complete_bottom_multiplicity_safe_bound_proved": False,
    "cutoff_free_multiplier_dangerous_actual_bridge_gate_proved": False,
    "checkpoint168_focused_tests_passed": True,
    "checkpoint168_full_suite_recount_completed": False,
    "actual_centered_remainder_fractional_block_gaussian_moment_ceiling_floor_two_s_proved": True,
    "actual_centered_remainder_fractional_block_macroscopic_ui_index_floor_s_proved": True,
    "actual_centered_remainder_fractional_odd_shelf_subtarget_lower_bound_proved": True,
    "actual_centered_remainder_fractional_odd_shelf_moment_support_nonimplication_proved": True,
    "actual_centered_remainder_real_exponent_hierarchy_k4_required_scale_optimality_proved": True,
    "actual_centered_remainder_fractional_odd_shelf_required_upper_target_obstruction_proved": False,
    "actual_centered_remainder_shifted_mixed_moment_kernel_formula_proved": True,
    "actual_centered_remainder_first_missing_odd_fixed_shift_reduction_proved": True,
    "actual_centered_remainder_top_even_growing_shift_band_reduction_proved": True,
    "actual_centered_remainder_odd_moment_without_top_ui_nonimplication_proved": True,
    "actual_centered_remainder_first_missing_odd_shifted_correlation_bound_proved": False,
    "actual_centered_remainder_next_even_top_moment_ui_bound_proved": False,
    "cutoff_free_actual_dangerous_multiplier_support_envelope_proved": True,
    "cutoff_free_actual_dangerous_projector_paley_wiener_regularity_proved": True,
    "cutoff_free_literal_adjoint_breakpoint_endpoint_jet_jump_formula_proved": True,
    "cutoff_free_actual_dangerous_adjoint_bv_prolate_capture_sufficient_condition_proved": True,
    "cutoff_free_actual_dangerous_safe_piece_cancellation_obstruction_proved": True,
    "cutoff_free_actual_dangerous_buffered_commutator_bound_proved": True,
    "cutoff_free_actual_dangerous_fixed_lambda_qualitative_prefix_capture_proved": True,
    "cutoff_free_actual_dangerous_near_shannon_prefix_capture_proved": False,
    "cutoff_free_actual_dangerous_direct_bottom_gram_bridge_gate_proved": False,
    "checkpoint169_focused_tests_passed": True,
    "checkpoint169_full_suite_recount_completed": False,
    "cutoff_free_actual_dangerous_endpoint_jet_jump_profile_formula_proved": True,
    "cutoff_free_actual_dangerous_endpoint_jet_additive_prolate_gram_proved": True,
    "cutoff_free_actual_dangerous_sharpened_derivative_trace_bound_proved": True,
    "cutoff_free_actual_dangerous_finite_jet_observability_certificate_proved": True,
    "cutoff_free_actual_dangerous_profile_prefix_rank_obstruction_proved": True,
    "cutoff_free_actual_dangerous_bottom_normalized_profile_safe_cancellation_identity_proved": True,
    "cutoff_free_actual_dangerous_zero_jet_residual_bv_bound_proved": True,
    "cutoff_free_actual_dangerous_near_shannon_endpoint_observability_rate_proved": False,
    "cutoff_free_actual_dangerous_near_shannon_profile_singular_value_rate_proved": False,
    "cutoff_free_actual_dangerous_safe_cross_reserve_proved": False,
    "actual_centered_remainder_top_even_near_band_positive_core_lower_bound_proved": True,
    "actual_centered_remainder_top_even_complementary_global_cancellation_necessity_proved": True,
    "actual_centered_remainder_top_even_signed_global_cancellation_proved": False,
    "actual_phase_volume_full_prime_power_digamma_two_sided_sandwich_proved": True,
    "actual_phase_volume_long_block_normalized_threshold_s_minus_kappa_proved": True,
    "actual_phase_volume_long_block_hermite_conditional_lower_bound_proved": True,
    "actual_phase_volume_fractional_odd_shelf_subtarget_lower_bound_proved": True,
    "actual_phase_volume_lower_bound_to_negative_index_nonimplication_proved": True,
    "actual_phase_volume_standard_schedule_macroscopic_hermite_transfer_proved": False,
    "actual_phase_volume_lower_bound_to_negative_index_reverse_implication_proved": False,
    "checkpoint170_focused_tests_passed": True,
    "checkpoint170_full_suite_recount_completed": False,
    "cutoff_free_one_direction_full_bottom_projector_ratio_identity_proved": True,
    "cutoff_free_one_direction_weighted_largest_capture_bound_proved": True,
    "cutoff_free_one_direction_hilbert_schmidt_trace_capture_bound_proved": True,
    "cutoff_free_one_direction_largest_capture_strictly_weaker_than_full_coframe_proved": True,
    "cutoff_free_one_direction_actual_adjoint_supremum_formula_proved": True,
    "cutoff_free_one_direction_bridge_contrast_stopping_line_proved": True,
    "cutoff_free_odd_pole_birman_schwinger_bridge_contrast_nonimplication_proved": True,
    "cutoff_free_one_direction_actual_weighted_ground_capture_rate_proved": False,
    "cutoff_free_actual_missed_line_bridge_contrast_lower_bound_proved": False,
    "cutoff_free_ground_high_fourier_localization_bound_proved": True,
    "cutoff_free_ground_effective_dimension_exp_O_lambda_log_lambda_proved": True,
    "cutoff_free_normalized_full_source_isometry_proved": True,
    "cutoff_free_prolate_prefix_rank_kernel_proved": True,
    "cutoff_free_full_source_floor_prefix_capture_nonimplication_proved": True,
    "cutoff_free_source_cauchy_cofactor_weight_formula_proved": True,
    "cutoff_free_source_cauchy_cyclicity_analytic_rate_nonimplication_proved": True,
    "cutoff_free_parity_complete_residual_weight_saturation_nonimplication_proved": True,
    "cutoff_free_actual_low_band_to_prolate_prefix_capture_rate_proved": False,
    "cutoff_free_actual_ground_overlap_exp_minus_o_lambda_squared_proved": False,
    "cutoff_free_actual_quantitative_ground_cofactor_rate_proved": False,
    "checkpoint171_focused_tests_passed": True,
    "checkpoint171_full_suite_recount_completed": False,
    "actual_mixed_bridge_fixed_label_pole_row_asymptotic_proved": True,
    "actual_mixed_bridge_limiting_profile_strict_positivity_proved": True,
    "actual_mixed_bridge_exact_pole_axis_feshbach_overlap_identity_proved": True,
    "actual_mixed_bridge_nonpole_resolvent_inverse_positivity_nonimplication_proved": True,
    "actual_mixed_bridge_transverse_resolvent_cancellation_lower_bound_proved": False,
    "actual_mixed_bridge_bottom_projector_floor_proved": False,
    "actual_dirichlet_centered_schatten_exceptional_rank_bound_proved": True,
    "actual_dirichlet_exceptional_space_quadratic_floor_proved": True,
    "actual_dirichlet_same_shell_coordinate_exception_threshold_proved": True,
    "actual_dirichlet_fixed_s_two_normalized_half_scale_proved": True,
    "actual_dirichlet_moment_length_dangerous_space_method_obstruction_proved": True,
    "actual_dirichlet_O_lambda_squared_dangerous_space_bound_proved": False,
    "actual_dirichlet_dangerous_space_source_angle_proved": False,
    "cutoff_free_commuting_filter_bottom_row_residual_atom_identity_proved": True,
    "cutoff_free_commuting_filter_certified_envelope_no_improvement_proved": True,
    "cutoff_free_low_fourier_mobius_unweighted_capture_proved": True,
    "cutoff_free_commuting_filter_one_direction_pass_proved": False,
    "cutoff_free_low_fourier_mobius_defect_relative_residual_proved": False,
    "checkpoint172_focused_tests_passed": True,
    "checkpoint172_full_suite_recount_completed": False,
    "actual_mixed_bridge_transverse_gap_sandwich_proved": True,
    "actual_mixed_bridge_birman_schwinger_normalization_identity_proved": True,
    "actual_mixed_bridge_denominator_free_energy_alternative_proved": True,
    "actual_mixed_bridge_exact_cancellation_energy_threshold_proved": True,
    "actual_mixed_bridge_mixed_resolvent_overlap_identity_proved": True,
    "actual_mixed_bridge_diagonal_spectral_measure_phase_nonimplication_proved": True,
    "actual_mixed_bridge_literal_even_source_adjoint_formula_proved": True,
    "actual_mixed_bridge_generalized_harmonic_row_source_formula_proved": True,
    "cutoff_free_actual_radical_xi_principal_ideal_proved": True,
    "cutoff_free_actual_radical_xi_ideal_operation_preservation_proved": True,
    "cutoff_free_actual_radical_coordinate_divisor_break_obstruction_proved": True,
    "cutoff_free_actual_radical_divisor_break_bulk_residual_identity_proved": True,
    "cutoff_free_actual_radical_finite_window_xi_tail_factorization_proved": True,
    "cutoff_free_actual_radical_translation_tail_dichotomy_proved": True,
    "cutoff_free_actual_radical_boundary_safe_translation_frame_upper_bound_proved": True,
    "actual_mixed_bridge_transverse_floor_exp_minus_o_lambda_squared_proved": False,
    "actual_mixed_bridge_individual_odd_bridge_energy_relative_smallness_proved": False,
    "actual_mixed_bridge_mixed_resolvent_lower_bound_proved": False,
    "actual_mixed_bridge_generalized_harmonic_row_phase_bound_proved": False,
    "cutoff_free_actual_radical_high_complexity_frame_pass_proved": False,
    "cutoff_free_actual_radical_translation_one_direction_pass_proved": False,
    "checkpoint173_focused_tests_passed": True,
    "checkpoint173_full_suite_recount_completed": False,
    "cutoff_free_actual_radical_paired_floquet_zero_separation_proved": True,
    "cutoff_free_actual_radical_sampled_xi_minimum_modulus_proved": True,
    "cutoff_free_actual_radical_floquet_parity_riesz_conditioning_proved": True,
    "cutoff_free_actual_radical_complete_circle_seam_obstruction_proved": True,
    "cutoff_free_actual_radical_weighted_boundary_safe_translation_obstruction_proved": True,
    "cutoff_free_actual_radical_pair_c_band_floor_reduction_proved": True,
    "cutoff_free_actual_radical_divided_difference_log_derivative_source_escape_obstruction_proved": True,
    "cutoff_free_actual_radical_quadratic_transition_prefix_floor_proved": False,
    "cutoff_free_actual_radical_dangerous_floquet_graph_embedding_proved": False,
    "cutoff_free_actual_radical_pair_c_stopping_condition_proved": False,
    "checkpoint174_focused_tests_passed": True,
    "checkpoint174_full_suite_recount_completed": False,
    "actual_mixed_bridge_individual_beta_carrier_parity_split_proved": True,
    "actual_mixed_bridge_same_tail_carrier_continuous_rh_equivalence_proved": True,
    "actual_mixed_bridge_same_tail_carrier_all_odd_halfgrid_rh_equivalence_proved": True,
    "actual_mixed_bridge_paritywise_physical_finite_part_identification_proved": False,
    "actual_mixed_bridge_individual_physical_odd_self_one_over_lambda_proved": False,
    "actual_mixed_bridge_live_shift_mu_lower_one_over_lambda_proved": False,
    "actual_mixed_bridge_transverse_kappa_log_squared_reserve_proved": False,
    "checkpoint175_focused_tests_passed": True,
    "checkpoint175_full_suite_recount_completed": False,
    "actual_mixed_bridge_compact_side_odd_carrier_all_odd_halfgrid_transfer_proved": True,
    "actual_mixed_bridge_compact_physical_odd_self_all_odd_halfgrid_rh_equivalence_proved": True,
    "checkpoint176_focused_tests_passed": True,
    "checkpoint176_full_suite_recount_completed": False,
    "actual_mixed_bridge_all_real_fixed_mode_modal_sampling_proved": True,
    "actual_mixed_bridge_continuous_physical_odd_self_transfer_proved": True,
    "actual_mixed_bridge_continuous_compact_physical_odd_self_rh_equivalence_proved": True,
    "checkpoint177_focused_tests_passed": True,
    "checkpoint177_full_suite_recount_completed": False,
    "actual_mixed_bridge_gap_plus_pole_overlap_max_floor_proved": True,
    "actual_mixed_bridge_matching_metric_raw_innovation_weighted_splice_proved": True,
    "actual_mixed_bridge_fixed_odd_common_core_kappa_ceiling_proved": True,
    "actual_mixed_bridge_energy_over_kappa_rh_conditional_implication_proved": True,
    "actual_mixed_bridge_energy_over_kappa_premise_proved": False,
    "actual_mixed_bridge_weighted_residual_gate_proved": False,
    "actual_mixed_bridge_odd_ground_full_bottom_parity_identification_proved": False,
    "actual_mixed_bridge_one_sided_physical_odd_self_rh_equivalences_proved": True,
    "actual_mixed_bridge_physical_odd_self_upper_one_over_lambda_proved": False,
    "actual_mixed_bridge_physical_odd_self_lower_one_over_lambda_proved": False,
    "actual_mixed_bridge_sectoral_mu_lower_minus_o_one_rh_equivalence_proved": True,
    "actual_mixed_bridge_sectoral_shifted_energy_o_one_rh_equivalence_proved": True,
    "actual_mixed_bridge_global_mu_lower_minus_o_one_rh_equivalence_proved": True,
    "actual_mixed_bridge_global_shifted_energy_o_one_rh_equivalence_proved": True,
    "actual_mixed_bridge_sectoral_mu_lower_minus_o_one_proved": False,
    "actual_mixed_bridge_sectoral_shifted_energy_o_one_proved": False,
    "actual_mixed_bridge_global_mu_lower_minus_o_one_proved": False,
    "actual_mixed_bridge_global_shifted_energy_o_one_proved": False,
    "checkpoint178_focused_tests_passed": True,
    "checkpoint178_full_suite_recount_completed": False,
}

project = json.loads(Path("PROJECT_STATUS.json").read_text(encoding="utf-8"))
p0 = json.loads(Path("P0_STATUS.json").read_text(encoding="utf-8"))["component_claims"]
handoff = json.loads(Path("HANDOFF_MANIFEST.json").read_text(encoding="utf-8"))["claim_status"]
surfaces = (
    ("PROJECT_STATUS.json", project),
    ("P0_STATUS.json:component_claims", p0),
    ("HANDOFF_MANIFEST.json:claim_status", handoff),
)

for key, expected in required.items():
    values = []
    for name, claims in surfaces:
        if key not in claims:
            raise AssertionError(f"missing required claim key {key!r} in {name}")
        values.append(claims[key])
    if values != [expected, expected, expected]:
        raise AssertionError(
            f"claim mismatch for {key!r}: expected {expected!r}, got {values!r}"
        )
PY

python3 -m unittest discover -s tests -v

mkdir -p artifacts/weak_residual_duality
python3 src/weak_residual_duality.py --dps 80 \
  --output artifacts/weak_residual_duality/counterexample_producer_dps80.json
python3 verifier/weak_residual_duality_replay.py \
  artifacts/weak_residual_duality/counterexample_producer_dps80.json \
  --output artifacts/weak_residual_duality/counterexample_verifier.json

mkdir -p artifacts/quotient_exterior_preconditioner
python3 src/quotient_exterior_preconditioner.py --dps 80 \
  --output artifacts/quotient_exterior_preconditioner/canonical_producer_dps80.json
python3 verifier/quotient_exterior_preconditioner_replay.py \
  --artifact artifacts/quotient_exterior_preconditioner/canonical_producer_dps80.json \
  --output artifacts/quotient_exterior_preconditioner/canonical_verifier_dps80.json
python3 src/quotient_exterior_preconditioner.py --dps 160 \
  --output artifacts/quotient_exterior_preconditioner/canonical_producer_dps160.json
python3 verifier/quotient_exterior_preconditioner_replay.py \
  --artifact artifacts/quotient_exterior_preconditioner/canonical_producer_dps160.json \
  --output artifacts/quotient_exterior_preconditioner/canonical_verifier_dps160.json

mkdir -p artifacts/physical_map_conditioning
python3 src/physical_map_conditioning.py --lambda 5/2 --dps 80 \
  --output artifacts/physical_map_conditioning/lambda5over2_producer_dps80.json
python3 verifier/physical_map_conditioning_replay.py \
  artifacts/physical_map_conditioning/lambda5over2_producer_dps80.json \
  --output artifacts/physical_map_conditioning/lambda5over2_verifier.json

P0_FLINT_PREFIX="$(brew --prefix flint)"
P0_GMP_PREFIX="$(brew --prefix gmp)"
P0_MPFR_PREFIX="$(brew --prefix mpfr)"
P0_BUILD_DIR="$(mktemp -d)"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" src/p0_matrix_arb.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/p0_matrix_arb"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" verifier/p0_matrix_arb_replay.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/p0_matrix_arb_replay"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" src/p0_prolate_state_arb.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/p0_prolate_state_arb"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" verifier/p0_prolate_state_arb_replay.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/p0_prolate_state_arb_replay"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" src/variable_lambda_prolate_state_ball.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/variable_lambda_prolate_state_ball"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" verifier/variable_lambda_prolate_state_ball_replay.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/variable_lambda_prolate_state_ball_replay"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" verifier/p0_n4_raw_gap_arb.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/p0_n4_raw_gap_arb"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" verifier/projection_constant_arb.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/projection_constant_arb"

mkdir -p artifacts/projection_rate
"$P0_BUILD_DIR/projection_constant_arb" --prec 256 \
  > artifacts/projection_rate/C_K_256bits.txt

mkdir -p artifacts/p0_ball_pilots/lambda2_N2
for P0_BITS in 256 512; do
  "$P0_BUILD_DIR/p0_matrix_arb" --lambda 2 --N 2 --prec "$P0_BITS" \
    --output "artifacts/p0_ball_pilots/lambda2_N2/producer_${P0_BITS}bits.txt" >/dev/null
  "$P0_BUILD_DIR/p0_matrix_arb_replay" --lambda 2 --N 2 --prec "$P0_BITS" \
    --producer "artifacts/p0_ball_pilots/lambda2_N2/producer_${P0_BITS}bits.txt" \
    --output "artifacts/p0_ball_pilots/lambda2_N2/verifier_${P0_BITS}bits.txt" >/dev/null
done

mkdir -p artifacts/p0_ball_pilots/lambda2_N4
for P0_BITS in 256 512; do
  "$P0_BUILD_DIR/p0_matrix_arb" --lambda 2 --N 4 --prec "$P0_BITS" \
    --output "artifacts/p0_ball_pilots/lambda2_N4/producer_${P0_BITS}bits.txt" >/dev/null
  "$P0_BUILD_DIR/p0_matrix_arb_replay" --lambda 2 --N 4 --prec "$P0_BITS" \
    --producer "artifacts/p0_ball_pilots/lambda2_N4/producer_${P0_BITS}bits.txt" \
    --output "artifacts/p0_ball_pilots/lambda2_N4/verifier_${P0_BITS}bits.txt" >/dev/null
  python3 verifier/even_total_positivity_ball_audit.py \
    --producer "artifacts/p0_ball_pilots/lambda2_N4/producer_${P0_BITS}bits.txt" \
    --verifier "artifacts/p0_ball_pilots/lambda2_N4/verifier_${P0_BITS}bits.txt" \
    --lambda 2 --N 4 --prec "$P0_BITS" \
    --output "artifacts/p0_ball_pilots/lambda2_N4/even_minor_audit_${P0_BITS}bits.json" >/dev/null
done

shasum -a 256 -c artifacts/p0_prolate_state_ball/INPUTS.sha256
for P0_STATE_N in 3 4; do
  mkdir -p "artifacts/p0_prolate_state_ball/lambda2_N${P0_STATE_N}"
  for P0_BITS in 256 512; do
    "$P0_BUILD_DIR/p0_prolate_state_arb" \
      --lambda 2 --N "$P0_STATE_N" --basis-size 40 --prec "$P0_BITS" \
      --output "artifacts/p0_prolate_state_ball/lambda2_N${P0_STATE_N}/producer_${P0_BITS}bits.txt"
    "$P0_BUILD_DIR/p0_prolate_state_arb_replay" \
      --lambda 2 --N "$P0_STATE_N" --basis-size 40 --prec "$P0_BITS" \
      --producer "artifacts/p0_prolate_state_ball/lambda2_N${P0_STATE_N}/producer_${P0_BITS}bits.txt" \
      --output "artifacts/p0_prolate_state_ball/lambda2_N${P0_STATE_N}/verifier_${P0_BITS}bits.txt"
  done
done
"$P0_BUILD_DIR/p0_n4_raw_gap_arb" --prec 512 \
  --weil artifacts/p0_ball_pilots/lambda2_N4/producer_256bits.txt \
  --weil artifacts/p0_ball_pilots/lambda2_N4/verifier_256bits.txt \
  --weil artifacts/p0_ball_pilots/lambda2_N4/producer_512bits.txt \
  --weil artifacts/p0_ball_pilots/lambda2_N4/verifier_512bits.txt \
  --state artifacts/p0_prolate_state_ball/lambda2_N4/producer_256bits.txt \
  --state artifacts/p0_prolate_state_ball/lambda2_N4/verifier_256bits.txt \
  --state artifacts/p0_prolate_state_ball/lambda2_N4/producer_512bits.txt \
  --state artifacts/p0_prolate_state_ball/lambda2_N4/verifier_512bits.txt \
  --output artifacts/p0_prolate_state_ball/lambda2_N4/raw_odd_gap_512bits.txt
shasum -a 256 -c artifacts/p0_prolate_state_ball/OUTPUTS.sha256

shasum -a 256 -c artifacts/variable_lambda_prolate_state_ball/INPUTS.sha256
mkdir -p artifacts/variable_lambda_prolate_state_ball/lambda5over2_N3
for P0_VARIABLE_BITS in 256 512; do
  "$P0_BUILD_DIR/variable_lambda_prolate_state_ball" \
    --lambda 5/2 --N 3 --basis-size 79 --tail-terminal 85 \
    --prec "$P0_VARIABLE_BITS" \
    --output "artifacts/variable_lambda_prolate_state_ball/lambda5over2_N3/producer_${P0_VARIABLE_BITS}bits.txt"
  "$P0_BUILD_DIR/variable_lambda_prolate_state_ball_replay" \
    --producer "artifacts/variable_lambda_prolate_state_ball/lambda5over2_N3/producer_${P0_VARIABLE_BITS}bits.txt" \
    --lambda 5/2 --N 3 --basis-size 79 --tail-terminal 85 \
    --prec "$P0_VARIABLE_BITS" \
    --output "artifacts/variable_lambda_prolate_state_ball/lambda5over2_N3/verifier_${P0_VARIABLE_BITS}bits.txt"
done
shasum -a 256 -c artifacts/variable_lambda_prolate_state_ball/OUTPUTS.sha256

mkdir -p artifacts/p0_pilots/lambda2_N2
python3 src/p0_diagnostic.py --lambda 2 --N 2 --dps 40 --prolate-basis-size 30 \
  --output artifacts/p0_pilots/lambda2_N2/producer_dps40.json >/dev/null
python3 verifier/independent_replay.py artifacts/p0_pilots/lambda2_N2/producer_dps40.json \
  --output artifacts/p0_pilots/lambda2_N2/verifier_dps40.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2 --N 2 --dps 80 --prolate-basis-size 40 \
  --output artifacts/p0_pilots/lambda2_N2/producer_dps80.json >/dev/null
python3 verifier/independent_replay.py artifacts/p0_pilots/lambda2_N2/producer_dps80.json \
  --output artifacts/p0_pilots/lambda2_N2/verifier_dps80.json >/dev/null

mkdir -p artifacts/p0_schedule/raw
python3 src/p0_diagnostic.py --lambda 1.5 --N 3 --dps 35 --prolate-basis-size 30 \
  --output artifacts/p0_schedule/raw/lambda1p5_N3_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2 --N 3 --dps 35 --prolate-basis-size 30 \
  --output artifacts/p0_schedule/raw/lambda2_N3_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2 --N 4 --dps 35 --prolate-basis-size 30 \
  --output artifacts/p0_schedule/raw/lambda2_N4_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.5 --N 7 --dps 30 --prolate-basis-size 35 \
  --output artifacts/p0_schedule/raw/lambda2p5_N7_dps30.json >/dev/null
python3 src/p0_diagnostic.py --lambda 3 --N 9 --dps 35 --prolate-basis-size 45 \
  --output artifacts/p0_schedule/raw/lambda3_N9_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 1.5 --N 6 --dps 30 --prolate-basis-size 30 \
  --output artifacts/p0_schedule/raw/lambda1p5_N6_dps30.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2 --N 8 --dps 30 --prolate-basis-size 30 \
  --output artifacts/p0_schedule/raw/lambda2_N8_dps30.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.5 --N 14 --dps 40 --prolate-basis-size 45 \
  --output artifacts/p0_schedule/raw/lambda2p5_N14_dps40.json >/dev/null
python3 src/p0_diagnostic.py --lambda 3 --N 18 --dps 45 --prolate-basis-size 50 \
  --output artifacts/p0_schedule/raw/lambda3_N18_dps45.json >/dev/null
python3 src/p0_diagnostic.py --lambda 1.75 --N 8 --dps 35 --prolate-basis-size 35 \
  --output artifacts/p0_schedule/raw/lambda1p75_N8_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 1.75 --N 8 --dps 70 --prolate-basis-size 35 \
  --output artifacts/p0_schedule/raw/lambda1p75_N8_dps70.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.25 --N 12 --dps 40 --prolate-basis-size 45 \
  --output artifacts/p0_schedule/raw/lambda2p25_N12_dps40.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.25 --N 12 --dps 80 --prolate-basis-size 45 \
  --output artifacts/p0_schedule/raw/lambda2p25_N12_dps80.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 16 --dps 45 --prolate-basis-size 55 \
  --output artifacts/p0_schedule/raw/lambda2p75_N16_dps45.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 16 --dps 90 --prolate-basis-size 55 \
  --output artifacts/p0_schedule/raw/lambda2p75_N16_dps90.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 24 --dps 50 --prolate-basis-size 60 \
  --output artifacts/p0_schedule/raw/lambda2p75_N24_dps50.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 24 --dps 80 --prolate-basis-size 60 \
  --output artifacts/p0_schedule/raw/lambda2p75_N24_dps80.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 24 --dps 50 --prolate-basis-size 80 \
  --output artifacts/p0_schedule/raw/lambda2p75_N24_dps50_basis80.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 32 --dps 50 --prolate-basis-size 60 \
  --output artifacts/p0_schedule/raw/lambda2p75_N32_dps50.json >/dev/null
python3 src/p0_diagnostic.py --lambda 1.75 --N 12 --dps 35 --prolate-basis-size 35 \
  --output artifacts/p0_schedule/raw/lambda1p75_N12_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2 --N 12 --dps 40 --prolate-basis-size 40 \
  --output artifacts/p0_schedule/raw/lambda2_N12_dps40.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.25 --N 18 --dps 45 --prolate-basis-size 50 \
  --output artifacts/p0_schedule/raw/lambda2p25_N18_dps45.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.25 --N 18 --dps 70 --prolate-basis-size 70 \
  --output artifacts/p0_schedule/raw/lambda2p25_N18_dps70.json >/dev/null
mkdir -p artifacts/p0_schedule/verifier
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p5_N14_dps40.json \
  --output artifacts/p0_schedule/verifier/lambda2p5_N14_dps40.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda3_N18_dps45.json \
  --output artifacts/p0_schedule/verifier/lambda3_N18_dps45.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda1p75_N8_dps35.json \
  --output artifacts/p0_schedule/verifier/lambda1p75_N8_dps35.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p25_N12_dps40.json \
  --output artifacts/p0_schedule/verifier/lambda2p25_N12_dps40.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p75_N16_dps45.json \
  --output artifacts/p0_schedule/verifier/lambda2p75_N16_dps45.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p75_N24_dps50.json \
  --output artifacts/p0_schedule/verifier/lambda2p75_N24_dps50.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p75_N32_dps50.json \
  --output artifacts/p0_schedule/verifier/lambda2p75_N32_dps50.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda1p75_N12_dps35.json \
  --output artifacts/p0_schedule/verifier/lambda1p75_N12_dps35.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2_N12_dps40.json \
  --output artifacts/p0_schedule/verifier/lambda2_N12_dps40.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p25_N18_dps45.json \
  --output artifacts/p0_schedule/verifier/lambda2p25_N18_dps45.json >/dev/null

python3 src/schedule_analysis.py \
  artifacts/p0_schedule/raw/lambda1p5_N3_dps35.json \
  artifacts/p0_schedule/raw/lambda2_N4_dps35.json \
  artifacts/p0_schedule/raw/lambda2p5_N7_dps30.json \
  artifacts/p0_schedule/raw/lambda3_N9_dps35.json \
  --output artifacts/p0_schedule/N_ceil_lambda2_summary.json >/dev/null
python3 src/schedule_analysis.py \
  artifacts/p0_schedule/raw/lambda1p5_N6_dps30.json \
  artifacts/p0_schedule/raw/lambda2_N8_dps30.json \
  artifacts/p0_schedule/raw/lambda2p5_N14_dps40.json \
  artifacts/p0_schedule/raw/lambda3_N18_dps45.json \
  --multiplier 2 --output artifacts/p0_schedule/N_2ceil_lambda2_summary.json >/dev/null
python3 src/schedule_analysis.py \
  artifacts/p0_schedule/raw/lambda1p75_N8_dps35.json \
  artifacts/p0_schedule/raw/lambda2_N8_dps30.json \
  artifacts/p0_schedule/raw/lambda2p25_N12_dps40.json \
  artifacts/p0_schedule/raw/lambda2p75_N16_dps45.json \
  --multiplier 2 \
  --output artifacts/p0_schedule/N_2ceil_lambda2_refined_summary.json >/dev/null
python3 src/schedule_analysis.py \
  artifacts/p0_schedule/raw/lambda1p75_N12_dps35.json \
  artifacts/p0_schedule/raw/lambda2_N12_dps40.json \
  artifacts/p0_schedule/raw/lambda2p25_N18_dps45.json \
  artifacts/p0_schedule/raw/lambda2p75_N24_dps50.json \
  --multiplier 3 \
  --output artifacts/p0_schedule/N_3ceil_lambda2_summary.json >/dev/null

mkdir -p artifacts/prolate_window_probe
python3 src/prolate_window_probe.py --lambda 2 --N 8 --dps 30 \
  --prolate-basis-size 30 \
  --output artifacts/prolate_window_probe/lambda2_N8_dps30.json >/dev/null
python3 verifier/anisotropic_schur_replay.py \
  artifacts/prolate_window_probe/lambda2_N8_dps30.json --dps 50 \
  --output artifacts/prolate_window_probe/lambda2_N8_dps30_verifier.json >/dev/null
python3 src/prolate_window_probe.py --lambda 1.75 --N 8 --dps 30 \
  --prolate-basis-size 30 \
  --output artifacts/prolate_window_probe/lambda1p75_N8_two_window_dps30.json >/dev/null
python3 src/prolate_window_probe.py --lambda 1.75 --N 8 --dps 60 \
  --prolate-basis-size 30 \
  --output artifacts/prolate_window_probe/lambda1p75_N8_two_window_dps60.json >/dev/null
python3 src/prolate_window_probe.py --lambda 2.25 --N 12 --dps 35 \
  --prolate-basis-size 40 \
  --output artifacts/prolate_window_probe/lambda2p25_N12_two_window_dps35.json >/dev/null
python3 src/prolate_window_probe.py --lambda 2.25 --N 12 --dps 70 \
  --prolate-basis-size 40 \
  --output artifacts/prolate_window_probe/lambda2p25_N12_two_window_dps70.json >/dev/null
python3 verifier/anisotropic_schur_replay.py \
  artifacts/prolate_window_probe/lambda1p75_N8_two_window_dps30.json --dps 50 \
  --output artifacts/prolate_window_probe/lambda1p75_N8_two_window_dps30_verifier.json >/dev/null
python3 verifier/anisotropic_schur_replay.py \
  artifacts/prolate_window_probe/lambda2p25_N12_two_window_dps35.json --dps 60 \
  --output artifacts/prolate_window_probe/lambda2p25_N12_two_window_dps35_verifier.json >/dev/null
python3 src/prolate_window_probe.py --lambda 2.25 --N 12 --dps 35 \
  --prolate-basis-size 40 --even-labels 8,12,16,20 \
  --odd-labels 6,10,14,18 --skip-direct-projection-error \
  --skip-quadrature-crosscheck \
  --output artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps35.json >/dev/null
python3 src/prolate_window_probe.py --lambda 2.25 --N 12 --dps 60 \
  --prolate-basis-size 40 --even-labels 8,12,16,20 \
  --odd-labels 6,10,14,18 --skip-direct-projection-error \
  --skip-quadrature-crosscheck \
  --output artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps60.json >/dev/null
python3 verifier/anisotropic_schur_replay.py \
  artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps35.json --dps 60 \
  --output artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps35_verifier.json >/dev/null
python3 verifier/anisotropic_schur_replay.py \
  artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps60.json --dps 80 \
  --output artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps60_verifier.json >/dev/null

mkdir -p artifacts/chebyshev_rewrite
python3 verifier/chebyshev_rewrite_replay.py --lambda 2 --N 2 --dps 80 \
  --output artifacts/chebyshev_rewrite/lambda2_N2_dps80.json >/dev/null
python3 verifier/chebyshev_rewrite_replay.py --lambda 2 --N 2 --dps 160 \
  --output artifacts/chebyshev_rewrite/lambda2_N2_dps160.json >/dev/null

mkdir -p artifacts/transition_window
python3 src/transition_window_bound.py --lambda 2 --dps 80 \
  --output artifacts/transition_window/lambda2_dps80.json >/dev/null

mkdir -p artifacts/prufer_same_parity_gap
python3 src/prufer_same_parity_gap.py --dps 80 \
  --output artifacts/prufer_same_parity_gap/canonical_producer_dps80.json >/dev/null
python3 verifier/prufer_same_parity_gap_replay.py \
  --artifact artifacts/prufer_same_parity_gap/canonical_producer_dps80.json \
  --dps 80 \
  --output artifacts/prufer_same_parity_gap/canonical_verifier_dps80.json >/dev/null
python3 src/prufer_same_parity_gap.py --dps 160 \
  --output artifacts/prufer_same_parity_gap/canonical_producer_dps160.json >/dev/null
python3 verifier/prufer_same_parity_gap_replay.py \
  --artifact artifacts/prufer_same_parity_gap/canonical_producer_dps160.json \
  --dps 160 \
  --output artifacts/prufer_same_parity_gap/canonical_verifier_dps160.json >/dev/null

mkdir -p artifacts/prolate_tail
python3 src/prolate_tail_envelope.py --lambda 2 --N 12 --dps 80 \
  --output artifacts/prolate_tail/lambda2_N12_producer_dps80.json >/dev/null
python3 verifier/prolate_tail_envelope_replay.py \
  artifacts/prolate_tail/lambda2_N12_producer_dps80.json --dps 160 \
  --output artifacts/prolate_tail/lambda2_N12_verifier_dps160.json >/dev/null
python3 src/prolate_tail_envelope.py --lambda 2 --N 12 --dps 160 \
  --output artifacts/prolate_tail/lambda2_N12_producer_dps160.json >/dev/null
python3 verifier/prolate_tail_envelope_replay.py \
  artifacts/prolate_tail/lambda2_N12_producer_dps160.json --dps 200 \
  --output artifacts/prolate_tail/lambda2_N12_verifier_dps200.json >/dev/null

mkdir -p artifacts/defect_relative_projection
python3 src/defect_relative_projection.py --j 2 --dps 80 \
  --output artifacts/defect_relative_projection/lambda2p5_j2_producer_dps80.json >/dev/null
python3 verifier/defect_relative_projection_replay.py \
  artifacts/defect_relative_projection/lambda2p5_j2_producer_dps80.json \
  --dps 100 \
  --output artifacts/defect_relative_projection/lambda2p5_j2_replay_dps100.json >/dev/null
python3 src/defect_relative_projection.py --j 2 --dps 160 \
  --output artifacts/defect_relative_projection/lambda2p5_j2_producer_dps160.json >/dev/null
python3 verifier/defect_relative_projection_replay.py \
  artifacts/defect_relative_projection/lambda2p5_j2_producer_dps160.json \
  --dps 200 \
  --output artifacts/defect_relative_projection/lambda2p5_j2_replay_dps200.json >/dev/null

mkdir -p artifacts/chebyshev_hankel
python3 src/chebyshev_hankel_bound.py --dps 80 \
  --output artifacts/chebyshev_hankel/moments_producer_dps80.json >/dev/null
python3 verifier/chebyshev_hankel_bound_replay.py \
  artifacts/chebyshev_hankel/moments_producer_dps80.json --dps 160 \
  --output artifacts/chebyshev_hankel/moments_verifier_dps160.json >/dev/null
python3 src/chebyshev_hankel_bound.py --dps 160 \
  --output artifacts/chebyshev_hankel/moments_producer_dps160.json >/dev/null
python3 verifier/chebyshev_hankel_bound_replay.py \
  artifacts/chebyshev_hankel/moments_producer_dps160.json --dps 200 \
  --output artifacts/chebyshev_hankel/moments_verifier_dps200.json >/dev/null

mkdir -p artifacts/near_hankel_geometry
python3 verifier/near_hankel_geometry_replay.py --dps 50 \
  --output artifacts/near_hankel_geometry/replay_dps50.json >/dev/null
python3 verifier/near_hankel_geometry_replay.py --dps 100 \
  --output artifacts/near_hankel_geometry/replay_dps100.json >/dev/null

mkdir -p artifacts/high_fourier_coercivity
python3 src/high_fourier_coercivity.py --lambda 2.5 --target-floor 1 \
  --shift 0 --dps 80 \
  --output artifacts/high_fourier_coercivity/lambda2p5_target1_producer_dps80.json >/dev/null
python3 verifier/high_fourier_coercivity_replay.py \
  --input artifacts/high_fourier_coercivity/lambda2p5_target1_producer_dps80.json \
  --output artifacts/high_fourier_coercivity/lambda2p5_target1_replay_dps80.json >/dev/null
python3 src/high_fourier_coercivity.py --lambda 2.5 --target-floor 1 \
  --shift 0 --dps 160 \
  --output artifacts/high_fourier_coercivity/lambda2p5_target1_producer_dps160.json >/dev/null
python3 verifier/high_fourier_coercivity_replay.py \
  --input artifacts/high_fourier_coercivity/lambda2p5_target1_producer_dps160.json \
  --output artifacts/high_fourier_coercivity/lambda2p5_target1_replay_dps160.json >/dev/null

mkdir -p artifacts/compact_projection_weil
python3 src/compact_projection_weil_bound.py --j 2 --dps 80 \
  --output artifacts/compact_projection_weil/lambda2p5_j2_producer_dps80.json >/dev/null
python3 verifier/compact_projection_weil_bound_replay.py \
  --input artifacts/compact_projection_weil/lambda2p5_j2_producer_dps80.json \
  --output artifacts/compact_projection_weil/lambda2p5_j2_replay_dps80.json >/dev/null
python3 src/compact_projection_weil_bound.py --j 2 --dps 160 \
  --output artifacts/compact_projection_weil/lambda2p5_j2_producer_dps160.json >/dev/null
python3 verifier/compact_projection_weil_bound_replay.py \
  --input artifacts/compact_projection_weil/lambda2p5_j2_producer_dps160.json \
  --output artifacts/compact_projection_weil/lambda2p5_j2_replay_dps160.json >/dev/null

mkdir -p artifacts/outer_projection_weil
python3 src/outer_projection_weil_bound.py --j 2 --dps 80 \
  --output artifacts/outer_projection_weil/lambda2p5_j2_producer_dps80.json >/dev/null
python3 verifier/outer_projection_weil_bound_replay.py \
  --input artifacts/outer_projection_weil/lambda2p5_j2_producer_dps80.json \
  --output artifacts/outer_projection_weil/lambda2p5_j2_replay_dps80.json >/dev/null
python3 src/outer_projection_weil_bound.py --j 2 --dps 160 \
  --output artifacts/outer_projection_weil/lambda2p5_j2_producer_dps160.json >/dev/null
python3 verifier/outer_projection_weil_bound_replay.py \
  --input artifacts/outer_projection_weil/lambda2p5_j2_producer_dps160.json \
  --output artifacts/outer_projection_weil/lambda2p5_j2_replay_dps160.json >/dev/null

for P0_SOURCE_DPS in 80 160; do
  python3 src/zero_sampling_source_lock.py \
    --lock ZERO_SAMPLING_SOURCE_LOCK.json --dps "$P0_SOURCE_DPS" >/dev/null
  for P0_SOURCE_INDEX in 0 34 64; do
    python3 verifier/zero_sampling_source_replay.py \
      ZERO_SAMPLING_SOURCE_LOCK.json --dps "$P0_SOURCE_DPS" \
      --index "$P0_SOURCE_INDEX" --q 1 >/dev/null
  done
done

mkdir -p artifacts/outer_outer_weighted_translation
python3 src/outer_outer_weighted_translation.py --lambda-decimal 2.5 --dps 80 \
  --output artifacts/outer_outer_weighted_translation/lambda2p5_producer_dps80.json >/dev/null
python3 verifier/outer_outer_weighted_translation_replay.py \
  artifacts/outer_outer_weighted_translation/lambda2p5_producer_dps80.json \
  --output artifacts/outer_outer_weighted_translation/lambda2p5_replay_dps80.json >/dev/null
python3 src/outer_outer_weighted_translation.py --lambda-decimal 2.5 --dps 160 \
  --output artifacts/outer_outer_weighted_translation/lambda2p5_producer_dps160.json >/dev/null
python3 verifier/outer_outer_weighted_translation_replay.py \
  artifacts/outer_outer_weighted_translation/lambda2p5_producer_dps160.json \
  --output artifacts/outer_outer_weighted_translation/lambda2p5_replay_dps160.json >/dev/null

mkdir -p artifacts/outer_outer_spectral_theorem
python3 src/outer_outer_spectral_theorem.py --lambda-decimal 2.5 --dps 80 \
  --output artifacts/outer_outer_spectral_theorem/lambda2p5_producer_dps80.json >/dev/null
python3 verifier/outer_outer_spectral_theorem_replay.py \
  artifacts/outer_outer_spectral_theorem/lambda2p5_producer_dps80.json \
  --output artifacts/outer_outer_spectral_theorem/lambda2p5_replay_dps80.json >/dev/null
python3 src/outer_outer_spectral_theorem.py --lambda-decimal 2.5 --dps 160 \
  --output artifacts/outer_outer_spectral_theorem/lambda2p5_producer_dps160.json >/dev/null
python3 verifier/outer_outer_spectral_theorem_replay.py \
  artifacts/outer_outer_spectral_theorem/lambda2p5_producer_dps160.json \
  --output artifacts/outer_outer_spectral_theorem/lambda2p5_replay_dps160.json >/dev/null

mkdir -p artifacts/compact_absolute_sampling
python3 src/compact_absolute_sampling.py --j 2 --dps 80 \
  --output artifacts/compact_absolute_sampling/lambda2p5_j2_producer_dps80.json >/dev/null
python3 verifier/compact_absolute_sampling_replay.py \
  artifacts/compact_absolute_sampling/lambda2p5_j2_producer_dps80.json \
  --dps 120 \
  --output artifacts/compact_absolute_sampling/lambda2p5_j2_replay_dps120.json >/dev/null
python3 src/compact_absolute_sampling.py --j 2 --dps 160 \
  --output artifacts/compact_absolute_sampling/lambda2p5_j2_producer_dps160.json >/dev/null
python3 verifier/compact_absolute_sampling_replay.py \
  artifacts/compact_absolute_sampling/lambda2p5_j2_producer_dps160.json \
  --dps 220 \
  --output artifacts/compact_absolute_sampling/lambda2p5_j2_replay_dps220.json >/dev/null

mkdir -p artifacts/full_exterior_sampling_fallback
python3 src/full_exterior_sampling_fallback.py \
  --lambda-numerator 5 --lambda-denominator 2 --N 24 --dps 80 \
  --output artifacts/full_exterior_sampling_fallback/lambda5over2_N24_producer_dps80.json >/dev/null
python3 verifier/full_exterior_sampling_fallback_replay.py \
  artifacts/full_exterior_sampling_fallback/lambda5over2_N24_producer_dps80.json \
  --dps 120 \
  --output artifacts/full_exterior_sampling_fallback/lambda5over2_N24_verifier_dps80.json >/dev/null
python3 src/full_exterior_sampling_fallback.py \
  --lambda-numerator 5 --lambda-denominator 2 --N 24 --dps 160 \
  --output artifacts/full_exterior_sampling_fallback/lambda5over2_N24_producer_dps160.json >/dev/null
python3 verifier/full_exterior_sampling_fallback_replay.py \
  artifacts/full_exterior_sampling_fallback/lambda5over2_N24_producer_dps160.json \
  --dps 200 \
  --output artifacts/full_exterior_sampling_fallback/lambda5over2_N24_verifier_dps160.json >/dev/null

mkdir -p artifacts/hybrid_outer_sampling_odd_shift
python3 src/hybrid_outer_sampling_odd_shift.py \
  --lambda-decimal 2.5 --dps 80 \
  --output artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_producer_dps80.json >/dev/null
python3 verifier/hybrid_outer_sampling_odd_shift_replay.py \
  artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_producer_dps80.json \
  --output artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_verifier_dps80.json >/dev/null
python3 src/hybrid_outer_sampling_odd_shift.py \
  --lambda-decimal 2.5 --dps 160 \
  --output artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_producer_dps160.json >/dev/null
python3 verifier/hybrid_outer_sampling_odd_shift_replay.py \
  artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_producer_dps160.json \
  --output artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_verifier_dps160.json >/dev/null

mkdir -p artifacts/projected_state_norm_lower_bound
python3 src/projected_state_norm_lower_bound.py \
  --lambda-decimal 4 --N 4096 --delta-upper-decimal 0.00001 --dps 80 \
  --output artifacts/projected_state_norm_lower_bound/lambda4_N4096_producer_dps80.json >/dev/null
python3 verifier/projected_state_norm_lower_bound_replay.py \
  artifacts/projected_state_norm_lower_bound/lambda4_N4096_producer_dps80.json \
  --output artifacts/projected_state_norm_lower_bound/lambda4_N4096_verifier_dps80.json >/dev/null
python3 src/projected_state_norm_lower_bound.py \
  --lambda-decimal 4 --N 4096 --delta-upper-decimal 0.00001 --dps 160 \
  --output artifacts/projected_state_norm_lower_bound/lambda4_N4096_producer_dps160.json >/dev/null
python3 verifier/projected_state_norm_lower_bound_replay.py \
  artifacts/projected_state_norm_lower_bound/lambda4_N4096_producer_dps160.json \
  --output artifacts/projected_state_norm_lower_bound/lambda4_N4096_verifier_dps160.json >/dev/null

mkdir -p artifacts/leading_prolate_oscillation
python3 src/leading_prolate_oscillation.py --lambda-numerator 5 \
  --output artifacts/leading_prolate_oscillation/lambda5over2_producer.json >/dev/null
python3 verifier/leading_prolate_oscillation_replay.py \
  artifacts/leading_prolate_oscillation/lambda5over2_producer.json \
  --output artifacts/leading_prolate_oscillation/lambda5over2_verifier.json >/dev/null
python3 src/leading_prolate_oscillation.py --lambda-numerator 7 \
  --output artifacts/leading_prolate_oscillation/lambda7over2_producer.json >/dev/null
python3 verifier/leading_prolate_oscillation_replay.py \
  artifacts/leading_prolate_oscillation/lambda7over2_producer.json \
  --output artifacts/leading_prolate_oscillation/lambda7over2_verifier.json >/dev/null

mkdir -p artifacts/transition_prolate_outer
for P0_TRANSITION_P in 5 7; do
  for P0_TRANSITION_DPS in 80 160; do
    python3 src/transition_prolate_outer.py \
      --lambda-numerator "$P0_TRANSITION_P" --dps "$P0_TRANSITION_DPS" \
      --output "artifacts/transition_prolate_outer/p${P0_TRANSITION_P}_d${P0_TRANSITION_DPS}_producer.json" >/dev/null
    python3 verifier/transition_prolate_outer_replay.py \
      "artifacts/transition_prolate_outer/p${P0_TRANSITION_P}_d${P0_TRANSITION_DPS}_producer.json" \
      --output "artifacts/transition_prolate_outer/p${P0_TRANSITION_P}_d${P0_TRANSITION_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/growing_transition_sampling
for P0_GROWING_DPS in 80 160; do
  python3 src/growing_transition_sampling.py \
    --lambda-numerator 5 --modal-rows 8 --dps "$P0_GROWING_DPS" \
    --output "artifacts/growing_transition_sampling/p5_q8_d${P0_GROWING_DPS}_producer.json" >/dev/null
  python3 verifier/growing_transition_sampling_replay.py \
    "artifacts/growing_transition_sampling/p5_q8_d${P0_GROWING_DPS}_producer.json" \
    --output "artifacts/growing_transition_sampling/p5_q8_d${P0_GROWING_DPS}_replay.json" >/dev/null
  python3 src/growing_transition_sampling.py \
    --lambda-numerator 7 --modal-rows 14 --dps "$P0_GROWING_DPS" \
    --output "artifacts/growing_transition_sampling/p7_q14_d${P0_GROWING_DPS}_producer.json" >/dev/null
  python3 verifier/growing_transition_sampling_replay.py \
    "artifacts/growing_transition_sampling/p7_q14_d${P0_GROWING_DPS}_producer.json" \
    --output "artifacts/growing_transition_sampling/p7_q14_d${P0_GROWING_DPS}_replay.json" >/dev/null
done

mkdir -p artifacts/block_quotient_action
for P0_BLOCK_ACTION_P in 5 7; do
  for P0_BLOCK_ACTION_DPS in 80 160; do
    python3 src/block_quotient_action.py \
      --lambda-numerator "$P0_BLOCK_ACTION_P" --dps "$P0_BLOCK_ACTION_DPS" \
      --output "artifacts/block_quotient_action/p${P0_BLOCK_ACTION_P}_d${P0_BLOCK_ACTION_DPS}_producer.json" >/dev/null
    python3 verifier/block_quotient_action_replay.py \
      "artifacts/block_quotient_action/p${P0_BLOCK_ACTION_P}_d${P0_BLOCK_ACTION_DPS}_producer.json" \
      --output "artifacts/block_quotient_action/p${P0_BLOCK_ACTION_P}_d${P0_BLOCK_ACTION_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/compressed_multiplier_trace
for P0_COMPRESSED_P in 5 7; do
  for P0_COMPRESSED_DPS in 80 160; do
    python3 src/compressed_multiplier_trace.py \
      --lambda-numerator "$P0_COMPRESSED_P" --dps "$P0_COMPRESSED_DPS" \
      --output "artifacts/compressed_multiplier_trace/p${P0_COMPRESSED_P}_d${P0_COMPRESSED_DPS}_producer.json" >/dev/null
    python3 verifier/compressed_multiplier_trace_replay.py \
      "artifacts/compressed_multiplier_trace/p${P0_COMPRESSED_P}_d${P0_COMPRESSED_DPS}_producer.json" \
      --output "artifacts/compressed_multiplier_trace/p${P0_COMPRESSED_P}_d${P0_COMPRESSED_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/signed_quotient_capture
for P0_SIGNED_CAPTURE_P in 5 7; do
  for P0_SIGNED_CAPTURE_DPS in 80 160; do
    python3 src/signed_quotient_capture.py \
      --lambda-numerator "$P0_SIGNED_CAPTURE_P" --dps "$P0_SIGNED_CAPTURE_DPS" \
      --output "artifacts/signed_quotient_capture/p${P0_SIGNED_CAPTURE_P}_d${P0_SIGNED_CAPTURE_DPS}_producer.json" >/dev/null
    python3 verifier/signed_quotient_capture_replay.py \
      "artifacts/signed_quotient_capture/p${P0_SIGNED_CAPTURE_P}_d${P0_SIGNED_CAPTURE_DPS}_producer.json" \
      --output "artifacts/signed_quotient_capture/p${P0_SIGNED_CAPTURE_P}_d${P0_SIGNED_CAPTURE_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/physical_leverage_shorted_schur
for P0_SHORTED_SCHUR_P in 5 7; do
  for P0_SHORTED_SCHUR_DPS in 80 160; do
    python3 src/physical_leverage_shorted_schur.py \
      --lambda-numerator "$P0_SHORTED_SCHUR_P" --dps "$P0_SHORTED_SCHUR_DPS" \
      --output "artifacts/physical_leverage_shorted_schur/p${P0_SHORTED_SCHUR_P}_d${P0_SHORTED_SCHUR_DPS}_producer.json" >/dev/null
    python3 verifier/physical_leverage_shorted_schur_replay.py \
      "artifacts/physical_leverage_shorted_schur/p${P0_SHORTED_SCHUR_P}_d${P0_SHORTED_SCHUR_DPS}_producer.json" \
      --output "artifacts/physical_leverage_shorted_schur/p${P0_SHORTED_SCHUR_P}_d${P0_SHORTED_SCHUR_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/leverage_trimmed_mean_feature_schur
for P0_TRIMMED_SCHUR_P in 5 7; do
  for P0_TRIMMED_SCHUR_DPS in 80 160; do
    python3 src/leverage_trimmed_mean_feature_schur.py \
      --lambda-numerator "$P0_TRIMMED_SCHUR_P" --dps "$P0_TRIMMED_SCHUR_DPS" \
      --output "artifacts/leverage_trimmed_mean_feature_schur/p${P0_TRIMMED_SCHUR_P}_d${P0_TRIMMED_SCHUR_DPS}_producer.json" >/dev/null
    python3 verifier/leverage_trimmed_mean_feature_schur_replay.py \
      "artifacts/leverage_trimmed_mean_feature_schur/p${P0_TRIMMED_SCHUR_P}_d${P0_TRIMMED_SCHUR_DPS}_producer.json" \
      --output "artifacts/leverage_trimmed_mean_feature_schur/p${P0_TRIMMED_SCHUR_P}_d${P0_TRIMMED_SCHUR_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/localized_moment_source_whitened_schur
for P0_LOCALIZED_SCHUR_P in 5 7; do
  for P0_LOCALIZED_SCHUR_DPS in 80 160; do
    python3 src/localized_moment_source_whitened_schur.py \
      --lambda-numerator "$P0_LOCALIZED_SCHUR_P" --dps "$P0_LOCALIZED_SCHUR_DPS" \
      --output "artifacts/localized_moment_source_whitened_schur/p${P0_LOCALIZED_SCHUR_P}_d${P0_LOCALIZED_SCHUR_DPS}_producer.json" >/dev/null
    python3 verifier/localized_moment_source_whitened_schur_replay.py \
      "artifacts/localized_moment_source_whitened_schur/p${P0_LOCALIZED_SCHUR_P}_d${P0_LOCALIZED_SCHUR_DPS}_producer.json" \
      --output "artifacts/localized_moment_source_whitened_schur/p${P0_LOCALIZED_SCHUR_P}_d${P0_LOCALIZED_SCHUR_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/physical_soft_short_signed_schur
for P0_SOFT_SCHUR_P in 5 7; do
  for P0_SOFT_SCHUR_DPS in 80 160; do
    python3 src/physical_soft_short_signed_schur.py \
      --lambda-numerator "$P0_SOFT_SCHUR_P" --dps "$P0_SOFT_SCHUR_DPS" \
      --output "artifacts/physical_soft_short_signed_schur/p${P0_SOFT_SCHUR_P}_d${P0_SOFT_SCHUR_DPS}_producer.json" >/dev/null
    python3 verifier/physical_soft_short_signed_schur_replay.py \
      --artifact "artifacts/physical_soft_short_signed_schur/p${P0_SOFT_SCHUR_P}_d${P0_SOFT_SCHUR_DPS}_producer.json" \
      --output "artifacts/physical_soft_short_signed_schur/p${P0_SOFT_SCHUR_P}_d${P0_SOFT_SCHUR_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/full_source_coframe_rank
for P0_COFRAME_P in 5 9; do
  for P0_COFRAME_DPS in 80 160; do
    python3 src/full_source_coframe_rank.py \
      --lambda-numerator "$P0_COFRAME_P" --dps "$P0_COFRAME_DPS" \
      --output "artifacts/full_source_coframe_rank/p${P0_COFRAME_P}_d${P0_COFRAME_DPS}_producer.json" >/dev/null
    python3 verifier/full_source_coframe_rank_replay.py \
      --artifact "artifacts/full_source_coframe_rank/p${P0_COFRAME_P}_d${P0_COFRAME_DPS}_producer.json" \
      --output "artifacts/full_source_coframe_rank/p${P0_COFRAME_P}_d${P0_COFRAME_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/matched_high_moment_coframe
for P0_MATCHED_MOMENT_P in 5 9; do
  for P0_MATCHED_MOMENT_DPS in 80 160; do
    python3 src/matched_high_moment_coframe.py \
      --lambda-numerator "$P0_MATCHED_MOMENT_P" --dps "$P0_MATCHED_MOMENT_DPS" \
      --output "artifacts/matched_high_moment_coframe/p${P0_MATCHED_MOMENT_P}_d${P0_MATCHED_MOMENT_DPS}_producer.json" >/dev/null
    python3 verifier/matched_high_moment_coframe_replay.py \
      "artifacts/matched_high_moment_coframe/p${P0_MATCHED_MOMENT_P}_d${P0_MATCHED_MOMENT_DPS}_producer.json" \
      --output "artifacts/matched_high_moment_coframe/p${P0_MATCHED_MOMENT_P}_d${P0_MATCHED_MOMENT_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/matched_breakpoint_directional_moment
for P0_BREAKPOINT_MOMENT_P in 5 9; do
  for P0_BREAKPOINT_MOMENT_DPS in 80 160; do
    python3 src/matched_breakpoint_directional_moment.py \
      --lambda-numerator "$P0_BREAKPOINT_MOMENT_P" --dps "$P0_BREAKPOINT_MOMENT_DPS" \
      --output "artifacts/matched_breakpoint_directional_moment/p${P0_BREAKPOINT_MOMENT_P}_d${P0_BREAKPOINT_MOMENT_DPS}_producer.json" >/dev/null
    python3 verifier/matched_breakpoint_directional_moment_replay.py \
      "artifacts/matched_breakpoint_directional_moment/p${P0_BREAKPOINT_MOMENT_P}_d${P0_BREAKPOINT_MOMENT_DPS}_producer.json" \
      --output "artifacts/matched_breakpoint_directional_moment/p${P0_BREAKPOINT_MOMENT_P}_d${P0_BREAKPOINT_MOMENT_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/soft_defect_prolate_angle
for P0_SOFT_ANGLE_P in 5 9; do
  for P0_SOFT_ANGLE_DPS in 80 160; do
    python3 src/soft_defect_prolate_angle.py \
      --lambda-numerator "$P0_SOFT_ANGLE_P" --dps "$P0_SOFT_ANGLE_DPS" \
      --output "artifacts/soft_defect_prolate_angle/p${P0_SOFT_ANGLE_P}_d${P0_SOFT_ANGLE_DPS}_producer.json" >/dev/null
    python3 verifier/soft_defect_prolate_angle_replay.py \
      --input "artifacts/soft_defect_prolate_angle/p${P0_SOFT_ANGLE_P}_d${P0_SOFT_ANGLE_DPS}_producer.json" \
      --output "artifacts/soft_defect_prolate_angle/p${P0_SOFT_ANGLE_P}_d${P0_SOFT_ANGLE_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/physical_defect_adjoint_tail
for P0_DEFECT_TAIL_P in 5 9; do
  for P0_DEFECT_TAIL_DPS in 80 160; do
    python3 src/physical_defect_adjoint_tail.py \
      --lambda-numerator "$P0_DEFECT_TAIL_P" --dps "$P0_DEFECT_TAIL_DPS" \
      --output "artifacts/physical_defect_adjoint_tail/p${P0_DEFECT_TAIL_P}_d${P0_DEFECT_TAIL_DPS}_producer.json" >/dev/null
    python3 verifier/physical_defect_adjoint_tail_replay.py \
      --input "artifacts/physical_defect_adjoint_tail/p${P0_DEFECT_TAIL_P}_d${P0_DEFECT_TAIL_DPS}_producer.json" \
      --output "artifacts/physical_defect_adjoint_tail/p${P0_DEFECT_TAIL_P}_d${P0_DEFECT_TAIL_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/log_feature_capture_alignment
for P0_LOG_FEATURE_P in 5 9; do
  for P0_LOG_FEATURE_DPS in 80 160; do
    python3 src/log_feature_capture_alignment.py \
      --lambda-numerator "$P0_LOG_FEATURE_P" --dps "$P0_LOG_FEATURE_DPS" \
      --output "artifacts/log_feature_capture_alignment/p${P0_LOG_FEATURE_P}_d${P0_LOG_FEATURE_DPS}_producer.json" >/dev/null
    python3 verifier/log_feature_capture_alignment_replay.py \
      --input "artifacts/log_feature_capture_alignment/p${P0_LOG_FEATURE_P}_d${P0_LOG_FEATURE_DPS}_producer.json" \
      --output "artifacts/log_feature_capture_alignment/p${P0_LOG_FEATURE_P}_d${P0_LOG_FEATURE_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/intrinsic_feature_dyadic_defect
for P0_INTRINSIC_FEATURE_P in 5 9; do
  for P0_INTRINSIC_FEATURE_DPS in 80 160; do
    python3 src/intrinsic_feature_dyadic_defect.py \
      --lambda-numerator "$P0_INTRINSIC_FEATURE_P" --dps "$P0_INTRINSIC_FEATURE_DPS" \
      --output "artifacts/intrinsic_feature_dyadic_defect/p${P0_INTRINSIC_FEATURE_P}_d${P0_INTRINSIC_FEATURE_DPS}_producer.json" >/dev/null
    python3 verifier/intrinsic_feature_dyadic_defect_replay.py \
      --input "artifacts/intrinsic_feature_dyadic_defect/p${P0_INTRINSIC_FEATURE_P}_d${P0_INTRINSIC_FEATURE_DPS}_producer.json" \
      --output "artifacts/intrinsic_feature_dyadic_defect/p${P0_INTRINSIC_FEATURE_P}_d${P0_INTRINSIC_FEATURE_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/weighted_spectral_alignment_chebyshev_edge
for P0_WEIGHTED_EDGE_P in 5 9; do
  for P0_WEIGHTED_EDGE_DPS in 80 160; do
    python3 src/weighted_spectral_alignment_chebyshev_edge.py \
      --lambda-numerator "$P0_WEIGHTED_EDGE_P" --dps "$P0_WEIGHTED_EDGE_DPS" \
      --output "artifacts/weighted_spectral_alignment_chebyshev_edge/p${P0_WEIGHTED_EDGE_P}_d${P0_WEIGHTED_EDGE_DPS}_producer.json" >/dev/null
    python3 verifier/weighted_spectral_alignment_chebyshev_edge_replay.py \
      --input "artifacts/weighted_spectral_alignment_chebyshev_edge/p${P0_WEIGHTED_EDGE_P}_d${P0_WEIGHTED_EDGE_DPS}_producer.json" \
      --output "artifacts/weighted_spectral_alignment_chebyshev_edge/p${P0_WEIGHTED_EDGE_P}_d${P0_WEIGHTED_EDGE_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/mellin_projection_soft_symbol_graph_spill
for P0_GRAPH_SPILL_P in 5 9; do
  for P0_GRAPH_SPILL_DPS in 80 160; do
    python3 src/mellin_projection_soft_symbol_graph_spill.py \
      --lambda-numerator "$P0_GRAPH_SPILL_P" --dps "$P0_GRAPH_SPILL_DPS" \
      --output "artifacts/mellin_projection_soft_symbol_graph_spill/p${P0_GRAPH_SPILL_P}_d${P0_GRAPH_SPILL_DPS}_producer.json" >/dev/null
    python3 verifier/mellin_projection_soft_symbol_graph_spill_replay.py \
      --input "artifacts/mellin_projection_soft_symbol_graph_spill/p${P0_GRAPH_SPILL_P}_d${P0_GRAPH_SPILL_DPS}_producer.json" \
      --output "artifacts/mellin_projection_soft_symbol_graph_spill/p${P0_GRAPH_SPILL_P}_d${P0_GRAPH_SPILL_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/covariance_annular_odd_subsequence
for P0_COVARIANCE_ANNULAR_P in 5 9; do
  for P0_COVARIANCE_ANNULAR_DPS in 80 160; do
    python3 src/covariance_annular_odd_subsequence.py \
      --lambda-numerator "$P0_COVARIANCE_ANNULAR_P" \
      --dps "$P0_COVARIANCE_ANNULAR_DPS" \
      --output "artifacts/covariance_annular_odd_subsequence/p${P0_COVARIANCE_ANNULAR_P}_d${P0_COVARIANCE_ANNULAR_DPS}_producer.json" >/dev/null
    python3 verifier/covariance_annular_odd_subsequence_replay.py \
      --input "artifacts/covariance_annular_odd_subsequence/p${P0_COVARIANCE_ANNULAR_P}_d${P0_COVARIANCE_ANNULAR_DPS}_producer.json" \
      --output "artifacts/covariance_annular_odd_subsequence/p${P0_COVARIANCE_ANNULAR_P}_d${P0_COVARIANCE_ANNULAR_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/residue_coframe_mixed_krylov
for P0_RESIDUE_KRYLOV_P in 5 9; do
  for P0_RESIDUE_KRYLOV_DPS in 80 160; do
    python3 src/residue_coframe_mixed_krylov.py \
      --lambda-numerator "$P0_RESIDUE_KRYLOV_P" \
      --dps "$P0_RESIDUE_KRYLOV_DPS" \
      --output "artifacts/residue_coframe_mixed_krylov/p${P0_RESIDUE_KRYLOV_P}_d${P0_RESIDUE_KRYLOV_DPS}_producer.json" >/dev/null
    python3 verifier/residue_coframe_mixed_krylov_replay.py \
      --input "artifacts/residue_coframe_mixed_krylov/p${P0_RESIDUE_KRYLOV_P}_d${P0_RESIDUE_KRYLOV_DPS}_producer.json" \
      --output "artifacts/residue_coframe_mixed_krylov/p${P0_RESIDUE_KRYLOV_P}_d${P0_RESIDUE_KRYLOV_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/effective_mixed_endpoint_jump
for P0_EFFECTIVE_MIXED_JUMP_P in 5 9; do
  for P0_EFFECTIVE_MIXED_JUMP_DPS in 80 160; do
    python3 src/effective_mixed_endpoint_jump.py \
      --lambda-numerator "$P0_EFFECTIVE_MIXED_JUMP_P" \
      --dps "$P0_EFFECTIVE_MIXED_JUMP_DPS" \
      --output "artifacts/effective_mixed_endpoint_jump/p${P0_EFFECTIVE_MIXED_JUMP_P}_d${P0_EFFECTIVE_MIXED_JUMP_DPS}_producer.json" >/dev/null
    python3 verifier/effective_mixed_endpoint_jump_replay.py \
      --input "artifacts/effective_mixed_endpoint_jump/p${P0_EFFECTIVE_MIXED_JUMP_P}_d${P0_EFFECTIVE_MIXED_JUMP_DPS}_producer.json" \
      --output "artifacts/effective_mixed_endpoint_jump/p${P0_EFFECTIVE_MIXED_JUMP_P}_d${P0_EFFECTIVE_MIXED_JUMP_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/explicit_mixed_prefix_cost
for P0_EXPLICIT_MIXED_LAMBDA in 5/2 9/2; do
  case "$P0_EXPLICIT_MIXED_LAMBDA" in
    5/2) P0_EXPLICIT_MIXED_TAG="lambda5_2" ;;
    9/2) P0_EXPLICIT_MIXED_TAG="lambda9_2" ;;
  esac
  for P0_EXPLICIT_MIXED_DPS in 80 160; do
    python3 src/explicit_mixed_prefix_cost.py \
      --lambda "$P0_EXPLICIT_MIXED_LAMBDA" \
      --dps "$P0_EXPLICIT_MIXED_DPS" \
      --output "artifacts/explicit_mixed_prefix_cost/${P0_EXPLICIT_MIXED_TAG}_d${P0_EXPLICIT_MIXED_DPS}_producer.json" >/dev/null
    python3 verifier/explicit_mixed_prefix_cost_replay.py \
      --input "artifacts/explicit_mixed_prefix_cost/${P0_EXPLICIT_MIXED_TAG}_d${P0_EXPLICIT_MIXED_DPS}_producer.json" \
      --output "artifacts/explicit_mixed_prefix_cost/${P0_EXPLICIT_MIXED_TAG}_d${P0_EXPLICIT_MIXED_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/effective_mixed_signed_quotient
for P0_EFFECTIVE_QUOTIENT_P in 5 9; do
  for P0_EFFECTIVE_QUOTIENT_DPS in 80 160; do
    python3 src/effective_mixed_signed_quotient.py \
      --lambda-numerator "$P0_EFFECTIVE_QUOTIENT_P" \
      --dps "$P0_EFFECTIVE_QUOTIENT_DPS" \
      --output "artifacts/effective_mixed_signed_quotient/p${P0_EFFECTIVE_QUOTIENT_P}_d${P0_EFFECTIVE_QUOTIENT_DPS}_producer.json" >/dev/null
    python3 verifier/effective_mixed_signed_quotient_replay.py \
      --input "artifacts/effective_mixed_signed_quotient/p${P0_EFFECTIVE_QUOTIENT_P}_d${P0_EFFECTIVE_QUOTIENT_DPS}_producer.json" \
      --output "artifacts/effective_mixed_signed_quotient/p${P0_EFFECTIVE_QUOTIENT_P}_d${P0_EFFECTIVE_QUOTIENT_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/odd_nu_transverse_sign
for P0_ODD_NU_P in 5 9; do
  for P0_ODD_NU_DPS in 80 160; do
    python3 src/odd_nu_transverse_sign.py \
      --lambda-numerator "$P0_ODD_NU_P" \
      --dps "$P0_ODD_NU_DPS" \
      --output "artifacts/odd_nu_transverse_sign/p${P0_ODD_NU_P}_d${P0_ODD_NU_DPS}_producer.json" >/dev/null
    python3 verifier/odd_nu_transverse_sign_replay.py \
      --input "artifacts/odd_nu_transverse_sign/p${P0_ODD_NU_P}_d${P0_ODD_NU_DPS}_producer.json" \
      --output "artifacts/odd_nu_transverse_sign/p${P0_ODD_NU_P}_d${P0_ODD_NU_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/pnt_discrepancy_normal_form
for P0_PNT_NORMAL_DPS in 80 160; do
  python3 src/pnt_discrepancy_normal_form.py \
    --lambda 2 --N 2 --dps "$P0_PNT_NORMAL_DPS" \
    --output "artifacts/pnt_discrepancy_normal_form/lambda2_N2_dps${P0_PNT_NORMAL_DPS}_producer.json" >/dev/null
  python3 verifier/pnt_discrepancy_normal_form_replay.py \
    "artifacts/pnt_discrepancy_normal_form/lambda2_N2_dps${P0_PNT_NORMAL_DPS}_producer.json" \
    --output "artifacts/pnt_discrepancy_normal_form/lambda2_N2_dps${P0_PNT_NORMAL_DPS}_replay.json" >/dev/null
done

mkdir -p artifacts/boundary_discrepancy_convolution
for P0_BOUNDARY_DPS in 80 160; do
  python3 src/boundary_discrepancy_convolution.py \
    --lambda 2 --N 2 --dps "$P0_BOUNDARY_DPS" --reserve-bound-B 2 \
    --output "artifacts/boundary_discrepancy_convolution/lambda2_N2_dps${P0_BOUNDARY_DPS}_producer.json" >/dev/null
  python3 verifier/boundary_discrepancy_convolution_replay.py \
    "artifacts/boundary_discrepancy_convolution/lambda2_N2_dps${P0_BOUNDARY_DPS}_producer.json" \
    --output "artifacts/boundary_discrepancy_convolution/lambda2_N2_dps${P0_BOUNDARY_DPS}_replay.json" >/dev/null
done

mkdir -p artifacts/residual_ridged_fixed_window
for P0_RIDGED_WINDOW_DPS in 40 80; do
  python3 src/residual_ridged_fixed_window_pilot.py \
    --lambda 2 --N 4 --T 1 --dps "$P0_RIDGED_WINDOW_DPS" \
    --prolate-basis-size 30 \
    --output "artifacts/residual_ridged_fixed_window/lambda2_N4_T1_dps${P0_RIDGED_WINDOW_DPS}_producer.json" >/dev/null
  python3 verifier/residual_ridged_fixed_window_replay.py \
    "artifacts/residual_ridged_fixed_window/lambda2_N4_T1_dps${P0_RIDGED_WINDOW_DPS}_producer.json" \
    --output "artifacts/residual_ridged_fixed_window/lambda2_N4_T1_dps${P0_RIDGED_WINDOW_DPS}_replay.json" >/dev/null
done

mkdir -p artifacts/checkpoint063_moment_angle_constrained_ground
for P0_CHECKPOINT063_DPS in 40 80; do
  python3 src/checkpoint063_moment_angle_constrained_ground.py \
    --lambda 2 --N 4 --dps "$P0_CHECKPOINT063_DPS" \
    --prolate-basis-size 30 \
    --output "artifacts/checkpoint063_moment_angle_constrained_ground/lambda2_N4_dps${P0_CHECKPOINT063_DPS}_producer.json" >/dev/null
  python3 verifier/checkpoint063_moment_angle_constrained_ground_replay.py \
    "artifacts/checkpoint063_moment_angle_constrained_ground/lambda2_N4_dps${P0_CHECKPOINT063_DPS}_producer.json" \
    --output "artifacts/checkpoint063_moment_angle_constrained_ground/lambda2_N4_dps${P0_CHECKPOINT063_DPS}_replay.json" >/dev/null
done
(
  cd artifacts/checkpoint063_moment_angle_constrained_ground
  shasum -a 256 README.md \
    lambda2_N4_dps40_producer.json lambda2_N4_dps40_replay.json \
    lambda2_N4_dps80_producer.json lambda2_N4_dps80_replay.json \
    > SHA256SUMS
)

mkdir -p artifacts/checkpoint064_reciprocal_secant
for P0_CHECKPOINT064_DPS in 40 80; do
  python3 src/checkpoint064_reciprocal_secant.py \
    --lambda 2 --N 4 --T 1 --dps "$P0_CHECKPOINT064_DPS" \
    --prolate-basis-size 30 --arithmetic-sum-cutoff 32 \
    --output "artifacts/checkpoint064_reciprocal_secant/lambda2_N4_T1_dps${P0_CHECKPOINT064_DPS}_producer.json" >/dev/null
  python3 verifier/checkpoint064_reciprocal_secant_replay.py \
    "artifacts/checkpoint064_reciprocal_secant/lambda2_N4_T1_dps${P0_CHECKPOINT064_DPS}_producer.json" \
    --output "artifacts/checkpoint064_reciprocal_secant/lambda2_N4_T1_dps${P0_CHECKPOINT064_DPS}_replay.json" >/dev/null
done
(
  cd artifacts/checkpoint064_reciprocal_secant
  shasum -a 256 README.md \
    lambda2_N4_T1_dps40_producer.json lambda2_N4_T1_dps40_replay.json \
    lambda2_N4_T1_dps80_producer.json lambda2_N4_T1_dps80_replay.json \
    > SHA256SUMS
)

mkdir -p artifacts/checkpoint065_shorted_secant
for P0_CHECKPOINT065_DPS in 40 80; do
  python3 src/checkpoint065_shorted_secant.py \
    --lambda 2 --N 4 --T 1 --dps "$P0_CHECKPOINT065_DPS" \
    --output "artifacts/checkpoint065_shorted_secant/lambda2_N4_T1_dps${P0_CHECKPOINT065_DPS}_producer.json" >/dev/null
  python3 verifier/checkpoint065_shorted_secant_replay.py \
    "artifacts/checkpoint065_shorted_secant/lambda2_N4_T1_dps${P0_CHECKPOINT065_DPS}_producer.json" \
    --output "artifacts/checkpoint065_shorted_secant/lambda2_N4_T1_dps${P0_CHECKPOINT065_DPS}_replay.json" >/dev/null
done
(
  cd artifacts/checkpoint065_shorted_secant
  shasum -a 256 README.md \
    lambda2_N4_T1_dps40_producer.json lambda2_N4_T1_dps40_replay.json \
    lambda2_N4_T1_dps80_producer.json lambda2_N4_T1_dps80_replay.json \
    > SHA256SUMS
)

mkdir -p artifacts/checkpoint066_finite_increment_response
for P0_CHECKPOINT066_DPS in 40 80; do
  python3 src/checkpoint066_finite_increment_response.py \
    --lambda 2 --N 4 --T 1 --dps "$P0_CHECKPOINT066_DPS" \
    --output "artifacts/checkpoint066_finite_increment_response/lambda2_N4_T1_dps${P0_CHECKPOINT066_DPS}_producer.json" >/dev/null
  python3 verifier/checkpoint066_finite_increment_response_replay.py \
    "artifacts/checkpoint066_finite_increment_response/lambda2_N4_T1_dps${P0_CHECKPOINT066_DPS}_producer.json" \
    --output "artifacts/checkpoint066_finite_increment_response/lambda2_N4_T1_dps${P0_CHECKPOINT066_DPS}_replay.json" >/dev/null
done
(
  cd artifacts/checkpoint066_finite_increment_response
  shasum -a 256 README.md \
    lambda2_N4_T1_dps40_producer.json lambda2_N4_T1_dps40_replay.json \
    lambda2_N4_T1_dps80_producer.json lambda2_N4_T1_dps80_replay.json \
    > SHA256SUMS
)

mkdir -p artifacts/checkpoint067_ritz_moment_transfer
for P0_CHECKPOINT067_DPS in 40 80; do
  python3 src/checkpoint067_ritz_moment_transfer.py \
    --lambda 2 --N 4 --T 1 --dps "$P0_CHECKPOINT067_DPS" \
    --output "artifacts/checkpoint067_ritz_moment_transfer/lambda2_N4_T1_dps${P0_CHECKPOINT067_DPS}_producer.json" >/dev/null
  python3 verifier/checkpoint067_ritz_moment_transfer_replay.py \
    "artifacts/checkpoint067_ritz_moment_transfer/lambda2_N4_T1_dps${P0_CHECKPOINT067_DPS}_producer.json" \
    --output "artifacts/checkpoint067_ritz_moment_transfer/lambda2_N4_T1_dps${P0_CHECKPOINT067_DPS}_replay.json" >/dev/null
done
(
  cd artifacts/checkpoint067_ritz_moment_transfer
  shasum -a 256 README.md \
    lambda2_N4_T1_dps40_producer.json lambda2_N4_T1_dps40_replay.json \
    lambda2_N4_T1_dps80_producer.json lambda2_N4_T1_dps80_replay.json \
    > SHA256SUMS
)

mkdir -p artifacts/checkpoint068_ritz_projective_low_mode
for P0_CHECKPOINT068_DPS in 40 80; do
  python3 src/checkpoint068_ritz_projective_low_mode.py \
    --lambda 2 --N 4 --M 2 --theta 1 --dps "$P0_CHECKPOINT068_DPS" \
    --output "artifacts/checkpoint068_ritz_projective_low_mode/lambda2_N4_M2_theta1_dps${P0_CHECKPOINT068_DPS}_producer.json" >/dev/null
  python3 verifier/checkpoint068_ritz_projective_low_mode_replay.py \
    "artifacts/checkpoint068_ritz_projective_low_mode/lambda2_N4_M2_theta1_dps${P0_CHECKPOINT068_DPS}_producer.json" \
    --output "artifacts/checkpoint068_ritz_projective_low_mode/lambda2_N4_M2_theta1_dps${P0_CHECKPOINT068_DPS}_replay.json" >/dev/null
done
(
  cd artifacts/checkpoint068_ritz_projective_low_mode
  shasum -a 256 README.md \
    lambda2_N4_M2_theta1_dps40_producer.json lambda2_N4_M2_theta1_dps40_replay.json \
    lambda2_N4_M2_theta1_dps80_producer.json lambda2_N4_M2_theta1_dps80_replay.json \
    > SHA256SUMS
)

mkdir -p artifacts/checkpoint069_ground_projective_response
for P0_CHECKPOINT069_DPS in 40 80; do
  python3 src/checkpoint069_ground_projective_response.py \
    --lambda 2 --N 4 --M 2 --dps "$P0_CHECKPOINT069_DPS" \
    --output "artifacts/checkpoint069_ground_projective_response/lambda2_N4_M2_dps${P0_CHECKPOINT069_DPS}_producer.json" >/dev/null
  python3 verifier/checkpoint069_ground_projective_response_replay.py \
    "artifacts/checkpoint069_ground_projective_response/lambda2_N4_M2_dps${P0_CHECKPOINT069_DPS}_producer.json" \
    --output "artifacts/checkpoint069_ground_projective_response/lambda2_N4_M2_dps${P0_CHECKPOINT069_DPS}_replay.json" >/dev/null
done
(
  cd artifacts/checkpoint069_ground_projective_response
  shasum -a 256 README.md \
    lambda2_N4_M2_dps40_producer.json lambda2_N4_M2_dps40_replay.json \
    lambda2_N4_M2_dps80_producer.json lambda2_N4_M2_dps80_replay.json \
    > SHA256SUMS
)

mkdir -p artifacts/checkpoint070_natural_cutoff_ground_alignment
for P0_CHECKPOINT070_DPS in 40 80; do
  python3 src/checkpoint070_natural_cutoff_ground_alignment.py \
    --lambda 2 --N 8 --M 2 --basis-size 60 \
    --dps "$P0_CHECKPOINT070_DPS" \
    --output "artifacts/checkpoint070_natural_cutoff_ground_alignment/lambda2_N8_M2_dps${P0_CHECKPOINT070_DPS}_producer.json" >/dev/null
  python3 verifier/checkpoint070_natural_cutoff_ground_alignment_replay.py \
    "artifacts/checkpoint070_natural_cutoff_ground_alignment/lambda2_N8_M2_dps${P0_CHECKPOINT070_DPS}_producer.json" \
    --output "artifacts/checkpoint070_natural_cutoff_ground_alignment/lambda2_N8_M2_dps${P0_CHECKPOINT070_DPS}_replay.json" >/dev/null
done
(
  cd artifacts/checkpoint070_natural_cutoff_ground_alignment
  shasum -a 256 README.md \
    lambda2_N8_M2_dps40_producer.json lambda2_N8_M2_dps40_replay.json \
    lambda2_N8_M2_dps80_producer.json lambda2_N8_M2_dps80_replay.json \
    > SHA256SUMS
)

python3 verifier/live_prolate_krylov_schur_audit.py >/dev/null

PYTHONPATH=src python3 -B -m unittest \
  tests.test_q_shift_sector_weil_core_gate \
  tests.test_secant_bulk_positive_determinant_response \
  tests.test_secant_graph_signed_leakage_gate \
  tests.test_checkpoint066_finite_increment_response \
  tests.test_ritz_moment_self_regularized_transfer \
  tests.test_checkpoint067_ritz_moment_transfer \
  tests.test_ritz_projective_low_mode_determinant_gate \
  tests.test_checkpoint068_ritz_projective_low_mode \
  tests.test_source_compatible_ground_projective_response \
  tests.test_checkpoint069_ground_projective_response \
  tests.test_natural_cutoff_signed_ground_alignment \
  tests.test_checkpoint070_natural_cutoff_ground_alignment \
  tests.test_even_sector_cross_root_limit_bridge \
  tests.test_fixed_lambda_galerkin_alignment_no_go \
  tests.test_even_odd_multiplicity_krylov_simplicity \
  tests.test_prolate_anchor_strip_root_no_go \
  tests.test_canonical_boundary_ground_cross_root \
  tests.test_harmonic_alignment_source_metric_no_go \
  tests.test_canonical_ground_mixed_projector_overlap \
  tests.test_screened_near_null_forcing_response \
  tests.test_source_cauchy_selector_cone_projective_tradeoff \
  tests.test_parity_collision_projector_orientation \
  tests.test_screened_feedback_origin_collapse \
  tests.test_spectral_cluster_diagonal_selector_bridge \
  tests.test_diagonal_anchor_forcing_signed_laplacian_strip_gate \
  tests.test_natural_cutoff_negative_real_root_exclusion \
  tests.test_anchored_weil_dirichlet_contractive_routing \
  tests.test_natural_cutoff_strip_winding_index \
  tests.test_natural_cutoff_shrinking_collar_escape_reduction \
  tests.test_actual_source_anchored_routing_vertex_obstruction \
  tests.test_verified_height_shrinking_collar_partial_theorem \
  tests.test_anchored_central_degree_screw_barrier \
  tests.test_anchored_vertex_one_resonant_screw_moment_barrier \
  tests.test_screw_margin_collective_routing_rank_one_barrier \
  tests.test_full_source_cauchy_anchor_forcing_feasibility \
  tests.test_centered_zero_gram_simultaneous_vertex_subsequence \
  tests.test_adaptive_outer_cutoff_hyperbolicity_barrier \
  tests.test_moving_tail_phase_weighted_xi_gram_barrier \
  tests.test_lp_fourier_cardinal_infinite_nonhyperbolic_subsequence \
  tests.test_finite_gram_defect_transverse_frame_barrier \
  tests.test_attained_right_edge_vector_selection_theorem \
  tests.test_actual_zero_feature_deflated_frame_barrier \
  tests.test_lp_fourier_cardinal_all_sections_nonhyperbolic \
  tests.test_prime_side_signed_riesz_history_barrier \
  tests.test_global_rms_counterconfiguration_and_a3_fejer_boundary \
  tests.test_actual_zero_fourth_moment_history_reduction \
  tests.test_global_fourth_moment_diagonal_counterconfiguration \
  tests.test_nonattained_high_edge_record_filter_theorem \
  tests.test_individual_filtered_degree_landau_theorem \
  tests.test_growing_positive_degree_prefix_laplacian_no_go \
  tests.test_first_laplacian_minor_turan_barrier \
  tests.test_fixed_prefix_laplacian_covariance_schur_barrier \
  tests.test_unique_attained_edge_first_minor_obstruction \
  tests.test_fixed_prefix_edge_sign_synchronization \
  tests.test_finite_attained_edge_antipodal_turan_obstruction \
  tests.test_countable_attained_edge_antipodal_nonflatness_theorem \
  tests.test_finite_edge_phase_synchronization_criteria \
  tests.test_two_frequency_phase_transversality_theorem \
  tests.test_short_gap_two_frequency_phase_theorem \
  tests.test_generic_finite_phase_transversality_resultant \
  tests.test_common_root_lift_bound_two_frequency_theorem \
  tests.test_one_four_phase_transversality_theorem \
  tests.test_one_even_family_phase_synchronization_theorem \
  tests.test_adaptive_all_even_prefix_bridge_obstruction \
  tests.test_anisotropic_schur_identical_marginals_no_go \
  tests.test_low_block_forcing_rate_full_metric_barrier \
  tests.test_transported_signed_kernel_left_reserve_barrier \
  tests.test_one_sided_loewner_action_transfer_barrier \
  tests.test_fixed_label_eight_arithmetic_synthesis_gain \
  tests.test_fixed_label_six_odd_arithmetic_synthesis_gain \
  tests.test_growing_rest_signed_radical_tail_schur_reduction \
  tests.test_fixed_even_prefix_arithmetic_synthesis_theorem \
  tests.test_restricted_forcing_action_transfer_theorem \
  tests.test_fixed_even_prefix_diagonal_covariance_collapse_and_signed_tail_dichotomy \
  tests.test_fixed_even_endpoint_null_volterra_pnt_correlation_barrier \
  tests.test_fixed_even_endpoint_null_bernoulli_prime_quadrature_bound \
  tests.test_real_window_to_zero_tail_carrier_transfer_barrier \
  tests.test_fixed_endpoint_bernoulli_matrix_quadrature_and_jet_growth_theorem \
  tests.test_moving_label_carrier_coframe_defect_right_inverse_theorem \
  tests.test_fixed_even_endpoint_null_complete_volterra_caustic_quadrature_theorem \
  tests.test_fixed_even_endpoint_null_archimedean_floor_theorem \
  tests.test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem \
  tests.test_reciprocal_chi4_von_mangoldt_dyadic_cancellation_theorem \
  tests.test_growing_transition_equality_conductor_garding_theorem \
  tests.test_growing_transition_subcritical_lg_action_bv_theorem \
  tests.test_growing_transition_weber_edge_reciprocal_channel_theorem \
  tests.test_growing_transition_edge_edge_higher_alias_theorem \
  tests.test_growing_transition_complete_central_form_reduction \
  tests.test_outer_outer_spectral_theorem_erratum \
  tests.test_growing_transition_complete_central_plemelj_cauchy_floor_theorem \
  tests.test_growing_transition_both_miss_reciprocal_core_theorem \
  tests.test_growing_transition_post_plemelj_regular_action_reduction_theorem \
  tests.test_growing_transition_finite_fejer_post_core_quantifier_theorem \
  tests.test_growing_transition_edge_carleman_scattering_obstruction \
  tests.test_growing_transition_finite_fejer_xi_wronskian_assembly_gate \
  tests.test_growing_transition_locked_carrier_flat_scalar_sum_theorem \
  tests.test_growing_transition_direct_source_upper_form_theorem \
  tests.test_growing_transition_ordered_direct_profile_continuation_two_jet_shear_reduction_theorem \
  tests.test_growing_transition_higher_sampler_affine_carleman_scalar_gate_theorem \
  tests.test_growing_transition_complete_flat_weber_zero_residue_obstruction_theorem \
  tests.test_growing_transition_continuous_m11_unconditional_narrow_schedule \
  tests.test_growing_transition_curved_two_endpoint_fio_shell_theorem \
  tests.test_growing_transition_polylog_base_continuous_prime_shell_corollary \
  tests.test_bonami_karoui_pswf_action_source_lock \
  tests.test_growing_transition_absolute_sampling_forced_cancellation_barrier \
  tests.test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem \
  tests.test_growing_transition_local_cross_vs_equality_representative_cancellation_barrier \
  tests.test_growing_transition_continuous_odd_laplace_common_representative_barrier \
  tests.test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem \
  tests.test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem \
  tests.test_growing_transition_global_radical_sector_mixing_feature_geometry_barrier \
  tests.test_growing_transition_eta_null_renormalized_source_krein_intertwiner_theorem \
  tests.test_growing_transition_hadamard_pick_carrier_rh_equivalence_theorem \
  tests.test_growing_transition_odd_laplace_middle_band_alias_frame_obstruction_theorem \
  tests.test_growing_transition_one_sided_odd_laplace_row_and_forward_alias_theorem \
  tests.test_growing_transition_odd_laplace_euler_resolvent_mixed_edge_alias_reduction_theorem \
  tests.test_growing_transition_euler_resolvent_curved_hard_alias_completion_theorem \
  tests.test_growing_transition_complete_odd_laplace_tail_theorem \
  tests.test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem \
  tests.test_growing_transition_ordered_nonresonant_prime_dyadic_localization_theorem \
  tests.test_growing_transition_ordered_prime_hard_tail_pnt_gram_reduction \
  tests.test_growing_transition_ordered_prime_far_annulus_dilation_large_sieve_theorem \
  tests.test_growing_transition_ordered_prime_near_band_fold_large_sieve_theorem \
  tests.test_growing_transition_ordered_prime_all_outward_hard_tail_divisor_regrouping_theorem \
  tests.test_growing_transition_ordered_prime_edge_union_moving_divisor_reduction_theorem \
  tests.test_growing_transition_ordered_prime_moving_divisor_density_discrepancy_volterra_theorem \
  tests.test_growing_transition_mixed_weber_ordinary_endpoint_obstruction_theorem \
  tests.test_growing_transition_discrepancy_zero_orbit_bernoulli_tail_barrier \
  tests.test_cyclic_mellin_graph_product_transition_packet_noncapture_barrier \
  tests.test_structured_full_block_exterior_metric_quotient_bridge_theorem \
  tests.test_lower_ritz_half_power_one_inverse_source_angle_reduction \
  tests.test_growing_transition_endpoint_null_collective_dilation_frame_reduction \
  tests.test_first_transverse_relative_leakage_endpoint_hierarchy_barrier \
  tests.test_growing_rest_transition_capture_fixed_plane_nonimplication_barrier \
  tests.test_anchor_label12_signed_cross_correlation_barrier \
  tests.test_fixed_4_12_complete_nonarchimedean_cross_theorem \
  tests.test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem \
  tests.test_anchor_label12_complete_weighted_cross_asymptotic_theorem \
  tests.test_fixed_to_growing_toeplitz_operator_norm_gate \
  tests.test_generic_fixed_inversion_even_complete_weighted_pair_theorem \
  tests.test_fixed_prefix_complete_signed_toeplitz_schur_theorem \
  tests.test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem \
  tests.test_growing_low_prefix_complete_profile_fio_reduction \
  tests.test_growing_low_prefix_signed_complement_assembly_gate \
  tests.test_growing_low_prefix_phase_absorbed_jost_bv_theorem \
  tests.test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem \
  tests.test_growing_low_prefix_endpoint_factored_fractional_frame_theorem \
  tests.test_growing_low_prefix_endpoint_compressed_same_side_prime_remainder_theorem \
  tests.test_growing_low_prefix_endpoint_compressed_reflected_stieltjes_theorem \
  tests.test_growing_low_prefix_outer_non_equality_remainder_theorem \
  tests.test_growing_low_prefix_outer_floor_assembly_theorem \
  tests.test_growing_odd_low_prefix_outer_floor_transfer_theorem \
  tests.test_growing_low_prefix_physical_coframe_half_power_schur_barrier \
  tests.test_growing_low_prefix_half_power_far_cross_theorem \
  tests.test_growing_mixed_bridge_gauge_pole_domain_barrier \
  tests.test_mixed_bridge_xi_over_s_boundary_obstruction_theorem \
  tests.test_growing_transition_near_wiener_hopf_retained_complement_reduction \
  tests.test_growing_mixed_bridge_radical_quotient_graph_core_barrier \
  tests.test_codimension_two_compact_state_quotient_graph_core_barrier_theorem \
  tests.test_growing_mixed_bridge_coherent_beta_row_floor_theorem \
  tests.test_growing_mixed_bridge_retained_complement_two_stage_schur_barrier \
  tests.test_growing_retained_negative_index_capture_barrier \
  tests.test_growing_mixed_bridge_actual_multiplier_dangerous_feshbach_reduction \
  tests.test_growing_multiplier_deficit_geometry_boundary_alias_barrier \
  tests.test_growing_signed_discrepancy_feshbach_passivity_scale_barrier \
  tests.test_growing_signed_discrepancy_centered_zero_krein_factorization_barrier \
  tests.test_fixed_source_block_shift_asymptotic_theorem \
  tests.test_growing_fixed_capture_multiplier_danger_nested_feshbach_barrier \
  tests.test_lower_ritz_residual_inverse_spread_determinant_split_theorem \
  tests.test_off_line_quartet_constrained_feature_detection_barrier \
  tests.test_growing_actual_symbol_boundary_gauge_phase_angle_barrier \
  tests.test_growing_lower_ritz_actual_remainder_fks_resolution_barrier \
  tests.test_lower_ritz_actual_schedule_label12_mellin_row_barrier \
  tests.test_lower_ritz_actual_label16_residual_capture_action_barrier \
  tests.test_lower_ritz_post_far_retained_inverse_row_theorem \
  tests.test_growing_anchor_row_full_metric_toeplitz_inverse_energy_barrier \
  tests.test_fixed_anchor_bv_cauchy_far_row_theorem \
  tests.test_lower_ritz_actual_multiplier_safe_returned_row_reduction_barrier \
  tests.test_lower_ritz_actual_multiplier_forcing_adapted_safe_elimination_theorem \
  tests.test_lower_ritz_post_far_captured_response_anchor_row_barrier \
  tests.test_lower_ritz_ground_ridge_forcing_adapted_dangerous_response_barrier \
  tests.test_lower_ritz_dangerous_response_arithmetic_krein_rh_gate_theorem \
  tests.test_capture_free_actual_ground_parity_response_barrier \
  tests.test_source_quotient_pick_herglotz_interlacing_barrier \
  tests.test_actual_ground_fixed_mode_residue_sign_barrier \
  tests.test_source_compatible_mixed_cofactor_deformation_barrier \
  tests.test_normalized_source_quotient_response_barrier \
  tests.test_opposite_boundary_twisted_weyl_source_quotient_barrier \
  tests.test_global_twisted_mass_strict_ritz_source_cauchy_barrier \
  tests.test_actual_source_row_paired_gram_exclusion_selector_moment_gate \
  tests.test_actual_global_twisted_cone_moving_grid_target_incompatibility \
  tests.test_strict_odd_selector_shell_localization_theorem \
  tests.test_q0_free_selector_secant_root_parity_theorem \
  tests.test_rh_conditional_fixed_zero_selector_capture_theorem \
  tests.test_shifted_zero_selector_gaussian_quadrature_barrier \
  tests.test_rh_odd_zero_gram_gevrey_relative_floor_barrier \
  tests.test_rh_zero_gaussian_square_free_limit_theorem \
  tests.test_rh_even_zero_gram_gevrey_relative_reserve_barrier \
  tests.test_local_uvarov_christoffel_saturation_barrier \
  tests.test_central_prolate_normalization_feedback_barrier \
  tests.test_rh_even_derivative_relative_leakage_comparison_barrier \
  tests.test_rh_even_quotient_endpoint_flat_floor_obstruction \
  tests.test_rh_even_endpoint_flat_ground_shift_ratio_barrier \
  tests.test_actual_endpoint_rational_variance_far_tail_barrier \
  tests.test_hsw_continuous_l_phase_shell_theorem \
  tests.test_rh_even_spectral_cluster_ground_primitive_evaluation_barrier \
  tests.test_ideal_stokes_alternating_cauchy_filter_reduction \
  tests.test_lp_cardinal_tail_finite_annihilator_barrier \
  tests.test_complex_mellin_action_phase_weighted_stokes_interface_reduction \
  tests.test_joint_hardy_cauchy_phase_energy_nonconcentration_barrier \
  tests.test_exact_prolate_mellin_recurrence_birkhoff_connection_barrier \
  tests.test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier \
  tests.test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier \
  tests.test_subturning_minimal_riccati_euler_closure_barrier \
  tests.test_fixed_grid_phase_alias_prime_divisor_shifted_convolution_barrier \
  tests.test_finite_gate_microplateau_source_cauchy_synchronization_barrier \
  tests.test_subturning_laplace_volterra_turning_resonance_barrier \
  tests.test_subturning_first_cherry_global_wiener_closure_barrier \
  tests.test_subturning_finite_order_newton_closure_theorem \
  tests.test_adaptive_gonek_exact_carrier_pw1_theorem \
  tests.test_adaptive_gonek_endpoint_filter_selection_theorem \
  tests.test_adaptive_prolate_stokes_endpoint_row_transfer_theorem \
  tests.test_rh_actual_odd_ground_primitive_christoffel_parity_barrier \
  tests.test_adaptive_prolate_saturation_divergence_orientation_barrier \
  tests.test_rh_actual_ground_christoffel_commutator_response_barrier \
  tests.test_critical_near_nyquist_two_branch_block_covariance_barrier \
  tests.test_critical_density_prolate_mellin_transport_connection_theorem \
  tests.test_adaptive_critical_exact_carrier_short_endpoint_covariance_theorem \
  tests.test_supercritical_full_source_adaptive_abel_tail_theorem \
  tests.test_critical_arithmetic_to_actual_scalar_transfer_theorem \
  tests.test_adaptive_critical_odd_halfgrid_literal_ceiling_transfer_theorem \
  tests.test_critical_scalar_floor_to_true_ground_row_deletion_barrier \
  tests.test_critical_odd_ground_mixed_vandermonde_cofactor_target \
  tests.test_critical_ground_negative_sobolev_no_escape_barrier \
  tests.test_unconditional_natural_halfgrid_crossroot_schedule_theorem \
  tests.test_crossroot_even_sector_projective_alignment_reduction_barrier \
  tests.test_first_zero_support_gap_geronimus_alignment_barrier \
  tests.test_natural_crossroot_weighted_projector_average_target \
  tests.test_unconditional_natural_halfgrid_hsw_scalar_to_even_frame_barrier \
  tests.test_natural_outer_shell_large_sieve_inverse_spread_barrier \
  tests.test_natural_gevrey_quasimode_temple_orientation_barrier \
  tests.test_natural_adjugate_plucker_inverse_christoffel_covariance_reduction_barrier \
  tests.test_natural_centered_gate_anchor_cofactor_nonemptiness_reduction_barrier \
  tests.test_natural_complete_source_kappa_deflated_coframe_obstruction \
  tests.test_halfgrid_gevrey_coframe_exponent_mismatch_barrier \
  tests.test_natural_multiple_ground_coordinate_shell_selector_projective_barrier \
  tests.test_natural_projected_anchor_shrinking_collar_coefficient_barrier \
  tests.test_natural_direct_bottom_projector_adjugate_alignment_barrier \
  tests.test_jensen_hyperbolicity_wedge_diagonal_limit_barrier \
  tests.test_cutoff_free_prolate_ground_alignment_rh_dichotomy \
  tests.test_cutoff_free_multi_anchor_ground_frame_barrier \
  tests.test_actual_phase_volume_centered_pnt_remainder_reduction_barrier \
  tests.test_cutoff_free_weighted_radical_coframe_reduction_barrier \
  tests.test_cutoff_free_uniform_radical_graph_transfer_theorem \
  tests.test_cutoff_free_full_source_adjoint_prolate_capture_barrier \
  tests.test_actual_centered_remainder_prime_fourth_moment_lower_barrier \
  tests.test_cutoff_free_dense_mixed_prefix_bridge_residual_barrier \
  tests.test_cutoff_free_bridge_leverage_rank_one_innovation_reduction \
  tests.test_actual_centered_remainder_prime_third_moment_half_alpha_barrier \
  tests.test_cutoff_free_bridge_mixed_adjoint_tail_prefactor_reduction \
  tests.test_actual_centered_remainder_long_block_hermite_moment_barrier \
  tests.test_cutoff_free_multiplier_dangerous_prolate_cross_angle_barrier \
  tests.test_actual_centered_remainder_fractional_block_odd_moment_ui_barrier \
  tests.test_actual_centered_remainder_shifted_correlation_top_moment_ui_barrier \
  tests.test_cutoff_free_actual_dangerous_adjoint_regularity_barrier \
  tests.test_cutoff_free_actual_dangerous_endpoint_jet_profile_observability_barrier \
  tests.test_actual_centered_remainder_top_even_near_band_global_cancellation_barrier \
  tests.test_actual_phase_volume_long_block_threshold_negative_index_barrier \
  tests.test_cutoff_free_one_direction_weighted_ground_capture_theorem \
  tests.test_cutoff_free_cyclicity_effective_dimension_capture_barrier \
  tests.test_actual_mixed_bridge_pole_row_resolvent_cancellation_reduction \
  tests.test_actual_dirichlet_moment_schatten_dangerous_space_barrier \
  tests.test_cutoff_free_commuting_filter_ground_capture_barrier \
  tests.test_actual_mixed_bridge_transverse_gap_energy_barrier \
  tests.test_actual_mixed_bridge_resolvent_mixed_measure_barrier \
  tests.test_cutoff_free_actual_radical_xi_ideal_translation_frame_barrier \
  tests.test_cutoff_free_actual_radical_floquet_xi_minimum_modulus_pair_c_barrier \
  tests.test_actual_mixed_bridge_individual_odd_finite_part_rh_barrier \
  tests.test_actual_mixed_bridge_compact_side_odd_carrier_transfer_theorem \
  tests.test_actual_mixed_bridge_continuous_compact_side_odd_carrier_transfer_theorem \
  tests.test_actual_mixed_bridge_odd_energy_capture_circularity_barrier -v
python3 src/write_artifact_manifest.py
python3 -m unittest tests.test_weighted_pnt_discrepancy_normal_form_source_lock -v
python3 -m unittest tests.test_boundary_discrepancy_convolution tests.test_boundary_discrepancy_convolution_source_lock -v
python3 -m unittest \
  tests.test_direct_soft_trace_reciprocal_reserve \
  tests.test_prolate_secant_radical_block_reduction \
  tests.test_checkpoint064_reciprocal_secant -v
python3 -m unittest \
  tests.test_secant_shorted_reciprocal_feshbach \
  tests.test_time_band_cauchy_determinant_response \
  tests.test_polynomial_xi_radical_tower_covariance_floor_obstruction \
  tests.test_checkpoint065_shorted_secant -v
python3 -m unittest \
  tests.test_first_prolate_correction \
  tests.test_all_order_prolate_flatness \
  tests.test_gevrey_prolate_remainder \
  tests.test_signed_shift_odd_floor_obstruction \
  tests.test_odd_zero_gram_lower_frame_audit \
  tests.test_anti_carrier_log_schedule \
  tests.test_relative_odd_gap_endpoint_schur \
  tests.test_boundary_weyl_evaluation_gram_sign_obstruction \
  tests.test_derivative_radical_odd_split \
  tests.test_zero_side_derivative_frame_source_limit \
  tests.test_higher_derivative_boundary_krylov \
  tests.test_tail_discrepancy_transverse_schur \
  tests.test_ritz_shifted_tail_discrepancy_schur \
  tests.test_even_krylov_ritz_escape \
  tests.test_tail_discrepancy_actual_source_schur_obstruction \
  tests.test_prolate_endpoint_schur_singular_asymptotics \
  tests.test_prolate_complete_leakage_higher_ritz_no_go \
  tests.test_common_radical_leakage_gram_orientation \
  tests.test_live_prolate_krylov_schur_audit \
  tests.test_positive_xi_kernel_fejer_ground_transfer \
  tests.test_unbounded_relative_orientation_instability \
  tests.test_positive_trial_ground_cone_angle_transfer \
  tests.test_p0_prolate_state_ball \
  tests.test_unadmitted_suzuki_shifted_metric \
  tests.test_unadmitted_suzuki_operator_weyl_transfer -v
