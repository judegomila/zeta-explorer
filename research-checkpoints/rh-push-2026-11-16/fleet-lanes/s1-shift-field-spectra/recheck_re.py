"""ball recheck (128 bits) of the sign of Re F at the first grid points with Re F < 0, and of W at spot points."""
import json
from flint import acb, arb, ctx, acb_series
import recheck_lib as R
ctx.prec = 128
out = []
for o, sg, t in [('ZETA', '0.55', 29.86), ('ZETA', '0.55', 29.85), ('ZETA', '0.6', 43.58), ('ZETA', '1', 1267065.14), ('ZETA', '0.9', 1379.38), ('LCHI', '0.55', 12.03)]:
    s = acb(arb(sg), arb(t))
    v = s.zeta() if o == 'ZETA' else R.hur(s, (arb(1), arb(-1), arb(-1), arb(1)))
    sign = 'negative' if v.real < 0 else ('positive' if v.real > 0 else 'undetermined')
    out.append(dict(obj=o, sigma=sg, t=t, re=str(v.real), sign=sign)); print(out[-1])
# spot check of W > 0 for zeta at the grid minimum locations is implied by the verified height; three spot points at 1e9:
for sg, t in [('0.51', 1000000123.45), ('0.55', 1000250000.05), ('0.7', 1000499999.95)]:
    x = acb_series([acb(arb(sg), arb(t)), 1], prec=2); y = R.completed('ZETA', x); w = (y[1] / y[0]).real
    out.append(dict(obj='ZETA', sigma=sg, t=t, re_logder=str(w), sign='positive' if w > 0 else 'not positive')); print(out[-1])
json.dump(out, open('recheck_re.json', 'w'), indent=1)
