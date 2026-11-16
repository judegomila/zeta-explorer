# REFEREE: tro6-period/RESULT.md

2026-11-16. Adversarial pass. Claimed verdict: precise-obstruction (no eta > 0).

**Outcome: holds = false as written (one PROVED-labelled statement is misstated); the verdict itself survives
after the correction below.** No false QED found. No RH assumption found. Nothing restates verified height.

## 1. Lemma L: CONFIRMED (independent re-derivation and independent numerics)

* Algebra re-derived: from (4.7) gamma_2^3 = mu alpha, gamma_1 gamma_2 = mu alpha G, |gamma_j| = |G| = 1 one gets
  gamma_2 = mu alpha G conj(gamma_1); for (m,c)=1, g~(m,c) = conj(chi_c(m)) gamma_1(c); for squarefree c and
  (m,c) != 1 both sides vanish. Correct.
* Independent numerics (own code, no import of tmp/sextic/zomega.py; script was /tmp/ref-tro6/chk.py):
  172 squarefree primary moduli, norm <= 12000, built from 35 primes (BOTH conjugates of split p <= 151, and
  inert -5, -11, -17), versus the author's 87 moduli / one conjugate / one inert prime.
  - (4.7) itself: |gamma_2^3 - mu alpha| <= 3.4e-13, |gamma_1 - G gamma_2^2| <= 2.0e-13 (so Lemma L is not only
    relative to the manuscript on this range).
  - L first identity: 1.1e-13. L second identity with random m (coprime and non-coprime mixed): 6.9e-12.
    Forced non-coprime vanishing: 1.2e-11.
* Novelty overclaim: the first identity is already in the manuscript verbatim
  (~/lean-deps/qrh-verify/paper.txt line 3196: "Equation (4.7) gives gamma_2(c) = mu(c) alpha(c) G(c)/gamma_1(c)").
  What is new is only the reading of gamma_2(c) chi_c(m) as a conjugate sextic Kubota coefficient. "One exact
  identity is new" should be "one reinterpretation of a manuscript identity".
* Convention note: the manuscript text prints G(c) = chi_c(4) gamma_3(c); the identity holds numerically with
  conj(chi_c(4)) (as RESULT.md and zomega use). Presumably a lost overline in the text extraction. Not an error
  in RESULT.md.

## 2. Corollary L' [labelled PROVED-rel L]: MISSTATED. Two errors.

Row (conjecture note line 93): coefficient gamma_2(c) alpha(c) nu(c) chi_c(m). Substituting Lemma L gives
mu(c) alpha(c)^2 G(c) nu(c) conj(g~(m,c)). Hence

  **Psi = alpha^2 G nu, not alpha^2 G^2 nu.**

(a) G^2 != G: measured values of G on the 172 moduli are nine distinct 12th roots of unity.
(b) **G is not multiplicative.** Measured: G(c1 c2) != G(c1) G(c2) on 78 of 137 composite moduli; the defect is
    exactly +-1; G^2 is multiplicative on all 137. This is manuscript (4.5): G(vw) = G(v) G(w) R(v,w), a quadratic
    refinement of the sextic-reciprocity bicharacter R. G is a function of c mod 4 (measured: constant on each of
    the 12 classes), not a character.

Consequences for statements downstream (all SKETCH/HEURISTIC in the note, but they are quoted in the verdict):
* "mu(c) Psi(c) = coefficients of 1/L(s, Psi)" (sections 3.3, 6) is false as stated. Correct form: expand
  G = Sum_psi g^(psi) psi over the <= 12 characters of (O/4)^x; then mu Psi = Sum_psi g^(psi) mu (alpha^2 nu psi),
  and B^0 is a finite combination of 1/L^S(s, alpha^2 nu psi). The poles are zeros of up to 12 twists of the
  target, not of one L-function. (Or keep the manuscript's nu_sigma = eta Xi^{-1} R(., s_sigma) bookkeeping, which
  was built to absorb R; the note does not do this.)
* Section 3.3 splits Psi(c) = Psi(delta) Psi(c') for c = delta c'. With G this produces an extra R(delta, c'),
  which couples the two variables through their classes mod 4. Removable by fixing classes (finite cost), but
  (3.2) and (MB) need a class restriction or a bicharacter factor that is absent.
* The typo G^2 is not harmless: G^2 IS multiplicative, so the note's claim reads as true for the wrong weight.

The n^3 part of the rows is SKETCH and its weight q_n^{-1-3t} is absolutely convergent only for Re t > 0.
The summary sentence "the theta-row form is Sum_c mu(c) Psi(c) a_c P_c" is established only for the n = 1 part
and only with the corrected Psi.

## 3. Proposition 4.1 [PROVED, bookkeeping]: CONFIRMED as a conditional implication

Exponents rechecked: Sum_{c~C} C^{-1/2} Q^{1/2} = C^{1/2} Q^{1/2}; at C = Q^{1.4} this is Q^{1.2} vs Cauchy-Schwarz Q.
Dual: X = C^2/Q = Q^{1.8}, A = Q^{1.4} = X^{7/9}; target X Q/C = X^{7/9}, saving X^{2/9}. Dunn Prop 1.6 transposed:
(AX)^{1/3} A^{1/2} = X^{53/54}, saving X^{1/54}. Arithmetic correct. Dunn's paper exists with the cited reference and
content (arXiv:2403.13151 abstract checked); Thm 1.5 / Prop 1.6 statements not re-read line by line.

Caveats:
* The proposition proves only that the triangle inequality over c fails. That is expected: it discards mu(c).
  It is not evidence about methods that keep the c-sum.
* It depends on C >= Q^{1-eps} and the toy ratio 1.4, neither verified against the manuscript (note's weakest step 2).
* The dual form is lossy before anything is tried: Cauchy-Schwarz in the dual gives A B^{1/2} = Q^{1.6}, i.e. Q^{1.2}
  in original units, already Q^{0.2} worse than the original Cauchy-Schwarz bound (which uses Lemma 15.1, a mean
  square over rows that already exploits the c-sum). So of the "X^{2/9} needed", X^{1/9} is plain Cauchy-Schwarz in
  delta and a further X^{1/9} is needed only to get back to the starting line. The comparison "needs X^{2/9}, Dunn
  gives X^{1/54}" is measured from the trivial bound of a weaker formulation and overstates the distance. The honest
  statement of the gap is the undualised one: any power below ||a|| (Sum |P_c|^2)^{1/2}.

## 4. Obstruction: real, or a weak attempt?

Real at the level of Theorem D of the proof note (TRO6 is equivalent to an improved zero-free region, so no
target-blind bound can give it). The new content here is a reformulation, not a new barrier. The Lindelof count
is a weak test. One way around that the note names but does not test:

* Heath-Brown/Vaughan decomposition of mu(delta) psi(delta). Type-I pieces: the smooth variable b of delta = ab
  merges with m', giving Sum_n (psi * 1)-weighted rho~(a n): a Rankin-Selberg object (theta_6 x Eisenstein) in the
  level-a aspect, where the continuation of section 3.1 can give a real power saving for a up to some level.
  Type-II pieces: a Dunn-type bilinear large sieve with kernel rho~_6(delta m'). The decisive question is the
  admissible Type-I level versus the Type-II range at A = X^{7/9}. This must be done in the ORIGINAL normalisation
  (target: any power below Cauchy-Schwarz), not against X^{2/9}. It is not ruled out by anything in the note.
  It cannot be target-blind in the end (Theorem D), and the multiplicative structure enters exactly in the
  decomposition, so it is consistent with the DH wall.

## 5. DH control

No positive argument is made, so nothing needs to fail for DH. The stated control is acceptable with two fixes:
(i) the mu(c) of Lemma L comes from the Gauss-sum cube gamma_2^3 = mu alpha, not from 1/L of the target; the target
enters only through nu. The identification with 1/L coefficients is by construction of the manuscript's rows.
(ii) because G is not a character, "coefficients of 1/L(s, Psi_theta)" must read "finite combination over
characters mod 4 of coefficients of 1/L(s, alpha^2 nu psi)".
Remark 4.2 stays HEURISTIC (unproved lower bound for Sum |S_delta|^2).

## 6. RH / verified height / flow

No step assumes RH or GRH. No finite certificate. Lindelof appears only as a hypothetical input in Prop 4.1.

## 7. Surviving claim

Lemma L holds (confirmed on 172 independent moduli; first identity already in the manuscript). On the n = 1 part of
the rows, the theta-row form equals Sum_c mu(c) alpha(c)^2 G(c) nu(c) a_c P_c with P_c = Sum_m b(m) rho(m)
conj(g~(m,c)), where G is a mod-4 class function satisfying G(vw) = G(v)G(w)R(v,w), not a character. Termwise
Lindelof-strength bounds for P_c give C^{1/2} Q^{1/2}, not below Cauchy-Schwarz when C >= Q. Period/dual formulas
(3.1), (3.2) and (MB) are SKETCH and need the R(delta, c') factor. No eta > 0. Precise obstruction stands as a
reformulation of TRO6; the quantitative gap "X^{2/9} vs X^{1/54}" is not a fair measure.
