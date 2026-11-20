"""istrat_ana.py -- inter-stratum statistics from istrat_acc.py output (lane c9).

For path point j: Q_j = (Xc / 2^j)^(1/1.4), conductors in the octave (R_j/2, R_j], R_j = Q_j^1.4 = Xc/2^j.
Cells f = (sigma, class of c mod 4, class of c mod 9): 12 x 108.  Stratum = squarefull part kappa of the row m.
  B_kappa^f = sum_{m in kappa, N(m) <= Q_j} rho_sigma(m) A_m[f],   B^f = sum_kappa B_kappa^f.
  r2 = sqrt(sum_f |B^f|^2 / sum_f sum_kappa |B_kappa^f|^2)   (random-sign strata: expectation of the square = 1)
  r1 = sum_f |B^f| / sum_f sum_kappa |B_kappa^f|             (control: random signs on strata, measured)
  x2 = sum_f Re B^(1) conj B^(2) / sum_f sum_kappa Re B_kappa^(1) conj B_kappa^(2)  (two estimator halves: theta part only)
Usage: python istrat_ana.py acc.npz primes_table.npz out.json
"""
import sys, os, math, json
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zomega as Z

def factor_rows(rows, tab):
    pa, pb, pp, pq, pin = tab['pa'], tab['pb'], tab['pp'], tab['pq'], tab['pinert']
    Qm = int(rows[:, 0].max())
    keep = np.flatnonzero(pq <= Qm)
    byp = {}
    for i in keep:
        byp.setdefault(int(pp[i]), []).append(int(i))
    out = []
    for n, a, b in rows.tolist():
        x = (a, b); f = {}; nn = n; p = 3
        ps = []
        t = nn; d = 5
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
        assert Z.norm(x) == 1 and x == (1, 0), (n, a, b, x)
        out.append(f)
    return out, keep

def thin_set(pq_sorted, b=0.9):
    """floor rule: prime (by increasing norm) is flipped while count + 1 <= (1/2) int_2^N t^(b-1) dt / log t."""
    flips = []; cnt = 0
    for q in pq_sorted:
        ts = np.linspace(2, q, 4000); target = 0.5 * np.trapezoid(ts ** (b - 1) / np.log(ts), ts)
        if cnt + 1 <= target:
            flips.append(True); cnt += 1
        else:
            flips.append(False)
    return np.array(flips)

def main():
    accp, tabp, outp = sys.argv[1:4]
    d = np.load(accp); tab = np.load(tabp)
    X = int(d['X']); NB = int(d['NB']); rows = d['rows']; Xc = X / 4.0
    Aa, Ap, r6, r3 = d['Aa'], d['Ap'], d['r6'], d['r3']
    nr = len(rows)
    fac, keep = factor_rows(rows, tab)
    pq = tab['pq']
    # strata
    kid = {}; strat = np.zeros(nr, dtype=np.int64); kinfo = []
    Om = np.zeros(nr, dtype=np.int64)
    for r, f in enumerate(fac):
        key = tuple(sorted((i, e) for i, e in f.items() if e >= 2))
        if key not in kid:
            kid[key] = len(kid)
            kinfo.append({'key': [[int(pq[i]), int(e)] for i, e in key], 'N': int(np.prod([float(pq[i]) ** e for i, e in key])) if key else 1,
                          'maxe': max([e for _, e in key], default=1)})
        strat[r] = kid[key]; Om[r] = sum(f.values())
    K = len(kid)
    assert kinfo[strat[0]]['N'] == 1 and strat[0] == 0
    rng = np.random.default_rng(20261118)
    # multiplicative sign families on the primes that occur
    order = keep[np.argsort(pq[keep], kind='stable')]
    thin = dict(zip(order.tolist(), thin_set(pq[order].astype(float)).tolist()))
    def mult_sign(sgn):
        return np.array([np.prod([sgn[i] ** e for i, e in f.items()]) if f else 1.0 for f in fac])
    s_liou = (-1.0) ** Om
    s_thin = mult_sign({i: (-1.0 if thin[i] else 1.0) for i in order.tolist()})
    s_rm = [mult_sign(dict(zip(order.tolist(), rng.choice([-1.0, 1.0], len(order)).tolist()))) for _ in range(3)]
    s_rp = [np.exp(2j * np.pi * rng.random(nr)) for _ in range(3)]
    Nrow = rows[:, 0]
    res = {'X': X, 'NB': NB, 'rows': nr, 'strata': K, 'thin_flipped_primes': int(sum(thin.values())), 'primes': len(order), 'path': []}
    # estimator quality
    h0, h1 = r6[:, :12], r6[:, 12:]
    res['split_half_corr_r6'] = float(np.abs((h0 * np.conj(h1)).sum()) / math.sqrt((np.abs(h0) ** 2).sum() * (np.abs(h1) ** 2).sum()))
    c0, c1 = r3[:, :12], r3[:, 12:]
    res['split_half_corr_r3'] = float(np.abs((c0 * np.conj(c1)).sum()) / math.sqrt((np.abs(c0) ** 2).sum() * (np.abs(c1) ** 2).sum()))
    nboot = 200
    bidx = rng.integers(0, 12 * 108, size=(nboot, 12 * 108))
    series = {}
    def strata_B(rho, A, st, Kloc):
        B = np.zeros((Kloc, rho.shape[1], A.shape[1]), dtype=np.complex128)
        for k in range(Kloc):
            s = st == k
            if s.any():
                B[k] = rho[s].T @ A[s]
        return B
    for j in range(NB):
        Q = (Xc / 2 ** j) ** (1 / 1.4)
        sel = Nrow <= Q
        if sel.sum() < 100: continue
        st_full = strat[sel]
        used, st = np.unique(st_full, return_inverse=True); Kl = len(used)
        A_a = Aa[sel][:, j * 108:(j + 1) * 108].astype(np.complex128)
        A_p = Ap[sel][:, j * 108:(j + 1) * 108].astype(np.complex128)
        rh = [r6[sel][:, :12], r6[sel][:, 12:]]; rc = [r3[sel][:, :12], r3[sel][:, 12:]]
        pt = {'j': j, 'Q': Q, 'rows': int(sel.sum()), 'strata': int(Kl), 'conductors': int(d['counts'][j * 108:(j + 1) * 108].sum()), 'var': {}}
        variants = {'a': (A_a, rh, None), 'p_aligned': (A_p, rh, None),
                    'a_liouville': (A_a, rh, s_liou[sel]), 'a_thin': (A_a, rh, s_thin[sel]), 'a_cubicrows': (A_a, rc, None)}
        for t in range(3):
            variants[f'a_randmult{t}'] = (A_a, rh, s_rm[t][sel]); variants[f'a_randphase{t}'] = (A_a, rh, s_rp[t][sel])
        _, st_om = np.unique(Om[sel], return_inverse=True); K_om = int(st_om.max()) + 1
        variants['a_omega'] = (A_a, rh, None, 'om'); variants['a_omega_randphase'] = (A_a, rh, s_rp[0][sel], 'om')
        variants['p_omega'] = (A_p, rh, None, 'om')
        st_k, Kl_k = st, Kl
        for name, vv in variants.items():
            A, halves, sg = vv[:3]
            st, Kl = (st_om, K_om) if len(vv) > 3 else (st_k, Kl_k)
            if sg is not None:
                halves = [h * sg[:, None] for h in halves]
            B1 = strata_B(halves[0], A, st, Kl); B2 = strata_B(halves[1], A, st, Kl)
            B = B1 + B2
            tot_f = np.abs(B.sum(0)) ** 2; D_f = (np.abs(B) ** 2).sum(0)
            l1n_f = np.abs(B.sum(0)); l1d_f = np.abs(B).sum(0)
            x_tot_f = (B1.sum(0) * np.conj(B2.sum(0))).real; x_D_f = (B1 * np.conj(B2)).real.sum(0)
            # random-sign strata control
            r1c = []; r2c = []
            for _ in range(20):
                eps = rng.choice([-1.0, 1.0], Kl)
                Bs = np.tensordot(eps, B, axes=(0, 0))
                r1c.append(np.abs(Bs).sum() / l1d_f.sum()); r2c.append(math.sqrt((np.abs(Bs) ** 2).sum() / D_f.sum()))
            rho = halves[0] + halves[1]
            cs = ((np.abs(rho) ** 2).sum(0)[:, None] * (np.abs(A) ** 2).sum(0)[None, :]).sum()
            v = {'r2': math.sqrt(tot_f.sum() / D_f.sum()), 'r1': float(l1n_f.sum() / l1d_f.sum()),
                 'r1_ctrl': float(np.mean(r1c)), 'r1_ctrl_sd': float(np.std(r1c)), 'r2_ctrl': float(np.mean(r2c)), 'r2_ctrl_sd': float(np.std(r2c)),
                 'x2': float(x_tot_f.sum() / x_D_f.sum()), 'xD_over_D': float(4 * x_D_f.sum() / D_f.sum()),
                 'sqfree_share_D': float((np.abs(B[0]) ** 2).sum() / D_f.sum()), 'tot': float(tot_f.sum()), 'D': float(D_f.sum()), 'nstrata': int(Kl), 'frac_CS': float(tot_f.sum() / cs)}
            tf = tot_f.ravel(); Df = D_f.ravel(); ln = l1n_f.ravel(); ld = l1d_f.ravel(); xt = x_tot_f.ravel(); xd = x_D_f.ravel()
            v['boot'] = {'r2': np.sqrt(tf[bidx].sum(1) / Df[bidx].sum(1)).tolist(), 'r1': (ln[bidx].sum(1) / ld[bidx].sum(1)).tolist(),
                         'x2': (xt[bidx].sum(1) / xd[bidx].sum(1)).tolist()}
            v['r2_se'] = float(np.std(v['boot']['r2'])); v['r1_se'] = float(np.std(v['boot']['r1'])); v['x2_se'] = float(np.std(v['boot']['x2']))
            # relative sign of the low strata against the squarefree stratum
            if name in ('a', 'p_aligned', 'a_randphase0'):
                sh = (np.abs(B) ** 2).sum((1, 2)); top = np.argsort(-sh)[1:9]
                n0 = math.sqrt(sh[0])
                v['low_strata'] = [{'kappa': kinfo[used[k]]['key'], 'share_D': float(sh[k] / D_f.sum()),
                                    'corr_with_sqfree': [float((B[k] * np.conj(B[0])).sum().real / (n0 * math.sqrt(sh[k]))),
                                                         float((B[k] * np.conj(B[0])).sum().imag / (n0 * math.sqrt(sh[k])))]} for k in top]
                rest = B[1:].sum(0)
                v['rest_vs_sqfree'] = {'ratio_l2': float(math.sqrt((np.abs(rest) ** 2).sum() / sh[0])),
                                       'corr': float((rest * np.conj(B[0])).sum().real / (n0 * math.sqrt((np.abs(rest) ** 2).sum())))}
            if name == 'a':
                # sublattice sums Phi(j): rows divisible by j
                phi = []
                smallp = [i for i in order.tolist() if pq[i] <= 49][:8]
                idxsel = np.flatnonzero(sel)
                for i in smallp:
                    for e in (1, 2):
                        s = np.array([fac[r].get(i, 0) >= e for r in idxsel])
                        if s.sum() < 5: continue
                        Bj = rho[s].T @ A[s]
                        phi.append({'N_p': int(pq[i]), 'e': e, 'rows': int(s.sum()),
                                    'N(j)*|Phi(j)|^2/|Phi(1)|^2': float(float(pq[i]) ** e * (np.abs(Bj) ** 2).sum() / tot_f.sum())})
                v['sublattice'] = phi
            pt['var'][name] = v
            series.setdefault(name, []).append((Q, v))
        res['path'].append(pt)
        print(f"j={j} Q={Q:8.1f} rows={pt['rows']:6d} strata={pt['strata']:4d} cond={pt['conductors']:7d} | " +
              ' | '.join(f"{n}: r2={pt['var'][n]['r2']:.3f} r1={pt['var'][n]['r1']:.3f}/{pt['var'][n]['r1_ctrl']:.3f} x2={pt['var'][n]['x2']:.3f}" for n in ('a', 'p_aligned', 'a_randphase0', 'a_omega')), flush=True)
    # exponent fits over path points with Q >= 600
    fits = {}
    for name, ser in series.items():
        ser = [(Q, v) for Q, v in ser if Q >= 600]
        lq = np.log([Q for Q, _ in ser])
        f = {}
        for key in ('r2', 'r1', 'r1_ctrl', 'x2'):
            y = np.array([v[key] for _, v in ser])
            if (y <= 0).any():
                f[key] = None; continue
            sl = float(np.polyfit(lq, np.log(y), 1)[0])
            if key in ('r2', 'r1', 'x2'):
                bs = np.array([v['boot'][key] for _, v in ser])          # points x nboot (same cell resample at every point)
                ok = (bs > 0).all(0)
                sls = [np.polyfit(lq, np.log(bs[:, b]), 1)[0] for b in np.flatnonzero(ok)]
                f[key] = [sl, float(np.std(sls)) if len(sls) > 10 else None]
            else:
                f[key] = [sl, None]
        f['r1_minus_ctrl'] = f['r1'][0] - f['r1_ctrl'][0] if f['r1'] and f['r1_ctrl'] else None
        fits[name] = f
        print(f"fit {name:14s}: exponent r2 = {f['r2']}, r1 = {f['r1']}, r1 control = {f['r1_ctrl']}, r1 - control = {f['r1_minus_ctrl']}, x2 = {f['x2']}")
    for pt in res['path']:
        for v in pt['var'].values():
            v.pop('boot', None)
    res['fits'] = fits
    res['strata_info_first'] = kinfo[:40]
    json.dump(res, open(outp, 'w'), indent=1)

if __name__ == '__main__':
    main()
