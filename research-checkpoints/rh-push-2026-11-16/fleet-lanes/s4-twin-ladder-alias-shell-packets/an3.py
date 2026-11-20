"""an3.py -- analysis of combination 3 (cluster correlations against the sharp cluster cap) and of the OU tail energy.
c3.pkl -> an3.json + an3.md"""
import json, math, pickle, sys
import numpy as np
import mpmath as mp
import s4lib as S

pre = sys.argv[1] if len(sys.argv) > 1 else "c3"
import glob
fs = sorted(glob.glob(pre + "_p*.pkl")) or [pre + ".pkl"]
R = pickle.load(open(fs[0], "rb"))
for f_ in fs[1:]:
    R2 = pickle.load(open(f_, "rb")); R["P"] += R2["P"]; R["I"] += R2["I"]; R["sec"] += R2["sec"]
GEOM = R["GEOM"]; MU = np.array(R["MU"]); GEOMB = R["GEOMB"]; MUB = np.array(R["MUB"])
bmax = R["args"]["bmax"]; bint = R["args"]["bint"]
LOGEDGES = [3, 8, 55, 2981, 8886111]
out = {}; md = []


def lens(geom, lo, hi):
    return np.array([math.log(hi / lo) if g == 1 else float(hi - lo) for g in geom])


def merge(chunks, geom, mu, lo, hi):
    cs = [c for c in chunks if c["lo"] >= lo and c["hi"] <= hi]; cs.sort(key=lambda c: c["lo"])
    assert cs and cs[0]["lo"] == lo and cs[-1]["hi"] == hi, (lo, hi)
    G = {k: v.copy() for k, v in cs[0]["G"].items()}; cur = cs[0]["hi"]
    for c in cs[1:]:
        assert c["lo"] == cur
        G = S.stitch(G, c["G"], lens(geom, lo, cur), lens(geom, c["lo"], c["hi"]), mu); cur = c["hi"]
    return G


def ratio_to_cap(A, B, Dgap, mu):
    """|<F_A,F_B>| / (||F_A|| ||F_B||) divided by the cap (1 + mu D) exp(-mu D); the factor exp(-mu D) is cancelled analytically"""
    m = mu[:, None]; d = Dgap[:, None]
    num = np.abs(A["cup"] * np.conj(B["cdn"]) * (1 / m + d) + A["c1up"] * np.conj(B["cdn"]) + A["cup"] * np.conj(B["c1dn"]))
    den = np.sqrt(np.maximum(A["Q"], 0) * np.maximum(B["Q"], 0)) * (1 + m * d)
    return num / np.where(den > 0, den, np.inf)


def shift_edges(G, mu, dlo, dup):
    """move the lower reference edge down by dlo and the upper reference edge up by dup (arrays over cfg)"""
    fl = np.exp(-mu * dlo)[:, None]; fu = np.exp(-mu * dup)[:, None]
    return dict(Q=G["Q"], cup=G["cup"] * fu, c1up=(G["c1up"] + dup[:, None] * G["cup"]) * fu, cdn=G["cdn"] * fl, c1dn=(G["c1dn"] + dlo[:, None] * G["cdn"]) * fl)


def lin_family(chunks, geom, mu, cfgs, top, names, title):
    B = {b: merge(chunks, geom, mu, 1 << b, 1 << (b + 1)) for b in range(1, top)}
    res = {}; K = top - 1
    full = np.zeros((len(geom), len(names), K, K))
    for b in range(1, top):
        for c in range(b + 1, top):
            D = np.full(len(geom), float((1 << c) - (1 << (b + 1)))); r = ratio_to_cap(B[b], B[c], D, mu)
            cap = ((1 + mu * D) * np.exp(-mu * D))[:, None]; full[:, :, b - 1, c - 1] = full[:, :, c - 1, b - 1] = r * cap
    for ci in cfgs:
        res[ci] = {}
        for oi, nm in enumerate(names):
            r2 = []; r1 = []
            for b in range(1, top - 2):
                D = np.full(len(geom), float(1 << (b + 1)))
                r2.append(float(ratio_to_cap(B[b], B[b + 2], D, mu)[ci, oi]))
            for b in range(1, top - 1):
                r1.append(float(ratio_to_cap(B[b], B[b + 1], np.zeros(len(geom)), mu)[ci, oi]))
            r2 = np.array(r2); r1 = np.array(r1); ex = np.nonzero(r2 > 1 + 1e-12)[0]
            # block Gram of absolute correlations over all blocks (upper bound for lambda_max of the true Gram)
            Gm = np.eye(K) + full[ci, oi]; ev = np.linalg.eigvalsh(Gm)
            res[ci][nm] = dict(max_ratio_same_parity=float(r2.max()), argmax_b=int(1 + r2.argmax()), first_block_exceeding=(int(1 + ex[0]) if len(ex) else None),
                               n_exceeding=int(len(ex)), max_adjacent_corr=float(r1.max()), max_adjacent_corr_b_ge_10=float(r1[9:].max()) if len(r1) > 9 else None,
                               max_ratio_b_ge_10=float(r2[9:].max()) if len(r2) > 9 else None, lam_max_block_gram=float(ev[-1]), lam_min_block_gram=float(ev[0]),
                               ratios_last6=[float(v) for v in r2[-6:]], adjacent_last6=[float(v) for v in r1[-6:]])
    md.append("\n**%s** Blocks [2^b, 2^(b+1)), b = 1..%d; same-parity pairs (b, b+2), gap D = 2^(b+1); R = corr / cap, cap = (1 + mu D) exp(-mu D). rho*(K) = 1/(2 cos(pi/(K+1))) = %.6f for K = %d blocks.\n" % (title, top - 1, 1 / (2 * math.cos(math.pi / top)), top - 1))
    md.append("| geometry, mu | object | max R over b | at b | max R, b >= 10 | first b with R > 1 | number of b with R > 1 | max adjacent corr (gap 0) | same, b >= 10 | lambda_max of abs block Gram |\n|---|---|---|---|---|---|---|---|---|---|")
    for ci in cfgs:
        for nm in names:
            v = res[ci][nm]
            md.append("| %s, %.7g | %s | %.6g | %d | %.4g | %s | %d | %.4g | %.3g | %.6f |" % (["LIN", "LOG", "LIN jittered"][geom[ci]], mu[ci], nm, v["max_ratio_same_parity"], v["argmax_b"], v["max_ratio_b_ge_10"] or 0, v["first_block_exceeding"], v["n_exceeding"], v["max_adjacent_corr"], v["max_adjacent_corr_b_ge_10"] or 0, v["lam_max_block_gram"]))
    return res, B


def log_family(chunks, geom, mu, cfgs, N, names, title):
    edges = [e for e in LOGEDGES if e < N] + [N]; res = {}
    blocks = {}
    for b in range(len(edges) - 1):
        lo, hi = edges[b], edges[b + 1]; G = merge(chunks, geom, mu, lo, hi)
        dlo = np.full(len(geom), math.log(lo) - 2.0 ** b); dup = np.full(len(geom), (2.0 ** (b + 1) - math.log(hi)) if hi != N else 0.0)
        blocks[b] = shift_edges(G, mu, dlo, dup)
    nb = len(blocks); trunc = nb - 1
    md.append("\n**%s** Positions u = log n, blocks 2^b <= u < 2^(b+1), b = 0..%d (block %d truncated at n = %d, u = %.3f, its upper edge is the truncation point).\n" % (title, nb - 1, trunc, N, math.log(N)))
    md.append("| mu | object | " + " | ".join("corr(%d,%d) / cap" % (b, c) for b in range(nb) for c in range(b + 2, nb, 2)) + " | adjacent corr | lambda_max of block Gram |\n|---|---|" + "---|" * (sum(1 for b in range(nb) for c in range(b + 2, nb, 2)) + 2))
    for ci in cfgs:
        res[ci] = {}
        for oi, nm in enumerate(names):
            cells = []; Gm = np.eye(nb)
            for b in range(nb):
                for c in range(b + 1, nb):
                    D = np.full(len(geom), 2.0 ** c - 2.0 ** (b + 1)); r = float(ratio_to_cap(blocks[b], blocks[c], D, mu)[ci, oi])
                    cap = (1 + mu[ci] * D[0]) * math.exp(-mu[ci] * D[0]); Gm[b, c] = Gm[c, b] = r * cap
                    if (c - b) % 2 == 0: cells.append((b, c, r * cap, cap))
            ev = np.linalg.eigvalsh(Gm)
            res[ci][nm] = dict(pairs=[dict(b=b, c=c, corr=co, cap=cap, ratio=co / cap) for b, c, co, cap in cells], adjacent=[float(Gm[b, b + 1]) for b in range(nb - 1)], lam_max=float(ev[-1]))
            md.append("| %.7g | %s | " % (mu[ci], nm) + " | ".join("%.4g / %.4g" % (co, cap) for b, c, co, cap in cells) + " | " + ", ".join("%.3g" % Gm[b, b + 1] for b in range(nb - 1)) + " | %.4f |" % ev[-1])
    return res


names = S.OBJ
lin_cfg = [i for i, g in enumerate(GEOM) if g in (0, 2)]; log_cfg = [i for i, g in enumerate(GEOM) if g == 1]
out["LIN_primes"], BL = lin_family(R["P"], GEOM, MU, lin_cfg, bmax, names, "Prime packets, amplitude Lambda_F(p) = eps_F(p) log p, all primes of each block (%d packets)." % sum(c["npk"] for c in R["P"]))
out["LOG_primes"] = log_family(R["P"], GEOM, MU, log_cfg, 1 << bmax, names, "Prime packets, logarithmic positions.")
lin_cfgB = [i for i, g in enumerate(GEOMB) if g == 0]; log_cfgB = [i for i, g in enumerate(GEOMB) if g == 1]
out["LIN_integers"], _ = lin_family(R["I"], GEOMB, MUB, lin_cfgB, bint, S.OBJB, "Integer packets, amplitude a_F(n) (INT1: 1; CHI5INT: chi_5(n); DHINT: Davenport-Heilbronn coefficients), every integer.")
out["LOG_integers"] = log_family(R["I"], GEOMB, MUB, log_cfgB, 1 << bint, S.OBJB, "Integer packets, logarithmic positions.")

# ---- edge clusters of K packets (the K primes nearest the facing edges), linear positions, mu = 0.2320723
firsts = {c["lo"]: c["first"] for c in R["P"]}; lasts = {c["hi"]: c["last"] for c in R["P"]}
mu0 = float(MU[0]); KS = [1, 2, 4, 8, 16, 32, 64]; edge = {}


def amp(o, n):
    return math.log(n) * S.eps_obj(o, int(n))


def edge_ratio(o, pa, pb, U, V, mu=mu0, jit=False, prec=False):
    """cluster A: packets pa (below U), cluster B: packets pb (at or above V).  corr / cap with exp(-mu D) cancelled."""
    def pos(n):
        n = int(n); return n + (0.9 * (S.uni(n, S.SEED + 999) - 0.5) if (jit and n > 3) else 0.0)
    if prec:
        f = mp.mpf; al = [f(U) - f(pos(n)) for n in pa]; be = [f(pos(n)) - f(V) for n in pb]; a = [mp.mpmathify(amp(o, n)) for n in pa]; b = [mp.mpmathify(amp(o, n)) for n in pb]; m = f(mu); Dg = f(V - U)
        num = sum(a[i] * mp.conj(b[j]) * mp.e ** (-m * (al[i] + be[j])) * (1 / m + Dg + al[i] + be[j]) for i in range(len(a)) for j in range(len(b)))
        na = sum(a[i] * mp.conj(a[j]) * (1 / m + abs(al[i] - al[j])) * mp.e ** (-m * abs(al[i] - al[j])) for i in range(len(a)) for j in range(len(a)))
        nb_ = sum(b[i] * mp.conj(b[j]) * (1 / m + abs(be[i] - be[j])) * mp.e ** (-m * abs(be[i] - be[j])) for i in range(len(b)) for j in range(len(b)))
        return float(abs(num) / (mp.sqrt(mp.re(na) * mp.re(nb_)) * (1 + m * Dg)))
    al = np.array([U - pos(n) for n in pa]); be = np.array([pos(n) - V for n in pb]); a = np.array([amp(o, n) for n in pa], dtype=complex); b = np.array([amp(o, n) for n in pb], dtype=complex)
    Dg = float(V - U); s = al[:, None] + be[None, :]
    num = abs((a[:, None] * np.conj(b[None, :]) * np.exp(-mu * s) * (1 / mu + Dg + s)).sum())
    da = np.abs(al[:, None] - al[None, :]); db = np.abs(be[:, None] - be[None, :])
    na = (a[:, None] * np.conj(a[None, :]) * (1 / mu + da) * np.exp(-mu * da)).sum().real; nb_ = (b[:, None] * np.conj(b[None, :]) * (1 / mu + db) * np.exp(-mu * db)).sum().real
    return num / (math.sqrt(max(na, 0) * max(nb_, 0)) * (1 + mu * Dg)) if na > 0 and nb_ > 0 else float("nan")


md.append("\n**Edge clusters: the K primes nearest below U = 2^(b+1) against the K primes nearest above V = 2^(b+2), b = 1..%d, linear positions, mu = %.7g.** Entry: max over b of R = corr / cap, and the first b with R > 1 (in brackets, with the number of such b). The worst case of each object is recomputed at 40 digits.\n" % (bmax - 3, mu0))
md.append("| object | " + " | ".join("K = %d" % K for K in KS) + " | 40-digit value of the largest R |\n|---|" + "---|" * (len(KS) + 1))
mp.mp.dps = 40
for o, nm in list(enumerate(names)) + [(0, "ZETA jittered")]:
    jit = nm.endswith("jittered"); cells = []; worst = (0, None)
    for K in KS:
        rs = []
        for b in range(1, bmax - 2):
            U = 1 << (b + 1); V = 1 << (b + 2)
            if U not in lasts or V not in firsts: continue
            pa = lasts[U][-K:]; pb = firsts[V][:K]
            pa = [n for n in pa if n >= (1 << b)]; pb = [n for n in pb if n < (1 << (b + 3))]
            r = edge_ratio(o, pa, pb, U, V, jit=jit); rs.append((b, r))
            if r == r and r > worst[0]: worst = (r, (K, b, pa, pb, U, V))
        ex = [b for b, r in rs if r > 1 + 1e-12]
        cells.append("%.5g (%s; %d)" % (max(r for b, r in rs if r == r), ex[0] if ex else "none", len(ex)))
        edge["%s/K=%d" % (nm, K)] = dict(max=max(r for b, r in rs if r == r), first=ex[0] if ex else None, n=len(ex), rs=rs)
    K, b, pa, pb, U, V = worst[1]; hp = edge_ratio(o, pa, pb, U, V, jit=jit, prec=True)
    edge["%s/worst" % nm] = dict(K=K, b=b, float64=worst[0], mp40=hp)
    md.append("| %s | " % nm + " | ".join(cells) + " | %.12g (K = %d, b = %d; float64 %.12g) |" % (hp, K, b, worst[0]))
# tuned signed pair: amplitudes (-exp(-mu gap), 1) on the two primes nearest each facing edge cancel the far-side tail of each cluster
tr = []
for b in range(1, bmax - 2):
    U = 1 << (b + 1); V = 1 << (b + 2)
    if U not in lasts or V not in firsts or len(lasts[U]) < 2 or len(firsts[V]) < 2: continue
    pa = [float(n) for n in lasts[U][-2:]]; pb = [float(n) for n in firsts[V][:2]]
    a = np.array([-math.exp(-mu0 * (pa[1] - pa[0])), 1.0]); bb = np.array([1.0, -math.exp(-mu0 * (pb[1] - pb[0]))])
    al = np.array([U - n for n in pa]); be = np.array([n - V for n in pb]); Dg = float(V - U); s_ = al[:, None] + be[None, :]
    num = abs((a[:, None] * bb[None, :] * np.exp(-mu0 * s_) * (1 / mu0 + Dg + s_)).sum())
    da = np.abs(al[:, None] - al[None, :]); db = np.abs(be[:, None] - be[None, :])
    na = (a[:, None] * a[None, :] * (1 / mu0 + da) * np.exp(-mu0 * da)).sum(); nb_ = (bb[:, None] * bb[None, :] * (1 / mu0 + db) * np.exp(-mu0 * db)).sum()
    tr.append((b, num / (math.sqrt(na * nb_) * (1 + mu0 * Dg))))
ex = [b for b, r in tr if r > 1]
edge["TUNED"] = dict(rs=tr, first=ex[0] if ex else None, n=len(ex), max=max(r for b, r in tr))
md.append("\nTuned signed pair (amplitudes -exp(-mu gap), 1 on the two primes nearest each facing edge; not an arithmetic object): R > 1 from b = %s on, in %d of %d blocks, max R = %.6g, limit 2 mu D/(1 + mu D) -> 2. R by block: %s\n" % (ex[0] if ex else None, len(ex), len(tr), edge["TUNED"]["max"], ", ".join("%d: %.4g" % t for t in tr[:8])))
out["edge"] = edge

# ---- OU tail energy  V = int_1^Q v^(2x-1) |sum_{v <= p <= Q} a_p p^(-x-iT)|^2 x dv,  D = (1/2) sum |a_p|^2 (1 - p^(-2x))
XS = R["XS"]; TS = R["TS"]; ch = sorted(R["P"], key=lambda c: c["lo"]); Vres = {}
md.append("\n**OU tail energy (covariance K_T summed with a_p = eps_F(p)(1 - p^(-1/8)) p^(-417/500), first-prime taps), ratio V_F(T)/D_F.**\n")
md.append("| Q | x | T | " + " | ".join(names) + " |\n|---|---|---|" + "---|" * len(names))
for Qb in [b for b in (20, 24, 28, 32, 36, bmax) if b <= bmax]:
    Q = 1 << Qb; cs = [c for c in ch if c["hi"] <= Q]
    V = np.zeros((len(XS), len(TS), 7)); Rr = np.zeros((len(XS), len(TS), 7), dtype=complex); Dd = np.zeros((len(XS), 7))
    for c in reversed(cs):
        Ct = c["V"][..., 0] + 1j * c["V"][..., 1]; A1 = c["V"][..., 2] + 1j * c["V"][..., 3]; A2 = c["V"][..., 4]
        tot = Ct + Rr; V += (np.abs(tot) ** 2) * c["A0"][:, None, None] - 2 * (np.conj(tot) * A1).real + A2; Rr = tot
    for c in cs: Dd += c["D"]
    for ix, x in enumerate(XS): V[ix] += (2 ** (2 * x) - 1) / 2 * np.abs(Rr[ix]) ** 2
    rat = V / Dd[:, None, :]; Vres[Qb] = rat.tolist()
    for ix, x in enumerate(XS):
        for it, T in enumerate(TS):
            md.append("| 2^%d | %g | %g | " % (Qb, x, T) + " | ".join("%.4g" % v for v in rat[ix, it]) + " |")
out["OU"] = dict(XS=XS, TS=TS, ratio=Vres)
out["sec"] = R["sec"]; out["packets"] = int(sum(c["npk"] for c in R["P"]))
json.dump(out, open("an3.json", "w"), indent=1, default=float); open("an3.md", "w").write("\n".join(md) + "\n"); print("\n".join(md))
