#!/usr/bin/env python3
"""Checks for formalization/paper/joint-pair-arbitrary-shift.md (Theorem 4': Raymond's two-probe joint floor at an
arbitrary shift 0 < a < 2, with the Track A label families).

The theorem is proved in the .md as an implication from the one-point input (OP) at each probe point, Lemma CG and
Lemma R. This script checks, fail-closed, the finite facts that the instances actually used need, and reproduces stored
table entries at the out-of-catalogue shifts with an independent implementation of the gain formula. It does not check
(OP) itself (AF Part I sections 6-9; open G0 item), Lemma R, the kernel inequalities or the consumers.

  A  domain (Dom) for every table used by a sub-0.145 value or by the two-height coupling: X - 4 > 4 pi N0^2 (arb),
     N0 >= 1025, 2/(X - 2) < 1/20 (no shift pair skips a frequency rectangle), Lemma R budget 50/(X-4) + 4/(X-6) < 1e-10,
     every height in [11/20, 12/5], every time cell inside [0, 4/25], r h < 2 for every fixed-ratio mode and h/sqrt(3) < 2
     for the sharp interval, on every cell present in the table (exact rationals)
  B  independent recomputation of the base joint floor (Raymond cone gain over n <= 1024 + 8 Euler harmonics, min over the
     11 pair classes) at the six out-of-catalogue ratios and r = 3/5, from the archived one-point records, with head
     coefficients from the covering identity (Lemma CG) instead of either of Raymond's two constructions; compared with
     TABLES_BASE.json ('both')
  C  independent recomputation of the Track A head-bin gain H (labels 1025..N0, bin lower bounds by Lemma CG) at the
     out-of-catalogue ratios; compared with GAINS.json
  D  randomized algebra check of the chain Lemma 2 + (3) + Lemma 3 + translation identity on synthetic label sets whose
     phases are evaluated at x - a and x + a directly (float; catches sign or convention errors, proves nothing)

usage: python3 verify_joint_pair_shifts.py [--quick]     (needs python-flint; e.g. /tmp/s145venv/bin/python)
  --quick  fewer cells in B and C
Exit code 0 iff every check passes.
"""
from __future__ import annotations

import cmath
import importlib.util
import json
import math
import random
import sys
import time
from fractions import Fraction as F
from pathlib import Path

from flint import arb, ctx

REPO = Path(__file__).resolve().parents[2]
TMP = REPO / 'tmp'
ARCH = Path('/tmp/b145-B-archive')
FAIL: list[str] = []


def check(cond: bool, what: str, quiet: bool = False) -> None:
    if not quiet or not cond:
        print(('PASS ' if cond else 'FAIL ') + what, flush=True)
    if not cond:
        FAIL.append(what)


spec = importlib.util.spec_from_file_location('b145lib', TMP / 'b145-B-lib.py')
BL = importlib.util.module_from_spec(spec); spec.loader.exec_module(BL)
ENDS, PAIRS = BL.ENDS, BL.PAIRS
CATALOGUE = sorted({F(k['r']) for k in BL.KERNELS})
EXTRA = [F(29, 50), F(16, 25), F(17, 25), F(7, 10), F(37, 50), F(19, 25)]
MH_R = sorted({F(json.load(open(f))['r']) for f in (TMP / 'b145-B-out/kernels').glob('MH*.json')})

# tables: tag -> (role, plan path relative to tmp/, probe dir or None)
TABLES = {
    'X1_P100MH': ('b145 PT stack 0.147273668782792 (superseded at PT by Route P): two-height low set, PLAN', 's145-1-g1/data/PLAN.json', '/tmp/s145-1-archive/X1'),
    'X1_P0_97': ('b145 PT stack grid set 0.97 (catalogue ratios)', 'b145-B-out/plans/X1_mult_0_97b.json', None),
    'X160_P100MH': ('Route H 1.6X band 1: two-height low set, PLAN', 's145-1-g1/data/PLAN.json', str(ARCH / 'X160_P100')),
    'X160_P0_97MH': ('Route H 1.6X band 1: two-height low set, 0.97 PLAN', 'r2-height-out/plans/X160_mult_0_97.json', str(ARCH / 'X160_P0_97')),
    'X160_P0_94MH': ('Route H 1.6X band 1: two-height low set, 0.94 PLAN', 'r2-height-out/plans/X160_mult_0_94.json', str(ARCH / 'X160_P0_94')),
    'X160_P0_91': ('Route H 1.6X band 1: catalogue set 0.91 PLAN (h >= 127/200)', 'r2-height-out/plans/X160_mult_0_91.json', None),
    'X165_P100MH': ('Route H three-band, band 2 at 1.65X: two-height low set, PLAN', 's145-1-g1/data/PLAN.json', str(ARCH / 'X165_P100MH')),
    'X165_P0_97': ('Route H three-band, band 2 at 1.65X: catalogue set 0.97', 'r2-height-out/plans/X165_mult_0_97.json', None),
    'X165_P0_94': ('Route H three-band, band 2 at 1.65X: catalogue set 0.94', 'r2-height-out/plans/X165_mult_0_94.json', None),
    'XW26_P100': ('U2 = 2.6X certified stack (Route P and Route H): catalogue, PLAN', 's145-1-g1/data/PLAN.json', None),
    'XW26_P0_97': ('U2 = 2.6X certified stack: catalogue set 0.97', 'b145-B-out/plans/XW26_mult_0_97.json', None),
    'XW26_P0_94': ('U2 = 2.6X certified stack: catalogue set 0.94', 'b145-B-out/plans/XW26_mult_0_94.json', None),
}


def mode_r(m: str) -> F | None:
    if m == 'sharp': return None
    a, b = m[2:].split('_'); return F(int(a), int(b))


# ------------------------------------------------------------------------------------------------------------ A: domain
def check_domain() -> dict:
    ctx.prec = 128
    summary = {}
    for tag, (role, plan, _) in TABLES.items():
        s = json.load(open(ARCH / tag / 'SUMMARY.json')); X, N0 = s['X'], s['N0']
        rows = {r['time_index']: r for r in json.load(open(TMP / plan))['rows']}
        tabs = json.load(open(ARCH / tag / 'TABLES.json'))
        cells = sorted(int(i) for i in tabs)
        modes = sorted(next(iter(tabs.values())).keys())
        rs = [mode_r(m) for m in modes if m != 'sharp']
        hs = [F(rows[i]['height']) for i in cells]
        ok_X = arb(X - 4) > 4 * arb.pi() * arb(N0) ** 2
        ok_N0 = N0 >= 1025
        ok_seam = F(2, X - 2) < F(1, 20)
        ok_R = F(50, X - 4) + F(4, X - 6) < F(1, 10**10)
        ok_h = all(F(11, 20) <= h <= F(12, 5) for h in hs)
        ok_t = all(F(0) <= F(rows[i]['t_lo']) < F(rows[i]['t_hi']) <= F(4, 25) for i in cells)
        maxrh = max(r * h for r in rs for h in hs)
        ok_rh = maxrh < 2
        ok_sharp = all(h * h / 3 < 4 for h in hs)
        extra_here = sorted(set(rs) - set(CATALOGUE))
        all_ok = ok_X and ok_N0 and ok_seam and ok_R and ok_h and ok_t and ok_rh and ok_sharp
        check(all_ok, f'A {tag}: X={X} N0={N0} cells={len(cells)} h in [{float(min(hs)):.4f}, {float(max(hs)):.4f}] '
              f'modes={len(modes)} extra r={[str(r) for r in extra_here]} max r*h={float(maxrh):.4f} < 2  [{role}]')
        summary[tag] = {'X': X, 'N0': N0, 'cells': len(cells), 'hmin': str(min(hs)), 'hmax': str(max(hs)),
                        'maxrh': str(maxrh), 'extra': [str(r) for r in extra_here], 'role': role}
    check(set(MH_R) - set(CATALOGUE) == set(EXTRA), f'A two-height kernels use r in {[str(r) for r in MH_R]}; out-of-catalogue part = '
          f'{[str(r) for r in EXTRA]}')
    check(all(3 * r * r >= 1 for r in MH_R), 'A two-height kernels: 3 r^2 >= 1 (pair self term decreasing; coupling side condition)')
    return summary


# ---------------------------------------------------------------------------------------------- shared: Lemma CG values
LP = None


def cg_cover(g: int, u: arb, t: arb) -> arb:
    """C_g(u, t) by the covering identity (all terms >= 0 for u >= g, t >= 0)."""
    P = [p for p in (2, 3, 5) if g % p == 0]; lw = (u / g).log()
    pi = {p: (t * LP[p] * lw / 2).expm1() for p in P}
    r = {(p, q): (t * LP[p] * LP[q] / 2).expm1() for i, p in enumerate(P) for q in P[i + 1:]}
    tot = arb(0)
    edges = list(r)
    for mT in range(1 << len(P)):
        for mE in range(1 << len(edges)):
            T = [P[k] for k in range(len(P)) if mT >> k & 1]; E = [edges[k] for k in range(len(edges)) if mE >> k & 1]
            if set(T) | {v for e in E for v in e} != set(P): continue
            v = arb(1)
            for p in T: v *= pi[p]
            for e in E: v *= r[e]
            tot += v
    return (t * (lw ** 2 + sum((LP[p] ** 2 for p in P), arb(0))) / 4).exp() * tot


def lo(x: arb) -> arb:
    return x.lower()


def att(phi_lo: arb, phi_hi: arb) -> arb:
    """rigorous lower bound of inf_{phi in [phi_lo, phi_hi]} (1 - |cos phi|) (0 if the interval may contain k pi)."""
    a, b = lo(phi_lo), phi_hi.upper()
    k1 = (a / arb.pi()).upper().ceil(); k2 = (b / arb.pi()).lower().floor()
    if not (k1 > k2): return arb(0)
    m = max(abs(a.cos()).upper(), abs(b.cos()).upper())
    v = lo(1 - m)
    return v if v > 0 else arb(0)


def ar(q) -> arb:
    q = F(q); return arb(q.numerator) / q.denominator


# --------------------------------------------------------------------------------------------- B: base joint floor
def base_value(rec6, h, tL, tR, N0, r) -> F:
    v0 = arb(N0).log(); a = ar(h) * ar(r)
    logs = {n: arb(n).log() for n in range(2, 1025)}
    c = {n: lo(cg_cover(math.gcd(n, 30), arb(n), ar(tL))) for n in range(2, 1025) if n not in (2, 3, 5)}
    amp, rho = {}, {}
    for j in range(5):
        Lp = 2 * (v0 + ar(ENDS[j + 1])); sig = (1 + ar(h)) / 2 + ar(tR) * Lp / 4; den = 2 * (1 + ar(rec6[j]['Aupper'])) ** 2
        amp[j] = {n: lo(c[n] * (-sig * logs[n]).exp() / den) for n in c}
        rho[j] = {p: lo((-(1 + ar(h)) / 2 * LP[p] + ar(tR) / 4 * LP[p] * (LP[p] - Lp)).exp()) for p in (2, 3, 5)}
    an = {n: att(a * logs[n] / 2, a * logs[n] / 2) for n in c}
    ae = {(p, k): att(k * a * LP[p] / 2, k * a * LP[p] / 2) for p in (2, 3, 5) for k in range(1, 9)}
    vals = []
    for (j, k) in PAIRS:
        base = (F(rec6[j]['floor']) + F(rec6[k]['floor'])) / 2
        tot = arb(0)
        if k < 5:
            Clo = min(F(rec6[j]['C']), F(rec6[k]['C'])); Chi = max(F(rec6[j]['C']), F(rec6[k]['C']))
            for n in c:
                gap = max(arb(0), lo(logs[n] - 2 * ar(Chi)), lo(2 * ar(Clo) - logs[n]))
                if gap > 0 and an[n] > 0:
                    tot += min(amp[j][n], amp[k][n]) * gap * an[n]
            for p in (2, 3, 5):
                for kk in range(1, 9):
                    tot += LP[p] / 2 * min(lo(rho[j][p] ** kk), lo(rho[k][p] ** kk)) * ae[(p, kk)]
        q = lo(tot).fmpq()
        vals.append(base + F(int(q.numerator), int(q.denominator)))
    return min(vals)


def check_base(quick: bool) -> None:
    global LP
    ctx.prec = 192
    LP = {p: arb(p).log() for p in (2, 3, 5)}
    cells = [0, 300, 607] if quick else [0, 1, 50, 150, 300, 450, 600, 607]
    worst = F(0); count = 0
    for tag in ('X1_P100MH', 'X160_P100MH', 'X160_P0_97MH', 'X160_P0_94MH', 'X165_P100MH'):
        _, plan, pdir = TABLES[tag]
        s = json.load(open(ARCH / tag / 'SUMMARY.json')); X, N0 = s['X'], s['N0']
        rows = json.load(open(TMP / plan))['rows']; byi = {r['time_index']: r for r in rows}
        docA = json.load(open(Path(pdir) / 'PROBE_192.json')); docB = json.load(open(Path(pdir) / 'PROBE_256.json'))
        recs = BL.records(docA, docB, rows, X, N0)
        tb = json.load(open(ARCH / tag / 'TABLES_BASE.json'))
        use = [i for i in cells if str(i) in tb and i in recs] or sorted(int(i) for i in tb)[:: max(1, len(tb) // 6)][:6]
        for i in use:
            row = byi[i]
            for r in EXTRA + [F(3, 5)]:
                m = 'r_' + str(r).replace('/', '_')
                mine = base_value(recs[i], row['height'], row['t_lo'], row['t_hi'], N0, r)
                stored = F(tb[str(i)][m]['both'])
                d = mine - stored
                ok = F(-1, 10**18) < d < F(5, 10**12)
                check(ok, f'B {tag} cell {i} r={r}: independent {float(mine):.13f} vs stored {float(stored):.13f} (diff {float(d):.2e})', quiet=True)
                worst = max(worst, abs(d)); count += 1
    check(True, f'B base joint floor (cone + Euler, min over 11 pair classes) recomputed at {count} (table, cell, r) entries; '
          f'max |independent - stored| = {float(worst):.2e} (stored values are floored to the 1e-12 grid)')


# ------------------------------------------------------------------------------------------ C: Track A head-bin gain H
def check_head_gain(quick: bool) -> None:
    ctx.prec = 128
    cells = [1, 300] if quick else [0, 1, 150, 300, 450, 607]
    worst_rel = 0.0; count = 0; nbins = {}
    for tag in ('X1_P100MH', 'X160_P100MH'):
        _, plan, pdir = TABLES[tag]
        s = json.load(open(ARCH / tag / 'SUMMARY.json')); X, N0 = s['X'], s['N0']
        rows = json.load(open(TMP / plan))['rows']; byi = {r['time_index']: r for r in rows}
        docA = json.load(open(Path(pdir) / 'PROBE_192.json')); docB = json.load(open(Path(pdir) / 'PROBE_256.json'))
        recs = BL.records(docA, docB, rows, X, N0)
        gains = json.load(open(ARCH / tag / 'GAINS.json'))
        HB = BL.GainCtx.bins(1025, N0); nbins[tag] = len(HB)
        cnt = []
        for n1, n2 in HB:
            cc = {g: 0 for g in (1, 2, 3, 5, 6, 10, 15, 30)}
            for n in range(n1, n2 + 1): cc[math.gcd(n, 30)] += 1
            cnt.append(cc)
        v0 = arb(N0).log()
        for i in cells:
            row = byi[i]; h, tL, tR = ar(row['height']), ar(row['t_lo']), ar(row['t_hi']); rec6 = recs[i]
            mass = []
            for (n1, n2), cc in zip(HB, cnt):
                mass.append(sum((cc[g] * lo(cg_cover(g, arb(n1), tL)) for g in cc if cc[g]), arb(0)))
            amp = {}
            for j in range(5):
                Lp = 2 * (v0 + ar(ENDS[j + 1])); sig = (1 + h) / 2 + tR * Lp / 4; den = 2 * (1 + ar(rec6[j]['Aupper'])) ** 2
                amp[j] = [lo(M * (-sig * arb(n2).log()).exp() / den) for M, (n1, n2) in zip(mass, HB)]
            for r in EXTRA:
                m = 'r_' + str(r).replace('/', '_'); a = h * ar(r)
                th = [att(a * arb(n1).log() / 2, a * arb(n2).log() / 2) for n1, n2 in HB]
                for pi_, (j1, j2) in enumerate(PAIRS):
                    stored = F(gains[str(i)][m][pi_][0])
                    if j2 == 5:
                        check(stored == 0, f'C {tag} cell {i} r={r} pair {(j1, j2)}: H = 0 on the infinite rectangle', quiet=True); continue
                    Cmax = max(F(rec6[j1]['C']), F(rec6[j2]['C']))
                    tot = arb(0)
                    for kb, (n1, n2) in enumerate(HB):
                        gap = lo(arb(n1).log() - 2 * ar(Cmax))
                        if not gap > 0: FAIL.append('head gap'); continue
                        tot += min(amp[j1][kb], amp[j2][kb]) * gap * th[kb]
                    mine = lo(tot)
                    qq = mine.fmpq(); mineF = F(int(qq.numerator), int(qq.denominator))
                    rel = float((mineF - stored) / stored) if stored > 0 else float(mineF)
                    ok = stored <= mineF * (1 + F(1, 10**20)) + F(1, 10**30) and rel < 1e-9
                    check(ok, f'C {tag} cell {i} r={r} pair {(j1, j2)}: H independent {float(mineF):.12e} stored {float(stored):.12e}', quiet=True)
                    worst_rel = max(worst_rel, abs(rel)); count += 1
    check(True, f'C Track A head-bin gain H (labels 1025..N0, bins {nbins}, bin bounds C_g(n1, t_L) by Lemma CG) recomputed at '
          f'{count} (table, cell, r, pair) entries; max relative difference {worst_rel:.2e}; stored <= independent in every case')


# --------------------------------------------------------------------------------------------- D: randomized algebra
def check_algebra(trials: int = 4000) -> None:
    """three inequalities, separately: (i) Lemma 2 identity; (ii) H_C/(2|Q|^2) >= selected constant-pair surplus over
    2(1 + A_+)^2 (needs the cone first line >= 0, which the synthetic data are built to satisfy); (iii) Lemma 3 per label
    with phases evaluated at x -+ a. Some trials put Re z^c = +-1 (equality cases of Lemma 3)."""
    rng = random.Random(20261003)
    m2 = m3 = math.inf; n_tested = 0
    for trial in range(trials):
        C = 1 + 2.3 * rng.random(); a = 1.99 * rng.random(); t = 0.15 * rng.random()
        labs = []
        for n in rng.sample(range(2, 600), 25):
            labs.append((math.log(n), rng.random() * 0.004, rng.choice((0.0, math.pi))))
        for _ in range(10):
            labs.append((2 * C + 3 * rng.random(), rng.random() * 0.002, rng.choice((0.0, math.pi))))
        if trial % 4 == 0:      # x chosen so that x * lam_0 / 2 + off_0 = 0 mod 2 pi for the first label (Re z^c = +-1)
            x = (2 * math.pi * rng.randint(10**4, 10**5) - labs[0][2]) / (labs[0][0] / 2)
        else:
            x = 1e6 * rng.random()

        def model(xx):
            L = math.log(xx / (4 * math.pi) + 10)
            Q = 1 + 0j; V = 0j; A = 0.0; B = 0.0; amps = []
            for lam, c0, off in labs:
                amp = c0 * math.exp(-t * L * lam / 4); z = cmath.exp(1j * (xx * lam / 2 + off))
                Q += amp * z; V += lam * amp * z; A += amp; B += lam * amp; amps.append((amp, z))
            return Q, V, A, B, amps
        sides = [model(x + a), model(x - a)]
        Aup = max(sides[0][2], sides[1][2])
        sel = []
        for Q, V, A, B, amps in sides:
            HC = C * abs(Q) ** 2 - (V * Q.conjugate()).real
            al = [(1.0, 0.0, 1 + 0j)] + [(amp, lab[0], z) for (amp, z), lab in zip(amps, labs)]
            first = (1 + A) * (C * (1 + A) - B); DC = 0.0; surplus = 0.0
            for p in range(len(al)):
                for q in range(p + 1, len(al)):
                    w = al[p][0] * al[q][0] * (al[p][1] + al[q][1] - 2 * C)
                    re = (al[p][2] * al[q][2].conjugate()).real
                    if w >= 0: surplus += w * (1 - re)
                    else: DC += 2 * abs(w); surplus += abs(w) * (1 + re)
            check(abs(HC - (first - DC + surplus)) <= 1e-9 * (1 + abs(HC)), 'D Lemma 2 identity', quiet=True)
            check(first - DC > 0, 'D synthetic cone first line positive', quiet=True)
            s_sel = 0.0
            for (amp, z), (lam, _c, _o) in zip(amps, labs):
                w = amp * (lam - 2 * C); eps = 1 if w >= 0 else -1
                s_sel += abs(w) * (1 - eps * z.real) / (2 * (1 + Aup) ** 2)
            m2 = min(m2, HC / (2 * abs(Q) ** 2) - s_sel)
            sel.append([(abs(amp * (lam - 2 * C)) / (2 * (1 + Aup) ** 2), 1 if lam >= 2 * C else -1, z)
                        for (amp, z), (lam, _c, _o) in zip(amps, labs)])
        for k, (lam, _c, _o) in enumerate(labs):
            (cp, ep, zp), (cm, em, zm) = sel[0][k], sel[1][k]
            check(ep == em, 'D same sign at both points (single C)', quiet=True)
            lhs = (cp * (1 - ep * zp.real) + cm * (1 - em * zm.real)) / 2
            rhs = min(cp, cm) * (1 - abs(math.cos(a * lam / 2)))
            m3 = min(m3, lhs - rhs)
        n_tested += 1
    check(m2 >= -1e-12, f'D (3): H_C/(2|Q|^2) - selected surplus/(2(1+A_+)^2) >= 0 in {n_tested} trials (min {m2:.3e})')
    check(m3 >= -1e-12, f'D Lemma 3 per label with phases at x -+ a: min(average - c_0 (1 - |cos(a lambda/2)|)) = {m3:.3e} >= 0 '
          f'({n_tested * 35} label pairs; a quarter of the trials at Re z^c = +-1 for one label)')


def main() -> int:
    quick = '--quick' in sys.argv
    t0 = time.time()
    print('== A: domain conditions on every table used', flush=True)
    check_domain()
    print(f'== B: base joint floor at out-of-catalogue ratios ({time.time() - t0:.0f} s)', flush=True)
    check_base(quick)
    print(f'== C: Track A head-bin gain at out-of-catalogue ratios ({time.time() - t0:.0f} s)', flush=True)
    check_head_gain(quick)
    print(f'== D: randomized algebra ({time.time() - t0:.0f} s)', flush=True)
    check_algebra()
    print(f'total {time.time() - t0:.0f} s; failures: {len(FAIL)}')
    print('RESULT', 'PASS' if not FAIL else 'FAIL')
    return 0 if not FAIL else 1


if __name__ == '__main__':
    sys.exit(main())
