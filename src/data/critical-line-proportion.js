/**
 * @fileoverview Historical record of the OTHER classical dimension of progress on
 * the Riemann Hypothesis: the proportion κ of nontrivial zeros PROVEN to lie on the
 * critical line Re s = 1/2. RH ⟺ κ = 100%. This is a rigorous, unconditional lower
 * bound on κ (distinct from the de Bruijn–Newman Λ bound and from verified zero
 * height X). The entries through 2020 are peer-reviewed literature results; the
 * 2026 entry is an external AI-produced result (Anthropic / Claude) that is
 * claimed unconditional and Lean-checked but is NOT yet peer-reviewed, flagged
 * as such. None are this project's own claims.
 */

export const CRITICAL_LINE_PROPORTION = Object.freeze([
  {
    year: 1914,
    authors: ['G. H. Hardy'],
    proportion: null,
    label: 'infinitely many',
    method: 'Proved infinitely many nontrivial zeros lie on the critical line — not yet a positive proportion.',
    citation: 'G. H. Hardy, C. R. Acad. Sci. Paris 158 (1914), 1012–1014.',
  },
  {
    year: 1942,
    authors: ['A. Selberg'],
    proportion: null,
    label: 'a positive proportion',
    method: 'A positive proportion of zeros lie on the line (κ > 0), though with a small unspecified constant.',
    citation: 'A. Selberg, Arch. Math. Naturvid. 48 (1942), 89–155.',
  },
  {
    year: 1974,
    authors: ['N. Levinson'],
    proportion: 1 / 3,
    label: '≥ 1/3 (33.3%)',
    method: 'Mollifier method: at least one third of the nontrivial zeros are on the critical line.',
    citation: 'N. Levinson, Adv. Math. 13 (1974), 383–436.',
  },
  {
    year: 1989,
    authors: ['J. B. Conrey'],
    proportion: 0.4088,
    label: '≥ 40.88%',
    method: 'Longer Levinson mollifier: more than two-fifths of the zeros are on the line and simple.',
    citation: 'J. B. Conrey, J. reine angew. Math. 399 (1989), 1–26.',
  },
  {
    year: 2011,
    authors: ['H. M. Bui', 'B. Conrey', 'M. P. Young'],
    proportion: 0.4105,
    label: '≥ 41.05%',
    method: 'Two-piece mollifier extending Conrey.',
    citation: 'H. M. Bui, B. Conrey, M. P. Young, Acta Arith. 150 (2011), 35–64.',
  },
  {
    year: 2012,
    authors: ['S. Feng'],
    proportion: 0.4128,
    label: '≥ 41.28%',
    method: 'Extended mollifier of longer length.',
    citation: 'S. Feng, J. Number Theory 132 (2012), 511–542.',
  },
  {
    year: 2020,
    authors: ['K. Pratt', 'N. Robles', 'A. Zaharescu', 'D. Zeindler'],
    proportion: 5 / 12,
    label: '≥ 5/12 (41.67%)',
    method: 'More than five-twelfths of the zeros lie on the critical line — the current unconditional record.',
    citation: 'K. Pratt, N. Robles, A. Zaharescu, D. Zeindler, Res. Math. Sci. 7 (2020), no. 2.',
    current: true,
    note: 'The current peer-reviewed unconditional record (Levinson-mollifier lineage).',
  },
  {
    year: 2026,
    authors: ['Claude (Anthropic)'],
    proportion: 2 / 3,
    label: '≥ 2/3 (66.67%); optimised 0.6725',
    method:
      'A different lineage from the Levinson mollifier: an unconditional linear-algebraic reading ' +
      '(Sylvester’s law of inertia + a von Neumann trace inequality on a finite compression of Weil’s ' +
      'Hermitian form) of Montgomery’s pair-correlation second moment makes the previously RH-conditional ' +
      '2/3 simple-zeros bound unconditional — at least 2/3 (optimised 0.6725) of the zeros are simple AND ' +
      'on the critical line. Produced by an unreleased research Claude model; internally validated, reviewed ' +
      'by Conrey and Goldston, with a Lean formal check — but not yet peer-reviewed.',
    citation:
      'CLAUDE, “More than two thirds of the zeros of the Riemann zeta function lie on the critical line” (Anthropic, Aug 2026).',
    href: 'https://www.anthropic.com/research/riemann-zeta',
    status: 'AI-produced · unconditional · unrefereed',
    accepted: false,
    aiResult: true,
    note: 'Exceeds the 5/12 peer-reviewed record but via a separate method and pending refereeing; tracked as an external AI result, not this project’s.',
  },
]);

// The target. RH is exactly the statement that this proportion is 100%.
export const RH_TARGET = Object.freeze({ proportion: 1.0, label: '100% — Riemann Hypothesis' });
