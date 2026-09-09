/**
 * imp-95171 offline runner: executes the FULL 10-D triple merge-consistent
 * cover (THEOREM MC3) through the module's OWN exported code path.
 *
 * The data module src/data/imp-95171-triple-merge-consistent-cover.js throws
 * at import until its RUN block carries the recorded offline literals (the
 * THEOREM MC3 in-sweep re-certification demands them), so this runner strips
 * exactly two trailing verification sections from the module source -- the
 * THEOREM MC3 recert block and the final assertion-execution loop -- and
 * imports the transformed copy. Everything the cover executes (g, mcH3,
 * simplexMin, eqSolve, IMP95171_RUN_FULL_COVER) is byte-identical to the
 * shipped module, so the recorded literals ARE the shipped code path's
 * output; batteries (A3)-(E3) still run at import as a precondition.
 *
 * Usage: node scripts/imp-95171-triple-cover-offline.mjs [budgetMs]
 */
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const modPath = join(here, "..", "src", "data", "imp-95171-triple-merge-consistent-cover.js");
const src = readFileSync(modPath, "utf8");

const recertStart = src.indexOf("{\n  // the six geometric mu-layers");
const recertEnd = src.indexOf("// the full 10-D cover, exported for OFFLINE");
const loopStart = src.indexOf("for (const a of IMP95171_TRIPLE_MERGE_CONSISTENT_COVER_ASSERTIONS)");
if (recertStart < 0 || recertEnd < 0 || loopStart < 0 || !(recertStart < recertEnd && recertEnd < loopStart)) {
  throw new Error("module source markers not found -- refusing to run on a drifted module");
}
const stripped =
  src.slice(0, recertStart) +
  "// [offline runner] THEOREM MC3 recert block stripped (RUN literals not yet recorded)\n" +
  src.slice(src.lastIndexOf("// ----", recertEnd), loopStart) +
  "// [offline runner] assertion-execution loop stripped\n";

const tmpPath = join(here, ".imp-95171-cover-tmp.mjs");
writeFileSync(tmpPath, stripped);

try {
  const t0 = Date.now();
  console.log("== importing module (batteries A3-E3 run at import) ==");
  const mod = await import(pathToFileURL(tmpPath).href);
  console.log(`batteries green in ${((Date.now() - t0) / 1000).toFixed(1)} s`);

  const budgetMs = Number(process.argv[2] || 3600000);
  console.log(`== full 10-D cover (budget ${budgetMs} ms) ==`);
  const t1 = Date.now();
  const res = mod.IMP95171_RUN_FULL_COVER(budgetMs);
  const elapsedMs = Date.now() - t1;
  for (const L of res.layers) {
    console.log(JSON.stringify({
      lo: L.lo, hi: L.hi, done: L.done, cells: L.cells, leaves: L.leaves,
      depth: L.maxDepthSeen, worst: L.worstCert, stuck: L.stuck || false,
      // binding cell printed for DONE layers even on a partial run, so a
      // budget-truncated attempt still yields in-sweep recert anchors
      worstCell: L.done ? L.worstCell : null,
    }));
  }
  if (!res.allDone) {
    console.log(JSON.stringify({ allDone: false, elapsedMs }));
    console.log("COVER DID NOT TERMINATE within budget -- record an HONEST PARTIAL, do not fill RUN");
    process.exitCode = 2;
  } else {
    const RUN = {
      totalCells: res.layers.reduce((s, l) => s + l.cells, 0),
      totalLeaves: res.layers.reduce((s, l) => s + l.leaves, 0),
      maxDepth: Math.max(...res.layers.map((l) => l.maxDepthSeen)),
      worstCert: Math.min(...res.layers.map((l) => l.worstCert)),
      elapsedMs,
      layers: res.layers.map((l) => ({
        lo: l.lo, hi: l.hi, cells: l.cells, leaves: l.leaves,
        depth: l.maxDepthSeen, worst: l.worstCert, worstCell: l.worstCell,
      })),
    };
    console.log("== RUN literals (paste into the module) ==");
    console.log(JSON.stringify(RUN, (k, v) => v, 2));
  }
} finally {
  unlinkSync(tmpPath);
}
