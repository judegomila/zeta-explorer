# Decisive first test: joint section of the prime chain, true phases vs twists vs torus sup.
# Joint block P is J-contractive against the gamma reserve at s iff  Re U_P(s) <= Re G(s)  (Lemma 1).
# numpy float64, grid in t: all numbers are MEASURED lower bounds for the maxima.
import numpy as np, json, sys, math, time
rng = np.random.default_rng(20261117)
def primes_upto(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**0.5)+1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]
PR = primes_upto(300); LP = np.log(PR); NP = len(PR)
QCUT = {30: int(np.sum(PR <= 30)), 100: int(np.sum(PR <= 100)), 300: NP}
def digamma(w):
    w = np.asarray(w, complex); acc = np.zeros_like(w)
    for k in range(8):
        acc -= 1.0/(w+k)
    x = w+8; x2 = 1.0/(x*x)
    return acc + np.log(x) - 0.5/x - x2*(1/12. - x2*(1/120. - x2*(1/252. - x2*(1/240. - x2/132.))))
def G(s):   return 1/s + 1/(s-1) - 0.5*math.log(math.pi) + 0.5*digamma(s/2)
def GDH(s): return 0.5*math.log(5/math.pi) + 0.5*digamma((s+1)/2)
# chi mod 5, chi(2)=i
chi_tab = {1: 1, 2: 1j, 3: -1j, 4: -1, 0: 0}
CHI = np.array([chi_tab[int(p) % 5] for p in PR], complex)
kap = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
c1, c2 = (1-1j*kap)/2, (1+1j*kap)/2
T0, T1, DT = 10.0, 1.0e4, 0.02
WIN = [(10, 100), (100, 1000), (1000, 10000)]
SIG = np.round(np.arange(0.50, 1.6001, 0.02), 4)
# twists: phase shift phi_p (theta_p -> theta_p - phi_p), amplitude a_p in {0,1}
tw = {}
tw['true'] = (np.zeros(NP), np.ones(NP))
for t0 in (500.0, 5000.0):
    tw['sign_adv_t%g' % t0] = (np.where(np.cos(t0*LP) >= 0, 0.0, np.pi) + 0*LP, np.ones(NP))
    # sgn cos(t0 log p) twist: at t0 every phase is within pi/2 of 0  (eps_p = sgn cos)
    tw['sign_adv_t%g' % t0] = (np.where(np.cos(t0*LP) >= 0, 0.0, np.pi), np.ones(NP))
for k in range(10):
    tw['sign_rand_%d' % k] = (np.pi*rng.integers(0, 2, NP), np.ones(NP))
for k in range(5):
    tw['unimod_rand_%d' % k] = (2*np.pi*rng.random(NP), np.ones(NP))
tw['chi5_with_zeta_gamma'] = (np.angle(np.where(CHI == 0, 1, CHI)), (CHI != 0).astype(float))
for k in range(2):
    tw['tw_plus_01_%d' % k] = (np.zeros(NP), rng.integers(0, 2, NP).astype(float))
names = list(tw)
nW, nS, nQ = len(WIN), len(SIG), len(QCUT)
qidx = [QCUT[q]-1 for q in QCUT]
res = {n: np.full((nW, nS, nQ), -np.inf) for n in names}        # max_t (Re U - Re G)
res['chi5_own_gamma'] = np.full((nW, nS, nQ), -np.inf)
res['DH_two_factor'] = np.full((nW, nS, nQ), -np.inf)             # max_t ( - Re L_DH,Q )
res['E_a_0.2'] = np.full((nW, nS, nQ), -np.inf)
cum = {n: np.full((nW, NP), -np.inf) for n in names}               # sigma = 1/2, cumulative in Q
raw = {n: np.full((nW, nQ), -np.inf) for n in names}               # max_t Re U at sigma=1/2 (draw only)
A_E = 0.2
CH = 100000
print('planned chunk allocation: %d x %d float64 x ~6 arrays = %.2f GB' % (CH, NP, CH*NP*8*6/1e9)); sys.stdout.flush()
tgrid_n = int(round((T1-T0)/DT))+1
t_all0 = time.time()
def reU_cols(c, r):   # c = cos(theta) matrix, r = p^-sigma ; returns log p * Re(z/(1-z)) per column
    return LP*(r*c - r*r)/(1 - 2*r*c + r*r)
for start in range(0, tgrid_n, CH):
    t = T0 + DT*np.arange(start, min(start+CH, tgrid_n))
    th = np.outer(t, LP)
    C = np.cos(th); S = np.sin(th)
    wmask = [(t >= a) & (t < b) if b < T1 else (t >= a) & (t <= b) for a, b in WIN]
    for js, sg in enumerate(SIG):
        s = sg + 1j*t
        rG = G(s).real; rGD = GDH(s).real
        r = PR**(-sg)
        for n in names:
            phi, amp = tw[n]
            if n == 'true': c = C
            else: c = C*np.cos(phi) + S*np.sin(phi)
            cols = reU_cols(c, r)*amp
            cs = np.cumsum(cols, axis=1)
            for jw, m in enumerate(wmask):
                if not m.any(): continue
                d = cs[m][:, qidx] - rG[m][:, None]
                res[n][jw, js] = np.maximum(res[n][jw, js], d.max(axis=0))
                if js == 0:
                    cum[n][jw] = np.maximum(cum[n][jw], (cs[m] - rG[m][:, None]).max(axis=0))
                    raw[n][jw] = np.maximum(raw[n][jw], cs[m][:, qidx].max(axis=0))
                if n == 'chi5_with_zeta_gamma':
                    d2 = cs[m][:, qidx] - rGD[m][:, None]
                    res['chi5_own_gamma'][jw, js] = np.maximum(res['chi5_own_gamma'][jw, js], d2.max(axis=0))
        # E_a: zeta(s+a) zeta(s-a)
        ca = np.cumsum(reU_cols(C, PR**(-(sg+A_E))) + reU_cols(C, PR**(-(sg-A_E))), axis=1)
        rGa = (G(s+A_E) + G(s-A_E)).real
        for jw, m in enumerate(wmask):
            if m.any():
                res['E_a_0.2'][jw, js] = np.maximum(res['E_a_0.2'][jw, js], (ca[m][:, qidx] - rGa[m][:, None]).max(axis=0))
        # DH two-factor form
        E = C - 1j*S
        z1 = (CHI*r)*E; z2 = (np.conj(CHI)*r)*E
        l1 = np.cumsum(-LP*z1/(1-z1), axis=1); l2 = np.cumsum(-LP*z2/(1-z2), axis=1)   # P'/P partial sums
        g1 = np.cumsum(-np.log(1-z1), axis=1); g2 = np.cumsum(-np.log(1-z2), axis=1)
        for jq, qi in enumerate(qidx):
            P1 = np.exp(g1[:, qi]); P2 = np.exp(g2[:, qi])
            f = c1*P1 + c2*P2
            L = GDH(s) + (c1*P1*l1[:, qi] + c2*P2*l2[:, qi])/f
            for jw, m in enumerate(wmask):
                if m.any():
                    res['DH_two_factor'][jw, js, jq] = max(res['DH_two_factor'][jw, js, jq], (-L.real[m]).max())
    print('chunk', start, 'elapsed %.0fs' % (time.time()-t_all0)); sys.stdout.flush()
def thr(arr):   # largest sigma on the grid with positive max, per window and Q ; None if contractive on the whole grid
    out = []
    for jw in range(nW):
        row = []
        for jq in range(nQ):
            pos = np.nonzero(arr[jw, :, jq] > 0)[0]
            row.append(None if len(pos) == 0 else float(SIG[pos[-1]]))
        out.append(row)
    return out
def firstQ(c):  # first prime Q at which the sigma=1/2 chain (primes <= Q) loses contractivity in the window
    out = []
    for jw in range(nW):
        pos = np.nonzero(c[jw] > 0)[0]
        out.append(None if len(pos) == 0 else int(PR[pos[0]]))
    return out
# torus sup thresholds (reserve at window bottom and top)
def torus_thr(q, t):
    P = PR[PR <= q]; lp = np.log(P)
    lo, hi = 0.5, 6.0
    f = lambda sg: float(np.sum(lp/(P**sg-1)) - G(np.array([sg+1j*t]))[0].real)
    if f(lo) <= 0: return 0.5
    for _ in range(60):
        mid = 0.5*(lo+hi)
        if f(mid) > 0: lo = mid
        else: hi = mid
    return hi
out = {'grid': {'T0': T0, 'T1': T1, 'DT': DT, 'sigma': SIG.tolist(), 'windows': WIN, 'Q': list(QCUT)},
       'threshold_sigma': {n: thr(res[n]) for n in res},
       'firstQ_sigma_half': {n: firstQ(cum[n]) for n in cum},
       'max_draw_sigma_half': {n: raw[n].tolist() for n in raw},
       'excess_sigma_half': {n: res[n][:, 0, :].tolist() for n in res},
       'curves': {n: res[n].tolist() for n in ('true', 'DH_two_factor', 'E_a_0.2', 'chi5_own_gamma', 'sign_rand_0', 'sign_adv_t5000')},
       'torus_threshold_sigma': {str(q): {str(t): torus_thr(q, t) for t in (10, 100, 1000, 10000)} for q in QCUT},
       'D_half': {str(q): float(np.sum(np.log(PR[PR <= q])/(np.sqrt(PR[PR <= q])-1))) for q in QCUT},
       'reserve_half': {str(t): float(G(np.array([0.5+1j*t]))[0].real) for t in (10, 100, 1000, 10000)}}
json.dump(out, open('test1.json', 'w'), indent=1)
print(json.dumps({k: out[k] for k in ('threshold_sigma', 'firstQ_sigma_half', 'max_draw_sigma_half', 'torus_threshold_sigma', 'D_half', 'reserve_half')}, indent=0))
