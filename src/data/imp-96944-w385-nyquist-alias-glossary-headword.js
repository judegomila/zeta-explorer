/**
 * @module imp-96944-w385-nyquist-alias-glossary-headword
 * @fileoverview imp-96944 -- import-light glossary/Concepts headword recording the imp-96915
 *   result IMP96915_W385_IS_NYQUIST_ALIAS_ARTIFACT: the imp-96832 w=3.85 oscillatory-remainder
 *   frequency of the 21-rung Burnol-ratio ladder is a 21-point sampling artifact, not a stable
 *   spectral feature.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) w=3.85 IS ABOVE THE NYQUIST FREQUENCY. For the unit-spaced 21-rung ladder the Nyquist
 *   angular frequency is pi=3.1416; the claimed w=3.85 exceeds it, so it is not a resolvable
 *   frequency at all. Its Lomb-Scargle power (0.3921) is IDENTICAL to the power at its alias
 *   image 2*pi - 3.85 = 2.4332 rad/sample -- the signature of an above-Nyquist alias, not a
 *   genuine spectral line.
 *   (b) THE GENUINE PEAK IS w=0.70 rad/sample (period ~9 lags), ~13x STRONGER (normalized power
 *   5.18 vs 0.39 at w=3.85/alias). It is robust: leave-one-out mean 0.701, sd 0.012, range
 *   [0.663, 0.723]; half-splits agree (0.710 / 0.726).
 *   (c) THE ACF SIGN PATTERN (lags 1..10: ++-----+++, five consecutive negatives at lags 3..7 --
 *   the imp-96832 anticorrelation lobe) matches the ~9-lag period of the genuine w=0.70 peak, not
 *   the 1.63-lag period implied by w=3.85, which would flip sign roughly every 0.8 lag and could
 *   not produce five consecutive same-sign values.
 *   (d) WHAT DOES NOT CHANGE. The qualitative VIF>1 conclusion (driven by the real negative ACF
 *   lobe) is untouched -- only the frequency LABEL attached to it is corrected, from the
 *   unresolvable w=3.85 to the genuine w=0.70. Even the genuine peak is not formally significant
 *   at 21 points (FAP ~0.11 > 0.05), so the ~9-lag oscillation remains a resolvable but marginal
 *   feature.
 *
 *   STATUS: documentation only -- a naming/bookkeeping correction recording that the imp-96832
 *   w=3.85 label was itself a sampling artifact. Not a proof, not a new bound. NO QED.
 *
 * @see imp-96915-burnol-oscillation-frequency-periodogram.js (source measurement: IMP96915_CLAIMED,
 *   IMP96915_GENUINE_PEAK, IMP96915_STABILITY, IMP96915_ACF_SIGNS, IMP96915_VERDICT)
 * @see imp-96832 (named the w=3.85 oscillatory-remainder frequency; never pinned or error-banded)
 * @see imp-96487-* (the 21-rung Burnol ratio(N) ladder whose remainder is analyzed)
 *
 * Ticket: imp-96944 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The w=3.85-is-a-Nyquist-alias headword, baked verbatim (no re-import).
const W385_NYQUIST_ALIAS_HEADWORD = Object.freeze({
  key: 'w385-is-nyquist-alias-artifact-imp96915',
  term:
    'imp-96915 decided the imp-96832 best-fit frequency w=3.85 of the 21-rung Burnol-ratio ' +
    'oscillatory remainder is a 21-point sampling artifact: it lies ABOVE the Nyquist ' +
    'frequency pi=3.1416 for the unit-spaced ladder and its periodogram power is merely the ' +
    'alias image of the genuine low-frequency peak w=0.70 rad/sample (period ~9 lags)',
  definition:
    'For the unit-spaced 21-rung Burnol ratio(N) ladder the Nyquist angular frequency is ' +
    'pi=3.1416. The imp-96832 claimed w=3.85 exceeds it, so it is not a resolvable frequency: ' +
    'its normalized Lomb-Scargle power (0.3921) is identical to the power at its alias image ' +
    '2*pi - 3.85 = 2.4332 rad/sample (also 0.3921). The genuine spectral peak is a low ' +
    'frequency w=0.7006 rad/sample (period 8.9686 lags, ~13.2x stronger, normalized power ' +
    '5.1829), stable under leave-one-out (mean 0.701, sd 0.012, range [0.663, 0.723]) and ' +
    'half-split subsamples (0.710 / 0.726).',
  mechanism:
    'The empirical ACF signs at lags 1..10 are ++-----+++ : five consecutive negatives at ' +
    'lags 3..7, the imp-96832 anticorrelation lobe. A ~9-lag period (w~0.70) has its first ' +
    'anti-node near lag 4-5, matching that run of five negatives; a 1.63-lag period (w=3.85) ' +
    'would flip sign roughly every 0.8 lag and cannot produce five consecutive same-sign ACF ' +
    'values. So the real anticorrelation lobe is produced by the genuine w=0.70 oscillation, ' +
    'not by w=3.85 -- the "w=3.85" label was itself the artifact.',
  verificationStatus:
    'Re-cited verbatim from imp-96915 IMP96915_CLAIMED, IMP96915_GENUINE_PEAK, ' +
    'IMP96915_STABILITY, IMP96915_ACF_SIGNS and IMP96915_VERDICT ' +
    '(src/data/imp-96915-burnol-oscillation-frequency-periodogram.js). Naming / bookkeeping ' +
    'headword only; the qualitative VIF>1 conclusion is untouched; even the genuine peak is ' +
    'not formally significant (FAP ~0.11 > 0.05); interval-rigorous certificate reach stays ' +
    '2a<=0.96; RH open; no refereed bound is changed; NO QED.',
});

export const IMP96944_W385_NYQUIST_ALIAS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96944',
  proofSection: 'S-frontier',
  glosses: 'imp-96915',
  question:
    'imp-96832 named a best-fit oscillatory-remainder frequency w=3.85 for the 21-rung ' +
    'Burnol ratio(N) ladder. Is that frequency a stable spectral feature, and if not, what is ' +
    'actually producing the observed anticorrelation lobe?',
  headword: W385_NYQUIST_ALIAS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records IMP96915_W385_IS_NYQUIST_ALIAS_ARTIFACT: ' +
    'the imp-96832 w=3.85 label lies above the Nyquist frequency pi=3.1416, its periodogram ' +
    'power (0.3921) is the alias image of 2.4332, and the genuine, leave-one-out-robust peak ' +
    'is w=0.70 rad/sample (period ~9 lags, ~13.2x stronger), which -- via its ~9-lag period -- ' +
    'is what produces the real ACF anticorrelation lobe (signs ++-----+++, negative at lags ' +
    '3..7). No bound moved; the qualitative VIF>1 conclusion is untouched; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96915 (IMP96915_CLAIMED, IMP96915_GENUINE_PEAK, IMP96915_STABILITY, ' +
    'IMP96915_ACF_SIGNS, IMP96915_VERDICT); imp-96832 (the original w=3.85 label).',
});

export default IMP96944_W385_NYQUIST_ALIAS_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96944_W385_NYQUIST_ALIAS_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96944-headword-cites-nyquist-and-alias',
    why: 'The headword must name the Nyquist frequency, the claimed w=3.85, and its alias ' +
      'image 2.4332 -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96944_W385_NYQUIST_ALIAS_GLOSSARY_HEADWORD.headword;
      return (
        /3\.1416/.test(h.definition) &&
        /3\.85/.test(h.definition) &&
        /2\.4332/.test(h.definition) &&
        /0\.70/.test(h.definition) &&
        /ACF/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96944-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, VIF>1 conclusion untouched, no QED, ' +
      'no-refereed-bound-change line present.',
    holds: () =>
      IMP96944_W385_NYQUIST_ALIAS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96944_W385_NYQUIST_ALIAS_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96944_W385_NYQUIST_ALIAS_GLOSSARY_HEADWORD.verdict) &&
      /untouched/.test(IMP96944_W385_NYQUIST_ALIAS_GLOSSARY_HEADWORD.verdict) &&
      IMP96944_W385_NYQUIST_ALIAS_GLOSSARY_HEADWORD.glosses === 'imp-96915',
  },
];

for (const assertion of IMP96944_W385_NYQUIST_ALIAS_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96944-w385-nyquist-alias-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
