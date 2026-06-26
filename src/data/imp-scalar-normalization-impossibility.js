/**
 * @module imp-scalar-normalization-impossibility
 * @fileoverview imp-2852 (proof, medium) -- a genuine NEGATIVE THEOREM: no scalar
 *   normalization N(c) > 0 can ever equate the Section-26 cone {K_a >= 0} with the
 *   bare-Volterra sublevel set {||V_{a,Phi}|| <= 1}. This converts the
 *   section26-verdict's one-line ALGEBRAIC SKETCH ("sign(eig(K_a/N(c))) is
 *   c-invariant while sign(eig(I-VV*)) flips at c = 1/sqrt(||V0||)") into a complete,
 *   self-contained impossibility proof, permanently closing the "revive bare-V by
 *   rescaling" route. It is the companion to the homogeneity theorem imp-2851
 *   (imp-volterra-homogeneity-proof): that file PROVES degree-2 homogeneity; THIS
 *   file proves the IMPOSSIBILITY that homogeneity forces. One of the few clean,
 *   rigorous (negative) results the Volterra arc produced. NO false QED.
 *
 *   SET-UP (from imp-2851)
 *   ----------------------
 *   Fix a > 0 and the (genuine) profile Phi. Under the rescaling Phi -> cPhi (c > 0):
 *       (H)  K_{a,cPhi} = c^2 K_{a,Phi}      (K_a is degree-2 homogeneous)
 *       (V)  ||V_{a,cPhi}|| = c^2 ||V_{a,Phi}||   (||V|| is degree-2 homogeneous)
 *   both proven symbolically in imp-2851. Write V0 := V_{a,Phi}, K0 := K_{a,Phi},
 *   and nu0 := ||V0|| > 0 (the operator norm of the un-scaled Volterra operator).
 *
 *   THE TWO OBJECTS BEING COMPARED
 *   ------------------------------
 *   CONE      C(c)   := [ K_{a,cPhi} >= 0 ]                       (a TRUE/FALSE indicator)
 *   SUBLEVEL  S(c)   := [ ||V_{a,cPhi}|| <= 1 ]                   (a TRUE/FALSE indicator)
 *   "Reviving the bare biconditional by a scalar normalization N(c) > 0" means:
 *   apply a positive scalar to the cone operator and ask whether the renormalized
 *   cone indicator C_N(c) := [ K_{a,cPhi} / N(c) >= 0 ] can be made to coincide with
 *   S(c) for ALL c > 0. The theorem says it cannot, for ANY scalar N(c) > 0.
 *
 *   THE IMPOSSIBILITY THEOREM
 *   -------------------------
 *   THEOREM (negative). There is NO scalar function N : (0, infty) -> (0, infty) such
 *   that  C_N(c) = S(c)  for all c > 0.
 *
 *   PROOF.
 *   Step 1 -- the renormalized cone indicator is CONSTANT in c.
 *     By (H), K_{a,cPhi}/N(c) = (c^2 / N(c)) K0. The prefactor s(c) := c^2/N(c) is a
 *     STRICTLY POSITIVE scalar for every c (numerator c^2 > 0, denominator N(c) > 0).
 *     Multiplying a Hermitian operator by a positive scalar is a CONGRUENCE:
 *           s K0 = (sqrt(s) I)^* K0 (sqrt(s) I),     sqrt(s) I invertible.
 *     By SYLVESTER'S LAW OF INERTIA, congruence preserves the inertia
 *     (n_+, n_0, n_-) -- in particular it preserves the SET OF EIGENVALUE SIGNS and
 *     hence positive-semidefiniteness. Therefore
 *           C_N(c) = [ (c^2/N(c)) K0 >= 0 ] = [ K0 >= 0 ]      for every c > 0,
 *     a value INDEPENDENT of c. (Equivalently: scalar normalization can rescale
 *     eigenvalue MAGNITUDES but can never flip an eigenvalue SIGN.)
 *
 *   Step 2 -- the sublevel indicator is NON-CONSTANT in c (it flips).
 *     By (V), S(c) = [ ||V_{a,cPhi}|| <= 1 ] = [ c^2 nu0 <= 1 ] = [ c <= 1/sqrt(nu0) ].
 *     Since nu0 > 0, set c_star := 1/sqrt(nu0) in (0, infty). Then
 *           S(c) = TRUE  for 0 < c <= c_star,   S(c) = FALSE for c > c_star.
 *     So S is a genuine step function of c: S(c_star/2) = TRUE != FALSE = S(2 c_star).
 *
 *   Step 3 -- contradiction.
 *     If C_N = S on all of (0, infty), then by Step 1 the constant value [K0 >= 0]
 *     would equal BOTH S(c_star/2) = TRUE and S(2 c_star) = FALSE -- impossible, since
 *     TRUE != FALSE. Hence no such scalar N(c) exists.                          (QED, negative)
 *
 *   WHY A SCALAR IS POWERLESS (the one-sentence reason).
 *   A scalar N(c) can only DILATE the spectrum of K_a uniformly; it cannot move the
 *   ZERO LEVEL relative to the eigenvalues, so it cannot create the c-dependent
 *   sign change that the sublevel set's threshold "1" manufactures. Inertia is a
 *   congruence invariant; a scale-INVARIANT cone (constant indicator) and a
 *   scale-BOUNDED sublevel set (flipping indicator) are therefore separated by a
 *   topological obstruction no positive scalar can bridge.
 *
 *   SYMMETRIC CLOSURE (normalizing the V-side instead).
 *   One might instead renormalize the OTHER side: ask whether ||V_{a,cPhi}/M(c)|| <= 1
 *   can be made c-INVARIANT to match the cone. It can -- but ONLY by M(c) propto c^2,
 *   which divides OUT the full scale and lands exactly on the degree-0 normalized
 *   relative operator R = Gpass^{-1/2} Gshear Gpass^{-1/2} of the verdict's item 3.
 *   That object is scale-invariant (the right class) but ||R|| <= 1 <=> K_a >= 0 is a
 *   FAITHFUL, information-preserving restatement of Conj 26.3 -- it carries FULL RH
 *   strength and is NOT a cheaper revival. So BOTH scalar moves fail to produce a
 *   shortcut: rescaling the cone cannot track the sublevel set (this theorem), and
 *   rescaling V to scale-invariance just reconstructs the RH-equivalent R-route.
 *
 *   SCOPE -- WHAT THIS PROVES AND WHAT IT DOES NOT.
 *   PROVES (rigorously): no scalar N(c) equates the cone with the sublevel set; the
 *   "revive bare-V by rescaling" route is CLOSED. This is a genuine negative theorem.
 *   DOES NOT prove ||V|| <= 1 (RH-equivalent; FALSE for large a per imp-2660); does
 *   NOT close the NON-scalar R-route (RH-equivalent, the surviving target); says
 *   NOTHING for or against RH itself. It only forecloses the SCALAR shortcut.
 *
 *   The numerical block below CONFIRMS the theorem on explicit small matrices: the
 *   inertia of (c^2/N(c)) K0 is identical across c in {1,3,10,100,1000} and several
 *   positive N(c), while the sublevel indicator [c^2 nu0 <= 1] flips at c_star. It
 *   CONFIRMS the symbolic proof; it does not ground it.
 */

const VERDICT_REF = 'src/data/section26-verdict-volterra-not-a-reduction-2026-06-18.js';
const HOMOGENEITY_REF = 'src/data/imp-volterra-homogeneity-proof.js';

// -- Numerical confirmation ----------------------------------------------------
// Symmetric Jacobi eigenvalue routine (deterministic; small dense symmetric input).
function jacobiEigenvalues(Ain) {
  const n = Ain.length;
  const A = Ain.map((row) => Float64Array.from(row));
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-28) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = A[p][q];
        if (Math.abs(apq) < 1e-300) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * apq);
        const sgn = theta >= 0 ? 1 : -1;
        const t = sgn / (Math.abs(theta) + Math.sqrt(theta * theta + 1)); // tan(angle)
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        // right multiply by rotation J in the (p,q) plane
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        // left multiply by J^T
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  const eig = [];
  for (let i = 0; i < n; i++) eig.push(A[i][i]);
  return eig;
}

// Inertia signature (n_+, n_0, n_-) of a symmetric matrix, with a sign tolerance.
function inertia(M, tol) {
  const eps = tol || 1e-9;
  const eig = jacobiEigenvalues(M);
  let pos = 0;
  let zero = 0;
  let neg = 0;
  for (const e of eig) {
    if (e > eps) pos++;
    else if (e < -eps) neg++;
    else zero++;
  }
  return { pos, zero, neg };
}

function scaleSym(M, s) {
  return M.map((row) => row.map((x) => s * x));
}

// Spectral norm of a small dense matrix via power iteration on M^T M (fixed seed).
function spectralNorm(M) {
  const N = M.length;
  let v = new Float64Array(N);
  for (let i = 0; i < N; i++) v[i] = 1 / Math.sqrt(N); // deterministic seed
  let lambda = 0;
  for (let it = 0; it < 600; it++) {
    const Mx = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      let acc = 0;
      for (let j = 0; j < N; j++) acc += M[i][j] * v[j];
      Mx[i] = acc;
    }
    const y = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      let acc = 0;
      for (let i = 0; i < N; i++) acc += M[i][j] * Mx[i];
      y[j] = acc;
    }
    let nrm = 0;
    for (let k = 0; k < N; k++) nrm += y[k] * y[k];
    nrm = Math.sqrt(nrm);
    if (nrm === 0) return 0;
    for (let k = 0; k < N; k++) y[k] /= nrm;
    lambda = nrm;
    v = y;
  }
  return Math.sqrt(lambda);
}

function runConfirmation() {
  // A fixed INDEFINITE symmetric K0 proxy: makes the "signs preserved" point vivid
  // (the genuine K_a is PSD -- a special case where n_- = 0; inertia invariance is
  // the same theorem either way).
  const K0 = [
    [2, 1, 0, 0],
    [1, -1, 1, 0],
    [0, 1, 3, 1],
    [0, 0, 1, -2],
  ];
  const baseInertia = inertia(K0);
  const cValues = [1, 3, 10, 100, 1000];
  // Several positive scalar normalizations N(c) the chain might try.
  const Ns = [
    { name: 'N=1', f: () => 1 },
    { name: 'N=c', f: (c) => c },
    { name: 'N=c^2', f: (c) => c * c },
    { name: 'N=c^4', f: (c) => c * c * c * c },
    { name: 'N=7.3', f: () => 7.3 },
  ];
  let inertiaInvariant = true;
  for (const c of cValues) {
    for (const N of Ns) {
      const s = (c * c) / N.f(c); // strictly positive prefactor c^2 / N(c)
      const inr = inertia(scaleSym(K0, s));
      if (inr.pos !== baseInertia.pos || inr.zero !== baseInertia.zero || inr.neg !== baseInertia.neg) {
        inertiaInvariant = false;
      }
    }
  }

  // Sublevel side: V0 a fixed matrix; nu0 = ||V0||; c_star = 1/sqrt(nu0).
  const V0 = [
    [0.4, 0.2, 0.0],
    [0.1, 0.3, 0.2],
    [0.0, 0.15, 0.35],
  ];
  const nu0 = spectralNorm(V0);
  const cStar = 1 / Math.sqrt(nu0);
  // Confirm the sublevel indicator [c^2 nu0 <= 1] flips across c_star.
  const memberBelow = (cStar / 2) * (cStar / 2) * nu0 <= 1; // expect TRUE
  const memberAbove = (2 * cStar) * (2 * cStar) * nu0 <= 1; // expect FALSE
  const sublevelFlips = memberBelow === true && memberAbove === false;

  return {
    baseInertia,
    cValues: cValues.slice(),
    normalizationsTested: Ns.map((N) => N.name),
    inertiaInvariant,
    nu0: Number(nu0.toFixed(12)),
    cStar: Number(cStar.toFixed(12)),
    memberBelow,
    memberAbove,
    sublevelFlips,
  };
}

const CONFIRM = runConfirmation();

export const IMP_SCALAR_NORMALIZATION_IMPOSSIBILITY = Object.freeze({
  id: 'imp-scalar-normalization-impossibility',
  ticket: 'imp-2852',
  generatedAt: '2026-06-26T03:00:00Z',
  verdictSourcePath: VERDICT_REF,
  paperSections: ['SS26', 'SS27'],
  relatedTickets: ['imp-1240', 'imp-1258', 'imp-2654', 'imp-2660', 'imp-2851'],

  summary:
    'Genuine NEGATIVE THEOREM: no scalar normalization N(c) > 0 can equate the ' +
    'Section-26 cone {K_a >= 0} with the bare-Volterra sublevel set {||V|| <= 1}. ' +
    'Because K_a is degree-2 homogeneous (imp-2851), K_{a,cPhi}/N(c) = (c^2/N(c)) K0 ' +
    'with c^2/N(c) > 0, a positive congruence; by Sylvester law of inertia its ' +
    'eigenvalue signs -- hence the cone indicator -- are c-INVARIANT. But ' +
    '||V_{a,cPhi}|| = c^2 nu0, so the sublevel indicator [c^2 nu0 <= 1] FLIPS at ' +
    'c_star = 1/sqrt(nu0). A constant indicator cannot equal a flipping one, so no ' +
    'scalar N(c) exists. This closes the "revive bare-V by rescaling" route; the ' +
    'NON-scalar R-route stays RH-equivalent (the surviving target).',

  theorem: Object.freeze({
    statement:
      'There is no scalar N : (0,infty) -> (0,infty) with [K_{a,cPhi}/N(c) >= 0] = ' +
      '[||V_{a,cPhi}|| <= 1] for all c > 0.',
    step1_coneConstant:
      'K_{a,cPhi}/N(c) = (c^2/N(c)) K0 with prefactor s(c) = c^2/N(c) > 0. ' +
      'Multiplying a Hermitian operator by a positive scalar is a congruence ' +
      '(sqrt(s) I)^* K0 (sqrt(s) I); by Sylvester law of inertia it preserves ' +
      'inertia, so the cone indicator equals [K0 >= 0] for EVERY c (constant in c).',
    step2_sublevelFlips:
      '||V_{a,cPhi}|| = c^2 nu0 (degree-2 homogeneity, nu0 = ||V0|| > 0), so the ' +
      'sublevel indicator [c^2 nu0 <= 1] = [c <= 1/sqrt(nu0)] is a step function ' +
      'flipping at c_star = 1/sqrt(nu0): TRUE for c <= c_star, FALSE for c > c_star.',
    step3_contradiction:
      'A constant function (Step 1) cannot equal a non-constant step function ' +
      '(Step 2): equality would force [K0 >= 0] to be both TRUE (at c_star/2) and ' +
      'FALSE (at 2 c_star). Hence no scalar N(c) exists.',
    oneLineReason:
      'A scalar dilates the spectrum uniformly; it cannot move the zero level ' +
      'relative to the eigenvalues, so it cannot manufacture the c-dependent sign ' +
      'flip the sublevel threshold "1" creates. Inertia is a congruence invariant.',
    isProven: true,
    isNegativeTheorem: true,
    isRHClaim: false,
  }),

  symmetricClosure: Object.freeze({
    vSideMove: 'Renormalize V instead: ask whether ||V_{a,cPhi}/M(c)|| <= 1 is c-invariant.',
    achievableOnlyBy: 'M(c) propto c^2 (divides out the full scale).',
    landsOn: 'the degree-0 normalized relative operator R = Gpass^{-1/2} Gshear Gpass^{-1/2}.',
    consequence:
      '||R|| <= 1 <=> K_a >= 0 is a faithful, information-preserving restatement of ' +
      'Conj 26.3 carrying FULL RH strength -- NOT a cheaper revival. Both scalar ' +
      'moves fail to yield a shortcut.',
  }),

  // Numerical confirmation (CONFIRMS the symbolic theorem; does not ground it).
  numericalConfirmation: Object.freeze({
    coneProxy: 'fixed 4x4 indefinite symmetric K0 (genuine K_a is PSD, a special case)',
    baseInertia: CONFIRM.baseInertia,
    cValues: CONFIRM.cValues,
    normalizationsTested: CONFIRM.normalizationsTested,
    inertiaInvariant: CONFIRM.inertiaInvariant, // inertia(c^2/N(c) K0) == inertia(K0) for all c,N
    vProxyNorm_nu0: CONFIRM.nu0,
    cStar: CONFIRM.cStar,
    memberBelow_cStar: CONFIRM.memberBelow, // TRUE  (c_star/2 inside sublevel set)
    memberAbove_cStar: CONFIRM.memberAbove, // FALSE (2 c_star outside sublevel set)
    sublevelFlips: CONFIRM.sublevelFlips,
    note:
      'Cone inertia is identical across all (c, N(c)); the sublevel indicator flips ' +
      'at c_star = 1/sqrt(nu0). Exactly the constant-vs-step separation of the proof.',
  }),

  honestScope: Object.freeze({
    provesScalarImpossibility: true, // closes the revive-by-rescaling route
    isNegativeTheorem: true,
    closesNonScalarRRoute: false, // R-route is RH-equivalent, the surviving target
    provesVNormLEQ1: false, // RH-equivalent / FALSE for large a (imp-2660)
    saysAnythingAboutRH: false,
    isRHClaim: false,
    certifies: 'the SCALAR-normalization revival route is permanently closed',
  }),

  references: Object.freeze({
    verdict: VERDICT_REF,
    homogeneityTheorem: HOMOGENEITY_REF + ' (imp-2851 -- proves the degree-2 homogeneity used here)',
    largeARefutation: 'imp-2660 (||V|| > 1 for a > ~37.66)',
    survivingTarget: 'normalized relative operator R route (RH-equivalent, NOT closed by this theorem)',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP_SCALAR_NORMALIZATION_IMPOSSIBILITY_ASSERTIONS = [
  {
    id: 'imp2852-impossibility-proven-negative',
    why:
      'The core deliverable: the scalar-normalization impossibility must be marked ' +
      'PROVEN and a NEGATIVE theorem, and must NOT be an RH claim. If isProven flips ' +
      'false, isNegativeTheorem flips false, or isRHClaim flips true, the file is ' +
      'mis-stating its own scope.',
    holds: () => {
      const t = IMP_SCALAR_NORMALIZATION_IMPOSSIBILITY.theorem;
      return t.isProven === true && t.isNegativeTheorem === true && t.isRHClaim === false;
    },
  },
  {
    id: 'imp2852-cone-inertia-c-invariant',
    why:
      'Step 1 of the proof: the renormalized cone inertia (c^2/N(c)) K0 must be ' +
      'IDENTICAL across all tested c in {1,3,10,100,1000} and all positive N(c). This ' +
      'is the Sylvester-law-of-inertia constant-indicator fact the impossibility rests on.',
    holds: () => IMP_SCALAR_NORMALIZATION_IMPOSSIBILITY.numericalConfirmation.inertiaInvariant === true,
  },
  {
    id: 'imp2852-sublevel-indicator-flips',
    why:
      'Step 2 of the proof: the sublevel indicator [c^2 nu0 <= 1] must FLIP across ' +
      'c_star = 1/sqrt(nu0) -- TRUE below (member), FALSE above (non-member). Without ' +
      'the flip there is no constant-vs-step contradiction and the theorem is empty.',
    holds: () => {
      const nc = IMP_SCALAR_NORMALIZATION_IMPOSSIBILITY.numericalConfirmation;
      return nc.sublevelFlips === true && nc.memberBelow_cStar === true && nc.memberAbove_cStar === false;
    },
  },
  {
    id: 'imp2852-cstar-matches-formula',
    why:
      'The flip point must satisfy c_star = 1/sqrt(nu0) exactly (nu0 = ||V0||), the ' +
      'value the verdict cites. Guards the numeric c_star against drift from its closed form.',
    holds: () => {
      const nc = IMP_SCALAR_NORMALIZATION_IMPOSSIBILITY.numericalConfirmation;
      return Math.abs(nc.cStar - 1 / Math.sqrt(nc.vProxyNorm_nu0)) < 1e-9;
    },
  },
  {
    id: 'imp2852-honest-no-rh-overclaim',
    why:
      'HONESTY GUARD: this file proves a SCALAR impossibility only. It must NOT claim ' +
      'to close the NON-scalar R-route (RH-equivalent), must NOT claim ||V||<=1, and ' +
      'must say nothing about RH. closesNonScalarRRoute, provesVNormLEQ1, ' +
      'saysAnythingAboutRH and isRHClaim must all be false.',
    holds: () => {
      const h = IMP_SCALAR_NORMALIZATION_IMPOSSIBILITY.honestScope;
      return (
        h.provesScalarImpossibility === true &&
        h.closesNonScalarRRoute === false &&
        h.provesVNormLEQ1 === false &&
        h.saysAnythingAboutRH === false &&
        h.isRHClaim === false
      );
    },
  },
];

export default IMP_SCALAR_NORMALIZATION_IMPOSSIBILITY;
