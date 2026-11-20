# Sign of the prime term <T v, v> on nonnegative tests v = e_x : zeta (Lambda(n) >= 0) vs DH (signed coefficients).
# prime term for e_x is  Z(x)/x  with Z(x) = -(log-derivative of the Dirichlet series)(1/2+x).
import mpmath as mp, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'euler'))
from dh import f
mp.mp.dps = 25
print("%6s %16s %16s" % ("x", "zeta: -z'/z(s)", "DH: -f'/f(s)"))
for x in ['0.6', '0.8', '1.0', '1.5', '2.0', '3.0', '5.0', '8.0']:
    x = mp.mpf(x); s = x + mp.mpf(1)/2
    print("%6s %16s %16s" % (mp.nstr(x, 3), mp.nstr(-mp.zeta(s, derivative=1)/mp.zeta(s), 8), mp.nstr(mp.re(-f(s, 1)/f(s)), 8)))
# first coefficients of -f'/f = sum lam(n) n^-s for DH
k = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
a = lambda n: [0, 1, k, -k, -1][n % 5]
N = 30
lam = [mp.mpf(0)]*(N+1)
# a(n) log n = sum_{d|n} lam(d) a(n/d)
for n in range(2, N+1):
    lam[n] = a(n)*mp.log(n) - sum(lam[d]*a(n//d) for d in range(2, n) if n % d == 0)
print("DH lam(n), n=2..12:", [mp.nstr(lam[n], 5) for n in range(2, 13)])
