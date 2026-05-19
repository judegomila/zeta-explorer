//! imp-1110 Phase 4: rayon-parallel plateau sweep across the
//! backward-collision interval-RK4 driver.
//!
//! Each PlateauSpec is one independent run of `backward_collision_interval`
//! (the existing serial entry point in `rk4.rs`). Across a list of
//! plateaus there is no shared state, so we can dispatch them concurrently
//! with `rayon::prelude::IntoParallelRefIterator::par_iter` — one rayon
//! task per plateau. On the 18-core Apple M-series host the expected
//! wall-clock speedup at K plateaus is ~min(K, num_cores) modulo rayon
//! task-stealing overhead. The ticket targets >= 3x at K=4 plateaus.
//!
//! Determinism. Interval arithmetic in `inari` is deterministic: every
//! operation rounds outward via IEEE 1788 directed rounding, so the
//! result depends only on the input bits, not on which thread executed
//! the op. Thus per-plateau brackets must be IDENTICAL between the
//! serial entry point (`backward_collision_interval` called K times in a
//! loop) and the parallel entry point (`par_plateau_sweep` over the
//! same K specs). The acceptance test in `tests/parallel_plateau_sweep.rs`
//! verifies this empirically — see `Determinism Verdict` in the
//! companion validation record at
//! `src/data/rust-port-phase4-rayon-validation.js`.

use crate::rk4::{backward_collision_interval, CollisionBracket};
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::time::Instant;

/// One plateau to run through `backward_collision_interval`. Mirrors the
/// JSON shape consumed by the `sweep` CLI subcommand.
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct PlateauSpec {
    #[serde(rename = "N")]
    pub n: usize,
    pub initial_x: Vec<f64>,
    pub dt: f64,
    pub max_steps: usize,
    #[serde(default)]
    pub tolerance: f64,
    /// Optional human-readable label propagated to the result row. The
    /// CLI uses it to keep plateau identity across JSON round-trips.
    #[serde(default)]
    pub label: Option<String>,
}

/// One plateau result. JSON-compatible with the CLI `sweep` output.
#[derive(Debug, Clone, Serialize)]
pub struct PlateauResult {
    #[serde(rename = "N")]
    pub n: usize,
    pub label: Option<String>,
    pub t_c_lo: f64,
    pub t_c_hi: f64,
    pub steps_taken: usize,
    pub reason: String,
    pub max_interval_width: f64,
    pub runtime_ms: u128,
}

/// Options for the rayon sweep. `workers = Some(K)` builds a local
/// rayon pool with K worker threads (useful for the acceptance test
/// where we want a deterministic worker count). `workers = None`
/// uses the global default rayon pool (size = num CPU cores).
#[derive(Debug, Clone, Default)]
pub struct SweepOpts {
    pub workers: Option<usize>,
}

fn run_one(spec: &PlateauSpec) -> PlateauResult {
    let t0 = Instant::now();
    let CollisionBracket {
        t_c_lo,
        t_c_hi,
        steps,
        reason,
        max_interval_width,
    } = backward_collision_interval(&spec.initial_x, spec.dt, spec.max_steps);
    let runtime_ms = t0.elapsed().as_millis();
    PlateauResult {
        n: spec.n,
        label: spec.label.clone(),
        t_c_lo,
        t_c_hi,
        steps_taken: steps,
        reason,
        max_interval_width,
        runtime_ms,
    }
}

/// Serial reference: invoke `backward_collision_interval` once per
/// plateau, in order. Used by the acceptance test as the determinism
/// baseline. Exposed so external callers can also opt out of rayon
/// when, for example, the host has only one CPU.
pub fn serial_plateau_sweep(plateaus: &[PlateauSpec]) -> Vec<PlateauResult> {
    plateaus.iter().map(run_one).collect()
}

/// Parallel sweep: one rayon task per plateau. The result vector is in
/// the same order as `plateaus` (rayon `par_iter().collect()` preserves
/// indexed order on slices via `IndexedParallelIterator`).
pub fn par_plateau_sweep(plateaus: &[PlateauSpec], opts: SweepOpts) -> Vec<PlateauResult> {
    match opts.workers {
        Some(k) if k >= 1 => {
            let pool = rayon::ThreadPoolBuilder::new()
                .num_threads(k)
                .build()
                .expect("build local rayon pool");
            pool.install(|| plateaus.par_iter().map(run_one).collect())
        }
        _ => plateaus.par_iter().map(run_one).collect(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Tiny smoke test on 2 plateaus with the same N=10 instance the
    /// rk4 unit tests already use. We only verify shape + determinism
    /// at unit-test scope; the cross-backend speedup test is the
    /// integration test at `tests/parallel_plateau_sweep.rs`.
    #[test]
    fn two_plateau_smoke_deterministic() {
        let g0: Vec<f64> = (1..=10).map(|i| i as f64).collect();
        let specs = vec![
            PlateauSpec {
                n: 10,
                initial_x: g0.clone(),
                dt: 1e-4,
                max_steps: 5,
                tolerance: 0.0,
                label: Some("p0".into()),
            },
            PlateauSpec {
                n: 10,
                initial_x: g0,
                dt: 1e-4,
                max_steps: 5,
                tolerance: 0.0,
                label: Some("p1".into()),
            },
        ];
        let serial = serial_plateau_sweep(&specs);
        let parallel = par_plateau_sweep(&specs, SweepOpts::default());
        assert_eq!(serial.len(), parallel.len(), "result length mismatch");
        for (i, (s, p)) in serial.iter().zip(parallel.iter()).enumerate() {
            assert_eq!(s.n, p.n, "plateau {} N mismatch", i);
            assert_eq!(
                s.t_c_lo.to_bits(),
                p.t_c_lo.to_bits(),
                "plateau {} t_c_lo not bitwise identical",
                i
            );
            assert_eq!(
                s.t_c_hi.to_bits(),
                p.t_c_hi.to_bits(),
                "plateau {} t_c_hi not bitwise identical",
                i
            );
            assert_eq!(
                s.steps_taken, p.steps_taken,
                "plateau {} steps mismatch",
                i
            );
            assert_eq!(s.reason, p.reason, "plateau {} reason mismatch", i);
        }
    }
}
