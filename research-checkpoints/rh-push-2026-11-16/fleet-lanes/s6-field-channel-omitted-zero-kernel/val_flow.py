"""validation of the regularised backward flow on cases with a known answer"""
import math, numpy as np, flow
# 1. lone pair: t_c = g^2/8
g = 0.0377
F = flow.RegFlow(np.array([[0.0, g]]), np.array([[[0, 1]]]))
tc, p = F.run_until_collision(1.0, scale=g)
print('lone pair', tc, g * g / 8, tc / (g * g / 8) - 1)
# 2. symmetric triple -d, 0, d : centre fixed, x(t) of the outer: d(x)/dt = -2(1/x + 1/(2x)) = -3/x -> x^2 = d^2 - 6t; pair (0, d): collision at d^2/6
d = 0.05
F = flow.RegFlow(np.array([[-d, 0.0, d]]), np.array([[[1, 2]]]))
tc, p = F.run_until_collision(1.0, scale=d)
print('triple', tc, d * d / 6, tc / (d * d / 6) - 1)
# 3. pair with one distant spectator at R: du/dt = -8 + 4u/((c-R)^2-u/4) ; compare with unregularised RK4 of the 3-body flow stopped before collision
x = np.array([0.0, 0.03, 0.9]); F = flow.RegFlow(x[None, :], np.array([[[0, 1]]]))
tc, p = F.run_until_collision(1.0, scale=0.03)
z = x.astype(float).copy(); T = 0.9 * tc; n = 200000; h = T / n
def v(z): 
    D = z[:, None] - z[None, :]; np.fill_diagonal(D, np.inf); return -2 * (1 / D).sum(1)
for _ in range(n):
    k1 = v(z); k2 = v(z + 0.5 * h * k1); k3 = v(z + 0.5 * h * k2); k4 = v(z + h * k3); z = z + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
F2 = flow.RegFlow(x[None, :], np.array([[[0, 1]]])); S = F2.S
for _ in range(2000): S = F2.rk4(T / 2000, S)
Z = F2.positions(S)[0]
print('3-body at 0.9 t_c: plain', z, 'regularised', Z.real, 'max diff', np.abs(z - Z.real).max(), 't_c', tc, 'g^2/8', 0.03 ** 2 / 8)
# 4. through the collision: lone pair, u(t) = g^2 - 8 t exactly, members conjugate afterwards with Im = sqrt(8 t - g^2)/2
F3 = flow.RegFlow(np.array([[0.0, g]]), np.array([[[0, 1]]])); S = F3.S
for _ in range(100): S = F3.rk4(g * g / 4 / 100, S)
print('past collision', F3.positions(S)[0], 'expected Im', math.sqrt(8 * g * g / 4 - g * g) / 2)
# 5. far field: pair + frozen far zero equals the 3-body flow up to the displacement of the far zero
x = np.array([0.0, 0.03]); y = 5.0
F0 = -2 / (x - y); F1 = 2 / (x - y) ** 2
F4 = flow.RegFlow(x[None, :], np.array([[[0, 1]]]), F0[None, :], F1[None, :]); tc4, _ = F4.run_until_collision(1.0, scale=0.03)
F5 = flow.RegFlow(np.array([[0.0, 0.03, y]]), np.array([[[0, 1]]])); tc5, _ = F5.run_until_collision(1.0, scale=0.03)
print('far field', tc4, tc5, tc4 / tc5 - 1)
print(flow.greedy_pairs(np.array([0, 1.0, 1.1, 1.15, 3, 3.5]), 2))
