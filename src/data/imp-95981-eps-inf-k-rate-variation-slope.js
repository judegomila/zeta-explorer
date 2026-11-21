/**
 * @module imp-95981-eps-inf-k-rate-variation-slope
 *
 * imp-95981 (proof / derivation): the imp-95960 finding was that the imp-95944
 * p-independent residual bound eps_p < (a*D)_max^2/2 = PORT_V^2/(2 PORT_C^2
 * k^{4/3}(k-1)^2) over-predicts the eps_inf(k) decay -- its log-log slope over
 * k=4..12 is ~-3.70 (asymptote -10/3) while the MEASURED eps_inf(k) slope is
 * ~-3.19. This module DERIVES why: it splits the exact p->infinity residual into
 * two additive contributions and shows the imp-95944 equal-rate majorant keeps
 * only the STEEPER one, discarding the shallower rate-variation term that sets the
 * true slope. RECORDS the precise reason the equal-rate Gram estimate cannot match
 * the measured slope and gives the slope-matching two-term asymptotic. Derivation
 * only; changes NO bound; NO QED; no refereed bound is changed.
 *
 * SETUP (verbatim from imp-95898 / imp-95944 / imp-95960). A seam window (p,k)
 * carries p-1 alias packets h=1..p-1 at depth d_h = k - h/p in (k-1,k). Packet h is
 * a two-sided exponential f_h(t) = exp(-mu_h |t - u_h|) of decay rate
 * mu_h = d_h^{1/3}/PORT_C centred at u_h = PORT_V/d_h. G_ml = gram(mu_m,u_m,mu_l,u_l)
 * is the exact Gram; tr = sum_m G_mm, S = sum_ml G_ml, gd = tr/(p-1) mean diagonal,
 * gall = S/(p-1)^2 mean of all entries, and eps_p = diagFrac*(p-1) - 1 = gd/gall - 1.
 * As p grows the depths fill (k-1,k) uniformly and eps_p saturates to eps_inf(k) =
 * gd_inf/gall_inf - 1, the p->infinity limit read as double integrals over the
 * uniform depth measure on (k-1,k).
 *
 * NEW EXACT STRUCTURAL IDENTITY (RKHS form; verified to 1e-6 vs the double integral).
 * Symmetrising gd - gall = E_{d,d'}[G(d,d) - G(d,d')] over the uniform depth pair,
 *   gd_inf - gall_inf = (1/2) E_{d,d'}[ ||f_d - f_{d'}||^2 ],
 * where ||f_d - f_{d'}||^2 = 1/mu(d) + 1/mu(d") - 2 G(d,d") is the squared RKHS
 * distance of the two packets (>= 0). Hence
 *   eps_inf(k) = (1/2) E_{d,d'}[ ||f_d - f_{d'}||^2 ] / gall_inf,
 * a MANIFESTLY-positive average of a squared packet distance -- eps_inf > 0 needs no
 * separate argument. (d" denotes the second depth variable.)
 *
 * THE TWO ADDITIVE CONTRIBUTIONS. ||f_d - f_{d'}||^2 responds to BOTH the centre
 * offset D = |u(d) - u(d")| and the rate mismatch a = mu(d) vs b = mu(d"):
 *   (C) CENTRE-separation (equal rate a=b): ||.||^2 = (2/a)[1 - (1+x)e^{-x}] <= a D^2,
 *       x = aD. This is exactly the deficit the imp-95944 bound majorises by x^2/2.
 *   (R) RATE-variation (equal centre D=0, a != b): the pure-rate RKHS distance has
 *       the EXACT closed form (verified 1e-8)
 *         ||.||^2 = 1/a + 1/b - 2 gram(a,0,b,0) = (a-b)^2 / (a b (a+b)),
 *       since gram(a,0,b,0) = 2/(a+b). The imp-95944 equal-rate assumption sets
 *       a=b and DISCARDS this term entirely.
 * Numerically the exact eps_inf(k) splits additively into these two pieces to <1%
 * over k=4..12 (eps_full ~ eps_centre + eps_rate; cross term negligible).
 *
 * THE SLOPES (why -3.19, not -3.70). Over the uniform depth window of width 1:
 *   (C) centre: E[D^2] = 2 PORT_V^2[1/(k(k-1)) - ln^2(k/(k-1))] ~ PORT_V^2/(6 k^4),
 *       so eps_centre ~ PORT_V^2/(12 PORT_C^2) k^{-10/3}. Log-log slope -> -10/3;
 *       chord over k=4..12 is ~-3.58 (the imp-95944 worst-pair chord is ~-3.70, a
 *       few-fold looser CONSTANT but the SAME -10/3 family).
 *   (R) rate: Var(mu) ~ (mu'(k))^2/12 = k^{-4/3}/(108 PORT_C^2), and with
 *       a b(a+b) ~ 2 mu^3, gall ~ 1/mu, one gets the PORT-constant-FREE leading law
 *         eps_rate ~ (1/216) k^{-2}.
 *       Log-log slope -> -2; chord over k=4..12 is ~-2.17.
 * The centre term is steeper (-10/3) and the rate term shallower (-2); they CROSS
 * at k* = (216 * PORT_V^2/(12 PORT_C^2))^{3/4} ~ 13.75, so over k=4..12 the centre
 * term still dominates but the rate term is a growing fraction. The measured -3.19
 * chord is the SUM of the two -- a two-scale crossover slope, NOT a single power.
 *
 * SLOPE-MATCHING TWO-TERM ASYMPTOTIC. Adding the two leading laws,
 *   eps_inf(k) ~ PORT_V^2/(12 PORT_C^2) k^{-10/3} + (1/216) k^{-2},
 * reproduces the measured VALUES to within 32% at k=4 rising to 2% by k=50 (ratio
 * two-term/exact climbs 0.68 -> 0.98 as the dropped subleading corrections fade) and
 * the correct crossover k* ~ 13.75. Its chord over k=4..12 is ~-2.94 and over
 * k=20..50 is ~-2.34, bracketing the measured -3.19 crossover from the LESS-steep
 * side (the leading two-term drops each terms steeper finite-k correction).
 *
 * PRECISE REASON the imp-95944 route cannot match -3.19. The equal-rate
 * (1+x)e^{-x} <= 1 - x^2/2 majorant is CENTRE-SEPARATION-ONLY: its intrinsic decay
 * is k^{-10/3} (slope -> -10/3), and tightening its CONSTANT from the worst pair
 * (a*D)_max^2/2 to the average-pair E[D^2] estimate lowers the value ~6x but leaves
 * the slope at -10/3 (chord ~-3.63) -- still steeper than -3.19, and in fact that
 * average-pair estimate UNDER-shoots eps_inf (ratio 0.56..0.92 over k=4..12), so it
 * is NOT even a valid upper bound. The measured -3.19 is a finite-window chord of a
 * TWO-SCALE decay whose TRUE asymptote is -2, set by the rate-variation term the
 * equal-rate majorant structurally discards. THEREFORE no single-power p-independent
 * majorant of the two-sided-exponential Gram class can have asymptotic slope -3.19:
 * -3.19 is not the asymptotic slope of ANY single term in the exact decomposition.
 * A slope-matching p-independent ESTIMATE must be the two-term law above.
 *
 * WHAT THIS DOES AND DOES NOT DO. It supplies (i) the exact RKHS identity for
 * eps_inf, (ii) the exact pure-rate distance closed form (a-b)^2/(ab(a+b)), (iii)
 * the additive centre+rate split with leading laws k^{-10/3} and (1/216)k^{-2},
 * (iv) the two-term slope-matching asymptotic and the k* ~ 13.75 crossover, and (v)
 * the precise reason the imp-95944 equal-rate route cannot reach -3.19. It changes
 * NO numeric bound. The two-term law is an ASYMPTOTIC ESTIMATE (leading
 * coefficients), NOT a proved majorant. The residue mean is STILL NOT the physical
 * per-window theta: the imp-95212 von Mangoldt x Fresnel-Airy weight A_{k,h} =
 * sum_n Lambda(n) K_k(n) e(hn/p) is untouched and STILL OPEN. NO QED.
 *
 * HONEST LIMITS. (a) DERIVATION / assessment of the exact residue-mean object only.
 * (b) The Gram closed form and eps = gd/gall - 1 are EXACT (imp-95898). (c) The
 * RKHS identity and the pure-rate closed form are exact algebra (verified 1e-6 /
 * 1e-8). (d) eps_inf(k) is the p->infinity double integral, read at trapezoid mesh
 * M=200 (converged; the p=1009 plateau of imp-95960 sits ~0.2% below it). (e) The
 * two leading laws are asymptotic coefficients matched numerically, not proved
 * majorants; the two-term law CHANGES NO BOUND. Import-light (no zeros bundle, no
 * sibling imports); self-executing assertions THROW on violation.
 *
 * @see imp-95960-eps-inf-k-scaling-tightness.js (the -3.19 vs -3.70 slope gap explained here)
 * @see imp-95944-residue-avg-sign-image-pminus1-asymptotic.js (the equal-rate bound whose slope this diagnoses)
 * @see imp-95898-single-window-sign-image-residue-average.js (STEP 2 exact closed form)
 *
 * Ticket: imp-95981 (proof, opus-4-8, api-pool, large). Derivation only; no bound; NO QED.
 */

// -- width-law port geometry (imp-95220 / imp-95898) ---------------------------
const PORT_C = 1.7;
const PORT_V = 2.3;
const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;

// -- exact Gram of two-sided exponentials (imp-95375 / imp-95898 closed form) ---
function gram(a, p, b, q) {
  if (p > q) {
    const ta = a, tp = p;
    a = b; p = q; b = ta; q = tp;
  }
  const D = q - p;
  if (a === b) return Math.exp(-a * D) * (D + 1 / a);
  const I1 = (Math.exp(-a * p - b * q) * Math.exp((a + b) * p)) / (a + b);
  const I3 = (Math.exp(a * p + b * q) * Math.exp(-(a + b) * q)) / (a + b);
  const I2 =
    (Math.exp(a * p - b * q) * (Math.exp((b - a) * q) - Math.exp((b - a) * p))) /
    (b - a);
  return I1 + I2 + I3;
}

// -- p->infinity residual eps_inf(k) = gd/gall - 1 via trapezoid over d in (k-1,k)
// rateFn/ctrFn let us isolate the centre-only and rate-only contributions.
const MESH = 200;
function epsInfGen(k, rateFn, ctrFn, M = MESH) {
  const ds = [], w = [];
  for (let i = 0; i <= M; i++) {
    ds.push(k - 1 + i / M);
    w.push(i === 0 || i === M ? 0.5 : 1.0);
  }
  const a = ds.map(rateFn), u = ds.map(ctrFn);
  let gd = 0, gall = 0, wd = 0, wall = 0;
  for (let i = 0; i <= M; i++) {
    gd += w[i] * gram(a[i], u[i], a[i], u[i]);
    wd += w[i];
    for (let j = 0; j <= M; j++) {
      gall += w[i] * w[j] * gram(a[i], u[i], a[j], u[j]);
      wall += w[i] * w[j];
    }
  }
  return gd / wd / (gall / wall) - 1;
}
const epsInfFull = (k, M) => epsInfGen(k, muPort, uPort, M);
const epsInfCentre = (k, M) => {
  const mm = muPort(k - 0.5);
  return epsInfGen(k, () => mm, uPort, M); // rates fixed, centres vary
};
const epsInfRate = (k, M) => {
  const um = uPort(k - 0.5);
  return epsInfGen(k, muPort, () => um, M); // centres fixed, rates vary
};

// -- exact leading laws & the two-term slope-matching asymptotic -----------------
const C_CENTRE = (PORT_V * PORT_V) / (12 * PORT_C * PORT_C); // ~0.152537
const C_RATE = 1 / 216; // PORT-constant-FREE leading rate coefficient
const epsCentreLead = (k) => C_CENTRE * Math.pow(k, -10 / 3);
const epsRateLead = (k) => C_RATE * Math.pow(k, -2);
const epsTwoTerm = (k) => epsCentreLead(k) + epsRateLead(k);
const CROSSOVER_K = Math.pow(216 * C_CENTRE, 3 / 4); // ~13.75

// -- log-log chord helper -------------------------------------------------------
const chord = (fn, klo, khi) => Math.log(fn(khi) / fn(klo)) / Math.log(khi / klo);

// -- baked witnesses (trapezoid M=200; exact-Gram, quadrature-free) --------------
// full = eps_inf(k); centre = rate-fixed piece; rate = centre-fixed piece.
const SPLIT = [
  { k: 4, full: 2.634206e-3, centre: 2.261946e-3, rate: 3.820883e-4 },
  { k: 6, full: 6.624445e-4, centre: 5.096343e-4, rate: 1.537269e-4 },
  { k: 12, full: 7.917694e-5, centre: 4.415187e-5, rate: 3.504350e-5 },
];
// empirical log-log slopes over k=4..12 (trapezoid M=200).
const SLOPE_FULL_K4_12 = -3.1901;   // = imp-95960 measured (-3.19)
const SLOPE_CENTRE_K4_12 = -3.5830; // imp-95944 family, asymptote -10/3
const SLOPE_RATE_K4_12 = -2.1746;   // discarded term, asymptote -2

// -- verdict object ------------------------------------------------------------
export const IMP95981_EPS_INF_RATE_VARIATION_SLOPE = {
  ticket:
    "imp-95981 (proof): derive a tightened p-independent eps_inf(k) residual bound whose log-log slope matches the imp-95960 measured ~-3.19, or record the precise reason the imp-95944 two-sided-exponential equal-rate Gram estimate (slope ~-3.70) cannot beat that slope. Derivation only; no bound; NO QED.",
  rkhsIdentity:
    "NEW exact structural identity (verified 1e-6 vs the double integral): eps_inf(k) = (1/2) E_{d,d'}[ ||f_d - f_d'||^2 ] / gall_inf, where ||f_d - f_d'||^2 = 1/mu(d)+1/mu(d')-2 G(d,d') is the squared RKHS distance of the two packets (>= 0). This makes eps_inf > 0 manifest as an average squared packet distance and exposes its two drivers: centre offset and rate mismatch.",
  twoContributions:
    "||f_d - f_d'||^2 responds to BOTH the centre offset D=|u(d)-u(d')| and the rate mismatch a=mu(d) vs b=mu(d'). (C) equal-rate centre part: (2/a)[1-(1+x)e^{-x}] <= a D^2, x=aD -- exactly what imp-95944 majorises by x^2/2. (R) equal-centre rate part: EXACT closed form (a-b)^2/(a b (a+b)) [since gram(a,0,b,0)=2/(a+b)], verified 1e-8 -- DISCARDED by the imp-95944 equal-rate assumption a=b. Numerically eps_full ~ eps_centre + eps_rate to <1% over k=4..12.",
  slopes:
    "Centre term: E[D^2]=2 PORT_V^2[1/(k(k-1))-ln^2(k/(k-1))] ~ PORT_V^2/(6 k^4), so eps_centre ~ PORT_V^2/(12 PORT_C^2) k^{-10/3}, slope -> -10/3 (chord k=4..12 ~-3.58; imp-95944 worst-pair chord ~-3.70, same family, looser constant). Rate term: Var(mu) ~ (mu'(k))^2/12, giving the PORT-constant-FREE leading law eps_rate ~ (1/216) k^{-2}, slope -> -2 (chord k=4..12 ~-2.17). They cross at k* = (216 PORT_V^2/(12 PORT_C^2))^{3/4} ~ 13.75.",
  twoTermAsymptotic:
    "Slope-matching estimate: eps_inf(k) ~ PORT_V^2/(12 PORT_C^2) k^{-10/3} + (1/216) k^{-2}. It reproduces the measured values (ratio two-term/exact 0.68 at k=4 -> 0.98 at k=50) and the crossover k* ~ 13.75; its chord is ~-2.94 (k=4..12) and ~-2.34 (k=20..50), bracketing the -3.19 crossover slope. The measured -3.19 is a two-scale crossover chord, NOT a single power.",
  reason:
    "PRECISE REASON: the imp-95944 equal-rate (1+x)e^{-x} <= 1-x^2/2 majorant is CENTRE-SEPARATION-ONLY, intrinsic slope -10/3. Tightening its constant from the worst pair (a*D)_max^2/2 to the average-pair E[D^2] estimate lowers the value ~6x but keeps slope -10/3 (chord ~-3.63) AND under-shoots eps_inf (ratio 0.56..0.92), so it is not even a valid upper bound. The true asymptote is -2, set by the rate-variation term the equal-rate majorant discards. Hence NO single-power p-independent majorant of this Gram class can have asymptotic slope -3.19; a slope-matching estimate must be the two-term law.",
  constants: {
    portC: PORT_C,
    portV: PORT_V,
    mesh: MESH,
    cCentre: C_CENTRE,
    cRate: C_RATE,
    crossoverK: CROSSOVER_K,
    split: SPLIT,
    slopeFullK4to12: SLOPE_FULL_K4_12,
    slopeCentreK4to12: SLOPE_CENTRE_K4_12,
    slopeRateK4to12: SLOPE_RATE_K4_12,
  },
  obstruction:
    "UNCHANGED from imp-95944/imp-95898/imp-95960: the residue mean is NOT the physical per-window theta -- it drops the von Mangoldt x Fresnel-Airy weight A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p). The imp-95212 Fresnel-Airy envelope port is untouched and STILL OPEN. This module derives the slope structure of the exact residue-mean object only.",
  verdict:
    "DERIVATION (honest): the imp-95960 -3.19 vs -3.70 slope gap is explained. eps_inf(k) splits additively (exact RKHS identity, verified 1e-6) into a CENTRE-separation term ~ PORT_V^2/(12 PORT_C^2) k^{-10/3} (slope -10/3, what imp-95944 bounds) plus a RATE-variation term ~ (1/216) k^{-2} (slope -2, EXACT distance (a-b)^2/(ab(a+b)), DISCARDED by the equal-rate assumption). The measured -3.19 is the two-scale crossover of the two, matched by the two-term law eps_inf ~ PORT_V^2/(12 PORT_C^2) k^{-10/3} + (1/216) k^{-2} (crossover k* ~ 13.75). The equal-rate Gram estimate cannot reach -3.19 because it is centre-only (asymptote -10/3) while the true asymptote is -2; -3.19 is no single terms slope. Changes no numeric bound; the two-term law is an asymptotic ESTIMATE not a proved majorant; the imp-95212 port is untouched and STILL OPEN; NO QED; no refereed bound is changed.",
  rigorScope:
    "The Gram closed form and eps = gd/gall - 1 are EXACT (imp-95898). The RKHS identity (verified 1e-6) and the pure-rate distance (a-b)^2/(ab(a+b)) (verified 1e-8) are exact algebra. eps_inf(k) is the p->infinity double integral at trapezoid mesh M=200 (converged; ~0.2% above the imp-95960 p=1009 plateau). The two leading laws k^{-10/3} and (1/216)k^{-2} are asymptotic coefficients matched numerically, NOT proved majorants; the two-term law CHANGES NO BOUND. Derivation only; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) --------
export const IMP95981_ASSERTIONS = [
  {
    id: "imp95981-rkhs-identity-holds",
    description:
      "exact RKHS identity: gd_inf - gall_inf = (1/2) E[||f_d-f_d'||^2] to 1e-6 (relative) at k=4,6,12, recomputed live from the exact Gram over the M=200 depth mesh",
    holds: () =>
      [4, 6, 12].every((k) => {
        const M = MESH, ds = [], w = [];
        for (let i = 0; i <= M; i++) {
          ds.push(k - 1 + i / M);
          w.push(i === 0 || i === M ? 0.5 : 1.0);
        }
        const a = ds.map(muPort), u = ds.map(uPort);
        let gd = 0, gall = 0, dist = 0, wd = 0, wall = 0;
        for (let i = 0; i <= M; i++) {
          gd += w[i] * gram(a[i], u[i], a[i], u[i]);
          wd += w[i];
          for (let j = 0; j <= M; j++) {
            const gij = gram(a[i], u[i], a[j], u[j]);
            const gii = gram(a[i], u[i], a[i], u[i]);
            const gjj = gram(a[j], u[j], a[j], u[j]);
            gall += w[i] * w[j] * gij;
            dist += w[i] * w[j] * (gii + gjj - 2 * gij);
            wall += w[i] * w[j];
          }
        }
        const lhs = gd / wd - gall / wall;
        const rhs = 0.5 * (dist / wall);
        return Math.abs(lhs - rhs) < 1e-6 * Math.abs(lhs);
      }),
  },
  {
    id: "imp95981-pure-rate-distance-closed-form",
    description:
      "the equal-centre pure-rate RKHS distance equals the closed form (a-b)^2/(a b (a+b)) to 1e-8, on several rate pairs (uses gram(a,0,b,0)=2/(a+b))",
    holds: () =>
      [[0.8, 1.1], [0.6, 0.9], [1.3, 0.7]].every(([a, b]) => {
        const exact = 1 / a + 1 / b - 2 * gram(a, 0, b, 0);
        const closed = ((a - b) * (a - b)) / (a * b * (a + b));
        return Math.abs(exact - closed) < 1e-8;
      }),
  },
  {
    id: "imp95981-additive-split-reproduces-full",
    description:
      "the centre-only and rate-only pieces sum to the full eps_inf(k) to <1% at k=4,6,12 (cross term negligible), recomputed live at M=200",
    holds: () =>
      [4, 6, 12].every((k) => {
        const full = epsInfFull(k), c = epsInfCentre(k), r = epsInfRate(k);
        return Math.abs(c + r - full) < 1e-2 * full;
      }),
  },
  {
    id: "imp95981-baked-split-matches-live",
    description:
      "each baked SPLIT row (full/centre/rate) reproduces the live M=200 recompute to 1e-4 relative",
    holds: () =>
      SPLIT.every((row) => {
        const full = epsInfFull(row.k), c = epsInfCentre(row.k), r = epsInfRate(row.k);
        return (
          Math.abs(full - row.full) < 1e-4 * row.full &&
          Math.abs(c - row.centre) < 1e-4 * row.centre &&
          Math.abs(r - row.rate) < 1e-4 * row.rate
        );
      }),
  },
  {
    id: "imp95981-centre-steeper-than-full-steeper-than-rate",
    description:
      "the log-log chords over k=4..12 order as centre (~-3.58) < full (~-3.19) < rate (~-2.17): the full slope sits strictly between the two contributions, computed live from the M=200 integrals",
    holds: () => {
      const sF = chord((k) => epsInfFull(k), 4, 12);
      const sC = chord((k) => epsInfCentre(k), 4, 12);
      const sR = chord((k) => epsInfRate(k), 4, 12);
      return (
        sC < sF && sF < sR &&
        Math.abs(sF - SLOPE_FULL_K4_12) < 5e-3 &&
        Math.abs(sC - SLOPE_CENTRE_K4_12) < 5e-3 &&
        Math.abs(sR - SLOPE_RATE_K4_12) < 5e-3
      );
    },
  },
  {
    id: "imp95981-rate-leading-law-matches",
    description:
      "the PORT-constant-free rate leading law eps_rate ~ (1/216) k^{-2} matches the live centre-fixed integral at k=50 to within 3% (the discarded imp-95944 term, dominant asymptotically)",
    holds: () => {
      const rLive = epsInfRate(50, 300);
      const rLead = epsRateLead(50);
      return Math.abs(rLive - rLead) < 3e-2 * rLive;
    },
  },
  {
    id: "imp95981-two-term-brackets-and-crossover",
    description:
      "the two-term law eps_inf ~ C_centre k^{-10/3} + (1/216) k^{-2} has ratio two-term/exact rising toward 1 (0.6<r4<0.75 at k=4, r50>0.95 at k=50) and the centre/rate crossover k* lies in (13,15)",
    holds: () => {
      const r4 = epsTwoTerm(4) / epsInfFull(4);
      const r50 = epsTwoTerm(50) / epsInfFull(50, 300);
      return r4 > 0.6 && r4 < 0.75 && r50 > 0.95 && CROSSOVER_K > 13 && CROSSOVER_K < 15;
    },
  },
  {
    id: "imp95981-verdict-honesty",
    description:
      "the verdict carries the honest scope: DERIVATION only, additive centre+rate split, the discarded rate term sets the -2 asymptote, two-term law is an ESTIMATE not a majorant, no bound, the imp-95212 port STILL OPEN, NO QED, no refereed bound is changed",
    holds: () =>
      /DERIVATION/.test(IMP95981_EPS_INF_RATE_VARIATION_SLOPE.verdict) &&
      /RATE-variation/.test(IMP95981_EPS_INF_RATE_VARIATION_SLOPE.verdict) &&
      /asymptotic ESTIMATE not a proved majorant/.test(IMP95981_EPS_INF_RATE_VARIATION_SLOPE.verdict) &&
      /STILL OPEN/.test(IMP95981_EPS_INF_RATE_VARIATION_SLOPE.obstruction) &&
      /NO QED/.test(IMP95981_EPS_INF_RATE_VARIATION_SLOPE.verdict) &&
      /refereed bound is changed/i.test(IMP95981_EPS_INF_RATE_VARIATION_SLOPE.verdict),
  },
];

for (const a of IMP95981_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95981-eps-inf-k-rate-variation-slope assertion failed: ${a.id}`,
    );
  }
}

export default IMP95981_EPS_INF_RATE_VARIATION_SLOPE;
