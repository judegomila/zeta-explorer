import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE } from '../data/imp-34952-double-double-log-ulp-band-wide.js';

const D = IMP34952_DOUBLE_DOUBLE_LOG_ULP_BAND_WIDE;
const BAND = D.band; // [{N, max_dd_round_err_ulp, max_native_err_ulp, all_correctly_rounded, all_native_match, all_one_ulp_or_exact, all_bracket}]

// Per-rung worst-case (over the four imp-34885 log sites) round-to-nearest ULP error, band-wide,
// against the 0.5 ulp correct-rounding threshold.
function UlpErrorChart() {
  const svgW = 720;
  const svgH = 260;
  const padL = 54;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = BAND.map((r) => Math.log10(r.N));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMax = 0.55;
  const xAt = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - (v / yMax) * cH;

  const ddPts = BAND.map((r, i) => [xAt(xs[i]), yAt(r.max_dd_round_err_ulp)]);
  const nativePts = BAND.map((r, i) => [xAt(xs[i]), yAt(r.max_native_err_ulp)]);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1} />

      {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yAt(0.5)}
        x2={padL + cW}
        y2={yAt(0.5)}
        stroke="#f87171"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={padL + cW - 2} y={yAt(0.5) - 4} textAnchor="end" fill="#f87171" fontSize={9}>
        0.5 ulp (correct-rounding boundary)
      </text>

      <polyline
        points={ddPts.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={2}
      />
      {ddPts.map(([x, y], i) => (
        <circle key={`dd-${i}`} cx={x} cy={y} r={3} fill="#38bdf8" />
      ))}

      <polyline
        points={nativePts.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none"
        stroke="#34d399"
        strokeWidth={2}
        strokeDasharray="2 3"
      />
      {nativePts.map(([x, y], i) => (
        <circle key={`nat-${i}`} cx={x} cy={y} r={2.5} fill="#34d399" />
      ))}

      <text x={padL + 6} y={padT + 12} fill="#38bdf8" fontSize={9}>
        &#9679; max ddLog round-to-nearest error (worst of 4 sites)
      </text>
      <text x={padL + 6} y={padT + 24} fill="#34d399" fontSize={9}>
        &#9679; max native Math.log error (worst of 4 sites)
      </text>

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        log10(N), rung {BAND[0].N.toExponential(1)} &hellip; {BAND[BAND.length - 1].N.toExponential(1)}
      </text>
    </svg>
  );
}

// Per-rung status grid: all four boolean properties, uniformly true band-wide -- the N-independence claim.
function StatusGrid() {
  const cols = [
    { key: 'all_correctly_rounded', label: 'correctly rounded (<=0.5 ulp)' },
    { key: 'all_native_match', label: 'native Math.log matches' },
    { key: 'all_one_ulp_or_exact', label: 'directed width = 1 ulp (or exact)' },
    { key: 'all_bracket', label: 'directed [RD,RU] brackets reference' },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', color: '#94a3b8', minWidth: 640 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #334155' }}>N</th>
            {cols.map((c) => (
              <th key={c.key} style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid #334155' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BAND.map((r) => (
            <tr key={r.N}>
              <td style={{ padding: '3px 8px', fontFamily: 'monospace' }}>{r.N.toExponential(3)}</td>
              {cols.map((c) => (
                <td key={c.key} style={{ textAlign: 'center', padding: '3px 8px' }}>
                  <span style={{ color: r[c.key] ? '#34d399' : '#f87171' }}>{r[c.key] ? '✓' : '✗'}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Imp34978DoubleDoubleLogUlpBandWideViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Double-Double Log ULP, Band-Wide (imp-34978 / imp-34952)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Worst-of-four-sites round-to-nearest error stays &le; {D.summary.band_max_dd_round_err_ulp} ulp
        (double-double log) and &le; {D.summary.band_max_native_err_ulp} ulp (native Math.log) at every
        rung across the {D.n_rungs}-point imp-34693 band ({D.n_band_min} &ndash; {D.n_band_max}) &mdash;
        both well under the 0.5 ulp correct-rounding boundary.
      </p>
      <UlpErrorChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        All three properties (correct rounding, native agreement, 1-ulp directed enclosure) hold at
        every one of the {D.summary.n_log_sites} log sites (S1-seed, S2-inner, S3-outer-g, S4-g_prime)
        and every rung &mdash; {D.summary.failing_rungs.length === 0 ? 'no failing rungs' : `${D.summary.failing_rungs.length} failing rungs`}.
        These are therefore N-independent structural facts, not artifacts of the single N_cross point.
      </p>
      <StatusGrid />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> Viz-only page rendering the
        imp-34952 band literals verbatim (no new computation). Measurement on the INHERITED
        imp-3220/imp-3406 surrogate crossover map; does NOT instantiate the imp-34687a directed-rounding
        layer (still gated on the external proven-ULP RD/RU log binding of imp-34885/imp-34867);
        imp-34714a REMAINS OPEN. C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486
        UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED. Platt-Trudgian Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>
    </div>
  );
}
