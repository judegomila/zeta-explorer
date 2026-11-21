/**
 * @module imp-96786-drift-vif-block-bootstrap-glossary-headword
 * @fileoverview imp-96786 -- import-light glossary/Concepts headword for the imp-96709
 *   IMP96709_VERDICT: the single defensible Route M drift variance-inflation factor
 *   (VIF), measured DIRECTLY from the imp-96487 21-rung ladder by moving block
 *   bootstrap, is ~1.70 (band [1.41, 1.79] over block lengths b=2..5) -- LOWER than all
 *   three imp-96692 model-based estimates (AR(1) 2.578 / integrated-ACF 2.136 /
 *   oscillation-coherence 4.645).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96692 bracketed the drift VIF with three mutually inconsistent MODEL-BASED
 *   estimates and derived a gap floor from the AR(1) primary alone. imp-96709 replaced
 *   the model assumption with a direct measurement: it resamples blocks of consecutive
 *   ladder rungs (moving block bootstrap, B=4e5 resamples) and reads the drift
 *   inflation off the scatter of the resulting mean, needing no AR(1) or coherence
 *   model. This headword bakes that verdict verbatim (no re-import of the imp-96709
 *   module, to stay import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The moving block bootstrap VIF is stable across block length b=2..5 (VIF = 1.409,
 *   1.700, 1.789, 1.727), selecting b=3 (~ m^(1/3) = 2.76, the theory-preferred block
 *   length for m=21 rungs) as primary: VIF = 1.700, band [1.41, 1.79]. This sits BELOW
 *   all three imp-96692 model-based estimates, including the lowest of them
 *   (integrated-ACF 2.136), so the AR(1) proxy and the oscillation-coherence bound
 *   overstate the drift inflation of the averaged centerline.
 *
 *   Re-deriving under the selected VIF: the drift-aware gap floor is
 *   gapFull/(sqrt(1.70)*sigma_MB) = 1.337 covariance-inflated sigma -- between the
 *   imp-96692 AR(1) floor (1.086 sigma) and the imp-96569 SE-of-mean floor (1.743
 *   sigma). The representative reach inflation (z=3, q=1) is ~3.4x (~0.53 orders of
 *   magnitude), milder than the imp-96692 AR(1) reading of ~11.6x (~1.06 orders).
 *
 *   STATUS: the QUALITATIVE imp-96692 conclusion survives -- VIF > 1, so honouring the
 *   measured drift covariance still inflates the SE-of-mean reach and tightens the
 *   gap-resolution floor below 1.74 sigma, and deciding ratio(N) -> 1 against the
 *   ~0.985 plateau remains out of any wall-feasible reach. The QUANTITATIVE inflation
 *   imp-96692 reported from the AR(1) primary was too aggressive.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96709 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96709-route-m-drift-vif-block-bootstrap.js (source: the block-bootstrap measurement this glosses)
 * @see imp-96692-route-m-reach-drift-covariance-inflation.js (the three bracketed model-based VIF estimates this reconciles)
 * @see imp-96569-route-m-window-reach-projection.js (SE-of-mean reach the inflation is measured against)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (the 21-rung ladder, source data)
 *
 * Ticket: imp-96786 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The drift-VIF block-bootstrap headword, baked verbatim (no re-import).
const DRIFT_VIF_BLOCK_BOOTSTRAP_HEADWORD = Object.freeze({
  key: 'route-m-drift-vif-block-bootstrap-defensible-single-estimate',
  term:
    'imp-96709 verdict: the defensible single Route M drift VIF, measured directly ' +
    'from the variance-of-mean of the imp-96487 21-rung ladder by moving block ' +
    'bootstrap, is ~1.70 (band [1.41, 1.79] over b=2..5) -- LOWER than all three ' +
    'imp-96692 model-based estimates (AR(1) 2.578 / integrated-ACF 2.136 / ' +
    'oscillation-coherence 4.645)',
  definition:
    'imp-96692 estimated the drift variance-inflation factor of the Route M Burnol ' +
    'ratio ladder with three inconsistent MODEL-BASED proxies and derived its gap ' +
    'floor from the AR(1) primary alone. A model-free alternative is to measure the ' +
    'variance-of-mean directly: resample blocks of consecutive rungs (preserving ' +
    'local serial correlation) via a moving block bootstrap and read the inflation ' +
    'off the scatter of the resampled mean relative to the independence value ' +
    'sigma^2/m -- no AR(1) or coherence assumption required.',
  mechanism:
    'Across block lengths b = 2..5 the moving-block-bootstrap VIF is stable: 1.409 ' +
    '(b=2), 1.700 (b=3), 1.789 (b=4), 1.727 (b=5). The theory-preferred block length ' +
    'for m=21 rungs is b ~ m^(1/3) ~ 2.76, so b=3 is primary: VIF = 1.700, band ' +
    '[1.41, 1.79], median 1.71 -- below even the lowest imp-96692 estimate ' +
    '(integrated-ACF 2.136), and well under the AR(1) primary (2.578) and the ' +
    'coherence bound (4.645). Non-overlapping batch-means corroborates but is noisy ' +
    'at m=21 (only k=3..10 batches). Re-deriving under VIF=1.70: the gap floor is ' +
    'gapFull/(sqrt(1.70)*sigma_MB) = 1.337 sigma (between the AR(1) 1.086 and the ' +
    'SE-of-mean 1.743), and the representative reach inflation (z=3, q=1) is ~3.4x ' +
    '(~0.53 orders), milder than the AR(1)-derived ~11.6x (~1.06 orders).',
  verificationStatus:
    'Model-free re-measurement of an existing bracketed estimate, not a new bound and ' +
    'not a rigorous power calculation: the VIF is estimated from only 21 ' +
    'non-uniformly-spaced ladder rungs, so it is a short-series bracketed estimate ' +
    '(a lower-leaning one, per the imp-96709 sub-gap), not a pin. The qualitative ' +
    'conclusion (VIF > 1, reach inflated, gap floor tightened below the SE-of-mean ' +
    '1.74) is unchanged; the quantitative AR(1)-primary reading is superseded as too ' +
    'aggressive. Changes no bound; establishes no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96786_DRIFT_VIF_BLOCK_BOOTSTRAP_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96786',
  proofSection: 'S-frontier',
  glosses: 'imp-96709',
  question:
    'imp-96692 bracketed the Route M drift VIF with three inconsistent model-based ' +
    'estimates (AR(1) 2.578 / integrated-ACF 2.136 / oscillation-coherence 4.645) and ' +
    'used the AR(1) primary to derive its gap floor. Does measuring the variance-of-mean ' +
    'DIRECTLY, with no model assumption, select a single defensible VIF and change the ' +
    'derived gap floor and reach inflation?',
  headword: DRIFT_VIF_BLOCK_BOOTSTRAP_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96709 ' +
    'verdict: the moving-block-bootstrap VIF is ~1.70 (band [1.41, 1.79]), stable ' +
    'across block length, and LOWER than all three imp-96692 model-based estimates. ' +
    'The drift-aware gap floor re-brackets to ~1.34 sigma (between the AR(1) 1.09 and ' +
    'the SE-of-mean 1.74) and the representative reach inflation is milder (~3.4x, ' +
    '~0.5 orders) than the imp-96692 AR(1) reading (~11.6x, ~1.06 orders); the ' +
    'qualitative conclusion (VIF > 1, gap-resolution floor tightened, ratio(N) -> 1 ' +
    'stays out of wall-feasible reach) is unchanged. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96709 (the block-bootstrap measurement this glosses); imp-96692 (the three ' +
    'bracketed model-based VIF estimates); imp-96569 (SE-of-mean reach baseline); ' +
    'imp-96487 (21-rung ladder, source data).',
});

export default IMP96786_DRIFT_VIF_BLOCK_BOOTSTRAP_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96786_DRIFT_VIF_BLOCK_BOOTSTRAP_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96786-headword-has-required-fields',
    why: 'The headword must name the selected block-bootstrap VIF, its band, the ' +
      'three imp-96692 estimates it sits below, and the re-derived gap floor -- the ' +
      'entire point of the glossary entry.',
    holds: () => {
      const h = IMP96786_DRIFT_VIF_BLOCK_BOOTSTRAP_GLOSSARY_HEADWORD.headword;
      return (
        /1\.700/.test(h.mechanism) &&
        /\[1\.41, 1\.79\]/.test(h.mechanism) &&
        /2\.578/.test(h.mechanism) &&
        /2\.136/.test(h.mechanism) &&
        /4\.645/.test(h.mechanism) &&
        /1\.337/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96786-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96786_DRIFT_VIF_BLOCK_BOOTSTRAP_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96786_DRIFT_VIF_BLOCK_BOOTSTRAP_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96786_DRIFT_VIF_BLOCK_BOOTSTRAP_GLOSSARY_HEADWORD.verdict) &&
      IMP96786_DRIFT_VIF_BLOCK_BOOTSTRAP_GLOSSARY_HEADWORD.glosses === 'imp-96709',
  },
];

for (const assertion of IMP96786_DRIFT_VIF_BLOCK_BOOTSTRAP_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96786-drift-vif-block-bootstrap-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
