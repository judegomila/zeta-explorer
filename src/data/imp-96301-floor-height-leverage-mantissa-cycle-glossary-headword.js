/**
 * @module imp-96301-floor-height-leverage-mantissa-cycle-glossary-headword
 * @fileoverview imp-96301 -- import-light glossary/Concepts headword for the imp-96247
 *   result: the fixed-strip floor-to-height law H_required(E) = (3.0/E)^{1/0.4} extends
 *   unbroken from the imp-96232 union (floors 1e-5..1e-8) through floors 1e-9 and 1e-10,
 *   at a fixed 2.5-height-decades-per-floor-decade leverage, with the leading mantissa
 *   cycling 4.9295 -> 1.5588 -> 4.9295 -> 1.5588 (odd floor exponent -> 4.9295, even -> 1.5588).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96247 re-derived and extended the imp-96232/imp-96207/imp-96185 floor-height law
 *   to two new floor decades, but the module has no standalone quick-lookup entry stating
 *   the headline numbers for a reader who only wants "how much height per floor decade, and
 *   why does the mantissa alternate". This headword bakes that verbatim (no re-import of the
 *   imp-96247 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   H_required(E) = (prefactor/E)^{1/kappa_star}, prefactor = 3.0, kappa_star = 0.4 (sigma =
 *   3/4). Every floor decade costs exactly 2.5 certified-height decades (10^{2.5} ~ 316.23x),
 *   unbroken from 1e-8 (H ~ 1.5588e21) through 1e-9 (H ~ 4.9295e23) to 1e-10 (H ~ 1.5588e26).
 *   The leading mantissa cycles 4.9295 -> 1.5588 -> 4.9295 -> 1.5588 with period 2 in the
 *   floor exponent: odd floor exponent (1e-9, 1e-11, ...) lands on 4.9295; even floor
 *   exponent (1e-8, 1e-10, ...) lands on 1.5588.
 *
 *   MECHANISM: H_required(1e-n) = 3^{2.5} * 10^{2.5 n} = 15.588457 * 10^{2.5 n}. When n is
 *   EVEN, 2.5n is an integer, so the leading digits read 1.5588 * 10^{2.5n} directly. When n
 *   is ODD, 2.5n = integer + 0.5, so the extra 10^{0.5} factor turns 15.588457 into
 *   15.588457 * 3.16228 ~ 49.295, giving leading digits 4.9295 one exponent higher. The
 *   period-2 mantissa cycle is thus a direct fingerprint of 1/kappa_star = 2.5 being a
 *   half-integer, not a coincidence of the specific floors chosen.
 *
 *   STATUS: measurement / extension only, re-inverting the imp-2322 audit power law at the
 *   fixed certified kappa_star = 0.4. No zero is verified, no new T_PT is claimed, the
 *   rigorous bound stays E_trunc = 3.06e-5, C_mb stays GUE-conditional per imp-486.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96247 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96247-floor-height-law-extension-1e9-1e10 (source: the extended law and mantissa cycle this glosses)
 * @see imp-96232-kappa-star-floor-height-cross-validation (floors 1e-5..1e-8, the union this extends)
 * @see imp-2322-etrunc-pt-T_PT-sensitivity (forward E_trunc(T_PT) power law, elasticity -0.4)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 *
 * Ticket: imp-96301 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The floor-height leverage / mantissa-cycle headword, baked verbatim (no re-import).
const FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_HEADWORD = Object.freeze({
  key: 'floor-height-leverage-mantissa-cycle',
  term:
    'imp-96247 verdict: the fixed-strip floor-to-height law costs a fixed 2.5 height-' +
    'decades per floor-decade, with the leading mantissa cycling 4.9295 -> 1.5588 by ' +
    'floor-exponent parity',
  definition:
    'The imp-96247 extension of H_required(E) = (3.0/E)^{1/0.4} from the imp-96232 union ' +
    '(floors 1e-5..1e-8) through floors 1e-9 (H ~ 4.9295e23) and 1e-10 (H ~ 1.5588e26) ' +
    'confirms an unbroken 2.5-height-decades-per-floor-decade leverage (10^{2.5} ~ 316.23x ' +
    'per decade), and a leading-mantissa cycle 4.9295 -> 1.5588 -> 4.9295 -> 1.5588: odd ' +
    'floor exponent lands on 4.9295, even floor exponent lands on 1.5588.',
  mechanism:
    'H_required(1e-n) = 3^{2.5} * 10^{2.5 n} = 15.588457 * 10^{2.5 n}. Even n makes 2.5n an ' +
    'integer, so the mantissa reads 1.5588 directly; odd n makes 2.5n a half-integer, so the ' +
    'extra 10^{0.5} ~ 3.16228 factor turns 15.588457 into ~49.295, reading as mantissa 4.9295 ' +
    'one exponent higher. The period-2 cycle is a direct fingerprint of 1/kappa_star = 2.5 ' +
    'being a half-integer.',
  verificationStatus:
    'Measurement / extension only, re-inverting the imp-2322 audit power law at the fixed ' +
    'certified kappa_star = 0.4. No zero is verified, no new T_PT is claimed, rigorous bound ' +
    'stays E_trunc = 3.06e-5, C_mb stays GUE-conditional (imp-486, UNTOUCHED). Changes no ' +
    'bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96301_FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96301',
  proofSection: 'S-frontier',
  glosses: 'imp-96247',
  question:
    'imp-96247 extended the fixed-strip floor-to-height law to floors 1e-9 and 1e-10, ' +
    'confirming a fixed height-decades-per-floor-decade leverage and a mantissa cycle. What ' +
    'is the headline leverage number, why does the mantissa alternate, and does any of it ' +
    'move a bound?',
  headword: FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96247 verdict: ' +
    'H_required(E) = (3.0/E)^{2.5} costs exactly 2.5 height-decades per floor-decade ' +
    '(10^{2.5} ~ 316.23x), unbroken through floors 1e-9 (4.9295e23) and 1e-10 (1.5588e26), ' +
    'with the leading mantissa cycling 4.9295 -> 1.5588 by floor-exponent parity (odd -> ' +
    '4.9295, even -> 1.5588) -- a direct fingerprint of 1/kappa_star = 2.5 being a half-' +
    'integer. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96247 (the extended law and mantissa cycle this glosses); imp-96232 (floors ' +
    '1e-5..1e-8 union this extends); imp-2322 (forward E_trunc(T_PT) power law, elasticity ' +
    '-0.4); imp-486 (C_mb GUE-conditional).',
});

export default IMP96301_FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96301_FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96301-headword-has-required-fields',
    why: 'The headword must name the fixed 2.5-decade leverage and both mantissa values ' +
      '-- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96301_FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_GLOSSARY_HEADWORD.headword;
      return (
        /2\.5/.test(h.definition) &&
        /4\.9295/.test(h.definition) &&
        /1\.5588/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96301-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96301_FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96301_FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96301_FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_GLOSSARY_HEADWORD.verdict) &&
      IMP96301_FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_GLOSSARY_HEADWORD.glosses === 'imp-96247',
  },
];

for (const assertion of IMP96301_FLOOR_HEIGHT_LEVERAGE_MANTISSA_CYCLE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96301-floor-height-leverage-mantissa-cycle-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
