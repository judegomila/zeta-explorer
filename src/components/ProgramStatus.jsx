import React from 'react';
import { Link } from 'react-router-dom';
import {
  PROGRAM_STATUS,
  PROGRAM_STATUS_AS_OF,
  sourceUrl,
} from '../data/program-status-current.js';

/* Two small pieces shared by the status pages.
   CurrentStatusList: the entries of program-status-current.js, each with its
   source file. SnapshotBanner: a one-line note for dated pages, linking to the
   current status page. Both read only program-status-current.js (no imports
   there), so they add no weight to a page. */

const box = {
  border: '1px solid var(--hairline, var(--rule, #d8d2c4))',
  borderLeft: '3px solid var(--brass, #a8853c)',
  borderRadius: 6,
  padding: '10px 14px',
  margin: '0 0 18px',
  fontSize: 13.5,
  lineHeight: 1.55,
  color: 'var(--ink-soft, inherit)',
  background: 'var(--paper2, transparent)',
};

export function SnapshotBanner({ date, children }) {
  return (
    <div style={box} role="note" data-status-banner="snapshot">
      <strong style={{ color: 'var(--ink, inherit)' }}>Snapshot as of {date}.</strong>{' '}
      {children || 'This page is kept as it was written and does not include later results.'}{' '}
      Current status (as of {PROGRAM_STATUS_AS_OF}): <Link to="/state-of-program">/state-of-program</Link>
      {' · '}<Link to="/key-results">/key-results</Link>.
    </div>
  );
}

export function AsOfLine({ style }) {
  return (
    <div className="ed-mono" data-status-asof={PROGRAM_STATUS_AS_OF}
      style={{ fontSize: 11.5, color: 'var(--faint, var(--ink-faint, inherit))', margin: '0 0 10px', ...style }}>
      as of {PROGRAM_STATUS_AS_OF}
    </div>
  );
}

export function CurrentStatusList({ groups, ids, showSources = true }) {
  const rows = PROGRAM_STATUS.filter((s) =>
    (ids ? ids.includes(s.id) : true) && (groups ? groups.includes(s.group) : true));
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {rows.map((s) => (
        <div key={s.id} style={{ ...box, margin: 0 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 4 }}>
            <strong style={{ color: 'var(--ink, inherit)', fontSize: 14.5 }}>{s.label}</strong>
            <span className="ed-mono" style={{ fontSize: 12 }}>{s.value}</span>
          </div>
          <div>{s.statement}</div>
          <div style={{ marginTop: 6, fontSize: 12 }}>
            {s.route && <><Link to={s.route}>{s.route}</Link>{' · '}</>}
            {s.href && <><a href={s.href}>{s.href.replace(/^https:\/\//, '')}</a>{' · '}</>}
            {showSources && (
              <span>
                source:{' '}
                {s.sources.map((p, i) => (
                  <React.Fragment key={p}>
                    {i > 0 && ', '}
                    <a href={sourceUrl(p)} target="_blank" rel="noreferrer" className="ed-mono" style={{ fontSize: 11 }}>{p}</a>
                  </React.Fragment>
                ))}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
