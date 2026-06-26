import React, { useEffect, useRef } from 'react';

/**
 * Shared keyboard-driven zero-stepper.
 * Shows ← / → buttons and a readout of n and γ_n.
 * Arrow-key events are handled globally (skipped when an INPUT has focus).
 *
 * Props:
 *   gammas    number[]             — array of γ_n values
 *   idx       number               — current selected index
 *   onChange  (n: number) => void  — called with new index
 */
export default function ZeroStepper({ gammas, idx, onChange }) {
  const idxRef = useRef(idx);
  const onChangeRef = useRef(onChange);
  const gammasLenRef = useRef(gammas.length);
  idxRef.current = idx;
  onChangeRef.current = onChange;
  gammasLenRef.current = gammas.length;

  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
      const i = idxRef.current;
      const cb = onChangeRef.current;
      const len = gammasLenRef.current;
      if (e.key === 'ArrowLeft' && i > 0) cb(i - 1);
      else if (e.key === 'ArrowRight' && i < len - 1) cb(i + 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const canPrev = idx > 0;
  const canNext = idx < gammas.length - 1;
  const gamma = gammas[idx];

  const btnStyle = (disabled) => ({
    padding: '3px 10px',
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
    border: '1px solid #334155',
    borderRadius: 4,
    background: disabled ? '#0f172a' : '#1e293b',
    color: disabled ? '#475569' : '#e2e8f0',
    lineHeight: 1,
    userSelect: 'none',
  });

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'var(--font-mono)', fontSize: 12,
    }}>
      <button
        onClick={() => canPrev && onChange(idx - 1)}
        disabled={!canPrev}
        style={btnStyle(!canPrev)}
        aria-label="Previous zero"
      >
        &#8592;
      </button>
      <span style={{ color: '#94a3b8', minWidth: 40 }}>n={idx + 1}</span>
      <span style={{ color: '#e2e8f0' }}>
        {'γ'}{idx + 1} &asymp; {gamma.toFixed(4)}
      </span>
      <button
        onClick={() => canNext && onChange(idx + 1)}
        disabled={!canNext}
        style={btnStyle(!canNext)}
        aria-label="Next zero"
      >
        &#8594;
      </button>
    </div>
  );
}
