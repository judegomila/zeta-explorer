import React from 'react';
import { Link } from 'react-router-dom';
import { REPO_BLOB_BASE, STRESS_TEST_DATE, STRESS_TEST_DIR } from '../data/key-results.js';

/* A dated correction notice placed at the top of a page whose text states
   something the stress test of 2026-11-21 found to be wrong. The original text
   of the page stays below the notice. `item` is the id of the entry on
   /key-results; the notice links to that item's verdict files. */
export default function CorrectionNotice({ item, date = STRESS_TEST_DATE, children }) {
  return (
    <div
      role="note"
      className="correction-notice"
      style={{
        border: '1px solid var(--terra-dk, #9a4a2f)',
        borderLeft: '4px solid var(--terra-dk, #9a4a2f)',
        borderRadius: 8,
        background: 'var(--paper2, #f6f1e7)',
        padding: '12px 16px',
        margin: '0 0 18px',
        fontSize: 14,
        lineHeight: 1.6,
        color: 'var(--ink, #1c1a17)',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--ed-mono, var(--font-mono, monospace))',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          color: 'var(--terra-dk, #9a4a2f)',
          marginBottom: 4,
        }}
      >
        Correction, {date}
      </div>
      <div>{children}</div>
      <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-soft, #55504a)' }}>
        Source: independent stress test of {date}.{' '}
        {item && (
          <>
            <a href={`${REPO_BLOB_BASE}${STRESS_TEST_DIR}${item}/VERDICT.md`} target="_blank" rel="noreferrer">First verdict ↗</a>
            {' · '}
            <a href={`${REPO_BLOB_BASE}${STRESS_TEST_DIR}${item}/REFEREE.md`} target="_blank" rel="noreferrer">Referee (final) ↗</a>
            {' · '}
          </>
        )}
        <Link to="/key-results">Key results →</Link>
        {' '}The original text of this page is kept below.
      </div>
    </div>
  );
}
