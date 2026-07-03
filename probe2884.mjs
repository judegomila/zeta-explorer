import { HEAT_FLOW_CROSS_VALIDATION_IMP372 } from './src/data/heat-flow-cross-validation-imp372.js';
import { BARRIER_EXTRAPOLATION_V2 } from './src/data/barrier-extrapolation-v2.js';
import { PATH_C_BASELINE_FIT_V2 } from './src/data/path-c-baseline-fit-v2.js';
import { writeFileSync } from 'node:fs';
const hf = HEAT_FLOW_CROSS_VALIDATION_IMP372.hfOls;
const ba = BARRIER_EXTRAPOLATION_V2.barrierOls;
const rk = PATH_C_BASELINE_FIT_V2.fit;
const A_HF = hf.intercept_a_normalized, SE_HF = hf.seA;
const A_BAR = ba.intercept_a, SE_BAR = ba.seA;
const A_RK4 = rk.intercept_a, SE_RK4 = rk.seA;
const seHB = Math.sqrt(SE_HF*SE_HF + SE_BAR*SE_BAR);
const out = {
  A_HF, SE_HF, A_BAR, SE_BAR, A_RK4, SE_RK4,
  pair_barrier_rk4: { delta: Math.abs(A_BAR-A_RK4), band: 2*SE_RK4, agree: Math.abs(A_BAR-A_RK4) <= 2*SE_RK4 },
  pair_hf_rk4: { agree: A_HF>0 && A_HF <= A_RK4 + 2*SE_HF, lhs: A_HF, rhs: A_RK4 + 2*SE_HF },
  pair_hf_bar: { agree: A_HF>0 && A_HF <= A_BAR + 2*seHB, lhs: A_HF, rhs: A_BAR + 2*seHB },
};
writeFileSync('probe2884.out.json', JSON.stringify(out, null, 2));
