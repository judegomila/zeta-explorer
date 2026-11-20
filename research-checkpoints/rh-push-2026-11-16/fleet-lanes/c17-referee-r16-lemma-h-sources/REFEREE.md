HOLDS (with corrections E1 to E4)

# REFEREE: c17-referee-r16-lemma-h-sources (adversarial, lens: general)

2026-11-19. Scope: `RESULT.md` and `REFEREE2-lemma-H.md` of this lane, the stored outputs, and the new
corrections it files in the round-16 lanes. Nothing here is a statement about zeros of zeta. Own check script
kept outside the lane (`/tmp/ref_c17/chk.py`, mpmath 30 to 40 digits, local, `scripts/memcap.sh 8`, single
process, under 2 minutes); the server was not used. Labels: PROVED (re-derived here), MEASURED (mpmath).

## 1. Ruling

No step labelled PROVED fails. Lemma H holds. The counts and server figures quoted in the result match the stored
files. One of the four "new corrections" is incomplete in a way that makes its summary sentence false (E1). Three
smaller sentences need correction (E2 to E4). Requirement flags: R1 = R2 = R3 = R4 = false (referee lane; no
argument about zeta).

## 2. What was re-derived or rerun

1. **Lemma H (PROVED, re-derived).** `M_tau = c M`, `c = exp(tau S/4) > 0`, tau < 0. Under `M <= lam`:
   S = 0 gives c = 1; S > 0 gives c in (0, 1): inherited when M >= 0 or lam >= 0, and for `M <= lam < 0` exactly
   when `c >= lam/M`; S < 0 gives c > 1: inherited when M <= 0, and for M > 0 exactly when `c <= lam/M`. The
   union of the inherited cases is `{lam S >= 0} or {M lam <= 0}`; in the complement M and lam are non-zero of
   one sign, S != 0, and the threshold is `4 abs(log(lam/M))/abs(S)` in both branches. Agrees with section 1 of
   `REFEREE2-lemma-H.md`. The "iff" in (H1) holds because in the complement the bound fails for every
   `abs(tau) > tau*`.
2. **Lemma H, different case (MEASURED).** Three kernels not used by the lane's test, two of them with sign
   changes (`Phi` of zeta in mpmath; `cos(7u + 1) exp(-u^4)`; `u - 0.13`), mixed inside one monomial, 1 to 4
   nodes in [-1.3, 1.3], integer exponents and (at positive values) non-integer exponents, four designs of lam
   including lam = M. Members built factor by factor. 3,836 decisions, 0 disagree; cases hit:
   (S<0: M<0 with lam<0, =0, >0; M>0 threshold), (S>0: M<0 with lam<0 threshold, =0, >0; M>0).
3. **The lift is the heat family (MEASURED), two new points.** In the lane's normalisation
   (`Xi(z) = xi(1/2 + iz/2)/4`, multiplier `exp(tau u^2/4)`): tau = -0.9, z = 6.3: both sides
   0.098484722960642078878; tau = -2, z = 15: both sides 0.031936029247635186817 (20 digits).
   The Gaussian-average constant `1/sqrt(pi abs(tau))` and exponent `-y^2/abs(tau)` re-derived from the Fourier
   transform of `exp(-abs(tau) u^2/4)`.
4. **u6g, E_a row (MEASURED, own run of the 36-term form).** Residue at 1 - a: `xi(1 - 2a)/(xi(2) xi(2 - 2a))`
   = -7.43074 at a = 0.2 (negative: confirmed). The lane's three values for the zero `rho_1 - a` at p = 1 - a
   reproduced (-0.0315178, +0.0345983, -0.0018353). New cases: see E1.
5. **Stored outputs.** 211 + 190 + 162 + 169 = 732 decisions, 0 disagree, 0 undecided, 272 certified failures:
   matches `lemh_*.json`. DN run 2 log: 585 of 585 T-train, primary 0, secondary 86: matches. Amplifier logs:
   eight C3 lines on (T, N) = (1, 5), (1, 6), (2, 5), (2, 7), largest `gram_maxrel` 1.0005e-14: matches.
   Rule of three: `1 - 0.05^(1/500)` = 0.597 per cent: matches "below 0.6 per cent".
6. **Constants.** `e/(4 sqrt 2)` = 0.480530; `2 x 0.9194/(2 pi)` = 0.2927, `2 x 0.91/(2 pi)` = 0.2897: correct.
   ctheta N1: with `b_1 <= (2/V)[...]`, `V = (1 - kappa) u - delta`, the coefficients 2/(1 - kappa) and
   4/(1 - kappa) follow from the bracket terms `log log t` and `2 log log t`: arithmetic confirmed (the bracket
   itself was taken from the lane's (T), not re-derived here). Turan with m = n: `(n/(16 e n))^n = (16e)^(-n)`:
   consistent with the 8e form.
7. **E_a kernel and character.** The kernel `int Phi(v) Phi(u - v) e^(2a(2v - u)) dv` is the convolution of
   `Phi(u) e^(2au)` and `Phi(u) e^(-2au)`, the kernels of the two shifted factors: correct. The table `CH7` is
   the cubic character with chi(3) = omega (indices of 3 mod 7 reduced mod 3), even: correct.

## 3. Errors

**E1 (the new correction to the u6g E_a row is incomplete; the summary "holds through the pole 1 + a only" is
false).** The lane tested the pole p = 1 - a only at the zero `rho - a` (A = 1/2 - a, 2A < p). The other zero
family of `M_a`, `rho + a` (A = 1/2 + a, 2A > p), was not tested. For it the formula of Lemma R (which the lane
itself confirms at both poles) gives, with r < 0,
`r abs(M(p - a'))^2 e^(...) [1/(2A - p) - r e^(-p t_2)/(4Ap)]` with a positive bracket, hence a negative limit
for every T: this is the r < 0 mirror of consequence (a). Measured with the 36-term form (a = 0.2, zeros
`rho_1 + a`, `rho_2 + a`, T = (0, 0), (0, 2), (1, 0.5), (3, 5)): -5.0895, -3.5593, -6.5499, -15.920 and
-4.9388, -3.4540, -6.3559, -15.449, each equal to the formula to 8 digits; also negative at a = 0.1 and
a = 0.35 at all four T. `M_a` is regular and non-zero at `p - a' = 1 - rho - 2a`. So E_a fails through the pole
1 - a as well, at every T, through the zero `rho + a`. What is true: the lane's original sentence ("the zero
rho - a has 2A < p" at p = 1 - a) is wrong at that pole, and Lemma R (a) as stated (r > 0) applies at 1 + a
only. Corrected row: "S4 through Lemma R: at the pole 1 + a (r > 0) by the zero rho - a (2A < p); at the pole
1 - a (r < 0) by the zero rho + a (2A > p), the sign-reversed case of the same formula." The sentence in
`RESULT.md` section 0, sentence 1 of section 2.3, the `lanes.jsonl` claim and section 3 item 2 of the u6g
`REFEREE2.md` should be changed accordingly. The row's outcome (E_a fails) is unchanged and strengthened.
The lesson line "a residue sign must be checked before using Lemma R at a second pole" stands.

**E2 ("all six sub-cases of section 1" were not all tested).** `code/lemh.py` skips every point with S = 0 or
M = 0 (`if not (M0 != 0) or not (S != 0): continue`). Sub-case 1 (S = 0) does not occur in the 80 points; five
of the six sub-cases occur. The equality design lam = M (tau* = 0) is also absent (smallest slack 1e-7). Both
are trivial on paper; the sentence in the table ("all six sub-cases") and in section 2.2 of the Lemma H file
should read "the five sub-cases with S != 0".

**E3 (two normalisations of tau inside one test file; not stated).** In `lemh.py` the zeta kernel is written in
the variable with `e^(4u)` (the author's and the registered variable w = 2u, kernel `e^(2w)`), the character
kernel in the variable with `e^(2u)`; both receive `exp(tau u^2/4)`. For zeta and E_a the lane's tau is 4 times
the registered tau (`exp(tau u^2/4) = exp(tau w^2/16)`); for the character it equals the registered tau. No
monomial of the test mixes the two kernels, so no decision is affected, and the lemma is normalisation-free when
S and tau refer to one variable. Consequences to write: the tau* column of the zeta and E_a rows and the point
"tau = -0.3" of 2.1 are in units of 4 x registered tau (which is why the author's value at the same (tau, z),
0.18025, differs from this lane's 0.11472); hypothesis 2 ("the same tau on every member") must be read as "the
same tau and the same variable"; the gated lane's "tau ladder below 0.02" refers to the registered variable.

**E4 (wording).** (a) "Second independent referee" of Lemma H counts the author's derivation (itself made in a
referee lane) as the first; on file there are two independent derivations, one of them the author's. Record it
as "two derivations (author and one referee)", as the Lemma H file's own sentence does. (b) The file is dated
2026-11-20; the file system and the campaign clock give 2026-11-19 (the unit names are UTC). (c) The claim
"Theorem B on five new rows ... inside the truncation tail" and the DN statement rest on lane code and lane ball
kernels; the result says so in section 6; the one-line claim does not.

## 4. Controls, RH, verified height, novelty

No zeta-only mechanism is claimed, so there is no control to run against a step. The one place where a control
outcome is asserted anew (E_a in the u6g row) was run here and is corrected in E1. Nothing assumes RH; nothing
restates verified height. Lemma H is an elementary case analysis and is presented as such; Turan's theorem is
labelled CLASSICAL with secondary-source status; nothing known is presented as new.

## 5. Not covered

Theorem B, Lemma T, Lemma QA (b), Proposition M and Lemma U were not re-derived here beyond the constants in
section 2 item 6; the DN server runs and the amplifier quadrature were read from logs, not rerun; the primary
sources for Turan's theorem were not opened.

## 6. Flags

R1 false, R2 false, R3 false, R4 false. Score 0. No flag of a refereed lane changes.
