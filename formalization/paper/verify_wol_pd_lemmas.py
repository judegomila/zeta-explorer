#!/usr/bin/env python3
"""Arb spot-check for formalization/paper/wol-pd-lemmas.md (wol-pd lemmas L1-L5 behind the r4 positive-definite WOL-C
certificates, tmp/r4-wolpd-cert.py / tmp/r4-wolpd-cert2.py / tmp/r4-wolpd-rig.c).

The lemmas are proved in the .md. This script evaluates their statements in ball arithmetic (python-flint arb/acb) at
sample parameters. It is a spot-check, not part of any proof, and it is independent of the r4 certificate code (no r4 file
is imported or executed). Exit code 0 iff every check passes.

Setting (same as the .md): N0 = 690988, L = 2 log N0, a_n(t) = exp(t v (v - L)/4 - (1+h) v/2) for n <= N0 (v = log n),
a_n = 0 for n > N0; b = log-derivative coefficients of f = sum_{n<=N0} a_n n^-s (sum_{d|n} b_d a_{n/d} = a_n log n).
The checks with a small-prime prefix use S = {2,3,5} (the prefix of the r2 base tables) and S = {2,3,5,7} (the smallest
wol-pd prefix) at the real N0, so that every S-smooth series can be handled exactly in Python; the lemmas themselves are
stated for every finite prime prefix S.

Checks
  A  (L2, cluster form) for every 2 <= n <= NA and t in TA: lambda_n(t) = (log of g_t)(n), g_t(n) = exp(t log^2 n / 4),
     computed (i) by the Dirichlet-log recursion and (ii) by the connected-graph (cluster) expansion of the .md; the two
     balls overlap, every cluster term is certified >= 0 (> 0 for t > 0), and lambda_n(0) = 1/k for n = p^k, else 0.
  B  (L2 at the cells) six (h, [t1, t2]) cells covering the certified range and the P47 range (t up to 0.145, h down
     to 0.72): b_n(t_i) certified > 0 for 2 <= n <= NB_L2 (exactly 0 for composite non-prime-powers at t = 0);
     n^{t2 L/4} b_n(t2) - n^{t1 L/4} b_n(t1) certified > 0; the twisted factorisation b_n(t) = n^{-(1+h)/2 - tL/4} log(n)
     lambda_n(t) (balls overlap); the time enclosure b_n(t_c) in [n^{-t2 L/4} b~_n(t1), n^{-t1 L/4} b~_n(t2)] at the
     midpoint; plus sampled n up to N0 with many divisors (memoised recursion).
  C  (L1 + L5) three configurations (CONFIGS): S = {2,3,5} at two entries of the r2 base tables, and S = {2,3,5,7} at the
     P7 entry 0|1|r_49_100 certified by wol-pd; labels (p1, p2, p1 p2) = the two smallest rough primes and their product.
     At 8 phase points theta and both probes:
       K0(theta) = -1/2 sum_pm Re(d_1/c_1)  vs  sum_{m <= M} (b_m/2) cos(a log m/2) cos<e(m),theta>  + rigorous tail,
       X_r(theta) (r2 rough-log recursion) vs -sum_{m <= M_lab} (b_{mr}/2) cos(a log(mr)/2) e^{i<e(m),theta>},
       w_r, l_r, dl_r vs their Taylor series, |w_r(theta)| <= ||w_r||_1, |dl_r(theta)| <= ||dl_r||_1, |K(theta)| <= 1/2 sum |b_m|;
     the tails use only L5 (inverse tails via the weighted-norm far-tail bound, label tails via the product rule).
     L5 identities: b_m = sum log(m1) a_{m1} inv_{m2} (two computations), [l_r]_m = b_{mr}/log(mr) and
     [dl_r]_m = -b_{mr}/2 from power-series products of the r2 recursion (r = p1, p1 p2), far-tail bound >= direct
     partial tails, one-prime norm bound >= direct coefficient sums.
  D  (L3) at one entry: K0_head(theta) + sum_r |H_r(theta)| <= C + sum_{m>1} M_m (1 - cos<e(m),theta>) at sampled theta;
     the scalar bound C + sum_q max f_q + grid term + 2 sum_mixed max(0, M_m) dominates every sample; the grid lemma.
  E  (L4) region bound |c_1^pm(theta)| >= prod_q |F_q(w_q)| e^{-P(theta)} - delta_0 and the global mu_0 at sampled theta;
     probe symmetry log g_q^-(phi) = log g_q^+(-phi); weak duality at sampled theta with P(theta) > G; monotonicity of the
     label-tail functional and of the assembly maps (beta, hi) in their inputs.
  F  (L5 time enclosures) twisting identities for b and inv; mean-value enclosure of the twisted inverse over a t-piece.

usage: /tmp/s145venv/bin/python verify_wol_pd_lemmas.py [--quick]
"""
from __future__ import annotations

import bisect
import itertools
import math
import random
import sys
import time
from collections import Counter
from fractions import Fraction as Fr
from functools import lru_cache

from flint import acb, arb, ctx

QUICK = '--quick' in sys.argv
N0 = 690988
FAIL: list[str] = []
COUNTS: dict[str, int] = {}


def check(cond: bool, what: str) -> None:
    COUNTS['checks'] = COUNTS.get('checks', 0) + 1
    if not cond:
        FAIL.append(what)
        if len(FAIL) <= 25:
            print('FAIL', what, flush=True)


def tally(key: str, k: int = 1) -> None:
    COUNTS[key] = COUNTS.get(key, 0) + k


def A(x) -> arb:
    x = Fr(x)
    return arb(x.numerator) / x.denominator


def nonneg(x: arb) -> bool:          # certified x >= 0 (lower endpoint >= 0)
    return x.lower() >= 0


def pos(x: arb) -> bool:
    return x > 0


def factor(n: int) -> dict[int, int]:
    f, p = {}, 2
    while p * p <= n:
        while n % p == 0:
            f[p] = f.get(p, 0) + 1
            n //= p
        p += 1 if p == 2 else 2
    if n > 1:
        f[n] = f.get(n, 0) + 1
    return f


def divisors(n: int) -> list[int]:
    ds = [1]
    for p, e in factor(n).items():
        ds = [d * p ** k for d in ds for k in range(e + 1)]
    return sorted(ds)


# ===================================================================================================== check A (L2 cluster)
def partitions(e: int, mx: int | None = None):
    mx = e if mx is None else mx
    if e == 0:
        yield []
        return
    for k in range(min(e, mx), 0, -1):
        for rest in partitions(e - k, k):
            yield [k] + rest


def conn_sum(cs: list[arb], t: arb) -> arb:
    """sum over connected graphs H on {0..N-1} of prod_{ij in H} (e^{t c_i c_j / 2} - 1), by the subset recursion
    C(B) = Phi(B) - sum_{A: min(B) in A, A != B} C(A) Phi(B \\ A),  Phi(B) = prod_{i<j in B} e^{t c_i c_j/2}."""
    N = len(cs)
    if N == 1:
        return arb(1)
    full = (1 << N) - 1
    phi = [arb(1)] * (full + 1)
    for mask in range(1, full + 1):
        s1 = arb(0); s2 = arb(0)
        for i in range(N):
            if mask >> i & 1:
                s1 += cs[i]; s2 += cs[i] * cs[i]
        phi[mask] = (t * (s1 * s1 - s2) / 4).exp()
    C = [arb(0)] * (full + 1)
    for mask in range(1, full + 1):
        low = mask & -mask
        val = phi[mask]
        sub = (mask - 1) & mask
        while sub:
            if sub & low:
                val -= C[sub] * phi[mask ^ sub]
            sub = (sub - 1) & mask
        C[mask] = val
    return C[full]


def lambda_cluster(n: int, t: arb) -> tuple[arb, list[arb]]:
    """(lambda_n(t), list of multiset contributions) by the cluster expansion of the .md (L2, eq. (2.6))."""
    per = [[(p, part) for part in partitions(e)] for p, e in factor(n).items()]
    terms = []
    for combo in itertools.product(*per):
        alphas = [(p, k) for p, part in combo for k in part]
        cs = [k * arb(p).log() for p, k in alphas]
        wgt = arb(1)
        for (p, k), mm in Counter(alphas).items():
            wgt = wgt / (arb(k) ** mm) / math.factorial(mm)
        w = arb(1)
        for c in cs:
            w *= (t * c * c / 4).exp()
        terms.append(wgt * w * conn_sum(cs, t))
    tot = arb(0)
    for x in terms:
        tot += x
    return tot, terms


def lambda_rec(N: int, t: arb) -> list[arb]:
    """lambda_n(t) for n <= N by the Dirichlet-log recursion of g_t(n) = exp(t log^2 n/4) (b = D log g; lambda = b/log n)."""
    g = [arb(0)] + [(t * arb(n).log() ** 2 / 4).exp() for n in range(1, N + 1)]
    acc = [arb(0)] * (N + 1)
    for n in range(2, N + 1):
        acc[n] = g[n] * arb(n).log()
    b = [arb(0)] * (N + 1)
    for d in range(2, N + 1):
        b[d] = acc[d]
        bd = b[d]
        for k in range(2, N // d + 1):
            acc[d * k] = acc[d * k] - bd * g[k]
    return [arb(0), arb(0)] + [b[n] / arb(n).log() for n in range(2, N + 1)]


def check_A() -> None:
    t0 = time.time()
    old = ctx.prec; ctx.prec = 256
    NA = 240 if QUICK else 600
    TA = [Fr(0), Fr(1, 4000), Fr(123, 2000), Fr(29, 200)] if not QUICK else [Fr(0), Fr(1, 4000), Fr(29, 200)]
    for tf in TA:
        t = A(tf)
        lr = lambda_rec(NA, t)
        for n in range(2, NA + 1):
            lc, terms = lambda_cluster(n, t)
            check(lc.overlaps(lr[n]), f'A identity n={n} t={tf}')
            tally('A identity')
            for x in terms:
                if tf == 0:
                    check(nonneg(x) or x.contains(0), f'A term sign n={n} t=0')
                else:
                    check(pos(x), f'A term > 0 n={n} t={tf}')
                tally('A cluster terms')
            if tf == 0:
                f = factor(n)
                exp_val = arb(1) / list(f.values())[0] if len(f) == 1 else arb(0)
                check(lr[n].overlaps(exp_val) and lc.overlaps(exp_val), f'A lambda_n(0) n={n}')
            else:
                check(pos(lr[n]), f'A lambda_n(t) > 0 n={n} t={tf}')
    ctx.prec = old
    print(f'[A] L2 cluster identity: {COUNTS.get("A identity", 0)} (n, t) pairs, {COUNTS.get("A cluster terms", 0)} cluster terms '
          f'({time.time() - t0:.1f} s)', flush=True)


# ===================================================================================================== check B (L2 at cells)
CELLS = [  # (label, h, t1, t2): PLAN rows 0, 141, 243, 437, 555, 579 (h at kappa = 1 except 555, 579 at their table heights)
    ('c0', Fr(109, 50), Fr(0), Fr(1, 4000)),
    ('c141', Fr(173, 100), Fr(141, 4000), Fr(71, 2000)),
    ('c243', Fr(143, 100), Fr(243, 4000), Fr(61, 1000)),
    ('c437', Fr(103, 100), Fr(437, 4000), Fr(219, 2000)),
    ('c555', Fr(19, 25), Fr(111, 800), Fr(139, 1000)),
    ('c579', Fr(18, 25), Fr(579, 4000), Fr(29, 200)),
]


def bvec(Nmax: int, t: arb, h: arb, L: arb, logs: list[arb]) -> list[arb]:
    """b_n(t) for n <= Nmax (<= N0) by the push sieve of the Dirichlet log-derivative."""
    a = [arb(0)] + [(t * logs[n] * (logs[n] - L) / 4 - (1 + h) * logs[n] / 2).exp() for n in range(1, Nmax + 1)]
    acc = [arb(0)] * (Nmax + 1)
    for n in range(2, Nmax + 1):
        acc[n] = a[n] * logs[n]
    b = [arb(0)] * (Nmax + 1)
    for d in range(2, Nmax + 1):
        bd = acc[d]
        b[d] = bd
        for k in range(2, Nmax // d + 1):
            acc[d * k] = acc[d * k] - bd * a[k]
    return b


def check_B() -> None:
    t0 = time.time()
    ctx.prec = 128
    L = 2 * arb(N0).log()
    NBL = 3000 if QUICK else 20000
    logs = [arb(0)] + [arb(n).log() for n in range(1, NBL + 1)]
    cells = CELLS[:3] if QUICK else CELLS
    for lab, hf, t1f, t2f in cells:
        h = A(hf); t1 = A(t1f); t2 = A(t2f); tc = A((t1f + t2f) / 2)
        b1 = bvec(NBL, t1, h, L, logs); b2 = bvec(NBL, t2, h, L, logs); bc = bvec(NBL, tc, h, L, logs)
        for n in range(2, NBL + 1):
            f = factor(n)
            if t1f == 0 and len(f) > 1:
                check(b1[n].contains(0) and b1[n].abs_upper() < 1e-30, f'B b_n(0) = 0 n={n} {lab}')
            else:
                check(pos(b1[n]), f'B b_n(t1) > 0 n={n} {lab}')
            check(pos(b2[n]), f'B b_n(t2) > 0 n={n} {lab}')
            tw1 = (t1 * L * logs[n] / 4).exp() * b1[n]
            tw2 = (t2 * L * logs[n] / 4).exp() * b2[n]
            check(pos(tw2 - tw1), f'B twisted increment > 0 n={n} {lab}')
            lo = (-t2 * L * logs[n] / 4).exp() * tw1
            hi = (-t1 * L * logs[n] / 4).exp() * tw2
            check(nonneg(bc[n] - lo) or (bc[n] - lo).contains(0), f'B midpoint lower n={n} {lab}')
            check(nonneg(hi - bc[n]) or (hi - bc[n]).contains(0), f'B midpoint upper n={n} {lab}')
            tally('B (n, cell)')
        # twisted factorisation b_n = n^{-(1+h)/2 - tL/4} log n lambda_n(t)
        NF = 400 if QUICK else 1500
        lr = lambda_rec(NF, t2)
        for n in range(2, NF + 1):
            pred = (-(1 + h) * logs[n] / 2 - t2 * L * logs[n] / 4).exp() * logs[n] * lr[n]
            check(pred.overlaps(b2[n]), f'B factorisation n={n} {lab}')
            tally('B factorisation')
        # sampled large n (memoised recursion over divisors, a_k = 0 for k > N0)
        if not QUICK and lab in ('c141', 'c579'):
            cand = [n for n in range(NBL + 1, N0 + 1, 997)]
            rng = random.Random(7)
            pick = sorted(rng.sample(cand, 25) + [720720 // 2, 665280, 554400, 498960, 360360, 655200])
            pick = [n for n in pick if n <= N0]

            @lru_cache(maxsize=None)
            def acoef(k: int, tt: str) -> arb:
                tv = t1 if tt == '1' else t2
                v = arb(k).log()
                return (tv * v * (v - L) / 4 - (1 + h) * v / 2).exp()

            @lru_cache(maxsize=None)
            def bm(n: int, tt: str) -> arb:
                if n == 1:
                    return arb(0)
                s = acoef(n, tt) * arb(n).log()
                for d in divisors(n)[1:-1]:
                    s -= bm(d, tt) * acoef(n // d, tt)
                return s
            for n in pick:
                x1 = bm(n, '1'); x2 = bm(n, '2')
                check(pos(x1) and pos(x2), f'B large n b_n > 0 n={n} {lab}')
                v = arb(n).log()
                check(pos((t2 * L * v / 4).exp() * x2 - (t1 * L * v / 4).exp() * x1), f'B large n twisted increment n={n} {lab}')
                tally('B large n')
    print(f'[B] L2 at cells: {COUNTS.get("B (n, cell)", 0)} (n, cell) pairs, {COUNTS.get("B factorisation", 0)} factorisation '
          f'checks, {COUNTS.get("B large n", 0)} large n ({time.time() - t0:.1f} s)', flush=True)


# ===================================================================================================== prefix-S machinery
ENTRIES = [  # r2 base-table entries (tmp/r2-refF-out/corrected_m0023/batch_1.json): key, h, time cell, displacement a
    ('0|1|r_49_100', Fr(109, 50), Fr(0), Fr(1, 4000), Fr(5341, 5000)),
    ('141|1|r_19_40', Fr(173, 100), Fr(141, 4000), Fr(71, 2000), Fr(3287, 4000)),
]
# check C configurations: (label, prime prefix S, h, t, a).  The first two are the base-table entries above (S = {2,3,5}) at one
# end point of their time cell; the third is the P7 entry 0|1|r_49_100 of tmp/r2-refF-out/corrected_m0023/adapt/batch_P7_0of1.json
# (certified by wol-pd: tmp/r4-wolpd-out/cert_p13_0.json, margin 0.002550) at t = 1/4000, with its own prefix S = {2,3,5,7}.
CONFIGS = [
    ('S235 0|1|r_49_100', (2, 3, 5), Fr(109, 50), Fr(1, 4000), Fr(5341, 5000)),
    ('S235 141|1|r_19_40', (2, 3, 5), Fr(173, 100), Fr(141, 4000), Fr(3287, 4000)),
    ('P7 0|1|r_49_100', (2, 3, 5, 7), Fr(109, 50), Fr(1, 4000), Fr(5341, 5000)),
]


def rough_labels(SP: tuple) -> tuple:
    """the two smallest primes outside S and their product (a composite label exercising the rough-log recursion)."""
    ps = [p for p in range(2, 100) if all(p % d for d in range(2, p)) and p not in SP][:2]
    return (ps[0], ps[1], ps[0] * ps[1])


class Smooth:
    """sorted S-smooth numbers <= M with exponent vectors."""

    def __init__(self, M: int, SP: tuple):
        self.SP = SP
        lst = [(1, (0,) * len(SP))]
        for qi, p in enumerate(SP):
            new = []
            for x, e in lst:
                y, k = x, 0
                while y <= M:
                    ee = list(e); ee[qi] = k
                    new.append((y, tuple(ee))); y *= p; k += 1
            lst = new
        lst.sort()
        self.m = [x for x, _ in lst]
        self.e = [e for _, e in lst]
        self.idx = {x: i for i, x in enumerate(self.m)}

    def first_above(self, X) -> int:          # index of the first m > X
        return bisect.bisect_right(self.m, math.floor(X))


def sdivisors(e: tuple, D: int, SP: tuple) -> list[int]:
    """all divisors <= D of the S-smooth number with exponent vector e."""
    out = [1]
    for qi, p in enumerate(SP):
        new = []
        for d in out:
            x = d
            for _ in range(e[qi] + 1):
                if x > D:
                    break
                new.append(x); x *= p
        out = new
    return out


class Model:
    """exact Dirichlet objects of one entry at one time t (arb) for the prime prefix SP."""

    def __init__(self, h, t, a, M: int, M_lab: int, SP: tuple):
        self.h, self.t, self.a = A(h), A(t), A(a)
        self.SP = SP; self.labels = rough_labels(SP)
        self.L = 2 * arb(N0).log()
        self.sm = Smooth(M, SP); self.M = M; self.M_lab = M_lab
        self._a = {}
        sm = self.sm
        # inverse of c_1:  inv_1 = 1, inv_m = -sum_{d | m, 1 < d <= N0} a_d inv_{m/d}            (L5 (i), identity (5.2))
        # smooth b, two ways:  b_m = a_m log m - sum_{d | m, d > 1} a_d b_{m/d}   (Dirichlet recursion, b_1 = 0)
        #                      b_m = sum_{m1 m2 = m} log(m1) a_{m1} inv_{m2}           (L5 (i), identity (5.4))
        inv = [arb(0)] * len(sm.m); b = [arb(0)] * len(sm.m); b2 = [arb(0)] * len(sm.m)
        for i, (m, e) in enumerate(zip(sm.m, sm.e)):
            if m == 1:
                inv[i] = arb(1)
                continue
            s = arb(0); s2 = arb(0)
            sb = self.acoef(m) * arb(m).log() if m <= N0 else arb(0)
            for d in sdivisors(e, N0, SP):
                if d == 1:
                    continue
                ad = self.acoef(d); j = sm.idx[m // d]
                s -= ad * inv[j]
                sb -= ad * b[j]
                s2 += arb(d).log() * ad * inv[j]
            inv[i] = s; b[i] = sb; b2[i] = s2
        self.inv, self.b, self.b2 = inv, b, b2
        # label objects: nu_{mr}, b_{m r''} for r'' | r, m <= M_lab
        self.lab = {}
        for r in self.labels:
            self.label(r)

    def acoef(self, n: int) -> arb:
        if n > N0:
            return arb(0)
        x = self._a.get(n)
        if x is None:
            v = arb(n).log()
            x = (self.t * v * (v - self.L) / 4 - (1 + self.h) * v / 2).exp()
            self._a[n] = x
        return x

    def label(self, r: int):
        if r in self.lab:
            return self.lab[r]
        sm = self.sm; nl = sm.first_above(self.M_lab); SP = self.SP
        nu = [arb(0)] * nl
        for i in range(nl):
            m, e = sm.m[i], sm.e[i]
            s = arb(0)
            for m1 in sdivisors(e, N0 // r, SP):
                s += self.acoef(m1 * r) * self.inv[sm.idx[m // m1]]
            nu[i] = s
        # b on {m r : m <= M_lab} via sum_{k | n} a_k b_{n/k} = a_n log n  (needs b on m r' for r' | r, r' < r)
        for d in divisors(r):
            if 1 < d < r:
                self.label(d)
        bl = [arb(0)] * nl
        for i in range(nl):
            m, e = sm.m[i], sm.e[i]
            n = m * r
            s = self.acoef(n) * arb(n).log() if n <= N0 else arb(0)
            for rp in divisors(r):                       # k = m' r', r' | r
                for mp in sdivisors(e, N0 // rp, SP):
                    k = mp * rp
                    if k == 1:
                        continue
                    rq, mq = r // rp, m // mp
                    if rq == 1:
                        bq = self.b[sm.idx[mq]]
                    elif rq == r:
                        bq = bl[sm.idx[mq]]
                    else:
                        bq = self.lab[rq]['b'][sm.idx[mq]]
                    s -= self.acoef(k) * bq
            bl[i] = s
        self.lab[r] = dict(nu=nu, b=bl, nl=nl)
        return self.lab[r]


def apow(x: arb, d: Fr) -> arb:
    return (A(d) * x.log()).exp()


def fq_coeffs(Mo: Model, q: int) -> list[arb]:
    out, pk = [], 1
    while pk <= N0:
        out.append(Mo.acoef(pk)); pk *= q
    return out


def inv_norm_q(alpha: list[arb], q: int, delta: Fr):
    """upper bound of ||1/F_q||_delta = sum_k |phi_k| q^{k delta} by the scaled recursion psi_k = phi_k rho^k, rho = q^delta gam
    (Lemma 5.3 (a)); None if no gam in the ladder gives sum_{i>=1} alpha_i rho^i < 1."""
    Kq = len(alpha) - 1
    for gf in (Fr(13, 10), Fr(6, 5), Fr(11, 10), Fr(21, 20), Fr(51, 50), Fr(101, 100)):
        gam = A(gf); rho = apow(arb(q), delta) * gam
        s = arb(0)
        for i in range(1, Kq + 1):
            s += alpha[i] * rho ** i
        if s < 1:
            break
    else:
        return None
    K = int(math.ceil(40 / math.log(float(gf)))) + Kq + 1
    al = [alpha[i] * rho ** i for i in range(Kq + 1)]
    psi = [arb(1)]
    for k in range(1, K + 1):
        x = arb(0)
        for i in range(1, min(k, Kq) + 1):
            x -= al[i] * psi[k - i]
        psi.append(x)
    head = arb(0)
    for k in range(K + 1):
        head += psi[k].abs_upper() / gam ** k
    Cc = max((psi[k].abs_upper() for k in range(K - Kq, K + 1)), key=lambda z: float(z.upper()))
    return (head + Cc / gam ** K / (gam - 1)).upper(), psi, gam


class Tails:
    """L5: weighted-norm far-tail bound for 1/c_1 and the tail functionals T_X(.) used by the certificate."""

    def __init__(self, Mo: Model):
        self.Mo = Mo; sm = Mo.sm; SP = Mo.SP
        self.alpha = {q: fq_coeffs(Mo, q) for q in SP}
        self.delta = None
        for delta in (Fr(1, 2), Fr(2, 5), Fr(3, 10), Fr(1, 5)):
            res = {q: inv_norm_q(self.alpha[q], q, delta) for q in SP}
            if any(v is None for v in res.values()):
                continue
            pinv = arb(1)
            for q in SP:
                pinv *= res[q][0]
            Dn = (self.defect(delta) * pinv).upper()
            if not Dn < A(Fr(9, 10)):
                continue
            self.delta, self.qnorm, self.pinv, self.Dn = delta, res, pinv, Dn
            self.invn = (pinv / (1 - Dn)).upper()
            break
        assert self.delta is not None, 'no admissible delta'
        d = self.delta
        self.inv_up = [x.abs_upper() for x in Mo.inv]
        self.inv_lo = [x.abs_lower() for x in Mo.inv]
        mdel = [apow(arb(m), d) for m in sm.m]
        self.mdel = mdel
        head = arb(0)
        for x, w in zip(self.inv_lo, mdel):
            head += x * w
        self.tail_delta = (self.invn - head).upper()
        Mb = arb(Mo.M)
        self.far_inv = (apow(Mb, -d) * self.tail_delta).upper()
        assert math.log(Mo.M) >= 1 / float(d)                         # log m m^-delta decreasing for m >= e^{1/delta}
        self.far_log = (Mb.log() / 2 * apow(Mb, -d) * self.tail_delta).upper()
        n = len(sm.m)
        S = [arb(0)] * (n + 1); SL = [arb(0)] * (n + 1)
        for i in range(n - 1, -1, -1):
            S[i] = S[i + 1] + self.inv_up[i]
            SL[i] = SL[i + 1] + arb(sm.m[i]).log() / 2 * self.inv_up[i]
        self.S, self.SL = S, SL

    def defect(self, delta: Fr) -> arb:
        """||c_1 - prod_q F_q||_delta (the part m <= N0 termwise, the part beyond N0 as an exact difference)."""
        Mo = self.Mo; sm = Mo.sm; SP = Mo.SP
        s_in = arb(0); prod_in = arb(0)
        for m, e in zip(sm.m, sm.e):
            if m > N0:
                break
            pr = arb(1)
            for qi, q in enumerate(SP):
                pr *= self.alpha[q][e[qi]]
            w = apow(arb(m), delta)
            s_in += (Mo.acoef(m) - pr).abs_upper() * w
            prod_in += pr * w
        tot = arb(1)
        for q in SP:
            sq = arb(0)
            for k, x in enumerate(self.alpha[q]):
                sq += x * apow(arb(q), delta * k)
            tot *= sq
        s_out = (tot - prod_in).nonnegative_part().upper()
        return (s_in + s_out).upper()

    def T_inv(self, X) -> arb:           # >= sum_{m > X} |inv_m|
        i = self.Mo.sm.first_above(X)
        return self.S[i] + self.far_inv

    def T_log(self, X) -> arb:           # >= sum_{m > X} (log m / 2) |inv_m|
        i = self.Mo.sm.first_above(X)
        return self.SL[i] + self.far_log


def monomial(pw: list[list[acb]], e: tuple) -> acb:
    z = acb(1)
    for qi, k in enumerate(e):
        if k:
            z = z * pw[qi][k]
    return z


def direct_values(Mo: Model, theta: list[float], sgn: int) -> dict:
    """r2 quantities at one phase point and one probe (exact rational functions, acb): c_1, d_1, w_r, dw_r, l_r, dl_r for the
    labels (p1, p2, p1 p2); l, dl by the r2 rough-log recursion  l_r = w_r - acc_r / v_r,  dl_r = dw_r - dacc_r / v_r."""
    a = Mo.a; SP = Mo.SP
    pw = []
    for qi, q in enumerate(SP):
        ang = arb(theta[qi]) + sgn * a * arb(q).log() / 2
        z = acb(ang.cos(), ang.sin())
        lst = [acb(1)]
        for _ in range(20):
            lst.append(lst[-1] * z)
        pw.append(lst)

    def poly(r: int, deriv: bool) -> acb:
        s = acb(0)
        for m, e in zip(Mo.sm.m, Mo.sm.e):
            if m * r > N0:
                break
            c = Mo.acoef(m * r)
            if deriv:
                c = -c * arb(m * r).log() / 2
            s += c * monomial(pw, e)
        return s
    c1, d1 = poly(1, False), poly(1, True)
    out = dict(c1=c1, d1=d1, w={}, dw={}, l={}, dl={})
    p1, p2, p12 = Mo.labels
    for r in Mo.labels:
        cr, dr = poly(r, False), poly(r, True)
        w = cr / c1
        out['w'][r] = w
        out['dw'][r] = (dr - w * d1) / c1
    v = {r: arb(r).log() for r in Mo.labels}
    for r in (p1, p2):                                   # prime labels: acc_r = 0
        out['l'][r] = out['w'][r]; out['dl'][r] = out['dw'][r]
    w, dw, l, dl = out['w'], out['dw'], out['l'], out['dl']
    acc = v[p1] * l[p1] * w[p2] + v[p2] * l[p2] * w[p1]      # ordered pairs (p1, p2), (p2, p1)
    dacc = v[p1] * (dl[p1] * w[p2] + l[p1] * dw[p2]) + v[p2] * (dl[p2] * w[p1] + l[p2] * dw[p1])
    out['l'][p12] = w[p12] - acc / v[p12]
    out['dl'][p12] = dw[p12] - dacc / v[p12]
    return out


def theta_points(rng: random.Random, K: int, n_small: int = 2, n_unif: int = 2) -> list[list[float]]:
    pts = [[0.0] * K]
    pts += [[rng.gauss(0, 0.1) for _ in range(K)] for _ in range(n_small)]
    pts += [[rng.uniform(-math.pi, math.pi) for _ in range(K)] for _ in range(n_unif)]
    for q in range(min(K, 3)):
        e = [0.0] * K; e[q] = math.pi; pts.append(e)
    return pts


def fourier_pows(theta: list[float], emax: int) -> list[list[acb]]:
    pw = []
    for th in theta:
        ang = arb(th)
        z = acb(ang.cos(), ang.sin())
        lst = [acb(1)]
        for _ in range(emax):
            lst.append(lst[-1] * z)
        pw.append(lst)
    return pw


# ===================================================================================================== check C (L1 + L5)
def label_tails(Mo: Model, Tl: Tails) -> dict:
    """L5 (ii): T_X(w_r), T_X(dw_r) via the inverse tails, T_X(dl_r) via the rough-log recursion and the product rule (X = M_lab)."""
    X = Mo.M_lab; sm = Mo.sm
    out = dict(TW={}, TDW={}, TDL={}, TL={}, hw={}, hdw={}, Sw={}, Sdw={}, nw={}, ndw={})
    for r in Mo.labels:
        tw = arb(0); tdw = arb(0)
        for m1 in sm.m:
            if m1 * r > N0:
                break
            a = Mo.acoef(m1 * r)
            Ti = Tl.T_inv(X // m1)
            tw += a * Ti
            tdw += arb(m1 * r).log() / 2 * a * Ti + a * Tl.T_log(X // m1)
        lab = Mo.lab[r]; nl = lab['nl']
        hw = [x.abs_upper() for x in lab['nu']]
        hdw = [(arb(sm.m[i] * r).log() / 2 * lab['nu'][i]).abs_upper() for i in range(nl)]
        Sw = [arb(0)] * (nl + 1); Sdw = [arb(0)] * (nl + 1)
        for i in range(nl - 1, -1, -1):
            Sw[i] = Sw[i + 1] + hw[i]; Sdw[i] = Sdw[i + 1] + hdw[i]
        out['TW'][r] = tw.upper(); out['TDW'][r] = tdw.upper()
        out['hw'][r], out['hdw'][r], out['Sw'][r], out['Sdw'][r] = hw, hdw, Sw, Sdw
        out['nw'][r] = (Sw[0] + tw).upper(); out['ndw'][r] = (Sdw[0] + tdw).upper()

    def tprod(hf, Tf, Sg, Tg):
        """T_X(f g) <= sum_{m1 <= X} |f_m1| T_{X/m1}(g) + T_X(f) ||g||_1  (Lemma 5.2 (c) with Y = X)."""
        acc = arb(0)
        for i, m1 in enumerate(sm.m[:len(hf)]):
            j = min(sm.first_above(X // m1), len(Sg) - 1)
            acc += hf[i] * (Sg[j] + Tg)
        return (acc + Tf * (Sg[0] + Tg)).upper()
    p1, p2, p12 = Mo.labels
    for r in (p1, p2):
        out['TDL'][r] = out['TDW'][r]                       # prime labels: dl_r = dw_r
        out['TL'][r] = out['TW'][r]                         # prime labels: l_r = w_r
    # l_{p1 p2} = w_{p1 p2} - w_p1 w_p2   (rough-log recursion with l_p = w_p; Lemma 5.2 (d), (c))
    out['TL'][p12] = (out['TW'][p12] + tprod(out['hw'][p1], out['TW'][p1], out['Sw'][p2], out['TW'][p2])).upper()
    # dl_{p1 p2} = dw_{p1 p2} - (dw_p1 w_p2 + w_p1 dw_p2)   (rough-log recursion; identity (5.8) of the .md)
    out['TDL'][p12] = (out['TDW'][p12] + tprod(out['hdw'][p1], out['TDW'][p1], out['Sw'][p2], out['TW'][p2])
                       + tprod(out['hw'][p1], out['TW'][p1], out['Sdw'][p2], out['TDW'][p2])).upper()
    return out


def check_C() -> dict:
    t0 = time.time()
    ctx.prec = 128
    rng = random.Random(4242)
    models = {}
    for key, SP, hf, tf, af in CONFIGS:
        big = len(SP) > 3
        if QUICK:
            M, M_lab, M_id = (10 ** 10, 10 ** 8, 10 ** 5) if big else (10 ** 12, 10 ** 9, 10 ** 6)
        else:
            M, M_lab, M_id = (10 ** 13, 10 ** 10, 10 ** 7) if big else (10 ** 15, 10 ** 12, 10 ** 8)
        Mo = Model(hf, tf, af, M, M_lab, SP)
        models[key] = Mo
        sm = Mo.sm; K = len(SP); p1, p2, p12 = Mo.labels
        # L5 (i): b_m = sum log(m1) a_m1 inv_m2 vs the Dirichlet recursion
        ok = all(x.overlaps(y) for x, y in zip(Mo.b, Mo.b2))
        check(ok, f'C identity b = (log a) * inv  {key}')
        tally('C b identity', len(Mo.b))
        Tl = Tails(Mo)
        LT = label_tails(Mo, Tl)
        # K0 tail: sum_{m > M} |b_m|/2 <= sum_{m1 <= N0} (log m1/2) a_m1 T_{M/m1}(inv)      (L5 (iii), (5.13) of the .md)
        TK = arb(0)
        for m1 in sm.m:
            if m1 > N0:
                break
            if m1 > 1:
                TK += arb(m1).log() / 2 * Mo.acoef(m1) * Tl.T_inv(M // m1)
        TK = TK.upper()
        a = Mo.a
        kap = [(Mo.b[i] / 2) * (a * arb(m).log() / 2).cos() for i, m in enumerate(sm.m)]
        nl = Mo.lab[p1]['nl']
        rot = [acb((a * arb(m).log() / 2).cos(), (a * arb(m).log() / 2).sin()) for m in sm.m[:nl]]
        crf = {r: [-(Mo.lab[r]['b'][i] / 2) * (a * arb(sm.m[i] * r).log() / 2).cos() for i in range(nl)] for r in Mo.labels}
        sumb = arb(0)
        for x in Mo.b:
            sumb += x.abs_upper()
        Kbound = (sumb / 2 + TK).upper()
        dlb = {}
        for r in Mo.labels:
            acc = arb(0)
            for x in Mo.lab[r]['b']:
                acc += x.abs_upper()
            dlb[r] = (acc / 2 + LT['TDL'][r]).upper()
        worst = dict(K0=0.0, X=0.0, w=0.0, l=0.0, dl=0.0)
        emax = max(max(e) for e in sm.e)
        for th in theta_points(rng, K):
            pw = fourier_pows(th, emax)
            zm = [monomial(pw, e) for e in sm.e]
            K0F = arb(0)
            for i in range(len(sm.m)):
                K0F += kap[i] * zm[i].real
            dv = {sg: direct_values(Mo, th, sg) for sg in (1, -1)}
            K0 = -(dv[1]['d1'] / dv[1]['c1']).real / 2 - (dv[-1]['d1'] / dv[-1]['c1']).real / 2
            dif = K0 - K0F
            check(dif.abs_upper() <= TK, f'C K0 Fourier form {key} theta={th}')
            worst['K0'] = max(worst['K0'], float(dif.abs_upper()))
            for sg in (1, -1):
                Kv = (dv[sg]['d1'] / dv[sg]['c1'])
                check(abs(Kv).upper() <= Kbound, f'C |K| <= sum|b|/2 {key}')
            for r in Mo.labels:
                ph = acb((a * arb(r).log() / 2).cos(), (a * arb(r).log() / 2).sin())
                Xd = (dv[1]['dl'][r] * ph + dv[-1]['dl'][r] * ph.conjugate()) / 2
                XF = acb(0)
                for i in range(nl):
                    XF += crf[r][i] * zm[i]
                dx = abs(Xd - XF)
                check(dx.upper() <= LT['TDL'][r], f'C X_r Fourier form r={r} {key} theta={th}')
                worst['X'] = max(worst['X'], float(dx.upper()))
                for sg in (1, -1):
                    wF = acb(0); dlF = acb(0); lF = acb(0)
                    for i in range(nl):
                        zz = zm[i] * (rot[i] if sg == 1 else rot[i].conjugate())
                        wF += Mo.lab[r]['nu'][i] * zz
                        dlF += -(Mo.lab[r]['b'][i] / 2) * zz
                        lF += Mo.lab[r]['b'][i] / arb(sm.m[i] * r).log() * zz
                    dw_ = abs(dv[sg]['w'][r] - wF); ddl = abs(dv[sg]['dl'][r] - dlF); dl_ = abs(dv[sg]['l'][r] - lF)
                    check(dw_.upper() <= LT['TW'][r], f'C w_r Taylor form r={r} s={sg} {key}')
                    check(ddl.upper() <= LT['TDL'][r], f'C dl_r Taylor form r={r} s={sg} {key}')
                    check(dl_.upper() <= LT['TL'][r], f'C l_r Taylor form r={r} s={sg} {key}')
                    check(abs(dv[sg]['w'][r]).upper() <= LT['nw'][r], f'C |w_r| <= ||w_r||_1 r={r} {key}')
                    check(abs(dv[sg]['dl'][r]).upper() <= dlb[r], f'C |dl_r| <= ||dl_r||_1 r={r} {key}')
                    worst['w'] = max(worst['w'], float(dw_.upper())); worst['dl'] = max(worst['dl'], float(ddl.upper()))
                    worst['l'] = max(worst['l'], float(dl_.upper()))
                tally('C label (theta, r)')
            tally('C theta')
        # L5 identities (formal): [l_r]_m = b_{mr}/log(mr), [dl_r]_m = -b_{mr}/2 for the r2 recursion (r = p1, p1 p2), m <= M_id
        nid = sm.first_above(M_id)
        nu1, nu2, nu12 = Mo.lab[p1]['nu'], Mo.lab[p2]['nu'], Mo.lab[p12]['nu']
        for i in range(nid):
            m, e = sm.m[i], sm.e[i]
            check(nu1[i].overlaps(Mo.lab[p1]['b'][i] / arb(p1 * m).log()), f'C [l_p1]_m identity m={m} {key}')
            conv = arb(0); dconv = arb(0)
            for m1 in sdivisors(e, m, SP):
                j1, j2 = sm.idx[m1], sm.idx[m // m1]
                x1, x2 = nu1[j1], nu2[j2]
                conv += x1 * x2
                dconv += (-arb(p1 * m1).log() / 2) * x1 * x2 + x1 * (-arb(p2 * (m // m1)).log() / 2) * x2
            l12 = nu12[i] - conv
            dl12 = -arb(p12 * m).log() / 2 * nu12[i] - dconv
            check(l12.overlaps(Mo.lab[p12]['b'][i] / arb(p12 * m).log()), f'C [l_p1p2]_m identity m={m} {key}')
            check(dl12.overlaps(-Mo.lab[p12]['b'][i] / 2), f'C [dl_p1p2]_m identity m={m} {key}')
            tally('C formal identities', 3)
        # L5 (iii): far-tail bound vs direct partial tails; one-prime norms vs direct coefficient sums
        d = Tl.delta
        for X in [x for x in (10 ** 6, 10 ** 9, 10 ** 12) if x * 1000 <= M]:
            i0 = sm.first_above(X)
            head = arb(0)
            for j in range(i0):
                head += Tl.inv_lo[j] * Tl.mdel[j]
            bound = apow(arb(X), -d) * (Tl.invn - head)
            boundl = arb(X).log() / 2 * apow(arb(X), -d) * (Tl.invn - head)
            dirx = arb(0); dirl = arb(0)
            for j in range(i0, len(sm.m)):
                dirx += Tl.inv_lo[j]; dirl += arb(sm.m[j]).log() / 2 * Tl.inv_lo[j]
            check(dirx.lower() <= bound.upper() and dirl.lower() <= boundl.upper(), f'C far-tail bound X={X} {key}')
            tally('C far-tail X')
        for q in SP:
            al = Tl.alpha[q]
            phi = [arb(1)]
            for k in range(1, 301):
                x = arb(0)
                for i in range(1, min(k, len(al) - 1) + 1):
                    x -= al[i] * phi[k - i]
                phi.append(x)
            acc = arb(0)
            for k, x in enumerate(phi):
                acc += x.abs_lower() * apow(arb(q), d * k)
            check(acc.lower() <= Tl.qnorm[q][0], f'C one-prime norm q={q} {key}')
        print(f'[C] {key} (S = {set(SP)}, labels {Mo.labels}, M = {M:.0e}, M_lab = {M_lab:.0e}): delta={d}, '
              f'||1/c_1||_delta <= {float(Tl.invn.upper()):.5f}, far_inv(M) = {float(Tl.far_inv):.2e}, T(K0) = {float(TK):.2e}, '
              'T(dl_r) = ' + ', '.join(f'{r}:{float(LT["TDL"][r]):.2e}' for r in Mo.labels)
              + f'; worst |direct - series|: K0 {worst["K0"]:.2e}, X {worst["X"]:.2e}, w {worst["w"]:.2e}, l {worst["l"]:.2e}, '
              f'dl {worst["dl"]:.2e}', flush=True)
        Mo.Tl = Tl; Mo.LT = LT
    print(f'[C] L1/L5: {COUNTS.get("C theta", 0)} phase points, {COUNTS.get("C label (theta, r)", 0)} label evaluations, '
          f'{COUNTS.get("C formal identities", 0)} formal identities, {COUNTS.get("C b identity", 0)} b-identities '
          f'({time.time() - t0:.1f} s)', flush=True)
    return models


# ===================================================================================================== check D (L3)
def check_D(models: dict) -> dict:
    t0 = time.time()
    ctx.prec = 128
    key = CONFIGS[1][0]; Mo = models[key]; sm = Mo.sm; a = Mo.a; SP = Mo.SP; LABELS = Mo.labels; K = len(SP)
    NBD = 16 * N0                                            # head depth NB = 16 N0 as in tmp/r4-wolpd-cert.py
    nK = sm.first_above(NBD)
    kap = [(Mo.b[i] / 2) * (a * arb(sm.m[i]).log() / 2).cos() for i in range(nK)]
    c = {}; X0 = {}; S1 = {}; lam = {}
    for r in LABELS:
        nr = sm.first_above(NBD // r)
        c[r] = [-(Mo.lab[r]['b'][i] / 2) * (a * arb(sm.m[i] * r).log() / 2).cos() for i in range(nr)]
        X0[r] = sum(c[r], arb(0)); S1[r] = sum((x.abs_upper() for x in c[r][1:]), arb(0))
        lam[r] = arb(float(max(abs(float(X0[r].mid())), 0.5 * float((c[r][0].abs_upper() + S1[r]).mid()))))   # exact, > 0
    C = sum(kap, arb(0))
    for r in LABELS:
        C += (lam[r] ** 2 + X0[r] ** 2) / (2 * lam[r])
    Mm = [-kap[i] for i in range(nK)]
    for r in LABELS:
        for i, x in enumerate(c[r]):
            if i == 0:
                continue
            Mm[i] += (-X0[r] * x + S1[r] * x.abs_upper()) / lam[r]
    Mm[0] = arb(0)
    # one-prime functions f_q(theta) = sum_k M_{q^k} (1 - cos k theta) and mixed positive parts
    perq = {qi: [] for qi in range(K)}; mixed = arb(0)
    for i in range(1, nK):
        e = sm.e[i]; nz = [qi for qi in range(K) if e[qi] > 0]
        if len(nz) == 1:
            perq[nz[0]].append((e[nz[0]], Mm[i]))
        else:
            mixed += Mm[i].nonnegative_part()
    G = 1001 if QUICK else 4001; Gf = 10 * (G - 1) + 1
    fmax = {}
    for qi in range(K):
        C2 = sum((arb(k * k) * x.abs_upper() for k, x in perq[qi]), arb(0))
        g = arb.pi() / (G - 1)

        def fval(th):
            s = arb(0)
            for k, x in perq[qi]:
                s += x * (1 - (k * th).cos())
            return s
        coarse = [fval(arb.pi() * j / (G - 1)) for j in range(G)]
        cm = max((v.upper() for v in coarse), key=float)
        fmax[qi] = (cm + C2 * g * g / 8).upper()
        fine = max((fval(arb.pi() * j / (Gf - 1)).lower() for j in range(Gf)), key=float)
        check(fine <= fmax[qi], f'D grid lemma q={SP[qi]}')
        tally('D grid lemma')
    B = (C + sum(fmax.values(), arb(0)) + 2 * mixed).upper()
    rng = random.Random(77)
    pts = [[0.0] * K] + [[rng.gauss(0, 0.05) for _ in SP] for _ in range(12)] + [[rng.gauss(0, 0.3) for _ in SP] for _ in range(12)]
    pts += [[rng.uniform(-math.pi, math.pi) for _ in SP] for _ in range(24 if not QUICK else 6)]
    pts += [[math.pi if j == q else 0.0 for j in range(K)] for q in range(K)] + [[math.pi] * K]
    worst_gap = None; strict = 0
    for th in pts:
        pw = fourier_pows(th, 30)
        zm = [monomial(pw, e) for e in sm.e[:nK]]
        lhs = sum((kap[i] * zm[i].real for i in range(nK)), arb(0))
        for r in LABELS:
            H = sum((c[r][i] * zm[i] for i in range(len(c[r]))), acb(0))
            lhs += abs(H)
        rhs = C + sum((Mm[i] * (1 - zm[i].real) for i in range(1, nK)), arb(0))
        gap = rhs - lhs
        check(gap.lower() > -1e-30, f'D cosine majorant theta={th}')
        strict += gap.lower() >= 0
        check((B - lhs).lower() >= 0, f'D scalar bound theta={th}')
        worst_gap = float(gap.lower()) if worst_gap is None else min(worst_gap, float(gap.lower()))
        tally('D theta')
    print(f'[D] L3: C = {float(C.mid()):.6f}, sum_q max f_q = {float(sum(fmax.values(), arb(0)).mid()):.6f}, '
          f'2 sum_mixed M+ = {float((2 * mixed).mid()):.6f}, scalar bound {float(B):.6f}; {COUNTS.get("D theta", 0)} theta '
          f'({strict} certified strict), min(RHS - LHS) = {worst_gap:.3e} ({time.time() - t0:.1f} s)', flush=True)
    return dict(perq=perq, Mm=Mm, C=C, mixed=mixed)


# ===================================================================================================== check E (L4)
def Fq_val(alpha: list[arb], z: acb) -> acb:
    s = acb(0); zk = acb(1)
    for x in alpha:
        s += x * zk; zk = zk * z
    return s


def tail_functional(mu: list[arb], dmu: list[arb], thr: int, kmax: int) -> arb:
    """label-tail functional of the r2 bound function (exact form, Lemma 4.1 (d)):
    sum_{k=2}^{kmax} mass_{> thr}(dmu * mu^{*(k-1)}) + |dmu|_1 |mu|_1^kmax / (1 - |mu|_1)."""
    nb = len(mu)
    tot_mu = sum(mu, arb(0)); tot_d = sum(dmu, arb(0))
    D = list(dmu); tail = arb(0)
    for k in range(2, kmax + 1):
        conv = [arb(0)] * (len(D) + nb - 1)
        for i, x in enumerate(D):
            for j, y in enumerate(mu):
                conv[i + j] += x * y
        tail += sum(conv[thr + 1:], arb(0))
        D = conv
    return tail + tot_d * tot_mu ** kmax / (1 - tot_mu)


def check_E(models: dict, DD: dict) -> None:
    t0 = time.time()
    ctx.prec = 128
    key = CONFIGS[1][0]; Mo = models[key]; Tl = Mo.Tl; a = Mo.a; SP = Mo.SP; K = len(SP)
    alpha = Tl.alpha
    for q in SP:
        zf = sum(alpha[q][1:], arb(0))
        check(zf < 1, f'E zero-freeness sum_k a_(q^k) < 1 q={q}')
    delta0 = Tl.defect(Fr(0))
    G = 2048
    mq = {}; lipF = {}
    for q in SP:
        lipF[q] = sum((arb(k) * x for k, x in enumerate(alpha[q])), arb(0))
        vals = [abs(Fq_val(alpha[q], acb((arb.pi() * (2 * j - G) / G).cos(), (arb.pi() * (2 * j - G) / G).sin()))) for j in range(G)]
        mq[q] = (min((v.lower() for v in vals), key=float) - lipF[q] * arb.pi() / G).lower()
    prod_mq = arb(1)
    for q in SP:
        prod_mq *= mq[q]
    mu0 = (prod_mq - delta0).lower()
    check(mu0 > 0, 'E mu_0 > 0')
    wq = {q: acb((a * arb(q).log() / 2).cos(), (a * arb(q).log() / 2).sin()) for q in SP}
    Fw = {q: abs(Fq_val(alpha[q], wq[q])) for q in SP}
    prodFw = arb(1)
    for q in SP:
        prodFw *= Fw[q]

    def logg(q, phi: arb, s: int) -> arb:
        w = wq[q] if s == 1 else wq[q].conjugate()
        z = acb(phi.cos(), phi.sin()) * w
        return Fw[q].log() - abs(Fq_val(alpha[q], z)).log()
    rng = random.Random(11)
    nsamp = 40 if QUICK else 120
    for it in range(nsamp):
        sc = [0.02, 0.1, 0.4, 1.0, 3.2][it % 5]
        th = [rng.gauss(0, sc) for _ in SP]
        P = None
        for s in (1, -1):
            lg = sum((logg(q, arb(th[qi]), s) for qi, q in enumerate(SP)), arb(0))
            P = lg if P is None else (lg if float(lg.mid()) > float(P.mid()) else P)
            dv = direct_values(Mo, th, s)
            c1 = abs(dv['c1'])
            prodF = arb(1)
            for qi, q in enumerate(SP):
                ang = arb(th[qi]) + s * a * arb(q).log() / 2
                prodF *= abs(Fq_val(alpha[q], acb(ang.cos(), ang.sin())))
            check((c1 - (prodF - delta0)).lower() >= 0, f'E |c_1| >= prod|F_q(z_q)| - delta_0 s={s}')
            check((prodF - prodFw * (-lg).exp()).abs_upper() < 1e-25, f'E prod|F_q(z_q)| = prod|F_q(w_q)| e^(-sum log g) s={s}')
            check((c1 - mu0).lower() >= 0, 'E |c_1| >= mu_0')
            tally('E region (theta, s)')
    for it in range(50):
        phi = arb(rng.uniform(-math.pi, math.pi))
        for q in SP:
            check(logg(q, phi, -1).overlaps(logg(q, -phi, 1)), 'E probe symmetry log g^-(phi) = log g^+(-phi)')
            tally('E probe symmetry')
    # weak duality on {P > G} with the even one-prime functions of check D and l_q = log g_q^+ (grid + Lipschitz)
    perq = DD['perq']
    Gd = 512 if QUICK else 1024
    grid = [arb.pi() * (2 * j - Gd) / Gd for j in range(Gd)]
    fq_grid = {}; lg_grid = {}; lipf = {}; lipl = {}
    for qi, q in enumerate(SP):
        fq_grid[qi] = [sum((x * (1 - (k * ph).cos()) for k, x in perq[qi]), arb(0)) for ph in grid]
        lg_grid[qi] = [logg(q, ph, 1) for ph in grid]
        lipf[qi] = sum((arb(k) * x.abs_upper() for k, x in perq[qi]), arb(0))
        lipl[qi] = lipF[q] / mq[q]
    for Gthr in (Fr(1, 20), Fr(3, 20), Fr(3, 10)):
        Ga = A(Gthr); best = None
        for lamf in (Fr(0), Fr(1, 20), Fr(1, 10), Fr(1, 5), Fr(1, 2), Fr(1), Fr(2)):
            lm = A(lamf); tot = -lm * Ga
            for qi in range(K):
                hv = max(((fq_grid[qi][j] + lm * lg_grid[qi][j]).upper() for j in range(Gd)), key=float)
                tot += hv + (lipf[qi] + lm * lipl[qi]) * arb.pi() / Gd
            best = tot.upper() if best is None or float(tot.upper()) < float(best) else best
        nviol = 0; ntested = 0
        for it in range(600 if QUICK else 2500):
            th = [rng.uniform(-math.pi, math.pi) for _ in SP] if it % 2 else [rng.gauss(0, 0.6) for _ in SP]
            Pv = max(sum((logg(q, arb(th[qi]), s) for qi, q in enumerate(SP)), arb(0)).lower() for s in (1, -1))
            if not Pv > Ga:
                continue
            ntested += 1
            fs = arb(0)
            for qi in range(K):
                fs += sum((x * (1 - (k * arb(th[qi])).cos()) for k, x in perq[qi]), arb(0))
            if not fs.lower() <= best:
                nviol += 1
        check(nviol == 0, f'E weak duality G={Gthr}')
        tally('E duality samples', ntested)
        print(f'[E] duality G={float(Gthr)}: bound {float(best):+.6f}, {ntested} sampled theta with P > G, violations {nviol}', flush=True)
    # monotonicity of the label-tail functional and of the assembly maps
    for it in range(20 if QUICK else 60):
        nb = 12; thr = 8
        mu = [arb(rng.uniform(0, 0.08)) for _ in range(nb)]; dmu = [arb(rng.uniform(0, 0.1)) for _ in range(nb)]
        T1 = tail_functional(mu, dmu, thr, 6)
        mu2 = [x + arb(rng.uniform(0, 0.005)) for x in mu]; dmu2 = [x + arb(rng.uniform(0, 0.005)) for x in dmu]
        T2 = tail_functional(mu2, dmu2, thr, 6)
        check((T2 - T1).lower() >= 0, 'E tail functional monotone')
        Wn, A2, B2 = arb(rng.uniform(0, 0.4)), arb(rng.uniform(0, 0.3)), arb(rng.uniform(0, 0.3))
        dW, dA, dB = arb(0.01), arb(0.01), arb(0.01)

        def beta(B2_, Wn_):
            return B2_ / (1 - Wn_ ** 2)

        def hi(A2_, B2_, Wn_):
            V = A2_ / (1 - Wn_); return B2_ / (1 - Wn_) * V / (1 - V)
        check((beta(B2 + dB, Wn + dW) - beta(B2, Wn)).lower() >= 0, 'E beta monotone')
        check((hi(A2 + dA, B2 + dB, Wn + dW) - hi(A2, B2, Wn)).lower() >= 0, 'E hi monotone')
        tally('E monotonicity')
    print(f'[E] L4: mu_0 = {float(mu0):.5f} (prod_q min|F_q| = {float(prod_mq.mid()):.5f}, delta_0 = {float(delta0):.5f}); '
          f'{COUNTS.get("E region (theta, s)", 0)} region evaluations, {COUNTS.get("E probe symmetry", 0)} symmetry checks, '
          f'{COUNTS.get("E duality samples", 0)} duality samples, {COUNTS.get("E monotonicity", 0)} monotonicity trials '
          f'({time.time() - t0:.1f} s)', flush=True)


# ===================================================================================================== check F (L5 time)
def check_F(models: dict) -> None:
    t0 = time.time()
    ctx.prec = 128
    key, hf, t1f, t2f, af = ENTRIES[1]
    SP = models[CONFIGS[1][0]].SP
    h = A(hf); t1, t2 = A(t1f), A(t2f); tc = A((t1f + t2f) / 2); L = 2 * arb(N0).log()
    Mo = models[CONFIGS[1][0]]
    # twisting identity for b (n <= NT) and for inv (smooth m <= MT)
    NT = 1000 if QUICK else 3000
    logs = [arb(0)] + [arb(n).log() for n in range(1, NT + 1)]
    b = bvec(NT, t1, h, L, logs)
    at = [arb(0)] + [((t1 * logs[n] ** 2) / 4 - (1 + h) * logs[n] / 2).exp() for n in range(1, NT + 1)]
    acc = [arb(0)] * (NT + 1); bt = [arb(0)] * (NT + 1)
    for n in range(2, NT + 1):
        acc[n] = at[n] * logs[n]
    for dd in range(2, NT + 1):
        bt[dd] = acc[dd]
        for k in range(2, NT // dd + 1):
            acc[dd * k] -= bt[dd] * at[k]
    for n in range(2, NT + 1):
        check(b[n].overlaps((-t1 * L * logs[n] / 4).exp() * bt[n]), f'F twisting b n={n}')
        tally('F twisting')
    sm = Smooth(10 ** 10, SP)

    def tw_coef(n: int, tv: arb) -> arb:
        v = arb(n).log(); return (tv * v * v / 4 - (1 + h) * v / 2).exp()

    def inv_rec(coef) -> list[arb]:
        out = [arb(0)] * len(sm.m)
        for i, (m, e) in enumerate(zip(sm.m, sm.e)):
            if m == 1:
                out[i] = arb(1); continue
            s = arb(0)
            for d in sdivisors(e, N0, SP):
                if d > 1:
                    s -= coef(d) * out[sm.idx[m // d]]
            out[i] = s
        return out
    i1 = inv_rec(lambda n: tw_coef(n, t1)); i2 = inv_rec(lambda n: tw_coef(n, t2)); ic = inv_rec(lambda n: tw_coef(n, tc))
    for i, m in enumerate(sm.m):
        check(Mo.inv[Mo.sm.idx[m]].overlaps((-t1 * L * arb(m).log() / 4).exp() * i1[i]), f'F twisting inv m={m}')
        tally('F twisting')
    # interval recursion over the piece (twisted coefficients increasing in t), then the mean-value enclosure
    iv = inv_rec(lambda n: tw_coef(n, t1).union(tw_coef(n, t2)))
    ivup = [x.abs_upper() for x in iv]
    for i in range(len(sm.m)):
        check(iv[i].contains(i1[i]) and iv[i].contains(i2[i]) and iv[i].contains(ic[i]), f'F interval recursion m={sm.m[i]}')
    I2 = [arb(0)] * len(sm.m)
    for i, (m, e) in enumerate(zip(sm.m, sm.e)):
        s = arb(0)
        for m1 in sdivisors(e, m, SP):
            s += ivup[sm.idx[m1]] * ivup[sm.idx[m // m1]]
        I2[i] = s
    hdt = (t2 - t1) / 2
    nmv = 0
    for i, (m, e) in enumerate(zip(sm.m, sm.e)):
        der = arb(0)
        for m1 in sdivisors(e, N0, SP):
            if m1 > 1:
                der += arb(m1).log() ** 2 / 4 * tw_coef(m1, t2) * I2[sm.idx[m // m1]]
        for x in (i1[i], i2[i]):
            check(abs(x - ic[i]).upper() <= (hdt * der).upper(), f'F mean-value enclosure m={m}')
            nmv += 1
    tally('F mean-value', nmv)
    print(f'[F] L5 time enclosures: {COUNTS.get("F twisting", 0)} twisting identities, {nmv} mean-value checks on {len(sm.m)} '
          f'smooth m <= 1e10 ({time.time() - t0:.1f} s)', flush=True)


# ===================================================================================================== main
def main() -> int:
    t0 = time.time()
    print(f'verify_wol_pd_lemmas.py  (python-flint arb; {"quick" if QUICK else "full"} mode)', flush=True)
    check_A()
    check_B()
    models = check_C()
    DD = check_D(models)
    check_E(models, DD)
    check_F(models)
    print(f'TOTAL: {COUNTS.get("checks", 0)} checks, {len(FAIL)} failures, {time.time() - t0:.1f} s')
    print('PASS' if not FAIL else 'FAIL')
    return 0 if not FAIL else 1


if __name__ == '__main__':
    sys.exit(main())
