// ConnesAdelicPage -- imp-1109
//
// Survey + small numerical positivity check for the Connes 1999 adelic
// spectral interpretation of the Riemann zeros, restricted to a low-rank
// discretization of the adele class space at the first 5 primes and tested
// at heat time t = 0.02 (the order-of-magnitude imp-440 finite-N Lambda).
//
// Layout (single column, editorial warm re-theme -- identical structure/data):
//   - Banner: headline verdict (positivity holds / fails) and the truncated
//     trace value at t = 0.02 with the prime set.
//   - Survey: 5 paragraphs from the data file (adelic class space, trace
//     formula, conjectural Lambda reformulation, numerical check, what
//     positivity does and does not tell us).
//   - Math block: KaTeX-rendered display equations for (a) the Weil-Connes
//     full trace formula, (b) the prime-side local term W_p(h), (c) the
//     heat-flowed test function g_t(u), (d) the truncated prime-side trace
//     Tr_p,k(t).
//   - Contributions table: per-prime breakdown showing each of the 25 terms
//     and the per-prime row sum.
//   - Heat-flow sweep chart: traceTotal vs t across [0, 0.2] step 0.01 with
//     a guide line at t = 0.02 (the imp-440 regime) and a guide at zero.
//   - Scope + citations.
//
// Data source: src/data/connes-adelic-lambda-2026-05.js (CONNES_ADELIC_LAMBDA).
// All computation happens at import / build time. Pure inline SVG -- no
// external chart lib needed for the small static plots. KaTeX is loaded via
// the existing react-katex peer dep used elsewhere in the app.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { CONNES_ADELIC_LAMBDA } from '../data/connes-adelic-lambda-2026-05.js';
import RelatedLinks from '../components/RelatedLinks.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED } from '../styles/tokens.js';

// ── Style helpers (editorial warm palette). ────────────────────────────

const panelStyle = {
  background: 'var(--paper2)',
  border: '1px solid var(--hairline)',
  borderRadius: 8,
  padding: 16,
};

const h2Style = {
  fontSize: 16,
  color: 'var(--ink)',
  marginTop: 0,
  marginBottom: 12,
  fontFamily: 'var(--ed-mono, var(--font-mono))',
};

const h3Style = {
  fontSize: 14,
  color: 'var(--ink)',
  marginTop: 12,
  marginBottom: 6,
  fontFamily: 'var(--ed-mono, var(--font-mono))',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontSize: 12,
};

const thStyle = {
  padding: '6px 10px',
  borderBottom: '1px solid var(--hairline)',
  textAlign: 'right',
  color: 'var(--faint)',
  fontWeight: 600,
};

const tdStyle = {
  padding: '5px 10px',
  borderBottom: '1px solid var(--hair2)',
  textAlign: 'right',
  color: 'var(--ink)',
};

const PRIME_COLOURS = {
  2: 'var(--blue)',
  3: 'var(--brass)',
  5: 'var(--terra-dk)',
  7: 'var(--green)',
  11: 'var(--brass-dk)',
};

// ── Sweep plot: traceTotal vs t. ──────────────────────────────────────

const SW_W = 720;
const SW_H = 280;
const SW_PAD = { top: 24, right: 24, bottom: 42, left: 64 };
const SW_IW = SW_W - SW_PAD.left - SW_PAD.right;
const SW_IH = SW_H - SW_PAD.top - SW_PAD.bottom;

function linearScale(domainLo, domainHi, rangeLo, rangeHi) {
  return (v) => rangeLo + ((v - domainLo) / (domainHi - domainLo)) * (rangeHi - rangeLo);
}

function HeatFlowSweep() {
  const sweep = CONNES_ADELIC_LAMBDA.tSweep;
  const ts = sweep.map((r) => r.t);
  const ys = sweep.map((r) => r.traceTotal);
  const yMax = Math.max(...ys) * 1.10;
  const yMin = 0;
  const x = linearScale(0, 0.2, 0, SW_IW);
  const y = linearScale(yMin, yMax, SW_IH, 0);

  const polyline = sweep.map((r) => x(r.t).toFixed(2) + ',' + y(r.traceTotal).toFixed(2)).join(' ');

  const tHeat = CONNES_ADELIC_LAMBDA.tHeat;
  const tHeatTrace = CONNES_ADELIC_LAMBDA.truncatedTraceAtT0p02;

  return (
    <svg width={SW_W} height={SW_H} role="img" aria-label="truncated trace vs heat time">
      <g transform={'translate(' + SW_PAD.left + ',' + SW_PAD.top + ')'}>
        <rect x={0} y={0} width={SW_IW} height={SW_IH} fill={ED.paper} stroke={ED.rule} />

        {/* Horizontal grid lines and y-axis ticks. */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => {
          const yv = yMin + frac * (yMax - yMin);
          return (
            <g key={'yt-' + frac}>
              <line x1={0} y1={y(yv)} x2={SW_IW} y2={y(yv)} stroke={ED.ruleSoft} strokeWidth={1} />
              <text x={-6} y={y(yv) + 3} fontSize={10} fill={ED.inkFaint} textAnchor="end"
                    fontFamily="var(--ed-mono, monospace)">{yv.toFixed(2)}</text>
            </g>
          );
        })}

        {/* x-axis ticks. */}
        {[0, 0.05, 0.10, 0.15, 0.20].map((tv) => (
          <g key={'xt-' + tv}>
            <line x1={x(tv)} y1={SW_IH} x2={x(tv)} y2={SW_IH + 4} stroke={ED.rule} />
            <text x={x(tv)} y={SW_IH + 16} fontSize={10} fill={ED.inkFaint} textAnchor="middle"
                  fontFamily="var(--ed-mono, monospace)">{tv.toFixed(2)}</text>
          </g>
        ))}

        {/* x-axis label. */}
        <text x={SW_IW / 2} y={SW_IH + 34} fontSize={11} fill={ED.inkSoft}
              textAnchor="middle" fontFamily="var(--ed-mono, monospace)">heat time t</text>

        {/* y-axis label. */}
        <text x={-46} y={SW_IH / 2} fontSize={11} fill={ED.inkSoft} textAnchor="middle"
              transform={'rotate(-90,-46,' + (SW_IH / 2) + ')'}
              fontFamily="var(--ed-mono, monospace)">Tr_p,k(t)</text>

        {/* Zero baseline. */}
        <line x1={0} y1={y(0)} x2={SW_IW} y2={y(0)} stroke={ED.accent} strokeWidth={1} strokeDasharray="3,3" />
        <text x={SW_IW - 6} y={y(0) - 4} fontSize={10} fill={ED.accent} textAnchor="end"
              fontFamily="var(--ed-mono, monospace)">positivity floor</text>

        {/* Vertical guide at t = 0.02 (imp-440 regime). */}
        <line x1={x(tHeat)} y1={0} x2={x(tHeat)} y2={SW_IH} stroke={ED.series3} strokeWidth={1} strokeDasharray="4,3" />
        <text x={x(tHeat) + 4} y={12} fontSize={10} fill={ED.series3}
              fontFamily="var(--ed-mono, monospace)">t = 0.02</text>

        {/* Trace polyline. */}
        <polyline points={polyline} fill="none" stroke={ED.brassDeco} strokeWidth={2} />

        {/* Marker at (tHeat, tHeatTrace). */}
        <circle cx={x(tHeat)} cy={y(tHeatTrace)} r={4} fill={ED.series3} stroke={ED.paper} strokeWidth={1} />
        <text x={x(tHeat) + 10} y={y(tHeatTrace) - 8} fontSize={11} fill={ED.series3}
              fontFamily="var(--ed-mono, monospace)">{tHeatTrace.toFixed(4)}</text>
      </g>
    </svg>
  );
}

// ── Per-prime contributions table. ────────────────────────────────────

function ContributionsTable() {
  const rows = CONNES_ADELIC_LAMBDA.perPrimeContributions;
  const kMax = CONNES_ADELIC_LAMBDA.kMax;
  const headers = [];
  for (let k = 1; k <= kMax; k++) headers.push('k = ' + k);

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={{ ...thStyle, textAlign: 'left' }}>prime p</th>
          {headers.map((h) => (
            <th key={h} style={thStyle}>{h}</th>
          ))}
          <th style={{ ...thStyle, color: 'var(--green)' }}>per-prime sum</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={'p-' + r.prime}>
            <td style={{ ...tdStyle, textAlign: 'left', color: PRIME_COLOURS[r.prime], fontWeight: 700 }}>
              {r.prime}
            </td>
            {r.terms.map((v, i) => (
              <td key={'tk-' + r.prime + '-' + i} style={tdStyle}>{v.toFixed(6)}</td>
            ))}
            <td style={{ ...tdStyle, color: 'var(--green)', fontWeight: 700 }}>{r.perPrimeSum.toFixed(6)}</td>
          </tr>
        ))}
        <tr>
          <td style={{ ...tdStyle, fontWeight: 700, textAlign: 'left' }}>total</td>
          <td style={tdStyle} colSpan={kMax}></td>
          <td style={{ ...tdStyle, color: 'var(--green)', fontWeight: 700 }}>
            {CONNES_ADELIC_LAMBDA.truncatedTraceAtT0p02.toFixed(6)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ── Headline banner. ──────────────────────────────────────────────────

function VerdictBanner() {
  const passed = CONNES_ADELIC_LAMBDA.positivityHolds === true;
  const colour = passed ? 'var(--green)' : 'var(--terra-dk)';
  const tHeat  = CONNES_ADELIC_LAMBDA.tHeat;
  const trace  = CONNES_ADELIC_LAMBDA.truncatedTraceAtT0p02;
  const primesStr = '{' + CONNES_ADELIC_LAMBDA.primesUsed.join(', ') + '}';
  return (
    <div style={{
      ...panelStyle,
      borderColor: colour,
      borderLeftWidth: 4,
      paddingLeft: 20,
    }}>
      <div style={{
        fontFamily: 'var(--ed-mono, var(--font-mono))',
        fontSize: 12,
        color: colour,
        letterSpacing: 1,
        fontWeight: 700,
        marginBottom: 6,
      }}>
        {passed ? 'POSITIVITY HOLDS' : 'POSITIVITY FAILS'} -- imp-1109 consistency check
      </div>
      <div style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.6 }}>
        At heat time <strong style={{ color: colour }}>t = {tHeat}</strong> over the
        first 5 primes <strong>{primesStr}</strong> with K_MAX = {CONNES_ADELIC_LAMBDA.kMax}
        ({CONNES_ADELIC_LAMBDA.numberOfTerms} prime-side terms total, Selberg-style
        a_p(k) = 1), the truncated prime-side Weil-Connes trace evaluates to
        <span style={{ color: colour, fontWeight: 700, marginLeft: 6 }}>
          Tr_p,k(t) = {trace.toFixed(6)}
        </span>.
      </div>
      <div style={{ marginTop: 10, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6 }}>
        This is a necessary-but-not-sufficient consistency probe. It does NOT prove
        RH or the imp-440 finite-N Lambda bound; it confirms the prime-side
        transcription is sign-correct in the Selberg normalization. The deep
        positivity question (zero-side minus archimedean term, equivalent to RH)
        is OUT of scope for this artefact.
      </div>
    </div>
  );
}

// ── Page root. ─────────────────────────────────────────────────────────

export default function ConnesAdelicPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>

        <h1 className="ed-h1" style={{ marginBottom: 8 }}>
          Connes Adelic Spectral Interpretation
        </h1>
          <AnimationEmbed id="connes-adelic" />
        <div style={{
          color: 'var(--ink-soft)',
          fontSize: 13,
          marginBottom: 20,
          fontFamily: 'var(--ed-mono, var(--font-mono))',
        }}>
          Weil-positivity RH-equivalent route: survey + small numerical check of the
          Connes 1999 adelic spectral framework at the imp-440 finite-N Lambda regime
          (t = 0.02).
        </div>

        <VerdictBanner />

        <div style={{ marginTop: 20, ...panelStyle }}>
          <h2 style={h2Style}>Survey</h2>
          {CONNES_ADELIC_LAMBDA.surveyParagraphs.map((p, i) => (
            <div key={'sv-' + i} style={{ marginTop: i === 0 ? 0 : 14 }}>
              <h3 style={h3Style}>{p.heading}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, ...panelStyle }}>
          <h2 style={h2Style}>The math</h2>
          <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
            <p style={{ marginTop: 0 }}>
              <strong>Weil-Connes explicit formula on the adele class space.</strong> For
              an admissible test function <InlineMath tex="h" /> on the spectrum with
              Fourier transform <InlineMath tex="g" />:
            </p>
            <BlockMath tex={'\\sum_{\\gamma}\\, h(\\gamma)\\;=\\;h(i/2) \\,+\\, h(-i/2)\\,+\\,W_\\infty(h)\\,+\\,\\sum_{p}\\, W_p(h)'} />
            <p>
              <strong>Local finite-place term.</strong> At prime <InlineMath tex="p" />:
            </p>
            <BlockMath tex={'W_p(h)\\;=\\;\\log p\\,\\sum_{k\\geq 1} p^{-k/2}\\,\\bigl[\\,g(k\\log p)\\,+\\,g(-k\\log p)\\,\\bigr]'} />
            <p>
              <strong>Heat flow.</strong> The de Bruijn-Newman heat flow at time
              <InlineMath tex="t" /> deforms the test function by a Gaussian damping
              in the Fourier variable:
            </p>
            <BlockMath tex={'g_t(u)\\;=\\;g(u)\\,\\exp\\!\\bigl(-t\\,u^2\\bigr)'} />
            <p>
              <strong>Conjectural Lambda reformulation.</strong>
            </p>
            <BlockMath tex={'\\Lambda \\;=\\; -\\,\\inf\\bigl\\{\\,t\\;:\\;\\sum_{\\gamma}\\,h_t(\\gamma)\\;\\geq\\;0\\;\\text{for every admissible positive }h\\,\\bigr\\}'} />
            <p>
              <strong>Truncated prime-side trace</strong> over primes
              <InlineMath tex="\\,\\{2,3,5,7,11\\}" /> at <InlineMath tex="K_{\\max}=5" />
              with <InlineMath tex="a_p(k)=1" />:
            </p>
            <BlockMath tex={'\\mathrm{Tr}_{p,K}(t)\\;=\\;\\sum_{p\\in P}\\,\\log p\\,\\sum_{k=1}^{K}\\,p^{-k/2}\\,\\exp\\!\\bigl(-t\\,(k\\log p)^2\\bigr)'} />
          </div>
        </div>

        <div style={{ marginTop: 20, ...panelStyle }}>
          <h2 style={h2Style}>Per-prime contributions at t = 0.02</h2>
          <div style={{ color: 'var(--faint)', fontSize: 12, marginBottom: 10 }}>
            Each cell is the prime-power term log(p) * p^(-k/2) * exp(-t * (k * log p)^2) at t = 0.02.
            Per-prime sums and the total are highlighted green. Every entry is positive by construction.
          </div>
          <div style={{ overflowX: 'auto' }}>
            <ContributionsTable />
          </div>
        </div>

        <div style={{ marginTop: 20, ...panelStyle }}>
          <h2 style={h2Style}>Heat-flow sweep: Tr_p,K(t) for t in [0, 0.2]</h2>
          <div style={{ color: 'var(--faint)', fontSize: 12, marginBottom: 10 }}>
            21-point sweep step 0.01. Brass curve is the truncated prime-side trace;
            green dashed guide marks the imp-440 finite-N Lambda regime at t = 0.02
            (consistency-check value {CONNES_ADELIC_LAMBDA.truncatedTraceAtT0p02.toFixed(4)});
            terracotta dashed line is the positivity floor. The sweep is monotone non-increasing
            because every term is damped by the heat flow.
          </div>
          <HeatFlowSweep />
        </div>

        <div style={{ marginTop: 20, ...panelStyle }}>
          <h2 style={h2Style}>Scope</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            {CONNES_ADELIC_LAMBDA.honestScope}
          </p>
        </div>

        <div style={{ marginTop: 20, ...panelStyle }}>
          <h2 style={h2Style}>References</h2>
          <ul style={{
            color: 'var(--faint)',
            fontSize: 12,
            lineHeight: 1.7,
            paddingLeft: 20,
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            margin: 0,
          }}>
            {CONNES_ADELIC_LAMBDA.citations.map((c, i) => (
              <li key={'ref-' + i}>{c}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: 30, fontSize: 13, color: 'var(--ink-soft)', borderTop: '1px solid var(--hairline)', paddingTop: 20 }}>
          <p style={{ margin: 0 }}>
            <Link to="/">&larr; the atlas</Link>
          </p>
        </div>

        <RelatedLinks links={[
          { to: '/spectral-attack', label: 'Spectral Approach', color: 'var(--terra-dk)' },
          { to: '/rh-equivalents', label: 'RH Equivalents', color: 'var(--blue)' },
          { to: '/route-map', label: 'Route Map', color: 'var(--brass)' },
          { to: '/state-of-program', label: 'State of Program', color: 'var(--brass-dk)' },
        ]} />
      </div>
    </div>
  );
}
