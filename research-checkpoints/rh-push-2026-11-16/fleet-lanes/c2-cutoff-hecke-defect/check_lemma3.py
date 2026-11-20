"""float64 check of Lemma 3: for a supported in (c - L, c],
||Q_c (h_+ * a)||^2 - ||Q_c (h_- * a)||^2 = alpha * sum a(u) a(v) M(u', v'),  u' = c - u,
M(x, y) = int_0^inf (2 r + x + y) kappa(r + x) kappa(r + y) dr.  Also Lemma 1: D_p = [Q_c, V_p] = -V_p 1_(c, c+2 log p]."""
import numpy as np
def kappa(x):
    x = np.abs(x); E = np.exp(np.minimum(x, 6.0)); s = 0
    for n in range(1, 8): s = s + (2*np.pi**2*n**4*E**2.25 - 3*np.pi*n**2*E**1.25)*np.exp(-np.pi*n*n*E)
    return s
rng = np.random.default_rng(1)
for (alpha, c, L) in [(1.3, 0.4, 2.0), (0.6, -1.1, 3.0)]:
    h = 0.004
    u = c - (np.arange(int(L/h)) + 0.5)*h              # support of a, left of c
    a = rng.standard_normal(u.size) * np.exp(-((c-u)-0.7)**2)
    r = c + (np.arange(int(8/h)) + 0.5)*h              # r > c
    X = r[:, None] - u[None, :]
    f = ((1 + alpha*X/2)*kappa(X)) @ a * h; g = ((1 - alpha*X/2)*kappa(X)) @ a * h
    lhs = (f@f - g@g)*h
    up = c - u; rr = (np.arange(int(8/h)) + 0.5)*h
    K0 = kappa(rr[:, None] + up[None, :]); K1 = K0*(rr[:, None] + up[None, :])
    M = (K1.T @ K0 + K0.T @ K1)*h
    rhs = alpha * a @ M @ a * h*h
    print(f'alpha={alpha} c={c} L={L}: direct {lhs:.12e}  alpha*a^T M a {rhs:.12e}  rel diff {abs(lhs-rhs)/abs(lhs):.2e}')
# Lemma 1 on a grid
h = 0.01; grid = np.arange(-800, 800)*h; c = 0.37; p = 3; sh = int(round(2*np.log(p)/h)); lp = sh*h
v = rng.standard_normal(grid.size)
V = lambda w: p**-0.5 * np.concatenate([w[sh:], np.zeros(sh)])      # (V w)(u) = p^-1/2 w(u + 2 log p) (grid shift)
Q = (grid > c).astype(float); W = ((grid > c) & (grid <= c + lp + 1e-9)).astype(float)
print('Lemma 1 max |[Q,V_p]v + V_p W v| =', np.abs(Q*V(v) - V(Q*v) + V(W*v)).max(),
      ' support of D_p v inside (c-2log p, c]:', bool(np.all((Q*V(v) - V(Q*v))[(grid > c) | (grid <= c - lp - 1e-9)] == 0)))
