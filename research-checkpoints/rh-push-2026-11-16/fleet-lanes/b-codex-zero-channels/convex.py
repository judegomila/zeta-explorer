"""Ball-arithmetic check of the Csordas-type convexity  V(t) = -log K(sqrt t) convex on t>0
for K = K_DH (and K = Phi as control).  With l = log K (even):
   V''(t) > 0  <=>  R(u) := l'(u) - u l''(u) > 0  (u>0),   R(u) = -int_0^u s l'''(s) ds.
Sufficient: l''''(s) < 0 on [0,d]  (so l''' < 0 on (0,d], l'''(0)=0)  and  l'''(s) < 0 on [d,U].
Arb balls over whole panels; theta series truncated at NMAX (omitted terms < 2^-PREC relative; not enclosed)."""
import sys, math
from flint import arb, arb_series, ctx
which = sys.argv[1]; PREC = 400; ctx.prec = PREC; Qo = 10; ctx.cap = Qo+1
U = arb(1); d = arb(1)/20; NP = int(sys.argv[2]) if len(sys.argv) > 2 else 1600
pi = arb.pi(); x = arb_series([0, 1])
s5 = arb(5).sqrt(); kap = ((10-2*s5).sqrt()-2)/(s5-1); coef = [arb(0), arb(1), kap, -kap, arb(-1)]
def lser(r):
    w = r.exp(); y = w**4
    if which == 'dh':
        c1 = pi/5; tot = arb_series([0])
        for n in range(1, 40):
            if n % 5:
                arg = -c1*n*n*y*((4*x).exp()-1)
                tot = tot + arg.exp()*((-c1*(n*n-1)*y).exp()*n*coef[n % 5])
        # K = w^3 e^{3x} e^{-c1 y} * tot  -> log K = 3r + 3x - c1 y + log(tot)
        return tot.log() + arb_series([3*r - c1*y, 3])
    else:
        c1 = pi; tot = arb_series([0]); E = (4*x).exp()
        for n in range(1, 20):
            arg = -c1*n*n*y*(E-1)
            tot = tot + arg.exp()*(2*pi*pi*n**4*y*E - 3*pi*n*n)*(-c1*(n*n-1)*y).exp()
        return tot.log() + arb_series([5*r - c1*y, 5])
def ipow(b, e):
    v = arb(1)
    for _ in range(e): v = v*b
    return v
def check(lo, hi):
    mid = (lo+hi)/2; D = (hi-lo)/2*arb(0, 1)
    Lm = lser(mid); Lw = lser(lo.union(hi))
    def encl(k):
        ff = lambda j: math.prod(range(j-k+1, j+1))
        v = arb(0)
        for j in range(k, Qo): v = v + ff(j)*Lm[j]*ipow(D, j-k)
        return v + ff(Qo)*Lw[Qo]*ipow(D, Qo-k)
    if not (lo > d): return encl(4) < 0, 4, encl(4)
    return encl(3) < 0, 3, encl(3)
stack = [(U*k/NP, U*(k+1)/NP) for k in range(NP)][::-1]
done = 0; w3 = w4 = None; minw = None; fail = 0
while stack:
    lo, hi = stack.pop()
    ok, k, v = check(lo, hi)
    if ok:
        done += 1
        up = float(v.upper())
        if k == 3: w3 = up if w3 is None else max(w3, up)
        else: w4 = up if w4 is None else max(w4, up)
        wd = float(hi-lo); minw = wd if minw is None else min(minw, wd)
    elif float(hi-lo) < 1e-7:
        fail += 1; print('FAIL', lo.str(8), v.str(8))
    else:
        m = (lo+hi)/2; stack.append((m, hi)); stack.append((lo, m))
print(which, ': certified panels', done, 'on [0,1]; failures', fail, '; min panel width %.2e' % minw,
      '; sup l4 on [0,1/20] <= %.6g ; sup l3 on [1/20,1] <= %.6g' % (w4, w3))
