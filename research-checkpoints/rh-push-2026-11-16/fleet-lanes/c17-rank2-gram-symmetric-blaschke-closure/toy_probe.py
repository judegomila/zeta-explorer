# probe (exact rationals): toy M(u) = (u+1)/(u-1) times a symmetric real pair. K_0 has rank 1: K_0(lam,mu) = q(lam) q(mu).
# Checks the rank-one identity exactly and finds the degree of q(lam) psi(lam) along lines (psi = prod over positive roots of g(u)(u-1)).
from flint import fmpq
def q(a, b=1): return fmpq(a, b)
def mk(gz):
    def g(u):
        r = q(1)
        for z in gz: r *= (u+z)
        return r
    def M(u): return g(-u)/g(u)*(u+1)/(u-1)
    def psi(l):
        r = q(1)
        for u in (l[0], l[1], l[0]+l[1]): r *= g(u)*(u-1)
        return r
    return M, psi
def kern(lam, mu, M):
    def orb(l):
        z1, z2 = l; m1, m2, m12 = M(z1), M(z2), M(z1+z2)
        return [(z1, z2, q(1)), (-z1, z1+z2, m1), (z1+z2, -z2, m2), (z2, -z1-z2, m12*m1), (-z1-z2, z1, m12*m2), (-z2, -z1, m1*m2*m12)]
    s = q(0)
    for (a, b, c) in orb(lam):
        for (a2, b2, c2) in orb(mu):
            s += c*c2/((a+a2)*(b+b2))
    return s
for name, gz in (('sym {1/4,3/4}', [q(1, 4), q(3, 4)]), ('sym {1/8,7/8}', [q(1, 8), q(7, 8)])):
    M, psi = mk(gz)
    mu0 = (q(3, 7), q(5, 11)); mu1 = (q(2, 13), q(9, 17)); a = (q(1, 3), q(2, 5)); c = (q(7, 9), q(1, 6))
    print(name, 'rank-one identity exact:', kern(a, mu0, M)*kern(c, mu1, M) == kern(a, mu1, M)*kern(c, mu0, M),
          ' sign of K(a,mu0) K(mu0,a)... K(a,mu0)^2/(K(a,a-type)) not available at real points; K(a,mu0) =', float(kern(a, mu0, M).p)/float(kern(a, mu0, M).q))
    for line in ((q(1), q(2, 3)), (q(1), q(1, 5)), (q(2), q(1))):
        vals = []
        for k in range(1, 40):
            x = q(k, 7)+q(1, 97); lam = (x*line[0]+q(1, 50), x*line[1]+q(1, 31))
            vals.append(kern(lam, mu0, M)*psi(lam))
        d = vals[:]; deg = None
        for order in range(1, 36):
            d = [d[i+1]-d[i] for i in range(len(d)-1)]
            if all(v == 0 for v in d): deg = order-1; break
        print('   line', line, ': degree of q psi along the line:', deg)
