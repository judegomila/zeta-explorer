/**
 * @module imp-35210-four-e-component-landmarks-viz-data
 *
 * imp-35210 (ux, frontier-direction): imp-35153 pinned the E_flow = E_trunc crossover in closed
 * form (N ~ 1.597752e6) and imp-35154 pinned the two E_flow negligibility thresholds relative to
 * the E_coll = E_trunc crossover (N ~ 3.280294e9, imp-33723), but the four landmarks were never
 * placed together on a single shared log-N axis. This module supplies the four literal values
 * (reused verbatim, no recomputation) for that viz.
 *
 * THE FOUR LANDMARKS, IN N-ORDER
 * ------------------------------
 *   L1  N_flow_eq_trunc  ~ 1.597752e6   E_flow = E_trunc crossover           (imp-35153/imp-35105)
 *   L2  N_1pct           ~ 3.246862e7   E_flow drops below 1% of E_coll+E_flow (imp-35154 M2)
 *   L3  N_cross          ~ 3.280294e9   E_coll = E_trunc crossover           (imp-33723)
 *   L4  N_0p1pct         ~ 1.754552e10  E_flow drops below 0.1% of E_coll+E_flow (imp-35154 M3)
 *
 * The ordering L1 < L2 < L3 < L4 says: the flow term crashes below the truncation floor first
 * (L1), becomes a sub-1% correction to the above-floor residual well before the collision term
 * catches up to the truncation floor (L2 sits ~2.00 decades below L3), and only becomes a
 * sub-0.1% correction slightly past the collision crossover (L4 sits ~0.73 decades above L3) --
 * so the entire E_coll = E_trunc crossover neighborhood is already E_coll-only to <1% (imp-35154).
 *
 * VIZ/UX ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35153-eflow-etrunc-crossover-closed-form (L1: N ~ 1.597752e6)
 * @see imp-35154-eflow-negligible-threshold (L2: N ~ 3.246862e7; L4: N ~ 1.754552e10)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (L3: N_cross ~ 3.280294e9)
 */

export const IMP35210_LANDMARKS = [
  {
    key: 'L1',
    label: 'E_flow = E_trunc',
    N: 1.597752e6,
    source: 'imp-35153 (closed form)',
  },
  {
    key: 'L2',
    label: 'E_flow < 1% share',
    N: 3.246862e7,
    source: 'imp-35154 M2',
  },
  {
    key: 'L3',
    label: 'E_coll = E_trunc (N_cross)',
    N: 3.280294e9,
    source: 'imp-33723 (closed form)',
  },
  {
    key: 'L4',
    label: 'E_flow < 0.1% share',
    N: 1.754552e10,
    source: 'imp-35154 M3',
  },
];

export const IMP35210_N_MIN = IMP35210_LANDMARKS[0].N;
export const IMP35210_N_MAX = IMP35210_LANDMARKS[IMP35210_LANDMARKS.length - 1].N;

// Pairwise decade separations (log10 gaps) between consecutive landmarks, for the annotation.
export const IMP35210_DECADE_GAPS = [];
for (let i = 1; i < IMP35210_LANDMARKS.length; i++) {
  IMP35210_DECADE_GAPS.push({
    from: IMP35210_LANDMARKS[i - 1].key,
    to: IMP35210_LANDMARKS[i].key,
    decades: +(Math.log10(IMP35210_LANDMARKS[i].N) - Math.log10(IMP35210_LANDMARKS[i - 1].N)).toFixed(4),
  });
}

// Decades of L2 and L4 relative to L3 (N_cross), matching the imp-35154 reported figures.
export const IMP35210_NCROSS_OFFSETS = {
  L2_decades_below_Ncross: +(Math.log10(IMP35210_LANDMARKS[2].N) - Math.log10(IMP35210_LANDMARKS[1].N)).toFixed(4), // ~2.00
  L4_decades_above_Ncross: +(Math.log10(IMP35210_LANDMARKS[3].N) - Math.log10(IMP35210_LANDMARKS[2].N)).toFixed(4), // ~0.73
};

export const IMP35210_ASSERTIONS = [
  {
    id: 'imp35210-four-landmarks-strictly-increasing',
    description: 'the four landmarks are strictly increasing in N (L1 < L2 < L3 < L4)',
    holds: () => {
      for (let i = 1; i < IMP35210_LANDMARKS.length; i++) {
        if (!(IMP35210_LANDMARKS[i].N > IMP35210_LANDMARKS[i - 1].N)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp35210-ncross-offsets-match-imp35154',
    description: 'the L2/L4 decade offsets from N_cross reproduce the imp-35154 reported ~2.00 / ~0.73 figures',
    holds: () =>
      Math.abs(IMP35210_NCROSS_OFFSETS.L2_decades_below_Ncross - 2.0044) < 0.01 &&
      Math.abs(IMP35210_NCROSS_OFFSETS.L4_decades_above_Ncross - 0.7283) < 0.01,
  },
  {
    id: 'imp35210-decade-gaps-count',
    description: 'exactly three consecutive decade gaps for four landmarks',
    holds: () => IMP35210_DECADE_GAPS.length === 3,
  },
];

for (const a of IMP35210_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35210-four-e-component-landmarks-viz-data assertion failed: ${a.id}`);
  }
}
