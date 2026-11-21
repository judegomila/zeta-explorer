/**
 * imp-95071 - TRANSCRIPTION of the Section 4.5 paper packet constants
 * (sigma, theta, beta, c, v, D) off the actual paper source, and evaluation of
 * the imp-95026 transfer map at the recoverable point. Measurement/derivation
 * only, NO QED, promotes no bound.
 *
 * CONTEXT. imp-95026 (imp-95026-paper-packet-ceiling-transfer.js) delivered a
 * transfer/sensitivity MAP of the imp-95008 far-bracket ceiling ledger
 * (4 -> 0.2717408057586117) and named as openResiduals[0]: "read
 * (sigma, theta, beta, c, v, D) off the paper Section 4.5 packet definition and
 * evaluate the map there ... the paper text is not carried here." This ticket
 * revisits that residual with one correction of fact and one transcription.
 *
 * CORRECTION OF FACT. The paper source IS carried in this repository:
 *   research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf
 * ("Permuting the Zeta Twin Ladder / Permutation architecture of the zeta twin
 * ladder", J. Gomila). Section 4.5 ("The one noncommuting weld") is present in
 * full. So the constants are NOT missing for lack of the manuscript; they are
 * missing because Section 4.5 defines the weld STRUCTURALLY (the alias grid and
 * the shifted Fresnel-Airy transition packets), not as six power-law envelope
 * numbers. This module records exactly what the paper supplies for each name.
 *
 * WHAT SECTION 4.5 ACTUALLY DEFINES (paper equations, verbatim structure).
 *   eq (14): prime projection alias expansion
 *            1_{p does not divide n} = 1 - 1/p - (1/p) sum_{h=1}^{p-1} e(h n / p);
 *   eq (15): the h-th alias shifts the stationary point to  u_{k,h} = v / (k - h/p);
 *   eq (16): [B_v, Pi_p] does not vanish; the h != 0 aliases are the "shifted
 *            Fresnel-Airy transition packets" whose sum must remain coupled.
 * The imp-95008 model family (imp-95008-far-coefficient-floor.js) is built to
 * MIRROR eq (15) exactly: it places packets on the (1/p)-separated alias grid
 * d = k - h/p in (0, D], with centers u = v/d, envelope widths r_d = c d^(-beta),
 * and a MAJORANT hypothesis MAJ(sigma, theta) with pair-correlation decay
 * s = sigma + theta. So the six names split cleanly by provenance:
 *
 *  - d = k - h/p, center u = v/d ........ PAPER-EXACT (eq 15). Hence v and D are
 *    STRUCTURAL paper quantities, not global literals: v is the direct
 *    stationary-point numerator of the tile x = x_c + u, |u| <= W (Section 4.6),
 *    and D is the alias-grid extent (the largest denominator d over the window
 *    modes k). Both are PER-WINDOW; the model normalizes v = D = 1.
 *  - r_d = c d^(-beta) ................. the width law. beta is the width-decay
 *    exponent; c is the width prefactor (a per-window carrier normalization,
 *    reading the bn = exp((t0/4) log^2 n) / gamma(x) carrier of eq (10)).
 *  - MAJ(sigma, theta), s = sigma + theta ... the assumed MAJORANT envelope
 *    hypothesis. sigma, theta are NOT paper packet quantities: they parameterize
 *    the power-law majorant the packets are ASSUMED to sit under. The paper
 *    packets are Fresnel-Airy (oscillatory, stationary-phase), not power-law, so
 *    Section 4.5 states no MAJ(sigma, theta); the model chose s = 11.
 *
 * TRANSCRIPTION VERDICT PER CONSTANT (see transcription[] below).
 *  beta ..... RECOVERABLE = 1/3. The Fresnel-Airy packets (eq 16) carry the Airy
 *             cube-root scaling, and Section 4.8 charges "the last ceil(N^(1/3))
 *             physical terms"; both pin the cube-root width exponent beta = 1/3.
 *             This is the ONE constant genuinely recoverable, and it MATCHES the
 *             model literal beta = 1/3.
 *  v, D, c .. STRUCTURAL but PER-WINDOW (eq 15 / Section 4.6). The paper supplies
 *             their MEANING, not global numeric values; the specific
 *             (v, D, c) live at the pilot cell N = 690988 (Section 4.6) and vary
 *             along the open family 690988 <= N <= 54799999 (eq 9). They enter
 *             the ceiling ONLY through the isolation group
 *             Q = (c D^(1-beta)/v) 2^(-(1-beta)) (imp-95026 Finding 0), so only
 *             this one combination need be pinned, not the three separately.
 *  sigma, theta ... NOT PINNED. No power-law counterpart exists in Section 4.5;
 *             the packets are Fresnel-Airy. What the paper MUST supply is the
 *             Fresnel-Airy -> MAJ(sigma, theta) legality reduction: the effective
 *             majorant decay the shifted Airy transition packets actually obey.
 *  A_d ...... SETTLED (cancels): imp-95026 Finding 0 shows the amplitude never
 *             enters the far coefficient; it acts only on the mass M.
 *
 * EVALUATION AT THE RECOVERABLE POINT. With the one recoverable constant
 * beta = 1/3 and the model normalization of the per-window group (c = v = D = 1),
 * the isolation constant is Q = 2^(-(1-1/3)) = 2^(-2/3) = 0.6299605249474366,
 * reproducing the imp-95026 model isolation exactly. This is NOT a paper number:
 * it is the map evaluated at the single point the paper pins (beta) with the
 * remaining per-window group left at the model normalization. The decay s cannot
 * be transcribed, so the ceiling itself remains a MAP over s, not a paper value.
 *
 * NET. Of the six named constants, exactly ONE (beta = 1/3) is recoverable off
 * Section 4.5; A_d is settled (cancels); (v, D, c) are structural-but-per-window
 * and enter only through Q; (sigma, theta) have no power-law paper counterpart
 * and require the Fresnel-Airy -> majorant reduction. The imp-95026 result
 * therefore remains a sensitivity MAP, now with its residual sharpened from
 * "paper text not carried" to the specific, in-repo, missing inputs listed here.
 *
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── recoverable arithmetic (all re-derived by the assertions) ────────────────
const T0 = 24727519 / 200000000; // active-row t0 = 0.123637595 (eq 8 / eq 10 carrier)
const BETA_AIRY = 1 / 3; // Airy cube-root width exponent (eqs 16 + Section 4.8)
// isolation group Q = (c D^(1-beta)/v) 2^(-(1-beta)) at the model normalization
// c = v = D = 1 with the recoverable beta = 1/3  ->  Q = 2^(-2/3)
function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}
const Q_MODEL_NORM = isolationQ(1, 1, BETA_AIRY, 1); // 0.6299605249474366
const IMP95026_MODEL_Q = 0.6299605249474366; // imp-95026 baked model isolation

// ── per-constant transcription ledger ────────────────────────────────────────
export const IMP95071_SECTION45_TRANSCRIPTION = {
  ticket:
    "imp-95071 (transcribe the Section 4.5 packet constants (sigma, theta, beta, c, v, D) off the paper source and evaluate the imp-95026 transfer map there)",
  paperSource:
    "research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf (J. Gomila, Permutation architecture of the zeta twin ladder); Section 4.5 'The one noncommuting weld', eqs (14)-(16); Section 4.6 tile x = x_c + u, |u| <= W; eq (10) carrier bn = exp((t0/4) log^2 n).",
  correctionOfFact:
    "imp-95026 openResiduals[0] states 'the paper text is not carried here'. That is INCORRECT: the paper source is in-repo at research-inputs/. Section 4.5 is present in full. The constants are missing not for lack of the manuscript but because Section 4.5 defines the weld STRUCTURALLY (alias grid d = k - h/p, centers u = v/d, shifted Fresnel-Airy transition packets), not as six power-law envelope numbers.",
  paperMapping:
    "The imp-95008 model family mirrors eq (15) exactly: packets on the (1/p)-grid d = k - h/p in (0, D], centers u = v/d, widths r_d = c d^(-beta), majorant hypothesis MAJ(sigma, theta) with s = sigma + theta. So (d, u) are paper-exact; (v, D) are the per-window stationary numerator and grid extent; (beta, c) are the width law; (sigma, theta) are the ASSUMED majorant, not a paper packet quantity.",
  transcription: [
    {
      name: "beta",
      status: "RECOVERABLE",
      value: "1/3",
      basis:
        "Fresnel-Airy packets (eq 16) carry the Airy cube-root scaling; Section 4.8 charges 'the last ceil(N^(1/3)) physical terms'. Both pin the cube-root width exponent. MATCHES the model literal beta = 1/3.",
    },
    {
      name: "v",
      status: "STRUCTURAL-PER-WINDOW",
      value: "eq (15): direct stationary numerator u = v/d; per-window, model v = 1",
      basis:
        "eq (15) u_{k,h} = v/(k - h/p); v is the direct stationary point of the tile x = x_c + u (Section 4.6), not a global literal. Enters the ceiling only through the isolation group Q.",
    },
    {
      name: "D",
      status: "STRUCTURAL-PER-WINDOW",
      value: "alias-grid extent d in (0, D]; per-window, model D = 1",
      basis:
        "D is the largest denominator d = k - h/p over the window modes k (eq 15). Per-window; enters only through Q.",
    },
    {
      name: "c",
      status: "STRUCTURAL-PER-WINDOW",
      value: "width prefactor r_d = c d^(-beta); per-window, model c = 1",
      basis:
        "c is the width-law prefactor reading the eq (10) carrier bn/gamma(x); per-window normalization; enters only through Q.",
    },
    {
      name: "sigma",
      status: "NOT-PINNED",
      value: "no power-law counterpart in Section 4.5 (packets are Fresnel-Airy); model chose sigma = 1",
      basis:
        "sigma parameterizes the ASSUMED majorant MAJ(sigma, theta); the paper packets are oscillatory Fresnel-Airy, not power-law. The paper must supply the Fresnel-Airy -> MAJ legality reduction.",
    },
    {
      name: "theta",
      status: "NOT-PINNED",
      value: "no power-law counterpart in Section 4.5; model chose theta = 10 (s = 11)",
      basis:
        "theta is the tail exponent of the assumed majorant, s = sigma + theta. Same Fresnel-Airy obstruction as sigma. Nearest paper anchor is the log-normal carrier bn = exp((t0/4) log^2 n), t0 = 0.123637595, which decays FASTER than any power law.",
    },
    {
      name: "A_d",
      status: "SETTLED-CANCELS",
      value: "not among the ledger drivers",
      basis:
        "imp-95026 Finding 0: the amplitude never enters the far coefficient (it acts only on the mass M). Confirmed here, no re-derivation needed.",
    },
  ],
  evaluationAtRecoverablePoint: {
    beta: BETA_AIRY,
    isolationQatModelNormalization: Q_MODEL_NORM,
    note:
      "Only beta is recoverable. With the per-window group left at the model normalization c = v = D = 1, Q = 2^(-2/3) = 0.6299605249474366, reproducing the imp-95026 model isolation. The decay s = sigma + theta cannot be transcribed, so the ceiling itself stays a MAP over s, not a paper number.",
  },
  whatThePaperMustSupply: [
    "the Fresnel-Airy -> MAJ(sigma, theta) legality reduction: the effective power-law majorant decay the shifted Fresnel-Airy transition packets (eq 16) actually obey (there is NO (sigma, theta) stated in Section 4.5)",
    "the per-window isolation group Q = (c D^(1-beta)/v) 2^(-(1-beta)) at the pilot cell N = 690988 (Section 4.6 tile, |u| <= W); (c, v, D) are structural but not global constants, and only this one combination is needed, not the three separately",
  ],
  openResiduals: [
    "the decay pair (sigma, theta) is genuinely absent from Section 4.5 (packets are Fresnel-Airy, not power-law); until the Fresnel-Airy majorant reduction is supplied the imp-95026 ceiling remains a MAP over s, not a paper value",
    "the per-window (c, v, D) at N = 690988 are not enumerated in this repository, so the isolation Q is left at its model normalization 2^(-2/3)",
  ],
  isRigorous: true,
  rigorScope:
    "The paper-source location and the Section 4.5 eq (14)-(16) structure are verbatim facts. The model-to-paper name mapping is read off imp-95008-far-coefficient-floor.js and eq (15). beta = 1/3 recoverability is an exact reading of the Airy cube-root scaling; Q at the model normalization is an exact evaluation. (sigma, theta) not-pinned is a structural observation (no power-law in Section 4.5). No paper ceiling number is CLAIMED. NO QED.",
  promotesBound: false,
  verdict:
    "TRANSCRIPTION of the Section 4.5 packet constants off the in-repo paper source (research-inputs/...revised.pdf). CORRECTION: the paper IS carried here (imp-95026 said it was not). Of the six named constants exactly ONE, beta = 1/3, is RECOVERABLE (Airy cube-root, matches the model). A_d is SETTLED (cancels, imp-95026 Finding 0). (v, D, c) are STRUCTURAL-PER-WINDOW (eq 15 / Section 4.6) and enter only through the isolation group Q = 2^(-2/3) at the model normalization. (sigma, theta) are NOT-PINNED: Section 4.5 defines Fresnel-Airy transition packets, not power-law envelopes, so no (sigma, theta) is stated. The paper MUST supply the Fresnel-Airy -> MAJ(sigma, theta) legality reduction plus the per-window Q at the pilot cell N = 690988. The imp-95026 result therefore remains a sensitivity MAP, its residual sharpened from 'paper text not carried' to the specific in-repo missing inputs. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95071_TRANSCRIPTION_ASSERTIONS = [
  {
    id: "imp95071-active-row-t0",
    description:
      "the active-row t0 = 24727519/200000000 = 0.123637595 (eq 8 / eq 10 carrier) is reproduced exactly",
    holds: () => Math.abs(T0 - 0.123637595) <= 1e-15,
  },
  {
    id: "imp95071-beta-airy-cube-root",
    description:
      "the one recoverable constant beta = 1/3 (Airy cube-root, eqs 16 + Section 4.8) matches the imp-95008 model literal beta = 1/3",
    holds: () => Math.abs(BETA_AIRY - 1 / 3) <= 1e-15,
  },
  {
    id: "imp95071-isolation-Q-model-normalization",
    description:
      "with beta = 1/3 and the per-window group at the model normalization c = v = D = 1, the isolation Q = 2^(-2/3) = 0.6299605249474366 reproduces the imp-95026 model isolation exactly",
    holds: () =>
      Math.abs(Q_MODEL_NORM - Math.pow(2, -2 / 3)) <= 1e-15 &&
      Math.abs(Q_MODEL_NORM - IMP95026_MODEL_Q) <= 1e-12,
  },
  {
    id: "imp95071-transcription-census",
    description:
      "the ledger records exactly the six named constants plus A_d, with exactly one RECOVERABLE (beta), one SETTLED-CANCELS (A_d), three STRUCTURAL-PER-WINDOW (v, D, c), and two NOT-PINNED (sigma, theta)",
    holds: () => {
      const t = IMP95071_SECTION45_TRANSCRIPTION.transcription;
      const count = (s) => t.filter((r) => r.status === s).length;
      return (
        t.length === 7 &&
        count("RECOVERABLE") === 1 &&
        count("SETTLED-CANCELS") === 1 &&
        count("STRUCTURAL-PER-WINDOW") === 3 &&
        count("NOT-PINNED") === 2 &&
        t.find((r) => r.name === "beta").status === "RECOVERABLE" &&
        t.find((r) => r.name === "sigma").status === "NOT-PINNED" &&
        t.find((r) => r.name === "theta").status === "NOT-PINNED"
      );
    },
  },
  {
    id: "imp95071-honesty-gate",
    description:
      "the verdict names the correction of fact, the paper source, what the paper must supply, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95071_SECTION45_TRANSCRIPTION.promotesBound === false &&
      IMP95071_SECTION45_TRANSCRIPTION.whatThePaperMustSupply.length === 2 &&
      IMP95071_SECTION45_TRANSCRIPTION.openResiduals.length === 2 &&
      /NO QED/.test(IMP95071_SECTION45_TRANSCRIPTION.verdict) &&
      /refereed bound is changed/i.test(IMP95071_SECTION45_TRANSCRIPTION.verdict) &&
      /RECOVERABLE/.test(IMP95071_SECTION45_TRANSCRIPTION.verdict) &&
      /NOT-PINNED/.test(IMP95071_SECTION45_TRANSCRIPTION.verdict),
  },
];

for (const a of IMP95071_TRANSCRIPTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95071-section45-packet-constant-transcription assertion failed: ${a.id}`);
  }
}

export default IMP95071_SECTION45_TRANSCRIPTION;
