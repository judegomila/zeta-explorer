# Adversarial search: real zeros of f(t)=sum_j Q_j(t) exp(-(t-c_j)^2/(2 s_j)) versus the
# heat-flow cap  B = 2*sum_{j not widest}(d_j+1) + sum_{j widest}(d_j+1) - 1.
# Sign changes counted on a fine grid in a scaled (log-safe) form. numpy, single process.
import numpy as np, sys
rng = np.random.default_rng(int(sys.argv[1]) if len(sys.argv) > 1 else 0)

def sign_changes(c, s, polys, lo=-60, hi=60, n=400001):
    t = np.linspace(lo, hi, n)
    # log-scale: subtract max exponent pointwise to avoid underflow
    E = np.array([-(t-cj)**2/(2*sj) for cj, sj in zip(c, s)])
    m = E.max(axis=0)
    val = np.zeros_like(t)
    for j, p in enumerate(polys):
        val += np.polyval(p, t) * np.exp(E[j]-m)
    sg = np.sign(val); sg = sg[sg != 0]
    return int(np.sum(sg[1:] != sg[:-1]))

def cap(s, degs):
    smax = max(s)
    return sum((2 if sj < smax else 1)*(d+1) for sj, d in zip(s, degs)) - 1

def objective(x, N, degs):
    c = x[:N]; s = np.exp(x[N:2*N]); polys = []; k = 2*N
    for d in degs:
        polys.append(x[k:k+d+1]); k += d+1
    return sign_changes(c, s, polys, n=8001), (c, s, polys)

best = {}
for N, degs in [(2,[0,0]),(3,[0,0,0]),(4,[0,0,0,0]),(5,[0]*5),(2,[1,1]),(3,[1,1,1]),(2,[2,2]),(3,[2,0,1]),(2,[3,0]),(2,[0,3])]:
    dim = 2*N + sum(d+1 for d in degs)
    top = -1; arg = None
    for trial in range(int(sys.argv[2])):
        x = np.concatenate([rng.normal(0, 3, N), rng.normal(0, 1.2, N), rng.normal(0, 1, dim-2*N)])
        v, par = objective(x, N, degs)
        # hill climb
        for it in range(40):
            y = x + rng.normal(0, 0.3, dim)
            w, par2 = objective(y, N, degs)
            if w >= v: x, v, par = y, w, par2
        if v > top: top, arg = v, par
    c, s, polys = arg
    fine = sign_changes(c, s, polys)
    B = cap(list(s), degs)
    D = sum(d+1 for d in degs)
    print(f"N={N} degs={degs} D={D}  PS-equal-width cap D-1={D-1}  found max sign changes={fine}  heat-flow cap B={B}  violates={fine>B}", flush=True)
