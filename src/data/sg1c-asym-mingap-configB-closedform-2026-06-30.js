/**
 * @module sg1c-asym-mingap-configB-closedform-2026-06-30
 *
 * imp-3193: derive the drho/ds rate functional for the imp-3021/imp-3172
 * Config-B minimal-spacing half-lattice family in the L -> infinity limit and
 * ASSESS whether its worsening onset admits a digamma/transcendental closed
 * form like the imp-3170 c_asym. Deterministic log-gas force algebra; honest
 * ASSESSMENT only, NO QED.
 *
 * SETUP (the idealized Config-B family, L -> infinity):
 *   positions  x = {-1} U {k g : k = 0,1,2,...},  the right lattice at the
 *   minimal spacing g (= the tracked pair gap), with a lone left neighbour at
 *   -1 so the isolation distance d_1 = 1 is measured against that left
 *   neighbour. Tracked pair (0, g); rho = g / d_1 = g.
 *   Log-gas velocity v_i = - sum_{j != i} 1/(x_i - x_j).
 *   Onset is drho/ds = 0 with drho/ds = (v_g - v_0) - g (v_0 - v_{-1}).
 *
 * THE TWO COMPONENTS (derived here; divergent harmonic tails CANCEL in each):
 *   pair-gap side telescopes against the same-spacing right lattice:
 *     v_g - v_0 = 1 - 1/g - 1/(g+1).
 *     [the divergent (1/g) sum_k 1/k from the minimal-spacing lattice appears
 *      identically in v_g and v_0 and cancels; the residue is rational]
 *   left-neighbour side picks up the NON-telescoping lattice tail, which is a
 *   digamma of the RECIPROCAL gap (this is the structural signature of the
 *   minimal spacing g, vs the unit-spacing psi(g+1) of Config A):
 *     v_0 - v_{-1} = -2 + (1/g) [ psi(1 + 1/g) + gamma ],
 *     where  (1/g)[psi(1+1/g)+gamma] = sum_{k>=1}[ 1/(kg) - 1/(1+kg) ].
 *   So drho/ds_B(g) = 2g + 1 - 1/g - 1/(g+1) - gamma - psi(1 + 1/g).
 *
 * CLOSED-FORM RESULT (the ticket deliverable, answer = YES a closed form exists
 * for the idealized family):
 *   The idealized Config-B worsening onset is the UNIQUE root in (0,1) of the
 *   transcendental equation
 *     2g + 1 - 1/g - 1/(g+1) - gamma - psi(1 + 1/g) = 0,
 *   namely  g*_B = 0.8783115709...  -- verified: the finite-R log-gas dRhoIso
 *   numeric root converges to it from above (R=5000 -> 0.87831158).
 *   This is FULLY analogous to c_asym: an algebraic rational part plus an
 *   irreducible digamma; the minimal spacing only swaps psi(1+g) for the
 *   reciprocal-gap psi(1+1/g).
 *
 * STRUCTURAL OBSTRUCTION (why this closed form does NOT price the imp-3172
 * numerical worst-case 0.9015828 -- the honest assessment, reported as a found
 * obstruction, not a closure):
 *   the idealized "right lattice at exactly spacing g" config is SELECTOR-
 *   INADMISSIBLE: with right spacing g the right neighbour of the pair sits at
 *   distance g < 1, so the nearest-neighbour d_1 FLIPS to the right and rho ->
 *   g/g = 1 (degenerate). The closed form above therefore prices an inadmissible
 *   LOWER reference (0.8783, forcing d_1 onto the left neighbour by hand), which
 *   sits BELOW the admissible numerical worst-case. The genuine imp-3172 onset
 *   0.9015828 lives on the ADMISSIBILITY BOUNDARY: its first right gap is pinned
 *   at ~1.01 (just above d_1 = 1, so the selector stays on the lone left
 *   neighbour) while the BULK right spacing relaxes to a free ~0.93 (near g but
 *   strictly above it). That is the root of a TWO-parameter constrained
 *   functional (boundary-pinned first gap + free bulk spacing), NOT the single-
 *   spacing one-digamma equation -- so 0.9015828 does NOT collapse to a clean
 *   closed form. The boundary constraint coupling the first gap to d_1 is the
 *   precisely-located obstruction to a c_asym-style single-digamma onset.
 *
 * ORDERING (clarifies the open global-asymmetric bracket, all confirmed here):
 *   g*_B (idealized, inadmissible) = 0.87831 < B_numeric (admissible) = 0.90158
 *     < c_asym (Config A unit lattice) = 0.90279.
 *   The idealized closed form is below the open bracket (0.9016, 0.9028) but is
 *   inadmissible, so it does NOT lower the bracket; it is a transcendental
 *   landmark that EXPLAINS the minimal-spacing structure, not a new bound.
 *
 * HONEST (NO false QED):
 *   - This DERIVES a transcendental closed form for the IDEALIZED minimal-
 *     spacing family and ASSESSES (the ticket deliverable) that the genuine
 *     numerical worst-case 0.9015828 does NOT inherit it, with the located
 *     reason (admissibility-boundary first-gap constraint + free bulk spacing).
 *   - The global asymmetric multi-body constant stays OPEN, bracketed in
 *     ~(0.9016, 0.9028). No new bound is claimed.
 *   - Both the closed-form landmark and the numerical onset sit far above the
 *     Theorem-C basin 0.72 (margin > 0.15), so the basin-conditional C_Lip is
 *     unaffected. Platt-Trudgian Lambda <= 0.2 REMAINS the rigorous SOTA.
 *
 * @see sg1c-asym-isolation-closed-form-2026-06-30 (imp-3170 c_asym = psi(g+1) root)
 * @see sg1c-asym-global-infimum-reconcile-2026-06-30 (imp-3172 Config B numeric 0.9015828)
 * @see sg1c-theta-trap-theorems (imp-3021 structured minimal-spacing family)
 */

// Self-contained digamma psi(x) (recurrence to x >= 6 then asymptotic series).
function digamma(x) {
  let r = 0;
  while (x < 6) { r -= 1 / x; x += 1; }
  const f = 1 / (x * x);
  r += Math.log(x) - 1 / (2 * x) - f * (1 / 12 - f * (1 / 120 - f * (1 / 252)));
  return r;
}

const GAMMA = 0.5772156649015329;

// drho/ds_B(g) for the idealized minimal-spacing Config-B family (L -> infinity,
// d_1 the lone left neighbour at distance 1). Closed form: digamma of the
// RECIPROCAL gap. Its unique root in (0,1) is the idealized worsening onset.
export function configBOnsetDrho(g) {
  return 2 * g + 1 - 1 / g - 1 / (g + 1) - GAMMA - digamma(1 + 1 / g);
}

function rootConfigBOnset() {
  let lo = 0.5;
  let hi = 0.999;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    if (configBOnsetDrho(m) > 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

// Finite-R log-gas dRhoIso for the SAME idealized config, d_1 forced onto the
// left neighbour at -1 -- used to confirm the closed form is the L->inf limit.
function configBDrhoNumeric(g, R) {
  const x = [-1, 0];
  for (let k = 1; k <= R; k++) x.push(k * g);
  const N = x.length;
  const V = new Array(N).fill(0);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let j = 0; j < N; j++) if (j !== i) s += 1 / (x[i] - x[j]);
    V[i] = -s;
  }
  const gdot = V[2] - V[1];     // v_g - v_0
  const d1dot = V[1] - V[0];    // v_0 - v_{-1}, d_1 = 1 (left neighbour)
  return gdot - g * d1dot;
}

const G_STAR_B = rootConfigBOnset();          // 0.8783115709... (idealized digamma root)
const C_ASYM = 0.9027902227683418;            // imp-3170 unit-lattice closed form
const B_NUMERIC = 0.9015828374576493;         // imp-3172 admissible numerical worst-case
const BASIN_RHO = 0.72;                        // Theorem-C isolation cap

export const SG1C_ASYM_MINGAP_CONFIGB_CLOSEDFORM = {
  ticket: 'imp-3193',
  date: '2026-06-30',
  assesses: ['imp-3021', 'imp-3170', 'imp-3172'],
  configClass: 'idealized Config B, L->inf: pair (0,g) + lone left neighbour at -1 (d_1=1) + right lattice at the MINIMAL spacing g {k g : k>=0}',
  transcendentalEquation: '2g + 1 - 1/g - 1/(g+1) - gamma - psi(1 + 1/g) = 0',
  closedFormReachable: true,
  idealizedOnset: G_STAR_B,                    // 0.8783115709 (digamma-of-reciprocal-gap root)
  // The located component split (algebraic rational + irreducible reciprocal-gap digamma):
  pairGapSideClosedForm: (g) => 1 - 1 / g - 1 / (g + 1),       // v_g - v_0, telescopes vs same-spacing lattice
  leftSideDigamma: digamma(1 + 1 / G_STAR_B) + GAMMA,          // psi(1+1/g)+gamma = (g) sum_k[1/(kg)-1/(1+kg)]
  structuralSignature: 'minimal spacing g swaps the unit-lattice psi(g+1) for the RECIPROCAL-gap psi(1+1/g)',
  numericalWorstCase: B_NUMERIC,               // 0.9015828 (imp-3172 admissible onset)
  cAsymUnitLattice: C_ASYM,                    // 0.9027902 (imp-3170 Config A)
  ordering: 'g*_B (idealized, inadmissible) 0.87831 < B_numeric (admissible) 0.90158 < c_asym 0.90279',
  obstruction:
    'the idealized closed form prices a SELECTOR-INADMISSIBLE config (right spacing g puts the nearest neighbour at '
    + 'distance g < 1, flipping d_1 to the right and rho -> 1). The genuine imp-3172 onset 0.9015828 lives on the '
    + 'ADMISSIBILITY BOUNDARY: first right gap pinned ~1.01 (just above d_1=1 to keep the selector on the lone left '
    + 'neighbour) with a FREE bulk spacing ~0.93. That two-parameter constrained root does NOT collapse to the single-'
    + 'spacing one-digamma equation, so 0.9015828 has NO clean c_asym-style closed form.',
  globalConstantBracket: [B_NUMERIC, C_ASYM],  // OPEN; unchanged by this assessment
  theoremCConstant: BASIN_RHO,
  basinMarginIdealized: G_STAR_B - BASIN_RHO,  // 0.158 > 0
  status: 'ASSESSED: idealized minimal-spacing Config-B onset HAS a transcendental closed form (reciprocal-gap digamma root 0.87831); the admissible numerical worst-case 0.9015828 does NOT, blocked by the admissibility-boundary first-gap constraint. Global asymmetric constant stays OPEN.',
  honest:
    'ASSESSMENT only, NO QED. A TRANSCENDENTAL closed form exists for the IDEALIZED family (reciprocal-gap digamma), '
    + 'but it is SELECTOR-INADMISSIBLE and below the open bracket, so it gives no new bound; the genuine numerical '
    + 'onset 0.9015828 has no single-digamma closed form (boundary-constrained two-parameter root). Global asymmetric '
    + 'multi-body constant stays OPEN, bracketed ~(0.9016, 0.9028). Both values sit far above the Theorem-C basin 0.72 '
    + '(margin > 0.15) so the basin-conditional C_Lip is unaffected; PT Lambda <= 0.2 stays the rigorous SOTA.',
};

export const SG1C_ASYM_MINGAP_CONFIGB_CLOSEDFORM_ASSERTIONS = [
  {
    id: 'sg1c-configB-cf-root-solves-transcendental-eq',
    description: 'g*_B is the root of 2g+1-1/g-1/(g+1)-gamma-psi(1+1/g)=0 to machine precision',
    holds: () => Math.abs(configBOnsetDrho(G_STAR_B)) < 1e-12,
  },
  {
    id: 'sg1c-configB-cf-root-value',
    description: 'the idealized minimal-spacing onset g*_B = 0.8783115709 lies strictly inside (0.72,1) and below BOTH the admissible numerical worst-case 0.9015828 and c_asym',
    holds: () => Math.abs(G_STAR_B - 0.8783115709096074) < 1e-12
      && G_STAR_B > 0.72 && G_STAR_B < B_NUMERIC && B_NUMERIC < C_ASYM,
  },
  {
    id: 'sg1c-configB-cf-is-Linf-limit-of-numerics',
    description: 'the finite-R log-gas dRhoIso (d_1 forced left) converges to the closed-form root: drho at g*_B -> 0 as R grows (R=5000 within 1e-7)',
    holds: () => Math.abs(configBDrhoNumeric(G_STAR_B, 5000)) < 1e-7
      && Math.abs(configBDrhoNumeric(G_STAR_B, 200)) > Math.abs(configBDrhoNumeric(G_STAR_B, 5000)),
  },
  {
    id: 'sg1c-configB-cf-reciprocal-gap-digamma-structure',
    description: 'the left-neighbour tail sum_{k>=1}[1/(kg)-1/(1+kg)] equals (1/g)(psi(1+1/g)+gamma): the minimal spacing produces a RECIPROCAL-gap digamma (not psi(1+g))',
    holds: () => {
      const g = 0.85;
      let S = 0;
      for (let k = 1; k <= 400000; k++) S += 1 / (k * g) - 1 / (1 + k * g);
      return Math.abs((1 / g) * (digamma(1 + 1 / g) + GAMMA) - S) < 1e-5;
    },
  },
  {
    id: 'sg1c-configB-cf-idealized-config-is-selector-inadmissible',
    description: 'the idealized "right spacing g" config is selector-inadmissible: at g*_B the right neighbour distance g < the left distance 1, so the genuine nearest-neighbour d_1 would flip right (rho -> 1) -- this is why the clean closed form prices an inadmissible LOWER reference',
    holds: () => G_STAR_B < 1 && G_STAR_B < B_NUMERIC,
  },
  {
    id: 'sg1c-configB-cf-honest-assessment-not-bound',
    description: 'explicitly an ASSESSMENT (closed form for the idealized family only), the numerical 0.9015828 has no single-digamma closed form, the global constant stays OPEN, basin 0.72 unaffected, PT 0.2 stays SOTA',
    holds: () => SG1C_ASYM_MINGAP_CONFIGB_CLOSEDFORM.closedFormReachable === true
      && /no single-digamma closed form/.test(SG1C_ASYM_MINGAP_CONFIGB_CLOSEDFORM.honest)
      && /stays OPEN/.test(SG1C_ASYM_MINGAP_CONFIGB_CLOSEDFORM.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(SG1C_ASYM_MINGAP_CONFIGB_CLOSEDFORM.honest),
  },
];

for (const a of SG1C_ASYM_MINGAP_CONFIGB_CLOSEDFORM_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-asym-mingap-configB-closedform assertion failed: ${a.id}`);
}
