import React from 'react';

/* Wireframe-style animated SVG figures for the editorial simulator pages.
   Hairline line-art in the warm palette, animated with self-contained SMIL
   (no CSS deps). Decorative section headers — they illustrate the concept a
   simulator explores; the real interactive viz renders below them.

   <WireframeAnim kind="wave" />  →  traveling + reflected wave on a bounded string
   kinds: wave | oscillator | spectrum | lattice
   Colors: --brass #8c6a1d, --terra #d9502e, hairline #d5c9b2, faint #877b67 */

const BRASS = '#8c6a1d';
const TERRA = '#d9502e';
const HAIR = '#d5c9b2';

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
      <rect width="320" height="160" fill="#fdfaf3" />
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

// Two coupled oscillators: pendulum bobs swinging out of phase.
function Oscillator() {
  return (
    <Frame>
      <line x1="40" y1="34" x2="280" y2="34" stroke={HAIR} strokeWidth="1" />
      {[110, 210].map((cx, i) => (
        <g key={cx} transform={`translate(${cx} 34)`}>
          <g>
            <line x1="0" y1="0" x2="0" y2="78" stroke={i ? TERRA : BRASS} strokeWidth="1.2" />
            <circle cx="0" cy="82" r="8" fill="none" stroke={i ? TERRA : BRASS} strokeWidth="1.5" />
            <animateTransform attributeName="transform" type="rotate"
              values={i ? '26;0;-26;0;26' : '-26;0;26;0;-26'} dur="2.4s" repeatCount="indefinite" />
          </g>
        </g>
      ))}
      <line x1="110" y1="116" x2="210" y2="116" stroke={HAIR} strokeWidth="0.75" strokeDasharray="3 3" />
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

const KINDS = { wave: Wave, oscillator: Oscillator, spectrum: Spectrum, lattice: Lattice, twinladder: TwinLadder };

export default function WireframeAnim({ kind = 'wave' }) {
  const C = KINDS[kind] || Wave;
  return <C />;
}
