//! Classical RK4 step in interval arithmetic.
//!
//! Mirrors `rk4IntervalStep` from the JS source
//! `src/math/interval-dyson-integrator.mjs`. Positive `dt` corresponds
//! to BACKWARD Dyson flow per the imp-362 sign convention.

use crate::as_interval;
use crate::dyson::dyson_drift_vector;
use inari::Interval;

/// One RK4 step using `dyson_drift_vector` as the RHS. Returns `None`
/// if any intermediate stage hit a zero-gap (certified collision).
pub fn rk4_interval_step(state: &[Interval], dt: Interval) -> Option<Vec<Interval>> {
    let n = state.len();
    let half = as_interval(0.5);
    let sixth = as_interval(1.0 / 6.0);
    let two = as_interval(2.0);

    let k1 = dyson_drift_vector(state)?;

    let mut stage2 = Vec::with_capacity(n);
    for i in 0..n {
        stage2.push(state[i] + (half * dt) * k1[i]);
    }
    let k2 = dyson_drift_vector(&stage2)?;

    let mut stage3 = Vec::with_capacity(n);
    for i in 0..n {
        stage3.push(state[i] + (half * dt) * k2[i]);
    }
    let k3 = dyson_drift_vector(&stage3)?;

    let mut stage4 = Vec::with_capacity(n);
    for i in 0..n {
        stage4.push(state[i] + dt * k3[i]);
    }
    let k4 = dyson_drift_vector(&stage4)?;

    let mut out = Vec::with_capacity(n);
    for i in 0..n {
        let s = k1[i] + two * k2[i] + two * k3[i] + k4[i];
        let incr = (sixth * dt) * s;
        out.push(state[i] + incr);
    }
    Some(out)
}

/// Backward collision bracketer. Mirrors `backwardCollisionInterval`
/// in the JS source. Returns
///   (t_c_lo, t_c_hi, steps_taken, reason, max_interval_width)
/// where `reason` is one of `gap-lower-bound-nonpositive`,
/// `rk4-stage-zero-crossing`, `budget-exhausted`.
pub struct CollisionBracket {
    pub t_c_lo: f64,
    pub t_c_hi: f64,
    pub steps: usize,
    pub reason: String,
    pub max_interval_width: f64,
}

pub fn backward_collision_interval(
    gammas0: &[f64],
    dt_max: f64,
    n_steps: usize,
) -> CollisionBracket {
    let mut gammas: Vec<Interval> = gammas0.iter().map(|&g| as_interval(g)).collect();
    let dt_int = as_interval(dt_max);
    let mut t_abs = 0.0_f64;
    let mut prev_t_abs = 0.0_f64;
    let mut max_w = 0.0_f64;

    for step in 0..n_steps {
        // Min-gap check BEFORE integrating: any gap interval with
        // nonpositive lower bound flags a closed bracket.
        let mut min_gap_lo = f64::INFINITY;
        for i in 0..gammas.len().saturating_sub(1) {
            let gap = gammas[i + 1] - gammas[i];
            if gap.inf() < min_gap_lo {
                min_gap_lo = gap.inf();
            }
            let w = gap.sup() - gap.inf();
            if w > max_w {
                max_w = w;
            }
        }
        if min_gap_lo <= 0.0 {
            return CollisionBracket {
                t_c_lo: prev_t_abs,
                t_c_hi: t_abs,
                steps: step,
                reason: "gap-lower-bound-nonpositive".to_string(),
                max_interval_width: max_w,
            };
        }

        match rk4_interval_step(&gammas, dt_int) {
            Some(next) => {
                gammas = next;
                prev_t_abs = t_abs;
                t_abs += dt_max;
            }
            None => {
                return CollisionBracket {
                    t_c_lo: t_abs,
                    t_c_hi: t_abs + dt_max,
                    steps: step,
                    reason: "rk4-stage-zero-crossing".to_string(),
                    max_interval_width: max_w,
                };
            }
        }
    }

    CollisionBracket {
        t_c_lo: t_abs,
        t_c_hi: f64::INFINITY,
        steps: n_steps,
        reason: "budget-exhausted".to_string(),
        max_interval_width: max_w,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::as_interval;

    #[test]
    fn ten_particle_step_finite() {
        let gammas: Vec<Interval> = (1..=10).map(|i| as_interval(i as f64)).collect();
        let dt = as_interval(1e-4);
        let next = rk4_interval_step(&gammas, dt).expect("step closes");
        assert_eq!(next.len(), 10);
        for (i, g) in next.iter().enumerate() {
            assert!(
                g.inf().is_finite() && g.sup().is_finite(),
                "stage {} not finite",
                i
            );
        }
    }

    #[test]
    fn two_particle_collision_brackets() {
        // Two particles at 0 and 0.01: pair-collision time is
        //   t_c_pair = H^2 / 8 = 1.25e-5
        // We integrate backward in t (positive dt) at dt = 1e-7 which is
        // small enough that the RK4 step does not overshoot past the
        // collision. Expected closure at step ~125.
        let gammas0 = vec![0.0, 0.01];
        let result = backward_collision_interval(&gammas0, 1e-7, 2000);
        // Either a closed bracket or an RK4 zero-crossing — both are
        // valid certified-collision termination reasons. Budget
        // exhaustion would mean the integrator overshot without ever
        // detecting the collision — that is a bug.
        assert!(
            result.reason == "gap-lower-bound-nonpositive"
                || result.reason == "rk4-stage-zero-crossing",
            "unexpected reason: {}",
            result.reason
        );
        // The closed bracket should contain the pair collision time.
        assert!(result.t_c_lo <= 1.5e-5, "t_c_lo too high: {}", result.t_c_lo);
        assert!(result.t_c_hi >= 1.0e-5, "t_c_hi too low: {}", result.t_c_hi);
    }
}
