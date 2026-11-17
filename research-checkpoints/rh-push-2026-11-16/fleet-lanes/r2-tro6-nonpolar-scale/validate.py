#!/usr/bin/env python3
"""validate.py outdir -- checks of scale.py output against the round-1 data (tro6-numerics rows_full.npz, E.npy) and
against direct evaluation.  usage: validate.py outdir r1dir"""
import os, sys, math, glob, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); SX = os.environ.get('SEXTIC_DIR', os.path.join(HERE, 'sextic'))
sys.path.insert(0, SX); import alib as A, zomega as Z
outd, r1 = sys.argv[1], sys.argv[2]
st = np.load(os.path.join(outd, 'static.npz')); nd = np.load(os.path.join(outd, 'nodes.npz'))
Qs = st['Qs']; Rs = st['Rs']; types = list(st['types']); NB = len(Qs); cls_par = [st['cls_even'], st['cls_odd']]; ne = int(st['ne'])
perm = nd['perm']; Np = nd['Np']; clsp = nd['clsp'].astype(int); pred = nd['pred']
rows = [np.load(f) for f in sorted(glob.glob(os.path.join(outd, 'rows_*.npz')))]
cat = lambda k: np.concatenate([r[k] for r in rows])
ms = cat('ms'); Nm = cat('Nm'); rho = cat('rho_str') + cat('rho_cor'); six = cat('six'); fl = cat('flags'); B = cat('B'); B3 = cat('B3')
binof = np.searchsorted(Qs, Nm, 'left')
print(f"half rows {len(Nm)}, N(m) <= {Nm.max()}")
# 1. rho against round 1
d = np.load(os.path.join(r1, 'rows_full.npz')); lut = {(int(a), int(b)): i for i, (a, b) in enumerate(d['ms'])}
ok = np.array([(int(a), int(b)) in lut for a, b in ms]); idx = np.array([lut[(int(a), int(b))] for a, b in ms[ok]])
print(f"1. rows also in round 1: {int(ok.sum())}; max |rho_str - r1| = {np.abs(cat('rho_str')[ok] - d['rho_str'][idx]).max():.2e}, max |rho_cor - r1| = {np.abs(cat('rho_cor')[ok] - d['rho_cor'][idx]).max():.2e}, se {np.abs(cat('se')[ok] - d['se'][idx]).max():.2e}; flags equal: {bool((fl[ok] == d['flags'][idx]).all())}")
# symmetry rho_sigma(-y) = chi_sigma(-1) rho_sigma(y) in the round-1 data, with the parity table of scale.py
neg = np.array([lut[(-int(a), -int(b))] for a, b in ms[ok]]); r1rho = d['rho_str'] + d['rho_cor']
sgn = np.where(st['par_cls'] == 0, 1.0, -1.0)
print(f"   sign symmetry in round-1 data: max |rho(-m) - (-1)^par(sigma) rho(m)| = {np.abs(r1rho[neg] - sgn[None, :] * r1rho[idx]).max():.2e}")
# 2. B rows against direct evaluation from the table (independent exponent computation)
T = A.SFTable(SX + '/data/sf_1e7.npz'); Z6 = Z.ZETA6; LUT = np.concatenate([Z6, [0]])
Nf = T.N.astype(float); alpha = ((T.na - T.nb / 2.0) + 1j * (T.nb * math.sqrt(3) / 2.0)) / np.sqrt(Nf); Gc = T.G()
ne0 = Z.mul((2, 0), Z.power(Z.LAM, 5)); ee0 = T.node_exponents(ne0); par0 = ((T.N - 1) // 6) % 2
rng = np.random.default_rng(5); worst = 0; worst3 = 0
grid = st['grid'].astype(float)
for i in rng.choice(len(Nm), 6, replace=False):
    m = (int(ms[i, 0]), int(ms[i, 1])); e = T.node_exponents(m); ph = LUT[e]
    for k in range(binof[i], NB):
        R = Rs[k]
        s_lo = max(int(np.searchsorted(grid, R * math.exp(-1.6), 'left')), 1); s_hi = min(int(np.searchsorted(grid, R * math.exp(1.6), 'left')), len(grid) - 1)
        sel = (T.N > grid[s_lo - 1]) & (T.N <= grid[s_hi])
        w = np.where(sel, np.exp(-2 * np.log(Nf / R) ** 2) / np.sqrt(Nf), 0)
        for name, psi in (('a', alpha), ('aG', alpha * Gc), ('res', T.mu * np.conj(alpha * Gc) * Z6[ee0]), ('one', 1.0)):
            t = types.index(name)
            for p in (0, 1):
                direct = (T.g2 * psi * w * ph)[par0 == p].sum()
                worst = max(worst, abs(direct - B[i, k, p, t]))
        # n^3 part, type 'a', slow reference
        t = types.index('a'); tot = np.zeros(2, complex)
        for ndx in np.flatnonzero((T.N > 1) & (T.N <= (R * math.exp(1.6)) ** (1 / 3))):
            if e[ndx] < 0: continue
            Reff = R / Nf[ndx] ** 3; lx = np.log(Nf / Reff); sel = np.abs(lx) <= 1.6
            val = (T.g2 * alpha * np.exp(-2 * lx ** 2) / np.sqrt(Nf) * ph)[sel] * alpha[ndx] ** 3 / Nf[ndx] * Z6[(3 * e[ndx]) % 6]
            pp = (par0[sel] + par0[ndx]) % 2
            tot[0] += val[pp == 0].sum(); tot[1] += val[pp == 1].sum()
        worst3 = max(worst3, np.abs(tot - B3[i, k, :, t]).max())
print(f"2. B (types a, aG, res, one; 6 random rows, all k): max |diff| = {worst:.2e};  B3 (type a): max |diff| = {worst3:.2e}")
# 3. per-conductor sums against direct sums from the round-1 exponent matrix E (N(c) <= 1e5), and the form identity
E = np.load(os.path.join(r1, 'E.npy'), mmap_mode='r'); cd = np.load(os.path.join(r1, 'data', 'conductors.npz'))
lutc = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(T.na[perm], T.nb[perm])) if Np[i] <= 100000}
cpos = np.array([lutc[(int(a), int(b))] for a, b in zip(cd['cna'], cd['cnb'])])
r1six = d['six']; r1fl = d['flags']; r1N = d['Nm']
for j in range(NB):
    f = os.path.join(outd, f'snap_{j:02d}.npz')
    if not os.path.exists(f) or Qs[j] > r1N.max(): continue
    sn = np.load(f); S = sn['S']; worstS = 0
    for stt in (0, 1):
        cop6 = (r1fl[:, 0] == 0) & (r1fl[:, 1] == 0)
        mk = (~r1six) & (r1N <= Qs[j]) & (cop6 if stt == 0 else ~cop6)
        ix = np.flatnonzero(mk); Sd = np.zeros((12, len(cpos)), complex)
        for a0 in range(0, len(ix), 500):
            b_ = ix[a0:a0 + 500]; Sd += r1rho[b_].T @ LUT[np.asarray(E[b_])]
        for p in (0, 1):
            cc = np.flatnonzero((cpos < ne) if p == 0 else (cpos >= ne))
            for i_, sg in enumerate(cls_par[p]):
                worstS = max(worstS, np.abs(Sd[sg, cc] - 2 * S[stt, cpos[cc], i_]).max())
            other = cls_par[1 - p]
            worstS = max(worstS, np.abs(Sd[other][:, cc]).max())
    # form identity: sum_half rho_sigma B^{par sigma} = FS
    FS = sn['FS']; worstF = 0; scale = 0
    for stt in (0, 1):
        mk = (~six) & (Nm <= Qs[j]) & (((fl[:, 0] == 0) & (fl[:, 1] == 0)) if stt == 0 else ~((fl[:, 0] == 0) & (fl[:, 1] == 0)))
        for k in range(j, NB):
            for sg in range(12):
                F = (rho[mk, sg][:, None] * B[mk, k, st['par_cls'][sg], :]).sum(0)
                worstF = max(worstF, np.abs(F - FS[stt, k, :, sg]).max()); scale = max(scale, np.abs(F).max())
    print(f"3. Q_{j} = {Qs[j]:.1f}: per-conductor sums vs direct (28224 conductors x 12 classes x 2 strata): max |diff| = {worstS:.2e}; form identity sum_m rho B = sum_c coef S: max |diff| = {worstF:.2e} (scale {scale:.1f})")
