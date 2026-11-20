"""genjobs9.py [fam,fam,...] : job lines "q d N lam weights..." for ffw enw, cheapest first. Companion runs (N = 0) for the N = 3 families."""
import sys
from plan import *
sel = sys.argv[1].split(',') if len(sys.argv) > 1 else list(FAM)
jobs = []
for f in sel:
    q, N, d, lams = FAM[f]; W = weights(q)
    ws = ' '.join(f'{w[0]} {w[1]} {w[2]} {w[3]} 0' for w in W.values())
    for lam in lams:
        cost = q**(N + lam + d) / lam * (1 if N < 3 else 2)
        jobs.append((cost, f'{q} {d} {N} {lam} {ws}'))
        if N == 3: jobs.append((q**(lam + d) / lam, f'{q} {d} 0 {lam} 0 0 0 0 0 5 0 0 0 0 1 12 0 0 0'))
jobs.sort()
for c, j in jobs: print(j)
