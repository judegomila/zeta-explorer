//! eml primitive — Odrzywolek 2026 single-operator analog of NAND.
//!
//! eml(x, y) = exp(x) - ln(y)
//!
//! Interval enclosure (per the JS reference in
//! `src/math/imp-925-eml-interval-primitive.mjs`):
//!   - `d/dx eml = exp(x) > 0`  -> monotone increasing in x
//!   - `d/dy eml = -1/y < 0`    for y > 0  -> monotone decreasing in y
//!
//! Therefore
//!   eml([a, b], [c, d]) = [exp(a) - ln(d), exp(b) - ln(c)]
//! enclosed by IEEE 1788 directed rounding (inari does this for free
//! on every primitive operation we call).
//!
//! If the y-interval straddles or touches zero, ln(y) is undefined and
//! we return `None`; the caller is expected to short-circuit (this
//! matches the JS reciprocalInterval short-circuit pattern).

use inari::{interval, Interval};

/// Single-operator interval primitive: eml(x, y) = exp(x) - ln(y).
///
/// Returns `None` if y straddles or touches zero.
pub fn eml_interval(x: Interval, y: Interval) -> Option<Interval> {
    if y.inf() <= 0.0 {
        return None;
    }
    // Use the monotonicity-decomposed form: lower bound uses x.inf and
    // y.sup, upper bound uses x.sup and y.inf. Build pointwise exp/ln
    // via inari with the singleton intervals so directed rounding is
    // applied automatically.
    let a = interval!(x.inf(), x.inf()).expect("finite point interval");
    let b = interval!(x.sup(), x.sup()).expect("finite point interval");
    let c = interval!(y.inf(), y.inf()).expect("finite point interval");
    let d = interval!(y.sup(), y.sup()).expect("finite point interval");

    let exp_a = a.exp();
    let exp_b = b.exp();
    let ln_c = c.ln();
    let ln_d = d.ln();

    // lo = exp(a) - ln(d) -> use lower-rounded exp(a) sub upper-rounded ln(d).
    let lo_int = exp_a - ln_d;
    let hi_int = exp_b - ln_c;

    // Conservative union — take lo = lo_int.inf, hi = hi_int.sup.
    let lo = lo_int.inf();
    let hi = hi_int.sup();
    if !lo.is_finite() || !hi.is_finite() || lo > hi {
        return None;
    }
    Some(interval!(lo, hi).expect("eml enclosure interval is valid"))
}

/// Convenience: exp(z) = eml(z, [1, 1]).
pub fn exp_interval(z: Interval) -> Option<Interval> {
    let one = interval!(1.0, 1.0).expect("point interval");
    eml_interval(z, one)
}

#[cfg(test)]
mod tests {
    use super::*;
    use inari::interval;

    fn approx(a: f64, b: f64, tol: f64) -> bool {
        (a - b).abs() <= tol
    }

    #[test]
    fn eml_zero_one_is_one() {
        let r = eml_interval(
            interval!(0.0, 0.0).unwrap(),
            interval!(1.0, 1.0).unwrap(),
        )
        .expect("eml(0,1) defined");
        assert!(approx(r.inf(), 1.0, 1e-12));
        assert!(approx(r.sup(), 1.0, 1e-12));
    }

    #[test]
    fn eml_one_one_is_e() {
        let r = eml_interval(
            interval!(1.0, 1.0).unwrap(),
            interval!(1.0, 1.0).unwrap(),
        )
        .expect("eml(1,1) defined");
        let e = std::f64::consts::E;
        assert!(approx(r.inf(), e, 1e-10));
        assert!(approx(r.sup(), e, 1e-10));
    }

    #[test]
    fn eml_y_straddles_zero_returns_none() {
        let r = eml_interval(
            interval!(0.0, 0.0).unwrap(),
            interval!(-1.0, 1.0).unwrap(),
        );
        assert!(r.is_none());
    }

    #[test]
    fn eml_interval_inputs_monotone() {
        // eml([0,1],[1,2]) expected [1 - ln 2, e]
        let r = eml_interval(
            interval!(0.0, 1.0).unwrap(),
            interval!(1.0, 2.0).unwrap(),
        )
        .expect("eml interval defined");
        let expected_lo = 1.0 - 2.0_f64.ln();
        let expected_hi = std::f64::consts::E;
        assert!(r.inf() <= expected_lo + 1e-12);
        assert!(r.sup() >= expected_hi - 1e-12);
    }
}
