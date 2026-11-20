"""Combination 4, zero side: Poisson mass of real zeros. Lane s5-burgers-shock-cusp-stieltjes-strip.
Coordinates of H_t: zeros r = 2 gamma, x = 2 t, width Y = 2 delta:
    M(x, Y) = sum_r Y/((x - r)^2 + Y^2) = (1/2) sum_gamma delta/((t - gamma)^2 + delta^2)        (= (1/2) Re xi'/xi(1/2 + delta + i t) when all zeros are real)
    mean    = (1/4) log(q x / 4 pi) = (1/4) log(q t / 2 pi)
Mirror kernel of rh-bridge-mirror-descent (pull on an off-line zero at height y): 2y/(Delta^2 + 4y^2) = Poisson kernel of width Y = 2y; y0 = 0.165 is Y = 0.33.
p_req = 4.37426.
Evaluation: K_NB zeros on each side exactly, the rest by the smooth density (error below delta * |S| / W^2, W = distance to the K_NB-th zero).
usage:
  c4.py validate                 against mpmath Re xi'/xi at low height, and against a brute-force sum
  c4.py list NAME [first] [count]  grid statistics on a zero list (ordinates), all four widths
  c4.py tables                   full sets below height 2000: deficit far from off-line pairs, Palm (pair-excluded) mass, mass at off-line pairs
  c4.py cmp OBJ T NAME           prime side slice (p4.py) against the zero list NAME at the same points: M, M_K, m', m''
  c4.py recheck NAME             mpmath Re xi'/xi at the minima reported by 'list' (zeta lists)
"""
import sys, json, math, os, numpy as np
import zf
from zf import xp, GPU, asnp, log

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out'); os.makedirs(OUT, exist_ok=True)
P_REQ = 4.37426
DELTAS = [0.0825, 0.165, 0.2, 0.5]
K_NB = 256

def dens(t, q): return np.log(q * t / (2 * math.pi)) / (2 * math.pi)

def mass_at(x, T0, q, t, deltas, K=K_NB, budget=3e7):
    """x: sorted ordinates minus T0 (float64). t: evaluation points minus T0 (numpy). returns array (len(deltas), len(t)) of M."""
    n = len(x); out = np.empty((len(deltas), len(t))); X = xp.asarray(x)
    mid = xp.asarray(0.5 * (x[1:] + x[:-1]))
    ch = max(1, int(budget // (2 * K)))
    off = xp.arange(-K, K)
    for s in range(0, len(t), ch):
        tt = xp.asarray(t[s:s + ch]); i0 = xp.searchsorted(X, tt)
        assert int(i0.min()) >= K + 1 and int(i0.max()) <= n - K - 1, 'evaluation point too close to the end of the list'
        d = tt[:, None] - X[i0[:, None] + off[None, :]]; d2 = d * d
        A = mid[i0 - K - 1]; Bq = mid[i0 + K - 1]
        rho = xp.log(q * (T0 + tt) / (2 * math.pi)) / (2 * math.pi)
        for k, de in enumerate(deltas):
            S = (de / (d2 + de * de)).sum(1)
            tail = rho * (math.pi - xp.arctan((Bq - tt) / de) - xp.arctan((tt - A) / de))
            out[k, s:s + ch] = asnp(0.5 * (S + tail))
    return out

def summarize(Mv, mean):
    r = dict(n=int(Mv.size), min=float(Mv.min()), max=float(Mv.max()), mean=float(Mv.mean()), std=float(Mv.std()), mean_formula=float(mean.mean()),
             frac_below_preq=float((Mv < P_REQ).mean()), argmin=int(Mv.argmin()))
    ratio = Mv / mean
    r['ratio_to_mean'] = dict(min=float(ratio.min()), q0p001=float(np.quantile(ratio, 1e-3)), q0p01=float(np.quantile(ratio, 0.01)), q0p1=float(np.quantile(ratio, 0.1)),
                              median=float(np.median(ratio)), mean=float(ratio.mean()), std=float(ratio.std()))
    nb = Mv.size // 65536
    if nb:
        mn = Mv[:nb * 65536].reshape(nb, 65536).min(1); r['blocks_65536'] = nb; r['blocks_with_min_below_preq'] = int((mn < P_REQ).sum()); r['max_block_min'] = float(mn.max())
    return r

def do_list(name, first=None, count=None, dt=0.0125, tag=None):
    x, T0, q = zf.load(name)
    if first is not None: x = x[first:first + count] if count else x[first:]
    n = len(x); lo = x[K_NB + 2]; hi = x[n - K_NB - 3]
    t = np.arange(lo, hi, dt)
    log(name, 'zeros', n, 'T0', T0, 'heights %.6g .. %.6g' % (T0 + x[0], T0 + x[-1]), 'grid points', len(t), 'dt', dt,
        'planned largest temporary %.2f GB' % (3e7 * 8 * 3 / 1e9), 'GPU', GPU)
    Mv = mass_at(x, T0, q, t, DELTAS); mean = 0.25 * np.log(q * (T0 + t) / (2 * math.pi))
    res = dict(name=name, zeros=n, T0=T0, q=q, height_lo=float(T0 + lo), height_hi=float(T0 + hi), dt=dt, mean_lo=float(mean[0]), mean_hi=float(mean[-1]), p_req=P_REQ, widths={})
    for k, de in enumerate(DELTAS):
        r = summarize(Mv[k], mean); r['Y'] = 2 * de; r['t_at_min'] = float(T0 + t[r['argmin']]); r['t_at_min_offset'] = float(t[r['argmin']])
        # gap that contains the minimum
        i = int(np.searchsorted(x, t[r['argmin']])); r['gap_at_min_unfolded'] = float((x[i] - x[i - 1]) * dens(T0 + x[i], q))
        res['widths']['Y%g' % (2 * de)] = r
        log('Y %.3g: min %.4f at %.4f (gap %.2f mean spacings) mean %.4f (formula %.4f) std %.4f below p_req %.4f blocks below %s of %s; ratio to mean: min %.3f q1e-3 %.3f'
            % (2 * de, r['min'], r['t_at_min'], r['gap_at_min_unfolded'], r['mean'], r['mean_formula'], r['std'], r['frac_below_preq'], r.get('blocks_with_min_below_preq'), r.get('blocks_65536'),
               r['ratio_to_mean']['min'], r['ratio_to_mean']['q0p001']))
    json.dump(res, open(os.path.join(OUT, 'c4_%s.json' % (tag or name)), 'w'), indent=1)

def validate():
    import mpmath as mp
    mp.mp.dps = 25
    x, T0, q = zf.load('zeta8', 60000)
    ts = np.array([20000.3, 25000.77, 31234.5, 40000.123])
    Mv = mass_at(x, 0.0, 1, ts, DELTAS); res = []
    for j, t in enumerate(ts):
        for k, de in enumerate(DELTAS):
            s = mp.mpc(0.5 + de, t)
            full = mp.zeta(s, derivative=1) / mp.zeta(s) + 1 / s + 1 / (s - 1) - mp.log(mp.pi) / 2 + mp.digamma(s / 2) / 2
            res.append(dict(t=float(t), delta=de, zero_side=float(Mv[k, j]), mpmath=float(full.real) / 2, diff=float(Mv[k, j] - float(full.real) / 2)))
            log(json.dumps(res[-1]))
    json.dump(res, open(os.path.join(OUT, 'c4_validate.json'), 'w'), indent=1)

def recheck(name):
    import mpmath as mp
    mp.mp.dps = 30
    d = json.load(open(os.path.join(OUT, 'c4_%s.json' % name))); res = []
    for key, r in d['widths'].items():
        de = r['Y'] / 2; t = mp.mpf(d['T0']) + mp.mpf(r['t_at_min_offset']); s = mp.mpc(0.5 + de, t)
        h = mp.mpf('1e-8')
        lz = (mp.log(mp.zeta(s + h)) - mp.log(mp.zeta(s - h))) / (2 * h)       # zeta'/zeta by a central difference of log zeta along sigma
        full = lz + 1 / s + 1 / (s - 1) - mp.log(mp.pi) / 2 + mp.digamma(s / 2) / 2
        res.append(dict(Y=r['Y'], t=float(t), list_value=r['min'], mpmath_value=float(full.real) / 2, p_req=P_REQ, below=bool(float(full.real) / 2 < P_REQ)))
        log(json.dumps(res[-1]))
    json.dump(res, open(os.path.join(OUT, 'c4_recheck_%s.json' % name), 'w'), indent=1)

def tables():
    res = {}
    grid = np.arange(300.0, 1900.0, 0.01)
    for nm in ('ZETA', 'DH', 'HEAT--0.1', 'HEAT--0.5', 'TNR', 'EA-1_4'):
        try: on, off = zf.table(nm)
        except Exception as e: log(nm, 'not available', repr(e)); continue
        q = 5 if nm == 'DH' else 1
        if nm == 'EA-1_4': off = [(0.25, float(v)) for v in zf.table('ZETA')[0]]; on = np.array([])   # zeros of zeta(s+a)zeta(s-a), a = 1/4: 1/2 +- 1/4 + i gamma
        on = np.sort(np.array(on, dtype=float)); offg = np.array([g for b, g in off]); offb = np.array([b for b, g in off])
        mean = 0.25 * np.log(q * grid / (2 * math.pi)); r = dict(online=len(on), offline_pairs=len(off), widths={})
        top = 2000.0
        def real_mass(t, de, excl=None):
            g = on if excl is None else np.delete(on, excl)
            S = np.zeros(len(t))
            for s in range(0, len(t), 20000):
                tt = t[s:s + 20000]
                S[s:s + 20000] = (de / ((tt[:, None] - g[None, :]) ** 2 + de * de)).sum(1) + (de / ((tt[:, None] + g[None, :]) ** 2 + de * de)).sum(1)
            return 0.5 * S
        def tail(t, de): # zeros above the table height, full smooth density
            return 0.5 * dens(t, q) * (math.pi / 2 - np.arctan((top - t) / de))
        for de in DELTAS:
            Y = 2 * de; w = {}
            if len(on):
                Mr = real_mass(grid, de) + tail(grid, de)
                w['all_x'] = dict(mean_ratio=float((Mr / mean).mean()), min_ratio=float((Mr / mean).min()), q0p01_ratio=float(np.quantile(Mr / mean, 0.01)), frac_below_half_mean=float((Mr < 0.5 * mean).mean()))
                if len(off):
                    dist = np.abs(grid[:, None] - offg[None, :]).min(1) / 2 * 2      # in t; x-distance is twice this
                    far = (2 * dist) > 5 * Y                                        # further than 5 Y in x from every off-line pair
                    near = (2 * dist) <= 5 * Y
                    w['far_from_offline'] = dict(frac_of_grid=float(far.mean()), mean_ratio=float((Mr / mean)[far].mean()), min_ratio=float((Mr / mean)[far].min()),
                                                 q0p01_ratio=float(np.quantile((Mr / mean)[far], 0.01)), frac_below_half_mean=float((Mr[far] < 0.5 * mean[far]).mean()))
                    w['near_offline'] = dict(frac_of_grid=float(near.mean()), mean_ratio=float((Mr / mean)[near].mean()) if near.any() else None)
                    sel = (offg > 300) & (offg < 1900)
                    Mo = real_mass(offg[sel], de) + tail(offg[sel], de); mo = 0.25 * np.log(q * offg[sel] / (2 * math.pi))
                    w['mass_of_real_zeros_at_offline_pairs'] = dict(n=int(sel.sum()), mean_ratio=float((Mo / mo).mean()), max_ratio=float((Mo / mo).max()), min_ratio=float((Mo / mo).min()),
                                                                    frac_at_or_above_preq=float((Mo >= P_REQ).mean()), max_value=float(Mo.max()))
                    # full Im-part including off-line pairs: (1/2) sum (delta - b)/((t-g)^2 + (delta - b)^2) + (delta + b)/(...)
                    Mf = Mr.copy()
                    for s in range(0, len(grid), 20000):
                        tt = grid[s:s + 20000][:, None]
                        Mf[s:s + 20000] += 0.5 * (((de - offb) / ((tt - offg) ** 2 + (de - offb) ** 2)) + ((de + offb) / ((tt - offg) ** 2 + (de + offb) ** 2))).sum(1)
                    w['full_set'] = dict(mean_ratio=float((Mf / mean).mean()), min=float(Mf.min()), frac_negative=float((Mf < 0).mean()),
                                         frac_negative_far=float((Mf[far] < 0).mean()), offline_with_b_above_delta=int((offb > de).sum()))
                # Palm: mass at the midpoint of an adjacent real pair with that pair excluded, against the mean
                sel = np.nonzero((on[:-1] > 300) & (on[1:] < 1900))[0]
                mids = 0.5 * (on[sel] + on[sel + 1]); Mp = real_mass(mids, de) + tail(mids, de)
                Mp -= 0.5 * (de / ((mids - on[sel]) ** 2 + de * de) + de / ((mids - on[sel + 1]) ** 2 + de * de))
                mm = 0.25 * np.log(q * mids / (2 * math.pi))
                w['palm_pair_excluded_at_real_pairs'] = dict(n=len(mids), mean_ratio=float((Mp / mm).mean()), q0p9_ratio=float(np.quantile(Mp / mm, 0.9)), max_ratio=float((Mp / mm).max()))
            else:
                # no real zeros: M_real = 0; full set of E_a: shifted zeta masses
                zon = np.array([g for b, g in off]); a2 = 0.25
                Mf = np.zeros(len(grid))
                for s in range(0, len(grid), 20000):
                    tt = grid[s:s + 20000][:, None]
                    Mf[s:s + 20000] = 0.5 * (((de - a2) / ((tt - zon) ** 2 + (de - a2) ** 2)) + ((de + a2) / ((tt - zon) ** 2 + (de + a2) ** 2))).sum(1)
                w['real_zeros'] = 0; w['full_set_without_tail'] = dict(min=float(Mf.min()), mean=float(Mf.mean()), frac_negative=float((Mf < 0).mean()))
            r['widths']['Y%g' % Y] = w
        res[nm] = r; log(nm, json.dumps(r))
    json.dump(res, open(os.path.join(OUT, 'c4_tables.json'), 'w'), indent=1)

def cmp(obj, T, name, nsamp=1500):
    import p4
    z = np.load(os.path.join(OUT, 'p4_%s_%s_slice.npz' % (obj, T))); meta = json.load(open(os.path.join(OUT, 'p4_%s_%s.json' % (obj, T))))
    L = math.log(meta['X']); x, T0, q = zf.load(name); Tf = float(T); dt = float(z['dt']); tau0 = float(z['tau0'])
    keys = [k for k in z.files if k.startswith('d') and '_k' in k]; npts = len(z[keys[0]])
    rng = np.random.default_rng(3); js = np.sort(rng.choice(npts, nsamp, replace=False)); t = (Tf - T0) + tau0 + js * dt       # offsets from T0
    assert t.min() > x[K_NB + 2] and t.max() < x[-K_NB - 3], 'slice outside the zero list'
    i0 = np.searchsorted(x, t); off = np.arange(-K_NB, K_NB); g = x[i0[:, None] + off[None, :]]
    mid = 0.5 * (x[1:] + x[:-1]); A = mid[i0 - K_NB - 1]; Bq = mid[i0 + K_NB - 1]; rho = dens(T0 + t, q)
    v, c = (p4.E_of(np.zeros(1)), p4._GL)[1]
    res = dict(obj=obj, T=T, list=name, samples=nsamp, a_flat=meta['a_flat'], logX=L, rows=[])
    deltas = sorted(set(float(k.split('_')[0][1:]) for k in keys))
    for de in deltas:
        zz = de + 1j * (t[:, None] - g)                         # s - rho
        E0 = np.empty(zz.shape, complex); E1 = np.empty(zz.shape, complex); E2 = np.empty(zz.shape, complex)
        for s in range(0, nsamp, 4):
            ex = np.exp(-(zz[s:s + 4, :, None] * L) * v[None, None, :])
            E0[s:s + 4] = (ex * c).sum(2); E1[s:s + 4] = (ex * (-v * c)).sum(2); E2[s:s + 4] = (ex * (v * v * c)).sum(2)
        b = Bq - t; a = t - A
        # atoms (kernel 1/z)
        P0 = (1 / zz).sum(1) + rho * ((math.pi - np.arctan(b / de) - np.arctan(a / de)))          # real part exact; imaginary part of the tail dropped
        P1 = (-1 / zz ** 2).sum(1) - rho * (1j / (de - 1j * b) - 1j / (de + 1j * a))
        P2 = (2 / zz ** 3).sum(1) + rho * (1j / (de - 1j * b) ** 2 - 1j / (de + 1j * a) ** 2)
        K0 = P0 + (E0 / zz).sum(1)
        K1 = P1 + (-E0 / zz ** 2 + L * E1 / zz).sum(1)
        K2 = P2 + (2 * E0 / zz ** 3 - 2 * L * E1 / zz ** 2 + L * L * E2 / zz).sum(1)
        row = dict(delta=de, Y=2 * de)
        k0 = 'd%g_k0' % de
        if k0 in z.files:
            G0 = z[k0][js]; MK_prime = 0.5 * (0.5 * np.log(q * (T0 + t) / (2 * math.pi)) - G0.real); MK_zero = 0.5 * K0.real; Mtrue = 0.5 * P0.real
            row.update(M_K_prime_vs_zero_max_abs=float(np.abs(MK_prime - MK_zero).max()), M_K_prime_vs_zero_rms=float(np.sqrt(((MK_prime - MK_zero) ** 2).mean())),
                       M_true_minus_M_K_rms=float(np.sqrt(((Mtrue - MK_zero) ** 2).mean())), M_true_minus_M_K_max_abs=float(np.abs(Mtrue - MK_zero).max()),
                       M_true_min=float(Mtrue.min()), M_K_min=float(MK_prime.min()), M_true_std=float(Mtrue.std()), M_K_std=float(MK_prime.std()),
                       corr_true_K=float(np.corrcoef(Mtrue, MK_prime)[0, 1]),
                       frac_below_preq_true=float((Mtrue < P_REQ).mean()), frac_below_preq_K=float((MK_prime < P_REQ).mean()))
        for kk, Kz, Pz, sg in ((1, K1, P1, 1.0), (2, K2, P2, -1.0)):
            key = 'd%g_k%d' % (de, kk)
            if key in z.files:
                Gk = z[key][js]
                row['k%d' % kk] = dict(prime_vs_zero_K_max_abs=float(np.abs(sg * Gk - Kz).max()), scale_K=float(np.abs(Kz).mean()),
                                        C_prime_median=float(de ** (kk + 0.5) * np.median(np.abs(Gk))), C_prime_max=float(de ** (kk + 0.5) * np.abs(Gk).max()),
                                        C_atoms_median=float(de ** (kk + 0.5) * np.median(np.abs(Pz))), C_atoms_max=float(de ** (kk + 0.5) * np.abs(Pz).max()),
                                        median_ratio_atoms_over_prime=float(np.median(np.abs(Pz) / np.abs(Gk))), max_ratio_atoms_over_prime=float((np.abs(Pz) / np.abs(Gk)).max()))
        res['rows'].append(row); log(json.dumps(row))
    json.dump(res, open(os.path.join(OUT, 'c4_cmp_%s_%s.json' % (obj, T)), 'w'), indent=1)

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'validate': validate()
    elif cmd == 'list':
        a = sys.argv[2:]; do_list(a[0], int(float(a[1])) if len(a) > 1 else None, int(float(a[2])) if len(a) > 2 else None, tag=a[3] if len(a) > 3 else None)
    elif cmd == 'tables': tables()
    elif cmd == 'cmp': cmp(sys.argv[2], sys.argv[3], sys.argv[4])
    elif cmd == 'recheck': recheck(sys.argv[2])
