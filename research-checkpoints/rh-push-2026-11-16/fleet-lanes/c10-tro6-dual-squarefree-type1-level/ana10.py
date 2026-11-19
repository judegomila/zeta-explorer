"""ana10.py -- statistics for lane c10 from acc10.py output (see PREREG.md for the definitions and the decision rule).
Usage: python ana10.py a acc_a.npz table.npz out.json   |   python ana10.py b acc_b.npz table.npz out.json
"""
import sys, os, math, json
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zomega as Z, alib as A
SEED = 20261118

def thin_flags(pq_sorted, b=0.9):
    """floor rule of c4-thin-twist-control-78: flip the next prime while count + 1 <= (1/2) int_2^N t^(b-1)/log t dt."""
    ts = np.linspace(2, float(pq_sorted[-1]), 400000)
    cum = np.concatenate([[0], np.cumsum((ts[1:] ** (b - 1) / np.log(ts[1:]) + ts[:-1] ** (b - 1) / np.log(ts[:-1])) / 2 * np.diff(ts))])
    target = 0.5 * np.interp(pq_sorted.astype(float), ts, cum)
    flips = np.zeros(len(pq_sorted), dtype=bool); cnt = 0
    for i in range(len(pq_sorted)):
        if cnt + 1 <= target[i]:
            flips[i] = True; cnt += 1
    return flips

def slope(x, y):
    x = np.asarray(x, float); y = np.asarray(y, float)
    if len(x) < 3 or (y <= 0).any(): return None
    return float(np.polyfit(np.log(x), np.log(y), 1)[0])

def stats(t0, t1, cell, ncell, rng, mu_outer=None):
    """t0, t1: (outer, comps) arrays for the two estimator halves, outer sign already included; cell: cell id per outer term (or None = one cell)."""
    t = t0 + t1
    if cell is None:
        S = t.sum(0)[None]; S0 = t0.sum(0)[None]; S1 = t1.sum(0)[None]
    else:
        S = np.zeros((ncell, t.shape[1]), complex); S0 = S.copy(); S1 = S.copy()
        np.add.at(S, cell, t); np.add.at(S0, cell, t0); np.add.at(S1, cell, t1)
    D = (np.abs(t) ** 2).sum(); xD = (t0 * np.conj(t1)).real.sum()
    tot = (np.abs(S) ** 2).sum(); xt = (S0 * np.conj(S1)).real.sum()
    ctrl = []
    for _ in range(20):
        eps = rng.choice([-1.0, 1.0], t.shape[0])[:, None]
        if cell is None: Sc = (eps * t).sum(0)[None]
        else:
            Sc = np.zeros_like(S); np.add.at(Sc, cell, eps * t)
        ctrl.append(math.sqrt((np.abs(Sc) ** 2).sum() / D))
    return {'r2': math.sqrt(tot / D), 'x2': float(xt / xD) if xD != 0 else None, 'D': float(D), 'xD': float(xD), 'tot': float(tot),
            'r2_randsign_mean': float(np.mean(ctrl)), 'r2_randsign_sd': float(np.std(ctrl))}

def fits(series, xs, minpts=3):
    out = {}
    names = list(series.keys())
    for nm in names:
        f = {}
        for key in ('r2', 'r2_randsign_mean', 'D', 'x2'):
            ys = [v[key] for v in series[nm]]
            f[key] = slope(xs, ys) if all(y is not None for y in ys) else None
        out[nm] = f
    # level statistic L = D(theta) / mean D(randphase)
    rp = [n for n in names if n.startswith('randphase')]
    for nm in names:
        ref = ['cubicrows_rp'] if nm.startswith('cubicrows') else rp
        Ls = [series[nm][i]['D'] / np.mean([series[r][i]['D'] for r in ref]) for i in range(len(xs))]
        out[nm]['L'] = slope(xs, Ls); out[nm]['L_values'] = [float(v) for v in Ls]
    seeds = [n for n in names if n.startswith('randphase') or n.startswith('randmult')]
    dec = {}
    for key in ('r2', 'L'):
        sv = [out[n][key] for n in seeds]
        th = out['theta'][key]
        dec[key] = {'theta': th, 'seed_mean': float(np.mean(sv)), 'seed_min': float(np.min(sv)), 'seed_max': float(np.max(sv)), 'seed_sd': float(np.std(sv)),
                    'diff': th - float(np.mean(sv)), 'saving': bool(th - np.mean(sv) < -0.02 and th < np.min(sv)),
                    'excess': bool(th - np.mean(sv) > 0.02 and th > np.max(sv))}
    out['_decision'] = dec
    return out

def node_primes(T, idx):
    res = []
    par = T.parent; last = T.last
    for i in idx.tolist():
        ps = []
        while i > 0:
            ps.append(int(last[i])); i = int(par[i])
        res.append(ps)
    return res

def main_a():
    accp, tabp, outp = sys.argv[2:5]
    d = np.load(accp); T = A.SFTable(tabp)
    idx = d['idx']; M = float(d['M']); X = int(d['X']); r6 = d['r6']; r3 = d['r3']
    nn = len(idx); N = T.N[idx].astype(float)
    na = T.na[idx]; nb = T.nb[idx]
    pos = {(int(x), int(y)): j for j, (x, y) in enumerate(zip(na.tolist(), nb.tolist()))}
    cz = na + nb * Z.to_c((0, 1)); alpha = cz / np.abs(cz)
    Gv = T.G()[idx]; mu = T.mu[idx].astype(float)
    wgt = mu * alpha ** 2 * Gv / np.sqrt(N)
    cellc = T.m4[idx].astype(np.int64) * 9 + T.m9[idx].astype(np.int64)
    pr = node_primes(T, idx)
    rng = np.random.default_rng(SEED)
    used = np.unique(np.concatenate([np.array(p, dtype=np.int64) for p in pr if p]))
    used = used[np.argsort(T.pq[used], kind='stable')]
    thin = dict(zip(used.tolist(), thin_flags(T.pq[used]).tolist()))
    def msign(sg): return np.array([np.prod([sg[p] for p in ps]) if ps else 1.0 for ps in pr])
    tw = {'theta': None, 'liouville': mu, 'thin': msign({p: (-1.0 if thin[p] else 1.0) for p in used.tolist()})}
    for k in range(3):
        tw[f'randmult{k}'] = msign(dict(zip(used.tolist(), rng.choice([-1.0, 1.0], len(used)).tolist())))
        tw[f'randphase{k}'] = np.exp(2j * np.pi * rng.random(nn))
    res = {'X': X, 'M': M, 'rows': nn, 'thin_flipped': int(sum(thin.values())), 'primes': len(used), 'geom': {}}
    # estimator quality by index norm
    q = []
    for lo, hi in ((1, 1e3), (1e3, 1e4), (1e4, 3e4), (3e4, 1e5), (1e5, 3e5)):
        s = (N > lo) & (N <= hi)
        if s.sum() < 50: continue
        h0 = r6[s][:, 0, :12]; h1 = r6[s][:, 0, 12:]
        q.append({'N_range': [lo, hi], 'rows': int(s.sum()), 'split_half_corr': float(np.abs((h0 * np.conj(h1)).sum()) / math.sqrt((np.abs(h0) ** 2).sum() * (np.abs(h1) ** 2).sum())),
                  'mean_abs2': float((np.abs(h0 + h1) ** 2).mean())})
    res['estimator_quality_u_lambda'] = q
    order = np.arange(nn)                                   # idx is sorted by N
    for th_name, th in (('2/9', 2 / 9), ('1/3', 1 / 3)):
        for ui, uname in ((0, 'lambda'), (1, 'y0'), (2, 'one')):
            if uname != 'lambda' and th_name == '1/2': continue
            series = {}; xs = []; pts = []
            for j in range(12):
                Mj = M / 2 ** j; C = Mj ** (1 - th); S = Mj ** th
                cs = np.flatnonzero((N > C / 2) & (N <= C))
                if len(cs) < 100: break
                ci = []; ni = []
                for c in cs.tolist():
                    smax = S * N[c] / C
                    ns = int(np.searchsorted(N, smax, side='right'))
                    ca, cb = int(na[c]), int(nb[c])
                    for s in range(ns):
                        sa, sb = int(na[s]), int(nb[s])
                        p = pos.get((ca * sa - cb * sb, ca * sb + cb * sa - cb * sb))
                        if p is not None:
                            ci.append(c); ni.append(p)
                ci = np.array(ci); ni = np.array(ni)
                cmap = np.full(nn, -1); cmap[cs] = np.arange(len(cs)); co = cmap[ci]
                pt = {'j': j, 'M_j': Mj, 'C': C, 'S': S, 'conductors': int(len(cs)), 'pairs': int(len(ci)), 'distinct_n': int(len(np.unique(ni))), 'var': {}}
                def tsum(rows):                             # rows: (nn, 24) -> t (len(cs), 24), outer weight included
                    t = np.zeros((len(cs), 24), complex); np.add.at(t, co, rows[ni]); return t * wgt[cs][:, None]
                variants = dict(tw); variants['cubicrows'] = 'cubic'; variants['cubicrows_rp'] = 'cubic_rp'; variants['nomu'] = 'nomu'; variants['plain_weight'] = 'plain'
                for nm, v in variants.items():
                    base = r3 if isinstance(v, str) and v.startswith('cubic') else r6[:, ui]
                    rows = base if (v is None or isinstance(v, str)) else base * v[:, None]
                    if isinstance(v, str) and v == 'cubic_rp': rows = rows * tw['randphase0'][:, None]
                    t = tsum(rows)
                    if isinstance(v, str) and v == 'nomu': t = t * mu[cs][:, None]
                    if isinstance(v, str) and v == 'plain': t = t / (mu * alpha ** 2 * Gv)[cs][:, None]      # weight N(c)^(-1/2) only (first-moment control)
                    st = stats(np.concatenate([t[:, :12]], 1), t[:, 12:], cellc[cs], 108, rng)
                    pt['var'][nm] = st; series.setdefault(nm, []).append(st)
                xs.append(Mj); pts.append(pt)
            if len(xs) < 3: continue
            f = fits(series, xs)
            res['geom'][f'theta={th_name},u={uname}'] = {'points': pts, 'fits': f}
            dd = f['_decision']
            print(f"[a] X={X:.0e} theta={th_name} u={uname}: points {len(xs)} (M_j {xs[-1]:.0f}..{xs[0]:.0f}, c {pts[-1]['conductors']}..{pts[0]['conductors']}, pairs {pts[-1]['pairs']}..{pts[0]['pairs']})")
            print("     r2 along path (theta rows): " + ' '.join(f"{p['var']['theta']['r2']:.3f}" for p in pts) + " | randphase0: " + ' '.join(f"{p['var']['randphase0']['r2']:.3f}" for p in pts))
            for key in ('r2', 'L'):
                x = dd[key]
                print(f"     exponent {key}: theta {x['theta']:+.4f}; seeds mean {x['seed_mean']:+.4f} sd {x['seed_sd']:.4f} [{x['seed_min']:+.4f}, {x['seed_max']:+.4f}]; diff {x['diff']:+.4f}; saving {x['saving']}; excess {x['excess']}")
            print("     other rows, exponent r2 / L: " + '; '.join(f"{n} {f[n]['r2']:+.4f} / {f[n]['L']:+.4f}" for n in ('liouville', 'thin', 'cubicrows', 'nomu', 'plain_weight')) +
                  f"; random signs on c (theta rows): mean r2 {np.mean([p['var']['theta']['r2_randsign_mean'] for p in pts]):.3f}; x2 theta: " + ' '.join(f"{p['var']['theta']['x2']:.2f}" for p in pts))
            print("     L values theta: " + ' '.join(f"{v:.3f}" for v in f['theta']['L_values']) + " | liouville: " + ' '.join(f"{v:.3f}" for v in f['liouville']['L_values']) + " | cubicrows: " + ' '.join(f"{v:.3f}" for v in f['cubicrows']['L_values']) + " | plain weight r2: " + ' '.join(f"{p['var']['plain_weight']['r2']:.2f}" for p in pts), flush=True)
    json.dump(res, open(outp, 'w'), indent=1)

def factor_rows(rows, T):
    pa, pb, pp, pq = T.pa, T.pb, T.pp, T.pq
    Qm = int(rows[:, 0].max()); keep = np.flatnonzero(pq <= Qm); byp = {}
    for i in keep: byp.setdefault(int(pp[i]), []).append(int(i))
    out = []
    for n, a, b in rows.tolist():
        x = (a, b); f = {}; t = n; d = 5; ps = []
        while d * d <= t:
            if t % d == 0:
                ps.append(d)
                while t % d == 0: t //= d
            d += 2
        if t > 1: ps.append(t)
        for p in ps:
            for i in byp[p]:
                pi = (int(pa[i]), int(pb[i]))
                while Z.divides(pi, x):
                    x = Z.exact_div(x, pi); f[i] = f.get(i, 0) + 1
        assert x == (1, 0), (n, a, b, x)
        out.append(f)
    return out, keep

def main_b():
    accp, tabp, outp = sys.argv[2:5]
    d = np.load(accp); T = A.SFTable(tabp)
    X = int(d['X']); NB = int(d['NB']); rows = d['rows']; r6 = d['r6']; r3 = d['r3']
    levN = d['levN'].astype(float); levmu = d['levmu'].astype(float); Qi = d['Qi']
    nr = len(rows); Nrow = rows[:, 0]
    fac, keep = factor_rows(rows, T)
    rng = np.random.default_rng(SEED + 1)
    order = keep[np.argsort(T.pq[keep], kind='stable')]
    thin = dict(zip(order.tolist(), thin_flags(T.pq[order]).tolist()))
    def msign(sg): return np.array([np.prod([sg[i] ** e for i, e in f.items()]) if f else 1.0 for f in fac])
    Om = np.array([sum(f.values()) for f in fac])
    tw = {'theta': None, 'liouville': (-1.0) ** Om, 'thin': msign({i: (-1.0 if thin[i] else 1.0) for i in order.tolist()})}
    for k in range(3):
        tw[f'randmult{k}'] = msign(dict(zip(order.tolist(), rng.choice([-1.0, 1.0], len(order)).tolist())))
        tw[f'randphase{k}'] = np.exp(2j * np.pi * rng.random(nr))
    res = {'X': X, 'rows': nr, 'levels': int(len(levN)), 'thin_flipped': int(sum(thin.values())), 'primes': len(order), 'range': {}}
    for kap in (0.4, 0.5, 0.6):
        series = {}; xs = []; pts = []
        for i in range(NB):
            Q = float(Qi[i])
            if Q < 600: continue
            Ai = d[f'A{i}'].astype(np.complex128)                    # rows <= Q, levels, 12
            nrow = Ai.shape[0]; assert nrow == int((Nrow <= Q).sum())
            ls = np.flatnonzero((levN[:Ai.shape[1]] > 1) & (levN[:Ai.shape[1]] <= Q ** kap))
            if len(ls) < 4: continue
            pt = {'i': i, 'Q': Q, 'rows': nrow, 'levels': int(len(ls)), 'maxN_level': float(levN[ls].max()), 'var': {}}
            variants = dict(tw); variants['cubicrows'] = 'cubic'; variants['cubicrows_rp'] = 'cubic_rp'; variants['nomu_levels'] = 'nomu'; variants['planted10'] = 'plant'
            Al = Ai[:, ls, :]
            for nm, v in variants.items():
                base = r3[:nrow] if isinstance(v, str) and v.startswith('cubic') else r6[:nrow]
                rr = base if (v is None or isinstance(v, str)) else base * v[:nrow, None]
                if isinstance(v, str) and v == 'cubic_rp': rr = rr * tw['randphase0'][:nrow, None]
                if isinstance(v, str) and v == 'plant':                      # 10% (in l2) of the rows replaced by the direction aligned with the signed level sum
                    vv = np.conj((Al * levmu[ls][None, :, None]).sum((1, 2)))
                    rr = rr + 0.1 * math.sqrt((np.abs(rr) ** 2).sum() / 24) / math.sqrt((np.abs(vv) ** 2).sum()) * vv[:, None]
                sgn = np.ones(len(ls)) if (isinstance(v, str) and v == 'nomu') else levmu[ls]
                th = []
                for h in (0, 1):
                    t = np.einsum('ms,maf->asf', rr[:, h * 12:(h + 1) * 12], Al).reshape(len(ls), 144)
                    th.append(t * sgn[:, None])
                st = stats(th[0], th[1], None, 1, rng)
                if nm == 'theta':
                    full = np.einsum('ms,mf->sf', rr[:, :12] + rr[:, 12:], Ai[:, 0, :])
                    cs = ((np.abs(rr[:, :12] + rr[:, 12:]) ** 2).sum(0)[:, None] * (np.abs(Ai[:, 0, :]) ** 2).sum(0)[None, :]).sum()
                    st['full_form_frac_CS'] = float((np.abs(full) ** 2).sum() / cs)
                    st['typeI_over_full'] = float(st['tot'] / (np.abs(full) ** 2).sum())
                pt['var'][nm] = st; series.setdefault(nm, []).append(st)
            xs.append(Q); pts.append(pt)
        if len(xs) < 3:
            print(f"[b] X={X:.0e} levels <= Q^{kap}: fewer than 3 path points"); continue
        f = fits(series, xs)
        res['range'][f'kappa={kap}'] = {'points': pts, 'fits': f}
        dd = f['_decision']
        print(f"[b] X={X:.0e} levels N(a) <= Q^{kap}: points {len(xs)} (Q {xs[-1]:.0f}..{xs[0]:.0f}, levels {pts[-1]['levels']}..{pts[0]['levels']})")
        print("     r2 along path (theta rows): " + ' '.join(f"{p['var']['theta']['r2']:.3f}" for p in pts) + " | randphase0: " + ' '.join(f"{p['var']['randphase0']['r2']:.3f}" for p in pts)
              + " | random signs on levels: " + ' '.join(f"{p['var']['theta']['r2_randsign_mean']:.3f}" for p in pts))
        for key in ('r2', 'L'):
            x = dd[key]
            print(f"     exponent {key}: theta {x['theta']:+.4f}; seeds mean {x['seed_mean']:+.4f} sd {x['seed_sd']:.4f} [{x['seed_min']:+.4f}, {x['seed_max']:+.4f}]; diff {x['diff']:+.4f}; saving {x['saving']}; excess {x['excess']}")
        print("     other rows, exponent r2 / L: " + '; '.join(f"{n} {f[n]['r2']:+.4f} / {f[n]['L']:+.4f}" for n in ('liouville', 'thin', 'cubicrows', 'nomu_levels', 'planted10')) + ' | planted r2: ' + ' '.join(f"{p['var']['planted10']['r2']:.2f}" for p in pts))
        print("     L values theta: " + ' '.join(f"{v:.3f}" for v in f['theta']['L_values']) + " | x2 theta: " + ' '.join(f"{p['var']['theta']['x2']:.2f}" for p in pts)
              + " | full form / CS: " + ' '.join(f"{p['var']['theta']['full_form_frac_CS']:.5f}" for p in pts), flush=True)
    json.dump(res, open(outp, 'w'), indent=1)

if __name__ == '__main__':
    (main_a if sys.argv[1] == 'a' else main_b)()
