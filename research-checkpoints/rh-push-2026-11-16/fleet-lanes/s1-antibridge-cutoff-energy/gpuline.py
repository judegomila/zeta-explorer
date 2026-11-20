"""s1-antibridge-cutoff-energy: float64 line scan of Z-type functions at large height (GPU through cupy, numpy fallback).
Objects: ZETA (Riemann-Siegel main sum + C0, C1 terms), CHI4 and DH (approximate functional equation, main sums only:
error O((q/t)^(1/4)); a screen).  For tau = t - i h (h >= 0 small):
   Z(tau) = e^{i theta(tau)} A(-h) + e^{-i theta(tau)} conj(A(+h)) + R(tau),   A(sig) = sum_{n<=N(t)} a_n n^{-1/2+sig} e^{-i t log n}.
Outputs (json + npy): normalised Laguerre form on the line, Re(F'/F)(h+it)/(h theta'^2) for each h, zero counts per
Gram and half-Gram interval, the phase of S(it) = (F - alpha F')/(F + alpha F') on a subsampled grid.
float64 output is a screen: extremes are re-checked with python-flint by recheck.py.
Usage: gpuline.py OBJ T0 T1 dt outprefix [block] [sstride]"""
import sys, os, json, math, time
import numpy as np
GPU = False
try:
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=int(os.environ.get('RH_CUPY_GB', '24')) * 1024 ** 3)
    xp.zeros(4).sum(); GPU = True
except Exception as e:
    import numpy as xp
PI = math.pi
HS = [0.01, 0.05, 0.125]          # h = a/2 for a in {0.02, 0.1, 0.25}
ALPHA = 1.0

def asnp(a):
    return xp.asnumpy(a) if GPU else np.asarray(a)

def lgam(w):
    return (w - 0.5) * xp.log(w) - w + 0.5 * math.log(2 * PI) + 1 / (12 * w) - 1 / (360 * w ** 3) + 1 / (1260 * w ** 5) - 1 / (1680 * w ** 7)
def psi(w):
    return xp.log(w) - 1 / (2 * w) - 1 / (12 * w ** 2) + 1 / (120 * w ** 4) - 1 / (252 * w ** 6)
def psi1(w):
    return 1 / w + 1 / (2 * w ** 2) + 1 / (6 * w ** 3) - 1 / (30 * w ** 5) + 1 / (42 * w ** 7)

class Gam:
    """theta, theta', theta'', lambda', lambda'' of the gamma factor at complex tau; s = 1/2 + i tau, w = (s + mu)/2."""
    def __init__(self, q, mu, zeta_poly):
        self.cq = 0.5 * math.log(q / PI); self.mu = mu; self.zp = zeta_poly
    def all(self, tau):
        w = (0.5 + self.mu) / 2 + 0.5j * tau; wt = (0.5 + self.mu) / 2 - 0.5j * tau
        th = tau * self.cq + (lgam(w) - lgam(wt)) / 2j
        p, pt = psi(w), psi(wt)
        th1 = self.cq + 0.25 * (p + pt)
        q1, q1t = psi1(w), psi1(wt)
        th2 = 0.125j * (q1 - q1t)
        l1 = 0.25j * (p - pt)
        l2 = -0.125 * (q1 + q1t)
        if self.zp:
            d = tau * tau + 0.25
            l1 = l1 + 2 * tau / d
            l2 = l2 + (0.5 - 2 * tau * tau) / (d * d)
        return th, th1, th2, l1, l2

def clenshaw(c, x):
    b1 = xp.zeros_like(x); b2 = xp.zeros_like(x)
    for ck in c[:0:-1]:
        b1, b2 = 2 * x * b1 - b2 + ck, b1
    return x * b1 - b2 + c[0]

class RS:
    def __init__(self, path):
        d = json.load(open(path)); self.d = d
        self.mid = 0.5 * (d['a'] + d['b']); self.sc = 2.0 / (d['b'] - d['a'])
    def R(self, tau, N):
        """remainder, d/dtau, and leading part of d2/dtau2, at complex tau"""
        a = tau / (2 * PI); ra = xp.sqrt(a); p = ra - N
        x = (p - self.mid) * self.sc
        d = self.d
        C0 = clenshaw(d['C0'], x); C0d = clenshaw(d['C0d'], x); C0dd = clenshaw(d['C0dd'], x)
        C1 = clenshaw(d['C1'], x); C1d = clenshaw(d['C1d'], x)
        sg = xp.where(N % 2 == 1, 1.0, -1.0)
        a14 = a ** (-0.25); dp = 1 / (4 * PI * ra)
        R = sg * a14 * (C0 + C1 / ra)
        Rd = sg * (-0.25 * a14 / a / (2 * PI) * (C0 + C1 / ra) + a14 * (C0d + C1d / ra) * dp - 0.5 * a14 * C1 / (ra * a) / (2 * PI))
        Rdd = sg * a14 * C0dd * dp * dp
        return R, Rd, Rdd

def coeffs(obj, nmax):
    n = np.arange(1, nmax + 1)
    if obj == 'ZETA': a = np.ones(nmax); q = 1; mu = 0
    elif obj == 'CHI4':
        a = np.array([0.0, 1.0, 0.0, -1.0])[n % 4]; q = 4; mu = 1
    elif obj == 'DH':
        k = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
        a = np.array([0.0, 1.0, k, -k, -1.0])[n % 5]; q = 5; mu = 1
    keep = a != 0
    return n[keep], a[keep], q, mu

def scan(obj, T0, T1, dt, out, block=100000, sstride=2):
    q = {'ZETA': 1, 'CHI4': 4, 'DH': 5}[obj]; mu = 0 if obj == 'ZETA' else 1
    gam = Gam(q, mu, obj == 'ZETA'); rs = RS(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rs_cheb.json')) if obj == 'ZETA' else None
    M = int(round((T1 - T0) / dt))
    nmaxT = int(math.sqrt(q * T1 / (2 * PI)))
    print('obj %s T0 %g T1 %g dt %g points %d Nmax %d GPU %s' % (obj, T0, T1, dt, M, nmaxT, GPU), flush=True)
    print('planned memory per block: phase+exp matrix %.2f GB (block %d x N %d x 24 bytes), outputs %.2f GB'
          % (block * nmaxT * 24 / 1e9, block, nmaxT, (M // sstride) * 8 / 1e9 + 0.3), flush=True)
    thT = float(asnp(gam.all(xp.asarray([T1 + 1.0]) + 0j)[0].real)[0])
    nint = int(thT / PI) + 8
    cg = np.zeros(nint, dtype=np.int32); ch = np.zeros(nint, dtype=np.int32)     # zeros per Gram / half-Gram interval
    Sphase = np.zeros(M // sstride + 1, dtype=np.float64)
    nH = len(HS)
    stat = dict(lag_norm_min=[1e300, 0.0], lag_rho_min=[1e300, 0.0], w_min=[[1e300, 0.0] for _ in HS], w_neg=[0] * nH, lag_neg=0, zeros=0, pairs=0)
    cands = dict(lag_norm=[], lag_rho=[], w=[[] for _ in HS])
    bands = {}
    t_start = time.time()
    prevZ = None
    for b0 in range(0, M + 1, block):
        b1 = min(M + 1, b0 + block)
        t = T0 + dt * xp.arange(b0, b1 + 1, dtype=xp.float64)        # one overlap point for cells
        nb = t.shape[0]
        nn, an, _, _ = coeffs(obj, int(math.sqrt(q * float(t[-1]) / (2 * PI))))
        N = xp.floor(xp.sqrt(q * t / (2 * PI)))
        nx = xp.asarray(nn, dtype=xp.float64); ax = xp.asarray(an); ln = xp.log(nx)
        E = xp.exp(-1j * (t[:, None] * ln[None, :]))
        E *= (nx[None, :] <= N[:, None])
        cols = []
        base = ax / xp.sqrt(nx)
        for sig in [0.0] + [-h for h in HS] + HS:
            wsig = base * nx ** sig
            cols.append(wsig); cols.append(wsig * ln)
        cols.append(base * ln * ln)
        Wm = xp.stack(cols, axis=1).astype(xp.complex128)
        A = E @ Wm
        del E
        # ---- on the line ----
        th, th1, th2, l1, l2 = gam.all(t + 0j)
        th = th.real; th1 = th1.real; th2 = th2.real; l1 = l1.real; l2 = l2.real
        e = xp.exp(1j * th)
        A0, A1, A2 = A[:, 0], A[:, 1], A[:, -1]
        Z = 2 * (e * A0).real
        Zd = 2 * (1j * th1 * e * A0 - 1j * e * A1).real
        Zdd = 2 * ((1j * th2 - th1 ** 2) * e * A0 + 2 * th1 * e * A1 - e * A2).real
        if rs is not None:
            R, Rd, Rdd = rs.R(t + 0j, N)
            Z = Z + R.real; Zd = Zd + Rd.real; Zdd = Zdd + Rdd.real
        lagZ = Zd * Zd - Z * Zdd - l2 * Z * Z                   # (h'^2 - h h'')/g^2
        hp = l1 * Z + Zd                                        # h'/g
        lag_norm = lagZ / (hp * hp + xp.abs(lagZ - hp * hp) + 1e-300)
        lag_rho = lagZ / (Z * Z + 1e-300) / th1 ** 2
        S = (Z + 1j * ALPHA * hp) / (Z - 1j * ALPHA * hp)
        tt = asnp(t)
        def upd(name, arr, key=None, idx=None):
            i = int(xp.argmin(arr[:-1])); v = float(arr[i])
            tgt = stat[name] if idx is None else stat[name][idx]
            if v < tgt[0]: tgt[0] = v; tgt[1] = float(tt[i])
            lst = cands[key] if idx is None else cands[key][idx]
            lst.append((v, float(tt[i]))); lst.sort(); del lst[8:]
            return v, float(tt[i])
        v1 = upd('lag_norm_min', lag_norm, 'lag_norm'); v2 = upd('lag_rho_min', lag_rho, 'lag_rho')
        stat['lag_neg'] += int((lagZ[:-1] < 0).sum())
        dec = int(math.floor(math.log10(max(float(tt[0]), 1.0)) * 4))      # quarter-decade band
        bd = bands.setdefault(dec, dict(lag_norm=1e300, lag_rho=1e300, w=[1e300] * nH, zeros=0, t0=float(tt[0])))
        bd['lag_norm'] = min(bd['lag_norm'], v1[0]); bd['lag_rho'] = min(bd['lag_rho'], v2[0]); bd['t1'] = float(tt[-1])
        # ---- off the line ----
        for k, h in enumerate(HS):
            tau = t - 1j * h
            thc, th1c, th2c, l1c, l2c = gam.all(tau)
            ec = xp.exp(1j * thc); eci = 1 / ec
            Am, Am1 = A[:, 2 + 2 * k], A[:, 3 + 2 * k]
            Ap, Ap1 = xp.conj(A[:, 2 + 2 * nH + 2 * k]), xp.conj(A[:, 3 + 2 * nH + 2 * k])
            Zc = ec * Am + eci * Ap
            Zcd = 1j * th1c * ec * Am - 1j * ec * Am1 - 1j * th1c * eci * Ap + 1j * eci * Ap1
            if rs is not None:
                R, Rd, _ = rs.R(tau, N); Zc = Zc + R; Zcd = Zcd + Rd
            L = -1j * (l1c + Zcd / Zc)
            w = L.real / (h * th1 ** 2)
            v = upd('w_min', w, 'w', k)
            stat['w_neg'][k] += int((w[:-1] < 0).sum())
            bd['w'][k] = min(bd['w'][k], v[0])
        # ---- zeros: sign changes + close pairs, binned by theta/pi ----
        Z0, Z1 = Z[:-1], Z[1:]; D0, D1 = Zd[:-1], Zd[1:]
        sc = (Z0 * Z1 < 0) | (Z0 == 0)
        i = xp.nonzero(sc)[0]
        z0, z1, d0, d1 = Z0[i], Z1[i], D0[i] * dt, D1[i] * dt
        s = z0 / (z0 - z1)
        for _ in range(4):                                      # Newton on the cubic Hermite interpolant
            s2 = s * s; s3 = s2 * s
            p = (2 * s3 - 3 * s2 + 1) * z0 + (s3 - 2 * s2 + s) * d0 + (-2 * s3 + 3 * s2) * z1 + (s3 - s2) * d1
            dp = (6 * s2 - 6 * s) * z0 + (3 * s2 - 4 * s + 1) * d0 + (-6 * s2 + 6 * s) * z1 + (3 * s2 - 2 * s) * d1
            s = xp.clip(s - p / xp.where(dp == 0, 1.0, dp), 0.0, 1.0)
        thz = th[i] + th1[i] * s * dt + 0.5 * th2[i] * (s * dt) ** 2
        # close pairs: same sign, turning towards zero and back, extremum beyond zero
        same = (Z0 * Z1 > 0) & (Z0 * D0 < 0) & (Z1 * D1 > 0)
        j = xp.nonzero(same)[0]
        text = -Zd[j] / xp.where(Zdd[j] == 0, 1.0, Zdd[j])
        zext = Z[j] - 0.5 * Zd[j] ** 2 / xp.where(Zdd[j] == 0, 1.0, Zdd[j])
        pr = (text > 0) & (text < dt) & (zext * Z[j] < 0)
        j = j[pr]
        thp = th[j] + th1[j] * text[pr]
        thz_all = xp.concatenate([thz, thp, thp])
        gi = xp.floor(thz_all / PI).astype(xp.int64); hi = xp.floor(thz_all / PI - 0.5).astype(xp.int64)
        ok = (gi >= 0) & (gi < nint)
        np.add.at(cg, asnp(gi[ok]), 1)
        ok = (hi >= 0) & (hi < nint)
        np.add.at(ch, asnp(hi[ok]), 1)
        stat['zeros'] += int(thz_all.shape[0]); stat['pairs'] += int(j.shape[0]); bd['zeros'] += int(thz_all.shape[0])
        # ---- phase of S on the subsampled grid ----
        sel = xp.arange(b0, b1)
        sel = sel[sel % sstride == 0]
        Sphase[asnp(sel) // sstride] = asnp(xp.angle(S[sel - b0]))
        if (b0 // block) % 50 == 0:
            print('block %d/%d t %.1f zeros %d lag_norm_min %.4g lag_rho_min %.4g w_min %s elapsed %.0f s'
                  % (b0 // block, M // block + 1, float(tt[0]), stat['zeros'], stat['lag_norm_min'][0], stat['lag_rho_min'][0],
                     [round(x[0], 5) for x in stat['w_min']], time.time() - t_start), flush=True)
    # ---- interval statistics ----
    th0 = float(asnp(gam.all(xp.asarray([T0]) + 0j)[0].real)[0])
    def frac(c, off):
        lo = int(math.ceil(th0 / PI - off)) + 1; hi = int(math.floor(thT / PI - off)) - 3
        lo = max(lo, 0)
        seg = c[lo:hi]
        res = dict(first_interval=lo, intervals=int(seg.size), violations=int((seg != 1).sum()), fraction=float((seg != 1).mean()),
                   empty=int((seg == 0).sum()), two=int((seg == 2).sum()), three_plus=int((seg >= 3).sum()))
        nq = 8; ed = np.linspace(lo, hi, nq + 1).astype(int)
        res['octile_fractions'] = [float((c[ed[i]:ed[i + 1]] != 1).mean()) for i in range(nq)]
        return res
    res = dict(obj=obj, T0=T0, T1=T1, dt=dt, gpu=GPU, HS=HS, stat=stat, cands=cands, bands={str(k): v for k, v in sorted(bands.items())},
               gram=frac(cg, 0.0), half_gram=frac(ch, 0.5), theta_T0=th0, theta_T1=thT - 0.0,
               note='theta_T1 is theta(T1 + 1)', elapsed=time.time() - t_start)
    json.dump(res, open(out + '.json', 'w'), indent=1)
    np.save(out + '_Sphase.npy', Sphase); np.save(out + '_ch.npy', ch); np.save(out + '_cg.npy', cg)
    print(json.dumps({k: res[k] for k in ['stat', 'gram', 'half_gram', 'elapsed']}, indent=1))
    return res

if __name__ == '__main__':
    obj = sys.argv[1]; T0 = float(sys.argv[2]); T1 = float(sys.argv[3]); dt = float(sys.argv[4]); out = sys.argv[5]
    block = int(sys.argv[6]) if len(sys.argv) > 6 else 100000
    ss = int(sys.argv[7]) if len(sys.argv) > 7 else 2
    scan(obj, T0, T1, dt, out, block, ss)
