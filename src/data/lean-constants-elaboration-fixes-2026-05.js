/**
 * @module data/lean-constants-elaboration-fixes-2026-05
 * @fileoverview imp-1114 — closes imp-1095-sub-elaboration-fixes. imp-1095
 * Phase 1 ran the first LIVE `lake build` and Constants.lean FAILED with 4
 * real elaboration errors that the static-parse artefact could not see. This
 * file records each per-error-line fix (before/after/errorClass/rationale),
 * the elaborator-verified per-module rebuild verdict, and 5 tripwires.
 *
 * ALL FOUR errors were reproduced and fixed against the pinned toolchain
 * (Lean v4.9.0 / Lake v5.0.0 / mathlib v4.9.0) and EACH fix was confirmed by
 * re-running `lake build LambdaAttack.Constants` until it elaborated clean.
 * Constants.lean now BUILDS (only the pre-existing, separately-tracked
 * skp-512a `sorry` at line 128 remains — explicitly out of imp-1114 scope).
 *
 * HONEST PARTIAL on the cascade goal: imp-1114's stretch goal was
 * "BridgeTheorem + FiniteHeightBeat + Capstone all flip to PASS". With
 * Constants now compiling, BridgeTheorem's OWN previously-masked errors are
 * unmasked (Real.tendsto_log_div_rpow_atTop API drift at lines 258/310,
 * a rewrite-pattern miss at 279, positivity goals at 104/114/122) PLUS one
 * NEW type mismatch at line 111 introduced by the mathematically-necessary
 * strict-hypothesis fix to C_T_pos (the `gammaOrdinate_ge_exp2` axiom in
 * Foundation.lean is stated with `<=`, but C_T_pos now requires strict `<`
 * because C_T(exp 2) = 0 exactly, so the old `<=` statement was FALSE at the
 * boundary and could never elaborate). Closing that cascade is a distinct,
 * cross-module unit of work tracked as the named sub-gap below.
 *
 * MATH NOTE (why error #1 was a real bug, not API drift): C_T(T0) =
 * (3*log T0 - 6)/(2*log T0). At T0 = exp 2, log T0 = 2, so the numerator is
 * 3*2 - 6 = 0 and C_T = 0. The lemma `C_T_pos : exp 2 <= T0 -> 0 < C_T T0`
 * is therefore false at the boundary and CANNOT be proven with `<=`; the
 * `linarith` failure imp-1095 saw was the elaborator correctly refusing a
 * false statement. The fix strengthens the hypothesis to `exp 2 < T0`
 * (every Polymath15 ladder entry has T0 >= 3000 >> exp 2 ~= 7.39, so the
 * strict bound holds with a wide margin) and propagates the strict
 * hypothesis to the no-external-caller `bridge_constants_positive`.
 *
 * Companion source: lean/LambdaAttack/Constants.lean (the file fixed).
 */

export const LEAN_CONSTANTS_ELABORATION_FIXES = Object.freeze({
  ticket: 'imp-1114',
  closesSubGap: 'imp-1095-sub-elaboration-fixes',
  timestamp: '2026-05-19T19:21:27Z',
  toolchain: Object.freeze({
    leanVersion: 'Lean (version 4.9.0, arm64-apple-darwin23.5.0, commit 8f9843a4a5fe, Release)',
    lakeVersion: 'Lake v5.0.0',
    mathlibPin: 'v4.9.0',
  }),
  constantsBuildVerdict: 'success',
  constantsBuildRuntimeMs: 2710,
  // Pre-existing, separately tracked. NOT in imp-1114 scope.
  residualSorrysInConstants: Object.freeze([
    Object.freeze({
      line: 128,
      decl: 'C_F_ibp_value',
      subGap: 'skp-512a',
      class: 'formalization-only (IBP improper-integral FTC tactic transcription)',
    }),
  ]),
  perErrorLineFixes: Object.freeze([
    Object.freeze({
      line: 76,
      decl: 'C_T_pos',
      before: 'lemma C_T_pos {T0 : R} (hT0 : Real.exp 2 <= T0) : 0 < C_T T0',
      after: 'lemma C_T_pos {T0 : R} (hT0 : Real.exp 2 < T0) : 0 < C_T T0',
      errorClass: 'false-statement-at-boundary (NOT API drift)',
      fixRationale:
        'C_T(exp 2) = (3*2-6)/(2*2) = 0, so 0 < C_T T0 is false at T0 = exp 2. '
        + 'Strengthened the hypothesis to strict `exp 2 < T0`; replaced '
        + 'Real.log_le_log with Real.log_lt_log so the proof yields the strict '
        + '2 < log T0 that div_pos needs. Mathematically tighter and true for '
        + 'every ladder entry (T0 >= 3000).',
    }),
    Object.freeze({
      line: 81,
      decl: 'C_T_pos',
      before: 'have hlog : 2 <= Real.log T0 := (Real.log_exp 2) |> Real.log_le_log (Real.exp_pos 2) hT0',
      after: 'have hlog : 2 < Real.log T0 := (Real.log_exp 2) |> Real.log_lt_log (Real.exp_pos 2) hT0',
      errorClass: 'consequence of error #1 (proof-term must produce strict)',
      fixRationale:
        'div_pos needs 0 < 3*log T0 - 6; only the strict 2 < log T0 delivers '
        + 'that. Real.log_lt_log (hx : 0 < x) (h : x < y) : log x < log y is the '
        + 'mathlib 4.9.0 strict analogue of log_le_log.',
    }),
    Object.freeze({
      line: 154,
      decl: 'C_C_eq',
      before: 'unfold C_C C_H C_KH C_Selberg; norm_num',
      after: 'unfold C_C C_H C_KH C_Selberg; rw [mul_comm Real.pi (3 : R)]',
      errorClass: 'tactic-leftover (pure multiplicative commutativity)',
      fixRationale:
        'After unfolding, the goal reduced to sqrt(pi*3) vs sqrt(3*pi); norm_num '
        + 'split the sqrt and left the commutativity obligation unsolved. '
        + 'Rewriting pi*3 -> 3*pi makes both sides definitionally equal and '
        + 'closes the goal by rfl.',
    }),
    Object.freeze({
      line: 162,
      decl: 'C_C_lt_one',
      before: 'import set: {Log.Basic, Sqrt, Tactic}; `Real.pi_lt_3141593` unknown constant',
      after: 'added `import Mathlib.Data.Real.Pi.Bounds`; pi_lt_3141593 now resolves',
      errorClass: 'missing-import (constant exists in mathlib 4.9.0, just not imported)',
      fixRationale:
        'Real.pi_lt_3141593 is defined in Mathlib.Data.Real.Pi.Bounds, which '
        + 'Mathlib.Tactic does not transitively pull in. Adding the explicit '
        + 'import resolves the unknown constant; ALSO needed two norm_num literal '
        + 'facts (3.141593 < 3.1416 and 3*3.1416 < 64) because linarith does not '
        + 'reduce OfScientific decimal literals on its own.',
    }),
    Object.freeze({
      line: 163,
      decl: 'C_C_lt_one',
      before: 'have h3pi : 3 * Real.pi < 64 := by linarith   -- failed (cascade + decimal literal)',
      after: 'supplied `have hlit3 : 3 * (3.1416 : R) < 64 := by norm_num; linarith`',
      errorClass: 'cascade-from-#3 + linarith-decimal-literal-limitation',
      fixRationale:
        'Once the pi bound resolved, linarith still could not evaluate the '
        + 'OfScientific product 3 * 3.1416; feeding it the norm_num-proved '
        + 'numeric fact lets the linear closure go through.',
    }),
  ]),
  perModuleRebuildVerdict: Object.freeze([
    Object.freeze({ module: 'LambdaAttack.Constants', verdict: 'PASS', note: 'all 4 elaboration errors fixed; only pre-existing skp-512a sorry remains' }),
    Object.freeze({ module: 'LambdaAttack.BridgeTheorem', verdict: 'FAIL', note: 'NEW line-111 strict-axiom mismatch + pre-existing unmasked errors (258/310 tendsto API drift, 279 rewrite, 104/114/122 positivity)' }),
    Object.freeze({ module: 'LambdaAttack.FiniteHeightBeat', verdict: 'BLOCKED', note: 'transitively blocked by BridgeTheorem' }),
    Object.freeze({ module: 'LambdaAttack.Capstone', verdict: 'BLOCKED', note: 'transitively blocked by BridgeTheorem' }),
  ]),
  subGapsRemaining: Object.freeze([
    Object.freeze({
      id: 'imp-1114-sub-bridgetheorem-strict-cascade',
      summary:
        'BridgeTheorem.lean does not yet PASS. Two coupled pieces: (a) line 111 '
        + 'C_T_pos now needs strict `exp 2 < gammaOrdinate N` but the '
        + 'gammaOrdinate_ge_exp2 axiom in Foundation.lean is `<=` — strengthen '
        + 'the axiom to strict (justified: gamma_1 ~= 14.13 > 7.39 = exp 2) and '
        + 'wrap the `<=` use sites (115/265) with le_of_lt; (b) pre-existing '
        + 'independent errors unmasked once Constants compiled: '
        + 'Real.tendsto_log_div_rpow_atTop unknown at 258/310 (mathlib 4.9.0 API '
        + 'drift), rewrite-pattern miss at 279, positivity goals at 104/114/122. '
        + 'Cross-module unit of work, distinct from the Constants leaf.',
      blocks: ['LambdaAttack.BridgeTheorem', 'LambdaAttack.FiniteHeightBeat', 'LambdaAttack.Capstone'],
    }),
  ]),
});

export const LEAN_CONSTANTS_ELABORATION_FIXES_ASSERTIONS = Object.freeze([
  Object.freeze({
    id: 'imp1114-constants-builds-clean',
    holds: () => LEAN_CONSTANTS_ELABORATION_FIXES.constantsBuildVerdict === 'success',
    why: 'imp-1114 ships only if the LIVE `lake build LambdaAttack.Constants` actually elaborated clean. A non-success verdict means imp-1095-sub-elaboration-fixes is NOT closed and the artefact would be lying about the leaf module.',
  }),
  Object.freeze({
    id: 'imp1114-all-four-errors-recorded',
    holds: () => {
      const fixes = LEAN_CONSTANTS_ELABORATION_FIXES.perErrorLineFixes || [];
      const lines = new Set(fixes.map((f) => f.line));
      // The 4 imp-1095-reported error sites (76/81 are one decl, 154, 162, 163).
      return fixes.length >= 4
        && lines.has(76) && lines.has(154) && lines.has(162) && lines.has(163);
    },
    why: 'Every error site imp-1095 reported (C_T_pos 76/81, C_C_eq 154, C_C_lt_one 162/163) must have an explicit before/after/errorClass record. A missing site means a silent unfixed error or an undocumented edit.',
  }),
  Object.freeze({
    id: 'imp1114-error1-classified-as-real-bug-not-api-drift',
    holds: () => {
      const e1 = (LEAN_CONSTANTS_ELABORATION_FIXES.perErrorLineFixes || [])
        .find((f) => f.line === 76);
      return !!e1 && /false-statement-at-boundary/.test(e1.errorClass)
        && /Real\.exp 2 <= T0/.test(e1.before)
        && /Real\.exp 2 < T0/.test(e1.after);
    },
    why: 'The C_T_pos error was NOT API drift: C_T(exp 2) = 0, so the `<=` statement was false. Recording it as a mere rename would hide that the fix changed a lemma hypothesis (a real mathematical correction) and would obscure why the BridgeTheorem cascade did not flip.',
  }),
  Object.freeze({
    id: 'imp1114-cascade-honest-partial-named',
    holds: () => {
      const subs = LEAN_CONSTANTS_ELABORATION_FIXES.subGapsRemaining || [];
      const verdicts = LEAN_CONSTANTS_ELABORATION_FIXES.perModuleRebuildVerdict || [];
      const bridge = verdicts.find((v) => v.module === 'LambdaAttack.BridgeTheorem');
      // If BridgeTheorem is not PASS, a sub-gap MUST name the residual work.
      return bridge && (bridge.verdict === 'PASS'
        || subs.some((s) => s.id === 'imp-1114-sub-bridgetheorem-strict-cascade'));
    },
    why: 'Prevents a dishonest flip where Constants compiles but the artefact silently claims the Capstone cascade is closed. Either BridgeTheorem genuinely PASSes or the named sub-gap imp-1114-sub-bridgetheorem-strict-cascade explains exactly what remains.',
  }),
  Object.freeze({
    id: 'imp1114-residual-sorry-is-pre-existing-only',
    holds: () => {
      const res = LEAN_CONSTANTS_ELABORATION_FIXES.residualSorrysInConstants || [];
      // The only sorry allowed to remain in Constants is the pre-existing skp-512a.
      return res.every((s) => s.subGap === 'skp-512a')
        && res.length <= 1;
    },
    why: 'imp-1114 must not introduce any NEW sorry into Constants.lean. The only permissible residual is the pre-existing skp-512a IBP gap (line 128), which is tracked independently and explicitly out of scope.',
  }),
]);
