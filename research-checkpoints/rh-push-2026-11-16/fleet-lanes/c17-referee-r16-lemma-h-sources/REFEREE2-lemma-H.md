HOLDS

# REFEREE2: Lemma H (backward-heat inheritance of a monomial bound)

Lane `c17-referee-r16-lemma-h-sources`, 2026-11-20. Second referee; independent of the author of Lemma H
(`push/c16-referee-r15-j1prime-u8-screening/REFEREE2_lemma-j1prime-u8-heat-inheritance.md`, section 2.2). The
derivation of section 1 was written from the definition of the heat family before the author's proof and the
author's checks were opened; the comparison of section 3 was made afterwards. Code: `code/lemh.py` (own kernels,
python-flint balls at 128 bits; local, `scripts/memcap.sh 8`, under 2 s). Nothing here is a statement about zeros
of zeta. Labels: PROVED (argument written here), CLASSICAL, MEASURED-ball.

Lemma H now has two independent referees: its author and this file.

## 0. Statement refereed

K real, without polar terms; heat member `K_tau(u) = exp(tau u^2/4) K(u)`, tau < 0, the same tau on every member
if several kernels enter. `M = prod_i K_(X_i)(u_i)^(e_i)` real and defined, `S = sum_i e_i u_i^2`. Suppose
`M <= lam` (the value at tau = 0). Then

- (H1) `M_tau <= lam` for all tau < 0 if and only if `lam S >= 0` or `M lam <= 0`;
- (H2) otherwise (`lam S < 0` and `M lam > 0`) `M_tau <= lam` holds exactly for
  `abs(tau) <= tau* = 4 abs(log(lam/M))/abs(S)` and fails exactly for `abs(tau) > tau*`.

## 1. Derivation (PROVED)

Definition. The member at tau multiplies the kernel pointwise by `g(u) = exp(tau u^2/4) > 0`. Each factor of the
monomial becomes `(g(u_i) K(u_i))^(e_i) = g(u_i)^(e_i) K(u_i)^(e_i)` (for an integer e_i always; for a non-integer
e_i when `K(u_i) > 0`, which is what "defined" means). Hence `M_tau = c M` with
`c = prod g(u_i)^(e_i) = exp(tau S/4) > 0`. For tau < 0: c runs over (0, 1) decreasingly in abs(tau) if S > 0,
over (1, inf) increasingly if S < 0, and c = 1 if S = 0. The question is for which c in that range `cM <= lam`.

1. S = 0: `M_tau = M <= lam`. Inherited. (`lam S = 0`.)
2. S > 0, c in (0, 1).
   - M >= 0: `cM <= M <= lam`. Inherited. (Here lam >= 0, so `lam S >= 0`.)
   - M < 0 and lam >= 0: `cM < 0 <= lam`. Inherited. (`lam S >= 0`.)
   - M <= lam < 0: `cM <= lam` iff `c >= lam/M` (division by M < 0 reverses the sign; `lam/M` in (0, 1]) iff
     `tau S/4 >= log(lam/M)` iff `abs(tau) <= 4 abs(log(lam/M))/S`. Here `lam S < 0` and `M lam > 0`.
3. S < 0, c in (1, inf).
   - M <= 0: `cM <= M <= lam`. Inherited. (If lam <= 0 then `lam S >= 0`; if lam > 0 then `M lam <= 0`.)
   - M > 0 (so lam >= M > 0): `cM <= lam` iff `c <= lam/M` iff `abs(tau) abs(S)/4 <= log(lam/M)`. Here
     `lam S < 0` and `M lam > 0`.

The inherited sub-cases are exactly `{lam S >= 0} union {M lam <= 0}` under the hypothesis `M <= lam`: if
`lam S >= 0` then (S = 0) case 1; (S > 0, lam >= 0) the first two lines of case 2; (S < 0, lam <= 0, so M <= 0)
case 3 first line; if `M lam <= 0` with `M <= lam` then `M <= 0 <= lam`, and `cM <= 0 <= lam` for every c > 0.
In the complement M and lam are non-zero of one sign and S != 0, so `log(lam/M)` and `tau*` are defined; the two
remaining lines give (H2) with the same formula. If `lam = M` in the complement, `tau* = 0` and the bound fails
for every tau < 0. QED

Nothing arithmetic is used: the only input is that the lift is a pointwise positive multiplier of the kernel,
with Gaussian exponent, common to all members. This is where "without polar terms" enters: for a kernel with
polar terms the heat member is not `g K` (the polar part transforms separately), and the lemma says nothing.

## 2. Tests (MEASURED-ball unless marked)

### 2.1 The lift is the heat family (not assumed)

For zeta, with `Phi(u) = sum_n (2 pi^2 n^4 e^(9u) - 3 pi n^2 e^(5u)) exp(-pi n^2 e^(4u))` and
`Xi(z) = int Phi(u) e^(izu) du = xi(1/2 + iz/2)/4`: multiplication of the kernel by `exp(tau u^2/4)`, tau < 0, is
the Gaussian average `int Xi(z - y) exp(-y^2/abs(tau)) dy / sqrt(pi abs(tau))` on the function side (the backward
heat member). Ball integrals (`acb.integral`) at tau = -0.3, z = 3.7: kernel side
`[0.11472066061466460209 +/- 8.94e-21]`, Gaussian average of xi computed from arb's zeta
`[0.1147206606146646021 +/- 2.02e-20]`, difference below 1.5e-20. `int Phi = 0.12428019454707852748` against
`xi(1/2)/4 = 0.1242801945470785274781934`. (Integration ranges [-3, 3] and [-12, 12]; the tails, below 1e-200, are
bounded on paper and are not inside the balls. Evenness of Phi, CLASSICAL, is used to evaluate the series at
negative arguments.)
The author's Turan example is reproduced with this lane's kernel: `K(u-h) K(u+h)/K(u)^2` at u = 0.3, h = 0.4 in
the author's variable (this lane's u/2) is `[0.0143884210044 +/- 5e-14]` (author: 0.0143884210).

### 2.2 The rule, on three kernels

The monomial of the member is computed factor by factor from member values `exp(tau u_i^2/4) K(u_i)` in balls
(the shortcut `exp(tau S/4) M` is not used), and the truth of `M_tau <= lam` is decided by ball comparison
and compared with the prediction of (H1), (H2). Nodes: 2 to 4 per monomial, in [-0.6, 0.6] (this lane's variable).
tau in {-0.003, -0.02, -0.3, -2, -15, -120}; in the threshold case also
`tau = -f tau*`, f in {0.5, 0.99, 0.999999, 1.000001, 1.01, 2, 50}. lam: four designs (relative slack 0.05 to 3
on either side of 0, a slack of 1e-7, lam = 0).

| kernel | points | cases covered (sign of S, M, lam) | decisions | agree | disagree | undecided | certified failures of the bound |
|---|---|---|---|---|---|---|---|
| zeta, `Phi` (real exponents in {+-0.5, +-1, +-1.5, +-2, 3}) | 20 | S>0,M>0 (7); S<0,M>0 (13, threshold) | 211 | 211 | 0 | 0 | 97 |
| cubic character mod 7: real kernels `Re K_chi`, `Im K_chi`, `K_chi(u) = e^(u/2) sum chi(n) exp(-pi n^2 e^(2u)/7)` (integer exponents in {+-1, +-2, +-3}) | 20 | S<0,M>0,lam>0 (10, threshold); S>0,M>0 (4); S<0,M<0 with lam = 0 (3), lam < 0 (2), lam > 0 (1) | 190 | 190 | 0 | 0 | 74 |
| the same 20 points with all exponents reversed (S -> -S) | 20 | S>0,M>0 (10); S<0,M>0 (4, threshold); S>0,M<0 with lam = 0 (3), lam < 0 (2, threshold), lam > 0 (1) | 162 | 162 | 0 | 0 | 43 |
| E_a member, a = 0.2: kernel of `xi(s+a) xi(s-a)`, `int Phi(v) Phi(u-v) e^(2a(2v-u)) dv` by ball integration | 20 | S>0,M>0 (13); S<0,M>0 (7, threshold) | 169 | 169 | 0 | 0 | 58 |
| total | 80 | all six sub-cases of section 1 | 732 | 732 | 0 | 0 | 272 |

Every sub-case of section 1 occurs, both threshold branches included (M > 0 with S < 0; M < 0 with S > 0). At
every threshold point the bound holds at `0.999999 tau*` and fails at `1.000001 tau*` (certified by the balls).
The required 20 points per kernel are met; the character kernel has 40 because the first 20 did not contain the
branch M < 0, S > 0, lam < 0.

What the test does and does not show. Since the member is defined as `g K`, 2.2 tests the case analysis and the
formula for `tau*` on real kernel values of both signs; it cannot fail unless section 1 has an algebra error.
The content that is not a tautology is 2.1 (the multiplier is the heat family) and it is tested at one (tau, z)
for zeta only. For the character and for E_a the multiplier form is the registered definition of the lift.

## 3. Comparison with the author's text (read after sections 1 and 2)

- (H1), (H2): identical to section 0; the author's proof has the same sub-cases. No difference.
- (H3) (lower bounds) and (H4) (lam = 0 always inherited; `M = lam != 0` inherited iff S = 0): follow from
  section 1 applied to `-M`, `-lam`. Hold.
- Corollaries (C1) to (C5) re-read: (C1) holds (`tau* > 0` iff `lam != M`). (C2): the figure 1.6e-3 is
  `abs(tau) abs(S)/4 = 0.02 x 0.32/4`; holds; "such a lam exists for every monomial with S != 0" is true when
  "bound" may be an upper or a lower bound (for M > 0, S > 0 an upper bound is always inherited; the lower
  bound is the one with a threshold). (C3) needs `M_2 != 0`. (C4): identity and the Laguerre count are correct
  (CLASSICAL). (C5): the factorisation `exp(tau (x-y)^2/4) = exp(tau x^2/4) exp(tau y^2/4) exp(abs(tau) xy/2)` is
  correct.
- No sentence of the author's section 2.2 is false as written.

Hypotheses that the statement must carry wherever it is quoted (all present in the author's text, not all in the
one-line versions in `RESULT.md` of that lane and in the round-17 assignment):
1. real kernel values and a real, defined monomial (`K(u_i) != 0` where `e_i < 0`; `K(u_i) > 0` where `e_i` is not
   an integer). For a complex kernel apply the lemma to its real and imaginary parts, as in 2.2;
2. the same tau on every member entering the monomial;
3. no polar terms;
4. the hypothesis `M <= lam` at tau = 0. The one-line form "inherited for abs(tau) <= 4 abs(log(lam/M))/abs(S)"
   is exact (an equivalence) only in the case `lam S < 0`, `M lam > 0`; in the other case the bound is inherited
   for all tau < 0 and the expression may be undefined (M = 0 or lam = 0) and is not needed.

## 4. Consequence for the gated lane

`c17-u8-restricted-search-lemma-h-gated` may use Lemma H as stated, with hypotheses 1 to 4: monomial bounds,
two-term conditions with a signed second term, and functionals with one common value of S are decided on paper for
kernels without polar terms; the HEAT column of any other finite functional `sum a_j M_j` is
`sum a_j exp(tau S_j/4) M_j`, computed from the kernel of the positive member alone.

## 5. Weakest points of this file

1. Section 2.2 cannot detect an error in the identification of the lift; 2.1 covers that for zeta at one point.
2. The tails of the ball integrals in 2.1 and of the E_a kernel are bounded on paper (below 1e-200), not inside
   the enclosures.
3. Nodes were restricted to [-0.6, 0.6] in this lane's variable ([-1.2, 1.2] in the author's); the lemma does not
   depend on the range, the test does.
