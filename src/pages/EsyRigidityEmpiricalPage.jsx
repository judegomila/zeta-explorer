// EsyRigidityEmpiricalPage -- imp-1108
//
// Visualises the empirical psi_N measurements (ESY rigidity quantity) on
// the first N in {100, 500, 1000, 5000, 10000} unfolded Odlyzko Riemann
// zeros. Renders:
//   (1) interpretation banner (verdict + recommended direction)
//   (2) log-log scatter of psi_N vs N at both scales (microscopic =
//       ticket-literal eta=c/N; macroscopic = well-posed ESY regime
//       eta=c) with fitted OLS slope line and the ESY slope=-1 target
//       reference line
//   (3) per-N data table
//   (4) honest-scope panel
//
// Pure SVG + React + d3-scale, matching the imp-1099 / imp-1098 page
// idiom. No external chart library; no canvas; no animation.
//
// Data source: src/data/esy-rigidity-empirical-2026-05.js
//   ESY_RIGIDITY_EMPIRICAL.
//
// @see imp-1108

import React from 'react';
import { Link } from 'react-router-dom';
import { scaleLinear } from 'd3-scale';
import { ESY_RIGIDITY_EMPIRICAL } from '../data/esy-rigidity-empirical-2026-05.js';

// -- SVG geometry ---------------------------------------------------------

const W = 720;
const H = 420;
const M = { top: 30, right: 30, bottom: 60, left: 80 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

// -- Style helpers --------------------------------------------------------

const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fill: 'var(--text-secondary)',
};

const tickStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  fill: '#94a3b8',
};

function verdictTone(verdict) {
  if (verdict === 'ESY-COMPATIBLE') return '#22c55e';
  if (verdict === 'ESY-INCOMPATIBLE') return '#ef4444';
  return '#facc15';
}

function SummaryCard({ label, value, tone, hint }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid ' + tone,
        borderRadius: 6,
        padding: '10px 12px',
      }}
    >
      <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontFamily: 'var(--font-mono)', color: tone, marginTop: 4 }}>
        {value}
      </div>
      {hint ? (
        <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{hint}</div>
      ) : null}
    </div>
  );
}

// -- Log-log scatter SVG --------------------------------------------------

function LogLogScatter({ title, rows, fit, color }) {
  // Domain: log N from log(min N) to log(max N); log psi from min to max.
  const logNs = rows.map((r) => Math.log10(r.N));
  const logPsis = rows.map((r) => Math.log10(r.psiRMS));

  const minLogN = Math.min(...logNs) - 0.1;
  const maxLogN = Math.max(...logNs) + 0.1;
  const minLogPsi = Math.min(...logPsis) - 0.2;
  const maxLogPsi = Math.max(...logPsis) + 0.2;

  const x = scaleLinear().domain([minLogN, maxLogN]).range([0, IW]);
  const y = scaleLinear().domain([minLogPsi, maxLogPsi]).range([IH, 0]);

  // Fitted line: log psi = intercept + slope * log N -- but we did the fit
  // in natural log; convert to log10 for the plot.
  // log_e(psi) = a + b * log_e(N)
  // log10(psi) = log10(e) * log_e(psi) = log10(e) * (a + b * log_e(N))
  //            = log10(e) * a + b * log10(N) * log10(e) / log10(e)
  // i.e. slope in log10 = same b; intercept in log10 = a * log10(e).
  const slopeLog10 = fit.slope;
  const interceptLog10 = fit.intercept * Math.log10(Math.E);
  const fitX1 = minLogN;
  const fitX2 = maxLogN;
  const fitY1 = interceptLog10 + slopeLog10 * fitX1 * Math.log(10) * Math.log10(Math.E);
  // Easier: just evaluate log_e at the endpoints and convert.
  const fitY1Ln = fit.intercept + fit.slope * Math.log(Math.pow(10, fitX1));
  const fitY2Ln = fit.intercept + fit.slope * Math.log(Math.pow(10, fitX2));
  const fitY1Log10 = fitY1Ln * Math.log10(Math.E);
  const fitY2Log10 = fitY2Ln * Math.log10(Math.E);

  // ESY target line (slope = -1) anchored at the smallest-N empirical
  // point so the visual comparison is honest.
  const target0Log10 = logPsis[0] - (-1) * (logNs[0] - fitX1);
  const targetY1 = target0Log10;
  const targetY2 = target0Log10 + (-1) * (fitX2 - fitX1);

  // Ticks.
  const xTicks = [];
  for (let v = Math.ceil(minLogN); v <= Math.floor(maxLogN); v += 1) xTicks.push(v);
  const yTicks = [];
  for (let v = Math.ceil(minLogPsi); v <= Math.floor(maxLogPsi); v += 1) yTicks.push(v);

  return (
    <div
      style={{
        marginTop: 12,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 12,
      }}
    >
      <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: 8 }}>
        {title}
      </div>
      <svg width={W} height={H} role="img" aria-label={title}>
        <g transform={'translate(' + M.left + ',' + M.top + ')'}>
          {/* Background grid. */}
          {xTicks.map((t) => (
            <line key={'xg-' + t} x1={x(t)} x2={x(t)} y1={0} y2={IH} stroke="#1e293b" strokeDasharray="2,4" />
          ))}
          {yTicks.map((t) => (
            <line key={'yg-' + t} x1={0} x2={IW} y1={y(t)} y2={y(t)} stroke="#1e293b" strokeDasharray="2,4" />
          ))}

          {/* ESY target slope = -1 reference line. */}
          <line
            x1={x(fitX1)}
            x2={x(fitX2)}
            y1={y(targetY1)}
            y2={y(targetY2)}
            stroke="#22c55e"
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />

          {/* Fitted OLS line. */}
          <line
            x1={x(fitX1)}
            x2={x(fitX2)}
            y1={y(fitY1Log10)}
            y2={y(fitY2Log10)}
            stroke={color}
            strokeWidth={2}
          />

          {/* Data points. */}
          {rows.map((r, i) => (
            <g key={'pt-' + r.N}>
              <circle
                cx={x(logNs[i])}
                cy={y(logPsis[i])}
                r={5}
                fill={color}
                stroke="white"
                strokeWidth={1.2}
              >
                <title>
                  {'N = ' + r.N + ' | psi_RMS = ' + r.psiRMS.toExponential(4) + ' | eta = ' + r.eta.toExponential(2)}
                </title>
              </circle>
            </g>
          ))}

          {/* x axis. */}
          <line x1={0} x2={IW} y1={IH} y2={IH} stroke="#475569" />
          {xTicks.map((t) => (
            <g key={'xt-' + t} transform={'translate(' + x(t) + ',' + IH + ')'}>
              <line y1={0} y2={5} stroke="#475569" />
              <text y={18} textAnchor="middle" style={tickStyle}>
                {'10^' + t}
              </text>
            </g>
          ))}
          <text x={IW / 2} y={IH + 42} textAnchor="middle" style={{ ...labelStyle, fontSize: 11 }}>
            N (zero count)
          </text>

          {/* y axis. */}
          <line x1={0} x2={0} y1={0} y2={IH} stroke="#475569" />
          {yTicks.map((t) => (
            <g key={'yt-' + t} transform={'translate(0,' + y(t) + ')'}>
              <line x1={-5} x2={0} stroke="#475569" />
              <text x={-8} y={3} textAnchor="end" style={tickStyle}>
                {'10^' + t}
              </text>
            </g>
          ))}
          <text
            transform={'translate(-58,' + IH / 2 + ') rotate(-90)'}
            textAnchor="middle"
            style={{ ...labelStyle, fontSize: 11 }}
          >
            psi_N (RMS bulk fluctuation)
          </text>

          {/* Legend. */}
          <g transform={'translate(' + (IW - 230) + ',6)'}>
            <rect x={-6} y={-4} width={236} height={56} rx={6} fill="rgba(15,23,42,0.7)" stroke="rgba(148,163,184,0.35)" />
            <circle cx={6} cy={8} r={4} fill={color} stroke="white" strokeWidth={1.2} />
            <text x={20} y={12} style={{ ...labelStyle, fontSize: 10, fill: '#cbd5e1' }}>
              measured (slope = {fit.slope.toFixed(3)})
            </text>
            <line x1={0} x2={14} y1={24} y2={24} stroke={color} strokeWidth={2} />
            <text x={20} y={28} style={{ ...labelStyle, fontSize: 10, fill: '#cbd5e1' }}>
              OLS fit (R^2 = {fit.R2.toFixed(3)})
            </text>
            <line x1={0} x2={14} y1={40} y2={40} stroke="#22c55e" strokeWidth={1.5} strokeDasharray="6,4" />
            <text x={20} y={44} style={{ ...labelStyle, fontSize: 10, fill: '#cbd5e1' }}>
              ESY target slope = -1
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}

// -- Page component -------------------------------------------------------

export default function EsyRigidityEmpiricalPage() {
  const D = ESY_RIGIDITY_EMPIRICAL;
  const verdict = D.empiricalAgreement;
  const verdictMicro = D.empiricalAgreementMicroscopic;
  const tone = verdictTone(verdict);

  return (
    <div className="page">
      <div className="page-header">
        <h1>ESY Rigidity Empirical Measurement (imp-1108)</h1>
        <p className="page-subtitle">
          Numerical measurement of the ESY local-law fluctuation quantity
          {' '}<code>psi_N</code> on the first N unfolded Odlyzko Riemann
          zeros at N in {'{'}100, 500, 1000, 5000, 10000{'}'}. Tests
          whether the empirical scaling matches the Erdos-Schlein-Yau
          prediction <code>polylog(N) / N</code> (slope approximately
          {' '}<code>-1</code> in log N).
        </p>
        <div style={{ marginTop: 10, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          <Link to="/explorations" style={{ color: '#a855f7' }}>
            &larr; back to Explorations
          </Link>
        </div>
      </div>

      {/* Rigorous-vs-empirical status legend (imp-2943). Separates the three
          logical tiers this page touches so the empirical measurements below
          are never read as discharging the ESY closure. */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid var(--border)',
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Status legend &mdash; what is proven vs measured
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
          <div style={{ borderLeft: '3px solid #22c55e', padding: '6px 10px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: 4 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#22c55e', fontWeight: 'bold' }}>RIGOROUS-UNCONDITIONAL</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.4 }}>
              Theorems proven with no hypothesis, e.g. the Rodgers-Tao result <code>Lambda &gt;= 0</code>.
            </div>
          </div>
          <div style={{ borderLeft: '3px solid #facc15', padding: '6px 10px', background: 'rgba(250, 204, 21, 0.05)', borderRadius: 4 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#facc15', fontWeight: 'bold' }}>GUE-CONDITIONAL</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.4 }}>
              ESY-style rigidity statements that <em>assume</em> GUE / Montgomery pair-correlation. True only if the conjectured statistics hold.
            </div>
          </div>
          <div style={{ borderLeft: '3px solid #38bdf8', padding: '6px 10px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: 4 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 'bold' }}>EMPIRICAL / NUMERICAL</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.4 }}>
              The finite-N rigidity measurements shown on this page. Evidence at fixed truncation only &mdash; it does <strong>not</strong> discharge the ESY closure or prove RH.
            </div>
          </div>
        </div>
      </div>

      {/* Verdict banner. */}
      <div
        style={{
          marginTop: 16,
          padding: 14,
          background: 'rgba(15, 23, 42, 0.5)',
          border: '2px solid ' + tone,
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Empirical verdict (macroscopic-scale, eta = c)
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: 'var(--font-mono)',
            color: tone,
            marginTop: 6,
            fontWeight: 'bold',
          }}
        >
          {verdict}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
          Microscopic-scale (eta = c/N, ticket-literal): <span style={{ color: verdictTone(verdictMicro) }}>{verdictMicro}</span>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: 'var(--text-primary)',
            lineHeight: 1.5,
          }}
        >
          <strong>Recommended direction:</strong> {D.recommendedDirection}
        </div>
      </div>

      {/* Honest-status caveat (amber). What this measurement is and is NOT. */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: 'rgba(250, 204, 21, 0.06)',
          border: '1px solid rgba(250, 204, 21, 0.4)',
          borderLeft: '3px solid #facc15',
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 11, color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
          Honest status -- what this verdict is and is NOT
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, marginTop: 8, marginBottom: 0 }}>
          This page reports an <strong>empirical measurement</strong> of the
          fluctuation quantity <code>psi_N</code> at <strong>finite N</strong>
          {' '}(at most 10,000 unfolded Odlyzko zeros). A favourable slope shows
          the measured scaling is <strong>CONSISTENT WITH</strong> ESY-class
          rigidity for the Riemann zeros; it is <strong>NOT a proof</strong> of
          rigidity and closes <strong>none</strong> of the rigorous obstacles
          O1-O3. In particular the ESY local-law constant
          {' '}<code>C_H</code> (the <code>polylog(N)^A</code> prefactor) remains
          <strong> undischargeable</strong> by any finite-N fit -- it is the
          repo&apos;s #1 wall, the same constant that blocks turning this
          empirical consistency into an asymptotic improvement of the
          Polymath15 Lambda bound. See{' '}
          <Link to="/lambda-bounds" style={{ color: '#60a5fa' }}>
            /lambda-bounds
          </Link>{' '}
          for where this evidence sits in the overall RH-attack ledger.
        </p>
      </div>

      {/* Numeric summary cards. */}
      <div
        className="card-grid"
        style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        <SummaryCard
          label="fitted slope (macro)"
          value={D.fittedRate.slope.toFixed(4)}
          tone={tone}
          hint={'ESY target = -1.0 (within +/- ' + D.esyPrediction.slopeTol.toFixed(1) + ')'}
        />
        <SummaryCard
          label="R^2 (macro)"
          value={D.fittedRate.R2.toFixed(4)}
          tone={D.fittedRate.R2 >= 0.85 ? '#22c55e' : '#facc15'}
          hint={'threshold = ' + D.esyPrediction.R2Threshold}
        />
        <SummaryCard
          label="fitted slope (micro)"
          value={D.fittedRateMicro.slope.toFixed(4)}
          tone={verdictTone(verdictMicro)}
          hint="ticket-literal eta = c/N (bounded by ESY)"
        />
        <SummaryCard
          label="R^2 (micro)"
          value={D.fittedRateMicro.R2.toFixed(4)}
          tone={D.fittedRateMicro.R2 >= 0.85 ? '#22c55e' : '#facc15'}
          hint="fit quality at microscopic scale"
        />
        <SummaryCard
          label="N values measured"
          value={D.measuredPsiN.length}
          tone="#60a5fa"
          hint="datapoints used for the OLS fit"
        />
        <SummaryCard
          label="c parameter"
          value={D.cParam.toFixed(1)}
          tone="#a855f7"
          hint="eta = c / N (micro) and eta = c (macro)"
        />
      </div>

      {/* Macroscopic scatter (headline). */}
      <LogLogScatter
        title={'(A) macroscopic scale eta = c -- well-posed ESY local-law regime where polylog(N)/N is predicted'}
        rows={D.measuredPsiNMacro}
        fit={D.fittedRate}
        color="#60a5fa"
      />

      {/* Microscopic scatter (ticket-literal). */}
      <LogLogScatter
        title={'(B) microscopic scale eta = c/N -- ticket-literal operational definition; ESY local law predicts BOUNDED (slope approximately 0)'}
        rows={D.measuredPsiN}
        fit={D.fittedRateMicro}
        color="#facc15"
      />

      {/* Per-N data table. */}
      <div
        style={{
          marginTop: 24,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: 8 }}>
          per-N measurements
        </div>
        <table style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(96, 165, 250, 0.08)', color: '#cbd5e1' }}>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>N</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>eta_micro</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>psi_micro (RMS)</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>psi_macro (RMS)</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>M (bulk)</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>E_repr</th>
            </tr>
          </thead>
          <tbody>
            {D.measuredPsiN.map((r, i) => (
              <tr key={'row-' + r.N} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '6px 10px', textAlign: 'right', color: '#60a5fa' }}>{r.N.toLocaleString()}</td>
                <td style={{ padding: '6px 10px', textAlign: 'right' }}>{r.eta.toExponential(3)}</td>
                <td style={{ padding: '6px 10px', textAlign: 'right' }}>{r.psiRMS.toExponential(4)}</td>
                <td style={{ padding: '6px 10px', textAlign: 'right' }}>{D.measuredPsiNMacro[i].psiRMS.toExponential(4)}</td>
                <td style={{ padding: '6px 10px', textAlign: 'right', color: '#94a3b8' }}>{r.sampleSize}</td>
                <td style={{ padding: '6px 10px', textAlign: 'right', color: '#94a3b8' }}>{r.E_representative.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Method + interpretation cards. */}
      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card" style={{ padding: 14 }}>
          <h3 style={{ marginTop: 0, color: '#60a5fa' }}>Method</h3>
          <p style={{ fontSize: 13, lineHeight: 1.55 }}>
            For each <code>N in {'{'}100, 500, 1000, 5000, 10000{'}'}</code> we
            take the first <code>N</code> Odlyzko Riemann zeros
            {' '}<code>gamma_1, ..., gamma_N</code>, unfold them via the
            Riemann-von Mangoldt local density
            {' '}<code>x_k = (gamma_k / (2 pi)) * log(gamma_k / (2 pi))</code>
            {' '}so the bulk has unit mean spacing, sample
            {' '}<code>M = min(50, bulk_size)</code> test points
            {' '}<code>E_j = (x_{'{'}idx{'}'} + x_{'{'}idx+1{'}'}) / 2</code>
            {' '}as midpoints between consecutive bulk zeros, compute the
            empirical Stieltjes transform
            {' '}<code>m_N(z) = sum_k 1 / (z - x_k)</code> at
            {' '}<code>z = E_j + i eta</code>, and define
            {' '}<code>psi_N(E_j) = |Im(m_N) + pi|</code> (the bulk density
            of unfolded zeros is 1 so the smooth prediction is
            {' '}<code>Im(m) approx -pi</code>). We report the RMS of
            {' '}<code>psi_N</code> over the <code>M</code> bulk test
            points, fit <code>log(psi_RMS)</code> vs <code>log(N)</code> by
            OLS, and classify the slope against the ESY target of
            {' '}<code>-1</code>.
          </p>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <h3 style={{ marginTop: 0, color: tone }}>Interpretation</h3>
          <p style={{ fontSize: 13, lineHeight: 1.55 }}>
            The headline verdict uses the MACROSCOPIC scale
            {' '}<code>eta = c</code> where ESY predicts
            {' '}<code>|m_N - m_sc| &lt; polylog(N) / N</code> (slope
            approximately <code>-1</code>). Measured macroscopic slope is
            {' '}<code>{D.fittedRate.slope.toFixed(4)}</code> with
            {' '}<code>R^2 = {D.fittedRate.R2.toFixed(4)}</code>.
            The MICROSCOPIC scale <code>eta = c / N</code> is the
            ticket-literal regime; here ESY predicts BOUNDED deviation
            {' '}<code>polylog(N) / c</code> (slope approximately
            {' '}<code>0</code>) which the empirical microscopic series
            satisfies (psi approximately constant 3.1 across two decades
            of N). The verdict
            {' '}<strong style={{ color: tone }}>{verdict}</strong>
            {' '}therefore reflects the macroscopic ESY regime; the
            recommended direction routes follow-on attack effort
            accordingly.
          </p>
        </div>
      </div>

      {/* Honest scope. */}
      <div
        style={{
          marginTop: 24,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 14,
        }}
      >
        <h3 style={{ marginTop: 0, color: '#facc15', fontSize: 14 }}>Honest scope</h3>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
          {D.honestScope.map((line, i) => (
            <li key={'scope-' + i} style={{ marginBottom: 6 }}>
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Parallel-ticket cross-reference. */}
      <div
        style={{
          marginTop: 16,
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: '#64748b',
        }}
      >
        Parallel SOTA-attack tickets in flight: {D.parallelTickets.join(', ')}
      </div>
    </div>
  );
}
