"""Task 4: true size of the residue sum against the Cauchy-Schwarz bound, S = {p}, T_w = log p (largest class of Corollary B1),
w = e^{iTt} sin^6(pi t/T_w).  E = R_S - Obar = 2 Re (1/L) sum_k (zeta'/zeta)(1+it_k) F(t_k) / ||w||^2   (Den = (p/(p-1)) ||w||^2 exactly when T_w <= L).
Bounds: tri = 2 M (1/L) sum |F(t_k)| / ||w||^2 ; CS = 2 sqrt(p) M ; c2 form = 2 (p/(p-1)) (1+p^-1/2)^2 sqrt(p) M.
M = max |zeta'/zeta(1+it)| on a grid of step 0.01 over the lattice points carrying weight (|t - T| <= 4*2pi/L... see code) .
Also: abs1 = (2/||w||^2) sum_n Lambda(n) (n p)^-1/2 |C_b(L - log n)|  (absolute value of the j = 1 block of the Poisson form; T-independent)."""
import numpy as np, math, json, sys, time
from lib3 import *
m = 3
ps = [int(q) for q in primes_upto(1000)]
if len(sys.argv) > 1: ps = ps[::int(sys.argv[1])]
Ts = [100.0, 200.0, 400.0, 700.0, 1000.0, 1500.0, 2000.0, 3000.0, 4500.0, 6000.0, 8000.0, 10000.0, 12500.0, 15000.0, 17500.0, 20000.0]
Ts = sorted(set(Ts + [T + d for T in (1000.0, 5000.0, 10000.0, 20000.0) for d in (0.37, 0.9, 1.7, 2.9, 4.1, 5.3, 7.7, 9.1)]))
# M(T): max of |zeta'/zeta(1+it)| over |t-T| <= 12, grid 0.02 (shared by all p)
t0 = time.time(); Mloc = {}
for T in Ts:
    tt = np.arange(T - 12, T + 12, 0.02); Mloc[T] = max(abs(zlogder(x)) for x in tt)
print('M(T) done', round(time.time() - t0, 1), 's;  M range', min(Mloc.values()), max(Mloc.values()), flush=True)
nn, lam = prime_powers(1.0e6 + 10)
rows = []
for p in ps:
    L = math.log(p); Tw = L
    xg = np.linspace(-Tw, Tw, 20001); norm2 = Cb(np.array([0.0]), Tw, m)[0]
    # T-independent absolute j=1 block
    sel = nn <= p * p
    abs1 = 2 / norm2 * float(np.sum(lam[sel] / np.sqrt(nn[sel] * p) * np.abs(Cb(L - np.log(nn[sel]), Tw, m))))
    for T in Ts:
        k0 = T * L / (2 * math.pi); ks = np.arange(int(k0) - 24, int(k0) + 26); ks = ks[ks != 0]; t = 2 * math.pi * ks / L
        Fk = Wfun(0.5 + 1j * t, T, Tw, m) * np.conj(Wfun(-0.5 + 1j * t, T, Tw, m))
        ld = np.array([zlogder(x) for x in t])
        E = 2 * float(np.sum(ld * Fk).real) / L / norm2
        sumabs = float(np.sum(np.abs(Fk))) / L / norm2
        wmax = np.abs(Fk) > 1e-3 * np.max(np.abs(Fk)); Mlat = float(np.max(np.abs(ld[wmax])))
        M = max(Mloc[T], Mlat)
        rows.append(dict(p=p, T=T, E=E, M=M, tri=2 * M * sumabs, CS=2 * math.sqrt(p) * M, c2=2 * p / (p - 1) * (1 + p ** -0.5) ** 2 * math.sqrt(p) * M,
                         sumabs=sumabs, abs1=abs1, Obar_approx=math.log(T / (2 * math.pi)), tailF=float(np.abs(Fk[0]) + np.abs(Fk[-1])) / float(np.max(np.abs(Fk)))))
    r = [x for x in rows if x['p'] == p]
    print('p %4d  max|E| %.4f  rms E %.4f  mean E %+.4f  min CS/|E| %.1f  median CS %.1f  tri-bound median %.2f  abs1 %.3f  tailF %.1e  (%.0fs)' % (
        p, max(abs(x['E']) for x in r), math.sqrt(np.mean([x['E'] ** 2 for x in r])), np.mean([x['E'] for x in r]), min(x['CS'] / max(abs(x['E']), 1e-300) for x in r),
        np.median([x['CS'] for x in r]), np.median([x['tri'] for x in r]), abs1, max(x['tailF'] for x in r), time.time() - t0), flush=True)
    json.dump(dict(Ts=Ts, rows=rows), open(os.path.join(HERE, 'sizes.json'), 'w'))
