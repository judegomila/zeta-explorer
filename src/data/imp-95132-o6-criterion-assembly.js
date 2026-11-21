/**
 * imp-95132-o6-criterion-assembly — assessment of obligation O6 (criterion
 * assembly) of the y-thaw 0.17759432 candidate package at y0 = 0.1808.
 *
 * WHAT THIS IS: a dependency map, NOT a closure. O6 is row 12 of the
 * SHARP_WEIGHT_NATIVE_BINDING.md ledger (formalization/y-thaw-01775943/),
 * the step that instantiates the sealed criterion theorem (Cor-3.2-analogue)
 * at (t0 = 129/800, y0 = 113/625) and glues the row-level binding lemma +
 * the stage-2 sweep + obligations O1..O5 into the package statement
 *   Lambda <= t0 + y0^2/2 = 129/800 + 0.1808^2/2 = 0.17759432.
 *
 * ASSESSMENT (honest):
 *  1. O6 carries NO heavy-compute content of its own. It is a logical
 *     composition: instantiate the fixed criterion template at (t0, y0);
 *     the RH-height / Platt-Trudgian input X = 6000000185827 is UNCHANGED
 *     (unchanged X => the criterion's height leg is inherited verbatim, not
 *     re-proved).
 *  2. The ONE O6-specific check is the row-12 y-quarantine: in the sealed
 *     criterion the height y0 enters ONLY through the right-hand value
 *     t0 + y0^2/2. Every substantive y-hypothesis is pushed into O1..O5
 *     (all-y transfer, barrier/winding, E_max budget, tail, site coverage).
 *     Per section 5 of the ledger (row 12) this quarantine holds: the
 *     assembly introduces no NEW y-floor, so it does not re-import the
 *     sealed 0.187272 Dini floor at the assembly level. This reduction is a
 *     PROSE audit, not Lean-checked (named residual below).
 *  3. Consequence — the SURVIVING CONDITIONAL. Two of the five obligation
 *     inputs are CLOSED: O3 (E_max budget) and O5 (site coverage), both
 *     certified in imp-95212-ythaw-o5-o3 under OUR toolchain (mpmath.iv /
 *     Arb-FLINT), not the sealed one. The binding lemma (stage 1, CLOSES,
 *     refereed 2026-09-10) and the sweep (stage 2, our-compile Arb rows) are
 *     also in hand. Hence the assembly fires into Lambda <= 0.17759432 IFF
 *     the three still-open inputs close:  O1 (sharp-mass y-monotonicity),
 *     O2 (barrier/winding at 0.1808), O4 (analytic tail at 0.1808).
 *  4. O6 therefore does NOT close standalone. It is a conditional that
 *     stands on {O1, O2, O4}; once those close (O3, O5 already closed) the
 *     criterion assembly is mechanical. Even then the result is a
 *     candidate-package conditional at OUR-toolchain grade, not a sealed
 *     bound.
 *
 * Changes no bound. 0.17759432 stays a package value, not a bound. NO QED.
 * No refereed bound is changed.
 *
 * Named residual (sub-gap): imp-95132-subgap-o6-template-lean-check — the
 * row-12 y-quarantine (criterion consumes y0 only via the RHS value) is a
 * prose audit; a Lean / referee-checked instantiation of the criterion
 * template at (t0, y0) would upgrade O6 from ASSESSED-REDUCED to
 * template-certified. The package-level closure still waits on O1, O2, O4.
 */

// ── the criterion target (exact) ─────────────────────────────────────────────
export const O6_CRITERION = {
  obligation: 'O6',
  ledgerRow: 12,
  role: 'criterion assembly (Cor-3.2-analogue) at y0 = 0.1808',
  t0: { num: 129, den: 800 }, // 0.16125
  y0: { num: 113, den: 625 }, // 0.1808 exactly
  y0sqOver2: { num: 12769, den: 781250 }, // y0^2 / 2 = 0.01634432 exactly
  candidateValue: 0.17759432, // t0 + y0^2/2
  heightInput: 6000000185827, // X, unchanged from the sealed candidate
  heightInputUnchanged: true,
  // y0 enters the criterion ONLY through the RHS value t0 + y0^2/2; every
  // substantive y-hypothesis is quarantined into O1..O5 (ledger section 5,
  // row 12). Prose audit, not Lean-checked.
  yUseInAssembly: 'RHS-value-only',
  yQuarantineIntoObligations: true,
  yQuarantineGrade: 'prose-audit (ledger section 5 row 12); not Lean-checked',
  reIntroducesSealedDiniFloor: false,
};

// ── the assembly dependency map ─────────────────────────────────────────────
// The criterion theorem consumes, as hypotheses, the row-level binding lemma
// and the sweep (in hand) plus the five package obligations O1..O5.
export const O6_INPUTS = {
  bindingLemma: {
    source: 'stage 1 (SHARP_WEIGHT_NATIVE_BINDING.md)',
    status: 'CLOSES',
    grade: 'prose-proof, refereed 2026-09-10 (S0/S1/S2 sound)',
    inHand: true,
  },
  sweep: {
    source: 'stage 2 (sweep-results/)',
    status: 'COMPLETE (fail-closed clean, min floor 0.062718178029)',
    grade: 'Arb-certified rows under our local compile, not the sealed toolchain',
    inHand: true,
  },
  O1: { role: 'all-y transfer (sharp-mass y-monotonicity)', status: 'OPEN', inHand: false },
  O2: { role: 'barrier/winding slab at bottom edge 0.1808', status: 'OPEN', inHand: false },
  O3: { role: 'E_max budget over y in [0.1808, y_max]', status: 'CLOSED', grade: 'certified-interval, our toolchain (imp-95212)', inHand: true },
  O4: { role: 'analytic tail N > 3840000 at y = 0.1808', status: 'OPEN', inHand: false },
  O5: { role: 'left-edge site coverage x_*(0.1808) in W_690988', status: 'CLOSED', grade: 'certified 3-lane, our toolchain (imp-95212)', inHand: true },
};

// ── the surviving conditional after O3/O5 closure ───────────────────────────
export const O6_SURVIVING_CONDITIONAL = {
  // inputs already in hand: binding lemma + sweep + O3 + O5 (all our-toolchain)
  inHand: ['bindingLemma', 'sweep', 'O3', 'O5'],
  // the assembly fires IFF these three still-open obligations close:
  fireCondition: ['O1', 'O2', 'O4'],
  statement:
    'given the binding lemma (CLOSES), the sweep, and O3 + O5 (both CLOSED, our toolchain), ' +
    'the criterion assembly composes into Lambda <= 0.17759432 IFF O1 AND O2 AND O4 also close',
  o6ClosesStandalone: false, // O6 stands on {O1, O2, O4}
  o6ContentReducesTo: 'template instantiation with RHS-only y-use (assessed-reduced), plus O1 AND O2 AND O4',
  firedResultGrade: 'candidate-package conditional at our-toolchain grade, not a sealed bound',
};

export const IMP_95132_VERDICT = {
  o6: 'ASSESSED-REDUCED — no heavy-compute content; reduces to the row-12 y-quarantine (RHS-only, prose audit) plus the still-open O1, O2, O4; O3 and O5 already closed',
  subGap: 'imp-95132-subgap-o6-template-lean-check',
  obligationsStillOpenForAssembly: ['O1', 'O2', 'O4'],
  changesBound: false,
  packageIsBound: false,
  qed: false,
};

export const IMP_95132_O6_CRITERION_ASSEMBLY = {
  id: 'imp-95132-o6-criterion-assembly',
  title:
    'O6 criterion-assembly assessment at y0 = 0.1808: dependency map + surviving conditional (fires iff O1 AND O2 AND O4 close; O3, O5 closed; y-use RHS-only)',
  criterion: O6_CRITERION,
  inputs: O6_INPUTS,
  survivingConditional: O6_SURVIVING_CONDITIONAL,
  verdict: IMP_95132_VERDICT,
  note: 'formalization/y-thaw-01775943/SHARP_WEIGHT_NATIVE_BINDING.md section 5 (row 12) + section 6 (O6)',
};

// ── assertions (import-light; exact rationals shadowed by doubles) ───────────
export const IMP_95132_ASSERTIONS = [
  {
    id: 'imp-95132-o6-criterion-arithmetic',
    holds: () => {
      const t0 = 129 / 800;
      const y0 = 113 / 625;
      const y0sqOver2 = (113 * 113) / (625 * 625) / 2;
      return (
        Math.abs(y0 - 0.1808) < 1e-15 &&
        113 * 113 === 12769 &&
        625 * 625 * 2 === 781250 &&
        Math.abs(y0sqOver2 - 12769 / 781250) < 1e-18 &&
        Math.abs(t0 + y0sqOver2 - 0.17759432) < 1e-15 &&
        Math.abs(t0 + y0sqOver2 - O6_CRITERION.candidateValue) < 1e-15
      );
    },
    why: 'The criterion target is exact: t0 + y0^2/2 = 129/800 + (113/625)^2/2 = 0.16125 + 0.01634432 = 0.17759432, with y0 = 113/625 = 0.1808 and y0^2/2 = 12769/781250 exactly — y0 enters the assembly only through this RHS value.',
  },
  {
    id: 'imp-95132-o6-input-partition',
    holds: () => {
      const inputs = O6_INPUTS;
      const open = ['O1', 'O2', 'O4'].every((k) => inputs[k].status === 'OPEN' && inputs[k].inHand === false);
      const closed = ['O3', 'O5'].every((k) => inputs[k].status === 'CLOSED' && inputs[k].inHand === true);
      return (
        open &&
        closed &&
        inputs.bindingLemma.inHand === true &&
        inputs.sweep.inHand === true &&
        inputs.bindingLemma.status === 'CLOSES'
      );
    },
    why: 'Dependency partition: the binding lemma (CLOSES) and the sweep are in hand; of the five package obligations O3 and O5 are CLOSED (imp-95212) while O1, O2, O4 stay OPEN — so the assembly still lacks exactly three of its inputs.',
  },
  {
    id: 'imp-95132-o6-surviving-conditional',
    holds: () => {
      const sc = O6_SURVIVING_CONDITIONAL;
      return (
        sc.fireCondition.length === 3 &&
        ['O1', 'O2', 'O4'].every((k) => sc.fireCondition.includes(k)) &&
        sc.inHand.includes('O3') &&
        sc.inHand.includes('O5') &&
        sc.o6ClosesStandalone === false &&
        IMP_95132_VERDICT.obligationsStillOpenForAssembly.length === 3
      );
    },
    why: 'The surviving conditional after O3/O5 closure: with the binding lemma + sweep + O3 + O5 in hand, the assembly fires into Lambda <= 0.17759432 iff O1 AND O2 AND O4 also close — O6 does not close standalone, it stands on those three.',
  },
  {
    id: 'imp-95132-o6-y-quarantine-and-height',
    holds: () =>
      O6_CRITERION.yUseInAssembly === 'RHS-value-only' &&
      O6_CRITERION.yQuarantineIntoObligations === true &&
      O6_CRITERION.reIntroducesSealedDiniFloor === false &&
      O6_CRITERION.heightInputUnchanged === true &&
      O6_CRITERION.heightInput === 6000000185827,
    why: 'The O6-specific check is the row-12 y-quarantine: y0 enters the criterion only via the RHS value t0 + y0^2/2, so the assembly re-imports no sealed 0.187272 Dini floor; and the height input X = 6000000185827 is unchanged, so the criterion height leg is inherited, not re-proved (prose audit, not Lean-checked).',
  },
  {
    id: 'imp-95132-honest-scope',
    holds: () =>
      IMP_95132_VERDICT.changesBound === false &&
      IMP_95132_VERDICT.packageIsBound === false &&
      IMP_95132_VERDICT.qed === false &&
      typeof IMP_95132_VERDICT.subGap === 'string' &&
      IMP_95132_VERDICT.subGap.length > 0 &&
      O6_SURVIVING_CONDITIONAL.firedResultGrade.includes('not a sealed bound'),
    why: 'Scope discipline: O6 is assessed as a dependency map, not closed; 0.17759432 stays a package value, not a bound; a fired assembly would be an our-toolchain conditional, not a sealed bound; a named sub-gap (Lean/referee template check) is carried; no QED.',
  },
];

for (const a of IMP_95132_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95132-o6-criterion-assembly assertion failed: ${a.id}`);
  }
}

export default IMP_95132_O6_CRITERION_ASSEMBLY;
