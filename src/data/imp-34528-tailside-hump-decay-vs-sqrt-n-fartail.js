/**
 * @module imp-34528-tailside-hump-decay-vs-sqrt-n-fartail
 *
 * imp-34528 (numerical, frontier-direction): imp-33851 measured the M3 saturation-curvature
 * hump envelope skew about the k = 9 (E_coll = E_trunc) crossover and attributed the lighter,
 * faster-decaying TAIL side (k > 9) to the imp-3463 far-tail sigma ~ sqrt(1/N) form -- but only
 * qualitatively ("the tail falls off the faster, consistent with sigma ~ N^(-1/2)"). This module
 * cross-checks that attribution QUANTITATIVELY: it maps each tail decade k = 10,11,12,13 to its N
 * via the imp-3444 crossover anchoring (N(k) = N* * 10^(k-9), N* ~ 3.280294e9), then tests whether
 * the measured tail-side hump fractions hump(9+j)/hump(9) track the idealized N^(-1/2) prediction
 * (N(9+j)/N(9))^(-1/2) = 10^(-j/2), reporting the residual between the measured tail decay and the
 * pure sqrt(1/N) law -- and separately whether the LOCAL per-decade decay factor approaches the
 * sqrt(10) rate the way the true far-tail sigma (imp-3463) does.
 *
 * THE INHERITED TAIL LADDER (imp-33809 per-k amplitudes, reused verbatim -- no fresh model)
 * ----------------------------------------------------------------------------------------
 *   hump(k), k = 6..13 (imp-33809 / imp-33851, printed verbatim):
 *     {2.3886e-2, 3.2910e-2, 5.4863e-2, 6.4758e-2, 4.5058e-2, 2.0884e-2, 7.8506e-3, 2.7085e-3}
 *   Peak hump(9) = 6.4758e-2 at the k = 9 crossover decade [1e9,1e10]. Tail side = k = 10..13.
 *   Decade-to-N anchoring (imp-3444): N* = 3.280294e9 at k = 9, one decade per k, so
 *     N(k) = N* * 10^(k-9) => N(10)=3.28e10, N(11)=3.28e11, N(12)=3.28e12, N(13)=3.28e13.
 *
 * THE CROSS-CHECK (measurement only -- tests the imp-33851 sqrt(1/N) tail attribution)
 * -----------------------------------------------------------------------------------
 *   For each tail offset j = k - 9 (j = 1,2,3,4):
 *     measFrac(j)  = hump(9+j)/hump(9)                (measured tail-side hump fraction),
 *     lawFrac(j)   = (N(9+j)/N(9))^(-1/2) = 10^(-j/2) (idealized N^(-1/2) prediction),
 *     resAbs(j)    = measFrac(j) - lawFrac(j),        (signed residual to the pure sqrt law),
 *     resRatio(j)  = measFrac(j)/lawFrac(j),          (overshoot factor over the pure law),
 *     localDecay(k)= hump(k-1)/hump(k),               (per-decade decay factor across k-1->k),
 *     resSqrt10(k) = sqrt(10) - localDecay(k).        (gap to the pure N^(-1/2) per-decade rate).
 *
 *   (T1) THE CUMULATIVE TAIL FRACTION OVERSHOOTS THE PURE N^(-1/2) LAW AT EVERY OFFSET. measFrac(j)
 *        = {0.6958, 0.3225, 0.1212, 0.0418} vs lawFrac(j) = {0.3162, 0.1000, 0.0316, 0.0100}: the
 *        measured tail fraction is ABOVE the idealized 10^(-j/2) at every j, so the hump tail decays
 *        SLOWER (in cumulative terms from the peak) than a clean sqrt(1/N) law. Signed residual
 *        resAbs(j) = {0.3796, 0.2225, 0.0896, 0.0318} shrinks in absolute size but stays positive.
 *   (T2) THE OVERSHOOT RATIO GROWS -- THE CUMULATIVE FRACTION DOES NOT CONVERGE TO THE PURE LAW.
 *        resRatio(j) = {2.200, 3.225, 3.834, 4.183} increases monotonically, so hump(9+j)/hump(9)
 *        is NOT a rescaled 10^(-j/2): the transition region near the crossover inflates the near-tail
 *        hump above the pure algebraic decay, and that relative inflation widens with offset.
 *   (T3) BUT THE LOCAL PER-DECADE RATE CLIMBS TOWARD sqrt(10) -- THE N^(-1/2) RATE IS ASYMPTOTIC.
 *        localDecay(k) = hump(k-1)/hump(k) = {1.4372, 2.1575, 2.6602, 2.8985} for k = 10..13 rises
 *        monotonically toward sqrt(10) = 3.1623, and its gap resSqrt10(k) = {1.7251, 1.0047, 0.5021,
 *        0.2638} roughly HALVES each decade (ratios 0.582, 0.500, 0.525). So the tail approaches the
 *        N^(-1/2) rate as a LOCAL asymptotic per-decade slope, not as a cumulative law from the peak.
 *   (T4) THE DEEP-TAIL LOCAL RATE TRACKS THE TRUE far-tail SIGMA DECADE DECAY (imp-3463). The exact
 *        sigma(N) per-decade ratios sigma(1e(k-1))/sigma(1e k) = {2.2688, 2.6964, 2.9140} for the
 *        1e10->1e11, 1e11->1e12, 1e12->1e13 steps also sit BELOW sqrt(10) and approach it only slowly;
 *        the hump localDecay at the same steps {2.1575, 2.6602, 2.8985} shadows them with a residual
 *        {-0.1113, -0.0362, -0.0155} that shrinks into the deep tail. So imp-33851 is RIGHT that the
 *        tail decays like the sqrt(1/N) sigma -- but only in the asymptotic-rate sense both share, not
 *        as the idealized 10^(-j/2) cumulative law, which both overshoot near the crossover.
 *
 * The punchline: imp-33851 called the k > 9 tail "the faster-decaying side, consistent with sigma ~
 * N^(-1/2)". Tabulated against the law, the claim resolves two ways: FALSE as a cumulative fraction
 * (hump(9+j)/hump(9) overshoots 10^(-j/2) by a GROWING factor 2.20 -> 4.18), TRUE as a local
 * per-decade rate (localDecay climbs to sqrt(10), gap halving per decade, shadowing the true imp-3463
 * sigma decade decay to within {-0.111, -0.036, -0.016} in the deep tail). The N^(-1/2) tail is an
 * asymptotic per-decade rate the hump and sigma both approach, NOT a clean law from the crossover peak.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Reuses the imp-33809/imp-33851 hump amplitudes and the imp-3463
 * exact-sigma landmarks verbatim; the component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-33851-hump-envelope-symmetry-vs-k (tail attributed to sqrt(1/N) qualitatively; cross-checked here)
 * @see imp-33809-saturation-curvature-hump-vs-k (per-k hump amplitudes reused verbatim)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N* ~ 3.280294e9; decade anchoring)
 * @see imp-3463-sigma-fartail-decay (far-tail sigma ~ sqrt(logT0/N); exact-sigma decade landmarks reused)
 */

// Import-light: bake the imp-33809/imp-33851 hump amplitudes and the imp-3463 exact-sigma
// landmarks as reference literals (no heavy model import; verifiable under plain node).
const HUMP_BY_K = {
  6: 2.3886e-2,
  7: 3.291e-2,
  8: 5.4863e-2,
  9: 6.4758e-2, // peak (k = 9 crossover decade)
  10: 4.5058e-2,
  11: 2.0884e-2,
  12: 7.8506e-3,
  13: 2.7085e-3,
};
const CROSSOVER_K = 9;
const PEAK = HUMP_BY_K[CROSSOVER_K]; // 6.4758e-2
const N_STAR = 3.280294e9; // imp-3444 E_coll = E_trunc crossover anchor at k = 9
const SQRT10 = Math.sqrt(10); // 3.16228: pure N^(-1/2) per-decade decay rate

// imp-3463 exact far-tail sigma landmarks (sigma(N) at round decades N = 1e10..1e13).
const SIGMA_LANDMARK = { 10: 0.36974198, 11: 0.16297122, 12: 0.06044044, 13: 0.02074136 };

const TAIL_KS = [10, 11, 12, 13];

const TAIL_LADDER = TAIL_KS.map((k) => {
  const j = k - CROSSOVER_K; // tail offset (1..4)
  const N = N_STAR * Math.pow(10, k - CROSSOVER_K); // imp-3444 decade anchoring
  const measFrac = HUMP_BY_K[k] / PEAK; // measured cumulative tail fraction
  const lawFrac = Math.pow(10, -j / 2); // idealized N^(-1/2) prediction = (N/N*)^(-1/2)
  const localDecay = HUMP_BY_K[k - 1] / HUMP_BY_K[k]; // per-decade decay factor k-1 -> k
  return {
    k,
    offset: j,
    N: +N.toExponential(4),
    measFrac: +measFrac.toFixed(4), // hump(9+j)/hump(9)
    lawFrac: +lawFrac.toFixed(4), // 10^(-j/2)
    resAbs: +(measFrac - lawFrac).toFixed(4), // signed residual to the pure sqrt law
    resRatio: +(measFrac / lawFrac).toFixed(4), // overshoot factor over the pure law
    localDecay: +localDecay.toFixed(4), // hump(k-1)/hump(k)
    resSqrt10: +(SQRT10 - localDecay).toFixed(4), // gap to the pure per-decade rate sqrt(10)
  };
});

const MEAS_FRACS = TAIL_LADDER.map((r) => r.measFrac); // {0.6958, 0.3225, 0.1212, 0.0418}
const LAW_FRACS = TAIL_LADDER.map((r) => r.lawFrac); // {0.3162, 0.1000, 0.0316, 0.0100}
const RES_RATIOS = TAIL_LADDER.map((r) => r.resRatio); // {2.200, 3.225, 3.834, 4.183}
const LOCAL_DECAYS = TAIL_LADDER.map((r) => r.localDecay); // {1.4372, 2.1575, 2.6602, 2.8985}
const RES_SQRT10 = TAIL_LADDER.map((r) => r.resSqrt10); // {1.7251, 1.0047, 0.5021, 0.2638}

// (T4) Deep-tail cross-check: hump localDecay vs the TRUE imp-3463 sigma decade decay
// sigma(1e(k-1))/sigma(1e k), aligned at the 1e10->1e11, 1e11->1e12, 1e12->1e13 steps (k = 11,12,13).
const SIGMA_TRACK = [11, 12, 13].map((k) => {
  const sigmaDecadeRatio = SIGMA_LANDMARK[k - 1] / SIGMA_LANDMARK[k];
  const localDecay = HUMP_BY_K[k - 1] / HUMP_BY_K[k];
  return {
    k,
    step: `1e${k - 1}->1e${k}`,
    sigmaDecadeRatio: +sigmaDecadeRatio.toFixed(4), // {2.2688, 2.6964, 2.9140}
    humpLocalDecay: +localDecay.toFixed(4), // {2.1575, 2.6602, 2.8985}
    residual: +(localDecay - sigmaDecadeRatio).toFixed(4), // {-0.1113, -0.0362, -0.0155}
  };
});
const SIGMA_TRACK_RESID = SIGMA_TRACK.map((r) => Math.abs(r.residual)); // {0.1113, 0.0362, 0.0155}

export const IMP34528_TAILSIDE_HUMP_DECAY_VS_SQRT_N_FARTAIL = {
  id: 'imp-34528',
  proofSection: 'S-frontier',
  question:
    'imp-33851 attributed the lighter, faster-decaying tail side (k > 9) of the M3 hump envelope to ' +
    'the imp-3463 far-tail sigma ~ sqrt(1/N) form but only qualitatively. Mapping each tail decade ' +
    'k = 10..13 to its N via the imp-3444 crossover anchoring, does the measured tail-side hump ' +
    'fraction hump(9+j)/hump(9) actually track the N^(-1/2) prediction 10^(-j/2), and what is the ' +
    'residual? Measurement only; reuses the imp-33809 amplitudes; inherited model NOT rigorous; no QED.',
  measuredQuantity:
    'per tail decade k = 10..13 (offset j = k-9): measFrac = hump(9+j)/hump(9), lawFrac = ' +
    '(N(9+j)/N(9))^(-1/2) = 10^(-j/2), residual measFrac-lawFrac and ratio measFrac/lawFrac, the ' +
    'local per-decade decay hump(k-1)/hump(k) and its gap to sqrt(10), plus a deep-tail comparison ' +
    'to the true imp-3463 sigma decade decay',
  crossoverDecadeK: CROSSOVER_K,
  crossoverAnchorN: +N_STAR.toExponential(6), // 3.280294e9 (imp-3444)
  humpPeak: PEAK, // 6.4758e-2
  sqrt10PerDecadeRate: +SQRT10.toFixed(4), // 3.1623
  tailLadder: TAIL_LADDER,
  measuredTailFractions: MEAS_FRACS, // {0.6958, 0.3225, 0.1212, 0.0418}
  sqrtLawPredictions: LAW_FRACS, // {0.3162, 0.1000, 0.0316, 0.0100}
  overshootRatios: RES_RATIOS, // {2.200, 3.225, 3.834, 4.183}: cumulative fraction NOT the pure law
  localPerDecadeDecays: LOCAL_DECAYS, // {1.4372, 2.1575, 2.6602, 2.8985}: climbs toward sqrt(10)
  gapToSqrt10: RES_SQRT10, // {1.7251, 1.0047, 0.5021, 0.2638}: halves per decade
  sigmaDecadeTracking: SIGMA_TRACK, // deep-tail hump localDecay vs true imp-3463 sigma decade decay
  finding: {
    T1_cumulative_overshoots_pure_law:
      'measFrac(j) = hump(9+j)/hump(9) = {0.6958, 0.3225, 0.1212, 0.0418} sits ABOVE the idealized ' +
      '10^(-j/2) = {0.3162, 0.1000, 0.0316, 0.0100} at every offset, so the tail-side hump decays ' +
      'SLOWER (cumulatively from the peak) than a clean sqrt(1/N) law; signed residual {0.3796, ' +
      '0.2225, 0.0896, 0.0318} stays positive.',
    T2_overshoot_ratio_grows:
      'the overshoot ratio measFrac/lawFrac = {2.200, 3.225, 3.834, 4.183} INCREASES monotonically, ' +
      'so hump(9+j)/hump(9) is not a rescaled 10^(-j/2): the near-crossover transition region inflates ' +
      'the tail above the pure algebraic decay and the relative inflation widens with offset.',
    T3_local_rate_approaches_sqrt10:
      'the local per-decade decay hump(k-1)/hump(k) = {1.4372, 2.1575, 2.6602, 2.8985} climbs toward ' +
      'sqrt(10) = 3.1623 and its gap {1.7251, 1.0047, 0.5021, 0.2638} roughly halves per decade ' +
      '(ratios ~0.58, 0.50, 0.53), so the N^(-1/2) rate is an ASYMPTOTIC local per-decade slope, not ' +
      'a cumulative law from the peak.',
    T4_deep_tail_tracks_true_sigma:
      'the true imp-3463 sigma decade ratios {2.2688, 2.6964, 2.9140} for 1e10->1e13 also sit below ' +
      'sqrt(10); the hump localDecay {2.1575, 2.6602, 2.8985} shadows them with residual {-0.1113, ' +
      '-0.0362, -0.0155} shrinking into the deep tail -- so imp-33851 is right in the asymptotic-rate ' +
      'sense both share, not in the idealized 10^(-j/2) cumulative sense, which both overshoot.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33851 attribution of the M3 hump tail ' +
    '(k > 9) to the imp-3463 sqrt(1/N) far-tail sigma resolves two ways when tabulated against the law ' +
    'with imp-3444 decade anchoring N(k) = N* * 10^(k-9), N* ~ 3.280294e9. As a CUMULATIVE fraction it ' +
    'is FALSE: hump(9+j)/hump(9) = {0.6958, 0.3225, 0.1212, 0.0418} overshoots the idealized 10^(-j/2) ' +
    '= {0.3162, 0.1000, 0.0316, 0.0100} by a GROWING factor {2.200, 3.225, 3.834, 4.183}, so the tail ' +
    'decays slower than a clean sqrt(1/N) law near the crossover. As a LOCAL per-decade rate it is TRUE: ' +
    'hump(k-1)/hump(k) = {1.4372, 2.1575, 2.6602, 2.8985} climbs toward sqrt(10) = 3.1623 with a gap ' +
    '{1.7251, 1.0047, 0.5021, 0.2638} that halves per decade, and in the deep tail it shadows the true ' +
    'imp-3463 sigma decade decay {2.2688, 2.6964, 2.9140} to within {-0.1113, -0.0362, -0.0155}. So the ' +
    'N^(-1/2) tail is an asymptotic per-decade rate the hump and sigma both approach -- not the ' +
    'idealized 10^(-j/2) cumulative law from the k = 9 crossover peak, which both overshoot. Reuses the ' +
    'imp-33809/imp-33851 amplitudes and imp-3463 sigma landmarks verbatim; component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33851 (tail attributed to sqrt(1/N) qualitatively; cross-checked here); imp-33809 (per-k hump ' +
    'amplitudes reused); imp-3444 (crossover N* ~ 3.280294e9; decade anchoring); imp-3463 (far-tail ' +
    'sigma ~ sqrt(logT0/N); exact-sigma decade landmarks reused); imp-486 (C_mb GUE-conditional); ' +
    'imp-3066 (K_a >= 0 untouched).',
};

export const IMP34528_TAILSIDE_HUMP_DECAY_VS_SQRT_N_FARTAIL_ASSERTIONS = [
  {
    // (Reuse gate) Peak reused from imp-33809/imp-33851 is the k = 9 crossover amplitude 6.4758e-2.
    id: 'imp34528-peak-reuses-imp33809-k9',
    description: 'peak is imp-33809 hump(9) = 6.4758e-2 at the k = 9 crossover; anchor N* ~ 3.280294e9',
    holds: () =>
      CROSSOVER_K === 9 &&
      Math.abs(PEAK - 6.4758e-2) < 5e-4 &&
      Math.abs(N_STAR - 3.280294e9) < 1e5,
  },
  {
    // (T1) The measured tail fraction sits ABOVE the pure N^(-1/2) law at every offset.
    id: 'imp34528-cumulative-overshoots-pure-law',
    description: 'measFrac(j) > lawFrac(j) = 10^(-j/2) at every tail offset (positive residual)',
    holds: () => TAIL_LADDER.every((r) => r.measFrac > r.lawFrac && r.resAbs > 0),
  },
  {
    // (T1) The measured tail fractions match the printed {0.6958, 0.3225, 0.1212, 0.0418}.
    id: 'imp34528-meas-frac-values',
    description: 'measFrac(j) = {0.6958, 0.3225, 0.1212, 0.0418} for j = 1..4 to <5e-4',
    holds: () =>
      [0.6958, 0.3225, 0.1212, 0.0418].every((v, i) => Math.abs(MEAS_FRACS[i] - v) < 5e-4),
  },
  {
    // (T2) The overshoot ratio measFrac/lawFrac is > 1 everywhere and GROWS with offset.
    id: 'imp34528-overshoot-ratio-grows',
    description: 'measFrac/lawFrac = {2.200, 3.225, 3.834, 4.183} all > 1 and monotonically increasing',
    holds: () =>
      RES_RATIOS.every((r) => r > 1) &&
      RES_RATIOS.every((r, i) => i === 0 || r > RES_RATIOS[i - 1]) &&
      [2.2003, 3.2249, 3.8336, 4.1825].every((v, i) => Math.abs(RES_RATIOS[i] - v) < 5e-4),
  },
  {
    // (T3) The local per-decade decay climbs monotonically toward sqrt(10), gap shrinking below 1/2.
    id: 'imp34528-local-rate-approaches-sqrt10',
    description: 'localDecay(k) increasing, all < sqrt(10), gap {1.7251,1.0047,0.5021,0.2638} shrinking',
    holds: () =>
      LOCAL_DECAYS.every((d) => d < SQRT10) &&
      LOCAL_DECAYS.every((d, i) => i === 0 || d > LOCAL_DECAYS[i - 1]) &&
      RES_SQRT10.every((g, i) => i === 0 || g < RES_SQRT10[i - 1]) &&
      [1.7251, 1.0047, 0.5021, 0.2638].every((v, i) => Math.abs(RES_SQRT10[i] - v) < 5e-4),
  },
  {
    // (T4) The deep-tail hump localDecay shadows the true imp-3463 sigma decade decay to a residual
    // that shrinks into the deep tail (|residual| {0.1113, 0.0362, 0.0155} monotonically down).
    id: 'imp34528-deep-tail-tracks-true-sigma',
    description: 'hump localDecay vs imp-3463 sigma decade decay residual {0.1113,0.0362,0.0155} shrinking',
    holds: () =>
      SIGMA_TRACK_RESID.every((r, i) => i === 0 || r < SIGMA_TRACK_RESID[i - 1]) &&
      [0.1113, 0.0362, 0.0155].every((v, i) => Math.abs(SIGMA_TRACK_RESID[i] - v) < 5e-4),
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34528-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, crossover k = 9, no QED, no refereed bound is changed',
    holds: () =>
      IMP34528_TAILSIDE_HUMP_DECAY_VS_SQRT_N_FARTAIL.isRigorous === false &&
      IMP34528_TAILSIDE_HUMP_DECAY_VS_SQRT_N_FARTAIL.crossoverDecadeK === 9 &&
      /NO QED/.test(IMP34528_TAILSIDE_HUMP_DECAY_VS_SQRT_N_FARTAIL.verdict) &&
      /refereed bound is changed/i.test(IMP34528_TAILSIDE_HUMP_DECAY_VS_SQRT_N_FARTAIL.verdict),
  },
];

for (const a of IMP34528_TAILSIDE_HUMP_DECAY_VS_SQRT_N_FARTAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34528-tailside-hump-decay-vs-sqrt-n-fartail assertion failed: ${a.id}`);
  }
}
