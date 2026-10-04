import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33964_LJUNG_BOX_PORTMANTEAU_TEST } from '../data/imp-33964-ljung-box-portmanteau-test.js';
import { IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION } from '../data/imp-34025-ar2-breusch-godfrey-serial-correlation.js';
import { IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST } from '../data/imp-33963-dickey-fuller-unit-root-test.js';
import { IMP34024_KPSS_STATIONARITY_BRACKET } from '../data/imp-34024-kpss-stationarity-bracket.js';
import { IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST } from '../data/imp-33886-widening-residual-significance-test.js';
import { ED } from '../styles/tokens.js';

const LB = IMP33964_LJUNG_BOX_PORTMANTEAU_TEST;
const AR2 = IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION;
const DF = IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST;
const KPSS = IMP34024_KPSS_STATIONARITY_BRACKET;
const DW = IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST;

const LAGS = [1, 2, 3, 4, 5];

// Panel 1: the sample ACF r_1..r_5 of the 21 imp-33858 residuals, sign-changing at lag 4.
function AcfChart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 60;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = -0.35;
  const yMax = 0.85;
  const xAt = (lag) => padL + ((lag - 0.5) / LAGS.length) * cW;
  const barW = (cW / LAGS.length) * 0.55;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;
  const yZero = yAt(0);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yZero} x2={padL + cW} y2={yZero} stroke={ED.rule} strokeWidth={1} />
      {LB.autocorrelations.map((r, i) => {
        const lag = LAGS[i];
        const x = xAt(lag) - barW / 2;
        const y = r >= 0 ? yAt(r) : yZero;
        const h = Math.abs(yAt(r) - yZero);
        return (
          <g key={lag}>
            <rect x={x} y={y} width={barW} height={h} fill={r >= 0 ? ED.series1 : ED.series2} opacity={0.85} rx={2} />
            <text x={xAt(lag)} y={r >= 0 ? y - 6 : y + h + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              {r.toFixed(3)}
            </text>
            <text x={xAt(lag)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
              lag {lag}
            </text>
          </g>
        );
      })}
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        r_lag
      </text>
      <text x={padL + cW - 4} y={padT + 10} textAnchor="end" fill={ED.series2} fontSize={9.5}>
        first negative at lag {LB.firstNegativeAutocorrLag}
      </text>
    </svg>
  );
}

// Panel 2: the Ljung-Box Q_m vs the 1% chi-square_m critical value, m = 1..5.
function LjungBoxChart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 60;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMax = Math.max(...LB.ljungBoxQ) * 1.1;
  const xAt = (m) => padL + ((m - 0.5) / LAGS.length) * cW;
  const barW = (cW / LAGS.length) * 0.5;
  const yAt = (y) => padT + cH - (y / yMax) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {LB.ljungBoxQ.map((q, i) => {
        const m = LAGS[i];
        const x = xAt(m) - barW / 2;
        const yTop = yAt(q);
        return (
          <g key={m}>
            <rect x={x} y={yTop} width={barW} height={padT + cH - yTop} fill={ED.series5} opacity={0.85} rx={2} />
            <text x={xAt(m)} y={yTop - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              {q.toFixed(2)}
            </text>
            <line
              x1={x - 4}
              y1={yAt(LB.chiSquare01[i])}
              x2={x + barW + 4}
              y2={yAt(LB.chiSquare01[i])}
              stroke={ED.series2}
              strokeWidth={1.5}
              strokeDasharray="3,2"
            />
            <text x={xAt(m)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
              m={m}
            </text>
          </g>
        );
      })}
      <text x={padL + cW - 4} y={padT + 10} textAnchor="end" fill={ED.series2} fontSize={9.5}>
        dashed = 1% chi-square_m (every Q_m clears it)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        Q_m
      </text>
    </svg>
  );
}

// Panel 3: the AR(2) complex-root damped-sinusoid theoretical ACF vs the empirical ACF.
function Ar2Chart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 60;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = -0.35;
  const yMax = 1.0;
  const xAt = (lag) => padL + ((lag - 1) / (LAGS.length - 1)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;
  const yZero = yAt(0);

  const empPts = AR2.empiricalAcf.map((r, i) => `${xAt(LAGS[i])},${yAt(r)}`).join(' ');
  const ar2Pts = AR2.ar2TheoreticalAcf.map((r, i) => `${xAt(LAGS[i])},${yAt(r)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yZero} x2={padL + cW} y2={yZero} stroke={ED.rule} strokeWidth={1} strokeDasharray="3,3" />
      <polyline points={empPts} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="5,3" />
      <polyline points={ar2Pts} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      {LAGS.map((lag) => (
        <text key={lag} x={xAt(lag)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
          lag {lag}
        </text>
      ))}
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        ACF
      </text>
      <line x1={padL + 360} y1={padT + 4} x2={padL + 380} y2={padT + 4} stroke={ED.brassDeco} strokeWidth={2} />
      <text x={padL + 384} y={padT + 8} fill={ED.brass} fontSize={9.5}>
        AR(2) theoretical (modulus {AR2.rootModulus.toFixed(3)}, period {AR2.pseudoPeriodRungs.toFixed(1)})
      </text>
      <line
        x1={padL + 360}
        y1={padT + 20}
        x2={padL + 380}
        y2={padT + 20}
        stroke={ED.series2}
        strokeWidth={2}
        strokeDasharray="5,3"
      />
      <text x={padL + 384} y={padT + 24} fill={ED.series2} fontSize={9.5}>
        empirical (imp-33964)
      </text>
    </svg>
  );
}

// Panel 4: the DF tau / KPSS eta / Durbin-Watson bracket, each statistic against its critical values.
function Gauge({ label, lo, hi, marks, value, valueLabel, rejects }) {
  const svgW = 680;
  const svgH = 62;
  const padL = 160;
  const padR = 24;
  const cW = svgW - padL - padR;
  const xAt = (v) => padL + ((v - lo) / (hi - lo)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={0} y={22} fill={ED.inkSoft} fontSize={11.5} fontWeight={600}>
        {label}
      </text>
      <line x1={padL} y1={20} x2={padL + cW} y2={20} stroke={ED.rule} strokeWidth={1} />
      {marks.map((m) => (
        <g key={m.label}>
          <line x1={xAt(m.v)} y1={10} x2={xAt(m.v)} y2={30} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,2" />
          <text x={xAt(m.v)} y={44} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {m.label}
          </text>
        </g>
      ))}
      <circle cx={xAt(value)} cy={20} r={5} fill={rejects ? ED.series1 : ED.series2} />
      <text x={xAt(value)} y={4} textAnchor="middle" fill={rejects ? ED.series1 : ED.series2} fontSize={10} fontWeight={700}>
        {valueLabel}
      </text>
    </svg>
  );
}

function BracketStrip() {
  return (
    <div>
      <Gauge
        label="DF tau (unit-root null)"
        lo={-3}
        hi={0.5}
        marks={[
          { v: DF.dfCriticalValues.p01, label: '1%' },
          { v: DF.dfCriticalValues.p05, label: '5%' },
          { v: DF.dfCriticalValues.p10, label: '10%' },
        ]}
        value={DF.dfTau}
        valueLabel={`tau ${DF.dfTau.toFixed(2)}`}
        rejects={DF.unitRootRejectedAt10pct}
      />
      <Gauge
        label="KPSS eta (stationarity null)"
        lo={0}
        hi={0.85}
        marks={[
          { v: KPSS.kpssCriticalValuesLevel.p10, label: '10%' },
          { v: KPSS.kpssCriticalValuesLevel.p05, label: '5%' },
          { v: KPSS.kpssCriticalValuesLevel.p01, label: '1%' },
        ]}
        value={KPSS.etaLevelL4}
        valueLabel={`eta ${KPSS.etaLevelL4.toFixed(3)}`}
        rejects={KPSS.kpssLevelHacRejectsStationarityAt10pct}
      />
      <Gauge
        label="Durbin-Watson (white-noise null)"
        lo={0}
        hi={2}
        marks={[{ v: DW.durbinWatsonLowerBound5pct, label: 'd_L 5%' }]}
        value={DW.durbinWatson}
        valueLabel={`DW ${DW.durbinWatson.toFixed(3)}`}
        rejects={DW.durbinWatsonRejectsH0}
      />
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.5rem' }}>
        <span style={{ color: 'var(--series-1)' }}>blue dot</span> = this test rejects its null;{' '}
        <span style={{ color: 'var(--series-2)' }}>red dot</span> = this test does NOT reject its null. DF and KPSS both
        fail to reject (inconclusive bracket), while the Durbin-Watson runs test independently rejects white noise.
      </p>
    </div>
  );
}

export default function Imp34101SerialDependenceTestPanelViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Serial-Dependence Test Panel on the imp-33858 Residuals (imp-34101)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 720 }}>
        Five diagnostics probe the same 21 signed imp-33858 residuals from four angles: the sample ACF
        (imp-33964) shows a sign-changing negative lobe a positive AR(1) cannot produce; the Ljung-Box
        portmanteau Q_m rejects white noise at every lag horizon m=1..5; a second-order AR(2)
        (imp-34025) has complex-conjugate roots (modulus {AR2.rootModulus.toFixed(3)}) whose damped-sinusoid
        ACF reproduces the sign flip in direction but under-reproduces its depth, with a pseudo-period (
        {AR2.pseudoPeriodRungs.toFixed(1)} rungs) longer than the whole 21-rung sample; and the Dickey-Fuller
        tau ({DF.dfTau.toFixed(2)}) / KPSS eta ({KPSS.etaLevelL4.toFixed(3)}) bracket both fail to reject their
        (opposite) nulls, an inconclusive low-power verdict, even though the Durbin-Watson statistic (
        {DW.durbinWatson.toFixed(3)}) independently rejects white noise. Every test agrees the residual is
        non-white; the disagreement is only over whether that reflects a genuine unit root or an
        endpoint/curved-trend artifact of the OLS line fit to the imp-33858 hump.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        sample ACF r_1..r_5 -- sign-changing negative lobe from lag {LB.firstNegativeAutocorrLag}
      </p>
      <AcfChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        Ljung-Box Q_m vs the 1% chi-square_m critical value, m = 1..5
      </p>
      <LjungBoxChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        AR(2) complex-root damped-sinusoid ACF vs the empirical ACF
      </p>
      <Ar2Chart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        DF tau / KPSS eta / Durbin-Watson bracket against their critical values
      </p>
      <BracketStrip />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only, unifying imp-33886 /
        imp-33963 / imp-33964 / imp-34024 / imp-34025 / imp-34026 into one panel; no new statistic is computed
        here. Every test flags non-white residuals, but the DF/KPSS bracket reads that as low-power/
        inconclusive rather than a confirmed unit root, and the AR(2) pseudo-period exceeding the 21-rung
        sample reads the "cycle" as the single curved imp-33858 hump, not a stationary oscillation. This does
        not change the RMSE (~0.116, ~12% multiplicative), does not re-open the imp-33843 form selection, and
        touches no bound. The inherited imp-3220/imp-3406 component model is not a rigorous asymptotic; C_mb
        GUE-conditional per imp-486 untouched; C_C 1/8 ansatz untouched; imp-3066 K_a&gt;=0 untouched; NO QED.
      </div>
    </div>
  );
}
