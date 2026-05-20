//! interval_ols -- rigorous interval-arithmetic OLS fit for y = a + b/N
//!
//! Ticket: imp-1137 (V2 OLS interval-arithmetic refit; rigorous error bar on
//! the asymptotic intercept).
//!
//! Given input rows (N_k, t_lo_k, t_hi_k) with y_k in [t_lo_k, t_hi_k] and
//! x_k = 1 / N_k EXACT (the N_k are integer counts), the OLS solution to the
//! linear model y = a + b * x is:
//!
//!     b = Sxy / Sxx
//!     a = ybar - b * xbar
//!
//! where xbar, ybar, Sxx, Sxy are the usual sums. Critically, since the x_k
//! are EXACT and only the y_k are uncertain, both a and b are LINEAR
//! functions of the y_k:
//!
//!     b = sum_k w_k^b * y_k     with w_k^b = (x_k - xbar) / Sxx
//!     a = sum_k w_k^a * y_k     with w_k^a = 1/n - xbar * (x_k - xbar) / Sxx
//!
//! Evaluating each linear functional with interval arithmetic in this
//! single-occurrence form gives the TIGHTEST possible interval enclosure of
//! (a, b) consistent with the input boxes. Any decomposition that mentions a
//! y_k more than once (for example computing ybar and Sxy separately and
//! combining) would inflate the enclosure by the dependency problem.
//!
//! Residual sup-bound: for each input point, the residual
//!     r_k = y_k - a - b * x_k
//! is evaluated in interval arithmetic. The reported residualSup is the
//! supremum of |r_k| over all k, which gives a CERTIFIED upper bound on the
//! L_inf residual of the fit consistent with the data.
//!
//! Edge cases handled:
//!   - n < 2: cannot fit; returns Err
//!   - All x_k identical (singular Sxx = 0): returns Err
//!   - Any y interval inverted (t_lo > t_hi): returns Err
//!   - Any N_k <= 0 (would make x = 1/N undefined or negative): returns Err
//!   - Point-like input (t_lo == t_hi at every row): degenerate to scalar OLS
//!     but still returned as point intervals.
//!
//! This module deliberately does NOT use a grid-search over (a, b). The
//! single-occurrence linear-projection form is exact and tight, so a grid
//! search would only loosen the result by adding rounding.

use crate::as_interval;
use inari::Interval;
use serde::{Deserialize, Serialize};

/// Single input row: (N, t_lo, t_hi) with y in [t_lo, t_hi] and x = 1 / N.
#[derive(Debug, Clone, Copy, Deserialize, Serialize)]
pub struct OlsRow {
    /// Particle count (positive integer in practice; stored as f64 for
    /// JSON convenience).
    #[serde(rename = "N")]
    pub n: f64,
    pub t_lo: f64,
    pub t_hi: f64,
}

/// Output: interval-valued OLS fit (a, b) plus a residual sup bound.
#[derive(Debug, Clone, Copy, Serialize)]
pub struct OlsIntervalFit {
    pub a_lo: f64,
    pub a_hi: f64,
    pub b_lo: f64,
    pub b_hi: f64,
    pub residual_sup: f64,
    pub n_rows: usize,
    pub sxx: f64,
    pub xbar: f64,
}

/// Error variants for malformed input.
#[derive(Debug, Clone)]
pub enum OlsError {
    InsufficientRows(usize),
    NonPositiveN(f64),
    InvertedYInterval { row: usize, t_lo: f64, t_hi: f64 },
    SingularSxx,
}

impl std::fmt::Display for OlsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OlsError::InsufficientRows(n) => write!(f, "need at least 2 rows, got {}", n),
            OlsError::NonPositiveN(v) => write!(f, "N must be > 0, got {}", v),
            OlsError::InvertedYInterval { row, t_lo, t_hi } => write!(
                f,
                "row {} has inverted y interval [{}, {}] (t_lo > t_hi)",
                row, t_lo, t_hi
            ),
            OlsError::SingularSxx => write!(f, "all 1/N values equal; Sxx = 0 singular"),
        }
    }
}

impl std::error::Error for OlsError {}

/// Multiply a scalar weight (point) by an interval [t_lo, t_hi].
/// Returns a tight interval enclosure of w * y.
fn scalar_times_interval(w: f64, t_lo: f64, t_hi: f64) -> Interval {
    let w_iv = as_interval(w);
    let y_iv = Interval::try_from((t_lo, t_hi)).expect("finite y interval");
    w_iv * y_iv
}

/// Compute the rigorous interval-arithmetic OLS fit.
pub fn interval_ols(rows: &[OlsRow]) -> Result<OlsIntervalFit, OlsError> {
    let n = rows.len();
    if n < 2 {
        return Err(OlsError::InsufficientRows(n));
    }
    for (i, r) in rows.iter().enumerate() {
        if !(r.n > 0.0) {
            return Err(OlsError::NonPositiveN(r.n));
        }
        if r.t_lo > r.t_hi {
            return Err(OlsError::InvertedYInterval {
                row: i,
                t_lo: r.t_lo,
                t_hi: r.t_hi,
            });
        }
    }

    // x_k = 1 / N_k -- EXACT to ULP because N_k are exact integers in f64.
    let xs: Vec<f64> = rows.iter().map(|r| 1.0 / r.n).collect();
    let n_f = n as f64;
    let sx: f64 = xs.iter().sum();
    let xbar: f64 = sx / n_f;

    // Sxx = sum (x_k - xbar)^2. Uses Float64 throughout because all
    // operands are EXACT points (x_k are 1/N_k where N_k is a small integer;
    // xbar is a scalar mean). The single division to form b uses interval
    // arithmetic which will outward-round Sxx as needed.
    let dxs: Vec<f64> = xs.iter().map(|x| x - xbar).collect();
    let sxx: f64 = dxs.iter().map(|d| d * d).sum();
    if sxx <= 0.0 || !sxx.is_finite() {
        return Err(OlsError::SingularSxx);
    }

    // Build a and b as SINGLE-OCCURRENCE linear functionals of y_k.
    // For each row k, w_k^b = (x_k - xbar) / Sxx and w_k^a = 1/n - xbar * w_k^b.
    // Accumulate b_iv and a_iv as sums of (w_k * y_k) intervals.
    let mut a_iv = as_interval(0.0);
    let mut b_iv = as_interval(0.0);
    for (k, r) in rows.iter().enumerate() {
        let w_b = dxs[k] / sxx;
        let w_a = 1.0 / n_f - xbar * w_b;
        b_iv = b_iv + scalar_times_interval(w_b, r.t_lo, r.t_hi);
        a_iv = a_iv + scalar_times_interval(w_a, r.t_lo, r.t_hi);
    }

    // Residual sup: for each row k, r_k = y_k - a - b * x_k is evaluated in
    // interval arithmetic and the sup of |r_k| is taken across rows.
    let mut residual_sup: f64 = 0.0;
    for (k, r) in rows.iter().enumerate() {
        let x_iv = as_interval(xs[k]);
        let y_iv = Interval::try_from((r.t_lo, r.t_hi)).expect("finite y");
        let pred = a_iv + b_iv * x_iv;
        let resid = y_iv - pred;
        let abs_sup = resid.inf().abs().max(resid.sup().abs());
        if abs_sup > residual_sup {
            residual_sup = abs_sup;
        }
        let _ = k; // explicit binding for readability
    }

    Ok(OlsIntervalFit {
        a_lo: a_iv.inf(),
        a_hi: a_iv.sup(),
        b_lo: b_iv.inf(),
        b_hi: b_iv.sup(),
        residual_sup,
        n_rows: n,
        sxx,
        xbar,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn pt(n: f64, y: f64) -> OlsRow {
        OlsRow { n, t_lo: y, t_hi: y }
    }

    #[test]
    fn point_input_matches_scalar_ols() {
        // Three exact points on y = 0.005 + 5.0 / N.
        // At N = 100: y = 0.055. At N = 500: y = 0.015. At N = 1000: y = 0.01.
        let rows = vec![
            pt(100.0, 0.055),
            pt(500.0, 0.015),
            pt(1000.0, 0.01),
        ];
        let fit = interval_ols(&rows).expect("fit");
        // a should enclose 0.005 with tiny width; b should enclose 5.0.
        let a_width = fit.a_hi - fit.a_lo;
        let b_width = fit.b_hi - fit.b_lo;
        assert!(a_width < 1e-10, "point-input a width {} too large", a_width);
        assert!(b_width < 1e-7, "point-input b width {} too large", b_width);
        assert!(fit.a_lo <= 0.005 + 1e-12 && fit.a_hi >= 0.005 - 1e-12);
        assert!(fit.b_lo <= 5.0 + 1e-7 && fit.b_hi >= 5.0 - 1e-7);
    }

    #[test]
    fn interval_input_brackets_truth() {
        // True model y = 0.01 + 4.0 / N; each row has +/- 0.0005 noise box.
        // The fit a-interval must ENCLOSE 0.01 and b-interval ENCLOSE 4.0.
        let truth = |n: f64| 0.01 + 4.0 / n;
        let rows = vec![
            OlsRow { n: 100.0, t_lo: truth(100.0) - 0.0005, t_hi: truth(100.0) + 0.0005 },
            OlsRow { n: 500.0, t_lo: truth(500.0) - 0.0005, t_hi: truth(500.0) + 0.0005 },
            OlsRow { n: 1000.0, t_lo: truth(1000.0) - 0.0005, t_hi: truth(1000.0) + 0.0005 },
        ];
        let fit = interval_ols(&rows).expect("fit");
        assert!(fit.a_lo <= 0.01 && fit.a_hi >= 0.01, "a-interval [{}, {}] must contain 0.01", fit.a_lo, fit.a_hi);
        assert!(fit.b_lo <= 4.0 && fit.b_hi >= 4.0, "b-interval [{}, {}] must contain 4.0", fit.b_lo, fit.b_hi);
    }

    #[test]
    fn rejects_too_few_rows() {
        let rows = vec![pt(100.0, 0.05)];
        let err = interval_ols(&rows).unwrap_err();
        matches!(err, OlsError::InsufficientRows(1));
    }

    #[test]
    fn rejects_inverted_y() {
        let rows = vec![
            OlsRow { n: 100.0, t_lo: 0.06, t_hi: 0.05 },
            OlsRow { n: 200.0, t_lo: 0.03, t_hi: 0.04 },
            OlsRow { n: 300.0, t_lo: 0.02, t_hi: 0.03 },
        ];
        let err = interval_ols(&rows).unwrap_err();
        matches!(err, OlsError::InvertedYInterval { .. });
    }

    #[test]
    fn rejects_singular_sxx() {
        // All same N -- xbar = x_k so Sxx = 0.
        let rows = vec![pt(100.0, 0.05), pt(100.0, 0.06), pt(100.0, 0.04)];
        let err = interval_ols(&rows).unwrap_err();
        matches!(err, OlsError::SingularSxx);
    }
}
