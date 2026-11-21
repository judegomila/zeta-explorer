/**
 * @module imp-95346-c3n-theta-uniform-tail-majorant-concept-note
 * @fileoverview imp-95346 -- import-light concept note for the imp-95329
 *   c3n theta-uniform geometric tail majorant and why the imp-95332
 *   per-chart cap c3nChart superseded it as the executed tail leg of the
 *   RZ-PEN symbol-pencil floor chain.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95329 introduces c3n as ONE closed-form constant that bounds the
 *   trace-tail sum over |n| >= 2 for every theta in [0, pi] at once.
 *   imp-95332 later replaces it, for the tail leg specifically, with a
 *   chart-local c3nChart(t0, t1). This note isolates c3n itself -- what
 *   it is built from and why it was the load-bearing closed form when
 *   it was introduced -- and states precisely what "superseded" does
 *   and does not mean, without restating the imp-95332 LEMMA TAIL-CHART
 *   construction already covered by imp-95344.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   The per-term trace weight t3(w) = c_alpha + min(kappa w^2, 2 +
 *   kappa2 w^2) is increasing in |w|, and the kernel P(w) decays like a
 *   geometric series in the shift index n (w_n = theta + 2 pi n). The
 *   imp-95288/imp-95328 tail majorants tA and tQ bound, respectively,
 *   the LINEAR-in-w and QUADRATIC-in-w geometric remainders of that
 *   decay by their WORST-CASE value over theta in [0, pi] -- i.e. tA
 *   and tQ are themselves already theta-uniform. Combining them via
 *   c3n = c_alpha tA + min(kappa tQ, 2 tA + kappa2 tQ) gives a single
 *   number that bounds the entire trace tail sum over |n| >= 2, for
 *   EVERY theta at once, no matter how close theta sits to the worst
 *   case. That uniformity is precisely what made c3n cheap to use: the
 *   THEOREM RZ-PEN3 two-chart floor (and the RZ-PEN4/RZ-PEN5 chart
 *   floors built on top of it) could carry one constant through every
 *   split point t and every chart without re-deriving a tail bound per
 *   chart.
 *
 *   WHY IT WAS LOAD-BEARING WHEN INTRODUCED
 *   -----------------------------------------------
 *   Before c3n, the beta-trace-capped chain had no closed form for the
 *   |n| >= 2 tail at all; c3n turned an infinite sum into one number,
 *   letting THEOREM RZ-PEN3 exist as a rigorous floor and letting
 *   imp-95330/imp-95331 carry that same tail constant forward unchanged
 *   while they sharpened the CHART leg and the NUMERATOR/root leg
 *   respectively. Every floor in the RZ-PEN3..RZ-PEN5 chain is only as
 *   tight as its worst-case-over-theta tail charge, and c3n was that
 *   charge.
 *
 *   WHY IT WAS SUPERSEDED (as the tail leg, not as a bound)
 *   -----------------------------------------------
 *   imp-95332 observes that a THEOREM RZ-PEN chart floor never actually
 *   needs the worst-case-over-[0,pi] tail charge -- it only needs a
 *   charge valid on the ONE chart [t0, t1] currently in play. Because
 *   the tail terms' arguments w_m = theta + 2 pi m range over a known,
 *   narrower sub-interval as theta ranges over that chart (rather than
 *   all of [0, pi]), the same (t3 nondecreasing, P decreasing) monotone
 *   pair LEMMA W-SPLIT already uses for the head terms extends to the
 *   tail terms, producing c3nChart(t0, t1) <= c3n on every chart, with
 *   equality only at the single globally-worst chart. c3nChart is
 *   nonincreasing under chart refinement and measured within 0.3
 *   percent of the true t3-weighted tail (max truth/cap 0.9978),
 *   whereas c3n pays the full worst-case penalty everywhere. That is
 *   what "superseded" means here: c3n stops being the constant THEOREM
 *   RZ-PEN6 charges for the tail, and c3nChart takes over that role.
 *
 *   WHAT SUPERSESSION DOES NOT MEAN
 *   -----------------------------------------------
 *   c3n is not withdrawn or shown incorrect -- it remains the exact
 *   constant c3nChart is proven never to exceed (the base case of the
 *   chart-refinement argument), it is unchanged in the earlier
 *   RZ-PEN3/RZ-PEN4/RZ-PEN5 floors imp-95332 does not retroactively
 *   rewrite, and it is reused verbatim inside the c3nChart construction
 *   itself (same tA/tQ machinery, re-anchored at the chart's own
 *   endpoints). imp-95332's fix is scoped to the tail leg alone: the
 *   two OTHER named residual legs -- the {0, +-1} pair-identity
 *   truncation (imp-95333) and the b-uniform t3 weight at interior
 *   frequencies (imp-95334) -- are untouched, and no certificate onset
 *   moves (the three every-octave onsets and the rho = 2 anchor are
 *   bitwise unchanged). It changes no bound of the program; Platt-
 *   Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-95329-beta-trace-capped-pencil-floor.js (source: c3n,
 *   LEMMA BCAP, LEMMA ACAP, THEOREM RZ-PEN3)
 * @see imp-95332-chart-tail-pencil-floor.js (source: LEMMA TAIL-CHART,
 *   the chart-local c3nChart that supersedes c3n as the tail charge)
 * @see imp-95344-tail-chart-per-chart-cap-concept-note.js (companion
 *   note: the LEMMA TAIL-CHART construction itself, not restated here)
 * @see imp-95333-*, imp-95334-* (the two OTHER named residual legs left
 *   open by imp-95332's tail-only fix)
 *
 * Ticket: imp-95346 (content, low). Documentation only; establishes no
 * new bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95329/95332).
const C3N_HEADWORD = Object.freeze({
  key: 'c3n-theta-uniform-geometric-tail-majorant',
  term:
    'c3n (theta-uniform geometric tail majorant): the imp-95329 closed ' +
    'form c3n = c_alpha tA + min(kappa tQ, 2 tA + kappa2 tQ), a single ' +
    'constant bounding the trace-tail sum over |n| >= 2 of ' +
    't3(|w_n|) P(|w_n|) for every theta in [0, pi] at once, built from ' +
    'the worst-case-over-theta geometric remainders tA (linear in w) ' +
    'and tQ (quadratic in w) of the exponentially decaying kernel P',
  whatItBounds:
    'The trace-tail sum over |n| >= 2 of t3(|w_n|) P(|w_n|), uniformly ' +
    'over ALL theta in [0, pi] at once: c3n is not chart-local, it pays ' +
    'the worst-case penalty everywhere so that one number can be reused ' +
    'at every split point t and every chart of the RZ-PEN3/4/5 chain.',
  whyItWasLoadBearing:
    'Before c3n the beta-trace-capped chain had no closed form for the ' +
    '|n| >= 2 tail; c3n turned an infinite sum into one number, letting ' +
    'THEOREM RZ-PEN3 exist as a rigorous floor, and imp-95330/imp-95331 ' +
    'carried the same tail constant forward UNCHANGED while sharpening ' +
    'the chart and numerator/root legs instead.',
  whySuperseded:
    'imp-95332 LEMMA TAIL-CHART observes a chart floor only needs a tail ' +
    'charge valid on its OWN chart [t0, t1], not on all of [0, pi]; ' +
    'extending the LEMMA W-SPLIT (t3 nondecreasing, P decreasing) ' +
    'monotone pair from the head terms to the tail terms gives ' +
    'c3nChart(t0, t1) <= c3n on every chart (equality only at the ' +
    'single globally-worst chart), nonincreasing under refinement and ' +
    'within 0.3 percent of the true tail (max truth/cap 0.9978): c3n ' +
    'stops being the constant charged for the tail, c3nChart takes over.',
  whatSupersessionDoesNotMean:
    'c3n is not withdrawn or shown incorrect: it is the exact base case ' +
    'c3nChart is proven never to exceed, it stays unchanged inside the ' +
    'earlier RZ-PEN3/4/5 floors imp-95332 does not retroactively ' +
    'rewrite, and c3nChart itself reuses the same tA/tQ machinery re-' +
    'anchored per chart. The two OTHER named residual legs (pair-' +
    'identity truncation, b-uniform t3 weight) are untouched, and no ' +
    'certificate onset moves.',
});

export const IMP95346_C3N_THETA_UNIFORM_TAIL_MAJORANT_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95346',
  proofSection: 'S-frontier',
  glosses: 'imp-95329',
  scopes:
    'c3n: the imp-95329 theta-uniform closed-form tail majorant, and ' +
    'its supersession by the imp-95332 chart-local c3nChart as the ' +
    'executed tail leg of the RZ-PEN symbol-pencil floor chain',
  question:
    'What does the imp-95329 c3n theta-uniform geometric tail majorant ' +
    'establish, and in what precise sense does the imp-95332 per-chart ' +
    'cap c3nChart supersede it?',
  headword: C3N_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95329 c3n construction and why it was the load-bearing closed ' +
    'tail bound when introduced, and clarifies that the imp-95332 ' +
    'supersession is scoped to the tail LEG (c3n replaced by c3nChart ' +
    'as the charged constant) rather than a retraction of c3n, which ' +
    'remains the base case c3nChart never exceeds. Establishes nothing ' +
    'new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95329-beta-trace-capped-pencil-floor.js (c3n, LEMMA BCAP, ' +
    'LEMMA ACAP, THEOREM RZ-PEN3); imp-95332-chart-tail-pencil-floor.js ' +
    '(LEMMA TAIL-CHART, c3nChart); imp-95344-tail-chart-per-chart-cap-' +
    'concept-note.js (companion note on the LEMMA TAIL-CHART construction).',
});

export default IMP95346_C3N_THETA_UNIFORM_TAIL_MAJORANT_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95346_C3N_THETA_UNIFORM_TAIL_MAJORANT_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95346-headword-has-required-fields',
    why:
      'The concept note must state what c3n bounds, why it was load-' +
      'bearing when introduced, why it was superseded (as the executed ' +
      'tail leg), and what supersession does not mean (c3n is not ' +
      'withdrawn) -- the entire point of the note.',
    holds: () => {
      const h = IMP95346_C3N_THETA_UNIFORM_TAIL_MAJORANT_CONCEPT_NOTE.headword;
      return (
        /c_alpha tA/.test(h.term) &&
        /uniformly over ALL theta/.test(h.whatItBounds) &&
        /rigorous floor/.test(h.whyItWasLoadBearing) &&
        /c3nChart\(t0, t1\) <= c3n/.test(h.whySuperseded) &&
        /0\.9978/.test(h.whySuperseded) &&
        /not withdrawn/.test(h.whatSupersessionDoesNotMean)
      );
    },
  },
  {
    id: 'imp95346-c3n-matches-carried-literal-self-contained',
    why:
      'The note describes c3n = c_alpha tA + min(kappa tQ, 2 tA + ' +
      'kappa2 tQ) at a = 6; verify this independent, self-contained ' +
      'reproduction (no import of imp-95329) matches the c3nA6 literal ' +
      'the imp-95332 module carries forward unchanged (1.0900576676380063).',
    holds: () => {
      const PI = Math.PI;
      const sechHalf = (u) => 1 / Math.cosh(u / 2);
      function c3nAt(a) {
        const c = Math.cosh(a / 2);
        const pi2 = PI * PI;
        const kap = (4 * c) / (a * a);
        const kap2 = 4 / (a * a);
        const cAlpha = 2 / (1 + sechHalf(a));
        const e2 = Math.exp((-2 * pi2) / a);
        const e3 = Math.exp((-3 * pi2) / a);
        const tA = (((8 * PI) / a) * e3) / (1 - e2);
        const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
        return cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
      }
      const CARRIED_C3N_A6 = 1.0900576676380063;
      return Math.abs(c3nAt(6) - CARRIED_C3N_A6) < 1e-9 * Math.max(1, CARRIED_C3N_A6);
    },
  },
  {
    id: 'imp95346-c3nchart-never-exceeds-c3n-self-contained',
    why:
      'The note claims c3nChart(t0, t1) <= c3n on every chart, with ' +
      'equality approached only at the globally-worst chart; verify ' +
      'directly with an independent, self-contained reproduction of ' +
      'both constructions (no import of imp-95329 or imp-95332).',
    holds: () => {
      const PI = Math.PI;
      const sechHalf = (u) => 1 / Math.cosh(u / 2);
      const kernelP = (w, a) => ((2 * PI) / a) / Math.cosh((PI * w) / a);
      function baseParams(a) {
        const c = Math.cosh(a / 2);
        const kap = (4 * c) / (a * a);
        const kap2 = 4 / (a * a);
        const cAlpha = 2 / (1 + sechHalf(a));
        const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
        return { kap, kap2, cAlpha, tw };
      }
      function c3nAt(a) {
        const pi2 = PI * PI;
        const { kap, kap2, cAlpha } = baseParams(a);
        const e2 = Math.exp((-2 * pi2) / a);
        const e3 = Math.exp((-3 * pi2) / a);
        const tA = (((8 * PI) / a) * e3) / (1 - e2);
        const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
        return cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
      }
      function c3nChart(a, t0, t1, N = 12) {
        const { kap, kap2, cAlpha, tw } = baseParams(a);
        let s = 0;
        for (let m = 2; m <= N; m++) {
          s += tw(2 * PI * m + t1) * kernelP(2 * PI * m + t0, a);
          s += tw(2 * PI * m - t0) * kernelP(2 * PI * m - t1, a);
        }
        const pi2 = PI * PI;
        const e2 = Math.exp((-2 * pi2) / a);
        const eA = Math.exp((-(2 * N + 1) * pi2) / a);
        const tAr = (((8 * PI) / a) * eA) / (1 - e2);
        const tQr =
          (((8 * (2 * N + 3) ** 2 * PI ** 3) / a) * eA) / (1 - 4 * e2);
        return s + cAlpha * tAr + Math.min(kap * tQr, 2 * tAr + kap2 * tQr);
      }
      for (const a of [Math.LN2, Math.log(10), 6]) {
        const c3n = c3nAt(a);
        for (const k of [0, 63, 114, 200, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          if (c3nChart(a, t0, t1) > c3n * (1 + 1e-9)) return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp95346-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present, glosses and scopes fields consistent.',
    holds: () =>
      IMP95346_C3N_THETA_UNIFORM_TAIL_MAJORANT_CONCEPT_NOTE
        .anyEnclosureEstablished === false &&
      /refereed bound is changed/i.test(
        IMP95346_C3N_THETA_UNIFORM_TAIL_MAJORANT_CONCEPT_NOTE.verdict
      ) &&
      IMP95346_C3N_THETA_UNIFORM_TAIL_MAJORANT_CONCEPT_NOTE.glosses ===
        'imp-95329' &&
      IMP95346_C3N_THETA_UNIFORM_TAIL_MAJORANT_CONCEPT_NOTE.scopes ===
        'c3n: the imp-95329 theta-uniform closed-form tail majorant, and ' +
          'its supersession by the imp-95332 chart-local c3nChart as the ' +
          'executed tail leg of the RZ-PEN symbol-pencil floor chain',
  },
];

for (const assertion of IMP95346_C3N_THETA_UNIFORM_TAIL_MAJORANT_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95346-c3n-theta-uniform-tail-majorant-concept-note assertion failed: ${assertion.id}`
    );
  }
}
