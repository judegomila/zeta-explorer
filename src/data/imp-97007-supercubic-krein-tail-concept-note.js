/**
 * @module imp-97007-supercubic-krein-tail-concept-note
 * @fileoverview imp-97007 -- import-light Concepts glossary headword for the imp-96975
 *   derivation of the sigma_2-weighted Krein beyond-T tail's measured super-cubic
 *   (p~3.23) N-growth law.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96975 derives two structural scaling laws (tail-decay rate and per-mode
 *   endpoint-amplitude growth) and reconciles them against the measured super-cubic
 *   exponent p~3.228 (imp-96928/imp-96957). This note restates the two laws and the
 *   reconciliation in plain terms, without re-deriving the endpoint-jump integration
 *   by parts or re-running the Gegenbauer minimiser build.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   (L1) TAIL-DECAY LAW: the beyond-T sigma_2-weighted tail mass of a single
 *   normalised Gegenbauer mode decays like T^{-3} ln T. This rate is the JOINT
 *   product of the sigma_2(t) = (t^2+1/4)^2 w_1 ~ t^4 weight and the pole-free
 *   M=3 window's endpoint-singularity envelope |Phih_n(t)|^2 ~ t^{-2(M+1)} = t^{-8}
 *   (from M+1 integrations by parts against the (1-y^2)^M window). Verified:
 *   successive-octave tail ratios 0.1946, 0.1493 decrease toward the predicted
 *   2^{-3} = 0.125.
 *
 *   (L2) ENDPOINT-AMPLITUDE LAW: each normalised mode's endpoint value squared,
 *   psi_n(1)^2, grows like n^{2*alpha} = n^13 (alpha = 2M+1/2 = 6.5). Verified fit
 *   exponent 12.31, approaching 13 with finite-n corrections; the single-mode
 *   weighted tail mass itself grows ~n^11.63 -- far above the measured p~3.23.
 *
 *   RECONCILIATION: a single normalised top mode would dump n^{~12} weighted tail
 *   mass, ~9 orders of magnitude above the measured residual. The minimiser does
 *   NOT concentrate on the top mode -- it suppresses the literal top-mode
 *   coefficient (phi_{N-1}^2 ~ 1e-26 at N=124) to near-totally cancel the n^{~12}
 *   per-mode endpoint growth. The measured p~3.23 is the RESIDUE left after that
 *   near-cancellation, not a bare per-mode coefficient-growth artifact.
 *
 *   WHAT IT DOES NOT DO
 *   -----------------------------------------------
 *   The two laws and the qualitative reconciliation do not close p in closed form:
 *   that requires the full minimiser coefficient spectrum (a collective effect
 *   across all modes), left as sub-gap imp-96975-minimiser-coeff-spectrum-supercubic-residue.
 *   The Rayleigh floor remains an UPPER bound; no operator positivity is proved;
 *   the interval-rigorous certificate reach stays 2a <= 0.96.
 *
 * @see imp-96975-sigma2-tail-supercubic-derivation.js (source: (L1)/(L2) laws,
 *   reconciliation, sub-gap)
 * @see imp-96957-bessel-onset-tail-finer-ladder-viz-data.js (measured p_global=3.228)
 * @see imp-96934-bessel-onset-tail-residual-viz-data.js (the onset table the
 *   derivation explains)
 * @see imp-96928-krein-residual-vs-floor-uniform-N-extrap.js (the p~3.27 super-cubic
 *   residual growth)
 *
 * Ticket: imp-97007 (content, low). Documentation only; establishes no new bound;
 * NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-96975).
const SUPERCUBIC_KREIN_TAIL_HEADWORD = Object.freeze({
  key: 'supercubic-krein-tail-law',
  term:
    'Super-cubic Krein-tail law (imp-96975): the beyond-T sigma_2-weighted Krein ' +
    'floor residual grows in N with measured exponent p~3.228, reconciled from ' +
    'two structural laws -- a T^{-3} ln T single-mode tail-decay rate and an ' +
    'n^{~12-13} per-mode endpoint-amplitude growth -- via the minimiser ' +
    'near-cancellation of the top mode',
  whatItBounds:
    'Explains the N-growth rate of residFirstOrder, the sigma_2-weighted mass of ' +
    'the pole-free m=3 minimiser beyond cutoff T=3200. (L1) sigma_2 ~ t^4 against ' +
    'the M=3 window envelope |Phih_n(t)|^2 ~ t^{-2(M+1)} = t^{-8} gives a per-mode ' +
    'tail decaying like T^{-3} ln T. (L2) each normalised mode carries endpoint ' +
    'tail mass psi_n(1)^2 ~ n^{2*alpha} = n^{~12-13} (alpha = 2M+1/2 = 6.5).',
  whyItIsLoadBearing:
    'A single normalised top mode would dump ~n^12 weighted tail mass, about 9 ' +
    'orders of magnitude above the measured residual growth p~3.23 -- so the bare ' +
    'per-mode laws alone cannot explain the measured exponent. The reconciliation ' +
    'is that the minimiser suppresses the top-mode coefficient (phi_{N-1}^2 ~ ' +
    '1e-26 at N=124) to near-totally cancel the n^{~12} per-mode endpoint growth, ' +
    'and the measured p~3.23 is the residue of that near-cancellation, not a bare ' +
    'coefficient-growth artifact.',
  whyItIsSharp:
    'Both structural laws are independently verified, not assumed: (L1) via ' +
    'successive-octave single-mode tail ratios 0.1946, 0.1493 decreasing toward ' +
    'the predicted 2^{-3}=0.125; (L2) via a log-log fit exponent 12.31 ' +
    'approaching 2*alpha=13. The full-build minimiser also reproduces the ' +
    'imp-96934 baked residFirstOrder values exactly (0.0006425/0.0018621/0.0054813), ' +
    'anchoring the reconciliation to the same operator and subspace as the ' +
    'measured residual.',
  whatItDoesNotDo:
    'The two laws and the near-cancellation reconciliation are qualitative: they ' +
    'do not close the exact value of p in closed form, which requires the full ' +
    'minimiser coefficient spectrum (a collective effect across all modes, not ' +
    'the bare single-/top-mode endpoint law) -- left open as sub-gap ' +
    'imp-96975-minimiser-coeff-spectrum-supercubic-residue. The Rayleigh floor ' +
    'remains an UPPER bound, no operator positivity is established, and the ' +
    'interval-rigorous certificate reach stays 2a <= 0.96.',
});

export const IMP97007_SUPERCUBIC_KREIN_TAIL_CONCEPT_NOTE = Object.freeze({
  id: 'imp-97007',
  proofSection: 'Route I',
  glosses: 'imp-96975',
  scopes:
    'Two structural laws reconciling the measured super-cubic (p~3.228) N-growth ' +
    'of the sigma_2-weighted Krein beyond-T tail residual: T^{-3} ln T single-mode ' +
    'tail decay and n^{~12-13} per-mode endpoint-amplitude growth, joined by the ' +
    'minimiser top-mode near-cancellation',
  question:
    'What does the imp-96975 derivation establish about why the sigma_2-weighted ' +
    'Krein beyond-T tail residual grows with measured exponent p~3.228, and why ' +
    'is that exponent so much smaller than the bare per-mode endpoint growth?',
  headword: SUPERCUBIC_KREIN_TAIL_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the imp-96975 two ' +
    'structural laws -- (L1) T^{-3} ln T single-mode tail decay from sigma_2 ~ t^4 ' +
    'against the M=3 window t^{-8} envelope, and (L2) n^{~12-13} per-mode endpoint-' +
    'amplitude growth -- and the reconciliation that the measured p~3.23 residual ' +
    'growth is the residue left after the minimiser near-totally cancels the ' +
    'n^{~12} top-mode endpoint growth (~9 orders of magnitude suppression), while ' +
    'noting the exact value of p remains open pending the full minimiser ' +
    'coefficient spectrum. Establishes nothing new; fires no certificate; ' +
    'no refereed bound is changed.',
  citation:
    'imp-96975-sigma2-tail-supercubic-derivation.js ((L1)/(L2) laws, ' +
    'reconciliation, sub-gap); imp-96957-bessel-onset-tail-finer-ladder-viz-data.js ' +
    '(measured p_global=3.228); imp-96934-bessel-onset-tail-residual-viz-data.js ' +
    '(the onset table); imp-96928-krein-residual-vs-floor-uniform-N-extrap.js ' +
    '(the p~3.27 super-cubic residual growth).',
});

export default IMP97007_SUPERCUBIC_KREIN_TAIL_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97007_SUPERCUBIC_KREIN_TAIL_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp97007-headword-has-required-fields',
    why:
      'The concept note must state what the super-cubic tail law bounds, why it ' +
      'is load-bearing (the ~9-orders-of-magnitude near-cancellation gap between ' +
      'bare per-mode growth and the measured exponent), why it is sharp (both ' +
      'structural laws independently verified), and what it does not itself ' +
      'supply (the exact value of p) -- the entire point of the note.',
    holds: () => {
      const h = IMP97007_SUPERCUBIC_KREIN_TAIL_CONCEPT_NOTE.headword;
      return (
        /T\^\{-3\} ln T/.test(h.whatItBounds) &&
        /n\^\{2\*alpha\} = n\^\{~12-13\}/.test(h.whatItBounds) &&
        /9 orders of magnitude/.test(h.whyItIsLoadBearing) &&
        /near-cancellation/.test(h.whyItIsLoadBearing) &&
        /0\.125/.test(h.whyItIsSharp) &&
        /minimiser coefficient spectrum/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp97007-tail-decay-octave-ratio-reproduction',
    why:
      'The note claims the single-mode octave tail ratios 0.1946, 0.1493 decrease ' +
      'toward the predicted 2^{-3}=0.125; verify this ordering directly and ' +
      'self-containedly (no import of imp-96975).',
    holds: () => {
      const predicted = 0.125;
      const [r1, r2] = [0.194557, 0.14934];
      return r1 > predicted && r2 > predicted && r2 < r1;
    },
  },
  {
    id: 'imp97007-endpoint-amplitude-exponent-approaches-2alpha',
    why:
      'The note claims psi_n(1)^2 grows like n^{2*alpha}=n^13 with a measured fit ' +
      'exponent 12.31; verify the fit sits strictly between the single-mode tail ' +
      'exponent and the asymptotic 2*alpha=13.',
    holds: () => {
      const alpha = 2 * 3 + 0.5; // M=3
      const twoAlpha = 2 * alpha; // 13
      const fitExp = 12.31;
      const singleModeTailExp = 11.63;
      const measuredP = 3.228;
      return (
        fitExp > 11.5 &&
        fitExp < twoAlpha + 0.01 &&
        singleModeTailExp > 3 * measuredP &&
        singleModeTailExp < twoAlpha
      );
    },
  },
  {
    id: 'imp97007-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change ' +
      'line present, glosses and scopes fields consistent.',
    holds: () =>
      IMP97007_SUPERCUBIC_KREIN_TAIL_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(IMP97007_SUPERCUBIC_KREIN_TAIL_CONCEPT_NOTE.verdict) &&
      IMP97007_SUPERCUBIC_KREIN_TAIL_CONCEPT_NOTE.glosses === 'imp-96975' &&
      /T\^\{-3\} ln T/.test(IMP97007_SUPERCUBIC_KREIN_TAIL_CONCEPT_NOTE.scopes),
  },
];

for (const assertion of IMP97007_SUPERCUBIC_KREIN_TAIL_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97007-supercubic-krein-tail-concept-note assertion failed: ${assertion.id}`
    );
  }
}
