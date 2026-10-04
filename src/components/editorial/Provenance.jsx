import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STATUS, ED } from '../../styles/tokens.js';

/**
 * Provenance — the standard click-through for headline numbers (diagnosis #4:
 * "numbers float without provenance"). Wrap any quoted constant:
 *
 *   <Num v="0.062718178029" p={{
 *     meaning: 'global sharp floor of the y-thaw re-sweep',
 *     grade: 'arb-certified',
 *     module: 'src/data/imp-95208-ythaw-package-stage12.js',
 *     code: 'lemma_sweep_p235711.c (sharp weight, prec 256)',
 *     run: 'formalization/y-thaw-01775943/sweep-results/ (27 shards, SHA256SUMS)',
 *     referee: 'S0 note refereed 2026-09-10 (skeptical pass)',
 *     route: '/threads#y-thaw-0177',
 *   }} />
 *
 * Renders the number in mono with a dotted underline; click toggles a compact
 * provenance card: meaning · grade badge · module → code → run → referee chain
 * · thread link. Pure presentational, zero imports beyond router.
 */

const GRADE_COLOR = {
  'kernel-verified': STATUS.certified.fg,
  'refereed-sound': ED.series3,
  'prose-proof': STATUS.proved.fg,
  'arb-certified': STATUS.certified.fg,
  measured: STATUS.measured.fg,
  'candidate-unrefereed': ED.brassDeco,
  'contract-not-a-bound': ED.series2,
  'no-go': STATUS.nogo.fg,
  killed: STATUS.refuted.fg,
};

export default function Num({ v, p }) {
  const [open, setOpen] = useState(false);
  if (!p) return <span className="ed-mono">{v}</span>;
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="ed-mono"
        title="Show provenance"
        style={{
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          font: 'inherit', color: 'inherit',
          borderBottom: '1px dotted var(--brass, #8c6a1d)',
        }}
      >
        {v}
      </button>
      {open && (
        <span
          style={{
            position: 'absolute', zIndex: 40, top: '1.6em', left: 0,
            minWidth: 300, maxWidth: 420, display: 'block',
            background: 'var(--paper, #fdfaf3)', border: '1px solid var(--hairline, #d5c9b2)',
            borderRadius: 8, boxShadow: '0 10px 30px color-mix(in srgb, var(--ink) 16%, transparent)',
            padding: '10px 12px', fontSize: 12, lineHeight: 1.5, textAlign: 'left',
            fontFamily: 'var(--ed-body, Georgia, serif)', color: 'var(--ink-soft, #4a4238)',
          }}
        >
          <span style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
            <strong style={{ color: 'var(--ink, #1c1814)' }}>{p.meaning}</strong>
            {p.grade && (
              <span className="ed-mono" style={{
                fontSize: 9.5, fontWeight: 700, whiteSpace: 'nowrap',
                color: GRADE_COLOR[p.grade] || 'var(--faint)',
                border: `1px solid ${GRADE_COLOR[p.grade] || 'var(--hairline)'}`,
                borderRadius: 4, padding: '0 5px',
              }}>{p.grade}</span>
            )}
          </span>
          {p.module && <span style={{ display: 'block' }}><b>module</b> <code style={{ fontSize: 10.5 }}>{p.module}</code></span>}
          {p.code && <span style={{ display: 'block' }}><b>code</b> <code style={{ fontSize: 10.5 }}>{p.code}</code></span>}
          {p.run && <span style={{ display: 'block' }}><b>run</b> <code style={{ fontSize: 10.5 }}>{p.run}</code></span>}
          {p.referee && <span style={{ display: 'block' }}><b>review</b> {p.referee}</span>}
          {p.route && <span style={{ display: 'block', marginTop: 4 }}><Link to={p.route.split('#')[0]} onClick={() => setOpen(false)}>thread →</Link></span>}
          <button
            type="button" onClick={() => setOpen(false)}
            style={{ position: 'absolute', top: 4, right: 7, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--faint)', fontSize: 12 }}
            aria-label="Close provenance"
          >✕</button>
        </span>
      )}
    </span>
  );
}
