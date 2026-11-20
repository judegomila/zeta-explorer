#!/usr/bin/env python3
"""Screening analysis for s1-primon-kinetic-truncation.  usage: analyze.py <t1|t2|t3|t4> <out.bin> <pts.json> <Sprimes.txt> <result.json>"""
import sys, json, numpy as np, mpmath as mp
from lib import *
from points import ALPHA, EA_A, BETAS, NUS, XS, YS, AS, OMS
mp.mp.dps = 30
SEED = 12345; THIN_B = 0.75
CTLS = ["zeta", "chi4", "chi3", "NR", "U", "lio", "rnd", "rnd2", "thin", "del", "EA"]
CLS = dict(lio=0, rnd=2, rnd2=5, thin=3, chi4=1, chi3=4)

def tg(base, key, var=""):
    """tag name: var in '', 'U', 'EA+', 'EA-'; for base T4+/T4- the sign follows the variant letters"""
    if base in ("T4+", "T4-") and var:
        return f"T4{var[:2] if var.startswith('EA') else var}{base[2]}{var[2:] if var.startswith('EA') else ''}:{key}"
    return f"{base}{var}:{key}"
def side(R, kind, base, key, ctl):
    """prime side of control ctl: array over checkpoints. kind in F,K,C0,C1,LG"""
    g = lambda tag, I=None: getattr(R, kind)(tag, I)
    t = f"{base}:{key}"
    if ctl in ("zeta", "NR"): return g(t)
    if ctl in ("lio", "rnd", "rnd2", "thin"): return g(t, CLS[ctl])
    if ctl == "del":  # primes outside S only
        q = dict(F=2, K=4, C0=0, C1=1, LG=6)[kind]; v = R.q(t, 0, q) - R.q(t, 3, q); return v.real if kind == "LG" else v
    if ctl in ("chi4", "chi3"):
        p0 = 2 if ctl == "chi4" else 3; v = g(t, CLS[ctl]).copy(); s = R.s(t)
        v[R.P >= p0] -= local(p0, s)[kind]; return v
    if ctl == "U": return g(tg(base, key, "U"))
    if ctl == "EA": return g(tg(base, key, "EA+")) + g(tg(base, key, "EA-"))
    raise KeyError(ctl)

def cpts(R, base, key, ctl):
    """complex evaluation points of the control (list): zeta-type sums are evaluated there"""
    if ctl == "U": return [R.s(tg(base, key, "U"))]
    if ctl == "EA": return [R.s(tg(base, key, "EA+")), R.s(tg(base, key, "EA-"))]
    return [R.s(f"{base}:{key}")]
# density coefficients: c1 = coefficient of the PNT main term of the eps-weighted prime-only sum; ch = coefficient of its sqrt term
C1 = dict(zeta=1, NR=1, U=1, EA=1, lio=-1, rnd=0, rnd2=0, thin=1, chi4=0, chi3=0); C1["del"] = 1
CH = dict(zeta=1, NR=1, U=1, EA=1, lio=-1, rnd=0, rnd2=0, thin=1, chi4=1, chi3=1); CH["del"] = 1

def Mf(P, s):      # main term of sum_{n<=P} Lambda(n) n^{-s} for s != 1: P^{1-s}/(1-s)
    return P ** (1 - s) / (1 - s)
def T2f(Y, s):     # int_Y^inf t^{-2s} dt
    return Y ** (1 - 2 * s) / (2 * s - 1)
def Mk(P, s):      # P^z (log P/z - 1/z^2) + 1/z^2, z = 1-s; regular at s=1 (-> log^2 P/2)
    z = 1 - s; lp = np.log(P)
    if abs(z) < 1e-6: return lp ** 2 / 2 + z * lp ** 3 / 3
    return P ** z * (lp / z - 1 / z ** 2) + 1 / z ** 2
def T2k(Y, s):     # int_Y^inf 2 log t t^{-2s} dt
    u = 2 * s - 1; return 2 * Y ** (-u) * (np.log(Y) / u + 1 / u ** 2)

def fit_slope(x, y):
    x = np.asarray(x); y = np.asarray(y); A = np.vstack([x, np.ones_like(x)]).T; c, res, *_ = np.linalg.lstsq(A, y, rcond=None)
    yy = A @ c; r2 = 1 - ((y - yy) ** 2).sum() / max(1e-300, ((y - y.mean()) ** 2).sum()); return float(c[0]), float(r2)

def decade_env(P, v, lo, hi):
    """max |v| per decade [10^k,10^(k+1)) between lo and hi; returns (centres, maxima)"""
    xs, ys = [], []
    k = int(round(np.log10(lo)))
    while 10 ** (k + 1) <= hi * 1.0001:
        m = (P >= 10 ** k * 0.9999) & (P < 10 ** (k + 1) * 0.9999)
        if m.any(): xs.append(k + 0.5); ys.append(float(np.max(np.abs(v[m]))))
        k += 1
    return xs, ys

# ------------------------------------------------------------------ test 1
def t1(R):
    out = {"P": R.P.tolist()}; P = R.P; g = mp.euler; c0 = float(g ** 2 + 2 * mp.stieltjes(1)); out["c0"] = c0
    K1 = R.K("T1:1.0").real
    out["offset"] = {("%g" % p): float(k - np.log(p) ** 2 / 2) for p, k in zip(P, K1) if abs(np.log10(p) - round(np.log10(p))) < 1e-9}
    rows = {}
    for ctl in CTLS:
        rows[ctl] = {}
        for b in BETAS:
            K = side(R, "K", "T1", b, ctl); pts = cpts(R, "T1", b, ctl)
            main = sum(C1[ctl] * np.array([Mk(p, s) for p in P]) + CH[ctl] * np.array([T2k(np.sqrt(p), s) for p in P]) - np.array([T2k(p, s) for p in P]) for s in pts)
            if ctl in ("rnd", "rnd2"): main = main - main  # no model
            r = K - main          # converges to the regular part of (log F)'' at the point if F has a zero-free half-plane right of 1/2
            lim = None
            if ctl == "zeta": lim = c0 * -1 if b == 1.0 else float(zlog2(b) - 1 / mp.mpf(b - 1) ** 2)
            if ctl == "chi4": lim = complex(L4log2(b))
            if ctl == "U": s = pts[0]; lim = complex(zlog2(s) - 1 / (mp.mpmathify(s) - 1) ** 2)
            if ctl == "EA": lim = complex(sum(zlog2(s) - 1 / (mp.mpmathify(s) - 1) ** 2 for s in pts))
            if ctl == "lio": lim = complex(4 * zlog2(2 * b) - ((-c0) if b == 1.0 else (zlog2(b) - 1 / mp.mpf(b - 1) ** 2)))
            if ctl == "NR": lim = (-c0 if b == 1.0 else float(zlog2(b) - 1 / mp.mpf(b - 1) ** 2))   # the NR factor adds the same constant to both sides
            # limit-free statistic: Delta(P) = r(10^(1/4) P) - r(P)
            h = 3; D = r[h:] - r[:-h]; Pd = P[:-h]
            E = np.abs(D) * Pd ** (b - 0.5) / np.log(Pd)
            xs, ys = decade_env(Pd, D, 1e4, P[-1])
            sl, r2 = fit_slope(np.array(xs) * np.log(10), np.log(ys)) if len(xs) > 2 else (float("nan"), 0)
            row = dict(theta_eff=sl + b, r2=r2, Enorm_decades={("1e%d" % int(x)): float(np.max(E[(Pd >= 10 ** int(x)) & (Pd < 10 ** (int(x) + 1))])) for x in xs})
            if lim is not None:
                res = r - lim
                row["resid_at"] = {("%g" % p): [float(np.real(v)), float(np.imag(v))] for p, v in zip(P, res) if abs(np.log10(p) - round(np.log10(p))) < 1e-9 and p >= 1e3}
                row["resid_norm_max_last_decade"] = float(np.max((np.abs(res) * P ** (b - 0.5) / np.log(P))[P >= P[-1] / 10]))
            rows[ctl][str(b)] = row
    out["rows"] = rows
    # blind version: every control scored against zeta's law offset(P) -> -c0 at beta=1
    out["blind_offset_plus_c0"] = {ctl: {("%g" % p): float(np.real(k) - np.log(p) ** 2 / 2 + c0) for p, k in zip(P, side(R, "K", "T1", 1.0, ctl)) if p in (1e3, 1e5, 1e7, 1e9, 1e10, 1e11)} for ctl in CTLS}
    return out

# ------------------------------------------------------------------ test 2
def A_side(ctl, s):
    if ctl == "chi4": return complex(A_chi4(s.real))
    if ctl == "chi3": return complex(mp.log(3 / mp.pi) / 2 + mp.digamma((mp.mpf(s.real) + 1) / 2) / 2)
    if ctl == "NR": return complex(A_zeta(s.real) + NRlog1(s.real))
    if ctl == "EA": return complex(A_zeta(s.real + EA_A) + A_zeta(s.real - EA_A))
    return complex(A_zeta(s.real))
def pick(F, nus):
    F = np.asarray(F); n = len(nus); G = np.zeros((n, n), dtype=complex)
    for i in range(n):
        for j in range(n): G[i, j] = (F[i] + np.conj(F[j])) / (nus[i] + nus[j])
    return G
def arb_sign_certificate(G, rad=1e-7):
    """rigorous sign statement for a Hermitian matrix with entrywise uncertainty rad*(1+|g|): returns ('neg', value) if v*Gv<0 is certified for the float eigenvector of lambda_min"""
    try:
        from flint import arb, acb, ctx
    except Exception: return ["no-flint", None]
    ctx.prec = 200; w, V = np.linalg.eigh(G); v = V[:, 0]; n = len(v); tot = acb(0)
    for i in range(n):
        for j in range(n):
            g = G[i, j]; e = rad * (1 + abs(g)); ge = acb(arb(float(g.real), e), arb(float(g.imag), e))
            tot += acb(float(v[i].real), -float(v[i].imag)) * ge * acb(float(v[j].real), float(v[j].imag))
    re = tot.real
    if re < 0: return ["neg", float(re.upper())]
    if re > 0: return ["pos-direction-only", float(re.lower())]
    return ["undecided", None]
def t2(R):
    out = {"P": R.P.tolist(), "nodes": NUS}; P = R.P; rows = {}
    for ctl in CTLS:
        Fr = []; Fp = []
        for nu in NUS:
            s0 = complex(0.5 + nu); A = A_side(ctl, s0); pr = side(R, "F", "T2", nu, ctl); pts = cpts(R, "T2", nu, ctl)
            corr = sum(C1[ctl] * Mf(P, s) + CH[ctl] * T2f(np.sqrt(P), s) - T2f(P, s) for s in pts)
            if ctl in ("rnd", "rnd2"): corr = -sum(T2f(P, s) for s in pts)
            Fr.append(A - pr); Fp.append(A - pr + corr)
        Fr = np.array(Fr); Fp = np.array(Fp)
        lr = np.array([np.linalg.eigvalsh(pick(Fr[:, k], NUS))[0] for k in range(len(P))]); lp = np.array([np.linalg.eigvalsh(pick(Fp[:, k], NUS))[0] for k in range(len(P))])
        def loc(l, a, b):
            m = (P >= a * 0.999) & (P <= b * 1.001) & (np.abs(l) > 0)
            return fit_slope(np.log(P[m]), np.log(np.abs(l[m]))) if m.sum() > 3 else (float("nan"), 0)
        row = dict(lam_raw={("%g" % p): float(v) for p, v in zip(P, lr) if abs(np.log10(p) - round(np.log10(p))) < 1e-9},
                   lam_pc={("%g" % p): float(v) for p, v in zip(P, lp) if abs(np.log10(p) - round(np.log10(p))) < 1e-9},
                   exp_raw_1e3_1e5=loc(lr, 1e3, 1e5), exp_raw_top2dec=loc(lr, P[-1] / 100, P[-1]), exp_pc_top2dec=loc(lp, P[-1] / 100, P[-1]), exp_pc_1e5_top=loc(lp, 1e5, P[-1]),
                   F_raw_top={str(nu): [float(Fr[i, -1].real), float(Fr[i, -1].imag)] for i, nu in enumerate(NUS)}, F_pc_top={str(nu): [float(Fp[i, -1].real), float(Fp[i, -1].imag)] for i, nu in enumerate(NUS)},
                   arb_raw_top=arb_sign_certificate(pick(Fr[:, -1], NUS)), arb_pc_top=arb_sign_certificate(pick(Fp[:, -1], NUS)))
        rows[ctl] = row
    out["rows"] = rows
    # limit Grams (functions themselves)
    lim = {}
    mp.mp.dps = 40
    for name, f in (("zeta", lambda s: xilog(s)), ("chi4", lambda s: A_chi4(s) + L4log1(s)), ("NR", lambda s: xilog(s) + NRlog1(s)), ("EA", lambda s: xilog(s + EA_A) + xilog(s - EA_A))):
        Fv = [f(mp.mpf(0.5) + mp.mpf(str(nu))) for nu in NUS]; G = mp.matrix(len(NUS))
        for i in range(len(NUS)):
            for j in range(len(NUS)): G[i, j] = (Fv[i] + Fv[j]) / (mp.mpf(str(NUS[i])) + mp.mpf(str(NUS[j])))
        ev = mp.eigsy(G, eigvals_only=True); lim[name] = dict(F=[float(x) for x in Fv], eig=[mp.nstr(e, 8) for e in ev])
    mp.mp.dps = 30; out["limit_grams"] = lim
    return out

# ------------------------------------------------------------------ test 3
def pp_terms(X, s, epsk, pr, logw=None):
    """sum over k>=2, p^k<=X of eps(p,k) L p^{-ks} * (1 or k L) ; returns (PP0, PP1)"""
    a0 = 0j; a1 = 0j; k = 2
    while 2 ** k <= X * (1 + 1e-12):
        pm = pr[pr <= X ** (1.0 / k) * (1 + 1e-12)]; pm = pm[pm.astype(float) ** k <= X * (1 + 1e-12)]
        L = np.log(pm.astype(float)); e = epsk(pm, k); t = e * L * np.exp(-k * s * L)
        a0 += t.sum(); a1 += (t * k * L).sum(); k += 1
    return a0, a1
def t3(R, sfile):
    P = R.P; out = {}; pr = primes_upto(100003)
    S = set(int(x) for x in open(sfile).read().split())
    rs = {c: np.array([1 - 2 * rsign(int(p), SEED + (1 if c == "rnd2" else 0)) for p in pr]) for c in ("rnd", "rnd2")}
    inS = np.array([int(p) in S for p in pr]); idx = {int(p): i for i, p in enumerate(pr)}
    def epsk(ctl):
        def f(pm, k):
            ii = np.array([idx[int(p)] for p in pm], dtype=int) if len(pm) else np.array([], dtype=int)
            if ctl in ("zeta", "NR", "U", "EA"): return np.ones(len(pm))
            if ctl == "lio": return np.full(len(pm), (-1.0) ** k)
            if ctl in ("rnd", "rnd2"): return rs[ctl][ii].astype(float) ** k
            if ctl == "thin": return np.where(inS[ii], -1.0, 1.0) ** k
            if ctl == "del": return np.where(inS[ii], 0.0, 1.0)
            if ctl == "chi4": return np.where(pm % 4 == 1, 1.0, np.where(pm % 4 == 3, -1.0, 0.0)) ** k
            if ctl == "chi3": return np.where(pm % 3 == 1, 1.0, np.where(pm % 3 == 2, -1.0, 0.0)) ** k
        return f
    Xs = [1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10]; Xs = [x for x in Xs if x <= P[-1] * 1.0001]
    kidx = {x: int(np.argmin(np.abs(P - x))) for x in Xs}
    lq = np.log(NR_Q); na = -NR_Q ** (0.5 + NR_DELTA); nb = -NR_Q ** (0.5 - NR_DELTA)
    def triv(X, s, odd):   # sum_k (X^{-m-s}-1)/((m+s)^2 log X), m = 2k (k>=1) or 2k+1 (k>=0)
        tot = 0j
        for k in range(1, 4000):
            m = 2 * k - (1 if odd else 0); tot += (X ** (-m - s) - 1) / ((m + s) ** 2 * np.log(X))
        # tail of -1/((m+s)^2 log X): integral approximation
        m0 = 2 * 4000 - (1 if odd else 0) + 1; tot += -1 / (2 * (m0 + s) * np.log(X))
        return tot
    for ctl in CTLS:
        tab = {}
        for X in Xs:
            k = kidx[X]; lx = np.log(X); raw = np.zeros((len(XS), len(YS))); pc = np.zeros((len(XS), len(YS)))
            for i, x in enumerate(XS):
                for j, y in enumerate(YS):
                    key = f"{x}:{y}"; s0 = complex(0.5 + x, y); pts = cpts(R, "T3", key, ctl)
                    if abs(s0 - 1) < 1e-9: raw[i, j] = pc[i, j] = np.nan; continue   # A(s) has its pole at s = 1
                    C0 = side(R, "C0", "T3", key, ctl)[k]; C1v = side(R, "C1", "T3", key, ctl)[k]
                    for s in pts:
                        a0, a1 = pp_terms(X, s, epsk(ctl), pr); C0 += a0; C1v += a1
                    Ssm = C0 - C1v / lx
                    if ctl == "NR":
                        kk = 1
                        while NR_Q ** kk <= X * (1 + 1e-12):
                            Ssm -= (na ** kk + nb ** kk) * lq * NR_Q ** (-kk * s0) * (1 - kk * lq / lx); kk += 1
                    if ctl in ("chi4", "chi3"):
                        q = 4 if ctl == "chi4" else 3; A = complex(mp.log(q / mp.pi) / 2 + mp.digamma((mp.mpmathify(s0) + 1) / 2) / 2)
                    elif ctl == "EA": A = complex(A_zeta(s0 + EA_A) + A_zeta(s0 - EA_A))
                    else: A = complex(A_zeta(s0)) + (lq if ctl == "NR" else 0)
                    raw[i, j] = (A - Ssm).real
                    corr = sum(C1[ctl] * (X ** (1 - s) - 1) / ((1 - s) ** 2 * lx) for s in pts)
                    if ctl in ("chi4", "chi3"): corr -= triv(X, s0, True)
                    elif ctl == "EA": corr -= triv(X, s0 + EA_A, False) + triv(X, s0 - EA_A, False)
                    else: corr -= triv(X, s0, False)
                    pc[i, j] = (A - Ssm + corr).real
            tab["%g" % X] = dict(raw=np.where(np.isnan(raw), None, raw).tolist(), pc=np.where(np.isnan(pc), None, pc).tolist(), raw_min=float(np.nanmin(raw)), raw_neg=int((raw < 0).sum()), pc_min=float(np.nanmin(pc)), pc_neg=int((pc < 0).sum()),
                                 pc_argmin=[XS[int(np.nanargmin(pc) // len(YS))], YS[int(np.nanargmin(pc) % len(YS))]],
                                 pc_neg_in_region=int(((pc < 0) & (np.array(XS)[:, None] * lx > 1.2785)).sum()), region_points=int((np.array(XS) * lx > 1.2785).sum() * len(YS)))
        out[ctl] = tab
    truth = np.array([[float(mp.re(xilog(mp.mpc(0.5 + x, y)))) if abs(complex(x - 0.5, y)) > 1e-9 else 0.0 for y in YS] for x in XS]); out["truth_zeta"] = truth.tolist()
    out["XS"] = XS; out["YS"] = YS
    return out

# ------------------------------------------------------------------ test 4
def lgam(ctl, s):
    s = mp.mpmathify(s)
    if ctl in ("chi4", "chi3"):
        q = 4 if ctl == "chi4" else 3; return float(mp.re((s / 2) * mp.log(q / mp.pi) + mp.loggamma((s + 1) / 2)))
    f = lambda z: mp.re(mp.log(z * (z - 1) / 2) - (z / 2) * mp.log(mp.pi) + mp.loggamma(z / 2))
    if ctl == "EA": return float(f(s + EA_A) + f(s - EA_A))
    return float(f(s))
def t4(R):
    P = R.P; out = {"AS": AS, "OMS": OMS}; Ps = [p for p in (1e2, 1e4, 1e6, 1e8, 1e10) if p <= P[-1] * 1.0001]
    for ctl in CTLS:
        tab = {}
        for a in AS:
            row = {}
            for om in OMS:
                key = f"{a}:{om}"
                lm = side(R, "LG", "T4-", key, ctl); lpv = side(R, "LG", "T4+", key, ctl)
                gm = lgam(ctl, mp.mpc(0.5 - a, om)); gp = lgam(ctl, mp.mpc(0.5 + a, om))
                v = (gm - gp) + (lm - lpv)      # log |Theta_{a,P}(i omega)|
                row[str(om)] = {("%g" % p): float(np.real(v[int(np.argmin(np.abs(P - p)))]) / (2 * a)) for p in Ps}
            tab[str(a)] = row
        out[ctl] = tab
    return out

if __name__ == "__main__":
    which, binf, jsonf, sfile, outf = sys.argv[1:6]
    R = Run(binf, jsonf); print("loaded", binf, "checkpoints", len(R.P), "Pmax %g" % R.P[-1], "counts", R.cnt[-1].tolist(), flush=True)
    res = {"counts_top": R.cnt[-1].tolist(), "Pmax": float(R.P[-1])}
    for w in which.split(","):
        res[w] = dict(t1=lambda: t1(R), t2=lambda: t2(R), t3=lambda: t3(R, sfile), t4=lambda: t4(R))[w](); print("done", w, flush=True)
    json.dump(res, open(outf, "w"), indent=1)
