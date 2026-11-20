"""Exact block analysis from cache files (written by ffx on the server or locally).
   analyze.py q d   -> blocks_q{q}_d{d}.jsonl, checks_q{q}_d{d}.json
Exact objects: c_k(m), R(m) in Z[zeta_6q]; J, ||c_k||^2, ||R||^2 exact; logs evaluated from exact values at 70 digits."""
import sys, os, json, glob
from fractions import Fraction
from decimal import Decimal
from exact import *
TG = {'mu': (4, 0, 0, 0), 'a': (0, 3, 2, 3), 'b': (0, 3, 8, 3), 'r1': (1, 11, 0, 0), 'r2': (1, 12, 0, 0), 'n1': (2, 21, 0, 0), 'n2': (2, 22, 0, 0),
      'dh': (3, 3, 2, 8), 't': (0, 0, 0, 0)}
def cache(*a):
    fn = os.path.join(HERE, 'cache', '_'.join(str(x) for x in a) + '.txt')
    if not os.path.exists(fn) and a[0] in ('ck', 'row') and '*' not in fn:
        alt = os.path.join(HERE, 'cache', '_'.join(str(x) for x in (a[0] + 'big',) + tuple(a[1:])) + '.txt')
        if os.path.exists(alt): return alt
    return fn
def have(*a): return os.path.exists(cache(*a))

class RR(Ring):
    """reduced representation: tuples of length deg"""
    def __init__(s, q):
        super().__init__(q)
        s.xred = []
        for i in range(2 * s.deg):
            v = [0] * (i + 1); v[i] = 1; s.xred.append(s.red(v + [0] * (s.n - i - 1)) if i < s.n else None)
        s.z6 = s.red(s.mono(1, 0)); s._km = {}
    def rmul(s, a, b):
        D = s.deg; pr = [0] * (2 * D - 1)
        for i, x in enumerate(a):
            if x:
                for j, y in enumerate(b):
                    if y: pr[i + j] += x * y
        out = list(pr[:D])
        for i in range(D, 2 * D - 1):
            c = pr[i]
            if c:
                xr = s.xred[i]
                for j in range(D): out[j] += c * xr[j]
        return tuple(out)
    def radd(s, a, b): return tuple(x + y for x, y in zip(a, b))
    def rscal(s, a, c): return tuple(c * x for x in a)
    def rconj(s, a): return s.red(s.conj(list(a) + [0] * (s.n - s.deg)))
    def rz6(s, z):
        """a + b zeta6 as reduced element"""
        return s.radd(s.rscal(s.red(s.one()), z[0]), s.rscal(s.z6, z[1]))
    def rkey(s, key):
        if key not in s._km: s._km[key] = s.red(s.keymono(key))
        return s._km[key]
    def rval(s, a): return s.realval(list(a))
    def rabs2(s, a): return s.rval(s.rmul(a, s.rconj(a)))

def read_ck(q, d, k):
    res = {}
    for line in open(cache('ck', q, d, k)):
        t = [int(x) for x in line.split()]
        if not t: continue
        dd = res.setdefault(t[0], {}); z = z6red(t[2:8]); cur = dd.get(t[1], (0, 0)); dd[t[1]] = (cur[0] + z[0], cur[1] + z[1])
    for m in res: res[m] = {k_: v for k_, v in res[m].items() if v != (0, 0)}
    return res
def read_row(q, d, N, lam, t):
    res = {}
    for line in open(cache('row', q, d, N, lam, t[0], t[1], t[2], t[3], 0)):
        tt = [int(x) for x in line.split()]
        if tt: res[tt[0]] = z6red(tt[1:7])
    return res
def diag_ref(q, N, lam, t):
    fn = cache('wsum', q, N, lam, t[0], t[1], t[2], t[3], 0)
    if not os.path.exists(fn): return None
    s = Fraction(0)
    for line in open(fn):
        tt = [int(x) for x in line.split()]
        if not tt: continue
        f = Fraction(tt[0])
        for i in range(1, 13): f *= (1 - Fraction(1, q ** i)) ** tt[i]
        s += f
    return s * q ** (N + lam)      # = sum_A |w g_3(1,A)|^2 phi(A)/|A| ; ||R||^2 = q^d * this when d >= 2(N+lam)
def scop(q, N, lam, t, k):
    """S_cop(k) = sum_{A sf} mu(A) w(A) #{c monic, deg c = k, (c, A) = 1}   (exact integer; None if no wsum file with signed sums)"""
    fn = cache('wsum', q, N, lam, t[0], t[1], t[2], t[3], 0)
    if not os.path.exists(fn): return None
    tot = 0
    for line in open(fn):
        tt = [int(x) for x in line.split()]
        if len(tt) < 14: return None
        pol = [1] + [0] * k
        for i in range(1, 13):
            for _ in range(tt[i]):
                pol = [pol[j] - (pol[j - i] if j >= i else 0) for j in range(k + 1)]
        cnt = sum(pol[j] * q ** (k - j) for j in range(k + 1))
        tot += tt[13] * (-1) ** sum(tt[1:13]) * cnt
    return tot
def lq(x, q): return float(Decimal(x).ln() / Decimal(q).ln())

def main(q, d):
    R = RR(q); nm = q ** d
    ks = sorted({int(os.path.basename(f).split('_')[3].split('.')[0]) for f in glob.glob(cache('ck', q, d, '*')) + glob.glob(cache('ckbig', q, d, '*'))})
    cks = {k: read_ck(q, d, k) for k in ks}
    # exact norms of c_k
    nc = {}
    for k in ks:
        ck = cks[k]; keys = sorted({kk for m in ck for kk in ck[m]}); G = {}
        for m in ck:
            it = list(ck[m].items())
            for a, x in it:
                for b, y in it:
                    p = z6mul(x, z6conj(y)); cur = G.get((a, b), (0, 0)); G[(a, b)] = (cur[0] + p[0], cur[1] + p[1])
        tot = tuple([0] * R.deg)
        for (a, b), s in G.items():
            if s != (0, 0): tot = R.radd(tot, R.rmul(R.rmul(R.rkey(a), R.rconj(R.rkey(b))), R.rz6(s)))
        nc[k] = R.rval(tot)
        assert all(abs(Decimal(c)) == 0 for c in []) 
    checks = {'q': q, 'd': d, 'ks': ks, 'c_norm2': {k: str(nc[k].quantize(Decimal(1))) for k in ks},
              'c_infl': {k: (float(nc[k] / (Decimal(q) ** (d + 2 * k) * (1 - Decimal(1) / q))) if k else float(nc[k] / Decimal(q) ** d)) for k in ks}}
    # exact elements c_k(m) (only when cheap enough)
    def elem(k, m):
        tot = tuple([0] * R.deg)
        for key, z in cks[k].get(m, {}).items(): tot = R.radd(tot, R.rmul(R.rkey(key), R.rz6(z)))
        return tot
    if nm * len(ks) <= 1500000:
        E = {k: [elem(k, m) for m in range(nm)] for k in ks}
        zero = tuple([0] * R.deg)
        # F1: p*_k = c_k - (q-1) q^6 sum_{j>=1} q^(6(j-1)) c_{k-6j} vanishes for k >= d+2
        def pstar(k, m):
            v = E[k][m]; j = 1
            while k - 6 * j >= 0:
                v = R.radd(v, R.rscal(E[k - 6 * j][m], -(q - 1) * q ** 6 * q ** (6 * (j - 1)))); j += 1
            return v
        f1 = {}
        for k in ks:
            if k >= d + 2:
                bad = sum(1 for m in range(nm) if pstar(k, m) != zero)
                nz = sum(1 for m in range(nm) if E[k][m] != zero)
                f1[k] = dict(tested=nm, violations=bad, nonzero_c=nz)
        checks['F1'] = f1
        # F2 (c-level): c_{d+1-k}(m) = lambda c_k(m), lambda independent of m.  F2p: the same test for the coefficients p*_k of P*_m
        def prop(Xk, X2):
            m0 = next((m for m in range(nm) if Xk[m] != zero), None)
            if m0 is None: return dict(note='lower member = 0', partner_nonzero=sum(1 for m in range(nm) if X2[m] != zero))
            bad = sum(1 for m in range(nm) if R.rmul(X2[m], Xk[m0]) != R.rmul(X2[m0], Xk[m]))
            a2 = R.rabs2(X2[m0]); b2 = R.rabs2(Xk[m0])
            return dict(violations=bad, tested=nm, log_q_abs_lambda=(lq(a2 / b2, q) / 2 if a2 > 0 else None))
        f2 = {}; f2p = {}
        for k in range(0, (d + 1) // 2 + 1):
            k2 = d + 1 - k
            if k2 not in cks or k2 == k: continue
            f2[k] = dict(partner=k2, **prop(E[k], E[k2]))
            f2p[k] = dict(partner=k2, **prop([pstar(k, m) for m in range(nm)], [pstar(k2, m) for m in range(nm)]))
        checks['F2p'] = f2p
        checks['F2'] = f2
    json.dump(checks, open(os.path.join(HERE, f'checks_q{q}_d{d}.json'), 'w'), indent=1)
    # blocks
    out = open(os.path.join(HERE, f'blocks_q{q}_d{d}.jsonl'), 'w')
    ckkeys = {k: sorted({kk for m in cks[k] for kk in cks[k][m]}) for k in ks}
    files = {}
    for f in sorted(glob.glob(cache('rowbig', q, d, '*'))) + sorted(glob.glob(cache('row', q, d, '*'))):
        files[tuple(os.path.basename(f)[:-4].split('_')[3:9])] = f
    for f in [files[k_] for k_ in sorted(files)]:
        a = os.path.basename(f)[:-4].split('_'); N, lam = int(a[3]), int(a[4]); t = tuple(int(x) for x in a[5:9])
        name = next((n for n, v in TG.items() if v == t), str(t))
        row = read_row(q, d, N, lam, t); Nt = N + lam
        nr = q ** Nt * sum(z6norm(row.get(m, (0, 0))) for m in range(nm))
        D = diag_ref(q, N, lam, t)
        g2 = R.red(R.Gpow(2, Nt)); recs = []
        for k in ks:
            ck = cks[k]; S = {}
            for m, dd in ck.items():
                h = row.get(m, (0, 0))
                if h == (0, 0): continue
                for key, x in dd.items():
                    p = z6mul(x, h); cur = S.get(key, (0, 0)); S[key] = (cur[0] + p[0], cur[1] + p[1])
            J = tuple([0] * R.deg)
            for key, s in S.items():
                if s != (0, 0): J = R.radd(J, R.rmul(R.rkey(key), R.rz6(s)))
            J = R.rmul(J, g2); J2 = R.rabs2(J); r = k + Nt - 1 - d
            rec = dict(q=q, target=name, k=k, N=N, lam=lam, d=d, r=r, J2=str(J2.quantize(Decimal(1))), nc2=str(nc[k].quantize(Decimal(1))), nr2=str(nr),
                       row_infl=(float(Fraction(nr, q ** d) / D) if D else None), c_infl=checks['c_infl'][k])
            if J2 > 0 and nc[k] > 0 and nr > 0:
                lr = lq(J2 / (nc[k] * nr), q) / 2
                rec['log_q_ratio'] = lr
                if N > 0: rec['h_up'] = 3 + 6 * lr / N
            else: rec['log_q_ratio'] = None
            sc = scop(q, N, lam, t, k)
            if sc is not None:
                rec['S_cop'] = str(sc)
                if r >= 0 and r <= 5:
                    sel = (k - Nt) % 6
                    wgt2 = None
                    if r == 0: wgt2 = Decimal(1) if sel == 0 else Decimal(q)
                    elif sel == 0: wgt2 = Decimal((q - 1) ** 2)
                    if wgt2 is not None and sc != 0:
                        pred2 = wgt2 * Decimal(q) ** (2 * d) * Decimal(sc) ** 2
                        rec['pred_J2'] = str(pred2.quantize(Decimal(1)))
                        rec['J_over_pred'] = float((J2 / pred2).sqrt())
                    elif wgt2 is None: rec['pred_J2'] = '0'
            rec['_J2'] = J2; recs.append(rec)
        # Bessel: the c_k with k <= d/2 are pairwise orthogonal (k + k' <= d), so ||R||^2 >= sum_k |J_k|^2/||c_k||^2
        bes = sum((rc['_J2'] / nc[rc['k']] for rc in recs if 2 * rc['k'] <= d and nc[rc['k']] > 0), Decimal(0))
        for rc in recs:
            del rc['_J2']
            if D and d >= Nt:
                exc = Decimal(nr) - Decimal(q) ** d * Decimal(D.numerator) / Decimal(D.denominator)
                rc['row_excess_over_diag'] = float(exc / (Decimal(q) ** d * Decimal(D.numerator) / Decimal(D.denominator)))
                rc['bessel_over_diag'] = float(bes / (Decimal(q) ** d * Decimal(D.numerator) / Decimal(D.denominator)))
            out.write(json.dumps(rc) + '\n')
    out.close()
if __name__ == '__main__':
    main(int(sys.argv[1]), int(sys.argv[2]))
