/**
 * @module imp-36186-kbn-kahan-two-episode-separation-viz-data
 *
 * imp-36186 (ux): lightweight, import-light viz-data module baking the imp-36112 merged
 * two-episode KBN-vs-classic-Kahan separation record as plain literals, so an analysis tab
 * can render the transient/tie-plateau/persistent pattern across N WITHOUT importing the
 * imp-36112 cross-reference chain (which pulls in three source modules) or the 16.7MB
 * zeros bundle.
 *
 * The sixteen-rung merged ladder (union of the imp-36062 and imp-36076 N sets, imp-36076's
 * finer small-N rungs preferred on the six shared N) shows THREE regions in N order: a
 * TRANSIENT separation episode at N = 1500-3000 (visible only on imp-36076's finer small-N
 * grid), a TIE PLATEAU at N = 10000-33000 (bit-identical Kahan/KBN, exactly the rungs
 * imp-36062 tested below its reported onset), and a PERSISTENT separation from N ~ 34000
 * upward (imp-36062's reported onset) where the ratio deepens to ~12.2x by N ~ 488602.
 * Follows the imp-36185 / imp-35791 / imp-35977 import-light pattern: baked literals only,
 * no re-derivation, no heavy import, no re-import of the imp-36112 crossref module.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the recorded imp-36062 / imp-36076 per-rung
 * literals verbatim; changes no bound; the W1 A + B - C certificate at T_PT stays
 * GREENFIELD (imp-35681 Part A) and the certified length-N interval sum stays MECHANICAL
 * (imp-35725); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36112-compensated-summation-storyline-crossref.js (source: the merged two-episode reconciliation)
 * @see imp-36062-kbn-kahan-separation-onset.js (source of the N=33000/34000/38000/40000/70000 rungs)
 * @see imp-36076-kahan-kbn-separation-onset.js (source of the finer N=1500/2000/3000/20000/200000 rungs)
 * @see imp-36185-e-share-five-landmark-tail-decay-viz-data.js (the import-light pattern this module follows)
 *
 * Ticket: imp-36186 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION = [
  { N: 1000, kahanNormErr: 3.735683e-19, kbnNormErr: 3.735683e-19, ratio: 1, separated: false, episode: 'pre' },
  { N: 1500, kahanNormErr: 1.587313e-18, kbnNormErr: 7.011888e-19, ratio: 2.26375, separated: true, episode: 'transient' },
  { N: 2000, kahanNormErr: 1.492323e-18, kbnNormErr: 4.852103e-19, ratio: 3.07562, separated: true, episode: 'transient' },
  { N: 3000, kahanNormErr: 2.21533e-18, kbnNormErr: 6.051279e-19, ratio: 3.66093, separated: true, episode: 'transient' },
  { N: 10000, kahanNormErr: 3.507155e-19, kbnNormErr: 3.507155e-19, ratio: 1, separated: false, episode: 'tiePlateau' },
  { N: 20000, kahanNormErr: 5.259628e-20, kbnNormErr: 5.259628e-20, ratio: 1, separated: false, episode: 'tiePlateau' },
  { N: 30000, kahanNormErr: 7.354328e-20, kbnNormErr: 7.354328e-20, ratio: 1, separated: false, episode: 'tiePlateau' },
  { N: 33000, kahanNormErr: 1.451654e-19, kbnNormErr: 1.451654e-19, ratio: 1, separated: false, episode: 'tiePlateau' },
  { N: 34000, kahanNormErr: 2.414836e-19, kbnNormErr: 2.330553e-19, ratio: 1.03616, separated: true, episode: 'persistent' },
  { N: 38000, kahanNormErr: 5.598508e-19, kbnNormErr: 1.110657e-19, ratio: 5.04072, separated: true, episode: 'persistent' },
  { N: 40000, kahanNormErr: 3.898111e-19, kbnNormErr: 4.757632e-20, ratio: 8.19339, separated: true, episode: 'persistent' },
  { N: 50000, kahanNormErr: 2.759923e-19, kbnNormErr: 1.150801e-19, ratio: 2.39826, separated: true, episode: 'persistent' },
  { N: 70000, kahanNormErr: 2.840631e-19, kbnNormErr: 4.630869e-20, ratio: 6.13412, separated: true, episode: 'persistent' },
  { N: 100000, kahanNormErr: 3.736135e-19, kbnNormErr: 9.731373e-20, ratio: 3.83927, separated: true, episode: 'persistent' },
  { N: 200000, kahanNormErr: 1.711501e-19, kbnNormErr: 2.410771e-20, ratio: 7.09939, separated: true, episode: 'persistent' },
  { N: 488602, kahanNormErr: 2.308034e-19, kbnNormErr: 1.891554e-20, ratio: 12.2018, separated: true, episode: 'persistent' },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36186_ASSERTIONS = [
  {
    id: 'imp36186-sixteen-rungs-ordered-by-N',
    description: 'Sixteen merged rungs sit in strictly increasing N order',
    holds: () =>
      IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION.length === 16 &&
      IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION.every(
        (r, i, arr) => i === 0 || r.N > arr[i - 1].N,
      ),
  },
  {
    id: 'imp36186-transient-episode-all-separated',
    description: 'Every rung in the N=1500-3000 transient episode is separated',
    holds: () =>
      IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION.filter((r) => r.episode === 'transient').length === 3 &&
      IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION.filter((r) => r.episode === 'transient').every(
        (r) => r.separated === true,
      ),
  },
  {
    id: 'imp36186-tie-plateau-all-tied',
    description: 'Every rung in the N=10000-33000 tie plateau is bit-identical (not separated)',
    holds: () =>
      IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION.filter((r) => r.episode === 'tiePlateau').length === 4 &&
      IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION.filter((r) => r.episode === 'tiePlateau').every(
        (r) => r.separated === false && r.ratio === 1,
      ),
  },
  {
    id: 'imp36186-persistent-episode-all-separated-and-deepens',
    description: 'Every rung from N=34000 up is separated and the ratio deepens toward the N~488602 endpoint',
    holds: () => {
      const persistent = IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION.filter((r) => r.episode === 'persistent');
      return (
        persistent.length === 8 &&
        persistent.every((r) => r.separated === true) &&
        persistent[persistent.length - 1].ratio > persistent[0].ratio
      );
    },
  },
  {
    id: 'imp36186-endpoint-reproduces-imp36112-sources',
    description: 'The N~488602 endpoint reproduces the imp-36062/imp-36076 recorded endpoint figures',
    holds: () => {
      const endpoint = IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION[IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION.length - 1];
      return (
        endpoint.N === 488602 &&
        Math.abs(endpoint.kahanNormErr - 2.31e-19) / 2.31e-19 < 0.05 &&
        Math.abs(endpoint.kbnNormErr - 1.89e-20) / 1.89e-20 < 0.1 &&
        endpoint.ratio > 8 && endpoint.ratio < 16
      );
    },
  },
];

for (const a of IMP36186_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36186-kbn-kahan-two-episode-separation-viz-data assertion failed: ${a.id}`);
  }
}
