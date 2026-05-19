use interval_rk4::as_interval;
use interval_rk4::dyson::{dyson_drift_interval, dyson_drift_vector_barnes_hut};
use inari::Interval;
use std::time::Instant;

fn midpoint(iv: Interval) -> f64 {
    (iv.inf() + iv.sup()) * 0.5
}

fn probe(n: usize, theta: f64) -> (f64, f64, u128) {
    let gammas: Vec<Interval> = (0..n).map(|i| as_interval(1.0 + i as f64 * 1.3)).collect();
    let t0 = Instant::now();
    let bh = dyson_drift_vector_barnes_hut(&gammas, theta).expect("bh");
    let bh_ms = t0.elapsed().as_millis();
    let mut worst_mid_diff = 0.0_f64;
    let mut worst_width = 0.0_f64;
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
    }
    (worst_mid_diff, worst_width, bh_ms)
}

fn dense_ms(n: usize) -> u128 {
    let gammas: Vec<Interval> = (0..n).map(|i| as_interval(1.0 + i as f64 * 1.3)).collect();
    let t0 = Instant::now();
    for k in 0..n {
        let _ = dyson_drift_interval(&gammas, k).expect("d");
    }
    t0.elapsed().as_millis()
}

fn main() {
    println!("N=1000 theta-sweep:");
    for &theta in &[0.5, 0.3, 0.1, 0.05, 0.03, 0.02, 0.015, 0.01, 0.005, 0.001] {
        let (md, ww, ms) = probe(1000, theta);
        println!(
            "  theta={:.4}: mid_diff={:.3e}, width={:.3e}, bh_ms={}",
            theta, md, ww, ms
        );
    }
    let d1k = dense_ms(1000);
    println!("  dense_ms at N=1000: {}", d1k);

    println!("N=5000 theta-sweep:");
    for &theta in &[0.1, 0.05, 0.03, 0.02, 0.015, 0.01] {
        let (md, ww, ms) = probe(5000, theta);
        println!(
            "  theta={:.4}: mid_diff={:.3e}, width={:.3e}, bh_ms={}",
            theta, md, ww, ms
        );
    }
    let d5k = dense_ms(5000);
    println!("  dense_ms at N=5000: {}", d5k);

    println!("N=10000 scaling:");
    let (md, ww, ms) = probe(10000, 0.1);
    println!(
        "  theta=0.1: mid_diff={:.3e}, width={:.3e}, bh_ms={}",
        md, ww, ms
    );
    let (md, ww, ms) = probe(10000, 0.05);
    println!(
        "  theta=0.05: mid_diff={:.3e}, width={:.3e}, bh_ms={}",
        md, ww, ms
    );
}
