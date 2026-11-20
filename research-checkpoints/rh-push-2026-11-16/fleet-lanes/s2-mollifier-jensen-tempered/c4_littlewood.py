"""Combination 4. I_F(T) = int_0^T log|F(1/2+it)| dt for ZETA, LCHI, DH on a uniform grid.
The grid sum h sum log|Z_j| is corrected at every located real zero by -h log|2 sin(pi u)| (u = position of the zero in its cell);
for a function of exponential type < 2 pi / h the corrected sum equals the integral up to terms h exp(-2 pi eta / h) per zero at distance eta from the line.
[0, TLOW): Euler-Maclaurin evaluator (no functional equation), step HLOW. [TLOW, TMAX]: smooth approximate functional equation + NUFFT, step H.
Usage: c4_littlewood.py TMAX [H] [TLOW] [HLOW]"""
import sys, os, json, math, time, numpy as np
import core
from core import *
TMAX = float(sys.argv[1]); H = float(sys.argv[2]) if len(sys.argv) > 2 else 0.02
TLOW = float(sys.argv[3]) if len(sys.argv) > 3 else 3000.0; HLOW = float(sys.argv[4]) if len(sys.argv) > 4 else 0.004
FN = ('ZETA', 'LCHI', 'DH')
print('TMAX %g h %g TLOW %g hlow %g gpu %s extended %s' % (TMAX, H, TLOW, HLOW, core.GPU, core.EXT), flush=True)

def _vinv(nodes):
    return np.linalg.inv(np.vander(np.array(nodes, dtype=float), increasing=True))
VI6 = _vinv([-2, -1, 0, 1, 2, 3]); VI7 = _vinv([-3, -2, -1, 0, 1, 2, 3])
def _poly(C, x):
    v = C[:, -1]
    for k in range(C.shape[1] - 2, -1, -1): v = v * x + C[:, k]
    return v
def _dpoly(C, x):
    n = C.shape[1] - 1; v = n * C[:, n]
    for k in range(n - 1, 0, -1): v = v * x + k * C[:, k]
    return v
def _d2poly(C, x):
    n = C.shape[1] - 1; v = n * (n - 1) * C[:, n]
    for k in range(n - 1, 1, -1): v = v * x + k * (k - 1) * C[:, k]
    return v

def _bisect(f, lo, hi, it=52):
    flo = f(lo)
    for _ in range(it):
        mid = (lo + hi) / 2; fm = f(mid)
        left = (flo * fm <= 0)
        hi = xp.where(left, mid, hi); lo = xp.where(left, lo, mid); flo = xp.where(left, flo, fm)
    return (lo + hi) / 2

class Acc:
    """corrected grid sum. Simple sign changes: root of the degree-5 interpolant through 6 samples. Two zeros in one cell: located from the
    degree-6 interpolant through 7 samples centred at a local minimum of |Z| between samples of one sign, accepted only if the interpolant crosses zero."""
    def __init__(self, h): self.h = h; self.tail = None; self.I = 0.0; self.nz = 0; self.npair = 0
    def add(self, Z):
        h = self.h
        self.I += h * float(xp.log(xp.abs(Z) + 1e-300).sum())
        first = self.tail is None
        Ze = Z if first else xp.concatenate([self.tail, Z])
        Lz = len(Ze); i0 = 2 if first else 3
        if Lz < 12: self.tail = Ze[-6:].copy() if Lz >= 6 else Ze.copy(); return
        idx = xp.arange(i0, Lz - 3)                                   # intervals (i, i+1), i = i0..Lz-4
        sc = idx[(Ze[idx] * Ze[idx + 1] < 0)]
        if len(sc):
            Y = xp.stack([Ze[sc + k] for k in range(-2, 4)], axis=1); C = Y @ xp.asarray(VI6.T)
            x = _bisect(lambda u: _poly(C, u), xp.zeros(len(sc)), xp.ones(len(sc)))
            self.I -= h * float(xp.log(xp.abs(2 * xp.sin(math.pi * x))).sum()); self.nz += int(len(sc))
        cc = xp.arange(i0, Lz - 3)                                    # centres c = i0..Lz-4
        p0 = Ze[cc - 1]; p1 = Ze[cc]; p2 = Ze[cc + 1]
        m = (p0 * p1 > 0) & (p1 * p2 > 0) & (xp.abs(p1) <= xp.abs(p0)) & (xp.abs(p1) < xp.abs(p2))
        c2 = (p0 - 2 * p1 + p2) / 2; c1 = (p2 - p0) / 2
        m = m & (c1 * c1 - 4 * c2 * p1 > -0.5 * c1 * c1 - 1e-300) & (c2 * p1 > 0)
        cs = cc[m]
        if len(cs):
            Y = xp.stack([Ze[cs + k] for k in range(-3, 4)], axis=1); C = Y @ xp.asarray(VI7.T)
            lo = -xp.ones(len(cs)); hi = xp.ones(len(cs))
            okd = (_dpoly(C, lo) * _dpoly(C, hi) < 0)
            xe = _bisect(lambda u: _dpoly(C, u), lo, hi)
            ve = _poly(C, xe)
            ok = okd & (ve * Y[:, 3] < 0)                              # the interpolant crosses zero: two zeros in the cell
            if bool(ok.any()):
                C = C[ok]; xe = xe[ok]
                zl = xp.where(xe > 0, 0.0, -1.0); zh = xp.where(xe > 0, 1.0, 0.0)
                r1 = _bisect(lambda u: _poly(C, u), zl, xe); r2 = _bisect(lambda u: _poly(C, u), xe, zh)
                self.I -= h * float((xp.log(xp.abs(2 * xp.sin(math.pi * r1)) + 1e-300) + xp.log(xp.abs(2 * xp.sin(math.pi * r2)) + 1e-300)).sum())
                self.nz += 2 * int(ok.sum()); self.npair += int(ok.sum())
        self.tail = Ze[Lz - 6:].copy()

def theta_parts(win, q, kappa, epsroot, KX):
    X, _ = xfac(win, 0.5, q, kappa, epsroot, KX)
    return X

out = {f: {'T': [], 'I': [], 'nz': [], 'npair': []} for f in FN}
acc = {f: Acc(HLOW) for f in FN}
def record(Tend):
    for f in FN:
        out[f]['T'].append(Tend); out[f]['I'].append(acc[f].I); out[f]['nz'].append(acc[f].nz); out[f]['npair'].append(acc[f].npair)
t00 = time.time()
# ---- low range: Euler-Maclaurin
os.environ.setdefault('S1_POOL_GB', '6')
sys.path.insert(0, '../s1-scattering-one-line'); sys.path.insert(0, '.')
import lib as s1
import mpmath as mp
def X0_low(t, q, kappa):
    s = 0.5 + 1j * t
    return np.exp((0.5 - s) * math.log(q / math.pi) + s1.lgamma_stirling((1 - s + kappa) / 2) - s1.lgamma_stirling((s + kappa) / 2))
nlow = int(round(min(TLOW, TMAX) / HLOW)); B = 2500; maximag = 0.0
marks = sorted(set([50, 100, 200, 500, 1000, 2000, TLOW]))
for b0 in range(0, nlow, B):
    j = np.arange(b0, min(b0 + B, nlow)); t = (j + 0.5) * HLOW            # cell midpoints
    Rz, _ = s1.hurwitz_batch(t, 0.5, 1, want_deriv=False); R5, _ = s1.hurwitz_batch(t, 0.5, 5, want_deriv=False)
    z = Rz[0]; chi = CHI5[1:5]; lc = chi @ R5[:4]; lb = np.conj(chi) @ R5[:4]; dh = C1 * lc + C2 * lb
    xz = X0_low(t, 1, 0); x5 = X0_low(t, 5, 1)
    vals = {'ZETA': z * xz ** -0.5, 'LCHI': lc * (EPS5 * x5) ** -0.5, 'DH': dh * x5 ** -0.5}
    for f in FN:
        v = vals[f]
        # the square root of X is taken pointwise: fix the sign by continuity is not needed for |.|, but the real part is: use v^2 phase
        zr = np.where(np.abs(v.real) >= np.abs(v.imag), v.real, v.imag)      # v is real or purely imaginary up to rounding (branch of the root)
        maximag = max(maximag, float(np.minimum(np.abs(v.real), np.abs(v.imag)).max() / (np.abs(v).max() + 1e-300)))
        vals[f] = zr
    if b0 == 0: ph = {f: None for f in FN}
    for f in FN:
        # make the real function continuous: the pointwise root flips sign and swaps real/imag at branch crossings; use e^{i theta} from unwrapped half-phase
        pass
    tt = t
    th_z = 0.5 * np.unwrap(np.angle(xz)) if b0 == 0 else None
    # continuous half-phases through mp-free cumulative unwrap, carried between batches
    for f, X in (('ZETA', xz), ('LCHI', EPS5 * x5), ('DH', x5)):
        a = np.angle(X)
        if ph[f] is None: start = a[0] / 2
        else: start = ph[f][0] + (np.angle(X[0] / ph[f][1])) / 2
        half = start + np.concatenate([[0.0], np.cumsum(np.angle(X[1:] / X[:-1]))]) / 2
        ph[f] = (float(half[-1]), complex(X[-1]))
        F = {'ZETA': z, 'LCHI': lc, 'DH': dh}[f]
        v = F * np.exp(-1j * half)
        maximag = max(maximag, float(np.abs(v.imag).max() / np.abs(v).max()))
        acc[f].add(xp.asarray(v.real))
    Tend = (b0 + len(j)) * HLOW
    for mk in marks:
        if Tend - B * HLOW < mk <= Tend + 1e-9 and abs(Tend - mk) < 1e-6: record(Tend)
print('low range done to %g in %.0fs; max |Im|/|.| of the rotated values %.2e' % (min(TLOW, TMAX), time.time() - t00, maximag), flush=True)
if not out['ZETA']['T'] or out['ZETA']['T'][-1] != nlow * HLOW: record(nlow * HLOW)
for f in FN:
    print(f, [(T_, round(I_, 4), n_) for T_, I_, n_ in zip(out[f]['T'], out[f]['I'], out[f]['nz'])], flush=True)
# ---- high range
for f in FN:
    a2 = Acc(H); a2.I = acc[f].I; a2.nz = acc[f].nz; a2.npair = acc[f].npair; acc[f] = a2     # new step: restart the stencil (the cells at the junction are not searched)
t_lo = nlow * HLOW; nb = 0; MMAX = 1 << 22
j_lo = int(round(t_lo / H)); assert abs(j_lo * H - t_lo) < 1e-6
j_max = int(round(TMAX / H))
Sall = int(math.sqrt(5 * TMAX * 1.05 / (2 * math.pi)) * math.exp(7.5 / 4)) + 100
nn = np.arange(1, Sall + 1)
coefs = {'one': xp.ones(Sall, dtype=xp.complex128), 'chi': xp.asarray(CHI5[nn % 5]), 'chib': xp.asarray(np.conj(CHI5[nn % 5]))}
announce('FFT grid complex128 x 3', 16 * 2 * MMAX * 3)
maximag = 0.0
def next_mark_index(j):
    m = 10 ** math.ceil(math.log10((j + 1) * H))
    return int(round(m / H))
jm = min(next_mark_index(j_lo), j_max)
while j_lo < j_max:
    t_lo = j_lo * H
    M = MMAX
    while M > 256 and M * H / 2 > 0.02 * (t_lo + M * H / 2): M //= 2
    if j_lo + M > jm:
        M = jm - j_lo
        if M > 512: M = 1 << int(math.log2(M))
        if M % 2: M += 1
    tc = t_lo + M * H / 2
    Smax = int(math.sqrt(5 * (tc + M * H) / (2 * math.pi)) * math.exp(7.5 / 4)) + 10
    w = Win(tc, H, M, Smax)
    Dz, _ = afe_sums(w, 0.5, 1, 0, coefs['one'], deriv=False); Xz, _ = xfac(w, 0.5, 1, 0, 1.0, 11)
    Dc, _ = afe_sums(w, 0.5, 5, 1, coefs['chi'], deriv=False); Db, _ = afe_sums(w, 0.5, 5, 1, coefs['chib'], deriv=False); X5, _ = xfac(w, 0.5, 5, 1, 1.0, 11)
    z = Dz + Xz * xp.conj(Dz); lc = Dc + EPS5 * X5 * xp.conj(Dc); lb = Db + np.conj(EPS5) * X5 * xp.conj(Db)
    dh = C1 * lc + C2 * lb
    for f, F, X in (('ZETA', z, Xz), ('LCHI', lc, EPS5 * X5), ('DH', dh, X5)):
        # continuous half phase inside the block from the series; the global sign is irrelevant for |.| and for sign changes inside a block,
        # at block junctions the sign is aligned with the carried tail by continuity of the phase
        ang = xp.angle(X[1:] / X[:-1])
        X0 = complex(X[0]); start = ph[f][0] + float(np.angle(X0 / ph[f][1])) / 2
        half = start + xp.concatenate([xp.zeros(1), xp.cumsum(ang)]) / 2
        ph[f] = (float(half[-1]), complex(X[-1]))
        v = F * xp.exp(-1j * half)
        maximag = max(maximag, float(xp.abs(v.imag).max() / xp.abs(v).max()))
        zr = v.real
        acc[f].add(zr)
    j_lo += M; t_lo = j_lo * H; nb += 1
    atmark = (j_lo >= jm)
    if atmark or nb % 25 == 0:
        record(t_lo)
        if atmark or nb % 200 == 0:
            print('T %.6g blocks %d %.0fs | ' % (t_lo, nb, time.time() - t00) + ' | '.join('%s I %.4f zeros %d pairs-in-cell %d' % (f, acc[f].I, acc[f].nz, acc[f].npair) for f in FN) + ' | max Im ratio %.1e' % maximag, flush=True)
        if atmark and j_lo < j_max: jm = min(next_mark_index(j_lo), j_max)
        json.dump(out, open('c4_result_T%g_h%g.json' % (TMAX, H), 'w'))
print('done %.0fs' % (time.time() - t00))
