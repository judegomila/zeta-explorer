# Lemma 2.5 on the actual H_0: -Im H_0'/H_0(x+ih) against the paired zero sum (no extra imaginary constant).
import mpmath as mp
mp.mp.dps = 25
N = 200
g = [mp.zetazero(n).imag for n in range(1, N+1)]
G = (g[-1]+mp.zetazero(N+1).imag)/2
def xi(s): return s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def S(x, h):
    z = mp.mpc(x, h); s = (1+1j*z)/2
    return -(1j/2*mp.diff(xi, s)/xi(s)).imag
def dens(u): return mp.log(u/(2*mp.pi))/(2*mp.pi)
for (x, h) in [(20, 1), (33.3, 3), (57, 6), (100, 0.8)]:
    x = mp.mpf(x); h = mp.mpf(h)
    term = lambda u: h/((x-2*u)**2+h*h)+h/((x+2*u)**2+h*h)
    head = sum(term(u) for u in g)
    tail = mp.quad(lambda u: dens(u)*term(u), [G, 10*G, mp.inf])
    lhs = S(x, h)
    print("x=%s h=%s  -Im H0'/H0=%s  zero sum(head+tail)=%s  diff=%s  (tail=%s)" % (x, h, mp.nstr(lhs, 12), mp.nstr(head+tail, 12), mp.nstr(lhs-head-tail, 3), mp.nstr(tail, 4)))
