"""Combination (1): Fourier modes in u of log F on circles v = const of the Jacobi chart.

Chart (KLEIN-ANNULUS.md sec 3): m = r^-4, z = 4K u + 2 i K'(v - 1/2), w = (i/r) sn(z|m), s = 1/2 + L (1/(1-w) - 1/2).
Annulus 1/4 <= v <= 3/4 <-> |w| <= 1 <-> Re s >= 1/2.  A(u,v) = (1/2 - u, 1/2 + v).
Sampled quantity: h(u) = d/du log F(s(u,v)) = (F'/F)(s) ds/du (single valued).  hhat_k = (1/N) sum_j h(u_j) e^{-2 pi i k j/N}.
  hhat_0 / (2 pi i) = winding number of F along the circle;  modes of log F: c_k = hhat_k/(2 pi i k), k != 0.
On a sub-annulus without zeros of F: c_k(v) = alpha_k exp(-kappa_k (v - 1/2)), kappa_k = pi k K'/K (holomorphic transport).
KLEIN_ARITH=1 (ZETA only): h = (zeta'/zeta)(s) ds/du, the arithmetic factor alone (the gamma factor and s(s-1) dropped).  In float64 the
completed h loses all digits near the puncture when L >= 1e4 (|ds/du| reaches L/|1-w|^2); the arithmetic factor is 2^-Re s there.
Circles are specified by xmin = Re s - 1/2 at the point u = 1/2 (image on the real axis nearest to s = 1/2), or by v directly.

usage: klein.py CODE r L log2N kmax OUT spec [spec ...]     spec = x:<xmin> | v:<v> | ax:<xmin> (the A-image circle v + 1/2)"""
import sys, os, json, time, math
for _k in ('OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[_k] = '1'
import numpy as np
from multiprocessing import Pool
from scipy.special import ellipk, ellipj, digamma
from flint import acb, arb, ctx, acb_series
import objs

def sncndn(x, y, m):
    """sn, cn, dn of x + i y (parameter m), numpy arrays"""
    s, c, d, _ = ellipj(x, m); s1, c1, d1, _ = ellipj(y, 1 - m)
    den = c1 * c1 + m * s * s * s1 * s1
    sn = (s * d1 + 1j * c * d * s1 * c1) / den
    cn = (c * c1 - 1j * s * d * s1 * d1) / den
    dn = (d * c1 * d1 - 1j * m * s * c * s1) / den
    return sn, cn, dn

class Chart:
    def __init__(self, r, L):
        self.r = r; self.L = L; self.m = r ** -4; self.K = ellipk(self.m); self.Kp = ellipk(1 - self.m)
        self.kap1 = math.pi * self.Kp / self.K
    def s(self, u, v):
        sn, cn, dn = sncndn(4 * self.K * u, 2 * self.Kp * (v - 0.5) * np.ones_like(u), self.m)
        w = 1j / self.r * sn
        dwdu = 1j / self.r * cn * dn * 4 * self.K
        s = 0.5 + self.L * (1 / (1 - w) - 0.5)
        return s, self.L * dwdu / (1 - w) ** 2, w
    def v_of_xmin(self, xmin):
        f = lambda v: float(self.s(np.array([0.5]), v)[0].real[0]) - 0.5 - xmin
        lo, hi = 0.25, 0.5
        for _ in range(200):
            mid = (lo + hi) / 2
            if f(mid) > 0: hi = mid
            else: lo = mid
        return (lo + hi) / 2

_G = {}
def _init(code, tmax):
    ctx.prec = 80
    _G['o'] = objs.get(code, tmax=tmax, bits=80) if code.startswith('HEAT') else objs.get(code)
    _G['code'] = code; ctx.prec = 80

def _primes_upto(n):
    sv = np.ones(n + 1, bool); sv[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if sv[i]: sv[i * i::i] = False
    return np.nonzero(sv)[0]

_PP = {}
def _pp(nmax):
    if nmax not in _PP:
        ns = []; lam = []
        for p in _primes_upto(nmax):
            q = int(p)
            while q <= nmax: ns.append(q); lam.append(math.log(p)); q *= int(p)
        _PP[nmax] = (np.log(np.array(ns, float)), np.array(lam))
    return _PP[nmax]

def zeta_logder_fast(s):
    """zeta'/zeta for Re s >= 4.5 from the prime powers n <= nmax, nmax = 30000 (Re s < 6), 1000 (6 <= Re s < 12), 40 (Re s >= 12):
    truncation below 2e-15 in each tier"""
    out = np.zeros(len(s), complex)
    for lo, hi, nmax in ((4.5, 6.0, 30000), (6.0, 12.0, 1000), (12.0, np.inf, 40)):
        sel = np.nonzero((s.real >= lo) & (s.real < hi))[0]
        if not len(sel): continue
        lg, lam = _pp(nmax); step = max(1, 4000000 // len(lg))
        for i0 in range(0, len(sel), step):
            idx = sel[i0:i0 + step]; blk = s[idx]
            ex = np.exp(-np.minimum(blk.real, 700.0 / lg[0] if False else blk.real)[:, None] * lg[None, :] - 1j * blk.imag[:, None] * lg[None, :])
            out[idx] = -(ex @ lam)
    return out

ARITH = int(os.environ.get('KLEIN_ARITH', '0'))

def _eval(chunk):
    code = _G['code']; o = _G['o']
    out = np.empty(len(chunk), complex)
    fast = np.zeros(len(chunk), bool)
    if code == 'ZETA':
        fast = chunk.real >= 4.5
        if fast.any():
            sf = chunk[fast]
            out[fast] = zeta_logder_fast(sf) if ARITH else (1 / sf + 1 / (sf - 1) - 0.5 * math.log(math.pi) + 0.5 * digamma(sf / 2) + zeta_logder_fast(sf))
    for i in np.nonzero(~fast)[0]:
        sv = chunk[i]
        if ARITH:
            y = acb_series([acb(arb(float(sv.real)), arb(float(sv.imag))), 1], prec=2).zeta(); l = y[1] / y[0]
        else:
            f, l = objs.XL(o, acb(arb(float(sv.real)) - arb(1) / 2, arb(float(sv.imag))))
        out[i] = complex(float(l.real.mid()), float(l.imag.mid()))
    return out

def main():
    code, r, L, lg, kmax, out = sys.argv[1:7]; specs = sys.argv[7:]
    r = float(r); L = float(L); N = 1 << int(lg); kmax = min(int(kmax), N // 2 - 1)
    ch = Chart(r, L); nw = int(os.environ.get('RH_WORKERS', '1'))
    sym = code != 'WT'
    u = np.arange(N) / N
    print('klein %s r=%g L=%g N=2^%s kmax=%d circles %d; K=%.6f Kp=%.6f kappa_1=%.6f; arrays per circle %.2f GB' %
          (code, r, L, lg, kmax, len(specs), ch.K, ch.Kp, ch.kap1, N * 16 * 4 / 1e9), flush=True)
    res = dict(code=code, r=r, L=L, N=N, kmax=kmax, kappa1=ch.kap1, specs=specs, v=[], xmin=[], wind=[], maxabs_t=[], min_x=[], seconds=[])
    H = np.zeros((len(specs), 2 * kmax + 1), complex)
    pool = Pool(nw, initializer=_init, initargs=(code, 2 * L * 50 + 100))
    for ic, sp in enumerate(specs):
        t0 = time.time(); kind, val = sp.split(':'); val = float(val)
        v = val if kind == 'v' else ch.v_of_xmin(val) + (0.5 if kind == 'ax' else 0.0)
        s, dsdu, w = ch.s(u, v)
        idx = np.arange(N // 2 + 1) if sym else np.arange(N)
        pts = s[idx]
        chunks = np.array_split(pts, max(nw * 8, len(pts) // 20000 + 1))
        vals = np.concatenate(pool.map(_eval, chunks, chunksize=1))
        Lv = np.empty(N, complex); Lv[idx] = vals
        if sym: Lv[N // 2 + 1:] = np.conj(vals[1:N // 2][::-1])
        h = Lv * dsdu
        hh = np.fft.fft(h) / N
        H[ic, :kmax + 1] = hh[:kmax + 1]; H[ic, kmax + 1:] = hh[-kmax:]
        res['v'].append(v); res['xmin'].append(float(s[N // 2].real - 0.5)); res['wind'].append([float((hh[0] / (2j * math.pi)).real), float((hh[0] / (2j * math.pi)).imag)])
        res['maxabs_t'].append(float(np.abs(s[1:].imag).max())); res['min_x'].append(float((s.real - 0.5).min())); res['seconds'].append(round(time.time() - t0, 1))
        print('circle %s v=%.12f xmin=%.6g wind=%.6f%+.2ej max|t|=%.4g tail |hhat| at N/2: %.2e (rel to max %.2e) %.1f s' %
              (sp, v, res['xmin'][-1], res['wind'][-1][0], res['wind'][-1][1], res['maxabs_t'][-1], abs(hh[N // 2]), abs(hh[N // 2]) / np.abs(hh).max(), time.time() - t0), flush=True)
        np.savez(out, H=H[:ic + 1], meta=json.dumps(res))
    pool.close()
    np.savez(out, H=H, meta=json.dumps(res))

if __name__ == '__main__':
    main()
