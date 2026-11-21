/**
 * imp-95290: ASSESSMENT of the signed WEIGHT port (obligation (2) weight leg
 * of the imp-95142 signed-certificate obligation ledger). The ledger records
 * the WEIGHT leg OPEN: TVC composition is positive-cone, so signed
 * cross-octave weight composition is a named residual with no delivered
 * certificate. This module asks the two routes named on the ticket -- can the
 * octave-Szasz universal weight W (imp-95219) or the SGN-C count certificate
 * (imp-95225) be composed ACROSS OCTAVES in the signed regime to price
 * Lambda by weight rather than count -- and PINS the cone obstruction that
 * blocks both. It DERIVES NO BOUND and claims NO certificate.
 *
 * OBJECT (imp-95226 exact). On distinct rates nu_1 < ... < nu_N > 0 at depth
 * d > 0, with Cauchy Gram G_ij = 1/(nu_i + nu_j) and D = diag(w_i),
 * w_i = e^(-d nu_i), the signed shift constant is EXACTLY
 *   Lambda(nu, d) = lambda_max of the symmetric pencil (D G D, G).
 * Lambda sups over ALL signs (the signed worst case); the positive-cone /
 * TVC devices (imp-95218) bound the strictly smaller nonnegative-amplitude
 * seam ratio R, which is why they do not price Lambda.
 *
 * BOTH NAMED ROUTES REDUCE TO ONE ISOLATED-BLOCK COMPOSITION. Group rates
 * into dyadic octaves with occupancy M_j; the octave-Szasz weight is
 * W = sum_j M_j 2^(-j) (imp-95219 H-SZW). A W-priced signed certificate would
 * accumulate a per-octave factor octave-by-octave (log-additive in the octave
 * weight); a SGN-C-composed certificate would multiply the per-octave count
 * bound octave-by-octave. Both are the SAME isolated-block multiplicative
 * composition sqrt(Lambda_union) <=? prod_j (1 + s_j) - 1 with s_j the
 * per-octave factor -- exactly candidate WP-A of imp-95133. The signed
 * question is whether ANY choice of the per-octave factor s_j makes that
 * composition a valid upper bound.
 *
 * FINDING A -- THE FAILURE IS THE COMPOSITION RULE, NOT THE PER-OCTAVE
 * PRICING (this is the sharpening over imp-95133 WP-A). Take one rate per
 * octave. Then each octave holds a SINGLE rate, and the per-octave signed
 * constant is EXACT with NO within-octave coalescence: Lam_j = e^(-2 d nu_j),
 * i.e. the sharpest possible per-octave factor s_j = e^(-d nu_j) is the exact
 * single-rate SGN-EQ value, and the SGN-C count certificate at N_j = 1
 * COINCIDES with it (SGN-C reduces to SGN-EQ at one rate). Yet the isolated
 * composition still UNDERSHOOTS the true signed constant: for rates
 * 1.5, 3, 6 at d = 6 (three octaves), sqrt(Lambda_union) = 6.16927184e-4
 * STRICTLY EXCEEDS the octave product 1.23425036e-4 by ratio 4.99839582 > 1.
 * Because the per-octave factor is already EXACT here, the ~5x deficit is
 * attributable ENTIRELY to the composition rule -- no sharpening of the
 * per-octave certificate (finer SGN-C, tighter octave weight) can rescue an
 * isolated-block composition. So neither the SGN-C count certificate nor the
 * octave-Szasz weight W composes across octaves in the signed regime.
 *
 * FINDING B -- THE DEFICIT COMPOUNDS WITH OCTAVE COUNT. The octave product
 * stays PINNED at 1.23425036e-4 (dominated by the shallowest octave
 * e^(-d nu_1) = e^(-9)) as octaves are added, while the true signed constant
 * GROWS: sqrt(Lambda_union) = 3.70188800e-4 / 6.16927184e-4 / 7.93145681e-4
 * at 2 / 3 / 4 octaves, so the undershoot ratio RISES 2.99930072 ->
 * 4.99839582 -> 6.42613287. Any additive-in-octave-weight accumulation of a
 * valid per-octave factor therefore diverges FURTHER from truth as octaves
 * accumulate -- and it worsens with exactly the octave-depth ladder the
 * weight W is meant to use. The W-additive route is refuted structurally,
 * not merely found vacuous.
 *
 * THE CONE OBSTRUCTION (mechanism, quantified). The isolated octave product
 * equals the BLOCK-DIAGONAL value of the pencil -- it discards the
 * cross-octave Gram mass 1/(nu_i + nu_j) between rates in different octaves.
 * The Cauchy / Szego kernel is LONG-RANGE, so those off-diagonal blocks carry
 * positive mass that the signed operator constant Lambda = lambda_max(DGD, G)
 * accumulates; dropping them undershoots, and the deficit grows with the
 * number of coupled blocks (Finding B). This is the precise sense in which
 * TVC composition is positive-cone: for NONNEGATIVE amplitudes the seam ratio
 * R factorizes across disjoint rate blocks, but the signed pencil eigenvalue
 * does not factorize -- so no weight/count currency that accumulates
 * octave-by-octave can price it from below-the-true-value factors.
 *
 * HONEST SCOPE. This is an ASSESSMENT: no bound is derived, no certificate is
 * claimed. It sharpens imp-95133 WP-A by isolating the defect to the
 * composition RULE (per-octave pricing is exact at one rate per octave, yet
 * the composition still undershoots, and the deficit compounds with octave
 * count). The valid-but-vacuous coupling-aware product WP-B and the surviving
 * open lever -- a TAPERED inner-function split whose per-factor sup-norm is
 * discounted by the octave weight 2^(-j) -- are UNCHANGED (imp-95133); no such
 * weight-priced bound is known. The count leg (SGN-C, SGN-NP) stays terminal
 * in count currency; the depth-only leg stays dead (imp-95224 DC-NOGO).
 * Sub-gap imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN; obligation
 * (2) weight leg OPEN; no Lambda bound changes; NO QED; no refereed bound is changed.
 *
 * NUMERICAL RELIABILITY. All probes use shallow, well-separated,
 * well-conditioned octave-spread configs (one rate per octave, ratio 2, far
 * above the ~1e-3 within-octave spacing threshold below which
 * double-precision pencil solves fabricate values -- the imp-95225 referee
 * trap) and are converged (1500 vs 5000 power-iteration steps agree to 8
 * digits). Import-light (no zeros bundle, no sibling imports); assertions
 * recompute every literal and THROW on violation.
 */

// -- baked literals (recomputed by the assertions) ----------------------------
// one rate per octave, rates 1.5 * 2^k, depth d = 6; octave product pinned by
// the shallowest octave e^(-9); true signed sqrt(Lambda) grows with octaves.
const OCTAVE_PRODUCT_PINNED = 1.23425036e-4; // prod (1 + e^(-d nu_j)) - 1, all counts
const SQRT_LAMBDA_2OCT = 3.70188800e-4; // true sqrt(Lambda_union), 2 octaves
const SQRT_LAMBDA_3OCT = 6.16927184e-4; // true sqrt(Lambda_union), 3 octaves
const SQRT_LAMBDA_4OCT = 7.93145681e-4; // true sqrt(Lambda_union), 4 octaves
const UNDERSHOOT_2OCT = 2.99930072; // > 1 => isolated composition not a bound
const UNDERSHOOT_3OCT = 4.99839582;
const UNDERSHOOT_4OCT = 6.42613287;

// -- pencil lambda_max(T G T, G) for a real target diagonal T -----------------
function gaussSolve(Ain, bin) {
  const n = Ain.length;
  const M = Ain.map((r, i) => [...r, bin[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++)
      if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const fac = M[r][c] / M[c][c];
      for (let j = c; j <= n; j++) M[r][j] -= fac * M[c][j];
    }
  }
  return M.map((r, i) => r[n] / M[i][i]);
}
function pencilLam(nus, t, iters) {
  const G = nus.map((a) => nus.map((b) => 1 / (a + b)));
  const H = nus.map((a, i) => nus.map((b, j) => (t[i] * t[j]) / (a + b)));
  let v = nus.map((_, i) => 1 + 0.13 * i);
  let lam = 0;
  for (let it = 0; it < (iters || 5000); it++) {
    const Hv = H.map((row) => row.reduce((s, e, j) => s + e * v[j], 0));
    const w = gaussSolve(
      G.map((r) => [...r]),
      Hv,
    );
    const nrm = Math.sqrt(w.reduce((s, e) => s + e * e, 0)) || 1;
    v = w.map((e) => e / nrm);
    const Hv2 = H.map((row) => row.reduce((s, e, j) => s + e * v[j], 0));
    const Gv = G.map((row) => row.reduce((s, e, j) => s + e * v[j], 0));
    lam =
      v.reduce((s, e, i) => s + e * Hv2[i], 0) /
      v.reduce((s, e, i) => s + e * Gv[i], 0);
  }
  return Math.abs(lam);
}

// one rate per octave: rates 1.5 * 2^k, k = 0..nOct-1, depth d
function octaveConfig(nOct, d) {
  const nus = [];
  for (let k = 0; k < nOct; k++) nus.push(1.5 * Math.pow(2, k));
  const w = nus.map((nu) => Math.exp(-d * nu));
  const sqrtUnion = Math.sqrt(pencilLam(nus, w, 1500));
  // one rate per octave => per-octave factor is EXACT (SGN-EQ = SGN-C at N=1)
  let prod = 1;
  for (const nu of nus) prod *= 1 + Math.exp(-d * nu);
  prod -= 1;
  return { sqrtUnion, octaveProduct: prod, undershoot: sqrtUnion / prod };
}

// -- verdict object -----------------------------------------------------------
export const IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSESSMENT = {
  ticket:
    "imp-95290 (ASSESSMENT of the signed WEIGHT port, obligation (2) weight leg of the imp-95142 ledger: can the octave-Szasz weight W (imp-95219) or the SGN-C count certificate (imp-95225) be composed across octaves in the signed regime, or what cone obstruction blocks them; derive NO bound)",
  object:
    "signed shift constant Lambda(nu, d) = lambda_max of the pencil (D G D, G), G_ij = 1/(nu_i + nu_j), D = diag(e^(-d nu_i)); the signed worst case over all amplitude signs. The positive-cone / TVC devices bound the strictly smaller nonnegative-amplitude seam ratio R, so they do not price Lambda.",
  reduction:
    "BOTH named routes reduce to ONE isolated-block composition. A W-priced certificate accumulates a per-octave factor octave-by-octave (log-additive in the octave weight 2^(-j)); a SGN-C-composed certificate multiplies the per-octave count bound octave-by-octave. Both are sqrt(Lambda_union) <=? prod_j (1 + s_j) - 1 with s_j the per-octave factor -- exactly candidate WP-A of imp-95133. The signed question: does ANY per-octave factor s_j make this a valid upper bound.",
  findingA:
    "THE FAILURE IS THE COMPOSITION RULE, NOT THE PER-OCTAVE PRICING (sharpening over imp-95133 WP-A). At one rate per octave the per-octave signed constant is EXACT with no within-octave coalescence: Lam_j = e^(-2 d nu_j), so the sharpest per-octave factor s_j = e^(-d nu_j) is the exact single-rate SGN-EQ value and SGN-C at N_j = 1 COINCIDES with it. Yet the isolated composition still UNDERSHOOTS: for rates 1.5, 3, 6 at d = 6, sqrt(Lambda_union) = 6.16927184e-4 exceeds the octave product 1.23425036e-4 by 4.99839582 > 1. Since the per-octave factor is already exact, the deficit is attributable ENTIRELY to the composition rule -- no per-octave sharpening can rescue an isolated-block composition, so neither SGN-C nor W composes across octaves in the signed regime.",
  findingB:
    "THE DEFICIT COMPOUNDS WITH OCTAVE COUNT. The octave product stays PINNED at 1.23425036e-4 (dominated by the shallowest octave e^(-9)) as octaves are added, while the true signed constant GROWS: sqrt(Lambda_union) = 3.70188800e-4 / 6.16927184e-4 / 7.93145681e-4 at 2 / 3 / 4 octaves, so the undershoot ratio RISES 2.99930072 -> 4.99839582 -> 6.42613287. Any additive-in-octave-weight accumulation diverges FURTHER from truth as octaves accumulate -- worsening with exactly the octave-depth ladder W is meant to use; the W-additive route is refuted structurally, not merely vacuous.",
  coneObstruction:
    "the isolated octave product equals the BLOCK-DIAGONAL value of the pencil -- it discards the cross-octave Gram mass 1/(nu_i + nu_j) between rates in different octaves. The Cauchy / Szego kernel is LONG-RANGE, so those off-diagonal blocks carry positive mass that Lambda = lambda_max(D G D, G) accumulates; dropping them undershoots and the deficit grows with the number of coupled blocks. This is the precise sense in which TVC composition is positive-cone: R factorizes across disjoint blocks for nonnegative amplitudes, but the signed pencil eigenvalue does not -- no weight/count currency accumulated octave-by-octave can price it.",
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. Obligation (2) currency ledger: depth leg DEAD (imp-95224 DC-NOGO); COUNT leg TERMINAL (imp-95225 SGN-C, imp-95226 SGN-NP); WEIGHT leg OPEN -- this module confirms neither SGN-C nor W composes across octaves and pins the obstruction to the composition rule; the tapered-split weight-discounted per-factor bound (imp-95133 surviving open freedom) is unchanged and OPEN; modulus/phase leg OPEN.",
  verdict:
    "ASSESSMENT (no bound derived): the signed WEIGHT port cannot be reached by composing the SGN-C count certificate or the octave-Szasz weight W across octaves. Both reduce to an isolated-block multiplicative composition that UNDERSHOOTS the signed operator constant even when the per-octave factor is EXACT (one rate per octave, SGN-EQ), and the deficit COMPOUNDS with octave count (2.999 -> 4.998 -> 6.426 at 2/3/4 octaves) -- so the obstruction is the composition RULE (long-range cross-octave Gram mass), not per-octave pricing looseness. The surviving lever remains a tapered inner-function split whose per-factor sup-norm is discounted by the octave weight (imp-95133); no such weight-priced bound is known. Sub-gap STILL OPEN; obligation (2) weight leg OPEN; count leg unchanged and terminal; no Lambda bound changes; NO QED; no refereed bound is changed.",
  constants: {
    octaveProductPinned: OCTAVE_PRODUCT_PINNED,
    sqrtLambda2Oct: SQRT_LAMBDA_2OCT,
    sqrtLambda3Oct: SQRT_LAMBDA_3OCT,
    sqrtLambda4Oct: SQRT_LAMBDA_4OCT,
    undershoot2Oct: UNDERSHOOT_2OCT,
    undershoot3Oct: UNDERSHOOT_3OCT,
    undershoot4Oct: UNDERSHOOT_4OCT,
  },
};

// -- assertions (self-executing; import-light; THROW on violation) ------------
export const IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSERTIONS = [
  {
    id: "imp95290-exact-per-octave-still-undershoots",
    description:
      "FINDING A: at one rate per octave (rates 1.5, 3, 6; d = 6) the per-octave factor is EXACT (SGN-EQ = SGN-C at N = 1), yet the isolated composition undershoots -- true sqrt(Lambda_union) = 6.16927184e-4 exceeds the octave product 1.23425036e-4 by 4.99839582 > 1, so the defect is the composition rule, not per-octave pricing",
    holds: () => {
      const r = octaveConfig(3, 6);
      if (Math.abs(r.sqrtUnion / SQRT_LAMBDA_3OCT - 1) > 1e-4) return false;
      if (Math.abs(r.octaveProduct / OCTAVE_PRODUCT_PINNED - 1) > 1e-4)
        return false;
      if (Math.abs(r.undershoot - UNDERSHOOT_3OCT) > 1e-3) return false;
      return r.undershoot > 1; // isolated composition is NOT an upper bound
    },
  },
  {
    id: "imp95290-deficit-compounds-with-octave-count",
    description:
      "FINDING B: the octave product stays pinned at 1.23425036e-4 while the true signed constant grows 3.70188800e-4 / 6.16927184e-4 / 7.93145681e-4 across 2 / 3 / 4 octaves, so the undershoot ratio RISES 2.99930072 -> 4.99839582 -> 6.42613287 -- any octave-additive weight accumulation diverges further from truth as octaves accumulate",
    holds: () => {
      const r2 = octaveConfig(2, 6);
      const r3 = octaveConfig(3, 6);
      const r4 = octaveConfig(4, 6);
      // octave product is pinned by the shallowest octave, count-independent
      if (Math.abs(r2.octaveProduct / OCTAVE_PRODUCT_PINNED - 1) > 1e-4)
        return false;
      if (Math.abs(r3.octaveProduct / OCTAVE_PRODUCT_PINNED - 1) > 1e-4)
        return false;
      if (Math.abs(r4.octaveProduct / OCTAVE_PRODUCT_PINNED - 1) > 1e-4)
        return false;
      // true signed constant grows with octave count
      if (Math.abs(r2.sqrtUnion / SQRT_LAMBDA_2OCT - 1) > 1e-4) return false;
      if (Math.abs(r4.sqrtUnion / SQRT_LAMBDA_4OCT - 1) > 1e-4) return false;
      if (Math.abs(r2.undershoot - UNDERSHOOT_2OCT) > 1e-3) return false;
      if (Math.abs(r4.undershoot - UNDERSHOOT_4OCT) > 1e-3) return false;
      // strictly increasing deficit
      return r2.undershoot < r3.undershoot && r3.undershoot < r4.undershoot;
    },
  },
  {
    id: "imp95290-verdict-honesty",
    description:
      "the verdict carries the honest scope: no bound derived, both routes fail to compose, the defect is the composition rule, the tapered-split lever is unchanged and open, sub-gap STILL OPEN, count leg terminal and unchanged, no QED, no refereed bound is changed",
    holds: () =>
      /no bound derived/.test(
        IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSESSMENT.verdict,
      ) &&
      /UNDERSHOOTS/.test(
        IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSESSMENT.verdict,
      ) &&
      /composition RULE/.test(
        IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSESSMENT.verdict,
      ) &&
      /STILL OPEN/.test(IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSESSMENT.subGap) &&
      /WEIGHT leg OPEN/.test(
        IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSESSMENT.subGap,
      ) &&
      /NO QED/.test(IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSESSMENT.verdict),
  },
];

for (const a of IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95290-signed-weight-composition-assessment assertion failed: ${a.id}`,
    );
  }
}

export default IMP95290_SIGNED_WEIGHT_COMPOSITION_ASSESSMENT;
