# c2_cauchy.py : smallest eigenvalue of the sech seam Gram G_ij = sech((x_i-x_j)/2) on arithmetic node sets (combination 2).
# With y_i = exp(x_i):  G_ij = 2 sqrt(y_i y_j)/(y_i+y_j)  (a scaled Cauchy matrix), and
#     G^{-1} = P G P,   P = diag(P_i),   P_i = prod_{k != i} (y_i+y_k)/(y_i-y_k)          (Cauchy inverse formula),
# so  max_i P_i^2 <= 1/lambda_min <= sum_i P_i^2, and lambda_min = 1/lambda_max(P G P) from a band around argmax |P_i|.
# usage: c2_cauchy.py validate | c2_cauchy.py run <out.json> <Nmax> <nzeros>
import sys, json, math, time, numpy as np
from math import lgamma

def lnP_general(y):
    y = np.asarray(y, dtype=np.float64); n = len(y); out = np.empty(n); ch = max(1, int(2e7//n))
    for i0 in range(0, n, ch):
        yi = y[i0:i0+ch, None]; d = np.abs(yi - y[None, :]); s = yi + y[None, :]
        idx = np.arange(i0, min(n, i0+ch)); d[idx-i0, idx] = 1.0; s[idx-i0, idx] = 1.0
        out[i0:i0+ch] = (np.log(s) - np.log(d)).sum(axis=1)
    return out

def lnP_integers(N):
    # nodes 1..N: prod_{k != i} (i+k)/|i-k| = (N+i)!/(i! 2i (i-1)! (N-i)!)
    return np.array([lgamma(N+i+1) - lgamma(i+1) - math.log(2*i) - lgamma(i) - lgamma(N-i+1) for i in range(1, N+1)])

def lam_min(y, lnP, avec=None, cap=6000):
    """returns dict: ln lambda_min, bounds, band size, overlap of the lowest eigenvector with avec (unit-normalised)."""
    y = np.asarray(y, dtype=np.float64); n = len(y); mx = float(lnP.max())
    band = np.where(lnP - mx > math.log(1e-9))[0]
    if len(band) > cap: band = band[np.argsort(-lnP[band])[:cap]]; band.sort()
    p = np.exp(lnP[band]-mx); sg = np.where((band % 2) == 0, 1.0, -1.0)       # sign of P_i alternates with the rank of y_i
    yb = y[band]; G = 2*np.sqrt(yb[:, None]*yb[None, :])/(yb[:, None]+yb[None, :])
    M = (sg*p)[:, None]*G*(sg*p)[None, :]
    w, V = np.linalg.eigh(M); top = float(w[-1]); v = V[:, -1]
    lsum = mx*2 + math.log(float(np.exp(2*(lnP-mx)).sum()))
    res = {'n_nodes': n, 'ln_lam_min': -(2*mx + math.log(top)), 'ln_lower': -lsum, 'ln_upper': -2*mx, 'band': int(len(band)),
           'argmax_node': float(y[int(lnP.argmax())]), 'top_norm': top}
    if avec is not None:
        a = np.asarray(avec); na = math.sqrt(float((np.abs(a)**2).sum()))
        res['overlap2'] = float(abs(np.vdot(v, a[band]))**2)/na**2 if na > 0 else None
    return res

def rayleigh_integers(a, N):
    """R = a^H G a / a^H a for a_n = a_F(n) n^{-1/2} on nodes n = 1..N (zeros of a_F allowed): 2 sum a_F(m) conj a_F(n)/(m+n) / sum |a_F(n)|^2/n."""
    a = np.asarray(a[1:N+1]); L = 1
    while L < 2*N+2: L *= 2
    f = np.zeros(L, dtype=np.complex128); f[1:N+1] = a
    g = np.zeros(L, dtype=np.complex128); g[1:N+1] = np.conj(a)
    conv = np.fft.ifft(np.fft.fft(f)*np.fft.fft(g)); s = np.arange(2, 2*N+1)
    num = 2*float((conv[2:2*N+1].real/s).sum()); den = float((np.abs(a)**2/np.arange(1, N+1)).sum())
    return num/den, num, den

def coefficient_tables(N):
    n = np.arange(N+1)
    spf = np.zeros(N+1, dtype=np.int64)
    for p in range(2, N+1):
        if spf[p] == 0: spf[p::p] = np.where(spf[p::p] == 0, p, spf[p::p])
    Om = np.zeros(N+1, dtype=np.int64)
    for m in range(2, N+1): Om[m] = Om[m//spf[m]] + 1
    sig = np.zeros(N+1)                      # sum_{d|n} d^{1/2}
    for d in range(1, N+1): sig[d::d] += math.sqrt(d)
    T = {'zeta': np.ones(N+1), 'chi4': np.array([0, 1, 0, -1])[n % 4].astype(float), 'chi5': np.array([0, 1, -1, -1, 1])[n % 5].astype(float),
         'dh': np.array([0, 1, 0.28407904384041227, -0.28407904384041227, -1])[n % 5], 'liouville': (-1.0)**Om,
         'ea': np.where(n > 0, sig*np.maximum(n, 1)**-0.25, 0.0), 'wt': np.exp(-1j*1.2393168126993495*np.log(np.maximum(n, 1))),
         'tnr1000003': np.ones(N+1)}
    primes = np.where(spf == n)[0]; primes = primes[primes >= 2]
    return T, primes

def validate():
    import mpmath as mp
    mp.mp.dps = 80; out = {}
    for name, y in (('integers 1..12', list(range(1, 13))), ('primes <= 37', [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]), ('zeros', [14.134725, 21.02204, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719, 43.327073])):
        n = len(y); G = mp.matrix(n, n)
        for i in range(n):
            for j in range(n): G[i, j] = 2*mp.sqrt(mp.mpf(y[i])*y[j])/(mp.mpf(y[i])+y[j])
        E = mp.eigsy(G, eigvals_only=True); lmin = min(E)
        lnP = lnP_general(y); r = lam_min(y, lnP)
        P = [mp.fprod([(mp.mpf(y[i])+y[k])/(mp.mpf(y[i])-y[k]) for k in range(n) if k != i]) for i in range(n)]
        Ginv = G**-1; err = max(abs(Ginv[i, j] - P[i]*G[i, j]*P[j])/abs(Ginv[i, j]) for i in range(n) for j in range(n))
        out[name] = {'ln_lam_min_mp': float(mp.log(lmin)), 'ln_lam_min_formula': r['ln_lam_min'], 'identity_rel_err': float(err)}
        print(name, out[name])
    y = np.arange(1, 13); print('lgamma form vs general', float(np.abs(lnP_integers(12)-lnP_general(y)).max()))
    json.dump(out, open('c2_validate.json', 'w'), indent=1)

if __name__ == '__main__':
    if sys.argv[1] == 'validate': validate(); sys.exit()
    outp = sys.argv[2]; Nmax = int(sys.argv[3]); nz = int(sys.argv[4])
    T, primes = coefficient_tables(Nmax); out = {'Nmax': Nmax, 'sets': {}, 'rayleigh': {}}
    lad = [n for n in (100, 300, 1000, 3000, 10000, 30000, 100000, 300000, 1000000) if n <= Nmax]
    def A_opt_ln(delta): return math.log(8*math.pi/delta) - math.pi**2/delta      # leading term of (2 pi/delta) sum_k sech((pi/delta)(2 pi k - pi))
    for N in lad:
        t0 = time.time(); rows = {}
        y = np.arange(1, N+1, dtype=float)
        rows['integers'] = lam_min(y, lnP_integers(N), T['zeta'][1:N+1]/np.sqrt(y)); rows['integers']['min_sep'] = math.log(N/(N-1))
        if N <= 100000:
            for nm, sel in (('odd', (np.arange(1, N+1) % 2 == 1)), ('coprime5', (np.arange(1, N+1) % 5 != 0))):
                ys = y[sel]; a = (T['chi4'] if nm == 'odd' else T['chi5'])[1:N+1][sel]/np.sqrt(ys)
                rows[nm] = lam_min(ys, lnP_general(ys), a); rows[nm]['min_sep'] = float(np.log(ys[-1]/ys[-2]))
                if nm == 'coprime5':
                    rows[nm]['overlap2_dh'] = lam_min(ys, lnP_general(ys), T['dh'][1:N+1][sel]/np.sqrt(ys))['overlap2']
        pp = primes[primes <= N].astype(float)
        rows['primes'] = lam_min(pp, lnP_general(pp), np.ones(len(pp))); rows['primes']['min_sep'] = float(np.min(np.log(pp[1:]/pp[:-1])))
        for nm in rows: rows[nm]['ln_A_opt_at_min_sep'] = A_opt_ln(rows[nm]['min_sep'])
        out['sets'][str(N)] = rows
        if N <= 1000000:
            out['rayleigh'][str(N)] = {nm: rayleigh_integers(T[nm], N) for nm in T}
        print(N, {k: (round(v['ln_lam_min'], 3), v['n_nodes']) for k, v in rows.items()}, {k: round(v[0], 5) for k, v in out['rayleigh'].get(str(N), {}).items()}, f'{time.time()-t0:.0f}s', flush=True)
        json.dump(out, open(outp, 'w'), indent=1)
    # zero ordinates as nodes y = gamma
    from flint import acb
    t0 = time.time(); zs = np.array([float(z.imag.mid()) for z in acb.zeta_zeros(1, nz)]); print('zeros', nz, 'up to', zs[-1], f'{time.time()-t0:.0f}s', flush=True)
    out['zeros'] = {}
    for m in [k for k in (100, 300, 1000, 3000, 10000, 30000, 100000) if k <= nz]:
        ys = zs[:m]; r = lam_min(ys, lnP_general(ys)); r['height'] = float(ys[-1]); r['min_sep'] = float(np.min(np.log(ys[1:]/ys[:-1]))); r['ln_A_opt_at_min_sep'] = A_opt_ln(r['min_sep'])
        out['zeros'][str(m)] = r; print('zeros', m, r, flush=True); json.dump(out, open(outp, 'w'), indent=1)
    print('C2DONE')
