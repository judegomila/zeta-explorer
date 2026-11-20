"""Test 2, prime side: c = 2 |(xi'/xi)''(s)|, s = 1/2 + y_N + i x_0, with (zeta'/zeta)''(s) replaced by the truncated sum
P_X(s) = - sum_{n <= X} Lambda(n) log^2 n w(n) n^(-s), w = 1 (sharp) or 1 - log n / log X (Riesz), at the block footers written by t2_zero.py,
against the zero-side value from the list.  Validation (identity, Riesz weight): -P_X(s) = sum_rho k_X(s - rho) - k_X(s - 1) + (trivial zeros),
k_X(w) = int_0^L v^2 (1 - v/L) e^(-w v) dv, L = log X.
Usage: t2_prime.py LIST.npy FOOTERS.npy FAMILY XMAX OUT.json     FAMILY: zeta | chi4 | chi5 (the list and footers of that L-function)"""
import sys, json, math, numpy as np, bl, hl
fn, ffn, fam, XMAX, out = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), sys.argv[5]
g = np.array(np.load(fn, mmap_mode='r'), dtype=np.float64); n = len(g); F = np.load(ffn); x0 = np.ascontiguousarray(F[0]); idx = F[2].astype(int); nf = len(x0)
Nl = [1e2, 1e3, 1e4, 1e5, 1e6]; ys = [math.sqrt(2 * math.pi / N) for N in Nl]
cuts = [c for c in (1e4, 1e6, 1e8, 1e10) if c <= XMAX]
Qc = dict(zeta=1.0, chi4=4.0, chi5=5.0)[fam]; par = dict(zeta=0, chi4=1, chi5=0)[fam]
hl.log('%s: %d footers, heights %.1f .. %.1f; y = %s; cut-offs %s' % (fam, nf, x0.min(), x0.max(), ys, cuts))
A = np.zeros((2 * len(ys), nf), complex); snaps = {}; nP = 0
for hi, nn, k, p in bl.pp_chunks(cuts[-1], cuts, CH=1e8):
    if len(nn):
        nP += len(nn); lp = np.log(p); ln = k * lp; pi_ = p.astype(np.int64)
        ch = 1.0 if fam == 'zeta' else (np.where(pi_ % 4 == 1, 1.0, np.where(pi_ % 4 == 3, -1.0, 0.0)) if fam == 'chi4' else np.array([0.0, 1.0, -1.0, -1.0, 1.0])[pi_ % 5]) ** k
        base = ch * lp * ln * ln / np.sqrt(nn)
        coef = np.stack([base * np.exp(-y * ln) * (ln if j else 1.0) for y in ys for j in (0, 1)])
        oc, os_ = bl.prime_sum_cs(ln, coef, x0); A += oc - 1j * os_
    if hi in cuts: snaps[hi] = A.copy(); hl.log('cut-off %g: %d prime powers' % (hi, nP))

def Jn(nn_, w, L):
    wl = w * L; big = np.abs(wl) >= 3; o = np.empty(w.shape, complex)
    wb = w[big]; e = np.exp(-wb * L); sm = sum(math.factorial(nn_) / math.factorial(j) * (wb * L) ** j for j in range(nn_ + 1))
    o[big] = (math.factorial(nn_) - e * sm) / wb ** (nn_ + 1)
    ws = wl[~big]; o[~big] = L ** (nn_ + 1) * sum((-ws) ** m / (math.factorial(m) * (m + nn_ + 1)) for m in range(60))
    return o
def kX(w, L): return Jn(2, w, L) - Jn(3, w, L) / L

K = min(3000, (n - 4) // 2)
lo = np.clip(idx - K, 0, n - 2 * K - 2); J = lo[:, None] + np.arange(2 * K + 2)[None, :]
dist = x0[:, None] - g[J]                                     # x0 - gamma
rows = []
for iy, (N, y) in enumerate(zip(Nl, ys)):
    w = y + 1j * dist                                         # s - rho
    zsum = (2 / w ** 3).sum(1)                                # (xi'/xi)'' from the zeros of the window (gamma > 0 near x0)
    s = 0.5 + y + 1j * x0
    # gamma factor: (1/2) psi(s/2 + par/2) differentiated twice -> (1/8) psi''((s + par)/2) ~ -1/(2 (s+par)^2); pole terms only for zeta
    smooth = -1 / (2 * (s + par) ** 2) + ((2 / s ** 3 + 2 / (s - 1) ** 3) if fam == 'zeta' else 0)
    c_zero = 2 * np.abs(zsum)
    for X in cuts:
        L = math.log(X); A0 = snaps[X][2 * iy]; A1 = snaps[X][2 * iy + 1]
        Ps = -A0; Pr = -(A0 - A1 / L)
        c_s = 2 * np.abs(Ps + smooth); c_r = 2 * np.abs(Pr + smooth)
        ksum = kX(w.ravel(), L).reshape(w.shape).sum(1) - (kX(s - 1, L) if fam == 'zeta' else 0)
        val = np.abs(Pr - ksum) / np.maximum(np.abs(ksum), 1e-300)        # identity residual: P_riesz = zeta''-type sum = sum_rho k - k(s-1)
        q = lambda v: [float(t) for t in np.quantile(v, [0.1, 0.5, 0.9])]
        rows.append(dict(N=N, y=y, X=X, yL=y * L, c_zero_median=float(np.median(c_zero)), c_sharp_median=float(np.median(c_s)), c_riesz_median=float(np.median(c_r)),
                         ratio_sharp_q=q(c_s / c_zero), ratio_riesz_q=q(c_r / c_zero), relerr_sharp_q=q(np.abs((Ps + smooth) - zsum) / np.abs(zsum)), relerr_riesz_q=q(np.abs((Pr + smooth) - zsum) / np.abs(zsum)),
                         corr_log_sharp=float(np.corrcoef(np.log(c_s), np.log(c_zero))[0, 1]), corr_log_riesz=float(np.corrcoef(np.log(c_r), np.log(c_zero))[0, 1]),
                         identity_residual_q=q(val), sharp_rms=float(np.sqrt((np.abs(Ps) ** 2).mean())), zero_rms=float(np.sqrt((np.abs(zsum) ** 2).mean()))))
        if fam == 'zeta' and X >= 1000003:
            qq = 1000003.0; cq = 2.2; al = cq / 2 + math.sqrt(cq * cq / 4 - 1); lq = math.log(qq)
            ex = -(al + 1 / al) * lq ** 3 * np.exp(-(y + 1j * x0) * lq)      # extra term of T-NR in sum Lambda_F(n) log^2 n n^(-s), j = 1; P gets minus it
            rows[-1]['tnr_extra_rms'] = float(np.sqrt((np.abs(ex) ** 2).mean())); rows[-1]['tnr_extra_over_zero_median'] = float(np.median(np.abs(ex) / np.abs(zsum)))
res = dict(family=fam, footers=nf, heights=[float(x0.min()), float(x0.max())], rows=rows)
bl.jdump(res, out)
for r in rows: print('N=%-8g X=%-6g yL=%-6.3f c_zero %.3g sharp/zero %s riesz/zero %s relerr riesz %s identity %s' % (r['N'], r['X'], r['yL'], r['c_zero_median'], ['%.3g' % v for v in r['ratio_sharp_q']], ['%.3g' % v for v in r['ratio_riesz_q']], ['%.3g' % v for v in r['relerr_riesz_q']], ['%.1e' % v for v in r['identity_residual_q']]))
