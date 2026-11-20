# zero-side form for the heat controls with a larger basis (no coefficient side needed); onset brackets.
import sys, json, math, numpy as np
import zeroside as zs
out = {}
for code, N, AG in (('HEAT--0.5', 300, np.arange(0.9, 1.61, 0.05)), ('HEAT--0.1', 700, np.arange(1.6, 3.61, 0.1)), ('ZETA', 700, np.array([2.0, 3.0, 3.6]))):
    on, off = zs.zeros(code); rows = []
    for a in AG:
        lz = [float(np.linalg.eigvalsh(zs.zform(on, off, float(a), N, par))[0]) for par in (0, 1)]
        rows.append(dict(a=float(a), X=math.exp(2*a), lam_zero=lz, N=N)); print(code, 'N=%d a=%.2f X=%.1f lam (% .4e, % .4e)' % (N, a, math.exp(2*a), lz[0], lz[1]), flush=True)
    out[code] = rows
json.dump(out, open(sys.argv[1], 'w'), indent=1)
