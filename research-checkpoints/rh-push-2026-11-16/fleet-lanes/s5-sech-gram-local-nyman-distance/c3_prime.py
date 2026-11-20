# c3_prime.py : prime side of the Gaussian Weil functional of zeta on the grid (400 widths x 200 centre frequencies up to 1e5),
# compared with the zero side (flint zeros).  W = pole - P + arch - log(pi),
#   P(w,xi) = 2 sum_n Lambda(n) n^{-1/2} exp(-(log n)^2/(2 w^2)) cos(xi log n)
#   stage A: all prime powers n <= 1e7 and all p^k (k >= 2) up to X, direct;  stage B: primes in (1e7, X] from the moment file of c3_sieve.
# usage: c3_prime.py <mom.bin> <out.json> <wmax> [check_mom_1e8.bin]
import sys, json, math, time, os, numpy as np
from scipy.special import digamma
momf = sys.argv[1]; outp = sys.argv[2]; wmax = float(sys.argv[3])
t00 = time.time()
hd = np.fromfile(momf, dtype=np.float64, count=7); A, X, D, nb, KM = hd[0], hd[1], hd[2], int(hd[3]), int(hd[4])
print('moments', momf, 'A', A, 'X', X, 'D', D, 'bins', nb, 'KM', KM, 'primes', int(hd[5]), f'planned {8*nb*KM/1e9:.2f} GB', flush=True)
mom = np.fromfile(momf, dtype=np.float64, offset=56).reshape(KM, nb)
x0 = math.log(A)
# ---- stage A list
NA = int(A); sv = np.ones(NA+1, dtype=bool); sv[:2] = False
for p in range(2, int(NA**0.5)+1):
    if sv[p]: sv[p*p::p] = False
pr = np.nonzero(sv)[0].astype(np.float64); del sv
xa = [np.log(pr)]; wa = [np.log(pr)/np.sqrt(pr)]
k = 2
while 2.0**k <= X:
    pk = pr[pr**k <= X*(1+1e-12)]; n = pk**k; xa.append(np.log(n)); wa.append(np.log(pk)/np.sqrt(n)); k += 1
xa = np.concatenate(xa); wa = np.concatenate(wa); print('stage A terms', len(xa), flush=True)
# ---- grid
widths = np.linspace(0.25, wmax, 400)
zf = 'out/zeta_zeros_100060.npy'
if os.path.exists(zf): zs = np.load(zf)
else:
    from flint import acb, arb
    nz = int(arb(100060).zeta_nzeros().unique_fmpz())
    t0 = time.time(); zs = np.array([float(z.imag.mid()) for z in acb.zeta_zeros(1, nz)]); np.save(zf, zs); print('zeros', nz, 'up to', zs[-1], f'{time.time()-t0:.0f}s', flush=True)
base = np.geomspace(1.0, 1e5, 100); mids = []
for b in np.geomspace(20.0, 99990.0, 100):                    # midpoint of the widest zero gap within +-5 of b
    i0, i1 = np.searchsorted(zs, [b-5, b+5]); i0 = max(0, min(i0, len(zs)-3)); i1 = max(i1, i0+3); g = zs[i0:i1]
    j = int(np.argmax(np.diff(g))); mids.append(0.5*(g[j]+g[j+1]))
xis = np.concatenate([base, np.array(mids)])
# ---- prime side
P = np.zeros((400, 200))
for i0 in range(0, len(xa), 50000):
    xx = xa[i0:i0+50000]; ww = wa[i0:i0+50000]
    Gm = np.exp(-xx[None, :]**2/(2*widths[:, None]**2))*ww[None, :]
    P += 2*Gm @ np.cos(xx[:, None]*xis[None, :])
print('stage A done', f'{time.time()-t00:.0f}s', flush=True)
def stageB(mom, x0, D, nb, xis, widths, CB=200):
    out = np.zeros((len(widths), len(xis)))
    if nb % CB:                                      # pad the fine grid with empty bins to a multiple of the coarse block
        pad = CB - nb % CB; mom = np.concatenate([mom, np.zeros((mom.shape[0], pad))], axis=1); nb += pad
    nbc = nb
    xc = x0 + (np.arange(nbc)+0.5)*D; XJ = xc.reshape(-1, CB).mean(axis=1); d = (xc.reshape(-1, CB) - XJ[:, None])
    for c, xi in enumerate(xis):
        z0 = np.zeros(nbc, dtype=np.complex128); z1 = np.zeros(nbc, dtype=np.complex128); f = 1.0+0j
        for k in range(mom.shape[0]):
            z0 += mom[k, :nbc]*f
            if k+1 < mom.shape[0]: z1 += mom[k+1, :nbc]*f
            f = f*(-1j*xi)/(k+1)
        ph = np.exp(-1j*np.fmod(xi*xc, 2*np.pi)); z0 = (z0*ph).reshape(-1, CB); z1 = (z1*ph).reshape(-1, CB)
        S0 = z0.sum(axis=1); S1 = (d*z0).sum(axis=1); S2 = (d*d*z0).sum(axis=1); T0 = z1.sum(axis=1)
        for i, w in enumerate(widths):
            g = np.exp(-XJ*XJ/(2*w*w)); a1 = -XJ/(w*w); a2 = 0.5*(XJ*XJ/w**4 - 1/(w*w))
            out[i, c] = 2*float((g*(S0 + a1*(S1+T0) + a2*S2)).real.sum())
        if c % 20 == 0: print('  stage B centre', c, f'{time.time()-t00:.0f}s', flush=True)
    return out
chk = {}
if len(sys.argv) > 4:                                      # moment method against a direct sum over the primes in (1e7, 1e8]
    h8 = np.fromfile(sys.argv[4], dtype=np.float64, count=7); m8 = np.fromfile(sys.argv[4], dtype=np.float64, offset=56).reshape(int(h8[4]), int(h8[3]))
    N8 = 10**8; s8 = np.ones(N8//2, dtype=bool)                  # odd numbers 2i+1
    for p in range(3, 10**4+1, 2):
        if s8[p//2]: s8[p*p//2::p] = False
    p8 = (2*np.nonzero(s8)[0]+1).astype(np.float64); p8 = p8[p8 > 1e7]; del s8
    x8 = np.log(p8); w8 = x8/np.sqrt(p8); tw = np.array([2.2, 3.0, wmax]); tx = np.array([14.134725, 1000.3, 99991.7])
    dirv = np.array([[2*float((w8*np.exp(-x8*x8/(2*w*w))*np.cos(xi*x8)).sum()) for xi in tx] for w in tw])
    momv = stageB(m8, math.log(h8[0]), h8[2], int(h8[3]), tx, tw)
    chk = {'direct': dirv.tolist(), 'moments': momv.tolist(), 'max_abs_diff': float(np.abs(dirv-momv).max()), 'n_primes': len(p8)}
    print('moment check', chk, flush=True); del m8, p8, x8, w8
P += stageB(mom, x0, D, nb, xis, widths)
# ---- pole, archimedean, zero side
W = np.zeros((400, 200)); Z = np.zeros((400, 200)); y = np.arange(-9, 9+1e-9, 0.02)
for i, w in enumerate(widths):
    pole = 2*w*math.sqrt(2*math.pi)*np.exp(w*w/8 - w*w*xis*xis/2)*np.cos(w*w*xis/2)
    r = xis[None, :] + y[:, None]/w
    arch = math.sqrt(math.pi/2)/math.pi*0.02*(np.exp(-y[:, None]**2/2)*digamma(0.25+0.5j*r).real).sum(axis=0)
    W[i] = pole - P[i] + arch - math.log(math.pi)
    for c, xi in enumerate(xis):
        a, b = np.searchsorted(zs, [xi-9.5/w, xi+9.5/w]); g = zs[a:b]
        Z[i, c] = 2*w*math.sqrt(math.pi/2)*float(np.exp(-w*w*(g-xi)**2/2).sum())
        if xi < 9.5/w + 20: Z[i, c] += 2*w*math.sqrt(math.pi/2)*float(np.exp(-w*w*(zs[:2000]+xi)**2/2).sum())
tail = [float(math.exp(math.log(X)/2 - math.log(X)**2/(2*w*w))/(math.log(X)/(w*w) - 0.5)) for w in widths]
diff = np.abs(W-Z); ok = np.array(tail) < 1e-9
out = {'X': X, 'widths': [0.25, wmax, 400], 'centres': xis.tolist(), 'moment_check': chk,
       'min_W_prime_side': float(W.min()), 'argmin': [float(widths[np.unravel_index(W.argmin(), W.shape)[0]]), float(xis[np.unravel_index(W.argmin(), W.shape)[1]])],
       'min_W_zero_side': float(Z.min()), 'max_abs_diff_all': float(diff.max()),
       'max_abs_diff_where_tail_below_1e-9': float(diff[ok].max()), 'largest_width_with_tail_below_1e-9': float(widths[ok].max()),
       'max_abs_diff_by_width': [[float(widths[i]), float(diff[i].max()), tail[i], float(W[i].min())] for i in range(0, 400, 21)],
       'n_negative_prime_side': int((W < 0).sum()), 'n_negative_below_minus_1e-6': int((W < -1e-6).sum()), 'max_P': float(np.abs(P).max())}
json.dump(out, open(outp, 'w'), indent=1); np.savez(outp.replace('.json', '.npz'), W=W, Z=Z, widths=widths, xis=xis)
print(json.dumps({k: v for k, v in out.items() if k not in ('centres',)}), flush=True); print('C3DONE', f'{time.time()-t00:.0f}s')
