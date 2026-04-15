import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseLatex } from '../math/latex-parser.js';
import { savePaper, exportPaperAsModule, generateId } from '../data/papers.js';
import PaperRenderer from '../components/PaperRenderer.jsx';

// ── PDF.js CDN loader ──────────────────────────────────────────────────────────

const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfjsLoadPromise = null;

function loadPdfJs() {
  if (pdfjsLoadPromise) return pdfjsLoadPromise;
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  pdfjsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = PDFJS_CDN;
    script.onload = () => {
      const lib = window.pdfjsLib;
      if (!lib) { reject(new Error('pdf.js failed to load')); return; }
      lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
      resolve(lib);
    };
    script.onerror = () => reject(new Error('Failed to load pdf.js from CDN'));
    document.head.appendChild(script);
  });
  return pdfjsLoadPromise;
}

// ── Heuristic extraction helpers ─────────────────────────────────────────────

function extractMetadata(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let title = '';
  let authors = [];
  let abstract = '';

  // Title: first non-trivial line that is not a common header/footer
  for (const line of lines) {
    if (line.length < 4) continue;
    if (/^(page|vol|journal|proceedings|copyright|doi:|arxiv:)/i.test(line)) continue;
    title = line;
    break;
  }

  // Authors: look for lines near the top containing commas or "and" between name-like tokens
  const titleIdx = lines.indexOf(title);
  for (let i = titleIdx + 1; i < Math.min(titleIdx + 8, lines.length); i++) {
    const line = lines[i];
    if (!line) continue;
    if (/abstract/i.test(line)) break;
    // Heuristic: line with commas or "and" that looks like names (capitalized words)
    const nameishWords = line.match(/[A-Z][a-z]+/g);
    if (nameishWords && nameishWords.length >= 2 && (line.includes(',') || /\band\b/i.test(line))) {
      authors = line.split(/,|\band\b/i).map(s => s.trim()).filter(s => s.length > 1 && /[A-Z]/.test(s));
      break;
    }
  }

  // Abstract: text between "Abstract" header and next section
  const absMatch = text.match(/abstract[:\s]*\n?([\s\S]*?)(?:\n\s*(?:\d+\.?\s+)?(?:introduction|keywords|1\s)|$)/i);
  if (absMatch) {
    abstract = absMatch[1].trim().replace(/\s+/g, ' ').slice(0, 2000);
  }

  return { title, authors, abstract };
}

const CLAIM_PATTERNS = [
  { label: 'Theorem', regex: /theorem\s*[\d.]*[:\s]*(.*?)(?:\.|$)/gim },
  { label: 'Proposition', regex: /proposition\s*[\d.]*[:\s]*(.*?)(?:\.|$)/gim },
  { label: 'Lemma', regex: /lemma\s*[\d.]*[:\s]*(.*?)(?:\.|$)/gim },
  { label: 'Corollary', regex: /corollary\s*[\d.]*[:\s]*(.*?)(?:\.|$)/gim },
  { label: 'Conjecture', regex: /conjecture\s*[\d.]*[:\s]*(.*?)(?:\.|$)/gim },
  { label: 'Definition', regex: /definition\s*[\d.]*[:\s]*(.*?)(?:\.|$)/gim },
];

function extractClaims(text) {
  const claims = [];
  for (const { label, regex } of CLAIM_PATTERNS) {
    // Reset regex state each call
    const re = new RegExp(regex.source, regex.flags);
    let m;
    while ((m = re.exec(text)) !== null) {
      const body = m[1]?.trim();
      if (body && body.length > 5) {
        claims.push({ label, text: body.slice(0, 300) });
      }
    }
  }
  // Also look for inline equations (simple heuristic)
  const eqMatches = text.match(/\$[^$]+\$/g);
  if (eqMatches && eqMatches.length > 0) {
    claims.push({ label: 'Equations', text: `${eqMatches.length} inline equation(s) detected` });
  }
  return claims;
}

// ── Shared styles ────────────────────────────────────────────────────────────

const cardStyle = {
  background: '#0f1629',
  border: '1px solid rgba(99,102,241,0.25)',
  borderRadius: 12,
  padding: 20,
  marginBottom: 20,
};

const labelStyle = { color: '#94a3b8', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' };

// ── Component ────────────────────────────────────────────────────────────────

export default function PaperUploadPage() {
  // LaTeX state (existing)
  const [rawLatex, setRawLatex] = useState('');
  const [parsed, setParsed] = useState({ metadata: null, nodes: [] });
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef(null);

  // PDF state
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [pdfText, setPdfText] = useState('');
  const [pdfMeta, setPdfMeta] = useState(null);   // { title, authors, abstract }
  const [pdfClaims, setPdfClaims] = useState([]);
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfSaved, setPdfSaved] = useState(false);
  const [pdfPageCount, setPdfPageCount] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' | 'latex'

  const fileInputRef = useRef(null);

  // ── LaTeX handlers (existing, unchanged) ─────────────────────────────────

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

  // ── PDF handlers ─────────────────────────────────────────────────────────

  const processPdf = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      setPdfError('Please upload a .pdf file');
      return;
    }
    setPdfLoading(true);
    setPdfError('');
    setPdfText('');
    setPdfMeta(null);
    setPdfClaims([]);
    setPdfSaved(false);
    setPdfFileName(file.name);

    try {
      const pdfjsLib = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfPageCount(pdf.numPages);
      const pageTexts = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageStr = content.items.map(item => item.str).join(' ');
        pageTexts.push(pageStr);
      }

      const fullText = pageTexts.join('\n\n');
      setPdfText(fullText);
      setPdfMeta(extractMetadata(fullText));
      setPdfClaims(extractClaims(fullText));
    } catch (err) {
      setPdfError(`Failed to parse PDF: ${err.message}`);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processPdf(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processPdf(file);
  };

  const handleSavePdf = () => {
    if (!pdfText) return;
    const paper = {
      id: generateId(),
      title: pdfMeta?.title || pdfFileName || 'Untitled PDF',
      authors: pdfMeta?.authors || [],
      date: '',
      abstract: pdfMeta?.abstract || '',
      rawLatex: '',
      pdfText,
      claims: pdfClaims,
      nodes: [],
      source: 'pdf-upload',
      createdAt: new Date().toISOString(),
    };
    savePaper(paper);
    setPdfSaved(true);
  };

  const handleClearPdf = () => {
    setPdfText('');
    setPdfMeta(null);
    setPdfClaims([]);
    setPdfFileName('');
    setPdfError('');
    setPdfSaved(false);
    setPdfPageCount(null);
  };

  // ── Editable metadata fields for PDF ─────────────────────────────────────

  const updateMeta = (field, value) => {
    setPdfMeta(prev => prev ? { ...prev, [field]: value } : { title: '', authors: [], abstract: '', [field]: value });
    setPdfSaved(false);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const tabBtnStyle = (active) => ({
    background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
    border: `1px solid ${active ? '#6366f1' : 'rgba(148,163,184,0.2)'}`,
    color: active ? '#a5b4fc' : '#94a3b8',
    padding: '10px 28px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div className="page" style={{ maxWidth: 1400 }}>
      <div className="page-header">
        <h1>Upload Paper</h1>
        <p>Upload a PDF or paste LaTeX to preview, extract claims, and save in the app.</p>
      </div>

      {/* Tab switcher */}
      <div role="tablist" aria-label="Upload method" style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button
          role="tab"
          aria-selected={activeTab === 'pdf'}
          aria-controls="panel-pdf"
          id="tab-pdf"
          style={tabBtnStyle(activeTab === 'pdf')}
          onClick={() => setActiveTab('pdf')}
        >
          PDF Upload
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'latex'}
          aria-controls="panel-latex"
          id="tab-latex"
          style={tabBtnStyle(activeTab === 'latex')}
          onClick={() => setActiveTab('latex')}
        >
          LaTeX Input
        </button>
      </div>

      {/* ═══════════ PDF Tab ═══════════ */}
      {activeTab === 'pdf' && (
        <div id="panel-pdf" role="tabpanel" aria-labelledby="tab-pdf">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            style={{
              ...cardStyle,
              border: dragOver ? '2px dashed #6366f1' : '2px dashed rgba(99,102,241,0.3)',
              background: dragOver ? 'rgba(99,102,241,0.08)' : '#0d1220',
              textAlign: 'center',
              padding: '48px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.6 }}>
              {pdfLoading ? '\u23F3' : '\uD83D\uDCC4'}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
              {pdfLoading ? 'Processing PDF...' : 'Drag & drop a PDF here, or click to browse'}
            </div>
            <div style={{ color: '#64748b', fontSize: 13 }}>
              Accepts .pdf files. Text will be extracted from all pages.
            </div>
            {pdfFileName && !pdfLoading && (
              <div style={{ color: '#6366f1', fontSize: 13, marginTop: 10 }}>
                Loaded: {pdfFileName}
              </div>
            )}
          </div>

          {pdfError && (
            <div style={{ ...cardStyle, borderColor: '#ef4444', color: '#f87171', fontSize: 13 }}>
              {pdfError}
            </div>
          )}

          {pdfText && (
            <>
              {/* PDF stats bar */}
              <div style={{
                display: 'flex', gap: 24, flexWrap: 'wrap',
                padding: '10px 18px',
                background: 'rgba(99,102,241,0.07)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 13,
                alignItems: 'center',
              }}>
                {pdfPageCount != null && (
                  <span><strong style={{ color: '#a5b4fc' }}>{pdfPageCount}</strong>{' '}
                    <span style={{ color: '#64748b' }}>page{pdfPageCount !== 1 ? 's' : ''}</span></span>
                )}
                <span><strong style={{ color: '#a5b4fc' }}>{pdfText.split(/\s+/).filter(Boolean).length.toLocaleString()}</strong>{' '}
                  <span style={{ color: '#64748b' }}>words</span></span>
                <span><strong style={{ color: '#a5b4fc' }}>{pdfText.length.toLocaleString()}</strong>{' '}
                  <span style={{ color: '#64748b' }}>chars</span></span>
                {pdfClaims.filter(c => c.label !== 'Equations').length > 0 && (
                  <span><strong style={{ color: '#fbbf24' }}>{pdfClaims.filter(c => c.label !== 'Equations').length}</strong>{' '}
                    <span style={{ color: '#64748b' }}>claim{pdfClaims.filter(c => c.label !== 'Equations').length !== 1 ? 's' : ''}</span></span>
                )}
                {(() => { const eqCount = (pdfText.match(/\$[^$]+\$/g) || []).length; return eqCount > 0 ? (
                  <span><strong style={{ color: '#34d399' }}>{eqCount}</strong>{' '}
                    <span style={{ color: '#64748b' }}>inline equation{eqCount !== 1 ? 's' : ''}</span></span>
                ) : null; })()}
              </div>

              {/* Detected metadata */}
              {pdfMeta && (
                <div style={{ ...cardStyle, borderColor: 'rgba(16,185,129,0.3)' }}>
                  <div style={{ ...labelStyle, marginBottom: 14, color: '#10b981' }}>Detected Metadata</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Title</label>
                      <input
                        type="text"
                        value={pdfMeta.title}
                        onChange={(e) => updateMeta('title', e.target.value)}
                        style={{
                          display: 'block', width: '100%', marginTop: 4,
                          background: '#0a0e1a', border: '1px solid rgba(148,163,184,0.2)',
                          borderRadius: 6, padding: '8px 12px', color: '#e2e8f0', fontSize: 14,
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Authors (comma-separated)</label>
                      <input
                        type="text"
                        value={(pdfMeta.authors || []).join(', ')}
                        onChange={(e) => updateMeta('authors', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        style={{
                          display: 'block', width: '100%', marginTop: 4,
                          background: '#0a0e1a', border: '1px solid rgba(148,163,184,0.2)',
                          borderRadius: 6, padding: '8px 12px', color: '#e2e8f0', fontSize: 14,
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Abstract</label>
                      <textarea
                        value={pdfMeta.abstract}
                        onChange={(e) => updateMeta('abstract', e.target.value)}
                        rows={4}
                        style={{
                          display: 'block', width: '100%', marginTop: 4,
                          background: '#0a0e1a', border: '1px solid rgba(148,163,184,0.2)',
                          borderRadius: 6, padding: '8px 12px', color: '#e2e8f0', fontSize: 13,
                          outline: 'none', resize: 'vertical', lineHeight: 1.6,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Key claims */}
              {pdfClaims.length > 0 && (
                <div style={{ ...cardStyle, borderColor: 'rgba(245,158,11,0.35)' }}>
                  <div style={{ ...labelStyle, marginBottom: 14, color: '#f59e0b' }}>
                    Key Claims ({pdfClaims.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pdfClaims.map((claim, i) => (
                      <div key={i} style={{
                        background: '#0a0e1a',
                        border: '1px solid rgba(245,158,11,0.15)',
                        borderRadius: 8,
                        padding: '10px 14px',
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}>
                        <span style={{
                          display: 'inline-block',
                          background: 'rgba(245,158,11,0.15)',
                          color: '#fbbf24',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          marginRight: 10,
                          textTransform: 'uppercase',
                        }}>
                          {claim.label}
                        </span>
                        <span style={{ color: '#cbd5e1' }}>{claim.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted text preview */}
              <div style={cardStyle}>
                <div style={{ ...labelStyle, marginBottom: 10 }}>Extracted Text Preview</div>
                <div style={{
                  background: '#0a0e1a',
                  border: '1px solid rgba(148,163,184,0.12)',
                  borderRadius: 8,
                  padding: 16,
                  maxHeight: 400,
                  overflowY: 'auto',
                  fontSize: 13,
                  color: '#94a3b8',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'ui-monospace, monospace',
                }}>
                  {pdfText.slice(0, 8000)}
                  {pdfText.length > 8000 && (
                    <span style={{ color: '#6366f1' }}>{'\n\n... [truncated — '}{pdfText.length.toLocaleString()} characters total{']'}</span>
                  )}
                </div>
              </div>

              {/* PDF action buttons */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                <button
                  onClick={handleSavePdf}
                  style={{
                    background: pdfSaved ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                    border: `1px solid ${pdfSaved ? '#10b981' : 'rgba(59,130,246,0.3)'}`,
                    color: pdfSaved ? '#34d399' : '#3b82f6',
                    padding: '8px 20px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {pdfSaved ? 'Saved!' : 'Save PDF Paper'}
                </button>
                <button
                  onClick={handleClearPdf}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(148,163,184,0.2)',
                    color: '#94a3b8',
                    padding: '8px 20px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Clear PDF
                </button>
                <Link
                  to="/papers"
                  style={{
                    color: 'var(--accent-cyan)',
                    fontSize: 13,
                    textDecoration: 'none',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  View Saved Papers &rarr;
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════════ LaTeX Tab ═══════════ */}
      {activeTab === 'latex' && (
        <div id="panel-latex" role="tabpanel" aria-labelledby="tab-latex">
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
              View Saved Papers &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
