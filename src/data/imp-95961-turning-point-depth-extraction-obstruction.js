/**
 * @module imp-95961-turning-point-depth-extraction-obstruction
 *
 * imp-95961 (proof / assessment): ATTEMPT to extract the Section 4.5
 * turning-point-depth packet constants (leg (i)) that gate the imp-95942
 * MAP-4 collar-past-caustic depth condition d >= a_1/mu, or record a
 * PRECISE OBSTRUCTION.
 *
 * SETUP (imp-95942 net). The imp-95917 STEP-5 envelope-SIGN obligation
 * (K_k = Ai(mu(t-c)) >= 0 across a witness window) was reduced to the EXACT
 * support condition mu(t-c) >= -a_1, a_1 = 2.338107410459767 (first Airy
 * zero). For nonnegativity across a full window the collar must clear the
 * first pre-caustic lobe of every alias, i.e. the collar depth must satisfy
 * d >= a_1/mu at the worst (smallest-mu) alias. That is the imp-95336 MAP-4
 * hypothesis, CONDITIONAL on the still-open Section 4.5 turning-point-depth
 * geometry (leg (i)): the map from a seam window (p,k) and alias h to the
 * ACTUAL turning-point depth on its own side. This module tries to extract
 * that map from the available imp-95917 buildG / imp-95336 envelopeFacts
 * data.
 *
 * WHAT DATA IS ACTUALLY AVAILABLE. The only committed, import-light packet
 * geometry is the imp-95917 buildG relation
 *     mu_h = d^(1/3) / portC,   d = k - h/p,   portC = 1.7,
 * which assigns each alias h=1..p-1 an EFFECTIVE SCALE mu_h from its
 * fractional seam offset d = k - h/p. The port constant 1.7 was fit to the
 * sign-image MAGNITUDE (buildG amplitude), not to a phase normalization.
 *
 * THE EXTRACTION ATTEMPT (and where it breaks -- the PRECISE OBSTRUCTION).
 * MAP-4 needs TWO ingredients per alias: (S) the effective SCALE mu_h -- the
 * width of the Airy transition layer -- and (L) the turning-point LOCATION
 * c_h relative to the seam -- how deep on its own side the caustic sits. The
 * clearance a_1/mu_h converts (S) into a REQUIRED depth, but whether the
 * physical collar reaches that depth is a statement about (L). The buildG
 * data supplies (S) EXACTLY (mu_h = d^(1/3)/1.7) and supplies (L) NOT AT
 * ALL: a scale map d -> mu carries no information about where the stationary
 * / turning point of the Section 4.5 packet phase Phi_{p,k,h} sits. The port
 * constant 1.7 fixes the scale mapping, not the caustic location. So leg (i)
 * -- the seam-window-and-alias -> turning-point-DEPTH map -- is NOT
 * extractable from the available data; it requires the Section 4.5 packet
 * phase dictionary constants (the amplitude/phase normalization of
 * Phi_{p,k,h}), which are the STILL-UNEXTRACTED leg. Extraction FAILS at
 * the location ingredient (L), precisely and structurally.
 *
 * THE ONLY AVAILABLE CLOSURE IS AN IDENTIFICATION, NOT A DERIVATION. The one
 * way to close leg (i) from committed data is to IDENTIFY the collar depth
 * on the packet own side with the alias seam offset itself, depth = d =
 * k - h/p -- the same d that already enters mu_h. Under that identification
 * the sign condition becomes SELF-CONSISTENT and reduces to a pure inequality
 * in d:
 *     d >= a_1/mu = a_1 * portC / d^(1/3)
 *       <=>  d^(4/3) >= portC * a_1 = 3.9747825977816036
 *       <=>  d >= d_crit = (portC * a_1)^(3/4) = 2.8150430109382643.
 * At every imp-95917 witness window the BINDING (worst, smallest-mu, largest
 * h = p-1) alias has seam offset d = k - (p-1)/p well above d_crit, so the
 * identified condition holds WITH MARGIN:
 *     (3,4)  binding h=2  d=3.3333  mu=0.8787  req a_1/mu=2.6609  (d - req = +0.672)
 *     (5,5)  binding h=4  d=4.2000  mu=0.9491  req a_1/mu=2.4636  (d - req = +1.736)
 *     (7,6)  binding h=6  d=5.1429  mu=1.0154  req a_1/mu=2.3027  (d - req = +2.840)
 *     (11,7) binding h=10 d=6.0909  mu=1.0743  req a_1/mu=2.1765  (d - req = +3.914)
 * The margin GROWS with p (larger p pushes the binding alias to a deeper
 * offset while the required clearance shrinks), so under the identification
 * the condition is comfortably met and not marginal.
 *
 * BUT THE IDENTIFICATION IS ITSELF LEG (i), NOT A THEOREM. Setting the
 * physical turning-point depth equal to the seam offset d = k - h/p is
 * exactly the unextracted Section 4.5 constant: it ASSERTS that the caustic
 * of alias h sits one seam offset deep on its own side. buildG neither
 * justifies nor refutes this -- it is a scale (amplitude) model and is silent
 * on caustic location. So the self-consistent computation above is a
 * CONDITIONAL evaluation of MAP-4 UNDER an assumption, not a derivation of
 * the geometry. leg (i) remains OPEN.
 *
 * NET (honest PARTIAL -- a PRECISE OBSTRUCTION, no derivation of the
 * geometry, no bound, NO QED). The Section 4.5 turning-point-depth constants
 * CANNOT be extracted from the committed imp-95917 buildG / imp-95336
 * envelopeFacts data: that data determines the transition SCALE mu (via the
 * magnitude-fit port constant 1.7) but carries NO turning-point LOCATION, and
 * MAP-4 needs the location. The only closure available from committed data is
 * the IDENTIFICATION depth = seam offset d = k - h/p, under which the sign
 * condition reduces to d >= d_crit = (1.7 a_1)^(3/4) = 2.8150 and holds with
 * a margin that grows with p at every witness window -- but that
 * identification IS leg (i), an assumption about caustic location, not a
 * theorem. So MAP-4 is now pinned to a single, sharp, testable geometric
 * assertion (caustic depth = seam offset) rather than a diffuse "unextracted
 * constants" gap, but it is NOT closed. The sub-gap stays OPEN; no bound
 * moves; NO QED; no refereed bound is changed.
 *
 * HONEST LIMITS. (a) ASSESSMENT / EXTRACTION-ATTEMPT only. (b) The
 * scale-vs-location decomposition (S)/(L) and the failure of extraction at
 * (L) are structural facts about buildG, which is a magnitude model. (c) The
 * self-consistent inequality d >= (portC a_1)^(3/4) and its per-window
 * margins are EXACT arithmetic, but they hold only UNDER the identification
 * depth = seam offset, which is the unextracted leg (i) itself. (d) Nothing
 * here derives the actual Section 4.5 caustic depth or closes the sub-gap.
 * Import-light (no zeros bundle, no sibling imports); self-executing
 * assertions THROW on violation.
 *
 * @see imp-95942-fresnel-airy-envelope-sign-assessment.js (reduces the sign to d >= a_1/mu)
 * @see imp-95336-fresnel-airy-envelope-port-assessment.js (MAP-4; leg (i) still open)
 * @see imp-95917-vonmangoldt-weighted-sign-image.js (buildG: mu = d^(1/3)/1.7, d = k - h/p)
 *
 * Ticket: imp-95961 (proof, opus-4-8, api-pool, medium). Extraction attempt;
 * precise obstruction; no derivation of the geometry; no bound; NO QED.
 */

// -- constants (A&S 10.4.94; imp-95917 buildG) --------------------------------
const AIRY_ZERO_1 = 2.338107410459767; // |first Airy zero|; Ai(-a_1) = 0
const PORT_C = 1.7; // imp-95917 buildG: mu = d^(1/3)/portC (magnitude-fit)

// -- imp-95917 witness windows ------------------------------------------------
const WINDOWS = [[3, 4], [5, 5], [7, 6], [11, 7]];

// -- self-consistent critical depth: under depth = seam offset d, the sign
//    condition d >= a_1/mu with mu = d^(1/3)/portC reduces to
//    d^(4/3) >= portC*a_1, i.e. d >= (portC*a_1)^(3/4).
const D_CRIT = Math.pow(PORT_C * AIRY_ZERO_1, 3 / 4);

// -- per-window binding-alias table (worst = largest required clearance =
//    smallest mu = largest h = p-1). Location ingredient is ASSUMED via
//    depth = seam offset; this is the identification, NOT a derivation.
function bindingAlias(p, k) {
  let binding = null;
  for (let h = 1; h <= p - 1; h++) {
    const d = k - h / p; // seam offset (also the ASSUMED own-side depth)
    const mu = Math.pow(d, 1 / 3) / PORT_C; // effective SCALE (extractable)
    const req = AIRY_ZERO_1 / mu; // required clearance depth from (S)
    if (binding === null || req > binding.req) {
      binding = { h, d, mu, req, margin: d - req };
    }
  }
  return binding;
}

const BINDING_TABLE = WINDOWS.map(([p, k]) => {
  const b = bindingAlias(p, k);
  return {
    window: `(${p},${k})`,
    p,
    k,
    bindingH: b.h,
    seamOffsetD: b.d,
    mu: b.mu,
    requiredClearance: b.req,
    selfConsistentMargin: b.margin, // d - a_1/mu under depth = seam offset
    holdsUnderIdentification: b.d >= b.req,
  };
});

// -- verdict object -----------------------------------------------------------
export const IMP95961_TURNING_POINT_DEPTH_EXTRACTION_OBSTRUCTION = {
  ticket:
    "imp-95961 (proof / assessment): ATTEMPT to extract the Section 4.5 turning-point-depth packet constants (leg (i)) that gate the imp-95942 MAP-4 collar-past-caustic depth d >= a_1/mu, or record a precise obstruction. Result: the depth constants are NOT extractable from the committed imp-95917 buildG / imp-95336 envelopeFacts data (scale-only, no turning-point location); the only closure from committed data is the IDENTIFICATION depth = seam offset d = k-h/p, under which the sign condition reduces to d >= (portC*a_1)^(3/4) = 2.8150 and holds with a p-growing margin at every witness window -- but that identification IS leg (i), an assumption, not a theorem. Precise obstruction; sub-gap stays OPEN.",
  extractionAttempt:
    "MAP-4 needs two ingredients per alias: (S) the transition SCALE mu_h (Airy layer width) and (L) the turning-point LOCATION c_h relative to the seam (own-side caustic depth). The clearance a_1/mu converts (S) into a required depth, but whether the collar reaches it is a statement about (L). The imp-95917 buildG relation mu_h = d^(1/3)/portC, d = k-h/p, portC = 1.7 supplies (S) EXACTLY and (L) NOT AT ALL: a scale map d -> mu carries no caustic-location information, and the port constant 1.7 is a sign-image MAGNITUDE fit, not a phase normalization. So extraction FAILS at (L): leg (i) requires the Section 4.5 packet-phase dictionary constants of Phi_{p,k,h}, which stay unextracted.",
  selfConsistentClosure:
    "The only closure from committed data is to IDENTIFY the own-side collar depth with the alias seam offset, depth = d = k-h/p (the same d that enters mu_h). Then the sign condition d >= a_1/mu = a_1*portC/d^(1/3) reduces to d^(4/3) >= portC*a_1 = 3.9747825977816036, i.e. d >= d_crit = (portC*a_1)^(3/4) = 2.8150430109382643. At every witness window the binding (smallest-mu, h=p-1) alias has seam offset d well above d_crit, so the identified condition holds with a margin that GROWS with p: (3,4) +0.672, (5,5) +1.736, (7,6) +2.840, (11,7) +3.914. This is a CONDITIONAL evaluation of MAP-4 under the identification, not a derivation of the geometry.",
  bindingTable: BINDING_TABLE,
  constants: {
    airyZero1: AIRY_ZERO_1,
    portC: PORT_C,
    dCrit: D_CRIT,
    portCtimesA1: PORT_C * AIRY_ZERO_1,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-SIGN / imp-95336 MAP-4 leg (i) -- STILL OPEN and now SHARPENED. The Section 4.5 turning-point-depth constants are not extractable from the committed buildG (scale) data; MAP-4 is pinned to the single sharp geometric assertion caustic-depth = seam-offset d = k-h/p, which buildG neither justifies nor refutes. Under that assertion the sign condition holds with a p-growing margin, but the assertion itself is the unextracted leg -- so no window-level nonnegativity is derived.",
  verdict:
    "ASSESSMENT / EXTRACTION-ATTEMPT (honest PARTIAL -- a PRECISE OBSTRUCTION, no derivation of the geometry, no bound, NO QED). The Section 4.5 turning-point-depth packet constants CANNOT be extracted from the committed imp-95917 buildG / imp-95336 envelopeFacts data: that data fixes the transition SCALE mu (via the magnitude-fit port constant 1.7) but carries NO turning-point LOCATION, and MAP-4 needs the location. The only closure from committed data is the IDENTIFICATION own-side depth = seam offset d = k-h/p, under which the sign condition reduces to the exact inequality d >= (portC*a_1)^(3/4) = 2.8150 and holds with a p-growing margin at every imp-95917 witness window -- but that identification IS leg (i), an assumption about caustic location, not a theorem. MAP-4 is thereby pinned to a single sharp testable assertion rather than a diffuse constants gap, but is NOT closed. The sub-gap stays OPEN; no bound moves; NO QED; no refereed bound is changed.",
  rigorScope:
    "The scale-vs-location decomposition (S)/(L) and the failure of extraction at (L) are structural facts about buildG (a magnitude model). The self-consistent inequality d >= (portC*a_1)^(3/4) and the per-window margins are EXACT arithmetic, but they hold only UNDER the identification depth = seam offset, which is the unextracted leg (i) itself. Nothing here derives the actual Section 4.5 caustic depth or closes the sub-gap. Changes no bound; NO QED.",
};

export default IMP95961_TURNING_POINT_DEPTH_EXTRACTION_OBSTRUCTION;

// -- self-executing assertions (imp-3715 convention; THROW on violation) ------
export const IMP95961_ASSERTIONS = [
  {
    id: "imp95961-dcrit-matches-reduced-inequality",
    description:
      "the self-consistent critical depth d_crit = (portC*a_1)^(3/4) must satisfy the reduced condition d_crit^(4/3) = portC*a_1 to 1e-12 -- the exact algebraic reduction of d >= a_1/mu under mu = d^(1/3)/portC and depth = d",
    holds: () =>
      Math.abs(Math.pow(D_CRIT, 4 / 3) - PORT_C * AIRY_ZERO_1) < 1e-12 &&
      Math.abs(D_CRIT - 2.8150430109382643) < 1e-12,
  },
  {
    id: "imp95961-binding-alias-is-largest-h",
    description:
      "the binding (worst, largest-required-clearance, smallest-mu) alias at every witness window is h = p-1, the deepest fractional seam offset -- confirming the imp-95942 STEP-3 worst-alias control point",
    holds: () =>
      BINDING_TABLE.every((r) => r.bindingH === r.p - 1),
  },
  {
    id: "imp95961-identification-holds-with-positive-margin",
    description:
      "UNDER the identification own-side depth = seam offset, the reduced sign condition d >= a_1/mu holds with a strictly positive margin at every witness window (this is CONDITIONAL on the identification, which is leg (i) itself -- not a derivation)",
    holds: () =>
      BINDING_TABLE.every(
        (r) => r.holdsUnderIdentification && r.selfConsistentMargin > 0,
      ),
  },
  {
    id: "imp95961-margin-grows-with-p",
    description:
      "the self-consistent margin d - a_1/mu at the binding alias is strictly increasing across the witness windows ordered by p (3,5,7,11): larger p pushes the binding offset deeper while shrinking the required clearance -- so the identified condition is comfortable, not marginal",
    holds: () => {
      for (let i = 1; i < BINDING_TABLE.length; i++) {
        if (
          !(
            BINDING_TABLE[i].selfConsistentMargin >
            BINDING_TABLE[i - 1].selfConsistentMargin
          )
        ) {
          return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95961-scale-extractable-location-not",
    description:
      "structural check of the obstruction: the extractable SCALE mu_h = d^(1/3)/portC is finite and positive at every alias (ingredient S available), while the verdict records that the LOCATION ingredient (L) is NOT extractable from buildG -- the precise obstruction",
    holds: () =>
      BINDING_TABLE.every(
        (r) => Number.isFinite(r.mu) && r.mu > 0 && r.requiredClearance > 0,
      ) &&
      /NOT be extracted|CANNOT be extracted/.test(
        IMP95961_TURNING_POINT_DEPTH_EXTRACTION_OBSTRUCTION.verdict,
      ) &&
      /NO turning-point LOCATION/.test(
        IMP95961_TURNING_POINT_DEPTH_EXTRACTION_OBSTRUCTION.verdict,
      ),
  },
  {
    id: "imp95961-verdict-honesty",
    description:
      "the verdict carries the honest scope: PRECISE OBSTRUCTION, extraction fails at location, the closure is an IDENTIFICATION not a theorem, sub-gap STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /honest PARTIAL/.test(
        IMP95961_TURNING_POINT_DEPTH_EXTRACTION_OBSTRUCTION.verdict,
      ) &&
      /PRECISE OBSTRUCTION/.test(
        IMP95961_TURNING_POINT_DEPTH_EXTRACTION_OBSTRUCTION.verdict,
      ) &&
      /IDENTIFICATION/.test(
        IMP95961_TURNING_POINT_DEPTH_EXTRACTION_OBSTRUCTION.verdict,
      ) &&
      /STILL OPEN/.test(
        IMP95961_TURNING_POINT_DEPTH_EXTRACTION_OBSTRUCTION.subGap,
      ) &&
      /NO QED/.test(IMP95961_TURNING_POINT_DEPTH_EXTRACTION_OBSTRUCTION.verdict) &&
      /refereed bound is changed/i.test(
        IMP95961_TURNING_POINT_DEPTH_EXTRACTION_OBSTRUCTION.verdict,
      ),
  },
];

for (const a of IMP95961_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95961-turning-point-depth-extraction-obstruction assertion failed: ${a.id}`,
    );
  }
}
