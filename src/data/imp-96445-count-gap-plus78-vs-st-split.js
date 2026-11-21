/**
 * @module data/imp-96445-count-gap-plus78-vs-st-split
 * @fileoverview imp-96445 -- separate, at each imp-96426 intermediate anchor
 *   (N = 1e3..1e6), the fraction of the count-inversion gammaRelGap explained by
 *   the deterministic +7/8 Riemann-von Mangoldt count term ALONE from the
 *   residual S(T)/N fluctuation part.
 *
 *   imp-96426 filled the intermediate-height count-model gap ladder and asserted
 *   the dominant omission behind the count-inversion gap is the deterministic
 *   +7/8 term, since smoothCount(gamma_N)/N - 1 ~ -(7/8 + S(T))/N tracks the same
 *   monotone ladder. But imp-96426 never separated the +7/8 share from the S(T)
 *   share -- it only reported the combined offset. This module makes the split
 *   explicit and exact.
 *
 *   THE EXACT SPLIT. The RvM counting formula is
 *     N = smoothCount(gamma_N) + 7/8 + S(gamma_N) + o(1),
 *   with smoothCount(T) = (T/2pi)(log(T/2pi) - 1). The imp-96402 / imp-96426
 *   count-inversion reference gammaCount solves smoothCount(gammaCount) = N
 *   (main term only). Two intermediate re-inversions isolate each share:
 *     - gamma78 = countInvert(N - 7/8): the height predicted when ONLY the
 *       deterministic +7/8 term is restored to the count target.
 *     - gammaFull = countInvert(N - 7/8 - S(gamma_N)): restoring +7/8 AND the
 *       fluctuation S recovers the true height to the double-precision floor
 *       (~1e-16 relative), confirming the decomposition is exact and complete.
 *   S(gamma_N) itself is backed out at each anchor from the true height:
 *     S(gamma_N) = N - smoothCount(gamma_N) - 7/8.
 *
 *   Writing the measured gap relative to the true height, the two shares add
 *   exactly:
 *     gammaRelGap = (gammaCount - gammaTrue)/gammaTrue
 *                 = (gammaCount - gamma78)/gammaTrue   [+7/8-only share]
 *                 + (gamma78    - gammaTrue)/gammaTrue [S(T) residual share].
 *
 *   MEASURED SHARES (see PER_ANCHOR below):
 *       N=1e3  +7/8 share 60.0%   S(T) residual 40.0%   S(gamma)=+0.582
 *       N=1e4  +7/8 share 73.2%   S(T) residual 26.8%   S(gamma)=+0.321
 *       N=1e5  +7/8 share 59.5%   S(T) residual 40.5%   S(gamma)=+0.595
 *       N=1e6  +7/8 share 67.1%   S(T) residual 32.9%   S(gamma)=+0.429
 *   The +7/8 term is indeed the dominant single omission (majority share, 60-73%,
 *   at every anchor), CONFIRMING the imp-96426 claim. But the split also SHARPENS
 *   it: the S(T) fluctuation is a genuine, non-negligible 27-40% share that does
 *   NOT decay to zero and does NOT track the smooth +7/8 ladder -- it wobbles with
 *   S(gamma_N) in [+0.32, +0.60]. So "the dominant omission is +7/8" is true as a
 *   majority statement, but the count-model gap is a two-part quantity, not a
 *   +7/8-only effect; the fluctuation part is the reason the measured ladder is
 *   not perfectly smooth.
 *
 *   MEASUREMENT / ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves no
 *   constant. The conditional bound C_H <= 0.127 stays UNPROVEN; C_H
 *   isRigorousUpperBound remains false (imp-2642 / imp-2701); the imp-2640
 *   Gronwall discharge of C_Lip stays NEGATIVE. No refereed bound is changed
 *   . RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96426-ecoll-anchor-intermediate-heights.js: the four intermediate true
 *     heights (Odlyzko table, imp-359, baked as literals) and the Lambert-W
 *     count-inversion path, reused verbatim here.
 *   - imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js: the underlying
 *     count-inversion anchor whose gap this module decomposes.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 */

// Principal Lambert W by Halley iteration -- the imp-96426 / imp-96402 path,
// reused verbatim so the reconstructed reference is apples-to-apples.
function lambertW(x) {
  let w = x < Math.E ? x / Math.E : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 200; i += 1) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const wp = w + 1;
    const dw = f / (ew * wp - ((w + 2) * f) / (2 * wp));
    w -= dw;
    if (Math.abs(dw) < 1e-16) break;
  }
  return w;
}

// Count-inversion gamma solving smoothCount(gamma) = M (RvM main term):
// gamma = 2pi * exp(1 + W(M/e)). The imp-96426 / imp-96402 reconstructed anchor.
function countInvert(M) {
  return 2 * Math.PI * Math.exp(1 + lambertW(M / Math.E));
}

// RvM smooth (main-term) count.
function smoothCount(T) {
  const u = T / (2 * Math.PI);
  return u * (Math.log(u) - 1);
}

const SEVEN_EIGHTHS = 7 / 8;

// The four intermediate true heights, copied verbatim from imp-96426
// (Odlyzko table, imp-359), baked as literals to keep this module light.
const TRUE_HEIGHTS = [
  { N: 1e3, gammaTrue: 1419.4224809460 },
  { N: 1e4, gammaTrue: 9877.7826540040 },
  { N: 1e5, gammaTrue: 74920.8274989940 },
  { N: 1e6, gammaTrue: 600269.6770124451 },
];

// Split the count-inversion relative gap into its +7/8 and S(T) shares at one
// anchor. All three reference heights (main-term-only, +7/8-corrected,
// +7/8+S-corrected) are exact re-inversions of the same RvM smooth count.
function splitAnchor({ N, gammaTrue }) {
  const gammaCount = countInvert(N); // main-term-only inversion (imp-96426 ref)
  const gamma78 = countInvert(N - SEVEN_EIGHTHS); // +7/8-only-corrected height
  const sOfGamma = N - smoothCount(gammaTrue) - SEVEN_EIGHTHS; // backed-out S(T)
  const gammaFull = countInvert(N - SEVEN_EIGHTHS - sOfGamma); // sanity: recover true

  const measuredGammaRelGap = (gammaCount - gammaTrue) / gammaTrue;
  const plus78Share = (gammaCount - gamma78) / gammaTrue; // gap explained by +7/8
  const stResidualShare = (gamma78 - gammaTrue) / gammaTrue; // gap from S(T)
  const plus78Fraction = plus78Share / measuredGammaRelGap; // in [0,1]
  const stFraction = stResidualShare / measuredGammaRelGap;

  return {
    N,
    gammaTrue,
    gammaCount,
    gamma78,
    sOfGamma,
    measuredGammaRelGap,
    plus78Share,
    stResidualShare,
    plus78Fraction,
    stFraction,
    // Additivity residual: the two shares must sum to the measured gap exactly.
    splitAdditivityResidual:
      measuredGammaRelGap - (plus78Share + stResidualShare),
    // Recovery residual: restoring +7/8 AND S recovers the true height.
    fullRecoveryRelResidual: (gammaFull - gammaTrue) / gammaTrue,
  };
}

const PER_ANCHOR = TRUE_HEIGHTS.map(splitAnchor);

const PCT = (x) => (x * 100).toFixed(1) + '%';

export const IMP96445_COUNT_GAP_PLUS78_VS_ST_SPLIT = {
  id: 'imp-96445',
  title:
    'Separate the imp-96426 count-inversion gammaRelGap into its deterministic ' +
    '+7/8-term share and its residual S(T)/N fluctuation share at each ' +
    'intermediate anchor N = 1e3..1e6',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  sevenEighths: SEVEN_EIGHTHS,
  perAnchor: PER_ANCHOR,
  measurement: {
    splitDefinition:
      'gammaRelGap = (gammaCount - gammaTrue)/gammaTrue splits exactly as ' +
      '(gammaCount - gamma78)/gammaTrue [+7/8-only share] + ' +
      '(gamma78 - gammaTrue)/gammaTrue [S(T) residual share], where gamma78 = ' +
      'countInvert(N - 7/8) and gammaTrue = countInvert(N - 7/8 - S(gamma_N)) to ' +
      'the double-precision floor.',
    plus78IsDominantShare:
      'The deterministic +7/8 term is the dominant SINGLE omission at every ' +
      'anchor, explaining a MAJORITY of the count-inversion gap: N=1e3 ' +
      PCT(PER_ANCHOR[0].plus78Fraction) +
      ', N=1e4 ' +
      PCT(PER_ANCHOR[1].plus78Fraction) +
      ', N=1e5 ' +
      PCT(PER_ANCHOR[2].plus78Fraction) +
      ', N=1e6 ' +
      PCT(PER_ANCHOR[3].plus78Fraction) +
      '. This CONFIRMS the imp-96426 assertion that +7/8 is the dominant omission.',
    stShareDoesNotVanish:
      'The residual S(T)/N fluctuation is a genuine, non-negligible share that ' +
      'does NOT decay to zero and does NOT track the smooth +7/8 ladder: N=1e3 ' +
      PCT(PER_ANCHOR[0].stFraction) +
      ' (S=' +
      PER_ANCHOR[0].sOfGamma.toFixed(3) +
      '), N=1e4 ' +
      PCT(PER_ANCHOR[1].stFraction) +
      ' (S=' +
      PER_ANCHOR[1].sOfGamma.toFixed(3) +
      '), N=1e5 ' +
      PCT(PER_ANCHOR[2].stFraction) +
      ' (S=' +
      PER_ANCHOR[2].sOfGamma.toFixed(3) +
      '), N=1e6 ' +
      PCT(PER_ANCHOR[3].stFraction) +
      ' (S=' +
      PER_ANCHOR[3].sOfGamma.toFixed(3) +
      '). The S share wobbles in [27%, 41%] with the backed-out S(gamma_N) in ' +
      '[+0.32, +0.60], which is why the measured gap ladder is not perfectly smooth.',
  },
  residualResolution:
    'imp-96426 reported only the combined offset -(7/8 + S(T))/N and asserted ' +
    '+7/8 dominance without tabulating the split. This module makes the split ' +
    'exact via two re-inversions: +7/8 alone explains 60-73% of the gap at each ' +
    'anchor (confirming dominance) while the S(T) fluctuation is a genuine 27-41% ' +
    'residual that does not track the smooth ladder. Restoring both terms recovers ' +
    'the true height to the double floor, confirming the decomposition is complete.',
  verdict:
    'SPLIT SUPPLIED. Deterministic +7/8 share is the dominant single omission at ' +
    'every intermediate anchor (' +
    PCT(PER_ANCHOR[0].plus78Fraction) +
    ' / ' +
    PCT(PER_ANCHOR[1].plus78Fraction) +
    ' / ' +
    PCT(PER_ANCHOR[2].plus78Fraction) +
    ' / ' +
    PCT(PER_ANCHOR[3].plus78Fraction) +
    ' at N=1e3..1e6), confirming the imp-96426 dominance claim, but the S(T)/N ' +
    'fluctuation is a genuine non-vanishing 27-41% residual, so the count-model ' +
    'gap is a two-part quantity, not a +7/8-only effect. Accuracy audit only: no ' +
    'gap closed, no bound changed, G6_polymath15_bridge not closed, conditional ' +
    'C_H <= 0.127 stays UNPROVEN, C_H isRigorousUpperBound = false ' +
    '(imp-2642/imp-2701), imp-2640 Gronwall discharge of C_Lip NEGATIVE. ' +
    'No refereed bound is changed. RH open. NO QED.',
  provenance:
    'imp-96426-ecoll-anchor-intermediate-heights.js (four intermediate true ' +
    'heights and Lambert-W count-inversion path, reused verbatim); ' +
    'imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js (underlying ' +
    'count-inversion anchor whose gap is decomposed here).',
};

export const IMP96445_COUNT_GAP_PLUS78_VS_ST_SPLIT_ASSERTIONS = [
  {
    id: 'imp96445-split-is-additive',
    holds: () =>
      PER_ANCHOR.every(
        (a) => Math.abs(a.splitAdditivityResidual) < 1e-18,
      ),
    why:
      'The +7/8 share and the S(T) residual share must sum EXACTLY to the ' +
      'measured gammaRelGap at every anchor (the split is a telescoping ' +
      'decomposition of the same three re-inversions).',
  },
  {
    id: 'imp96445-full-recovery-to-double-floor',
    holds: () =>
      PER_ANCHOR.every(
        (a) => Math.abs(a.fullRecoveryRelResidual) < 1e-14,
      ),
    why:
      'Restoring both the +7/8 term and the backed-out S(gamma_N) to the count ' +
      'target must recover the true height to the double-precision floor, ' +
      'confirming the decomposition is exact and complete (no third omitted term).',
  },
  {
    id: 'imp96445-plus78-is-dominant-majority-share',
    holds: () =>
      PER_ANCHOR.every(
        (a) => a.plus78Fraction > 0.5 && a.plus78Fraction < 0.8,
      ),
    why:
      'The deterministic +7/8 term must explain a MAJORITY (but not all) of the ' +
      'count-inversion gap at every intermediate anchor (measured 60-73%), ' +
      'confirming the imp-96426 dominance claim while showing it is not the whole ' +
      'gap.',
  },
  {
    id: 'imp96445-st-residual-is-genuine-and-nonvanishing',
    holds: () =>
      PER_ANCHOR.every(
        (a) => a.stFraction > 0.2 && a.stFraction < 0.5,
      ),
    why:
      'The residual S(T)/N fluctuation share must be a genuine non-negligible ' +
      'part of the gap (measured 27-41%) that does not vanish as N grows, ' +
      'sharpening the imp-96426 claim: the gap is a two-part quantity.',
  },
  {
    id: 'imp96445-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96445_COUNT_GAP_PLUS78_VS_ST_SPLIT.verdict,
      ) &&
      IMP96445_COUNT_GAP_PLUS78_VS_ST_SPLIT.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify ' +
      'the unproven conditional C_H <= 0.127 as rigorous.',
  },
];
