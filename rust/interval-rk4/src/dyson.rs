//! Dyson drift in interval arithmetic.
//!
//! Mirrors `dysonDriftInterval` / `dysonDriftVectorInterval` from the JS
//! source `src/math/interval-dyson-integrator.mjs`.
//!
//! Sign convention (matches barrier-extrapolation.js / dyson-scaling-N5000.js):
//!
//!   dg_k/dt = -2 * sum_{j != k} 1 / (g_k - g_j)
//!
//! with POSITIVE dt corresponding to BACKWARD flow toward the
//! Calogero-Moser collision time. A reciprocal interval that straddles
//! zero is the certified collision short-circuit: we propagate `None`
//! up the stack, the RK4 step returns `None`, and the CLI surfaces it
//! as a closed bracket.

use crate::as_interval;
use inari::Interval;

/// Drift for particle `k`. Returns `None` if any (g_k - g_j) straddles 0.
pub fn dyson_drift_interval(gammas: &[Interval], k: usize) -> Option<Interval> {
    let n = gammas.len();
    debug_assert!(k < n, "dyson_drift_interval: k out of range");
    let mut sum = as_interval(0.0);
    let gk = gammas[k];
    for j in 0..n {
        if j == k {
            continue;
        }
        let diff = gk - gammas[j];
        if diff.inf() <= 0.0 && diff.sup() >= 0.0 {
            return None;
        }
        // 1 / diff via inari recip (uses directed rounding).
        let inv = diff.recip();
        if !inv.inf().is_finite() || !inv.sup().is_finite() {
            return None;
        }
        sum = sum + inv;
    }
    let neg_two = as_interval(-2.0);
    Some(neg_two * sum)
}

/// Full drift vector. Returns `None` on any zero-straddling gap.
pub fn dyson_drift_vector(gammas: &[Interval]) -> Option<Vec<Interval>> {
    let n = gammas.len();
    let mut out = Vec::with_capacity(n);
    for k in 0..n {
        match dyson_drift_interval(gammas, k) {
            Some(d) => out.push(d),
            None => return None,
        }
    }
    Some(out)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::as_interval;

    #[test]
    fn two_particle_drift_signs() {
        // Two particles at g_0 = 0, g_1 = 1.
        // dg_0/dt = -2 * 1 / (0 - 1) = -2 * (-1) = +2
        // dg_1/dt = -2 * 1 / (1 - 0) = -2
        let gammas = vec![as_interval(0.0), as_interval(1.0)];
        let v = dyson_drift_vector(&gammas).expect("two-particle drift defined");
        assert!(v[0].inf() > 1.99 && v[0].sup() < 2.01);
        assert!(v[1].inf() > -2.01 && v[1].sup() < -1.99);
    }

    #[test]
    fn ten_particle_drift_finite() {
        // 10 equally spaced particles at 1, 2, ..., 10. All gaps are
        // nonzero so the drift must close.
        let gammas: Vec<Interval> = (1..=10).map(|i| as_interval(i as f64)).collect();
        let v = dyson_drift_vector(&gammas).expect("ten-particle drift defined");
        assert_eq!(v.len(), 10);
        for (i, ent) in v.iter().enumerate() {
            assert!(
                ent.inf().is_finite() && ent.sup().is_finite(),
                "drift {} not finite",
                i
            );
        }
    }

    #[test]
    fn zero_gap_returns_none() {
        // Two particles at the same location: gap straddles 0.
        let gammas = vec![as_interval(1.0), as_interval(1.0)];
        let v = dyson_drift_vector(&gammas);
        assert!(v.is_none());
    }
}
