/**
 * @module imp-97447-krein-bathtub-joint-floor-glossary-headword
 * @fileoverview imp-97447 -- import-light glossary/Concepts headword recording the imp-97416
 *   bathtub / water-filling joint Krein floor c_sharp >= -3065.435: the first floor in the record
 *   to use BOTH band-limited constraints on f = |psi|^2 jointly -- the pointwise reproducing-kernel
 *   budget f <= a/pi AND the unit-mass constraint int f = 1 -- rather than the pointwise budget alone.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97416 applied the classical bathtub / water-filling (decreasing-
 *   rearrangement) principle to int sigma_2^- f: since every admissible f obeys 0 <= f <= a/pi
 *   (Bernstein/reproducing-kernel) AND int f = 1 (mass), the maximum of int sigma_2^- f is attained
 *   by filling only the DEEPEST measure-(pi/a) = 5.7192 sub-level set of sigma_2^- at height a/pi,
 *   giving c_sharp >= -(a/pi) * 17531.84 = -3065.435.
 *   (b) WHY IT IS NEW. Earlier floors (imp-97335 naive well-depth -4336.198; imp-97399 uniform
 *   reproducing-kernel -3200.029) used only the pointwise cap over the WHOLE well width 13.78. The
 *   bathtub floor is the first to also use the normalisation int f = 1, coupling the two rigorous
 *   band-limited budgets jointly, improving imp-97399 by +134.594.
 *   (c) WHY THE GAIN IS SMALL. The deepest measure-(pi/a) region already carries 95.79% of the total
 *   negative area (17531.84 of 18301.61) -- the well is deep and spiky, so the mass constraint is
 *   nearly non-binding against the pointwise cap, and the scalar two-budget coupling is now
 *   essentially exhausted (only +134.594 of a possible +1136.176 gap remains unclaimed).
 *   (d) WHY IT STILL DOES NOT REACH POSITIVE. A rearrangement bound cannot see (i) that the bathtub
 *   optimiser f = (a/pi) 1_{deepest set} is a discontinuous indicator no band-limited psi of type
 *   a = (ln3)/2 (scale 1/a ~ 1.82) can realise, or (ii) the discarded t^4 positive far field
 *   int sigma_2^+ |psi|^2 >= 0 that any spread-out psi must pay. Both make the measured
 *   c_sharp ~ 0.582 (imp-97206 upper bracket) positive; closing the sign needs a genuinely SPECTRAL
 *   estimate (weighted-PSWF eigenvalue decay or Fejer-Riesz / de Branges factorisation).
 *   (e) STATUS: documentation only. No positive lower bound on c_sharp; no operator positivity;
 *   interval-rigorous reach stays 2a<=0.96; no bound moves.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (source: the bathtub/water-filling derivation
 *   this headword names, floor -3065.435)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (uniform pointwise floor
 *   -3200.029, improved by the joint floor)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (naive well-depth floor -4336.198)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~0.582 UPPER bracket)
 *
 * Ticket: imp-97447 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The bathtub-joint-floor headword, baked verbatim (no re-import).
const KREIN_BATHTUB_JOINT_FLOOR_HEADWORD = Object.freeze({
  key: 'krein-csharp-bathtub-joint-floor-imp97416',
  term:
    'bathtub / water-filling joint Krein floor: the first c_sharp lower bound to couple the ' +
    'pointwise reproducing-kernel budget f <= a/pi with the unit-mass constraint int f = 1 jointly',
  definition:
    'For f = |psi|^2 with psi in the band-limited space PW_a (2a = ln3), the classical bathtub / ' +
    'water-filling (decreasing-rearrangement) principle bounds int sigma_2^- f under BOTH ' +
    '0 <= f <= a/pi (Bernstein / reproducing-kernel pointwise cap) AND int f = 1 (normalisation) ' +
    'jointly: the maximum is attained by filling only the deepest measure-(pi/a) = 5.7192 sub-level ' +
    'set of sigma_2^- at height a/pi, giving c_sharp >= -(a/pi) * 17531.84 = -3065.435.',
  mechanism:
    'Earlier floors used the pointwise cap ALONE over the whole width-13.78 confined negative well ' +
    '(imp-97335 naive well-depth -4336.198; imp-97399 uniform reproducing-kernel -3200.029). The ' +
    'bathtub floor additionally exploits the mass budget, improving imp-97399 by +134.594. The gain ' +
    'is small because the deepest measure-(pi/a) region already captures 95.79% of the total ' +
    'negative area -- the well is deep and spiky, so the mass constraint is nearly non-binding and ' +
    'the scalar two-budget coupling is now essentially exhausted.',
  verificationStatus:
    'Re-cited from the imp-97416 derivation module ' +
    '(src/data/imp-97416-krein-csharp-bathtub-joint-floor.js), grid-stable to 1e-4 across ' +
    'h = 5e-4 / 2.5e-4 / 1e-4. The floor stays NEGATIVE: a scalar rearrangement bound cannot see ' +
    'that the bathtub optimiser is not band-limited or that it discards the t^4 positive far field, ' +
    'both of which make the measured c_sharp ~ 0.582 (imp-97206) positive. Closing the sign needs a ' +
    'genuinely spectral estimate. Naming / glossary headword only; supplies no new bound; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP97447_KREIN_BATHTUB_JOINT_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97447',
  proofSection: 'S-frontier',
  glosses: 'imp-97416',
  question:
    'imp-97416 derived a new rigorous finite floor c_sharp >= -3065.435 by coupling the pointwise ' +
    'reproducing-kernel budget with the unit-mass constraint via the bathtub / water-filling ' +
    'principle -- the first floor to use both band-limited constraints jointly. What is the ' +
    'headword for this result?',
  headword: KREIN_BATHTUB_JOINT_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97416 bathtub / ' +
    'water-filling joint Krein floor c_sharp >= -3065.435 -- the first floor to couple the ' +
    'pointwise reproducing-kernel budget f <= a/pi with the unit-mass constraint int f = 1 ' +
    'jointly, improving imp-97399s uniform floor -3200.029 by +134.594. The floor stays negative; ' +
    'no bound moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97416 (the bathtub/water-filling derivation this glosses); imp-97399 (the uniform ' +
    'pointwise floor it improves); imp-97335 (the naive well-depth floor); imp-97206 (the measured ' +
    'upper bracket ~0.582).',
});

export default IMP97447_KREIN_BATHTUB_JOINT_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97447_KREIN_BATHTUB_JOINT_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97447-headword-names-floor-and-coupling',
    why: 'The headword must name the bathtub joint floor value, the two coupled budgets, and the ' +
      'improvement over the uniform floor -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97447_KREIN_BATHTUB_JOINT_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /-3065\.435/.test(h.definition) &&
        /a\/pi/.test(h.definition) &&
        /int f = 1/.test(h.definition) &&
        /-3200\.029/.test(h.mechanism) &&
        /\+134\.594/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97447-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97416.',
    holds: () =>
      IMP97447_KREIN_BATHTUB_JOINT_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97447_KREIN_BATHTUB_JOINT_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97447_KREIN_BATHTUB_JOINT_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      IMP97447_KREIN_BATHTUB_JOINT_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-97416',
  },
];

for (const assertion of IMP97447_KREIN_BATHTUB_JOINT_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97447-krein-bathtub-joint-floor-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
