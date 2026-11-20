# c8-hecke-entropy-resonance-rigidity: joint Hecke recurrence and measure rigidity on Eisenstein resonance states

Date: 2026-11-18. Kind: explore. Nothing here proves or refutes RH. No zero-free region and no
Lambda bound changes. No statement about zeros of zeta is made.
Labels: PROVED (argument written here), CLASSICAL (literature, recalled, not opened in this lane),
ARGUED (reasoning given, not a proof), MEASURED (mpmath 30 digits, not interval-certified), OPEN.
One local run (`check.py`, 9 s, through `scripts/memcap.sh 8`). The server was not used.

## Verdict

**Precise obstruction. The gate is passed formally (a named step fails for U, for THIN and for the
DH-type combination), the first lemma is decided, and the decisive test kills the device: the
recurrence bound has the same exponent for every Re w in (1/2, 1), and every hypothesis the device
reads holds for the off-resonance Eisenstein series E(z, w') at every w'. One pivot (reading
phi(w) = 0 through closed-horocycle periods) lands on Zagier's criterion and on row G26.**

1. Gate. The device reads the joint action of all Hecke correspondences on one Gamma-invariant
   function. For U and THIN the corresponding function exists on the cylinder Gamma_inf\H and is a
   joint eigenfunction there, but it is not Gamma-invariant (Lemma G1, PROVED): the step "fold the
   Hecke images into Gamma\H" fails. For the DH-type combination on Gamma_1(5) the function is
   Gamma_1(5)-invariant but not a T_p-eigenfunction for p = 2, 3 mod 5 (Lemma G2): the step
   "tau(p) f(z) = sum over Hecke points" fails.
2. First lemma (section 3). The truncated mass of a resonance state is exactly
   `Y^(2 sigma - 1)/(2 sigma - 1)`, with no dependence on gamma (Lemma 2). The recurrence
   (amplifier) inequality bounds the mass of a ball by
   `2 m (2 sigma/(2 sigma - 1)) ht^(2 sigma - 1) (log P)/P`: uniform in gamma, exponent of P equal
   to -1 for every sigma in (1/2, 1). The Hecke gain `sum |tau_w(p)|^2 ~ P^(2 sigma)/(2 sigma log P)`
   and the cusp mass `P^(2 sigma - 1)` carry the same power of P^(2 sigma - 1); it cancels. The
   bound does not contradict the growth y^(1 - beta/2) for any beta.
3. Control found inside zeta's own surface (EIS-w, Proposition 4, PROVED): E(z, w') for arbitrary
   w' with Re w' in (1/2, 1) is Gamma-invariant, a joint eigenfunction of Delta and all T_p, of
   moderate growth, with truncated mass `Y^(2 sigma' - 1)/(2 sigma' - 1)` plus two explicit
   correction terms. Any conclusion "Re w = 3/4" drawn from invariance, the joint eigen-relation,
   growth and truncated mass would be false. The only datum that separates a resonance is
   phi(w) = 0, which enters the device through those two correction terms only.
4. Entropy (section 5). A Laplace eigenfunction with non-real eigenvalue w(1 - w) does not give an
   A-invariant microlocal limit; the candidate limit is the infinite measure
   `m_sigma = int nu_y y^(2 sigma - 2) dy` (nu_y = closed horocycle of height y), which is
   N-invariant, A-conformal of exponent 2 sigma - 1 and a joint Hecke eigen-measure for every
   sigma > 1/2 (PROVED for m_sigma; that it is the limit is ARGUED and MEASURED only). The
   hypotheses of the rigidity theorem (A-invariant probability measure, entropy) fail at every
   sigma != 1/2, the RH location sigma = 3/4 included. No sign is produced.
5. Answer to row G26's question. Recurrence sees one thing that a function of the wave group does
   not: T_p is a finite correspondence with p + 1 isometric branches whose images of a small ball
   overlap with bounded multiplicity. This is absent for non-arithmetic groups and for U. Its
   output (item 2) is blind to sigma.

## 0. Plan and gate (written before the work of sections 3 to 6)

Object. Gamma = PSL_2(Z), `xi(s) = pi^(-s/2) Gamma(s/2) zeta(s)`, `phi(w) = xi(2w - 1)/xi(2w)`,

    E(z, w) = y^w + phi(w) y^(1-w) + (2 sqrt(y)/xi(2w)) sum_{n != 0} tau_w(|n|) K_{w-1/2}(2 pi |n| y) e(nx),
    tau_w(n) = sum_{ad = n} (a/d)^(w - 1/2),      T_n f(z) = n^(-1/2) sum_{ad = n, b mod d} f((az + b)/d),

`T_n E(., w) = tau_w(n) E(., w)` (CLASSICAL). The assignment's state "residue of E(z, s) at
s = rho/2" equals, by E(z, s) = phi(s) E(z, 1 - s), a multiple of E(z, w) at `w = 1 - rho/2`, where
phi(w) = 0. Write w = sigma + it: sigma = 1 - beta/2, t = -gamma/2. Under RH every resonance has
sigma = 3/4 (not 1/2). The constant term of a resonance state is y^w alone: growth y^(1 - beta/2).

What the device reads. One function f on Gamma\H with (a) Gamma-invariance, (b) the eigen-relation
`tau(p) f(z) = p^(-1/2) sum_{j=0..p} f(z_j)` over the p + 1 Hecke points, for all p together,
(c) the Laplace eigen-equation, (d) moderate growth and the truncated mass. R1 is a hypothesis
((b) for all p on one function). R2 would hold if the bounds are uniform in gamma (decided in
section 3: they are). R4: the continuation of E(z, s) to Re s < 1/2 is exact; a sign would have to
come from entropy (decided in section 5: none).

Class control (U, THIN): Lemma G1. DH-type control: Lemma G2. Both fail at a named step, so the
gate condition "a step fails for U or THIN" is met and the lane continued. Section 4 then shows
that the gate was too weak: a control that keeps (a) to (d) exists.

Filter read: map rows G26, G12, G24, P39, section 2 (controls); `c4-laxphillips-hecke-compression`
RESULT.md; STRATEGY sections 1 and 3.1 (family 9). `engine/curated/devices.json` has
`recurrence-ergodicity` (row P39, zeros forcing zeros) and `hecke-compression-lax-phillips`; neither
is the correspondence-recurrence device of this lane.

## 1. Gate lemmas

**Lemma G1 (U and THIN; PROVED).** Let eps be completely multiplicative, |eps(p)| = 1,
eps(p0) != 1 for some prime p0, and put
`tau^eps_w(n) = sum_{ad = n} eps(a) conj(eps(d)) (a/d)^(w - 1/2)`,
`f_eps(z) = sqrt(y) sum_{n != 0} tau^eps_w(|n|) K_{w-1/2}(2 pi |n| y) e(nx)`.
(i) f_eps is 1-periodic, satisfies `Delta f = w(1 - w) f`, and `T_p f_eps = tau^eps_w(p) f_eps`
for the operators T_p above acting on 1-periodic functions (the action on Fourier coefficients is
`a(n) -> a(pn) + a(n/p)` after normalisation; it needs only the multiplicativity of tau^eps).
(ii) A constant term a y^w + b y^(1-w) has T_p-eigenvalue `p^(w-1/2) + p^(1/2-w)` (Lemma 1), which
differs from tau^eps_w(p0) when Re w != 1/2: with u = w - 1/2 the difference is
`(eps(p0) - 1)(p0^u - conj(eps(p0)) p0^(-u))`, and |p0^(2u)| != 1. So the constant term of any
joint eigenfunction with these eigenvalues and Laplace eigenvalue w(1 - w) is 0, as in f_eps.
(iii) If Re w != 1/2 and Im w != 0, f_eps is not Gamma-invariant. Proof: f_eps decays exponentially
as y -> infinity; if it were Gamma-invariant it would lie in L^2(Gamma\H) and be an eigenfunction of
the self-adjoint Laplacian with the non-real eigenvalue w(1 - w), Im = t(1 - 2 sigma) != 0;
contradiction (f_eps != 0 since tau^eps_w(1) = 1).
Named failing step: (a), used in Lemma 2 (Maass-Selberg), in Lemma 3 (the Hecke images of a ball
are folded into the truncated fundamental domain) and in section 5 (the measure lives on a
finite-volume quotient). On the cylinder Gamma_inf\H the images (z + b)/p descend towards y = 0
and do not return. This is the functional equation in geometric form (Maass converse theorem,
CLASSICAL). THIN is the case eps(p) = -1 on the thin set S; U is the general case. For neither is
there a scattering coefficient, so a zero of F = sum eps(n) n^(-s) is not attached to any state.

**Lemma G2 (DH-type combination on Gamma_1(5); (i) PROVED, (ii) CLASSICAL recalled).** Let chi be a
complex character mod 5 and `G_chi(z, w) = sum_{(c,d) = 1, 5 | c} chi(d) y^w/|cz + d|^(2w)`
(continued in w), of nebentypus conj(chi) on Gamma_0(5), with T_p-eigenvalue
`chi(p) p^(w-1/2) + p^(1/2-w)` for p != 5. (i) `D = a G_chi + b G_conj(chi)`, ab != 0, is
Gamma_1(5)-invariant and a Laplace eigenfunction, and
`T_p D - (chi(p) p^(w-1/2) + p^(1/2-w)) D = b (conj(chi)(p) - chi(p)) p^(w-1/2) G_conj(chi)`,
non-zero for p = 2, 3 mod 5. So D is not a T_p-eigenfunction. Named failing step: (b), the first
line of Lemma 3. (ii) The resonances of Gamma_1(5) are at zeros of zeta and of Dirichlet
L-functions mod 5 taken one at a time (scattering determinant of congruence groups, Huxley 1984);
a zero of the Davenport-Heilbronn combination is the vanishing of one linear functional of the
constant terms of D, not a resonance, and D has no pure-power state there.

## 2. Two exact formulas

**Lemma 1 (PROVED; checked to 3e-31, `check.json` key A).** For every w and n,
`T_n y^w = tau_w(n) y^w`. Proof: the points with given (a, d) have height ay/d and there are d of
them, so `T_n y^w = n^(-1/2) sum_{ad = n} d (a/d)^w y^w = sum_{ad=n} (a/d)^(w-1/2) y^w`. The single
point nz (a = n, d = 1) contributes `n^(w-1/2) y^w`, and `|tau_w(p)| = p^(sigma-1/2)(1 + O(p^(1-2 sigma)))`
for sigma > 1/2. The size of the Hecke eigenvalue and the growth exponent in the cusp are the same
number: the non-tempered eigenvalue is produced by the one Hecke point that goes up the cusp.

**Lemma 2 (Maass-Selberg, CLASSICAL; the substitution is PROVED).** For Y >= 1, sigma > 1/2, t != 0,
with Lambda^Y the truncation (subtract the constant term above height Y),

    ||Lambda^Y E(., w)||^2 = (Y^(2 sigma - 1) - |phi(w)|^2 Y^(1 - 2 sigma))/(2 sigma - 1) + Im(conj(phi(w)) Y^(2it))/t.

At a resonance, `||Lambda^Y E(., w)||^2 = Y^(2 sigma - 1)/(2 sigma - 1)` exactly, for every
Y >= 1 and every gamma. Positivity of the left side bounds |phi(w)|; it does not exclude
phi(w) = 0 at any sigma in (1/2, 1) (same conclusion as row G26: only Re rho <= 1).

## 3. First lemma: the recurrence bound, its uniformity, and the cusp

**Lemma 3 (recurrence inequality; PROVED given the multiplicity m).** Let f = E(., w), sigma > 1/2,
B = B(z0, r) a hyperbolic ball, ht(z0) = max over Gamma of Im(g z0), and Pr a set of primes in
[2, P]. Let m be the largest number of pairs (p, j), p in Pr, 0 <= j <= p, whose images of B in
Gamma\H contain a common point. Then

    (sum_{p in Pr} |tau_w(p)|^2) int_B |f|^2 dmu  <=  2 m ||Lambda^Y f||^2,     Y = P e^r ht(z0).

Proof. For z in B, `tau_w(p) f(z) = p^(-1/2) sum_j f(g_{p,j} z)` with g_{p,j} in GL_2^+(Q) of
determinant p. Cauchy-Schwarz: `|tau_w(p)|^2 |f(z)|^2 <= ((p+1)/p) sum_j |f(g_{p,j} z)|^2`.
Each g_{p,j} is an isometry of H; integrate over B and use (a) to read the right side on Gamma\H.
For an integral matrix M of determinant p and g in Gamma, `Im(g M z) = p y/|cz + d|^2` with (c, d)
a non-zero integer row, and `min |cz + d|^2 = y/ht(z)`; so every image lies below height
p ht(z) <= Y, where |f| = |Lambda^Y f|. Sum over p. QED.

Consequence at a resonance (Lemma 2, and `sum_{p <= P} |tau_w(p)|^2 = (1 + o(1)) P^(2 sigma)/(2 sigma log P)`):

    int_B |f|^2 dmu  <=  2 m (2 sigma/(2 sigma - 1)) (e^r ht(z0))^(2 sigma - 1) (log P)/P (1 + o(1)).

Answers to the two questions of the assignment.

- Uniform in gamma: yes. At a resonance the right side has no gamma. Off resonance the two extra
  terms of Lemma 2 are bounded (|phi| is bounded in sigma >= 1/2 + delta, |t| >= 1), so the same
  bound holds with a constant.
- Contradiction with y^(1 - beta/2): none, for any beta. The exponent of P on the right is -1 for
  every sigma in (1/2, 1). MEASURED (`check.json` key C): the ratio of
  `sum_{p<=P} |tau_w(p)|^2 / (P^(2 sigma - 1)/(2 sigma - 1))` to `P/log P` is 0.11, 0.25, 0.35,
  0.43, 0.50 at sigma = 0.55, 0.65, 0.75, 0.85, 0.95 (P = 1e5), against (2 sigma - 1)/(2 sigma) =
  0.09, 0.23, 0.33, 0.41, 0.47: sigma moves a constant, not the exponent.
- Overlap count against the cusp mass (the decisive test). With m = O(P^eps) for z0 in a fixed
  compact set and P <= r^(-c0) (Bourgain-Lindenstrauss counting; CLASSICAL, recalled for the
  compact part, not opened and not re-proved here), the bound reads
  `int_{B(z0, r)} |f|^2 << r^(c0 - eps)`, for every sigma alike. The expected size of the left side
  is `r^2 E(z0, 2 sigma)` (section 5), far below the bound. For a ball high in the cusp
  (ht(z0) = y0 large) the left side is about `pi r^2 y0^(2 sigma)`; for p < y0 all images stay in
  the cusp, where f = y^w up to exponentially small terms and the inequality is Lemma 1 (an
  identity for the constant term) followed by Cauchy-Schwarz; the p points (z0 + b)/p lie on one
  horocycle at hyperbolic spacing 1/y0, so m >= min(p, 2 r y0) there. No choice of ball gives a
  contradiction, and Proposition 4 shows none can.

## 4. The control inside zeta's own surface

**Proposition 4 (control EIS-w; PROVED from Lemmas 1 to 3 and the classical properties of E).**
For every w' = sigma' + it' with sigma' in (1/2, 1), t' != 0, the function E(., w') satisfies (a)
Gamma-invariance, (b) the joint eigen-relation with tau_{w'}(p) for all p, (c) the Laplace
equation, (d) moderate growth y^(sigma') and the truncated mass of Lemma 2, and Lemma 3 holds for it
with the same proof. Hence: no argument whose inputs are (a) to (d) and the counting of Hecke
points can exclude a joint eigenfunction of growth exponent sigma' != 3/4; such functions exist for
every sigma'. A resonance differs from its off-resonance neighbours at the same sigma only by
phi(w) = 0, and inside the device this changes the truncated mass by
`-|phi|^2 Y^(1 - 2 sigma)/(2 sigma - 1) + Im(conj(phi) Y^(2it))/t`, a bounded quantity against the
main term Y^(2 sigma - 1).

Reading. This control keeps the functional equation, the Euler product, the group and the Hecke
algebra; it is not one of the nine controls of the brief. It shows that the gate of section 0
("a step fails for U and THIN") is necessary and not sufficient for a device on the modular
surface: the device must read phi(w) = 0, not the existence of a joint eigenfunction.

## 5. Entropy and rigidity

**Lemma 5 (PROVED).** Let nu_y be the probability measure on the closed horocycle of height y.
As measures on Gamma\H (and, with the upward normal, on Gamma\G),
`T_p nu_y = p^(-1/2) (nu_{py} + p nu_{y/p})`. For sigma > 1/2 put
`m_sigma = int_0^inf nu_y y^(2 sigma - 2) dy`; its projection to Gamma\H is E(z, 2 sigma) dmu
(unfolding). Then m_sigma is a Radon measure, N-invariant, `(a_s)_* m_sigma = e^((2 sigma - 1) s) m_sigma`
under y -> e^s y, and `T_p m_sigma = (p^(2 sigma - 1/2) + p^(1/2 - 2 sigma)) m_sigma = tau_{2 sigma}(p) m_sigma`.
Proof: the points pz cover the horocycle of height py and the points (z + b)/p cover the horocycle
of height y/p, p of them per point; substitute in the integral over y.

**Statement 6 (ARGUED and MEASURED, not proved).** For fixed sigma in (1/2, 1) and |t| -> infinity
the measures |E(z, sigma + it)|^2 dmu converge on compactly supported tests to E(z, 2 sigma) dmu,
at resonances and off resonances alike. Support: (i) exact identity (PROVED by unfolding): for psi
in C_c(0, inf), `int |E(z,w)|^2 E(z|psi) dmu = int psi(y) I_w(y) dy/y^2`,
`I_w(y) = |y^w + phi y^(1-w)|^2 + (8y/|xi(2w)|^2) sum_{n>=1} |tau_w(n)|^2 |K_{w-1/2}(2 pi n y)|^2`,
and `sum |tau_w(n)|^2 n^(-s) = zeta(s + 2 sigma - 1) zeta(s + 2it) zeta(s - 2it) zeta(s - 2 sigma + 1)/zeta(2s)`,
whose pole at s = 2 sigma gives E(z, 2 sigma); the poles at s = 1 +- 2it and s = 2 - 2 sigma carry
the factors phi, conj(phi), |phi|^2 and vanish at a resonance. (ii) The remainder (Eisenstein
integral on Re s = 1/2 and cusp-form triple products) was not bounded here; in the unitary case
this is the Luo-Sarnak theorem. (iii) MEASURED (`check.json` key B): the ratio of
`sum_y I_w(y)/y^2` to `sum_y (y^(2 sigma) + phi(2 sigma) y^(1 - 2 sigma))/y^2` over y = 1, 1.05, ..., 2 is
1.162, 1.062, 0.979 at the resonances of the zeros number 1, 30, 127 (sigma = 3/4) and 1.026,
0.927, 0.954 at the non-resonant points 0.75 - 60.3i, 0.65 - 141.1i, 0.85 - 141.1i. The range of t is
small and the ratios do not separate the two classes; this is consistency, not a rate.

**Consequence for the device.** Lindenstrauss' theorem needs an A-invariant probability measure
with Hecke recurrence; positive entropy of its components is the Bourgain-Lindenstrauss input.
(1) A-invariance of a microlocal limit comes from `<[Delta, Op(a)] u, u> = (conj(lambda) - lambda) <Op(a) u, u>`
with lambda real; here `lambda - conj(lambda) = 2i t (1 - 2 sigma)`, of the same order in t as the
flow term, so the limit is A-conformal with exponent 2 sigma - 1 (ARGUED; consistent with Lemma 5).
(2) The limit has infinite mass, all of it in the cusp after normalisation (Lemma 2: the mass
below height Y is Y^(2 sigma - 1)/(2 sigma - 1)). (3) The family {m_sigma : sigma > 1/2} is a
continuum of N-invariant, A-conformal joint Hecke eigen-measures; a classification of such measures
contains all of them and fixes no sigma. Entropy is not defined for them; the invariant that
replaces it is the conformal exponent 2 sigma - 1, which is the datum Re w itself. The device
returns its input.

What recurrence sees that a function of the wave group does not (row G26): the correspondence
structure used in Lemma 3 (p + 1 isometric branches, multiplicity m). On the objects that carry the
resonances it acts as `T_p nu_y = p^(-1/2)(nu_{py} + p nu_{y/p})` (Lemma 5), a polynomial in the
dilation y -> p y, which is the form `U(log p) + U(-log p)` of row G26.

## 6. Pivot (one): read phi(w) = 0 through closed-horocycle periods

A Gamma-invariant joint eigenfunction f of moderate growth with the eigenvalues of E(., w),
Re w in (1/2, 1), is a multiple of E(., w) (PROVED: the Hecke relations fix the non-constant
Fourier coefficients up to one scalar c, so f - c' E(., w) is a Gamma-invariant function
a y^w + b y^(1-w), which is 0). So "f is a resonance state" is the statement `int_0^1 f(x + iy) dx = c y^w`
for all y > 0: the period over nu_y is a pure power, down to y -> 0.
Dual form: for g smooth and compactly supported on Gamma\H,
`nu_y(g) = mean(g) + sum over rho of c_rho(g) y^(1 - rho/2) + ...` as y -> 0, and
`nu_y(g) = mean(g) + O(y^(3/4 - eps))` for all g iff RH (Zagier 1981; CLASSICAL, recalled). The
resonance states are the dual basis of the exponents in this expansion. The Hecke action on the
family nu_y is Lemma 5: a function of the dilation. An entropy or recurrence statement about the
low horocycles is therefore a statement about the dilation group on the Eisenstein channel, which
is row G26, and the rate statement is Zagier's equivalent form with no inequality attached. The
obstruction map has no row for the horocycle criterion (text search "Zagier", "horocycle": no
hits); one is proposed below. The pivot ends here; no further pivot.

## 7. Controls

| control | outcome | step |
|---|---|---|
| U (unimodular twist) | fails | (a): f_eps is not Gamma-invariant (Lemma G1 iii); no folding, no Maass-Selberg, no scattering coefficient |
| THIN | fails | same step; eps(p) = -1 on S; no state attached to the zero at b |
| sign-twisted primes / Liouville twist | fails | same step (Lemma G1 with eps real) |
| window translate WT | **passes** | eps(n) = n^(-i alpha) gives tau^eps_w = tau_{w - i alpha}; with the matching Laplace eigenvalue the object is E(., w - i alpha), a case of EIS-w (a height translate of zeta's own family). Lemma G1 applies only to the mismatched pair (Bessel order w - 1/2 with coefficients tau_{w - i alpha}) |
| DH-type combination on Gamma_1(5) | fails | (b): not a T_p-eigenfunction for p = 2, 3 mod 5 (Lemma G2) |
| zeta(s+a) zeta(s-a), T-NR, Beurling, backward heat, phase-rotated transfer operator, theta^w | not run | no object on the modular surface was constructed for them |
| non-arithmetic cofinite group | fails | (b): no finite correspondence (the wave-group function of row G26 exists, the multiplicity count does not) |
| **EIS-w: E(., w') off resonance, any Re w' in (1/2, 1)** | **passes every step** | Proposition 4; Lemma 5 for the limit measures |

## 8. The four requirements

- R1 (multiplicativity essential): **not established as a result.** The device takes the joint
  Hecke relation as hypothesis and Lemma 3 uses it (it fails for the Gamma_1(5) combination and for
  non-arithmetic groups), but the output of Lemma 3 is the same for every sigma and no statement
  about zeros follows. Flag false.
- R2 (height-uniform, every window): the bound of Lemma 3 is uniform in gamma (Lemma 2 is exact
  and gamma-free at a resonance). This is uniformity of a bound that does not locate anything.
  Flag false.
- R3 (every control fails structurally): **no.** U, THIN, sign twists and the DH-type combination
  fail at named steps; EIS-w and the window translate WT (a case of EIS-w) pass all steps; five
  listed controls were not run. Flag false.
- R4 (reaches the line): the continuation is exact, and the sign expected from entropy does not
  exist: the limit measures are conformal, not invariant, at every sigma != 1/2. Flag false.

Score 0 of 4.

## 9. Three weakest steps

1. Statement 6 (the limit of |E(z, sigma + it)|^2 dmu is E(z, 2 sigma) dmu) is ARGUED: the
   continuous-spectrum and cusp-form remainders were not bounded, and the measurement covers
   |t| <= 141 with ratios between 0.93 and 1.16. Section 5's conclusion needs only Lemma 5 (the
   family m_sigma exists for all sigma) and item (1) of the consequence, which is itself ARGUED
   (symbol calculus with a non-real eigenvalue was not written out).
2. The multiplicity count m = O(P^eps) for P <= r^(-c0) is recalled from Bourgain-Lindenstrauss
   (stated there for compact arithmetic surfaces and for the compact part of the modular surface);
   it was not opened, the exponent c0 was not fixed, and the cusp estimate m >= min(p, 2 r y0) is a
   lower bound on one configuration, not a full count. The verdict does not depend on m (Proposition
   4 holds for any m), but the displayed bound `r^(c0 - eps)` does.
3. Lemma G2 (ii) (resonances of Gamma_1(5) are zeros of single Dirichlet L-functions; the
   normalisation and nebentypus of G_chi) is recalled, not derived. In Lemma G1 the Hecke action
   on Fourier coefficients of 1-periodic eigenfunctions is used in its standard form without the
   computation being written out.

Also not done: the five controls marked "not run"; any referee.

## 10. Proposals (for the map and the engine; this lane does not edit them)

- Device node: `DEVICE_NODE.json` in this directory (id `hecke-correspondence-recurrence`, state
  proposed closed after one referee).
- Control to add to map section 2 as an auxiliary control for devices on the modular surface:
  EIS-w (off-resonance Eisenstein series of the same group), with the rule: a device on Gamma\H must
  name the step that fails for E(., w') with phi(w') != 0.
- Map row (geometric family, next free G number): "Hecke correspondence recurrence and measure
  rigidity on Eisenstein resonance states: recurrence bound has P-exponent -1 for every sigma;
  limit measures m_sigma are A-conformal Hecke eigen-measures for every sigma > 1/2; EIS-w passes
  every step; horocycle-period form is Zagier's criterion and the Hecke action on nu_y is a function
  of the dilation (G26)."

## Files

- `RESULT.md` (this file), `check.py`, `check.json`, `DEVICE_NODE.json`.
