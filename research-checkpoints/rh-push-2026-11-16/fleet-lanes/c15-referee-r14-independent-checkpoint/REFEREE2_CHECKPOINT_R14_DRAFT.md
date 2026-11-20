# REFEREE2: campaign/CHECKPOINT_R14_DRAFT.md (classes U1 to U8)

Independent referee, 2026-11-19. Read against: Statement O version 3 (sections A, C, E in full; lines 1 to 12 by
their headers and the summary table), map rows G26, G35, G36, P40, P55, Q12, Q22, Q28, Q29, D9, the round-14
RESULT files refereed in this lane, and the round-14 results and lessons of ROUND_LOG.md. Not read: the 198 map
rows one by one; the round-15 sibling lanes (their lines in `campaign/lanes.jsonl` were seen and are quoted as
pending, unrefereed). The file refereed is a record of what the obstruction record does not cover; neither it nor
this pass says anything about zeros of zeta.

## Verdict: HOLDS WITH SCOPE LINES; one sentence of the surrounding record is false as written

False as written (ROUND_LOG round 14, lesson 6 and the result line of lane 8; not a sentence of the draft itself):
"for {FE, GEOM}, {FE, SIZE} and identification classes no control on file has zeta's own functional equation".
Counter-examples on file: T-NR in the Laurent form, F = zeta m_w with m_w(s) = sum_k w_k p0^(k(s-1/2)),
w_k = w_(-k): m_w(1 - s) = m_w(s), so xi m_w satisfies zeta's own functional equation exactly (same gamma factor,
conductor 1); likewise the X_0(4) oval twin with c < -2 and every symmetric multiplier of Lemma M / Q-S (lane 5,
question Q-S, is built on this). Correct sentence: "no control on file has zeta's own functional equation
together with an ordinary Dirichlet series (INT); with both, the class is {zeta} (Hamburger 1921, opened in O)."
Consequence: FE alone identifies nothing. U1 and U2 are protected by INT, not by FE; with INT they are sub-cells
of U3.

## Class by class

| class | untouched by every line of O and the rows read? | defeated or narrowed by a control on file? | ruling |
|---|---|---|---|
| U1 {FE, GEOM}, step type X2 with FE | yes. Line 3 / 6 (E_a, NR) need a read set without GEOM at every prime; line 7 (THIN) needs no FE; line 2 (DH) needs no EP | not defeated. T-NR (Laurent form) has FE exactly and fails GEOM only at p0: it is the relaxation family for this class. Narrowed by round 14: an X2 step that consumes complete multiplicativity of the *twisting character* with both functional equations is the identity TW (DH, T-NR, E_a pass); on Eisenstein carriers the Hecke relation is supplied by the wave group (Lemma Q) or is an identity in the parameter (Lemma T, Lemma 2 of the weight-1/2 lane) | STAYS, as a sub-cell of U3 (read set must be written {FE, GEOM, INT}); items (v), (vi) added to its entry test |
| U2 {FE, SIZE}, POS at log level, X1 with FE | yes. Line 1 needs no FE; line 3 needs no SIZE | not defeated. T-NR fails POS and SIZE at p0 only (its logarithm has coefficients of size p0^(k/2) r^k with alternating sign at p0^k). Narrowed by round 14: a sign at log level read through finitely many ratios L(chi)/zeta is passed by T-NR at a split prime (Lemma C) | STAYS, as a sub-cell of U3 ({FE, SIZE, POS, INT}); one exclusion added |
| U3 identification classes | yes, by construction | no control can lie in the class; the R3 test must be by relaxation. Relaxations on file, one input each: INT (T-NR Laurent, symmetric multipliers: FE kept exactly), FE (U, THIN, DEL), FE at all heights (WT), GEOM globally (E_a), POS (sign twists) | STAYS; U1 and U2 are its cells with a typed step |
| U4 joint functionals not decomposing over characters | yes at the time of the draft | NARROWED by round 14 (both lanes refereed here, hold with scope lines): (i) functionals of finitely many ratios: T-NR at a split prime passes (Lemma C, PROVED); (ii) Gram / Hankel-block forms of the pair of unitary symbols: BLS passes (rank lemma PROVED for finite pole sets); (iii) twist-transfer Weil forms: identity TW, DH, T-NR, E_a pass (PROVED); (iv) sign functionals homogeneous in each kernel in dictionary DJ: closed MEASURED, outcome independent of the non-canonical lifts on the grid (LIFT_RULING.md); (v) functionals invariant under a common pointwise scaling of the members (pointwise quotients, cross-ratios, one-point triple expressions): HEAT passes exactly (Lemma J1', this lane, PROVED, unrefereed) | STAYS, narrowed to: joint non-cone functionals that are not of types (i) to (v). The late note of the draft is applied and extended by (iv), (v) |
| U5 FE through a number of conditions growing with height | yes: item 2b (WT) is for a fixed number of windows and has no line; line 10 is for mean values | no control on file between the two. The count sqrt(T)/log T is quoted from a round-3 lesson, not re-derived | STAYS unchanged. A round-15 lane (`c15-u5-window-count-threshold-translate-control`) is in progress; not read |
| U6 (a) non-Borel eigen-objects with parameter rho | partly | NARROWED: in rank one, for every cover, level and vector, the LRS-type count returns P - beta_0 = 1 (Lemma E of the weight-1/2 lane; (iii) relative to an unopened source) and the generic parameter passes; the twelve catalogued X2 inequalities are closed for torus parameters (Lemma T); isobaric sums with cuspidal data on GL_n: ARGUED (T4) | STAYS as: rank >= 2 non-Borel or metaplectic objects; in rank one only an inequality outside the LRS count and outside the catalogue, with a zero-specific hypothesis and none of L2 / pole position / spectral membership / unitarity |
| U6 (b) Lax-Phillips Hecke norms outside weighted L^2 | no longer | NARROWED: solid norms (and their mean-zero subspaces), Hecke-sup norms over any base, L^q with q < 2, and the zero-mode space are closed (EIS-w or the abstract triple passes, or the statement is Zagier's criterion) | STAYS as: non-solid norms outside the four families, and norms on invariant subspaces smaller than the mean-zero subspace; no candidate |
| U6 (c), (d), (e), (f) | yes (as listed in O section E and rows Z23, D8, G33); not re-read row by row | no | STAY unchanged; no candidate inequality on file for (c), (d) |
| U6 (g) scattering inequalities other than truncated-norm positivity | partly | NARROWED: Schur, bounded-analytic and Pick conditions of every order on a coefficient whose strip zeros are zeros are closed under Blaschke multiplication (Lemma F, B2, B3, PROVED; re-derived here), so BLS passes them | STAYS as: conditions reading an exact normalisation, the archimedean factor or f(z) = f(1 - z); rank above one; the two-variable affine kernel (ARGUED only) |
| U7 sections of the prime chain with P(t) a power of t; J-expansive sections | yes (O section E; rows Q12, Q22 read: finite P and the polydisc) | no control run. Line 12 covers "finite stage, then limit"; it does not cover a stage that grows with the height inside one inequality | STAYS unchanged. A round-15 lane (`c15-u7-growing-section-twin-ladder-bridge`) is in progress; not read |
| U8 single-object kernel conditions beyond the searched range | yes by construction (row G36 is a finite measured search) | sub-classes already closed by proved statements on file, for every order and every node set: minors on one lattice (T-NR, c >= 2, Lemma L); Polya-frequency orders of the xi-kernel (E_a, Lemma E of round 13). Added here (PROVED, elementary, unrefereed): for a kernel without polar terms any monomial inequality prod K(u_i)^(e_i) <= lam with real values, lam >= 0 and sum e_i u_i^2 >= 0 is inherited by backward heat (the monomial is multiplied by exp(tau sum e_i u_i^2 / 4), which lies in (0, 1] for tau < 0); the Turan ratio K(u-h) K(u+h)/K(u)^2 <= lam is the case e = (1, 1, -2), sum e_i u_i^2 = 2 h^2 | STAYS with these three exclusions written into the class |

## Scope lines for the draft as a whole

1. Section 2, header sentence "no line of O and no closed device row applies": checked against the lines of O and
   the ten rows listed above, not against all 198 rows. Label: READ.
2. U1, U2: add INT to the read sets and the sentence "with INT the class is an identification class (U3); the
   control battery cannot test R3 there".
3. U1 item list (i) to (iv): add (v) not a twist-transfer identity (TW); (vi) on an Eisenstein carrier, not a
   Hecke relation that the wave group or the parameter supplies identically.
4. U4: replace the late note by the five exclusions (i) to (v).
5. U6 (a), (b), (g): replace "in progress" by the narrowed cells.
6. Section 4, fourth bullet (rows resting on one independent referee pass): rows G37 to G40 of round 15 now rest
   on the lane's own pass plus this one.
7. Pending, unrefereed, not used in any ruling above: the round-15 line of
   `c15-control-with-zeta-fe-classes-u1-u2` claims a control ZQ = zeta m, m rational in s(1 - s), with zeta's own
   functional equation and every prime-power atom of log zeta, differing by an absolutely continuous density. If
   its referee holds, U1 and U2 read without INT are defeated by ZQ and the INT line of item 2 becomes the whole
   content of the two classes. It is consistent with the correction above (a symmetric multiplier keeps FE).

## What this pass does not establish

That a device exists in any class; that the list is complete (section 4 of the draft says so and stands); that
the classes U5, U7, U6 (c) to (f) were compared with every map row.
