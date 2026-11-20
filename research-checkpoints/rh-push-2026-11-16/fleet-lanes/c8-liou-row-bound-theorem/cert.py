"""Decisive test, part 3: ball-arithmetic (Arb, python-flint) enclosure of the four quantities of Theorem A for the family
object at one small size, Liouville weight, with rigorous truncation tails.
  N    = sum_{m in O} exp(-pi q_m/M) sum_sigma |B_m^sigma|^2         (rows q_m <= Q exactly, tail bound added)
  D    = (M/A) sum_c phi(c) V^2/q_c^2
  P    = closed form of Theorem A (phi(d), no symbols) over h = l d^5 a^6
  Rem  = formula (2.1) over all other h != 0 with q_h <= H(pair), tail bound added.
Symbol exponents and the integer coefficients n_k(q) = #{.. : q = q, exponent = k} are exact integers (numpy int64);
exponentials, V, Gauss sums and sixth roots of unity are Arb balls.  Tail bounds: the number of m with q_m = q is
6 sum_{d | q} chi_{-3}(d) <= 6 q, |r_d(h)| <= q_d, |phase| <= 1.
usage: cert.py log2X ratio CUT prec"""
import sys, time, numpy as np, lib7
from flint import arb, acb, ctx, fmpz_mat, arb_mat
lg = int(sys.argv[1]); ratio = int(sys.argv[2]); CUT = float(sys.argv[3]); ctx.prec = int(sys.argv[4])
X = 2 ** lg; M = X // ratio; t0 = time.time()
PI = arb.pi(); A = arb(3).sqrt() / 2
Z6 = [acb(arb(k) / 3).exp_pi_i() for k in range(6)]
D = lib7.build(2 * X + 1)
pl, S, qc, inc, pn = D['pl'], D['S'].astype(np.int64), D['qc'], D['inc'], D['pn']
sel = np.nonzero((qc > X / 2) & (qc < 2 * X))[0]; nc = len(sel); I = inc[sel]
pidx = [np.nonzero(I[r])[0] for r in range(nc)]
# Gauss sums at primes in Arb, from the definition (same formula as lib7.Prime.gamma1)
def gamma1_arb(p):
    P = p.p
    roots = [acb(arb(-2 * j) / P).exp_pi_i() for j in range(P)]
    s = acb(0)
    if p.split:
        t = np.arange(1, P, dtype=np.int64); k, _ = p.sym(t, np.zeros_like(t))
        for tt, kk in zip(t.tolist(), k.tolist()): s += Z6[kk] * roots[(p.b * tt) % P]
        return s / arb(P).sqrt()
    u, v = np.meshgrid(np.arange(P, dtype=np.int64), np.arange(P, dtype=np.int64), indexing='ij'); u = u.ravel(); v = v.ravel()
    k, m = p.sym(u, v)
    for vv, kk, mm in zip(v.tolist(), k.tolist(), m.tolist()):
        if mm: s += Z6[kk] * roots[vv]
    return s / P
used = sorted(set(int(j) for r in range(nc) for j in pidx[r]))
g1 = {j: gamma1_arb(pl[j]) for j in used}
print('Gauss sums at %d primes; max | |gamma_1| - 1 | <= %s   %.0fs' % (len(used), max(((abs(g) - 1).abs_upper()) for g in g1.values()), time.time() - t0), flush=True)
el = []; gam = []; Vq = []; coef = []
for r in range(nc):
    e = (1, 0); g = acb(1); idx = pidx[r].tolist()
    for a_, j in enumerate(idx):
        e = lib7.emul(e, (pl[j].a, pl[j].b))
        ex = sum(int(S[i, j]) + int(S[j, i]) for i in idx[:a_]) % 6
        g = g * g1[j] * Z6[ex]
    el.append(e); gam.append(g)
    qq = int(qc[sel[r]]); t = (arb(qq) / X).log() / arb(2).log()
    v = (1 - 1 / (1 - t * t)).exp()
    Vq.append(v); coef.append(g.conjugate() * v / arb(qq).sqrt())
q = [int(x) for x in qc[sel]]
key = [(e[0] % 72) * 72 + (e[1] % 72) for e in el]
classes = {}
for r, k in enumerate(key): classes.setdefault(k, []).append(r)
pairs = [(r, r2) for mem in classes.values() for r in mem for r2 in mem]
print('X 2^%d M %d  c %d  classes %d  ordered same-class pairs %d (diagonal %d)' % (lg, M, nc, len(classes), len(pairs), nc), flush=True)
def tail(a, Q):
    """upper bound for sum_{q > Q} 6 q exp(-a q), a an arb > 0, Q integer"""
    ea = (-a).exp(); om = 1 - ea
    return 6 * (-a * (Q + 1)).exp() * ((Q + 1) * om + ea) / (om * om)
# ---------- N by rows
Q = int(CUT * M / 3.14159) + 1
u, v, qm = lib7.lattice(Q)
T, Zm = lib7.sym_table(pl, u, v); T = T.astype(np.int64)
Ec = (I.astype(np.int64) @ T) % 6; bad = (I @ Zm) > 0.5                     # c x rows
norms = np.unique(qm); pos = np.searchsorted(norms, qm); nq = len(norms)
Evec = arb_mat(nq, 1, [(-PI * int(n_) / M).exp() for n_ in norms.tolist()])
N = acb(0)
for (r, r2) in pairs:
    okm = ~(bad[r] | bad[r2]); k = (Ec[r] - Ec[r2]) % 6
    cnt = np.bincount(pos[okm] * 6 + k[okm], minlength=6 * nq).reshape(nq, 6).T
    sk = arb_mat(fmpz_mat(6, nq, cnt.ravel().tolist())) * Evec
    s = acb(0)
    for kk in range(6): s += Z6[kk] * sk[kk, 0]
    N += coef[r] * coef[r2].conjugate() * s
l1 = arb(0)
for mem in classes.values():
    a_ = arb(0)
    for r in mem: a_ += abs(coef[r])
    l1 += a_ * a_
tN = l1 * tail(PI / M, Q)
print('rows %d (q_m <= %d), distinct norms %d; N done %.0fs' % (len(u), Q, nq, time.time() - t0), flush=True)
# ---------- dual side
Hmax = int(CUT * 3 * (2 * X) ** 2 / (4 * 3.14159 * M)) + 1
hu, hv, hq = lib7.lattice(Hmax); nz = hq > 0; hu, hv, hq = hu[nz], hv[nz], hq[nz]
o = np.argsort(hq, kind='stable'); hu, hv, hq = hu[o], hv[o], hq[o]
Th = np.zeros((len(pl), len(hu)), dtype=np.int8); Zh = np.zeros((len(pl), len(hu)), dtype=bool); sm1 = np.zeros(len(pl), dtype=np.int64)
for j in used:
    k, m = pl[j].sym(hu, hv); Th[j] = k; Zh[j] = ~m
    k1, _ = pl[j].sym(np.array([-1]), np.array([0])); sm1[j] = k1[0]
hindex = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(hu, hv))}
hnorms = np.unique(hq); hpos = np.searchsorted(hnorms, hq); nhq = len(hnorms)
units = [lib7.epow((1, 1), k) for k in range(6)]
def nrm(e): return e[0] * e[0] - e[0] * e[1] + e[1] * e[1]
small = [((1, 0), [])] + [((p.a, p.b), [i]) for i, p in enumerate(pl) if p.n ** 6 <= Hmax]
assert 49 ** 6 > Hmax
lun = []
i = 0
while 3 ** i <= Hmax:
    j = 0
    while 3 ** i * 4 ** j <= Hmax:
        l0 = lib7.emul(lib7.epow((1, 2), i), (2 ** j, 0))
        for uu in units: lun.append((lib7.emul(l0, uu), 3 ** i * 4 ** j))
        j += 1
    i += 1
Dg = arb(0); P = arb(0); Rem = acb(0); tR = arb(0); nprin = 0
for (r, r2) in pairs:
    ia, ib = pidx[r], pidx[r2]
    didx = np.intersect1d(ia, ib); c1 = np.setdiff1d(ia, didx); c1p = np.setdiff1d(ib, didx)
    qd = int(np.prod(pn[didx])) if len(didx) else 1
    qk = q[r] * q[r2] // qd
    kap = 4 * PI * M / (3 * qk)
    Hp = min(Hmax, int(CUT * 3 * qk / (4 * 3.14159 * M)) + 1)
    nh = int(np.searchsorted(hq, Hp, side='right'))
    pref = (arb(M) / A) * Vq[r] * Vq[r2] / (q[r] * q[r2])
    phid = int(np.prod(pn[didx] - 1)) if len(didx) else 1
    if r == r2: Dg += pref * phid
    cst = int(-S[np.ix_(didx, c1)].sum() + S[np.ix_(didx, c1p)].sum() + S[np.ix_(c1, c1p)].sum() - S[np.ix_(c1p, c1)].sum()) + int(sm1[c1p].sum())
    ex = np.full(nh, cst, dtype=np.int64); mask = np.ones(nh, dtype=bool)
    for j in c1: ex -= Th[j, :nh]; mask &= ~Zh[j, :nh]
    for j in c1p: ex += Th[j, :nh]; mask &= ~Zh[j, :nh]
    ex %= 6
    rd = np.ones(nh, dtype=np.int64)
    for j in didx: rd *= (int(pn[j]) * Zh[j, :nh].astype(np.int64) - 1)
    rd = rd * mask
    # principal frequencies h = l d^5 a^6, a prime to c_1 c_1'
    d5 = (1, 0)
    for j in didx: d5 = lib7.emul(d5, lib7.epow((pl[j].a, pl[j].b), 5))
    badp = set(c1.tolist()) | set(c1p.tolist()); pr = []
    if nrm(d5) <= Hp:
        for ael, fac in small:
            if any(f in badp for f in fac): continue
            base = lib7.emul(d5, lib7.epow(ael, 6)); n0 = nrm(base)
            for l, nl in lun:
                if n0 * nl <= Hp: pr.append(hindex[lib7.emul(base, l)])
    pr = np.array(pr, dtype=np.int64)
    if len(pr):
        assert len(set(pr.tolist())) == len(pr)
        assert np.all(ex[pr] == 0) and np.all(rd[pr] == phid), 'Lemma 3 violated'     # exact integer check
        nprin += len(pr)
        cp = np.bincount(hpos[pr], minlength=nhq)
        rd = rd.copy(); rd[pr] = 0
    nqp = int(np.searchsorted(hnorms, Hp, side='right'))
    Ev = arb_mat(nqp, 1, [(-kap * int(n_)).exp() for n_ in hnorms[:nqp].tolist()])
    if len(pr):
        P += pref * phid * (arb_mat(fmpz_mat(1, nqp, cp[:nqp].tolist())) * Ev)[0, 0]
    cnt = np.zeros(6 * nqp, dtype=np.int64)
    np.add.at(cnt, hpos[:nh] * 6 + ex, rd)
    sk = arb_mat(fmpz_mat(6, nqp, cnt.reshape(nqp, 6).T.ravel().tolist())) * Ev
    s = acb(0)
    for kk in range(6): s += Z6[kk] * sk[kk, 0]
    Rem += pref * s
    tR += pref * qd * tail(kap, Hp)
print('dual done %.0fs; principal (pair, h) terms %d, all with exponent 0 and r_d = phi(d) exactly' % (time.time() - t0, nprin), flush=True)
print('N    = %s   (imag part %s)   row tail <= %s' % (N.real.str(25), N.imag.str(5), tN.str(5)))
print('D    = %s' % Dg.str(25))
print('P    = %s' % P.str(25))
print('Rem  = %s   (imag part %s)   frequency tail <= %s' % (Rem.real.str(25), Rem.imag.str(5), tR.str(5)))
diff = N.real - Dg - P - Rem.real
bound = diff.abs_upper() + tN.abs_upper() + tR.abs_upper()
print('N - D - P - Rem (truncated sums) = %s' % diff.str(8))
print('CERTIFIED: |N - (D + P + Rem)| <= %s for the full (untruncated) sums: enclosure of the truncated difference plus the two tail bounds' % bound.str(6))
print('P > 0 certified: %s;  Rem/P = %s;  (N - D)/D = %s' % (bool(P > 0), (Rem.real / P).str(10), ((N.real - Dg) / Dg).str(10)))
