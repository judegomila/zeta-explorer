"""zw_predict.py Z P : size of the sixth-power (coherent) cross term of the Z[omega] screen of c9-mv6-window-statement for each vector, relative to ALIGNED,
from the model law "coherent term = squared Moebius-type sum of the dual vector" (float64; a screen-level estimate, not a verdict).
Column weights exactly as in w_window.py (marked variant).  Dual coefficient of a vector tau*t: m(c) = mu(c) G(c) t(c) A0(c) / sqrt(q_c)
(THETA: mu G; LIOU: G; ALIGNED: 1; U: mu G U; RAND1: random phases).  Sixth-power frequencies k = eps l^6 see the vector only through
  S_j^eps = sum_{c : q_c = j mod 4} m(c) conj(chi_c(eps)),   eps one of the six units, j = 1, 3 (the reciprocity sign R(c, c') = -1 iff both norms are 3 mod 4).
A(vec) = sum_eps (|S_1^eps|^2 + |S_3^eps|^2); also split by slot prime: slot part = sum_pi (same with the block of pi), cross part = A - slot part.
Prints A(vec)/A(ALIGNED) and cross-part ratios.  Uses ek_common.py and zomega.py (copied unchanged from c9) and the table tmp/sextic/data (data only)."""
import sys, math, os, json
import numpy as np
from ek_common import *
Zs = float(sys.argv[1]); P = float(sys.argv[2]); s_V = 0.5; ycut = 12
T = Tab(ycut * Zs * 2 * P, pmax=max(ycut * Zs, 2 * P))
V = lambda y: np.exp(-np.log(y) ** 2 / (4 * s_V ** 2))
W1 = lambda x: np.where((x > 1) & (x < 2), np.sin(np.pi * (x - 1)) ** 2, 0.0)
slot = np.flatnonzero((T.pq > P) & (T.pq < 2 * P)); isslot = np.zeros(len(T.pp), bool); isslot[slot] = True
A0pi = np.zeros((T.n, len(slot))); slotcol = {int(j): t for t, j in enumerate(slot)}
lp = T.lastpos; cur = np.arange(T.n)
while True:
    act = cur > 0
    if not act.any(): break
    j = np.where(act, lp[np.maximum(cur, 0)], 0); qpi = T.pq[j].astype(float)
    add = np.where(act & isslot[j], W1(qpi / P) * V(T.N / (Zs * qpi)), 0.0)
    for jj, t in slotcol.items():
        sel = act & (j == jj); A0pi[sel, t] += add[sel] / np.sqrt(T.N[sel])
    cur = np.where(act, T.parent[np.maximum(cur, 0)], 0)
A0 = A0pi.sum(axis=1)
live = A0 > 1e-7 * A0.max()
units = [(1, 0), (0, 1), (-1, 1), (-1, 0), (0, -1), (1, -1)]
E = T.node_exps(T.prime_exps(np.array([u[0] for u in units]), np.array([u[1] for u in units])))      # (n, 6) exponents of chi_c(eps)
assert (E[live] < 64).all()
ph = np.conj(Z6[E % 6])                                                                                # conj(chi_c(eps))
rng = np.random.default_rng(11)
def cmult(vals):
    out = np.ones(T.n, dtype=complex)
    for lev in T.levels: out[lev] = out[T.parent[lev]] * vals[T.lastpos[lev]]
    return out
U = cmult(np.exp(2j * np.pi * rng.random(len(T.pp))))
duals = {'ALIGNED': np.ones(T.n, dtype=complex), 'LIOU': T.G.astype(complex), 'THETA': T.mu * T.G, 'U': T.mu * T.G * U}
for s in range(8): duals[f'RAND{s+1}'] = np.exp(2j * np.pi * np.random.default_rng(100 + s).random(T.n))
cls = [(T.N % 4 == 1), (T.N % 4 == 3)]
res = {}
for name, m in duals.items():
    A = 0.0; Aslot = 0.0
    for cmask in cls:
        base = (m / np.sqrt(T.N))[:, None] * ph * cmask[:, None]                    # (n, 6)
        Spi = A0pi.T @ base                                                          # (slots, 6): block sums
        A += (np.abs(Spi.sum(axis=0)) ** 2).sum(); Aslot += (np.abs(Spi) ** 2).sum()
    res[name] = (A, Aslot)
ref = res['ALIGNED']
print(f"Z={Zs:g} P={P:g} columns={T.n} live={int(live.sum())} slot primes={len(slot)} (norms {T.pq[slot].tolist()})")
print(f"{'vector':>8} {'A/A(ALIGNED)':>14} {'cross part / cross part(ALIGNED)':>34} {'slot part / A':>14}")
out = {'Z': Zs, 'P': P, 'live': int(live.sum())}
for name, (A, As) in res.items():
    print(f"{name:>8} {A/ref[0]:14.3e} {(A-As)/(ref[0]-ref[1]):34.3e} {As/A:14.3f}")
    out[name] = [A / ref[0], (A - As) / (ref[0] - ref[1]), As / A]
# effective square-root size for comparison: sum of |m|^2 A0^2/q over the live columns, relative to |sum|^2 of ALIGNED
l2 = float((A0 ** 2 / T.N).sum()); print(f"l2 mass sum_c A0^2/q_c = {l2:.4e};  6 * l2 / A(ALIGNED) = {6*l2/ref[0]:.3e}  (size of a vector with square-root cancellation)")
out['sqrt_level'] = 6 * l2 / ref[0]
json.dump(out, open(f'zw_predict_Z{int(Zs)}.json', 'w'))
