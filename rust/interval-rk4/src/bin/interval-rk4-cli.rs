//! CLI driver for the interval-rk4 crate.
//!
//! Two modes:
//!   1. DEFAULT (no subcommand). Reads JSON on stdin:
//!        { "N": <usize>, "initial_x": [f64; N], "dt": f64,
//!          "max_steps": usize, "tolerance": f64 }
//!      Writes one PlateauResult JSON on stdout. Used by the JS dispatch
//!      wrapper in scripts/compute-imp423-missing-N.mjs.
//!
//!   2. SWEEP (imp-1110). `interval-rk4-cli sweep --input plateaus.json
//!      [--workers N]`. Reads a JSON array of PlateauSpec rows, runs
//!      `par_plateau_sweep`, writes a JSON object
//!        { "wall_clock_ms": u128, "workers": usize, "results": [...] }
//!      to stdout.

use interval_rk4::parallel::{par_plateau_sweep, PlateauSpec, PlateauResult, SweepOpts};
use interval_rk4::rk4::{backward_collision_interval, backward_collision_interval_bh_multipole};
use serde::{Deserialize, Serialize};
use std::io::Read;
use std::time::Instant;

#[derive(Debug, Deserialize)]
struct SingleInput {
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
struct SingleOutput {
    t_c_lo: f64,
    t_c_hi: f64,
    max_interval_width: f64,
    steps_taken: usize,
    reason: String,
    runtime_ms: u128,
}

#[derive(Debug, Serialize)]
struct SweepOutput {
    wall_clock_ms: u128,
    workers: usize,
    results: Vec<PlateauResult>,
}

fn run_single_mode(args: &[String]) {
    // imp-1145: parse --drift-mode and --theta to dispatch dense vs BH-multipole.
    let mut drift_mode = "dense".to_string();
    let mut theta = 0.1_f64;
    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            "--drift-mode" => {
                drift_mode = args.get(i + 1).expect("--drift-mode requires a value").clone();
                i += 2;
            }
            "--theta" => {
                theta = args.get(i + 1).expect("--theta requires a value").parse().expect("--theta must be a number");
                i += 2;
            }
            _ => { i += 1; }
        }
    }

    let mut s = String::new();
    std::io::stdin()
        .read_to_string(&mut s)
        .expect("read stdin");
    let input: SingleInput = serde_json::from_str(&s).expect("parse JSON input");
    assert_eq!(
        input.initial_x.len(),
        input.n,
        "initial_x length must equal N"
    );

    let t0 = Instant::now();
    let result = match drift_mode.as_str() {
        "bh_multipole" | "bh-multipole" => backward_collision_interval_bh_multipole(
            &input.initial_x, input.dt, input.max_steps, theta,
        ),
        "dense" | _ => backward_collision_interval(&input.initial_x, input.dt, input.max_steps),
    };
    let runtime_ms = t0.elapsed().as_millis();

    let output = SingleOutput {
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

fn run_sweep_mode(args: &[String]) {
    let mut input_path: Option<String> = None;
    let mut workers: Option<usize> = None;
    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            "--input" => {
                input_path = Some(
                    args.get(i + 1)
                        .expect("--input requires a path argument")
                        .clone(),
                );
                i += 2;
            }
            "--workers" => {
                let v: usize = args
                    .get(i + 1)
                    .expect("--workers requires a numeric argument")
                    .parse()
                    .expect("--workers must be a positive integer");
                workers = Some(v);
                i += 2;
            }
            other => panic!("unknown sweep flag: {}", other),
        }
    }
    let path = input_path.expect("sweep subcommand requires --input <path>");
    let raw = std::fs::read_to_string(&path)
        .unwrap_or_else(|e| panic!("read {}: {}", path, e));
    let specs: Vec<PlateauSpec> =
        serde_json::from_str(&raw).expect("parse plateau spec JSON array");
    for (i, s) in specs.iter().enumerate() {
        assert_eq!(
            s.initial_x.len(),
            s.n,
            "spec {} initial_x length must equal N",
            i
        );
    }

    let opts = SweepOpts { workers };
    let t0 = Instant::now();
    let results = par_plateau_sweep(&specs, opts);
    let wall_clock_ms = t0.elapsed().as_millis();
    let effective_workers = workers.unwrap_or_else(rayon::current_num_threads);

    let out = SweepOutput {
        wall_clock_ms,
        workers: effective_workers,
        results,
    };
    println!(
        "{}",
        serde_json::to_string(&out).expect("serialize sweep output JSON")
    );
}

fn main() {
    let argv: Vec<String> = std::env::args().collect();
    if argv.len() >= 2 && argv[1] == "sweep" {
        let rest: Vec<String> = argv.iter().skip(2).cloned().collect();
        run_sweep_mode(&rest);
    } else {
        let rest: Vec<String> = argv.iter().skip(1).cloned().collect();
        run_single_mode(&rest);
    }
}
