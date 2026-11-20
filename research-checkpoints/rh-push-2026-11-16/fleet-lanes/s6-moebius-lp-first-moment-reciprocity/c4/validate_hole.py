"""Check the smoothed approximate functional equation against mpmath (zeta: siegelz; periodic: Hurwitz zeta)."""
import sys, math, numpy as np, mpmath as mp
import hole
def zexact(obj, t):
    mp.mp.dps = 30
    q, kappa, per = hole.OBJS[obj]
    if obj == 'zeta': return float(mp.siegelz(t))
    s = mp.mpf(1) / 2 + 1j * mp.mpf(t)
    F = sum(per[r] * mp.zeta(s, mp.mpf(r) / q) for r in range(1, q) if per[r] != 0) / mp.mpf(q) ** s
    th = mp.mpf(t) / 2 * mp.log(mp.mpf(q) / mp.pi) + mp.im(mp.loggamma((mp.mpf(1) / 2 + kappa + 1j * mp.mpf(t)) / 2))
    v = mp.exp(1j * th) * F
    return float(mp.re(v)), float(mp.im(v))
for obj, T0s, A in [('zeta', '10000', 0.01), ('zeta', '1000000', 0.01), ('zeta', '1000000', 0.0025), ('zeta', '100000000', 0.0025), ('chi4', '10000', 0.01), ('chi5', '10000', 0.01), ('DH', '10000', 0.01), ('chi4', '300000', 0.01), ('DH', '300000', 0.01), ('DH', '300000', 0.0025)]:
    r = hole.compute(obj, T0s, 2, A=A, pps=10, verbose=False)
    idx = np.linspace(0, len(r['d']) - 1, 14).astype(int)
    errs = []; ims = []
    for i in idx:
        e = zexact(obj, mp.mpf(T0s) + mp.mpf(float(r['d'][i])))
        if obj == 'zeta': errs.append(abs(e - r['Z'][i]))
        else: errs.append(abs(e[0] - r['Z'][i])); ims.append(abs(e[1]))
    print(f"{obj:5s} T0={T0s:>10s} A={A}: max |Z_afe - Z_exact| = {max(errs):.2e}  (max |Z| on the window {np.abs(r['Z']).max():.2f}; max |Im e^(i theta) F| exact = {max(ims) if ims else 0:.1e})", flush=True)
