"""Combination 3: per-site depth.  Every close pair k (unfolded gap < DTHR) is run backward to depth t = c g_k^2, c = 1/16, 1/8, 1/4
(a lone pair collides at g^2/8, so c = 1/8 is the pair's own collision time and c = 1/4 is past it; the pair is then a conjugate pair).
System: the pair, W zeros on each side as moving particles (they may collide and leave the axis: the three smallest disjoint gaps of the
system are carried in the regular (c, u) form), FARN further zeros on each side as a frozen linear field.
Statistic: m_k(c) = min over t in [0, c g_k^2] and over the two members and every other particle of |z_member(t) - y(t)|, in units of the local
mean spacing.  A collision of a member with a spectator inside the depth gives m_k = 0.  Static value: d_1/spacing at t = 0.
Also: transport coefficient of Lemma B (imp-35168): sup_x |Im M''|/|Im M| on Im z = y* against 2/y*^2, M(z) = sum 1/(z - x_k).
Usage: t3.py NAME LIST.npy Q PAR OUT.json [NMAX] [OFF.npz]      (OFF: off-line ordinates; pairs with one inside the moving range are flagged)"""
import sys, os, math, json, numpy as np, fk, flow
DTHR = 0.1; W = 8; FARN = 300; STEPS = 120
CS = (1 / 16, 1 / 8, 1 / 4)

def run_batch(g, idx, Q, par, T0G=0.0):
    """idx: indices l of the tracked pairs (l, l+1).  Returns dict of arrays."""
    B = len(idx); n = 2 * W + 2
    li = idx[:, None] + np.arange(-W, W + 2)[None, :]
    x0 = g[idx]; Z0 = g[li] - x0[:, None]
    fi = np.concatenate([idx[:, None] + np.arange(-W - FARN, -W)[None, :], idx[:, None] + np.arange(W + 2, W + 2 + FARN)[None, :]], axis=1)
    far = g[fi] - x0[:, None]
    F0 = np.empty((B, n)); F1 = np.empty((B, n))
    for j in range(n):
        D = Z0[:, j:j + 1] - far; F0[:, j] = -2 * (1 / D).sum(1); F1[:, j] = 2 * (1 / D ** 2).sum(1)
    gaps = np.diff(Z0, axis=1); gk = gaps[:, W].copy()
    # greedy: three smallest disjoint gaps per system
    gg = gaps.copy(); P = np.empty((B, 3, 2), np.int64); ar = np.arange(B)
    for r in range(3):
        l = gg.argmin(1); P[:, r, 0] = l; P[:, r, 1] = l + 1
        for o in (-1, 0, 1):
            j = np.clip(l + o, 0, n - 2); gg[ar, j] = np.inf
    F = flow.RegFlow(Z0, P, F0, F1)
    sp = 1 / fk.dens(x0 + T0G, Q, par)
    others = np.ones(n, bool); others[W] = False; others[W + 1] = False
    def mind(S):
        Z = F.positions(S)
        d = np.minimum(np.abs(Z[:, W:W + 1] - Z[:, others]).min(1), np.abs(Z[:, W + 1:W + 2] - Z[:, others]).min(1))
        return d
    # pairs made of one member and one spectator: a sign change of Re u there is a member-spectator collision
    mixed = ((P[:, :, 0] == W - 1) & (P[:, :, 1] == W)) | ((P[:, :, 0] == W + 1) & (P[:, :, 1] == W + 2))
    S = F.S; m = mind(S); static = m.copy(); hit = np.zeros(B, bool); out = {}; end = {}; tprev = np.zeros(B)
    u0 = S[:, F.ns + F.npair:].real.copy()
    for c in CS:
        tend = c * gk * gk; h = ((tend - tprev) / STEPS)[:, None]
        for _ in range(STEPS):
            S = F.rk4(h, S); m = np.minimum(m, mind(S))
            u1 = S[:, F.ns + F.npair:].real
            hit |= (mixed & (u0 > 0) & (u1 <= 0)).any(1)
        tprev = tend
        mm = np.where(hit, 0.0, m)
        out[c] = mm / sp; end[c] = mind(S) / sp
    bad = ~np.isfinite(S).all(1)
    return dict(static=static / sp, dyn=out, end=end, bad=bad, gk=gk, sp=sp, tracked_regular=(P[:, :, 0] == W).any(1), P=P, Z0=Z0, F0=F0, F1=F1)

def mp_recheck(Z0, P, F0, F1, gk, c, sp, steps=(150, 300), dps=60):
    """the same system in mpmath (RK4, two step counts); returns the minimal member-spectator distance / spacing for each step count"""
    import mpmath as mp
    mp.mp.dps = dps; n = len(Z0); P = [tuple(int(v) for v in p) for p in P]
    inpair = {i for p in P for i in p}; singles = [i for i in range(n) if i not in inpair]
    z0 = [mp.mpf(float(v)) for v in Z0]; f0 = [mp.mpf(float(v)) for v in F0]; f1 = [mp.mpf(float(v)) for v in F1]
    def pos(st):
        zs, cs, us = st; Z = [None] * n
        for k, i in enumerate(singles): Z[i] = zs[k]
        for k, (i, j) in enumerate(P):
            q = mp.sqrt(us[k]) / 2; Z[i] = cs[k] - q; Z[j] = cs[k] + q
        return Z
    cref = [(z0[i] + z0[j]) / 2 for i, j in P]
    def rhs(st):
        zs, cs, us = st; Z = pos(st); dz = []; dc = []; du = []
        for k, i in enumerate(singles):
            v = -2 * mp.fsum(1 / (Z[i] - Z[b]) for b in range(n) if b != i) + f0[i] + f1[i] * (Z[i] - z0[i]); dz.append(v)
        for k, (i, j) in enumerate(P):
            s1 = mp.mpc(0); s2 = mp.mpc(0)
            for b in range(n):
                if b in (i, j): continue
                D = cs[k] - Z[b]; den = D * D - us[k] / 4; s1 += D / den; s2 += 1 / den
            g0 = (f0[i] + f0[j]) / 2; g1 = (f1[i] + f1[j]) / 2
            dc.append(-2 * s1 + g0 + g1 * (cs[k] - cref[k])); du.append(-8 + 4 * us[k] * s2 + 2 * g1 * us[k])
        return (dz, dc, du)
    def add(st, k, h): return tuple([a + h * b for a, b in zip(x, y)] for x, y in zip(st, k))
    res = []
    for ns in steps:
        st = ([mp.mpc(z0[i]) for i in singles], [mp.mpc(c_) for c_ in cref], [mp.mpc((z0[j] - z0[i]) ** 2) for i, j in P])
        T = mp.mpf(c) * mp.mpf(float(gk)) ** 2; h = T / ns; mn = mp.inf; hit = False
        def md(st):
            Z = pos(st); return min(abs(Z[m] - Z[b]) for m in (W, W + 1) for b in range(n) if b not in (W, W + 1))
        mn = md(st)
        for _ in range(ns):
            k1 = rhs(st); k2 = rhs(add(st, k1, h / 2)); k3 = rhs(add(st, k2, h / 2)); k4 = rhs(add(st, k3, h))
            u_old = [mp.re(u) for u in st[2]]
            st = tuple([a + h / 6 * (b1 + 2 * b2 + 2 * b3 + b4) for a, b1, b2, b3, b4 in zip(x, y1, y2, y3, y4)] for x, y1, y2, y3, y4 in zip(st, k1, k2, k3, k4))
            for k, (i, j) in enumerate(P):
                if ((i, j) in ((W - 1, W), (W + 1, W + 2))) and u_old[k] > 0 and mp.re(st[2][k]) <= 0: hit = True
            mn = min(mn, md(st))
        res.append((0.0 if hit else float(mn / sp), float(md(st) / sp)))
    return res

def transport(g, N, Q, par):
    """sup over sample points of |Im M''|/|Im M| and of |Im(2 M M' + M'')|/|Im M| on Im z = y*, for the first N zeros; against 2/y*^2"""
    x = g[:N]; rows = []
    rng = np.random.default_rng(3); xs = np.sort(rng.uniform(x[N // 4], x[3 * N // 4], 600))
    sp = 1 / float(fk.dens(x[N // 2], Q, par))
    for ys in (0.5 * sp, sp, 2 * sp, 5.6):
        z = xs + 1j * ys; M = np.zeros(len(z), complex); M1 = np.zeros(len(z), complex); M2 = np.zeros(len(z), complex)
        for s0 in range(0, N, 20000):
            D = 1 / (z[:, None] - x[None, s0:s0 + 20000]); M += D.sum(1); M1 -= (D ** 2).sum(1); M2 += 2 * (D ** 3).sum(1)
        r1 = np.abs(M2.imag) / np.abs(M.imag); r2 = np.abs((2 * M * M1 + M2).imag) / np.abs(M.imag)
        rows.append(dict(N=N, y_star=ys, y_star_in_spacings=ys / sp, bound_2_over_y2=2 / ys ** 2, sup_ImM2_over_ImM=float(r1.max()), median_ImM2_over_ImM=float(np.median(r1)),
                         ratio_to_bound=float(r1.max() * ys ** 2 / 2), sup_full_rate=float(r2.max()), L_field_2N_over_y2=2 * N / ys ** 2,
                         measured_jacobian_sup=float((2 * np.abs(M1)).max())))
    return rows

if __name__ == '__main__':
    name, fn, Q, par, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
    NMAX = int(float(sys.argv[6])) if len(sys.argv) > 6 else 10 ** 9
    g = np.load(fn, mmap_mode='r'); T0G = 0.0; mf = fn.replace('.npy', '.meta.npy')
    if os.path.exists(mf) and g[0] < 1e6 and float(np.load(mf)[0]) >= 1e6: T0G = float(np.load(mf)[0])
    g = np.array(g[:NMAX + W + FARN + 2], dtype=np.float64); M = len(g)
    offg = np.sort(np.load(sys.argv[7])['offg']) if len(sys.argv) > 7 else None
    lo = W + FARN + 1; hi = M - W - FARN - 2; parts_i = []
    for s0 in range(lo, hi, 5000000):                       # unfolded gaps in chunks (memory)
        s1 = min(hi, s0 + 5000000); gg = g[s0:s1 + 1]
        du = np.diff(gg) * (np.log(Q * (0.5 * (gg[1:] + gg[:-1]) + T0G) / (2 * math.pi)) / (2 * math.pi))
        parts_i.append(np.nonzero(du < DTHR)[0] + s0)
    idx = np.concatenate(parts_i); del gg, du
    fk.log(name, 'zeros', M, 'close pairs', len(idx), 'planned memory per batch of 2000 about %.2f GB' % (2000 * (2 * W + 2) * (2 * FARN) * 8e-9 * 3))
    parts = {k: [] for k in ('static', 'bad', 'gk', 'sp', 'treg')}; dyn = {c: [] for c in CS}; endd = {c: [] for c in CS}; keep = []
    for s0 in range(0, len(idx), 2000):
        r = run_batch(g, idx[s0:s0 + 2000], Q, par, T0G)
        parts['static'].append(r['static']); parts['bad'].append(r['bad']); parts['gk'].append(r['gk']); parts['sp'].append(r['sp']); parts['treg'].append(r['tracked_regular'])
        for c in CS: dyn[c].append(r['dyn'][c]); endd[c].append(r['end'][c])
        # keep the systems with the smallest positive dynamic distance of this batch for the 60-digit recheck
        v = np.where(r['dyn'][CS[2]] > 0, r['dyn'][CS[2]], np.inf); j = int(np.argmin(v))
        keep.append((float(v[j]), int(idx[s0 + j]), r['Z0'][j].copy(), r['P'][j].copy(), r['F0'][j].copy(), r['F1'][j].copy(), float(r['gk'][j]), float(r['sp'][j])))
        if (s0 // 2000) % 20 == 0: fk.log(name, 'batch', s0, len(idx))
    static = np.concatenate(parts['static']); bad = np.concatenate(parts['bad']); gk = np.concatenate(parts['gk']); sp = np.concatenate(parts['sp']); treg = np.concatenate(parts['treg'])
    dyn = {c: np.concatenate(v) for c, v in dyn.items()}; endd = {c: np.concatenate(v) for c, v in endd.items()}
    flag_off = np.zeros(len(idx), bool)
    if offg is not None and len(offg):
        a = g[idx - W]; b = g[idx + 1 + W]; flag_off = np.searchsorted(offg, b) > np.searchsorted(offg, a)
    res = dict(name=name, n_zeros=M, DTHR=DTHR, W=W, FARN=FARN, STEPS=STEPS, close_pairs=len(idx), non_finite=int(bad.sum()), tracked_pair_not_local_minimum=int((~treg).sum()),
               pairs_with_offline_in_range=int(flag_off.sum()), rows=[])
    Ns = [N for N in (10 ** 4, 10 ** 5, 10 ** 6, 10 ** 7, 10 ** 8) if N <= M] or [M]
    if Ns[-1] < 0.5 * M: Ns.append(M)
    for N in Ns:
        for lab, msk in (('all', idx < N), ('no_offline_in_range', (idx < N) & ~flag_off)):
            if lab != 'all' and offg is None: continue
            if msk.sum() == 0: continue
            row = dict(N=N, subset=lab, pairs=int(msk.sum()), static_floor=float(static[msk].min()), static_q01=float(np.quantile(static[msk], 0.01)), static_median=float(np.median(static[msk])))
            for c in CS:
                v = dyn[c][msk]; pos = v[v > 0]
                row['c=%.4f' % c] = dict(floor=float(v.min()), zeros=int((v == 0).sum()), floor_positive=float(pos.min()) if len(pos) else None, q01=float(np.quantile(v, 0.01)), median=float(np.median(v)),
                                         min_ratio_to_static=float((v / static[msk]).min()), end_over_static_min=float((endd[c][msk] / static[msk]).min()), end_over_static_max=float((endd[c][msk] / static[msk]).max()), end_over_static_median=float(np.median(endd[c][msk] / static[msk])), median_ratio_to_static=float(np.median(v / static[msk])), frac_below_half_static=float((v < 0.5 * static[msk]).mean()))
            # spread over heights: floors in four height blocks
            ii = idx[msk]; qs = np.quantile(ii, [0, 0.25, 0.5, 0.75, 1.0]); blocks = []
            for b in range(4):
                mb = msk & (idx >= qs[b]) & (idx <= qs[b + 1])
                if mb.sum(): blocks.append(dict(pairs=int(mb.sum()), static_floor=float(static[mb].min()), **{'floor_c=%.4f' % c: float(dyn[c][mb].min()) for c in CS}, **{'q01_c=%.4f' % c: float(np.quantile(dyn[c][mb], 0.01)) for c in CS}))
            row['height_blocks'] = blocks
            res['rows'].append(row); fk.log(name, {k: v for k, v in row.items() if k != 'height_blocks'})
    # 60-digit recheck of the smallest positive floors
    keep.sort(key=lambda t: t[0]); chk = []
    for v, l, Z0, P, F0, F1, gkk, spp in keep[:3]:
        if not np.isfinite(v): continue
        for c in CS:
            j = int(np.nonzero(idx == l)[0][0])
            mpv = mp_recheck(Z0, P, F0, F1, gkk, c, spp)
            chk.append(dict(pair_index=l, c=c, float64_min=float(dyn[c][j]), float64_end=float(endd[c][j]), mp_150_steps_min_end=mpv[0], mp_300_steps_min_end=mpv[1], static=float(static[j]), gap_unfolded=gkk / spp))
            fk.log(name, 'recheck', chk[-1])
    res['recheck_60_digits'] = chk
    res['transport'] = []
    for N in (10 ** 4, 10 ** 5, 10 ** 6):
        if N <= M: res['transport'] += transport(g, N, Q, par)
    if not res['transport']: res['transport'] = transport(g, M, Q, par)
    for r in res['transport']: fk.log(name, 'transport', r)
    fk.jdump(res, out)
