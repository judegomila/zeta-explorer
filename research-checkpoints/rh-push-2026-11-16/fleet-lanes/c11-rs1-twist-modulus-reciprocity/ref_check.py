# Second pass (same author, different formulas): three-term identity for odd-character second moments at s = 1,
# L(1,chi) from the cotangent formula, no Dedekind sums. Planned memory < 50 MB.
import mpmath as mp, itertools
mp.mp.dps = 30
def odd_moment(a, b, c):
    # sum over odd chi mod prime c of |L(1,chi)|^2 chi(a) conj(chi(b)), characters built from a primitive root
    for g in range(2, c):
        x, o = g, 1
        while x != 1: x = x*g % c; o += 1
        if o == c-1: break
    ind = {}; x = 1
    for j in range(c-1): ind[x] = j; x = x*g % c
    tot = mp.mpc(0)
    for r in range(1, c-1, 2):
        chi = lambda n: mp.expjpi(mp.mpf(2*r*ind[n % c])/(c-1))
        L1 = mp.pi/(2*c)*sum(chi(m)*mp.cot(mp.pi*m/c) for m in range(1, c))
        tot += abs(L1)**2*chi(a)*mp.conj(chi(b))
    return tot
worst = 0
for (a, b, c) in [(3, 5, 7), (5, 7, 11), (3, 11, 13), (7, 13, 29), (5, 23, 31), (11, 17, 37)]:
    lhs = sum(z/(z-mp.mpf(1))*odd_moment(x, y, z) for (x, y, z) in [(a, b, c), (b, c, a), (c, a, b)])
    rhs = mp.pi**2*(mp.mpf(a*a+b*b+c*c)/(12*a*b*c) - mp.mpf(1)/4)
    print((a, b, c), "lhs", mp.nstr(lhs.real, 15), "rhs", mp.nstr(rhs, 15), "diff", mp.nstr(abs(lhs-rhs), 3))
