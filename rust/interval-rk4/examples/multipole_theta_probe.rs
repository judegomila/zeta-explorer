//! imp-1139 calibration probe: measure midpoint disagreement of the
//! multipole BH path vs the dense O(N^2) reference across N x theta.
//! Also times the multipole-only walk at N = 1e5 for several theta to
//! confirm wall-clock acceptance with the quadrupole correction
//! enabled.
//!
//! Run:   cargo run --release --example multipole_theta_probe

use interval_rk4::as_interval;
use interval_rk4::dyson::{dyson_drift_interval, dyson_drift_vector_barnes_hut_multipole};
use inari::Interval;

fn build_lattice(n: usize) -> Vec<Interval> {
    (0..n).map(|i| as_interval(1.0 + i as f64 * 1.3)).collect()
}

fn worst_diff(n: usize, theta: f64) -> (f64, f64) {
    let g = build_lattice(n);
    let bh = dyson_drift_vector_barnes_hut_multipole(&g, theta).unwrap();
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

fn time_only(n: usize, theta: f64) -> u128 {
    let g = build_lattice(n);
    let t0 = std::time::Instant::now();
    let _ = dyson_drift_vector_barnes_hut_multipole(&g, theta).unwrap();
    t0.elapsed().as_millis()
}

fn main() {
    println!("--- accuracy probe (multipole vs dense) ---");
    for (n, theta) in [
        (1000usize, 0.5),
        (1000, 0.3),
        (1000, 0.1),
        (1000, 0.05),
        (5000, 0.5),
        (5000, 0.3),
        (5000, 0.1),
        (5000, 0.05),
        (5000, 0.03),
        (10000, 0.5),
        (10000, 0.3),
        (10000, 0.1),
    ] {
        let t0 = std::time::Instant::now();
        let (w, wd) = worst_diff(n, theta);
        let ms = t0.elapsed().as_millis();
        println!(
            "N={:6} theta={:.3}  worst_mid_diff={:.3e}  worst_width={:.3e}  ms={}",
            n, theta, w, wd, ms
        );
    }
    println!("--- wall-clock probe at N=1e5 (multipole only) ---");
    for theta in [0.5_f64, 0.3, 0.2, 0.1] {
        let ms = time_only(100_000, theta);
        println!("N=100000 theta={:.2}  multipole_ms={}", theta, ms);
    }
}
