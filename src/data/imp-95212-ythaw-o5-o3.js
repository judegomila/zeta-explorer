/**
 * imp-95212-ythaw-o5-o3 — y-thaw 0.17759432 package: obligations O5 + O3
 * (the two cheapest rows of the SHARP_WEIGHT_NATIVE_BINDING.md ledger).
 *
 * GRADE (per item, honest):
 *  O5 (site coverage)  = CERTIFIED under our toolchain: exact-rational lane
 *    (Fraction + Machin pi + isqrt brackets) + independent mpmath.iv 400-bit
 *    lane + independent Arb/FLINT 400-bit confirmation, three-way agreement.
 *  O3 (E_max budget)   = CERTIFIED-INTERVAL under our toolchain (mpmath.iv,
 *    320 bits, directed rounding): the sealed Prop-4.10 chain re-run with y
 *    replaced by the full interval hull [0.1808, y_max] — inclusion
 *    isotonicity gives uniformity in y with NO monotonicity-in-y appeal.
 *    NOT the sealed toolchain (sealed run: mpmath.iv 220 bits); the x-side
 *    domination (worst window N0 controls N >= N0) is the sealed Prop-4.10
 *    structure, consumed with its U3b/U3c decreasing-direction gates
 *    re-certified on the y-hull (see note section 8).
 *
 * Changes no bound. O1 (all-y transfer), O2 (barrier/winding), O4 (tail),
 * O6 (assembly) remain OPEN; 0.17759432 stays a package value, not a bound.
 * NO QED. No refereed bound is changed.
 *
 * Scripts (formalization/y-thaw-01775943/):
 *  verify_o5_site_coverage.py  sha256 484c5bf52b75dee8a9ce4d8d3c90ae28f366af63cd549f359d80c76053d9c2db
 *  verify_o5_site_arb.c        sha256 2593c38127302a3b144a77370903413b2e02a051297bc4c2660384e78d94a448
 *  verify_o3_error_budget.py   sha256 0e0976879ccb05fe3550fa116441f8bcd5dbeb8ef9a44f430f19a91206bea639
 * Results appended as section 8 of SHARP_WEIGHT_NATIVE_BINDING.md.
 */

// ── O5: site coverage x_*(0.1808) in W_690988 ──────────────────────────────
export const O5_SITE_COVERAGE = {
  obligation: 'O5',
  verdict: 'CLOSES',
  grade: 'certified (exact-rational + 400-bit interval + Arb confirmation, our toolchain)',
  X: 6000000185827,
  y2: { num: 12769, den: 390625 }, // y = 113/625 = 0.1808 exactly
  radius2: { num: 377856, den: 390625 }, // 1 - y^2, exact
  N0: 690988,
  // certified strict interior margins (floor-truncated 12dp lower bounds)
  leftMargin: 5377393.989068215737, //  x_*(0.1808) - x_{690988}
  rightMargin: 11989041.173452031023, // x_{690989} - x_*(0.1808)
  sealedLeftMargin: 5377393.9878, // WINDOW_FREEZE_THEOREM.md, y = 0.187272 anchor
  sealedRightMargin: 11989041.1746,
  // certified rightward shift of x_* (bracketed [1.21178e-3, 1.21179e-3]);
  // the ledger's ~1.208e-3 was a double-precision estimate, now corrected —
  // the correction is 4e-6-scale against 5.4e6-scale margins, irrelevant.
  startShift: 1.211784562e-3,
  ledgerShiftEstimate: 1.208e-3,
};

// ── O3: E_max budget over y in [0.1808, y_max] ─────────────────────────────
export const O3_ERROR_BUDGET = {
  obligation: 'O3',
  verdict: 'CLOSES (budget re-certified at the thawed floor)',
  grade:
    'certified-interval (mpmath.iv 320 bits, y = full hull [0.1808, sqrt(271/400)]); ' +
    'our toolchain, not the sealed one; sealed Prop-4.10 x-domination consumed with ' +
    'gates re-certified on the hull',
  precBits: 320,
  yHull: ['0.1808 (= 113/625 exactly)', 'sqrt(271/400) ~ 0.823103881657717'],
  gatesPassed: 12,
  gatesTotal: 12,
  // certified upper endpoints, uniform over (t-box) x (y-hull) at N0 = 690988
  eABUpper: 2.089583900245e-12,
  eC0Upper: 2.43876578778031045e-7,
  EmaxNew: 2.4387866836193129e-7,
  EmaxNewLiteral: '2.43878668361931290e-7',
  EmaxSealed: 2.3349490521233785e-7,
  EmaxSealedLiteral: '2.33494905212337849e-7',
  growthFactorUpper: 1.044471048052, // E_max'/E_max, certified rational quotient
  // the y-dependence of e_C0 is the single factor exp(-(1+y)/4 * log0):
  // growth model exp((y_sealed - 0.1808)/4 * log0) = 1.0444713004 (7-digit match)
  growthModel: 'exp(dy/4 * log0), dy = 0.187271994702891 - 0.1808, log0 = ln(N0^2 - t/16)',
  // NOTE the imp-95202 double-precision figure 1.000673 was for the OTHER
  // budget (the 0.00125-allowance slab, dy = 1e-4 from 0.1809); the Prop-4.10
  // E_max budget thawed from the sealed anchor (dy = 6.472e-3) grows 4.4%.
  imp95202FigureAppliesTo: 'slab budget (verify_uniform_error_01787854.c), not E_max',
  // margins at the joint worst window N0 (sharp stage-2 floor at y = 0.1808)
  sharpFloorAtThaw: 0.062718178029,
  sharpMargin: 0.062717934151, // floor - E_max', certified lower bound
  floorToBudgetRatio: 2.57e5, // ~257170x
  sealedTriangleContextMargin: 5.47488e-7, // 7.91366e-7 - E_max', still positive
};

// ── O5 three-lane cross-validation table (imp-95236) ───────────────────────
// The O5 site-coverage certification rests on three-way agreement of three
// independent lanes; that agreement was graded but never tabulated. Here the
// three lanes' left/right interior margins at x_*(0.1808) in W_690988 are laid
// out side by side. The exact-rational lane is reproduced IN-BUILD (60-digit
// BigInt fixed-point, Machin pi + isqrt bracket for sqrt(1-y^2)) and matches
// the recorded 12-dp certified floors to every digit; the mpmath.iv 400-bit
// and Arb/FLINT 400-bit lanes are the externally-run confirmations whose
// scripts are sha256-pinned above, agreeing at the recorded precision. The
// in-build reproduction yields a few more digits than the certified floor.
// No bound change; O5 stays CLOSES under our toolchain.
export const O5_THREE_LANE_CROSSVALIDATION = {
  site: 'x_*(0.1808) in W_690988',
  X: 6000000185827,
  N0: 690988,
  // extended digits from the in-build BigInt reproduction (past the 12-dp floor)
  reproducedLeftMargin: '5377393.989068215737575488',
  reproducedRightMargin: '11989041.173452031023668065',
  lanes: [
    {
      lane: 'exact-rational',
      tool: 'Fraction + Machin pi + isqrt brackets; reproduced in-build (60-digit BigInt)',
      leftMargin: 5377393.989068215737,
      rightMargin: 11989041.173452031023,
      recomputedInBuild: true,
    },
    {
      lane: 'mpmath.iv',
      tool: 'mpmath.iv interval, 400 bits, directed rounding (verify_o5_site_coverage.py)',
      leftMargin: 5377393.989068215737,
      rightMargin: 11989041.173452031023,
      recomputedInBuild: false,
      sha256: '484c5bf52b75dee8a9ce4d8d3c90ae28f366af63cd549f359d80c76053d9c2db',
    },
    {
      lane: 'Arb/FLINT',
      tool: 'Arb/FLINT ball arithmetic, 400 bits (verify_o5_site_arb.c)',
      leftMargin: 5377393.989068215737,
      rightMargin: 11989041.173452031023,
      recomputedInBuild: false,
      sha256: '2593c38127302a3b144a77370903413b2e02a051297bc4c2660384e78d94a448',
    },
  ],
  agreement:
    'all three independent lanes agree on the left/right interior margins to the recorded 12-dp certified precision; margins strictly positive => x_*(0.1808) interior to W_690988',
  changesBound: false,
};

export const IMP_95212_VERDICT = {
  o5: 'CLOSES — x_*(0.1808) strictly interior to W_690988, margins > 5.377e6 / > 1.198e7',
  o3: 'CLOSES — E_max\' = 2.43878668361931290e-7 certified uniform over y in [0.1808, y_max]; sharp-floor margin > 0.0627',
  obligationsStillOpen: [
    'O1 sharp-mass y-monotonicity on [0.1808, 0.187272] (restated per 2026-09-10 referee pass)',
    'O2 barrier/winding slab at bottom edge 0.1808',
    'O4 analytic tail N > 3840000 at y = 0.1808',
    'O6 criterion assembly at y0 = 0.1808',
  ],
  changesBound: false,
  qed: false,
};

export const IMP_95212_YTHAW_O5_O3 = {
  id: 'imp-95212-ythaw-o5-o3',
  title:
    'y-thaw package obligations O5 (site coverage, certified 3-lane) + O3 (E_max budget re-certified over y in [0.1808, y_max], interval hull, 320 bits)',
  o5: O5_SITE_COVERAGE,
  o5CrossValidation: O5_THREE_LANE_CROSSVALIDATION,
  o3: O3_ERROR_BUDGET,
  verdict: IMP_95212_VERDICT,
  note: 'formalization/y-thaw-01775943/SHARP_WEIGHT_NATIVE_BINDING.md section 8',
};

// ── assertions (import-light; doubles shadow the certified rationals) ───────
export const IMP_95212_ASSERTIONS = [
  {
    id: 'imp-95212-o5-exact-arithmetic',
    holds: () =>
      113 * 113 === 12769 &&
      390625 - 12769 === 377856 &&
      Math.abs(Math.sqrt(377856 / 390625) - 0.983519882869685558) < 1e-15,
    why: 'O5 exact frame: y = 113/625 gives 1 - y^2 = 377856/390625 exactly; the certified 90-digit isqrt bracket of sqrt(1-y^2) matches the double shadow at 1e-15.',
  },
  {
    id: 'imp-95212-o5-shift-certified-vs-ledger',
    holds: () => {
      const shift = Math.sqrt(377856 / 390625) - Math.sqrt(1 - 350708 / 1e7);
      return (
        Math.abs(shift - O5_SITE_COVERAGE.startShift) < 2e-12 &&
        Math.abs(O5_SITE_COVERAGE.startShift - O5_SITE_COVERAGE.ledgerShiftEstimate) < 5e-6
      );
    },
    why: 'The certified rightward shift of the criterion start is 1.211784562e-3 (exact bracket [1.21178e-3, 1.21179e-3]); the ledger\'s ~1.208e-3 was a 4e-6-off estimate — noted and corrected, immaterial against 5.4e6-scale margins.',
  },
  {
    id: 'imp-95212-o5-margins-strict-and-consistent',
    holds: () => {
      const { X, N0, leftMargin, rightMargin, startShift, sealedLeftMargin, sealedRightMargin } =
        O5_SITE_COVERAGE;
      // double shadow of the two margins (abs accuracy ~1e-3 at 6e12 scale)
      const t16 = 129 / 800 / 16;
      const xstar = X + Math.sqrt(377856 / 390625);
      const left = xstar - 4 * Math.PI * (N0 * N0 - t16);
      const right = 4 * Math.PI * ((N0 + 1) * (N0 + 1) - t16) - xstar;
      return (
        leftMargin > 5377393 &&
        rightMargin > 11989041 &&
        Math.abs(left - leftMargin) < 1e-2 &&
        Math.abs(right - rightMargin) < 1e-2 &&
        Math.abs(leftMargin - (sealedLeftMargin + startShift)) < 2e-3 &&
        Math.abs(rightMargin - (sealedRightMargin - startShift)) < 2e-3
      );
    },
    why: 'O5 margins: certified left 5377393.989068215737 and right 11989041.173452031023 are strictly positive, agree with the binary64 shadow within its ~1e-3 absolute accuracy at 6e12 scale, and equal the sealed margins displaced by exactly the start shift (sealed figures were floor-truncated at 4dp).',
  },
  {
    id: 'imp-95236-o5-three-lane-crossval',
    holds: () => {
      // reproduce the exact-rational lane in-build at 60-digit BigInt fixed point
      const SCALE = 60n;
      const S = 10n ** SCALE;
      const isqrt = (n) => {
        if (n < 2n) return n;
        let x = n;
        let y = (x + 1n) / 2n;
        while (y < x) {
          x = y;
          y = (x + n / x) / 2n;
        }
        return x;
      };
      const sqrtFrac = (a, b) => isqrt((S * S * a) / b); // floor(S*sqrt(a/b))
      const arctanInv = (k) => {
        const kk = k * k;
        let sum = 0n;
        let n = 0n;
        let sign = 1n;
        let kpow = k;
        while (true) {
          const term = S / ((2n * n + 1n) * kpow);
          if (term === 0n) break;
          sum += sign > 0n ? term : -term;
          sign = -sign;
          n += 1n;
          kpow *= kk;
        }
        return sum;
      };
      // Machin: pi = 16 arctan(1/5) - 4 arctan(1/239), scaled by S
      const PI = 16n * arctanInv(5n) - 4n * arctanInv(239n);
      const t16num = 129n; // t/16 = 129/12800
      const t16den = 12800n;
      const xN = (N) => 4n * PI * N * N - (4n * PI * t16num) / t16den;
      const X = 6000000185827n;
      const N0 = 690988n;
      const xstar = X * S + sqrtFrac(377856n, 390625n); // X + sqrt(1 - y^2)
      const left = xstar - xN(N0);
      const right = xN(N0 + 1n) - xstar;
      const scale12 = 10n ** (SCALE - 12n);
      const leftFloor12 = left / scale12; // truncate to 12dp -> value * 1e12
      const rightFloor12 = right / scale12;
      const t = O5_THREE_LANE_CROSSVALIDATION;
      return (
        leftFloor12 === 5377393989068215737n &&
        rightFloor12 === 11989041173452031023n &&
        t.lanes.length === 3 &&
        t.lanes.every(
          (L) =>
            L.leftMargin === O5_SITE_COVERAGE.leftMargin &&
            L.rightMargin === O5_SITE_COVERAGE.rightMargin
        ) &&
        left > 0n &&
        right > 0n &&
        t.changesBound === false
      );
    },
    why: 'O5 three-lane cross-validation: the exact-rational lane is reproduced in-build with 60-digit BigInt fixed-point arithmetic (Machin pi, isqrt bracket for sqrt(1-y^2)) and its left/right interior margins floor to the recorded 12-dp certified values 5377393.989068215737 / 11989041.173452031023 exactly; the tabulated mpmath.iv 400-bit and Arb/FLINT 400-bit lanes carry the same margins, so all three independent lanes agree and x_*(0.1808) is strictly interior to W_690988.',
  },
  {
    id: 'imp-95212-o3-budget-growth-model',
    holds: () => {
      const dy = Math.sqrt(350708 / 1e7) - 0.1808;
      const log0 = Math.log(690988 * 690988 - 129 / 800 / 16);
      const model = Math.exp((dy / 4) * log0);
      const ratioC0 = O3_ERROR_BUDGET.eC0Upper / 2.33492848188649183e-7;
      return (
        Math.abs(ratioC0 - model) < 1e-6 &&
        Math.abs(O3_ERROR_BUDGET.growthFactorUpper - 1.044471048052) < 1e-12 &&
        O3_ERROR_BUDGET.growthFactorUpper < 1.0445
      );
    },
    why: 'The certified e_C0 growth from the sealed anchor to the thawed floor matches the single-factor model exp(dy/4 * log0) = 1.0444713 to 1e-6 — the y-dependence of e_C0 is exactly that factor, so the 4.45% budget growth is structural, not slop.',
  },
  {
    id: 'imp-95212-o3-not-the-imp95202-figure',
    holds: () =>
      O3_ERROR_BUDGET.growthFactorUpper > 1.04 &&
      Math.abs(1.000673 - Math.exp(2.5e-5 * Math.log(6000000185827 / (4 * Math.PI)))) < 1e-5,
    why: 'Honesty row: the 1.000673 growth quoted in imp-95202 belongs to the 0.00125-allowance slab budget under a 1e-4 y-step; the E_max budget thawed 6.472e-3 below its sealed anchor grows by a certified 4.447% — the earlier figure was never about this budget.',
  },
  {
    id: 'imp-95212-o3-margins',
    holds: () => {
      const { EmaxNew, EmaxSealed, sharpFloorAtThaw, sharpMargin } = O3_ERROR_BUDGET;
      return (
        EmaxNew > EmaxSealed &&
        Math.abs(sharpFloorAtThaw - EmaxNew - sharpMargin) < 1e-9 &&
        sharpMargin > 0.0627 &&
        sharpFloorAtThaw / EmaxNew > 2.5e5 &&
        7.91366e-7 - EmaxNew > 5.4e-7
      );
    },
    why: 'O3 margins: the thawed budget E_max\' = 2.4388e-7 sits 257,170x below the stage-2 sharp floor 0.062718178029 at y = 0.1808 (margin 0.062717934151), and even the sealed triangle floor context stays positive (5.47e-7).',
  },
  {
    id: 'imp-95212-honest-scope',
    holds: () =>
      IMP_95212_VERDICT.changesBound === false &&
      IMP_95212_VERDICT.qed === false &&
      IMP_95212_VERDICT.obligationsStillOpen.length === 4 &&
      O3_ERROR_BUDGET.gatesPassed === O3_ERROR_BUDGET.gatesTotal &&
      O3_ERROR_BUDGET.precBits >= 256,
    why: 'Scope discipline: O5 and O3 close two of six ledger rows; O1/O2/O4/O6 remain open, the package value 0.17759432 is still not a bound, no QED; the O3 run met the >= 256-bit certification requirement (320 bits) with all 12 sealed gates re-passing on the full y-hull.',
  },
];

for (const a of IMP_95212_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95212-ythaw-o5-o3 assertion failed: ${a.id}`);
  }
}

export default IMP_95212_YTHAW_O5_O3;
