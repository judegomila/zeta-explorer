# DH control. (1) zero list to T=200 (on-line by sign changes of Lambda(1/2+it); off-line by Newton from Spira's list),
# (2) completeness check: Pick form vs zero sum on a low-order test, (3) PF tests (Theorem F analogue) for DH,
# (4) a negative one-sided test for DH and where each structured form breaks.
import mpmath as mp, sys, os, json, random, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'euler'))
from dh import f, Lam
mp.mp.dps = 30
half = mp.mpf(1)/2
def LDH(x):
    s = half + x
    return mp.log(5/mp.pi)/2 + mp.digamma((s+1)/2)/2 + f(s, 1)/f(s)
T = 200
import flint
flint.ctx.prec = 200
_c2, _c3 = flint.dirichlet_char(5, 2), flint.dirichlet_char(5, 3)
_k = (flint.arb(10) - 2*flint.arb(5).sqrt()).sqrt() - 2; _k = _k/(flint.arb(5).sqrt() - 1)
def Zf(t):   # Lambda_DH(1/2+it) (real), python-flint
    s_ = flint.acb(0.5, t)
    fv = (1 - flint.acb(0, 1)*_k)/2*_c2.l(s_) + (1 + flint.acb(0, 1)*_k)/2*_c3.l(s_)
    return ((flint.acb(5)/flint.acb.pi()).log()*s_/2).exp()*((s_+1)/2).gamma()*fv
def Zr(t): return Zf(t).real
ts = [flint.arb(k)/50 for k in range(1, T*50+1)]
vals = [Zr(t) for t in ts]
on = []
for i_ in range(len(ts)-1):
    if (vals[i_] > 0 and vals[i_+1] < 0) or (vals[i_] < 0 and vals[i_+1] > 0):
        lo, hi, flo = ts[i_], ts[i_+1], vals[i_]
        for _ in range(90):
            mid = (lo+hi)/2; fm = Zr(mid)
            if (fm > 0) == (flo > 0): lo, flo = mid, fm
            else: hi = mid
        on.append(mp.mpf(((lo+hi)/2).mid().str(30, radius=False)))
    elif not (vals[i_] > 0 or vals[i_] < 0):
        print("undetermined sign at", ts[i_])
off = []
for g in ['0.808517+85.699348j', '0.650830+114.163343j', '0.574356+166.479306j', '0.724258+176.702461j']:
    r = mp.findroot(lambda s: f(s), mp.mpmathify(complex(g)))
    off.append(r)
print("on-line zeros to %d: %d ; first: %s ; off-line (Re>1/2): %s" % (T, len(on), mp.nstr(on[0], 12), [mp.nstr(r, 12) for r in off]))
# main-term count
Nmain = lambda t: t/(2*mp.pi)*mp.log(5*t/(2*mp.pi*mp.e))
print("found %d (on) + %d (off, both sides) = %d ; main term N(T) ~ %s" % (len(on), 2*len(off), len(on)+2*len(off), mp.nstr(Nmain(T), 6)))
json.dump({"on": [mp.nstr(g, 25) for g in on], "off": [[mp.nstr(mp.re(r), 25), mp.nstr(mp.im(r), 25)] for r in off]}, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "dh_zeros_200.json"), "w"))
def zero_sum(V, parts=False):
    # centered zeros w = s - 1/2. on-line pair +-i g: 2|V(ig)|^2 ; off-line quartet: 4 Re V(w) conj V(-conj w)
    pos = sum(2*abs(V(mp.mpc(0, g)))**2 for g in on)
    neg = []
    for r in off:
        w = r - half
        neg.append(4*mp.re(V(w)*mp.conj(V(-mp.conj(w)))))
    return (pos, neg) if parts else pos + sum(neg)
# (2) completeness
x = [mp.mpf(2), mp.mpf('2.7'), mp.mpf('3.5'), mp.mpf('4.1')]
import itertools
# coefficients with sum b = sum b x = sum b x^2 = 0  => V ~ z^-4
b = [1/mp.fprod([x[k]-x[j] for k in range(4) if k != j]) for j in range(4)]
Lx = [LDH(t) for t in x]
QP = sum(b[i]*b[j]*(Lx[i]+Lx[j])/(x[i]+x[j]) for i in range(4) for j in range(4))
V = lambda z: sum(bj/(z+xj) for bj, xj in zip(b, x))
QZ = zero_sum(V)
print("(2) Pick form %s  zero sum (T<=200) %s  rel diff %s" % (mp.nstr(QP, 15), mp.nstr(QZ, 15), mp.nstr((QP-QZ)/QP, 3)))
# (3) PF tests for DH: nodes > 1.5
random.seed(11)
def pf(a, dps):
    mp.mp.dps = dps
    a = [mp.mpf(t) for t in a]; M = len(a)
    bb = [1/mp.fprod([a[k]-a[j] for k in range(M) if k != j]) for j in range(M)]
    Lx = [LDH(t) for t in a]
    Q = sum(bb[i]*bb[j]*(Lx[i]+Lx[j])/(a[i]+a[j]) for i in range(M) for j in range(M))
    first = 2/mp.fprod([abs(mp.mpc(t, on[0]))**2 for t in a])
    mp.mp.dps = 30
    return Q, first
print("(3) DH, PF tests: Q and Q/first-zero term")
for (M, lo, hi, dps) in [(2, 1.6, 4, 50), (6, 1.6, 6, 80), (12, 1.6, 8, 150), (20, 2, 40, 220)]:
    a = sorted(random.uniform(lo, hi) for _ in range(M))
    Q, f1 = pf([repr(t) for t in a], dps)
    print("  M=%2d nodes [%.1f,%.1f]: Q=%s  Q/first=%s" % (M, lo, hi, mp.nstr(Q, 10), mp.nstr(Q/f1, 10)), flush=True)
# (4) negative test: V = W(z) (z+a)^-M, W kills on-line zeros below H0
w0 = off[0] - half
for (a, H0) in [(2, 120), (2, 200)]:
    a = mp.mpf(a)
    kill = [g for g in on if g < H0]
    d = 2*len(kill)
    W = lambda z: mp.fprod([z*z + g*g for g in kill])
    import cmath
    pts_on = [mp.mpc(0, g) for g in on if g >= H0]
    lw_on = [(float(mp.re(mp.log(W(z)))), float(mp.re(mp.log(z+a)))) for z in pts_on]
    quart = []
    for r_ in off:
        w = r_ - half; w2 = -mp.conj(w)
        quart.append((complex(mp.log(W(w))), complex(mp.log(w+a)), complex(mp.log(W(w2))), complex(mp.log(w2+a))))
    best = None
    for M in range(d+2, d+3000):
        ref = (quart[0][0] - M*quart[0][1]).real + (quart[0][2] - M*quart[0][3]).real
        pos = sum(2*math.exp(min(2*(lw - M*la) - ref, 700)) for lw, la in lw_on)
        neg = [4*(cmath.exp(min(((q[0] - M*q[1]) + (q[2] - M*q[3]).conjugate()).real - ref, 700))*cmath.exp(1j*((q[0] - M*q[1]) + (q[2] - M*q[3]).conjugate()).imag)).real for q in quart]
        r = pos + sum(neg)
        if best is None or r < best[0]:
            best = (r, M, pos, neg)
    r, M, pr, nr = best
    print("(4) a=%s H0=%d (killed %d on-line pairs, deg W=%d): best M=%d ; (sum over zeros<=200)/|V(w0)V(-w0bar)| = %s ; on-line part %s ; quartets %s" % (a, H0, len(kill), d, M, mp.nstr(r, 8), mp.nstr(pr, 5), [mp.nstr(t, 5) for t in nr]), flush=True)
    # tail envelope for zeros above 200: |V(b+ig)|^2 <= |W|max ... evaluate sup over |b|<=1.5 on a grid, weight dN ~ (1/2pi) log(5g/2pi) dg, factor 4 per zero
    V = lambda z: W(z)*(z+a)**(-M)
    nrm = abs(V(w0))*abs(V(-mp.conj(w0)))
    env = lambda g: max(abs(V(mp.mpc(bb, g)))**2 for bb in (-1.5, 0, 1.5))
    tail = mp.quad(lambda g: 4*env(g)*mp.log(5*g/(2*mp.pi))/(2*mp.pi), [200, 250, 400, 1000, 10**4, mp.inf])
    print("    tail envelope (zeros above 200, MEASURED bound) / |V V| = %s" % mp.nstr(tail/nrm, 5), flush=True)
