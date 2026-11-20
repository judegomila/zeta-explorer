"""Combinations 1 and 2, zero side. Lane s5-burgers-shock-cusp-stieltjes-strip.
  m_N(z) = sum_{k<=N} 1/(gamma_k - z)   (unnormalised, as in s3-dyson-burgers-zero-flow)
  m' = sum 1/(gamma - z)^2,  m'' = 2 sum 1/(gamma - z)^3
  y_N = sqrt(2 pi / N), C_ren = y_N^{3/2} |m'|, C_curv = y_N^{5/2} |m''|, rho = C_ren / C_curv
Readings:
  O   z0* = i y_N, measure symmetrised (gamma and -gamma)                 (literal reading of the task)
  O1  z0* = i y_N, positive ordinates only
  P   z0* = x* + i y_N, x* = midpoint of the closest pair among the first N (reading of imp-33794 / s3)
  Zr  z0* = gamma_j + i y_N at the zero of index N/2 (single atom)
  Ms  z0* = gamma_{N/2} + i 8/rho (mesoscopic height, 8 mean spacings)
Arc: z = x* + y_N e^{i theta}, theta in [0.02 pi, 0.98 pi]; winding rate = d arg(-m'')/d theta (model cusp: -(1 + alpha) = -3/2).
usage:
  c12.py model                 model density |x|^{-1/2} on [-1,1]: K_curv = 3.3322, |A| = pi/sqrt 2, rho -> 2/3, K = 8 sqrt2/(9 pi)
  c12.py list NAME [nmax]      ladder on a zero list
  c12.py tables                crossing-time field tau*(y) on full zero sets with off-line pairs; winding on arcs
"""
import sys, json, math, os, numpy as np
import zf
from zf import xp, GPU, asnp, log

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out'); os.makedirs(OUT, exist_ok=True)
TH = np.linspace(0.02 * math.pi, 0.98 * math.pi, 193)

def ladder(n, lo=1000):
    r = []; d = lo
    while d <= n:
        for m in (1, 2, 5):
            if m * d <= n: r.append(m * d)
        d *= 10
    if r[-1] != n: r.append(n)
    return r

def ksums(x, zs, sym=False, budget=4e7):
    """S_j(z) = sum_k 1/(x_k - z)^j, j = 1, 2, 3, for complex z in zs; sym adds the points -x_k. float64 screen on GPU when present."""
    Z = xp.asarray(zs, dtype=xp.complex128); m = len(zs)
    S = [xp.zeros(m, dtype=xp.complex128) for _ in range(3)]
    ch = max(1, int(budget // m))
    for s in range(0, len(x), ch):
        X = xp.asarray(x[s:s + ch], dtype=xp.float64)
        for sg in ((1.0, -1.0) if sym else (1.0,)):
            r = 1.0 / (sg * X[:, None] - Z[None, :])
            S[0] += r.sum(0); r2 = r * r; S[1] += r2.sum(0); S[2] += (r2 * r).sum(0)
    return [asnp(v) for v in S]

def winding(S3):
    a = np.unwrap(np.angle(-2.0 * S3))
    rate = np.polyfit(TH, a, 1)[0]
    return float(a[-1] - a[0]), float(rate), float(a[len(a) // 2])

def reading(x, x0, y, sym=False, tag=''):
    """x: ordinates minus x0 already when x0 != 0 is handled by the caller. z0 = i y relative to x0."""
    zs = np.concatenate([[1j * y], y * np.exp(1j * TH)])
    S1, S2, S3 = ksums(x, zs, sym)
    Cren = y ** 1.5 * abs(S2[0]); Ccurv = y ** 2.5 * abs(2 * S3[0])
    tot, rate, mid = winding(S3[1:])
    return {tag + 'Cren': float(Cren), tag + 'Ccurv': float(Ccurv), tag + 'rho': float(Cren / Ccurv) if Ccurv > 0 else None,
            tag + 'arg_mpp': float(np.angle(-2 * S3[0])), tag + 'wind_total': tot, tag + 'wind_rate': rate, tag + 'Imm': float(S1[0].imag)}

def two_atom(g, y):
    """closed form for a pair at -g/2, +g/2 read at i y"""
    a = g / 2
    m1 = 1 / (a - 1j * y) ** 2 + 1 / (-a - 1j * y) ** 2; m2 = 2 * (1 / (a - 1j * y) ** 3 + 1 / (-a - 1j * y) ** 3)
    return y ** 1.5 * abs(m1), y ** 2.5 * abs(m2)

def do_list(name, nmax=None):
    x, T0, q = zf.load(name, nmax)
    n = len(x); log(name, 'zeros', n, 'T0', T0, 'GPU', GPU, 'planned largest temporary', '%.2f GB' % (3 * 4e7 * 16 / 1e9))
    g = np.diff(x); rows = []
    for N in ladder(n):
        y = math.sqrt(2 * math.pi / N); xs = x[:N]; row = dict(N=N, y=y, top=float(T0 + xs[-1]))
        if T0 == 0.0:
            row.update(reading(xs, 0.0, y, sym=True, tag='O_'))
            row.update(reading(xs, 0.0, y, sym=False, tag='O1_'))
        k = int(np.argmin(g[:N - 1])); gm = float(g[k]); xm = 0.5 * (xs[k] + xs[k + 1])
        row.update(gmin=gm, gmin_over_y=gm / y, pair_index=k, pair_height=float(T0 + xm), unfolded_gmin=float(gm * zf.rho(T0 + xm, q)))
        row.update(reading(xs - xm, 0.0, y, tag='P_'))
        c2 = two_atom(gm, y); row.update(P_two_atom_Cren=float(c2[0]), P_two_atom_Ccurv=float(c2[1]))
        j = N // 2
        row.update(reading(xs - xs[j], 0.0, y, tag='Z_'))
        ym = 8.0 / float(zf.rho(T0 + xs[j], q)); xmid = 0.5 * (xs[j] + xs[j + 1])
        S1, S2, S3 = ksums(xs - xmid, np.array([1j * ym]))
        row.update(Ms_y=ym, Ms_Cren=float(ym ** 1.5 * abs(S2[0])), Ms_Ccurv=float(ym ** 2.5 * abs(2 * S3[0])))
        rows.append(row)
        log('N %d y %.3e | O Cren %.3e Ccurv %.3e rho %s wind %.3f | P g/y %.3f Cren %.4g Ccurv %.4g rho %.4g rate %.3f | Z Cren %.4g Ccurv %.4g rho %.4g rate %.3f | Ms %.2e %.2e'
            % (N, y, row.get('O_Cren', float('nan')), row.get('O_Ccurv', float('nan')), row.get('O_rho'), row.get('O_wind_total', float('nan')),
               gm / y, row['P_Cren'], row['P_Ccurv'], row['P_rho'], row['P_wind_rate'], row['Z_Cren'], row['Z_Ccurv'], row['Z_rho'], row['Z_wind_rate'],
               row['Ms_Cren'], row['Ms_Ccurv']))
    # fine ladder for the fraction of N inside the model windows (P reading uses the two-atom closed form + exact check above)
    Ns = np.unique(np.round(np.logspace(3, math.log10(n), 2001)).astype(np.int64)) if n > 2000 else np.array([n])
    gacc = np.minimum.accumulate(g); cr = []; cc = []
    for N in Ns:
        y = math.sqrt(2 * math.pi / N); a, b = two_atom(float(gacc[N - 2]), y); cr.append(a); cc.append(b)
    cr = np.array(cr); cc = np.array(cc); rr = cr / cc
    fine = dict(n_values=len(Ns), Cren_min=float(cr.min()), Cren_max=float(cr.max()), Ccurv_min=float(cc.min()), Ccurv_max=float(cc.max()),
                rho_min=float(rr.min()), rho_max=float(rr.max()),
                frac_Cren_in_2p2215_2p2510=float(np.mean((cr >= 2.2215) & (cr <= 2.2510))),
                frac_Ccurv_within_10pct_of_3p3322=float(np.mean(abs(cc / 3.3322 - 1) < 0.1)),
                frac_rho_within_10pct_of_2over3=float(np.mean(abs(rr / (2 / 3) - 1) < 0.1)))
    log('fine ladder (two-atom closed form at the closest pair):', json.dumps(fine))
    json.dump(dict(name=name, n=n, T0=T0, rows=rows, fine=fine), open(os.path.join(OUT, 'c12_%s.json' % name.replace('/', '_')), 'w'), indent=1)

def model():
    """rho(x) = |x|^{-1/2} on [-1, 1]; x = +-u^2 removes the singularity. Gauss-Legendre on [0,1], graded."""
    from numpy.polynomial.legendre import leggauss
    def quad(f, eps):
        # panels geometric towards 0 on the scale sqrt(eps)
        edges = np.concatenate([[0.0], np.geomspace(1e-4 * math.sqrt(eps), 1.0, 400)])
        t, w = leggauss(40); tot = 0
        for a, b in zip(edges[:-1], edges[1:]):
            u = 0.5 * (b - a) * t + 0.5 * (a + b); tot = tot + 0.5 * (b - a) * (w * f(u)).sum()
        return tot
    rows = []
    for eps in (1e-1, 3e-2, 1e-2, 3e-3, 1e-3, 3e-4, 1e-4, 1e-5, 1e-6):
        z = 1j * eps
        m1 = quad(lambda u: 2 / (u * u - z) ** 2 + 2 / (-u * u - z) ** 2, eps)
        m2 = 2 * quad(lambda u: 2 / (u * u - z) ** 3 + 2 / (-u * u - z) ** 3, eps)
        Cr = eps ** 1.5 * abs(m1); Cc = eps ** 2.5 * abs(m2); r = Cr / Cc
        rows.append(dict(eps=eps, Cren=Cr, Ccurv=Cc, rho=r, K_est=(r - 2 / 3) / eps ** 1.5))
        log('model eps %.0e Cren %.6f Ccurv %.6f rho %.8f (rho-2/3)/eps^1.5 %.6f' % (eps, Cr, Cc, r, (r - 2 / 3) / eps ** 1.5))
    # phase on the arc at eps = 1e-4
    eps = 1e-4; ph = []
    for th in TH:
        z = eps * np.exp(1j * th)
        ph.append(2 * quad(lambda u: 2 / (u * u - z) ** 3 + 2 / (-u * u - z) ** 3, eps))
    ph = np.array(ph); a = np.unwrap(np.angle(ph))   # m'' = 2 int rho/(x - z)^3; source A is the m' amplitude: also do m'
    A = np.array([quad(lambda u: 2 / (u * u - eps * np.exp(1j * th)) ** 2 + 2 / (-u * u - eps * np.exp(1j * th)) ** 2, eps) for th in TH])
    aA = np.unwrap(np.angle(-A))
    res = dict(rows=rows, K_closed=8 * math.sqrt(2) / (9 * math.pi), A_abs=float(abs(A[len(A) // 2]) * eps ** 1.5), A_closed=math.pi / math.sqrt(2),
               argA_rate=float(np.polyfit(TH, aA, 1)[0]), argA_at_pi2=float(aA[len(aA) // 2]), mpp_rate=float(np.polyfit(TH, a, 1)[0]))
    log(json.dumps({k: v for k, v in res.items() if k != 'rows'}))
    json.dump(res, open(os.path.join(OUT, 'c12_model.json'), 'w'), indent=1)

def tau_star(Zs, x, ys):
    """tau*(y) = y / (2 Im m(x + i y)), m(z) = sum 1/(zeta_k - z) over the complex point set Zs"""
    z = x + 1j * ys
    Im = (1.0 / (Zs[None, :] - z[:, None])).imag.sum(1)
    return ys / (2 * Im), Im

def tables():
    res = {}
    ys = np.geomspace(1e-3, 30.0, 500)
    for nm in ('ZETA', 'DH', 'HEAT--0.1', 'HEAT--0.5', 'TNR', 'EA-1_4'):
        try: on, off = zf.table(nm)
        except Exception as e: log(nm, 'table not available', repr(e)); continue
        if nm == 'EA-1_4': off = [(0.25, float(v)) for v in zf.table('ZETA')[0]]; on = np.array([])   # zeros of zeta(s+a)zeta(s-a), a = 1/4: 1/2 +- 1/4 + i gamma
        Zs = zf.full_set(on, off); real = np.array(on)
        hmax = 2000.0
        lo, hi = 100.0, hmax - 100.0
        rng = np.random.default_rng(1)
        r = dict(online=len(on), offline_pairs=len(off))
        # (i) real zeros only: monotone for every x (each term y -> 1/((x-g)^2+y^2) decreases)
        if len(real):
            bad = 0
            for x in rng.uniform(lo, hi, 300):
                t, Im = tau_star(real.astype(complex), x, ys); bad += int(np.any(np.diff(t) <= 0))
            r['real_only_nonmonotone_of_300'] = bad
        # (ii) full set: at distance d = c * b from each off-line pair
        if off:
            offg = np.array([g for b, g in off]); offb = np.array([b for b, g in off])
            sel = [(b, g) for b, g in off if lo < g < hi]
            out = {}
            for c in (0.0, 0.5, 1.0, 2.0, 3.0, 5.0, 10.0, 20.0):
                nonmono = 0; neg = 0; ymax_viol = 0.0; cnt = 0
                for b, g in sel:
                    x = g + c * b
                    yy = np.geomspace(1e-3 * b, 30.0, 600)
                    t, Im = tau_star(Zs, x, yy); cnt += 1
                    d = np.diff(t); v = (d <= 0) | (Im[1:] <= 0) | (Im[:-1] <= 0)
                    if v.any():
                        nonmono += 1; ymax_viol = max(ymax_viol, float((yy[1:][v] / b).max()))
                    neg += int((Im <= 0).any())
                out[str(c)] = dict(pairs=cnt, nonmonotone=nonmono, Imm_nonpositive=neg, max_y_over_b_of_violation=ymax_viol)
            r['by_offset_in_units_of_b'] = out
            # (iii) random x further than 5 b_max-local from every off-line pair
            bad = 0; tested = 0; badneg = 0; worst = None
            for x in rng.uniform(lo, hi, 1500):
                dist = np.abs(offg - x)
                if np.all(dist > 5 * offb):
                    t, Im = tau_star(Zs, x, ys); tested += 1
                    v = (np.diff(t) <= 0)
                    if v.any():
                        bad += 1; k = int(np.argmin(dist)); worst = (float(x), float(dist[k] / offb[k]), float(ys[1:][v].max()))
                    badneg += int((Im <= 0).any())
            r['far_points_tested'] = tested; r['far_points_nonmonotone'] = bad; r['far_points_Imm_nonpositive'] = badneg; r['far_example'] = worst
            # winding of arg(-m'') on arcs centred on the line at the off-line ordinate, radius c * b
            wind = {}
            for c in (0.5, 0.9, 1.1, 2.0):
                tots = []
                for b, g in sel[:200]:
                    zs = g + c * b * np.exp(1j * TH)
                    S3 = (1.0 / (Zs[None, :] - zs[:, None]) ** 3).sum(1)
                    a = np.unwrap(np.angle(-2 * S3)); tots.append((a[-1] - a[0]) / (TH[-1] - TH[0]))
                wind[str(c)] = dict(median_rate=float(np.median(tots)), min=float(np.min(tots)), max=float(np.max(tots)))
            r['winding_rate_on_arcs_radius_c_b_centred_below_offline_zero'] = wind
        # winding on arcs of radius y_N around real zeros / midpoints that enclose no zero: N = number of real zeros
        if len(real) > 10:
            N = len(real); y = math.sqrt(2 * math.pi / N); gg = np.diff(real); mids = 0.5 * (real[1:] + real[:-1])
            okm = gg > 2.5 * y
            rates = []
            for xm in mids[okm][:400]:
                zs = xm + y * np.exp(1j * TH); S3 = (1.0 / (Zs[None, :] - zs[:, None]) ** 3).sum(1)
                a = np.unwrap(np.angle(-2 * S3)); rates.append((a[-1] - a[0]) / (TH[-1] - TH[0]))
            r['winding_rate_midpoint_arcs_enclosing_no_zero'] = dict(n=len(rates), median=float(np.median(rates)), min=float(np.min(rates)), max=float(np.max(rates)), y_N=y)
        res[nm] = r; log(nm, json.dumps(r))
    json.dump(res, open(os.path.join(OUT, 'c12_tables.json'), 'w'), indent=1)

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'model': model()
    elif cmd == 'list': do_list(sys.argv[2], int(float(sys.argv[3])) if len(sys.argv) > 3 else None)
    elif cmd == 'tables': tables()
