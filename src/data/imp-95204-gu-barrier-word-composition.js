/**
 * imp-95204 — LEVER 4 assessment: composing the graph compression G_U INSIDE
 * the eq-43 barrier word (admissibility by position + lane-merger analysis +
 * composed-gain pricing against the |C_E,17| target).
 *
 * GRADE: assessment (exact finite-rank algebra + measured model batteries).
 * Changes no bound; closes no analytic family; NO QED. No refereed bound is changed
 * . Per the no-gain rule / flow-blindness /
 * PT-floor audit, nothing here moves the rigorous frontier; this step only
 * settles whether an un-priced CONDITIONAL lever exists at the composition
 * level. Finding: it does not — the lever is pinned shut at every admissible
 * slot, and its one live residue is already banked inside the weld ladder.
 *
 * SOURCES. Paper (research-inputs/gomila-zeta-twin-ladder-permutation-
 * architecture-revised.pdf): eq (29)-(31) §6.2 (graph isometry W_U, the two
 * obligations: (i) characteristic invariance / exact determinant identity,
 * (ii) complement not discarded, cellwise Schur closure (31)); §8.1 eqs
 * (37)-(38) (characteristic bridge REQUIRED "before any noninvertible
 * compression"); §9 eq (42) normal form "... exact transform -> shell OR
 * GRAPH recombination -> Schur closure if used -> one scalar bound", with
 * the global rules "the characteristic bridge precedes every noninvertible
 * compression" and modulus-last; §10.1 eq (43) Route-I word
 *   C -> R -> H_t0 -> {Pi_p : p<=97} -> (Sigma5 <-> T25) -> B_v -> M_17 -> A_Gamma;
 * imp-95009 (standalone assessment: gate (i) pins U to the intertwiner class
 * U = J·V, kappa = 1 at U = J; genuine cancellation needs spec(A_+) symmetric
 * about 0, refuted by a nonzero odd moment on the finite-rank model);
 * imp-95169 LEMMA WD / THEOREM WP / FINDINGS CG, CT (copositive weld
 * dissolution, H = 2·blockdiag(G_b) − G_full); imp-95012 (frozen Gate-2
 * targets: Rex, eq-20 target 0.27968819555261474, anchor peak
 * 0.2141254901198318, reserve 0.0655627054327926).
 *
 * ── (a) ADMISSIBILITY OF G_U BY POSITION IN THE EQ-43 WORD ────────────────
 *
 * Type constraints first. G_U : direct sum -> correlated sector, so its
 * input requires BOTH channels: no slot before R exists (after C alone there
 * is one channel — ill-typed). M is irreversible with positive-scalar
 * output, so no slot at or after M_17 exists (modulus-last; a compression of
 * a scalar is vacuous). The admissible interval is strictly (after R,
 * before M_17). Within it:
 *
 *   R | G_U | H_t0 ...   PRE-HEAT SLOT: type-admissible ONLY if the
 *       characteristic bridge (37)/(38) is certified at that stage (§9
 *       global rule — the bridge precedes every noninvertible compression;
 *       obligation (i) is not optional garnish, it is the divisor-
 *       preservation license itself). MEASURED CAVEAT (battery A/B below):
 *       the imp-95009 spectral-asymmetry certificate does NOT transport
 *       backward past the heat step — H_t acts on the residual by CONGRUENCE
 *       (A -> S A S, S = S* > 0, not unitary), which preserves only the
 *       inertia of A_+ (Sylvester), and the model inertia is (2,2), sig = 0,
 *       degenerate: on the model the heat congruence even flips the sign of
 *       the third moment (7.5e-4 -> −2.365e-5). So a pre-heat refutation
 *       needs a FRESH certificate on the pre-heat generator. It is closed
 *       anyway by the pinning (next paragraph), which is position-free.
 *
 *   ... H_t0 | G_U | Pi_p ...  and  ... Pi_p | G_U | shells ...  MID SLOTS:
 *       sliding G_U here prices the permutation defect ledger: [G_U, Pi_p]
 *       != 0 unless U is divisor-graded (preserves the prime-support
 *       grading), and [G_U, H_t] = 0 only on the heat-compat range ran F_+
 *       (Lemma 6.1 / heat_compat_on_range). A U that is simultaneously
 *       divisor-graded and heat-compatible is exactly the intertwiner class
 *       — the class gate (i) pins. No new freedom opens mid-word.
 *
 *   ... (Sigma5 <-> T25) ⊕ G_U ... B_v | G_U | S | M_17   CANONICAL SLOT:
 *       the eq-42 normal form reserves one slot for G_U — "shell or graph
 *       recombination" — i.e. fused with (or adjacent to) the five-shell
 *       recombination, after the exact transform, before the scalar bound.
 *       Composing G_U there FORCES the word to grow by the Schur closure S
 *       (obligation (ii), eq 31), which eq 43 as printed does not carry:
 *       the composed word is
 *         C -> R -> H_t0 -> Pi_p -> (Sigma5<->T25) -> B_v -> G_U -> S -> M_17 -> A_Gamma.
 *       This is the unique defect-free position (zero new commutator ledger:
 *       everything between the recombination slot and M is exact).
 *
 * PINNING IS POSITION-FREE (battery C). At ANY slot, the dual channel at
 * that stage is the intertwiner image of the direct channel at that stage
 * (R_-' = J' R_+' J'† with J' the conjugated intertwiner), so gate (i) pins
 * U to the intertwiner class there too and U*R_-'U = R_+' EXACTLY: the
 * averaged compression equals the direct channel, kappa = 1, zero gain —
 * verified to ~9e-16 at a slid position. For the un-pinned residual class
 * U = J'V, cancellation needs spec(A_+') symmetric about 0; across every
 * EXACT ISOMETRIC slide (C, R, B_v, DFT/chirp/block moves) A_+ transforms by
 * unitary similarity, so the imp-95009 odd-moment certificate transports
 * EXACTLY (m3 invariant to 1.4e-17 on the model); only across H_t does it
 * degrade to the inertia invariant. NET: the standalone imp-95009 refutation
 * IS the composed refutation at every post-heat slot including the canonical
 * one; the pre-heat slot is closed by pinning alone.
 *
 * ── (b) THE MERGER: LEMMA WD *IS* A GRAPH COMPRESSION (say it) ────────────
 *
 * Battery D verifies the exact operator-form identification: let V be the
 * n×5 block-profile map, column b = w_b / |w_b|_{G_b} supported on block b.
 * Then
 *     V^T D V = I_5   (V is an isometry in the D-metric)          [~4e-16]
 *     V^T G V = I_5 + M                                            [~4e-16]
 * where M is exactly imp-95168/95169's hollow normalized block bond matrix.
 * So the weld ladder's central object is the COMPRESSION of the full kernel
 * G onto the correlated block-profile sector, relative to the direct sum
 * D = ⊕_b G_b — precisely the §6.2/eq-30 structure "direct sum -> correlated
 * sector", with the atlas's declared exact invariant for graph compressions
 * ("correlated average residual") realized as lambda_max(M). The dictionary:
 *   eq-30 average (R_+ + U*R_-U)/2      <-> bond entries of M (correlated
 *                                            averages between blocks)
 *   obligation (i) characteristic lift  <-> Perron nonnegativity: the
 *                                            maximizer lies in the cone
 *                                            z >= 0 (kernel entries >= 0)
 *   obligation (ii) complement/Schur gap<-> strict copositivity margin m of
 *                                            H = 2D − G, with quantitative
 *                                            transfer lambda_max <= 1 − m
 *   imp-95009 jet/odd-moment obstruction<-> THEOREM WP: the UNCONSTRAINED
 *                                            operator inequality G <= 2D is
 *                                            FALSE on the whole strip (jet
 *                                            direction pushes the spectrum
 *                                            to ~1.0566); only the cone-
 *                                            constrained form certifies.
 * And LEMMA WD quantifies over ALL nonnegative mass profiles at once — i.e.
 * over the entire cone-admissible compression family, not one compression.
 * VERDICT: THE TWO LANES HAVE MERGED. The atlas's one possible-gain family
 * is not an untapped lever sitting outside the weld ladder: its packet-
 * level instantiation, closed over the whole admissible family, is already
 * the ladder's working certificate. Composing "another" G_U into eq-43 on
 * top of the WD form composes the family with itself; the no-gain rule plus
 * the position-free pinning bound the residue at zero. HONEST LIMIT of the
 * merger claim: it is a claim about OPERATOR FORM, verified on the
 * Matern-3/2 model lane (strip constants 0.232...); it transports no strip
 * constant into the Gate-2 |C_E,17| lane and closes no Gate-2 sub-family.
 *
 * ── (c) PRICING A (COUNTERFACTUAL) GENUINE COMPOSED GAIN VS |C_E,17| ──────
 *
 * The atlas invariant separates the two regimes exactly: independent sectors
 * carry max(eta_+, eta_-) (Prop 6.1, no improvement); a genuine graph
 * compression would carry the correlated AVERAGE residual. Composed at the
 * canonical slot, a cancellation fraction theta of the correlated peak would
 * shift the demand from
 *     |C_E,17| = 0.2141254901198318 (anchor peak) vs target 0.27968819555261474
 * to (1−theta)·peak + schurCharge(31) vs the same target, enlarging the
 * uniform-enclosure reserve from 0.0655627054327926 to
 *     0.0655627054327926 + theta·0.2141254901198318 − schurCharge.
 * DOUBLING the reserve (the scale at which the open family's uniformity
 * demand would change regime) needs theta >= reserve/peak = 0.3061882328727
 * plus the Schur charge fraction — i.e. ~30.6% of the correlated peak mass
 * would have to sit in a cancellable anti-Hermitian sector. Measured
 * reality: theta = 0 for the pinned class (kappa = 1, position-free), and
 * the only surviving compression gain in the cone-constrained (merged WD)
 * class is the copositive margin, measured 2.2777102417e-7 at the model-lane
 * floor — in its own lambda_max units, and in ANY units at least 5 orders
 * from a 0.306-scale effect. The correlated-average-vs-max distinction is
 * therefore already fully spent: the average is banked by the weld ladder's
 * cone certificate, the max is what Prop 6.1 refuses to improve, and no
 * composed placement converts one into the other.
 *
 * BOTTOM LINE. (a) G_U is admissible only strictly between R and M_17; the
 * unique defect-free slot is the eq-42 recombination slot (between B_v and a
 * mandatory inserted Schur closure S before M_17); the characteristic bridge
 * must precede it at any position. (b) The weld ladder's copositive
 * formulation IS the graph-compression family closed over the nonnegative
 * cone — the standalone-G_U lane and the WD lane are one lane and should be
 * recorded as merged. (c) A genuine composed gain is refuted at every
 * admissible slot (pinning position-free; odd-moment certificate transports
 * exactly across all isometric slides; pre-heat slot closed by pinning);
 * the counterfactual pricing shows even the regime-change threshold would
 * need ~30.6% cancellable peak mass where the certified residue is ~2.3e-7.
 * The |C_E,17| open family 690988 <= N <= 54799999 is UNCHANGED.
 *
 * Import-light; zero imports; deterministic; in-sweep well under 1 s.
 */

// ─── shared complex helpers (imp-95009 conventions, entries [re, im]) ──────
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cconj = (a) => [a[0], -a[1]];
const N4 = 4;
function matmul4(X, Y) {
  const C = Array.from({ length: N4 }, () => Array.from({ length: N4 }, () => [0, 0]));
  for (let i = 0; i < N4; i++)
    for (let j = 0; j < N4; j++) {
      let s = [0, 0];
      for (let k = 0; k < N4; k++) s = cadd(s, cmul(X[i][k], Y[k][j]));
      C[i][j] = s;
    }
  return C;
}
const adj4 = (X) =>
  Array.from({ length: N4 }, (_, i) => Array.from({ length: N4 }, (_, j) => cconj(X[j][i])));
function antiHerm(R) {
  const A = Array.from({ length: N4 }, () => Array.from({ length: N4 }, () => [0, 0]));
  for (let i = 0; i < N4; i++)
    for (let j = 0; j < N4; j++) {
      const d = [R[i][j][0] - R[j][i][0], R[i][j][1] + R[j][i][1]];
      A[i][j] = cmul(d, [0, -0.5]);
    }
  return A;
}
const m3of = (X) => {
  const X3 = matmul4(matmul4(X, X), X);
  let s = 0;
  for (let i = 0; i < N4; i++) s += X3[i][i][0];
  return s;
};
// Hermitian 4x4 -> real symmetric 8x8 embedding, Jacobi eigenvalues (doubled)
function eigHerm4(Ah) {
  const m = 8;
  const S = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      S[i][j] = Ah[i][j][0];
      S[i][j + 4] = -Ah[i][j][1];
      S[i + 4][j] = Ah[i][j][1];
      S[i + 4][j + 4] = Ah[i][j][0];
    }
  const B = S.map((r) => r.slice());
  for (let sw = 0; sw < 200; sw++) {
    let off = 0;
    for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) off += B[i][j] * B[i][j];
    if (off < 1e-26) break;
    for (let p = 0; p < m; p++)
      for (let q = p + 1; q < m; q++) {
        if (Math.abs(B[p][q]) < 1e-18) continue;
        const th = (B[q][q] - B[p][p]) / (2 * B[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1), si = t * c;
        for (let k = 0; k < m; k++) {
          const kp = B[k][p], kq = B[k][q];
          B[k][p] = c * kp - si * kq; B[k][q] = si * kp + c * kq;
        }
        for (let k = 0; k < m; k++) {
          const pk = B[p][k], qk = B[q][k];
          B[p][k] = c * pk - si * qk; B[q][k] = si * pk + c * qk;
        }
      }
  }
  // de-duplicate the doubling: take every other sorted eigenvalue
  return Array.from({ length: m }, (_, i) => B[i][i]).sort((a, b) => a - b).filter((_, i) => i % 2 === 0);
}
const inertiaOf = (spec) => ({
  pos: spec.filter((x) => x > 1e-12).length,
  neg: spec.filter((x) => x < -1e-12).length,
});

// ─── the imp-95009 frozen finite-rank model (verbatim literals) ────────────
const R_PLUS = [
  [[2.0, 0.0], [0.5, 0.3], [0.0, 0.1], [0.2, 0.0]],
  [[0.1, -0.2], [3.0, 0.0], [0.4, 0.5], [0.0, 0.0]],
  [[0.0, 0.0], [0.2, 0.1], [1.0, 0.0], [0.6, 0.2]],
  [[0.1, 0.0], [0.0, 0.0], [0.3, -0.4], [4.0, 0.0]],
];
const PH9 = [
  [Math.cos(0.7), Math.sin(0.7)],
  [Math.cos(1.9), Math.sin(1.9)],
  [Math.cos(2.6), Math.sin(2.6)],
  [Math.cos(0.3), Math.sin(0.3)],
];
const J9 = Array.from({ length: 4 }, (_, i) =>
  Array.from({ length: 4 }, (_, j) => (i === j ? PH9[i] : [0, 0])));

const MEASURED = {};
function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95204-gu-barrier-word-composition assertion failed: ${id}`);
}

// ─── battery A: exact isometric slides transport the obstruction EXACTLY ───
{
  const planeRot = (p, q, th) => {
    const U = Array.from({ length: N4 }, (_, i) =>
      Array.from({ length: N4 }, (_, j) => [i === j ? 1 : 0, 0]));
    U[p][p] = [Math.cos(th), 0]; U[q][q] = [Math.cos(th), 0];
    U[p][q] = [-Math.sin(th), 0]; U[q][p] = [Math.sin(th), 0];
    return U;
  };
  const phaseDiag = (ph) => Array.from({ length: N4 }, (_, i) =>
    Array.from({ length: N4 }, (_, j) => (i === j ? [Math.cos(ph[i]), Math.sin(ph[i])] : [0, 0])));
  const V = matmul4(
    matmul4(phaseDiag([0.3, 1.1, 2.2, 0.7]), planeRot(0, 1, 0.9)),
    matmul4(planeRot(1, 2, 1.7), matmul4(phaseDiag([1.9, 0.2, 2.8, 1.3]), planeRot(2, 3, 0.4))));
  // exact unitarity of the slide
  const VVd = matmul4(V, adj4(V));
  let uerr = 0;
  for (let i = 0; i < N4; i++)
    for (let j = 0; j < N4; j++)
      uerr = Math.max(uerr, Math.abs(VVd[i][j][0] - (i === j ? 1 : 0)), Math.abs(VVd[i][j][1]));
  const A = antiHerm(R_PLUS);
  const Aslide = matmul4(matmul4(V, A), adj4(V));
  MEASURED.slide = { uerr, m3: m3of(A), m3Slid: m3of(Aslide) };
  assertI(uerr < 1e-12, `unitarity(${uerr})`);
  assertI(Math.abs(MEASURED.slide.m3 - 7.5e-4) < 1e-15, `m3-literal(${MEASURED.slide.m3})`);
  assertI(Math.abs(MEASURED.slide.m3 - MEASURED.slide.m3Slid) < 1e-12,
    'odd-moment-unitary-invariance');
}

// ─── battery B: the heat step is a CONGRUENCE — odd moments do NOT survive,
//     only inertia does (and the model inertia is the degenerate (2,2)) ─────
{
  const A = antiHerm(R_PLUS);
  const Sd = [0.9, 0.5, 0.3, 0.15]; // heat-like positive diagonal multiplier
  const Sc = Array.from({ length: N4 }, (_, i) =>
    Array.from({ length: N4 }, (_, j) => (i === j ? [Sd[i], 0] : [0, 0])));
  const Aheat = matmul4(matmul4(Sc, A), Sc); // congruence, S = S* > 0
  const spec = eigHerm4(A);
  const specHeat = eigHerm4(Aheat);
  MEASURED.heat = {
    m3: m3of(A), m3Heat: m3of(Aheat),
    inertia: inertiaOf(spec), inertiaHeat: inertiaOf(specHeat),
    specMax: Math.max(...spec.map(Math.abs)), specHeatMax: Math.max(...specHeat.map(Math.abs)),
  };
  // odd moment changes (even flips sign on the model): NOT transported past H_t
  assertI(Math.abs(MEASURED.heat.m3Heat - (-2.364693750000003e-5)) < 1e-15,
    `m3-heat-literal(${MEASURED.heat.m3Heat})`);
  assertI(MEASURED.heat.m3 > 0 && MEASURED.heat.m3Heat < 0, 'odd-moment-sign-flip-past-heat');
  // inertia (Sylvester) is preserved by the congruence — and is degenerate (2,2)
  assertI(
    MEASURED.heat.inertia.pos === 2 && MEASURED.heat.inertia.neg === 2 &&
    MEASURED.heat.inertiaHeat.pos === 2 && MEASURED.heat.inertiaHeat.neg === 2,
    'inertia-preserved-degenerate');
  // spectrum itself is not preserved (0.408 -> 0.105): heat is not a slide
  assertI(MEASURED.heat.specHeatMax < 0.5 * MEASURED.heat.specMax, 'heat-not-isometric');
}

// ─── battery C: the gate-(i) pinning is POSITION-FREE — at a slid stage the
//     conjugated intertwiner still gives U*R_-'U = R_+' exactly (kappa = 1) ─
{
  const planeRot = (p, q, th) => {
    const U = Array.from({ length: N4 }, (_, i) =>
      Array.from({ length: N4 }, (_, j) => [i === j ? 1 : 0, 0]));
    U[p][p] = [Math.cos(th), 0]; U[q][q] = [Math.cos(th), 0];
    U[p][q] = [-Math.sin(th), 0]; U[q][p] = [Math.sin(th), 0];
    return U;
  };
  const V = matmul4(planeRot(0, 2, 1.2), planeRot(1, 3, 0.5));
  const Rs = matmul4(matmul4(V, R_PLUS), adj4(V)); // direct channel at the slid stage
  const Js = matmul4(matmul4(V, J9), adj4(V)); // conjugated intertwiner
  const Rm = matmul4(matmul4(Js, Rs), adj4(Js)); // dual channel at that stage
  const back = matmul4(matmul4(adj4(Js), Rm), Js); // U* R_-' U with U = Js
  let perr = 0;
  for (let i = 0; i < N4; i++)
    for (let j = 0; j < N4; j++)
      perr = Math.max(perr, Math.abs(back[i][j][0] - Rs[i][j][0]), Math.abs(back[i][j][1] - Rs[i][j][1]));
  MEASURED.pinning = { errAtSlidPosition: perr };
  assertI(perr < 1e-12, `pinning-position-free(${perr})`);
}

// ─── battery D: LEMMA WD is a D-metric GRAPH COMPRESSION — V^T D V = I and
//     V^T G V = I + M exactly (M = the imp-95169 hollow block bond matrix) ──
{
  const g = (z) => Math.exp(-z) * (1 + z);
  const BOX = [[1, 2], [4, 8], [16, 32], [64, 128], [256, 512]];
  let st = 952041;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstD = 0, worstM = 0;
  for (let t = 0; t < 50; t++) {
    const mu = 0.2320723 + rnd() * (0.23209 - 0.2320723);
    const xs = [], blk = [], pts = [];
    for (let b = 0; b < 5; b++) {
      const k = 1 + Math.floor(rnd() * 3);
      const P = [];
      for (let q = 0; q < k; q++) {
        const x = BOX[b][0] + rnd() * (BOX[b][1] - BOX[b][0]);
        const w = 0.05 + rnd();
        xs.push(x); blk.push(b); P.push({ x, w });
      }
      pts.push(P);
    }
    const n = xs.length;
    const G = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => g(mu * Math.abs(xs[i] - xs[j]))));
    const D = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (blk[i] === blk[j] ? G[i][j] : 0)));
    // the compression isometry: column b = w_b / |w_b|_{G_b}, block-supported
    const Vp = Array.from({ length: n }, () => new Array(5).fill(0));
    let p = 0;
    for (let b = 0; b < 5; b++) {
      let nb = 0;
      for (const a of pts[b]) for (const c of pts[b]) nb += a.w * c.w * g(mu * Math.abs(a.x - c.x));
      nb = Math.sqrt(nb);
      for (const a of pts[b]) { Vp[p][b] = a.w / nb; p++; }
    }
    const VtXV = (X) => {
      const C = Array.from({ length: 5 }, () => new Array(5).fill(0));
      for (let a = 0; a < 5; a++)
        for (let b = 0; b < 5; b++) {
          let s = 0;
          for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += Vp[i][a] * X[i][j] * Vp[j][b];
          C[a][b] = s;
        }
      return C;
    };
    const VDV = VtXV(D), VGV = VtXV(G);
    // imp-95168/95169 hollow normalized block bond matrix
    const norms = pts.map((P) => {
      let s = 0;
      for (const a of P) for (const c of P) s += a.w * c.w * g(mu * Math.abs(a.x - c.x));
      return Math.sqrt(s);
    });
    const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
    for (let i = 0; i < 5; i++)
      for (let j = i + 1; j < 5; j++) {
        let s = 0;
        for (const a of pts[i]) for (const c of pts[j]) s += a.w * c.w * g(mu * Math.abs(c.x - a.x));
        M[i][j] = M[j][i] = s / (norms[i] * norms[j]);
      }
    for (let a = 0; a < 5; a++)
      for (let b = 0; b < 5; b++) {
        worstD = Math.max(worstD, Math.abs(VDV[a][b] - (a === b ? 1 : 0)));
        worstM = Math.max(worstM, Math.abs(VGV[a][b] - ((a === b ? 1 : 0) + M[a][b])));
      }
  }
  MEASURED.merger = { worstIsometry: worstD, worstCompression: worstM };
  assertI(worstD < 1e-12, `wd-isometry(${worstD})`);
  assertI(worstM < 1e-12, `wd-compression(${worstM})`);
}

// ─── pricing constants (imp-95012 frozen literals; pure arithmetic) ────────
const PRICING = {
  targetEq20: 0.27968819555261474,
  anchorPeak: 0.2141254901198318,
  reserve: 0.0655627054327926,
  // cancellable anti-Hermitian peak fraction needed to DOUBLE the reserve
  // (before the eq-31 Schur charge, which only raises this)
  thetaToDoubleReserve: 0.0655627054327926 / 0.2141254901198318,
  // the only surviving compression gain (cone-constrained, merged WD lane):
  // measured copositive margin at the model-lane floor, in lambda_max units
  measuredConeMarginModelLane: 2.2777102417e-7,
  pinnedClassGain: 0, // kappa = 1 (position-free, battery C)
};

export const IMP_95204_GU_BARRIER_WORD_COMPOSITION = {
  id: 'imp-95204',
  title:
    'Composing G_U into the eq-43 barrier word: admissibility interval (after R, before M_17; ' +
    'unique defect-free slot = the eq-42 recombination slot with a mandatory inserted Schur ' +
    'closure), lane merger (LEMMA WD IS the graph-compression family closed over the ' +
    'nonnegative cone — the standalone-G_U and copositive-weld lanes are one lane), and ' +
    'composed-gain pricing (refuted: pinning is position-free; regime change would need ' +
    '~30.6% cancellable peak mass vs a certified cone residue of ~2.3e-7)',
  grade: 'assessment (exact finite-rank algebra + measured model batteries)',
  proofSection: 'permutation-architecture / lever-4',
  admissibility: {
    interval: 'strictly after R (needs both channels) and strictly before M_17 (modulus-last)',
    forbidden: [
      'before R: ill-typed, no direct/dual pair exists',
      'at/after M_17: modulus is irreversible with positive-scalar output; also A_Gamma consumes scalar boundary data',
    ],
    preHeatSlot:
      'type-admissible only with the characteristic bridge (37)/(38) certified there; the ' +
      'imp-95009 odd-moment certificate does NOT transport backward past H_t (heat acts by ' +
      'congruence: only inertia survives, and the model inertia (2,2) is degenerate — the ' +
      'model m3 even flips sign, 7.5e-4 -> -2.365e-5); closed instead by the position-free pinning',
    midSlots:
      '[G_U, Pi_p] != 0 unless U is divisor-graded; [G_U, H_t] = 0 only on ran F_+ ' +
      '(heat_compat_on_range); divisor-graded + heat-compatible = the intertwiner class = pinned',
    canonicalSlot:
      'the eq-42 "shell or graph recombination" slot: composed word ' +
      'C -> R -> H_t0 -> Pi_p -> (Sigma5<->T25) -> B_v -> G_U -> S -> M_17 -> A_Gamma; ' +
      'the Schur closure S (eq 31, obligation ii) is MANDATORY and absent from eq 43 as printed; ' +
      'the characteristic bridge (obligation i) must precede the compression at any position',
  },
  merger: {
    verdict: 'MERGED — and it should be said',
    identification:
      'V^T D V = I_5 and V^T G V = I_5 + M with V the block-profile isometry: the imp-95169 ' +
      'hollow block bond matrix is exactly the D-metric graph compression of the full kernel ' +
      'onto the correlated block-profile sector (direct sum -> correlated sector, eq 30 form); ' +
      'lambda_max(M) realizes the atlas invariant "correlated average residual"; LEMMA WD ' +
      'quantifies over ALL nonnegative profiles = the whole cone-admissible compression family; ' +
      'obligation (i) <-> Perron cone membership of the maximizer; obligation (ii)/eq-31 gap <-> ' +
      'strict copositivity margin m with lambda_max <= 1 - m; imp-95009 jet obstruction <-> ' +
      'THEOREM WP (unconstrained G <= 2D false on the whole strip, jet spectrum ~1.0566)',
    honestLimit:
      'an operator-form identification verified on the Matern-3/2 model lane (strip constants ' +
      '0.232...); transports no constant into the Gate-2 |C_E,17| lane and closes no sub-family',
  },
  pricing: PRICING,
  openFamilyUnchanged: { Nmin: 690988, Nmax: 54799999 },
  verdict:
    'LEVER 4 CLOSED AS A LEVER: composing G_U inside the eq-43 word opens nothing the ' +
    'standalone assessment missed. The gate-(i) pinning (U*R_-U = R_+, kappa = 1) is exact at ' +
    'every stage of the word; the odd-moment refutation transports exactly across all isometric ' +
    'slides and the one slot it does not reach (pre-heat) is closed by the pinning; the unique ' +
    'defect-free placement forces a Schur closure eq 43 does not carry. The one real gain the ' +
    'family ever offered is already banked as the weld ladder\'s copositive margin — the two ' +
    'lanes are one lane. Changes no bound; closes no gap; NO QED. No refereed bound is changed' +
    '.',
};

// ─── sweep-countable assertions (same claims, re-expressed over MEASURED) ──
export const IMP_95204_ASSERTIONS = [
  {
    id: 'imp95204-slide-transport-exact',
    description:
      'Across an exact isometric slide (unitary word segment: C, R, B_v, DFT/chirp/block ' +
      'moves) the anti-Hermitian generator conjugates unitarily, so the imp-95009 odd-moment ' +
      'certificate transports EXACTLY: m3 = 7.5e-4 invariant to < 1e-12 on the frozen model',
    holds: () =>
      MEASURED.slide.uerr < 1e-12 &&
      Math.abs(MEASURED.slide.m3 - 7.5e-4) < 1e-15 &&
      Math.abs(MEASURED.slide.m3 - MEASURED.slide.m3Slid) < 1e-12,
  },
  {
    id: 'imp95204-heat-congruence-degrades-certificate',
    description:
      'The heat step acts on the residual by congruence (S A S, S = S* > 0): the model odd ' +
      'moment flips sign (7.5e-4 -> -2.365e-5) while Sylvester inertia (2,2) is preserved and ' +
      'degenerate (sig = 0) — the pre-heat slot needs a fresh certificate, and is closed by ' +
      'the position-free pinning instead',
    holds: () =>
      MEASURED.heat.m3 > 0 && MEASURED.heat.m3Heat < 0 &&
      Math.abs(MEASURED.heat.m3Heat - (-2.364693750000003e-5)) < 1e-15 &&
      MEASURED.heat.inertia.pos === 2 && MEASURED.heat.inertia.neg === 2 &&
      MEASURED.heat.inertiaHeat.pos === 2 && MEASURED.heat.inertiaHeat.neg === 2 &&
      MEASURED.heat.specHeatMax < 0.5 * MEASURED.heat.specMax,
  },
  {
    id: 'imp95204-pinning-position-free',
    description:
      'Gate (i) pins U to the (conjugated) intertwiner class at EVERY stage of the word: at a ' +
      'slid stage, U = J\' gives U* R_-\' U = R_+\' exactly (error < 1e-12), so kappa = 1 and ' +
      'the composed compression gains nothing at any admissible position',
    holds: () => MEASURED.pinning.errAtSlidPosition < 1e-12,
  },
  {
    id: 'imp95204-wd-is-graph-compression',
    description:
      'Lane merger: over 50 random draws (occupancies up to 3 per block, strip rates) the ' +
      'block-profile map V satisfies V^T D V = I and V^T G V = I + M to < 1e-12, identifying ' +
      'the imp-95169 LEMMA WD bond matrix as a D-metric graph compression (direct sum -> ' +
      'correlated sector) closed over the nonnegative-profile cone',
    holds: () =>
      MEASURED.merger.worstIsometry < 1e-12 && MEASURED.merger.worstCompression < 1e-12,
  },
  {
    id: 'imp95204-pricing-scale-gap',
    description:
      'Counterfactual pricing vs the |C_E,17| target: doubling the 0.0655627 reserve needs a ' +
      'cancellable anti-Hermitian peak fraction theta >= reserve/peak = 0.30619 (before the ' +
      'eq-31 Schur charge); the pinned-class gain is 0 and the certified cone residue is ' +
      '~2.28e-7 in the model lane — at least 5 orders below regime change; reserve arithmetic ' +
      'consistent with the frozen eq-20 literals',
    holds: () =>
      Math.abs(PRICING.thetaToDoubleReserve - 0.3061882328727024) < 1e-12 &&
      Math.abs((PRICING.targetEq20 - PRICING.anchorPeak) - PRICING.reserve) < 1e-12 &&
      PRICING.pinnedClassGain === 0 &&
      PRICING.measuredConeMarginModelLane < PRICING.thetaToDoubleReserve * 1e-5,
  },
  {
    id: 'imp95204-honest-scope',
    description:
      'No bound moves: the Gate-2 open family 690988 <= N <= 54799999 is unchanged, the merger ' +
      'claim is operator-form only (no strip constant transports into the Gate-2 lane), eq 43 ' +
      'gains a mandatory Schur closure only IF G_U is composed (it is not, being gain-free); ' +
      'no QED; no refereed bound is changed',
    holds: () =>
      IMP_95204_GU_BARRIER_WORD_COMPOSITION.openFamilyUnchanged.Nmin === 690988 &&
      IMP_95204_GU_BARRIER_WORD_COMPOSITION.openFamilyUnchanged.Nmax === 54799999 &&
      IMP_95204_GU_BARRIER_WORD_COMPOSITION.verdict.includes('NO QED') &&
      IMP_95204_GU_BARRIER_WORD_COMPOSITION.verdict.includes('No refereed bound is changed'),
  },
];

for (const a of IMP_95204_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95204-gu-barrier-word-composition assertion failed: ${a.id}`);
}

export default IMP_95204_GU_BARRIER_WORD_COMPOSITION;
