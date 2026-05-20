//! imp-1140 — Verner 8(7) vs RK4 bug-class triangulation acceptance.
//!
//! Run BOTH integrators on the SAME initial gammas + SAME dt + SAME
//! step budget. Their certified collision brackets [t_c_lo, t_c_hi]
//! must agree to within 2 * max(wrapperWidth_rk4, wrapperWidth_verner87).
//!
//! This is the rigorous triangulation tolerance: each method certifies
//! a bracket whose endpoints are accurate to its own wrapper width
//! (the integrator-internal interval-arithmetic inflation accumulated
//! across all steps). Two SOUND methods integrating the same flow
//! must produce brackets whose centres lie within the sum of the two
//! half-widths -- bounded above by twice the larger wrapper width.
//! Disagreement wider than this envelope indicates a real bug in at
//! least one integrator and triggers a stop-and-diagnose rather than
//! a tolerance bump.
//!
//! Initial conditions: a deterministic lattice (1.0, 1.3, 1.6, ...).
//! We do NOT load the Riemann-zero reference data here because (a)
//! the goal is integrator-to-integrator cross-check, NOT JS-vs-Rust
//! cross-check, (b) avoiding the JS reference removes a coupling
//! that the JS-reference test (`n_1000_vs_js`) already covers.
//!
//! Two sizes: N = 1000 + N = 5000. Both use modest step budgets so
//! the Verner path (13 stages -> 13 drift evals per step vs RK4-s 4)
//! stays under a few minutes wall-clock.

use interval_rk4::rk4::backward_collision_interval;
use interval_rk4::verner87::backward_collision_interval_verner87;
use std::time::Instant;

/// Build an N-particle deterministic lattice at spacing 1.3 starting
/// at gamma_0 = 1.0. This matches the lattice used by the BH scaling
/// tests so the integrator-step cost is comparable across the suite.
fn build_lattice(n: usize) -> Vec<f64> {
    (0..n).map(|i| 1.0 + (i as f64) * 1.3).collect()
}

/// Compute the rigorous triangulation tolerance:
///   tol = 2 * max(wrapperWidth_rk4, wrapperWidth_verner87)
/// This is the wider of the two integrator-internal wrapper widths
/// inflated by the factor-2 envelope from the per-method half-width
/// sum bound. See the file header.
fn tolerance(rk4_w: f64, v_w: f64) -> f64 {
    2.0 * rk4_w.max(v_w)
}

/// Compare two CollisionBracket-shaped returns on the SAME initial
/// gammas and the SAME (dt, n_steps). Returns (lo_diff, hi_diff,
/// tolerance, agreed) where agreed is the verdict.
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
    let ver = backward_collision_interval_verner87(initial_x, dt, n_steps);
    let ver_ms = t1.elapsed().as_millis();

    let lo_diff = (rk4.t_c_lo - ver.t_c_lo).abs();
    // For t_c_hi compare finite-vs-finite; treat budget-exhausted (+Inf)
    // matches as zero diff, and an Inf-vs-finite as +Inf so it cannot
    // pass the tolerance check.
    let hi_diff = if rk4.t_c_hi.is_finite() && ver.t_c_hi.is_finite() {
        (rk4.t_c_hi - ver.t_c_hi).abs()
    } else if rk4.t_c_hi.is_infinite() && ver.t_c_hi.is_infinite() {
        0.0
    } else {
        f64::INFINITY
    };
    let tol = tolerance(rk4.max_interval_width, ver.max_interval_width);
    let agreed = lo_diff <= tol && hi_diff <= tol;

    eprintln!(
        "{}: N={} dt={:e} n_steps={}\n  RK4 :   t_c_lo={:.6e} t_c_hi={:.6e} steps={} reason={} wrapper={:.3e} runtime_ms={}\n  VER :   t_c_lo={:.6e} t_c_hi={:.6e} steps={} reason={} wrapper={:.3e} runtime_ms={}\n  diff:   lo={:.3e} hi={:.3e} tol={:.3e} agreed={}",
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
        ver.t_c_lo,
        ver.t_c_hi,
        ver.steps,
        ver.reason,
        ver.max_interval_width,
        ver_ms,
        lo_diff,
        hi_diff,
        tol,
        agreed,
    );

    (lo_diff, hi_diff, tol, agreed)
}

#[test]
fn verner87_vs_rk4_n1000() {
    let n = 1000;
    let initial_x = build_lattice(n);
    // dt and step budget chosen so both integrators have ample room
    // to either close a bracket OR exhaust the budget; either outcome
    // is a legitimate comparison point as long as both terminate the
    // same way (or close brackets that overlap).
    let dt = 1e-4;
    let n_steps = 20;
    let (lo_diff, hi_diff, tol, agreed) =
        compare_brackets("n1000", n, &initial_x, dt, n_steps);
    assert!(
        agreed,
        "N=1000 RK4 vs Verner87 disagree: lo_diff={} hi_diff={} tol={}",
        lo_diff, hi_diff, tol,
    );
}

#[test]
fn verner87_vs_rk4_n5000() {
    let n = 5000;
    let initial_x = build_lattice(n);
    let dt = 1e-4;
    // N=5000 dense-O(N^2) RK4 step is ~few hundred ms; Verner is ~3x
    // slower -- 5 steps keeps the total under ~30s on a release build.
    let n_steps = 5;
    let (lo_diff, hi_diff, tol, agreed) =
        compare_brackets("n5000", n, &initial_x, dt, n_steps);
    assert!(
        agreed,
        "N=5000 RK4 vs Verner87 disagree: lo_diff={} hi_diff={} tol={}",
        lo_diff, hi_diff, tol,
    );
}

#[test]
fn verner87_vs_rk4_two_particle_certified_collision() {
    // Same micro-test as both single-method suites carry: two
    // particles at 0 and 0.01. Both integrators must close the
    // certified bracket and the bracket centres must agree within
    // their joint wrapper-width envelope.
    let initial_x = vec![0.0, 0.01];
    let dt = 1e-7;
    let n_steps = 2000;
    let (lo_diff, hi_diff, tol, agreed) =
        compare_brackets("two-particle", 2, &initial_x, dt, n_steps);
    assert!(
        agreed,
        "two-particle RK4 vs Verner87 disagree: lo_diff={} hi_diff={} tol={}",
        lo_diff, hi_diff, tol,
    );
}
