// VisualizationsIndexPage.jsx -- imp-1228 (WAVE 13 master index)
//
// Master index for the six WAVE 13 visualization pages. Renders a
// responsive 2x3 (wide) / 1xN (narrow) grid of cards. Each card has a
// title, a one-line description, a math-bucket badge, a tiny inline-SVG
// preview, and a Link to the corresponding /viz-* route. The page also
// surfaces an intro paragraph (twin-ladder framing) and a footer
// pointing at the canonical paper source.
//
// Data + tripwires: src/data/visualizations-index.js.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { VISUALIZATIONS_INDEX } from '../data/visualizations-index.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED } from '../styles/tokens.js';

// ── Per-bucket accent colors ────────────────────────────────────────────
// Each math bucket gets one accent so the cards are visually distinct.
// Keep these in sync with VIZ_MATH_BUCKETS in the data module.
const BUCKET_ACCENTS = Object.freeze({
  'phase-spiral': ED.series5, // purple
  'tomography':   ED.series6, // cyan
  'flow-field':   ED.series3, // green
  'caustic':      ED.series4, // amber
  'hyperbolic':   ED.series7, // pink
  'crystal':      ED.series1, // blue
  'schur':        ED.series5, // violet
  'kernel':       ED.series5, // indigo
  'bound':        ED.series3, // emerald
});

// ── Tiny inline-SVG previews ────────────────────────────────────────────
// Each preview is a cheap geometric primitive that hints at the math
// bucket. All viewBox 0 0 100 100 so the card grid scales them uniformly.

function PreviewPhaseSpiral({ stroke }) {
  // Archimedean spiral, ~3 turns.
  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const theta = t * Math.PI * 6;
    const r = 4 + t * 40;
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="1.2" />
      <circle cx="50" cy="50" r="1.5" fill={stroke} />
    </svg>
  );
}

function PreviewTomography({ stroke }) {
  // 6x6 heatmap-style gradient grid, diagonal ridge highlighted.
  const cells = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      // Diagonal ridge: brightest near i + j == 5.
      const d = Math.abs(i + j - 5);
      const alpha = (1 - d / 5).toFixed(2);
      cells.push(
        <rect key={`${i}-${j}`} x={10 + i * 14} y={10 + j * 14} width="13" height="13"
              fill={stroke} opacity={alpha} />
      );
    }
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      {cells}
      <line x1="10" y1="80" x2="80" y2="10" stroke={ED.ink} strokeWidth="0.8" strokeDasharray="2 2" />
    </svg>
  );
}

function PreviewFlowField({ stroke }) {
  // Four short curved streamlines suggesting a vector field.
  const lines = [
    'M10,30 C30,20 50,40 80,30',
    'M10,50 C30,40 50,60 80,50',
    'M10,70 C30,60 50,80 80,70',
    'M50,15 C55,40 45,60 50,85',
  ];
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      {lines.map((d, i) => (
        <path key={i} d={d} stroke={stroke} strokeWidth="1.2" fill="none"
              markerEnd="url(#flowArrow)" />
      ))}
      <defs>
        <marker id="flowArrow" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill={stroke} />
        </marker>
      </defs>
    </svg>
  );
}

function PreviewCaustic({ stroke }) {
  // Cluster of bright dots concentrated near a vertical caustic line.
  const dots = [];
  // Deterministic pseudo-random by index so SSR/CSR agree (and we don't
  // need to memo it). Cluster x around 50 with Gaussian-ish spread.
  for (let i = 0; i < 30; i++) {
    const u = ((i * 9301 + 49297) % 233280) / 233280;
    const v = ((i * 7919 + 31) % 233280) / 233280;
    // Box-Muller-lite: concentrate around x=50.
    const x = 50 + (u - 0.5) * 30;
    const y = 10 + v * 80;
    const r = 1 + ((i % 3) === 0 ? 1.2 : 0.5);
    dots.push(<circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={r} fill={stroke} />);
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <line x1="50" y1="10" x2="50" y2="90" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
      {dots}
    </svg>
  );
}

function PreviewHyperbolic({ stroke }) {
  // Poincaré disk: outer circle + a few primes-on-spiral points.
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 1; i <= 16; i++) {
    const r = 5 + Math.log(i + 1) * 11; // log-radial spacing
    const theta = i * golden;
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);
    pts.push(<circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r="1.8" fill={stroke} />);
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
      <circle cx="50" cy="50" r="42" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.3" strokeDasharray="2 2" />
      {pts}
    </svg>
  );
}

function PreviewCrystal({ stroke }) {
  // Bragg-style peaks: 5x5 grid of dots with central dot largest.
  const cells = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const dx = Math.abs(i - 2);
      const dy = Math.abs(j - 2);
      const r = Math.max(0.6, 3 - 0.7 * (dx + dy));
      cells.push(
        <circle key={`${i}-${j}`}
                cx={(20 + i * 15).toFixed(2)}
                cy={(20 + j * 15).toFixed(2)}
                r={r.toFixed(2)} fill={stroke} />
      );
    }
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      {cells}
    </svg>
  );
}

function PreviewSchur({ stroke }) {
  // Unit disk with trajectory spiral inside.
  const pts = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const theta = t * Math.PI * 4;
    const r = 30 * t;
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <circle cx="50" cy="50" r="35" fill="none" stroke={stroke} strokeWidth="1" opacity="0.5" />
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="1.2" />
    </svg>
  );
}

function PreviewKernel({ stroke }) {
  // Diagonal heatmap pattern showing kernel concentration.
  const cells = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const d = Math.abs(i - j);
      const alpha = (1 - d / 5).toFixed(2);
      cells.push(
        <rect key={`${i}-${j}`} x={10 + i * 14} y={10 + j * 14} width="13" height="13"
              fill={stroke} opacity={alpha} />
      );
    }
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      {cells}
      <line x1="10" y1="80" x2="80" y2="10" stroke={ED.ink} strokeWidth="0.8" />
    </svg>
  );
}

function PreviewBound({ stroke }) {
  // Exponential-looking curve going upward.
  const pts = [];
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const x = 10 + t * 80;
    const y = 80 - t * t * 60;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="1.5" />
      <line x1="10" y1="85" x2="90" y2="85" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
      <line x1="10" y1="10" x2="10" y2="85" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

// ── Per-route bespoke + parameterized previews ──────────────────────────
// Many cards share a mathBucket (e.g. ~80 'bound', 25 'measurement'), so the
// per-bucket previews above would render an identical thumbnail for every
// card in a family. To make each card's preview SPECIFIC, we (a) hand-author
// distinct SVGs for the geometric / named entries and (b) give the large
// chart families a small set of chart-shape primitives, choosing a shape by
// keyword and seeding every varying parameter from a hash of the route so no
// two cards render the same picture. All deterministic (route-hash pseudo-
// random, no Math.random) so SSR/CSR agree.

// FNV-1a string hash -> unsigned 32-bit int. Stable across SSR/CSR.
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 deterministic PRNG seeded by the route hash.
function makeRng(seed) {
  let a = (seed >>> 0) || 1;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Secondary accent palette for sub-elements (reference lines, markers). Picked
// by seed so cards sharing a bucket accent still differ in their sub-colors.
const SUB_COLORS = Object.freeze([
  ED.series7, ED.series1, ED.series4, ED.series3,
  ED.series5, ED.series8, ED.series6, ED.series2,
]);
function subColor(seed) {
  return SUB_COLORS[seed % SUB_COLORS.length];
}

const SVG_PROPS = { viewBox: '0 0 100 100', width: '100%', height: '100%', 'aria-hidden': 'true' };

// ── Parameterized chart-shape primitives ────────────────────────────────

function ShapeBars({ stroke, seed }) {
  const rng = makeRng(seed);
  const n = 5 + (seed % 4);
  const gap = 3;
  const bw = (84 - gap * (n - 1)) / n;
  const c2 = subColor(seed);
  const hot = seed % n;
  const bars = [];
  for (let i = 0; i < n; i++) {
    const h = 12 + rng() * 60;
    const x = 8 + i * (bw + gap);
    bars.push(
      <rect key={i} x={x.toFixed(2)} y={(84 - h).toFixed(2)} width={bw.toFixed(2)}
            height={h.toFixed(2)} fill={i === hot ? c2 : stroke} opacity="0.85" />
    );
  }
  return (
    <svg {...SVG_PROPS}>
      <line x1="6" y1="84" x2="93" y2="84" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
      {bars}
    </svg>
  );
}

function ShapeSteps({ stroke, seed }) {
  const rng = makeRng(seed);
  const n = 6 + (seed % 3);
  const stepW = 84 / n;
  let x = 8;
  let y = 18 + rng() * 14;
  const pts = [`8,${y.toFixed(1)}`];
  for (let i = 0; i < n; i++) {
    x += stepW;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    y = Math.min(86, y + 6 + rng() * 8);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const c2 = subColor(seed);
  const thr = 20 + rng() * 50;
  return (
    <svg {...SVG_PROPS}>
      <line x1="8" y1={thr.toFixed(1)} x2="92" y2={thr.toFixed(1)} stroke={c2}
            strokeWidth="0.7" strokeDasharray="2 2" opacity="0.7" />
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
}

function ShapeBand({ stroke, seed }) {
  const rng = makeRng(seed);
  const base = 30 + rng() * 18;
  const amp = 6 + rng() * 10;
  const phase = rng() * 6;
  const freq = 2.5 + rng() * 2.5;
  const width = 6 + rng() * 6;
  const top = [];
  const bot = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = 8 + t * 84;
    const yt = base + Math.sin(t * freq + phase) * amp * (1 - 0.25 * t);
    top.push([x, yt]);
    bot.push([x, yt + width]);
  }
  const d =
    'M' + top.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L') +
    ' L' + bot.reverse().map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L') + ' Z';
  const mid = top.map((p) => `${p[0].toFixed(1)},${(p[1] + width / 2).toFixed(1)}`).join(' ');
  const c2 = subColor(seed);
  return (
    <svg {...SVG_PROPS}>
      <path d={d} fill={stroke} opacity="0.22" stroke="none" />
      <polyline points={mid} fill="none" stroke={stroke} strokeWidth="1.3" />
      <line x1="8" y1={(base + 14).toFixed(1)} x2="92" y2={(base + 14).toFixed(1)}
            stroke={c2} strokeWidth="0.7" strokeDasharray="3 2" opacity="0.7" />
    </svg>
  );
}

function ShapeCrossing({ stroke, seed }) {
  const rng = makeRng(seed);
  const cross = 35 + rng() * 30; // x where the two curves meet
  const bowA = 0.8 + rng() * 1.2;
  const bowB = 0.8 + rng() * 1.2;
  const a = [];
  const b = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = 8 + t * 84;
    a.push(`${x.toFixed(1)},${(72 - Math.pow(t, bowA) * 56).toFixed(1)}`);
    b.push(`${x.toFixed(1)},${(16 + Math.pow(t, bowB) * 56).toFixed(1)}`);
  }
  const c2 = subColor(seed);
  const cy = 12 + rng() * 60;
  return (
    <svg {...SVG_PROPS}>
      <line x1="8" y1="84" x2="92" y2="84" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
      <polyline points={a.join(' ')} fill="none" stroke={stroke} strokeWidth="1.4" />
      <polyline points={b.join(' ')} fill="none" stroke={c2} strokeWidth="1.3" />
      <circle cx={(8 + (cross / 100) * 84).toFixed(1)} cy={cy.toFixed(1)} r="2.2"
              fill="none" stroke={ED.ink} strokeWidth="0.9" />
    </svg>
  );
}

function ShapeNestedPoly({ stroke, seed }) {
  const rng = makeRng(seed);
  const k = 5 + (seed % 4);
  const dir = rng() < 0.5 ? 1 : -1;
  const curves = [];
  for (let c = 0; c < k; c++) {
    const exp = 1.3 + c * (0.9 + rng() * 0.4);
    const scale = 62 - c * (54 / k);
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const x = 10 + t * 80;
      const y = dir > 0 ? 80 - Math.pow(t, exp) * scale : 20 + Math.pow(t, exp) * scale;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    curves.push(
      <polyline key={c} points={pts.join(' ')} fill="none"
                stroke={c === k - 1 ? subColor(seed) : stroke} strokeWidth="1"
                opacity={(0.35 + 0.6 * (c / k)).toFixed(2)} />
    );
  }
  return (
    <svg {...SVG_PROPS}>
      <line x1="10" y1="82" x2="92" y2="82" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
      {curves}
    </svg>
  );
}

function ShapeLadderLine({ stroke, seed }) {
  const rng = makeRng(seed);
  const n = 6 + (seed % 5);
  const rising = rng() < 0.5;
  const asym = 20 + rng() * 55;
  const start = rising ? 80 : 16;
  const pts = [];
  const dots = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = 10 + t * 80;
    const y = start + (asym - start) * (1 - Math.exp(-2.4 * t));
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    dots.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.7" fill={subColor(seed)} />);
  }
  return (
    <svg {...SVG_PROPS}>
      <line x1="10" y1={asym.toFixed(1)} x2="92" y2={asym.toFixed(1)} stroke={stroke}
            strokeWidth="0.7" strokeDasharray="3 2" opacity="0.5" />
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="1.3" />
      {dots}
    </svg>
  );
}

function ShapeScatterFit({ stroke, seed }) {
  const rng = makeRng(seed);
  const slope = 0.5 + rng() * 0.9;
  const n = 5 + (seed % 4);
  const dots = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 1) / (n + 1);
    const x = 10 + t * 78;
    const y = 82 - t * 66 * slope + (rng() - 0.5) * 8;
    dots.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.1" fill={subColor(seed)} />);
  }
  return (
    <svg {...SVG_PROPS}>
      <line x1="10" y1="82" x2="92" y2="82" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
      <line x1="10" y1="82" x2="88" y2={(82 - 0.78 * 66 * slope).toFixed(1)} stroke={stroke}
            strokeWidth="1.2" opacity="0.8" />
      {dots}
    </svg>
  );
}

function ShapeStacked({ stroke, seed }) {
  const rng = makeRng(seed);
  const n = 3 + (seed % 3);
  const gap = 5;
  const bw = (80 - gap * (n - 1)) / n;
  const c2 = subColor(seed);
  const bars = [];
  for (let i = 0; i < n; i++) {
    const total = 30 + rng() * 45;
    const s1 = total * (0.3 + rng() * 0.4);
    const s2 = (total - s1) * (0.4 + rng() * 0.4);
    const s3 = total - s1 - s2;
    const x = 10 + i * (bw + gap);
    let y = 84;
    const segs = [[s1, stroke, 0.85], [s2, c2, 0.85], [s3, ED.ink, 0.35]];
    segs.forEach(([h, fill, op], si) => {
      y -= h;
      bars.push(
        <rect key={`${i}-${si}`} x={x.toFixed(1)} y={y.toFixed(1)} width={bw.toFixed(1)}
              height={h.toFixed(1)} fill={fill} opacity={op} />
      );
    });
  }
  return (
    <svg {...SVG_PROPS}>
      <line x1="8" y1="84" x2="92" y2="84" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
      {bars}
    </svg>
  );
}

function ShapeHistogram({ stroke, seed }) {
  const rng = makeRng(seed);
  const n = 9 + (seed % 4);
  const center = (n - 1) / 2 + (rng() - 0.5) * 2;
  const spread = 1.8 + rng() * 1.2;
  const gap = 1.5;
  const bw = (80 - gap * (n - 1)) / n;
  const bars = [];
  for (let i = 0; i < n; i++) {
    const z = (i - center) / spread;
    const h = 8 + 62 * Math.exp(-0.5 * z * z) * (0.85 + rng() * 0.3);
    const x = 10 + i * (bw + gap);
    bars.push(
      <rect key={i} x={x.toFixed(1)} y={(84 - h).toFixed(1)} width={bw.toFixed(1)}
            height={h.toFixed(1)} fill={stroke} opacity="0.85" />
    );
  }
  const c2 = subColor(seed);
  return (
    <svg {...SVG_PROPS}>
      {bars}
      <line x1="20" y1="10" x2="20" y2="84" stroke={c2} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.8" />
      <line x1="82" y1="10" x2="82" y2="84" stroke={c2} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.8" />
      <line x1="8" y1="84" x2="92" y2="84" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

function ShapeNumberLine({ stroke, seed }) {
  const rng = makeRng(seed);
  const n = 3 + (seed % 3);
  const marks = [];
  const bandX0 = 20 + rng() * 20;
  const bandW = 12 + rng() * 22;
  const c2 = subColor(seed);
  for (let i = 0; i < n; i++) {
    const x = 12 + rng() * 76;
    const r = 1.6 + rng() * 2;
    marks.push(<circle key={`d${i}`} cx={x.toFixed(1)} cy="50" r={r.toFixed(1)} fill={i % 2 ? c2 : stroke} />);
    marks.push(<line key={`t${i}`} x1={x.toFixed(1)} y1="44" x2={x.toFixed(1)} y2="56" stroke={stroke} strokeWidth="0.7" opacity="0.6" />);
  }
  return (
    <svg {...SVG_PROPS}>
      <rect x={bandX0.toFixed(1)} y="46" width={bandW.toFixed(1)} height="8" fill={c2} opacity="0.18" />
      <line x1="8" y1="50" x2="92" y2="50" stroke={stroke} strokeWidth="1" opacity="0.6" />
      {marks}
    </svg>
  );
}

function ShapeHeatGrid({ stroke, seed }) {
  const rng = makeRng(seed);
  const cols = 5 + (seed % 3);
  const rows = 3 + (seed % 3);
  const cw = 82 / cols;
  const ch = 70 / rows;
  const hotC = seed % cols;
  const hotR = (seed >> 3) % rows;
  const cells = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const alpha = (0.12 + rng() * 0.8).toFixed(2);
      cells.push(
        <rect key={`${i}-${j}`} x={(9 + i * cw).toFixed(1)} y={(12 + j * ch).toFixed(1)}
              width={(cw - 1).toFixed(1)} height={(ch - 1).toFixed(1)} fill={stroke} opacity={alpha} />
      );
    }
  }
  return (
    <svg {...SVG_PROPS}>
      {cells}
      <rect x={(9 + hotC * cw).toFixed(1)} y={(12 + hotR * ch).toFixed(1)}
            width={(cw - 1).toFixed(1)} height={(ch - 1).toFixed(1)} fill="none"
            stroke={subColor(seed)} strokeWidth="1.4" />
    </svg>
  );
}

function ShapeDiverging({ stroke, seed }) {
  const rng = makeRng(seed);
  const n = 4 + (seed % 4);
  const gap = 4;
  const bw = (82 - gap * (n - 1)) / n;
  const c2 = subColor(seed);
  const bars = [];
  for (let i = 0; i < n; i++) {
    const up = rng() < 0.5;
    const h = 8 + rng() * 30;
    const x = 9 + i * (bw + gap);
    bars.push(
      <rect key={i} x={x.toFixed(1)} y={up ? (50 - h).toFixed(1) : '50'} width={bw.toFixed(1)}
            height={h.toFixed(1)} fill={up ? stroke : c2} opacity="0.85" />
    );
  }
  return (
    <svg {...SVG_PROPS}>
      {bars}
      <line x1="6" y1="50" x2="93" y2="50" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

function ShapeSignLadder({ stroke, seed }) {
  const rng = makeRng(seed);
  const n = 6 + (seed % 4);
  const gap = 84 / n;
  const c2 = subColor(seed);
  const flip = seed % 2;
  const marks = [];
  for (let i = 0; i < n; i++) {
    const x = 10 + i * gap + gap / 2;
    const pos = (i + flip) % 2 === 0;
    const y = pos ? 30 : 62;
    marks.push(
      <rect key={i} x={(x - 3).toFixed(1)} y={(y - 3).toFixed(1)} width="6" height="6"
            fill={pos ? stroke : c2} opacity="0.9" />
    );
    // sign glyph
    marks.push(<line key={`h${i}`} x1={(x - 1.6).toFixed(1)} y1={y} x2={(x + 1.6).toFixed(1)} y2={y} stroke={ED.paper} strokeWidth="0.9" />);
    if (pos) marks.push(<line key={`v${i}`} x1={x.toFixed(1)} y1={(y - 1.6).toFixed(1)} x2={x.toFixed(1)} y2={(y + 1.6).toFixed(1)} stroke={ED.paper} strokeWidth="0.9" />);
  }
  return (
    <svg {...SVG_PROPS}>
      <line x1="8" y1="46" x2="92" y2="46" stroke={stroke} strokeWidth="0.7" opacity="0.5" strokeDasharray="2 2" />
      {marks}
    </svg>
  );
}

function ShapeMonoCurve({ stroke, seed }) {
  const rng = makeRng(seed);
  const rising = rng() < 0.5;
  const asym = 22 + rng() * 50;
  const start = rising ? 80 : 14;
  const rate = 2 + rng() * 3;
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = 10 + t * 80;
    const y = start + (asym - start) * (1 - Math.exp(-rate * t));
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg {...SVG_PROPS}>
      <line x1="10" y1={asym.toFixed(1)} x2="92" y2={asym.toFixed(1)} stroke={subColor(seed)}
            strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7" />
      <line x1="10" y1="84" x2="92" y2="84" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function ShapeCardsDiagram({ stroke, seed }) {
  const rng = makeRng(seed);
  const c2 = subColor(seed);
  const boxes = [];
  const positions = [[14, 16], [54, 16], [14, 54], [54, 54]];
  positions.forEach(([x, y], i) => {
    const filled = rng() < 0.5;
    boxes.push(
      <rect key={i} x={x} y={y} width="32" height="30" rx="3" fill={filled ? c2 : 'none'}
            opacity={filled ? 0.35 : 1} stroke={filled ? c2 : stroke} strokeWidth="1.2" />
    );
    boxes.push(<line key={`l${i}`} x1={x + 6} y1={y + 11} x2={x + 26} y2={y + 11} stroke={stroke} strokeWidth="1" opacity="0.6" />);
    boxes.push(<line key={`m${i}`} x1={x + 6} y1={y + 19} x2={x + 20} y2={y + 19} stroke={stroke} strokeWidth="1" opacity="0.4" />);
  });
  return <svg {...SVG_PROPS}>{boxes}</svg>;
}

function ShapeCliff({ stroke, seed }) {
  const rng = makeRng(seed);
  const plateauY = 26 + rng() * 20;
  const edge = 55 + rng() * 22;
  const pts = [
    `10,${plateauY.toFixed(1)}`,
    `${edge.toFixed(1)},${plateauY.toFixed(1)}`,
    `${edge.toFixed(1)},86`,
    `92,86`,
  ];
  return (
    <svg {...SVG_PROPS}>
      <line x1="10" y1="84" x2="92" y2="84" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="1.5" />
      <line x1={edge.toFixed(1)} y1="8" x2={edge.toFixed(1)} y2="88" stroke={subColor(seed)}
            strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />
    </svg>
  );
}

function ShapeUlpBand({ stroke, seed }) {
  const rng = makeRng(seed);
  const y0 = 44 + rng() * 8;
  const bh = 14 + rng() * 8;
  const dots = [];
  for (let i = 0; i < 22; i++) {
    const x = 10 + rng() * 80;
    const y = y0 + rng() * bh;
    dots.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.3" fill={stroke} opacity="0.9" />);
  }
  const thr = y0 - 12;
  return (
    <svg {...SVG_PROPS}>
      <rect x="8" y={y0.toFixed(1)} width="84" height={bh.toFixed(1)} fill={stroke} opacity="0.14" />
      {dots}
      <line x1="8" y1={thr.toFixed(1)} x2="92" y2={thr.toFixed(1)} stroke={subColor(seed)}
            strokeWidth="1" strokeDasharray="3 2" opacity="0.85" />
    </svg>
  );
}

function ShapePolarTraj({ stroke, seed }) {
  const rng = makeRng(seed);
  const turns = 2 + rng() * 3;
  const phase = rng() * 6;
  const pts = [];
  const dots = [];
  const n = 22;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const theta = phase + t * Math.PI * 2 * turns;
    const r = 4 + t * 34;
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    if (i % 3 === 0) dots.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.4" fill={subColor(seed)} />);
  }
  return (
    <svg {...SVG_PROPS}>
      <circle cx="50" cy="50" r="40" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="1.2" />
      {dots}
    </svg>
  );
}

const GENERIC_SHAPES = Object.freeze({
  bars: ShapeBars,
  steps: ShapeSteps,
  band: ShapeBand,
  crossing: ShapeCrossing,
  nestedPoly: ShapeNestedPoly,
  ladder: ShapeLadderLine,
  scatter: ShapeScatterFit,
  stacked: ShapeStacked,
  histogram: ShapeHistogram,
  numberLine: ShapeNumberLine,
  heatGrid: ShapeHeatGrid,
  diverging: ShapeDiverging,
  signLadder: ShapeSignLadder,
  mono: ShapeMonoCurve,
  cards: ShapeCardsDiagram,
  cliff: ShapeCliff,
  ulp: ShapeUlpBand,
  polar: ShapePolarTraj,
});

// Keyword -> shape key. First match wins; order encodes priority so specific
// named charts land on their intended shape. Falls back to 'bars'.
function shapeKeyFor(entry) {
  const s = `${entry.title} ${entry.oneLine}`.toLowerCase();
  const has = (...ks) => ks.some((k) => s.includes(k));
  if (has('ulp')) return 'ulp';
  if (has('dyadic')) return 'steps';
  if (has('reconstruction')) return 'bars';
  if (has('polynomial', 'p_2..p_12', 'p2..p12', 'nested')) return 'nestedPoly';
  if (has('waterfall', 'stacked', 'residual decomposition', 'two-component', 'component decomposition', 'three-input', 'threefold')) return 'stacked';
  if (has('cancellation', 'diverging', 'push vs', 'shift vs')) return 'diverging';
  if (has('bootstrap', 'histogram', 'distribution')) return 'histogram';
  if (has('sign', 'parity', 'bernstein', 'signature')) return 'signLadder';
  if (has('positivity', 'endpoint-positivity', 'heatmap', 'matrix')) return 'heatGrid';
  if (has('darboux', 'polar', 'trajectory')) return 'polar';
  if (has('certificate', 'checklist', 'triple', 'ranking', 'severity', 'ingredient', 'diagram', 'operator f(m)')) return 'cards';
  if (has('cliff', 'nan')) return 'cliff';
  if (has('through the origin', 'sqrt(tol)', 'scatter', 'plateau width')) return 'scatter';
  if (has('number', 'landmark', 'cluster', 'unreachability', 'extrapolation gap', 'height gap', 'disposal', 'axis')) return 'numberLine';
  if (has('knee', 'crossing', 'power law', 'log-log', 'incompatibility', 'mismatch', 'two-window', 'divergence', 'inversion')) return 'crossing';
  if (has('band', 'corridor', 'infimum', 'headroom', 'margin', 'window', 'invariant')) return 'band';
  if (has('scheme-independence', 'panel-count', 'panel ratio', 'bar chart', 'bar comparison', 'span-growth', 'deg ladder')) return 'bars';
  if (has('profile', 'contraction', 'convergence', 'decay', 'sensitivity', 'sweep', 'q_eff', 'slope', 'blow-up', 'blowup')) return 'mono';
  if (has('ladder')) return 'ladder';
  return 'bars';
}

// ── Bespoke geometric / named previews ──────────────────────────────────

function PreviewNormCurve({ stroke }) {
  // Two rising log-scale curves (empirical op-norm vs rigorous HS bound) and a
  // dashed a~2.3 "growth open" marker.
  const emp = [];
  const bnd = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = 10 + t * 80;
    emp.push(`${x.toFixed(1)},${(82 - Math.pow(t, 1.7) * 70).toFixed(1)}`);
    bnd.push(`${x.toFixed(1)},${(82 - Math.pow(t, 1.25) * 66).toFixed(1)}`);
  }
  return (
    <svg {...SVG_PROPS}>
      <line x1="10" y1="84" x2="92" y2="84" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
      <line x1="10" y1="8" x2="10" y2="84" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
      <line x1="66" y1="8" x2="66" y2="84" stroke={ED.series7} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />
      <polyline points={bnd.join(' ')} fill="none" stroke={ED.series7} strokeWidth="1.1" />
      <polyline points={emp.join(' ')} fill="none" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function PreviewVortexField({ stroke }) {
  const c2 = ED.series1;
  const swirl = (cx, cy) =>
    [1, 2, 3].map((kk) => (
      <circle key={`${cx}-${cy}-${kk}`} cx={cx} cy={cy} r={4 + kk * 5} fill="none"
              stroke={stroke} strokeWidth="0.8" opacity={0.7 - kk * 0.12} />
    ));
  return (
    <svg {...SVG_PROPS}>
      <line x1="50" y1="6" x2="50" y2="94" stroke={c2} strokeWidth="0.7" strokeDasharray="3 2" opacity="0.6" />
      {swirl(50, 32)}
      {swirl(50, 68)}
      <circle cx="50" cy="32" r="1.6" fill={stroke} />
      <circle cx="50" cy="68" r="1.6" fill={stroke} />
      {/* winding +1 near top, -1 near bottom */}
      <line x1="66" y1="32" x2="72" y2="32" stroke={ED.ink} strokeWidth="1" />
      <line x1="69" y1="29" x2="69" y2="35" stroke={ED.ink} strokeWidth="1" />
      <line x1="66" y1="68" x2="72" y2="68" stroke={ED.ink} strokeWidth="1" />
      <path d="M28,26 A20,20 0 0 1 38,20" fill="none" stroke={stroke} strokeWidth="0.9" opacity="0.6" />
      <path d="M62,74 A20,20 0 0 1 72,80" fill="none" stroke={stroke} strokeWidth="0.9" opacity="0.6" />
    </svg>
  );
}

function PreviewPrimeRigidity({ stroke, seed }) {
  const rng = makeRng(seed || 7);
  const left = [];
  [18, 30, 42].forEach((cx, ci) => {
    for (let j = 0; j < 6; j++) {
      const y = 14 + j * 12 + (rng() - 0.5) * 3;
      left.push(<circle key={`l${ci}-${j}`} cx={cx} cy={y.toFixed(1)} r="1.5" fill={stroke} />);
    }
  });
  const right = [];
  const c2 = subColor(seed || 7);
  for (let i = 0; i < 20; i++) {
    const x = 56 + rng() * 36;
    const y = 12 + rng() * 74;
    right.push(<circle key={`r${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.3" fill={c2} opacity="0.8" />);
  }
  return (
    <svg {...SVG_PROPS}>
      <line x1="50" y1="6" x2="50" y2="94" stroke={stroke} strokeWidth="0.5" opacity="0.3" />
      {left}
      {right}
    </svg>
  );
}

function PreviewGallery({ stroke }) {
  const c2 = ED.series7;
  const spiral = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const th = t * Math.PI * 3;
    spiral.push(`${(20 + t * 7 * Math.cos(th)).toFixed(1)},${(26 + t * 7 * Math.sin(th)).toFixed(1)}`);
  }
  const wave = [];
  for (let i = 0; i <= 14; i++) {
    const x = 56 + (i / 14) * 26;
    wave.push(`${x.toFixed(1)},${(74 + Math.sin(i) * 5).toFixed(1)}`);
  }
  return (
    <svg {...SVG_PROPS}>
      {/* spiral */}
      <polyline points={spiral.join(' ')} fill="none" stroke={stroke} strokeWidth="1" />
      {/* caustic dots */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={`c${i}`} cx={50 + i * 2} cy={22 + i * 3} r="1" fill={c2} />
      ))}
      {/* grid */}
      {[0, 1, 2].map((i) =>
        [0, 1, 2].map((j) => (
          <rect key={`g${i}-${j}`} x={78 + i * 5} y={16 + j * 5} width="4" height="4" fill={stroke}
                opacity={(0.3 + 0.2 * (i + j)).toFixed(2)} />
        ))
      )}
      {/* poincare disk */}
      <circle cx="22" cy="70" r="12" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
      <circle cx="26" cy="66" r="1.2" fill={c2} />
      <circle cx="19" cy="74" r="1.2" fill={c2} />
      {/* nodal cross vortex */}
      <line x1="44" y1="70" x2="52" y2="70" stroke={stroke} strokeWidth="0.8" />
      <line x1="48" y1="62" x2="48" y2="78" stroke={stroke} strokeWidth="0.8" />
      <circle cx="48" cy="70" r="4" fill="none" stroke={c2} strokeWidth="0.8" />
      {/* waveform */}
      <polyline points={wave.join(' ')} fill="none" stroke={stroke} strokeWidth="1" />
    </svg>
  );
}

function PreviewNearZero({ stroke }) {
  const c2 = ED.series1;
  return (
    <svg {...SVG_PROPS}>
      {[10, 18, 26, 34].map((r, i) => (
        <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={stroke} strokeWidth="0.9"
                opacity={(0.8 - i * 0.16).toFixed(2)} />
      ))}
      <line x1="10" y1="50" x2="90" y2="50" stroke={c2} strokeWidth="0.9" opacity="0.7" />
      <line x1="50" y1="10" x2="50" y2="90" stroke={c2} strokeWidth="0.9" opacity="0.7" />
      <circle cx="50" cy="50" r="2.2" fill={stroke} />
    </svg>
  );
}

function PreviewEulerProduct({ stroke }) {
  const c2 = ED.series4;
  const truePts = [];
  const pert = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const x = 8 + t * 84;
    // sharp dips (near-zeros) for true product
    const dip = -18 * Math.exp(-Math.pow((t - 0.3) * 9, 2)) - 15 * Math.exp(-Math.pow((t - 0.68) * 9, 2));
    truePts.push(`${x.toFixed(1)},${(48 + Math.sin(t * 10) * 4 + dip).toFixed(1)}`);
    // smeared/perturbed: shallower, phase-shifted
    const dip2 = -8 * Math.exp(-Math.pow((t - 0.34) * 5, 2)) - 6 * Math.exp(-Math.pow((t - 0.72) * 5, 2));
    pert.push(`${x.toFixed(1)},${(50 + Math.sin(t * 10 + 0.8) * 3 + dip2).toFixed(1)}`);
  }
  return (
    <svg {...SVG_PROPS}>
      <line x1="8" y1="72" x2="92" y2="72" stroke={stroke} strokeWidth="0.6" opacity="0.3" />
      <polyline points={pert.join(' ')} fill="none" stroke={c2} strokeWidth="1.1" opacity="0.85" strokeDasharray="3 2" />
      <polyline points={truePts.join(' ')} fill="none" stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
}

function PreviewPrimeDensityCaustic({ stroke }) {
  const cells = [];
  const cols = 10;
  const rows = 8;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // bright along a couple of coherence bands (diagonal-ish)
      const band = Math.exp(-Math.pow((j - (2 + i * 0.4)) / 1.1, 2)) +
                   0.7 * Math.exp(-Math.pow((j - (6 - i * 0.3)) / 1.1, 2));
      const alpha = Math.min(0.95, 0.08 + band).toFixed(2);
      cells.push(
        <rect key={`${i}-${j}`} x={(8 + i * 8.4).toFixed(1)} y={(8 + j * 7.5).toFixed(1)}
              width="7.6" height="6.8" fill={stroke} opacity={alpha} />
      );
    }
  }
  // profile line at bottom
  const prof = [];
  for (let i = 0; i < cols; i++) {
    prof.push(`${(11.8 + i * 8.4).toFixed(1)},${(72 + (i % 2 ? -6 : -2)).toFixed(1)}`);
  }
  return (
    <svg {...SVG_PROPS}>
      {cells}
      <polyline points={prof.join(' ')} fill="none" stroke={ED.ink} strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

function PreviewCausticResonance({ stroke }) {
  const c2 = ED.series1;
  const wave = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const x = 8 + t * 84;
    const spikes = 20 * Math.exp(-Math.pow((t - 0.25) * 14, 2)) +
                   26 * Math.exp(-Math.pow((t - 0.55) * 12, 2)) +
                   16 * Math.exp(-Math.pow((t - 0.82) * 16, 2));
    wave.push(`${x.toFixed(1)},${(70 - spikes).toFixed(1)}`);
  }
  const ticks = [0.25, 0.4, 0.55, 0.7, 0.82].map((t, i) => (
    <line key={i} x1={(8 + t * 84).toFixed(1)} y1="74" x2={(8 + t * 84).toFixed(1)} y2="82"
          stroke={c2} strokeWidth="1" />
  ));
  return (
    <svg {...SVG_PROPS}>
      <line x1="8" y1="74" x2="92" y2="74" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
      <polyline points={wave.join(' ')} fill="none" stroke={stroke} strokeWidth="1.3" />
      {ticks}
    </svg>
  );
}

function PreviewWindingDyson({ stroke }) {
  const c2 = ED.series7;
  const arrows = [];
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    const x = 46 + 30 * Math.cos(a);
    const y = 50 + 30 * Math.sin(a);
    const tx = x - 4 * Math.sin(a);
    const ty = y + 4 * Math.cos(a);
    arrows.push(<line key={k} x1={x.toFixed(1)} y1={y.toFixed(1)} x2={tx.toFixed(1)} y2={ty.toFixed(1)} stroke={stroke} strokeWidth="1" opacity="0.7" />);
  }
  return (
    <svg {...SVG_PROPS}>
      <circle cx="46" cy="50" r="30" fill="none" stroke={stroke} strokeWidth="1" opacity="0.7" />
      {arrows}
      <circle cx="40" cy="46" r="1.8" fill={stroke} />
      <circle cx="52" cy="54" r="1.8" fill={stroke} />
      {/* a pair exiting the contour */}
      <circle cx="84" cy="30" r="1.8" fill={c2} />
      <line x1="60" y1="42" x2="82" y2="31" stroke={c2} strokeWidth="0.9" strokeDasharray="2 2" />
    </svg>
  );
}

function PreviewPhaseCylinder({ stroke }) {
  const c2 = ED.series5;
  const rays = [];
  for (let k = 0; k < 6; k++) {
    const y0 = 22 + k * 10;
    rays.push(<line key={k} x1="14" y1={y0} x2="86" y2={(y0 - 12 - k * 2)} stroke={stroke} strokeWidth="1" opacity="0.75" />);
  }
  return (
    <svg {...SVG_PROPS}>
      <rect x="14" y="14" width="72" height="72" fill="none" stroke={stroke} strokeWidth="0.7" opacity="0.4" />
      {/* vertical alignment (caustic) columns */}
      <line x1="38" y1="14" x2="38" y2="86" stroke={c2} strokeWidth="1" opacity="0.6" />
      <line x1="64" y1="14" x2="64" y2="86" stroke={c2} strokeWidth="1" opacity="0.6" />
      {rays}
      {/* cylinder wrap hint */}
      <ellipse cx="50" cy="14" rx="36" ry="4" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}

function PreviewUnwrappedRays({ stroke }) {
  const c2 = ED.series4;
  const rays = [];
  const slopes = [0.15, 0.35, 0.55, 0.78, 1.05];
  slopes.forEach((m, k) => {
    rays.push(<line key={k} x1="10" y1="82" x2="90" y2={(82 - m * 66).toFixed(1)} stroke={stroke} strokeWidth="1.1" opacity="0.8" />);
  });
  // resonance crossing ticks
  const ticks = [26, 44, 60, 74].map((x, i) => (
    <circle key={i} cx={x} cy={(82 - (0.15 + i * 0.12) * (x - 10)).toFixed(1)} r="1.6" fill={c2} />
  ));
  return (
    <svg {...SVG_PROPS}>
      <line x1="10" y1="82" x2="92" y2="82" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
      {rays}
      {ticks}
    </svg>
  );
}

// Explicit bespoke map: route -> hand-authored preview component.
const GEOMETRIC_PREVIEWS = Object.freeze({
  '/viz-log-phase-spiral': PreviewPhaseSpiral,
  '/viz-twin-ladder-tomography': PreviewTomography,
  '/viz-euler-transport-flow': PreviewFlowField,
  '/viz-prime-caustic': PreviewCaustic,
  '/viz-hyperbolic-prime-spiral': PreviewHyperbolic,
  '/viz-prime-phase-crystal': PreviewCrystal,
  '/cayley-schur-trajectory': PreviewSchur,
  '/viz-volterra-kernel-heatmap': PreviewKernel,
  '/viz-volterra-norm-curve': PreviewNormCurve,
  '/vortex-field': PreviewVortexField,
  '/prime-rigidity': PreviewPrimeRigidity,
  '/visual-geometries': PreviewGallery,
  '/viz-near-zero': PreviewNearZero,
  '/viz-euler-product': PreviewEulerProduct,
  '/viz-prime-density-caustic': PreviewPrimeDensityCaustic,
  '/viz-caustic-resonance': PreviewCausticResonance,
  '/viz-winding-dyson-flow': PreviewWindingDyson,
  '/viz-phase-cylinder': PreviewPhaseCylinder,
  '/viz-unwrapped-rays': PreviewUnwrappedRays,
});

// Per-route registry: bespoke where hand-authored, else a keyword-chosen
// chart shape seeded by a hash of the route so no two cards render alike.
const PREVIEWS_BY_ROUTE = (() => {
  const map = {};
  for (const e of VISUALIZATIONS_INDEX.entries) {
    if (GEOMETRIC_PREVIEWS[e.route]) {
      map[e.route] = GEOMETRIC_PREVIEWS[e.route];
      continue;
    }
    const seed = hashSeed(e.route);
    const Shape = GENERIC_SHAPES[shapeKeyFor(e)] || ShapeBars;
    const RoutePreview = (props) => <Shape {...props} seed={seed} />;
    map[e.route] = RoutePreview;
  }
  return Object.freeze(map);
})();

const PREVIEWS = Object.freeze({
  'phase-spiral': PreviewPhaseSpiral,
  'tomography':   PreviewTomography,
  'flow-field':   PreviewFlowField,
  'caustic':      PreviewCaustic,
  'hyperbolic':   PreviewHyperbolic,
  'crystal':      PreviewCrystal,
  'schur':        PreviewSchur,
  'kernel':       PreviewKernel,
  'bound':        PreviewBound,
});

// ── Card component ─────────────────────────────────────────────────────
function VizCard({ entry }) {
  const accent = BUCKET_ACCENTS[entry.mathBucket] || ED.series8;
  const Preview = PREVIEWS_BY_ROUTE[entry.route] || PREVIEWS[entry.mathBucket] || null;
  return (
    <Link
      to={entry.route}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--paper2)',
        border: '1px solid var(--hairline)',
        borderLeft: `3px solid ${accent}`,
        borderRadius: 8,
        padding: 16,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 120ms ease, border-color 120ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--hairline)';
        e.currentTarget.style.borderLeftColor = accent;
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div
          aria-hidden="true"
          style={{
            width: 60,
            height: 60,
            flexShrink: 0,
            background: 'var(--paper-2)',
            border: '1px solid var(--rule)',
            borderRadius: 6,
            color: accent,
          }}
        >
          {Preview ? <Preview stroke={accent} /> : null}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--ink)',
            lineHeight: 1.3,
            marginBottom: 4,
          }}>
            {entry.title}
          </div>
          <div style={{
            display: 'inline-block',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            background: `${accent}22`,
            color: accent,
            padding: '2px 6px',
            borderRadius: 3,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
          }}>
            {entry.mathBucket}
          </div>
        </div>
      </div>
      <p style={{
        color: 'var(--ink-soft)',
        fontSize: 13,
        lineHeight: 1.55,
        margin: 0,
        marginBottom: 10,
      }}>
        {entry.oneLine}
      </p>

      <div style={{
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--faint)',
      }}>
        <span>{entry.ticket} · step {entry.pedagogicalStep}</span>
        <span style={{ color: accent }}>view &rarr;</span>
      </div>
      {/* imp-2728: mathematical ceiling for this panel -- keeps a
          reader from inferring an unearned Lambda / RH claim from any card. */}
      {entry.honestCeiling ? (
        <div style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: '1px solid var(--hairline)',
          fontSize: 11,
          lineHeight: 1.5,
          fontStyle: 'italic',
          color: 'var(--faint)',
        }}>
          ceiling: {entry.honestCeiling}
        </div>
      ) : null}
    </Link>
  );
}

// ── Page component ─────────────────────────────────────────────────────
export default function VisualizationsIndexPage() {
  const V = VISUALIZATIONS_INDEX;
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>visualizations</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
      <div style={{ marginBottom: 10 }}>
        <h1 className="ed-h1">{V.title}</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760, marginTop: 10 }}>
          {V.intro}
        </p>
      </div>

      {/* Card grid: 2x3 wide, 1xN narrow. We use minmax(280px, 1fr) so
          cards collapse cleanly on small viewports. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          marginTop: 20,
        }}
      >
        {V.entries.map((e) => (
          <VizCard key={e.route} entry={e} />
        ))}
      </div>

      {/* Film tour of the gallery — kept below the catalog so navigation comes first */}
      <AnimationEmbed id="viz-gallery" />

      {/* Scope */}
      <div
        className="card"
        style={{ marginTop: 28, padding: 14, borderLeft: '3px solid var(--blue)' }}
      >
        <div
          style={{
            fontSize: 11,
            color: 'var(--blue)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 8,
          }}
        >
          scope
        </div>
        <ul
          style={{
            color: 'var(--ink-soft)',
            fontSize: 13,
            lineHeight: 1.7,
            paddingLeft: 18,
            margin: 0,
          }}
        >
          <li>
            <strong>Index, not proof.</strong> The visualizations in this catalog are
            geometric / interferometric aids for intuition. They visualize
            structure, they do not prove anything about RH, Λ, or the
            twin-ladder closure routes.
          </li>
          <li>
            <strong>Pedagogical order.</strong> The cards are ordered
            phase-spiral → tomography → flow-field → caustic → hyperbolic →
            crystal so the reader moves from a single-curve view through 2D
            (σ, t) representations and finally into discrete prime structure.
          </li>
          <li>
            <strong>Reusability.</strong> Each card&apos;s data module is
            the single source-of-truth for that visualization&apos;s
            parameters and tripwires; see the dataModule field on each card
            for the import path.
          </li>
        </ul>
      </div>

      {/* Paper source */}
      <div
        className="card"
        style={{ marginTop: 20, padding: 14, borderLeft: '3px solid var(--brass-dk)' }}
      >
        <div
          style={{
            fontSize: 11,
            color: 'var(--brass-dk)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 8,
          }}
        >
          paper source
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          <code style={{ color: 'var(--ink)' }}>{V.paperSource.path}</code>{' '}
          &mdash; {V.paperSource.note}
        </p>
      </div>

      {/* Source footer */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: '1px solid var(--hairline)',
          fontSize: 11,
          color: 'var(--faint)',
          lineHeight: 1.6,
          fontFamily: 'var(--font-mono)',
        }}
      >
        source: src/data/visualizations-index.js · ticket: {V.ticketId} ·{' '}
        renderer: src/pages/VisualizationsIndexPage.jsx
        <p style={{ margin: '12px 0 0 0', fontFamily: 'var(--ed-body, inherit)', fontSize: 13 }}>
          <Link to="/" style={{ color: 'var(--brass)' }}>&larr; the atlas</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
