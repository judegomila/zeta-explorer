import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseLatex } from '../math/latex-parser.js';
import { savePaper, exportPaperAsModule, generateId } from '../data/papers.js';
import PaperRenderer from '../components/PaperRenderer.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED, alpha } from '../styles/tokens.js';

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
// Editorial (warm) re-theme: full-width page, identical structure/state/logic
// (recipe: LambdaBoundsPage.jsx). Dark-hex -> editorial var mapping (consistent
// with other editorial ports, e.g. LambdaBoundsPage.jsx / MetaAccelerationPage.jsx):
//   #6366f1 / #a5b4fc indigo -> var(--brass)    #8b5cf6 violet -> var(--brass)
//   #f59e0b / #fbbf24 amber -> var(--brass-dk)  #ef4444 / #f87171 red -> var(--terra-dk)
//   #10b981 / #34d399 green -> var(--green)     #3b82f6 blue -> var(--blue)
//   #94a3b8 / #64748b slate -> var(--faint)     #cbd5e1 slate -> var(--ink-soft)
//   #e2e8f0 light text -> var(--ink)            #0f1629/#0d1220/#0a0e1a dark
//   surfaces -> var(--paper2) / var(--paper3) / var(--paper)

const cardStyle = {
  background: 'var(--paper2)',
  border: '1px solid color-mix(in srgb, var(--brass) 25%, transparent)',
  borderRadius: 12,
  padding: 20,
  marginBottom: 20,
};

const labelStyle = { color: 'var(--faint)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' };

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
    background: active ? alpha(ED.brass, 0.2) : 'transparent',
    border: `1px solid ${active ? 'var(--brass)' : 'var(--hairline)'}`,
    color: active ? 'var(--brass)' : 'var(--faint)',
    padding: '10px 28px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Upload Paper</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Upload a PDF or paste LaTeX to preview, extract claims, and save in the app.
          </p>
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
              onDrop={pdfLoading ? undefined : handleDrop}
              onDragOver={pdfLoading ? undefined : handleDragOver}
              onDragLeave={pdfLoading ? undefined : handleDragLeave}
              onClick={pdfLoading ? undefined : () => fileInputRef.current?.click()}
              aria-busy={pdfLoading}
              aria-label={pdfLoading ? 'Processing PDF, please wait' : 'PDF upload drop zone'}
              style={{
                ...cardStyle,
                border: dragOver ? '2px dashed var(--brass)' : '2px dashed color-mix(in srgb, var(--brass) 30%, transparent)',
                background: dragOver ? 'color-mix(in srgb, var(--brass) 8%, transparent)' : 'var(--paper3)',
                textAlign: 'center',
                padding: '48px 20px',
                cursor: pdfLoading ? 'not-allowed' : 'pointer',
                opacity: pdfLoading ? 0.7 : 1,
                pointerEvents: pdfLoading ? 'none' : 'auto',
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
                {pdfLoading ? '⏳' : '📄'}
              </div>
              <div style={{ color: 'var(--ink)', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                {pdfLoading ? 'Processing PDF...' : 'Drag & drop a PDF here, or click to browse'}
              </div>
              <div style={{ color: 'var(--faint)', fontSize: 13 }}>
                Accepts .pdf files. Text will be extracted from all pages.
              </div>
              {pdfFileName && !pdfLoading && (
                <div style={{ color: 'var(--brass)', fontSize: 13, marginTop: 10 }}>
                  Loaded: {pdfFileName}
                </div>
              )}
            </div>

            {pdfError && (
              <div style={{ ...cardStyle, borderColor: 'var(--terra-dk)', color: 'var(--terra-dk)', fontSize: 13 }}>
                {pdfError}
              </div>
            )}

            {pdfText && (
              <>
                {/* PDF stats bar */}
                <div style={{
                  display: 'flex', gap: 24, flexWrap: 'wrap',
                  padding: '10px 18px',
                  background: 'color-mix(in srgb, var(--brass) 7%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--brass) 20%, transparent)',
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 13,
                  alignItems: 'center',
                }}>
                  {pdfPageCount != null && (
                    <span><strong style={{ color: 'var(--brass)' }}>{pdfPageCount}</strong>{' '}
                      <span style={{ color: 'var(--faint)' }}>page{pdfPageCount !== 1 ? 's' : ''}</span></span>
                  )}
                  <span><strong style={{ color: 'var(--brass)' }}>{pdfText.split(/\s+/).filter(Boolean).length.toLocaleString()}</strong>{' '}
                    <span style={{ color: 'var(--faint)' }}>words</span></span>
                  <span><strong style={{ color: 'var(--brass)' }}>{pdfText.length.toLocaleString()}</strong>{' '}
                    <span style={{ color: 'var(--faint)' }}>chars</span></span>
                  {pdfClaims.filter(c => c.label !== 'Equations').length > 0 && (
                    <span><strong style={{ color: 'var(--brass-dk)' }}>{pdfClaims.filter(c => c.label !== 'Equations').length}</strong>{' '}
                      <span style={{ color: 'var(--faint)' }}>claim{pdfClaims.filter(c => c.label !== 'Equations').length !== 1 ? 's' : ''}</span></span>
                  )}
                  {(() => { const eqCount = (pdfText.match(/\$[^$]+\$/g) || []).length; return eqCount > 0 ? (
                    <span><strong style={{ color: 'var(--green)' }}>{eqCount}</strong>{' '}
                      <span style={{ color: 'var(--faint)' }}>inline equation{eqCount !== 1 ? 's' : ''}</span></span>
                  ) : null; })()}
                </div>

                {/* Detected metadata */}
                {pdfMeta && (
                  <div style={{ ...cardStyle, borderColor: 'color-mix(in srgb, var(--series-3) 30%, transparent)' }}>
                    <div style={{ ...labelStyle, marginBottom: 14, color: 'var(--green)' }}>Detected Metadata</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Title</label>
                        <input
                          type="text"
                          value={pdfMeta.title}
                          onChange={(e) => updateMeta('title', e.target.value)}
                          style={{
                            display: 'block', width: '100%', marginTop: 4,
                            background: 'var(--paper)', border: '1px solid var(--hairline)',
                            borderRadius: 6, padding: '8px 12px', color: 'var(--ink)', fontSize: 14,
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
                            background: 'var(--paper)', border: '1px solid var(--hairline)',
                            borderRadius: 6, padding: '8px 12px', color: 'var(--ink)', fontSize: 14,
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
                            background: 'var(--paper)', border: '1px solid var(--hairline)',
                            borderRadius: 6, padding: '8px 12px', color: 'var(--ink)', fontSize: 13,
                            outline: 'none', resize: 'vertical', lineHeight: 1.6,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Key claims */}
                {pdfClaims.length > 0 && (
                  <div style={{ ...cardStyle, borderColor: 'color-mix(in srgb, var(--brass-deco) 35%, transparent)' }}>
                    <div style={{ ...labelStyle, marginBottom: 14, color: 'var(--brass-dk)' }}>
                      Key Claims ({pdfClaims.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {pdfClaims.map((claim, i) => (
                        <div key={i} style={{
                          background: 'var(--paper)',
                          border: '1px solid color-mix(in srgb, var(--brass-deco) 15%, transparent)',
                          borderRadius: 8,
                          padding: '10px 14px',
                          fontSize: 13,
                          lineHeight: 1.5,
                        }}>
                          <span style={{
                            display: 'inline-block',
                            background: 'color-mix(in srgb, var(--brass-deco) 15%, transparent)',
                            color: 'var(--brass-dk)',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            marginRight: 10,
                            textTransform: 'uppercase',
                          }}>
                            {claim.label}
                          </span>
                          <span style={{ color: 'var(--ink-soft)' }}>{claim.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted text preview */}
                <div style={cardStyle}>
                  <div style={{ ...labelStyle, marginBottom: 10 }}>Extracted Text Preview</div>
                  <div style={{
                    background: 'var(--paper)',
                    border: '1px solid var(--hairline)',
                    borderRadius: 8,
                    padding: 16,
                    maxHeight: 400,
                    overflowY: 'auto',
                    fontSize: 13,
                    color: 'var(--faint)',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'var(--ed-mono, var(--font-mono))',
                  }}>
                    {pdfText.slice(0, 8000)}
                    {pdfText.length > 8000 && (
                      <span style={{ color: 'var(--brass)' }}>{'\n\n... [truncated — '}{pdfText.length.toLocaleString()} characters total{']'}</span>
                    )}
                  </div>
                </div>

                {/* PDF action buttons */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                  <button
                    onClick={handleSavePdf}
                    style={{
                      background: pdfSaved ? 'color-mix(in srgb, var(--series-3) 15%, transparent)' : 'color-mix(in srgb, var(--series-1) 15%, transparent)',
                      border: `1px solid ${pdfSaved ? 'var(--green)' : alpha(ED.series1, 0.3)}`,
                      color: pdfSaved ? 'var(--green)' : 'var(--blue)',
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
                      border: '1px solid var(--hairline)',
                      color: 'var(--faint)',
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
                      color: 'var(--brass-dk)',
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
                background: 'var(--paper2)',
                border: '1px solid var(--hairline)',
                borderRadius: 10,
                padding: '12px 18px',
                marginBottom: 20,
                display: 'flex',
                gap: 24,
                flexWrap: 'wrap',
                alignItems: 'center',
                fontSize: 13,
              }}>
                <div><strong style={{ color: 'var(--faint)' }}>Title:</strong>{' '}
                  <span style={{ color: 'var(--ink)' }}>{parsed.metadata.title}</span>
                </div>
                {parsed.metadata.authors.length > 0 && (
                  <div><strong style={{ color: 'var(--faint)' }}>Authors:</strong>{' '}
                    <span style={{ color: 'var(--ink)' }}>{parsed.metadata.authors.join(', ')}</span>
                  </div>
                )}
                {parsed.metadata.date && (
                  <div><strong style={{ color: 'var(--faint)' }}>Date:</strong>{' '}
                    <span style={{ color: 'var(--ink)' }}>{parsed.metadata.date}</span>
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
                  background: saved ? 'color-mix(in srgb, var(--series-3) 15%, transparent)' : 'color-mix(in srgb, var(--series-1) 15%, transparent)',
                  border: `1px solid ${saved ? 'var(--green)' : alpha(ED.series1, 0.3)}`,
                  color: saved ? 'var(--green)' : 'var(--blue)',
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
                  background: 'color-mix(in srgb, var(--brass) 15%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--brass) 30%, transparent)',
                  color: 'var(--brass)',
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
                  border: '1px solid var(--hairline)',
                  color: 'var(--ink-soft)',
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
                  color: 'var(--brass-dk)',
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

        {/* ── Related pages ─────────────────────────────────────────────── */}
        <div className="card" style={{ background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: '16px 18px', marginTop: 24 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>Related pages</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/papers" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Saved Papers
            </Link>
            <Link to="/literature" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Literature
            </Link>
          </div>
        </div>

        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div>
            <Link to="/">← the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
