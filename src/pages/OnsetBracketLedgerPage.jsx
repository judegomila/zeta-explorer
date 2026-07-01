import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { SG1C_ASYM_ONSET_BRACKET_LEDGER } from '../data/sg1c-asym-onset-bracket-ledger-2026-06-30.js';

const STATUS_COLOR = {
  'closed-form-exact':       { bg: '#052e16', border: '#166534', text: '#86efac', badge: 'exact' },
  'certified-numerical-inf': { bg: '#082f49', border: '#0369a1', text: '#7dd3fc', badge: 'certified' },
  'random-scan':             { bg: '#2d2206', border: '#854d0e', text: '#fde68a', badge: 'random scan' },
  'selector-artifact':       { bg: '#3b0000', border: '#991b1b', text: '#fca5a5', badge: 'ARTIFACT' },
};

function StatusBadge({ status }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR['random-scan'];
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: 4,
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {s.badge}
    </span>
  );
}

function SortHeader({ label, col, sortCol, dir, onSort }) {
  const active = sortCol === col;
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        cursor: 'pointer', padding: '8px 10px', textAlign: 'left',
        background: active ? '#1e3a5f' : '#0f172a',
        color: active ? '#93c5fd' : '#94a3b8',
        fontWeight: 600, fontSize: 12, userSelect: 'none',
        borderBottom: '1px solid #1e293b', whiteSpace: 'nowrap',
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
    padding: '8px 10px', borderBottom: '1px solid #1e293b',
    verticalAlign: 'top', fontSize: 13, color: '#cbd5e1',
    lineHeight: '1.5',
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px', fontFamily: 'sans-serif' }}>
      <PageHeader
        title="sg1c Asymmetric Onset Bracket Ledger"
        subtitle="imp-3198 — auditable chain of worsening-onset values bounding the open global constant c_glob"
      />

      {/* Open bracket summary */}
      <div style={{
        background: '#0c1628', border: '1px solid #1e3a5f', borderRadius: 8,
        padding: '16px 20px', marginBottom: 24,
      }}>
        <div style={{ color: '#93c5fd', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
          Open Bracket: c_glob ∈ ({lo.toFixed(10)}, {hi.toFixed(10)})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ color: '#94a3b8', fontSize: 13 }}>
            <span style={{ color: '#7dd3fc', fontWeight: 600 }}>Tightest ceiling (lower end):</span>{' '}
            {lo.toFixed(7)} — certified-numerical-inf (Config B structured tune, imp-3172)
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13 }}>
            <span style={{ color: '#7dd3fc', fontWeight: 600 }}>Class-specific upper end:</span>{' '}
            {hi.toFixed(16)} — c_asym closed-form transcendental root (imp-3170)
          </div>
        </div>
        <div style={{ marginTop: 10, color: '#94a3b8', fontSize: 13 }}>
          <span style={{ color: '#86efac', fontWeight: 600 }}>Basin margin:</span>{' '}
          {lo.toFixed(7)} − 0.72 = {ledger.basinMargin.toFixed(7)} &gt; 0.18 — basin-conditional C_Lip holds independent of c_glob.{' '}
          PT Λ ≤ 0.2 remains SOTA.
        </div>
        <div style={{ marginTop: 8, color: '#f87171', fontSize: 12 }}>
          {ledger.globalConstantStatus}
        </div>
      </div>

      {/* Sortable table */}
      <div style={{ marginBottom: 8, color: '#64748b', fontSize: 12 }}>
        Click column headers to sort. All rows are UPPER bounds on c_glob; none is a proven lower bound.
      </div>
      <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #1e293b', marginBottom: 32 }}>
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
              <tr key={row.ticket + i} style={{ background: i % 2 === 0 ? '#0a1628' : '#0d1f38' }}>
                <td style={{ ...cellStyle, fontFamily: 'monospace', color: '#f0abfc', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {typeof row.value === 'number' ? row.value.toFixed(10) : String(row.value)}
                </td>
                <td style={{ ...cellStyle, maxWidth: 260 }}>{row.configClass}</td>
                <td style={{ ...cellStyle, maxWidth: 320, color: '#94a3b8', fontSize: 12 }}>{row.derivation}</td>
                <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>
                  <StatusBadge status={row.status} />
                </td>
                <td style={{ ...cellStyle, color: '#a3e635', fontSize: 12, maxWidth: 220 }}>{row.boundsGlobal}</td>
                <td style={{ ...cellStyle, color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{row.ticket}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selector artifacts */}
      <div style={{
        background: '#1a0000', border: '1px solid #7f1d1d', borderRadius: 8,
        padding: '16px 20px', marginBottom: 24,
      }}>
        <div style={{ color: '#f87171', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
          Selector Artifacts — NOT valid c_glob bounds
        </div>
        <div style={{ color: '#fca5a5', fontSize: 12, marginBottom: 12 }}>
          These values look like worsening-onset roots but are minimal-gap selector index discontinuities (ties/flips).
          They do NOT correspond to smooth drho/ds zeros and must not be cited as bounds on c_glob.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Value', 'What it is', 'Ticket'].map(h => (
                  <th key={h} style={{
                    padding: '6px 10px', textAlign: 'left', background: '#300000',
                    color: '#f87171', fontWeight: 600, fontSize: 12, borderBottom: '1px solid #7f1d1d',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledger.selectorArtifacts.map((a, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#1a0000' : '#200000' }}>
                  <td style={{ ...cellStyle, fontFamily: 'monospace', color: '#fca5a5', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {a.value.toFixed(7)}
                  </td>
                  <td style={{ ...cellStyle, color: '#fca5a5', fontSize: 12, maxWidth: 500 }}>{a.whatItIs}</td>
                  <td style={{ ...cellStyle, color: '#f87171', fontSize: 12, whiteSpace: 'nowrap' }}>{a.ticket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status legend */}
      <div style={{
        background: '#0a1628', border: '1px solid #1e293b', borderRadius: 8,
        padding: '14px 18px', marginBottom: 24,
      }}>
        <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Rigor Status Legend</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {Object.entries(STATUS_COLOR).map(([k, s]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StatusBadge status={k} />
              <span style={{ color: '#64748b', fontSize: 12 }}>{k.replace(/-/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verdict */}
      <div style={{
        background: '#0a1628', border: '1px solid #1e293b', borderRadius: 8,
        padding: '14px 18px', marginBottom: 24,
      }}>
        <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Full Verdict</div>
        <div style={{ color: '#64748b', fontSize: 12, lineHeight: '1.7' }}>{ledger.verdict}</div>
      </div>

      <div style={{ color: '#334155', fontSize: 12 }}>
        Cross-links:{' '}
        <Link to="/spectral-attack" style={{ color: '#475569' }}>Spectral Attack</Link>
        {' · '}
        <Link to="/theta-static-obstruction" style={{ color: '#475569' }}>Theta Static Obstruction</Link>
        {' · '}
        <Link to="/theta-basin-closure" style={{ color: '#475569' }}>Theta Basin Closure</Link>
      </div>
    </div>
  );
}
