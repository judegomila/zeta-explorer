"""Test B: clusters on zeta's ordinates near T, complete band-u device (exact criterion, ball arithmetic).
Synthetic set: zeta ordinates (stored floats) in [T-H, T+H], lattice of spacing 2 pi/log(T/2 pi) outside, tolerance M.
Modes: one (single pair at ordinates and midpoints), add (pairs at consecutive ordinates, on-line zeros kept),
rep2 (pairs at every second ordinate, both ordinates removed: count preserved), row (lattice row of spacing
2 pi/(kappa u) centred at T, added). Profiles: flat, taper (cos^2). Output: largest passing offset b (cap 0.4999)."""
import json, math, os, sys, time
from multiprocessing import Pool
from flint import ctx
import wil
HERE = os.path.dirname(os.path.abspath(__file__))
NS = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 40, 60]
HW = {1e6: 45.0, 1e9: 30.0, 1e12: 22.0}
CAP = 0.4999
PREC = int(os.environ.get('WIL_PREC', '512'))
if os.environ.get('WIL_NS'):
    NS = [int(v) for v in os.environ['WIL_NS'].split(',')]
MODES = os.environ.get('WIL_MODES', 'one,add-flat,add-taper,rep2-flat,rep2-taper,row-taper-2.0,row-taper-1.25').split(',')
THETAS = [float(v) for v in os.environ.get('WIL_THETAS', '0.5,1,2').split(',')]
LO = float(os.environ.get('WIL_LO', '1e-4'))
PRECS = [PREC] + [p for p in (2048, 4096) if p > PREC and os.environ.get('WIL_ADAPT')]
ONLY = os.environ.get('WIL_ONLY')
def profile(n, taper):
    if n == 1 or not taper:
        return [1.0] * n
    pr = [math.cos(math.pi * ((j - (n - 1) / 2) / ((n + 1) / 2)) / 2) ** 2 for j in range(n)]
    mx = max(pr)
    return [v / mx for v in pr]
def decided():
    """(T, theta, M, mode, n) already decided in earlier unit logs (used by the fill pass, WIL_FILL=1)."""
    import glob
    out = set()
    for p in glob.glob(os.path.expanduser('~/rh-push/logs/rh-c17wil-*.log')):
        for l in open(p):
            if l.startswith('{') and '"n":' in l:
                try:
                    r = json.loads(l)
                except Exception:
                    continue
                if 'T' in r and r.get('b') is not None and 'mode' in r:
                    out.add((r['T'], r['theta'], r['M'], r['mode'], r['n']))
    return out
DONE = decided() if os.environ.get('WIL_FILL') else set()
def task(args):
    T, theta, M, mode = args
    ctx.prec = PREC
    t0 = time.time()
    dev = wil.zeta_device(T, theta, M, HW[T])
    devs = {PREC: dev}
    class Adaptive:
        zeros = dev.zeros
        terms = dev.terms
        def test(self, pairs, removed=()):
            v = 'undecided'
            for prec in PRECS:
                ctx.prec = prec
                if prec not in devs:
                    devs[prec] = wil.zeta_device(T, theta, M, HW[T])
                v = devs[prec].test(pairs, removed)
                if v != 'undecided':
                    break
            ctx.prec = PREC
            return v
    dev = Adaptive()
    zs = sorted(dev.zeros)
    i0 = min(range(len(zs)), key=lambda i: abs(zs[i]))
    u = theta * math.log(T)
    out = []
    def emit(**kw):
        rec = dict(T=T, theta=theta, M=M, mode=mode, **kw)
        out.append(rec)
        print(json.dumps(rec), flush=True)
    emit(info="device", n_online=len(zs), sec=round(time.time() - t0, 1), terms=len(dev.terms))
    if mode == "one":
        for k in range(-7, 8):
            x = zs[i0 + k]
            b, note = wil.threshold(lambda b: dev.test([(x, b)]), 1e-4, CAP, steps=11)
            emit(where="ordinate", k=k, x=x, b=b, note=note)
            x = (zs[i0 + k] + zs[i0 + k + 1]) / 2
            b, note = wil.threshold(lambda b: dev.test([(x, b)]), 1e-4, CAP, steps=11)
            emit(where="midpoint", k=k, x=x, b=b, note=note)
            x = zs[i0 + k]
            b, note = wil.threshold(lambda b: dev.test([(x, b)], [x]), 1e-4, CAP, steps=11)
            emit(where="replace", k=k, x=x, b=b, note=note)
        return out
    kind, prof = mode.split("-")[0], mode.split("-")[1]
    if all((T, theta, M, mode, n) in DONE for n in NS):
        return out
    for n in NS:
        if (T, theta, M, mode, n) in DONE:
            continue
        removed = []
        if kind == "add":
            lo = i0 - n // 2
            if lo < 0 or lo + n > len(zs): continue
            xs = zs[lo:lo + n]
        elif kind == "rep2":
            lo = i0 - n
            if lo < 0 or lo + 2 * n > len(zs): continue
            removed = zs[lo:lo + 2 * n]
            xs = removed[0::2]
        elif kind == "row":
            kappa = float(mode.split("-")[2])
            d = 2 * math.pi / (kappa * u)
            xs = [(j - (n - 1) / 2) * d for j in range(n)]
        pr = profile(n, prof == "taper")
        t1 = time.time()
        b, note = wil.threshold(lambda b: dev.test([(x, b * w) for x, w in zip(xs, pr)], removed), LO, CAP, steps=9)
        emit(n=n, b=b, note=note, sec=round(time.time() - t1, 1))
    return out
if __name__ == "__main__":
    Ts = [float(x) for x in sys.argv[1].split(",")]
    cells = []
    for T in Ts:
        for theta, M in ((0.5, 0.0), (0.5, 1.0), (1.0, 1.0), (2.0, 1.0)):
            if theta not in THETAS:
                continue
            for mode in MODES:
                if ONLY and ("%g:%s" % (theta, mode)) not in ONLY.split(','):
                    continue
                cells.append((T, theta, M, mode))
    cells.sort(key=lambda c: -c[1])
    with Pool(int(os.environ.get("RH_WORKERS", "2"))) as pool:
        res = pool.map(task, cells, chunksize=1)
    json.dump([r for rr in res for r in rr], open(os.path.join(HERE, "out_testB_%s%s.json" % (sys.argv[1].replace(",", "_"), os.environ.get("WIL_TAG", ""))), "w"))
    print("done", flush=True)
