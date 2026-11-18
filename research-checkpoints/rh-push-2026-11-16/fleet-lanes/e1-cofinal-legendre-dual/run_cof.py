"""Scale-dependent extension LP (the cofinal class with discrepancy tau(Y) = 1 + log Y).
cof(x; X) = (1 + log X)/(1 + log x) * max{ G(x) - v x/X : G nondecreasing >= 0,
            |T(k) + u/k + v log k/k| <= (1 + log(X/k))/(1 + log X) for all k <= X }.
In density-1 units this is: discrepancy at every scale Y = X/k at most tau(Y) = (1+log Y)/(1+log x)
(equal to 1 at Y = x), objective = excess at x. cof(x; x) is the same LP posed at x itself."""
import sys, json, math, time, resource, numpy as np
sys.path.insert(0, 'tmp/research-2026-11-16/push/e1-cofinal-legendre-dual')
import lplib
lplib.RHO = lambda X, k: (1.0 + np.log(X / np.asarray(k, dtype=float))) / (1.0 + math.log(X))
x = int(float(sys.argv[1])); imax = int(sys.argv[2])
for i in range(0, imax + 1):
    X = x * 2 ** i
    s, mmax = lplib.params(X)
    print(f"PLAN X={X}: variables {s+mmax+2}, nonzeros ~{7*X**0.75:.3g}; measured peak RSS 0.53 GB at 3e6", flush=True)
    t0 = time.time()
    d = lplib.solve(X, verbose=False, obj_t=x, obj_vcoef=x / X, max_rounds=40)
    G, u, v = d['G'], d['u'], d['v']
    it = int(np.searchsorted(d['P'].J, x))
    val = (G[it] - v * x / X) * (1 + math.log(X)) / (1 + math.log(x))
    a1 = v / X * (1 + math.log(X)) / (1 + math.log(x))
    print("COF " + json.dumps(dict(x=x, X=X, i=i, cof=val, cof_over_sqrtx=val / math.sqrt(x), density_in_x_units=a1,
          excess_density1_over_sqrtx=val / a1 / math.sqrt(x), maxabs_e=d['maxabs'], rounds=d['rounds'],
          secs=round(time.time() - t0, 1), maxrss_MB=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 2**20)), flush=True)
