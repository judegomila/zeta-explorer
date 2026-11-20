# validate objs.py against python-flint (acb zeta / Hurwitz) and the battery zero tables.
import sys, json, numpy as np, flint
from flint import acb, arb
import objs
flint.ctx.prec = 120
T0s = [float(x) for x in sys.argv[1:]] or [30.0, 1000.0]
res = {}
for T0 in T0s:
    u = np.linspace(-6, 6, 25)
    v = objs.eval_objects(T0, u, ['zeta', 'chi4', 'chi5', 'dh', 'ea', 'tnr3'])
    def hz(s, r, q): return acb(s).zeta(arb(r)/q)
    def per(s, coef):
        q = len(coef); return sum(coef[r-1]*hz(s, r, q) for r in range(1, q+1) if coef[r-1] != 0)*(acb(q)**(-s))
    errs = {k: 0.0 for k in v}
    for i, uu in enumerate(u):
        s = acb(0.5, T0+float(uu))
        ref = {'zeta': s.zeta(), 'chi4': per(s, [1, 0, -1, 0]), 'chi5': per(s, [1, -1, -1, 1, 0]),
               'dh': per(s, [1, arb(objs.KAPPA_DH), -arb(objs.KAPPA_DH), -1, 0]),
               'ea': acb(0.75, T0+float(uu)).zeta()*acb(0.25, T0+float(uu)).zeta()}
        w = acb(3)**(-(s-0.5)); ref['tnr3'] = s.zeta()*(1 + 2.2*w + w*w)
        for k in v:
            r = ref[k]; errs[k] = max(errs[k], abs(complex(float(r.real.mid()), float(r.imag.mid())) - v[k][i]))
    res[T0] = errs; print('T0', T0, 'max abs error vs flint:', errs, flush=True)
# heat: first on-line zeros of Z_tau against the battery table (tau=-0.1: 14.163717655758552, 21.059827273704822; tau=-0.5: 14.279906417059427)
h = 0.01; u = np.arange(-12, 12+h/2, h); T0 = 22.0
z = objs.zeta_line(T0, u)
for tau, refs in ((0.1, [14.163717655758552, 21.059827273704822, 25.040131627390865]), (0.5, [14.279906417059427, 21.211744505172984, 25.156861788749407])):
    F, m, Zt = objs.heat_from_zeta(T0, u, z, -tau, h); t = T0 + u[m:len(u)-m]
    sc = np.where(Zt[:-1]*Zt[1:] < 0)[0]; zs = [float(t[i] - Zt[i]*(t[i+1]-t[i])/(Zt[i+1]-Zt[i])) for i in sc]
    print('heat tau=-%g zeros (linear interp, grid %g):' % (tau, h), zs[:4], 'battery', refs)
    res['heat%g' % tau] = [zs[:4], refs]
json.dump({str(k): v for k, v in res.items()}, open('validate_objs.json', 'w'), indent=1, default=float)
