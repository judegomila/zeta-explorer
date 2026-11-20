# REFEREE (adversarial, lens: general) for c2-euler-at-zeros/RESULT.md

Date: 2026-11-17. Scope: re-derivation of the PROVED steps, one rerun of the numeric check on new cases, one control
run by the referee, check of the measured claims against the lane's own output files. Referee scripts were kept
outside the lane directory (scratch); runs local under `scripts/memcap.sh 8` with `.venv-arb`; server not used.
Nothing here is a statement about zeros of zeta.

## Verdict

**Holds, with four corrections.** The claimed verdict (precise obstruction; no inequality established; all four
requirement flags false) stands. The two PROVED items (Lemma B, Corollary B1) were re-derived and confirmed. Three
MEASURED statements and one label are wrong or unsupported as written (E1-E4). None of them changes the verdict or a
flag.

## PROVED steps, re-derived

**Local functional equation.** `zeta_S(-s) = prod (1 - p^s)^-1 = prod (-p^-s)(1 - p^-s)^-1 = (-1)^|S| N_S^-s zeta_S(s)`. Confirmed.

**Lemma B.** Re-derived independently:
- Poles of `Phi` in `|Re z| <= c`: `z = +-(1/2 + it)`, `t = 2 pi k/log p`. For `k != 0` they are always simple
  (`log p/log q` is irrational for distinct primes; the hypothesis in the text is automatically true). `xi'/xi(1+it)`
  is finite there (no zero on `Re s = 1`, CLASSICAL).
- On `Re z = c > 1/2`: `zeta_S(1/2 - z) = (-1)^|S| N_S^(1/2-z) zeta_S(z - 1/2)`, both S-series converge absolutely,
  giving `Phi zeta'/zeta = (-1)^(|S|+1) sum Lambda(n) (N_S m)^(1/2-z) (m' n)^(-1/2-z) W W#`, with `x = N_S m m' n >= 2 N_S`
  and coefficient `(N_S m/(m' n))^1/2`. Matches line 3 and the threshold `T_w < log(2 N_S)`.
- Residue: `(1 - p^(z-1/2))^-1 ~ -1/((z - z0) log p)`; the G-residues cancel between the shift back to `Re z = 0` and
  the subtraction of the residues of `Phi L`; what remains is `+(1/log p) zeta_S(1+it) zeta_{S-p}(-it) zeta'/zeta(1+it) W(1/2+it) conj W(-1/2+it)`,
  twice the real part by the symmetry `z -> -conj z`. Matches line 2. `2 Re G(i tau) = Omega(tau)` (the `1/s + 1/(s-1)` part is imaginary on the line). Confirmed.
- Not checked in detail: the k = 0 residue (order |S|+1; only its size is used) and the Baker lower bound for the
  horizontal segments. Both are standard and do not affect the identity for `w = e^(iTt) b` beyond `O(T^-A)`.

**Rerun on new cases** (referee script; profiles `sin^(2m)`, m = 2, 3, 4, not only the lane's `sin^6`; own code for the prime sum):

| S | profile | T_w | log N_S | log(2 N_S) | T | zero side | arch | residues | prime sum | rel. diff |
|---|---|---|---|---|---|---|---|---|---|---|
| {5} | sin^8 | 1.55 | 1.609 | 2.303 | 7000 | 2.515462608 | 2.669419299 | -0.153956692 | 0 | 2.2e-10 |
| {2,5} | sin^6 | 2.9 | 2.303 | 2.996 | 6000 | 11.501737281 | 22.753513336 | -11.251776060 | 0 | 4.0e-10 |
| {7} | sin^4 | 2.5 | 1.946 | 2.639 | 2000 | 3.427902566 | 4.595993095 | -1.168090529 | 0 | -3.2e-11 |
| {3,5} | sin^6 | 4.2 | 2.708 | 3.401 | 4000 | 3.965344747 | 9.885988341 | -5.920643647 | 5.28e-8 (3 terms) | -5.9e-11 (1.3e-8 without) |
| {2} | sin^8 | 3.0 | 0.693 | 1.386 | 11000 | 4.480779227 | 4.919362221 | -0.444421136 | 5.84e-3 (18 terms) | 2.2e-10 (1.3e-3 without) |

Rows 2 and 3 have `log N_S < T_w < log(2 N_S)`: they test the threshold `log(2 N_S)` (the docstring of `test2.py` still
says `log N_S`; the RESULT statement is the correct one). Lemma B confirmed.
Note on the lane's table: its first seven rows all have `T_w < log N_S`; the sharp range is covered only by the two
unlisted cases in `test2.json` ({2}, 1.2 and {2,3}, 2.6; the latter is slightly above `log 12 = 2.485` and passes only
because the single missing term is of size `(pi 0.115/2.6)^12`). Not an error; the referee rows close the gap.

**Corollary B1.** Re-derived: `|zeta_p(1+it_k)| = p/(p-1)` at the lattice; Parseval for the `log p`-periodisation is exact
for `T_w <= log p`; `int|w|^2 e^t <= p ||w||^2`; `Den >= (1 + p^-1/2)^-2 ||w||^2`. The stated constant follows. The
conclusion needs `zeta'/zeta(1+it) = o(log t)`; de la Vallee Poussin's `O(log t)` is not enough for large p, so the
Vinogradov-Korobov (or Littlewood) form is the right citation. `T_0 >= exp(c p^(3/2))` follows. Confirmed. It is a
large-height statement with a non-uniform threshold; the RESULT says so.

**Lemma A.** The mean `-2 log p/(p-1)` per prime and the pointwise range of `2 Re zeta_p'/zeta_p` on the line were
re-derived and are correct; `-2 L1(P)` checked at P = 2, 3, 7. The statement "the pole term and the outside prime sum
diverge separately and converge together" carries the label PROVED but no argument is given; it is only supported
through Lemma B. It should be labelled CLAIMED or derived from Lemma B.

## Errors

**E1. "Measured maxima of E_out grow with height (2.7 to 11.2 over five bands)" is a sample-size effect.** The five
bands contain 60, 175, 500, 1500, 2259 windows. From the lane's own `zeta_E_P7_D2.npy`, in eight blocks of equal count
(561 windows each, block starts 60, 2304, 4548, 6792, 9036, 11280, 13524, 15768):
max E_out = 6.59, 6.38, 7.18, 5.40, 5.10, 11.17, 6.15, 5.70 (sd 0.99-1.37). No trend; 11.17 is one outlier. P = 2:
3.63, 3.77, 2.98, 3.58, 2.92, 3.92, 3.56, 4.08. P = 100: 5.89, 4.96, 6.05, 5.42, 5.62, 6.04, 7.29, 6.32. The data
neither show growth nor exclude it. The reduction of the every-window form to a sup over height is unaffected, but
the R2 evidence line "measured maxima grow with height" must be replaced by "no proved bound; the measured range
shows no trend at equal sample size". (Referee remark, not proved here: for fixed (P, Delta) unboundedness of
`R_S - Obar` as T grows is what the classical Omega-results for `S(t+h) - S(t)` suggest; that would settle the OPEN
item in the direction "sup is infinite" and make the every-window depletion inequality false at large height for
zeta itself.)

**E2. "The function's own partial Euler product damps off-line pairs; MEASURED for E_a and heat" was not measured
with the function's own product.** `test1.py` and `test3.py` use zeta's product `zeta_S(s)` for E_a, T-NR and the heat
family. E_a's own product is `zeta_S(s+a) zeta_S(s-a)`; the heat family has none. Referee run with E_a's own product
(a = 0.2, 20000 zeros, same Gaussian windows):

| P | mean log pair weight, zeta's product (as in RESULT) | same, E_a's own product | generic heights (own) | Krein sum < 0, Delta = 2 | Krein sum < 0, Delta = 10 |
|---|---|---|---|---|---|
| 2 | -0.14 | -0.29 | -0.02 | - | - |
| 7 | -0.48 | -1.02 | -0.04 | 827 / 4491 | 134 / 894 |
| 100 | -1.24 | -2.97 | -0.01 | 1607 / 4491 | 238 / 894 |
| 1000 | -2.36 | -6.94 | -0.02 | 2166 / 4491 | 407 / 894 |

So the damping in size holds, and more strongly, for the own product (the heuristic survives as a MEASURED statement
for E_a after this correction). But the control table entry for E_a, "lower inequality negative in 14 / 84 of 4494
windows; none for Delta >= 10", and Reading 2, "fixed-shape windows of width >= 5 do not detect them", hold only for
zeta's product as multiplier. With E_a's own product the Krein sum is negative in 15-48% of windows at both widths.
The control table mixes two conventions (zeta's product for E_a, T-NR, heat; a shifted product for the unimodular
twist; both for Liouville); it should state the multiplier per row. For the heat family the phrase "own Euler
product" has no meaning, and its measured ratios (0.17, 0.05, 0.21, 0.44 at P = 7, 30, 100, 1000; 5 pairs) are not
monotone in P, against the stated law `exp(-li(P^(2 beta-1)))`.

**E3. "The S-part alone has mean -2 L1(P) at every P" is not what the lane's data show at large P.** `test1.json`,
Delta = 50: mean E_S by height band at P = 1000 is -5.63, -7.34, -8.68, -9.53 against `-2 L1 = -12.73`; at Delta = 2 it
is -0.97 at P = 2 (against -1.386) and -2.6 at P = 7 (against -3.94). The statement is true as a limit of long
averages (ratio of means), not for the mean over windows of the per-window ratio at these widths. In particular the
measured E_S is not height-independent at P = 1000, Delta = 50 (window narrower than the almost-period scale), so
"E_S is height-uniform" is CLASSICAL only for `Delta >= Delta_0(P)` and is not a measured fact at P >= 100. The value
"+2.3" for mean E_out at P = 1000 is correct (2.26, top band).

**E4. Limit P -> inf.** "R_S -> 0 in every measured window" rests on P <= 1000 with R = 0.38 and a local exponent that
has not converged (-2.0 to -2.7); "answers the OPEN item of c1 numerically" should read "is consistent with". Labelled
HEURISTIC in section 3.1; the verdict paragraph states it without the label.

## Other checks

- RH is not assumed in Lemma B or B1. The zero side of every numeric check uses zeros below height 18046 on the
  line; `R > 0` for zeta in the measured range is a restatement of verified height and the RESULT says so.
- Known theorem presented as new: Lemma B is the Weil explicit formula applied to the non-compactly-supported test
  `Z_S w * (Z_S w)~`, made convergent by the local functional equation. I know no reference for this form; it should be
  described as a rearrangement of the explicit formula, which the RESULT does ("exact identity").
- Controls not run by the lane (stated in its section 7): Beurling, phase-rotated transfer operator, theta^w, the DH
  form of Lemma B. The sentence "no inequality separates zeta from all controls" is therefore: the lower inequality
  is the target; the upper one is satisfied by E_a and heat on Gaussian windows of three widths (zeta's product as
  multiplier). It is a measured non-separation plus a reduction, not a theorem.

## Requirement flags (set by the referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | No inequality is established. Lemma B uses the Euler product only for the finite test factor; the single analytic input of B1 is the classical zero-free region. |
| R2 | false | B1 has a threshold `T_0(p, b)`; the every-window depletion bound is unproved (and after E1 has no measured trend either way). |
| R3 | false | Lemma B holds for every control with the functional equation; the depletion inequality is satisfied by E_a and heat on the measured windows. |
| R4 | false | Only `zeta'/zeta` on `Re s = 1` enters; `R_S` degenerates as P grows. |

## Surviving claim

For finite S and smooth `w` of support length `T_w`, the Krein zero sum of `|zeta_S W|^2` equals the archimedean
integral plus residues of `zeta'/zeta` at `1 + 2 pi i k/log p` plus a finite prime sum over `N_S m m' n <= e^T_w`
(empty for `T_w < log(2 N_S)`); verified by the lane in 13 cases and by the referee in 5 further cases to relative
4e-10 or better. For |S| = 1 and `T_w <= log p` this gives `R_S > 0` for `T >= T_0(p, b)` from Vinogradov-Korobov. The
identity holds for every control with the functional equation and uses data on `Re s = 1` only. No one-sided
inequality on `R_S` was found that separates zeta from the controls: the lower one is the target, the upper one is a
mean-value law (`-2 L1(P)` for long averages) that E_a and heat also satisfy on the measured windows; its
every-window form is unproved. The damping of off-line pairs by a partial Euler product is measured in size for E_a
(both multipliers), with indefinite sign for E_a's own product.
