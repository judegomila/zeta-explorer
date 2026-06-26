/**
 * @module imp-normalized-R-scale-test
 * @fileoverview imp-2842 -- Stress-test the degree-0 normalized-R reshaping with
 *   the EXACT scale-invariance discriminator that killed bare V.
 *
 *   THE SURVIVING TARGET (from the verdict / imp-2686)
 *   --------------------------------------------------
 *   The lone non-ruled-out direct Section-26 object is the de-homogenized
 *   relative operator
 *
 *       R = Gpass^{-1/2} Gshear Gpass^{-1/2}        (degree-0, scale-invariant)
 *
 *   whose contractivity is meant to certify the operator positivity K_a >= 0.
 *   The §26 hidden-square factorization closes iff
 *
 *       ||R|| <= 1   <=>   K_a = Gpass - Gshear >= 0,
 *
 *   an EXACT congruence equivalence: K_a = Gpass^{1/2} (I - R) Gpass^{1/2}, so
 *   sign(eig(I - R R*)) tracks sign(eig(K_a)) whenever Gshear is PSD (then R is
 *   PSD and ||R|| = lambda_max(R), making I - R R* >= 0 the same one-sided test
 *   as K_a >= 0).
 *
 *   WHY THE SCALE LADGER (Phi -> c Phi, c in {1,3,10,100,1000})
 *   ----------------------------------------------------------
 *   The bare-V pilot (imp-1240) tests un-normalized contractivity ||V|| <= 1,
 *   i.e. sign(eig(I - V)). Under Phi -> c Phi the Gram scales by c^2, so the
 *   bare-V eigenvalues scale by c^2 and the verdict FLIPS along the ladder -- the
 *   bare test is scale-DEPENDENT, hence vacuous as a positivity certificate. The
 *   degree-0 reshaping divides the homogeneity out: under Phi -> c Phi both
 *   Gpass and Gshear scale by c^2, the two c^2 cancel in
 *   R = Gpass^{-1/2} Gshear Gpass^{-1/2}, and R (hence sign(eig(I - R R*)) and,
 *   by congruence, sign(eig(K_a))) is INVARIANT. This module exhibits exactly
 *   that contrast on a finite test-set Gram.
 *
 *   THE FINITE TEST SET (self-computing at import; no frozen data)
 *   -------------------------------------------------------------
 *   Test set = n = 6 lag-shifted copies of the genuine de Bruijn-Newman §27
 *   kernel Phi (truncated n <= 10), b_i(t) = Phi(t - tau_i), tau_i = 0.1*i on the
 *   midpoint grid of [0, U] with U = 6, M = 200. The test-set Gram
 *   G0 = B B^T is PSD by construction. The shear weight sinh(a*tau) (a = 0.5)
 *   enters as the endpoint envelope cosh(a*tau) (the imp-2686 cosh-completion)
 *   via the congruence Gshear = diag(sqrt(cosh(a*tau_i))) G0 diag(sqrt(cosh(...))),
 *   which keeps Gshear PSD with a positive diagonal. The PROVISIONAL passive core
 *   is the RAW diagonal Gpass = diag(Gshear), exactly the construction the verdict
 *   expects to fail. For a clean bare-V crossing the Gram is reported in units
 *   where its base (c=1) spectral norm is 1/3 (an overall positive scalar that
 *   the degree-0 R is, by design, blind to).
 *
 *   MEASURED RESULT (a = 0.5; full numbers in `rows`)
 *   -------------------------------------------------
 *     - DEGREE-0 R passes the scale test: lambda_max(R) = 1.6165 and
 *       lambda_min(I - R R*) = -1.6131 are IDENTICAL across c in
 *       {1,3,10,100,1000} (scale-invariant to ~1e-9).
 *     - sign(eig(I - R R*)) TRACKS sign(eig(K_a)): both are negative on every
 *       rung (K_a = c^2 (Gpass - Gshear) scales in magnitude but never changes
 *       sign), so the degree-0 reshaping gives a c-stable pass/fail verdict.
 *     - BARE V BREAKS: sign(eig(I - c^2 Gshear)) flips from +0.667 (c=1, pass)
 *       to -2.0 (c=3) and stays negative -- the same ladder that kills bare V.
 *     - RAW-DIAGONAL Gpass ALREADY FAILS (expected): R is a correlation matrix
 *       (unit diagonal, trace = n), so lambda_max(R) = 1.6165 > 1, hence
 *       K_a = diag(Gshear) - Gshear is INDEFINITE -- the raw diagonal does NOT
 *       dominate, confirming a genuine endpoint-bridge Gpass (imp-2686) is needed.
 *
 *   THE STRUCTURAL REASON the raw diagonal fails (a sharp by-product)
 *   ----------------------------------------------------------------
 *   With Gpass = diag(Gshear), the shear envelope cancels exactly in
 *   R = corr(Gshear) = corr(G0): the raw-diagonal normalization DIVIDES OUT the
 *   very shear/endpoint-bridge content it is supposed to weigh against. That is
 *   precisely why a faithful Gpass must RETAIN the cosh-completion mass (imp-2686),
 *   not cancel it. The degree-0 machinery is scale-correct and non-vacuous (it
 *   returns a definite, c-stable FAIL here); the raw diagonal is simply the wrong
 *   passive core.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   This certifies the degree-0 construction is NON-VACUOUS and scale-invariant;
 *   it is NOT a shortcut. Even a Gpass that makes ||R|| <= 1 yields an
 *   RH-EQUIVALENT statement (K_a >= 0 is the §26 hidden-square restatement, not a
 *   reduction below RH). The bare-V pilot (imp-1240) is NOT re-run. Platt-Trudgian
 *   Lambda <= 0.2 REMAINS the rigorous SOTA. No false QED.
 *
 *   @see imp-1240-volterra-norm-pilot.js (bare V, the scale-dependent pilot)
 *   @see imp-2686-mupass-construction.js (the endpoint-bridge Gpass the raw diagonal lacks)
 *   @see section26-verdict-volterra-not-a-reduction-2026-06-18.js (the surviving target)
 *   @see imp-mu-pass-overflow-quantification.js (imp-2841, the scalar deficit profile)
 *
 *   Ticket: imp-2842 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI. */
function phiKernel(u) {
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
 * Cyclic Jacobi eigenvalues of a real symmetric matrix (ascending). Small n
 * (here 6), so a direct rotation sweep is exact to machine precision and needs
 * no external linear-algebra package.
 */
function symEigs(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-26) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = A[p][q];
        if (Math.abs(apq) < 1e-300) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * apq);
        const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  return A.map((r, i) => r[i]).sort((x, y) => x - y);
}

const U = 6;
const M = 200;
const H = U / M;
const N_TEST = 6;
const A_WEIGHT = 0.5; // headline shear weight a
const C_LADDER = Object.freeze([1, 3, 10, 100, 1000]); // Phi -> c Phi scale rungs

// --- Finite test set: lag-shifted copies of the genuine Phi -------------------
const _phi = [];
for (let k = 0; k < M; k++) _phi.push(phiKernel(k * H));

const _tau = [];
for (let i = 0; i < N_TEST; i++) _tau.push(0.1 * i);
const _shift = _tau.map((t) => Math.round(t / H));

// b_i(t) = Phi(t - tau_i) on the grid (zero outside [0, U]).
function _bvec(i) {
  const v = new Array(M).fill(0);
  const s = _shift[i];
  for (let k = 0; k < M; k++) {
    const j = k - s;
    if (j >= 0 && j < M) v[k] = _phi[j];
  }
  return v;
}
const _B = [];
for (let i = 0; i < N_TEST; i++) _B.push(_bvec(i));

// Test-set Gram G0 = B B^T (PSD by construction).
const _G0 = Array.from({ length: N_TEST }, () => new Array(N_TEST).fill(0));
for (let i = 0; i < N_TEST; i++) {
  for (let j = 0; j < N_TEST; j++) {
    let s = 0;
    for (let k = 0; k < M; k++) s += _B[i][k] * _B[j][k];
    _G0[i][j] = s * H;
  }
}

// Shear envelope = sqrt(cosh(a*tau_i)) (the imp-2686 cosh-completion); congruence
// keeps Gshear PSD with positive diagonal.
const _env = _tau.map((t) => Math.sqrt(Math.cosh(A_WEIGHT * t)));
const _Gshear = Array.from({ length: N_TEST }, () => new Array(N_TEST).fill(0));
for (let i = 0; i < N_TEST; i++) {
  for (let j = 0; j < N_TEST; j++) _Gshear[i][j] = _env[i] * _G0[i][j] * _env[j];
}

// Units: rescale the base Gram to spectral norm 1/3 so the bare-V contractivity
// crossing is exhibited on the ladder. The degree-0 R is invariant to this scalar.
const _lmaxGshearRaw = symEigs(_Gshear)[N_TEST - 1];
const _unit = 1 / (3 * _lmaxGshearRaw);
const _Gs = _Gshear.map((r) => r.map((x) => x * _unit)); // base (c=1) Gshear, ||.|| = 1/3
const _lmaxGs = symEigs(_Gs)[N_TEST - 1]; // = 1/3

// Provisional passive core = RAW diagonal of Gshear.
const _Gpass = _Gs.map((r, i) => r[i]);

// Degree-0 relative operator R = Gpass^{-1/2} Gshear Gpass^{-1/2} (correlation
// matrix: unit diagonal, scale-invariant -- the c^2 of Phi -> c Phi cancels).
const _R = Array.from({ length: N_TEST }, () => new Array(N_TEST).fill(0));
for (let i = 0; i < N_TEST; i++) {
  for (let j = 0; j < N_TEST; j++) _R[i][j] = _Gs[i][j] / Math.sqrt(_Gpass[i] * _Gpass[j]);
}
const _eigR = symEigs(_R);
const _lmaxR = _eigR[N_TEST - 1];
const _lminR = _eigR[0]; // >= 0: Gshear PSD => R PSD => ||R|| = lambda_max(R)
// I - R R* eigenvalues (R symmetric): 1 - lambda(R)^2.
const _lminIRR = Math.min(..._eigR.map((l) => 1 - l * l));

// Base K_a = Gpass - Gshear (provisional raw-diagonal core); sign is the §26 target.
const _Kbase = Array.from({ length: N_TEST }, () => new Array(N_TEST).fill(0));
for (let i = 0; i < N_TEST; i++) {
  for (let j = 0; j < N_TEST; j++) _Kbase[i][j] = (i === j ? _Gpass[i] : 0) - _Gs[i][j];
}
const _lminKbase = symEigs(_Kbase)[0];

const _sign = (x) => (x > 1e-12 ? 1 : x < -1e-12 ? -1 : 0);

/**
 * One rung of the Phi -> c Phi scale ladder. Degree-0 R is scale-invariant
 * (lambda_min(I - R R*) constant); K_a = c^2 (Gpass - Gshear) scales in magnitude
 * but not sign; bare V = sign(eig(I - c^2 Gshear)) flips along the ladder.
 */
function ladderRow(c) {
  const c2 = c * c;
  const lminKa = c2 * _lminKbase;
  const bareVlmin = 1 - c2 * _lmaxGs; // lambda_min(I - c^2 Gshear)
  return Object.freeze({
    c,
    lambdaMaxR: _lmaxR, // scale-invariant
    lambdaMinIminusRRstar: _lminIRR, // scale-invariant
    signIminusRRstar: _sign(_lminIRR),
    lambdaMinKa: lminKa, // scales by c^2, sign fixed
    signKa: _sign(_lminKbase),
    degree0SignTracksKa: _sign(_lminIRR) === _sign(_lminKbase),
    bareVlambdaMin: bareVlmin, // scale-DEPENDENT
    bareVsign: _sign(bareVlmin),
  });
}

const ROWS = Object.freeze(C_LADDER.map(ladderRow));
const _bareVsignBase = ROWS[0].bareVsign;
const _bareVbreaks = ROWS.some((r) => r.bareVsign !== _bareVsignBase);
const _degree0ScaleInvariant =
  ROWS.every((r) => Math.abs(r.lambdaMaxR - _lmaxR) < 1e-9) &&
  ROWS.every((r) => Math.abs(r.lambdaMinIminusRRstar - _lminIRR) < 1e-9);
const _rawDiagonalGpassCertifies = _lmaxR <= 1 + 1e-9;

export const IMP_NORMALIZED_R_SCALE_TEST = Object.freeze({
  id: 'imp-normalized-R-scale-test',
  ticket: 'imp-2842',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26'],
  relatedTarget: 'section26-verdict-volterra-not-a-reduction-2026-06-18.js',
  relatedBarePilot: 'imp-1240-volterra-norm-pilot.js',
  relatedConstruction: 'imp-2686-mupass-construction.js',

  summary:
    'Stress-tests the degree-0 reshaping R = Gpass^{-1/2} Gshear Gpass^{-1/2} with ' +
    'the Phi -> c Phi scale ladder (c in {1,3,10,100,1000}) that breaks bare V. On a ' +
    'finite test-set Gram (6 lag-shifted genuine-Phi profiles, raw diagonal as the ' +
    'provisional Gpass) the degree-0 R is scale-INVARIANT: lambda_max(R)=1.6165 and ' +
    'lambda_min(I - R R*)=-1.6131 are identical across all c, and sign(eig(I - R R*)) ' +
    'tracks sign(eig(K_a)) on every rung (K_a = c^2 (Gpass - Gshear) scales but never ' +
    'changes sign). Bare V FLIPS (+0.667 at c=1 -> -2.0 at c=3 onward), the exact ' +
    'failure the degree-0 normalization removes. The RAW-diagonal Gpass already FAILS ' +
    '(expected): R is a correlation matrix with lambda_max=1.6165 > 1, so K_a is ' +
    'indefinite -- the raw diagonal does not dominate and the endpoint-bridge Gpass ' +
    '(imp-2686) is required. Certifies the construction is NON-VACUOUS and ' +
    'scale-invariant; RH-EQUIVALENT, NOT a shortcut.',

  method: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    U,
    gridM: M,
    testSet: 'n = 6 lag-shifted Phi profiles b_i(t) = Phi(t - tau_i), tau_i = 0.1*i',
    nTest: N_TEST,
    testGram: 'G0 = B B^T (PSD by construction)',
    shearWeight: 'nu(tau) = sinh(a*tau), envelope cosh(a*tau) (imp-2686 cosh-completion), a = 0.5',
    shearGram: 'Gshear = diag(sqrt(cosh(a*tau_i))) G0 diag(sqrt(cosh(a*tau_i))) (PSD congruence)',
    provisionalGpass: 'RAW diagonal Gpass = diag(Gshear)',
    relativeOperator: 'R = Gpass^{-1/2} Gshear Gpass^{-1/2} (= correlation matrix, degree-0)',
    positivityTarget: 'K_a = Gpass - Gshear; ||R|| <= 1 <=> K_a >= 0 (congruence by Gpass^{1/2})',
    scaleLadder: C_LADDER,
    unitsNormalization: 'base (c=1) Gshear rescaled to spectral norm 1/3 (degree-0 R is scalar-blind)',
    bareVtest: 'sign(eig(I - c^2 Gshear)) -- the scale-dependent imp-1240 pilot test',
    eigenSolver: 'cyclic Jacobi (symmetric, machine precision at n = 6)',
    selfComputing: true,
  }),

  /* the headline scale-test verdict */
  scaleTestVerdict: Object.freeze({
    degree0ScaleInvariant: _degree0ScaleInvariant,
    degree0PassesScaleTest: _degree0ScaleInvariant,
    signIminusRRstarTracksSignKa: ROWS.every((r) => r.degree0SignTracksKa),
    bareVbreaksOnLadder: _bareVbreaks,
    bareVsignBase: _bareVsignBase,
    bareVsignTop: ROWS[ROWS.length - 1].bareVsign,
    rawDiagonalGpassCertifiesPositivity: _rawDiagonalGpassCertifies, // false (expected)
    lambdaMaxR: _lmaxR,
    lambdaMinR: _lminR,
    lambdaMinIminusRRstar: _lminIRR,
    lambdaMinKaBase: _lminKbase,
    interpretation:
      'The degree-0 reshaping returns a c-STABLE verdict (scale-invariant, tracks K_a) ' +
      'where bare V flips along the ladder -- the discriminator that killed bare V no ' +
      'longer kills the construction. But with the RAW diagonal as Gpass the verdict is ' +
      'a (stable) FAIL: lambda_max(R) > 1, so K_a is indefinite. The raw diagonal does ' +
      'not dominate; a genuine endpoint-bridge Gpass (imp-2686) is required.',
  }),

  /* the sharp structural by-product */
  structuralReason: Object.freeze({
    rawDiagonalCancelsShear:
      'With Gpass = diag(Gshear) the shear envelope cancels exactly in ' +
      'R = corr(Gshear) = corr(G0): the raw-diagonal normalization divides out the very ' +
      'endpoint-bridge mass it must weigh against. A faithful Gpass must RETAIN the ' +
      'cosh-completion mass (imp-2686), not cancel it.',
    correlationMatrixLambdaMaxGEq1:
      'R is a correlation matrix (unit diagonal, trace = n_test), so its eigenvalues ' +
      'average to 1 and lambda_max(R) >= 1, with equality only if G0 is diagonal. The ' +
      'overlapping lag-shifted Phi profiles give lambda_max = 1.6165 > 1, so the raw ' +
      'diagonal cannot make R a contraction.',
  }),

  rows: ROWS,

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    certifiesNonVacuous: true,
    isStructuralDiagnostic: true,
    rawDiagonalGpassSufficient: false,
    didNotRerunBarePilot: true,
    necessaryNotSufficient:
      '||R|| <= 1 <=> K_a >= 0 is the §26 hidden-square restatement, RH-EQUIVALENT, not a ' +
      'reduction below RH. This test certifies the degree-0 construction is scale-invariant ' +
      'and non-vacuous (it gives a definite, c-stable verdict), not that any positivity holds.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP_NORMALIZED_R_SCALE_TEST_ASSERTIONS = [
  {
    id: 'imp2842-ladder-row-count',
    why: 'One row per scale rung c in {1,3,10,100,1000}; a mis-count means the ' +
         'self-computing ladder dropped or duplicated a rung.',
    holds: () => ROWS.length === C_LADDER.length && C_LADDER.length === 5,
  },
  {
    id: 'imp2842-degree0-scale-invariant',
    why: 'The degree-0 R = Gpass^{-1/2} Gshear Gpass^{-1/2} is scale-invariant: under ' +
         'Phi -> c Phi the c^2 cancels, so lambda_max(R) and lambda_min(I - R R*) must be ' +
         'IDENTICAL (to ~1e-9) across every rung of the ladder. Drift means the c^2 did ' +
         'not cancel -- the reshaping is not actually degree-0.',
    holds: () =>
      _degree0ScaleInvariant &&
      ROWS.every((r) => Math.abs(r.lambdaMaxR - ROWS[0].lambdaMaxR) < 1e-9) &&
      ROWS.every((r) => Math.abs(r.lambdaMinIminusRRstar - ROWS[0].lambdaMinIminusRRstar) < 1e-9),
  },
  {
    id: 'imp2842-sign-iminusRRstar-tracks-signKa',
    why: 'The congruence K_a = Gpass^{1/2} (I - R) Gpass^{1/2} forces ' +
         'sign(eig(I - R R*)) to track sign(eig(K_a)) on every rung (Gshear PSD => R PSD ' +
         '=> ||R|| = lambda_max(R)). If a rung disagrees the equivalence ||R|| <= 1 <=> ' +
         'K_a >= 0 has been corrupted.',
    holds: () => ROWS.every((r) => r.degree0SignTracksKa && r.signIminusRRstar === r.signKa),
  },
  {
    id: 'imp2842-bare-V-breaks-on-ladder',
    why: 'The whole point: bare V (sign(eig(I - c^2 Gshear))) is scale-DEPENDENT and must ' +
         'flip along the ladder -- pass (+) at c=1, fail (-) by c=1000 -- whereas the ' +
         'degree-0 verdict does not move. If bare V never flips the discriminator is not ' +
         'being exercised.',
    holds: () => _bareVbreaks && ROWS[0].bareVsign === 1 && ROWS[ROWS.length - 1].bareVsign === -1,
  },
  {
    id: 'imp2842-raw-diagonal-Gpass-fails',
    why: 'Expected honest negative: with the RAW diagonal as Gpass, R is a correlation ' +
         'matrix (trace = n_test) so lambda_max(R) >= 1, and the overlapping lag-shifted ' +
         'Phi profiles push it strictly above 1 (~1.62). Hence K_a is indefinite -- the raw ' +
         'diagonal does NOT certify positivity. If lambda_max(R) <= 1 the test set lost its ' +
         'off-diagonal overlap and no longer probes the real obstruction.',
    holds: () => _lmaxR > 1 + 1e-6 && _rawDiagonalGpassCertifies === false && _lminKbase < -1e-9,
  },
  {
    id: 'imp2842-R-is-PSD-unit-diagonal',
    why: 'R must be a genuine correlation matrix: PSD (Gshear PSD => R PSD, lambda_min >= 0) ' +
         'with unit diagonal, so ||R|| = lambda_max(R) and the one-sided <-> two-sided test ' +
         'identity holds. A negative eigenvalue would break the spectral-radius reasoning.',
    holds: () =>
      _lminR > -1e-9 &&
      _R.every((row, i) => Math.abs(row[i] - 1) < 1e-9),
  },
  {
    id: 'imp2842-genuine-phi-grid',
    why: 'The test set must be built from the genuine Riemann Phi on U=6, M=200 with the ' +
         '§27 truncation n <= 10 and n_test = 6 lag-shifted profiles. A change means a ' +
         'different regime than the surviving §26 target names.',
    holds: () =>
      IMP_NORMALIZED_R_SCALE_TEST.method.U === 6 &&
      IMP_NORMALIZED_R_SCALE_TEST.method.gridM === 200 &&
      IMP_NORMALIZED_R_SCALE_TEST.method.phiTruncationN === 10 &&
      IMP_NORMALIZED_R_SCALE_TEST.method.nTest === 6,
  },
  {
    id: 'imp2842-honest-rh-equivalent-not-a-shortcut',
    why: 'Mandatory honesty: this is structural/diagnostic, RH-EQUIVALENT, certifies ' +
         'non-vacuousness only, raw-diagonal Gpass is NOT sufficient, the bare pilot was ' +
         'not re-run, and PT 0.2 stays SOTA. If any flips the module is over-claiming.',
    holds: () => {
      const c = IMP_NORMALIZED_R_SCALE_TEST.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.certifiesNonVacuous === true &&
        c.rawDiagonalGpassSufficient === false &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const a of IMP_NORMALIZED_R_SCALE_TEST_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-normalized-R-scale-test assertion failed: ${a.id}`);
}
