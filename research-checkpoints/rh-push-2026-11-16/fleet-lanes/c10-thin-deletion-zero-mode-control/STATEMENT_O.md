# Statement O: record of obstructions (lane A of the round-8 checkpoint)

Written 2026-11-18 by lane `c9-obstruction-record-statement`. Source outline:
`campaign/OBSTRUCTION_RECORD_OUTLINE.md` sections 1 to 5. Trigger: `campaign/STRATEGY.md` section 2, last rule;
`campaign/ROUND_LOG.md`, round 9 allocation, "Checkpoint: triggered".

**Revision 2026-11-18 (`c10-thin-deletion-zero-mode-control`).** This file is the copy of
`push/c9-obstruction-record-statement/STATEMENT_O.md` with lines 1 and 5 rewritten: the control DEL_b (thin prime
deletion) replaces the Beurling source that was quoted and not opened. No other line is changed; the corrections E1
to E7 of the c9 referee are not applied here (lane `c10-repair-record-referee-r9`). Control code added: DEL. The
unchanged original is `STATEMENT_O.c9-copy.md` in this directory. Labels of lines 1 and 5 stay ARGUED.

This file is a record of obstructions. It is not a result about zeros of zeta and no line of it is one. It contains
no new mathematics: every line restates a row of `push/OBSTRUCTION_MAP.md` (called "the map") or a lane result, with
the path where a referee can check it. It does not say that no device supplying R1, R3 and R4 exists.

Conventions.
- Map rows are cited by id (P9, Z18, ...). Ids marked "pending" are proposed rows of `campaign/MAP_PENDING.md`
  Part 2, not yet in the map; their text is collected in `MAP_ROWS_PROPOSED.md` in this directory.
- A lane `xyz` means `push/xyz/RESULT.md`. "n ref" is the number of files `REFEREE*.md` present in the lane
  directory on 2026-11-18 (counted by `verify_citations.py`, output `verify_citations.json`). Referees are
  internal adversarial passes; nothing has external review.
- Label rule of this record: a line is PROVED only if two referee files cover its closing step. Otherwise it is
  ARGUED (reasoned or proved at source with fewer than two referees) or MEASURED (its closing step is numerical),
  and the line states what is owed. The label at source is given separately.
- Control codes are those of map section 2: DH, HEAT, TW+, TW-, EA (E_a), NR (T-NR twin), B (Beurling), WT, THIN,
  U, DEL (thin prime deletion, lines 1 and 5), the Liouville twist, the interpolation twin, cluster lifts.

Count: 12 lines; PROVED 0; ARGUED 9 (lines 1, 3, 5, 6, 7, 8, 10, 11, 12); MEASURED 3 (lines 2, 4, 9).
Sub-statements of lines 1 to 12 with two referee files: 2 (the P46 transfer theorem, lines 5 and 7; P51 Lemma A and
Theorem 1', line 7). Section D lists these and the two-referee rows inside the 7/8 mechanism.

---

## A. Definitions (outline section 1, fixed)

**A1. Target class.** A set K of functions F, each given with: a Dirichlet-type series sum a(n) n^-s (ordinary, or
generalised with frequencies log n_k for Beurling systems, or a Mellin transform of a kernel for HEAT) convergent in
some half-plane; a meromorphic continuation to the region where the device works; and a declared list of which of
the following inputs hold for F. K contains zeta and the controls of map section 2.

Inputs (codes used below; the first four are the input levels of map section 2, "Input level"):
- EP: Euler product (a multiplicative; prime-power support of Lambda_F).
- POS: Lambda_F(n) >= 0. SUPP / SIZE0: support of Lambda_F on prime powers; abs(Lambda_F(n)) <= log n.
- FE: functional equation s <-> 1 - s of zeta's type (a gamma factor and a conductor; DH has its own, that of an
  odd character mod 5), at all heights.
- INT: ordinary Dirichlet series (frequencies log n, n integer).
- SIZE: size normalisation (coefficients O(n^eps), pole at 1 only). GEOM: unimodular local parameters at every prime.
- PER: periodicity of the coefficient sequence (of every twist in the family used) modulo an ideal.
- KER: kernel-side positivity (positive even kernel, log-concavity, the inputs (F), (G), (H) of PR 44/56).

**A2. Device.** A procedure with (i) a declared read set R: the list of inputs and data of F that its steps use;
(ii) a chain of steps, each a statement about F that follows from R and earlier steps; (iii) an output of the form
"F has no zero with Re s > theta" valid in every window [T, T + H] with constants independent of T (requirement R2).
A device may pass through an intermediate statement S(F) (a positivity statement, a bound, a limit) from which the
output follows.

**A3. Read class.** The read class of a read set R is the set K(R) of all F in K for which every input in R holds.
A device "reads only R" if each of its steps is valid for every F in K(R). A line of section B names a read class by
its inputs.

**A4. Defeated by a control.** A device with read set R and output abscissa theta is defeated by a control C in one
of three modes. The outline gave mode (Z) only; modes (S) and (I) are stated here because several outline lines have
"n/a" in the zero column, and the map (section 2, notes on use) records that a sign twist is a control only for
positivity conclusions.

- **(Z) zero mode.** C lies in K(R) and C has a zero with Re s > theta. Then the output is false for C, so the
  device cannot output theta for any member of K(R) from R alone.
- **(S) step mode.** C lies in K(R), and an intermediate statement S of the device is false for C (or the
  conclusion is false for C in the device's own conclusion class, for example "all zeros in the open strip lie on
  Re s = 1/2"). The step that derives S from R is then invalid.
- **(I) identity mode.** Every step of the device that uses R is an exact identity (or a criterion) that holds for
  every C in a set of controls containing members with zeros right of theta; the output is equivalent to the sign
  or the limit of a quantity that the identities do not determine. The device restates the target. No single
  control "has the zero"; the defeat is that the chain contains no inequality that fails for a control.

A line of section B states its mode. A line in mode (Z) gives a floor: the device outputs nothing below the stated
abscissa. Lines in modes (S) and (I) give no numerical floor; they say that the device type has no step that
separates zeta from the control.

**A5. Requirements.** R1: the device uses all primes together with multiplicativity essential. R2: output uniform in
height and valid in every window. R3: the device fails for every control at a named structural step (equivalently:
it is defeated by no control in the sense of A4, and for each control the failing input is named). R4: the device
passes from finite stages, or from the region Re s > 1, to the critical line.

---

## B. Lines 1 to 12 (one lemma per read class)

Each lemma has the fields: read class; control and construction; step at which the control satisfies every input;
floor; map rows; closing lanes with referee counts; label; owed.

### Line 1. Size, positivity or support of Lambda

*(Rewritten by `c10-thin-deletion-zero-mode-control`, 2026-11-18: control DEL in place of the Beurling source.)*

- **Read class.** R = {POS or SIZE0 or SUPP, any linear functional of Lambda, optionally FE}. Linear positivity
  arguments and primes-only quadratic forms belong here.
- **Controls and construction.** TW+: Lambda -> eps_n Lambda, 0 <= eps_n <= 1. TW-: the same with abs(eps_n) <= 1.
  Exact member of TW-: the Liouville twist sum lambda(n) n^-s = zeta(2s)/zeta(s). Member of TW- with a zero in the
  open right half of the strip: THIN (line 7). Member of TW+ with a zero there: **DEL_b** (thin prime deletion,
  `c10-thin-deletion-zero-mode-control` Lemma 1): S a set of primes with
  pi_S(x) = int_2^x t^(b-1) dt/log t + O(x^(b-eta)) (greedy floor rule; density one, not one half: at one half the
  factor is (s - b)^(1/2), a branch point), eps = 0 on powers of primes of S and 1 elsewhere,
  F(s) = prod over p not in S of (1 - p^-s)^-1 = zeta(s)(s - b) W(s), W analytic and non-vanishing on
  Re s > max(b - eta, b/2). DEL_b has POS, SIZE0, SUPP, EP, INT, a simple pole at 1 and a simple zero at any
  prescribed real b in (1/2, 1). E_a (line 3) is a further member with POS and FE that lacks SIZE.
- **Step at which the control satisfies the class.** (a) P23 (`twist-rigidity`, T1 to T4): the character-family
  identity holds with Lambda replaced by any function on prime powers; non-negative weights annihilate prime terms
  up to e^T only at total weight >= 1 + floor(T/log 2). (b) P9 (`screw-canonical`): the admissible window of one
  coefficient w_2 at T = 2 lies within [-2.5e-26, +5.8e-29], so the positivity is not stable under moving one
  coefficient; TW+ and TW- fail the positivity, which is therefore not a consequence of POS, SIZE0 or SUPP. (c) P6
  (Theorem R, `pick-induction`, refereed in `r2-pick-euler-entry` for eta supported on n >= 2): for real eta != 0
  the perturbed function has a non-positive-semidefinite finite Pick matrix on every interval; no property stable
  under Lambda -> Lambda + eta implies all-order positivity. (d) Map section 2, Q3: three results (Theorem R;
  `g-channel-geometry` Thm C; `sq-causal-cascade` Thm 3) give "positivity, size and support of Lambda with the
  functional equation do not suffice". (e) DEL_b: Lambda_F = Lambda on prime powers of primes outside S and 0 on
  the others, so POS, SIZE0 and SUPP hold by construction; the zero at b comes from
  sum over p in S of p^-s = E_1((s - b) log 2) + A(s), A analytic on Re s > b - eta (Lemma 1 of the lane,
  PROVED-rel the short-interval statement S(theta), classical: Hoheisel 1930, Huxley 1972; secondary source opened).
- **Mode and floor.** (S) for TW+ and TW- as classes (the map notes that a finite sign twist passes "no zeros in a
  region" conclusions trivially). (Z) through named members: THIN gives a zero at any real b in (1/2, 1) inside
  {SUPP, SIZE0, EP, GEOM} and, translated by n^(-i tau), at b + i tau; DEL_b gives a zero at any real b in (1/2, 1)
  inside {POS, SUPP, SIZE0, EP, INT, pole, continuation}. Floor: nothing below 1 for either read set. Limits of
  DEL: its zero is real; for any deletion product a zero on the line Re s = b at height tau != 0 comes with a real
  zero at b of at least the same order (Lemma C of the lane), so DEL does not give an isolated non-real zero with
  POS. Reading POS together with GEOM at every rational prime leaves zeta alone (Lemma I of the lane: Lambda_F(p) =
  a(p) log p >= 0 and abs(a(p)) = 1 give a(p) = 1), an identification in mode (I). E_a gives zeros right of 1/2 with
  POS and FE (lacks SIZE). The Liouville twist has zeros at rho/2, in Re s < 1/2: it defeats only conclusions of
  the form "all zeros in the open strip lie on Re s = 1/2" (re-run: abs(F) = 3.0e-41 at 1/4 + 7.06736257087i,
  `recheck_controls.json` of the c9 lane).
- **Numerical record for DEL_b (lane files `del_b0.9_m1_X1e+07.json`, `del_b0.75_m1_X1e+07.json`).** S built to
  1e7 in ball arithmetic. The location of the zero is exact by the lemma; finite data do not enclose it (every
  finite truncation of the product is positive at b). Enclosed, relative to explicit bounds for pi(x) - li(x)
  (Trudgian 2016 Theorem 2, opened; Buthe's theorem with a verified height, recalled): the one-sided derivative
  F'(b+) in [-15.158, -14.494] at b = 0.9 and in [-6.737, -6.464] at b = 0.75.
- **Map rows.** P9, P23, P6; section 2 rows TW+, TW-, Q3. DEL has no map row yet (proposed: section 2 control row).
- **Lanes and referee count.** `screw-canonical` 1 ref; `twist-rigidity` 1 ref; `r2-pick-euler-entry` 1 ref;
  `pick-induction` 0 ref; `g-channel-geometry` 1 ref; `sq-causal-cascade` 0 ref;
  `c10-thin-deletion-zero-mode-control` 0 ref at the time of writing (construction first given in section 5 of
  `c9-obstruction-record-statement/REFEREE.md`, one pass, ARGUED).
- **Label.** ARGUED (source labels: PROVED lemmas, MEASURED bounds; each closing lane has at most one referee).
- **Owed.** A second referee on P9 or P23. A referee for `sq-causal-cascade` Thm 3 if the "three lanes" sentence
  is kept. A referee on Lemma 1 of the DEL lane. The primary text of one short-interval theorem (shared with
  line 7).

### Line 2. Functional equation + kernel positivity + ordinary Dirichlet series, no Euler product

- **Read class.** R = {FE, INT, KER, finite-order Pick or Weil positivity}; EP not read.
- **Control and construction.** DH, the Davenport-Heilbronn function: a linear combination of L(s, chi) and
  L(s, conj chi), chi a complex character mod 5, with a functional equation s <-> 1 - s of its own and no Euler
  product (first defect at n = 6: a(6) - a(2)a(3) = 1.0807; map section 2 row DH).
- **Step at which the control satisfies the class.** FE: exact (classical). INT: by construction. KER: positive
  even theta kernel, strictly log-concave on u >= 0, u L'' - L' < 0 on u > 0 (Arb certificate, `c1-missing-controls`
  Part C). Finite Pick positivity: DH passes orders 2 to 148 (P3; Richards chain r_0..r_147 > 0, r_148 < 0 at
  anchors a <= 3, P7, certified). Taylor blocks positive through order 164 / 169 (P21). Identity-type steps hold
  for DH verbatim (P8, D3, D7; mode (I), line 11).
- **Mode and floor.** (Z). DH has zeros at 0.8085171825 + 85.6993484854i and 0.6508300806 + 114.1633427308i and
  zeros with Re s > 1 (sup Re about 1.1203625). A device reading only R outputs nothing below Re s = 1.12.
- **Map rows.** P3, P7, P8, P18, P21, D3, D7; section 2 row DH.
- **Lanes and referee count.** `pick/NEXT_STAGE.md` (`pick/REFEREE.md`, `pick/AUDIT.md`; outside `push/`);
  `r2-pick-euler-entry` 1 ref; `dh-separator` 1 ref; `b-lacunary-threshold` 1 ref; `b-codex-zero-channels` 1 ref;
  `c5-device-table-extension` 1 ref; `c1-missing-controls` 2 ref files (REFEREE2 covers Part D only, so Part C
  has 1 ref).
- **Label.** MEASURED (certified interval arithmetic for the Pick orders and the kernel; DH zeros numerical).
- **Owed.** One lemma "finite Pick orders are Euler-blind" with a statement that does not depend on the order
  reached, and two referees; a second referee on Part C of `c1-missing-controls`.

### Line 3. Euler product + Lambda >= 0 + functional equation + explicit formula + growth, without SIZE

- **Read class.** R = {EP, POS, FE, explicit formula, ZF(theta) as hypothesis, growth in vertical strips}; SIZE
  and GEOM not read.
- **Control and construction.** E_a(s) = zeta(s + a) zeta(s - a), 0 < a < 1/2.
- **Step at which the control satisfies the class.** EP: product of two Euler products, local parameters
  p^(+a), p^(-a). POS: Lambda_{E_a}(n) = Lambda(n)(n^a + n^-a) >= 0. FE: xi(s + a) xi(s - a) is invariant under
  s -> 1 - s. Explicit formula and growth: inherited from zeta. Z16 (`bootstrap`): every inequality built from the
  identity, POS, FE, ZF(theta) and growth holds for E_a, and the bootstrap map is f(theta) = theta. P25
  (`sym-power-positivity`): the zeta part of a non-negative 3-4-1 combination with companions is a non-negative
  cosine polynomial with the same a_0, a_1. P14: the Nyman-Beurling rate at sigma_0 is equivalent to ZF.
  F8: E_a passes the anchor step of the heat-time certificate.
- **Mode and floor.** (Z). E_a vanishes at 1/2 + a + i gamma for every ordinate gamma of a zero of zeta on the line
  (re-run at a = 0.2, gamma_1: abs = 9.3e-42). Floor: a device reading only R outputs nothing below 1/2 + a for
  each a < 1/2, hence nothing below 1.
- **Map rows.** P14, P25, Z16, F8; section 2 row EA.
- **Lanes and referee count.** `nyman-baez-duarte` 1 ref; `sym-power-positivity` 1 ref; `bootstrap` 0 ref;
  `e1-euler-anchor-heat-certificate` 1 ref.
- **Label.** ARGUED (the construction is elementary; the sentence "every inequality from these inputs holds for
  E_a" is from the unrefereed lane `bootstrap`).
- **Owed.** A referee for Z16. "Size normalisation" written as a hypothesis (SIZE and GEOM of A1) in the lemma.

### Line 4. Hypotheses stable under small backward heat flow

- **Read class.** R = any set of hypotheses that holds for H_tau, tau in (-tau_0, 0], whenever it holds at tau = 0:
  KER, evenness, order one, monotone flow functionals, the inputs (F), (G), (H) of PR 44/56.
- **Control and construction.** HEAT: the family with kernel e^(tau u^2/16) kappa(u), tau < 0.
- **Step at which the control satisfies the class.** By definition of the class for the kernel-side inputs (map
  section 2 row HEAT: evenness, order one, every kernel-side positivity input, absolute convergence at every w).
  F1 (`b-escape-law`): for every tau > 0, H_{-tau} has zeros with abs(Im z) -> infinity along a relatively dense
  set of heights; at least cX zeros outside any strip up to height X; every horizontal-strip statement true for xi
  is flow-critical. Q20 (`e1-burgers-cascade-anticausal`): a non-negative functional vanishing on axis
  configurations and monotone along the flow is non-increasing, so it bounds t = 0 only by values at t < 0. P21:
  Taylor blocks of order <= 16 stay positive on backward heat down to tau = -0.5.
- **Mode and floor.** (Z). Off-line zeros located (mpmath quadrature, 110/300 digits, one referee): tau = -0.1:
  0.0215579 + 415.2562790i; tau = -0.5: 0.1981079 + 150.6922461i; tau = -2: 0.2485774 + 49.7154476i and
  0.6247240 + 60.7078706i (lane variable; map row HEAT). Zeros leave every strip, so there is no floor inside the
  strip: a device reading only flow-stable hypotheses outputs no strip statement.
- **Map rows.** F1, Q20, P21; section 2 row HEAT.
- **Lanes and referee count.** `b-escape-law` 1 ref; `e1-burgers-cascade-anticausal` 1 ref;
  `b-codex-zero-channels` 1 ref.
- **Label.** MEASURED for the located zeros (not interval-certified); the escape law is PROVED at source with one
  referee, so ARGUED here.
- **Owed.** A second referee on F1 (with the Lemma R tail repair for the sharp-reach clause, or the clause dropped).

### Line 5. Euler product + Lambda >= 0 + pole, without the functional equation

*(Rewritten by `c10-thin-deletion-zero-mode-control`, 2026-11-18: control DEL in place of the Beurling source. The
title drops "or the integers": the control is an ordinary Dirichlet series over the integers.)*

- **Read class.** R = {EP, POS, simple pole at 1, continuation, GEOM at the primes of the system}; FE not read; INT
  optional (DEL has it).
- **Control and construction.** DEL_b (`c10-thin-deletion-zero-mode-control` Lemma 1), read in two ways.
  (i) As a Beurling system: generalised primes = the primes outside S, generalised integers = the integers with no
  prime factor in S, counting function G(1) x + O(x^(b+eps)) with G(1) = prod over p in S of (1 - 1/p) > 0; its
  zeta function is F, with Euler product, Lambda_F >= 0, unimodular local parameter at each generalised prime, a
  simple pole at 1, continuation to Re s > max(b - eta, b/2) and a simple zero at the real point b, any b in
  (1/2, 1). (ii) As an ordinary Dirichlet series over the integers: coefficients 0 or 1, completely multiplicative;
  INT holds, and GEOM fails exactly at the primes of S (local parameter 0).
  The literature control B (map section 2 row B, "literature; not re-read") is no longer used by this line.
  What DEL does not reproduce from the statement attributed to that literature: a counting function with error
  exponent below the real part of the zero (proved here: exponent b + eps only), and zeros at non-zero height that
  are not zeros of zeta.
- **Step at which the control satisfies the class.** EP, POS and the pole hold by construction; continuation and
  the zero are Lemma 1 of the lane (PROVED-rel S(theta)). P46 (`c4-helson-discrepancy-zerofree`, Theorem 1), in
  the transferred form: F/zeta = exp(-A) with A having non-negative coefficients; Landau's theorem gives abscissa
  b, and right of b the zeros of F are those of zeta. P36: the Legendre-LP dual inputs hold for DEL
  (Lambda_F >= 0, and here over the integers). P25: 3-4-1 positivity with translates holds (POS).
- **Mode and floor.** (Z), relative to S(theta): there is theta < 1 and c > 0 with
  pi(y + y^theta) - pi(y) >= c y^theta/log y for y >= y_0 (Hoheisel 1930; Huxley 1972 with theta > 7/12, as an
  asymptotic; statement read in a secondary source, primary texts not opened). Floor: nothing below 1 from R
  alone, for real zeros; for zeros at non-zero height with POS see Lemma C of the lane.
- **Map rows.** P46, P36, P25; section 2 row B (kept in the map as a literature pointer); DEL has no map row yet.
- **Lanes and referee count.** `c4-helson-discrepancy-zerofree` 1 ref; second derivation of Theorem 1 and the
  complement Theorem 2 in `c5-repair-engine-map-r4` 2 ref files; `e1-cofinal-legendre-dual` 1 ref;
  `sym-power-positivity` 1 ref; `c10-thin-deletion-zero-mode-control` 0 ref at the time of writing.
- **Label.** ARGUED (the control is on file and proved relative to a classical theorem; it has no referee yet; the
  transfer statement of P46 has two referee files).
- **Owed.** A referee on Lemma 1 of the DEL lane. The primary text of one short-interval theorem (shared with
  lines 1 and 7). The debt "open the Beurling source" is removed from this line; it remains only if a control with
  POS and a zero at non-zero height off zeta's set, or with counting error below the zero, is wanted.

### Line 6. Anything invariant under a change of local test vector at one prime

- **Read class.** R = any hypotheses unchanged when the local factor (Tate test vector) at one prime q is changed:
  multiplicative coefficients, zeta's gamma factor, field-level FE, pole at 1, KER.
- **Control and construction.** NR, the T-NR twin: F(s) = xi(s)(2 cosh((s - 1/2) log q) + c), abs(c) > 2.
- **Step at which the control satisfies the class.** The extra factor is invariant under s -> 1 - s (cosh is
  even), entire, and a finite Dirichlet polynomial in q^(+-s): F keeps FE, the gamma factor, the pole and
  multiplicative coefficients. It lacks POS and temperedness at q only (non-spherical test vector). Z18
  (`r3-tnr-control`): the 7/8 argument excludes the twin through the local hypothesis abs(eta(p)) = 1.
- **Mode and floor.** (Z). Zeros of the factor: Re s = 1/2 +- arccosh(abs(c)/2)/log q at heights
  (2k+1) pi/log q (c > 0). q = 3, c = 2.2: zero at 0.9037532 + 2.8596009i, ten heights below 60 (referee value;
  re-run: abs(factor) = 3.8e-43, `recheck_controls.json`). abs(c) -> infinity moves the zeros arbitrarily far
  right: no floor from R alone.
- **Map rows.** Z18; section 2 row NR; section 5 part 5 (L1, L4).
- **Lanes and referee count.** `r3-tnr-control` 1 ref. The referee's verdict is "holds = false as labelled": two
  statements labelled PROVED or "unchanged" in the lane do not survive; the twin, its zeros, the core obstruction
  and Proposition N at the residue point survive.
- **Label.** ARGUED (twin and zeros exact and re-run; the localisation of the binding step is ARGUED at source).
- **Owed.** A second referee, on the corrected text; the line should cite only the surviving statements.

### Line 7. Complete multiplicativity with unimodular local parameters, plus any discrepancy or twisted-sum hypothesis that is not periodicity

- **Read class.** R = {EP with a completely multiplicative, GEOM, INT, continuation, simple pole at 1, agreement
  with zeta at a set of primes of relative density one, power-saving discrepancy of partial sums, power-saving
  additive twists in the general form}; PER and FE not read.
- **Control and construction.** THIN: eps completely multiplicative, eps(p) = -1 on a set S of primes with
  pi_S(x) = (1/2) int_2^x t^(b-1) dt/log t + O(x^(b-eta)) (greedy floor rule), +1 elsewhere;
  F = sum eps(n) n^-s = zeta(s)(s - b) W(s), W analytic and non-vanishing on Re s > max(b - eta, b/3).
  Also U (a unimodular completely multiplicative twist) at stage level.
- **Step at which the control satisfies the class.** `c4-thin-twist-control-78` Theorem 1 (i), (ii): P_S(s) =
  (1/2) E_1((s - b) log 2) + A(s) and log G = -2 P_S + T give the factor (s - b) W; the counting hypothesis on S
  comes from a short-interval prime theorem of Hoheisel type (eta > 0). Partial sums c x + O(x^(b+eps)) (elementary).
  P51 (`c5-twisted-helson-arcs`): THIN passes the general additive-twist form with error O(q x^(b+eps)); the strict
  form (no main term at q > 1) with limsup abs(S(x))/x > 0 identifies chi(n) = n^(-i alpha) (Lemma A, Theorem 1').
  P46: right of its real zero the zeros of F are those of zeta. D4: sign twists, THIN, U, WT pass every step of the
  tensor-power squeeze.
- **Mode and floor.** (Z), relative to the short-interval input. Simple zero at s = b for any real b in (1/2, 1);
  translate by n^(-i tau) for b + i tau. Floor: nothing below 1 from R alone. For the 7/8 proof the first step not
  available to THIN is the periodicity of the target weight (manuscript Prop. 5.1, through Lemmas 5.2 and 5.8):
  ARGUED from the hypotheses, proofs not replayed.
- **Map rows.** Section 2 row THIN; P46, P51, D4; Z25 (Proposition D: low estimate and high comparison cannot both
  hold for eps; which fails is open).
- **Lanes and referee count.** `c4-thin-twist-control-78` 1 ref; `c5-thin-walk-replay` 2 ref files (REFEREE2
  locates the ray-class short-interval theorem at second hand; it is not a second pass on the construction);
  `c5-twisted-helson-arcs` 2 ref files (REFEREE: all PROVED steps; REFEREE2: Lemma A step (c));
  `c4-helson-discrepancy-zerofree` 1 ref; `c5-device-table-extension` 1 ref; `c5-thin-propd-dichotomy` 1 ref.
- **Label.** ARGUED. The THIN construction is proved relative to a counting form of a short-interval prime theorem
  (Huxley's asymptotic, classical; ray-class variant relative to Coleman 1990, Theorem 2.1, read through two
  secondary quotations); the construction has one referee.
- **Owed.** Open the primary source for the ray-class short-interval statement; a second referee on Theorem 1 of
  `c4-thin-twist-control-78`.

### Line 8. Frequencies log n only

- **Read class.** R = {the frequency set {log n}, linear forms in logarithms of primes (Baker, Matveev), finite
  Turan power-sum inequalities}; the coefficients a(n) are not read.
- **Control.** Every Dirichlet-series control with the same frequencies: DH, TW+, TW-, THIN, U, WT.
- **Step at which the control satisfies the class.** D1: a bound on abs(log m - log n) or on a linear form in log p
  concerns the frequencies only, so it holds for every series over the integers; its non-trivial content is a
  polylogarithmic gap for S-units with fixed S, giving window-uniform mean squares of a fixed Euler stage; no finite
  stage carries the functional equation (G10, Q10). D6: the finite Turan inequality is coefficient-blind with loss
  e^(-cn). The limit form (Turan's equivalence between a zero-free strip and a power saving for sum p^(i tau)) is
  quoted for zeta only, from memory, not re-read; it restates the target as a prime-sum bound.
- **Mode and floor.** (I) for the device type; (Z) through DH and THIN, which satisfy R: floor Re s = 1.12 (DH).
- **Map rows.** D1, D6.
- **Lanes and referee count.** `c5-device-table-extension` 1 ref (six wording corrections applied in the map).
- **Label.** ARGUED (source labels: PROVED elementary, MEASURED exponents, CLASSICAL not re-read).
- **Owed.** A second referee; Turan's equivalence opened if the limit form is kept in the line.

### Line 9. Discrete special values

- **Read class.** R = {the values zeta(1 - k), k >= 1, and data that are functions of them: p-adic interpolation
  for all p, Iwasawa-module data}; FE and EP not read.
- **Control and construction.** Interpolation twin C_c(s) = zeta(s) + c L(s, chi_-4) L(s, chi_5).
- **Step at which the control satisfies the class.** L(s, chi_-4) (odd character) vanishes at s = -1, -3, ...;
  L(s, chi_5) (even character) vanishes at s = 0, -2, ...;
  the product vanishes at every non-positive integer, so C_c(-k) = zeta(-k) for all k >= 0 and all c
  (`c5-device-table-extension` REFEREE section 1, step (e); re-run: max abs of the product at s = 0..-5 is 2.8e-45).
  C_c is an ordinary Dirichlet series with the same pole and finite order.
- **Mode and floor.** (Z). For c = -zeta(s0)/(L(s0, chi_-4) L(s0, chi_5)) the twin vanishes at any prescribed s0
  where the product is non-zero. c = 1: zero at 0.8641 + 29.9504i (MEASURED; re-run 0.8640996018 + 29.95041277i).
  No floor from R alone. The twin says nothing about devices that use FE (Hamburger uniqueness).
- **Map rows.** D5; section 2 note "Interpolation twin".
- **Lanes and referee count.** `c5-device-table-extension` 1 ref.
- **Label.** MEASURED for the located zero; the agreement at non-positive integers is elementary; one referee.
- **Owed.** A second referee; the exact statement of which p-adic data are functions of zeta(1 - k) (the line
  uses "the p-adic data for all p are functions of zeta(1 - k), k >= 1" as stated in D5).

### Line 10. Mean values over heights or over a family as the only input to an every-window conclusion

- **Read class.** R = {mean squares or higher moments over t in [T, 2T], large-sieve and density bounds, mollified
  moments, sums over a family with non-negative weights}; no pointwise input.
- **Controls and construction.** Cluster lifts F = zeta (p + q)/p (one off-line pair; `b-mvcap-function-side`);
  a family with one exceptional member; WT (height translates of zeta).
- **Step at which the control satisfies the class.** P29: the lift has sup over Re s >= sigma of abs(F/zeta - 1)
  <= 2E + E^2 with E between 8.7e-6 and 3.3e-8 at sigma = 2, with one off-line pair in one window; proved relative
  to hypothesis H_W (not known for any lane window above 3e12). Map section 5 part 1 (MV-CAP): mean-value inputs
  give proportions or densities, never an empty set (rows P27, P29, Q9, Q18, Z17). P15: the first moment of the
  Nyman-Beurling Gram matrix gives mean-value statements only. P23: a non-negative family sum gives no information
  on a single member. Q25 (pending) item on family sums: below tilt 3/8 a family bound controls a member only when
  it is below one unit of the index; for twists n^(-i alpha_k) the family sum is a sum over height translates of
  one member.
- **Mode and floor.** (Z) relative to H_W for cluster lifts; (S) otherwise (map section 5 part 1: mean-value
  inputs give proportions or densities). No abscissa: the line says that R gives densities, and density zero is
  not the empty set.
- **Map rows.** P29, P15, P23, P50 (density half: not run); section 5 part 1; Q25 (pending).
- **Lanes and referee count.** `b-mvcap-function-side` 1 ref; `c1-pd-log-strip` 1 ref; `b-route-m-first-moment`
  1 ref; `twist-rigidity` 1 ref; `c6-quadratic-companion-positivity` (P50) 1 ref;
  `c7-bridge-seven-eighths-krein-index` 1 ref.
- **Label.** ARGUED (P29 is PROVED-rel H_W at source; MV-CAP is used in the map as a filter and has no single
  refereed statement).
- **Owed.** One statement of MV-CAP in the form used ("a hypothesis that is a mean value over heights or over a
  family with non-negative weights is satisfied by a member with one off-line pair in one window") with two
  referees; the density half of P50.

### Line 11. Exact identities with no inequality

- **Read class.** R = {explicit formula, residue theorem, Poisson-Jensen and Dirichlet-to-Neumann identities,
  uniqueness theorems, bridge traces}: every step is an equality valid for the whole class.
- **Control.** Every control for which the identity is formulable.
- **Step at which the control satisfies the class.** P1 (`eq48`): on each finite exponential test the residual
  target equals Weil's functional on a one-sided test, Q_L(v) = sum over rho of V(rho) conj V(-conj rho); the
  identity holds for DH and E_a. P8 (`dh-separator`): Q(e^(-zt)) = Re L(z)/Re z; the positivity region equals the
  zero-free region; the identity holds for DH, HEAT, E_a, NR (starred: inferred). L2 (`b-euler-detector`): Euler at
  p in an FE-space identifies the function and does not locate zeros. D7: the strip Dirichlet-to-Neumann identity
  holds for DH with its pole terms; the sign of the pole sum is undetermined. Q25 (pending) items 1, 2: the
  single-cutoff trace does not depend on c; the prime-side value of every member block is zero before any family
  sum.
- **Mode and floor.** (I). No floor: the identity holds for each control and its sign reads the zeros.
- **Map rows.** P1, P8, L2, D7; section 5 part 2; Q25 (pending).
- **Lanes and referee count.** `eq48/` (outside `push/`; RESULT.md + REFEREE.md, 1 ref); `dh-separator` 1 ref;
  `g-renderer-learnings` 1 ref; `b-euler-detector` 1 ref; `c5-device-table-extension` 1 ref;
  `c7-bridge-seven-eighths-krein-index` 1 ref.
- **Label.** ARGUED by the label rule (each identity is PROVED at source with one referee; the line as a statement
  about a device type, "identity, no lever", has no two-referee form).
- **Owed.** Wording only: the line must say "the identity holds for control C" per control, with the starred
  (inferred) cells of P8 either checked or named as inferred.

### Line 12. Finite stages, finite prime sets or finite orders, with a limit taken afterwards

- **Read class.** R = {properties of Euler stages E_P or of finite-order certificates that hold at each finite P or
  order K: Lee-Yang property, polydisc stability, Hurwitz non-vanishing of stages, Krein-index semicontinuity,
  finite Pick orders}, followed by P -> infinity or K -> infinity.
- **Controls.** U and random unimodular twists (stage level); DH (finite Pick order, line 2).
- **Step at which the control satisfies the class.** Q19 (`c1-leeyang-krein-limit`): rank Gamma_- is lower
  semicontinuous under bounded weak-* convergence; in the self-dual normalisation every stage symbol is inner and
  tends to -1 on Re z > 0 for zeta and for every unimodular twist; with gamma factor and pole renormalisation,
  zero-free in Re s > theta iff the stages are locally bounded on {Re s > theta, s != 1} (Hurwitz and von Koch).
  Stage pole counts are the same for U and random twists (measured). Q21 (`c2-polydisc-leeyang-bound`): a bound
  valid for every member of a class closed under torus rotations is at least the maximum over the torus; a
  unimodular twist is a torus rotation; for zeta sup over t of abs(G_P(sigma + it)) >= E_P(sigma) for every P and
  0 < sigma < 1 (statement in the pointwise form corrected by the referee). P3: every finite Pick order K <= 12
  follows from verified height; DH passes orders 2 to 148.
- **Mode and floor.** (I)/(S). The stage properties hold for U at every stage, and the limit step is equivalent to
  the zero-free statement for every F: the device has no closed limit step. No numerical floor. (U is a control at
  stage level; it is not asserted here to have a zero at a given point.)
- **Map rows.** Q19, Q21, P3; section 5 parts 1 and 4.
- **Lanes and referee count.** `c1-leeyang-krein-limit` 1 ref (flags set by its referee: R1 true as a stage
  ingredient only; R2, R3, R4 false); `c2-polydisc-leeyang-bound` 1 ref; `pick/` (REFEREE.md, AUDIT.md).
- **Label.** ARGUED (Q19, Q21 PROVED at source with one referee each; stage pole counts MEASURED).
- **Owed.** A second referee on Q21 in the corrected pointwise form (rotation invariance of stage tools).

---

## C. The clause on R1, R3 and R4

**Clause.** Within the read classes of lines 1 to 12 (and lines 13 to 20 of the outline, not rewritten here), a
device that supplies R1, R3 and R4 together must read, in one step, at least the items below. Each item is tied to
the control that defeats a device omitting it, and to the line that records the defeat. The clause is a summary of
section B; its strength is that of the weakest line it cites (no line is PROVED under the label rule).

| # | the device must read | control that defeats the omission | mode | line | map rows |
|---|---|---|---|---|---|
| 1a | the coefficients through a multiplicative relation (an Euler product), not only FE and kernel positivity | DH | (Z) | 2 | P3, P7, P8, P18 |
| 1b | the coefficients at all primes jointly through that relation, not their sizes, signs or support | TW+, TW- (step); THIN, E_a, B (zero) | (S), (Z) | 1 | P9, P23, P6 |
| 1c | the coefficients, not the frequencies log n alone | DH, THIN (same frequencies) | (I), (Z) | 8 | D1, D6 |
| 2a | the functional equation or an equivalent global symmetry (the integers) | B (no FE, no integers); THIN, U (no FE) | (Z) | 5, 7 | P46, P36, P51 |
| 2b | that symmetry at all heights, not in one window or a fixed number of windows | WT | (S) | outline line 14, not rewritten here | P40, S12 |
| 2c | that symmetry in a form that changes under s -> s + 1 - b and F -> 1/F | RZ_b = 1/zeta(s + 1 - b) (engine node `ctrl-rz-reciprocal-shift`; map row T2: the Landau criterion holds verbatim for U, RZ_b, DH) | (I) | not among lines 1 to 12; cited from row T2 | T2 |
| 3 | the unimodular size normalisation of the local parameters (SIZE, GEOM), at every prime | E_a (global); NR (one prime) | (Z) | 3, 6 | Z16, P25, P14, Z18 |
| 4 | an input that fails for a non-periodic completely multiplicative unimodular weight; in the one known mechanism, lattice-translation invariance of the coefficients (PER) | THIN | (Z) | 7 | THIN row, P46, P51, D4 |
| 5a | an input not stable under backward heat flow | HEAT | (Z) | 4 | F1, Q20, P21 |
| 5b | an input that is not a mean value over heights or over a family | cluster lifts; a family with one exceptional member; WT | (Z)-rel H_W, (S) | 10 | P29, P15, P23, P50 |
| 6a | more than discrete special values | interpolation twin | (Z) | 9 | D5 |
| 6b | an inequality: a step that is not an exact identity valid for the controls | every control | (I) | 11 | P1, P8, L2, D7 |
| 6c | a limit or crossing step that is closed: not "finite stage, then limit" with stage data shared by U | U, random twists; DH at finite Pick order | (I)/(S) | 12 | Q19, Q21, P3 |

and its limit or crossing step must not be one of the closed device types of section D.

Items 1 to 5 are the five items of the outline; 6a to 6c are lines 9, 11 and 12 written as items. Item 2c is not
supported by a line of this file and is carried from the outline with its map row only; lane B should either supply
a line for it or drop it.

Relation to the requirements. R1 corresponds to items 1a to 1c and 3; R3 to all items (each names the control); R4
to items 5a, 5b, 6b, 6c. R2 is part of the device definition (A2). Map section 2, "Input level", gives the same
content in input codes: every control lacks at least one of FE, SIZE, GEOM, INT; the minimal input sets hit by all
seven original controls are {FE, SIZE}, {FE, GEOM}, {INT, GEOM}; POS and prime-power support are in none.

---

## D. The one mechanism with R1 to R3 (outline section 3, updated with the round-8 outcomes)

The 7/8 mechanism (outline line 20: a coherent set with a large sieve) is the only row that every listed control
fails (map section 5 part 6; S1). Its sources (manuscript, Liu I, II) are unrefereed. Rows carried from the outline
are unchanged; rows marked "round 8" are new. Sources: `campaign/ROUND_LOG.md` "Round 8 results" and lessons 1 to 7;
`campaign/round8_records.json`; the lanes named.

| statement | closing lane | map row | referee state |
|---|---|---|---|
| signal constant h is an invariant of the probe (re-expression does not change it) | `c5-target-fe-order2-ledger` (Lemma U) | Z15b | 2 ref |
| abelian families do not absorb mu | `c5-angular-family-absorption` | Z22 | 2 ref; abstract-family statement ARGUED |
| probes of higher degree in the target reduce to the linear system | `c6-pair-probe-bridge-order2` | Z15c | 1 ref |
| double covers through local data give no weight-0 cocycle | `c6-gl3-cover-epsilon-cocycle` | Z23 | 1 ref, claim narrowed |
| normaliser H_eta: cap at abscissa 2/3 for sextic rows | `c6-marks-bc-manuscript-check` (Lemma H, H1, S) | Z24 | Lemma H 3 ref; (2.2) iff sigma_0 > 2/3 |
| cap 1 - 1/r + lx/(2r) for every l2-l2 low estimate, no hypothesis lx >= l | `c7-probe-format-h-cap` (Theorem K, Lemma HS) | Z27 (pending) | 2 ref |
| phase-blind low estimates have B >= 1 | same (Lemma A) | Z27 (pending) | ARGUED; sub-step open (non-principal rows of the twisted target) |
| periodicity sits in the low half as the absence of one Hermitian term; it carries neither R1 nor R4 | `c7-liou-high-row-bound`; `c8-liou-row-bound-theorem` (Theorem A) | Z28 (pending) | 1 ref each; relative to a fixed-twist form of Blomer-Goldmakher-Louvel Cor. 1.4; THIN conditional on a zero-free half-plane for twists of zeta_F |
| family sums and family indices of bridge forms under the 7/8 input: gain 0 | `c7-bridge-seven-eighths-krein-index` | Q25 (pending) | 1 ref |
| **round 8.** Single-row bridge: closed. One theta row is T = L0 D with L0 = L(3s - 1/2, psi); the row's reflection axis is Re w = 1 of its Euler factor L0, at distance 1/6 (in s) from L0's critical line. The bridge of T is blind to zeros of L0; the bridge of D reads them as an identity with no sign. With the family-sum row, the bridge / 7/8 junction has no open member | `c8-single-row-bridge-crossing` | Q26 (proposed here) | 1 ref, holds with five corrections (E1 to E5; "T entire" does not hold for the measured row; proviso on the pole of L0 at w = 1) |
| **round 8.** (E-K) equals a mean value of 1/L over the order-6 twist family of the target: Sum_m g_X(m) abs(B_m)^2 = X D + X Sum_{k != 0} F_k, F_k bilinear in Moebius sums over that family. Under GRH for the family it holds for X >= ZP (outline of a proof); the window Z/P < X < ZP is open. (E-K) is not an operator-norm statement and not an independent input | `c8-ek-theta-second-moment-formula` | Z30 (proposed here) | 1 ref, holds; Lemma 1 PROVED at source; Theorem 2 conditional, in outline; referee: the excess form is positive semidefinite, not of signature (2,2) |
| **round 8.** Row energy is not a separator: in F_q[T] (q = 7, 13, squarefree unreflected marked rows) row energy = diagonal + squared signal; Weil targets sit at the diagonal in the bulk and so do random-phase, random-sign, multiplicative-sign and two-character vectors (the mean over random phases equals the diagonal exactly, Lemma R). A diagonal-level row bound implies the Moebius bound of the weight | `c8-ek-ff-reflected-rows-exact` | Z30 (proposed here) | 1 ref, holds in reduced form; reflected completed rows not run; failure beyond h = 3 argued from 5 cases |
| **round 8.** (E-H) is necessity: NP = I - I_1 exactly; given the low estimate, a bound on NP is necessary and sufficient for the conclusion (true of every proved high-side input too, so this does not close (E-H)). Closed: the termwise treatment (floor 13/15 in the model) and the norm treatment (31/36 with (E-K)). Target-specific treatment undecided: (E-H) stays an open escape | `c8-eh-nonprincipal-row-cancellation` | Z31 (proposed here) | 1 ref, **not held** as worded (headline "circular" is a non sequitur); computations and identities confirmed |
| **round 8.** Lemma C needs the high half: the coherent term is the Cauchy-Schwarz step of Proposition 2.1 solved for the row energy; (C1) holds only relative to the unproved high half (HC) and beta* > 2/3. In F_q[T]: E = S + Rem, Rem >= 0, exact. The marks branch is reduced to (E-K), not closed | `c8-row-energy-squared-signal` | Z27 (pending), E1 of MAP_PENDING Part 2 | 3 ref files (holds with corrections E1 to E8); an obstruction statement |

Open inside the mechanism after round 8: (E-K) in the window Z/P < X < ZP (statement (MV6), lanes `c9-mv6-*`);
(E-H) target-specific excess (lane `c9-eh-dual-r5-target-excess`), which also settles Lemma A; the normaliser
ceiling 2/3 (lane `c9-normaliser-cap-avoidance`); global Whittaker constants on the double cover of GL(3)
(untouched). Closed in round 8: the single-row bridge; (E-K) as an operator-norm or sieve statement; row energy as a
separator of target from control; Lemma C as a stand-alone circularity statement; (E-H) by termwise or norm bounds.
The compensated probe (12.5) in F_q[T]: h > 1 survives, low input unchanged (`c8-ek-ff-reflected-rows-exact`).

Closed device types for the last sentence of the clause (section C): bridge forms on a single row and on family
sums (Q26 proposed, Q25 pending); operator-norm low estimates below 1 - 1/r (Z27 pending); abelian family
absorption (Z22); re-expression of the probe (Z15b); pair probes (Z15c); bootstrap of the half-plane (Z16, P14);
finite stages with a limit (line 12); mean values over the family (line 10).

Sub-statements of this file with two or more referee files: (1) P46 transfer theorem (Theorem 1 with second
derivation; Theorem 2), lines 5 and 7; (2) P51 Lemma A and Theorem 1', line 7; (3) Z27 Theorem K and the
Hilbert-Schmidt bound, section D. Also Z15b (Lemma U), Z22, Z24 (Lemma H, 3 ref) and
`c8-row-energy-squared-signal` (3 ref files) in section D. None is a statement about zeros of zeta.

---

## E. Not covered (outline section 4, unchanged, plus control EIS-w)

- Devices of types absent from `engine/curated/devices.json` (the explore slot of each round adds to this list).
- Sections of the prime chain with P(t) growing like a power of t; J-expansive sections.
- Lax-Phillips Hecke norms outside the weighted-L^2 family; rank >= 2 compact-at-infinity squares without a Hecke rule.
- The density (family) half of quadratic positivity with automorphic companions.
- Controls not run in many lanes: T-NR, Beurling, the phase-rotated transfer operator and theta^w appear in few rows;
  a line of section B names one control and does not claim the others were run.
- Statements whose only source is an unrefereed manuscript (the 7/8 theorem and its follow-ups) are relative to it.

Added in round 8:

- **Control EIS-w** (`c8-hecke-entropy-resonance-rigidity`, Proposition 4): the Eisenstein series E(z, w') off
  resonance, Re w' in (1/2, 1), t' != 0. It keeps the group, the functional equation, the Euler product and the Hecke
  algebra, and passes every step of the Hecke-recurrence device; WT is a case of it. Rule proposed by the lane: a
  device on the modular surface must name the step that fails for E(., w') with phi(w') != 0, that is, it must read
  phi(w) = 0. State: the lane's record is **not held** by its referee (Lemma G2 (i), a DH-type control on
  Gamma_1(5), is identically zero, so a lemma labelled PROVED is vacuous); Proposition 4 itself was not the
  rejected step. EIS-w is therefore listed here as a control that is not yet in map section 2 and was run in one
  lane only. No line of section B uses it. Owed: second pass on the lane after Lemma G2 is replaced (lane
  `c9-repair-referee-debts-r8`).
- Lines 13 to 20 of the outline are not rewritten in this file (lane A covers lines 1 to 12).
- Item 2c of the clause (control RZ_b) has no line.
- Mode (Z) of lines 5, 7 and 10 is relative to inputs not on file (Beurling literature; short-interval theorem;
  hypothesis H_W).
