//! imp-1132-sub-multipole-extension calibration probe: measure
//! midpoint disagreement of the HIGH-ORDER multipole BH path (monopole
//! + dipole + quadrupole + octupole + hexadecapole) vs the dense
//! O(N^2) reference across N x theta. Also times the high-order walk
//! at N = 1e5 for several theta to confirm wall-clock acceptance.
//!
//! Run:   cargo run --release --example multipole_high_theta_probe

use interval_rk4::as_interval;
use interval_rk4::dyson::{
    dyson_drift_interval, dyson_drift_vector_barnes_hut_multipole,
    dyson_drift_vector_barnes_hut_multipole_high,
};
use inari::Interval;

fn build_lattice(n: usize) -> Vec<Interval> {
    (0..n).map(|i| as_interval(1.0 + i as f64 * 1.3)).collect()
}

fn worst_diff_high(n: usize, theta: f64) -> (f64, f64) {
    let g = build_lattice(n);
    let bh = dyson_drift_vector_barnes_hut_multipole_high(&g, theta).unwrap();
    let mut worst = 0f64;
    let mut wid = 0f64;
    for k in 0..n {
        let d = dyson_drift_interval(&g, k).unwrap();
        let dm = (d.inf() + d.sup()) * 0.5;
        let bm = (bh[k].inf() + bh[k].sup()) * 0.5;
        let df = (bm - dm).abs();
        if df > worst {
            worst = df;
        }
        let w = bh[k].sup() - bh[k].inf();
        if w > wid {
            wid = w;
        }
    }
    (worst, wid)
}

fn worst_diff_quad(n: usize, theta: f64) -> f64 {
    let g = build_lattice(n);
    let bh = dyson_drift_vector_barnes_hut_multipole(&g, theta).unwrap();
    let mut worst = 0f64;
    for k in 0..n {
        let d = dyson_drift_interval(&g, k).unwrap();
        let dm = (d.inf() + d.sup()) * 0.5;
        let bm = (bh[k].inf() + bh[k].sup()) * 0.5;
        let df = (bm - dm).abs();
        if df > worst {
            worst = df;
        }
    }
    worst
}

fn time_only_high(n: usize, theta: f64) -> u128 {
    let g = build_lattice(n);
    let t0 = std::time::Instant::now();
    let _ = dyson_drift_vector_barnes_hut_multipole_high(&g, theta).unwrap();
    t0.elapsed().as_millis()
}

fn time_only_quad(n: usize, theta: f64) -> u128 {
    let g = build_lattice(n);
    let t0 = std::time::Instant::now();
    let _ = dyson_drift_vector_barnes_hut_multipole(&g, theta).unwrap();
    t0.elapsed().as_millis()
}

fn main() {
    println!("--- HIGH-ORDER accuracy probe (M_0..M_4 vs dense) ---");
    for (n, theta) in [
        (1000usize, 0.5),
        (1000, 0.3),
        (1000, 0.1),
        (5000, 0.5),
        (5000, 0.3),
        (5000, 0.1),
        (10000, 0.5),
        (10000, 0.3),
        (10000, 0.1),
    ] {
        let t0 = std::time::Instant::now();
        let (w, wd) = worst_diff_high(n, theta);
        let ms = t0.elapsed().as_millis();
        println!(
            "N={:6} theta={:.3}  high_mid_diff={:.3e}  width={:.3e}  ms={}",
            n, theta, w, wd, ms
        );
    }
    println!("--- comparison high vs quad at N=5000 ---");
    for theta in [0.5_f64, 0.3, 0.1] {
        let high = worst_diff_high(5000, theta).0;
        let quad = worst_diff_quad(5000, theta);
        let ratio = quad / high.max(1e-30);
        println!(
            "N=5000 theta={:.2}  quad={:.3e}  high={:.3e}  improvement={:.1}x",
            theta, quad, high, ratio
        );
    }
    println!("--- wall-clock probe at N=1e5 (high vs quad) ---");
    for theta in [0.5_f64, 0.3, 0.1] {
        let ms_q = time_only_quad(100_000, theta);
        let ms_h = time_only_high(100_000, theta);
        println!(
            "N=100000 theta={:.2}  quad_ms={}  high_ms={}",
            theta, ms_q, ms_h
        );
    }
}
