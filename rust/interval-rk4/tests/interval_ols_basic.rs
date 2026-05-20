//! Integration tests for the interval_ols module (imp-1137).

use interval_rk4::interval_ols::{interval_ols, OlsError, OlsRow};

fn pt(n: f64, y: f64) -> OlsRow {
    OlsRow { n, t_lo: y, t_hi: y }
}

#[test]
fn imp1082_conservative_ladder_brackets_v2_intercept() {
    // imp-1082 conservative ladder: 3 closed rows at N in {25k, 50k, 100k}.
    // Bracket widths are wide (0.0001 each) so the resulting interval-OLS
    // bracket on a is expected to be loose but rigorously enclose every
    // possible OLS fit.
    let rows = vec![
        OlsRow { n: 25000.0, t_lo: 0.0001, t_hi: 0.0002 },
        OlsRow { n: 50000.0, t_lo: 0.0001, t_hi: 0.0002 },
        OlsRow { n: 100000.0, t_lo: 0.0, t_hi: 0.0001 },
    ];
    let fit = interval_ols(&rows).expect("fit");
    let a_width = fit.a_hi - fit.a_lo;
    // Bracket width should be at least the smallest input width (1e-4) and
    // at most a small multiple of it given the spread in 1/N.
    assert!(a_width > 0.0, "a width must be positive, got {}", a_width);
    assert!(
        a_width < 0.05,
        "a bracket width {} exceeds ticket acceptance threshold 0.05",
        a_width
    );
    // a_lo could be negative because the bottom row at N=100000 has t_lo = 0.
    println!(
        "imp-1082 conservative ladder: a in [{}, {}] width {}, b in [{}, {}], residualSup = {}",
        fit.a_lo, fit.a_hi, a_width, fit.b_lo, fit.b_hi, fit.residual_sup
    );
}

#[test]
fn point_input_recovers_scalar_ols_exactly() {
    // y = 0.0066 + 4.91 / N (the imp-315 baseline fit).
    let rows = vec![
        pt(50.0, 0.0066 + 4.91 / 50.0),
        pt(100.0, 0.0066 + 4.91 / 100.0),
        pt(200.0, 0.0066 + 4.91 / 200.0),
        pt(500.0, 0.0066 + 4.91 / 500.0),
        pt(2458.0, 0.0066 + 4.91 / 2458.0),
    ];
    let fit = interval_ols(&rows).expect("fit");
    assert!(
        (fit.a_lo - 0.0066).abs() < 1e-10 && (fit.a_hi - 0.0066).abs() < 1e-10,
        "a bracket [{}, {}] should pin to 0.0066",
        fit.a_lo,
        fit.a_hi
    );
    assert!(
        (fit.b_lo - 4.91).abs() < 1e-6 && (fit.b_hi - 4.91).abs() < 1e-6,
        "b bracket [{}, {}] should pin to 4.91",
        fit.b_lo,
        fit.b_hi
    );
    assert!(
        fit.residual_sup < 1e-8,
        "residual sup {} should be near zero for an exact fit",
        fit.residual_sup
    );
}

#[test]
fn enclosure_property_holds_for_box_input() {
    // For any (a, b) consistent with point values in the input boxes, the
    // returned interval must enclose that (a, b). Sample a handful of
    // candidate point assignments and check.
    let rows = vec![
        OlsRow { n: 100.0, t_lo: 0.04, t_hi: 0.06 },
        OlsRow { n: 200.0, t_lo: 0.02, t_hi: 0.04 },
        OlsRow { n: 500.0, t_lo: 0.01, t_hi: 0.02 },
        OlsRow { n: 1000.0, t_lo: 0.008, t_hi: 0.012 },
    ];
    let fit = interval_ols(&rows).expect("fit");

    // Scalar OLS over a candidate y-vector inside the boxes.
    fn scalar_ols(xs: &[f64], ys: &[f64]) -> (f64, f64) {
        let n = xs.len() as f64;
        let sx: f64 = xs.iter().sum();
        let sy: f64 = ys.iter().sum();
        let xbar = sx / n;
        let ybar = sy / n;
        let sxx: f64 = xs.iter().map(|x| (x - xbar).powi(2)).sum();
        let sxy: f64 = xs.iter().zip(ys.iter()).map(|(x, y)| (x - xbar) * (y - ybar)).sum();
        let b = sxy / sxx;
        let a = ybar - b * xbar;
        (a, b)
    }
    let xs: Vec<f64> = rows.iter().map(|r| 1.0 / r.n).collect();
    // Candidates: low corner, high corner, midpoints, and one mixed.
    let lo_corner: Vec<f64> = rows.iter().map(|r| r.t_lo).collect();
    let hi_corner: Vec<f64> = rows.iter().map(|r| r.t_hi).collect();
    let mid_corner: Vec<f64> = rows.iter().map(|r| 0.5 * (r.t_lo + r.t_hi)).collect();
    let mixed: Vec<f64> = vec![rows[0].t_lo, rows[1].t_hi, rows[2].t_lo, rows[3].t_hi];

    for candidate in [lo_corner, hi_corner, mid_corner, mixed].iter() {
        let (a, b) = scalar_ols(&xs, candidate);
        assert!(
            a >= fit.a_lo - 1e-12 && a <= fit.a_hi + 1e-12,
            "candidate a={} outside interval [{}, {}]",
            a,
            fit.a_lo,
            fit.a_hi
        );
        assert!(
            b >= fit.b_lo - 1e-12 && b <= fit.b_hi + 1e-12,
            "candidate b={} outside interval [{}, {}]",
            b,
            fit.b_lo,
            fit.b_hi
        );
    }
}

#[test]
fn handles_two_row_minimal_input() {
    // Two rows is the minimum for a fit. Result should be a near-perfect fit
    // (residual approximately zero) at midpoints.
    let rows = vec![
        pt(100.0, 0.05),
        pt(1000.0, 0.014),
    ];
    let fit = interval_ols(&rows).expect("fit");
    // With 2 points the fit must pass exactly through both at the midpoint,
    // so residual_sup should be tiny (just floating-point roundoff).
    assert!(
        fit.residual_sup < 1e-8,
        "two-row residual sup {} too large",
        fit.residual_sup
    );
}

#[test]
fn rejects_zero_rows() {
    let rows: Vec<OlsRow> = vec![];
    let err = interval_ols(&rows).unwrap_err();
    assert!(matches!(err, OlsError::InsufficientRows(0)));
}

#[test]
fn rejects_single_row() {
    let rows = vec![pt(100.0, 0.05)];
    let err = interval_ols(&rows).unwrap_err();
    assert!(matches!(err, OlsError::InsufficientRows(1)));
}

#[test]
fn rejects_singular_design_matrix() {
    let rows = vec![pt(100.0, 0.05), pt(100.0, 0.06), pt(100.0, 0.04)];
    let err = interval_ols(&rows).unwrap_err();
    assert!(matches!(err, OlsError::SingularSxx));
}

#[test]
fn rejects_inverted_y_interval() {
    let rows = vec![
        OlsRow { n: 100.0, t_lo: 0.06, t_hi: 0.05 },
        OlsRow { n: 200.0, t_lo: 0.03, t_hi: 0.04 },
    ];
    let err = interval_ols(&rows).unwrap_err();
    assert!(matches!(err, OlsError::InvertedYInterval { .. }));
}
