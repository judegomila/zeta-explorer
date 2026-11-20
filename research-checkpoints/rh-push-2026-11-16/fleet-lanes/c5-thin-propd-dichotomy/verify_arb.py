"""verify_arb.py -- ball-arithmetic recomputation of the row mean squares at a small scale, independent of rows.c.

Independent of rows.c in: enumeration of rows (lattice loop over all m with 0 < N(m) <= Z), symbol evaluation
(alib.SFTable.node_exponents, numpy modular powers; zomega.PrimeO.chi for the n-part), and arithmetic.
Shared with prep.py: the definition of the weights (prime_signs, node signs) and of the test V.

Ball arithmetic:
  * each coefficient gamma_2(c) conj(alpha(c)) q_c^{-1/2} conj(alpha(n))^3 q_n^{-1} V(q_c q_n^3/Z) is enclosed by an
    acb ball (python-flint, 100 bits).  gamma_2(c) is the cube root of mu(c) alpha(c) (manuscript (4.7)) nearest to
    the float64 table value (distance to the other two roots is sqrt 3; the table error is < 1e-7, asserted).
  * each ball is replaced by an exact integer midpoint (scale 2^-44) and the uniform radius 2^-43 per component
    (asserted to contain the acb ball); sums over indices are exact int64 sums (no rounding; overflow excluded by a
    bound printed below); radii add.
  * the six sextic classes are combined, squared and summed over rows in acb/arb.
Output: enclosures of MS_w = sum_{0 < N(m) <= Z} |C_w(m)|^2 for every weight, and the comparison with rows.c raw output.
Usage: python verify_arb.py table.npz Z raw.bin out.json
"""
import sys, os, math, json, time
import numpy as np
from flint import arb, acb, ctx
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, 'sextic')); sys.path.insert(0, HERE)
import alib as A, zomega as Zm
import prep

ctx.prec = 100
SCALE = 44

def V_arb(u):
    v = (-(u * u) / 4).exp() / (2 * arb.pi().sqrt())
    x = (u - arb('3.5')) / arb('0.5')
    if x < 0: return v
    if x > 1: return arb(0)
    if not (x > 0 and x < 1): raise ArithmeticError('borderline taper argument')
    f1 = (-1 / (1 - x)).exp(); f0 = (-1 / x).exp()
    return v * f1 / (f0 + f1)

def main():
    path, Z, rawpath, out = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
    t0 = time.time()
    T = A.SFTable(path)
    Xmax = int(math.floor(Z * math.exp(4.0)))
    assert Xmax <= T.X
    NW = prep.NW
    # node signs exactly as in prep.py (same code path for the weights)
    keep = np.flatnonzero(T.N <= Xmax); nn = len(keep)
    remap = np.full(T.n, -1, dtype=np.int64); remap[keep] = np.arange(nn)
    Nk = T.N[keep]; na = T.na[keep]; nb = T.nb[keep]; depth = T.depth[keep]
    parent = remap[np.maximum(T.parent[keep], 0)]; last = T.last[keep]
    npr = int((T.pq <= Xmax).sum())
    ps = prep.prime_signs(T.pa[:npr], T.pb[:npr], T.pp[:npr], T.pinert[:npr])
    sg = np.ones((NW, nn), dtype=np.int64)
    for L in range(1, int(depth.max()) + 1):
        lev = np.flatnonzero(depth == L)
        sg[:, lev] = sg[:, parent[lev]] * ps[:, last[lev]]
    nodekey = (na.astype(np.int64) + 5000) * 20011 + (nb.astype(np.int64) + 5000)
    sg[prep.WEIGHTS.index('iid')] = np.where(prep.splitmix(nodekey, 31) < 0.5, -1, 1)
    order = np.argsort(Nk, kind='stable')
    e95 = sg[prep.WEIGHTS.index('e95')][order].copy()
    rnk = prep.splitmix(nodekey[order], 32) + (np.arange(nn) // 64)
    perm = np.argsort(rnk, kind='stable')
    sh = np.empty(nn, dtype=np.int64); sh[order] = e95[perm]; sh[0] = 1
    sg[prep.WEIGHTS.index('shuf95')] = sh
    frac95 = float((sg[prep.WEIGHTS.index('e95')] < 0).mean())
    # ---- n list (n = 1 included), independent enumeration
    qmax = int(math.floor(Xmax ** (1.0 / 3.0) + 1e-9))
    objs = {k: Zm.PrimeO((int(T.pa[k]), int(T.pb[k])), int(T.pp[k]), bool(T.pinert[k])) for k in range(npr) if T.pq[k] <= qmax}
    nl = []
    B = int(math.sqrt(4 * qmax / 3.0)) + 4
    for a in range(-2 * B, 2 * B + 1):
        for b in range(-2 * B, 2 * B + 1):
            if a % 3 != 1 or b % 3 != 0: continue
            q = a * a - a * b + b * b
            if q > qmax or q % 2 == 0 or q ** 3 > Xmax: continue
            rem = (a, b); fac = []
            for k, P in objs.items():
                e = 0
                while Zm.divides(P.pi, rem):
                    rem = Zm.exact_div(rem, P.pi); e += 1
                if e: fac.append((k, e))
            assert rem == (1, 0)
            ws = np.ones(NW, dtype=np.int64)
            for k, e in fac:
                if e % 2: ws *= ps[:, k]
            if q > 1:
                key = np.array([(a + 5000) * 20011 + (b + 5000)], dtype=np.int64)
                ws[prep.WEIGHTS.index('iid')] = -1 if prep.splitmix(key, 41)[0] < 0.5 else 1
                ws[prep.WEIGHTS.index('shuf95')] = -1 if prep.splitmix(key, 42)[0] < frac95 else 1
            nl.append((q, a, b, fac, ws))
    nl.sort(key=lambda t: (t[0], t[1], t[2]))
    # ---- ball coefficients -> exact integer midpoints
    sq3 = arb(3).sqrt()
    w3 = acb(arb(-1) / 2, sq3 / 2)                                  # e^{2 pi i/3}
    def alpha_arb(a, b, q):
        return acb(arb(a) - arb(b) / 2, arb(b) * sq3 / 2) / arb(q).sqrt()
    g2f = T.g2[keep]
    gam = []                                                        # acb gamma_2(c) conj(alpha(c)) q_c^-1/2
    maxdev = 0.0
    for i in range(nn):
        al = alpha_arb(int(na[i]), int(nb[i]), int(Nk[i]))
        tgt = al if depth[i] % 2 == 0 else -al
        r0 = (tgt.log() / 3).exp()                                  # one cube root
        best = None
        for j in range(3):
            r = r0 * (w3 ** j)
            dev = abs(complex(r) - complex(g2f[i]))
            if best is None or dev < best[0]: best = (dev, r)
        assert best[0] < 1e-7, (i, best[0])
        maxdev = max(maxdev, best[0])
        gam.append(best[1] * al.conjugate() / arb(int(Nk[i])).sqrt())
    print(f"nodes {nn}; cube-root branch: max |arb - float64 table| = {maxdev:.2e}; {time.time() - t0:.1f}s", flush=True)
    ent_node = []; ent_n = []; ent_re = []; ent_im = []; ent_d2 = []
    one = arb(1); half_ulp = arb(2) ** (-SCALE - 1)
    for t, (q, a, b, fac, ws) in enumerate(nl):
        cn = alpha_arb(a, b, q).conjugate() ** 3 / q
        lim = Xmax // (q ** 3)
        for i in np.flatnonzero(Nk <= lim):
            u = (arb(int(Nk[i]) * q ** 3) / Z).log()
            v = V_arb(u)
            val = gam[i] * cn * v
            re = val.real; im = val.imag
            ire = int(round(float(re.mid()) * 2.0 ** SCALE)); iim = int(round(float(im.mid()) * 2.0 ** SCALE))
            # enclosure check: |val - (ire + i iim) 2^-SCALE| <= 2^-(SCALE-1) per component
            assert abs(re * 2 ** SCALE - ire) < 2 and abs(im * 2 ** SCALE - iim) < 2
            ent_node.append(i); ent_n.append(t); ent_re.append(ire); ent_im.append(iim)
            a2 = re * re + im * im                                   # |coefficient|^2, scale 2^-52, radius 2^-51
            i2 = int(round(float(a2.mid()) * 2.0 ** 52)); assert abs(a2 * 2 ** 52 - i2) < 2
            ent_d2.append(i2)
    ent_node = np.array(ent_node); ent_n = np.array(ent_n)
    ent_re = np.array(ent_re, dtype=np.int64); ent_im = np.array(ent_im, dtype=np.int64)
    ne = len(ent_node)
    ent_d2 = np.array(ent_d2, dtype=np.int64); assert int(ent_d2.sum()) < 2 ** 62
    bound = int(np.abs(ent_re).sum() + np.abs(ent_im).sum())
    assert bound < 2 ** 62, bound
    print(f"entries {ne}; sum of |integer midpoints| = 2^{math.log2(bound):.1f} < 2^62 (int64 sums exact); {time.time() - t0:.1f}s", flush=True)
    SGE = sg[:, ent_node] * np.array([nl[t][4] for t in ent_n]).T          # [NW, ne] signs of w(c n^3)
    rad1 = arb(2) ** (-(SCALE - 1))                                         # per entry and component
    z6 = [acb(1), acb(arb(1) / 2, sq3 / 2), acb(arb(-1) / 2, sq3 / 2), acb(-1), acb(arb(-1) / 2, -sq3 / 2), acb(arb(1) / 2, -sq3 / 2)]
    # ---- raw output of rows.c
    rec = np.dtype([('ma', '<i8'), ('mb', '<i8'), ('norm', '<i8'), ('pow', '<i8'), ('C', '<c16', NW)])
    raw = np.fromfile(rawpath, dtype=rec)
    rawd = {(int(r['ma']), int(r['mb'])): r['C'] for r in raw}
    # ---- rows
    MS = [arb(0) for _ in range(NW)]
    REF = prep.WEIGHTS.index('liou')
    XR = [arb(0) for _ in range(NW)]; DX = [arb(0) for _ in range(NW)]     # Re sum C_w conj C_ref ; cross diagonal
    SGR = SGE * SGE[REF][None, :]
    rad2 = arb(2) ** (-51)
    maxdiff = 0.0; nrows = 0
    R = int(math.sqrt(4 * Z / 3.0)) + 2
    nfac = [nl[t][3] for t in range(len(nl))]
    for ma in range(-R, R + 1):
        for mb in range(-R, R + 1):
            qm = ma * ma - ma * mb + mb * mb
            if qm == 0 or qm > Z: continue
            e = T.node_exponents((ma, mb))[keep].astype(np.int64)           # -1 if (c, m) != 1
            # n-part: exponent 3 * sum v k, or zero
            nexp = np.zeros(len(nl), dtype=np.int64); nzero = np.zeros(len(nl), dtype=bool)
            for t in range(len(nl)):
                s = 0
                for k, v in nfac[t]:
                    kk = objs[k].chi((ma, mb))
                    if kk is None: nzero[t] = True; break
                    s += 3 * v * kk
                nexp[t] = s % 6
            ee = e[ent_node]
            ok = (ee >= 0) & ~nzero[ent_n]
            cls = (ee + nexp[ent_n]) % 6
            Cw = [acb(0) for _ in range(NW)]
            for k in range(6):
                sel = np.flatnonzero(ok & (cls == k))
                if len(sel) == 0: continue
                sre = SGE[:, sel] @ ent_re[sel]; sim = SGE[:, sel] @ ent_im[sel]
                rr = rad1 * len(sel)
                for w in range(NW):
                    x = arb(int(sre[w])) * (arb(2) ** (-SCALE)); y = arb(int(sim[w])) * (arb(2) ** (-SCALE))
                    x = arb(x.mid(), x.rad() + rr) if True else x
                    y = arb(y.mid(), y.rad() + rr)
                    Cw[w] += z6[k] * acb(x, y)
            for w in range(NW):
                t2 = Cw[w].real * Cw[w].real + Cw[w].imag * Cw[w].imag
                if not t2.is_finite(): raise ArithmeticError(f"non-finite at m=({ma},{mb}) w={w}: {Cw[w]}")
                MS[w] += t2
                XR[w] += Cw[w].real * Cw[REF].real + Cw[w].imag * Cw[REF].imag
            selok = np.flatnonzero(ok)
            dsum = SGR[:, selok] @ ent_d2[selok]
            for w in range(NW):
                dv = arb(int(dsum[w])) * (arb(2) ** (-52))
                DX[w] += arb(dv.mid(), dv.rad() + rad2 * len(selok))
            cc = rawd.get((ma, mb))
            assert cc is not None, (ma, mb)
            dd = max(abs(complex(Cw[w]) - complex(cc[w])) for w in range(NW))
            maxdiff = max(maxdiff, dd)
            nrows += 1
    assert nrows == len(raw), (nrows, len(raw))
    msf = (np.abs(raw['C']) ** 2).sum(axis=0)
    res = {'Z': Z, 'rows': nrows, 'nodes': int(nn), 'entries': int(ne), 'max_abs_diff_rows_c_vs_ball_mid': maxdiff,
           'weights': prep.WEIGHTS, 'MS_mid': [float(x.mid()) for x in MS], 'MS_rad': [float(x.rad()) for x in MS],
           'MS_str': [x.str(25) for x in MS], 'MS_float64_rows_c': [float(x) for x in msf],
           'ratio_to_one_str': [(MS[w] / MS[0]).str(20) for w in range(NW)],
           'XR_str': [x.str(22) for x in XR], 'DX_str': [x.str(22) for x in DX],
           'E_ref_str': (XR[REF] - DX[REF]).str(22), 'rho_str': [((XR[w] - DX[w]) / (XR[REF] - DX[REF])).str(18) for w in range(NW)],
           'Ecoh_str': [(((XR[w] - DX[w]) / (XR[REF] - DX[REF])) ** 2 * (XR[REF] - DX[REF])).str(18) if w != REF else (XR[REF] - DX[REF]).str(18) for w in range(NW)],
           'MS_ball': [[x.mid().str(40, radius=False), x.rad().str(10, radius=False)] for x in MS],
           'XR_ball': [[x.mid().str(40, radius=False), x.rad().str(10, radius=False)] for x in XR],
           'DX_ball': [[x.mid().str(40, radius=False), x.rad().str(10, radius=False)] for x in DX]}
    json.dump(res, open(out, 'w'), indent=1)
    print(f"rows {nrows}; max |C(rows.c) - C(ball midpoint)| = {maxdiff:.3e}; {time.time() - t0:.1f}s")
    for w in range(NW):
        rho = (XR[w] - DX[w]) / (XR[REF] - DX[REF])
        print(f"  {prep.WEIGHTS[w]:7s} MS = {MS[w].str(22)}   rows.c float64 {msf[w]:.9f}   |diff| {abs(float(MS[w].mid()) - msf[w]):.1e}   D_cross = {DX[w].str(16)}   rho_w = {rho.str(14)}")

if __name__ == '__main__':
    main()
