//! imp-1141: Rust port of the L_pt downstream chain.
//!
//! Ports the four building blocks of the Polymath15 bridge bound from JS
//! (`src/data/finite-height-beats-platt-trudgian.js`) into native Rust
//! using `inari` intervals throughout.
//!
//! Components ported:
//!   * C_mb conservative-carryforward (imp-963 + imp-1082/1087/1088)
//!     -- delivered as the constant K = 0.2014 with rescue formula check.
//!   * E_trunc (imp-447 / imp-459, PT + Ingham at sigma_opt = 0.75).
//!   * E_flow  (imp-398, RvM density integral C_F = (log(T0/2pi)+1)/(2pi)).
//!   * E_coll  (imp-399, C_C = (1/8) * sqrt(3*pi)).
//!
//! All inputs (N, T_PT, sigma_opt, the V2 OLS fit constants a,b, and the
//! pinned constants C_C, K_mb) are passed in as Float64 and immediately
//! lifted into singleton intervals so the downstream arithmetic is fully
//! interval-typed. The caller can then read the midpoint of L_pt via
//! `(lo + hi) / 2` for a scalar comparison against the JS reference.
//!
//! Cross-reference: `src/data/finite-height-beats-platt-trudgian.js`,
//! function `evaluateAtN(N)`.

use inari::Interval;
use crate::as_interval;

/// Compact summary of the chain at one N -- both interval enclosures
/// and Float64 midpoints for ergonomic comparison.
#[derive(Debug, Clone, Copy)]
pub struct ChainResult {
    pub n: f64,
    pub t0_mid: f64,
    pub tc_proj_mid: f64,
    pub c_t_mid: f64,
    pub kappa_t_mid: f64,
    pub c_f_mid: f64,
    pub e_trunc_polymath_mid: f64,
    pub e_flow_mid: f64,
    pub e_coll_mid: f64,
    pub e_trunc_pt_mid: f64,
    pub l_cond_mid: f64,
    pub l_full_mid: f64,
    pub l_pt_mid: f64,
    pub k_mb_used: f64,
    pub rescue_lhs: f64,
    pub rescue_satisfied: bool,
    /// Tight interval enclosure of L_pt
    pub l_pt_lo: f64,
    pub l_pt_hi: f64,
    pub l_cond_lo: f64,
    pub l_cond_hi: f64,
}

/// Invert the Riemann-von Mangoldt asymptotic
///     N(T) ~ (T / (2*pi)) * (log(T / (2*pi)) - 1)
/// for T given N. Newton iteration mirroring
/// `effectiveHeightForN` from `lambda-rh-height-mapping.js`.
pub fn effective_height_for_n(n: f64) -> f64 {
    if !(n > 0.0) || !n.is_finite() {
        return 0.0;
    }
    let two_pi = 2.0 * std::f64::consts::PI;
    let mut t = (two_pi * std::f64::consts::E).max(two_pi * n / (1.0_f64.max((n + two_pi).ln())));
    for _ in 0..40 {
        let u = (t / two_pi).ln();
        let f = (t / two_pi) * (u - 1.0) - n;
        let fp = u / two_pi;
        if !fp.is_finite() || fp.abs() <= 0.0 {
            break;
        }
        let dt = f / fp;
        t -= dt;
        if !(t > two_pi) {
            t = two_pi * 1.0001;
        }
        if dt.abs() < 1e-9 * t.abs().max(1.0) {
            break;
        }
    }
    t
}

/// Midpoint of an interval (for comparing against JS Float64 scalars).
fn mid(z: Interval) -> f64 {
    0.5 * (z.inf() + z.sup())
}

/// E_trunc(N) -- the Polymath15 power-law truncation term (imp-397):
///     C_T(T0) = (3*L - 6) / (2*L)
///     kappa_T = 4 / (3*L - 2)
///     E_trunc = C_T * T0^(-kappa_T) * L                with L = log(T0).
/// Returns (C_T, kappa_T, E_trunc) all as intervals.
fn etrunc_polymath(t0: Interval) -> Option<(Interval, Interval, Interval)> {
    if t0.inf() <= std::f64::consts::E {
        return None;
    }
    let l = t0.ln();
    let three = as_interval(3.0);
    let two = as_interval(2.0);
    let six = as_interval(6.0);
    let four = as_interval(4.0);
    let denom_kappa = three * l - two;
    if denom_kappa.inf() <= 0.0 {
        return None;
    }
    let c_t = (three * l - six) / (two * l);
    let kappa_t = four / denom_kappa;
    // T0^(-kappa) = exp(-kappa * log T0)
    let neg_kappa_l = -(kappa_t * l);
    let pow_t0 = neg_kappa_l.exp();
    let e_trunc = c_t * pow_t0 * l;
    Some((c_t, kappa_t, e_trunc))
}

/// E_flow(N) -- imp-398:
///     C_F = (log(T0 / (2 pi)) + 1) / (2 pi)
///     E_flow = C_F * log(T0) / T0 * exp(|t_c|).
fn eflow(t0: Interval, tc: Interval) -> Option<(Interval, Interval)> {
    if t0.inf() <= 1.0 {
        return None;
    }
    let two_pi = as_interval(2.0 * std::f64::consts::PI);
    let l = t0.ln();
    let c_f = ((t0 / two_pi).ln() + as_interval(1.0)) / two_pi;
    let e_flow = c_f * l / t0 * tc.exp();
    Some((c_f, e_flow))
}

/// E_coll(N) -- imp-399:
///     E_coll = C_C * sqrt(log(T0) / N),  C_C = (1/8)*sqrt(3*pi)
fn ecoll(t0: Interval, n: Interval, c_c: Interval) -> Option<Interval> {
    if t0.inf() <= 1.0 {
        return None;
    }
    if n.inf() < 1.0 {
        return None;
    }
    let l = t0.ln();
    Some(c_c * (l / n).sqrt())
}

/// E_trunc_pt -- imp-447 + imp-459 (PT 2021 + Ingham at sigma_opt = 0.75):
///     e_I    = 3 * (1 - sigma) / (2 - sigma)
///     kappa  = 1 - e_I
///     factor = 2 * e_I / kappa
///     bound  = factor * T_PT^(-kappa) = factor * exp(-kappa * log(T_PT))
fn etrunc_pt(t_pt: Interval, sigma_opt: Interval) -> Option<(Interval, Interval, Interval)> {
    let one = as_interval(1.0);
    let two = as_interval(2.0);
    let three = as_interval(3.0);
    let num = three * (one - sigma_opt);
    let den = two - sigma_opt;
    let e_i = num / den;
    let kappa = one - e_i;
    if kappa.inf() <= 0.0 {
        return None;
    }
    let factor = (two * e_i) / kappa;
    let ln_t_pt = t_pt.ln();
    let bound = factor * (-(kappa * ln_t_pt)).exp();
    Some((e_i, kappa, bound))
}

/// Rescue formula check from `finite-k-c-mb-unconditional.js`:
///     K * log(N) / sqrt(N) < rho_min = 0.12751
/// Returns (lhs, satisfied).
fn rescue_check(k_mb: f64, n: f64) -> (f64, bool) {
    if !(n > 1.0) {
        return (f64::INFINITY, false);
    }
    let lhs = k_mb * n.ln() / n.sqrt();
    (lhs, lhs < 0.12751)
}

/// Inputs to `compute_chain`. Mirrors the JS `evaluateAtN(N)` API but
/// hoists the pinned constants up so the caller can override them for
/// cross-validation against alternate fits.
#[derive(Debug, Clone, Copy)]
pub struct ChainInputs {
    pub n: f64,
    pub t_pt: f64,
    pub sigma_opt: f64,
    /// V2 OLS intercept `a`  (from PATH_C_BASELINE_FIT_V2.fit.intercept_a)
    pub fit_a: f64,
    /// V2 OLS slope `b`      (from PATH_C_BASELINE_FIT_V2.fit.slope_b)
    pub fit_b: f64,
    /// Pinned collision constant C_C (imp-399); default (1/8)*sqrt(3*pi)
    pub c_c: f64,
    /// Carryforward C_mb upper bound (imp-963 / imp-1082); default 0.2014
    pub k_mb: f64,
}

impl Default for ChainInputs {
    fn default() -> Self {
        Self {
            n: 1.0e4,
            t_pt: 3.0e12,
            sigma_opt: 0.75,
            fit_a: 0.0,
            fit_b: 0.0,
            c_c: (1.0 / 8.0) * (3.0 * std::f64::consts::PI).sqrt(),
            k_mb: 0.2014,
        }
    }
}

/// Run the full chain. Returns `None` if any sub-formula refused (e.g.
/// T0 not above e, sigma giving kappa <= 0).
pub fn compute_chain(inp: ChainInputs) -> Option<ChainResult> {
    let t0_f = effective_height_for_n(inp.n);
    if !(t0_f > std::f64::consts::E) {
        return None;
    }

    let t0 = as_interval(t0_f);
    let n_i = as_interval(inp.n);

    // |t_c(N)| <= a + b / N  (V2 OLS projection at the point estimate)
    let a = as_interval(inp.fit_a);
    let b = as_interval(inp.fit_b);
    let tc = a + b / n_i;
    let tc_mid = mid(tc);
    let tc_for_flow = if tc_mid > 0.0 { tc } else { as_interval(0.01) };

    let (c_t, kappa_t, e_trunc_poly) = etrunc_polymath(t0)?;
    let (c_f, e_flow_v) = eflow(t0, tc_for_flow)?;
    let c_c_i = as_interval(inp.c_c);
    let e_coll_v = ecoll(t0, n_i, c_c_i)?;

    let (_e_i, _kappa_pt, e_trunc_pt_v) = etrunc_pt(as_interval(inp.t_pt), as_interval(inp.sigma_opt))?;

    // TRACK 1 -- conditional bound: |t_c| + E_flow + E_coll (excludes E_trunc)
    let l_cond = tc + e_flow_v + e_coll_v;
    // TRACK 2 -- full naive bound: includes the unrescued E_trunc.
    let l_full = l_cond + e_trunc_poly;
    // TRACK 3 -- PT-improved bound: replaces E_trunc with E_trunc_pt.
    let l_pt = l_cond + e_trunc_pt_v;

    let (rescue_lhs, rescue_satisfied) = rescue_check(inp.k_mb, inp.n);

    Some(ChainResult {
        n: inp.n,
        t0_mid: t0_f,
        tc_proj_mid: tc_mid,
        c_t_mid: mid(c_t),
        kappa_t_mid: mid(kappa_t),
        c_f_mid: mid(c_f),
        e_trunc_polymath_mid: mid(e_trunc_poly),
        e_flow_mid: mid(e_flow_v),
        e_coll_mid: mid(e_coll_v),
        e_trunc_pt_mid: mid(e_trunc_pt_v),
        l_cond_mid: mid(l_cond),
        l_full_mid: mid(l_full),
        l_pt_mid: mid(l_pt),
        k_mb_used: inp.k_mb,
        rescue_lhs,
        rescue_satisfied,
        l_pt_lo: l_pt.inf(),
        l_pt_hi: l_pt.sup(),
        l_cond_lo: l_cond.inf(),
        l_cond_hi: l_cond.sup(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn approx_eq(a: f64, b: f64, tol: f64) -> bool {
        (a - b).abs() < tol
    }

    #[test]
    fn effective_height_round_trips_at_n_1e4() {
        let t = effective_height_for_n(1.0e4);
        // From the JS module: N=10^4 -> T0 ~ 1.34e4
        // Sanity: re-evaluate the forward count.
        let two_pi = 2.0 * std::f64::consts::PI;
        let u = (t / two_pi).ln();
        let n_back = (t / two_pi) * (u - 1.0);
        assert!(approx_eq(n_back, 1.0e4, 1.0));
    }

    #[test]
    fn etrunc_pt_at_sigma_075_t_3e12_around_3e_minus_5() {
        let (_e_i, _kappa, bound) = etrunc_pt(as_interval(3.0e12), as_interval(0.75)).unwrap();
        let v = mid(bound);
        // JS reference: 3.064e-5 at sigma = 0.75, T_PT = 3e12 (Polymath/Ingham).
        assert!(approx_eq(v, 3.064e-5, 1.0e-7), "got {}", v);
    }

    #[test]
    fn c_c_pinned_default_matches_1_over_8_sqrt_3pi() {
        let c = ChainInputs::default().c_c;
        let expected = (1.0 / 8.0) * (3.0 * std::f64::consts::PI).sqrt();
        assert!(approx_eq(c, expected, 1.0e-15));
    }
}
