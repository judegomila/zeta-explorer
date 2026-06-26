import React from 'react';
import { Link } from 'react-router-dom';
import { SESSIONS } from '../data/sessions.js';
import FreshnessBanner from '../components/FreshnessBanner.jsx';

// Research Journal — coarse-grained session narratives of the RH Λ attack.
// Read interface for src/data/sessions.js (SESSIONS.md is the write-through).
// Companion to:
//   /improvements       — per-commit improvement log
//   /improvement-queue  — live task list

const cardBase = {
  borderLeftWidth: 3,
  borderLeftColor: '#a855f7',
};

function ticketLink(id) {
  return (
    <Link
      key={id}
      to="/improvement-queue"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        padding: '2px 8px',
        borderRadius: 4,
        background: 'var(--bg-primary)',
        color: '#a855f7',
        border: '1px solid var(--border)',
        textDecoration: 'none',
      }}
    >
      {id}
    </Link>
  );
}

function fileTag(path) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        padding: '2px 8px',
        borderRadius: 4,
        background: 'var(--bg-primary)',
        color: 'var(--accent-cyan)',
        border: '1px solid var(--border)',
      }}
    >
      {path}
    </span>
  );
}

export default function ResearchJournalPage() {
  const reversed = [...SESSIONS].reverse();

  if (reversed.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Research Journal</h1>
        </div>
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          No sessions recorded yet. Add entries to <code>src/data/sessions.js</code>.
        </div>
      </div>
    );
  }

  const totalSeededTickets = SESSIONS.reduce((acc, s) => {
    if (!s.seededTickets) return acc;
    return acc + s.seededTickets.reduce((a, p) => a + p.ids.length, 0);
  }, 0);
  const totalShippedFiles = SESSIONS.reduce((acc, s) => {
    return acc + (s.shippedFiles ? s.shippedFiles.length : 0);
  }, 0);

  const stats = [
    { label: 'Sessions', value: SESSIONS.length },
    { label: 'Tickets seeded', value: totalSeededTickets },
    { label: 'Files shipped', value: totalShippedFiles },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Research Journal</h1>
        <p>
          Coarse-grained journal of work sessions on the Riemann Hypothesis Λ
          bound attack — one entry per session. Built so a new session can
          pick up context without re-deriving the load-bearing blocker from
          IMPROVEMENTS.md and improvement-queue.js. See also{' '}
          <Link to="/improvements" style={{ color: 'var(--accent-cyan)' }}>
            per-commit improvements
          </Link>
          {' · '}
          <Link to="/improvement-queue" style={{ color: 'var(--accent-cyan)' }}>
            live task queue
          </Link>
          .
        </p>
      </div>

      <FreshnessBanner date={reversed[0].date} note="latest session date; build-time snapshot" />

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        {stats.map(({ label, value }) => (
          <div
            key={label}
            style={{
              padding: '10px 18px',
              borderRadius: 6,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              minWidth: 100,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#a855f7',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.2,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                marginTop: 3,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {reversed.map((s) => (
          <div key={s.id} className="card" style={cardBase}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                }}
              >
                {s.date}
              </span>
              <span className="tag tag-purple">Session</span>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
              {s.title}
            </h2>

            {s.lambdaHeadline && (
              <div
                style={{
                  marginBottom: 16,
                  padding: '10px 14px',
                  borderRadius: 6,
                  background: 'rgba(168,85,247,0.06)',
                  border: '1px solid rgba(168,85,247,0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 4,
                  }}
                >
                  Λ headline (start → end)
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: '#d8b4fe',
                  }}
                >
                  {s.lambdaHeadline.start} → {s.lambdaHeadline.end}
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 12,
                    lineHeight: 1.6,
                    marginTop: 6,
                  }}
                >
                  {s.lambdaHeadline.provenance}
                </div>
                {s.lambdaHeadline.note && (
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: 12,
                      lineHeight: 1.6,
                      marginTop: 6,
                      fontStyle: 'italic',
                    }}
                  >
                    {s.lambdaHeadline.note}
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 4,
                  }}
                >
                  Engine state at start
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {s.engineStateStart}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 4,
                  }}
                >
                  Engine state at end
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {s.engineStateEnd}
                </div>
              </div>
            </div>

            {s.seededTickets && s.seededTickets.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 8,
                  }}
                >
                  Seeded tickets
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.seededTickets.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 4,
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          flexWrap: 'wrap',
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#a855f7',
                          }}
                        >
                          {p.phase}
                        </span>
                        {p.ids.map(ticketLink)}
                      </div>
                      <div
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: 12,
                          lineHeight: 1.6,
                        }}
                      >
                        {p.summary}
                      </div>
                      {p.status && (
                        <div
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: 11,
                            marginTop: 4,
                            fontStyle: 'italic',
                          }}
                        >
                          {p.status}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {s.shippedFiles && s.shippedFiles.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 8,
                  }}
                >
                  Shipped files
                </h4>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {s.shippedFiles.map((f, i) => (
                    <span
                      key={i}
                      title={f.note ? `${f.ticket} — ${f.note}` : f.ticket}
                    >
                      {fileTag(`${f.path}  (${f.ticket})`)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {s.keyFinding && (
              <div style={{ marginBottom: 16 }}>
                <h4
                  style={{
                    fontSize: 12,
                    color: '#fbbf24',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 6,
                  }}
                >
                  Key finding
                </h4>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 13,
                    lineHeight: 1.7,
                  }}
                >
                  {s.keyFinding}
                </div>
              </div>
            )}

            {s.mainLineBlocker && (
              <div
                style={{
                  marginBottom: 16,
                  padding: '10px 14px',
                  borderRadius: 6,
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: '#fca5a5',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 4,
                  }}
                >
                  Main-line blocker — {s.mainLineBlocker.label}
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 13,
                    lineHeight: 1.7,
                  }}
                >
                  {s.mainLineBlocker.description}
                </div>
                {s.mainLineBlocker.ticket && (
                  <div style={{ marginTop: 6 }}>
                    {ticketLink(s.mainLineBlocker.ticket)}
                  </div>
                )}
              </div>
            )}

            {s.openQuestions && s.openQuestions.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 6,
                  }}
                >
                  Open questions
                </h4>
                <ol
                  style={{
                    marginLeft: 20,
                    color: 'var(--text-secondary)',
                    fontSize: 12,
                    lineHeight: 1.7,
                  }}
                >
                  {s.openQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>
            )}

            {s.metaObservations && s.metaObservations.length > 0 && (
              <div>
                <h4
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 6,
                  }}
                >
                  Meta observations
                </h4>
                <ul
                  style={{
                    marginLeft: 20,
                    color: 'var(--text-secondary)',
                    fontSize: 12,
                    lineHeight: 1.7,
                  }}
                >
                  {s.metaObservations.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 8,
            color: 'var(--accent-purple)',
          }}
        >
          How this page is maintained
        </h3>
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          <p>
            Entries live in{' '}
            <code style={{ color: 'var(--accent-cyan)' }}>src/data/sessions.js</code>
            . The write-through source of truth is{' '}
            <code style={{ color: 'var(--accent-cyan)' }}>SESSIONS.md</code> at
            the repo root — edit there, then mirror to the data file. For
            per-commit detail see{' '}
            <Link to="/improvements" style={{ color: 'var(--accent-cyan)' }}>
              /improvements
            </Link>
            ; for live tickets see{' '}
            <Link to="/improvement-queue" style={{ color: 'var(--accent-cyan)' }}>
              /improvement-queue
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
