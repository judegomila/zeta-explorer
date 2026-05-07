/**
 * LaTeX → AST parser for ChatGPT-style LaTeX output.
 *
 * Two phases:
 * 1. Extract metadata (\title, \author, \date, abstract, \newcommand macros)
 * 2. Parse body into sequential AST nodes
 *
 * Exports: parseLatex(raw) → { metadata, nodes }
 */

// ─── Phase 1: Metadata Extraction ─────────────────────────────────────────────

function extractBalancedBraces(text, startIdx) {
  // Extract content inside balanced braces starting at startIdx (which should be '{')
  if (text[startIdx] !== '{') return null;
  let depth = 1;
  let i = startIdx + 1;
  while (i < text.length && depth > 0) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') depth--;
    i++;
  }
  if (depth !== 0) return null;
  return { content: text.slice(startIdx + 1, i - 1), end: i };
}

function extractMetadata(raw) {
  const metadata = { title: '', authors: [], date: '', abstract: '', macros: {} };

  // \title{...} — use balanced brace extraction for deep nesting
  const titleIdx = raw.indexOf('\\title{');
  if (titleIdx !== -1) {
    // Also try \title{\bfseries ...} pattern
    const titleStart = raw.indexOf('{', titleIdx);
    const extracted = extractBalancedBraces(raw, titleStart);
    if (extracted) metadata.title = cleanTeX(extracted.content);
  }

  // \author{...}
  const authorIdx = raw.indexOf('\\author{');
  if (authorIdx !== -1) {
    const authorStart = raw.indexOf('{', authorIdx);
    const extracted = extractBalancedBraces(raw, authorStart);
    if (extracted) {
      metadata.authors = extracted.content
        .split(/\\and|\\\\/)
        .map(a => cleanTeX(a.trim()))
        .filter(Boolean);
    }
  }

  // \date{...}
  const dateIdx = raw.indexOf('\\date{');
  if (dateIdx !== -1) {
    const dateStart = raw.indexOf('{', dateIdx);
    const extracted = extractBalancedBraces(raw, dateStart);
    if (extracted) metadata.date = cleanTeX(extracted.content);
  }

  // \begin{abstract}...\end{abstract}
  const abstractMatch = raw.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);
  if (abstractMatch) metadata.abstract = abstractMatch[1].trim();

  // \newcommand{\name}[args]{def} or \renewcommand
  const macroRe = /\\(?:newcommand|renewcommand)\{\\(\w+)\}(?:\[\d+\])?\{/g;
  let m;
  while ((m = macroRe.exec(raw)) !== null) {
    const braceStart = m.index + m[0].length - 1; // position of the opening {
    const extracted = extractBalancedBraces(raw, braceStart);
    if (extracted) {
      metadata.macros[m[1]] = extracted.content;
    }
  }

  // \DeclareMathOperator{\name}{text}
  const declareRe = /\\DeclareMathOperator\{\\(\w+)\}\{([^}]*)\}/g;
  while ((m = declareRe.exec(raw)) !== null) {
    metadata.macros[m[1]] = '\\operatorname{' + m[2] + '}';
  }

  return metadata;
}

function cleanTeX(text) {
  return text
    .replace(/\\\\(?:\[[^\]]*\])?/g, ' ')   // \\[0.4em] etc.
    .replace(/\\bfseries\s*/g, '')
    .replace(/\\large\s*/g, '')
    .replace(/\\normalsize\s*/g, '')
    .replace(/\\small\s*/g, '')
    .replace(/\\textbf\{([^}]*)\}/g, '$1')
    .replace(/\\textit\{([^}]*)\}/g, '$1')
    .replace(/\\emph\{([^}]*)\}/g, '$1')
    .replace(/\\textrm\{([^}]*)\}/g, '$1')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\textsc\{([^}]*)\}/g, '$1')
    .replace(/~/, ' ')
    .replace(/\{|\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Phase 2: Body Parsing ────────────────────────────────────────────────────

function stripPreamble(raw) {
  let body = raw;
  const docBegin = body.indexOf('\\begin{document}');
  if (docBegin !== -1) body = body.slice(docBegin + '\\begin{document}'.length);
  const docEnd = body.indexOf('\\end{document}');
  if (docEnd !== -1) body = body.slice(0, docEnd);

  body = body.replace(/\\maketitle/, '');
  body = body.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/, '');
  body = body.replace(/\\tableofcontents/, '');

  return body.trim();
}

function expandMacros(tex, macros) {
  let result = tex;
  for (const [name, def] of Object.entries(macros)) {
    const re = new RegExp('\\\\' + name + '(?![a-zA-Z])', 'g');
    result = result.replace(re, def);
  }
  return result;
}

// All theorem-like environments we recognize
const THEOREM_ENVS = [
  'theorem', 'definition', 'lemma', 'proposition', 'corollary',
  'proof', 'remark', 'example', 'conjecture', 'question', 'principle',
  'assumption', 'notation', 'observation', 'claim', 'exercise',
];

// Math display environments
const MATH_ENVS = ['equation', 'equation*', 'align', 'align*', 'gather', 'gather*', 'multline', 'multline*'];

function parseBody(body, macros) {
  const nodes = [];
  let sectionCounter = 0;
  let subsectionCounter = 0;
  let appendixMode = false;
  let appendixCounter = 0;
  let pos = 0;

  // Build patterns dynamically
  const patterns = [
    { type: 'appendix', re: /\\appendix/ },
    { type: 'section', re: /\\section\*?\{/ },
    { type: 'subsection', re: /\\subsection\*?\{/ },
    { type: 'subsubsection', re: /\\subsubsection\*?\{/ },
  ];

  // Theorem-like environments
  for (const env of THEOREM_ENVS) {
    patterns.push({ type: 'env_theorem', env, re: new RegExp('\\\\begin\\{' + env + '\\}(?:\\[([^\\]]*)\\])?') });
  }

  // Math environments
  for (const env of MATH_ENVS) {
    const escaped = env.replace('*', '\\*');
    patterns.push({ type: 'env_math', env, re: new RegExp('\\\\begin\\{' + escaped + '\\}') });
  }

  // Lists — match with optional [...] arguments
  patterns.push({ type: 'env_itemize', re: /\\begin\{itemize\}(?:\[[^\]]*\])?/ });
  patterns.push({ type: 'env_enumerate', re: /\\begin\{enumerate\}(?:\[[^\]]*\])?/ });

  // tcolorbox
  patterns.push({ type: 'env_tcolorbox', re: /\\begin\{tcolorbox\}(?:\[[^\]]*\])?/ });

  // Tables
  patterns.push({ type: 'env_table', re: /\\begin\{(?:tabularx|tabular|longtable)\}/ });

  // center environment (often wraps tables)
  patterns.push({ type: 'env_center', re: /\\begin\{center\}/ });

  // Bibliography
  patterns.push({ type: 'env_bibliography', re: /\\begin\{thebibliography\}(?:\{[^}]*\})?/ });

  // Block math
  patterns.push({ type: 'blockmath_dd', re: /\$\$/ });
  patterns.push({ type: 'blockmath_bracket', re: /\\\[/ });

  while (pos < body.length) {
    let earliest = null;
    let earliestIdx = body.length;

    for (const pat of patterns) {
      pat.re.lastIndex = 0;
      const remaining = body.slice(pos);
      const match = remaining.match(pat.re);
      if (match && match.index !== undefined) {
        const absIdx = pos + match.index;
        if (absIdx < earliestIdx) {
          earliestIdx = absIdx;
          earliest = { ...pat, match, absIdx };
        }
      }
    }

    if (!earliest) {
      const text = body.slice(pos).trim();
      if (text) pushTextNodes(nodes, text, macros);
      break;
    }

    if (earliest.absIdx > pos) {
      const text = body.slice(pos, earliest.absIdx).trim();
      if (text) pushTextNodes(nodes, text, macros);
    }

    const afterMatch = earliest.absIdx + earliest.match[0].length;

    switch (earliest.type) {
      case 'appendix': {
        appendixMode = true;
        appendixCounter = 0;
        sectionCounter = 0;
        pos = afterMatch;
        break;
      }
      case 'section': {
        // Extract title with balanced braces
        const titleExtracted = extractBalancedBraces(body, afterMatch - 1);
        if (titleExtracted) {
          if (appendixMode) {
            appendixCounter++;
            nodes.push({
              type: 'section',
              number: String.fromCharCode(64 + appendixCounter),
              title: cleanTeX(titleExtracted.content),
            });
          } else {
            sectionCounter++;
            subsectionCounter = 0;
            nodes.push({
              type: 'section',
              number: String(sectionCounter),
              title: cleanTeX(titleExtracted.content),
            });
          }
          pos = titleExtracted.end;
        } else {
          pos = afterMatch;
        }
        // skip optional \label{...} right after
        const labelAfterSec = body.slice(pos).match(/^\s*\\label\{[^}]*\}/);
        if (labelAfterSec) pos += labelAfterSec[0].length;
        break;
      }
      case 'subsection': {
        const titleExtracted = extractBalancedBraces(body, afterMatch - 1);
        if (titleExtracted) {
          subsectionCounter++;
          const secNum = appendixMode
            ? `${String.fromCharCode(64 + appendixCounter)}.${subsectionCounter}`
            : `${sectionCounter}.${subsectionCounter}`;
          nodes.push({
            type: 'subsection',
            number: secNum,
            title: cleanTeX(titleExtracted.content),
          });
          pos = titleExtracted.end;
        } else {
          pos = afterMatch;
        }
        const labelAfterSub = body.slice(pos).match(/^\s*\\label\{[^}]*\}/);
        if (labelAfterSub) pos += labelAfterSub[0].length;
        break;
      }
      case 'subsubsection': {
        const titleExtracted = extractBalancedBraces(body, afterMatch - 1);
        if (titleExtracted) {
          nodes.push({
            type: 'subsubsection',
            title: cleanTeX(titleExtracted.content),
          });
          pos = titleExtracted.end;
        } else {
          pos = afterMatch;
        }
        break;
      }
      case 'env_theorem': {
        const envName = earliest.env;
        const endTag = `\\end{${envName}}`;
        const endIdx = body.indexOf(endTag, afterMatch);
        const content = endIdx !== -1 ? body.slice(afterMatch, endIdx) : body.slice(afterMatch);
        nodes.push({
          type: 'environment',
          env: envName,
          label: earliest.match[1] || null,
          content: content.trim(),
          children: parseEnvironmentBody(content.trim(), macros),
        });
        pos = endIdx !== -1 ? endIdx + endTag.length : body.length;
        break;
      }
      case 'env_math': {
        const envName = earliest.env;
        const endTag = `\\end{${envName}}`;
        const endIdx = body.indexOf(endTag, afterMatch);
        let tex = endIdx !== -1 ? body.slice(afterMatch, endIdx) : body.slice(afterMatch);
        tex = expandMacros(tex.trim(), macros);
        // Strip \label{...} from inside equations
        tex = tex.replace(/\\label\{[^}]*\}/g, '');
        // Convert align/gather/multline to aligned for KaTeX
        const baseEnv = envName.replace('*', '');
        if (baseEnv === 'align' || baseEnv === 'gather' || baseEnv === 'multline') {
          tex = `\\begin{aligned}\n${tex}\n\\end{aligned}`;
        }
        nodes.push({ type: 'blockmath', tex });
        pos = endIdx !== -1 ? endIdx + endTag.length : body.length;
        break;
      }
      case 'env_itemize':
      case 'env_enumerate': {
        const listType = earliest.type === 'env_enumerate' ? 'enumerate' : 'itemize';
        const endTag = `\\end{${listType}}`;
        const endIdx = body.indexOf(endTag, afterMatch);
        const content = endIdx !== -1 ? body.slice(afterMatch, endIdx) : body.slice(afterMatch);
        const items = content.split(/\\item(?:\[[^\]]*\])?\s*/).filter(s => s.trim());
        nodes.push({
          type: 'list',
          ordered: listType === 'enumerate',
          items: items.map(item => ({
            children: parseInlineContent(item.trim(), macros),
          })),
        });
        pos = endIdx !== -1 ? endIdx + endTag.length : body.length;
        break;
      }
      case 'env_tcolorbox': {
        const endTag = '\\end{tcolorbox}';
        const endIdx = body.indexOf(endTag, afterMatch);
        const content = endIdx !== -1 ? body.slice(afterMatch, endIdx) : body.slice(afterMatch);
        // Extract title from the tcolorbox options if present
        let boxTitle = null;
        const titleMatch = earliest.match[0].match(/title=([^\],]+)/);
        if (titleMatch) boxTitle = titleMatch[1].trim();
        nodes.push({
          type: 'callout',
          title: boxTitle,
          children: parseInlineContent(content.trim(), macros),
        });
        pos = endIdx !== -1 ? endIdx + endTag.length : body.length;
        break;
      }
      case 'env_table': {
        // Find the matching \end{tabularx|tabular|longtable}
        const envMatch = earliest.match[0].match(/\\begin\{(\w+)\}/);
        const tableEnv = envMatch[1];
        const endTag = `\\end{${tableEnv}}`;
        const endIdx = body.indexOf(endTag, afterMatch);
        const content = endIdx !== -1 ? body.slice(afterMatch, endIdx) : body.slice(afterMatch);
        nodes.push({
          type: 'table',
          raw: content,
          rows: parseTable(content),
        });
        pos = endIdx !== -1 ? endIdx + endTag.length : body.length;
        break;
      }
      case 'env_center': {
        const endTag = '\\end{center}';
        const endIdx = body.indexOf(endTag, afterMatch);
        const content = endIdx !== -1 ? body.slice(afterMatch, endIdx) : body.slice(afterMatch);
        // Check if center contains a table or just content
        if (content.includes('\\begin{tabular') || content.includes('\\begin{longtable')) {
          // Parse inner table
          const innerNodes = parseBody(content, macros);
          nodes.push(...innerNodes);
        } else {
          // Treat as centered text/content
          pushTextNodes(nodes, content, macros);
        }
        pos = endIdx !== -1 ? endIdx + endTag.length : body.length;
        break;
      }
      case 'env_bibliography': {
        const endTag = '\\end{thebibliography}';
        const endIdx = body.indexOf(endTag, afterMatch);
        const content = endIdx !== -1 ? body.slice(afterMatch, endIdx) : body.slice(afterMatch);
        nodes.push({
          type: 'section',
          number: null,
          title: 'References',
        });
        const bibItems = parseBibliography(content);
        nodes.push({
          type: 'bibliography',
          items: bibItems,
        });
        pos = endIdx !== -1 ? endIdx + endTag.length : body.length;
        break;
      }
      case 'blockmath_dd': {
        const endIdx = body.indexOf('$$', afterMatch);
        let tex = endIdx !== -1 ? body.slice(afterMatch, endIdx) : body.slice(afterMatch);
        tex = expandMacros(tex.trim(), macros);
        nodes.push({ type: 'blockmath', tex });
        pos = endIdx !== -1 ? endIdx + 2 : body.length;
        break;
      }
      case 'blockmath_bracket': {
        const endIdx = body.indexOf('\\]', afterMatch);
        let tex = endIdx !== -1 ? body.slice(afterMatch, endIdx) : body.slice(afterMatch);
        tex = expandMacros(tex.trim(), macros);
        nodes.push({ type: 'blockmath', tex });
        pos = endIdx !== -1 ? endIdx + 2 : body.length;
        break;
      }
      default:
        pos = afterMatch;
    }
  }

  return nodes;
}

// ─── Table Parsing ────────────────────────────────────────────────────────────

function parseTable(content) {
  // Remove column spec like {>{\raggedright}p{0.34\textwidth}X}
  let inner = content;
  // Strip the first {...} column spec
  const firstBrace = inner.indexOf('{');
  if (firstBrace !== -1) {
    const spec = extractBalancedBraces(inner, firstBrace);
    if (spec) inner = inner.slice(spec.end);
  }

  // Remove \toprule, \midrule, \bottomrule, \hline, \renewcommand lines
  inner = inner.replace(/\\(?:toprule|midrule|bottomrule|hline|endhead|endfoot)\s*/g, '');
  inner = inner.replace(/\\renewcommand\{[^}]*\}\{[^}]*\}/g, '');
  inner = inner.replace(/\\multicolumn\{[^}]*\}\{[^}]*\}\{([^}]*)\}/g, '$1');

  // Split on \\ to get rows
  const rawRows = inner.split(/\\\\/).map(r => r.trim()).filter(r => r.length > 0);

  return rawRows.map(row => {
    // Split on & to get cells
    return row.split('&').map(cell => cleanTableCell(cell.trim()));
  });
}

function cleanTableCell(text) {
  return text
    .replace(/\\textbf\{([^}]*)\}/g, '$1')
    .replace(/\\textit\{([^}]*)\}/g, '$1')
    .replace(/\\emph\{([^}]*)\}/g, '$1')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\url\{([^}]*)\}/g, '$1')
    .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, '$1')
    .replace(/\\label\{[^}]*\}/g, '')
    .replace(/\\cite\{[^}]*\}/g, '')
    .replace(/~+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Bibliography Parsing ─────────────────────────────────────────────────────

function parseBibliography(content) {
  const items = [];
  const bibRe = /\\bibitem\{([^}]*)\}\s*/g;
  let match;
  const positions = [];

  while ((match = bibRe.exec(content)) !== null) {
    positions.push({ key: match[1], start: match.index + match[0].length });
  }

  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].start;
    const end = i + 1 < positions.length ? positions[i + 1].start - positions[i + 1].key.length - 10 : content.length;
    let text = content.slice(start, end).trim();
    // Clean up LaTeX formatting
    text = text
      .replace(/\\emph\{([^}]*)\}/g, '$1')
      .replace(/\\textbf\{([^}]*)\}/g, '$1')
      .replace(/\\textit\{([^}]*)\}/g, '$1')
      .replace(/\\url\{([^}]*)\}/g, '$1')
      .replace(/\{|\}/g, '')
      .replace(/~+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    items.push({ key: positions[i].key, text });
  }

  return items;
}

// ─── Environment Body Parsing (handles nested math blocks) ────────────────────

function parseEnvironmentBody(text, macros) {
  // Parse environment content, which can contain nested equation/align blocks
  const nodes = [];
  let remaining = text;

  // Patterns for block-level elements inside environments
  const blockPatterns = [
    { type: 'equation', re: /\\begin\{equation\*?\}/ },
    { type: 'align', re: /\\begin\{align\*?\}/ },
    { type: 'gather', re: /\\begin\{gather\*?\}/ },
    { type: 'list_itemize', re: /\\begin\{itemize\}(?:\[[^\]]*\])?/ },
    { type: 'list_enumerate', re: /\\begin\{enumerate\}(?:\[[^\]]*\])?/ },
    { type: 'blockmath_dd', re: /\$\$/ },
    { type: 'blockmath_bracket', re: /\\\[/ },
  ];

  while (remaining.length > 0) {
    let earliest = null;
    let earliestIdx = remaining.length;

    for (const pat of blockPatterns) {
      const match = remaining.match(pat.re);
      if (match && match.index < earliestIdx) {
        earliestIdx = match.index;
        earliest = { ...pat, match };
      }
    }

    if (!earliest) {
      // Rest is inline content
      const inlined = parseInlineContent(remaining, macros);
      nodes.push(...inlined);
      break;
    }

    // Text before the block
    if (earliestIdx > 0) {
      const before = remaining.slice(0, earliestIdx);
      if (before.trim()) {
        nodes.push(...parseInlineContent(before, macros));
      }
    }

    const afterMatch = earliestIdx + earliest.match[0].length;

    switch (earliest.type) {
      case 'equation':
      case 'align':
      case 'gather': {
        const envName = earliest.match[0].match(/\\begin\{(\w+\*?)\}/)[1];
        const endTag = `\\end{${envName}}`;
        const endIdx = remaining.indexOf(endTag, afterMatch);
        let tex = endIdx !== -1 ? remaining.slice(afterMatch, endIdx) : remaining.slice(afterMatch);
        tex = expandMacros(tex.trim(), macros);
        tex = tex.replace(/\\label\{[^}]*\}/g, '');
        const baseEnv = envName.replace('*', '');
        if (baseEnv === 'align' || baseEnv === 'gather' || baseEnv === 'multline') {
          tex = `\\begin{aligned}\n${tex}\n\\end{aligned}`;
        }
        nodes.push({ type: 'blockmath', tex });
        remaining = remaining.slice(endIdx !== -1 ? endIdx + endTag.length : remaining.length);
        continue;
      }
      case 'list_itemize':
      case 'list_enumerate': {
        const listType = earliest.type === 'list_enumerate' ? 'enumerate' : 'itemize';
        const endTag = `\\end{${listType}}`;
        const endIdx = remaining.indexOf(endTag, afterMatch);
        const content = endIdx !== -1 ? remaining.slice(afterMatch, endIdx) : remaining.slice(afterMatch);
        const items = content.split(/\\item(?:\[[^\]]*\])?\s*/).filter(s => s.trim());
        // Emit each item's inline content as a list-like structure
        for (const item of items) {
          nodes.push({ type: 'text', content: '  ' });
          nodes.push(...parseInlineContent(item.trim(), macros));
        }
        remaining = remaining.slice(endIdx !== -1 ? endIdx + endTag.length : remaining.length);
        continue;
      }
      case 'blockmath_dd': {
        const end = remaining.indexOf('$$', afterMatch);
        if (end === -1) {
          nodes.push(...parseInlineContent(remaining.slice(earliestIdx), macros));
          remaining = '';
          continue;
        }
        let tex = remaining.slice(afterMatch, end).trim();
        tex = expandMacros(tex, macros);
        nodes.push({ type: 'blockmath', tex });
        remaining = remaining.slice(end + 2);
        continue;
      }
      case 'blockmath_bracket': {
        const end = remaining.indexOf('\\]', afterMatch);
        if (end === -1) {
          nodes.push(...parseInlineContent(remaining.slice(earliestIdx), macros));
          remaining = '';
          continue;
        }
        let tex = remaining.slice(afterMatch, end).trim();
        tex = expandMacros(tex, macros);
        nodes.push({ type: 'blockmath', tex });
        remaining = remaining.slice(end + 2);
        continue;
      }
    }
  }

  return nodes;
}

// ─── Inline Content Parsing ───────────────────────────────────────────────────

function parseInlineContent(text, macros) {
  const nodes = [];
  let remaining = text;

  while (remaining.length > 0) {
    const ddIdx = remaining.indexOf('$$');
    const bracketIdx = remaining.indexOf('\\[');
    const dollarIdx = findInlineDollar(remaining);
    const boldIdx = remaining.indexOf('\\textbf{');
    const italicIdx = Math.min(
      remaining.indexOf('\\textit{') === -1 ? Infinity : remaining.indexOf('\\textit{'),
      remaining.indexOf('\\emph{') === -1 ? Infinity : remaining.indexOf('\\emph{')
    );
    const citeIdx = remaining.indexOf('\\cite{');
    const urlIdx = remaining.indexOf('\\url{');
    const hrefIdx = remaining.indexOf('\\href{');

    const candidates = [
      ddIdx !== -1 ? { type: 'blockmath_dd', idx: ddIdx } : null,
      bracketIdx !== -1 ? { type: 'blockmath_bracket', idx: bracketIdx } : null,
      dollarIdx !== -1 ? { type: 'inlinemath', idx: dollarIdx } : null,
      boldIdx !== -1 ? { type: 'bold', idx: boldIdx } : null,
      italicIdx !== Infinity ? { type: 'italic', idx: italicIdx } : null,
      citeIdx !== -1 ? { type: 'cite', idx: citeIdx } : null,
      urlIdx !== -1 ? { type: 'url', idx: urlIdx } : null,
      hrefIdx !== -1 ? { type: 'href', idx: hrefIdx } : null,
    ].filter(Boolean);

    if (candidates.length === 0) {
      if (remaining.trim()) nodes.push({ type: 'text', content: cleanParagraph(remaining) });
      break;
    }

    candidates.sort((a, b) => a.idx - b.idx);
    const first = candidates[0];

    if (first.idx > 0) {
      const before = remaining.slice(0, first.idx);
      if (before.trim()) nodes.push({ type: 'text', content: cleanParagraph(before) });
    }

    switch (first.type) {
      case 'blockmath_dd': {
        const end = remaining.indexOf('$$', first.idx + 2);
        if (end === -1) {
          nodes.push({ type: 'text', content: remaining.slice(first.idx) });
          remaining = '';
          continue;
        }
        let tex = remaining.slice(first.idx + 2, end).trim();
        tex = expandMacros(tex, macros);
        nodes.push({ type: 'blockmath', tex });
        remaining = remaining.slice(end + 2);
        continue;
      }
      case 'blockmath_bracket': {
        const end = remaining.indexOf('\\]', first.idx + 2);
        if (end === -1) {
          nodes.push({ type: 'text', content: remaining.slice(first.idx) });
          remaining = '';
          continue;
        }
        let tex = remaining.slice(first.idx + 2, end).trim();
        tex = expandMacros(tex, macros);
        nodes.push({ type: 'blockmath', tex });
        remaining = remaining.slice(end + 2);
        continue;
      }
      case 'inlinemath': {
        const end = remaining.indexOf('$', first.idx + 1);
        if (end === -1) {
          nodes.push({ type: 'text', content: remaining.slice(first.idx) });
          remaining = '';
          continue;
        }
        let tex = remaining.slice(first.idx + 1, end);
        tex = expandMacros(tex, macros);
        nodes.push({ type: 'inlinemath', tex });
        remaining = remaining.slice(end + 1);
        continue;
      }
      case 'bold': {
        const braceContent = extractBalancedBraces(remaining, first.idx + '\\textbf'.length);
        if (braceContent) {
          nodes.push({ type: 'bold', content: braceContent.content });
          remaining = remaining.slice(braceContent.end);
        } else {
          remaining = remaining.slice(first.idx + 1);
        }
        continue;
      }
      case 'italic': {
        const cmd = remaining.slice(first.idx).startsWith('\\emph') ? '\\emph' : '\\textit';
        const braceContent = extractBalancedBraces(remaining, first.idx + cmd.length);
        if (braceContent) {
          nodes.push({ type: 'italic', content: braceContent.content });
          remaining = remaining.slice(braceContent.end);
        } else {
          remaining = remaining.slice(first.idx + 1);
        }
        continue;
      }
      case 'cite': {
        const braceContent = extractBalancedBraces(remaining, first.idx + '\\cite'.length);
        if (braceContent) {
          nodes.push({ type: 'cite', keys: braceContent.content.split(',').map(s => s.trim()) });
          remaining = remaining.slice(braceContent.end);
        } else {
          remaining = remaining.slice(first.idx + 1);
        }
        continue;
      }
      case 'url': {
        const braceContent = extractBalancedBraces(remaining, first.idx + '\\url'.length);
        if (braceContent) {
          nodes.push({ type: 'url', url: braceContent.content });
          remaining = remaining.slice(braceContent.end);
        } else {
          remaining = remaining.slice(first.idx + 1);
        }
        continue;
      }
      case 'href': {
        const urlBrace = extractBalancedBraces(remaining, first.idx + '\\href'.length);
        if (urlBrace) {
          const textBrace = extractBalancedBraces(remaining, urlBrace.end);
          if (textBrace) {
            nodes.push({ type: 'url', url: urlBrace.content, text: textBrace.content });
            remaining = remaining.slice(textBrace.end);
          } else {
            remaining = remaining.slice(urlBrace.end);
          }
        } else {
          remaining = remaining.slice(first.idx + 1);
        }
        continue;
      }
    }
  }

  return nodes;
}

function findInlineDollar(text) {
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '$' && text[i + 1] !== '$' && (i === 0 || text[i - 1] !== '$') && (i === 0 || text[i - 1] !== '\\')) {
      return i;
    }
  }
  return -1;
}

function cleanParagraph(text) {
  return text
    .replace(/\\noindent\s*/g, '')
    .replace(/\\medskip\s*/g, '')
    .replace(/\\bigskip\s*/g, '')
    .replace(/\\smallskip\s*/g, '')
    .replace(/\\vspace\{[^}]*\}/g, '')
    .replace(/\\hspace\{[^}]*\}/g, '')
    .replace(/\\label\{[^}]*\}/g, '')
    .replace(/\\ref\{[^}]*\}/g, '(?)')
    .replace(/\\eqref\{[^}]*\}/g, '(?)')
    .replace(/\\footnote\{[^}]*\}/g, '')
    .replace(/\\cite\{[^}]*\}/g, '')
    .replace(/\\url\{([^}]*)\}/g, '$1')
    .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, '$1')
    .replace(/\\P(?:\'e|\\'{e}|olya)/g, match => match === '\\Polya' ? 'Polya' : match)
    .replace(/\\'{e}/g, 'e')  // P\'olya → Polya
    .replace(/\\`{e}/g, 'e')
    .replace(/~+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pushTextNodes(nodes, text, macros) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const cleaned = cleanParagraph(trimmed);
    if (!cleaned) continue;
    nodes.push({
      type: 'paragraph',
      children: parseInlineContent(trimmed, macros),
    });
  }
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * imp-950: independent cross-verification block.
 *
 * (1) Parser-design checks vs cited LaTeX behavior:
 *     - extractBalancedBraces matches LaTeX's brace nesting semantics
 *       (TeXbook §7): increments depth on '{', decrements on '}',
 *       returns null on mismatch. ✓ This is correct for non-escaped
 *       braces only — the implementation does NOT track \{ or \},
 *       so a literal escaped brace inside a metadata field
 *       (e.g. \title{a \{ b\} c}) will misalign depth. Documented bug,
 *       not silently fixed: search for \\\\\{ tokens in real corpora to
 *       gauge incidence.
 *     - macro-expansion regex `\\\\<name>(?![a-zA-Z])` correctly enforces
 *       the maximal-munch rule for control-word matching (Knuth, TeXbook
 *       §3): \nu must not match \new etc. ✓
 *     - parseInlineContent's findInlineDollar guards against `$$`,
 *       leading `\$`, and a previous `$` to avoid splitting a closed
 *       inline math span; matches the TeX inline-math convention. ✓
 *     - align/gather/multline are rewritten to {aligned} for KaTeX
 *       compatibility; this is a render-target choice, not a parse
 *       semantic, but the rewrite preserves row/column structure. ✓
 *     - Section numbering: appendixMode uses String.fromCharCode(64+n),
 *       i.e. A,B,C... matching LaTeX appendix counter. ✓ Resets section
 *       counter to 0 on \appendix, matching LaTeX. ✓
 *     - cleanParagraph contains a `\\P(?:\'e|\\'{e}|olya)` regex whose
 *       arrow function checks `match === '\\Polya'`; the regex pattern
 *       cannot in fact yield the literal string '\Polya' (the alternation
 *       is on `\P\'e | \P\\'{e} | \Polya`, which gives a leading `\P`
 *       only for the first two; the third requires literal `\Polya`).
 *       So the comparison is meaningful only for the third branch.
 *       This is a noted nit, not load-bearing — the very next line
 *       handles `\\'{e}` → `e` separately.
 *
 * (2) NaN/Inf / parsing-pathology edge cases:
 *     - parseLatex returns an empty {metadata, nodes} on falsy or
 *       non-string input. ✓ no crash on undefined/null.
 *     - All while-loops on `pos < body.length` and `remaining.length > 0`
 *       advance pos/remaining unconditionally in the default branch
 *       (case fall-through and the `if (!earliest) break` early exit),
 *       so no infinite loop on malformed LaTeX. ✓
 *     - Unterminated environment (\begin{X} without \end{X}): endIdx ===
 *       -1 path consumes the rest of body and sets pos = body.length,
 *       terminating cleanly. ✓
 *     - extractBalancedBraces returns null on unbalanced input; all
 *       callers null-check before using `.content` or `.end`. ✓
 *     - Macro expansion does NOT handle parameterized macros: the
 *       `(?:\[\d+\])?` in the macroRe captures the [n] arg-count but
 *       expandMacros substitutes the body verbatim, dropping any #1, #2
 *       placeholders. Documented limitation: a `\newcommand{\f}[1]{F(#1)}`
 *       with a call `\f{x}` will leave `#1` in the output rather than
 *       substituting `x`. Acceptable for ChatGPT-style preambles which
 *       rarely use parameterized macros, but a real-world bug surface.
 *
 * (3) Numerical / structural reference values:
 *     - This is a parser, not a numerical module: there are no constants
 *       to compare against known values. The closest analogue is
 *       node-count / round-trip identity. A round-trip is NOT
 *       implemented (no LaTeX serializer), so identity testing would
 *       require comparing the AST to a hand-built fixture — not done
 *       in this file.
 *     - Section/subsection counter increment is deterministic; appendix
 *       letters: A=1, B=2, ..., Z=26 via 64+counter; counter > 26 would
 *       produce '[' (charCode 91) and beyond, breaking the alphabetic
 *       convention. Acceptable since LaTeX appendices rarely exceed 26.
 *
 * Sanity envelope: parseLatex(raw) must return {metadata, nodes} for
 * any string input without throwing; node objects must always carry a
 * `type` field consumed by the rendering layer; macro substitution must
 * be idempotent on already-expanded text (no infinite recursion on
 * self-referential \newcommand). The current implementation does NOT
 * detect a self-referential macro — `\newcommand{\foo}{\foo bar}` would
 * loop only after parseLatex returns, when the rendered text is
 * re-passed; the per-call expandMacros applies each macro exactly once
 * per object key, so it terminates. ✓ within parseLatex.
 */

export function parseLatex(raw) {
  if (!raw || typeof raw !== 'string') return { metadata: { title: '', authors: [], date: '', abstract: '', macros: {} }, nodes: [] };

  const metadata = extractMetadata(raw);
  const body = stripPreamble(raw);
  const nodes = parseBody(body, metadata.macros);

  return { metadata, nodes };
}
