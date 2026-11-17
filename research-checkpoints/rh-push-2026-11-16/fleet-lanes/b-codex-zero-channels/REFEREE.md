# Referee report: `b-codex-zero-channels/RESULT.md`

Date: 2026-11-16. Adversarial referee. Scope: re-derive each PROVED step, rerun checks with different cases and
independent code, check the DH control, check interval rigor, check for RH or verified-height leakage.
Referee scratch code and outputs are in `/tmp/ref-bczc/` (outside the repo). Nothing in the repo was written except
this file. All runs local, one process at a time, python-flint arb + mpmath. PR refs read: `refs/pr/56` = `29d8f6f88`,
`refs/pr/57` = `d6c92b380`.

## Verdict

**The precise-obstruction verdict holds.** Neither PR 56 nor PR 57 contains a mechanism that separates zeta from
Davenport-Heilbronn (DH).

* Theorem A (the PROVED step that carries the weight) is confirmed: re-derived by hand, confirmed to 1e-31 on a kernel
  with an off-line quartet and a finite zero set, and confirmed on zeta with tests outside the Taylor class.
* The headline DH numbers are reproduced by an independent implementation with a different quadrature rule,
  integration range, series truncation and precision: first negative pivot at order **165 (even)** and **170 (odd)**,
  every pivot 159-170 equal to RESULT's to 12 digits.
* The convexity certificate, the PR 56 `J_1..J_4` pivots, the PR 57 certificate and the off-line DH zero all replay.

**One claimed reading is wrong: "functional-equation rigidity" (verdict item 5, section 4).** The measured table
reproduces, but the attribution to the functional equation fails a control RESULT did not run: an even
(FE-preserving) perturbation of the same size in the same direction fails at the same orders. See section 4.

Four smaller defects (section 5): an overstated audit sentence, a share curve presented as independent evidence when
it is algebraically equivalent to the pivot sign, a horizon extrapolation contradicted by PR 56's own comparison
kernel, and a numerical slip in the convexity tail. None changes the verdict.

No step assumes RH. No verified-height statement is presented as new.

## 1. Theorem A (PROVED): confirmed

### 1.1 Re-derivation

With `m = K*a`, `n = (uK)*a`:

* `∫(2r-u-v)K(r-u)K(r-v)a(u)a(v) = 2r m² - 2m(rm - n) = 2mn`, so `<a,H_0 a> = 2∫_0^∞ m n`. Correct.
* PR 56's kernel (operator-duality (3)) has lower limit `|(u+v)/2|` after centring; the centred integrand is odd in
  `r`, so the limit can be replaced by `-(u+v)/2`, which is RESULT's form. Signs agree with PR 56:
  `<a,Ha> = ‖QAa‖² - ‖QA*a‖²`, and `H ⪰ 0` is the RH direction.
* Transforms: `M = (F/4)â` (RESULT drops the constant 4; harmless), `N = ½ (F'/F) M`. Correct.
* `L = Σ_ρ 1/(z-ρ)` in paired form needs `F` even, order 1, `F(0) ≠ 0`. All hold for zeta and DH.
* `1/(z-ρ) = ∫_{u<0} 2e^{2(z-ρ)u} du` gives `n(r) = Σ_ρ e^{-2ρr} M_r⁺(ρ)`; the other half-line representation differs
  by `e^{-2ρr} M(ρ) = 0`. Correct.
* Pairing: `e^{-2ρr}M_r⁺(ρ) = -m(r)/(2ρ) + m'(r)/(4ρ²) + O(ρ^-3)`; the `1/ρ` terms cancel between `ρ` and `-ρ`,
  uniformly in `r` because `|Re ρ| < 1/2` and `m` has double-exponential decay. `Σ|ρ|^-2 < ∞`. Correct.
* `m(r)e^{-2ρr}M_r⁺(ρ) + m(r)e^{2ρr}M_r⁺(-ρ) = -d/dr[M_r⁺(ρ)M_r⁺(-ρ)]`; integrating gives `M⁺(ρ)M⁺(-ρ)` per pair.
  Correct.
* Coordinates: `v(t) = ½m(t/2)` gives `V(z) = M⁺(-z)`, so `Σ_ρ V(ρ) conj V(-conj ρ) = Σ_ρ M⁺(-ρ)M⁺(ρ)` for real `m`.
  Correct.

One step RESULT does not mention: before the `r`-integration, the Fourier inversion of `N = ½LM` is also done
termwise. It is justified: on `Re z = σ > 1/2` the paired partial sums of `L` are `O(log²(2+|z|))` uniformly in the
truncation, and `M` decays exponentially on vertical lines. So the proof is complete as a sketch; I found no gap.

Derived consequence (referee): for an even kernel whose transform has order 2 (`F = P(z)e^{bz²}`), the same argument
gives an extra term, `<a,H_0 a> = Σ_ρ M⁺(ρ)M⁺(-ρ) + b·m(0)²/2` in the present normalisation with `b = 1` for
`e^{-u²}`. It vanishes on the odd sector. The "order 1" hypothesis in RESULT's statement is needed.

### 1.2 Exact test with off-line zeros (new case; `thA_gauss.py`)

PR 56's comparison kernel `K(u) = (1 + u²/10 + u⁴/300)e^{-u²}`. Transform `√π e^{z²} q(z²)`, zeros exactly the quartet
`±0.7966666944 ± 4.139405491 i`. This tests the pairing `ρ ↔ -ρ` with off-line zeros, which the 400-zeta-zero check
cannot.

| entry | direct integral | Σ over the 4 zeros (+ `K^(a)(0)K^(b)(0)/2`) | difference |
|---|---|---|---|
| `T_11` | 0.00201666666666667 (= 121/60000) | same | 3.9e-34 |
| `T_13` | -0.0111 | same | 1.5e-33 |
| `T_33` | 0.061 | same | 6.2e-33 |
| `T_00` | 0.554425 | 0.054425 + 0.5 | 0 |
| `T_02` | -1.00201666666667 | -0.102016666666667 - 0.9 | 0 |
| `T_22` | 1.8111 | 0.1911 + 1.62 | 2.0e-31 |

The odd sector needs no correction; the even sector needs exactly the order-2 term. From these numbers
`4·det[S_11, S_13; S_13, S_33] = -29/1350000000`, which is PR 56's stated negative determinant
(HIGHER-JET-CERTIFICATE.md). So the comparison-kernel witness, listed in RESULT as "not replayed", replays, and
Theorem A explains it: one off-line quartet, nothing on the line.

### 1.3 Zeta, tests outside the Taylor class (new case; `thA_zeta2.py`, 600 zeros)

| test `a` | direct | zero sum, relative difference at 200 / 400 / 600 zeros |
|---|---|---|
| `δ_{0.1} - δ_{-0.1}` (odd) | 1.707122923e-4 | -6.4e-5 / -1.4e-5 / -5.7e-6 |
| `δ_{0.25} - δ_{-0.25}` (odd) | 5.418306403e-6 | -1.9e-4 / -4.2e-5 / -1.7e-5 |
| `δ_{0.1} + δ_{-0.1}` (even) | 4.301412957e-3 | -8.9e-2 / -5.7e-2 / -4.4e-2 |
| `δ_{0.3}` | 5.011726975e-7 | -1.1e-1 / -7.3e-2 / -5.6e-2 |
| `δ_{0.05} - 2.5δ_{0.2} + 0.7δ_{-0.15}`, cutoff `c = 0.12` | 3.367247197e-3 | -7.4e-2 / -4.8e-2 / -3.7e-2 |

Odd tests converge like `T^-3`. For the last row the deficit divided by `(log(T/2π)+1)/T` is 5.69, 5.70, 5.77 at the
three truncations: it is the `γ^-2` tail and nothing else. The shifted-cutoff statement `<a,H_c a> = W(1_[c,∞)(K*a))`
is confirmed.

### 1.4 Remaining scope note

`Q_L(v_a)` for `v_a = ½(K*a)(·/2)` is eq48's zero-sum form extended beyond eq48's class `E` of finite exponential
sums. The identity with the zero sum is exact. The identification with eq48's split (16) (`E_gamma` minus prime terms)
on this class is only ARGUED, as RESULT says. "No new target" is therefore established in the zero-sum form, which is
enough for the verdict.

## 2. PR audit and convexity certificate

* PR 56 `J_1..J_4`: independent code (`blk.py`, own series recursion, Gauss-Legendre 5×44, 600 bits) gives odd pivots
  `0.010882302182086`, `0.51552324631994`, `10.672420745673`, `414.20985240255`. After `p_PR = 32·16^-a p`,
  `a = 1,3,5,7`: `0.021764604364172`, `0.0040275253618745`, `0.000325696434`, `0.0000493777`. All four lie inside
  PR 56's certified intervals.
* PR 57: `zero-channel-bounds.py --verify-existing ... --with-arb` rerun: quartic `valid: true`, 130 cells, 520
  branch-cells, min margin 0.0204443, clearance 0.0701095; theta witness rebuilt in arb, `valid: true`, margin
  6.532e-5. The Rouché inequality `E + Br²/2 < Ar` and the reflection step are correct.
* PR 56's hypotheses for (G)/(H) are exactly: `κ` even, positive, `-log κ(√t)` strictly convex. PR 56 itself states
  that (G)/(H) hold for every real heat time. Its all-order equivalence uses in addition only analyticity in a strip
  and `F > 0` on the real axis. RESULT's reading of what the theorems use is correct.
* `convex.py`: logic checked. `V'' = R/(4u³)`, `R = l' - u l''`, `R' = -u l'''`, `R(0) = 0`: correct. Taylor model:
  coefficients `j!/(j-k)!·L_mid[j]`, Lagrange remainder from the series at the whole-panel ball: correct. All sign
  decisions are arb comparisons; no float decides a sign. Rerun with a different panelisation (`dh 37`): 91 panels,
  0 failures. The certificate takes `log` of a ball enclosure of the theta sum on every panel, so it also certifies
  `K_DH > 0` on `[0,1]` (truncated series); RESULT's weakest step 3 undersells this.
* Off-line DH zero: independent quadrature of `∫K_DH e^{2zu}du` gives `6e-46` at `ρ_0` against `3e-31` at `ρ_0 + 0.01`
  and `5e-30` on the line at the same height.

## 3. DH Taylor blocks: independent reproduction of 165 / 170

RESULT's two runs share one code base, the same `U` (2.151 / 2.145) and the same truncation rule (`nmax` 97 / 93), so
their agreement tests the Gauss-Legendre rule but not truncation or implementation. Referee run (`blk.py`, `ldl.py`):
own implementation, **11×260 Gauss-Legendre nodes, `U = 2.2`, 2600 bits, position-dependent theta truncation (up to
`n = 89`)**, order 170, four sequential single-process parts (591 s, 656 s, 382 s, 412 s).

| pivot | referee (11×260, U = 2.2, 2600 bits) | RESULT (12×240, U = 2.151, 3000 bits) |
|---|---|---|
| odd 168 | 3.1101723735243e201 | 3.11017237352e201 |
| odd 169 | 3.0477379041846e202 | 3.04773790418e202 |
| odd 170 | **-5.4317930029961e203 ± 1.2e189** | -5.43179300300e203 |
| even 163 | 6.5149334783825e194 | 6.51493347838e194 |
| even 164 | 7.0599596614925e195 | 7.05995966149e195 |
| even 165 | **-7.0727360054665e196 ± 4.8e182** | -7.07273600547e196 |
| even 166 | 2.1807232507962e199 | 2.18072325080e199 |

Odd signs: 169 `+` then `-` at 170. Even signs: 164 `+`, `-` at 165, `+` through 170. All signs decided by arb balls
excluding 0. Also reproduced with the same code: DH and zeta pivots 1-12; DH and zeta pivots 59, 60 (12 digits against
RESULT's files). RESULT's stored 12×240 and 16×220 pivot lists agree in all printed digits through order 180.

The numbers remain MEASURED (quadrature not enclosed), as RESULT states. Three rules, two implementations and two
integration ranges now agree at the sign change.

Share curve (`share.py`, own code, 8×6N nodes, 900 bits): `M_a⁺(-ρ_0) = -(-1)^a M_a⁺(ρ_0)` holds to 1e-107 for all
`a < 48`; `φ_min` = -1.2211036e-11, -1.532296e-7, -0.0024275511, -0.018038278 (odd, N = 8, 16, 20, 24) and
-4.0759086e-10, -5.8197678e-8, -0.0014079502, -0.018581716 (even). These equal `results/phi_table.txt` in every
digit. `S_rest ≻ 0` verified by Cholesky at these four orders.

## 4. Error: the rigidity is not functional-equation rigidity

RESULT section 4 perturbs `a(2) → λa(2)` on `r ≥ 0`, which breaks evenness, and concludes: "the low-order blocks test
evenness of the kernel (the functional equation)", "FE-rigid", "A proof must be exact in the functional equation at
every order". No even perturbation was run as a control.

Referee control (`rig.py`, zeta, `N ≤ 16`, 1100 bits, Gauss-Legendre 8×100; first order with a negative pivot,
odd / even):

| `ε` | asym: `K + ε φ_2(u)` (RESULT's case) | sym: `K + ε[φ_2(u) + φ_2(-u)]/2` (even) |
|---|---|---|
| `+1e-2` | 3 / 4 | 2 / 4 |
| `-1e-2` | 4 / 5 | 4 / 3 |
| `+1e-4` | 5 / 5 | 4 / 5 |
| `-1e-4` | 6 / 7 | 5 / 6 |
| `+1e-6` | 7 / 7 | 8 / 6 |
| `-1e-6` | 9 / 9 | 6 / 8 |
| `+1e-8` | 9 / 9 | 11 / 8 |
| `-1e-8` | 11 / 12 | 7 / 11 |

The asym column reproduces RESULT's table. The sym column keeps the kernel even and analytic, so `F(z) = F(-z)` holds
exactly, and it fails at the same orders. Evenness is therefore not what the blocks are testing. (The symmetrised
function is `ξ` plus `(ε/2)`·gamma factor·`(2^-s + 2^{s-1})`; it is outside the Dirichlet-series class, and it has
zeros far off the line at low height, near `Re s ≈ log_2(1/ε)`.)

Second control, multiplicative even perturbations (same harness, all `N ≤ 16`):

| kernel | result |
|---|---|
| `K·e^{τu²}`, `τ = ±0.1, ±0.01, -0.001, -0.0001, -0.5` | all pivots positive, both sectors |
| `K·e^{τu²}`, `τ = -2` | first negative pivot at 15 (odd) / 16 (even) |
| `K·e^{τu²}`, `τ = -8` | first negative pivot at 6 / 6 |
| `K·(1 + ε(cosh u - 1))`, `ε = ±1e-2, ±1e-4` | all pivots positive |

So the cone is not thin in every direction: a 10% even multiplicative change leaves all 32 pivots positive, while a
1e-8 change along `φ_2` (even or not) breaks order 9-11.

Corrected statement (MEASURED): the blocks of order `N` tolerate a relative error of about `10^-(N-2)` in the
prime-2 theta term, whether or not the perturbation preserves the functional equation. What can be kept from RESULT's
section 4: the tolerance table; "the certified `J_3`, `J_4` positivity is not a property of the archimedean kernel";
and the consequence for PR 56's "comparison kernel plus controlled remainder" continuation (the inradius is the
minimum over directions, so a remainder small in a fixed norm cannot work beyond a fixed order). What must go: the
words "functional-equation rigid", "test evenness", and "exact in the functional equation at every order". The
Hamburger remark stays true but does not rescue the reading, because the sym control is an FE-preserving perturbation
that the blocks reject just as fast.

Added control that RESULT lacks and that strengthens its verdict: the backward heat family is one of the three
mandatory controls in the brief. For `τ = -0.5` (where `H_τ` has non-real zeros, since `Λ ≥ 0`) all blocks of order
`≤ 16` are positive in both sectors. PR 56's low-order blocks are blind to backward heat as well as to DH. MEASURED.

## 5. Smaller defects

1. **"Every certificate in both PRs replays" (verdict item 1) is overstated.** RESULT's own table marks the two-node
   radius 1/200 and four-node radius 1/100000 certificates "UNCHECKED beyond reading" and the comparison-kernel witness
   "not replayed". The comparison-kernel determinant is now replayed (section 1.2). The two radius certificates remain
   unreplayed by anyone in this lane. Correct wording: the PR 57 certificates and PR 56's `J_1..J_4` certificate
   replay; the two continuum radii were read only.
2. **The share curve is not independent evidence for 165 / 170** (weakest step 1 says the sign changes "rest on the GL
   agreement and on the share curve reaching -1 at the same orders"). `φ` is computed from the same `S` by
   `φ = θ/(1-θ)`, `θ = eig(B UᵀS⁻¹U)`. Given `S_rest ≻ 0`, `φ_min < -1` is algebraically the same event as a negative
   pivot of `S`. The coincidence is an identity. What the curve does add is the smooth approach to -1 (-0.917 at even
   164, -0.921 at odd 169). Also `S_rest ≻ 0` is assumed at high order and was not checked there (referee checked it
   only for `N ≤ 24`). `results/phi_table.txt` carries meaningless entries (0.0, 1e-41) after the failure order.
3. **Horizon extrapolation.** "If that ratio is typical ... all blocks of order below about twice the verified height
   are consequences of the verified height" rests on one data point and is contradicted as a general rule by PR 56's
   comparison kernel: quartet at height 4.14, first failure at order 2, ratio 0.48 (section 1.2). The ratio depends on
   how much on-line zero mass the quartet has to overcome. For DH the measurement stands; the general sentence should
   be labelled OPEN, and "consequences of the verified height" is not shown for any order.
4. **Convexity tail constant.** `2·exp(-(3π/5)·0.617·e⁴) = 2e^{-63.54} = e^{-62.85}`, which is larger than the stated
   `e^{-63}`. The margin is `-2195` against about `1e-23`, so the conclusion is unaffected. The theta truncation at
   `n < 40` in `convex.py` is not enclosed (disclosed in RESULT); the omitted terms are below `e^{-1004}` relative, and
   the evenness step `l'''(0) = 0` is exact only for the untruncated kernel. "CERTIFIED" should read "certified up to
   an unenclosed truncation of relative size below 2^-1400".
5. **PR 57 on DH** was tested at `τ = 0` on `f` with a sampled sup for `B` (5% pad). It is labelled MEASURED, which is
   correct; the heat-interval part of PR 57's certificate was not run on DH.
6. **Zeta control at orders 61-180** still rests on one Gauss-Legendre rule (disclosed). The referee confirmed zeta
   pivots through order 60 with a second rule (9×115, `U = 1.8`, 1500 bits; 12-digit agreement at 59 and 60).

## 6. Checklist

| Requirement | Result |
|---|---|
| PROVED steps re-derived | Theorem A: confirmed (1.1), plus exact off-line test (1.2). Quartet identity in 3.4: confirmed by hand and to 1e-107. Verified-height bound for PR 57 (`|V(ρ)| ≤ Σ|b_j|/|Im ρ|`, factor 2 for both signs of `Im ρ`): correct. Convexity tail: correct up to the constant in 5.4. |
| Numeric / certificate rerun with a different case | 1.2, 1.3, section 2, section 3, section 4. |
| DH control | Kernel, off-line zero, blocks to order 170, share values: all reproduced. |
| RH not assumed | `checkA.py` uses on-line zeros only to list the first 400 (below verified height). Nothing else. |
| Verified height not restated as new | PR 57 is identified as a verified-height statement, correctly. The horizon sentence (5.3) is the only place where a verified-height consequence is asserted without proof. |
| Interval rigor | Signs of certified quantities are decided by arb comparisons. Pivot signs in MEASURED runs are arb-decided; quadrature is unenclosed and labelled so. `phi.py` and `dh_channel.py` use floats and are labelled MEASURED. |

## 7. Surviving claim

Neither PR 56 nor PR 57 contains a non-DH-blind mechanism. PROVED: PR 56's cutoff form equals the zero-sum (Weil)
form on the one-sided test `1_[c,∞)(K*a)`; its Taylor-block target is the same RH-equivalent positivity on tests
`p(D)K`. CERTIFIED up to an unenclosed series truncation: the Csordas convexity input holds for the DH kernel, so the
odd-cone theorem holds for DH. MEASURED, independently reproduced: DH Taylor blocks are positive through order 164
(even) / 169 (odd) and first fail at 165 / 170. MEASURED: blocks of order `N` tolerate about `10^-(N-2)` relative
error in the prime-2 theta term; this is not specific to the functional equation. MEASURED (referee): blocks of order
`≤ 16` are also positive on the backward heat family to `τ = -0.5`. PR 57 is a verified-height statement and its
disk test passes at DH's off-line zero.

## 8. Referee files (`/tmp/ref-bczc/`, not in the repo)

`blk.py`, `ldl.py` (blocks and LDL), `dh170_ldl.out` (order-170 pivots), `thA_gauss.py`, `thA_zeta2.py`
(Theorem A tests), `rig.py` (perturbation controls), `share.py` (quartet share).
