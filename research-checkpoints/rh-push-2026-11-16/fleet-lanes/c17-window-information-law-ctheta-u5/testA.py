"""Test A (scale-free): cluster of n pairs against a tight background c*u (complete device, exact criterion,
ball arithmetic). u = 1; offsets are A = u b. Families: lattice rows of spacing 2 pi/kappa (kappa = 1: Nyquist),
offsets A cos^(2p)(pi tau/2), p = 0 flat. Output: largest passing A by bisection per (c, n, kappa, p)."""
import json, math, os, sys, time
from multiprocessing import Pool
from flint import ctx
import wil
HERE = os.path.dirname(os.path.abspath(__file__))
NS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 60]
if len(sys.argv) > 1:
    NS = [int(v) for v in sys.argv[1].split(",")]
KAPPAS = [1.0, 1.25, 1.5, 2.0, 3.0]
PS = [0, 1, 2]
CS = [2.0, 1.0, 0.01]
def profile(n, p):
    if n == 1 or p == 0:
        return [1.0] * n
    return [math.cos(math.pi * ((j - (n - 1) / 2) / ((n + 1) / 2)) / 2) ** (2 * p) for j in range(n)]
def task(args):
    c, n, kappa, p = args
    devs = {}
    def tst(A):
        v = 'undecided'
        for prec in (1024, 2048, 4096, 8192):
            ctx.prec = prec
            if prec not in devs:
                devs[prec] = wil.Device(1.0, None, c / 2); devs[prec].X = None; devs[prec].o_pts = []
            v = devs[prec].test([(x, A * w) for x, w in zip(xs, pr)])
            if v != 'undecided':
                return v
        return v
    d = 2 * math.pi / kappa
    xs = [(j - (n - 1) / 2) * d for j in range(n)]
    pr = profile(n, p); mx = max(pr); pr = [v / mx for v in pr]
    t0 = time.time()
    A, note = wil.threshold(tst, 0.05, 1.6 * n + 8.0, steps=12)
    rec = dict(c=c, n=n, kappa=kappa, p=p, A=A, note=note, sec=round(time.time() - t0, 1))
    print(json.dumps(rec), flush=True)
    return rec
if __name__ == "__main__":
    tasks = [(c, n, k, p) for c in CS for n in NS for k in KAPPAS for p in PS if not (n == 1 and (k != 1.0 or p != 0))]
    tasks = [t for t in tasks if t[2] in (1.0, 1.5, 2.0, 3.0) and t[3] in (0, 1)] if len(sys.argv) > 1 else tasks
    tasks.sort(key=lambda t: t[1])
    with Pool(int(os.environ.get("RH_WORKERS", "2"))) as pool:
        out = pool.map(task, tasks, chunksize=1)
    json.dump(out, open(os.path.join(HERE, "out_testA%s.json" % ("_" + sys.argv[1].replace(",", "_") if len(sys.argv) > 1 else "")), "w"))
    print("done", flush=True)
