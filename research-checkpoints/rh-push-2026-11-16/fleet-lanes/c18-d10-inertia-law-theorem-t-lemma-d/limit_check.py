# Transfer step, numerical illustration (mpmath, non-rigorous): M_0(u) P_N(u)/P_N(u+1) -> M(u) = xi(u)/xi(u+1), P_N = product over the first N zero pairs.
import mpmath as mp, json
mp.mp.dps = 30
def xi(u): return mp.pi**(-u/2)*mp.gamma(u/2)*mp.zeta(u)
out = []
zs = [mp.zetazero(k) for k in range(1, 401)]
for u in (mp.mpc(0.7, 0.3), mp.mpc(0.2, 5.0), mp.mpc(1.6, -2.0)):
    M = xi(u)/xi(u+1); row = dict(u=str(u), rel_err={})
    for N in (25, 100, 400):
        th = mp.mpf(1)
        for rho in zs[:N]:
            for r in (rho, mp.conj(rho)): th *= (1 - u/r)/(1 - (u+1)/r)
        MN = (u+1)/(u-1)*th
        row['rel_err'][N] = float(abs(MN - M)/abs(M))
    print(row); out.append(row)
json.dump(out, open('limit_check.json', 'w'), indent=1)
