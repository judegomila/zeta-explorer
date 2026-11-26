import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { LAMBDA_TIMELINE } from '../data/lambda-historical-timeline.js';
import { personFor } from '../data/lambda-timeline-people.js';
import FaceAvatar from '../components/FaceAvatar.jsx';
import { ED, alpha } from '../styles/tokens.js';

// Λ Timeline — chronological, evidence-graded ledger of de Bruijn-Newman bounds.
// Editorial (warm) re-theme: full-width dashboard, identical structure/data.

const GRADE = {
  'peer-reviewed': {
    label: 'peer reviewed',
    fg: 'var(--green)',
    bg: alpha(ED.series3, 0.12),
    border: alpha(ED.series3, 0.4),
  },
  'public-unrefereed': {
    label: 'public · unrefereed',
    fg: 'var(--brass-dk)',
    bg: alpha(ED.brassDeco, 0.14),
    border: alpha(ED.brassDeco, 0.45),
  },
  'public-unrefereed-local-repair': {
    label: 'public · local repair · unrefereed',
    fg: 'var(--brass-dk)',
    bg: alpha(ED.brassDeco, 0.14),
    border: alpha(ED.brassDeco, 0.45),
  },
  'computer-assisted candidate': {
    label: 'candidate · unrefereed',
    fg: 'var(--blue)',
    bg: alpha(ED.series1, 0.14),
    border: alpha(ED.series1, 0.45),
  },
};

// Render-site copy pass (2026-08-28 currency audit): the PT Λ ≤ 0.2 benchmark
// is stated once on this page (the accepted-benchmark evidence card); repeated
// "remains …benchmark / SOTA" tag-lines in ledger-row notes are suppressed here.
function displayNotes(notes) {
  return (notes || '')
    .replace(/Platt[–-]Trudgian Λ ≤ 0\.2 remains (?:the peer-reviewed benchmark|SOTA);?\s*/g, '')
    .trim();
}

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
        fontFamily: 'var(--ed-mono, var(--font-mono))',
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
        background: 'var(--paper2)',
        border: '1px solid var(--hairline)',
        borderLeft: `3px solid ${color}`,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div
        style={{
          color,
          fontFamily: 'var(--ed-mono, var(--font-mono))',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div style={{ color: 'var(--ink)', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 20, marginTop: 8 }}>
        {value}
      </div>
      <div style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.55, marginTop: 7 }}>
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
          border: '2px dashed var(--hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--faint)',
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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 10 }}>
          <h1 className="ed-h1">de Bruijn–Newman Bound Timeline</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 720, marginTop: 10 }}>
            A chronological, evidence-graded ledger. Internal finite-N model values are deliberately
            excluded from the historical bound sequence. For the project's own account of the
            Λ ≤ 0.1787854 candidate, see the{' '}
            <a href="https://judegomila.com/posts/riemann-lambda-0.1787854" target="_blank" rel="noreferrer" style={{ color: 'var(--terra-dk)' }}>
              write-up on judegomila.com ↗
            </a>.
          </p>
          <div style={{ marginTop: 10 }}>
            <Link
              to="/lambda-bounds"
              style={{
                color: 'var(--brass)',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
                fontSize: 12,
                textDecoration: 'none',
                padding: '4px 10px',
                border: '1px solid var(--brass)',
                borderRadius: 6,
                display: 'inline-block',
              }}
            >
              ← bounds and RH roadmap
            </Link>
          </div>
        </div>

        <div
          className="card-grid"
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
            color={ED.series3}
          />
          <EvidenceCard
            label="public package claim"
            value="Λ ≤ 0.1875"
            detail="Unrefereed. A local audit reconstructed an omitted finite tile; that repair is not peer review."
            color={ED.brass}
            href="https://doi.org/10.5281/zenodo.21175533"
          />
          <EvidenceCard
            label="proof candidate · Romik-reviewed · publicly posted · not refereed"
            value="Λ ≤ 0.1787854"
            detail="Candidate for an unconditional computer-assisted proof; reviewed by Dan Romik and publicly posted (judegomila.com/posts/riemann-lambda-0.1787854); not refereed, not established or accepted. Package review-01787854-v3 at commit 2e9976c4becbf97e31c56fe75fce07cdff5dd4ea."
            color={ED.series1}
            route="/newman-lambda-01787854-candidate"
          />
          <EvidenceCard
            label="sharper proof candidate · unrefereed"
            value="Λ ≤ 0.1758354"
            detail="Four independent gates machine-checked in Arb interval arithmetic, with the reduction to the gates Lean-checked; unrefereed, not established. Since 2026-10-09 a smaller value, 0.116091488672439, is recorded; it is conditional on three inputs that are not established (see the next card)."
            color={ED.series1}
            route="/lambda-01758354-candidate"
          />
          <EvidenceCard
            label="conditional on three unestablished inputs · not peer reviewed"
            value="Λ ≤ 0.116091488672439"
            detail="Holds if ζ(s) ≠ 0 for Re s > 7/8 (openai/math family 003; Lean proof rebuilt locally) and D. J. Raymond's decreasing-barrier chain (Zenodo 10.5281/zenodo.22867547) both hold, with the Platt–Trudgian verified height and the project's own floor and kernel tables, which are internal and partly uncertified (0.118506 without them). Draft of 2026-10-09; not an established bound."
            color={ED.brass}
            route="/lambda-0116091"
          />
          <EvidenceCard
            label="third-party claim · replayed, partially refereed here · not verified"
            value="Λ ≤ 0.107964910079"
            detail="D. J. Raymond, 63-page computer-assisted manuscript; depends on the unrefereed half-plane Re s > 7/8. Checker replayed in full here; Proposition 3.2 is not proved in the paper (report of 2026-11-17)."
            color={ED.brass}
          />
        </div>
        <div className="ed-mono" style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 6 }}>cards as of 2026-11-20 · the timeline below ends at 2026-09 · current status: <Link to="/state-of-program">/state-of-program</Link></div>

        <div
          className="card"
          style={{
            marginTop: 24,
            padding: 16,
            background: 'var(--paper2)',
            border: '1px solid var(--hairline)',
            borderLeft: '3px solid var(--brass-dk)',
            borderRadius: 8,
          }}
        >
          <h2 className="ed-h2" style={{ color: 'var(--ink)', fontSize: 18, marginTop: 0 }}>Upper-bound progression</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
            Solid green rows are accepted results. Brass rows are public claims and are not used as
            substitutes for the peer-reviewed benchmark.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12 }}>
              <thead>
                <tr style={{ color: 'var(--faint)', textTransform: 'uppercase', fontSize: 10 }}>
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
                    <tr key={`${entry.year}-${entry.bound}-${entry.status}`} style={{ borderTop: '1px solid var(--hairline)' }}>
                      <td style={{ padding: 8, color: 'var(--brass)' }}>{entry.year}</td>
                      <td style={{ padding: 8, color: entry.accepted ? 'var(--green)' : 'var(--brass-dk)' }}>
                        Λ {entry.relation || '≤'} {entry.bound}
                      </td>
                      <td style={{ padding: 8, color: 'var(--ink-soft)' }}>{entry.authors.join(', ')}</td>
                      <td style={{ padding: 8 }}><GradeBadge status={entry.status} /></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <section style={{ marginTop: 34 }}>
          <h2 className="ed-h2" style={{ color: 'var(--ink)', marginBottom: 4 }}>Chronological ledger</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, marginTop: 0 }}>
            Bounds follow the Optimization Problems chronology; each public 2026 package keeps an
            explicit unrefereed grade.
          </p>
          <div style={{ marginTop: 14 }}>
            {LAMBDA_TIMELINE.map((entry, index) => {
              const color = entry.accepted
                ? entry.direction === 'upper' ? 'var(--green)' : 'var(--blue)'
                : 'var(--brass-dk)';
              const body = (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '58px 58px minmax(0, 1fr)',
                    gap: 12,
                    alignItems: 'start',
                    padding: '14px 5px',
                    borderTop: index === 0 ? 'none' : '1px solid var(--hairline)',
                  }}
                >
                  <div style={{ color: 'var(--brass)', fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 800, paddingTop: 8 }}>
                    {entry.year}
                  </div>
                  <ContributorFaces authors={entry.authors} />
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <strong style={{ color: 'var(--ink)', fontSize: 14 }}>{entry.authors.join(', ')}</strong>
                      <span style={{ color, fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 700 }}>
                        Λ {entry.relation || (entry.direction === 'upper' ? '≤' : '≥')} {entry.bound}
                      </span>
                      <GradeBadge status={entry.status} />
                    </div>
                    <div style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.6, marginTop: 5 }}>
                      {entry.method}
                    </div>
                    <div style={{ color: 'var(--faint)', fontSize: 11, lineHeight: 1.55, marginTop: 5 }}>
                      {entry.citation} {displayNotes(entry.notes)}
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
            border: '1px solid color-mix(in srgb, var(--brass-deco) 45%, transparent)',
            borderRadius: 9,
            color: 'var(--brass-dk)',
            background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
            fontSize: 12.5,
            lineHeight: 1.65,
          }}
        >
          A ledger entry records that a claim and package exist. It is not a correctness
          endorsement. The app keeps the accepted, public-unrefereed, and
          unrefereed-proof-candidate layers (the 0.1787854 candidate is reviewed by Dan Romik;
          neither candidate is refereed) separate throughout.
        </div>

        <div
          className="card"
          style={{
            marginTop: 24,
            background: 'var(--paper2)',
            border: '1px solid var(--hairline)',
            borderLeft: '3px solid var(--brass)',
            borderRadius: 8,
            padding: '16px 18px',
          }}
        >
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/lambda-bounds" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Λ Bounds &amp; RH Roadmap
            </Link>
            <Link to="/newman-lambda-01787854-candidate" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Λ ≤ 0.1787854 candidate audit
            </Link>
            <Link to="/improvement-queue" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Live improvement queue
            </Link>
            <Link to="/research-journal" style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}>
              → Research Journal
            </Link>
          </div>
          <div style={{ marginTop: 14 }}>
            <Link to="/" style={{ fontSize: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
