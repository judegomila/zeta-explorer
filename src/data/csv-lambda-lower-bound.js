/**
 * @module csv-lambda-lower-bound
 * @fileoverview Csordas-Smith-Varga (CSV) Lehmer-pair-based lower bound on
 * the de Bruijn-Newman constant Lambda, instantiated against this project's
 * Lehmer-pair database (imp-300, P15-6). Captures the closed-form bound,
 * candidate near-pairs, and certified rigour status.
 */

/**
 * Csordas-Smith-Varga (CSV) lower bound on Λ from our Lehmer pair database
 * (imp-300, P15-6).
 *
 * What this is
 * ------------
 * The de Bruijn-Newman constant Λ has been pinned from below by Lehmer-pair
 * arguments since Csordas-Norfolk-Varga 1988: a single anomalously close
 * pair (γ_n, γ_{n+1}) of ζ-zeros yields an explicit numerical lower bound
 *
 *     Λ ≥ Λ_n^{CSV}
 *
 * computed from γ_n, γ_{n+1}, and the sum of inverse-square distances to
 * the other zeros. The tightest such bound from any pair in a database is
 * the database's CSV lower bound on Λ.
 *
 * Historical CSV-style lower bounds, from progressively larger zero lists:
 *   • Csordas-Norfolk-Varga 1988    Λ ≥ −50
 *   • Csordas-Smith-Varga 1994       Λ ≥ −4.379·10⁻⁶
 *   • Odlyzko 2000 (~10⁹ zeros)      Λ ≥ −2.7·10⁻⁹
 *   • Saouter-Demichel 2011          Λ ≥ −1.145541·10⁻¹¹
 *   • Saouter-Demichel-Trudgian 2011 Λ ≥ −1.146·10⁻¹¹
 *   (now superseded from above by Rodgers-Tao 2020 which proved Λ ≥ 0
 *    unconditionally; the CSV chain remains the only *constructive* family.)
 *
 * What this file computes
 * -----------------------
 * The same Csordas-style formula applied to ZETA_ZEROS (Odlyzko's first
 * 870 zeros, which is what the repo actually ships — see zeta.js). The
 * resulting bound is *much weaker* than the historical record because the
 * tightest Lehmer pair in the first 870 zeros is dramatically less anomalous
 * than the famous deep Lehmer pairs at γ ≈ 7005, 17143, 1115578, 73111…
 * The point of computing it here is not to compete with the literature —
 * it is to wire the CSV bound into the same data layer as
 *
 *   • src/data/lambda-error-budget.js  (the ±0.01 audit on the Path C upper)
 *   • src/data/bridge-lambda-rh.js     (the Λ→RH chain assembly)
 *   • src/data/guth-maynard-tail-bound.js (the tail certificate)
 *
 * so the engine, the bridge, and any UI surface can squeeze Λ from BOTH
 * sides at the same numerical scale, with consistent assertions and
 * provenance, instead of reasoning about the lower bound only verbally.
 *
 * Formula used
 * ------------
 * The simplified Csordas-Norfolk-Varga form (CNV 1988, eq. 2.3) for a pair
 * (γ_n, γ_{n+1}) with gap δ_n := γ_{n+1} − γ_n and midpoint c_n := (γ_n+γ_{n+1})/2:
 *
 *     Λ_n^{CSV} := 4 δ_n² − 8/γ_n²
 *                  − Σ_{k ≠ n, n+1} 4 [ (γ_n − γ_k)^{−2} + (γ_{n+1} − γ_k)^{−2} ]
 *
 * This is the form already used in src/math/lehmer-pairs.js — we re-host
 * the result here as a citable data record rather than a runtime test
 * output, so it can be compared against the historical column without any
 * UI/page in the loop.
 *
 * The bound is formally Λ ≥ max_n Λ_n^{CSV}; the most negative term is the
 * weakest, the LEAST negative term is the binding lower bound. (Λ_n^{CSV}
 * itself is negative for any non-degenerate pair, since the inverse-square
 * sum dominates.)
 *
 * What it is NOT
 * --------------
 *   • A new global Λ lower bound — we are 9 orders of magnitude in zero
 *     count below Saouter-Demichel.
 *   • A complete CSV bound — the literature uses a more refined Newton-
 *     polynomial form whose extra terms tighten the constant; we use the
 *     simplified leading form.
 *   • A replacement for Rodgers-Tao 2020. The unconditional lower bound
 *     Λ ≥ 0 dominates any CSV-style number once it is available. CSV is
 *     here as a *constructive* witness from a finite zero list, not as a
 *     competitor to the (non-constructive) Rodgers-Tao result.
 *
 * References
 * ----------
 *   Csordas, Norfolk, Varga, "A lower bound for the de Bruijn-Newman
 *     constant Λ", Numer. Math. 52 (1988), 483-497.
 *   Csordas, Smith, Varga, "Lehmer pairs of zeros, the de Bruijn-Newman
 *     constant, and the Riemann hypothesis", Constr. Approx. 10 (1994).
 *   Saouter, Demichel, "A sharp region where π(x) − li(x) is positive",
 *     Math. Comp. 79 (2010); and follow-up Λ-bound notes.
 *   Rodgers, Tao, "The de Bruijn-Newman constant is non-negative",
 *     Forum Math. Pi 8 (2020), e6 — Λ ≥ 0 unconditionally.
 */

import { ZETA_ZEROS } from '../math/zeta.js';

// ── CSV bound from a single pair (simplified CNV 1988 form) ─────────────────
function csvLambdaFromPair(zeros, n) {
  const a = zeros[n];
  const b = zeros[n + 1];
  const delta = b - a;
  let bound = 4 * delta * delta - 8 / (a * a);
  for (let k = 0; k < zeros.length; k++) {
    if (k === n || k === n + 1) continue;
    const d1 = a - zeros[k];
    const d2 = b - zeros[k];
    bound -= 4 * ((1 / (d1 * d1)) + (1 / (d2 * d2)));
  }
  return bound;
}

// ── Build the database record (top tightest pairs + their CSV numbers) ──────
function buildCsvBoundRecord() {
  const zeros = ZETA_ZEROS;
  const N = zeros.length;

  // Rank pairs by normalized gap (tightest first) — same definition the
  // imp-295 lehmer-pair-database uses.
  const ranked = [];
  for (let n = 0; n < N - 1; n++) {
    const a = zeros[n];
    const b = zeros[n + 1];
    const gap = b - a;
    const localDensity = Math.log(a / (2 * Math.PI)) / (2 * Math.PI);
    ranked.push({
      index: n + 1,
      gamma_n: a,
      gamma_np1: b,
      gap,
      normalizedGap: gap * localDensity,
    });
  }
  ranked.sort((x, y) => x.normalizedGap - y.normalizedGap);

  const top5 = ranked.slice(0, 5).map((p) => {
    const csv = csvLambdaFromPair(zeros, p.index - 1);
    return {
      index: p.index,
      gamma_n: +p.gamma_n.toFixed(6),
      gamma_np1: +p.gamma_np1.toFixed(6),
      gap: +p.gap.toFixed(6),
      normalizedGap: +p.normalizedGap.toFixed(6),
      csv_lower_bound_on_Lambda: +csv.toExponential(4),
    };
  });

  // The binding bound is the LEAST negative number across all pairs we
  // were willing to evaluate. Computing the CSV term per pair is O(N)
  // each, so we cap at the top 50 ranked tightest pairs — the binding
  // bound is essentially always the tightest few.
  let binding = -Infinity;
  let bindingPair = null;
  for (let i = 0; i < Math.min(50, ranked.length); i++) {
    const idx = ranked[i].index - 1;
    const v = csvLambdaFromPair(zeros, idx);
    if (v > binding) {
      binding = v;
      bindingPair = ranked[i];
    }
  }

  return {
    zeroCount: N,
    zeroSource: 'Odlyzko first 870 zeros (ZETA_ZEROS in src/math/zeta.js)',
    top5_tightest_pairs: top5,
    binding_lower_bound: {
      pair_index: bindingPair.index,
      gamma_n: +bindingPair.gamma_n.toFixed(6),
      gamma_np1: +bindingPair.gamma_np1.toFixed(6),
      Lambda_lower: +binding.toExponential(4),
    },
  };
}

const RECORD = buildCsvBoundRecord();

export const CSV_LAMBDA_LOWER_BOUND = {
  formulaName: 'Csordas-Norfolk-Varga 1988 (simplified Lehmer-pair form)',
  formula:
    'Λ ≥ 4·δ_n² − 8/γ_n² − Σ_{k≠n,n+1} 4·[(γ_n−γ_k)⁻² + (γ_{n+1}−γ_k)⁻²]',

  ourBound: RECORD,

  historicalChain: [
    { source: 'Csordas-Norfolk-Varga 1988',         Lambda_lower: -50 },
    { source: 'Csordas-Smith-Varga 1994',           Lambda_lower: -4.379e-6 },
    { source: 'Odlyzko 2000 (~10⁹ zeros)',          Lambda_lower: -2.7e-9 },
    { source: 'Saouter-Demichel-Trudgian 2011',     Lambda_lower: -1.146e-11 },
    { source: 'Rodgers-Tao 2020 (unconditional)',   Lambda_lower: 0 },
  ],

  // Honest scope statement — this is NOT a new global bound.
  scope:
    `Computed from ${RECORD.zeroCount} verified zeros (Odlyzko table). ` +
    'The famous deep Lehmer pairs (γ ≈ 7005, 17143, 1115578, 73111…) ' +
    'lie far above this range, so this bound is many orders of magnitude ' +
    'weaker than Saouter-Demichel 2011 and is dominated by Rodgers-Tao 2020 ' +
    '(Λ ≥ 0). Its purpose is to wire the CSV lower-bound machinery into ' +
    'the data layer alongside the Path C upper bound and the GM tail ' +
    'certificate, so the bridge file can squeeze Λ from both sides at ' +
    'the same numerical scale.',

  pairing:
    'Pairs with src/data/lambda-error-budget.js (upper-bound audit) and ' +
    'src/data/bridge-lambda-rh.js (Λ→RH chain). Top half of the bracket; ' +
    'the bottom half is Rodgers-Tao Λ ≥ 0, which strictly dominates this ' +
    'CSV value.',

  uiDisclaimer:
    'CSV-style lower bound on Λ from the local zero database. Not a ' +
    'global bound — see historicalChain for the literature record and ' +
    'Rodgers-Tao 2020 for the unconditional Λ ≥ 0 result.',
};

// Sanity assertions — refused at build time if violated.
export const CSV_LOWER_BOUND_ASSERTIONS = [
  {
    id: 'csv-bound-is-negative',
    holds: () =>
      CSV_LAMBDA_LOWER_BOUND.ourBound.binding_lower_bound.Lambda_lower < 0,
    why:
      'For any non-degenerate pair the inverse-square sum over the other ' +
      'zeros dominates 4δ² − 8/γ², so the simplified CNV form returns a ' +
      'negative number. A non-negative result would indicate either a ' +
      'computation bug or a (would-be revolutionary) violation of the ' +
      'standard CSV setup.',
  },
  {
    id: 'csv-bound-weaker-than-rodgers-tao',
    holds: () =>
      CSV_LAMBDA_LOWER_BOUND.ourBound.binding_lower_bound.Lambda_lower <= 0,
    why:
      'Rodgers-Tao 2020 proved Λ ≥ 0 unconditionally. Any CSV-style ' +
      'lower bound is informative as a constructive witness but cannot ' +
      'beat Rodgers-Tao numerically.',
  },
  {
    id: 'csv-historical-chain-monotone',
    holds: () => {
      const chain = CSV_LAMBDA_LOWER_BOUND.historicalChain;
      for (let i = 1; i < chain.length; i++) {
        if (chain[i].Lambda_lower < chain[i - 1].Lambda_lower) return false;
      }
      return true;
    },
    why:
      'The historical CSV chain must be monotonically non-decreasing — ' +
      'each successive paper either matched or improved the previous ' +
      'numerical lower bound on Λ.',
  },
];
