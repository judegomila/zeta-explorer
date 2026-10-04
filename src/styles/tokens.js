// Colour tokens as JS constants. Mirrors src/styles/tokens.css (checked by
// scripts/check-tokens-sync.mjs). Use hex for SVG attributes, canvas and d3;
// use V.* (CSS var strings) for inline HTML styles. No imports.
const K = ['paper','paper2','paper3','paper4','ink','inkSoft','inkFaint','rule','ruleSoft','accent','accentDeco','brass','brassDeco','warn','focusRing','series1','series2','series3','series4','series5','series6','series7','series8'];
const mk = (vals) => Object.fromEntries(K.map((k, i) => [k, vals[i]]));
export const CLASSIC = mk(['#0a0e1a','#111827','#1a1f36','#222845','#e2e8f0','#94a3b8','#8290a3','#334155','#1e293b','#38bdf8','#3b82f6','#facc15','#f59e0b','#f87171','#38bdf8','#38bdf8','#f87171','#4ade80','#facc15','#a78bfa','#2dd4bf','#f472b6','#94a3b8']);
export const ED = mk(['#fdfaf3','#f6f1e7','#efe7d6','#e8dfcb','#1c1814','#4a4238','#71665a','#d5c9b2','#e3d8c2','#c23a1c','#d9502e','#8c6a1d','#b58a2e','#c23a1c','#c23a1c','#3f6b86','#c23a1c','#4c7a4a','#8c6a1d','#6d55b8','#2f6f6a','#9b4a7a','#63707d']);
export const TOKENS = { classic: CLASSIC, editorial: ED };
const kebab = (k) => k.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase();
// paper2 -> --paper-2, inkSoft -> --ink-soft, series1 -> --series-1
export const V = Object.fromEntries(K.map((k) => [k, `var(--${kebab(k)})`]));

export const SERIES = [ED.series1, ED.series2, ED.series3, ED.series4, ED.series5, ED.series6, ED.series7, ED.series8];
export const SERIES_CLASSIC = [CLASSIC.series1, CLASSIC.series2, CLASSIC.series3, CLASSIC.series4, CLASSIC.series5, CLASSIC.series6, CLASSIC.series7, CLASSIC.series8];
export const SERIES_VAR = SERIES.map((_, i) => `var(--series-${i + 1})`);

// [editorial fg, editorial tint, classic fg]
const S = {
  proved: ['#467044', '#e7efe4', '#4ade80'],
  certified: ['#2f6f6a', '#e1eeec', '#2dd4bf'],
  measured: ['#5c6875', '#e7ecef', '#94a3b8'],
  candidate: ['#8f5a28', '#f4e6d4', '#fb923c'],
  conditional: ['#7d5f1a', '#f4ead0', '#facc15'],
  open: ['#3f6b86', '#e3edf2', '#38bdf8'],
  nogo: ['#a14a35', '#f6e0d8', '#fb7185'],
  refuted: ['#8a3b2e', '#f1dcd6', '#f87171'],
  rhequiv: ['#6d55b8', '#ebe6f5', '#a78bfa'],
  neutral: ['#6b6151', '#e7e1d2', '#94a3b8'],
};
export const STATUS = Object.fromEntries(Object.entries(S).map(([k, [fg, tint, classic]]) => [k, {
  fg, tint, classic, v: `var(--status-${k})`, vTint: `var(--status-${k}-tint)`,
}]));
export const STATUS_ALIASES = { 'no-go':'nogo', obstruction:'nogo', 'ruled-out':'nogo', 'blocked-by':'nogo', disproved:'refuted', killed:'refuted', claimed:'candidate', theorem:'proved', refereed:'proved', 'arb-certified':'certified', 'kernel-verified':'certified', aristotle:'certified', formal:'certified', verified:'certified', lean:'certified', estimate:'open', gap:'open', 'rh-equivalent':'rhequiv', equivalence:'rhequiv', evidence:'measured', numerics:'measured', superseded:'neutral', external:'neutral', contract:'neutral', program:'neutral', map:'neutral', audit:'neutral' };
export function statusKey(s) { const k = String(s).toLowerCase(); return STATUS[k] ? k : (STATUS_ALIASES[k] || 'neutral'); }
export function statusColor(s) { return STATUS[statusKey(s)]; }

// Editorial generic tints (classic tints are color-mix in tokens.css).
export const TINT = { green:'#e7efe4', brass:'#f4ead0', amber:'#f4e6d4', terra:'#f6e0d8', rose:'#f1dcd6', blue:'#e3edf2', purple:'#ebe6f5', teal:'#e1eeec', slate:'#e7ecef', neutral:'#e7e1d2' };

// alpha('#c23a1c', 0.2) -> 'rgba(194,58,28,0.2)'. Accepts #rgb or #rrggbb.
export function alpha(hex, a) {
  let h = String(hex).replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export const DIVERGING = [ED.series1, ED.paper, ED.series2];
export const NAV_COLLAPSE_PX = 1100; // keep in sync with the @media literals in src/styles/header.css
