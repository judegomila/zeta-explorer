# c2-polydisc-leeyang-bound: decisive test. float64 (MEASURED). Planned memory: 15 accumulators x 2e6 float64 = 240 MB + temporaries < 1 GB.
import numpy as np, mpmath as mp, json, sys, time
T, H = 1.0e4, 0.005
t = np.arange(0.0, T + H/2, H); NT = t.size
print("planned allocation: %d grid points, 15 accumulators = %.0f MB" % (NT, 15*NT*8/1e6), flush=True)
SIG = [0.6, 0.75, 0.9]; CHK = [10, 30, 100, 1000, 10000]
S0 = 0.75 + 20j
def primes_upto(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**0.5)+1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0].astype(float)
ps = primes_upto(10000); rng = np.random.default_rng(20261117)
eps = rng.choice([-1.0, 1.0], ps.size)
KINDS = {
 'zeta':     dict(g=ps, ang=np.zeros(ps.size)),                    # chi = 1
 'liouville':dict(g=ps, ang=np.full(ps.size, np.pi)),              # chi(p) = -1
 'U_s0':     dict(g=ps, ang=eps*np.arccos(-ps**(S0.real-1.0)), shift=S0.imag),  # chi(p)=p^{i Im s0} e^{i eps phi_p}; zero at s0 (ap-global-bridge Thm C)
 'rand':     dict(g=ps, ang=rng.uniform(0, 2*np.pi, ps.size)),
 'beurling': dict(g=ps + rng.uniform(-0.5, 0.5, ps.size), ang=np.zeros(ps.size)),   # generalised primes g_k = p_k + U(-1/2,1/2)
}
def E1vec(w):
    w = np.asarray(w, complex); out = np.empty(w.shape, complex)
    big = np.abs(w) >= 40
    wb = w[big]; s = np.ones_like(wb); term = np.ones_like(wb)
    for k in range(1, 31):
        term = term*(-k)/wb; s += term
    out[big] = np.exp(-wb)/wb*s
    out[~big] = [complex(mp.e1(complex(x))) for x in w[~big]]
    return out
def renorm(kind, P, sig):   # log of renormaliser r so that G = E * exp(r)
    lp = np.log(P); s = sig + 1j*t
    if kind in ('zeta', 'beurling'): return E1vec((s-1)*lp)
    if kind == 'liouville': return -E1vec((s-1)*lp)
    if kind == 'U_s0': return -E1vec((s-S0)*lp)
    return np.zeros(NT, complex)
acc = {k: np.zeros((3, NT)) for k in KINDS}    # log|E_P^chi(sigma+it)|
res = []; t0 = time.time(); ci = 0
for i in range(ps.size):
    for k, d in KINDS.items():
        if k == 'liouville': continue
        g = d['g'][i]
        c = np.cos((t - d.get('shift', 0.0))*np.log(g) - d['ang'][i])   # Re of chi(p) p^{-it} direction
        for j, sg in enumerate(SIG):
            r = g**(-sg)
            acc[k][j] -= 0.5*np.log1p(-2*r*c + r*r)
            if k == 'zeta': acc['liouville'][j] -= 0.5*np.log1p(2*r*c + r*r)
    nxt = ps[i+1] if i+1 < ps.size else 1e99
    if ci < len(CHK) and nxt > CHK[ci]:
        P = CHK[ci]; ci += 1; q = ps[:i+1]; th = np.log(q).sum()
        for j, sg in enumerate(SIG):
            row = dict(P=P, sigma=sg, nprimes=int(q.size),
                       logB_polydisc_R1=float(-np.log1p(-q**(-sg)).sum()),            # Thm 1 with R_p = 1 (Euler stage): = E_P(sigma)
                       logB_polydisc_LY=float(-np.log1p(-q**(0.5-sg)).sum()),         # Thm 1 with R_p = p^{-1/2} (Lee-Yang radius)
                       logB_c1_LYderiv=float(th*(1.05-sg)/2),                          # c1 section 5, delta=0.05 (without log zeta(1+delta))
                       log_trivial_assign=float(P**(1-sg)/np.log(P)),                  # P^(1-sigma)/log P
                       log_trivial_sum=float((q**(-sg)).sum()))
            for k in KINDS:
                a = acc[k][j]; rn = renorm(k, P, sg).real; G = a + rn
                m1 = t >= 1.0
                row[k] = dict(sup_logE=float(a.max()), t_supE=float(t[a.argmax()]),
                              sup_logE_t_ge_1=float(a[m1].max()), t_supE_ge1=float(t[m1][a[m1].argmax()]),
                              sup_logG=float(G.max()), t_supG=float(t[G.argmax()]),
                              sup_logG_t_ge_1=float(G[m1].max()), inf_logG=float(G.min()), t_infG=float(t[G.argmin()]),
                              sup_logG_t_le_50=float(G[t <= 50].max()))
            res.append(row)
            print(json.dumps(row), flush=True)
        print("# P=%d done, %.0fs" % (P, time.time()-t0), flush=True)
json.dump(res, open('bound_test.json', 'w'), indent=1)
