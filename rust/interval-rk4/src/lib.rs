//! interval-rk4: Phase 1 MVP — native Rust port of the JS interval-RK4
//! Dyson backward integrator (mathexplorer imp-1090).
//!
//! See the JS source at `src/math/interval-dyson-integrator.mjs` and
//! `src/math/imp-925-eml-interval-primitive.mjs` for the reference
//! semantics. We replicate the one-ULP outward inflation pattern via
//! the IEEE 1788 directed-rounding primitives that `inari` exposes for
//! free, so each Float64 op produces an interval whose width is bounded
//! by the same 2-ULP envelope (or tighter when the directed-rounded
//! result is exactly representable).
//!
//! Public API:
//!   - `eml::eml_interval(x, y) -> Option<Interval>` — Odrzywolek 2026
//!     single-operator primitive eml(x, y) = exp(x) - ln(y).
//!   - `dyson::dyson_drift_interval(gammas, k) -> Option<Interval>` —
//!     Calogero-Moser drift for particle k: -2 * sum_{j != k} 1/(g_k - g_j).
//!   - `dyson::dyson_drift_vector(gammas) -> Option<Vec<Interval>>`
//!   - `rk4::rk4_interval_step(state, dt) -> Option<Vec<Interval>>` —
//!     one classical RK4 step using `dyson_drift_vector` as the RHS.

pub mod barnes_hut;
pub mod dyson;
pub mod eml;
pub mod interval_ols;
pub mod parallel;
pub mod rk4;

pub use barnes_hut::{BHTree, LEAF_SIZE};
pub use dyson::{
    dyson_drift_barnes_hut, dyson_drift_interval, dyson_drift_vector,
    dyson_drift_vector_barnes_hut,
};
pub use eml::eml_interval;
pub use interval_ols::{interval_ols, OlsError, OlsIntervalFit, OlsRow};
pub use parallel::{
    par_plateau_sweep, serial_plateau_sweep, PlateauResult, PlateauSpec, SweepOpts,
};
pub use rk4::rk4_interval_step;

/// Re-export the underlying interval type so downstream crates do not
/// have to depend on `inari` directly.
pub use inari::Interval;

/// Wrap a single f64 as a degenerate (point) interval. We use the
/// inari literal helper, so the resulting interval is the smallest
/// IEEE 754 enclosure of `x` (one ULP wide in general, exactly `[x, x]`
/// when `x` is representable, which all f64 doubles are).
pub fn as_interval(x: f64) -> Interval {
    // Interval::try_from((lo, hi)) panics on invalid input; for finite x
    // it always succeeds.
    Interval::try_from((x, x)).expect("finite scalar to interval")
}
