"""Test 3 (and the real-list rows of test 1): first collision time t_c(N) of the backward flow on the first N ordinates of a real list,
as a step function of N from the running record of the minimal gap; increments |t_c(2N) - t_c(N)|, local exponent p(N) per decade,
against the source surrogate E(N) = E_trunc + E_flow + E_coll (bl.surrogate).
t_c in gamma units is g_min^2/8 (1 + retardation); the retardation of each record pair comes from a backward flow of a window of 4001
ordinates in long double (routine of lane s5, c23.py). Lambda units (z = 2 gamma): 4 t_c.
Usage: t3.py LIST.npy NAME Q OUT.json [T0window]"""
import sys, json, math, numpy as np, hl, bl
fn, name, Q, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
T0w = float(sys.argv[5]) if len(sys.argv) > 5 else None
g = np.array(np.load(fn, mmap_mode='r'), dtype=np.float64); n = len(g)
hl.log('%s: %d ordinates %.3f .. %.3f; list %.2f GB, planned peak %.2f GB' % (name, n, g[0], g[-1], 8e-9 * n, 4 * 8e-9 * n + 0.5))
gap = np.diff(g)

def tc_flow(x, cfl=0.02, stop=1e-4):
    x = np.array(x, dtype=np.longdouble); s_ = 0.0
    d = np.diff(x); g0 = float(d.min())
    rho_w = (len(x) - 1) / float(x[-1] - x[0]); ea = float(x[0]) - 0.5 / rho_w; eb = float(x[-1]) + 0.5 / rho_w
    FR = lambda xx: hl.forces_real(xx, True) + rho_w * np.log((eb - xx) / (xx - ea))
    for it in range(4000):
        F = FR(x); d = np.diff(x); k = int(np.argmin(d)); gm = float(d[k])
        Bp = float((F[k] - F[k + 1] + 2 / d[k]) / d[k])
        if gm < stop * g0 or it == 3999: break
        dt = cfl * gm * gm
        k1 = -2 * F; k2 = -2 * FR(x + 0.5 * dt * k1); k3 = -2 * FR(x + 0.5 * dt * k2); k4 = -2 * FR(x + dt * k3)
        x = x + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4); s_ += dt
    return s_ + gm * gm / (8 * (1 - gm * gm * Bp / 2))

# running records of the minimal gap: record k holds for N in (idx_k + 2 .. idx_{k+1} + 1]
rm = np.minimum.accumulate(gap); rec = np.concatenate([[0], np.nonzero(rm[1:] < rm[:-1])[0] + 1])
hl.log('%d records' % len(rec))
ladder = sorted(set([int(round(2 ** (k / 2))) for k in range(14, int(2 * math.log2(n)) + 1)] + [n]))
ladder = [N for N in ladder if 100 <= N <= n]
need = sorted(set(int(rec[np.searchsorted(rec, N - 2, side='right') - 1]) for N in ladder))
ret = {}
for a in need:
    j = int(np.searchsorted(rec, a, side='right')); nxt = int(rec[j]) if j < len(rec) else n   # the window stops before the next record pair
    w0 = max(0, a - 2000); w1 = min(n, a + 2002, nxt + 1)
    tc = tc_flow(g[w0:w1]); ret[a] = tc; hl.log('record at index %d gap %.6e: t_c %.8e (pair value %.8e, retardation %.2e)' % (a, gap[a], tc, gap[a] ** 2 / 8, tc / (gap[a] ** 2 / 8) - 1))
rows = []
for N in ladder:
    a = int(rec[np.searchsorted(rec, N - 2, side='right') - 1]); T0 = float(g[N - 1]) if T0w is None else T0w + float(g[N - 1] - g[0])
    s = bl.surrogate(N, None if T0w else T0)
    rows.append(dict(N=N, T0=T0, index=a, gmin=float(gap[a]), tc_gamma=ret[a], tc_lambda=4 * ret[a], E=s['E'], E_coll=s['E_coll'], E_flow=s['E_flow'], sigma=s['sigma'],
                     ratio_tc_over_E=4 * ret[a] / s['E'], least_CC_if_Lambda_0=bl.least_CC(4 * ret[a], N, None if T0w else T0)))
res = dict(name=name, n=n, records=[dict(index=int(a), height=float(g[a]), gap=float(gap[a])) for a in rec], ladder=rows)
N_ = np.array([r['N'] for r in rows], float); tc = np.array([r['tc_lambda'] for r in rows]); E = np.array([r['E'] for r in rows]); Ec = np.array([r['E_coll'] for r in rows])
# dyadic increments (ladder step is sqrt 2: 2N is two rungs up)
inc = []
for i in range(len(rows) - 2):
    if abs(rows[i + 2]['N'] / rows[i]['N'] - 2) < 0.01:
        inc.append(dict(N=rows[i]['N'], inc_tc=abs(tc[i + 2] - tc[i]), inc_E=abs(E[i + 2] - E[i]), inc_Ecoll=abs(Ec[i + 2] - Ec[i])))
res['increments'] = inc
dec = []
lo = 1e2
while lo * 10 <= n * 1.0001:
    k = (N_ >= lo * 0.999) & (N_ <= lo * 10 * 1.001)
    if k.sum() >= 3:
        ii = [d for d in inc if lo * 0.999 <= d['N'] <= lo * 10 * 1.001 / 2]
        nz = [d for d in ii if d['inc_tc'] > 0]
        dec.append(dict(lo=lo, hi=lo * 10, p_tc=float(np.polyfit(np.log(N_[k]), np.log(tc[k]), 1)[0]), p_E=float(np.polyfit(np.log(N_[k]), np.log(E[k]), 1)[0]),
                        p_Ecoll=float(np.polyfit(np.log(N_[k]), np.log(Ec[k]), 1)[0]), sigma_mid=float(bl.surrogate(lo * math.sqrt(10))['sigma']),
                        dyadic_steps=len(ii), zero_increments=len(ii) - len(nz),
                        p_increments=(float(np.polyfit(np.log([d['N'] for d in nz]), np.log([d['inc_tc'] for d in nz]), 1)[0]) if len(nz) >= 3 else None),
                        tc_over_E_lo=float(tc[k][0] / E[k][0]), tc_over_E_hi=float(tc[k][-1] / E[k][-1])))
    lo *= 10
res['decades'] = dec
res['fit_all'] = dict(p_tc=float(np.polyfit(np.log(N_), np.log(tc), 1)[0]), p_E=float(np.polyfit(np.log(N_), np.log(E), 1)[0]))
# block version: mean over disjoint blocks of N consecutive zeros of 4 (min raw gap)^2 / 8, blocks in the upper half of the list (heights within a factor 2)
bk = []
h0 = (n - 1) // 2
for N in [int(v) for v in (1e2, 1e3, 1e4, 1e5, 1e6, 1e7) if (n - 1 - h0) >= 8 * v]:
    m = (n - 1 - h0) // N; mn = gap[h0:h0 + m * N].reshape(m, N).min(1); v = 0.5 * mn ** 2
    bk.append(dict(N=N, blocks=m, mean_tc_lambda=float(v.mean()), median_tc_lambda=float(np.median(v)), sem=float(v.std(ddof=1) / math.sqrt(m))))
res['blocks_upper_half'] = bk
if len(bk) >= 3: res['blocks_exponent_median'] = float(np.polyfit(np.log([b['N'] for b in bk]), np.log([b['median_tc_lambda'] for b in bk]), 1)[0])
bl.jdump(res, out)
print(json.dumps(dict(fit_all=res['fit_all'], decades=dec, blocks=res.get('blocks_exponent_median'))))
