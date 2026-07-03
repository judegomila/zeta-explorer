import { KERNEL_HACK_AT_IMP360 } from './kernel-hack-at-imp360.js';
import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';
const r = KERNEL_HACK_AT_IMP360.rows.find(x=>x.N===870);
console.log("KH870", JSON.stringify(r));
console.log("RK4FIT", JSON.stringify(PATH_C_BASELINE_FIT_V2.fit));
