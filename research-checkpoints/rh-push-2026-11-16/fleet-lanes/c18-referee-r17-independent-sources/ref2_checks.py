"""Second-referee local checks (mpmath, 40 digits; not ball arithmetic). Lanes c17 window law, u6e, u6f, u3."""
import json, itertools
from mpmath import mp, mpf, mpc, quad, sinh, cosh, sin, cos, exp, log, pi, sqrt, zeta, si, findroot, acosh, jtheta, nstr, dirichlet, fabs, im, re, arg
mp.dps = 40
out = {}
# ---- lane 5 (window law) ----
u, b, x = mpf(3), mpf('0.7'), mpf('0.3')
def g_num(y): return quad(lambda s: exp(1j*s*x)*sinh(b*s)*exp(-1j*s*y), [-u/2, 0, u/2])
def g_cl(y): return -2j*im(sinh((b+1j*(y-x))*u/2)/(b+1j*(y-x)))
out['T2c_g_formula_maxdiff'] = float(max(abs(g_num(y)-g_cl(y)) for y in (mpf(-2), mpf('0.1'), mpf(5))))
nh = (sinh(u*b)/b-u)/2
z = mpc(x, b)
def g_c(zz): return quad(lambda s: exp(1j*s*x)*sinh(b*s)*exp(-1j*s*zz), [-u/2, 0, u/2])
val = (g_c(z)*g_c(z.conjugate()).conjugate() + g_c(z.conjugate())*g_c(z).conjugate())/nh
out['T2c_minus_sum_f_at_pair'] = nstr(-val.real, 15); out['T2c_mu'] = nstr(u*(sinh(u*b)/(u*b)-1), 15)
out['T2_roots_c_2_1_0.1'] = [nstr(findroot(lambda A: sinh(A)/A-1-c, 2), 10) for c in (2, 1, mpf('0.1'))]
# 0.29 constant: 2 * (1/2pi) * min Re sinc^2(zeta), |zeta| <= 1/2
mn = min(re((sin(w)/w)**2) for w in [mpf('0.5')*exp(1j*pi*k/200) for k in range(400)])
out['TP_min_Re_sinc2_on_circle_half'] = nstr(mn, 8); out['TP_const'] = nstr(2*mn/(2*pi), 6)
out['TP_5.85'] = nstr(mpf(6)/5*log(48*mp.e), 6)
# ---- lane 1 (u6e) ----
worst = max(float(-0.5*log(1+2*xx*(1-cos(t))/(1-xx)**2) + xx*(1-cos(t))/5) for xx in [mpf(k)/100 for k in range(1, 100)] for t in [mpf(j)*pi/20 for j in range(1, 41)])
out['u6e_max_of_logF_plus_x(1-cos)/5 (must be <= 0)'] = worst
def primerange(a, b):
    sv = bytearray([1])*b; sv[0:2] = b'\x00\x00'
    for i in range(2, int(b**0.5)+1):
        if sv[i]: sv[i*i::i] = bytearray(len(sv[i*i::i]))
    return [i for i in range(a, b) if sv[i]]
beta, tau = mpf('1.5'), mpf(1)
P = mpf(0)
for p in primerange(2, 200000):
    xx = mpf(p)**(-beta); P += -0.5*log(1+2*xx*(1-cos(tau*log(p)))/(1-xx)**2)
out['u6e_log_prod_Fp_beta1.5_tau1_P2e5'] = nstr(P, 8); out['u6e_log_zeta_ratio'] = nstr(log(abs(zeta(beta+1j*tau))/zeta(beta)), 8)
# ---- lane 2 (u6f) ----
def th(tau): return jtheta(3, 0, exp(1j*pi*2*tau)) if False else sum_theta(tau)
def sum_theta(tau):
    q = exp(2j*pi*tau); s = mpc(1); n = 1
    while True:
        t = q**(n*n)
        s += 2*t
        if abs(t) < mpf(10)**(-45): break
        n += 1
    return s
def points(f, p, x):
    tau = 1j*x/2
    return [f((tau+bb)/p**2) for bb in range(1, p*p)] + [f(tau+mpf(bb)/p) for bb in range(1, p)]
def reads(f, p, x):
    v = points(f, p, x); n = len(v)
    fx = lambda y: f(1j*mpf(y)/2).real
    S = sum(v); S_id = (p*p-1)*fx(x) - fx(x/p**2) + p*fx(p*p*x)
    logN = sum(log(abs(w)) for w in v); logN_id = (p*p+p)*log(fx(x)) - log(fx(x/p**2)) - log(fx(p*p*x))
    A = S/n
    J = log(abs(A)) - logN/n
    return dict(n=n, sum_rel_defect=float(abs(S-S_id)/abs(S_id)), lognorm_defect=float(abs(logN-logN_id)), A=nstr(A.real, 12), J=nstr(J, 12), min_abs_v=nstr(min(abs(w) for w in v), 8), max_abs_im_sum=float(abs(S.imag)))
theta = sum_theta
out['u6f_theta'] = {'p=%d x=%s' % (p, xx): reads(theta, p, mpf(xx)) for p in (3, 5) for xx in ('0.37', '2.1')}
out['u6f_theta_J_small_x'] = {str(p): [nstr(mpf(reads(theta, p, mpf('1e-3'))['J']), 10), nstr(log(mpf(p)/(p+2)), 10)] for p in (3, 5, 7)}
def eps_form(nn): return lambda tau: sum_theta(tau)*sum_theta(nn*tau)
ep = {}
for nn, p in ((5, 11), (5, 13), (6, 13), (5, 3), (6, 5)):
    f = eps_form(nn)
    ep['n=%d p=%d' % (nn, p)] = {xx: reads(f, p, mpf(xx)) for xx in ('0.02', '0.3', '1.7')}
out['u6f_epstein'] = ep
# zero of A (S = 0) for Epstein n=5, p=11: S(x) = (p^2-1) f(x) - f(x/p^2) + p f(p^2 x)
def Sfun(nn, p):
    f = lambda y: (sum_theta(1j*y/2)*sum_theta(1j*nn*y/2)).real
    return lambda y: (p*p-1)*f(y) - f(y/p**2) + p*f(p*p*y)
zA = {}
for nn, p in ((5, 11), (5, 13), (6, 13)):
    S = Sfun(nn, p)
    xs = [mpf(10)**(mpf(k)/20) for k in range(-60, 21)]
    sg = [S(y) > 0 for y in xs]
    ch = [k for k in range(len(xs)-1) if sg[k] != sg[k+1]]
    zA['n=%d p=%d' % (nn, p)] = [nstr(findroot(S, (xs[k], xs[k+1]), solver='anderson'), 12) for k in ch]
out['u6f_epstein_zero_of_A_where_J_is_minus_inf'] = zA
# Epstein zeta of [1,0,n]: Z = zeta L(chi_-4n) + genus term; off-line zero search
C4 = [0, 1, 0, -1]; C5 = [0, 1, -1, -1, 1]; C3 = [0, 1, -1]; C8 = [0, 1, 0, -1, 0, -1, 0, 1]
def chars(D):
    if D == -4: return C4
    if D == 5: return C5
    if D == -3: return C3
    if D == 8: return C8
    if D == -20: return [C4[k % 4]*C5[k % 5] for k in range(20)]
    if D == -24: return [C3[k % 3]*C8[k % 8] for k in range(24)]
def Z5(s): return zeta(s)*dirichlet(s, chars(-20)) + dirichlet(s, chars(-4))*dirichlet(s, chars(5))
def Z6(s): return zeta(s)*dirichlet(s, chars(-24)) + dirichlet(s, chars(-3))*dirichlet(s, chars(8))
def direct(nn, s, R=400): return sum(mpf(a*a+nn*bb*bb)**(-s) for a in range(-R, R+1) for bb in range(-R, R+1) if (a, bb) != (0, 0))/2
mp.dps = 20
out['u6f_epstein_zeta_formula_check_s=4'] = {'n=5': [nstr(Z5(4), 12), nstr(direct(5, 4), 12)], 'n=6': [nstr(Z6(4), 12), nstr(direct(6, 4), 12)]}
zz = {}
for name, Z in (('n=5', Z5), ('n=6', Z6)):
    found = []
    best = []
    for si_ in [mpf('0.55')+mpf(k)/20 for k in range(0, 9)]:
        for t in [mpf(k)/4 for k in range(8, 160)]:
            best.append((abs(Z(si_+1j*t)), si_, t))
    best.sort(key=lambda r: r[0])
    for a_, si_, t in best[:40]:
        try:
            r = findroot(Z, si_+1j*t)
        except Exception:
            continue
        if abs(r.real-mpf('0.5')) > mpf('1e-6') and 0 < r.real < 1.5 and abs(Z(r)) < mpf(10)**(-15) and all(abs(r-r2) > mpf('1e-6') for r2 in found):
            found.append(r)
    zz[name] = [[nstr(r.real, 12), nstr(r.imag, 12), nstr(abs(Z(r)), 3)] for r in sorted(found, key=lambda r: r.imag)[:6]]
out['u6f_epstein_zeta_offline_zeros_t<40'] = zz
mp.dps = 40
# ---- lane 3 (u3) ----
out['u3_kappa0_quad_1/2_minus_int_0^1'] = nstr(mpf(1)/2 - quad(lambda y: (sin(pi*y)/(pi*y))**2 if y != 0 else mpf(1), [0, 0.5, 1]), 12)
out['u3_kappa0_closed_1/2-Si(2pi)/pi'] = nstr(mpf(1)/2 - si(2*pi)/pi, 12)
W = {}
for d in ('0.1', '0.01', '0.001'):
    for bb in ('0.05', '0.45'):
        q = 1+mpf(d); c = q**mpf(bb)+q**(-mpf(bb)); s0 = mpf('0.5')+mpf(bb)+1j*pi/log(q)
        m = (q**(s0-mpf('0.5'))+c+q**(mpf('0.5')-s0))/(2+c)
        W[d+','+bb] = [nstr(s0.imag, 8), float(abs(m))]
out['u3_PropW_zero_height_absm'] = W
q = 1+sqrt(2); c = mpf('2.1'); bq = acosh(c/2)/log(q)
res = []
for a in (0, 1, mpf('2.5')):
    zc = exp(1j*a)
    # w = q^(s-1/2)/z = y, y = -q^b (c > 0): s = 1/2 + (log(-y z))/log q
    s0 = mpf('0.5') + (log(q**bq) + 1j*(pi + a))/log(q)
    m = zc.conjugate()*q**(s0-mpf('0.5')) + c + zc*q**(mpf('0.5')-s0)
    res.append([nstr(s0.real, 10), nstr(s0.imag, 8), float(abs(m))])
out['u3_LR_zeros'] = res
print(json.dumps(out, indent=1))
json.dump(out, open('ref2_checks.json', 'w'), indent=1)
