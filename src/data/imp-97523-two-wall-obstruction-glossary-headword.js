/**
 * @module imp-97523-two-wall-obstruction-glossary-headword
 * @fileoverview imp-97523 -- import-light glossary/Concepts headword recording the imp-97502
 *   two-wall obstruction: the pair of structural reasons every NAMED band-limited concentration /
 *   uncertainty inequality (Donoho-Stark, Turan / Amrein-Berthier-Nazarov, Nazarov / Turan-Nazarov
 *   reverse-Holder, Paneah / Logvinenko-Sereda) fails to certify a positive lower bound c>0 on the
 *   shared de Branges coercivity primitive for the Krein c_sharp constant at 2a = ln3.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE SPLIT. Splitting the Rayleigh numerator at the confined negative set
 *   E = {t : sigma_2(t) < 0} = |t| in [0,3.306] u [6.945,10.532] gives
 *   int sigma_2 |psi|^2 >= (inf_E sigma_2) * theta * ||psi||^2 = -4336.198 * theta * ||psi||^2,
 *   where theta = int_E |psi|^2 / ||psi||^2 is the mass FRACTION a named tool can bound.
 *   (b) WALL A -- DEPTH. Even a perfect theta_max < 1 gives only c >= -4336.198 * theta_max, so a
 *   usable c ~ 0.5 needs theta_max < 1.15e-4 -- absurd on |E| ~ 13.79 at time-bandwidth product
 *   |E|*2a = 15.15 (2.41 in the 2pi convention), where the top Slepian concentration eigenvalues
 *   sit near 1.
 *   (c) WALL B -- SIGN/WEIGHT. Every named tool bounds int_E |psi|^2 against Lebesgue measure of E
 *   (an indicator / support-size / relative-measure statement), never the signed int sigma_2 |psi|^2
 *   against the actual weight; converting also needs a matching lower bound on the positive part
 *   int_{E^c} sigma_2 |psi|^2, unavailable because sigma_2 -> 0^+ at the well edges
 *   (sigma_2(3.306) = +0.10, sigma_2(10.532) = +8.18).
 *   (d) WHY BOTH BLOCK EVERY NAMED TOOL. Donoho-Stark is vacuous outright (|T||W| = 15.15 >> 1,
 *   needs <1); Amrein-Berthier-Nazarov and Nazarov/Turan-Nazarov reverse-Holder have constants
 *   exponentially close to trivial at this time-bandwidth product; Logvinenko-Sereda bounds the
 *   wrong (positive, thick) side with an exponentially small gamma -- each hits Wall B, and any of
 *   them clearing Wall B would still need to clear Wall A.
 *   (e) STATUS: documentation only. No positive lower bound on c_sharp exists; no operator
 *   positivity established; interval-rigorous reach stays 2a<=0.96; no bound moves.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   obstruction. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97502-krein-named-concentration-inequality-assessment.js (source: the tool-by-tool
 *   derivation establishing the two-wall obstruction)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (the shared band-limited
 *   concentration primitive both walls block)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (Beurling-Selberg circular; flat
 *   Slepian violated -- the earlier assessment imp-97502 confirms and extends)
 *
 * Ticket: imp-97523 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

import { IMP97502_WELL, IMP97502_CONVERSION, IMP97502_VERDICT } from './imp-97502-krein-named-concentration-inequality-assessment.js';

// The two-wall headword, baked verbatim (no re-import of the full assessment).
const TWO_WALL_OBSTRUCTION_HEADWORD = Object.freeze({
  key: 'two-wall-obstruction-band-limited-concentration-imp97502',
  term:
    'two-wall obstruction: the pair of structural reasons every named band-limited concentration ' +
    'inequality fails to certify a positive lower bound on the Krein c_sharp coercivity primitive',
  definition:
    'Splitting int sigma_2 |psi|^2 at the confined negative well E = {t : sigma_2(t) < 0} gives ' +
    'int sigma_2 |psi|^2 >= -4336.198 * theta * ||psi||^2 with theta the mass fraction inside E. ' +
    'A named concentration tool bounding theta <= theta_max hits WALL A (depth: -4336.198 dominates ' +
    'any theta_max not below ~1.15e-4) and/or WALL B (sign/weight: the tool bounds Lebesgue measure ' +
    'of E, never the signed weight sigma_2, and sigma_2 -> 0^+ at the well edges so no positive-part ' +
    'floor is available to buy the discarded far-field back).',
  mechanism:
    'Every named tool imp-97502 examined hits at least one wall at 2a = ln3: Donoho-Stark is ' +
    'vacuous outright (time-bandwidth product |E|*2a = 15.15 exceeds the non-triviality threshold ' +
    '1); Amrein-Berthier-Nazarov and Nazarov/Turan-Nazarov reverse-Holder have constants ' +
    'exponentially close to trivial at this product; Logvinenko-Sereda bounds mass on the wrong ' +
    '(thick, positive) side with an exponentially small gamma. All four are indicator/support-size ' +
    'statements (Wall B), so even one that cleared Wall B would still face Wall A.',
  verificationStatus:
    'Re-cited from the imp-97502 tool-by-tool assessment ' +
    '(src/data/imp-97502-krein-named-concentration-inequality-assessment.js), which extends the ' +
    'imp-97161 Beurling-Selberg / flat-Slepian assessment to Donoho-Stark, Turan / Amrein-Berthier, ' +
    'Nazarov / Turan-Nazarov, and Paneah / Logvinenko-Sereda. Naming / glossary headword only; ' +
    'supplies no new bound; RH open; no refereed bound is changed; NO QED.',
});

export const IMP97523_TWO_WALL_OBSTRUCTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97523',
  proofSection: 'S-frontier',
  glosses: 'imp-97502',
  question:
    'imp-97502 assessed four named band-limited concentration inequalities (Donoho-Stark, Turan / ' +
    'Amrein-Berthier-Nazarov, Nazarov / Turan-Nazarov reverse-Holder, Paneah / Logvinenko-Sereda) ' +
    'against the shared Krein c_sharp coercivity primitive at 2a = ln3 and found each blocked by one ' +
    'or both of two structural walls. What is the headword for this two-wall obstruction?',
  headword: TWO_WALL_OBSTRUCTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97502 two-wall obstruction: ' +
    'WALL A (depth -4336.198 defeats any mass-fraction ceiling not below ~1.15e-4) and WALL B ' +
    '(named tools bound an indicator against Lebesgue measure, never the signed sigma_2 weight, ' +
    'which vanishes at the well edges). No bound moved; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97502 (the tool-by-tool derivation of the two-wall obstruction); imp-97350 (the shared ' +
    'primitive both walls block); imp-97161 (the earlier Beurling-Selberg / flat-Slepian assessment ' +
    'this confirms and extends).',
});

export default IMP97523_TWO_WALL_OBSTRUCTION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97523_TWO_WALL_OBSTRUCTION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97523-headword-names-both-walls',
    why: 'The headword must name both structural walls (depth, sign/weight) -- the entire content ' +
      'of the glossary entry.',
    holds: () => {
      const h = IMP97523_TWO_WALL_OBSTRUCTION_GLOSSARY_HEADWORD.headword;
      return (
        /-4336\.198/.test(h.definition) &&
        /WALL A/.test(h.definition) &&
        /WALL B/.test(h.definition) &&
        /Donoho-Stark/.test(h.mechanism) &&
        /Logvinenko-Sereda/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97523-consistent-with-imp97502-source-figures',
    why: 'The re-cited well geometry and conversion constants must match the imp-97502 source ' +
      'module exactly -- this is a glossary headword, not an independent re-derivation.',
    holds: () =>
      Math.abs(IMP97502_WELL.globalInf + 4336.198) < 1e-2 &&
      Math.abs(IMP97502_WELL.measureE - 13.786) < 1e-9 &&
      Math.abs(IMP97502_CONVERSION.timeBandwidthProduct_freqBand - 15.15) < 0.01 &&
      IMP97502_VERDICT.wallA_depthDominatesMassFractionBound === true &&
      IMP97502_VERDICT.wallB_indicatorNotSignedWeight === true &&
      IMP97502_VERDICT.anyNamedToolSuppliesC === false,
  },
  {
    id: 'imp97523-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97502.',
    holds: () =>
      IMP97523_TWO_WALL_OBSTRUCTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97523_TWO_WALL_OBSTRUCTION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97523_TWO_WALL_OBSTRUCTION_GLOSSARY_HEADWORD.verdict) &&
      IMP97523_TWO_WALL_OBSTRUCTION_GLOSSARY_HEADWORD.glosses === 'imp-97502',
  },
];

for (const assertion of IMP97523_TWO_WALL_OBSTRUCTION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97523-two-wall-obstruction-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
