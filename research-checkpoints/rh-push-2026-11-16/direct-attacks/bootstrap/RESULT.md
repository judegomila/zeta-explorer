# Bootstrap from a zero-free half-plane: ZF(θ) ⟹ ZF(θ′), θ′ < θ ? (slug: bootstrap, 2026-11-16)

**Verdict. No mechanism examined gives θ′ < θ. No contraction map. RH open; best half-plane unchanged (7/8 Lean-checked
locally for ζ; ≈0.874887 conditional on Xu–Sang). NO QED.**

Maps obtained:

| mechanism | map | status |
|---|---|---|
| (1) 7/8 system with θ-dependent inputs | f(θ) = min(θ, σ_sc), σ_sc = 0.8749572 (paper system) / 0.8748866 (XS) | prior note (MODEL / EXACT bracket); not redone here |
| (1′) loop: ZF(θ) → family density at the binding bins → 7/8 system | same f; the density channel carries no θ-dependence (Lemma 3) | PROVED for the Halász–Montgomery–Huxley channel, t-aspect |
| (2a) mollifier + convexity zero count | exponent of N(σ,T) is 1 + 2A(θ − σ): f(θ) = θ | PROVED (Lemma 1) |
| (2b) pointwise zero detector | detector bound Y^{θ−β}: f(θ) = θ | PROVED (Lemma 2) |
| (2c) any counting bound | never < 1 zero; cannot output an empty set | CLASSICAL (MV-CAP instance) |
| (3) explicit-formula positivity with concentrated tests | f(θ) = θ; passes the shifted-Eisenstein control | PROVED (Prop. 5) |

Labels: PROVED (argument written here, same-agent check only), CLASSICAL, MEASURED (script `checks.py`, output
`checks.out`), LITERATURE (recalled, not re-read), OPEN.

## 0. Plan; what is new relative to the atlas, the walls, and the prior attempt

Read first: atlas (PR #27 `historical-routes.md`, §10 in particular), `2026-11-01-bootstrap-qrh.md` (prior attempt),
`zf-campaign-synthesis.md`, the three rh-attempt syntheses, the brief's walls.

The prior attempt fed ZF(θ) into the *existing proof architectures*: Part II of the 7/8 paper (capacity κ = 2θ − 1 and
zero bins), the Xu–Sang system via PR #14, the 11/12 Möbius route, and the Landau functionals. Its Theorem S and
Lemma I.1 already answer idea (1) of this ticket: the 7/8 proof is a contradiction argument on the extremal abscissa
β*, so it already holds ZF(β*) internally, and β* ≤ θ makes an external ZF(θ) a weaker statement. The exponent formula
σ₀ = 5/6 + (M − 2ℓ)/12 is set by zero-blind lemmas (low side ≥ 13/15) and by family counts at real parts 0.69–0.76.
I did not recompute that; I cite it.

What this note does that the prior one did not:

* It tests the *consumer* mechanisms of idea (2) directly (Möbius partial sums to X^{θ+ε}, mollified moments,
  Halász–Montgomery large values with the ZF(θ)-improved μ(σ)), which are not contradiction arguments on β* and so are
  not covered by Lemma I.1. Result: each is exactly neutral at σ = θ (Lemmas 1–3), with closed-form exponents.
* It closes the remaining loop of idea (1): ZF(θ) cannot improve the family density counts that bind the 7/8 system
  (Lemma 3 + cap from the campaign synthesis).
* It adds two controls beside DH (§4): the shifted Eisenstein product ζ(s+a)ζ(s−a) (Euler product, Λ ≥ 0, same
  functional equation s ↔ 1 − s, sharp half-plane at 1/2 + a) and Beurling systems. This answers the brief's question
  "what else distinguishes": the size normalisation (abscissa of absolute convergence 1, only pole at 1).

Walls: nothing here uses heat flow, verified height, or finite Pick/Weil tests. Lemma 2c is an instance of MV-CAP.

Notation. ZF(θ): ζ(s) ≠ 0 for Re s > θ (same symbol for a family when stated). Θ = sup Re ρ. μ(σ) = Lindelöf
exponent. c = μ(1/2) ≤ 13/84 (Bourgain). M_X(s) = Σ_{n≤X} μ(n) n^{−s}.

## 1. Idea (2): density and zero detection under ZF(θ)

**Inputs available under ZF(θ) (CLASSICAL; Titchmarsh Ch. 14 with 1/2 replaced by θ).** For σ ≥ θ + δ, |t| ≤ T:
log ζ(s) ≪_δ (log T)^{1−c′}, so ζ(s)^{±1} ≪ T^ε; Σ_{n≤X} μ(n) ≪ X^{θ+ε}; M_X(s) − 1/ζ(s) ≪ X^{θ−σ+ε} T^ε for
σ > θ, and M_X(s) ≪ X^{θ−σ+ε} T^ε for 1/2 ≤ σ < θ. By Phragmén–Lindelöf, μ(σ) ≤ c (θ − σ)/(θ − 1/2) on [1/2, θ]
(unconditional convexity gives 2c(1 − σ); at θ = 7/8, σ = 3/4: 13/252 against 13/168).

**Lemma 1 (mollified second moment; PROVED).** Let X = T^A, f = ζ M_X − 1. The two-line convexity theorem for mean
squares between σ = 1/2 and σ = θ + δ, with the inputs above, bounds the zero count by

  N(σ, T) ≪ T^{e(σ)+ε},  e(σ) = 1 + A · [(2θ − 1)(θ + δ − σ) − 2δ(σ − 1/2)]/(θ + δ − 1/2) = 1 + 2A(θ − σ).

*Proof.* On σ = 1/2: ∫|f|² ≪ T^{1+ε} X^{2θ−1}. On σ = θ + δ: ∫|f|² ≪ T^{1+ε} X^{−2δ}. Interpolate with weights
(θ + δ − σ)/(θ + δ − 1/2) and (σ − 1/2)/(θ + δ − 1/2). The bracket equals 2(θ + δ − 1/2)(θ − σ) identically
(MEASURED: exact rational check, 2000 random triples, `checks.py` C2). ∎

So e(σ) < 1 only for σ > θ, where the statement is the hypothesis. For σ < θ a longer mollifier makes the bound worse,
and A → 0 returns the trivial T^{1+ε}. The pointwise saving of M_X on the right line is cancelled exactly by its
pointwise size X^{θ−1/2} on the critical line. Map: f(θ) = θ.

**Lemma 2 (pointwise detector; PROVED).** For a zero ρ = β + iγ, 1 + o(1) = −Σ_{n>X} a(n) n^{−ρ} e^{−n/Y}
+ (contour term), a(n) = Σ_{d|n, d≤X} μ(d). Moving the Mellin contour to Re(ρ + w) = θ + δ bounds the sum by
Y^{θ−β+δ} X^{−δ} T^ε. This is < 1 (contradiction, no zero) only if β > θ − δ(1 − log X/log Y) − ε′, i.e. only in the
limit β ≥ θ. Moving it to Re(ρ + w) = 1/2 gives the class-II condition Y^{β−1/2} > T^{c+ε} X^{θ−1/2}, which together
with class I returns Lemma 1's exponent. Map: f(θ) = θ.

**Lemma 2c (counting cannot output the empty set; CLASSICAL).** Every large-values bound has the form
R V² ≤ G N + (off-diagonal), with diagonal G N/V² ≍ N^{2−2σ} ≥ 1 for σ ≤ 1. One hypothetical zero is consistent with
every such inequality. To exclude a zero one needs a multiplication step (one zero forces ≫ T^η detections, in a
family or at other heights). The 7/8 proof has such a step (the extremal zero feeds the cubic rows); the consumer
estimates of this section do not.

**Lemma 3 (Halász–Montgomery–Huxley with the ZF(θ) Lindelöf exponent; PROVED).** In the large-values step, the
kernel Σ_{n≤N} n^{−it} may be bounded on any line α ∈ [1/2, θ] by N^α T₀^{μ(α)}, and the subdivision length is
T₀ = N^{e(α)}, e(α) = (2σ − 1 − α)/μ(α) (needs α < 2σ − 1). With μ(α) = c(θ − α)/(θ − 1/2),

  de/dα = (θ − 1/2)(2σ − 1 − θ) / (c (θ − α)²).

Hence for every σ < (1 + θ)/2 the optimum is α = 1/2, the unconditional choice, and the bound obtained is the
unconditional one. For σ > (1 + θ)/2 ≥ θ the choice α = θ gives N(σ, T) ≪ T^ε (Halász–Turán shape), which is vacuous
under ZF(θ). For σ ≤ 3/4 the channel is absent (2σ − 1 ≤ 1/2). (MEASURED: grid over α at θ = 7/8 for
σ = 0.8, 0.85, 0.93 picks α = 1/2 each time; `checks.py` C3.) ∎

Consequence for idea (1), the loop version. The 7/8 systems bind at family counts for zeros at real part ≈ 0.694
(paper) and 0.7347 (XS) (prior note, Lemmas I.3, §4.5). Both are below 3/4 < (1 + θ)/2, so ZF(θ) with θ ≥ 0.87 changes
no Halász–Montgomery-type count there; Ingham-type and Guth–Maynard counts use mean values and large-value geometry of
Dirichlet polynomials, with no ζ-bound that ZF(θ) improves (ZF(θ) gives nothing new on the line 1/2). Independently,
the campaign synthesis prices even the full density hypothesis in every bin at ≥ 0.8734878 (gate cap, MODEL, not
re-run). So the composed map is the prior one, f(θ) = min(θ, σ_sc).

## 2. Idea (1): θ-dependent inputs in σ₀ = 5/6 + (M − 2ℓ)/12

Not recomputed. Prior note: (a) Lemma I.1, the contradiction argument already uses ZF(β*), β* ≤ θ, so the external
input only restricts the range of β*; (b) the low estimate (Prop. 15.3) uses no L-function, minimum 13/15 at
ℓ = 1/5, M = 4/5 (EXACT there); (c) the high side binds at β* ↓ σ₀ on bins at real part ≈ 0.69, which no reachable θ
removes. Two further inputs the ticket lists:

* *Row-wise GRH-type bounds for the cubic-row sums under family ZF(θ).* Pointwise x^{θ+ε} per row is weaker than the
  square-root-on-average the large sieve already supplies for every θ > 1/2 (prior note §9). The binding loss is in
  the Poisson range and the theta residue (TRO6), which are zero-blind.
* *Shorter Dirichlet polynomials / mollifier lengths.* Lemma 1: under ZF(θ) lengthening a mollifier costs exactly what
  it gains at σ = θ; there is no θ-dependent length gain below θ.

## 3. Idea (3): explicit-formula positivity with tests concentrated to exploit the strip

**Prop. 5 (PROVED).** Let g be a test function and H its Mellin transform in the explicit formula
Σ_ρ H(ρ) = H(0) + H(1) − Σ_n Λ(n) n^{−1/2}(g(log n) + g(−log n)) + (Γ-term). Any inequality derived from
(i) this identity, (ii) Λ(n) ≥ 0, (iii) the functional equation s ↔ 1 − s, (iv) ZF(θ), and (v) growth bounds that
follow from (iii)–(iv), holds verbatim for E_a(s) = ζ(s + a)ζ(s − a) with θ replaced by Θ + a and pole terms at 1 ± a.
E_a has zeros with real part arbitrarily close to Θ + a (on it, if the sup is attained). Hence no such inequality
proves ZF(θ′) with θ′ < θ uniformly: applied to E_a with a = θ − Θ it would be false.

*Proof.* E_a is an Euler product with −E_a′/E_a = Σ Λ(n)(n^a + n^{−a}) n^{−s}, coefficients ≥ 0;
π^{−s}Γ((s+a)/2)Γ((s−a)/2)E_a(s) is invariant under s ↔ 1 − s; its zeros are ρ ± a. ∎ (MEASURED at a = 3/8: functional
equation to 1e-30 at three points; zero at 7/8 + iγ₁; coefficient positivity; `checks.py` C1.)

Direct statement of why concentration does not help: with a test of logarithmic length L, an off-line zero at β
contributes e^{(β−1/2)L}; ZF(θ) caps this at e^{(θ−1/2)L}; the prime side minus the pole term *is* that zero sum
(identity). To exclude β ∈ (θ′, θ] one needs an independent bound on the prime-side remainder with exponent ≤ θ′ − 1/2,
which is the conclusion (prior note, Attempt III, Corollary III.5). Sieve-type two-sided bounds 0 ≤ Λ ≤ (Brun–
Titchmarsh) do not supply it: a zero at β < 1 perturbs short-interval prime counts by relative size x^{β−1} → 0.

## 4. Controls: what distinguishes ζ from an L-like object with a sharp half-plane

| control | Euler product, Λ ≥ 0 | FE s ↔ 1 − s | abs. convergence for Re s > 1, pole only at 1 | zeros |
|---|---|---|---|---|
| Davenport–Heilbronn | no | yes | yes | off-line, up to Re s > 1 |
| E_a = ζ(s+a)ζ(s−a), 0 < a < 1/2 | yes | yes | **no** (coefficients ≍ n^a, poles 1 ± a) | sup Re = Θ + a, sharp |
| Beurling [α, β]-systems with α = θ | yes | **no** | yes (N(x) = ρx + O(x^{β+ε})) | sup Re = θ (LITERATURE: Hilberdink; Diamond–Montgomery–Vorhauer; Broucke–Debruyne–Révész; not re-read) |

**Three-control criterion (PROVED for DH and E_a; third row LITERATURE).** A valid bootstrap step must use, in the
same step, the Euler product, the functional equation, and the size normalisation. For the E_a row the statement is
quantitative: an argument whose inputs remain true when coefficient bounds are relaxed from n^ε to n^{λ+ε} (and poles
at 1 ± λ are allowed) has fixed point ≥ Θ + λ ≥ 1/2 + λ. Lemmas 1–3 and Prop. 5 use only ZF(θ), the functional
equation and polynomial growth, so they tolerate every λ; their neutrality at θ is forced.

How the DH control reads for this angle: DH has no half-plane, so "assume ZF(θ)" already excludes it; that is why E_a
is needed as the second control. The steps above never get as far as failing for DH, since they prove nothing.

Limit of the E_a control: a single shift ζ(s − λ) is covariant for every argument; E_a adds only that the functional
equation centre stays at 1/2. It does not obstruct an argument that uses Ramanujan-sharp diagonal mean values
(Σ|a_n|² ≍ N), such as the 7/8 proof's low side.

## 5. Pivot (one): the loop ZF(θ) → density at the binding bins → 7/8 system

This was the strongest adjacent idea: the only channel by which a half-plane could move the 7/8 exponent is through
family counts at real parts 0.69–0.76. Result (Lemma 3 and §1 consequence): ZF(θ) with θ > 3/4 gives no count
improvement there by the ζ-bound channel, the other density technologies are zero-blind, and the prize is capped at
0.8734878 even with the density hypothesis. The loop is closed with f(θ) = min(θ, σ_sc). I stop here.

## 6. What a working step would need (OPEN)

A zero-multiplication estimate that is Ramanujan-sharp, uses the Euler product, and whose exponent is not set by
zero-blind data: in the 7/8 architecture this is the TRO6 natural (power saving for sextic theta coefficients against
the cubic rows), which is arithmetic input and not a bootstrap. Nothing in this note supplies it.

## 7. Three weakest steps

1. Lemmas 1–3 bound what the named methods yield from the listed ZF(θ) inputs. They are not theorems that no argument
   exists; "zero-blind" for Ingham-type and Guth–Maynard counts is by inspection of their inputs, not an audit, and
   Lemma 3 is written for ζ in the t-aspect only (the Hecke-family q-aspect version is not written).
2. The Beurling row and the family version of the E_a control (twists L(s+a,η)L(s−a,η)) rest on recalled literature
   and on an unverified assumption that the class in question admits poles at 1 ± a. The E_a criterion is weak against
   arguments that use sharp diagonal mean values.
3. The numbers σ_sc = 0.8749572, 0.8748866 and the cap 0.8734878 are imported from the 2026-11-01 notes (MODEL /
   conditional on Xu–Sang) and were not re-run here.

Files: `RESULT.md`, `checks.py`, `checks.out` in this directory. Run:
`.venv-arb/bin/python -I tmp/research-2026-11-16/push/bootstrap/checks.py`.
