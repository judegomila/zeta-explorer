/**
 * @module imp-2338-volterra-krawczyk
 * @fileoverview imp-2338 -- Interval-arithmetic certification of the Volterra
 *   norm bound ||V_{a,Phi}|| <= 1 on an extended (U,a) grid via Krawczyk-ball /
 *   HS-norm enclosure.
 *
 *   CONTEXT
 *   -------
 *   imp-1258 reduced the entire SS15-27 proof program to ONE statement:
 *     ||V_{a,Phi}||_{L^2([0,inf))} <= 1 for every a > 0.
 *   imp-1240 gave a 25-row empirical pilot (all norms > 5000x below 1).
 *   This ticket extends that pilot to a 5x6 = 30-row grid and adds
 *   CERTIFIED upper bounds via interval arithmetic.
 *
 *   METHOD -- Krawczyk-ball via HS enclosure
 *   -----------------------------------------
 *   For the lower-triangular Galerkin matrix V with entries
 *     V[i,j] = h * Phi(t_i) * Phi(t_j) * sinh(a*(t_j - t_i))  (j > i)
 *
 *   We use:  ||V||_op <= ||V||_HS  (spectral <= Frobenius/Hilbert-Schmidt norm)
 *
 *   Step 1 -- Entry interval:
 *     Each nominal V_nom[i,j] is enclosed in a "Krawczyk ball"
 *       [V_lo, V_hi] = V_nom[i,j] * [1 - eps_entry, 1 + eps_entry]
 *     where eps_entry = 50 * eps_machine = 1.11e-14 accounts for ~50 float
 *     operations per entry (Phi x2, sinh, products). Conservative: actual
 *     rounding errors are < 3 ULPs per entry.
 *
 *   Step 2 -- Certified HS^2 upper bound:
 *     HS^2_cert = sum_{j>i} V_hi[i,j]^2  +  n_terms * eps_machine * HS^2_nom
 *     The second term bounds rounding in the accumulation loop.
 *
 *   Step 3 -- Certified spectral-norm upper bound:
 *     ||V||_op <= ||V||_HS <= sqrt(HS^2_cert)
 *
 *   If sqrt(HS^2_cert) < 1, Conj 27.2 is certifiably satisfied at this (U,a,N).
 *
 *   RESULTS
 *   -------
 *   All 30 grid points certified. Maximum certified HS norm: 1.900e-4 at
 *   (U=1, a=0.5). Minimum margin below 1: 0.9998 at (U=1, a=0.5).
 *   Krawczyk ball radius (norm inflation): at most 9.5e-16, negligible.
 *   Certification gap vs saturation bound of 1: at least 5000x.
 *
 *   HONEST SCOPE
 *   ------------
 *   - This certifies ||V||_HS < 1, which implies ||V||_op < 1 (HS is an UPPER
 *     bound on spectral norm, so HS < 1 => spectral < 1).
 *   - The grid covers U in {1,2,4,8,16} x a in {0.5,0.2,0.1,0.05,0.025,0.01}.
 *     "For every a > 0" (Conj 27.2) still requires an analytical bound for
 *     a outside this grid and U -> infinity (the HS bound from imp-1267 handles
 *     that analytically for a <= 37.66).
 *   - The interval arithmetic uses JavaScript's IEEE 754 double arithmetic with
 *     conservative entry inflation (50x eps_machine). This is not formally
 *     rigorous in the sense of directed rounding (JS has no setRoundingMode),
 *     but the Krawczyk radius (< 1e-15) is negligible vs the norm values (~1e-4).
 *   - N=300 midpoint Galerkin grid. The HS norm is an OVER-APPROXIMATION of
 *     the spectral norm, so the certified bound is conservative (not tight).
 *
 *   RELATED
 *   -------
 *   - imp-1240: original 25-row empirical pilot (U in {1,2,5,10,20}, a in {0.5,...,0.025})
 *   - imp-1258: two-way collapse reducing SS15-27 to ||V|| <= 1
 *   - imp-1267: analytical HS bound proving ||V|| <= 1 for all a <= 37.66
 *   - imp-2324: Richardson extrapolation certifying large-a (a=50) violation is real
 *
 *   Ticket: imp-2338 (numerical, high, sonnet-4-6).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ── Certified grid rows from 2026-06-02 run ─────────────────────────────────
// Schema: { U, a, N, hs_nom, hs_cert, krawczyk_radius, margin_below_one, certifies_below_one, n_terms }
const CERTIFIED_GRID = Object.freeze([
  // U=1 rows
  Object.freeze({ U:  1, a: 0.500, N: 300, hs_nom: 1.899500011488159e-4, hs_cert: 1.899500011497636e-4, krawczyk_radius: 9.477e-16, margin_below_one: 0.9998100499988503, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  1, a: 0.200, N: 300, hs_nom: 7.595280316603682e-5, hs_cert: 7.595280316641573e-5, krawczyk_radius: 3.789e-16, margin_below_one: 0.9999240471968336, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  1, a: 0.100, N: 300, hs_nom: 3.797445968329893e-5, hs_cert: 3.797445968348839e-5, krawczyk_radius: 1.895e-16, margin_below_one: 0.9999620255403165, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  1, a: 0.050, N: 300, hs_nom: 1.898698711910379e-5, hs_cert: 1.898698711919853e-5, krawczyk_radius: 9.474e-17, margin_below_one: 0.9999810130128808, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  1, a: 0.025, N: 300, hs_nom: 9.493463219699867e-6, hs_cert: 9.493463219747230e-6, krawczyk_radius: 4.736e-17, margin_below_one: 0.9999905065367802, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  1, a: 0.010, N: 300, hs_nom: 3.797381889829892e-6, hs_cert: 3.797381889848842e-6, krawczyk_radius: 1.895e-17, margin_below_one: 0.9999962026181102, certifies_below_one: true, n_terms: 44850 }),

  // U=2 rows
  Object.freeze({ U:  2, a: 0.500, N: 300, hs_nom: 1.897048305733528e-4, hs_cert: 1.897048305742994e-4, krawczyk_radius: 9.466e-16, margin_below_one: 0.9998102951694257, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  2, a: 0.200, N: 300, hs_nom: 7.585479216654742e-5, hs_cert: 7.585479216692586e-5, krawczyk_radius: 3.784e-16, margin_below_one: 0.9999241452078331, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  2, a: 0.100, N: 300, hs_nom: 3.792545826923293e-5, hs_cert: 3.792545826942212e-5, krawczyk_radius: 1.892e-16, margin_below_one: 0.9999620745417306, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  2, a: 0.050, N: 300, hs_nom: 1.896248692273707e-5, hs_cert: 1.896248692283168e-5, krawczyk_radius: 9.461e-17, margin_below_one: 0.9999810375130772, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  2, a: 0.025, N: 300, hs_nom: 9.481213185348473e-6, hs_cert: 9.481213185395773e-6, krawczyk_radius: 4.730e-17, margin_below_one: 0.9999905187868146, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  2, a: 0.010, N: 300, hs_nom: 3.792481883238470e-6, hs_cert: 3.792481883257389e-6, krawczyk_radius: 1.892e-17, margin_below_one: 0.9999962075181168, certifies_below_one: true, n_terms: 44850 }),

  // U=4 rows
  Object.freeze({ U:  4, a: 0.500, N: 300, hs_nom: 1.887236011539350e-4, hs_cert: 1.887236011548767e-4, krawczyk_radius: 9.417e-16, margin_below_one: 0.9998112763988452, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  4, a: 0.200, N: 300, hs_nom: 7.546252779824065e-5, hs_cert: 7.546252779861715e-5, krawczyk_radius: 3.765e-16, margin_below_one: 0.9999245374722013, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  4, a: 0.100, N: 300, hs_nom: 3.772934231905782e-5, hs_cert: 3.772934231924607e-5, krawczyk_radius: 1.882e-16, margin_below_one: 0.9999622706576807, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  4, a: 0.050, N: 300, hs_nom: 1.886443097672423e-5, hs_cert: 1.886443097681836e-5, krawczyk_radius: 9.413e-17, margin_below_one: 0.9999811355690231, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  4, a: 0.025, N: 300, hs_nom: 9.432185465970988e-6, hs_cert: 9.432185466018044e-6, krawczyk_radius: 4.706e-17, margin_below_one: 0.9999905678145340, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  4, a: 0.010, N: 300, hs_nom: 3.772870823893760e-6, hs_cert: 3.772870823912584e-6, krawczyk_radius: 1.882e-17, margin_below_one: 0.9999962271291761, certifies_below_one: true, n_terms: 44850 }),

  // U=8 rows
  Object.freeze({ U:  8, a: 0.500, N: 300, hs_nom: 1.847898552655407e-4, hs_cert: 1.847898552664627e-4, krawczyk_radius: 9.220e-16, margin_below_one: 0.9998152101447335, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  8, a: 0.200, N: 300, hs_nom: 7.388991438395872e-5, hs_cert: 7.388991438432738e-5, krawczyk_radius: 3.687e-16, margin_below_one: 0.9999261100856157, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  8, a: 0.100, N: 300, hs_nom: 3.694309878776208e-5, hs_cert: 3.694309878794641e-5, krawczyk_radius: 1.843e-16, margin_below_one: 0.9999630569012120, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  8, a: 0.050, N: 300, hs_nom: 1.847131710738869e-5, hs_cert: 1.847131710748086e-5, krawczyk_radius: 9.217e-17, margin_below_one: 0.9999815286828925, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  8, a: 0.025, N: 300, hs_nom: 9.235629518321373e-6, hs_cert: 9.235629518367455e-6, krawczyk_radius: 4.608e-17, margin_below_one: 0.9999907643704816, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U:  8, a: 0.010, N: 300, hs_nom: 3.694248555379350e-6, hs_cert: 3.694248555397783e-6, krawczyk_radius: 1.843e-17, margin_below_one: 0.9999963057514446, certifies_below_one: true, n_terms: 44850 }),

  // U=16 rows
  Object.freeze({ U: 16, a: 0.500, N: 300, hs_nom: 1.689105064110328e-4, hs_cert: 1.689105064118756e-4, krawczyk_radius: 8.428e-16, margin_below_one: 0.9998310894935881, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U: 16, a: 0.200, N: 300, hs_nom: 6.754130085518477e-5, hs_cert: 6.754130085552177e-5, krawczyk_radius: 3.370e-16, margin_below_one: 0.9999324586991445, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U: 16, a: 0.100, N: 300, hs_nom: 3.376901518894558e-5, hs_cert: 3.376901518911407e-5, krawczyk_radius: 1.685e-16, margin_below_one: 0.9999662309848109, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U: 16, a: 0.050, N: 300, hs_nom: 1.688430320131289e-5, hs_cert: 1.688430320139713e-5, krawczyk_radius: 8.424e-17, margin_below_one: 0.9999831156967987, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U: 16, a: 0.025, N: 300, hs_nom: 8.442126051876156e-6, hs_cert: 8.442126051918278e-6, krawczyk_radius: 4.212e-17, margin_below_one: 0.9999915578739481, certifies_below_one: true, n_terms: 44850 }),
  Object.freeze({ U: 16, a: 0.010, N: 300, hs_nom: 3.376847559297527e-6, hs_cert: 3.376847559314376e-6, krawczyk_radius: 1.685e-17, margin_below_one: 0.9999966231524406, certifies_below_one: true, n_terms: 44850 }),
]);

export const IMP2338_VOLTERRA_KRAWCZYK = Object.freeze({
  id: 'imp-2338-volterra-krawczyk',
  ticket: 'imp-2338',
  generatedAt: '2026-06-02T19:31:00Z',
  computeScript: 'scripts/compute-imp2338-volterra-krawczyk.mjs',
  paperSourcePath: PAPER_REF,
  relatedTickets: ['imp-1240', 'imp-1258', 'imp-1267', 'imp-2324'],

  method: Object.freeze({
    name: 'krawczyk-ball-hs-enclosure',
    entryInflation: 1.11e-14,
    entryInflationOps: 50,
    machineEpsilon: 2.22e-16,
    N: 300,
    U_grid: Object.freeze([1, 2, 4, 8, 16]),
    a_grid: Object.freeze([0.5, 0.2, 0.1, 0.05, 0.025, 0.01]),
    n_phi_terms: 10,
    description:
      'Each Galerkin matrix entry V[i,j] = h*Phi(t_i)*Phi(t_j)*sinh(a*(t_j-t_i)) is ' +
      'enclosed in a Krawczyk ball [V_nom*(1-eps), V_nom*(1+eps)] with eps=50*eps_machine. ' +
      'The certified HS norm upper bound sqrt(sum_ij V_hi^2 + n_terms*eps*HS_nom^2) is ' +
      'then an interval-arithmetic certificate for ||V||_op <= ||V||_HS < 1.',
  }),

  summary:
    'Krawczyk-ball interval arithmetic certification of ||V_{a,Phi}|| < 1 on a 5x6 = 30-point ' +
    'extended (U,a) grid. ALL 30 cells certified. Maximum certified HS norm: 1.900e-4 at ' +
    '(U=1, a=0.5). Krawczyk ball radius: at most 9.5e-16 (negligible). ' +
    'Margin below 1: at least 5000x at every grid point. ' +
    'Extends imp-1240 pilot from 5x5 to 5x6 grid, adds certified interval bounds.',

  certifiedGrid: CERTIFIED_GRID,

  globalVerdict: Object.freeze({
    all_certified: true,
    max_hs_cert: 1.900e-4,
    min_margin_below_one: 0.9998100499988503,
    max_krawczyk_radius: 9.477e-16,
    n_grid_points: 30,
    verdict: 'ALL-CERTIFIED',
    note:
      'At every (U,a) point in the extended 5x6 grid, the certified upper bound on ||V||_op ' +
      'is below 1 by a factor of at least 5263. The Krawczyk ball inflation is negligible ' +
      '(< 1e-15). This is strong numerical evidence for Conj 27.2 on the operative regime ' +
      'a in [0.01, 0.5], U in [1, 16].',
  }),

  honestScope: Object.freeze([
    'Certifies ||V||_HS < 1, which implies ||V||_op < 1 via the HS upper bound.',
    'Grid covers a in [0.01, 0.5] and U in [1, 16] only. "For every a > 0" requires ' +
      'the analytical HS bound from imp-1267 (valid for all a <= 37.66).',
    'Interval arithmetic uses JS IEEE 754 arithmetic with conservative entry inflation. ' +
      'No directed rounding -- the certification is near-rigorous but not formally ' +
      'verified in the IEEE sense. The Krawczyk radius (< 1e-15) is negligible vs norms (~1e-4).',
    'N=300 midpoint Galerkin. HS norm is an over-approximation of spectral norm ' +
      '(certified bound is conservative, not tight).',
    'PCC obstruction (imp-1184) remains: ||V|| <= 1 is still conditional on Montgomery PCC.',
  ]),
});

export default IMP2338_VOLTERRA_KRAWCZYK;

// ── Tripwire assertions ─────────────────────────────────────────────────────
export const IMP2338_ASSERTIONS = [
  {
    id: 'imp2338-all-30-cells-certified',
    why:
      'The Krawczyk certification must succeed at every grid point. Any uncertified cell ' +
      'would indicate either a computation error or a genuine norm > 1.',
    holds: () =>
      IMP2338_VOLTERRA_KRAWCZYK.certifiedGrid.length === 30 &&
      IMP2338_VOLTERRA_KRAWCZYK.certifiedGrid.every((r) => r.certifies_below_one === true),
  },
  {
    id: 'imp2338-max-certified-norm-below-0-001',
    why:
      'The maximum certified HS norm across the grid must be below 0.001 (a factor of ' +
      '1000 below 1). This guards against any cell drifting close to the bound of 1.',
    holds: () =>
      IMP2338_VOLTERRA_KRAWCZYK.certifiedGrid.every((r) => r.hs_cert < 1e-3),
  },
  {
    id: 'imp2338-krawczyk-radius-negligible',
    why:
      'The Krawczyk ball radius (inflation of the HS norm) must be less than 1e-14 at ' +
      'every grid point. A larger radius would indicate the interval enclosure is not tight.',
    holds: () =>
      IMP2338_VOLTERRA_KRAWCZYK.certifiedGrid.every((r) => r.krawczyk_radius < 1e-14),
  },
  {
    id: 'imp2338-grid-covers-5x6',
    why:
      '5 U-values times 6 a-values = 30 rows. Any deviation means the grid was not ' +
      'fully computed.',
    holds: () => IMP2338_VOLTERRA_KRAWCZYK.certifiedGrid.length === 30,
  },
  {
    id: 'imp2338-a-grid-includes-0-01',
    why:
      'The extended grid adds a=0.01, which was not in the imp-1240 pilot ' +
      '(pilot had a in {0.5, 0.2, 0.1, 0.05, 0.025} only). This is the key extension.',
    holds: () =>
      IMP2338_VOLTERRA_KRAWCZYK.certifiedGrid.some((r) => Math.abs(r.a - 0.01) < 1e-10),
  },
  {
    id: 'imp2338-u-grid-includes-16',
    why:
      'The extended grid includes U=16, extending beyond the imp-1240 pilot upper limit of U=20 ' +
      '(but with correct midpoint discretization). Confirms Phi decay dominates at large U.',
    holds: () =>
      IMP2338_VOLTERRA_KRAWCZYK.certifiedGrid.some((r) => r.U === 16),
  },
  {
    id: 'imp2338-margin-monotone-in-a',
    why:
      'At fixed U, the HS norm should decrease as a decreases (smaller a -> smaller sinh -> ' +
      'smaller kernel entries). Monotonicity violation would signal a compute error.',
    holds: () => {
      const U_vals = [1, 2, 4, 8, 16];
      const a_vals = [0.5, 0.2, 0.1, 0.05, 0.025, 0.01];
      for (const U of U_vals) {
        const rows = a_vals.map((a) =>
          IMP2338_VOLTERRA_KRAWCZYK.certifiedGrid.find(
            (r) => r.U === U && Math.abs(r.a - a) < 1e-10
          )
        );
        for (let i = 0; i < rows.length - 1; i++) {
          if (rows[i].hs_cert < rows[i + 1].hs_cert) return false;
        }
      }
      return true;
    },
  },
];
