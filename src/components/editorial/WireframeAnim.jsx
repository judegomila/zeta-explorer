import React from 'react';
import { ED } from '../../styles/tokens.js';

/* Wireframe-style animated SVG figures for the editorial simulator pages.
   Hairline line-art in the warm palette, animated with self-contained SMIL
   (no CSS deps). Decorative section headers — they illustrate the concept a
   simulator explores; the real interactive viz renders below them.

   <WireframeAnim kind="wave" />  →  traveling + reflected wave on a bounded string
   kinds: wave | oscillator | spectrum | lattice | twinladder
        | critical-strip   — the strip 0<Re s<1, line Re s=1/2, first zeros to scale
        | zeta-zero-vortex — phase portrait of arg(s−ρ): the hue winds once round a zero
        | heat-flow        — H_t roots: e^{−tD²} stays real, e^{+tD²} collides off-axis
        | gram-matrix      — Hermitian Gram heatmap with computed inertia (n+, n−)
        | contour-winding  — rectangle contour, winding number = #interior zeros
        | dirichlet-ladder — prime-power ladder: rungs at m·log p, to scale
        | twistor-fiber    — a Hopf circle family (nested-tori cross-section)
        | pair-correlation — Montgomery 1−(sin πx/πx)² vs the Poisson flat line
        | de-bruijn-track  — the Λ number line: Λ≥0 (RT) … Λ≤0.2 (PT), candidate marks
        | no-go-wall       — several routes funnelling into one barrier (C_H / PCC)
   The math figures are computed from the real geometry (zero heights, arg, heat
   flow of x²−a², log p, the pair-correlation kernel), not drawn by hand.
   Colors: --brass #8c6a1d, --terra #d9502e, hairline #d5c9b2, faint #877b67 */

const BRASS = ED.brass;
const TERRA = ED.accentDeco;
const HAIR = ED.rule;
const FAINT = ED.inkFaint;
const INK = ED.ink;

// Build a sine polyline over [0, width] with n full periods, sampled every step px.
function sinePath(width, mid, amp, periods, phase = 0, step = 6) {
  let d = '';
  for (let x = 0; x <= width; x += step) {
    const y = mid + amp * Math.sin((2 * Math.PI * periods * x) / width + phase);
    d += (x === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
  }
  return d.trim();
}

function Frame({ children }) {
  return (
    <svg width="100%" viewBox="0 0 320 160" preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }} role="img" aria-hidden="true">
      <rect width="320" height="160" fill={ED.paper} />
      {children}
    </svg>
  );
}

// Traveling wave (brass) + counter-propagating reflection (terra), on faint rungs.
function Wave() {
  // width 640 = 2× the 320 viewport and 8 periods, so translating by -320 loops seamlessly.
  const fwd = sinePath(640, 80, 34, 8, 0);
  const refl = sinePath(640, 80, 20, 8, Math.PI / 2);
  return (
    <Frame>
      <line x1="16" y1="80" x2="304" y2="80" stroke={HAIR} strokeWidth="1" />
      <g opacity="0.4">
        {Array.from({ length: 9 }, (_, i) => 16 + i * 36).map((x) => (
          <line key={x} x1={x} y1="26" x2={x} y2="134" stroke={HAIR} strokeWidth="0.75" />
        ))}
      </g>
      <clipPath id="wf-wave-clip"><rect x="0" y="0" width="320" height="160" /></clipPath>
      <g clipPath="url(#wf-wave-clip)">
        <g>
          <path d={fwd} fill="none" stroke={BRASS} strokeWidth="1.5" opacity="0.9" />
          <animateTransform attributeName="transform" type="translate"
            from="0 0" to="-320 0" dur="7s" repeatCount="indefinite" />
        </g>
        <g>
          <path d={refl} fill="none" stroke={TERRA} strokeWidth="1.2" opacity="0.55" />
          <animateTransform attributeName="transform" type="translate"
            from="-320 0" to="0 0" dur="9s" repeatCount="indefinite" />
        </g>
      </g>
    </Frame>
  );
}

// Prime oscillator: H_p(s)=1/(1-p^{-s}) is a resonator oscillating at ω=log p.
// A phasor rotating at that frequency generates the sinusoid to its right.
function Oscillator() {
  const cx = 66;
  const cy = 80;
  const r = 34;
  const sine = sinePath(174, 80, 34, 1, 0); // exactly one period, local coords
  return (
    <Frame>
      <line x1="112" y1="80" x2="300" y2="80" stroke={HAIR} strokeWidth="1" />
      {/* phasor on the complex circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIR} strokeWidth="1" />
      <g>
        <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={BRASS} strokeWidth="1.5" />
        <circle cx={cx + r} cy={cy} r="4" fill={TERRA} />
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${cx} ${cy}`} to={`-360 ${cx} ${cy}`} dur="3s" repeatCount="indefinite" />
      </g>
      {/* the sinusoid it generates — one cycle per rotation */}
      <g transform="translate(120 0)">
        <path d={sine} fill="none" stroke={BRASS} strokeWidth="1.3" opacity="0.55" />
        <circle r="4" fill={TERRA}>
          <animateMotion path={sine} dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      <text x={cx} y="150" fontFamily="IBM Plex Mono" fontSize="9" fill={FAINT} textAnchor="middle">ω = log p</text>
    </Frame>
  );
}

// Spectrum: bars with heights sweeping like a live FFT.
function Spectrum() {
  const bars = 22;
  return (
    <Frame>
      <line x1="16" y1="130" x2="304" y2="130" stroke={HAIR} strokeWidth="1" />
      {Array.from({ length: bars }, (_, i) => {
        const x = 20 + i * ((288) / bars);
        const base = 20 + 90 * Math.abs(Math.sin(i * 0.7));
        return (
          <rect key={i} x={x} y={130 - base} width={288 / bars - 4} height={base}
            fill={i % 5 === 0 ? TERRA : BRASS} opacity="0.75">
            <animate attributeName="height" values={`${base};${base * 0.35};${base}`}
              dur={`${2 + (i % 5) * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${130 - base};${130 - base * 0.35};${130 - base}`}
              dur={`${2 + (i % 5) * 0.4}s`} repeatCount="indefinite" />
          </rect>
        );
      })}
    </Frame>
  );
}

// Lattice: prime-ladder rungs with a pulse traveling down the rails.
function Lattice() {
  return (
    <Frame>
      <line x1="120" y1="18" x2="120" y2="142" stroke={BRASS} strokeWidth="1.2" />
      <line x1="200" y1="18" x2="200" y2="142" stroke={BRASS} strokeWidth="1.2" />
      {Array.from({ length: 7 }, (_, i) => 26 + i * 18).map((y) => (
        <line key={y} x1="120" y1={y} x2="200" y2={y} stroke={HAIR} strokeWidth="0.9" />
      ))}
      <circle r="4" fill={TERRA}>
        <animateMotion path="M120 18 L120 142" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle r="4" fill={TERRA} opacity="0.7">
        <animateMotion path="M200 142 L200 18" dur="3s" repeatCount="indefinite" />
      </circle>
    </Frame>
  );
}

// Twin ladder: two rung-stacks with an antisymmetric shear that oscillates.
function TwinLadder() {
  const shearA = 'M105 50 C160 50 160 110 215 110 M105 110 C160 110 160 50 215 50';
  const shearB = 'M105 42 C160 64 160 96 215 118 M105 118 C160 96 160 64 215 42';
  return (
    <Frame>
      {/* rails — both ladders in brass, the primary subject */}
      {[70, 105, 215, 250].map((x) => (
        <line key={x} x1={x} y1="22" x2={x} y2="138" stroke={BRASS} strokeWidth="1.4" />
      ))}
      {/* rungs — one ladder per prime scale */}
      <g opacity="0.8">
        {Array.from({ length: 7 }, (_, i) => 30 + i * 17).map((y) => (
          <g key={y}>
            <line x1="70" y1={y} x2="105" y2={y} stroke={BRASS} strokeWidth="1" />
            <line x1="215" y1={y} x2="250" y2={y} stroke={BRASS} strokeWidth="1" />
          </g>
        ))}
      </g>
      {/* the shear between them — a subtle accent */}
      <path fill="none" stroke={TERRA} strokeWidth="1.3" opacity="0.6">
        <animate attributeName="d" values={`${shearA};${shearB};${shearA}`} dur="4s" repeatCount="indefinite" />
      </path>
      <circle r="3.5" fill={BRASS}>
        <animateMotion path="M160 80 C160 50 160 110 160 80" dur="4s" repeatCount="indefinite" />
      </circle>
    </Frame>
  );
}

// ── critical-strip ─────────────────────────────────────────────────────────
// The strip 0<Re s<1 with the critical line Re s=1/2 and the first nontrivial
// zero ordinates marked at their TRUE relative heights (t = 14.13, 21.02, 25.01).
function CriticalStrip() {
  const zeros = [14.134725, 21.022040, 25.010858];
  const tMax = 28;
  const xOf = (re) => 60 + re * 200;      // Re=0 → 60, Re=1 → 260
  const yOf = (t) => 148 - (t / tMax) * 134; // t=0 bottom, t=tMax top
  const half = xOf(0.5);
  return (
    <Frame>
      {/* the critical strip 0<Re<1 */}
      <rect x={xOf(0)} y="14" width={xOf(1) - xOf(0)} height={148 - 14} fill={ED.paper2} opacity="0.7" />
      <line x1={xOf(0)} y1="14" x2={xOf(0)} y2="148" stroke={HAIR} strokeWidth="1" />
      <line x1={xOf(1)} y1="14" x2={xOf(1)} y2="148" stroke={HAIR} strokeWidth="1" />
      {/* real axis t=0 */}
      <line x1="30" y1={yOf(0)} x2="290" y2={yOf(0)} stroke={HAIR} strokeWidth="0.75" />
      {/* the critical line Re=1/2 */}
      <line x1={half} y1="14" x2={half} y2="148" stroke={TERRA} strokeWidth="1.3" strokeDasharray="4 3" />
      {/* zeros at their true heights on the critical line */}
      {zeros.map((t, i) => (
        <g key={t}>
          <circle cx={half} cy={yOf(t)} r="4" fill={TERRA}>
            <animate attributeName="r" values="4;5.4;4" dur={`${2.4 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={xOf(0)} cy={yOf(t)} r="0" />
          <line x1={half} y1={yOf(t)} x2="292" y2={yOf(t)} stroke={FAINT} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.7" />
          <text x="296" y={yOf(t) + 3} fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT}>{t.toFixed(2)}</text>
        </g>
      ))}
      <text x={xOf(0)} y="158" fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT} textAnchor="middle">0</text>
      <text x={xOf(1)} y="158" fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT} textAnchor="middle">1</text>
      <text x={half} y="12" fontFamily="IBM Plex Mono" fontSize="8" fill={TERRA} textAnchor="middle">Re s = ½</text>
    </Frame>
  );
}

// ── zeta-zero-vortex ───────────────────────────────────────────────────────
// Phase portrait patch of arg(s−ρ): color each cell by atan2 so the hue wheel
// winds exactly once around the zero at the centre (argument principle, N=1).
function ZetaZeroVortex() {
  const cols = 20, rows = 11;
  const x0 = 20, y0 = 14, cw = (300 - x0) / cols, ch = (150 - y0) / rows;
  const cx = 160, cy = 82;
  const cells = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const px = x0 + (i + 0.5) * cw;
      const py = y0 + (j + 0.5) * ch;
      const ang = Math.atan2(py - cy, px - cx);           // arg(s−ρ)
      const hue = ((ang * 180) / Math.PI + 360) % 360;    // wraps once → winding 1
      cells.push(
        <rect key={`${i}-${j}`} x={x0 + i * cw} y={y0 + j * ch} width={cw + 0.5} height={ch + 0.5}
          fill={`hsl(${hue.toFixed(0)} 52% 62%)`} opacity="0.85" />
      );
    }
  }
  return (
    <Frame>
      {cells}
      {/* rotating hand emphasises the single winding */}
      <g>
        <line x1={cx} y1={cy} x2={cx + 34} y2={cy} stroke={INK} strokeWidth="1.4" />
        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="6s" repeatCount="indefinite" />
      </g>
      <circle cx={cx} cy={cy} r="4.5" fill={ED.paper} stroke={INK} strokeWidth="1.3" />
      <text x={cx} y="12" fontFamily="IBM Plex Mono" fontSize="8" fill={INK} textAnchor="middle">arg(s − ρ) — winding = 1</text>
    </Frame>
  );
}

// ── heat-flow ──────────────────────────────────────────────────────────────
// Heat evolution of p(x)=x²−a² (a=1). u_t=u_xx gives u=x²−(a²−2t):
//   e^{−tD²}: roots ±√(a²+2t) — stay REAL, spread apart.
//   e^{+tD²}: roots ±√(a²−2t) — collide at t=½, then split to ±i√(2t−a²) OFF-axis.
function HeatFlow() {
  const a2 = 1, S = 46, SV = 30, cx = 160;
  const ts = Array.from({ length: 11 }, (_, k) => (k / 10) * 0.9);
  // top track (real, spreading) — right/left dot positions
  const topR = ts.map((t) => cx + Math.sqrt(a2 + 2 * t) * S);
  const topL = ts.map((t) => cx - Math.sqrt(a2 + 2 * t) * S);
  // bottom track (colliding then off-axis) — SV keeps the conjugate pair in-frame
  const yB = 118;
  const botRx = ts.map((t) => (t < a2 / 2 ? cx + Math.sqrt(a2 - 2 * t) * S : cx));
  const botRy = ts.map((t) => (t < a2 / 2 ? yB : yB - Math.sqrt(2 * t - a2) * SV));
  const botLx = ts.map((t) => (t < a2 / 2 ? cx - Math.sqrt(a2 - 2 * t) * S : cx));
  const botLy = ts.map((t) => (t < a2 / 2 ? yB : yB + Math.sqrt(2 * t - a2) * SV));
  const osc = (arr) => [...arr, ...arr.slice(0, -1).reverse()].map((v) => v.toFixed(1)).join(';');
  const DUR = '5s';
  return (
    <Frame>
      {/* top: real line, roots stay on it */}
      <text x="20" y="30" fontFamily="IBM Plex Mono" fontSize="8.5" fill={BRASS}>e^(−tD²)  roots stay real</text>
      <line x1="30" y1="52" x2="290" y2="52" stroke={HAIR} strokeWidth="1" />
      {/* faint end-state ghosts: top pair spreads along the line */}
      <circle cx={topR[topR.length - 1]} cy="52" r="4" fill="none" stroke={BRASS} strokeWidth="1" opacity="0.35" />
      <circle cx={topL[topL.length - 1]} cy="52" r="4" fill="none" stroke={BRASS} strokeWidth="1" opacity="0.35" />
      {[topR, topL].map((xs, k) => (
        <circle key={`t${k}`} cy="52" r="4" fill={BRASS}>
          <animate attributeName="cx" values={osc(xs)} dur={DUR} repeatCount="indefinite" />
        </circle>
      ))}
      {/* bottom: roots collide at centre then leave the line as a conjugate pair */}
      <text x="20" y="146" fontFamily="IBM Plex Mono" fontSize="8.5" fill={TERRA}>e^(+tD²)  collide → off-axis</text>
      <line x1="30" y1={yB} x2="290" y2={yB} stroke={HAIR} strokeWidth="1" />
      {/* off-axis escape axis + faint conjugate-pair destination ghosts */}
      <line x1={cx} y1={yB - 40} x2={cx} y2={yB + 40} stroke={TERRA} strokeWidth="0.75" strokeDasharray="2 3" opacity="0.5" />
      <circle cx={cx} cy={botRy[botRy.length - 1]} r="4" fill="none" stroke={TERRA} strokeWidth="1" opacity="0.4" />
      <circle cx={cx} cy={botLy[botLy.length - 1]} r="4" fill="none" stroke={TERRA} strokeWidth="1" opacity="0.4" />
      <text x={cx + 6} y={botRy[botRy.length - 1] + 3} fontFamily="IBM Plex Mono" fontSize="7" fill={FAINT} opacity="0.8">±i√(2t−a²)</text>
      <circle cy={yB} r="4" fill={TERRA}>
        <animate attributeName="cx" values={osc(botRx)} dur={DUR} repeatCount="indefinite" />
        <animate attributeName="cy" values={osc(botRy)} dur={DUR} repeatCount="indefinite" />
      </circle>
      <circle cy={yB} r="4" fill={TERRA}>
        <animate attributeName="cx" values={osc(botLx)} dur={DUR} repeatCount="indefinite" />
        <animate attributeName="cy" values={osc(botLy)} dur={DUR} repeatCount="indefinite" />
      </circle>
    </Frame>
  );
}

// ── gram-matrix ────────────────────────────────────────────────────────────
// A symmetric (Hermitian) weld Gram matrix rendered as a heatmap, with its
// inertia (n+, n−) computed live by symmetric LDLᵀ elimination (pivot signs).
function GramMatrix() {
  const M = [
    [1.0, 2.0, 0.3, 0.0, 0.0],
    [2.0, 1.0, 0.0, 0.3, 0.0],
    [0.3, 0.0, 2.0, 0.5, 0.0],
    [0.0, 0.3, 0.5, 2.0, 0.4],
    [0.0, 0.0, 0.0, 0.4, 2.0],
  ];
  const n = M.length;
  // inertia via LDLᵀ pivot signs
  const A = M.map((r) => r.slice());
  let np = 0, nn = 0, nz = 0;
  for (let i = 0; i < n; i++) {
    const p = A[i][i];
    if (Math.abs(p) < 1e-9) { nz++; continue; }
    if (p > 0) np++; else nn++;
    for (let r = i + 1; r < n; r++) {
      const f = A[r][i] / p;
      for (let c = i; c < n; c++) A[r][c] -= f * A[i][c];
    }
  }
  const maxAbs = Math.max(...M.flat().map(Math.abs));
  const x0 = 34, y0 = 26, cell = 21;
  return (
    <Frame>
      {M.map((row, r) =>
        row.map((v, c) => {
          const t = Math.abs(v) / maxAbs;
          const col = v >= 0 ? BRASS : TERRA;
          return (
            <rect key={`${r}-${c}`} x={x0 + c * cell} y={y0 + r * cell} width={cell - 1.5} height={cell - 1.5}
              rx="2" fill={col} opacity={(0.12 + 0.8 * t).toFixed(2)} />
          );
        })
      )}
      <rect x={x0 - 2} y={y0 - 2} width={n * cell + 1} height={n * cell + 1} fill="none" stroke={HAIR} strokeWidth="1" />
      <text x="170" y="46" fontFamily="IBM Plex Mono" fontSize="10" fill={INK}>Hermitian</text>
      <text x="170" y="62" fontFamily="IBM Plex Mono" fontSize="10" fill={INK}>Gram G = G*</text>
      <text x="170" y="88" fontFamily="IBM Plex Mono" fontSize="9" fill={FAINT}>inertia (n+, n−)</text>
      <text x="170" y="106" fontFamily="var(--ed-display), serif" fontSize="15" fill={TERRA}>
        ({np}, {nn}){nz ? ` +${nz}·0` : ''}
      </text>
      <text x="170" y="128" fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT}>copositive iff n−=0</text>
    </Frame>
  );
}

// ── contour-winding ────────────────────────────────────────────────────────
// A closed rectangle contour; the argument principle gives winding = #interior
// zeros. A marker traverses the contour (dashed flow); interior zeros counted.
function ContourWinding() {
  const L = 40, R = 210, T = 26, B = 134;
  const zeros = [[95, 60], [150, 100], [180, 55]]; // 3 interior zeros
  const rectPath = `M${L} ${T} L${R} ${T} L${R} ${B} L${L} ${B} Z`;
  return (
    <Frame>
      <rect x={L} y={T} width={R - L} height={B - T} fill={ED.paper2} opacity="0.5" />
      <path d={rectPath} fill="none" stroke={BRASS} strokeWidth="1.6" strokeDasharray="7 4">
        <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.2s" repeatCount="indefinite" />
      </path>
      {/* orientation marker running counter-clockwise along the contour */}
      <circle r="4" fill={TERRA}>
        <animateMotion path={`M${L} ${T} L${R} ${T} L${R} ${B} L${L} ${B} Z`} dur="6s" repeatCount="indefinite" rotate="auto" />
      </circle>
      {zeros.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill={INK} />
          <text x={x} y={y - 6} fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT} textAnchor="middle">ρ{i + 1}</text>
        </g>
      ))}
      <text x="240" y="60" fontFamily="var(--ed-display), serif" fontSize="12" fill={INK}>1</text>
      <text x="250" y="60" fontFamily="var(--ed-display), serif" fontSize="12" fill={INK}>∮ d arg f</text>
      <line x1="238" y1="66" x2="300" y2="66" stroke={INK} strokeWidth="0.8" />
      <text x="238" y="80" fontFamily="var(--ed-display), serif" fontSize="11" fill={INK}>2πi</text>
      <text x="238" y="104" fontFamily="IBM Plex Mono" fontSize="10" fill={TERRA}>= N = {zeros.length}</text>
      <text x="238" y="120" fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT}>interior zeros</text>
    </Frame>
  );
}

// ── dirichlet-ladder ───────────────────────────────────────────────────────
// The prime-power ladder of the explicit formula: rungs at m·log p, to scale.
function DirichletLadder() {
  const primes = [2, 3, 5, 7];
  const colX = { 2: 90, 3: 150, 5: 210, 7: 270 };
  const vMax = 3;
  const yOf = (v) => 146 - (v / vMax) * 128;
  const axisX = 46;
  return (
    <Frame>
      {/* height axis 0 .. 3 */}
      <line x1={axisX} y1={yOf(0)} x2={axisX} y2={yOf(vMax)} stroke={HAIR} strokeWidth="1" />
      {[0, 1, 2, 3].map((v) => (
        <g key={v}>
          <line x1={axisX - 3} y1={yOf(v)} x2={axisX} y2={yOf(v)} stroke={FAINT} strokeWidth="0.75" />
          <text x={axisX - 6} y={yOf(v) + 3} fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT} textAnchor="end">{v}</text>
        </g>
      ))}
      {primes.map((p, pi) => {
        const lp = Math.log(p);
        const rungs = [];
        for (let m = 1; m * lp <= vMax + 1e-9; m++) rungs.push(m * lp);
        const x = colX[p];
        const col = pi % 2 === 0 ? BRASS : TERRA;
        return (
          <g key={p}>
            <line x1={x} y1={yOf(0)} x2={x} y2={yOf(vMax)} stroke={HAIR} strokeWidth="0.6" opacity="0.6" />
            {rungs.map((v, m) => (
              <g key={v}>
                <line x1={x - 15} y1={yOf(v)} x2={x + 15} y2={yOf(v)} stroke={col} strokeWidth={m === 0 ? 2 : 1.2} opacity={(1 - m * 0.18).toFixed(2)} />
                <circle cx={x} cy={yOf(v)} r={m === 0 ? 2.6 : 1.8} fill={col} />
              </g>
            ))}
            <text x={x} y="156" fontFamily="IBM Plex Mono" fontSize="8.5" fill={col} textAnchor="middle">log {p}</text>
          </g>
        );
      })}
      <text x="300" y="18" fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT} textAnchor="end">m·log p</text>
    </Frame>
  );
}

// ── twistor-fiber ──────────────────────────────────────────────────────────
// A Hopf circle family: cross-section of nested tori (concentric ellipses) plus
// two linked Villarceau-type circles turning through the fibration.
function TwistorFiber() {
  const cx = 160, cy = 80;
  const tori = [18, 34, 50, 66];
  return (
    <Frame>
      {/* nested-tori cross-section */}
      {tori.map((ry, i) => (
        <ellipse key={ry} cx={cx} cy={cy} rx={ry * 1.55} ry={ry} fill="none"
          stroke={i % 2 ? TERRA : BRASS} strokeWidth="1" opacity={(0.8 - i * 0.13).toFixed(2)} />
      ))}
      {/* two linked Hopf fibres, rotating through the family */}
      <g>
        <ellipse cx={cx} cy={cy} rx="80" ry="26" fill="none" stroke={INK} strokeWidth="1.3" opacity="0.7" />
        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="14s" repeatCount="indefinite" />
      </g>
      <g>
        <ellipse cx={cx} cy={cy} rx="26" ry="80" fill="none" stroke={INK} strokeWidth="1.3" opacity="0.7" />
        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`-360 ${cx} ${cy}`} dur="14s" repeatCount="indefinite" />
      </g>
      <circle cx={cx} cy={cy} r="3" fill={TERRA} />
      <text x={cx} y="154" fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT} textAnchor="middle">Hopf fibres S³ → S²</text>
    </Frame>
  );
}

// ── pair-correlation ───────────────────────────────────────────────────────
// Montgomery's GUE pair-correlation 1−(sin πx/πx)² plotted accurately vs the
// Poisson (uncorrelated) flat line y=1.
function PairCorrelation() {
  const xMax = 3, x0 = 40, xW = 258;
  const px = (x) => x0 + (x / xMax) * xW;
  const py = (v) => 138 - v * 96;             // v=0 → 138, v=1 → 42
  const sinc = (x) => (x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x));
  let d = '';
  for (let x = 0; x <= xMax + 1e-9; x += 0.02) {
    const v = 1 - sinc(x) ** 2;               // the pair-correlation kernel
    d += (x === 0 ? 'M' : 'L') + px(x).toFixed(1) + ' ' + py(v).toFixed(1) + ' ';
  }
  return (
    <Frame>
      {/* axes */}
      <line x1={x0} y1={py(0)} x2={px(xMax)} y2={py(0)} stroke={HAIR} strokeWidth="1" />
      <line x1={x0} y1={py(0)} x2={x0} y2={py(1.15)} stroke={HAIR} strokeWidth="1" />
      {[0, 1].map((v) => (
        <text key={v} x={x0 - 5} y={py(v) + 3} fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT} textAnchor="end">{v}</text>
      ))}
      {/* Poisson flat line */}
      <line x1={x0} y1={py(1)} x2={px(xMax)} y2={py(1)} stroke={FAINT} strokeWidth="1" strokeDasharray="4 3" />
      <text x={px(xMax)} y={py(1) - 4} fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT} textAnchor="end">Poisson</text>
      {/* Montgomery curve */}
      <path d={d.trim()} fill="none" stroke={TERRA} strokeWidth="1.7" />
      <circle cx={px(0)} cy={py(0)} r="3" fill={TERRA} />
      <text x={px(1.6)} y={py(1.18)} fontFamily="IBM Plex Mono" fontSize="8.5" fill={TERRA}>1 − (sin πx / πx)²</text>
      <text x={px(xMax)} y="156" fontFamily="IBM Plex Mono" fontSize="8" fill={FAINT} textAnchor="end">normalised gap x</text>
    </Frame>
  );
}

// ── de-bruijn-track ────────────────────────────────────────────────────────
// The Λ number line: Λ≥0 (Rodgers–Tao) … Λ≤0.2 (Platt–Trudgian), with the
// candidate/contract marks placed to scale (a 1-D geometry).
function DeBruijnTrack() {
  const lo = -0.05, hi = 0.26, x0 = 26, xW = 268, y = 86;
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * xW;
  const marks = [
    { v: 0.0, label: 'Λ ≥ 0', sub: 'Rodgers–Tao', col: BRASS, up: true },
    { v: 0.2, label: 'Λ ≤ 0.2', sub: 'Platt–Trudgian', col: TERRA, up: true },
    { v: 0.17759, label: '0.1776', sub: 'y-thaw', col: FAINT, up: false },
    { v: 0.14, label: '0.14', sub: 'contract', col: FAINT, up: false },
  ];
  return (
    <Frame>
      {/* proven corridor 0 ≤ Λ ≤ 0.2 */}
      <rect x={px(0)} y={y - 6} width={px(0.2) - px(0)} height="12" fill={ED.paper2} opacity="0.9" />
      <line x1={x0} y1={y} x2={x0 + xW} y2={y} stroke={HAIR} strokeWidth="1.4" />
      {/* the number line ticks */}
      {[-0.05, 0, 0.05, 0.1, 0.15, 0.2, 0.25].map((v) => (
        <g key={v}>
          <line x1={px(v)} y1={y - 3} x2={px(v)} y2={y + 3} stroke={FAINT} strokeWidth="0.75" />
        </g>
      ))}
      {marks.map((m) => (
        <g key={m.label}>
          <circle cx={px(m.v)} cy={y} r="4" fill={m.col} />
          <line x1={px(m.v)} y1={m.up ? y - 4 : y + 4} x2={px(m.v)} y2={m.up ? y - 24 : y + 24} stroke={m.col} strokeWidth="1" />
          <text x={px(m.v)} y={m.up ? y - 28 : y + 34} fontFamily="var(--ed-display), serif" fontSize="11" fill={m.col} textAnchor="middle">{m.label}</text>
          <text x={px(m.v)} y={m.up ? y - 16 : y + 46} fontFamily="IBM Plex Mono" fontSize="7.5" fill={FAINT} textAnchor="middle">{m.sub}</text>
        </g>
      ))}
      {/* moving reader along the corridor */}
      <circle r="3" fill={TERRA} opacity="0.8">
        <animate attributeName="cx" values={`${px(0)};${px(0.2)};${px(0)}`} dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" values={`${y};${y};${y}`} dur="7s" repeatCount="indefinite" />
      </circle>
    </Frame>
  );
}

// ── no-go-wall ─────────────────────────────────────────────────────────────
// Several routes converging into one barrier — the C_H / PCC convergence:
// distinct arrows funnel into a single wall they cannot cross.
function NoGoWall() {
  const wallX = 234, cy = 80;
  const starts = [24, 46, 80, 114];
  return (
    <Frame>
      {starts.map((sy, i) => {
        const path = `M18 ${sy} C120 ${sy} 150 ${cy} ${wallX - 8} ${cy}`;
        return (
          <g key={i}>
            <path d={path} fill="none" stroke={i % 2 ? TERRA : BRASS} strokeWidth="1.4" strokeDasharray="6 4" opacity="0.85">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite" />
            </path>
          </g>
        );
      })}
      {/* the wall */}
      <line x1={wallX} y1="20" x2={wallX} y2="140" stroke={INK} strokeWidth="3" />
      <g opacity="0.5">
        {Array.from({ length: 9 }, (_, i) => 20 + i * 15).map((yy) => (
          <line key={yy} x1={wallX} y1={yy} x2={wallX + 10} y2={yy + 8} stroke={FAINT} strokeWidth="1" />
        ))}
      </g>
      {/* impact glow where routes meet the wall */}
      <circle cx={wallX - 4} cy={cy} r="5" fill={TERRA} opacity="0.6">
        <animate attributeName="r" values="4;7;4" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <text x={wallX + 12} y={cy - 4} fontFamily="IBM Plex Mono" fontSize="9" fill={INK}>C_H / PCC</text>
      <text x={wallX + 12} y={cy + 9} fontFamily="IBM Plex Mono" fontSize="9" fill={INK}>wall</text>
    </Frame>
  );
}

const KINDS = {
  wave: Wave, oscillator: Oscillator, spectrum: Spectrum, lattice: Lattice, twinladder: TwinLadder,
  'critical-strip': CriticalStrip, 'zeta-zero-vortex': ZetaZeroVortex, 'heat-flow': HeatFlow,
  'gram-matrix': GramMatrix, 'contour-winding': ContourWinding, 'dirichlet-ladder': DirichletLadder,
  'twistor-fiber': TwistorFiber, 'euler-hopf': TwistorFiber, 'pair-correlation': PairCorrelation,
  'de-bruijn-track': DeBruijnTrack, 'no-go-wall': NoGoWall,
};

export default function WireframeAnim({ kind = 'wave' }) {
  const C = KINDS[kind] || Wave;
  return <C />;
}
