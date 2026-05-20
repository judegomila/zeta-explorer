//! CLI driver for the interval-OLS module (imp-1137).
//!
//! Reads JSON on stdin:
//!     { "rows": [ { "N": 25000, "t_lo": 0.0001, "t_hi": 0.0002 }, ... ] }
//!
//! Writes JSON on stdout:
//!     { "a_lo": ..., "a_hi": ..., "b_lo": ..., "b_hi": ...,
//!       "residual_sup": ..., "n_rows": ..., "sxx": ..., "xbar": ... }
//!
//! On malformed input the CLI exits 2 with a JSON error blob on stdout:
//!     { "error": "<message>" }
//!
//! Used by scripts/imp-1137-run-interval-ols.mjs to refit the V2 OLS
//! intercept with rigorous error bars.

use interval_rk4::interval_ols::{interval_ols, OlsRow};
use serde::{Deserialize, Serialize};
use std::io::Read;

#[derive(Debug, Deserialize)]
struct CliInput {
    rows: Vec<OlsRow>,
}

#[derive(Debug, Serialize)]
struct CliError {
    error: String,
}

fn main() {
    let mut s = String::new();
    if let Err(e) = std::io::stdin().read_to_string(&mut s) {
        let blob = CliError {
            error: format!("read stdin: {}", e),
        };
        println!("{}", serde_json::to_string(&blob).unwrap());
        std::process::exit(2);
    }
    let input: CliInput = match serde_json::from_str(&s) {
        Ok(v) => v,
        Err(e) => {
            let blob = CliError {
                error: format!("parse JSON: {}", e),
            };
            println!("{}", serde_json::to_string(&blob).unwrap());
            std::process::exit(2);
        }
    };
    match interval_ols(&input.rows) {
        Ok(fit) => {
            println!("{}", serde_json::to_string(&fit).expect("serialize fit"));
        }
        Err(e) => {
            let blob = CliError {
                error: format!("{}", e),
            };
            println!("{}", serde_json::to_string(&blob).unwrap());
            std::process::exit(2);
        }
    }
}
