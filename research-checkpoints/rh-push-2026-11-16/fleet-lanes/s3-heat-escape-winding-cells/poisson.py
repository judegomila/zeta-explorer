"""Combination 3: Poisson floor of the real zeros.  r = 2 gamma (z units).  kappa(x; Delta) = sum over real zeros +-r of 1/((x - r)^2 + Delta^2)
( = P(x, Delta)/Delta = inf over 0 < y <= Delta of A(x + i y)/y for the real-zero part of the collective force A ).
Certificate bound (collective_certificate, zeros in |Im z| <= Delta, eta -> 0):  B(kappa, Delta) = log(1 + 2 kappa Delta^2)/(4 kappa)  (< Delta^2/2).
Usage: poisson.py <ordinates.npy> <label> <conductor q> <out.json> [Delta=1] [nmax]
Method: cloud-in-cell binning (bin 1/32) + FFT convolution with the kernel truncated at |d| <= RC, smooth-density tails; exact direct sum for x <= XLOW.
"""
import sys, json, math, time
import numpy as np
_trapz = np.trapezoid if hasattr(np, 'trapezoid') else np.trapz

RC = 200.0; BIN = 1.0/32; XLOW = 4000.0; STEP = 4     # output grid step = STEP*BIN = 1/8

def rho(r, q): return np.log(np.maximum(q*np.asarray(r, dtype=float)/(4*math.pi), 1.0001))/(4*math.pi)

def tails(xc, q, Delta, rmax):
    """smooth-density estimate of (a) zeros at distance > RC on both sides (within (0, inf)), (b) mirror zeros -r."""
    out = np.empty(len(xc))
    d = np.exp(np.linspace(math.log(RC), math.log(1e12), 4000))
    for i, x in enumerate(xc):
        f = (rho(x + d, q) + np.where(x - d > 14.0, rho(np.maximum(x - d, 14.0), q), 0.0))/(d*d + Delta*Delta)
        a = np.trapezoid(f, d) if hasattr(np, 'trapezoid') else np.trapz(f, d)
        r = np.exp(np.linspace(math.log(14.0), math.log(1e12), 4000))
        g = rho(r, q)/((x + r)**2 + Delta*Delta)
        b = np.trapezoid(g, r) if hasattr(np, 'trapezoid') else np.trapz(g, r)
        out[i] = a + b
    return out

def bound(k, Delta): return math.log(1 + 2*k*Delta*Delta)/(4*k)

if __name__ == '__main__':
    f, label, q, outp = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
    Delta = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
    nmax = int(sys.argv[6]) if len(sys.argv) > 6 else None
    t0 = time.time()
    g = np.load(f, mmap_mode='r')
    g = np.array(g[:nmax] if nmax else g, dtype=np.float64).ravel(); g = g[g > 0]; g.sort()
    r = 2*g; n = len(r); rmax = r[-1]
    print(label, 'zeros', n, 'r range', r[0], rmax, 'memory of list %.2f GB' % (n*8/1e9), flush=True)
    res = dict(label=label, q=q, Delta=Delta, nzeros=n, rmax=float(rmax), decades=[], lowest=[])
    # ---- exact part, x in [x_first - 5, XLOW]
    xlo_end = min(XLOW, rmax - RC - 10)
    xs = np.arange(max(1.0, r[0] - 5), xlo_end, STEP*BIN)
    near = r[r < xlo_end + 20000.0]
    kap = np.zeros(len(xs))
    for j0 in range(0, len(xs), 2000):
        x = xs[j0:j0+2000, None]
        kap[j0:j0+2000] = (1/((x - near[None, :])**2 + Delta**2) + 1/((x + near[None, :])**2 + Delta**2)).sum(1)
    # smooth tail beyond 'near'
    if len(near) < n or True:
        R0 = near[-1]
        d = np.exp(np.linspace(math.log(R0), math.log(1e13), 6000))
        tl = np.array([_trapz(rho(d, q)*(1/((x - d)**2 + Delta**2) + 1/((x + d)**2 + Delta**2)), d) for x in xs[::200]])
        kap += np.interp(xs, xs[::200], tl)
    edges = [10.0**e for e in range(1, 10)]
    dec = {}
    cand = []          # (ratio, x, kappa) candidates for the lowest list
    state = dict(kinf=float('inf'), xinf=None, npts=0)
    lowX = []; lowK = []
    def absorb(X, Kp):
        ratio = Kp/(math.pi*rho(X, q)/Delta)
        state['npts'] += len(X)
        i = int(np.argmin(Kp))
        if Kp[i] < state['kinf']: state['kinf'] = float(Kp[i]); state['xinf'] = float(X[i])
        e = np.searchsorted(edges, X, side='right')
        for ee in np.unique(e):
            s_ = e == ee; d = dec.setdefault(int(ee), dict(n=0, sum=0.0, sum2=0.0, kmin=float('inf'), xk=None, rmin=float('inf'), xr=None, x_lo=float(X[s_][0])))
            k_ = Kp[s_]; r_ = ratio[s_]; x_ = X[s_]
            d['n'] += int(s_.sum()); d['sum'] += float(r_.sum()); d['sum2'] += float((r_*r_).sum()); d['x_hi'] = float(x_[-1])
            j = int(np.argmin(k_))
            if k_[j] < d['kmin']: d['kmin'] = float(k_[j]); d['xk'] = float(x_[j])
            j = int(np.argmin(r_))
            if r_[j] < d['rmin']: d['rmin'] = float(r_[j]); d['xr'] = float(x_[j])
        s_ = X >= 100
        if s_.any():
            Xs = X[s_]; Rs = ratio[s_]; Ks = Kp[s_]
            for i in np.argsort(Rs)[:4000]:
                cand.append((float(Rs[i]), float(Xs[i]), float(Ks[i])))
        s_ = X < 4000
        if s_.any(): lowX.append(X[s_]); lowK.append(Kp[s_])
    absorb(xs, kap)
    # ---- FFT part
    x0 = xlo_end
    CH = 2**22                                   # bins per chunk (131072 units of x)
    K = int(RC/BIN)
    dk = BIN*np.arange(-K, K + 1); ker = 1/(dk*dk + Delta*Delta)
    m = 1 << (CH + 2*K + len(ker)).bit_length()
    print('planned allocation per chunk: fft length %d (%.2f GB complex)' % (m, 3*m*16/1e9), flush=True)
    kf = np.fft.rfft(ker, m)
    end = rmax - RC - 10
    while x0 < end:
        x1 = min(x0 + CH*BIN, end)
        nb = int(round((x1 - x0)/BIN))
        lo = x0 - RC; i0, i1 = np.searchsorted(r, [lo, x1 + RC])
        pos = (r[i0:i1] - lo)/BIN
        ib = np.floor(pos).astype(np.int64); fr = pos - ib
        nd = nb + 2*K + 2
        dens = np.bincount(ib, weights=1 - fr, minlength=nd)[:nd] + np.bincount(ib + 1, weights=fr, minlength=nd)[:nd]
        c = np.fft.irfft(np.fft.rfft(dens, m)*kf, m)
        kk = c[2*K:2*K + nb:STEP]
        xx = x0 + BIN*STEP*np.arange(len(kk))
        tc = np.linspace(x0, x1, 9); kk = kk + np.interp(xx, tc, tails(tc, q, Delta, rmax))
        absorb(xx, kk)
        x0 = x1
    res['grid_points'] = state['npts']
    res['kappa_inf'] = state['kinf']; res['x_at_kappa_inf'] = state['xinf']
    res['bound_at_kappa_inf'] = bound(state['kinf'], Delta)
    keys = sorted(dec)
    for idx, k in enumerate(keys):
        d = dec[k]; mean = d['sum']/d['n']
        kabove = min(dec[j]['kmin'] for j in keys[idx:])
        res['decades'].append(dict(x_lo=d['x_lo'], x_hi=d['x_hi'], kappa_min=d['kmin'], x_kappa_min=d['xk'], ratio_min=d['rmin'], x_ratio_min=d['xr'], ratio_mean=mean,
                                   ratio_std=math.sqrt(max(0.0, d['sum2']/d['n'] - mean*mean)), kappa_inf_above_x_lo=kabove, bound_above_x_lo=bound(kabove, Delta)))
    cand.sort(); picked = []
    for rr, xx_, kk_ in cand:
        if all(abs(xx_ - p[0]) > 3 for p in picked):
            picked.append((xx_, rr, kk_))
            if len(picked) >= 40: break
    res['lowest'] = picked
    LX = np.concatenate(lowX); LK = np.concatenate(lowK); LR = LK/(math.pi*rho(LX, q)/Delta)
    s_ = LX >= 60; Xs = LX[s_]; Rs = LR[s_]; picked = []
    for i in np.argsort(Rs):
        if all(abs(Xs[i] - p[0]) > 3 for p in picked):
            picked.append((float(Xs[i]), float(Rs[i])))
            if len(picked) >= 60: break
    res['lowest_below_4000'] = picked
    np.save(outp.replace('.json', '_low.npy'), np.stack([LX, LK]))
    res['seconds'] = time.time() - t0
    json.dump(res, open(outp, 'w'), indent=1)
    print(json.dumps({k: v for k, v in res.items() if k not in ('lowest', 'lowest_below_4000')}, indent=None)[:6000])
