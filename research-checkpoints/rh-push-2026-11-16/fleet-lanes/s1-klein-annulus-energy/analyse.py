"""s1-klein-annulus-energy: combinations (1), (3), (4) from line data (lines.py npz).  float64, MEASURED.
usage: analyse.py file.npz out.json [nmax]
"""
import sys, json, math
import numpy as np
from scipy.linalg import eigh

def load(fn):
    d = np.load(fn, allow_pickle=True)
    return {k: d[k] for k in d.files}

def central(o):
    y = o['y']; T0 = float(o['T0']); ell = float(o['ell']); dy = float(o['dy'])
    i0 = int(round((T0 - y[0]) / dy)); M = int(round(ell / dy))
    return i0, M

# ---------------- combination (1) ----------------
def minus_theta_prime(o, alpha):
    A = o['x0_A']; P1 = o['x0_P1']; P2 = o['x0_P2']
    v = 2 * alpha * (P1 * P1 - A * P2) / (A * A + alpha ** 2 * P1 * P1)
    return v.real, float(np.max(np.abs(v.imag)))

def u_line(o, b, alpha):
    L = o['x%g_L' % b]
    return np.log(np.abs(1 + alpha * L)) - np.log(np.abs(1 - alpha * L))     # -log|S(b+iy)|

def T_b(o, b, alpha):
    y = o['y']; dy = float(o['dy']); u = u_line(o, b, alpha)
    R = int(math.ceil(14 * b / dy))                    # sech^2(pi d/(2b)) < 4 e^{-44} beyond 14 b
    d = dy * np.arange(-R, R + 1)
    ker = (math.pi / (4 * b * b)) / np.cosh(math.pi * d / (2 * b)) ** 2 * dy
    return np.convolve(u, ker, mode='same'), R

try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=8 * 1024 ** 3)
    cp.linalg.eigvalsh(cp.eye(8))
    GPU = True
except Exception:
    GPU = False

def lam_min(Tm):
    global GPU
    if GPU and Tm.shape[0] >= 512:
        try:
            return float(cp.linalg.eigvalsh(cp.asarray(Tm))[0])
        except Exception as e:                      # GPU 1 full or unavailable: CPU from here on
            print('GPU eigvalsh failed (%s); using CPU' % type(e).__name__, flush=True); GPU = False
    return float(eigh(Tm, eigvals_only=True, subset_by_index=[0, 0])[0])

def toeplitz_first_negative(f, M, nmax, scale=None, tol=1e-6):
    """f: samples on the M equispaced nodes of the window, weights 1/M (a positive discrete measure when f >= 0, so the
    N x N Toeplitz matrix of its Fourier coefficients is positive semidefinite for every N when f >= 0 at the nodes).
    Returns (N* = least N with lambda_min(T_N) < -tol*scale or None, lambda_min(T_nmax)/scale, table).  lambda_min is
    nonincreasing in N (interlacing), so a doubling ladder followed by bisection finds N*."""
    c = np.fft.fft(f) / M                              # c_k = (1/M) sum f_j e^{-2 pi i jk/M}
    scale = scale or float(np.mean(np.abs(f)))
    def lam(N):
        idx = np.arange(N)
        return lam_min(c[(idx[:, None] - idx[None, :]) % M]) / scale
    table = {}
    nmax = min(nmax, M // 2)
    if float(f.min()) >= -tol * scale:
        # T_N = sum_j (f_j/M) v_j v_j^*, sum_j (1/M) v_j v_j^* = I  =>  lambda_min(T_N) >= min_j f_j for every N <= M
        return None, float(f.min()) / scale, {'bound': 'lambda_min >= min f over the nodes'}
    N = 1; lo = 0; hi = None
    while True:
        v = lam(N); table[N] = v
        if v < -tol: hi = N; break
        lo = N
        if N == nmax: break
        N = min(2 * N, nmax)
    if hi is None:
        return None, table[nmax], table
    while hi - lo > 1:
        mid = (lo + hi) // 2
        v = lam(mid); table[mid] = v
        if v < -tol: hi = mid
        else: lo = mid
    return hi, table[hi], table

def combo1(o, alphas=(1.0, 0.2), bs=(0.05, 0.1, 0.25), nmax=4096):
    i0, M = central(o); ell = float(o['ell']); out = []
    for alpha in alphas:
        mt, imres = minus_theta_prime(o, alpha)
        mtw = mt[i0:i0 + M]
        N1, l1, tab1 = toeplitz_first_negative(mtw, M, nmax)
        yw = o['y'][i0:i0 + M]
        base = dict(alpha=alpha, im_residual=imres, mtheta_argmin_y=float(yw[int(np.argmin(mtw))]), mtheta_min=float(mtw.min()), mtheta_mean=float(mtw.mean()),
                    mtheta_negfrac=float((mtw < 0).mean()), mtheta_Nstar=N1, mtheta_lam_nmax=l1)
        for b in bs:
            u = u_line(o, b, alpha); Tb, R = T_b(o, b, alpha)
            D = mt - Tb
            # guard: a zero or pole of S within about 3 dy of the line Re z = b makes the trapezoid sum for T_b inaccurate
            # (error ~ (pi/(4 b^2)) dy exp(-2 pi eps/dy) for a logarithmic singularity at distance eps).  Flag nodes where the
            # second difference of u exceeds 1/(2 dy)^2 (u'' = -+1/eps^2 at such a point) and mask D within 5 b of them
            # (version 2; the Toeplitz tolerance for D is 1e-5 of the mean of |theta'|).
            dy = float(o['dy'])
            d2u = np.zeros_like(u); d2u[1:-1] = (u[2:] - 2 * u[1:-1] + u[:-2]) / dy ** 2
            flag = np.abs(d2u) > 1 / (2 * dy) ** 2
            flag |= ~np.isfinite(u)
            W = int(math.ceil(5 * b / dy)); mask = np.convolve(flag.astype(float), np.ones(2 * W + 1), mode='same') > 0
            D_raw_min = float(D[i0:i0 + M].min())
            D = np.where(mask, 0.0, D)
            uw = u[i0:i0 + M]; Dw = D[i0:i0 + M]
            nflag = int((np.diff(flag[i0:i0 + M].astype(int)) == 1).sum()); maskfrac = float(mask[i0:i0 + M].mean())
            N2, l2, tab2 = toeplitz_first_negative(uw, M, nmax)
            N3, l3, tab3 = toeplitz_first_negative(Dw, M, nmax, scale=float(np.mean(np.abs(mtw))), tol=1e-5)
            c_u = np.fft.fft(uw) / M; c_m = np.fft.fft(mtw) / M; c_D = np.fft.fft(Dw) / M
            kap = 2 * math.pi * np.arange(9) / ell
            dtn = np.empty(9); dtn[0] = 1 / b; dtn[1:] = kap[1:] / np.sinh(kap[1:] * b)
            rec = dict(base); rec.update(b=b, u_argmin_y=float(yw[int(np.argmin(uw))]), D_argmin_y=float(yw[int(np.argmin(Dw))]), u_min=float(uw.min()), u_mean=float(uw.mean()), u_negfrac=float((uw < 0).mean()),
                       u_Nstar=N2, u_lam_nmax=l2, D_raw_min=D_raw_min, D_flags=nflag, D_maskfrac=maskfrac, D_absmax=float(np.abs(Dw).max()), D_min=float(Dw.min()), D_mean=float(Dw.mean()), D_negfrac=float((Dw < 0).mean()),
                       D_Nstar=N3, D_lam_nmax=l3, Tb_mean=float(Tb[i0:i0 + M].mean()),
                       low_modes=[dict(n=n, u=[c_u[n].real, c_u[n].imag], mtheta=[c_m[n].real, c_m[n].imag],
                                       D=[c_D[n].real, c_D[n].imag], dtn_mult=float(dtn[n]),
                                       strip_energy=float(ell / 2 * (kap[n] / math.tanh(kap[n] * b) if n else 1 / b) * abs(c_u[n]) ** 2)) for n in range(9)],
                       u_table=tab2, D_table=tab3)
            out.append(rec)
    return out

# ---------------- combination (3) ----------------
def omega(r, a, h):
    q = np.exp(-math.pi * r / a)
    if h == 0:
        beta = 0.0; pref = 2 * math.pi * r * (math.pi / a) / a
    else:
        beta = math.pi * h / a; pref = 2 * math.pi * r * math.sin(beta) / (a * h)
    return pref * q * (1 - q * q) / (1 + 2 * q * math.cos(beta) + q * q) ** 2

def combo3(o, pairs=((0.5, 0.25), (0.5, 0.1), (0.5, 0.0), (0.25, 0.1), (0.25, 0.05), (0.25, 0.0), (0.1, 0.05), (0.1, 0.0), (0.05, 0.0)), tstep=0.05):
    i0, M = central(o); dy = float(o['dy']); y = o['y']; out = []
    step = max(1, int(round(tstep / dy)))
    for a, h in pairs:
        la = o['x%g_logabs' % a]; th = o['x%g_L' % a].real
        K = int(round(12 * a / dy))
        if i0 - K < 0: K = i0
        r = dy * np.arange(K + 1)
        om = omega(r, a, h)
        with np.errstate(divide='ignore', invalid='ignore'):
            om_over = np.where(r > 0, om / (2 * a * np.maximum(r, 1e-300)), 0.0)
        # limit of omega/(2 a r) at r = 0
        if h == 0: om_over[0] = (2 * math.pi * (math.pi / a) / a) * 0 / (2 * a)
        cth = np.concatenate([[0.0], np.cumsum((th[1:] + th[:-1]) / 2 * dy)])      # integral of theta'
        if h == 0:
            A0 = o['x0_A']; P1 = o['x0_P1']; P2 = o['x0_P2']
            lg0 = o['x0_logabs'] - np.log(np.abs(A0))
            lag = (P1 * P1 - A0 * P2); ph = np.exp(-2j * np.angle(np.where(np.abs(P1) > np.abs(A0), P1, A0)))
            # (P1^2 - A P2) g^2 is real; remove the phase of g^2 through P1 (or A), both real multiples of 1/g... g*P1 = Xi' real
            lagr = (lag * ph).real
            lhs_log = 2 * lg0 - 2 * la; lhs = lagr * np.exp(lhs_log)
        else:
            lh = o['x%g_logabs' % h]; Lh = o['x%g_L' % h].real
            lhs = np.exp(2 * (lh - la)) * Lh / h
        nt = 0; nvalid = 0; nfire = 0; nviol = 0; maxid = 0.0; maxid_abs = 0.0; worst = None; nneg = 0; minslack = float('inf')
        fire_ts = []
        for i in range(i0, i0 + M, step):
            lo = i - np.arange(K + 1); hi = i + np.arange(K + 1)
            prod = np.exp(la[lo] + la[hi] - 2 * la[i])
            Delta = cth[hi] - cth[lo]
            with np.errstate(divide='ignore', invalid='ignore'):
                C = np.where(r > 0, prod * np.sin(Delta) / (2 * a * np.maximum(r, 1e-300)), prod * th[i] / a)
            integ = om * C
            I = float(np.sum((integ[1:] + integ[:-1]) / 2) * dy)
            L0 = float(lhs[i])
            maxid = max(maxid, abs(I - L0) / (abs(L0) + abs(I) + 1e-300))
            maxid_abs = max(maxid_abs, abs(I - L0) / (float(np.sum(np.abs(integ)) * dy) + 1e-300))
            mu = np.minimum.accumulate(np.minimum(th[lo], th[hi])); Mx = np.maximum.accumulate(np.maximum(th[lo], th[hi]))
            valid = (mu > 0) & (r <= math.pi / (4 * np.maximum(Mx, 1e-300))) & (r > 0)
            g1 = om * prod; cum1 = np.concatenate([[0.0], np.cumsum((g1[1:] + g1[:-1]) / 2 * dy)])
            g2 = om_over * prod; cum2 = np.concatenate([[0.0], np.cumsum((g2[1:] + g2[:-1]) / 2 * dy)])
            main = 2 * mu / (math.pi * a) * cum1; tail = cum2[-1] - cum2
            nt += 1
            if L0 < 0: nneg += 1
            if valid.any():
                nvalid += 1
                cert = float(np.max(np.where(valid, main - tail, -np.inf)))
                slack = L0 - cert
                minslack = min(minslack, slack / (abs(L0) + abs(cert) + 1e-300))
                if cert > 0:
                    nfire += 1
                    if len(fire_ts) < 20: fire_ts.append(float(y[i]))
                if slack < -1e-3 * (abs(L0) + abs(cert)):
                    nviol += 1; worst = dict(t=float(y[i]), lhs=L0, cert=cert)
        out.append(dict(a=a, h=h, n_t=nt, n_valid=nvalid, n_fire=nfire, frac_fire=nfire / nt, n_violation=nviol, worst=worst,
                        n_lhs_negative=nneg, identity_max_rel_dev=maxid, identity_max_dev_over_abs_integral=maxid_abs, min_rel_slack=minslack, first_fire_t=fire_ts))
    return out

# ---------------- combination (4) ----------------
def s4_from_phase(phi, r=1.5):
    w = np.exp(1j * phi)
    eta = w * np.sqrt(r * r + r ** -2 + 2 * np.cos(2 * phi))
    Z = np.stack([np.ones_like(w), w, w * w, eta]); Z = Z / np.sqrt((np.abs(Z) ** 2).sum(0))
    A = Z[0] * np.conj(Z[2]) + np.conj(Z[1]) * Z[3]; B = Z[1] * np.conj(Z[2]) - np.conj(Z[0]) * Z[3]
    return np.stack([2 * A.real, 2 * A.imag, 2 * B.real, 2 * B.imag, np.abs(Z[0]) ** 2 + np.abs(Z[1]) ** 2 - np.abs(Z[2]) ** 2 - np.abs(Z[3]) ** 2])

def combo4(o, As=(0.05, 0.1, 0.25), lags=(0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 4.0)):
    i0, M = central(o); dy = float(o['dy']); ell = float(o['ell']); out = []
    for a in As:
        th = o['x%g_L' % a].real
        cth = np.concatenate([[0.0], np.cumsum((th[1:] + th[:-1]) / 2 * dy)])
        phi = -2 * cth                                           # R_a(1/2+it) = exp(-2 i theta_a(t))
        X = s4_from_phase(phi)
        turns = float((cth[i0 + M] - cth[i0]) / math.pi)         # full turns of R_a = zeros with |Re z| < a (count)
        rate = turns / ell; sp = 1 / rate if rate > 0 else float('nan')
        G = {}
        for lg in lags:
            k = int(round(lg * sp / dy)) if rate > 0 else 0
            if k <= 0 or k >= M // 2: G[str(lg)] = None; continue
            G[str(lg)] = float(np.mean(np.sum(X[:, i0:i0 + M - k] * X[:, i0 + k:i0 + M], axis=0)))
        # the same two-point function for a uniformly rotating phase with the same winding (reference: no zero information)
        Gref = {}
        ph = np.linspace(0, 2 * math.pi, 4096, endpoint=False); X0 = s4_from_phase(ph)
        out.append(dict(a=a, turns=turns, turn_rate=rate, norm_err=float(np.max(np.abs((X ** 2).sum(0) - 1))), G=G,
                        mean_X=[float(v) for v in X[:, i0:i0 + M].mean(1)], theta_prime_min=float(th[i0:i0 + M].min())))
    return out

if __name__ == '__main__':
    o = load(sys.argv[1]); nmax = int(sys.argv[3]) if len(sys.argv) > 3 else 4096
    xs = [float(x) for x in o['xs']]
    res = dict(code=str(o['code']), T0=float(o['T0']), ell=float(o['ell']), dy=float(o['dy']), analysis_version=3)
    res['combo1'] = combo1(o, bs=[b for b in (0.05, 0.1, 0.25) if b in xs], nmax=nmax)
    print('combo1 done', flush=True)
    res['combo3'] = combo3(o, pairs=[p for p in ((0.5, 0.25), (0.5, 0.1), (0.5, 0.0), (0.25, 0.1), (0.25, 0.05), (0.25, 0.0), (0.1, 0.05), (0.1, 0.0), (0.05, 0.0)) if p[0] in xs and p[1] in xs])
    print('combo3 done', flush=True)
    res['combo4'] = combo4(o, As=[a for a in (0.05, 0.1, 0.25) if a in xs])
    json.dump(res, open(sys.argv[2], 'w'), indent=1)
    print('wrote', sys.argv[2], flush=True)
