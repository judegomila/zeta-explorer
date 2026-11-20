# Checkpoint after round 14 (DRAFT): read sets not covered by the record

Written 2026-11-19 by lane `c14-repair-map-engine-checkpoint-record`, before the round-14 lanes reported.
Status: draft for the round-14 learn step. It takes effect only if no round-14 explore lane passes stage A
(STRATEGY v3 section 2, checkpoint rule); in that case sections 2 and 3 below are the text proposed to replace the
three read sets RS-1 to RS-3 of STRATEGY section 4.0. `campaign/STRATEGY.md` was not edited by this lane.

This file is a record of what the obstruction record does not cover. It is not a result about zeros of zeta and no
line of it is one. It adds no mathematics. "Not covered" means: no line of Statement O and no closed device row
applies. It does not mean that a device with that read set exists, and it is not a ranking of likelihood.

Sources: `push/c12-repair-sources-statement-o-v3/STATEMENT_O_v3.md` (Statement O, version 3 with the reader pass;
called "O" below; it replaces `push/c9-obstruction-record-statement/STATEMENT_O.md`), sections A (definitions and
input codes), C (summary table and the input-level paragraph), D, E; `engine/curated/devices.json` after this lane's
rerun (46 device types: 45 closed, 1 floored, 0 open; 9 pending proposals); `push/OBSTRUCTION_MAP.md` (198 rows;
section 6 and the "Not covered" sentences of the rows closed in rounds 11 to 13); `campaign/ROUND_LOG.md` rounds 11
to 13 (lessons and "combinable" lists).

Input codes (O, A1): EP Euler product; POS Lambda_F >= 0; SUPP prime-power support; SIZE abs(Lambda_F(n)) <= log n
with a pole at 1 only; FE the functional equation of zeta itself (conductor 1, zeta's gamma factor) at all heights;
INT ordinary Dirichlet series; GEOM unimodular local parameters at every prime; PER periodicity of the coefficients
of every twist used; KER kernel-side positivity. Step types of Lemma P (map section 2; row P55): S1 linear identity
or linear class; S2 dilation-invariant cone condition on an object linear in F; S3 condition away from one prime; X1
log level (Lambda_F, coefficients of 1/F or log F, size at p0); X2 exact covariance at every prime (complete
multiplicativity, Hecke eigen-relation, spherical vector); X5 kernel condition in a set that is not a
dilation-invariant convex cone.

## 1. What the record closed of RS-1 to RS-3 (rounds 11 to 13; round 14 not included)

| read set of STRATEGY 4.0 | devices tested, each closed at stage A | how each closed | cells the closing rows leave open |
|---|---|---|---|
| RS-1: FE of the target in the same inequality as periodicity of twists in the conductor aspect | twist-modulus reciprocity, Hermitian form (Z34); regular-representation matrix bridge (Q28) and the cone K_F (Q29); depth-aspect termwise exchange (Z35); bilinear reciprocity at height t as a J-form (Z36); Luo-Rudnick-Sarnak on Eisenstein data at a zero (G35) | never read a self-dual FE (Z34); decomposes over characters, T-NR and E_a lifts have every input (Q28, Q29); the exchange step is false (Z35); the sign reads the zero count mod 2 and T-NR, E_a pass (Z36); the generic parameter passes (G35) | statements mixing several bridge objects; F-adapted cones other than K_F; a transfer through weighted sums special to the coefficients of zeta; an exact law for the Estermann function off its central point; non-Borel eigen-objects with parameter rho |
| RS-2: an attached object whose positivity is not an algebraic identity | Bost-Connes crossed product, three classes of states (D8); Hecke / Fricke loading on the oval of X_0(4) (G33); loop-group Borel Eisenstein series (D9: rank one proved, affine kernel argued); Fourier interpolation with zero nodes (G34); central-value squares (G32) | T-NR is the value of the KMS family on a fixed positive element (D8); every twin lies in the dilation module of theta (G33); Maass-Selberg positivity is closed under Blaschke factors (D9, control BLS); the target enters by division (G34); the central value is a modulus squared for every function with a real axis symmetry and carries no condition off the line (G32) | states outside the three classes; functionals of unsummed complex points that are neither linear nor a second moment; a proof for the affine kernel; the kernel for the gamma class of E_a; a higher-degree self-dual object with zeta at height t as one factor |
| RS-3: positivity using zeta's gamma side together with the Euler product in one step | de Branges shift positivity and its variants, with the backward-heat and tied-family cells (P53) | each variant is a restatement of a closed row or is false for zeta at a named step; backward heat fails at on-line zeros; the tied family is closed for q = 5, 7, 13 | a tie with one shift per character; failure for every fixed h < 1 in the entire-function form |

Single-object non-cone sign conditions were added to the record in round 13 without belonging to one of the three:
the census of twelve inequality types (P55), Edrei-Thoma local total positivity (L6) and dictionary D (G36; closed as
MEASURED, a finite search on a registered grid and registered draws, not a proof).

Reading: the three read sets were each tested through particular devices. The record closes those devices. It does
not close the read sets; no line of O has RS-1, RS-2 or RS-3 as its read class, and no control on file lies in any
of them. This is why they are replaced by the narrower classes below, each stated with the reason the record is
silent.

## 2. Read classes not covered: separate conditional statements

Each statement has the form: *if the decisive step of a device reads the set U_j as described, then no line of O
and no closed device row applies to it; the record neither defeats nor supports the device.* The statements are
separate. None says what a device must read, and their conjunction is not asserted (O, section C: the summary table
is not a necessity statement).

**U1. {FE, GEOM} in one inequality that is not an identity (step type X2 with FE).**
Read set: zeta's own functional equation at all heights together with exact unimodular local structure at every
prime (complete multiplicativity or the Hecke eigen-relation with unimodular parameters), both used in the same
one-sided step.
Why not covered: O, section C, input-level paragraph: {FE, GEOM} is a minimal input set that every control lacks.
Checked against the controls added since: DH lacks EP; E_a, EIS-w and T-NR (at p0) lack GEOM; DEL lacks FE and has
local parameter 0 on its deleted set; THIN, U and the sign twists lack FE; WT has zeta's FE only inside one window;
HEAT is not an ordinary Dirichlet series; the interpolation twin and RZ_b lack FE; BLS is defined on scattering
coefficients only; UNIV is a filter for the open right half of the strip and is out of scope when s is used with
1 - conj s. Lemma P does not apply because the step is of type X2.
Conditional statement: a device whose decisive step is of this kind is addressed by no line of O. Before any work
it must show that the step is not (i) an exact identity valid for the controls (line 11), (ii) an identification
(U3 below), (iii) stable under Blaschke factors when posed on a scattering coefficient (BLS), (iv) linear in the
target or a division by it (symmetric multipliers, row G34).
Nearest closed rows: Z34, Z36, Q28, Q29, G35, P53. No candidate on file after round 13.

**U2. {FE, SIZE} with POS at the logarithmic level in one inequality (step type X1 with FE).**
Read set: Lambda >= 0 or the bound abs(mu(n)) <= 1 on the coefficients of 1/F (or the size normalisation of
log F), used in the same step as the functional equation at all heights.
Why not covered: line 1 of O defeats read sets inside {POS, SIZE, SUPP, EP, INT, pole} (DEL) and inside {SIZE, SUPP,
EP, GEOM, INT, pole} (THIN), both without FE; line 3 defeats {EP, POS, FE, finite order} by E_a, which lacks SIZE;
T-NR lacks POS and SIZE at one prime; DH has no logarithm with prime-power support. {FE, SIZE} is the other minimal
input set of the input-level paragraph. The one mechanism on file that reads coefficients of 1/F in a non-identity
step (the 7/8 mechanism) reads PER in the conductor aspect and never the target's FE; row G34 reads abs(mu) only
right of 1.
Conditional statement: a device with this read set is addressed by no line of O, unless its chain is a criterion
(Weil, Li, Nyman-Beurling and the rows of map section 3.1 are of this read set and are restatements: line 11,
mode (I)). A device here must name the inequality that is not equivalent to the target.
Nearest closed rows: P1, P9, P23, P25, P36, P53, G34. No candidate on file.

**U3. Identification classes: read sets whose class contains zeta (and Dirichlet L-functions) only.**
Read sets: {FE, INT} at conductor 1 (Hamburger 1921, Satz 1, opened); degree one with FE, INT and the Euler-product
axiom (Kaczorowski-Perelli 1999, Theorems 2 and 3, opened: zeta or L(s + i theta, chi)); {POS, GEOM at every
rational prime, INT} (O, row 1b, Lemma I).
Why not covered: by construction no control lies in such a class, so requirement R3 cannot be tested with the
control battery; O records these classes as identifications, with no inequality (step type X4).
Conditional statement: for a device whose read set is an identification class the record supplies neither a
defeat nor a check. Such a device needs a different test of R3 than a control table: the proof must be shown to
fail when one hypothesis is relaxed inside a family where the conclusion is false (the families on file: E_a,
T-NR, WT, DEL, THIN each relax one input).
No lane has proposed an inequality on such a class; rows D5, P51 (strict form) and the uniqueness rows are the
neighbours.

**U4. Joint functionals of two or more objects that do not decompose over characters.**
Read set: zeta and a twist (or several twists) read together by one non-cone functional; Hermitian forms for
complex kernels; statements mixing several bridge objects.
Why not covered: rows Q28 and Q29 close forms that decompose over characters; rows P55 and G36 close single-object
sign conditions only (G36 as a measured finite search) and both list the joint case as not run; UNIV is out of
scope when the family grows or the completed functions are used.
Conditional statement: no row applies to a joint non-cone functional. The control classes it must reject are the
per-class tables of `c13-noncone-kernel-separator-search`, lifted to pairs (F, F twisted by chi).
In progress when this draft was written: `c14-joint-zeta-twist-noncone-search`,
`c14-joint-pair-design-ratio-vortex-cross-bridge`. Their outcomes decide whether U4 stays in the list.
Late note: the second of these wrote its line to `campaign/lanes.jsonl` while this draft was being finished (verdict as written by the lane: three joint-pair candidates closed at stage A, with T-NR at a split prime passing every functional of finitely many ratios L/zeta and BLS passing the cross bridge Gram form). It was not read or refereed by this lane; if its referee holds, U4 narrows to joint functionals that are not functions of the ratios and not Gram forms of the pair.

**U5. FE entering through a number of conditions that grows with the height.**
Read set: every-window statements that read the functional-equation phase together with Euler data at a number of
windows or heights growing with T (of the order of sqrt(T)/log T by round-3 lesson 6), not as a mean value.
Why not covered: O item 2b (WT; rows P40, S12) covers one window and any fixed number of windows and has no line
of its own; line 10 covers mean values over heights; UNIV excludes statements non-local in height by its scope.
Between "a fixed number of windows" and "a mean value" the record has no row.
Conditional statement: a device of this kind is addressed by no line. The pending proposal "non-locality step 4
of the Rouche lane" was read by the round-14 planner as the half-plane statement itself (`c4-fe-stage-rouche-crossing`
items 4 and 5); no other candidate is on file.

**U6. Attached objects outside the closed carriers.**
Read sets, each a separate cell left open by a closing row or listed in O section E:
(a) Hecke eigen-objects with parameter rho that are not Borel Eisenstein data, with Rankin-Selberg pole left of
2 - beta (row G35); in progress: `c14-theta-orthogonal-metaplectic-eigenobject`;
(b) Lax-Phillips Hecke norms outside the weighted-L^2 family (O section E; row G26); in progress:
`c14-laxphillips-hecke-norm-outside-l2`;
(c) global Whittaker constants of a genuine cusp form on the double cover of GL(3) (map section 6 item 18; row Z23
closes the local data only);
(d) rank >= 2 compact-at-infinity squares without a Hecke rule (no R1 as posed);
(e) states of the Bost-Connes system outside the three classes of row D8 (for type II_infinity weights at
beta <= 1 positivity is the Weil form, a restatement);
(f) functionals of the unsummed complex isogenous points that are neither linear nor a second moment (row G33);
(g) scattering inequalities that are not truncated-norm positivity, or that use the archimedean vector of a group
representation, which BLS lacks (row D9); the two-variable affine kernel, where the closure is argued only.
Conditional statement, per cell: no row applies. For (a), (b), (g) the first controls are EIS-w and BLS and the
first question is whether the inequality reads phi(w) = 0 or survives a Blaschke factor; for (e), (f) the first
control is T-NR by Lemma P. Cells (c) and (d) have no candidate inequality on file.

**U7. Sections of the prime chain with P(t) growing like a power of t; J-expansive sections.**
Why not covered: O section E, second item (unchanged since the outline); rows Q12, Q22 to Q24 close fixed finite
P, the polydisc, the Reinhardt shell and the gamma-coupled section. Conditional statement: no row applies; DH is
the first control (the no-go and the loss of sign in the closed forms hold for it alike).

**U8. Single-object kernel conditions beyond the searched range.**
Read set: sign conditions of step type X5 on one kernel with order above 4, more than three real parameters,
nodes outside [-2.6, 2.6], or a kernel or normalisation other than the theta-normalised one.
Why not covered: row G36 is a finite search and a measured one; the census of row P55 has twelve types and its
sign tables are measured. Conditional statement: the record does not exclude such a functional; rows G36 and P55
give the classes it must reject and the measured fact that conditions fitted on zeta and 23 L-functions did not
hold out on L-functions of larger conductor. Lemma L (T-NR with c >= 2 inherits minors on one lattice) and Lemma E
(E_a inherits every Polya-frequency order of the xi-kernel) are the proved parts.

## 3. Inside the one mechanism with R1 to R3 (reported with the part-B figure, not as a read set for R4)

The 7/8 mechanism (O section D; device `coherent-set-large-sieve`, floored) is failed by every listed control. The
record floors its format: floor 5/6 and ceiling 2/3 for the sextic format (rows Z15, Z24, Z27). Open inside it and
not closed by the record: (E-K) in the window Z/P < X < ZP; the target-specific excess of (E-H); the below-level
mixed moment and the slot capacity of Lemma 17.1 (map section 6 items 2, 3); TRO6 through the signed c-sum (item
4). Conditional statement: each of these moves the abscissa only between the method's floors; none is a read set
for the critical line, and the record contains no proved probe with signal constant h > 1.

## 4. Limits of the record that the statements above inherit

- A line of O names one control and does not claim the others were run. T-NR has no record by name for 23 of the
  device types (row P55); the phase-rotated transfer operator, theta^w and Beurling systems appear in few rows.
- Lines 13 to 20 of the outline are not rewritten as lemmas in O; item 2c (control RZ_b) has no line; item 2b
  points to rows P40 and S12 only.
- Mode (Z) of lines 1, 5 and 7 is relative to the counting statement S(theta) (Huxley 1972 opened for the density
  estimate; Ingham's deduction not opened); line 10 is relative to hypothesis H_W.
- Rows D9, G34, G35, G36, P55, L6, Z36 rest on one independent referee pass each; G36 is MEASURED; the affine part
  of D9 is ARGUED. Device codes of the UNIV scope table and the T-NR typing of the device table are argued readings.
- The 7/8 theorem and its follow-ups are unrefereed manuscripts; every statement about that mechanism is relative
  to them.
- No joint clause: the statements U1 to U8 are not a list of necessary inputs. A device may lie in none of them
  and still not be addressed (for example a read set that mixes U1 with a mean value), and a device in one of them
  may be defeated by a control that no lane has yet constructed.

## 5. Proposed wording if the checkpoint triggers (for the planner; not applied)

- STRATEGY section 4.0, "Read sets left open": replace RS-1, RS-2, RS-3 by U1 to U8 of section 2, with the
  sentence "these are the classes on which the record is silent, not leads".
- Explore falls to 1 lane (rule of section 2). Its entry test, on paper: the three pre-filter questions (Q-P, Q-B,
  Q-S), then the item list (i) to (iv) of U1 where the class is U1 or U2, then the control table.
- `engine/curated/mk_devices.py`, `PENDING`: the three RS proposals are replaced by one entry per class U1 to U8
  that has no lane (U1, U2, U3, U5, U6 (c) to (g), U7, U8); U4 and U6 (a), (b) follow the round-14 outcomes.
- Scoreboard notes: the campaign reports the refereed record of obstructions (O version 3; map 198 rows; 45 closed
  device types, 1 floored) and the part-B figure; headline 1 of 4 unchanged.
