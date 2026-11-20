import numpy as np, math
from cluster import *
cell = Cell(math.e, 1.0, None)
# 1. gradient check
rng = np.random.default_rng(1)
n = 5; g = rng.normal(0, 3, n); b = rng.uniform(0.1, 2, n)
y = cell.grid(-20, 20); P = np.zeros((NU, len(y)))
x = np.concatenate([g, b]); lob = np.zeros(n); hib = np.full(n, 50.)
f0, gr = softmin_obj(x, cell, y, P, n, lob, hib, 3.0)
num = []
for i in range(2 * n):
    e = np.zeros(2 * n); e[i] = 1e-6
    num.append((softmin_obj(x + e, cell, y, P, n, lob, hib, 3.0)[0] - softmin_obj(x - e, cell, y, P, n, lob, hib, 3.0)[0]) / 2e-6)
print("grad max abs diff", np.abs(np.array(num) - gr).max(), "scale", np.abs(gr).max())
# 2. Poisson identity: infinite row spacing d, offset b: sum 2 Re F_u(y - j d + i b) = 2 pi / d if d < 2 pi / u
for d, bb in ((5.0, 3.0), (6.0, 6.0), (7.5, 2.0)):
    j = np.arange(-200000, 200001) * d
    yy = np.array([0.0, 0.7, 1.9, 3.1])
    for u in (0.5, 0.8, 1.0):
        G = cl(yy, [u], j, np.full(j.size, bb))[0]
        v1 = 2 * math.pi / d
        pred = 2 * math.pi / d * (1 + sum((1 - k * v1 / u) * 2 * math.cosh(k * v1 * bb) * np.cos(k * v1 * yy) for k in range(1, 10) if k * v1 < u))
        print("d", d, "b", bb, "u", u, "2pi/d", round(2 * math.pi / d, 6), "sum", np.round(G, 5), "pred", np.round(pred, 5))
# 3. pair identity against K_u
def K(u, w): return 1 / w - (1 - np.exp(-u * w)) / (u * w * w)
u = 0.9; yv = 1.3; bb = 0.7
print("pair", (K(u, bb + 1j * yv) + K(u, -bb + 1j * yv)).real, cl(np.array([yv]), [u], np.array([0.0]), np.array([bb]))[0, 0])
