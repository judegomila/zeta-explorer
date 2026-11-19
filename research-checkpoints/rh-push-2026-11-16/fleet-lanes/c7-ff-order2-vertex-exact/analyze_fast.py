"""Same exact block analysis as analyze.py for large d, with the sums over m done in chunked int64 (each chunk sum is
checked against an a-priori bound < 2^62, chunks are added as Python integers), so every result is an exact integer."""
import sys, os, json, glob
import numpy as np
from fractions import Fraction
from decimal import Decimal
from analyze import RR, cache, TG, diag_ref, scop, lq, HERE
from exact import z6red

def load(fn, ncol):
    a = np.fromstring(open(fn).read(), dtype=np.int64, sep=' ')
    return a.reshape(-1, ncol)
def z6(h):   # h: (n,6) int64 -> (a,b)
    return h[:, 0] - h[:, 2] - h[:, 3] + h[:, 5], h[:, 1] + h[:, 2] - h[:, 4] - h[:, 5]
def xsum(u, v=None, chunk=None):
    """exact sum of u*v (or u) as Python int"""
    n = len(u); mu = int(np.abs(u).max()) if n else 0; mv = int(np.abs(v).max()) if v is not None and n else 1
    chunk = max(1, min(n, (2 ** 62) // max(1, mu * mv)))
    if chunk < 1: raise OverflowError
    tot = 0
    for i in range(0, n, chunk):
        tot += int((u[i:i + chunk] * v[i:i + chunk]).sum()) if v is not None else int(u[i:i + chunk].sum())
    return tot
def main(q, d, only=None):
    R = RR(q); nm = q ** d
    ks = sorted({int(os.path.basename(f).split('_')[3].split('.')[0]) for f in glob.glob(cache('ck', q, d, '*')) + glob.glob(cache('ckbig', q, d, '*'))})
    cks = {}; nc = {}
    for k in ks:
        t = load(cache('ck', q, d, k), 8); a, b = z6(t[:, 2:8]); keys = {}
        for key in np.unique(t[:, 1]):
            sel = t[:, 1] == key; A = np.zeros(nm, dtype=np.int64); Bv = np.zeros(nm, dtype=np.int64)
            np.add.at(A, t[sel, 0], a[sel]); np.add.at(Bv, t[sel, 0], b[sel])
            if A.any() or Bv.any(): keys[int(key)] = (A, Bv)
        cks[k] = keys
        tot = tuple([0] * R.deg)
        for ka, (a1, b1) in keys.items():
            for kb, (a2, b2) in keys.items():
                # x * conj(y), conj(c + d z) = (c + d) - d z :  (a1 + b1 z)((a2+b2) - b2 z)
                c2 = a2 + b2; d2 = -b2
                s = (xsum(a1, c2) - xsum(b1, d2), xsum(a1, d2) + xsum(b1, c2) + xsum(b1, d2))
                if s != (0, 0): tot = R.radd(tot, R.rmul(R.rmul(R.rkey(ka), R.rconj(R.rkey(kb))), R.rz6(s)))
        nc[k] = R.rval(tot)
    cinfl = {k: (float(nc[k] / (Decimal(q) ** (d + 2 * k) * (1 - Decimal(1) / q))) if k else float(nc[k] / Decimal(q) ** d)) for k in ks}
    json.dump({'q': q, 'd': d, 'ks': ks, 'c_norm2': {k: str(nc[k].quantize(Decimal(1))) for k in ks}, 'c_infl': cinfl}, open(os.path.join(HERE, f'checks_q{q}_d{d}.json'), 'w'), indent=1)
    out = open(os.path.join(HERE, f'blocks_q{q}_d{d}.jsonl'), 'w')
    files = {}
    for f in sorted(glob.glob(cache('rowbig', q, d, '*'))) + sorted(glob.glob(cache('row', q, d, '*'))):
        files[tuple(os.path.basename(f)[:-4].split('_')[3:9])] = f
    for fk in sorted(files):
        f = files[fk]; a_ = os.path.basename(f)[:-4].split('_'); N, lam = int(a_[3]), int(a_[4]); t = tuple(int(x) for x in a_[5:9])
        name = next((n for n, v in TG.items() if v == t), str(t)); Nt = N + lam
        rw = load(f, 7); assert len(rw) == nm and (rw[:, 0] == np.arange(nm)).all()
        ha, hb = z6(rw[:, 1:7])
        nr = q ** Nt * (xsum(ha, ha) + xsum(ha, hb) + xsum(hb, hb))
        D = diag_ref(q, N, lam, t); g2 = R.red(R.Gpow(2, Nt)); recs = []
        for k in ks:
            J = tuple([0] * R.deg)
            for key, (a1, b1) in cks[k].items():
                s = (xsum(a1, ha) - xsum(b1, hb), xsum(a1, hb) + xsum(b1, ha) + xsum(b1, hb))
                if s != (0, 0): J = R.radd(J, R.rmul(R.rkey(key), R.rz6(s)))
            J = R.rmul(J, g2); J2 = R.rabs2(J); r = k + Nt - 1 - d
            rec = dict(q=q, target=name, k=k, N=N, lam=lam, d=d, r=r, J2=str(J2.quantize(Decimal(1))), nc2=str(nc[k].quantize(Decimal(1))), nr2=str(nr),
                       row_infl=(float(Fraction(nr, q ** d) / D) if D else None), c_infl=cinfl[k])
            if J2 > 0 and nc[k] > 0 and nr > 0:
                lr = lq(J2 / (nc[k] * nr), q) / 2; rec['log_q_ratio'] = lr
                if N > 0: rec['h_up'] = 3 + 6 * lr / N
            else: rec['log_q_ratio'] = None
            sc = scop(q, N, lam, t, k)
            if sc is not None:
                rec['S_cop'] = str(sc)
                if 0 <= r <= 5:
                    sel = (k - Nt) % 6; wgt2 = None
                    if r == 0: wgt2 = Decimal(1) if sel == 0 else Decimal(q)
                    elif sel == 0: wgt2 = Decimal((q - 1) ** 2)
                    if wgt2 is not None and sc != 0:
                        pred2 = wgt2 * Decimal(q) ** (2 * d) * Decimal(sc) ** 2
                        rec['pred_J2'] = str(pred2.quantize(Decimal(1))); rec['J_over_pred'] = float((J2 / pred2).sqrt())
                    elif wgt2 is None: rec['pred_J2'] = '0'
            rec['_J2'] = J2; recs.append(rec)
        bes = sum((rc['_J2'] / nc[rc['k']] for rc in recs if 2 * rc['k'] <= d and nc[rc['k']] > 0), Decimal(0))
        for rc in recs:
            del rc['_J2']
            if D and d >= Nt:
                dd = Decimal(q) ** d * Decimal(D.numerator) / Decimal(D.denominator)
                rc['row_excess_over_diag'] = float((Decimal(nr) - dd) / dd); rc['bessel_over_diag'] = float(bes / dd)
            out.write(json.dumps(rc) + '\n')
        out.flush()
    out.close()
if __name__ == '__main__':
    main(int(sys.argv[1]), int(sys.argv[2]))
