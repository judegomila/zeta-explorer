import React, { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97453_SIGN_LADDER,
  IMP97453_MAGNITUDE_LADDER,
  IMP97453_SUMMARY,
  IMP97453_HONEST_BANNER,
} from '../data/imp-97453-route-m-sign-magnitude-omega-ladder-viz-data.js';
import { STATUS, ED } from '../styles/tokens.js';

// imp-97453: a two-tab analysis view of the Route M b/4-ceiling cohort -- the SIGN law ladder
// (proved through omega=4, reduced at omega=5 to a Binet-bracket tail lemma, imp-97352/imp-97423)
// alongside the companion MAGNITUDE ladder (collapsed to |T(b)|<=1/4, conditional on the single MCM
// hypothesis, imp-97422).

const STATUS_COLOR = {
  proved: STATUS.proved.fg,
  reduced: ED.series4,
  open: STATUS.open.fg,
  'conditional-verified': ED.series1,
  'conditional-unverified': ED.series8,
};

const TABS = [
  { key: 'sign', title: 'Sign law T(b) < 0', rows: IMP97453_SIGN_LADDER },
  { key: 'magnitude', title: 'Magnitude |T(b)| <= 1/4', rows: IMP97453_MAGNITUDE_LADDER },
];

function LadderRows({ rows }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
      {rows.map((row) => (
        <div
          key={row.omega}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.6rem 0.8rem',
            background: 'color-mix(in srgb, var(--ink-soft) 5%, transparent)',
            borderLeft: `3px solid ${STATUS_COLOR[row.status] || ED.series8}`,
            borderRadius: '0 4px 4px 0',
          }}
        >
          <div style={{ minWidth: 56, fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--ink)' }}>
            &omega;={row.omega}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: STATUS_COLOR[row.status] || 'var(--ink-soft)',
                marginBottom: '0.2rem',
              }}
            >
              {row.label}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', lineHeight: 1.4 }}>{row.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Imp97453RouteMSignLawMagnitudeLadderViz() {
  const [tab, setTab] = useState('sign');
  const active = TABS.find((t) => t.key === tab) || TABS[0];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Sign / Magnitude Omega-Ladder" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 6%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--ink)' }}>Honest status:</strong> {IMP97453_HONEST_BANNER}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              borderRadius: 4,
              border: '1px solid var(--rule)',
              background: tab === t.key ? 'var(--paper-3)' : 'transparent',
              color: tab === t.key ? 'var(--ink)' : 'var(--ink-faint)',
              cursor: 'pointer',
            }}
          >
            {t.title}
          </button>
        ))}
      </div>

      <LadderRows rows={active.rows} />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-97453
        viz-data leaf (every value reused verbatim from imp-97352/imp-97423/imp-97422, no
        re-derivation). Sign proved through &omega;={IMP97453_SUMMARY.signProvedThrough}, reduced at
        &omega;={IMP97453_SUMMARY.signReducedAt}; magnitude conditional on MCM, verified through
        &omega;={IMP97453_SUMMARY.magnitudeVerifiedThrough}. Changes no bound, establishes no operator
        positivity; RH open; NO QED.
      </div>
    </div>
  );
}
