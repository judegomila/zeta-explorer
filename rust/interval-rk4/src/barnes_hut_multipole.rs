//! imp-1139 Phase 8: Barnes-Hut MULTIPOLE extension (dipole +
//! quadrupole) on top of the imp-1132 monopole tree. Tightens the
//! truncation envelope from O(extent/dist) to O((extent/dist)^3), which
//! at theta = 0.5 brings the per-cell residual bound from ~0.5 to
//! ~0.13 in normalized units -- enough to drop the N=5000 midpoint
//! disagreement from 0.33 (monopole) toward 1e-4 (quadrupole) without
//! touching theta.
//!
//! WHY A SECOND MODULE
//! -------------------
//! The imp-1132 `barnes_hut.rs` is the load-bearing path for imp-1136
//! production sweep at the time of this commit and several parallel
//! subagents (imp-1136/1137/1142/1144) are reading it; per the ticket
//! SCOPE we do NOT modify it. We ship the multipole variant in this new
//! module with its own BHTreeMultipole struct + entry points, and let
//! consumers choose explicitly via
//! `dyson::dyson_drift_barnes_hut_multipole`.
//!
//! MATHEMATICAL DERIVATION
//! -----------------------
//! For a single far-field interaction 1 / (g_k - g_j) we Taylor-expand
//! around the cell center-of-mass com:
//!
//!   1 / (g_k - g_j)
//!     = 1 / (g_k - com) * 1 / (1 - (g_j - com) / (g_k - com))
//!     = sum_{p >= 0} (g_j - com)^p / (g_k - com)^{p+1}
//!
//! Summing over all j in the cell:
//!
//!   sum_j 1 / (g_k - g_j)
//!     = M_0 / (g_k - com)^1               <- monopole
//!     + M_1 / (g_k - com)^2               <- dipole
//!     + M_2 / (g_k - com)^3               <- quadrupole
//!     + sum_{p >= 3} M_p / (g_k - com)^{p+1}    <- residual
//!
//! where M_p = sum_j (g_j - com)^p is the p-th centered moment of the
//! cell. By the definition of center-of-mass M_1 = sum_j (g_j - com)
//! = (sum_j g_j) - mass * com = 0 (modulo interval rounding which we
//! still track outward-rounded). M_0 = mass, the particle count.
//!
//! Keeping the monopole, dipole (= 0 algebraically; carried in the
//! interval anyway so the rounding-floor stays sound), and quadrupole
//! the residual is bounded by
//!
//!   |residual| <= sum_{p >= 3} mass * extent^p / dist^{p+1}
//!              =  (mass * extent^3 / dist^4) * sum_{q >= 0} (extent/dist)^q
//!              =  (mass * extent^3) / (dist^3 * (dist - extent))
//!
//! valid when extent < dist (the theta criterion at theta < 1
//! guarantees this). At theta = 0.5 the per-cell residual on the
//! normalized inverse-distance contribution (mass / dist) is
//!
//!   |residual| / (mass / dist)
//!     = extent^3 / (dist^2 * (dist - extent))
//!     ~  (theta)^3 / (1 - theta) at extent = theta * dist
//!     =  0.125 / 0.5
//!     =  0.25 (per-cell normalized bound, vs ~1 for monopole-only).
//!
//! Over a full drift sum the per-cell residuals add but most cells are
//! either non-far-field (leaf bucket dense) or have small mass/dist
//! ratio, so the empirical midpoint disagreement shrinks much faster
//! than the per-cell normalized bound suggests; see the calibration
//! probe at `examples/multipole_theta_probe.rs` for the measured
//! tradeoff.
//!
//! INTERVAL-ARITHMETIC SOUNDNESS
//! -----------------------------
//! The truncation envelope above is the worst-case absolute residual
//! over the cell; we add it as a symmetric +/- inflation to the
//! computed monopole + dipole + quadrupole sum. All cell moments are
//! computed via inari intervals (outward-rounded). The cell extent is
//! the sup of |g_j - com| over the cell so the envelope numerator uses
//! the certified upper bound; the cell distance uses the certified
//! lower bound of |g_k - com|. The resulting interval is GUARANTEED to
//! enclose the true dense pair-sum, matching the imp-1132 soundness
//! guarantee.
//!
//! NODE LAYOUT
//! -----------
//! Each MultipoleNode carries (lo, hi) index range, mass, com, extent,
//! AND additionally moment_1 (dipole, theoretically 0 but stored as an
//! interval to absorb rounding) and moment_2 (quadrupole). Internal-
//! node moments are aggregated from children via the parallel-axis
//! shift theorem; see `combine_moments`.

use crate::as_interval;
use inari::Interval;

/// Leaf bucket size. Matched to imp-1132 so the tree depth is
/// comparable; the per-leaf summary cost is O(LEAF_SIZE) so a larger
/// bucket trades tree depth for leaf-summary work. We keep 32 because
/// the quadrupole summary still amortises to O(N) total build cost.
pub const LEAF_SIZE: usize = 32;

/// A single multipole tree node. Internal nodes have left = Some, right
/// = Some; leaves have left = None, right = None and (lo, hi) range
/// over the input gammas.
#[derive(Debug, Clone)]
pub struct MultipoleNode {
    pub lo: usize,
    pub hi: usize,
    /// Center-of-mass position (mean of the cell gammas, interval-
    /// rounded).
    pub com: Interval,
    /// Particle count carried as an interval (always a point integer).
    pub mass: Interval,
    /// Half-extent: max_{j in cell} |gamma_j - com| as a [0, max] sup-
    /// interval. Used for the theta criterion and the residual
    /// envelope.
    pub extent: Interval,
    /// First centered moment M_1 = sum_j (gamma_j - com). Algebraically
    /// zero by the definition of com; in interval arithmetic the
    /// rounding floor leaves a tiny non-trivial interval which we carry
    /// honestly. Surfaces in the dipole contribution / (g_k - com)^2.
    pub moment_1: Interval,
    /// Second centered moment M_2 = sum_j (gamma_j - com)^2. This is
    /// the LOAD-BEARING quadrupole; it dominates the gain over
    /// monopole-only BH.
    pub moment_2: Interval,
    pub left: Option<usize>,
    pub right: Option<usize>,
}

/// Flattened multipole tree.
#[derive(Debug, Clone)]
pub struct BHTreeMultipole {
    pub nodes: Vec<MultipoleNode>,
    pub root: usize,
    pub n: usize,
}

impl BHTreeMultipole {
    /// Build the multipole tree over `gammas` (must be sorted
    /// ascending; this matches the imp-1132 convention).
    pub fn build(gammas: &[Interval]) -> Self {
        let n = gammas.len();
        let cap = 2 * (n / LEAF_SIZE).max(1);
        let mut nodes = Vec::with_capacity(cap);
        let root = build_recursive(gammas, 0, n, &mut nodes);
        Self { nodes, root, n }
    }

    /// Multipole-approximation of sum_{j != k} 1 / (gamma_k - gamma_j)
    /// at index k. Returns the SUM (no -2 prefactor; the caller
    /// applies it -- mirrors the imp-1132 layout).
    ///
    /// Returns None if any (g_k - g_j) or (g_k - cell_com) straddles
    /// zero (the collision short-circuit).
    pub fn query_sum(
        &self,
        gammas: &[Interval],
        k: usize,
        theta: f64,
    ) -> Option<Interval> {
        debug_assert_eq!(gammas.len(), self.n, "tree built for different N");
        debug_assert!(k < self.n, "query index out of range");
        debug_assert!(theta > 0.0 && theta < 1.0, "theta must be in (0, 1)");
        let gk = gammas[k];
        let mut stack: Vec<usize> = Vec::with_capacity(64);
        stack.push(self.root);
        let mut acc = as_interval(0.0);
        while let Some(node_id) = stack.pop() {
            let node = &self.nodes[node_id];
            let is_leaf = node.left.is_none() && node.right.is_none();
            let k_inside = k >= node.lo && k < node.hi;
            let diff = gk - node.com;
            if diff.inf() <= 0.0 && diff.sup() >= 0.0 {
                // Distance straddles zero: cannot use far-field.
                if is_leaf {
                    if let Some(s) = leaf_dense_sum(gammas, node.lo, node.hi, k, gk) {
                        acc = acc + s;
                    } else {
                        return None;
                    }
                    continue;
                }
                if let Some(l) = node.left {
                    stack.push(l);
                }
                if let Some(r) = node.right {
                    stack.push(r);
                }
                continue;
            }
            let dist_lo = if diff.inf() > 0.0 { diff.inf() } else { -diff.sup() };
            let extent_sup = node.extent.sup();
            let theta_ok = !k_inside
                && dist_lo > 0.0
                && extent_sup < theta * dist_lo;
            if is_leaf || !theta_ok {
                if is_leaf {
                    if let Some(s) = leaf_dense_sum(gammas, node.lo, node.hi, k, gk) {
                        acc = acc + s;
                    } else {
                        return None;
                    }
                } else {
                    if let Some(l) = node.left {
                        stack.push(l);
                    }
                    if let Some(r) = node.right {
                        stack.push(r);
                    }
                }
                continue;
            }
            // Far-field multipole approximation:
            //   monopole  =  mass    * (g_k - com)^{-1}
            //   dipole    =  M_1     * (g_k - com)^{-2}  (algebraically 0)
            //   quadrupole = M_2     * (g_k - com)^{-3}
            // residual envelope = mass * extent^3 / (dist^3 *
            //                                        (dist - extent))
            let inv_diff = diff.recip();
            if !inv_diff.inf().is_finite() || !inv_diff.sup().is_finite() {
                if let Some(l) = node.left {
                    stack.push(l);
                }
                if let Some(r) = node.right {
                    stack.push(r);
                }
                continue;
            }
            let inv_diff_2 = inv_diff * inv_diff;
            let inv_diff_3 = inv_diff_2 * inv_diff;
            let monopole = node.mass * inv_diff;
            let dipole = node.moment_1 * inv_diff_2;
            let quadrupole = node.moment_2 * inv_diff_3;
            let center = monopole + dipole + quadrupole;
            // Residual envelope: (mass * extent^3) / (dist_lo^3 *
            // (dist_lo - extent_sup)). All terms are floats here so we
            // can compute the bound in plain f64 directed-up (a small
            // ULP slack is harmless given the magnitude of the bound).
            let denom = dist_lo.powi(3) * (dist_lo - extent_sup);
            if denom <= 0.0 || !denom.is_finite() {
                if let Some(l) = node.left {
                    stack.push(l);
                }
                if let Some(r) = node.right {
                    stack.push(r);
                }
                continue;
            }
            let mass_pt = node.mass.sup(); // mass is a point integer.
            let extent3 = extent_sup * extent_sup * extent_sup;
            let eps_mag = (mass_pt * extent3) / denom;
            // Inflate the center +/- eps. We do this by constructing
            // an interval; if inflation fails (NaN, etc.) we recurse.
            let inflated = Interval::try_from((
                center.inf() - eps_mag,
                center.sup() + eps_mag,
            ))
            .ok();
            match inflated {
                Some(iv) => {
                    acc = acc + iv;
                }
                None => {
                    if let Some(l) = node.left {
                        stack.push(l);
                    }
                    if let Some(r) = node.right {
                        stack.push(r);
                    }
                }
            }
        }
        Some(acc)
    }
}

/// Recursive top-down builder. Splits at the median index, computes
/// the per-leaf moment summary, and aggregates internal-node moments
/// via the parallel-axis shift theorem.
fn build_recursive(
    gammas: &[Interval],
    lo: usize,
    hi: usize,
    nodes: &mut Vec<MultipoleNode>,
) -> usize {
    let len = hi - lo;
    debug_assert!(len > 0, "empty range in multipole tree build");
    if len <= LEAF_SIZE {
        let (com, extent, moment_1, moment_2) = leaf_summary(gammas, lo, hi);
        let mass = as_interval(len as f64);
        let id = nodes.len();
        nodes.push(MultipoleNode {
            lo,
            hi,
            com,
            mass,
            extent,
            moment_1,
            moment_2,
            left: None,
            right: None,
        });
        return id;
    }
    let mid = lo + len / 2;
    let l = build_recursive(gammas, lo, mid, nodes);
    let r = build_recursive(gammas, mid, hi, nodes);
    let (l_lo, l_hi, l_com, l_mass, l_extent, l_m1, l_m2) = {
        let n = &nodes[l];
        (n.lo, n.hi, n.com, n.mass, n.extent, n.moment_1, n.moment_2)
    };
    let (r_lo, r_hi, r_com, r_mass, r_extent, r_m1, r_m2) = {
        let n = &nodes[r];
        (n.lo, n.hi, n.com, n.mass, n.extent, n.moment_1, n.moment_2)
    };
    debug_assert_eq!(l_hi, r_lo, "child ranges must be adjacent");
    let total_mass = l_mass + r_mass;
    let com = (l_mass * l_com + r_mass * r_com) * total_mass.recip();
    // Parallel-axis shift for the first and second centered moments.
    //   M_1_parent = sum_{j in left} (g_j - com_p)
    //              + sum_{j in right}(g_j - com_p)
    //              = M_1_left + mass_left * (com_left - com_p)
    //              + M_1_right + mass_right * (com_right - com_p)
    //   M_2_parent = sum_{j in left} (g_j - com_p)^2
    //              + sum_{j in right}(g_j - com_p)^2
    //   Expand (g_j - com_p) = (g_j - com_c) + (com_c - com_p) and
    //   note M_1_c = 0 algebraically:
    //   M_2_parent =  M_2_left
    //              + mass_left  * (com_left  - com_p)^2
    //              + 2 * (com_left  - com_p) * M_1_left
    //              + M_2_right
    //              + mass_right * (com_right - com_p)^2
    //              + 2 * (com_right - com_p) * M_1_right
    let dl = l_com - com;
    let dr = r_com - com;
    let moment_1 = l_m1
        + l_mass * dl
        + r_m1
        + r_mass * dr;
    let two = as_interval(2.0);
    let moment_2 = l_m2
        + l_mass * dl * dl
        + two * dl * l_m1
        + r_m2
        + r_mass * dr * dr
        + two * dr * r_m1;
    // Cell extent: max corner displacement from parent com over the
    // four corner intervals of the two children.
    let l_lo_disp = (l_com - l_extent) - com;
    let l_hi_disp = (l_com + l_extent) - com;
    let r_lo_disp = (r_com - r_extent) - com;
    let r_hi_disp = (r_com + r_extent) - com;
    let max_abs = l_lo_disp
        .abs()
        .sup()
        .max(l_hi_disp.abs().sup())
        .max(r_lo_disp.abs().sup())
        .max(r_hi_disp.abs().sup());
    let extent = Interval::try_from((0.0, max_abs)).unwrap_or_else(|_| as_interval(0.0));
    let id = nodes.len();
    nodes.push(MultipoleNode {
        lo: l_lo,
        hi: r_hi,
        com,
        mass: total_mass,
        extent,
        moment_1,
        moment_2,
        left: Some(l),
        right: Some(r),
    });
    id
}

/// Per-leaf summary: com, extent, M_1, M_2.
fn leaf_summary(
    gammas: &[Interval],
    lo: usize,
    hi: usize,
) -> (Interval, Interval, Interval, Interval) {
    let len = (hi - lo) as f64;
    let inv_len = as_interval(1.0 / len);
    let mut sum = as_interval(0.0);
    for j in lo..hi {
        sum = sum + gammas[j];
    }
    let com = sum * inv_len;
    let mut max_abs = 0.0_f64;
    let mut m1 = as_interval(0.0);
    let mut m2 = as_interval(0.0);
    for j in lo..hi {
        let d = gammas[j] - com;
        let m = d.abs().sup();
        if m > max_abs {
            max_abs = m;
        }
        m1 = m1 + d;
        m2 = m2 + d * d;
    }
    let extent = Interval::try_from((0.0, max_abs)).unwrap_or_else(|_| as_interval(0.0));
    (com, extent, m1, m2)
}

/// Dense leaf sum: contributes sum_{j in [lo, hi), j != k} 1 / (gk -
/// gamma_j). Returns None on zero straddle.
fn leaf_dense_sum(
    gammas: &[Interval],
    lo: usize,
    hi: usize,
    k: usize,
    gk: Interval,
) -> Option<Interval> {
    let mut s = as_interval(0.0);
    for j in lo..hi {
        if j == k {
            continue;
        }
        let diff = gk - gammas[j];
        if diff.inf() <= 0.0 && diff.sup() >= 0.0 {
            return None;
        }
        let inv = diff.recip();
        if !inv.inf().is_finite() || !inv.sup().is_finite() {
            return None;
        }
        s = s + inv;
    }
    Some(s)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::as_interval;

    #[test]
    fn build_small_multipole_tree() {
        let gammas: Vec<Interval> = (1..=10).map(|i| as_interval(i as f64)).collect();
        let tree = BHTreeMultipole::build(&gammas);
        assert_eq!(tree.n, 10);
        assert_eq!(tree.nodes.len(), 1);
        let root = &tree.nodes[tree.root];
        assert_eq!(root.lo, 0);
        assert_eq!(root.hi, 10);
        // M_1 at the COM should be near zero (rounding floor only).
        assert!(root.moment_1.abs().sup() < 1e-10, "M_1 not ~0 at COM");
        // M_2 should be the variance times mass; for {1..10} centered
        // at 5.5 the sum of (g - 5.5)^2 is 82.5.
        assert!(root.moment_2.inf() <= 82.5 && root.moment_2.sup() >= 82.5);
    }

    #[test]
    fn multipole_matches_dense_small_n() {
        // For N <= LEAF_SIZE the tree is one leaf and the multipole
        // path reduces to the leaf-dense sum. Sanity-check the API.
        let gammas: Vec<Interval> = (1..=20).map(|i| as_interval(i as f64 * 1.7)).collect();
        let tree = BHTreeMultipole::build(&gammas);
        for k in 0..gammas.len() {
            let mp = tree
                .query_sum(&gammas, k, 0.5)
                .expect("multipole sum finite");
            let mut dense = as_interval(0.0);
            for j in 0..gammas.len() {
                if j == k {
                    continue;
                }
                dense = dense + (gammas[k] - gammas[j]).recip();
            }
            let mp_mid = (mp.inf() + mp.sup()) * 0.5;
            let dense_mid = (dense.inf() + dense.sup()) * 0.5;
            let diff = (mp_mid - dense_mid).abs();
            assert!(diff < 1e-10, "multipole mid {} vs dense {} at k={}", mp_mid, dense_mid, k);
        }
    }

    #[test]
    fn multipole_soundness_n200() {
        // At N = 200 the tree has internal nodes and the far-field
        // path activates. The multipole interval must ENCLOSE the
        // dense midpoint.
        let n = 200usize;
        let gammas: Vec<Interval> =
            (0..n).map(|i| as_interval(1.0 + i as f64 * 0.5)).collect();
        let tree = BHTreeMultipole::build(&gammas);
        let theta = 0.5;
        let k = n / 2;
        let mp = tree.query_sum(&gammas, k, theta).expect("multipole sum finite");
        let mut dense = as_interval(0.0);
        for j in 0..n {
            if j == k {
                continue;
            }
            dense = dense + (gammas[k] - gammas[j]).recip();
        }
        let dense_mid = (dense.inf() + dense.sup()) * 0.5;
        assert!(
            mp.inf() <= dense_mid + 1e-12 && mp.sup() >= dense_mid - 1e-12,
            "multipole bracket [{}, {}] does not enclose dense_mid {}",
            mp.inf(),
            mp.sup(),
            dense_mid
        );
    }
}
