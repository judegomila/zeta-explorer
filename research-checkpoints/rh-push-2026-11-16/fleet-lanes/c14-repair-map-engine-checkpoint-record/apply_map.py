"""Map edits of lane c14-repair-map-engine-checkpoint-record (round 14 repair). Every replacement is asserted unique.
Previous file: before/OBSTRUCTION_MAP.md.
Part 1: seven rows for round-13 lanes 1 to 6 (D9, G34, G35, G36, P55, L6, Z36), three notes of section 2, eight rows of section 7.
Part 2: the eight relabels of c13-referee-r12-independent (RESULT.md section 4) applied to rows D8, Z35, G33, P54 and the UNIV note;
        the stale phrase of row P53 on the second referee of Lemmas S and T."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__)); F = os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md')
t = open(F, encoding='utf-8').read()
n_rep = 0
def rep(old, new):
    global t, n_rep
    assert t.count(old) == 1, (t.count(old), old[:70])
    t = t.replace(old, new); n_rep += 1
def after_row(label, row):
    global t
    m = [x for x in re.finditer(r'^\| %s \|.*$' % re.escape(label), t, re.M)]
    assert len(m) == 1, (label, len(m))
    assert row.count('|') == 7 and '\n' not in row, (label, row.count('|'))
    new_label = row.split('|')[1].strip()
    assert not re.search(r'^\| %s \|' % re.escape(new_label), t, re.M), new_label
    t = t[:m[0].end()] + '\n' + row + t[m[0].end():]
def row(*cells):
    assert len(cells) == 6
    for c in cells: assert '|' not in c and '\n' not in c, c[:60]
    return '| ' + ' | '.join(cells) + ' |'
ME = 'c14-repair-map-engine-checkpoint-record'
REF2 = 'c13-referee-r12-independent'

# =====================================================================================================================
# header
rep("Update 2026-11-19, seventh (`c11-repair-del-referee-record`)",
    "Update 2026-11-19, tenth (`" + ME + "`): rows owed from campaign round 13, each worded after the independent referee pass in the lane's REFEREE.md. "
    "Added: D9 (Borel Eisenstein series on the loop group of SL_2; rank-one inequality PROVED closed, affine kernel ARGUED), G34 (Fourier interpolation with zero nodes), "
    "G35 (Luo-Rudnick-Sarnak mechanism on Eisenstein data at a zero), G36 (dictionary D of sign functionals of the theta-normalised kernel: closed as MEASURED, finite search), "
    "P55 (pre-filter Lemma P and the census of non-cone inequality types), L6 (Edrei-Thoma local total positivity), Z36 (bilinear reciprocity at height t as a J-form); "
    "notes BLS, NR on a scattering carrier and Lemma P in section 2; eight rows of section 7. "
    "Edited: rows D8, Z35, G33, P54 and the UNIV note carry the eight relabels of the second independent referee `" + REF2 + "` (RESULT.md section 4; table in `push/" + ME + "/RESULT.md` section 2.2); "
    "row P53 records that second referee for Lemmas S and T. Rows 191 -> 198. No bound moves and section 1 is unchanged. "
    "The previous file is kept as `push/" + ME + "/before/OBSTRUCTION_MAP.md`.\n\nUpdate 2026-11-19, seventh (`c11-repair-del-referee-record`)")

# =====================================================================================================================
# section 2 notes (placed before the DEL note, after the battery note)
rep("- Control DEL (`c10-thin-deletion-zero-mode-control`, two referee files; table row above) is the member of TW+",
    "- Control BLS, scattering-level Blaschke control (`c13-kacmoody-eisenstein-affine-weyl-shift` section 3.3, Theorem C; one independent referee pass; row D9; engine code BLS, status \"proved in rank one\"). "
    "M_B(z) = [xi(z)/xi(z+1)] times a product over j of (z - a_j)(z - conj a_j)/((z + a_j)(z + conj a_j)), Re a_j > 0, Im a_j != 0. "
    "Has: every p-adic local factor of zeta, M(z)M(-z) = 1, modulus 1 on Re z = 0, Maass-Selberg positivity of the rank-one truncated norm for every T >= 1 (PROVED), a zero at each prescribed a_j anywhere in the open right half-plane off the real axis. "
    "Lacks: a vector at the archimedean place of a group representation; the relation f(z) = f(1 - z) for a function f with M = f(z)/f(z+1). "
    "Use: kills any argument on an Eisenstein or scattering carrier that uses only the cocycle relation, unitarity, the pole structure in the positive chamber and positivity of truncated norms. "
    "Limits: a single real Blaschke factor is not covered (the Moebius step does not preserve the half-plane); the sign is not free (phi = -M fails); for the two-variable affine kernel BLS is not a group object and its passing is ARGUED. "
    "Pre-filter question for a scattering device: does the inequality survive multiplication of the coefficient by a Blaschke product over non-real conjugate pairs.\n"
    "- NR on a scattering carrier (same lane, section 3.3 (b), as corrected by its referee, item 1): for c > 2 and b = arccosh(c/2)/log q < 1/2 the factor D(z)/D(z+1), D(z) = q^(z-1/2) + q^(1/2-z) + c, is a convergent Blaschke product over the non-real pairs 1/2 +- b + i(2k+1) pi/log q shifted to the scattering variable; "
    "the T-NR scattering coefficient is M times this factor (it keeps the pole of M at z = 1; \"M_T is analytic and bounded in Re z > 0\" does not hold as first written) and passes Maass-Selberg positivity. T-NR with these parameters is a case of BLS.\n"
    "- Pre-filter Lemma P (`c13-tnr-invariance-prefilter-noncone-census`, one independent referee pass, five corrections; row P55; hand-off file `PREFILTER.md`). PROVED, elementary: T-NR with c > 0 satisfies every hypothesis that zeta satisfies if each hypothesis is "
    "(S1) a linear identity or membership in a linear class stable under multiplication by m(s) = p0^(s-1/2) + c + p0^(1/2-s), "
    "(S2) a condition T(F) in a convex cone K with T linear in F or in its kernel and the factor p0^(k(s-1/2)) acting by an operator that maps K into K in both directions (dilation-invariant cone), or "
    "(S3) a condition at primes other than p0 or a tail condition on the primes. "
    "A device must contain a step outside S1 to S3 for T-NR to fail; the step types outside are X1 (log level: Lambda_F >= 0, Pick or Weil forms, size at p0, coefficients of 1/F), X2 (exact covariance at p0: complete multiplicativity, Hecke eigen-relation, spherical vector), "
    "X3 (an input that is a zero-location statement or a certificate at low height), X4 (identification: conductor 1 with integer frequencies; integrality of special values), X5 (kernel conditions in a set that is not a dilation-invariant convex cone: log-concavity, Polya-frequency order >= 2 of the xi-kernel, Laguerre and Turan expressions, sign-regularity of order >= 3 on generic nodes, equalities with a fixed constant); c < 0 is outside the lemma. "
    "Check against the device table (typed with the records visible, not a blind test): 13 device types carry a T-NR record, 8 recorded passes at steps S1 to S3, 7 recorded failures each at a step X1, X3, X4 or X5, 0 disagreements (counts as corrected by the referee, R-1; 8 of the 15 recorded cells are inferences). "
    "Used from round 14 as question Q-P of the three-question pre-filter, with Q-B (control BLS) and Q-S (does the target enter linearly or by division, so that symmetric multipliers with strip zeros pass; row G34).\n"
    "- Control DEL (`c10-thin-deletion-zero-mode-control`, two referee files; table row above) is the member of TW+")

# =====================================================================================================================
# new rows (round-13 lanes 1 to 6)
D9 = row("D9",
 "Borel Eisenstein series on the loop group of SL_2: constant term over the affine Weyl group with shifts by the central parameter c, Maass-Selberg positivity, degenerate Whittaker coefficients (campaign round 13; R4 by a group generated by s <-> 1 - s and a translation acting on the target)",
 "Coefficients are chain products of M(u) = xi(u)/xi(u+1) at u = z + kc and kc - z (coefficient census relative to a recalled normalisation; Garland's relations and the FKP formula for affine groups not opened). In the chamber 0 < Re z < Re c every denominator argument has Re > 1; strip arguments occur only as numerator arguments (the coefficients are not holomorphic in the chamber: poles at z + kc = 1 and kc - z = 1; referee correction 1). "
 "Rank-one Maass-Selberg positivity for T >= 1 is equivalent to: N = z(1 - S)/(1 + S), S = T^(-z) M(z), is a Nevanlinna function of z^2 (Theorem B; in content the Weyl-Titchmarsh function of the truncated problem, classical). The class is closed under multiplication of S by Blaschke factors over non-real conjugate pairs of the right half-plane (Theorem C, an elementary Moebius computation; a real zero taken twice is covered, a single real factor is not, and the sign is not free: phi = -M fails), so zeros can be prescribed anywhere in Re z > 0 off the real axis. "
 "T-NR with c > 2 and b = arccosh(c/2)/log q < 1/2 enters as the Blaschke factor D(z)/D(z+1) (section 2 note). At c = 1 the chamber is the critical strip, the diagram automorphism is s <-> 1 - s and every non-identity coefficient is xi(z)/xi(z+n): an identity between coefficients (existence of the series for Re c <= 2 is relative to continuation results not opened). "
 "Closed for the rank-one Levi inequality: PROVED. For the two-variable affine kernel the same closure is ARGUED, not proved (BLS and T-NR are not group objects there; no formula tested). Not covered: the wall Re c -> 0; inequalities that are not truncated-norm positivity.",
 "PROVED (Theorems B, C; T-NR factor with the convergence argument of the referee; telescoping Lemma A3; rank-one Levi), re-derived by one independent referee; PROVED-rel recalled normalisation (Lemmas A1, A2); affine kernel ARGUED; grid statements MEASURED, of low power close to a threshold (referee item 3: a clean grid at T slightly below 1, where the inequality is not asserted); five corrections of wording or scope",
 "T-NR (c > 2, b < 1/2) and BLS pass every analytic step of the rank-one inequality (proved); DH: no failure found on the grids below height 2000 (MEASURED; no zero with Re s >= 3/2 at any height because the sum of abs(a_n) n^(-3/2) over n >= 2 is 0.738 < 1); E_a passes as a group object (its formal kernel fails on a grid, cause not proved); EIS-w not run; anti-controls with a pole in Re z > 0 fail",
 "`c13-kacmoody-eisenstein-affine-weyl-shift` (+ REFEREE.md, independent pass; `MAP_ROW.md`, `controls_BLS_proposed.json`)")

G34 = row("G34",
 "Fourier interpolation with nodes at the zeros and frequencies log n/(4 pi) (Bondarenko-Radchenko-Seip, arXiv:2005.02996), with the Radchenko-Viazovska pair (sqrt n, sqrt n) on the theta group as the case s = 0 (campaign round 13; user geometric program X_0(4))",
 "The kernel is (F*(s)/F*(w)) times A_k(w, s), with A_k a target-independent Dirichlet series of the theta group, unique by Bochner's converse theorem (relative to the source's sections 3, 4; sections 3 and 6 not re-derived). The target enters by division. Kernels built by this recipe inside one gamma class and one sign of the functional equation are related by symmetric multipliers G(s)/G(w) (Lemma M: an identity of these kernels, not a classification of all interpolation bases with these nodes; referee C5). "
 "The Euler product is read twice: absolute convergence of 1/F in Re w > 1 (the proof needs sum over d <= y of abs(b(d))/d << y^eps, which T-NR satisfies with unbounded coefficients; \"abs(mu(d)) <= 1\" over-describes the input, C9), giving the edge Re w = 1 and partial sums of size x^(1/2+eps) (inequality (I-1)); and the Ramachandra-Sankaranarayanan horizontal lower bound (function class only). "
 "For multiplier controls (T-NR: factor P(1/2 + iz), real, of one sign, modulus in [abs(c) - 2, abs(c) + 2]) off-line nodes change no sign or decay of the basis functions in z; for a general target nothing is established about signs (no basis function was computed; C7). Off-line nodes move the exponent of the partial sums in the frequency index from 1/4 to beta/2 < 1/2. For s outside a countable set, partial sums of size x^kappa imply that no zero has Re rho > 2 kappa (PROVED-rel); the converse, that the exponent equals half the supremum of Re rho, is ARGUED (C1, C2): a restatement of Littlewood type. "
 "The pivot (Weil functional in the basis, W U_n = Lambda(m)/(pi sqrt m) for n = m^2) is the explicit formula in coordinates (positivity rows of section 3.1). Closed at stage A. Not covered: the kernel for the gamma factor Gamma_R(s+a) Gamma_R(s-a) (E_a, EIS-w); signs of DH basis functions; stage B (the functions U_n, V_rho) was not run.",
 "PROVED (Lemma M as an identity; Lemma T); PROVED-rel BRS (sections 3, 6 not re-derived); T-NR in the class H_1: height selection ARGUED (a repair by the referee is offered, not checked against the source's proof); DH and theta^w rows ARGUED on source passages that are sketches (C3, C6); one independent referee, nine corrections",
 "T-NR passes every step (source section 5.3.3; Lemma T gives its basis from zeta's); WT passes as a translate; DH passes in a smaller class (self-duality of the combination measured to 1e-29); theta^w passes the construction with basis functions that have additional poles (source 5.3.2); E_a open at the gamma-class step and fails (I-1) in size; controls without a functional equation stop at the definition of the kernel",
 "`c13-fourier-interpolation-zero-nodes` (+ REFEREE.md, independent pass; `engine_device_proposal.json`)")

G35 = row("G35",
 "Luo-Rudnick-Sarnak mechanism (Rankin-Selberg positivity, even twists in the conductor aspect, gamma pole at the non-tempered parameter) applied to E*(z, rho/2) and to Borel Eisenstein objects at regular parameters in any rank (campaign round 13; RS-1 with RS-2)",
 "At xi(rho) = 0 the completed Rankin-Selberg function G(w) = xi(w + beta - 1) xi(w + 1 - beta) xi(w + i gamma) xi(w - i gamma) has exactly one simple pole pair, at w = 2 - beta and beta - 1 (six of the eight residues carry xi at rho or a reflection of rho; the pair that survives uses the functional equation at rho; for beta = 1/2 the statement is the regularity of G at 1/2 at a zero of any multiplicity). This is the pole count of a cusp form, at P = 2 - beta instead of 1. "
 "The gamma pole of the even twists is at beta_0 = 1 - beta, so P - beta_0 = 1 for every parameter: for Borel (GL_1-induced) data of any rank at regular parameters, and for any Hecke eigen-object with these Satake parameters, the statement follows from the Hecke eigenvalues alone (referee defect 2; walls excluded). The vanishing forced at the gamma pole is the trivial zero L(0, chi) = 0 of even chi, an identity in the parameter. The inequality of the mechanism beta_0 <= w*(P, d) reads beta <= 7/4. "
 "The mechanism needs P = 1 independent of the parameter (square-integrability), available only for zeros outside the closed strip (row G12). Lemma 1 is a corollary of the classical Rankin-Selberg transform of a product of two Eisenstein series (Zagier 1981, not opened); not a new theorem. Not covered: non-Borel objects (residual or cuspidal data on a larger group with Rankin-Selberg pole left of 2 - beta; no candidate on file); a level-q object for T-NR.",
 "PROVED (Lemmas 1, 2, 3; Lemma 4 relative to Gindikin-Karpelevich), re-derived by one independent referee with contour residues at zeros 3 and 5 and two generic parameters; LRS exponent count ARGUED (reconstructed; reproduces 1 - 2/(n^2+1); LRS 1995 not opened; the verdict does not depend on it); numerics MEASURED; five wording defects",
 "E_a, EIS-w (the Eisenstein series at a generic parameter) and WT pass every step with the same output (confirmed by the referee at beta = 0.7 and 0.15); T-NR, DH, DEL, THIN, U and sign twists are not formulable (no Hecke eigen-object constructed; not run)",
 "`c13-lrs-twist-amplification-zero-representation` (+ REFEREE.md, independent pass; `MAP_ROW.md`)")

G36 = row("G36",
 "Dictionary D: sign functionals of the theta-normalised kernel with at most three real parameters (determinantal minors of orders 2 to 4 of dilation matrices, Turan-type expressions, Hecke-compensated forms at primes up to 13; with and without the polar terms), searched for a separator of zeta and primitive L(s, chi), q <= 13, from every battery control class (campaign round 13; compute lane, registered question)",
 "MEASURED, finite search; closed as a device class on the registered grid and draws only, with the conventions of the lane's PREREG section 2. Of 12,994,697 functionals evaluated on 290 objects, 629,432 are one-signed on the 24 positives (459,547 of them from the adaptive stage, not independent draws); none has the opposite sign on a member of every control class (0 at every tier; 841,651 cases not decided by float64 resolved in balls). "
 "0 of the 629,432 give the battery Davenport-Heilbronn function the opposite sign; 400 reject a backward-heat member. The positive condition is a fitted condition on 24 objects and does not hold out: held-out L-functions of conductor 14 to 40 take the opposite sign at a mean rate 0.287, higher than held-out DH members of real-part type (0.193), so the DH count is not a sensitivity of D to the Euler product (referee finding 1). "
 "By family: minors of the kernel with polar terms never reject backward heat or theta^w; minors of the kernel without polar terms never reject E_a, backward heat or EIS-w (the sign depends on the order alone). With zeta as the only positive: five functionals reject a battery member of every class, none meets the held-out rule, and each separates zeta from the L-functions as well. Registered prediction \"T-NR passes the minors with polar terms\" is false (pass fraction 0.646); \"E_a passes\" holds on the registered positives. "
 "Lemma H (heat passes the order-2 part of one family) is the only proved statement. Not run, and not covered: Hermitian forms for complex kernels; orders above 4; more than three real parameters or nodes outside [-2.6, 2.6]; functionals reading two kernels at once (lane `c14-joint-zeta-twist-noncone-search`); other kernels or normalisations.",
 "MEASURED (float64 with a rounding-noise rule, ball arithmetic for the undecided entries; counts of 10.2 of the 13.0 million functionals are on the server and were read from the result files by the referee, not recomputed); PROVED (Lemma H, order 2); T-NR and DH have one battery member each; one independent referee (1,226 entries re-evaluated with separate code at 330 digits, 0 sign differences), seven findings on the reading",
 "battery DH passes every functional one-signed on the positives; backward heat passes more than 99.9%; E_a and EIS-w pass on the kernel without polar terms, theta^w on minors with polar terms; T-NR does not pass uniformly (rejected by a fraction 0.35 of the minors with polar terms) but no functional rejects all classes",
 "`c13-noncone-kernel-separator-search` (+ REFEREE.md, independent pass; `PREREG.md`, `tables/`)")

P55 = row("P55",
 "Pre-filter for T-NR (Lemma P) and census of inequality types not preserved by cone endomorphisms, as candidates for a step that fails both T-NR and E_a (campaign round 13; combine)",
 "Lemma P (section 2 note): T-NR with c > 0 passes every device whose hypotheses are linear identities or linear-class memberships, dilation-invariant cone conditions on objects linear in F, and conditions away from p0; exclusions X1 to X5. Scope restrictions needed for 0 disagreements with the record: the log level, c < 0 and mollified mean values are outside. "
 "Lemma L: for c > 0 the weight sequence (p0^(-1/2), c, p0^(1/2)) of T-NR is totally positive iff c >= 2 (zeros off the line iff c > 2; referee R-4); by Cauchy-Binet T-NR with c >= 2 inherits the sign of every minor of a dilation matrix of zeta's kernel with row nodes on one p0^2-lattice, given constant sign of zeta's minors on that lattice (MEASURED at orders 2 to 5, not proved). Lemma E: the xi-kernel of E_a is the convolution of Phi e^(au) and Phi e^(-au) and inherits every Polya-frequency order of Phi. Both lemmas are applications of classical theorems (Aissen-Schoenberg-Whitney-Edrei; Schoenberg, Karlin), not new (R-5). "
 "Census of twelve non-cone types (determinantal, hyperbolicity, norm equalities, entropy and others), each with the T-NR and E_a verdict at a named step: no entry fails both controls at a step that is an unconditional property of zeta, reads the functional equation and is not passed by another control. Where both fail the condition is a consequence of the target for zeta (Laguerre expression on the line, all-order criteria), or the size of local parameters (empty for zeta, no functional equation), or order-4 minors of the theta kernel with its constant term on generic nodes, where theta^w passes for w = 1/3, 1/2, 3 (and fails from w = 3.5; R-2), zeta's sign is measured and differs from that of primitive characters, and the T-NR failure is rare outside p0 = 2, 3 (R-3). "
 "T-NR and E_a are separated by complementary kernels: xi-kernel translation determinants cannot fail E_a; theta-kernel conditions of orders 1 and 2 with the constant term cannot fail T-NR. Not covered: 23 device types with no T-NR record by name; functionals of two objects.",
 "PROVED (Lemmas P, L, E; elementary), re-derived by one independent referee; MEASURED (sign tables of minors, mpmath, exact rationals for determinants; zeta's signs not proved); device typing ARGUED from one-line readings with the records visible; five corrections (R-1 to R-5)",
 "T-NR (c > 0) passes S1 to S3 by the lemma; E_a passes every Polya-frequency condition on the xi-kernel; theta^w (w = 1/3, 1/2, 3) passes the one entry that fails both; unimodular twist, Beurling, phase-rotated transfer operator and backward heat not run on the order-4 entry",
 "`c13-tnr-invariance-prefilter-noncone-census` (+ REFEREE.md, independent pass; `PREFILTER.md`)")

L6 = row("L6",
 "Edrei-Thoma local total positivity: the coefficient sequence of each Euler factor is a totally positive (Polya frequency) sequence",
 "Holds exactly for T-NR with c >= 2 (c > 0) and for E_a (exact arithmetic), and fails for the tempered twin with abs(c) < 2, for L(s, chi) at primes with chi(p) = -1 and for tempered degree-2 factors: the condition is ordered against the target (it selects real non-negative local parameters, not unimodular ones). It says nothing about dilation minors of the kernel: the registered prediction that T-NR passes the minors of row G36 because its local sequence is totally positive was refuted (pass fraction 0.646). Closed as a device.",
 "PROVED (Aissen-Schoenberg-Whitney-Edrei criterion applied; exact arithmetic check); one independent referee",
 "T-NR (c >= 2) and E_a pass; zeta's twists by characters with chi(p) = -1 fail",
 "`c13-tnr-invariance-prefilter-noncone-census` section 5 (+ REFEREE.md); `c13-noncone-kernel-separator-search` (prediction 2a)")

Z36 = row("Z36",
 "Bilinear twist-modulus reciprocity at height t (Bettin 2016, arXiv:1607.05595, Theorem 5 with the Estermann reciprocity, case z = 0, complex s) read as a J-form over characters (campaign round 13; companion of row Z34, which closed the Hermitian form)",
 "Entries R_chi(t) = rotated L(s, chi) L(s, chi-bar), s = 1/2 + it: real, R_chi = R_chi-bar, R_chi(t) = const Z_chi(t) Z_chi(-t). J = complex conjugation on the character group, J = 1 exactly on real characters. The sign of R_chi(t) is (-1)^(number of zeros of L(s, chi) in the strip with ordinate in (-t, t)): off-line zeros come in pairs with the same ordinate, so the sign is fixed by the argument principle and is the same for every function with this functional equation and real pair entry, whether or not its zeros are on the line (referee addition). "
 "Inertia of the group matrix: twice the number of complex pairs with odd parity and non-zero real part of the weight transform, plus the sign of the zeta entry 2 sqrt(q) cos(t log q) - 2 (index count as corrected, E3). The reciprocity at height t, truncated at any J >= 1 with the remainder as one contour integral (integrand of order abs(v)^(-(J + 3/2 + c)), E1; a finite form with remainder is already in the source, E2), is the period relation z -> -1/z of the Eichler-integral series of E(z, 1/2 + it) at the central point of its additive twists (this reading is ARGUED): the height is the spectral parameter, the target's functional equation enters only through the archimedean kernel, and the two L-arguments are tied at (s + j, s - j), j integer, so no kernel in two independent heights is reached. "
 "No one-sided statement that is not an identity follows. With row Z34 exact reciprocity is closed as a height-reading device in the Hermitian and the bilinear form. Not covered: an exact law for the Estermann function off its central point (none known).",
 "PROVED (Lemma 1 for J >= 1, Proposition 3, Lemma 5), re-derived by one independent referee; RELATIVE TO Bettin Theorem 5 (source opened as text); sign changes of R_chi established by direct evaluation at q = 5, 7, 11 (the Hardy-type theorem for the pair is cited, not opened, E4); four corrections",
 "T-NR: every entry multiplied by a number in [(abs(c) - 2)^2, (abs(c) + 2)^2], so every sign, inertia and cone statement is unchanged; E_a with real a: every entry is a Hermitian square; DH: entries real for q = +-1 mod 5 with the same sign rule; window translate: covariant; DEL, THIN, U: no functional equation of twists, not formulable",
 "`c13-bilinear-reciprocity-height-antibridge` (+ REFEREE.md, independent pass)")

after_row('D8', D9)
after_row('G33', G34); after_row('G34', G35); after_row('G35', G36)
after_row('P54', P55)
after_row('L5', L6)
after_row('Z35', Z36)

# =====================================================================================================================
# Part 2: the eight relabels of c13-referee-r12-independent (map rows only)
SECOND = "; second independent referee (`" + REF2 + "`): holds"
# (1) Bost-Connes, Lemma C restricted to the Galois-invariant KMS state; (2) Lemma P last sentence ARGUED; (3) Lemma L last sentence; (4) inner perturbation per beta
rep("(v) T-NR is beta -> Tr(D e^{-beta H}) with D >= 1 a fixed positive element of C*(Q/Z) in the centraliser;",
    "(v) T-NR is beta -> Tr(D e^{-beta H}) with D >= 1 a fixed positive element of C*(Q/Z) in the centraliser, that is, the value of the KMS family on a fixed D >= 1: as a function of beta it is zeta(beta) phi_beta(D), and it is an inner perturbation of the dynamics only at each beta separately (relabel 4);")
rep("ARGUED or classical-not-opened (Lemma P last sentence, Lemma B last sentence;",
    "ARGUED (Lemma P last sentence, \"no value zeta(beta + it), beta <= 1, is a value of a positive functional of the system\": PROVED / CLASSICAL -> ARGUED, relabel 2); restricted (Lemma C after its first sentence and consequences 2(a), 2(d) hold for the Galois-invariant KMS state only, relabel 1; Lemma L last sentence, divergence of the product of gamma_p on 0 < beta < 1, is false at beta = 1/2 where gamma_p = 1 and holds for beta != 1/2, relabel 3); ARGUED or classical-not-opened (Lemma B last sentence;")
rep("one independent referee, six corrections |",
    "one independent referee, six corrections" + SECOND + " in a narrower form, four labels restricted or downgraded, none used by the closure |")
# (5) depth-aspect 3.5 first bullet; (6) "exchange only for N of about log q"
rep("An exchange is measured to exist only up to N of about 11 to 17 at log q between 6.4 and 12.1 for abs(t) >= 14 (Lemma D gives existence without rate; for small abs(t) the principal character is an exchange at every N, G3).",
    "An exchange is measured to exist only up to N of about 11 to 17 at log q between 6.4 and 12.1 for abs(t) >= 14; non-existence is proved for N >= q^delta and abs(t) >= t_r, and is measured, not proved, between log q and q^delta (relabel 6). Lemma D gives existence without rate; for small abs(t) the principal character is an exchange at every N (G3; the bound N/abs(t) + O(1) of the lane's section 3.5, first bullet, is ARGUED, not CLASSICAL: its error term is misstated and it is not load-bearing, relabel 5).")
rep("five overstatements narrowed by the referee |",
    "five overstatements narrowed by the referee" + SECOND + " (Lemma P exact, x_1 certified in exact rationals, five new windows in Arb, brute force over all characters at six (q, t)); two labels restricted or downgraded |")
# (7) X_0(4) oval: twin statement
rep("C_p Lambda is -p^(-3/2) times the T-NR twin with c = -(p^(3/2) + p^(1/2)), whose extra zeros lie outside the closed strip;",
    "C_p Lambda is -p^(-3/2) times the T-NR twin with c = -(p^(3/2) + p^(1/2)) (c < -2, extra zeros real and outside the closed strip: Re s = 2.2423 at p = 3; \"is a T-NR twin\" holds only with this qualifier, relabel 7);")
rep("positive on the arc (provable from monotonicity of theta, referee remark 1)",
    "positive on the arc (PROVED by a two-line argument of the second referee; was MEASURED at 9 points)")
rep("one independent referee, four corrections |",
    "one independent referee, four corrections" + SECOND + ", twin statement in the narrower form; Lemma 1(a) (real-locus count) not re-derived by the second referee and not used by the reduction |")
# (8) UNIV: Corollary U4, class N wording
rep("U2 and U5 are CLASSICAL consequences, not new; device codes ARGUED; one independent referee, five corrections |",
    "U2 and U5 are CLASSICAL consequences, not new; Corollary U4 (hybrid form) PROVED-rel -> ARGUED until \"connected complement\" is read in the primary source (Theorem 30 of the survey as printed lacks it; relabel 8); branch F relative to Theorem 7 of the survey only; device codes ARGUED; one independent referee, five corrections" + SECOND + " relative to one source theorem, part (a) only |")
rep("- Filter UNIV (`c12-univ-pointwise-control-wcone`, one independent referee pass; row P54;",
    "- Filter UNIV (`c12-univ-pointwise-control-wcone`, one independent referee pass and the second pass of `" + REF2 + "` on part (a): hypotheses used are pairwise non-equivalent characters, a compact window with connected complement in 1/2 < Re s < 1, non-vanishing targets, positive lower density; Corollary U4 is ARGUED; row P54;")
# P53: second referee of Lemmas S and T (not one of the eight; removes a stale "owed")
rep("(one referee; second referee for its Lemmas S and T owed)",
    "(one referee; second referee `" + REF2 + "` on Lemmas S and T at q = 5, 7, 13: hold, PROVED given Conrey-Li Theorem 2 (opened; statement matches), closed in three readings of \"tied\" (m = w, 1/w, v), not for a tie with one shift per character; the heat cell was not refereed a second time)")

# section 3.9 intro: rows D8 and D9 come from other lanes than the round-5 device table
rep("Row texts are the lane's, with the six wording corrections of its referee applied (lane `c6-repair-referee-debts-r5`).",
    "Row texts are the lane's, with the six wording corrections of its referee applied (lane `c6-repair-referee-debts-r5`). Rows D8 (round 12) and D9 (round 13) are device types closed by later lanes, named in their source cells; the first sentence of this paragraph describes D1 to D7 only.")

# =====================================================================================================================
# row count
rep("Row count (2026-11-19, `c13-repair-map-engine-battery-records`): P 54, G 33, Q 29, S 12, Z 38, F 8, T 3, L 5, D 8, O 1 = 191 (previous count by `c12-repair-sources-statement-o-v3`: 186).",
    "Row count (2026-11-19, `" + ME + "`): P 55, G 36, Q 29, S 12, Z 39, F 8, T 3, L 6, D 9, O 1 = 198 (previous count by `c13-repair-map-engine-battery-records`: 191).")

# =====================================================================================================================
# section 7
last7 = "| \"M1 allows z < 1/2 at r = 0\"; \"the object the candidate proposed to bound is itself a named control\" as the reason for R3 |"
m = [x for x in re.finditer(r'^' + re.escape(last7) + r'.*$', t, re.M)]
assert len(m) == 1
def r7(a, b, c):
    for x in (a, b, c): assert '|' not in x and '\n' not in x
    return '| ' + a + ' | ' + b + ' | ' + c + ' |'
rows7 = [
 r7("\"Any inner factor\" preserves Maass-Selberg positivity; \"M_T(z) = T(z)/T(z+1) is analytic and bounded in Re z > 0 and is the Blaschke product of its zeros\"; \"coefficients are holomorphic in the chamber\"; DH \"passes the formal test\"",
    "c13-kacmoody-eisenstein-affine-weyl-shift",
    "Proved for Blaschke products over non-real conjugate pairs (a single real factor is not covered; phi = -M fails). The statement on T-NR holds for the factor D(z)/D(z+1); M_T keeps the pole at z = 1, and the chain coefficients have poles in the chamber. DH: no failure found on the grid, of low power near a threshold. Closure proved in rank one, argued for the affine kernel (row D9; referee items 1 to 3, 5)"),
 r7("\"Exponent 1/4 + eps for all s is equivalent to RH\"; \"bases form one orbit under symmetric multipliers (proved)\"; \"off-line nodes change no sign or decay of the basis functions\"; \"abs(mu(d)) <= 1\" as the input; \"DH passes in the class of source section 5.3.3\"",
    "c13-fourier-interpolation-zero-nodes",
    "Implies RH (PROVED-rel, outside a countable set); converse ARGUED. Lemma M is an identity of kernels built by one recipe in one gamma class, not a classification. Sign statement established for multiplier controls only. The input is absolute convergence of 1/F right of 1. DH and theta^w rows ARGUED on source sketches. Verdict unchanged (row G34; referee C1 to C9)"),
 r7("\"For every Eisenstein object in every rank\"; \"the dominant constant-term exponent never vanishes\" as the reason; \"G(beta) = 0\" without restriction",
    "c13-lrs-twist-amplification-zero-representation",
    "Borel data at regular parameters (walls and non-Borel objects excluded). The pole and gamma-pole positions follow from the Hecke eigenvalues alone. Table rows need beta != 1/2. Verdict unchanged (row G35; referee defects 1 to 3)"),
 r7("\"14 device types carry a recorded T-NR verdict, 8 passes and 8 failures\"; \"theta^w passes N4b, N4c, N4d\"; \"totally positive exactly when the twin's extra zeros leave the line\"; Lemmas L and E listed as new",
    "c13-tnr-invariance-prefilter-noncone-census",
    "13 device types, 8 passes, 7 failures, 0 disagreements (one table cell misread: not formulable, not a failure). theta^w passes for w = 1/3, 1/2, 2, 3 and fails order 4 from w = 3.5 and order 3 from w = 8; theta^2 is not a control here. For c > 0: totally positive iff c >= 2, zeros off the line iff c > 2. Both lemmas are applications of classical theorems. Verdict unchanged (row P55; referee R-1 to R-5)"),
 r7("Remainder integrand of Lemma 1 of order abs(v)^(-J-1); the finite form \"not in the source in this form\"; index count with c-hat != 0; \"Selberg's method gives the sign changes\"",
    "c13-bilinear-reciprocity-height-antibridge",
    "Order abs(v)^(-(J + 3/2 + c)); the lemma stands for J >= 1 and fails as stated for J = 0. The source has a finite form with remainder (Lemma `rtfs`, Proposition `cfd`). Count with Re c-hat != 0 plus the zeta entry. Sign changes by direct evaluation at q = 5, 7, 11. Verdict unchanged (row Z36; referee E1 to E4)"),
 r7("Registered prediction \"T-NR passes D1\" (local total positivity of its Euler factor); \"0 of 629,432 one-signed functionals reject battery DH\" read as sensitivity to the Euler product; verdict label \"precise obstruction\"",
    "c13-noncone-kernel-separator-search",
    "Prediction false (pass fraction 0.646). The one-signed condition is fitted on 24 objects and held-out L-functions are rejected more often (0.287) than held-out DH members of real-part type (0.193); 73% of the one-signed functionals come from the adaptive stage. The closure is MEASURED, a finite search on the registered grid and draws (rows G36, L6; referee findings 1 to 7)"),
 r7("Lemma C beyond its first sentence and consequences 2(a), 2(d) for every KMS state; Lemma P last sentence labelled PROVED / CLASSICAL; Lemma L last sentence (divergence of the product of gamma_p on 0 < beta < 1); \"T-NR is a bounded inner perturbation of the dynamics\"",
    "c12-bost-connes-crossed-product-duality (second referee " + REF2 + ")",
    "Galois-invariant KMS state only; ARGUED; false at beta = 1/2 (gamma_p = 1), holds for beta != 1/2; per beta only, reworded \"value of the KMS family on a fixed D >= 1 in C*(Q/Z)\". None is used by the closure (row D8; relabels 1 to 4)"),
 r7("Section 3.5 first bullet (principal-character bound N/abs(t) + O(1)) labelled CLASSICAL; \"an exchange exists only for N of about log q\"; \"is a T-NR twin\" (oval device); Corollary U4 labelled PROVED-rel",
    "c12-depth-aspect-height-transfer; c12-x04-oval-hecke-fricke-loading; c12-univ-pointwise-control-wcone (second referee " + REF2 + ")",
    "ARGUED (error term misstated; not load-bearing). Proved for N >= q^delta with abs(t) bounded below, measured between. Twin with c < -2 and extra zeros outside the strip. ARGUED until \"connected complement\" is read in the primary source. None is used by a closure (rows Z35, G33, P54; relabels 5 to 8)"),
]
t = t[:m[0].end()] + '\n' + '\n'.join(rows7) + t[m[0].end():]
open(F, 'w', encoding='utf-8').write(t)
print('map patched; replacements', n_rep, '; lines', t.count('\n'))
