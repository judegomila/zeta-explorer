//! imp-1132 Phase 7 acceptance test (correctness):
//!
//! At N in {100, 1000, 5000} verify that the Barnes-Hut drift vector
//! AGREES with the dense O(N^2) drift vector to 1e-6 on each particle.
//! BH is an APPROXIMATION (multipole-truncation at the monopole
//! moment), so we do NOT expect bitwise equality; we expect agreement
//! within an absolute tolerance dominated by the theta criterion. At
//! theta = 0.5 and well-separated particles (the integer-spaced
//! lattice we use here is the WORST case for BH because every leaf is
//! adjacent to its neighbor) the agreement should be well under 1e-6
//! after the conservative interval inflation.
//!
//! Soundness check. Even if the BH midpoint differs from the dense
//! midpoint by epsilon, the BH INTERVAL must still ENCLOSE the dense
//! midpoint (the multipole-truncation envelope is a sound upper bound
//! on the residual). We assert both:
//!   (a) |bh_mid - dense_mid| < 1e-6 per particle
//!   (b) bh.inf() <= dense_mid <= bh.sup() per particle (soundness)

use interval_rk4::as_interval;
use interval_rk4::barnes_hut::BHTree;
use interval_rk4::dyson::{dyson_drift_interval, dyson_drift_vector_barnes_hut};
use inari::Interval;

const THETA: f64 = 0.5;
const TOL: f64 = 1e-6;

fn build_lattice(n: usize) -> Vec<Interval> {
    (0..n).map(|i| as_interval(1.0 + i as f64 * 1.3)).collect()
}

fn midpoint(iv: Interval) -> f64 {
    (iv.inf() + iv.sup()) * 0.5
}

fn check_agreement(n: usize) {
    let gammas = build_lattice(n);
    let bh = dyson_drift_vector_barnes_hut(&gammas, THETA)
        .expect("BH drift vector closes");
    assert_eq!(bh.len(), n, "BH vector length mismatch at N={}", n);

    let mut worst_diff = 0.0_f64;
    let mut worst_idx = 0usize;
    let mut soundness_violations = 0usize;
    for k in 0..n {
        let dense_k = dyson_drift_interval(&gammas, k)
            .expect("dense drift defined");
        let bh_k = bh[k];
        let dmid = midpoint(dense_k);
        let bmid = midpoint(bh_k);
        let diff = (bmid - dmid).abs();
        if diff > worst_diff {
            worst_diff = diff;
            worst_idx = k;
        }
        // Soundness: BH must enclose dense midpoint within a tiny
        // numerical slack (1e-12) to absorb the rounding of the
        // dense midpoint itself.
        if !(bh_k.inf() <= dmid + 1e-12 && bh_k.sup() >= dmid - 1e-12) {
            soundness_violations += 1;
            if soundness_violations <= 3 {
                eprintln!(
                    "soundness violation at k={}: BH=[{}, {}], dense_mid={}",
                    k,
                    bh_k.inf(),
                    bh_k.sup(),
                    dmid
                );
            }
        }
    }
    eprintln!(
        "N={} worst |bh_mid - dense_mid| = {:.3e} at k={} (tol {:.0e})",
        n, worst_diff, worst_idx, TOL
    );
    assert!(
        worst_diff < TOL,
        "BH-vs-dense midpoint disagreement {:.3e} at N={} exceeds tolerance {:.0e}",
        worst_diff,
        n,
        TOL
    );
    assert_eq!(
        soundness_violations, 0,
        "BH-vs-dense had {} soundness violations at N={}",
        soundness_violations, n
    );
}

#[test]
fn bh_matches_dense_at_n100() {
    check_agreement(100);
}

#[test]
fn bh_matches_dense_at_n1000() {
    check_agreement(1000);
}

#[test]
fn bh_matches_dense_at_n5000() {
    check_agreement(5000);
}

/// Sanity: a degenerate cluster (two clusters of 5 particles each
/// separated by a wide gap) is the kind of geometry where BH gives
/// the BIGGEST speedup. Verify it still produces a sound enclosure.
#[test]
fn bh_two_cluster_geometry() {
    let mut gammas: Vec<Interval> = Vec::new();
    for i in 0..50 {
        gammas.push(as_interval(i as f64 * 0.1)); // cluster 1: [0, 5]
    }
    for i in 0..50 {
        gammas.push(as_interval(1000.0 + i as f64 * 0.1)); // cluster 2: [1000, 1005]
    }
    let n = gammas.len();
    let _ = BHTree::build(&gammas); // build sanity-checks
    let bh = dyson_drift_vector_barnes_hut(&gammas, THETA)
        .expect("BH drift closes on two-cluster geometry");
    for k in 0..n {
        let dense_k = dyson_drift_interval(&gammas, k)
            .expect("dense drift defined");
        let dmid = midpoint(dense_k);
        assert!(
            bh[k].inf() <= dmid + 1e-10 && bh[k].sup() >= dmid - 1e-10,
            "two-cluster BH does not enclose dense at k={}: BH=[{}, {}], dense_mid={}",
            k,
            bh[k].inf(),
            bh[k].sup(),
            dmid
        );
    }
}
