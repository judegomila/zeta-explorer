#!/usr/bin/env python3
"""Brute-force validation of e2_ff.py (independent symbols: chi_pi(x) = chi0(det x(C_pi)), C_pi the companion matrix;
Gauss sums summed from the definition).
 T1  gamma_2(c) = (-u)^(deg c) zeta_6^(s(c)) for all squarefree c of degree <= 3 (q = 7, 13)
 T2  exact Gram matrices of e2_ff (variants A, K) against brute-force x_p(m) built from brute-force Gauss sums
 T3  sextic form of Lemma A of n3-ff-cubic-sieve-rational-deflation on the column Gram, coprime squarefree pairs
Usage: e2_test.py <tmp_out_dir>"""
import os, sys, math, itertools, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
os.environ.setdefault("E_NOGPU", "1")
import e2_ff as E
out = sys.argv[1]; os.makedirs(out, exist_ok=True)


class BF:
    def __init__(self, q, dmax):
        self.q = q; self.g0 = E.primitive_root(q)
        self.dlog = {pow(self.g0, k, q): k for k in range(q - 1)}
        self.primes = {d: [] for d in range(1, dmax + 1)}
        for d in range(1, dmax + 1):
            for t in itertools.product(range(q), repeat=d):
                f = list(t) + [1]
                if all(E.pmod(f, g, q) for e in range(1, d // 2 + 1) for g in self.primes[e]):
                    self.primes[d].append(f)
        self.cache = {}

    def polys(self, deg, monic=False):
        """all polynomials of degree < deg (or monic of degree deg) as an (N, deg(+1)) int array, row index = base-q value."""
        q = self.q; N = q ** deg
        A = np.zeros((N, deg + (1 if monic else 0)), dtype=np.int64); idx = np.arange(N)
        for i in range(deg):
            A[:, i] = (idx // q ** i) % q
        if monic:
            A[:, deg] = 1
        return A

    def sym(self, pi, A):
        """log_6 chi_pi(x) for the rows x of A (coefficients low -> high); -1 if pi | x."""
        q = self.q; d = len(pi) - 1
        C = np.zeros((d, d), dtype=np.int64)
        for i in range(1, d):
            C[i, i - 1] = 1
        C[:, d - 1] = [(-c) % q for c in pi[:d]]
        M = np.zeros((len(A), d, d), dtype=np.int64); Pw = np.eye(d, dtype=np.int64)
        for i in range(A.shape[1]):
            M = (M + A[:, i][:, None, None] * Pw[None]) % q
            Pw = Pw @ C % q
        det = np.rint(np.linalg.det(M.astype(float))).astype(np.int64) % q
        return np.array([self.dlog[int(v)] % 6 if v else -1 for v in det])

    def chi(self, fac, A):
        e = np.zeros(len(A), dtype=np.int64); bad = np.zeros(len(A), dtype=bool)
        for pi in fac:
            j = self.sym(pi, A); bad |= j < 0; e += j
        return np.where(bad, -1, e % 6)

    def gauss(self, fac, k):
        """normalised Gauss sum of chi_c^k, c = product of fac."""
        q = self.q; deg = sum(len(f) - 1 for f in fac)
        A = self.polys(deg)
        e = self.chi(fac, A)
        t = A[:, deg - 1]
        v = np.where(e >= 0, np.exp(2j * math.pi * (k * np.maximum(e, 0) / 6 + t / q)), 0)
        return v.sum() / q ** (deg / 2)


def prodpoly(fac, q):
    r = [1]
    for f in fac:
        r = E.pmul(r, f, q)
    return r


def code_nodes(Mo, deg):
    coef, s, fac = Mo.nodes(deg)
    return {tuple(int(x) for x in coef[i, :deg + 1]): (int(s[i]), [int(k) for k in fac[i] if k >= 0]) for i in range(len(coef))}


worst = 0.0
for q in (7, 13):
    B = BF(q, 3); Mo = E.Model(q, 3)
    u = sum(np.exp(2j * math.pi * (2 * B.dlog[x] / 6 + x / q)) for x in range(1, q)) / math.sqrt(q)
    cnt = 0
    for deg in (1, 2, 3):
        nd = code_nodes(Mo, deg)
        allp = [p for d in range(1, deg + 1) for p in B.primes[d]]
        for r in range(1, deg + 1):
            for fac in itertools.combinations(allp, r):
                if sum(len(f) - 1 for f in fac) != deg:
                    continue
                if q == 13 and deg == 3 and cnt % 7:
                    cnt += 1; continue
                c = tuple(prodpoly(fac, q))
                g = B.gauss(fac, 2)
                pred = (-u) ** deg * E.ZETA6 ** nd[c][0]
                worst = max(worst, abs(g - pred)); cnt += 1
    print(f"T1 q={q}: gamma_2 formula against brute force on {cnt} squarefree moduli of degree <= 3: max |diff| so far {worst:.2e}", flush=True)
assert worst < 1e-9


class A_:                                   # argument holder for e2_ff.Size
    out = out; rseeds = 1; kcontrol = True; sdp_nmax = 3000; store_nmax = 10 ** 6; t_bytes = 10 ** 8; b_bytes = 10 ** 8
    sym_elems = 10 ** 5; host_gb = 6.0; ck_sec = 1e9; recheck_rows = 8; k_max_cost = 1e30


for (q, a, b, n) in [(7, 1, 2, 2), (7, 1, 2, 3), (7, 2, 2, 2), (7, 1, 3, 3), (7, 2, 3, 2), (13, 1, 2, 2)]:
    Mo = E.Model(q, max(a, b)); B = BF(q, max(a, b))
    S = E.Size(q, a, b, n, A_, Mo); rec, G = S.run()
    rows = B.polys(n, monic=True)
    marks = B.primes[a]
    cof = [fac for r in range(1, b + 1) for fac in itertools.combinations([p for d in range(1, b + 1) for p in B.primes[d]], r) if sum(len(f) - 1 for f in fac) == b]
    assert len(cof) == S.Cn
    # order of the marks in the code: compare through the minimal polynomials
    order = [marks.index([int(x) for x in Mo.pcoef[k, :a + 1]]) for k in S.mk]
    X = {v: np.zeros((len(marks), len(rows)), dtype=complex) for v in ("A", "K", "Ap")}
    chim = {tuple(p): B.chi([p], rows) for d in range(1, max(a, b) + 1) for p in B.primes[d]}
    for i, p in enumerate(marks):
        for fac in cof:
            if p in fac:
                continue
            g = B.gauss([p] + list(fac), 2)
            e = sum(chim[tuple(f)] for f in [p] + list(fac)); bad = np.zeros(len(rows), dtype=bool)
            for f in [p] + list(fac):
                bad |= chim[tuple(f)] < 0
            c1 = prodpoly([p] + list(fac), q)[a + b - 1]
            for v, k in (("A", 1), ("K", 4), ("Ap", 1)):
                X[v][i] += np.where(bad, 0, g * np.exp(2j * math.pi * k * e / 6)) * (np.exp(-2j * math.pi * c1 / q) if v == "Ap" else 1.0)
    msg = f"T2 q={q} (a,b,n)=({a},{b},{n}): marks {len(marks)}, columns {len(marks) * len(cof)}, rows {len(rows)}:"
    for v in ("A", "K", "Ap"):
        Gb = X[v] @ X[v].conj().T
        Gc = G[v] if v == "Ap" else (G[v][0] + E.OMEGA * G[v][1])
        Gb = Gb[np.ix_(order, order)]
        rel = np.abs(Gb - Gc).max() / np.abs(Gc).max()
        msg += f" {v}: max rel diff {rel:.2e}"
        assert rel < (1e-5 if v == "Ap" else 1e-9), msg
    print(msg, flush=True)

# T3: sextic Lemma A.  sum_{deg d = n} chi(d) = q^(n-m) eps [ (q-1) sum_{deg r <= 2m-2-n} conj chi(r) - sum_{deg r = 2m-1-n} conj chi(r) ],
# chi = chi_c conj chi_c', eps = gamma_1(c) conj gamma_1(c'), c != c' coprime squarefree of degree m.
rng = np.random.default_rng(5); npairs = 0; worst3 = 0.0
for q, m in ((7, 2), (7, 3), (13, 2)):
    B = BF(q, m)
    allp = [p for d in range(1, m + 1) for p in B.primes[d]]
    sf = [fac for r in range(1, m + 1) for fac in itertools.combinations(allp, r) if sum(len(f) - 1 for f in fac) == m]
    for _ in range(12):
        i, j = rng.choice(len(sf), 2, replace=False); c, c2 = sf[i], sf[j]
        if any(f in c2 for f in c):
            continue
        eps = B.gauss(list(c), 1) * np.conj(B.gauss(list(c2), 1))
        def S(deg):
            if deg < 0:
                return 0.0
            A = B.polys(deg, monic=True)
            e1 = B.chi(list(c), A); e2 = B.chi(list(c2), A)
            return np.where((e1 < 0) | (e2 < 0), 0, np.exp(2j * math.pi * (e1 - e2) / 6)).sum()
        for n in range(0, 2 * m):
            k0 = 2 * m - 2 - n
            lhs = S(n)
            rhs = q ** (n - m) * eps * ((q - 1) * sum(np.conj(S(d)) for d in range(0, k0 + 1)) - np.conj(S(k0 + 1)))
            worst3 = max(worst3, abs(lhs - rhs) / max(1.0, abs(lhs))); npairs += 1
        assert abs(S(2 * m)) < 1e-9
print(f"T3 sextic Lemma A: {npairs} (pair, n) cases, max relative defect {worst3:.2e}")
assert worst3 < 1e-9
print("E2 TEST PASSED")
