import { createServer } from 'vite';
const s = await createServer({ server:{middlewareMode:true, hmr:false}, appType:'custom', logLevel:'silent' });
try {
  const V2 = (await s.ssrLoadModule('/src/data/barrier-extrapolation-v2.js')).BARRIER_EXTRAPOLATION_V2;
  console.log('BARRIER_OLS', JSON.stringify(V2.barrierOls));
  console.log('RK4REF', JSON.stringify(V2.rk4OlsReference || null));
  const m = await s.ssrLoadModule('/src/data/barrier-extrapolation-imp371.js');
  const rec = m.BARRIER_EXTRAPOLATION_IMP371;
  console.log('RK4OLSREF', JSON.stringify(rec.rk4OlsReference));
  console.log('VERDICT', rec.lambdaConvergenceVerdict);
  for (const r of rec.comparisonTable) console.log('ROW', r.N, r.barrier_tc_proj, r.t_c_lo, r.t_c_hi, r.agree);
  const eb = (await s.ssrLoadModule('/src/data/lambda-error-budget.js')).LAMBDA_ERROR_BUDGET;
  console.log('PATHC', eb.centralValue, eb.reportedError);
} finally { await s.close(); }
console.log('__DONE__');
