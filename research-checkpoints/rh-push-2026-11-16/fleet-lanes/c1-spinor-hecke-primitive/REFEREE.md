# REFEREE: c1-spinor-hecke-primitive (lens: general)

Date: 2026-11-17. Target: `RESULT.md`, claimed verdict precise-obstruction, flags R1-R4 all false.
Referee verdict: **holds = false as written** (one PROVED sub-step is false on the stated domain, one
citation does not cover the stated domain). The negative conclusion (no lower bound; the primitive
restriction gains nothing; all four flags false) **survives in a corrected form**, stated in section 5.
Nothing here is a statement about zeros of zeta. Labels: CONFIRMED, ERROR, GAP, MEASURED (float64).

## 1. Re-derivation of the PROVED steps

**Lemma 1. CONFIRMED, with a labelling error in the measured part.**
- (a) `sum_{n in N_S} n^-1/2 = prod_S (1 - p^-1/2)^-1 < inf`, so `Z_S` converges in norm and inverts `M_S`
  on `L^2(0,inf)`. (b) Norms are the H^inf norms of `m_S`, `1/m_S`; values correct. (c), (d) correct.
- ERROR (labels, not mathematics). `kron.py` tabulates `|m_P(i tau)|^2`, the symbol of `M_S`, not the Gram
  symbol `|zeta_S(1/2+i tau)|^2 = 1/|m_P|^2`. The quoted "sup 15709 / 28.83" and "mean 5.06 / 2.74" are
  `prod (1+p^-1/2)^2` and `prod (1+1/p)`. The Gram symbol of Lemma 1(c) has sup `prod (1-p^-1/2)^-2`
  = 551.9 (P = 7), 1.085e6 (P = 100), attained at `tau = 0` (no Kronecker needed there), and mean
  `prod (1-1/p)^-1` = 4.375, 8.311. Referee run (`ref_check.py symbol`, section 6): on the window
  `[1000, 3000]` the Gram symbol has max 501.6 and mean 4.370 (P = 7); max 517.9 and mean 7.29 (P = 100).
  So for P = 100 the sup away from 0 is approached only at heights far beyond any window computed; the
  statement "the sup is the full product" is true as a sup over all heights (almost periodicity), not as
  a statement about a given window. The qualitative reading (mean ~ log P, sup = divergent product) stands.

**Lemma 2. CONFIRMED.**
- (a) Multiplier of `U_p` is `p^{-1/2-z}`; `m_S` vanishes only on `Re z = -1/2`; weights on an off-line
  pair are conjugate and nonzero.
- (b) With `x = p^-1/2 e^{-i tau log p}`: ladder symbol `-2 log p Re(x/(1-x))`, times `|1-x|^2` gives
  `-2 log p Re x + 2 log p / p`. Formula and the bound (c) follow.
  MEASURED (`ref_check.py lemma2b`, zeta, S = {2,3}, T = 6, centre 30, N = 40, a case not in the result):
  left side (Moebius table on the full kernel) against right side (kernel with 2- and 3-ladders deleted
  plus the two brackets): max difference 3.3e-14 on scale 38.8.

**Lemma 3. (a) is FALSE on the stated domain; (c) is true but needs a different proof; the P10 citation
does not cover the domain.**
- ERROR. The domain is stated as compactly supported tests. `M_S` preserves compact support; its inverse
  `Z_S = sum_{n in N_S} U_n` does not. If `v` has compact support and `w = M_S v`, then `W = m_S V` is
  entire and vanishes at every zero of `m_S` (`z = -1/2 + 2 pi i k / log p`): infinitely many linear
  conditions. So `M_S(domain)` is a proper subspace of infinite codimension, not "the whole domain", and
  `Q o M_S` is not congruent to `Q` on that domain. Sylvester's law as invoked in (b) gives only the
  trivial statement (index of `Q` on `M_S(E)` = index of the pulled-back form on `E`).
- REPAIR (referee; proves (c) for smooth compactly supported tests). Let
  `v_N = M_S sum_{n in N_S, n <= N} U_n v`, which is in `M_S(domain)`. Its transform is `(1 - t_N) V` with
  `t_N(z) = m_S(z) sum_{n in N_S, n > N} n^{-1/2-z}` for `Re z > -1/2`. On `Re z = 0`,
  `|t_N| <= ||M_S|| sum_{n > N} n^-1/2 -> 0`, so `v_N -> v` in `L^2`. On the zero side split at
  `|gamma| <= G = exp(sqrt(log N))`: by the classical zero-free region those zeros have
  `|Re rho| <= 1/2 - c / sqrt(log N)`, where `sum_{n in N_S, n > N} n^{-c/sqrt(log N)} -> 0`
  (the counting function of `N_S` is a power of `log`); for `|gamma| > G` use
  `|1 - t_N| <= 2^|S| #{n in N_S, n <= N}` (polylog in N) against the decay `G^-A` of `V`. Hence
  `Q(v_N) -> Q(v)`. Together with `M_S(domain) subset domain` this gives
  `inf Q(w)/||w||^2` over jointly S-primitive `w` = the same infimum over all smooth compactly supported
  tests. The same argument works for any control whose zeros lie in `|Re z| < 1/2` with a zero-free
  region of this type, or in a fixed closed sub-strip (E_a with a = 0.2, T-NR, DH after checking the DH
  zero-free region, which the result does not do).
- GAP. "By P10 the value is 0 or -inf": P10 (`cc-latest` Theorem B) is proved for finite exponential sums
  on accumulating node families, a class not preserved by `U_p` and not contained in the stated domain.
  The 0-or-minus-infinity dichotomy on compactly supported tests is not proved in the result or in the
  cited source. What is established is "bound on primitive tests iff bound on all tests of the same
  class, same constant"; that this is "P10 itself" is not established as written.

**Lemma 4. CONFIRMED as a computation; the reading is inconsistent with section 0 item 1.**
- `zeta(1/2+z) W(z)` is entire when `W(1/2) = 0`, lies in `H^2(Re z > 0)`, vanishes at every `rho` and
  `J rho`; the zero sum with `Zw` in either slot is 0. This is the known radical statement (P12); it is
  not new and the result does not present it as new.
- ERROR (interpretation). For finite S the result evaluates `Q` on the primitive component `w = M_S v`.
  For all primes it evaluates `Q` on the reconstructed test `v = Zw`. These are different objects. With
  the finite-S convention the all-prime primitive class is `{w : Zw in L^2}`, which contains every smooth
  `w` with `W(1/2) = 0`; on it `Q` is not identically zero and the question is again the full bound.
  Item 3 is therefore not "the degenerate limit of the decomposition" of item 1; it is the statement
  that the tests which admit an all-prime decomposition are radical. Either reading gives no bound.
- Domain: `Zw` is not compactly supported, so `Q(Zw)` is defined only through the zero sum; the result
  says so in its weakest steps.

**Lemma 5. CONFIRMED for the two displayed `y_z` formulas** (change of variable `r -> r + 2 log d`,
linearity). The operator identities are correct only if "`Gamma_- U`" is read as the Hankel block
`Q_c (S U) P_c` of the product symbol: `Q U S P = (Q U Q) Gamma_-` when `Q U P = 0`, and
`Q S U P = Gamma_- (P U P) + (Q S Q)(Q U P)` in general. As a composition `Gamma_- o U` on the whole space
the first identity needs `P U Q = 0` as well. Notation should be fixed; nothing downstream uses it.

## 2. Numeric reruns (local, `scripts/memcap.sh 8`, float64, script in section 6)

All cases differ from the result's cells (other T, other centre, other S).

| function | T | centre | S | N = 12 / 25 / 50 / 100: full min [neg] ; primitive min [neg] |
|---|---|---|---|---|
| zeta | 7.5 | 40 | {2,3,5} | -3e-16 / -5e-14 / -8e-14 / -2e-13 [0] ; 1e-14 / -2e-13 / -4e-13 / -6e-12 [0] |
| zeta | 5 | 200 | {2,3,5,7,11} | 1e-4 / 2e-10 / -1e-13 / -9e-13 [0] ; 1e-3 / 3e-9 / -6e-13 / -1e-11 [0] |
| DH | 7.5 | 114.16 | {2,3,5} | -1.29 [1] / -1.34 [1] / -1.39 [2] / -8.15 [2] ; -0.69 [1] / -0.73 [1] / -0.77 [1] / -0.81 [2] |
| DH | 5 | 85.7 | {2,3,5,7,11} | -1.57 [1] / -1.76 [1] / -1.81 [2] / -1.84 [2] ; -0.23 [1] / -0.30 [1] / -0.34 [2] / -0.38 [2] |
| DH | 7.5 | 40 | {2,3,5} | 5e-9 / -3e-14 / -5e-14 / -6e-10 [0] ; 6e-9 / -7e-14 / -2e-13 / -7e-11 [0] |
| TW (Liouville) | 7.5 | 40 | {2,3,5} | -5.67 [3] / -5.72 [7] / -5.75 [13] / -67.1 [33] ; -7.31 [3] / -7.40 [7] / -7.48 [13] / -10.0 [33] |
| random signs on prime powers | 7.5 | 40 | {2,3,5} | -4.17 [3] / -4.51 [7] / -7.68 [16] / -35.6 [37] ; -3.36 [4] / -3.75 [9] / -8.03 [17] / -8.51 [38] |
| E_a (a = 0.2) | 7.5 | 40 | {2,3,5} | -3.09 [3] / -3.98 [8] / -4.48 [15] / -5.19 [22] ; -6.26 [4] / -7.42 [9] / -9.11 [15] / -10.2 [22] |
| T-NR | 7.5 | 40 | {2,3,5} | -7.99 [2] / -9.50 [3] / -9.84 [6] / -9.88 [12] ; -15.7 [3] / -16.7 [3] / -19.4 [7] / -23.4 [12] |

Findings.
1. The result's pattern reproduces: zeta 0 to rounding on full and primitive spans; every control with
   off-line zeros or poles in the band is negative on both. Passing to primitive spans never changes the
   sign. A five-prime S (243 shifts) for DH, not in the result, gives the same.
2. New, and it qualifies the phrase "decisive test": DH centred at 40 (band about [-2, 82], below its
   first off-line zero at 85.70) has minimum eigenvalue 0 to rounding (|min| <= 6e-10), negative index 0,
   on full and primitive spans up to N = 100. On such spans DH is not separated from zeta. The separation
   reported in the result is produced by centring the band on the known off-line zero. This is consistent
   with the result's own reading (controls fail at the location of zeros) and with verified-height
   blindness; it means the zeta rows carry no information beyond "no off-line zero in the band".
3. DH at centre 114.16, N = 50: negative index 2 on the full span and 1 on the primitive span. The
   equality of indices in the result's twelve DH cells is not a general finite-span fact (the result
   says this in a parenthesis; this is a concrete instance).
4. Not rerun: zero-side tables (25 primes). Their zeta rows are positive by construction, as the result
   states. DH and TW at 25 primes remain not run. Backward heat, Beurling, unimodular twist, phase-rotated
   transfer operator, theta^w remain not run. I added one control outside the list (non-multiplicative
   random signs); it behaves as TW.
5. Kernel constants checked by hand for zeta (`2 cosh(u/2)`, `e^{-u/2}/(1-e^{-2u})`, `-log pi`), DH
   (`b = 3/4`, `log(5/pi)`, no pole term, coefficients 1, kappa, -kappa, -1, 0 mod 5), T-NR (ladder
   `(-1)^k (r^k + r^-k) log 2`, `2 log 2` at 0). Table entries spot-checked against the JSON files
   (DH T = 9, T-NR zero side P = 100): they match.

## 3. Checks requested by the assignment

- Assumes RH anywhere: no. The OPEN remark in Lemma 4 is conditional and labelled.
- Restates verified height: the zeta rows do, and the result says so. Finding 2 above sharpens this.
- Known theorem presented as new: no. Lemma 4 is P12 and is attributed; Lemma 1 is elementary; Lemma 2(b)
  is the single-prime window identity T4(b) transported, attributed.
- Zeta-only mechanism: none is claimed. The only step where a control differs structurally is Lemma 2(b)
  (ladder collapse needs coefficients supported on prime powers), which is an identity, not a bound.

## 4. Requirement flags (referee)

- R1 false. Multiplicativity enters only an identity (Lemma 2(b)); the bound question is coefficient-blind.
- R2 false. No bound is obtained; the one quantitative gain is a mean over height.
- R3 false. No conclusion exists that a control could fail; random-sign and DH runs confirm the
  orthogonalisation step is the same for all functions.
- R4 false. Nothing passes to the critical line.

## 5. What survives

For a finite set S of primes and smooth compactly supported one-sided tests: `M_S` maps the test class
into itself with range of infinite codimension (not onto), but every test is a limit of jointly
S-primitive tests in `L^2` norm and in `Q` simultaneously (referee repair, classical zero-free region).
Hence the infimum of `Q/||.||^2` over jointly S-primitive tests equals the infimum over all tests of the
class, for zeta and for controls with zeros in a comparable region: restricting to primitive tests neither
helps nor costs. The Gram matrix of the dilations is independent of the function. The all-prime Hecke
sums `Zw` lie in the radical of the zero sum (known). Lemma 2 and the two `y_z` formulas of Lemma 5 are
correct. Numerically the sign pattern is unchanged by the primitive restriction for zeta, DH, Liouville
twist, random signs, E_a, T-NR, and DH is positive to rounding on a band without off-line zeros.
Not established as written: the congruence `Q o M_S ~ Q` on the stated domain, and the identification of
the bound with P10 (domain transfer from exponential node families to compactly supported tests).

## 6. Files

Only this file was written. The referee script was run from a scratch copy and removed; its full text is
below (place it in a subdirectory of the lane directory, run as `scripts/memcap.sh 8 .venv-arb/bin/python
ref_check.py <symbol|lemma2b|zeta|dh|tw>`). Each run under 2 minutes, planned allocations below 0.02 GB.
The compute server was not used.

```python
"""Referee checks (float64). usage: ref_check.py <case>"""
import sys, math, json, numpy as np, scipy.linalg as sla
sys.path.insert(0, __file__.rsplit('/', 2)[0])
from plib import *
case = sys.argv[1]

def run(name, T, Nmax, ps, gc, kern=None, Ns=(12, 25, 50, 100)):
    tab = mobius_ratio_table(ps) if ps else [(0.0, 1.0)]
    shifts = [s for s, c in tab]; coef = np.array([c for s, c in tab])
    smax = max(abs(s) for s in shifts); X = math.exp(T + smax) * 1.0000001
    print(f"# {name} T={T} gc={gc} S={ps} shifts={len(shifts)} X={X:.4g} planned atoms<= {2*X*24/1e9:.3f} GB, matrices {Nmax**2*64/1e9:.4f} GB", flush=True)
    if kern is None: kern = make_kernel(name, X)
    gk = make_kernel('gram', X)
    mm = mode_index(Nmax); om = gc + 2 * np.pi * mm / T
    E, D = ED(kern, T, om, shifts); Eg, Dg = ED(gk, T, om, shifts)
    i0 = min(range(len(shifts)), key=lambda i: abs(shifts[i]))
    Qf = loewner(E[i0], D[i0], mm); Qp = loewner(coef @ E, coef @ D, mm); Gp = loewner(coef @ Eg, coef @ Dg, mm)
    for N in [n for n in Ns if n <= Nmax]:
        A = Qf[:N, :N]; A = (A + A.conj().T) / 2; ev = np.linalg.eigvalsh(A)
        B = Qp[:N, :N]; B = (B + B.conj().T) / 2; G = Gp[:N, :N]; G = (G + G.conj().T) / 2
        evp = sla.eigh(B, G, eigvals_only=True)
        print(f"{name} N={N} full_min={ev[0]:.4g} neg={int((ev<-1e-8).sum())} | prim_min={evp[0]:.4g} neg={int((evp<-1e-8).sum())} gram_min={np.linalg.eigvalsh(G)[0]:.3g}", flush=True)
    return Qf, Qp, Gp, (E, D, Eg, Dg, shifts, coef, mm)

if case == 'zeta':
    run('zeta', 7.5, 100, [2, 3, 5], 40.0)
    run('zeta', 5.0, 100, [2, 3, 5, 7, 11], 200.0)
elif case == 'dh':
    run('dh', 7.5, 100, [2, 3, 5], 114.16)
    run('dh', 7.5, 100, [2, 3, 5], 40.0)
    run('dh', 5.0, 100, [2, 3, 5, 7, 11], 85.7)
elif case == 'tw':
    run('tw', 7.5, 100, [2, 3, 5], 40.0)
    # random (non-multiplicative) sign twist on prime powers
    T = 7.5; ps = [2, 3, 5]; X = math.exp(T + math.log(30)) * 1.0000001
    rng = np.random.default_rng(7)
    y, w = prime_power_atoms(X); w = w * rng.choice([-1.0, 1.0], size=len(w)); y, w = sym_atoms(y, w)
    k = Kernel('rand', np.append(y, 0.0), np.append(w, -math.log(math.pi)))
    run('randsign', T, 100, ps, 40.0, kern=k)
    run('ea', 7.5, 100, [2, 3, 5], 40.0)
    run('nr', 7.5, 100, [2, 3, 5], 40.0)
elif case == 'lemma2b':
    # Q(M_S v) = Q_noS(M_S v) + sum_p log p[(2/p)||x_p||^2 - 2 p^-1/2 Re<S_logp x_p, x_p>], x_p = M_{S\p} v ; S={2,3}, zeta
    T = 6.0; N = 40; gc = 30.0; ps = [2, 3]
    X = math.exp(T + math.log(6)) * 1.0000001
    mm = mode_index(N); om = gc + 2 * np.pi * mm / T
    def form(kern, tab):
        sh = [s for s, c in tab]; cf = np.array([c for s, c in tab])
        E, D = ED(kern, T, om, sh); return loewner(cf @ E, cf @ D, mm)
    kz = make_kernel('zeta', X); gk = make_kernel('gram', X)
    lhs = form(kz, mobius_ratio_table(ps))
    # kernel with primes 2,3 removed
    y, w = prime_power_atoms(X)
    n = np.rint(np.exp(y)).astype(np.int64)
    def is_pow(n, p):
        n = n.copy()
        for _ in range(60): n = np.where(n % p == 0, n // p, n)
        return n == 1
    keep = ~(is_pow(n, 2) | is_pow(n, 3))
    y, w = sym_atoms(y[keep], w[keep])
    kno = Kernel('noS', np.append(y, 0.0), np.append(w, -math.log(math.pi)))
    rhs = form(kno, mobius_ratio_table(ps))
    for p in ps:
        rest = [q for q in ps if q != p]
        base = mobius_ratio_table(rest)   # <S_s M x_j, M x_k> table for x_p
        lp = math.log(p)
        # Q-form matrix convention: entry = form(S_s v_j, v_k) summed with coef; need ||x||^2 and Re<S_lp x,x> as Hermitian forms
        t0 = [(s, c * 2 / p) for s, c in base]
        t1 = [(s + lp, -c * p ** -0.5) for s, c in base] + [(s - lp, -c * p ** -0.5) for s, c in base]
        rhs = rhs + lp * form(gk, t0 + t1)
    print("lemma2b max|lhs-rhs| =", float(np.abs(lhs - rhs).max()), "scale", float(np.abs(lhs).max()))
elif case == 'symbol':
    for P in (7, 100):
        ps = primes_upto(P).astype(float)
        print(P, "Gram symbol |zeta_S|^2: sup(tau=0)=", float(np.prod((1 - ps ** -0.5) ** -2)), "mean=", float(np.prod(1 / (1 - 1 / ps))),
              "| |m_S|^2: sup=", float(np.prod((1 + ps ** -0.5) ** 2)), "mean=", float(np.prod(1 + 1 / ps)))
        tau = np.arange(1000.0, 3000.0, 0.01); lg = np.zeros_like(tau)
        for p in ps: lg += np.log1p(-2 * p ** -0.5 * np.cos(tau * np.log(p)) + 1 / p)
        print("   window [1000,3000]: max |zeta_S|^2 =", float(np.exp(-lg.min())), " mean |zeta_S|^2 =", float(np.exp(-lg).mean()), " mean |m|^2 =", float(np.exp(lg).mean()))
```
