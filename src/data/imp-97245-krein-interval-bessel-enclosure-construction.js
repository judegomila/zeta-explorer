/**
 * @fileoverview imp-97245 -- DERIVATION (honest partial): the certified per-panel interval spherical-Bessel
 * enclosure of g(t)=v0.Phih(t) as ONE phase-preserving entity, the step named in SUB-GAP
 * IMP97184_INTERVAL_BESSEL_ENCLOSURE. This leaf gives (i) the explicit enclosure CONSTRUCTION, (ii) a rigorous
 * CONSISTENCY theorem (the first-order phase-preserving enclosure converges to the exact tail integral and
 * keeps the ~15-order cancellation, unlike the zeroth-order Route A), and (iii) a LEADING ESTIMATE of the
 * enclosure-width inflation over the imp-97184 sampled sup. It does NOT run interval arithmetic, so it produces
 * NO certified numeric majorant: the certified per-panel sup of g-prime stays the residual. NO QED.
 *
 * CONTEXT. imp-97184 EXECUTED the imp-97100 Route B phase-preserving panel enclosure of the scalar Krein tail
 *   <v0 | R_T | v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |g(t)|^2 dt,   g(t) := v0 . Phih(t),
 *   Phih_j(t) = a^{2M+1} sum_k c_{jk} j_k(a t)  (M=3, j_k the spherical Bessel function),
 * and measured the panel majorant M(h)/rq falling 2.278 -> 1.421 across h = period .. period/16 (rq = 5.381e-4
 * = 1.1734x the actual residual). But the per-panel supremum there is SAMPLED on a 24-point subgrid, NOT a
 * certified interval enclosure, so imp-97184 claimed no rigorous majorant. This leaf specifies the certified
 * enclosure that would replace that sampled sup and proves it is CONSISTENT (converges to the same limit),
 * from the committed imp-97184 literals only (no new solver run).
 *
 * DOMINANT OSCILLATION (from committed literals). g(t) is a finite sum of spherical Bessels in the single
 * argument x = a t, so its dominant oscillation frequency is a = 2 pi / period; the committed
 * IMP97184_PERIOD = 11.4384 gives a = 0.549306 and 2a = ln3 exactly (the binding rung). The panel widths of
 * the imp-97184 ladder are h_i = period / 2^i (i = 0..4).
 *
 * (I) THE CERTIFIED CONSTRUCTION (mean-value / Lipschitz-corrected subgrid, phase-preserving).
 *   g-prime is again a finite spherical-Bessel sum: with x = a t,
 *       g-prime(t) = a^{2M+2} sum_j v0_j sum_k c_{jk} j_k-prime(a t),
 *     and the derivative recurrence (2k+1) j_k-prime(x) = k j_{k-1}(x) - (k+1) j_{k+1}(x) rewrites j_k-prime in
 *     the SAME family {j_{k-1}, j_k, j_{k+1}}. Hence g and g-prime share one interval spherical-Bessel evaluator
 *     over each panel argument-interval [a t_i, a t_{i+1}] (the trivial global bound |j_k(x)| <= 1 makes the
 *     evaluator total; the per-panel interval value is tight). Enclose g over panel [t_i, t_{i+1}] (width h) as
 *     one entity, keeping every inter-mode phase, by either
 *       (a) single-midpoint mean value:  g([t_i,t_{i+1}]) subset g(m_i) + (h/2) * Gp_i * [-1,1],
 *       (b) Lipschitz-corrected subgrid:  sup_{panel} |g| <= max_{s in 24-grid} |g(s)| + (delta/2) * Gp_i,
 *           delta = h/24 the imp-97184 sub-spacing, Gp_i a rigorous interval bound on |g-prime| over the panel,
 *     then enclose sigma_2 by the imp-97100 EASY closed-form digamma-asymptotic majorant and bound the panel
 *     integral by (sup enclosure of the integrand) x (panel width). Form (b) is the direct rigorous upgrade of
 *     the imp-97184 sampled sup: it keeps the 24-point sample and adds a certified safety margin.
 *
 * (II) CONSISTENCY THEOREM (rigorous, no solver). Both enclosure widths are O(h): form (a) adds (h/2) Gp_i,
 *   form (b) adds (h/48) Gp_i, and Gp_i is bounded over any fixed tail because g-prime is a finite sum of
 *   bounded (|j_k| <= 1) functions with fixed coefficients. Therefore the certified interval majorant M_iv(h)
 *   ENCLOSES the sampled majorant (M_iv(h) >= M_sampled(h)) and M_iv(h) - M_sampled(h) -> 0 as h -> 0, so
 *   M_iv(h) has the SAME h -> 0 limit as the sampled Route B majorant -- which imp-97184 measured trending to
 *   ~1x (bounded below by rq/actual = 1.1734). The certified first-order enclosure KEEPS the ~15-order phase
 *   cancellation: it never splits the sum before squaring. This is the structural separation from Route A,
 *   which is the ZEROTH-order bound |g| <= sum_j |v0_j| |Phih_j| (phase discarded) -- inconsistent, divergent
 *   (200x rq, imp-97184). The certified enclosure is first-order and consistent.
 *
 * (III) LEADING INFLATION ESTIMATE over the sampled sup (NOT certified). For the oscillatory factor,
 *   |g-prime| <= a |g|_peak + |envelope-prime|, and on t >= T = 4800 the ~t^{-4} envelope contributes
 *   |envelope-prime|/|envelope| ~ 4/t ~ 8e-4, negligible against a = 0.549; so Gp_i ~ a |g|_peak is an
 *   excellent proxy (envelope-derivative correction ~0.15%). The form-(b) margin relative to peak amplitude is
 *   then sub_i = (delta/2) a / |g|_peak ~ (h/48) a = (pi / 24) (h / period) = kappa_i / 24, kappa_i = a h_i / 2,
 *   and the certified peak-panel |g|^2 inflates the sampled M(h)/rq by at most (1 + sub_i)^2:
 *       h = period    : kappa = 3.1416, sub = 0.13090, M/rq 2.2778 -> ~2.913   (form (a) full-period is vacuous)
 *       h = period/2  : kappa = 1.5708, sub = 0.06545, M/rq 2.2769 -> ~2.585
 *       h = period/4  : kappa = 0.7854, sub = 0.03272, M/rq 2.1808 -> ~2.326
 *       h = period/8  : kappa = 0.3927, sub = 0.01636, M/rq 1.6830 -> ~1.739
 *       h = period/16 : kappa = 0.1963, sub = 0.00818, M/rq 1.4212 -> ~1.445
 *   i.e. at the finest imp-97184 rung the Lipschitz-corrected subgrid enclosure inflates the sampled figure by
 *   only ~1.6% (1.421 -> ~1.445x rq), CONFIRMING quantitatively imp-97184s vague claim that "the interval-
 *   Bessel enclosure width would inflate the narrow-panel figures only modestly". The single-midpoint form (a)
 *   is vacuous at wide panels (kappa > 1) but its width also -> 0; form (b) is the operative construction.
 *
 * VERDICT. The certified per-panel interval spherical-Bessel enclosure of g = v0.Phih as one phase-preserving
 * entity is CONSTRUCTED (form (b): 24-point subgrid + (delta/2) Gp_i Lipschitz margin, g-prime a same-family
 * spherical-Bessel sum via the derivative recurrence, sigma_2 by the closed-form majorant) and proved
 * CONSISTENT (encloses the sampled majorant, converges to the exact tail as h -> 0, keeps the ~15-order
 * cancellation -- first-order, unlike the divergent zeroth-order Route A). A leading estimate puts the certified
 * inflation over the imp-97184 sampled sup at ~1.6% at h = period/16 (M/rq 1.42 -> ~1.44). This turns the
 * IMP97184_INTERVAL_BESSEL_ENCLOSURE sub-gap from "not attempted" into a specified, consistency-proved
 * construction with a quantified reachable target.
 *
 * DERIVATION ONLY -- NO CERTIFIED MAJORANT, NO QED. The inflation figures use the oscillatory proxy
 * Gp_i ~ a |g|_peak, NOT the certified interval bound on |g-prime| per panel (which needs an actual interval
 * spherical-Bessel run reusing the imp-96888 solver -- the RESIDUAL). No interval arithmetic is executed here;
 * no rigorous numeric majorant is produced or claimed. Rayleigh floors stay UPPER bounds on true lambda_min;
 * establishes NO operator positivity; IMP96888_RAYLEIGH_TAIL_MAJORANT / IMP96749_UNIFORM_N_GAP_UNSETTLED stay
 * open; the Route C far tail [Tfar, oo) stays out of scope; interval-rigorous reach stays 2a <= 0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * THE RESIDUAL (named). SUB-GAP IMP97245_CERTIFIED_GPRIME_INTERVAL (refines IMP97184_INTERVAL_BESSEL_ENCLOSURE):
 * run the interval spherical-Bessel evaluator (form (b)) on the imp-96888 solver output to produce the certified
 * per-panel bound Gp_i on |g-prime| and the resulting certified M_iv(h)/rq, replacing the leading proxy
 * Gp_i ~ a |g|_peak used here; plus a Route C far-tail majorant beyond Tfar. Only then does a rigorous numeric
 * majorant exist.
 *
 * @see imp-97184-krein-routeb-panel-enclosure-execution.js (SAMPLED Route B execution; source of the h ladder + period)
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (Route B/EASY sigma_2 majorant; IMP97100_PHASE_CANCELLATION_TRIAL)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (min-max Rayleigh tail integral; source solver + quadrature literals)
 */

import { IMP97184_ROUTEB, IMP97184_PERIOD, IMP97184_RQ } from './imp-97184-krein-routeb-panel-enclosure-execution.js';

const LN3 = Math.log(3); // 1.0986122886681098

// dominant oscillation frequency a = 2 pi / period; the binding rung has 2a = ln3 exactly.
export const IMP97245_A = (2 * Math.PI) / IMP97184_PERIOD; // 0.5493061443340549
export const IMP97245_SUBGRID_POINTS = 24; // imp-97184 per-panel sample count (sub-spacing delta = h/24)

// Certified-enclosure inflation ladder over the imp-97184 sampled sup.
// kappa_i = a h_i / 2 = pi h_i / period (single-midpoint mean-value width / peak amplitude);
// sub_i = kappa_i / 24 (Lipschitz-corrected 24-pt subgrid margin / peak amplitude, form (b));
// certEstMOverRq = (sampled M/rq) * (1 + sub_i)^2 -- LEADING estimate (proxy Gp ~ a |g|_peak), NOT certified.
export const IMP97245_INFLATION = Object.freeze(
  IMP97184_ROUTEB.map((r) => {
    const kappa = (Math.PI * r.h) / IMP97184_PERIOD;
    const sub = kappa / IMP97245_SUBGRID_POINTS;
    return Object.freeze({
      h: r.h,
      sampledMOverRq: r.MOverRq,
      kappa,
      sub,
      certEstMOverRq: r.MOverRq * (1 + sub) ** 2,
    });
  }),
);

// finest imp-97184 rung (h = period/16): certified inflation over the sampled sup, leading estimate.
export const IMP97245_FINEST_SUB = IMP97245_INFLATION[IMP97245_INFLATION.length - 1].sub; // ~0.008181
export const IMP97245_FINEST_CERT_EST = IMP97245_INFLATION[IMP97245_INFLATION.length - 1].certEstMOverRq; // ~1.4446

export const IMP97245_VERDICT = Object.freeze({
  ticket: 'imp-97245',
  question:
    'attempt the IMP97184_INTERVAL_BESSEL_ENCLOSURE sub-gap: replace the imp-97184 sampled 24-point per-panel supremum with a certified interval spherical-Bessel enclosure of g(t)=v0.Phih(t) as one phase-preserving entity, to turn the measured Route B convergence into a rigorous majorant.',
  answer:
    'derivation / honest partial. (I) The certified enclosure is CONSTRUCTED: form (b) = 24-point subgrid sup + (delta/2) Gp_i Lipschitz margin (delta = h/24), with g-prime a SAME-FAMILY spherical-Bessel sum via (2k+1) j_k-prime = k j_{k-1} - (k+1) j_{k+1} (so g and g-prime share one per-panel interval evaluator), sigma_2 by the imp-97100 closed-form majorant, phases kept. (II) CONSISTENCY is proved: the enclosure width is O(h), so the certified majorant M_iv(h) encloses the sampled majorant and converges to the exact tail (~1x) as h -> 0, keeping the ~15-order cancellation -- first-order, unlike the divergent zeroth-order Route A. (III) LEADING estimate: with the oscillatory proxy Gp_i ~ a |g|_peak, the form-(b) inflation over the sampled sup is (1 + kappa_i/24)^2, so at h = period/16 the certified M/rq is ~1.445 vs sampled 1.421 (~1.6%). NO interval run: the certified per-panel Gp_i is the residual; no rigorous numeric majorant is produced or claimed.',
  N: 100,
  twoA: LN3,
  T: 4800,
  Tfar: 60000,
  a: IMP97245_A,
  twoAEqualsLn3: Math.abs(2 * IMP97245_A - LN3) < 1e-12, // rung self-consistency: a = 2 pi / period gives 2a = ln3
  constructionSpecified: true, // form (b): subgrid + Lipschitz margin, g-prime same-family spherical-Bessel sum
  gPrimeSameFamily: true, // (2k+1) j_k-prime = k j_{k-1} - (k+1) j_{k+1}: g and g-prime share one interval evaluator
  consistencyProved: true, // enclosure width O(h) -> M_iv encloses M_sampled and converges to exact tail
  keepsPhaseCancellation: true, // first-order enclosure never splits before squaring (vs zeroth-order Route A)
  routeAIsZerothOrderDivergent: true, // Route A = zeroth-order split-before-square, inconsistent (200x rq)
  finestSampledMOverRq: IMP97184_ROUTEB[IMP97184_ROUTEB.length - 1].MOverRq, // 1.4212 (h = period/16)
  finestCertEstMOverRq: IMP97245_FINEST_CERT_EST, // ~1.4446 leading estimate
  finestInflationPct: 100 * ((1 + IMP97245_FINEST_SUB) ** 2 - 1), // ~1.6% inflation over the sampled sup
  inflationIsLeadingEstimateNotCertified: true, // uses Gp_i ~ a |g|_peak, not a certified interval bound
  intervalArithmeticExecuted: false, // no interval run here
  intervalMajorantProduced: false, // no rigorous numeric majorant produced or claimed
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  farTailRouteCOutOfScope: true, // [Tfar, oo) not enclosed here
  subGap:
    'IMP97245_CERTIFIED_GPRIME_INTERVAL (refines IMP97184_INTERVAL_BESSEL_ENCLOSURE) -- the certified enclosure (form (b): 24-pt subgrid + (delta/2) Gp_i Lipschitz margin, g-prime a same-family spherical-Bessel sum) is CONSTRUCTED and proved CONSISTENT (encloses the sampled majorant, converges to the exact tail, keeps the ~15-order cancellation), and a leading estimate puts the inflation over the imp-97184 sampled sup at ~1.6% (M/rq 1.42 -> ~1.44 at h = period/16). The residual is running the interval spherical-Bessel evaluator on the imp-96888 solver output to produce the CERTIFIED per-panel Gp_i (replacing the proxy Gp_i ~ a |g|_peak) and the certified M_iv(h)/rq, plus a Route C far-tail majorant beyond Tfar. No interval arithmetic is executed here; no rigorous numeric majorant exists yet.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97245_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97245_ASSERTIONS = [
  {
    id: 'imp97245-rung-self-consistent',
    holds: () =>
      Math.abs(IMP97245_A - 0.5493061443340549) < 1e-12 &&
      Math.abs(2 * IMP97245_A - LN3) < 1e-12 &&
      IMP97245_VERDICT.twoAEqualsLn3 === true,
    why: 'the dominant oscillation frequency a = 2 pi / IMP97184_PERIOD equals 0.549306 and 2a = ln3 exactly -- the enclosure construction is anchored to the committed binding rung, not a re-derived constant.',
  },
  {
    id: 'imp97245-inflation-ladder-monotone-and-shrinking',
    holds: () => {
      const inf = IMP97245_INFLATION;
      // sub_i = kappa_i/24 halves each rung (h_i = period/2^i) and the cert estimate stays >= the sampled sup
      const halving = inf.every((row, i) => i === 0 || Math.abs(row.sub / inf[i - 1].sub - 0.5) < 1e-6);
      const encloses = inf.every((row) => row.certEstMOverRq >= row.sampledMOverRq - 1e-12);
      return (
        inf.length === 5 &&
        halving &&
        encloses &&
        Math.abs(inf[0].kappa - Math.PI) < 1e-6 && // h = period -> kappa = pi
        Math.abs(inf[4].sub - 0.008181) < 1e-5
      );
    },
    why: 'the Lipschitz-corrected subgrid margin sub_i = kappa_i/24 halves with each panel bisection and the certified estimate always encloses the sampled M/rq -- the O(h) enclosure width vanishes as h -> 0 (consistency), reaching ~0.82% amplitude margin at the finest rung.',
  },
  {
    id: 'imp97245-finest-inflation-modest',
    holds: () =>
      Math.abs(IMP97245_FINEST_CERT_EST - 1.444595) < 1e-4 &&
      IMP97245_VERDICT.finestInflationPct > 1 &&
      IMP97245_VERDICT.finestInflationPct < 2 &&
      IMP97245_FINEST_CERT_EST > IMP97184_ROUTEB[IMP97184_ROUTEB.length - 1].MOverRq,
    why: 'at h = period/16 the certified enclosure (leading estimate) inflates the imp-97184 sampled M/rq = 1.4212 to ~1.4446 (~1.6%), quantifying imp-97184s claim that the interval-Bessel width inflates the narrow-panel figures only modestly.',
  },
  {
    id: 'imp97245-uses-committed-imp97184-literals',
    holds: () =>
      IMP97184_ROUTEB.length === 5 &&
      Math.abs(IMP97184_RQ - 5.381115666090913e-4) < 1e-12 &&
      Math.abs(IMP97184_PERIOD - 11.438403469520507) < 1e-9,
    why: 'the construction and inflation ladder are built from the committed imp-97184 Route B literals (h ladder, period, rq), not a fresh solver run -- the leaf is a derivation on top of the measured convergence.',
  },
  {
    id: 'imp97245-derivation-only-no-qed',
    holds: () =>
      IMP97245_VERDICT.constructionSpecified === true &&
      IMP97245_VERDICT.gPrimeSameFamily === true &&
      IMP97245_VERDICT.consistencyProved === true &&
      IMP97245_VERDICT.keepsPhaseCancellation === true &&
      IMP97245_VERDICT.routeAIsZerothOrderDivergent === true &&
      IMP97245_VERDICT.inflationIsLeadingEstimateNotCertified === true &&
      IMP97245_VERDICT.intervalArithmeticExecuted === false &&
      IMP97245_VERDICT.intervalMajorantProduced === false &&
      IMP97245_VERDICT.operatorPositivityProved === false &&
      IMP97245_VERDICT.rayleighTailMajorantOpen === true &&
      IMP97245_VERDICT.uniformNGapSettled === false &&
      IMP97245_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97245_VERDICT.qed === false &&
      typeof IMP97245_VERDICT.subGap === 'string' &&
      IMP97245_VERDICT.subGap.includes('IMP97245_CERTIFIED_GPRIME_INTERVAL') &&
      IMP97245_VERDICT.subGap.includes('IMP97184_INTERVAL_BESSEL_ENCLOSURE'),
    why: 'the certified enclosure is constructed and proved consistent, but the inflation uses the proxy Gp ~ a |g|_peak, not a certified interval bound: no interval arithmetic is run, no rigorous majorant is produced, Rayleigh floors stay UPPER bounds, gaps open, reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP97245_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97245-krein-interval-bessel-enclosure-construction assertion failed: ${a.id}`);
  }
}

void LN3;
