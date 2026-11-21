/**
 * imp-95438-sep-opt-input-reduction-ledger -- plain ledger of the classical
 * input inventory for the imp-95419 THEOREM SEP-OPT (class-optimal
 * off-lattice Riesz floor) chain, before and after imp-95420 THEOREM P-POS.
 *
 * GRADE: documentation only. This module imports no heavy bundle and proves
 * nothing new; it restates the imp-95419 / imp-95420 module text (LEMMA MIX,
 * LEMMA P-SYM, LEMMA P-JAC, LEMMA P-MONO, THEOREM P-POS) as a
 * {input, status, note} ledger in the same shape used by the imp-95388
 * seam-chain obligation ledger.
 *
 * BEFORE (imp-95419, as originally stated). LEMMA MIX represents
 * sech(x) = int_0^inf e^(-x^2 t) p(t) dt with theta density
 * p(t) = pi sum_(n>=0) (-1)^n (2n+1) e^(-(n+1/2)^2 pi^2 t), and needed
 * p(t) > 0 for sech(pi w) to be a genuine Gaussian-subordination mixture.
 * imp-95419 CITED this positivity from the Brownian first-exit-time
 * literature (Karatzas-Shreve Ch. 2 / Biane-Pitman-Yor, Bull. AMS 38
 * (2001)) and named a from-scratch proof "a named residual". THEOREM
 * SEP-OPT itself further cited the Carneiro-Littmann-Vaaler (CLV)
 * extremal-minorant existence/value theorem. Two cited classical inputs
 * total.
 *
 * AFTER (imp-95420). LEMMA P-SYM + LEMMA P-JAC + LEMMA P-MONO assemble a
 * SELF-CONTAINED elementary proof of THEOREM P-POS: p(t) > 0 for all
 * t > 0, with explicit two-sided enclosures in two overlapping regimes
 * (t >= 1/pi^2 direct form, 0 < t <= 1 dual form via a Poisson-summation
 * modular identity), glued because 1/pi^2 < 1. This dissolves the exit-time
 * citation. The only tools used are Poisson summation for Schwartz
 * functions plus the Gaussian Fourier pair -- the SAME classical tool
 * class imp-95419 already used for its own "elementary Poisson identity",
 * so no new citation class enters the ledger.
 *
 * NET EFFECT. The SEP-OPT chain's citation ledger drops from two
 * independent classical inputs (CLV + Brownian exit-time positivity) to
 * one (CLV alone), with Poisson summation carried forward as an
 * already-present elementary tool rather than a new dependency. No Lambda
 * bound moves; the imp-95419 module text and its baked
 * citedInputs.length === 2 assertion are a correct HISTORICAL record and
 * are deliberately left unedited -- imp-95420 is the supersession record.
 * NO QED. No refereed bound is changed.
 *
 * TICKET CROSS-REFERENCE. This ledger IS the honest-status note requested
 * by imp-95440 ("record that imp-95420 eliminated the Brownian exit-time
 * input, leaving CLV + Poisson"); no separate module is added to avoid
 * duplicating the same {input, status, note} content twice. It is ALSO
 * the honest-status note requested by imp-95453 (record the single-cited-
 * input state, that no bound moves, and that CLV self-containment is the
 * open assessment): imp-95441 already tested the two natural lighter
 * substitutes for the CLV input and found neither works, but proved no
 * FORMAL irreducibility theorem, so whether CLV admits a self-contained
 * elementary derivation stays an OPEN assessment, not a closed one.
 */

export const SEP_OPT_INPUT_REDUCTION_LEDGER = [
  {
    input: 'CLV extremal-minorant existence/value (Carneiro-Littmann-Vaaler, Trans. AMS 365 (2013))',
    status: 'STILL CITED',
    note:
      'the one non-elementary input THEOREM SEP-OPT rests on; unaffected ' +
      'by imp-95420 and remains a named residual; whether it admits a ' +
      'self-contained elementary derivation is the OPEN assessment of ' +
      'imp-95441 (negative for the two natural lighter substitutes tested, ' +
      'but no formal irreducibility theorem is proved)',
  },
  {
    input: 'Brownian first-exit-time density positivity (Karatzas-Shreve Ch. 2 / Biane-Pitman-Yor, Bull. AMS 38 (2001))',
    status: 'ELIMINATED',
    note:
      'imp-95420 THEOREM P-POS gives a self-contained elementary proof of ' +
      'p(t) > 0 for all t > 0 with explicit two-sided enclosures, ' +
      'dissolving this citation entirely',
  },
  {
    input: 'Poisson summation for Schwartz functions + Gaussian Fourier pair (Stein-Shakarchi, Fourier Analysis, Ch. 5)',
    status: 'CARRIED FORWARD (not new)',
    note:
      'imp-95420 LEMMA P-JAC uses this to build the modular dual identity, ' +
      'but it is the same classical tool class imp-95419 already used for ' +
      'its own elementary Poisson identity -- no new citation class is ' +
      'introduced',
  },
];

export const SEP_OPT_INPUT_REDUCTION_SUMMARY = {
  chain: 'imp-95419 THEOREM SEP-OPT (class-optimal off-lattice Riesz floor)',
  citedInputsBefore: 2,
  citedInputsAfter: 1,
  eliminatedInput: 'Brownian first-exit-time density positivity',
  remainingInput: 'CLV extremal-minorant existence/value',
  boundChange: false,
  qed: false,
};

export const IMP_95438_SEP_OPT_INPUT_REDUCTION_LEDGER = {
  id: 'imp-95438-sep-opt-input-reduction-ledger',
  title:
    'imp-95419/imp-95420 sech Gaussian-mixture representation (LEMMA MIX + ' +
    'THEOREM P-POS): plain ledger of how the SEP-OPT chain classical-input ' +
    'inventory shrinks from {CLV, Brownian exit-time} to {CLV} alone',
  ledger: SEP_OPT_INPUT_REDUCTION_LEDGER,
  summary: SEP_OPT_INPUT_REDUCTION_SUMMARY,
  note:
    'documentation only, citing imp-95419 (LEMMA MIX / THEOREM SEP-OPT) and ' +
    'imp-95420 (LEMMA P-SYM / LEMMA P-JAC / LEMMA P-MONO / THEOREM P-POS); ' +
    'no Lambda bound moves; no refereed bound is changed',
  closesTickets: ['imp-95440', 'imp-95453'],
};

// -- assertions (import-light; exact-literal consistency only) -------------
export const IMP_95438_ASSERTIONS = [
  {
    id: 'imp-95438-three-inputs-exhaustive',
    holds: () => SEP_OPT_INPUT_REDUCTION_LEDGER.length === 3,
    why: 'the SEP-OPT input ledger names exactly three items: the two original citations plus the carried-forward elementary tool.',
  },
  {
    id: 'imp-95438-net-count-drops-by-one',
    holds: () =>
      SEP_OPT_INPUT_REDUCTION_SUMMARY.citedInputsBefore -
        SEP_OPT_INPUT_REDUCTION_SUMMARY.citedInputsAfter ===
      1,
    why: 'imp-95420 eliminates exactly one of the two originally-cited classical inputs (Brownian exit-time positivity), leaving CLV alone.',
  },
  {
    id: 'imp-95438-eliminated-input-marked',
    holds: () =>
      SEP_OPT_INPUT_REDUCTION_LEDGER.some(
        (row) => row.input.includes('Brownian first-exit-time') && row.status === 'ELIMINATED',
      ),
    why: 'the Brownian exit-time citation must be the one marked ELIMINATED, per imp-95420 THEOREM P-POS.',
  },
  {
    id: 'imp-95438-clv-still-cited',
    holds: () =>
      SEP_OPT_INPUT_REDUCTION_LEDGER.some(
        (row) => row.input.includes('CLV extremal-minorant') && row.status === 'STILL CITED',
      ),
    why: 'the CLV extremal-minorant input is untouched by imp-95420 and remains the sole non-elementary citation.',
  },
  {
    id: 'imp-95438-not-a-bound',
    holds: () =>
      SEP_OPT_INPUT_REDUCTION_SUMMARY.boundChange === false && SEP_OPT_INPUT_REDUCTION_SUMMARY.qed === false,
    why: 'this is a documentation ledger of a citation-count reduction; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-95438-closes-imp-95440',
    holds: () => IMP_95438_SEP_OPT_INPUT_REDUCTION_LEDGER.closesTickets.includes('imp-95440'),
    why: 'imp-95440 asked for exactly this honest-status note (Brownian exit-time eliminated, CLV + Poisson remain); this ledger already delivers it, so it is recorded as closed here rather than duplicated.',
  },
  {
    id: 'imp-95438-closes-imp-95453',
    holds: () => IMP_95438_SEP_OPT_INPUT_REDUCTION_LEDGER.closesTickets.includes('imp-95453'),
    why: 'imp-95453 asked for the single-cited-input state plus a record that CLV self-containment is the open imp-95441 assessment; the CLV row note now carries that cross-reference.',
  },
  {
    id: 'imp-95438-clv-open-assessment-noted',
    holds: () =>
      SEP_OPT_INPUT_REDUCTION_LEDGER.find((row) => row.input.includes('CLV extremal-minorant')).note.includes(
        'imp-95441',
      ),
    why: 'the CLV row must point to imp-95441 as the open assessment of whether the input is self-contained, so the status surface does not overclaim closure.',
  },
];
