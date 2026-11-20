# (a) Mellin-transform check of zeros, independent of the factorisation; (b) backward heat on a |c|<2 member;
# (c) zeros of D = X + alpha X' in Re z > 0 for |c| <= 2 (anticausal block rank).
import mpmath as mp, json
mp.mp.dps = 25
half = mp.mpf(1)/2
OUT = {}
def psi(x):
    if x < 1: return x**(-half)*psi(1/x) + x**(-half)/2 - half
    return sum(mp.exp(-mp.pi*n*n*x) for n in range(1, 8))      # x >= 1: n = 8 term < e^{-200}
def mellin_family(s, q, c):
    sq = mp.sqrt(q)
    f = lambda x: sq*psi(q*q*x) + psi(x/(q*q))/sq + c*psi(x)
    A = (sq + 1/sq + c)/2
    I1 = mp.quad(lambda x: f(x)*x**(s/2-1), [1, 2, 4, 10, 30, 40*q*q])
    I0 = mp.quad(lambda x: (f(x) - A*x**(-half) + A)*x**(s/2-1), [0, mp.mpf(1)/(4*q*q), mp.mpf(1)/q, 1])
    return I1 + I0 + 2*A/(s-1) - 2*A/s
def xistar(s): return mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
rows = []
for q, c in ((2, mp.mpf('2.2')), (3, mp.mpf('2.2')), (3, mp.mpf('-2.5')), (5, mp.mpf('2.01'))):
    lq = mp.log(q); d0 = mp.acosh(abs(c)/2)/lq
    z0 = mp.mpc(d0, mp.pi/lq if c > 0 else 0)
    sgen = mp.mpc('0.8', '3.1')
    vgen = mellin_family(sgen, q, c); fgen = xistar(sgen)*(2*mp.cosh((sgen-half)*lq)+c)
    v0 = mellin_family(half+z0, q, c)
    rows.append({'q': q, 'c': float(c), 'Re_s_zero': mp.nstr(half+d0, 12), 'Im_s_zero': mp.nstr(z0.imag, 12),
                 '|Mellin at predicted zero|': mp.nstr(abs(v0), 5), '|xi*| there': mp.nstr(abs(xistar(half+z0)), 5),
                 'generic ratio Mellin/formula - 1': mp.nstr(abs(vgen/fgen-1), 5)})
    print('MELLIN', rows[-1], flush=True)
OUT['mellin'] = rows
# pole cancellation at c = -(sqrt q + 1/sqrt q)
OUT['pole_cancel'] = [{'q': q, 'c': mp.nstr(-(mp.sqrt(q)+1/mp.sqrt(q)), 12), 'delta0': mp.nstr(mp.acosh((mp.sqrt(q)+1/mp.sqrt(q))/2)/mp.log(q), 12)} for q in (2,3,5,11)]
print(OUT['pole_cancel'], flush=True)

# (b) backward heat: kernel e^{tau u^2/16} kappa_c(u), kappa_c(u) = kappa(u+2lq) + kappa(u-2lq) + c kappa(u)
def Phi(u):
    return sum((2*mp.pi**2*n**4*mp.exp(9*u) - 3*mp.pi*n**2*mp.exp(5*u))*mp.exp(-mp.pi*n**2*mp.exp(4*u)) for n in range(1, 7))
def kappa(u): return Phi(abs(u)/4)
mp.mp.dps = 18
def Xheat(z, q, c, tau):
    lq = mp.log(q)
    def w(v):
        return (mp.exp(tau*(v+2*lq)**2/16 + z*lq) + mp.exp(tau*(v-2*lq)**2/16 - z*lq) + c*mp.exp(tau*v*v/16))*mp.exp(z*v/2)
    return mp.quad(lambda v: kappa(v)*(w(v) + w(-v)), [0, 1, 2, 4, 6, 9])
hrows = []
q = 3; lq = mp.log(q); t0 = mp.pi/lq
# check tau = 0 against the product
z = mp.mpc('0.3', '2.0'); c = mp.mpf('1.9')
F0 = mp.quad(lambda v: kappa(v)*2*mp.cosh(z*v/2), [0, 1, 2, 4, 6, 9])
chk = abs(Xheat(z, q, c, 0)/(F0*(2*mp.cosh(z*lq)+c)) - 1)
print('HEAT tau=0 product check', mp.nstr(chk, 5), flush=True)
for c, tau in ((mp.mpf('1.9'), mp.mpf(0)), (mp.mpf('1.9'), mp.mpf('-0.25')), (mp.mpf('1.9'), mp.mpf('-1')), (mp.mpf('1.5'), mp.mpf('-1')),
               (mp.mpf('1.0'), mp.mpf('-1')), (mp.mpf('2.2'), mp.mpf('1')), (mp.mpf('2.2'), mp.mpf('0.25'))):
    amp = 2*mp.exp(tau*lq**2/4)
    f = lambda z: Xheat(z, q, c, tau)
    res = {'q': q, 'c': float(c), 'tau': float(tau), 'symbol-only threshold 2exp(tau lq^2/4)': mp.nstr(amp, 8)}
    # on-line test: f(it) is real; look for a sign change of f(it) on (0.5 t0, 1.5 t0) (pair of real zeros around t0)
    ts = [t0*(mp.mpf(1)/2 + mp.mpf(k)/40) for k in range(41)]
    vals = [mp.re(f(1j*t)) for t in ts]
    sc = sum(1 for i in range(40) if vals[i]*vals[i+1] < 0)
    res['sign changes of X(it), t in [t0/2, 3t0/2]'] = sc
    if sc == 0:
        try:
            r = mp.findroot(f, mp.mpc('0.3', t0), tol=1e-12)
            res['off-line zero'] = mp.nstr(r, 10)
        except Exception as e:
            res['findroot'] = str(e)[:80]
    hrows.append(res); print('HEAT', res, flush=True)
OUT['backward_heat'] = hrows

# (c) zeros of D = X(1 + alpha L) in the box 0.02 < Re z < 3, -0.37 < Im z < 40.3
mp.mp.dps = 20
def Lxi(s): return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
def xi(s): return half*s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def wind(F, x0, x1, y0, y1, hleft, h):
    corners = [mp.mpc(x0,y0), mp.mpc(x1,y0), mp.mpc(x1,y1), mp.mpc(x0,y1), mp.mpc(x0,y0)]
    tot = mp.mpf(0)
    def seg(a, fa, b, fb, depth):
        d = mp.arg(fb/fa)
        if abs(d) < 0.4 or depth > 40: return d
        m = (a+b)/2; fm = F(m)
        return seg(a, fa, m, fm, depth+1) + seg(m, fm, b, fb, depth+1)
    for k, (a, b) in enumerate(zip(corners[:-1], corners[1:])):
        n = int(abs(b-a)/(hleft if k == 3 else h)) + 1
        pts = [a + (b-a)*mp.mpf(j)/n for j in range(n+1)]; fs = [F(p) for p in pts]
        for j in range(n): tot += seg(pts[j], fs[j], pts[j+1], fs[j+1], 0)
    return tot/(2*mp.pi)
drows = []
for alpha in (mp.mpf(1), mp.mpf('0.3')):
    for c in ('-2.5', '-2', '-1.999', '-1', '0', '1', '1.999', '2', '2.001', '2.2'):
        cm = mp.mpf(c)
        D = lambda z: xi(half+z)*(2*mp.cosh(z*lq)+cm)*(1 + alpha*(Lxi(half+z) + 2*lq*mp.sinh(z*lq)/(2*mp.cosh(z*lq)+cm)))
        n = wind(D, mp.mpf('0.02'), mp.mpf(3), mp.mpf('-0.37'), mp.mpf('40.3'), mp.mpf('0.01'), mp.mpf('0.1'))
        drows.append({'alpha': float(alpha), 'c': float(cm), 'zeros of D in box': mp.nstr(n, 6)})
        print('DCOUNT', drows[-1], flush=True)
OUT['D_zero_count'] = drows
json.dump(OUT, open('controls.json', 'w'), indent=1)
