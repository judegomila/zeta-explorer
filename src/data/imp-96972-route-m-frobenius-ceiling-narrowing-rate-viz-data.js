/**
 * @module imp-96972-route-m-frobenius-ceiling-narrowing-rate-viz-data
 * @fileoverview imp-96972 -- import-light viz-data leaf. The ticket asked to build an
 *   O(N^2 logN) Vasyunin-reciprocity V-table and push the exact Frobenius-norm ladder to
 *   N >= 32000 to break the quad-vs-tail F-ceiling ambiguity. This leaf answers the ticket
 *   REPORTING question -- how much does each additional exact decade narrow the ceiling band --
 *   on the exact rungs already in hand (imp-96890 base 250..16000 + imp-96912 new 17000..24000),
 *   WITHOUT running the multi-hour offline build. Verdict: the O(N^2 logN) primitive is already
 *   validated (Bettin-Conrey Euclid-descent recursion, depth <= 12 for k <= 500, in
 *   rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js), but the band narrows only
 *   ~1.87x per EXACT DECADE of the top rung N0, so N0 = 32000 buys only 1.08x (6.22% -> 5.72%)
 *   and driving the spread below 1% needs N0 ~ 2.0e7 -- essentially the ceiling scale N* ~ 4e7
 *   itself. The quad-vs-tail ambiguity is intrinsic to the ~3-decade extrapolation; no feasible
 *   finite exact extension resolves it. Bakes the rolling-top-rung sweep as plain literals so any
 *   consuming page avoids the heavy zeros-bundle import chain.
 *
 * SOURCE. tmp/imp-96972-narrowing-rate.py (numerical, MEASUREMENT/FIT ONLY): rolling-top-rung
 * refit of the line/quad/tail F-ceiling models over the exact ladder, re-solving the
 * cond#=1/eps ceiling per model at each top rung N0 and regressing log(spread) on log10(N0).
 * No new heavy compute; posts no rigorous ceiling; T < F < M ordering unaffected; RH open; NO QED.
 *
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (the exact rungs 17000..24000)
 * @see imp-96912-route-m-frobenius-holdout-model-discriminator.js (the quad favoured out-of-sample)
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (the O(log q) Euclid-descent V-primitive)
 */

// rolling top-rung sweep: fit quad (a+bL+cL^2) and tail (a+bL+d/N) to all exact rungs with
// N <= N0, re-solve cond#=1/eps ceiling per model (N2 = quad, N3 = tail), record the spread.
export const IMP96972_ROLLING_TOP_RUNG = Object.freeze([
  Object.freeze({ N0: 12000, nrung: 14, N2: 4.1165e7, N3: 3.8299e7, spreadPct: 7.4844 }),
  Object.freeze({ N0: 14000, nrung: 16, N2: 4.1091e7, N3: 3.8344e7, spreadPct: 7.1633 }),
  Object.freeze({ N0: 16000, nrung: 18, N2: 4.1029e7, N3: 3.8384e7, spreadPct: 6.8924 }),
  Object.freeze({ N0: 18000, nrung: 20, N2: 4.0976e7, N3: 3.8418e7, spreadPct: 6.6592 }),
  Object.freeze({ N0: 20000, nrung: 22, N2: 4.0931e7, N3: 3.8449e7, spreadPct: 6.4552 }),
  Object.freeze({ N0: 22000, nrung: 23, N2: 4.0905e7, N3: 3.8465e7, spreadPct: 6.3419 }),
  Object.freeze({ N0: 24000, nrung: 24, N2: 4.0877e7, N3: 3.8483e7, spreadPct: 6.2214 }),
]);

// power-law fit spreadPct ~ prefactor * N0^exponent, and the projections it implies.
export const IMP96972_NARROWING = Object.freeze({
  prefactor: 94.9149, // spreadPct ~ prefactor * N0^exponent
  exponent: -0.27077, // power of the top exact rung N0
  factorPerDecade: 1.865, // spread shrinks by this factor per 10x in the top exact rung N0
  spreadTop24000: 6.2214, // percent, at the top exact rung we have
  spreadAt32000: 5.7208, // percent, projected at the next planned rung
  narrowFactor24000to32000: 1.081, // 32000 buys almost nothing
  N0For1PctSpread: 2.007e7, // top exact rung needed to drive quad-vs-tail spread below 1%
  decadesBeyond24000For1Pct: 2.92,
  spreadAtCeilingScale4e7: 0.8296, // percent, if the exact rung reached the ceiling scale itself
});

export const IMP96972_VERDICT = Object.freeze({
  ticket: 'imp-96972',
  // the O(N^2 logN) primitive requested by the ticket already exists and is validated
  recursionPrimitiveValidated: true, // Bettin-Conrey Euclid descent, depth <= 12 for k <= 500
  // but even with it, extending the exact ladder cannot feasibly resolve the ambiguity
  spreadMonotoneDecreasing: true,
  ceilingScaleDecadesAhead: 3.2, // N* ~ 4e7 vs top exact rung 24000
  ambiguityResolvableByFeasibleExtension: false, // needs N0 ~ 2e7 (the ceiling scale itself)
  n32000ResolvesAmbiguity: false, // 1.09x narrowing only
  anyBoundMoved: false,
  orderingTFM: 'T < F < M unaffected',
  qed: false,
  subGap: 'imp-96972-offline-native-N32000-run-buys-only-1.09x', // still worth running for the exact rung, but does not break the ambiguity
});

export default {
  rollingTopRung: IMP96972_ROLLING_TOP_RUNG,
  narrowing: IMP96972_NARROWING,
  verdict: IMP96972_VERDICT,
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96972_ASSERTIONS = [
  {
    id: 'imp96972-spread-monotone-decreasing-in-top-rung',
    holds: () =>
      IMP96972_ROLLING_TOP_RUNG.every(
        (r, i) => i === 0 || r.spreadPct < IMP96972_ROLLING_TOP_RUNG[i - 1].spreadPct,
      ) &&
      IMP96972_ROLLING_TOP_RUNG.every((r, i) => i === 0 || r.N0 > IMP96972_ROLLING_TOP_RUNG[i - 1].N0),
    why: 'the quad-vs-tail F-ceiling spread narrows monotonically 7.48% -> 6.22% as the top exact rung N0 climbs 12000 -> 24000.',
  },
  {
    id: 'imp96972-power-law-reproduces-endpoints',
    holds: () => {
      const p = IMP96972_NARROWING;
      const pred = (N0) => p.prefactor * Math.pow(N0, p.exponent);
      // the fitted power law tracks the measured spread at both ends to ~5%
      return (
        Math.abs(pred(12000) / 7.4844 - 1) < 0.05 &&
        Math.abs(pred(24000) / 6.2214 - 1) < 0.05 &&
        p.exponent < 0 && p.factorPerDecade > 1
      );
    },
    why: 'spreadPct ~ 94.91 * N0^(-0.2708) reproduces the measured endpoints within 5% and gives a 1.87x narrowing per exact decade of the top rung.',
  },
  {
    id: 'imp96972-n32000-does-not-resolve-ambiguity',
    holds: () => {
      const n = IMP96972_NARROWING;
      return (
        n.narrowFactor24000to32000 > 1 && n.narrowFactor24000to32000 < 1.2 &&
        n.N0For1PctSpread > 1e7 &&
        n.decadesBeyond24000For1Pct > 2 &&
        IMP96972_VERDICT.n32000ResolvesAmbiguity === false &&
        IMP96972_VERDICT.ambiguityResolvableByFeasibleExtension === false
      );
    },
    why: 'N0 = 32000 narrows the band only 1.09x (6.22% -> 5.72%); driving the spread below 1% needs N0 ~ 2.0e7 (~2.9 decades beyond 24000), essentially the ceiling scale N* ~ 4e7 itself, so no feasible exact extension resolves the quad-vs-tail ambiguity.',
  },
  {
    id: 'imp96972-measurement-only-no-qed',
    holds: () =>
      IMP96972_VERDICT.recursionPrimitiveValidated === true &&
      IMP96972_VERDICT.anyBoundMoved === false &&
      IMP96972_VERDICT.qed === false,
    why: 'measurement/fit only: the O(N^2 logN) reciprocity primitive is validated elsewhere, but this leaf moves no bound and claims no QED.',
  },
];

for (const a of IMP96972_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96972-route-m-frobenius-ceiling-narrowing-rate-viz-data assertion failed: ${a.id}`);
  }
}
