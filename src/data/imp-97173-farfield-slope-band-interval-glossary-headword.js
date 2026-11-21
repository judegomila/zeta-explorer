/**
 * @module imp-97173-farfield-slope-band-interval-glossary-headword
 * @fileoverview imp-97173 -- import-light glossary/Concepts headword for the imp-97142
 *   measurement: propagating the imp-96667 interior-slope band s* in 5.66..5.80 through the
 *   Route M far-field ceiling's linear F(s*) = F_center * (s* / 5.76) placement turns the
 *   imp-97118 LAYER-(ii) point value (fPctVsLine = -0.30%) into an INTERVAL fPctVsLine in
 *   [-2.035%, +0.389%] (width ~2.42 pp). The inside/outside verdict (outside the original
 *   imp-96982 band, on the LOW side; quadratic top rejected) survives the whole slope band, but
 *   the exact placement within the imp-97081 sliver is not pinned.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97118 stated the LAYER-(ii) far-field ceiling as a single point value F = 3.775e7 and
 *   flagged that it inherits the imp-96750 O(1)/s0* sub-gap, but did not propagate the measured
 *   imp-96667 slope band into a range. A reader who only sees the imp-97118 point value could
 *   mistake fPctVsLine = -0.30% for a pinned number; imp-97142 shows it is really the CENTER of
 *   a ~2.42 pp-wide interval. This headword bakes that interval and its survival verdict verbatim
 *   (no re-import of imp-97142) so the point-value/interval distinction is not lost.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   F is read off the interior second-moment SLOPE, not fit to the Frobenius ladder, so it scales
 *   LINEARLY in s*: F(s*) = F_center * (s* / s*_center), F_center = 3.775e7 at s*_center = 5.76.
 *   Propagating the imp-96667 band endpoints s* in {5.66, 5.76, 5.80} gives F in
 *   {3.7095e7, 3.7750e7, 3.8012e7} and fPctVsLine in {-2.035%, -0.304%, +0.389%} against the line
 *   baseline N* = 3.7865e7 -- an interval of width ~2.42 pp, not a point.
 *   SURVIVAL VERDICT: the ORIGINAL imp-96982 band floor sits at +1.369%. Even the most-favourable
 *   slope end (s* = 5.80, fPctVsLine = +0.389%) sits ~0.98 pp UNDER that floor, so the WHOLE
 *   propagated interval stays outside-low regardless of which slope in [5.66, 5.80] is correct --
 *   the imp-97118 inside/outside verdict (outside the band, quadratic top rejected) is robust to
 *   the slope uncertainty. What does NOT survive is the exact within-sliver value: the slope band
 *   alone spreads F across ~2.42 pp, and the imp-96750 O(1) additive term is a further, separate
 *   residual not captured by this propagation, so the true LAYER-(ii) spread is at least this wide.
 *
 *   STATUS: a sensitivity-measurement headword over an already-committed propagation, not a new
 *   computation or a certificate. Instantiates no interval certificate, closes no sub-gap, moves
 *   no bound. The only rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916,
 *   imp-96352) binds first by >2600x regardless. NO QED. No refereed bound is changed;
 *   RH open.
 *
 * @see imp-97142-route-m-farfield-ceiling-slope-band-interval.js (source: the propagated
 *   interval and survival verdict this glosses)
 * @see imp-97118-route-m-interior-growth-law-farfield-band-discriminator.js (the LAYER-(ii) point
 *   value this headword warns readers not to mistake for a pinned number)
 * @see imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword.js (the original
 *   +1.37%..+8.36% band the interval is checked against)
 *
 * Ticket: imp-97173 (content, medium, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The far-field slope-band interval headword, baked verbatim (no re-import).
const FARFIELD_SLOPE_BAND_INTERVAL_HEADWORD = Object.freeze({
  key: 'farfield-ceiling-slope-band-interval-not-single-point',
  term:
    'imp-97142 finding: propagating the imp-96667 interior-slope band s* in 5.66..5.80 through ' +
    'the Route M far-field ceiling turns the imp-97118 LAYER-(ii) point value (fPctVsLine = ' +
    '-0.30%) into an INTERVAL fPctVsLine in [-2.035%, +0.389%] (width ~2.42 pp); the inside/' +
    'outside verdict survives the slope band, the exact value does not',
  definition:
    'The far-field ceiling F is read off the interior second-moment SLOPE (F = F_center * ' +
    's* / 5.76, F_center = 3.775e7 at s*_center = 5.76), so it scales linearly in s*. Propagating ' +
    'the measured imp-96667 slope band endpoints s* = 5.66 and s* = 5.80 gives F in ' +
    '[3.7095e7, 3.8012e7], i.e. fPctVsLine in [-2.035%, +0.389%] against the line baseline ' +
    'N* = 3.7865e7 -- an interval, not the single -0.30% point imp-97118 reported.',
  mechanism:
    'The ORIGINAL imp-96982 band floor is +1.369%. Even the most-favourable slope end (s* = ' +
    '5.80, fPctVsLine = +0.389%) sits ~0.98 pp under that floor, so the entire propagated ' +
    'interval stays outside-low for every slope in [5.66, 5.80]: the imp-97118 inside/outside ' +
    'verdict (outside the band, quadratic top rejected) is robust to the slope uncertainty. ' +
    'The exact within-sliver placement is NOT robust -- the slope band alone spreads F across ' +
    '~2.42 pp, and the imp-96750 O(1) additive term is a further, separate residual not ' +
    'captured by this propagation, so the true LAYER-(ii) spread is at least this wide.',
  verificationStatus:
    'Sensitivity measurement assembled from already-committed, previously-verified sibling ' +
    'modules (imp-97142 propagation, imp-97118 LAYER split, imp-97081 point anchor, imp-96667 ' +
    'slope band, imp-96982 original band); no new numerical computation. Instantiates no ' +
    'interval certificate; moves no bound; the rigorous anchor stays the trace ceiling ' +
    'T = 2.594e7, and compute (N ~ 9916) binds first by >2600x regardless. No refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97173_FARFIELD_SLOPE_BAND_INTERVAL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97173',
  proofSection: 'Route-M',
  glosses: 'imp-97142',
  question:
    'imp-97118 reported the Route M far-field LAYER-(ii) ceiling as a single point value ' +
    '(fPctVsLine = -0.30%). Does that point value survive as the whole LAYER-(ii) sub-gap, or ' +
    'does propagating the measured imp-96667 interior-slope uncertainty turn it into a wider ' +
    'interval -- and if so, does the imp-97118 inside/outside verdict still survive?',
  headword: FARFIELD_SLOPE_BAND_INTERVAL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97142 finding: ' +
    'propagating the imp-96667 slope band s* in [5.66, 5.80] through the linear F(s*) ' +
    'placement turns the imp-97118 point value into an interval fPctVsLine in ' +
    '[-2.035%, +0.389%] (width ~2.42 pp). The whole interval lies below the +1.369% floor of ' +
    'the original imp-96982 band, so the imp-97118 outside-low, quadratic-top-rejected verdict ' +
    'SURVIVES the slope uncertainty; the exact within-sliver value does NOT (slope band alone ' +
    'spreads F ~2.42 pp; the imp-96750 O(1) term is a further residual). Readers should not cite ' +
    'the imp-97118 point value as pinned. Establishes nothing new; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97142 (the propagated interval and survival verdict this glosses); imp-97118 (the point ' +
    'value this headword contextualises); imp-96667 (the interior-slope band); imp-96982 (the ' +
    'original band checked against).',
});

export default IMP97173_FARFIELD_SLOPE_BAND_INTERVAL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97173_FARFIELD_SLOPE_BAND_INTERVAL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97173-headword-names-interval-and-endpoints',
    why: 'The headword must name the propagated interval endpoints and the survival distinction ' +
      '(inside/outside verdict survives, exact value does not) -- the entire point of the entry.',
    holds: () => {
      const h = IMP97173_FARFIELD_SLOPE_BAND_INTERVAL_GLOSSARY_HEADWORD.headword;
      return (
        /-2\.035%/.test(h.definition) &&
        /\+0\.389%/.test(h.definition) &&
        /2\.42/.test(h.term) &&
        /1\.369%/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97173-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97173_FARFIELD_SLOPE_BAND_INTERVAL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97173_FARFIELD_SLOPE_BAND_INTERVAL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97173_FARFIELD_SLOPE_BAND_INTERVAL_GLOSSARY_HEADWORD.verdict) &&
      IMP97173_FARFIELD_SLOPE_BAND_INTERVAL_GLOSSARY_HEADWORD.glosses === 'imp-97142',
  },
];

for (const assertion of IMP97173_FARFIELD_SLOPE_BAND_INTERVAL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97173-farfield-slope-band-interval-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
