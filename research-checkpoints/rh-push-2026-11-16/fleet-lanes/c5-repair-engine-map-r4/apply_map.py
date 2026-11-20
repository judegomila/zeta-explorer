#!/usr/bin/env python3
"""Applies the round-4 pending rows to push/OBSTRUCTION_MAP.md (lane c5-repair-engine-map-r4). Each edit is an exact
anchored insertion; the script stops if an anchor is missing or already edited. Previous file: before/OBSTRUCTION_MAP.md."""
import os, re, json
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md')
s = open(P, encoding='utf-8').read()
assert 'c5-repair-engine-map-r4' not in s, 'already applied'
lines = s.split('\n')
log = []

def find(prefix):
    ix = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    assert len(ix) == 1, (prefix, ix)
    return ix[0]

def after(prefix, new, what):
    i = find(prefix); lines.insert(i + 1, new); log.append(what)

def append_to(prefix, text, what):
    i = find(prefix); lines[i] = lines[i].rstrip() + ' ' + text; log.append(what)

# 1. header note
after('Update 2026-11-18, second (`c4-repair-map-engine-r3`)',
      '\nUpdate 2026-11-18, third (`c5-repair-engine-map-r4`): campaign round 4 (`c4-*`, each refereed once) is added: control THIN '
      '(section 2, table row and note), rows P44 to P49 and G26, entries 48 and 49 of section 4, the round-4 paragraph of section 5, '
      'the update of item 14 and items 21, 22 of section 6, and four rows of section 7. Literature opened for rows P47 and P48 '
      '(arXiv abstract 1707.01315; ar5iv text of 1501.04585, Lemma 8 and Section 8; arXiv abstract 1503.05121). '
      'The previous file is kept as `push/c5-repair-engine-map-r4/before/OBSTRUCTION_MAP.md`.', 'header: update note')

# 2. control THIN (table row after WT) and note
after('| WT | window translate',
      '| THIN | thin sign twist: eps completely multiplicative, eps(p) = -1 on a set S of primes with pi_S(x) = (1/2) int_2^x t^(b-1) dt/log t + O(x^(b-eta)) '
      '(greedy floor rule), +1 elsewhere; F(s) = sum eps(n) n^-s = zeta(s)(s - b) W(s), any b in (1/2, 1) | complete multiplicativity; unimodular local '
      'parameters at every prime; ordinary Dirichlet series; continuation to Re s > max(b - eta, b/3) with W analytic and non-vanishing there; one simple '
      'pole at 1 (residue c = prod_{p in S} (p-1)/(p+1) > 0); eps(p) = 1 on a set of primes of relative density one; partial sums c x + O(x^(b+eps)) '
      '(PROVED, elementary; measured exponent of block suprema 0.37 to 0.45 at b = 0.9). Zero: simple, at s = b; translate by n^(-i tau) for b + i tau. '
      'Status: PROVED-rel a short-interval prime theorem of Hoheisel type (eta > 0; eta = 0.475 with Baker-Harman-Pintz), **cited from memory** until '
      '`c5-thin-walk-replay` reports; numerics MEASURED (b = 0.9, primes to 1e9, tracking discrepancy in [-1, 0]); refereed once | periodicity of the '
      'coefficient sequence modulo any ideal (hence the functional equation of every twist, and the Poisson dual in the conductor aspect); Lambda >= 0 | '
      'kills any argument for a zero-free half-plane that uses the target only through multiplicativity, local size, continuation and the pole. For the 7/8 '
      'proof the first unavailable step is the L-periodicity of the target weight (manuscript Prop. 5.1, used through Lemmas 5.2 and 5.8; same property '
      'missing at Lemmas 4.8, 8.1, 17.5): ARGUED from the hypotheses, proofs not replayed. Proposition D (PROVED): for eps the low estimate and the high '
      'comparison cannot both hold; which one fails is open (`c5-thin-propd-dichotomy`) |', 'section 2: table row THIN')
i = find('- Controls added after the table was built.')
lines.insert(i + 1,
      '- Control THIN (`c4-thin-twist-control-78`, refereed once; table row above) answers the item open since round 1 (a sign twist with a zero in '
      '7/8 < Re s < 1). It is a member of TW- and of U with real values. It names what the 7/8 mechanism uses beyond the Euler product: '
      'lattice-translation invariance of the coefficients (every sextic twist is periodic, with a Poisson dual uniform in the modulus), used in the '
      'conductor aspect of a family and never as s <-> 1-s for the target. Relative to zeta it obeys row P46: right of its real zero b its zeros are '
      'those of zeta. The greedy sign set of `c4-helson-discrepancy-zerofree` (count + 1 <= li(x^b) rule) gives a double zero at b; the floor rule above '
      'gives a simple zero. Engine code: ctl-THIN (status conjectural until the short-interval input is re-read).')
log.append('section 2: note on THIN')

# 3. rows P44-P49 after P43, G26 after G25
rows_P = [
 '| P44 | Functional-equation-symmetrised Euler stage (Gonek 2012: G_X = P_X + chi conj(P_X)) with Rouche or Hurwitz comparison; stage collisions as '
 'carriers of zero information | The on-line theorem is P-independent: G_X = 0 forces abs(chi(s)) = 1 because abs(conj P_X) = abs(P_X) != 0, so every zero '
 'with 0 <= sigma <= 1, t >= C_0 lies on the line for every X and for any non-vanishing P (Gonek Thm 6.2, Lemma 6.1, opened). It holds verbatim for every '
 'unimodular twist, the Liouville twist, E_a-type products and Beurling products; it contains no arithmetic. The stage is not analytic; the analytic stage '
 'P_X(s) + chi(s) P_X(1 - s) has off-line zeros outside the range where the phase F_X is monotone (X < L^2/16 sharp cut; about (L log L)^2/16 Fejer; '
 'L = log(t/2 pi); row Q11). The degree (Poincare-Bohl) form of Rouche on a box: zeta/G_X avoids (-inf, 0] on the boundary. It implies the box is '
 'zero-free, so no statement strictly weaker than zero-freeness of the boxes implies it; at fixed X it fails at arbitrarily large height for sigma_0 < 1 '
 '(Montgomery omega theorem, recalled, not opened). The boundary quantity is a sum over all zeros (Gonek Thm 3.1, trapezoid weight). The functional-equation '
 'term has modulus (t/2 pi)^(-d) at distance d from the line: for fixed d the device is the Hurwitz statement of Q19. Collisions: stage zeros leave the '
 'line only through double zeros, an event of the primes alone, invariant under torus rotation, with positive height-independent rate at fixed '
 'log X/log T (measured to T = 1e9, torus model to 1e20); the Rouche margin fails at a height-independent 0.1 to 1% of sampled points near the line and '
 'DH passes at comparable rates. | PROVED / CLASSICAL (refereed once, corrections E1-E7: the "any height" non-locality claim, the shifted form of Gonek '
 'Thm 5.1 and the approximate-functional-equation remark are ARGUED, not proved); collision law MEASURED (refereed once, two wording errors); one box at '
 'T = 1e6 certified in ball arithmetic, below verified height | U, TW-, EA, B (on-line theorem holds for each); DH (Rouche margin passes at comparable '
 'rates; a stage that can vanish is outside the theorem); HEAT, NR, THW, PA not run | `c4-fe-stage-rouche-crossing`; `c4-stage-collision-law` |',
 '| P45 | Fejer-weighted stage: positivity of the k = 0 term of the phase comb on every window | For the Fejer weight (1 - log n/log Y)_+, '
 'F_Y\'(t) = 2 log Y sum over zeros of Re kappa((rho - s) log Y) - 2 Re[Y^(1-s)/((1-s)^2 log Y)] + O(1/t), kappa(w) = (e^w - 1 - w)/w^2, s = 1/2 + it. '
 'On-line zeros contribute (1 - cos u)/u^2 >= 0. Positivity on every window is the Weil functional on the translated Fejer tests g * g~, '
 'g = e^(itx) 1_[0, log Y]: under RH F_Y\' >= -2 sqrt(Y)/(t^2 log Y) - O(1/t) for Y up to a power of t; without RH it is the target in one-sided form '
 '(rows P10, P1; eq48). The classical explicit formula with kernel Y^z/(z^2 log Y); a rewriting, not new (referee E6). | PROVED from the classical '
 'explicit formula (refereed once); checked to 1e-7 at low height and 6e-5 at T = 2.5e5; "without RH it is the target" rests on an ARGUED off-line '
 'estimate for one pair | target; DH (the identity holds with its own zeros and coefficients; no sign) | `c4-fe-stage-rouche-crossing` Lemma 1(c) |',
 '| P46 | Power-saving discrepancy of a completely multiplicative unimodular chi (sum_{n<=x} chi(n) = c x + O(x^theta), c != 0, theta < 1) as a source '
 'of a zero-free region for F = sum chi(n) n^-s (Helson follow-up) | Relative theorem: H = F F*/zeta^2 = exp(-2A) on Re s > 1, A a Dirichlet series '
 'with coefficients (1 - Re chi(p)^k)/k >= 0 on prime powers. With sigma_0 the largest real zero of F in (theta, 1) (theta if none), Landau\'s theorem '
 'gives convergence of A on Re s > sigma_0, hence ord_F(s) + ord_F(conj s) = 2 ord_zeta(s) there and sum_{p<=x} abs(1 - chi(p))^2 << x^(sigma_0+eps). '
 'A zero-free statement for F right of sigma_0 is the same statement for zeta: the implication is circular. If F has a real zero in (theta, 1) the '
 'abscissa of A equals sigma_0 exactly. The proof uses the Euler product with unimodular local parameters and never the additive spacing of the '
 'integers: it transfers to Beurling systems (F_B against zeta_B). Thin sign twists have a real zero at b with measured discrepancy exponent near b/2 '
 '(greedy sets, b = 0.5 to 0.9, x <= 1e8), so sigma_0 cannot be replaced by theta on the evidence. Second check and a complement '
 '(`c5-repair-engine-map-r4`, author only): for sum_{d<=y} abs((chi * mu)(d)) << y^beta, beta < 1, one has sum_{3<=p<=X^(2(1-beta)/5)} abs(1 - chi(p))^2 '
 '<= (4 pi^2/abs(c)^2)(5 sup_{x<=X} abs(E(x))^2 + O(1)); hence a real zero b in (theta, 1) satisfies b(1 - b) <= 10 theta, and a chi with '
 'E(x) << x^eps for every eps > 0 has no real zero in (0, 1) (r(0) = 0 for the exponent-zero class; zeros near 1 for small theta > 0 are not excluded). '
 '| Theorem 1 PROVED (author, one referee, and an independent second check: three passes); novelty not established: four generic searches and the text '
 'of Klurman-Mangerel-Pohoata-Teravainen (arXiv 1911.06265) contain no power-saving statement of this form; treated as a routine Landau argument. '
 'Complement PROVED (author), numerically checked, unrefereed. Thin-twist exponents MEASURED | B (passes every step); TW- / THIN (inside the class: '
 'they carry the real zeros); DH (no Euler product: A does not exist); Liouville and n^(-i alpha) (c = 0 or no pole: empty) | '
 '`c4-helson-discrepancy-zerofree`; `c5-repair-engine-map-r4` section 3 |',
 '| P47 | Bandwidth 1 < alpha < 2 in the Gabor / inertia chain (row P27) through averaged Hardy-Littlewood | F(alpha) <= C corresponds to '
 'abs((1/H) sum_{h<=H} (1 - h/H) E(h)) << X^(1/alpha) log X with H = X^(1-1/alpha): a power saving of exponent 1 - 1/alpha over the sieve bound. '
 'Proved in the literature: a saving of an arbitrary power of log X, for almost all shifts, for X^(8/33+eps) <= H <= X^(1-eps) '
 '(Matomaki-Radziwill-Tao, arXiv 1707.01315, abstract opened), i.e. alpha >= 33/25. Gap in the exponent: 1 - 1/alpha against 0; for 1 < alpha < 1.32 no '
 'averaged asymptotic is proved. Ramare\'s identity is not available for Lambda. The output would still be a proportion (P27 item 2). | derivation '
 'PROVED (refereed once); literature range opened at abstract level; zero-side reading ARGUED | DH (the method\'s conclusions hold for its coefficients: '
 'periodic mod 5 with zero sum, short-interval means are O(1/h)) | `c4-ramare-factorisation-pointwise` |',
 '| P48 | Ramare factorisation of Dirichlet polynomials (Matomaki-Radziwill short intervals; averaged Chowla / Elliott) as a pointwise or every-window '
 'input | Outputs are mean squares on Re s = 1 with savings of a power of log (Theorem 1 of arXiv 1501.04585: exceptional set of relative size '
 '(log h)^(-1/100) at tolerance (log h)^(-1/200)). The t-range is split into sets T_j where a prime polynomial is below e^(-alpha_j v/H_j), '
 'alpha_j = 1/4 - eta(1 + 1/(2j)) < 1/4, and a set U of large values. Large-value count (their Lemma 8, opened): for P(s) = sum_{P<=p<=2P} a_p p^-s, '
 'abs(a_p) <= 1, well-spaced t in [-T, T] with abs(P(1+it)) >= V^-1 number at most T^(2 log V/log P) V^2 exp(2 (log T/log P) log log T); at V = P^a '
 'this is T^(2a) P^(2a) up to the last factor. An isolated zero at sigma lies in the large-value set at threshold a = 1 - sigma at every scale '
 '(single-scale explicit formula, checked to 8e-7 for zeta); excluding it needs exponent <= 0, available 2(1 - sigma): gap 1 at sigma = 1/2, 1/4 at '
 'sigma = 7/8. The one sup bound in the method is Halasz with Vinogradov-Korobov (classical region). The conclusion class is closed under linear '
 'combination. | PROVED (count, single-scale formula; refereed once); Lemma 8, the sets T_j / U and Theorem 1 read from the ar5iv text; sharpness of '
 'the exponent 2a ARGUED; MEASURED checks | DH (passes by linearity), Liouville, TW+, U / WT, FM | `c4-ramare-factorisation-pointwise` |',
 '| P49 | Pretentious-distance and log-averaged statements as detectors of a zero with beta < 1 | D(1, n^(it); x)^2 = log log x - log abs(zeta(1 + '
 '1/log x + it)) + O(1) moves by O_beta(1) for a zero with beta < 1; zero terms have relative size x^(beta-1) (1/log x in log averages) against '
 'tolerances at least (log x)^-A; the hypotheses are invariant under finite modification up to 2 sum_{p in S} 1/p and under n^(ia) rotation: tail type '
 '(round-3 lesson 5). The averaged Chowla / Elliott theorems hold for H -> infinity with o(H^k X) (arXiv 1503.05121, abstract opened; the two-function '
 'Elliott form is not in the abstract and is not needed for the DH pass). | PROVED-rel classical formulas (refereed once) | FM, U / WT, Liouville | '
 '`c4-ramare-factorisation-pointwise` |',
]
i = find('| P43 |')
for k, r in enumerate(rows_P):
    lines.insert(i + 1 + k, r)
log.append('section 3.1: rows P44, P45, P46, P47, P48, P49')
after('| G25 |',
 '| G26 | Hecke operators compressed to the Lax-Phillips space K of the modular surface; Hecke norm bounds on resonance states | Scattering matrix '
 'xi(2s-1)/xi(2s), resonances at rho/2 (classical). On the Eisenstein channel T_p = U(log p) + U(-log p) = 2 cos(log p sqrt(-L)), L = Delta + 1/4: a '
 'function of the wave group, defined for every cofinite group and every abstract Lax-Phillips triple. Compression: P_K T_p P_K = Z(log p) + Z(log p)^*, '
 'energy norm at most 2 for every inner scattering function wherever the resonances are; resonance states are not its eigenvectors. Uncompressed T_p on a '
 'resonance state in L^2(y^(-2w) d mu): admissible iff w > 1/2 - Re(rho)/2, and the norm bound p^w + p^-w follows from admissibility for every rho; on '
 'finite spans a norm bound for all p is equivalent to resonance location; no positive-definite form makes T_2 and T_3 symmetric on a resonance state. '
 'Only Re rho <= 1 follows. All arithmetic is inside the scattering function. Not covered: norms outside the weighted-L^2 family. | PROVED (refereed '
 'once; wording of Lemma 3 corrected); decisive test MEASURED (mpmath, 80 digits: numerical range inside (-2, 2) for zeta\'s resonances and for three '
 'moved configurations, one with true Hecke eigenvalues up to 2.53) | every inner scattering function (non-arithmetic groups included): the compression '
 'bound holds for each | `c4-laxphillips-hecke-compression` |', 'section 3.2: row G26')

# 4. section 4 entries
i = find('47. Rigidity of J-contractive several-delay sections')
lines.insert(i + 1,
 '48. Zeros of F = sum chi(n) n^-s for completely multiplicative unimodular chi with sum_{n<=x} chi(n) = c x + O(x^theta), c != 0: right of the largest '
 'real zero sigma_0 of F in (theta, 1), ord_F(s) + ord_F(conj s) = 2 ord_zeta(s), and sum_p (1 - Re chi(p)) p^-sigma converges for sigma > sigma_0. '
 '`c4-helson-discrepancy-zerofree` Theorem 1 (author, one referee, second check in `c5-repair-engine-map-r4`; novelty not established; no bearing on '
 'zeros of zeta).')
lines.insert(i + 2,
 '49. Mean-square lower bound for the discrepancy through additive characters: with g = chi * mu and sum_{d<=y} abs(g(d)) <= C y^beta, beta < 1, '
 'sum_{n<=X} chi(n) e(-kn/p) = c X (chi(p) - 1)/(p - 1) + O(abs(E(X/p)) + p X^beta) for p not dividing k, and the large sieve gives '
 'sum_{3<=p<=X^(2(1-beta)/5)} abs(1 - chi(p))^2 <= (4 pi^2/abs(c)^2)(5 sup_{x<=X} abs(E(x))^2 + (C_1^2 + 1)/3). Corollary with entry 48: a real zero b of '
 'F in (theta, 1) has b(1 - b) <= 10 theta. `c5-repair-engine-map-r4` section 3, Theorem 2 (PROVED (author), checked numerically on three thin twists, '
 'unrefereed; no bearing on zeros of zeta).')
log.append('section 4: entries 48, 49')

# 5. section 5 paragraph (after the round-3 paragraph)
i = find('Round 3 (8 lanes, each refereed once):')
lines.insert(i + 1, '')
lines.insert(i + 2,
 'Round 4 (8 lanes, each refereed once): a power-saving discrepancy hypothesis on a completely multiplicative unimodular chi compares F with zeta and '
 'nothing else, and passes Beurling (P46); a stage with zeros on the line by construction carries no information in that property, and its comparison '
 'with zeta in Rouche form is zero-freeness of boxes (P44) while its Fejer prime-side form is the Weil functional (P45); the prime-only collision event '
 'is torus-invariant with positive rate (P44); Hecke operators on the continuous spectrum are functions of the wave group (G26); the '
 'Matomaki-Radziwill family proves statements whose conclusion class is closed under linear combination, with savings capped at powers of log '
 '(P47 to P49). Control THIN shows that complete multiplicativity, unimodular local parameters, continuation, the pole and density-one agreement with '
 'zeta at primes are consistent with a zero at any b in (1/2, 1): what the 7/8 mechanism uses beyond these is periodicity of the coefficients in the '
 'conductor aspect. All four device nodes named for crossing in round 4 are closed; the curated device list is `engine/curated/devices.json`.')
log.append('section 5: round-4 paragraph')

# 6. section 6: item 14 and new items
append_to('14. **Controls not run: run in round 1',
 'Round 5 (`c5-repair-engine-map-r4` section 4): the Ritz run of K[t] for the heat family has no object. Theta_{tau,omega} = F_tau(z - omega)/F_tau(z + omega) '
 'has poles of unbounded real part for every tau < 0 (escape law, `b-escape-law` Theorem A; non-cancellation measured on the 24 located poles at '
 'tau = -2, argued beyond), so it is analytic in no half-plane, Suzuki\'s causal kernel does not exist, and Lemma A of `sq-canonical-det` does not apply. '
 'With the kernel taken above the poles of height below Gamma only, norm(K_Gamma[T]) >= norm(R_Gamma[T]) - 1 with R_Gamma the finite-rank residue part '
 '(exact for the pole data): at tau = -2, omega = 0.1 the bound exceeds 1 from T = 2.43, 1.90, 1.63, 1.59, 1.40, 1.34 for Gamma = 70, 100, 130, 160, 190, 230. '
 'The first failure time depends on the truncation. Controls still not run in the stage lanes (P44, P45): HEAT, NR, PA, THW.',
 'section 6: item 14 (Ritz run outcome)')
i = find('20. **Window defect: commutator of the cutoff Q_c with Hecke operators**')
lines.insert(i + 1,
 '21. **Discrepancy hypothesis for all additively twisted sums, sum_{n<=x} chi(n) e(an/q) = c delta_q x + O(q^A x^theta), uniformly in q** '
 '(round-4 combination of P46 with control THIN; lane `c5-twisted-helson-arcs` running). For: it is the form not covered by the Landau argument of P46 or by '
 'Beurling, and periodicity in the conductor aspect is what the 7/8 mechanism uses. Against: for theta < 1/2 Parseval over the circle forces chi = 1 '
 '(identification, no inequality), and section 4 entry 49 shows that the residue classes mod p already force sum abs(1 - chi(p))^2 to be small in mean square.')
lines.insert(i + 2,
 '22. **Which half of the 7/8 mechanism fails for THIN (Proposition D of `c4-thin-twist-control-78`): the low estimate (row reflection) or the high '
 'comparison** (lane `c5-thin-propd-dichotomy` running). For: it decides where the periodicity input sits. Against: it is a statement about a control; '
 'it locates R3 for the 7/8 architecture and does not address the critical line. Also not covered from round 4: Hecke norms outside the weighted-L^2 '
 'family (G26); the non-locality step of P44 in its "any height" form.')
log.append('section 6: items 21, 22')

# 7. section 7 rows (appended after the header separator row of the table)
i = [k for k, l in enumerate(lines) if l.startswith('| Claim | Lane | Correction |')]
assert len(i) == 1
i = i[0] + 1
new7 = [
 '| Pre-check: thin twist has local form (s - b)^2 and partial sums c x + O(x^(b+eps)) with exponent about b | round-4 planner (ROUND_LOG) | The zero is '
 'simple for the floor-rule set and double for the greedy sign set; the measured discrepancy exponent is near b/2 (`c4-thin-twist-control-78`, '
 '`c4-helson-discrepancy-zerofree`) |',
 '| "The Rouche inequality on one box fails if there is a zero right of sigma_0 at any height"; "implied exactly by zero-freeness at sigma_0 - C log log t/log X" '
 '| c4-fe-stage-rouche-crossing | Supported only for zeros within a window of length a power of t smaller than t (pole term ignored); Gonek Thm 5.1 assumes RH '
 'globally and the shifted form is not derived (referee E2, E3) |',
 '| "Of the 13 closed-family patterns added, two reject candidates and the other eleven match none" | c4-repair-map-engine-r3 | Referee recount: 2 of 13 '
 'reject a candidate that no older family rejects; 8 of 13 match candidates. The generator totals stand |',
 '| "The heat family has the properties Lemma A needs, so it passes norm K[t] < 1 for small t and fails at a finite T*" (PROVED-rel) | c1-missing-controls '
 '(Part B, `sq-canonical-det` row) | For tau < 0 the quotient is analytic in no half-plane (escape law), so the causal kernel and K[t] are not defined and '
 'Lemma A does not apply; with a pole truncation the failure time depends on the truncation (`c5-repair-engine-map-r4` section 4). The statement '
 '"Theta_tau is not inner" stands |',
]
for k, r in enumerate(new7):
    lines.insert(i + 1 + k, r)
log.append('section 7: four rows')
open(P, 'w', encoding='utf-8').write('\n'.join(lines))
json.dump(log, open(os.path.join(HERE, 'map_edits.json'), 'w'), indent=1)
print(len(log), 'edit groups applied'); [print(' -', x) for x in log]
