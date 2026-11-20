"""Control zeta(s+a) zeta(s-a) (prime side): zeros = pairs (gamma_k, offset a) on zeta's own ordinates, pair density log(t/2pi)/(2pi).
Re L_F(1/2+it) = log(t/2pi) - Re sum_{n<=P} 2 cosh(a log n) Lambda(n) (1 - log n/u) n^(-1/2-it) + O(P^(1/2+a)/(u t^2)).
Compared with the exact lattice row of the same density (Theorem B), whose value is 2 pi/d = log(t/2pi) for u < log(t/2pi). float64 (MEASURED)."""
import os, json, math
import numpy as np
from signchain import prime_powers
HERE = os.path.dirname(os.path.abspath(__file__))
out = []
for (T, theta, length, step) in [(1e9, 0.25, 2e4, 0.08), (1e9, 0.5, 2e4, 0.04), (1e6, 0.5, 2e4, 0.05), (1e6, 1.0, 200, 0.02)]:
    P = T ** theta; u = math.log(P)
    ns, lam, pid, kk, npr = prime_powers(P)
    logn = np.log(ns)
    avals = [0.0, 0.05, 0.1, 0.2, 0.3, 0.4]
    C = np.array([(2 * np.cosh(a * logn) if a > 0 else np.ones_like(logn)) * lam * (1 - logn / u) / np.sqrt(ns) for a in avals]).T.astype(np.complex128)
    K = len(ns); chunk = max(16, int(4e6 // K)); npts = int(length / step)
    print("cell", T, theta, "terms", K, "points", npts, "chunk alloc MB", chunk * K * 16 / 1e6, flush=True)
    mn = np.full(len(avals), np.inf)
    for s in range(0, npts, chunk):
        dt = np.arange(s, min(npts, s + chunk)) * step
        E = np.exp(-1j * (np.outer(dt, logn) + (T * logn % (2 * math.pi))[None, :]))
        S = (E @ C).real
        res = np.log((T + dt) / (2 * math.pi))[:, None] * np.array([0.5] + [1.0] * (len(avals) - 1))[None, :]
        mn = np.minimum(mn, (res - S).min(axis=0))
    r = dict(T=T, theta=theta, P=P, length=length, a=avals, minG=[float(x) for x in mn], l1=[float(np.abs(C[:, i]).sum()) for i in range(len(avals))], lattice_value=math.log(T / 2 / math.pi))
    print(json.dumps(r), flush=True); out.append(r)
json.dump(out, open(os.path.join(HERE, "out_shiftctl.json"), "w"))
