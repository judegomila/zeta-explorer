# Referee R3 numerical checks (own code; reads nothing from the packet).
import mpmath as mp, random, sys
from fractions import Fraction as F
mp.mp.dps = 30
out = []
def P(*a):
    s = " ".join(str(x) for x in a); print(s); sys.stdout.flush()

def K(h, d, b):
    return (h-b)/(d*d+(h-b)**2) + (h+b)/(d*d+(h+b)**2)

# ---- A. Poisson identities of Lemma 2.6
def pois(d, b, y):   # two-edge Poisson kernel of the strip |b|<y, equal data: inverse FT of cosh(b xi)/cosh(y xi)
    return (1/(2*y))*2*mp.cos(mp.pi*b/(2*y))*mp.cosh(mp.pi*d/(2*y))/(mp.cosh(mp.pi*d/y)+mp.cos(mp.pi*b/y))
P("A. Poisson kernel / boundary atom identity:  K_y/y = P[2/(d^2+4y^2)] + (pi/y) Pois")
worstA = 0
for (y, d, b) in [(mp.mpf('0.75'), mp.mpf('0.3'), mp.mpf('0.2')), (mp.mpf('0.1'), mp.mpf('0.05'), mp.mpf('0.09')),
                  (mp.mpf('0.01'), mp.mpf('0'), mp.mpf('0')), (mp.mpf('0.5'), mp.mpf('2.5'), mp.mpf('0.49')), (mp.mpf('0.3'), mp.mpf('-1'), mp.mpf('0'))]:
    # kernel as inverse FT, cross-check of closed form
    ft = mp.quad(lambda xi: mp.cos(d*xi)*mp.cosh(b*xi)/mp.cosh(y*xi), mp.linspace(0, 12000, 6001))/mp.pi if (y-b)*100 < 2 else mp.quad(lambda xi: mp.cos(d*xi)*mp.cosh(b*xi)/mp.cosh(y*xi), mp.linspace(0, 80/(y-b), 400))/mp.pi
    f = lambda s: 2/(s*s+4*y*y)
    conv = mp.quad(lambda s: pois(d-s, b, y)*f(s), [-mp.inf, d-5*y, d-y, d, d+y, d+5*y, mp.inf])
    lhs = K(y, d, b)/y
    rhs = conv + (mp.pi/y)*pois(d, b, y)
    worstA = max(worstA, abs(lhs-rhs)/abs(lhs), abs(ft-pois(d,b,y))/pois(d,b,y))
    P("  y=%s d=%s b=%s  K/y=%s  P[f]+atom=%s  relerr=%s  kernelFT relerr=%s" % (y, d, b, mp.nstr(lhs, 12), mp.nstr(rhs, 12), mp.nstr(abs(lhs-rhs)/lhs, 3), mp.nstr(abs(ft-pois(d,b,y))/pois(d,b,y),3)))
P("  worst relative error A:", mp.nstr(worstA, 3))

# ---- B. boundary inequality => strip inequality, random signed functionals
P("B. Lemma 2.6 on random signed functionals (value nodes and d/dh nodes), weights scaled so the boundary inequality is tight")
random.seed(20261117)
mp.mp.dps = 15
def make_R(nodes):
    def R(d, b):
        s = mp.mpf(0)
        for (h, a, w, der) in nodes:
            if der == 0:
                s += w/2*(K(h, d+a, b)+K(h, d-a, b))
            else:
                e = mp.mpf('1e-6')
                s += w/2*((K(h+e, d+a, b)+K(h+e, d-a, b))-(K(h-e, d+a, b)+K(h-e, d-a, b)))/(2*e)
        return s
    return R
worstB = -mp.inf; nB = 0; tightest = None
for trial in range(40):
    y = mp.mpf(random.choice(['0.75', '0.5', '0.2', '0.05', '0.01']))
    nodes = []
    for j in range(random.randint(1, 6)):
        h = y*(1+mp.mpf(random.uniform(0.05, 8)))
        a = mp.mpf(random.uniform(0, 1.95))
        w = mp.mpf(random.uniform(-1, 1.5))
        nodes.append((h, a, w, random.choice([0, 0, 1])))
    R0 = make_R(nodes)
    ds = [mp.mpf(k)/40 for k in range(-400, 401)] + [mp.mpf(k) for k in range(-200, 201, 7)]
    m = max(R0(d, y)*(d*d+4*y*y)/4 for d in ds)
    if m <= 0:
        continue
    lam = 1/m   # after scaling sup_d R(d,y)(d^2+4y^2)/4 = 1 on the grid (tight)
    nodes = [(h, a, w*lam, der) for (h, a, w, der) in nodes]
    R = make_R(nodes)
    for d in [mp.mpf(k)/8 for k in range(-80, 81)]:
        for bb in [0, 0.1, 0.3, 0.5, 0.7, 0.9, 0.99, 0.999]:
            b = y*mp.mpf(bb)
            ratio = (y/2)*R(d, b)/K(y, d, b)
            nB += 1
            if ratio > worstB:
                worstB = ratio; tightest = (trial, y, d, b)
P("  points tested:", nB, " max of (y/2)R/K_y over interior points:", mp.nstr(worstB, 12), " (must be <= 1 up to the d-grid resolution of the boundary sup)", tightest)

# negative control: a functional violating the boundary inequality somewhere must be able to violate the strip inequality
nodes = [(mp.mpf('0.9'), mp.mpf(0), mp.mpf(3), 0)]
R = make_R(nodes); y = mp.mpf('0.75')
P("  control (boundary inequality violated): boundary ratio at d=0:", mp.nstr(R(0, y)*(4*y*y)/4, 6), " interior ratio at b=0.7:", mp.nstr((y/2)*R(0, mp.mpf('0.7'))/K(y, 0, mp.mpf('0.7')), 6))

# ---- C. zero ODE, motion identity (38), current inequality, on a polynomial heat flow
P("C. polynomial model of d_t H = -d_zz H: zero velocity, motion identity, current inequality")
mp.mp.dps = 30
def heat_poly(coeffs, t):
    # coeffs low->high ; exp(-t d^2) p
    n = len(coeffs); res = [mp.mpc(0)]*n
    cur = list(coeffs); k = 0; fac = mp.mpf(1)
    while any(c != 0 for c in cur):
        for i, c in enumerate(cur): res[i] += fac*c
        nxt = [mp.mpc(0)]*n
        for i in range(2, n): nxt[i-2] = cur[i]*i*(i-1)
        cur = nxt; k += 1; fac = fac*(-t)/k
    return res
def poly_from_roots(roots):
    c = [mp.mpc(1)]
    for r in roots:
        new = [mp.mpc(0)]*(len(c)+1)
        for i, ci in enumerate(c):
            new[i+1] += ci; new[i] -= r*ci
        c = new
    return c
def roots_of(c):
    return mp.polyroots(list(reversed(c)), maxsteps=500, extraprec=200)
# even real polynomial: real zeros (one double), nonreal quadruples, one highest quadruple
x0, y0 = mp.mpf('7.3'), mp.mpf('0.6')
base = [mp.mpc(x0, y0), mp.mpc(x0, -y0), mp.mpc(-x0, y0), mp.mpc(-x0, -y0)]
others = []
for (a, b) in [(mp.mpf('5.1'), mp.mpf('0.6')), (mp.mpf('9.9'), mp.mpf('0.35')), (mp.mpf('2.2'), mp.mpf('0.1'))]:
    others += [mp.mpc(a, b), mp.mpc(a, -b), mp.mpc(-a, b), mp.mpc(-a, -b)]
for a in [mp.mpf('1.1'), mp.mpf('3.3'), mp.mpf('6.4'), mp.mpf('6.4'), mp.mpf('8.8'), mp.mpf('12.5')]:
    others += [mp.mpc(a), mp.mpc(-a)]
c0 = poly_from_roots(base+others)
z = mp.mpc(x0, y0)
vel_formula = 2*sum(1/(z-r) for r in base[1:]+others)
def track(t):
    rs = roots_of(heat_poly(c0, t))
    return min(rs, key=lambda r: abs(r-z))
eps = mp.mpf('1e-9')
vel_num = (track(eps)-track(-eps))/(2*eps)
P("  z' numeric:", mp.nstr(vel_num, 15), " 2*sum 1/(z-rho):", mp.nstr(vel_formula, 15), " abs diff:", mp.nstr(abs(vel_num-vel_formula), 3))
# motion identity: pairs
pairs = [(mp.mpf('5.1'), mp.mpf('0.6'), 1), (mp.mpf('9.9'), mp.mpf('0.35'), 1), (mp.mpf('2.2'), mp.mpf('0.1'), 1),
         (-mp.mpf('5.1'), mp.mpf('0.6'), 1), (-mp.mpf('9.9'), mp.mpf('0.35'), 1), (-mp.mpf('2.2'), mp.mpf('0.1'), 1), (-x0, y0, 1)]
for a in [mp.mpf('1.1'), mp.mpf('3.3'), mp.mpf('6.4'), mp.mpf('6.4'), mp.mpf('8.8'), mp.mpf('12.5')]:
    pairs += [(a, mp.mpf(0), mp.mpf(1)/2), (-a, mp.mpf(0), mp.mpf(1)/2)]
sumK = sum(wt*K(y0, x0-a, b) for (a, b, wt) in pairs)
qprime_formula = -2-4*y0*sumK
qprime_num = 2*y0*vel_num.imag
P("  q' numeric:", mp.nstr(qprime_num, 15), "  -2-4y sum K_y:", mp.nstr(qprime_formula, 15), " abs diff:", mp.nstr(abs(qprime_num-qprime_formula), 3))
# J identity and current inequality with a functional obeying the boundary inequality at y0
mp.mp.dps = 20
nodes = [(mp.mpf('1.0'), mp.mpf('0.4'), mp.mpf('1.0'), 0), (mp.mpf('3.0'), mp.mpf('1.2'), mp.mpf('-0.6'), 0), (mp.mpf('1.6'), mp.mpf('0'), mp.mpf('0.5'), 1)]
R0 = make_R(nodes)
m = max(R0(mp.mpf(k)/50, y0)*((mp.mpf(k)/50)**2+4*y0*y0)/4 for k in range(-1500, 1501))
nodes = [(h, a, w/m, der) for (h, a, w, der) in nodes]
R = make_R(nodes)
allroots = base+others
def S(xx, h):   # -Im P'/P at xx+ih
    zz = mp.mpc(xx, h); return -sum(1/(zz-r) for r in allroots).imag
def Jfun():
    s = mp.mpf(0)
    for (h, a, w, der) in nodes:
        if der == 0: s += w/2*(S(x0+a, h)+S(x0-a, h))
        else:
            e = mp.mpf('1e-6'); s += w/2*((S(x0+a, h+e)+S(x0-a, h+e))-(S(x0+a, h-e)+S(x0-a, h-e)))/(2*e)
    return s
J = Jfun(); Oown = R(mp.mpf(0), y0); sumR = sum(wt*R(x0-a, b) for (a, b, wt) in pairs)
P("  J:", mp.nstr(J, 12), " O_pair + sum_other R:", mp.nstr(Oown+sumR, 12), " abs diff:", mp.nstr(abs(J-Oown-sumR), 3))
rhs = -2-2*y0*y0*(J-Oown)
P("  current inequality q' <= -2-2q(J-O):  q' =", mp.nstr(qprime_formula, 12), " rhs =", mp.nstr(rhs, 12), " holds:", bool(qprime_formula <= rhs))
# pairwise check including the equal-height pairs (b=y, d!=0)
P("  per-pair K_y - (y/2)R, min over other pairs:", mp.nstr(min(K(y0, x0-a, b)-(y0/2)*R(x0-a, b) for (a, b, wt) in pairs), 6))

# ---- D. Hermite splitting backward in time at a repeated NONREAL zero
P("D. repeated nonreal zero, backward time: highest zero vs z0 + i sqrt(2 eps) lambda_max")
mp.mp.dps = 40
lam = {2: mp.mpf(1), 3: mp.sqrt(3), 4: mp.sqrt(3+mp.sqrt(6))}
for m_ in (2, 3, 4):
    z0 = mp.mpc('3.7', '0.4')
    roots = [z0]*m_+[mp.conj(z0)]*m_+[-z0]*m_+[-mp.conj(z0)]*m_+[mp.mpc('1.3'), mp.mpc('-1.3'), mp.mpc('6.0', '0.2'), mp.mpc('6.0', '-0.2'), mp.mpc('-6.0', '0.2'), mp.mpc('-6.0', '-0.2')]
    c = poly_from_roots(roots)
    for e in (mp.mpf('1e-4'), mp.mpf('1e-6'), mp.mpf('1e-8')):
        rs = [r for r in roots_of(heat_poly(c, -e)) if abs(r-z0) < mp.mpf('0.1')]
        top = max(rs, key=lambda r: r.imag)
        pred = z0+mp.mpc(0, 1)*mp.sqrt(2*e)*lam[m_]
        P("  m=%d eps=%s  count near z0=%d  Im(top)-Im z0=%s  sqrt(2eps)lam=%s  |top-pred|/eps=%s" % (m_, mp.nstr(e, 2), len(rs), mp.nstr(top.imag-z0.imag, 10), mp.nstr(mp.sqrt(2*e)*lam[m_], 10), mp.nstr(abs(top-pred)/e, 6)))
    # forward time: split is horizontal (no overshoot upward to first order)
    e = mp.mpf('1e-6')
    rs = [r for r in roots_of(heat_poly(c, e)) if abs(r-z0) < mp.mpf('0.1')]
    P("     forward eps=1e-6: max Im - Im z0 = %s (O(eps)), Re spread = %s" % (mp.nstr(max(r.imag for r in rs)-z0.imag, 6), mp.nstr(max(r.real for r in rs)-min(r.real for r in rs), 8)))
# p_m identity
w = mp.mpc('0.37', '-1.2')
for m_ in range(2, 8):
    pm = mp.factorial(m_)*sum(w**(m_-2*k)/(mp.factorial(k)*mp.factorial(m_-2*k)) for k in range(m_//2+1))
    he = (mp.mpc(0, 1)*mp.sqrt(2))**m_*mp.hermite(m_, (w/(mp.mpc(0, 1)*mp.sqrt(2)))/mp.sqrt(2))*2**(-mp.mpf(m_)/2)
    assert abs(pm-he) < mp.mpf('1e-25')*max(1, abs(pm)), (m_, pm, he)
P("  identity p_m(w) = (i sqrt2)^m He_m(w/(i sqrt2)) checked for m=2..7")

# ---- E. own-pair closed forms
mp.mp.dps = 30
for (h, a, w_, y) in [(mp.mpf('1.1'), mp.mpf('0.7'), mp.mpf('-2.3'), mp.mpf('0.74')), (mp.mpf('6'), mp.mpf('1.95'), mp.mpf('16.85'), mp.mpf('0.01'))]:
    q = y*y
    lhs = w_/2*(K(h, a, y)+K(h, -a, y)); rhs = 2*w_*h*(h*h+a*a-q)/((h*h+a*a-q)**2+4*a*a*q)
    assert abs(lhs-rhs) < mp.mpf('1e-25')*abs(lhs)
    assert abs(K(h, 0, y)-2*h/(h*h-q)) < mp.mpf('1e-25')
P("E. own-pair closed forms (31) and 2p/(p^2-q) agree with the pair kernel")

# ---- G. exact startup arithmetic
r0 = F(122615339047817575291909362361, 9903520314283042199192993792)
qinit = F(9, 16)+F(1, 10**12); tau = F(1, 10**14)
gap = F(1, 10**12)-r0*qinit*tau
claimed = F(921380903213784218478552545296645590637639, 990352031428304219919299379200000000000000000000000000)
P("G. startup gap exact equals paper value:", gap == claimed, " gap =", float(gap), " > 1/(2e12):", gap > F(1, 2*10**12), " tau < 1/2048000:", tau < F(1, 2048000))
T = F(22101, 204800); qT = F(7902377963830536747158643, 2**96)
P("   T + qT/2 == B*:", T+qT/2 == F(427693072077942473661578098491, 3961408125713216879677197516800), " T < 41/250:", T < F(41, 250), " T+qT/2 < 41/250:", T+qT/2 < F(41,250), " float r0:", float(r0))
# Lemma 4.1 spot check
for (q0, r, dl) in [(mp.mpf('0.5625'), mp.mpf('12.38'), mp.mpf('4e-7')), (mp.mpf('1e-4'), mp.mpf(2000), mp.mpf('2e-8')), (mp.mpf('1e-4'), mp.mpf(2000), mp.mpf('4.5e-5'))]:
    ell = q0-(2+r*q0)*dl
    Q = lambda u: (q0+2/r)*mp.e**(-r*u)-2/r
    assert ell > 0 and all(ell <= Q(dl*k/10) <= q0 for k in range(11))
P("   Lemma 4.1 spot checks pass")
