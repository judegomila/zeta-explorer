"""sextic_theta.py -- numerical sextic theta coefficients (residues of index-y Kubota first moments) and their structure.

rho_sigma(y): constant of the X^{2/3} main term of sum_{n in sigma, n sf, (n, 6y) = 1, N(n) <= X} gt_1(y, n),
gt_1(y, n) = conj(chi_n(y)) gamma_1(n) ("stripped" at primes of y: moduli coprime to y; squarefree moduli only).
Cubic control: same with gt3(y, n) = chi_n(y)^{-2} gt3(n) (Dunn-Radziwill normalisation) at exponent 5/6.

  V   vanishing at exponent n-1: sextic index y_S pi^5 and cubic index pi^2 (expected residue 0: local theory
      [recalled: theta coefficients vanish at v_p = n - 1], cubic case = Dunn-Radziwill support (5.2)); empirical noise.
  P1  prime indices y_S pi: magnitude law |rho(y_S pi)| / |rho(y_S)| ~ N^{-kappa}; phase alignment with candidate local
      Gauss-sum phases (Patterson-type law would give alignment ~1).
  P2  twisted multiplicativity on products pi1 pi2.
  M   the mean needed by Prop 15.2's exceptional term: sum_{m in O, 0 < N(m) <= Q} |rho_sigma(-e0 m)|^2 (noise-bias
      corrected), e0 = (-2)^{2t-1} lambda^5 (S = {2, lambda}; units absorbed by m), for every class sigma mod 4;
      exponent in Q (dense theta: 5/6; theta supported on S-units x sixth powers: ~1/6).
Usage: python sextic_theta.py table.npz out_prefix [P0] [Qmax]
"""
import sys, os, math, json, time
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import alib as A, zomega as Z

Z6 = Z.ZETA6

def main():
    path, pref = sys.argv[1], sys.argv[2]
    P0 = int(sys.argv[3]) if len(sys.argv) > 3 else 400
    Qmax = int(sys.argv[4]) if len(sys.argv) > 4 else 300
    t0 = time.time()
    T = A.SFTable(path); X = T.X
    log = open(pref + '.log', 'w'); out = {'X': X}
    def P(*a):
        s = ' '.join(str(x) for x in a); print(s, flush=True); log.write(s + '\n'); log.flush()
    P(f"table {path}: X = {X:.3g}, n_sf = {T.n}")
    grid = A.geom_grid(1000, X, 90)
    B1 = A.Binner(T, grid)                    # all classes
    B4 = A.Binner(T, grid, T.m4, 12)          # sigma mod 4
    eU = T.node_exponents((1, 1)).astype(np.int16); eL = T.node_exponents(Z.LAM).astype(np.int16)
    e2 = T.node_exponents((-2, 0)).astype(np.int16)
    def comb(*terms):
        """exponent array of a product: terms = (exponent array, multiplicity); -1 propagates."""
        tot = np.zeros(T.n, dtype=np.int16); bad = np.zeros(T.n, bool)
        for arr, mult in terms:
            bad |= arr < 0
            tot = tot + mult * np.maximum(arr, 0)
        tot = tot % 6
        tot[bad] = -1
        return tot
    def vals6(ex):
        return np.where(ex >= 0, np.conj(Z6[np.maximum(ex, 0) % 6]), 0) * T.g1
    kL = T.chi_primes(Z.LAM)
    gt3n = np.where(eL >= 0, Z6[(-2 * np.maximum(eL, 0)) % 6], 0) * T.g2
    def vals3(ex):
        return np.where(ex >= 0, Z6[(-2 * np.maximum(ex, 0)) % 6], 0) * gt3n
    def fit_all(v, th):
        dS, dn = B1.binned(v); return A.fit_binned(grid, dS[:, 0], dn[:, 0], th)
    # good primes up to P0
    good = [k for k in range(T.np_) if T.pq[k] <= P0]
    eP = {k: T.node_exponents((int(T.pa[k]), int(T.pb[k]))).astype(np.int16) for k in good}
    P(f"primes with N <= {P0}: {len(good)}; exponent arrays ready {time.time() - t0:.1f}s")
    # base S-unit index: strongest over all n (from a scan of the 216 classes)
    best = None
    for i in range(6):
        for j in range(6):
            for k in range(6):
                c, se, _, _ = fit_all(vals6(comb((eU, i), (eL, j), (e2, k))), 2 / 3)
                if best is None or abs(c) / se > best[0]:
                    best = (abs(c) / se, (i, j, k), c, se)
    zS, (bi, bj, bk), cS, seS = best
    yS = Z.mul(Z.mul(Z.UNITS[bi], Z.power(Z.LAM, bj)), Z.power((-2, 0), bk))
    P(f"base S-unit index y_S = zeta6^{bi} lambda^{bj} (-2)^{bk} = {yS}: rho = {cS:.4f} +- {seS:.4f} (z = {zS:.1f})")
    eS = comb((eU, bi), (eL, bj), (e2, bk))
    out['base'] = {'ijk': [bi, bj, bk], 'rho': [cS.real, cS.imag], 'se': seS}
    # ---------------------------------------------------------------- V: vanishing tests
    zV6, zV3, zV6b = [], [], []
    for k in good[:60]:
        c5, se5, _, _ = fit_all(vals6(comb((eS, 1), (eP[k], 5))), 2 / 3)
        c1, se1, _, _ = fit_all(vals6(comb((eS, 1), (eP[k], 1))), 2 / 3)
        c2, se2, _, _ = fit_all(vals3(comb((eP[k], 2))), 5 / 6)
        zV6.append((c5, se5)); zV6b.append((c1, se1)); zV3.append((c2, se2))
    zz6 = np.array([abs(c) / s for c, s in zV6]); zz3 = np.array([abs(c) / s for c, s in zV3]); zz1 = np.array([abs(c) / s for c, s in zV6b])
    P(f"V sextic index y_S pi^5 (60 primes): mean z^2 = {np.mean(zz6 ** 2):.3f} (pure noise ~ 1 with model se), rms |rho| = {np.sqrt(np.mean([abs(c) ** 2 for c, s in zV6])):.4f}")
    P(f"V sextic index y_S pi   (same primes): mean z^2 = {np.mean(zz1 ** 2):.3f}, rms |rho| = {np.sqrt(np.mean([abs(c) ** 2 for c, s in zV6b])):.4f}")
    P(f"V cubic  index pi^2 (DR)          : mean z^2 = {np.mean(zz3 ** 2):.3f}, rms |c| = {np.sqrt(np.mean([abs(c) ** 2 for c, s in zV3])):.4f} (cubic c(pi) ~ 0.28 N^-1/6)")
    emp6 = float(np.sqrt(np.mean([abs(c) ** 2 for c, s in zV6]))); mod6 = float(np.sqrt(np.mean([s ** 2 for c, s in zV6])))
    P(f"V empirical sextic noise (rms rho at vanishing indices) = {emp6:.4f} vs model se {mod6:.4f}: ratio {emp6 / mod6:.2f}")
    out['V'] = {'z2_sextic_pi5': float(np.mean(zz6 ** 2)), 'z2_sextic_pi': float(np.mean(zz1 ** 2)), 'z2_cubic_pi2': float(np.mean(zz3 ** 2)),
                'emp_noise6': emp6, 'model_se6': mod6}
    # ---------------------------------------------------------------- P1: prime indices
    rows = []
    for k in good:
        c, se, _, _ = fit_all(vals6(comb((eS, 1), (eP[k], 1))), 2 / 3)
        rows.append((k, float(T.pq[k]), c, se))
    Ns = np.array([r[1] for r in rows]); cs = np.array([r[2] for r in rows]); ses = np.array([r[3] for r in rows])
    u = cs / cS
    # magnitude law: fit log(|c|^2 - se^2) ~ const - 2 kappa log N on binned N ranges
    edges = np.geomspace(Ns.min(), Ns.max() * 1.0001, 7)
    mag = []
    for a_, b_ in zip(edges[:-1], edges[1:]):
        s = (Ns >= a_) & (Ns < b_)
        if s.sum() < 3: continue
        m2 = np.mean(np.abs(cs[s]) ** 2 - ses[s] ** 2); m2e = np.mean(np.abs(cs[s]) ** 2 - (emp6 ** 2))
        mag.append((float(np.exp(np.mean(np.log(Ns[s])))), float(m2), float(m2e), int(s.sum())))
    for g_, m2, m2e, n_ in mag:
        P(f"P1 N~{g_:7.1f} ({n_:3d} primes): mean |rho(y_S pi)|^2 - se^2 = {m2:.5f} (empirical-noise corrected {m2e:.5f});  |rho(y_S)|^2 N^-1/6 = {abs(cS) ** 2 * g_ ** (-1 / 6):.5f}")
    mm = np.array([[g_, m2e] for g_, m2, m2e, n_ in mag if m2e > 0])
    kap = -np.polyfit(np.log(mm[:, 0]), np.log(mm[:, 1]), 1)[0] / 2 if len(mm) >= 3 else float('nan')
    P(f"P1 magnitude exponent: |rho(y_S pi)| ~ N^-kappa with kappa = {kap:.3f} (dense-theta heuristic 1/12 = 0.083; cubic Patterson analogue 1/6)")
    # phase alignment with candidates
    Pobjs = {k: Z.PrimeO((int(T.pa[k]), int(T.pb[k])), int(T.pp[k]), bool(T.pinert[k])) for k in good}
    alpha = {k: Z.to_c((int(T.pa[k]), int(T.pb[k]))) / math.sqrt(T.pq[k]) for k in good}
    kys = {k: Pobjs[k].chi(yS) for k in good}
    G4 = {k: np.conj(Z6[Pobjs[k].chi((4, 0))]) * T.pg[3][k] for k in good}
    cands = {}
    for j in (1, 2, 3, 4, 5):
        gj = {k: (T.pg[j][k] if j <= 3 else None) for k in good}
    g = {1: T.pg[1], 2: T.pg[2], 3: T.pg[3]}
    def gam(j, k):
        if j in g: return g[j][k]
        if j == 4: return np.conj(g[2][k])            # gamma_4 = conj(gamma_2) (chi(-1)^4 = 1)
        if j == 5: return np.conj(g[1][k]) * Z6[(5 * Pobjs[k].chi((-1, 0))) % 6] ** 0 * (Z6[Pobjs[k].chi((-1, 0))])
    for j in (1, 2, 3):
        for s_ in (+1, -1):
            for tw in (0, 1):
                name = f"{'conj ' if s_ < 0 else ''}gamma_{j}(pi){' * chi_pi(y_S)^' + str(j) if tw else ''}"
                cands[name] = {k: (g[j][k] if s_ > 0 else np.conj(g[j][k])) * (Z6[(j * kys[k] * s_ * -1) % 6] if tw else 1) for k in good}
    cands['G(pi)'] = G4; cands['conj G(pi)'] = {k: np.conj(G4[k]) for k in good}
    cands['gamma_2(pi)^2'] = {k: g[2][k] ** 2 for k in good}
    cands['alpha(pi)'] = alpha; cands['conj alpha(pi)'] = {k: np.conj(alpha[k]) for k in good}
    # systematic family: gamma_2^a chi_pi(y_S)^b alpha^c G^d  (a in 0..5, b in 0..5, c in -1..1, d in 0..1)
    for a_ in range(6):
        for b_ in range(6):
            for c_ in (-1, 0, 1):
                for d_ in (0, 1):
                    if a_ == b_ == c_ == d_ == 0: continue
                    cands[f"gamma_2^{a_} chi(y_S)^{b_} alpha^{c_} G^{d_}"] = {k: g[2][k] ** a_ * Z6[(b_ * kys[k]) % 6] * alpha[k] ** c_ * G4[k] ** d_ for k in good}
    w_ = 1 / ses ** 2
    align = {}
    for name, f in cands.items():
        fv = np.array([f[k] for k, _, _, _ in rows])
        num = np.abs((w_ * u * np.conj(fv)).sum()); den = (w_ * np.abs(u)).sum()
        align[name] = float(num / den)
    for name, a in sorted(align.items(), key=lambda t: -t[1])[:12]:
        P(f"P1 phase alignment with {name:32s}: {a:.3f}")
    P(f"P1 (random-phase level ~ {1 / math.sqrt(len(rows)):.3f}; a law rho(y_S pi) = c f(pi) N^-k would give ~1)")
    # look-elsewhere null: random phases on u, max alignment over the whole candidate family
    rng = np.random.default_rng(11)
    F = np.array([[f[k] for k, _, _, _ in rows] for f in cands.values()])
    mx = []
    for _ in range(300):
        ur = np.abs(u) * np.exp(2j * np.pi * rng.random(len(u)))
        mx.append((np.abs((w_ * ur * np.conj(F)).sum(1)) / (w_ * np.abs(ur)).sum()).max())
    mx = np.array(mx); obs = max(align.values())
    P(f"P1 look-elsewhere: observed max alignment {obs:.3f} over {len(cands)} candidates; null max: median {np.median(mx):.3f}, 95% {np.quantile(mx, .95):.3f}, 99% {np.quantile(mx, .99):.3f}; p = {(mx >= obs).mean():.3f}")
    # class structure of the unpaired coefficients: fraction of |u|^2 explained by class means (pi mod 4, mod 9, both)
    kap_use = kap if np.isfinite(kap) else 1 / 12
    uu = u * Ns ** kap_use
    ww = 1 / (ses / abs(cS) * Ns ** kap_use) ** 2
    def explained(keys, uu_):
        tot = (np.abs(uu_) ** 2).sum(); ex = 0.0
        for kk in set(keys):
            sel = np.array([x == kk for x in keys])
            ex += np.abs(uu_[sel].sum()) ** 2 / sel.sum()
        return ex / tot
    k4 = [Z._MOD4[(int(T.pa[k]) % 4, int(T.pb[k]) % 4)] for k, _, _, _ in rows]
    k9 = [Z.mod9_index((int(T.pa[k]), int(T.pb[k]))) for k, _, _, _ in rows]
    k49 = [a * 9 + b for a, b in zip(k4, k9)]
    rng2 = np.random.default_rng(17)
    for name, keys in [('pi mod 4', k4), ('pi mod 9', k9), ('pi mod 4 x mod 9', k49)]:
        obs_c = explained(keys, uu)
        nul = [explained(keys, np.abs(uu) * np.exp(2j * np.pi * rng2.random(len(uu)))) for _ in range(300)]
        P(f"P1 class structure ({name}, {len(set(keys))} occupied classes): fraction of sum |u N^k|^2 explained by class means = {obs_c:.3f};"
          f" random-phase null median {np.median(nul):.3f}, 99% {np.quantile(nul, .99):.3f}")
        out.setdefault('P1_class', {})[name] = [obs_c, float(np.median(nul)), float(np.quantile(nul, .99))]
    mags = np.abs(uu); noise_rel = ses / abs(cS) * Ns ** kap_use
    cv = np.sqrt(max(np.var(mags) - np.mean(noise_rel ** 2) / 2, 0)) / np.mean(mags)
    P(f"P1 |rho(y_S pi)/rho(y_S)| N^kappa: mean {np.mean(mags):.3f}, sd {np.std(mags):.3f}, noise-corrected coefficient of variation {cv:.3f} (Patterson cubic analogue: 0)")
    out['P1_null'] = {'obs': obs, 'median': float(np.median(mx)), 'q95': float(np.quantile(mx, .95)), 'q99': float(np.quantile(mx, .99)), 'p': float((mx >= obs).mean()), 'ncand': len(cands)}
    out['P1'] = {'kappa': kap, 'mag': mag, 'align': align,
                 'rows': [[float(r[1]), r[2].real, r[2].imag, r[3]] for r in rows]}
    # ---------------------------------------------------------------- P2: products
    pr = []
    small = good[:24]
    for a_ in range(0, 24, 2):
        for b_ in range(a_ + 2, 24, 5):
            k1, k2 = small[a_], small[b_]
            if T.pp[k1] == T.pp[k2]: continue
            c12, se12, _, _ = fit_all(vals6(comb((eS, 1), (eP[k1], 1), (eP[k2], 1))), 2 / 3)
            c1 = cs[good.index(k1)]; c2 = cs[good.index(k2)]
            if min(abs(c1) / ses[good.index(k1)], abs(c2) / ses[good.index(k2)]) < 4: continue
            ratio = c12 * cS / (c1 * c2)
            P1o, P2o = Pobjs[k1], Pobjs[k2]
            x12 = P1o.chi((int(T.pa[k2]), int(T.pb[k2]))); x21 = P2o.chi((int(T.pa[k1]), int(T.pb[k1])))
            pr.append((float(T.pq[k1] * T.pq[k2]), ratio, x12, x21, abs(c12) / se12))
    if pr:
        P("P2 ratio rho(y_S p1 p2) rho(y_S) / (rho(y_S p1) rho(y_S p2)) on small products (twisted multiplicativity would make it a fixed root-of-unity function of the cross symbols):")
        for N_, r_, x12, x21, z_ in pr[:14]:
            P(f"   N={N_:7.0f}  ratio = {abs(r_):.3f} * e^(i {np.angle(r_) / (np.pi / 3):+.2f} pi/3)   chi_p1(p2)=z6^{x12} chi_p2(p1)=z6^{x21}  z(rho12)={z_:.1f}")
        rr = np.array([p[1] for p in pr])
        P(f"P2 |ratio|: median {np.median(np.abs(rr)):.3f}; spread of log|ratio| {np.std(np.log(np.abs(rr))):.3f}")
        out['P2'] = [[p[0], p[1].real, p[1].imag, p[2], p[3], p[4]] for p in pr]
    # ---------------------------------------------------------------- L: prime-power index classes e = 0..5 (stripped at pi)
    # S_e(pi) := sum over n coprime to 6 pi of conj(chi_n(y_S pi^e)) gamma_1(n); residues rL[e].  Local theory (transfer
    # D(p^e) = S_e + beta_e X^{e+1} S_{e*}, e* = -e-2 mod 6; verdict note sec. 2.2) pairs (0,4), (1,3); 2 self-paired; 5 alone.
    PL = int(min(P0, 160))
    goodL = [k for k in good if T.pq[k] <= PL]
    Lrows = []
    for k in goodL:
        rr = []
        for e in (6, 1, 2, 3, 4, 5):
            c, se, _, _ = fit_all(vals6(comb((eS, 1), (eP[k], e))), 2 / 3)
            rr.append((c, se))
        Lrows.append((k, float(T.pq[k]), rr))
    def ratio_stats(num, den, label):
        rat = np.array([r[2][num][0] / r[2][den][0] for r in Lrows])
        q_ = np.array([r[1] for r in Lrows])
        zden = np.array([abs(r[2][den][0]) / r[2][den][1] for r in Lrows])
        sel = zden > 4
        # magnitude law |ratio| = A q^-a  (weighted by den significance)
        if sel.sum() >= 4:
            a_fit = -np.polyfit(np.log(q_[sel]), np.log(np.abs(rat[sel])), 1)[0]
        else:
            a_fit = float('nan')
        # phase alignment vs local candidate family: gamma_j^s chi_pi(y_S)^c, j=1..3, s=+-1, c=0..5, and alpha^l
        fam = {}
        for j in (1, 2, 3):
            for s_ in (1, -1):
                for c_ in range(6):
                    for l_ in (-1, 0, 1):
                        fam[f"{'conj ' if s_ < 0 else ''}g{j} chi(yS)^{c_} alpha^{l_}"] = np.array(
                            [(T.pg[j][r[0]] if s_ > 0 else np.conj(T.pg[j][r[0]])) * Z6[(c_ * kys[r[0]]) % 6] * alpha[r[0]] ** l_ for r in Lrows])
        for c_ in range(1, 6):
            fam[f"chi(yS)^{c_}"] = np.array([Z6[(c_ * kys[r[0]]) % 6] for r in Lrows])
        ur = rat[sel] / np.abs(rat[sel])
        best = sorted(((abs(np.mean(ur * np.conj(f[sel]))), n_) for n_, f in fam.items()), reverse=True)[:3]
        rng = np.random.default_rng(3); mx = []
        F = np.array([f[sel] for f in fam.values()])
        for _ in range(300):
            ph = np.exp(2j * np.pi * rng.random(sel.sum()))
            mx.append(np.abs((ph * np.conj(F)).mean(1)).max())
        mx = np.array(mx)
        P(f"L {label}: {sel.sum()} primes with z(den)>4; |ratio| ~ q^-a, a = {a_fit:.3f}; median |ratio| q^a = {np.median(np.abs(rat[sel]) * q_[sel] ** a_fit):.3f};"
          f" best phase alignments {[(round(b[0], 3), b[1]) for b in best]}; null max 95%/99%: {np.quantile(mx, .95):.3f}/{np.quantile(mx, .99):.3f}")
        return {'a': a_fit, 'best': best, 'null95': float(np.quantile(mx, .95)), 'null99': float(np.quantile(mx, .99)),
                'ratios': [[float(q_[i]), rat[i].real, rat[i].imag, float(zden[i])] for i in range(len(rat))]}
    z_e = [np.mean([(abs(r[2][e][0]) / r[2][e][1]) ** 2 for r in Lrows]) for e in range(6)]
    P(f"L primes N <= {PL}: {len(goodL)}; mean z^2 of residue at index y_S pi^e, e = 0..5: {np.round(z_e, 2).tolist()} (noise ~ 1)")
    Lout = {'z2_e': z_e}
    Lout['r40'] = ratio_stats(4, 0, "pair (0,4): rho(y_S pi^4)/rho(y_S, stripped)")
    Lout['r31'] = ratio_stats(3, 1, "pair (1,3): rho(y_S pi^3)/rho(y_S pi)")
    Lout['r10'] = ratio_stats(1, 0, "unpaired : rho(y_S pi)/rho(y_S, stripped)")
    Lout['r20'] = ratio_stats(2, 0, "self-pair: rho(y_S pi^2)/rho(y_S, stripped)")
    out['L'] = Lout
    # ---------------------------------------------------------------- M: the needed mean over rows m
    R = int(math.isqrt(4 * Qmax // 3)) + 2
    ms = sorted([(a, b) for a in range(-R, R + 1) for b in range(-R, R + 1) if (a, b) != (0, 0) and Z.norm((a, b)) <= Qmax],
                key=lambda t: (Z.norm(t), t))
    # factor m over units, lambda, -2 and the good primes of the table
    gp = [(k, (int(T.pa[k]), int(T.pb[k]))) for k in range(T.np_) if T.pq[k] <= Qmax]
    for k, _ in gp:
        if k not in eP: eP[k] = T.node_exponents((int(T.pa[k]), int(T.pb[k]))).astype(np.int16)
    def factor(m):
        terms = []; x = m
        a = 0
        while Z.divides(Z.LAM, x): x = Z.exact_div(x, Z.LAM); a += 1
        b = 0
        while Z.divides((2, 0), x): x = Z.exact_div(x, (-2, 0)); b += 1
        for k, pi in gp:
            if Z.norm(x) == 1: break
            while Z.divides(pi, x):
                x = Z.exact_div(x, pi); terms.append((eP[k], 1))
        assert Z.norm(x) == 1, (m, x)
        u_ = Z.unit_index(x)
        return [(eU, u_), (eL, a), (e2, b)] + terms
    resM = {}
    for t in (1,):   # t = 2 gives identical |rho_sigma|: chi_n(4) is constant on classes mod 4 (n mod 2 determines it)
        # y = -e0 m with e0 = (-2)^{2t-1} lambda^5:  -e0 = zeta6^3 (-2)^{2t-1} lambda^5
        rec = []
        for m in ms:
            ex = comb((eU, 3), (e2, 2 * t - 1), (eL, 5), *factor(m))
            dS, dn = B4.binned(vals6(ex))
            fits = [A.fit_binned(grid, dS[:, s], dn[:, s], 2 / 3) for s in range(12)]
            fa = A.fit_binned(grid, dS.sum(1), dn.sum(1), 2 / 3)
            rec.append((Z.norm(m), [abs(f[0]) ** 2 for f in fits], [f[1] ** 2 for f in fits], abs(fa[0]) ** 2, fa[1] ** 2))
        Nm = np.array([r[0] for r in rec]); c2 = np.array([r[1] for r in rec]); s2 = np.array([r[2] for r in rec])
        ca = np.array([r[3] for r in rec]); sa = np.array([r[4] for r in rec])
        Qs = [q_ for q_ in (12, 25, 50, 100, 200, 300, 500, 800, 1200, 2000) if q_ <= Qmax]
        tab = []
        for q_ in Qs:
            sel = Nm <= q_
            tab.append([q_, int(sel.sum()), c2[sel].sum(0).tolist(), s2[sel].sum(0).tolist(), float(ca[sel].sum()), float(sa[sel].sum())])
        # pooled over sigma
        pooled = np.array([[r[0], sum(r[2]), sum(r[3])] for r in tab])
        corr = pooled[:, 1] - pooled[:, 2]
        corr_e = pooled[:, 1] - np.array([r[1] for r in tab]) * 12 * (emp6 ** 2 / mod6 ** 2) * (pooled[:, 2] / np.array([r[1] for r in tab]) / 12)
        for r, cc, ce in zip(tab, corr, corr_e):
            P(f"M t={t} Q={r[0]:5d} #m={r[1]:5d}: sum_sigma sum_m |rho|^2 = {sum(r[2]):.4f}, model-noise bias {sum(r[3]):.4f}, corrected {cc:.4f} (empirical-noise corrected {ce:.4f})")
        lq = np.log(pooled[:, 0])
        sl = np.polyfit(lq[2:], np.log(np.maximum(corr[2:], 1e-12)), 1)[0] if (corr[2:] > 0).all() else float('nan')
        sle = np.polyfit(lq[2:], np.log(np.maximum(corr_e[2:], 1e-12)), 1)[0] if (corr_e[2:] > 0).all() else float('nan')
        sraw = np.polyfit(lq[2:], np.log(pooled[2:, 1]), 1)[0]
        P(f"M t={t}: log-log slope (Q >= {Qs[2]}): model-corrected {sl:.3f}, empirical-corrected {sle:.3f}, raw {sraw:.3f}"
          f"  [dense theta 5/6 = 0.833; S-unit x sixth-power support ~ 0.17-0.3]")
        # per sigma slopes (empirical-noise corrected)
        per = []
        for s in range(12):
            vv = np.array([r[2][s] for r in tab]) - np.array([r[1] for r in tab]) * emp6 ** 2 * (np.array([r[3][s] for r in tab]) / np.maximum(1, np.array([r[1] for r in tab]))) / mod6 ** 2
            per.append(np.polyfit(lq[2:], np.log(np.maximum(vv[2:], 1e-12)), 1)[0] if (vv[2:] > 0).all() else float('nan'))
        P(f"M t={t}: per-sigma slopes {np.round(per, 2).tolist()}")
        resM[t] = {'tab': tab, 'slope_model': sl, 'slope_emp': sle, 'slope_raw': sraw, 'per_sigma': per,
                   'rows': [[float(r[0]), r[1], r[2]] for r in rec]}
    out['M'] = resM
    json.dump(out, open(pref + '.json', 'w'), indent=1, default=lambda o: o.tolist() if hasattr(o, 'tolist') else (complex(o).real if isinstance(o, complex) else str(o)))
    P(f"done {time.time() - t0:.1f}s")

if __name__ == '__main__':
    main()
