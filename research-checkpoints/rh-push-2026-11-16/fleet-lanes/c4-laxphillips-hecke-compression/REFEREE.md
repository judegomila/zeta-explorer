# REFEREE (lens: general) for c4-laxphillips-hecke-compression/RESULT.md

Date: 2026-11-18. Claimed verdict: precise-obstruction. Claimed flags: R1 = R2 = R3 = R4 = false.

## Outcome

**The verdict holds.** Every PROVED step was re-derived and is correct, with four wording or
completeness corrections listed below; none changes a conclusion. The numerics were reproduced and
extended to different cases. Nothing assumes RH, restates verified height, or contains a statement
about zeros of zeta. Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false.

## Re-derivation of the PROVED steps

**Lemma 1 (confirmed).** `Delta E(., 1/2+ir) = -(1/4 + r^2) E`, so `L = -r^2`, `A = [[0,1],[L,0]]`
has `A^2 = L`, and `U(t) + U(-t) = 2 cosh(tA) = 2 cos(rt) I` on both components.
`T_p E(., s) = (p^(s-1/2) + p^(1/2-s)) E(., s)` with the `p^(-1/2)` normalisation. The identity is
correct. It is a restatement of a classical fact (the Hecke eigenvalue of an Eisenstein series is a
function of its spectral parameter); the result labels it that way and does not present it as new.

**Zero-mode action (confirmed).** The zero Fourier mode of `T_p f` is
`p^(-1/2) a_0(py) + p^(1/2) a_0(y/p)` exactly (the sum over b keeps the modes n = 0 mod p; n = 0
contributes `p a_0(y/p)`). In `r = log y` with the L^2(dr) normalisation this is
`tau_(log p) + tau_(-log p)`.

**Lemma 2 (confirmed relative to the classical identification).** `P_K T_p P_K = Z(log p) + Z(log p)^*`
follows from Lemma 1 and `U(-t) = U(t)^*`. The window-defect formula in (b) was recomputed:
with `psi = c y^(1-s) 1_(y>a)`, `psi_p - lambda_p psi = c y^(1-s) [p^(1/2-s) 1_(a/p<y<a) - p^(s-1/2) 1_(a<y<ap)]`.
The second piece is outgoing data supported in `y > a` (the solution `e^(mu t) y^(1/2-mu)` is a
function of `t - log y`), so `P_K` removes it and the stated formula follows.
(c) is the triangle inequality for a contraction and its adjoint.

**Section 2 (confirmed).** `s = 1/2 - iz` sends the zeros `s = 1 - rho/2` of phi to
`z = gamma/2 + i(1-beta)/2`; `i z_j = mu_j`. The Szego kernel at `z_j` lies in `H^2 - S H^2` iff
`S(z_j) = 0`; `Z(t)^* e_j = exp(-i conj(z_j) t) e_j` with modulus `p^(-(1-beta)/2) < 1`;
`G_jk = 2 pi i/(z_j - conj z_k)` by residues, `G_jj = pi/Im z_j > 0`; the form of `Z + Z^*` on V is
`G D + D^H G`.

**Lemma 3 (confirmed, wording corrected).** Admissibility: `|psi|^2 y^(-2w-2) = y^(-beta-2w)`,
integrable iff `w > (1-beta)/2`. Conjugated action: `p^w tau_(-log p) + p^(-w) tau_(log p)`, norm
`p^w + p^(-w)` on L^2(dr). Correction 1: only the lower bound `||T_p||_w >= p^w + p^(-w)` is proved,
and for a single p the inequality `|p^mu + p^(-mu)| <= p^w + p^(-w)` is not equivalent to
`|Re mu| <= w` (the phase `gamma log p` enters). The sentence "reads `|Re mu| <= w`" is loose. The
chain actually needed is: admissible => `|Re mu| < w` => `|lambda_p| <= p^|Re mu| + p^(-|Re mu|) < p^w + p^(-w) <= ||T_p||_w`.
That chain is valid, so the conclusion (the bound is implied by admissibility) stands.

**Lemma 4 (confirmed, one step supplied).** (i) and (ii) are immediate. Correction 2: the "only if"
direction of the final equivalence is not argued. It holds: `|p^mu + p^(-mu)|^2 = p^(2a) + p^(-2a) + 2 cos(gamma log p)`
with `a = |Re mu|`, against `p^(2 theta) + p^(-2 theta) + 2`; if `a > theta` the difference
`p^(2a) - p^(2 theta)` exceeds 4 for large p. The equivalence needs all (or all large) p, not one.

**Lemma 5 (confirmed).** `Im(p^mu + p^(-mu)) = 2 sinh(Re mu log p) sin(Im mu log p)`; two vanishing
sines with `Im mu != 0` give `log 2/log 3` rational. The content is "a symmetric operator for a
positive form has real eigenvalues"; it is correct and elementary.

## Numerical rerun (different cases)

Independent script (own construction of G, H and the contraction check), mpmath 60 digits, run through
`scripts/memcap.sh 8`, under one minute.

- Reproduced: zeta, N = 10, p = 2: range [-1.518092, +1.655222] (file: -1.5180923, +1.6552225).
- Reproduced maxima of true eigenvalues: 2.006130 (p = 2, N = 20), 2.143622 (p = 5, N = 30),
  2.530506 (beta = 0.1, p = 5), 1.976877 (beta = 0.9, p = 2). Largest endpoint over the 60 rows of
  `model_range.json` is 1.9218.
- New cases, p = 7 and 11 (not in the result):

| configuration | dim | p | range of compression | max abs lambda_p | norm^2 of Z_p^* on V |
|---|---|---|---|---|---|
| zeta, N = 14 | 28 | 7 | [-1.4737, +1.2906] | 2.0898 | 1.000000 |
| zeta, N = 14 | 28 | 11 | [-1.3901, +1.2096] | 2.3701 | 0.999999 |
| all beta = 0.3 | 28 | 7 | [-1.4240, +1.2523] | 2.3461 | 1.000000 |
| zeta(s+a) zeta(s-a), a = 0.35 (beta = 0.15 / 0.85) | 56 | 7 | [-1.8278, +1.6662] | 2.6006 | 1.000000 |
| zeta(s+a) zeta(s-a), a = 0.35 | 56 | 11 | [-1.9093, +1.8869] | 3.1315 | 1.000000 |
| all beta = 0.02 | 28 | 11 | [-1.2227, +1.0786] | 3.5468 | 0.999998 |
| ordinates 3k+1 (not zeta), beta = 0.25 | 28 | 7 | [-1.3506, +1.3543] | 2.5513 | 1.000000 |
| ordinates 3k+1, beta = 0.25 | 28 | 11 | [-1.1669, +1.1560] | 2.8605 | 1.000000 |

Every range is inside (-2, 2) while the true eigenvalue reaches 3.55. The measured statement is
confirmed, including for the zeta(s+a) zeta(s-a) control and for a node set with no relation to zeta.

## Corrections and limits

3. **"Decisive test" is mislabelled.** For any node set in the upper half-plane the kernels span a
   space on which `Z^*` is a contraction, so the range of `Z + Z^*` is inside [-2, 2] by
   construction. The test cannot come out the other way; it is a consistency check of Lemma 2(c)
   and of the Gram convention. Section 8 item 3 says this; the verdict heading should say the same.
   The obstruction rests on the proved lemmas, not on section 3.
4. **Scope of Lemma 2(c).** The energy form for `PSL(2,Z)` is indefinite (the constant function,
   the pole of phi at s = 1). The bound 2 is stated on the part of K where the form is
   non-negative and relies on the Lax-Phillips construction quoted from the literature. This is a
   PROVED-rel label, correctly given in the result. The finite-span model computation does not
   depend on it.
5. **Non-arithmetic control.** The operator used there is defined as `U(log p) + U(-log p)`, so it
   passes Lemmas 1 and 2 by definition; this shows the Eisenstein-channel statement has no Hecke
   content, which is the point of R1 = false. The statement that resonances of non-arithmetic
   Hecke triangle groups lie off a line is cited, not checked, and Phillips-Sarnak concerns
   destruction of cusp forms rather than the location of poles of phi. The obstruction does not
   need this citation: abstract model spaces with arbitrary Blaschke zero sets already pass every
   statement.
6. **DH row.** "After a Blaschke correction it is a moved-resonance inner function" is a sketch, not
   a construction. It is not needed for the verdict (R3 is already false from the moved-resonance
   rows) and should be labelled OPEN or removed.
7. **What is not closed.** Lemma 3 covers one weight family; Lemma 4 is finite-dimensional and shows
   that any norm bound is equivalent to the location, not that no independent derivation of such a
   bound exists. The result states this (section 8 item 2). The spectrum of `Z(log p)` itself
   (not of `Z + Z^*`) is `{p^(mu_j)}` and does carry the location; what is shown is that no norm
   or numerical-range inequality in the forms examined extracts it beyond `Re rho <= 1`.

## Checks requested by the brief

- RH assumed anywhere: no. The values 2.0061 and 2.1436 use computed low zeros only.
- Verified height restated as a result: no.
- Known theorem presented as new: no. Lemma 1 and `Re rho <= 1` are labelled classical or trivial.
- Statement about zeros of zeta: none.

## Requirement flags (set by this referee)

- R1 = false. No step uses multiplicativity; on the Eisenstein channel `T_p` is a function of the
  wave generator.
- R2 = false. No conclusion about zeros in any window.
- R3 = false. Moved-resonance inner functions and zeta(s+a) zeta(s-a) pass every statement
  (rerun above).
- R4 = false. The only inequality is `Re rho <= 1`.

## Surviving claim

On the Eisenstein channel `T_p = U(log p) + U(-log p)`; its compression to K is
`Z(log p) + Z(log p)^*`, of energy norm at most 2 for every inner function, with resonance states
not eigenvectors; weighted-L^2 admissibility implies the eigenvalue bound; on finite spans a norm
bound for all p is equivalent to resonance location; no positive form makes `T_2` and `T_3`
symmetric on a resonance state. Precise obstruction for the routes examined; no statement about
zeros.
