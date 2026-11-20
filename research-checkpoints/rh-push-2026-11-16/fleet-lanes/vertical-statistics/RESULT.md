# Vertical statistics under a zero-free half-plane ZF(θ), θ = 7/8 (slug: vertical-statistics, 2026-11-16)

**Verdict: precise obstruction, with two small conditional by-products. No density estimate becomes N(σ,T) = 0 for
any σ < 7/8. No density exponent for σ in (1/2, 7/8) improves on the unconditional literature. RH open. NO QED.**

Everything labelled "under ZF(7/8)" is conditional on the openai/math 7/8 theorem (Lean-checked locally, manuscript
unrefereed). Labels: PROVED (argument written here, same-agent check only), CLASSICAL, MEASURED (`checks.py` →
`checks.out`), LITERATURE (recalled or from a search snippet, not re-read), OPEN.

| item | statement under ZF(θ) | status | comparison |
|---|---|---|---|
| D1 Ingham-type density, contour on any line α < σ, any moment m(α) | A(σ) = 2/[(2−2σ) + f(α)(σ−α)], f = 2m/(m+2); on the ZF branch the optimum is the base point; result = Ingham 3/(2−σ) | PROVED + MEASURED (C3) | no gain |
| D2 floor of the Ingham-type method | A ≥ 2 for every α, every m ≤ ∞ | PROVED | no route to exponent 0 |
| D3 Halász–Montgomery–Huxley | θ-independent for σ < (1+θ)/2 | sibling `bootstrap` Lemma 3, not redone | no gain |
| D4 N(σ,T) = 0 for some σ < θ | not obtainable from any counting inequality | CLASSICAL (sibling Lemma 2c) + §3 here | none |
| S1 argument | \|S(T)\| ≤ ((θ−1/2)/ln 2 + o(1)) log T | PROVED (Jensen, crude) | 0.541 at 7/8; worse than unconditional ≈ 0.10; better only for θ < 0.572 |
| S2 gaps / multiplicity | follow from S1: constants only; order unchanged | PROVED (weak) | Littlewood's unconditional 1/logloglog T is stronger |
| M1 moments | ∫_T^{2T} \|ζ(σ+it)\|^m dt ≪ T^{1+ε} for m < K/(7/8−σ), K = 49/24, σ ≥ 35/54 | PROVED from Gabriel convexity + LITERATURE base point | exceeds Ivić's 1985 table for every σ in (35/54, 7/8) (C2) |
| M2 divisor problem | α_k ≤ 7/8 − 49/(24k) for k ≥ 9 | PROVED from M1 | below recalled bounds for k ≥ 58 (Bellotti–Yang explicit form) and for k ≥ 32 against 1 − 1.889k^{−2/3}; α_k ≤ 7/8 for all k |

## 0. Plan; what is new relative to the atlas, the walls, the sibling

Read: atlas (PR #27; it has no section on density or S(T); §10 is the 7/8 boundary), the three rh-attempt syntheses,
`zf-campaign-synthesis.md`, sibling `bootstrap/RESULT.md`.

The sibling `bootstrap` already has: mollified second moment (exponent 1 + 2A(θ−σ)), pointwise detector,
Halász–Montgomery–Huxley with μ(α) (its Lemma 3), counting cannot output the empty set (Lemma 2c), the E_a control.
I do not redo those. This note adds:

* the Ingham-type (contour-shift, class I / class II) density method with the contour on an arbitrary line α and
  with ZF-improved moments instead of the pointwise exponent (D1, D2);
* S(T), gaps, multiplicity (S1, S2);
* what ZF(7/8) does change in the vertical direction: moments of ζ on lines in (35/54, 7/8) and the divisor
  exponents α_k (M1, M2).

Walls: every statement is a mean-value or convexity statement, so MV-CAP applies to D1–D4 directly; nothing here uses
heat flow, verified height or finite Pick/Weil tests.

Notation: a = θ − 1/2; κ = μ(1/2) ≤ 13/84 (Bourgain); N(σ,T) ≪ T^{A(σ)(1−σ)+ε}; m(σ) = sup of m with
∫_T^{2T}|ζ(σ+it)|^m dt ≪ T^{1+ε}.

## 1. Inputs that ZF(θ) supplies (CLASSICAL, Titchmarsh Ch. 14 with 1/2 replaced by θ)

(I1) For σ ≥ θ + δ: log ζ(σ+it) ≪ (log t)^{1−η}, η = η(δ,θ) > 0; so ζ^{±1} ≪ t^ε and arg ζ = o(log t).
(I2) μ(σ) = 0 for σ ≥ θ; μ(σ) ≤ κ(θ−σ)/a on [1/2, θ] (convexity); μ(σ) = 1/2 − σ + μ(1−σ) for σ < 1/2.
(I3) Gabriel two-line convexity for means: if m(σ₀) ≥ m₀ then m(σ) ≥ m₀(θ−σ₀)/(θ−σ) for σ₀ ≤ σ < θ (the line θ+δ
carries the sup-norm T^ε; let δ → 0; the exponent obtained at δ > 0 is below the limit, so the claim is for every
m strictly less than the right side).

Nothing in (I1)–(I3) changes anything on the line σ = 1/2.

## 2. Density theorems

### 2.1 Ingham-type method on a general line (D1, D2; PROVED)

Detector: M_X(s) = Σ_{n≤X} μ(n)n^{−s}, ζM_X = Σ a_n n^{−s}. For a zero ρ = β+iγ, β ≥ σ, shifting the Mellin contour to
Re = α < σ gives class I (|Σ_{X<n≤Y log²Y} a_n n^{−ρ}e^{−n/Y}| ≫ 1) or class II
(|ζM_X(α+it_r)| ≫ Y^{σ−α}/log T for some |t_r − γ| ≤ log²T).

* Class I: R₁ ≪ T^ε (T X^{1−2σ} + Y^{2−2σ}).
* Class II with the m-th moment on the line α > 1/2 (Hölder; Σ_r|M_X(α+it_r)|² ≪ (T+X)log T because Σ n^{−2α}
  converges): R₂^{1/2+1/m} ≪ T^ε Y^{α−σ} T^{1/m} (T+X)^{1/2}.

With X = T: f(1/m + 1/2) = 1 for f = 2m/(m+2), so R₂ ≪ T^{1 − fη(σ−α)}, Y = T^η. Balancing against Y^{2−2σ}:

  η = 1/[(2−2σ) + f(σ−α)],  A(σ) = 2/[(2−2σ) + f(α)(σ−α)]   (valid while η ≥ 1; otherwise A = 2).

α = 1/2, m = 4 gives Ingham's 3/(2−σ).

**ZF branch.** With m(α) = K/(θ−α) from (I3): D(α) = f(α)(σ−α) = 2K(σ−α)/(K + 2θ − 2α), and

  sign dD/dα = sign(2σ − 2θ − K) < 0 for σ < θ.

So on the segment where ZF(θ) supplies the moment, the best line is its left end, the unconditional base point.
The gain in m is linear in 1/(θ−α); the loss in Y^{α−σ} is larger. MEASURED (C3): with m(α) = max(Ivić table,
(49/24)/(7/8−α)), the optimum over α in [1/2, σ) is α = 1/2 for σ = 0.60, …, 0.87, and equals 3/(2−σ).

**Floor (D2).** For any α < σ and m ≤ ∞ (m = ∞ means ζ ≪ T^ε on the line α): if X ≤ T, class I gives exponent
≥ 1 + ξ(1−2σ) ≥ 2 − 2σ (X = T^ξ). If X = T^ξ, ξ > 1, class II needs η(σ−α) ≥ ξ(1−α) − E/2 and class I needs
E ≥ η(2−2σ); together E ≥ (2−2σ)ξ. So A ≥ 2 always. The density-hypothesis exponent is the floor of this method even
with Lindelöf on the line α. A ≤ 2 is already known unconditionally for σ ≥ 25/32 (Bourgain, LITERATURE).

### 2.2 Halász–Montgomery (D3)

Sibling Lemma 3: the kernel bound on a line α enters only for α < 2σ − 1, and for σ < (1+θ)/2 the optimum is
α = 1/2. The moment version gives the same threshold: R ≪ G N V^{−2} + T (G N^α V^{−2})^{m}, which needs
α < 2σ − 1 to be usable at all. For σ < θ = 7/8 this means α < 3/4; with the Ivić base the ZF moment exceeds the
table only on (35/54, 7/8), and there the same monotonicity as in 2.1 applies to the pointwise version. Not
re-derived for the moment version in full (weakest step 2).

### 2.3 Can any of this give N(σ,T) = 0 for some σ < 7/8? (D4)

No, for two reasons.

1. (CLASSICAL) A counting bound T^{E} with E ≥ 0 is consistent with one zero. Every method above has a diagonal
   term ≥ T^{(2−2σ)·(positive)}; D2 shows the Ingham-type exponent is ≥ 2(1−σ) > 0. A density bound gives N = 0 only
   if its exponent is negative, and no step in §2 produces a negative exponent.
2. (PROVED in the sibling, Prop. 5 / E_a control) All inputs (I1)–(I3) hold for ζ(s+b)ζ(s−b) with θ replaced by
   Θ + b, which has zeros arbitrarily close to its abscissa. Arguments built from (I1)–(I3), the functional equation
   and mean values are covariant under this shift.

The largest count ZF(7/8) leaves near the boundary is the unconditional one: N(σ,T) ≪ T^{A(σ)(1−σ)} with σ ↑ 7/8,
A(7/8)/8 ≤ 1/4 from A ≤ 2. An exponent tending to 0 as σ ↑ θ (the analogue of A(σ)(1−σ) → 0 at σ = 1) is not
obtained: at σ = 1 it comes from absolute convergence (diagonal N^{2−2σ} → 1), and θ has no such structure. OPEN.

Consequence for primes in short intervals: the binding density exponent is sup A(σ) on σ ≈ 0.7–0.75 < θ, unchanged;
ψ(x+h) − ψ(x) ~ h still needs h ≥ x^{17/30+ε} by this route (Guth–Maynard, LITERATURE).

## 3. S(T), gaps, multiplicity

**Prop. S1 (PROVED).** Under ZF(θ), |S(T)| ≤ (a/ln 2 + o(1)) log T, a = θ − 1/2.

*Proof.* Let c = θ + δ, φ = arg ζ(c+iT), g(z) = ½[e^{−iφ}ζ(z+iT) + e^{iφ} \overline{ζ(\bar z+iT)}]. g is entire apart
from the pole, real on the real axis, g(σ) = Re(e^{−iφ}ζ(σ+iT)), and g(c) = |ζ(c+iT)| ≥ T^{−ε} by (I1). If g has n
zeros on [1/2, c], the variation of arg ζ(σ+iT) over that segment is at most (n+1)π. By (I1) the variation from
2+iT to c+iT is o(log T). Jensen in discs centred at c, radii r = c − 1/2 and R = xr:
n ≤ log(max_{|z−c|=R}|g| / g(c))/ln x ≤ (μ(c − R) + ε) log T / ln x. With (I2),
μ(c−R) = a(x−1) + κ(2−x)₊. The minimum over x > 1 of [a(x−1) + κ(2−x)₊]/ln x is a/ln 2, at x = 2, for every
a ≤ 3/8 (MEASURED, C1). Let δ → 0. ∎

At θ = 7/8 the constant is 0.541. The unconditional explicit literature has ≈ 0.10 log T for N(T) − main term
(Hasanalizade–Shen–Wong 0.1038; Bellotti–Wong 0.10076; LITERATURE), obtained with Backlund's refinements that this
proof does not use. S1 beats 0.1038 only for θ < 1/2 + 0.1038 ln 2 = 0.5719. The dependence is linear in θ − 1/2,
consistent with S(T) = o(log T) under RH. Whether ZF(θ) gives S(T) = o(log T) for a fixed θ > 1/2: OPEN; I see no
mechanism, since zeros in 1/2 < σ ≤ θ may cluster locally and the density bounds of §2 do not exclude it.

**S2 (PROVED, weak).** From N(T+h) − N(T) = (h/2π)log T + S(T+h) − S(T) + O(1/T): every interval of length
> 4πa/ln 2 + o(1) contains a zero ordinate, and multiplicities are ≤ (2a/ln 2 + o(1)) log γ. Both are weaker than what
is known unconditionally (Littlewood: gaps ≪ 1/logloglog T, LITERATURE; multiplicity ≤ ≈ 0.2 log γ from the explicit
N(T) bounds). Littlewood's proof assumes a zero-free horizontal strip and propagates log ζ from σ = 2 leftward by
Borel–Carathéodory and three circles; ZF(θ) improves only the starting size of log ζ, which changes the constant and
not the order. Sketch only, not audited. The RH-rate π/loglog T uses test functions that need all zeros on one line.

## 4. What ZF(7/8) does change: moments and divisor exponents

**Prop. M1 (PROVED given (I3); base point LITERATURE).** Ivić's table (Theorem 8.4 of *The Riemann Zeta-Function*,
recalled) has m(35/54) ≥ 9. Maximising m(σ₀)(7/8 − σ₀) over that table gives σ₀ = 35/54, K = 9·(7/8 − 35/54) = 49/24
(MEASURED, C2). Hence under ZF(7/8)

  m(σ) ≥ (49/24)/(7/8 − σ),  35/54 ≤ σ < 7/8,

for example m(3/4) ≥ 16.33 (table: 14.27), m(0.80) ≥ 27.2 (19.85), m(0.86) ≥ 136 (32.5), and m(σ) → ∞ as σ ↑ 7/8.
A better unconditional base point (newer tables) raises K.

**Cor. M2 (PROVED from M1).** Δ_k(x) ≪ x^{α_k+ε} with α_k ≤ σ whenever m(σ) ≥ k (Perron, CLASSICAL). So under
ZF(7/8): α_k ≤ 7/8 − 49/(24k) for k ≥ 9, and in particular α_k ≤ 7/8 for every k. Against recalled bounds (C4):
below Ivić's 1985 table for every k ≥ 10; below Bellotti–Yang's 1 − 1.224(k−2.36)^{−2/3} for all k ≥ 58 (0.841 against
0.918 at k = 60); below 1 − 1.889k^{−2/3} (stated for sufficiently large k) from k = 32 on. Bellotti–Yang also
improved 9 ≤ k ≤ 21; I did not compare with their values there. Unconditional bounds tend to 1 as k → ∞; this one
stays below 7/8.

M1 and M2 are the trivial transfer of the half-plane to mean values. They carry no information about the location
of zeros below 7/8 and do not feed back into §2 (D1: the moment gain is on the wrong side of the trade).

## 5. DH control and where the Euler product is used

Davenport–Heilbronn has zeros with Re s > 1, so ZF(θ) is false for it and every statement here is vacuous for DH.
The Euler product enters only through the hypothesis ZF(7/8) (the 7/8 theorem) and through (I1) (log ζ analytic to
the right of θ). No step of this note uses Λ(n) ≥ 0 or multiplicativity directly, which is why nothing here can
move θ. The second control is the sibling's E_b(s) = ζ(s+b)ζ(s−b): (I1)–(I3), D1–D3, S1, M1 hold for it with θ
replaced by Θ+b, and it has zeros up to its abscissa. So no combination of these statements yields a zero-free
statement below θ.

## 6. Verdict

Precise obstruction for the density part: on the lines where ZF(θ) improves ζ (α close to θ), the zero-detection
methods cannot use the improvement, because the Ingham-type shift needs α < σ and pays Y^{α−σ} (monotone loss, D1),
the Halász–Montgomery shift needs α < 2σ − 1 < θ, and the Ingham-type method has floor A = 2 (D2). No exponent
becomes negative, so no new N(σ,T) = 0 and no record. By-products: S1 (weak, useful only for θ < 0.572) and M1/M2
(moment and divisor exponents conditional on the 7/8 theorem).

One pivot was taken: from "density under ZF" (dead as above) to "what vertical mean-value statements do change",
which gave M1/M2. I stop there.

## 7. Three weakest steps

1. Literature inputs are recalled, not re-read: Ivić's moment table (the recalled entries are discontinuous at
   σ = 7/8, so at least one entry above 5/6 is misremembered; M1 uses only the entry m(35/54) ≥ 9, cross-checked
   against α₉ ≤ 35/54), the Bellotti–Yang ranges (from a search snippet), the 0.1038 / 0.10076 constants. The
   comparison column of M2 may be out of date; the bound α_k ≤ 7/8 − 49/(24k) itself does not depend on it beyond
   the single base point.
2. D1 is proved for the single-moment Hölder version of the Ingham-type method and D3 is cited from the sibling for
   the pointwise version. I did not treat mixed methods (Jutila, Heath-Brown, Guth–Maynard large-value geometry) with
   ZF inputs; the claim there is by inspection that they take no ζ-input off the line 1/2 that ZF improves in the
   usable range α < 2σ − 1.
3. S1 uses Jensen in discs, without Backlund's refinements, and Gabriel's convexity in (I3) is used in the
   standard smoothed form without writing the localisation in t. S2's remark on Littlewood's theorem is a sketch.

Files: `tmp/research-2026-11-16/push/vertical-statistics/RESULT.md`,
`checks.py`, `checks.out`. Run: `.venv-arb/bin/python -I tmp/research-2026-11-16/push/vertical-statistics/checks.py`.

Sources consulted by search: arXiv 2303.05028 (Bellotti–Yang), mathtube.org/node/1429 (talk abstract),
arXiv 2107.06506 (Hasanalizade–Shen–Wong), arXiv 2412.15470 (Bellotti–Wong).
