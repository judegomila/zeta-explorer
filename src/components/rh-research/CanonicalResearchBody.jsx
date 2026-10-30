import React from 'react';
import { BlockMath } from '../editorial/PostLayout.jsx';
import { InlineMath } from '../KaTeXMath.jsx';

const BODY_IMPORTS = import.meta.glob('../../../research/rh/modules/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const BODIES_BY_PATH = Object.freeze(Object.fromEntries(
  Object.entries(BODY_IMPORTS).map(([sourcePath, source]) => [
    `research/rh/modules/${sourcePath.split('/').pop()}`,
    source,
  ]),
));

export function getCanonicalResearchBody(bodyPath) {
  return BODIES_BY_PATH[bodyPath] || null;
}

function SourceMath({ tex, display = false }) {
  const label = `${display ? 'Display' : 'Inline'} mathematics: ${tex}`;
  if (display) {
    return (
      <figure
        className="canonical-math-source"
        data-canonical-tex={tex}
        aria-label={label}
        style={{ margin: '18px 0', overflowX: 'auto' }}
      >
        <BlockMath tex={tex} />
      </figure>
    );
  }
  return (
    <span
      className="canonical-math-source"
      data-canonical-tex={tex}
      aria-label={label}
    >
      <InlineMath tex={tex} />
    </span>
  );
}

function InlineMarkdown({ text }) {
  const source = String(text ?? '');
  const tokenPattern = /\\\(([\s\S]*?)\\\)|\$([^$\n]+?)\$|\*\*([\s\S]*?)\*\*|`([^`]+?)`|\[([^\]]+?)\]\((https?:\/\/[^)\s]+)\)|\*([^*\n]+?)\*/g;
  const parts = [];
  let cursor = 0;
  let tokenIndex = 0;
  let match;

  while ((match = tokenPattern.exec(source)) !== null) {
    if (match.index > cursor) parts.push(source.slice(cursor, match.index));
    const key = `inline-${tokenIndex++}`;
    if (match[1] !== undefined) {
      parts.push(<SourceMath key={key} tex={match[1]} />);
    } else if (match[2] !== undefined) {
      parts.push(<SourceMath key={key} tex={match[2]} />);
    } else if (match[3] !== undefined) {
      parts.push(<strong key={key}><InlineMarkdown text={match[3]} /></strong>);
    } else if (match[4] !== undefined) {
      parts.push(<code key={key}>{match[4]}</code>);
    } else if (match[7] !== undefined) {
      parts.push(<em key={key}><InlineMarkdown text={match[7]} /></em>);
    } else {
      parts.push(
        <a key={key} href={match[6]} target="_blank" rel="noreferrer">
          <InlineMarkdown text={match[5]} />
        </a>,
      );
    }
    cursor = tokenPattern.lastIndex;
  }
  if (cursor < source.length) parts.push(source.slice(cursor));
  return <>{parts}</>;
}

function isTableDivider(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function tableCells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function startsBlock(lines, index) {
  const line = lines[index] || '';
  if (!line.trim()) return true;
  if (/^\s*#{1,6}\s+/.test(line) || /^\s*(?:```|~~~)/.test(line)) return true;
  if (/^\s*(?:\\\[|\$\$)\s*$/.test(line)) return true;
  if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) return true;
  if (/^\s*>\s?/.test(line) || /^\s*---+\s*$/.test(line)) return true;
  return line.includes('|') && isTableDivider(lines[index + 1] || '');
}

function parseCanonicalMarkdown(markdown) {
  const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^\s*(```|~~~)([^\s`]*)\s*$/);
    if (fence) {
      const code = [];
      const closingFence = new RegExp(`^\\s*${fence[1]}\\s*$`);
      index += 1;
      while (index < lines.length && !closingFence.test(lines[index])) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push({ type: 'code', language: fence[2], text: code.join('\n') });
      continue;
    }

    const displayStart = line.match(/^\s*(\\\[|\$\$)\s*$/);
    if (displayStart) {
      const closing = displayStart[1] === '\\[' ? /^\s*\\\]\s*$/ : /^\s*\$\$\s*$/;
      const tex = [];
      index += 1;
      while (index < lines.length && !closing.test(lines[index])) tex.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push({ type: 'math', tex: tex.join('\n').trim() });
      continue;
    }

    const heading = line.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }

    if (line.includes('|') && isTableDivider(lines[index + 1] || '')) {
      const header = tableCells(line);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(tableCells(lines[index++]));
      }
      blocks.push({ type: 'table', header, rows });
      continue;
    }

    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const orderedList = Boolean(ordered);
      const pattern = orderedList ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/;
      const items = [];
      while (index < lines.length) {
        const item = lines[index].match(pattern);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ type: 'list', ordered: orderedList, items });
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quote.push(lines[index++].replace(/^\s*>\s?/, ''));
      }
      blocks.push({ type: 'quote', text: quote.join(' ') });
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) {
      blocks.push({ type: 'rule' });
      index += 1;
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && !startsBlock(lines, index)) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
  }
  return blocks;
}

function headingId(text) {
  const slug = String(text)
    .replace(/\\\((.*?)\\\)|\$(.*?)\$/g, '$1$2')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `canonical-${slug || 'section'}`;
}

function CanonicalBlock({ block, index }) {
  if (block.type === 'math') return <SourceMath tex={block.tex} display />;
  if (block.type === 'paragraph') return <p><InlineMarkdown text={block.text} /></p>;
  if (block.type === 'quote') return <blockquote><InlineMarkdown text={block.text} /></blockquote>;
  if (block.type === 'rule') return <hr />;
  if (block.type === 'code') return <pre data-language={block.language || undefined}><code>{block.text}</code></pre>;
  if (block.type === 'list') {
    const List = block.ordered ? 'ol' : 'ul';
    return (
      <List style={{ paddingLeft: 22, lineHeight: 1.65 }}>
        {block.items.map((item, itemIndex) => <li key={itemIndex}><InlineMarkdown text={item} /></li>)}
      </List>
    );
  }
  if (block.type === 'table') {
    return (
      <div style={{ overflowX: 'auto', margin: '18px 0' }}>
        <table className="canonical-research-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{block.header.map((cell, cellIndex) => (
            <th key={cellIndex} scope="col" style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid var(--hairline)' }}>
              <InlineMarkdown text={cell} />
            </th>
          ))}</tr></thead>
          <tbody>{block.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{block.header.map((_, cellIndex) => (
              <td key={cellIndex} style={{ padding: '8px 10px', borderBottom: '1px solid var(--hairline)', verticalAlign: 'top' }}>
                <InlineMarkdown text={row[cellIndex] || ''} />
              </td>
            ))}</tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  if (block.type === 'heading') {
    const Heading = `h${Math.min(6, block.level + 2)}`;
    return <Heading id={headingId(block.text)}><InlineMarkdown text={block.text} /></Heading>;
  }
  return null;
}

export function CanonicalMarkdownDocument({ source }) {
  const blocks = parseCanonicalMarkdown(source);
  return (
    <div className="canonical-research-body">
      {blocks.map((block, index) => <CanonicalBlock key={index} block={block} index={index} />)}
    </div>
  );
}

export default function CanonicalResearchBody({ bodyPath }) {
  const source = getCanonicalResearchBody(bodyPath);
  if (!source) return null;

  return (
    <section
      aria-labelledby="canonical-research-note"
      data-canonical-body-path={bodyPath}
      data-canonical-source-bytes={new TextEncoder().encode(source).length}
    >
      <h2 id="canonical-research-note">Canonical mathematical note</h2>
      <p style={{ color: 'var(--ink-soft)' }}>
        Rendered from the checksum-pinned canonical source at <code>{bodyPath}</code>. The structured overview above is a guide; this complete note is the mathematical source of truth.
      </p>
      <CanonicalMarkdownDocument source={source} />
    </section>
  );
}
