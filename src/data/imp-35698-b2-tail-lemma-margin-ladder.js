/**
 * @module imp-35698-b2-tail-lemma-margin-ladder
 *
 * imp-35698 (numerical, measurement): the COMPLEMENT of imp-35697. imp-35653
 * Part B splits S_barrier into (B1) a FINITE winding check on [T_PT, T_PT + Delta]
 * -- whose cost imp-35697 tabulated -- and (B2) the ANALYTIC tail lemma
 * |A_t + B_t| > |C_t| for ALL x >= T_PT + Delta (the non-finite, breakthrough-tier
 * piece; imp-35674). B2 names the Polymath15 mollified-triangle margin but its
 * margin is never measured. This module MEASURES a transparent normalized-margin
 * proxy across a height ladder above T_PT = 3e12 and reports the smallest
 * transition width Delta at which the margin first clears a comfort threshold --
 * i.e. where the finite / non-finite handoff sits.
 *
 * THE PROXY (transparent, SCHEMATIC absolute level; robust SCALING).
 * The Polymath15 tail inequality, normalized by the dominant n = 1 main-sum term,
 * reads  m(x) = |A_t + B_t| / |A_t^(1)|  -  |C_t| / |A_t^(1)|  =  1 - E(x),
 * where the mollified lower bound keeps |A_t + B_t| at the dominant term (B_t / A_t
 * away from -1) and E(x) is the total explicit-error ratio C_t / |A_t^(1)|. The
 * error ratio decays with the retained-term count N(x) = floor(sqrt(x / 4 pi)):
 * more retained terms -> smaller truncation error. We model the decay by the
 * established sqrt scaling (imp-35674): E(x) = E0 * sqrt(X0 / x), equivalently
 * E0 * N(X0) / N(x), anchored at the illustrative Polymath15 barrier X0 = 6e10
 * where the barrier was cleared with a mild normalized deficit E0 = 0.2
 * (barrier margin m = 0.8). The ABSOLUTE anchor E0 is SCHEMATIC (not Polymath15s
 * true constants); the ROBUST content is the monotone 1 - const/sqrt(x) shape and
 * hence the FINITE crossover width, not the exact deficit level.
 *
 * THE LADDER (baked below). Normalized margin m(x) = 1 - E0 sqrt(X0 / x) at
 * x = T_PT + Delta:
 *   Delta = 0     ->  m ~ 0.9717   (already clears 0.9 at the base T_PT)
 *   Delta = 1e12  ->  m ~ 0.9755
 *   Delta = 1e13  ->  m ~ 0.9864
 *   Delta = 1e14  ->  m ~ 0.9952   (clears 0.99)
 *   Delta = 1e15  ->  m ~ 0.9985
 * The margin is MONOTONE increasing in height and rises like 1 - const/sqrt(x).
 *
 * THE HANDOFF (crossover width). Solving m(x) >= m_comfort gives the closed form
 * x_c = X0 (E0 / (1 - m_comfort))^2, so Delta_c = max(0, x_c - T_PT):
 *   m_comfort = 0.9   ->  x_c = 2.4e11  ->  Delta = 0     (clear at the base)
 *   m_comfort = 0.99  ->  x_c = 2.4e13  ->  Delta ~ 2.1e13  (~7x T_PT above)
 *   m_comfort = 0.999 ->  x_c = 2.4e15  ->  Delta ~ 2.40e15
 * So under the forward-t Polymath15 scaling the margin is ALREADY comfortable at
 * a mild threshold at the base T_PT itself, and a stringent threshold pushes the
 * finite / non-finite handoff to a FINITE Delta of order T_PT. The handoff sits
 * near the base; nothing about the margin comfort forces a large transition width.
 *
 * WHAT THIS SETTLES / DOES NOT. It sizes the B2 margin-comfort question and shows
 * the crossover width is FINITE (small at mild comfort, order T_PT at stringent).
 * It does NOT discharge B2: the tail lemma is the UNIFORM-in-x positivity of the
 * margin for ALL x >= T_PT + Delta (a semi-infinite quantifier, not a sampled
 * ladder), and it is gated on the imp-35674 Part C heat-sign caveat -- the repo
 * Gaussian-convolution proxy is de Bruijn flow at NEGATIVE time (t = -4 tau_repo),
 * the HARDER side, where the margin is strictly TIGHTER than the forward-t
 * Polymath15 barrier this proxy models. So these crossover widths are OPTIMISTIC:
 * the true widths under the operative parameter are larger, or the margin can fail.
 *
 * Measurement only; ports nothing; proves no tail lemma; establishes no positivity;
 * derives no remainder; changes no bound; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643),
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED;
 * imp-35653 stays breakthrough-tier OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35697-winding-barrier-mesh-cost-ladder (the complementary FINITE B1 winding cost tabulation)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (scopes the B2 / W3 tail lemma, X0, N(x), and the heat-sign caveat)
 * @see imp-35653-sbarrier-finite-check-porting-scope (the B1 / B2 decomposition)
 * Literature: Polymath15 (2019, mollified triangle inequality tail bound); Platt-Trudgian
 * 2021 (RH verified to T_PT = 3e12, Lambda <= 0.2).
 */

import { IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE } from './imp-35674-w3-tail-lemma-polymath15-scope.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const X0 = 6e10; // illustrative Polymath15 barrier height (imp-35674)
const E0 = 0.2; // SCHEMATIC normalized error deficit at the barrier (barrier margin m = 0.8)

// Retained-term count of the Polymath15 effective sums (imp-35674): N(x) = floor(sqrt(x / 4 pi)).
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));

// Normalized total-error ratio proxy: decays like the retained-term count, E(x) = E0 sqrt(X0 / x).
const errorRatio = (x) => E0 * Math.sqrt(X0 / x);
// Normalized Polymath15 mollified-triangle margin: m(x) = 1 - E(x).
const margin = (x) => 1 - errorRatio(x);

// Crossover height where the margin first reaches m_comfort: x_c = X0 (E0 / (1 - m_comfort))^2.
const crossoverHeight = (mComfort) => X0 * Math.pow(E0 / (1 - mComfort), 2);
// Transition width above T_PT needed for that comfort (0 if already clear at the base).
const crossoverDelta = (mComfort) => Math.max(0, crossoverHeight(mComfort) - T_PT);

const DELTA_LADDER = [0, 1e12, 1e13, 1e14, 1e15];

// Full tabulation: one row per Delta above T_PT.
const TABLE = DELTA_LADDER.map((Delta) => {
  const x = T_PT + Delta;
  return {
    Delta,
    height: x,
    errorRatio: +errorRatio(x).toPrecision(6),
    margin: +margin(x).toPrecision(6),
  };
});

// Margin at the base T_PT itself (Delta = 0).
const MARGIN_AT_TPT = margin(T_PT); // ~0.971716

// Comfort-threshold handoff widths.
const COMFORT_LADDER = [0.9, 0.99, 0.999];
const HANDOFF = COMFORT_LADDER.map((mc) => ({
  mComfort: mc,
  crossoverHeight: +crossoverHeight(mc).toPrecision(6),
  crossoverDelta: +crossoverDelta(mc).toPrecision(6),
}));

// Cross-check the sqrt scaling against the exact retained-term-count ratio N(X0)/N(x) at T_PT.
const E_VIA_SQRT_AT_TPT = E0 * Math.sqrt(X0 / T_PT);
const E_VIA_NRATIO_AT_TPT = E0 * (N_TERMS(X0) / N_TERMS(T_PT));
const NRATIO_VS_SQRT_REL = Math.abs(E_VIA_NRATIO_AT_TPT - E_VIA_SQRT_AT_TPT) / E_VIA_SQRT_AT_TPT; // ~1e-5

export const IMP35698_B2_TAIL_LEMMA_MARGIN_LADDER = {
  id: 'imp-35698',
  proofSection: 'S-frontier',
  question:
    'What is the imp-35653 B2 tail-lemma normalized margin |A + B| - |C| (Polymath15 mollified triangle inequality) ' +
    'across a height ladder above T_PT = 3e12, and at what transition width Delta does the closed-form tail ' +
    'inequality first become comfortably satisfied?',
  method:
    'Normalize the Polymath15 tail inequality by the dominant n = 1 main-sum term: m(x) = 1 - E(x), where the ' +
    'mollified lower bound holds |A + B| at the dominant term (B/A away from -1) and E(x) = C_t / |A^(1)| is the ' +
    'total explicit-error ratio. Model the error decay by the established retained-term scaling (imp-35674) ' +
    'E(x) = E0 sqrt(X0 / x) = E0 N(X0)/N(x), N(x) = floor(sqrt(x / 4 pi)), anchored at the illustrative Polymath15 ' +
    'barrier X0 = 6e10 with a SCHEMATIC deficit E0 = 0.2. Tabulate m over Delta in {0, 1e12, 1e13, 1e14, 1e15} and ' +
    'solve m(x) >= m_comfort in closed form x_c = X0 (E0/(1 - m_comfort))^2 for the handoff width Delta_c.',
  measurement: {
    T_PT, // 3e12 (Platt-Trudgian verified height)
    X0, // 6e10 (illustrative Polymath15 barrier)
    E0, // 0.2 SCHEMATIC normalized barrier deficit (barrier margin 0.8)
    marginAtTPT: +MARGIN_AT_TPT.toPrecision(6), // 0.971716 (clears 0.9 at the base)
    deltaLadder: DELTA_LADDER,
    table: TABLE,
    comfortLadder: COMFORT_LADDER,
    handoff: HANDOFF, // crossover height and Delta per comfort threshold
    nRatioVsSqrtRelAtTPT: +NRATIO_VS_SQRT_REL.toExponential(3), // ~1e-5 (N-ratio agrees with sqrt scaling)
    scalingLaw: 'm(x) = 1 - E0 sqrt(X0 / x); crossover x_c = X0 (E0 / (1 - m_comfort))^2 -- monotone, FINITE handoff',
  },
  findings:
    'The normalized B2 tail-lemma margin m(x) = 1 - E0 sqrt(X0/x) is MONOTONE increasing in height, rising like ' +
    '1 - const/sqrt(x) as the retained-term count N(x) = floor(sqrt(x/4pi)) grows. At the base T_PT = 3e12 it is ' +
    'already ~0.972 (clears a mild 0.9 comfort at Delta = 0); a stringent 0.99 comfort is reached at x_c ~ 2.4e13, ' +
    'i.e. Delta ~ 2.1e13 (~7x T_PT above), and 0.999 at Delta ~ 2.40e15. So the finite / non-finite HANDOFF sits ' +
    'near the base: nothing about the margin comfort forces a large transition width; the crossover Delta is FINITE ' +
    '(zero at mild comfort, order T_PT at stringent). This sizes the B2 margin-comfort question ONLY. It does NOT ' +
    'discharge B2: the tail lemma is the UNIFORM-in-x positivity of the margin for ALL x >= T_PT + Delta (a ' +
    'semi-infinite quantifier, not this sampled ladder), and it is gated on the imp-35674 Part C heat-sign caveat -- ' +
    'the repo Gaussian-convolution proxy is de Bruijn flow at NEGATIVE time (t = -4 tau_repo), the HARDER side, where ' +
    'the margin is strictly TIGHTER than the forward-t Polymath15 barrier this proxy models, so these crossover ' +
    'widths are OPTIMISTIC. The absolute margin level is schematic (anchor E0); the robust content is the monotone ' +
    'sqrt shape and the FINITE crossover width.',
  marginIsMonotoneIncreasing: true,
  crossoverWidthIsFinite: true,
  absoluteLevelIsSchematic: true,
  doesNotDischargeB2: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). The imp-35653 B2 tail-lemma normalized margin, modeled as m(x) = 1 - E0 sqrt(X0/x) ' +
    'with the imp-35674 retained-term scaling (E0 = 0.2 SCHEMATIC anchor at X0 = 6e10), is monotone increasing in ' +
    'height: ~0.972 at the base T_PT = 3e12, ~0.986 at Delta = 1e13, ~0.995 at Delta = 1e14. The comfort handoff ' +
    'x_c = X0 (E0/(1 - m_comfort))^2 gives Delta = 0 for m_comfort = 0.9 (already clear at the base), Delta ~ 2.1e13 ' +
    'for 0.99, and Delta ~ 2.40e15 for 0.999 -- a FINITE crossover width that sits near the base. This sizes the ' +
    'margin-comfort question complementary to the imp-35697 finite B1 winding cost; it ports nothing and proves no ' +
    'tail lemma. It does NOT discharge B2: the lemma is the UNIFORM-in-x positivity for ALL x >= T_PT + Delta ' +
    '(semi-infinite, not a sampled ladder), gated on the imp-35674 Part C heat-sign caveat -- the repo proxy is de ' +
    'Bruijn flow at NEGATIVE time, the HARDER side, where the margin is strictly TIGHTER, so these widths are ' +
    'OPTIMISTIC. Changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), ' +
    'E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35653 stays breakthrough-tier ' +
    'OPEN; NO QED. No refereed bound is changed.',
  citation:
    'imp-35697 (complementary FINITE B1 winding cost tabulation); imp-35674 (B2 / W3 tail-lemma scope, X0, N(x), ' +
    'heat-sign caveat); imp-35653 (B1 / B2 decomposition); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 ' +
    '(E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Polymath15 (2019, mollified triangle inequality ' +
    'tail bound); Platt-Trudgian 2021 (RH verified to T_PT = 3e12, Lambda <= 0.2).',
};

export const IMP35698_B2_TAIL_LEMMA_MARGIN_LADDER_ASSERTIONS = [
  {
    // (1) anchors match imp-35674: X0 = 6e10 and the retained-term-count model N(x) = floor(sqrt(x/4pi)).
    id: 'imp35698-anchors-match-imp35674',
    description: 'X0 = 6e10 and N(x) = floor(sqrt(x/4pi)) reproduce the imp-35674 re-anchoring constants',
    holds: () => {
      const r = IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.reAnchoringConstants;
      return (
        X0 === r.x0Polymath15Illustrative &&
        N_TERMS(T_PT) === r.retainedTermsAtTPT &&
        N_TERMS(X0) === r.retainedTermsAtPolymath15Illustrative
      );
    },
  },
  {
    // (2) the margin is monotone increasing in height across the ladder.
    id: 'imp35698-margin-monotone-increasing',
    description: 'm(x) = 1 - E0 sqrt(X0/x) is monotone increasing across the height ladder',
    holds: () => {
      for (let i = 1; i < TABLE.length; i++) {
        if (!(TABLE[i].margin > TABLE[i - 1].margin)) return false;
      }
      return TABLE.every((row) => row.margin > 0 && row.margin < 1);
    },
  },
  {
    // (3) the base margin at T_PT reproduces 1 - E0 sqrt(X0/T_PT) ~ 0.9717 (clears mild 0.9).
    id: 'imp35698-base-margin-at-tpt',
    description: 'margin at T_PT reproduces 1 - E0 sqrt(X0/T_PT) ~ 0.9717 and clears a 0.9 comfort',
    holds: () =>
      Math.abs(MARGIN_AT_TPT - (1 - E0 * Math.sqrt(X0 / T_PT))) < 1e-12 &&
      MARGIN_AT_TPT > 0.97 && MARGIN_AT_TPT < 0.972,
  },
  {
    // (4) the closed-form handoff: Delta = 0 at 0.9, ~2.1e13 at 0.99, ~2.40e15 at 0.999.
    id: 'imp35698-handoff-crossover-delta',
    description: 'crossover x_c = X0 (E0/(1-mc))^2 gives Delta = 0 at 0.9, ~2.1e13 at 0.99, ~2.40e15 at 0.999',
    holds: () => {
      const d90 = crossoverDelta(0.9);
      const d99 = crossoverDelta(0.99);
      const d999 = crossoverDelta(0.999);
      return (
        d90 === 0 &&
        d99 > 2.0e13 && d99 < 2.2e13 &&
        d999 > 2.3e15 && d999 < 2.5e15 &&
        Math.abs(crossoverHeight(0.99) - X0 * Math.pow(E0 / 0.01, 2)) < 1
      );
    },
  },
  {
    // (5) the sqrt scaling agrees with the exact retained-term-count ratio N(X0)/N(x) to ~1e-4.
    id: 'imp35698-nratio-agrees-with-sqrt',
    description: 'E0 sqrt(X0/T_PT) agrees with E0 N(X0)/N(T_PT) to ~1e-4 (retained-term scaling is faithful)',
    holds: () => NRATIO_VS_SQRT_REL > 0 && NRATIO_VS_SQRT_REL < 1e-4,
  },
  {
    // (6) honesty gate: measurement only, does NOT discharge B2, no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35698-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, does not discharge B2 (uniform quantifier + heat-sign caveat stay), changes no bound, imp-35653 OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35698_B2_TAIL_LEMMA_MARGIN_LADDER;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.doesNotDischargeB2 === true &&
        r.absoluteLevelIsSchematic === true &&
        /UNIFORM-in-x/.test(r.verdict) &&
        /NEGATIVE time/.test(r.verdict) &&
        /imp-35653 stays breakthrough-tier OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35698_B2_TAIL_LEMMA_MARGIN_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35698-b2-tail-lemma-margin-ladder assertion failed: ${a.id}`);
  }
}
