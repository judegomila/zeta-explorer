#!/usr/bin/env python3
"""Infinity-to-one norm of the mark Gram matrices: SDP screen (float64) and certified two-sided bounds (ball arithmetic).

For a Hermitian PSD G:  mu(G) = max{a* G a : |a_p| <= 1}  (complex a),   mu_pm(G) = max over a in {+1,-1}^n.
  tr G <= mu_pm <= mu <= SDP(G) = min{tr D : D diagonal, D - G >= 0} <= (4/pi) mu.
Stage 1 (screen): Burer-Monteiro primal, dual candidate D, randomised rounding.
Stage 2 (verdict): G is replaced by the ball matrix G +- eta (eta = entrywise error radius of the float64 build, see RESULT.md);
  upper: LDL* factorisation of (D' - t I) - G_mid in arb (prec 200, exact midpoints) with all pivots certified positive, t >= ||eta||_F
          =>  D' - G_true >= 0  =>  mu <= SDP <= tr D';
  lower: a* G a evaluated in arb for an explicit unimodular a (and for an explicit sign vector).
Usage: cert.py g_Z*.npz [sizes: comma list of mark counts; 0 = natural slot; -1 = all]
"""
import sys, math, json, time, os
import numpy as np
from flint import arb, acb, ctx
ctx.prec = 200
U_ = 1.1102230246251565e-16

f = sys.argv[1]
d = np.load(f)
Np = d["Np"]; N = len(Np); R = int(d["R"]); Cn = int(d["Cn"]); Dp = d["Dp"]; S1 = d["Wabs1"]; nat = d["natural"]
sizes = [int(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 else [8, 12, 16, 24, 32, 0, -1]
names = [k[2:] for k in d.files if k.startswith("G_")]
rng = np.random.default_rng(12345)
EPS_W = 1e-11          # relative error bound of every coefficient (Gauss sums, weights, phases)


def eta_matrix(G):
    """entrywise bound for |G_computed - G_true| under the float64 error model."""
    ex = (EPS_W + (Cn + 16) * U_) * S1                       # |delta x_p(m)| <= ex_p for every row m
    gd = np.sqrt(np.maximum(np.real(np.diag(G)), 0))
    sq = math.sqrt(R)
    return (np.outer(sq * gd, ex) + np.outer(ex, sq * gd) + R * np.outer(ex, ex)) * 1.01 + 4 * (R + 16) * U_ * np.outer(gd, gd)


def rownorm(Vm):
    return Vm / np.maximum(np.linalg.norm(Vm, axis=1, keepdims=True), 1e-300)


def solve(G, k):
    n = len(G)
    V = rownorm(rng.standard_normal((n, k)) + 1j * rng.standard_normal((n, k)))
    Gd = np.real(np.diag(G))
    for it in range(200000):
        GV = G @ V
        new = float(np.real(np.vdot(V, GV)))
        if it % 50 == 0:
            Dd = np.real(np.einsum("ij,ij->i", V.conj(), GV))
            ev0 = np.linalg.eigvalsh(np.diag(Dd) - G)[0]
            if -ev0 * n < 1e-11 * new:
                break
        V = rownorm(GV - 0.5 * Gd[:, None] * V)
    GV = G @ V
    Dd = np.real(np.einsum("ij,ij->i", V.conj(), GV))
    return V, float(np.real(np.vdot(V, GV))), Dd, it


def phase_ascent(G, a):
    prev = -1.0; gd = np.real(np.diag(G))
    for it in range(5000):
        Ga = G @ a; cur = float(np.real(np.vdot(a, Ga)))
        if cur - prev <= 1e-14 * cur:
            break
        prev = cur
        b = Ga - 0.5 * gd * a
        a = b / np.maximum(np.abs(b), 1e-300)
    return cur, a


def sign_ascent(Gr, s):
    """1-flip local search for max s^T Gr s, s in {+-1}^n."""
    n = len(s); g = Gr @ s
    while True:
        gain = -4 * s * (g - np.diag(Gr) * s)              # change of the value when s_i flips
        i = int(np.argmax(gain))
        if gain[i] <= 1e-13 * abs(s @ g):
            break
        g -= 2 * s[i] * Gr[:, i]; s[i] = -s[i]
    return float(s @ Gr @ s), s


def ldl_pos(Hm, Hr):
    """Hm complex matrix of midpoints, Hr entrywise radii. Certify H > 0 for every Hermitian matrix in the ball: LDL* in acb."""
    n = len(Hm)
    A = [[acb(arb(float(Hm[i, j].real), float(Hr[i, j])), arb(float(Hm[i, j].imag), float(Hr[i, j]) if i != j else 0.0)) for j in range(n)] for i in range(n)]
    Lm = [[None] * n for _ in range(n)]; Dg = [None] * n
    minpiv = None
    for j in range(n):
        s = A[j][j].real
        for k in range(j):
            s -= (Lm[j][k] * Lm[j][k].conjugate()).real * Dg[k]
        if not (s > 0):
            return False, None
        Dg[j] = s
        lo = float((s.mid() - s.rad()).lower()) if hasattr(s, "lower") else float(s.mid()) - float(s.rad())
        minpiv = lo if minpiv is None else min(minpiv, lo)
        for i in range(j + 1, n):
            t = A[i][j]
            for k in range(j):
                t -= Lm[i][k] * Lm[j][k].conjugate() * Dg[k]
            Lm[i][j] = t / s
    return True, minpiv


def arb_quad(Gm, Gr, a_ang=None, signs=None):
    """certified lower bound of a* G a over the ball; a = exp(i ang) (exact unit modulus) or a sign vector."""
    n = len(Gm)
    if signs is not None:
        av = [acb(int(s)) for s in signs]
    else:
        av = [acb(0, arb(float(t))).exp() for t in a_ang]
    tot = arb(0)
    for i in range(n):
        for j in range(n):
            g = acb(arb(float(Gm[i, j].real), float(Gr[i, j])), arb(float(Gm[i, j].imag), float(Gr[i, j]) if i != j else 0.0))
            tot += (av[i].conjugate() * g * av[j]).real
    return float((tot.mid() - tot.rad()).lower()) if hasattr(tot, "lower") else float(tot.mid()) - float(tot.rad())


def lo(x):
    return float(x.mid()) - float(x.rad())


def hi(x):
    return float(x.mid()) + float(x.rad())


res = dict(file=os.path.basename(f), Z=float(d["Z"]), M=float(d["M"]), L=float(d["L"]), R=R, Cn=Cn, nmarks=N, gerr=float(d["gerr"]), Np=Np.tolist(), runs=[])
nnat = int(nat.sum())
done = set()
for sz in sizes:
    n = nnat if sz == 0 else (N if sz == -1 else sz)
    if n > N or n in done and sz not in (0, -1):
        continue
    tag = "natural" if sz == 0 else ("all" if sz == -1 else "first")
    if n in done:
        for r_ in res["runs"]:
            if r_["n"] == n:
                r_["tag"] += "+" + tag
        continue
    done.add(n)
    idx = np.arange(n)
    for name in names:
        t0 = time.time()
        G = d["G_" + name][np.ix_(idx, idx)]
        eta = eta_matrix(d["G_" + name])[np.ix_(idx, idx)]
        tr = float(np.real(np.trace(G)))
        k = min(n, int(math.ceil(math.sqrt(n))) + 3)
        V, primal, Dd, its = solve(G, k)
        lam = float(np.linalg.eigvalsh(G)[-1])
        # lower bounds (float search)
        best, ba = 0.0, None
        for t in range(60):
            g = rng.standard_normal(k) + 1j * rng.standard_normal(k)
            a = V @ g if t < 50 else rng.standard_normal(n) + 1j * rng.standard_normal(n)
            c, a = phase_ascent(G, a / np.maximum(np.abs(a), 1e-300))
            if c > best:
                best, ba = c, a
        Gr = np.real(G); bs, bsv = 0.0, None
        for t in range(400):
            if t < 200:
                g = rng.standard_normal(k) + 1j * rng.standard_normal(k); s = np.sign(np.real(V @ g))
            elif t < 300:
                s = np.sign(np.real(ba * np.exp(2j * math.pi * rng.random())))
            else:
                s = np.sign(rng.standard_normal(n))
            s[s == 0] = 1
            c, s = sign_ascent(Gr, s.copy())
            if c > bs:
                bs, bsv = c, s.copy()
        # certified upper bound
        ev0 = float(np.linalg.eigvalsh(np.diag(Dd) - G)[0])
        nrm_eta = float(np.sqrt((eta ** 2).sum())) * (1 + 1e-6)      # Frobenius norm >= spectral norm of the perturbation
        cert = False
        for bump_ in [1e-10, 1e-9, 1e-8, 1e-7, 1e-6]:
            delta = max(0.0, -ev0) + bump_ * tr / n
            D2 = Dd + delta + nrm_eta
            # exact-midpoint test: (D2 - nrm_eta) - G_mid > 0 (zero radii, prec 200)  =>  D2 - G_true >= nrm_eta - ||E|| >= 0
            okc, mp = ldl_pos(np.diag(Dd + delta) - G, np.zeros_like(eta))
            if okc:
                cert = True
                break
        up = arb(0)
        for x in D2:
            up += arb(float(x))
        upper = hi(up)
        tr_arb_lo = sum(float(G[i, i].real) - float(eta[i, i]) for i in range(n)) * (1 - 4 * U_)
        tr_arb_hi = sum(float(G[i, i].real) + float(eta[i, i]) for i in range(n)) * (1 + 4 * U_)
        ang = np.angle(ba)
        lowT = arb_quad(G, eta, a_ang=ang)
        lowS = arb_quad(G, eta, signs=bsv)
        r = dict(n=n, tag=tag, variant=name, tr=tr, sdp_primal=primal, sdp_dual_float=float(Dd.sum()) + n * max(0.0, -ev0), its=its,
                 certified=bool(cert), upper_cert=upper, lower_cert_unimodular=lowT, lower_cert_sign=lowS,
                 ratio_upper=upper / tr_arb_lo, ratio_lower=lowT / tr_arb_hi, ratio_lower_sign=lowS / tr_arb_hi,
                 sdp_over_tr=primal / tr, n_lam_over_tr=lam * n / tr, MP=(1 + math.sqrt(n / R)) ** 2,
                 eta_rel=float(nrm_eta / lam), min_pivot_rel=(mp / tr * n) if cert else None,
                 D=D2.tolist(), a_angle=ang.tolist(), signs=[int(x) for x in bsv], Gdiag=np.real(np.diag(G)).tolist())
        res["runs"].append(r)
        print(f"n={n:3d} {tag:8s} {name:4s} tr={tr:.6e} SDP/tr={r['sdp_over_tr']:.6f} | certified: {r['ratio_lower_sign']:.6f} (signs) <= {r['ratio_lower']:.6f} (unimodular) <= mu/tr <= {r['ratio_upper']:.6f}"
              f" cert={cert} | n*lam/tr={r['n_lam_over_tr']:.4f} MP={r['MP']:.4f} eta_rel={r['eta_rel']:.1e} [{time.time() - t0:.1f}s]", flush=True)
json.dump(res, open(os.path.join(os.path.dirname(os.path.abspath(f)), "cert_" + os.path.basename(f).replace(".npz", ".json")), "w"))
