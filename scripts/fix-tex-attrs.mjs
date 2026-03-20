import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src');

function walkDir(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(full));
    else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

let totalFixes = 0;
let filesFixed = 0;

for (const file of walkDir(srcDir)) {
  const original = fs.readFileSync(file, 'utf8');

  // Match tex="..." that contains backslashes (LaTeX content)
  // Convert tex="content" to tex={"content"}
  // Be careful: only match tex="..." where the value contains \\
  const fixed = original.replace(/tex="([^"]*\\[^"]*)"/g, (match, content) => {
    totalFixes++;
    return `tex={"${content}"}`;
  });

  if (fixed !== original) {
    fs.writeFileSync(file, fixed);
    filesFixed++;
    const count = (fixed.match(/tex=\{"/g) || []).length - (original.match(/tex=\{"/g) || []).length;
    console.log(`Fixed ${path.relative(path.join(__dirname, '..'), file)}: ${count} conversions`);
  }
}

console.log(`\nTotal: ${totalFixes} tex attributes converted across ${filesFixed} files`);
