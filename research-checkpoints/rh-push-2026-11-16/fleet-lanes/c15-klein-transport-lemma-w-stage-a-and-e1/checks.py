# c15 checks: (1) Lemma W constants; (2) Klein certificate firing threshold and actual RHS for xi; (3) E1 repair.
import json, os, mpmath as mp
HERE = os.path.dirname(os.path.abspath(__file__))
mp.mp.dps = 30
out = {}

# ---- (1) Lemma W: delta(T) = (1 + log(C log T)/log T)/(2A) -> 1/(2A)
rows = []
for A in (1.2, 4/3, 1.6, 2.0):
    for C in (1.0, 10.8):
        for T in (3e12, 1e30, 1e100, 1e1000):
            lt = mp.log(mp.mpf(T)) if T < 1e300 else mp.mpf(1000)*mp.log(10)
            kappa = mp.log(C*lt)/lt
            rows.append(dict(A=A, C=C, log10T=float(lt/mp.log(10)), kappa=float(kappa),
                             delta=float((1+kappa)/(2*A)), limit=float(1/(2*A))))
out['lemmaW_delta_of_T'] = rows
# controls: E_a (all N(T) zeros at distance a0), T-NR (2*T*log q/(2 pi) zeros at distance b)
ctl = []
for A in (1.01, 4/3, 2.0):
    for T in (1e3, 1e6, 1e12):
        N = T/(2*mp.pi)*mp.log(T/(2*mp.pi*mp.e))
        a0 = 0.05
        q, c = 2, 2.0506
        b = mp.acosh(c/2)/mp.log(q)
        nr = 2*T*mp.log(q)/(2*mp.pi)
        ctl.append(dict(A=A, T=T, Ea_ratio=float(2*N*mp.mpf(T)**(2*A*a0)/(T*mp.log(T))),
                        TNR_b=float(b), TNR_extra_ratio=float(nr*mp.mpf(T)**(2*A*b)/(T*mp.log(T)))))
out['lemmaW_controls_sum_over_TlogT'] = ctl

# ---- (2) Klein certificate kernel
def omega(r, a, h):
    beta = mp.pi*h/a; q = mp.e**(-mp.pi*r/a)
    return 2*mp.pi*r*mp.sin(beta)/(a*h)*q*(1-q*q)/(1+2*q*mp.cos(beta)+q*q)**2
# constant-amplitude model, best case mu = M = pi/(4R): sign of g(R) = int_0^R omega/(2aR) - int_R^inf omega/(2ar)
def g(R, a, h):
    core = mp.quad(lambda r: omega(r, a, h), [0, R])/(2*a*R)
    tail = mp.quad(lambda r: omega(r, a, h)/(2*a*r), [R, 2*R, 4*R+5*a, 60*a])
    return core - tail, core, tail
thr = []
for hh in (0.1, 0.5, 0.9):
    a = mp.mpf(1); h = hh*a
    Rs = mp.findroot(lambda R: g(R, a, h)[0], (0.05, 3.0), solver='bisect', tol=1e-10, verify=False)
    thr.append(dict(h_over_a=hh, Rstar_over_a=float(Rs), max_M_times_a=float(mp.pi/(4*Rs))))
out['constant_amplitude_threshold'] = thr

def xi(s):
    return s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def thp(a, v):  # theta_a'(v) = Re xi'/xi(1/2+a+iv)
    s = mp.mpc(0.5+a, v)
    return mp.re(1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s))
def logA(a, v):
    s = mp.mpc(0.5+a, v)
    return mp.re(mp.log(s*(s-1)/2) - s/2*mp.log(mp.pi) + mp.loggamma(s/2)) + mp.log(abs(mp.zeta(s)))
cert = []
mp.mp.dps = 20
for a, h in ((1.0, 0.5), (2.0, 1.0)):  # single-R illustration only; the scan over R is cert_scan.py
    for t in (100.0, 1000.0, 10000.0):
        # iterate window: R = pi/(4M) with M = sup on [t-R,t+R] (grid 41 points; MEASURED)
        R = mp.mpf(1.5)
        for _ in range(10):
            vals = [thp(a, t + R*(k-20)/20) for k in range(41)]
            M = max(vals); mu = min(vals); R = min(R, mp.pi/(4*M))
        vals = [thp(a, t + R*(k-20)/20) for k in range(41)]
        M = max(vals); mu = min(vals)
        L0 = 2*logA(a, t)
        amp = lambda r: mp.e**(logA(a, t-r) + logA(a, t+r) - L0)
        core = 2*mu/(mp.pi*a)*mp.quad(lambda r: omega(r, a, h)*amp(r), [0, R])
        tail = mp.quad(lambda r: omega(r, a, h)*amp(r)/(2*a*r), mp.linspace(R, R+12*a, 49))
        cert.append(dict(a=a, h=h, t=t, mu=float(mu), M=float(M), half_log=float(mp.log(t/(2*mp.pi))/2),
                         R=float(R), core=float(core), tail=float(tail), rhs_over_A2=float(core-tail),
                         core_over_tail=float(core/tail)))
        print(cert[-1], flush=True)
out['certificate_rhs_xi'] = cert

# ---- (3) E1 repair: finite even real X; R_a = X(w-a)/X(w+a)
mp.mp.dps = 40
def mkX(quads, lines):
    zs = []
    for (b, g_) in quads: zs += [mp.mpc(b, g_), mp.mpc(-b, g_), mp.mpc(b, -g_), mp.mpc(-b, -g_)]
    for g_ in lines: zs += [mp.mpc(0, g_), mp.mpc(0, -g_)]
    return zs
def Ra(zs, a, w):
    n = mp.mpf(1)
    for z in zs: n *= (w-a-z)/(w+a-z)
    return n
import random
rnd = random.Random(1501)
def sup_grid(zs, a):
    s = 0; ax = 0
    for _ in range(4000):
        w = mp.mpc(10**rnd.uniform(-4, 1), rnd.uniform(-8, 8))
        s = max(s, abs(Ra(zs, a, w)))
    for _ in range(300):
        ax = max(ax, abs(abs(Ra(zs, a, mp.mpc(0, rnd.uniform(-8, 8))))-1))
    return float(s), float(ax)
cases = {
 'strip_inside_a (beta=.2, a=.25)': (mkX([(0.2, 3)], [1, 5]), 0.25, True),
 'cancelling (beta=.35,.15; a=.25)': (mkX([(0.35, 3), (0.15, 3)], [1, 5]), 0.25, True),
 'chain (beta=.45,.25,.05; a=.1)': (mkX([(0.45, 3), (0.25, 3), (0.05, 3)], [1]), 0.1, True),
 'non-cancelling (beta=.35; a=.25)': (mkX([(0.35, 3)], [1, 5]), 0.25, False),
 'companion at other ordinate (beta=.35@3,.15@4; a=.25)': (mkX([(0.35, 3), (0.15, 4)], [1]), 0.25, False),
 'broken chain (beta=.45,.05; a=.1)': (mkX([(0.45, 3), (0.05, 3)], [1]), 0.1, False),
 'multiplicity deficit (.35 double,.15 single; a=.25)': (mkX([(0.35, 3), (0.35, 3), (0.15, 3)], [1]), 0.25, False),
}
e1 = []
for name, (zs, a, pred) in cases.items():
    s, ax = sup_grid(zs, a)
    # near predicted pole
    e1.append(dict(case=name, a=a, predicted_schur=pred, sampled_sup=s, axis_defect=ax, observed_schur=bool(s <= 1+1e-30)))
    print(e1[-1], flush=True)
out['e1_repair'] = e1
json.dump(out, open(os.path.join(HERE, 'checks.json'), 'w'), indent=1)
print('done')
