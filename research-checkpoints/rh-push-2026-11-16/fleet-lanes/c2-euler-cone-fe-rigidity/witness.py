"""Exact-cone witness with a prescribed zero at s0 = 3/4 + i(T + H/2), and an off-grid check of its FE residual.
Slice: p <= sqrt(N) fixed at p^(-i alpha_k); a(p) = p^(-i alpha_k) c_p, c_p in the inscribed 64-gon, for sqrt(N) < p <= N.
LP: minimise max_p-free objective 0 subject to |FE residual components| <= EPS on the design grid (K points, J X-values) and F(s0) = 0.
Then re-evaluate the residual on a finer grid (Kf points, Jf X-values) that was not used in the LP."""
import numpy as np, json, sys
from scipy.optimize import linprog
from cone_lp import build, primes_upto, real_map, C0
T, H, k, EPS = float(sys.argv[1]), float(sys.argv[2]), int(sys.argv[3]), float(sys.argv[4])
J = int(sys.argv[5]) if len(sys.argv) > 5 else 7; dt = float(sys.argv[6]) if len(sys.argv) > 6 else 0.4
ratio = 3.2; NG = 64
K = max(4, int(np.ceil(H / dt)) + 1); q = np.sqrt(T / (2 * np.pi)); N = int(round(ratio * q))
print(f"planned: N={N} K={K} J={J}: LP rows {4*(K+1)*(J-1)} + {NG}*big; fine grid rows {(4*K+1)*(4*J)}")
b = build(T, H, K, N, J); D1, D2, o1, o2 = b["D1"], b["D2"], b["o1"], b["o2"]
n = np.arange(1, N + 1); ps = primes_upto(N); sq = int(np.floor(np.sqrt(N))); bigp = [p for p in ps if p > sq]; col = {p: i for i, p in enumerate(bigp)}
lpf = np.zeros(N + 1, int)
for p in ps: lpf[p::p] = p
isbig = lpf[1:] > sq; d = len(bigp)
alpha = 2 * np.pi * k / np.log((T + H / 2) / (2 * np.pi)); a = n**(-1j * alpha)
B = np.zeros((N, d), complex); a0 = np.where(isbig, 0, a)
for i in range(N):
    if isbig[i]: B[i, col[lpf[i + 1]]] = a[i]
Cre, Cim = real_map(D1, D2, B); Cmat = np.vstack([Cre, Cim]); r0 = D1 @ a0 + D2 @ np.conj(a0); rhs0 = np.concatenate([r0.real, r0.imag])
Ore, Oim = real_map(o1[None, :], o2[None, :], B); o0 = o1 @ a0 + o2 @ np.conj(a0)
ph = (2 * np.arange(NG) + 1) * np.pi / NG
A = np.vstack([Cmat, -Cmat, Ore, -Ore, Oim, -Oim] + [np.hstack([np.cos(p_) * np.eye(d), np.sin(p_) * np.eye(d)]) for p_ in ph])
bb = np.concatenate([(EPS - rhs0), (EPS + rhs0), [(EPS - o0.real), (EPS + o0.real), (EPS - o0.imag), (EPS + o0.imag)], np.full(NG * d, np.cos(np.pi / NG))])
r = linprog(np.zeros(2 * d), A_ub=A, b_ub=bb, bounds=[(None, None)] * (2 * d), method="highs", options=dict(primal_feasibility_tolerance=1e-9, dual_feasibility_tolerance=1e-9))
out = dict(T=T, H=H, k=k, alpha=float(alpha), EPS=EPS, N=N, K=K, J=J, n_free=d, status=int(r.status))
if r.status == 0:
    c = r.x[:d] + 1j * r.x[d:]; aa = a0 + B @ c
    ones = np.ones(N)
    out.update(max_abs_c=float(np.abs(c).max()), F_s0=abs(complex(o1 @ aa + o2 @ np.conj(aa))), zeta_s0=abs(complex(o1 @ ones + o2 @ ones)),
               design_resid=float(np.abs(D1 @ aa + D2 @ np.conj(aa)).max()), mean_abs_c_minus_1=float(np.abs(c - 1).mean()))
    bf = build(T, H, 4 * (K - 1) + 1, N, 4 * (J - 1) + 1)
    rf = np.abs(bf["D1"] @ aa + bf["D2"] @ np.conj(aa))
    out.update(fine_resid_max=float(rf.max()), fine_resid_median=float(np.median(rf)), fine_F_s0=abs(complex(bf["o1"] @ aa + bf["o2"] @ np.conj(aa))),
               fine_zeta_resid=float(np.abs(bf["D1"] @ ones + bf["D2"] @ ones).max()))
    np.save(f"witness_T{int(T)}_H{int(H)}_k{k}_J{J}.npy", np.array([bigp, c.real, c.imag]))
print(json.dumps(out)); open("witness.jsonl", "a").write(json.dumps(out) + "\n")
