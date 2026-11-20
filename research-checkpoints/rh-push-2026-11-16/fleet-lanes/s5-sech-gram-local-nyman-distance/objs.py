# objs.py : values on the critical line of zeta and the controls, float64 (GPU via cupy if present).
# Hurwitz zeta by Euler-Maclaurin with the phase T0*log(k+a) reduced mod 2 pi in long double.
import os, math, numpy as np
from concurrent.futures import ThreadPoolExecutor
GPU = False
try:
    if os.environ.get('RH_NOGPU'): raise ImportError
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=24*1024**3)
    cp.zeros(1)
    GPU = True
except Exception:
    cp = None
WORKERS = int(os.environ.get('RH_WORKERS', '4'))
LD = np.longdouble
TWO_PI_LD = LD(8)*np.arctan(LD(1))
B2 = [1/6, -1/30, 1/42, -1/30, 5/66, -691/2730, 7/6, -3617/510, 43867/798, -174611/330,
      854513/138, -236364091/2730, 8553103/6, -23749461029/870]
KAPPA_DH = 0.28407904384041227

def _red(T0, x_ld):
    return np.asarray(np.fmod(LD(T0)*x_ld, TWO_PI_LD), dtype=np.float64)

def hurwitz_line(sigma, T0, u, r, q):
    """zeta(sigma + i(T0+u), r/q) for the float64 array u. Returns complex128 numpy array."""
    u = np.asarray(u, dtype=np.float64); K = len(u)
    tmax = abs(T0) + float(np.abs(u).max())
    M = int(max(600, math.ceil(tmax/2)))
    a_ld = LD(r)/LD(q)
    x_ld = np.log(np.arange(M).astype(LD) + a_ld)
    L = np.asarray(x_ld, dtype=np.float64); th = _red(T0, x_ld); amp = np.exp(-sigma*L)
    if GPU:
        ch = max(1, int(4e7//K)); acc = cp.zeros(K, dtype=cp.complex128)
        ug = cp.asarray(u)[:, None]
        for i0 in range(0, M, ch):
            Lg = cp.asarray(L[i0:i0+ch]); ph = ug*Lg[None, :] + cp.asarray(th[i0:i0+ch])[None, :]
            acc += cp.exp(-1j*ph) @ cp.asarray(amp[i0:i0+ch]).astype(cp.complex128)
        S = cp.asnumpy(acc)
    else:
        ch = max(1, int(2e6//K))
        def part(i0):
            ph = u[:, None]*L[None, i0:i0+ch] + th[None, i0:i0+ch]
            return (np.cos(ph) @ amp[i0:i0+ch]) - 1j*(np.sin(ph) @ amp[i0:i0+ch])
        with ThreadPoolExecutor(WORKERS) as ex:
            S = sum(ex.map(part, range(0, M, ch)))
    xM_ld = np.log(LD(M) + a_ld); xM = float(xM_ld); thM = float(np.fmod(LD(T0)*xM_ld, TWO_PI_LD))
    Ma = M + r/q
    base = np.exp(-sigma*xM)*np.exp(-1j*(thM + u*xM))
    s = sigma + 1j*(T0 + u)
    out = S + Ma*base/(s-1) + base/2
    p = s/Ma; fact = 2.0
    out = out + B2[0]/fact*p*base
    for j in range(2, len(B2)+1):
        p = p*(s+2*j-3)*(s+2*j-2)/(Ma*Ma); fact *= (2*j-1)*(2*j)
        out = out + B2[j-1]/fact*p*base
    return out

def zeta_line(T0, u, sigma=0.5):
    return hurwitz_line(sigma, T0, u, 1, 1)

def periodic_line(T0, u, coef, sigma=0.5, cache=None):
    """sum c_n n^-s with q-periodic coefficients coef[r-1], r=1..q, mean zero."""
    q = len(coef); u = np.asarray(u, dtype=np.float64)
    tot = np.zeros(len(u), dtype=np.complex128)
    for r in range(1, q+1):
        if coef[r-1] == 0: continue
        key = (sigma, T0, r, q)
        if cache is not None and key in cache: hz = cache[key]
        else:
            hz = hurwitz_line(sigma, T0, u, r, q)
            if cache is not None: cache[key] = hz
        tot += coef[r-1]*hz
    lq_ld = np.log(LD(q)); th = float(np.fmod(LD(T0)*lq_ld, TWO_PI_LD)); lq = float(lq_ld)
    return tot*np.exp(-sigma*lq)*np.exp(-1j*(th + u*lq))

def rs_theta(t):
    t = np.asarray(t, dtype=np.float64)
    return t/2*np.log(t/(2*np.pi)) - t/2 - np.pi/8 + 1/(48*t) + 7/(5760*t**3) + 31/(80640*t**5) + 127/(430080*t**7)

def log_xi_norm(t):
    """log of |xi(1/2+it)/zeta(1/2+it)| = log(|s(s-1)|/2) - (1/4) log pi + Re lgamma(1/4 + it/2), Stirling (t >= 20)."""
    t = np.asarray(t, dtype=np.float64); z = 0.25 + 0.5j*t
    lg = (z-0.5)*np.log(z) - z + 0.5*np.log(2*np.pi) + 1/(12*z) - 1/(360*z**3) + 1/(1260*z**5) - 1/(1680*z**7)
    return np.log((0.25+t*t)/2) - 0.25*np.log(np.pi) + lg.real

def heat_from_zeta(T0, u, zvals, tau, h):
    """Backward heat control on the line: Z_tau(t) = E[ xi(1/2+i(t+Y)) ] / |xi/zeta|(t), Y ~ N(0,|tau|/2);
    returns F_tau = Z_tau e^{-i theta(t)} on the interior points (those with a full +-7 sd stencil), and their index range."""
    t = T0 + np.asarray(u); Z = (zvals*np.exp(1j*rs_theta(t))).real
    sd = math.sqrt(abs(tau)/2); m = int(math.ceil(7*sd/h)); y = np.arange(-m, m+1)*h
    phi = np.exp(-y*y/(2*sd*sd)); phi /= phi.sum()
    lN = log_xi_norm(t); K = len(u); out = np.zeros(K-2*m)
    for j, yy in enumerate(y):
        sl = slice(j, K-2*m+j)
        out += phi[j]*Z[sl]*np.exp(lN[sl]-lN[m:K-m])
    return out*np.exp(-1j*rs_theta(t[m:K-m])), m, out

OBJ_PER = {'chi4': [1, 0, -1, 0], 'chi5': [1, -1, -1, 1, 0], 'dh': [1, KAPPA_DH, -KAPPA_DH, -1, 0], 'chi3': [1, -1, 0]}

def eval_objects(T0, u, names, h=None, tnr_c=2.2, ea=0.25, alpha=1.2393168126993495):
    """dict name -> complex values on u (heat objects are returned on an interior slice: (values, m))."""
    out = {}; cache = {}; z = None
    def Z():
        nonlocal z
        if z is None: z = zeta_line(T0, u)
        return z
    for nm in names:
        if nm == 'zeta': out[nm] = Z()
        elif nm in OBJ_PER: out[nm] = periodic_line(T0, u, OBJ_PER[nm], cache=cache)
        elif nm == 'ea': out[nm] = zeta_line(T0, u, 0.5+ea)*zeta_line(T0, u, 0.5-ea)
        elif nm.startswith('tnr'):
            q = int(nm[3:]); lq_ld = np.log(LD(q)); th = float(np.fmod(LD(T0)*lq_ld, TWO_PI_LD)); w = np.exp(-1j*(th + u*float(lq_ld)))
            out[nm] = Z()*(1 + tnr_c*w + w*w)       # Dirichlet-series normalisation zeta(s)(1 + c q^(1/2-s) + q^(1-2s))
        elif nm == 'wt': out[nm] = zeta_line(T0+alpha, u)
        elif nm.startswith('heat'):
            tau = -float(nm[4:]); out[nm] = heat_from_zeta(T0, u, Z(), tau, h)
        else: raise ValueError(nm)
    return out
