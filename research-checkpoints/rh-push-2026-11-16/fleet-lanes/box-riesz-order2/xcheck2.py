#!/usr/bin/env python3
"""xcheck2.py: independent certificate with the argument-principle routine of box-ly-search (imported read-only):
number of zeros of its object (afep, zeta, riesz2, N) in the z-rectangle [T - 0.01, T + 0.01] x [0.03, 0.06], z = (s - 1/2)/i."""
import sys, json, time
sys.path.insert(0, '../box-ly-search')
from flint import ctx
import cert as LC
N = int(sys.argv[1]); T = 855204807584.9554
ctx.prec = 400
F = LC.make(dict(scheme='afep', input='zeta', size=N, weight='riesz2'), xmid=T)
t0 = time.time()
cnt, boxes = LC.rect_count(F, T - 0.01, T + 0.01, 0.03, 0.06, 200000)
print(json.dumps(dict(N=N, rectangle=[T - 0.01, T + 0.01, 0.03, 0.06], certified_zero_count=cnt, boxes=boxes, seconds=round(time.time() - t0, 1))))
