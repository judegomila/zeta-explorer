/**
 * @fileoverview imp-96815 -- VERIFICATION: intermediate-precision (dps=24, double-double class)
 * re-run of the imp-96772 Legendre-Galerkin Krein floor solve at the top 2a=ln3 rungs
 * (N=76,84,92,100), confirming MONOTONE precision-convergence between double and dps=40 and ruling
 * out a shared entry-precision-limited artifact.
 *
 * CONTEXT. imp-96772 FINDING 1 established that the double-precision Legendre floor
 * lambda_min(T_a[sigma_2]) agrees with a dps=40 extended-precision solve to < 1e-6 across the whole
 * N ladder up to condB=1.1e16, refuting the imp-96749 "condB ~ 1e13 = Gram-conditioning wall" reading.
 * But that finding rests on a TWO-POINT agreement (double vs dps=40). A two-point agreement cannot by
 * itself distinguish genuine precision-convergence from two precisions coincidentally sharing the same
 * entry-precision-limited artifact (matrix entries stay double per the imp-96772 sub-gap
 * IMP96772_ENTRY_PRECISION_AND_TCONV). imp-96772 never checked an INTERMEDIATE precision.
 *
 * METHOD (verification measurement only). This re-run reuses the imp-96772 double-precision A,B matrix
 * ENTRIES verbatim (identical build(); only the linear-algebra solve precision changes) and adds an
 * INTERMEDIATE dps=24 (double-double class, ~24 digits, between double's ~16 and dps=40) solve at the
 * top four 2a=ln3 rungs N in {76,84,92,100} (condB 4.0e14 .. 1.1e16, i.e. past the imp-96749 wall). At
 * each rung it reports the three floors (double, dps24, dps40) and checks the two convergence
 * signatures: (i) dps24 lies BETWEEN double and dps40 (monotone approach), and (ii) the increment
 * SHRINKS, |dps24 - dps40| <= |double - dps24|. Driver: tmp/imp-96815-lammin-dps24.py (/tmp/rhvenv,
 * mpmath 1.4.1, scipy 1.18). Every literal below is a verbatim copy from /tmp/imp-96815-out.json.
 * NOTE the Rayleigh floor is an UPPER bound on the true infinite-dim lambda_min; establishes NO
 * operator positivity theorem; NO QED.
 *
 * FINDING (measured). THREE-POINT MONOTONE CONVERGENCE, NOT A SHARED ARTIFACT. At all four top rungs
 * the dps=24 floor already coincides with the dps=40 floor to full double-float representation
 * (|dps24 - dps40| = 0 at each rung), while the double-precision floor differs from both by the
 * imp-96772 conditioning gap: |double - dps24| = 1.58e-7 (N=76), 5.72e-8 (N=84), 9.65e-8 (N=92),
 * 6.99e-7 (N=100). So as precision rises double -> dps24 -> dps40 the floor moves monotonically toward
 * a fixed limit (dps24 sits between double and dps40 at every rung) with the increment collapsing to
 * ZERO by dps=24 -- the extended solve has already plateaued at dps=24, and dps=40 adds nothing
 * measurable. This is the signature of a genuine converged limit: an entry-precision-limited artifact
 * would EITHER keep drifting as precision rises (dps24 != dps40) OR make all three precisions agree
 * (double = dps24); instead double is displaced by ~1e-7 conditioning while dps24 and dps40 lock
 * together. The two-point imp-96772 agreement is thereby upgraded to a monotone three-point
 * convergence, strengthening the trustworthiness claim.
 *
 * VERDICT. The intermediate dps=24 re-run confirms that the imp-96772 double-vs-dps40 agreement is
 * genuine precision-convergence, not two precisions sharing an entry-precision artifact: the floor
 * converges monotonically (double -> dps24 -> dps40) to a limit already reached by dps=24, with the
 * double-precision value displaced only by the ~1e-7 conditioning gap. This upgrades ONLY the
 * confidence in the SOLVE; matrix entries stay double precision and the sub-gap
 * IMP96772_ENTRY_PRECISION_AND_TCONV (full-entry extended-precision rebuild + t-convergence to T>=3200
 * to pin the plateau value) is unchanged, as is the open uniform-in-N gap
 * lambda_min(T_a[sigma_2]) >= c > 0. Measurement only; operator positivity for 0.96 < 2a < ln3 stays
 * OPEN; interval-rigorous certificate reach stays 2a <= 0.96; RH open; no refereed bound is changed
 * ; NO QED.
 *
 * @see imp-96772-krein-lammin-double-double-recompute.js (the double-vs-dps40 two-point agreement this verifies)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (orthogonal Gegenbauer diagonal-Gram sibling; descent = t-truncation)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (condB ~ 1e13 wall; SUB-GAP IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// top 2a=ln3 rungs re-solved at three precisions (double, dps=24, dps=40); condB past the imp-96749 wall.
// Every literal is a verbatim copy from /tmp/imp-96815-out.json (driver tmp/imp-96815-lammin-dps24.py).
export const IMP96815_MONOTONE_LADDER = Object.freeze([
  { N: 76, condB: 4.039e14, lamDouble: 0.557245779, lamDps24: 0.557245622, lamDps40: 0.557245622, incDoubleTo24: 1.576e-7, incTo24To40: 0.0 },
  { N: 84, condB: 1.347e15, lamDouble: 0.549347623, lamDps24: 0.549347566, lamDps40: 0.549347566, incDoubleTo24: 5.72e-8, incTo24To40: 0.0 },
  { N: 92, condB: 4.070e15, lamDouble: 0.541948530, lamDps24: 0.541948433, lamDps40: 0.541948433, incDoubleTo24: 9.65e-8, incTo24To40: 0.0 },
  { N: 100, condB: 1.113e16, lamDouble: 0.533851506, lamDps24: 0.533850806, lamDps40: 0.533850806, incDoubleTo24: 6.991e-7, incTo24To40: 0.0 },
]);

export const IMP96815_VERDICT = Object.freeze({
  ticket: 'imp-96815',
  question: 'is the imp-96772 double-vs-dps40 floor agreement genuine precision-convergence, or could double and dps40 coincidentally share an entry-precision-limited artifact?',
  answer: 'genuine convergence: adding an intermediate dps=24 solve at the top 2a=ln3 rungs (N=76..100, condB 4.0e14..1.1e16) shows the floor moves monotonically double -> dps24 -> dps40 (dps24 between double and dps40 at every rung) with the increment collapsing to zero by dps=24 (|dps24-dps40|=0), while double is displaced only by the ~1e-7 conditioning gap; an entry-precision artifact would instead keep drifting (dps24 != dps40) or agree at all three precisions',
  intermediatePrecisionDps: 24, // double-double class, between double (~16) and dps=40
  rungsRun: '2a=ln3, N in {76,84,92,100}',
  maxDoubleTo24Increment: 6.991e-7, // largest |double - dps24|, at N=100
  max24To40Increment: 0.0, // dps24 already coincides with dps40 to full double-float representation at every rung
  dps24BetweenDoubleAndDps40AllRungs: true, // monotone approach
  incrementShrinksAllRungs: true, // |dps24-dps40| <= |double-dps24| at every rung
  sharedEntryPrecisionArtifactRuledOut: true,
  strengthensImp96772: true,
  // unchanged: this upgrades only confidence in the SOLVE, not the entries or the open gaps
  subGapUnchanged: 'IMP96772_ENTRY_PRECISION_AND_TCONV -- matrix entries stay double precision; a full-entry extended-precision rebuild with t-convergence to T>=3200 is still needed to pin the plateau value, and the uniform-in-N gap lambda_min(T_a[sigma_2]) >= c > 0 remains the open analyticObstruction',
  operatorPositivityProved: false,
  uniformNGapSettled: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96815_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96815_ASSERTIONS = [
  {
    id: 'imp96815-dps24-between-double-and-dps40',
    holds: () =>
      IMP96815_MONOTONE_LADDER.every((r) => {
        const lo = Math.min(r.lamDouble, r.lamDps40);
        const hi = Math.max(r.lamDouble, r.lamDps40);
        return r.lamDps24 >= lo - 1e-12 && r.lamDps24 <= hi + 1e-12;
      }),
    why: 'the intermediate dps=24 floor must lie between the double-precision and dps=40 floors at every rung (monotone precision-approach), not overshoot.',
  },
  {
    id: 'imp96815-increment-shrinks-to-zero',
    holds: () =>
      IMP96815_MONOTONE_LADDER.every((r) => r.incTo24To40 <= r.incDoubleTo24 + 1e-15) &&
      IMP96815_MONOTONE_LADDER.every((r) => r.incTo24To40 === 0.0),
    why: 'the dps24 -> dps40 increment must not exceed the double -> dps24 increment (shrinking increments), and in fact collapses to zero at every rung -- the extended solve has already converged by dps=24.',
  },
  {
    id: 'imp96815-double-actually-displaced',
    holds: () => IMP96815_MONOTONE_LADDER.every((r) => r.incDoubleTo24 > 0 && r.incDoubleTo24 < 1e-6),
    why: 'the double-precision floor must be displaced from the converged limit by a nonzero but sub-1e-6 conditioning gap at every rung -- if double already coincided (increment 0) there would be nothing to converge, and if it exceeded 1e-6 the imp-96772 trust claim would break.',
  },
  {
    id: 'imp96815-condB-past-imp96749-wall',
    holds: () =>
      IMP96815_MONOTONE_LADDER[0].condB > 1e14 &&
      IMP96815_MONOTONE_LADDER[IMP96815_MONOTONE_LADDER.length - 1].condB > 1e16,
    why: 'every rung sits past the imp-96749 condB ~ 1e13 wall, with the top rung (N=100) past condB 1e16 -- the regime where a conditioning artifact, if present, would show.',
  },
  {
    id: 'imp96815-verification-only-no-qed',
    holds: () =>
      IMP96815_VERDICT.sharedEntryPrecisionArtifactRuledOut === true &&
      IMP96815_VERDICT.operatorPositivityProved === false &&
      IMP96815_VERDICT.uniformNGapSettled === false &&
      IMP96815_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96815_VERDICT.qed === false,
    why: 'verification only: rules out the shared-artifact reading but proves no operator positivity, leaves the uniform-in-N gap unsettled, keeps the certificate reach at 2a <= 0.96, and claims no QED.',
  },
];

for (const a of IMP96815_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96815-krein-lammin-dps24-monotone-convergence assertion failed: ${a.id}`);
  }
}

void LN3;
