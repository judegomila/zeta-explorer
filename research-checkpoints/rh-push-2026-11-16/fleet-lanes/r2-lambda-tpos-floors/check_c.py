# Numerical check of Theorem C (boundary reduction) and of the ladder identity.
import numpy as np
rng = np.random.default_rng(1)
def K(h, d, b): return (h-b)/(d*d+(h-b)**2) + (h+b)/(d*d+(h+b)**2)
def Pstrip(y, d, b):
    a = np.abs(np.pi*d/(2*y)); e = np.exp(-a)      # cosh(a)/(cosh(2a)+c) = e(1+e^2)/(1+e^4+2c e^2)
    return (2*np.pi/y)*np.cos(np.pi*b/(2*y))*e*(1+e*e)/(1+e**4+2*np.cos(np.pi*b/y)*e*e)
y = 0.6
# (1) D_b(d) = P_b(d) + (1/2pi) (P_b * r)(d) for a random signed symmetric measure
hs = rng.uniform(1.0, 4.0, 6); xs = rng.uniform(0, 3, 6); ws = rng.normal(0, 0.4, 6)
def r(d): return 4*y/(d*d+4*y*y) - sum(w*0.5*(K(h, d-x, y)+K(h, d+x, y)) for h, x, w in zip(hs, xs, ws))
def D(d, b): return 2*K(y, d, b) - sum(w*0.5*(K(h, d-x, b)+K(h, d+x, b)) for h, x, w in zip(hs, xs, ws))
u = np.linspace(-4000, 4000, 8000001); du = u[1]-u[0]; ru = r(u); worst = 0
for b in [0.0, 0.2, 0.45, 0.59]:
    for d in [0.0, 0.3, 1.7, 5.0]:
        conv = (Pstrip(y, d-u, b)*ru).sum()*du/(2*np.pi)
        lhs = D(d, b); rhs = Pstrip(y, d, b) + conv; worst = max(worst, abs(lhs-rhs))
print('max |D_b(d) - P_b(d) - (P_b*r)(d)/2pi| over 16 points (quadrature step %.0e): %.2e' % (du, worst))
# (2) ladder: 2 K_y(d,b) - sum_{k<Kmax, Abel} 2(-1)^k K_{(2k+3)y}(d,b) -> P_b(d)
for (d, b) in [(0.0, 0.0), (0.7, 0.3), (2.0, 0.55), (0.4, 0.599)]:
    k = np.arange(0, 400000); rr = 0.99999
    s = (2*(-1.0)**k*rr**k*K((2*k+3)*y, d, b)).sum()
    print('d=%.2f b=%.3f  2K_y - Abel ladder = %.6f   strip kernel P_b(d) = %.6f' % (d, b, 2*K(y, d, b) - s, Pstrip(y, d, b)))
# (3) same-height lattice: pull -y' = Lc coth(y Lc); certificate value on the lattice cannot exceed it
