#!/usr/bin/env python3
"""analysis.py outdir out.json -- normalised correlation of rho_nat with manuscript-geometry cubic rows along R = Q^1.4,
before and after removal of the polar (Gauss-sum law) part, on the two row strata, with block bootstrap over row orbits.

All sums are over half rows (one of {m, -m}); full sums are twice these on matching-parity cells, and the factor
cancels in r.  For a row type with coefficients coef(c) = base(c) w_k(c)  (B_m = sum_c coef(c) chi_c(m)):
  F[sigma]      = sum_m rho_sigma(m) B_m^{par sigma}
  SELF[sigma]   = estimator self-term (exact, from the per-conductor accumulators of scale.py)
  X0 = F - SELF                                 leave-one-out form
  polar part:  S_sigma(c) ~ K[cls(c), sigma, shell(c)] pred(c), K = cell mean of S_loo conj(pred) ("band law": one
               complex amplitude per (class of c, sigma, norm shell); "smooth law": K = N^(-1/3) x cubic in log N per
               (class of c, sigma)).  Both are linear in the data, so subtracting them is the same as pairing rho with
               B - Bpol, where Bpol replaces coef(c) by conj(pred(c)) x (cell mean, resp. smoothed, of coef pred).
  X1 = X0 - P_band,  X2 = X0 - P_smooth
  r_v = sqrt( mean_sigma |X_v[sigma]|^2 / (sum_m |rho_sigma|^2 sum_m |B_m|^2) ),  |B_m|^2 = |B^0|^2 + |B^1|^2
"""
import os, sys, math, glob, json, time
import numpy as np
import scipy.sparse as sp
outd, outjson = sys.argv[1], sys.argv[2]
NG = 400; NBOOT = 400; NNULL = 30
rng = np.random.default_rng(77)
def P(*a): print(*a, flush=True)
t00 = time.time()
st_ = np.load(os.path.join(outd, 'static.npz'))
Qs = st_['Qs']; Rs = st_['Rs']; types = [str(t) for t in st_['types']]; NB = len(Qs); nsh = st_['cnt'].shape[0]
cnt = st_['cnt'].astype(float); CP = st_['CP']; CN = st_['CN']; par_cls = st_['par_cls']; a_th = st_['a_th']; grid = st_['grid'].astype(float)
cls_par = [st_['cls_even'], st_['cls_odd']]
kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1); c1 = (1 - 1j * kap) / 2; c2 = (1 + 1j * kap) / 2
def ext(X):
    """append the Davenport-Heilbronn-type rows (last axis = type): c1 x13 + c2 x13c."""
    r = c1 * X[..., types.index('res*x13')] + c2 * X[..., types.index('res*x13c')]
    a = c1 * X[..., types.index('a*x13')] + c2 * X[..., types.index('a*x13c')]
    return np.concatenate([X, r[..., None], a[..., None]], axis=-1)
TY = types + ['res*dh', 'a*dh']; NT = len(TY)
CP = ext(CP)
files = sorted(glob.glob(os.path.join(outd, 'rows_*.npz')))
rows = [np.load(f) for f in files]
cat = lambda k: np.concatenate([r[k] for r in rows])
Nm = cat('Nm'); fl = cat('flags'); six = cat('six'); orb = cat('orb'); rho = cat('rho_str') + cat('rho_cor'); se = cat('se'); W = cat('W')
B = ext(cat('B')); B3 = ext(cat('B3')); nrow = len(Nm)
jb = np.searchsorted(Qs, Nm, 'left'); gen = ~six
cop6 = (fl[:, 0] == 0) & (fl[:, 1] == 0); stt = np.where(cop6, 0, 1)
P(f"half rows {nrow} (N(m) <= {Nm.max()}); generic {int(gen.sum())}: prime to 6 {int((gen & cop6).sum())}, not prime to 6 {int((gen & ~cop6).sum())}; S-unit rows dropped {int(six.sum())}; load {time.time()-t00:.0f}s")
P(f"noise share of sum |rho_hat|^2 (generic): {float((se[gen]**2).sum() / (np.abs(rho[gen])**2).sum()):.3f}")
# ---- projections: band and smooth
Ns = np.sqrt(grid[1:] * grid[:-1]); x = np.log(Ns / 1e5)
cnz = np.where(cnt > 0, cnt, 1.0)
CPn_b = CP / cnz[None, :, :, None] * (cnt > 0)[None, :, :, None]
CPn_s = np.zeros_like(CP)
Xd = (Ns ** (-1 / 3.0))[:, None] * np.stack([np.ones_like(x), x, x ** 2, x ** 3], 1)
for c in range(12):
    w = cnt[1:, c]
    H = Xd @ np.linalg.solve(Xd.T @ (w[:, None] * Xd), Xd.T * w[None, :])          # K_smooth = H K_band
    CPn_s[:, 1:, c, :] = np.einsum('st,kse->kte', H, CP[:, 1:, c, :]) / cnz[1:, c][None, :, None] * (w > 0)[None, :, None]
dS = cat('dS'); dn = cat('dn')
def polrows(CPn):
    out = np.zeros((nrow, NB, 2, NT), complex)
    for p in (0, 1):
        D = np.conj(dS[:, :, cls_par[p]]).reshape(nrow, -1).astype(complex)
        M = CPn[:, :, cls_par[p], :].transpose(1, 2, 0, 3).reshape(nsh * 6, NB * NT)
        out[:, :, p, :] = (D @ M).reshape(nrow, NB, NT)
    return out
Bp_b = polrows(CPn_b); Bp_s = polrows(CPn_s)
P(f"polar rows built, {time.time()-t00:.0f}s")
# ---- groups of row orbits
okey = orb[:, 0] * 100003 + orb[:, 1]; uo, oinv = np.unique(okey, return_inverse=True)
grp = rng.integers(0, NG, len(uo))[oinv]
idx = (grp * NB + jb) * 2 + stt
Mg = sp.csr_matrix((gen.astype(float), (idx, np.arange(nrow))), shape=(NG * NB * 2, nrow))
def gsum(X):
    return np.asarray(Mg @ X.reshape(nrow, -1)).reshape((NG, NB, 2) + X.shape[1:])
def cumj(X):                                   # cumulative over the row bin axis (axis 1): rows with N(m) <= Q_j
    return np.cumsum(X, axis=1)
paths = {'R=Q^1.4': np.arange(NB), 'R=R_top': np.full(NB, NB - 1)}
def on_path(Xc, kk):                           # Xc[g, j, st, k, ...] -> [g, j, st, ...] with k = kk[j]
    return np.stack([Xc[:, j, :, kk[j]] for j in range(NB)], axis=1)
Pth = {name: {} for name in paths}
def add(name_q, X, has_k=True):
    Xc = cumj(gsum(X))
    for pn, kk in paths.items():
        Pth[pn][name_q] = on_path(Xc, kk) if has_k else Xc
psig = par_cls
def form(Bx):                                  # per-row rho_sigma B^{par sigma}: [row, k, type, sigma]
    return np.stack([rho[:, s, None, None] * Bx[:, :, psig[s], :] for s in range(12)], axis=-1)
for nm, Bx in (('F', B), ('F3', B3), ('Fb', Bp_b), ('Fs', Bp_s)):
    add(nm, form(Bx)); P(f"  group sums {nm}, {time.time()-t00:.0f}s")
# self-term of the polar rows: selfpol[m, k, type, sigma] = (1/W_m[sigma]) sum_s a_s 1[dn>0] CPn[k, s, sigma, type]
def selfpol(CPn):
    out = np.zeros((nrow, NB, NT, 12), complex)
    for s in range(12):
        ind = (dn[:, 1:, s] > 0).astype(float) * a_th[None, :]
        out[:, :, :, s] = ((ind @ CPn[:, 1:, s, :].transpose(1, 0, 2).reshape(nsh - 1, NB * NT)) / W[:, s][:, None]).reshape(nrow, NB, NT)
    return out
add('Sb', selfpol(CPn_b)); add('Ss', selfpol(CPn_s))
add('nr', np.abs(rho) ** 2, has_k=False)
add('nb', (np.abs(B) ** 2).sum(2)); add('nbf', (np.abs(B + B3) ** 2).sum(2)); add('nb3', (np.abs(B3) ** 2).sum(2))
add('cnt', np.ones(nrow), has_k=False)
del Mg
# exact self-terms from the snapshots
SELF = np.zeros((NB, 2, NB, NT, 12), complex); FS = np.zeros((NB, 2, NB, NT, 12), complex)
for j in range(NB):
    sn = np.load(os.path.join(outd, f'snap_{j:02d}.npz')); SELF[j] = ext(sn['SELF'].transpose(0, 1, 3, 2)).transpose(0, 1, 3, 2); FS[j] = ext(sn['FS'].transpose(0, 1, 3, 2)).transpose(0, 1, 3, 2)
one = np.ones(NG)
chk = 0
for pn, kk in paths.items():
    d = Pth[pn]
    d['SELFx'] = np.stack([SELF[j, :, kk[j]] for j in range(NB)])                   # [j, st, type, sigma]
    d['FSx'] = np.stack([FS[j, :, kk[j]] for j in range(NB)])
    d['resid'] = d['SELFx'] - np.tensordot(one, d['Sb'], 1)
    chk = max(chk, np.abs(np.tensordot(one, d['F'], 1) - d['FSx']).max())
P(f"check: sum_m rho B (per-row data) against sum_c coef S (per-conductor accumulators), all path points: max |diff| = {chk:.2e}")
P(f"self-term: exact against the cell-mean approximation, |resid| / |SELF| (rms over the R=Q^1.4 path, type res): {float(np.sqrt((np.abs(Pth['R=Q^1.4']['resid'][..., TY.index('res'), :])**2).mean() / (np.abs(Pth['R=Q^1.4']['SELFx'][..., TY.index('res'), :])**2).mean())):.4f}")
VAR = ['raw', 'loo', 'band', 'smooth', 'polar', 'loo+n3', 'band+n3', 'n3only']
def stats(w, pn):
    """r[variant][j, stratum(0, 1, all), type] for group weights w."""
    d = Pth[pn]; g = lambda k: np.tensordot(w, d[k], 1)
    F = g('F'); F3 = g('F3'); Fb = g('Fb'); Fs = g('Fs'); Sb = g('Sb'); Ss = g('Ss'); nr = g('nr'); nb = g('nb'); nbf = g('nbf'); nb3 = g('nb3'); c = g('cnt')
    c0 = np.tensordot(one, d['cnt'], 1); sc = (c / c0)[:, :, None, None]
    SELFs = Sb + d['resid'] * sc
    X = {'raw': F, 'loo': F - SELFs, 'band': F - Fb - d['resid'] * sc, 'smooth': F - Fs - (SELFs - Ss)}
    X['polar'] = Fb - Sb
    X['loo+n3'] = X['loo'] + F3; X['band+n3'] = X['band'] + F3; X['n3only'] = F3
    nbv = {'raw': nb, 'loo': nb, 'band': nb, 'smooth': nb, 'polar': nb, 'loo+n3': nbf, 'band+n3': nbf, 'n3only': nb3}
    out = {}
    for v in VAR:
        r = np.zeros((NB, 3, NT))
        for s_, sl in enumerate((slice(0, 1), slice(1, 2), slice(0, 2))):
            Xs = X[v][:, sl].sum(1); nrs = nr[:, sl].sum(1); nbs = nbv[v][:, sl].sum(1)
            r[:, s_] = np.sqrt((np.abs(Xs) ** 2 / (nrs[:, None, :] * nbs[:, :, None])).mean(-1))
        out[v] = r
    return out
def slope(r, j0=0):
    lq = np.log(Qs[j0:]); lr = np.log(r[j0:])
    return -(((lq - lq.mean())[:, None, None] * (lr - lr.mean(0))).sum(0) / ((lq - lq.mean()) ** 2).sum())
res = {'Qs': Qs.tolist(), 'Rs': Rs.tolist(), 'types': TY, 'variants': VAR, 'strata': ['prime to 6', 'not prime to 6', 'all generic'], 'paths': {}}
rows_full = 2 * np.tensordot(one, Pth['R=Q^1.4']['cnt'], 1)                         # [j, st]
res['rows_full'] = rows_full.tolist()
for pn in paths:
    pt = stats(one, pn)
    bs = {v: np.zeros((NBOOT, NB, 3, NT)) for v in VAR}
    for b in range(NBOOT):
        w = rng.multinomial(NG, np.full(NG, 1.0 / NG)).astype(float)
        o = stats(w, pn)
        for v in VAR: bs[v][b] = o[v]
    out = {}
    for v in VAR:
        dl = slope(pt[v]); dlb = np.stack([slope(bs[v][b]) for b in range(NBOOT)])
        dl4 = slope(pt[v], 4); dl4b = np.stack([slope(bs[v][b], 4) for b in range(NBOOT)])
        out[v] = dict(r=pt[v].tolist(), r_lo=np.percentile(bs[v], 2.5, axis=0).tolist(), r_hi=np.percentile(bs[v], 97.5, axis=0).tolist(),
                      delta=dl.tolist(), delta_sd=dlb.std(0).tolist(), delta_lo=np.percentile(dlb, 2.5, axis=0).tolist(), delta_hi=np.percentile(dlb, 97.5, axis=0).tolist(),
                      delta_top=dl4.tolist(), delta_top_sd=dl4b.std(0).tolist(), delta_top_lo=np.percentile(dl4b, 2.5, axis=0).tolist(), delta_top_hi=np.percentile(dl4b, 97.5, axis=0).tolist())
    res['paths'][pn] = out
    P(f"bootstrap done for path {pn}, {time.time()-t00:.0f}s")
# ---- orbit-phase null on the path R = Q^1.4 (variants loo-without-self = raw form, and band)
kk = paths['R=Q^1.4']; NV = ('raw', 'band', 'polar'); nullr = {v: np.zeros((NNULL, NB, 3, NT)) for v in NV}
nrj = np.tensordot(one, Pth['R=Q^1.4']['nr'], 1); nbj = np.tensordot(one, Pth['R=Q^1.4']['nb'], 1)
masks = [[gen & (Nm <= Qs[j]) & (stt == s) for s in (0, 1)] for j in range(NB)]
for it in range(NNULL):
    ph = np.exp(2j * np.pi * rng.random(len(uo)))[oinv]; rp = rho * ph[:, None]
    for j in range(NB):
        Xv = {v: np.zeros((2, NT, 12), complex) for v in NV}
        for s in (0, 1):
            mk = masks[j][s]
            for sg in range(12):
                b0 = B[mk, kk[j], psig[sg], :]; v = rp[mk, sg]
                bp = Bp_b[mk, kk[j], psig[sg], :]; Xv['raw'][s, :, sg] = v @ b0; Xv['band'][s, :, sg] = v @ (b0 - bp); Xv['polar'][s, :, sg] = v @ bp
        for v in NV:
            for s_, sl in enumerate((slice(0, 1), slice(1, 2), slice(0, 2))):
                nullr[v][it, j, s_] = np.sqrt((np.abs(Xv[v][sl].sum(0)) ** 2 / (nrj[j, sl].sum(0)[None, :] * nbj[j, sl].sum(0)[:, None])).mean(-1))
res['null'] = {v: dict(r=np.sqrt((nullr[v] ** 2).mean(0)).tolist(), delta=np.mean([slope(nullr[v][i]) for i in range(NNULL)], 0).tolist(),
                       delta_sd=np.std([slope(nullr[v][i]) for i in range(NNULL)], 0).tolist()) for v in NV}
P(f"null done, {time.time()-t00:.0f}s")
nb3 = np.tensordot(one, Pth['R=Q^1.4']['nb3'], 1).sum(1); nbf = np.tensordot(one, Pth['R=Q^1.4']['nbf'], 1).sum(1)
res['n3_share'] = (nb3 / nbf).tolist()
P("share of the n^3 part in ||B||^2 on the path (all generic rows), by type, at Q_0 and Q_top: " + "; ".join(f"{t} {nb3[0, i]/nbf[0, i]:.3f}/{nb3[-1, i]/nbf[-1, i]:.3f}" for i, t in enumerate(TY)))
json.dump(res, open(outjson, 'w'))
# ---- printing
def tab(pn, v, s_, tlist, title):
    o = res['paths'][pn][v]
    P(f"\n{title}  [path {pn}; variant {v}; rows: {res['strata'][s_]}]")
    P("  type        " + " ".join(f"{q:8.0f}" for q in Qs) + "   delta (sd) [95%]            delta, Q>=3750 (sd) [95%]")
    for t in tlist:
        i = TY.index(t)
        P(f"  {t:10s}  " + " ".join(f"{o['r'][j][s_][i]:8.4f}" for j in range(NB)) +
          f"   {o['delta'][s_][i]:+.4f} ({o['delta_sd'][s_][i]:.4f}) [{o['delta_lo'][s_][i]:+.4f}, {o['delta_hi'][s_][i]:+.4f}]   {o['delta_top'][s_][i]:+.4f} ({o['delta_top_sd'][s_][i]:.4f}) [{o['delta_top_lo'][s_][i]:+.4f}, {o['delta_top_hi'][s_][i]:+.4f}]")
P("\nrows (full count, generic) by Q: prime to 6: " + " ".join(f"{int(v[0])}" for v in rows_full) + " | not prime to 6: " + " ".join(f"{int(v[1])}" for v in rows_full))
P("1/sqrt(rows): prime to 6: " + " ".join(f"{1/math.sqrt(v[0]):.4f}" for v in rows_full) + " | not prime to 6: " + " ".join(f"{1/math.sqrt(v[1]):.4f}" for v in rows_full))
for pn in ('R=Q^1.4', 'R=R_top'):
    for v in VAR:
        if pn == 'R=R_top' and v not in ('loo', 'band'): continue
        for s_ in (0, 1, 2):
            tab(pn, v, s_, TY, "r(Q) by row type")
P("\northogonal-phase null (one random phase per row orbit), path R=Q^1.4: rms r by Q, and mean fitted delta (sd over draws)")
for v in NV:
    for s_ in (0, 1, 2):
        P(f"  [{v}; {res['strata'][s_]}]")
        for t in TY:
            i = TY.index(t)
            P(f"  {t:10s}  " + " ".join(f"{res['null'][v]['r'][j][s_][i]:8.4f}" for j in range(NB)) + f"   {res['null'][v]['delta'][s_][i]:+.4f} ({res['null'][v]['delta_sd'][s_][i]:.4f})")
P(f"\ndone {time.time()-t00:.0f}s")
