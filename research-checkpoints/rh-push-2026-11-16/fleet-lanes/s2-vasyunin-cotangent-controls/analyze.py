# analyze.py <dir>: statistics for the four combinations from stats_*.txt, la_*.json, d2_*.npy and consts.json
import sys, json, math, os
import numpy as np
d = sys.argv[1]
C = json.load(open('consts.json'))
tags = [t for t in ['zeta', 'chim3', 'chi5', 'DH', 'tnr2', 'tnr3', 'tnr101'] if os.path.exists(f'{d}/stats_{t}.txt') and t in C]
NMAX = 30001
spf = np.zeros(NMAX+1, dtype=np.int64)
for i in range(2, NMAX+1):
    if spf[i] == 0: spf[i::i] = np.where(spf[i::i] == 0, i, spf[i::i])
def fact(n):
    ps = []
    while n > 1:
        p = int(spf[n]); ps.append(p)
        while n % p == 0: n //= p
    return ps
def divisors_mu(n):
    out = [(1, 1)]
    for p in fact(n): out += [(dd*p, -m) for dd, m in out]
    return out
def all_div(n):
    ds = [1]
    m = n
    while m > 1:
        p = int(spf[m]); e = 0
        while m % p == 0: m //= p; e += 1
        ds = [x*p**k for x in ds for k in range(e+1)]
    return ds
R = {}
for t in tags:
    A = np.loadtxt(f'{d}/stats_{t}.txt'); I11 = float(open(f'{d}/stats_{t}.txt').readline().split()[-1])
    b = A[:, 0].astype(int); N = int(b[-1]); s = A[:, 1:]
    phi = np.array([np.prod([p-1 for p in fact(x)])*x//np.prod(fact(x)) if x > 1 else 1 for x in b], dtype=float)
    om = np.array([len(fact(x)) for x in b]); pm = np.array([fact(x)[0] for x in b])
    kap = float(C[t]['kappa']); tot = s[:, 1]+s[:, 2]+s[:, 3]
    kb = tot/(phi*b); r = kb-kap
    res = {'N': N, 'kappa_limit': kap, 'kappa_at': {}, 'I11': I11}
    for x in [30, 101, 1009, 3001, 10007, N-1 if spf[N-1] == N-1 else N, 2310 if N >= 2310 else 210, N]:
        if x <= N: res['kappa_at'][str(int(x))] = float(kb[x-2])
    res['min_kappa'] = [float(kb[1:].min()), int(b[1:][kb[1:].argmin()])]
    res['kappa_nonpositive_count'] = int((kb[1:] <= 0).sum())
    # parts
    p1, p2, p3 = s[:, 1]/(phi*b), s[:, 2]/(phi*b), s[:, 3]/(phi*b)
    top = b >= 0.9*N
    res['parts_top_mean'] = {'P1': float(p1[top].mean()), 'P2_fixed_modulus': float(p2[top].mean()), 'P3_leaf': float(p3[top].mean())}
    res['parts_top_std'] = {'P1': float(p1[top].std()), 'P2_fixed_modulus': float(p2[top].std()), 'P3_leaf': float(p3[top].std())}
    big = b >= (200 if N >= 1000 else 20)
    res['parts_negative_counts_b>=200'] = {'P1': int((p1[big] < 0).sum()), 'P2': int((p2[big] < 0).sum()), 'P3': int((p3[big] < 0).sum()), 'P2+P3': int(((p2+p3)[big] < 0).sum()), 'n': int(big.sum())}
    res['leaf_sign_changes_b>=200'] = int((np.diff(np.sign(p3[big])) != 0).sum())
    canc = np.abs(s[:, 3])/np.where(s[:, 4] > 0, s[:, 4], 1)
    res['leaf_cancellation_ratio'] = {'top_mean': float(canc[top].mean()), 'top_min': float(canc[top].min()), 'top_max': float(canc[top].max()), 'mid_mean': float(canc[(b >= 0.3*N) & (b < 0.4*N)].mean())}
    # residual sign law by omega and by smallest prime
    lo = 200 if N >= 1000 else 20
    res['b_lo'] = lo
    sel = (b >= lo)
    sg = np.sign(r)
    law = {}
    for w in range(1, 7):
        m = sel & (om == w)
        if m.sum(): law[str(w)] = {'n': int(m.sum()), 'pos': int((sg[m] > 0).sum()), 'neg': int((sg[m] < 0).sum())}
    res['residual_sign_by_omega'] = law
    agree1 = int((sg[sel] == (-1.0)**om[sel]).sum()); agree2 = int((sg[sel] == -(-1.0)**om[sel]).sum())
    res['residual_sign_agreement'] = {'n': int(sel.sum()), 'sign=(-1)^omega': agree1, 'sign=-(-1)^omega': agree2}
    sq = sel & np.array([all(x % (p*p) for p in fact(x)) for x in b])
    res['residual_sign_agreement_squarefree'] = {'n': int(sq.sum()), 'sign=(-1)^omega': int((sg[sq] == (-1.0)**om[sq]).sum()), 'sign=-(-1)^omega': int((sg[sq] == -(-1.0)**om[sq]).sum())}
    mu = np.array([0 if any(x % (p*p) == 0 for p in fact(x)) else (-1)**len(fact(x)) for x in b])
    eps1 = I11/2 - kap   # = E(1) - e0 with e0 = A_F(1)/2 (trapezoid end correction); leading Moebius term of the residual
    res['eps1=A_F(1)/2-kappa'] = eps1
    res['residual_sign_vs_mu_times_sign_eps1_squarefree'] = {'n': int(sq.sum()), 'agree': int((sg[sq] == np.sign(eps1)*mu[sq]).sum())}
    bysp = {}
    for p in [2, 3, 5, 7, 11, 13]:
        m = sel & (pm == p)
        if m.sum(): bysp[str(p)] = {'n': int(m.sum()), 'geomean_abs_r': float(np.exp(np.log(np.abs(r[m])+1e-300).mean())), 'geomean_abs_r_times_b': float(np.exp(np.log(np.abs(r[m]*b[m])+1e-300).mean()))}
    m = sel & (pm == b)
    bysp['prime'] = {'n': int(m.sum()), 'geomean_abs_r': float(np.exp(np.log(np.abs(r[m])).mean())), 'geomean_abs_r_times_b': float(np.exp(np.log(np.abs(r[m]*b[m])).mean()))}
    res['residual_by_smallest_prime'] = bysp
    # mechanism: Riemann-sum error E(n) = sum_{j<=n} A_F(j/n) - n kappa  (Phi(b) = coprime sum incl. a=1)
    Phi = np.zeros(N+1); Phi[1] = I11
    Phi[2:] = (tot + s[:, 5])/b
    E = np.zeros(N+1)
    for n in range(1, N+1): E[n] = sum(Phi[x] for x in all_div(n)) - n*kap
    nn = np.arange(max(50, N//100), N+1)
    X = np.vstack([np.ones(len(nn)), np.log(nn), 1.0/nn, np.log(nn)/nn]).T
    co, *_ = np.linalg.lstsq(X, E[nn], rcond=None)
    fit = X@co
    res['E_fit'] = {'model': 'E(n) = e0 + al*log n + (e1 + e2 log n)/n', 'e0': float(co[0]), 'al': float(co[1]), 'e1': float(co[2]), 'e2': float(co[3]), 'rms_resid': float(np.sqrt(np.mean((E[nn]-fit)**2))), 'rms_E': float(np.sqrt(np.mean(E[nn]**2)))}
    # prediction of sign(r(b)) from the fitted E by Moebius: Phi(b)-kappa phi(b) = sum_{d|b} mu(d) E(b/d); F = b(Phi - A(1/b))
    def Efit(n): return co[0]+co[1]*math.log(n)+(co[2]+co[3]*math.log(n))/n
    pred_ok = 0; cnt = 0
    for i, x in enumerate(b):
        if x < lo: continue
        pr = sum(m_*Efit(x//dd) for dd, m_ in divisors_mu(int(x))) - s[i, 5]/x
        cnt += 1; pred_ok += (np.sign(pr) == sg[i])
    res['E_fit']['sign_predicted_by_smooth_E_plus_Moebius'] = [int(pred_ok), cnt]
    # window wobble near lambda=0.1 (residual of A_F(lambda) about a straight line, reduced a/b in [0.09,0.11])
    wob = {}
    for x in sorted(set([int(v) for v in np.geomspace(min(N, max(400, N//64)), N, 7)])):
        i = x-2; n_ = s[i, 6]
        if n_ < 8: continue
        sx, sxx, sy, syy, sxy = s[i, 7:12]
        vx = sxx-sx*sx/n_; vy = syy-sy*sy/n_; cxy = sxy-sx*sy/n_
        wob[str(x)] = {'n': int(n_), 'mean_A': float(sy/n_), 'rms_about_line': float(math.sqrt(max(vy-cxy*cxy/vx, 0)/n_)), 'slope': float(cxy/vx)}
    res['window_0.09_0.11'] = wob
    # zeta-specific numbers in V units
    if t == 'zeta':
        res['leaf_mean_V_units_top'] = float((-(2/math.pi)*p3[top]).mean()); res['minus_1_over_4pi'] = -1/(4*math.pi)
        res['leaf_mean_V_units_last'] = float(-(2/math.pi)*p3[-1])
    # Gram linear algebra
    if os.path.exists(f'{d}/la_{t}.json'):
        L = json.load(open(f'{d}/la_{t}.json')); eg = L['eig']
        res['lam'] = [{'n': e['n'], 'lam1': e['lam1'], 'lam2': e['lam2'], 'w1': e['w1'], 'r0': math.log((1-e['w1'])/e['w1'])/math.log(e['lam1']/e['lam2']), 'k': 1/math.log(e['lam1']/e['lam2'])} for e in eg]
        sl = []
        for i in range(len(eg)):
            for j in range(i):
                if abs(eg[i]['n']/eg[j]['n']-2) < 0.08: sl.append({'n_lo': eg[j]['n'], 'n_hi': eg[i]['n'], 'dlog_lam1/dlog_n': math.log(eg[i]['lam1']/eg[j]['lam1'])/math.log(eg[i]['n']/eg[j]['n']), 'd_lam1': eg[i]['lam1']-eg[j]['lam1']})
        res['lam_octave_slopes'] = sl
        res['min_pivot'] = L.get('min_pivot')
    if os.path.exists(f'{d}/d2_{t}.npy'):
        d2 = np.load(f'{d}/d2_{t}.npy'); Ng = len(d2); Con = float(C[t]['C_on']); fl = float(C[t].get('floor_corrected', C[t]['floor']))
        n = np.arange(1, Ng+1)
        ratio = d2*np.log(np.maximum(n, 2))/Con
        res['burnol'] = {'Ngram': Ng, 'C_on': Con, 'floor': fl, 'ratio_at': {}, 'd2_at': {}, 'floor_share_of_d2_at_top': fl/float(d2[-1]), 'ratio_minus_floor_part_at_top': float((d2[-1]-fl)*math.log(Ng)/Con)}
        for x in [100, 300, 1000, 2600, 3000, 3333, 6000, 7500, 10000, 12000, 14000, 20000, 24000, 30000]:
            if x <= Ng: res['burnol']['ratio_at'][str(x)] = float(ratio[x-1]); res['burnol']['d2_at'][str(x)] = float(d2[x-1])
        lo_ = max(100, Ng//12); m = n >= lo_
        res['burnol']['ratio_range_top'] = [int(lo_), float(ratio[m].min()), float(ratio[m].max())]
        # tone search on the detrended ratio in x = log N (log-uniform resampling)
        def tone(lo_, hi_):
            xs = np.linspace(math.log(lo_), math.log(hi_), 2000); idx = np.clip(np.round(np.exp(xs)).astype(int), 1, Ng)-1
            y = ratio[idx]; base = np.vstack([np.ones_like(xs), xs]).T
            c0, *_ = np.linalg.lstsq(base, y, rcond=None); ss0 = float(((y-base@c0)**2).sum())
            best = None; scan = []
            for w in np.arange(1.0, 20.0, 0.02):
                Xw = np.vstack([np.ones_like(xs), xs, np.cos(w*xs), np.sin(w*xs)]).T
                cw, *_ = np.linalg.lstsq(Xw, y, rcond=None); ss = float(((y-Xw@cw)**2).sum())
                r2 = 1-ss/ss0; scan.append((float(w), r2))
                if best is None or r2 > best[1]: best = (float(w), r2, float(math.hypot(cw[2], cw[3])))
            r2_408 = min(scan, key=lambda z: abs(z[0]-4.08))[1]
            scan.sort(key=lambda z: -z[1]); pk = []
            for w, r2 in scan:
                if all(abs(w-p[0]) > 0.6 for p in pk): pk.append((round(w, 2), round(r2, 3)))
                if len(pk) == 4: break
            return {'window': [int(lo_), int(hi_)], 'span_logN': float(xs[-1]-xs[0]), 'best_w': round(best[0], 2), 'R2': best[1], 'amp': best[2], 'peaks': pk, 'R2_at_w=4.08': r2_408,
                    'trend_slope_per_logN': float(c0[1]), 'mean': float(y.mean()), 'rms_about_trend': float(math.sqrt(ss0/len(y)))}
        res['burnol']['tone_top'] = tone(lo_, Ng)
        if Ng >= 5500: res['burnol']['tone_common_600_5500'] = tone(600, 5500)
        if Ng >= 10000: res['burnol']['tone_2600_10000'] = tone(2600, 10000)
    R[t] = res
json.dump(R, open(f'{d}/analysis.json', 'w'), indent=1)
for t in R:
    print('=====', t); print(json.dumps(R[t], indent=None)[:6000])
