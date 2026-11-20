"""Zero count of the approximant f_t(x + iy) (arXiv:1904.12438v2 eq. (14)) with coefficients a(n), by the argument principle on a rectangle.
  f = sum_{n<=N} a(n) b_n^t n^{-s*} + gamma sum_{n<=N} conj(a(n)) b_n^t n^{y - conj(s*) - kappa},   N = floor(sqrt(x/4 pi + t/16))
  s* = s0 + (t/2) alpha(s0), s0 = (1 + y - ix)/2, kappa = (t/2)(alpha((1-y+ix)/2) - alpha((1+y+ix)/2)), gamma = M_t((1-y+ix)/2)/M_t(s0)
Phases (x/2) ln n are reduced exactly (split products); s*, kappa, gamma from mpmath at 40 digits per point.
Usage: c4_wind.py validate | run"""
import sys, math, json, time
import mpmath as mp
from lib import *
mp.mp.dps = 40
def alpha(s): return 1 / (2 * s) + 1 / (s - 1) + mp.log(s / (2 * mp.pi)) / 2
def log_m0(s): return mp.log(s) + mp.log(s - 1) - (s / 2) * mp.log(mp.pi) + mp.log(mp.sqrt(2 * mp.pi) / 16) + (s / 2 - mp.mpf(1) / 2) * mp.log(s / 2) - s / 2
def log_mt(s, t): a = alpha(s); return log_m0(s) + (mp.mpf(t) / 4) * a * a
_L = {}
def logs(N):
    if _L.get('N', 0) < N:
        if np.finfo(np.longdouble).nmant >= 63:
            l = np.log(np.arange(1, N + 1, dtype=np.longdouble)); Lh = l.astype(np.float64); Ll = (l - Lh.astype(np.longdouble)).astype(np.float64)
        else:
            Lh = np.zeros(N); Ll = np.zeros(N)
            for n in range(2, N + 1):
                v = mp.log(n); Lh[n - 1] = float(v); Ll[n - 1] = float(v - mp.mpf(Lh[n - 1]))
        La = np.rint(Lh * 2.0**22) / 2.0**22
        _L.update(N=N, Lh=xp.asarray(Lh), Ll=xp.asarray(Ll), La=xp.asarray(La), Lb=xp.asarray(Lh - La))
    return _L
def feval(a, pts, t, BUD=2e7):
    """a: numpy coefficient array (index n); pts: list of (x mp, y float). Returns numpy complex array."""
    P = len(pts); Yh = np.zeros(P); Yl = np.zeros(P); Np = np.zeros(P, dtype=np.int64)
    re1 = np.zeros(P); dIm = np.zeros(P); re2 = np.zeros(P); im2 = np.zeros(P); gam = np.zeros(P, dtype=np.complex128)
    for i, (x, y) in enumerate(pts):
        x = mp.mpf(x); Y = x / (4 * mp.pi); Yh[i] = float(Y); Yl[i] = float(Y - mp.mpf(Yh[i])); Np[i] = int(mp.floor(mp.sqrt(Y + mp.mpf(t) / 16)))
        s0 = mp.mpc(1 + y, -x) / 2; aarg = mp.mpc(1 - y, x) / 2; barg = mp.mpc(1 + y, x) / 2
        sst = s0 + (mp.mpf(t) / 2) * alpha(s0); kap = (mp.mpf(t) / 2) * (alpha(aarg) - alpha(barg)); lg = log_mt(aarg, t) - log_mt(s0, t)
        re1[i] = float(sst.real); dIm[i] = float(sst.imag + x / 2); re2[i] = float(y - sst.real - kap.real); im2[i] = dIm[i] - float(kap.imag)
        gam[i] = complex(mp.exp(mp.mpc(lg.real, lg.imag - 2 * mp.pi * mp.floor(lg.imag / (2 * mp.pi)))))
    Nmax = int(Np.max()); L = logs(Nmax); ag = xp.asarray(a[1:Nmax + 1].astype(np.complex128)); out = np.zeros(P, dtype=np.complex128)
    B = max(1, int(BUD // Nmax))
    for p0 in range(0, P, B):
        sl = slice(p0, min(P, p0 + B)); yh = xp.asarray(Yh[sl])[:, None]; yl = xp.asarray(Yl[sl])[:, None]
        ya = xp.floor(yh / 16384.0) * 16384.0; yb = yh - ya; lh = L['Lh'][None, :Nmax]
        fr = xp.fmod(ya * L['La'][None, :Nmax], 1.0); fr += xp.fmod(ya * L['Lb'][None, :Nmax], 1.0); fr += xp.fmod(yb * L['La'][None, :Nmax], 1.0)
        fr += yb * L['Lb'][None, :Nmax]; fr += yh * L['Ll'][None, :Nmax]; fr += yl * lh; fr -= xp.rint(fr); fr *= 2 * math.pi
        msk = (xp.arange(1, Nmax + 1)[None, :] <= xp.asarray(Np[sl])[:, None]); heat = (t / 4) * lh * lh
        t1 = xp.exp(heat - xp.asarray(re1[sl])[:, None] * lh) * msk * xp.exp(1j * (fr - xp.asarray(dIm[sl])[:, None] * lh))
        t2 = xp.exp(heat + xp.asarray(re2[sl])[:, None] * lh) * msk * xp.exp(1j * (-fr + xp.asarray(im2[sl])[:, None] * lh))
        out[sl] = asnp(t1 @ ag + xp.asarray(gam[sl]) * (t2 @ xp.conj(ag)))
        del fr, t1, t2, msk
    return out
def rect(xa, Lx, ya, yb, hx, hy):
    """counterclockwise boundary points; xa mp"""
    nx = int(round(Lx / hx)); ny = int(round((yb - ya) / hy)); pts = []
    pts += [(xa + mp.mpf(i * hx), ya) for i in range(nx)]
    pts += [(xa + mp.mpf(Lx), ya + j * hy) for j in range(ny)]
    pts += [(xa + mp.mpf(Lx - i * hx), yb) for i in range(nx)]
    pts += [(xa, yb - j * hy) for j in range(ny)]
    return pts
def winding(a, pts, t):
    f = feval(a, pts, t); f = np.append(f, f[0]); d = np.angle(f[1:] / f[:-1])
    return int(round(d.sum() / (2 * math.pi))), float(np.abs(d).max()), float(np.abs(f).min())
if sys.argv[1] == 'validate':
    # t = 0: f_0(x + iy) is the Riemann-Siegel sum for zeta((1 + y - ix)/2); zeros in the rectangle = zeros of zeta with ordinate in [xa/2, xb/2]
    a = coefs('ZETA', 2000)
    for T in (1.0e4, 1.0e5, 1.0e6):
        xa = mp.mpf(2 * T) + mp.mpf('0.3'); Lx = 40.0
        pt = [(xa + 7, 0.3)]; v = feval(a, pt, 0.0)[0]; ref = complex(mp.zeta(mp.mpc(1.3, -(xa + 7)) / 2))
        w, dmax, fmin = winding(a, rect(xa, Lx, -0.6, 0.6, 0.02, 0.02), 0.0)
        cnt = int(mp.nzeros(float((xa + Lx) / 2)) - mp.nzeros(float(xa / 2)))
        print('T %g: f_0 %.8f%+.8fi  zeta %.8f%+.8fi  |diff| %.2e ; winding %d, zeros of zeta in the ordinate range %d (max step of arg %.2f, min |f| on the boundary %.3f)' % (T, v.real, v.imag, ref.real, ref.imag, abs(v - ref), w, cnt, dmax, fmin), flush=True)
else:
    out = []
    Nl = [1000, 10000, 100000, 690988]; ts = [T0, 0.10, 0.05, 0.0]
    for nm in ('ZETA', 'LCHI5', 'DH', 'TNR', 'EA', 'SGN', 'U'):
        a = coefs(nm, max(Nl) + 2)
        for N in Nl:
            for t in ts:
                xa = 4 * mp.pi * (mp.mpf(N) ** 2 - mp.mpf(t) / 16) + mp.mpf(0.37) * 4 * mp.pi * (2 * N + 1)
                t1 = time.time(); w, dmax, fmin = winding(a, rect(xa, 40.0, Y0, 1.0, 0.02, 0.02), t)
                r = dict(F=nm, N=N, t=t, x=float(xa), Lx=40.0, ylo=Y0, yhi=1.0, zeros=w, max_arg_step=dmax, min_abs_f_boundary=fmin, sec=round(time.time() - t1, 1))
                out.append(r); print(json.dumps(r), flush=True)
    json.dump(out, open('c4_wind.json', 'w'), indent=1)
print('done')
