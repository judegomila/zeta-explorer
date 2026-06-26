import React, { useState, useMemo } from 'react';
import lmfdbCrossReference, { assertIntegrity, DATA_AS_OF, lmfdbUrl } from '../data/lmfdb-l-function-cross-reference.js';

const SORT_KEYS = [
  { key: 'degree', label: 'Degree' },
  { key: 'conductor', label: 'Conductor' },
  { key: 'weight', label: 'Weight' },
  { key: 'name', label: 'Name' },
  { key: 'firstZero', label: 'First Zero' },
];

const DEGREE_COLORS = {
  1: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.4)', text: '#a5b4fc' },
  2: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.4)', text: '#86efac' },
  3: { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.4)', text: '#facc15' },
  4: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.4)', text: '#fca5a5' },
};

function degreeColor(d) {
  return DEGREE_COLORS[d] || { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.4)', text: '#94a3b8' };
}

function DegreeBadge({ degree }) {
  const c = degreeColor(degree);
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 10,
      fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      d={degree}
    </span>
  );
}

function SignBadge({ sign }) {
  const isPos = sign === 1;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 6,
      fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
      background: isPos ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      color: isPos ? '#86efac' : '#fca5a5',
      border: `1px solid ${isPos ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
    }}>
      {isPos ? '+1' : '-1'}
    </span>
  );
}

function ZerosList({ zeros }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {zeros.map((z, i) => (
        <span key={i} style={{
          fontFamily: 'var(--font-mono)', fontSize: 12,
          padding: '2px 8px', borderRadius: 4,
          background: 'var(--bg-primary)', border: '1px solid var(--border)',
          color: z === 0 ? '#f87171' : 'var(--text-secondary)',
          fontWeight: z === 0 ? 700 : 400,
        }}>
          {z.toFixed(6)}
        </span>
      ))}
    </div>
  );
}

function DetailCard({ entry, onClose }) {
  return (
    <div style={{
      marginTop: 8, padding: 20, borderRadius: 10,
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#a855f7', marginBottom: 4 }}>
            {entry.label}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            {entry.name}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {entry.lFunction}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a
            href={lmfdbUrl(entry.label)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: '1px solid rgba(6,182,212,0.4)', borderRadius: 6,
              color: '#67e8f9', textDecoration: 'none', padding: '4px 10px',
              fontFamily: 'var(--font-mono)', fontSize: 11,
            }}
          >
            View on LMFDB &#8599;
          </a>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 6,
            color: 'var(--text-muted)', cursor: 'pointer', padding: '4px 10px',
            fontFamily: 'var(--font-mono)', fontSize: 11,
          }}>
            close
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
        {[
          ['Degree', <DegreeBadge key="d" degree={entry.degree} />],
          ['Weight', <span key="w" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{entry.weight}</span>],
          ['Conductor', <span key="c" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{entry.conductor}</span>],
          ['Sign of FE', <SignBadge key="s" sign={entry.signOfFunctionalEquation} />],
          ['Gamma shifts', <span key="g" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>[{entry.gammaShifts.join(', ')}]</span>],
        ].map(([label, val]) => (
          <div key={label} style={{ padding: 10, borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
            {val}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', marginBottom: 6 }}>
          First 5 nontrivial zeros (Im)
        </div>
        <ZerosList zeros={entry.firstFiveZeros} />
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', marginBottom: 12 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: '#c084fc', marginBottom: 4 }}>GRH Note</div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>{entry.grhNote}</div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: '#67e8f9', marginBottom: 4 }}>ZPO Connection</div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>{entry.zpoConnection}</div>
      </div>
    </div>
  );
}

function IntegrityPanel() {
  const result = useMemo(() => {
    try {
      return assertIntegrity();
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  return (
    <div style={{
      padding: 12, borderRadius: 8, marginBottom: 24,
      background: result.ok ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
      border: `1px solid ${result.ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontSize: 14 }}>{result.ok ? '✓' : '✗'}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: result.ok ? '#86efac' : '#fca5a5' }}>
        {result.ok
          ? `Integrity OK: ${result.checked} entries, ${result.assertions} assertions passed`
          : `Integrity FAILED: ${result.error}`}
      </span>
      <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
        Data verified as of {DATA_AS_OF} &middot;{' '}
        <a
          href="https://www.lmfdb.org/L"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#67e8f9', textDecoration: 'none' }}
        >
          LMFDB L-functions &#8599;
        </a>
      </span>
    </div>
  );
}

export default function LmfdbCrossReferencePage() {
  const [sortKey, setSortKey] = useState('degree');
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedLabel, setExpandedLabel] = useState(null);
  const [filterDegree, setFilterDegree] = useState(null);

  const degrees = useMemo(() => {
    const s = new Set(lmfdbCrossReference.map(e => e.degree));
    return [...s].sort((a, b) => a - b);
  }, []);

  const sorted = useMemo(() => {
    const arr = [...lmfdbCrossReference];
    if (filterDegree !== null) {
      const filtered = arr.filter(e => e.degree === filterDegree);
      filtered.sort((a, b) => {
        const va = sortKey === 'firstZero' ? a.firstFiveZeros[0] : sortKey === 'name' ? a.name : a[sortKey];
        const vb = sortKey === 'firstZero' ? b.firstFiveZeros[0] : sortKey === 'name' ? b.name : b[sortKey];
        if (typeof va === 'string') return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        return sortAsc ? va - vb : vb - va;
      });
      return filtered;
    }
    arr.sort((a, b) => {
      const va = sortKey === 'firstZero' ? a.firstFiveZeros[0] : sortKey === 'name' ? a.name : a[sortKey];
      const vb = sortKey === 'firstZero' ? b.firstFiveZeros[0] : sortKey === 'name' ? b.name : b[sortKey];
      if (typeof va === 'string') return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortAsc ? va - vb : vb - va;
    });
    return arr;
  }, [sortKey, sortAsc, filterDegree]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>LMFDB L-function Cross-Reference</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 720 }}>
          {lmfdbCrossReference.length} curated L-functions from the LMFDB, spanning degrees 1-4
          plus the Ramanujan Delta function. Each entry carries the Bober-Sutherland label,
          first five nontrivial zeros, GRH status, and its connection to the ZPO ladder-network model.
        </p>
      </div>

      <IntegrityPanel />

      {/* Degree filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          onClick={() => setFilterDegree(null)}
          style={{
            padding: '4px 14px', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
            background: filterDegree === null ? 'rgba(168,85,247,0.2)' : 'var(--bg-secondary)',
            color: filterDegree === null ? '#c084fc' : 'var(--text-muted)',
            border: `1px solid ${filterDegree === null ? 'rgba(168,85,247,0.4)' : 'var(--border)'}`,
          }}
        >
          All ({lmfdbCrossReference.length})
        </button>
        {degrees.map(d => {
          const count = lmfdbCrossReference.filter(e => e.degree === d).length;
          const c = degreeColor(d);
          const active = filterDegree === d;
          return (
            <button
              key={d}
              onClick={() => setFilterDegree(active ? null : d)}
              style={{
                padding: '4px 14px', borderRadius: 8, cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                background: active ? c.bg : 'var(--bg-secondary)',
                color: active ? c.text : 'var(--text-muted)',
                border: `1px solid ${active ? c.border : 'var(--border)'}`,
              }}
            >
              Degree {d} ({count})
            </button>
          );
        })}
      </div>

      {/* Sort controls */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>
          Sort by:
        </span>
        {SORT_KEYS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            style={{
              padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              background: sortKey === key ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)',
              color: sortKey === key ? '#a5b4fc' : 'var(--text-muted)',
              border: `1px solid ${sortKey === key ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
            }}
          >
            {label} {sortKey === key ? (sortAsc ? '↑' : '↓') : ''}
          </button>
        ))}
      </div>

      {/* L-function list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(entry => {
          const isExpanded = expandedLabel === entry.label;
          return (
            <div key={entry.label}>
              <div
                onClick={() => setExpandedLabel(isExpanded ? null : entry.label)}
                style={{
                  padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                  background: isExpanded ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                  border: `1px solid ${isExpanded ? 'rgba(168,85,247,0.3)' : 'var(--border)'}`,
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr auto',
                  alignItems: 'center', gap: 16,
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                <DegreeBadge degree={entry.degree} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {entry.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    {entry.label}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                      N={entry.conductor}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                      w={entry.weight}
                    </div>
                  </div>
                  <SignBadge sign={entry.signOfFunctionalEquation} />
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)',
                    minWidth: 80, textAlign: 'right',
                  }}>
                    z1={entry.firstFiveZeros[0].toFixed(2)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    &#9662;
                  </span>
                </div>
              </div>
              {isExpanded && (
                <DetailCard entry={entry} onClose={() => setExpandedLabel(null)} />
              )}
            </div>
          );
        })}
      </div>

      {/* Tripwires */}
      <div style={{ marginTop: 32, padding: 16, borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>
          Tripwires
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <div data-tripwire="lmfdb-count">1. Entry count: {lmfdbCrossReference.length} (expected 16)</div>
          <div data-tripwire="lmfdb-degrees">2. Degree range: {Math.min(...lmfdbCrossReference.map(e => e.degree))}-{Math.max(...lmfdbCrossReference.map(e => e.degree))} (expected 1-4)</div>
          <div data-tripwire="lmfdb-zeta-first-zero">3. Zeta first zero: {lmfdbCrossReference[0]?.firstFiveZeros[0]} (expected 14.134725)</div>
          <div data-tripwire="lmfdb-integrity">4. assertIntegrity() runs {(() => { try { const r = assertIntegrity(); return `OK (${r.assertions} checks)`; } catch { return 'FAILED'; } })()}</div>
          <div data-tripwire="lmfdb-sign-values">5. Signs present: {[...new Set(lmfdbCrossReference.map(e => e.signOfFunctionalEquation))].sort().join(', ')} (expected -1, 1)</div>
        </div>
      </div>
    </div>
  );
}
