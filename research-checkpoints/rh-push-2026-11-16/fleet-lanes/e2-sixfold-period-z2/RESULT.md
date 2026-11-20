# e2-sixfold-period-z2: the 7/8 probe as a period on the 6-fold cover; does the Z/2 factor of Z/6 separate the exceptional term?

Date 2026-11-18. Lane of the idea-engine round. Combination: `qrh-seven-eighths-input` x `probe-equals-theta-row-form`
x `zv-spinor-arithmetic-coupling-missing` x `map-pos-33` x `map-open-5`.
Scope: a statement about the P_a^{1/6} term of manuscript Prop 15.2 only. Nothing here concerns zeros of zeta.
No bound moves. RH open. NO QED.
Labels: PROVED (argument in this note) / PROVED-rel X / CLASSICAL / MEASURED (float64, not interval) / OPEN.

## 0. Verdict

**Dead (the decisive test refutes the separation), with the reason stated as three proved statements.**

1. The exceptional term and the principal signal carry the same Z/6 character, hence the same Z/2 character.
   MEASURED at 1000 split prime moduli (norms 7..8089), exact to 1e-30 leakage; PROVED for squarefree moduli (S2).
2. Stronger (S3, PROVED-rel manuscript (4.7)): on squarefree moduli, each entry of the signal form is the
   corresponding entry of the additive Gram form times a scalar that does not depend on the row variable m:
   `sum_m a_s(m) b_c(m) w(m) = mu(c) alpha(c)^2 G(c)^2 Psi(c) chi_c(-1) * sum_m a_s(m) conj(a_c(m)) w(m)` for every weight w.
   No grading, projection or operator acting on the row variable can separate the two; they differ only by the
   weight mu(c) Psi(c) on the modulus index.
3. The period in the assignment (cubic theta x sextic Eisenstein section x eta) has central character eps^(2+-1)
   on mu_6, which is the sign character on the Z/2 factor; it is identically zero (S1, PROVED). The balanced
   object is cubic x quadratic x sextic (2 + 3 + 1 = 0 mod 6), and at the level of Gauss sums it is the
   Hasse-Davenport relation of Lemma L (tro6-period), with mu(c) as its constant. The Z/2 member of that triple is a
   ray-class function of c mod 4 times a quadratic residue symbol (MEASURED on 282,269 moduli): it carries no
   Gauss-sum fluctuation.

One pivot was examined (section 6) and returns an item already on the positive list. Stopped there.

## 1. Plan and what is new

- Against `h-metaplectic-spin` (Theorems C, D): that lane argued "exceptional term = grade-0 class of the sextic
  cover"; the synthesis lists this as ARGUED and as merging two gradings. This note separates the three gradings
  that were merged and computes the character in each: (i) unit action on the row variable m at each prime of the
  modulus (S2, S3, test T1); (ii) Z/2 class of the modulus, chi_c(y)^3 (test T2); (iii) Hecke grade v_p(index)
  mod 6 (S4).
- Against `tro6-period`: Lemma L there already writes the rows as mu * conj(sextic Gauss sum). New here: the
  Z/6 = Z/2 x Z/3 reading of that lemma (S1, S3), the vanishing of the proposed period, and the two measurements.
- Against `h-seven-eighths-in-bridge`: nothing in this note uses the bridge. The base probe (6.1) is used; the
  Part II probe (12.5) is not analysed.
- Not done: manuscript sections 8-20 were not re-derived. Statements about "exceptional frequencies" are read from
  the proof of Prop 15.2 (frequencies k with all valuations e_p = 0 mod 6 outside C and the fixed modulus).

## 2. Objects (manuscript section 6.1; `sextic-theta-proof.md` section 1)

F = Q(omega), chi_c sextic symbol, gamma_j(c) = q_c^(-1/2) sum_v chi_c(v)^j e(v/c),
gt_j(y, c) = conj(chi_c(y))^j gamma_j(c), alpha(c) = c/|c|, G(c) = conj(chi_c(4)) gamma_3(c).
At a squarefree modulus prime to m:

- additive factor of (6.2): `a_s(m) = gt_1(-m, s)`. Its mean square over m is the left side of Prop 15.2; the
  P_a^(1/6) term is its theta residue (Theorem A (Id) of the proof note).
- corrected row of (6.1), n = 1 part: `b_c(m) = gamma_2(c) alpha(c) G(c) Psi(c) chi_c(m)`; Psi holds the target.

The group U_c = (O/c)^* acts on functions of m by f(m) -> f(um). Its quotient by sixth powers is (Z/6)^omega(c).
A function has index j at p | c if f(um) = chi_p(u)^j f(m). Z/2 coordinate: j mod 2. Z/3 coordinate: j mod 3.

## 3. Statements

**S1 (the proposed period vanishes) [PROVED; convention CLASSICAL].** On the 6-fold cover, a function of type eps^j
satisfies f(zeta g) = zeta^j f(g) for zeta in mu_6. The cubic theta function pulled back from the 3-fold cover has
j = 2 or 4 (mu_2 acts trivially). A genuine sextic Eisenstein/Kubota section has j = +-1. A Hecke character eta has
j = 0. The product has j odd, so it changes sign under -1 in mu_6 and its integral over any mu_6-invariant domain
is zero. A non-zero period needs total index 0. With the cubic theta (j = 2) and a sextic section (j = 1) the
missing factor has j = 3: a genuine function on the 2-fold cover. Local shadow, MEASURED: the product "cubic
Gauss function x sextic row" has index 5 at all 1000 primes (T1, line `a3*b`), not 0.

**S2 (characters of the two factors) [PROVED].** For squarefree c prime to m, a_c has index 5 (= -1) and b_c has
index 1 at every prime of c, since gt_1(-um, c) = conj(chi_c(u)) gt_1(-m, c) and chi_c(um) = chi_c(u) chi_c(m).
Both are Z/2-odd; their Z/3 coordinates are 2 and 1. Consequently, for moduli s, c:
- signal summand a_s b_c: index -1 on primes of s not in c, +1 on primes of c not in s, 0 on common primes;
- Gram summand a_s1 conj(a_s2): index -1 on s1 \ s2, +1 on s2 \ s1, 0 on common primes.
The Z/2 coordinate of both is the indicator of the symmetric difference of the two moduli. The diagonal of the
Gram form (source of the exceptional term) and the principal row s = c of the signal both have index 0 in Z/6.
The manuscript's exceptional frequencies are those with e_p = 0 mod 6, again index 0. Same Z/2 character: the
separation is refuted.

**S3 (signal entry = scalar x Gram entry) [PROVED-rel (4.7); EXACT check].** (4.7) gives gamma_2^3 = mu alpha and
gamma_1 = G gamma_2^2, hence gamma_2 = mu alpha G conj(gamma_1) (Lemma L of tro6-period). Therefore
`b_c(m) = mu(c) alpha(c)^2 G(c)^2 Psi(c) chi_c(-1) * conj(a_c(m))` for every m prime to c, and for every weight w

  sum_m w(m) a_s(m) b_c(m) = mu(c) alpha(c)^2 G(c)^2 Psi(c) chi_c(-1) * sum_m w(m) a_s(m) conj(a_c(m)).

At s = c prime, with the m-dependent part gamma_2 chi(m) of the row: a * gamma_2 chi(m) = chi(-1) mu alpha G (constant in m), and |a|^2 = 1. The rows are the complex conjugates of the
additive Gauss functions. Every linear operation on the row variable acts on the signal and on the Gram form
through the same matrix entries. The only place where they differ is the modulus weight mu(c) Psi(c), which is
where the target and the Euler product sit (tro6-period (MB)). Checks: T1 (`max_lemmaL_err_all_m` 1.7e-9 over all m
at 1000 primes), `hd_nodes.py` (4.7e-9 on 282,269 squarefree moduli).

**S3' (Z/2 x Z/3 factorisation = Hasse-Davenport, with Moebius as its constant) [PROVED-rel (4.7)].**
chi = conj(chi^2) * chi^3, so the m-dependent row is
`gamma_2(c) chi_c(m) G(c) = gt_2(m, c) * gt_3(4m, c) = mu(c) alpha(c) conj(gt_1(m, c))`:
(cubic Gauss function, index 4) x (quadratic Gauss function, index 3) = mu x conj(sextic Gauss function, index 1).
mu(c) = gamma_2(c)^3 conj(alpha(c)) is the constant in this relation (map-pos-33: the sign in -J(chi, rho)).
The quadratic member is G(c) chi_c(m)^3; G takes twelve values, one per class of c mod 4 (MEASURED,
deviation within class < 3.5e-9, `hd_nodes.json`). So the Z/2 factor contributes a ray-class constant and a
quadratic twist of conductor dividing 4m. It is the same in both representations of the probe.

**S4 (Hecke grade) [PROVED arithmetic, rel CLASSICAL Theorem C of h-metaplectic-spin as corrected by its
referee].** The theta Hecke reflection on the grade j = v_p(index) mod 6 is j -> 4 - j. It fixes j mod 2 and acts
on j mod 3 as j -> 1 - j, which is the cubic reflection. In coordinates (j mod 2, j mod 3): {0, 4} = (0,0), (0,1);
{1, 3} = (1,1), (1,0); 2 = (0,2) self-related; 5 = (1,2) vanishing. The Z/2 coordinate is inert. The odd sector
has the cubic pattern (classes 0 and 1 linked, class 2 vanishing); the even sector has class 2 surviving. No Hecke
relation links the two Z/2 sectors. This is the "nothing links grade 1 to grade 0" statement in Z/2 language.

## 4. Decisive test T1 (run first): Z/6 character at 1000 prime moduli

`z6char.py`, `z6char.log`, `z6char.json`. Input: exact tables `tmp/sextic/data/sf_1e6.npz` (gamma_1..3 at primes),
read-only. For each of the first 1000 split primary primes pi (norm 7..8089), all m in (O/pi)^*; Gauss functions
recomputed by FFT and compared with the table (max difference 1.1e-9). Isotypic fraction
frac_j = |mean_m f(m) conj(chi(m))^j|^2 / mean |f|^2.

| object | index j | (Z/2, Z/3) | min frac at j | max leakage |
|---|---|---|---|---|
| a = gt_1(-m, pi) (additive factor) | 5 | (1, 2) | 1.000000000000 | 6.5e-31 |
| b = gamma_2 chi(m) (row) | 1 | (1, 1) | 1.000000000000 | 2.2e-31 |
| Gram summand abs(a)^2 (exceptional term) | 0 | (0, 0) | 1.000000000000 | 9.3e-31 |
| signal summand a b (principal row) | 0 | (0, 0) | 1.000000000000 | 6.2e-31 |
| a3 = gt_2(m, pi) (cubic calibration) | 4 | (0, 1) | 1.000000000000 | 9.3e-31 |
| a3 conj(a3) (cubic Gram) | 0 | (0, 0) | 1.000000000000 | 1.7e-30 |
| a3 b (cubic factor against sextic row) | 5 | (1, 2) | 1.000000000000 | 6.4e-31 |
| a b_random (random-phase row) | none | none | 5.6e-8 | 0.35 |

Also: mu(pi) recovered from Gauss sums = -1 at all 1000 primes (error 1.7e-9); Hasse-Davenport error 3.0e-9.

Reading. Exceptional term and principal signal: both index 0, same Z/2 character. Each factor: Z/2-odd. The
criterion of the assignment ("if both carry the same Z/2 character the separation is refuted") is met. The cubic
calibration shows the test detects a mismatch when one exists: the cubic factor is Z/2-even, and paired with the
sextic row it has index 5, so that pairing sums to zero. For random-phase rows there is no isotypic structure:
the six fractions are of size 1/(p-1) each.

## 5. Test T2: Z/2 split on the modulus side (theta residue)

`z2split.py`, `z2split.log`, `z2split.json`. Table `sf_1e7.npz` (2,822,619 squarefree moduli, norm <= 1e7). For 44
indices y = y_S pi (y_S = -9; pi of norm <= 200), the X^(2/3) constant of sum_c gt_1(y, c) (the stripped theta
coefficient rho(y), the source of the exceptional term) was fitted on all moduli and on the two classes
chi_c(y)^3 = +1 and -1.

| moduli | mean z^2 over 44 indices |
|---|---|
| all | 38.6 |
| chi_c(y)^3 = +1 | 20.9 |
| chi_c(y)^3 = -1 | 20.9 |
| random half (control) | 19.8 |

Both classes are populated equally (even share 0.49997). 33 and 32 of 44 indices have z > 3 in the even and odd
class; 31 in both. Phase correlation of the two half-constants: 0.845. The difference of the halves, which equals
the first moment at index y^4, has rms 0.057 against rms 0.197 for the full constant and noise 0.032 (mean z^2
3.3). MEASURED: the theta residue sits in both Z/2 classes of moduli with the same amplitude and phase, as a random
half would; the Z/2 class of the modulus does not isolate it. Cubic calibration (exponent 5/6): 3384 / 1696 / 1688,
the same even split.

## 6. Controls

- Cubic case (Z/3 only): T1 rows `a3`, `a3 conj(a3)`, `a3 b`; T2 last line. The cubic objects are Z/2-even
  throughout, as they must be. The method reports the cubic/sextic mismatch (index 5) where there is one.
- Random-phase rows: T1 last row. No character; the j = 0 purity of the signal summand is lost.
- Sign-twisted target (Lambda(n) -> eps_n Lambda(n), completely multiplicative eps, no functional equation), DH,
  and every other target control: S1-S4, T1 and T2 do not contain the target. The target enters only through
  Psi(c) on the modulus index. So the character computation is identical for every control, which means that a
  Z/2 separation, had it existed, would not have met the requirement "fails for the controls for a structural
  reason". For the period lemma itself, the step that fails for a sign-twisted target is the reflection of the
  rows (manuscript Lemma 5.8 and (5.31)): it needs nu_sigma theta to be Hecke characters. That step is upstream
  of everything here.
- All primes together / every window: not applicable; no statement about zeros is made.

Pivot (one, as allowed): use S3' as the coupling, i.e. realise mu(c) as the constant of the cubic x quadratic x
sextic triple and ask for a period whose unfolding produces mu(c) Psi(c) automorphically. Outcome: mu(c) alpha(c) =
gamma_2(c)^3 is manuscript (4.7) and item 33 of the positive list; it is the mechanism of the 7/8 proof. The
resulting form is (2.1)/(MB) of tro6-period, where Lindelof for each fixed-modulus period does not beat
Cauchy-Schwarz. No new lever. Not pursued further.

## 7. Answer to the assignment

- First lemma: REFUTED as stated (S1). The integrand cubic theta x sextic section x eta is Z/2-odd. Corrected
  form (S3'): cubic x quadratic x sextic at the level of Gauss sums, PROVED-rel (4.7) on squarefree moduli; in
  that form "reflection" and "Poisson in the row variable" are the two sides of Lemma L / the Gram identity S3.
  A global period with these two unfoldings was not constructed: OPEN, and by S3 it would not separate the
  exceptional term.
- First decisive test: both carry the same Z/2 character (trivial on the summands, odd on each factor). Refuted.
- Statement about the P_a^(1/6) term: it is the theta residue of the Gram form of the functions a_c; the signal
  is the same Gram form contracted with mu(c) Psi(c). The Z/2 factor of Z/6 acts on both identically in each of
  the three gradings examined. The spin sign (n = 2) enters the 7/8 probe only as the ray-class constant G(c) and
  a quadratic twist of the rows.
- Renderer roadmap item (arithmetic coupling for spinor structures): this route does not supply one. The Z/2
  datum present in the probe is quadratic reciprocity over Q(omega), not a constraint on zeros.

## 8. Three weakest steps

1. S2, S3 are proved for squarefree moduli prime to m and the n = 1 part of the rows. The complete coefficient
   rho^natural includes non-squarefree moduli and moduli sharing primes with the row, and the rows have an n^3
   part with the quadratic factor chi_n(m)^3. These were not carried through. The identification of the
   manuscript's exceptional frequencies with index 0 is read from the proof of Prop 15.2, not recomputed from the
   correlation (13.6)-(13.7).
2. S1 uses the standard types (cubic theta j = +-2, sextic section j = +-1) and no global construction. No
   adelic period was written; "two unfoldings" is established only as finite Gauss-sum algebra. A different
   realisation (for example a sextic section restricted to a subgroup on which the cover splits) was not excluded.
3. T2 is a float64 least-squares fit on 44 indices with the |v| = 1 noise model, for the stripped coefficient
   rho, not rho^natural. The small non-zero difference of the halves (index y^4, mean z^2 3.3) is not explained.
   Not interval-certified.

## 9. Files

`z6char.py/.log/.json` (T1), `z2split.py/.log/.json` (T2), `hd_nodes.py/.log/.json` (S3, S3' checks).
All runs local through `scripts/memcap.sh 8`, each under 30 s. Compute server not used. Inputs read-only from
`tmp/sextic/`.
