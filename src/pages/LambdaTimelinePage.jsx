import React from 'react';
import { Link } from 'react-router-dom';
import { LAMBDA_TIMELINE } from '../data/lambda-historical-timeline.js';
import { personFor } from '../data/lambda-timeline-people.js';
import FaceAvatar from '../components/FaceAvatar.jsx';

const GRADE = {
  'peer-reviewed': {
    label: 'peer reviewed',
    fg: '#86efac',
    bg: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.35)',
  },
  'public-unrefereed': {
    label: 'public · unrefereed',
    fg: '#fde047',
    bg: 'rgba(234,179,8,0.10)',
    border: 'rgba(234,179,8,0.35)',
  },
  'public-unrefereed-local-repair': {
    label: 'public · local repair · unrefereed',
    fg: '#facc15',
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.35)',
  },
};

function GradeBadge({ status }) {
  const grade = GRADE[status] || GRADE['public-unrefereed'];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        color: grade.fg,
        background: grade.bg,
        border: `1px solid ${grade.border}`,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
      }}
    >
      {grade.label}
    </span>
  );
}

function EvidenceCard({ label, value, detail, color, route, href }) {
  const body = (
    <div
      className="card"
      style={{
        height: '100%',
        boxSizing: 'border-box',
        borderLeft: `3px solid ${color}`,
        padding: 16,
      }}
    >
      <div
        style={{
          color,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div style={{ color: '#e2e8f0', fontFamily: 'var(--font-mono)', fontSize: 20, marginTop: 8 }}>
        {value}
      </div>
      <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.55, marginTop: 7 }}>
        {detail}
      </div>
    </div>
  );

  if (route) {
    return (
      <Link to={route} style={{ color: 'inherit', textDecoration: 'none' }}>
        {body}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
        {body}
      </a>
    );
  }
  return body;
}

function ContributorFaces({ authors }) {
  const people = authors.map(personFor).filter(Boolean);
  if (people.length === 0) {
    return (
      <div
        title="Institutional or collective author"
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '2px dashed #475569',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontSize: 17,
        }}
      >
        ◇
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', minWidth: 48 }}>
      {people.map((person, index) => (
        <div
          key={person.key}
          style={{ marginLeft: index === 0 ? 0 : -8, zIndex: people.length - index }}
        >
          <FaceAvatar person={person} size={44} />
        </div>
      ))}
    </div>
  );
}

export default function LambdaTimelinePage() {
  const acceptedUpper = LAMBDA_TIMELINE.filter(
    (entry) => entry.direction === 'upper' && entry.accepted,
  );
  const publicClaims = LAMBDA_TIMELINE.filter(
    (entry) => entry.direction === 'upper' && !entry.accepted,
  );

  return (
    <div className="page" style={{ maxWidth: 1080, margin: '0 auto' }}>
      <div className="page-header">
        <h1>de Bruijn–Newman Bound Timeline</h1>
        <p className="page-subtitle" style={{ maxWidth: 900 }}>
          A chronological, evidence-graded ledger. Internal finite-N model values are deliberately
          excluded from the historical bound sequence.
        </p>
        <div style={{ marginTop: 10 }}>
          <Link to="/lambda-bounds" style={{ color: '#a855f7', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            ← bounds and RH roadmap
          </Link>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 14,
          marginTop: 22,
        }}
      >
        <EvidenceCard
          label="accepted upper benchmark"
          value="Λ ≤ 0.2"
          detail="Platt–Trudgian 2021; peer reviewed."
          color="#86efac"
        />
        <EvidenceCard
          label="public package claim"
          value="Λ ≤ 0.1875"
          detail="Unrefereed. A local audit reconstructed an omitted finite tile; that repair is not peer review."
          color="#facc15"
          href="https://doi.org/10.5281/zenodo.21175533"
        />
        <EvidenceCard
          label="local review candidate"
          value="Λ ≤ 0.1787854"
          detail="Not part of the historical theorem ledger. Stored gates pass; eight interfaces remain open."
          color="#f59e0b"
          route="/newman-lambda-01787854-candidate"
        />
      </div>

      <div className="card" style={{ marginTop: 24, padding: 16 }}>
        <h2 style={{ color: '#e2e8f0', fontSize: 18, marginTop: 0 }}>Upper-bound progression</h2>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
          Solid green rows are accepted results. Yellow rows are public claims and are not used as
          substitutes for the peer-reviewed benchmark.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            <thead>
              <tr style={{ color: '#64748b', textTransform: 'uppercase', fontSize: 10 }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Year</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Bound</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Authors</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {[...acceptedUpper, ...publicClaims]
                .sort((left, right) => left.year - right.year || right.bound - left.bound)
                .map((entry) => (
                  <tr key={`${entry.year}-${entry.bound}-${entry.status}`} style={{ borderTop: '1px solid #1e293b' }}>
                    <td style={{ padding: 8, color: '#a5b4fc' }}>{entry.year}</td>
                    <td style={{ padding: 8, color: entry.accepted ? '#86efac' : '#facc15' }}>
                      Λ {entry.relation || '≤'} {entry.bound}
                    </td>
                    <td style={{ padding: 8, color: '#cbd5e1' }}>{entry.authors.join(', ')}</td>
                    <td style={{ padding: 8 }}><GradeBadge status={entry.status} /></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <section style={{ marginTop: 34 }}>
        <h2 style={{ color: '#e2e8f0', marginBottom: 4 }}>Chronological ledger</h2>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginTop: 0 }}>
          Bounds follow the Optimization Problems chronology; each public 2026 package keeps an
          explicit unrefereed grade.
        </p>
        <div style={{ marginTop: 14 }}>
          {LAMBDA_TIMELINE.map((entry, index) => {
            const color = entry.accepted
              ? entry.direction === 'upper' ? '#86efac' : '#67e8f9'
              : '#facc15';
            const body = (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '58px 58px minmax(0, 1fr)',
                  gap: 12,
                  alignItems: 'start',
                  padding: '14px 5px',
                  borderTop: index === 0 ? 'none' : '1px solid #1e293b',
                }}
              >
                <div style={{ color: '#a855f7', fontFamily: 'var(--font-mono)', fontWeight: 800, paddingTop: 8 }}>
                  {entry.year}
                </div>
                <ContributorFaces authors={entry.authors} />
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    <strong style={{ color: '#e2e8f0', fontSize: 14 }}>{entry.authors.join(', ')}</strong>
                    <span style={{ color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      Λ {entry.relation || (entry.direction === 'upper' ? '≤' : '≥')} {entry.bound}
                    </span>
                    <GradeBadge status={entry.status} />
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.6, marginTop: 5 }}>
                    {entry.method}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 11, lineHeight: 1.55, marginTop: 5 }}>
                    {entry.citation} {entry.notes}
                  </div>
                </div>
              </div>
            );
            return entry.href ? (
              <a
                key={`${entry.year}-${entry.bound}-${index}`}
                href={entry.href}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                {body}
              </a>
            ) : (
              <div key={`${entry.year}-${entry.bound}-${index}`}>{body}</div>
            );
          })}
        </div>
      </section>

      <div
        style={{
          marginTop: 22,
          padding: 14,
          border: '1px solid rgba(245,158,11,0.35)',
          borderRadius: 9,
          color: '#fcd34d',
          background: 'rgba(245,158,11,0.06)',
          fontSize: 12.5,
          lineHeight: 1.65,
        }}
      >
        A ledger entry records that a claim and package exist. It is not a correctness
        endorsement. The app keeps the accepted, public-unrefereed, and local-candidate layers
        separate throughout.
      </div>
    </div>
  );
}
