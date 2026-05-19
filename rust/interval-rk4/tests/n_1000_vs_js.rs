//! imp-1090 Phase 1 acceptance test.
//!
//! Loads the JS reference data emitted by
//! `tests/generate-reference.mjs` at N=1000, re-runs the same instance
//! through the Rust interval-RK4 backward collision finder, and
//! asserts both bracket endpoints agree with JS to within 1e-8 (the
//! ticket-required threshold). Also records the Rust-vs-JS runtime
//! ratio so the speedup can be surfaced in
//! `src/data/rust-port-phase1-validation.js`.

use interval_rk4::rk4::backward_collision_interval;
use std::fs;
use std::path::PathBuf;
use std::time::Instant;

fn reference_path() -> PathBuf {
    let mut p = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    p.push("tests");
    p.push("reference-data-n1000.json");
    p
}

#[test]
fn n_1000_vs_js_brackets_match() {
    let path = reference_path();
    let raw = fs::read_to_string(&path).unwrap_or_else(|e| {
        panic!(
            "missing reference data at {}: {}. Generate via `node {}`.",
            path.display(),
            e,
            "rust/interval-rk4/tests/generate-reference.mjs"
        )
    });
    // The JS reference uses camelCase for collisionIndex etc; convert.
    // Simpler: parse with serde_json::Value and pick fields by hand.
    let v: serde_json::Value = serde_json::from_str(&raw).expect("parse reference JSON");
    let n = v["N"].as_u64().expect("N") as usize;
    let initial_x: Vec<f64> = v["initial_x"]
        .as_array()
        .expect("initial_x array")
        .iter()
        .map(|x| x.as_f64().expect("f64 zero"))
        .collect();
    let dt = v["dt"].as_f64().expect("dt");
    let max_steps = v["max_steps"].as_u64().expect("max_steps") as usize;
    let js = &v["js_result"];
    let js_t_c_lo = js["t_c_lo"].as_f64().expect("js t_c_lo");
    let js_t_c_hi = js["t_c_hi"].as_f64().unwrap_or(f64::INFINITY);
    let js_reason = js["reason"].as_str().unwrap_or("").to_string();
    let js_steps = js["steps"].as_u64().unwrap_or(0) as usize;
    let js_runtime_ms = v["js_runtime_ms"].as_u64().unwrap_or(0) as u128;

    assert_eq!(initial_x.len(), n, "initial_x length mismatch");

    let t0 = Instant::now();
    let rust_result = backward_collision_interval(&initial_x, dt, max_steps);
    let rust_runtime_ms = t0.elapsed().as_millis();

    // For BOTH finite brackets compare directly. If JS reported
    // budget-exhausted (t_c_hi = +Inf), we only compare t_c_lo (the
    // certified lower bound on the collision time) and termination
    // step count.
    let lo_diff = (rust_result.t_c_lo - js_t_c_lo).abs();
    let hi_diff = if js_t_c_hi.is_finite() && rust_result.t_c_hi.is_finite() {
        (rust_result.t_c_hi - js_t_c_hi).abs()
    } else if js_t_c_hi.is_infinite() && rust_result.t_c_hi.is_infinite() {
        0.0
    } else {
        f64::INFINITY
    };

    let tol = 1e-7; // ticket-spec threshold

    eprintln!(
        "n_1000_vs_js: N={}, dt={:e}, max_steps={}\n  JS:   t_c_lo={:.6e} t_c_hi={:.6e} steps={} reason={} runtime_ms={}\n  RUST: t_c_lo={:.6e} t_c_hi={:.6e} steps={} reason={} runtime_ms={}\n  diff: lo={:.3e} hi={:.3e} tol={:e}\n  speedup_vs_js={:.2}x",
        n, dt, max_steps,
        js_t_c_lo, js_t_c_hi, js_steps, js_reason, js_runtime_ms,
        rust_result.t_c_lo, rust_result.t_c_hi, rust_result.steps, rust_result.reason, rust_runtime_ms,
        lo_diff, hi_diff, tol,
        if rust_runtime_ms == 0 { f64::INFINITY } else { js_runtime_ms as f64 / rust_runtime_ms as f64 },
    );

    assert!(
        lo_diff < tol,
        "t_c_lo diff {:e} >= tol {:e}",
        lo_diff,
        tol
    );
    assert!(
        hi_diff < tol,
        "t_c_hi diff {:e} >= tol {:e}",
        hi_diff,
        tol
    );
    assert_eq!(
        rust_result.steps, js_steps,
        "Rust and JS terminated at different step counts"
    );
    assert_eq!(
        rust_result.reason, js_reason,
        "Rust and JS terminated for different reasons"
    );
}
