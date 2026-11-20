#!/usr/bin/env python3
"""law.py outdir out.json -- the Gauss-sum (polar) law per conductor at the scale of the run:
S_sigma(c; Q) = sum_{N(m) <= Q} rho_nat_sigma(-e0 m) chi_c(m) against pred(c) = gamma_1(c) conj chi_c(-e0), by row stratum,
by class shift tau (sigma = class(c) tau), by band of N(c).  z2 = |S|^2 / sum_m |rho_sigma|^2 (full sums; null value 2).
Leave-one-out: the estimator self-term is removed (it only occurs for tau = 1)."""
import os, sys, math, glob, json, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); SX = os.environ.get('SEXTIC_DIR', os.path.join(HERE, 'sextic'))
sys.path.insert(0, SX); import zomega as Z
outd, outjson = sys.argv[1], sys.argv[2]
def P(*a): print(*a, flush=True)
st_ = np.load(os.path.join(outd, 'static.npz')); nd = np.load(os.path.join(outd, 'nodes.npz'))
Qs = st_['Qs']; NB = len(Qs); par_cls = st_['par_cls']; cop = [st_['cls_even'], st_['cls_odd']]; ne = int(st_['ne'])
Np = nd['Np']; cls = nd['clsp'].astype(int); pred = nd['pred']; n = len(Np); par = (np.arange(n) >= ne).astype(int)
reps = Z.MOD4_REPS; mul = np.array([[Z.mod4_index(Z.mul(a, b)) for b in reps] for a in reps])
pos = np.full((2, 12), -1)
for p in (0, 1):
    for i, s in enumerate(cop[p]): pos[p, s] = i
taus = [t for t in range(12) if par_cls[t] == 0]
P("mod-4 class representatives:", [f"{i}:{r}" for i, r in enumerate(reps)]); P("even classes (tau):", [(t, reps[t]) for t in taus])
# sum |rho_sigma|^2 by Q, stratum
nr = np.zeros((NB, 2, 12))
for f in sorted(glob.glob(os.path.join(outd, 'rows_*.npz'))):
    r = np.load(f); rho = r['rho_str'] + r['rho_cor']; fl = r['flags']; g = ~r['six']; c6 = (fl[:, 0] == 0) & (fl[:, 1] == 0)
    jb = np.searchsorted(Qs, r['Nm'], 'left')
    for s in (0, 1):
        mk = g & (c6 if s == 0 else ~c6)
        for j in np.unique(jb): nr[j:, s] += (np.abs(rho[mk & (jb == j)]) ** 2).sum(0)[None, :]
bands = [(2, 30), (31, 100), (101, 300), (301, 1000), (1001, 3000), (3001, 10 ** 4), (10 ** 4 + 1, 3 * 10 ** 4), (3 * 10 ** 4 + 1, 10 ** 5),
         (10 ** 5 + 1, 3 * 10 ** 5), (3 * 10 ** 5 + 1, 10 ** 6), (10 ** 6 + 1, 3 * 10 ** 6), (3 * 10 ** 6 + 1, 10 ** 7)]
bidx = [np.flatnonzero((Np >= lo) & (Np <= hi)) for lo, hi in bands]
out = {'Qs': Qs.tolist(), 'bands': bands, 'taus': [int(t) for t in taus], 'tab': {}}
amp = {}
for j in range(NB):
    sn = np.load(os.path.join(outd, f'snap_{j:02d}.npz')); S = sn['S']; selfacc = sn['selfacc']
    for s in (0, 1):
        for t in taus:
            sig = mul[cls, t]; col = pos[par, sig]; assert (col >= 0).all()
            Sv = S[s, np.arange(n), col].astype(complex)
            raw = Sv.copy()
            if reps[t] == (1, 0): Sv = Sv - pred * selfacc[s]
            z2 = 2 * np.abs(Sv) ** 2 / nr[j, s, sig]; z2raw = 2 * np.abs(raw) ** 2 / nr[j, s, sig]
            pr = Sv * np.conj(pred)
            rowsout = []
            for b, ix in enumerate(bidx):
                tot = np.abs(Sv[ix]).sum()
                a_pred = abs(pr[ix].sum()) / tot
                cs = np.array([pr[ix][cls[ix] == c].sum() for c in range(12)])
                a_unit = np.abs(cs).sum() / tot
                # coherent amplitude per conductor, normalised: sum_cls |sum_c S conj pred| / (#c sqrt(mean norm))
                coh = np.abs(cs).sum() / len(ix) / math.sqrt(nr[j, s].mean() / 2)
                rowsout.append([len(ix), float(z2[ix].mean()), float(z2raw[ix].mean()), float(a_pred), float(a_unit), float(coh)])
                amp[(j, s, t, b)] = (np.abs(cs).sum() / len(ix), len(ix))
            out['tab'][f"{j}|{s}|{t}"] = rowsout
def show(j):
    for s, sname in ((0, 'rows prime to 6'), (1, 'rows not prime to 6')):
        P(f"\nQ = {Qs[j]:.0f}, {sname}: per band of N(c): mean z2 (LOO) / alignment with pred / alignment with per-class unit x pred   [#c]")
        P("   tau        " + "  ".join(f"{lo}-{hi}"[:14].rjust(16) for lo, hi in bands))
        for t in taus:
            r = out['tab'][f"{j}|{s}|{t}"]
            P(f"   {str(reps[t]):9s} " + "  ".join(f"{x[1]:6.2f}/{x[3]:.2f}/{x[4]:.2f}" for x in r))
        P("   #c        " + "  ".join(f"{x[0]:16d}" for x in out['tab'][f"{j}|{s}|{taus[0]}"]))
        P("   raw z2 (self-term included), tau = 1: " + "  ".join(f"{x[2]:.2f}" for x in out['tab'][f"{j}|{s}|{[t for t in taus if reps[t] == (1, 0)][0]}"]))
for j in sorted({min(4, NB - 1), NB - 1}): show(j)
# per-class units on small conductors (no self-term), top Q
sn = np.load(os.path.join(outd, f'snap_{NB-1:02d}.npz')); S = sn['S']
P("\nunits: phase (in units of pi/6) of sum_{c in class, 2 <= N(c) <= 1000} S_{class tau}(c) conj pred(c), top Q; '.' = |coherence| < 0.5")
ix = np.flatnonzero((Np >= 2) & (Np <= 1000))
for s, sname in ((0, 'prime to 6'), (1, 'not prime to 6')):
    P(f"  rows {sname}:   class of c -> " + " ".join(f"{c:6d}" for c in range(12)))
    for t in taus:
        sig = mul[cls, t]; col = pos[par, sig]; pr = (S[s, np.arange(n), col].astype(complex) * np.conj(pred))[ix]
        line = []
        for c in range(12):
            v = pr[cls[ix] == c]; coh = abs(v.sum()) / np.abs(v).sum()
            line.append(f"{np.angle(v.sum()) / (math.pi / 6):+6.2f}" if coh > 0.5 else "     .")
        P(f"   tau {str(reps[t]):8s}           " + " ".join(line))
# amplitude exponents: coherent amplitude per conductor ~ Q^a N(c)^(-b), bands with N(c) > 1000, by stratum and tau
P("\nfit of the coherent amplitude per conductor  A(band, Q) = sum_cls |sum_c S conj pred| / #c  ~  C Q^a N(c)^(-b)   (all 11 Q, bands N(c) > 1000; ols sd)")
out['fit'] = {}
for s in (0, 1):
    for t in taus:
        xs = []; ys = []
        for j in range(NB):
            for b in range(4, len(bands)):
                a_, nc = amp[(j, s, t, b)]
                xs.append([1, math.log(Qs[j]), math.log(math.sqrt(bands[b][0] * bands[b][1]))]); ys.append(math.log(a_))
        xs = np.array(xs); ys = np.array(ys); co = np.linalg.lstsq(xs, ys, rcond=None)[0]; rs = ys - xs @ co
        cov = np.linalg.inv(xs.T @ xs) * (rs @ rs) / (len(ys) - 3)
        out['fit'][f"{s}|{t}"] = [float(co[1]), float(math.sqrt(cov[1, 1])), float(-co[2]), float(math.sqrt(cov[2, 2])), float(math.sqrt(rs @ rs / len(ys)))]
        P(f"  stratum {s}, tau {str(reps[t]):8s}: a = {co[1]:.3f} +- {math.sqrt(cov[1,1]):.3f}, b = {-co[2]:.3f} +- {math.sqrt(cov[2,2]):.3f}, rms log residual {math.sqrt(rs @ rs / len(ys)):.3f}")
json.dump(out, open(outjson, 'w'))
