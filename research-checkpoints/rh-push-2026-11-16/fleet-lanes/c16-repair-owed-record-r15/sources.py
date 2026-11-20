#!/usr/bin/env python3
"""Source table of lane c16-repair-owed-record-r15: for every edited row or note, the lane file relied on and the
sentence relied on, quoted. check_sources.py verifies that each file exists and contains the quote verbatim
(whitespace-normalised). Paths are relative to tmp/research-2026-11-16/."""
U5 = 'push/c15-u5-window-count-threshold-translate-control/'
U7 = 'push/c15-u7-growing-section-twin-ladder-bridge/'
DN = 'push/c15-nonhomogeneous-pair-triple-kernel-search/'
ZQ = 'push/c15-control-with-zeta-fe-classes-u1-u2/'
R14 = 'push/c15-referee-r14-independent-checkpoint/'
KL = 'push/c15-klein-transport-lemma-w-stage-a-and-e1/'
RP = 'push/c15-repair-record-strategy-v4-report/'
LR = R14 + 'LABEL_RESTRICTIONS.md'
S = []
def add(target, file, quote):
    S.append(dict(target=target, file=file, quote=quote))

# ---- item 1: rows and controls
add('map row S12b', U5 + 'RESULT.md', 'Proposed map row (not applied; this lane writes only here): "S12b. Window functional-equation rigidity with a number of windows growing with T, heights inside one span `[T, T + L]`.')
add('map row S12b', U5 + 'RESULT.md', 'Free-prime U with an off-line model zero on contiguous windows: conditions `24 + 0.36 K`, passes K = 128 at T = 1e6 and reaches 2.0e-6 at K = 256 (MEASURED, float64, no certificate).')
add('map row S12b', U5 + 'REFEREE.md', 'Consequence: `K_tr(T, eta) = max(eta T log(T/2 pi)/pi, sqrt(8 eta T))(1 + o(1))` over all real alpha; the second term matters only when the first is below about 2.7, that is for K at most 2.')
add('map row S12b', U5 + 'REFEREE.md', '"Class U5 is therefore closed" is established for identification-type conclusions; for zero-location conclusions it is MEASURED in a finite model only.')
add('map row S12b', U5 + 'REFEREE.md', 'so `F_+-` does not pass the test of section 1 at tolerance `eta_span` at every point.')
add('map row Q30', U7 + 'RESULT.md', 'Q25 | Sections of the prime chain with P = t^theta on the gamma one-port; J-expansive (sharp) sections (left open by Q22 to Q24; class U7) | Fejer section L_F = sum_rho K_u(s - rho), Re K_u >= 0 on Re w >= 0: J-contractive on Re s > 1/2 + eta_0 for every P iff no zeros there (limit step by Harnack and Vitali; stage inequality = row P45).')
add('map row Q30', U7 + 'REFEREE.md', '(iii) For the actual control (c > 2) the statement fails through the off-line zeros of m, i.e. at the conclusion, like DH.')
add('map row Q30', U7 + 'REFEREE.md', 'Run here (check C): 4 of 4 random unimodular twists violate at theta = 1 and 1.5, at the same level as the sign chains.')
add('map row Q30', U7 + 'REFEREE.md', 'It should be recorded as CLASSICAL in content with a proof written here, not as a new theorem.')
add('map row Q30', U7 + 'REFEREE.md', 'The label ARGUED is right; the constant should not be copied to the map.')
add('map row G41 (DN part)', DN + 'RESULT.md', '- Proposed map row: "sign functionals of a kernel pair or triple that are not homogeneous in each kernel (pointwise quotient and its dilation minors of orders 2 to 3;')
add('map row G41 (DN part)', DN + 'REFEREE.md', '3. **Canonical and FE tiers are not closed.** 0 full in the canonical tier is a float64 statement on the 22,508 T-train nodes; 67,138 nodes remain float64-undecided and could in principle reach T-train.')
add('map row G41 (DN part)', DN + 'REFEREE.md', 'Correct split: nine-class tier 752 = 360 identity + 392 in balls (not 280 + 472); six-class tier 2,774 = 360 identity + 2,414 in balls')
add('map row G41 (DN part)', DN + 'REFEREE.md', '2. **"Backward heat is exactly blind" is a statement about one lift.** Proved for equal tau on both members and the kernel without polar terms.')
add('control rows ZQ, SG, NR-q; note', ZQ + 'RESULT.md', '- Control row **ZQ** (section 2 of the map, next to NR): "zeta(s) m(s), m rational in s(1-s), degree 0, two on-line zero pairs exchanged for a quartet at 1/2 +- eta +- i gbar | keeps zeta\'s functional equation and gamma factor, pole, order, N(T), every prime-power atom of log zeta (EP, GEOM, SIZE on atoms)')
add('control rows ZQ, SG, NR-q; note', ZQ + 'RESULT.md', 'Companion **SG** (real-zero twin): m = (t^2 + b^2)/(t^2 - g1^2), zeros of zeta at 1/2 +- i g1 replaced by the real pair 1/2 +- b. D(x) = -2 x^(-1/2)(cosh(b log x) - cos(g1 log x)) <= 0 for all x (PROVED: cosh >= 1 >= cos).')
add('control rows ZQ, SG, NR-q; note', ZQ + 'RESULT.md', 'Companion **NR-q** (F4): q = 1 + sqrt 2, c = 2.1: FE defect 1.9e-30; zero at 0.857311 + 3.564428i (winding 1);')
add('control rows ZQ, SG, NR-q; note', ZQ + 'REFEREE.md', 'If GEOM, SIZE and EP are read on the atoms, ZQ is a control for U1 and for the SIZE branch of U2; if they are read on ordinary coefficients, U1 is inside U3 by Hamburger.')
add('control rows ZQ, SG, NR-q; note; Lemma L', ZQ + 'REFEREE.md', 'Lemma L (PROVED given Landau): FE, no pole other than s = 1, and Lambda_G >= Lambda force G = c zeta; without the pole clause it fails (G_+ above has Lambda_G >= Lambda >= 0, zeta\'s functional equation, exact atoms and off-line zeros, with real poles in (0, 1)).')
add('control note (Lemma D, E3)', ZQ + 'REFEREE.md', 'the input is Selberg\'s N_0(T) >> T log T (a positive proportion of zeros on the line), which gives consecutive on-line ordinates with gap O(1/log T).')
add('control note (Lemma D, E4)', ZQ + 'REFEREE.md', 'The lemma covers multipliers of the form 1 + sum c_j (l_j^(s-1/2) + l_j^(1/2-s)) with finite weighted l1 norm.')
# ---- item 2: 30 label restrictions (each quoted from LABEL_RESTRICTIONS.md)
R = {
 1: '1. Outcome sentence: add "with the lane-defined lifts; on the grid stage the outcome holds with the canonical lifts T-NR, E_a, HEAT alone (referee recount); the draws were not recounted".',
 2: '2. "No functional reaches T-train": add "in the nine-class reading; 59 do in the FE tier read per class".',
 3: '3. Lifts BLS, theta^w, BEU: label "lane-defined, not canonical". theta^w: "at w = 1 the pair is (zeta, chi^2)".',
 4: '4. BEU: "not an off-line control (zeros in Re s > 0 are those of zeta and of L(s, chi))"; its column is not a control column.',
 5: '5. Lemma T, DH row: "kept iff chi_G^2(q_psi) = 1 (5 of 28 members, real or complex psi); lost otherwise". FE tier to be read per member (A).',
 6: '6. Lemma J1: add "same tau on both members; kernels without polar terms".',
 7: '7. Section 5, "Why no pair functional gains": ARGUED, and for BLS and T-NR a statement about the lift.',
 8: '8. Lemma A: exponent 3(1 - sigma)/(2 - sigma) "for 1/2 < sigma_0 <= 4/5"; above 4/5: 2(1 - sigma)/sigma or 1/2 (A).',
 9: '9. Lemma A, Lemma B: "PROVED-rel Montgomery, Theorem 12.1, recalled, not opened (two searches)".',
 10: '10. Identity TW, second display: "chi even"; whole identity: "chi primitive, c supported on (m, q) = 1".',
 11: '11. Lemma C: "finite set of characters; p0 depends on the set; coefficientwise pair lift".',
 12: '12. Section 2.6: the E_a and DH rows of link 1 are ARGUED / undecided.',
 13: '13. "One linear condition b(1) = 0, propagated to the whole row by the Hecke relation at squares": false as written. Replace by "every A(n^2, s) carries zeta(u) (Lemma 1\'); b(1) = 0 gives the odd squares only" (A).',
 14: '14. Lemma V: "times non-zero local functionals" is wrong at the prime 2 on Re u = 1 (A).',
 15: '15. Lemma V: definition of f_q repaired (principal twist replaced by F - (1/q) sum_j F(z + j/q)) (A); level and multiplier relative to Shimura 1973, not opened.',
 16: '16. Lemma 3 and Lemma E (iii): PROVED-rel the regularised Rankin-Selberg method, not opened; exponents MEASURED.',
 17: '17. Lemma E: "closes the LRS-type count in rank one", not "every inequality on a rank-one object".',
 18: '18. Corollary L1: "as an operator norm on X; on the mean-zero subspace the bound is implied by admissibility" (A).',
 19: '19. Decisive test (iii) and "Not covered": ARGUED statements about classes of constructions.',
 20: '20. Lemma Q: PROVED-rel c4 Lemma 1 and the wave evolution of non-L^2 data.',
 21: '21. H2 figure 4.1e10: a product of local suprema at k <= 60; on one prime the supremum is 1.000 for k <= 30.',
 22: '22. Zagier\'s criterion, Sarnak\'s exponent, Kim-Sarnak: recalled, not opened. "BLS": the lane\'s reading.',
 23: '23. Lemma T: "chi even primitive"; T1: "on the line Re w = P - 1" in place of "at real w" (A).',
 24: '24. T3 / POLE1: "the position part of POLE1"; the pole at 1 is double for torus objects (A).',
 25: '25. List L-c: {E4} only (A). Row E9 / O1: "simple zero", not "double zero" (A).',
 26: '26. T4 and "the non-Borel cell is closed for GL_n": ARGUED (A).',
 27: '27. Catalogue sources: E12 opened through Duke 1988 pages 73 to 74 (Iwaniec: k >= 5/2, squarefree n; weight 3/2 recalled); E1, E7, E8, E11 confirmed at abstract level; E10 citation only; E9 not searched.',
 28: '28. Verdict item 5, "for a < 1/2 an off-line zero is a pole and the Schur condition is the zero-free statement itself": false as written; replace by the corrected sentence of REFEREE2 section 3; remove "none sits between"; add the growth hypothesis for a >= 1/2 (A, extended).',
 29: '29. Q-B: state B1 to B3 for inner functions with real symmetry (the T-NR instance is an infinite product); the T-NR quotient bound can be labelled PROVED (argument in REFEREE2 section 1). Sweep counts: READ, one reader.',
 30: '30. ROUND_LOG round 14, lesson 6 and result line 8: "no control on file has zeta\'s own functional equation" is false as written; replace by "... together with an ordinary Dirichlet series (INT)".',
}
WHERE = {**{k: 'map row G41 (DJ part); device dictionary-dj-joint-pair-sign-functionals' for k in range(1, 8)},
         **{k: 'map row G38; device joint-pair-ratio-crossgram-twist-transfer' for k in range(8, 13)},
         **{k: 'map row G39; device lrs-count-rank-one-eigenobject-at-zero-theta-orthogonal' for k in range(13, 18)},
         **{k: 'map row G37; device laxphillips-hecke-norm-outside-l2' for k in range(18, 23)},
         **{k: 'map row G40; device catalogued-x2-inequality-torus-parameter-eigenobject' for k in range(23, 28)},
         28: 'map section 2 note Lemma F; section 7; dated note in c14-prefilter RESULT.md',
         29: 'map section 2 note Lemma F',
         30: 'campaign/ROUND_LOG.md (dated notes at round 14 lesson 6 and result line 8); map note ZQ; section 7; CAMPAIGN_REPORT_R15.md 2.4'}
for k in sorted(R):
    add('restriction %d -> %s' % (k, WHERE[k]), LR, R[k])
# ---- item 2/4: Lemma F note, E1'
add('Lemma F note (E1 replacement)', KL + 'PROPOSED_E1_REPLACEMENT.md', '(ii) R_a is Schur on Re w > 0 (analytic with abs(R_a) <= 1) if and only if m(lambda - 2a) >= m(lambda) for every zero lambda with Re lambda > a.')
add('Lemma F note (E1 replacement)', KL + 'REFEREE.md', "| E1' (i) to (v) | PROVED | Confirmed.")
add('Lemma F note (growth hypothesis)', R14 + 'REFEREE2_c14-prefilter-sweep-geometric-nodes.md', 'needs a growth hypothesis (bounded type in the half-plane); true for X in the gamma class of xi.')
add('Lemma F note (T-NR quotient PROVED)', R14 + 'REFEREE2_c14-prefilter-sweep-geometric-nodes.md', 'so it is bounded and Schur by the maximum principle. This is a proof; the lane labels the bound MEASURED.')
# ---- item 3: E1 to E4
add('CAMPAIGN_REPORT_R15.md 2.4 (E1)', RP + 'REFEREE.md', 'Replace by: "no control on file that is an ordinary Dirichlet series has zeta\'s own functional equation (Hamburger); T-NR and HEAT keep the symmetry and lack exact local structure at one prime, respectively a Dirichlet series".')
add('CAMPAIGN_REPORT_R15.md sections 1, 4 (E2)', RP + 'REFEREE.md', 'With these three not counted the figures are 119 lanes with an independent referee, 107 holding, 89.9% (against 110 of 122, 90.2%).')
add('CAMPAIGN_REPORT_R15.md section 3; STRATEGY (E3)', RP + 'REFEREE.md', 'As a bound on an abscissa the figure is rounded below the infimum; 0.8748866471, or the infimum itself, is the correct form.')
add('STRATEGY.md header (E4)', RP + 'REFEREE.md', '- **E4. `STRATEGY.md` version 4, first paragraph, carries the compute limits of 2026-11-18** (4 cores, 8 GB, 3 hours; one heavy lane) after the BRIEF update of 2026-11-19 (8 cores, 12 GB, 6 hours; numerical first tests on the server).')
# ---- item 4: pole clause
add('c15 lane 2 RESULT.md, three places (pole clause)', ZQ + 'REFEREE.md', 'The three sentences must carry the clause "with no pole other than s = 1", and row F2 must read "POS can hold (D >= 0) at the price of real poles in (0, 1)".')
# ---- item 5/7: checkpoint
add('silent-cell nodes; pending; Statement O v4', R14 + 'CHECKPOINT_R15_REFEREED.md', '**U3. Identification classes (stated first because U1 and U2 are cells of it).**')
add('silent-cell nodes U4', R14 + 'CHECKPOINT_R15_REFEREED.md', 'Open: joint functionals of none of these types, for example quotients at different points, a logarithm of one member alone, kernels with polar terms, triples read through the group law at several points.')
add('silent-cell nodes U6', R14 + 'CHECKPOINT_R15_REFEREED.md', '(g) Scattering inequalities that read an exact normalisation, the archimedean factor, or f(z) = f(1 - z); rank above one; the two-variable affine kernel.')
add('silent-cell nodes U8', R14 + 'CHECKPOINT_R15_REFEREED.md', '**U8. Single-object kernel conditions beyond the searched range (order above 4, more than three parameters, nodes outside [-2.6, 2.6], other normalisations).**')
add('silent-cell node U2-POS', 'campaign/STRATEGY.md', '**Exact missing lemma, POS-FE.** Let G be meromorphic in C with a simple pole at s = 1 and no other pole, of finite order, satisfying zeta\'s functional equation (conductor 1, zeta\'s gamma factor), and suppose -G\'/G(s) = integral over [1, infinity) of x^(-s) d nu(x) in some half-plane with nu a non-negative measure. Then G = c zeta.')
