# REFEREE: ap-global-bridge

Date 2026-11-17. Adversarial check of `RESULT.md`. Claimed verdict: precise-obstruction.
Referee verdict: **holds, with four corrections** (one novelty failure, one scope overstatement, one wrong
operator-theoretic term, one incomplete proof in the DH row). No PROVED step was found false.
All numerics were run locally through `scripts/memcap.sh` (caps 4 and 8 GB); scratch scripts in `/tmp/ref-agb`
(not kept in the repo).

## 1. Theorem C: re-derived, confirmed

- Algebra. `cos phi_p = -p^{beta-1}` gives `chi(p) = p^{i gamma}(-p^{beta-1} + i eps sin phi_p)`, so
  `sum_p chi(p) p^{-s} = -sum_p p^{-(s-s0+1)} + R(s)`. With `log zeta(w) = sum_p p^{-w} + h0(w)` the formula
  follows in `Re s > 1`. Confirmed.
- Domains. `h` analytic in `Re s > 1/2`; `h0(s-s0+1)` analytic in `Re s > beta - 1/2`; both confirmed.
- Convergence of `R` in `Re s > 0`. The paired-term bound by `int |g'|` over disjoint intervals
  `[p_{2j-1}, p_{2j}]` is correct, and `|g'(x)| <= C(beta)(1+|s|) x^{-1-Re s}` on `x >= 2`. The constant
  contains `(1 - 2^{2 beta - 2})^{-1/2}`, which is unbounded as `beta -> 1`; this is harmless for fixed `beta`
  but should be stated. Single terms tend to 0, so the series in the given order converges locally uniformly.
  Confirmed.
- Zeros and poles. `exp(...)` is zero-free, `1/zeta(w)` vanishes only at `w = 1`, so the only zero in
  `Re s > 1/2` is a simple zero at `s0`. Poles at `s0 - 1 + rho` have real part `< beta`. Confirmed.
- Independent numerics (own code, coefficients built by smallest-prime-factor recursion, N = 4e6):
  `s0 = 0.9 + 3i`: `|S_M(s0)|` = 1.19e-2, 5.4e-3, 2.4e-3 at M = 6250, 25000, 1e5; error at `1.4+3i` 3.1e-5;
  winding number 1.0000 on `|s - s0| = 0.08`.
  `s0 = 0.75 + 14i` (not tested by the author): winding number 1.0000, minimum modulus on the circle 0.104
  (closed form 0.105), error at `1.4+14i` 9.5e-6. At `s0` itself `|S_M|` is 2.3e-3, 1.8e-3, 2.8e-3: not
  monotone in M at this N, so the float64 check at `beta = 0.75` is consistent but weaker than at 0.9.
- Author's script re-run: N = 2e6 and N = 4e7 reproduce the JSON files (winding 1.0000).

## 2. Theorem C is not new (novelty check fails)

`RESULT.md` calls U "a new control" and says "novelty not checked". The statement is a special case of
K. Seip, "Universality and distribution of zeros and poles of some zeta functions", J. Anal. Math. 141
(2020) 331-381, arXiv:1812.11729 (abstract checked): for completely multiplicative unimodular `chi`,
`zeta_chi` can be given zeros at any discrete multiset in `1/2 < Re s <= 39/40` unconditionally (in the whole
half-critical strip under RH), and zeros and poles at prescribed multisets under a density condition. The
construction there is of the same type (prescribing `sum_p chi(p) p^{-s}`). Later work on "Helson zeta
functions" (Bochkov, Romanov; recalled, not re-read) extends it. The single-zero case with poles allowed, as
in Theorem C, is the elementary instance. Consequences:
- U is new only as an entry in this campaign's control table. It should be cited as Seip 2020.
- Seip's results are stronger than Remark (i) and should replace it.
- The map's earlier claim that `{INT, GEOM}` is hit by all controls was already false in the literature.

## 3. Theorem D: correct as stated, verdict wording overstates it

`U f = f o tau` is unitary, commutes with the flow, and `U e_n = chi0(n) e_n`; confirmed. The conclusion is
valid for predicates invariant under translations, i.e. for the structure of `G` as a homogeneous space
(torsor). It is then a short consequence of Theorem C.

Overstatement. The verdict (item 1) says the translation group "preserves every piece of its structure" and
section 3 says the base point "is not a property of the compact group G". Both are false as written:
`chi = 1` is the identity element of the group `G`, and the automorphic line is the unique flow orbit that is
a subgroup. Translations are not group automorphisms. Properties that use the identity are not covered by
Theorem D. Example: "Euler symbol with unimodular parameters and non-negative Fourier coefficients" holds
only at `chi = 1`. So the claim "no invariant of the compact object implies a zero-free region" must be
restricted to "no translation-invariant property". Nothing in the lane excludes properties tied to the
identity (they are not shown to help either).

## 4. Lemmas 1, 2 and consequence (1a)

- Lemma 1. `pi_p = p . (1/p; u)` with `u_q = 1/p` for `q != p`, `u_p = 1`, `u in Zhat*`. Confirmed. The
  resulting real dilation is by `1/p`, not `p`, in this normalisation (convention only).
- (1a). The von Neumann algebra of dilations by a dense subgroup equals that of all dilations and is maximal
  abelian on `L^2(R_{>0})`; the joint spectral measure is carried by the line `t -> (p^{-it})`, which is
  Haar-null. Confirmed.
- Lemma 2. `exp(t (sum_v l_v)^2)` does not factor over places; confirmed (restricted to the support of `f0`,
  which is a product set with at least two values per coordinate, the cross term `2 t l_v l_w` is not
  separable). The lemma shows that this representative is not a pure tensor. It does not by itself show that
  no other test vector gives the same Mellin transform; that follows from the known absence of an Euler
  product for `H_t`, not from Lemma 2.

## 5. Davenport-Heilbronn control: verified numerically, two corrections

Run (mpmath 30 digits, numpy sieve to 1e8, planned allocation 95 MB, cap 4 GB):
- `kappa = 0.2840790438`; coefficients 1, kappa, -kappa, -1, 0; `a(6) - a(2)a(3) = 1.0807009`.
- Off-line zeros `0.80851718245664 + 85.699348485378i` and `0.65083008060974 + 114.16334273076i`
  (`|f| < 5e-30`, winding number 1). At these points `|L(s, chi_5)| = |L(s, conj chi_5)|` = 0.7022 and 0.4219.
- Bohr lift. `f = c F_chi + conj(c) F_conj(chi)` vanishes at a point of `G` at abscissa `sigma` iff
  `prod_{p = +-2 mod 5} (1 + i y_p)/(1 - i y_p) = -conj(c)/c` with `|y_p| = p^{-sigma}`. The maximal argument of
  each factor is `2 arctan(p^{-sigma})`, attained at modulus 1, so the threshold is
  `sum_{p = +-2 mod 5} arctan(p^{-sigma}) = pi/2 - arctan(kappa) = 1.294009`. Solving (primes to 1e8 plus
  tail `E_1((sigma-1) log N)/2` = 0.018): `sigma* = 1.12036247`, matching 1.1203625 in the map.
- Two-character test vector at 5 and the slice: the sum over `Q*` reduces to integers prime to 5 with
  coefficients `c chi_5(n) + conj(c) conj(chi_5(n))`; confirmed. `E(f)` is a sum of two different `Zhat*`-types;
  confirmed.

Correction 5a ("nonzero Breuer index for 1 < sigma < 1.12"). For every `sigma` in `(1, sigma*]` the DH
symbol is continuous on `G` and has a zero on `G` (the value region of the product is filled, since the
largest term `arctan(2^{-sigma})` is below the sum of the others). A Toeplitz operator with a non-invertible
almost periodic symbol is not Breuer-Fredholm, so the Coburn-Douglas-Schaeffer-Singer index is not defined
there. What is nonzero is the Jessen mean motion (derivative of the Jensen function, where it exists). The
separation of DH from zeta stands and is more direct: the DH symbol is not invertible for `sigma <= sigma*`,
the zeta symbol is invertible for `sigma > 1`. Likewise "index 0 for zeta at every sigma > 1/2" is an index
statement only for `sigma > 1`; for `1/2 < sigma <= 1` it is the Jessen-function statement.

Correction 5b ("not the dilation spectrum of any C-invariant subquotient"). The written argument checks only
`omega in {chi_5, conj chi_5}` at one zero and leans on verified GRH. A subquotient may contain other
`omega`-types, and a strip zero of DH could in principle be a zero of some other `L(omega, s)`; that is not
excluded by the argument. Repair (unconditional): DH has zeros in `Re s > 1` and no Hecke L-function does,
so the DH zero set is not contained in the `s`-spectrum of any subquotient.

Remark. "Not outer" for DH is correct under the Jensen-equality definition: `int log|f_sigma| dm` is the
Jessen function, which is positive for `sigma < sigma*` while `log|a_1| = 0`. `RESULT.md` asserts it without
this argument.

## 6. Control U against the lane's structures

U passes every translation-invariant statement on `G` (Theorem D), has INT, GEOM, SIZE and an Euler product,
lacks FE, and lacks `Lambda >= 0`. Removing `{INT, GEOM}` from the minimal input sets is correct; `{FE, SIZE}`
and `{FE, GEOM}` remain hit by U because U lacks FE. TW- in the map is the same family; U is the member
with a zero in the strip.

## 7. Cited theorems

Lee-Yang, Newman, Lieb-Sokal, Borcea-Branden, Rallis, Kohnen-Zagier, Hodge-Riemann and Branden-Huh are not
used in this lane. Used and checked against their hypotheses: Helson 1969 (almost every `chi`: convergence
and no zeros in `Re s > 1/2`; applies to completely multiplicative unimodular `chi` with Haar measure, as
used); Bohr-Landau (`N(sigma, T) = o(T)`, `sigma > 1/2`); Jessen-Tornehave (mean motion and zero density);
Coburn-Douglas-Schaeffer-Singer (requires an invertible almost periodic symbol; see 5a). Meyer 2005 and
Connes 1999 are recalled only; the Krein-form row of the dictionary is labelled ARGUED and stays unverified.

## 8. Code and memory planning

`twist_zero.py` prints a planned allocation of 0.96 GB at N = 4e7. Measured peak resident memory: 3.31 GB
(48 s). The plan omits the arrays `n` and `ln` (0.32 GB each) and the complex temporaries inside `S`
(`-s*ln - n/M`, `exp`, product: about 0.64 GB each). The run stays under the 8 GB cap, but the printed plan
is low by a factor 3.4 and should be corrected. N = 2e6: peak 0.21 GB.

## 9. What survives

- Theorem C (true; known: Seip 2020) and control U as a table entry: unimodular completely multiplicative
  twist with a simple zero at any `s0`, `1/2 < Re s0 < 1`; lacks only FE (and `Lambda >= 0`).
- Theorem D restricted to translation-invariant properties of the Bohr torus.
- Lemma 1 and (1a): on `Zhat*`-invariants the prime ideles act as real dilations. Lemma 2 for the stated
  representative.
- DH separation: verified numerically (`sigma* = 1.12036247`, two strip zeros, non-vanishing of both
  L-functions there), with 5a and 5b applied.
- No statement about zeta zeros. Verdict "precise obstruction" stands for the translation-invariant class.
