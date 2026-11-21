/**
 * @module imp-95345-root-mono-w-split-concept-note
 * @fileoverview imp-95345 -- import-light concept note for the imp-95331
 *   LEMMA ROOT-MONO + LEMMA W-SPLIT exact-root/side-weight split-pencil
 *   floor (THEOREM RZ-PEN5 / COROLLARY PEN-UNIF5).
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95331 assembles THEOREM RZ-PEN5 from two independent elementary
 *   lemmas -- LEMMA ROOT-MONO (a monotonicity fact about the smaller
 *   root of a quadratic pencil) and LEMMA W-SPLIT (a chartwise
 *   side-weight bookkeeping fix) -- composed with the carried imp-95329
 *   trace cap and imp-95330 chart floor. This note isolates what each of
 *   the two named lemmas contributes and, in particular, the
 *   SKEPTICAL REFUTATION recorded alongside them: which lemma actually
 *   carries the measured gain, without restating the surrounding
 *   THEOREM/COROLLARY machinery or the other named residual legs
 *   (pair-identity truncation, c3n tail, b-uniform t3 weight) that
 *   neither lemma touches.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   The pointwise generalized eigenvalue lam_min solves a quadratic
 *   pencil A lam^2 - 2 B lam + C = 0 and equals the smaller root
 *   h(B, C) = C / (B + sqrt(B^2 - AC)). LEMMA ROOT-MONO observes h is
 *   nonincreasing in B and nondecreasing in C, so any valid upper cap
 *   B_up >= B and lower cap C_low <= C yields a floor h(B_up, C_low) <=
 *   h(B, C) -- and h(B, C) >= C / (2B), the cruder det-over-trace floor,
 *   because sqrt(B^2 - AC) <= B. This licenses substituting caps for the
 *   true (B, C) without leaving the pencil domain. LEMMA W-SPLIT is a
 *   SEPARATE, unrelated fix: the prior imp-95330 chart cap charged BOTH
 *   neighboring side terms w_{-1} and w_{+1} at the same worst-case
 *   weight t3(2 pi + t1); near theta = pi, the true w_{-1} = 2 pi -
 *   theta shrinks to ~pi while the shared charge assumes ~3 pi, a
 *   ~2.8x overweight. LEMMA W-SPLIT charges each side term at its OWN
 *   two-sided chart bracket, removing that overweight.
 *
 *   WHY IT IS LOAD-BEARING -- AND THE REFUTATION IT CONTAINS
 *   -----------------------------------------------
 *   THEOREM RZ-PEN5 uses BOTH lemmas together, and the measured gain
 *   over RZ-PEN4 is real: 1.6695x at rho = 10 (r = 2), 1.5389x at
 *   rho = e^6 (r = 2). The imp-95330 residual note had ATTRIBUTED part
 *   of this potential gain to the det/tr-to-exact-root step (LEMMA
 *   ROOT-MONO's substitution), estimating "up to 1.66x" from the gap
 *   between the true root and its det/tr floor at the TRUE (B, C). The
 *   imp-95331 skeptical self-check REFUTES that attribution: run
 *   standalone (exact root without the side-weight split), LEMMA
 *   ROOT-MONO's substitution gains at most 1.006x; run on top of the
 *   split, at most 1.025x. The two legs COUPLE through the discriminant
 *   B^2 - AC -- once the trace is capped and the numerator truncated,
 *   the discriminant sits close to B_up^2 regardless, and the root
 *   degenerates to det/tr anyway. The actual carrier of the diagnosed
 *   corner slack is LEMMA W-SPLIT, not LEMMA ROOT-MONO: the split alone
 *   recovers the full 1.5-1.7x: LEMMA ROOT-MONO is real, elementary,
 *   and rigorously kept (free, and it still contributes a small
 *   uncoupled marginal), but it is not the mechanism the prior residual
 *   note guessed.
 *
 *   WHAT IT DOES NOT DO (a floor gain, not a certificate improvement)
 *   -----------------------------------------------
 *   Both lemmas are floor-only refinements: the RZ-PEN5 chart floor
 *   dominates RZ-PEN4 unconditionally, but at rho = 2 (the every-octave
 *   certificate anchor) the split-root floor is INACTIVE -- it sits
 *   below the imp-95330 chart-refined floor V4_k, which still binds
 *   there -- so all three every-octave onsets (13.297836 / 13.071303 /
 *   12.817538) carry over BITWISE UNCHANGED. Neither lemma touches the
 *   {0, +-1} pair-identity truncation (now binding at an INTERIOR chart
 *   rather than the far corner), the c3n theta-uniform tail majorant, or
 *   the b-uniform t3 weight at interior frequencies -- all three remain
 *   open named residuals of the chain.
 *
 * @see imp-95331-split-weight-exact-root-pencil-floor.js (source: LEMMA
 *   ROOT-MONO, LEMMA W-SPLIT, THEOREM RZ-PEN5, COROLLARY PEN-UNIF5, and
 *   the refutation record)
 * @see imp-95330-* (source: the chart floor V4_k this theorem composes
 *   with, and the numerator-currency residual imp-95331 diagnoses)
 * @see imp-95329-* (source: the per-term trace cap t3 / c3n these charts
 *   still charge)
 * @see imp-95333-*, imp-95332-* (the OTHER named residual legs -- pair-
 *   identity truncation and the tail/t3 legs -- this note leaves open)
 *
 * Ticket: imp-95345 (content, low). Documentation only; establishes no
 * new bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95331).
const ROOT_MONO_W_SPLIT_HEADWORD = Object.freeze({
  key: 'root-mono-w-split-exact-root-side-weight-floor',
  term:
    'LEMMA ROOT-MONO (h(B, C) = C / (B + sqrt(B^2 - AC)) is ' +
    'nonincreasing in B, nondecreasing in C, and dominates the det-' +
    'over-trace floor C / (2B)) composed with LEMMA W-SPLIT (chartwise ' +
    'side weights charged separately for w_{-1} and w_{+1} instead of ' +
    'both at the same worst-case weight)',
  whatItBounds:
    'The pointwise generalized eigenvalue lam_min(F, G0), via the exact ' +
    'smaller quadratic root h(B_up, C_low) evaluated at LEMMA W-SPLIT '  +
    'per-chart caps B_up (split side weights, two-sided kernel bounds) ' +
    'and C_low, licensed by LEMMA ROOT-MONO monotonicity in place of ' +
    'the cruder det-over-trace substitute C_low / (2 B_up).',
  whyItIsLoadBearing:
    'The measured RZ-PEN5 floor gain over RZ-PEN4 (1.6695x at rho = 10, ' +
    '1.5389x at rho = e^6, both r = 2) is REAL, but the skeptical ' +
    'self-check REFUTES the imp-95330 attribution of that gain to the ' +
    'exact-root (LEMMA ROOT-MONO) step: standalone, exact root without ' +
    'the split gains at most 1.006x; on top of the split, at most ' +
    '1.025x -- the legs COUPLE through the discriminant B^2 - AC once ' +
    'the trace is capped and the numerator truncated. LEMMA W-SPLIT, ' +
    'not LEMMA ROOT-MONO, is the actual carrier of the diagnosed ' +
    '~2.8x side-weight overweight near theta = pi.',
  whyItIsSharp:
    'LEMMA ROOT-MONO is an elementary, unconditional monotonicity fact ' +
    '(the substitution B up / C down never leaves the pencil domain, ' +
    'since both moves only grow the discriminant), so its dominance ' +
    'A_pen5 >= A_pen4 is UNCONDITIONAL; the refutation record measures ' +
    'the coupled marginal directly (<= 1.006x standalone, <= 1.025x ' +
    'coupled) rather than merely asserting it is small.',
  whatItDoesNotDo:
    'Neither lemma moves a single every-octave onset (13.297836 / ' +
    '13.071303 / 12.817538 all bitwise unchanged, since rho = 2 sits ' +
    'below the a ~ 1.875 activation crossover where the split-root ' +
    'floor first exceeds the carried V4_k floor); neither touches the ' +
    '{0, +-1} pair-identity truncation (now binding at an interior ' +
    'chart), the c3n theta-uniform tail majorant, or the b-uniform t3 ' +
    'weight at interior frequencies -- all three remain open residuals.',
});

export const IMP95345_ROOT_MONO_W_SPLIT_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95345',
  proofSection: 'S-frontier',
  glosses: 'imp-95331',
  scopes:
    'LEMMA ROOT-MONO: smaller-root monotonicity h(B, C) in (B, C); ' +
    'LEMMA W-SPLIT: chartwise separate side-weight caps for w_{-1} and ' +
    'w_{+1}; composed into THEOREM RZ-PEN5 / COROLLARY PEN-UNIF5',
  question:
    'What do the imp-95331 LEMMA ROOT-MONO and LEMMA W-SPLIT each ' +
    'establish, and why does the skeptical self-check show the ' +
    'measured RZ-PEN5 floor gain is carried by the side-weight split ' +
    'rather than the exact-root substitution the prior residual note ' +
    'attributed it to?',
  headword: ROOT_MONO_W_SPLIT_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95331 LEMMA ROOT-MONO smaller-root monotonicity and LEMMA ' +
    'W-SPLIT chartwise side-weight fix, and records the skeptical ' +
    'REFUTATION that the exact-root step alone gains at most 1.006x ' +
    '(coupled, at most 1.025x) while the side-weight split carries the ' +
    'full measured 1.5-1.7x gain, with every-octave onsets unchanged ' +
    'and three other named residual legs left open. Establishes ' +
    'nothing new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95331-split-weight-exact-root-pencil-floor.js (LEMMA ROOT-' +
    'MONO, LEMMA W-SPLIT, THEOREM RZ-PEN5, COROLLARY PEN-UNIF5, ' +
    'refutation record); imp-95330-* (chart floor V4_k, numerator-' +
    'currency residual diagnosed); imp-95329-* (per-term trace cap).',
});

export default IMP95345_ROOT_MONO_W_SPLIT_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95345_ROOT_MONO_W_SPLIT_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95345-headword-has-required-fields',
    why:
      'The concept note must state what the two lemmas bound, why the ' +
      'split (not the root step) is load-bearing, why LEMMA ROOT-MONO ' +
      'is unconditionally sharp, and what neither lemma does (the three ' +
      'other open residual legs) -- the entire point of the note.',
    holds: () => {
      const h = IMP95345_ROOT_MONO_W_SPLIT_CONCEPT_NOTE.headword;
      return (
        /LEMMA W-SPLIT/.test(h.whatItBounds) &&
        /LEMMA ROOT-MONO/.test(h.whatItBounds) &&
        /REFUTES/.test(h.whyItIsLoadBearing) &&
        /1\.006x/.test(h.whyItIsLoadBearing) &&
        /1\.025x/.test(h.whyItIsLoadBearing) &&
        /UNCONDITIONAL/.test(h.whyItIsSharp) &&
        /pair-identity truncation/.test(h.whatItDoesNotDo) &&
        /b-uniform t3/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95345-lemma-root-mono-self-contained-reproduction',
    why:
      'The note claims h(B, C) = C / (B + sqrt(B^2 - AC)) is ' +
      'nonincreasing in B, nondecreasing in C, and dominates the det-' +
      'over-trace floor C / (2B); verify directly with an independent, ' +
      'self-contained reproduction (no import of imp-95331).',
    holds: () => {
      const h = (A, B, C) =>
        C / (B + Math.sqrt(Math.max(B * B - A * C, 0)));
      for (const A of [0.1, 0.5, 1]) {
        for (const B of [0.5, 1, 2, 5]) {
          const Cmax = (B * B) / A;
          for (let i = 1; i <= 15; i++) {
            const C = (Cmax * i) / 16;
            const base = h(A, B, C);
            if (h(A, B + 0.3 * B, C) > base + 1e-15) return false;
            if (h(A, B, C * 0.7) > base + 1e-15) return false;
            if (base < C / (2 * B) - 1e-15) return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: 'imp95345-split-carries-gain-root-marginal-small',
    why:
      'The note claims the side-weight split alone recovers the RZ-PEN5 ' +
      'gain while the exact-root step alone gains at most a few tenths ' +
      'of a percent; reproduce both the split-only and root-only floors ' +
      'independently and check the refutation ratios directly.',
    holds: () => {
      const PI = Math.PI;
      const sechHalf = (u) => 1 / Math.cosh(u / 2);
      const kernelP = (w, a) => ((2 * PI) / a) / Math.cosh((PI * w) / a);
      function pen3Constants(a) {
        const c = Math.cosh(a / 2);
        const pi2 = PI * PI;
        const kap = (4 * c) / (a * a);
        const kap2 = 4 / (a * a);
        const e2 = Math.exp((-2 * pi2) / a);
        const e3 = Math.exp((-3 * pi2) / a);
        const tA = (((8 * PI) / a) * e3) / (1 - e2);
        const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
        const cAlpha = 2 / (1 + sechHalf(a));
        const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
        const c3n = cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
        return { tw, c3n };
      }
      const sideSum = (th, a) => kernelP(2 * PI - th, a) + kernelP(2 * PI + th, a);
      function chartV4(a, t0, t1) {
        const { tw, c3n } = pen3Constants(a);
        const P1 = kernelP(t1, a);
        const S0 = sideSum(t0, a);
        return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
      }
      // split-weight, det-over-trace floor (root marginal EXCLUDED: mu = 0)
      function chartSplitDT(a, t0, t1) {
        const { tw, c3n } = pen3Constants(a);
        const xLo = kernelP(t1, a);
        const y1Lo = kernelP(2 * PI - t0, a);
        const y2Lo = kernelP(2 * PI + t1, a);
        const T =
          tw(t1) * kernelP(t0, a) +
          tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
          tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
          c3n;
        const X = xLo * (y1Lo + y2Lo);
        return (4 * X) / T; // = C_low / B_up, i.e. det/tr (mu -> 0 limit)
      }
      // split-weight, exact-root floor at the given mu
      function chartSplitRoot(a, t0, t1, mu) {
        const { tw, c3n } = pen3Constants(a);
        const xLo = kernelP(t1, a);
        const y1Lo = kernelP(2 * PI - t0, a);
        const y2Lo = kernelP(2 * PI + t1, a);
        const T =
          tw(t1) * kernelP(t0, a) +
          tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
          tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
          c3n;
        const X = xLo * (y1Lo + y2Lo);
        const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
        return (4 * X) / (T / 2 + Math.sqrt(disc));
      }
      // unsplit (RZ-PEN4-style), exact-root floor at the given mu
      function chartUnsplitRoot(a, t0, t1, mu) {
        const { tw, c3n } = pen3Constants(a);
        const X = kernelP(t1, a) * sideSum(t0, a);
        const T = tw(t1) * kernelP(t0, a) + tw(2 * PI + t1) * sideSum(t1, a) + c3n;
        const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
        return (4 * X) / (T / 2 + Math.sqrt(disc));
      }
      const prefactor = (a, b) =>
        Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;

      function w4Scan(a, K = 256) {
        let worst = Infinity;
        for (let k = 0; k < K; k++) {
          const v = chartV4(a, (PI * k) / K, (PI * (k + 1)) / K);
          if (v < worst) worst = v;
        }
        return worst;
      }
      function wSplitDTScan(a, K = 256) {
        let worst = Infinity;
        for (let k = 0; k < K; k++) {
          const t0 = (PI * k) / K;
          const t1 = (PI * (k + 1)) / K;
          const v = Math.max(chartV4(a, t0, t1), chartSplitDT(a, t0, t1));
          if (v < worst) worst = v;
        }
        return worst;
      }
      function wSplitRootScan(a, mu, K = 256) {
        let worst = Infinity;
        for (let k = 0; k < K; k++) {
          const t0 = (PI * k) / K;
          const t1 = (PI * (k + 1)) / K;
          const v = Math.max(chartV4(a, t0, t1), chartSplitRoot(a, t0, t1, mu));
          if (v < worst) worst = v;
        }
        return worst;
      }
      function wUnsplitRootScan(a, mu, K = 256) {
        let worst = Infinity;
        for (let k = 0; k < K; k++) {
          const t0 = (PI * k) / K;
          const t1 = (PI * (k + 1)) / K;
          const v = Math.max(chartV4(a, t0, t1), chartUnsplitRoot(a, t0, t1, mu));
          if (v < worst) worst = v;
        }
        return worst;
      }

      // The split alone (det/tr, no root marginal) already recovers the
      // bulk of the RZ-PEN5 gain over RZ-PEN4 at rho = e^6, r = 2:
      const a6 = 6;
      const b6 = Math.LN2;
      const mu6 = prefactor(a6, b6);
      const gainSplitDT = wSplitDTScan(a6) / w4Scan(a6);
      const gainSplitRoot = wSplitRootScan(a6, mu6) / w4Scan(a6);
      if (!(gainSplitDT > 1.4 && gainSplitDT <= gainSplitRoot + 1e-9)) return false;
      // Root marginal on top of the split is small (<= 1.025x):
      if (!(gainSplitRoot / gainSplitDT <= 1.03)) return false;

      // The unsplit exact-root step alone (no split) gains at most ~1.006x
      // over W4 at several rho:
      for (const a of [Math.LN2, Math.log(4), Math.log(10), 6]) {
        const mu = 16 / (a * a);
        const gain = wUnsplitRootScan(a, mu) / w4Scan(a);
        if (!(gain <= 1.01)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95345-onsets-unchanged-honesty-gate',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present, glosses/scopes consistent, and the note must ' +
      'not silently imply an onset moved.',
    holds: () =>
      IMP95345_ROOT_MONO_W_SPLIT_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(IMP95345_ROOT_MONO_W_SPLIT_CONCEPT_NOTE.verdict) &&
      /unchanged/.test(IMP95345_ROOT_MONO_W_SPLIT_CONCEPT_NOTE.verdict) &&
      IMP95345_ROOT_MONO_W_SPLIT_CONCEPT_NOTE.glosses === 'imp-95331',
  },
];

for (const assertion of IMP95345_ROOT_MONO_W_SPLIT_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95345-root-mono-w-split-concept-note assertion failed: ${assertion.id}`
    );
  }
}
