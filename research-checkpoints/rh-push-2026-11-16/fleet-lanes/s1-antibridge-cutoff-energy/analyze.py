"""s1-antibridge-cutoff-energy: statistics of an exact line scan (linescan.py output).
(3) w_h(t) = Re(F'/F)(h+it)/h  [= W_h(t)/(h |F|^2) = (E_+ - E_-)/|F|^2], h in HS;  (4) Laguerre form
lag(t) = (h'^2 - h h'')/h^2 = R2 + L0i^2, normalised lag_norm = lag/(L0i^2 + |R2|) in [-1, 1]; zero counts per Gram and
half-Gram interval.  Negative samples are matched against the off-line zeros of the object:
theorem (RESULT.md): lag(t) < 0 only if |t - gamma| < d for an off-line zero d + i gamma; w_h(t) < 0 only if
(t - gamma)^2 + h^2 < d^2.
Usage: analyze.py scan.npz out.json [Tcap]"""
import sys, json, math
import numpy as np
from flint import acb, arb, ctx
import flib
PI = math.pi

def offline_table(obj, T):
    """list of (d, gamma): off-line zeros d + i gamma of F with d > 0, gamma > 0"""
    if obj == 'DH':
        z = json.load(open('data/zeros_DH.json'))
        return [(float(b) - 0.5, float(g)) for b, g, _ in z['offline']], float(z['H'])
    if obj == 'HEAT':
        z = json.load(open('data/zeros_HEAT--0.5.json'))
        return [(float(o[0]), float(o[1])) for o in z['offline']], float(z['H'])
    if obj == 'EA':
        ctx.prec = 64; out = []; n = 1
        while True:
            g = float(acb.zeta_zero(n).imag)
            if g > T + 2: break
            out.append((0.25, g)); n += 1
        return out, T + 2
    if obj == 'TNR':
        b = float(flib.OBJ['TNR'].b()); l3 = math.log(3)
        return [(b, (2 * k + 1) * PI / l3) for k in range(int(T * l3 / (2 * PI)) + 2)], T + 2
    return [], float('inf')

def newton_offline(obj, t):
    """search an off-line zero near height t (exact evaluator); returns (d, gamma) or None"""
    o = flib.OBJ[obj]; ctx.prec = 128
    best = None
    for d0 in (0.1, 0.25, 0.4):
        z = acb(d0, t)
        try:
            for _ in range(60):
                c = o.taylor(z, 2); dz = c[0] / c[1]
                z = acb(z.real.mid() - dz.real.mid(), z.imag.mid() - dz.imag.mid())
                if float(abs(dz).mid()) < 1e-25: break
        except Exception: continue
        d, g = abs(float(z.real)), float(z.imag)
        if d > 1e-9 and abs(g - t) < 1.5 and float(abs(dz).mid()) < 1e-20:
            if best is None or abs(g - t) < abs(best[1] - t): best = (d, g)
    return best

def intervals(mask, t):
    idx = np.nonzero(mask)[0]
    if idx.size == 0: return []
    br = np.nonzero(np.diff(idx) > 1)[0]
    st = np.concatenate([[idx[0]], idx[br + 1]]); en = np.concatenate([idx[br], [idx[-1]]])
    return [(float(t[a]), float(t[b]), int(b - a + 1)) for a, b in zip(st, en)]

def main(path, outp, Tcap=None):
    D = np.load(path); obj = str(D['obj']); t = D['t']; dt = float(D['dt'])
    if Tcap: 
        m = t <= Tcap
    else: m = np.ones_like(t, bool)
    t = t[m]; L0i = D['L0i'][m]; R2 = D['R2'][m]; la = D['logabs'][m]; sg = D['sgn'][m]; th = D['theta'][m]; Lr = D['Lh_re'][m]; HS = D['HS']
    T = float(t[-1])
    res = dict(obj=obj, T=T, dt=dt, points=int(t.size))
    tab, Htab = offline_table(obj, T)
    tabg = np.array([g for _, g in tab]); tabd = np.array([d for d, _ in tab])
    res['offline_pairs_in_table_below_T'] = int((tabg <= T).sum()) if tab else 0
    res['first_offline'] = [float(tabd[0]), float(tabg[0])] if tab else None
    dens = 0.5 * np.log(np.maximum(t, 7.0) / (2 * PI) * {'CHI4': 4, 'DH': 5}.get(obj, 1))
    if obj == 'EA': dens = 2 * dens
    def match(tn, h):
        """for negative samples tn: fraction inside the half-disk (t-gamma)^2 + h^2 < d^2 of a tabulated or located off-line zero"""
        if tn.size == 0: return dict(n=0)
        ok = np.zeros(tn.size, bool); worst = 0.0; located = []
        if tab:
            j = np.searchsorted(tabg, tn)
            for dj in (-2, -1, 0, 1):
                jj = np.clip(j + dj, 0, len(tabg) - 1)
                ok |= (tn - tabg[jj]) ** 2 + h * h < tabd[jj] ** 2
        bad = np.nonzero(~ok)[0]
        if bad.size and obj in flib.OBJ:
            cache = []
            for i in bad:
                hit = None
                for (d, g) in cache:
                    if (tn[i] - g) ** 2 + h * h < d * d: hit = (d, g); break
                if hit is None:
                    z = newton_offline(obj, float(tn[i]))
                    if z is not None:
                        cache.append(z)
                        if (tn[i] - z[1]) ** 2 + h * h < z[0] ** 2: hit = z
                if hit is not None: ok[i] = True
            located = cache
        return dict(n=int(tn.size), inside_half_disk=int(ok.sum()), outside=int((~ok).sum()), first_negative_t=float(tn[0]),
                    outside_examples=[float(x) for x in tn[~ok][:5]], zeros_located_by_newton=len(located))
    # ---- (4) Laguerre ----
    lag = R2 + L0i ** 2
    ln = lag / (L0i ** 2 + np.abs(R2) + 1e-300)
    lr = lag / dens ** 2
    s0 = t > 8.0
    i = np.argmin(np.where(s0, ln, 9)); k = np.argmin(np.where(s0, lr, 1e9))
    neg = (lag < 0)
    res['laguerre'] = dict(norm_min=float(ln[i]), norm_min_t=float(t[i]), rho_min=float(lr[k]), rho_min_t=float(t[k]),
                           negative_samples=int(neg.sum()), negative_intervals=len(intervals(neg, t)), first_negative_intervals=intervals(neg, t)[:5],
                           match=match(t[neg], 0.0))
    if tab:
        # how many tabulated off-line pairs are seen by the Laguerre form (a negative sample within d of the foot)
        seen = 0; tn = t[neg]
        inT = [(d, g) for d, g in tab if g <= min(T, Htab) - 1]
        for d, g in inT:
            if tn.size and np.any(np.abs(tn - g) < d): seen += 1
        res['laguerre']['offline_pairs_seen'] = seen; res['laguerre']['offline_pairs_total'] = len(inT)
    # ---- (3) W_h/h ----
    res['w'] = []
    for kk, h in enumerate(HS):
        w = Lr[:, kk] / h
        wn = w / dens ** 2
        i = np.argmin(np.where(s0, wn, 1e9)); neg = w < 0
        e = dict(h=float(h), a=float(2 * h), norm_min=float(wn[i]), norm_min_t=float(t[i]), negative_samples=int(neg.sum()),
                 first_negative_intervals=intervals(neg, t)[:5], match=match(t[neg], float(h)))
        if tab:
            seen = 0; tn = t[neg]
            inT = [(d, g) for d, g in tab if g <= min(T, Htab) - 1]
            for d, g in inT:
                if tn.size and np.any((tn - g) ** 2 + h * h < d * d): seen += 1
            e['offline_pairs_seen'] = seen; e['offline_pairs_total'] = len(inT); e['pairs_with_d_gt_h'] = int(sum(1 for d, g in inT if d > h))
        res['w'].append(e)
    # ---- zeros, Gram and half-Gram intervals ----
    f0 = sg[:-1]; f1 = sg[1:] * np.exp(np.clip(la[1:] - la[:-1], -700, 700))        # values scaled by |F(t_i)|
    d0 = -L0i[:-1] * f0 * dt; d1 = -L0i[1:] * f1 * dt                                 # h' = -L0i h
    sc = f0 * f1 < 0
    i = np.nonzero(sc)[0]
    z0, z1, e0, e1 = f0[i], f1[i], d0[i], d1[i]
    s = z0 / (z0 - z1)
    for _ in range(6):
        s2 = s * s; s3 = s2 * s
        p = (2 * s3 - 3 * s2 + 1) * z0 + (s3 - 2 * s2 + s) * e0 + (-2 * s3 + 3 * s2) * z1 + (s3 - s2) * e1
        dp = (6 * s2 - 6 * s) * z0 + (3 * s2 - 4 * s + 1) * e0 + (-6 * s2 + 6 * s) * z1 + (3 * s2 - 2 * s) * e1
        s = np.clip(s - p / np.where(dp == 0, 1.0, dp), 0, 1)
    tz = t[i] + s * dt
    hpp = -R2[:-1] * f0                                                               # h'' = -R2 h
    same = (f0 * f1 > 0) & (f0 * d0 < 0) & (f1 * d1 > 0)
    j = np.nonzero(same)[0]
    text = -(d0[j] / dt) / np.where(hpp[j] == 0, 1.0, hpp[j]); zext = f0[j] - 0.5 * (d0[j] / dt) ** 2 / np.where(hpp[j] == 0, 1.0, hpp[j])
    pr = (text > 0) & (text < dt) & (zext * f0[j] < 0)
    tp = t[j[pr]] + text[pr]
    zeros = np.sort(np.concatenate([tz, tp, tp]))
    res['online_zeros'] = int(zeros.size); res['close_pairs'] = int(pr.sum())
    np.save(outp.replace('.json', '_zeros.npy'), zeros)
    if obj in ('ZETA', 'CHI4', 'DH', 'TNR'):
        thz = np.interp(zeros, t, th)
        tmin = t[np.argmin(th)]
        def census(off, cap=None):
            idx = np.floor(thz / PI - off).astype(int)
            ok = zeros > tmin
            lo = 0; hi = int(math.floor(th[-1] / PI - off)) - 1
            c = np.bincount(idx[ok & (idx >= lo) & (idx <= hi)] - lo, minlength=hi - lo + 1)
            if cap: c = c[:cap]
            first = int(np.nonzero(c != 1)[0][0]) if np.any(c != 1) else None
            out = dict(intervals=int(c.size), violations=int((c != 1).sum()), fraction=float((c != 1).mean()), empty=int((c == 0).sum()),
                       two=int((c == 2).sum()), three_plus=int((c >= 3).sum()), first_violation_index=first)
            if first is not None:
                out['first_violation_interval'] = [float(np.interp((first + off) * PI, th[t > tmin], t[t > tmin])), float(np.interp((first + 1 + off) * PI, th[t > tmin], t[t > tmin]))]
            nq = 8; ed = np.linspace(0, c.size, nq + 1).astype(int)
            out['octile_fractions'] = [float((c[ed[q]:ed[q + 1]] != 1).mean()) for q in range(nq)]
            return out
        res['half_gram'] = census(0.5); res['gram'] = census(0.0)
        if obj == 'ZETA':
            res['half_gram_first_302'] = census(0.5, 302); res['gram_first_302'] = census(0.0, 302)
        res['count_check'] = dict(online_zeros=int(zeros.size), theta_T_over_pi_plus_1=float(th[-1] / PI + 1))
    json.dump(res, open(outp, 'w'), indent=1)
    print(json.dumps(res, indent=1)[:6000])

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], float(sys.argv[3]) if len(sys.argv) > 3 else None)
