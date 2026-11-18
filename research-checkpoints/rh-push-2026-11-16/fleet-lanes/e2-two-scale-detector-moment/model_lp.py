"""model_lp.py -- MODEL value of the LP abscissa when the class-restricted fourth moment is U^{1-omega}
(K = max(R, (3R+1-omega)/4)); float LP of ../bypass-78/scalar_system.py, optimistic conventions, gates not imposed.
Not a bound."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "bypass-78"))
import numpy as np
import scalar_system
from scalar_system import solve, bisect, count_R
LEN = [(np.array([-1.0, 0.0, 1.0]), 0.0), (np.array([0.0, -1.0, 1.0]), 0.0)]
def run(om):
    Rf = lambda d, x, k: (4.0 * max(count_R(d, x, k), (3 * count_R(d, x, k) + 1 - om) / 4) - 1.0) / 3.0
    f = lambda B: solve(B, ["av_max"], "A", Rfun=Rf, extra_rows=LEN, nd=97, nx=33)
    Bs = bisect(f, 0.70, 0.95, it=45)
    print(f"omega = {om:.4f}   B_model = {Bs:.7f}", flush=True)
for om in (0.0, 0.0171, 0.025, 0.1197, 0.2, 0.30, 0.36, 0.43):
    run(om)
