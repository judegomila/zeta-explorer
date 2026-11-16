# REFEREE: tro6-shifted-conv/RESULT.md

2026-11-16. Adversarial referee pass. Only this file was written.

**Outcome: holds = false as written (one PROVED step is wrong in its stated form, one PROVED step has the wrong
witness). Both are repairable and the verdict "precise obstruction, no eta > 0 proved" survives. No false QED found.
Nothing assumes RH; nothing restates verified height.**

Checked against: `formalization/paper/sextic-theta-conjecture.md` sections 0-2, `sextic-theta-proof.md` (index of
Theorems A-D, 7.2), manuscript `~/lean-deps/qrh-verify/paper.txt` section 15.1 (A = c n^3, weight, Lemma 15.1),
Lemma 4.6 (Gaussian), Lemma 9.1, (5.26), Prop 5.1 item 3, Cor 14.1, (14.5).

## 1. Exponent ledger: confirmed [arithmetic re-derived]

Units: conjecture note 2.1 saving Z^{-eta b/12}, b = 1/8, so Z^{-eta/96}. Q = Z^{5/6-2d}, R = Z^{1+l'} = Z^{7/6-d}
(manuscript proof of Lemma 15.1: r = q_A / Z^{1+l'}). eta = -96 * log_Z(bound / Q^{1/2}).

| row | re-derivation | result |
|---|---|---|
| CS | Q^{1/2}, Q^{11/12} = Z^{55/72} at d=0 | 0, ok |
| U1 | (RQ)^{2/3} = Z^{4/3-2d} >= R iff d <= 1/6; (2/3-d) - (5/12-d) = 1/4 | -24, ok |
| U2 | (7/12-d/2) - (5/12-d) = 1/6 + d/2 | -16-48d, ok |
| U3 | (7/6-d) - (5/12-d) = 3/4 | -72, ok |
| R1 | D_a = Q^2 Z^{2a}/R = Z^{1/2-3d+2a}; D_a <= Q iff a <= 1/6 + d/2; with a <= 1/6-d equality only at (1/6,0) | 0, ok |
| SC | D^2 = Z vs Q = Z^{5/6}: Z^{1/12}; D_a^2 <= Q iff a <= d - 1/24 | -8, ok |
| R2 | (D/Q)^{1/2} = Z^{-1/6-d/2} | +16+48d, ok |
| random | Q^{-1/2} = Z^{-5/12} | +40, ok |
| (PS-U) | Q^{-delta/2} = Z^{-40 delta/96}; 0.0107/40 = 2.7e-4 | ok |

Margins: 49/440640 * 96 = 0.01068; 2.2815e-4 * 96 = 0.0219. ok.
The kernel argument q_mu X / q_c^2 with c = c_F r, r = product of active primes (Cor 14.1) matches the D_a used.
The ledger rows are upper bounds from named sieves; they are PROVED-rel as labelled. Not re-derived: the trilinear
display of 2.2 line by line (the author's own weakest step 1; the q_p^{-1/2} per active row prime in B_p is not
visible in the display and is presumably absorbed in normalisation; unverified).

## 2. Lemma N(i): the stated proof is wrong; a weaker statement holds

**Error.** A = c n^3 with c squarefree and n arbitrary (manuscript 15.1), and chi_A(m) = chi_c(m) chi_n(m)^3 with
zero extensions. Its period is rad(cn), not A. The congruence that controls off-diagonal terms is
m1 = m2 mod rad(cn), and N(rad(cn)) <= N(c) N(n) can be far below N(A) = N(c) N(n)^3. The step
"if N(A) > 4CQ then m1 = m2" is therefore false for indices with a large cube part, and the conclusion
"every shifted sum is empty up to a superpolynomially small weight" is false.

**Size of the exceptional stratum.** Take N(A) ~ R (the Gaussian in log r of width O(1), Lemma 4.6, does give
exp(-c log^2 Z) outside | log_Z r | <= kappa: that part of the claim is right). Conductor <= 4CQ needs
N(n)^3 >= (R/4CQ) N(rad n), so N(n) >= Z^{1/9+d/3} at least (N(n) >= Z^{1/6+d/2} for squarefree n prime to c).
With weight N(c)^{-1/2} N(n)^{-1}, the l2 mass of the stratum is <= Z^{-1/9-d/3+eps}: power-small, not
exp(-c log^2 Z). On it the coupling contains a quadratic character of modulus n with N(n) <= R^{1/3} = Z^{7/18} < Q,
so genuine shifts m1 = m2 + h f exist.

**Repair.** Lemma N(i) should read: outside a stratum of l2 weight <= Z^{-1/9-d/3+eps} the congruence has only
the diagonal solution; on the stratum there is one character per modulus (same situation as N(ii), second
reading), and Cauchy-Schwarz plus the quadratic sieve already bounds its contribution by
Z^{-1/18-d/6+eps} Q^{1/2} ||rho||. The ledger and the verdict do not change; the needed saving is Z^{-eta/96} with
eta ~ 0.01, far smaller than the stratum's exponent, so the stratum is irrelevant for TRO6 in either direction.
The sentence "TRO6 contains no shifted-convolution problem" must be weakened to "none on the bulk; on a
power-small stratum the shifts exist but the stratum is already below target".

Lemma N(ii): confirmed for squarefree residual rows in a dyadic row range (N(mu1-mu2) <= 4 D_a < N(m) needs
D_a <= c Q, so "O(1) shifts" applies in a constant-width neighbourhood of the corner, not only at equality; and
rows with N(m) << Q need the dyadic split the manuscript already makes). Minor.

## 3. Saturation: claim true, witness wrong

The stated witness Phi = w (mu0/.)_2 saturates the intermediate inequality sum_mu |U(mu)|^2 <= (Q + D) ||Phi||^2.
It does not by itself saturate the form sum_mu delta(mu) U(mu): the form at this Phi is about delta(mu0) Q, which
equals the Cauchy-Schwarz size only if |delta(mu0)| is of order 1 (true for bounded mu0 with d(mu0) != 0; not
checked in RESULT.md). The correct one-line proof: the form is linear in Phi with kernel B^J_m, so
Phi = conj(B^J) gives equality in Cauchy-Schwarz relative to ||Phi|| ||B^J||_Q, which is the conjecture's own
normalisation (note 2.1). With that witness, "eta = 0 is the cap for every bound uniform in Phi at fixed l2
norm" is PROVED. Extension to mean-square at all scales, Rankin-Selberg in progressions and sup bounds: any
constraint on |Phi(m)| alone is satisfied by |Phi| times the phase of conj(B^J); then the form is
sum |Phi| |B^J|, which equals the C-S size up to the flatness of |Phi| |B^J|. So the extension holds up to that
flatness factor; it is asserted, not proved, in RESULT.md. Label should be PROVED for l2, HEURISTIC for the rest.

Non sequitur in section 6: "a target-blind bound is capped at eta = 0 by the saturation statement". Saturation
varies Phi, not the target. On the a = 0 branches the target enters only through fixed-modulus class functions
(RESULT 2.2), so (PS-U) is itself target-blind and is not capped by anything proved here.

## 4. Measurement: reproduced, with different test cases

Rerun inline (no files written), `.venv-arb` python, same data:

| rows | twists | z = g1 g3: mean r^2 / max r | z = 1: mean r^2 / max r | null max: median / 99% |
|---|---|---|---|---|
| N <= 796 (228) | 44 primes N <= 200 + mu=1, seed 7 | 0.872 / 2.42 | 1.778 / 7.36 | 2.35 / 3.27 |
| N <= 796 (228) | 33 primes 200 < N <= 400 + mu=1 | 0.746 / 2.13 | 1.882 / 7.36 | 2.23 / 2.91 |
| N <= 400 (109) | 44 primes N <= 200 + mu=1 | 0.987 / 2.26 | 1.307 / 5.64 | 2.31 / 3.00 |
| 400 < N <= 796 (119) | 33 primes 200 < N <= 400 + mu=1 | 0.780 / 2.10 | 1.600 / 5.45 | 2.30 / 3.08 |

The published numbers reproduce exactly on the original case. Additional reading the RESULT does not give:
the excess for z = 1 and z = gamma_3 is carried entirely by the single statistic mu = 1 (z = 1: mean r^2 over
classes 32.9 at mu = 1; with mu = 1 removed the prime twists are at null level). For the zeta-shaped proxy
g1 g3 the mu = 1 statistic is 0.19 (max 0.71). The MEASURED label and the "no exponent readable" caveat are
correct. The max r = 3.20 for g1 g2 exceeds the stated 99% null (3.11) but the null 99% itself moves between
2.9 and 3.3 with seed, so this is not significant. Not checked: that `node_exponents` parity equals (mu/m)_2
(values are +1/-1 balanced, 2% zeros).

## 5. DH control

The ledger proves no saving, so the DH wall is not tested: every bound holds for arbitrary bounded b. Correct
as stated, and the statement that a positive result must use tau(P) = product of eta(p_i) is consistent with
the manuscript. One imprecision: the form is multilinear in the values eta(p_i), not linear in the target, so
"holds for a DH combination of two targets" should read "holds for arbitrary bounded row coefficients". No step
uses the Euler product, which is the expected outcome for an obstruction note.

## 6. Is the obstruction real or an artifact of a weak attempt?

Real for the method class as defined (bounds uniform in Phi), but it is the weak form: C-S is sharp against an
adversarial Phi. The actual content is the unproved assertion in section 4 that no transformation formula
exists for Phi(m) = rho^nat(-e0 m) zeta_m. That is HEURISTIC, not PROVED, and the RESULT labels it so.

One way around that the note does not examine: (PS-U) on the a = 0 branches is a target-independent statement.
Opening sum_{mu} |U(mu)|^2 over all mu with a smooth weight and applying Poisson in mu (modulus m1 m2, length D,
dual length Q^2/D) gives the diagonal D ||Phi||^2 (already the R2 level, eta = +16) plus a dual sum whose
square-frequency terms are first moments sum_m Phi(m) eps(m) (k/m)_2. The Q ||Phi||^2 term of the large sieve
comes only from these. So (PS-U) reduces to a power saving for the twisted first moments of Phi at
square frequencies, a concrete statement about the double Dirichlet series in (m, mu) attached to the sextic
theta function, and the measured mu = 1 statistic for the zeta-shaped proxy (0.19, section 4 above) is the
relevant small-scale datum. This is not a proof route (the first moment of Phi needs the same missing
functional equation), but it is a sharper target than (PS-U) and it is where an A2-type multiple Dirichlet
series or a Chinta-Friedberg-Hoffstein relation for rho^2 would enter. Also unexamined: the relative weight of
a = 0 versus active branches in the aggregated form; by proof-note Theorem D the aggregated TRO6 is equivalent
to the zero-free region, so a target-blind gain on a = 0 alone cannot be the whole statement.

## 7. Surviving claim

No eta > 0 proved. Ledger exponents (-8, -24, -16-48d, -72, 0, +16+48d hypothetical, +40 ceiling) correct
relative to the cited sieves. Bounds uniform in Phi at fixed l2 norm are capped at eta = 0 (witness conj(B^J)).
Lemma N holds on the bulk only; the exceptional stratum has power-small weight Z^{-1/9-d/3}, not
superpolynomially small. (PS-U) and the active-branch prime sum remain OPEN.
