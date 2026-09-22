// imp-95209/imp-95226: assemble final audit numbers from the sharded run.
// Reads /tmp/imp-95209-shards/{wlog,rec-*-topk.json,audit-*.txt} + the
// frontier main pass, prints one JSON blob with everything the frozen
// module needs.
import fs from "node:fs";

const DIR = "/tmp/imp-95209-shards";
const NSHARD = 24;

// --- aggregate worker cover results (+ frontier main pass) ---
const MAIN = { cells: 4366, worst: 0.9999951864449839, maxDepth: 25, unresolved: 0, pruned: 1729 };
let cells = MAIN.cells, pruned = MAIN.pruned, unresolved = MAIN.unresolved;
let worst = MAIN.worst, maxDepth = MAIN.maxDepth;
let recCount = 0;
const histo = new Array(16).fill(0);
let topK = [];
for (let s = 0; s < NSHARD; s++) {
  const log = fs.readFileSync(`${DIR}/wlog-${s}.json`, "utf8").trim().split("\n");
  const j = JSON.parse(log[log.length - 1]);
  cells += j.cells; pruned += j.pruned; unresolved += j.unresolved;
  if (j.worst > worst) worst = j.worst;
  if (j.maxDepth > maxDepth) maxDepth = j.maxDepth;
  const tk = JSON.parse(fs.readFileSync(`${DIR}/rec-${s}-topk.json`, "utf8"));
  recCount += tk.recCount;
  tk.histoDecades.forEach((v, i) => (histo[i] += v));
  topK.push(...tk.topK);
}
try {
  const tk = JSON.parse(fs.readFileSync("/tmp/imp-95209-worst-rec-main-topk.json", "utf8"));
  recCount += tk.recCount;
  tk.histoDecades.forEach((v, i) => (histo[i] += v));
  topK.push(...tk.topK);
} catch (e) { /* main pass recorded nothing */ }
topK.sort((a, b) => b.bound - a.bound);
topK = topK.slice(0, 64);

const BAKED = { cells: 871931041, worst: 0.9999999999983423, maxDepth: 81, unresolved: 0, pruned: 2150982 };
const bitIdentity =
  cells === BAKED.cells && worst === BAKED.worst && maxDepth === BAKED.maxDepth &&
  unresolved === BAKED.unresolved && pruned === BAKED.pruned;

// N(margin <= 1e-10) from decade histogram: bins 9..15 are margins < 1e-9;
// bin i counts margin in [1e-(i+1), 1e-i) - so <=1e-10 is bins >= 10 (plus
// boundary cases; report bins for transparency).
const nLe1e10 = histo.slice(10).reduce((a, b) => a + b, 0);

// --- audit outputs ---
let auditN = 0, nDirect = 0, nRepol = 0, nSplit = 0, nUnres = 0, totAmbig = 0;
let worstDirectMarginLo = 1e9;
let maxDiff = 0, maxDiffLine = "";
let maxSplits = 0;
let worstCertMargin = 1e9; // min over cells of certified margin lower bound AFTER repair
const repolished = [];
const auditByBound = new Map(); // floatBound(string17) -> audit info for topK matching
for (let s = 0; s < NSHARD; s++) {
  const txt = fs.readFileSync(`${DIR}/audit-${s}.txt`, "utf8").trim().split("\n");
  for (const line of txt) {
    if (line.startsWith("SUMMARY")) {
      // SUMMARY cells N certified C unresolved U worstDirectMarginLo X totAmbig A prec P
      const m = line.match(/SUMMARY cells (\d+) certified (\d+) unresolved (\d+) worstDirectMarginLo ([-\d.e+]+) totAmbig (\d+)/);
      auditN += +m[1];
      nUnres += +m[3];
      if (+m[4] < worstDirectMarginLo) worstDirectMarginLo = +m[4];
      totAmbig += +m[5];
      continue;
    }
    if (!line.startsWith("cell ")) continue;
    const fb = line.match(/floatBound ([\d.e+-]+)/)?.[1];
    const diff = Math.abs(+(line.match(/diff ([-\d.e+]+)/)?.[1] ?? 0));
    if (diff > maxDiff) { maxDiff = diff; maxDiffLine = line; }
    if (line.includes("CERTIFIED-REPOLISH")) {
      const ub = +(line.match(/ub ([\d.e+-]+)/)?.[1]);
      repolished.push({ line, ub });
      if (1 - ub < worstCertMargin) worstCertMargin = 1 - ub;
    } else if (line.includes("CERTIFIED-SPLIT")) {
      const sc = +(line.match(/subcells (\d+)/)?.[1]);
      if (sc > maxSplits) maxSplits = sc;
    } else if (line.includes("CERTIFIED-DIRECT")) {
      const ml = +(line.match(/marginLo ([-\d.e+]+)/)?.[1]);
      if (ml < worstCertMargin) worstCertMargin = ml;
    }
    if (fb) auditByBound.set(fb, line);
  }
}
// counts by verdict need full grep (direct lines only printed when marginLo<1e-7)
for (let s = 0; s < NSHARD; s++) {
  const txt = fs.readFileSync(`${DIR}/audit-${s}.txt`, "utf8");
  nRepol += (txt.match(/CERTIFIED-REPOLISH/g) || []).length;
  nSplit += (txt.match(/CERTIFIED-SPLIT/g) || []).length;
}
nDirect = auditN - nRepol - nSplit - nUnres;

// production worst leaf audit line
const worstLeafLine = auditByBound.get("9.99999999998342334e-01") ??
  [...auditByBound.entries()].find(([k]) => Math.abs(+k - BAKED.worst) < 1e-15)?.[1] ?? "NOT-FOUND";

console.log(JSON.stringify({
  aggregate: { cells, worst, maxDepth, unresolved, pruned },
  bitIdentity,
  recCount, nLe1e10, histoDecades: histo,
  audit: { auditN, nDirect, nRepol, nSplit, nUnres, totAmbig, worstDirectMarginLo, worstCertMargin, maxDiff, maxSplits },
  maxDiffLine,
  worstLeafLine,
  repolishedSample: repolished.slice(0, 4).map((r) => r.line),
  topK8: topK.slice(0, 8),
}, null, 1));
