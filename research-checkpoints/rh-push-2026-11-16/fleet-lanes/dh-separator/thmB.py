# Check Theorem B: Q_L(r) = sum b_i b_j (L(x_i+c)+L(x_j+c))/(x_i+x_j), r = spectral factor of e^{-c|l|} C_v.
import mpmath as mp, random, importlib.util, os, sys
spec = importlib.util.spec_from_file_location("sep1", os.path.join(os.path.dirname(os.path.abspath(__file__)), "sep1.py"))
sep1 = importlib.util.module_from_spec(spec); spec.loader.exec_module(sep1)
mp.mp.dps = 40
def spectral_factor(xs, b, c):
    n = len(xs); ys = [x + c for x in xs]
    beta = [b[i]*sum(b[j]/(xs[i]+xs[j]) for j in range(n)) for i in range(n)]
    # hhat(tau) = sum beta_i 2 y_i/(y_i^2+u), u=tau^2 ; numerator polynomial in u
    num = [mp.mpf(0)]*n
    for i in range(n):
        p = [mp.mpf(1)]
        for j in range(n):
            if j != i:
                p = [ (p[k-1] if k>0 else 0) + (p[k]*ys[j]**2 if k < len(p) else 0) for k in range(len(p)+1)]  # times (u + y_j^2), ascending
        for k in range(len(p)): num[k] += 2*beta[i]*ys[i]*p[k]
    while abs(num[-1]) < mp.mpf(10)**(-30): num.pop()
    roots_u = mp.polyroots(num[::-1], maxsteps=200, extraprec=200) if len(num) > 1 else []
    # N(u)=lead*prod(u-u_k), u=-s^2 on s=i tau.  P(s)=sqrt(lead)*prod(s+sqrt(-u_k)) with Re sqrt >=0
    assert num[-1] > 0, "leading coeff must be positive"
    zs = [mp.sqrt(-u) for u in roots_u]; zs = [z if mp.re(z) >= 0 else -z for z in zs]
    def P(s):
        r = mp.sqrt(num[-1])
        for z in zs: r *= (s + z)
        return r
    bp = []
    for i in range(n):
        den = mp.mpf(1)
        for j in range(n):
            if j != i: den *= (ys[j]-ys[i])
        bp.append(P(-ys[i])/den)
    return ys, bp, beta, roots_u
def Q(nodes, co, L):
    Lv = [L(x) for x in nodes]; n = len(nodes)
    return sum(co[i]*mp.conj(co[j])*(Lv[i]+mp.conj(Lv[j]))/(nodes[i]+mp.conj(nodes[j])) for i in range(n) for j in range(n))
xs = [mp.mpf('0.3'), mp.mpf('0.7'), mp.mpf('1.1')]; b = [mp.mpf(1), mp.mpf('-2.5'), mp.mpf('1.5')]
for c in (mp.mpf('0.5'), mp.mpf('0.375')):
    ys, bp, beta, ru = spectral_factor(xs, b, c)
    print("c =", c, " rates of r:", [mp.nstr(y,6) for y in ys])
    print("  coefficients of r:", [mp.nstr(x,15) for x in bp], " max |Im| =", mp.nstr(max(abs(mp.im(x)) for x in bp),3))
    # autocorrelation check: C_r(l)=sum_i b'_i R(y_i) e^{-y_i l} should equal sum beta_i e^{-y_i l}
    n=len(ys); be2=[bp[i]*sum(bp[j]/(ys[i]+ys[j]) for j in range(n)) for i in range(n)]
    print("  autocorrelation coefficient mismatch:", mp.nstr(max(abs(be2[i]-beta[i]) for i in range(n)),3))
    for name, L in (("zeta", sep1.L_z), ("DH", sep1.L_dh)):
        lhs = Q(ys, bp, L); rhs = sum(b[i]*b[j]*(L(xs[i]+c)+L(xs[j]+c))/(xs[i]+xs[j]) for i in range(3) for j in range(3))
        print("  %-4s Q_L(r) = %s   shifted Pick form = %s   diff = %s"%(name, mp.nstr(mp.re(lhs),15), mp.nstr(mp.re(rhs),15), mp.nstr(abs(lhs-rhs),3)))
# pair identity check (random numbers)
random.seed(1)
for _ in range(3):
    x,d,dl = [mp.mpf(random.uniform(0.05,1)) for _ in range(3)]
    phi = lambda u: u/(u*u+d*d)
    print("pair identity diff:", mp.nstr(phi(x-dl)+phi(x+dl) - 2*x*(x*x-dl*dl+d*d)/(((x-dl)**2+d*d)*((x+dl)**2+d*d)),3))
