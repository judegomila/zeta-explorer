import { CROSS_ESTIMATOR_AGREEMENT_IMP2884 } from './cross-estimator-agreement-imp2884.js';
import { KERNEL_HACK_AT_IMP360 } from './kernel-hack-at-imp360.js';
const a = CROSS_ESTIMATOR_AGREEMENT_IMP2884;
console.log(JSON.stringify({
  estimators: a.estimators,
  pairwise: a.pairwise,
  summary: a.summary,
  kernelHack870: KERNEL_HACK_AT_IMP360.rows.find(r=>r.N===870),
}, null, 2));
