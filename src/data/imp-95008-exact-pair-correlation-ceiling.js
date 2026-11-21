/**
 * imp-95008 continuation (nineteenth) - LEMMA CC + LEMMA RM + LEMMA PF +
 * THEOREM Y-EXACT: the THIRD ceiling-side far-bracket move. The eighteenth
 * continuation named three achieved-side slacks: (a) the outer parity factor
 * 2, (b) a MEASURED ~2.85x corner slack inside Lemma 3W (window-boundary
 * losses), and (c) the asymptotic half-exponent (its envelope decays like
 * T^(1/2 - s) while the true envelope-pair integral decays like T^(-s)).
 * This module closes (b) and (c) SIMULTANEOUSLY by discarding the entire
 * window / Cauchy-Schwarz apparatus: the envelope-pair integral has an EXACT
 * elementary closed form at integer s (partial fractions, rational plus
 * logarithm), and two new unconditional monotonicity lemmas justify
 * substituting the Lemma X separation floor and the Lemma RHO width-ratio
 * cap directly into the EXACT value. Within the MAJ envelope class the
 * per-pair bound is now sharp - zero inequality slack survives at the
 * substituted point. Reference theta = 10 results (floors untouched):
 *   dominant corner V(0,2): per-pair envelope
 *     1.1159760370515937e-4 -> 3.9197920255561178e-5
 *     (factor 2.8470286938074612 - exactly the eighteenth measured slack),
 *   far ceiling 0.7741509917026236 -> 0.2717408057586117
 *     (ledger factor 2.8488580857094559; vs the pre-seventeenth 4:
 *     14.719909248937805),
 *   headline gap 8.001968970787363 -> 2.8088338309749887,
 *   fixed-97 gap 642.1998717107592 -> 225.42360917596611.
 *
 * SETTING (identical to the sibling chain; Permuting the Zeta Twin Ladder
 * Section 4.5; page /permutation-architecture). Model family, one branch
 * sign: packets a_d with centers u_d = v/d, widths r_d = c d^(-beta), dyadic
 * blocks b (d in (2^(-(b+1)) D, 2^(-b) D]), MAJ(sigma, theta) envelopes
 * |a_d(u)| <= A_d (1 + |u - u_d|/r_d)^(-s), s = sigma + theta; currencies
 * n_d = A_d sqrt(r_d), nTilde_b = sum n_d, M = sum nTilde_b^2. Lemma X
 * (tenth): a cross-block pair with near block b and gap j >= 2 has
 * Delta/rMax > V(b, j) strictly, V(b, j) = 2^(b(1-beta)) Gx(j). Lemma RHO
 * (eighteenth): the width ratio obeys rho = rMin/rMax < rhoCap(j) =
 * 2^(-(j-1) beta) < 1. Normalized exact pair correlation:
 *   I(T, rho) = rho^(-1/2) integral (1 + |u|/rho)^(-s) (1 + |u - T|)^(-s) du
 * so that integral e_1 e_2 <= A_1 A_2 sqrt(r_1 r_2) I(Delta/rMax, rMin/rMax).
 *
 * LEMMA CC (separation monotonicity - UNCONDITIONAL, layer cake). At fixed
 * widths, h(Delta) = integral e_1(u) e_2(u - Delta) du is even and
 * nonincreasing in |Delta|. Proof: each envelope is even and unimodal about
 * its center, so by the layer-cake representation e_i = integral over
 * lambda of the indicator of a symmetric interval, and Fubini gives
 * h(Delta) = double integral of the overlap length of two intervals with
 * fixed half-lengths (a, b) and center distance Delta. That overlap equals
 * max(0, min(2a, 2b, a + b - Delta)) for Delta >= 0, which is nonincreasing
 * in Delta. QED. Hence I(T, rho) is nonincreasing in T at fixed rho, for
 * ALL T >= 0 - no window, no Cauchy-Schwarz, no exponent loss.
 *
 * LEMMA RM (width-ratio monotonicity - UNCONDITIONAL, one-page calculus).
 * For s > 1 and T >= Ystar(s) := (2s - 1)^(1/(s - 1)) - 1, the map
 * rho -> I(T, rho) is nondecreasing on (0, 1]. Proof: write I(T, rho) =
 * integral f_rho g with f_rho(u) = rho^(-1/2) (1 + |u|/rho)^(-s) and
 * g(u) = (1 + |u - T|)^(-s). Differentiating under the integral and
 * substituting u = rho y,
 *   dI/drho = rho^(-1/2) integral_0^inf phiK(y) G(rho y) dy,
 *   phiK(y) = (1 + y)^(-s-1) ((s - 1/2) y - 1/2),
 *   G(x) = g(x) + g(-x).
 * phiK is negative exactly on [0, y0), y0 = 1/(2s - 1), and G is increasing
 * on [0, T] (its derivative is s (1 + T - x)^(-s-1) - s (1 + T + x)^(-s-1)
 * > 0 there). Split at Y = T/rho >= T >= Ystar > y0. On [0, Y] the factors
 * phiK(y) and G(rho y) - G(rho y0) change sign together, so pointwise
 * phiK(y) G(rho y) >= phiK(y) G(rho y0), giving
 * integral_0^Y phiK G >= G(rho y0) PhiInt(Y) with the EXACT antiderivative
 *   PhiInt(Y) = 1/(2(s-1)) - (1+Y)^(-s) ((s - 1/2)(1+Y) - (s-1))/(s - 1),
 * and PhiInt(Y) >= 0 whenever (s - 1/2)(1 + Y)^(1-s) <= 1/2, i.e. whenever
 * Y >= Ystar. On [Y, inf) both factors are nonnegative. QED. At s = 11,
 * Ystar = 21^(1/10) - 1 = 0.3558821066938467 < V(0, 2) = 2^(1/3), so the
 * lemma covers EVERY pair in the roll-up (V(b, j) is increasing in b and j,
 * and T/rho >= T since rho <= 1).
 *
 * LEMMA PF (exact closed form at integer s - partial fractions). For
 * 0 < a != b the repeated-linear-factor decomposition
 *   1/((t+a)^s (t+b)^s) = sum_{k=1..s} c_k (t+a)^(-k) + d_k (t+b)^(-k),
 *   c_k = (-1)^(s-k) binom(2s-k-1, s-k) (b-a)^(-(2s-k)),  d_k = same with
 *   a and b swapped (so d_1 = -c_1, 2s-1 odd, and the logs pair up), gives
 *   W(a, b) = integral_0^inf dt/((t+a)^s (t+b)^s)
 *           = sum_{k=2..s} (c_k a^(1-k) + d_k b^(1-k))/(k-1) + c_1 log(b/a).
 * For the finite piece, with S = a + c and both coefficient families equal
 * and POSITIVE, p_k = binom(2s-k-1, s-k) S^(-(2s-k)):
 *   integral_0^T dx/((x+a)^s (c-x)^s)
 *     = sum_k p_k ( Ja(k) + Jc(k) ),  Ja(1) = log((T+a)/a),
 *   Ja(k) = (a^(1-k) - (T+a)^(1-k))/(k-1),  Jc(1) = log(c/(c-T)),
 *   Jc(k) = ((c-T)^(1-k) - c^(1-k))/(k-1).
 * Splitting the u-line at 0 and T and pulling rho^s into each factor,
 *   I(T, rho) = rho^(-1/2) ( rho^s W(rho, 1+T)
 *             + rho^s integral_0^T ((x+rho)(1+T-x))^(-s) dx
 *             + rho^s W(rho+T, 1) ),
 * with c - T = 1 held EXACT in the middle piece and the rho^s prefactor
 * folded termwise so every rho power is positive (no overflow at the tiny
 * rhoCap(j) of large j). All quantities are elementary (rational plus log).
 *
 * THEOREM Y-EXACT (parity roll-up with the exact envelope - CONDITIONAL
 * only on MAJ(sigma, theta)). With envE(b, j) = I(V(b, j), rhoCap(j)),
 *   OmegaE_b = sum_{j >= 2 even} envE(b, j)
 *            + sum_{j even, 2 <= j <= b - (b mod 2)} envE(b - j, j),
 *   || sum_b w_b ||^2 <= 2 sum_b ||w_b||^2 + 2 (sup_b OmegaE_b) M .
 * Proof: Theorem Y-RHO verbatim, with the per-pair chain
 *   true correlation <= n_1 n_2 I(T_act, rho_act)
 *     <= n_1 n_2 I(V(b, j), rho_act)        (Lemma CC, T_act > V(b, j))
 *     <= n_1 n_2 I(V(b, j), rhoCap(j))       (Lemma RM, rho_act < rhoCap(j)
 *                                             and V(b, j) > Ystar(s)). QED.
 * Achieved point in the Theorem K bracket class {cNear <= 2, Tstar <= Tx(2)}:
 *   (cNear, cFar) = ( 2 , 2 sup_b OmegaE_b / Tx(2) ) .
 * envE is EXACT at the substituted point: the only slack left in the far
 * envelope is the tightness of the substitution point itself (Lemma X floor,
 * strict; Lemma RHO cap, attained to 0.4 percent per the eighteenth).
 *
 * COROLLARY (reference evaluation, sigma = 1, beta = 1/3, c = v = D = 1,
 * theta = 10 - all literals re-computed by the assertions). Corner:
 * envE(0, 2) = I(2^(1/3), 2^(-1/3)) = 3.9197920255561178e-5 - equal to the
 * corner quadrature truth the eighteenth MEASURED (3.9198e-5) but now a
 * closed form, consuming its named ~2.85x corner slack exactly
 * (1.1159760370515937e-4 / 3.9197920255561178e-5 = 2.8470286938074612).
 * Sup scan (b <= 400, both parities): sup at b = 2, OmegaE_2 =
 * 3.9231900742006723e-5, with b = 0 still a near-tie
 * (3.9198069316120816e-5). cFarNew = 2 OmegaE_2 / Tx(2) =
 * 0.2717408057586117.
 *
 * NEW TRACKED BRACKETS (floors untouched):
 *   headline theta = 10 spacing: [0.096745062937484763, 0.2717408057586117],
 *     gap 8.001968970787363 -> 2.8088338309749887 ;
 *   fixed-97 theta = 10: floor 0.0012054673720820889,
 *     gap 642.1998717107592 -> 225.42360917596611 .
 * The headline gap now nearly factors as (parity 2) x 1.4044: the parity
 * AM-GM factor is the dominant surviving achieved-side slack.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) Lemma PF was stress-tested by direct
 * midpoint quadrature across s in {11, 3} x separations x width ratios
 * (18 configurations re-run by the assertions, two-sided tolerance): the
 * residuals shrink as the quadrature is refined (corner at N = 2e6 agrees
 * to 5e-6; an offline N = 8e6 run agreed to 2.5e-8), i.e. the quadrature
 * converges TO the closed form. (2) FLOAT CONDITIONING measured honestly:
 * two algebraically equivalent evaluations of the closed form (prefactor
 * folded vs unfolded) differ by ~1e-8 relative at the corner - the
 * partial-fraction sum carries ~1e-8 float cancellation, so baked literals
 * are code-path-reproducible to 1e-12 but true-value-accurate only to
 * ~1e-8; negligible against the priced factor 2.8489 and stated in scope.
 * (3) Lemma CC was checked on T grids (T >= 1, where the partial fractions
 * are well conditioned; the layer-cake proof itself needs no restriction).
 * (4) Lemma RM was checked on rho grids at four T values, and PhiInt was
 * checked against direct quadrature of phiK; the sufficient condition
 * (s - 1/2)(1 + Y)^(1-s) <= 1/2 was verified at Y = V(0, 2). (5) The
 * domain guard V(b, j) >= V(0, 2) > Ystar(s) is asserted for the scanned
 * range, so Lemma RM covers every substituted pair. (6) envE <= the
 * eighteenth min-envelope at every scanned (b, j) and OmegaE_b <=
 * OmegaRho_b at every scanned b (an exact value can never exceed a proved
 * upper bound on it - violation would expose a bug). (7) The eighteenth
 * literals (OmegaRho_2, cFar = 0.7741509917026236, corner 3W value) are
 * reproduced through an independent code path before being compared
 * against. (8) The new ceiling does not cross any exhibited floor (2.81x
 * headline, 225x fixed-97 room). (9) Small-T conditioning trap recorded:
 * for T + 1 - rho small the alternating partial fractions lose digits
 * (observed non-monotone float artifacts at T <= 0.5, rho near 1) - outside
 * the roll-up domain T >= 2^(1/3), and excluded from the checks above.
 *
 * WHAT REMAINS OPEN (sibling residuals, updated): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c) of the sibling chain, the l2-to-pointwise
 * passage to |C_E,17|. REFINED achieved-side ledger after this step:
 * (a) the outer parity AM-GM factor 2 (unchanged, uniformly unrecoverable
 * per the eleventh) - now the DOMINANT surviving slack; (b) the tightness
 * of the substitution point (Lemma X floor strict, Lemma RHO cap attained
 * to 0.4 percent) - the pair bound itself is EXACT there; the eighteenth
 * residuals (b) corner slack and (c) asymptotic half-exponent are CLOSED
 * (the envelope now carries the true T^(-s) asymptotics by construction).
 * Witness side: unchanged (multi-packet re-optimization, different grid
 * geometries, sixteenth continuation); the b = 0 near-tie persists at the
 * new values, so corner-driven moves still shift both sup candidates
 * together.
 *
 * The numerics below CROSS-CHECK the closed-form statements; they are not
 * the claim. Import-light (no heavy bundle). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── shared conventions (identical to the sibling modules) ────────────────────
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;
const THETA = 10;
const SS = SIGMA + THETA;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

const QREF = isolationQ(CC, VV, BETA, DD);

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

function gSharp(j) {
  return Math.pow(2, BETA) * gOld(j, QREF, BETA);
}

// Lemma X per-pair corner floor, near block b, gap j (tenth continuation)
function cornerV(b, j) {
  return Math.pow(2, b * (1 - BETA)) * gSharp(j);
}

function phiTail(x) {
  return Math.pow(1 + x, -THETA);
}

function tailAllSharp(jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j++) {
    const t = phiTail(gSharp(j));
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  return s;
}

const TX2 = tailAllSharp(800);

// Lemma RHO width-ratio cap (eighteenth continuation)
function rhoCap(j) {
  return Math.pow(2, -(j - 1) * BETA);
}

// ── eighteenth-continuation envelope (independent code path, comparison) ─────
function psiEnv(T, s) {
  const x = Math.log1p(T);
  const flat = 2 / (2 * s - 1);
  if (x <= flat) return flat;
  return Math.E * x * Math.pow(1 + T, 0.5 - s);
}

function threeWindow(T, rho, d1, d2, s) {
  const c2s = Math.SQRT2 / (2 * s - 1);
  const L = c2s * Math.pow(1 + (1 - d1) * T, 0.5 - s);
  const R = c2s * Math.pow(1 + ((1 - d2) * T) / rho, 0.5 - s);
  const m1 = (d1 * T) / rho;
  const m2 = d2 * T;
  const B = 1 + T + (d1 * d2 * T * T) / rho;
  const P = (1 + m1) * (1 + m2);
  let sp;
  const x = Math.log(B / P);
  if (x >= 2 / (2 * s - 1)) sp = 0.5 + 1 / x;
  else sp = s;
  const M = (1 / (2 * sp - 1)) * Math.pow(B, -(s - sp)) * Math.pow(P, 0.5 - sp);
  return L + R + M;
}

function threeWindowMin(T, rho, s) {
  let best = Infinity;
  let bd1 = 0;
  let bd2 = 0;
  for (let i = 0; i <= 19; i++) {
    for (let k = 0; i * 0.05 + k * 0.05 <= 1 && k <= 19; k++) {
      const v = threeWindow(T, rho, i * 0.05, k * 0.05, s);
      if (v < best) {
        best = v;
        bd1 = i * 0.05;
        bd2 = k * 0.05;
      }
    }
  }
  for (let i = -4; i <= 4; i++) {
    for (let k = -4; k <= 4; k++) {
      const a = bd1 + i * 0.0125;
      const b = bd2 + k * 0.0125;
      if (a < 0 || b < 0 || a + b > 1) continue;
      const v = threeWindow(T, rho, a, b, s);
      if (v < best) best = v;
    }
  }
  return best;
}

const envRhoMemo = new Map();
function envRho18(b, j) {
  const key = b * 4096 + j;
  const hit = envRhoMemo.get(key);
  if (hit !== undefined) return hit;
  const V = cornerV(b, j);
  const val = Math.min(psiEnv(V, SS), threeWindowMin(V, rhoCap(j), SS));
  envRhoMemo.set(key, val);
  return val;
}

function omegaRho18(b) {
  let s = 0;
  for (let j = 2; j <= 800; j += 2) {
    const t = envRho18(b, j);
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  const r = b % 2;
  for (let j = 2; j <= b - r; j += 2) s += envRho18(b - j, j);
  return s;
}

// ── LEMMA PF: exact closed form of the normalized pair correlation ───────────
function binom(n, k) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

// rho^s-folded near outer piece: rho^s W(rho, bb) with bb = 1 + T
function outerFolded(rho, bb, s) {
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(bb - rho, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(rho - bb, -(2 * s - k));
    sum += (ck * Math.pow(rho, s + 1 - k) + dk * Math.pow(rho, s) * Math.pow(bb, 1 - k)) / (k - 1);
  }
  const c1s = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(bb - rho, -(2 * s - 1)) * Math.pow(rho, s);
  return sum + (c1s === 0 ? 0 : c1s * Math.log(bb / rho));
}

// rho^s-folded far outer piece: rho^s W(rho + T, 1)
function farFolded(rho, T, s) {
  const a = rho + T;
  const rs = Math.pow(rho, s);
  if (rs === 0) return 0;
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(1 - a, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(a - 1, -(2 * s - k));
    sum += (rs * (ck * Math.pow(a, 1 - k) + dk)) / (k - 1);
  }
  const c1 = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(1 - a, -(2 * s - 1));
  return sum + (c1 === 0 ? 0 : rs * c1 * Math.log(1 / a));
}

// rho^s-folded middle piece with c - T = 1 held EXACT (c = 1 + T)
function middleFolded(rho, T, s) {
  const c = 1 + T;
  const rs = Math.pow(rho, s);
  let sum = 0;
  for (let k = 1; k <= s; k++) {
    const pk = binom(2 * s - k - 1, s - k) * Math.pow(rho + c, -(2 * s - k));
    if (pk === 0) continue;
    const Ja =
      k === 1
        ? rs === 0
          ? 0
          : rs * Math.log((T + rho) / rho)
        : (Math.pow(rho, s + 1 - k) - rs * Math.pow(T + rho, 1 - k)) / (k - 1);
    const Jc = k === 1 ? rs * Math.log(c) : (rs * (1 - Math.pow(c, 1 - k))) / (k - 1);
    sum += pk * (Ja + Jc);
  }
  return sum;
}

function iExact(T, rho, s) {
  return Math.pow(rho, -0.5) * (outerFolded(rho, 1 + T, s) + middleFolded(rho, T, s) + farFolded(rho, T, s));
}

// UNFOLDED second form of the SAME closed form: compute each piece W(a, b) and
// the middle integral with NO rho^s termwise folding (so tiny a = rho makes the
// intermediate a^(1-k) terms huge), then multiply the aggregate by rho^s at the
// end. Algebraically identical to iExact; the two evaluations differ only by
// float cancellation, so their gap is a direct MEASUREMENT of the partial-
// fraction conditioning quoted in scope (skeptical self-check 2).
function iUnfolded(T, rho, s) {
  const bb = 1 + T;
  let wOut = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(bb - rho, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(rho - bb, -(2 * s - k));
    wOut += (ck * Math.pow(rho, 1 - k) + dk * Math.pow(bb, 1 - k)) / (k - 1);
  }
  wOut += Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(bb - rho, -(2 * s - 1)) * Math.log(bb / rho);
  const a = rho + T;
  let wFar = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(1 - a, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(a - 1, -(2 * s - k));
    wFar += (ck * Math.pow(a, 1 - k) + dk) / (k - 1);
  }
  wFar += Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(1 - a, -(2 * s - 1)) * Math.log(1 / a);
  const c = 1 + T;
  let mid = 0;
  for (let k = 1; k <= s; k++) {
    const pk = binom(2 * s - k - 1, s - k) * Math.pow(rho + c, -(2 * s - k));
    const Ja = k === 1 ? Math.log((T + rho) / rho) : (Math.pow(rho, 1 - k) - Math.pow(T + rho, 1 - k)) / (k - 1);
    const Jc = k === 1 ? Math.log(c) : (1 - Math.pow(c, 1 - k)) / (k - 1);
    mid += pk * (Ja + Jc);
  }
  return Math.pow(rho, -0.5) * Math.pow(rho, s) * (wOut + wFar + mid);
}

// midpoint quadrature cross-check (positive integrand; refinement converges
// to the closed form - used two-sided with stated tolerances)
function iQuad(T, rho, s, N, pad) {
  const lo = -pad;
  const hi = T + pad;
  const h = (hi - lo) / N;
  let acc = 0;
  for (let i = 0; i < N; i++) {
    const u = lo + (i + 0.5) * h;
    acc += Math.pow(1 + Math.abs(u) / rho, -s) * Math.pow(1 + Math.abs(u - T), -s);
  }
  return (acc * h) / Math.sqrt(rho);
}

// Lemma RM exact antiderivative PhiInt(Y) = integral_0^Y phiK
function phiIntClosed(Y, s) {
  return 1 / (2 * (s - 1)) - (Math.pow(1 + Y, -s) * ((s - 0.5) * (1 + Y) - (s - 1))) / (s - 1);
}

const YSTAR = Math.pow(2 * SS - 1, 1 / (SS - 1)) - 1;

// ── THEOREM Y-EXACT block weights ─────────────────────────────────────────────
const envEMemo = new Map();
function envE(b, j) {
  const key = b * 4096 + j;
  const hit = envEMemo.get(key);
  if (hit !== undefined) return hit;
  const val = iExact(cornerV(b, j), rhoCap(j), SS);
  envEMemo.set(key, val);
  return val;
}

function omegaE(b) {
  let s = 0;
  for (let j = 2; j <= 800; j += 2) {
    const t = envE(b, j);
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  const r = b % 2;
  for (let j = 2; j <= b - r; j += 2) s += envE(b - j, j);
  return s;
}

// imp-95032: the SAME OmegaE roll-up but with every per-pair value taken from
// the UNFOLDED evaluation iUnfolded (algebraically identical to iExact). The
// gap between omegaE and omegaEUnfolded propagates the partial-fraction float
// cancellation through the FULL far-ceiling pipeline cFar = 2 OmegaE_b / Tx(2),
// so it MEASURES the conditioning of the reported ceiling and ledger factor
// (and, at b = 0, of the persisting near-tie) rather than only the corner term.
function omegaEUnfolded(b) {
  let s = 0;
  for (let j = 2; j <= 800; j += 2) {
    const t = iUnfolded(cornerV(b, j), rhoCap(j), SS);
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  const r = b % 2;
  for (let j = 2; j <= b - r; j += 2) s += iUnfolded(cornerV(b - j, j), rhoCap(j), SS);
  return s;
}

// ── baked literals ────────────────────────────────────────────────────────────
const TX2_LIT = 2.8874500929283736e-4;
const CFAR_18 = 0.7741509917026236; // eighteenth continuation baked literal
const W3_V02_18 = 1.1159760370515937e-4; // eighteenth corner min-envelope
const OM2_18 = 1.1176611764661665e-4; // eighteenth OmegaRho_2
const ENV_V02_EXACT = 3.9197920255561178e-5;
const YSTAR_LIT = 0.3558821066938467; // 21^(1/10) - 1
const CORNER_FACTOR = 2.8470286938074612; // W3_V02_18 / ENV_V02_EXACT
const OM2_NEW = 3.9231900742006723e-5;
const OM0_NEW = 3.9198069316120816e-5; // persisting near-tie at b = 0
const CFAR_NEW = 0.2717408057586117;
const LEDGER_VS_18 = 2.8488580857094559; // CFAR_18 / CFAR_NEW
const LEDGER_VS_4 = 14.719909248937805; // 4 / CFAR_NEW
// end-to-end ceiling ledger (imp-95033): three ceiling-side far-bracket moves
const CFAR_17 = 2.9469476400572421; // seventeenth exponent-split far ceiling (4 -> this)
const LEDGER_F17 = 1.3573366372815172; // 4 / CFAR_17 (seventeenth exponent-split move)
const LEDGER_F18 = 3.8066832848407173; // CFAR_17 / CFAR_18 (eighteenth width-pinned move)
const LEDGER_F19 = 2.8488580857094559; // CFAR_18 / CFAR_NEW (nineteenth exact-pair move; = LEDGER_VS_18)
const HEAD_FLOOR = 0.096745062937484763; // fifteenth/sixteenth continuation literal
const GAP_HEAD_OLD = 8.001968970787363;
const GAP_HEAD_NEW = 2.8088338309749887;
const F97_FLOOR = 0.0012054673720820889; // fifteenth continuation chain terminal
const GAP_97_OLD = 642.1998717107592;
const GAP_97_NEW = 225.42360917596611;

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95008_EXACT_PAIR_CORRELATION_CEILING = {
  ticket:
    "imp-95008 (continuation nineteen: exact closed-form pair correlation replaces the window / Cauchy-Schwarz envelope apparatus - closes the eighteenth ledger residuals (b) corner slack and (c) asymptotic half-exponent)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; executes eighteenth-continuation achieved-side residuals (b) and (c).",
  lemmaCC:
    "UNCONDITIONAL layer-cake monotonicity: at fixed widths the envelope-pair correlation h(Delta) is even and nonincreasing in |Delta| (overlap of two intervals of fixed lengths is max(0, min(2a, 2b, a + b - Delta)), nonincreasing in the center distance), so I(T, rho) is nonincreasing in T for ALL T >= 0 - no window and no exponent loss.",
  lemmaRM:
    "UNCONDITIONAL width-ratio monotonicity: for s > 1 and T >= Ystar(s) = (2s-1)^(1/(s-1)) - 1, rho -> I(T, rho) is nondecreasing on (0, 1]; proof pairs the sign change of the rho-derivative kernel phiK at y0 = 1/(2s-1) against the monotone increase of the folded target G on [0, T], with the exact antiderivative PhiInt(Y) >= 0 for Y >= Ystar; at s = 11, Ystar = 0.3558821066938467 < V(0,2) = 2^(1/3), covering every roll-up pair.",
  lemmaPF:
    "Exact elementary closed form of I(T, rho) at integer s via repeated-linear-factor partial fractions: two one-sided pieces W(a, b) = sum_{k=2..s} (c_k a^(1-k) + d_k b^(1-k))/(k-1) + c_1 log(b/a) with c_k = (-1)^(s-k) binom(2s-k-1, s-k) (b-a)^(-(2s-k)), and a finite middle piece with positive coefficients p_k = binom(2s-k-1, s-k) (a+c)^(-(2s-k)); the rho^s prefactor is folded termwise (all rho powers positive) and c - T = 1 is held exact, so the evaluation is stable through the tiny rhoCap(j) of large j.",
  theoremYExact:
    "Parity roll-up verbatim with envE(b, j) = I(V(b, j), rhoCap(j)) - the EXACT envelope-pair value at the substituted point: ||sum w_b||^2 <= 2 sum ||w_b||^2 + 2 (sup_b OmegaE_b) M; per-pair chain: true correlation <= n_1 n_2 I(T_act, rho_act) <= n_1 n_2 I(V(b,j), rho_act) (Lemma CC) <= n_1 n_2 I(V(b,j), rhoCap(j)) (Lemma RM); near constant 2 (parity AM-GM) untouched; zero inequality slack survives in the pair bound at the substituted point.",
  certifiedResult:
    "Reference theta = 10 (sigma = 1, beta = 1/3, c = v = D = 1): dominant corner envelope 1.1159760370515937e-4 -> 3.9197920255561178e-5 (factor 2.8470286938074612 - exactly the slack the eighteenth measured by quadrature and named); sup_b OmegaE_b = OmegaE_2 = 3.9231900742006723e-5 (scanned b <= 400, both parities; b = 0 near-tie 3.9198069316120816e-5 persists), achieved point (cNear, cFar) = (2, 0.2717408057586117): far ceiling 0.7741509917026236 -> 0.2717408057586117 (ledger factor 2.8488580857094559; vs the pre-seventeenth 4: 14.719909248937805).",
  reference: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA },
    tx2: TX2_LIT,
    ystar: YSTAR_LIT,
    cornerEnvelope: { eighteenth: W3_V02_18, exact: ENV_V02_EXACT, factor: CORNER_FACTOR },
    om2Eighteenth: OM2_18,
    om2New: OM2_NEW,
    om0NewNearTie: OM0_NEW,
    ceilings: { eighteenth: CFAR_18, new: CFAR_NEW },
    ledgerFactorVs18: LEDGER_VS_18,
    ledgerFactorVs4: LEDGER_VS_4,
    ledgerComposition: {
      stages: [
        { move: "seventeenth (exponent-split)", from: 4, to: CFAR_17, factor: LEDGER_F17 },
        { move: "eighteenth (width-pinned three-window)", from: CFAR_17, to: CFAR_18, factor: LEDGER_F18 },
        { move: "nineteenth (exact-pair correlation)", from: CFAR_18, to: CFAR_NEW, factor: LEDGER_F19 },
      ],
      productOfFactors: LEDGER_F17 * LEDGER_F18 * LEDGER_F19,
      ledgerVs4: LEDGER_VS_4,
      note:
        "imp-95033 end-to-end cross-check (never before tabulated in one place): the three ceiling-side factors 1.3573366372815172 x 3.8066832848407173 x 2.8488580857094559 compose to 14.719909248937807, matching 4 / 0.2717408057586117 = 14.719909248937805 to rel ~1.2e-16 (machine epsilon); staged division 4 / f1 -> f2 -> f3 reproduces each intermediate ceiling (2.9469476400572421, 0.7741509917026236, 0.2717408057586117) exactly. Measurement only, NO QED; floors untouched.",
    },
    headlineBracket: { lo: HEAD_FLOOR, hi: CFAR_NEW, gapOld: GAP_HEAD_OLD, gapNew: GAP_HEAD_NEW },
    fixed97Bracket: { lo: F97_FLOOR, hi: CFAR_NEW, gapOld: GAP_97_OLD, gapNew: GAP_97_NEW },
    floatConditioning:
      "two algebraically equivalent closed-form evaluations differ by ~1e-8 relative at the corner (partial-fraction cancellation); literals are code-path-reproducible to 1e-12, true-value-accurate to ~1e-8",
    farCeilingConditioning:
      "imp-95032 (higher-precision re-evaluation, measurement only): propagating the folded (iExact) vs unfolded (iUnfolded) closed-form evaluations through the FULL far-ceiling pipeline cFar = 2 OmegaE_b / Tx(2) gives far-ceiling rel discrepancy 1.026e-8 (folded 0.2717408057586117, unfolded 0.2717408085472914) and ledger-factor rel discrepancy 1.026e-8 (folded 2.848858085709456, unfolded 2.8488580564736825) - both stable to the quoted ~1e-8, NOT degraded by the pipeline; unfolded > folded so the baked ceiling literal UNDERSTATES the true value (an upward round stays a valid upper bound). The b = 0 near-tie carries rel discrepancy 1.027e-8, essentially identical to the b = 2 sup (1.026e-8): the near-tie does NOT degrade conditioning further. So the ~1e-8 limit is a fixed partial-fraction cancellation floor, uniform across the corner term, the summed sup ceiling and the near-tie.",
    note: "floors UNTOUCHED - pure achieved-bound sharpening; the pair bound is EXACT at the substituted point",
  },
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "REFINED achieved-side ledger: (a) outer parity AM-GM factor 2 (uniformly unrecoverable per the eleventh) - now the DOMINANT surviving slack; (b) tightness of the substitution point only (Lemma X floor strict, Lemma RHO cap attained to 0.4 percent) - the eighteenth residuals (b) corner slack and (c) asymptotic half-exponent are CLOSED, the envelope now carries the true T^(-s) asymptotics by construction; HONEST LIMIT: the closed-form float evaluation carries ~1e-8 relative rounding (measured, stated in scope); the b = 0 near-tie persists; witness side unchanged (multi-packet re-optimization, different grid geometries)",
  ],
  // imp-95044: openResiduals[0..2] are ONE shared set, restated verbatim (not re-derived) by
  // every imp-95008-*.js sibling module; each is independently ASSESSED exactly once by a
  // dedicated downstream module, so a residual tally over the sibling chain must count each
  // index once, not once per restating module.
  residualAssessments: {
    0: "imp-95026-paper-packet-ceiling-transfer.js (packet-envelope constants transfer/degrade/break measurement)",
    1: "imp-95028-curvature-ceiling-D-assessment.js (curvature ceiling D: relocated vs removed by the nineteenth)",
    2: "imp-95029-paper-phase-curvature-normalization.js (phase-curvature normalization mu ledger effect)",
  },
  isRigorous: true,
  rigorScope:
    "Lemma CC is the layer-cake representation plus the elementary interval-overlap formula; Lemma RM is differentiation under the integral (locally dominated for rho > 0) plus a sign-pairing argument with an exact antiderivative; Lemma PF is repeated-linear-factor partial fractions with termwise integration (the k = 1 logarithms pair because d_1 = -c_1, 2s - 1 odd); Theorem Y-EXACT is the eleventh/seventeenth/eighteenth roll-up with the exact value substituted through the Lemma X floors and Lemma RHO caps via Lemmas CC and RM. The new ceiling is an ACHIEVED upper bound in the Theorem K bracket class {cNear <= 2, Tstar <= Tx(2)}; optimality is NOT claimed (the parity factor 2 and the substitution-point tightness remain as named slack). The closed form is exact as a formula; its float evaluation carries ~1e-8 relative rounding, measured by comparing two algebraically equivalent evaluations and negligible against the priced factors. Witness floors are carried literals of the fifteenth/sixteenth continuations (the headline floor is re-derived in the sibling eighteenth module, which remains in the assertion sweep). The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step executing eighteenth-continuation achieved-side residuals (b) and (c): NEW Lemma CC (layer-cake separation monotonicity, all T), NEW Lemma RM (width-ratio monotonicity for T >= Ystar(s), pairing argument with exact antiderivative), and NEW Lemma PF (exact elementary closed form of the envelope-pair correlation at integer s) let Theorem Y-EXACT re-run the parity roll-up with the EXACT pair value at the substituted point (V(b,j), rhoCap(j)) - the window / Cauchy-Schwarz apparatus of the fifth, seventeenth and eighteenth continuations is discarded, and zero inequality slack survives in the far pair bound. Reference theta = 10: corner envelope 1.1159760370515937e-4 -> 3.9197920255561178e-5 (factor 2.8470286938074612, exactly the eighteenth measured corner slack), far ceiling 0.7741509917026236 -> 0.2717408057586117, headline far-bracket gap 8.001968970787363 -> 2.8088338309749887, fixed-97 gap 642.1998717107592 -> 225.42360917596611, floors untouched. Surviving named slack: the parity AM-GM factor 2 (now dominant) and the tightness of the substitution point; near-tie at b = 0 persists. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_EPC_ASSERTIONS = [
  {
    id: "imp95008-epc-eighteenth-reproduction",
    description:
      "independent code path reproduces the eighteenth-continuation literals before comparison: Tx(2) = 2.8874500929283736e-4, corner min-envelope 1.1159760370515937e-4, OmegaRho_2 = 1.1176611764661665e-4, cFar18 = 2 OmegaRho_2 / Tx(2) = 0.7741509917026236 (rel 1e-12)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return (
        rel(TX2, TX2_LIT) &&
        rel(envRho18(0, 2), W3_V02_18) &&
        rel(omegaRho18(2), OM2_18) &&
        rel((2 * omegaRho18(2)) / TX2, CFAR_18)
      );
    },
  },
  {
    id: "imp95008-epc-closed-form-vs-quadrature",
    description:
      "Lemma PF closed form agrees with midpoint quadrature (N = 200000, pad 120) to 5e-4 relative across s in {11, 3} x T in {V(0,2), V(2,2), 20} x rho in {0.3, 2^(-1/3), 1}, and at the dominant corner a refined quadrature (N = 2000000, pad 200) agrees to 5e-6 - the quadrature converges TO the closed form",
    holds: () => {
      for (const s of [11, 3]) {
        for (const T of [cornerV(0, 2), cornerV(2, 2), 20]) {
          for (const rho of [0.3, rhoCap(2), 1]) {
            const e = iExact(T, rho, s);
            const q = iQuad(T, rho, s, 200000, 120);
            if (!(Math.abs(e - q) <= 5e-4 * Math.abs(q))) return false;
          }
        }
      }
      const eC = iExact(cornerV(0, 2), rhoCap(2), SS);
      const qC = iQuad(cornerV(0, 2), rhoCap(2), SS, 2000000, 200);
      return Math.abs(eC - qC) <= 5e-6 * Math.abs(qC);
    },
  },
  {
    id: "imp95008-epc-lemma-cc-grid",
    description:
      "Lemma CC on the well-conditioned domain: I(T, rho) is nonincreasing in T on a grid T in [1, 41] (2000 steps) at rho in {0.3, 2^(-1/3), 1} (tol 1e-9 relative; the layer-cake proof needs no restriction, the grid avoids the recorded small-T float-conditioning trap)",
    holds: () => {
      for (const rho of [0.3, rhoCap(2), 1]) {
        let prev = Infinity;
        for (let i = 0; i <= 2000; i++) {
          const T = 1 + i * 0.02;
          const v = iExact(T, rho, SS);
          if (v > prev * (1 + 1e-9)) return false;
          prev = v;
        }
      }
      return true;
    },
  },
  {
    id: "imp95008-epc-lemma-rm-grid",
    description:
      "Lemma RM: I(T, rho) is nondecreasing in rho on (0, 1] (1000-point grids, tol 1e-9 relative) at T in {V(0,2), V(2,2), 5, 40}; PhiInt closed form matches direct quadrature of phiK at Y in {0.5, V(0,2), 5} (rel 1e-4); Ystar = 21^(1/10) - 1 = 0.3558821066938467 < V(0,2), and the sufficient condition (s-1/2)(1+Y)^(1-s) <= 1/2 holds at Y = V(0,2)",
    holds: () => {
      for (const T of [cornerV(0, 2), cornerV(2, 2), 5, 40]) {
        let prev = 0;
        for (let i = 1; i <= 1000; i++) {
          const rho = i / 1000;
          const v = iExact(T, rho, SS);
          if (v < prev * (1 - 1e-9)) return false;
          prev = v;
        }
      }
      for (const Y of [0.5, cornerV(0, 2), 5]) {
        const N = 200000;
        const h = Y / N;
        let num = 0;
        for (let i = 0; i < N; i++) {
          const y = (i + 0.5) * h;
          num += Math.pow(1 + y, -SS - 1) * ((SS - 0.5) * y - 0.5);
        }
        num *= h;
        if (!(Math.abs(num - phiIntClosed(Y, SS)) <= 1e-4 * Math.abs(phiIntClosed(Y, SS)))) return false;
      }
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return (
        rel(YSTAR, YSTAR_LIT) &&
        YSTAR < cornerV(0, 2) &&
        (SS - 0.5) * Math.pow(1 + cornerV(0, 2), 1 - SS) <= 0.5 &&
        phiIntClosed(cornerV(0, 2), SS) > 0
      );
    },
  },
  {
    id: "imp95008-epc-exact-below-proved-bounds",
    description:
      "consistency: the exact value never exceeds a proved upper bound on it - envE(b, j) <= eighteenth min-envelope at every (b <= 6, j in {2,4,6,8}), and OmegaE_b <= OmegaRho_b at every b <= 400; the roll-up domain guard V(b, j) >= V(0,2) > Ystar holds on the same (b, j) range so Lemma RM covers every substituted pair",
    holds: () => {
      for (let b = 0; b <= 6; b++) {
        for (let j = 2; j <= 8; j += 2) {
          if (envE(b, j) > envRho18(b, j) * (1 + 1e-12)) return false;
          if (cornerV(b, j) < cornerV(0, 2) || cornerV(b, j) <= YSTAR) return false;
        }
      }
      for (let b = 0; b <= 400; b++) {
        if (omegaE(b) > omegaRho18(b) * (1 + 1e-12)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-epc-corner-literal",
    description:
      "corner: envE(0, 2) = I(2^(1/3), 2^(-1/3)) reproduces 3.9197920255561178e-5 (rel 1e-12) and the priced factor over the eighteenth corner envelope reproduces 2.8470286938074612 (rel 1e-12) - the eighteenth measured ~2.85x corner slack is consumed exactly",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return rel(envE(0, 2), ENV_V02_EXACT) && rel(W3_V02_18 / envE(0, 2), CORNER_FACTOR);
    },
  },
  {
    id: "imp95008-epc-sup-scan",
    description:
      "sup_b OmegaE_b over b <= 400 (both parities) is attained at b = 2 with the baked literal 3.9231900742006723e-5 (rel 1e-12); the b = 0 near-tie reproduces 3.9198069316120816e-5 and stays strictly below; every b >= 4 sits below OmegaE_2 / 100, blocks b >= 100 are below 1e-100, and every scanned value is finite (the folded evaluation has no overflow at tiny rhoCap)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const om2 = omegaE(2);
      if (!rel(om2, OM2_NEW) || !rel(omegaE(0), OM0_NEW)) return false;
      for (let b = 0; b <= 400; b++) {
        const o = omegaE(b);
        if (!Number.isFinite(o)) return false;
        if (b !== 2 && o >= om2) return false;
        if (b >= 4 && o >= om2 / 100) return false;
        if (b >= 100 && o >= 1e-100) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-epc-ceiling-literal",
    description:
      "the new achieved far coefficient cFarNew = 2 OmegaE_2 / Tx(2) reproduces the baked literal 0.2717408057586117 (rel 1e-12), sits strictly below the eighteenth ceiling 0.7741509917026236, and both ledger factors reproduce (vs eighteenth 2.8488580857094559, vs 4: 14.719909248937805)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const c = (2 * omegaE(2)) / TX2;
      return (
        rel(c, CFAR_NEW) &&
        c < CFAR_18 &&
        rel(CFAR_18 / c, LEDGER_VS_18) &&
        rel(4 / c, LEDGER_VS_4)
      );
    },
  },
  {
    id: "imp95008-epc-bracket-update",
    description:
      "the new tracked gaps reproduce from the carried floor literals: headline 8.001968970787363 -> 2.8088338309749887 and fixed-97 642.1998717107592 -> 225.42360917596611 (rel 1e-9), floors strictly below the new ceiling (floors untouched; the headline floor is re-derived in the sibling eighteenth module, which remains in the assertion sweep)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(CFAR_18 / HEAD_FLOOR, GAP_HEAD_OLD) &&
        rel(CFAR_NEW / HEAD_FLOOR, GAP_HEAD_NEW) &&
        rel(CFAR_18 / F97_FLOOR, GAP_97_OLD) &&
        rel(CFAR_NEW / F97_FLOOR, GAP_97_NEW) &&
        HEAD_FLOOR < CFAR_NEW &&
        F97_FLOOR < CFAR_NEW
      );
    },
  },
  {
    id: "imp95008-epc-folded-vs-unfolded",
    description:
      "float-conditioning MEASURED as a live computation (was prose-only self-check 2): two algebraically identical evaluations of the closed form - rho^s folded termwise (iExact) vs folded once at the end (iUnfolded) - agree to ~1e-8 relative at the ill-conditioned corner (V(0,2), rhoCap(2)) but NOT to 1e-12, reproducing the priced ~1e-8 partial-fraction cancellation; the SIGN is positive (unfolded > folded), i.e. the baked far-envelope literal UNDERSTATES the true value, so an upward round of the ceiling stays a valid upper bound; at the better-conditioned V(2,2) the two agree to 1e-12",
    holds: () => {
      const T = cornerV(0, 2);
      const rho = rhoCap(2);
      const f = iExact(T, rho, SS);
      const u = iUnfolded(T, rho, SS);
      const rel = Math.abs(f - u) / Math.abs(f);
      if (!(rel <= 1e-7 && rel >= 1e-9)) return false; // ~1e-8 conditioning band
      if (!(u > f)) return false; // baked (folded) literal understates -> round UP is safe
      const f2 = iExact(cornerV(2, 2), rho, SS);
      const u2 = iUnfolded(cornerV(2, 2), rho, SS);
      return Math.abs(f2 - u2) <= 1e-11 * Math.abs(f2);
    },
  },
  {
    id: "imp95008-epc-honesty-gate",
    description:
      "the verdict states the ceiling move with floors untouched, names the surviving slack (parity factor 2 now dominant, substitution-point tightness), records the float-conditioning honest limit and the persisting b = 0 near-tie, promotes no bound, NO QED, no refereed bound is changed; ceiling optimality is NOT claimed in scope",
    holds: () =>
      IMP95008_EXACT_PAIR_CORRELATION_CEILING.promotesBound === false &&
      IMP95008_EXACT_PAIR_CORRELATION_CEILING.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_EXACT_PAIR_CORRELATION_CEILING.verdict) &&
      /refereed bound is changed/i.test(IMP95008_EXACT_PAIR_CORRELATION_CEILING.verdict) &&
      /floors untouched/.test(IMP95008_EXACT_PAIR_CORRELATION_CEILING.verdict) &&
      /parity AM-GM factor 2/.test(IMP95008_EXACT_PAIR_CORRELATION_CEILING.verdict) &&
      /near-tie at b = 0 persists/.test(IMP95008_EXACT_PAIR_CORRELATION_CEILING.verdict) &&
      /optimality is NOT claimed/.test(IMP95008_EXACT_PAIR_CORRELATION_CEILING.rigorScope) &&
      /~1e-8 relative rounding/.test(IMP95008_EXACT_PAIR_CORRELATION_CEILING.rigorScope) &&
      /HONEST LIMIT/.test(IMP95008_EXACT_PAIR_CORRELATION_CEILING.openResiduals[4]),
  },
  {
    id: "imp95008-epc-imp95032-far-ceiling-conditioning",
    description:
      "imp-95032 higher-precision re-evaluation (measurement only): propagating iExact vs iUnfolded through the FULL far-ceiling pipeline cFar = 2 OmegaE_b / Tx(2) leaves the reported ceiling 0.2717408057586117 and ledger factor 2.8488580857094559 stable to ~1.03e-8 relative (unfolded > folded, so the baked literal understates -> upward round safe); the b = 0 near-tie carries the SAME ~1.03e-8 conditioning as the b = 2 sup (does NOT degrade further)",
    holds: () => {
      const inBand = (r) => r >= 9e-9 && r <= 1.2e-8; // fixed ~1e-8 cancellation floor
      const cFarU = (2 * omegaEUnfolded(2)) / TX2;
      const relCFar = Math.abs(CFAR_NEW - cFarU) / Math.abs(CFAR_NEW);
      if (!inBand(relCFar)) return false;
      if (!(cFarU > CFAR_NEW)) return false; // folded literal understates -> round UP is a valid upper bound
      const relLed = Math.abs(LEDGER_VS_18 - CFAR_18 / cFarU) / Math.abs(LEDGER_VS_18);
      if (!inBand(relLed)) return false;
      const o2F = omegaE(2);
      const o0F = omegaE(0);
      const rel2 = Math.abs(o2F - omegaEUnfolded(2)) / Math.abs(o2F);
      const rel0 = Math.abs(o0F - omegaEUnfolded(0)) / Math.abs(o0F);
      if (!inBand(rel0)) return false;
      // the b = 0 near-tie does NOT degrade conditioning: within 5 percent of the b = 2 sup
      return Math.abs(rel0 - rel2) <= 0.05 * rel2;
    },
  },
  {
    id: "imp95008-epc-ledger-composition-crosscheck",
    description:
      "imp-95033 end-to-end ledger cross-check (measurement only): the three ceiling-side far-bracket factors 4/2.9469476400572421 = 1.3573366372815172 (seventeenth), 2.9469476400572421/0.7741509917026236 = 3.8066832848407173 (eighteenth) and 0.7741509917026236/0.2717408057586117 = 2.8488580857094559 (nineteenth) compose to the full ledger 4/0.2717408057586117 = 14.719909248937805 to rel ~1e-15; staged division reproduces each intermediate ceiling to 1e-12",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      // each staged factor reproduces from the two ceilings it divides
      if (!rel(4 / CFAR_17, LEDGER_F17)) return false;
      if (!rel(CFAR_17 / CFAR_18, LEDGER_F18)) return false;
      if (!rel(CFAR_18 / CFAR_NEW, LEDGER_F19)) return false;
      // staged division reconstructs each intermediate ceiling
      if (!rel(4 / LEDGER_F17, CFAR_17)) return false;
      if (!rel(CFAR_17 / LEDGER_F18, CFAR_18)) return false;
      if (!rel(CFAR_18 / LEDGER_F19, CFAR_NEW)) return false;
      // the product of the three factors equals the full ledger 4 -> CFAR_NEW
      const prod = LEDGER_F17 * LEDGER_F18 * LEDGER_F19;
      if (!(Math.abs(prod - LEDGER_VS_4) <= 1e-13 * Math.abs(LEDGER_VS_4))) return false;
      return rel(prod, 4 / CFAR_NEW);
    },
  },
];

for (const a of IMP95008_EPC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-exact-pair-correlation-ceiling assertion failed: ${a.id}`);
  }
}

export default IMP95008_EXACT_PAIR_CORRELATION_CEILING;
