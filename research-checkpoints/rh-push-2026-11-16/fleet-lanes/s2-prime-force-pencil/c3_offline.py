"""Combination 3: confining-sign system on complex pairs.
Pencil F - tau Z_w, Z_w(z) = sum_n w_n n^(-1/2) cos(theta_F(z) - z log n). An off-line zero z0 (Im z0 > 0) of F moves with
 dz0/dtau = Z_w(z0)/F'(z0); "confining" = Im dz0/dtau < 0. Constraint vector c_n = -Im( Z_n(z0)/F'(z0) ), system c.w > 0.
Part A (mpmath): planted pair in zeta, Z_pl(z) = Z(z) (z-z0)(z-conj z0)/((z-g_a)(z-g_b)), z0 = x* + i delta; exact c_n against the first-order form
        s_k a_n(x*) cosh(delta (theta'(x*) - log n))   (s_k = sign Z''(x*), a_n = n^(-1/2) cos(theta(x*) - x* log n)).
Part B (float64): all near-collisions of zeta to TMAX planted at delta = u/theta'(x*): fraction with negative value under the on-line optimum,
        and the margin of the planted system, as functions of u = delta * (1/2) log(T/2pi).
Part C (mpmath + float64): the actual off-line pairs of DH below 2000 (battery table), alone and joined with DH's on-line near-collisions.
Usage: c3_offline.py A|B|C OUT.json [TMAX]"""
import sys, os, json, math, numpy as np
import lib
from lib import log

def part_A(out):
    import mpmath as mp
    mp.mp.dps = 30
    g, _, _ = lib.load_list('zeta')
    res = []
    def th(z): return (mp.loggamma(mp.mpf(1) / 4 + 1j * z / 2) - mp.loggamma(mp.mpf(1) / 4 - 1j * z / 2)) / (2j) - z / 2 * mp.log(mp.pi)
    def Zc(z): return mp.exp(1j * th(z)) * mp.zeta(mp.mpf(1) / 2 + 1j * z)
    for k0 in (33, 1000, 20000, 150000):          # search forward for a near-collision
        k = k0
        while (g[k + 1] - g[k]) / (2 * math.pi / math.log(g[k] / (2 * math.pi))) > 0.5: k += 1
        ga = mp.zetazero(k + 1).imag; gb = mp.zetazero(k + 2).imag
        xs = mp.findroot(lambda t: mp.siegelz(t, derivative=1), (ga + gb) / 2); Zs = mp.siegelz(xs); s = -mp.sign(Zs)
        thp = mp.diff(mp.siegeltheta, xs)
        for u in (0.05, 0.5, 2.0):
            dl = u / thp; z0 = xs + 1j * dl
            Fp = Zc(z0) * (z0 - mp.conj(z0)) / ((z0 - ga) * (z0 - gb))
            ex = []; fo = []
            for n in range(1, 33):
                Zn = mp.cos(th(z0) - z0 * mp.log(n)) / mp.sqrt(n)
                ex.append(float(-mp.im(Zn / Fp))); fo.append(float(s * mp.cos(mp.siegeltheta(xs) - xs * mp.log(n)) / mp.sqrt(n) * mp.cosh(dl * (thp - mp.log(n)))))
            ex = np.array(ex); fo = np.array(fo); c = float(ex @ fo / (fo @ fo)); cosang = float(ex @ fo / np.linalg.norm(ex) / np.linalg.norm(fo))
            # direct check of the velocity: Newton for the zero of Z_pl - eps Z_1 near z0
            eps = mp.mpf('1e-8')
            def Fpl(z): return Zc(z) * (z - z0) * (z - mp.conj(z0)) / ((z - ga) * (z - gb)) - eps * mp.cos(th(z) - z * 0) 
            z1 = mp.findroot(Fpl, z0 + eps * (mp.cos(th(z0)) / Fp))
            vel = (z1 - z0) / eps; pred = mp.cos(th(z0)) / Fp
            res.append(dict(k=int(k), x=float(xs), gap=float(gb - ga), u=u, delta=float(dl), scale=c, cos_angle=cosang, positive_scale=bool(c > 0),
                            velocity_check_rel=float(abs(vel - pred) / abs(pred))))
            log('pair %d x*=%.4f gap %.4f u=%.2f delta=%.4f: exact c_n vs first-order form: cosine %.8f, scale %.4g (>0: same orientation); dz/dtau check rel %.1e' % (k, float(xs), float(gb - ga), u, float(dl), cosang, c, res[-1]['velocity_check_rel']))
    json.dump(res, open(out, 'w'))

def part_B(out, tmax):
    g, cond, s0 = lib.load_list('zeta'); g = g[g <= tmax]
    x, s, k, tight = lib.near_collisions(g)
    m = x < 1000.0; cf = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out', 'mpx_zeta.npy')
    if os.path.exists(cf) and m.sum() == len(np.load(cf)): x[m] = np.load(cf)
    th = lib.theta_zeta(x); thp = lib.dtheta_zeta(x)
    gram = -s * np.cos(th)        # > 0 iff sign Z''(x*) = -sign cos theta(x*)   (the n = 1 rule of the source)
    viol = np.nonzero(gram < 0)[0]
    res = dict(tmax=tmax, K=len(x), gram_rule_violations=int(len(viol)), first_violation_x=float(x[viol[0]]) if len(viol) else None,
               violation_fraction=float(len(viol) / len(x)), rows=[])
    log('near-collisions %d to %.0f ; n=1 sign rule violated at %d (first at x=%.3f), fraction %.4f' % (len(x), tmax, len(viol), res['first_violation_x'] or -1, res['violation_fraction']))
    US = [0.0, 0.1, 0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0]
    for N in (32, 128, 1024):
        n = np.arange(1, N + 1.0); f = np.log(n); a = 1 / np.sqrt(n)
        S0 = lib.System(x, s, th, f, a); r0 = lib.margin(S0)
        if r0['status'] != 'feasible': log('N=%d on-line system not feasible at this height' % N); continue
        w = r0['p'] / np.linalg.norm(r0['p'])
        for u in US:
            scale = (lambda uu: (lambda idx: np.cosh((uu / thp[idx])[:, None] * (thp[idx][:, None] - f[None, :]))))(u)
            Su = lib.System(x, s, th, f, a, rowscale=scale)
            v = Su.dots(w); frac = float((v < 0).mean())
            # by height thirds
            e = np.array_split(np.arange(len(x)), 3); fr3 = [float((v[i] < 0).mean()) for i in e]
            ru = lib.margin(Su)
            K0 = None
            if ru['status'] == 'infeasible':      # least K with rho = 0 (height order)
                lo, hi = 1, len(x)
                while hi - lo > 1:
                    mid = (lo + hi) // 2
                    if lib.margin(Su, mid)['status'] == 'infeasible': hi = mid
                    else: lo = mid
                K0 = hi
            row = dict(N=N, u=u, frac_negative_under_online_optimum=frac, frac_by_height_third=fr3, rho_planted=ru['rho_upper'], status=ru['status'],
                       onset_K=K0, onset_T=float(x[K0 - 1]) if K0 else None, rho_online=r0['rho_upper'])
            res['rows'].append(row)
            log('N=%d u=%.2f: fraction negative under on-line optimum %.4f (thirds %s) ; planted-system margin %.5f %s%s' % (N, u, frac, ['%.4f' % q for q in fr3], ru['rho_upper'], ru['status'], (' onset K=%d T=%.1f' % (K0, x[K0 - 1])) if K0 else ''))
            json.dump(res, open(out, 'w'))

def part_C(out):
    import mpmath as mp
    from scipy.special import loggamma
    mp.mp.dps = 30
    tab = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'c12-control-battery-harness', 'tables', 'zeros_DH.json')))
    off = [(mp.mpf(b), mp.mpf(t)) for b, t, _ in tab['offline']]
    kap = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
    CH = {1: 1, 2: 1j, 3: -1j, 4: -1}
    def Lc(s, conj=False, d=0):
        return sum((mp.conj(CH[a]) if conj else CH[a]) * (mp.zeta(s, mp.mpf(a) / 5, d) ) for a in CH)   # 5^-s factor applied below
    def f(s): return mp.power(5, -s) * ((1 - 1j * kap) / 2 * Lc(s) + (1 + 1j * kap) / 2 * Lc(s, True))
    tg = sum(CH[a] * mp.exp(2j * mp.pi * a / 5) for a in CH); Wr = tg / (1j * mp.sqrt(5)); cdh = mp.re((1 - 1j * kap) / 2 * mp.sqrt(Wr))
    def th5(z): return z / 2 * mp.log(5 / mp.pi) + (mp.loggamma(mp.mpf(3) / 4 + 1j * z / 2) - mp.loggamma(mp.mpf(3) / 4 - 1j * z / 2)) / (2j)
    def ZDH(z): return mp.exp(1j * th5(z)) * f(mp.mpf(1) / 2 + 1j * z) / cdh
    log('DH check: |f| at the first tabulated off-line zero %.2e ; c = %.6f ; Z_DH(10.0) = %s' % (float(abs(f(off[0][0] + 1j * off[0][1]))), float(cdh), mp.nstr(ZDH(mp.mpf(10)), 12)))
    NMAX = 128; rows = []; deltas = []
    for b, t in off:
        beta = b if b < mp.mpf(1) / 2 else 1 - b             # zero with Im z0 > 0: s = 1/2 + i z0, z0 = t + i (1/2 - beta)
        z0 = t + 1j * (mp.mpf(1) / 2 - beta)
        Fp = mp.diff(ZDH, z0)
        thz = th5(z0)
        rows.append([float(-mp.im(mp.cos(thz - z0 * mp.log(n)) / mp.sqrt(n) / Fp)) for n in range(1, NMAX + 1)]); deltas.append(float(mp.mpf(1) / 2 - beta))
    C = np.array(rows); deltas = np.array(deltas); tt = np.array([float(t) for _, t in off])
    log('DH off-line pairs: %d ; delta range %.4f .. %.4f ; delta*(1/2)log(5t/2pi) range %.3f .. %.3f' % (len(C), deltas.min(), deltas.max(), (deltas * 0.5 * np.log(5 * tt / (2 * math.pi))).min(), (deltas * 0.5 * np.log(5 * tt / (2 * math.pi))).max()))
    # DH on-line near-collisions below 2000, from the samples
    g, cond, _ = lib.load_list('dh'); g = g[g < 2000.0]
    x, s, k, tight = lib.near_collisions(g, cond=5.0)
    for p in (os.path.join(lib.DATA, 'dir_samples.npz'), os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'dir_samples.npz'), os.path.join(lib.DATA, 'dir2e5_samples.npz')):
        if os.path.exists(p): break
    d = np.load(p); h = float(d['h']); Smp = d['Z1'] + d['Z2'] if bool(d['dh_plus']) else d['Z1'] - d['Z2']
    x, F, ok = lib.refine_from_samples(x, g[k], g[k + 1], Smp, h); x = x[ok]; s = -np.sign(F[ok])
    # consistency of normalisation: sampled Z1+Z2 against mp Z_DH at one point
    log('normalisation: sampled Z_DH(x*_0=%.4f) = %.8f ; mpmath %.8f' % (x[0], F[ok][0], float(mp.re(ZDH(mp.mpf(float(x[0])))))))
    res = dict(n_off=len(C), n_on=len(x), rows=[], delta=deltas.tolist(), t=tt.tolist())
    for N in (4, 8, 16, 32, 64, 128):
        n = np.arange(1, N + 1.0)
        Goff = C[:, :N] / np.linalg.norm(C[:, :N], axis=1)[:, None]
        Son = lib.System(x, s, lib.theta_chi5(x), np.log(n), 1 / np.sqrt(n)); Gon = Son.rows(np.arange(len(x)))
        out_row = dict(N=N)
        for nm, G in (('offline_only', Goff), ('online_only', Gon), ('joint', np.vstack([Gon, Goff]))):
            p, lam = lib.minnorm(G); out_row[nm] = float(np.linalg.norm(p))
        # own coefficients as the weight: w_n = -a_DH(n) (sign fixed by the on-line system), fraction of off-line pairs confined
        aDH = np.array([0.0, 1.0, lib.KAPPA, -lib.KAPPA, -1.0])[(np.arange(1, N + 1) % 5)]
        von = Gon @ aDH; sg = np.sign(np.sum(np.sign(von))); out_row['own_coeff_online_frac'] = float((sg * von > 0).mean()); out_row['own_coeff_offline_frac'] = float((sg * (Goff @ aDH) > 0).mean())
        p, lam = lib.minnorm(Gon)
        if np.linalg.norm(p) > 1e-9: out_row['offline_frac_confined_under_online_optimum'] = float((Goff @ p > 0).mean())
        res['rows'].append(out_row); log('DH N=%d: margins off-line only %.5f, on-line only (%d near-collisions below 2000) %.5f, joint %.5f ; own-coefficient weight: on-line %.3f, off-line %.3f confined ; off-line confined under on-line optimum %s' % (
            N, out_row['offline_only'], len(x), out_row['online_only'], out_row['joint'], out_row['own_coeff_online_frac'], out_row['own_coeff_offline_frac'], out_row.get('offline_frac_confined_under_online_optimum')))
    json.dump(res, open(out, 'w'))

if __name__ == '__main__':
    part = sys.argv[1]; out = sys.argv[2]
    if part == 'A': part_A(out)
    elif part == 'B': part_B(out, float(sys.argv[3]) if len(sys.argv) > 3 else 1e6)
    else: part_C(out)
