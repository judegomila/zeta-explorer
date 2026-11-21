/**
 * @module imp-96522-excursion-2sigma-thread-writeup
 *
 * imp-96522 (content, honest-status writeup): a plain-language consolidation of
 * the four-ticket excursion-significance thread imp-96089 / imp-96452 /
 * imp-96489 / imp-96493, answering a single question a reader keeps running
 * into across those modules: why does the celebrated T = 1.5e5 below-envelope
 * number-variance dip sit at "~1.9-sigma" -- tantalisingly close to, but never
 * quite, a clean 2-sigma -- and why does the existing 10^6-Odlyzko-ordinate
 * data set never close that last gap? This module writes no new mathematics;
 * it restates the four source findings as one readable narrative. Content
 * only; no bound moved; NO QED.
 *
 * PLAIN-LANGUAGE SUMMARY.
 *
 * The starting number. imp-96089 measured the deepest below-envelope
 * number-variance dip in the existing 10^6 Odlyzko ordinates, at T = 1.5e5,
 * and scored it z = (dip depth) / (chi-square sampling error) = 1.9234,
 * using the naive assumption that its n_w = 291 tiled comparison windows are
 * independent. That "~1.9-sigma" figure is the one every sibling module
 * cites -- and it sits frustratingly short of a clean 2-sigma.
 *
 * Why it stalls just short. imp-96452 pulled the z-score apart into its two
 * ingredients: the dip DEPTH (a fixed ~16% shortfall, relErr = 0.159457) and
 * the window COUNT (n_w = 291). Reaching z = 2.0 at the same depth needs
 * n_w >= 315 -- 24 more windows, +8.1%. The obvious lever for "more windows"
 * is "more verified zeros", since window count grows with height. But the
 * T = 1.5e5 dip's +/-30% comparison span, [1.05e5, 1.95e5], sits fully
 * INSIDE the existing ordinate range (which reaches to ~6.003e5): it is not
 * clipped by the data ceiling, so 291 is already every window that height
 * can ever offer from this data set. Verified zeros above 6e5 are nowhere
 * near 1.5e5 and add nothing here -- more height is the wrong lever for
 * THIS dip.
 *
 * A different lever exists, but it is deliberately not the headline. imp-96489
 * directly evaluated the theoretical GUE two-interval correlation between
 * adjacent comparison boxes at this height and found them meaningfully
 * ANTI-correlated (rho_exact = -0.4639782). Folding that into an AR-1
 * effective-count correction raises the count from n_w = 291 to
 * n_eff ~ 794.8 and the score from z_cons = 1.9234 to z_eff = 3.1787 --
 * comfortably past 2-sigma. But the two figures are not competing claims:
 * z_eff = sqrt(f) * z_cons exactly, where f is the AR-1 factor, so the
 * correlation model can only raise the naive figure, never lower it.
 * z_cons = 1.9234 is quoted as the conservative floor precisely because it
 * does NOT lean on that model; the "1.9-sigma" ceiling described here is a
 * property of the deliberately conservative, model-free convention, not of
 * the data's true significance.
 *
 * Is there a comparably deep dip already hiding elsewhere in the data?
 * imp-96452 named this as its remaining lever (b): a comparably deep dip at
 * some OTHER unclipped interior height would independently reach 2-sigma
 * without touching the correlation model. imp-96493 went looking, scanning
 * every unclipped interior height above 1.5e5 that the existing measurements
 * reach (ten candidate heights to T = 4.577e5). None comes close: the next
 * deepest below-envelope dip anywhere in the set is z = 1.0358 at
 * T = 3.879e5 -- only about 54% as deep as the T = 1.5e5 excursion, and it
 * would need to run roughly 1.93x deeper to clear 2-sigma on its own. The
 * T = 1.5e5 dip remains the single deepest excursion the fixed ordinate set
 * contains.
 *
 * THE PICTURE, put together. Under the naive, model-free convention that
 * the field actually quotes, the fixed 10^6-ordinate Odlyzko set caps the
 * reachable excursion significance at z = 1.9234 -- just under 2-sigma --
 * and none of the three routes available WITHIN that fixed data set close
 * the gap: (i) more verified height does not help this dip, because its
 * comparison window is already fully interior and complete; (ii) no other
 * height in the same data set hosts a comparably deep alternative dip; and
 * (iii) the only route that already clears 2-sigma (the AR-1 correlation
 * correction, z_eff = 3.1787) is deliberately excluded from the headline
 * because it trades the model-free convention for a theoretical GUE
 * assumption. Advancing past the naive 1.9-sigma therefore needs either a
 * genuinely deeper excursion at a height the current 10^6 ordinates do not
 * reach (i.e. new, higher verified zeros -- not more of the existing ones),
 * or an explicit decision to adopt the correlation-corrected convention.
 *
 * HONEST LIMITS. This module restates four prior measurements; it re-derives
 * none of their numerics and adds no new claim. Changes no bound; NO QED;
 * no refereed bound is changed; RH open; the zero-side route
 * stays PCC/GRH-gated.
 *
 * @see imp-96089-mean-anchor-window-count-significance-verdict (sets z = 1.9234 at T = 1.5e5)
 * @see imp-96452-excursion-confidence-2sigma-reach (decomposes z; shows verified height cannot help this dip)
 * @see imp-96489-excursion-effective-significance-direct-rho (z_eff = 3.1787 via the AR-1 correlation correction)
 * @see imp-96493-excursion-2sigma-interior-scan (no other unclipped interior height reaches z >= 2)
 *
 * Import-light: no zeros bundle, no sibling data-module imports (all facts
 * restated as literals so this module stays independently checkable).
 */

export const IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP = {
  ticket: 'imp-96522',
  sourceTickets: ['imp-96089', 'imp-96452', 'imp-96489', 'imp-96493'],
  question:
    'why does the T = 1.5e5 below-envelope number-variance excursion sit at "~1.9-sigma" and never a clean '
    + '2-sigma, given the existing fixed 10^6 Odlyzko ordinate set -- and is there any way to close that gap '
    + 'without new data?',
  headline: {
    zCons: 1.9234,
    zTarget: 2.0,
    source: 'imp-96089: z = (dip depth relErr = 0.159457) / sqrt(2 / n_w = 291), the naive independent-window score.',
  },
  threads: {
    depthAndCount: {
      sourceTicket: 'imp-96452',
      plain:
        'z is set by two fixed inputs: the ~16% dip depth (relErr = 0.159457) and the window count '
        + '(n_w = 291). Reaching z = 2.0 at the same depth needs n_w >= 315 (+24 windows, +8.1%). But the '
        + 'T = 1.5e5 dip window [1.05e5, 1.95e5] is fully INTERIOR to the existing ordinate range (top '
        + '~6.003e5) -- not clipped -- so 291 is already every window that height can ever supply from this '
        + 'data. Verified zeros above ~6e5 add nothing at 1.5e5: more height is the wrong lever for this dip.',
    },
    correlationModel: {
      sourceTicket: 'imp-96489',
      plain:
        'directly evaluating the theoretical GUE adjacent-box correlation at this height gives '
        + 'rho_exact = -0.4639782 (anti-correlated), whose AR-1 correction lifts the effective count to '
        + 'n_eff ~ 794.8 and the score to z_eff = 3.1787 -- past 2-sigma. But z_eff = sqrt(f) * z_cons '
        + 'exactly, so this is not a competing estimate: it can only raise the naive figure, never lower it. '
        + 'The naive z_cons = 1.9234 is quoted precisely because it deliberately avoids leaning on this model.',
    },
    interiorScan: {
      sourceTicket: 'imp-96493',
      plain:
        'scanning every unclipped interior height above 1.5e5 that the existing measurements reach (ten '
        + 'candidates to T = 4.577e5) for a comparably deep alternative dip finds none: the next deepest is '
        + 'z = 1.0358 at T = 3.879e5, only ~54% as deep, and would need to run ~1.93x deeper to clear '
        + '2-sigma alone. The T = 1.5e5 excursion remains the single deepest dip in the fixed data set.',
    },
  },
  synthesis:
    'Under the naive, model-free convention the field actually quotes, the fixed 10^6-ordinate Odlyzko set '
    + 'caps the reachable excursion significance at z = 1.9234, just under 2-sigma. None of the three routes '
    + 'available WITHIN that fixed data set close the gap: more verified height does not help this specific '
    + 'dip (its window is already complete and interior); no other height in the same data set hosts a '
    + 'comparably deep alternative dip; and the one route that already clears 2-sigma (the AR-1 correlation '
    + 'correction) is deliberately excluded from the headline because it trades the model-free convention '
    + 'for a theoretical GUE assumption. Advancing past the naive 1.9-sigma needs either a genuinely deeper '
    + 'excursion at a height the current ordinates do not reach (new, higher verified zeros -- not more of '
    + 'the existing ones), or an explicit decision to adopt the correlation-corrected convention.',
  honest:
    'RESTATEMENT ONLY -- no new derivation, no numerics re-run; the four source measurements are cited '
    + 'verbatim. Changes no bound; NO QED; no refereed bound is changed; RH open; the zero-side '
    + 'route stays PCC/GRH-gated.',
};

export const IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP_ASSERTIONS = [
  {
    id: 'imp-96522-headline-figures-present',
    description: 'the writeup carries the exact z_cons = 1.9234 headline and the z = 2.0 target',
    holds: () =>
      IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP.headline.zCons === 1.9234
      && IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP.headline.zTarget === 2.0,
  },
  {
    id: 'imp-96522-all-four-source-tickets-cited',
    description: 'all four source tickets in the thread are named',
    holds: () =>
      ['imp-96089', 'imp-96452', 'imp-96489', 'imp-96493'].every((t) =>
        IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP.sourceTickets.includes(t)),
  },
  {
    id: 'imp-96522-three-threads-present',
    description: 'the depth/count, correlation-model, and interior-scan threads are each restated with a plain summary',
    holds: () =>
      ['depthAndCount', 'correlationModel', 'interiorScan'].every((k) => {
        const t = IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP.threads[k];
        return t && typeof t.plain === 'string' && t.plain.length > 0 && typeof t.sourceTicket === 'string';
      }),
  },
  {
    id: 'imp-96522-synthesis-names-the-cap',
    description: 'the synthesis explicitly names the fixed-data-set cap and the two closed / one deliberately-excluded routes',
    holds: () =>
      /caps the reachable excursion significance/.test(IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP.synthesis)
      && /1\.9234/.test(IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP.synthesis),
  },
  {
    id: 'imp-96522-honesty-gate-no-qed',
    description: 'restatement-only, no bound promoted, NO QED, no refereed bound is changed, RH open',
    holds: () =>
      /RESTATEMENT ONLY/.test(IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP.honest)
      && /NO QED/.test(IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP.honest)
      && /refereed bound is changed/i.test(IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP.honest)
      && /RH open/.test(IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP.honest),
  },
];

for (const a of IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96522-excursion-2sigma-thread-writeup assertion failed: ${a.id}`);
  }
}

export default IMP96522_EXCURSION_2SIGMA_THREAD_WRITEUP;
