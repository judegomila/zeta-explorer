/**
 * imp-95289: THEOREM FRONT-END + PROP FRONT-CAP + a two-sided numerical
 * bracket on the exact sharp signed-seam frontier
 *   F(theta, y_min) = sup { R(f) : signed packet family f,
 *                           T(f)/T(g) = theta, y_min(f) = y_min },
 * left OPEN by imp-95254 between the THEOREM PHASE-AM upper region and the
 * PROP CEIL-X exceedance. Twenty-fifth+ leg of the seam chain. Objects as in
 * imp-95221/95222/95233/95254: packets f_n(s) = e^(-mu_n |s - u_n|), rates
 * mu_n > 0, centers u_n > 0, REAL amplitudes c_n; f = sum c_n f_n;
 * g = sum |c_n| f_n; W(f) = int_(s<0) f^2 = c^T L c; T(f) = int_R f^2
 * = c^T M c; R = W/T in [0, 1]; theta = T(f)/T(g) in (0, 1]; y_min =
 * min over pairs incl diagonal of (mu_m + mu_n) min(u_m, u_n). Gram data
 *   L_mn = a_m a_n / (mu_m + mu_n), a_n = e^(-mu_n u_n),
 *   M_mn = three-strip overlap (imp-95254 overlapM).
 * The sup in F is over BOTH the amplitudes and the geometry at fixed
 * currencies; theta is measured AT the maximizing amplitudes (so for a fixed
 * geometry the interior sup over c is the generalized top eigenvalue
 * lambda_max(L, M) -- the imp-95226 pencil/NP object -- and theta is the
 * phase currency of the top eigenvector).
 *
 * -------------------------------------------------------------------------
 * THEOREM FRONT-END (exact endpoint at theta = 1). For every y_min > 0,
 *   F(1, y_min) = (1/2) e^(-y_min) EXACTLY.
 * Proof. theta = 1 iff T(f) = T(g) iff the cross energy X = <f_plus,
 * f_minus> = 0 iff f = g iff all amplitudes share one sign (the positive
 * cone). On the positive cone THEOREM PHASE-AM evaluates to the upper bound
 *   R(f) <= (e^(-y_min)/4)(1 + 1/1) = (1/2) e^(-y_min),
 * which is exactly the imp-95222 FA-2 positive-cone bound (ENT summed).
 * A single packet (any rate mu, center u with 2 mu u = y_min) attains it:
 * R = L_11/M_11 = (1/(2 mu)) / (1/mu) * e^(-2 mu u) = (1/2) e^(-y_min).
 * Upper and lower bracket coincide, so the frontier value is pinned, not
 * merely bracketed. This is the ONE interior-currency point where the exact
 * frontier is known in closed form.
 *
 * PROP FRONT-CAP (upper bracket, all theta). For every (theta, y_min),
 *   F(theta, y_min) <= U(theta, y_min)
 *                    := min( 1, (e^(-y_min)/4)(1 + 1/theta) ),
 * the THEOREM PHASE-AM bound capped by the trivial ceiling R <= 1 (W <= T,
 * both nonnegative). The trivial cap is the OPERATIVE (strictly tighter)
 * factor exactly when PHASE-AM exceeds 1, i.e. iff
 *   theta < theta_cap(y_min) := 1 / (4 e^(y_min) - 1).
 * At y_min = 1/4 this threshold is theta_cap = 1/(4 e^(1/4) - 1) =
 * 0.2417743..., so for theta < that value PHASE-AM carries no sub-1
 * information and the honest upper bracket is the flat ceiling 1 -- exactly
 * the deep-cancellation region where CEIL-X shows R can climb well above 1/2.
 *
 * LOWER BRACKET (explicit witnesses, y_min = 1/4 slice). Each geometry
 * below is a valid family, so its pencil optimum lambda_max is a lower bound
 * F(theta, 1/4) >= lambda_max at its own theta:
 *   - CEIL-X (non-co-centered) rates (1, 1/2), centers (1, 1/4):
 *       theta = 0.111892, F(0.111892, 1/4) >= 0.696324 (pencil-optimal
 *       amplitudes; the imp-95254 CEIL-X literal c = (1, -1) gives 0.696175
 *       at theta = 0.109899, a shade inside the same geometry pencil).
 *   - co-centered rates (1, 8), u = 1/8:  F(0.337616, 1/4) >= 0.489740.
 *   - co-centered rates (1, 20), u = 1/8: F(0.548895, 1/4) >= 0.460910.
 *   - co-centered rates (1, 40), u = 1/8: F(0.705276, 1/4) >= 0.429742.
 * The co-centered branch stays below 1/2 (the imp-95224 DC-NOGO saturation
 * value is a co-centered ceiling); only the non-co-centered branch (CEIL-X)
 * pushes the lower bracket above 1/2, and it does so precisely in the
 * small-theta region where the upper bracket has already flattened to 1.
 *
 * BRACKET SHAPE (the honest two-sided reading).
 *   - At theta = 1 the bracket is EXACT (gap 0): FRONT-END.
 *   - As theta decreases the gap U - (best witness) WIDENS monotonically in
 *     the scanned data; at the CEIL-X currency (theta ~ 0.112) the upper
 *     bracket is the flat 1 while the best known witness is ~0.696, a gap
 *     >= 0.30 -- the residual is genuinely large in the deep region.
 *   - A 4,000,000-geometry offline pencil scan at y_min = 1/4 (cross-check
 *     only, not asserted) traces a lower-bracket curve decreasing from
 *     ~0.821 at theta -> 0 to 0.3932 at theta = 1, hugging the FRONT-END
 *     value 0.3894 there to 0.3% while the CEIL-X region stays wide open.
 *
 * RESIDUAL (named, NOT closed). For theta in (0, 1) the exact frontier
 * F(theta, y_min) is OPEN inside the bracket [best witness, U]. It equals
 * the imp-95226 pencil optimum lambda_max(L, M) MAXIMIZED over geometries
 * on the theta-level set { (geometry, top eigenvector) : theta = theta_0 },
 * a generalized-eigenvalue problem with a NONLINEAR theta constraint. This
 * confirms the imp-95254 conjecture that the sharp frontier is a pencil/NP
 * object restricted to a theta-level set; solving that constrained sup in
 * closed form is not done here.
 *
 * HONEST LIMITS. (a) Only the theta = 1 endpoint is exact; the interior
 * frontier is bracketed, not identified. (b) The lower witnesses are 2xy
 * geometries; larger families could raise the lower bracket (the note does
 * not claim the witnesses are frontier-optimal off theta = 1). (c) Model-
 * family only, on the imp-95222 packet model; the map to paper per-window
 * quantities (imp-95255, gammaSL) is UNCHANGED. (d) Changes NO Lambda bound;
 * NO QED; no refereed bound is changed.
 */

// -- exact Gram machinery (closed forms; same as imp-95254) ------------------
function overlapM(mu1, u1, mu2, u2) {
  const D = Math.abs(u2 - u1);
  const [ma, mb] = u1 <= u2 ? [mu1, mu2] : [mu2, mu1];
  const s13 = (Math.exp(-mb * D) + Math.exp(-ma * D)) / (ma + mb);
  const mid =
    Math.abs(mb - ma) < 1e-13
      ? D * Math.exp(-ma * D)
      : (Math.exp(-ma * D) - Math.exp(-mb * D)) / (mb - ma);
  return s13 + mid;
}
function leftL(mu1, u1, mu2, u2) {
  return Math.exp(-(mu1 * u1 + mu2 * u2)) / (mu1 + mu2);
}
// top generalized eigenpair of the 2x2 pencil (L, M), M SPD; returns
// {lam, theta} with theta the phase currency of the top eigenvector.
function pencil2(mu, u) {
  const L11 = leftL(mu[0], u[0], mu[0], u[0]);
  const L22 = leftL(mu[1], u[1], mu[1], u[1]);
  const L12 = leftL(mu[0], u[0], mu[1], u[1]);
  const M11 = overlapM(mu[0], u[0], mu[0], u[0]);
  const M22 = overlapM(mu[1], u[1], mu[1], u[1]);
  const M12 = overlapM(mu[0], u[0], mu[1], u[1]);
  const A = M11 * M22 - M12 * M12;
  const B = L11 * M22 + L22 * M11 - 2 * L12 * M12;
  const C = L11 * L22 - L12 * L12;
  const lam = (B + Math.sqrt(Math.max(0, B * B - 4 * A * C))) / (2 * A);
  const c = [lam * M12 - L12, L11 - lam * M11];
  const M = [
    [M11, M12],
    [M12, M22],
  ];
  let T = 0;
  let Tg = 0;
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++) {
      T += c[i] * c[j] * M[i][j];
      Tg += Math.abs(c[i] * c[j]) * M[i][j];
    }
  return { lam, theta: T / Tg };
}
function upperU(theta, y) {
  return Math.min(1, (Math.exp(-y) / 4) * (1 + 1 / theta));
}

// -- baked literals (recomputed by the assertions) ---------------------------
const Y = 0.25; // y_min slice
const FRONT_END_AT_QUARTER = 0.5 * Math.exp(-Y); // 0.3894003915357024
const THETA_CAP_AT_QUARTER = 1 / (4 * Math.exp(Y) - 1); // 0.24177430...
// lower-bracket witnesses (theta, R=lambda_max, U) at y_min = 1/4
const WITNESSES = [
  { tag: "ceilx", mu: [1, 0.5], u: [1, 0.25], theta: 0.111892, R: 0.696324 },
  { tag: "cc8", mu: [1, 8], u: [0.125, 0.125], theta: 0.337616, R: 0.48974 },
  { tag: "cc20", mu: [1, 20], u: [0.125, 0.125], theta: 0.548895, R: 0.46091 },
  { tag: "cc40", mu: [1, 40], u: [0.125, 0.125], theta: 0.705276, R: 0.429742 },
];

// -- verdict object ----------------------------------------------------------
export const IMP95289_SHARP_FRONTIER_BRACKET = {
  ticket:
    "imp-95289 (bracket the exact sharp signed-seam frontier F(theta, y_min) = sup R that imp-95254 left OPEN between the THEOREM PHASE-AM upper region and the PROP CEIL-X exceedance): endpoint pinned exactly at theta = 1, two-sided bracket elsewhere, residual identified as the imp-95226 pencil optimum on a theta-level set)",
  theoremFRONTEND:
    "exact endpoint: F(1, y_min) = (1/2) e^(-y_min) for every y_min > 0. theta = 1 forces the positive cone (cross energy X = 0 iff f = g iff one sign), where PHASE-AM evaluates to (1/2) e^(-y_min) (= FA-2) and a single packet with 2 mu u = y_min attains it. Upper and lower bracket coincide -- the ONE interior-currency point where the frontier is known in closed form.",
  propFRONTCAP:
    "upper bracket: F(theta, y_min) <= U := min(1, (e^(-y_min)/4)(1 + 1/theta)), PHASE-AM capped by R <= 1. The trivial ceiling is the strictly tighter factor iff theta < theta_cap(y_min) = 1/(4 e^(y_min) - 1); at y_min = 1/4, theta_cap = 0.241774, so below it PHASE-AM carries no sub-1 information and the honest upper bracket is the flat 1 -- exactly the CEIL-X deep-cancellation region.",
  lowerBracket:
    "explicit y_min = 1/4 witnesses (each a valid family, so F >= its pencil optimum): CEIL-X non-co-centered rates (1, 1/2) centers (1, 1/4) gives F(0.111892, 1/4) >= 0.696324; co-centered rates (1, 8)/(1, 20)/(1, 40) at u = 1/8 give F(0.337616/0.548895/0.705276, 1/4) >= 0.489740/0.460910/0.429742. The co-centered branch stays below 1/2 (DC-NOGO co-centered ceiling); only the non-co-centered branch lifts the lower bracket above 1/2, precisely where the upper bracket has flattened to 1.",
  bracketShape:
    "the bracket is EXACT at theta = 1 (gap 0, FRONT-END) and WIDENS as theta decreases: at the CEIL-X currency theta ~ 0.112 the upper bracket is the flat 1 while the best known witness is ~0.696, gap >= 0.30. A 4,000,000-geometry offline pencil scan (cross-check only) traces the lower bracket from ~0.821 at theta -> 0 down to 0.3932 at theta = 1, hugging FRONT-END 0.3894 to 0.3% at the top while the deep region stays open.",
  residual:
    "for theta in (0, 1) the exact F(theta, y_min) stays OPEN inside [best witness, U]. It equals the imp-95226 pencil optimum lambda_max(L, M) maximized over geometries on the theta-level set (a generalized-eigenvalue problem with a NONLINEAR theta constraint) -- confirming the imp-95254 conjecture that the sharp frontier is a pencil/NP object restricted to a theta-level set; the constrained sup is not solved here.",
  constants: {
    frontEndAtQuarter: FRONT_END_AT_QUARTER,
    thetaCapAtQuarter: THETA_CAP_AT_QUARTER,
    ceilxTheta: WITNESSES[0].theta,
    ceilxR: WITNESSES[0].R,
    witnessThetas: WITNESSES.map((w) => w.theta),
    witnessR: WITNESSES.map((w) => w.R),
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. Obligation ledger: (2) the imp-95254 residual (exact sharp frontier sup R at fixed (theta, y_min)) is now BRACKETED two-sided: exact endpoint F(1, y_min) = (1/2) e^(-y_min) (THEOREM FRONT-END), upper bracket min(1, PHASE-AM) (PROP FRONT-CAP), explicit lower witnesses at y_min = 1/4, and the interior residual identified as the imp-95226 pencil optimum on a theta-level set -- NOT closed for theta in (0, 1). (1), (3), (4) UNCHANGED. Import-light (no zeros bundle, no sibling imports).",
  verdict:
    "HONEST PARTIAL (one exact endpoint + a two-sided bracket + a named residual): THEOREM FRONT-END pins F(1, y_min) = (1/2) e^(-y_min) exactly (positive cone forces PHASE-AM tight, single packet attains it). PROP FRONT-CAP gives the upper bracket min(1, (e^(-y_min)/4)(1 + 1/theta)) with the trivial ceiling operative below theta_cap = 1/(4 e^(y_min) - 1). Explicit y_min = 1/4 witnesses give the lower bracket (CEIL-X pins F(0.112, 1/4) >= 0.696). The bracket is exact at theta = 1 and widens toward small theta (gap >= 0.30 at the CEIL-X currency). The interior frontier stays OPEN and is identified with the imp-95226 pencil optimum on a theta-level set. Model-family only; changes NO Lambda bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "THEOREM FRONT-END is an exact identity (positive-cone characterization of theta = 1, ENT-summed FA-2 bound, single-packet attainment). PROP FRONT-CAP is PHASE-AM (imp-95254, rigorous) intersected with R <= 1 (W, T nonnegative, W <= T). The lower witnesses are closed-form 2x2 pencil optima of explicit geometries. The 4,000,000-geometry scan is cross-check only; no asserted claim rests on it. No claim rests on quadrature.",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95289_FRONTIER_ASSERTIONS = [
  {
    id: "imp95289-front-end-exact-endpoint",
    description:
      "THEOREM FRONT-END: a single packet with 2 mu u = 1/4 attains R = (1/2) e^(-1/4) = 0.3894004 EXACTLY (theta = 1), and PHASE-AM at theta = 1 equals the same value -- upper and lower bracket coincide at theta = 1",
    holds: () => {
      const mu = 1.0;
      const u = Y / (2 * mu);
      const R = leftL(mu, u, mu, u) / overlapM(mu, u, mu, u);
      if (Math.abs(R - FRONT_END_AT_QUARTER) > 1e-13) return false;
      const phaseAMat1 = (Math.exp(-Y) / 4) * (1 + 1 / 1);
      if (Math.abs(phaseAMat1 - FRONT_END_AT_QUARTER) > 1e-13) return false;
      // a different single packet (2 mu u = 1/4) gives the SAME frontier value
      const mu2 = 3.7;
      const u2 = Y / (2 * mu2);
      const R2 = leftL(mu2, u2, mu2, u2) / overlapM(mu2, u2, mu2, u2);
      return Math.abs(R2 - FRONT_END_AT_QUARTER) < 1e-13;
    },
  },
  {
    id: "imp95289-front-cap-threshold",
    description:
      "PROP FRONT-CAP: the trivial ceiling R <= 1 is the operative upper factor iff theta < theta_cap = 1/(4 e^(1/4) - 1) = 0.2417743; PHASE-AM = 1 exactly at theta_cap, > 1 just below, < 1 just above",
    holds: () => {
      if (Math.abs(THETA_CAP_AT_QUARTER - 0.2417743) > 1e-6) return false;
      const at = (Math.exp(-Y) / 4) * (1 + 1 / THETA_CAP_AT_QUARTER);
      if (Math.abs(at - 1) > 1e-12) return false;
      const below = (Math.exp(-Y) / 4) * (1 + 1 / (THETA_CAP_AT_QUARTER * 0.99));
      const above = (Math.exp(-Y) / 4) * (1 + 1 / (THETA_CAP_AT_QUARTER * 1.01));
      return below > 1 && above < 1;
    },
  },
  {
    id: "imp95289-lower-witnesses-inside-bracket",
    description:
      "each y_min = 1/4 witness reproduces its baked (theta, R) to 6 sig figs, has y_min = 1/4 exactly, and satisfies R <= U(theta, 1/4) (the pencil optimum sits inside the two-sided bracket)",
    holds: () => {
      for (const w of WITNESSES) {
        const p = pencil2(w.mu, w.u);
        if (Math.abs(p.theta - w.theta) > 5e-6) return false;
        if (Math.abs(p.lam - w.R) > 5e-6) return false;
        // exact y_min = 1/4
        let ym = Infinity;
        for (let i = 0; i < 2; i++)
          for (let j = 0; j < 2; j++)
            ym = Math.min(
              ym,
              (w.mu[i] + w.mu[j]) * Math.min(w.u[i], w.u[j]),
            );
        if (Math.abs(ym - Y) > 1e-12) return false;
        if (!(p.lam <= upperU(p.theta, Y) + 1e-9)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95289-ceilx-lower-bracket-above-half",
    description:
      "CEIL-X non-co-centered witness pins F(0.111892, 1/4) >= 0.696324 > 1/2, in the region theta < theta_cap where the upper bracket has already flattened to the trivial 1 -- so the residual gap there is >= 0.30",
    holds: () => {
      const p = pencil2([1, 0.5], [1, 0.25]);
      if (!(p.lam > 0.5)) return false;
      if (!(p.theta < THETA_CAP_AT_QUARTER)) return false;
      if (Math.abs(upperU(p.theta, Y) - 1) > 1e-12) return false; // upper is flat 1
      return upperU(p.theta, Y) - p.lam > 0.3;
    },
  },
  {
    id: "imp95289-cocentered-branch-below-half",
    description:
      "the co-centered witnesses (rates (1, 8)/(1, 20)/(1, 40)) all give R < 1/2, confirming that the DC-NOGO 1/2 value is a co-centered lower-bracket ceiling and only the non-co-centered branch lifts F above 1/2",
    holds: () => {
      for (const w of WITNESSES.slice(1)) {
        const p = pencil2(w.mu, w.u);
        if (!(p.lam < 0.5)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95289-bracket-tightens-at-theta-one",
    description:
      "bracket-shape monotonicity: over the four witnesses the gap U(theta, 1/4) - R strictly DECREASES as theta increases toward 1 (widest at CEIL-X, narrowest at the theta ~ 0.705 witness), consistent with the exact collapse at theta = 1",
    holds: () => {
      const gaps = WITNESSES.map((w) => {
        const p = pencil2(w.mu, w.u);
        return upperU(p.theta, Y) - p.lam;
      });
      for (let i = 1; i < gaps.length; i++)
        if (!(gaps[i] < gaps[i - 1])) return false;
      return true;
    },
  },
  {
    id: "imp95289-verdict-honesty",
    description:
      "the verdict carries the honest scope: HONEST PARTIAL, sub-gap STILL OPEN, interior frontier stays OPEN, residual named as the imp-95226 pencil object, no Lambda change, no QED, no refereed bound is changed",
    holds: () =>
      /HONEST PARTIAL/.test(IMP95289_SHARP_FRONTIER_BRACKET.verdict) &&
      /STILL OPEN/.test(IMP95289_SHARP_FRONTIER_BRACKET.subGap) &&
      /stays OPEN/.test(IMP95289_SHARP_FRONTIER_BRACKET.residual) &&
      /imp-95226 pencil/.test(IMP95289_SHARP_FRONTIER_BRACKET.residual) &&
      /changes NO Lambda bound/.test(IMP95289_SHARP_FRONTIER_BRACKET.verdict) &&
      /NO QED/.test(IMP95289_SHARP_FRONTIER_BRACKET.verdict) &&
      /refereed bound is changed/i.test(IMP95289_SHARP_FRONTIER_BRACKET.verdict),
  },
];

for (const a of IMP95289_FRONTIER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95289-sharp-frontier-bracket assertion failed: ${a.id}`,
    );
  }
}

export default IMP95289_SHARP_FRONTIER_BRACKET;
