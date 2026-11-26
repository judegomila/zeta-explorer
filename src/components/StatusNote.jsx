import React from 'react';
import { Link } from 'react-router-dom';
import { REPO_BLOB_BASE, STRESS_TEST_DIR } from '../data/key-results.js';

/* A status note placed at the top of a page: the statement that holds, in the
   present tense, with exact numbers. When the body of the page still presents
   an older formulation, pass `recordsFormulation` so the note says that the
   statement above governs. `item` is the id of the entry on /key-results; the
   note links to that item's review files. */
export default function StatusNote({ item, recordsFormulation = false, children }) {
  return (
    <div
      role="note"
      className="status-note"
      style={{
        border: '1px solid var(--hairline, #d9d2c3)',
        borderLeft: '4px solid var(--brass-dk, #8a6d2f)',
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
          color: 'var(--brass-dk, #8a6d2f)',
          marginBottom: 4,
        }}
      >
        Status
      </div>
      <div>{children}</div>
      {recordsFormulation && (
        <div style={{ marginTop: 6 }}>
          The text below records the program as it was formulated; the statement above governs.
        </div>
      )}
      <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-soft, #55504a)' }}>
        {item && (
          <>
            Review record:{' '}
            <a href={`${REPO_BLOB_BASE}${STRESS_TEST_DIR}${item}/VERDICT.md`} target="_blank" rel="noreferrer">first verdict ↗</a>
            {' · '}
            <a href={`${REPO_BLOB_BASE}${STRESS_TEST_DIR}${item}/REFEREE.md`} target="_blank" rel="noreferrer">referee ↗</a>
            {' · '}
          </>
        )}
        <Link to="/key-results">Key results →</Link>
      </div>
    </div>
  );
}
