import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { Figure, Pull, InlineMath, BlockMath } from '../components/editorial/PostLayout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED, alpha } from '../styles/tokens.js';

/* Editorial (warm post reading-view) presentation of Theorem B — the minimal-gap
   sharp Θ-trap threshold Θ_b = (√73 − 5)/8. All mathematical text, numbers,
   thresholds, TeX identities, table cells and caveats are preserved verbatim from
   the prior inline page (sg1c-theta-trap-theorems.js); this file only restyles it. */

// THEOREM B (sg1c-theta-trap-theorems.js): minimal-gap Theta-trap, SHARP threshold.
//   If g is the minimal gap then mu_j = g^2 T_j <= 1/2, sum mu_j = 2 Theta; the
//   power sums are Schur-convex (maximized by the capped-greedy profile) and the
//   boundary sign condition dTheta/ds <= 0 reduces EXACTLY to
//        r (2 r^2 + 7 r - 3) <= 0,   with   Theta = 1/4 + r/2.
//   For r >= 0 this holds iff r <= r_b = (sqrt(73) - 7)/4, i.e.
//        Theta <= Theta_b := (sqrt(73) - 5)/8 = 0.443000...
//   and Theta_b is EXACT: the greedy profile {-1, 0, 1, 1+d_2} (d_1 = g saturates
//   the mu = 1/2 cap, d_2 = 1.1854 g opposite) has dTheta/ds = 0 at Theta_b and > 0
//   above it.

const SQRT73 = Math.sqrt(73);
const THETA_B = (SQRT73 - 5) / 8;       // 0.443000468...
const R_B = (SQRT73 - 7) / 4;           // 0.386000936...

// Exact static boundary polynomial on the Schur-maximal (capped-greedy) profile.
// Q(Theta) <= 0  <=>  the minimal-gap trap holds at level Theta.
function rOf(theta) { return 2 * theta - 0.5; }        // Theta = 1/4 + r/2
function Q(theta) { const r = rOf(theta); return r * (2 * r * r + 7 * r - 3); }

// Measured dTheta/ds on the capped-greedy profile {-1,0,1,1+d_2}, from the data
// module's tabulated sharpness cross-check (imp-3037/imp-3044): strictly negative
// below Theta_b, EXACTLY 0 at Theta_b, strictly positive above.
const MEASURED_RATE = [
  { theta: 0.430, rate: -0.0837, note: 'trap holds (static)' },
  { theta: 0.435, rate: -0.0504, note: 'trap holds (static)' },
  { theta: 0.440, rate: -0.0176, note: 'trap holds (static)' },
  { theta: THETA_B, rate: 0.0, note: 'SHARP threshold — sign flip' },
  { theta: 0.448, rate: +0.0339, note: 'static crossing (dynamically re-trapped)' },
  { theta: 0.460, rate: +0.1230, note: 'static crossing (dynamically re-trapped)' },
];

// The Theta trap ladder (what is proven at each level, and by which route).
const LADDER = [
  { theta: 0.25, label: 'Θ_A = 1/4', color: 'var(--terra-dk)', kind: 'Theorem A', note: 'unconditional — EVERY adjacent pair, no hypothesis' },
  { theta: THETA_B, label: 'Θ_b = (√73−5)/8', color: 'var(--brass)', kind: 'Theorem B', note: 'minimal-gap, static — SHARP (this page)' },
  { theta: 0.5, label: 'Θ = 1/2', color: 'var(--green)', kind: 'Lemma R1-T', note: 'dynamic excursion cap on the symmetric tie family' },
  { theta: 0.5073, label: 'Θ ≈ 0.5073', color: 'var(--blue)', kind: 'dressed tie', note: 'asymmetric/dressed tie max (band ceiling)' },
];

const HAIR = ED.rule;

function BoundaryPolyChart() {
  const svgW = 580, svgH = 260;
  const padL = 52, padR = 16, padT = 16, padB = 36;
  const cW = svgW - padL - padR, cH = svgH - padT - padB;
  const xMin = 0.25, xMax = 0.50;
  const points = useMemo(() => {
    const pts = [];
    for (let t = xMin; t <= xMax + 1e-9; t += 0.002) pts.push({ t, q: Q(t) });
    return pts;
  }, []);
  const qVals = points.map((p) => p.q);
  const yMin = Math.min(...qVals) * 1.15, yMax = Math.max(...qVals) * 1.15 || 0.05;
  const xScale = (t) => padL + ((t - xMin) / (xMax - xMin)) * cW;
  const yScale = (q) => padT + cH * (1 - (q - yMin) / (yMax - yMin));
  const y0 = yScale(0);

  const negPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(p.t).toFixed(2)},${yScale(p.q).toFixed(2)}`).join(' ');
  const xTicks = [0.25, 0.30, 0.35, 0.40, 0.443, 0.50];

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ maxWidth: 620 }}>
      {/* zero line */}
      <line x1={padL} y1={y0} x2={padL + cW} y2={y0} stroke={HAIR} strokeDasharray="3 3" />
      <text x={padL + cW} y={y0 - 4} fill={ED.inkFaint} fontSize={9} textAnchor="end">Q = 0 (sign boundary)</text>

      {/* trap-holds shading Theta in [1/4, Theta_b] */}
      <rect x={xScale(0.25)} y={padT} width={xScale(THETA_B) - xScale(0.25)} height={cH}
        fill={alpha(ED.series3, 0.1)} />
      <text x={(xScale(0.25) + xScale(THETA_B)) / 2} y={padT + 12} fill={ED.series3} fontSize={9} textAnchor="middle">
        trap holds (Q ≤ 0)
      </text>
      <rect x={xScale(THETA_B)} y={padT} width={xScale(xMax) - xScale(THETA_B)} height={cH}
        fill={alpha(ED.series2, 0.08)} />
      <text x={(xScale(THETA_B) + xScale(xMax)) / 2} y={padT + 12} fill={ED.accent} fontSize={9} textAnchor="middle">
        static crossing (Q &gt; 0)
      </text>

      {/* Q curve */}
      <path d={negPath} fill="none" stroke={ED.brass} strokeWidth={2} />

      {/* Theta_b marker */}
      <line x1={xScale(THETA_B)} y1={padT} x2={xScale(THETA_B)} y2={padT + cH} stroke={ED.brass} strokeWidth={1.4} strokeDasharray="4 3" />
      <circle cx={xScale(THETA_B)} cy={y0} r={4} fill={ED.brass} />
      <text x={xScale(THETA_B)} y={padT + cH + 22} fill={ED.brass} fontSize={9} textAnchor="middle">Θ_b = 0.443</text>

      {/* axes */}
      {xTicks.map((v) => (
        <g key={v}>
          <text x={xScale(v)} y={svgH - 22} fill={ED.inkFaint} fontSize={8} textAnchor="middle">{v}</text>
          <line x1={xScale(v)} y1={padT + cH} x2={xScale(v)} y2={padT + cH + 3} stroke={HAIR} />
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 6} fill={ED.inkFaint} fontSize={9} textAnchor="middle">Θ (trap level)</text>
      <text x={14} y={padT + cH / 2} fill={ED.inkFaint} fontSize={9} textAnchor="middle"
        transform={`rotate(-90, 14, ${padT + cH / 2})`}>
        Q(Θ) = r(2r²+7r−3), r = 2Θ−½
      </text>
    </svg>
  );
}

function TrapLadder() {
  const svgW = 580, svgH = 120;
  const padL = 20, padR = 20, padT = 40, padB = 20;
  const cW = svgW - padL - padR;
  const xMin = 0.20, xMax = 0.55;
  const xScale = (t) => padL + ((t - xMin) / (xMax - xMin)) * cW;
  const axisY = padT + 24;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ maxWidth: 620 }}>
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke={ED.rule} strokeWidth={1.5} />
      {[0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55].map((v) => (
        <g key={v}>
          <line x1={xScale(v)} y1={axisY - 3} x2={xScale(v)} y2={axisY + 3} stroke={HAIR} />
          <text x={xScale(v)} y={axisY + 16} fill={ED.inkFaint} fontSize={8} textAnchor="middle">{v.toFixed(2)}</text>
        </g>
      ))}
      {LADDER.map((m, i) => {
        const x = xScale(m.theta);
        const up = i % 2 === 0;
        const ly = up ? axisY - 30 : axisY + 30;
        return (
          <g key={m.label}>
            <line x1={x} y1={axisY} x2={x} y2={ly} stroke={m.color} strokeWidth={1} strokeDasharray="2 2" />
            <circle cx={x} cy={axisY} r={4} fill={m.color} />
            <text x={x} y={up ? ly - 4 : ly + 10} fill={m.color} fontSize={9} textAnchor="middle" fontWeight={700}>{m.kind}</text>
          </g>
        );
      })}
      <text x={padL} y={16} fill={ED.inkFaint} fontSize={10} fontWeight={700}>The Θ-trap ladder</text>
    </svg>
  );
}

export default function TheoremBThresholdPage() {
  return (
    <PostLayout
      grade="RESULT"
      meta={['minimal-gap Θ-trap · sharp threshold', 'closed-form constant']}
      title="Theorem B: The Minimal-Gap Sharp Threshold Θ_b = (√73 − 5)/8"
      dek="The minimal-gap hypothesis pushes the static Θ-trap up to a closed-form, provably sharp ceiling Θ_b = (√73 − 5)/8 = 0.443000…, where the exact sign boundary lands on the closed form."
      byline={['sg1c Θ-trap theorems · explorezeta', 'static route, sharp endpoint']}
      ticker={<span>sharpens one internal step of the finite-N program · no Λ bound changes</span>}
      footer={<>
        Related: <Link to="/theta-static-obstruction">Theorem R1-T2 (static-route obstruction)</Link>
        {' · '}<Link to="/theta-seizing-margin">Lemma R1-T3 (seizing margin)</Link>
        {' · '}<Link to="/theta-basin-closure">Lemma R1-T4 (dynamical basin closure)</Link>
        {' · '}<Link to="/spectral-attack">Spectral Approach overview</Link>
        <br /><br />← <Link to="/">the atlas</Link>
      </>}
    >
      <p className="lead">
        For the attractive Calogero–Moser flow{' '}
        <InlineMath tex={"\\dot x_k = -2\\sum_{j\\neq k}\\tfrac{1}{x_k-x_j}"} />, a colliding pair with gap{' '}
        <InlineMath tex={"g"} /> carries the environment functional{' '}
        <InlineMath tex={"\\Theta = \\tfrac{1}{2}g^2\\!\\sum_j T_j"} /> (with{' '}
        <InlineMath tex={"T_j = \\tfrac{1}{(x_k-x_j)(x_{k+1}-x_j)}"} />). A level{' '}
        <InlineMath tex={"\\Theta^\\ast"} /> is a <strong>trap</strong> if{' '}
        <InlineMath tex={"\\Theta(s_0)\\le\\Theta^\\ast"} /> forces{' '}
        <InlineMath tex={"\\Theta(s)\\le\\Theta^\\ast"} /> up to collision. Theorem&nbsp;A gives the
        unconditional trap at <InlineMath tex={"1/4"} />. <strong style={{ color: 'var(--brass)' }}>Theorem&nbsp;B</strong>{' '}
        adds the single hypothesis that <InlineMath tex={"g"} /> is the <em>minimal</em> gap and pushes the
        static trap up to a <strong>closed-form, provably sharp</strong> ceiling.
      </p>

      <AnimationEmbed id="theta-trap" />

      <BlockMath tex={"\\boxed{\\;\\Theta^\\ast \\;\\le\\; \\Theta_b \\;:=\\; \\frac{\\sqrt{73}-5}{8} \\;=\\; 0.443000\\ldots\\;}"} />

      {/* Statement / proof spine */}
      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab" style={{ color: 'var(--brass)' }}>Statement &amp; proof spine</div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.8 }}>
          The minimal-gap hypothesis pins each environment weight to{' '}
          <InlineMath tex={"\\mu_j := g^2 T_j \\le \\tfrac12"} /> (no neighbour is closer than <InlineMath tex={"g"} />),
          while <InlineMath tex={"\\sum_j \\mu_j = 2\\Theta"} />. The boundary sign condition{' '}
          <InlineMath tex={"d\\Theta/ds \\le 0"} /> is a sum of <em>power sums</em> of the{' '}
          <InlineMath tex={"\\mu_j"} />, which are Schur-convex — so the worst case is the{' '}
          <strong>capped-greedy profile</strong> (pour mass into <InlineMath tex={"\\mu = 1/2"} /> caps).
          Substituting it collapses the whole inequality to a single cubic in{' '}
          <InlineMath tex={"r"} />, where <InlineMath tex={"\\Theta = \\tfrac14 + \\tfrac{r}{2}"} />:
        </p>
        <BlockMath tex={"r\\,(2r^2 + 7r - 3) \\;\\le\\; 0 \\qquad\\Longleftrightarrow\\qquad 0 \\le r \\le r_b = \\frac{\\sqrt{73}-7}{4}"} />
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.8 }}>
          and <InlineMath tex={"\\Theta_b = \\tfrac14 + \\tfrac{r_b}{2} = \\tfrac{2 + (\\sqrt{73}-7)}{8} = \\tfrac{\\sqrt{73}-5}{8}"} />.
          The root <InlineMath tex={"r_b"} /> is where <InlineMath tex={"2r^2+7r-3"} /> changes sign — no
          approximation enters.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {[
            { label: 'Θ_b', val: THETA_B.toFixed(6), note: '(√73−5)/8', color: 'var(--brass)' },
            { label: 'r_b', val: R_B.toFixed(6), note: '(√73−7)/4', color: 'var(--blue)' },
            { label: 'Theorem A floor', val: '0.250000', note: '1/4, unconditional', color: 'var(--terra-dk)' },
            { label: 'gain over 1/4', val: (THETA_B - 0.25).toFixed(6), note: '+77% margin', color: 'var(--green)' },
          ].map(({ label, val, note, color }) => (
            <div key={label} style={{ flex: '1 1 130px', padding: '8px 12px', background: 'var(--paper2)', borderRadius: 6, borderTop: `2px solid ${color}` }}>
              <div style={{ color, fontSize: 11, fontWeight: 700 }}>{label}</div>
              <div style={{ color: 'var(--ink)', fontSize: 13, fontFamily: 'monospace' }}>{val}</div>
              <div style={{ color: 'var(--faint)', fontSize: 10 }}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Boundary polynomial chart */}
      <h2>The exact sign boundary crosses zero at Θ_b</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7 }}>
        On the Schur-maximal profile the boundary quantity is{' '}
        <InlineMath tex={"Q(\\Theta) = r(2r^2+7r-3)"} />, <InlineMath tex={"r = 2\\Theta-\\tfrac12"} />.
        It is <strong style={{ color: 'var(--green)' }}>negative</strong> (trap holds) throughout{' '}
        <InlineMath tex={"[\\tfrac14, \\Theta_b]"} /> and turns <strong style={{ color: 'var(--terra-dk)' }}>positive</strong>{' '}
        exactly at <InlineMath tex={"\\Theta_b"} /> — the sign flip <em>lands on the closed form</em>, which is
        what "sharp" means: no static bound reaches higher.
      </p>
      <Figure caption="The exact sign boundary Q(Θ) = r(2r²+7r−3), r = 2Θ−½, on the Schur-maximal (capped-greedy) profile: negative (trap holds) on [1/4, Θ_b], crossing zero exactly at Θ_b = 0.443.">
        <BoundaryPolyChart />
      </Figure>

      {/* Measured rate — sharpness cross-check */}
      <h2>Sharpness cross-check: dΘ/ds on the extremal profile</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7 }}>
        The capped-greedy extremizer is the explicit 4-configuration{' '}
        <InlineMath tex={"\\{-1, 0, 1, 1{+}d_2\\}"} /> with <InlineMath tex={"d_1 = g"} /> saturating the{' '}
        <InlineMath tex={"\\mu = 1/2"} /> cap and <InlineMath tex={"d_2 = 1.1854\\,g"} /> opposite. Sweeping the
        trap level through <InlineMath tex={"\\Theta_b"} />, the measured rate flips sign precisely on the
        threshold (values from the data-module tabulation):
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${HAIR}`, background: 'var(--paper2)' }}>
              {['Θ level', 'measured dΘ/ds', 'verdict'].map((h) => (
                <th key={h} style={{ color: 'var(--faint)', fontWeight: 600, padding: '6px 10px', textAlign: 'left', border: '1px solid var(--hairline)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEASURED_RATE.map((row) => {
              const isThresh = Math.abs(row.theta - THETA_B) < 1e-6;
              const rateColor = row.rate < -1e-9 ? 'var(--green)' : row.rate > 1e-9 ? 'var(--terra-dk)' : 'var(--brass)';
              return (
                <tr key={row.theta} style={{ borderBottom: `1px solid ${HAIR}`, background: isThresh ? 'color-mix(in srgb, var(--brass) 10%, transparent)' : 'transparent' }}>
                  <td style={{ padding: '7px 10px', color: 'var(--ink)', fontFamily: 'monospace', border: '1px solid var(--hairline)' }}>
                    {row.theta.toFixed(6)}{isThresh ? ' = Θ_b' : ''}
                  </td>
                  <td style={{ padding: '7px 10px', color: rateColor, fontFamily: 'monospace', border: '1px solid var(--hairline)' }}>
                    {row.rate === 0 ? '0.0000 (exact)' : (row.rate > 0 ? '+' : '') + row.rate.toFixed(4)}
                  </td>
                  <td style={{ padding: '7px 10px', color: 'var(--ink-soft)', fontSize: 11, border: '1px solid var(--hairline)' }}>{row.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ color: 'var(--faint)', fontSize: 12, marginTop: 10, lineHeight: 1.7 }}>
        Strictly negative below, exactly 0 at <InlineMath tex={"\\Theta_b = 0.443000"} />, strictly positive
        above (headline <InlineMath tex={"+0.034"} /> at 0.448, reproduced to 3 digits). The sign flip on the
        threshold certifies both directions: the trap holds up to <InlineMath tex={"\\Theta_b"} />, and some
        minimal-gap configuration crosses at every higher level.
      </p>

      {/* Where it sits — the ladder */}
      <h2>Where Θ_b sits in the trap ladder</h2>
      <Figure caption="The Θ-trap ladder: Θ_A = 1/4 (Theorem A), Θ_b = (√73−5)/8 (Theorem B, this page), Θ = 1/2 (Lemma R1-T), Θ ≈ 0.5073 (dressed tie band ceiling).">
        <TrapLadder />
      </Figure>
      <div style={{ marginTop: 6 }}>
        {LADDER.map((m) => (
          <div key={m.label} style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '4px 0', borderBottom: `1px solid ${HAIR}` }}>
            <span style={{ color: m.color, fontFamily: 'monospace', fontSize: 12, minWidth: 130, fontWeight: 700 }}>{m.label}</span>
            <span style={{ color: 'var(--ink)', fontSize: 12, minWidth: 90 }}>{m.kind}</span>
            <span style={{ color: 'var(--ink-soft)', fontSize: 12 }}>{m.note}</span>
          </div>
        ))}
      </div>

      <Pull>the sign flip lands on the closed form Θ_b = 0.443 — that is what "sharp" means for the static route</Pull>

      {/* Status */}
      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra-dk)' }}>
        <div className="tlab" style={{ color: 'var(--terra-dk)' }}>Status — what Θ_b does and does not buy</div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.8 }}>
          <strong style={{ color: 'var(--ink)' }}>What it closes:</strong> the sharp static minimal-gap trap in exact
          closed form. Because the sign flip lands on <InlineMath tex={"\\Theta_b"} />, it also proves the
          <em> limit of the static route</em>: no configuration-only inequality can push the ceiling above
          0.443. That is a genuine, self-certifying endpoint.
        </p>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.8 }}>
          <strong style={{ color: 'var(--ink)' }}>What it does not do:</strong> it is <em>not</em> an absolute
          excursion cap. The optimistic SG1c (some absolute <InlineMath tex={"\\Theta^\\ast < 1"} />) is
          refuted on the band <InlineMath tex={"(0.443, 0.5073)"} />: explicit minimal-gap families rise above
          0.443 before minimality switches. Those crossings are <strong>dynamically re-trapped</strong> by the
          seizing mechanism (<Link to="/theta-seizing-margin">Lemma R1-T3</Link>) —
          the rising pair sheds minimality to a lower-Θ competitor — capping the real excursion at{' '}
          <InlineMath tex={"1/2"} /> on the symmetric family. Θ_b marks exactly where the argument must hand
          off from static to dynamic.
        </p>
        <p style={{ color: 'var(--faint)', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          Context: the measured real-zero configurations sit at <InlineMath tex={"\\Theta(0) = 0.167 / 0.088 / 0.046"} />,
          far below even the unconditional <InlineMath tex={"1/4"} /> of Theorem&nbsp;A — so on the actual data the
          collision bound applies unconditionally; Theorem&nbsp;B and the excursion band are about the skeptical
          worst case, not the tested rows. This does not change any Λ bound (the peer-reviewed benchmark stays
          Platt–Trudgian <InlineMath tex={"\\Lambda \\le 0.2"} />); it sharpens one internal step of the finite-N program.
        </p>
      </div>
    </PostLayout>
  );
}
