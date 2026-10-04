# Fiber tails: the corrected defect-form tail bound and the r7 tightenings of the P47 fiber engine

Date: 2026-10-03 (r7 round). Branch `editorial-redesign`, working files only (nothing committed).
Code: `tmp/r7-engine-cert.py` (development engine; frozen pilot copies `tmp/r7-engine-cert-v3.py`, `-v3c.py`, `-v4.py`, `-v4c.py`),
`tmp/r7-engine-c/r7maj.c` (explicit extension `ext_rec`, exponential majorants `maj_exp`, `maj_exp_d`, aggregation `dual_agg`; frozen
binary `libr7maj-v3.dylib`), `tmp/r7-engine-xstruct.py` (extended S235 structure to 7 N0), `tmp/r7-engine-pilot.py` (driver),
`tmp/r7-engine-queue.sh`, `-queue2.sh` (queues), `tmp/r7-engine-split.py`, `-split2.py`, `-merge.py` (partition of a checkpoint among
workers and assembly of the certificate), `tmp/r7-engine-cover.py` and `tmp/r7-engine-report.py` (exact cover check, report, consumer),
`tmp/r7-engine-table.py`, `-table2.py` (pilot tables), `tmp/r7-engine-steal.sh` (checkpoint-aligned partition of a running worker),
`tmp/r7-engine-landscape.py` (pointwise bound landscape), `tmp/r7-engine-launch-splits.sh`, `-recheck-chain.sh`, `-mon-*.sh`, `-ckinfo.py`
(launch, recheck and monitoring helpers kept for provenance),
`tmp/r7-engine-val*.py`, `-sound.py`, `-recheck.py` (validation), `tmp/r7-engine-survey.py`, `-scen.py` (survey, consumer scenarios),
`tmp/r7-engine-diag*.py`, `tmp/r7-engine-t*.py` (diagnostics and tests).
The engine reuses the r6 modules `tmp/r6-fiber-lib.py`, `tmp/r6-fiber-l1.py` and the C libraries in `tmp/r6-fiber-c/`
(Taylor models `libr6tm2`, majorant recursions `libr6maj`), unchanged.

Grades: PROVED (complete argument written here, not refereed by a second party), CERTIFIED (computer-assisted with
outward-rounded floating point / Taylor models / python-flint arb inputs, single implementation, in-session), MEASURED
(floating point without enclosures), HEURISTIC.

Sections 0–7 are mathematics (PROVED as written, unrefereed). Section 8 maps them to the code. Section 9 reports the
pilot. The pilot certificates change the certified route-P value only through the exact consumer (§9.3).

**Outcome (2026-10-03).**

* *Tail fix* (PROVED here, unrefereed). Lemma T (§1.2) bounds the per-label fiber tails Σ_{μr>N0} |dl_{μr}| for arbitrary centring
  constants; Lemma T1 (§1.4) is the corrected r6 bound. The r6 `tails_defect` dropped the coefficients e_{μr} = −c_r w_μ z0^μ and
  de_{μr} = −(dc_r w_μ + c_r dw_μ) z0^μ for N0/r < μ ≤ N0; T1 adds them as suffix sums over the fiber-smooth labels, after which Ê, dÊ are
  majorants and Lemma T applies. Implemented in `Piece.tails_defect` (reproduces the referee patch to 4·10^{−19}); MEASURED: no true tail
  (float recursion, μr ≤ 49 N0) above the bound at five cells, per label and per (label, q) (max ratio 0.76 with the product form, 0.84
  with Lemma X).
* *Tightenings* (PROVED here, unrefereed). Product-form majorant of 1/g (Lemma PF, T00), μ = 1 centring, explicit extension to 7 N0 with
  an exponential far bound (Lemma X) and the explicit coefficients inside the labels (Corollary X′), the Re/Im-split label bound with refined
  denominator and per-label choice (Lemma Q′), β̄ inside the labels (Lemma B), per-label slopes and per-probe convex chords for the
  extra part (Lemmas N, E, C), T2 as point value plus cone (Lemma T2); assembled in Theorem 7.1 / Corollary 7.2. MEASURED: the bound at
  the central box θ_s = 0 drops from 0.0198–0.0992 (r6 with the referee patch) to 0.0045–0.0343 (v4) at the pilot floors.
* *Pilot* (CERTIFIED: computer-assisted, single implementation, in-session, unrefereed; inputs from the r2/r6 python-flint/arb programs,
  box bounds in outward-rounded floating point and Taylor models). All 13 floors at the 12 pilot cells (cell 320 has two) are certified
  within their targets: WOL-C at cells 240, 260, 280, 300 (margins 0.0222739, 0.0221579, 0.0222973, 0.0222994 ≤ 0.0223/(1 + 10^{−12}))
  and ≤ 0.050 at the nine late floors (0.0499547–0.0499994). pilotPasses = true. Cost 33.6 CPU-hours (§9.3). A second run of all 13
  floors from scratch with engine v4c alone certifies every floor again within its target (§9.6; 32.6 CPU-hours).
* *Consumer.* The r6 certified admission plus the 13 pilot certificates gives route P = 0.146623578252049 (r6: 0.146660920737233),
  CERTIFIED with the pilot's grading (best of the two certificate sets: 0.146623576862494). Λ < 0.145 is NOT certified. HYPOTHETICAL
  (exact consumer on assumed margins, §9.4): all 371 floors at the pilot targets → 0.144993161654455; per-floor margins point + A,
  A ≤ 0.010 → 0.144873–0.144947; early floors at the WOL-C target with late floors at max(0.050, point + A) → above 0.145.
* *Not established.* A second implementation of the box bound; a non-author referee of this note and of the engine; certificates for the
  other 358 floors (about 900 CPU-hours at the pilot targets, about 80 hours with 11 workers, HEURISTIC; 72–74% of the boxes are spent at
  |θ_s| ≥ 1.5); about 40 late floors have central-box bounds above 0.050 and need per-floor targets. PT Λ ≤ 0.2 stands. RH is open.
  No QED.

---

## 0. Setting

Notation follows `wol-pd-lemmas.md` §0 and `outer-lemma-weak.md` §1.1. N0 = 690988.

**0.1 Primes and integers.** S = {2, 3, 5} ("S235"), F = {7, 11, 13, …, 47} (the twelve *fiber primes*),
P = S ∪ F ("P47"). An integer is *S235-rough* if it is coprime to 30, *P47-rough* if it is coprime to every prime ≤ 47,
*F-smooth* if all its prime factors lie in F. Every S235-rough ρ factors uniquely as

    ρ = μ r,   μ = μ(ρ) F-smooth,   r = r(ρ) P47-rough.

e_q(μ) is the exponent of q ∈ F in μ, Ω(μ) = Σ_q e_q(μ). An *S235 label* is an S235-rough ρ with 1 < ρ ≤ N0; a *P47
label* is a P47-rough r with 1 < r ≤ N0. F-smooth S235 labels (r(ρ) = 1) are the *fiber-smooth* labels.

**0.2 Angles, probes, phases.** θ = (θ_s, θ_l) with θ_s ∈ T^S (the box variables) and θ_l ∈ T^F (the fiber angles).
For a probe s ∈ {+, −} and fixed (θ_s, t, a), every S235 quantity of `wol-pd-lemmas.md` §0.4 is a complex number
(the S235 structure evaluated at z_S^s(θ_s)). Write, for the fiber variables of probe s,

    z_q^s = e^{i(θ_q + s a log q / 2)} = z0_q^s x_q,    z0_q^s = e^{i s a log q / 2},   x_q = e^{iθ_q}   (q ∈ F),

so that (z^s)^μ = (z0^s)^μ x^μ with (z0^s)^μ = e^{i s a (log μ)/2} unimodular and multiplicative in μ. θ_l = 0 is x = 1.
For μ F-smooth, ψ_μ = ⟨e(μ), θ_l⟩, so x^μ = e^{iψ_μ}, and η_q := x_q − 1, |η_q| = 2|sin(θ_q/2)|.

**0.3 S235 data.** For probe s at (θ_s, t, a): w_ρ, dw_ρ, wp_ρ, dwp_ρ (ρ ≤ N0 S235-rough, w_1 = 1, dw_1 = 0) and the
log labels l_ρ, dl_ρ. Put X^ρ := x^{μ(ρ)} u^{r(ρ)} where u^r is a monomial in one formal variable per P47-rough prime,
and define the formal power series (in x and u)

    W := Σ_{ρ ≤ N0} w_ρ (z0)^{μ(ρ)} X^ρ,    dW := Σ_{ρ ≤ N0} dw_ρ (z0)^{μ(ρ)} X^ρ,     L := log W,   dL := dW / W.

W has constant term 1, so L and dL are well-defined formal series; their coefficients are l_ρ (z0)^μ and dl_ρ (z0)^μ for
every S235-rough ρ (ρ ≤ N0: the S235 log labels of `wol-pd-lemmas.md` §0.4, by the recursions of Lemma 1.1 there;
ρ > N0: by definition, w_ρ = dw_ρ = 0). In particular dl_ρ is defined for all S235-rough ρ.

The x-only parts (u = 0): g(x) := W(x, 0) = 1 + Σ_{μ > 1} w_μ z0^μ x^μ (μ F-smooth ≤ N0), dg(x) := dW(x, 0),
z(x) := dg/g = Σ_μ dl_μ z0^μ x^μ. For a P47 label r: n_r(x) := [u^r] W = Σ_{μ ≤ N0/r} w_{μr} z0^μ x^μ,
dn_r := [u^r] dW; the reflected numerators np_r(x) := Σ_μ wp_{μr} conj(z0^μ x^μ), dnp_r similarly (r ≥ 1).

**0.4 Lemma F (fiber factorization).** Fix (θ_s, t, a), a probe, and suppose g has no zero on the closed polydisc
|x_q| ≤ 1 (q ∈ F). Then for every θ_l ∈ T^F, with x = e^{iθ_l}:

(a) c_1^{(47)} = c_1^{(235)} g(x); w_r^{(47)} = n_r(x)/g(x); d_1^{(47)}/c_1^{(47)} = d_1^{(235)}/c_1^{(235)} + z(x);
    dw_r^{(47)} = (dn_r − n_r z)/g; wp_r^{(47)} = np_r/g; dwp_r^{(47)} = (dnp_r − np_r z)/g   (r ≥ 1 for the reflected ones);
(b) l_r^{(47)} = [u^r] L, dl_r^{(47)} = [u^r] dL = Σ_μ dl_{μr} z0^μ x^μ (sum over all F-smooth μ, absolutely convergent);
(c) with Y_ρ := ½ (dl_ρ^+ e^{i a log ρ/2} + dl_ρ^− e^{−i a log ρ/2}) (the S235 joint label of ρ, any ρ),

    K0(θ) − K0(θ_s, 0) = −Re Σ_{μ > 1} Y_μ (x^μ − 1),          X_r(θ) − X_r(θ_s, 0) = Σ_{μ > 1} Y_{μr} (x^μ − 1).

*Proof.* (a) Split every P47-smooth m as m = m_S μ (m_S S-smooth, μ F-smooth). Then c_r^{(47)}(z) = Σ_μ z^μ c_{μr}^{(235)}(z_S)
and, dividing by c_1^{(235)}, c_r^{(47)} = c_1^{(235)} n_r(x) (r = 1: c_1^{(235)} g). The d-identities follow from
d_n = −½ log(n) a_n coefficientwise: d_1^{(47)} = Σ_μ z^μ d_μ^{(235)} and d_μ^{(235)} = c_1^{(235)}(dw_μ + w_μ d_1^{(235)}/c_1^{(235)}),
which gives d_1^{(47)} = c_1^{(235)}(dg + g d_1^{(235)}/c_1^{(235)}); the label formulas of `wol-pd-lemmas.md` §0.4 then give
the stated quotients (for dwp the D1 := d_1^{(235)}/c_1^{(235)} terms cancel). (b) The P47 label generating function is
W^{(47)}(x, u) := 1 + Σ_r w_r^{(47)} u^r = W(x, u)/g(x) by (a), so log W^{(47)} = L − log g and, since log g has no u-part,
[u^r] log W^{(47)} = [u^r] L for r > 1; the P47 rough-log recursion (Lemma 1.1 of `wol-pd-lemmas.md`, applied to the
P47 structure) identifies l_r^{(47)} with [u^r] log W^{(47)}. The same for dL = dW/W: dW^{(47)}/W^{(47)} = dW/W − dg/g.
Since g is zero-free on a neighbourhood of the closed polydisc, every quantity in (a), (b) is analytic there and equals
its absolutely convergent Taylor series (Cauchy estimates, as in Lemma 1.2 of `wol-pd-lemmas.md`). (c) Insert (b) into
X_r = ½(dl_r^+ ph_r + dl_r^− conj ph_r) and use (z0^±)^μ = e^{±i a log μ /2}; for K0 = −½ Σ_s Re(d_1/c_1)^s use (a). ∎

Lemma F is the r6 "Fiber Lemma" (re-derived by the r6 referee); it is restated here because every bound below is a
bound on the right-hand sides of (c).

**0.5 Head and tail.** For a P47 label r the coefficients Y_{μr} with μ r ≤ N0 (*head*) are S235 labels, enclosed over the
box by the Taylor models of the S235 structure. The coefficients with μ r > N0 (*tail*) are not computed; they are
bounded in total. The r6 and r7 engines use, per probe s,

    T_r^s ≥ Σ_{μ: μ r > N0} |dl^s_{μr}|,        τ_q^s ≥ Σ_{r} Σ_{μ: μ r > N0} e_q(μ) |dl^s_{μr}|          (r = 1: fiber-smooth slot, μ > N0),

and the cone Σ_{μ ∈ tail} |Y_{μr}| |x^μ − 1| ≤ Σ_q (Σ_μ e_q(μ) |Y_{μr}|) |η_q| (|x^μ − 1| ≤ Σ_q e_q(μ) |η_q|) with
|Y_ρ| ≤ ½ Σ_s |dl^s_ρ|. Sections 1–3 give these bounds.

---

## 1. Lemma T (corrected defect-form tail bound)

**1.1 The identity.** Fix a probe. Let (c_r)_{r>1}, (dc_r)_{r>1} be **arbitrary** complex constants (independent of x and u).
Put W_c(u) := 1 + Σ_{r>1} c_r u^r, dW_c(u) := Σ_{r>1} dc_r u^r and

    E(x, u) := W(x, u) − g(x) W_c(u),          dE(x, u) := dW(x, u) − g(x) dW_c(u) − dg(x) W_c(u),
    Q := E / (g W_c),                          dQ := dE/(g W_c) − E dg/(g² W_c) − E dW_c/(g W_c²).

E and dE have no u^0 part, and for r > 1

    E_r(x) = n_r(x) − c_r g(x),      e_{μr} := [x^μ] E_r = w_{μr} z0^μ − c_r w_μ z0^μ,
    dE_r(x) = dn_r(x) − dc_r g(x) − c_r dg(x),      de_{μr} := [x^μ] dE_r = (dw_{μr} − dc_r w_μ − c_r dw_μ) z0^μ,

for **every** F-smooth μ, with the conventions w_1 = 1, dw_1 = 0, and w_ρ = dw_ρ = 0 for ρ > N0. In particular, for
N0/r < μ ≤ N0:  e_{μr} = −c_r w_μ z0^μ ≠ 0 and de_{μr} = −(dc_r w_μ + c_r dw_μ) z0^μ ≠ 0 in general.

*Identity.*  dW/W = dg/g + dW_c/W_c + dQ/(1 + Q).

*Proof.* W = g W_c (1 + Q) by definition of Q. Expand g W_c dQ = dE − E dg/g − E dW_c/W_c and use
E/g = W/g − W_c: then dg W_c (1+Q) + g dW_c (1+Q) + g W_c dQ = dg W_c + dg E/g + g dW_c + dW_c E/W_c + dE − E dg/g − E dW_c/W_c
= dg W_c + g dW_c + dE = dW. Divide by W = g W_c (1+Q). ∎

The identity is purely algebraic; no relation between (c_r, dc_r) and the data is needed. dg/g has only u^0 terms and
dW_c/W_c only x^0 (μ = 1) terms, so for r > 1 and μ > 1

    [x^μ u^r] dL = [x^μ u^r] dQ/(1 + Q).                                                                     (1.1)

The engine evaluates Lemma T for two centrings, (c_r, dc_r) = (w_r^{(47)}, dw_r^{(47)})(θ_s, 0) (then E_r(1) = dE_r(1) = 0, used in
§5–§6) and (c_r, dc_r) = (w_r^{(235)}, dw_r^{(235)})(θ_s) (the μ = 1 coefficients, so e_{1·r} = de_{1·r} = 0), and takes per label
(and per label and q for the e_q-weighted tails) the smaller bound; (1.1) and Lemma T hold for any choice. MEASURED: the μ = 1 centring
lowers τ by 8–12% on top of the product form (`tmp/r7-engine-t12.py`).

**1.2 Lemma T.** Let ê_{μr} ≥ |e_{μr}|, dê_{μr} ≥ |de_{μr}| for all F-smooth μ and P47 labels r (including
N0/r < μ ≤ N0), let Ĝ(x) = Σ_μ Ĝ_μ x^μ be any series with Ĝ_μ ≥ |[x^μ] 1/g|, |dg|^ := Σ_μ |dw_μ| x^μ,
B̂(u) any series with B̂_r ≥ |[u^r] 1/W_c| for r ≤ N0, |dc|^(u) := Σ_r |dc_r| u^r. Define the nonnegative series

    Q̂ := (Ê Ĝ) B̂,     dQ̂ := (dÊ Ĝ + Ê |dg|^ Ĝ²) B̂ + (Ê Ĝ) |dc|^ B̂²,     D := dQ̂ / (1 − Q̂) := dQ̂ Σ_{k≥0} Q̂^k,

where Ê = Σ_{r>1} Σ_μ ê_{μr} x^μ u^r and dÊ likewise. Then |[x^μ u^r] dL| ≤ [x^μ u^r] D for every μ > 1, r > 1.
Consequently, if D_r(1) := Σ_μ [x^μ u^r] D, D_{r,q}(1) := Σ_μ e_q(μ) [x^μ u^r] D are finite and
H_r ≤ Σ_{μ ≤ N0/r} [x^μ u^r] D, H_{r,q} ≤ Σ_{μ ≤ N0/r} e_q(μ) [x^μ u^r] D, then

    T_r := Σ_{μ: μ r > N0} |dl_{μr}| ≤ D_r(1) − H_r,         Σ_{r>1} Σ_{μ: μr > N0} e_q(μ) |dl_{μr}| ≤ Σ_{r>1} (D_{r,q}(1) − H_{r,q}).

*Proof.* Coefficientwise, |1/g| ≤ Ĝ, |1/W_c| ≤ B̂ (on u^r, r ≤ N0, which is all that enters the coefficients with r ≤ N0),
|E| ≤ Ê, |dE| ≤ dÊ, |dg| ≤ |dg|^, |dW_c| ≤ |dc|^; products and sums of series are majorized by the products and sums of
the majorants, so |Q| ≤ Q̂ and |dQ| ≤ dQ̂. Q has no u^0 term (E has none), so (1 + Q)^{−1} = Σ_k (−Q)^k is a formal series whose
coefficient at any u^r involves finitely many k (k ≤ Ω_u(r)), and |dQ/(1 + Q)| ≤ D. By (1.1) and |z0^μ| = 1,
|dl_{μr}| = |[x^μ u^r] dL| ≤ [x^μ u^r] D. Summing over the tail μ > N0/r: Σ_{μ > N0/r} [x^μ u^r] D = D_r(1) − Σ_{μ ≤ N0/r} [·]
≤ D_r(1) − H_r (all coefficients are ≥ 0; μ r > N0 forces μ > 1). The e_q-weighted statement is identical. ∎

**1.3 Totals at x = 1 and heads.**
*Totals.* For a nonnegative series A(x, u) whose x-coefficients at each u^r are summable, A_r(1) = Σ_μ [x^μ u^r] A and
A_{r,q}(1) = Σ_μ e_q(μ)[x^μ u^r] A = (x_q ∂_{x_q} A_r)(1). Evaluation at x = 1 and x_q ∂_{x_q} at x = 1 are ring
homomorphism / derivation on such series (Fubini for nonnegative terms), so the totals of D are obtained from the totals
of its ingredients by the same algebra in the "dual numbers" (value, x_q∂_q-components): products by the Leibniz rule,
1/(1 − A) by the u-recursion of the inverse. The engine evaluates, per P47 label r ≤ N0 and with upward rounding,
Ê_r(1) = Σ_{all μ} ê_{μr}, its 12 e_q-weighted components, the same for dÊ, Ĝ(1) with its derivatives, |dg|^(1) with
derivatives, and then the u-convolutions on the P47 label structure (only u^r with r ≤ N0 are needed, and the
coefficient of u^r involves only u^{r'} with r' | r, r' ≤ N0). Finiteness: Ĝ(1) < ∞ is part of each Ĝ used (§2), and
Ê_r(1) is a finite sum.

*Heads.* A coefficient [x^μ u^r] D with μ r ≤ N0 is a finite sum of products of coefficients [x^{μ_i} u^{r_i}] of the
ingredients with Π μ_i = μ, Π r_i = r, hence μ_i r_i ≤ μ r ≤ N0: heads involve only ê_{μ'r'}, dê_{μ'r'} with
μ' r' ≤ N0 (S235 labels) and Ĝ_μ', |dw_μ'| with μ' ≤ N0. The engine computes all head coefficients on the S235 label
structure (Dirichlet convolution over S235-rough ρ = μ r ≤ N0) with downward rounding, so H_r, H_{r,q} ≤ the exact
heads of the majorant series defined by the same floating-point inputs.

**1.4 The r6 defect and its correction (Lemma T1).** The r6 implementation (`Piece.tails_defect` in
`tmp/r6-fiber-cert.py`) built Ê, dÊ from the S235 labels ρ = μ r ≤ N0 only. It therefore omitted the coefficients
e_{μr} = −c_r w_μ z0^μ and de_{μr} = −(dc_r w_μ + c_r dw_μ) z0^μ for N0/r < μ ≤ N0 from the totals Ê_r(1), dÊ_r(1)
(the heads are unaffected by 1.3). Its Ê is not a majorant of E, Lemma T does not apply, and the r6 referee exhibited
true tails above the computed bound (ratio up to 6.2 at cell 579). The correction adds, per P47 label r with
X_r := ⌊N0/r⌋,

    Ê_r(1) += |c_r|^up S_w(X_r),   Ê_{r,q}(1) += |c_r|^up S_{w,q}(X_r),
    dÊ_r(1) += |dc_r|^up S_w(X_r) + |c_r|^up S_{dw}(X_r),   dÊ_{r,q}(1) += |dc_r|^up S_{w,q}(X_r) + |c_r|^up S_{dw,q}(X_r),

where S_w(X) = Σ_{μ F-smooth, X < μ ≤ N0} |w_μ|^up, S_{w,q}(X) = Σ e_q(μ)|w_μ|^up, and S_{dw}, S_{dw,q} likewise with
|dw_μ|^up (suffix sums over the fiber-smooth labels sorted by μ, upward-inflated). With this, Ê and dÊ are majorants of E
and dE over all μ (each added term is the bound |c_r| |w_μ| ≥ |e_{μr}|, |dc_r||w_μ| + |c_r||dw_μ| ≥ |de_{μr}|), and Lemma T
applies. μ > N0 needs nothing: w_μ = dw_μ = 0 there. **Lemma T1 (corrected r6 tails) is Lemma T with these Ê, dÊ, the
plain Ĝ = 1/(1 − Σ_{μ>1} |w_μ|^up x^μ) and B̂ = 1/(1 − Σ_r |c_r|^up u^r); it is PROVED by 1.2–1.3.** The referee patch
`tmp/r6-ref-fiber-fix.py` implements exactly these additions; in `tmp/r7-engine-cert.py` they are part of
`Piece.tails_defect` (block "r6 referee fix"). Test: `tmp/r7-engine-t1.py` reproduces the referee-patched r6 values
to 4·10^{−19} (no product form).

**1.5 Lemma T0 (plain form; K0 slot).** With Â := Σ_{ρ>1} |w_ρ|^up X^ρ and dÂ := Σ_ρ |dw_ρ|^up X^ρ (all S235 labels,
fiber-smooth included), |dL| ≤ dÂ/(1 − Â) and |L| ≤ −log(1 − Â) coefficientwise (expand log(1 + (W − 1)) and
dW·Σ(−(W−1))^k). The r6 `tails()` evaluates the totals at x = 1 by factoring 1/(1 − Â) = (1 − γ̂)^{−1}(1 − Â_{u}/(1−γ̂))^{−1}
with γ̂ = Σ_{μ>1}|w_μ|^up, and the heads on the S235 structure. It yields T_r^{plain} for all slots (r = 1 is the
fiber-smooth slot: Σ_{μ > N0} |dl_μ|) and the H-tail htau_q ≥ Σ_{μ > N0} e_q(μ)|l_μ|. PROVED (same argument as 1.2–1.3).

---

## 2. Lemma PF (product-form majorant of 1/g)

**Statement.** Fix a probe and (θ_s, t, a). For q ∈ F let K_q = max{k : q^k ≤ N0} and F_q(ζ) := 1 + Σ_{k=1}^{K_q} w_{q^k} ζ^k
(one complex variable). Assume Σ_{k ≥ 1} |w_{q^k}| < 1 for every q. Let ψ^{(q)}_n be the Taylor coefficients of 1/F_q,
M_q(ζ) := Σ_n M_{q,n} ζ^n with M_{q,n} ≥ |ψ^{(q)}_n|, and put

    D_g(x) := g(x) − Π_{q∈F} F_q(z0_q x_q),        PM(x) := Π_q M_q(x_q),       D̂ := |D_g|^ · PM,

where |D_g|^ = Σ_μ d̂_μ x^μ is any coefficientwise majorant of D_g. If D̂(1) < 1 then, coefficientwise in x,

    |1/g| ≤ Ĝ' := PM / (1 − D̂) = PM · Σ_{k ≥ 0} D̂^k,     Ĝ'(1) = PM(1)/(1 − D̂(1)),
    x_q∂_q Ĝ'(1) = (M_q'(1)/M_q(1)) PM(1)/(1 − D̂(1)) + PM(1) x_q∂_q D̂(1)/(1 − D̂(1))².

*Proof.* Σ_k |w_{q^k}| < 1 makes F_q zero-free on the closed unit disc, so 1/F_q is a power series converging on a disc of
radius > 1; F_q(z0_q x_q) has the same coefficient moduli as F_q (z0_q unimodular), and so does its inverse. The product
P(x) := Π_q F_q(z0_q x_q) is zero-free on the closed polydisc and 1/P = Π_q 1/F_q(z0_q x_q) has coefficientwise
|1/P| ≤ PM (coefficients of a product of one-variable series in distinct variables are products of coefficients).
g = P (1 + D_g/P), and |D_g/P| ≤ |D_g|^ PM = D̂ coefficientwise. As formal series, 1/g = (1/P) Σ_k (−D_g/P)^k
(D_g has no constant term: its coefficients vanish at μ = 1 and at every prime power μ = q^k ≤ N0), hence
|1/g| ≤ PM Σ_k D̂^k. Evaluation at x = 1 and x_q∂_q at x = 1 are as in 1.3 (all terms nonnegative; D̂(1) < 1 gives
convergence). ∎

**Ingredients (computation, CERTIFIED).** `Piece.prodG` (in `tmp/r7-engine-cert.py`):
* f_k := w_{q^k} as complex balls (centre, radius) from the S235 Taylor models over the box × piece.
* ψ_n, n ≤ KP = 48, by the recursion ψ_0 = 1, ψ_n = −Σ_{i=1}^{min(n, K_q)} f_i ψ_{n−i} in ball arithmetic (radius propagation
  |a| r_b + r_a |b| + r_a r_b, rounding terms (8 + 2K_q)U Σ|a||b|, outward factors); M_{q,n} := |ψ_n|^up.
* Tail n > KP: pick ρ > 1 with s := Σ_i |f_i|^up ρ^i < 1 (ρ from a fixed list). Then ψ_n ρ^n = −Σ_i (f_i ρ^i)(ψ_{n−i} ρ^{n−i})
  gives |ψ_n| ρ^n ≤ C := max_{KP−K_q < j ≤ KP} M_{q,j} ρ^j for all n > KP by induction, so
  Σ_{n > KP} |ψ_n| ≤ C ρ^{−KP−1}/(1 − 1/ρ) and Σ_{n > KP} n|ψ_n| ≤ C x^{KP+1}((KP+1) − KP x)/(1 − x)² with x = 1/ρ
  (Lemma 5.3(a) of `wol-pd-lemmas.md`, one variable). M_q(1), M_q'(1) are the explicit sums plus these tails.
* Defect coefficients: for mixed fiber-smooth μ ≤ N0, d̂_μ := |w_μ − Π_q w_{q^{e_q(μ)}}|^up (balls); pure prime powers:
  d_μ = 0 exactly; μ = 1: 0. For μ > N0 (each q^{e_q} ≤ N0, else the product has no such monomial): d_μ = −Π_q w_{q^{e_q}} z0^μ,
  and the total out-of-range mass is ≤ Π_q (1 + Σ_k |w_{q^k}|^up) − (1 + Σ_{μ ≤ N0} Π_q |w_{q^{e_q}}|^lo) (upper minus lower),
  e_q-weighted likewise (the q-component of the product is (Σ_k k|w_{q^k}|) Π_{p ≠ q}(…)). The out-of-range part only enters
  the totals at x = 1 (heads: §1.3).
* Heads of Ĝ' on fiber-smooth μ ≤ N0 (downward): PM_μ = Π_q M_{q, e_q(μ)} (multiplied by 1 − 32U), D̂ = |D_g|^ ⋆ PM and
  Ĝ' = PM ⋆ (1 − D̂)^{−1} by the S235-structure recursions in downward mode.
* Assertion D̂(1) < 0.5. Measured at the central box (probe +): Ĝ'(1) = 1.174 vs the plain 1/(1 − γ̂) = 1.212 at cell 360,
  and the mass of Ĝ' on μ > 1000 is 2.5–4× smaller than the plain one (`tmp/r7-engine-diag8.py`).

**Use.** In Lemma T (Ĝ := Ĝ', both heads and totals), and for the fiber-smooth slot:

**Lemma T00 (K0 slot).** For the fiber-smooth slot, dl_μ (μ F-smooth) are the coefficients of z = dg/g, so
|z| ≤ |dg|^ Ĝ' coefficientwise and Σ_{μ > N0} |dl_μ| ≤ |dg|^(1) Ĝ'(1) − H_0 with H_0 a lower bound of the head
Σ_{μ ≤ N0} [|dg|^ Ĝ']_μ; e_q-weighted likewise. The engine takes the minimum with the plain form T0 (both valid).

Effect (MEASURED, central point box, per probe): labels τ 0.0618 → 0.0481 (cell 360), 0.0472 → 0.0400 (579),
0.0539 → 0.0412 (300); fiber-smooth slot τ0 0.0087 → 0.0035 (360), 0.0096 → 0.0034 (300).

**2.2 Lemma X (explicit extension to N1 = 7 N0 and an exponential bound beyond).** Fix a probe and (θ_s, t, a), N1 := 7 N0.
Let L_≤ := Σ_{ρ ≤ N1} l_ρ X^ρ, L_> := L − L_≤, dL_≤, dL_> likewise (ρ S235-rough). Let Λ := Σ_{1 < ρ ≤ N1} ℓ̂_ρ X^ρ with
ℓ̂_ρ ≥ |l_ρ|, E := exp(Λ), dŴ := Σ_{ρ ≤ N0} |dw_ρ|^up X^ρ, d̂l := Σ_{ρ ≤ N1} |dl_ρ|^up X^ρ, [F]_{>N1} the part of F supported on ρ > N1, and

    Ĉ := [E]_{>N1} · E,       B̂ := [dŴ · E]_{>N1},       M := (B̂ + Ĉ d̂l) · Σ_{k≥0} Ĉ^k.

Then |dl_ρ| ≤ [M]_ρ for every ρ > N1. Hence for every P47 label r (and the fiber-smooth slot r = 1)

    Σ_{μ: μr > N0} |dl_{μr}| ≤ Σ_{μ: N0 < μr ≤ N1} |dl_{μr}|^up + M_r(1),          (e_q-weighted likewise),

where the first sum uses the explicit values of (a) below and M_r(1) is the total of the u^r-coefficient of M at x = 1.

(a) *Explicit part.* For N0 < ρ ≤ N1 (w_ρ = dw_ρ = 0) the recursions of `wol-pd-lemmas.md` Lemma 5.1 (5.6) give
    v_ρ l_ρ = −Σ_{de = ρ, d,e > 1} v_d l_d w_e,   v_ρ dl_ρ = −Σ_{de = ρ} v_d (dl_d w_e + l_d dw_e);
since w_e = 0 for e > N0 and every S235 label is ≥ 7, every pair has e ≤ N0 and d = ρ/e ≤ N1/7 = N0: one level, all inputs are base
labels. The engine evaluates these sums in complex ball arithmetic (`ext_rec` in `tmp/r7-engine-c/r7maj.c`) from the S235 Taylor-model
enclosures (centre, variation) over the box × pieces, with v_d = log d in arb-certified intervals.

*Proof of the bound.* (i) exp(L) = W and W_ρ = 0 for ρ > N0. Put A := exp(L_≤). exp(L) = A·exp(L_>) and exp(L_>) − 1 is supported on
ρ > N1, so W − A = A(exp(L_>) − 1) is supported on ρ > N1, where W = 0: W − A = −[A]_{>N1}. Hence
    exp(L_>) − 1 = W A^{−1} − 1 = (W − A) exp(−L_≤) = −C,    C := [A]_{>N1} exp(−L_≤).
(ii) dL = dW/W and W = A exp(L_>) give exp(L_>) dL = dW exp(−L_≤) =: B. For ρ ≤ N1, [B]_ρ = [exp(L_>) dL]_ρ = dl_ρ, so
B = dL_≤ + [B]_{>N1}, and dL = B − (exp(L_>) − 1) dL = B + C dL. C is supported on ρ > N1, so restricting to ρ > N1:
    dL_> = [B]_{>N1} + C dL_≤ + C dL_>,   hence   dL_> = ([B]_{>N1} + C dL_≤) Σ_{k ≥ 0} C^k
(a finite sum at each coefficient, since C^k is supported on ρ > N1^k). (iii) Coefficientwise |exp(±L_≤)| ≤ exp(|L_≤|) ≤ E, so
|[A]_{>N1}| ≤ [E]_{>N1}, |C| ≤ Ĉ, |[B]_{>N1}| ≤ [dŴ E]_{>N1} = B̂, |dL_≤| ≤ d̂l; therefore |dL_>| ≤ M. (iv) M is supported on ρ > N1, so its
u^r-coefficient at x = 1 bounds Σ_{μ: μr > N1}|dl_{μr}| directly; the remaining tail N0 < μr ≤ N1 is explicit. ∎

*Computation (CERTIFIED).* `Piece.tails_x`: heads of E and dŴ·E on the extended S235 structure up to N1 (`tmp/r7-engine-xstruct.py`:
1,289,844 labels, 3,899,051 ordered pairs; `maj_exp`, `maj_conv`, downward); totals at x = 1 on the P47 u-structure with dual numbers
(`maj_exp_d` for exp(Σ_{r>1} λ_r u^r) times the dual scalar e^{λ_1}, `maj_conv_d`, `maj_inv_d`, upward), the u^0 part of Ĉ (c0 < ½ asserted)
handled as a dual scalar; far parts = totals − heads per label (`dual_agg`). The engine takes, per label and per (label, q), the minimum of
Lemma X and the two Lemma-T centrings.

*Validation (MEASURED, float truth).* `tmp/r7-engine-val1.py` recomputes the true tails dl_{μr} (μr ≤ 49 N0, float recursion) at the
central point of cells 360 (θ_s = 0) and 300 (θ_s = (0.15, −0.3, 0.4)): no label with true tail above the Lemma-X bound or the
Lemma-T bound, per label and per (label, q); maximal ratios true/bound 0.82 (T_r) and 0.69 (τ_{r,q}) for Lemma X.

*Effect.* Labels' τ (probe +, cell 360): Lemma T (product form, μ = 1 centring) 0.0434; Lemma X 0.0393 (explicit part 0.0145 + far
0.0248); per-label-q minimum 0.0383; true 0.0188. The far part beyond 7 N0 remains ≈ 5× the truth (0.0042): the exponential form
removes the ordered-factorisation overcounting but not the log-structure cancellation inside [dW·exp(−L_≤)]_{>N1}. Point bounds of
the full engine with Lemma X (MEASURED): cell 300 +0.0215 → +0.0179, cell 520 +0.0418 → +0.0368, cell 360 +0.0365 → +0.0308.

**2.3 Corollary X′ (explicit coefficients as head coefficients; engine v4).** The coefficients Y_{μr} with N0 < μr ≤ N1 are known
with enclosures: Y_ρ = ½(dl_ρ^+ e^{i a log ρ /2} + dl_ρ^− e^{−i a log ρ /2}) with dl_ρ^± from Lemma X(a) (balls over the box × pieces,
both probes) and the phase over the a-piece (centre at a_c, radius (log ρ /2)·DA). Lemma F(c) sums over all μ, so these coefficients
may be added to the head set of every label in Lemma Q′ (and of the fiber-smooth slot in the exact K0 terms), and then only the part
μr > N1 of the tails is needed: M_r(1) of Lemma X. Lemma Q′ and its proof are unchanged (they apply to any finite set of coefficients
with enclosures). Engine v4 (`XQ = True`) does this; engine v3 (pilot round 3) keeps the explicit part inside the tail cone.
Validation (`tmp/r7-engine-val2.py`): the 530,692 explicit joint coefficients agree with the float recursion to 3·10^{−22} with radii
≈ 10^{−17} at a near-point box (cells 360 at θ_s = 0 and 300 at θ_s = (0.15, −0.3, 0.4)); no coefficient outside its ball.
MEASURED effect (central boxes): cell 300 +0.0179 → +0.0149 (point), 520 +0.0368 → +0.0343, 360 +0.0308 → +0.0281.

---

## 3. Lemma G (|g| on the fiber polydisc)

For x in the closed polydisc |x_q| ≤ 1:

    max(1 − γ̂, Π_q min_{|ζ|=1} |F_q(ζ)| − |D_g|^(1)) ≤ |g(x)| ≤ 1 + γ̂,    γ̂ := Σ_{μ > 1} |w_μ|^up.

*Proof.* |g − 1| ≤ Σ |w_μ||x^μ| ≤ γ̂. For the second lower bound: |g(x)| ≥ Π_q |F_q(z0_q x_q)| − |D_g(x)|, the minimum of
|F_q| over the closed disc is attained on the circle (F_q zero-free, minimum modulus principle) and is phase-invariant,
and |D_g(x)| ≤ |D_g|^(1). ∎

The engine computes min_{|ζ|=1}|F_q| with `poly_min_circle` (grid of 2^14 points + Lipschitz term + coefficient radii) and
asserts the lower bound g_lo > 0.3. Consequences: g is zero-free on the closed polydisc (Lemma F applies), and

    H^s(θ_l) := log|g^s(1)| − log|g^s(x)|  ∈  [Hmin^s, ∞),    Hmin^s := log g0lo^s − log(1 + γ̂^s),

where g0lo^s ≤ |g^s(1)| is the r6 enclosure of g at θ_l = 0 (S235 labels with the displacement phase over the a-piece).
H^s is the r6 *fiber factor*: 1/|g^s(x)| = e^{H^s(θ_l)}/|g^s(1)|. The r6 separable upper bound H^s ≤ Σ_q h_q^s(θ_q)
(one-prime terms of −Re Σ_μ l_μ z0^μ (x^μ − 1), mixed monomials by the weighted Cauchy–Schwarz (1 − cos ψ) ≤ Ω Σ e_q(1 − cos θ_q)
and |sin ψ| ≤ Σ e_q |sin θ_q|, tail cone with htau) is used unchanged; Hmax^s := Σ_q max_θ (h_q^s)^+.

---

## 4. Lemma Q′ (labels: Re/Im split, refined denominator, per-label choice)

Fix a box B ∋ θ_s and a P47 label r; write X0 := X_r^{β̄}(θ_s, 0) (the label at θ_l = 0, with the β̄-part of §5 inside),
X0c its Taylor-model centre over B, X0v ≥ |X0 − X0c| over B, σ_t := X0/|X0|, σ_c := X0c/|X0c|,
ε := 2 X0v/|X0c| (≥ |σ_t − σ_c|; capped at 2). For the head coefficients Y_μ := Y_{μr}(θ_s) (μ > 1, μ r ≤ N0) let
Y_{μ,c} be their centres, vY_μ ≥ |Y_μ − Y_{μ,c}|, |Y_μ|^up ≤ |Y_{μ,c}| + vY_μ, p_μ := conj(σ_c) Y_{μ,c},
rp_μ := ε |Y_μ|^up + vY_μ (+ rounding), and Δ := Σ_μ Y_μ (x^μ − 1) (head only).

**Lemma Q′.** (i) Re(conj(σ_t) Δ) ≤ Σ_μ [ (−Re p_μ + rp_μ)(1 − cos ψ_μ) + (−Im p_μ) sin ψ_μ + rp_μ |sin ψ_μ| ].
(ii) |Im(conj(σ_t) Δ)| ≤ Σ_μ [ |Re p_μ| |sin ψ_μ| + (|Im p_μ| + rp_μ) |x^μ − 1| ].
(iii) Re(conj(σ_t) Δ) ≥ −D_r, D_r := min( Σ_μ [2 (Re p_μ)^+ + |Im p_μ| + 2 rp_μ],  2 Σ_μ |Y_μ|^up ).
(iv) If den_r := |X0|^lo − D_r > 0 (|X0|^lo := |X0c|(1 − 4U) − X0v), then
     |X0 + Δ| ≤ |X0| + Re(conj(σ_t)Δ) + (Im(conj(σ_t)Δ))² / (2 den_r).
(v) With a_{r,q} := Σ_μ e_q(μ)|Re p_μ|, b_{r,q} := Σ_μ e_q(μ)(|Im p_μ| + rp_μ), any positive weights λ_q and
    S_r := Σ_q (a_{r,q} + b_{r,q})/λ_q:
     (Im(conj(σ_t)Δ))² ≤ S_r Σ_q λ_q ( a_{r,q} sin²θ_q + b_{r,q} |η_q|² ).

*Proof.* conj(σ_t) Y_μ = p_μ + δ_μ with |δ_μ| ≤ |σ_t − σ_c||Y_μ| + |Y_μ − Y_{μ,c}| ≤ rp_μ. Re(p(x^μ − 1)) = −Re p (1 − cos ψ) −
Im p sin ψ, Im(p(x^μ − 1)) = Re p sin ψ − Im p (1 − cos ψ), |δ(x^μ − 1)| ≤ rp |x^μ − 1| ≤ rp((1 − cos ψ) + |sin ψ|), and
1 − cos ψ ≤ |x^μ − 1| (|x^μ − 1| ≤ 2): (i), (ii). (iii): termwise lower bounds −Re p(1 − cos ψ) ≥ −2(Re p)^+, −Im p sin ψ ≥ −|Im p|,
δ-term ≥ −2rp; and Re(conj σ_t Δ) ≥ −|Δ| ≥ −2Σ|Y_μ|. (iv): |X0 + Δ|² = (|X0| + Re(conj σ_t Δ))² + (Im(conj σ_t Δ))² and
√(A² + B²) ≤ A + B²/(2A) ≤ A + B²/(2 den) for A ≥ den > 0 (A = |X0| + Re(conj σ_t Δ) ≥ |X0|^lo − D_r). (v): by (ii) and
|sin ψ_μ| ≤ Σ_q e_q |sin θ_q|, |x^μ − 1| ≤ Σ_q e_q |η_q|, |Im(·)| ≤ Σ_q (a_q x_q + b_q y_q) with x_q = |sin θ_q|, y_q = |η_q|;
Cauchy–Schwarz with weights w_q = (a_q + b_q)/λ_q gives (Σ_q z_q)² ≤ (Σ w_q)(Σ z_q²/w_q), and
(a x + b y)² ≤ (a + b)(a x² + b y²). ∎

**Assembly per label.** For a *regular* label (den_r > 0.02|X0c|), (i) gives one-prime terms for μ = q^k
(coefficients of 1 − cos kθ_q, sin kθ_q, |sin kθ_q|) and, for mixed μ, (1 − cos ψ) ≤ Σ_q (e_q²/ω_q)(1 − cos θ_q)
(weighted Cauchy–Schwarz, Σ_q ω_q = 1) applied to max(−Re p + rp, 0) and |sin ψ| ≤ Σ_q e_q|sin θ_q| applied to |Im p| + rp;
(iv)–(v) give the quadratic terms (S_r/(2 den_r)) λ_q a_{r,q} sin²θ_q and (S_r/(2 den_r)) λ_q b_{r,q} · 4 sin²(θ_q/2).
For any other label, |X0 + Δ| ≤ |X0| + Σ_q (Σ_μ e_q|Y_μ|^up)|η_q| (cone). **Either treatment is valid for every label**,
so the choice may be made per label by any rule; the engine estimates both contributions at θ_q = 1 (all q) and keeps
the smaller. λ_q := √(a_est,q) with a_est,q the decrease rate of the K0 one-prime coefficient (any positive numbers are valid).

*Difference from r6.* r6 used the full |Δ|² ≤ (Σ_q (Σ_μ e_q|Y_μ|)|η_q|)² in (iv) (so the quadratic term grew like 4 sin²(θ/2),
maximal at θ = π) and den = |X0|^lo − 2Σ|Y_μ|, and a fixed regularity rule. (ii) replaces 4 sin²(θ/2) by sin²θ on the dominant
|Re p| part (vanishing at θ = π); (iii) enlarges den; the per-label choice removes labels whose Lemma-Q quadratic term
exceeds their cone. MEASURED effect at cell 320 (r_49_100), point box: +0.0547 → +0.0359 from the per-label choice alone.

---

## 5. Lemma B (β-terms kept inside the labels)

Recall X̃_r = X_r + ½ β^+ w_r^+ ph_r + ½ β^− w_r^− conj(ph_r) (`wol-pd-lemmas.md` (0.2)). r6 used
|X̃_r| ≤ |X_r| + ½ Σ_s β^s |w_r^s| and charged ½ Σ_s β^s Wn^s to the extra part. For any real β̄ put
X_r^{β̄} := X_r + ½ β̄ (w_r^+ ph_r + w_r^− conj(ph_r)).

**Lemma B.** (a) If β̄ ≤ β^s(θ) for both probes and all θ in the region, then
    Σ_r |X̃_r(θ)| ≤ Σ_r |X_r^{β̄}(θ)| + ½ Σ_s (β^s(θ) − β̄) Wn^s(θ).
(b) X_r^{β̄}(θ) − X_r^{β̄}(θ_s, 0) = Σ_{μ > 1} Y_{μr}(x^μ − 1) + ½ β̄ Σ_s (w_r^s(θ) − w_r^s(θ_s, 0)) ph_r^s, and with the
    centring c_r^s = w_r^s(θ_s, 0) of §1 (E_r^s(1) = 0),
    Σ_r |½ β̄ Σ_s (w_r^s(θ) − c_r^s) ph_r^s| ≤ ½ β̄ Σ_s (Σ_q ε_q^s |η_q|)/g_lo^s,   ε_q^s := Σ_r Σ_μ e_q(μ) ê^s_{μr}
    (all μ, including the beyond-N0 coefficients of §1.4), g_lo^s the lower bound of Lemma G.
(c) For every θ_l: β^s(θ) ≥ B2a^s(θ) ≥ (Σ_{r≥1} max(0, |dwp_r^s(θ_s,0)|^lo g0lo^s − V_r^s)) / (1 + γ̂^s) =: B2alo^s with
    V_r^s := 2 Σ_{μ>1} |dwp_{μr}|^up + 2 Zh^s Σ_μ |wp_{μr}|^up, Zh^s := Σ_{μ>1}|dl_μ|^up + T_0^s ≥ sup|z^s|.

*Proof.* (a) X̃_r = X_r^{β̄} + ½ Σ_s (β^s − β̄) w_r^s ph_r^s and the triangle inequality. (b) The first part is Lemma F(c) for
X_r and linearity; w_r^s(θ) − c_r^s = E_r^s(x)/g^s(x) (Lemma F(a) and the definition of E), |E_r(x)| = |Σ_μ e_{μr}(x^μ − 1)| ≤
Σ_q (Σ_μ e_q(μ)|e_{μr}|)|η_q|, |g(x)| ≥ g_lo. (c) β = (1 + 10^{−12}) B2/(1 − Wn²) ≥ B2 = B2a + A2(KL + tl_full) ≥ B2a. By Lemma F(a),
dwp_r = A_r(x)/g(x) with A_r := dnp_r − np_r z; |A_r(1)| = |dwp_r(θ_s,0)||g(1)|, and |A_r(x) − A_r(1)| ≤ |dnp_r(x) − dnp_r(1)| +
|np_r(x)||z(x)| + |np_r(1)||z(1)| ≤ V_r; |g(x)| ≤ 1 + γ̂ (Lemma G). ∎

The engine uses β̄ := min_s B2alo^s (a uniform lower bound, so (a) applies on the whole fiber torus), evaluates the main
part with β̄ inside the labels (the r6 Taylor-model export already supports a constant β inside the labels; `Piece.export47`),
uses X0 = X_r^{β̄}(θ_s, 0) in Lemma Q′, adds the cone of (b) to the per-q first-order coefficients, and puts
½ Σ_s (β^s − β̄) Wn^s into the extra-part function of §6 (it is increasing in every norm, because β^s ≥ β̄).

MEASURED: β̄ ≈ 0.26 β^s(θ_s, 0) at the central boxes (the uniform lower bound (c) is crude); the gain from Lemma B is
0.001–0.002, not the heuristic 0.0075 (which assumed β̄ = β at no cost). A larger β̄ (point value) needs a lower bound of
β^s along the fiber torus; its first-order cost (the fiber variation of the reflected norms) was estimated to cancel the
gain at the late cells and was not implemented.

---

## 6. The extra part: per-label slopes (Lemma N), the per-probe function F_s, two-sided chords (Lemma C)

The extra part of Φ_E is E_tot(θ) = T2 + ½ Σ_s (β^s + hi^s + tl^s) + [Lemma B term] ½ Σ_s (β^s − β̄) Wn^s. Per probe s put
ν^s(θ_l) := e^{H^s(θ_l)} ∈ [e^{Hmin^s}, e^{Hmax^s}] (§3).

**Lemma N (per-label slopes).** For every P47 label r and every θ_l,
    |w_r^s(θ)| ≤ Wsl_r^s ν^s(θ_l),   Wsl_r := min( Σ_μ |w_{μr}|^up / g0lo,   min_{(c,dc)} [ |c_r|^up / ν_min + Ê_r(1)/g0lo ] ),
    |dw_r^s(θ)| ≤ dWsl_r^s ν^s(θ_l),  dWsl_r := min( (Σ_μ |dw_{μr}|^up + Zh Σ_μ |w_{μr}|^up)/g0lo,  min_{(c,dc)} [ |dc_r|^up/ν_min + (dÊ_r(1) + Ê_r(1) Zh)/g0lo ] ),
    A2^s(θ) ≤ A2reg ν,  A2reg := Σ_{all ρ} |wp_ρ|^up / g0lo;    B2a^s(θ) ≤ B2reg ν,  B2reg := (Σ_ρ |dwp_ρ|^up + Zh Σ_ρ |wp_ρ|^up)/g0lo;
    KL^s(θ) ≤ KLu := Σ_{ρ: r(ρ)>1} |dl_ρ|^up + Σ_{r>1} T_r     (θ_l-uniform),
where ν_min = e^{Hmin}, the inner minimum runs over the two centrings used by the engine, (c_r, dc_r) = (w_r^{(47)}, dw_r^{(47)})(θ_s, 0)
and (c_r, dc_r) = (w_r^{(235)}, dw_r^{(235)})(θ_s) (the μ = 1 coefficients), and Ê, dÊ are the corrected majorant totals of §1.4 for that centring.

*Proof.* Lemma F(a): w_r = n_r/g, |n_r(x)| ≤ Σ_μ|w_{μr}|, 1/|g(x)| = ν/|g(1)| ≤ ν/g0lo. Second form, for any constants (c_r, dc_r):
w_r(θ) = c_r + E_r(x)/g(x) with |E_r(x)| = |Σ_μ e_{μr} x^μ| ≤ Ê_r(1), and |c_r| ≤ |c_r| ν/ν_min because ν ≥ ν_min. For dw_r: from Lemma F(a),
dw_r(θ) − dc_r = (dE_r(x) − E_r(x) z(x))/g(x) (insert n_r = c_r g + E_r, dn_r = dc_r g + c_r dg + dE_r; c_r dg − c_r g z = 0), valid for any
constants; |dE_r(x)| ≤ dÊ_r(1), |z| ≤ Zh.
A2, B2a: Lemma F(a) for wp, dwp and |np_r|, |dnp_r| ≤ numerator ℓ¹ sums. KL: Lemma F(b), |dl_r^{(47)}(x)| ≤ Σ_μ |dl_{μr}|
(head ≤ N0 plus tail ≤ T_r). ∎

Taking the minimum per label is valid since each form is an upper bound times the same ν. The first form is the r6
regional bound; the second is new (it is tighter where the multiplicativity defect is small).

**The function F_s.** For ν > 0 let W := Wsl ν, dW := dWsl ν (vectors over the P47 labels), Wn := Σ_r W_r, tl_full := 𝒯(W, dW),
tl := 𝒯_{>D}(W, dW) (the label-tail functional of Lemma 4.2 of `wol-pd-lemmas.md`, binned exactly as in Φ_E), A2 := A2reg ν,
B2a := B2reg ν, KL := KLu, B2 := (1+10^{−12})(B2a + A2(KL + tl_full)), β := (1+10^{−12})B2/(1 − Wn²), V := A2/(1 − Wn),
dV := B2/(1 − Wn), hi := dV V/(1 − V), T2 := ½ Σ_{d ≤ D} Σ_{e > N0/d, e ≠ d} (W_d dW_e + dW_d W_e), and

    F_s(ν) := T2 + ½ (β + hi + tl) + ½ (β − β̄)^+ Wn       (defined while Wn < ½ and V < ½).

**Lemma E.** For θ in the region, E_tot(θ) ≤ F_+(ν^+(θ_l)) + F_−(ν^−(θ_l)), and each F_s is nondecreasing and convex on
its domain; hence φ_s(H) := F_s(e^H) is convex and nondecreasing on [Hmin^s, Hmax^s].

*Proof.* Each ingredient of Φ_E's extra part is a nondecreasing function of the label moduli and norms of its probe
(`wol-pd-lemmas.md` Lemma 4.1 and Lemma 4.2), and T2 ≤ ½ Σ_s Σ_pairs (|w_d^s||dw_e^s| + |dw_d^s||w_e^s|); substitute the bounds of
Lemma N. Convexity in ν: T2 is a quadratic form with nonnegative coefficients in ν; 𝒯(ν·, ν·) is a sum of terms c_k ν^k
(k ≥ 2, c_k ≥ 0) plus ν^{KMAX+1} c/(1 − ν c'), each convex nondecreasing for ν c' < 1; B2 is ν times a nondecreasing convex
function; 1/(1 − Wn²) and 1/(1 − Wn) are convex nondecreasing; products and sums of nonnegative nondecreasing convex
functions are nondecreasing and convex ((fg)'' = f''g + 2f'g' + fg'' ≥ 0); (β − β̄)^+ is convex nondecreasing. A convex
nondecreasing function of e^H is convex in H. ∎

**Lemma C (per-probe two-sided chord).** Let f0 ≥ φ_s(0), f+ ≥ φ_s(Hmax), f− ≥ φ_s(Hmin) (computed upper bounds) and
κ+ := (f+ − f0)/Hmax, κ− := max(0, (f0 − f−)/(−Hmin)), κ+ := max(κ+, κ−). Then for every H ∈ [Hmin, Hmax]
    φ_s(H) ≤ f0 + κ− H + (κ+ − κ−) H^+,
and for any upper bound Ĥ ≥ H, the right side with Ĥ in place of H is an upper bound as well.

*Proof.* Convexity: for H ∈ [0, Hmax], φ(H) ≤ (1 − t)φ(0) + tφ(Hmax) ≤ f0 + t(f+ − f0), t = H/Hmax; for H ∈ [Hmin, 0],
φ(H) ≤ f0 + (H/Hmin)(f− − f0) = f0 + H (f0 − f−)/(−Hmin); if (f0 − f−) < 0 (rounding), use φ(H) ≤ φ(0) ≤ f0 (monotone) with
κ− = 0. The right side is nondecreasing in H because κ− ≥ 0 and κ+ − κ− ≥ 0. ∎

With Ĥ^s = Σ_q h_q^s(θ_q) (§3) and (Σ_q h_q)^+ ≤ Σ_q h_q^+:

    E_tot(θ) ≤ Σ_s f0^s + Σ_q Σ_s [ κ−^s h_q^s(θ_q) + (κ+^s − κ−^s) (h_q^s(θ_q))^+ ].                              (6.1)

**Lemma T2 (T2 as point value plus a first-order cone).** Let c_r^s = w_r^s(θ_s, 0), dc_r^s = dw_r^s(θ_s, 0) (so E_r(1) = dE_r(1) = 0) and
ε_{r,q} := Σ_μ e_q(μ) ê_{μr}, dε_{r,q} := Σ_μ e_q(μ) dê_{μr} (corrected majorant coefficients of §1.4, all μ). Then for every θ_l

    T2(θ) ≤ T2_0 + Σ_q C_q |η_q|,    T2_0 ≥ Σ_{d ≤ D} Σ_{e > N0/d, e ≠ d} |X_{de}(θ_s, 0)|   (joint value, both probes, label phases),

    C_q := Σ_s (ν_max^s / (2 g0lo^s)) Σ_{pairs} [ |c_d| (dε_{e,q} + Zh ε_{e,q}) + ε_{d,q} |dc_e| + uW_d (dε_{e,q} + Zh ε_{e,q})
                                                 + |dc_d| ε_{e,q} + (dε_{d,q} + Zh ε_{d,q}) |c_e| + udW_d ε_{e,q} ],

with ν_max = e^{Hmax}, uW_d = 2 ν_max Ê_d(1)/g0lo, udW_d = 2 ν_max (dÊ_d(1) + Ê_d(1) Zh)/g0lo.

*Proof.* X_{de} = −½ Σ_s (w_d dw_e + dw_d w_e) ph_d ph_e. Write w_r = c_r + Δw_r, dw_r = dc_r + Δdw_r with Δw_r = E_r(x)/g(x),
Δdw_r = (dE_r − E_r z)/g (proof of Lemma N). Since E_r(1) = 0, |E_r(x)| = |Σ_μ e_{μr}(x^μ − 1)| ≤ Σ_q ε_{r,q}|η_q|, likewise dE_r,
and 1/|g(x)| ≤ ν/g0lo ≤ ν_max/g0lo. X_{de}(θ) − X_{de}(θ_s, 0) consists of terms with one or two increments; in a term with two
increments bound one factor uniformly (|E_r(x)| ≤ 2Ê_r(1)). Sum over pairs. ∎

The engine evaluates the full bound twice: variant A (T2 inside F_s, regional) and variant B (T2 removed from F_s, T2_0 added to the
constant and C_q to the first-order coefficients c2_q), and keeps the smaller; both are valid upper bounds, and the inherited constant
for sub-boxes is taken from the variant used. MEASURED: T2_0 ≈ 0.0017–0.0050 against the regional 0.0051–0.0061; variant B wins at the
early cells and at 320–360, variant A at 520–579.

*Difference from r6.* r6 used one chord κ for max_s H^s, applied to (max_s h_q^s)^+, with all norms (and T2) regional and the
β-term β Wn outside the labels. At θ_s = 0 the two probes are mirror images (h_q^−(θ) = h_q^+(−θ)), so the per-probe linear
part κ− h_q^s is even after summation over s, whereas max_s h_q^s carries the first-order odd part of h_q; and κ+^s − κ−^s is
the convexity excess only. MEASURED at cell 360, probe +: κ+ = 0.058, κ− = 0.044 per probe vs r6's single κ = 0.113 on the max.

---

## 7. Theorem 7.1 (the r7 box bound)

Fix an entry E (P47 structure, time cell [t_lo, t_hi], displacement range [a_lo, a_hi]) and a box B = θ_c + [−δ, δ] in the
angles of the primes 2, 3, 5. Suppose, valid for every θ_s ∈ B, t ∈ [t_lo, t_hi], a ∈ [a_lo, a_hi] and both probes:

* (A1) the r6 Taylor-model enclosures of the P47 structure at θ_l = 0 (K0, Σ_r |X_r^{β̄}|, per-label centres/variations of
  w, dw, wp, dwp and of X_r^{β̄}) and of the S235 structure (per-label centres/variations of w, dw, wp, dwp, l, dl, joint labels
  Y_ρ) over B × pieces (`libr6tm2`, CERTIFIED in r6);
* (A2) the hypotheses of Lemmas PF and G (Σ_k |w_{q^k}| < 1 with an admissible ρ, D̂(1) < ½, g_lo > 0.3, g0lo > 0.3);
* (A3) the tail totals and heads of §1–§2 computed with directed rounding (T_r, τ_{r,q} per probe and label: minimum of Lemma T for
  two centrings, Lemma T0 and Lemma X; slot 0 by Lemma T00 / T0 / X); in engine v4 the explicit coefficients of Lemma X(a) are head
  coefficients (Corollary X′) and only the far part M of Lemma X enters the cones;
* (A4) the label data of Lemma Q′ and the regularity choice; the β̄ of Lemma B(c); the slopes and norms of Lemma N;
  the chords of Lemma C with Wn < ½, V < ½ at ν = e^{Hmax};
* (A5) the grid maxima: for each q ∈ F the function g_q(θ) := f_q(θ) + Σ_s [κ−^s h_q^s(θ) + (κ+^s − κ−^s)(h_q^s(θ))^+], with

      f_q(θ) = Σ_{k ≤ 7} [α_{q,k}(1 − cos kθ) + β_{q,k} sin kθ + γ_{q,k}|sin kθ|] + MqS_q sin²θ + MqE_q 4 sin²(θ/2)
               + c2_q 2|sin(θ/2)| + cabs_q |sin θ| + c1m_q (1 − cos θ),

  is maximised on the grid of 4097 points with the Lipschitz allowance of f_q (h_q^s is pre-inflated by its own
  allowance, so the grid values of the h-part already dominate its values between grid points).

Here α, β, γ, cabs, c1m collect the K0 one-prime and mixed terms (Lemma F(c), exact Fourier coefficients −Re Y_μ … as in
r6) and the label linear terms of Lemma Q′(i); MqS, MqE the quadratic terms of Lemma Q′(iv)–(v); c2_q := τ_q (tails, both
slots, averaged over probes) + Σ_{irregular r} Σ_μ e_q(μ)|Y_{μr}|^up (cones) + ½β̄ Σ_s ε_q^s/g_lo^s (Lemma B(b)) [+ C_q of
Lemma T2 in variant B, whose constant f0 excludes T2 and the bound below adds T2_0].

**Theorem 7.1.** Under (A1)–(A5),

    sup { Φ_E(θ_s, θ_l; t, a) : θ_s ∈ B, θ_l ∈ T^F, t, a in the pieces }
        ≤ U(B) := max_B [K0 + Σ_r |X_r^{β̄}|](θ_s, 0) + Σ_s f0^s + Σ_{q ∈ F} max_θ g_q(θ),

and for every sub-box B′ ⊂ B, U(B′) may be replaced by max_{B′}[K0 + Σ_r|X_r^{β̄}|](θ_s, 0) + Σ_s f0^s + Σ_q max g_q with
the constants of B (same β̄).

*Proof.* Fix θ = (θ_s, θ_l) and (t, a). Φ_E = K0 + Σ_r |X̃_r| + E_tot. Lemma B(a): Σ_r|X̃_r| ≤ Σ_r |X_r^{β̄}| + ½Σ_s(β^s − β̄)Wn^s,
the last term belongs to F_s (Lemma E). Lemma F(c) and Lemma B(b): K0(θ) = K0(θ_s,0) − Re Σ_μ Y_μ(x^μ − 1) and
X_r^{β̄}(θ) = X_r^{β̄}(θ_s, 0) + Δ_head + Δ_tail + Δ_β̄. The K0 variation is bounded by its one-prime terms exactly and its mixed
terms by the weighted Cauchy–Schwarz and |sin| bounds (dropping negative (1 − cos ψ) coefficients), its tail μ > N0 by the
slot-0 cone; each label by |X0 + Δ_head| + |Δ_tail| + |Δ_β̄| with Lemma Q′ (regular) or the cone (other), Lemma T (tails;
|Δ_tail| ≤ Σ_q (Σ_μ e_q|Y_{μr}|)|η_q| and Σ_r Σ_μ e_q |Y_{μr}| ≤ ½ Σ_s τ_q^s) and Lemma B(b). Summing over labels, the label parts
are ≤ Σ_r |X0_r| + Σ_q f_q(θ_q) − (K0 part already in f_q). The extra part is ≤ (6.1). All enclosures hold for every θ_s ∈ B
and (t, a) in the pieces (A1), so the sum is ≤ U(B), using Σ_q max g_q ≥ max over θ_l of Σ_q g_q(θ_q). For B′ ⊂ B every
bound used for the fiber part and the extra part remains valid on B′, and β̄ ≤ β^s holds on B′. ∎

**Corollary 7.2 (WOL-C margin).** If boxes B_1, …, B_n cover [0, π] × [−π, π]² (θ_2 ∈ [0, π] suffices by Φ_E(−θ) = Φ_E(θ),
`outer-lemma-weak.md` §2.1) then K^sup(E) ≤ max_i U(B_i) and m(E) := max_i U(B_i) − K0*(E) is a certified WOL-C margin for E
(OW-Lemma 1 admits floor_str(E) − m(E)(1 + 10^{−12})).

---

## 8. Implementation map and grading

| item | statement | code (`tmp/r7-engine-cert.py`) |
|---|---|---|
| Lemma F | fiber factorization | data layout `Piece.__init__` (j47, i5mu, El), `w47`-labels from `te47` |
| Lemma T, T1 | corrected defect tails | `Piece.tails_defect` (block "r6 referee fix"; `pf` argument) |
| Lemma T0 | plain tails, slot 0, htau | `Piece.tails` (unchanged r6) |
| Lemma PF, T00 | product form of 1/g; slot-0 tails | `Piece.prodG`; slot-0 block in `bound` |
| Lemma G | |g| on the polydisc | `Piece.g_bounds`; `g0lo` block in `bound` |
| Lemma Q′ | labels | "labels: refined Lemma Q" block in `bound`; per-label choice (`RTH = −1`) |
| Lemma B | β̄ inside labels | `B2alo`, `bb`, `export47(bb)`, `cbeta` |
| Lemma N, E, C | extra part | `Wu`, `dWu`, `KLu`, `A2reg`, `B2reg`, `F(nu)`, `kap` |
| Lemma T2 | T2 point + cone (variant B) | `Piece.t2_point_cone`; variants A/B in `bound` |
| Lemma X, X′ | explicit extension to 7 N0, exponential far bound; explicit coefficients in Lemma Q′ | `Piece.tails_x`, `ext_rec`/`maj_exp(_d)`/`dual_agg` in `tmp/r7-engine-c/r7maj.c`; `USEX`, `XQ` |
| Theorem 7.1 | box bound | `Piece.bound` (returns U and (F, β̄) for sub-boxes) |
| Corollary 7.2 | cover | `bnb_bf7` (best-first, checkpoints), `tmp/r7-engine-pilot.py`, `tmp/r7-engine-cover.py` |

The structure-gap bound `Piece.gap_bound` (r6, unchanged except that it now calls the corrected `tails_defect`) is an
alternative valid bound used by the branch and bound when it is smaller: by Lemma F and the triangle inequality,
K0 + Σ_r |X_r| ≤ K0^{(235)} + Σ_ρ |Y_ρ| + Σ_j T_j^Y for all θ_l, with θ_l-uniform norms num/(1 − γ̂) in the extra part.

**Rounding.** The r7 code follows the r6 conventions: every floating-point sum of n nonnegative terms is inflated by
(1 + 2·10^{−10}) (n ≤ 10^6), products by (1 + 4U)–(1 + 16U), the C majorant recursions run with directed rounding, and the
Taylor-model engine folds all rounding into its remainders. These are CERTIFIED (single implementation, not audited line by
line), exactly as the r6 engine's grading. The arb inputs (coefficients a_n(t), P_n(t), log n, label phases) are the r2/r6
FLINT/arb programs. The 10^{−9} admission pad of the r6 synthesis is kept outside this note.

**What is PROVED here (written, unrefereed):** Lemma F (restated), Lemma T and T1 (the corrected tail bound), T0, PF, T00, X, X′,
G, Q′, B, N, E, C, T2, Theorem 7.1, Corollary 7.2, and the validity of continuing a checkpoint with another engine version or in
parallel parts (§9.1). **CERTIFIED (computer-assisted, single implementation, in-session):** the 13 pilot margins of §9.3 and the
consumer value 0.146623578252049 built on them. **Not established:** an independent second implementation; a non-author referee of
this note.

---

## 9. Pilot (r7: engines v3, v3c, v4c) and survey

### 9.1 Engines

| version | file (frozen copy) | content | sha256 (first 16) |
|---|---|---|---|
| v1 | `tmp/r7-engine-cert-v1.py` | Lemma T1 (fix) + PF + Q′ + B + N/E/C (aborted after 20 min) | 739f69bdf864e64d |
| v2 | `tmp/r7-engine-cert-v2.py` | v1 + μ = 1 centring + Lemma N factor 1 + T2 (aborted after 25 min) | e82f3d816fd73591 |
| v3 | `tmp/r7-engine-cert-v3.py` + `libr7maj-v3.dylib` | v2 + Lemma X (per label / per q minimum) — **pilot engine** | ad9c3b3b520dcffb at launch; 73cf31008f726007 now (see note) |
| v3b | `tmp/r7-engine-cert-v3b.py` | v3; an exception inside one box evaluation gives that box an infinite bound (no bound value changes) | 8468faa24cd7dcf6 |
| v4 | `tmp/r7-engine-cert-v4.py` | v3 + Corollary X′ (`XQ = True`) — survey engine | ed5ac47df3868732 |
| v3c | `tmp/r7-engine-cert-v3c.py` | v3b + octree split (all three axes halved) of boxes whose bound exceeds the target by > 0.03; same box bounds as v3 — **used to continue every pilot run from its v3 checkpoint (after ≈ 1 h)** | 0587a1ebb3cdfe2f |
| v4c | `tmp/r7-engine-cert-v4c.py` | v4 box bounds (Corollary X′) + the v3c branch and bound — **used for the split continuations of five pilot floors (§9.3) and for the from-scratch runs of §9.6** | 3c5463d1fbff32f4 |

*Note on the v3 hash.* `tmp/r7-engine-cert-v3.py` had sha256 ad9c3b3b520dcffb… when the pilot queue was launched (13:03:28); 8 s later
the frozen file was edited only to load `libr7maj-v3.dylib` instead of `libr7maj.dylib`. The two libraries are byte-identical
(sha256 a28e2624a36ed9b7…, `cmp` checked at the time; built from `r7maj.c` 3cba27bc6d5e3c36…), so the workers started before and after the
edit ran the same code on the same binary; the file now hashes to 73cf31008f726007…. Shared modules, unchanged since before the pilot:
`tmp/r6-fiber-lib.py` 0b8388f6ff15bdf0, `tmp/r6-fiber-l1.py` 450b94c55e85efdc, `tmp/r6-fiber-c/libr6tm2.dylib` d71f5b434d04b147
(`r6tm2.c` 2037855761e8388a), `libr6maj.dylib` 918bd59963d237f3 (`r6maj.c` b6076e554f92e048), `tmp/r7-engine-xstruct.py` f8fe420db10b6871.

*Mixing engines inside one certificate is valid.* A box is accepted when one valid upper bound of sup Φ_E over it is below the target.
The cheap bound of a sub-box B′ ⊂ B is main(B′; β̄) + F with (F, β̄) inherited from B (Theorem 7.1: any constants valid on B with the
same β̄); main(B′; β̄) is computed by the same Taylor-model code (`te47.eval`, `L1.quad_max`) in every engine version, and F computed by
v3 on B is valid on B′ whichever engine evaluates B′. So a v3/v3c checkpoint may be continued with v4c, and its open boxes may be
partitioned among several workers (`tmp/r7-engine-split.py`, `-split2.py`); `tmp/r7-engine-merge.py` assembles the accepted boxes at
split time and the parts' final covers, and the exact cover check is run on the merged certificate.

Driver: `tmp/r7-engine-pilot.py OUTDIR IDX --engine FILE --budget S [--resume]` (best-first branch and bound `bnb_bf7`, initial grid 8 × 12 × 10
of [0, π] × [−π, π]², split axis argmax of δ ⊙ (1, ½, ⅓), checkpoints every 600 s), queue `tmp/r7-engine-queue.sh` (≤ 11 concurrent
workers; `tmp/r7-engine-queue2.sh` caps all r7 workers on the machine), cover check `tmp/r7-engine-cover.py`. Target: WOL-C
0.0223/(1 + 10^{−12}) for cells ≤ 300, 0.050 for cells > 300; a run stops when every leaf is below the target, else at the session budget
(4–10 h per session; a resumed session continues from the checkpoint), and reports the maximum over its final cover.

### 9.2 Validation (MEASURED; necessary checks, not proofs)

* Tails (`tmp/r7-engine-val1.py`): true per-label tails of dl^{(47)} from the float recursion (μr ≤ 49 N0) never exceed the Lemma X or the
  Lemma T bound, per label and per (label, q) (cells 360 at θ_s = 0 and 300 at θ_s = (0.15, −0.3, 0.4)); max ratios true/bound
  0.82 / 0.69 (Lemma X), 0.71 / 0.61 (Lemma T, product form). Repeated after the pilot with the development engine (whose bound code is
  that of v4/v4c) at cells 520 (θ_s = (0.1, −0.2, 0.3)), 579 (θ_s = (0.05, 0.25, −0.15)) and 240 (θ_s = 0)
  (`tmp/r7-engine-out/val/val1_<IDX>.log`): no violation; max ratios 0.84 / 0.72 (Lemma X), 0.76 / 0.65 (Lemma T, product form). The
  truth is truncated at μr ≤ 49 N0, so the ratios are lower estimates of the true ones; the part beyond 49 N0 is small but is not measured.
* Explicit coefficients (`tmp/r7-engine-val2.py`): 530,692 joint Y_ρ (N0 < ρ ≤ 7 N0) inside their balls, centre error ≤ 3·10^{−22}.
* Extra part (`tmp/r7-engine-val3.py`): at 600 sampled fiber points (cells 300 at θ_s = 0, 520 at θ_s = (0.1, −0.2, 0.3)), the true fiber factor
  H^s (from |c_1^s|) stays below Σ_q h_q^s(θ_q) (max excess −6.5·10^{−4}) and the true T2 + ½Σ_s(β + hi + tl) below the variant-A and
  variant-B bounds of (6.1)/Lemma T2 (max excess −0.0044 at cell 300, −0.0109 at cell 520).
* Whole bound (`tmp/r7-engine-sound.py`, `tmp/r7-engine-recheck.py`): the float reference Φ_E (`tmp/r6-falsify-lib.py`, r4/r5 referees'
  replica) sampled at 72–360 points per box (θ_s in the box, fiber angles 0 / small / uniform / per-q argmax, t and a at the piece ends and
  centre) never exceeds the box bound; at the central boxes the gap is 0.018–0.039 (true sup Φ − K0* ≈ −0.002 there, as in r6-falsify).
* Final pilot covers (`tmp/r7-engine-recheck.py OUTDIR IDX 8 ENGINE`; logs `tmp/r7-engine-out/pilot-final/recheck_<IDX>.log` and
  `pilot3-split101/recheck_101.log`): for floors 280 and 440 (engine v3c) and 300, 320 (both floors), 360, 520 (engine v4c) the 8 boxes with
  the largest stored bounds were re-evaluated by a fresh engine instance (full bound and structure-gap bound, no inherited constants). In
  all 56 boxes the fresh bound is ≤ the stored bound, and the sampled float Φ_E stays below K0* (largest sampled Φ − K0* = −0.0025), at
  least 0.0247 below the stored bound. These checks would detect a defect larger than about 0.02 at these boxes; smaller defects are only
  excluded by the component tests above and by the proofs.

### 9.3 Pilot certificates (CERTIFIED: computer-assisted, single implementation, unrefereed)

Floors of `tmp/r6-fiber-out/p47_hybrid.json` at the twelve pilot cells; cell 320 has two hybrid-path floors and both were run (13 floors).
Every run started with engine v3 (queue launched 13:03, at most 11 concurrent workers) and was continued from its v3 checkpoint with v3c
(same box bounds, octree splits; v3c queue launched 14:10). Eight floors finished with v3c. For the other five (300, both 320 floors, 360, 520) the v3c checkpoints of 16:32–16:33 (after
11,400–11,700 s) were partitioned (`tmp/r7-engine-split2.py`, round-robin by bound, 2–3 parts; floor 300 had been split earlier at 9,757 s
with `tmp/r7-engine-split.py` and its central half was split again at 16:38) and the parts were continued with v4c (v4 box bounds;
inherited constants valid by the note in §9.1). Each part finished in 5–20 minutes. The backup continuations in
`tmp/r7-engine-out/pilot3-v4c/` (v4c from older copies of the same checkpoints) were stopped at that point; none of their boxes is used
(`pilot3-v4c/cert_225.json` is a no-op resume of the already final floor-440 checkpoint and duplicates `pilot3/cert_225.json`).

Every margin below is the maximum, over an exact dyadic cover of [0, π] × [−π, π]², of the box bound minus K0*. The cover check
(`tmp/r7-engine-report.py`, same test as `tmp/r7-engine-cover.py`) verifies that every box is an integer dyadic sub-box of the initial grid,
that the boxes are pairwise interior-disjoint, and that their total volume equals the domain volume, all in exact integer arithmetic.
Corollary 7.2 then gives WOL-C for the four early floors (margin ≤ 0.0223/(1 + 10^{−12})) and the stated margin (≤ 0.050) for the nine
late floors. The certificates are `tmp/r7-engine-out/pilot-final/cert_<IDX>.json` (copies of `pilot3/cert_<IDX>.json` and of the merged
`pilot3-split<IDX>/cert_<IDX>.json`), and the report is `pilot-final/report.json`.

| cell | floor | target | certified margin | pass | boxes | evaluations | CPU s | engine path | r6+patch point | r7 v3 point | r7 v4 point |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 240 | 240\|0.94\|r_19_40 | 0.0223/(1+1e-12) | 0.0222739 | yes | 2116 | 5327 | 5382 | v3→v3c | 0.0198 | 0.0064 | 0.0045 |
| 260 | 260\|0.94\|r_19_40 | 0.0223/(1+1e-12) | 0.0221579 | yes | 2913 | 7269 | 7051 | v3→v3c | 0.0250 | 0.0083 | 0.0061 |
| 280 | 280\|0.94\|r_19_40 | 0.0223/(1+1e-12) | 0.0222973 | yes | 4295 | 10866 | 10217 | v3→v3c | 0.0360 | 0.0121 | 0.0095 |
| 300 | 300\|0.94\|r_19_40 | 0.0223/(1+1e-12) | 0.0222994 | yes | 6508 | 17523 | 16524 | v3→v3c→split v4c | 0.0534 | 0.0179 | 0.0149 |
| 320 | 320\|0.94\|r_49_100 | 0.050 | 0.0499547 | yes | 5850 | 14382 | 12867 | v3→v3c→split v4c | 0.0732 | 0.0250 | 0.0218 |
| 320 | 320\|0.94\|sharp | 0.050 | 0.0499659 | yes | 5931 | 14799 | 13477 | v3→v3c→split v4c | 0.0928 | 0.0282 | 0.0239 |
| 360 | 360\|0.94\|sharp | 0.050 | 0.0499955 | yes | 5391 | 13835 | 12999 | v3→v3c→split v4c | 0.0992 | 0.0308 | 0.0281 |
| 400 | 400\|1\|r_49_100 | 0.050 | 0.0499789 | yes | 2205 | 4244 | 3988 | v3→v3c | 0.0289 | 0.0122 | 0.0106 |
| 440 | 440\|0.88\|sharp | 0.050 | 0.0499919 | yes | 4061 | 10494 | 10144 | v3→v3c | 0.0755 | 0.0301 | 0.0290 |
| 480 | 480\|1\|r_23_40 | 0.050 | 0.0499679 | yes | 2038 | 3944 | 3677 | v3→v3c | 0.0425 | 0.0191 | 0.0176 |
| 520 | 520\|0.88\|r_23_40 | 0.050 | 0.0499994 | yes | 5023 | 14880 | 15146 | v3→v3c→split v4c | 0.0804 | 0.0368 | 0.0343 |
| 560 | 560\|0.88\|r_3_5 | 0.050 | 0.0499898 | yes | 1497 | 3667 | 4040 | v3→v3c | 0.0411 | 0.0219 | 0.0202 |
| 579 | 579\|0.88\|r_3_5 | 0.050 | 0.0499894 | yes | 1727 | 4919 | 5337 | v3→v3c | 0.0470 | 0.0259 | 0.0234 |

Full-precision margins (`pilot-final/report.json`): 0.022273871214839258, 0.022157874275164025, 0.022297347039975657,
0.02229937833873219, 0.049954729603524206, 0.0499658723079599, 0.04999549351382715, 0.0499788558096077, 0.04999192530664498,
0.04996787670548397, 0.04999939089610683, 0.04998984111231575, 0.04998935863553666 (table order). The smallest slacks to the target are
6.2·10^{−7} (300) and 6.1·10^{−7} (520); the WOL-C threshold 0.0223/(1 + 10^{−12}) has its own slack of 2.2·10^{−14} against the
floating-point rounding of K0* + target (≤ 2·10^{−16}), and the late margins enter the consumer with the 10^{−9} pad.
CPU s is the total over all sessions and parts (sum 120,848 s = 33.6 CPU-hours for the 13 floors; the split parts make the wall-clock
time shorter than the CPU time). The point columns (central box θ_s = 0, MEASURED) are those of §9.4; "r6+patch point" is the r6 engine
with the referee's `tails_defect` patch at the same box. The margins sit just under the targets by construction: the branch and bound stops as soon as every leaf is
below the target, so a margin records that the target is met, not the smallest reachable value.

**Result.** All 13 pilot floors are certified within their targets: WOL-C (≤ 0.0223/(1 + 10^{−12})) at cells 240, 260, 280, 300 and
≤ 0.050 at cells 320 (both floors), 360, 400, 440, 480, 520, 560, 579. **pilotPasses = true** (CERTIFIED with the grading of this section).
A second certificate set, from scratch with v4c alone, passes on all 13 floors as well (§9.6).

**Consumer.** `tmp/r7-engine-report.py tmp/r7-engine-out/pilot-final --consumer` (exact consumer `tmp/r3-outer-mixed.py` on the r6 certified
admission `tmp/r6-suffix-out/final/cert_r6.json` plus the 13 pilot certificates, shift sh(m + 10^{−9})) gives route P at PT height

    146623578252049/10^15 = 0.146623578252049        (r6 P-cert 0.146660920737233; change −3.734·10^{−5}).

This value is CERTIFIED with the grading of this section (the 13 r7 certificates are single-implementation and unrefereed). Λ < 0.145 is
NOT certified: the other 358 floors of `tmp/r6-fiber-out/p47_hybrid.json` keep their r6 admission.

### 9.4 Survey of all 371 hybrid-path P47 floors and the consumer (MEASURED; hypothetical margins)

`tmp/r7-engine-survey.py` evaluates, for every floor of `tmp/r6-fiber-out/p47_hybrid.json`, the box bound of the central box θ_s = 0
(δ = 10^{−7}, whole time cell and a-range) minus K0* ("point bound"). This is a lower estimate of what a certificate can reach (the branch
and bound must still cover the torus; the pilot shows the cover maximum ends just under the target when the target is above the point
bound). Results (`tmp/r7-engine-out/survey_v3.json`, `survey_v4.json`):

| engine | early floors (cells ≤ 300, 75) | late floors (cells > 300, 296) |
|---|---|---|
| r6 + referee patch (12 sampled cells, §9 of the r6 module) | 0.0198–0.0534 (pilot cells) | 0.029–0.099 (pilot cells) |
| v3 | max 0.0179; none above 0.0223 | 41 above 0.050 (max 0.0607, cells 380–480, κ = 0.88 'sharp'); 58 above 0.045 |
| v4 | max 0.0149; none above 0.0223 | 39 above 0.050 (max 0.0622); 54 above 0.045 |

Exact consumer `tmp/r3-outer-mixed.py` on the r6 certified admission plus these hypothetical per-floor margins (point bound + allowance A,
shift sh(m) as in OW-Lemma 1; `tmp/r7-engine-scen.py`): the route-P value at PT height is

| margins | A = 0.002 | 0.004 | 0.006 | 0.008 | 0.010 |
|---|---|---|---|---|---|
| v3 point bounds | 0.144873371538564 | 0.144891237418192 | 0.144909111334392 | 0.144927495360361 | 0.144946511187251 |
| v4 point bounds | | 0.144873343896512 | | 0.144909122151149 | |

So uniform late margins ≤ 0.050 are not necessary: with per-floor margins of this size (including about 40 late floors between 0.050 and
0.065) the consumer stays below 0.145 for every allowance up to 0.010. This is MEASURED (point bounds are not certificates) and
HYPOTHETICAL (it assumes every floor is certified within A of its point bound).

*The pilot targets as a full-run plan (HYPOTHETICAL).* If every floor of `p47_hybrid.json` were certified exactly at the pilot targets
(0.0223/(1 + 10^{−12}) for the 75 early floors, 0.050 for the 296 late ones; `tmp/r7-engine-out/targets_all.json`,
`tmp/r7-engine-scen.py targets_all ... 0` → `scen_targets_all.json`, 369 shifts raised) the exact consumer gives 0.144993161654455, i.e.
6.8·10^{−6} below 0.145. The uniform late target 0.050 cannot be met everywhere with this engine (about 40 late floors have point
bounds between 0.050 and 0.062); per-floor targets near point + A (table above) are the workable plan, with 0.144873–0.144947 for
A = 0.002–0.010. Mixed plans are worse: early floors at 0.0223/(1 + 10^{−12}) and late floors at max(0.050, v4 point + A) give 0.145007542475326
(A = 0.005; 54 late targets above 0.050) and 0.145015583498026 (A = 0.010; 71 above 0.050), both above 0.145
(`tmp/r7-engine-out/plan_A0.005.json`, `plan_A0.010.json`). The consumer integrates the contraction rate cell by cell, so every floor on the
path contributes and a margin below its target still lowers the value. Since about 40 late floors cannot reach 0.050, a full run that
stops every other floor at the pilot targets ends above 0.145 (HYPOTHETICAL); the branch and bound has to be driven toward point + A on
(nearly) every floor.

### 9.5 The bound landscape (MEASURED)

`tmp/r7-engine-landscape.py OUT IDX 120` evaluates the v4c box bound (minimum of the full bound and the structure-gap bound) on tiny boxes
(half-width 10^{−4} in θ_2, θ_3, θ_5; whole time cell and a-range) at 120 centres per floor: θ_s = 0, axis points at distance 0.05–0.4,
about 30 random points with |θ_s| ≤ 0.3, 60 with |θ_s| ≤ 1.2, and the rest uniform in [0, π] × [−π, π]². This is the pointwise limit of
the branch-and-bound bound; its maximum over the domain is a lower estimate of the smallest margin a certificate of this engine can reach
(the survey's point bound is its value at θ_s = 0). Results (`tmp/r7-engine-out/landscape/ls_<IDX>.json`):

| floor | value at θ_s = 0 | sampled maximum | at θ_s | excess over θ_s = 0 |
|---|---|---|---|---|
| 300 (r_19_40) | 0.01497 | 0.01546 | (0.018, 0.040, 0.055) | 0.0005 |
| 360 (sharp) | 0.02818 | 0.02931 | (0.024, 0.049, 0.168) | 0.0011 |
| 400 (r_49_100) | 0.01059 | 0.01071 | (0, 0, ±0.05) | 0.0001 |
| 520 (r_23_40) | 0.03437 | 0.03606 | (0.073, 0.075, 0.158) | 0.0017 |

The sampled maxima sit at |θ_s| ≈ 0.05–0.19, 0.0001–0.0017 above the central value (there the structure-gap bound is 0.07–0.13 and
the full bound is the smaller one). Away from the centre the pointwise bound falls: its sampled maximum is 0.010–0.030 on
0.3 ≤ |θ_s| < 0.6, −0.007 to +0.013 on 0.6 ≤ |θ_s| < 1.2, and −0.20 to −0.27 at |θ_s| ≥ 2 (medians −0.34 to −0.47), close to the sampled
Φ − K0* there. So targets of the form point + A are reachable in the limit of small boxes for A above about 0.002 at these floors, and the
far-region box count of §9.6 comes from the growth of the bound with the box size, not from its pointwise values.

### 9.6 Second certificate set: engine v4c from scratch (CERTIFIED, grading of §9.3) and cost

All 13 pilot floors were run again from scratch with engine v4c alone (`tmp/r7-engine-out/pilot4-v4c/`; queue `tmp/r7-engine-queue2.sh`, at
most 11 pilot workers on the machine). When workers became free, the slowest runs were partitioned at a checkpoint
(`tmp/r7-engine-steal.sh`: wait for the next checkpoint, stop, `tmp/r7-engine-split2.py`, continue the parts): 320 sharp, 320 r_49_100,
520 once, 300 and 360 twice. Every floor passes its target again, with an exact cover (`tmp/r7-engine-out/pilot4-final/`, `report.json`):

| cell | floor | from-scratch v4c margin | pass | cover | boxes | evaluations | CPU s | pilot CPU s | ratio |
|---|---|---|---|---|---|---|---|---|---|
| 240 | 240\|0.94\|r_19_40 | 0.0221994 | yes | True | 3068 | 6551 | 6161 | 5382 | 1.14 |
| 260 | 260\|0.94\|r_19_40 | 0.0222871 | yes | True | 3426 | 7527 | 6990 | 7051 | 0.99 |
| 280 | 280\|0.94\|r_19_40 | 0.0222973 | yes | True | 4338 | 10082 | 9591 | 10217 | 0.94 |
| 300 | 300\|0.94\|r_19_40 | 0.0222990 | yes | True | 6100 | 15952 | 14756 | 16524 | 0.89 |
| 320 | 320\|0.94\|r_49_100 | 0.0499782 | yes | True | 5567 | 13336 | 12388 | 12867 | 0.96 |
| 320 | 320\|0.94\|sharp | 0.0499659 | yes | True | 5836 | 14119 | 13213 | 13477 | 0.98 |
| 360 | 360\|0.94\|sharp | 0.0499640 | yes | True | 5345 | 13201 | 12440 | 12999 | 0.96 |
| 400 | 400\|1\|r_49_100 | 0.0499953 | yes | True | 2205 | 4242 | 3908 | 3988 | 0.98 |
| 440 | 440\|0.88\|sharp | 0.0499856 | yes | True | 4008 | 9726 | 9703 | 10144 | 0.96 |
| 480 | 480\|1\|r_23_40 | 0.0499679 | yes | True | 2038 | 3948 | 3655 | 3677 | 0.99 |
| 520 | 520\|0.88\|r_23_40 | 0.0499983 | yes | True | 4823 | 13738 | 13733 | 15146 | 0.91 |
| 560 | 560\|0.88\|r_3_5 | 0.0499910 | yes | True | 2233 | 4562 | 4702 | 4040 | 1.16 |
| 579 | 579\|0.88\|r_3_5 | 0.0499935 | yes | True | 2671 | 5873 | 6034 | 5337 | 1.13 |

These are second, single-engine certificates (same implementation family and same box-bound code as the v4c parts of §9.3, a different
branch-and-bound path; not an independent implementation). At 280 and 320 sharp both sets have the same maximal box with the same bound
(280: the initial-grid box centred at θ_s ≈ (1.374, 1.309, 2.827), structure-gap bound 0.0222973; 320 sharp: one v4c-evaluated sub-box).
Rechecks of this set (fresh engine, 8 largest boxes, sampled Φ_E; `pilot4-final/recheck_<IDX>.log`) at floors 240, 300, 520: fresh ≤ stored
in all 24 boxes, sampled Φ − K0* below the stored bound by ≥ 0.0216. Consumer (exact): r6 admission + these 13 certificates →
0.146623582230366; per floor the smaller of the two certified margins (`tmp/r7-engine-out/pilot-best/`) → 0.146623576862494.

*Cost (MEASURED).* 117,273 CPU-s (32.6 CPU-hours) for the 13 floors, 0.97 times the mixed pilot path; per floor 3,655–14,756 s
(mean 2.5 CPU-hours), with 11 workers sharing 18 cores. Floors 300, 320 (both), 360 and 520 cost 3.4–4.1 CPU-hours each, 280 and 440
2.7, the other six 1.0–1.9. The cost does not follow the central gap (target − central-box bound) alone: the 320 and 360 floors have
gaps above 0.02 but need 3,300–3,900 boxes at |θ_s| ≥ 2 in their final covers (pilot set; 300: 4,000; 520: 2,100; 400, 480, 560, 579:
900–1,300). 72–74% of the final boxes of both sets lie at |θ_s| ≥ 1.5, where the sampled Φ − K0* is about
−0.37 to −0.43 (recheck logs) and Φ − Φ(0) ≈ −0.6 (r6 falsification search): the bound on large far boxes is loose (§9.5: its pointwise
values there are close to Φ − K0*), and the far region, not the central one, dominates the box count.

*Projection (HEURISTIC).* The remaining 358 floors at the pilot targets would need about 358 × 2.5 ≈ 900 CPU-hours, i.e. about 80 hours of
wall-clock time with 11 workers on this machine; §9.4 shows that the consumer needs margins below the pilot targets on most floors, which
costs more. Since the pointwise bound is −0.2 to −0.47 at |θ_s| ≥ 2 (§9.5) while 72–74% of the final boxes lie at |θ_s| ≥ 1.5, a bound
whose box-size penalty is smaller on large far boxes (or a separate far-region certificate) is the main lever before a full run.

