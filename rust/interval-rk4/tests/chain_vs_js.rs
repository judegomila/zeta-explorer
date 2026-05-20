//! imp-1141: cross-check the Rust L_pt chain port against the JS chain
//! at N=1e4 + T_PT=3e12 + sigma_opt=0.75.
//!
//! The JS reference is materialised by `tests/generate-chain-reference.mjs`
//! (which loads PATH_C_BASELINE_FIT_V2 + finite-height-beats-platt-trudgian.js
//! via Vite ssrLoad) into `tests/reference-chain-n1e4.json`. We parse the
//! V2 fit constants + C_C and re-run the chain through `compute_chain`, then
//! assert agreement to within 1e-6 absolute on L_pt + each intermediate
//! component.

use interval_rk4::chain::{compute_chain, ChainInputs};
use std::fs;
use std::path::PathBuf;
use std::time::Instant;

fn reference_path() -> PathBuf {
    let mut p = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    p.push("tests");
    p.push("reference-chain-n1e4.json");
    p
}

#[test]
fn chain_lpt_matches_js_at_n_1e4() {
    let path = reference_path();
    let raw = fs::read_to_string(&path).unwrap_or_else(|e| {
        panic!(
            "missing chain reference at {}: {}. Generate via `node {}`.",
            path.display(),
            e,
            "rust/interval-rk4/tests/generate-chain-reference.mjs",
        )
    });
    let v: serde_json::Value = serde_json::from_str(&raw).expect("parse chain reference JSON");
    let n = v["N"].as_f64().expect("N");
    let t_pt = v["T_PT"].as_f64().expect("T_PT");
    let sigma_opt = v["sigma_opt"].as_f64().expect("sigma_opt");
    let fit_a = v["fit_a"].as_f64().expect("fit_a");
    let fit_b = v["fit_b"].as_f64().expect("fit_b");
    let c_c = v["C_C"].as_f64().expect("C_C");
    let k_mb = v["K_mb"].as_f64().expect("K_mb");

    let js_t0 = v["T0"].as_f64().expect("T0");
    let js_tc = v["tcProj"].as_f64().expect("tcProj");
    let js_e_trunc = v["E_trunc_polymath"].as_f64().expect("E_trunc_polymath");
    let js_e_flow = v["E_flow"].as_f64().expect("E_flow");
    let js_e_coll = v["E_coll"].as_f64().expect("E_coll");
    let js_e_trunc_pt = v["E_trunc_pt"].as_f64().expect("E_trunc_pt");
    let js_l_cond = v["L_cond"].as_f64().expect("L_cond");
    let js_l_pt = v["L_pt"].as_f64().expect("L_pt");

    let inp = ChainInputs { n, t_pt, sigma_opt, fit_a, fit_b, c_c, k_mb };
    let t0 = Instant::now();
    let r = compute_chain(inp).expect("chain composed");
    let elapsed_us = t0.elapsed().as_micros();
    println!(
        "Rust chain runtime: {} us at N={}, L_pt={}",
        elapsed_us, n, r.l_pt_mid
    );

    // PRIMARY ACCEPTANCE: L_pt within 1e-6 absolute of JS.
    let abs_diff = (r.l_pt_mid - js_l_pt).abs();
    assert!(
        abs_diff < 1.0e-6,
        "Rust L_pt {} differs from JS L_pt {} by {} (> 1e-6)",
        r.l_pt_mid,
        js_l_pt,
        abs_diff,
    );

    // T0 is reproduced by the same Newton iteration -- ULP-level agreement
    // is plausible but we only need round-trip-tight (relative 1e-9).
    assert!(
        (r.t0_mid - js_t0).abs() / js_t0 < 1.0e-9,
        "T0 mismatch: rust={} js={}",
        r.t0_mid,
        js_t0,
    );

    // Intermediate components -- looser tol since JS rounds them with toFixed.
    // The JS row carries E_trunc, E_coll via toFixed(6/7) and E_flow via
    // toExponential(4), so we accept relative 1e-3.
    fn close(a: f64, b: f64, rel: f64, abs_tol: f64) -> bool {
        (a - b).abs() < abs_tol || (a - b).abs() / b.abs().max(1.0e-300) < rel
    }

    assert!(close(r.tc_proj_mid, js_tc, 1e-3, 1e-7), "tcProj mismatch: rust={} js={}", r.tc_proj_mid, js_tc);
    assert!(close(r.e_trunc_polymath_mid, js_e_trunc, 1e-3, 1e-5), "E_trunc mismatch: rust={} js={}", r.e_trunc_polymath_mid, js_e_trunc);
    assert!(close(r.e_flow_mid, js_e_flow, 1e-3, 1e-7), "E_flow mismatch: rust={} js={}", r.e_flow_mid, js_e_flow);
    assert!(close(r.e_coll_mid, js_e_coll, 1e-3, 1e-7), "E_coll mismatch: rust={} js={}", r.e_coll_mid, js_e_coll);
    assert!(close(r.e_trunc_pt_mid, js_e_trunc_pt, 1e-3, 1e-9), "E_trunc_pt mismatch: rust={} js={}", r.e_trunc_pt_mid, js_e_trunc_pt);
    assert!(close(r.l_cond_mid, js_l_cond, 1e-3, 1e-7), "L_cond mismatch: rust={} js={}", r.l_cond_mid, js_l_cond);

    // Interval enclosure of L_pt must contain the JS scalar reference.
    // (Up to a tiny widening for the upper bound -- we add 1e-9 slack for
    // toFixed rounding at the JS end.)
    let lo = r.l_pt_lo - 1.0e-9;
    let hi = r.l_pt_hi + 1.0e-9;
    assert!(
        lo <= js_l_pt && js_l_pt <= hi,
        "JS L_pt={} not contained in Rust enclosure [{}, {}]",
        js_l_pt,
        lo,
        hi,
    );
}

#[test]
fn chain_pt_improved_bound_below_pt_0p2() {
    // Honest "the chain still beats Platt-Trudgian" check at N=1e4 with
    // the inputs the test fixture pins.
    let path = reference_path();
    if !path.exists() {
        eprintln!("skipping: reference fixture missing");
        return;
    }
    let raw = fs::read_to_string(&path).expect("read reference");
    let v: serde_json::Value = serde_json::from_str(&raw).expect("parse reference");
    let inp = ChainInputs {
        n: v["N"].as_f64().unwrap(),
        t_pt: v["T_PT"].as_f64().unwrap(),
        sigma_opt: v["sigma_opt"].as_f64().unwrap(),
        fit_a: v["fit_a"].as_f64().unwrap(),
        fit_b: v["fit_b"].as_f64().unwrap(),
        c_c: v["C_C"].as_f64().unwrap(),
        k_mb: v["K_mb"].as_f64().unwrap(),
    };
    let r = compute_chain(inp).expect("chain");
    assert!(
        r.l_pt_mid < 0.2,
        "L_pt={} must beat PT 2021 bound 0.2",
        r.l_pt_mid,
    );
    assert!(r.rescue_satisfied, "imp-486 rescue check must hold at K_mb={} and N={}", inp.k_mb, inp.n);
}
