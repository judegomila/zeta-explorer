# sup / L1 / Poisson-L1 errors of prime-side and shifted candidates h against S(it) for zeta, on height windows.
# MEASURED (mpmath 20 digits for zeta, double afterwards; grid step 0.01).
import sys, json, numpy as np, mpmath as mp
from multiprocessing import Pool
from common import Gfun
mp.mp.dps = 20
SIG = (0.5, 0.375, 0.1, 0.02)
def primes_upto(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**0.5)+1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]
def point(t):
    s = mp.mpc(0.5, t)
    z = mp.zeta(s); zd = mp.zeta(s, derivative=1)
    out = [complex(Gfun(s)), complex(zd/z), complex(zd)]
    for sg in SIG:
        s2 = mp.mpc(0.5+sg, t)
        out.append(complex(Gfun(s2) + mp.zeta(s2, derivative=1)/mp.zeta(s2)))
    return out
def Dq(Q): return sum(np.log(p)/(np.sqrt(p)-1) for p in primes_upto(max(Q, 2)) if p <= Q)
def Rt(t): return 0.5*np.log(t/(2*np.pi)) - 1/(3*t) - 1/(2*t*t)
def winding(v):
    return np.sum(np.angle(v[1:]/v[:-1]))/(2*np.pi)
def run(T, W, step, pool):
    ts = np.arange(T, T+W+step/2, step)
    D = np.array(pool.map(point, [float(t) for t in ts], chunksize=16))
    G, ZL, ZD = D[:, 0], D[:, 1], D[:, 2]
    L = G + ZL
    s = 0.5 + 1j*ts
    PR = primes_upto(10000)
    def chain(Q):
        acc = np.zeros(len(ts), complex)
        for p in PR[PR <= Q]: acc += np.log(p)/(p**s - 1)
        return G - acc
    # von Mangoldt up to N
    def vm(N):
        lam = np.zeros(N+1)
        for p in primes_upto(N):
            q = p
            while q <= N: lam[q] = np.log(p); q *= p
        return lam
    lam = vm(1000); nn = np.arange(2, 1001)
    npow = np.exp(-np.outer(s, np.log(nn)))          # n^{-s}
    P1000 = npow @ lam[2:]
    Pmoll = npow @ (lam[2:]*(1-np.log(nn)/np.log(1000)))
    # Moebius up to 100
    mu = np.ones(101); mu[0] = 0
    for p in primes_upto(100):
        mu[p::p] *= -1; mu[p*p::p*p] = 0
    n100 = np.arange(1, 101)
    M100 = np.exp(-np.outer(s, np.log(n100))) @ (mu[1:]*(1-np.log(n100)/np.log(100)))
    Lam = 0.5*np.log((T+W/2)/(2*np.pi))
    Qcert = max([Q for Q in range(1, 200) if Dq(Q) <= Rt(T)] or [1])
    res = {"T": T, "W": W, "step": step, "Lam": Lam, "Qcert": int(Qcert), "rows": []}
    f_re = None
    for alpha, an in ((1/Lam, "1/Lam"), (1.0, "1"), (10.0, "10")):
        cay = lambda Lh: (1-alpha*Lh)/(1+alpha*Lh)
        S = cay(L)
        cands = [("h=0", 0*S, "H^inf"),
                 (f"chain Q={Qcert} (coverage-certified)", cay(chain(Qcert)), "H^inf above t0 (Thm 3 causal-cascade)"),
                 ("chain Q=100", cay(chain(100)), "not certified"),
                 ("chain Q=10000", cay(chain(10000)), "not certified"),
                 ("shift S(z+1/2)", cay(D[:, 3]), "H^inf (classical)"),
                 ("shift S(z+3/8)", cay(D[:, 4]), "H^inf given the 7/8 theorem"),
                 ("shift S(z+0.1)", cay(D[:, 5]), "H^inf only if zero-free Re s>0.6"),
                 ("shift S(z+0.02)", cay(D[:, 6]), "H^inf only if zero-free Re s>0.52"),
                 ("mollified chain N=1000", cay(G - Pmoll), "not certified"),
                 ("NB-type L=G+zeta' M_100", cay(G + ZD*M100), "not certified")]
        for M in (1, 3, 10):
            acc = np.zeros(len(ts), complex)
            for m in range(M+1): acc += alpha**m*P1000**m/(1+alpha*G)**(m+1)
            cands.append((f"Cayley partial sum M={M}, N=1000", -1+2*acc, "H^inf if 1+alpha G has no zero"))
        inner = (ts >= T+W/4) & (ts <= T+3*W/4)
        for name, h, cls in cands:
            e = np.abs(S-h)
            row = {"alpha": an, "h": name, "class": cls, "sup": float(e.max()), "mean": float(e.mean()),
                   "rms": float(np.sqrt((e*e).mean())), "wind_S": float(winding(S)),
                   "wind_h": float(winding(h)) if np.abs(h).min() > 1e-9 else None, "sup_abs_h": float(np.abs(h).max())}
            for x in (0.375, 0.05):
                pa = []
                for y in ts[inner][::10]:
                    k = (x/np.pi)/((ts-y)**2+x*x); pa.append(float((e*k).sum()/k.sum()))
                row[f"pois_min_x{x}"] = min(pa); row[f"pois_max_x{x}"] = max(pa)
            res["rows"].append(row)
    return res
if __name__ == "__main__":
    out = []
    with Pool(8) as pool:
        for T, W in ((100, 40), (1000, 20), (10000, 20), (100000, 20), (1000000, 20)):
            r = run(T, W, 0.01, pool); out.append(r)
            print(f"== window [{T}, {T+W}]  Lam={r['Lam']:.4f}  gap mean-field 1/(4*0.375*Lam)={1/(1.5*r['Lam']):.4f}  Qcert={r['Qcert']}")
            print("   alpha  candidate                               sup     mean    rms     Pois(x=3/8) min..max   Pois(x=.05) min..max  wind_S   wind_h   sup|h|")
            for w in r["rows"]:
                wh = "   n/a " if w["wind_h"] is None else f"{w['wind_h']:7.2f}"
                print(f"   {w['alpha']:<6} {w['h']:<38} {w['sup']:.4f}  {w['mean']:.4f}  {w['rms']:.4f}  {w['pois_min_x0.375']:.4f}..{w['pois_max_x0.375']:.4f}   {w['pois_min_x0.05']:.4f}..{w['pois_max_x0.05']:.4f}  {w['wind_S']:7.2f}  {wh}  {w['sup_abs_h']:.3g}")
            sys.stdout.flush()
    json.dump(out, open("zeta_approx.json", "w"), indent=1)
