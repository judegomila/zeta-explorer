# Numerical check of the two sign lemmas used in Theorem B (exact formulas vs quadrature).
import mpmath as mp
mp.mp.dps = 30
# (i) anti-prime side: int_{-inf}^0 e^{c x}(e^{b x}-1) e^{i g x} dx = -b/((c+b+i g)(c+i g)); real part
#     = b (g^2 - c(c+b)) / (((c+b)^2+g^2)(c^2+g^2))  > 0 iff g^2 > c(c+b)
for (b, g, c) in [(0.1, 14.13, 1.0), (0.3085, 85.699, 1.0), (0.45, 3.0, 1.0), (0.2, 1.0, 1.0)]:
    num = mp.quadosc(lambda x: mp.exp(-c*x)*(mp.exp(-b*x)-1)*mp.cos(g*x), [0, mp.inf], omega=g)
    ex = b*(g*g-c*(c+b))/(((c+b)**2+g*g)*(c*c+g*g))
    print("b,g,c", b, g, c, "quad", mp.nstr(num, 12), "closed", mp.nstr(ex, 12))
# (ii) Frullani: int_0^inf e^{-(c+i g) y}(1-e^{-b y})/y dy = log((c+b+i g)/(c+i g))
b, g, c = 0.2, 5.0, 0.7
num = mp.quad(lambda y: mp.exp(-(c+1j*g)*y)*(1-mp.exp(-b*y))/y, mp.linspace(0, 40, 400))
print("frullani", mp.nstr(num, 12), mp.nstr(mp.log((c+b+1j*g)/(c+1j*g)), 12))
