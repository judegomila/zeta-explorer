// RHEquivalentsPage.jsx -- imp-1191
// Companion page rendering the imp-1119 RH_EQUIVALENTS catalog.
// Each entry: name, statement, equivalence direction, year, reference,
// our-relation, related tickets. Pure rendering. Tripwires live in
// src/data/rh-equivalents-reference.js (imp-1119).
//
// Editorial (warm) re-theme: full-width shell, identical structure/data/content.
// Filter/sort bar, all statements, references, our-relation notes, and ticket
// tags are preserved verbatim.

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { RH_EQUIVALENTS } from '../data/rh-equivalents-reference.js';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import EquivalenceVsReductionCallout from '../components/EquivalenceVsReductionCallout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED, alpha } from '../styles/tokens.js';

const mono = 'var(--ed-mono, var(--font-mono))';

const DIRECTION_BADGE = {
  'both': { label: 'iff RH', color: 'var(--green)', bg: alpha(ED.series3, 0.12) },
  'S=>RH': { label: 'S => RH', color: 'var(--blue)', bg: alpha(ED.series1, 0.12) },
  'RH=>S': { label: 'RH => S', color: 'var(--brass-dk)', bg: alpha(ED.brassDeco, 0.14) },
};

export default function RHEquivalentsPage() {
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('year-asc');

  const filtered = useMemo(() => {
    let list = RH_EQUIVALENTS;
    if (filter !== 'all') {
      list = list.filter((e) => e.direction === filter);
    }
    const sorted = [...list];
    if (sortOrder === 'year-asc') sorted.sort((a, b) => a.year - b.year);
    else if (sortOrder === 'year-desc') sorted.sort((a, b) => b.year - a.year);
    else if (sortOrder === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [filter, sortOrder]);

  const countAll = RH_EQUIVALENTS.length;
  const countBoth = RH_EQUIVALENTS.filter((e) => e.direction === 'both').length;
  const countSimpliesRH = RH_EQUIVALENTS.filter((e) => e.direction === 'S=>RH').length;
  const countRHImpliesS = RH_EQUIVALENTS.filter((e) => e.direction === 'RH=>S').length;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <HonestCeilingBanner variant="RH-EQUIVALENT" />

        <div style={{ marginTop: 12, marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>RH Equivalents — Catalog</h1>
          <AnimationEmbed id="rh-equivalents" />
          <p style={{ fontFamily: mono, color: 'var(--ink-soft)', fontSize: 14 }}>
            Statements provably equivalent to the Riemann Hypothesis (imp-1119 / imp-1191)
          </p>
        </div>

        {/* ─── Intro card ─── */}
        <div className="card" style={{ marginTop: 12 }}>
          <h3 style={{ color: 'var(--blue)', marginBottom: 8 }}>What this page contains</h3>
          <p
            style={{
              color: 'var(--ink-soft)',
              fontSize: 14,
              lineHeight: 1.75,
            }}
          >
            A curated catalog of {countAll} statements either equivalent to RH or one-way
            implication-related to RH. Each entry pins the precise statement, the direction
            of implication, the principal published reference, and how (if at all) the
            Twin Ladder Explorer project relates to it.
          </p>
          <p
            style={{
              marginTop: 12,
              color: 'var(--ink-soft)',
              fontSize: 13,
              lineHeight: 1.75,
            }}
          >
            The <strong style={{ color: 'var(--green)' }}>de Bruijn–Newman Λ = 0</strong> equivalent
            is the project anchor statement. Since Rodgers–Tao 2020 proved Λ ≥ 0, the statement
            Λ ≤ 0 is itself equivalent to RH — there is no route that targets it as an intermediate
            step, and the <Link to="/flow-blindness-no-go">flow-blindness no-go</Link> rules out
            reaching Λ ≤ 0 by soft (arithmetic-free) methods. What the program produces are finite
            upper-bound candidates — Λ ≤ 0.1787854 and Λ ≤ 0.1758354 (computer-assisted,
            unrefereed) — and a conditional{' '}
            <Link to="/permutation-architecture">Λ ≤ 0.14 completion contract</Link> (a contract,
            not a bound).
          </p>
        </div>

        <EquivalenceVsReductionCallout />

        {/* ─── Filter / sort bar ─── */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 18,
            marginBottom: 16,
            color: 'var(--faint)',
            fontSize: 13,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span>{countAll} equivalents</span>
          <span>|</span>
          <span style={{ color: 'var(--green)' }}>{countBoth} both-way</span>
          <span>|</span>
          <span style={{ color: 'var(--blue)' }}>{countSimpliesRH} S=&gt;RH only</span>
          <span>|</span>
          <span style={{ color: 'var(--brass-dk)' }}>{countRHImpliesS} RH=&gt;S only</span>
          <span>|</span>
          <span>Showing {filtered.length}</span>
          <span
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ color: 'var(--ink-soft)' }}>Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--hairline)',
                borderRadius: 6,
                color: 'var(--ink-soft)',
                fontSize: 12,
                padding: '3px 8px',
                cursor: 'pointer',
              }}
            >
              <option value="year-asc">Year (oldest first)</option>
              <option value="year-desc">Year (newest first)</option>
              <option value="name-asc">Name (A–Z)</option>
            </select>
          </span>
        </div>

        <div className="filter-bar">
          {[
            { id: 'all', label: `All (${countAll})` },
            { id: 'both', label: `Both-way (${countBoth})` },
            { id: 'S=>RH', label: `S=>RH (${countSimpliesRH})` },
            { id: 'RH=>S', label: `RH=>S (${countRHImpliesS})` },
          ].map((opt) => (
            <button
              key={opt.id}
              className={`filter-btn ${filter === opt.id ? 'active' : ''}`}
              onClick={() => setFilter(opt.id)}
              aria-pressed={filter === opt.id}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ─── Equivalent cards ─── */}
        <div className="card-grid" style={{ marginTop: 16 }}>
          {filtered.map((eq) => {
            const badge =
              DIRECTION_BADGE[eq.direction] || {
                label: eq.direction,
                color: 'var(--faint)',
                bg: alpha(ED.inkFaint, 0.12),
              };
            return (
              <div key={eq.name} className="ref-card">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div className="ref-title" style={{ flex: 1 }}>
                    {eq.name}
                  </div>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 4,
                      color: badge.color,
                      background: badge.bg,
                      border: `1px solid ${badge.color}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
                <div className="ref-authors" style={{ marginTop: 6 }}>
                  Year: {eq.year}
                </div>

                <div className="ref-summary" style={{ marginTop: 10 }}>
                  {eq.statement}
                </div>

                <div
                  className="ref-insight"
                  style={{
                    marginTop: 10,
                    padding: '8px 10px',
                    borderLeft: '2px solid var(--hairline)',
                    background: 'var(--paper)',
                  }}
                >
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    <strong style={{ color: 'var(--brass-dk)' }}>Reference: </strong>
                    {eq.reference}
                  </p>
                </div>

                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 12, color: 'var(--faint)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--blue)' }}>Our relation: </strong>
                    {eq.ourRelation}
                  </p>
                </div>

                {eq.relatedTickets.length > 0 && (
                  <div
                    className="tags-row"
                    style={{ marginTop: 10, flexWrap: 'wrap' }}
                  >
                    {eq.relatedTickets.map((t) => (
                      <span
                        key={t}
                        className="tag tag-blue"
                        style={{ fontFamily: mono }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Related pages ─── */}
        <div
          className="card"
          style={{ marginTop: 24, background: 'var(--paper2)' }}
        >
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>
            Related pages
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link to="/selberg-trace" style={{ color: 'var(--green)', fontSize: 13 }}>
              Selberg trace formula
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/lambda-bounds" style={{ color: 'var(--blue)', fontSize: 13 }}>
              Λ bounds &amp; RH roadmap
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/lambda-timeline" style={{ color: 'var(--brass)', fontSize: 13 }}>
              Λ timeline
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/literature" style={{ color: 'var(--blue)', fontSize: 13 }}>
              Literature database
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/full-story" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>
              Full project story
            </Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
