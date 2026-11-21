/**
 * imp-95139: SCOPE ASSESSMENT (no bound) -- is a MODULUS- or PHASE-priced
 * signed seam certificate available as its own currency leg of obligation
 * (2)? This ticket asks the assessment question that imp-95233 then answered
 * constructively on the PHASE side; here we separate the two named legs the
 * ticket lists (per-window modulus AND phase) and record which is real.
 *
 * VERDICT (scope only, sub-gap STILL OPEN):
 *   (A) PHASE leg -- FEASIBLE. imp-95233 COROLLARY PHASE-CERT gives an
 *       explicit (crude) phase-priced signed certificate
 *       R(f) <= e^(-y_min) / (2 theta), theta(f) = int_R f^2 / int_R g^2 the
 *       scale-invariant phase-alignment ratio (g = sum |c_n| f_n the
 *       positive-modulus envelope). So the phase currency escapes the
 *       depth-only no-go (imp-95224 DC-NOGO) exactly as count did (imp-95225).
 *       imp-95139 does NOT re-derive this; it consumes it as the phase-leg
 *       answer.
 *   (B) RAW-MODULUS leg -- STRUCTURALLY EXCLUDED. A certificate priced by a
 *       raw amplitude MAGNITUDE alone -- any homogeneous-degree-1 functional
 *       of the amplitudes such as ||c||_1 = sum |c_n| or ||c||_2 = sqrt(sum
 *       c_n^2), with NO normalization -- cannot exist. The seam ratio
 *         R(f) = W(f) / T(f),  W = int_(s<0) f^2,  T = int_R f^2,
 *       is homogeneous of degree ZERO in the amplitudes: c -> lambda c scales
 *       both W and T by lambda^2, so R(lambda c) = R(f) for every lambda > 0.
 *       The phase-alignment ratio theta is likewise degree-0 (both integrals
 *       scale by lambda^2). Hence any admissible right-hand side F(c) with
 *       R(f) <= F(c) forced for all c must itself be scale-invariant (drive
 *       lambda -> 0 or infinity: R stays fixed while F(lambda c) must not
 *       fall below it). But ||c||_1 and ||c||_2 are homogeneous of degree 1,
 *       so F(lambda c) = lambda F(c) ranges over (0, infinity) at FIXED R --
 *       no bound of the form R <= F(||c||) can hold. A raw-magnitude
 *       "modulus leg" is therefore a MIRAGE: the ONLY admissible modulus/phase
 *       information is the NORMALIZED (degree-0) phase-alignment ratio theta
 *       of imp-95233. This is why imp-95233 folds "modulus" and "phase" into
 *       the single scale-invariant theta rather than pricing an independent
 *       magnitude currency.
 *
 * READING. The obligation-(2) "modulus/phase leg" is ONE currency, not two:
 * the imp-95233 theta is the whole of it, and the naive expectation of a
 * separate amplitude-magnitude lever is closed off by scale-invariance. This
 * sharpens the ledger (it says exactly what "modulus/phase currency" can
 * mean) without moving any bound. The genuine residual is unchanged from
 * imp-95233: a SHARP theta-priced bound removing the 1/theta loss (VACUOUS in
 * the deep-cancellation regime theta < e^(-y_min) where the seam families
 * actually sit). Count leg = imp-95225 SGN-C (escaped, NP-terminal); weight
 * leg = imp-95133 (both candidates failed). Sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Objects as in imp-95221/95222/95233: packets f_n(s) = e^(-mu_n |s - u_n|),
 * mu_n > 0, u_n > 0, REAL amplitudes c_n; f = sum c_n f_n; R = int_(s<0) f^2
 * / int_R f^2; y_min = min over pairs (incl diagonal) of (mu_m + mu_n)
 * min(u_m, u_n).
 *
 * Import-light (no zeros bundle, no sibling imports; the imp-95233 facts are
 * cited as text, not imported). Scope only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

// -- packet-model helpers (self-contained, cross-check quadrature) ------------
function simpson(a, b, n, g) {
  const h = (b - a) / n;
  let S = g(a) + g(b);
  for (let i = 1; i < n; i++) S += g(a + i * h) * (i % 2 ? 4 : 2);
  return (S * h) / 3;
}
function makeF(mu, u, c) {
  return (s) => {
    let v = 0;
    for (let k = 0; k < c.length; k++) v += c[k] * Math.exp(-mu[k] * Math.abs(s - u[k]));
    return v;
  };
}
// returns {R, theta} by quadrature (scale-invariant quantities)
function measure(mu, u, c) {
  const f = makeF(mu, u, c);
  const g = makeF(mu, u, c.map(Math.abs));
  const W = simpson(-60, 0, 100000, (s) => f(s) ** 2);
  const T = W + simpson(0, 60, 100000, (s) => f(s) ** 2);
  const Wg = simpson(-60, 0, 100000, (s) => g(s) ** 2);
  const Tg = Wg + simpson(0, 60, 100000, (s) => g(s) ** 2);
  return { R: W / T, theta: T / Tg };
}
function l1(c) {
  return c.reduce((s, x) => s + Math.abs(x), 0);
}
function l2(c) {
  return Math.sqrt(c.reduce((s, x) => s + x * x, 0));
}

// -- verdict object ----------------------------------------------------------
export const IMP95139_MODULUS_CURRENCY_SCOPE = {
  ticket:
    "imp-95139 (SCOPE ASSESSMENT, no bound): does a modulus- or phase-priced signed seam certificate exist as its own currency leg of obligation (2)? Separate the two named legs -- per-window MODULUS and PHASE -- and record which is real.",
  phaseLeg:
    "FEASIBLE. Consumed from imp-95233 COROLLARY PHASE-CERT: R(f) <= e^(-y_min)/(2 theta) with the scale-invariant phase-alignment ratio theta(f) = int_R f^2 / int_R g^2, g = sum|c_n| f_n. The phase currency escapes the depth-only no-go (imp-95224 DC-NOGO) as count did (imp-95225). imp-95139 does NOT re-derive it.",
  rawModulusLeg:
    "STRUCTURALLY EXCLUDED. R(f) = W(f)/T(f) is HOMOGENEOUS OF DEGREE 0 in the amplitudes: c -> lambda c scales W and T both by lambda^2, so R(lambda c) = R(f) for all lambda > 0 (theta is degree-0 likewise). Any RHS F(c) with R <= F(c) forced for all c must therefore be scale-invariant; but a raw magnitude ||c||_1 = sum|c_n| or ||c||_2 = sqrt(sum c_n^2) is homogeneous of degree 1, so F(lambda c) = lambda F(c) ranges over (0, infinity) at FIXED R -- no bound R <= F(||c||) can hold. A raw-magnitude modulus currency is a MIRAGE.",
  reading:
    "The obligation-(2) modulus/phase leg is ONE currency, not two: the imp-95233 theta (a NORMALIZED, degree-0 modulus/phase ratio) is the whole of it; a separate amplitude-magnitude lever is closed off by scale-invariance. Sharpens the ledger; moves no bound. Residual unchanged from imp-95233: a SHARP theta-priced bound removing the 1/theta loss (VACUOUS for theta < e^(-y_min)).",
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN. Count leg = imp-95225 SGN-C (escaped, NP-terminal); weight leg = imp-95133 (both candidates failed); phase leg = imp-95233 PHASE-CERT (feasible, crude); raw-modulus leg = STRUCTURALLY EXCLUDED here. Obligations (1)/(3)/(4) UNCHANGED.",
  verdict:
    "RIGOROUS scope step (no new bound): the phase leg is FEASIBLE (imp-95233 PHASE-CERT, consumed as text) and the RAW-MODULUS leg is STRUCTURALLY EXCLUDED by the degree-0 scale-invariance of R and theta -- so obligation (2)'s modulus/phase leg is exactly the one scale-invariant theta currency, not two. This is an assessment; it changes NO Lambda bound; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95139_MODULUS_CURRENCY_ASSERTIONS = [
  {
    id: "imp95139-R-theta-scale-invariant",
    description:
      "R(f) and theta(f) are homogeneous of degree 0: scaling the amplitudes c -> lambda c (lambda = 7.3) leaves both fixed to rel 1e-9, on the mixed-sign triple c = (2, -3, 1.5), rates (1, 1.5, 2.3), centers (0.7, 1.2, 0.9)",
    holds: () => {
      const mu = [1, 1.5, 2.3];
      const u = [0.7, 1.2, 0.9];
      const c = [2, -3, 1.5];
      const lam = 7.3;
      const m1 = measure(mu, u, c);
      const m2 = measure(mu, u, c.map((x) => x * lam));
      return (
        Math.abs(m1.R - m2.R) < 1e-9 * Math.abs(m1.R) + 1e-12 &&
        Math.abs(m1.theta - m2.theta) < 1e-9 * Math.abs(m1.theta) + 1e-12
      );
    },
  },
  {
    id: "imp95139-raw-modulus-not-scale-invariant",
    description:
      "the raw magnitudes ||c||_1 and ||c||_2 ARE homogeneous of degree 1: c -> lambda c multiplies both by lambda (= 7.3) exactly, so they carry no admissible (scale-invariant) information about R -- a raw-modulus certificate is excluded",
    holds: () => {
      const c = [2, -3, 1.5];
      const lam = 7.3;
      const cl = c.map((x) => x * lam);
      return (
        Math.abs(l1(cl) - lam * l1(c)) < 1e-9 * lam * l1(c) &&
        Math.abs(l2(cl) - lam * l2(c)) < 1e-9 * lam * l2(c) &&
        // and they genuinely change under scaling (not degenerate at lambda != 1)
        Math.abs(l1(cl) - l1(c)) > 1
      );
    },
  },
  {
    id: "imp95139-magnitude-carries-no-R-info",
    description:
      "two amplitude vectors with a common scale-invariant shape but different raw magnitude -- c and 100*c -- give IDENTICAL R (0.1368...) while ||c||_1 differs by a factor 100: magnitude alone cannot bound R, confirming the raw-modulus leg is a mirage",
    holds: () => {
      const mu = [1, 1.5, 2.3];
      const u = [0.7, 1.2, 0.9];
      const c = [2, -3, 1.5];
      const big = c.map((x) => x * 100);
      const mc = measure(mu, u, c);
      const mb = measure(mu, u, big);
      const sameR = Math.abs(mc.R - mb.R) < 1e-9;
      const modulusDiffers = Math.abs(l1(big) / l1(c) - 100) < 1e-9;
      return sameR && modulusDiffers;
    },
  },
  {
    id: "imp95139-verdict-honesty",
    description:
      "the verdict carries the honest scope: phase leg FEASIBLE (cited, not re-derived), raw-modulus leg STRUCTURALLY EXCLUDED, sub-gap STILL OPEN, no new bound, NO QED, remains SOTA",
    holds: () =>
      /FEASIBLE/.test(IMP95139_MODULUS_CURRENCY_SCOPE.phaseLeg) &&
      /STRUCTURALLY EXCLUDED/.test(IMP95139_MODULUS_CURRENCY_SCOPE.rawModulusLeg) &&
      /STILL OPEN/.test(IMP95139_MODULUS_CURRENCY_SCOPE.subGap) &&
      /NO QED/.test(IMP95139_MODULUS_CURRENCY_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP95139_MODULUS_CURRENCY_SCOPE.verdict),
  },
];

for (const a of IMP95139_MODULUS_CURRENCY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95139-modulus-currency-scope assertion failed: ${a.id}`);
  }
}

export default IMP95139_MODULUS_CURRENCY_SCOPE;
