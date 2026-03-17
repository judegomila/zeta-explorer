import React from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';

// ─── Styled Components (matches PaperPage.jsx) ───────────────────────────────

function Section({ number, title }) {
  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ color: '#e2e8f0', fontSize: 22, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
        {number && <>{number}. </>}{title}
      </h2>
    </div>
  );
}

function Subsection({ number, title }) {
  return (
    <div style={{ marginTop: 28 }}>
      <h3 style={{ color: '#cbd5e1', fontSize: 18, fontWeight: 600 }}>
        {number && <>{number}. </>}{title}
      </h3>
    </div>
  );
}

function Subsubsection({ title }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h4 style={{ color: '#94a3b8', fontSize: 15, fontWeight: 600, fontStyle: 'italic' }}>
        {title}
      </h4>
    </div>
  );
}

function P({ children }) {
  return <p style={{ fontSize: 15, lineHeight: 1.85, color: '#cbd5e1', marginTop: 12 }}>{children}</p>;
}

function Def({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #8b5cf6', background: 'rgba(139,92,246,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#a78bfa', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label || 'Definition'}
      </strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function Thm({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #10b981', background: 'rgba(16,185,129,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#34d399', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label || 'Theorem'}
      </strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function Lemma({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #3b82f6', background: 'rgba(59,130,246,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#60a5fa', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label || 'Lemma'}
      </strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function Proof({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #f59e0b', background: 'rgba(245,158,11,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#fbbf24', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px', fontStyle: 'italic' }}>
        {label || 'Proof'}
      </strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>
        {children}
        <span style={{ float: 'right', fontSize: 16, fontStyle: 'normal' }}>&#9633;</span>
      </div>
    </div>
  );
}

function Rmk({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #06b6d4', background: 'rgba(6,182,212,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#22d3ee', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label || 'Remark'}
      </strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function Conjecture({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #f59e0b', background: 'rgba(245,158,11,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#fbbf24', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label || 'Conjecture'}
      </strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function Question({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #ec4899', background: 'rgba(236,72,153,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#f472b6', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label || 'Question'}
      </strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function Principle({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #a78bfa', background: 'rgba(167,139,250,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#c4b5fd', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label || 'Principle'}
      </strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function Example({ label, children }) {
  return (
    <div style={{ margin: '16px 0', padding: '12px 16px', borderLeft: '3px solid #ec4899', background: 'rgba(236,72,153,0.06)', borderRadius: '0 8px 8px 0' }}>
      <strong style={{ color: '#f472b6', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label || 'Example'}
      </strong>
      <div style={{ marginTop: 6, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

// ─── Environment map ──────────────────────────────────────────────────────────

const ENV_COMPONENTS = {
  theorem: Thm,
  definition: Def,
  lemma: Lemma,
  proposition: Thm,
  corollary: Thm,
  proof: Proof,
  remark: Rmk,
  example: Example,
  conjecture: Conjecture,
  question: Question,
  principle: Principle,
  assumption: Def,
  notation: Def,
  observation: Rmk,
  claim: Thm,
  exercise: Example,
};

// ─── Inline Rendering ─────────────────────────────────────────────────────────

function renderInlineNodes(children, keyPrefix = '') {
  if (!children || !Array.isArray(children)) return null;

  return children.map((node, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (node.type) {
      case 'text':
        return <span key={key}>{node.content}</span>;
      case 'inlinemath':
        return <InlineMath key={key} tex={node.tex} />;
      case 'blockmath':
        return <BlockMath key={key} tex={node.tex} />;
      case 'bold':
        return <strong key={key} style={{ color: '#e2e8f0' }}>{node.content}</strong>;
      case 'italic':
        return <em key={key}>{node.content}</em>;
      case 'cite':
        return <span key={key} style={{ color: '#818cf8', fontSize: 13 }}>[{node.keys.join(', ')}]</span>;
      case 'url':
        return (
          <a key={key} href={node.url} target="_blank" rel="noopener noreferrer"
            style={{ color: '#60a5fa', fontSize: 13, wordBreak: 'break-all' }}>
            {node.text || node.url}
          </a>
        );
      default:
        return null;
    }
  });
}

// ─── Node Renderer ────────────────────────────────────────────────────────────

function renderNode(node, i) {
  const key = `node-${i}`;

  switch (node.type) {
    case 'section':
      return <Section key={key} number={node.number} title={node.title} />;
    case 'subsection':
      return <Subsection key={key} number={node.number} title={node.title} />;
    case 'subsubsection':
      return <Subsubsection key={key} title={node.title} />;

    case 'paragraph':
      return <P key={key}>{renderInlineNodes(node.children, key)}</P>;

    case 'blockmath':
      return <BlockMath key={key} tex={node.tex} />;

    case 'environment': {
      const Comp = ENV_COMPONENTS[node.env] || Rmk;
      const envLabel = node.label
        ? `${node.env.charAt(0).toUpperCase() + node.env.slice(1)} (${node.label})`
        : `${node.env.charAt(0).toUpperCase() + node.env.slice(1)}`;
      return (
        <Comp key={key} label={envLabel}>
          {renderInlineNodes(node.children, key)}
        </Comp>
      );
    }

    case 'list': {
      const Tag = node.ordered ? 'ol' : 'ul';
      return (
        <Tag key={key} style={{ marginLeft: 24, marginTop: 8, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
          {node.items.map((item, j) => (
            <li key={`${key}-li-${j}`} style={{ marginBottom: 4 }}>
              {renderInlineNodes(item.children, `${key}-li-${j}`)}
            </li>
          ))}
        </Tag>
      );
    }

    case 'callout':
      return (
        <div key={key} style={{
          margin: '20px 0',
          padding: '16px 20px',
          background: 'rgba(59,130,246,0.04)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 10,
        }}>
          {node.title && (
            <strong style={{ color: '#60a5fa', fontSize: 14, display: 'block', marginBottom: 8 }}>
              {node.title}
            </strong>
          )}
          <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
            {renderInlineNodes(node.children, key)}
          </div>
        </div>
      );

    case 'table':
      return (
        <div key={key} style={{ overflowX: 'auto', margin: '16px 0' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
          }}>
            <tbody>
              {node.rows.map((row, ri) => (
                <tr key={`${key}-r-${ri}`} style={ri === 0 ? {
                  borderBottom: '2px solid #334155',
                } : {
                  borderBottom: '1px solid #1e293b',
                }}>
                  {row.map((cell, ci) => {
                    const CellTag = ri === 0 ? 'th' : 'td';
                    return (
                      <CellTag key={`${key}-c-${ri}-${ci}`} style={{
                        padding: '8px 12px',
                        textAlign: 'left',
                        color: ri === 0 ? '#94a3b8' : '#cbd5e1',
                        fontWeight: ri === 0 ? 600 : 400,
                        fontSize: ri === 0 ? 11 : 13,
                        textTransform: ri === 0 ? 'uppercase' : 'none',
                        letterSpacing: ri === 0 ? '0.5px' : 'normal',
                        verticalAlign: 'top',
                        lineHeight: 1.6,
                      }}>
                        {cell}
                      </CellTag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'bibliography':
      return (
        <div key={key} style={{ marginTop: 16 }}>
          {node.items.map((item, bi) => (
            <div key={`${key}-bib-${bi}`} style={{
              padding: '8px 0',
              borderBottom: '1px solid #1e293b',
              fontSize: 13,
              color: '#94a3b8',
              lineHeight: 1.6,
            }}>
              <span style={{ color: '#818cf8', fontWeight: 600, marginRight: 8 }}>
                [{item.key}]
              </span>
              {item.text}
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PaperRenderer({ metadata, nodes }) {
  if (!nodes || nodes.length === 0) {
    return (
      <div style={{ color: '#64748b', textAlign: 'center', padding: '40px 20px', fontSize: 14 }}>
        Paste LaTeX in the editor to see a live preview
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Title Block */}
      {metadata && metadata.title && (
        <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 16 }}>
          <h1 style={{ fontSize: 26, color: '#f1f5f9', lineHeight: 1.3, marginBottom: 10 }}>
            {metadata.title}
          </h1>
          {metadata.authors.length > 0 && (
            <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 8 }}>
              {metadata.authors.join(' & ')}
            </p>
          )}
          {metadata.date && (
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
              {metadata.date}
            </p>
          )}
        </div>
      )}

      {/* Abstract */}
      {metadata && metadata.abstract && (
        <div style={{
          margin: '0 auto 32px',
          maxWidth: 720,
          padding: '16px 20px',
          borderLeft: '3px solid #4f46e5',
          background: 'rgba(79,70,229,0.06)',
          borderRadius: '0 8px 8px 0',
        }}>
          <strong style={{ color: '#818cf8', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Abstract
          </strong>
          <div style={{ marginTop: 8, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>
            {metadata.abstract}
          </div>
        </div>
      )}

      {/* Body */}
      {nodes.map((node, i) => renderNode(node, i))}
    </div>
  );
}
