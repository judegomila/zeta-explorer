"""Same-class phase identity (*) used in the remainder of Theorem A.  For squarefree primary c = d c1, c' = d c1' prime to 6
with gcd(c, c') = d and c = c' mod F, the h-independent part of the phase of (2.1) satisfies
   conj chi_d(c1) chi_d(c1') chi_c1(c1') conj chi_c1'(c1) chi_c1'(-1)  =  conj chi_c1(d) chi_c1'(d),
so that the phase of frequency h is conj chi_c1(hd) chi_c1'(hd).  Exact integer exponents mod 6; all same-class pairs."""
import sys, numpy as np, lib7
lg = int(sys.argv[1]); X = 2 ** lg
D = lib7.build(2 * X + 1); pl, S, qc, inc = D['pl'], D['S'].astype(np.int64), D['qc'], D['inc']
sel = np.nonzero((qc > X / 2) & (qc < 2 * X))[0]; I = inc[sel]
pidx = [np.nonzero(I[r])[0] for r in range(len(sel))]
sm1 = np.array([int(p.sym(np.array([-1]), np.array([0]))[0][0]) for p in pl])
el = []
for r in range(len(sel)):
    e = (1, 0)
    for j in pidx[r]: e = lib7.emul(e, (pl[j].a, pl[j].b))
    el.append(e)
el = np.array(el, dtype=np.int64)
for F in [int(x) for x in sys.argv[2].split(",")]:
    key = (el[:, 0] % F) * F + (el[:, 1] % F); cl = {}
    for r, k in enumerate(key.tolist()): cl.setdefault(k, []).append(r)
    tot = bad = nd = 0
    for mem in cl.values():
        for r in mem:
            for r2 in mem:
                if r == r2: continue
                ia, ib = pidx[r], pidx[r2]
                d = np.intersect1d(ia, ib); c1 = np.setdiff1d(ia, d); c1p = np.setdiff1d(ib, d)
                lhs = -S[np.ix_(d, c1)].sum() + S[np.ix_(d, c1p)].sum() + S[np.ix_(c1, c1p)].sum() - S[np.ix_(c1p, c1)].sum() + sm1[c1p].sum()
                rhs = -S[np.ix_(c1, d)].sum() + S[np.ix_(c1p, d)].sum()
                tot += 1; nd += len(d) > 0; bad += ((lhs - rhs) % 6 != 0)
    print('X 2^%d  F = %d: ordered same-class pairs %d (with d != 1: %d)  identity fails on %d' % (lg, F, tot, nd, bad), flush=True)
