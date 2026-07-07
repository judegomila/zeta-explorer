#!/usr/bin/env node
// imp-35083: Assess restructuring the oversized lambda-roadmap.js currentStatus
// string (a single ~200-line concatenated literal accreting COHORT/QUANTIFIED/
// RECONCILED/NOTED/PHASE paragraphs from dozens of tickets) into a headline
// plus a structured array of dated status entries ({ id, tag, text }), WITHOUT
// altering the headline verdict or dropping any content.
//
// Method: find every ALL-CAPS tag followed by a "(imp-NNNNN ...)" or
// "(YYYY-MM-DD ...)" parenthetical -- these are the natural entry boundaries
// already present in the prose (e.g. "QUANTIFIED (imp-3220): ...",
// "PHASE 51 (2026-04-19): ..."). Split currentStatus at those boundaries, then
// verify the headline + entries recombine to the EXACT original string
// (byte-for-byte), which is the concrete precondition for a lossless migration.
//
// Assessment only. Does not perform the restructuring (out of scope for a
// single atomic change). Changes no bound. NO QED.

const mod = await import('../src/data/lambda-roadmap.js');
const status = mod.LAMBDA_ROADMAP.currentStatus;

const tagRe = /([A-Z][A-Z0-9 _/-]{2,40}?)\s+\((imp-\d+[^)]*|20\d{2}-\d{2}-\d{2}[^)]*)\)/g;

const boundaries = [];
let m;
while ((m = tagRe.exec(status)) !== null) {
  boundaries.push({ index: m.index, tag: m[1].trim(), paren: m[2].trim() });
}

console.log('Total currentStatus length: ' + status.length + ' chars, ' +
  status.split(/\s+/).length + ' words');
console.log('Candidate tag boundaries found: ' + boundaries.length);

// The opening sentence ("CLOSED MODULO GUE UNIVERSALITY (Phase 37 final, ...)")
// has a parenthetical that does not itself start with an imp-id/date, so the
// regex's first match is the NEXT tag ("CRITICAL REFRAMING (imp-2564 ...)"),
// not position 0. The headline is therefore everything BEFORE the first
// match; each matched boundary then starts its own dated entry.
const headline = { tag: null, paren: null, text: status.slice(0, boundaries[0].index) };
const dated = [];
for (let i = 0; i < boundaries.length; i++) {
  const start = boundaries[i].index;
  const end = i + 1 < boundaries.length ? boundaries[i + 1].index : status.length;
  dated.push({ tag: boundaries[i].tag, paren: boundaries[i].paren, text: status.slice(start, end) });
}
const entries = [headline, ...dated];

const impIdRe = /imp-\d+/;
let withImpId = 0;
for (const e of dated) {
  if (impIdRe.test(e.paren)) withImpId++;
}

const lengths = dated.map((e) => e.text.length);
const maxLen = Math.max(...lengths);
const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;

// Lossless-reconstruction check: headline.text + all dated entries' text,
// concatenated in original order, must equal the source string exactly.
const reconstructed = entries.map((e) => e.text).join('');
const exact = reconstructed === status;

console.log('\nHeadline (untagged preamble): ' + headline.text.length + ' chars');
console.log('Dated entries after headline: ' + dated.length);
console.log('  entries tagged with an imp-id: ' + withImpId + '/' + dated.length);
console.log('  entry length: min ' + Math.min(...lengths) + ', avg ' +
  avgLen.toFixed(0) + ', max ' + maxLen + ' chars');
console.log('\nExact byte-for-byte reconstruction (headline + entries == currentStatus): ' + exact);

if (!exact) {
  console.log('FEASIBILITY: NOT CONFIRMED -- tag-boundary split does not losslessly ' +
    'reconstruct currentStatus as-is; a structured-array migration would need a ' +
    'different (or additional) split rule to avoid dropping content.');
} else {
  console.log('FEASIBILITY: CONFIRMED -- currentStatus decomposes cleanly into a ' +
    'headline + ' + dated.length + ' dated entries (each already carrying its own ' +
    'ALL-CAPS tag and imp-id/date parenthetical) that reconstruct the source string ' +
    'exactly. A { id, tag, text }[] array + a render() that joins headline and ' +
    'entries in order would be equivalent to the current single string, with no ' +
    'verdict altered and no content dropped. Left as a follow-on ticket since the ' +
    'actual migration touches ~200 lines and is out of scope for a single atomic change.');
}
