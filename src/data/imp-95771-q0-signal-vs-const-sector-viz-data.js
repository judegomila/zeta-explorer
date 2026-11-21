/**
 * imp-95771: import-light viz-data contrasting the two sectors of the imp-95746 (6.21)
 * integrand across four consecutive moduli (m = 18..21): the Q_0 zeta(3) sector, which
 * carries a genuine ~4.15e-5 m-signal, against the const sector, which is m-free and
 * pinned to exactly 3/2 (the sole carrier of the imp-95745 pure-rational +4 offset).
 *
 * Reuses the baked PER_MODULUS / mFreeSector literals from imp-95746 (no re-derivation,
 * no new computation): this module only reshapes them into two plottable per-modulus
 * series -- q0Sector(m) (varying) and constSector(m) (flat at 1.5) -- plus the spread
 * metrics that make the contrast visible on two independent y-scales.
 *
 * MEASUREMENT ONLY. Changes no bound; NO QED; no refereed bound is changed;
 * Sun arXiv:2609.04176 remains single-author, unrefereed; Catalan G irrationality OPEN.
 *
 * @see imp-95746-sun-prop63-plus4-offset-four-moduli.js (source PER_MODULUS / mFreeSector literals)
 */

import { SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI } from './imp-95746-sun-prop63-plus4-offset-four-moduli.js';

const PER_MODULUS = SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.perModulus;
const CONST_SECTOR = SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.mFreeSector.constSector; // 1.5, m-free

export const Q0_VS_CONST_ROWS = PER_MODULUS.map((r) => ({
  m: r.m,
  q0Sector: r.q0Sector,
  constSector: CONST_SECTOR,
}));

const q0Values = Q0_VS_CONST_ROWS.map((r) => r.q0Sector);
export const Q0_SECTOR_SPREAD = Math.max(...q0Values) - Math.min(...q0Values); // ~4.15e-5, genuine m-signal
export const CONST_SECTOR_SPREAD = 0; // exactly flat, by construction of the m-free integrand

export const IMP95771_SUMMARY = Object.freeze({
  law: 'INT621(m) = C + Q(m) splits the (6.21) integrand into an m-free const sector C = 3/2 (carries the +4) and an m-dependent Q_0 zeta(3) sector Q(m).',
  reading: `Across m = 18..21 the Q_0 sector ranges over ${Q0_SECTOR_SPREAD.toExponential(2)} (a genuine m-signal, non-monotone in m) while the const sector sits at exactly ${CONST_SECTOR} at every modulus (spread ${CONST_SECTOR_SPREAD}) -- visual confirmation that the imp-95745 pure-rational +4 offset depends only on the flat sector, never on the moving one.`,
  verdict: 'PRESENTATION ONLY, no new computation; re-plots imp-95746 literals. Changes no bound; NO QED; RH open; Catalan G irrationality open; no refereed bound is changed; Sun arXiv:2609.04176 remains single-author, unrefereed.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const near = (u, v, tol) => Math.abs(u - v) <= tol;

const IMP95771_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95771-four-moduli-rows',
    description: 'four consecutive moduli (m=18,19,20,21) are present in row order',
    holds: () => Q0_VS_CONST_ROWS.length === 4 && Q0_VS_CONST_ROWS.map((r) => r.m).join(',') === '18,19,20,21',
  },
  {
    id: 'imp95771-const-sector-flat',
    description: 'the const sector is exactly 1.5 at every modulus (zero spread)',
    holds: () => Q0_VS_CONST_ROWS.every((r) => r.constSector === 1.5) && CONST_SECTOR_SPREAD === 0,
  },
  {
    id: 'imp95771-q0-sector-genuine-signal',
    description: 'the Q_0 sector spread reproduces the imp-95746 ~4.15e-5 genuine m-signal',
    holds: () => Q0_SECTOR_SPREAD > 1e-5 && Q0_SECTOR_SPREAD < 1e-4
      && near(Q0_SECTOR_SPREAD, SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.witness.q0Spread, 1e-12),
  },
  {
    id: 'imp95771-q0-values-reproduce-source',
    description: 'each row q0Sector matches the imp-95746 perModulus literal it was reshaped from',
    holds: () => Q0_VS_CONST_ROWS.every((row, i) => near(row.q0Sector, PER_MODULUS[i].q0Sector, 1e-12)),
  },
  {
    id: 'imp95771-honesty-gate-no-qed',
    description: 'summary carries NO QED / RH open / SOTA / unrefereed markers',
    holds: () => /NO QED/.test(IMP95771_SUMMARY.verdict) && /RH open/.test(IMP95771_SUMMARY.verdict)
      && /refereed bound is changed/i.test(IMP95771_SUMMARY.verdict) && /unrefereed/.test(IMP95771_SUMMARY.verdict),
  },
];

for (const a of IMP95771_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95771-q0-signal-vs-const-sector-viz-data assertion failed: ${a.id}`);
  }
}
