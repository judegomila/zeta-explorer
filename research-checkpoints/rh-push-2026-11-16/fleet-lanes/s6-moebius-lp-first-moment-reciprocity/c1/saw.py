"""Sawtooth part s_k(y) = T_k(y) - P_k(y) of the k-fold integrated log-factorial; measure sup |s_k| / log y.
P_k(y) = y^{k+1}(log y - H_{k+1})/(k+1)! + sum_{j=0}^k a_{k,j} y^{k-j},  a_{k,j} = (-1)^{j+1} zeta'(-j) / (j! (k-j)!)."""
import numpy as np, math
ZP = [-0.9189385332046727, -0.16542114370045092, -0.030448457058393270]   # zeta'(0), zeta'(-1), zeta'(-2)
FACT = [1, 1, 2, 6]
H = [0, 1, 1.5, 11 / 6]
def a_coef(k, j): return (-1) ** (j + 1) * ZP[j] / (FACT[j] * FACT[k - j])
def P(k, y):
    y = np.asarray(y, dtype=np.float64)
    r = y ** (k + 1) * (np.log(y) - H[k + 1]) / FACT[k + 1]
    for j in range(k + 1): r = r + a_coef(k, j) * y ** (k - j)
    return r
def Pscaled(k, X, d):
    """(d/X)^k P_k(X/d)"""
    d = np.asarray(d, dtype=np.float64); y = X / d
    r = y * (np.log(y) - H[k + 1]) / FACT[k + 1]
    for j in range(k + 1): r = r + a_coef(k, j) * (d / X) ** j
    return r
BK = [0.5, 1 / 12, math.sqrt(3) / 216]          # sup |B_{k+1}| / (k+1)!
if __name__ == '__main__':
    N = 200000
    m = np.arange(N + 1, dtype=np.longdouble); lg = np.zeros(N + 1, dtype=np.longdouble); lg[1:] = np.log(m[1:])
    for k in (0, 1, 2):
        L = [np.cumsum(lg * m ** j) for j in range(k + 1)]
        worst = 0; worst_c = 0
        for frac in (0.0, 0.25, 0.5, 0.75, 0.999999, 0.2113, 0.7887):
            y = np.arange(1, N, dtype=np.float64) + frac
            Nn = np.floor(y).astype(np.int64)
            if k == 0: T = L[0][Nn]
            elif k == 1: T = y * L[0][Nn] - L[1][Nn]
            else: T = (y * y * L[0][Nn] - 2 * y * L[1][Nn] + L[2][Nn]) / 2
            s = np.asarray(T, dtype=np.float64) - P(k, y)
            big = y > (1000 if k < 2 else 30); cap = 20000 if k == 2 else N     # float cancellation limits k=2 check
            sel = big & (y < cap)
            ratio = np.abs(s[sel]) / np.log(y[sel])
            resid = np.abs(s) - BK[k] * np.log(y)
            print(f"k={k} frac={frac}: sup|s|/log y (y>cut) = {ratio.max():.6f}  (B-bound {BK[k]:.6f});  max(|s| - b_k log y) on [1,cap) = {resid[y < cap].max():.4f}")
