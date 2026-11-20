"""first height at which a pair of consecutive zeta ordinates has raw gap g with g^2/2 < eps (leading-order collision time of the pair
   under the backward heat flow in the battery normalisation: d(g^2)/d tau = 2 for an isolated pair, d gamma/d tau = V/2)."""
import sys, json, numpy as np
g = np.load(sys.argv[1], mmap_mode='r'); out = []
d = np.diff(np.asarray(g))
for eps in [float(x) for x in sys.argv[3:]]:
    idx = np.nonzero(d * d / 2 < eps)[0]
    out.append(dict(eps=eps, gap_threshold=(2 * eps) ** 0.5, first_height=float(g[idx[0]]) if len(idx) else None, zeros_below=int(idx[0]) if len(idx) else None, gap=float(d[idx[0]]) if len(idx) else None, list_top=float(g[-1])))
    print(out[-1], flush=True)
json.dump(out, open(sys.argv[2], 'w'), indent=0)
