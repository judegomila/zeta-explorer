#!/usr/bin/env python3
"""ident.py outdir -- test of the reading "aligned row = conjugate smoothed partial sum of the theta series".
For the row beta = mu conj(alpha G) chi(-e0) one has beta gamma_2 = conj(gamma_1) chi_c(-e0) = conj(pred(c)), so
   conj(B_m) = sum_c w_R(c) gt(-e0 m, c),  w_R(x) = x^(-1/2) exp(-2 log^2(x/R)),
and with sum_{N(c) <= X, c in class s} gt(y, c) ~ rho_str_s(y) X^(2/3):
   conj(B_m^{parity p}) ~ C R^(1/6) sum_{s of parity p} rho_str_s(-e0 m),  C = (2/3) sqrt(pi/2) exp(1/288) = 0.8385.
Prediction for the leave-one-out form:  X0[sigma] = sum_m rho_nat_sigma B^{par sigma} - SELF  ~  C R^(1/6) G[sigma],
   G[sigma] = sum_m rho_nat_sigma conj(rho_str_blk(sigma)) - sum_m se_sigma^2   (estimator noise removed; half rows)."""
import os, sys, math, glob, numpy as np
outd = sys.argv[1]
def P(*a): print(*a, flush=True)
st_ = np.load(os.path.join(outd, 'static.npz')); Qs = st_['Qs']; Rs = st_['Rs']; NB = len(Qs); par = st_['par_cls']; types = [str(t) for t in st_['types']]
t = types.index('res'); C = (2 / 3) * math.sqrt(math.pi / 2) * math.exp(1 / 288)
rows = [np.load(f) for f in sorted(glob.glob(os.path.join(outd, 'rows_*.npz')))]
cat = lambda k: np.concatenate([r[k] for r in rows])
Nm = cat('Nm'); fl = cat('flags'); gen = ~cat('six'); rs = cat('rho_str'); rn = rs + cat('rho_cor'); se = cat('se')
B = np.concatenate([r['B'][:, :, :, t] for r in rows]); stt = np.where((fl[:, 0] == 0) & (fl[:, 1] == 0), 0, 1)
blk = np.stack([rs[:, par == 0].sum(1), rs[:, par == 1].sum(1)], 1)                 # rho_str summed over the classes of each parity
P(f"C = {C:.4f}")
P("columns: Q, R | per stratum (prime to 6 / not prime to 6): ratio = sum_sigma X0 conj(pred) / sum |pred|^2 (complex), r measured (rms over sigma), r predicted from C R^(1/6) G,")
P("         share of ||B||^2 carried by the theta part C^2 R^(1/3) (sum |rho_str_blk|^2 - noise), and corr(conj B^p, rho_str_blk p) over rows")
for name, kk in (('R = Q^1.4', np.arange(NB)), ('R = R_top', np.full(NB, NB - 1))):
    P(f"\npath {name}")
    for j in range(NB):
        k = kk[j]; sn = np.load(os.path.join(outd, f'snap_{j:02d}.npz')); SELF = sn['SELF'][:, k, t, :]
        line = f"  Q {Qs[j]:7.0f} R {Rs[k]:8.0f} |"
        for s in (0, 1):
            mk = gen & (Nm <= Qs[j]) & (stt == s)
            X0 = np.array([(rn[mk, sg] * B[mk, k, par[sg]]).sum() for sg in range(12)]) - SELF[s]
            G = np.array([(rn[mk, sg] * np.conj(blk[mk, par[sg]])).sum() - (se[mk, sg] ** 2).sum() for sg in range(12)])
            pred = C * Rs[k] ** (1 / 6) * G
            nr = (np.abs(rn[mk]) ** 2).sum(0); nb = (np.abs(B[mk, k]) ** 2).sum()
            ratio = (X0 * np.conj(pred)).sum() / (np.abs(pred) ** 2).sum()
            rm = math.sqrt((np.abs(X0) ** 2 / (nr * nb)).mean()); rp = math.sqrt((np.abs(pred) ** 2 / (nr * nb)).mean())
            sig = (np.abs(blk[mk]) ** 2).sum() - (se[mk] ** 2).sum()
            share = C ** 2 * Rs[k] ** (1 / 3) * sig / nb
            cor = abs((B[mk, k] * blk[mk]).sum()) / math.sqrt(nb * (np.abs(blk[mk]) ** 2).sum())
            line += f" ratio {ratio.real:+.3f}{ratio.imag:+.3f}i  r {rm:.4f} pred {rp:.4f}  theta share {share:.3f}  corr {cor:.3f} |"
        P(line)
