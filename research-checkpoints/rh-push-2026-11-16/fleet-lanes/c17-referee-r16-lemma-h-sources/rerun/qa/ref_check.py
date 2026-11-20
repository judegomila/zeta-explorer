# second-pass checks by routes different from checks.py (same lane; not an independent referee)
import sys, json, time
from mpmath import mp, mpf, mpc, zetazero, zeta, gamma, pi, exp, sqrt, quad, fabs, re, im, matrix, eigh, linspace, log
mp.dps = 30
out = {}; t0 = time.time()
def xi(s): return mpf(1)/2*s*(s-1)*pi**(-s/2)*gamma(s/2)*zeta(s)
def m_prod(s, g1, g2, eta):
    # product over the eight points in s, not the t^2 form
    gb = (g1+g2)/2
    num = mpf(1); den = mpf(1)
    for se in (1,-1):
        for sg in (1,-1):
            num *= (s - mpc(0.5+se*eta, sg*gb))
    for g in (g1,g2):
        for sg in (1,-1):
            den *= (s - mpc(0.5, sg*g))
    return num/den
Z = {n: zetazero(n).imag for n in (1,2,100,101)}
# 1. trivial zeros, pole at 1, reality: m finite, positive at s = 1, -2, -4, ..., -10 ; ZQ(s) real for real s
g1,g2,eta = Z[100],Z[101],mpf('0.25')
vals = [m_prod(mpf(x), g1, g2, eta) for x in (1,-2,-4,-6,-8,-10, 3, 0)]
out['m_at_real_points'] = dict(min_real=str(min(re(v) for v in vals)), max_abs_imag=str(max(fabs(im(v)) for v in vals)))
# 2. zero counts by the argument principle for the pair 100,101: rectangle across the line and rectangle right of the line
def count(F, x0, x1, y0, y1, n=400):
    tot = mpc(0)
    pts = [mpc(x0 + (x1-x0)*k/n, y0) for k in range(n)] + [mpc(x1, y0 + (y1-y0)*k/n) for k in range(n)] + \
          [mpc(x1 - (x1-x0)*k/n, y1) for k in range(n)] + [mpc(x0, y1 - (y1-y0)*k/n) for k in range(n)]
    vals = [F(p) for p in pts]; vals.append(vals[0])
    for a,b in zip(vals[:-1], vals[1:]):
        tot += mp.arg(b/a)
    return tot/(2*pi)
ZQ = lambda s: zeta(s)*m_prod(s, g1, g2, eta)
ylo, yhi = g1-mpf('0.9'), g2+mpf('0.9')
out['counts_pair_100_101'] = dict(
    ZQ_across=str(count(ZQ, mpf('-0.3'), mpf('1.3'), ylo, yhi)), zeta_across=str(count(zeta, mpf('-0.3'), mpf('1.3'), ylo, yhi)),
    ZQ_right=str(count(ZQ, mpf('0.6'), mpf('1.3'), ylo, yhi)), zeta_right=str(count(zeta, mpf('0.6'), mpf('1.3'), ylo, yhi)))
print('counts', time.time()-t0, flush=True)
# 3. Lemma C, heat form (t >= 0): Gaussian average along the horizontal line, zeta against ZQ, pair 100,101
def heat(F, z, t):
    # E F(1/2 + i (z + i sqrt(2t) N)) = int F(1/2 - sqrt(2t) n - Im z ... ) ; z complex
    sd = sqrt(2*t)
    f = lambda n: F(mpf(1)/2 + mpc(0,1)*(z + mpc(0,1)*sd*n))*exp(-n*n/2)/sqrt(2*pi)
    return quad(f, linspace(-9, 9, 37))
XiZQ = lambda s: xi(s)*m_prod(s, g1, g2, eta)
rows = []
for (z,t) in ((mpc(30,0.4), mpf('0.1')), (mpc(45,0.2), mpf('0.15')), (mpc(14.1,0.0), mpf('0.05'))):
    a = heat(xi, z, t); b = heat(XiZQ, z, t)
    sd = sqrt(2*t)
    absavg = quad(lambda n: fabs(xi(mpf(1)/2 + mpc(0,1)*(z + mpc(0,1)*sd*n)))*exp(-n*n/2)/sqrt(2*pi), linspace(-9,9,37))
    x = re(z); gb=(g1+g2)/2; d=(g2-g1)/2
    B = (eta**2+d**2)*((2*x**2+2*gb**2+1)/(g1**2-x**2)**2 + 1/(2*(g1**2-x**2)))
    rows.append(dict(z=str(z), t=str(t), H_zeta=str(a), abs_diff=str(fabs(a-b)), bound_B_times_E_abs=str(B*absavg), holds=bool(fabs(a-b) <= B*absavg), rel_diff=str(fabs(a-b)/fabs(a))))
out['heat_average_zeta_vs_ZQ'] = rows
print('heat', time.time()-t0, flush=True)
# 4. Schur property of M_ZQ(u) = f(u)/f(u+1) by Pick matrices at pseudo-random nodes (pair 1,2, eta 0.3: large defect)
h1,h2,et = Z[1],Z[2],mpf('0.3')
f = lambda u: xi(u)*m_prod(u, h1, h2, et)
M_ZQ = lambda u: f(u)/f(u+1)
M_Z = lambda u: xi(u)/xi(u+1)
# anti-control: multiply by the inverse of a Blaschke factor at a point that is not a zero (must break Schur)
a0 = mpc('0.8','16.0')
bl = lambda u: (u-a0)*(u-a0.conjugate())/((u+a0.conjugate())*(u+a0))
M_bad = lambda u: M_Z(u)/bl(u)
import random
random.seed(1601)
res = {}
for order in (6, 9):
    nodes = [mpc(0.05+1.2*random.random(), 12+10*random.random()) for _ in range(order)]
    # include a node near the quartet point
    nodes[0] = mpc(0.5+et+0.01, (h1+h2)/2+0.02)
    def pick(M):
        vals = [M(u) for u in nodes]
        P = matrix(order, order)
        for i in range(order):
            for j in range(order):
                P[i,j] = (1 - vals[i]*vals[j].conjugate())/(nodes[i] + nodes[j].conjugate())
        ev = eigh(P, eigvals_only=True)
        return min(ev), max(ev)
    r = {}
    for nm, M in (('zeta', M_Z), ('ZQ', M_ZQ), ('anti', M_bad)):
        lo, hi = pick(M); r[nm] = dict(min_eig=str(lo), max_eig=str(hi))
    res['order_%d'%order] = r
out['pick_matrices_scattering'] = res
print('pick', time.time()-t0, flush=True)
# 5. proposition M: eta(eps) from the bound (d -> 0)
tab = []
for eps in (mpf('1e-6'), mpf('1e-4'), mpf('1e-2')):
    r = exp(1)*sqrt(eps/8); et_ = (r/2)/(1+r)
    tab.append(dict(eps=str(eps), eta_eps=str(et_), check_bound=str(8*exp(-2)*et_**2/(mpf(1)/2-et_)**2), leading=str(exp(1)/(2*sqrt(8))*sqrt(eps))))
out['zero_margin_eta_of_eps'] = tab
out['seconds'] = time.time()-t0
json.dump(out, open(sys.argv[1],'w'), indent=1)
print(json.dumps(out, indent=1))
