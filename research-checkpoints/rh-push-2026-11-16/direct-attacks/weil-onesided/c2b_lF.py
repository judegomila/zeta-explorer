# l_{rho,Lam}(F) -> -F(rho) as Lam grows (k=0 vector of Theorem C); F = V(s-1/2), rates 0.8, 1.7
import mpmath as mp
mp.mp.dps = 20
g1 = mp.im(mp.zetazero(1)); rho = mp.mpc(0.5, g1)
chi = lambda s: mp.pi**(s-0.5)*mp.gamma((1-s)/2)/mp.gamma(s/2)
p = lambda s: (s-1)/s
q = lambda s: s**2/(s-1)**2
x = [mp.mpf('0.8'), mp.mpf('1.7')]; b = [mp.mpf(1), mp.mpf('-2.5')]
F = lambda s: sum(bj/(s-0.5+xj) for bj, xj in zip(b, x))
for Lam in [2, 10, 20, 40]:
    c0 = chi(rho)/q(rho); p0 = p(rho)
    Psi = lambda s: (p(s)/p0 - mp.exp(Lam*(s-rho))*c0*q(s)/chi(s))/(s-rho)
    f = lambda t: F(mp.mpc(0.5, t))*Psi(mp.mpc(0.5, t))
    T = 400; h = mp.mpf(1)/4
    tot = sum(mp.quad(f, [g1 + j*h + mp.mpf('0.013'), g1 + (j+1)*h + mp.mpf('0.013')]) for j in range(int(-T/h), int(T/h)))
    print("Lam=%d  l(F)+F(rho) = %s   |F(rho)| = %s   (truncation |t-g|<400: error <~ 1e-3)" % (Lam, mp.nstr(tot/(2*mp.pi) + F(rho), 5), mp.nstr(abs(F(rho)), 5)), flush=True)
