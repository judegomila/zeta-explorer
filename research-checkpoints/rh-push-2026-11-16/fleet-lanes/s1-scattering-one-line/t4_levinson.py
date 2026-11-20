"""Combination 4: finite-T Levinson numbers with and without the Jensen step.
kappa_J = 1 - log(mean |V psi|^2)/R,   kappa_nJ = 1 - (2/R) mean log|V psi|,   at sigma0 = 1/2 - R/L, L = log T, V = F + F'/L,
mean over t uniform in [T, 2T] (Monte Carlo, M points). Usage: t4_levinson.py T M [theta] [R]"""
import sys, json, math, time, numpy as np
import lib
from lib import *
T = float(sys.argv[1]); M = int(float(sys.argv[2])); TH = eval(sys.argv[3]) if len(sys.argv) > 3 else 4 / 7; R = float(sys.argv[4]) if len(sys.argv) > 4 else 1.3
QN, CN = 3, 2.2
y = int(T ** TH)
rng = np.random.default_rng(4040 + int(math.log10(T))); t = np.sort(rng.uniform(T, 2 * T, M))
print('T %g M %d theta %.4f R %.2f y %d gpu %s' % (T, M, TH, R, y, lib.GPU), flush=True)
NF = float(__import__('os').environ.get('S1_NFAC', '0.3'))
BD = 2000
AE = 0.25
# per function: degree d, conductor q; L_F = d log(q T / 2 pi); sigma0 = 1/2 - R/L_F; V = F + F'/L_F
CONF = {'ZETA': (1, 1), 'LCHI': (1, 5), 'DH': (1, 5), 'TNR': (1, QN * QN), 'EA_1_4': (2, 1)}
LF = {k: d * math.log(q * T / (2 * math.pi)) for k, (d, q) in CONF.items()}
SIG = {k: 0.5 - R / LF[k] for k in CONF}
def batched(q, sig):
    Rr = []; Rd = []
    for b in range(0, M, BD):
        a, d = hurwitz_batch(t[b:b + BD], sig, q, Nfac=NF); Rr.append(a); Rd.append(d)
    return np.concatenate(Rr, axis=1), np.concatenate(Rd, axis=1)
t0 = time.time()
Rz, Rzd = batched(1, SIG['ZETA']); z, zd = Rz[0], Rzd[0]
print('zeta done %.0fs' % (time.time() - t0), flush=True)
R5, R5d = batched(5, SIG['LCHI'])
print('mod 5 done %.0fs' % (time.time() - t0), flush=True)
chi = CHI5[1:5]
Lc, Lcd = chi @ R5[:4], chi @ R5d[:4]; Lb, Lbd = np.conj(chi) @ R5[:4], np.conj(chi) @ R5d[:4]
dh, dhd = C1 * Lc + C2 * Lb, C1 * Lcd + C2 * Lbd
Rn, Rnd = batched(1, SIG['TNR']); zn, znd = Rn[0], Rnd[0]
s = SIG['TNR'] + 1j * t
qz = np.exp((s - 0.5) * math.log(QN)); m = qz + CN + 1 / qz; md = math.log(QN) * (qz - 1 / qz)
Ra, Rad = batched(1, SIG['EA_1_4'] + AE); Rb, Rbd = batched(1, SIG['EA_1_4'] - AE)
F = {'ZETA': (z, zd), 'LCHI': (Lc, Lcd), 'DH': (dh, dhd), 'TNR': (zn * m, znd * m + zn * md), 'EA_1_4': (Ra[0] * Rb[0], Rad[0] * Rb[0] + Ra[0] * Rbd[0])}
print('values done %.0fs' % (time.time() - t0), flush=True)

# coefficient arrays to y
n = np.arange(y + 1)
mu = mobius_upto(y).astype(complex)
a_dh = DHPER[n % 5].astype(complex); a_dh[0] = 0
b_dh = dirichlet_inverse(a_dh, y)
chin = CHI5[n % 5]
Pw = np.zeros(y + 1); Pw[1:] = np.log(y / n[1:]) / math.log(y)
def dpoly(coef):
    """sum_{n<=y} coef(n) n^{-1/2 - it}"""
    res = []
    w = xp.asarray(coef[1:] / np.sqrt(n[1:])); ln = xp.log(xp.arange(1, y + 1, dtype=xp.float64))
    for b in range(0, M, BD):
        ph = xp.outer(xp.asarray(t[b:b + BD]), ln); res.append(asnp((xp.cos(ph) - 1j * xp.sin(ph)) @ w))
    return np.concatenate(res)
pr = primes_upto(200)
def primorial(local_inv, P):
    out = np.ones(M, dtype=complex)
    for p in pr[pr <= P]:
        out *= local_inv(int(p), np.exp(-(0.5 + 1j * t) * math.log(p)))
    return out
def loc_zeta(p, u): return 1 - u
def loc_chi(p, u): return 1 - CHI5[p % 5] * u
def loc_dh(p, u):
    f = np.zeros(M, dtype=complex); pk = 1; uk = np.ones(M, dtype=complex)
    for k in range(0, 90):
        f += DHPER[pk % 5] * uk; pk = (pk * p) % 5; uk = uk * u
    return 1 / f
def loc_tnr(p, u):
    return (1 - u) / (1 + CN * math.sqrt(QN) * u + QN * u * u) if p == QN else 1 - u    # inverse of zeta_p times m~ (as a power series in q^{-s}); diverges at Re s < 1/2 + b only as a series, the rational function is used
moll = {
 'ZETA': {'none': np.ones(M), 'MOB_y': dpoly(mu * Pw), 'MOB_y_flat': dpoly(mu * (Pw > 0)), 'EUL_11': primorial(loc_zeta, 11), 'EUL_101': primorial(loc_zeta, 101)},
 'LCHI': {'none': np.ones(M), 'MOB_y': dpoly(mu * chin * Pw), 'EUL_11': primorial(loc_chi, 11), 'EUL_101': primorial(loc_chi, 101)},
 'DH': {'none': np.ones(M), 'INV_y': dpoly(b_dh * Pw), 'INV_30': dpoly(np.where(n <= 30, b_dh, 0) * Pw ** 0), 'MOBCHI_y': dpoly(mu * chin * Pw),
        'MOBREAL_y': dpoly(mu * np.real(chin * chin) * Pw), 'EUL_11': primorial(loc_dh, 11), 'EUL_101': primorial(loc_dh, 101)},
 'TNR': {'none': np.ones(M), 'MOB_y': dpoly(mu * Pw), 'EUL_11': primorial(loc_zeta, 11), 'EULTNR_11': primorial(loc_tnr, 11), 'EULTNR_101': primorial(loc_tnr, 101)},
}
print('max |Dirichlet inverse coefficient of DH| up to y:', float(np.abs(b_dh).max()), 'at n =', int(np.abs(b_dh).argmax()), flush=True)
moll['EA_1_4'] = {'none': np.ones(M)}
def nzeros(name):
    kap, q = (1, 5) if name in ('LCHI', 'DH') else (0, 1)
    N = (theta_generic(2 * T, q, kap) - theta_generic(T, q, kap)) / math.pi
    if name == 'TNR': N += T * math.log(QN) / math.pi
    if name == 'EA_1_4': N *= 2
    return float(N)
# least-squares optimal mollifier of length yl: minimise mean |V psi|^2 over psi = sum_{n<=yl} b_n n^{-1/2-it}, b_1 = 1; fit on even samples, test on odd
def lsq(V, yl):
    ln = xp.log(xp.arange(1, yl + 1, dtype=xp.float64)); w = xp.exp(-0.5 * ln)
    announce('design matrix complex128[%d x %d]' % (M, yl), 16 * M * yl)
    A = xp.zeros((M, yl), dtype=xp.complex128)
    for b in range(0, M, BD):
        ph = xp.outer(xp.asarray(t[b:b + BD]), ln); A[b:b + BD] = (xp.cos(ph) - 1j * xp.sin(ph)) * w[None, :] * xp.asarray(V[b:b + BD])[:, None]
    perm = np.random.default_rng(99).permutation(M); tr = xp.asarray(perm[:M // 2]); te = xp.asarray(perm[M // 2:])
    Atr = A[tr]; G = Atr.conj().T @ Atr / len(tr)
    e1 = xp.zeros(yl, dtype=xp.complex128); e1[0] = 1
    G = G + 1e-12 * xp.trace(G).real / yl * xp.eye(yl)
    x = xp.linalg.solve(G, e1); bcoef = x / x[0]
    rt = xp.abs(Atr @ bcoef); re = xp.abs(A[te] @ bcoef)
    return float((rt**2).mean()), float((re**2).mean()), float(xp.log(re).mean()), float((re**2).std() / math.sqrt(len(te))), float(xp.log(re).std() / math.sqrt(len(te))), asnp(bcoef)
out = {'T': T, 'M': M, 'theta': TH, 'R': R, 'LF': LF, 'sigma0': SIG, 'y': y, 'rows': []}
print('\nfunction | mollifier | mean|V psi|^2 (se) | kappa_J | mean log|V psi| (se) | kappa_nJ | rho | kappa_J folded | kappa_nJ folded')
for name, (f, fd) in F.items():
    L = LF[name]; V = f + fd / L; N = nzeros(name); rho = L * T / (2 * math.pi * N)
    rows = []
    for mn, ps in moll[name].items():
        A = np.abs(V * ps); la = np.log(A)
        rows.append((mn, float((A**2).mean()), float((A**2).std() / math.sqrt(M)), float(la.mean()), float(la.std() / math.sqrt(M)), None))
    for yl in sorted(set([30, 300, y])):
        if 4 * yl > M or yl > int(__import__('os').environ.get('S1_LSQMAX', '3000')): continue
        tr_ms, te_ms, te_ml, se1, se2, bc = lsq(V, yl)
        rows.append(('LSQ_%d(test half)' % yl, te_ms, se1, te_ml, se2, tr_ms))
    for mn, ms, se, ml, sel, trms in rows:
        row = {'function': name, 'mollifier': mn, 'meansq': ms, 'se_meansq': se, 'kappa_J': 1 - math.log(ms) / R, 'meanlog': ml, 'se_meanlog': sel,
               'kappa_nJ': 1 - 2 * ml / R, 'se_kappa_nJ': 2 * sel / R, 'rho': rho, 'kappa_J_folded': 1 - rho * math.log(ms) / R, 'kappa_nJ_folded': 1 - rho * 2 * ml / R, 'train_meansq': trms}
        out['rows'].append(row)
        print('%s | %s | %.4f (%.4f)%s | %.4f | %.5f (%.5f) | %.4f | %.4f | %.4f | %.4f' % (name, mn, ms, se, '' if trms is None else ' [train %.4f]' % trms, row['kappa_J'], ml, sel, row['kappa_nJ'], rho, row['kappa_J_folded'], row['kappa_nJ_folded']), flush=True)
json.dump(out, open('t4_result_T%g_M%d.json' % (T, M), 'w'), indent=1)
