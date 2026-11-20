# Check of the dual vector Psi_{rho,Lam} (Theorem C): l(G) = (1/2pi) int G(1/2+it) Psi(1/2+it) dt
#  (i) l(zeta A / s) = 0 for A(s) = sum c_theta theta^s, theta in [e^-Lam, 1]  (no condition A(1)=0)
#  (ii) l(F) = -F(rho) + O(e^{-Lam delta}) for F(s) = sum b_j/(s - 1/2 + x_j)
#  (iii) (1/2pi) int |Psi|^2 = Lam + O(log Lam)   (k = 0)
# k = extra decay exponent: p = (s-1)/s/(s+1)^k, q = s^2/(s-1)^2/(s-2)^k  (k=0 is the vector used in the proof)
import mpmath as mp, sys
mp.mp.dps = 20
g1 = mp.im(mp.zetazero(1)); rho = mp.mpc(0.5, g1)
chi = lambda s: mp.pi**(s-0.5)*mp.gamma((1-s)/2)/mp.gamma(s/2)
def mk(Lam, k):
    p = lambda s: (s-1)/s/(s+1)**k
    q = lambda s: s**2/(s-1)**2/(s-2)**k
    c0 = chi(rho)/q(rho); p0 = p(rho)
    def Psi(s):
        return (p(s)/p0 - mp.exp(Lam*(s-rho))*c0*q(s)/chi(s))/(s-rho)
    return Psi
def ell(G, Psi, T):
    f = lambda t: G(mp.mpc(0.5, t))*Psi(mp.mpc(0.5, t))
    pts = [-T] + [t for t in mp.arange(-T+1, T, 1)] + [T]
    pts = sorted(set(pts + [g1 - mp.mpf('0.37'), g1 + mp.mpf('0.41')]))
    tot = 0
    for a, b in zip(pts[:-1], pts[1:]):
        tot += mp.quad(f, [a, b])
    return tot/(2*mp.pi)
Lam = mp.log(6)
thetas = [(1, mp.mpf('0.7')), (mp.mpf(1)/2, mp.mpf('-1.3')), (mp.mpf('0.37'), mp.mpf('0.9')), (mp.mpf(1)/5, mp.mpf('2.1')), (mp.mpf(1)/6, mp.mpf('-0.4'))]
A = lambda s: sum(c*th**s for th, c in thetas)
G = lambda s: mp.zeta(s)*A(s)/s
x = [mp.mpf('0.8'), mp.mpf('1.7')]; b = [mp.mpf(1), mp.mpf('-2.5')]
F = lambda s: sum(bj/(s-0.5+xj) for bj, xj in zip(b, x))
nG = mp.sqrt(sum(mp.quad(lambda t: abs(G(mp.mpc(0.5, t)))**2, [a, a+2]) for a in range(-60, 60, 2))/(2*mp.pi))
print("||G|| (|t|<60) ~", mp.nstr(nG, 6), "  F(rho) =", mp.nstr(F(rho), 10))
for k, T in [(2, 150), (0, 400)]:
    Psi = mk(Lam, k)
    print("k=%d T=%d  l(zeta A/s) =" % (k, T), mp.nstr(ell(G, Psi, T), 6), flush=True)
    print("          l(F) + F(rho) =", mp.nstr(ell(F, Psi, T) + F(rho), 6), flush=True)
# a theta outside [e^-Lam,1] must break (i): control
A2 = lambda s: (mp.mpf(1)/9)**s
print("control theta=1/9 < e^-Lam, k=2: l =", mp.nstr(ell(lambda s: mp.zeta(s)*A2(s)/s, mk(Lam, 2), 150), 6), flush=True)
# (iii) norm
for Lm in [5, 20, 80]:
    Psi = mk(mp.mpf(Lm), 0)
    f = lambda t: abs(Psi(mp.mpc(0.5, t)))**2
    T = 3000
    h = mp.mpf(1)/ (8 if Lm < 50 else 16)
    tot = sum(mp.quad(f, [g1 + j*h, g1 + (j+1)*h]) for j in range(int(-40/h), int(40/h)))
    tot += sum(mp.quad(lambda t: 4/(t-g1)**2, [a, bb]) for a, bb in [(-mp.inf, g1-40), (g1+40, mp.inf)])/2  # mean of |1-e^{i th}|^2 = 2
    print("Lam=%d  (1/2pi)int|Psi|^2 = %s   (tail |t-g|>40 replaced by its mean 2/(t-g)^2)" % (Lm, mp.nstr(tot/(2*mp.pi), 8)), flush=True)
