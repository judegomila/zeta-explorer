// RHEquivalentsPage.jsx -- imp-1191
// Companion page rendering the imp-1119 RH_EQUIVALENTS catalog.
// Each entry: name, statement, equivalence direction, year, reference,
// our-relation, related tickets. Pure rendering. Tripwires live in
// src/data/rh-equivalents-reference.js (imp-1119).

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RH_EQUIVALENTS } from '../data/rh-equivalents-reference.js';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import EquivalenceVsReductionCallout from '../components/EquivalenceVsReductionCallout.jsx';

const mono = 'var(--font-mono)';

const DIRECTION_BADGE = {
  'both': { label: 'iff RH', color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  'S=>RH': { label: 'S => RH', color: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
  'RH=>S': { label: 'RH => S', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
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
    <div className="page">
      <HonestCeilingBanner variant="RH-EQUIVALENT" />
      <div className="page-header">
        <h1>RH Equivalents — Catalog</h1>
        <p
          className="page-subtitle"
          style={{ fontFamily: mono, color: 'var(--text-secondary)' }}
        >
          Statements provably equivalent to the Riemann Hypothesis (imp-1119 / imp-1191)
        </p>
      </div>

      {/* ─── Intro card ─── */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ color: '#06b6d4', marginBottom: 8 }}>What this page contains</h3>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 14,
            lineHeight: 1.75,
          }}
        >
          A curated catalog of {countAll} statements either equivalent to RH or one-way
          implication-related to RH. Each entry pins the precise statement, the direction
          of implication, the principal published reference, and how (if at all) the
          mathexplorer project relates to it.
        </p>
        <p
          style={{
            marginTop: 12,
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          The <strong style={{ color: '#10b981' }}>de Bruijn–Newman Λ = 0</strong> equivalent
          is the project anchor — the entire Λ-attack chain (Routes A/B/C) targets
          Λ ≤ 0 unconditionally, which combined with Rodgers–Tao 2020 (Λ ≥ 0) yields RH.
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
          color: '#64748b',
          fontSize: 13,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span>{countAll} equivalents</span>
        <span>|</span>
        <span style={{ color: '#10b981' }}>{countBoth} both-way</span>
        <span>|</span>
        <span style={{ color: '#3b82f6' }}>{countSimpliesRH} S=&gt;RH only</span>
        <span>|</span>
        <span style={{ color: '#f59e0b' }}>{countRHImpliesS} RH=&gt;S only</span>
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
          <span style={{ color: '#475569' }}>Sort:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(100,116,139,0.4)',
              borderRadius: 6,
              color: '#94a3b8',
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
              color: '#94a3b8',
              bg: 'rgba(148,163,184,0.10)',
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
                  borderLeft: '2px solid #475569',
                  background: 'rgba(15,23,42,0.5)',
                }}
              >
                <p style={{ fontSize: 12, color: '#cbd5e1' }}>
                  <strong style={{ color: '#fbbf24' }}>Reference: </strong>
                  {eq.reference}
                </p>
              </div>

              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
                  <strong style={{ color: '#60a5fa' }}>Our relation: </strong>
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
        style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}
      >
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>
          Related pages
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/selberg-trace" style={{ color: '#10b981', fontSize: 13 }}>
            Selberg trace formula
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/lambda-bounds" style={{ color: '#06b6d4', fontSize: 13 }}>
            Λ bounds & RH roadmap
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/lambda-timeline" style={{ color: '#a855f7', fontSize: 13 }}>
            Λ timeline
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/literature" style={{ color: '#3b82f6', fontSize: 13 }}>
            Literature database
          </Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/full-story" style={{ color: '#f59e0b', fontSize: 13 }}>
            Full project story
          </Link>
        </div>
      </div>
    </div>
  );
}
