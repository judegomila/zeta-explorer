//! imp-1110 Phase 4 acceptance test: rayon parallel plateau sweep.
//!
//! Builds 4 plateaus at N in {500, 1000, 2000, 5000} (synthetic
//! integer-spaced lattice — deterministic, self-contained, no external
//! reference data needed — matches the rk4 unit-test fixture style),
//! runs each plateau serially via `backward_collision_interval` once,
//! then runs all 4 in parallel via `par_plateau_sweep`. Asserts:
//!   (a) wall-clock speedup >= 3x on >= 4-core systems
//!   (b) per-plateau brackets are BITWISE IDENTICAL serial vs parallel
//!       (t_c_lo / t_c_hi / reason / steps_taken / max_interval_width)
//!   (c) the 4 results returned by `par_plateau_sweep` are in the same
//!       order as the input specs (rayon par_iter on slices preserves
//!       indexed order via IndexedParallelIterator)
//!
//! Why an integer lattice. The two-particle Calogero-Moser collision
//! time scales like H^2 / 8 where H is the inter-particle spacing. At
//! H=1 (integer lattice) and dt=1e-4 the bracket closes after ~125k
//! steps in the worst pair — far beyond the small per-plateau budget
//! we set here. So in this test every plateau exits with
//! budget-exhausted (the certified lower bound t_c_lo is well-defined
//! and positive; t_c_hi is +inf), which is exactly what we need to
//! measure parallel runtime cleanly: every plateau hits its full step
//! budget, no early-termination noise.

use interval_rk4::parallel::{par_plateau_sweep, serial_plateau_sweep, PlateauSpec, SweepOpts};
use std::time::Instant;

// Four plateaus at the ticket-specified N values. Per-step cost is
// dominated by the drift sum which is O(N^2), so to expose
// rayon parallelism cleanly we set per-plateau max_steps so that the
// per-plateau cost is RUFFLY BALANCED — otherwise the largest plateau
// dwarfs everything and Amdahl-bounds the speedup at ~total/max ~ 1.2x.
// Empirically (release build, M-series host) one RK4 step is ~1.5 ms
// at N=500, ~6 ms at N=1000, ~25 ms at N=2000, ~150 ms at N=5000. We
// pick max_steps so per-plateau cost ~ 3000 N=500-equivalents, giving
// each plateau a ~5-second budget and a total serial ~20s, parallel
// ~5s (theoretical ~4x speedup at 4 cores and beyond).
const TEST_PLATEAUS: [(usize, usize); 4] = [
    (500, 100),
    (1000, 27),
    (2000, 7),
    (5000, 1),
];
const TEST_DT: f64 = 1e-4;
const MIN_SPEEDUP: f64 = 3.0;

fn make_specs() -> Vec<PlateauSpec> {
    TEST_PLATEAUS
        .iter()
        .map(|&(n, max_steps)| {
            let initial_x: Vec<f64> = (0..n).map(|i| (i + 1) as f64).collect();
            PlateauSpec {
                n,
                initial_x,
                dt: TEST_DT,
                max_steps,
                tolerance: 0.0,
                label: Some(format!("plateau-N-{}", n)),
            }
        })
        .collect()
}

#[test]
fn par_plateau_sweep_matches_serial_and_speeds_up() {
    let specs = make_specs();

    // Warmup: trigger first-call setup (inari rounding-mode init, allocator,
    // rayon worker spawn) so the timed measurements below are steady-state.
    {
        let warmup_specs: Vec<PlateauSpec> = vec![PlateauSpec {
            n: 100,
            initial_x: (0..100usize).map(|i| (i + 1) as f64).collect(),
            dt: TEST_DT,
            max_steps: 1,
            tolerance: 0.0,
            label: Some("warmup".into()),
        }];
        let _ = serial_plateau_sweep(&warmup_specs);
        let _ = par_plateau_sweep(&warmup_specs, SweepOpts::default());
    }

    // Serial baseline. We use the public serial_plateau_sweep helper
    // (one-by-one calls to backward_collision_interval) so the only
    // difference between baseline and treatment is the rayon
    // par_iter dispatch.
    let t_serial_start = Instant::now();
    let serial_results = serial_plateau_sweep(&specs);
    let serial_ms = t_serial_start.elapsed().as_millis() as f64;

    // Parallel treatment. We pass workers = None to use the global
    // rayon default pool (size = num CPUs).
    let t_parallel_start = Instant::now();
    let parallel_results = par_plateau_sweep(&specs, SweepOpts::default());
    let parallel_ms = t_parallel_start.elapsed().as_millis() as f64;

    eprintln!(
        "parallel_plateau_sweep: serial_ms={:.0} parallel_ms={:.0} speedup={:.2}x workers={}",
        serial_ms,
        parallel_ms,
        if parallel_ms > 0.0 { serial_ms / parallel_ms } else { f64::INFINITY },
        rayon::current_num_threads(),
    );

    // (a) Order preserved.
    assert_eq!(
        serial_results.len(),
        parallel_results.len(),
        "result vector length mismatch"
    );
    assert_eq!(
        parallel_results.len(),
        TEST_PLATEAUS.len(),
        "expected one result per plateau"
    );

    // (b) Bitwise-identical per-plateau brackets.
    for (i, (s, p)) in serial_results.iter().zip(parallel_results.iter()).enumerate() {
        assert_eq!(s.n, p.n, "plateau {} N differs", i);
        assert_eq!(p.n, TEST_PLATEAUS[i].0, "plateau {} not in input order", i);
        assert_eq!(
            s.t_c_lo.to_bits(),
            p.t_c_lo.to_bits(),
            "plateau {} (N={}) t_c_lo not bitwise identical: serial={} parallel={}",
            i,
            s.n,
            s.t_c_lo,
            p.t_c_lo,
        );
        assert_eq!(
            s.t_c_hi.to_bits(),
            p.t_c_hi.to_bits(),
            "plateau {} (N={}) t_c_hi not bitwise identical: serial={} parallel={}",
            i,
            s.n,
            s.t_c_hi,
            p.t_c_hi,
        );
        assert_eq!(
            s.steps_taken, p.steps_taken,
            "plateau {} (N={}) steps_taken differ",
            i, s.n
        );
        assert_eq!(
            s.reason, p.reason,
            "plateau {} (N={}) reason differs",
            i, s.n
        );
        assert_eq!(
            s.max_interval_width.to_bits(),
            p.max_interval_width.to_bits(),
            "plateau {} (N={}) max_interval_width not bitwise identical",
            i,
            s.n
        );
    }

    // (c) Speedup. The host running this test must have >= 4 cores to
    // make the assertion meaningful; if num_threads < 4 we skip the
    // assertion with a warning (still report the ratio).
    let n_workers = rayon::current_num_threads();
    if n_workers >= 4 && parallel_ms > 0.0 {
        let speedup = serial_ms / parallel_ms;
        assert!(
            speedup >= MIN_SPEEDUP,
            "speedup {:.2}x at {} workers below minimum {:.2}x (serial_ms={:.0} parallel_ms={:.0})",
            speedup,
            n_workers,
            MIN_SPEEDUP,
            serial_ms,
            parallel_ms,
        );
    } else {
        eprintln!(
            "WARNING: skipping speedup assertion (workers={}, parallel_ms={})",
            n_workers, parallel_ms,
        );
    }
}

#[test]
fn par_plateau_sweep_with_local_pool_two_workers() {
    // Sanity: a local pool with 2 workers works and still produces
    // bitwise-identical brackets. Not a speedup assertion (2-worker
    // pool on 4 plateaus is ~2x at best; we just want the API path
    // exercised under a non-default workers value). Uses a TINY
    // budget (max_steps = 1 at the smallest two N) so it does not
    // contend with the main speedup test when cargo runs the integration
    // tests in parallel; the speedup test sets MIN_SPEEDUP at a margin
    // that tolerates light concurrent CPU pressure but we still keep
    // this companion test deliberately small.
    let specs: Vec<PlateauSpec> = [(500usize, 2usize), (1000, 1)]
        .iter()
        .map(|&(n, max_steps)| {
            let initial_x: Vec<f64> = (0..n).map(|i| (i + 1) as f64).collect();
            PlateauSpec {
                n,
                initial_x,
                dt: TEST_DT,
                max_steps,
                tolerance: 0.0,
                label: Some(format!("tiny-N-{}", n)),
            }
        })
        .collect();
    let serial = serial_plateau_sweep(&specs);
    let parallel = par_plateau_sweep(&specs, SweepOpts { workers: Some(2) });
    assert_eq!(serial.len(), parallel.len());
    for (i, (s, p)) in serial.iter().zip(parallel.iter()).enumerate() {
        assert_eq!(
            s.t_c_lo.to_bits(),
            p.t_c_lo.to_bits(),
            "plateau {} local-pool t_c_lo differs",
            i
        );
        assert_eq!(
            s.t_c_hi.to_bits(),
            p.t_c_hi.to_bits(),
            "plateau {} local-pool t_c_hi differs",
            i
        );
    }
}
