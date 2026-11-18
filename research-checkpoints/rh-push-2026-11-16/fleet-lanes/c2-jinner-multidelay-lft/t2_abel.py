# T2: (i) check of the exact evaluation J_k; (ii) Abel-weighted first moment (Theorem A') for zeta and DH.
import mpmath as mp, math, cmath, json, sys, time
mp.mp.dps = 20
out = {}
# (i) (1/2pi) int_R chi_+(-3/2+it) k^{it} e^{-delta t} dt  =  k^{5/2} e^{5 i delta/2} exp(-2 pi k eta),  eta = i(1 - e^{i delta})
def chiplus(s): return (1j/2)*(2*mp.pi)**s/mp.pi*mp.exp(-1j*mp.pi*s/2)*mp.gamma(1 - s)
def chifull(s): return 2**s*mp.pi**(s - 1)*mp.sin(mp.pi*s/2)*mp.gamma(1 - s)
rows = []
for delta in [0.3, 0.15]:
    eta = 1j*(1 - cmath.exp(1j*delta))
    for k in [1, 2, 3, 6]:
        f = lambda t: chiplus(mp.mpc(-1.5, t))*mp.exp(1j*t*mp.log(k) - delta*t)
        I = mp.quad(f, mp.linspace(-60, 400, 461))/(2*mp.pi)
        pred = k**2.5*cmath.exp(2.5j*delta)*cmath.exp(-2*math.pi*k*eta)
        g = lambda t: chifull(mp.mpc(-1.5, t))*mp.exp(1j*t*mp.log(k) - delta*t)
        I1 = mp.quad(g, mp.linspace(1, 400, 400))/(2*mp.pi)     # the half-line integral J_k with t_0 = 1
        rows.append([delta, k, abs(complex(I) - pred), abs(pred), abs(complex(I1) - pred)])
        print('Jk', rows[-1]); sys.stdout.flush()
out['Jk_[delta,k,|full-line - formula|,|formula|,|J_k(t0=1) - formula|]'] = rows
# (ii) Abel moment
def primes(n): return [p for p in range(2, n + 1) if all(p % q for q in range(2, int(p**0.5) + 1))]
kap = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
chi = [0, 1, 1j, -1j, -1]; chib = [0, 1, -1j, 1j, -1]
c1, c2 = (1 - 1j*kap)/2, (1 + 1j*kap)/2
def fDH(s): return c1*mp.dirichlet(s, chi) + c2*mp.dirichlet(s, chib)
def run_sep(P, cp, deltas, func, name, pred):
    # h = sum_p c_p (1+p^{-z})/(1-p^{-z}); poles 2 pi k/log p, residue 2 c_p/log p
    tmax = 32/min(deltas); S = {d: 0 for d in deltas}; R = {d: 0 for d in deltas}; n = 0; t0 = time.time()
    for p in P:
        lp = math.log(p); r = 2*cp[p]/lp; k = 1
        while True:
            g = 2*math.pi*k/lp
            if g > tmax: break
            if g > 1.0:
                v = complex(func(mp.mpc(0.5, g))); n += 1
                for d in deltas:
                    w = math.exp(-d*g); S[d] += r*v*w; R[d] += r*w
            k += 1
    a1 = sum(cp[p] for p in P)
    rows = []
    for d in deltas:
        val = S[d]*2*math.pi*d
        rows.append({'delta': d, 'evals': n, '2pi*delta*sum': [val.real, val.imag], 'pred a1+conj(pairing)': [pred.real, pred.imag],
                     'pi*delta*sum_r': R[d]*math.pi*d, 'pred Re a1': a1})
        print(name, rows[-1])
    print(name, 'seconds', time.time() - t0); sys.stdout.flush()
    out[name] = rows
mode = sys.argv[1] if len(sys.argv) > 1 else 'all'
if mode in ('all', 'zeta'):
    P = primes(100); cp = {p: 1.0/p for p in P}
    a1 = sum(cp.values()); h12 = sum(cp[p]*(1 + p**-0.5)/(1 - p**-0.5) for p in P)
    run_sep(P, cp, [0.02, 0.01, 0.005], mp.zeta, 'zeta_separable_25primes_cp=1/p', complex(a1 + h12))
if mode in ('all', 'dh'):
    P = [2, 3, 7, 11]; cp = {p: 1.0 for p in P}
    def br(p):
        r = p**-0.5; x = chi[p % 5]; xb = chib[p % 5]
        return 1 + c1*(1 + x*r)/(1 - x*r) + c2*(1 + xb*r)/(1 - xb*r)      # a_1-part + sum_m f_m a_m m^{-1/2}, a_m real
    run_sep(P, cp, [0.04, 0.02], fDH, 'DH_separable_{2,3,7,11}', complex(sum(br(p) for p in P)))
    P = [2, 3, 7, 11]
    run_sep(P, cp, [0.04, 0.02], mp.zeta, 'zeta_separable_{2,3,7,11}', complex(sum(1 + (1 + p**-0.5)/(1 - p**-0.5) for p in P)))
if mode in ('all', 'two'):
    # non-separable two-delay example of c1 (test2.py), Abel weights
    PHI = 1.0; l2, l3 = math.log(2), math.log(3)
    def b(w1, w2): return (2*w1*w2 - w1 - w2)/(2 - w1 - w2)
    def hh(z):
        u = cmath.exp(1j*PHI)*b(cmath.exp(-z*l2), cmath.exp(-z*l3)); return (1 + u)/(1 - u)
    def u_t(t): return cmath.exp(1j*PHI)*b(cmath.exp(-1j*t*l2), cmath.exp(-1j*t*l3))
    def dudz(t, e=1e-6):
        f = lambda z: cmath.exp(1j*PHI)*b(cmath.exp(-z*l2), cmath.exp(-z*l3))
        return (f(1j*t + e) - f(1j*t - e))/(2*e)
    deltas = [0.02, 0.01, 0.005]; tmax = 32/min(deltas); dt = 0.002
    S = {d: 0 for d in deltas}; R = {d: 0 for d in deltas}; n = 0
    t = 1.0; g0 = cmath.phase(u_t(t))
    while t < tmax:
        t1 = t + dt; g1 = cmath.phase(u_t(t1))
        if g0*g1 < 0 and abs(g0 - g1) < 1.0:
            a, c, ga = t, t1, g0
            for _ in range(50):
                m = 0.5*(a + c); gm = cmath.phase(u_t(m))
                if ga*gm <= 0: c = m
                else: a, ga = m, gm
            gam = 0.5*(a + c); r = (-2/dudz(gam)).real; v = complex(mp.zeta(mp.mpc(0.5, gam))); n += 1
            for d in deltas:
                w = math.exp(-d*gam); S[d] += r*v*w; R[d] += r*w
        t, g0 = t1, g1
    pred = 1 + hh(0.5).conjugate(); rows = []
    for d in deltas:
        val = S[d]*2*math.pi*d
        rows.append({'delta': d, 'poles': n, '2pi*delta*sum': [val.real, val.imag], 'pred': [pred.real, pred.imag], 'pi*delta*sum_r': R[d]*math.pi*d, 'pred Re a1': 1.0})
        print('two-delay', rows[-1])
    out['zeta_two_delay_nonseparable_phi=1'] = rows
json.dump(out, open('t2_abel_%s.json' % mode, 'w'), indent=1, default=float)
