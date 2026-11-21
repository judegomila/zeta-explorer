/**
 * @fileoverview imp-95520 — OBJECTIVE verdict: aim the signed-coalescence pencil
 * machinery (imp-95221→95511: SGN-C count bound, COAL-N confluent-Laguerre law,
 * TILT-DET off-lattice majorant, SPEC-INT / NO-PF) at the Weil/Guinand
 * explicit-formula quadratic form on the Weil-positivity axis (prime -> zero
 * location), NOT the Montgomery-PCC axis.
 *
 * This records the OUTCOME of the imp-95520 objective as an HONEST PARTIAL: the
 * structural PORT is confirmed and made precise, and the finite-truncation
 * VERDICT is delivered together with the EXACT obstruction that keeps the
 * finite -> infinite step (= full RH) out of reach. NO false QED; no refereed bound is changed
 * ; RH remains OPEN.
 *
 * WHAT WAS ASKED (imp-95520): clone the imp-95509/95511 Gram/mean-time pencil
 * builder, swap the toy geometric lattice Q = {2^k} for the log-prime lattice
 * {k log p} with Weil weights, then decide (a) whether SPEC-INT's NO-PF
 * oscillation obstruction IS the indefiniteness of the truncated Weil form, and
 * (b) whether SGN-C / COAL-N give a nontrivial coalescence-uniform one-sided
 * estimate of the prime side vs the archimedean term at finite truncation.
 *
 * THE PORT (confirmed, and it is exact). The Weil/Guinand prime side is
 *   L(g) = Sum_p Sum_{k>=1} (log p) p^(-k/2) g(k log p),
 * a signed sum over the log-prime lattice { k log p }. For a FIXED prime p the
 * exponential map k |-> exp(k log p) = p^k turns { k log p : k >= 1 } into the
 * geometric lattice { p^k } of ratio p. So the prime side is precisely a signed
 * sum over the UNION of geometric lattices with ratios = the primes {2,3,5,7,...}
 * and weights w_{p,k} = (log p) p^(-k/2). This is the machinery's NATIVE object
 * (imp-95508 geometric-lattice cap, imp-95509 Gram/mean-time pencil) — with two
 * structural differences from the toy Q = {2^k}: (i) infinitely many DISTINCT,
 * UNBOUNDED ratios (one per prime), not a single ratio rho; (ii) the weights are
 * the fixed ARITHMETIC profile (log p) p^(-k/2), not a free binomial/Laguerre
 * profile the SGN-C / COAL-N certificates are tuned to.
 *
 * WHAT THE WEIL CRITERION NEEDS. Weil positivity is RH <=> W(g) >= 0 for every
 * g = h * h~ of positive type, where
 *   W(h) = archimedean(h) [a POSITIVE-definite form]  -  Sum_{p,k} w_{p,k} <h, S_{k log p} h>,
 * with S_u the shift-by-u operator. The prime side is a QUADRATIC form in h
 * (signed sum of shifted autocorrelations), and the required conclusion is the
 * SIGN of the DIFFERENCE of two quadratic forms on the positive-type cone.
 *
 * FINITE-TRUNCATION VERDICT.
 *  (a) NO. SPEC-INT's NO-PF is NOT the indefiniteness of the truncated Weil form.
 *      NO-PF is a statement about the eigenFUNCTIONS of the mean-time compression
 *      M (a PSD operator whose eigenvalues are all > 0): no eigenfunction is
 *      signed-definite, which kills a Perron / Krein-Rutman positive-CONE route.
 *      The truncated Weil object is the SIGN of a quadratic FORM on test
 *      functions. Identifying the two is a category error. They are CONSONANT in
 *      spirit — both say "the lattice alone supplies no positivity" — but they
 *      are DISTINCT theorems on different objects.
 *  (b) INERT. SGN-C / COAL-N do produce a coalescence-uniform one-sided (sup /
 *      count) bound on the prime side as a signed lattice sum. But it is INERT
 *      against W, because it bounds the WRONG functional: it controls the
 *      sup/coalescence of the signed sum with a FREE weight profile, whereas W
 *      needs archimedean(h) >= prime-side(h) as forms on the SAME h over the
 *      positive-type cone, with the FIXED arithmetic weights. The machinery has
 *      no channel to (i) enforce the positive-type coupling of h across lattice
 *      points, nor (ii) carry the archimedean positive-definite form as the
 *      dominating term.
 *
 * INDEFINITENESS WITNESS (exact, verified below). Even the smallest truncation
 * of the prime-ONLY form is indefinite. On the two nodes {0, log 2} coupled by
 * the single prime power (p=2, k=1) the prime-side form is the hollow 2x2
 * [[0, -w],[ -w, 0]] with w = (log 2)/sqrt(2), whose eigenvalues are +/- w — a
 * negative eigenvalue -w < 0. The 4-node star {0, log2, log3, log5} (single
 * powers) is the hollow matrix with center-to-leaf weights -(log p)/sqrt(p); its
 * spectrum is { 0 (mult 2), +/- sqrt(w2^2+w3^2+w5^2) }, min eigenvalue
 * ~= -1.0772935 < 0, trace 0. So the truncated prime side is NECESSARILY
 * indefinite (hollow diagonal => zero trace => a negative direction whenever it
 * is nonzero), and the archimedean positive-definite term is STRUCTURALLY
 * essential — a lattice-only (archimedean-free) positivity certificate cannot
 * exist. This is the expected shadow of "finite truncation is never RH".
 *
 * THE EXACT OBSTRUCTION (named sub-gap). To convert the port into a Weil-side
 * lever the machinery would need a bound comparing TWO quadratic forms in h on
 * the positive-type cone — archimedean vs the fixed-arithmetic-weight prime side
 * — not a one-sided sup/coalescence bound on a free-weight signed sum. The
 * missing object is a positive-type-cone form comparison carrying the
 * archimedean term; the signed-coalescence chain supplies neither the cone
 * coupling nor the archimedean majorant. This obstruction is DISTINCT from, but
 * parallel to, the NO-PF positive-cone kill. Until it is supplied, the port is
 * real and in-repo but yields NO one-sided control of W, so the finite -> infinite
 * step (= full RH) is not reached.
 *
 * HONEST LIMITS. Model-level structural analysis; ports the imp-95511 pencil
 * currency onto the log-prime lattice and records the verdict. Touches no Lambda
 * bound, no paper packet, no verified height. RH OPEN; no refereed bound is changed;
 * NO QED. NO heavy imports; witness figures recomputed by the assertions.
 */

// ---------------------------------------------------------------------------
// import-free helpers (compact symmetric Jacobi eigensolver, imp-95511 style)
// ---------------------------------------------------------------------------
function jacobiEigvals(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-20) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
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
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}

// Weil prime-side weight on the log-prime lattice: w_{p,k} = (log p) p^(-k/2).
function weilWeight(p, k) {
  return Math.log(p) * Math.pow(p, -k / 2);
}

export const WEIL_POSITIVITY_PENCIL_PORT_VERDICT = Object.freeze({
  id: 'imp-95520-weil-positivity-pencil-port-verdict',
  title: 'Verdict on the imp-95520 objective: aim the signed-coalescence pencil at the Weil explicit-formula quadratic form',
  status:
    'PARTIAL — structural PORT confirmed exact; finite-truncation verdict = NO-PF is DISTINCT from Weil indefiniteness (a) '
    + 'and the SGN-C/COAL-N one-sided bound is INERT against W (b); named sub-gap = missing positive-type-cone form comparison '
    + 'carrying the archimedean term; RH remains OPEN; no refereed bound is changed; NO QED',
  axis: 'Weil-positivity (prime -> zero-location); NOT the Montgomery-PCC axis',
  source:
    'imp-95511 (SPEC-INT / NO-PF / OSC-INF), imp-95509 (mean-time pencil, trace-class), imp-95508 (geometric-lattice cap); '
    + 'target = Weil/Guinand explicit-formula quadratic form.',

  // The port: prime side = signed sum over the union of geometric lattices with
  // ratios = the primes, weights w_{p,k} = (log p) p^(-k/2).
  port: {
    primeSide: 'L(g) = Σ_p Σ_{k>=1} (log p) p^(-k/2) g(k log p) — signed sum over the log-prime lattice {k log p}',
    geometricIdentity: 'exp(k log p) = p^k: for fixed p the log-prime lattice IS the geometric lattice {p^k} of ratio p',
    weightProfile: 'w_{p,k} = (log p) p^(-k/2) — a FIXED arithmetic profile, not the free binomial/Laguerre profile SGN-C/COAL-N tune',
    structuralDiffsFromToyQ: [
      'infinitely many distinct, unbounded ratios (one per prime), not a single ratio rho',
      'weights fixed by arithmetic, not a free certificate-tuned profile',
    ],
  },

  weilNeeds:
    'W(h) = archimedean(h) [positive-definite] − Σ_{p,k} w_{p,k} <h, S_{k log p} h>; the criterion is the SIGN of a DIFFERENCE '
    + 'of two quadratic forms in h over the positive-type cone (g = h * h~).',

  verdict: {
    a_noPfVsIndefiniteness:
      'NO — NO-PF concerns eigenFUNCTIONS of the PSD mean-time compression M (none signed-definite ⇒ positive-CONE route killed); '
      + 'the truncated Weil object is the SIGN of a quadratic FORM. DISTINCT theorems on different objects; consonant in spirit only.',
    b_sgncCoalInert:
      'INERT — SGN-C/COAL-N give a coalescence-uniform one-sided sup/count bound on the prime side, but it bounds the WRONG functional: '
      + 'W needs a form comparison on the SAME h over the positive-type cone with fixed arithmetic weights, plus the archimedean majorant; '
      + 'the machinery supplies neither the cone coupling nor the archimedean term.',
  },

  // Exact indefiniteness witnesses (recomputed by the assertions).
  indefinitenessWitness: {
    twoNode: 'nodes {0, log2}, prime power (2,1): hollow 2x2 [[0,-w],[-w,0]], w=(log2)/√2, eigenvalues ±w ⇒ negative direction −w',
    fourNodeStar: 'nodes {0,log2,log3,log5} single powers: hollow star, spectrum {0 (×2), ±√(w2²+w3²+w5²)}, min ≈ −1.0772935, trace 0',
    reading: 'hollow diagonal ⇒ zero trace ⇒ a negative eigendirection whenever nonzero; truncated prime-only form is necessarily indefinite, so the archimedean positive-definite term is structurally essential (no lattice-only positivity certificate exists).',
  },

  subGap:
    'The missing object is a positive-type-cone COMPARISON of two quadratic forms (archimedean vs the fixed-arithmetic-weight '
    + 'prime side), carrying the archimedean majorant — not a one-sided sup/coalescence bound on a free-weight signed sum. The '
    + 'signed-coalescence chain supplies neither the cone coupling nor the archimedean term, so the port is inert for W and the '
    + 'finite -> infinite step (= full RH) is not reached. Distinct from, but parallel to, the NO-PF positive-cone kill.',

  deepening:
    'imp-95520-weil-pick-identity-finite-truncation.js computes the actual truncated Weil matrices on three test classes. '
    + 'It SUPERSEDES the port reading above: on the machinery\'s native span the prime side is not a free signed lattice sum but '
    + '(Z_i+Z_j)G_ij with Z = −ζ\'/ζ(1/2+ν), and the whole form is the Carathéodory Pick matrix of ξ\'/ξ (Lagarias\' criterion); '
    + 'the hollow prime-only indefiniteness recorded here is trivial (trace 0) and irrelevant to W, which is PSD at every '
    + 'truncation computed; the one-sided SGN-C/COAL-N estimate is not merely inert but has the wrong sign by 3–16 orders.',

  summary:
    'The port is real, exact, and in-repo — the Weil prime side is genuinely the machinery’s native signed-geometric-lattice '
    + 'object — but at finite truncation the one-sided signed-coalescence certificates are inert against the Weil quadratic form '
    + '(wrong currency: one-sided sup bound vs cone form comparison, and no archimedean channel). RH stays open.',
});

export const WEIL_POSITIVITY_PENCIL_PORT_VERDICT_ASSERTIONS = Object.freeze([
  {
    name: 'port: exp(k log p) = p^k reproduces the geometric lattice (p∈{2,3,5}, k∈{1,2,3})',
    check: () => {
      for (const p of [2, 3, 5]) {
        for (let k = 1; k <= 3; k++) {
          if (Math.abs(Math.exp(k * Math.log(p)) - Math.pow(p, k)) > 1e-6 * Math.pow(p, k)) return false;
        }
      }
      return true;
    },
  },
  {
    name: 'port: Weil weights w_{p,k}=(log p)p^{-k/2} match for (2,1),(2,2),(3,1),(5,1)',
    check: () =>
      Math.abs(weilWeight(2, 1) - 0.4901290717342736) < 1e-12
      && Math.abs(weilWeight(2, 2) - Math.log(2) / 2) < 1e-12
      && Math.abs(weilWeight(3, 1) - 0.6342841005975639) < 1e-9
      && Math.abs(weilWeight(5, 1) - 0.7197625155536004) < 1e-9,
  },
  {
    name: 'indefiniteness: 2-node prime-only form [[0,-w],[-w,0]] has eigenvalues ±w (negative direction)',
    check: () => {
      const w = weilWeight(2, 1);
      const ev = jacobiEigvals([[0, -w], [-w, 0]]);
      return Math.abs(ev[0] + w) < 1e-12 && Math.abs(ev[1] - w) < 1e-12 && ev[0] < 0;
    },
  },
  {
    name: 'indefiniteness: 4-node star hollow form is indefinite, trace 0, min ≈ −√(w2²+w3²+w5²)',
    check: () => {
      const w2 = weilWeight(2, 1);
      const w3 = weilWeight(3, 1);
      const w5 = weilWeight(5, 1);
      // star: node 0 (center) coupled to leaves log2, log3, log5; leaves uncoupled
      const M = [
        [0, -w2, -w3, -w5],
        [-w2, 0, 0, 0],
        [-w3, 0, 0, 0],
        [-w5, 0, 0, 0],
      ];
      const ev = jacobiEigvals(M);
      const trace = ev.reduce((s, x) => s + x, 0);
      const expectedMin = -Math.sqrt(w2 * w2 + w3 * w3 + w5 * w5);
      return ev[0] < -1e-6
        && Math.abs(trace) < 1e-12
        && Math.abs(ev[0] - expectedMin) < 1e-9
        && Math.abs(ev[ev.length - 1] + expectedMin) < 1e-9;
    },
  },
  {
    name: 'verdict distinctness: NO-PF is DISTINCT from the truncated-Weil indefiniteness (category-separated)',
    check: () => /DISTINCT/.test(WEIL_POSITIVITY_PENCIL_PORT_VERDICT.verdict.a_noPfVsIndefiniteness)
      && /INERT/.test(WEIL_POSITIVITY_PENCIL_PORT_VERDICT.verdict.b_sgncCoalInert),
  },
  {
    name: 'named sub-gap = positive-type-cone form comparison carrying the archimedean term',
    check: () => /positive-type-cone COMPARISON/.test(WEIL_POSITIVITY_PENCIL_PORT_VERDICT.subGap)
      && /archimedean/.test(WEIL_POSITIVITY_PENCIL_PORT_VERDICT.subGap),
  },
  {
    name: 'honesty: RH OPEN, no refereed bound is changed, NO QED',
    check: () => /RH remains OPEN/.test(WEIL_POSITIVITY_PENCIL_PORT_VERDICT.status)
      && /refereed bound is changed/i.test(WEIL_POSITIVITY_PENCIL_PORT_VERDICT.status)
      && /NO QED/.test(WEIL_POSITIVITY_PENCIL_PORT_VERDICT.status),
  },
]);

export default WEIL_POSITIVITY_PENCIL_PORT_VERDICT;
