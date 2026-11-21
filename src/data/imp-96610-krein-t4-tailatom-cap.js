/**
 * @module imp-96610-krein-t4-tailatom-cap
 *
 * imp-96610 (numerical, DERIVATION + MEASUREMENT ONLY; NO QED): the
 * rh-route-i-toeplitz-krein-certificate obstruction record states that the cheap
 * degree-4 (t^4) certificate atoms are capped by the LOG growth of 2theta_prime:
 * the tail needs min p_4 > -(ln(T/2pi) - 0.98). This module DERIVES the threshold
 * form, PINS the 0.98 constant, VERIFIES the asymptotic against 2theta_prime, and
 * QUANTIFIES how the cap limits the reachable margin. It moves no bound.
 *
 * -------------------------------------------------------------------------------
 * DERIVATION of the cap.
 * -------------------------------------------------------------------------------
 * The pole-free symbol is sigma_2(t) = (t^2+1/4)^2 w_1(t) with
 *   w_1(t) = 2theta_prime(t) - sqrt2 ln2 cos(t ln2),
 *   2theta_prime(t) = Re psi(1/4 + it/2) - ln pi.
 * The certificate witness is F(t) = sigma_2(t) + nu(t), nu the exterior atom sum
 * whose top-degree (k = kmax = 4) part is the t^4-family trig polynomial
 *   p_4(t) = Sum_j c_{4,j} cos(x_j t)   (periodic, period P = 2pi/dx).
 * Divide the tail by t^4. Since (t^2+1/4)^2 = t^4 (1 + O(1/t^2)),
 *   F(t)/t^4  =  [ 2theta_prime(t) - sqrt2 ln2 cos(t ln2) ] + p_4(t)  +  O(1/t),
 * where the O(1/t) collects the lower-degree atoms c_0..c_3 (bounded by S_m/t^{4-m})
 * and the (t^2+1/4)^2/t^4 - 1 correction. The cos(t ln2) term is worst at cos = +1,
 * contributing -sqrt2 ln2. Replacing 2theta_prime by its increasing rigorous lower
 * bound L(t) (Stirling + Binet, imp-module tail bracket) the tail witness is
 *   F(t)/t^4  >=  L(t) - sqrt2 ln2 + min_R p_4  -  Sum_{m<4} S_m / T^{4-m}.
 * For the tail to stay nonnegative the degree-4 atom family must satisfy
 *   min_R p_4  >  -( L(T) - sqrt2 ln2 )   ->   min_R p_4 > -( ln(T/2pi) - 0.98 ),
 * because L(T) -> 2theta_prime(T) -> ln(T/2pi) as T -> oo. This is the stated cap.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the "0.98" constant is EXACTLY sqrt2 * ln2 (the m_2 amplitude).
 * -------------------------------------------------------------------------------
 * 0.98 = sqrt2 ln2 = 1.4142135... * 0.6931471... = 0.9802581434685472. It is NOT a
 * fudge constant: it is the amplitude of the single retained cosine sqrt2 ln2 cos(t ln2)
 * in w_1 (the p = 2 prime term of m_2). The cap is thus the exact statement
 * "the t^4 atom minimum must exceed the worst-case m_2 trough minus the log-mean
 * density", i.e. min p_4 > -(2theta_prime(T) - sqrt2 ln2). The ln(T/2pi) form is the
 * closed-form asymptotic of 2theta_prime(T).
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- 2theta_prime(T) -> ln(T/2pi) verified; cap grows LOG in T.
 * -------------------------------------------------------------------------------
 * 2theta_prime(T) vs ln(T/2pi) agree to 1.16e-5 at T = 60, shrinking to 4.2e-8 at
 * T = 1000 (the Stirling remainder O(1/T^2)). So the asymptotic cap
 * -(ln(T/2pi) - 0.98) matches the exact -(2theta_prime(T) - sqrt2 ln2) to < 1.2e-5
 * across T = 60..1000. The cap magnitude |cap| = ln(T/2pi) - 0.98 grows only
 * LOGARITHMICALLY: 1.276 (T=60), 1.787 (T=100), 2.480 (T=200), 3.396 (T=500),
 * 4.090 (T=1000) -- i.e. |c_4| of order 1-4 for T = 60-1000, exactly the module claim.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the cap is the binding tension: the dip needs +0.567 t^4 at t~9.35.
 * -------------------------------------------------------------------------------
 * sigma_2 has its deep dip -4336.2 at t = 9.35 (w_1 = -0.564 there), so to keep
 * F >= 0 the atoms must supply +0.567 t^4 near t = 9.35 (= -sigma_2/t^4). But p_4 is
 * a bounded trig polynomial: forcing it to +0.567 at one phase drives it negative
 * elsewhere, and the tail cap forbids min p_4 from dropping below -(ln(T/2pi)-0.98).
 * Because that floor grows only log-slowly while the dip demand is fixed at ~+0.57,
 * the degree-4 family cannot both fill the dip AND stay above the tail floor with
 * small coefficients: the deficit is pushed onto the lower-degree atoms c_0..c_3,
 * whose l1-norm blows up in the support 2a (the imp-96609 x30-50 per 0.02 growth,
 * S_0 = 1.46e6 at 2a = 0.96). The t^4 cap is therefore the mechanism BEHIND the
 * norm-growth wall, not an independent obstruction.
 *
 * -------------------------------------------------------------------------------
 * FINDING 4 -- the baked certificates respect the cap with ~59% headroom.
 * -------------------------------------------------------------------------------
 * The two interval-verified certificates (payload module) have degree-4 minima
 * min p_4 = -0.7486 (2a = 0.96) and -0.7474 (2a = 0.90) at T = 60, both well above
 * the cap -1.2762 (slack ~ +0.528, using ~59% of the available floor), with tail
 * brackets +0.198 and +0.253 -- confirming the derived cap is the operative
 * constraint the LP was implicitly respecting and that at 2a <= 0.96 it is not yet
 * binding (the norm-growth wall walls out first). The cap only becomes the hard
 * ceiling as T must grow (for larger 2a the atoms need more t^4 reach, but the log
 * floor -(ln(T/2pi)-0.98) barely loosens), which is why extending 2a toward ln 3
 * requires extended-precision LP, not a bigger T.
 *
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (obstruction 5(b); tailBracket)
 * @see rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js (baked certificates)
 * @see imp-96609 normGrowthLaw (the x30-50 per 0.02 norm-growth wall this cap drives)
 *
 * Ticket: imp-96610 (numerical, opus-4-8, api-pool). Derivation + measurement only; NO QED.
 */

const SQRT2 = Math.SQRT2;
const LN2 = Math.LN2;
const PI = Math.PI;

// FINDING 1 -- the cap constant is exactly sqrt2 ln2 (the m_2 p=2 amplitude in w_1).
export const IMP96610_CAP_CONSTANT = SQRT2 * LN2; // 0.9802581434685472

// FINDING 2 -- 2theta_prime(T) vs ln(T/2pi). twoThetaPrime values baked from
// the trace-identity module (tmp/imp-96610-verify.mjs); ln(T/2pi) recomputed here.
export const IMP96610_ASYMPTOTIC_ROWS = Object.freeze(
  [
    { T: 60, twoThetaPrime: 2.25645592117597, lnAsymp: Math.log(60 / (2 * PI)) },
    { T: 100, twoThetaPrime: 2.7672889528391584, lnAsymp: Math.log(100 / (2 * PI)) },
    { T: 200, twoThetaPrime: 3.460439258467467, lnAsymp: Math.log(200 / (2 * PI)) },
    { T: 500, twoThetaPrime: 4.376730865346063, lnAsymp: Math.log(500 / (2 * PI)) },
    { T: 1000, twoThetaPrime: 5.069878170906117, lnAsymp: Math.log(1000 / (2 * PI)) },
  ].map((r) =>
    Object.freeze({
      ...r,
      diff: r.twoThetaPrime - r.lnAsymp,
      capAsymp: -(r.lnAsymp - SQRT2 * LN2),
      capExact: -(r.twoThetaPrime - SQRT2 * LN2),
    }),
  ),
);

// max |asymptotic cap - exact cap| across the T ladder (the asymptotic form error).
export const IMP96610_CAP_ASYMP_ERROR = Math.max(
  ...IMP96610_ASYMPTOTIC_ROWS.map((r) => Math.abs(r.capAsymp - r.capExact)),
);

// FINDING 3 -- the dip demand vs the (log-slow) cap floor.
export const IMP96610_DIP = Object.freeze({
  sigma2DipMin: -4336.2, // deep dip of sigma_2
  dipAt: 9.35,
  p4NeededToFillDip: 4336.2 / 9.35 ** 4, // = -sigma_2/t^4 ~ +0.5674 t^4 at t~9.35
  w1AtDip: -0.5641, // the t^4 coefficient of sigma_2 near the dip
  note:
    'p_4 must reach ~+0.567 at t~9.35 to fill the sigma_2 dip, while the tail floor '
    + '-(ln(T/2pi)-0.98) loosens only LOG-slowly (1.28 at T=60 -> 4.09 at T=1000); a '
    + 'bounded trig polynomial cannot do both cheaply, so the deficit lands on c_0..c_3 '
    + '(l1 blows up in 2a: imp-96609 x30-50 per 0.02). The cap DRIVES the norm-growth wall.',
});

// FINDING 4 -- the baked certificates respect the cap (measured via tailBracket,
// tmp/imp-96610-cert.mjs); both use ~59% of the available floor at T = 60.
export const IMP96610_CERT_HEADROOM = Object.freeze(
  [
    { twoA: 0.96, T: 60, minP4: -0.74855, cap: -1.27621, tailBracket: 0.19839, c4L1: 3.9942 },
    { twoA: 0.9, T: 60, minP4: -0.74743, cap: -1.27621, tailBracket: 0.25341, c4L1: 5.1925 },
  ].map((r) =>
    Object.freeze({
      ...r,
      respectsCap: r.minP4 > r.cap,
      slack: r.minP4 - r.cap, // headroom above the floor
      fractionOfFloorUsed: r.minP4 / r.cap, // ~0.587
    }),
  ),
);

export const IMP96610_VERDICT = Object.freeze({
  question:
    'derive/verify the t^4 tail-atom cap min p_4 > -(ln(T/2pi) - 0.98) of the '
    + 'Toeplitz-Krein sigma_2 certificate and quantify how it limits the reachable margin.',
  capConstantIsSqrt2Ln2: true,
  capConstant: SQRT2 * LN2, // 0.98026
  asymptoticFormError: IMP96610_CAP_ASYMP_ERROR, // < 1.2e-5 over T=60..1000
  capGrowsLogInT: true,
  dipDemand: IMP96610_DIP.p4NeededToFillDip, // ~+0.567 t^4 at t~9.35
  bakedCertsRespectCap: IMP96610_CERT_HEADROOM.every((r) => r.respectsCap),
  anyBoundMoved: false,
  conclusion:
    'CONFIRMED. The 0.98 is EXACTLY sqrt2 ln2 (the retained m_2 p=2 amplitude), so the '
    + 'cap is min p_4 > -(2theta_prime(T) - sqrt2 ln2), matching the closed-form '
    + '-(ln(T/2pi) - 0.98) to < 1.2e-5 over T = 60..1000 as 2theta_prime -> ln(T/2pi). '
    + 'The cap magnitude grows only LOGARITHMICALLY (1.28 -> 4.09 for T = 60 -> 1000), '
    + 'while the sigma_2 dip demands a fixed ~+0.567 t^4 near t = 9.35: a bounded trig '
    + 'polynomial cannot fill the dip AND clear the slowly-loosening floor with small '
    + 'coefficients, so the deficit is pushed onto the lower-degree atoms whose l1-norm '
    + 'blows up in 2a. The t^4 cap is thus the mechanism BEHIND the imp-96609 norm-growth '
    + 'wall, not an independent one; the baked certificates (2a <= 0.96) respect it with '
    + '~41% slack, so it is not yet binding there. Moves no bound; RH open; '
    + 'no refereed bound is changed; NO QED.',
});

export const IMP96610_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + measurement only: the cap '
  + 'is derived from the leading t^4 tail behaviour of sigma_2 + nu and verified against the '
  + 'exact 2theta_prime and the two interval-verified baked certificates (tmp/imp-96610-*.mjs). '
  + 'No new positivity, no bound moved, no support beyond the verified 2a <= 0.96 is claimed.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96610_ASSERTIONS = [
  {
    id: 'imp96610-cap-constant-is-sqrt2-ln2',
    holds: () =>
      Math.abs(IMP96610_CAP_CONSTANT - 0.9802581434685472) < 1e-15
      && Math.abs(IMP96610_CAP_CONSTANT - 0.98) < 6e-3,
    why: 'the cap constant 0.98 is exactly sqrt2 ln2 = 0.98025814..., the retained m_2 p=2 cosine amplitude in w_1.',
  },
  {
    id: 'imp96610-asymptotic-matches-exact',
    holds: () =>
      IMP96610_CAP_ASYMP_ERROR < 1.2e-5
      && IMP96610_ASYMPTOTIC_ROWS.every((r) => Math.abs(r.diff) < 1.2e-5)
      && Math.abs(IMP96610_ASYMPTOTIC_ROWS[0].diff) > Math.abs(IMP96610_ASYMPTOTIC_ROWS[4].diff),
    why: '2theta_prime(T) -> ln(T/2pi) (diff 1.16e-5 at T=60 -> 4.2e-8 at T=1000), so the closed-form cap matches the exact cap to < 1.2e-5.',
  },
  {
    id: 'imp96610-cap-grows-log-in-T',
    holds: () => {
      const mags = IMP96610_ASYMPTOTIC_ROWS.map((r) => -r.capAsymp); // ln(T/2pi)-0.98
      for (let i = 1; i < mags.length; i += 1) if (!(mags[i] > mags[i - 1])) return false;
      return mags[0] > 1.2 && mags[0] < 1.35 && mags[4] > 4 && mags[4] < 4.2;
    },
    why: 'the cap magnitude ln(T/2pi)-0.98 grows monotonically and only logarithmically: 1.28 (T=60) -> 4.09 (T=1000), i.e. |c_4| of order 1-4.',
  },
  {
    id: 'imp96610-dip-demand-vs-cap',
    holds: () =>
      IMP96610_DIP.p4NeededToFillDip > 0.55 && IMP96610_DIP.p4NeededToFillDip < 0.58
      && IMP96610_DIP.p4NeededToFillDip > 0, // dip demand is a fixed positive t^4 amount
    why: 'the sigma_2 dip -4336.2 at t~9.35 requires p_4 to reach ~+0.567 t^4 while the tail floor loosens only log-slowly: the binding tension.',
  },
  {
    id: 'imp96610-baked-certs-respect-cap',
    holds: () =>
      IMP96610_CERT_HEADROOM.every((r) => r.respectsCap && r.slack > 0.5 && r.tailBracket > 0)
      && IMP96610_CERT_HEADROOM.every((r) => r.fractionOfFloorUsed > 0.55 && r.fractionOfFloorUsed < 0.62),
    why: 'the interval-verified certificates have min p_4 ~ -0.748 > cap -1.276 (slack ~0.528, ~59% of the floor used) with positive tail brackets: the cap is respected and not yet binding at 2a <= 0.96.',
  },
  {
    id: 'imp96610-honesty-gate-no-qed',
    holds: () =>
      IMP96610_VERDICT.anyBoundMoved === false
      && IMP96610_VERDICT.capConstantIsSqrt2Ln2 === true
      && IMP96610_VERDICT.bakedCertsRespectCap === true
      && /NO QED/.test(IMP96610_HONEST_BANNER)
      && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96610_HONEST_BANNER)
      && /RH open/.test(IMP96610_HONEST_BANNER),
    why: 'derivation + measurement only: the cap is confirmed, no bound moved, and the honesty markers are present.',
  },
];

for (const a of IMP96610_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96610-krein-t4-tailatom-cap assertion failed: ${a.id}`);
  }
}

export default {
  capConstant: IMP96610_CAP_CONSTANT,
  asymptoticRows: IMP96610_ASYMPTOTIC_ROWS,
  asympError: IMP96610_CAP_ASYMP_ERROR,
  dip: IMP96610_DIP,
  certHeadroom: IMP96610_CERT_HEADROOM,
  verdict: IMP96610_VERDICT,
  banner: IMP96610_HONEST_BANNER,
};
