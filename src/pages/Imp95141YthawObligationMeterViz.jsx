import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { YTHAW_OBLIGATION_LEDGER, YTHAW_OBLIGATION_SUMMARY } from '../data/imp-95140-ythaw-obligation-ledger.js';
import { ED, STATUS } from '../styles/tokens.js';

const STATUS_COLOR = {
  CLOSED: ED.series3,
  OPEN: STATUS.open.fg,
};

function ObligationRow({ o }) {
  const color = STATUS_COLOR[o.status];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '3rem 5.5rem 1fr',
        gap: '0.75rem',
        alignItems: 'start',
        padding: '0.6rem 0',
        borderBottom: '1px solid var(--rule-soft)',
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{o.obligation}</div>
      <div>
        <span
          style={{
            display: 'inline-block',
            padding: '0.1rem 0.5rem',
            borderRadius: '999px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color,
            border: `1px solid ${color}`,
          }}
        >
          {o.status}
        </span>
      </div>
      <div style={{ color: 'var(--ink-soft)', fontSize: '0.82rem' }}>{o.role}</div>
    </div>
  );
}

export default function Imp95141YthawObligationMeterViz() {
  const { closedCount, openCount, totalCount, thawedFloorY, candidateValue } = YTHAW_OBLIGATION_SUMMARY;
  const pct = (closedCount / totalCount) * 100;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="y-thaw Obligation Progress Meter: O1-O6 at floor y = 0.1808 (imp-95141)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {candidateValue} is a
        package value, not a proven bound. Only 2 of the 6 obligations below are closed;
        the package cannot certify anything until O1, O2, O4, and O6 also close.
        No refereed bound is changed. RH does not follow
        from anything on this page.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        The y-thaw-01775943 package at thawed floor y = {thawedFloorY} carries six obligations
        O1&ndash;O6 (imp-95140 ledger). O3 (E_max budget) and O5 (site coverage) are CLOSED
        under our toolchain (imp-95212); O1, O2, O4, O6 remain OPEN.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--ink-soft)', marginBottom: '0.35rem' }}>
          <span>{closedCount} of {totalCount} obligations CLOSED</span>
          <span>{openCount} OPEN</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '14px',
            background: 'color-mix(in srgb, var(--series-2) 15%, transparent)',
            borderRadius: '999px',
            overflow: 'hidden',
            border: '1px solid var(--rule)',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: 'color-mix(in srgb, var(--series-3) 55%, transparent)',
            }}
          />
        </div>
      </div>

      <div style={{ border: '1px solid var(--rule-soft)', borderRadius: '6px', padding: '0 1rem' }}>
        {YTHAW_OBLIGATION_LEDGER.map((o) => (
          <ObligationRow key={o.obligation} o={o} />
        ))}
      </div>

      <div
        style={{
          marginTop: '1.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page reusing the
        imp-95140 YTHAW_OBLIGATION_LEDGER / YTHAW_OBLIGATION_SUMMARY literals verbatim (no new
        computation). Closes no obligation itself; makes the existing O1&ndash;O6 status legible
        as a single progress meter. No refereed bound is changed. No QED.
      </div>
    </div>
  );
}
