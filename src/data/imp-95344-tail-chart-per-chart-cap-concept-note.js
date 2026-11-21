/**
 * @module imp-95344-tail-chart-per-chart-cap-concept-note
 * @fileoverview imp-95344 -- import-light concept note for the imp-95332
 *   LEMMA TAIL-CHART per-chart tail cap and the role it plays in
 *   exhausting the c3n tail leg of the RZ-PEN symbol-pencil floor chain.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95332 assembles THEOREM RZ-PEN6 and COROLLARY PEN-UNIF6 from
 *   LEMMA TAIL-CHART composed with the carried imp-95329 per-term trace
 *   cap, the imp-95288 pair identity and the imp-95330/imp-95331 chart
 *   floors. This note isolates LEMMA TAIL-CHART -- the single move that
 *   replaces a theta-uniform tail majorant with an exact per-chart one --
 *   without restating the surrounding THEOREM/COROLLARY machinery or the
 *   two OTHER named residual legs (pair-identity truncation, b-uniform
 *   t3 weight) that LEMMA TAIL-CHART does not touch.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   The imp-95329 trace cap 2B/A <= sum_n t3(|w_n|) P(|w_n|) splits into
 *   a HEAD (|n| <= 1, charged exactly per chart by LEMMA W-SPLIT) and a
 *   TAIL (|n| >= 2), which imp-95329 bounded by a single THETA-UNIFORM
 *   constant c3n -- the worst case over all theta in [0, pi] at once.
 *   LEMMA TAIL-CHART observes that the SAME monotone pair LEMMA W-SPLIT
 *   already uses for the head (t3 nondecreasing in w, P strictly
 *   decreasing in |w|) applies just as well to each tail term: on a
 *   fixed chart [t0, t1], the m-th tail term's argument w_m = theta +
 *   2 pi m ranges over a known sub-interval as theta ranges over the
 *   chart, so t3(|w_m|) P(|w_m|) is dominated by its value at the
 *   chart's OWN endpoints, not the endpoints of [0, pi]. Charging the
 *   finitely many terms m = 2..N this way, and re-anchoring the imp-95329
 *   geometric remainder at (2N + 1) pi for m >= N + 1, produces
 *   c3nChart(t0, t1) -- a cap that is nonincreasing as the chart shrinks
 *   and therefore strictly tighter than c3n on every chart but the
 *   worst-case one.
 *
 *   WHY IT IS THE LOAD-BEARING STEP (contrasted with the uniform c3n)
 *   -----------------------------------------------
 *   Before imp-95332, the imp-95329/95330/95331 chain carried three
 *   named residual legs against the exact symbol-pencil infimum: the
 *   {0, +-1} pair-identity truncation, the theta-uniform c3n tail
 *   majorant, and the b-uniform t3 weight. LEMMA TAIL-CHART executes the
 *   TAIL leg specifically: it is not a new inequality technique but the
 *   observation that a bound already proved chartwise for the head
 *   terms extends, term by term, to every tail term as well -- so the
 *   same per-chart machinery that made LEMMA W-SPLIT chart-sharp also
 *   makes the tail chart-sharp, with no new monotonicity lemma required.
 *   The measured effect is an EXHAUSTION: dense in-chart sampling shows
 *   the cap sits within 0.3 percent of the true t3-weighted tail
 *   (max truth/cap 0.9978), so no further chartwise refinement of the
 *   tail alone can recover more than a fraction of a percent -- the
 *   remaining large-rho looseness (3.0-5.1x at rho = e^6) now lives
 *   ENTIRELY in the other two legs, which imp-95344 leaves untouched.
 *
 *   WHAT IT DOES NOT DO (a closed tail leg, not a closed chain)
 *   -----------------------------------------------
 *   LEMMA TAIL-CHART does not touch the {0, +-1} pair-identity
 *   truncation (still open; imp-95333) or the b-uniform t3 weight at
 *   interior frequencies (still open; imp-95334 obstructs a fully
 *   uniform version and supplies a chartwise BCAP substitute instead).
 *   It moves no certificate onset -- the three every-octave firing
 *   onsets (13.297836 / 13.071303 / 12.817538) and the rho = 2
 *   certificate anchor are bitwise unchanged, since the new branch only
 *   activates above the exact-root crossover rho > ~6.5. It changes no
 *   bound of the program; no refereed bound is changed.
 *
 * @see imp-95332-chart-tail-pencil-floor.js (source: LEMMA TAIL-CHART,
 *   THEOREM RZ-PEN6, COROLLARY PEN-UNIF6)
 * @see imp-95329-* (source: the theta-uniform c3n tail majorant LEMMA
 *   TAIL-CHART replaces, and the LEMMA W-SPLIT head-term monotone pair
 *   it reuses)
 * @see imp-95330-*, imp-95331-* (the carried chart floors V4_k / Psi5_k
 *   that THEOREM RZ-PEN6 composes with the new Psi6_k)
 * @see imp-95333-*, imp-95334-* (the two OTHER named residual legs --
 *   pair-identity truncation and b-uniform t3 weight -- that this note,
 *   and imp-95332 itself, leave open)
 *
 * Ticket: imp-95344 (content, low). Documentation only; establishes no
 * new bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95332).
const TAIL_CHART_HEADWORD = Object.freeze({
  key: 'tail-chart-per-chart-tail-cap',
  term:
    'LEMMA TAIL-CHART (per-chart tail cap): on a chart [t0, t1], the ' +
    'trace-tail terms |n| >= 2 are charged at their exact chart-' +
    'endpoint values via the same (t3 nondecreasing, P decreasing) ' +
    'monotone pair LEMMA W-SPLIT uses for the head terms, replacing ' +
    'the imp-95329 theta-uniform constant c3n with a chart-local ' +
    'c3nChart(t0, t1)',
  whatItBounds:
    'The trace-tail sum over |n| >= 2 of t3(|w_n|) P(|w_n|) for theta ' +
    'restricted to a fixed chart [t0, t1], via c3nChart(t0, t1): the ' +
    'same LEMMA W-SPLIT (t3 nondecreasing, P decreasing) monotone pair ' +
    'used for the head terms, applied to m = 2..N tail terms charged ' +
    'at chart endpoints, plus a geometric remainder re-anchored at ' +
    '(2N + 1) pi -- nonincreasing under chart refinement, so it is a ' +
    'strict local sharpening of the worst-case-over-[0,pi] constant ' +
    'c3n on every chart but the single worst one.',
  whyItIsLoadBearing:
    'The prior imp-95329/95330/95331 chain carried three named ' +
    'residual legs: {0, +-1} pair-identity truncation, the theta-' +
    'uniform c3n tail, and the b-uniform t3 weight. LEMMA TAIL-CHART ' +
    'executes the tail leg by extending the already-chartwise LEMMA ' +
    'W-SPLIT monotone pair from the head terms to every tail term, no ' +
    'new technique required, and the measured cap sits within 0.3 ' +
    'percent of the true t3-weighted tail (max truth/cap 0.9978): the ' +
    'tail leg is EXHAUSTED, so the remaining large-rho looseness now ' +
    'lives entirely in the other two legs.',
  whyItIsSharp:
    'Dense in-chart sampling (51 theta per chart, |n| up to 80) at the ' +
    'binding, first and last charts across a in {ln 2, ln 4, ln 10, 5, ' +
    '6} shows the true t3-weighted tail never exceeds c3nChart and is ' +
    'NEAR-ATTAINED (max truth/cap 0.9978); the numeric m = 13..300 ' +
    'remainder sits 2.5-160x below the re-anchored geometric bound ' +
    'rem(12) at the extreme charts, so the truncation constant is not ' +
    'the binding piece.',
  whatItDoesNotDo:
    'LEMMA TAIL-CHART supplies no closed sharpening of the {0, +-1} ' +
    'pair-identity truncation (imp-95333, still open) or the b-uniform ' +
    't3 weight at interior frequencies (imp-95334, obstructed in full ' +
    'generality); it moves no certificate onset (all three every-' +
    'octave onsets and the rho = 2 anchor are bitwise unchanged) and ' +
    'establishes no new program bound.',
  endpointBoundsAndClosure:
    'The two-sided per-term endpoint brackets that license charging ' +
    'each tail term at chart endpoints: for theta in [t0, t1] and ' +
    'm >= 2, |w_m| = theta + 2 pi m lies in [2 pi m + t0, 2 pi m + t1] ' +
    'and |w_{-m}| = 2 pi m - theta lies in [2 pi m - t1, 2 pi m - t0] ' +
    '(positive since 2 pi m - pi > 0). The m >= N + 1 remainder series ' +
    'closes because 4 e2 < 1 with e2 = exp(-2 pi^2 / a), which holds ' +
    'throughout the working range a in (0, 6] since 6 < 2 pi^2 / ln 4 ' +
    '(approx 14.24) -- the same geometric-step condition the imp-95329 ' +
    'theta-uniform c3n already relies on, re-anchored at (2N + 1) pi.',
});

export const IMP95344_TAIL_CHART_PER_CHART_CAP_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95344',
  proofSection: 'S-frontier',
  glosses: 'imp-95332',
  scopes:
    'LEMMA TAIL-CHART: chartwise trace-tail cap c3nChart(t0, t1) ' +
    'replacing the theta-uniform c3n, via the LEMMA W-SPLIT (t3 ' +
    'nondecreasing, P decreasing) monotone pair applied to tail terms',
  question:
    'What does the imp-95332 LEMMA TAIL-CHART per-chart tail cap ' +
    'establish, and why does extending the LEMMA W-SPLIT head-term ' +
    'monotone pair to the tail terms exhaust the c3n tail leg of the ' +
    'RZ-PEN symbol-pencil floor chain?',
  headword: TAIL_CHART_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95332 LEMMA TAIL-CHART chartwise tail-cap construction and why ' +
    'reusing the LEMMA W-SPLIT monotone pair on the tail terms exhausts ' +
    'the c3n tail leg (max truth/cap 0.9978), while noting the two ' +
    'other named residual legs (pair-identity truncation, b-uniform t3 ' +
    'weight) remain open and no certificate onset moves. Establishes ' +
    'nothing new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95332-chart-tail-pencil-floor.js (LEMMA TAIL-CHART, THEOREM ' +
    'RZ-PEN6, COROLLARY PEN-UNIF6); imp-95329-* (theta-uniform c3n and ' +
    'LEMMA W-SPLIT monotone pair it reuses); imp-95330-*, imp-95331-* ' +
    '(carried chart floors).',
});

export default IMP95344_TAIL_CHART_PER_CHART_CAP_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95344_TAIL_CHART_PER_CHART_CAP_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95344-headword-has-required-fields',
    why:
      'The concept note must state what LEMMA TAIL-CHART bounds, why it ' +
      'is load-bearing (exhausting the tail leg), why it is sharp ' +
      '(near-attained truth/cap ratio), and what it does not itself ' +
      'supply (the two other open residual legs) -- the entire point of ' +
      'the note.',
    holds: () => {
      const h = IMP95344_TAIL_CHART_PER_CHART_CAP_CONCEPT_NOTE.headword;
      return (
        /c3nChart/.test(h.whatItBounds) &&
        /LEMMA W-SPLIT/.test(h.whatItBounds) &&
        /EXHAUSTED/.test(h.whyItIsLoadBearing) &&
        /0\.9978/.test(h.whyItIsLoadBearing) &&
        /NEAR-ATTAINED/.test(h.whyItIsSharp) &&
        /pair-identity truncation/.test(h.whatItDoesNotDo) &&
        /b-uniform t3/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95344-per-chart-cap-dominates-per-chart-truth-self-contained',
    why:
      'The note claims the per-chart tail cap (chart-endpoint charging ' +
      'of m = 2..N terms plus a re-anchored geometric remainder) ' +
      'dominates the true tail sum restricted to that chart, tighter ' +
      'than a theta-uniform constant; verify this directly with an ' +
      'independent, self-contained reproduction of the construction ' +
      '(no import of imp-95332).',
    holds: () => {
      const PI = Math.PI;
      const sechHalf = (u) => 1 / Math.cosh(u / 2);
      const kernelP = (w, a) => ((2 * PI) / a) / Math.cosh((PI * w) / a);
      const cAlpha = (a) => 2 / (1 + sechHalf(a));
      const kap = (a) => (4 * Math.cosh(a / 2)) / (a * a);
      const kap2 = (a) => 4 / (a * a);
      const tw = (w, a) =>
        cAlpha(a) + Math.min(kap(a) * w * w, 2 + kap2(a) * w * w);

      const N = 12;
      function chartCap(a, t0, t1) {
        let s = 0;
        for (let m = 2; m <= N; m++) {
          s += tw(2 * PI * m + t1, a) * kernelP(2 * PI * m + t0, a);
          s += tw(2 * PI * m - t0, a) * kernelP(2 * PI * m - t1, a);
        }
        const pi2 = PI * PI;
        const e2 = Math.exp((-2 * pi2) / a);
        const eA = Math.exp((-(2 * N + 1) * pi2) / a);
        const tAr = (((8 * PI) / a) * eA) / (1 - e2);
        const tQr =
          (((8 * (2 * N + 3) ** 2 * PI ** 3) / a) * eA) / (1 - 4 * e2);
        return s + cAlpha(a) * tAr + Math.min(kap(a) * tQr, 2 * tAr + kap2(a) * tQr);
      }
      function trueTailAt(theta, a, upTo = 200) {
        let truth = 0;
        for (let n = 2; n <= upTo; n++) {
          truth += tw(theta + 2 * PI * n, a) * kernelP(theta + 2 * PI * n, a);
          truth += tw(2 * PI * n - theta, a) * kernelP(2 * PI * n - theta, a);
        }
        return truth;
      }
      for (const a of [Math.LN2, Math.log(10), 6]) {
        for (const k of [0, 114, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          const cap = chartCap(a, t0, t1);
          for (let i = 0; i <= 5; i++) {
            const theta = t0 + ((t1 - t0) * i) / 5;
            if (trueTailAt(theta, a) > cap * (1 + 1e-9)) return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: 'imp95344-chart-refinement-tightens-below-uniform-constant',
    why:
      'The note claims the per-chart cap is nonincreasing under chart ' +
      'refinement, and (except at the single worst-case chart) tighter ' +
      'than the theta-uniform constant c3n it replaces; verify directly.',
    holds: () => {
      const PI = Math.PI;
      const sechHalf = (u) => 1 / Math.cosh(u / 2);
      const kernelP = (w, a) => ((2 * PI) / a) / Math.cosh((PI * w) / a);
      const cAlpha = (a) => 2 / (1 + sechHalf(a));
      const kap = (a) => (4 * Math.cosh(a / 2)) / (a * a);
      const kap2 = (a) => 4 / (a * a);
      const tw = (w, a) =>
        cAlpha(a) + Math.min(kap(a) * w * w, 2 + kap2(a) * w * w);
      const N = 12;
      function chartCap(a, t0, t1) {
        let s = 0;
        for (let m = 2; m <= N; m++) {
          s += tw(2 * PI * m + t1, a) * kernelP(2 * PI * m + t0, a);
          s += tw(2 * PI * m - t0, a) * kernelP(2 * PI * m - t1, a);
        }
        const pi2 = PI * PI;
        const e2 = Math.exp((-2 * pi2) / a);
        const eA = Math.exp((-(2 * N + 1) * pi2) / a);
        const tAr = (((8 * PI) / a) * eA) / (1 - e2);
        const tQr =
          (((8 * (2 * N + 3) ** 2 * PI ** 3) / a) * eA) / (1 - 4 * e2);
        return s + cAlpha(a) * tAr + Math.min(kap(a) * tQr, 2 * tAr + kap2(a) * tQr);
      }
      const a = 6;
      // The imp-95329 theta-uniform c3n, an independent closed form (not
      // itself a chart cap): c3n = cAlpha*tA + min(kap*tQ, 2*tA+kap2*tQ).
      const pi2 = PI * PI;
      const e2 = Math.exp((-2 * pi2) / a);
      const e3 = Math.exp((-3 * pi2) / a);
      const tA = (((8 * PI) / a) * e3) / (1 - e2);
      const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
      const uniformC3n =
        cAlpha(a) * tA + Math.min(kap(a) * tQ, 2 * tA + kap2(a) * tQ);
      for (const k of [0, 5, 63, 114, 200, 255]) {
        const t0 = (PI * k) / 256;
        const t1 = (PI * (k + 1)) / 256;
        const mid = (t0 + t1) / 2;
        const coarse = chartCap(a, t0, t1);
        if (chartCap(a, t0, mid) > coarse * (1 + 1e-12)) return false;
        if (chartCap(a, mid, t1) > coarse * (1 + 1e-12)) return false;
        if (coarse > uniformC3n * (1 + 1e-9)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95344-two-sided-endpoint-bounds-and-series-closure',
    why:
      'The note claims a specific two-sided endpoint bracket for ' +
      '|w_{+-m}| on a chart [t0, t1] and that the tail remainder series ' +
      'closes because 4 e2 < 1 throughout a in (0, 6]; verify both ' +
      'directly and independently (no import of imp-95332).',
    holds: () => {
      const PI = Math.PI;
      // Two-sided endpoint brackets, several charts and m.
      for (const a of [0.5, Math.LN2, 3, 6]) {
        for (const [t0, t1] of [[0, PI], [0.3, 0.9], [PI - 0.2, PI]]) {
          for (let m = 2; m <= 6; m++) {
            for (let i = 0; i <= 4; i++) {
              const theta = t0 + ((t1 - t0) * i) / 4;
              const wPlus = theta + 2 * PI * m;
              const wMinus = 2 * PI * m - theta;
              if (wPlus < 2 * PI * m + t0 - 1e-9 || wPlus > 2 * PI * m + t1 + 1e-9)
                return false;
              if (wMinus < 2 * PI * m - t1 - 1e-9 || wMinus > 2 * PI * m - t0 + 1e-9)
                return false;
              if (wMinus <= 0) return false;
            }
          }
        }
      }
      // Series-closure condition 4 e2 < 1 throughout the working range.
      for (const a of [0.01, 0.5, 1, 3, 6]) {
        const e2 = Math.exp((-2 * PI * PI) / a);
        if (!(4 * e2 < 1)) return false;
      }
      if (!(6 < (2 * PI * PI) / Math.log(4))) return false;
      return true;
    },
  },
  {
    id: 'imp95344-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present, glosses and scopes fields consistent.',
    holds: () =>
      IMP95344_TAIL_CHART_PER_CHART_CAP_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(
        IMP95344_TAIL_CHART_PER_CHART_CAP_CONCEPT_NOTE.verdict
      ) &&
      IMP95344_TAIL_CHART_PER_CHART_CAP_CONCEPT_NOTE.glosses === 'imp-95332' &&
      IMP95344_TAIL_CHART_PER_CHART_CAP_CONCEPT_NOTE.scopes ===
        'LEMMA TAIL-CHART: chartwise trace-tail cap c3nChart(t0, t1) ' +
          'replacing the theta-uniform c3n, via the LEMMA W-SPLIT (t3 ' +
          'nondecreasing, P decreasing) monotone pair applied to tail terms',
  },
];

for (const assertion of IMP95344_TAIL_CHART_PER_CHART_CAP_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95344-tail-chart-per-chart-cap-concept-note assertion failed: ${assertion.id}`
    );
  }
}
