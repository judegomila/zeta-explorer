import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src');

// Control chars that indicate a JS escape sequence ate a backslash
const CONTROL_CHARS = ['\t', '\f', '\n', '\b', '\r', '\v', '\0'];
const CONTROL_NAMES = ['\\t(tab)', '\\f(ff)', '\\n(nl)', '\\b(bs)', '\\r(cr)', '\\v(vt)', '\\0(null)'];

function findBrokenMath(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const lines = src.split('\n');
  const results = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for $ delimited math in JS strings (template literals, regular strings)
    // Look for control chars adjacent to what looks like broken LaTeX
    for (let ci = 0; ci < CONTROL_CHARS.length; ci++) {
      const ch = CONTROL_CHARS[ci];
      let pos = line.indexOf(ch);
      while (pos !== -1) {
        // Get surrounding context
        const before = line.substring(Math.max(0, pos - 20), pos);
        const after = line.substring(pos + 1, Math.min(line.length, pos + 20));

        // Check if this looks like it's inside math content (near $ or tex=)
        const context = line.substring(Math.max(0, pos - 50), Math.min(line.length, pos + 50));
        if (context.includes('$') || context.includes('tex') || context.includes('latex') || context.includes('Math')) {
          results.push({
            line: i + 1,
            char: CONTROL_NAMES[ci],
            before,
            after: after.substring(0, 15),
          });
        }
        pos = line.indexOf(ch, pos + 1);
      }
    }
  }

  return results;
}

function walkDir(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(full));
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walkDir(srcDir);
let totalBroken = 0;

for (const file of allFiles) {
  const results = findBrokenMath(file);
  if (results.length > 0) {
    const rel = path.relative(path.join(__dirname, '..'), file);
    console.log(`\n=== ${rel} (${results.length} issues) ===`);
    for (const r of results) {
      console.log(`  L${r.line}: ${r.char} | ...${JSON.stringify(r.before)}[HERE]${JSON.stringify(r.after)}...`);
      totalBroken++;
    }
  }
}

console.log(`\nTotal broken math expressions: ${totalBroken}`);
