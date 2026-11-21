/**
 * @fileoverview r5-p47-far-2026-10-05 — P47 floors outside the near box. The suggested far-region monotonicity route was not carried to a
 * certificate; a global separable majorant (cone Lemma C, quadratic Lemma Q, K0 Lemma K, minimum over four variants per piece, wol-pd
 * region ladder; no near box, no monotonicity) certifies 198 of the 372 path P47 floors at margins 0.0753–0.8765 (> 0.0223, admitted by
 * Lemma 1 at their margin). One adversarial internal referee pass (tmp/r5-ref-p47-far-*): not refuted, minor.
 *
 * Referee corrections applied:
 *  - Framing: the certificates use a global separable (cone/Lipschitz-type) majorant, not a monotonicity argument; the requested route
 *    (near box + far-region monotonicity) is NOT completed. Per-coordinate monotonicity is false at the measured entry 401|0.88|sharp
 *    (argmax drift up to 0.225 rad; referee spot check confirms 0.075/0.0875 rad); no general impossibility is shown.
 *  - Sub-0.145 threshold: uniform P47 margin about 0.0436 or less (exact consumer: 0.04 → 0.144967739563938, 0.045 → 0.145012851330386,
 *    0.05 → 0.145058131941899), not '≈ 0.045'.
 *  - Lemma K as used is the NB-head form (tail m > NB bounded θ-uniformly).
 *  - Margins carry configuration noise ±0.02–0.03 (t-piece count, first-admissible far-tail δ); referee nt = 2 re-certificates: 75 of 80
 *    lower, 5 higher (cells 264–272, δ 0.2 → 0.3); all 68 path floors have a referee margin ≤ the claimed one at some configuration.
 *  - Resources: claimant processes peaked at 3.95–4.04e9 bytes (within 4 GiB, borderline against a decimal 4 GB cap).
 *  - Not reproduced (not load-bearing): Taylor-model excess tables, η-pair costs, BnB extrapolation, Lipschitz constants, cone excursions.
 *  - r5 synthesis (2026-10-05): the cone engine imports the r4 wol-pd norms_tails unchanged, so it carries the block-suffix rounding gap
 *    found by the p29-43 referee; the synthesis admits these shifts lowered by 2e-7 and only with a measured gap ≤ 1.5e-7 per path entry.
 *    The value 0.146695115700908 was computed on the r4 merged admission (147 r3core4.c floors, not certified after F3): SUPERSEDED.
 *
 * PROVED (elementary, refereed internally): Lemmas C, Q, K (NB-head form), separable-majorant theorem, min over variants.
 * CERTIFIED (single implementation, one internal referee pass): 198 P47 floors at margins 0.075278–0.876493; WOL-C at 0.0223: 0 of 372.
 * MEASURED: argmax drift, Taylor-model probes, sensitivity. HEURISTIC: box covers infeasible; constant-loss floor ~0.045 for global majorants.
 * Import-free. ASSERTIONS recompute the counts, the threshold interpolation and the ordering.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const lt = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return a * d < c * b; };

export const R5_P47_FAR = Object.freeze({
  id: 'r5-p47-far-2026-10-05',
  date: '2026-10-05',
  title: 'P47 by a global separable (cone) majorant: 198 P47 floors certified at margins 0.075–0.88; WOL-C at 0.0223 for none',
  status: 'PARTIAL: 198 of 372 path P47 floors certified at finite margin (Lemma 1); WOL-C (0.0223) for 0 of 372; the far-region monotonicity route was not completed. One internal referee pass (minor). NO QED.',
  certified: Object.freeze({ n: 198, of: 372, marginMin: 0.075278, marginMedian: 0.2215, marginMax: 0.876493, wolc: 0, bins: { le01: 10, le02: 85, le03: 129 } }),
  refereeRecert: Object.freeze({ n: 80, onPath: 68, lower: 75, higher: 5, fails: 0 }),
  uniformMarginSensitivity: Object.freeze([
    { m: 0.0223, value: '0.144808034' }, { m: 0.04, value: '0.144967739563938' }, { m: 0.045, value: '0.145012851330386' }, { m: 0.05, value: '0.145058131941899' },
  ]),
  measured: Object.freeze({ argmaxDriftRad: 0.225, refereeArgmaxDriftRad: [0.075, 0.0875], farBox235: { point: -0.345, box: 0.214 }, costPerCertCpuS: 85 }),
  values: Object.freeze({
    claimedCert: { exact: '36673778925227/250000000000000', dec: '0.146695115700908', note: 'on the r4 merged admission (r3core4.c floors not certified after F3): SUPERSEDED' },
    refereeOnly: { exact: '146677126648597/1000000000000000', dec: '0.146677126648597', note: 'referee shifts, same r4 basis: SUPERSEDED' },
  }),
  verdict: 'NOT PROVED: WOL-C at margin 0.0223 holds for 0 of the 372 P47 floors. The suggested near-box + far-region monotonicity route was '
    + 'not completed (per-coordinate monotonicity measured false at one entry; far-box Taylor bounds measured too loose). A global separable '
    + 'cone majorant certifies 198 P47 floors at margins 0.0753-0.8765, admitted by Lemma 1 at their margin. Sub-0.145 needs every P47 margin '
    + 'at about 0.0436 or less. Lambda < 0.145 is NOT certified. No refereed bound is changed. RH open. NO QED.',
});

const W = R5_P47_FAR;
export const R5_P47_FAR_ASSERTIONS = Object.freeze([
  {
    id: 'r5-p47far-counts',
    holds: () => W.certified.wolc === 0 && W.certified.marginMin > 0.0223 && W.certified.bins.le01 <= W.certified.bins.le02 && W.certified.bins.le02 <= W.certified.bins.le03
      && W.certified.bins.le03 <= W.certified.n && W.certified.n <= W.certified.of && W.refereeRecert.lower + W.refereeRecert.higher === W.refereeRecert.n,
    why: 'Every certified P47 margin exceeds 0.0223 (no WOL-C); 198 of 372; referee re-certificates 75 lower + 5 higher of 80.',
  },
  {
    id: 'r5-p47far-threshold',
    holds: () => {
      const s = W.uniformMarginSensitivity; const a = s[1], b = s[2];
      const mstar = a.m + (b.m - a.m) * (0.145 - Number(a.value)) / (Number(b.value) - Number(a.value));
      return mstar > 0.043 && mstar < 0.044 && s.every((x, i) => i === 0 || Number(x.value) > Number(s[i - 1].value));
    },
    why: 'Linear interpolation of the exact consumer runs puts the uniform P47 margin needed for 0.145 at about 0.0436 (referee correction).',
  },
  {
    id: 'r5-p47far-values',
    holds: () => Object.values(W.values).every((v) => { const n = exact15(v.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(v.dec)) < 1e-16; })
      && lt(W.values.refereeOnly.exact, W.values.claimedCert.exact),
    why: 'Exact decimals of the (superseded) r4-basis values.',
  },
  {
    id: 'r5-p47far-honest',
    holds: () => /NO QED/.test(W.status) && /not completed/.test(W.verdict) && /refereed bound is changed/i.test(W.verdict) && /SUPERSEDED/.test(W.values.claimedCert.note),
    why: 'The monotonicity route is not completed; no WOL-C at P47; no QED.',
  },
]);

export default R5_P47_FAR;
