#!/usr/bin/env python3
"""Arb spot-check for formalization/paper/cg-monotonicity.md (Lemma CG, the covering identity for the Euler-product head
coefficients c_n(t) of Raymond's chain).

The lemma is proved algebraically in the .md. This script checks the identity and its consequences in ball arithmetic
(python-flint arb). It is a spot-check, not part of the proof. Exit code 0 iff every check passes.

Definitions (same as the .md):
  b_t(x) = exp(t log^2 x / 4),  beta_g(t) = prod_{p | g} b_t(p),
  C_g(u, t) = sum_{d | g} mu(d) beta_d(t) b_t(u / d)              (Moebius form; g squarefree, g | 30; u > 0 real)
            = b_t(w) beta_g(t) sum_{(T,E) covers P} prod_T pi_p prod_E r_pq   (covering form; w = u/g)
  pi_p = expm1(t log p log w / 2),  r_pq = expm1(t log p log q / 2),
  c_n(t) = C_{gcd(n,30)}(n, t).

Checks:
  1  identity (Moebius vs covering) for every n <= 1024 at every cell endpoint t = i/4000, 0 <= i <= 608 (balls overlap)
  1b every n <= 1114185 (N0 at floor height 2.6X) at t in {1/4000, 300/4000, 607/4000, 41/250}: identity, term signs,
     sign pattern of Cor. CG3
  2  every covering term has lower endpoint >= 0; c_n(t) certified > 0 where Cor. CG3 predicts, exactly 0 for n in {2,3,5}
  3  c_n(0) = [gcd(n,30) = 1]; c_1 = 1
  4  t-monotonicity: c_n(t_{i+1}) - c_n(t_i) certified > 0 (or exactly 0 for n in {1,2,3,5}); dC/dt in covering form
     (sum of nonnegative terms) certified >= 0 and overlapping the Moebius-form derivative
  5  u-monotonicity: Track A head bins at N0 = 690988 (multiplicative width 1/128): c_n(t) >= C_g(n1, t_L) for every n in
     the bin with gcd(n,30) = g, t in {t_L, t_R}, several bins and cells
  6  Raymond's two constructions of the head coefficients for n <= 1024 (complete inclusion-exclusion; descending
     multiplication by the three Euler factors) overlap the covering form at t_L of several cells
  7  random real u in [g, (1+3e6)g] and t in [0, 0.2]: identity and positivity
  8  cancellation demonstration: at t = 1e-30 and 64-bit precision the Moebius form of c_30 is a ball containing 0
     (sign not decidable), the covering form is certified > 0

usage: python3 verify_cg_monotonicity.py [--quick]      (needs python-flint; e.g. /tmp/s145venv/bin/python)
  --quick  every 8th cell endpoint in checks 1-4, check 1b reduced to n = 1 (a few seconds)
"""
from __future__ import annotations

import itertools
import math
import random
import sys
import time

from flint import arb, ctx

PRIMES = (2, 3, 5)
FAIL: list[str] = []
COUNTS: dict[str, int] = {}


def check(cond: bool, what: str) -> None:
    if not cond:
        FAIL.append(what)
        if len(FAIL) <= 20:
            print('FAIL', what, flush=True)


def tally(key: str, k: int = 1) -> None:
    COUNTS[key] = COUNTS.get(key, 0) + k


def pset(g: int) -> tuple[int, ...]:
    return tuple(p for p in PRIMES if g % p == 0)


def mu(d: int) -> int:
    return (-1) ** len(pset(d))


def divisors(g: int) -> list[int]:
    return [d for d in (1, 2, 3, 5, 6, 10, 15, 30) if g % d == 0]


def covers(P: tuple[int, ...]) -> list[tuple[tuple[int, ...], tuple[tuple[int, int], ...]]]:
    """all (T, E): T subset P, E subset of pairs of P, T u V(E) = P."""
    edges = list(itertools.combinations(P, 2))
    out = []
    for kT in range(len(P) + 1):
        for T in itertools.combinations(P, kT):
            for kE in range(len(edges) + 1):
                for E in itertools.combinations(edges, kE):
                    if set(T) | {v for e in E for v in e} == set(P):
                        out.append((T, E))
    return out


COV = {pset(g): covers(pset(g)) for g in (1, 2, 3, 5, 6, 10, 15, 30)}
assert [len(COV[pset(g)]) for g in (1, 2, 6, 30)] == [1, 1, 5, 45]


class Ctx:
    """precision-bound constants."""

    def __init__(self, prec: int) -> None:
        ctx.prec = prec
        self.lp = {p: arb(p).log() for p in PRIMES}


def C_mobius(K: Ctx, g: int, u: arb, t: arb) -> arb:
    s = arb(0)
    for d in divisors(g):
        q = sum((K.lp[p] ** 2 for p in pset(d)), arb(0))
        s += mu(d) * (t * q / 4).exp() * (t * (u / d).log() ** 2 / 4).exp()
    return s


def dC_mobius(K: Ctx, g: int, u: arb, t: arb) -> arb:
    s = arb(0)
    for d in divisors(g):
        q = sum((K.lp[p] ** 2 for p in pset(d)), arb(0)); l2 = (u / d).log() ** 2
        s += mu(d) * ((q + l2) / 4) * (t * (q + l2) / 4).exp()
    return s


def C_cover(K: Ctx, g: int, u: arb, t: arb, want_terms: bool = False, deriv: bool = False):
    """covering form; returns (value, terms, derivative) with derivative from the product rule (all parts >= 0)."""
    P = pset(g); w = u / g; lw = w.log()
    pi = {p: (t * K.lp[p] * lw / 2).expm1() for p in P}
    dpi = {p: (K.lp[p] * lw / 2) * (t * K.lp[p] * lw / 2).exp() for p in P}
    r = {e: (t * K.lp[e[0]] * K.lp[e[1]] / 2).expm1() for e in itertools.combinations(P, 2)}
    dr = {e: (K.lp[e[0]] * K.lp[e[1]] / 2) * (t * K.lp[e[0]] * K.lp[e[1]] / 2).exp() for e in itertools.combinations(P, 2)}
    q = lw ** 2 + sum((K.lp[p] ** 2 for p in P), arb(0))
    pref = (t * q / 4).exp(); dpref = (q / 4) * pref
    terms = []; dsum = arb(0)
    for T, E in COV[P]:
        f = [pi[p] for p in T] + [r[e] for e in E]
        df = [dpi[p] for p in T] + [dr[e] for e in E]
        v = arb(1)
        for x in f: v *= x
        terms.append(v)
        if deriv:
            for k in range(len(f)):
                pr = df[k]
                for m, x in enumerate(f):
                    if m != k: pr *= x
                dsum += pr
    S = sum(terms, arb(0))
    val = pref * S
    der = (dpref * S + pref * dsum) if deriv else None
    return val, (terms if want_terms else None), der


def nonneg(x: arb) -> bool:
    """certified x >= 0 (exact zero counts)."""
    return x >= 0


def main() -> int:
    quick = '--quick' in sys.argv
    t0 = time.time()
    K = Ctx(128)
    step = 8 if quick else 1
    tgrid = [arb(i) / 4000 for i in range(0, 609, step)]
    if tgrid[-1] != arb(608) / 4000:
        tgrid.append(arb(608) / 4000)

    # ---------------------------------------------------------------- checks 1-4 on n <= 1024 and the cell-endpoint grid
    for n in range(1, 1025):
        g = math.gcd(n, 30); u = arb(n); prev = None
        for k, t in enumerate(tgrid):
            vm = C_mobius(K, g, u, t)
            vc, terms, dc = C_cover(K, g, u, t, want_terms=True, deriv=True)
            check(vm.overlaps(vc), f'identity n={n} t={t}'); tally('identity')
            check(all(nonneg(x) for x in terms), f'term sign n={n} t={t}'); tally('terms', len(terms))
            if n in (2, 3, 5):
                check(vc == 0, f'c_p exactly 0 n={n} t={t}')
            elif k > 0 or g == 1:
                check(vc > 0, f'strict positivity n={n} t={t}')
            else:
                check(vc == 0, f'c_n(0)=0 for gcd>1 n={n}')
            if k == 0:
                check((vc == 1) if g == 1 and n == 1 else True, 'c_1 = 1')
                check(vm.contains(1 if g == 1 else 0), f'c_n(0) = [gcd=1] n={n}'); tally('t0')
            check(nonneg(dc), f'derivative sign n={n} t={t}')
            check(dc.overlaps(dC_mobius(K, g, u, t)), f'derivative identity n={n} t={t}'); tally('deriv')
            if prev is not None:
                diff = vc - prev
                if n in (1, 2, 3, 5):
                    check(diff == 0, f'constant c_n n={n}')
                else:
                    check(diff > 0, f't-monotone n={n} t={t}'); tally('tmono')
            prev = vc
    print(f'checks 1-4: n <= 1024 x {len(tgrid)} times; identity {COUNTS.get("identity")}, terms {COUNTS.get("terms")}, '
          f't-steps {COUNTS.get("tmono")}, derivative {COUNTS.get("deriv")}; {time.time() - t0:.1f} s', flush=True)

    # ---------------------------------------------------------------- check 1b: every n <= N0(2.6X) at four times
    NMAX = 1 if quick else 1114185          # N0 at 2.6X; covers N0 = 690988 (PT floor height) and 874038 (1.6X)
    t1 = time.time(); n1b = 0
    for t in (arb(1) / 4000, arb(300) / 4000, arb(607) / 4000, arb(41) / 250):
        for n in range(1, NMAX + 1):
            g = math.gcd(n, 30); u = arb(n)
            vm = C_mobius(K, g, u, t); vc, terms, _ = C_cover(K, g, u, t, want_terms=True)
            ok = vm.overlaps(vc) and all(nonneg(x) for x in terms) and ((vc == 0) if n in (2, 3, 5) else (vc > 0))
            check(ok, f'n <= N0 check n={n} t={t}'); n1b += 1
    print(f'check 1b: every n <= {NMAX} at t in {{1/4000, 300/4000, 607/4000, 41/250}}: identity, term signs, sign of c_n '
          f'({n1b} values, {time.time() - t1:.1f} s)', flush=True)

    # ---------------------------------------------------------------- check 5: Track A head bins (u-monotonicity)
    N0 = 690988

    def bins(a: int, b: int) -> list[tuple[int, int]]:
        out = []; n = a
        while n <= b:
            m = min(b, max(n, (n * 129) // 128)); out.append((n, m)); n = m + 1
        return out

    HB = bins(1025, N0)
    pick = [HB[0], HB[1], HB[len(HB) // 3], HB[len(HB) // 2], HB[-2], HB[-1]]
    nb = 0
    for (n1, n2) in pick:
        for cell in (0, 37, 300, 607):
            tL = arb(cell) / 4000; tR = arb(cell + 1) / 4000
            for g in (1, 2, 3, 5, 6, 10, 15, 30):
                lo = C_cover(K, g, arb(n1), tL)[0]
                check(nonneg(lo), f'bin lower value sign g={g} n1={n1}')
                for n in range(n1, n2 + 1):
                    if math.gcd(n, 30) != g:
                        continue
                    for t in (tL, tR):
                        v = C_cover(K, g, arb(n), t)[0]
                        d = v - lo
                        if n == n1 and t is tL:
                            check(not (d < 0), f'bin rule n={n}')
                        elif cell == 0 and t is tL:
                            # t = 0: C_g(u, 0) = [g = 1] for every u, so the bin rule holds with equality
                            check(d == 0, f'bin rule at t = 0 (equality) n={n} g={g}')
                        else:
                            check(d > 0, f'bin rule n={n} g={g} n1={n1} cell={cell}')
                        nb += 1
    print(f'check 5: {len(pick)} Track A head bins of {len(HB)} (N0 = {N0}) x 4 cells, {nb} comparisons c_n(t) >= C_g(n1, t_L)', flush=True)

    # ---------------------------------------------------------------- check 6: Raymond's two constructions (lanes A, B)
    HEAD = 1024
    logs = [arb(0)] + [arb(m).log() for m in range(1, HEAD + 1)]
    nl = 0
    for cell in (0, 1, 75, 300, 450, 607):
        tl = arb(cell) / 4000
        raw = [arb(0)] + [(tl * l * l / 4).exp() for l in logs[1:]]
        coefA = raw.copy()
        for k in range(1, 4):
            for S in itertools.combinations(PRIMES, k):
                d = math.prod(S); w = (-1) ** k * (tl * sum((logs[p] ** 2 for p in S), arb(0)) / 4).exp()
                for m in range(d, HEAD + 1, d):
                    coefA[m] += w * raw[m // d]
        coefB = raw.copy()
        for p in reversed(PRIMES):
            w = (tl * logs[p] ** 2 / 4).exp()
            for m in range(HEAD - HEAD % p, p - 1, -p):
                coefB[m] -= w * coefB[m // p]
        for m in range(1, HEAD + 1):
            vc = C_cover(K, math.gcd(m, 30), arb(m), tl)[0]
            check(coefA[m].overlaps(vc) and coefB[m].overlaps(vc), f'lanes A/B vs covering n={m} cell={cell}')
            nl += 1
    print(f'check 6: lanes A (inclusion-exclusion) and B (descending Euler multiplication) overlap the covering form: {nl} values', flush=True)

    # ---------------------------------------------------------------- check 7: random real u, t
    rng = random.Random(20261002)
    nr = 0
    for _ in range(6000):
        g = rng.choice((1, 2, 3, 5, 6, 10, 15, 30))
        u = arb(g) * (1 + arb(rng.random()) * rng.choice((1e-9, 1e-3, 1, 1e3, 1e6, 3e6)))
        t = arb(rng.random()) * arb('0.2')
        vm = C_mobius(K, g, u, t); vc, terms, _ = C_cover(K, g, u, t, want_terms=True)
        check(vm.overlaps(vc), f'random identity g={g}'); check(all(nonneg(x) for x in terms), f'random term sign g={g}')
        nr += 1
    print(f'check 7: {nr} random (g, u, t) with u in [g, 3e6 g], t in [0, 0.2]: identity and term signs', flush=True)

    # ---------------------------------------------------------------- check 8: cancellation demonstration
    K64 = Ctx(64)
    t = arb(10) ** -30
    vm = C_mobius(K64, 30, arb(30 * 7), t); vc = C_cover(K64, 30, arb(30 * 7), t)[0]
    check(vm.contains(0) and vc > 0, 'cancellation demonstration')
    print(f'check 8: t = 1e-30, prec 64, n = 210: Moebius form {vm.str(3)} (contains 0: {vm.contains(0)}); covering form '
          f'{vc.str(3)} (> 0: {vc > 0})', flush=True)
    ctx.prec = 128

    print(f'total {time.time() - t0:.1f} s; failures: {len(FAIL)}')
    print('RESULT', 'PASS' if not FAIL else 'FAIL')
    return 0 if not FAIL else 1


if __name__ == '__main__':
    sys.exit(main())
