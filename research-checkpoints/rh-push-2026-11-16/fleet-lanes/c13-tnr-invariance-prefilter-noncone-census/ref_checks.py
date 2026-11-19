"""Second-pass checks with code independent of census_checks.py / lattice_check.py (different routines and different data)."""
import sys, json, random, re
import mpmath as mp, sympy as sp
R = {}
# R1. Edrei-Thoma by the root criterion (Aissen-Schoenberg-Whitney-Edrei) and by sympy integer determinants on random minors of a 14x14 section
x = sp.symbols('x')
cases = {'TNR q=2 t=29/10': ((1 + sp.Rational(29,10)*x + 2*x**2), (1 - x)), 'TNR q=3 t=18/5': ((1 + sp.Rational(18,5)*x + 3*x**2), (1 - x)),
         'TNR q=5 t=23/5 (c=2.0572)': ((1 + sp.Rational(23,5)*x + 5*x**2), (1 - x)),
         'E_a p=3 (3/2, 2/3)': (sp.Integer(1), (1 - sp.Rational(3,2)*x)*(1 - sp.Rational(2,3)*x)), 'E_a p=2 (5/4, 4/5)': (sp.Integer(1), (1 - sp.Rational(5,4)*x)*(1 - sp.Rational(4,5)*x)),
         'tempered twin q=2 t=2': ((1 + 2*x + 2*x**2), (1 - x)), 'twin q=2 c=2 exactly, t=2 sqrt2 (not rational: skipped in minors)': None}
rng = random.Random(4242)
R['edrei_thoma'] = {}
for name, nd in cases.items():
    if nd is None: continue
    num, den = nd
    roots_num = [complex(r) for r in sp.Poly(num, x).nroots()] if sp.Poly(num, x).degree() > 0 else []
    roots_den = [complex(r) for r in sp.Poly(den, x).nroots()]
    crit = all(abs(r.imag) < 1e-12 and r.real < 0 for r in roots_num) and all(abs(r.imag) < 1e-12 and r.real > 0 for r in roots_den)
    ser = sp.series(num/den, x, 0, 30).removeO(); a = [ser.coeff(x, k) for k in range(30)]
    N = 14; neg = 0; tested = 0; first = None
    for _ in range(1500):
        k = rng.randint(2, 7); rows = sorted(rng.sample(range(N), k)); cols = sorted(rng.sample(range(N), k))
        M = sp.Matrix(k, k, lambda i, j: a[rows[i]-cols[j]] if rows[i] >= cols[j] else 0)
        d = M.det(method='bareiss'); tested += 1
        if d < 0:
            neg += 1
            if first is None: first = (k, rows, cols, str(d))
    R['edrei_thoma'][name] = dict(root_criterion_TP=bool(crit), numerator_roots=[str(r) for r in roots_num], random_minors=tested, negative=neg, first_negative=first)
# R2. Lemma L: exact Cauchy-Binet identity at one node set
mp.mp.dps = 80
def theta(z): return mp.jtheta(3, 0, mp.exp(-mp.pi*z))
q = 2; c = mp.mpf(29)/10/mp.sqrt(2); w = {-1: 1/mp.sqrt(q), 0: c, 1: mp.sqrt(q)}   # theta_NR(x) = sum_k w_k theta(x q^(2k))
x0 = mp.mpf('0.83'); a = [-1, 0, 2]; ys = [mp.mpf('0.41'), mp.mpf('1.07'), mp.mpf('2.9')]
Mnr = mp.matrix(3, 3)
for i in range(3):
    for j in range(3): Mnr[i, j] = sum(w[k]*theta(x0*mp.mpf(q)**(2*(a[i]+k))*ys[j]) for k in (-1, 0, 1))
ms = list(range(min(a)-1, max(a)+2)); tot = mp.mpf(0); terms = []
import itertools
for sel in itertools.combinations(ms, 3):
    W = mp.matrix(3, 3); H = mp.matrix(3, 3)
    for i in range(3):
        for l in range(3):
            W[i, l] = w.get(sel[l]-a[i], mp.mpf(0)); H[l, i] = theta(x0*mp.mpf(q)**(2*sel[l])*ys[i])
    dW = mp.det(W); dH = mp.det(H); tot += dW*dH
    if dW != 0: terms.append((sel, float(dW), float(mp.sign(dH))))
R['cauchy_binet'] = dict(det_direct=mp.nstr(mp.det(Mnr), 20), det_sum=mp.nstr(tot, 20), rel_defect=float(abs(mp.det(Mnr)-tot)/abs(tot)),
                         nonzero_terms=len(terms), min_detW=min(t[1] for t in terms), signs_detH=sorted(set(t[2] for t in terms)))
# R3. three-point violation of log-concavity / monotonicity of the T-NR xi-kernel
def Phi(u):
    u = abs(mp.mpf(u)); return mp.nsum(lambda n: (4*mp.pi**2*n**4*mp.exp(mp.mpf(9)*u/2) - 6*mp.pi*n**2*mp.exp(mp.mpf(5)*u/2))*mp.exp(-mp.pi*n**2*mp.exp(2*u)), [1, mp.inf])
R['three_point'] = {}
for q_, c_ in [(2, mp.mpf(29)/10/mp.sqrt(2)), (3, mp.mpf(18)/5/mp.sqrt(3)), (3, mp.mpf('2.2')), (5, mp.mpf(23)/5/mp.sqrt(5))]:
    l = mp.log(q_); f = lambda u: c_*Phi(u) + Phi(u+l) + Phi(u-l)
    v0, vh, v1 = f(0), f(l/2), f(l)
    R['three_point']['q=%d c=%s' % (q_, mp.nstr(c_, 6))] = dict(f0=float(v0), f_half=float(vh), f_l=float(v1),
        midpoint_log_defect=float(mp.log(vh) - (mp.log(v0)+mp.log(v1))/2), increasing_from_half_to_l=bool(v1 > vh))
# R4. E* by its functional equation in s, and local Lambda_F
def xis(s): return mp.power(mp.pi, -s/2)*mp.gamma(s/2)*mp.zeta(s)
def Estar(y, s):
    return xis(2*s)*y**s + xis(2*s-1)*y**(1-s) + 4*mp.sqrt(y)*mp.nsum(lambda n: mp.power(n, s-mp.mpf(1)/2)*sum(mp.power(d, 1-2*s) for d in range(1, int(n)+1) if int(n) % d == 0)*mp.besselk(s-mp.mpf(1)/2, 2*mp.pi*n*y), [1, 60])
mp.mp.dps = 30
R['Estar'] = dict(E_1_07=float(Estar(1, mp.mpf('0.7'))), E_1_03=float(Estar(1, mp.mpf('0.3'))), E_2_08=float(Estar(2, mp.mpf('0.8'))), E_half_08=float(Estar(mp.mpf('0.5'), mp.mpf('0.8'))))
q_, c_ = 3, mp.mpf('2.2'); al = (-c_*mp.sqrt(q_) + mp.sqrt(c_**2*q_ - 4*q_))/2; be = q_/al
R['Lambda_F_q3_c2.2_over_logq'] = [float(1 - al**k - be**k) for k in (1, 2, 3, 4)]
# R5. quoted record phrases exist in the map
mp_text = open(sys.argv[2]).read()
phr = ['fails for NR with c > 2', 'kills E_a and NR at the holomorphy step', 'DH, EA, NR (Lemma R holds for each)', 'First negative nested Pick order 4',
       'T-NR passes every step that holds for zeta with general twists prime to p', 'both fail only PERM', 'DH, HEAT, E_a, T-NR fail one step earlier, at the zero-free conclusion',
       'DH*, HEAT*, EA*, NR* (identity holds)', 'identity holds for DH, EA; HEAT*, NR*', 'DH (identity holds); HEAT, EA, NR argued', 'MEASURED for DH, TW-, random signs, E_a, T-NR (sign unchanged by the restriction)',
       'negative directions appear for the Liouville twist (2, relative size 1e-8), T-NR, E_a', 'Beurling, T-NR, the phase-rotated transfer operator, theta^w not run', 'DH, heat, E_a, T-NR, Beurling not run',
       'THW, NR, B, EA not run', 'DH, HEAT, EA, NR (criterion holds)', 'T-NR passes the weight-1 positivity as a finite Hecke polynomial at q', 'DH, HEAT, E_a, T-NR, U, WT, THIN, DEL, EIS-w pass the form at height t']
R['quotes_found'] = {p: (p in mp_text) for p in phr}
json.dump(R, open(sys.argv[1], 'w'), indent=1, default=str)
for k, v in R.items(): print(k, json.dumps(v, default=str)[:1800])
