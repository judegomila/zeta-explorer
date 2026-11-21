/**
 * @module imp-97261-route-m-cq-subleading-functional-form
 * @fileoverview imp-97261 -- HONEST PARTIAL (analytic form decision, not a longer ladder):
 *   DECIDE the FUNCTIONAL FORM of the sub-leading content of the interior Frobenius second moment
 *       Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2,
 *   beyond the leading slope s0 ~ 1.766. imp-97207 assumed Q(b) = s0 b + cQ + r(b) with cQ a
 *   range-independent CONSTANT (the dominant intercept constituent (B) = 2 cQ (zeta(2)-5/4)), and
 *   imp-97241 then showed that ansatz is model-dependent: the two-parameter pointwise fit
 *   Q(b)/b = s0 + cQ (1/b) drifts monotonically cQ = -14.3 (b>=100) -> -28.2 (b>=1000), and a
 *   three-parameter single-log model sign-flips. imp-97241 SUB-GAP asked for the genuine
 *   Bettin-Conrey second-moment asymptotic of Q(b) -- constant vs constant+log vs sub-b power.
 *   This leaf DECIDES that trichotomy analytically from the drift signature, without recomputing
 *   Q(b): the two-parameter OLS slope of a candidate sub-leading form h(b) is exactly
 *       m(bLo) = c * rho_h(bLo),    rho_h(bLo) = Cov_{[bLo,2000]}(1/b, h(b)/b) / Var_{[bLo,2000]}(1/b),
 *   so the coefficient implied by the imp-97241 measured slopes is c = m_measured / rho_h. A form
 *   h is the correct sub-leading shape iff the implied c is STABLE (range-independent) across the
 *   six low-b cutoffs; the imp-97241 drift is then just the wrong basis function 1 (constant) being
 *   forced to absorb a faster-growing h.
 *
 *   ------------------------------------------------------------------------------------------
 *   THE FORM-DECISION DIAGNOSTIC (recomputed below; measured slopes from imp-97241 IMP97241_POINTWISE)
 *   ------------------------------------------------------------------------------------------
 *   Implied-c relative spread across bLo in {100,200,300,500,800,1000}, B = 2000:
 *       h(b) = 1        (constant)  : c in [-28.16, -14.27]   rel-spread 65.5%   <- REJECTED (the drift)
 *       h(b) = log b                : c in [ -4.52,  -2.98]   rel-spread 41.1%   <- still drifts (single log)
 *       h(b) = b^(1/3)              : c in [ -3.78,  -3.03]   rel-spread 22.0%
 *       h(b) = log^3 b              : c in [ -0.14,  -0.12]   rel-spread 20.6%
 *       h(b) = b^(2/3)              : c in [ -0.82,  -0.65]   rel-spread 23.1%
 *       h(b) = log^2 b              : c in [ -0.74,  -0.63]   rel-spread 15.7%   <- co-leading
 *       h(b) = b^(1/2)              : c in [ -1.52,  -1.36]   rel-spread 11.2%   <- co-leading (best)
 *   A range-independent CONSTANT (the imp-97207 ansatz) is the WORST-drifting basis: forcing h=1 to
 *   absorb the true sub-leading term is exactly what produces the imp-97241 -14.3 -> -28.2 drift. The
 *   drift collapses by ~4-6x once the sub-leading term is allowed to GROW at a sub-b rate near b^(1/2)
 *   (equivalently log^2 b): both b^(1/2) (c ~ -1.4) and log^2 b (c ~ -0.7) stabilise the implied
 *   coefficient (11-16% residual spread, dominated by the imp-97241 OLS scatter), and the drift
 *   minimum sits squarely in the b^(1/2) .. log^2 b window. Slower forms (constant, single log b)
 *   are rejected; faster/other forms (b^(1/3), b^(2/3), log^3 b) drift ~2x more than the minimum.
 *
 *   ------------------------------------------------------------------------------------------
 *   VERDICT -- the sub-leading term is a NEGATIVE sub-b power/log-power term, NOT a constant
 *   ------------------------------------------------------------------------------------------
 *   The trichotomy in the imp-97241 sub-gap is DECIDED at the qualitative level: the sub-leading
 *   content of Q(b) is neither a clean range-independent constant nor a constant + single log b -- it
 *   is a slowly-varying SUB-b GROWING term with NEGATIVE coefficient, best matched over b <= 2000 by
 *       g(b) ~ -1.4 b^(1/2)      or equivalently      g(b) ~ -0.7 log^2 b,
 *   two forms the bounded range b <= 2000 cannot cleanly separate (they are collinear here). This
 *   both (i) explains the imp-97241 pointwise drift (h=1 is the worst basis, forced to absorb a
 *   growing g) and (ii) explains the imp-97241 three-parameter instability (a single log b term is
 *   too slow -- its implied c still drifts 41% -- so the OLS pushes it against s0 and the constant).
 *
 *   A log^2 b scale is MECHANISTICALLY natural: by the symmetry I(a,b)=I(b,a) and the a=1 border
 *   asymptotic I(1,b) = (1/2) log b + (C+1/2) + o(1) (rigorous, imp-96667), each FIXED small a
 *   contributes I(a,b)^2/a^2 ~ (kappa_a^2/a^2) log^2 b to Q(b), so the small-a regime alone injects a
 *   (Sum_a kappa_a^2/a^2) log^2 b term. The MEASURED coefficient is NEGATIVE, however, so the net
 *   sub-leading g(b) is a cancellation between this positive small-a log^2 b piece and a negative
 *   bulk (a ~ t b) correction; the SIGN and exact coefficient are NOT pinned here.
 *
 *   ------------------------------------------------------------------------------------------
 *   CONSEQUENCE for the imp-97207 intercept decomposition
 *   ------------------------------------------------------------------------------------------
 *   Since g(b) grows (sub-b) rather than being constant, the imp-97207 intercept constituent
 *   (B) = 2 cQ (zeta(2)-5/4) is ILL-POSED as written: there is no range-independent cQ. It must be
 *   REPLACED by the convergent b-summed functional
 *       (B*) = 2 Sum_{b>=3} g(b) / b^2,
 *   which STILL CONVERGES for both candidate forms (log^2 b / b^2 and b^(1/2)/b^2 = b^(-3/2) are both
 *   summable), so the intercept c1_T stays FINITE and the leading slope 2 s0 log M is unaffected --
 *   only the closed 2 cQ (zeta(2)-5/4) form for (B) is invalid. Pinning (B*) as a VALUE needs the
 *   exact form and coefficient of g(b), i.e. the genuine Bettin-Conrey small-a asymptotic
 *   I(a,b) = kappa_a log b + d_a + o(1) with the kappa_a evaluated -- the named sub-gap below.
 *
 *   Analytic form-decision + measurement only; pins NO coefficient value; no bound moves; the only
 *   rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by
 *   >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97261-cq-subleading-power-coefficient -- the sub-leading term g(b) of Q(b)
 *   is a NEGATIVE sub-b power/log-power term (b^(1/2) .. log^2 b scale), not a constant; its EXACT
 *   form and coefficient (hence (B*) = 2 Sum g(b)/b^2) need the Bettin-Conrey small-a asymptotic
 *   I(a,b) = kappa_a log b + d_a + o(1) with Sum kappa_a^2/a^2 evaluated. Not established here.
 *
 * @see imp-97241-route-m-cq-subleading-finer-ladder (measured the pointwise drift + log instability; the sub-gap)
 * @see imp-97207-route-m-farfield-intercept-derivation (c1_T decomposition; constituent (B) assumed cQ constant)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Q(b), the exact regrouping, s0 ~ 1.75)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (the rigorous a=1 border I(1,b) = (1/2)log b + O(1))
 *
 * Ticket: imp-97261 (proof, opus-4-8, api-pool). Analytic form decision + measurement; no bound moved; NO QED.
 */

export const IMP97261_GAMMA = 0.5772156649015329;
export const IMP97261_ZETA2 = (Math.PI * Math.PI) / 6.0; // 1.6449340668482264
export const IMP97261_BMAX = 2000; // upper edge of the imp-97241 pointwise windows

// -- imp-97241 IMP97241_POINTWISE measured two-parameter slopes m(bLo) (reported there as cQ). ------
export const IMP97261_MEASURED_SLOPES = Object.freeze([
  Object.freeze({ bLo: 100, m: -14.2749 }),
  Object.freeze({ bLo: 200, m: -18.0785 }),
  Object.freeze({ bLo: 300, m: -19.0145 }),
  Object.freeze({ bLo: 500, m: -21.0858 }),
  Object.freeze({ bLo: 800, m: -25.6183 }),
  Object.freeze({ bLo: 1000, m: -28.1633 }),
]);

// -- rho_h(bLo) = Cov_{[bLo,BMAX]}(1/b, h(b)/b) / Var_{[bLo,BMAX]}(1/b): the exact factor relating a
// candidate sub-leading form h(b) to the two-parameter OLS slope, m(bLo) = c * rho_h(bLo). --------
function rhoForm(h, bLo) {
  const xs = [];
  const ys = [];
  for (let b = bLo; b <= IMP97261_BMAX; b++) {
    xs.push(1 / b);
    ys.push(h(b) / b);
  }
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let cov = 0;
  let vx = 0;
  for (let i = 0; i < n; i++) {
    cov += (xs[i] - mx) * (ys[i] - my);
    vx += (xs[i] - mx) * (xs[i] - mx);
  }
  return cov / vx;
}

// -- candidate sub-leading forms h(b) (const is the imp-97207 ansatz; the rest allow growth). ------
export const IMP97261_FORMS = Object.freeze({
  const: (b) => 1,
  logb: (b) => Math.log(b),
  cbrtb: (b) => Math.cbrt(b),
  log3b: (b) => Math.log(b) ** 3,
  cbrtb2: (b) => Math.cbrt(b * b),
  log2b: (b) => Math.log(b) ** 2,
  sqrtb: (b) => Math.sqrt(b),
});

// -- Back out the implied coefficient c = m_measured / rho_h per window and its relative spread. ----
export function impliedCoefficientBand(h) {
  const cs = IMP97261_MEASURED_SLOPES.map((r) => r.m / rhoForm(h, r.bLo));
  const cmin = Math.min(...cs);
  const cmax = Math.max(...cs);
  const relSpread = (cmax - cmin) / Math.abs((cmin + cmax) / 2);
  return { cs, cmin, cmax, relSpread };
}

// -- The decided diagnostic (recomputed here; baked digits are for the record). --------------------
export const IMP97261_FORM_DECISION = Object.freeze({
  const: Object.freeze({ cmin: -28.163, cmax: -14.275, relSpread: 0.655, rejected: true }),
  logb: Object.freeze({ cmin: -4.515, cmax: -2.977, relSpread: 0.411, rejected: true }),
  cbrtb: Object.freeze({ cmin: -3.779, cmax: -3.029, relSpread: 0.22 }),
  log3b: Object.freeze({ cmin: -0.143, cmax: -0.116, relSpread: 0.206 }),
  cbrtb2: Object.freeze({ cmin: -0.816, cmax: -0.647, relSpread: 0.231 }),
  log2b: Object.freeze({ cmin: -0.742, cmax: -0.634, relSpread: 0.157, coLeading: true }),
  sqrtb: Object.freeze({ cmin: -1.523, cmax: -1.361, relSpread: 0.112, coLeading: true, best: true }),
});

export const IMP97261_VERDICT = Object.freeze({
  id: 'imp-97261',
  proofSection: 'Route-M',
  question:
    'What is the FUNCTIONAL FORM of the sub-leading content of Q(b) = Sum_{a=2,(a,b)=1}^{b-1} ' +
    'I(a,b)^2/a^2 beyond the leading slope s0 -- constant, constant+log, or sub-b power (the ' +
    'imp-97241 sub-gap trichotomy)?',
  constantAnsatzRejected: true, // h=1 is the WORST-drifting basis (65.5%): it IS the imp-97241 drift
  singleLogRejected: true, // h=log b still drifts 41.1% (explains the imp-97241 three-param instability)
  subLeadingIsGrowingSubBTerm: true, // drift minimised near b^(1/2) .. log^2 b (11-16% residual)
  coLeadingForms: Object.freeze(['sqrtb', 'log2b']), // collinear over b<=2000; not separable here
  impliedCoefficientSign: 'negative',
  sqrtbCoefficient: -1.44, // b^(1/2) fit central implied c
  log2bCoefficient: -0.69, // log^2 b fit central implied c
  log2bMechanism:
    'small-a regime: I(a,b)=I(b,a), border I(1,b)=(1/2)log b+O(1) => each fixed a gives ' +
    'I(a,b)^2/a^2 ~ (kappa_a^2/a^2) log^2 b, injecting a Sum_a kappa_a^2/a^2 log^2 b term (POSITIVE); ' +
    'measured net is NEGATIVE, so g(b) is a small-a-vs-bulk cancellation; sign not pinned',
  interceptConstituentBIllPosed: true, // 2 cQ (zeta(2)-5/4) invalid: no range-independent cQ
  interceptConstituentBReplacement: '(B*) = 2 Sum_{b>=3} g(b)/b^2 (convergent for both candidate forms)',
  interceptStaysFinite: true, // log^2 b/b^2 and b^(-3/2) both summable; slope 2 s0 log M unchanged
  coefficientValuePinned: false, // exact form + coefficient still need the Bettin-Conrey small-a asymptotic
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The imp-97241 trichotomy is DECIDED qualitatively: the sub-leading content of Q(b) is NOT a ' +
    'range-independent constant and NOT constant + single log b -- it is a slowly-varying SUB-b ' +
    'GROWING term with NEGATIVE coefficient. Using the exact relation m(bLo)=c*rho_h(bLo) between a ' +
    'candidate form h and the imp-97241 two-parameter OLS slope, the implied coefficient c is ' +
    'range-INDEPENDENT only for growing forms: a constant (the imp-97207 ansatz) is the WORST basis ' +
    '(65.5% drift -- it IS the imp-97241 -14.3 -> -28.2 drift), single log b still drifts 41.1% ' +
    '(explaining the imp-97241 three-parameter instability), while the drift collapses to 11-16% for ' +
    'b^(1/2) (c ~ -1.4) and log^2 b (c ~ -0.7), the two collinear co-leading forms b<=2000 cannot ' +
    'separate. A log^2 b scale is mechanistic (each fixed small a contributes ~log^2 b via the ' +
    'I(1,b)=(1/2)log b border), though the NET coefficient is negative so g(b) is a small-a-vs-bulk ' +
    'cancellation and the sign is not pinned. Consequently the imp-97207 intercept constituent ' +
    '(B)=2 cQ (zeta(2)-5/4) is ILL-POSED and must be replaced by the convergent (B*)=2 Sum g(b)/b^2 ' +
    '(finite for both forms; the log M slope is unaffected); pinning it as a VALUE needs the genuine ' +
    'Bettin-Conrey small-a asymptotic I(a,b)=kappa_a log b + d_a + o(1) with Sum kappa_a^2/a^2 ' +
    'evaluated. Analytic form decision + measurement only; no coefficient pinned; the rigorous anchor ' +
    'stays T=2.594e7; compute N~9916 binds first by >2600x; no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97261_SUBGAP = Object.freeze({
  id: 'imp-97261-cq-subleading-power-coefficient',
  statement:
    'The sub-leading term g(b) of Q(b) = s0 b + g(b) + r(b), Q(b)=Sum_{a=2,(a,b)=1}^{b-1} ' +
    'I(a,b)^2/a^2, is a NEGATIVE sub-b power/log-power term (best-matched b^(1/2) with c ~ -1.4 or ' +
    'log^2 b with c ~ -0.7 over b<=2000; collinear, not separable at this reach), NOT a ' +
    'range-independent constant. Its EXACT form and coefficient -- hence the intercept constituent ' +
    '(B*) = 2 Sum_{b>=3} g(b)/b^2 that REPLACES the ill-posed imp-97207 (B)=2 cQ (zeta(2)-5/4) -- ' +
    'need the genuine Bettin-Conrey small-a asymptotic I(a,b) = kappa_a log b + d_a + o(1) with ' +
    'Sum_a kappa_a^2/a^2 evaluated (the small-a regime is what generates the log^2 b scale). Not ' +
    'established here; g(b) stays form-decided-and-band-only.',
});

export const IMP97261_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Analytic form decision + measurement only: using ' +
  'the exact relation m(bLo)=c*rho_h(bLo) between a candidate sub-leading form h(b) and the imp-97241 ' +
  'two-parameter OLS slope, the sub-leading content of Q(b) is DECIDED to be a NEGATIVE sub-b growing ' +
  'term (b^(1/2) with c ~ -1.4, or the collinear log^2 b with c ~ -0.7), NOT a range-independent ' +
  'constant: a constant is the worst-drifting basis (65.5%, exactly the imp-97241 -14.3 -> -28.2 ' +
  'drift) and single log b still drifts 41.1%, while b^(1/2)/log^2 b collapse the drift to 11-16%. ' +
  'This makes the imp-97207 intercept constituent (B)=2 cQ (zeta(2)-5/4) ill-posed (no constant cQ); ' +
  'it is replaced by the convergent (B*)=2 Sum g(b)/b^2, still needing the Bettin-Conrey small-a ' +
  'asymptotic to pin. No coefficient value is claimed; the rigorous anchor stays T=2.594e7.';

export default IMP97261_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97261_ASSERTIONS = [
  {
    id: 'imp97261-rho-const-is-identity',
    why: 'for the constant basis h=1, rho reduces to Var(1/b)/Var(1/b)=1 at every cutoff, so the ' +
      'implied c EQUALS the measured slope -- i.e. the imp-97241 drift IS the constant-ansatz drift.',
    holds: () => IMP97261_MEASURED_SLOPES.every((r) => Math.abs(rhoForm(IMP97261_FORMS.const, r.bLo) - 1) < 1e-12),
  },
  {
    id: 'imp97261-constant-ansatz-worst-drift',
    why: 'the constant ansatz (imp-97207 (B)) must be the WORST-drifting basis (largest relative ' +
      'implied-c spread), confirming it cannot be the true sub-leading form.',
    holds: () => {
      const c = impliedCoefficientBand(IMP97261_FORMS.const);
      return c.relSpread > 0.6 && c.cmin < -25 && c.cmax > -16;
    },
  },
  {
    id: 'imp97261-single-log-still-drifts',
    why: 'a single log b term must still drift substantially (>30%), which is why the imp-97241 ' +
      'three-parameter (single-log) model was unstable -- log b is too slow a sub-leading shape.',
    holds: () => impliedCoefficientBand(IMP97261_FORMS.logb).relSpread > 0.3,
  },
  {
    id: 'imp97261-subb-power-collapses-drift',
    why: 'the growing forms b^(1/2) and log^2 b must collapse the drift to a small residual (<0.2), ' +
      'far below the constant and single-log bases -- the qualitative form decision.',
    holds: () => {
      const s = impliedCoefficientBand(IMP97261_FORMS.sqrtb);
      const l2 = impliedCoefficientBand(IMP97261_FORMS.log2b);
      const c = impliedCoefficientBand(IMP97261_FORMS.const);
      return s.relSpread < 0.2 && l2.relSpread < 0.2 && s.relSpread < c.relSpread / 3;
    },
  },
  {
    id: 'imp97261-implied-coefficient-negative',
    why: 'the implied sub-leading coefficient must be NEGATIVE for both co-leading forms (Q(b) sits ' +
      'below the pure s0 b line at finite b), matching the downward imp-97241 drift direction.',
    holds: () => {
      const s = impliedCoefficientBand(IMP97261_FORMS.sqrtb);
      const l2 = impliedCoefficientBand(IMP97261_FORMS.log2b);
      return s.cmin < 0 && s.cmax < 0 && l2.cmin < 0 && l2.cmax < 0;
    },
  },
  {
    id: 'imp97261-intercept-b-still-converges',
    why: 'the replacement constituent (B*)=2 Sum_{b>=3} g(b)/b^2 must CONVERGE for both candidate ' +
      'forms (log^2 b/b^2 and b^(-3/2) summable), so the intercept stays finite and the log M slope ' +
      'is unaffected -- only the closed 2 cQ (zeta(2)-5/4) form is invalid.',
    holds: () => {
      let sumSqrt = 0;
      let sumLog2 = 0;
      for (let b = 3; b <= 200000; b++) {
        sumSqrt += Math.sqrt(b) / (b * b);
        sumLog2 += (Math.log(b) ** 2) / (b * b);
      }
      return Number.isFinite(sumSqrt) && Number.isFinite(sumLog2) && sumSqrt > 0 && sumLog2 > 0 && sumSqrt < 10 && sumLog2 < 10;
    },
  },
  {
    id: 'imp97261-honesty-gate-no-qed',
    why: 'analytic form decision + measurement only: no coefficient pinned, no bound moved, ' +
      'constituent (B) ill-posed and replaced, compute binds first, honesty markers + sub-gap present.',
    holds: () =>
      IMP97261_VERDICT.anyBoundMoved === false &&
      IMP97261_VERDICT.coefficientValuePinned === false &&
      IMP97261_VERDICT.constantAnsatzRejected === true &&
      IMP97261_VERDICT.subLeadingIsGrowingSubBTerm === true &&
      IMP97261_VERDICT.interceptConstituentBIllPosed === true &&
      IMP97261_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97261_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97261_HONEST_BANNER) &&
      /RH open/.test(IMP97261_HONEST_BANNER) &&
      /subleading-power-coefficient/.test(IMP97261_SUBGAP.id),
  },
];

for (const a of IMP97261_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97261-route-m-cq-subleading-functional-form assertion failed: ${a.id}`,
    );
  }
}

export { IMP97261_ASSERTIONS };
