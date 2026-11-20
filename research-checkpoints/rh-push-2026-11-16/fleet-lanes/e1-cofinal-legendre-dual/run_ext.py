"""Extension LP: ext(x; X) = max{ G(x) - v x/X : (G,u,v) dual-feasible at X }, X = 2^i x.
Restriction rule (RESULT.md Lemma 1): a point feasible at X restricts to a point feasible at x with
v' = v x/X, so ext(x; X) is the largest objective at x among points that extend to X. ext(x; x) = nu_1(x)."""
import sys, json, math, time, resource, numpy as np
sys.path.insert(0, 'tmp/research-2026-11-16/push/e1-cofinal-legendre-dual')
import lplib
x = int(float(sys.argv[1])); imax = int(sys.argv[2])
for i in range(0, imax + 1):
    X = x * 2 ** i
    s, mmax = lplib.params(X)
    print(f"PLAN X={X}: variables {s+mmax+2}, nonzeros ~{7*X**0.75:.3g}; measured peak RSS 0.53 GB at 3e6", flush=True)
    t0 = time.time()
    d = lplib.solve(X, verbose=False, obj_t=x, obj_vcoef=x / X)
    G, u, v = d['G'], d['u'], d['v']
    it = int(np.searchsorted(d['P'].J, x))
    val = G[it] - v * x / X
    print("EXT " + json.dumps(dict(x=x, X=X, i=i, ext=val, ext_over_sqrtx=val / math.sqrt(x),
          ext_logX_over_sqrtx=val * math.log(X) / math.sqrt(x), alpha=v / X, vlogX_over_X=v * math.log(X) / X,
          Gx=float(G[it]), GX_minus_v=float(G[-1] - v), maxabs_e=d['maxabs'], secs=round(time.time() - t0, 1),
          maxrss_MB=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 2**20)), flush=True)
