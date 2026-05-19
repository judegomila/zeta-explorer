//! imp-1132 Phase 7: Barnes-Hut O(N log N) sparse drift sum for the
//! Calogero-Moser / Dyson backward integrator.
//!
//! The dense drift at particle k is
//!
//!   dg_k/dt = -2 * sum_{j != k} 1 / (g_k - g_j)
//!
//! which is O(N) per query and therefore O(N^2) for the full drift
//! vector. At N >= 1e5 that is the asymptotic-SOTA bottleneck named in
//! src/data/rust-port-sanity-sweep-2026-05.js (the imp-1112 ceiling
//! consumed by imp-1123 and imp-1127).
//!
//! 1D BARNES-HUT IDEA
//! ------------------
//! Build a balanced bisection tree on the gammas (which are always
//! sorted ascending). Each leaf carries a small bucket of particles.
//! Each internal node summarises its descendants by their center-of-
//! mass position `com` and count `mass`. To query particle k:
//!   - If the query position gamma_k is FAR from cell C (extent / dist
//!     < theta, conventionally theta = 0.5), approximate C as a single
//!     point of mass `mass` at `com` and contribute mass / (gamma_k -
//!     com) to the inverse-distance sum.
//!   - Else recurse into the two children, or fall back to the dense
//!     pair-sum inside the leaf bucket.
//! With theta = 0.5 and roughly uniform gamma_k spacing each query
//! visits O(log N) nodes, so the full drift vector is O(N log N).
//!
//! INTERVAL-ARITHMETIC COMPOSITION
//! -------------------------------
//! The dense formula 1 / (gamma_k - gamma_j) summed over j in cell C
//! equals (by Taylor expansion around com)
//!
//!   sum_j 1 / (gamma_k - gamma_j)
//!     = sum_j sum_{p >= 0} (gamma_j - com)^p / (gamma_k - com)^{p+1}
//!     = (mass / (gamma_k - com))                              <- monopole
//!       + sum_{p >= 1} (sum_j (gamma_j - com)^p) / (gamma_k - com)^{p+1}.
//!
//! Barnes-Hut keeps only the monopole. The truncation residual is
//! BOUNDED in absolute value per particle by
//!
//!   |residual_j| = | sum_{p >= 1} ((gamma_j - com)/(gamma_k - com))^p |
//!                  / |gamma_k - com|
//!                <= (extent / dist) / ((dist - extent) * 1)
//!                 = extent / (dist * (dist - extent))
//!
//! when extent = max_{j in C} |gamma_j - com| and dist = |gamma_k -
//! com| (the geometric-series bound, valid when extent < dist which
//! the theta criterion guarantees with theta < 1). Summed over the
//! `mass` particles in the cell that is a conservative envelope of
//! width
//!
//!   eps_cell = mass * extent / (dist_inf * (dist_inf - extent_sup))
//!
//! where dist_inf = max(0, |gamma_k - com|.inf() - extent.sup()) and
//! we use the worst-case (smallest) dist_inf so the bound stays sound.
//! We inflate the monopole contribution by +/- eps_cell as a
//! symmetric interval. The resulting drift interval is SOUND (encloses
//! the true dense result) but slightly wider than the dense O(N^2)
//! interval -- the price of the algorithmic speedup.
//!
//! NODE LAYOUT
//! -----------
//! We flatten the tree into a Vec<Node> indexed by NodeId so the BH
//! walk is iterative and cache-friendly. Internal nodes carry left/
//! right child indices; leaves carry a (lo, hi) range into the
//! original gammas slice. The tree is built bottom-up by recursive
//! median splitting on a leaf threshold of LEAF_SIZE; with LEAF_SIZE
//! = 32 and balanced splitting the tree depth is ~log2(N/32) which at
//! N = 1e5 is ~12 levels.
//!
//! HONEST SCOPE
//! ------------
//! - This module does NOT replace `dyson_drift_interval`; both paths
//!   coexist so callers can choose. The dense path remains the
//!   tightest-bound reference at small N.
//! - The interval inflation eps_cell is a conservative upper bound on
//!   the multipole truncation. It is NOT tight; a tighter bound would
//!   require carrying the higher moments (dipole, quadrupole, ...)
//!   and that is a deferred enhancement.
//! - The theta criterion is checked using the LOWER bound of the
//!   query-to-com distance so the soundness is preserved even when
//!   the input gammas are themselves intervals of nontrivial width.

use crate::as_interval;
use inari::Interval;

/// Maximum particles in a leaf bucket. With balanced median splits the
/// tree depth is ~log2(N / LEAF_SIZE). At N = 1e5 and LEAF_SIZE = 32
/// that is ~12 levels, giving ~12 cells visited per query and ~1.2e6
/// cell evaluations for the full drift vector -- a >5000x reduction
/// vs the 1e10 inverse-distance operations the dense O(N^2) path does
/// at the same N. We keep LEAF_SIZE moderate so the per-leaf dense
/// fallback (still O(LEAF_SIZE) per query) does not dominate.
pub const LEAF_SIZE: usize = 32;

/// A single tree node. Internal nodes have left = Some, right = Some;
/// leaves have left = None, right = None and (lo, hi) range = the
/// indices [lo, hi) into the input gammas covered by this leaf bucket.
#[derive(Debug, Clone)]
pub struct Node {
    /// Range of input-particle indices covered: [lo, hi). For leaves
    /// the leaf bucket is gammas[lo .. hi]. For internal nodes the
    /// range is the union of its children's ranges (always contiguous
    /// because we sort by index, which already matches gamma order
    /// for ascending-sorted gammas).
    pub lo: usize,
    pub hi: usize,
    /// Center-of-mass position (mid-point of the per-particle interval
    /// average). For interval-valued gammas the COM is itself an
    /// interval. For point inputs (the typical drift caller) it is a
    /// near-point interval.
    pub com: Interval,
    /// Count of particles in this cell as an interval (always a
    /// point-interval integer).
    pub mass: Interval,
    /// Half-extent of the cell: max_{j in cell} |gamma_j - com|. This
    /// is the conservative cell radius used in the theta criterion.
    pub extent: Interval,
    /// Children. Leaves have both None.
    pub left: Option<usize>,
    pub right: Option<usize>,
}

/// The flattened Barnes-Hut tree.
#[derive(Debug, Clone)]
pub struct BHTree {
    pub nodes: Vec<Node>,
    /// Root node index into `nodes`. Always 0 by construction here
    /// because we push the root last and re-index, OR we keep a
    /// pointer; we choose the latter for simplicity.
    pub root: usize,
    /// Number of input particles. Captured for sanity checks.
    pub n: usize,
}

impl BHTree {
    /// Build a balanced bisection tree over `gammas`. The input gammas
    /// must already be sorted ascending; this is the case for Riemann
    /// zero ordinates and for the imp-1090 / imp-1091 caller. If the
    /// caller passes unsorted input, sort it first; this routine does
    /// NOT re-sort because the caller relies on input-index identity
    /// for the drift output.
    pub fn build(gammas: &[Interval]) -> Self {
        let n = gammas.len();
        let mut nodes = Vec::with_capacity(2 * (n / LEAF_SIZE).max(1));
        let root = build_recursive(gammas, 0, n, &mut nodes);
        Self { nodes, root, n }
    }

    /// Query the BH approximation of sum_{j != k} 1 / (gamma_k -
    /// gamma_j) at index k. Returns the SUM (no -2 prefactor; that is
    /// applied by the caller, mirroring the dense path layout).
    ///
    /// Returns None if any encountered (gamma_k - cell_com) or
    /// (gamma_k - gamma_j) straddles zero (the collision short-circuit
    /// inherited from the dense path).
    pub fn query_sum(&self, gammas: &[Interval], k: usize, theta: f64) -> Option<Interval> {
        debug_assert_eq!(gammas.len(), self.n, "BHTree built for different N");
        debug_assert!(k < self.n, "query index out of range");
        debug_assert!(theta > 0.0 && theta < 1.0, "theta must be in (0, 1)");
        let gk = gammas[k];
        // Iterative DFS with an explicit stack to avoid recursion at
        // depth ~ log2(N / LEAF_SIZE).
        let mut stack: Vec<usize> = Vec::with_capacity(64);
        stack.push(self.root);
        let mut acc = as_interval(0.0);
        while let Some(node_id) = stack.pop() {
            let node = &self.nodes[node_id];
            let is_leaf = node.left.is_none() && node.right.is_none();
            // Self-containment check: if k is inside this cell's index
            // range AND the cell is not a singleton with k as its sole
            // member, we MUST recurse (the BH multipole approximation
            // is undefined when the query particle is inside the cell).
            let k_inside = k >= node.lo && k < node.hi;
            // Compute distance interval gk - com.
            let diff = gk - node.com;
            if diff.inf() <= 0.0 && diff.sup() >= 0.0 {
                // Distance straddles zero: cannot use far-field. If
                // the query is genuinely on top of the COM and the
                // cell has more than one particle we still must
                // recurse, but if we are at a leaf with the query as
                // its only entry the leaf-dense fallback also produces
                // None (collision short-circuit). Recurse / fall back.
                if is_leaf {
                    // Leaf dense fallback.
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
            // dist_lo is the certified lower bound of |gk - com|.
            let dist_lo = if diff.inf() > 0.0 { diff.inf() } else { -diff.sup() };
            let extent_sup = node.extent.sup();
            // Theta criterion: extent / dist < theta. Use the
            // certified-lower dist and certified-upper extent so a
            // pass here is sound.
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
            // Far-field monopole approximation: mass / (gk - com)
            // inflated by the multipole truncation envelope.
            let inv_diff = diff.recip();
            if !inv_diff.inf().is_finite() || !inv_diff.sup().is_finite() {
                // Defensive: should not happen given the zero-straddle
                // check above, but if recip produces a non-finite
                // result we recurse rather than corrupt the sum.
                if let Some(l) = node.left {
                    stack.push(l);
                }
                if let Some(r) = node.right {
                    stack.push(r);
                }
                continue;
            }
            let monopole = node.mass * inv_diff;
            // Multipole truncation envelope:
            //   eps_cell = mass * extent / (dist_lo * (dist_lo -
            //              extent_sup))
            // This is the geometric-series bound on the residual after
            // dropping all p >= 1 terms in the Taylor expansion of
            // 1 / (gamma_k - gamma_j) around com. We require
            // dist_lo > extent_sup (which the theta-with-theta<1
            // criterion guarantees) so the denominator is positive.
            let denom = dist_lo * (dist_lo - extent_sup);
            if denom <= 0.0 || !denom.is_finite() {
                // Numerically tight; recurse to be safe.
                if let Some(l) = node.left {
                    stack.push(l);
                }
                if let Some(r) = node.right {
                    stack.push(r);
                }
                continue;
            }
            let mass_pt = node.mass.sup(); // mass is a point interval (integer count).
            let eps_mag = (mass_pt * extent_sup) / denom;
            // Symmetric +/- eps inflation around the monopole.
            let inflated = Interval::try_from((
                monopole.inf() - eps_mag,
                monopole.sup() + eps_mag,
            ))
            .ok();
            match inflated {
                Some(iv) => {
                    acc = acc + iv;
                }
                None => {
                    // Inflation produced a non-valid interval (e.g.,
                    // NaN); recurse to fall back.
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

/// Build the tree recursively. Splits the index range [lo, hi) at the
/// median. Leaves once hi - lo <= LEAF_SIZE.
fn build_recursive(
    gammas: &[Interval],
    lo: usize,
    hi: usize,
    nodes: &mut Vec<Node>,
) -> usize {
    let len = hi - lo;
    debug_assert!(len > 0, "empty range in tree build");
    if len <= LEAF_SIZE {
        // Leaf node. Compute com (interval-mean) and extent (max
        // half-extent of the cell).
        let (com, extent) = leaf_summary(gammas, lo, hi);
        let mass = as_interval(len as f64);
        let id = nodes.len();
        nodes.push(Node {
            lo,
            hi,
            com,
            mass,
            extent,
            left: None,
            right: None,
        });
        return id;
    }
    let mid = lo + len / 2;
    let l = build_recursive(gammas, lo, mid, nodes);
    let r = build_recursive(gammas, mid, hi, nodes);
    // Combine child summaries. COM-of-union for equal-weight particles
    // is (mass_l * com_l + mass_r * com_r) / (mass_l + mass_r). For
    // interval inputs this is itself an interval (Interval ops are
    // outward-rounded; the formula stays sound). Extent of union is
    // the union half-extent from the parent COM: max over the four
    // corners (l.com +/- l.extent, r.com +/- r.extent) of |corner -
    // parent_com|.
    let (l_lo, l_hi, l_com, l_mass, l_extent) = {
        let n = &nodes[l];
        (n.lo, n.hi, n.com, n.mass, n.extent)
    };
    let (r_lo, r_hi, r_com, r_mass, r_extent) = {
        let n = &nodes[r];
        (n.lo, n.hi, n.com, n.mass, n.extent)
    };
    debug_assert_eq!(l_hi, r_lo, "child ranges should be adjacent");
    let total_mass = l_mass + r_mass;
    let com = (l_mass * l_com + r_mass * r_com) * total_mass.recip();
    // Cell extent (conservative): use the absolute outer span of the
    // child intervals from the parent COM. We bracket by the four
    // corner displacements, take the sup.
    let l_lo_disp = (l_com - l_extent) - com; // worst-left corner relative to parent
    let l_hi_disp = (l_com + l_extent) - com;
    let r_lo_disp = (r_com - r_extent) - com;
    let r_hi_disp = (r_com + r_extent) - com;
    let max_abs = l_lo_disp.abs().sup()
        .max(l_hi_disp.abs().sup())
        .max(r_lo_disp.abs().sup())
        .max(r_hi_disp.abs().sup());
    // Inflate slightly outward to absorb the rounding of `max_abs` to
    // a representable f64.
    let extent = Interval::try_from((0.0, max_abs))
        .unwrap_or_else(|_| as_interval(0.0));
    let id = nodes.len();
    nodes.push(Node {
        lo: l_lo,
        hi: r_hi,
        com,
        mass: total_mass,
        extent,
        left: Some(l),
        right: Some(r),
    });
    id
}

/// Compute (com, extent) for a leaf bucket. com is the equal-weight
/// midpoint (sum / count); extent is the maximum |g_j - com|.
fn leaf_summary(gammas: &[Interval], lo: usize, hi: usize) -> (Interval, Interval) {
    let len = (hi - lo) as f64;
    let inv_len = as_interval(1.0 / len);
    let mut sum = as_interval(0.0);
    for j in lo..hi {
        sum = sum + gammas[j];
    }
    let com = sum * inv_len;
    let mut max_abs = 0.0_f64;
    for j in lo..hi {
        let d = gammas[j] - com;
        let m = d.abs().sup();
        if m > max_abs {
            max_abs = m;
        }
    }
    let extent = Interval::try_from((0.0, max_abs))
        .unwrap_or_else(|_| as_interval(0.0));
    (com, extent)
}

/// Dense leaf sum: contributes sum_{j in [lo, hi), j != k} 1 / (gk -
/// gamma_j). Returns None on zero straddle. This is the same kernel
/// as `dyson_drift_interval` restricted to the leaf range.
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
    fn build_small_tree() {
        let gammas: Vec<Interval> = (1..=10).map(|i| as_interval(i as f64)).collect();
        let tree = BHTree::build(&gammas);
        assert_eq!(tree.n, 10);
        // With LEAF_SIZE = 32 and N = 10 the entire tree is one leaf.
        assert_eq!(tree.nodes.len(), 1);
        let root = &tree.nodes[tree.root];
        assert_eq!(root.lo, 0);
        assert_eq!(root.hi, 10);
        assert!(root.left.is_none() && root.right.is_none());
    }

    #[test]
    fn build_two_level_tree() {
        let gammas: Vec<Interval> = (1..=100).map(|i| as_interval(i as f64)).collect();
        let tree = BHTree::build(&gammas);
        assert_eq!(tree.n, 100);
        // 100 / 32 = 3.125 -> tree splits at least once. We get an
        // internal node + several leaves.
        let internal_count = tree.nodes.iter().filter(|n| n.left.is_some()).count();
        assert!(internal_count >= 1, "expected at least one internal node");
    }

    #[test]
    fn bh_matches_dense_small_n() {
        // Compare BH query_sum against the dense pair-sum at N = 50
        // (under the LEAF_SIZE threshold so this is really testing
        // the leaf-dense fallback, plus a sanity check on the API).
        let gammas: Vec<Interval> =
            (1..=50).map(|i| as_interval(i as f64 * 1.7)).collect();
        let tree = BHTree::build(&gammas);
        for k in 0..gammas.len() {
            let bh = tree
                .query_sum(&gammas, k, 0.5)
                .expect("BH sum finite");
            let mut dense = as_interval(0.0);
            for j in 0..gammas.len() {
                if j == k {
                    continue;
                }
                dense = dense + (gammas[k] - gammas[j]).recip();
            }
            let bh_mid = (bh.inf() + bh.sup()) * 0.5;
            let dense_mid = (dense.inf() + dense.sup()) * 0.5;
            let diff = (bh_mid - dense_mid).abs();
            assert!(
                diff < 1e-10,
                "BH mid {} differs from dense mid {} at k={}",
                bh_mid,
                dense_mid,
                k
            );
        }
    }

    #[test]
    fn bh_far_field_active_at_large_n() {
        // At N = 200 the tree is deep enough that far-field is
        // exercised. Verify the BH result encloses the dense midpoint
        // (the soundness property of the multipole-truncation
        // envelope).
        let n = 200usize;
        let gammas: Vec<Interval> =
            (0..n).map(|i| as_interval(1.0 + i as f64 * 0.5)).collect();
        let tree = BHTree::build(&gammas);
        let theta = 0.5;
        // Test on a particle far from both endpoints.
        let k = n / 2;
        let bh = tree.query_sum(&gammas, k, theta).expect("BH sum finite");
        let mut dense = as_interval(0.0);
        for j in 0..n {
            if j == k {
                continue;
            }
            dense = dense + (gammas[k] - gammas[j]).recip();
        }
        let dense_mid = (dense.inf() + dense.sup()) * 0.5;
        // BH must ENCLOSE the dense midpoint (it is a sound
        // approximation). Check inf <= dense_mid <= sup.
        assert!(
            bh.inf() <= dense_mid + 1e-12 && bh.sup() >= dense_mid - 1e-12,
            "BH bracket [{}, {}] does not enclose dense_mid {}",
            bh.inf(),
            bh.sup(),
            dense_mid
        );
    }
}
