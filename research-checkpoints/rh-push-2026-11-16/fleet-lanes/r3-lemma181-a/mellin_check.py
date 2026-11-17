"""Sanity check of the identity behind Lemma R (not a proof input):
S = sum_n chi(n) n^{-1/2} W(n/D) = (1/2 pi) int L(sigma+it, chi) W~(sigma-1/2+it) D^{sigma-1/2+it} dt,
with W(y) = y^2 e^{-y}, W~(s) = Gamma(s+2), chi the cubic character mod 7, and the resulting inequality
|S| <= D^{sigma-1/2} (1/2 pi) int |L(sigma+it)| |W~(sigma-1/2+it)| dt  for sigma in {1/2, 0.6, 0.75}."""
import mpmath as mp
mp.mp.dps = 15
q = 7
w = mp.exp(2j * mp.pi / 3)
# generator 3 mod 7: 3^k
ind = {pow(3, k, 7): k for k in range(6)}
chi = lambda n: 0 if n % q == 0 else w ** (ind[n % q] % 3)
def L(s):
    return sum(chi(a) * mp.hurwitz(s, mp.mpf(a) / q) for a in range(1, q)) / mp.mpf(q) ** s
D = mp.mpf(12)
S = mp.fsum(chi(n) * mp.mpf(n) ** -0.5 * (n / D) ** 2 * mp.exp(-n / D) for n in range(1, 1200))
print("S =", mp.nstr(S, 15), " |S| =", mp.nstr(abs(S), 12))
for sig in (mp.mpf("0.5"), mp.mpf("0.7")):
    f = lambda t: L(sig + 1j * t) * mp.gamma(sig - 0.5 + 2 + 1j * t) * D ** (sig - 0.5 + 1j * t)
    I = mp.quad(f, mp.linspace(-14, 14, 15)) / (2 * mp.pi)
    Iabs = mp.quad(lambda t: abs(f(t)), mp.linspace(-14, 14, 15)) / (2 * mp.pi)
    print(f"sigma={mp.nstr(sig,3)}: contour integral = {mp.nstr(I, 15)}, |.-S| = {mp.nstr(abs(I - S), 3)}, abs-integral = {mp.nstr(Iabs, 10)} >= |S|: {Iabs >= abs(S)}")
