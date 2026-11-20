# dev3.py: the sibling control HQ3(q, a, b) (log-derivative coefficients >= Lambda; poles off the line on the real axis of s) on the
# band device N(theta) and on C(theta). Same construction and certification as dev.py / cth.py.
# usage: python dev3.py OUT.jsonl "T0,..." NW "theta,..." [M]
import sys, os, json, math, time
import numpy as np
from multiprocessing import Pool
from flint import arb, acb, arb_mat, ctx
import tz, dev
from dev import prime_sum, atoms, ident, sub, certify, SPACING
ctx.prec = 128
MBIG = int(sys.argv[5]) if len(sys.argv) > 5 else 192
HQ3 = [(2, "0.1", "0.2"), (2, "0.3239252271", "0.4"), (2, "0.03", "0.06"), (3, "0.2", "0.3")]


def work(task):
    T0, w, th = task
    t0 = time.time()
    tw = T0 + SPACING * w
    X = int(round(T0 ** th)) if abs(T0 ** th - round(T0 ** th)) < 1e-6 * T0 ** th else int(math.floor(T0 ** th))
    U = arb(th) * arb(int(T0)).log(); u = float(U.mid()); Lg = math.log(tw / (2 * math.pi)); m = MBIG
    lo, hi = m // 4, m // 4 + m // 2
    tau, D = tz.nodes(tw, U, m)
    F, F1, sabs, cnt = prime_sum(tw, U, m, X)
    Az = tz.add(tz.arch(tw, U, m, [arb(1) / 4], -arb.pi().log()), tz.rank_terms(tw, U, m, [(acb(0, 0.5), 1), (acb(0, -0.5), 1)]), tz.loewner(m, D, U, F, F1, -1))
    base = {"T0": T0, "w": w, "tw": tw, "theta": th, "u": u, "Lg": Lg, "X": X}
    res = []
    def rec(name, A, **kw):
        for (mm, B) in ((m, A), (m // 2, sub(A, lo, hi))):
            r = certify(B); r.update(base, obj=name, m=mm, s=r["lam_min"] / Lg, **kw); res.append(r)
    rec("zeta", Az)
    for (q, a, b) in HQ3:
        v = arb(q).log(); A_ = arb(a) * v; B_ = arb(b) * v
        K = int(u / math.log(q)) + 2
        Fa, F1a, nk = atoms(tau, v, [2 * v * ((k * B_).cosh() - (k * A_).cosh()) for k in range(1, K + 1)], U)
        Fo, F1o, _ = atoms(tau, v, [2 * v * (k * A_).cosh() for k in range(1, K + 1)], U)
        kw = dict(q=q, a=a, b=b, n_atoms=nk)
        rec("HQ3 as written", tz.add(Az, tz.loewner(m, D, U, Fa, F1a, -1)), **kw)
        rec("HQ3 own poles added", tz.add(Az, ident(m, 2 * v), tz.loewner(m, D, U, Fo, F1o, +1)), **kw)
    for r in res: r["t_cell"] = time.time() - t0
    return res


if __name__ == "__main__":
    out = sys.argv[1]
    T0s = [float(x) for x in sys.argv[2].split(",")]; NW = int(sys.argv[3]); ths = [float(x) for x in sys.argv[4].split(",")]
    tasks = [(T0, w, th) for T0 in T0s for w in range(NW) for th in ths]
    tasks.sort(key=lambda t: -(t[0] ** t[2]))
    nproc = int(os.environ.get("RH_WORKERS", "4"))
    print("tasks %d workers %d modes %d; planned memory under 50 MB per worker" % (len(tasks), nproc, MBIG), flush=True)
    t0 = time.time(); done = 0
    with Pool(nproc) as pool, open(out, "a") as f:
        for res in pool.imap_unordered(work, tasks, chunksize=1):
            for r in res: f.write(json.dumps(r) + "\n")
            f.flush(); done += 1
            print("done %d/%d T0=%g w=%d th=%g cell %.0fs elapsed %.0fs" % (done, len(tasks), res[0]["T0"], res[0]["w"], res[0]["theta"], res[0]["t_cell"], time.time() - t0), flush=True)
