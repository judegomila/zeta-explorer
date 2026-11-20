# Outline of the obstruction record (checkpoint preparation for round 9)

Written 2026-11-18 by lane `c8-repair-engine-map-r7`. Purpose: STRATEGY section 2, last adaptation rule. If after
round 8 no lane has a referee-confirmed R4 and section 4.0 has no proved step beyond its present state, two lanes
per round write the closed-family results as one refereed statement: what a device must read to supply R1, R3 and R4
together, with the control that defeats each class. This file is the outline of that statement. It is a record of
obstructions. It is not a result about zeros of zeta, and no line of it is one.

Referee state is counted from the REFEREE files present under `push/<lane>/` on 2026-11-18 ("1 ref", "2 ref"; "0 ref"
means no referee file in the lane directory; rows of the pre-campaign push were refereed in the syntheses and are
marked "pre-campaign"). A line of the final statement may be labelled PROVED only with two referees; the last column
says what is owed for that.

## 1. Form of the statement

**Definitions (to be fixed in the first writing lane).**
- A *target class* is a set of Dirichlet-series-type functions F containing zeta and the listed controls.
- A *device* is a procedure with a declared *read set* (the data of F it uses) and an output of the form "F has no
  zero with Re s > theta" in every window [T, T + H], uniformly in T (requirement R2).
- A device *is defeated by a control C* when C belongs to the read class (every input the device reads holds for C)
  and C has a zero with Re s > theta. Then the device cannot output theta for zeta from that read set alone.

**Statement O (outline; each clause is one line of section 2).** For each read class (i) below there is a control
C_i that satisfies every input of the class and has zeros to the right of the claimed abscissa; hence a device whose
read set is contained in class (i) outputs nothing below the stated floor. A device that supplies R1, R3 and R4
together must read, in one step, at least:
1. the coefficients at all primes jointly through a multiplicative relation (not their sizes, signs or support);
2. the functional equation or an equivalent global symmetry (the integers), in a form that changes under
   s -> s + 1 - b and F -> 1/F;
3. the unimodular size normalisation of the local parameters;
4. an input that fails for a non-periodic completely multiplicative unimodular weight (THIN): in the one known
   mechanism this is lattice-translation invariance of the coefficients;
5. an input that is not stable under backward heat flow and not a mean value over heights or over a family;
and its limit or crossing step must not be one of the closed device types of section 3.

**What the record does not say.** It does not say that no such device exists. The classes are those tested in
rounds 1 to 8 and in the pre-campaign push; section 4 lists what is outside them.

## 2. One control per read class

| # | read class (what the device reads) | control that satisfies the class | where the control has zeros | closing rows / lanes | referee state | owed before the line is PROVED |
|---|---|---|---|---|---|---|
| 1 | size, positivity or support of Lambda(n) (linear positivity; primes-only forms) | TW+, TW- (sign-twisted primes; Liouville twist as exact example) | Liouville: zeros at rho/2; TW: no functional equation | P9 (`screw-canonical`, 1 ref), P23 (`twist-rigidity`, 1 ref), P6 (`r2-pick-euler-entry`, 1 ref) | pre-campaign, one referee each; "three independent lanes" statement in BRIEF | second referee on one of P9 / P23 |
| 2 | functional equation + kernel positivity + ordinary Dirichlet series, no Euler product | DH | off the line, including Re s > 1 | P3 (finite Pick orders 2..148), P7, P8 (`dh-separator`, 1 ref), P18, D3, D7 | 1 ref per lane; DH kernel certificate `c1-missing-controls` Part C | a single two-referee lemma "finite Pick orders are Euler-blind" |
| 3 | Euler product + Lambda >= 0 + functional equation + explicit formula + growth, without the size normalisation | E_a = zeta(s+a) zeta(s-a) | Re s = 1/2 +- a | P14 (`nyman-baez-duarte`), P25 (`sym-power-positivity`), Z16 (`bootstrap`, 0 ref), F8 | 1 ref each; Z16 none | referee for Z16; statement of "size normalisation" as a hypothesis |
| 4 | hypotheses stable under small backward heat flow (monotone flow functionals, kernel-side positivity) | HEAT (kernel e^{tau u^2/16} kappa, tau < 0) | off-line zeros located at tau = -0.1, -0.5, -2 | F1 (`b-escape-law`, 1 ref), Q20 (`e1-burgers-cascade-anticausal`, 1 ref), P21 | 1 ref each | second referee on F1 (flow-blindness) |
| 5 | Euler product + Lambda >= 0 + pole, without the functional equation or the integers | Beurling zeta | up to any theta < 1 (literature, not re-read) | P46 (`c4-helson-discrepancy-zerofree`, 1 ref + 2 checks), P36, P25 | 1 to 2 ref | open the Beurling literature statement used |
| 6 | anything invariant under a change of local test vector at one prime | T-NR twin | Re s = 1/2 +- arccosh(abs(c)/2)/log q | Z18 (`r3-tnr-control`, 1 ref) | 1 ref | second referee |
| 7 | complete multiplicativity with unimodular local parameters, any discrepancy or twisted-sum hypothesis that is not periodicity | THIN (zero at any real b in (1/2, 1)); U (unimodular twist) | b | control THIN (`c4-thin-twist-control-78`, 1 ref; `c5-thin-walk-replay`, REFEREE2), P46, P51 (`c5-twisted-helson-arcs`, 2 ref), D4 | THIN construction: status proved-relative (short-interval statements quoted, primary text not opened) | open the primary source for the ray-class short-interval statement |
| 8 | frequencies log n only (Baker linear forms, finite Turan power sums) | every Dirichlet-series control (DH, TW, THIN, U, WT) | as above | D1, D6 (`c5-device-table-extension`, 1 ref) | 1 ref | second referee |
| 9 | discrete special values (p-adic interpolation, Iwasawa data) | interpolation twin zeta + c L(chi_-4) L(chi_5) | prescribed point | D5 (`c5-device-table-extension`, 1 ref) | 1 ref | second referee; exact statement of the twin |
| 10 | mean values over heights or over a family (large sieve, density, mollified moments) as the only input to an every-window conclusion | cluster lifts; a family with one exceptional member; WT (height translates) | one off-line pair in one window | MV-CAP (map section 5 part 1), P29 (`b-mvcap-function-side`, 1 ref), P15, P50 density half (not run), Q25 item (b) | 1 ref each | a two-referee statement of MV-CAP in the form used; the density half of P50 |
| 11 | exact identities with no inequality (explicit formula, residue theorem, uniqueness, bridge traces, DtN identities) | every control (the identity holds for each; its sign reads the zeros) | n/a: restates the target | P1, P8, L2 (`b-euler-detector`), D7, Q25 items 1, 2 | 1 ref each | none beyond wording: "identity, no lever" |
| 12 | finite stages, finite prime sets or finite orders, with a limit taken afterwards (Lee-Yang stages, Hurwitz, Krein-index semicontinuity, polydisc bounds) | U and random twists (same stage pole counts); DH at finite Pick order | n/a: the limit step is not closed for any F | Q19 (`c1-leeyang-krein-limit`, 1 ref), Q21 (`c2-polydisc-leeyang-bound`, 1 ref), P3 | 1 ref each | second referee on Q21 (rotation invariance of stage tools) |
| 13 | sections of the prime chain tested by first moments (polydisc, Reinhardt shell, gamma-coupled) | DH (the no-go and the loss of sign hold for it alike) | n/a | Q12, Q22 (`c1-multidelay-bohr-section`, 2 ref; `c2-jinner-multidelay-lft`, 1 ref; Theorem A' 2 ref), Q23, Q24 pending (`c7-laurent-shell-gamma-section`, 1 ref; Lemma 2 second referee, monomial case proved) | mixed | Lemma 2 for non-monomial m; Lemma 1 for general hypersurface measures |
| 14 | Euler phases coupled to the functional-equation phase at one height or in a fixed number of windows | WT, U (height translates pass any fixed number of windows) | n/a | P40 (`e1-rs-torus-laguerre-orbit`, 1 ref), S12 (`c3-multiwindow-converse-defect`, `c2-euler-cone-fe-rigidity`, 1 ref each) | 1 ref each | second referee on S12 |
| 15 | Hecke operators as functions of the wave group, of translations or of a cutoff (commutators, compressions, primitive tests) | every inner scattering function; every control at the orthogonalisation step | n/a | G22, G25, G26 (`c4-laxphillips-hecke-compression`, 1 ref), P35 (`c1-spinor-hecke-primitive`, 2 ref) | 1 to 2 ref | none for P35; second referee on G26 |
| 16 | a self-adjoint operator of Selberg type as control or companion | (the control does not exist in the needed form) | n/a | G24 (`e1-selberg-twist-control`, 1 ref) | 1 ref | second referee |
| 17 | geometric positivity (Hodge index, heights, Heegner spans) | function-field fakes; block-permuted non-multiplicative family | n/a | T3 (`ff-transplant`, 0 ref), P38 (`e1-heegner-averaged-nb-span`, 1 ref) | 0 to 1 ref | referee for T3 |
| 18 | recurrence, universality or almost periodicity ("one off-line zero forces many") | DH, E_a (separated only at the density estimate) | n/a | P39 (`e1-sparse-recurrence-amplifier`, 1 ref) | 1 ref | second referee |
| 19 | the conductor-aspect family of real characters through reciprocity | U in the height aspect (n^{-it} has no field) | floored: real zeros within c/log q of 1 only | Z29 pending (`c7-landau-siegel-device-read`, 1 ref; Lean tree not compiled locally) | 1 ref | compile of the tree (optional); second referee |
| 20 | a coherent set with a large sieve (the 7/8 mechanism): reads items 1 to 4 of Statement O | none of the listed controls passes (R1 to R3 hold; THIN fails at periodicity, DH at the scalar Euler identity) | floor above 1/2 fixed by the method | Z15 (`r3-method-limit`, 1 ref), Z27 pending (cap 1 - 1/r for operator-norm low estimates; 2 ref), Z24 (normaliser, 2/3; Lemma H 3 ref), Z15b (2 ref), Z15c, Z22 (2 ref), Z23, Z26, Z28 pending | mixed; the sources (manuscript, Liu I, II) are unrefereed | see section 3 |

## 3. The one mechanism with R1 to R3: what is closed inside it and what is not

| statement | closing lane | referee state |
|---|---|---|
| signal constant h is an invariant of the probe (re-expression does not change it) | `c5-target-fe-order2-ledger` (Lemma U) | 2 ref |
| abelian families do not absorb mu | `c5-angular-family-absorption` | 2 ref; abstract-family statement ARGUED |
| probes of higher degree in the target reduce to the linear system | `c6-pair-probe-bridge-order2` | 1 ref |
| double covers through local data give no weight-0 cocycle | `c6-gl3-cover-epsilon-cocycle` | 1 ref, claim narrowed; engine verdict open |
| normaliser H_eta: cap at abscissa 2/3 for sextic rows | `c6-marks-bc-manuscript-check` (Lemma H, H1, S) | Lemma H 3 ref; (2.2) iff sigma_0 > 2/3 (referee of c7-repair) |
| cap 1 - 1/r + lx/(2r) for every l2-l2 low estimate, no hypothesis lx >= l | `c7-probe-format-h-cap` (Theorem K, Lemma HS) | 2 ref (second: `c8-repair-engine-map-r7`) |
| phase-blind low estimates have B >= 1 | same (Lemma A) | ARGUED; one sub-step open (non-principal rows of the twisted target) |
| h > 1 by uncompensated marks: the low input contains the squared signal | `c7-uncompensated-high-side-normaliser` (Lemma C), `c7-ff-order2-vertex-exact`, `c7-liou-high-row-bound` | 1 ref each; Lemma C ARGUED (lane `c8-row-energy-squared-signal`) |
| periodicity sits in the low half as the absence of one Hermitian term; it carries neither R1 nor R4 | `c7-liou-high-row-bound` (Theorem A) | 1 ref; remainder ARGUED (lane `c8-liou-row-bound-theorem`) |
| family sums and family indices of bridge forms under the 7/8 input: gain 0 | `c7-bridge-seven-eighths-krein-index` | 1 ref |

Open inside the mechanism at the time of writing (round 8 lanes running): (E-K) vector-specific row mean square;
(E-H) cancellation over non-principal rows; the compensated probe (12.5) in F_q[T]; a bridge built from a single
probe row; global Whittaker constants on the double cover of GL(3). The record must carry the round-8 outcomes of
these five before it is frozen.

## 4. Outside the record (must be listed in the final statement as not covered)

- Devices of types absent from `engine/curated/devices.json` (the explore slot of each round adds to this list).
- Sections of the prime chain with P(t) growing like a power of t; J-expansive sections.
- Lax-Phillips Hecke norms outside the weighted-L^2 family; rank >= 2 compact-at-infinity squares without a Hecke rule.
- The density (family) half of quadratic positivity with automorphic companions.
- Controls not run in many lanes: T-NR, Beurling, the phase-rotated transfer operator and theta^w appear in few rows;
  a line of section 2 names one control and does not claim the others were run.
- Statements whose only source is an unrefereed manuscript (the 7/8 theorem and its follow-ups) are relative to it.

## 5. Work plan for the two writing lanes (from round 9, if the checkpoint triggers)

1. Lane A (statement): fix the definitions of section 1; write lines 1 to 12 of section 2 as lemmas with the control
   construction and the exact step at which the control satisfies the read class; one page each; no new mathematics.
2. Lane B (referee debts): the items in the last column of section 2, in the order 7 (THIN primary source), 10
   (MV-CAP statement), 2 (finite Pick orders), 4 (flow-blindness), then the single-referee lines.
3. Both: every line cites its map row; rows pending in `campaign/MAP_PENDING.md` Part 2 are applied first.
4. Acceptance: Statement O is entered in the map as one row with label "record of obstructions"; the scoreboard part D
   counts its lines with two referees. No headline flag changes.
