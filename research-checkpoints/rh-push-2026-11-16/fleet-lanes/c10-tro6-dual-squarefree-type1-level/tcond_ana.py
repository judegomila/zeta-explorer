"""tcond_ana.py -- polar share of the per-conductor sums T(c) and the Type I level energies before / after removal of the
polar-aligned component (lane c10, diagnostic for the statistic L of form (b)).
  e(c) = gamma_1(c) conj chi_c(y0) (N(c)/R_i)^(-1/3): aligned direction (Theorem P phase), one coefficient per cell
  (octave i, half h, sigma, c mod 4, c mod 9); T' = T - (cell coefficient) e.
  t_a[sigma, f] = sum_{c = 0 mod a, c in octave i, c mod 4 = f} mu(c) beta_c T_sigma(c);  D = sum_a sum_cells |t_a|^2.
  Baseline for random-phase rows (exact expectation): D_rand = sum_m sum_sigma |rho_sigma(m)|^2 sum_{a, f} |A_i[m, a, f]|^2.
Usage: python tcond_ana.py table.npz acc_b.npz t.npz out.json"""
import sys, os, json, math
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import alib as A, zomega as Z, acc10
Z6 = Z.ZETA6
T = A.SFTable(sys.argv[1]); d = np.load(sys.argv[2]); t = np.load(sys.argv[3])
acc10.G['T'] = T
sp = ~T.pinert
acc10.G.update(dict(sp=sp, p_sp=T.pp[sp].astype(np.int64), w_sp=T.pw[sp].astype(np.int64),
                    inert=[(int(i), Z.PrimeO((int(T.pa[i]), int(T.pb[i])), int(T.pp[i]), True)) for i in np.flatnonzero(T.pinert)]))
X = T.X; Xc = X / 4.0; NB = int(d['NB']); Qi = d['Qi']; rows = d['rows']; r6 = d['r6']; Nrow = rows[:, 0]
cidx = t['cidx']; Tc = t['T'].astype(np.complex128)
N = T.N.astype(float)[cidx]; ib = np.floor(np.log2(Xc / N)).astype(int)
cz = T.na[cidx] + T.nb[cidx] * Z.to_c((0, 1)); alpha = cz / np.abs(cz)
w = T.mu[cidx] * alpha * T.g2[cidx]
y0 = Z.mul((2, 0), Z.power(Z.LAM, 5)); e0 = acc10.node_exp(T, y0)[cidx].astype(int)
edir = T.g1[cidx] * np.conj(Z6[e0 % 6])
m4 = T.m4[cidx].astype(int); m9 = T.m9[cidx].astype(int)
_, lev, mlo, mhi = acc10.levels_setup(T, NB)
levN = T.N[lev].astype(float)
rho2 = (np.abs(r6[:, :12] + r6[:, 12:]) ** 2)                 # rows x sigma, halves added
import ana10
fac, _ = ana10.factor_rows(rows, T)
cop = np.array([np.prod([1 - 1 / (float(T.pq[p]) + 1) for p in f]) if f else 1.0 for f in fac])   # density of squarefree c coprime to the row
rng = np.random.default_rng(20261118 + 11)
res = []
for i in range(NB):
    Q = float(Qi[i])
    if Q < 600: continue
    s = np.flatnonzero(ib == i); n = len(s)
    Ai = d[f'A{i}'].astype(np.complex128); nrow, nl, _ = Ai.shape
    Tf = Tc[s, :12] + Tc[s, 12:]                                 # halves added: conductors x sigma
    # consistency with the row-side accumulation at a = 1
    chk = np.zeros((12, 12), complex)
    np.add.at(chk, m4[s], (w[s][:, None] * Tf))                  # [f, sigma]
    ref = np.einsum('ms,mf->fs', r6[:nrow, :12] + r6[:nrow, 12:], Ai[:, 0, :])
    cons = float(np.abs(chk - ref).max() / np.abs(ref).max())
    # energy ratio tau against random-phase rows: E|T(c)|^2 = sum over rows coprime to c of |rho|^2 (first-order inclusion-exclusion on small primes)
    tot_rho = rho2[:nrow].sum()
    tau = float((np.abs(Tf) ** 2).sum() / (n * tot_rho))
    tau_coprime = float((np.abs(Tf) ** 2).sum() / (rho2[:nrow].sum(1) * cop[:nrow]).sum() / n)   # baseline restricted to rows coprime to c (density model)
    # polar projection per cell (sigma, m4, m9)
    reg = edir[s] * (N[s] / (Xc / 2 ** i)) ** (-1 / 3)
    cell = m4[s] * 9 + m9[s]
    num = np.zeros((108, 12), complex); den = np.zeros(108)
    np.add.at(num, cell, Tf * np.conj(reg)[:, None]); np.add.at(den, cell, np.abs(reg) ** 2)
    coef = num / np.maximum(den, 1e-300)[:, None]
    pol_energy = (np.abs(num) ** 2 / np.maximum(den, 1e-300)[:, None]).sum()
    cnt = np.bincount(cell, minlength=108)
    share = float(pol_energy / (np.abs(Tf) ** 2).sum()); base = float(12 * (cnt > 0).sum() / (12 * n))
    Tp = Tf - coef[cell] * reg[:, None]
    # resonance: share by (sigma, class) pair
    rec = {'Q': Q, 'conductors': n, 'rows': nrow, 'consistency_rel_err': cons, 'tau': tau, 'tau_coprime': tau_coprime, 'polar_share': share, 'polar_share_null': base,
           'min_cell': int(cnt[cnt > 0].min()), 'L': {}}
    # level energies
    Drand_lev = np.einsum('ms,ma->a', rho2[:nrow], (np.abs(Ai) ** 2).sum(2))        # per level
    Dlev = np.zeros(nl); Dlev_p = np.zeros(nl)
    # Gaussian surrogates of T (independent over conductors) through the same projection: bias of the removal step
    sur = []
    for _ in range(6):
        Ts = (rng.standard_normal(Tf.shape) + 1j * rng.standard_normal(Tf.shape))
        nu = np.zeros((108, 12), complex); np.add.at(nu, cell, Ts * np.conj(reg)[:, None])
        sur.append((Ts, Ts - (nu / np.maximum(den, 1e-300)[:, None])[cell] * reg[:, None]))
    Ds = np.zeros((6, nl)); Dsp = np.zeros((6, nl))
    for li in range(nl):
        a = lev[li]
        ok = ((mlo[cidx[s]] & mlo[a]) == mlo[a]) & ((mhi[cidx[s]] & mhi[a]) == mhi[a])
        for (TT, out) in ((Tf, Dlev), (Tp, Dlev_p)):
            acc = np.zeros((12, 12), complex)
            np.add.at(acc, m4[s][ok], w[s][ok][:, None] * TT[ok])
            out[li] = (np.abs(acc) ** 2).sum()
        for q, (Ts, Tsp) in enumerate(sur):
            for (TT, out) in ((Ts, Ds), (Tsp, Dsp)):
                acc = np.zeros((12, 12), complex)
                np.add.at(acc, m4[s][ok], w[s][ok][:, None] * TT[ok])
                out[q, li] = (np.abs(acc) ** 2).sum()
    for nm, sel in (('a=1', np.arange(nl) == 0), ('kappa=0.4', (levN[:nl] > 1) & (levN[:nl] <= Q ** 0.4)), ('kappa=0.6', (levN[:nl] > 1) & (levN[:nl] <= Q ** 0.6))):
        if sel.sum() == 0: continue
        g = float(Dsp[:, sel].sum() / Ds[:, sel].sum())
        rec['L'][nm] = {'levels': int(sel.sum()), 'L': float(Dlev[sel].sum() / Drand_lev[sel].sum()), 'removal_bias': g,
                        'L_polar_removed': float(Dlev_p[sel].sum() / Drand_lev[sel].sum() / g)}
    res.append(rec)
    print(f"Q={Q:7.0f} cond={n:7d} cons={cons:.1e} tau={tau:.3f}/{tau_coprime:.3f} polar share={share:.4f} (null {base:.4f}) | " +
          ' | '.join(f"{k}: L={v['L']:.3f} L'={v['L_polar_removed']:.3f} (bias {v['removal_bias']:.3f})" for k, v in rec['L'].items()), flush=True)
lq = np.log([r['Q'] for r in res])
fit = {}
for k in ('a=1', 'kappa=0.4', 'kappa=0.6'):
    ok = [k in r['L'] and r['L'][k]['levels'] >= (1 if k == 'a=1' else 4) for r in res]
    if sum(ok) >= 3:
        x = lq[ok]
        fit[k] = {'L': float(np.polyfit(x, np.log([r['L'][k]['L'] for r, o in zip(res, ok) if o]), 1)[0]),
                  'L_polar_removed': float(np.polyfit(x, np.log([r['L'][k]['L_polar_removed'] for r, o in zip(res, ok) if o]), 1)[0])}
fit['tau'] = float(np.polyfit(lq, np.log([r['tau'] for r in res]), 1)[0])
fit['polar_share_minus_null'] = float(np.polyfit(lq, np.log([max(r['polar_share'] - r['polar_share_null'], 1e-6) for r in res]), 1)[0])
print('exponents in Q:', json.dumps(fit))
json.dump({'points': res, 'fits': fit}, open(sys.argv[4], 'w'), indent=1)
