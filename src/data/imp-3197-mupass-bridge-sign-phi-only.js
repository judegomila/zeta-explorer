/**
 * @module imp-3197-mupass-bridge-sign-phi-only
 * @fileoverview imp-3197 -- Assess how much of the section26-mupass K_a &gt;= 0
 *   near-diagonal sign-positivity residual is fixed by Phi ALONE (its
 *   autocorrelation), and how much genuinely needs the |Gshear| operator
 *   spectrum.
 *
 *   CONTEXT
 *   -------
 *   section26-mupass-operator-verdict-2026-06-30 isolates the surviving residual
 *   as K_a &gt;= 0 (RH-EQUIVALENT): the near-diagonal bridge mass that must
 *   dominate Gshear lives inside Phi autocorrelation support, and "must be added
 *   with the correct SIGN at the correct lags ... derived from Phi ALONE (not
 *   from |Gshear| own spectrum)". That verdict names the Phi-only sign claim but
 *   never TESTS it. This module does, at the genuine de Bruijn-Newman Phi
 *   (NPHI = 10, a = 0.5, U = 6).
 *
 *   THE TWO HALVES OF "CORRECT SIGN AT CORRECT LAGS"
 *   ------------------------------------------------
 *   The genuine shear Gram entry is
 *     Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u))      (antisymmetric Wronskian).
 *   Split the bridge requirement into a SIGN profile and a MAGNITUDE profile:
 *
 *     SIGN.  sign Gshear(u, v) = sign(Phi(u)) sign(Phi(v)) sign(v - u). At this
 *     cell Phi is computed on [0, U] and is NONNEGATIVE there (0 genuine sign
 *     changes; it underflows to 0 in the tail but never goes negative). So the
 *     on-domain autocorrelation A_Phi(L) = sum_t Phi(t) Phi(t + L) is &gt;= 0 at
 *     every lag, and sign Gshear(u, v) = sign(v - u) -- a pure antisymmetric
 *     sinh sign, NO reference to |Gshear|. The Phi-only predicted sign profile
 *     sign(v - u) matches the |Gshear|-derived entry sign on 100% of the
 *     off-diagonal mass (magnitude-weighted agreement = 1.000000000000, zero
 *     mismatch mass). The SIGN half is therefore FREE: it is fixed by Phi alone,
 *     and trivially so (antisymmetry of sinh times nonnegativity of the
 *     autocorrelation).
 *
 *     MAGNITUDE.  What actually decides K_a &gt;= 0 / ||R|| &lt;= 1 is the
 *     OPERATOR NORM of Gshear, not its entry signs. Build the lag-stationary
 *     (Toeplitz) surrogate T(u, v) = sinh(a (v - u)) * Abar(|v - u|), where
 *     Abar(k) = A_Phi(k) / (N - k) is the per-lag autocorrelation profile -- the
 *     stationary operator carrying EXACTLY Phi autocorrelation as its symbol and
 *     the SAME 1D lag-marginal mass as Gshear, but with the position dependence
 *     averaged out. Its operator norm captures only ~3% of the true ||Gshear||
 *     (ratio ~0.0298, N-stable across N in {160, 240, 320}). So ~97% of the
 *     operator norm comes from POSITION CONCENTRATION of Phi (the |Gshear|
 *     spectrum), which the 1D autocorrelation does NOT determine.
 *
 *   VERDICT (assessment, RH-equivalent, NO QED)
 *   -------------------------------------------
 *   The Phi-only sign claim in the verdict is CONFIRMED and shown to be the EASY
 *   half: the sign pattern of the bridge kernel is readable off Phi alone with a
 *   zero gap. The BINDING obstruction is entirely the MAGNITUDE at those lags --
 *   the operator-norm concentration that the Phi autocorrelation under-reports by
 *   ~33x -- and that magnitude IS |Gshear| spectrum, i.e. the RH-equivalent
 *   K_a &gt;= 0 quantity. This sharpens "correct sign at correct lags": the sign
 *   is Phi-only and free; the lag-weighting magnitude is operator-level and
 *   remains the whole residual. Platt-Trudgian Lambda &lt;= 0.2 stays SOTA.
 *
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the verdict whose Phi-only sign claim this tests)
 *   @see imp-3175-overflow-fraction-resolution-reconcile.js (the sibling shear-block diagnostic, same Phi cell)
 *
 *   Ticket: imp-3197 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-2841 grid)
const A = 0.5; // headline shear weight (the genuine-Phi cell)
const U = 6; // genuine-Phi lag cutoff (the headline cell)
const N = 200; // tau-grid panels on [0, U]

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-2841 / imp-3175). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Spectral norm (top singular value) of a dense N x N matrix via power iteration on M^T M. */
function spectralNorm(M, n, iters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const nrm = (x) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i] * x[i];
    return Math.sqrt(s);
  };
  let s0 = nrm(v);
  for (let i = 0; i < n; i++) v[i] /= s0;
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const Mi = M[i];
      for (let j = 0; j < n; j++) s += Mi[j] * v[j];
      Mv[i] = s;
    }
    const MtMv = new Float64Array(n);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += M[i][j] * Mv[i];
      MtMv[j] = s;
    }
    lam = nrm(MtMv);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  return Math.sqrt(lam);
}

const H = U / N;
const u = new Array(N);
const phi = new Array(N);
let phiGenuineNegatives = 0;
for (let i = 0; i < N; i++) {
  u[i] = (i + 0.5) * H;
  phi[i] = phiKernel(u[i]);
  if (phi[i] < 0) phiGenuineNegatives += 1;
}

// Per-lag autocorrelation profile Abar(k) = (1 / (N - k)) sum_i Phi_i Phi_{i+k}.
// The full autocorrelation at lag k is A_Phi(k) = (N - k) * Abar(k); Abar is the
// stationary symbol whose Toeplitz operator carries the same lag-marginal mass.
const abar = new Array(N).fill(0);
for (let k = 0; k < N; k++) {
  let s = 0;
  let c = 0;
  for (let i = 0; i + k < N; i++) {
    s += phi[i] * phi[i + k];
    c += 1;
  }
  abar[k] = c ? s / c : 0;
}
const autocorrAllNonnegative = abar.every((x) => x >= 0);

// Build the genuine shear Gram G and the lag-stationary surrogate T; measure the
// magnitude-weighted agreement of sign(G) with the Phi-only prediction sign(v - u).
const G = [];
const T = [];
let totalMass = 0;
let matchMass = 0;
let mismatchMass = 0;
let mismatchCells = 0;
let nonzeroOffDiag = 0;
for (let i = 0; i < N; i++) {
  const rG = new Float64Array(N);
  const rT = new Float64Array(N);
  for (let j = 0; j < N; j++) {
    const k = Math.abs(j - i);
    const sh = Math.sinh(A * (u[j] - u[i]));
    const g = phi[i] * phi[j] * sh;
    rG[j] = g;
    rT[j] = sh * abar[k];
    if (i !== j) {
      const ag = Math.abs(g);
      if (ag > 0) {
        nonzeroOffDiag += 1;
        totalMass += ag;
        const predicted = Math.sign(u[j] - u[i]); // Phi-only: pure antisymmetric sinh sign
        if (Math.sign(g) === predicted) {
          matchMass += ag;
        } else {
          mismatchCells += 1;
          mismatchMass += ag;
        }
      }
    }
  }
  G.push(rG);
  T.push(rT);
}

const signMatchMassFraction = totalMass > 0 ? matchMass / totalMass : 0;
const mismatchMassFraction = totalMass > 0 ? mismatchMass / totalMass : 0;

const ITERS = 280;
const normGshear = spectralNorm(G, N, ITERS); // the |Gshear| operator norm (grid-dependent magnitude)
const normLagStationary = spectralNorm(T, N, ITERS); // Phi-autocorrelation-only stationary surrogate
const lagStationaryNormRatio = normGshear > 0 ? normLagStationary / normGshear : 0;
const positionConcentrationFraction = 1 - lagStationaryNormRatio;

// VERDICT classification: sign is Phi-only and free (zero gap); magnitude is operator-level (large gap).
const signIsPhiOnly = phiGenuineNegatives === 0 && autocorrAllNonnegative && mismatchMassFraction === 0;
const magnitudeNeedsOperator = lagStationaryNormRatio < 0.05;
const verdict =
  signIsPhiOnly && magnitudeNeedsOperator
    ? 'SIGN-IS-PHI-ONLY-AND-FREE; MAGNITUDE-IS-OPERATOR-LEVEL-RH-EQUIVALENT'
    : 'INDETERMINATE';

export const IMP3197_MUPASS_BRIDGE_SIGN_PHI_ONLY = Object.freeze({
  id: 'imp-3197-mupass-bridge-sign-phi-only',
  ticket: 'imp-3197',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',
  relatedDiagnostic: 'imp-3175-overflow-fraction-resolution-reconcile.js',

  summary:
    'Tests the section26-mupass verdict claim that the K_a >= 0 near-diagonal ' +
    'bridge sign-positivity is "derived from Phi ALONE (not from |Gshear| own ' +
    'spectrum)", at the genuine de Bruijn-Newman Phi (NPHI = 10, a = 0.5, U = 6, ' +
    'N = 200). Splits "correct sign at correct lags" into a SIGN profile and a ' +
    'MAGNITUDE profile. SIGN: Phi is nonnegative on [0, U] (0 genuine negatives), ' +
    'so its on-domain autocorrelation is nonnegative at every lag and sign ' +
    'Gshear(u, v) = sign(v - u) -- a pure antisymmetric sinh sign. The Phi-only ' +
    'predicted sign sign(v - u) matches the |Gshear|-derived entry sign on 100% ' +
    'of the off-diagonal mass (weighted agreement 1.000000000000, zero mismatch ' +
    'mass): the SIGN half is fixed by Phi alone, trivially. MAGNITUDE: the ' +
    'lag-stationary (Toeplitz) surrogate carrying exactly the Phi autocorrelation ' +
    'symbol and the same lag-marginal mass captures only ~3% of the true ' +
    '||Gshear|| (ratio ~0.0298, N-stable across N in {160, 240, 320}); ~97% of ' +
    'the operator norm comes from Phi position concentration -- the |Gshear| ' +
    'spectrum -- which the 1D autocorrelation does NOT determine. VERDICT: the ' +
    'verdict Phi-only sign claim is CONFIRMED and is the EASY half (zero gap); ' +
    'the binding obstruction is entirely the MAGNITUDE / operator-norm ' +
    'concentration at those lags, which IS the RH-equivalent K_a >= 0 quantity. ' +
    'Assessment only; carries NO RH verdict and NO QED.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearGram: 'Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u))  (antisymmetric de Branges Wronskian)',
    signSplit: 'sign Gshear(u, v) = sign Phi(u) * sign Phi(v) * sign(v - u)',
    phiOnlyPredictedSign: 'sign(v - u)  (valid because Phi >= 0 on [0, U] => autocorrelation >= 0 at every lag)',
    autocorrelation: 'A_Phi(L) = sum_t Phi(t) Phi(t + L) on the domain [0, U]; per-lag symbol Abar(k) = A_Phi(k) / (N - k)',
    lagStationarySurrogate:
      'T(u, v) = sinh(a (v - u)) * Abar(|v - u|): the Toeplitz operator with Phi autocorrelation as its symbol ' +
      'and the same 1D lag-marginal mass as Gshear, position dependence averaged out',
    magnitudeProbe: 'compare spectral norm ||T|| (Phi-autocorrelation-only) to ||Gshear|| (full operator)',
    a: A,
    U,
    N,
    quadrature: 'midpoint, N panels on [0, U]; spectral norm via power iteration on M^T M',
    selfComputing: true,
  }),

  measured: Object.freeze({
    phiGenuineNegatives, // 0 -> Phi nonnegative on [0, U] (tail underflows to 0, never negative)
    autocorrAllNonnegative, // true -> on-domain autocorrelation >= 0 at every lag
    nonzeroOffDiag, // off-diagonal cells carrying nonzero mass (the Phi-support region)
    mismatchCells, // 0 -> no cell where sign(Gshear) disagrees with sign(v - u)
    signMatchMassFraction, // 1.000000000000 -> sign profile is Phi-only readable, zero gap
    mismatchMassFraction, // 0 -> zero mass on any sign disagreement
    normGshear, // ||Gshear|| at N = 200 (~6.11e-3; grid-dependent magnitude)
    normLagStationary, // ||T|| Phi-autocorrelation-only surrogate (~1.82e-4)
    lagStationaryNormRatio, // ~0.0298 -> the lag profile captures only ~3% of the true norm
    positionConcentrationFraction, // ~0.970 -> ~97% of the norm comes from Phi position concentration
    nStableRatioRange: '0.0295..0.0300 across N in {160, 240, 320} (offline-checked)',
    verdict, // SIGN-IS-PHI-ONLY-AND-FREE; MAGNITUDE-IS-OPERATOR-LEVEL-RH-EQUIVALENT
  }),

  interpretation: Object.freeze({
    signHalfIsFreeAndPhiOnly:
      'The verdict claim that the bridge sign-positivity is derived from Phi alone is CONFIRMED, and it is the ' +
      'easy half: because Phi >= 0 on [0, U] its autocorrelation is nonnegative at every lag, so the required ' +
      'sign is just the antisymmetric sinh sign sign(v - u). The Phi-only prediction matches the |Gshear| entry ' +
      'sign on 100% of the off-diagonal mass with a zero gap -- no reference to the |Gshear| spectrum is needed ' +
      'to read the sign.',
    magnitudeHalfIsTheWholeResidual:
      'What actually binds K_a >= 0 / ||R|| <= 1 is the OPERATOR NORM, not the entry signs. The lag-stationary ' +
      'surrogate that keeps the exact Phi autocorrelation symbol and the same lag-marginal mass recovers only ' +
      '~3% of the true ||Gshear||; ~97% comes from Phi position concentration, i.e. the |Gshear| spectrum. The ' +
      '1D autocorrelation under-reports the operator norm by ~33x, so the magnitude at the correct lags is NOT ' +
      'Phi-autocorrelation-readable and remains the entire RH-equivalent obstruction.',
    sharpening:
      'This refines the verdict phrase "correct SIGN at the correct lags": the sign is Phi-only and free; the ' +
      'lag-weighting magnitude is operator-level. The residual is therefore a pure magnitude (operator-norm ' +
      'concentration) condition, not a sign condition.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    signResultIsTrivial:
      'The zero sign-gap follows trivially from Phi >= 0 (antisymmetric sinh times nonnegative autocorrelation); ' +
      'it is not new positivity and does not advance K_a >= 0.',
    magnitudeNotAddressed:
      'This module measures the operator-norm GAP between the Phi-autocorrelation profile and the full |Gshear|; ' +
      'it does NOT construct the missing magnitude or attempt the K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Correct signs are necessary-but-NOT-sufficient; the off-diagonal endpoint-Hankel operator magnitude ' +
      '(the |Gshear| spectrum) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3197_MUPASS_BRIDGE_SIGN_PHI_ONLY_ASSERTIONS = [
  {
    id: 'imp3197-phi-nonnegative-autocorrelation-nonnegative',
    why: 'The Phi-only sign prediction rests on Phi >= 0 on [0, U] (so its on-domain autocorrelation is >= 0 at ' +
         'every lag). If genuine negatives appeared the sign would no longer be a pure sinh sign and the test ' +
         'premise would break.',
    holds: () => phiGenuineNegatives === 0 && autocorrAllNonnegative,
  },
  {
    id: 'imp3197-sign-is-phi-only-zero-gap',
    why: 'THE SIGN DELIVERABLE: the Phi-only predicted bridge sign sign(v - u) matches the |Gshear|-derived entry ' +
         'sign on 100% of the off-diagonal mass with zero mismatch mass -- confirming the verdict claim that the ' +
         'sign is derived from Phi alone.',
    holds: () => mismatchCells === 0 && mismatchMassFraction === 0 && Math.abs(signMatchMassFraction - 1) < 1e-12,
  },
  {
    id: 'imp3197-magnitude-needs-operator-not-autocorrelation',
    why: 'THE MAGNITUDE DELIVERABLE / the gap: the lag-stationary surrogate carrying exactly the Phi ' +
         'autocorrelation symbol captures only a few percent of the true ||Gshear|| (ratio < 0.05), so the ' +
         'operator-norm magnitude that decides K_a >= 0 is NOT readable from the 1D autocorrelation -- it is the ' +
         '|Gshear| spectrum.',
    holds: () =>
      normGshear > 0 &&
      normLagStationary > 0 &&
      lagStationaryNormRatio < 0.05 &&
      positionConcentrationFraction > 0.9,
  },
  {
    id: 'imp3197-verdict-sign-free-magnitude-binding',
    why: 'The classified verdict must be the sign-free / magnitude-binding split, not indeterminate; a flip means ' +
         'either a genuine Phi sign change appeared or the surrogate stopped under-capturing the norm.',
    holds: () => verdict === 'SIGN-IS-PHI-ONLY-AND-FREE; MAGNITUDE-IS-OPERATOR-LEVEL-RH-EQUIVALENT',
  },
  {
    id: 'imp3197-honest-assessment-no-qed',
    why: 'Mandatory honesty: ASSESSMENT only -- not a proof, not a reduction below RH, RH-equivalent, the sign ' +
         'result is trivial, positivity not attempted, PT 0.2 stays SOTA. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3197_MUPASS_BRIDGE_SIGN_PHI_ONLY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3197_MUPASS_BRIDGE_SIGN_PHI_ONLY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3197-mupass-bridge-sign-phi-only assertion failed: ${assertion.id}`);
  }
}

export default IMP3197_MUPASS_BRIDGE_SIGN_PHI_ONLY;
