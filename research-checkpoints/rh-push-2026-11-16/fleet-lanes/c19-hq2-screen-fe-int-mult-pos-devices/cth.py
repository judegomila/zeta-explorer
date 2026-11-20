# cth.py: statement C(theta) of c15-u7 (Re L_F(1/2 + it; P = T0^theta) >= -M) on zeta, HQ2, the HQ2 numerator, ZQ, T-NR.
# float64 grid as a screen; the value at each object's grid minimum is recomputed in python-flint balls (verdict for "fails";
# "passes" is a grid statement only).
# usage: python cth.py OUT.jsonl "T0,..." NW "theta,..."
import sys, os, json, math, time
import numpy as np
from multiprocessing import Pool
from scipy.special import digamma
from flint import arb, acb, ctx
import hq2
from dev import prime_powers, zeta_pair, HQ, TNR_Q, TNR_C, ZQ_ETA, SPACING

ctx.prec = 128
HALF = 20.0; DT = 0.004
I = acb(0, 1)


def Kf(w, u): return 1 / w - (1 - np.exp(-u * w)) / (u * w * w)
def trig(z): return 1 / z + 1 / (2 * z ** 2) + 1 / (6 * z ** 3) - 1 / (30 * z ** 5)
def Fu(z, u):
    return (1 - np.cos(u * z)) / (u * z * z)


def zeta_arb(t, u, pp):
    """Re L_F(1/2 + it) for zeta in balls: gamma one-port of c15 stage.py plus a radius for the omitted trivial-zero terms k >= 1."""
    s = acb(arb(1) / 2, t)
    def K(w): return 1 / w - (1 - (-u * w).exp()) / (u * w * w)
    g = (s / 2).digamma() / 2 - arb.pi().log() / 2
    gp = acb(2).zeta(s / 2) / 4
    gam = K(s) + K(s - 1) + g + gp / u - (-u * s).exp() / (u * s * s)
    acc = acb(0)
    for (n, p) in pp:
        a = arb(n).log()
        if not (a < u): continue
        acc += arb(p).log() / arb(n).sqrt() * (1 - a / u) * (-I * t * a).exp()
    val = (gam - acc).real
    tail = (-arb(2.5) * u).exp() / (u * t * t) * 2      # sum_{k>=1} P^(-2k-1/2)/(u |2k+s|^2)
    return val + arb(0, float(tail.upper()))


def lat(t, u, v, masses):
    """sum_k masses[k] (1 - k v/u) cos(k v t), k v < u (arb)."""
    s = arb(0)
    for k, mu in enumerate(masses, start=1):
        if not (k * v < u): break
        s += mu * (1 - k * v / u) * (t * k * v).cos()
    return s


def Fu_arb(z, u):
    return ((1 - (u * z).cos()) / (u * z * z))


def work(task):
    T0, w, th = task
    t0 = time.time()
    tw = T0 + SPACING * w
    P = T0 ** th; u = th * math.log(T0)
    X = int(round(P)) if abs(P - round(P)) < 1e-6 * P else int(math.floor(P))
    t = tw - HALF + DT * np.arange(int(round(2 * HALF / DT)) + 1)
    s = 0.5 + 1j * t
    g = 0.5 * digamma(s / 2) - 0.5 * np.log(np.pi); gp = 0.25 * trig(s / 2)
    gam = Kf(s, u) + Kf(s - 1, u) + g + gp / u - np.exp(-u * s) / (u * s * s)
    pp = prime_powers(X)
    n = np.array([x[0] for x in pp], dtype=np.float64); lp = np.log(np.array([x[1] for x in pp], dtype=np.float64))
    ln = np.log(n); keep = ln < u
    ln = ln[keep]; c = lp[keep] / np.sqrt(n[keep]) * (1 - ln / u)
    acc = np.zeros(len(t), dtype=np.complex128)
    CH = max(1, 4_000_000 // len(t))
    for a in range(0, len(ln), CH):
        acc += np.exp(-1j * np.outer(t, ln[a:a + CH])) @ c[a:a + CH]
    Gz = (gam - acc).real
    ua = arb(th) * arb(int(T0)).log()
    Lg = math.log(tw / (2 * math.pi))
    base = {"T0": T0, "w": w, "tw": tw, "theta": th, "u": u, "Lg": Lg, "X": X, "grid": len(t), "dt": DT}
    res = []
    zcache = {}
    def zarb(tt):
        if tt not in zcache: zcache[tt] = zeta_arb(arb(tt), ua, pp)
        return zcache[tt]
    def rec(name, G, extra_arb, **kw):
        i0 = int(np.argmin(G)); tm = float(t[i0])
        ball = zarb(tm) + extra_arb(arb(tm))
        r = dict(base, obj=name, minG=float(G[i0]), t_min=tm, frac_neg=float((G < 0).mean()), frac_lt_m1=float((G < -1).mean()),
                 meanG=float(G.mean()), ball_mid=float(ball.mid()), ball_rad=float(ball.rad()),
                 ball_neg=bool(ball < 0), ball_lt_m1=bool(ball < -1), ball_lt_m2=bool(ball < -2), ball_pos=bool(ball > 0), **kw)
        res.append(r)
    rec("zeta", Gz, lambda tt: arb(0))
    for (q, eps) in HQ:
        v = math.log(q); va = arb(q).log()
        K = int(u / v) + 2
        S = hq2.power_sums(arb(eps), K)
        Sf = np.array([float(x.mid()) for x in S])
        kk = np.arange(1, K + 1); kk = kk[kk * v < u]
        wk = (1 - kk * v / u)
        cosm = np.cos(np.outer(t, kk * v))
        asw = -(cosm @ (v * (4 - Sf[kk]) * wk))
        polepart = 2 * v * (1 + 2 * (cosm @ wk))
        kw = dict(q=q, eps=eps, n_atoms=int(len(kk)))
        rec("HQ2 as written", Gz + asw, lambda tt, va=va, S=S, K=K: -lat(tt, ua, va, [va * (4 - S[k]) for k in range(1, K + 1)]), **kw)
        rec("HQ2 own poles added", Gz + asw + polepart,
            lambda tt, va=va, S=S, K=K: 2 * va + lat(tt, ua, va, [va * S[k] for k in range(1, K + 1)]), **kw)
        rec("HQ2 numerator, zeta's gamma term", Gz + asw + polepart - 2 * v,
            lambda tt, va=va, S=S, K=K: lat(tt, ua, va, [va * S[k] for k in range(1, K + 1)]), **kw)
    v = math.log(TNR_Q); va = arb(TNR_Q).log()
    rho = (TNR_C + math.sqrt(TNR_C ** 2 - 4)) / 2; rhoa = (arb(TNR_C) + (arb(TNR_C) ** 2 - 4).sqrt()) / 2
    K = int(u / v) + 2
    kk = np.arange(1, K + 1); kk = kk[kk * v < u]
    at = -v * (-1.0) ** kk * (rho ** kk + rho ** (-kk))
    tn = -(np.cos(np.outer(t, kk * v)) @ (at * (1 - kk * v / u)))
    ex = lambda tt: -lat(tt, ua, va, [-va * (-1) ** k * (rhoa ** k + rhoa ** (-k)) for k in range(1, K + 1)])
    rec("T-NR (3, 2.2), zeta's gamma term", Gz + tn, ex, n_atoms=int(len(kk)))
    rec("T-NR (3, 2.2), own conductor term", Gz + tn + v, lambda tt: ex(tt) + va, n_atoms=int(len(kk)))
    g1, g2 = zeta_pair(tw); gb = (g1 + g2) / 2
    g1f, g2f, gbf = float(g1.mid()), float(g2.mid()), float(gb.mid())
    for eta in ZQ_ETA:
        e = float(eta)
        zq = 2 * Fu(t - gbf + 1j * e, u).real - Fu(t - g1f + 0j, u).real - Fu(t - g2f + 0j, u).real
        def exz(tt, e=arb(eta)):
            return 2 * Fu_arb(acb(tt - gb, e), ua).real - Fu_arb(acb(tt - g1), ua).real - Fu_arb(acb(tt - g2), ua).real
        rec("ZQ", Gz + zq, exz, eta=eta, g1=g1f, g2=g2f)
    for r in res: r["t_cell"] = time.time() - t0
    return res


if __name__ == "__main__":
    out = sys.argv[1]
    T0s = [float(x) for x in sys.argv[2].split(",")]; NW = int(sys.argv[3]); ths = [float(x) for x in sys.argv[4].split(",")]
    tasks = [(T0, w, th) for T0 in T0s for w in range(NW) for th in ths]
    tasks.sort(key=lambda t: -(t[0] ** t[2]))
    nproc = int(os.environ.get("RH_WORKERS", "2"))
    ng = int(round(2 * HALF / DT)) + 1
    print("tasks %d, workers %d; planned memory per worker: phase chunk 4e6 complex = 64 MB, grid %d" % (len(tasks), nproc, ng), flush=True)
    t0 = time.time(); done = 0
    with Pool(nproc) as pool, open(out, "a") as f:
        for res in pool.imap_unordered(work, tasks, chunksize=1):
            for r in res: f.write(json.dumps(r) + "\n")
            f.flush(); done += 1
            z = res[0]
            print("done %d/%d T0=%g w=%d th=%g zeta minG=%.4f ball %.4f cell %.0fs elapsed %.0fs" % (done, len(tasks), z["T0"], z["w"], z["theta"], z["minG"], z["ball_mid"], z["t_cell"], time.time() - t0), flush=True)
