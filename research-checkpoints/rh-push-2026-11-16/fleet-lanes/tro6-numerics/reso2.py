#!/usr/bin/env python3
"""reso2.py -- the diagonal (Gauss-sum) law for twisted row sums of the complete sextic theta coefficients, and the
resonant / Moebius cubic rows built from it.   usage: reso2.py out.json
  S_sigma(c; Q) = sum_{N(m) <= Q} rho_nat_sigma(-e0 m) chi_c(m)        (c squarefree, prime to 6, N(c) <= 1e5)
  law tested:  S_sigma(c; Q) ~ K(N(c), Q) gamma_1(c) conj(chi_c(-e0))  for sigma = class of c mod 4, small otherwise.
"""
import sys, math, json, numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A, zomega as Z
rng = np.random.default_rng(23)
def P(*a): print(*a, flush=True)
d = np.load('rows_full.npz'); cd = np.load('data/conductors.npz'); E = np.load('E.npy')
ms = d['ms']; Nm = d['Nm']; rho = d['rho_str'] + d['rho_cor']; se = d['se']; six = d['six']; n = len(Nm); QM = int(Nm.max())
fl = d['flags']; cop6 = (fl[:, 0] == 0) & (fl[:, 1] == 0)
cN = cd['cN']; cna = cd['cna']; cnb = cd['cnb']; C = len(cN)
T = A.SFTable(SX + '/data/sf_1e7.npz')
sm = np.flatnonzero(T.N <= 100000)
lut = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(T.na[sm], T.nb[sm]))}
node = sm[[lut[(int(a), int(b))] for a, b in zip(cna, cnb)]]
g1 = T.g1[node]; g2 = T.g2[node]; m4 = T.m4[node].astype(int); m9 = T.m9[node].astype(int); mu = T.mu[node].astype(float)
Gc = T.G()[node]
ne0 = Z.mul((2, 0), Z.power(Z.LAM, 5)); ee0 = T.node_exponents(ne0)[node]
Z6 = np.exp(1j * np.pi * np.arange(6) / 3); LUT = np.concatenate([Z6, [0]])
alpha = ((cna - cnb / 2.0) + 1j * (cnb * math.sqrt(3) / 2.0)) / np.sqrt(cN.astype(float))
pred = g1 * np.conj(Z6[ee0])                                   # gamma_1(c) conj chi_c(-e0)
P(f"rows {n}, Q = {QM}, conductors {C}; identity check gamma1 gamma2 = mu alpha G: max |diff| = {np.abs(g1*g2 - mu*alpha*Gc).max():.2e}")
out = {'rows': n, 'Q': QM}
# estimator weights: rho_hat_sigma(m) = sum_{n in sigma} wt_sigma(n) gt(-e0 m, n) with wt = a_s / (n_{s,sigma} W_sigma) on the shells
# (1000, 1e7] of the WLS fit (alib.fit_binned), 0 for N(n) <= 1000. A conductor c > 1000 therefore enters rho_hat with its own
# term wt(c) gamma_1(c) conj chi_c(-e0 m): a self-term of the estimator. "LOO" (leave-one-out) quantities below remove it.
grid = A.geom_grid(1000, T.X, 90); gsh = np.searchsorted(grid.astype(np.int64), T.N, side='left')
cntT = np.bincount(gsh * 12 + T.m4.astype(np.int64), minlength=len(grid) * 12).reshape(len(grid), 12).astype(float)
a_s = np.concatenate([[0.0], grid.astype(float)[1:] ** (2 / 3) - grid.astype(float)[:-1] ** (2 / 3)])
Wt = (a_s[1:, None] ** 2 / np.maximum(cntT[1:], 1)).sum(0)
csh = np.searchsorted(grid.astype(np.int64), cN, side='left')
wt = np.where(csh >= 1, a_s[csh] / (np.maximum(cntT[csh, m4], 1) * Wt[m4]), 0.0)
P(f"estimator self-term weights: wt(c) = 0 for N(c) <= 1000; wt at N(c) ~ 2e3, 2e4, 9e4: {wt[np.searchsorted(cN, 2000)]:.2e}, {wt[np.searchsorted(cN, 20000)]:.2e}, {wt[np.searchsorted(cN, 90000)]:.2e}; fit se per class {1/math.sqrt(Wt.mean()):.4f}")
Qs = [q for q in (100, 200, 400, 800, 1600, 3200) if q <= QM * 1.01]
bands = [(1, 1), (2, 30), (31, 100), (101, 300), (301, 1000), (1001, 3000), (3001, 10000), (10001, 30000), (30001, 100000)]
order = np.argsort(Nm, kind='stable'); assert (order == np.arange(n)).all()
gen = ~six
# ---------------- 1. resonant-cell sums for all c, cumulative in Q (generic rows)
Sres = np.zeros((len(Qs), C), complex); Soff = np.zeros((len(Qs), C)); Scj = np.zeros((len(Qs), C)); nrm = np.zeros((len(Qs), 12)); nrow = []
acc = np.zeros((12, C), complex); accm = np.zeros((12, C), complex); accn = np.zeros(12); prev = 0; cnt = np.zeros(C); cntQ = np.zeros((len(Qs), C)); Sraw = np.zeros((len(Qs), C), complex)
for qi, q in enumerate(Qs):
    hi = int(np.searchsorted(Nm, q, 'right'))
    for a in range(prev, hi, 400):
        b = min(a + 400, hi); mk = gen[a:b]
        ph = LUT[E[a:b][mk]].astype(np.complex64); X = rho[a:b][mk].astype(np.complex64)
        acc += X.T @ ph; accm += X.T @ np.conj(ph); accn += (np.abs(X) ** 2).sum(0); cnt += (E[a:b][mk] >= 0).sum(0)
    prev = hi
    Sraw[qi] = acc[m4, np.arange(C)]; cntQ[qi] = cnt; Sres[qi] = Sraw[qi] - wt * pred * cnt; nrm[qi] = accn; nrow.append(int(gen[:hi].sum()))
    z = np.abs(acc) ** 2 / accn[:, None]
    Soff[qi] = (z.sum(0) - z[m4, np.arange(C)]) / 11
    Scj[qi] = (np.abs(accm) ** 2 / accn[:, None])[m4, np.arange(C)]
zres = np.abs(Sres) ** 2 / nrm[:, m4]; zraw = np.abs(Sraw) ** 2 / nrm[:, m4]
P("\n1. generic rows. z2_res(c; Q) = |S_sigma(c;Q)|^2 / sum_m |rho_sigma|^2 at sigma = class of c. Columns Q = " + str(Qs))
P("   null value 2, not 1: for c in sigma, chi_c(-1) = chi_sigma(-1), so the terms m and -m are equal (rho_sigma(-y) = chi_sigma(-1) rho_sigma(y)); the conj pairing shows this null")
P("   all values are LOO (estimator self-term removed; it is 0 for N(c) <= 1000); the raw value at Qmax is shown last")
P("   band of N(c): mean z2_res by Q | phase alignment A = |sum_c S_res conj(pred)| / sum_c |S_res| with pred = gamma_1(c) conj chi_c(-e0) at Qmax | other-class mean z2 | conj-pairing z2 at Qmax")
tab1 = []
for lo, hi in bands:
    b = np.flatnonzero((cN >= lo) & (cN <= hi))
    al = abs((Sres[-1, b] * np.conj(pred[b])).sum()) / np.abs(Sres[-1, b]).sum()
    # random-phase baseline for alignment: 1/sqrt(#c)
    row = [lo, hi, len(b)] + [float(zres[qi, b].mean()) for qi in range(len(Qs))] + [float(al), float(Soff[-1, b].mean()), float(Scj[-1, b].mean())]
    tab1.append(row)
    P(f"   [{lo:6d},{hi:6d}] #c={len(b):6d}: " + " ".join(f"{zres[qi, b].mean():8.2f}" for qi in range(len(Qs))) + f" | A = {al:.4f} (random {1/math.sqrt(len(b)):.3f}) | off-class {Soff[-1, b].mean():.3f} | conj {Scj[-1, b].mean():.3f} | raw z2 {zraw[-1, b].mean():.2f}")
out['law'] = {'Qs': Qs, 'rows': nrow, 'bands': tab1}
# exponents: z2_res - 2 ~ K Q^a N(c)^(-b)
xs = []; ys = []; pts = {}
for r in tab1:
    if r[0] < 2: continue
    gm = math.sqrt(r[0] * r[1])
    for qi, q in enumerate(Qs):
        ex = r[3 + qi] - 2
        se_ = 2.0 / math.sqrt(r[2])                      # sd of the band mean under the null
        if q >= 200 and ex > 3 * se_ and ex > 0.3:
            xs.append([1, math.log(q), math.log(gm)]); ys.append(math.log(ex)); pts[(r[0], q)] = ex
xs = np.array(xs); ys = np.array(ys)
co, res_, _, _ = np.linalg.lstsq(xs, ys, rcond=None)
rs_ = ys - xs @ co; cov = np.linalg.inv(xs.T @ xs) * (rs_ @ rs_) / (len(ys) - 3)
P(f"   fit (z2_res - 2) = K Q^a N(c)^(-b) on band means (N(c) >= 2, Q >= 200, excess > 3 null sd; {len(ys)} points): a = {co[1]:.3f} +- {math.sqrt(cov[1,1]):.3f}, b = {-co[2]:.3f} +- {math.sqrt(cov[2,2]):.3f}, K = {math.exp(co[0]):.3f}; rms log residual {math.sqrt(rs_ @ rs_ / len(ys)):.3f}")
out['law_fit'] = {'a': float(co[1]), 'a_se': float(math.sqrt(cov[1, 1])), 'b': float(-co[2]), 'b_se': float(math.sqrt(cov[2, 2])), 'K': float(math.exp(co[0]))}
aband = {}
for r in tab1:
    qq = [q for q in Qs if (r[0], q) in pts]
    if len(qq) >= 3:
        aband[r[0]] = float(np.polyfit(np.log(qq), np.log([pts[(r[0], q)] for q in qq]), 1)[0])
P("   Q-exponent a by band (lower edge of band: a): " + ", ".join(f"{k}: {v:.2f}" for k, v in aband.items()))
bq = {}
for q in Qs:
    rr = [r for r in tab1 if (r[0], q) in pts]
    if len(rr) >= 3:
        bq[q] = float(-np.polyfit(np.log([math.sqrt(r[0] * r[1]) for r in rr]), np.log([pts[(r[0], q)] for r in rr]), 1)[0])
P("   N(c)-exponent b by Q: " + ", ".join(f"{k}: {v:.2f}" for k, v in bq.items()))
P("   functional-equation prediction (dual point u = 1/3, conductor N(y)): inner range N(c) << N(m)^(1/2): a = 5/6, b = 2/3; outer range: a = 3/2, b = 4/3")
out['a_by_band'] = aband; out['b_by_Q'] = bq
# growth exponent of |S_res(c;Q)| in Q for the smallest conductors
P("   growth of |S_res(c; Q)| in Q (log-log slope over Q >= 200) for the smallest conductors, and c = 1 (all six classes with chi_sigma(-1)=+1):")
small = np.argsort(cN, kind='stable')[:16]
gro = []
kq = np.array(Qs) >= 200
for t in small:
    sl = np.polyfit(np.log(np.array(Qs)[kq]), np.log(np.abs(Sres[kq, t])), 1)[0]
    gro.append([int(cN[t]), float(sl), float(zres[-1, t]), float(np.angle(Sres[-1, t] * np.conj(pred[t])))])
P("   " + "; ".join(f"N={g[0]}: slope {g[1]:.3f}, z2 {g[2]:.0f}, phase-pred {g[3]:+.2f}" for g in gro))
sls = np.array([g[1] for g in gro[1:]])
P(f"   mean slope over the 15 smallest c != 1: {sls.mean():.3f} +- {sls.std()/math.sqrt(len(sls)):.3f}   (sum |rho|^2 ~ Q^(5/6) => random walk slope 0.417; n ~ Q => full coherence slope ~ 0.92)")
out['growth'] = gro
# ---------------- 2. how much of rho is spanned by the characters conj(chi_c), c in sigma, N(c) <= Cmax (least squares)
P("\n2. fraction of ||rho_sigma||^2 (generic rows) in the span of {m -> conj chi_c(m) : c in sigma, N(c) <= Cmax}; baseline = same with rho's phases randomised; LOO: the self-terms of these conductors are removed from rho_hat first")
tab2 = []
idxg = np.flatnonzero(gen)
for Cmax in (30, 100, 300, 1000, 3000, 10000, 30000):
    fr = []; fb = []; nc = []
    for s in (0, 2, 4, 8):
        cols = np.flatnonzero((m4 == s) & (cN <= Cmax))
        if len(cols) == 0 or len(cols) > 0.5 * len(idxg): continue
        M = np.conj(LUT[E[idxg][:, cols]])
        Qm, _ = np.linalg.qr(M)
        v = rho[idxg, s] - M @ (wt[cols] * pred[cols]); vr = np.abs(v) * np.exp(2j * np.pi * rng.random(len(v)))
        fr.append(float((np.abs(Qm.conj().T @ v) ** 2).sum() / (np.abs(v) ** 2).sum())); fb.append(float((np.abs(Qm.conj().T @ vr) ** 2).sum() / (np.abs(v) ** 2).sum())); nc.append(len(cols))
    if fr:
        tab2.append([Cmax, float(np.mean(nc)), float(np.mean(fr)), float(np.mean(fb))])
        P(f"   Cmax={Cmax:6d}: characters per class {np.mean(nc):7.1f} of {len(idxg)} rows; captured fraction {np.mean(fr):.4f} (classes 0,2,4,8: {np.round(fr,3).tolist()}); random baseline {np.mean(fb):.4f}")
noise = float((se[gen] ** 2).sum() / (np.abs(rho[gen]) ** 2).sum())
P(f"   noise share of ||rho||^2: {noise:.3f} (the captured fraction of the true coefficient is at most 1 - noise share of the measured one)")
out['span'] = tab2; out['noise_share'] = noise
# ---------------- 3. cubic rows from E: B_m = sum_c gamma_2(c) psi(c) chi_c(m) N(c)^(-1/2) V(N(c)/R),  R in {1e3, 3e3, 1e4}
P("\n3. (LOO: self-terms of the row's conductors removed from rho_hat) cubic rows B_m = sum_c gamma_2(c) psi(c) chi_c(m) N(c)^(-1/2) V(N(c)/R) and their correlation with rho_nat (bilinear pairing sum_m rho B), generic rows")
P("   psi: res = mu conj(alpha G) chi_c(-e0)  [then gamma_2 psi = conj(gamma_1) chi_c(-e0): aligned with the law];  mob = conj(alpha G) chi_c(-e0)  [diagonal part = Moebius sum];")
P("        a = alpha, aG = alpha G [manuscript-type; diagonal part = sum mu alpha^2 G (G) conj chi_c(-e0)];  res*th9 = res x character mod 9;  res*a6 = res x alpha^6")
th9 = np.exp(2j * np.pi * (m9 // 3) / 3)
psis = {'res': mu * np.conj(alpha * Gc) * Z6[ee0], 'mob': np.conj(alpha * Gc) * Z6[ee0], 'a': alpha, 'aG': alpha * Gc,
        'res*th9': mu * np.conj(alpha * Gc) * Z6[ee0] * th9, 'res*a6': mu * np.conj(alpha * Gc) * Z6[ee0] * alpha ** 6}
Rs = [1000, 3000, 10000]
Brow = {}; Dself = {}
for R in Rs:
    lx = np.log(cN / R); idx = np.flatnonzero(np.abs(lx) <= 2.2); w = np.exp(-2 * lx[idx] ** 2) / np.sqrt(cN[idx])
    cf = np.stack([g2[idx] * psis[k][idx] * w for k in psis]).astype(np.complex64)
    Bm = np.zeros((n, len(psis)), complex)
    for a in range(0, n, 400):
        Bm[a:a + 400] = LUT[E[a:a + 400][:, idx]].astype(np.complex64) @ cf.T
    Brow[R] = Bm
    Dm = np.zeros((n, 12), complex)                      # self-terms of the window's conductors, per class
    for s_ in range(12):
        cc = idx[m4[idx] == s_]
        for a in range(0, n, 400):
            Dm[a:a + 400, s_] = np.conj(LUT[E[a:a + 400][:, cc]]) @ (wt[cc] * pred[cc])
    Dself[R] = Dm
chk = np.abs(Brow[10000][:, list(psis).index('a')] - np.load('rows_c.npz')['B'][:, 1]).max()
P(f"   check: row 'a', R = 1e4 rebuilt from stored exponents vs fast.py value: max |diff| = {chk:.2e}")
def rcorr(R_, B_):
    return np.abs((R_ * B_[:, None]).sum(0)) / (np.linalg.norm(R_, axis=0) * np.linalg.norm(B_))
res3 = {}
for R in Rs:
    for ki, k in enumerate(psis):
        rq = []
        for q in Qs:
            mk = gen & (Nm <= q); rq.append(rcorr(rho[mk] - Dself[R][mk], Brow[R][mk, ki]))
        rq = np.array(rq)                                # [Q, sigma]
        rms = np.sqrt((rq ** 2).mean(1)); mx = rq.max(1)
        kq2 = np.array(Qs) >= 200
        dl = -np.polyfit(np.log(np.array(Qs)[kq2]), np.log(rms[kq2]), 1)[0]
        dlm = -np.polyfit(np.log(np.array(Qs)[kq2]), np.log(mx[kq2]), 1)[0]
        # bootstrap over rows for delta (rms)
        bt = []
        gi = np.flatnonzero(gen)
        for _ in range(60):
            ii = np.sort(rng.choice(gi, len(gi)))
            v = [np.sqrt((rcorr((rho - Dself[R])[ii[Nm[ii] <= q]], Brow[R][ii[Nm[ii] <= q], ki]) ** 2).mean()) for q in np.array(Qs)[kq2]]
            bt.append(-np.polyfit(np.log(np.array(Qs)[kq2]), np.log(v), 1)[0])
        nq = int((gen & (Nm <= Qs[-1])).sum())
        P(f"   R={R:6d} psi={k:8s}: rms_sigma r by Q = {np.round(rms, 4).tolist()}; max_sigma r at Qmax = {mx[-1]:.4f} (1/sqrt(rows) = {1/math.sqrt(nq):.4f}); delta(rms) = {dl:.3f} +- {np.std(bt):.3f}; delta(max) = {dlm:.3f}")
        res3[f'{R}|{k}'] = {'rms': rms.tolist(), 'max': mx.tolist(), 'delta': float(dl), 'delta_sd': float(np.std(bt)), 'delta_max': float(dlm), 'per_class_Qmax': rq[-1].tolist()}
out['rows'] = res3
# ---------------- 4. diagonal model for the manuscript-type row: D_sigma = sum_{c in sigma} S_sigma(c) coef(c) vs the full form
P("\n4. diagonal part vs full form at Qmax, R = 1e4 (generic rows): full = sum_m rho_sigma B_m = sum_c coef(c) S_sigma(c); diag = same restricted to c in sigma")
R = 10000; lx = np.log(cN / R); idx = np.flatnonzero(np.abs(lx) <= 2.2); w = np.exp(-2 * lx[idx] ** 2) / np.sqrt(cN[idx])
mk = gen
Sall = np.zeros((12, len(idx)), complex)
for a in range(0, n, 400):
    sub = np.flatnonzero(mk[a:a + 400]) + a
    Sall += (rho - Dself[R])[sub].T.astype(np.complex64) @ LUT[E[sub][:, idx]].astype(np.complex64)
res4 = {}
for k in ('res', 'mob', 'a', 'aG'):
    cf = g2[idx] * psis[k][idx] * w
    full = Sall @ cf
    diag = np.array([(Sall[s, m4[idx] == s] * cf[m4[idx] == s]).sum() for s in range(12)])
    den = np.linalg.norm((rho - Dself[R])[mk], axis=0) * np.linalg.norm(Brow[R][mk, list(psis).index(k)])
    P(f"   psi={k:4s}: |full|/(||rho|| ||B||) per class {np.round(np.abs(full)/den, 4).tolist()}")
    P(f"            |diag|/(||rho|| ||B||) per class {np.round(np.abs(diag)/den, 4).tolist()};  rms full {np.sqrt(np.mean((np.abs(full)/den)**2)):.4f}, rms diag {np.sqrt(np.mean((np.abs(diag)/den)**2)):.4f}, rms off-diagonal {np.sqrt(np.mean((np.abs(full-diag)/den)**2)):.4f}")
    res4[k] = {'full': (np.abs(full) / den).tolist(), 'diag': (np.abs(diag) / den).tolist(), 'off': (np.abs(full - diag) / den).tolist()}
out['diag'] = res4

# ---------------- 5. the diagonal Moebius sum: for psi = a (manuscript type), diag_sigma = sum_{c in sigma} S_sigma(c) gamma_2(c) alpha(c) wt(c)
P("\n5. normalised diagonal Moebius sum rho_M = |sum_{c in sigma} S_sigma(c) coef_psi(c)| / sum_{c in sigma} |S_sigma(c) coef_psi(c)| for psi = a, aG, mob (generic rows);")
P("   N_eff = (sum |S coef|)^2 / sum |S coef|^2 = effective number of conductors; random signs give rho_M sqrt(N_eff) of mean 0.89 (Rayleigh); no cancellation gives rho_M = 1")
res5 = {}
for R in Rs:
    lx = np.log(cN / R); idx = np.flatnonzero(np.abs(lx) <= 2.2); w = np.exp(-2 * lx[idx] ** 2) / np.sqrt(cN[idx])
    for q in (Qs[-3], Qs[-1]):
        hi = int(np.searchsorted(Nm, q, 'right')); sub = np.flatnonzero(gen[:hi])
        Sq = np.zeros((12, len(idx)), complex)
        for a in range(0, len(sub), 400):
            ss = sub[a:a + 400]
            Sq += (rho - Dself[R])[ss].T.astype(np.complex64) @ LUT[E[ss][:, idx]].astype(np.complex64)
        line = []
        for k in ('res', 'a', 'aG', 'mob'):
            cf = g2[idx] * psis[k][idx] * w
            rm = []; ne = []
            for s_ in range(12):
                sel_ = m4[idx] == s_; t = Sq[s_, sel_] * cf[sel_]
                rm.append(abs(t.sum()) / np.abs(t).sum()); ne.append(np.abs(t).sum() ** 2 / (np.abs(t) ** 2).sum())
            rm = np.array(rm); ne = np.array(ne)
            line.append(f"{k}: rho_M rms {np.sqrt((rm**2).mean()):.4f}, N_eff {ne.mean():.0f}, rho_M sqrt(N_eff) rms {np.sqrt((rm**2*ne).mean()):.2f}")
            res5[f'{R}|{q}|{k}'] = [float(np.sqrt((rm ** 2).mean())), float(ne.mean()), float(np.sqrt((rm ** 2 * ne).mean()))]
        P(f"   R={R:6d} Q={q:5d}: " + "; ".join(line))
out['moebius'] = res5
json.dump(out, open(sys.argv[1], 'w'), indent=1)
P("done")
