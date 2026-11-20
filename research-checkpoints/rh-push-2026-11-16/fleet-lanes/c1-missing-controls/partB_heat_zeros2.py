"""Part B, step 1b: tau = -0.1 on the gap window t in [230,405] (to decide whether 415.256 is the lowest off-line zero). MEASURED."""
import json, time
from partB_heat_zeros import scan, offline, zz   # importing reruns nothing: guarded below
from heatlib import *
t0 = time.time(); H = Heat(760, 410.0); out = {}
for tau, a, b in [(-0.1, 230.0, 405.0)]:
    sc = scan(H, tau, a, b, 0.01); off = offline(H, tau, a, b); nz = sum(1 for g in zz if a < g < b)
    rec = dict(tau=tau, window=[a, b], sign_changes=len(sc), zeta_zeros_in_window=nz,
               offline_upper_right=[dict(delta=f[2], gamma=f[3], parent_pair=f[4]) for f in off], total_count=len(sc) + 2 * len(off))
    out['mid_%g_%g' % (tau, a)] = rec; print(json.dumps(rec), 'elapsed', round(time.time() - t0), flush=True)
json.dump(out, open('partB_heat_zeros2.json', 'w'), indent=1)
