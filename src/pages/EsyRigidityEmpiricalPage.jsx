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
//   (4)-scope panel
//
// Pure SVG + React + d3-scale, matching the imp-1099 / imp-1098 page
// idiom. No external chart library; no canvas; no animation.
//
// Data source: src/data/esy-rigidity-empirical-2026-05.js
//   ESY_RIGIDITY_EMPIRICAL.
//
// Editorial (warm) re-theme: full-width dashboard, identical structure/data.
//
// @see imp-1108

import React from 'react';
import { Link } from 'react-router-dom';
import { scaleLinear } from 'd3-scale';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ESY_RIGIDITY_EMPIRICAL } from '../data/esy-rigidity-empirical-2026-05.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED } from '../styles/tokens.js';

// -- SVG geometry ---------------------------------------------------------

const W = 720;
const H = 420;
const M = { top: 30, right: 30, bottom: 60, left: 80 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

// -- Style helpers --------------------------------------------------------

const labelStyle = {
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontSize: 11,
  fill: 'var(--ink-soft)',
};

const tickStyle = {
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontSize: 9,
  fill: 'var(--faint)',
};

function verdictTone(verdict) {
  if (verdict === 'ESY-COMPATIBLE') return 'var(--green)';
  if (verdict === 'ESY-INCOMPATIBLE') return 'var(--terra-dk)';
  return 'var(--brass-dk)';
}

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  marginBottom: 6,
};

function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

function SummaryCard({ label, value, tone, hint }) {
  return (
    <div className="card" style={cardBaseLeft(tone)}>
      <div style={cardLabel}>{label}</div>
      <div style={{ fontSize: 18, fontFamily: 'var(--ed-mono, var(--font-mono))', color: tone, fontWeight: 700 }}>
        {value}
      </div>
      {hint ? (
        <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 4 }}>{hint}</div>
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
  // point so the visual comparison is.
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
      className="card"
      style={{
        marginTop: 12,
        background: 'var(--paper2)',
        border: '1px solid var(--hairline)',
        borderRadius: 8,
        padding: 12,
      }}
    >
      <div style={{ fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink-soft)', marginBottom: 8 }}>
        {title}
      </div>
      <svg width={W} height={H} role="img" aria-label={title}>
        <g transform={'translate(' + M.left + ',' + M.top + ')'}>
          {/* Background grid. */}
          {xTicks.map((t) => (
            <line key={'xg-' + t} x1={x(t)} x2={x(t)} y1={0} y2={IH} stroke={ED.rule} strokeDasharray="2,4" />
          ))}
          {yTicks.map((t) => (
            <line key={'yg-' + t} x1={0} x2={IW} y1={y(t)} y2={y(t)} stroke={ED.rule} strokeDasharray="2,4" />
          ))}

          {/* ESY target slope = -1 reference line. */}
          <line
            x1={x(fitX1)}
            x2={x(fitX2)}
            y1={y(targetY1)}
            y2={y(targetY2)}
            stroke={ED.series3}
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
                stroke={ED.paper}
                strokeWidth={1.2}
              >
                <title>
                  {'N = ' + r.N + ' | psi_RMS = ' + r.psiRMS.toExponential(4) + ' | eta = ' + r.eta.toExponential(2)}
                </title>
              </circle>
            </g>
          ))}

          {/* x axis. */}
          <line x1={0} x2={IW} y1={IH} y2={IH} stroke={ED.inkSoft} />
          {xTicks.map((t) => (
            <g key={'xt-' + t} transform={'translate(' + x(t) + ',' + IH + ')'}>
              <line y1={0} y2={5} stroke={ED.inkSoft} />
              <text y={18} textAnchor="middle" style={tickStyle}>
                {'10^' + t}
              </text>
            </g>
          ))}
          <text x={IW / 2} y={IH + 42} textAnchor="middle" style={{ ...labelStyle, fontSize: 11 }}>
            N (zero count)
          </text>

          {/* y axis. */}
          <line x1={0} x2={0} y1={0} y2={IH} stroke={ED.inkSoft} />
          {yTicks.map((t) => (
            <g key={'yt-' + t} transform={'translate(0,' + y(t) + ')'}>
              <line x1={-5} x2={0} stroke={ED.inkSoft} />
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
            <rect x={-6} y={-4} width={236} height={56} rx={6} fill={ED.paper} stroke={ED.rule} />
            <circle cx={6} cy={8} r={4} fill={color} stroke={ED.paper} strokeWidth={1.2} />
            <text x={20} y={12} style={{ ...labelStyle, fontSize: 10, fill: 'var(--ink-soft)' }}>
              measured (slope = {fit.slope.toFixed(3)})
            </text>
            <line x1={0} x2={14} y1={24} y2={24} stroke={color} strokeWidth={2} />
            <text x={20} y={28} style={{ ...labelStyle, fontSize: 10, fill: 'var(--ink-soft)' }}>
              OLS fit (R^2 = {fit.R2.toFixed(3)})
            </text>
            <line x1={0} x2={14} y1={40} y2={40} stroke={ED.series3} strokeWidth={1.5} strokeDasharray="6,4" />
            <text x={20} y={44} style={{ ...labelStyle, fontSize: 10, fill: 'var(--ink-soft)' }}>
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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>ESY Rigidity, Measured Empirically (imp-1108)</h1>
          <p className="ed-lbl">Related: <Link to="/edge-rigidity">ESY rigidity (edge)</Link></p>
          <AnimationEmbed id="esy-rigidity" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            We measure the Erdos-Schlein-Yau local-law fluctuation quantity{' '}
            <code>psi_N</code> on the first <code>N</code> unfolded Odlyzko
            Riemann zeros, at <code>N</code> in {'{'}100, 500, 1000, 5000, 10000{'}'},
            and test whether the empirical scaling matches the ESY prediction
            {' '}<code>polylog(N) / N</code> (a slope of approximately{' '}
            <code>-1</code> in log N).
          </p>
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link
              to="/explorations"
              style={{
                color: 'var(--brass-dk)',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
                fontSize: 12,
                textDecoration: 'none',
                padding: '4px 10px',
                border: '1px solid var(--brass-dk)',
                borderRadius: 6,
              }}
            >
              ← back to Explorations
            </Link>
          </div>
        </div>

        {/* Rigorous-vs-empirical status legend (imp-2943). Separates the three
            logical tiers this page touches so the empirical measurements below
            are never read as discharging the ESY closure. */}
        <div className="card" style={{ ...cardBaseLeft('var(--hairline)'), marginBottom: 16 }}>
          <div style={cardLabel}>Status legend — what is proven vs. measured</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginTop: 8 }}>
            <div style={{ borderLeft: '3px solid var(--green)', padding: '6px 10px', background: 'color-mix(in srgb, var(--series-3) 6%, transparent)', borderRadius: 4 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--green)', fontWeight: 700 }}>RIGOROUS-UNCONDITIONAL</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.4 }}>
                Theorems proven with no hypothesis, e.g. the Rodgers-Tao result <code>Lambda &gt;= 0</code>.
              </div>
            </div>
            <div style={{ borderLeft: '3px solid var(--brass-dk)', padding: '6px 10px', background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)', borderRadius: 4 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--brass-dk)', fontWeight: 700 }}>GUE-CONDITIONAL</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.4 }}>
                ESY-style rigidity statements that <em>assume</em> GUE / Montgomery pair-correlation. True only if the conjectured statistics hold.
              </div>
            </div>
            <div style={{ borderLeft: '3px solid var(--blue)', padding: '6px 10px', background: 'color-mix(in srgb, var(--series-1) 6%, transparent)', borderRadius: 4 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--blue)', fontWeight: 700 }}>EMPIRICAL / NUMERICAL</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.4 }}>
                The finite-N rigidity measurements shown on this page. Evidence at fixed truncation only — it does <strong>not</strong> discharge the ESY closure or prove RH.
              </div>
            </div>
          </div>
        </div>

        {/* Verdict banner. */}
        <div className="card" style={{ ...cardBaseLeft(tone), border: `2px solid ${tone}`, marginBottom: 16 }}>
          <div style={cardLabel}>Empirical verdict (macroscopic scale, eta = c)</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--ed-mono, var(--font-mono))', color: tone, fontWeight: 700 }}>
            {verdict}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 6 }}>
            Microscopic scale (eta = c/N, ticket-literal): <span style={{ color: verdictTone(verdictMicro), fontWeight: 600 }}>{verdictMicro}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>
            <strong>Recommended direction:</strong> {D.recommendedDirection}
          </div>
        </div>

        {/* Status caveat. What this measurement is and is NOT. */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass-dk)'), background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--brass-dk)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
            Status — what this verdict is and is NOT
          </div>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: 8, marginBottom: 0 }}>
            This page reports an <strong>empirical measurement</strong> of the
            fluctuation quantity <code>psi_N</code> at <strong>finite N</strong>
            {' '}(at most 10,000 unfolded Odlyzko zeros). A favourable slope shows
            the measured scaling is <strong>CONSISTENT WITH</strong> ESY-class
            rigidity for the Riemann zeros; it is <strong>NOT a proof</strong> of
            rigidity and closes <strong>none</strong> of the rigorous obstacles
            O1-O3. In particular the ESY local-law constant
            {' '}<code>C_H</code> (the <code>polylog(N)^A</code> prefactor) remains
            <strong> undischargeable</strong> by any finite-N fit — a
            <strong> closed wall for this ESY route</strong> (closed three ways),
            the constant that blocked turning this empirical consistency into an
            asymptotic improvement of the Polymath15 Lambda bound. The program&apos;s
            current open object is elsewhere: the one open enclosure family of the
            Λ ≤ 0.14 completion contract — see{' '}
            <Link to="/permutation-architecture" style={{ color: 'var(--blue)' }}>
              /permutation-architecture
            </Link>{' '}
            and{' '}
            <Link to="/lambda-bounds" style={{ color: 'var(--blue)' }}>
              /lambda-bounds
            </Link>{' '}
            for where this evidence sits in the overall RH-attack ledger.
          </p>
        </div>

        {/* Numeric summary cards. */}
        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>Fit summary</h2>
        <div className="card-grid" style={{ marginBottom: 16 }}>
          <SummaryCard
            label="fitted slope (macro)"
            value={D.fittedRate.slope.toFixed(4)}
            tone={tone}
            hint={'ESY target = -1.0 (within +/- ' + D.esyPrediction.slopeTol.toFixed(1) + ')'}
          />
          <SummaryCard
            label="R^2 (macro)"
            value={D.fittedRate.R2.toFixed(4)}
            tone={D.fittedRate.R2 >= 0.85 ? 'var(--green)' : 'var(--brass-dk)'}
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
            tone={D.fittedRateMicro.R2 >= 0.85 ? 'var(--green)' : 'var(--brass-dk)'}
            hint="fit quality at microscopic scale"
          />
          <SummaryCard
            label="N values measured"
            value={D.measuredPsiN.length}
            tone={ED.series1}
            hint="datapoints used for the OLS fit"
          />
          <SummaryCard
            label="c parameter"
            value={D.cParam.toFixed(1)}
            tone={ED.brass}
            hint="eta = c / N (micro) and eta = c (macro)"
          />
        </div>

        {/* Macroscopic scatter (headline). */}
        <LogLogScatter
          title={'(A) macroscopic scale eta = c -- well-posed ESY local-law regime where polylog(N)/N is predicted'}
          rows={D.measuredPsiNMacro}
          fit={D.fittedRate}
          color={ED.series1}
        />

        {/* Microscopic scatter (ticket-literal). */}
        <LogLogScatter
          title={'(B) microscopic scale eta = c/N -- ticket-literal operational definition; ESY local law predicts BOUNDED (slope approximately 0)'}
          rows={D.measuredPsiN}
          fit={D.fittedRateMicro}
          color={ED.brass}
        />

        {/* Per-N data table. */}
        <div className="card" style={{ marginTop: 24, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: 12, marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink-soft)', marginBottom: 8 }}>
            per-N measurements
          </div>
          <table style={{ width: '100%', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', color: 'var(--ink)' }}>
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
                <tr key={'row-' + r.N} style={{ borderTop: '1px solid var(--hairline)' }}>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--blue)' }}>{r.N.toLocaleString()}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--ink-soft)' }}>{r.eta.toExponential(3)}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--ink-soft)' }}>{r.psiRMS.toExponential(4)}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--ink-soft)' }}>{D.measuredPsiNMacro[i].psiRMS.toExponential(4)}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--faint)' }}>{r.sampleSize}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--faint)' }}>{r.E_representative.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Method + interpretation cards. */}
        <div className="two-col" style={{ marginBottom: 24 }}>
          <div className="card" style={{ padding: 14 }}>
            <h3 style={{ marginTop: 0, color: 'var(--blue)' }}>Method</h3>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
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
            <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
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
              recommended direction routes follow-on approach effort
              accordingly.
            </p>
          </div>
        </div>

        {/* Scope. */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass-dk)'), marginBottom: 24 }}>
          <h3 style={{ marginTop: 0, color: 'var(--brass-dk)', fontSize: 14 }}>Scope</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
            {D.honestScope.map((line, i) => (
              <li key={'scope-' + i} style={{ marginBottom: 6 }}>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Parallel-ticket cross-reference. */}
        <div style={{ marginBottom: 16, fontSize: 11, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--faint)' }}>
          Parallel-agent batch (2026-05): {D.parallelTickets.join(', ')}
        </div>

        {/* Related pages + home. */}
        <div className="card" style={cardBaseLeft('var(--brass)')}>
          <div style={cardLabel}>Related pages</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/lambda-bounds" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Λ Bounds &amp; RH Roadmap
            </Link>
            <Link to="/explorations" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Explorations
            </Link>
            <Link to="/improvement-queue" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Live improvement queue
            </Link>
            <Link to="/edge-rigidity" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Edge Rigidity
            </Link>
            <Link to="/" style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
