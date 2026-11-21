/**
 * @module imp-95266-theta-vs-k-viz-data
 *
 * imp-95266 (ux): lightweight, import-light viz-data module baking a sampled
 * comparison of the imp-95233 phase-alignment ratio theta(phi_K) against the
 * imp-95224 THEOREM SGN-SAT amplitude-modulus blow-up, both indexed by the
 * packet count K of the canonical depth-saturating witness family
 *   phi_K(t) = e^(-t) (1 - e^(-t/K))^K
 *            = sum_(j=0..K) (-1)^j C(K, j) e^(-(1 + j/K) t),
 * co-centered at delta = 1, fixed depth y_min = 2 delta = 2:
 *   (1) theta(phi_K) -- EXACT BigInt rational integration of the same two
 *       majorant polynomials documented in imp-95233 (Beta-function forms);
 *   (2) the amplitude modulus, L1 = sum_j |c_j| = 2^K and L2 mass =
 *       sum_j c_j^2 = C(2K, K) -- the exact binomial identities documented
 *       in imp-95233's assertion imp95233-modulus-blowup-exact;
 *   (3) for context, the depth-saturation gap 1/2 - R_K (Simpson quadrature
 *       of the same W(f)/T(f) integrals documented in imp-95224 THEOREM
 *       SGN-SAT; K = 8 cross-checks the imp-95224 baked literal
 *       SAT_HALF_MINUS_R_K8 = 7.558509318e-9 to 1e-4 relative, the
 *       imp-95224 tolerance; measured agreement 3.3e-7).
 * All three are recomputed independently here from the documented closed
 * forms, NOT re-derived or re-conjectured, WITHOUT importing either source
 * module (each carries its own self-executing assertions block). Follows
 * the imp-95265 / imp-36185 import-light viz-data pattern.
 *
 * PRESENTATION POINT. theta_K collapses toward 0 while the modulus (L1, L2)
 * diverges as K grows -- the numeric picture behind imp-95233's claim that
 * the imp-95224 depth-saturating witnesses buy R -> 1/2 "entirely with
 * phase currency and modulus blow-up." The PHASE-CERT threshold
 * theta_0 = e^(-y_min) (here e^(-2) = 0.1353352832) marks where the
 * corollary PHASE-CERT bound R <= e^(-y_min)/(2 theta) crosses 1/2: every
 * sampled theta_K already sits below this threshold (the SAT family lives
 * exactly in the deep-cancellation / vacuous-bound regime imp-95233's
 * HONEST LIMITS flags), while a family with theta held above the threshold
 * cannot ride this witness sequence to saturation.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95233 theta closed form
 * and modulus identities, and the imp-95224 SGN-SAT witness family,
 * verbatim; changes no bound, no operator positivity, no RH claim; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-95233-modulus-phase-currency-feasibility.js (source: theta(phi_K), L1/L2 modulus identities, PHASE-CERT)
 * @see imp-95224-signed-depth-currency-nogo.js (source: THEOREM SGN-SAT, phi_K witness family)
 *
 * Ticket: imp-95266 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

// PHASE-CERT vacuity threshold at y_min = 2 delta = 2 (delta = 1): theta_0 = e^(-y_min)
export const IMP95266_PHASECERT_THRESHOLD_THETA = 0.1353352832366127;
export const IMP95266_PHASECERT_THRESHOLD_LOG10 = -0.8685889638065036;

// imp-95224 baked literal (K = 8, delta = 1); cross-checked below to 1e-4 relative
export const IMP95266_SGNSAT_K8_LITERAL = 7.558509318e-9;

export const IMP95266_THETA_VS_K = [
  { k: 1, theta: 0.05882352941176471, log10Theta: -1.2304489213782739, thetaRecip: '17', l1: 2, l2: 2, log10L1: 0.3010299956639812, log10L2: 0.3010299956639812, halfMinusR: 0.265668965428537, log10HalfMinusR: -0.5756591754743293 },
  { k: 2, theta: 0.0013003901170351108, log10Theta: -2.885926339801431, thetaRecip: '769', l1: 4, l2: 6, log10L1: 0.6020599913279624, log10L2: 0.7781512503836436, halfMinusR: 0.08186235432690259, log10HalfMinusR: -1.0869157693843807 },
  { k: 3, theta: 0.00002487995422088422, log10Theta: -4.604150423082331, thetaRecip: '40193', l1: 8, l2: 20, log10L1: 0.9030899869919435, log10L2: 1.3010299956639813, halfMinusR: 0.014259493108404908, log10HalfMinusR: -1.8458959123618082 },
  { k: 4, theta: 4.4878771219243974e-7, log10Theta: -6.347959042572025, thetaRecip: '2228225', l1: 16, l2: 70, log10L1: 1.2041199826559248, log10L2: 1.845098040014257, halfMinusR: 0.001554563263949038, log10HalfMinusR: -2.8083915993686808 },
  { k: 5, theta: 7.8385867554833e-9, log10Theta: -8.105762230634522, thetaRecip: '127574017', l1: 32, l2: 252, log10L1: 1.505149978319906, log10L2: 2.401400540781544, halfMinusR: 0.0001148353754239495, log10HalfMinusR: -3.939924305450178 },
  { k: 6, theta: 1.341490971950685e-10, log10Theta: -9.872412245724203, thetaRecip: '7454392321', l1: 64, l2: 924, log10L1: 1.806179973983887, log10L2: 2.9656719712201065, halfMinusR: 0.000006098003550336628, log10HalfMinusR: -5.214812327118693 },
  { k: 7, theta: 2.2637765760741174e-12, log10Theta: -11.645166438157911, thetaRecip: '441739706369', l1: 128, l2: 3432, log10L1: 2.1072099696478683, log10L2: 3.535547279176668, halfMinusR: 2.43398458554811e-7, log10HalfMinusR: -6.613682176489107 },
  { k: 8, theta: 3.781041759201198e-14, log10Theta: -13.422388526104669, thetaRecip: '26447737520129', l1: 256, l2: 12870, log10L1: 2.4082399653118496, log10L2: 4.109578546904387, halfMinusR: 7.558511816441182e-9, log10HalfMinusR: -8.121563703642835 },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP95266_ASSERTIONS = [
  {
    id: 'imp95266-theta-strictly-decreasing-in-k',
    description: 'theta_K strictly decreases as K increases -- phase currency collapses monotonically',
    holds: () =>
      IMP95266_THETA_VS_K.every((p, i, arr) => i === 0 || p.theta < arr[i - 1].theta),
  },
  {
    id: 'imp95266-modulus-strictly-increasing-in-k',
    description: 'L1 = 2^K and L2 = C(2K,K) both strictly increase as K increases -- modulus blows up',
    holds: () =>
      IMP95266_THETA_VS_K.every(
        (p, i, arr) => i === 0 || (p.l1 > arr[i - 1].l1 && p.l2 > arr[i - 1].l2),
      ),
  },
  {
    id: 'imp95266-halfminusr-strictly-decreasing-in-k',
    description: '1/2 - R_K strictly decreases as K increases -- the depth-saturation gap closes monotonically',
    holds: () =>
      IMP95266_THETA_VS_K.every((p, i, arr) => i === 0 || p.halfMinusR < arr[i - 1].halfMinusR),
  },
  {
    id: 'imp95266-all-theta-below-phasecert-threshold',
    description: 'every sampled theta_K sits below the PHASE-CERT vacuity threshold e^(-y_min) -- the SAT family lives entirely in the vacuous-bound regime flagged by imp-95233 HONEST LIMITS',
    holds: () => IMP95266_THETA_VS_K.every((p) => p.theta < IMP95266_PHASECERT_THRESHOLD_THETA),
  },
  {
    id: 'imp95266-matches-imp95233-theta-and-modulus-literals',
    description: 'theta_K and L1/L2 at K = 1, 2, 3 match the imp-95233 baked reciprocals (1/17, 1/769, 1/40193) and exact modulus identities (2/2, 4/6, 8/20)',
    holds: () => {
      const byK = (k) => IMP95266_THETA_VS_K.find((p) => p.k === k);
      return (
        byK(1).thetaRecip === '17' &&
        byK(2).thetaRecip === '769' &&
        byK(3).thetaRecip === '40193' &&
        Math.abs(byK(1).theta * 17 - 1) < 1e-12 &&
        Math.abs(byK(2).theta * 769 - 1) < 1e-12 &&
        Math.abs(byK(3).theta * 40193 - 1) < 1e-12 &&
        byK(1).l1 === 2 && byK(1).l2 === 2 &&
        byK(2).l1 === 4 && byK(2).l2 === 6 &&
        byK(3).l1 === 8 && byK(3).l2 === 20
      );
    },
  },
  {
    id: 'imp95266-matches-imp95224-sgnsat-k8-literal',
    // 1/2 - R_K at K = 8 is a cancellation of O(1) quantities down to ~7.6e-9, so it carries
    // only ~1e-7 relative accuracy (quadrature + float floor); the baked row agrees with the
    // literal to 3.3e-7 relative. imp-95224 itself checks this literal at 1e-4 relative, so the
    // original 3e-10 claim was not reproducible; the tolerance now matches the source module.
    description: 'the K = 8 depth-saturation gap cross-checks the imp-95224 SAT_HALF_MINUS_R_K8 literal to 1e-4 relative (the imp-95224 tolerance)',
    holds: () => {
      const at8 = IMP95266_THETA_VS_K.find((p) => p.k === 8);
      const rel = Math.abs(at8.halfMinusR - IMP95266_SGNSAT_K8_LITERAL) / IMP95266_SGNSAT_K8_LITERAL;
      return rel < 1e-4;
    },
  },
  {
    id: 'imp95266-log10-fields-consistent',
    description: 'log10 fields match log10 of their linear counterparts to storage precision',
    holds: () =>
      IMP95266_THETA_VS_K.every(
        (p) =>
          Math.abs(Math.log10(p.theta) - p.log10Theta) < 1e-6 &&
          Math.abs(Math.log10(p.l1) - p.log10L1) < 1e-6 &&
          Math.abs(Math.log10(p.l2) - p.log10L2) < 1e-6 &&
          Math.abs(Math.log10(p.halfMinusR) - p.log10HalfMinusR) < 1e-6,
      ),
  },
  {
    id: 'imp95266-threshold-consistent',
    description: 'the PHASE-CERT threshold constant equals e^(-2) (y_min = 2 delta at delta = 1) and its log10 field matches',
    holds: () =>
      Math.abs(IMP95266_PHASECERT_THRESHOLD_THETA - Math.exp(-2)) < 1e-12 &&
      Math.abs(Math.log10(IMP95266_PHASECERT_THRESHOLD_THETA) - IMP95266_PHASECERT_THRESHOLD_LOG10) < 1e-9,
  },
];

for (const a of IMP95266_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95266-theta-vs-k-viz-data assertion failed: ${a.id}`);
  }
}
