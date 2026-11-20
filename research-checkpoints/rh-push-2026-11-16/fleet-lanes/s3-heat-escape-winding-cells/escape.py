"""Combination 1: escape envelope of the zeros of H_{-tau}.  Model (b-escape-law Lemma R, used here for general coefficients):
  H_{-tau}(z) = Tsharp(z) D_tau(s_eff(z)) (1 + O(L^2/x)),  D_tau(s) = sum a(n) exp(-(tau/4) log^2 n) n^{-s},
  s_eff(z) = s + i tau g'(z), s = (1+iz)/2, g = log(gamma-type factor).  Envelope offset: limsup(eta - (tau/2) L) = 2 sigma+ - 1.
Modes:
  escape.py contour <kind> <samples.npy> <tau> <out.json> [Tmax]     D_tau from samples of the series factor on Re w = sigc (FFT convolution)
  escape.py series  <kind> <tau> <T> <out.json>                     D_tau from its Dirichlet series (tau >= 4)
  escape.py direct  <kind> <tau> <zeros.json> <out.json> [nz]        Newton on the true H_{-tau} from the images of the top D_tau zeros
"""
import sys, os, json, math, time
import numpy as np
import hk

def coeffs(kind, N, seed=1):
    n = np.arange(N + 1)
    a = np.zeros(N + 1)
    if kind == 'zeta': a[1:] = 1
    elif kind == 'chi4': a[1::4] = 1; a[3::4] = -1
    elif kind == 'dh':
        k = hk.KAPPA_DH; a[1::5] = 1; a[2::5] = k; a[3::5] = -k; a[4::5] = -1
    elif kind == 'tnr':
        q = int(hk.TNR_Q); a[1:] = 1; a[q::q] += hk.TNR_C*math.sqrt(q); a[q*q::q*q] += q
    elif kind == 'ea':
        b = hk.EA_A
        for d in range(1, N + 1): a[d::d] += d**(-2*b)
        a[1:] = a[1:]*n[1:]**b
    elif kind in ('liouville', 'mobius', 'rsign', 'rphase'):
        a = a.astype(complex); a[1] = 1
        rng = np.random.default_rng(seed)
        spf = np.zeros(N + 1, dtype=np.int64)
        for p in range(2, N + 1):
            if spf[p] == 0: spf[p::p] = np.where(spf[p::p] == 0, p, spf[p::p])
        val = {}
        for m in range(2, N + 1):
            p = spf[m]
            if p == m:
                val[p] = -1.0 if kind in ('liouville', 'mobius') else (rng.choice([-1.0, 1.0]) if kind == 'rsign' else np.exp(2j*np.pi*rng.random()))
            r = m//p
            a[m] = (0 if (kind == 'mobius' and r % p == 0) else a[r]*val[p])
        if kind != 'rphase': a = a.real
    else: raise ValueError(kind)
    return a

def bounds(kind, tau, N=200000):
    """sigma_abs: root of sum_{n>=2} |a_n| g_n n^-sigma = 1 (no zero to the right; needs g_n decay: N adequate when tau >= 1 or the root is > 1);
    sigma_2, sigma_3: same with n <= 2, n <= 3 only."""
    a = np.abs(coeffs(kind, N)); l = np.log(np.maximum(np.arange(N + 1), 1)); g = np.exp(-(tau/4)*l*l)
    def root(M):
        f = lambda s: np.sum(a[2:M+1]*g[2:M+1]*np.exp(-s*l[2:M+1])) - 1
        lo, hi = -80.0, 60.0
        if f(lo) < 0: return None
        for _ in range(200):
            mid = (lo + hi)/2
            if f(mid) > 0: lo = mid
            else: hi = mid
        return lo
    tail = float(np.sum(a[N//2:]*g[N//2:]*np.exp(-root(N)*l[N//2:]))) if root(N) is not None else None
    return dict(sigma_abs=root(N), sigma_2=root(2), sigma_3=root(3), sigma_5=root(5), tail_upper_half=tail, a2=float(a[2]), a3=float(a[3]), a4=float(a[4]))

def dd(a, b):
    d = b - a
    return (d + np.pi) % (2*np.pi) - np.pi

def find_zeros(D, sig, t):
    """D[i, j] at (sig[i], t[j]); cell winding numbers -> list of (sigma, t) cell centres with winding != 0 (positive orientation in s)."""
    A = np.angle(D)
    wn = (dd(A[:-1, :-1], A[1:, :-1]) + dd(A[1:, :-1], A[1:, 1:]) + dd(A[1:, 1:], A[:-1, 1:]) + dd(A[:-1, 1:], A[:-1, :-1]))/(2*np.pi)
    ij = np.argwhere(np.abs(wn) > 0.5)
    mx = max(np.abs(dd(A[:-1, :], A[1:, :])).max(), np.abs(dd(A[:, :-1], A[:, 1:])).max())
    return [(0.5*(sig[i] + sig[i+1]), 0.5*(t[j] + t[j+1]), int(round(wn[i, j]))) for i, j in ij], float(mx)

def summarize(kind, tau, zs, sig, T, extra):
    zs = sorted(zs, key=lambda r: -r[0])
    out = dict(kind=kind, tau=tau, sig_lo=float(sig[0]), sig_hi=float(sig[-1]), T=T, nzeros=len(zs), **extra)
    out['sigma_max_by_T'] = {}
    for Tc in (5e2, 5e3, 1e4, 2e4, 5e4):
        if Tc <= T*1.001:
            v = [z for z in zs if z[1] <= Tc]
            out['sigma_max_by_T']['%g' % Tc] = (v[0][0], v[0][1]) if v else None
    out['top'] = zs[:40]
    out['bounds'] = bounds(kind, tau)
    b = out['bounds']
    sm = zs[0][0] if zs else None
    out['offset_2sigma_minus_1'] = None if sm is None else 2*sm - 1
    out['count_within_0.5_of_top'] = len([z for z in zs if sm is not None and z[0] > sm - 0.5])
    return out

def contour(kind, sfile, tau, Tmax=None):
    def fftconvolve(a, b, mode='valid'):
        n = len(a) + len(b) - 1; m = 1 << (n - 1).bit_length()
        c = np.fft.ifft(np.fft.fft(a, m)*np.fft.fft(b, m))[:n]
        return c[len(b) - 1:len(a)]
    base = 'zeta' if kind == 'tnr' else kind
    Z = np.load(sfile); sigc, T, h = np.load(sfile.replace('.npy', '.meta.npy'))
    if Tmax: Z = Z[:int(round(Tmax/h)) + 1]; T = Tmax
    u = h*np.arange(len(Z))
    if kind == 'tnr':
        q = hk.TNR_Q; w = sigc + 1j*u
        Z = Z*(1 + hk.TNR_C*math.sqrt(q)*np.exp(-w*math.log(q)) + q*np.exp(-2*w*math.log(q)))
    R = 6.6*math.sqrt(tau); K = int(math.ceil(R/h))
    # extend to negative u by conjugation (real coefficients)
    Zx = np.concatenate([np.conj(Z[K:0:-1]), Z])
    b = bounds(kind, tau)
    shi = (b['sigma_abs'] if b['sigma_abs'] is not None else 1.8) + 0.1
    if kind == 'ea' and tau < 1: shi = min(shi, 2.2)
    slo = shi - (2.2 if tau >= 1 else 1.9)
    ds = 0.05 if tau <= 1 else 0.08
    sig = np.arange(slo, shi + ds/2, ds)
    stride = 1 if tau <= 1 else 2
    v = h*np.arange(-K, K + 1)
    print('planned allocation: grid %d x %d complex128 = %.2f GB' % (len(sig), len(Z)//stride, len(sig)*(len(Z)//stride)*16/1e9), flush=True)
    D = np.empty((len(sig), len(Z[::stride])), dtype=np.complex128)
    for i, s in enumerate(sig):
        # D(t) = h/sqrt(pi tau) sum_u Z(u) exp(((sigc - s) + i(u - t))^2/tau)
        ker = np.exp(((sigc - s) + 1j*v)**2/tau)*(h/math.sqrt(math.pi*tau))     # as a function of (u - t)
        full = fftconvolve(Zx, ker[::-1], mode='valid')                          # index j <-> t = u_j, j = 0..len(Z)-K-1... (valid drops the top K)
        row = np.full(len(Z), np.nan + 0j); row[:len(full)] = full
        D[i] = row[::stride]
    t = u[::stride]
    good = int((len(Z) - K - 1)//stride)
    D = D[:, :good]; t = t[:good]
    zs, mx = find_zeros(D, sig, t)
    # Newton refinement of the 60 rightmost zeros with the direct sum
    def Dd(s):
        j0 = int(round(s.imag/h)) + K
        sl = slice(max(0, j0 - K), min(len(Zx), j0 + K + 1))
        uu = h*(np.arange(sl.start, sl.stop) - K)
        e = (sigc + 1j*uu - s)
        f = Zx[sl]*np.exp(e*e/tau)
        return f.sum(), (f*(-2*e/tau)).sum()
    zs = sorted(zs, key=lambda r: -r[0])
    nref = min(6000, max(60, len([z for z in zs if zs and z[0] > zs[0][0] - 3.5*ds])))
    ref = []
    for (sg, tt, w) in zs[:nref]:
        s = complex(sg, tt)
        for _ in range(30):
            f, df = Dd(s); d = f/df; s -= d
            if abs(d) < 1e-12: break
        if abs(s - complex(sg, tt)) < 3*ds: ref.append((s.real, s.imag, w, abs(d)))
    return summarize(kind, tau, ref + [(z[0] - ds/2, z[1], z[2]) for z in zs[nref:]], sig, float(t[-1]), dict(method='contour', sigc=float(sigc), h=float(h), max_phase_step=mx, T_samples=float(T)))

def series(kind, tau, T):
    b = bounds(kind, tau, 20000)
    shi = b['sigma_abs'] + 0.1; slo = shi - 2.2; ds = 0.08
    sig = np.arange(slo, shi + ds/2, ds)
    # N: terms with |a| g n^-slo < 1e-13 relative to the largest
    l = np.log(np.arange(1, 20001)); e = -(tau/4)*l*l - slo*l
    N = int(np.max(np.nonzero(e > e.max() - 32)[0])) + 2
    a = coeffs(kind, N)[1:]; ln = np.log(np.arange(1, N + 1)); g = np.exp(-(tau/4)*ln*ln)
    ht = 0.1
    t = ht*np.arange(int(T/ht) + 1)
    print('series N =', N, 'grid', len(sig), 'x', len(t), 'planned %.2f GB' % (len(sig)*len(t)*16/1e9), flush=True)
    D = np.empty((len(sig), len(t)), dtype=np.complex128)
    W = (a*g)[None, :]*np.exp(-sig[:, None]*ln[None, :])            # (nsig, N)
    ch = max(1000, int(2e7//N))
    for j0 in range(0, len(t), ch):
        E = np.exp(-1j*t[j0:j0+ch, None]*ln[None, :])               # (ch, N)
        D[:, j0:j0+ch] = W @ E.T
    zs, mx = find_zeros(D, sig, t)
    zs = sorted(zs, key=lambda r: -r[0]); ref = []
    nref = min(6000, max(60, len([z for z in zs if zs and z[0] > zs[0][0] - 3.5*ds])))
    for (sg, tt, w) in zs[:nref]:
        s = complex(sg, tt)
        for _ in range(40):
            p = a*g*np.exp(-s*ln); f = p.sum(); df = -(p*ln).sum(); d = f/df; s -= d
            if abs(d) < 1e-13: break
        if abs(s - complex(sg, tt)) < 3*ds: ref.append((s.real, s.imag, w, abs(d)))
    return summarize(kind, tau, ref + [(z[0] - ds/2, z[1], z[2]) for z in zs[nref:]], sig, T, dict(method='series', N=N, max_phase_step=mx))

# ---------------- direct check on the true H_{-tau}
def direct(kind, tau, zfile, nz):
    from flint import acb, arb, ctx
    ctx.prec = 240
    d = json.load(open(zfile))
    top = [z for z in d['top'] if z[1] > 0.5*d['T'] and len(z) > 3][:nz]
    I = acb(0, 1)
    def lg_esc(s):
        lg, _ = hk.parts('zeta' if kind == 'tnr' else kind, s)
        if kind == 'tnr': lg = lg + (s - acb(0.5))*acb(hk.TNR_Q).log()
        return lg
    def val_esc(s):
        if kind == 'tnr':
            w = (s - acb(0.5))*acb(hk.TNR_Q).log()
            return s.zeta()*(1 + acb(hk.TNR_C)*(-w).exp() + (-2*w).exp())
        return hk.parts(kind, s)[1]
    def s_eff(z):
        s = (1 + I*z)/2; e = acb(1e-12)
        dlg = (lg_esc(s + e) - lg_esc(s - e))/(2*e)            # d/ds log factor
        return s + I*tau*(I/2)*dlg
    out = []
    for (sg, tt, w, *_) in top:
        target = acb(sg, tt)
        z = acb(2*tt, -(2*sg - 1))                               # s = (1+iz)/2 start
        for _ in range(60):
            dz = (s_eff(z) - target)/(I/2); z = z - dz; z = acb(z.real.mid(), z.imag.mid())     # midpoints: the difference quotient inflates radii
            if float(abs(dz).mid()) < 1e-20: break
        z_model = z
        # contour Im w = -kap <-> Re s = sc.  sc = sigma of the D zero when that is >= 0.75 (saddle of the n = 1 term); otherwise 0.75: left of the
        # strip xi = J(1-s) zeta(1-s) oscillates against the Gaussian and the trapezoid sum cancels to e^{-tau L^2/4}.  The shift costs e^{(2 sc - 2 sg)^2/(4 tau)}.
        sc = max(sg, 0.75); kap = 2*sc - 1
        h = min(math.sqrt(tau)/6, 0.15); M = int(math.ceil(9*math.sqrt(2*tau)/h))
        x0 = float(z.real.mid())
        ref = lg_esc(acb(sc, x0/2)).real
        samp = []
        for j in range(-M, M + 1):
            wj = acb(x0 + j*h, -kap); s = (1 + I*wj)/2
            samp.append((wj, (lg_esc(s) - ref).exp()*val_esc(s)))
        def F(z):
            f = acb(0); df = acb(0)
            for wj, v in samp:
                dlt = z - wj; e = v*(-dlt*dlt/(4*tau)).exp()
                f += e; df += e*(-dlt/(2*tau))
            return f, df
        zz = z_model
        for _ in range(40):
            f, df = F(zz); dz = f/df; zz = zz - dz; zz = acb(zz.real.mid(), zz.imag.mid())
            if float(abs(dz).mid()) < 1e-20: break
        dist = float(abs(zz - z_model).mid())
        out.append(dict(D_zero=[sg, tt], z_model=[float(z_model.real.mid()), float(z_model.imag.mid())], z_true=[float(zz.real.mid()), float(zz.imag.mid())],
                        dist=dist, newton_last=float(abs(dz).mid()), eta_true=-float(zz.imag.mid()),
                        L2_over_x=math.log(x0/(4*math.pi))**2/x0))
        print(kind, tau, 'D zero', sg, tt, '-> z_model', out[-1]['z_model'], 'z_true', out[-1]['z_true'], 'dist %.3e' % dist, flush=True)
    return dict(kind=kind, tau=tau, checks=out)

if __name__ == '__main__':
    mode = sys.argv[1]; t0 = time.time()
    if mode == 'contour':
        kind, sfile, tau, outp = sys.argv[2], sys.argv[3], float(sys.argv[4]), sys.argv[5]
        r = contour(kind, sfile, tau, float(sys.argv[6]) if len(sys.argv) > 6 else None)
    elif mode == 'series':
        kind, tau, T, outp = sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
        r = series(kind, tau, T)
    elif mode == 'direct':
        kind, tau, zf, outp = sys.argv[2], float(sys.argv[3]), sys.argv[4], sys.argv[5]
        r = direct(kind, tau, zf, int(sys.argv[6]) if len(sys.argv) > 6 else 4)
    r['seconds'] = time.time() - t0
    json.dump(r, open(outp, 'w'), indent=1)
    if mode != 'direct':
        print(json.dumps({k: r[k] for k in ('kind', 'tau', 'method', 'T', 'nzeros', 'sigma_max_by_T', 'bounds', 'offset_2sigma_minus_1', 'max_phase_step', 'count_within_0.5_of_top', 'seconds')}))
