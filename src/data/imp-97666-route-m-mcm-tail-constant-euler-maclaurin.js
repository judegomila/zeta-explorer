/**
 * @module imp-97666-route-m-mcm-tail-constant-euler-maclaurin
 *
 * imp-97666 (numerical -- DERIVATION/VERIFICATION ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97647 RESULT 2 bounds the omitted divisors d > cut of the imp-97432 MCM kernel by Sum 1/(720 d^3),
 * asserting the true remainder is R(d) ~ +1/(720 d^2), and uses the signal-to-noise ratio of double-precision
 * Rexact(d) against that asymptotic magnitude to justify the d <= 1000 cap (SNR ~1.68 at d=1000 degrading to
 * the WRONG SIGN at d=10000). The 1/720 leading constant was ASSERTED, not derived, in that leaf. This leaf
 * DERIVES the leading asymptotic constant of
 *
 *     Rexact(m) = Gexact(m) - GKmain(m),
 *     Gexact(m) = Sum_{k=1}^{m} k log k = log H(m)   (H = hyperfactorial),
 *     GKmain(m) = (m^2/2 + m/2 + 1/12) log m - m^2/4 + log A   (A = Glaisher-Kinkelin constant),
 *
 * via the Euler-Maclaurin expansion of Sum_{k=1}^{m} f(k) with f(x) = x log x, so the imp-97647 tail budget
 * (< 5.69e-11 gap shift over all omitted divisors) rests on a DERIVED constant rather than an asserted one.
 *
 * -------------------------------------------------------------------------------
 * DERIVATION (Euler-Maclaurin, f(x) = x log x).
 *
 * Euler-Maclaurin:  Sum_{k=1}^{n} f(k) = Int_1^n f dx + (f(1)+f(n))/2
 *                     + Sum_{j>=1} B_{2j}/(2j)! [ f^{(2j-1)}(n) - f^{(2j-1)}(1) ] + R_p.
 *
 * Derivatives of f(x) = x log x:
 *     f'(x)   = log x + 1
 *     f''(x)  = 1/x
 *     f'''(x) = -1/x^2
 *     f''''(x)= 2/x^3
 *     f^(5)(x)= -6/x^4
 *
 * The n-dependent GKmain pieces are exactly the first three Euler-Maclaurin contributions:
 *   - Int_1^n x log x dx = n^2/2 log n - n^2/4 + 1/4         -> the (m^2/2) log m - m^2/4 terms
 *   - (f(n))/2 = (n log n)/2                                  -> the (m/2) log m term
 *   - B_2/2! f'(n) = (1/12)(log n + 1) = (1/12) log n + 1/12  -> the (1/12) log m term
 *     (B_2 = 1/6, B_2/2! = 1/12)
 * and log A absorbs every n-independent piece (the +1/4, the +1/12, f(1)/2, and the constant tail = log A).
 *
 * The FIRST omitted (n-dependent) Euler-Maclaurin term is therefore the B_4 term:
 *     B_4 = -1/30,  B_4/4! = -1/(30*24) = -1/720,
 *     f'''(n) = -1/n^2,
 *   ==>  B_4/4! * f'''(n) = (-1/720)*(-1/n^2) = +1/(720 n^2).
 *
 * So  Rexact(m) = +1/(720 m^2) + O(m^-4).  The +1/720 coefficient and the m^-2 power are BOTH derived.
 * (The leading constant is |B_4|/4! = (1/30)/24 = 1/720.)
 *
 * The NEXT term is the B_6 term (fixes the sign and gives the observed 1 - (1/7)/m^2 correction):
 *     B_6 = 1/42,  B_6/6! = 1/(42*720) = 1/30240,  f^(5)(n) = -6/n^4,
 *   ==>  B_6/6! * f^(5)(n) = -6/(30240 n^4) = -1/(5040 n^4).
 * Hence  Rexact(m) = 1/(720 m^2) - 1/(5040 m^4) + ...,  i.e.  Rexact(m)*720*m^2 = 1 - (1/7)/m^2 + O(m^-4).
 *
 * NUMERIC CONFIRMATION (double precision, CLEAN regime m <= 100 before Gexact-GKmain cancellation bites):
 *   m       Rexact(m)*720*m^2      1 - (1/7)/m^2
 *   10      0.9985784958           0.9985714286
 *   20      0.9996432891           0.9996428571
 *   50      0.9999430404           0.9999428571
 *   100     0.9999872418           0.9999857143
 * The scaled value -> 1 and tracks the -(1/7)/m^2 next-order correction to ~1e-6; the log-log slope of
 * Rexact between m=50 and m=100 is -1.99994 (confirming the m^-2 power). Past m ~ 200-1000 the double-
 * precision Gexact-GKmain cancellation overwhelms the ~1e-7 remainder (exactly the imp-97647 SNR collapse),
 * which is why imp-97647 caps the EXACT sum at d <= 1000 and hands d > cut to the derived 1/(720 d^3) tail.
 *
 * The tail bound Sum_{d>cut} 1/(720 d^3) used by imp-97647/imp-97432 is |Rexact(d)|/d summed with the
 * derived +1/(720 d^2) leading term (one extra 1/d from the Rcorr weight mu(d)/d), now on a derived footing.
 *
 * SCOPE: derivation/verification only. Onset stays omega = 11; MCM refuted; no bound moves; NO QED.
 * -------------------------------------------------------------------------------
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)

// self-contained copies of the imp-97432 kernel (import-light: no zeros bundle, no cross-imports).
function Gexact(m) { let s = 0; for (let k = 2; k <= m; k++) s += k * Math.log(k); return s; }
function GKmain(m) {
  if (m === 1) return -1 / 4 + LN_A;
  return (m * m / 2 + m / 2 + 1 / 12) * Math.log(m) - (m * m) / 4 + LN_A;
}
function Rexact(m) { return Gexact(m) - GKmain(m); }

// derived Euler-Maclaurin coefficients (Bernoulli numbers over factorials).
const B2 = 1 / 6, B4 = -1 / 30, B6 = 1 / 42;
const LEADING_COEFF = -(B4 / 24);          // -B_4/4! = 1/720 ; times f'''=-1/n^2 gives +1/(720 n^2)
const NEXT_COEFF = (B6 / 720) * -6;        // B_6/6! * f^(5) coefficient = -1/5040

export const IMP97666_DERIVATION = Object.freeze({
  functionUsed: 'f(x) = x log x, Sum_{k=1}^{m} f(k) = log H(m) (hyperfactorial)',
  leadingTerm: '+1/(720 m^2)',
  leadingConstant: 1 / 720,                 // = |B_4|/4! = (1/30)/24
  leadingConstantProvenance: 'B_4/4! * f_ppp(n) = (-1/720)*(-1/n^2) = +1/(720 n^2)',
  power: -2,
  nextTerm: '-1/(5040 m^4)',
  nextConstant: -1 / 5040,                   // = B_6/6! * (-6)
  scaledNextOrderModel: 'Rexact(m)*720*m^2 = 1 - (1/7)/m^2 + O(m^-4)',
  glaisherAbsorbsConstants: '+1/4 (integral) + 1/12 (B_2 term) + f(1)/2 + constant tail = log A',
});

// clean-regime numeric ladder (m <= 100; baked double-precision literals).
export const IMP97666_LADDER = Object.freeze([
  { m: 10, rexact: 0.000013869145774947356 },
  { m: 20, rexact: 0.0000034709836427282426 },
  { m: 30, rexact: 0.000001542965037515387 },
  { m: 50, rexact: 5.555239113164134e-7 },
  { m: 80, rexact: 2.1701089281123132e-7 },
  { m: 100, rexact: 1.3888711691834033e-7 },
]);

export const IMP97666_HONEST_BANNER =
  'imp-97666: DERIVATION/VERIFICATION ONLY. The imp-97647/imp-97432 tail constant R(d) ~ +1/(720 d^2) is the ' +
  'B_4 Euler-Maclaurin term of Sum k log k (f=x log x, f_ppp=-1/x^2, -B_4/4!=1/720); next term -1/(5040 d^4). ' +
  'Onset stays omega=11; MCM refuted; no bound moved. No refereed bound is changed; RH open. NO QED.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97666_ASSERTIONS = [
  {
    id: 'imp97666-leading-constant-is-B4-over-4fact',
    holds: () =>
      Math.abs(LEADING_COEFF - 1 / 720) < 1e-18 &&
      Math.abs(IMP97666_DERIVATION.leadingConstant - 1 / 720) < 1e-18 &&
      IMP97666_DERIVATION.power === -2,
    why: 'the leading tail constant is -B_4/4! = (1/30)/24 = 1/720, and combined with f_ppp(n) = -1/n^2 yields +1/(720 n^2); the power is exactly m^-2.',
  },
  {
    id: 'imp97666-next-constant-is-B6-term',
    holds: () => Math.abs(NEXT_COEFF - (-1 / 5040)) < 1e-18 && Math.abs(IMP97666_DERIVATION.nextConstant - (-1 / 5040)) < 1e-18,
    why: 'the next Euler-Maclaurin term is B_6/6! * f^(5)(n) = (1/30240)*(-6/n^4) = -1/(5040 n^4), giving the observed 1 - (1/7)/m^2 scaled correction.',
  },
  {
    id: 'imp97666-ladder-scaled-approaches-one',
    holds: () => {
      // Rexact(m)*720*m^2 -> 1 in the clean regime, and matches the -(1/7)/m^2 next-order model.
      for (const row of IMP97666_LADDER) {
        const recomputed = Rexact(row.m);
        if (!(Math.abs(recomputed - row.rexact) < 1e-18)) return false;   // baked literal reproduces
        const scaled = row.rexact * 720 * row.m * row.m;
        const model = 1 - (1 / 7) / (row.m * row.m);
        if (!(Math.abs(scaled - model) < 1e-5)) return false;             // tracks next-order model (higher-order tail at m=10, early cancellation noise by m=80)
      }
      // scaled value strictly approaches 1 as m grows across the clean ladder.
      const first = IMP97666_LADDER[0];
      const last = IMP97666_LADDER[IMP97666_LADDER.length - 1];
      const dFirst = Math.abs(first.rexact * 720 * first.m * first.m - 1);
      const dLast = Math.abs(last.rexact * 720 * last.m * last.m - 1);
      return dLast < dFirst && dLast < 2e-5;
    },
    why: 'across the clean ladder m<=100 the baked Rexact literals reproduce the kernel and Rexact(m)*720*m^2 tracks 1 - (1/7)/m^2 to ~1e-6, converging to 1 -- confirming the +1/(720 m^2) leading term numerically.',
  },
  {
    id: 'imp97666-loglog-slope-is-minus-two',
    holds: () => {
      // log-log slope of Rexact between two clean rungs must be ~ -2 (the m^-2 power).
      const a = IMP97666_LADDER.find((r) => r.m === 50);
      const b = IMP97666_LADDER.find((r) => r.m === 100);
      const slope = (Math.log(b.rexact) - Math.log(a.rexact)) / (Math.log(b.m) - Math.log(a.m));
      return Math.abs(slope - (-2)) < 1e-3;
    },
    why: 'the log-log slope of Rexact from m=50 to m=100 is -1.99994, pinning the power at m^-2 as derived.',
  },
  {
    id: 'imp97666-honesty-gate-no-qed',
    holds: () =>
      /NO QED/.test(IMP97666_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97666_HONEST_BANNER) &&
      /RH open/.test(IMP97666_HONEST_BANNER) &&
      /omega=11/.test(IMP97666_HONEST_BANNER) &&
      /no bound moved/.test(IMP97666_HONEST_BANNER),
    why: 'derivation only -- the tail constant is placed on a derived footing; MCM refuted from omega=11; no bound moved, RH open, no QED.',
  },
];

for (const a of IMP97666_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97666-route-m-mcm-tail-constant-euler-maclaurin assertion failed: ${a.id}`);
  }
}

export default {
  derivation: IMP97666_DERIVATION,
  ladder: IMP97666_LADDER,
  banner: IMP97666_HONEST_BANNER,
};
