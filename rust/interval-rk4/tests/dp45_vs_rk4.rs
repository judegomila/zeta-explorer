//! imp-1086-sub-interval-dp45 -- DP45 vs RK4 certified-collision
//! cross-check acceptance test.
//!
//! Run BOTH integrators on the SAME initial gammas + SAME dt + SAME
//! step budget. Their certified collision brackets [t_c_lo, t_c_hi]
//! must agree to within 2 * max(wrapperWidth_rk4, wrapperWidth_dp45).
//!
//! This mirrors verner87_vs_rk4.rs (imp-1140) acceptance shape. The
//! rigorous triangulation tolerance comes from the same argument:
//! each method certifies a bracket whose endpoints are accurate to
//! its own wrapper width (the integrator-internal interval-arithmetic
//! inflation accumulated across all steps). Two SOUND methods
//! integrating the same flow must produce brackets whose centres lie
//! within the sum of the two half-widths -- bounded above by twice
//! the larger wrapper width. Disagreement wider than this envelope
//! indicates a real bug in at least one integrator and triggers a
//! stop-and-diagnose rather than a tolerance bump.
//!
//! Initial conditions: a deterministic lattice (1.0, 1.3, 1.6, ...).
//! We do NOT load the Riemann-zero reference data here because the
//! goal is integrator-to-integrator cross-check, not JS-vs-Rust
//! cross-check (the JS-reference n_1000_vs_js test already covers
//! the latter).
//!
//! Three tests:
//!   1. Two-particle micro test (N=2, certified-collision regime).
//!   2. N = 1000 (budget-exhausted regime).
//!   3. N = 5000 (budget-exhausted regime).

use interval_rk4::dp45::backward_collision_interval_dp45;
use interval_rk4::rk4::backward_collision_interval;
use std::time::Instant;

/// Build an N-particle deterministic lattice at spacing 1.3 starting
/// at gamma_0 = 1.0. Matches the lattice used by the verner87_vs_rk4
/// suite so the integrator-step cost is comparable across the audit.
fn build_lattice(n: usize) -> Vec<f64> {
    (0..n).map(|i| 1.0 + (i as f64) * 1.3).collect()
}

/// Compute the rigorous triangulation tolerance:
///   tol = 2 * max(wrapperWidth_rk4, wrapperWidth_dp45)
fn tolerance(rk4_w: f64, dp45_w: f64) -> f64 {
    2.0 * rk4_w.max(dp45_w)
}

/// Compare RK4 and DP45 bracket returns on identical inputs.
/// Returns (lo_diff, hi_diff, tolerance, agreed).
fn compare_brackets(
    label: &str,
    n: usize,
    initial_x: &[f64],
    dt: f64,
    n_steps: usize,
) -> (f64, f64, f64, bool) {
    let t0 = Instant::now();
    let rk4 = backward_collision_interval(initial_x, dt, n_steps);
    let rk4_ms = t0.elapsed().as_millis();

    let t1 = Instant::now();
    let dp = backward_collision_interval_dp45(initial_x, dt, n_steps);
    let dp_ms = t1.elapsed().as_millis();

    let lo_diff = (rk4.t_c_lo - dp.t_c_lo).abs();
    // For t_c_hi: finite-vs-finite => abs diff; both Inf => zero diff;
    // Inf-vs-finite => +Inf so it cannot pass tolerance.
    let hi_diff = if rk4.t_c_hi.is_finite() && dp.t_c_hi.is_finite() {
        (rk4.t_c_hi - dp.t_c_hi).abs()
    } else if rk4.t_c_hi.is_infinite() && dp.t_c_hi.is_infinite() {
        0.0
    } else {
        f64::INFINITY
    };
    let tol = tolerance(rk4.max_interval_width, dp.max_interval_width);
    let agreed = lo_diff <= tol && hi_diff <= tol;

    eprintln!(
        "{}: N={} dt={:e} n_steps={}\n  RK4 :  t_c_lo={:.6e} t_c_hi={:.6e} steps={} reason={} wrapper={:.3e} runtime_ms={}\n  DP45:  t_c_lo={:.6e} t_c_hi={:.6e} steps={} reason={} wrapper={:.3e} runtime_ms={}\n  diff:  lo={:.3e} hi={:.3e} tol={:.3e} agreed={}",
        label,
        n,
        dt,
        n_steps,
        rk4.t_c_lo,
        rk4.t_c_hi,
        rk4.steps,
        rk4.reason,
        rk4.max_interval_width,
        rk4_ms,
        dp.t_c_lo,
        dp.t_c_hi,
        dp.steps,
        dp.reason,
        dp.max_interval_width,
        dp_ms,
        lo_diff,
        hi_diff,
        tol,
        agreed,
    );

    (lo_diff, hi_diff, tol, agreed)
}

#[test]
fn dp45_vs_rk4_two_particle_certified_collision() {
    // Two particles at 0 and 0.01: pair-collision time H^2 / 8 = 1.25e-5.
    // dt = 1e-7 is small enough that neither integrator overshoots; both
    // should close real brackets and the brackets must agree within the
    // joint wrapper-width envelope.
    let initial_x = vec![0.0, 0.01];
    let dt = 1e-7;
    let n_steps = 2000;
    let (lo_diff, hi_diff, tol, agreed) =
        compare_brackets("two-particle", 2, &initial_x, dt, n_steps);
    assert!(
        agreed,
        "two-particle RK4 vs DP45 disagree: lo_diff={} hi_diff={} tol={}",
        lo_diff, hi_diff, tol,
    );
}

#[test]
fn dp45_vs_rk4_n1000() {
    let n = 1000;
    let initial_x = build_lattice(n);
    // dt + step budget chosen so both integrators terminate either by
    // closed bracket or budget exhaustion; either outcome is a valid
    // comparison point as long as the bracket centres agree.
    let dt = 1e-4;
    let n_steps = 20;
    let (lo_diff, hi_diff, tol, agreed) =
        compare_brackets("n1000", n, &initial_x, dt, n_steps);
    assert!(
        agreed,
        "N=1000 RK4 vs DP45 disagree: lo_diff={} hi_diff={} tol={}",
        lo_diff, hi_diff, tol,
    );
}

#[test]
fn dp45_vs_rk4_n5000() {
    let n = 5000;
    let initial_x = build_lattice(n);
    // N=5000 dense-O(N^2) RK4 step is ~few hundred ms; DP45 is ~1.5x
    // slower per step (6 stages vs 4). 5 steps keeps wall-clock modest.
    let dt = 1e-4;
    let n_steps = 5;
    let (lo_diff, hi_diff, tol, agreed) =
        compare_brackets("n5000", n, &initial_x, dt, n_steps);
    assert!(
        agreed,
        "N=5000 RK4 vs DP45 disagree: lo_diff={} hi_diff={} tol={}",
        lo_diff, hi_diff, tol,
    );
}
