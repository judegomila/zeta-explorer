import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34540_LADDER,
  IMP34540_SPACINGS,
  IMP34540_CONSTANTS,
} from '../data/imp-34540-pole-leakage-five-rung-ladder-viz-data.js';

export default function Imp34540PoleLeakageFiveRungLadderViz() {
  const { poleLocation, plateau, decadesBelowPole20pct } = IMP34540_CONSTANTS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Pole-Leakage Five-Rung Ladder: 1%/3%/8%/15%/20% (imp-34512)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34512 extended the imp-34468 pole-leakage degradation ladder leak(k) = 100 |dy/dk(k)
        &minus; P| / |P| (P = dy/dk(k=14) &asymp; {plateau}) with two new rungs, giving five
        crossings total: {'{'}1: {IMP34540_LADDER[0].k.toFixed(3)}, 3: {IMP34540_LADDER[1].k.toFixed(3)},
        8: {IMP34540_LADDER[2].k.toFixed(3)}, 15: {IMP34540_LADDER[3].k.toFixed(3)}, 20:{' '}
        {IMP34540_LADDER[4].k.toFixed(3)}{'}'}, all below the imp-34023 pole
        k* &asymp; {poleLocation.toFixed(5)} (the 20% rung still {decadesBelowPole20pct.toFixed(3)}{' '}
        decades below it). The table below tabulates all five rungs together with the
        per-percentage-point normalized spacing, which compresses monotonically as the branch
        steepens toward the pole.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        the full five-rung ladder
      </p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>threshold</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>crossing k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>decades below k*</th>
          </tr>
        </thead>
        <tbody>
          {IMP34540_LADDER.map((row) => (
            <tr key={row.threshold} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.threshold}%</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.k.toFixed(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(poleLocation - row.k).toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        per-percentage-point normalized spacing (compresses toward the pole)
      </p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>step</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>decade spacing</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>decades / pp</th>
          </tr>
        </thead>
        <tbody>
          {IMP34540_SPACINGS.map((row) => (
            <tr key={`${row.from}-${row.to}`} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.from}% &rarr; {row.to}%
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.decades.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.perPp.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> the per-pp normalized spacing falls
        monotonically ({IMP34540_SPACINGS.map((r) => r.perPp.toFixed(4)).join(' → ')} decades/pp) as
        k climbs, meaning ever-larger leak increments compress into shorter k intervals -- the branch is
        steepening toward the pole, consistent with the imp-34512 R3 finding that the effective pole
        exponent collapses toward 1 (a genuine simple pole) only asymptotically close to k*.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34512 measurement; no new derivation, no bound changed. Component model is
        the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional
        per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; NO QED.
      </div>
    </div>
  );
}
