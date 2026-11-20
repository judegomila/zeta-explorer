# c14-prefilter-sweep-geometric-nodes: RESULT

Round 14, kind combine (round-13 combinable 1). Date 2026-11-19. Local only: the node selection, the table build and one mpmath check at 80 digits ran through
`scripts/memcap.sh 8` (all under 100 MB, under one minute); a few short JSON inspections of the 4 MB graph file
and of this lane's own outputs ran as plain `python3` one-liners. The server was not used. Repo data modules were not imported or executed; the graph and devices.json were
read as JSON text. Nothing here is a statement about zeros of zeta. No requirement flag is claimed.

Labels: PROVED (argument here or exact pointer) / CLASSICAL / MEASURED / ARGUED / READ (a typing made by reading a
node statement; a judgment, not a proof).

## Verdict

Precise obstruction, with the pre-filter stated as one lemma (three questions) and applied to 443 nodes.

1. **Lemma F (three-question pre-filter).** One closure statement with three instances: Q-P (T-NR, positive
   multiplier at one prime; Lemma P of round 13), Q-B (Blaschke multiplication of a coefficient that carries the
   strip zeros as zeros; proved here for Schur, Pick and bounded-analytic conditions, pointer for the Nevanlinna
   form), Q-S (symmetric multipliers when the target enters linearly or by division; Lemma M of round 13). Section 2
   lists what each question does not cover.
2. **Control check: 0 disagreements.** The 14 device types of round 13 with a T-NR record (13 by name, 1 generic)
   reproduce. Three recorded passes on which Lemma P alone is silent (Maass-Selberg positivity on the Eisenstein
   carrier; the Fourier-interpolation kernel; the X_0(4) twin with c < 0) are predicted PASS by Q-B or Q-S. No
   recorded failure is predicted PASS by any question.
3. **Sweep.** 443 live nodes carry a tag of the user geometric program (402 declared, 41 inferred only).
   PASS 134 (T-NR 133, symmetric multiplier 13, BLS 3; overlaps counted in each), silent on all three 70,
   not formulable 239.
4. **The 70 silent nodes, by the reason they are silent:** 30 display the target itself or a zero-location input
   (class t); 18 are finite certificates (class c); 10 read the log level without the functional equation in the
   same inequality (class L); 7 read the size or exact form of local factors right of Re s = 1 or at single primes
   (class Z); 5 are kernel-shape conditions that backward heat or Davenport-Heilbronn also satisfy (class K).
   **No silent node displays an inequality that is at once not the target, not a certificate, and not already
   closed by a row or a lane.** Two nodes without a map row by name are proposed for round 15 (section 5), each
   with the reason it is expected to stop at stage A.
5. **Structural reading of the bridge family (PROVED, elementary).** For R_a(w) = X(w-a)/X(w+a) a zero lambda of X
   gives a zero of R_a at lambda + a and a pole at lambda - a. For a >= 1/2 the coefficient has no pole in
   Re w > 0 for any X with zeros in the strip, it is Schur unconditionally, and the Schur class is closed under
   Blaschke multiplication (Q-B yes: BLS passes; at a = 1/2 this is the scattering coefficient xi(w)/xi(w+1) of
   row D9). For a < 1/2 an off-line zero is a pole and the Schur condition is the zero-free statement itself
   (Q-B does not apply; class t). The user's bridge, shear, antibridge and spinor square-root nodes fall on one
   side or the other of this line; none sits between.

   **Correction note (2026-11-19, `c16-repair-owed-record-r15`; the text above is left as filed).** The sentence "For a < 1/2 an off-line zero
   is a pole and the Schur condition is the zero-free statement itself" does not hold as written (this lane's
   REFEREE.md, E1; second referee `push/c15-referee-r14-independent-checkpoint/REFEREE2_c14-prefilter-sweep-geometric-nodes.md`,
   section 3). Replacement, from `push/c15-klein-transport-lemma-w-stage-a-and-e1/PROPOSED_E1_REPLACEMENT.md`
   (Theorem E1', PROVED there and confirmed by that lane's independent referee): "For a >= 1/2 the bridge ratio R_a is
   Schur unconditionally and Blaschke-closed. For a < 1/2, R_a is Schur iff every zero with Re lambda > a has a
   same-ordinate zero at lambda - 2a of at least its multiplicity (nodes 386, 358). The strip abs(Re lambda) <= a
   implies it; it does not imply the strip at a single a; along a sequence a_n -> 0+ it is RH." The words "none
   sits between" are withdrawn. Hypotheses of Theorem E1': X entire, even, real on the real axis, of order one, zeros
   in a vertical strip; the sentence for a >= 1/2 "for any X with zeros in the strip" needs a growth hypothesis
   (bounded type in the half-plane), true for X in the gamma class of xi (second referee). The same replacement
   applies to section 2.2, row Q-B (a): "the inequality is the cancellation-aware condition of node 386, which the
   zero-free strip abs(Re lambda) <= a implies and which is RH along a -> 0+; the node stays typed X3". Typing
   consequence for the sweep: none (stated in the replacement file).

## 1. Plan; what is new against the record

- Round-13 lesson (combinable 1): three lanes each found one invariance that passes a control (Lemma P; Theorem C
  and BLS; Lemma M). This lane writes them as one statement and uses it as a reading rule on the idea graph.
- On file and only quoted: Lemma P with S1 to S3 and X1 to X5 (`c13-tnr-invariance-prefilter-noncone-census`
  section 2.2); Theorem C (`c13-kacmoody-eisenstein-affine-weyl-shift` section 3.3); Lemma M
  (`c13-fourier-interpolation-zero-nodes` section 4); the battery D1 replay
  (`c13-repair-map-engine-battery-records`), which this lane does not rerun.
- New here: Lemma F with its three instances and a common proof; Lemma B in Schur, Pick and H-infinity form with
  the zero-type / pole-type distinction; the a >= 1/2 against a < 1/2 reading of the bridge ratio; the typed table
  of 443 nodes; the re-typing of the 9 pending proposals with one changed answer (Lax-Phillips norms: Q-B yes for
  conditions expressed through the scattering coefficient).
- Answers to the three questions of map section 2: this lane has no attack. R1: not used. R2: none. R3: the
  subject of the lane (which nodes a control passes); no candidate. R4: none. Allowed as combine without R4 under
  STRATEGY section 1.

## 2. Part 1: the pre-filter as one statement

### 2.1 Lemma F

Setting. A device is a finite list of hypotheses H_1, ..., H_n on an object O (a function F in the gamma class of
zeta, or a coefficient M built from it), with a claimed implication "H_1(O), ..., H_n(O) imply C(O)", C a statement
that O has no zero in a region R of the open strip (for a coefficient: no zero or pole at the image of such a
point).

**Lemma F.** Let T be a set of maps O -> tau(O) such that (i) every H_i is tau-stable: H_i(O) implies
H_i(tau(O)) for all tau in T; (ii) every H_i holds for the object O_zeta of zeta; (iii) some tau in T gives
tau(O_zeta) a zero in R. Then the implication is false. PROVED: tau(O_zeta) satisfies every hypothesis and
violates C.

The three questions are three choices of T, each with a list of step types for which (i) is proved.

**(Q-P) Positive multiplier at one prime.** T = {F -> m_w F}, m_w(s) = sum over abs(k) <= N of w_k p0^(k(s-1/2)),
w_k = w_(-k) >= 0, w_0 > 0. Stable step types (PROVED, `c13-tnr-invariance-prefilter-noncone-census` section 2.2,
Proposition S): S1 a linear identity or membership in a linear class V with m_w V inside V; S2 a condition
"T(F) in K" with T linear in F or its kernel, the factor p0^(k(s-1/2)) acting by U^k, and K a convex cone with
U K and U^-1 K inside K; S3 any condition at primes other than p0 and any tail condition on the primes.
(iii) holds with N = 1, w = (1, c, 1), 2 < c < p0^(1/2) + p0^(-1/2): zeros at Re s = 1/2 +- arccosh(c/2)/log p0.
Question to ask of a node: is every step a linear identity, a dilation-invariant cone condition on an object
linear in F, or a condition away from one prime? Yes: T-NR passes.

**(Q-B) Blaschke multiplier on a coefficient.** T = {M -> M Theta}, Theta a finite product of
Theta_a(z) = (z - a)(z - conj a)/((z + a)(z + conj a)), Re a > 0, Im a != 0, acting on a coefficient M on
Re z > 0. Stable step types:

- B1 identities kept by Theta: M(z) M(-z) = 1 (Theta_a(z) Theta_a(-z) = 1), M(conj z) = conj M(z),
  abs(M) = 1 on Re z = 0, holomorphy in Re z > 0 off the poles of M. PROVED (inspection).
- B2 Schur and bounded-analytic conditions: abs(M) <= 1 in Re z > 0; M in H-infinity; vanishing of the
  anticausal Hankel block of M (causality). PROVED: abs(Theta_a) < 1 in Re z > 0 and Theta_a is analytic there.
- B3 Pick positivity of every order: the kernel (1 - M(z) conj M(w))/(z + conj w) is positive semidefinite on
  Re z > 0. PROVED:

      1 - Theta(z) M(z) conj(Theta(w) M(w))
        = [1 - Theta(z) conj Theta(w)] + Theta(z) [1 - M(z) conj M(w)] conj Theta(w).

  After division by (z + conj w) the first term is the Pick kernel of the inner function Theta (positive
  semidefinite) and the second is the Pick kernel of M conjugated by the scalar function Theta. Check: identity
  defect 0 to 80 digits at 200 point pairs; Pick matrices of order 10 at 6 random node sets, smallest/largest
  eigenvalue in [2.4e-9, 1.4e-6] for M, [2.5e-9, 1.8e-6] for M Theta, and negative (-3.16 to -0.019) for
  M / Theta (`checks.json`, B1, B2).
- B4 Nevanlinna form of the truncated norm: N = z(1 - S)/(1 + S), S = T^(-z) M, Nevanlinna in z^2. PROVED in
  `c13-kacmoody-eisenstein-affine-weyl-shift` Theorem C (Moebius computation; one independent referee pass,
  row D9).

(iii) holds when the strip zeros of the target are zeros of M in Re z > 0, as for M(z) = xi(z)/xi(z+1) (zeros at
the zeros of xi(z), poles at Re z <= 0): M Theta has a zero at any prescribed a (control BLS). T-NR with c > 2 is
the case Theta = D(z)/D(z+1), D(z) = p0^(z-1/2) + p0^(1/2-z) + c (MEASURED here: modulus 1 on the axis to 1e-81,
sampled supremum 0.975 to 0.993 in Re z > 0 for three parameter sets). Question to ask of a node: is the
inequality closed under multiplication of the coefficient by a Blaschke product over non-real conjugate pairs,
and are the strip zeros of the target zeros of that coefficient? Yes to both: BLS passes.

**(Q-S) Symmetric multiplier.** T = {F -> F G}, G meromorphic with G(1 - s) = G(s), real on the real axis, and
1/G(w) an absolutely convergent general Dirichlet series in Re w > 1. Stable step types:

- L (linear entry): an identity or a linear-class membership in which F enters linearly, on a class closed under
  multiplication by G (explicit formula, Hadamard and Poisson-Jensen identities, interpolation formulas: the
  basis for F G is G times a combination of the basis for F). PROVED (same argument as S1).
- D (entry by division): a kernel of the form (F*(s)/F*(w)) A(w, s) with A independent of the target; every
  condition on A alone; the edge of absolute convergence at Re w = 1; the symmetry relations of the kernel.
  PROVED in `c13-fourier-interpolation-zero-nodes` Lemma M: H^G(w, s) = H(w, s) G(s)/G(w), and G(s)/G(w) is 1 at
  w = s and symmetric in each variable.

(iii) holds for G = m_w with any real c, 2 < abs(c) < p0^(1/2) + p0^(-1/2): 1/G is absolutely convergent in
Re w > 1/2 + b, b = arccosh(abs(c)/2)/log p0 < 1/2 (0.824, 0.754, 0.904 for (2, 2.0506), (3, 2.0785), (3, 2.2);
`checks.json`). Question to ask of a node: does the target enter linearly or by division, with no sign condition?
Yes: symmetric multipliers with strip zeros pass.

Relations. Q-S with G = m_w covers T-NR without positivity of the weights (c < -2 included), for step types L and
D only. Q-P adds cone conditions, for positive weights only. Q-B acts on a coefficient and changes the
archimedean factor instead of a prime; it covers conditions that are not linear in F (Schur, Pick, Nevanlinna),
which Q-P types as X5 or X1.

### 2.2 What each question does not cover

| question | not covered | consequence |
|---|---|---|
| Q-P | X1 log level (Lambda_F >= 0, Pick, Weil, Li forms; coefficients of 1/F with a tracked bound; size at p0); X2 exact covariance at p0; X3 target-level inputs; X4 identification; X5 kernel conditions outside dilation-invariant convex cones; weights with c < 0; (from section 3 of the round-13 lane) mollified mean values | the lemma is silent; it does not say that T-NR fails |
| Q-B | (a) pole-type coefficients: when a strip zero of the target is a pole of the coefficient in the region of the inequality (R_a = X(w-a)/X(w+a) with a < 1/2, Theta_a = E_a^#/E_a, S = N/D of the square-root lane), multiplication by Theta inserts no pole, and division by Theta leaves the class (checks.json: Pick matrix of M/Theta negative; T-NR ratio m(w-a)/m(w+a) at a = b/2 has modulus 1.3e5 to 2.0e5 next to its pole in Re w > 0); (b) a single real Blaschke factor and the sign (-M fails B4; row D9); (c) any step that reads the archimedean factor or the relation f(z) = f(1 - z) for f with M = f(z)/f(z+1): BLS changes the gamma factor; (d) exact normalisations (a residue, a value at a point, a fixed half-width in a Poisson representation): Theta changes them; (e) rank above one on the Eisenstein carrier (Theorem C is rank one) | silent; for (a) the inequality is the zero-free statement and the node is typed X3 |
| Q-S | sign conditions and cones (they belong to Q-P); bounds with a tracked constant (abs(mu(d)) <= 1 exactly; the exponent 1/4 + eps of partial sums, which is equivalent to RH for zeta); non-linear entry (log F, abs(F)^2, F'/F, the pair F +- alpha F'); controls outside the gamma class (E_a: open at S0 in the source lane); Davenport-Heilbronn only in the smaller class of BRS section 5.3.2 | silent |
| all three | a hypothesis that is true for zeta only if RH holds (X3). Every control fails such a hypothesis, so no question answers yes; the node is then a restatement, not a device | class t in section 3 |

None of the three reads the functional equation as a hypothesis that could fail: T-NR, BLS (at the level of the
coefficient) and symmetric multipliers all keep it. A node that is silent on all three therefore still has to be
run against DH, backward heat and E_a before it is a candidate.

## 3. Part 2: the sweep (decisive test)

### 3.1 Selection and reading rule

`select_nodes.py` (text only): live nodes of `engine/IDEA_GRAPH.json` (no role "wall", origin corpus or map; the
engine's own definition in `generate.py`) with a tag in {twin-ladder, bridge, shear, antibridge, torus, klein,
spinor, twistor, zero-channel, vortex} declared or inferred. 443 nodes (402 declared, 41 inferred only); 156,789
characters of names and statements, read in full in four batches. The verdict of each node was written by hand
after reading its statement (`v_*.txt`, one line per node); `build_sweep.py` only assembles the files.

Reading rule (READ).

- **Not formulable**: the statement contains no condition on a function of the class on which the three maps act
  (reasons n1 to n6 below).
- **PASS**: the node is an identity, an equivalence or an implication all of whose steps are of a stable type for
  at least one question. An identity or equivalence with no hypothesis is typed S1: it holds for the control
  together with its zeros off the line, so it cannot be a device alone. An "iff RH" clause inside a proved
  identity does not change this.
- **Silent**: the node has a hypothesis or displays a condition to be proved, and each of the three questions is
  answered no or cannot be posed. Classes: t, c, L, Z, K (below).

### 3.2 Counts

| verdict | nodes | split |
|---|---|---|
| PASS | 134 | Q-P yes 133; Q-S yes 13 (12 also Q-P; 1 by Q-S only, node 30); Q-B yes 3 (all also Q-P) |
| silent | 70 | t 30, c 18, L 10, Z 7, K 5 |
| not formulable | 239 | n3 tool or bookkeeping 116; n1 numerical record 66; n2 finite or model system 25; n5 open direction without a displayed condition 16; n4 statement about a control or another object 14; n6 no object 2 |

Answers: Q-P yes 133, no 71, not posable 239. Q-B yes 3, no 38 (pole-type or exact normalisation), not posable
402. Q-S yes 13, no 190, not posable 240.

By tag (a node with several tags is counted in each):

| tag | PASS | silent | not formulable |
|---|---|---|---|
| antibridge | 15 | 1 | 8 |
| bridge | 63 | 27 | 46 |
| klein | 6 | 2 | 9 |
| shear | 23 | 9 | 22 |
| spinor | 10 | 2 | 5 |
| torus | 11 | 7 | 30 |
| twin-ladder | 35 | 26 | 104 |
| twistor | 3 | 2 | 5 |
| vortex | 20 | 6 | 27 |
| zero-channel | 38 | 12 | 40 |

Legend of silent classes and the arithmetic input each would need to become a device:

| class | meaning | needed |
|---|---|---|
| t | X3: the displayed condition is the target, an all-order criterion, or has a zero-location hypothesis | a proof step of type X1 (unimodular local parameter, Lambda_F) or X2 (exact local covariance) at every prime, inside the same inequality as s <-> 1-s |
| c | X3: finite certificate (verified height, a box, a zero table) | an X1 or X2 step uniform in height, with the functional equation; a certificate alone restates verified height |
| L | X1 present (Lambda_F, Weil or Pick form, coefficients of 1/F), functional equation only through the archimedean term, a finite support or a mean value | s <-> 1-s inside the same inequality, in every window |
| Z | X1 size or X2 exact local form, used right of Re s = 1 or at single primes | the functional equation in the same step, acting left of Re s = 1 |
| K | X5 kernel-shape condition that backward heat or DH also satisfy | an X1 or X2 step coupled to it |

### 3.3 The silent nodes

Full table of 443 rows: `SWEEP_TABLE.md` (and `sweep.json`). The 70 silent rows:

| # | node id | tags | steps | Q-P | Q-B | Q-S | class |
|---|---|---|---|---|---|---|---|
| 0 | adjacent-gap-reserve | vortex | S1,X3 | N | - | N | t |
| 1 | af-rank-trace-inertia | twin-ladder | S2f,X1 | N | - | N | L |
| 9 | antihermitian-strip-bound | twin-ladder,twistor | S1,X3 | N | - | - | t |
| 13 | backward-flow-displacement-residual | zero-channel | X3 | N | - | N | c |
| 14 | bagchi-strong-recurrence | torus | X3 | N | - | N | t |
| 28 | canonical-system-indivisible-chain | twin-ladder | X3 | N | N | N | t |
| 34 | cdb-exist | bridge | X3 | N | N | N | t |
| 35 | cdb-exist-noncircularity | shear,twin-ladder | X3 | N | N | N | t |
| 41 | collective-lambda-certificate | torus,vortex | S1,X3 | N | - | N | t |
| 48 | conformal-schur-window | bridge,twin-ladder | X3 | N | N | N | c |
| 55 | darlington-losslessness-s7 | bridge,twin-ladder | X1,X2,S3 | N | N | N | Z |
| 56 | dbn-closed-barrier-883-prisms | zero-channel | X3 | N | - | N | c |
| 57 | dbn-max-gap-collapse-time | twin-ladder | S1,X3 | N | - | N | t |
| 58 | dbn-moving-real-rung-lemma | twin-ladder | S1,X3 | N | - | N | t |
| 60 | dbn-uniform-poisson-floor | twin-ladder | X3 | N | - | N | t |
| 61 | de-branges-positivity-family | i:twin-ladder | X5,X3 | N | N | N | K |
| 73 | en-bridge-inequality | bridge | S2f,X3 | N | - | N | t |
| 82 | eps-offline-quarantine-bound | zero-channel | S1,X3 | N | - | N | c |
| 84 | euler-anchor-heat-certificate | vortex | S1,X1 | N | - | N | Z (lane run) |
| 94 | exhaustive-winding-certificate | vortex,zero-channel | X3 | N | - | N | c |
| 104 | finite-support-euler-detector | twin-ladder | X1 | N | - | N | Z |
| 110 | freezing-inertia-tool | bridge,twin-ladder | X3 | N | N | N | t |
| 120 | genuine-theta-box | vortex | X3 | N | - | N | c |
| 134 | hidden-square-conj-16-4 | bridge,spinor | X3 | N | N | N | t |
| 140 | ka-offdiagonal-hankel-g7 | bridge,shear | X3 | N | N | N | t |
| 141 | ka-positivity-residual | bridge,shear | X3 | N | N | N | t |
| 142 | klein-phase-transport-certificate | bridge,klein,shear,torus | S1,X5 | N | - | N | K |
| 147 | kyp-bounded-real-prime-delay | bridge,twin-ladder | X3 | N | N | N | t |
| 157 | lemma-w-wide-support | bridge | X3,X1 | N | - | N | L |
| 158 | levinson-in-ladder-language | bridge,twin-ladder | X1,S2f | N | - | N | L |
| 163 | map-open-11 | shear | X2,S3 | N | - | N | Z |
| 166 | map-open-20 | spinor | S1,X1 | N | - | N | L |
| 175 | map-pos-19 | torus | X1,X3 | N | - | N | t |
| 178 | map-pos-26 | bridge | S1,X3 | N | - | N | t |
| 195 | mem-lacunary-loophole | twin-ladder | X1 | N | - | N | L |
| 196 | mem-local-window-substitution | zero-channel | X3 | N | - | N | c |
| 197 | mem-mollifier-proportion-loophole | i:twin-ladder | X1,S2f | N | - | N | L |
| 205 | mem-weil-moment-ladder | i:twin-ladder | X1 | N | - | N | L |
| 212 | mirror-descent-b1 | bridge | S1,X3 | N | - | N | c |
| 213 | mirror-euler-rate-t0 | zero-channel | S1,X1 | N | - | N | Z |
| 247 | pascal-carry-ballot | bridge | X3 | N | - | N | t |
| 261 | positive-real-ladder-step | bridge,i:twin-ladder | X1,X3 | N | - | N | t |
| 262 | prime-delay-domination | twin-ladder | X1,X3 | N | - | N | t |
| 263 | prime-delay-domination-15-4 | bridge,shear | X1,X3 | N | - | N | t |
| 270 | pulse-leakage-zero-target | bridge | X3 | N | N | N | t |
| 271 | qrh-conditional-lambda | bridge | X3 | N | - | N | c |
| 273 | ramanujan-cube-satake-point | torus | X1,X3 | N | - | N | t |
| 286 | route-i-krein-certificate | i:twin-ladder | X1 | N | - | N | L |
| 292 | rung-toeplitz-euler-detector | twin-ladder | X1 | N | - | N | Z |
| 303 | schur-ratio-max-principle-gap | bridge | X3 | N | N | N | t |
| 323 | shift-bridge-ka-psd | bridge,twin-ladder | X3 | N | N | N | t |
| 333 | slab-44-nonvanishing-target | twin-ladder | X3 | N | - | N | c |
| 341 | staged-strip-triangular-inequality | bridge | X1,X3 | N | - | N | t |
| 342 | star-min-pointwise-prime-bound | torus | X1 | N | - | N | L (lane run) |
| 344 | straddle-exclusion-window-completeness | zero-channel | X3 | N | - | N | c |
| 348 | sympow-conductor-normalised-shift | shear | X1,X3 | N | - | N | Z |
| 350 | t3-residual-inequality | bridge,shear,twin-ladder | X3 | N | N | N | t |
| 355 | theta-kernel-sqrt-concavity | bridge | X5 | N | - | N | K |
| 357 | thin-hankel-certificate | bridge,twistor | X3 | N | - | N | c |
| 363 | twin-ladder-jacobi-reconstruction | twin-ladder | X3 | N | N | N | t |
| 372 | two-point-cutoff-positivity | bridge | X5 | N | - | N | K |
| 374 | virtual-rungs-positive-extension | torus | S1,X1 | N | - | N | L |
| 377 | volterra-hs-bound | shear | X5 | N | - | N | K |
| 381 | walled-cell-lemmas-b2-b3 | vortex,zero-channel | S1,X3 | N | - | N | c |
| 387 | winding-barrier-above-tpt | zero-channel | X3 | N | - | N | c |
| 395 | zero-channel-certificates | zero-channel | X3 | N | - | N | c |
| 403 | zr-zero-repulsion | twin-ladder | X3 | N | - | N | c |
| 411 | zv-bridge-vs-reference-form-comparison | antibridge,bridge,klein | X3 | N | - | N | t |
| 420 | zv-first-zero-theta-channel | zero-channel | X3 | N | - | N | c |
| 437 | zv-symmetric-disk-confinement | zero-channel | S1,X3 | N | - | N | c |

Reading.

1. Class t (30). 22 of these are the RH-equivalent positivity statements of the twin-ladder and bridge program
   (K_a >= 0, T3, CDB-Exist, hidden square, norm of R <= 1, KYP, Re xi'/xi > 0, Route A, zero leakage,
   reference-form comparison) or equivalent elementary criteria; 8 have a hypothesis on zero positions, 6 of them
   along the heat flow (gap reserve, slab certificate, moving-rung lemmas, the E(N) bridge). The pre-filter is
   silent on them because no control satisfies the hypothesis, which is also why they are not devices: the
   hypothesis is the conclusion. None names a step of type X1 or X2.
2. Class c (18). Verified-height wall. No arithmetic input is named in any of them.
3. Class L (10). All ten are on file as closed or bounded: mean values give proportions (MV-CAP: nodes 1, 158,
   197), finite support has no margin (nodes 205, 286, 374; rows P10, P19), the cutoff commutator is the Weil form
   on a window (node 166; row G25), lacunary Pick has no zero content (node 195; row P18), (star_min) is the
   one-height wall of `support-rigidity` and row P24 (node 342). Node 157 (Lemma W) has no row by name; section 5.
4. Class Z (7). Each reads local size or exact form where the Euler product converges or at single primes:
   Darlington losslessness (node 55; row G10), the rung Toeplitz detector (nodes 104, 292; rows L1, L4: empty for
   zeta), the sheared Hecke commutator (node 163; row G22), the Sym^m margin (node 348; row D4), the t = 0
   Euler descent rate (node 213; NS-RIGID), the Euler-anchored heat certificate (node 84; lane
   `e1-euler-anchor-heat-certificate`: the test 2 pi^2 c > C fails for every fixed c).
5. Class K (5). Csordas concavity and its two-point consequence (nodes 355, 372) persist for every tau of the
   backward heat family (the node text and row G5 say so); the de Branges family (node 61) is closed by its lane;
   the Hilbert-Schmidt bound (node 377) is a scale statement (node 376). Node 142 has no row by name; section 5.

### 3.4 The nodes that pass, by geometric family

- Twin ladder and bridge (PASS 35 and 63): the dictionary (E_a = Xi(z + ia), T3(a) iff Hermite-Biehler iff
  zero-free strip, threshold a >= Delta), the Krein-Langer and ghost-count identities, the Weil form in delay
  coordinates, the scattering factorisation phi = Lambda(2s-1)/Lambda(2s). All are identities valid for every
  even real entire X of the class: T-NR satisfies them with ghosts present. Q-S also answers yes for the ratio
  identities (R_a enters by division). Q-B answers yes for the three scattering-form nodes (22, 219, 386), where
  the strip zeros are zeros of the coefficient.
- Shear and antibridge (PASS 23 and 15): rank-two structure, sign pattern from Phi >= 0 (S2b: T-NR's kernel is a
  positive combination of translates of Phi), Loewner algebra of P +- B, parity identities.
- Spinor and twistor (PASS 10 and 3): C_0 = N/D is unitary for every even real F; H_c = A* M_c A; the ladder
  Hecke identity is kernel-independent. Q-S answers no for the pair F +- alpha F' (not covariant under F -> F G);
  Q-P answers yes (identity).
- Torus, Klein (PASS 11 and 6): Lemma E of the graph (a consequence of the Euler product at one height is
  torus-valid), first-moment identities over one-port poles, seam counts and fold symmetries.
- Zero channels and vortex (PASS 38 and 20): the heat-flow identities (Dyson ODE, Burgers form, jet lemma, winding
  monotonicity, Laguerre hierarchy) hold for every even kernel, backward heat included.

### 3.5 The 9 pending proposals of devices.json

| pending entry | steps | Q-P | Q-B | Q-S | verdict | note |
|---|---|---|---|---|---|---|
| RS-1 (functional equation with periodicity of twists) | S1,S3,S2a | Y | - | Y | PASS | both lanes run (device types twist-modulus-reciprocity, regular-rep-matrix-bridge) read identities and entrywise cones; an RS-1 candidate must add an X1 or X2 step |
| RS-2 (attached object with non-algebraic positivity) | - | - | - | - | not formulable | no candidate object and no hypothesis list |
| RS-3 (gamma side with Euler product in one positivity step) | X5,X3 | N | N | N | silent | lane run (de-branges-positivity-family): closed; the E-function quotient carries strip zeros as poles, so Q-B does not apply |
| Density quadratic forms with automorphic companions | S2f,S2a | Y | - | N | PASS | coefficient-level squares and mean values; log-level squares (X1) are outside and fall under MV-CAP |
| Global Whittaker constants on the double cover of GL(3) | X2 | N | - | - | silent | local data at every prime (X2); no inequality displayed; needs the functional equation of the target in the same step |
| Rank >= 2 compact-at-infinity squares without a Hecke rule | S2a | Y | - | N | PASS | modulus squares (cone) |
| Model vertices 1 < h <= 3 in the order-2 ledger | S1,S2f,X1 | N | - | N | silent | every step except the size step abs(eta(p)) = 1 is S1/S2f (T-NR passes those); silent at the size step only, as for device type coherent-set-large-sieve |
| Lax-Phillips Hecke norms outside the weighted-L2 family | S1,X2 | N | Y | N | PASS | new against round 13: any norm condition expressed through the scattering coefficient (unitarity, inner property, truncated-norm positivity) is closed under Blaschke multiplication (Q-B), zeros of phi at (1+rho)/2 being zeros in Re s > 1/2; silent (X2) only for a norm that reads the T_p action on a component not determined by phi |
| Non-locality step 4 of the Rouche lane (row P44, any-height form) | S1,X2 | N | - | N | silent | functional equation with the exact stage at every prime: already of the required input type; no displayed inequality on file |

Against the round-13 typing of the same nine entries: eight agree. One changes: Lax-Phillips Hecke norms were
"silent (X2)"; with Q-B, every norm condition expressed through the scattering coefficient is passed by BLS, and
the entry stays silent only for a norm that reads the Hecke action on a component not determined by phi. This is
the question the sibling lane `c14-laxphillips-hecke-norm-outside-l2` has to answer first (its directory exists;
its result was not read here).

## 4. Control check

Rule: per step group of a device type, Q-P is computed from the typed steps (all in S1 to S3), Q-B and Q-S are the
answers read from the lane text; prediction PASS if any answer is yes, else silent. "agree" = recorded pass with
predicted PASS, or recorded failure with predicted silent. A recorded failure with predicted PASS would be a
disagreement.

| device | step group | types | Q-P | Q-B | Q-S | Lemma P only | three questions | record | compare |
|---|---|---|---|---|---|---|---|---|---|
| 1 mean-value-convexity | plain mean values, convexity | S2f,S1 | Y | - | N | PASS | PASS | - | no record |
| 1 mean-value-convexity | mollified density estimate | X1 | N | - | N | silent | silent | fail | agree |
| 1 mean-value-convexity | log F positive definite | X1 | N | - | N | silent | silent | fail | agree |
| 2 exact-uniqueness | Theorem R, zero tolerance per prime weight | X4,X1 | N | - | N | silent | silent | fail | agree |
| 3 residue-explicit-formula | identities | S1 | Y | - | Y | PASS | PASS | pass | agree |
| 4 positive-kernel-transport | finite Pick orders | X1,X3 | N | N | N | silent | silent | fail | agree |
| 4 positive-kernel-transport | seam invariants | S1 | Y | - | N | PASS | PASS | - | no record |
| 13 section-extraction | no-go Lemma R from gamma growth | S1 | Y | - | N | PASS | PASS | pass | agree |
| 14 test-restriction-commutator | orthogonalisation | S1 | Y | - | N | PASS | PASS | pass | agree |
| 14 test-restriction-commutator | sign of the Weil form | X3 | N | - | N | silent | silent | fail | agree |
| 15 finite-support-positivity | prime-side positivity, zero tolerance | X1 | N | - | N | silent | silent | fail | agree |
| 20 frequency-only | coefficient-blind | S1 | Y | - | Y | PASS | PASS | pass (generic) | agree |
| 22 tensor-squeeze | size of local parameters | X1 | N | - | N | silent | silent | fail | agree |
| 23 strip-dtn-identity | identity | S1 | Y | - | N | PASS | PASS | pass | agree |
| 26 coherent-set-large-sieve | reflection, Cauchy-Schwarz, large sieves | S1,S2f | Y | - | N | PASS | PASS | pass | agree |
| 26 coherent-set-large-sieve | abs(eta(p)) = 1 | X1 | N | - | N | silent | silent | fail | agree |
| 35 twist-modulus-reciprocity | reciprocity identity at twists prime to p0 | S1,S3 | Y | - | Y | PASS | PASS | pass | agree |
| 36 regular-rep-matrix-bridge | entrywise cone, FE, periodicity | S2a,S1 | Y | - | N | PASS | PASS | pass | agree |
| 37 de-branges-positivity-family | shift positivity of Hermite-Biehler type | X5,X3 | N | N | N | silent | silent | fail | agree |
| 38 bost-connes-crossed-product-positivity | state positivity, D >= 1 in the centraliser (c > 2) | S2a | Y | - | N | PASS | PASS | pass | agree |
| 40 x04-oval-hecke-fricke-loading | linear forms in Hecke images of theta; device twin has c < 0 | outside-P | N | - | Y | silent | PASS | pass | agree |
| 41 kacmoody-eisenstein (row D9; not in devices.json) | cocycle, holomorphy in the chamber | S1 | Y | Y | N | PASS | PASS | pass | agree |
| 41 kacmoody-eisenstein (row D9; not in devices.json) | Maass-Selberg positivity (Nevanlinna in the coefficient) | X5 | N | Y | N | silent | PASS | pass | agree |
| 42 fourier-interpolation-zero-nodes (row G34; not in devices.json) | kernel F*(s)/F*(w) x A_k, edge of absolute convergence of 1/F | X1 | N | - | Y | silent | PASS | pass | agree |

Counts. Device types of round 13 with a T-NR record: 14 (the round-13 count), 13 by name and 1 generic
(frequency-only, "every Dirichlet-series control passes"); the assignment's "13" is the by-name count. Recorded
cells 22. **Disagreements 0.** Recorded passes on which Lemma P alone is silent: 3 (X_0(4) twin with c < 0: Q-S;
Maass-Selberg positivity: Q-B; Fourier-interpolation kernel: Q-S). Recorded passes silent under the three
questions: 0. No recorded failure has a yes from Q-B or Q-S: the Pick and de Branges failures are pole-type
(2.2 (a)), and the Weil, mollifier and size failures do not enter linearly or by division.

Limits of this check: the typings of devices 1 to 37 are those of the round-13 lane, so reproduction of those rows
is a consistency check of the rule, not an independent replay; rows 38 to 42 are typed here. The X_0(4) twin has
its extra zeros outside the closed strip, so that row tests the scope of the rule and not a strip control.

## 5. Proposals for round 15 (explore, stage A on paper)

Rule of the assignment: a silent node with a displayed inequality is proposed. After removing the nodes whose
inequality is the target (t), a certificate (c), or closed by a row or a lane, two remain. Neither names an
arithmetic input; both are expected to stop at stage A, and the reason is stated.

1. Node 142, `klein-phase-transport-certificate` (bridge, Klein, shear, torus; source PR 56
   `klein_phase_transport.md` section 6). Displayed: if 0 < mu <= theta_a' <= M on [t - R, t + R], R <= pi/(4M),
   then W_h(t)/h >= (2 mu/(pi a)) int_0^R omega A_a A_a dr - int_R^inf omega A_a A_a/(2 a r) dr. Missing input:
   the window hypothesis on the phase derivative (X5; for a below the zero displacement it fails near a ghost).
   Stage A question: can a step of type X1 or X2 supply mu > 0 in every window with the tail term controlled, and
   does backward heat satisfy the hypothesis where its conclusion fails. Expected: the hypothesis is the local
   form of Hermite-Biehler monotonicity (class t in a window), or it holds for backward heat (rows G5, G8).
2. Node 157, `lemma-w-wide-support` (bridge). Displayed: sum over 0 < gamma <= T of T^(2A abs(beta - 1/2))
   <= C T log T for some A > 1; equivalent to N(sigma, T) <= C T^(1 - 2A(sigma - 1/2)) log^O(1) T; implies a fixed
   zero-free strip. T-NR, DH, E_a and backward heat fail the inequality itself (each has at least cT zeros at
   fixed distance from the line), so it is a target-level statement that is weaker than RH; the step that could
   prove it is a mollified mean value (X1, coefficients of 1/F), which reads s <-> 1-s only through the
   approximate functional equation. Stage A question: which mean value has slope above 2 near the line; the known
   ones (Selberg near 1/2; Ingham, Huxley, Guth-Maynard globally) have slope below 2 at some sigma. Expected:
   stops at the density-hypothesis barrier; it is the frontier lane's subject (part B), not a new mechanism.

No other silent node is proposed. In particular no node of the twin-ladder, bridge, spinor or twistor families
displays an inequality that is not RH-equivalent and that a control fails at a step using X1 or X2 with the
functional equation.

## 6. Controls

No argument about zeta is made. What the lane establishes about controls:

| control | status in this lane |
|---|---|
| T-NR | Q-P (pointer), Q-S with G = m_w (pointer and abscissa check); passes 133 of the 204 formulable nodes; silent on 71 |
| BLS | Q-B proved in Schur, Pick and H-infinity form (new) and quoted in Nevanlinna form; passes the 3 scattering-form nodes; does not apply to pole-type coefficients (38 nodes) |
| symmetric multiplier | Q-S (pointer); passes 13 nodes |
| Davenport-Heilbronn, backward heat, E_a | not run by the filter. Quoted from node texts and rows: backward heat keeps every heat-flow identity and the Csordas concavity (class K); DH passes kernel-side positivity; E_a fails Lemma W and passes the Euler anchor |
| sign twists, unimodular twist, Beurling, phase-rotated transfer operator, theta^w | not run |

## 7. Requirement flags

- R1 (multiplicativity essential): **false**. No argument about zeta. Lemma F uses multiplicativity only to say
  that the controls keep it.
- R2 (height-uniform, every window): **false**. No statement at height.
- R3 (every control fails at a named structural step): **false**. The lane shows the opposite for 134 nodes (a
  control passes) and finds no node where all controls are shown to fail; the 70 silent nodes were not run
  against DH, backward heat or E_a here.
- R4 (reaches the critical line): **false**. Nothing crosses.

## 8. Three weakest steps

1. **The verdicts are readings.** Each of the 443 verdicts was written by one reader from a statement of one to
   ten lines, without opening the node's source. The boundary between "PASS (identity, S1)" and "not formulable
   (tool or model)", and between "silent, class t" and "PASS" for a proved implication whose hypothesis is a
   zero-free region, is a convention (section 3.1). A second reading of 36 random nodes (REFEREE.md) found 3
   boundary cases of this kind and no case moving a node into or out of the proposal list; a keyword cross-check
   flagged 10 nodes and changed 1 (node 104, PASS to silent Z). The counts 134 / 70 / 239 carry an uncertainty of
   the order of 10 percent between PASS and not formulable.
2. **Q-B and Q-S are narrow.** Q-B applied to 3 of 443 nodes and Q-S to 13; almost all the filtering is Q-P, and
   Q-P's yes on 120 nodes (steps read: S1 only) is the trivial case "an identity holds for the control". The combined filter adds a
   verdict where Lemma P was silent in three recorded cases only. Lemma B's new part (Schur, Pick, H-infinity) is
   elementary and classical in content; the Nevanlinna form rests on one lane with one independent referee, rank
   one only.
3. **Silent does not mean candidate, and the proposal list is thin.** The filter does not test the functional
   equation, DH, backward heat or E_a. The two proposals come from the absence of a map row by name, checked by
   text search (`grep` on the map, `engine/outcomes/` and lane results), which can miss a row that closes them
   under another name. The control check reuses the round-13 typing for 14 of its 18 device rows.

## 9. Files

In `tmp/research-2026-11-16/push/c14-prefilter-sweep-geometric-nodes/`:
`RESULT.md`, `REFEREE.md`, `lanes.jsonl`; `sweep.json` (443 node records, 9 pending, control check cells,
cross-check flags, proposals); `SWEEP_TABLE.md` (443 rows); `select_nodes.py`, `selected_nodes.json`, `dump.txt`
(the text that was read); `v_000_149.txt`, `v_150_249.txt`, `v_250_349.txt`, `v_350_442.txt` (hand verdicts);
`build_sweep.py`, `build.log`; `checks.py`, `checks.json`, `checks.log`.
