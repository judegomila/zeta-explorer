import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import lmfdbCrossReference, { assertIntegrity, DATA_AS_OF, lmfdbUrl } from '../data/lmfdb-l-function-cross-reference.js';
import { ED, alpha } from '../styles/tokens.js';

const SORT_KEYS = [
  { key: 'degree', label: 'Degree' },
  { key: 'conductor', label: 'Conductor' },
  { key: 'weight', label: 'Weight' },
  { key: 'name', label: 'Name' },
  { key: 'firstZero', label: 'First Zero' },
];

const DEGREE_COLORS = {
  1: { bg: alpha(ED.series1, 0.12), border: alpha(ED.series1, 0.4), text: 'var(--blue)' },
  2: { bg: alpha(ED.series3, 0.12), border: alpha(ED.series3, 0.4), text: 'var(--green)' },
  3: { bg: alpha(ED.brassDeco, 0.14), border: alpha(ED.brassDeco, 0.42), text: 'var(--brass-dk)' },
  4: { bg: alpha(ED.series2, 0.12), border: alpha(ED.accent, 0.4), text: 'var(--terra-dk)' },
};

function degreeColor(d) {
  return DEGREE_COLORS[d] || { bg: alpha(ED.inkFaint, 0.12), border: alpha(ED.rule, 0.4), text: 'var(--faint)' };
}

function DegreeBadge({ degree }) {
  const c = degreeColor(degree);
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 10,
      fontSize: 11, fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 700,
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
      fontSize: 11, fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 700,
      background: isPos ? 'color-mix(in srgb, var(--series-3) 14%, transparent)' : 'color-mix(in srgb, var(--series-2) 14%, transparent)',
      color: isPos ? 'var(--green)' : 'var(--terra-dk)',
      border: `1px solid ${isPos ? alpha(ED.series3, 0.4) : alpha(ED.series2, 0.4)}`,
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
          fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12,
          padding: '2px 8px', borderRadius: 4,
          background: 'var(--paper)', border: '1px solid var(--hairline)',
          color: z === 0 ? 'var(--terra-dk)' : 'var(--ink-soft)',
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
      background: 'var(--paper2)', border: '1px solid var(--hairline)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 13, color: 'var(--brass-dk)', marginBottom: 4 }}>
            {entry.label}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>
            {entry.name}
          </div>
          <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 13, color: 'var(--faint)', marginTop: 2 }}>
            {entry.lFunction}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a
            href={lmfdbUrl(entry.label)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: '1px solid color-mix(in srgb, var(--series-1) 40%, transparent)', borderRadius: 6,
              color: 'var(--blue)', textDecoration: 'none', padding: '4px 10px',
              fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11,
            }}
          >
            View on LMFDB &#8599;
          </a>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--hairline)', borderRadius: 6,
            color: 'var(--faint)', cursor: 'pointer', padding: '4px 10px',
            fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11,
          }}>
            close
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
        {[
          ['Degree', <DegreeBadge key="d" degree={entry.degree} />],
          ['Weight', <span key="w" style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink)' }}>{entry.weight}</span>],
          ['Conductor', <span key="c" style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink)' }}>{entry.conductor}</span>],
          ['Sign of FE', <SignBadge key="s" sign={entry.signOfFunctionalEquation} />],
          ['Gamma shifts', <span key="g" style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, color: 'var(--ink-soft)' }}>[{entry.gammaShifts.join(', ')}]</span>],
        ].map(([label, val]) => (
          <div key={label} style={{ padding: 10, borderRadius: 8, background: 'var(--paper)', border: '1px solid var(--hairline)' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 4 }}>{label}</div>
            {val}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>
          First 5 nontrivial zeros (Im)
        </div>
        <ZerosList zeros={entry.firstFiveZeros} />
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: 'color-mix(in srgb, var(--brass) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--brass) 25%, transparent)', marginBottom: 12 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--brass-dk)', marginBottom: 4 }}>GRH Note</div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-soft)' }}>{entry.grhNote}</div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: 'color-mix(in srgb, var(--series-1) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 22%, transparent)' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--blue)', marginBottom: 4 }}>Twin-Ladder Bridge Connection</div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-soft)' }}>{entry.zpoConnection}</div>
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
      background: result.ok ? 'color-mix(in srgb, var(--series-3) 10%, transparent)' : 'color-mix(in srgb, var(--series-2) 10%, transparent)',
      border: `1px solid ${result.ok ? alpha(ED.series3, 0.35) : alpha(ED.series2, 0.35)}`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontSize: 14 }}>{result.ok ? '✓' : '✗'}</span>
      <span style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, color: result.ok ? 'var(--green)' : 'var(--terra-dk)' }}>
        {result.ok
          ? `Integrity OK: ${result.checked} entries, ${result.assertions} assertions passed`
          : `Integrity FAILED: ${result.error}`}
      </span>
      <span style={{ marginLeft: 'auto', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11, color: 'var(--faint)' }}>
        Data verified as of {DATA_AS_OF} &middot;{' '}
        <a
          href="https://www.lmfdb.org/L"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--blue)', textDecoration: 'none' }}
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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>LMFDB L-function Cross-Reference</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 720 }}>
            {lmfdbCrossReference.length} curated L-functions from the LMFDB, spanning degrees 1-4
            plus the Ramanujan Delta function. Each entry carries the Bober-Sutherland label,
            first five nontrivial zeros, GRH status, and its connection to the Twin-Ladder Bridge ladder-network model.
          </p>
        </div>

        <IntegrityPanel />

        {/* Degree filter chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <button
            onClick={() => setFilterDegree(null)}
            style={{
              padding: '4px 14px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, fontWeight: 600,
              background: filterDegree === null ? 'color-mix(in srgb, var(--brass) 18%, transparent)' : 'var(--paper2)',
              color: filterDegree === null ? 'var(--brass-dk)' : 'var(--faint)',
              border: `1px solid ${filterDegree === null ? alpha(ED.brass, 0.4) : 'var(--hairline)'}`,
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
                  fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, fontWeight: 600,
                  background: active ? c.bg : 'var(--paper2)',
                  color: active ? c.text : 'var(--faint)',
                  border: `1px solid ${active ? c.border : 'var(--hairline)'}`,
                }}
              >
                Degree {d} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort controls */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))', alignSelf: 'center' }}>
            Sort by:
          </span>
          {SORT_KEYS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              style={{
                padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
                fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11,
                background: sortKey === key ? 'color-mix(in srgb, var(--series-1) 15%, transparent)' : 'var(--paper2)',
                color: sortKey === key ? 'var(--blue)' : 'var(--faint)',
                border: `1px solid ${sortKey === key ? alpha(ED.series1, 0.35) : 'var(--hairline)'}`,
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
                    background: isExpanded ? 'var(--paper2)' : 'var(--paper)',
                    border: `1px solid ${isExpanded ? alpha(ED.brass, 0.35) : 'var(--hairline)'}`,
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    alignItems: 'center', gap: 16,
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                >
                  <DegreeBadge degree={entry.degree} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
                      {entry.name}
                    </div>
                    <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11, color: 'var(--faint)' }}>
                      {entry.label}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, color: 'var(--ink-soft)' }}>
                        N={entry.conductor}
                      </div>
                      <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11, color: 'var(--faint)' }}>
                        w={entry.weight}
                      </div>
                    </div>
                    <SignBadge sign={entry.signOfFunctionalEquation} />
                    <span style={{
                      fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, color: 'var(--faint)',
                      minWidth: 80, textAlign: 'right',
                    }}>
                      z1={entry.firstFiveZeros[0].toFixed(2)}
                    </span>
                    <span style={{ color: 'var(--faint)', fontSize: 14, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
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
        <div style={{ marginTop: 32, padding: 16, borderRadius: 8, background: 'var(--paper2)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--faint)', marginBottom: 8 }}>
            Tripwires
          </div>
          <div style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.8 }}>
            <div data-tripwire="lmfdb-count">1. Entry count: {lmfdbCrossReference.length} (expected 16)</div>
            <div data-tripwire="lmfdb-degrees">2. Degree range: {Math.min(...lmfdbCrossReference.map(e => e.degree))}-{Math.max(...lmfdbCrossReference.map(e => e.degree))} (expected 1-4)</div>
            <div data-tripwire="lmfdb-zeta-first-zero">3. Zeta first zero: {lmfdbCrossReference[0]?.firstFiveZeros[0]} (expected 14.134725)</div>
            <div data-tripwire="lmfdb-integrity">4. assertIntegrity() runs {(() => { try { const r = assertIntegrity(); return `OK (${r.assertions} checks)`; } catch { return 'FAILED'; } })()}</div>
            <div data-tripwire="lmfdb-sign-values">5. Signs present: {[...new Set(lmfdbCrossReference.map(e => e.signOfFunctionalEquation))].sort().join(', ')} (expected -1, 1)</div>
          </div>
        </div>

        {/* Related pages */}
        <div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: 'var(--paper2)', border: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 10 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/lambda-bounds" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Λ Bounds &amp; RH Roadmap
            </Link>
            <Link to="/twin-ladder-paper-roadmap" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Twin-Ladder Paper Roadmap
            </Link>
            <Link to="/research-journal" style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}>
              → Research Journal
            </Link>
          </div>
          <div style={{ marginTop: 14 }}>
            <Link to="/" style={{ fontSize: 13, color: 'var(--terra-dk)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
