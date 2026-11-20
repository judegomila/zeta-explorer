import math, json, sys, numpy as np, mpmath as mp
import pen
out = {}
# 1. SGN-2X witness (1, 2, ln 2) -> (13 + 3 sqrt 17)/32
v = pen.lam_float([1.0, 2.0], math.log(2)); t = (13 + 3 * math.sqrt(17)) / 32
out['sgn2x_witness'] = [v, t, pen.lam2_closed(1, 2, math.log(2))]
# 2. direct pencil (mpmath, 60 digits) against exp(dA): real and complex nodes
mp.mp.dps = 60
rng = np.random.default_rng(1)
worst = 0
for trial in range(6):
    K = 6
    if trial < 3: nu = np.sort(rng.uniform(1, 3, K))
    else:
        g = rng.uniform(5, 40, K // 2); nu = np.concatenate([0.7 - 1j * g, 0.7 + 1j * g])
    d = 0.8
    G = mp.matrix(K, K); Tm = mp.matrix(K, K)
    for i in range(K):
        for j in range(K):
            s = mp.mpc(nu[i]) + mp.conj(mp.mpc(nu[j]))
            G[i, j] = 1 / s; Tm[i, j] = mp.exp(-d * s) / s
    ev = mp.eig(mp.inverse(G) * Tm, left=False, right=False)
    lam_direct = max(float(mp.re(e)) for e in ev)
    lam = pen.lam_float(nu, d)
    la = pen.lam_arb([str(x.real) for x in nu], None if trial < 3 else [repr(float(x.imag)) for x in nu], d, 300)
    worst = max(worst, abs(lam / lam_direct - 1), abs(math.exp(la['logLam']) / lam_direct - 1))
out['pencil_vs_expm_max_rel'] = worst
# 3. confluent N-fold: Laguerre floor <= Lambda_conf <= cap(R=1); leading order
rows = []
for N, x in [(2, 3.0), (3, 6.0), (5, 12.0), (8, 30.0)]:
    la = pen.lam_arb(['1'] * N, None, x, 400)['logLam']
    rows.append([N, x, pen.laguerre_floor_log(N, x, mp), la, pen.coal_n_cap_log(N, x, 1, mp), 2 * (-x + (N - 1) * math.log(2 * x) - math.lgamma(N))])
out['confluent_floor_exact_cap_leading'] = rows
out['coal2_closed_vs_exact'] = [pen.coal_law(3.0), math.exp(pen.lam_arb(['1', '1'], None, 3.0, 300)['logLam'])]
# 4. EV-OCT onset m = 6
out['evoct_m6'] = [pen.bisect(lambda x: pen.evoct_cert(6, x), 5, 40), 11.31664319, pen.evoct_cert(6, 12.0), 0.286105471]
# 5. TILT-DET K=1: bound/exact = 2 e x at x = 6
lb, s = pen.tilt_det_log([1.0], 6.0); out['tilt_K1_ratio'] = [math.exp(lb + 12), 2 * math.e * 6]
def twins(m, r): return np.array([f * 2.0 ** k for k in range(m) for f in (1.0, r)])
out['tilt_onset_m16_r1.1'] = [pen.bisect(lambda x: math.exp(pen.tilt_det_log(twins(16, 1.1), x)[0]) + (0 if pen.tilt_det_log(twins(16, 1.1), x)[0] < 0 else 1), 2, 40), 15.4776]
# 6. DEFL-ORTH-N every-octave onsets (r = 1.1): sum_k LambdaPerp_k = 1 at 1.7040 / 3.4394 / 3.5586 (m = 2 / 6 / 16)
def defl_sum(m, x, r=1.1, prec=400):
    order = list(range(m - 1, -1, -1))          # highest block first
    nu = [f * 2.0 ** k for k in order for f in (1.0, r)]
    cols = [[2 * i, 2 * i + 1] for i in range(m)]
    res = pen.lam_arb([repr(v) for v in nu], None, x, prec, cols=cols)
    return sum(math.exp(l) for l in res['logPerp']), math.exp(res['logLam']), res['relrad']
on = {}
for m, ref in [(2, 1.7040), (6, 3.4394), (16, 3.5586)]:
    on[m] = [pen.bisect(lambda x: defl_sum(m, x)[0], 0.5, 8, it=40), ref]
out['defl_onsets'] = on
out['defl_sum_m12_x6'] = [defl_sum(12, 6.0)[0], 0.21215]
s3 = defl_sum(3, 6.0); out['sandwich_m3_x6'] = list(s3)
json.dump(out, open('validate.json', 'w'), indent=1); print(json.dumps(out, indent=1))
