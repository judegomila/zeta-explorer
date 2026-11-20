"""Referee recomputation, server job 2 (staged, faster): zeros on the line of L(s,chi) (chi mod 5, chi(2)=i) and of
Davenport-Heilbronn, from four Hurwitz zeta values per point; grid step H, hidden pairs by parabola + one evaluation.
Stages in T; a JSON is written after each stage. Planned memory: 2 * TMAX/H float64 (TMAX=3e4, H=0.03: 16 MB)."""
import sys, os, json, math, cmath, time
from multiprocessing import Pool
import numpy as np
OUT = sys.argv[1]; H = float(sys.argv[2]); STAGES = [float(x) for x in sys.argv[3:]]; NW = int(os.environ.get("RH_WORKERS", "8"))
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1); C1 = (1 - 1j * KAPPA) / 2; C2 = (1 + 1j * KAPPA) / 2
CHI = [1, 1j, -1j, -1]; L5 = math.log(5.0)
def raw(t):
    """(e^{i phi(t)} L(1/2+it, chi), e^{i phi(t)} DH(1/2+it)), phi the gamma-factor phase of an odd character mod 5."""
    from flint import acb, fmpq, ctx
    ctx.prec = 64
    s = acb(0.5, t); h = [complex(s.zeta(acb(fmpq(k, 5)))) for k in (1, 2, 3, 4)]
    f = cmath.exp(-complex(0.5, t) * L5); Lc = f * sum(CHI[k] * h[k] for k in range(4)); Lb = f * sum(CHI[k].conjugate() * h[k] for k in range(4)) if False else f * sum(complex(CHI[k]).conjugate() * h[k] for k in range(4))
    phi = 0.5 * t * math.log(5 / math.pi) + float(acb(0.75, t / 2).lgamma().imag.mid()); e = cmath.exp(1j * phi)
    return e * Lc, e * (C1 * Lc + C2 * Lb)
def init(w0, w1):
    global W0, W1
    W0, W1 = w0, w1
def vals(t):
    a, b = raw(t); a *= W0; b *= W1
    return a.real, b.real, abs(a.imag), abs(b.imag)
def grid_chunk(args):
    i0, i1 = args; return i0, [vals(i * H) for i in range(i0, i1)]
def refine(args):
    """Bracketed secant (Illinois) with a bisection fallback; returns the last iterate, not the bracket midpoint."""
    a, b, kind = args; f = lambda t: vals(t)[kind]; fa, fb = f(a), f(b); c = 0.5 * (a + b); side = 0
    if fa == 0: return a
    if fb == 0: return b
    for it in range(80):
        cn = (a * fb - b * fa) / (fb - fa) if it % 8 != 7 else 0.5 * (a + b)
        if not (min(a, b) < cn < max(a, b)): cn = 0.5 * (a + b)
        fc = f(cn); step = abs(cn - c); c = cn
        if fc == 0 or step < 2e-11 or abs(b - a) < 2e-11: break
        if (fc > 0) == (fb > 0):
            b, fb = c, fc
            if side == -1: fa *= 0.5
            side = -1
        else:
            a, fa = c, fc
            if side == 1: fb *= 0.5
            side = 1
    return c
def vertex_eval(args):
    t, kind = args; return vals(t)[kind]
def hill(g, cut=0.2):
    s = g[(g > 0) & (g < cut)]
    if len(s) < 5: return None, int(len(s))
    return float(len(s) / np.sum(np.log(cut / s))), int(len(s))
def local_norm(z, w=2001):
    gp = np.diff(z); n = len(gp); hw = w // 2; cs = np.concatenate([[0.0], np.cumsum(gp)]); i = np.arange(n)
    lo = np.maximum(0, i - hw); hi = np.minimum(n, i + hw + 1); return gp / ((cs[hi] - cs[lo]) / (hi - lo))
if __name__ == "__main__":
    t00 = time.time(); a, b = raw(20.3); w0 = cmath.exp(-1j * (cmath.phase(a) % math.pi)); w1 = cmath.exp(-1j * (cmath.phase(b) % math.pi))
    R = {"H": H, "stages": STAGES, "workers": NW, "phase constants": [cmath.phase(w0), cmath.phase(w1)]}
    NG = int(STAGES[-1] / H) + 1; print("planned grid memory MB", 2 * NG * 8 / 1e6, flush=True)
    F = [np.zeros(NG), np.zeros(NG)]; imres = [0.0, 0.0]; done = 1; zeros = [[], []]; CH = 1000
    with Pool(NW, initializer=init, initargs=(w0, w1)) as pool:
        for TM in STAGES:
            n1 = int(TM / H) + 1
            for i0, v in pool.imap_unordered(grid_chunk, [(i, min(n1, i + CH)) for i in range(done, n1, CH)]):
                v = np.array(v); F[0][i0:i0 + len(v)] = v[:, 0]; F[1][i0:i0 + len(v)] = v[:, 1]; imres[0] = max(imres[0], float((v[:, 2] / (np.abs(v[:, 0]) + v[:, 2] + 1e-300)).max() if False else v[:, 2].max())); imres[1] = max(imres[1], float(v[:, 3].max()))
            for kind in (0, 1):
                f = F[kind]; lo = max(done - 1, 1)
                idx = np.nonzero(np.sign(f[lo:n1 - 1]) * np.sign(f[lo + 1:n1]) < 0)[0] + lo
                br = [(i * H, (i + 1) * H, kind) for i in idx]
                # hidden pairs: interior local minimum of abs f with no sign change; parabola vertex has the other sign
                i = np.arange(max(lo, 2), n1 - 1); fm, f0, fp = f[i - 1], f[i], f[i + 1]
                cand = (np.sign(fm) == np.sign(f0)) & (np.sign(fp) == np.sign(f0)) & (np.abs(f0) <= np.abs(fm)) & (np.abs(f0) <= np.abs(fp))
                den = fp - 2 * f0 + fm; ok = cand & (den != 0); ii = i[ok]; x = -(fp[ok] - fm[ok]) / (2 * den[ok]); mval = f0[ok] - (fp[ok] - fm[ok]) ** 2 / (8 * den[ok])
                sel = (np.sign(mval) != np.sign(f0[ok])) & (np.abs(x) <= 1); tv = (ii[sel] + x[sel]) * H
                fv = pool.map(vertex_eval, [(t, kind) for t in tv], chunksize=50) if len(tv) else []
                nh = 0
                for t, v, j in zip(tv, fv, ii[sel]):
                    if v != 0 and (v > 0) != (f[j] > 0):
                        left = (j - 1) * H if t <= j * H else j * H; right = (j + 1) * H if t >= j * H else j * H
                        br.append((left, t, kind)); br.append((t, right, kind)); nh += 1
                zs = pool.map(refine, br, chunksize=100) if br else []
                zeros[kind].extend(zs); zeros[kind].sort(); R.setdefault("hidden pairs found", {})["%s to %g" % (("LCHI", "DH")[kind], TM)] = nh
            done = n1
            st = {"seconds": time.time() - t00, "max abs imaginary residual (LCHI, DH)": imres[:]}
            for kind, name in ((0, "LCHI"), (1, "DH")):
                z = np.array(zeros[kind]); np.save(OUT.replace(".json", "_zeros_%s.npy" % name), z)
                rvm = lambda T: T / (2 * math.pi) * math.log(5 * T / (2 * math.pi * math.e))
                d = {"n_zeros": int(len(z)), "first": [float(x) for x in z[:4]], "min gap": float(np.diff(z).min())}
                for T in (418, 2000, 3000, 10000, 20000, 30000):
                    if T <= TM: d["count below %d (Riemann-von Mangoldt main term %.1f)" % (T, rvm(T))] = int((z < T).sum())
                d["count in [10,2000)"] = int(((z >= 10) & (z < 2000)).sum()) if TM >= 2000 else None
                gn = local_norm(z)
                for nz in (3000, 10000, 30000, len(z)):
                    if nz <= len(z):
                        k, m = hill(gn[:nz - 1]); d["hill first %d zeros" % nz] = {"k": k, "n_small": m, "se": (k / math.sqrt(m) if k else None)}
                d["n normalised gaps below 0.025 / 0.05 / 0.2"] = [int((gn < 0.025).sum()), int((gn < 0.05).sum()), int((gn < 0.2).sum())]
                g0 = gn - gn.mean(); d["C1 gap autocorrelation"] = float((g0[1:] * g0[:-1]).mean() / (g0 * g0).mean())
                st[name] = d
            R["stage T<=%g" % TM] = st; json.dump(R, open(OUT, "w"), indent=1); print("stage", TM, time.time() - t00, flush=True)
    print(json.dumps(R, indent=1))
