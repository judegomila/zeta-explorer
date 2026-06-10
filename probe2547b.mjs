import { createServer } from 'vite';
const server = await createServer({ server:{ middlewareMode:true }, logLevel:'silent', appType:'custom' });
try {
  const m = await server.ssrLoadModule('/src/data/heat-flow-pathc-ladder-imp2547.js');
  const rec = m.HEAT_FLOW_PATHC_LADDER_IMP2547;
  console.log('LOADED OK (top-level guard passed)');
  console.log('intercept:', JSON.stringify(rec.intercept));
  console.log('summary:', JSON.stringify(rec.summary));
  for (const r of rec.comparisonTable) console.log('  ', JSON.stringify(r));
  let allPass = true;
  for (const a of m.IMP2547_PATHC_LADDER_ASSERTIONS) { const ok = a.holds(); if(!ok) allPass=false; console.log('ASSERT', a.id, ok?'PASS':'FAIL'); }
  console.log('ALL_PASS', allPass);
} finally { await server.close(); }
