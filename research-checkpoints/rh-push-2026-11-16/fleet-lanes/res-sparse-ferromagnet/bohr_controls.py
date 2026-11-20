"""Controls for the Bohr-side critical Curie-Weiss stage: E_a, Davenport-Heilbronn, deep ladders, convergence.
Float64. Largest planned allocation: 3^7 = 2187 terms x 7000 pts complex128 = 245 MB."""
import numpy as np, json, itertools
from bohr_stage import evalZ, winding, line_sign_changes
OUT = {}

def general(primes, polys, c):
    """product over p of sum_k polys[p][k] p^{-ks}, heat weight exp(c log^2 n)"""
    lp = np.log(np.array(primes, float))
    logn = np.zeros(1); co = np.ones(1, complex)
    for l, pol in zip(lp, polys):
        k = np.arange(len(pol))
        logn = (logn[:, None] + l * k[None, :]).ravel()
        co = (co[:, None] * np.array(pol, complex)[None, :]).ravel()
    return logn, co * np.exp(c * logn ** 2)

def count(name, logn, w, T, selfdual_L=None, box=(-1.5, 2.5), extra=None):
    f = lambda z: evalZ(logn, w, z)
    t1 = 0.0371; T = T + 0.0137
    wn, mx, mn = winding(f, box[0], box[1], t1, T)
    d = 2e-3
    wr, mxr, _ = winding(f, 0.5 + d, box[1], t1, T)
    wl, mxl, _ = winding(f, box[0], 0.5 - d, t1, T)
    res = dict(T=T, zeros_in_box=round(wn), right_of_line=round(wr), left_of_line=round(wl),
               max_phase_step=float(max(mx, mxr, mxl)))
    if selfdual_L is not None:
        sc, im = line_sign_changes(logn, w, selfdual_L, 1.0, t1, T)
        res.update(sign_changes_on_line=sc, rel_imag_on_line=float(im))
    if extra: res.update(extra)
    OUT[name] = res; print(name, json.dumps(res), flush=True)

# deep ladders, zeta local factors, critical coupling
for primes, N in [([2, 3, 5, 7], 3), ([2, 3, 5], 6), ([2, 3, 5, 7, 11], 2)]:
    L = sum(N * np.log(p) for p in primes)
    logn, w = general(primes, [[1] * (N + 1)] * len(primes), 1 / (2 * L))
    count(f"deep_ladder_{primes[-1]}_N{N}", logn, w.real, 2 * np.pi * 250 / L, selfdual_L=L, extra=dict(logM=L))

# E_a: local polynomial (1 + p^{-s-a})(1 + p^{-s+a}); total log-degree 2 log M; centre coupling c = 1/(4 log M)
P7 = [2, 3, 5, 7, 11, 13, 17]
for a in [0.1, 0.2, 0.3, 0.4]:
    for primes in [P7[:5], P7]:
        L = 2 * sum(np.log(p) for p in primes)
        c = 1 / (2 * L)
        logn, w = general(primes, [[1, p ** a + p ** (-a), 1] for p in primes], c)
        count(f"Ea_a{a}_P{primes[-1]}", logn, w.real, 2 * np.pi * 250 / L, selfdual_L=L,
              extra=dict(a=a, two_c=2 * c, de_bruijn_halfwidth=float(np.sqrt(max(a * a - 2 * c, 0)))))

# Davenport-Heilbronn stage: c1 prod(1 + chi(p) p^-s) + c2 prod(1 + conj chi(p) p^-s), chi mod 5, chi(2) = i
kappa = 0.284079043840412
chi5 = {1: 1, 2: 1j, 3: -1j, 4: -1}
for primes in [[2, 3], [2, 3, 7], [2, 3, 7, 11, 13], [2, 3, 7, 11, 13, 17, 19]]:
    L = sum(np.log(p) for p in primes); c = 1 / (2 * L)
    l1, w1 = general(primes, [[1, chi5[p % 5]] for p in primes], c)
    l2, w2 = general(primes, [[1, np.conj(chi5[p % 5])] for p in primes], c)
    assert np.allclose(l1, l2)
    w = (1 - 1j * kappa) / 2 * w1 + (1 + 1j * kappa) / 2 * w2
    assert np.abs(w.imag).max() < 1e-9
    count(f"DH_P{primes[-1]}", l1, w.real, 2 * np.pi * 250 / L, extra=dict(logM=L))

# convergence of the critical stages D_M (squarefree, primorial M) on the real axis
ps = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61]
rows = []
for k in [4, 8, 12, 15, 18]:
    primes = ps[:k]; L = sum(np.log(p) for p in primes)
    print(f"planned allocation: 2^{k} = {2**k} float64 terms x 2 arrays = {2**k*16/1e6:.2f} MB")
    logn, w = general(primes, [[1, 1]] * k, 1 / (2 * L))
    row = dict(P=primes[-1], logM=L)
    for sig in [3.0, 2.0, 1.5, 1.1, 0.9, 0.75, 0.6]:
        D = float((w.real * np.exp(-sig * logn)).sum())
        E = float(np.prod([1 + p ** (-sig) for p in primes]))
        row[f"D({sig})"] = D; row[f"E({sig})"] = E
    rows.append(row); print(json.dumps(row), flush=True)
import mpmath as mp
OUT["convergence"] = rows
OUT["target zeta(s)/zeta(2s)"] = {str(s): float(mp.zeta(s) / mp.zeta(2 * s)) for s in [3.0, 2.0, 1.5, 1.1]}
print(OUT["target zeta(s)/zeta(2s)"])
json.dump(OUT, open("bohr_controls.json", "w"), indent=1)
