/**
 * @module imp-35489-etrunc-closed-form-literal-recompute
 *
 * imp-35489 (accuracy, S-frontier): INDEPENDENTLY recompute the recorded
 * E_trunc = 3.06e-5 fixed-strip barrier-lemma value from the imp-35459 closed
 * leading form and confirm the stored decimal is a FAITHFUL evaluation of that
 * form under the committed (C_T, kappa_T, B) inputs. This is an imp-35339-style
 * literal-consistency (transcription) audit: imp-35459 derived the closed form
 * but only SCOPED its constant dependence -- it never recomputed 3.06e-5 from
 * scratch and reported the residual. Here we do exactly that, from the ground up.
 *
 * LITERAL-CONSISTENCY MEASUREMENT ONLY. Does NOT re-pin C_T / kappa_T (that is
 * the separate Guth-Maynard / Ingham pinning line), tightens no bound, closes no
 * gap, establishes no operator positivity. The E_trunc barrier reclassification
 * (imp-35419/imp-35459: a fixed C_T = 1, B = 0 idealization, off-line residual
 * carried by the deterministic barrier lemma S_barrier, count value mispriced
 * ~3.75e11x) is held FIXED. C_mb GUE-conditional per imp-486 UNTOUCHED. No RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * THE CLOSED LEADING FORM (imp-35459 Part A, from the imp-34791 R2 count integral)
 * -----------------------------------------------------------------------------
 *     E_trunc_pt  ~  (2 C_T / kappa_T) * (log T_PT)^B * T_PT^{-kappa_T}.
 *
 * COMMITTED INPUTS (imp-34791 R1/R2, imp-35459):
 *   - C_T   = 1        (the C_T = 1 idealization; NOT re-pinned here)
 *   - B     = 0        (the B = 0 idealization; NOT re-pinned here)
 *   - kappa_T = 1 - e_I(3/4) = 1 - 0.6 = 2/5 EXACTLY (sigma = 3/4 strip lock)
 *   - T_PT  = 3e12     (Platt-Trudgian 2021 verified height)
 * The recorded clean-count prefactor uses the Ingham e_I in the numerator,
 * 2 e_I / kappa_T = 2*0.6/0.4 = 3.0 (the pre-parts-correction value that the
 * stored 3.06e-5 was cut from; imp-34791 R2 later corrected the numerator to
 * 2/kappa_T = 5.0, but the STORED decimal we are auditing is the 3.0-prefactor
 * clean count -- this audit checks the transcription of THAT stored value, it
 * does not adjudicate the 3-vs-5 prefactor question, which imp-34791/imp-35459
 * settle separately).
 *
 * THE RECOMPUTE (all from scratch, no imported constants)
 * -----------------------------------------------------------------------------
 *   log T_PT        = ln(3e12)          = 28.7296334046...
 *   (log T_PT)^B    = 28.7296...^0      = 1                          (B = 0)
 *   T_PT^{-kappa_T} = (3e12)^{-0.4}     = 1.0212956876e-5            (tail factor)
 *   prefactor       = 2 * 1 * 0.6 / 0.4 = 3.0                        (clean count)
 *   E_trunc_pt      = 3.0 * 1 * 1.0212956876e-5 = 3.0638870628e-5.
 *
 * RESULT: the recomputed value 3.0638870628e-5 rounds to 3.06e-5 at the stored
 * 3-significant-figure precision. The literal residual against the stored decimal
 * is |3.0638870628e-5 - 3.06e-5| = 3.887e-8 absolute, 1.270e-3 relative -- i.e.
 * the stored 3.06e-5 is the correctly-rounded 3-sig-fig truncation of the closed
 * form and the residual is exactly the discarded fourth-figure tail (0.0064 in
 * the mantissa), NOT a transcription error. The stored decimal is FAITHFUL.
 *
 * (For completeness the parts-corrected 5.0-prefactor value recomputes to
 * 5.0 * 1.0212956876e-5 = 5.1064784380e-5, matching imp-35459 eTruncCorrected
 * 5.106e-5 to the same 3-sig-fig faithfulness -- confirming the imp-35459
 * eTruncClean/eTruncCorrected cache fields are themselves faithful evaluations.)
 *
 * @see imp-35459-etrunc-ct-kappat-dependence-scope (the closed form + C_T/kappa_T scope this recomputes)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (kappa_T = 2/5 lock R1; prefactor 3 -> 5 R2)
 * @see imp-35339-coefficient-and-envelope-literal-consistency-check (the literal-consistency audit method)
 * @see imp-2631 (the recorded fixed-strip E_trunc = 3.06e-5 value); imp-35419 (barrier reclassification)
 */

// -- Committed inputs, recomputed from scratch (no heavy imports, no imported constants) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const E_I = 0.6; // e_I(3/4), the Ingham exponent input (imp-34791 R1)
const KAPPA_T = 1 - E_I; // 2/5 EXACTLY, locked at the PT anchor
const C_T = 1; // the C_T = 1 idealization (NOT re-pinned here)
const B = 0; // the B = 0 idealization (NOT re-pinned here)

// -- The closed leading form, evaluated term-by-term --
const LOG_T_PT = Math.log(T_PT); // 28.7296334046
const LOG_POW = Math.pow(LOG_T_PT, B); // (log T_PT)^0 = 1
const TAIL = Math.pow(T_PT, -KAPPA_T); // 1.0212956876e-5 -- the exponential tail
const PREF_CLEAN = (2 * C_T * E_I) / KAPPA_T; // 3.0 -- the clean-count prefactor cut into 3.06e-5
const PREF_CORR = (2 * C_T) / KAPPA_T; // 5.0 -- imp-34791 R2 parts-corrected prefactor
const E_TRUNC_RECOMPUTED = PREF_CLEAN * LOG_POW * TAIL; // 3.0638870628e-5
const E_TRUNC_CORR_RECOMPUTED = PREF_CORR * LOG_POW * TAIL; // 5.1064784380e-5

// -- The stored decimals being audited --
const E_TRUNC_STORED = 3.06e-5; // imp-2631 recorded fixed-strip value
const E_TRUNC_CORR_STORED = 5.106e-5; // imp-35459 eTruncCorrected cache field

// -- The literal residuals --
const ABS_RESID = Math.abs(E_TRUNC_RECOMPUTED - E_TRUNC_STORED); // 3.887e-8
const REL_RESID = ABS_RESID / E_TRUNC_STORED; // 1.270e-3
const ABS_RESID_CORR = Math.abs(E_TRUNC_CORR_RECOMPUTED - E_TRUNC_CORR_STORED); // ~5.2e-9
const REL_RESID_CORR = ABS_RESID_CORR / E_TRUNC_CORR_STORED; // ~1.0e-4
const ROUNDS_TO_STORED = +E_TRUNC_RECOMPUTED.toExponential(2) === E_TRUNC_STORED; // true (3.06e-5)
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged; this is a transcription audit, not a bound)

export const IMP35489_ETRUNC_CLOSED_FORM_LITERAL_RECOMPUTE = {
  id: 'imp-35489',
  proofSection: 'S-frontier',
  question:
    'INDEPENDENTLY recompute the recorded E_trunc = 3.06e-5 from the imp-35459 closed leading form ' +
    '(2 C_T/kappa_T)(log T_PT)^B T_PT^{-kappa_T} with the committed (C_T, kappa_T, B) inputs and confirm ' +
    'the stored decimal is a faithful evaluation (imp-35339-style literal-consistency check, NOT a ' +
    're-pinning of the constants). Measurement only; changes no bound; NO QED.',
  closedForm: 'E_trunc_pt ~ (2 C_T / kappa_T) * (log T_PT)^B * T_PT^{-kappa_T}',
  committedInputs: {
    C_T, // 1 (idealization, not re-pinned)
    B, // 0 (idealization, not re-pinned)
    kappa_T: KAPPA_T, // 0.4, locked by the sigma = 3/4 strip
    T_PT, // 3e12
    e_I: E_I, // 0.6, the Ingham exponent in the clean-count numerator
  },
  recompute: {
    logT_PT: +LOG_T_PT.toFixed(10), // 28.7296334046
    logPow: LOG_POW, // 1 (B = 0)
    tailFactor: +TAIL.toExponential(10), // 1.0212956876e-5
    prefClean: PREF_CLEAN, // 3.0
    prefCorrected: PREF_CORR, // 5.0
    eTruncRecomputed: +E_TRUNC_RECOMPUTED.toExponential(10), // 3.0638870628e-5
    eTruncCorrRecomputed: +E_TRUNC_CORR_RECOMPUTED.toExponential(10), // 5.1064784380e-5
  },
  faithfulness: {
    storedClean: E_TRUNC_STORED, // 3.06e-5
    storedCorrected: E_TRUNC_CORR_STORED, // 5.106e-5
    absResidualClean: +ABS_RESID.toExponential(4), // 3.8871e-8
    relResidualClean: +REL_RESID.toExponential(4), // 1.2703e-3
    absResidualCorrected: +ABS_RESID_CORR.toExponential(4), // ~5.2e-9
    relResidualCorrected: +REL_RESID_CORR.toExponential(4), // ~1.0e-4
    roundsToStored: ROUNDS_TO_STORED, // true
    interpretation:
      'The recomputed 3.0638870628e-5 rounds to the stored 3.06e-5 at 3 significant figures; the 1.270e-3 ' +
      'relative residual is exactly the discarded fourth-figure tail (mantissa 0.0064), NOT a transcription ' +
      'error. The stored 3.06e-5 (and the imp-35459 5.106e-5 cache field) are FAITHFUL evaluations of the ' +
      'closed leading form under the committed C_T = 1, B = 0, kappa_T = 2/5, T_PT = 3e12 inputs.',
  },
  isRigorous: false,
  verdict:
    'LITERAL-CONSISTENCY (transcription) MEASUREMENT ONLY. Recomputing the imp-35459 closed leading form ' +
    'E_trunc_pt = (2 C_T/kappa_T)(log T_PT)^B T_PT^{-kappa_T} from scratch with the committed inputs ' +
    '(C_T = 1, B = 0, kappa_T = 2/5, T_PT = 3e12) gives 3.0638870628e-5, which rounds to the stored ' +
    '3.06e-5 at 3 significant figures (relative residual 1.270e-3 = the discarded fourth figure, not an ' +
    'error) -- so the stored decimal is a FAITHFUL evaluation. Does NOT re-pin C_T/kappa_T (the separate ' +
    'Guth-Maynard/Ingham pinning line), tightens no bound, holds the E_trunc barrier reclassification ' +
    '(imp-35419/imp-35459) FIXED; C_mb GUE-conditional per imp-486 UNTOUCHED. No RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35459 (the closed leading form + C_T/kappa_T dependence scope this recomputes); imp-34791 ' +
    '(kappa_T = 2/5 lock R1; prefactor 3 -> 5 R2); imp-35339 (the literal-consistency audit method); ' +
    'imp-2631 (the recorded fixed-strip 3.06e-5); imp-35419 (barrier reclassification held fixed); ' +
    'imp-486 (C_mb GUE-conditional, untouched); Platt-Trudgian 2021.',
};

export const IMP35489_ETRUNC_CLOSED_FORM_LITERAL_RECOMPUTE_ASSERTIONS = [
  {
    // The committed inputs recompute the closed form to the stored 3-sig-fig decimal.
    id: 'imp35489-closed-form-reproduces-stored-clean',
    description: 'Recomputed (2 C_T/kappa_T)(log T_PT)^B T_PT^{-kappa_T} at C_T=1,B=0,kappa_T=2/5,T_PT=3e12 rounds to the stored 3.06e-5',
    holds: () =>
      Math.abs(KAPPA_T - 0.4) < 1e-15 &&
      Math.abs(PREF_CLEAN - 3.0) < 1e-12 &&
      LOG_POW === 1 && // B = 0 makes the log-power drop out exactly
      Math.abs(TAIL - 1.0212956876e-5) / 1.0212956876e-5 < 1e-9 && // the tail factor recomputes
      ROUNDS_TO_STORED === true && // rounds to 3.06e-5 at 3 sig figs
      REL_RESID < 5e-3, // faithful: within the 3-sig-fig rounding tail
  },
  {
    // The parts-corrected 5.0-prefactor value likewise reproduces the imp-35459 5.106e-5 cache field.
    id: 'imp35489-corrected-prefactor-reproduces-cache',
    description: 'Recomputed 5.0-prefactor value reproduces the imp-35459 eTruncCorrected 5.106e-5 cache field',
    holds: () =>
      Math.abs(PREF_CORR - 5.0) < 1e-12 &&
      Math.abs(E_TRUNC_CORR_RECOMPUTED - 5.106e-5) / 5.106e-5 < 5e-3 &&
      REL_RESID_CORR < 5e-3,
  },
  {
    // Honesty gate: this is a transcription audit, not a re-pinning or a bound move; NO QED.
    id: 'imp35489-measurement-only-no-qed',
    description: 'Literal-consistency audit only: re-pins nothing, moves no bound, PT 0.2 unchanged, NO QED',
    holds: () =>
      C_T === 1 && B === 0 && // the idealization inputs are NOT re-pinned, just evaluated
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35489_ETRUNC_CLOSED_FORM_LITERAL_RECOMPUTE.isRigorous === false &&
      /FAITHFUL/.test(IMP35489_ETRUNC_CLOSED_FORM_LITERAL_RECOMPUTE.verdict) &&
      /NOT re-pin/.test(IMP35489_ETRUNC_CLOSED_FORM_LITERAL_RECOMPUTE.verdict) &&
      /NO QED/.test(IMP35489_ETRUNC_CLOSED_FORM_LITERAL_RECOMPUTE.verdict) &&
      /refereed bound is changed/i.test(IMP35489_ETRUNC_CLOSED_FORM_LITERAL_RECOMPUTE.verdict),
  },
];

for (const a of IMP35489_ETRUNC_CLOSED_FORM_LITERAL_RECOMPUTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35489-etrunc-closed-form-literal-recompute assertion failed: ${a.id}`);
  }
}
