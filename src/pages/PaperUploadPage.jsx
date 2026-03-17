import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseLatex } from '../math/latex-parser.js';
import { savePaper, exportPaperAsModule, generateId } from '../data/papers.js';
import PaperRenderer from '../components/PaperRenderer.jsx';

export default function PaperUploadPage() {
  const [rawLatex, setRawLatex] = useState('');
  const [parsed, setParsed] = useState({ metadata: null, nodes: [] });
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef(null);

  // 300ms debounced parsing
  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setRawLatex(val);
    setSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (val.trim()) {
        setParsed(parseLatex(val));
      } else {
        setParsed({ metadata: null, nodes: [] });
      }
    }, 300);
  }, []);

  // Parse on mount if there's content (e.g. from back navigation)
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleSave = () => {
    if (!parsed.nodes.length) return;
    const paper = {
      id: generateId(),
      title: parsed.metadata?.title || 'Untitled Paper',
      authors: parsed.metadata?.authors || [],
      date: parsed.metadata?.date || '',
      abstract: parsed.metadata?.abstract || '',
      rawLatex,
      nodes: parsed.nodes,
      source: 'user',
      createdAt: new Date().toISOString(),
    };
    savePaper(paper);
    setSaved(true);
  };

  const handleExport = () => {
    if (!parsed.nodes.length) return;
    const paper = {
      id: generateId(),
      title: parsed.metadata?.title || 'Untitled Paper',
      authors: parsed.metadata?.authors || [],
      date: parsed.metadata?.date || '',
      abstract: parsed.metadata?.abstract || '',
      rawLatex,
      source: 'export',
      createdAt: new Date().toISOString(),
    };
    const content = exportPaperAsModule(paper);
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.id}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setRawLatex('');
    setParsed({ metadata: null, nodes: [] });
    setSaved(false);
  };

  return (
    <div className="page" style={{ maxWidth: 1400 }}>
      <div className="page-header">
        <h1>Upload Paper</h1>
        <p>Paste LaTeX (e.g. from ChatGPT) to preview and save in the app's academic style.</p>
      </div>

      {/* Metadata bar */}
      {parsed.metadata && parsed.metadata.title && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '12px 18px',
          marginBottom: 20,
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          alignItems: 'center',
          fontSize: 13,
        }}>
          <div><strong style={{ color: '#94a3b8' }}>Title:</strong>{' '}
            <span style={{ color: '#e2e8f0' }}>{parsed.metadata.title}</span>
          </div>
          {parsed.metadata.authors.length > 0 && (
            <div><strong style={{ color: '#94a3b8' }}>Authors:</strong>{' '}
              <span style={{ color: '#e2e8f0' }}>{parsed.metadata.authors.join(', ')}</span>
            </div>
          )}
          {parsed.metadata.date && (
            <div><strong style={{ color: '#94a3b8' }}>Date:</strong>{' '}
              <span style={{ color: '#e2e8f0' }}>{parsed.metadata.date}</span>
            </div>
          )}
        </div>
      )}

      {/* Two-column layout */}
      <div className="paper-upload-grid">
        {/* Left: Editor */}
        <div>
          <textarea
            className="latex-textarea"
            value={rawLatex}
            onChange={handleChange}
            placeholder={'Paste your LaTeX here...\n\n\\documentclass{article}\n\\title{My Paper}\n\\author{Author Name}\n\\begin{document}\n\\maketitle\n\\section{Introduction}\n...'}
            spellCheck={false}
          />
        </div>

        {/* Right: Preview */}
        <div className="paper-preview-panel">
          <PaperRenderer metadata={parsed.metadata} nodes={parsed.nodes} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="paper-actions">
        <button
          onClick={handleSave}
          disabled={!parsed.nodes.length}
          style={{
            background: saved ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
            border: `1px solid ${saved ? '#10b981' : 'rgba(59,130,246,0.3)'}`,
            color: saved ? '#34d399' : '#3b82f6',
            padding: '8px 20px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: parsed.nodes.length ? 'pointer' : 'not-allowed',
            opacity: parsed.nodes.length ? 1 : 0.4,
            transition: 'all 0.2s',
          }}
        >
          {saved ? 'Saved!' : 'Save to Browser'}
        </button>
        <button
          onClick={handleExport}
          disabled={!parsed.nodes.length}
          style={{
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.3)',
            color: '#8b5cf6',
            padding: '8px 20px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: parsed.nodes.length ? 'pointer' : 'not-allowed',
            opacity: parsed.nodes.length ? 1 : 0.4,
            transition: 'all 0.2s',
          }}
        >
          Export .js File
        </button>
        <button
          onClick={handleClear}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            padding: '8px 20px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Clear
        </button>
        <Link
          to="/papers"
          style={{
            color: 'var(--accent-cyan)',
            fontSize: 13,
            textDecoration: 'none',
            padding: '8px 12px',
          }}
        >
          View Saved Papers →
        </Link>
      </div>
    </div>
  );
}
