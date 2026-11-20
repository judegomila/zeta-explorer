# Long scan on one vertical line: does zeta/G_X meet the negative real axis for small X? (float64 grid; MEASURED)
import sys, json, math, time, os
import numpy as np
from flint import acb, ctx
ctx.prec = 80
OUT = os.path.dirname(os.path.abspath(__file__))
T = float(sys.argv[1]); H = float(sys.argv[2]); dL = float(sys.argv[3]); dt = 0.002
L = math.log(T/(2*math.pi)); sg = 0.5 + dL/L
Xs = [1, 2, 11, 100, 1000, 10000]; NMAX = Xs[-1]
sieve = np.ones(NMAX+1, bool); sieve[:2] = False
for p in range(2, int(NMAX**0.5)+1):
    if sieve[p]: sieve[p*p::p] = False
items = []
for p in np.nonzero(sieve)[0]:
    q = int(p); k = 1
    while q <= NMAX: items.append((q, 1.0/k)); q *= int(p); k += 1
items.sort(); ns = np.array([a for a, b in items], float); wk = np.array([b for a, b in items]); ln = np.log(ns)
def chi(s): return acb.pi()**(s - acb(0.5)) * (((acb(1) - s)/2).lgamma() - (s/2).lgamma()).exp()
def cplx(z): return complex(float(z.real.mid()), float(z.imag.mid()))
nblk = int(round(H/40)); res = {X: {"crossings": [], "max_abs_arg": 0.0, "crossings_noFE": [], "max_abs_arg_noFE": 0.0} for X in Xs}
t0 = time.time(); prev = {}
print("T", T, "H", H, "sigma", sg, "blocks", nblk, "block array MB", 256*20001*16/1e6, flush=True)
for b in range(nblk):
    t = T + 40*b + np.arange(20001)*dt
    z = np.array([cplx(acb(sg, float(x)).zeta()) for x in t]); c = np.array([cplx(chi(acb(sg, float(x)))) for x in t])
    A = np.zeros(len(t), complex); pos = 0
    for X in Xs:
        end = int(np.searchsorted(ns, X, side='right'))
        while pos < end:
            e = min(end, pos+256)
            A += (wk[pos:e]*ns[pos:e]**(-sg)) @ np.exp(-1j*np.outer(ln[pos:e], t)); pos = e
        P = np.exp(A)
        for tag, W in (("", z/(P + c*np.conj(P))), ("_noFE", z/P)):
            m = (W.imag[1:]*W.imag[:-1] < 0) & (W.real[1:] < 0) & (W.real[:-1] < 0)
            res[X]["crossings"+tag] += [float(x) for x in t[:-1][m]]
            res[X]["max_abs_arg"+tag] = max(res[X]["max_abs_arg"+tag], float(np.max(np.abs(np.angle(W)))))
    if b % 5 == 0: print("block", b, time.time()-t0, {X: len(res[X]["crossings"]) for X in Xs}, flush=True)
out = {"T": T, "H": H, "sigma": sg, "d": dL/L, "rows": {str(X): {"n_crossings": len(r["crossings"]), "first_crossings": r["crossings"][:10], "max_abs_arg": r["max_abs_arg"],
       "n_crossings_noFE": len(r["crossings_noFE"]), "first_crossings_noFE": r["crossings_noFE"][:10], "max_abs_arg_noFE": r["max_abs_arg_noFE"]} for X, r in res.items()}}
json.dump(out, open(os.path.join(OUT, "scan_T%d_H%d_d%s.json" % (int(T), int(H), sys.argv[3])), "w"), indent=1); print(json.dumps(out, indent=1))
