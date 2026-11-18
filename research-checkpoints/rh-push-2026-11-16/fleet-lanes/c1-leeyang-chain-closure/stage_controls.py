"""Stage-level tests, float64 (MEASURED, not certified). Every stage is an exponential sum F(s) = sum_k A_k exp(-s w_k).
Zeros are located by Newton iteration from a grid in the box -1.5 < Re s < 2.5, 0 < t < T and compared with the count
(w_max - w_min) T / (2 pi). Largest allocation: chunk 2000 starts x 2048 terms complex128 = 66 MB (printed)."""
import numpy as np, itertools, json, sys
from scipy.optimize import least_squares, linprog
rng = np.random.default_rng(11)
T = 40.0
def zeros_box(A, om, T=T, smin=-1.5, smax=2.5, ds=0.1, dt=0.05, line=0.5, label=""):
    A = np.asarray(A, dtype=complex); om = np.asarray(om, dtype=float)
    S, Tt = np.meshgrid(np.arange(smin, smax + 1e-9, ds), np.arange(dt / 2, T, dt))
    z = (S + 1j * Tt).ravel(); found = []
    ch = 2000
    for i in range(0, len(z), ch):
        s = z[i:i + ch].copy()
        for it in range(40):
            E = np.exp(-np.outer(s, om)); F = E @ A; dF = -(E @ (A * om))
            step = F / np.where(np.abs(dF) > 1e-300, dF, 1e-300)
            step = np.where(np.abs(step) > 0.5, 0.5 * step / np.abs(step), step); s = s - step
        E = np.exp(-np.outer(s, om)); F = E @ A; dF = -(E @ (A * om))
        scale = np.abs(E) @ np.abs(A)
        good = (np.abs(F) < 1e-9 * scale) & (s.imag > 0) & (s.imag < T) & (s.real > smin) & (s.real < smax)
        found.extend(s[good].tolist())
    found = np.array(sorted(found, key=lambda c: (c.imag, c.real))); uniq = []
    for c in found:
        if not uniq or abs(c - uniq[-1]) > 1e-6:
            if all(abs(c - u) > 1e-6 for u in uniq[-6:]): uniq.append(c)
    uniq = np.array(uniq); expct = (om.max() - om.min()) * T / (2 * np.pi)
    dev = np.abs(uniq.real - line)
    res = dict(label=label, terms=len(A), found=len(uniq), expected=round(float(expct), 1), on_line_1e6=int((dev < 1e-6).sum()), off_line=int((dev >= 1e-6).sum()),
               max_dev=float(dev.max()) if len(uniq) else None, re_min=float(uniq.real.min()), re_max=float(uniq.real.max()))
    print(json.dumps(res)); sys.stdout.flush(); return res, uniq
def spin_stage(primes, J, chi=None, extra=None):
    """symmetric form: sum over sigma in {+-1}^S of exp(sum_{p<q} J_pq s_p s_q) prod chi_p^{(1+s_p)/2} exp(-(s-1/2) sum s_p l_p/2).
    extra = (lq, rho(3 weights for tau=-1,0,1), Jq vector): one spin-1 site with frequency tau*lq."""
    l = np.log(np.array(primes, dtype=float)); n = len(primes)
    sig = np.array(list(itertools.product([-1, 1], repeat=n)), dtype=float)
    en = np.einsum('ki,ij,kj->k', sig, np.triu(J, 1), sig)
    A = np.exp(en).astype(complex); om = sig @ l / 2
    if chi is not None: A = A * np.prod(np.where(sig > 0, np.asarray(chi)[None, :], 1.0), axis=1)
    if extra is not None:
        lq, rho, Jq = extra; As = []; oms = []
        for tau, r in zip((-1, 0, 1), rho):
            As.append(A * r * np.exp(tau * (sig @ Jq))); oms.append(om + tau * lq)
        A = np.concatenate(As); om = np.concatenate(oms)
    return A * np.exp(om / 2), om   # F(s) = sum A exp(-(s-1/2) om) = sum [A e^{om/2}] e^{-s om}
out = {}
P23 = [2, 3, 5, 7, 11, 13, 17, 19, 23]; l = np.log(np.array(P23, float)); L = l.sum()
print("planned largest allocation: 2000 x 1536 complex128 = %.0f MB" % (2000 * 1536 * 16 / 1e6))
Jcw = np.outer(l, l) / (4 * L); np.fill_diagonal(Jcw, 0)
# 1. zeta Curie-Weiss stage, primes <= 23: check a_p = 1/2 in the occupation form
K = np.outer(l, l) / L; np.fill_diagonal(K, 0); kappa = l ** 2 / (2 * L)
print("Curie-Weiss, primes<=23: max |a_p - 1/2| =", np.abs((kappa + K.sum(1) / 2) / l - 0.5).max(), " min K =", K[K > 0].min())
A, om = spin_stage(P23, Jcw); out["zeta_CW_23"], _ = zeros_box(A, om, label="zeta Curie-Weiss stage, primes<=23")
# check that the symmetric form equals the occupation form sum_{n|M} exp(l_n^2/2L) n^-s up to a monomial
s0 = 0.3 + 7.1j; occ = np.array(list(itertools.product([0, 1], repeat=9)), float); ln = occ @ l
Zocc = (np.exp(ln ** 2 / (2 * L)) * np.exp(-s0 * ln)).sum(); Zsym = (A * np.exp(-s0 * om)).sum()
c0 = Zocc / (Zsym * np.exp(-s0 * L / 2)); s1 = 0.9 - 3.3j
Zocc1 = (np.exp(ln ** 2 / (2 * L)) * np.exp(-s1 * ln)).sum(); Zsym1 = (A * np.exp(-s1 * om)).sum()
print("occupation form / (M^{-s/2} symmetric form): ratio at two points", c0, Zocc1 / (Zsym1 * np.exp(-s1 * L / 2)))
# 2. sparse sum-rule member (LP), kappa = 0: K >= 0 on a random graph with row sums log p
edges = [(i, j) for i in range(9) for j in range(i + 1, 9) if rng.random() < 0.45]
Aeq = np.zeros((9, len(edges)))
for e, (i, j) in enumerate(edges): Aeq[i, e] = 1; Aeq[j, e] = 1
lp = linprog(rng.random(len(edges)), A_eq=Aeq, b_eq=l, bounds=(0, None))
if lp.status == 0:
    Ks = np.zeros((9, 9))
    for e, (i, j) in enumerate(edges): Ks[i, j] = Ks[j, i] = lp.x[e]
    print("sparse member: edges used", int((lp.x > 1e-12).sum()), "of", len(edges), " row-sum defect", np.abs(Ks.sum(1) - l).max())
    A2, om2 = spin_stage(P23, Ks / 4); out["zeta_sparse_23"], _ = zeros_box(A2, om2, label="zeta sparse sum-rule stage, primes<=23")
else: print("sparse LP infeasible for this graph"); Ks = None
# 3. U: unimodular twist, same couplings
chi = np.exp(2j * np.pi * rng.random(9))
A3, om3 = spin_stage(P23, Jcw, chi=chi); out["U_CW_23"], _ = zeros_box(A3, om3, label="unimodular twist U, same K, primes<=23")
# 4. T-NR at stage level: spin-1 site at q with a priori weights (1, c, 1), coupled (theta=1) or not (theta=0)
for q in (2, 29):
    pr = [p for p in P23 if p != q]; lq = np.log(q); lp_ = np.log(np.array(pr, float)); Lq = lp_.sum() + 2 * lq
    Jp = np.outer(lp_, lp_) / (4 * Lq); np.fill_diagonal(Jp, 0)
    for c in (1.5, 2.0, 2.5, -2.5):
        for theta in (0.0, 1.0):
            Jq = theta * lp_ * lq / (2 * Lq)
            A4, om4 = spin_stage(pr, Jp, extra=(lq, (1.0, c, 1.0), Jq))
            key = f"TNR_q{q}_c{c}_theta{theta}"
            out[key], zz = zeros_box(A4, om4, label=f"T-NR site q={q}, c={c}, coupling to the site theta={theta}")
            if theta == 0 and abs(c) > 2:
                pred = np.arccosh(abs(c) / 2) / lq
                off = zz[np.abs(zz.real - 0.5) > 1e-6]
                print("   uncoupled: predicted |Re s - 1/2| =", pred, " measured:", np.unique(np.round(np.abs(off.real - 0.5), 8))[:4], " count", len(off), "expected about", 2 * T * lq / (2 * np.pi))
# 5. controls
# DH stage: chi mod 5 on primes {2,3,7,11,13}
def chi5(p):
    return {1: 1, 2: 1j, 3: -1j, 4: -1}[p % 5]
prD = [2, 3, 7, 11, 13]; lD = np.log(np.array(prD, float)); LD = lD.sum(); JD = np.outer(lD, lD) / (4 * LD); np.fill_diagonal(JD, 0)
kap = (np.sqrt(10 - 2 * np.sqrt(5)) - 2) / (np.sqrt(5) - 1)
ch = np.array([chi5(p) for p in prD])
Aa, oma = spin_stage(prD, JD, chi=ch); Ab, omb = spin_stage(prD, JD, chi=np.conj(ch))
out["DH"], _ = zeros_box((1 - 1j * kap) / 2 * Aa + (1 + 1j * kap) / 2 * Ab, oma, label="DH stage: c1 Z^chi + c2 Z^chibar, primes {2,3,7,11,13}")
out["DH_single_char"], _ = zeros_box(Aa, oma, label="single character stage (one ferromagnet)")
# backward heat: occupation weights exp(c l_n^2), c = -c*, zeros relative to Re s = c L = -1/2 ; and c = c*/2 (line 1/4)
pr5 = [2, 3, 5, 7, 11]; l5 = np.log(np.array(pr5, float)); L5 = l5.sum(); occ5 = np.array(list(itertools.product([0, 1], repeat=5)), float); ln5 = occ5 @ l5
for cc, nm in ((-1 / (2 * L5), "c=-c*"), (1 / (4 * L5), "c=c*/2"), (1 / (2 * L5), "c=c*")):
    out["heat_" + nm], _ = zeros_box(np.exp(cc * ln5 ** 2), ln5, smin=-2.5, smax=2.5, line=cc * L5, label=f"heat family {nm}, primes<=11, reference line Re s = {cc*L5:.3f}")
# E_a: sites (1+p^{-s-a})(1+p^{-s+a}), heat time 1/(4 L)
for a in (0.2, 0.4):
    o2 = np.array(list(itertools.product([0, 1], repeat=10)), float); n1 = o2[:, :5] @ l5; n2 = o2[:, 5:] @ l5
    out[f"Ea_{a}"], _ = zeros_box(np.exp(-a * n1 + a * n2 + (n1 + n2) ** 2 / (8 * L5)), n1 + n2, label=f"E_a stage a={a}, primes<=11")
# one antiferromagnetic edge in the Curie-Weiss stage primes<=23 (duality kept: symmetric form)
for edge, val in (((0, 1), -0.15), ((0, 1), -0.6), ((7, 8), -0.6)):
    Jaf = Jcw.copy(); Jaf[edge] = Jaf[edge[::-1]] = val
    out[f"AF_{edge}_{val}"], _ = zeros_box(*spin_stage(P23, Jaf), label=f"one antiferromagnetic edge {edge} J={val}, primes<=23")
json.dump(out, open("stage_controls.json", "w"), indent=1)
