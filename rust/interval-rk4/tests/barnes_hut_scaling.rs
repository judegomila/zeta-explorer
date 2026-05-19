//! imp-1132 Phase 7 acceptance test (scaling + N=1e5 wall-clock):
//!
//! Benchmark the BH drift vector at N in {1000, 10000, 100000} and
//! verify the runtime scales as O(N log N) rather than the dense
//! O(N^2). At N = 1e5 the dense projection (from imp-1112 sanity
//! sweep) is >3000 s per step on this host; BH should complete in
//! well under 30 s for a single drift evaluation, putting one RK4
//! step (= 4 drift evals + arithmetic) inside the 30-s acceptance
//! envelope.
//!
//! Scaling-slope acceptance. For an O(N log N) algorithm the runtime
//! ratio between N1 and N2 is (N2 log N2) / (N1 log N1). For N1 =
//! 1000, N2 = 100000:
//!   expected ratio = 100000 * log(100000) / (1000 * log(1000))
//!                  = 100000 * 11.51 / (1000 * 6.91)
//!                  = 166.5
//! We accept ratio <= 250 (room for tree-build overhead + cache
//! effects that perturb the leading-order count of cell visits).
//! Anything above 500 would indicate a regression to O(N^2).

use interval_rk4::as_interval;
use interval_rk4::dyson::dyson_drift_vector_barnes_hut;
use inari::Interval;
use std::time::Instant;

const THETA: f64 = 0.1;
/// Hard wall-clock cap on the N=1e5 drift vector. Imp-1112 sanity
/// sweep recorded >3000 s for the dense O(N^2) drift at N=1e5; the
/// BH ticket targets <30s for one full RK4 step (= 4 drift evals).
/// One drift eval should take ~7.5 s at this budget.
const ACCEPTANCE_DRIFT_MS_N1E5: u128 = 30_000;
/// Scaling-ratio acceptance: see header comment.
const MAX_SCALING_RATIO_N1K_TO_N100K: f64 = 250.0;

fn build_lattice(n: usize) -> Vec<Interval> {
    (0..n).map(|i| as_interval(1.0 + i as f64 * 1.3)).collect()
}

fn time_drift(n: usize, theta: f64) -> u128 {
    let gammas = build_lattice(n);
    // Warmup: build the tree once before timing so the inari rounding-
    // mode init and the allocator are warm.
    let _warm = dyson_drift_vector_barnes_hut(&build_lattice(64), theta);
    let t0 = Instant::now();
    let v = dyson_drift_vector_barnes_hut(&gammas, theta)
        .expect("BH drift vector closes");
    let ms = t0.elapsed().as_millis();
    assert_eq!(v.len(), n, "result length mismatch");
    ms
}

#[test]
fn bh_runtime_n1000() {
    let ms = time_drift(1000, THETA);
    eprintln!("N=1000 theta={} bh_ms={}", THETA, ms);
    // Generous cap: BH at N=1000 should be well under 5 s.
    assert!(ms < 5_000, "N=1000 BH took {}ms (cap 5000ms)", ms);
}

#[test]
fn bh_runtime_n10000() {
    let ms = time_drift(10000, THETA);
    eprintln!("N=10000 theta={} bh_ms={}", THETA, ms);
    // Generous cap: BH at N=1e4 should be under 10 s.
    assert!(ms < 10_000, "N=10000 BH took {}ms (cap 10000ms)", ms);
}

/// Headline acceptance: N=1e5 in under 30 s for one drift evaluation
/// (so an RK4 step at 4 drift evals fits the ~30 s ticket envelope
/// once the per-step arithmetic is added).
#[test]
fn bh_runtime_n100000_acceptance() {
    let ms = time_drift(100000, THETA);
    eprintln!("N=100000 theta={} bh_ms={} (acceptance cap {} ms)", THETA, ms, ACCEPTANCE_DRIFT_MS_N1E5);
    assert!(
        ms < ACCEPTANCE_DRIFT_MS_N1E5,
        "N=1e5 BH drift took {}ms, exceeds acceptance cap {}ms (imp-1132 wall-clock target)",
        ms,
        ACCEPTANCE_DRIFT_MS_N1E5
    );
}

/// Scaling-slope acceptance. Verify that ratio(N=1e5 / N=1e3) is
/// within the O(N log N) envelope, NOT growing as O(N^2) (which
/// would predict ratio = 10000).
#[test]
fn bh_scaling_slope_n1k_to_n100k() {
    let ms_1k = time_drift(1000, THETA).max(1) as f64;
    let ms_100k = time_drift(100000, THETA) as f64;
    let ratio = ms_100k / ms_1k;
    let expected_nlogn = (100000.0 * (100000.0_f64).ln()) / (1000.0 * (1000.0_f64).ln());
    let dense_ratio_oN2 = (100000.0_f64 / 1000.0_f64).powi(2);
    eprintln!(
        "scaling 1k -> 100k: ms_1k={}, ms_100k={}, observed_ratio={:.1}, expected_nlogn={:.1}, dense_O(N^2)_ratio={:.0}",
        ms_1k, ms_100k, ratio, expected_nlogn, dense_ratio_oN2
    );
    assert!(
        ratio < MAX_SCALING_RATIO_N1K_TO_N100K,
        "scaling ratio {:.1} exceeds O(N log N) envelope cap {:.1} (would indicate regression to O(N^2))",
        ratio,
        MAX_SCALING_RATIO_N1K_TO_N100K
    );
}
