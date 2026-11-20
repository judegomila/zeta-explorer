"""Explicit-formula decomposition of the Dyson statistic Q = <phi_k F_k>.
For a cutoff X (kappa = X * 2 pi / L in unfolded wavenumber):
   F_k = sum_{j != k} 1/(g_k - g_j) = W_k(X) + C_k(X),
   W_k = sum_j (1 - cos(X (g_k - g_j)))/(g_k - g_j)      [explicit formula:  W_k = s * sum_{n <= e^X} Lambda(n) n^{-1/2} sin(g_k log n) + smooth]
   C_k = sum_j cos(X (g_k - g_j))/(g_k - g_j)
   Q = P + R,  P = <phi (2pi/L_k) W>,  R = <phi (2pi/L_k) C>;  Pprime = prime-sum evaluation of P.
Usage: decomp.py zeros.npz NSUB J kappa1 kappa2 ..."""
import numpy as np, sys, math, json, torch, mpmath as mp, time
f = sys.argv[1]; NSUB = int(float(sys.argv[2])); J = int(sys.argv[3]); kappas = [float(v) for v in sys.argv[4:]]
dev = torch.device('cuda')
d = np.load(f); T0 = int(float(d['T0'])); delta = d['delta'][:NSUB + 2 * J + 2]; x = d['x'][:NSUB + 2 * J + 2]
Lk_all = np.log((T0 + delta) / (2 * math.pi))
c = slice(J + 1, len(delta) - J - 1)
phi = (2 * x[1:-1] - x[:-2] - x[2:])[J:len(delta) - J - 2]      # phi for zeros in c
dl = delta[c]; fac = 2 * math.pi / Lk_all[c]; N = len(dl)
L0 = float(np.median(Lk_all))
w = torch.tensor(phi * fac, device=dev); D = torch.tensor(delta, device=dev)
idx = torch.arange(J + 1, len(delta) - J - 1, device=dev)
res = dict(file=f, T0=T0, L=L0, N=N, J=J, rows=[])
# full flat sum and cos-sums
Fk = torch.zeros(N, dtype=torch.float64, device=dev)
Ck = {k: torch.zeros(N, dtype=torch.float64, device=dev) for k in kappas}
g0 = D[idx]
for m in range(1, J + 1):
    dr = g0 - D[idx + m]; dl_ = g0 - D[idx - m]
    Fk += 1 / dr + 1 / dl_
    for k in kappas:
        X = k * L0 / (2 * math.pi)
        Ck[k] += torch.cos(X * dr) / dr + torch.cos(X * dl_) / dl_
# continuum tail of the flat sum (unit density in x; negligible for phi-correlation) omitted
Q = float((w * Fk).mean())
def bme(v, block=2000):
    v = v.cpu().numpy(); m = len(v) // block; M = v[:m * block].reshape(m, block).mean(1); return float(M.std(ddof=1) / math.sqrt(m))
print('L=%.3f N=%d J=%d  Q(flat, J neighbours)=%.5f +- %.5f' % (L0, N, J, Q, bme(w * Fk)), flush=True)
mp.mp.dps = 40
def prime_powers(nmax):
    sv = np.ones(nmax + 1, dtype=bool); sv[:2] = False
    for i in range(2, int(nmax ** 0.5) + 1):
        if sv[i]: sv[i * i::i] = False
    out = []
    for p in np.nonzero(sv)[0]:
        q = int(p)
        while q <= nmax: out.append((q, math.log(p))); q *= int(p)
    out.sort(); return out
for k in kappas:
    X = k * L0 / (2 * math.pi); nmax = int(math.exp(X))
    R = float((w * Ck[k]).mean()); Wk = Fk - Ck[k]; P = float((w * Wk).mean())
    pp = prime_powers(nmax)
    t0 = time.time()
    ns = np.array([q for q, _ in pp], dtype=np.float64); lam = np.array([l for _, l in pp])
    ph0 = np.array([float(mp.fmod(mp.mpf(T0) * mp.log(int(q)), 2 * mp.pi)) for q, _ in pp]) if len(pp) < 300000 else None
    if ph0 is None:
        # large list: double-double style reduction via mp on primes only
        ph0 = np.array([float(mp.fmod(mp.mpf(T0) * mp.log(int(q)), 2 * mp.pi)) for q, _ in pp])
    logn = torch.tensor(np.log(ns), device=dev); coef = torch.tensor(lam / np.sqrt(ns), device=dev); p0 = torch.tensor(ph0, device=dev)
    dlt = torch.tensor(dl, device=dev)
    # per-zero prime sum S_k = sum_n Lambda(n)/sqrt(n) sin(g_k log n)
    Sk = torch.zeros(N, dtype=torch.float64, device=dev)
    B = max(1, int(3e8 // len(pp)))
    for a in range(0, N, B):
        ph = torch.outer(dlt[a:a + B], logn) + p0[None, :]
        Sk[a:a + B] = torch.sin(ph) @ coef
    # sign and per-zero check
    num = float((Sk * Wk).sum()); den = float((Sk * Sk).sum()); s = num / den
    resid = Wk - round(s) * Sk
    Pprime = float((w * Sk).mean()) * round(s)
    row = dict(kappa=k, X=X, nmax=nmax, npp=len(pp), Q=Q, P=P, R=R, Pprime=Pprime, slope=s, resid_rms=float(resid.std()), W_rms=float(Wk.std()),
               resid_phi=float((w * resid).mean()), Perr=bme(w * Wk), Rerr=bme(w * Ck[k]))
    res['rows'].append(row)
    print('kappa=%.4f nmax=%d (%d prime powers, %.0fs): P=%.5f+-%.5f  R=%.5f+-%.5f  P+R=%.5f | prime-sum P=%.5f  (per-zero: slope %.5f, rms W %.4f, rms(W - s*S) %.4f, <phi resid>=%.2e)' % (
        k, nmax, len(pp), time.time() - t0, P, row['Perr'], R, row['Rerr'], P + R, Pprime, s, row['W_rms'], row['resid_rms'], row['resid_phi']), flush=True)
json.dump(res, open(f.replace('.npz', '_decomp.json'), 'w'))
