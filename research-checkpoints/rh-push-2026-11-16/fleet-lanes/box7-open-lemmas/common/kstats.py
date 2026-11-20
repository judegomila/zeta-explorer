"""kstats.py -- statistics of a Hermitian PSD mark Gram matrix G (numpy, CPU), shared by E1 and E2.

SDP(G) = max{tr(GX): X >= 0, X_pp <= 1} = min{tr D: D diagonal, D - G >= 0}; by Lemma 1 of n2-kloss-sdp-certificate
tr G <= max_{|a_p|<=1} a*Ga <= SDP(G) <= (4/pi) max, so SDP/tr is the K-loss functional up to 4/pi.
Solver as in n2-kloss-sdp-certificate/sdp.py (generalised power method, dual D_p = Re(G V V*)_pp, a-posteriori
certificate tr(GVV*) <= SDP <= tr D + n delta with delta = max(0, -lambda_min(D - G))).
"""
import math
import numpy as np


def _rownorm(V):
    return V / np.maximum(np.linalg.norm(V, axis=1, keepdims=True), 1e-300)


def sdp(G, seed=1, maxit=20000, tol=1e-8):
    """returns (primal, upper, iterations): primal = tr(G V V*) <= SDP(G) <= upper = tr D + n delta (valid at any stopping
    point). The iteration is monotone; it stops when the primal value has stalled, then the dual certificate is computed
    with one eigenvalue decomposition; if the relative gap exceeds tol the iteration continues (at most 6 rounds)."""
    n = G.shape[0]
    if n > 800:                                                       # large matrices: fewer iterations, looser gap (still certified)
        maxit = min(maxit, 6000); tol = max(tol, 1e-6)
    rng = np.random.default_rng(seed)
    k = min(n, int(math.ceil(math.sqrt(n))) + 3)
    V = _rownorm(rng.standard_normal((n, k)) + 1j * rng.standard_normal((n, k)))
    Gd = np.real(np.diag(G)).copy()
    it = 0; stall = 1e-10; best = None
    for rnd in range(6):
        prev = -1.0
        while it < maxit:
            GV = G @ V
            if it % 25 == 0:
                cur = float(np.real(np.vdot(V, GV)))
                if prev > 0 and cur - prev <= stall * cur:
                    break
                prev = cur
            V = _rownorm(GV - 0.5 * Gd[:, None] * V); it += 1
        GV = G @ V
        primal = float(np.real(np.vdot(V, GV)))
        Dd = np.real(np.einsum("ij,ij->i", V.conj(), GV))
        delta = max(0.0, -float(np.linalg.eigvalsh(np.diag(Dd) - G)[0]))
        upper = float(Dd.sum()) + n * delta
        if best is None or upper < best[1]:
            best = (primal, upper)
        best = (max(best[0], primal), best[1])
        if (best[1] - best[0]) <= tol * best[0] or it >= maxit:
            break
        stall *= 0.01
    return best[0], best[1], it


def gram_stats(G, R_eff, do_sdp=True, conj_perm=None, seed=1):
    """G Hermitian (complex128). R_eff = number of rows (for the R^-1/2 unit of pair sizes).
    Returns dict of ratios against tr G and pair statistics of the unit-diagonal Gram."""
    G = (G + G.conj().T) / 2
    n = G.shape[0]
    gd = np.real(np.diag(G)).copy()
    tr = float(gd.sum())
    out = dict(n=n, tr=tr)
    lam = float(np.linalg.eigvalsh(G)[-1])
    out["nlam_tr"] = lam * n / tr
    out["ones_tr"] = float(np.real(G.sum())) / tr
    out["gersh_tr"] = float(np.abs(G).sum()) / tr
    Gn = G / np.sqrt(np.outer(gd, gd))
    out["lam_unit"] = float(np.linalg.eigvalsh(Gn)[-1])           # top eigenvalue of the unit-diagonal Gram (WLS constant)
    if n > 1:
        off = np.abs(Gn); np.fill_diagonal(off, 0.0)
        iu = np.triu_indices(n, 1); o = off[iu]
        if conj_perm is not None:
            cm = np.zeros((n, n), bool)
            idx = np.flatnonzero(conj_perm >= 0)
            cm[idx, conj_perm[idx]] = True
            oc = off[cm & (np.arange(n)[:, None] < np.arange(n)[None, :])]
            onc = off[(~cm) & (np.arange(n)[:, None] < np.arange(n)[None, :])]
        else:
            oc = np.zeros(0); onc = o
        out["pair_max"] = float(o.max()); out["pair_rms"] = float(np.sqrt((o ** 2).mean()))
        out["pair_max_nc"] = float(onc.max()) if len(onc) else 0.0     # conjugate pairs (p, pbar) excluded
        out["pair_rms_nc"] = float(np.sqrt((onc ** 2).mean())) if len(onc) else 0.0
        out["conj_pairs"] = int(len(oc)); out["conj_rms"] = float(np.sqrt((oc ** 2).mean())) if len(oc) else 0.0
        out["pair_max_sqrtR"] = out["pair_max"] * math.sqrt(R_eff); out["pair_rms_sqrtR"] = out["pair_rms"] * math.sqrt(R_eff)
        out["gauss_max_pred"] = math.sqrt(math.log(max(len(o), 2)))
    else:
        for k in ("pair_max", "pair_rms", "pair_max_nc", "pair_rms_nc", "conj_rms", "pair_max_sqrtR", "pair_rms_sqrtR", "gauss_max_pred"):
            out[k] = 0.0
        out["conj_pairs"] = 0
    if do_sdp:
        primal, upper, it = sdp(G, seed=seed)
        out["sdp_tr"] = upper / tr; out["sdp_primal_tr"] = primal / tr; out["sdp_gap"] = (upper - primal) / primal; out["sdp_it"] = it
    else:
        out["sdp_tr"] = None
    return out


def wfit(x, y, s=None):
    """weighted least squares y = a + e x; returns (e, se_e, a). se combines the weights and the residual scatter."""
    x = np.asarray(x, float); y = np.asarray(y, float)
    if len(x) < 2:
        return float("nan"), float("nan"), float("nan")
    w = np.ones_like(x) if s is None else 1.0 / np.maximum(np.asarray(s, float), 1e-12) ** 2
    xm = (w * x).sum() / w.sum(); ym = (w * y).sum() / w.sum()
    sxx = (w * (x - xm) ** 2).sum()
    if sxx <= 0:
        return float("nan"), float("nan"), float("nan")
    e = (w * (x - xm) * (y - ym)).sum() / sxx
    a = ym - e * xm
    r = y - a - e * x
    se_w = math.sqrt(1.0 / sxx) if s is not None else 0.0
    se_r = math.sqrt((w * r * r).sum() / max(len(x) - 2, 1) / sxx) if len(x) > 2 else 0.0
    return float(e), float(max(se_w, se_r)), float(a)
