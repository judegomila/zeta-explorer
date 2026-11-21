/**
 * @module imp-95879-theta-positive-cone-triviality-intrinsic
 *
 * imp-95879 (proof / assessment): does admitting a NON-FIXED-AMPLITUDE window
 * family (or an alternative modulus normalization) give the imp-95388
 * obligation-(2) sign functional theta a nontrivial image, unblocking the
 * signed-weight transcription -- or is the triviality intrinsic?
 *
 * VERDICT: the triviality is INTRINSIC to POSITIVITY, not to the fixed-
 * amplitude choice. Neither a non-fixed-amplitude (variable-modulus) family
 * nor any modulus normalization gives theta a nontrivial image; the only lever
 * is per-window SIGN data, which the imp-95255 geometry+modulus transcription
 * drops. Obligation (2) stays gated on the sign-SPECIFICATION (imp-95375 /
 * imp-95397 / imp-95212 Fresnel-Airy envelope port). No bound; NO QED.
 *
 * SETUP (imp-95221/95233/95255 packet model). Packets f_n(s) = e^(-mu_n
 * |s - u_n|) are strictly positive everywhere (mu_n > 0, u_n in R). With
 * amplitudes c in R^n set the signed field f = sum_n c_n f_n and the modulus
 * envelope g = sum_n |c_n| f_n. The obligation-(2) currency is
 *   theta = (int_R f^2) / (int_R g^2)  in (0, 1].
 * imp-95255 LEG 2a records theta = 1 on the paper fixed-amplitude family
 * (all |c_n| = 1/p, a positive cone) and asks whether relaxing that fixity can
 * give theta a nontrivial image. This module answers with an exact structural
 * theorem plus a numerical witness.
 *
 * POSITIVE-CONE TRIVIALITY THEOREM (exact).
 *   (i)  Since every f_n > 0, the triangle inequality gives g(s) >= |f(s)| for
 *        ALL s, hence int f^2 <= int g^2 and theta in (0, 1] (Gram PD => > 0).
 *   (ii) theta = 1  <=>  g = |f| a.e.  <=>  all nonzero c_n share one sign
 *        (the amplitude vector lies in a single closed sign-orthant, i.e. a ray
 *        of the positive cone up to a global sign).
 *   Proof of (ii). theta = 1  <=>  int (g^2 - f^2) = 0  <=>  int (g - |f|)
 *   (g + |f|) = 0. Both factors are >= 0 pointwise and g + |f| > 0 everywhere
 *   (g is a positive combination of strictly positive packets, unless c = 0),
 *   so g = |f| a.e., hence everywhere by continuity. g(s) = |f(s)| for all s
 *   means sum |c_n| f_n(s) = |sum c_n f_n(s)|: no cancellation anywhere. Since
 *   each f_n > 0 this forces sign(c_n) constant over the nonzero c_n. Conversely
 *   a common sign gives f = +-g so theta = 1. QED (of the lemma only).
 *
 * COROLLARY -- THE TICKET QUESTION, ANSWERED.
 *   (A) NON-FIXED-AMPLITUDE FAMILY DOES NOT HELP. Any window family with the
 *       amplitude MODULI free but all amplitudes of one sign -- which is what
 *       an amplitude-magnitude relaxation of the paper fixed 1/p still is, the
 *       transcription supplying no signs -- is a positive cone, so by (ii)
 *       theta = 1 IDENTICALLY regardless of the moduli. Relaxing fixed to
 *       variable-positive amplitude gives theta NO nontrivial image.
 *   (B) MODULUS NORMALIZATION IS ORTHOGONAL TO THE OBSTRUCTION. theta is
 *       degree-0 homogeneous in c (imp-95139 scope), so a global modulus
 *       normalization is an exact no-op, and a per-window modulus renormization
 *       |c_n| -> w_n |c_n| (w_n > 0, signs kept) maps a positive cone to
 *       itself (still theta = 1) and a signed pattern to another signed pattern
 *       (theta stays < 1, never crossing to or from 1). Modulus data moves
 *       theta only WITHIN a fixed sign-orthant regime; it can neither create
 *       nor destroy the nontriviality.
 *   Hence the departure theta < 1 is governed ENTIRELY by the sign-orthant of
 *   c, which is exactly the direction that BOTH the fixed-amplitude choice AND
 *   any modulus normalization leave invariant. The wall is intrinsic to
 *   positivity; the only lever is transcribed per-window SIGN data.
 *
 * NUMERICAL WITNESS (illustrative width-law port c = 1.7, v = 2.3; imp-95255
 * geometry), Simpson quadrature of int f^2 / int g^2:
 *   G(2,4), n=4 :  fixed +amp theta = 1 ; variable +amp theta = 1 (to 1e-9) ;
 *                  signed theta = 0.042591 ; signed x 7.3 (global rescale) =
 *                  0.042591 (degree-0, matches to 1e-9) ; signed with per-window
 *                  modulus renorm = 0.134758 (moves, stays < 1).
 *   G(3,8), n=16:  fixed +amp theta = 1 ; variable +amp theta = 1 (to 1e-9) ;
 *                  signed theta = 0.017937 ; signed x 7.3 = 0.017937 ;
 *                  signed renorm = 0.016658.
 * The variable-POSITIVE-amplitude family (the ticket non-fixed family) sits at
 * theta = 1 exactly, confirming (A); the global rescale reproduces the signed
 * value confirming degree-0 (B); the per-window renorm moves the signed value
 * without crossing 1, confirming modulus data is confined within the sign
 * regime.
 *
 * RELATION TO SIBLINGS. imp-95375 imaged the theta RANGE (a Gram quadratic
 * form of the sign vector) and found theta < 1 deeply reachable via SIGNS at
 * fixed geometry; imp-95405 enumerated the full 2^n sign lattice at fixed
 * geometry. Both vary SIGNS at fixed positive moduli. This module fixes the
 * complementary axis: it proves that varying the MODULI (the ticket non-fixed-
 * amplitude family / modulus normalization) can NOT substitute for sign
 * freedom, so obligation (2) cannot be unblocked by an amplitude-magnitude or
 * normalization move -- only by the sign specification (imp-95397 / the
 * imp-95212 Fresnel-Airy envelope port, still OPEN).
 *
 * HONEST LIMITS. (a) ASSESSMENT / DERIVATION only: the lemma is exact for the
 * strictly-positive packet model; it derives no operator positivity and moves
 * no bound. (b) It answers the transcription-layer question (can a non-fixed
 * family or normalization image theta) NEGATIVELY and reduces obligation (2)
 * to the sign-specification; it does NOT supply that specification. (c) The
 * numerical witness is a cross-check of the lemma, not the proof. Import-light
 * (no zeros bundle, no sibling imports); self-executing assertions THROW on
 * violation. Changes no bound; NO QED; no refereed bound is changed.
 *
 * @see imp-95255-currency-per-window-map-assessment.js (LEG 2 theta obstruction, width-law port)
 * @see imp-95375-theta-range-geometry-image.js (theta range imaged, sign-reachable)
 * @see imp-95405-theta-sign-freedom-at-fixed-geometry.js (2^n sign enumeration at fixed geometry)
 * @see imp-95388-seam-chain-obligation-ledger.js (obligation (2) OPEN at transcription)
 *
 * Ticket: imp-95879 (proof, opus-4-8, api-pool, medium). Derivation only; no bound; NO QED.
 */

// -- width-law port geometry (imp-95220 LEMMA MAP; imp-95255 constants) --------
const PORT_C = 1.7;
const PORT_V = 2.3;
const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;
function gridGpd(p, D) {
  const g = [];
  for (let n = 1; n <= p * D; n++) if (n % p !== 0) g.push(n / p);
  return g;
}

// -- theta = int f^2 / int g^2 by Simpson quadrature ---------------------------
function simpson(a, b, n, fn) {
  const h = (b - a) / n;
  let S = fn(a) + fn(b);
  for (let i = 1; i < n; i++) S += fn(a + i * h) * (i % 2 ? 4 : 2);
  return (S * h) / 3;
}
function makeF(mu, u, c) {
  return (s) => {
    let v = 0;
    for (let k = 0; k < c.length; k++) v += c[k] * Math.exp(-mu[k] * Math.abs(s - u[k]));
    return v;
  };
}
function thetaOf(p, D, c) {
  const ds = gridGpd(p, D);
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  const f = makeF(mu, u, c);
  const g = makeF(mu, u, c.map(Math.abs));
  const Tf = simpson(-60, 60, 200000, (s) => f(s) ** 2);
  const Tg = simpson(-60, 60, 200000, (s) => g(s) ** 2);
  return Tf / Tg;
}

// deterministic LCG so amplitude families are reproducible (assessment aid only)
function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1103515245 * s + 12345) >>> 0;
    return s / 4294967296;
  };
}

// -- baked measurement (recomputed by the assertions) --------------------------
// signed = alternating +-, on VARIABLE positive moduli; signedGlobal = signed
// times a global 7.3 factor (degree-0 test); signedRenorm = signed with a
// per-window positive modulus rescale (signs kept).
export const IMP95879_MODULUS_AXIS = [
  {
    key: "G(2,4)",
    p: 2,
    D: 4,
    n: 4,
    thetaFixedPos: 1.0,
    thetaVarPos: 1.0,
    thetaSigned: 4.259080e-2,
    thetaSignedGlobal: 4.259080e-2,
    thetaSignedRenorm: 1.347579e-1,
  },
  {
    key: "G(3,8)",
    p: 3,
    D: 8,
    n: 16,
    thetaFixedPos: 1.0,
    thetaVarPos: 1.0,
    thetaSigned: 1.793651e-2,
    thetaSignedGlobal: 1.793651e-2,
    thetaSignedRenorm: 1.665834e-2,
  },
];

// build the four amplitude families at a grid (same recipe the scratch used)
function familiesAt(p, D) {
  const ds = gridGpd(p, D);
  const cFixedPos = ds.map(() => 1 / p);
  const r = lcg(42 + p + D);
  const cVarPos = ds.map(() => 0.3 + 2.5 * r());
  const cSigned = cVarPos.map((v, i) => (i % 2 ? -1 : 1) * v);
  const cSignedGlobal = cSigned.map((v) => 7.3 * v);
  const r2 = lcg(999 + p);
  const w = cSigned.map(() => 0.2 + 3.0 * r2());
  const cSignedRenorm = cSigned.map((v, i) => Math.sign(v) * w[i] * Math.abs(v));
  return { cFixedPos, cVarPos, cSigned, cSignedGlobal, cSignedRenorm };
}

// -- verdict object ------------------------------------------------------------
export const IMP95879_POSITIVE_CONE_TRIVIALITY = {
  ticket:
    "imp-95879 (proof / assessment): does a NON-FIXED-AMPLITUDE window family or an alternative modulus normalization give the imp-95388 obligation-(2) sign functional theta = int f^2 / int g^2 a nontrivial image? Answer: NO -- the triviality is intrinsic to POSITIVITY, not to the fixed-amplitude choice.",
  theorem:
    "POSITIVE-CONE TRIVIALITY (exact, strictly-positive packet model): since every packet f_n > 0, g = sum |c_n| f_n >= |sum c_n f_n| = |f| pointwise so theta in (0,1]; and theta = 1 <=> g = |f| a.e. <=> all nonzero c_n share one sign (the amplitude vector lies in a single sign-orthant). Proof: theta = 1 <=> int (g-|f|)(g+|f|) = 0 with both factors >= 0 and g+|f| > 0, so g = |f| everywhere, i.e. no cancellation, forcing constant sign.",
  corollaryA:
    "NON-FIXED-AMPLITUDE FAMILY DOES NOT HELP: any variable-modulus family with all amplitudes of one sign is a positive cone, so theta = 1 IDENTICALLY regardless of the moduli. Relaxing the paper fixed 1/p to variable-positive amplitude gives theta no nontrivial image.",
  corollaryB:
    "MODULUS NORMALIZATION IS ORTHOGONAL: theta is degree-0 homogeneous, so a global normalization is an exact no-op and a per-window modulus rescale (signs kept) maps a positive cone to itself (still theta = 1) and a signed pattern to another signed pattern (theta stays < 1, never crossing 1). Modulus data moves theta only within a fixed sign-orthant regime.",
  conclusion:
    "the departure theta < 1 is governed entirely by the sign-orthant of c, the one direction both the fixed-amplitude choice and any modulus normalization leave invariant; the wall is intrinsic to positivity and the only lever is transcribed per-window SIGN data. Obligation (2) cannot be unblocked by an amplitude-magnitude or normalization move -- it stays gated on the sign-specification (imp-95375 / imp-95397 / the imp-95212 Fresnel-Airy envelope port, still OPEN).",
  witness:
    "width-law port (c=1.7,v=2.3): variable-POSITIVE-amplitude theta = 1 (to 1e-9) at G(2,4) and G(3,8) confirming (A); a global x7.3 rescale of a signed pattern reproduces its theta (0.042591 / 0.017937) to 1e-9 confirming degree-0 (B); a per-window modulus renorm of the signed pattern moves theta (0.134758 / 0.016658) but never crosses 1.",
  constants: { portC: PORT_C, portV: PORT_V },
  verdict:
    "ASSESSMENT / DERIVATION (honest, negative at the transcription layer): admitting a non-fixed-amplitude window family or an alternative modulus normalization does NOT give theta a nontrivial image; the triviality on the transcribed positive-cone family is intrinsic to positivity (exact positive-cone triviality theorem), so the signed-weight transcription stays gated on the per-window sign specification the geometry+modulus map drops. Nothing derives or moves a bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "the positive-cone triviality lemma is EXACT for the strictly-positive packet model (triangle inequality + strict positivity of the packets); the numerical rows are a Simpson-quadrature cross-check of the lemma, not the proof. Changes no bound; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) -------
const REL = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b));

export const IMP95879_ASSERTIONS = [
  {
    id: "imp95879-variable-positive-amplitude-theta-is-one",
    description:
      "COROLLARY A: a NON-FIXED-AMPLITUDE (variable positive modulus) family gives theta = 1 exactly, just like the fixed 1/p family -- relaxing fixed to variable-positive amplitude gives theta no nontrivial image (theta = 1 to 1e-9 on both grids)",
    holds: () =>
      IMP95879_MODULUS_AXIS.every((row) => {
        const { cFixedPos, cVarPos } = familiesAt(row.p, row.D);
        const tFixed = thetaOf(row.p, row.D, cFixedPos);
        const tVar = thetaOf(row.p, row.D, cVarPos);
        return Math.abs(tFixed - 1) < 1e-9 && Math.abs(tVar - 1) < 1e-9;
      }),
  },
  {
    id: "imp95879-signed-family-breaks-triviality",
    description:
      "only a SIGNED amplitude pattern (a departure from the positive cone) drives theta strictly below 1 on the SAME geometry, confirming the sign-orthant -- not the moduli -- is the sole lever",
    holds: () =>
      IMP95879_MODULUS_AXIS.every((row) => {
        const { cSigned } = familiesAt(row.p, row.D);
        const t = thetaOf(row.p, row.D, cSigned);
        return t < 1 - 1e-3 && t > 0 && REL(t, row.thetaSigned) < 2e-3;
      }),
  },
  {
    id: "imp95879-theta-degree-zero-global-rescale-noop",
    description:
      "COROLLARY B: a global modulus normalization is an exact no-op -- scaling a signed pattern by 7.3 leaves theta unchanged (degree-0 homogeneity), reproducing the signed value to 1e-9",
    holds: () =>
      IMP95879_MODULUS_AXIS.every((row) => {
        const { cSigned, cSignedGlobal } = familiesAt(row.p, row.D);
        const t = thetaOf(row.p, row.D, cSigned);
        const tG = thetaOf(row.p, row.D, cSignedGlobal);
        return Math.abs(t - tG) < 1e-9;
      }),
  },
  {
    id: "imp95879-per-window-renorm-stays-within-sign-regime",
    description:
      "COROLLARY B: a per-window modulus renorm (signs kept) moves the SIGNED theta value but never crosses 1 -- modulus data moves theta only within a fixed sign-orthant regime, neither creating nor destroying the nontriviality",
    holds: () =>
      IMP95879_MODULUS_AXIS.every((row) => {
        const { cSignedRenorm } = familiesAt(row.p, row.D);
        const t = thetaOf(row.p, row.D, cSignedRenorm);
        return t > 0 && t < 1 - 1e-3 && REL(t, row.thetaSignedRenorm) < 2e-3;
      }),
  },
  {
    id: "imp95879-theta-in-unit-interval",
    description:
      "theorem (i): theta lies in (0,1] for every family because g >= |f| pointwise (strictly-positive packets) and the Gram matrix is PD",
    holds: () =>
      IMP95879_MODULUS_AXIS.every((row) => {
        const fam = familiesAt(row.p, row.D);
        return [fam.cFixedPos, fam.cVarPos, fam.cSigned, fam.cSignedRenorm].every((c) => {
          const t = thetaOf(row.p, row.D, c);
          return t > 0 && t <= 1 + 1e-9;
        });
      }),
  },
  {
    id: "imp95879-pointwise-envelope-bound-g-ge-absf",
    description:
      "theorem core: g(s) = sum |c_n| f_n(s) >= |sum c_n f_n(s)| = |f(s)| at every sampled point for a signed family, with STRICT inequality somewhere (the cancellation that makes theta < 1); on a positive family g = |f| identically",
    holds: () => {
      const { p, D } = IMP95879_MODULUS_AXIS[0];
      const ds = gridGpd(p, D);
      const mu = ds.map(muPort);
      const u = ds.map(uPort);
      const { cSigned, cVarPos } = familiesAt(p, D);
      const fSig = makeF(mu, u, cSigned);
      const gSig = makeF(mu, u, cSigned.map(Math.abs));
      const fPos = makeF(mu, u, cVarPos);
      const gPos = makeF(mu, u, cVarPos.map(Math.abs));
      let anyStrict = false;
      for (let s = -20; s <= 20; s += 0.05) {
        if (gSig(s) < Math.abs(fSig(s)) - 1e-9) return false; // g >= |f| must hold
        if (gSig(s) > Math.abs(fSig(s)) + 1e-6) anyStrict = true;
        if (Math.abs(gPos(s) - Math.abs(fPos(s))) > 1e-9) return false; // positive: g = |f|
      }
      return anyStrict;
    },
  },
  {
    id: "imp95879-verdict-honesty",
    description:
      "the verdict carries the honest negative-at-transcription framing: non-fixed family does NOT help, triviality intrinsic to positivity, sign the sole lever, assessment-only (no bound), NO QED, no refereed bound is changed",
    holds: () =>
      /does NOT give theta a nontrivial image/.test(IMP95879_POSITIVE_CONE_TRIVIALITY.verdict) &&
      /intrinsic to positivity/.test(IMP95879_POSITIVE_CONE_TRIVIALITY.verdict) &&
      /NO QED/.test(IMP95879_POSITIVE_CONE_TRIVIALITY.verdict) &&
      /refereed bound is changed/i.test(IMP95879_POSITIVE_CONE_TRIVIALITY.verdict) &&
      /sign-specification/.test(IMP95879_POSITIVE_CONE_TRIVIALITY.conclusion),
  },
];

for (const a of IMP95879_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95879-theta-positive-cone-triviality-intrinsic assertion failed: ${a.id}`);
  }
}

export default IMP95879_POSITIVE_CONE_TRIVIALITY;
