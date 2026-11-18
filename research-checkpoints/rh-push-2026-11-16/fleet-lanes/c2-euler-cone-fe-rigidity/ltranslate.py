"""Window check of Lemma 3: a(n) = chi5(n) n^(-i alpha), chi5 = Legendre symbol mod 5 (even, primitive, real, root number 1),
alpha = -Tc (1 - 1/5) + delta.  F(s) = L(s + i alpha, chi5) is zeta-like in the window [T, T+H]: FE residual of the model vs delta."""
import numpy as np, sys, json
from scipy.optimize import minimize_scalar
from cone_lp import build
T, H = float(sys.argv[1]), float(sys.argv[2]); J, dt = 13, 0.2
K = int(np.ceil(H / dt)) + 1; q = np.sqrt(T / (2 * np.pi)); N = int(round(3.2 * q))
print(f"planned: N={N}, rows {2*(K+1)*(J-1)} x {N}")
b = build(T, H, K, N, J); n = np.arange(1, N + 1); chi = np.array([0, 1, -1, -1, 1])[n % 5].astype(float)
Tc = T + H / 2; a0 = -Tc * (1 - 1 / 5)
def resid(delta):
    a = chi * n**(-1j * (a0 + delta)); return np.abs(b["D1"] @ a + b["D2"] @ np.conj(a)).max()
per = 2 * np.pi / np.log(Tc / (2 * np.pi))
ds = np.linspace(0, per, 400); rs = np.array([resid(d) for d in ds]); i = rs.argmin()
r = minimize_scalar(resid, bounds=(ds[max(i - 1, 0)], ds[min(i + 1, 399)]), method="bounded", options=dict(xatol=1e-12))
a = chi * n**(-1j * (a0 + r.x)); ones = np.ones(N)
out = dict(T=T, H=H, N=N, alpha=a0 + r.x, best_resid=float(r.fun), worst_resid_over_delta=float(rs.max()), predicted=(5 - 1) * (H / 2)**2 / (2 * T),
           F_s0=abs(complex(b["o1"] @ a + b["o2"] @ np.conj(a))), zeta_s0=abs(complex(b["o1"] @ ones + b["o2"] @ ones)), zeta_resid=float(np.abs(b["D1"] @ ones + b["D2"] @ ones).max()))
print(json.dumps(out)); open("ltranslate.jsonl", "a").write(json.dumps(out) + "\n")
