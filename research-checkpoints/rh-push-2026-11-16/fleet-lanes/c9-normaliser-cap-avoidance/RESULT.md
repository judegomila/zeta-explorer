# c9-normaliser-cap-avoidance: the limit step of the Proposition 2.1 format with the normaliser kept

Internal working note, 2026-11-18. Slug `c9-normaliser-cap-avoidance`. Kind: deepen (STRATEGY 4.0, "enlarge the
family to contain the normaliser character"). Unrefereed. Nothing committed, pushed or posted. Server not used; one
local run through `scripts/memcap.sh 8` (`check.py`, `check.log`, mpmath, 30 digits, under 50 MB).
Scope: the continuation step of an ESTIMATE FORMAT (MS = `~/lean-deps/qrh-verify/paper.txt`, Proposition 2.1, read
as text). Every abscissa below is the output of the format under hypotheses (2.4), (2.5) that have no source below
7/8. No statement about zeros of zeta is made. RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X / CLASSICAL / MEASURED / NO SOURCE / OPEN.

## Verdict: partial result (ceiling 2/3 -> 3/5 for the format, under a ladder hypothesis) and a precise obstruction at 3/5

1. **(2.2) is used pointwise and qualitatively (Lemma U1, PROVED).** In the proof of MS Prop. 2.1, (2.2) enters
   twice: boundedness of H_eta on Re s >= 2 (contour shift for Z -> 0) and the division by H_eta at one top-layer
   zero. No lower bound for abs(H_eta) on a line or region is used and no quantity is lost. So test (a) has nothing
   to repair: the format fails only if EVERY zero rho of the family with Re rho > beta* - eps is a zero of its own
   normaliser of at least the same order. Shifting the test point, Jensen or Borel-Caratheodory do not apply to
   that failure (it is exact vanishing at rho, not smallness near rho), and counting cannot exclude it for
   beta* > 1/2 because the number of top-layer zeros has no lower bound beyond 1.
2. **Ladder lemma (Theorem A, PROVED-rel Lemma H and the format hypotheses at each level).** Let G_f be the
   primitive Hecke characters alpha^f chi of F = Q(sqrt(-3)), chi of finite order, beta(f) the supremum of real
   parts of zeros of their L-functions, f_0 = 0, f_{j+1} = 6 f_j + 6. If the format (hypotheses of Prop. 2.1
   without (2.2), with the normaliser of Lemma H) holds with boundary sigma_0 on G_{f_j} for j = 0..k-1, then for
   each j < k: beta(f_j) <= sigma_0, or (4 - beta(f_{j+1}))/6 <= beta(f_j) <= (3 + beta(f_{j+1}))/6. Hence

       beta(0) <= max(sigma_0, 3/5 + (2/5) 6^-k)        (k = 1: 2/3, row Z24; k = 2: 11/18; k = 3: 65/108).

   With the format on every level: B = sup_j beta(f_j) satisfies B <= sigma_0 or 4/7 <= B <= 3/5.
3. **Obstruction at 3/5 (precise).** The map sigma -> 6 sigma - 3 has fixed point 3/5 and its reflection
   sigma -> 4 - 6 sigma has fixed point 4/7. For B in [4/7, 3/5] the image zeros have real parts in [3/7, 3/5] and
   [2/5, 4/7], inside the range the family already allows; the format gives no contradiction. The ceiling of the
   format with sextic rows and the family enlarged along the normaliser is 3/5, not 1/2. Reaching 1/2 needs the
   statement NONRES-W: no L(s, eta) of the ladder has, in the window 4/7 <= Re s <= 3/5, a top-layer zero rho with
   L(6 rho - 3, psi_eta) = 0. That is a statement about one common zero of two L-functions at related points
   (simple-zero type); no known method gives it.
4. **Test (b).** MS has one normaliser shape (the residue point (w, z) = (1, 1/6) is forced by the pole of
   zeta_F^S(6z); changing S changes no zero in Re s > 1/2). A second normaliser character exists for free through
   L(s, eta) = L(s, eta^sigma) (sigma = complex conjugation on ideals): a top-layer zero rho forces
   w = 6 rho - 3 to be a common zero of L(w, alpha^6 eta^6) and L(w, alpha^6 (eta^sigma)^6). These differ iff
   eta^6 != (eta^sigma)^6. For eta = 1 and eta = chi o N (the targets containing zeta and Dirichlet L-functions)
   they coincide and nothing is gained. Where they differ, "no common zero" is OPEN and not of zero-free type
   (it is an independence statement for individual zeros).
5. **Controls.** The step is target-blind. Liouville twist, THIN and every sign twist have the same normaliser
   and the same zeros of it (the sixth power removes signs). A general unimodular twist has a normaliser Euler
   product with no continuation below Re s = 2/3. No R3 at this step.

Requirement flags: R1 no, R2 no, R3 no, R4 no (section 7).

---

## 0. Plan

Read: BRIEF to the end; OBSTRUCTION_MAP rows Z15, Z18, Z24, Z26, controls TW-, THIN, NR; STRATEGY 4.0;
`c6-marks-bc-manuscript-check/RESULT.md` sections 1-3 (Lemma H, Corollary H1, Lemma S, Theorem B1'); MS section 2
(Prop. 2.1 and proof, lines 356-470), Lemma 7.1 with (7.10)-(7.16), section 10.1 with (10.1), (10.2), proof of
Theorem 3.1. Searched c6, c7 lanes and STRATEGY for "bootstrap", "4/7", "enlarg": only the one-line suggestion in
c6 section 3 and STRATEGY 4.0; not worked before.

Decisive test: how (2.2) is used (section 1), then (a), (b), (c) (sections 2-4).
New relative to Z24: Lemma U1 (the exact replacement of (2.2)); the ladder with both the upper and the reflected
lower inequality; the window [4/7, 3/5]; the second normaliser character through sigma; the control statements.

## 1. First lemma: how (2.2) is used

MS Prop. 2.1, proof. Steps: (i) (2.4) + (2.5) give abs(f_eta(Z)) << Z^(C(beta*) - eps*), eps* = min(Delta_0 - omega,
sigma). (ii) Decay of f_eta as Z -> 0: "By (2.2), H_eta is bounded on Re s > sigma_0"; the contour moves right from
Re s = 2 to Re s = B. Only boundedness on Re s >= 2 is used. (iii) The Mellin transform F_eta is holomorphic on
Re s > beta* - eps* and equals e^((s-5/6)^2) H_eta / L^S(s, eta) on Re s > 1 (Fourier inversion, identity theorem);
(2.2) not used. (iv) "(2.2) implies abs(H_eta) >= 1/2 on Re s > sigma_0. Consequently e^(-(s-5/6)^2) F_eta / H_eta
is a holomorphic continuation of 1/L^S": used at the one zero rho with Re rho > beta* - eps*.

**Lemma U1 [PROVED].** Prop. 2.1 holds with (2.2) replaced by:
 (2.2a) H_eta is holomorphic on Re s > sigma_0 and bounded on Re s >= 2;
 (2.2b) for every eps > 0 there are a target eta and a zero rho of L(s, eta) with Re rho > beta* - eps and
        ord_rho H_eta < ord_rho L(s, eta).
Without (2.2b) the proof gives exactly: every zero rho of every target with Re rho > beta* - eps* satisfies
ord_rho H_eta >= ord_rho L(s, eta) ("resonant").
Proof. Steps (i)-(iii) use (2.2a) only. F_eta e^(-(s-5/6)^2) = H_eta / L^S is holomorphic on Re s > beta* - eps*
(identity theorem on the connected set Re s > max(sigma_0, beta* - eps*) minus zeros, then removable
singularities), which is the resonance statement; (2.2b) with eps = eps* contradicts it. QED
(This is direction (i) => (ii) of c6 Lemma S, stated for the format.)

Answer to "pointwise or uniform": pointwise, at zeros of the targets, and only as an order-of-vanishing
comparison. For the normaliser of Lemma H, (2.2a) holds for every sigma_0 >= 1/2 (c6 Corollary H1(a); absolute
convergence on Re s >= 2).

## 2. Test (a): local arguments

The proof has no quantitative use of abs(H_eta) to lose a factor Z^eps on. The Mellin identity is exact, and the
only obstruction is ord_rho H_eta >= ord_rho L at every top-layer zero. Consequences:
- Shifting the test point within 1/log: no test point exists; the "test" is the pole of 1/L at rho itself.
- Borel-Caratheodory or Jensen on a small disc: they bound H_eta/L^S or count zeros of H_eta near rho; the
  resonant case is a holomorphic quotient with nothing to bound.
- Density: zeros of H_eta with Re s > b, abs(Im s) <= T number N_psi(6b - 3, 6T) (zeros of L(w, psi_eta) with
  Re w > 6b - 3). Resonance in the top layer is excluded by counting only if top-layer zeros of L(s, eta)
  outnumber these. No lower bound for the number of top-layer zeros exists beyond >= 1 for some eta. (On the line
  Re s = 1/2 itself the count works: c6 Theorem B, Selberg against O_S(T).)
Verdict on (a): [PROVED] nothing is lost and nothing is gained; (2.2) reduces to (2.2b), which for the sextic
normaliser holds automatically iff beta* > (3 + beta_1)/6, beta_1 the zero supremum of the normaliser characters.

## 3. Test (c) first: the ladder

Notation. alpha(n) = n/abs(n) on primary generators; G_f = primitive Hecke characters of F with infinity type
alpha^f times finite order; beta(f) = sup of Re rho over zeros of L(s, eta), eta in G_f (and 1/2);
beta(f) = beta(-f) (L(s, eta^sigma) = L(s, eta), eta^sigma in G_{-f}). Lemma H (c6; three referees per the
assignment): for completely multiplicative eta with abs(eta(p)) = 1,

    H_eta(s) = zeta_F^S(2)^-1 L^S(6s - 3, psi_eta) E_eta(s)   (Re s > 1/2),   psi_eta = (alpha eta)^6,

E_eta holomorphic and non-vanishing. For eta in G_f, psi_eta lies over G_{6f+6} (with the other conjugation
convention of MS (7.6): G_{6f-6}; applying the format to eta^sigma exchanges the two, so both occur and the choice
does not matter below). psi_eta is never trivial for f >= 0 (frequency 6f + 6 > 0), so L(w, psi_eta) is entire and
its zeros in Re w > 0 are those of the primitive character.

Hypothesis (F_j), "format at level j, boundary sigma_0" (sigma_0 in [1/2, 1)): if beta(f_j) > sigma_0, then for
every eta in G_{f_j} there are S, J_eta with (2.4) and (2.5) [(2.5) relative to C(beta(f_j)), margins omega, sigma
uniform on G_{f_j}], f_eta defined by (2.3) with the H_eta above.
Status of (F_j): MS proves (F_0) for sigma_0 = 11/12 and 7/8 (unrefereed manuscript). For sigma_0 < 7/8: NO SOURCE
(Z15, Z26). For j >= 1 (targets of infinite order): NO SOURCE at any sigma_0; MS states its probes for finite-order
targets, and the derivation of (7.10) for alpha^f chi was not done here. The local algebra of Lemma H does not
depend on the order of eta.

**Theorem A (ladder) [PROVED-rel Lemma H, (F_j); the functional equation and non-vanishing on Re w = 1 of Hecke
L-functions CLASSICAL].** Assume (F_j) for 0 <= j < k. Then:
 (A1) for each j < k, either beta(f_j) <= sigma_0, or
          (4 - beta(f_{j+1}))/6 <= beta(f_j) <= (3 + beta(f_{j+1}))/6,
      and every zero of level j with Re rho > beta(f_j) - eps*_j is resonant;
 (A2) beta(0) <= max(sigma_0, x_k), x_k = 3/5 + (2/5) 6^-k;
 (A3) if (F_j) holds for all j and B = sup_j beta(f_j) > sigma_0, then 4/7 <= B <= 3/5.
Proof. (A1) Let b = beta(f_j) > sigma_0. By Lemma U1 every zero rho of level j with Re rho > b - eps* is a zero of
H_eta, so w = 6 rho - 3 is a zero of L(w, psi_eta), psi_eta over G_{f_{j+1}}, with 0 < Re w < 1. Hence
6 Re rho - 3 <= beta(f_{j+1}). By the functional equation 1 - conj(w) is a zero of the same L-function, so
4 - 6 Re rho <= beta(f_{j+1}). Let Re rho -> b (zeros with Re rho > b - eps exist for every eps <= eps*).
(A2) Downward induction from the trivial bound beta(f_k) <= 1. Put y_k = 1, y_j = (3 + y_{j+1})/6, so
y_j = 3/5 + (2/5) 6^-(k-j). Claim beta(f_j) <= max(sigma_0, y_j). True at j = k. Step: beta(f_j) <= max(sigma_0,
(3 + max(sigma_0, y_{j+1}))/6). If sigma_0 <= y_{j+1} this is max(sigma_0, y_j). If sigma_0 > y_{j+1} > 3/5, then
(3 + sigma_0)/6 < sigma_0. (A3) B <= max(sigma_0, 3/5) by (A2) applied from every level. If B > sigma_0, then for every delta > 0 there is j with beta(f_j) > max(sigma_0, B - delta); (A1) gives
4 - 6 beta(f_j) <= beta(f_{j+1}) <= B, and beta(f_j) <= B, so 4 - 6B <= B, that is B >= 4/7. QED

Remarks.
- k = 1 is row Z24 (2/3). The exact arithmetic of x_k and both fixed points is in `check.log` T6.
- (A2) also covers 3/5 <= sigma_0 < 2/3: there c6 Corollary H1(d) says (2.2) needs a zero-free strip for
  L(w, psi_eta); Theorem A replaces that strip by (F_1), ..., (F_{k-1}) with x_k <= sigma_0 (sigma_0 = 0.62: k = 2).
- With sigma_0 = 1/2 and GRH at level j+1 the two inequalities of (A1) give beta(f_j) = 7/12 exactly or 1/2:
  the top zeros of level j would sit on the image Re s = 7/12 of the critical line of level j+1.
- The chain of c6 Theorem B1' becomes: GRH (all levels) => signal part of (F_j) for all j [c6 (1a), CLASSICAL
  inputs]; (F_j) for all j => B = 1/2 or B in [4/7, 3/5] with resonance. The hypotheses are still consequences of
  the statement the format is meant to prove; no input weaker than the conclusion appears (as in Z26).

What the bootstrap sigma -> (3 + sigma)/6 gives exactly: the upper inequality of (A1); iterated k times from the
trivial bound 1 it gives x_k, limit 3/5 (the fixed point). It never passes 3/5 because for b <= 3/5 the image
6b - 3 <= b is not above the supremum. The reflected map sigma -> (4 - sigma)/6 (not in the assignment) gives the
lower edge 4/7 in the closed family.

## 4. Test (b): two normaliser characters

- Inside MS the normaliser is H_{eta,1}(s, 1, 1/6) in both parts (MS (10.1); proof of Theorem 3.1 uses the same
  function). The point z = 1/6 is the pole of zeta_F^S(6z) in (7.13), w = 1 the pole of L^S(w, chi(u)) at u = 1;
  neither is a parameter. Enlarging S multiplies H_eta by factors non-vanishing on Re s > 1/2. So a second probe
  with a different psi needs a different row system (order r != 6 or another residue), not present in MS.
- Free second character [PROVED-rel Lemma H]: eta and eta^sigma have the same L-function, and
  psi_{eta^sigma} = alpha^6 (eta^sigma)^6, with L(w, alpha^6 (eta^sigma)^6) = L(w, alpha^-6 eta^6). So a resonant
  zero rho of L(s, eta) makes w = 6 rho - 3 a common zero of L(w, alpha^6 eta^6) and L(w, alpha^-6 eta^6)
  (the same follows from the conjugate target). The two are equal iff eta^6 = (eta^sigma)^6, which holds for
  eta = 1 and eta = chi o N. For those targets there is one condition, not two.
- "No common zero of L(s, eta) and L(6s - 3, psi_eta)" (or of the pair above): not a zero-free statement (it
  excludes no region) and not provable by counting (section 2). Known results on distinct primitive L-functions
  give non-shared zeros in proportion, never at a prescribed zero. OPEN; it is the statement NONRES of c6, now
  needed only in the window: NONRES-W.
Verdict on (b): two probes do not cover every point for the targets eta = 1, chi o N; where a second character
exists, exclusion of common zeros is open.

## 5. Small numerical check (`check.py`, `check.log`) [MEASURED, 30 digits, not interval arithmetic]

psi = alpha^6 (eta = 1). L(w, alpha^6) computed from the theta series sum n^6 exp(-2 pi N(n) t / sqrt 3) on
Z[omega] (norms <= 60) and incomplete gamma functions.
- T1: Theta(1/t) = t^7 Theta(t) to 15 digits (root number +1). T2: L(9, alpha^6) = 0.999952991191024 by the
  formula, by the direct lattice sum and by the Euler product over primes < 400 (the lattice sum is the Hecke
  L-function with the unit-invariant sixth power).
- T3: 12 sign changes of the completed function on Re w = 1/2, 0 < gamma' < 30 (step 0.1; completeness of the list
  not certified): 6.5102, 10.6440, 12.4713, 15.6496, 16.9832, 19.1681, 21.1455, 22.8104, 24.3163, 25.9172,
  27.9816, 29.1428.
- T4: the images s = 7/12 + i gamma'/6 are zeros of H_1 (abs(L(6s - 3, psi)) <= 1e-21); at the first eight,
  abs(zeta(s)) is in [0.546, 0.760] and abs(L(s, chi_-3)) in [0.634, 1.641]. The normaliser has zeros at height
  about 1 where the target has none: (2.2) fails there while (2.2b) is not affected, as Lemma U1 says.
- T5: L(w, alpha^6) is real and in [0.717, 0.866] on a grid of 199 points of (0, 1): no real zero seen. Used in
  the THIN control below.

## 6. Controls (target-blind step; no R3 expected and none found)

The normaliser depends on the target only through complete multiplicativity and the sixth powers of its local
parameters (Lemma H: R = a_p^2 Q^(3-6s), a_p^2 = (alpha(p) c(p))^6; E depends on c(p) but has no zeros).
- Liouville twist c = lambda eta: (alpha lambda eta)^6 = (alpha eta)^6. Same L^S(6s - 3, psi_eta), same zeros of
  the normaliser [PROVED-rel Lemma H]. The control "target" is L(2s, eta^2)/L(s, eta); its reciprocal has no pole
  in Re s > 1/2, so the conclusion of Theorem A is true for it and the lemma is silent. The format fails for it in
  hypothesis (2.5)/(2.4) by a main term (c6 section 7), not in the limit step.
- THIN (eps = +-1, F = zeta (s - b) W, zero at real b): same normaliser and same zeros as for zeta, for the same
  reason. The top zero is real: H(b) = 0 iff L(6b - 3, alpha^6) = 0 with 6b - 3 real. For b > 2/3 this is excluded
  by absolute convergence [PROVED]; for 1/2 < b <= 2/3 it is excluded on the grid of T5 [MEASURED]. So (2.2b)
  holds for THIN and Lemma U1 applies to it in full: the limit step is valid for THIN, and since its conclusion is
  false for THIN, hypotheses (2.4)/(2.5) must fail for THIN at every sigma_0 < b. The location of that failure is
  Proposition D (row Z25, open half), not this lane. Translates eps(n) n^(-i tau): H_tau(s) = H(s + i tau), same
  statement.
- U (general unimodular completely multiplicative c): the normaliser contains prod (1 - (alpha c)^6(p) Q^(3-6s))^-1,
  absolutely convergent and non-vanishing for Re s > 2/3, with no continuation below 2/3 in general (no
  L-function). The zeros are not "the same": for Re s > 2/3 there are none (as for the target); below 2/3 the
  normaliser of a general member of U is not defined, so (2.2a) fails and the format cannot be posed. For members
  of U with values in sixth roots of unity the normaliser is that of the untwisted target.
- Unimodular twist by n^(-ia) (height translate) and zeta(s+a)zeta(s-a) type targets: not completely
  multiplicative with unimodular parameters in the second case; Lemma H does not apply; not examined.
Summary: Liouville, THIN, sign twists: identical normaliser zeros; U in general: normaliser exists only right of
2/3. The ladder lemma holds verbatim for any control for which the levels are defined. No control fails at this
step for a structural reason.

## 7. Requirement flags

- R1 (all primes, multiplicativity essential): NO. Lemma H uses complete multiplicativity of the target, but the
  step is the same for every completely multiplicative unimodular target; nothing here was shown to need it in the
  sense of the gate.
- R2 (height-uniform, every window): NO. Theorem A is a half-plane statement of the format, conditional on
  hypotheses with no source below 7/8.
- R3 (fails for every control at a named step): NO. Target-blind (section 6).
- R4 (reaches the critical line): NO. The limit step is extended from ceiling 2/3 to 3/5 under (F_j) on the
  ladder; it stops at the window [4/7, 3/5] and does not reach 1/2. The lemma is unrefereed (two referees owed).

## 8. Proposed map row (text only; not applied)

| Z24b | Normaliser cap with the family enlarged along the normaliser character | (2.2) is used only as: H_eta holomorphic, bounded on Re s >= 2, and not vanishing to the order of L at one top-layer zero (Lemma U1). With G_f = {alpha^f chi}, f_0 = 0, f_{j+1} = 6 f_j + 6, and the format assumed on levels 0..k-1: beta(0) <= max(sigma_0, 3/5 + (2/5) 6^-k); on all levels the supremum B is <= sigma_0 or in [4/7, 3/5] (fixed points of 6b - 3 and of its reflection 4 - 6b). Ceiling of the sextic format with enlargement: 3/5. Below it the needed input is NONRES-W (no top-layer zero rho in the window with L(6 rho - 3, psi_eta) = 0), a common-zero statement not reachable by counting. A second normaliser character exists through eta^sigma except for eta = 1, chi o N. Format hypotheses for infinite-order targets: NO SOURCE. | PROVED-rel Lemma H and (F_j); unrefereed | target-blind: Liouville, THIN, sign twists have the same normaliser zeros; general U has no normaliser below 2/3 | `c9-normaliser-cap-avoidance` |

## 9. Three weakest steps

1. **(F_j) for j >= 1.** The format for targets alpha^f chi of infinite order has no source. MS builds its probes
   for finite-order targets, and the map's reading of the 7/8 mechanism is that it uses periodicity of the
   coefficients (lattice-translation invariance, control THIN note). alpha^f is not periodic; it can be moved into
   the archimedean weight, but neither the identity (7.10)-(7.13) nor uniform margins were derived for it. If the
   format cannot be posed on G_{f_1}, Theorem A is empty beyond k = 1 and the ceiling stays 2/3.
2. **(F_0) below 7/8 and circularity.** Every use of Theorem A at sigma_0 < 7/8 assumes (2.4), (2.5) at a boundary
   where rows Z15, Z26 record no source, and the signal part of the hypotheses follows from GRH on the ladder. The
   lemma moves the ceiling of the limit step only; it supplies no input.
3. **Lemma H and conventions.** Theorem A rests on the form L^S(6s - 3, (alpha eta)^6) from MS Lemma 7.1 (an
   unrefereed manuscript; the local identity was re-derived by referees of c6, c8 lanes, not here), on its validity
   for eta of infinite order (local algebra only), and on the conjugation convention of (7.6) (handled by
   beta(f) = beta(-f), but the frequency sequence 6, 42, 258 versus 6, 30, 174 was not fixed). The numerical zeros
   in T3-T5 are 30-digit floating point, not certified, and the real-axis grid is not a proof of non-vanishing on
   (0, 1).
