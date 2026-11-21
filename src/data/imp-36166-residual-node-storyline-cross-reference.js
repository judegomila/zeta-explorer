/**
 * @module imp-36166-residual-node-storyline-cross-reference
 * @fileoverview imp-36166 -- read-only cross-reference NARRATIVE assembling the
 *   Krawczyk residual-node width storyline for a reader who lands on any one of its
 *   three constituent modules without the others: (1) the imp-35969 bit-level
 *   nextafter OUTWARD-ROUNDING surrogate width of the residual node
 *   [F(m)] = [m] - [K log T0(m)], self-flagged as "surrogate, NOT a machine
 *   certificate", (2) the imp-36017 a-priori correctly-rounded directed-rounding
 *   LAYER-model width, which finds the imp-35969 surrogate OVER-estimates it by an
 *   a-independent factor converging to exactly 2x, and (3) the imp-36066
 *   honest-status verdict that BOTH figures are MODELS -- not the imp-34687a
 *   directed-rounding layer itself (UNIMPLEMENTED) -- so the imp-34714a Krawczyk
 *   existence/uniqueness sub-gap STAYS OPEN. Assembly / cross-reference ONLY:
 *   derives nothing new, closes nothing, discharges no gap, respects the imp-2519
 *   no-overclaim guard, NO QED.
 *
 *   THE ARC (imports each stage verbatim from its source module)
 *   --------------------------------------------------------------
 *   Stage 1 -- MEASURED (surrogate): imp-35969 evaluates the residual node with a
 *   bit-level nextafter outward-rounding surrogate; width ~ a few ULP of the operand
 *   m, a-independent, far below the eps_mach/a dG envelope. Self-flagged NOT a
 *   machine certificate.
 *   Stage 2 -- MEASURED (layer-vs-surrogate ratio): imp-36017 builds a SECOND,
 *   a-priori correctly-rounded directed-rounding LAYER model of the same op-DAG and
 *   finds the imp-35969 surrogate over-estimates it, the ratio converging to exactly
 *   2.0 up the height axis -- the surrogate is CONSERVATIVE, never under-estimates.
 *   Stage 3 -- HONEST STATUS (the ceiling): imp-36066 states plainly that NEITHER
 *   figure is a machine certificate -- both are double-precision MODELS of what the
 *   imp-34687a directed-rounding layer would emit, that layer remains UNIMPLEMENTED,
 *   and imp-34714a (Krawczyk existence/uniqueness) STAYS OPEN.
 *   Stage 4 -- REFINEMENT (the a-scope): imp-36153 found the Stage-2 "a-independent
 *   2x" ratio is the a -> 0 (ULP-floor) reading ONLY -- it DRIFTS monotonically to
 *   exactly 1.0 as the certificate half-width a grows past the local ULP scale.
 *   Nothing above is threatened (the surrogate stays conservative, ratio >= 1, at
 *   every a); this only scopes WHERE the clean 2x reading holds.
 *
 *   WHAT IS DERIVED VS STILL-OPEN (the clarification this note exists to state)
 *   ------------------------------------------------------------------------
 *   DERIVED (measured): the imp-35969 surrogate width figure; the imp-36017
 *   surrogate-over-layer ratio (a-independent, -> exactly 2x); the imp-36066
 *   restatement that both are models, not a certificate.
 *   STILL OPEN: the imp-34687a directed-rounding layer (unimplemented); the
 *   imp-34714a Krawczyk existence/uniqueness sub-gap; any certified interval for the
 *   residual node. None of the MEASURED facts above discharge the OPEN ones; the arc
 *   runs from a surrogate measurement to a tighter model comparison to an explicit
 *   honest ceiling, with the missing ingredient named precisely (an unimplemented
 *   layer, not a numeric gap).
 *
 *   @see src/data/imp-35969-krawczyk-residual-directed-rounding-width.js (Stage 1 source: nextafter surrogate width)
 *   @see src/data/imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy.js (Stage 2 source: a-priori LAYER-model width and the 2x ratio)
 *   @see src/data/imp-36066-residual-node-no-machine-certificate-honest-status.js (Stage 3 source: honest-status verdict that both are models)
 *   @see src/data/imp-36153-krawczyk-residual-surrogate-layer-ratio-a-dependence.js (Stage 4 source: refines the "a-independent 2x" to an a -> 0 / ULP-floor-only reading)
 *   @see src/data/imp-34687-crossover-interval-arithmetic-scope.js (the directed-rounding layer this arc's models stand in for; sub-gap imp-34687a unimplemented)
 *   @see src/data/imp-34714-krawczyk-existence-uniqueness-lemma.js (Krawczyk lemma; sub-gap imp-34714a open)
 *
 *   Ticket: imp-36166 (content, low). Note only; imports source verdicts verbatim;
 *   changes no bound; NO QED; no refereed bound is changed.
 */

import { IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH } from './imp-35969-krawczyk-residual-directed-rounding-width.js';
import { IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY } from './imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy.js';
import { IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS } from './imp-36066-residual-node-no-machine-certificate-honest-status.js';
import { IMP36153_KRAWCZYK_RESIDUAL_SURROGATE_LAYER_RATIO_A_DEPENDENCE } from './imp-36153-krawczyk-residual-surrogate-layer-ratio-a-dependence.js';

const SURROGATE = IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH;
const LAYER_DISCREPANCY = IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY;
const HONEST_STATUS = IMP36066_RESIDUAL_NODE_NO_MACHINE_CERTIFICATE_HONEST_STATUS;
const A_DEPENDENCE = IMP36153_KRAWCZYK_RESIDUAL_SURROGATE_LAYER_RATIO_A_DEPENDENCE;

export const IMP36166_RESIDUAL_NODE_STORYLINE_CROSS_REFERENCE = Object.freeze({
  id: 'imp-36166',
  title:
    'Cross-reference narrative: the Krawczyk residual-node storyline from the imp-35969 nextafter surrogate ' +
    'width, through the imp-36017 a-priori LAYER-model width and its a-independent 2x surrogate-over-layer ' +
    'ratio, to the imp-36066 honest-status verdict that both are MODELS with imp-34714a OPEN and imp-34687a ' +
    'UNIMPLEMENTED',

  storyline: Object.freeze([
    Object.freeze({
      stage: 1,
      name: 'imp-35969 nextafter surrogate width',
      state: 'MEASURED (surrogate)',
      statement:
        'A bit-level nextafter (nextUp/nextDown) outward-rounding surrogate evaluates the residual node ' +
        '[F(m)] = [m] - [K log T0(m)]: width ~ ' +
        SURROGATE.measurement.width_at_N_cross.toExponential(3) +
        ' at m = N_cross, a small nonzero interval, a-independent, far below the eps_mach/a dG envelope. ' +
        'Self-flagged: "MEASUREMENT / surrogate, NOT a machine certificate."',
      source: 'imp-35969',
    }),
    Object.freeze({
      stage: 2,
      name: 'imp-36017 layer-vs-surrogate discrepancy',
      state: 'MEASURED (ratio)',
      statement:
        'A second, a-priori correctly-rounded directed-rounding LAYER model of the identical op-DAG gives a ' +
        'width ~ ' +
        LAYER_DISCREPANCY.measurement.layer_width_at_N_cross.toExponential(3) +
        ' at N_cross; the imp-35969 surrogate over-estimates it, ratio ~ ' +
        LAYER_DISCREPANCY.measurement.ratio_at_N_cross.toFixed(3) +
        ' at N_cross converging to exactly ' +
        LAYER_DISCREPANCY.measurement.ratio_at_top.toFixed(4) +
        ' up the height axis -- a-independent, the surrogate is conservative and never under-estimates.',
      source: 'imp-36017',
    }),
    Object.freeze({
      stage: 3,
      name: 'imp-36066 honest-status ceiling',
      state: 'HONEST STATUS (the ceiling)',
      statement:
        'Neither the surrogate width nor the layer-model width is a machine certificate: both are ' +
        'double-precision MODELS of what the imp-34687a directed-rounding layer would emit. That layer ' +
        'REMAINS UNIMPLEMENTED and the imp-34714a Krawczyk existence/uniqueness sub-gap STAYS OPEN.',
      source: 'imp-36066',
    }),
    Object.freeze({
      stage: 4,
      name: 'imp-36153 a-scope refinement',
      state: 'REFINEMENT (the a-scope)',
      statement:
        'The Stage-2 "a-independent 2x" ratio is the a -> 0 (tight-certificate / ULP-floor) reading ONLY: ' +
        'sweeping the certificate half-width a directly, the ratio DRIFTS strictly monotonically to exactly ' +
        '1.0 (~' +
        A_DEPENDENCE.measurement.ratio_at_a_1.toFixed(4) +
        ' by a=1 at N_cross) as a grows past the local ULP scale, because the shared propagated-input width ' +
        'dilutes the per-op rounding-slack gap. For any macroscopic a >> ULP(N) the 2x conservatism headroom ' +
        'shrinks to zero; the surrogate stays conservative (ratio >= 1) at every a -- nothing above is ' +
        'threatened, only scoped.',
      source: 'imp-36153',
    }),
  ]),

  derivedVsOpen: Object.freeze({
    derived: Object.freeze([
      'imp-35969 nextafter surrogate width of the residual node (a-independent, small nonzero)',
      'imp-36017 surrogate-over-layer ratio (a-independent, converges to exactly 2x up the axis)',
      'imp-36066 restatement that both figures are models, not a certificate',
      'imp-36153 a-scope refinement: the 2x ratio is an a -> 0 / ULP-floor reading, drifting to 1.0 for macroscopic a',
    ]),
    open: Object.freeze([
      'The imp-34687a directed-rounding layer itself (unimplemented)',
      'The imp-34714a Krawczyk existence/uniqueness sub-gap',
      'Any certified interval for the residual node [F(m)] = [m] - [K log T0(m)]',
    ]),
    note:
      'None of the MEASURED facts discharge any of the OPEN ones; the arc runs from a surrogate measurement ' +
      'to a tighter model comparison to an explicit honest ceiling, with the missing ingredient named ' +
      'precisely as an unimplemented layer, not a numeric gap.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesImp34714a: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only cross-reference narrative assembling the imp-35969, imp-36017, and imp-36066 verdicts into ' +
      'one storyline plus an explicit derived-vs-open list. Imports each stage verbatim; derives nothing new; ' +
      'imp-34714a stays OPEN; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36166_RESIDUAL_NODE_STORYLINE_CROSS_REFERENCE_ASSERTIONS = [
  {
    id: 'imp36166-storyline-has-four-stages-in-order',
    why: 'The arc must record exactly the four stages (surrogate, layer ratio, honest ceiling, a-scope refinement) in narrative order.',
    holds: () => {
      const s = IMP36166_RESIDUAL_NODE_STORYLINE_CROSS_REFERENCE.storyline;
      return s.length === 4 && s[0].stage === 1 && s[1].stage === 2 && s[2].stage === 3 && s[3].stage === 4;
    },
  },
  {
    id: 'imp36166-a-scope-refinement-present',
    why: 'imp-36153 refined the Stage-2 "a-independent 2x" to an a -> 0 / ULP-floor-only reading; the arc ' +
         'must carry Stage 4 stating the ratio drifts to 1.0 for macroscopic a.',
    holds: () => {
      const s4 = IMP36166_RESIDUAL_NODE_STORYLINE_CROSS_REFERENCE.storyline[3];
      return s4.source === 'imp-36153' && /drifts/i.test(s4.statement) && /macroscopic/.test(s4.statement);
    },
  },
  {
    id: 'imp36166-ratio-matches-source-verdict',
    why: 'The Stage-2 ratio statement must reproduce the imp-36017 source measurement verbatim (converges to ' +
         'exactly 2x), not a re-derived or drifted paraphrase.',
    holds: () =>
      Math.abs(LAYER_DISCREPANCY.measurement.ratio_at_top - 2) < 1e-6 &&
      IMP36166_RESIDUAL_NODE_STORYLINE_CROSS_REFERENCE.storyline[1].statement.includes(
        LAYER_DISCREPANCY.measurement.ratio_at_top.toFixed(4),
      ),
  },
  {
    id: 'imp36166-honest-status-matches-source',
    why: 'The Stage-3 statement must agree with the imp-36066 source verdict that neither figure is a machine ' +
         'certificate and that imp-34714a stays open.',
    holds: () =>
      HONEST_STATUS.honestCaveat.isProof === false &&
      /imp-34714a/.test(HONEST_STATUS.honestCaveat.subGap) &&
      /STAYS OPEN/.test(IMP36166_RESIDUAL_NODE_STORYLINE_CROSS_REFERENCE.storyline[2].statement),
  },
  {
    id: 'imp36166-derived-vs-open-lists-nonempty-and-disjoint',
    why: 'The derived and open lists must both be non-empty and share no identical entry, or the ' +
         'derived-vs-open clarification this ticket exists to provide would be vacuous or contradictory.',
    holds: () => {
      const d = IMP36166_RESIDUAL_NODE_STORYLINE_CROSS_REFERENCE.derivedVsOpen;
      const overlap = d.derived.some((x) => d.open.includes(x));
      return d.derived.length > 0 && d.open.length > 0 && !overlap;
    },
  },
  {
    id: 'imp36166-honest-no-closure-no-qed',
    why: 'Mandatory honesty: an ASSEMBLY note that closes NOTHING, discharges no gap, keeps imp-34714a OPEN, ' +
         'carries NO RH verdict, no refereed bound is changed. If any flip the module over-claims.',
    holds: () => {
      const h = IMP36166_RESIDUAL_NODE_STORYLINE_CROSS_REFERENCE.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesImp34714a === false &&
        h.derivesAnythingNew === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36166_RESIDUAL_NODE_STORYLINE_CROSS_REFERENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36166-residual-node-storyline-cross-reference assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36166_RESIDUAL_NODE_STORYLINE_CROSS_REFERENCE;
