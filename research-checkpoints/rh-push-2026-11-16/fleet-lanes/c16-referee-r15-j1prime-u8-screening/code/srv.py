"""Referee recomputation (c16-referee-r15-j1prime-u8-screening), server job. Own code; python-flint + mpmath.
A: zeros on the line of L(s,chi) (chi mod 5, chi(2)=i) and of Davenport-Heilbronn up to TMAX, grid step H.
B: sample variance / 4th central moment of arg zeta(1+it), t uniform in [2e6,4e6] and [2e8,4e8].
C: Gram bad rate for zeta in [5e3,1e4] (all Gram points) and [5e5,1e6] (10000 random Gram points).
Planned memory: grid arrays 2 * TMAX/H float64 = 2*3e6*8 B = 48 MB; nothing else large."""
import sys, os, json, math, cmath, time, random
from multiprocessing import Pool
OUT = sys.argv[1]; TMAX = float(sys.argv[2]); H = float(sys.argv[3]); NW = int(os.environ.get("RH_WORKERS", "8"))
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)

def _chars():
    from flint import dirichlet_char, ctx
    ctx.prec = 64
    return dirichlet_char(5, 2), dirichlet_char(5, 3)

def zpair(t):
    from flint import acb
    global _C
    try: _C
    except NameError: _C = _chars()
    return float(_C[0].hardy_z(acb(t)).real.mid()), float(_C[1].hardy_z(acb(t)).real.mid())

def grid_chunk(args):
    i0, i1 = args
    return i0, [zpair(i * H) for i in range(i0, i1)]

def refine(args):
    a, b, kind, sg = args
    f = (lambda t: zpair(t)[0]) if kind == 0 else (lambda t: (lambda z: z[0] + sg * z[1])(zpair(t)))
    fa, fb = f(a), f(b)
    for _ in range(40):                      # Illinois
        if b - a < 1e-10: break
        c = (a * fb - b * fa) / (fb - fa); fc = f(c)
        if fc == 0: a = b = c; break
        if (fc > 0) == (fb > 0): b, fb = c, fc; fa *= 0.5
        else: a, fa = b, fb; b, fb = c, fc
        if a > b: a, b, fa, fb = b, a, fb, fa
    return 0.5 * (a + b)

def argz(t):
    from flint import acb, ctx
    ctx.prec = 64
    z = acb(1, t).zeta(); return cmath.phase(complex(float(z.real.mid()), float(z.imag.mid())))

def gram_bad(n):
    import mpmath as mp
    mp.mp.dps = 20
    g = mp.grampoint(n); z = mp.siegelz(g)
    return 1 if ((-1) ** n) * z < 0 else 0

def hill(gaps_norm, cut=0.2):
    s = [x for x in gaps_norm if 0 < x < cut]
    if len(s) < 5: return None, len(s)
    k = len(s) / sum(math.log(cut / x) for x in s); return k, len(s)

def local_norm(z, w=2001):
    import numpy as np
    g = np.diff(np.asarray(z)); n = len(g); hw = w // 2
    cs = np.concatenate([[0.0], np.cumsum(g)]); out = np.empty(n)
    for i in range(n):
        lo = max(0, i - hw); hi = min(n, i + hw + 1); out[i] = g[i] / ((cs[hi] - cs[lo]) / (hi - lo))
    return out

if __name__ == "__main__":
    R = {"TMAX": TMAX, "H": H, "workers": NW}; t00 = time.time()
    with Pool(NW) as pool:
        # sign of the DH combination: compare with the direct value
        from flint import acb, dirichlet_char, ctx
        ctx.prec = 64
        c2, c3 = dirichlet_char(5, 2), dirichlet_char(5, 3); chk = []
        for t in (20.3, 57.1, 311.7):
            s = acb(0.5, t); D = (1 - 1j * KAPPA) / 2 * complex(c2.l(s)) + (1 + 1j * KAPPA) / 2 * complex(c3.l(s))
            a, b = zpair(t); chk.append((abs(D), abs((1 - 1j * KAPPA) / 2) * abs(a + b), abs((1 - 1j * KAPPA) / 2) * abs(a - b)))
        R["DH_vs_Zsum_check (absDH, c*abs(Z+Zb), c*abs(Z-Zb))"] = chk
        sg = 1.0 if sum(abs(x[0] - x[1]) for x in chk) < sum(abs(x[0] - x[2]) for x in chk) else -1.0
        R["DH_sign"] = sg
        # DH at its first off-line zero
        s = acb(0.808517, 85.699348); R["abs DH(0.808517+85.699348i)"] = abs((1 - 1j * KAPPA) / 2 * complex(c2.l(s)) + (1 + 1j * KAPPA) / 2 * complex(c3.l(s)))
        s = acb(0.5, 85.699348); R["abs DH(0.5+85.699348i)"] = abs((1 - 1j * KAPPA) / 2 * complex(c2.l(s)) + (1 + 1j * KAPPA) / 2 * complex(c3.l(s)))
        json.dump(R, open(OUT, "w"), indent=1)
        # B
        for (lo, hi, n, seed) in ((2e6, 4e6, 200000, 160001), (2e8, 4e8, 100000, 160002)):
            rng = random.Random(seed); ts = [rng.uniform(lo, hi) for _ in range(n)]
            a = pool.map(argz, ts, chunksize=500); m = sum(a) / n; v = sum((x - m) ** 2 for x in a) / n; m4 = sum((x - m) ** 4 for x in a) / n
            R["argzeta(1+it) t in [%g,%g] n=%d" % (lo, hi, n)] = {"mean": m, "var": v, "m4": m4, "se_var": math.sqrt((m4 - v * v) / n), "max_abs": max(abs(x) for x in a)}
            json.dump(R, open(OUT, "w"), indent=1); print("B", lo, time.time() - t00, flush=True)
        # C
        import mpmath as mp
        th = lambda t: float(mp.siegeltheta(t)) / math.pi
        n0, n1 = int(math.ceil(th(5e3))), int(math.floor(th(1e4))); ns = list(range(n0, n1 + 1))
        b = pool.map(gram_bad, ns, chunksize=50); R["gram bad rate zeta [5e3,1e4] all"] = {"n": len(ns), "bad": sum(b), "rate": sum(b) / len(ns)}
        n0, n1 = int(math.ceil(th(5e5))), int(math.floor(th(1e6))); rng = random.Random(160003); ns = [rng.randint(n0, n1) for _ in range(10000)]
        b = pool.map(gram_bad, ns, chunksize=50); R["gram bad rate zeta [5e5,1e6] 10000 random"] = {"n": len(ns), "bad": sum(b), "rate": sum(b) / len(ns)}
        json.dump(R, open(OUT, "w"), indent=1); print("C", time.time() - t00, flush=True)
        # A
        import numpy as np
        NG = int(TMAX / H) + 1; print("planned grid memory MB", 2 * NG * 8 / 1e6, flush=True)
        Z = np.empty(NG); Zb = np.empty(NG); CH = 2000
        for i0, vals in pool.imap_unordered(grid_chunk, [(i, min(NG, i + CH)) for i in range(1, NG, CH)]):
            v = np.array(vals); Z[i0:i0 + len(v)] = v[:, 0]; Zb[i0:i0 + len(v)] = v[:, 1]
        Z[0], Zb[0] = zpair(1e-9); print("grid", time.time() - t00, flush=True)
        res = {}
        for name, F, kind in (("LCHI", Z, 0), ("DH", Z + sg * Zb, 1)):
            idx = np.nonzero(np.sign(F[1:-1]) * np.sign(F[2:]) < 0)[0] + 1
            zs = pool.map(refine, [(i * H, (i + 1) * H, kind, sg) for i in idx], chunksize=200); zs = np.array(sorted(zs))
            np.save(OUT.replace(".json", "_zeros_%s.npy" % name), zs)
            d = {"n_zeros": int(len(zs)), "first": [float(x) for x in zs[:4]], "count_below_2000": int((zs < 2000).sum()), "count_10_2000": int(((zs >= 10) & (zs < 2000)).sum()),
                 "count_below_418": int((zs < 418).sum()), "count_below_3000": int((zs < 3000).sum())}
            gn = local_norm(zs)
            for nz in (3000, 10000, 30000, len(zs)):
                if nz <= len(zs):
                    k, m = hill(gn[:nz - 1]); d["hill_first_%d" % nz] = {"k": k, "n_small": m, "se": (k / math.sqrt(m) if k else None)}
            d["n_gaps_below_0.025"] = int((gn < 0.025).sum())
            g0 = gn - gn.mean(); d["C1_gap_autocorr"] = float((g0[1:] * g0[:-1]).mean() / (g0 * g0).mean())
            res[name] = d
        R["A"] = res; R["seconds"] = time.time() - t00
        json.dump(R, open(OUT, "w"), indent=1); print(json.dumps(R, indent=1))
