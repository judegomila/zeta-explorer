import { createServer } from 'vite';
const server = await createServer({ server:{ middlewareMode:true }, logLevel:'silent', appType:'custom' });
try {
  const hf = (await server.ssrLoadModule('/src/data/heat-flow-cross-validation-imp372.js')).HEAT_FLOW_CROSS_VALIDATION_IMP372;
  const pc = (await server.ssrLoadModule('/src/data/path-c-baseline-fit-v2.js')).PATH_C_BASELINE_FIT_V2;
  const a = pc.fit.intercept_a, b = pc.fit.slope_b, seA = pc.fit.seA;
  console.log('PathC V2 fit: a=',a,' b=',b,' seA=',seA);
  console.log('HF OLS: ', JSON.stringify(hf.hfOls));
  console.log('HF table (N, tc_dyson_initial):');
  for (const r of hf.hfTable) {
    const pred = a + b / r.N;
    console.log(`  N=${r.N}  tc_hf_dyson=${r.tc_dyson_initial}  pathC_pred(a+b/N)=${pred.toFixed(7)}  ratio=${(r.tc_dyson_initial/pred).toFixed(4)}`);
  }
  console.log('verdict:', hf.lambdaConvergenceVerdict);
} finally { await server.close(); }
