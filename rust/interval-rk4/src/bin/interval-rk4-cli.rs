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

use interval_rk4::chain::{compute_chain, ChainInputs, ChainResult};
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

#[derive(Debug, Serialize)]
struct ChainOutput {
    n: f64,
    t_pt: f64,
    sigma_opt: f64,
    fit_a: f64,
    fit_b: f64,
    c_c: f64,
    k_mb: f64,
    t0: f64,
    tc_proj: f64,
    c_t: f64,
    kappa_t: f64,
    c_f: f64,
    e_trunc_polymath: f64,
    e_flow: f64,
    e_coll: f64,
    e_trunc_pt: f64,
    l_cond: f64,
    l_full: f64,
    l_pt: f64,
    l_pt_lo: f64,
    l_pt_hi: f64,
    l_cond_lo: f64,
    l_cond_hi: f64,
    rescue_lhs: f64,
    rescue_satisfied: bool,
    runtime_us: u128,
}

impl From<(ChainInputs, ChainResult, u128)> for ChainOutput {
    fn from((inp, r, runtime_us): (ChainInputs, ChainResult, u128)) -> Self {
        Self {
            n: inp.n,
            t_pt: inp.t_pt,
            sigma_opt: inp.sigma_opt,
            fit_a: inp.fit_a,
            fit_b: inp.fit_b,
            c_c: inp.c_c,
            k_mb: inp.k_mb,
            t0: r.t0_mid,
            tc_proj: r.tc_proj_mid,
            c_t: r.c_t_mid,
            kappa_t: r.kappa_t_mid,
            c_f: r.c_f_mid,
            e_trunc_polymath: r.e_trunc_polymath_mid,
            e_flow: r.e_flow_mid,
            e_coll: r.e_coll_mid,
            e_trunc_pt: r.e_trunc_pt_mid,
            l_cond: r.l_cond_mid,
            l_full: r.l_full_mid,
            l_pt: r.l_pt_mid,
            l_pt_lo: r.l_pt_lo,
            l_pt_hi: r.l_pt_hi,
            l_cond_lo: r.l_cond_lo,
            l_cond_hi: r.l_cond_hi,
            rescue_lhs: r.rescue_lhs,
            rescue_satisfied: r.rescue_satisfied,
            runtime_us,
        }
    }
}

fn parse_f64_flag(args: &[String], flag: &str, default: f64) -> f64 {
    let mut i = 0;
    while i + 1 < args.len() {
        if args[i] == flag {
            return args[i + 1]
                .parse::<f64>()
                .unwrap_or_else(|_| panic!("{} must be a finite f64", flag));
        }
        i += 1;
    }
    default
}

fn run_chain_mode(args: &[String]) {
    let defaults = ChainInputs::default();
    let n = parse_f64_flag(args, "--N", 1.0e4);
    let t_pt = parse_f64_flag(args, "--T_PT", 3.0e12);
    let sigma_opt = parse_f64_flag(args, "--sigma_opt", 0.75);
    // V2 OLS fit constants are required CLI args (no project-wide pin shared
    // with Rust); the validation JS passes them in via --fit-a / --fit-b.
    let fit_a = parse_f64_flag(args, "--fit-a", 0.0);
    let fit_b = parse_f64_flag(args, "--fit-b", 0.0);
    let c_c = parse_f64_flag(args, "--C_C", defaults.c_c);
    let k_mb = parse_f64_flag(args, "--K_mb", defaults.k_mb);

    let inp = ChainInputs { n, t_pt, sigma_opt, fit_a, fit_b, c_c, k_mb };

    let t0 = Instant::now();
    let result = compute_chain(inp).expect("chain composition produced no result -- check inputs");
    let runtime_us = t0.elapsed().as_micros();

    let out: ChainOutput = (inp, result, runtime_us).into();
    println!(
        "{}",
        serde_json::to_string(&out).expect("serialize chain output JSON")
    );
}

fn main() {
    let argv: Vec<String> = std::env::args().collect();
    if argv.len() >= 2 && argv[1] == "sweep" {
        let rest: Vec<String> = argv.iter().skip(2).cloned().collect();
        run_sweep_mode(&rest);
    } else if argv.len() >= 2 && argv[1] == "chain" {
        let rest: Vec<String> = argv.iter().skip(2).cloned().collect();
        run_chain_mode(&rest);
    } else {
        let rest: Vec<String> = argv.iter().skip(1).cloned().collect();
        run_single_mode(&rest);
    }
}
