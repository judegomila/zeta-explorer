# LIFT_RULING (c15-referee-r14-independent-checkpoint, 2026-11-19)

Independent referee ruling on the lifts of the nine control classes to pairs (G, G twisted by chi) defined in
`push/c14-joint-zeta-twist-noncone-search/PREREG.md` section 4, and on the FE tier. Written before reading that
lane's REFEREE.md. For the compute lane `c15-nonhomogeneous-pair-triple-kernel-search`. Nothing here is a statement
about zeros of zeta.

## 1. Ruling per lift

"Canonical" = forced by one rule that also sends (zeta) to (zeta, chi) and that no free choice of this lane enters:
the twist is the map n^(-s) -> chi(n) n^(-s) on an (extended) Dirichlet series, in the FE-centred variable u.

| class | lift used | ruling | reason | in FE tier |
|---|---|---|---|---|
| T-NR | conj(chi(p0)) K_chi(u-l) + c K_chi(u) + chi(p0) K_chi(u+l) | CANONICAL, with scope line | the factor p0^(s-1/2) + c + p0^(1/2-s) is a Dirichlet polynomial on the frequencies p0^(+-1); chi extends uniquely to fractions prime to q; needs gcd(p0, q) = 1 (kept by the lane). Scope: the FE-centred form is used; the ordinary-series form p0^(-s) times it differs by the translation u -> u + l and a unimodular constant, and the window is not translation invariant | yes (PROVED, re-derived) |
| E_a | kernel of Lambda(s+a, chi) Lambda(s-a, chi) | CANONICAL | sum chi(n) n^a sigma_(-2a)(n) n^(-s) = L(s-a, chi) L(s+a, chi) because chi is completely multiplicative; gamma factor fixed by the parity of chi | yes (CLASSICAL) |
| HEAT | e^(tau u^2/4) K_chi(u), same tau on both members | CANONICAL | the multiplier acts on u, the twist on the frequency index n; they commute. The only choice is "same tau on both members"; it is the one for which the pair is the image of (zeta, chi) under one map | yes (PROVED) |
| DH | coefficientwise twist a_DH(n) psi(n) | CANONICAL as a twist, NOT the FE-respecting control | the twist of c1 L(chi5) + c2 L(conj chi5) is c1 L(chi5 psi) + c2 L(conj(chi5) psi); the constants c1, c2 are tuned to the functional equation of the untwisted sum, so the reflection symmetry K(-u) = eps conj K(u) is kept exactly when the ratio of the two root numbers is unchanged by the twist, that is when chi_G^2(q_psi) = 1 (for the battery member: q_psi = +-1 mod 5), for real or complex psi (corrected 2026-11-19 after reading `fe_table_full.json`: the 5 of 28 members with residual below 1e-8 include two complex psi; an earlier version of this row said "psi real", which was wrong). A second, inequivalent lift exists: the DH-type combination retuned for the pair (chi5 psi, conj(chi5 psi)); it keeps a functional equation but is not the twist of G | no (5 members would qualify) |
| BLS | P_b(D) K_chi with the same b on both members | LANE-DEFINED, not canonical | not a Dirichlet series; nothing ties the added zeros of the twisted member to those of G (any b' gives a lift); polynomial form only, quotient form NOT-RUN | yes (PROVED for the form used) |
| theta^w | chi(m) on the index m of e^(-pi m y) | LANE-DEFINED, not canonical, and it does not restrict to the positive pair | at w = 1 the member is the kernel of L(chi^2), not of L(chi): the lift interpolates (zeta, chi^2) at scale q. For real chi the w = 1 member is an imprimitive zeta. A rejection of this class can read "B is of chi^2 type" and not w != 1 | no |
| U | general rule, N_G = 1, d_G = 0 | CANONICAL as an operation on coefficients; the profile (parity d, scale N_G q) is a convention because there is no functional equation to fix it | no |
| THIN | general rule | as U | no |
| BEU | chi_B(p_n + delta) = chi(p_n), completely multiplicative | LANE-DEFINED, not canonical | a Beurling system has no residue classes; chi_B is a transported unimodular completely multiplicative function. In addition the class is NOT an off-line control: sum_p ((p+delta)^(-s) - p^(-s)) converges absolutely for Re s > 0, so the Beurling zeta has exactly zeta's zeros there and the twisted member exactly those of L(s, chi) | no |

## 2. Does the outcome "none" depend on the lifts?

The registered criterion is monotone: removing a control class, or replacing its lift by one that is easier to
reject, can only create survivors. So "none" depends on a lift only if dropping the class creates survivors.

Referee recount on the mirrored grid sign matrices (`lift_loo.py`, `lift_loo.json`; 1,487,558 functionals; my
counts reproduce the lane's: 94,531 one-signed on PA, 440,516 on PZ, PZ T-train 3, FE tier PA T-train 0):

| control set | PA: T-train | PA: full | PZ: T-train | PZ: full |
|---|---|---|---|---|
| all nine | 0 | 0 | 3 | 0 |
| nine minus any one class | 0 (each of the nine) | 0 | 3 to 1,121 (largest: minus HEAT) | 0 |
| FE tier {T-NR, E_a, HEAT, BLS} | 0 | 0 | 35 | 0 |
| FE tier minus E_a / minus HEAT | 4 / 99 | 0 / 0 | 698 / 11,929 | 0 / 0 |
| canonical lifts only {T-NR, E_a, HEAT} | 0 | 0 | 40 | 0 |
| no controls (ceiling) | 94,531 | 55,422 | 440,516 | 97,370 |

Ruling:
1. **Registered outcome (full criterion, positives PA): does not depend on any non-canonical lift.** On the grid it
   already holds with the three canonical lifts alone, and with any one of the nine classes dropped. On the draws
   and the adaptive stage (not mirrored; the lane's own summaries) full = 0 in the FE tier, which contains only one
   non-canonical lift (BLS); whether full = 0 there with BLS also dropped is NOT-RUN by me (grid: yes).
2. **T-train = 0 with PA depends on the non-FE lifts on the draws**: the lane reports 59 functionals (JB2 with polar
   terms) at T-train in the FE tier, 58 of them blocked by THIN alone. That block is the blindness of the Hermitian
   completion (read at u >= 0 only) to coefficients at primes >= 5, so it holds for any coefficientwise lift of
   THIN; it is a property of the dictionary and not of zeta. The sentence "no functional reaches T-train" must
   carry "in the nine-class reading".
3. **The full-criterion "none" rests on the held-out rule in the FE tier**: the 59 rows fail by 18 to 22 held-out
   positives of 24 (23 needed). That failure involves no control lift at all.
4. HEAT (canonical) is the binding class everywhere. Lemma J1 (i) needs the same tau on both members (with
   tau_A != tau_B the two terms of JC2 get factors e^(tau_A h^2/2) and e^(tau_B h^2/2) and the identity becomes a
   rescaling of lam, as in J1 (ii)).

## 3. The FE tier

Holds as an exclusion rule with two scope lines:
- Read per class it contains no Dirichlet series without an Euler product: DH is outside it, although 5 of its 28
  members (chi_G^2(q_psi) = 1) keep the functional equation under the coefficientwise lift. A device whose inequality uses the functional equations of both members
  must also be run against the retuned DH lift (section 1); that lift was not built. This cannot change "none"
  (adding a control only removes survivors). It would matter for any future "survivor".
- BEU is not an off-line control (section 1); requiring its rejection in the nine-class reading asks for more than
  R3 does. It is outside the FE tier, so the FE-tier counts are not affected.

## 4. For the non-homogeneous pair / triple search (requests)

1. Report every tier three ways: nine classes; FE tier; canonical lifts only {T-NR, E_a, HEAT}. A survivor counts
   only if it survives the canonical-only reading and the held-out rule.
2. Put DH into the FE tier per member: the coefficientwise twists with chi_G^2(q_psi) = 1 keep the functional
   equation (for the battery member all psi of conductor +-1 mod 5: 4, 11, 19, 29, 31, ...), so a DH class that
   is both canonical and FE-respecting exists; build its training and held-out members from those conductors only.
   Read the FE tier per member, not per class (read per class, the lane's 59 FE-tier rows appear; the lane's own
   pass reports 0 when the DH member chi4.3 is counted).
3. Drop BEU from requirement (b) or report it separately: its zeros in Re s > 0 are those of the positive.
4. theta^w: either use a lift that restricts to (zeta, chi) at w = 1, or compare against the positives
   (zeta, chi^2) at the matching scale; state which.
5. HEAT: for a quotient or logarithm functional (not homogeneous in each kernel) Lemma J1 does not apply, but the
   same-tau HEAT pair still tends to the positive pair as tau -> 0; keep members at abs(tau) <= 0.02 in training.
6. For triples (F, F x chi, F x chi^2): the T-NR lift is multiplicative in chi (chi(p0) -> chi(p0)^2), E_a and HEAT
   likewise; BLS, theta^w and BEU have no group law, so a functional that uses the group law of the twists rejects
   them for a reason that is not about zeros. Report them outside the decisive tier.

## 5. Paper pre-filter for the non-homogeneous search (referee Lemma J1', PROVED, elementary; one referee: none)

Let the HEAT lift be the registered one (same tau on every member, kernels without polar terms: member = g K,
g(u) = e^(tau u^2/4)). Let Phi be any function of the values {K_A(u_i), K_B(u_i) (, K_C(u_i))} at finitely many
points that is unchanged when all members are multiplied at the point u_i by one common factor c_i > 0, for every
choice of the c_i. Then Phi(HEAT pair) = Phi(positive pair of the same character), for every tau.
Proof: the HEAT pair is the positive pair multiplied at u_i by c_i = g(u_i). QED

Instances (each therefore closed on paper by HEAT before any search; `ref2_checks_b.json`: relative change at most
6.3e-16 at two truncations, against 0.43 to 0.48 for the non-instance K_B(u)/K_A(v), u != v):
- any function of the pointwise quotients K_B(u_i)/K_A(u_i), or of log K_B(u_i) - log K_A(u_i);
- cross-ratios K_A(u) K_B(v) / (K_A(v) K_B(u));
- the group-law expression of a triple at one point, K_chi(u)^2 / (K(u) K_(chi^2)(u)), and any function of such.

Weaker form (covers J1 of the lane): if Phi is only covariant, Phi(gK) = (positive factor) Phi(K) for Gaussian g,
its sign is HEAT-blind; if the factor depends on a parameter (lam in JC1), HEAT acts as a reparametrisation.
Not instances: one kernel alone inside a logarithm; quotients at two different points; kernels with polar terms
(the heat kernel with polar terms is not g times Kpol); a lift with different tau on the members.
Request: the search should exclude these instances from its dictionary or report them as closed by this lemma, and
should put at least one HEAT pair with unequal tau on the two members in a separate, labelled class (non-canonical).
