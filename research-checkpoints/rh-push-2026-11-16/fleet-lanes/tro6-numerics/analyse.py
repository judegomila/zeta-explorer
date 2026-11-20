#!/usr/bin/env python3
"""analyse.py -- TRO6-natural toy numerics: correlation of complete sextic theta coefficients with toy cubic rows.
usage: analyse.py out.json chunk1.npz [chunk2.npz ...]
"""
import sys, json, math
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import zomega as Z
rng = np.random.default_rng(11)
outp = sys.argv[1]; ch = [np.load(f) for f in sys.argv[2:]]
cat = lambda k: np.concatenate([c[k] for c in ch])
ms = cat('ms'); Nm = cat('Nm'); rs = cat('rho_str'); rc = cat('rho_cor'); se = cat('se'); B = cat('B'); fl = cat('flags')
sqf = cat('sqf'); sq = cat('sq'); six = cat('six'); keys = [str(k) for k in ch[0]['keys']]
rho = rs + rc
n = len(Nm); QM = int(Nm.max())
lam, two, unit, nfac, maxe, nterm = [fl[:, i] for i in range(6)]
cop6 = (lam == 0) & (two == 0); sunit = nfac == 0; generic = ~six
out = {'rows': n, 'Qmax': QM, 'keys': keys}
def _orbit(m):
    a, b = int(m[0]), int(m[1]); best = None
    for x in ((a, b), (a - b, -b)):                     # m and its conjugate
        for u in Z.UNITS:
            y = Z.mul(u, x)
            if best is None or y < best: best = y
    return best
_orb = {}
orb = np.array([_orb.setdefault(_orbit(m), len(_orb)) for m in ms])
NORB = len(_orb)
def P(*a): print(*a, flush=True)
P(f"rows {n}, N(m) <= {QM}; prime to 6: {int(cop6.sum())}; S-unit rows: {int(sunit.sum())}; good part 6th power: {int(six.sum())}; squares: {int(sq.sum())}; squarefree good part: {int(sqf.sum())}")
Qs = [q for q in (50, 100, 200, 400, 800, 1600, 3200, 6400) if q <= QM * 1.01]

# ------------------------------------------------------------ A: complete vs stripped; needed mean square
P("\nA. complete (rho_nat = rho_str + rho_cor) vs stripped coefficient; M_nat(Q) = sum_sigma sum_m |rho_nat|^2 (noise-bias corrected, model se)")
tabA = []
for q in Qs:
    s = Nm <= q
    raw = (np.abs(rho[s]) ** 2).sum(); bias = (se[s] ** 2).sum(); rawS = (np.abs(rs[s]) ** 2).sum()
    cor = (np.abs(rc[s]) ** 2).sum()
    inner = abs(np.vdot(rs[s], rho[s])) / math.sqrt(rawS * raw)
    tabA.append([q, int(s.sum()), raw, bias, raw - bias, rawS - bias, cor / rawS, inner])
    P(f"   Q={q:5d} rows={int(s.sum()):6d}  sum|rho_nat|^2={raw:8.3f}  noise bias={bias:7.3f}  M_nat={raw-bias:8.3f}  M_str={rawS-bias:8.3f}  |rho_cor|^2/|rho_str|^2={cor/rawS:.4f}  cos(rho_str,rho_nat)={inner:.5f}")
tA = np.array(tabA)
k = tA[:, 0] >= 100
slN = np.polyfit(np.log(tA[k, 0]), np.log(tA[k, 4]), 1)[0]; slS = np.polyfit(np.log(tA[k, 0]), np.log(tA[k, 5]), 1)[0]
# bootstrap
bs = []
r2 = (np.abs(rho) ** 2).sum(1) - (se ** 2).sum(1)
for _ in range(300):
    idx = rng.integers(0, n, n)
    v = [r2[idx][Nm[idx] <= q].sum() for q in tA[k, 0]]
    bs.append(np.polyfit(np.log(tA[k, 0]), np.log(v), 1)[0])
P(f"   slope of M_nat over Q >= 100: {slN:.3f} (row bootstrap 95% [{np.quantile(bs,.025):.3f}, {np.quantile(bs,.975):.3f}]); stripped: {slS:.3f}; theorem A (MS): <= 5/6 + eps")
sig = 1 - (se ** 2).sum() / (np.abs(rho) ** 2).sum()
P(f"   signal fraction of sum|rho_nat|^2 at Q={QM}: {sig:.3f} (aligned-row sensitivity r ~ {math.sqrt(sig):.3f}); by octave: " +
  ", ".join(f"{q}:{1 - (se[(Nm>q/2)&(Nm<=q)]**2).sum()/(np.abs(rho[(Nm>q/2)&(Nm<=q)])**2).sum():.3f}" for q in Qs))
out['A'] = {'table': tabA, 'slope_nat': float(slN), 'slope_nat_ci': [float(np.quantile(bs, .025)), float(np.quantile(bs, .975))], 'slope_str': float(slS), 'signal_fraction': float(sig)}

# ------------------------------------------------------------ B: correlations
def corr(R_, B_):
    """216 normalised correlations: |<rho_sigma, B_key>| bilinear and sesquilinear."""
    nr = R_ / np.linalg.norm(R_, axis=0); nb = B_ / np.linalg.norm(B_, axis=0)
    return np.concatenate([np.abs(nr.T @ nb).ravel(), np.abs(nr.T @ np.conj(nb)).ravel()])
def surrogate(R_):
    return np.abs(R_) * np.exp(2j * np.pi * rng.random(R_.shape))
def surr_orb(mask):
    """symmetry-preserving null: one random phase per orbit of m under units and conjugation, common to all classes."""
    return rho[mask] * np.exp(2j * np.pi * rng.random(NORB))[orb[mask], None]
NS = 300
rowsets = {'all': np.ones(n, bool), 'generic (good part not a 6th power)': generic, 'prime to 6': cop6, 'prime to 6, generic': cop6 & generic}
P("\nB. normalised correlation r = |sum_m rho_nat_sigma(-e0 m) B_m| / (||rho|| ||B||), 12 classes x 9 toy rows x 2 pairings = 216 pairs")
P("   T = mean over pairs of (rows x r^2): 1 under independent phases (square-root cancellation), grows like rows x r0^2 under a coherent correlation r0")
resB = {}
for name, mask in rowsets.items():
    P(f"  rowset: {name}")
    tab = []
    for q in Qs:
        s = mask & (Nm <= q); ns = int(s.sum())
        c = corr(rho[s], B[s]); T = ns * np.mean(c ** 2); mx = c.max()
        Tn = np.empty(NS); mxn = np.empty(NS)
        for t in range(NS):
            cs = corr(surrogate(rho[s]), B[s]); Tn[t] = ns * np.mean(cs ** 2); mxn[t] = cs.max()
        pT = (Tn >= T).mean(); pm = (mxn >= mx).mean()
        To = np.empty(NS); mo = np.empty(NS)
        for t in range(NS):
            cs = corr(surr_orb(s), B[s]); To[t] = ns * np.mean(cs ** 2); mo[t] = cs.max()
        tab.append([q, ns, float(np.sqrt(np.mean(c ** 2))), float(mx), float(T), float(Tn.mean()), float(Tn.std()), float(pT), float(np.quantile(mxn, .99)), float(pm),
                    float(To.mean()), float(To.std()), float((To >= T).mean()), float(np.quantile(mo, .99)), float((mo >= mx).mean())])
        P(f"   Q={q:5d} rows={ns:6d}  rms r={tab[-1][2]:.4f}  1/sqrt(rows)={1/math.sqrt(ns):.4f}  max r={mx:.4f} (iid null 99% {tab[-1][8]:.4f}, p={pm:.3f}; orbit null 99% {tab[-1][13]:.4f}, p={tab[-1][14]:.3f})  T={T:.3f} (iid null {Tn.mean():.3f} +- {Tn.std():.3f}, p={pT:.3f}; orbit null {To.mean():.3f} +- {To.std():.3f}, p={tab[-1][12]:.3f})")
    resB[name] = tab
out['B'] = resB

# ------------------------------------------------------------ C: exponent fit  r_rms(Q) ~ Q^{-delta}
P("\nC. exponent fit: rms over the 216 pairs of r(Q) on cumulative rows N(m) <= Q, Q = 50 * 2^k; log r = c - delta log Q")
P("   delta = 1/2: square-root cancellation; delta = 0: none. Paper geometry: Z^{-eta b/12} = Q^{-eta/80} (b = 1/8, M' = 5/6), so eta = min(1, 80 delta) for rows of this type")
resC = {}
def dfit(R_, B_, N_):
    v = []
    for q in Qs:
        s = N_ <= q
        v.append(np.sqrt(np.mean(corr(R_[s], B_[s]) ** 2)))
    return -np.polyfit(np.log(Qs), np.log(v), 1)[0]
for name, mask in rowsets.items():
    R_, B_, N_ = rho[mask], B[mask], Nm[mask]
    d0 = dfit(R_, B_, N_)
    nul = np.array([dfit(surrogate(R_), B_, N_) for _ in range(200)])
    nulo = np.array([dfit(surr_orb(mask), B_, N_) for _ in range(200)])
    bt = []
    for _ in range(200):
        idx = rng.integers(0, len(N_), len(N_)); bt.append(dfit(R_[idx], B_[idx], N_[idx]))
    bt = np.array(bt)
    # planted coherent component: B' = B + f ||B|| conj(rho)/||rho|| in the bilinear pairing for class 0
    pl = {}
    for f in (0.05, 0.1, 0.2):
        Bp = B_ + f * np.linalg.norm(B_, axis=0)[None, :] * (np.conj(R_[:, :1]) / np.linalg.norm(R_[:, 0]))
        pl[f] = float(dfit(R_, Bp, N_))
    P(f"   {name:38s}: delta = {d0:.3f}; row bootstrap sd {bt.std():.3f}, 95% [{np.quantile(bt,.025):.3f}, {np.quantile(bt,.975):.3f}]; iid-phase null {nul.mean():.3f} +- {nul.std():.3f}; orbit null {nulo.mean():.3f} +- {nulo.std():.3f}; planted aligned fraction f=0.05/0.1/0.2 (one class) -> delta {pl[0.05]:.3f}/{pl[0.1]:.3f}/{pl[0.2]:.3f}")
    resC[name] = {'delta': float(d0), 'boot_sd': float(bt.std()), 'boot95': [float(np.quantile(bt, .025)), float(np.quantile(bt, .975))], 'null_mean': float(nul.mean()), 'null_sd': float(nul.std()), 'orbit_null': [float(nulo.mean()), float(nulo.std())], 'planted': pl}
# per key
P("   per toy row (generic rows), delta and T at Qmax:")
for j, kname in enumerate(keys):
    R_, B_, N_ = rho[generic], B[generic][:, j:j + 1], Nm[generic]
    d0 = dfit(R_, B_, N_); c = corr(R_, B_); T = len(N_) * np.mean(c ** 2)
    nul = np.array([len(N_) * np.mean(corr(surrogate(R_), B_) ** 2) for _ in range(200)])
    P(f"     {kname:12s}: delta = {d0:.3f}; T = {T:.2f} (null {nul.mean():.2f} +- {nul.std():.2f}); max r = {c.max():.4f}")
    resC['key ' + kname] = {'delta': float(d0), 'T': float(T), 'null_T': [float(nul.mean()), float(nul.std())]}
# upper bound on a coherent Q-independent correlation
sg = generic
c = corr(rho[sg], B[sg]); ng = int(sg.sum())
sens = math.sqrt(max(1 - (se[sg] ** 2).sum() / (np.abs(rho[sg]) ** 2).sum(), 0))
P(f"   generic rows at Q={QM}: max over 216 pairs r = {c.max():.4f}; dividing by sensitivity {sens:.3f}: no pair has a coherent normalised correlation above {c.max()/sens:.4f} (noise floor 1/sqrt(rows) = {1/math.sqrt(ng):.4f})")
out['C'] = resC; out['C_bound'] = {'max_r': float(c.max()), 'sensitivity': sens, 'rows': ng}

# ------------------------------------------------------------ D: structured sub-families
P("\nD. sub-families of rows: z2 = rows x r^2 per pair; nulls are the orbit null (one phase per orbit of m under units and conjugation)")
def sub_report(name, mask, show=True):
    ns = int(mask.sum())
    if ns < 12: return None
    c = corr(rho[mask], B[mask]); z2 = ns * c ** 2
    mxn = np.array([ns * corr(surrogate(rho[mask]), B[mask]).max() ** 2 for _ in range(200)])
    Tn = np.array([ns * np.mean(corr(surrogate(rho[mask]), B[mask]) ** 2) for _ in range(200)])
    so = [corr(surr_orb(mask), B[mask]) for _ in range(200)]
    Tn = np.array([ns * np.mean(c_ ** 2) for c_ in so]); mxn = np.array([ns * c_.max() ** 2 for c_ in so])
    i = int(np.argmax(z2)); pair = ('bi' if i < 108 else 'sesq', (i % 108) // 9, keys[(i % 108) % 9])
    T = float(z2.mean())
    if show:
        P(f"   {name:46s} rows={ns:6d}  T={T:6.2f} (null {Tn.mean():.2f}+-{Tn.std():.2f}, p={(Tn>=T).mean():.3f})  max z2={z2.max():7.2f} (null 99% {np.quantile(mxn,.99):.1f}, p={(mxn>=z2.max()).mean():.3f}) max r={c.max():.4f} at {pair}")
    return dict(rows=ns, T=T, T_null=[float(Tn.mean()), float(Tn.std())], pT=float((Tn >= T).mean()), max_z2=float(z2.max()), max_r=float(c.max()), null99=float(np.quantile(mxn, .99)), p=float((mxn >= z2.max()).mean()), pair=str(pair))
fam = {
 'S-unit rows (good part 1)': sunit,
 'good part a 6th power': six,
 'good part a square, not 6th power': sq & ~six,
 'good part squarefree, != 1': sqf & ~sunit,
 'good part neither squarefree nor square': ~sqf & ~sq,
 'good part prime': (nfac == 1) & (maxe == 1),
 'good part product of 2 primes': (nfac == 2) & (maxe == 1),
 'good part product of >= 3 primes': (nfac >= 3) & (maxe == 1),
 'lambda | m': lam > 0, '2 | m': two > 0, 'prime to 6': cop6,
 'N(m) in top octave': Nm > QM / 2,
}
resD = {}
for name, mask in fam.items():
    resD[name] = sub_report(name, mask)
# by valuation strata and unit
for a in range(0, 4):
    for b in range(0, 3):
        mk = (lam == a) & (two == b) & generic
        resD[f'v_lam={a}, v_2={b}, generic'] = sub_report(f'v_lam={a}, v_2={b}, generic', mk)
# residue classes of m mod 9 (rows prime to lambda): 54 classes, look-elsewhere over classes
ma = ms[:, 0] % 9; mb = ms[:, 1] % 9; cls9 = ma * 9 + mb
nl = lam == 0
zc = []
for cl in np.unique(cls9[nl]):
    mk = nl & (cls9 == cl) & generic
    if mk.sum() < 30: continue
    c = corr(rho[mk], B[mk]); zc.append((mk.sum() * c.max() ** 2, mk.sum() * np.mean(c ** 2), int(cl), int(mk.sum())))
zc.sort(reverse=True)
P(f"   classes of m mod 9 (generic rows prime to lambda): {len(zc)} classes; mean T over classes = {np.mean([z[1] for z in zc]):.3f}; largest max z2 = {zc[0][0]:.1f} (class {zc[0][2]}, rows {zc[0][3]}); expected max of {len(zc)*216} null pairs ~ {math.log(len(zc)*216):.1f} +- 1.3")
resD['mod 9 classes'] = {'n_classes': len(zc), 'mean_T': float(np.mean([z[1] for z in zc])), 'max_z2': float(zc[0][0])}
m4 = (ms[:, 0] % 4) * 4 + ms[:, 1] % 4
zc = []
for cl in np.unique(m4[two == 0]):
    mk = (two == 0) & (m4 == cl) & generic
    if mk.sum() < 30: continue
    c = corr(rho[mk], B[mk]); zc.append((mk.sum() * c.max() ** 2, mk.sum() * np.mean(c ** 2), int(cl), int(mk.sum())))
zc.sort(reverse=True)
P(f"   classes of m mod 4 (generic odd rows): {len(zc)} classes; mean T = {np.mean([z[1] for z in zc]):.3f}; largest max z2 = {zc[0][0]:.1f}; expected null max ~ {math.log(len(zc)*216):.1f} +- 1.3")
resD['mod 4 classes'] = {'n_classes': len(zc), 'mean_T': float(np.mean([z[1] for z in zc])), 'max_z2': float(zc[0][0])}
out['D'] = resD

# D2: the structured part in absolute terms: share of the bilinear form carried by structured rows
P("\nD2. where sum_m rho B is carried (pairing with the largest all-rows correlation):")
nr = rho / np.linalg.norm(rho, axis=0); nb = B / np.linalg.norm(B, axis=0)
Mbi = nr.T @ nb; Mse = nr.T @ np.conj(nb)
big = Mbi if np.abs(Mbi).max() >= np.abs(Mse).max() else Mse
s0, k0 = np.unravel_index(np.argmax(np.abs(big)), big.shape)
bb = nb[:, k0] if big is Mbi else np.conj(nb[:, k0])
tot = (nr[:, s0] * bb).sum()
P(f"   pair (class {s0}, key {keys[k0]}, {'bilinear' if big is Mbi else 'sesquilinear'}): r_all = {abs(tot):.4f}")
for name, mask in [('S-unit rows', sunit), ('6th-power good part', six), ('square good part', sq), ('generic', generic), ('odd good part (not a square)', ~sq)]:
    part = (nr[mask, s0] * bb[mask]).sum()
    P(f"     {name:30s} rows={int(mask.sum()):6d}: partial sum {abs(part):.4f} (component along total {float((part * np.conj(tot)).real / abs(tot)):+.4f}); share of ||rho||^2 {float((np.abs(nr[mask, s0])**2).sum()):.4f}, share of ||B||^2 {float((np.abs(nb[mask, k0])**2).sum()):.4f}")
out['D2'] = {'pair': [int(s0), keys[k0]], 'r_all': float(abs(tot))}

# ------------------------------------------------------------ E: class-function component of rho_nat on rows prime to 6
P("\nE. class-function component of rho_nat(-e0 m) on generic rows prime to 6: model rho_sigma(m) = h_sigma(class of m) N(m)^{-kappa}")
P("   fit on even-indexed rows, test on odd-indexed rows; explained = 1 - sum|rho - model|^2 / sum|rho|^2 on held-out rows, noise-corrected denominators")
resE = {}
base = cop6 & generic
idx = np.flatnonzero(base); tr = idx[::2]; te = idx[1::2]
cls36 = cls9 * 16 + m4
def classfit(cls, kappa):
    num = 0.0; den = 0.0; pred = np.zeros((n, 12), complex)
    w = Nm.astype(float) ** kappa
    for cl in np.unique(cls[idx]):
        a = tr[cls[tr] == cl]; b_ = te[cls[te] == cl]
        if len(a) == 0: continue
        h = (rho[a] * w[a, None]).mean(0)
        pred[b_] = h[None, :] / w[b_, None]
    res = (np.abs(rho[te] - pred[te]) ** 2).sum(); tot = (np.abs(rho[te]) ** 2).sum(); nz = (se[te] ** 2).sum()
    return 1 - (res - nz) / (tot - nz), pred
for cname, cls in [('m mod 9 (54 classes)', cls9), ('m mod 4 (12 classes)', m4), ('m mod 36 (648 classes)', cls36)]:
    best = max(((classfit(cls, kp)[0], kp) for kp in (0.0, 1 / 12, 1 / 6, 0.25)), key=lambda t: t[0])
    ex, pred = classfit(cls, best[1])
    # null: shuffle class labels
    sh = []
    for _ in range(20):
        perm = cls.copy(); perm[idx] = rng.permutation(cls[idx]); sh.append(classfit(perm, best[1])[0])
    # correlation of the class part and of the remainder with B on held-out rows
    cp = corr(pred[te], B[te]); cr = corr(rho[te] - pred[te], B[te]); nt = len(te)
    P(f"   {cname:26s}: held-out explained fraction {ex:+.4f} at kappa={best[1]:.3f} (label-shuffle null {np.mean(sh):+.4f} +- {np.std(sh):.4f}); "
      f"class part vs B: T={nt*np.mean(cp**2):.2f}, max r={cp.max():.4f}; remainder vs B: T={nt*np.mean(cr**2):.2f}, max r={cr.max():.4f}; rows(test)={nt}")
    resE[cname] = {'explained': float(ex), 'kappa': best[1], 'null': [float(np.mean(sh)), float(np.std(sh))], 'T_class': float(nt * np.mean(cp ** 2)), 'T_rem': float(nt * np.mean(cr ** 2))}
# prime rows only, mod 9
pr = cop6 & (nfac == 1) & (maxe == 1)
idxp = np.flatnonzero(pr); trp = idxp[::2]; tep = idxp[1::2]
def classfit_p(cls, kappa):
    pred = np.zeros((n, 12), complex); w = Nm.astype(float) ** kappa
    for cl in np.unique(cls[idxp]):
        a = trp[cls[trp] == cl]; b_ = tep[cls[tep] == cl]
        if len(a) == 0: continue
        pred[b_] = (rho[a] * w[a, None]).mean(0)[None, :] / w[b_, None]
    res = (np.abs(rho[tep] - pred[tep]) ** 2).sum(); tot = (np.abs(rho[tep]) ** 2).sum(); nz = (se[tep] ** 2).sum()
    return 1 - (res - nz) / (tot - nz)
for cname, cls in [('prime rows, m mod 9', cls9), ('prime rows, m mod 36', cls36)]:
    best = max(((classfit_p(cls, kp), kp) for kp in (0.0, 1 / 12, 1 / 6, 0.25)), key=lambda t: t[0])
    P(f"   {cname:26s}: held-out explained fraction {best[0]:+.4f} at kappa={best[1]:.3f}; prime rows {len(idxp)}")
    resE[cname] = {'explained': float(best[0]), 'kappa': best[1], 'rows': int(len(idxp))}
out['E'] = resE

# ------------------------------------------------------------ F: row sums of rho against smooth/character weights (Poisson side)
P("\nF. row first moments of rho_nat: |sum_m rho_sigma(-e0 m) psi(m)| / ||rho_sigma|| x sqrt(rows)^0 as z (null rms 1), psi = 1, angular (m/|m|)^l")
ang = np.exp(1j * np.angle(ms[:, 0] - ms[:, 1] / 2 + 1j * ms[:, 1] * math.sqrt(3) / 2))
resF = {}
for name, mask in [('all', np.ones(n, bool)), ('generic', generic)]:
    for l in (0, 1, 2, 3, 6):
        w = ang[mask] ** l
        z = np.abs((rho[mask] * w[:, None]).sum(0)) / np.sqrt((np.abs(rho[mask]) ** 2).sum(0))
        P(f"   {name:8s} l={l}: sum of z^2 over 12 classes = {float((z**2).sum()):6.1f} (null 12 +- 3.5); max z = {z.max():.2f}")
        resF[f'{name}|{l}'] = float((z ** 2).sum())
out['F'] = resF

# F2: growth of the coherent row first moment on the classes with chi_sigma(-1) = +1
ev = [s_ for s_ in range(12) if abs(rho[:, s_].sum()) / math.sqrt((np.abs(rho[:, s_]) ** 2).sum()) > 2]
Fq = np.array([[abs(rho[Nm <= q][:, s_].sum()) for s_ in ev] for q in Qs])
Mq = np.array([[(np.abs(rho[Nm <= q][:, s_]) ** 2).sum() - (se[Nm <= q][:, s_] ** 2).sum() for s_ in ev] for q in Qs])
kq = np.array(Qs) >= 100
slF = [float(np.polyfit(np.log(np.array(Qs)[kq]), np.log(Fq[kq, j]), 1)[0]) for j in range(len(ev))]
slM = [float(np.polyfit(np.log(np.array(Qs)[kq]), np.log(Mq[kq, j]), 1)[0]) for j in range(len(ev))]
# noise sd of F: sqrt(sum se^2)
sdF = [math.sqrt((se[:, s_] ** 2).sum()) for s_ in ev]
P(f"F2. coherent classes {ev}: |F_sigma(Q)| = |sum_(N(m)<=Q) rho_sigma| at Q={Qs}:")
for j, s_ in enumerate(ev):
    P(f"   class {s_:2d}: {np.round(Fq[:, j], 3).tolist()}  slope (Q>=100) {slF[j]:.3f}; noise sd of F at Qmax {sdF[j]:.3f}; M_sigma slope {slM[j]:.3f}; z = F/sqrt(M) at Qmax {Fq[-1, j]/math.sqrt(Mq[-1, j]):.2f}")
P(f"   mean slope of F: {np.mean(slF):.3f} +- {np.std(slF)/math.sqrt(max(len(ev)-1,1)):.3f} (random walk would be M-slope/2 = {np.mean(slM)/2:.3f})")
out['F2'] = {'classes': ev, 'F': Fq.tolist(), 'slopes': slF, 'M_slopes': slM}

# ------------------------------------------------------------ G: the weights of the theta-row form: Omega(q_m/Q) (q_m/Q)^{-iv}, rows prime to 6
P("\nG. theta-row form with the manuscript's row weights: Omega(x) = sin^2(pi x) on (0,1), factor (N(m)/Q)^{-iv}, rows prime to 6 (xi(m) != 0), generic")
resG = {}
for q in [QM // 4, QM // 2, QM]:
    for v in (0.0, 2.0, 10.0):
        mk = cop6 & generic & (Nm <= q); x = Nm[mk] / q
        w = np.sin(np.pi * x) ** 2 * np.exp(-1j * v * np.log(x))
        Rw = rho[mk] * w[:, None]
        c = corr(Rw, B[mk]); neff = (np.abs(w) ** 2).sum() ** 2 / (np.abs(w) ** 4).sum()
        cs = np.array([np.mean(corr(surrogate(rho[mk]) * w[:, None], B[mk]) ** 2) for _ in range(100)])
        P(f"   Q={q:5d} v={v:4.1f}: rows {int(mk.sum())} (effective {neff:.0f}); rms r = {np.sqrt(np.mean(c**2)):.4f}; mean r^2 / null mean r^2 = {np.mean(c**2)/cs.mean():.3f} (null sd {cs.std()/cs.mean():.3f}); max r = {c.max():.4f}")
        resG[f'{q}|{v}'] = [float(np.sqrt(np.mean(c ** 2))), float(np.mean(c ** 2) / cs.mean()), float(cs.std() / cs.mean()), float(c.max())]
out['G'] = resG
json.dump(out, open(outp, 'w'), indent=1, default=str)
P("done")
