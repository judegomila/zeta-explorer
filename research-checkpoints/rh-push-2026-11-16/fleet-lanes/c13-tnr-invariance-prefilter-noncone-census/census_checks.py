"""c13-tnr-invariance-prefilter-noncone-census: numeric checks. Single process, small memory
(largest allocation: numpy grids of 4001 float64 = 32 kB; minors enumerated one at a time)."""
import sys, json, itertools, random
from fractions import Fraction as Fr
import mpmath as mp
import numpy as np
OUT = sys.argv[1]
R = {}
mp.mp.dps = 30

# ---------- (a) T-NR object: not identically zero, FE, off-line zero ----------
def tnr_params(q, t):  # t = c*sqrt(q)
    c = mp.mpf(t) / mp.sqrt(q)
    return c
def D(s, q, c): return 1 + c * mp.power(q, mp.mpf(1)/2 - s) + mp.power(q, 1 - 2*s)
def F(s, q, c): return mp.zeta(s) * D(s, q, c)
def Lam(s, q, c): return mp.power(q, s) * mp.power(mp.pi, -s/2) * mp.gamma(s/2) * F(s, q, c)
R['a_object'] = []
for q, t in [(2, Fr(29, 10)), (3, Fr(18, 5))]:
    c = mp.mpf(t.numerator)/t.denominator/mp.sqrt(q)
    d0 = mp.acosh(c/2)/mp.log(q)
    s0 = mp.mpc(0.3, 2.0)
    fe = abs(Lam(s0, q, c) - Lam(1 - s0, q, c))/abs(Lam(s0, q, c))
    z = mp.mpc(mp.mpf(1)/2 + d0, mp.pi/mp.log(q))
    R['a_object'].append(dict(q=q, c=float(c), c_strip_max=float(mp.sqrt(q)+1/mp.sqrt(q)),
        F_at_2=float(F(2, q, c)), F_at_half_plus_3i=str(mp.nstr(F(mp.mpc(0.5, 3), q, c), 12)),
        FE_rel_defect=float(fe), zero_re=float(z.real), zero_im=float(z.imag),
        absF_at_zero=float(abs(F(z, q, c))), abs_zeta_at_zero=float(abs(mp.zeta(z)))))

# ---------- (b) Edrei-Thoma: exact minors of Toeplitz sections ----------
def series(num, den, N):
    """coefficients of num(x)/den(x), den[0] = 1, exact."""
    a = []
    for k in range(N):
        v = Fr(num[k]) if k < len(num) else Fr(0)
        for j in range(1, min(k, len(den)-1)+1):
            v -= Fr(den[j]) * a[k-j]
        a.append(v)
    return a
def det(M):
    n = len(M); M = [r[:] for r in M]; d = Fr(1)
    for i in range(n):
        p = next((r for r in range(i, n) if M[r][i] != 0), None)
        if p is None: return Fr(0)
        if p != i: M[i], M[p] = M[p], M[i]; d = -d
        d *= M[i][i]
        for r in range(i+1, n):
            f = M[r][i]/M[i][i]
            if f != 0:
                for cc in range(i, n): M[r][cc] -= f*M[i][cc]
    return d
def tp_test(a, N):
    T = [[a[i-j] if i >= j else Fr(0) for j in range(N)] for i in range(N)]
    nneg = 0; first = None; mn = Fr(0); nmin = 0; npos = 0
    for k in range(1, N+1):
        for rows in itertools.combinations(range(N), k):
            for cols in itertools.combinations(range(N), k):
                if any(rows[i] < cols[i] for i in range(k)): continue  # structurally zero
                nmin += 1
                v = det([[T[r][c_] for c_ in cols] for r in rows])
                if v > 0: npos += 1
                if v < 0:
                    nneg += 1
                    if first is None: first = dict(order=k, rows=rows, cols=cols, value=float(v))
                    if v < mn: mn = v
    return dict(N=N, minors_tested=nmin, positive=npos, negative=nneg, first_negative=first, most_negative=float(mn))
def contiguous(a, N, kmax):
    """Toeplitz minors det[a_{m+i-j}]_{i,j<k}, m = 0..N-1 (contiguous rows and columns)."""
    neg = []
    for k in range(1, kmax+1):
        for m in range(0, N):
            v = det([[a[m+i-j] if m+i-j >= 0 else Fr(0) for j in range(k)] for i in range(k)])
            if v < 0: neg.append((k, m, float(v)))
    return dict(kmax=kmax, shifts=N, negative_count=len(neg), first_negative=neg[0] if neg else None)
NS = 8; NC = 40
cases = {
 'zeta_p: 1/(1-x)': ([1], [1, -1]),
 'TNR q=2 t=c*sqrt2=29/10 (c=2.0506): (1+t x+2x^2)/(1-x)': ([1, Fr(29,10), 2], [1, -1]),
 'TNR q=3 t=c*sqrt3=18/5 (c=2.0785): (1+t x+3x^2)/(1-x)': ([1, Fr(18,5), 3], [1, -1]),
 'E_a p=3, p^a=3/2 (a=0.36907): 1/((1-3x/2)(1-2x/3))': ([1], [1, -Fr(3,2)-Fr(2,3), 1]),
 'NEG tempered twin q=2 t=2 (c=1.4142, zeros on the line): (1+2x+2x^2)/(1-x)': ([1, 2, 2], [1, -1]),
 'NEG TNR q=2 t=-29/10 (c=-2.0506): (1-t x+2x^2)/(1-x)': ([1, -Fr(29,10), 2], [1, -1]),
 'NEG L(chi), chi(p)=-1: 1/(1+x)': ([1], [1, 1]),
 'NEG tempered degree 2, trace 1: 1/(1-x+x^2)': ([1], [1, -1, 1]),
 'NEG tempered degree 2, trace 19/10: 1/(1-1.9x+x^2)': ([1], [1, -Fr(19,10), 1]),
}
R['b_edrei_thoma'] = {}
for name, (num, den) in cases.items():
    a = series(num, den, NC + 16)
    R['b_edrei_thoma'][name] = dict(first_coeffs=[str(x) for x in a[:6]], all_minors=tp_test(a, NS),
                                    contiguous=contiguous(a, NC, 6))
    print('b', name, R['b_edrei_thoma'][name]['all_minors']['negative'], R['b_edrei_thoma'][name]['contiguous']['negative_count'], flush=True)

# ---------- (c) kernels ----------
def Phi(u):
    u = mp.mpf(u); s = mp.mpf(0)
    for n in range(1, 30):
        term = (4*mp.pi**2*n**4*mp.exp(mp.mpf(9)*u/2) - 6*mp.pi*n**2*mp.exp(mp.mpf(5)*u/2))*mp.exp(-mp.pi*n**2*mp.exp(2*u))
        s += term
        if abs(term) < mp.mpf(10)**(-60) and n > 3: break
    return s
def Phie(u): return Phi(abs(u))
def xi(s): return s*(s-1)/2*mp.power(mp.pi, -s/2)*mp.gamma(s/2)*mp.zeta(s)
t0 = mp.mpf('3.7')
Xi_num = 2*mp.quad(lambda u: Phi(u)*mp.cos(t0*u), [0, 0.5, 1, 2, 3])
R['c_kernel_norm'] = dict(Xi_quad=float(Xi_num), xi_direct=float(mp.re(xi(mp.mpc(0.5, t0)))), xi_half=float(xi(mp.mpf(1)/2)))
def Phi_nr(u, q, c):
    l = mp.log(q); return c*Phie(u) + Phie(u + l) + Phie(u - l)
R['c_kernel'] = {}
grid = [mp.mpf(k)/200 for k in range(0, 321)]
def shape(f, label, check=None):
    vals = [f(u) for u in grid]
    lg = [mp.log(v) for v in vals]
    h = grid[1]-grid[0]
    d2 = [(lg[i+1]-2*lg[i]+lg[i-1])/h**2 for i in range(1, len(lg)-1)]
    d1 = [vals[i+1]-vals[i] for i in range(len(vals)-1)]
    inc = [float(grid[i]) for i in range(len(d1)) if d1[i] > 0]
    imax = max(range(len(d2)), key=lambda i: d2[i])
    R['c_kernel'][label] = dict(min_value=float(min(vals)), max_log_second_diff=float(d2[imax]), at_u=float(grid[imax+1]),
        log_concave_on_grid=bool(max(d2) < 0), increasing_points=len(inc), first_increase_u=(inc[0] if inc else None),
        unimodal_on_grid=(len(inc) == 0), samples=dict(u0=float(vals[0]), u_half_l=None))
    if check: R['c_kernel'][label]['fourier_check'] = check
shape(Phie, 'zeta Phi')
for q, t in [(2, Fr(29, 10)), (3, Fr(18, 5)), (2, Fr(2, 1))]:
    c = mp.mpf(t.numerator)/t.denominator/mp.sqrt(q); l = mp.log(q)
    num = mp.quad(lambda u: Phi_nr(u, q, c)*mp.cos(t0*u), [-4, -2, -1, 0, 1, 2, 4])
    ex = mp.re(xi(mp.mpc(0.5, t0)))*(c + 2*mp.cos(t0*l))
    shape(lambda u: Phi_nr(u, q, c), 'TNR q=%d c=%.4f' % (q, float(c)), dict(quad=float(num), exact=float(ex)))
# E_a kernel = (Phi e^{au}) * (Phi e^{-au}) on a float grid
a = 0.3; hh = 0.002; U = np.arange(-2.0, 2.0 + hh/2, hh)
print('planned allocation: numpy arrays of', U.size, 'float64, full convolution', 2*U.size-1, flush=True)
P = np.array([float(Phie(u)) for u in U])
conv = np.convolve(P*np.exp(a*U), P*np.exp(-a*U))*hh
Uc = np.arange(conv.size)*hh - 4.0
sel = (Uc >= 0) & (Uc <= 1.6)
lc = np.log(conv[(Uc >= -hh*1.5) & (Uc <= 1.6+hh*1.5)])
d2 = (lc[2:]-2*lc[1:-1]+lc[:-2])/hh**2
cc = conv[sel]
# check against Xi_a(t) = |xi(1/2+a+it)|^2
num = float(np.sum(conv*np.cos(float(t0)*Uc))*hh); ex = float(abs(xi(mp.mpc(0.5+a, t0)))**2)
R['c_kernel']['E_a a=0.3 (xi-normalised kernel, convolution)'] = dict(min_value=float(cc.min()), max_log_second_diff=float(d2.max()),
    log_concave_on_grid=bool(d2.max() < 0), increasing_points=int(np.sum(np.diff(cc) > 0)), unimodal_on_grid=bool(np.all(np.diff(cc) <= 0)),
    fourier_check=dict(quad=num, exact=ex))
# theta-normalised kernels with polar terms
def theta(x): return mp.jtheta(3, 0, mp.exp(-mp.pi*x))
def xis(s): return mp.power(mp.pi, -s/2)*mp.gamma(s/2)*mp.zeta(s)
def Estar(y, s):
    y = mp.mpf(y); tot = xis(2*s)*y**s + xis(2*s-1)*y**(1-s); n = 1
    while True:
        term = 4*mp.sqrt(y)*mp.power(n, s-mp.mpf(1)/2)*mp.sigma(1, n) if False else 4*mp.sqrt(y)*mp.power(n, s-mp.mpf(1)/2)*sum(mp.power(d, 1-2*s) for d in range(1, n+1) if n % d == 0)*mp.besselk(s-mp.mpf(1)/2, 2*mp.pi*n*y)
        tot += term; n += 1
        if abs(term) < mp.mpf(10)**(-28) or n > 400: break
    return tot
ys = [mp.mpf(k)/10 for k in range(2, 51)]
Ev = {a_: [Estar(y, mp.mpf(1)/2 + a_) for y in ys] for a_ in (mp.mpf('0.2'), mp.mpf('0.3'))}
R['c_theta_polar'] = dict(
    zeta_theta_min=float(min(theta(y) for y in ys)),
    Estar_i_0p7=float(Estar(1, mp.mpf('0.7'))), Estar_inversion_defect=float(abs(Estar(mp.mpf('1.3'), mp.mpf('0.7')) - Estar(1/mp.mpf('1.3'), mp.mpf('0.7')))),
    E_a_02_max_over_y=float(max(Ev[mp.mpf('0.2')])), E_a_03_max_over_y=float(max(Ev[mp.mpf('0.3')])),
    E_a_nonconstant_part_min_a03=float(min(Ev[mp.mpf('0.3')][i] - xis(mp.mpf('1.6'))*ys[i]**mp.mpf('0.8') - xis(mp.mpf('0.6'))*ys[i]**mp.mpf('0.2') for i in range(len(ys)))),
    xis_2a_a03=float(xis(mp.mpf('0.6'))), xis_1p6=float(xis(mp.mpf('1.6'))))

# ---------- (d) Laguerre expression  -(log Xi_X)''(t) at named points ----------
def Xi(t): return mp.re(xi(mp.mpc(0.5, t)))
def lag(f, t): 
    f0 = f(t); f1 = mp.diff(f, t); f2 = mp.diff(f, t, 2)
    return (f1**2 - f0*f2)/f0**2 if f0 != 0 else None
g1 = mp.im(mp.zetazero(1))
R['d_laguerre'] = dict(gamma1=float(g1))
for q, t in [(2, Fr(29, 10)), (3, Fr(18, 5))]:
    c = mp.mpf(t.numerator)/t.denominator/mp.sqrt(q); l = mp.log(q); tt = mp.pi/l
    R['d_laguerre']['TNR q=%d' % q] = dict(t=float(tt), zeta=float(lag(Xi, tt)),
        tnr=float(lag(lambda x: Xi(x)*(c + 2*mp.cos(x*l)), tt)), closed_form=float(lag(Xi, tt) - 2*l**2/(c-2)))
for a_ in (mp.mpf('0.2'), mp.mpf('0.3')):
    fa = lambda x: abs(xi(mp.mpc(0.5 + a_, x)))**2
    tt = g1
    f0 = fa(tt); f1 = mp.diff(fa, tt); f2 = mp.diff(fa, tt, 2)
    R['d_laguerre']['E_a a=%s at gamma1' % a_] = dict(value=float((f1**2 - f0*f2)/f0**2), minus_2_over_a2=float(-2/a_**2))
R['d_laguerre']['zeta_near_gamma1_pm0.5'] = [float(lag(Xi, g1 - 0.5)), float(lag(Xi, g1 + 0.5))]

# ---------- (e) Turan inequalities at 0 ----------
mp.mp.dps = 50
K = 12
def turan_from_moments(b):
    gam = [mp.factorial(k)*b[k]/mp.factorial(2*k) for k in range(len(b))]
    return [float((gam[k]**2 - gam[k-1]*gam[k+1])/gam[k]**2) for k in range(1, len(b)-1)]
bz = [2*mp.quad(lambda u: u**(2*k)*Phi(u), [0, 0.25, 0.5, 1, 2, 3]) for k in range(K)]
R['e_turan'] = {'zeta (T_k/gamma_k^2, k=1..)': turan_from_moments(bz)}
def shifted_moments(l, c):
    # int u^{2k} [c Phi(u) + Phi(u+l) + Phi(u-l)] du = c b_k + 2 sum_j C(2k,2j) l^{2k-2j} b_j
    return [c*bz[k] + 2*sum(mp.binomial(2*k, 2*j)*l**(2*k-2*j)*bz[j] for j in range(k+1)) for k in range(K)]
for q, t in [(2, Fr(29, 10)), (3, Fr(18, 5)), (2, Fr(2, 1))]:
    c = mp.mpf(t.numerator)/t.denominator/mp.sqrt(q)
    R['e_turan']['TNR q=%d c=%.4f' % (q, float(c))] = turan_from_moments(shifted_moments(mp.log(q), c))
for a_ in ('0.2', '0.3', '0.45'):
    a_ = mp.mpf(a_)
    ma = [mp.quad(lambda u: u**k*Phie(u)*mp.exp(a_*u), [-3, -1, -0.5, 0, 0.5, 1, 3]) for k in range(2*K)]
    # moments of the convolution of Phi e^{au} and Phi e^{-au}: binomial convolution of moments
    mb = [(-1)**k*ma[k] for k in range(2*K)]
    bc = [sum(mp.binomial(2*k, j)*ma[j]*mb[2*k-j] for j in range(2*k+1)) for k in range(K)]
    R['e_turan']['E_a a=%s' % a_] = turan_from_moments(bc)
mp.mp.dps = 30

# ---------- (f) dilation minors of the theta-normalised kernel ----------
def th_nr(x, q, c): return c*theta(x) + theta(x/q**2)/mp.sqrt(q) + mp.sqrt(q)*theta(x*q**2)
kern = {'zeta': theta,
        'TNR q=2 c=2.0506': lambda x: th_nr(x, 2, mp.mpf(29)/10/mp.sqrt(2)),
        'TNR q=3 c=2.0785': lambda x: th_nr(x, 3, mp.mpf(18)/5/mp.sqrt(3)),
        'E_a a=0.3': lambda y: Estar(y, mp.mpf('0.8')),
        'E_a a=0.2': lambda y: Estar(y, mp.mpf('0.7'))}
R['f_dilation_minors'] = {}
ug = [mp.mpf(k)/8 for k in range(-28, 29)]
random.seed(13)
nodes3 = [(sorted(random.uniform(-1.6, 1.6) for _ in range(3)), sorted(random.uniform(-1.6, 1.6) for _ in range(3))) for _ in range(120)]
nodes4 = [(sorted(random.uniform(-1.6, 1.6) for _ in range(4)), sorted(random.uniform(-1.6, 1.6) for _ in range(4))) for _ in range(60)]
for name, Kf in kern.items():
    g = [mp.log(abs(Kf(mp.exp(u)))) for u in ug]; h = ug[1]-ug[0]
    d2 = [(g[i+1]-2*g[i]+g[i-1])/h**2 for i in range(1, len(g)-1)]
    sgn = {}
    for order, nodes in ((3, nodes3), (4, nodes4)):
        pos = neg = 0; relmin = None
        for xs, ysn in nodes:
            M = mp.matrix(order, order)
            for i in range(order):
                for j in range(order): M[i, j] = Kf(mp.exp(mp.mpf(xs[i]) + mp.mpf(ysn[j])))
            dv = mp.det(M)
            if dv > 0: pos += 1
            elif dv < 0: neg += 1
        sgn[order] = dict(positive=pos, negative=neg)
    R['f_dilation_minors'][name] = dict(sign_of_kernel_at_1=float(mp.sign(Kf(1))), order2_min_d2_log=float(min(d2)), order2_max_d2_log=float(max(d2)),
                                        order3=sgn[3], order4=sgn[4])
    print('f', name, R['f_dilation_minors'][name], flush=True)
json.dump(R, open(OUT, 'w'), indent=1, default=str)
print('written', OUT)
