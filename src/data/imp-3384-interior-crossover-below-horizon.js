/**
 * @module imp-3384-interior-crossover-below-horizon
 * @fileoverview imp-3384 -- Assess whether any genuine nu/mu crossover exists
 *   INTERIOR to the imp-3322 arithmetic truncation horizon, i.e. whether the
 *   section-26 overflow region {tau : nu(tau) &gt; mu(tau)} has a genuine
 *   mathematical UPPER boundary strictly below the imp-3309 underflow horizons,
 *   or is entirely horizon-bounded.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. No refereed bound is changed.
 *
 *   THE QUESTION (verbatim from the ticket)
 *   ---------------------------------------
 *   imp-3322 showed the overflow-support upper endpoint tau_2 ~ 1.366 is the
 *   IEEE-754 kernel underflow horizon (it moves inward as the truncation threshold
 *   T rises), so the imp-3224 spread-contraction is NON-DISCRIMINATING for a genuine
 *   Phi-autocorrelation length. The complementary question is left open: setting the
 *   truncation aside, is there ANY genuine nu &gt; mu -&gt; nu &lt; mu crossover
 *   INTERIOR to the horizon? ASSESS by evaluating the genuine densities on the base
 *   cell and locating every sign change of (nu - mu) strictly BELOW the imp-3309
 *   horizons tau_mu ~ 1.199 / tau_nu ~ 1.370; report whether the overflow region has
 *   an interior mathematical boundary or is entirely horizon-bounded.
 *
 *   THE GENUINE DENSITIES (identical to imp-3322 / imp-3309 / imp-3216 / imp-3199)
 *   -----------------------------------------------------------------------------
 *     nu(tau) = int_0^tau du int_tau^U dv  Phi(u) Phi(v) sinh(a(v-u))
 *     mu(tau) = (1 / 2pi) int_tau^U Phi(u)^2 sinh(2 a u) du
 *
 *   WHAT THIS MODULE FINDS (base cell a=0.5, U=6, NPHI=10; N-ladder 6400..51200)
 *   ---------------------------------------------------------------------------
 *   (F1) EXACTLY ONE SIGN CHANGE below the mu horizon. Sweeping the panel sequence
 *        of (nu - mu) from tau = 0 up to tau_mu ~ 1.199 (the region where mu is still
 *        genuinely positive, before its Phi^2 tail underflows), there is exactly ONE
 *        sign change of (nu - mu), at tau_1 ~ 0.111, and it runs mu &gt; nu -&gt;
 *        nu &gt; mu (the genuine lower crossover, imp-3216 / imp-3307). The count is
 *        1 at every N in the ladder -- there is NO second (upper) crossover interior
 *        to the horizon.
 *   (F2) THE GAP WIDENS toward the horizon -- it never re-closes. Once nu overtakes
 *        mu at tau_1 the ratio nu/mu does not merely stay above 1, it GROWS
 *        explosively: min(nu/mu) ~ 2.08 just above tau_1, rising past ~1e150 as tau
 *        approaches tau_mu. So nu never falls back toward mu; the overflow region has
 *        no interior mathematical upper boundary where nu would re-cross below mu.
 *   (F3) THE MECHANISM IS THE TAIL-EXPONENT RATIO (imp-3309). nu carries a single-Phi
 *        tail ~ exp(-pi X) and mu a Phi^2 tail ~ exp(-2 pi X) (X = e^{4u}), so
 *        nu/mu ~ exp(pi X) diverges monotonically in tau. The region therefore ends
 *        ONLY when mu underflows to 0.0 (tau_mu ~ 1.199) and then nu underflows
 *        (tau_nu ~ 1.370) -- both arithmetic events, exactly the imp-3309 two-tail
 *        horizons. The upper endpoint is arithmetic, not a genuine crossover.
 *
 *   VERDICT
 *   -------
 *   The overflow region {tau : nu &gt; mu} is ENTIRELY HORIZON-BOUNDED above. Its
 *   ONLY genuine endpoint is the lower crossover tau_1 ~ 0.111; there is NO genuine
 *   nu &gt; mu -&gt; nu &lt; mu re-crossover interior to the imp-3309 underflow
 *   horizons. Because nu/mu ~ exp(pi X) diverges toward the horizon, the region can
 *   only close by arithmetic underflow (mu first at ~1.199, nu at ~1.370), never by a
 *   mathematical crossover. This CONFIRMS and SHARPENS imp-3322 / imp-3309: not only
 *   is the measured upper endpoint the underflow horizon, but no interior
 *   mathematical boundary exists to be masked by it -- so the geometry is
 *   [tau_1 (genuine), horizon (arithmetic)] with no third feature between them.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi. Overflow-support geometry only; the absolute
 *   deg-2 deficit MAGNITUDE is not re-derived. A nonzero overflow measure is
 *   necessary-but-NOT-sufficient at operator order; the off-diagonal endpoint-Hankel
 *   operator step (imp-3066) remains the lone obstruction. RH-equivalent. No RH
 *   verdict, no false QED. No refereed bound is changed.
 *
 *   @see imp-3322-spread-contraction-discriminator.js (the upper endpoint is the underflow horizon)
 *   @see imp-3309-two-tail-underflow-horizons.js (the two-tail closed-form horizons tau_mu / tau_nu)
 *   @see imp-3216-overflow-support-length-closed-form.js (the genuine lower endpoint tau_1)
 *   @see imp-3307-tau1-phi-moment-balance.js (the lower-endpoint transcendental balance)
 *
 *   Ticket: imp-3384 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ln(1 / smallest positive subnormal double) = ln(2^1074) ~ 744.44 (imp-3309).
const L_SUBNORMAL = -Math.log(Number.MIN_VALUE);

// Base cell (the imp-3199 / imp-3224 / imp-3322 base cell).
const BASE_CELL = Object.freeze({ a: 0.5, U: 6, NPHI: 10 });

// N-ladder: the crossover-count finding must be N-stable (grid-independent).
const N_LADDER = Object.freeze([6400, 12800, 25600, 51200]);
const FINEST_N = 51200;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (as imp-3322). */
function phiKernel(u, NPHI) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/**
 * O(N) factorized genuine densities nu(tau_k), mu(tau_k) via the sinh addition law
 * (identical to imp-3322 with threshold = 0, i.e. native double precision -- the
 * truncation is deliberately set aside per the ticket).
 */
function densitiesFactor(N, a, U, NPHI) {
  const H = U / N;
  const phi = new Array(N);
  const ch = new Array(N);
  const sh = new Array(N);
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) * H;
    phi[i] = phiKernel(u, NPHI);
    ch[i] = Math.cosh(a * u);
    sh[i] = Math.sinh(a * u);
  }
  const pastCosh = new Array(N);
  const pastSinh = new Array(N);
  let ac = 0;
  let asum = 0;
  for (let k = 0; k < N; k++) {
    ac += phi[k] * ch[k];
    asum += phi[k] * sh[k];
    pastCosh[k] = ac;
    pastSinh[k] = asum;
  }
  const futSinh = new Array(N);
  const futCosh = new Array(N);
  const muSuffix = new Array(N);
  let fs = 0;
  let fc = 0;
  let ms = 0;
  for (let k = N - 1; k >= 0; k--) {
    futSinh[k] = fs; // sum over j > k (set BEFORE folding in k)
    futCosh[k] = fc;
    fs += phi[k] * sh[k];
    fc += phi[k] * ch[k];
    ms += phi[k] * phi[k] * Math.sinh(2 * a * (k + 0.5) * H);
    muSuffix[k] = ms; // sum over j >= k
  }
  const nu = new Array(N);
  const mu = new Array(N);
  for (let k = 0; k < N; k++) {
    nu[k] = H * H * (futSinh[k] * pastCosh[k] - futCosh[k] * pastSinh[k]);
    mu[k] = (H / (2 * Math.PI)) * muSuffix[k];
  }
  return { nu, mu, H };
}

/** Closed-form single-Phi (nu) underflow horizon: pi X - ln(2 pi^2 X) = L (imp-3309). */
function nuHorizonTau() {
  let X = 200;
  for (let i = 0; i < 300; i++) X = (L_SUBNORMAL + Math.log(2 * Math.PI * Math.PI * X)) / Math.PI;
  return 0.25 * Math.log(X);
}
/** Closed-form Phi^2 (mu) underflow horizon: 2 pi X - ln(4 pi^4 X^2) = L (imp-3309). */
function muHorizonTau() {
  const c = 4 * Math.pow(Math.PI, 4);
  let X = 100;
  for (let i = 0; i < 300; i++) X = (L_SUBNORMAL + Math.log(c * X * X)) / (2 * Math.PI);
  return 0.25 * Math.log(X);
}

const TAU_MU = muHorizonTau(); // ~1.19886, mu underflows here (Phi^2 tail)
const TAU_NU = nuHorizonTau(); // ~1.36980, nu underflows here (single-Phi tail)

/**
 * Locate every sign change of (nu - mu) strictly BELOW the mu horizon (the region
 * where mu is genuinely positive, so a sign change is a genuine mathematical
 * crossover and not an underflow artifact). Returns the crossover list and the count
 * of panels where nu &lt;= mu strictly ABOVE the lower crossover (a re-crossover
 * counter: 0 means the region never re-closes below the horizon).
 */
function crossoverScanBelowMuHorizon(N, cell) {
  const { nu, mu, H } = densitiesFactor(N, cell.a, cell.U, cell.NPHI);
  const crossovers = [];
  let prevSign = 0;
  let firstOverflowTau = NaN;
  let recrossPanels = 0; // panels with nu <= mu AFTER the first overflow, below tau_mu
  let sawOverflow = false;
  for (let k = 0; k < N; k++) {
    const tau = (k + 0.5) * H;
    if (tau >= TAU_MU) break; // stay strictly below the mu underflow horizon
    const d = nu[k] - mu[k];
    const s = Math.sign(d);
    if (s !== 0 && prevSign !== 0 && s !== prevSign) {
      crossovers.push(Object.freeze({ tau, from: prevSign, to: s }));
    }
    if (s !== 0) prevSign = s;
    if (nu[k] > mu[k]) {
      if (!sawOverflow) {
        firstOverflowTau = tau;
        sawOverflow = true;
      }
    } else if (sawOverflow) {
      recrossPanels += 1; // nu fell back to/below mu after having overtaken it
    }
  }
  return Object.freeze({ crossovers: Object.freeze(crossovers), firstOverflowTau, recrossPanels });
}

/**
 * Ratio diagnostic at the finest N: min(nu/mu) over the interior overflow region
 * (just above the lower crossover, well below the mu horizon) and the ratio at a
 * near-horizon probe -- to show the gap WIDENS rather than re-closing.
 */
function ratioDiagnostic(N, cell) {
  const { nu, mu, H } = densitiesFactor(N, cell.a, cell.U, cell.NPHI);
  const loTau = 0.15; // just above tau_1 ~ 0.111
  const hiTau = TAU_MU - 0.02; // just below the mu horizon
  let minRatio = Infinity;
  let minRatioTau = NaN;
  let ratioNearHorizon = NaN;
  let ratioNearHorizonTau = NaN;
  for (let k = 0; k < N; k++) {
    const tau = (k + 0.5) * H;
    if (tau < loTau || tau > hiTau) continue;
    if (mu[k] > 0) {
      const r = nu[k] / mu[k];
      if (r < minRatio) {
        minRatio = r;
        minRatioTau = tau;
      }
      ratioNearHorizon = r; // last one inside the window = closest to the horizon
      ratioNearHorizonTau = tau;
    }
  }
  return Object.freeze({ minRatio, minRatioTau, ratioNearHorizon, ratioNearHorizonTau });
}

// -- F1: crossover count is 1 at every N, and the single crossover is the lower one --
const LADDER = Object.freeze(
  N_LADDER.map((N) => {
    const scan = crossoverScanBelowMuHorizon(N, BASE_CELL);
    return Object.freeze({
      N,
      crossoverCount: scan.crossovers.length,
      crossovers: scan.crossovers,
      firstOverflowTau: scan.firstOverflowTau,
      recrossPanels: scan.recrossPanels,
    });
  }),
);
const finestRow = LADDER[LADDER.length - 1];
const crossoverCountIsOneAtEveryN = LADDER.every((r) => r.crossoverCount === 1);
const singleCrossoverIsLowerEndpoint =
  finestRow.crossoverCount === 1 &&
  finestRow.crossovers[0].from < 0 && // mu > nu below tau_1
  finestRow.crossovers[0].to > 0 && // nu > mu above tau_1
  finestRow.crossovers[0].tau > 0.10 &&
  finestRow.crossovers[0].tau < 0.12;
// No re-crossover: nu never falls back to/below mu between tau_1 and the mu horizon.
const noInteriorRecrossover = LADDER.every((r) => r.recrossPanels === 0);

// -- F2 / F3: the gap widens toward the horizon (ratio diverges) --------------
const RATIO = ratioDiagnostic(FINEST_N, BASE_CELL);
const interiorRatioAlwaysAboveOne = RATIO.minRatio > 1;
const ratioDivergesTowardHorizon = RATIO.ratioNearHorizon / RATIO.minRatio > 1e40;

const verdict =
  crossoverCountIsOneAtEveryN &&
  singleCrossoverIsLowerEndpoint &&
  noInteriorRecrossover &&
  interiorRatioAlwaysAboveOne &&
  ratioDivergesTowardHorizon
    ? 'OVERFLOW-REGION-IS-ENTIRELY-HORIZON-BOUNDED; NO-INTERIOR-nu/mu-RE-CROSSOVER-BELOW-THE-imp-3309-HORIZONS; ONLY-GENUINE-ENDPOINT-IS-tau_1~0.111 (nu/mu~exp(pi X)-DIVERGES), CONFIRMS-imp-3322/imp-3309'
    : 'INDETERMINATE';

export const IMP3384_INTERIOR_CROSSOVER_BELOW_HORIZON = Object.freeze({
  id: 'imp-3384-interior-crossover-below-horizon',
  ticket: 'imp-3384',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedHorizonDiscriminator: 'imp-3322-spread-contraction-discriminator.js',
  relatedTwoTailHorizons: 'imp-3309-two-tail-underflow-horizons.js',
  relatedLowerEndpoint: 'imp-3216-overflow-support-length-closed-form.js',

  summary:
    'Answers the complementary question imp-3322 left open: setting the arithmetic truncation aside, is there ' +
    'ANY genuine nu > mu -> nu < mu crossover INTERIOR to the imp-3309 underflow horizons (tau_mu ~ 1.199, ' +
    'tau_nu ~ 1.370)? Evaluating the genuine densities on the base cell (a=0.5, U=6, NPHI=10) over an N-ladder ' +
    '6400..51200 and scanning every sign change of (nu - mu) strictly below the mu horizon: (F1) there is ' +
    'EXACTLY ONE sign change at every N, at tau_1 ~ 0.111, running mu > nu -> nu > mu (the genuine lower ' +
    'crossover) -- NO second/upper crossover exists interior to the horizon; (F2) after tau_1 the gap WIDENS -- ' +
    'min(nu/mu) ~ 2.08 just above tau_1 rising past ~1e150 near tau_mu -- so nu never falls back toward mu; ' +
    '(F3) the mechanism is the tail-exponent ratio, nu ~ exp(-pi X) vs mu ~ exp(-2 pi X) so nu/mu ~ exp(pi X) ' +
    'diverges, and the region can only close by mu then nu underflowing (the imp-3309 two-tail horizons). ' +
    'VERDICT: the overflow region is ENTIRELY HORIZON-BOUNDED above; its only genuine endpoint is tau_1, and no ' +
    'interior mathematical upper boundary exists -- confirming and sharpening imp-3322/imp-3309. DIAGNOSTIC; ' +
    'overflow-support only; carries NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearDensity: 'nu(tau) = int_0^tau du int_tau^U dv Phi(u) Phi(v) sinh(a(v-u))',
    passiveDensity: 'mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du',
    truncationSetAside: 'native double precision (no threshold floor); the ticket asks the genuine-crossover question independent of truncation',
    muHorizon: 'tau_mu = (1/4) ln X_mu, 2 pi X_mu - ln(4 pi^4 X_mu^2) = ln(2^1074) (imp-3309)',
    nuHorizon: 'tau_nu = (1/4) ln X_nu, pi X_nu - ln(2 pi^2 X_nu) = ln(2^1074) (imp-3309)',
    scanWindow: 'sign changes of (nu - mu) for tau strictly below tau_mu (mu genuinely positive there)',
    baseCell: BASE_CELL,
    nLadder: N_LADDER,
    quadrature: 'midpoint, N panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    lnInvMinSubnormal: L_SUBNORMAL,
    tauMuHorizon: TAU_MU,
    tauNuHorizon: TAU_NU,
    ladder: LADDER, // per N: crossoverCount, crossovers, firstOverflowTau, recrossPanels
    finestRow,
    crossoverCountIsOneAtEveryN, // F1: exactly one sign change below tau_mu at every N
    singleCrossoverIsLowerEndpoint, // F1: that one crossover is tau_1 ~ 0.111, mu>nu -> nu>mu
    noInteriorRecrossover, // F1: nu never re-crosses below mu before the horizon
    ratio: RATIO, // F2: min(nu/mu) and near-horizon nu/mu at the finest N
    interiorRatioAlwaysAboveOne, // F2: nu > mu with margin throughout the interior
    ratioDivergesTowardHorizon, // F2/F3: the gap widens toward the horizon (does not re-close)
    verdict,
  }),

  interpretation: Object.freeze({
    onlyOneCrossoverAndItIsTheLowerEndpoint:
      'Below the mu underflow horizon (where mu is still genuinely positive) the difference nu - mu changes sign ' +
      'exactly once, at tau_1 ~ 0.111, from mu > nu to nu > mu. This is the imp-3216 / imp-3307 genuine lower ' +
      'crossover. There is no second sign change interior to the horizon, so the overflow region has no genuine ' +
      'mathematical UPPER boundary -- the count is a robust 1 at every N in the ladder.',
    theGapWidensItDoesNotReClose:
      'Once nu overtakes mu at tau_1 the ratio nu/mu does not hover near 1 (which would signal an imminent ' +
      're-crossover); it grows from ~2.08 just above tau_1 to well past ~1e150 as tau approaches tau_mu. nu ' +
      'moves ever further above mu, so no re-crossover can occur before the arithmetic underflow ends the region.',
    mechanismIsTheTailExponentRatio:
      'nu carries a single-Phi tail ~ exp(-pi X) and mu a Phi^2 tail ~ exp(-2 pi X) with X = e^{4u}, so ' +
      'nu/mu ~ exp(pi X) diverges monotonically in tau. The region can only terminate when mu underflows to 0.0 ' +
      '(tau_mu ~ 1.199) and then nu underflows (tau_nu ~ 1.370) -- exactly the imp-3309 two-tail horizons. The ' +
      'upper endpoint is arithmetic; there is nothing genuine hiding beneath it.',
    sharpensImp3322AndImp3309:
      'imp-3322 showed the measured upper endpoint IS the underflow horizon; imp-3309 gave its closed form. This ' +
      'module adds the positive complement: no interior mathematical boundary exists to be masked by that horizon, ' +
      'so the overflow geometry is exactly [tau_1 (genuine), horizon (arithmetic)] with no third feature between.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    answersTheImp3322OpenComplement:
      'imp-3322 explicitly left open whether a genuine nu/mu crossover exists interior to the truncation horizon. ' +
      'This module runs that scan at the genuine Phi and finds the region is entirely horizon-bounded above -- the ' +
      'only genuine crossover is the lower endpoint tau_1 ~ 0.111.',
    addressesOverflowSupportGeometryOnly:
      'Overflow-support geometry only. The absolute deg-2 deficit MAGNITUDE (carrying the offline normalization ' +
      'convention) is NOT re-derived here.',
    necessaryNotSufficient:
      'A nonzero overflow measure is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3384_INTERIOR_CROSSOVER_BELOW_HORIZON_ASSERTIONS = [
  {
    id: 'imp3384-horizons-match-imp3309',
    why: 'The mu / nu underflow horizons used to window the scan must reproduce the imp-3309 closed forms ' +
         '(tau_mu ~ 1.199, tau_nu ~ 1.370); a drift means the scan window no longer sits below the right horizon.',
    holds: () =>
      Math.abs(TAU_MU - 1.19886) < 2e-3 && Math.abs(TAU_NU - 1.36980) < 2e-3 && TAU_MU < TAU_NU,
  },
  {
    id: 'imp3384-exactly-one-crossover-below-mu-horizon',
    why: 'THE DELIVERABLE (F1): scanning (nu - mu) strictly below the mu underflow horizon there must be EXACTLY ' +
         'ONE sign change at every N in the ladder -- so the overflow region has no genuine mathematical UPPER ' +
         'boundary interior to the horizon.',
    holds: () => crossoverCountIsOneAtEveryN,
  },
  {
    id: 'imp3384-single-crossover-is-the-lower-endpoint',
    why: 'THE DELIVERABLE (F1): that lone sign change must be the genuine lower crossover tau_1 ~ 0.111, running ' +
         'mu > nu -> nu > mu -- confirming it is the imp-3216/imp-3307 lower endpoint, not a spurious feature.',
    holds: () => singleCrossoverIsLowerEndpoint,
  },
  {
    id: 'imp3384-no-interior-recrossover',
    why: 'THE DELIVERABLE (F1): between tau_1 and the mu horizon nu must NEVER fall back to/below mu (zero ' +
         're-crossover panels at every N) -- so the region is entirely horizon-bounded above.',
    holds: () => noInteriorRecrossover,
  },
  {
    id: 'imp3384-gap-widens-toward-horizon',
    why: 'THE DELIVERABLE (F2/F3): the interior ratio nu/mu must stay above 1 AND diverge toward the horizon ' +
         '(nu/mu ~ exp(pi X)), so nu moves ever further above mu and no re-crossover can occur before underflow.',
    holds: () => interiorRatioAlwaysAboveOne && ratioDivergesTowardHorizon,
  },
  {
    id: 'imp3384-verdict-is-entirely-horizon-bounded',
    why: 'The classified verdict must be the ENTIRELY-HORIZON-BOUNDED / no-interior-re-crossover reconciliation, ' +
         'not indeterminate; a flip means one of the crossover-count / lower-endpoint / ratio sub-tests broke.',
    holds: () =>
      verdict ===
      'OVERFLOW-REGION-IS-ENTIRELY-HORIZON-BOUNDED; NO-INTERIOR-nu/mu-RE-CROSSOVER-BELOW-THE-imp-3309-HORIZONS; ONLY-GENUINE-ENDPOINT-IS-tau_1~0.111 (nu/mu~exp(pi X)-DIVERGES), CONFIRMS-imp-3322/imp-3309',
  },
  {
    id: 'imp3384-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC at the genuine Phi, overflow-support-only (not the absolute deficit ' +
         'magnitude), necessary-but-not-sufficient at operator order, positivity not attempted, no refereed bound is changed.',
    holds: () => {
      const c = IMP3384_INTERIOR_CROSSOVER_BELOW_HORIZON.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3384_INTERIOR_CROSSOVER_BELOW_HORIZON_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3384-interior-crossover-below-horizon assertion failed: ${assertion.id}`);
  }
}

export default IMP3384_INTERIOR_CROSSOVER_BELOW_HORIZON;
