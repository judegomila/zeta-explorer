"""ylib.py : exact assembly of marked rows from the prime-sum table Y of `ffy ytab` (lane c11-ff-row-energy-four-part), and the weight classes.
    R_w(m) = sum_{A' squarefree, in the support, coprime to m} zeta_6^(5 lA[A'] + wph[A'] + T[m][A']) Y[m][A']        (units G_2^(N+lam))
All sums are int64 (bounded by np * q^N < 4e12) and python integers; elements of Z[zeta_6] are pairs (a, b) = a + b zeta_6.
Weight classes (phase arrays wph over the q^N monic cofactors, 100 = not in the support):
  defined in vecs.py (one, a, b, mu, cm<seed>, ru<seed>); al = aligned vector (mode 5 of ffw6, from the NPA table)."""
import os, sys, numpy as np
from ffpy import FF, mul, add, norm, conj, ZP
q = 7; F = FF(q)
ZA = np.array([1, 0, -1, -1, 0, 1], dtype=np.int64); ZB = np.array([0, 1, 1, 0, -1, -1], dtype=np.int64)
M64 = (1 << 64) - 1
def hash64(x):
    x = (x + 0x9e3779b97f4a7c15) & M64; x = ((x ^ (x >> 30)) * 0xbf58476d1ce4e5b9) & M64; x = ((x ^ (x >> 27)) * 0x94d049bb133111eb) & M64; return x ^ (x >> 31)
def digits(k):
    """coefficient matrix (q^k, k+1) of the monic polynomials of degree k, low -> high, in index order."""
    i = np.arange(q**k, dtype=np.int64); return np.stack([(i // q**a) % q for a in range(k)] + [np.ones_like(i)], axis=1)
class Y:
    def __init__(s, prefix):
        h = open(prefix + '.txt').read().split('\n'); t = h[0].replace('|', ' ').split()
        assert t[0] == 'YTAB' and int(t[1]) == q and 'DONE' in h
        s.d, s.N, s.lam = int(t[2]), int(t[3]), int(t[4]); s.np = int(t[6]); s.nm = int(t[8]); s.nA = int(t[10]); s.m0 = int(t[12])
        s.NPA = [[int(x) for x in l.split()[2:]] for l in h if l.startswith('NPA')]
        n = s.nm * s.nA; raw = np.fromfile(prefix + '.bin', dtype=np.uint8); assert raw.size == 16*n + s.nA + n
        s.Ya = raw[:8*n].view(np.int64).reshape(s.nm, s.nA); s.Yb = raw[8*n:16*n].view(np.int64).reshape(s.nm, s.nA)
        s.lA = raw[16*n:16*n + s.nA].view(np.int8).astype(np.int64); s.T = raw[16*n + s.nA:].reshape(s.nm, s.nA).astype(np.int64)
        s.sqf = s.lA >= 0; s.cop = s.T != 100
        base = (5*s.lA[None, :] + s.T) % 6; ok = s.sqf[None, :] & s.cop
        za = ZA[base]; zb = ZB[base]   # zeta^base * (Ya + Yb zeta): (a + b z)(c + d z) = (ac - bd) + (ad + bc + bd) z
        s.Ua = np.where(ok, za*s.Ya - zb*s.Yb, 0); s.Ub = np.where(ok, za*s.Yb + zb*s.Ya + zb*s.Yb, 0)
    def rows(s, wph):
        """wph: (W, nA) uint8 phases (100 = unsupported).  Returns list over weights of the row list [(a, b)] and the diagonal np * sum_{supp} #{m coprime}."""
        wph = np.atleast_2d(wph); out = []
        for w in wph:
            ra = [0]*s.nm; rb = [0]*s.nm
            for e in range(6):
                sel = np.nonzero((w == e) & s.sqf)[0]
                if not sel.size: continue
                a = s.Ua[:, sel].sum(axis=1); b = s.Ub[:, sel].sum(axis=1); za, zb = int(ZA[e]), int(ZB[e])
                for mi in range(s.nm):
                    x, y = int(a[mi]), int(b[mi]); ra[mi] += za*x - zb*y; rb[mi] += za*y + zb*x + zb*y
            sup = (w != 100) & s.sqf; diag = s.np * int(s.cop[:, sup].sum())
            out.append(([(ra[mi], rb[mi]) for mi in range(s.nm)], diag, s.np * int(sup.sum())))
        return out
    def aligned(s):
        """mode 5 of ffw6: coefficient G_2^(N+lam) conj(chi_{P A'}(m0)); support: squarefree A' coprime to m0."""
        sup = s.sqf & s.cop[s.m0]; rows = []
        for mi in range(s.nm):
            ok = sup & s.cop[mi]; k = (s.T[mi][ok] - s.T[s.m0][ok]) % 6; ck = np.bincount(k, minlength=6); r = (0, 0)
            for sh in range(6):
                for kk in range(6):
                    c = s.NPA[mi][sh] * int(ck[kk]); z = ZP[(kk + sh) % 6]; r = (r[0] + c*z[0], r[1] + c*z[1])
            rows.append(r)
        return rows, s.np * int(s.cop[:, sup].sum()), s.np * int(sup.sum())
from vecs import uphase
def vector_fn(name, K=6):
    """u of vecs.py as {K: phase array}; the definitions live in vecs.py (pure python) so that the cube coefficients and the cofactor weights are one function."""
    return {K: np.array(uphase(name, K, K), dtype=np.int64)}
def load_enw(fn):
    """stored result file of ffw / ffw6: list of blocks {mode, p, np, sumnorm, diag, sW2, rows}."""
    W = []; rows = {}
    for line in open(fn):
        t = line.split()
        if not t: continue
        if t[0] == 'ENW':
            f = [x.strip() for x in line.split('|')]; h = f[0].split()
            W.append({'mode': int(h[5]), 'p': tuple(int(x) for x in h[6:9]), 'np': int(f[1]), 'sumnorm': int(f[2]), 'diag': int(f[3]), 'sW2': int(f[4])})
        elif t[0] == 'ROW': rows.setdefault(int(t[1]), []).append((int(t[3]), int(t[4])))
    for i, w in enumerate(W): w['rows'] = rows[i]; assert sum(norm(r) for r in rows[i]) == w['sumnorm']
    return W
KEY = {'one': (0, (0, 0, 0)), 'a': (0, (3, 2, 3)), 'b': (0, (3, 8, 3)), 'mu': (4, (0, 0, 0)), 'al': (5, (0, 0, 0))}
def key_of(name):
    if name.startswith('cm'): return (6, (int(name[2:]), 0, 0))
    return KEY[name]
if __name__ == '__main__':
    # validation: python ylib.py <ytab prefix> <stored ENW file> : every vector of the stored file that this module can build is compared row by row
    y = Y(sys.argv[1]); W = load_enw(sys.argv[2]); ok = 0; bad = 0
    for w in W:
        name = next((n for n in list(KEY) if KEY[n] == (w['mode'], w['p'])), None)
        if w['mode'] == 6: name = 'cm%d' % w['p'][0]
        if name is None: continue
        if name == 'al': rows, diag, sW2 = y.aligned()
        else: rows, diag, sW2 = y.rows(vector_fn(name, y.N)[y.N].astype(np.uint8))[0]
        same = rows == w['rows'] and diag == w['diag'] and sW2 == w['sW2'] and y.np == w['np']
        ok += same; bad += not same
        print(('OK   ' if same else 'DIFF ') + f"{name}: (N, lam, d) = ({y.N}, {y.lam}, {y.d}): {len(rows)} rows, diag, sW2, np " + ('identical' if same else 'differ'))
    print(f'VALIDATION {os.path.basename(sys.argv[1])} against {os.path.basename(sys.argv[2])}: {ok} identical, {bad} different'); sys.exit(1 if bad or not ok else 0)
