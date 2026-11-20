"""First decisive test: solve the Legendre dual LP on a doubling grid, save optimal points."""
import sys, json, math, time, resource, numpy as np
sys.path.insert(0, 'tmp/research-2026-11-16/push/e1-cofinal-legendre-dual')
import lplib
OUT = 'tmp/research-2026-11-16/push/e1-cofinal-legendre-dual/out/'
import os; os.makedirs(OUT, exist_ok=True)
for x in [int(float(a)) for a in sys.argv[1:]]:
    s, mmax = lplib.params(x)
    nJ = s + mmax
    nnz = 7 * x ** 0.75
    print(f"PLAN x={x}: variables {nJ+2}, rows ~{2*(nJ+4)+nJ}, nonzeros ~{nnz:.3g} "
          f"(~{nnz*12*3/2**20:.0f} MB CSR incl. copies); HiGHS working memory measured 0.53 GB at 3e6, 1.2 GB at 1e7", flush=True)
    t0 = time.time()
    d = lplib.solve(x, verbose=False)
    G, u, v = d['G'], d['u'], d['v']
    out = dict(x=x, nu1=d['value'], nu1_over_sqrtx=d['value'] / math.sqrt(x), maxabs_e=d['maxabs'],
               u=u, v=v, alpha=v / x, gamma=(u + v * math.log(x)) / x, vlogx_over_x=v * math.log(x) / x,
               tau_density1=x / v, rows=d['rows'], secs=round(time.time() - t0, 1),
               maxrss_MB=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 2**20)
    print("RESULT " + json.dumps(out), flush=True)
    np.savez(OUT + f"opt_{x}.npz", J=d['P'].J, G=G, u=u, v=v, value=d['value'])
