"""Sign-regularity of (a) the translation kernel kappa(x-y) (Polya-frequency order) and
(b) the Hankel feature kernel g(s+t), g(t)=kappa(sqrt t) (the Gram feature of annulus_theta_coupling sec. 4),
on grids, for zeta and DH kernels. Function values are exact-series balls (no quadrature): signs are certified
up to theta-series truncation (terms below 2^-(0.72 prec+40) relative dropped)."""
import sys
from flint import arb, arb_mat, ctx
ctx.prec = 5000
KMAX = int(sys.argv[1]) if len(sys.argv) > 1 else 6
PI = arb.pi()
def kz(u):
    u = abs(u); e = u.exp(); pre = (arb('1.25')*u).exp(); s = arb(0)
    for k in range(1, 80):
        ex = PI*k*k*e
        s += PI*k*k*(2*PI*k*k*e-3)*pre*(-ex).exp()
        if float(ex.mid()) > 0.72*ctx.prec + 40: break
    return s
s5 = arb(5).sqrt(); TAU = ((10-2*s5).sqrt()-2)/(s5-1); C = [arb(0), arb(1), TAU, -TAU, arb(-1)]
def kd(u):
    u = abs(u); e = u.exp(); pre = (arb('0.75')*u).exp(); s = arb(0)
    for k in range(1, 4000):
        ex = PI*k*k*e/5
        if k % 5: s += k*C[k % 5]*(-ex).exp()
        if float(ex.mid()) > 0.72*ctx.prec + 40: break
    return pre*s
def odd_char(q, chi):
    def f(u):
        u = abs(u); e = u.exp(); pre = (arb('0.75')*u).exp(); s = arb(0)
        for k in range(1, 4000):
            ex = PI*k*k*e/q
            if chi[k % q]: s += k*chi[k % q]*(-ex).exp()
            if float(ex.mid()) > 0.72*ctx.prec + 40: break
        return pre*s
    return f
kc4 = odd_char(4, [0, 1, 0, -1]); kc3 = odd_char(3, [0, 1, -1])
def scan(name, entry, n, K, expect):
    for k in range(1, K+1):
        cnt = {'+': 0, '-': 0, '?': 0}; first = {}
        for i in range(n-k+1):
            for j in range(n-k+1):
                d = arb_mat([[entry(i+a, j+b) for b in range(k)] for a in range(k)]).det()
                s = '+' if d > 0 else ('-' if d < 0 else '?'); cnt[s] += 1
                first.setdefault(s, (i, j))
        ok = cnt[expect(k)] == sum(cnt.values())
        print(name, 'order', k, cnt, 'expected', expect(k), 'OK' if ok else 'FAIL first=%s' % (first,), flush=True)
        if not ok and k >= 3: break
h = arb('0.1')
for nm, kf in [('zeta', kz), ('dh', kd), ('L(chi_-4)', kc4), ('L(chi_-3)', kc3)]:
    n = 41
    tab = {d: kf(h*d) for d in range(-n, n+1)}
    scan(nm+' PF kappa(x-y), x,y in [0,4]', lambda i, j: tab[i-j], n, KMAX, lambda k: '+')
    tabg = {m: kf((h*m).sqrt()) for m in range(0, 2*n+2)}
    scan(nm+' Hankel g(s+t), s,t in [0.05,4.05]', lambda i, j: tabg[i+j+1], n, KMAX, lambda k: '+' if (k*(k-1)//2) % 2 == 0 else '-')
