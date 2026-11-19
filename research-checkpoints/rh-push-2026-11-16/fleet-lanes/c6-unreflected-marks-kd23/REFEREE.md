# REFEREE: c6-unreflected-marks-kd23 (lens: general)

Date 2026-11-18. Object: `RESULT.md` in this directory. Claimed verdict: precise-obstruction. Claimed flags: all false.

**Referee verdict: does not hold as stated.** The measurement and the two finite identities are confirmed. Two
headline sentences are not supported by the text: "no consistent model vertex with h > 1" (E1) and the necessity
statement Lemma D(b) (E2). A narrower claim survives (last section). No statement about zeros of zeta is made in the
result, nothing assumes RH for a claimed conclusion (GRH enters only as a labelled hypothesis), verified height is
not used, and no known theorem is presented as new.

## What was re-derived and re-run

Referee scripts were kept outside the lane (`/tmp/ref_c6/`); all runs through `scripts/memcap.sh 8`, local, no server use.

1. **Step 1 (kernel factorisation), re-derived by hand.** CRT v = v_1 c' + v_2 c gives
   chi_c(c') conj(chi_c'(c)) g(chi_c; k) g(conj chi_c'; k); primitivity of chi_c at each prime of squarefree c gives
   g(chi_c; k) = conj(chi_c(k)) g(chi_c) and zero for (k, c) != 1; g(conj chi_c') = chi_c'(-1) conj(g(chi_c')).
   The stated formula follows. CONFIRMED.
   Rerun on a different case: primes 43, 61, 67, 73, 79, 97 (both conjugates), inert 11, composites including a
   three-prime modulus, frequencies (3,1), (5,2), (-1,6), (7,7), (0,1), including frequencies not coprime to c c':
   1140 triples, max deviation 5.2e-13; the non-coprime cases vanish; eps is +1 or -1 in every case and takes one
   value per pair of classes mod 4 (no class pair with two values in the sample); eps(sigma, sigma) = +1 on the
   five diagonal class pairs that occurred.
2. **Section 1 structure identity** gamma_2 chi = [gamma_2 conj(chi)^2] chi^3: trivial, CONFIRMED.
3. **Step 2 (Hasse-Davenport).** Re-derived from g(chi) g(chi psi) = conj(chi(4)) g(chi^2) g(psi), psi quadratic,
   chi sextic: gamma_1 conj(gamma_2) = conj(chi(4)) gamma_2 gamma_3, hence gamma_1 gamma_2 = conj(chi(4)) gamma_3 gamma_2^3
   = mu alpha conj(chi_c(4)) gamma_3. Brute force on 19 moduli (referee set): gamma_2^3 = mu alpha to 1e-13;
   gamma_1 gamma_2 = mu alpha **conj(chi_c(4))** gamma_3 exactly; the form with chi_c(4) written in RESULT and in
   manuscript (4.7) fails by 1.732 whenever chi_c(4) != 1 in the conventions of `zomega.py`. `dual_check.py`
   takes the minimum of the two deviations, so its log does not show this. See E4. The consequence used by
   Lemma D (dual coefficient = Moebius times a unimodular class-multiplicative factor) is unaffected. CONFIRMED
   up to the conjugate.
   The same derivation gives gamma_1 conj(gamma_2) = (unit) gamma_2: the remark of 4.4 on `thc` is correct.
4. **Table and symbol code.** 60 random nodes of `sf_1e6.npz` (N(c) <= 3000): node norms reconstruct; gamma_1,
   gamma_2 agree with brute-force Gauss sums on 33 nodes (9e-10); `Tab.exps` agrees with `zomega.chi_composite`
   on 360 (node, row) pairs, 0 mismatches.
5. **Measurement rerun with a different case** (`msq.py`, D = 2e4 and 2e5, aspects e = 1.1 and 1.4, seed 4242,
   1200 rows; none of these D, e, seed occur in the lane):

   | D | e | th | thm4 | thm2 | rnd | c2c | s1c |
   |---|---|---|---|---|---|---|---|
   | 2e4 | 1.1 | 0.957 | 0.869 | 0.918 | 0.937 | 2.300 | 1.356 |
   | 2e5 | 1.1 | 1.007 | 0.881 | 0.928 | 0.931 | 3.623 | 1.406 |
   | 2e4 | 1.4 | 0.964 | 0.867 | 0.950 | 1.004 | 1.438 | 1.059 |
   | 2e5 | 1.4 | 0.956 | 0.963 | 0.907 | 0.933 | 1.560 | 1.115 |

   Theta rows at the random level. Cubic control excess over rnd at e = 1.1: 1.363 -> 2.692 per decade, exponent
   0.296 (prediction (2 - e)/3 = 0.300). CONFIRMED at these sizes.
6. **Numbers quoted in the verdict against the tables/logs.** Range 0.84 to 1.01, exponents within 0.025
   (largest theta-row entry in range: tham4, e = 2, +0.022 +- 0.009), 0.340 +- 0.005 and 0.153 +- 0.012, LP values
   0.8125 / 0.6458 / 0.3125 (`ledger_dirz.log`): all match. Manuscript (4.7) is quoted as printed (paper.txt line 814).
7. **Lemma D(a), exponent count.** (K/D) x (D^2/K frequencies) x D^(2 theta - 1) = D^(2 theta); a zero-free
   half-plane gives 1/L << (q(1+|t|))^eps to its right (classical). Arithmetic correct; the statement is an
   outline (as labelled). Consistency test done by the referee: the same dual form applied to `thc`
   (dual coefficients cubic Gauss sums, frequencies k = r^2 a^6, residue size N(r)^(-1/6)) predicts excess
   (D/K)^(1/3): order 1 at e = 1 and D^(1/6) at e = 0.5. Lane data: thc flat at e >= 0.75, growing at e = 0.5
   (fit 0.25 +- 0.11). Consistent.
8. **Lemma D(b), exponent arithmetic.** |M_1|^2 << D (K/D^2)^(1/6) gives beta <= 1 - (2 - e)/12. Arithmetic correct;
   the positivity step is not (E2).

## Errors

**E1 (headline; logic). "No consistent model vertex with h > 1" is not shown.** Proposition E works on the cone
(t, t, t + 2 + d), where h = 1 - lx + l = 3 + d > 3 and the model returns B < 1/2. For 1 < h <= 3 the
uncompensated model returns B = 1 - h/6 in [1/2, 5/6), e.g. 4/5 at (7/5, 7/5, 8/5). A zero-free region
Re s > B with B >= 1/2 contradicts nothing under GRH, so Theorem B of c5 gives no inconsistency there. Section 3
says this itself ("false for h > 3 under GRH ... and underived for 1 < h <= 3"). Verdict item 4 ("there is no
model vertex with h > 1 whose unproved inputs are all consistent with GRH"), section 7 row R4 and the proposed
map row Z15c go further than section 3. What is shown: under the hypotheses of Proposition E, the uncompensated
branch is not valid as a statement for all geometries lx < l, because it fails for h > 3. Its validity for
1 < h <= 3 is open in this lane. With the sieve input supported (measured; GRH-conditional), the vertices with
1 < h <= 3 are model vertices with one named underived input (the uncompensated branch). Whether that meets or
fails the score criterion of the assignment is a matter of reading; "not met because the branch is false" is not
established for those vertices.

**E2 (Lemma D(b); the necessity statement is not established).** The text says: Omega^ >= 0 and eps(sigma, sigma) = +1
make every dual term non-negative. After Poisson the weight at frequency k is F(q_k K / (q_c q_c')), a function
of the product q_c q_c'. For fixed k the form sum_{c,c'} beta_c conj(beta_c') F(q_k K/(q_c q_c')) is non-negative for all
beta only if w -> F(q_k K e^(-w)) is a positive mixture of real exponentials (kernel g(u + v), u = log q_c), hence
log-convex; a transform F that is bounded at 0 and decays at infinity gives a bounded increasing function of w,
which cannot be log-convex unless constant. Separating c and c' by Mellin replaces |M_k|^2 by M_k(t) conj(M_k(t'))
type products without sign. So non-negativity of Omega^ does not make the individual frequencies non-negative,
and the non-sixth-power frequencies cannot be dropped as stated. What can be said: summing the sixth-power
frequencies k = a^6 over a first gives (q_c q_c'/K)^(1/6) times a constant, which is separable, so that block is a
square up to the coprimality conditions and a secondary term; the remaining frequencies are not sign-definite
and bounding them needs the bounds on M_u that are in question. Further gaps: the class restriction turns
M_{1,sigma} into a combination of 1/L(s, xi_1 psi) over ray characters psi mod 4, so the conclusion concerns that
finite set, not xi_1 alone; "for all large D" is needed to pass to analyticity. Status of (b): plausible, OPEN.
The sentences "a K bound at aspect e needs zero-free Re s > 1 - (2 - e)/12" (claim), "an unconditional proof by a
norm inequality alone is not possible" (section 6) and the 11/12 comparison rest on (b) and are not established.

**E3 (verdict item 3; a hypothesis is dropped).** "Without GRH the same conclusion holds in the weaker form: the
uncompensated branch, or the density hypothesis, or Lindelof on the classes." Without GRH the sieve input (dir0,
or dirZ(theta)) is not proved either: it is measured on a reduced row and argued from a zero-free hypothesis for
F. Section 3 lists the correct four-way alternative (including GRH for F). The LP row at theta = 7/8 does not
repair this: a zero-free half-plane 7/8 for every member of F is not known (the manuscript is unrefereed and,
as the result says, membership of F in its family was not checked). "The sieve is not the false input" holds
only under GRH for F plus the unwritten Step 3.

**E4 (Step 2 as written; check masked).** In the code conventions the identity is gamma_1 gamma_2 =
mu alpha conj(chi_c(4)) gamma_3. `dual_check.py` accepts either chi_c(4) or its conjugate (min of the two), and the
log line reports agreement with "G" without saying which. Either the manuscript's (4.7) uses a different
convention for chi or e(.), or (4.7) has a conjugate missing; the lane did not determine which. No effect on
Lemma D (G stays a unimodular class-multiplicative factor), but "CHECKED" should name the form that was checked.

**E5 (section 4.5; description does not match the lane's own data).** (i) "rows m = j^2 carry one [a pole] for the
conjugate sign (thc)": the tables show `th` elevated on square rows as well (11.6, 2.9, 5.3, 17.4, 7.6 at e = 1;
th = 10.67 on squares at D = 3e4, e = 0.75), as expected: gamma_2(c) chi_c(j)^2 is a cubic Gauss sum of index
j^2. The square family then contributes about K^(1/3) D^(2/3) with a small constant for `th`: share of order
1e-3 to 2e-2 at K = D with no clear decay in D. It is below K for K >= D, so the K + D reading stands, but
"no pole on squares for th" is wrong. (ii) "In Lemma D this is the statement that the principal character
alpha^2 G nu is not of finite order": the structured-row table shows `tha` = gamma_2 conj(alpha), whose principal
dual character is G (finite order). `thA` (the manuscript convention, alpha^2 G) is not tabulated in 4.5; the
referee read it from `msq2_D*.json`: thA is at or below the random level on sq, cube, fourth rows at
D = 1e5, 1e6, 1e7 (e.g. D = 1e7: 1.03 / 0.94 / 0.01 at e = 1). The data support the conclusion; the stated
reason does not apply to the tabulated weight.

## Limits of the measured claim (not errors; they bound the surviving claim)

* Reduced row only: n = 1, nu trivial, a_p = 1 or random signs, sin^2 column weight. The completed row (5.30)
  with cube completion and a_p = eta(p) W was not measured.
* Random-row sample of 1500 to 2000 per point: a (KD)^(2/3)-size term carried by rows of density below about
  1e-3 is visible only through the three structured families. The total over all rows rests on Lemma D
  (outline), not on the sample.
* Marked rows with marks at D^(1/4): fitted exponents are positive at 2 to 3 standard errors in most columns
  (+0.005 to +0.022). The saturation explanation is reasonable (rho stays below the random level) and is not
  tested beyond D = 1e7. "Within 0.025 of zero" is accurate; "no term" for the marked rows means "no power above
  about 0.02 at D <= 1e7".
* Random rows are flat as well, as the result states: the measurement does not separate theta rows from random
  vectors; it separates both from the Gauss-sum-aligned controls.
* Proposition E depends on Theorem B of `c5-marks-circularity-order2` (one referee; relative to transcribed
  (S), (H)), on GRH for F and the row family, and on Step 3 for the completed marked row, none re-derived here.

## Controls

No zeta-only mechanism is claimed, so no control has to fail. The reading in section 5 is correct: Lemma D is
linear in the target and holds term by term for a Davenport-Heilbronn combination and for a completely
multiplicative unimodular twist (with theta at least the abscissa of its zeros). The controls internal to the
measurement (cubic and sextic pole weights, random phases, Moebius) were rerun in part (item 5) and behave as
reported.

## Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | a multiplicative identity is used in Lemma D, but no attack and no statement about zeros is built on it; the measured property is shared by random vectors |
| R2 | false | no conclusion about zeros |
| R3 | false | nothing fails for the controls; Lemma D holds for them |
| R4 | false | no passage to the critical line; no vertex is derived |

## Surviving claim

MEASURED (reproduced at independent sizes, aspects and seed): for the reduced theta rows (n = 1, nu trivial),
unmarked and with marks at D^(1/4) or D^(1/2), with or without the angular factor, the mean square over a random
sample of rows K < q_m <= 2K, K = D^e, 1 <= e <= 2, D <= 1e7, divided by the coefficient norm, stays between 0.84
and 1.01 with fitted exponent in D within 0.025 of zero, while the cubic and sextic Gauss-sum controls grow with
exponents 0.340 and 0.153 at e = 1 (predicted 1/3, 1/6). PROVED/CHECKED: the dual kernel factorises with a sign
eps depending on the classes mod 4, and gamma_1 gamma_2 = mu alpha times a unimodular factor (conj(chi_c(4)) gamma_3 in the
code conventions). ARGUED (outline, not written out): row energy = K N + (K/D) times a sum of products of
reciprocal Hecke L-sums; a zero-free half-plane Re s > theta for the family F gives K + D^(2 theta). CONDITIONAL
(GRH for F and the row family, Theorem B of c5, the transcribed model): the uncompensated branch of the reduced
model is not valid for h > 3. Not established: the necessity statement Lemma D(b); any statement about the
vertices with 1 < h <= 3; the three-way alternative without GRH. No statement about zeros of zeta.
