import numpy as np, math, sys, json, time, mpmath as mp
from model2 import *
from scipy.interpolate import CubicSpline
f = sys.argv[1]; H = float(sys.argv[2]); D = np.load(f); T0 = float(D['T0']); zs = D['zeros']; d = D['d']; Z = D['z']
half = d.max()
L0 = math.log(T0 / (2 * math.pi)); dens = L0 / (2 * math.pi)
cs = CubicSpline(d, Z)
res = dict(T0=T0, nzeros=len(zs), dens=dens, h=H)
print('T0 %.6g zeros %d (block +-%g) density %.4f mean gap %.4f' % (T0, len(zs), half, dens, 1 / dens))
# local extrema of |Z| that are tiny without sign change would indicate a missed close pair
ex = cs.derivative().roots(extrapolate=False); exv = np.abs(cs(ex))
print('smallest |Z| extrema on the block:', np.sort(exv)[:5])
mp.mp.dps = 30
def zeta_line(sig, taus, N=40000):
    """|zeta(sig + i(T0+tau))| by partial sum with mp phases (sig >= 2)."""
    T0m = mp.mpf(T0); twopi = 2 * mp.pi
    ph = np.array([float(mp.fmod(T0m * mp.log(n), twopi)) for n in range(1, N + 1)])
    n = np.arange(1, N + 1.0); ln = np.log(n)
    out = np.empty(len(taus), dtype=complex)
    for i in range(0, len(taus), 64):
        tt = taus[i:i + 64]
        out[i:i + 64] = np.exp(-1j * (ph[None, :] + np.outer(tt, ln))) @ n ** -sig
    return out
t1 = time.time()
tau_grid = np.linspace(-half, half, 2481)
z2 = zeta_line(2.0, tau_grid); z3 = zeta_line(3.0, tau_grid)
print('zeta lines %.1fs; |zeta(2+it)| range on block [%.4f, %.4f]' % (time.time() - t1, abs(z2).min(), abs(z2).max()))
z2s = CubicSpline(tau_grid, np.abs(z2)); z3s = CubicSpline(tau_grid, np.abs(z3))
zabs = {1.5: z2s, 2.5: z3s}
g = zs[np.abs(zs) <= H]; k = len(g)
# ---- N1: potential identity  A(u) - A(0) = log|zeta(s_u)/zeta(s_0)| + dens*h*phi(tau/h) + err
def phi(th): return (1 + th) * np.log(1 + th) + (1 - th) * np.log(1 - th)
us = np.linspace(-H / 2, H / 2, 201)
for a in [1.5, 2.5]:
    A = logp(g, us - 1j * a).real; A0 = logp(g, np.array([0.0]) - 1j * a).real[0]
    pred = np.log(zabs[a](us) / zabs[a](0.0)) + dens * H * phi(us / H)
    err = A - A0 - pred
    sl = np.max(np.abs(err[us != 0] / us[us != 0]))
    print('N1 a=%.1f: max |A(u)-A(0)-pred| over |u|<=h/2: %.4f ; max |err/u| %.4f (theory bound 8B/h = %.3f with B=6.67) ; min_u A(u)-A(0) = %.4f' % (a, np.max(np.abs(err)), sl, 8 * 6.67 / H, (logp(g, np.linspace(-3 * H, 3 * H, 6001) - 1j * a).real - A0).min()))
    res['N1_a%.1f' % a] = dict(maxerr=float(np.max(np.abs(err))), slope=float(sl))
# ---- gap extrema
ge = gap_extrema(g)
tm_all = np.array([x[0] for x in ge]); lmu = np.array([x[1] for x in ge])
i_star = int(np.argmin(lmu)); i_c = int(np.argmin(np.abs(tm_all)))
def report(name, m, a_list=(0.5, 1.5, 2.5), zcenter=None):
    w, r, rs = new_roots(m)
    nr = w[np.abs(w.imag) > 1e-9]
    out = pulls(w, zs[np.abs(zs) > H], dens / 2, 2 * (half - abs(m['t0'])))
    row = dict(name=name, t0=float(m['t0']), k=len(m['g']), nonreal=int(len(nr)), maxIm=float(np.abs(nr.imag).max()) if len(nr) else 0.0, resid=float(rs))
    # counting change sup_T |N_F(T) - N(T)| inside the window
    ords_new = np.sort(w.real); ords_old = np.sort(m['g'])
    allp = np.sort(np.concatenate([ords_new, ords_old]))
    cnt = [abs(np.searchsorted(ords_new, x, side='right') - np.searchsorted(ords_old, x, side='right')) for x in allp]
    row['dN'] = int(max(cnt)); row['maxshift_real'] = float(np.max(np.abs(np.sort(w[np.abs(w.imag) < 1e-9].real) - np.sort(m['g'])[:len(w) - len(nr)]))) if len(nr) == 0 else None
    viol_lit = [o for o in out if o[2] and o[3] < PREQ]; viol_mir = [o for o in out if o[2] and o[1] >= 0.165 and o[4] < PREQ]
    row['viol_literal'] = len(viol_lit); row['viol_mirror_t0'] = len(viol_mir)
    if viol_mir: b = min(viol_mir, key=lambda o: o[4]); row['best_mirror'] = dict(ord=b[0], y=b[1], P=b[3], M0=b[4])
    if viol_lit: b = min(viol_lit, key=lambda o: o[3]); row['best_literal'] = dict(ord=b[0], y=b[1], P=b[3], M0=b[4])
    tau = np.linspace(-4 * H - 10, 4 * H + 10, 8001)
    for a in a_list:
        v = np.abs(ratio(m, tau - 1j * a)); i = int(np.argmax(v))
        row['E_a%.1f' % a] = float(v[i]); row['tauE_a%.1f' % a] = float(tau[i])
        if a in zabs:
            Zm = abs(float(cs(m['t0'])))
            row['formula_a%.1f' % a] = Zm * math.exp(-a * L0 / 2) / float(zabs[a](0.0))
            row['int_absRm1_a%.1f' % a] = float(np.trapezoid(v, tau))
    # critical line: Delta(t) = |Z_F - Z| = |Z| |q/p|
    dd = d[np.abs(d) < half - 1e-9]
    Rr = ratio(m, dd + 0j).real
    ZF = cs(dd) * (1 + Rr)
    good = np.isfinite(ZF)
    row['sup_dZ'] = float(np.nanmax(np.abs(ZF - cs(dd))[good])); row['max_absZ_block'] = float(np.abs(Z).max()); row['max_absZF_block'] = float(np.nanmax(np.abs(ZF[good])))
    row['int_Z2'] = float(np.trapezoid(cs(dd) ** 2, dd)); row['int_ZF2_minus_Z2'] = float(np.trapezoid((ZF ** 2 - cs(dd) ** 2)[good], dd[good]))
    print(json.dumps(row)); res[name] = row
    return w
print('min critical value gap: t_m = %.5f |Z(t_m)| = %.5f ; central gap: t_m = %.5f |Z| = %.5f' % (tm_all[i_star], abs(cs(tm_all[i_star])), tm_all[i_c], abs(cs(tm_all[i_c]))))
report('double_lift_minimal_eta1e-3', build(g, tm_all[i_star], 0.0, eta=1e-3))
report('double_lift_minimal_eta1e-6', build(g, tm_all[i_star], 0.0, eta=1e-6))
report('double_lift_central_gap_eta1e-3', build(g, tm_all[i_c], 0.0, eta=1e-3))
report('pair_lift_minimal_delta0.085', build(g, tm_all[i_star], 0.085))
report('pair_lift_minimal_delta0.495', build(g, tm_all[i_star], 0.495))
# scan pair-lifts (delta = 0.085) over central gap extrema for mirror-instance violators with exactly one pair
best = None; n_single = 0; n_viol = 0; tried = 0
for i in np.argsort(np.abs(tm_all))[:60]:
    m = build(g, tm_all[i], 0.085); w, r, rs = new_roots(m); tried += 1
    nr = w[np.abs(w.imag) > 1e-9]
    out = pulls(w, zs[np.abs(zs) > H], dens / 2, 2 * (half - abs(m['t0'])))
    vm = [o for o in out if o[2] and o[1] >= 0.165 and o[4] < PREQ]
    if vm: n_viol += 1
    if len(nr) == 2: n_single += 1
    if vm:
        E = float(np.abs(ratio(m, np.linspace(-200, 200, 4001) - 1.5j)).max())
        if best is None or E < best[0]: best = (E, float(tm_all[i]), vm[0][4], vm[0][3], int(len(nr)))
print('pair-lift scan delta=0.085 over %d central gaps: %d give a mirror(t=0) violator; %d lift exactly one pair; least-visible violator: E(sigma=2)=%.3e at t0=%.4f M0=%.3f P=%.3f nonreal=%d' % ((tried, n_viol, n_single) + (best if best else (float('nan'),) * 5)))
res['scan'] = dict(tried=tried, n_viol=n_viol, n_single=n_single, best=best)
json.dump(res, open(sys.argv[3], 'w'), indent=1)
