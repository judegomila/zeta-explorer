# Proposed map entries (for the record lane; the map is not edited here)

Lane `c22-br3prime-integer-frequencies-no-growth-two-sided-almost-periodic`, round 22, deepen. Zero referees.

## Section 3: one row

| X5 | BR-3': Euler-shape rigidity with no growth clause and no pole bound (round 22; deepen) | Not decided. Proved: Lemma L (H = G/zeta analytic and bounded on the strip implies H = 1; Cauchy on rectangles); Theorem L+ / H+ (the growth clause exp(C e^(kappa t)), kappa < pi/width, is needed only on one sequence of horizontal crossings above and one below; finitely many poles allowed); Proposition E (zero-free pole-free H: an upper bound of triple exponential size on discs suffices); Lemma M and Gaussian identity (M_T) (h(n) = mean of residues of H n^s; Landau's formula relative to zeta); Proposition ART (no twin among integer-power products of Artin L-functions with finitely many arbitrary factors; orthogonality). None reads multiplicativity except ART, which is an identification in a countable class | Residue: a twin is tame (infinitely many poles of H whose residues resonate with log n on the support of h, infinitely many independent frequencies) or wild (above exp(C e^(kappa T)) on every high crossing). Sparse natural-boundary tools (Theorem W, Lemma P0) lie inside the summable class of Theorem A when abs(alpha_p) <= 1 | `c22-br3prime-integer-frequencies-no-growth-two-sided-almost-periodic` (+ REFEREE.md, author's pass) |

## Section 2 (controls): one row

| QUAD | conductor-balanced quotient (round 22): zeta(s) L(s, chi_12) L(s, chi_40)/(L(s, chi_8) L(s, chi_60)) | zeta's functional equation exactly (12 * 40 = 8 * 60; even real primitive characters); integer frequencies; Euler product; unimodular local parameters; finite order; pole at 1; geometric local factor with alpha_p = 1 at density 3/4 of the primes | the pole clause (poles at the zeros of L(chi_8) L(chi_60)); the geometric shape at density 1/4 ((1 - y)/(1 + y)^2 or (1 + y)^2/(1 - y)^3). Zeros and poles on the line under GRH: not an off-line control | kills steps that read the functional equation, integer frequencies, an Euler product with unimodular parameters and finite order without the pole clause or the shape at every prime; shows the resonance conditions of Lemma M are satisfiable at infinitely many frequencies. MEASURED: symmetry 3e-41 at four points; 569 of 2259 primes below 20000 non-geometric |

## STRATEGY.md 4.0: proposed edit

BR-3' stays open as an identification question. Replace 'no growth clause' by the sharpened residue: growth
below exp(C e^(kappa t)), kappa < pi, on a single sequence of crossings already forces G = a_1 zeta when G (or
G/zeta, or zeta/G) has finitely many poles. No further lane on BR-3' unless it uses integer frequencies
against growth on every crossing (the theta-group formulation of RESULT.md section 6) or constructs a
tame twin from Lemma M.
