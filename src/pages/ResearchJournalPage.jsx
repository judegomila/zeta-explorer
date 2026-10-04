import React from 'react';
import { Link } from 'react-router-dom';
import { SESSIONS } from '../data/sessions.js';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED, alpha } from '../styles/tokens.js';

// Research Journal — coarse-grained session narratives of the RH Λ approach.
// Read interface for src/data/sessions.js (SESSIONS.md is the write-through).
// Companion to:
//   /improvements       — per-commit improvement log
//   /improvement-queue  — live task list
// Editorial (warm) re-theme: full-width dashboard, identical structure/data.

const mono = 'var(--ed-mono, var(--font-mono))';

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

const sessionChip = {
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: 10,
  fontSize: 10,
  fontFamily: mono,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  background: alpha(ED.brassDeco, 0.14),
  color: 'var(--brass-dk)',
  border: '1px solid color-mix(in srgb, var(--brass-deco) 40%, transparent)',
};

function ticketLink(id) {
  return (
    <Link
      key={id}
      to="/improvement-queue"
      style={{
        fontFamily: mono,
        fontSize: 11,
        padding: '2px 8px',
        borderRadius: 4,
        background: 'var(--paper)',
        color: 'var(--brass)',
        border: '1px solid var(--hairline)',
        textDecoration: 'none',
        marginRight: 4,
        marginBottom: 4,
        display: 'inline-block',
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
        fontFamily: mono,
        fontSize: 11,
        padding: '2px 8px',
        borderRadius: 4,
        background: 'var(--paper)',
        color: 'var(--blue)',
        border: '1px solid var(--hairline)',
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
      <div className="ed-root">
        <EditorialHeader />
        <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
          <h1 className="ed-h1" style={{ marginBottom: 16 }}>Research Journal</h1>
          <div
            style={{
              color: 'var(--faint)',
              textAlign: 'center',
              padding: '60px 0',
              fontFamily: mono,
              fontSize: 14,
            }}
          >
            No sessions recorded yet. Add entries to <code>src/data/sessions.js</code>.
          </div>
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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Research Journal</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Coarse-grained journal of early work sessions on the Riemann
            Hypothesis Λ bound approach — one entry per session, {SESSIONS.length}{' '}
            entries total, last updated {reversed[0].date}. Journaling was
            superseded by the ticket queue, so these entries are a dated
            record, not the live context: the blockers they name (e.g. C_H
            closure) have since been reclassified or closed as no-gos. For
            current context use{' '}
            <Link to="/state-of-program" style={{ color: 'var(--blue)' }}>
              /state-of-program
            </Link>
            {' and '}
            <Link to="/permutation-architecture" style={{ color: 'var(--blue)' }}>
              /permutation-architecture
            </Link>
            . See also{' '}
            <Link to="/improvements" style={{ color: 'var(--blue)' }}>
              per-commit improvements
            </Link>
            {' · '}
            <Link to="/improvement-queue" style={{ color: 'var(--blue)' }}>
              live task queue
            </Link>
            .
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 14px',
            borderRadius: 6,
            marginBottom: 20,
            background: 'var(--paper2)',
            border: '1px solid var(--hairline)',
            fontSize: 11,
            fontFamily: mono,
            color: 'var(--faint)',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ color: 'var(--brass-dk)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Data snapshot
          </span>
          <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>{reversed[0].date}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>latest session date; build-time snapshot</span>
        </div>

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
                background: 'var(--paper2)',
                border: '1px solid var(--hairline)',
                minWidth: 100,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--brass-dk)',
                  fontFamily: mono,
                  lineHeight: 1.2,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--faint)',
                  fontFamily: mono,
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
            <div key={s.id} className="card" style={cardBaseLeft('var(--brass-dk)')}>
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
                    fontFamily: mono,
                    fontSize: 12,
                    color: 'var(--faint)',
                  }}
                >
                  {s.date}
                </span>
                <span style={sessionChip}>Session</span>
              </div>

              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--ink)' }}>
                {s.title}
              </h2>

              {s.lambdaHeadline && (
                <div
                  style={{
                    marginBottom: 16,
                    padding: '10px 14px',
                    borderRadius: 6,
                    background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--brass-deco) 30%, transparent)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--faint)',
                      fontFamily: mono,
                      marginBottom: 4,
                    }}
                  >
                    Λ headline (start → end)
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 13,
                      color: 'var(--brass-dk)',
                    }}
                  >
                    {s.lambdaHeadline.start} → {s.lambdaHeadline.end}
                  </div>
                  <div
                    style={{
                      color: 'var(--ink-soft)',
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
                        color: 'var(--faint)',
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
                      color: 'var(--faint)',
                      fontFamily: mono,
                      marginBottom: 4,
                    }}
                  >
                    Engine state at start
                  </div>
                  <div
                    style={{
                      color: 'var(--ink-soft)',
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
                      color: 'var(--faint)',
                      fontFamily: mono,
                      marginBottom: 4,
                    }}
                  >
                    Engine state at end
                  </div>
                  <div
                    style={{
                      color: 'var(--ink-soft)',
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
                      color: 'var(--faint)',
                      fontFamily: mono,
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
                          background: 'var(--paper)',
                          border: '1px solid var(--hairline)',
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
                              color: 'var(--brass-dk)',
                            }}
                          >
                            {p.phase}
                          </span>
                          {p.ids.map(ticketLink)}
                        </div>
                        <div
                          style={{
                            color: 'var(--ink-soft)',
                            fontSize: 12,
                            lineHeight: 1.6,
                          }}
                        >
                          {p.summary}
                        </div>
                        {p.status && (
                          <div
                            style={{
                              color: 'var(--faint)',
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
                      color: 'var(--faint)',
                      fontFamily: mono,
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
                      color: 'var(--brass)',
                      fontFamily: mono,
                      marginBottom: 6,
                    }}
                  >
                    Key finding
                  </h4>
                  <div
                    style={{
                      color: 'var(--ink-soft)',
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
                    background: 'color-mix(in srgb, var(--series-2) 8%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--terra-dk)',
                      fontFamily: mono,
                      marginBottom: 4,
                    }}
                  >
                    Main-line blocker — {s.mainLineBlocker.label}
                  </div>
                  <div
                    style={{
                      color: 'var(--ink-soft)',
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
                      color: 'var(--faint)',
                      fontFamily: mono,
                      marginBottom: 6,
                    }}
                  >
                    Open questions
                  </h4>
                  <ol
                    style={{
                      marginLeft: 20,
                      color: 'var(--ink-soft)',
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
                      color: 'var(--faint)',
                      fontFamily: mono,
                      marginBottom: 6,
                    }}
                  >
                    Meta observations
                  </h4>
                  <ul
                    style={{
                      marginLeft: 20,
                      color: 'var(--ink-soft)',
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

        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginTop: 24 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 8,
              color: 'var(--brass-dk)',
            }}
          >
            How this page is maintained
          </h3>
          <div
            style={{
              color: 'var(--ink-soft)',
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            <p>
              Entries live in{' '}
              <code style={{ color: 'var(--blue)' }}>src/data/sessions.js</code>
              . The write-through source of truth is{' '}
              <code style={{ color: 'var(--blue)' }}>SESSIONS.md</code> at
              the repo root — edit there, then mirror to the data file. For
              per-commit detail see{' '}
              <Link to="/improvements" style={{ color: 'var(--blue)' }}>
                /improvements
              </Link>
              ; for live tickets see{' '}
              <Link to="/improvement-queue" style={{ color: 'var(--blue)' }}>
                /improvement-queue
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--brass)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/improvements" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Per-commit improvements log
            </Link>
            <Link to="/improvement-queue" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Live improvement queue
            </Link>
            <Link to="/lambda-bounds" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Λ Bounds &amp; RH Roadmap
            </Link>
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/">← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
