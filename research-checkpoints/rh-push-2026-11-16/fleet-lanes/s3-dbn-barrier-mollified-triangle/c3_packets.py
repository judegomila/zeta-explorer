"""Combination 3. Modulus-last against modulus-first on the 25 defect packets of native/gate2-lane-a/main.c (locked convention:
b_n = exp((t/4) ln^2 n) on both ladders, frozen chart, real gamma, reflected ladder e^{+i theta}), row t = 24727519/2e8, y = 0.1809.
  carrier  c_n = a(n) b_n n^-sB e^{-i th_n} + gamma conj(a(n)) b_n n^-sA e^{+i th_n},  th_n = (x/2) ln n,  n <= N(x)
  classes  j = 1..25 <-> smallest prime factor 97..2; class 0: no prime factor <= 97
  D_j = A_{<j} (q_j G_j - H_j),  q_p = w(p) b_p p^-sB e^{-i th_p},  G_j = classes 0..j,  H_j = class j;  sum_j D_j = C - A F  (algebra, any a, any w)
  rho = |sum D_j| / sum |D_j|
Usage: c3_packets.py NSAMP [XMAX] [funcs]"""
import sys, math, json, time
import mpmath as mp
from lib import *
mp.mp.dps = 40
NS = int(float(sys.argv[1])); XMAX = float(sys.argv[2]) if len(sys.argv) > 2 else 1e13
FUN = sys.argv[3].split(',') if len(sys.argv) > 3 else ['ZETA', 'LCHI5', 'SGN', 'U', 'DH:chi', 'DH:asif', 'TNR']
TR = 24727519 / 200000000; YR = 0.1809; REX = 0.2796881955526244
PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
WIT = (mp.mpf(float('6.00000391660880176e12')) + mp.mpf(float('-4.86139054735625878e-4')))
WITD = [(3.10435109983544372e-4, -4.72441330248262641e-4), (-7.85288227407461277e-5, -8.85193126166321687e-4), (-6.18765728621471496e-4, -1.87069913321685907e-4), (2.99081121916596642e-4, 9.68798642787937125e-4), (-6.98605745410477304e-4, -5.37646993811908441e-4), (-4.03811008442862688e-4, -9.9487853873287996e-4), (-5.38425955701716695e-4, 7.75475513327235182e-4), (-4.88197640902682869e-4, -1.12923568573681968e-3), (5.89355082722170108e-4, -1.03811350082222377e-3), (-6.61768785791839228e-4, 1.0561093823598152e-3), (-1.03913071810868393e-3, 7.85720529828592084e-4), (-1.32234150113462565e-3, 5.42136966580043138e-4), (-1.11317216853307394e-3, -1.45288978936596621e-3), (-1.33235601441105003e-4, 1.97802847842161933e-3), (7.05061676114130493e-4, -2.28290735680524099e-3), (-5.42340493937086532e-4, -2.54024343872676344e-3), (-3.01862738645539185e-3, 2.45099756386281821e-4), (-3.69224397009670999e-3, 1.50054932461564307e-3), (-1.62558349588368231e-3, 3.90701791379149607e-3), (3.2650617409227512e-3, 6.52330457602816067e-3), (1.3016628185326918e-3, 5.99915652944272085e-3), (1.12157415969759353e-2, 1.23545160640272118e-2), (1.96818857923227071e-2, 1.27523290029750228e-2), (5.60030880150761134e-2, 2.06012459562207109e-2), (9.75300352048947272e-2, -1.00755779342939274e-2)]

rng = np.random.default_rng(SEED)
xs = np.sort(np.exp(rng.uniform(math.log(1e6), math.log(XMAX), NS)))
pts = [mp.mpf(float(x)) for x in xs] + [WIT]
FOURPI = 4 * mp.pi
Yh = np.zeros(len(pts)); Yl = np.zeros(len(pts)); Nx = np.zeros(len(pts), dtype=np.int64)
for i, x in enumerate(pts):
    Y = x / FOURPI; Yh[i] = float(Y); Yl[i] = float(Y - mp.mpf(Yh[i])); Nx[i] = int(mp.floor(mp.sqrt(Y + mp.mpf(TR) / 16)))
order = np.argsort(Nx, kind='stable'); NMAXX = int(Nx.max())
print('samples %d (+ witness), N from %d to %d, sum of N %.3e, gpu %s' % (NS, Nx.min(), NMAXX, float(Nx.sum()), GPU), flush=True)
# ln n as double-double
t0 = time.time()
Lh = np.zeros(NMAXX + 1); Ll = np.zeros(NMAXX + 1)
if np.finfo(np.longdouble).nmant >= 63:
    l = np.log(np.arange(1, NMAXX + 1, dtype=np.longdouble)); Lh[1:] = l.astype(np.float64); Ll[1:] = (l - Lh[1:].astype(np.longdouble)).astype(np.float64)
else:
    for n in range(2, NMAXX + 1):
        v = mp.log(n); Lh[n] = float(v); Ll[n] = float(v - mp.mpf(Lh[n]))
La = np.rint(Lh * 2.0**22) / 2.0**22; Lb = Lh - La
# classes by smallest prime factor
cls = np.zeros(NMAXX + 1, dtype=np.int64)
for i, p in enumerate(PR[::-1]): cls[p::p] = i + 1            # ascending overwrite in descending prime order: last write = smallest prime
cls[0] = 0
print('tables %.0fs' % (time.time() - t0), flush=True)
# coefficient / weight tables
def base(f): return f.split(':')[0]
def wq(f, p):
    b = base(f)
    if f == 'DH:chi': return complex(CHI5[p % 5])
    if f == 'DH:asif': return complex(DHPER[p % 5])
    if b == 'TNR': return 1.0
    return complex(a_prime(b, p))
nF = len(FUN)
CO = sorted(set(base(f) for f in FUN)); gA = {c: xp.asarray(coefs(c, NMAXX).astype(np.complex128)[1:]) for c in CO}
gcls = xp.asarray(cls[1:])
gLh = xp.asarray(Lh[1:]); gLl = xp.asarray(Ll[1:]); gLa = xp.asarray(La[1:]); gLb = xp.asarray(Lb[1:])
heat = (TR / 4) * gLh * gLh
BUD = float(sys.argv[4]) if len(sys.argv) > 4 else 3e7
PART, NPART = (int(v) for v in sys.argv[5].split('/')) if len(sys.argv) > 5 else (0, 1)
order = order[PART::NPART]
if PART != 0: order = order[order != len(pts) - 1]
elif len(pts) - 1 not in order: order = np.append(order, len(pts) - 1)
res = {f: np.zeros((len(pts), 4)) for f in FUN}           # absE, pilot, telescope error, |A97|
null = np.zeros((len(pts), 2)); witD = None
rs = np.random.default_rng(SEED + 7)
t0 = time.time(); pos = 0; done = 0.0; tot = float(Nx[order].sum())
while pos < len(order):
    B = max(1, int(BUD // max(int(Nx[order[pos]]), 1))); B = min(B, len(order) - pos)
    while B > 1 and B * int(Nx[order[pos + B - 1]]) > BUD: B = max(1, int(B * 0.8))
    idx = order[pos:pos + B]; Nb = int(Nx[idx].max()); pos += len(idx); B = len(idx)
    N = Nx[idx].astype(np.float64); q = N * N - TR / 16; lnq = np.log(q); xN = 4 * math.pi * q
    h = np.maximum(0.0, 1 - 3 * YR + 4 * YR * (1 + YR) / xN**2)
    sB = (1 + YR) / 2 + (TR / 4) * lnq - TR * h / (2 * xN**2); gam = np.exp(0.02 * YR - 0.5 * YR * lnq)
    yh = xp.asarray(Yh[idx])[:, None]; yl = xp.asarray(Yl[idx])[:, None]
    ya = xp.floor(yh / 16384.0) * 16384.0; yb = yh - ya
    lh = gLh[None, :Nb]
    fr = xp.fmod(ya * gLa[None, :Nb], 1.0); fr += xp.fmod(ya * gLb[None, :Nb], 1.0); fr += xp.fmod(yb * gLa[None, :Nb], 1.0)
    fr += yb * gLb[None, :Nb]; fr += yh * gLl[None, :Nb]; fr += yl * lh
    fr -= xp.rint(fr); fr *= 2 * math.pi
    amp = xp.exp(heat[None, :Nb] - xp.asarray(sB)[:, None] * lh)
    amp *= (xp.arange(1, Nb + 1)[None, :] <= xp.asarray(Nx[idx])[:, None])
    U = amp * xp.exp(-1j * fr)                               # direct ladder
    perm = xp.argsort(gcls[:Nb]); cnt = xp.bincount(gcls[:Nb], minlength=26); ends = xp.cumsum(cnt) - 1
    up = asnp(U[:, [p - 1 for p in PR]]); gm = xp.asarray(gam)[:, None]
    U = U[:, perm]; V = xp.conj(U) * xp.exp(YR * lh[:, perm]); del fr, amp
    ScC = {}
    for c in CO:
        ap = gA[c][:Nb][perm][None, :]
        cs = xp.cumsum(U * ap, axis=1)[:, ends]; cs2 = xp.cumsum(V * xp.conj(ap), axis=1)[:, ends]
        cs = cs + gm * cs2; cs[:, 1:] = cs[:, 1:] - cs[:, :-1].copy(); ScC[c] = asnp(cs)
    del U, V
    for k, f in enumerate(FUN):
        S = ScC[base(f)]
        G = S[:, 0].copy(); Ap = np.ones(B, dtype=np.complex128); D = np.zeros((B, 25), dtype=np.complex128)
        for j in range(1, 26):
            p = PR[25 - j]; qp = wq(f, p) * up[:, 25 - j]
            G += S[:, j]; D[:, j - 1] = Ap * (qp * G - S[:, j]); Ap = Ap * (1 - qp)
        E = D.sum(axis=1); F_ = S.sum(axis=1); C = S[:, 0]
        res[f][idx, 0] = np.abs(E); res[f][idx, 1] = np.abs(D).sum(axis=1); res[f][idx, 2] = np.abs(E - (C - Ap * F_)); res[f][idx, 3] = np.abs(Ap)
        if f == 'ZETA':
            eps = rs.integers(0, 2, D.shape) * 2 - 1; ph = np.exp(2j * math.pi * rs.uniform(0, 1, D.shape))
            null[idx, 0] = np.abs((eps * D).sum(axis=1)) / np.abs(D).sum(axis=1); null[idx, 1] = np.abs((ph * np.abs(D)).sum(axis=1)) / np.abs(D).sum(axis=1)
            w = np.nonzero(idx == len(pts) - 1)[0]
            if len(w): witD = D[w[0]].copy()
    done += float(Nx[idx].sum())
    if (pos // max(B, 1)) % 50 == 0 or pos >= len(order): print('  %d / %d samples, N %d, %.1f%% of terms, %.0fs' % (pos, len(order), Nb, 100 * done / tot, time.time() - t0), flush=True)
# validation at the witness
if witD is not None:
    ref = np.array([complex(a, b) for a, b in WITD])
    print('witness x = 6.0000039166e12: max |D_j - stored| = %.3e ; |E97| = %.15f (stored 0.181497207134323) ; pilot = %.15f (stored 0.243754142526558)' % (np.abs(witD - ref).max(), abs(witD.sum()), np.abs(witD).sum()), flush=True)
tag = 'c3_%g_%g%s' % (NS, XMAX, ('_p%d' % PART) if NPART > 1 else '')
np.savez_compressed(tag + '.npz', sel=np.isin(np.arange(len(pts)), order), x=np.array([float(p) for p in pts]), N=Nx, null=null, **{f.replace(':', '_'): res[f] for f in FUN})
# summary
summ = {'row': {'t': TR, 'y': YR, 'Rex': REX}, 'samples': NS, 'families': {}}
sel = np.zeros(len(pts), dtype=bool); sel[order] = True; sel[-1] = False
xsf = np.array([float(p) for p in pts])[sel]
edges = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13]
def stats(rho, pil, absE):
    o = {'all': None, 'decades': []}
    def one(m):
        if m.sum() == 0: return None
        r = rho[m]; return {'n': int(m.sum()), 'rho_inf': float(r.min()), 'rho_q01': float(np.quantile(r, 0.01)), 'rho_med': float(np.median(r)), 'rho_q99': float(np.quantile(r, 0.99)), 'rho_sup': float(r.max()),
                            'pilot_sup': float(pil[m].max()), 'absE_sup': float(absE[m].max()), 'frac_pilot_gt_Rex': float((pil[m] > REX).mean()), 'frac_absE_gt_Rex': float((absE[m] > REX).mean())}
    o['all'] = one(np.ones(len(rho), dtype=bool))
    for a, b in zip(edges, edges[1:]): o['decades'].append(one((xsf >= a) & (xsf < b)))
    return o
for f in FUN:
    r = res[f][sel]; summ['families'][f] = stats(r[:, 0] / r[:, 1], r[:, 1], r[:, 0]); summ['families'][f]['max_telescope_err'] = float(r[:, 2].max())
z = res['ZETA'][sel]
for i, nm in enumerate(('ZETA packets, random signs', 'ZETA packet moduli, random phases')):
    summ['families'][nm] = stats(null[sel, i], z[:, 1], null[sel, i] * z[:, 1])
json.dump(summ, open(tag + '_summary.json', 'w'), indent=1)
for f, s in summ['families'].items():
    a = s['all']; print('%-36s rho inf %.4f q01 %.4f med %.4f q99 %.4f sup %.4f | sup pilot %.4f sup |E| %.4f | frac pilot>Rex %.2e |E|>Rex %.2e' % (f, a['rho_inf'], a['rho_q01'], a['rho_med'], a['rho_q99'], a['rho_sup'], a['pilot_sup'], a['absE_sup'], a['frac_pilot_gt_Rex'], a['frac_absE_gt_Rex']))
    print('     per decade sup rho: ' + ' '.join('%.4f' % d['rho_sup'] if d else '-' for d in s['decades']) + ' | frac pilot>Rex: ' + ' '.join('%.1e' % d['frac_pilot_gt_Rex'] if d else '-' for d in s['decades']))
print('done %.0fs' % (time.time() - t0))
