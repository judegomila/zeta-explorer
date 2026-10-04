#!/usr/bin/env python3
"""Fail-closed checks for formalization/paper/native-binding-general-weights.md.

Three jobs:
  A. exact-integer checks of hypotheses (H1)-(H3) and producer conditions
     (C1)-(C6) on the actual 287-entry mollifier file used by the finite lane
     (legs A1/A2) of the Lambda <= 0.1758354 candidate;
  B. a structural contract on the producer src/lemma_sweep_genmoll.c
     (the source lines the proof's correspondence table cites);
  C. an mpmath (80-digit) falsification stress test of the two convolution
     identities and of |f| >= L_N with the ACTUAL weights, complex phases,
     complex kappa and the frozen (sawtooth) Triangle weight; plus a
     necessity example showing the producer formula fails when lambda_1 = 1/2.

Section C is a weak consistency test (large sigma, g_ref > g_bound by construction; it does not run
the producer), not a replacement for the algebraic proof. The producer-versus-independent comparison is
in native-binding-refcheck/ (referee, 2026-09-28; note section 5D).
Exit code 0 iff every check passes.
"""
from __future__ import annotations

import hashlib
import os
import random
import re
import sys
from fractions import Fraction
from pathlib import Path

import mpmath as mp

PKG = Path(os.environ.get("PKG", str(Path.home() / "dbn-lambda-01758354-candidate")))
REPO = Path(__file__).resolve().parents[2]
MOLL = PKG / "src" / "mollifier_p17_t0_15830.txt"
MOLL_TMP = REPO / "tmp" / "moll_0.15830.txt"
PRODUCER = PKG / "src" / "lemma_sweep_genmoll.c"
MOLL_SHA = "a05f16ef483c9bc4c04871582a93a10c8c232622ad5558e32378d1401eec8a5c"
PROD_SHA = "561d59bfd66130fdc0f6897af013e94ef751e185789d22c566478c6815e44677"
MAXD = 600
N_END_GENMOLL = 1300000  # last window of leg A2 (legs A1/A2 use mtype 7)

checks = 0
failures = 0


def check(name: str, ok: bool, detail: str = "") -> None:
    global checks, failures
    checks += 1
    failures += 0 if ok else 1
    print(f"[{'PASS' if ok else 'FAIL'}] {name}" + (f"  {detail}" if detail else ""))


def sha256(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


# ---------------------------------------------------------------- A: file
print("--- A: exact checks on the mollifier file")
raw = MOLL.read_bytes()
check("A0 mollifier sha256 = a05f16ef...8a5c", sha256(MOLL) == MOLL_SHA)
# fail-closed: a missing tmp copy is a FAIL, not a silent skip (referee minor item)
check("A0' tmp/moll_0.15830.txt (ydini default path) exists and is byte-identical",
      MOLL_TMP.exists() and sha256(MOLL_TMP) == MOLL_SHA)

# split on b'\n' only, as C fgets does (str.splitlines also breaks on \r, \v, \f, \x1c-\x1e)
lines = [ln.decode("ascii") for ln in raw.split(b"\n")]
lines = [ln + "\n" for ln in lines[:-1]] + ([lines[-1]] if lines[-1] else [])
strict = re.compile(r"^[ \t]*([+-]?\d+)[ \t]+([+-]?\d+)[ \t]+([+-]?\d+)[ \t]*\r?\n?$")
entries: list[tuple[int, int, int]] = []
unparsed = []
for i, ln in enumerate(lines):
    # the C loader (lemma_sweep_genmoll.c mtype 7) skips lines starting with
    # '#', '\n', '\r' and silently skips any line sscanf cannot read as 3 ints.
    if ln[:1] in ("#", "\n", "\r"):
        continue
    m = strict.match(ln)
    if not m:
        unparsed.append(i + 1)
        continue
    entries.append(tuple(int(g) for g in m.groups()))
check("C5 every non-comment line parses strictly as 'd num den' (no silent skip)", not unparsed, f"unparsed lines {unparsed[:5]}")
check("C5 max line length < 255 (fgets buffer 256 never splits a line)", max(len(l) for l in lines) < 255, f"max {max(len(l) for l in lines)}")
nd = len(entries)
check("C4 entry count 287 <= MAXD 600 (matches logged 'MOLL general nd=287')", nd == 287 and nd <= MAXD, f"nd={nd}")
ds = [e[0] for e in entries]
check("H2/C4 all d are integers >= 1", all(d >= 1 for d in ds))
check("C2/C3 d strictly ascending (distinct; last entry = max d)", all(ds[i] < ds[i + 1] for i in range(nd - 1)))
check("C2 last entry D = 1000 (matches logged 'D=1000')", ds[-1] == 1000 == max(ds))
check("H3/C1 first entry is d = 1 with num = den (lambda_1 = 1 exactly)", entries[0][0] == 1 and entries[0][1] == entries[0][2] and entries[0][2] != 0)
check("C4 all den > 0", all(e[2] > 0 for e in entries))
check("C4 |num|, den < 2^63 (slong / long long, no overflow)", all(abs(e[1]) < 2**63 and e[2] < 2**63 for e in entries))
check("C4 D * N_end = 1000 * 1300000 < 2^64 (ulong n = dd*Np, D*N)", ds[-1] * N_END_GENMOLL < 2**64)
lam = {d: Fraction(num, den) for d, num, den in entries}
check("H1 weights are exact rationals (hence real; H1 is convenience only, not needed by the lemma)", all(isinstance(v, Fraction) for v in lam.values()))
def is17smooth(n: int) -> bool:
    for p in (2, 3, 5, 7, 11, 13, 17):
        while n % p == 0:
            n //= p
    return n == 1
check("info: support is 17-smooth (not used by the proof)", all(is17smooth(d) for d in ds))
l1 = sum(abs(v) for v in lam.values())
print(f"  info: sum |lambda_d| = {l1} = {float(l1):.9f} (exact); M_N >= lambda_1 = 1 for every sigma")
check("H3 consequence: M_N >= 1 > 0 (the d = 1 term alone contributes 1)", lam[1] == 1)

# ------------------------------------------------------------- B: producer
print("--- B: structural contract on lemma_sweep_genmoll.c")
src = PRODUCER.read_text(encoding="utf-8")
check("B0 producer sha256 = 561d59bf...4677 (package SHA256SUMS)", sha256(PRODUCER) == PROD_SHA)


def order(name: str, frags: tuple[str, ...]) -> None:
    pos = -1
    for f in frags:
        nxt = src.find(f, pos + 1)
        if nxt < 0:
            check(name, False, f"missing {f!r}")
            return
        pos = nxt
    check(name, True)


order("B1 mtype 7 loader overwrites from index 0: dvec[nd]=d, moll=num/den, lnd=log d",
      ("else if(mtype==7){", "int nd = 0;", "ms.dvec[nd] = (ulong)dd;",
       "arb_div(ms.moll[nd], num_a, den_a, prec);", "arb_log(ms.lnd[nd], dln, prec);", "ms.nd = nd;"))
order("B2 bA0 forms B and A0 with the SAME real moll_d (conjugate identity)",
      ("static ulong bA0", "if(n % d == 0 && n <= d*Ncut){", "arb_addmul(b, bb, ms->moll[i], prec);",
       "arb_mul(bb, bb, e, prec);", "arb_addmul(a0, bb, ms->moll[i], prec);"))
order("B3 TRIANGLE weight |b| + gamma(Nref)|a0|, Nref = max(n/dmin, Nstart)",
      ("ulong Nref = n/dmin; if(Nref < Nstart) Nref = Nstart;", "#ifdef TRIANGLE_WEIGHT",
       "arb_abs(t1, b);", "arb_abs(t2, a0);", "arb_mul(t2, t2, ga, prec);", "arb_add(W, t1, t2, prec);"))
check("B4 D := last table entry (needs C2)", "ulong D = ms.dvec[ms.nd-1];" in src)
check("B5 n > N activity filter starts at index 1 (needs C1: dvec[0] = 1)",
      src.count("for(int i=1;i<ms.nd;i++){ ulong dd=ms.dvec[i]; if(n%dd==0 && n<=dd*N){ any=1; break; } }") == 3)
order("B6 activation step adds W(dN;N)-W(dN;N-1) once per table entry (needs C3: distinct d)",
      ("for(int i=0;i<ms.nd;i++){", "ulong dd = ms.dvec[i]; ulong n = dd*Np;",
       "Wcompute(Wold, n, Np-1,", "Wcompute(W,    n, Np,", "arb_sub(W, W, Wold, prec);"))
order("B7 Taylor remainder uses L = ln(D*N) (needs C2)", ("arb_set_ui(L, D*N); arb_log(L, L, prec);",))
order("B8 modmoll = sum_i |moll_i| d_i^{-sigma}",
      ("arb_zero(modmoll);", "arb_abs(tmp, ms.moll[i]);", "arb_mul(tmp2, ms.lnd[i], sigma, prec);",
       "arb_neg(tmp2, tmp2);", "arb_exp(tmp2, tmp2, prec);", "arb_addmul(modmoll, tmp, tmp2, prec);"))
order("B9 lbound = (1 - g - Ssum)/modmoll - corr (the '1' is B_{N,1}; needs H3)",
      ("arb_set_ui(lbound, 1);", "arb_sub(lbound, lbound, modgamma, prec);", "arb_sub(lbound, lbound, Ssum, prec);",
       "arb_div(lbound, lbound, modmoll, prec);", "arb_sub(lbound, lbound, corr, prec);"))
check("B10 the mtype<=6 dvec override is the identity for mtype 7",
      "for(int i=0;i<4;i++) ms.dvec[i] = (mtype==3)? DVEC3[i] : ms.dvec[i];" in src)
check("B11 Ssum summation runs over n >= 2 only (n = 1 carried by the literal 1)",
      src.count("for(ulong n=2; n<=D*N; n++){") == 3)

# ------------------------------------------------------- C: stress test
print("--- C: 80-digit stress test with the actual 287 weights")
mp.mp.dps = 80
t = mp.mpf(15830) / 100000
y = mp.sqrt(mp.mpf(350708) / 10**7)
lamv = [(d, mp.mpf(v.numerator) / v.denominator) for d, v in lam.items()]


def bt(m):
    return mp.exp(t / 4 * mp.log(m) ** 2)


random.seed(1758354)
worst_id = mp.mpf(0)
min_slack = None
cases = 0
for N in (2, 3, 5, 8):
    bm = {m: bt(m) for m in range(1, N + 1)}
    Bc: dict[int, mp.mpf] = {}
    Ac: dict[int, mp.mpf] = {}
    dmin: dict[int, int] = {}
    for d, l in lamv:
        for m in range(1, N + 1):
            n = d * m
            Bc[n] = Bc.get(n, mp.mpf(0)) + l * bm[m]
            Ac[n] = Ac.get(n, mp.mpf(0)) + l * bm[m] * mp.mpf(m) ** y
            dmin[n] = min(dmin.get(n, d), d)
    check(f"C-N{N} n = 1 coefficients B_1 = A_1 = 1", Bc[1] == 1 and Ac[1] == 1)
    for sigma in (mp.mpf(5), mp.mpf(7)):
        g_bound, k_bound = mp.mpf("0.04"), mp.mpf("0.01")
        g_ref = mp.mpf("0.05")  # frozen weight uses gamma(Nref) >= gamma(N)
        M = sum(abs(l) * mp.mpf(d) ** (-sigma) for d, l in lamv)
        S_tri = sum((abs(Bc[n]) + g_bound * abs(Ac[n])) * mp.mpf(n) ** (-sigma) for n in Bc if n >= 2)
        S_saw = sum((abs(Bc[n]) + g_ref * abs(Ac[n])) * mp.mpf(n) ** (-sigma) for n in Bc if n >= 2)
        CN = sum(bm[m] * (mp.mpf(m) ** k_bound - 1) * mp.mpf(m) ** (y - sigma) for m in range(2, N + 1))
        Q = 1 - g_bound - S_tri
        L = Q / M - g_bound * CN
        Lsaw = (1 - g_bound - S_saw) / M - g_bound * CN
        if not (Q > 0 and L > 0):
            check(f"C-N{N}-sigma{sigma} parameters give Q > 0, L > 0", False, f"Q={mp.nstr(Q,6)} L={mp.nstr(L,6)}")
            continue
        ok_all = True
        for trial in range(12):
            s = mp.mpc(sigma + mp.mpf(random.uniform(0, 0.3)), mp.mpf(random.uniform(-1e6, 1e6)))
            gam = g_bound * mp.mpf(random.uniform(0, 1)) * mp.expjpi(mp.mpf(random.uniform(-1, 1)))
            kap = k_bound * mp.mpf(random.uniform(0, 1)) * mp.expjpi(mp.mpf(random.uniform(-1, 1)))
            sc = mp.conj(s)
            E = sum(l * mp.mpf(d) ** (-s) for d, l in lamv)
            Aser = sum(bm[m] * mp.mpf(m) ** (-s) for m in range(1, N + 1))
            C0 = sum(mp.mpf(m) ** y * bm[m] * mp.mpf(m) ** (-sc) for m in range(1, N + 1))
            Ck = sum(mp.mpf(m) ** y * bm[m] * mp.mpf(m) ** (-sc - kap) for m in range(1, N + 1))
            f = Aser + gam * Ck
            P = sum(Bc[n] * mp.mpf(n) ** (-s) for n in Bc)
            Qc = sum(Ac[n] * mp.mpf(n) ** (-sc) for n in Ac)
            e1 = abs(E * Aser - P)
            e2 = abs(mp.conj(E) * C0 - Qc)
            worst_id = max(worst_id, e1, e2)
            slack = abs(f) - L
            min_slack = slack if min_slack is None else min(min_slack, slack)
            ok_all &= (slack >= 0) and (Lsaw <= L) and abs(E) <= M
            cases += 1
        check(f"C-N{N}-sigma{int(sigma)} |f| >= L_N >= L_saw and |E| <= M_N on 12 random (s, gamma, kappa)", ok_all,
              f"L={mp.nstr(L, 8)}")
check("C identities E*A = sum B n^-s and conj(E)*C0 = sum A n^-conj(s) hold to 1e-60", worst_id < mp.mpf(10) ** -60,
      f"worst {mp.nstr(worst_id, 3)}")
print(f"  info: {cases} cases, min(|f| - L_N) = {mp.nstr(min_slack, 6)}")

# necessity of H3: lambda_1 = 1/2 alone, N = 1: f = 1 + gamma, producer L = (1-g)/(1/2)
g = mp.mpf("0.2")
Lbad = (1 - g) / mp.mpf("0.5")
fmax = 1 + g
check("C-nec with lambda_1 = 1/2 the producer formula overstates |f| (so H3 is needed)", Lbad > fmax,
      f"L_prod={mp.nstr(Lbad, 4)} > max|f|={mp.nstr(fmax, 4)}")

print(f"--- {checks - failures}/{checks} checks passed")
sys.exit(0 if failures == 0 else 1)
