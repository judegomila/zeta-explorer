"""tau = 0 validation of the high-precision quadrature on the two high windows: sign changes must equal the zeta zero count."""
import json, time
from partB_heat_zeros import scan, zz
from heatlib import *
t0 = time.time(); H = Heat(1000, 600.0); out = {}
for a, b in [(405.0, 425.0), (532.0, 572.0)]:
    sc = scan(H, 0.0, a, b, 0.01); nz = sum(1 for g in zz if a < g < b)
    out['high_0_%g' % a] = dict(tau=0.0, window=[a, b], sign_changes=len(sc), zeta_zeros_in_window=nz)
    print(json.dumps(out['high_0_%g' % a]), 'elapsed', round(time.time() - t0), flush=True)
json.dump(out, open('partB_heat_zeros3.json', 'w'), indent=1)
