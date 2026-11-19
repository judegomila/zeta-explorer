"""Decisive test, part 1 (float64, complete enumeration).  Family object: rows restricted to one class mod 72, summed over
classes.  N = sum_m exp(-pi q_m/M) sum_sigma |B_m^sigma(X)|^2 by brute force, against the dual side of Lemma 2:
  D   (h = 0, c = c'),
  Pd  (h != 0 with h d in U_S (F^x)^6, evaluated from formula (2.1) with its symbols),
  Pf  (the same set of frequencies evaluated from the closed form of Theorem A: phi(d), no symbols),
  Rem (all other h != 0, formula (2.1)).
Weights y_c = mu(c) w(c): liou (y = 1), one (y = mu), rmult (random completely multiplicative unimodular w),
nm (non-multiplicative: y = +1 with probability 3/4, -1 otherwise), nmph (y = exp(i U), U uniform on [-1.5, 1.5]).
usage: dec1.py log2X ratio out.json     (M = X / ratio)"""
import sys, json, time, numpy as np, lib7
lg = float(sys.argv[1]); ratio = float(sys.argv[2]); X = 2.0 ** lg; M = X / ratio
CUT = 37.0
t0 = time.time()
D = lib7.build(int(2 * X) + 1)
pl, S, qc, gam, inc, mu, pn = D['pl'], D['S'], D['qc'], D['gam'], D['inc'], D['mu'], D['pn']
S = S.astype(np.int64)
sel = np.nonzero((qc > X / 2) & (qc < 2 * X))[0]
q = qc[sel].astype(float); V = lib7.bump(q / X); I = inc[sel]; nc = len(sel)
pidx = [np.nonzero(I[r])[0] for r in range(nc)]
el = []
for r in range(nc):
    e = (1, 0)
    for j in pidx[r]: e = lib7.emul(e, (pl[j].a, pl[j].b))
    el.append(e)
el = np.array(el, dtype=np.int64)
key = (el[:, 0] % 72) * 72 + (el[:, 1] % 72)
classes = {}
for r, k in enumerate(key.tolist()): classes.setdefault(k, []).append(r)
A = np.sqrt(3) / 2
rng = np.random.default_rng(2026)
wp = np.exp(2j * np.pi * rng.random(len(pl)))                       # random multiplicative phases at primes
rm = np.array([np.prod(wp[pidx[r]]) for r in range(nc)]) * mu[sel]
WT = {'liou': np.ones(nc, complex), 'one': mu[sel].astype(complex), 'rmult': rm,
      'nm': np.where(rng.random(nc) < 0.75, 1.0, -1.0).astype(complex),
      'nmph': np.exp(1j * rng.uniform(-1.5, 1.5, nc))}
names = list(WT)
print('X 2^%g M %g  primes %d  c %d  classes %d  same-class ordered pairs (c != c\') %d' % (
    lg, M, len(pl), nc, len(classes), sum(len(v) * (len(v) - 1) for v in classes.values())), flush=True)
# ---------- brute force rows
u, v, qm = lib7.lattice(CUT * M / np.pi)
Cl = np.zeros((len(classes), nc), dtype=np.float32)
for i, (k, v_) in enumerate(classes.items()): Cl[i, v_] = 1
Nw = {k: 0.0 for k in names}
CH = max(500, int(1.5e7 / nc))
for s in range(0, len(u), CH):
    T, Zm = lib7.sym_table(pl, u[s:s + CH], v[s:s + CH])
    ch = lib7.chi_c(I, T, Zm); wgt = np.exp(-np.pi * qm[s:s + CH] / M)
    for k in names:
        coef = WT[k] * np.conj(gam[sel]) * V / np.sqrt(q)
        B = Cl.astype(np.complex128) @ (coef[:, None] * ch)
        Nw[k] += float(np.sum(wgt[None, :] * np.abs(B) ** 2))
print('rows %d  brute done %.0fs' % (len(u), time.time() - t0), flush=True)
# ---------- dual side
Hmax = CUT * 3 * (2 * X) ** 2 / (4 * np.pi * M)
hu, hv, hq = lib7.lattice(Hmax)
nz = hq > 0; hu, hv, hq = hu[nz], hv[nz], hq[nz]
order = np.argsort(hq, kind='stable'); hu, hv, hq = hu[order], hv[order], hq[order]
hqf = hq.astype(float)
print('dual frequencies %d (q_h <= %.0f), table %.2f GB' % (len(hu), Hmax, 2 * len(pl) * len(hu) / 1e9), flush=True)
Th = np.zeros((len(pl), len(hu)), dtype=np.int8); Zh = np.zeros((len(pl), len(hu)), dtype=bool)
sm1 = np.zeros(len(pl), dtype=np.int64)
for i, p in enumerate(pl):
    k, m = p.sym(hu, hv); Th[i] = k; Zh[i] = ~m
    k1, _ = p.sym(np.array([-1]), np.array([0])); sm1[i] = k1[0]
hindex = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(hu, hv))}
units = [lib7.epow((1, 1), k) for k in range(6)]
def nrm(e): return e[0] * e[0] - e[0] * e[1] + e[1] * e[1]
# primary elements a prime to 6 with norm^6 <= Hmax (with factor list)
small = [((1, 0), [])]
for i, p in enumerate(pl):
    if p.n ** 6 <= Hmax: small.append(((p.a, p.b), [i]))
assert 49 ** 6 > Hmax, 'products of two primes in a not enumerated'
lunits = []
i = 0
while 3 ** i <= Hmax:
    j = 0
    while 3 ** i * 4 ** j <= Hmax:
        l0 = lib7.emul(lib7.epow((1, 2), i), (2 ** j, 0))
        for uu in units: lunits.append((lib7.emul(l0, uu), 3 ** i * 4 ** j))
        j += 1
    i += 1
def principal_list(didx, c1idx, c1pidx):
    """indices of h = l d^5 a^6 (a coprime to c1 c1') and the norms"""
    d5 = (1, 0)
    for j in didx:
        d5 = lib7.emul(d5, lib7.epow((pl[j].a, pl[j].b), 5))
    nd5 = nrm(d5)
    if nd5 > Hmax: return [], []
    idx = []; nn = []
    bad = set(c1idx.tolist()) | set(c1pidx.tolist())
    for ael, fac in small:
        if any(f in bad for f in fac): continue
        a6 = lib7.epow(ael, 6); n0 = nd5 * nrm(a6)
        if n0 > Hmax: continue
        base = lib7.emul(d5, a6)
        for l, nl in lunits:
            if n0 * nl > Hmax: continue
            h = lib7.emul(base, l); idx.append(hindex[h]); nn.append(n0 * nl)
    return idx, nn
Pd = {k: 0.0 for k in names}; Pf = {k: 0.0 for k in names}; Rem = {k: 0.0 for k in names}; Dg = 0.0
maxphase = 0.0; npairs = 0; nd = 0
for kcls, mem in classes.items():
    for r in mem:
        for r2 in mem:
            ia, ib = pidx[r], pidx[r2]
            didx = np.intersect1d(ia, ib); c1 = np.setdiff1d(ia, didx); c1p = np.setdiff1d(ib, didx)
            qk = float(np.prod(pn[didx].astype(float)) * np.prod(pn[c1].astype(float)) * np.prod(pn[c1p].astype(float)))
            kap = 4 * np.pi * M / (3 * qk)
            nh = int(np.searchsorted(hqf, CUT / kap, side='right'))
            pref = (M / A) * V[r] * V[r2] / (q[r] * q[r2])
            phid = float(np.prod(pn[didx].astype(float) - 1))
            if r == r2: Dg += pref * phid
            # constant exponent of (2.1): conj chi_d(c1) chi_d(c1') chi_c1(c1') conj chi_c1'(c1)
            cst = (-S[np.ix_(didx, c1)].sum() + S[np.ix_(didx, c1p)].sum() + S[np.ix_(c1, c1p)].sum() - S[np.ix_(c1p, c1)].sum())
            ex = np.full(nh, int(cst) + int(sm1[c1p].sum()), dtype=np.int64)
            mask = np.ones(nh, dtype=bool)
            for j in c1: ex -= Th[j, :nh]; mask &= ~Zh[j, :nh]
            for j in c1p: ex += Th[j, :nh]; mask &= ~Zh[j, :nh]
            rd = np.ones(nh)
            for j in didx: rd *= (pn[j] * Zh[j, :nh] - 1.0)
            term = rd * mask * lib7.Z6[ex % 6] * np.exp(-kap * hqf[:nh])
            tot = term.sum()
            pidx_h, pn_h = principal_list(didx, c1, c1p)
            pidx_h = [i_ for i_ in pidx_h if i_ < nh]
            pd = term[pidx_h].sum() if pidx_h else 0.0
            if pidx_h:
                ph = rd[pidx_h] * mask[pidx_h] * lib7.Z6[ex[pidx_h] % 6]
                maxphase = max(maxphase, float(np.max(np.abs(ph - phid))))
            pf = phid * float(np.sum(np.exp(-kap * hqf[pidx_h]))) if pidx_h else 0.0
            npairs += 1; nd += (len(didx) > 0 and r != r2)
            for k in names:
                yy = WT[k][r] * np.conj(WT[k][r2]) * pref
                Pd[k] += (yy * pd).real; Pf[k] += (yy * pf).real; Rem[k] += (yy * (tot - pd)).real
print('pairs %d (off-diagonal with d != 1: %d)  max |r_d * phase - phi(d)| on principal h: %.2e   %.0fs' % (npairs, nd, maxphase, time.time() - t0))
out = dict(log2X=lg, M=M, nc=nc, D=Dg, weights={})
print('D = %.6f' % Dg)
for k in names:
    res = Nw[k] - Dg - Pf[k] - Rem[k]
    out['weights'][k] = dict(N=Nw[k], Pd=Pd[k], Pf=Pf[k], Rem=Rem[k], resid=res)
    print('%-6s N %.6f  N-D %+.6f  P(2.1) %+.6f  P(closed) %+.6f  Rem %+.6f  N-D-P-Rem %+.2e  Rem/P %+.3f' % (
        k, Nw[k], Nw[k] - Dg, Pd[k], Pf[k], Rem[k], res, Rem[k] / Pf[k] if Pf[k] else float('nan')))
json.dump(out, open(sys.argv[3], 'w'), indent=1)
