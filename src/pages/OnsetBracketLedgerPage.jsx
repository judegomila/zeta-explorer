import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { SG1C_ASYM_ONSET_BRACKET_LEDGER } from '../data/sg1c-asym-onset-bracket-ledger-2026-06-30.js';
import { SG1C_CGLO_LOWER_BOUND } from '../data/sg1c-cglo-lower-bound-2026-07-02.js';
import { SG1C_CGLO_CLOSURE } from '../data/sg1c-cglo-closure-2026-08-28.js';
import { ED, alpha } from '../styles/tokens.js';

// sg1c Asymmetric Onset Bracket Ledger — imp-3198.
// Editorial (warm) re-theme: full-width dashboard, identical structure/data.

const chip = (bg, fg, border) => ({
  display: 'inline-block',
  padding: '2px 7px',
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  background: bg,
  color: fg,
  border: `1px solid ${border}`,
});

const STATUS_COLOR = {
  'closed-form-exact':       { style: chip(alpha(ED.series3, 0.14), 'var(--green)', alpha(ED.series3, 0.4)), badge: 'exact' },
  'certified-numerical-inf': { style: chip(alpha(ED.series1, 0.14), 'var(--blue)', alpha(ED.series1, 0.4)), badge: 'certified' },
  'random-scan':             { style: chip(alpha(ED.brassDeco, 0.16), 'var(--brass-dk)', alpha(ED.brassDeco, 0.45)), badge: 'random scan' },
  'selector-artifact':       { style: chip(alpha(ED.series2, 0.14), 'var(--terra-dk)', alpha(ED.series2, 0.4)), badge: 'ARTIFACT' },
};

function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 20px',
  };
}

function StatusBadge({ status }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR['random-scan'];
  return <span style={s.style}>{s.badge}</span>;
}

function SortHeader({ label, col, sortCol, dir, onSort }) {
  const active = sortCol === col;
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        cursor: 'pointer', padding: '8px 10px', textAlign: 'left',
        background: active ? 'var(--paper3)' : 'var(--paper2)',
        color: active ? 'var(--brass-dk)' : 'var(--faint)',
        fontWeight: 600, fontSize: 12, userSelect: 'none',
        borderBottom: '1px solid var(--hairline)', whiteSpace: 'nowrap',
      }}
    >
      {label} {active ? (dir === 'asc' ? '▲' : '▼') : ''}
    </th>
  );
}

export default function OnsetBracketLedgerPage() {
  const [sortCol, setSortCol] = useState('value');
  const [sortDir, setSortDir] = useState('asc');

  const ledger = SG1C_ASYM_ONSET_BRACKET_LEDGER;
  const [lo, hi] = ledger.openBracket;

  function handleSort(col) {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  }

  const sortedRows = useMemo(() => {
    const rows = [...ledger.rows];
    rows.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      av = String(av).toLowerCase(); bv = String(bv).toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }, [ledger.rows, sortCol, sortDir]);

  const cellStyle = {
    padding: '8px 10px', borderBottom: '1px solid var(--hairline)',
    verticalAlign: 'top', fontSize: 13, color: 'var(--ink-soft)',
    lineHeight: '1.5',
  };

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>sg1c Asymmetric Onset Bracket Ledger</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760, marginBottom: 24 }}>
          imp-3198 — auditable chain of worsening-onset values that bounded the global constant c_glob,
          closed 2026-08-28 at c_glob = c_half = 0.8980208880762339 (exact closed form)
        </p>

        {/* 2026-08-28 closure */}
        <div className="card" style={{ ...cardBaseLeft('var(--green)'), marginBottom: 24 }}>
          <div style={{ color: 'var(--green)', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
            CLOSED (2026-08-28): c_glob = c_half = {SG1C_CGLO_CLOSURE.cHalfReference.toFixed(16)}
          </div>
          <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: '1.6', marginBottom: 8 }}>
            {SG1C_CGLO_CLOSURE.statement}. The universal rate bound d₁²·(dρ/ds) ≤ R(ρ) holds for every
            admissible configuration and is sharp along the one-sided half-lattice, so the ledger&apos;s bracket
            collapses to the point c_half. Every row below remains a valid upper bound consistent with the
            closed value.
          </div>
          <div style={{ color: 'var(--faint)', fontSize: 12 }}>
            Scope: {SG1C_CGLO_CLOSURE.scope} Source: src/data/sg1c-cglo-closure-2026-08-28.js
            ({SG1C_CGLO_CLOSURE.ticket}).
          </div>
        </div>

        {/* Open bracket summary */}
        <div className="card" style={{ ...cardBaseLeft('var(--blue)'), marginBottom: 24 }}>
          <div style={{ color: 'var(--blue)', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
            2026-06-30 Bracket (superseded by the 2026-08-28 closure): c_glob ∈ ({lo.toFixed(10)}, {hi.toFixed(10)})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
              <span style={{ color: 'var(--blue)', fontWeight: 600 }}>Tightest ceiling (lower end):</span>{' '}
              {lo.toFixed(7)} — certified-numerical-inf (Config B structured tune, imp-3172)
            </div>
            <div style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
              <span style={{ color: 'var(--blue)', fontWeight: 600 }}>Class-specific upper end:</span>{' '}
              {hi.toFixed(16)} — c_asym closed-form transcendental root (imp-3170)
            </div>
          </div>
          <div style={{ marginTop: 10, color: 'var(--ink-soft)', fontSize: 13 }}>
            <span style={{ color: 'var(--green)', fontWeight: 600 }}>Basin margin:</span>{' '}
            {lo.toFixed(7)} − 0.72 = {ledger.basinMargin.toFixed(7)} &gt; 0.18 — basin-conditional C_Lip holds independent of c_glob.{' '}.
          </div>
          <div style={{ marginTop: 8, color: 'var(--terra-dk)', fontSize: 12 }}>
            Status as recorded 2026-06-30: {ledger.globalConstantStatus} — superseded by the 2026-08-28
            closed form above.
          </div>
        </div>

        {/* Proven lower bound (imp-3236) — the first rigorous nontrivial lower bound on c_glob */}
        <div className="card" style={{ ...cardBaseLeft('var(--green)'), marginBottom: 24 }}>
          <div style={{ color: 'var(--green)', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
            Proven Lower Bound (imp-3236): c_glob ≥ {SG1C_CGLO_LOWER_BOUND.cLo.toFixed(10)}
          </div>
          <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: '1.6', marginBottom: 8 }}>
            First rigorous nontrivial lower bound. Exact force-difference rate{' '}
            drho/ds = −2[2/ρ + (1−ρ)/(1+ρ) − 2ρ + Σ Tₘ]; right particles destabilise, left stabilise,
            |Tₘ| decreasing in |yₘ|, so the densest one-sided right half-lattice (yₖ = 1+kρ) is the worst
            admissible config. The telescoping majorant S_dest ≤ (1+ρ)/(2+ρ) makes the rate strictly
            negative — isolation self-improves — for all ρ &lt; c_lo = {SG1C_CGLO_LOWER_BOUND.cLo.toFixed(7)}
            {' '}(the root of f(ρ) = 2/ρ + (1−ρ)/(1+ρ) − 2ρ − (1+ρ)/(2+ρ)).
          </div>
          <div style={{ color: 'var(--green)', fontSize: 13 }}>
            The interval narrowed to c_glob ∈ ({SG1C_CGLO_LOWER_BOUND.cLo.toFixed(7)},{' '}
            {SG1C_CGLO_LOWER_BOUND.locatedCeiling.toFixed(7)}] — proven lower bound to tightest located
            ceiling c_half. Exceeds the Theorem-C basin reference 0.72 by{' '}
            {SG1C_CGLO_LOWER_BOUND.exceedsBasinBy.toFixed(4)}.
          </div>
          <div style={{ marginTop: 8, color: 'var(--faint)', fontSize: 12 }}>
            Status at the time (2026-07-02): the gap ({SG1C_CGLO_LOWER_BOUND.cLo.toFixed(5)},{' '}
            {SG1C_CGLO_LOWER_BOUND.locatedCeiling.toFixed(5)}] stayed open. The 2026-08-28 closure
            (top card) evaluated this run&apos;s majorant exactly and collapsed the gap to the point c_half.
            Basin-conditional C_Lip unaffected.
          </div>
        </div>

        {/* Sortable table */}
        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>Ledger of worsening-onset values</h2>
        <div style={{ marginBottom: 8, color: 'var(--faint)', fontSize: 12 }}>
          Click column headers to sort. All rows are UPPER bounds on c_glob; none is a proven lower bound.
        </div>
        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--hairline)', marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
            <thead>
              <tr>
                <SortHeader label="Onset value" col="value" sortCol={sortCol} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Config class" col="configClass" sortCol={sortCol} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Derivation" col="derivation" sortCol={sortCol} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Rigor status" col="status" sortCol={sortCol} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Bounds c_glob?" col="boundsGlobal" sortCol={sortCol} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Ticket" col="ticket" sortCol={sortCol} dir={sortDir} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, i) => (
                <tr key={row.ticket + i} style={{ background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper2)' }}>
                  <td style={{ ...cellStyle, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--terra-dk)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {typeof row.value === 'number' ? row.value.toFixed(10) : String(row.value)}
                  </td>
                  <td style={{ ...cellStyle, maxWidth: 260 }}>{row.configClass}</td>
                  <td style={{ ...cellStyle, maxWidth: 320, color: 'var(--faint)', fontSize: 12 }}>{row.derivation}</td>
                  <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>
                    <StatusBadge status={row.status} />
                  </td>
                  <td style={{ ...cellStyle, color: 'var(--green)', fontSize: 12, maxWidth: 220 }}>{row.boundsGlobal}</td>
                  <td style={{ ...cellStyle, color: 'var(--faint)', fontSize: 12, whiteSpace: 'nowrap' }}>{row.ticket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selector artifacts — imp-3304 audit: confirmed NO page in src/pages renders these as valid c_glob bounds */}
        <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), marginBottom: 24 }}>
          <div style={{ color: 'var(--terra-dk)', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            Selector Artifacts — NOT valid c_glob bounds
          </div>
          <div style={{ color: 'var(--ink-soft)', fontSize: 12, marginBottom: 12 }}>
            These values look like worsening-onset roots but are minimal-gap selector index discontinuities (ties/flips).
            They do NOT correspond to smooth drho/ds zeros and must not be cited as bounds on c_glob.
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Value', 'What it is', 'Ticket'].map(h => (
                    <th key={h} style={{
                      padding: '6px 10px', textAlign: 'left', background: 'var(--paper3)',
                      color: 'var(--terra-dk)', fontWeight: 600, fontSize: 12, borderBottom: '1px solid var(--hairline)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ledger.selectorArtifacts.map((a, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper2)' }}>
                    <td style={{ ...cellStyle, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--terra-dk)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {a.value.toFixed(7)}
                    </td>
                    <td style={{ ...cellStyle, color: 'var(--ink-soft)', fontSize: 12, maxWidth: 500 }}>{a.whatItIs}</td>
                    <td style={{ ...cellStyle, color: 'var(--terra-dk)', fontSize: 12, whiteSpace: 'nowrap' }}>{a.ticket}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status legend */}
        <div className="card" style={{ ...cardBaseLeft('var(--hairline)'), marginBottom: 24 }}>
          <div style={{ color: 'var(--ink-soft)', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Rigor Status Legend</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {Object.entries(STATUS_COLOR).map(([k, s]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StatusBadge status={k} />
                <span style={{ color: 'var(--faint)', fontSize: 12 }}>{k.replace(/-/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verdict */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass-dk)'), marginBottom: 24 }}>
          <div style={{ color: 'var(--ink-soft)', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Full Verdict</div>
          <div style={{ color: 'var(--faint)', fontSize: 12, lineHeight: '1.7' }}>{ledger.verdict}</div>
        </div>

        {/* Cross links */}
        <div className="card" style={cardBaseLeft('var(--brass)')}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/spectral-attack" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Spectral Approach
            </Link>
            <Link to="/theta-static-obstruction" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Theta Static Obstruction
            </Link>
            <Link to="/theta-basin-closure" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Theta Basin Closure
            </Link>
            <Link to="/" style={{ fontSize: 12, color: 'var(--terra-dk)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
