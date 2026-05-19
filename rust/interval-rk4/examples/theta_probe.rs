//! imp-1132 calibration probe. Measures BH drift runtime and BH-vs-
//! dense agreement at several N and theta values. Outputs the
//! numbers consumed by src/data/rust-port-phase7-barnes-hut.js.

use interval_rk4::as_interval;
use interval_rk4::dyson::{
    dyson_drift_interval, dyson_drift_vector_barnes_hut,
};
use inari::Interval;
use std::time::Instant;

fn midpoint(iv: Interval) -> f64 {
    (iv.inf() + iv.sup()) * 0.5
}

fn probe(n: usize, theta: f64, do_dense: bool) -> (f64, f64, u128, u128, usize) {
    let gammas: Vec<Interval> = (0..n).map(|i| as_interval(1.0 + i as f64 * 1.3)).collect();
    let t0 = Instant::now();
    let bh = dyson_drift_vector_barnes_hut(&gammas, theta).expect("bh");
    let bh_ms = t0.elapsed().as_millis();

    let dense_ms = if do_dense {
        let t1 = Instant::now();
        for k in 0..n {
            let _ = dyson_drift_interval(&gammas, k).expect("d");
        }
        t1.elapsed().as_millis()
    } else {
        0
    };

    let mut worst_mid_diff = 0.0_f64;
    let mut worst_width = 0.0_f64;
    let mut soundness_viol = 0usize;
    if do_dense {
        for k in 0..n {
            let d = dyson_drift_interval(&gammas, k).expect("d");
            let bm = midpoint(bh[k]);
            let dm = midpoint(d);
            let diff = (bm - dm).abs();
            if diff > worst_mid_diff {
                worst_mid_diff = diff;
            }
            let w = bh[k].sup() - bh[k].inf();
            if w > worst_width {
                worst_width = w;
            }
            if !(bh[k].inf() <= dm + 1e-10 && bh[k].sup() >= dm - 1e-10) {
                soundness_viol += 1;
            }
        }
    }
    (worst_mid_diff, worst_width, bh_ms, dense_ms, soundness_viol)
}

fn main() {
    println!("=== SCALING (theta=0.1) ===");
    for &n in &[1000usize, 2000, 5000, 10000, 20000, 50000, 100000] {
        let do_dense = n <= 20000;
        let (md, ww, bh_ms, d_ms, sv) = probe(n, 0.1, do_dense);
        if do_dense {
            println!(
                "N={:>6}: bh_ms={:>6}, dense_ms={:>7}, speedup={:>7.2}x, mid_diff={:.3e}, width={:.3e}, sv={}",
                n, bh_ms, d_ms, d_ms as f64 / bh_ms.max(1) as f64, md, ww, sv
            );
        } else {
            println!("N={:>6}: bh_ms={:>6}, (no dense)", n, bh_ms);
        }
    }

    println!("\n=== AGREEMENT vs THETA (N=5000) ===");
    for &theta in &[0.1, 0.05, 0.03, 0.02, 0.015, 0.01, 0.005] {
        let (md, ww, bh_ms, _d, sv) = probe(5000, theta, true);
        println!(
            "theta={:.4}: mid_diff={:.3e}, width={:.3e}, bh_ms={}, sv={}",
            theta, md, ww, bh_ms, sv
        );
    }

    println!("\n=== N=100000 BH-ONLY RUNTIME ===");
    let (_md, _ww, bh_ms, _d, _sv) = probe(100000, 0.1, false);
    println!("N=100000, theta=0.1: bh_ms={} ({}s)", bh_ms, bh_ms as f64 / 1000.0);
    // 4x drift = ~1 RK4 step:
    println!(
        "Implied 1-RK4-step (4x drift evals + arith): >= {} ms = {} s",
        4 * bh_ms,
        4.0 * bh_ms as f64 / 1000.0
    );
}
