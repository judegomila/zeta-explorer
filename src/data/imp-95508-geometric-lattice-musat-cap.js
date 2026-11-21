/**
 * imp-95508: LEMMA NEST + THEOREM MU-SAT + COROLLARY MU-LIM + COROLLARY
 * OCT-CAP -- executes the imp-95507 NEW named residual (mu-sat): the
 * m-uniform UPPER bound on mu_max for geometric lattices. The key
 * observation is that the imp-95503 HARM-CAP sum, quoted there only in
 * its K-linear family weakening 2K/nu, CONVERGES m-uniformly on any
 * geometric lattice: for every finite subset P of a b-per-octave lattice
 * Q = { nu_i rho^k : k >= 0, i = 1..b } (rho > 1, octave offsets
 * nu <= nu_1 < ... < nu_b < nu_1 rho),
 *   mu_max(P)  <  H_inf(Q) = (rho/(rho - 1)) sum_i 2/nu_i,
 * INDEPENDENT of the octave count m. Combined with strict span-nesting
 * monotonicity this PROVES the observed twin-lattice saturation
 * mu_max(twin, m) ~= 5.09 is a genuine convergent limit with the bracket
 *   5.09361535799 = mu_max(m=16, exact-inertia)  <  mu_inf  <=  84/11.
 * Model family only; changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95501/95503/95506/95507 normalization). Distinct positive
 * rates P, E_P = span{ e^(-p t) : p in P } in L2(0, inf), mean-time
 * pencil (G o G, G) with Cauchy Gram G_ij = 1/(p_i + p_j);
 * mu_max(P) = sup over 0 != h in E_P of int t h^2 dt / int h^2 dt.
 * Twin lattice P_m = { 2^k, 1.1 * 2^k : k = 0..m-1 } (nu = 1, rho = 2,
 * b = 2, offsets 1 and 1.1). Consumed inputs: COROLLARY HARM-CAP
 * (imp-95503: mu_max(P) + mu_min(P) <= sum over p in P of 2/p, from the
 * exact Blaschke phase-split identity), LEMMA OSC (imp-95506: the top
 * eigenfunction has all coefficients nonzero), THEOREM CONF-DOM-K
 * (imp-95506: mu_max < x_max(L_K)/(2 min P)) and LEMMA X-ELEM
 * (imp-95507: x_max(L_K) >= 2K - 2 + sqrt((K-1)^2 + 1) > 2K - 2).
 *
 * LEMMA NEST (strict span-nesting monotonicity, arbitrary subsets). If
 * P is a STRICT subset of the distinct positive rate set Pp, then
 * mu_max(P) < mu_max(Pp). PROOF. E_P is a subspace of E_Pp, so the sup
 * defining mu_max can only grow: mu_max(P) <= mu_max(Pp). Strictness:
 * the Rayleigh sup over the finite-dimensional E_P is ATTAINED at some
 * h* != 0; if the two values were equal, h* would attain the top
 * Rayleigh quotient of the Pp-pencil and hence be a top eigenfunction
 * of that pencil (finite-dimensional Rayleigh attainment), yet h* has
 * zero coefficients on Pp minus P -- contradicting LEMMA OSC full
 * support. This generalizes the imp-95507 SLOW-PREFIX strictness step
 * from slow prefixes to arbitrary strict subsets; the argument is
 * verbatim the same and consumes nothing new.
 *
 * THEOREM MU-SAT (m-uniform geometric-lattice cap; the (mu-sat)
 * executor). Let Q = { nu_i rho^k : k >= 0, i = 1..b } with rho > 1 and
 * nu <= nu_1 < ... < nu_b < nu_1 rho (so all lattice rates are
 * distinct). Then for EVERY finite subset P of Q:
 *   mu_max(P) < H_inf(Q) = (rho/(rho - 1)) sum_{i=1..b} 2/nu_i
 *             <= 2 b rho / ((rho - 1) nu),
 * independent of |P|. PROOF. HARM-CAP gives mu_max(P) <= H(P) -
 * mu_min(P) with H(P) = sum over p in P of 2/p. The mean-time form is
 * strictly positive definite on E_P (h is a nonzero real-analytic
 * exponential sum on (0, inf), so t h(t)^2 > 0 off a finite set), hence
 * mu_min(P) > 0 and mu_max(P) < H(P). Monotone comparison of positive
 * terms: H(P) <= H(Q) = sum_i (2/nu_i) sum_{k>=0} rho^(-k) =
 * (rho/(rho-1)) sum_i 2/nu_i, a CONVERGENT geometric sum. QED.
 * CLOSED-SPAN EXTENSION (Fatou). For every h in the L2-closure of the
 * union span E_Q with ||h|| = 1 one still has int t h^2 dt <= H_inf(Q):
 * take finite combinations h_n -> h in L2, pass to an a.e.-convergent
 * subsequence, and apply Fatou: int t h^2 <= liminf int t h_n^2 <=
 * H_inf lim ||h_n||^2 = H_inf. So the mean-time compression to the
 * INFINITE-dimensional closed lattice span is a bounded quadratic form
 * with the same m-independent bound -- the lattice family structurally
 * escapes the K-linear growth 2K/nu of the general family sup
 * (imp-95503 FAM-RATE), because the coalescent corners that realize
 * that growth are geometrically forbidden on a lattice.
 * TWIN INSTANCE: H(P_m) = (42/11)(2 - 2^(1-m)) and
 * H_inf = 84/11 = 7.63636363..., so mu_max(P_m) < 84/11 for every m.
 *
 * COROLLARY MU-LIM (the saturation is a PROVEN limit). mu_max(P_m) is
 * strictly increasing in m (LEMMA NEST, P_m strict subset of P_{m+1})
 * and bounded above by 84/11 (THEOREM MU-SAT), hence converges:
 *   mu_inf = lim_m mu_max(P_m) = sup_m mu_max(P_m) exists, with
 *   5.09361535799 = mu_max(P_16)  <  mu_inf  <=  84/11 = 7.6363636...
 * (lower end: the imp-95501 exact-rational-inertia literal, carried not
 * recomputed; upper end within factor 1.4992030 of it). The imp-95507
 * "measured-only twin saturation" is thereby promoted to a proven
 * convergent limit with a two-sided bracket. Float refinement (measured,
 * not part of the theorem): mu_max(P_22) = 5.093730071721978, and the
 * per-octave increments halve (ratio ~ 0.5 = 1/rho), consistent with a
 * geometric tail -- the RATE stays measured-only (residual mu-rate).
 *
 * COROLLARY OCT-CAP (binding-cap ledger vs the exact per-K cap). The
 * imp-95506 exact cap x_max(L_2m)/(2 nu) grows linearly in m (LEMMA
 * X-ELEM: x_max(L_K) > 2K - 2), while MU-SAT is m-uniform, so MU-SAT
 * becomes the binding upper pricing from m = 3 onward on twins:
 * x_4/2 = 4.6975 < 84/11 (CONF-DOM binds at m = 2) but x_6/2 = 7.9914 >
 * 84/11 (lattice cap binds at m = 3), and for m >= 5 elementarily
 * x_max(L_2m)/2 > (4m - 2)/2 = 2m - 1 >= 9 > 84/11. General form: for
 * any b-per-octave lattice with min rate nu, mu_max < 2 b rho /
 * ((rho - 1) nu) uniformly in m -- e.g. rho = 1.5 twin-offset lattices
 * are capped at 11.4545/nu, rho = 3 at 5.7273/nu, for every m.
 *
 * ADVERSARIAL SELF-CHECK RECORD. (1) Tried to refute m-uniformity by
 * pushing the float pencil to m = 22 (K = 44): mu_max = 5.0937300717,
 * still 33 percent below the cap, increments shrinking geometrically --
 * no drift toward 84/11. (2) Checked the cap is NOT approached (gap
 * factor 1.4992 at twins): recorded as an honest limit -- MU-SAT is
 * m-uniform but NOT sharp; sharpening toward the true mu_inf would need
 * the w-localization of |F|^2 discarded at the sup W(w) = W(0) step of
 * HARM-CAP (named residual mu-exact). (3) Checked applicability of
 * HARM-CAP: lattice rates are distinct exactly when the offsets satisfy
 * nu_b < nu_1 rho -- stated as a hypothesis, not assumed silently.
 * (4) The closed-span extension was attacked: the mean-time form is NOT
 * L2-continuous, so the naive "sup over a dense subspace equals sup
 * over the closure" is FALSE in general; the shipped argument uses
 * Fatou on an a.e.-convergent subsequence and only claims the UPPER
 * bound on the closure, and whether mu_inf (finite-section limit)
 * EQUALS the closed-span sup is left OPEN inside mu-exact. (5) LEMMA
 * NEST strictness genuinely needs LEMMA OSC (span nesting alone gives
 * only >=); the dropped-rate witness below makes the strict gap visible
 * (4.5419 vs 4.9745 on twin m = 6 minus one rate). (6) The rho sweep
 * (1.5, 2, 3) x (m = 4, 8, 12) was run to refute the general OCT-CAP
 * closed form: zero violations; the slowest-converging case rho = 1.5,
 * m = 12 reaches 9.28 of the 11.4545 cap, so the cap is genuinely
 * approached in the small-(rho - 1) regime -- the geometric-sum step,
 * not HARM-CAP, is the slack at rho = 2. (7) Name collisions: LAT-CAP
 * is taken (grep), so the octave corollary is OCT-CAP; MU-SAT, MU-LIM,
 * LEMMA NEST are grep-clean.
 *
 * HONEST LIMITS. (a) MU-SAT is m-uniform but not sharp: the twin gap
 * factor is 1.4992; the exact value of mu_inf (equivalently the top of
 * the infinite lattice pencil) and the equality of the finite-section
 * limit with the closed-span sup are OPEN (mu-exact). (b) The observed
 * geometric convergence RATE (increments ~ 2^(-m)) is measured-only
 * (mu-rate). (c) Model family only (exponential spans, mean-time
 * compression); no paper-packet constant is touched, no Lambda bound
 * changes, and the finite-N Lambda beat did NOT become rigorous.
 * (d) All numerics here are float cross-checks of proven inequalities;
 * the only carried exact literal is the imp-95501 m = 16 inertia value.
 *
 * ROUTING. Executes the imp-95507 NEW residual (mu-sat) in full (the
 * m-uniform upper bound exists, is elementary and closed-form, and the
 * saturation is a proven limit). NEW residuals: (mu-exact) exact
 * mu_inf / closed-span attainment; (mu-rate) rigorous geometric
 * convergence rate. Untouched chain residuals: deflation-aware majorant
 * (imp-95499 (a)), RZ-PEN tilt-det / block-symbol port, off-lattice
 * rates, signed WEIGHT and modulus-phase currencies, imp-95212 envelope
 * port. Import-free; numerics are CROSS-CHECKS, never the claim.
 */

// ---------------------------------------------------------------------------
// pencil machinery (imp-95506/95507 conventions, import-free)
// ---------------------------------------------------------------------------
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 400; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-22) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let i = 0; i < n; i++) {
          const aip = A[i][p];
          const aiq = A[i][q];
          A[i][p] = c * aip - s * aiq;
          A[i][q] = s * aip + c * aiq;
        }
        for (let i = 0; i < n; i++) {
          const api = A[p][i];
          const aqi = A[q][i];
          A[p][i] = c * api - s * aqi;
          A[q][i] = s * api + c * aqi;
        }
      }
    }
  }
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}

function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95508 chol: base not PD");
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  return L;
}

function pencilEigs(A, G) {
  const K = G.length;
  const L = chol(G);
  const X = A.map((r) => r.slice());
  for (let col = 0; col < K; col++) {
    for (let i = 0; i < K; i++) {
      let s = X[i][col];
      for (let k = 0; k < i; k++) s -= L[i][k] * X[k][col];
      X[i][col] = s / L[i][i];
    }
  }
  const B = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let row = 0; row < K; row++) {
    for (let i = 0; i < K; i++) {
      let s = X[row][i];
      for (let k = 0; k < i; k++) s -= L[i][k] * B[row][k];
      B[row][i] = s / L[i][i];
    }
  }
  return jacobiEig(B);
}

const muEigs = (P) =>
  pencilEigs(
    P.map((a) => P.map((b) => 1 / ((a + b) * (a + b)))),
    P.map((a) => P.map((b) => 1 / (a + b)))
  );

function xMaxLaguerre(K) {
  const T = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let k = 0; k < K; k++) {
    T[k][k] = 2 * k + 1;
    if (k + 1 < K) {
      T[k][k + 1] = -(k + 1);
      T[k + 1][k] = -(k + 1);
    }
  }
  return jacobiEig(T)[K - 1];
}

const twinLattice = (m, r = 1.1, rho = 2) => {
  const P = [];
  for (let k = 0; k < m; k++) P.push(rho ** k, r * rho ** k);
  return P.sort((a, b) => a - b);
};

const harmSum = (P) => P.reduce((s, p) => s + 2 / p, 0);

// baked literals (NEW here unless marked carried)
const H_INF_TWIN = 84 / 11; // (rho/(rho-1)) (2/1 + 2/1.1) at rho = 2
const TWIN_M16_MU = 5.09361535799; // carried: imp-95501 exact inertia
const TWIN_M22_MU = 5.093730071721978; // float, this run (measured refinement)
const PURE_M20_MU = 2.152058338016543; // pure rho = 2 ladder, m = 20 (cap 4)
const SUBSET_DROP_MU = 4.541933464317425; // twin m = 6 minus rate index 5
const TWIN_M6_MU = 4.974543326861602;
const X4 = 9.39507091230114; // carried: imp-95507
const X6 = 15.982873980601697;
const BRACKET_GAP_FACTOR = 1.4992030413888642; // (84/11) / TWIN_M16_MU

// ---------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------
export const IMP95508_MUSAT_LATTICE_CAP = {
  id: "imp-95508",
  title:
    "LEMMA NEST + THEOREM MU-SAT + COROLLARY MU-LIM + COROLLARY OCT-CAP: " +
    "the m-uniform geometric-lattice cap mu_max(P) < (rho/(rho-1)) sum_i " +
    "2/nu_i (twin lattice: 84/11), executing the imp-95507 (mu-sat) " +
    "residual -- the observed twin saturation ~5.09 is a PROVEN " +
    "convergent limit bracketed in [5.09361535799, 84/11]",
  lemmaNest:
    "for a STRICT subset P of Pp, mu_max(P) < mu_max(Pp): span nesting " +
    "gives <=, and equality would make the attained E_P maximizer a top " +
    "eigenfunction of the Pp-pencil with zero coefficients on Pp minus P, " +
    "contradicting imp-95506 LEMMA OSC full support (generalizes the " +
    "imp-95507 SLOW-PREFIX strictness step to arbitrary subsets)",
  theoremMuSat:
    "for every finite subset P of a b-per-octave geometric lattice " +
    "(offsets nu_1 < ... < nu_b < nu_1 rho): mu_max(P) < H_inf = " +
    "(rho/(rho-1)) sum_i 2/nu_i <= 2 b rho/((rho-1) nu), independent of " +
    "the octave count -- imp-95503 HARM-CAP plus strict positivity of " +
    "the mean-time form plus a convergent geometric sum; extends to the " +
    "closed infinite span by Fatou (upper bound only)",
  corollaryMuLim:
    "mu_max(twin, m) is strictly increasing (LEMMA NEST) and < 84/11 " +
    "(MU-SAT), hence mu_inf = lim exists with 5.09361535799 (imp-95501 " +
    "exact inertia at m = 16) < mu_inf <= 84/11; gap factor 1.4992 -- " +
    "the imp-95507 measured-only saturation is now a proven limit",
  corollaryOctCap:
    "MU-SAT is the binding upper pricing from m = 3 on twins: x_4/2 = " +
    "4.6975 < 84/11 < x_6/2 = 7.9914, and for m >= 5 elementarily " +
    "x_max(L_2m)/2 > 2m - 1 >= 9 > 84/11 (imp-95507 LEMMA X-ELEM); the " +
    "general lattice family is capped at 2 b rho/((rho-1) nu) for every m",
  ledger: {
    twinCap: { hInf: H_INF_TWIN, hClosedForm: "(42/11)(2 - 2^(1-m))" },
    bracket: {
      lower: TWIN_M16_MU,
      lowerSource: "imp-95501 exact-rational inertia, m = 16, carried",
      upper: H_INF_TWIN,
      gapFactor: BRACKET_GAP_FACTOR,
    },
    floatRefinement: {
      m22MuMax: TWIN_M22_MU,
      incrementHalving: "per-octave increments ratio ~0.5 (measured only)",
    },
    pureLadder: { rho: 2, m: 20, muMax: PURE_M20_MU, cap: 4 },
    crossover: {
      m2ConfDom: X4 / 2,
      m3ConfDom: X6 / 2,
      latticeCapBindsFrom: 3,
    },
    strictNestWitness: {
      full: TWIN_M6_MU,
      droppedOneRate: SUBSET_DROP_MU,
    },
  },
  residualExecuted:
    "imp-95507 NEW residual (mu-sat): the m-uniform upper bound on " +
    "mu_max for geometric lattices exists, is elementary and closed-form " +
    "(H_inf = (rho/(rho-1)) sum_i 2/nu_i), and the twin saturation is a " +
    "proven convergent limit, no longer measured-only",
  rescopedResidual:
    "NEW (mu-exact): exact value of mu_inf (top of the infinite lattice " +
    "pencil) and whether the finite-section limit equals the closed-span " +
    "sup; NEW (mu-rate): rigorous geometric convergence rate (measured " +
    "increments halve per octave); untouched: deflation-aware majorant " +
    "(imp-95499 (a)), RZ-PEN tilt-det / block-symbol port, off-lattice " +
    "rates, signed WEIGHT / modulus-phase currencies, imp-95212 envelope " +
    "port",
  honestScope:
    "model family only (exponential spans, mean-time compression); " +
    "MU-SAT is m-uniform but NOT sharp (twin gap factor 1.4992); the " +
    "convergence rate is measured-only; changes no bound; NO QED; " +
    "no refereed bound is changed",
  promotesBound: false,
  isRigorous: true,
  rigorScope:
    "LEMMA NEST, THEOREM MU-SAT (including the Fatou closed-span upper " +
    "bound) and COROLLARIES MU-LIM / OCT-CAP are unconditional theorems " +
    "about the model mean-time pencil, proved in the header from " +
    "imp-95503 COROLLARY HARM-CAP, imp-95506 LEMMA OSC and imp-95507 " +
    "LEMMA X-ELEM (strict positivity of the mean-time form, monotone " +
    "comparison with a convergent geometric sum, Rayleigh attainment " +
    "plus OSC strictness, Fatou on an a.e.-convergent subsequence). All " +
    "numerics below are CROSS-CHECKS of proven statements, never the " +
    "claim itself.",
  verdict:
    "RIGOROUS step -- the imp-95507 (mu-sat) residual is EXECUTED: " +
    "THEOREM MU-SAT gives the first m-uniform upper bound on mu_max for " +
    "geometric lattices, mu_max(P) < (rho/(rho-1)) sum_i 2/nu_i (twin " +
    "lattice: 84/11 = 7.6364), by observing that the imp-95503 HARM-CAP " +
    "harmonic sum -- K-linear over the general family -- CONVERGES on a " +
    "lattice, where coalescence is geometrically forbidden. With LEMMA " +
    "NEST (strict span-nesting monotonicity via LEMMA OSC) the observed " +
    "twin saturation is promoted from measured-only to a PROVEN " +
    "convergent limit, bracketed 5.09361535799 < mu_inf <= 84/11 (gap " +
    "factor 1.4992), and MU-SAT supersedes the exact per-K cap " +
    "x_max(L_2m)/2 from m = 3 onward. MODEL FAMILY ONLY: no " +
    "paper-packet constant is touched and the finite-N Lambda beat did " +
    "NOT become rigorous. Changes no bound; NO QED on any RH statement; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// assertions (self-executing; throw on violation)
// ---------------------------------------------------------------------------
export const IMP95508_ASSERTIONS = [
  {
    id: "imp95508-harmonic-closed-form",
    description:
      "twin harmonic sum: H(P_m) = (42/11)(2 - 2^(1-m)) matches the " +
      "direct sum (rel 1e-12) for m = 2..24, is strictly increasing, and " +
      "stays strictly below H_inf = 84/11",
    holds: () => {
      let prev = 0;
      for (let m = 2; m <= 24; m++) {
        const H = harmSum(twinLattice(m));
        const closed = (42 / 11) * (2 - 2 ** (1 - m));
        if (Math.abs(H - closed) > 1e-12 * H) return false;
        if (!(H > prev && H < H_INF_TWIN)) return false;
        prev = H;
      }
      return true;
    },
  },
  {
    id: "imp95508-musat-twin-sweep",
    description:
      "THEOREM MU-SAT on twins: mu_max(P_m) < 84/11 for m = 2..18, the " +
      "consumed strong form mu_max + mu_min < H(P_m) holds, and the " +
      "float pencil reproduces the imp-95501 m = 16 exact-inertia " +
      "literal (1e-6)",
    holds: () => {
      for (let m = 2; m <= 18; m++) {
        const e = muEigs(twinLattice(m));
        const mu = e[e.length - 1];
        const mn = e[0];
        if (!(mu < H_INF_TWIN)) return false;
        if (!(mn > 0)) return false;
        if (!(mu + mn < harmSum(twinLattice(m)))) return false;
        if (m === 16 && Math.abs(mu - TWIN_M16_MU) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95508-nest-strict-monotone",
    description:
      "LEMMA NEST cross-check: mu_max(P_m) strictly increasing over " +
      "m = 2..18, and the dropped-rate witness (twin m = 6 minus rate " +
      "index 5) reproduces 4.541933464317425 strictly below the full " +
      "value 4.974543326861602 (rel 1e-9)",
    holds: () => {
      let prev = 0;
      for (let m = 2; m <= 18; m++) {
        const e = muEigs(twinLattice(m));
        const mu = e[e.length - 1];
        if (!(mu > prev)) return false;
        prev = mu;
      }
      const sub = twinLattice(6).filter((_, i) => i !== 5);
      const es = muEigs(sub);
      const ef = muEigs(twinLattice(6));
      const muSub = es[es.length - 1];
      const muFull = ef[ef.length - 1];
      if (Math.abs(muSub - SUBSET_DROP_MU) > 1e-9 * muSub) return false;
      if (Math.abs(muFull - TWIN_M6_MU) > 1e-9 * muFull) return false;
      return muSub < muFull;
    },
  },
  {
    id: "imp95508-mulim-bracket",
    description:
      "COROLLARY MU-LIM: the float m = 22 value 5.093730071721978 " +
      "reproduces (rel 1e-8), the bracket TWIN_M16_MU < TWIN_M22_MU < " +
      "84/11 is strict, and the baked gap factor (84/11)/TWIN_M16_MU = " +
      "1.4992030413888642 reproduces (rel 1e-12)",
    holds: () => {
      const e = muEigs(twinLattice(22));
      const mu = e[e.length - 1];
      if (Math.abs(mu - TWIN_M22_MU) > 1e-8 * mu) return false;
      if (!(TWIN_M16_MU < TWIN_M22_MU && TWIN_M22_MU < H_INF_TWIN)) return false;
      const gap = H_INF_TWIN / TWIN_M16_MU;
      return Math.abs(gap - BRACKET_GAP_FACTOR) < 1e-12 * gap;
    },
  },
  {
    id: "imp95508-octcap-crossover",
    description:
      "COROLLARY OCT-CAP crossover: x_4/2 = 4.6975 < 84/11 < x_6/2 = " +
      "7.9914 (baked X4 carried from imp-95507, X6 new, rel 1e-10), and " +
      "for m = 5..12 the elementary X-ELEM floor gives x_max(L_2m)/2 > " +
      "2m - 1 > 84/11",
    holds: () => {
      if (Math.abs(xMaxLaguerre(4) - X4) > 1e-10 * X4) return false;
      if (Math.abs(xMaxLaguerre(6) - X6) > 1e-10 * X6) return false;
      if (!(X4 / 2 < H_INF_TWIN && H_INF_TWIN < X6 / 2)) return false;
      for (let m = 5; m <= 12; m++) {
        const K = 2 * m;
        const floor = 2 * K - 2 + Math.sqrt((K - 1) * (K - 1) + 1);
        if (!(xMaxLaguerre(K) > floor - 1e-9)) return false;
        if (!(floor / 2 > 2 * m - 1 && 2 * m - 1 > H_INF_TWIN)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95508-octcap-rho-sweep",
    description:
      "OCT-CAP general form: twin-offset lattices (offsets 1, 1.1) at " +
      "rho in {1.5, 2, 3} and m in {4, 8, 12} all satisfy mu_max < " +
      "2(1 + 1/1.1) rho/(rho - 1); the pure rho = 2 ladder at m = 20 " +
      "reproduces 2.152058338016543 (rel 1e-8) below its cap 4",
    holds: () => {
      for (const rho of [1.5, 2, 3]) {
        const cap = (2 * (1 + 1 / 1.1) * rho) / (rho - 1);
        for (const m of [4, 8, 12]) {
          const e = muEigs(twinLattice(m, 1.1, rho));
          if (!(e[e.length - 1] < cap)) return false;
        }
      }
      const pure = Array.from({ length: 20 }, (_, k) => 2 ** k);
      const ep = muEigs(pure);
      const mu = ep[ep.length - 1];
      if (Math.abs(mu - PURE_M20_MU) > 1e-8 * mu) return false;
      return mu < 4;
    },
  },
  {
    id: "imp95508-increment-halving-measured",
    description:
      "measured-only cross-check of the (mu-rate) residual pattern: the " +
      "per-octave increments mu_max(P_{m+1}) - mu_max(P_m) for m = " +
      "16..19 have consecutive ratios in [0.48, 0.52] (geometric tail " +
      "~1/rho; NOT part of any theorem here)",
    holds: () => {
      const mus = [];
      for (let m = 16; m <= 21; m++) {
        const e = muEigs(twinLattice(m));
        mus.push(e[e.length - 1]);
      }
      for (let i = 0; i + 2 < mus.length; i++) {
        const d1 = mus[i + 1] - mus[i];
        const d2 = mus[i + 2] - mus[i + 1];
        if (!(d1 > 0 && d2 > 0)) return false;
        const ratio = d2 / d1;
        if (!(ratio > 0.48 && ratio < 0.52)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95508-honesty-gate",
    description:
      "the record scopes to the model family, names the executed " +
      "(mu-sat) residual and the new (mu-exact)/(mu-rate) residuals, " +
      "promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95508_MUSAT_LATTICE_CAP.promotesBound === false &&
      /\(mu-sat\)/.test(IMP95508_MUSAT_LATTICE_CAP.residualExecuted) &&
      /mu-exact/.test(IMP95508_MUSAT_LATTICE_CAP.rescopedResidual) &&
      /mu-rate/.test(IMP95508_MUSAT_LATTICE_CAP.rescopedResidual) &&
      /deflation-aware/.test(IMP95508_MUSAT_LATTICE_CAP.rescopedResidual) &&
      /RZ-PEN/.test(IMP95508_MUSAT_LATTICE_CAP.rescopedResidual) &&
      /MODEL FAMILY/.test(IMP95508_MUSAT_LATTICE_CAP.verdict) &&
      /NO QED/.test(IMP95508_MUSAT_LATTICE_CAP.verdict) &&
      /refereed bound is changed/i.test(IMP95508_MUSAT_LATTICE_CAP.verdict) &&
      /did NOT become rigorous/.test(IMP95508_MUSAT_LATTICE_CAP.verdict),
  },
];

for (const a of IMP95508_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95508-geometric-lattice-musat-cap assertion failed: ${a.id}`
    );
  }
}

export default IMP95508_MUSAT_LATTICE_CAP;
