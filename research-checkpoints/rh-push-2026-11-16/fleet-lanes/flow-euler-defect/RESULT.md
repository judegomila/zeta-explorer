# Euler defect along the de Bruijn flow: exact cocycle, sign dictionary, and where it cannot be coupled to zeros

Working note, 2026-11-16. Slug: flow-euler-defect. Scope: this directory only. Nothing committed or pushed.
No RH claim, no change to any Lambda bound or zero-free region.
Labels: PROVED (argument given here), CLASSICAL (cited theorem), MEASURED (mpmath, not interval-certified), OPEN.

**Verdict: precise obstruction.** The Euler defect of H_t exists, is exact and explicit (Prop. 1-2), and it does
separate t = 0 from every t != 0 and zeta from DH. It cannot be coupled to zero location, for three reasons that are
each proved or classical (section 4). The rigidity statement in the task, as worded, has a hypothesis that is false for
every t0 < 0 (Rodgers-Tao), so it is vacuous; its non-vacuous form is the sign dictionary of Prop. 3, which is a
reformulation of "Lambda = 0", not a proof route.

## 0. Plan and what is new relative to the atlas and the walls

Required reading done: atlas (refs/pr/27 historical-routes.md), the three 2026-11-01 syntheses, eq48 RESULT/REFEREE,
euler/RESULT.md, formalization/paper/flow-blindness-no-go.tex, src/data/rh-route-b-arithmetic-freeze-flow-2026-09-23.js.

| Prior item | Overlap | What this note adds |
|---|---|---|
| flow-blindness-no-go (Lemma SL2) | Says the flow "destroys the arithmetic identity"; gives no formula for what is destroyed | Exact formula: the n-th coefficient becomes exp(t log^2 n) and the gamma factor is shifted by 2t log n. The defect is the 2-cocycle exp(2t log m log n). |
| Route B freeze-flow (Lemma M, Lemma A) | Deforms coefficients by hand (tau), finds no confining force | Uses the heat flow itself as the coefficient deformation; no second parameter. |
| Atlas section 3 (ferromagnetic / Lee-Yang; "finite prime approximant can fail Lee-Yang") | Ferromagnetic finite partition functions are named as missing | Identifies the heat time t as the ferromagnetic coupling between prime occupation numbers and shows the t > 0 side has no termwise-convergent expansion (Prop. 4), which is why no finite ferromagnetic object exists there. |
| DH wall | Same control | Flow defect is identical for zeta and DH (section 3); only the t-independent coefficient defect differs. |
| euler/RESULT.md (Pick orders are Euler-blind) | Finite orders are open conditions | Complementary: the defect is a closed condition (E = 0), but its zero locus is one point. |

Normalization (route-B convention). g(y) = (2 pi^2 y^4 - 3 pi y^2) exp(-pi y^2), phi_n(u) = e^{u/2} g(n e^u),
Phi = sum_n phi_n (even, positive, doubly exponentially decaying), s = 1/2 + iz,
Xi(z) := int Phi(u) e^{izu} du = xi(s)/2, H_t(z) := int e^{t u^2} Phi(u) e^{izu} du.
Relation to the standard de Bruijn-Newman normalization: t_here = t_std / 4, z_std = 2 z_here. Signs agree, so
Lambda <= 0 and Lambda >= 0 mean the same thing. gamma(s) := 4 int g(e^v) e^{sv} dv = s(s-1) pi^{-s/2} Gamma(s/2).

## 1. The exact Euler defect

**Prop. 1 (twisted Dirichlet series, t < 0). PROVED.** Let gamma_t(w) := int e^{t v^2} g(e^v) e^{wv} dv (entire in w for
t < 0). For every t < 0 and every complex s,

    H_t = sum_{n>=1} exp(t log^2 n) n^{-s} gamma_t(s - 2 t log n),

absolutely convergent, locally uniformly in s.

Proof. In int e^{t u^2} e^{u/2} g(n e^u) e^{izu} du put v = u + L, L = log n. Then
e^{t(v-L)^2} = e^{t v^2} e^{-2tLv} e^{tL^2} and e^{s(v-L)} = n^{-s} e^{sv}, which gives the n-th term. Termwise
integration is justified by absolute convergence: |gamma_t(w)| <= int |g(e^v)| e^{Re(w) v} dv = O(Gamma(Re(w)/2 + 2)
pi^{-Re w/2}), so the n-th term is at most exp(-|t| L^2 + |t| L log L + O(L)), summable over n. QED

At t = 0 this is xi = (1/4) gamma(s) sum n^{-s} for Re s > 1. For t != 0 the coefficient exp(t log^2 n) is not
multiplicative and the gamma factor depends on n.

**Prop. 2 (mixture form and cocycle). PROVED.**
(a) t < 0: H_t(z) = E[ Xi(z + a) ], a ~ N(0, 2|t|). A mixture of *vertical* translates of xi.
(b) t > 0: H_t(z) = E[ xi(s + b)/2 ], b ~ N(0, 2t). A mixture of *horizontal* translates of xi.
(c) c_n(t) := exp(t log^2 n) satisfies c_{mn} = c_m c_n exp(2 t log m log n) for all m, n. For t < 0,
    c_n(t) = E[n^{-ia}] is a positive-definite function on the group Q_+^* and is a character of that group (an Euler
    product) iff the mixing law is a point mass, i.e. iff t = 0.
Define the Euler defect kappa_t(m,n) := log c_{mn} - log c_m - log c_n = 2 t log m log n. Scalar version:
E(t) := |1 - exp(2 t log 2 log 3)|.

Proof. e^{-|t|u^2} = E[e^{iau}] and e^{tu^2} = E[e^{bu}]; Fubini holds because Phi decays doubly exponentially and
xi(s + b) = O(exp(|b| log |b|)) against the Gaussian tail. (c) is the expansion of (log m + log n)^2 and Bochner's
theorem on the discrete group Q_+^* = direct sum over p of Z. QED

Reading: the heat flow is the pair interaction 2 t log p log q k_p k_q between prime occupation numbers
(n = prod p^{k_p}). t > 0 is super-multiplicative (ferromagnetic sign), t < 0 is sub-multiplicative, and the Euler
product is the non-interacting point t = 0.

MEASURED (check.py, check2.py, dps 20-30): series vs direct integral, relative error 1.3e-10 to 3.5e-9 at t = -1
(N = 150) and 4.7e-7 to 7e-5 at t = -0.3 (N = 2000), z in {2, 5 + 0.7i, 14}. Mixture identities (a), (b) agree with
the direct integral to 12 digits at t = -0.05, +0.05. Cocycle identity to 12 digits.

## 2. The rigidity statement, in its non-vacuous form

The task's hypothesis "H_t has only real zeros for all t in (t0, 0]" with t0 < 0 is false for the theta profile
(CLASSICAL: Rodgers-Tao, Lambda >= 0), with or without RH. With t0 = 0 the hypothesis is RH. So the stated
implication has no content. The statement that does have content:

**Prop. 3 (sign dictionary). PROVED equivalence, given CLASSICAL inputs.** For the family H_t of the theta profile:
(i) kappa_t < 0 implies H_t has a non-real zero (Rodgers-Tao).
(ii) RH holds iff H_t has only real zeros for every kappa_t > 0 (de Bruijn monotonicity plus Hurwitz at t -> 0+).
So RH is equivalent to: the real-zero locus in t equals the locus {kappa_t >= 0} where the coefficient cocycle is
super-multiplicative. Unconditionally the real-zero locus is {t >= Lambda} with 0 <= Lambda <= 0.2/4 (here-units).

This is a reformulation of Lambda = 0. It is not a proof step: nothing in (ii) uses kappa.

## 3. DH control

Let a_n be the DH coefficients (mod 5) and Phi_DH the corresponding theta-type profile. Props. 1-2 hold verbatim with
a_n exp(t log^2 n) and the DH gamma factor (same substitution; PROVED by the same two lines). The flow cocycle
kappa_t(m,n) = 2 t log m log n is the same function for zeta, for DH, and for any other initial datum, because it is the
cocycle of the multiplier e^{t u^2}, not of the function. The total defect is
(defect of a_n, independent of t) + kappa_t. For DH the real-zero locus is {t >= Lambda_DH} with Lambda_DH > 0
(off-line zeros at t = 0; real-zero set closed in t), so the sign dictionary of Prop. 3 fails for DH, as it must.
Where the Euler product enters Prop. 3: only in the unproved direction (ii), i.e. nowhere usable. No step of this note
proves anything for zeta that is false for DH.

## 4. Where the defect cannot be coupled to zeros

**O1 (the flow defect does not see the initial datum). PROVED.** kappa_t is a function of t alone. A planted-twin
initial datum (xi with one pair moved off the line), DH, and xi have the same kappa_t for every t. Any inequality
"imaginary parts of zeros of H_t <= F(kappa_t)" would hold for all three or none; it is false for the twin and DH at
t = 0. The only defect that distinguishes them is the t = 0 coefficient defect, which the flow never changes.

**O2 (the E = 0 locus is a single point; a defect is a distance to it). CLASSICAL + PROVED.**
Within symmetric mixtures F_mu = int Xi(. + a) dmu(a): if F_mu = gamma(s) D(s) with D an ordinary Dirichlet series
absolutely convergent in some half-plane, then Hamburger's theorem (F_mu is entire of order 1 and satisfies the
functional equation) gives D = c zeta, so mu-hat(u) Phi(u) = c Phi(u), so mu = c delta_0. Also directly: |mu-hat(log 2)|
= |mu-hat(log 3)| = 1 for a symmetric probability measure forces mu = delta_0 (log 2 / log 3 irrational). Hence
"E = 0 implies real zeros" has exactly one instance, xi itself, and is RH with no family around it. An inequality
"zeros within F(E) of the line" for E > 0 transports information from the point to its neighbours (Hurwitz), never from
neighbours to the point. The neighbours on the sub-multiplicative side have non-real zeros (Rodgers-Tao); on the
super-multiplicative side "real zeros for all small t > 0" is RH. This is the flow-blindness wall restated: the Euler
locus lies in the closure of the non-real-zero set.

**O3 (the ferromagnetic side has no termwise expansion). PROVED.** For t > 0 and each n,
int e^{t u^2} phi_n(u) e^{izu} du diverges: phi_n(u) ~ -3 pi n^2 e^{5u/2} as u -> -infinity, which is only exponential
decay against e^{t u^2}. (MEASURED illustration, t = 0.05, n = 1: integrand -1.9e-8 at u = -10, -1.0e14 at u = -60.)
Only the full sum Phi, whose two-sided decay comes from the theta functional equation, can be flowed forward. So for
t > 0 the coefficients exp(t log^2 n) are formal: sum_n exp(t log^2 n) n^{-s} converges nowhere. A Lee-Yang type
argument (ferromagnetic pair interaction implies zeros on the line) needs finite or convergent partition functions with
the ferromagnetic weights; here they exist only for t < 0, where the interaction has the wrong sign and the conclusion
is false. Atlas section 3 already records that finite prime approximants can fail the Lee-Yang property; O3 is the
structural reason the t > 0 side offers no approximants at all.

**MEASURED side check (twopoint.py).** Two-point vertical mixtures f_a = Xi(z+a) + Xi(z-a) (multiplier 2 cos(au),
coefficient defect of order 1: c_n = cos(a log n)) for a in {0.5, 1, 2, 3, 5}: winding-number count of all zeros in
|Re z| <= 60.3, |Im z| <= 4 equals twice the real sign-change count in every case (26, 24, 24, 24, 22). No non-real zero
at low height although E is of order 1. Reason: |Xi(x - a)/Xi(x + a)| ~ e^{pi a/2}, so f_a is a small perturbation of
one translate there. So even a large defect does not move zeros off the line at bounded height; the defect and
zero location are decoupled at every finite height, in both directions.

## 5. Pivot (one): mixture rigidity as a converse statement

The adjacent statement that is not a reformulation of RH: "for every non-degenerate symmetric probability measure mu
(with exponential moments), int Xi(z + a) dmu(a) has a non-real zero." This is Rodgers-Tao for Gaussian mu. For
two-point mu it is OPEN as far as this note knows; section 4's measurement shows any non-real zeros are above height 60
for a <= 5. It would say: real zeros characterize the extreme points (Euler products) among vertical mixtures of xi.
It is a statement about what fails off the Euler locus, so it gives no information on RH, and no proof is offered.
Not pursued further.

## 6. Verdict

Precise obstruction. PROVED: Prop. 1, Prop. 2, O1, O3, and the reduction in O2. CLASSICAL inputs: Rodgers-Tao,
de Bruijn, Hamburger, Bochner. MEASURED: numerical checks of Props. 1-2 and the two-point box counts. OPEN: everything
toward RH. The Euler defect is exact and not flow-stable, but (O1) along the flow it is the same for zeta, DH and
planted twins, (O2) its zero locus is one point, and (O3) on the side where its sign is favourable there is no
convergent object carrying it.

## 7. Three weakest steps

1. O2 uses Hamburger's theorem for F_mu / gamma; the hypothesis "D is an ordinary Dirichlet series absolutely convergent
   somewhere" is assumed, and the growth condition of Hamburger's theorem for F_mu was checked only by the order-1 bound
   for compactly supported or Gaussian mu, not for general mu.
2. Section 3 asserts Lambda_DH is finite and positive and that de Bruijn's theorems apply to the DH profile. The profile
   is a theta-type sum with the same decay, but this was not written out or computed.
3. Prop. 3 and the Lee-Yang reading in O3 are interpretations. O3 proves termwise divergence; it does not prove that no
   other convergent ferromagnetic representation of H_t (t > 0) exists (for example via the Riemann-Siegel split or the
   horizontal mixture (b), which converges but is not a sum over n with positive weights).

## Files

- check.py: Props. 1-2 identities, termwise divergence, cocycle.
- check2.py: convergence of the twisted series at t = -1, -0.3.
- twopoint.py: two-point mixture zero counts.
Run with `.venv-arb/bin/python -I <file>` from the repo root.
