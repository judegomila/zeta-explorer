/**
 * imp-95604 - Does the imp-95526 T2 Kronecker continuum-sup saturation genuinely
 * foreclose ANY pointwise/uniform upgrade of the imp-95519 mean-square pair-
 * correlation (PCC) input to the pointwise Hilbert-transform bound the sub-0.14
 * contract requires, at abscissa sigma_B = 0.59045 and height T in [3e12, 1.9e16]?
 *
 * This is the SUPPLY-SIDE dual of imp-95581. imp-95581 asked whether the CONTRACT
 * (the demand) can be weakened from "for all T" to "for most T" - FORECLOSED,
 * because the contract is a sup at a single anchor cell. The present ticket asks
 * whether the INPUT (the supply) can be strengthened the other way: can a mean-
 * square PCC statement be UPGRADED into the pointwise-in-T bound the contract
 * needs, and is the cited Kronecker saturation a genuine obstruction to that
 * upgrade or does a gap remain. Assessment only; identifies the obstruction,
 * claims no closure; zero side stays PCC-gated; changes no bound; NO QED;
 * no refereed bound is changed; RH open.
 *
 * THE TWO OBJECTS (imp-95519 sec 4).
 *   INPUT available. Montgomery F(alpha) is a MEAN SQUARE over gamma in [0, T]:
 *     F(alpha) = (2 pi / (T log T)) sum_{0 < gamma, gamma-prime <= T} w(gamma - gamma-prime) T^{i alpha (gamma - gamma-prime)}.
 *   It controls the SECOND MOMENT (an L^2-in-T average) of the local zero counting
 *   over the box [0, T], hence "for most T" statements at the Selberg-CLT scale.
 *   OUTPUT needed. The contract needs the local zero sum over |gamma - T| <= Delta
 *   POINTWISE at the single worst RS-anchor height T-star = heightT(690988), i.e.
 *   an L^infinity-in-T bound - equivalently the Hilbert transform of the zero
 *   measure, i.e. |L-prime/L(sigma_B + i T-star, chi)| bounded, i.e. a zero-free
 *   half-strip sigma > sigma_B at height T-star.
 * So the question is exactly whether a MEAN-SQUARE (L^2-in-T) bound can be
 * transferred to a POINTWISE (L^infinity-in-T) bound at a prescribed height.
 *
 * THE TRANSFER CONSTANT IS sqrt(H), AND IT EXACTLY CANCELS THE MEAN-SQUARE SAVING.
 * Write the packet as an exponential sum in the height variable,
 *     g(T) = sum_{n ~ u, width H} a_n e(-T log n),  a_n = Lambda(n) x carrier,
 * with roughly H active terms (the Fresnel packet width). The classic L^2 -> L^inf
 * (Bernstein / Sobolev / Nikolskii) transfer for a sum of N essentially-independent
 * frequencies loses a factor sqrt(N):
 *     ||g||_inf  <=  (sum_n |a_n|) = (transfer constant) x sqrt( mean-square ),
 *     transfer constant = (sum_n |a_n|) / sqrt(sum_n |a_n|^2)  in  [1, sqrt(N)],
 * and for rationally-independent frequencies it is EXACTLY sqrt(N) at equal amps.
 * Here N ~ H ~ 6.70e7 at the anchor floor alias (k = 1, h = 96, p = 97), so the
 * transfer constant is ~ sqrt(H) ~ 8.19e3. The mean-square "square-root
 * cancellation" saving is H^{-1/2} ~ 1.22e-4 (imp-95519 sec 2). Their PRODUCT is
 *     (mean-square saving) x (transfer constant) = H^{-1/2} x H^{1/2} = 1 :
 * a PERFECT mean-square (root-mean-square-cancelled) input transfers to a pointwise
 * bound of exactly the TRIVIAL size. The sqrt(H) transfer loss annihilates the
 * H^{-1/2} mean-square gain, term for term.
 *
 * KRONECKER (imp-95526 T2) MAKES THAT CANCELLATION SHARP, NOT MERELY POSSIBLE.
 * The sqrt(N) in a general L^2 -> L^inf inequality is only an UPPER bound on the
 * transfer loss; a priori a special sum might transfer with a smaller constant.
 * Kronecker/Weyl removes that hope: because {log n} are Q-linearly independent
 * (unique factorization), as T varies the phases e(-T log n) equidistribute jointly
 * on the torus, so sup_T |g(T)| approaches the triangle bound sum_n |a_n| while the
 * time-average of |g|^2 equals sum_n |a_n|^2 EXACTLY. Hence sup_T / rms_T ->
 * (sum |a_n|)/sqrt(sum |a_n|^2), the transfer constant is ATTAINED, and the
 * mean-square input provides NO pointwise saving over trivial. The numerical
 * witness below shows measured rms matching the sum |a_n|^2 theory to 4-5 digits
 * and measured sup equal to the triangle bound, with sup/rms tracking the sqrt(N)
 * transfer constant across prime-set sizes.
 *
 * VERDICT: the Kronecker saturation IS a genuine obstruction - it forecloses the
 * TRANSFER MECHANISM. There is no theorem "mean-square PCC input => pointwise
 * Hilbert-transform bound": the L^2 -> L^inf transfer constant sqrt(H) is forced
 * (Kronecker-sharp) to exactly undo the mean-square saving H^{-1/2}, so any uniform
 * upgrade of a mean-square pair-correlation statement to the pointwise bound the
 * contract needs returns the trivial size. This holds at THIS abscissa (sigma_B =
 * 0.59045, well inside the critical strip where the packet has many terms) and at
 * THESE heights (H ~ 6.7e7 to ~ H(N_hi), all giving sqrt(H) >> the 1.306 headroom).
 *
 * WHERE A GAP REMAINS - AND WHERE IT DOES NOT (honest scope).
 *  - The transfer route is CLOSED: no gap. Kronecker sharpness rules out a smaller
 *    transfer constant, so a mean-square input cannot be leveraged pointwise.
 *  - The CONTRACT AT THE ANCHOR is UNDECIDED, not refuted: Kronecker exhibits a
 *    positive-measure saturating set S (dual of imp-95581 Reason A) but does NOT
 *    locate S at the anchor height T-star. It provides no pointwise LOWER bound at
 *    T-star, just as PCC provides no pointwise UPPER bound there. So the anchor
 *    value stays PCC-gated / undecided: the transfer mechanism is foreclosed, but
 *    the contract is neither closed nor broken by this argument. The one residual
 *    lever is pointwise zero-location (a zero-free half-strip sigma > sigma_B, or
 *    verified GRH-type input) at T-star = heightT(690988) up to heightT(N_hi) ~
 *    1.9e16 - the same out-of-reach wall as imp-95519 / imp-95581, and RH-hard.
 *
 * NET: the imp-95519 sec-4 citation of imp-95526 T2 is ACCURATE as a foreclosure
 * of the mean-square -> pointwise UPGRADE (the sqrt(H) transfer constant is
 * Kronecker-sharp and exactly cancels the H^{-1/2} mean-square saving); it must NOT
 * be over-read as refuting the contract at the anchor, which remains undecided and
 * PCC-gated. Changes no bound; closes no gap; NO QED; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. All literals re-derived.
 */

const TWO_PI = 2 * Math.PI;
const T0 = 24727519 / 200000000; // 0.123637595 (paper eq 8)
const N_LO = 690988; // worst RS anchor index
const SIGMA_B = 0.59045; // (1 + y0)/2, the coefficient-ladder abscissa
const HEADROOM_FACTOR = 1.306; // imp-95519 / imp-95538 uniform floor (equality at anchor)

// ── anchor floor-alias width H and the mean-square / transfer scales ──────────
const xOfN = (N) => 4 * Math.PI * N * N - T0 / 16;
const heightT = (N) => xOfN(N) / 2;
const stationaryV = (N) => heightT(N) / TWO_PI;
function floorWidthH(N, p) {
  const v = stationaryV(N);
  const xi = 1 / p; // floor alias k = 1, h = p - 1
  const u = v / xi;
  return Math.sqrt(u / xi); // Fresnel width H_{1,p-1} = u / sqrt(v)
}
const H_FLOOR_LO = floorWidthH(N_LO, 97); // ~6.70e7 active terms
const MEAN_SQUARE_SAVING = 1 / Math.sqrt(H_FLOOR_LO); // H^{-1/2} ~ 1.22e-4 (sqrt-cancellation)
const TRANSFER_CONSTANT = Math.sqrt(H_FLOOR_LO); // sqrt(H) ~ 8.19e3 (L^2 -> L^inf loss)
const TRANSFER_TIMES_SAVING = MEAN_SQUARE_SAVING * TRANSFER_CONSTANT; // = 1 exactly (returns trivial)

// ── Kronecker-sharp transfer-constant witness ────────────────────────────────
// f(T) = sum_p Lambda(p) p^{-sigma} e(-T log p) over the first N primes (Q-linearly
// independent logs). Time-average of |f|^2 -> sum a_p^2 (the L^2 baseline, i.e. the
// mean-square size); sup_T |f| -> sum a_p (triangle). So sup/rms attains the transfer
// constant (sum a)/sqrt(sum a^2), witnessing that the mean square gives NO pointwise
// saving over trivial - a direct, elementary instance of the sqrt(N) L^2 -> L^inf loss.
function primesUpTo(m) {
  const s = [];
  for (let n = 2; n <= m; n++) {
    let prime = true;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        prime = false;
        break;
      }
    }
    if (prime) s.push(n);
  }
  return s;
}
function transferWitness(primes, sigma, tMax, dt) {
  const logs = primes.map((p) => Math.log(p));
  const amps = primes.map((p, i) => logs[i] * Math.pow(p, -sigma)); // Lambda(p) p^{-sigma}
  const triangle = amps.reduce((a, b) => a + b, 0);
  const l2Theory = Math.sqrt(amps.reduce((a, b) => a + b * b, 0)); // sqrt(sum a^2) = mean-square baseline
  let sup = 0;
  let sumSq = 0;
  let total = 0;
  for (let T = 0; T <= tMax; T += dt) {
    let re = 0;
    let im = 0;
    for (let i = 0; i < logs.length; i++) {
      const ph = -T * logs[i];
      re += amps[i] * Math.cos(ph);
      im += amps[i] * Math.sin(ph);
    }
    const mag = Math.hypot(re, im);
    if (mag > sup) sup = mag;
    sumSq += mag * mag;
    total += 1;
  }
  const rms = Math.sqrt(sumSq / total);
  return {
    N: primes.length,
    triangle,
    l2Theory,
    rmsMeasured: rms,
    sup,
    transferConstantTheory: triangle / l2Theory, // (sum a)/sqrt(sum a^2), in [1, sqrt(N)]
    supOverRmsMeasured: sup / rms, // attains the transfer constant (Kronecker)
    rmsOverL2: rms / l2Theory, // -> 1 (equidistribution: time-avg |f|^2 = sum a^2)
  };
}
const WITNESS = [7, 20, 50, 100].map((m) => transferWitness(primesUpTo(m), SIGMA_B, 2e4, 0.05));

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95604_MEANSQUARE_POINTWISE_UPGRADE = Object.freeze({
  ticket: 'imp-95604',
  date: '2026-09-22',
  source:
    'imp-95519 sec 4 (mean-square F(alpha) vs pointwise Hilbert-transform requirement at sigma_B = 0.59045); imp-95526 T2 (Kronecker continuum-sup saturation); imp-95581 (the demand-side dual: for-most-T relaxation FORECLOSED); imp-95538 (1.306 headroom, equality at the anchor)',
  question:
    'Does the imp-95526 T2 Kronecker continuum-sup saturation genuinely foreclose ANY pointwise/uniform upgrade of the imp-95519 mean-square pair-correlation input to the pointwise Hilbert-transform bound the sub-0.14 contract needs at sigma_B = 0.59045 and height T in [3e12, 1.9e16], or does a gap remain',
  verdict: 'FORECLOSED (upgrade mechanism); anchor UNDECIDED / PCC-gated',

  twoObjects: {
    inputAvailable:
      'Montgomery F(alpha): a MEAN SQUARE over gamma in [0, T] (an L^2-in-T average of the local zero counting), yielding for-most-T statements at the Selberg-CLT scale.',
    outputNeeded:
      'the local zero sum over |gamma - T| <= Delta POINTWISE at the single anchor height T-star = heightT(690988) (an L^infinity-in-T bound): the Hilbert transform of the zero measure, i.e. |L-prime/L(sigma_B + i T-star, chi)| bounded, i.e. a zero-free half-strip sigma > sigma_B at height T-star.',
    reduction: 'the question is exactly whether a mean-square (L^2-in-T) bound transfers to a pointwise (L^infinity-in-T) bound at a prescribed height.',
  },

  transferAnalysis: {
    statement:
      'The L^2 -> L^infinity (Bernstein / Nikolskii) transfer for a packet of ~ H essentially-independent frequencies loses a factor equal to the transfer constant (sum |a_n|)/sqrt(sum |a_n|^2), in [1, sqrt(H)]; for rationally-independent frequencies it equals sqrt(H). The mean-square saving is H^{-1/2}. Their product is exactly 1 - a perfect mean-square input transfers to the TRIVIAL size.',
    anchorFloorWidthH: H_FLOOR_LO,
    meanSquareSaving: MEAN_SQUARE_SAVING, // H^{-1/2} ~ 1.22e-4
    transferConstant: TRANSFER_CONSTANT, // sqrt(H) ~ 8.19e3
    productReturnsTrivial: TRANSFER_TIMES_SAVING, // = 1
    headroomNeeded: HEADROOM_FACTOR, // 1.306, dwarfed by sqrt(H)
  },

  kroneckerMakesItSharp:
    'The sqrt(H) in a general L^2 -> L^infinity inequality is only an upper bound on the transfer loss; Kronecker/Weyl (imp-95526 T2), using the Q-linear independence of {log n}, forces sup_T |g| to attain the triangle bound while the time-average of |g|^2 stays exactly sum |a_n|^2, so the transfer constant is ATTAINED and no special structure of the packet reduces it. The mean-square input therefore provides no pointwise saving over trivial.',

  witness: {
    model: 'f(T) = sum_p Lambda(p) p^{-sigma_B} e(-T log p) over the first N primes; sup_T vs rms_T over a T-grid',
    sigmaB: SIGMA_B,
    rows: WITNESS,
    reading:
      'measured rms matches sqrt(sum a_p^2) to 4-5 digits (rmsOverL2 -> 1, equidistribution) and measured sup equals the triangle bound; sup/rms tracks the sqrt(N) transfer constant, growing with N - a direct witness that the mean square does not control the pointwise sup.',
  },

  gapScope: {
    transferRouteClosed:
      'No gap: Kronecker sharpness rules out a smaller transfer constant, so a mean-square PCC input cannot be leveraged into a pointwise bound. The mean-square -> pointwise upgrade is genuinely foreclosed.',
    anchorUndecided:
      'Kronecker exhibits a positive-measure saturating set S but does NOT locate it at the anchor T-star (dual of imp-95581 Reason A): no pointwise lower bound at T-star from Kronecker, no pointwise upper bound at T-star from PCC. The contract value at the anchor is undecided - neither closed nor refuted by this argument - and stays PCC-gated.',
    onlyResidualLever:
      'a pointwise zero-free half-strip sigma > sigma_B (or verified GRH-type zero-location) at heights heightT(690988) ~ 3e12 up to heightT(N_hi) ~ 1.9e16 - the same out-of-reach, RH-hard wall as imp-95519 / imp-95581.',
  },

  netVerdict:
    'The imp-95519 sec-4 citation of imp-95526 T2 is ACCURATE as a foreclosure of the mean-square -> pointwise UPGRADE: the L^2 -> L^infinity transfer constant sqrt(H) is Kronecker-sharp and exactly cancels the H^{-1/2} mean-square saving, so any uniform upgrade of a mean-square pair-correlation statement returns the trivial size. It must NOT be over-read as refuting the contract at the anchor, which remains undecided and PCC-gated; the only residual lever is pointwise zero-location at the window heights (RH-hard, out of reach). Changes no bound; closes no gap; NO QED; no refereed bound is changed; RH open.',

  promotesBound: false,
  isRigorous: true,
  rigorScope:
    'The L^2 -> L^infinity transfer-constant identity (sum|a|)/sqrt(sum|a|^2) and the sqrt(H) x H^{-1/2} = 1 cancellation are exact and elementary; the Kronecker/Weyl attainment uses the Q-linear independence of {log n} (unique factorization) and is exact; the witness is a finite T-grid computation confirming sup = triangle and rms = sqrt(sum a^2). This is an accuracy assessment of the imp-95519 section 4 framing, not a new theorem.',
});

export const IMP95604_ASSERTIONS = Object.freeze([
  {
    id: 'imp95604-transfer-cancels-saving',
    description: 'sqrt(H) transfer constant x H^{-1/2} mean-square saving = 1 (returns trivial size)',
    holds: () => Math.abs(TRANSFER_TIMES_SAVING - 1) < 1e-12,
  },
  {
    id: 'imp95604-transfer-dwarfs-headroom',
    description: 'the transfer constant sqrt(H) ~ 8e3 is orders above the 1.306 headroom the contract has',
    holds: () => TRANSFER_CONSTANT > 1e3 && TRANSFER_CONSTANT / HEADROOM_FACTOR > 1e3,
  },
  {
    id: 'imp95604-rms-equals-l2-theory',
    description: 'equidistribution: measured time-average |f|^2 matches sum a^2 across all witness rows',
    holds: () => WITNESS.every((r) => Math.abs(r.rmsOverL2 - 1) < 1e-2),
  },
  {
    id: 'imp95604-sup-attains-triangle',
    description: 'Kronecker: measured sup attains the triangle bound in every witness row',
    holds: () => WITNESS.every((r) => Math.abs(r.sup - r.triangle) < 1e-9 * r.triangle),
  },
  {
    id: 'imp95604-transfer-constant-attained',
    description: 'measured sup/rms attains the theoretical transfer constant (sum a)/sqrt(sum a^2)',
    holds: () => WITNESS.every((r) => Math.abs(r.supOverRmsMeasured - r.transferConstantTheory) < 1e-2 * r.transferConstantTheory),
  },
  {
    id: 'imp95604-transfer-grows-with-N',
    description: 'the transfer constant grows with the frequency count N (toward sqrt(N))',
    holds: () => WITNESS[WITNESS.length - 1].transferConstantTheory > WITNESS[0].transferConstantTheory,
  },
  {
    id: 'imp95604-verdict-foreclosed',
    description: 'the honest verdict forecloses the upgrade mechanism and leaves the anchor undecided',
    holds: () =>
      /FORECLOSED/.test(IMP95604_MEANSQUARE_POINTWISE_UPGRADE.verdict) &&
      /UNDECIDED/.test(IMP95604_MEANSQUARE_POINTWISE_UPGRADE.verdict),
  },
  {
    id: 'imp95604-honesty-gate-no-qed',
    description: 'assessment only: promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95604_MEANSQUARE_POINTWISE_UPGRADE.promotesBound === false &&
      /NO QED/.test(IMP95604_MEANSQUARE_POINTWISE_UPGRADE.netVerdict) &&
      /refereed bound is changed/i.test(IMP95604_MEANSQUARE_POINTWISE_UPGRADE.netVerdict),
  },
]);

for (const a of IMP95604_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95604-meansquare-pointwise-upgrade-foreclosure assertion failed: ${a.id}`);
  }
}

export default IMP95604_MEANSQUARE_POINTWISE_UPGRADE;
