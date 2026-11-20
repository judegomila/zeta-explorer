# Size-only numerics: R4 = sum_d psi(x,chi_d)^4 / (N_d x^2) over odd squarefree 1<d<=X=x^a,
# psi(x,chi_d) = sum_{odd prime powers l<=x} Lambda(l) (d/l); against Lambda -> eps*Lambda with eps a random
# completely multiplicative sign, and against eps = chi_21 (a family member used as a twist).
import numpy as np, math, json, sys, time
rng = np.random.default_rng(20261117)
def primes_odd(x):
    s = np.ones(x+1, bool); s[:2] = False
    for i in range(2, int(x**0.5)+1):
        if s[i]: s[i*i::i] = False
    return [int(p) for p in np.nonzero(s)[0] if p > 2]
def squarefree_odd(ds):
    ok = (ds % 2 == 1)
    lim = int(ds.max()**0.5)+1
    for p in primes_odd(max(lim, 3)):
        ok &= (ds % (p*p) != 0)
    return ds[ok]
def jac21(p):  # (21/p) = chi_21(p) as a sign on primes (21 = 1 mod 4, so (21/p) = (p/21))
    if p in (3, 7): return 0
    def leg(a, q): return 1 if pow(a % q, (q-1)//2, q) == 1 else -1
    return leg(p, 3)*leg(p, 7)
def run(x, a, nseed=3, maxd=1_500_000):
    X = int(round(x**a)); ps = primes_odd(x)
    if X <= 2*maxd:
        ds = squarefree_odd(np.arange(3, X+1, 2, dtype=np.int64)); mode = "all"
    else:
        ds = np.unique(rng.integers(3, X+1, size=int(maxd*2.6), dtype=np.int64))
        ds = squarefree_odd(ds)[:maxd]; mode = "sample"
    n = len(ds)
    print(f"  planned memory: {(5+nseed)*n*8/1e6:.0f} MB for {n} values of d ({mode})", flush=True)
    psi = np.zeros(n); psir = [np.zeros(n) for _ in range(nseed)]; psit = np.zeros(n)
    eps = [rng.choice([-1.0, 1.0], size=len(ps)) for _ in range(nseed)]
    for i, p in enumerate(ps):
        tab = -np.ones(p); tab[0] = 0; tab[(np.arange(1, p, dtype=np.int64)**2) % p] = 1
        leg = tab[ds % p]; lp = math.log(p)
        J = int(math.log(x)/lp + 1e-12); nodd = (J+1)//2; nev = J//2
        even = nev*lp*leg*leg
        psi += nodd*lp*leg + even
        for s in range(nseed): psir[s] += eps[s][i]*nodd*lp*leg + even
        e21 = jac21(p)
        psit += e21*nodd*lp*leg + (even if e21 != 0 else 0)
    def st(v):
        return dict(R2=float(np.mean(v**2)/x), R4=float(np.mean(v**4)/x**2), maxabs=float(np.max(np.abs(v))/x**0.5))
    r = dict(x=x, a=a, X=X, nd=n, mode=mode, L2=math.log(x)**2, real=st(psi), rand=[st(v) for v in psir], twist21=st(psit))
    i21 = np.nonzero(ds == 21)[0]
    if len(i21): r["twist21_member_d21_over_x"] = float(psit[i21[0]]/x)
    # d = 1 member (zeta): psi_odd(x) - x
    r["d1_over_sqrtx"] = float((sum(int(math.log(x)/math.log(p)+1e-12)*math.log(p) for p in ps) - x)/x**0.5)
    return r
out = []
print("planned memory per run printed below; cap 8 GB")
for a in (1.0, 1.5, 2.0):
    for x in (500, 1000, 2000, 5000, 10000, 20000):
        t = time.time(); r = run(x, a); out.append(r)
        rr = np.mean([s["R4"] for s in r["rand"]])
        print(f"a={a} x={x:6d} X={r['X']:.2e} nd={r['nd']:8d} {r['mode']:6s} | real R2={r['real']['R2']:.3f} R4={r['real']['R4']:.2f} R4/log^2={r['real']['R4']/r['L2']:.3f} max={r['real']['maxabs']:.2f}"
              f" | rand R4={rr:.2f} R4/log^2={rr/r['L2']:.3f} max={np.mean([s['maxabs'] for s in r['rand']]):.2f}"
              f" | chi21-twist R4={r['twist21']['R4']:.2f} max={r['twist21']['maxabs']:.2f} | {time.time()-t:.0f}s", flush=True)
        json.dump(out, open("moments.json", "w"), indent=1)
