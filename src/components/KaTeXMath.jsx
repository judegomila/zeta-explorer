import React, { useRef, useEffect, useState, useContext, useCallback, createContext } from 'react';
import { createPortal } from 'react-dom';
import katex from 'katex';

// ─── Math Modal Context ─────────────────────────────────────────────────────

const MathModalContext = createContext(null);

export function MathModalProvider({ children }) {
  const [modal, setModal] = useState(null);
  const openModal = useCallback((data) => setModal(data), []);
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <MathModalContext.Provider value={{ openModal }}>
      {children}
      {modal && createPortal(
        <MathModal tex={modal.tex} displayMode={modal.displayMode} onClose={closeModal} />,
        document.body
      )}
    </MathModalContext.Provider>
  );
}

// ─── Math Modal Component ───────────────────────────────────────────────────

function MathModal({ tex, displayMode, onClose }) {
  const renderedRef = useRef();
  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);

  useEffect(() => {
    if (renderedRef.current) {
      try {
        katex.render(tex, renderedRef.current, { throwOnError: false, displayMode: true });
      } catch (e) {
        renderedRef.current.textContent = tex;
      }
    }
  }, [tex]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleCopyRendered = () => {
    // Copy as both plain TeX and the rendered text
    const rendered = renderedRef.current?.textContent || tex;
    navigator.clipboard.writeText(`${rendered}\n\nLaTeX: ${tex}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="math-modal-backdrop" onClick={onClose}>
      <div className="math-modal" onClick={e => e.stopPropagation()}>
        <div className="math-modal-header">
          <span className="math-modal-title">Equation Detail</span>
          <div className="math-modal-actions">
            <button
              className={`math-modal-action-btn ${showSource ? 'active' : ''}`}
              onClick={() => setShowSource(s => !s)}
              title="Toggle LaTeX source"
            >
              {'</>'}
            </button>
            <button
              className="math-modal-action-btn"
              onClick={handleCopy}
              title="Copy LaTeX"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button className="math-modal-close" onClick={onClose}>&times;</button>
          </div>
        </div>
        <div className="math-modal-rendered" ref={renderedRef} />
        {showSource && (
          <>
            <div className="math-modal-divider" />
            <div className="math-modal-source-label">LaTeX Source</div>
            <div className="math-modal-source">
              <code>{tex}</code>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── InlineMath (clickable) ─────────────────────────────────────────────────

export function InlineMath({ tex }) {
  const ref = useRef();
  const ctx = useContext(MathModalContext);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(tex, ref.current, { throwOnError: false, displayMode: false });
      } catch (e) {
        ref.current.textContent = tex;
      }
    }
  }, [tex]);

  const handleClick = (e) => {
    if (!ctx) return;
    e.stopPropagation();
    ctx.openModal({ tex, displayMode: false });
  };

  return <span ref={ref} className="math-inline math-clickable" onClick={handleClick} />;
}

// ─── BlockMath (clickable) ──────────────────────────────────────────────────

export function BlockMath({ tex }) {
  const ref = useRef();
  const ctx = useContext(MathModalContext);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
      } catch (e) {
        ref.current.textContent = tex;
      }
    }
  }, [tex]);

  const handleClick = (e) => {
    if (!ctx) return;
    e.stopPropagation();
    ctx.openModal({ tex, displayMode: true });
  };

  return <div ref={ref} className="math-block math-clickable" onClick={handleClick} />;
}

// ─── MathText (parses $...$ and $$...$$) ────────────────────────────────────

/**
 * Renders markdown-like text with embedded $...$ and $$...$$ LaTeX.
 */
export function MathText({ children }) {
  if (!children) return null;
  const text = typeof children === 'string' ? children : String(children);
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const ddStart = remaining.indexOf('$$');
    if (ddStart === -1) {
      parts.push(...parseInlineMath(remaining, key));
      break;
    }
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
      if (remaining) parts.push(...renderMarkdown(remaining, key));
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
