import React, { useRef, useEffect } from 'react';
import katex from 'katex';

export function InlineMath({ tex }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(tex, ref.current, { throwOnError: false, displayMode: false });
      } catch (e) {
        ref.current.textContent = tex;
      }
    }
  }, [tex]);
  return <span ref={ref} className="math-inline" />;
}

export function BlockMath({ tex }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
      } catch (e) {
        ref.current.textContent = tex;
      }
    }
  }, [tex]);
  return <div ref={ref} className="math-block" />;
}

/**
 * Renders markdown-like text with embedded $...$ and $$...$$ LaTeX.
 */
export function MathText({ children }) {
  if (!children) return null;
  const text = typeof children === 'string' ? children : String(children);
  // Split on $$...$$ blocks first, then $...$ inline
  const parts = [];
  let remaining = text;
  let key = 0;

  // Handle display math $$...$$
  while (remaining.length > 0) {
    const ddStart = remaining.indexOf('$$');
    if (ddStart === -1) {
      // No more display math, parse inline math
      parts.push(...parseInlineMath(remaining, key));
      break;
    }
    // Text before $$
    if (ddStart > 0) {
      parts.push(...parseInlineMath(remaining.slice(0, ddStart), key));
      key += 100;
    }
    const ddEnd = remaining.indexOf('$$', ddStart + 2);
    if (ddEnd === -1) {
      parts.push(...parseInlineMath(remaining.slice(ddStart), key));
      break;
    }
    const latex = remaining.slice(ddStart + 2, ddEnd);
    parts.push(<BlockMath key={`dd-${key++}`} tex={latex} />);
    remaining = remaining.slice(ddEnd + 2);
  }

  return <>{parts}</>;
}

function parseInlineMath(text, keyOffset = 0) {
  const parts = [];
  let remaining = text;
  let key = keyOffset;

  while (remaining.length > 0) {
    const start = remaining.indexOf('$');
    if (start === -1) {
      if (remaining) {
        parts.push(...renderMarkdown(remaining, key));
      }
      break;
    }
    if (start > 0) {
      parts.push(...renderMarkdown(remaining.slice(0, start), key));
      key += 50;
    }
    const end = remaining.indexOf('$', start + 1);
    if (end === -1) {
      parts.push(...renderMarkdown(remaining.slice(start), key));
      break;
    }
    const latex = remaining.slice(start + 1, end);
    parts.push(<InlineMath key={`il-${key++}`} tex={latex} />);
    remaining = remaining.slice(end + 1);
  }

  return parts;
}

function renderMarkdown(text, keyOffset = 0) {
  // Simple bold (**...**) handling
  const parts = [];
  let remaining = text;
  let key = keyOffset;

  while (remaining.length > 0) {
    const bStart = remaining.indexOf('**');
    if (bStart === -1) {
      if (remaining) parts.push(<span key={`t-${key++}`}>{remaining}</span>);
      break;
    }
    if (bStart > 0) {
      parts.push(<span key={`t-${key++}`}>{remaining.slice(0, bStart)}</span>);
    }
    const bEnd = remaining.indexOf('**', bStart + 2);
    if (bEnd === -1) {
      parts.push(<span key={`t-${key++}`}>{remaining.slice(bStart)}</span>);
      break;
    }
    parts.push(<strong key={`b-${key++}`}>{remaining.slice(bStart + 2, bEnd)}</strong>);
    remaining = remaining.slice(bEnd + 2);
  }

  return parts;
}

export default MathText;
