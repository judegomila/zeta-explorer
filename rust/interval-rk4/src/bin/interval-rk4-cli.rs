//! Minimal CLI driver for the Phase 1 MVP.
//!
//! Reads JSON on stdin:
//!   { "N": <usize>, "initial_x": [f64; N], "dt": f64,
//!     "max_steps": usize, "tolerance": f64 }
//! Writes JSON on stdout:
//!   { "t_c_lo": f64, "t_c_hi": f64, "max_interval_width": f64,
//!     "steps_taken": usize, "reason": string, "runtime_ms": u128 }

use interval_rk4::rk4::backward_collision_interval;
use serde::{Deserialize, Serialize};
use std::io::Read;
use std::time::Instant;

#[derive(Debug, Deserialize)]
struct Input {
    #[serde(rename = "N")]
    n: usize,
    initial_x: Vec<f64>,
    dt: f64,
    max_steps: usize,
    #[serde(default)]
    #[allow(dead_code)]
    tolerance: f64,
}

#[derive(Debug, Serialize)]
struct Output {
    t_c_lo: f64,
    t_c_hi: f64,
    max_interval_width: f64,
    steps_taken: usize,
    reason: String,
    runtime_ms: u128,
}

fn main() {
    let mut s = String::new();
    std::io::stdin()
        .read_to_string(&mut s)
        .expect("read stdin");
    let input: Input = serde_json::from_str(&s).expect("parse JSON input");
    assert_eq!(
        input.initial_x.len(),
        input.n,
        "initial_x length must equal N"
    );

    let t0 = Instant::now();
    let result = backward_collision_interval(&input.initial_x, input.dt, input.max_steps);
    let runtime_ms = t0.elapsed().as_millis();

    let output = Output {
        t_c_lo: result.t_c_lo,
        t_c_hi: result.t_c_hi,
        max_interval_width: result.max_interval_width,
        steps_taken: result.steps,
        reason: result.reason,
        runtime_ms,
    };
    println!(
        "{}",
        serde_json::to_string(&output).expect("serialize output JSON")
    );
}
