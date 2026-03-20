import katex from 'katex';
import { getAllExplorations } from '../src/data/explorations.js';
import { getAllCriticisms } from '../src/data/criticisms.js';

let totalErrors = 0;

function checkInlineAndDisplay(text, label) {
  if (!text) return;
  const regex = /\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const tex = m[1] || m[2];
    const isDisplay = !!m[1];
    try {
      katex.renderToString(tex, { throwOnError: true, displayMode: isDisplay });
    } catch (e) {
      totalErrors++;
      console.log(`${label}: ${e.message.substring(0, 120)}`);
      console.log(`  TEX: ${tex.substring(0, 100)}`);
    }
  }
}

function checkTex(tex, label) {
  try {
    katex.renderToString(tex, { throwOnError: true, displayMode: true });
  } catch (e) {
    totalErrors++;
    console.log(`${label}: ${e.message.substring(0, 120)}`);
    console.log(`  TEX: ${tex.substring(0, 100)}`);
  }
}

// Check explorations
const explorations = getAllExplorations();
for (const exp of explorations) {
  checkInlineAndDisplay(exp.content, `exp:${exp.id} content`);
  (exp.insights || []).forEach((ins, i) => checkInlineAndDisplay(ins, `exp:${exp.id} insight[${i}]`));
  (exp.latex || []).forEach((tex, i) => checkTex(tex, `exp:${exp.id} latex[${i}]`));
  (exp.mathContent || []).forEach((tex, i) => checkTex(tex, `exp:${exp.id} mathContent[${i}]`));
}

// Check criticisms
const criticisms = getAllCriticisms();
for (const crit of criticisms) {
  checkInlineAndDisplay(crit.issue, `crit:${crit.id} issue`);
  checkInlineAndDisplay(crit.response, `crit:${crit.id} response`);
  checkInlineAndDisplay(crit.originalClaim, `crit:${crit.id} originalClaim`);
  (crit.latex || []).forEach((tex, i) => checkTex(tex, `crit:${crit.id} latex[${i}]`));
}

console.log(`\nTotal data KaTeX errors: ${totalErrors}`);
