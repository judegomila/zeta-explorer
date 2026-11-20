"""pasym.py -- the principal-row term P_w and the Mellin signal F_w = c_S f_w for the Liouville weight at large Z, by the
density approximation sum_{c squarefree, (c,6)=1} phi(c) g(q_c) ~ delta * int g(x) dx  (phi(c) = prod_{p|c}(1 - 1/q_p)).

  P_liou(Z) ~ W1^(1) rho_S delta Z^(1/4) int V(e^u) sum_a phi(a) W0~(Z^(-1/2) q_a^6 e^(-u)) du
  F_liou(Z) ~ c_S kappa0 delta Z^(1/3) int V(e^u) e^(u/6) du
(d-terms, i.e. indices A divisible by a sixth power, are omitted in both.)  Shows the range of Z in which the sum over the
sixth-power frequencies a has one term (local exponent 1/4) and where the exponent 1/3 = C(1) of Proposition 2.1 is reached.
Usage: python pasym.py out.json
"""
import sys, math, json
import numpy as np
from scipy.special import j0
import prep6 as P6
SQ3 = math.sqrt(3.0)
cS, parts = P6.cS_value()
rhoS = parts['res_zetaS']; W1h = parts['W1hat1']
# primes of O coprime to 6 up to norm PMAX
PMAX = 4000
sv = np.ones(PMAX + 1, bool); sv[:2] = False
for i in range(2, int(PMAX ** 0.5) + 1):
    if sv[i]: sv[i * i::i] = False
Qs = []
for p in np.flatnonzero(sv):
    if p in (2, 3): continue
    if p % 3 == 1: Qs += [int(p), int(p)]
    elif p * p <= PMAX: Qs.append(int(p * p))
# density delta: product over all primes (extend to 2e6 for the constant)
PM2 = 2000000
sv2 = np.ones(PM2 + 1, bool); sv2[:2] = False
for i in range(2, int(PM2 ** 0.5) + 1):
    if sv2[i]: sv2[i * i::i] = False
pr = np.flatnonzero(sv2).astype(float); pr = pr[pr > 3]
Qall = np.concatenate([pr[pr % 3 == 1], pr[pr % 3 == 1], pr[pr % 3 == 2] ** 2])
delta = rhoS * float(np.prod(1 - 2 / Qall ** 2 + 1 / Qall ** 3))
kappa0 = 1.0 / (1.6449340668482264 * 0.7813024128964862 * (1 - 1 / 9.0) * (1 - 1 / 16.0))
# ideals a coprime to 6 with phi(a): generating by multiplying prime ideals (norm, phi) -- distinct ideals via DFS
AMAX = 4000
ideals = []
def dfs(i, norm, phi):
    ideals.append((norm, phi))
    for j in range(i, len(Qs)):
        q = Qs[j]
        if norm * q > AMAX: break
        n2 = norm * q; ph2 = phi * (1 - 1 / q)
        while n2 <= AMAX:
            dfs(j + 1, n2, ph2); n2 *= q
Qs.sort(); dfs(0, 1, 1.0)
an = np.array([t[0] for t in ideals], float); aphi = np.array([t[1] for t in ideals])
o = np.argsort(an); an = an[o]; aphi = aphi[o]
rr = np.linspace(P6.W0_SUPP[0], P6.W0_SUPP[1], 2001); wr = P6.bump(rr, *P6.W0_SUPP); dr = rr[1] - rr[0]
sgrid = np.linspace(0.0, 60.0, 30001); W0t = np.empty(len(sgrid))
for i0 in range(0, len(sgrid), 2000):
    sl = sgrid[i0:i0 + 2000]; J = j0(4 * math.pi * np.outer(sl, np.sqrt(rr)) / SQ3) * wr[None, :]
    W0t[i0:i0 + 2000] = (2 * math.pi / SQ3) * (J[:, 1:] + J[:, :-1]).sum(axis=1) * dr / 2
def W0tilde(t):
    s = np.sqrt(np.asarray(t, float)); return np.where(s < 60.0, np.interp(s, sgrid, W0t), 0.0)
u = np.linspace(-9.0, 4.0, 5201); du = u[1] - u[0]; Vu = P6.Vtest(u, 3.5, 4.0)
rows = []
for lg in np.arange(8, 100.01, 1.0):
    Z = 2.0 ** lg
    T = Z ** -0.5 * np.exp(-u)                                 # X / q_c
    amax = (3600.0 / T.min()) ** (1 / 6.0)
    assert amax < AMAX or lg > 99.5, (lg, amax)
    sel = an <= amax
    S = np.zeros(len(u)); S1 = W0tilde(T)
    for q, ph in zip(an[sel], aphi[sel]):
        S += ph * W0tilde(T * q ** 6)
    P = W1h * rhoS * delta * Z ** 0.25 * float((Vu * S).sum() * du)
    P1 = W1h * rhoS * delta * Z ** 0.25 * float((Vu * S1).sum() * du)
    F = cS * kappa0 * delta * Z ** (1 / 3.0) * float((Vu * np.exp(u / 6)).sum() * du)
    rows.append((lg, P, P1, F, int(sel.sum())))
print(f"delta = {delta:.6f}, c_S = {cS:.6g}, W0~(0) = {W0t[0]:.5f}")
print("log2 Z   P_liou       a=1 term     F=c_S f      P/F     local exponent of P (per octave pair)   ideals a used")
out = []
for i, (lg, P, P1, F, na) in enumerate(rows):
    le = (math.log(rows[i + 1][1] / rows[i - 1][1]) / (2 * math.log(2))) if 0 < i < len(rows) - 1 else float('nan')
    out.append({'log2Z': lg, 'P': P, 'P_a1': P1, 'F': F, 'local_exp': le})
    if lg <= 30 or int(lg) % 4 == 0: print(f"{lg:5.0f}  {P:11.5f}  {P1:11.5f}  {F:11.5f}  {P / F:7.3f}   {le:7.4f}   {na}")
json.dump({'delta': delta, 'cS': cS, 'rows': out}, open(sys.argv[1], 'w'), indent=1)
