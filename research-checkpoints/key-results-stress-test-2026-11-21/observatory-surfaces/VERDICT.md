# VERDICT: observatory-surfaces

Date 2026-11-20. Sources: public clone `zeta-explorer-publisher/observatory/` (origin/main 7ab2fcae) and
the private lanes `push/s5-klein-torus-shift-bridge-charts`, `push/c15-klein-transport-lemma-w-stage-a-and-e1`,
`push/g-klein-bottle-seam`. Scripts and outputs of this check: `replay/`, `mine/`, `NOTES.md`.

## What the item is

A browser visualisation of zeta, xi and the de Bruijn-Newman heat family on a plane, a sphere, an elliptic
double cover (torus) and its Klein-bottle and annulus quotients, plus three small computer-assisted
certificates and a set of exact but classical identities. It makes no statement about RH or about the
de Bruijn-Newman constant, and the repository says so.

## Mathematics (replayed)

| # | Statement | Kind | Replay |
|---|---|---|---|
| M1 | All zeros of zeta with 0 < Im s < 2000 (1517 of them) are on the line and simple | Arb interval certificate of a classical fact | regenerated in 4 min 55 s: 1517 discs winding 1, rectangle winding 3033; identical to the shipped record; independent Arb count N(2000) = 1517; 34 discs re-checked by other methods |
| M2 | F_tau = 8 H_tau has exactly one zero, simple and on the line, in the disc of radius 0.35 about 1/2 + 14.134725141734693 i for all real tau in [-0.05, 0.05] | Arb interval certificate (Taylor-Rouche plus a positive-kernel perturbation bound with explicit tails) | verifier accepts, margin 6.532e-5; F_0 = xi and the heat equation confirmed to 1e-31 or better; tail bounds re-derived by hand |
| M3 | The quartic P_u(z) = z^4 + (12u-5)z^2 + 12u^2 - 10u + 4 has four simple real roots in four disjoint discs for 0 <= u <= 0.13 | exact rational certificate about a toy polynomial, not about zeta | verifier accepts (520 cells, min margin 0.02044); closed-form roots lie within 7.2e-5 of the certified centre lines |
| M4 | Involutions R, D, A on the Jacobi chart; A free; Klein and annulus quotients; f o A = conj f for xi and the heat family; energy factor 2; annulus DtN matrices | exact identities, classical (real elliptic curve without real points) | formulas confirmed numerically to 1e-16; raw zeta fails the symmetry as stated |
| M5 | Q_{a,T} = cosh(s-1/2) x (real even quartic) has all the symmetries used and four off-line zeros | elementary counterexample to "the topology traps zeros" | zeros, positivity on the real axis and symmetry confirmed |
| M6 | Fourier modes of d/du log F on circles v = const decay as exp(-pi k (K'/K) dv) on zero-free sub-annuli | Laurent expansion on an annulus; holds for every holomorphic F | xi and the control give the same ratios to 16 digits; a jump occurs only across a circle carrying a zero |
| M7 | Zero ODE rho' = -F_ss/(4 F_s), graph-Laplacian linearisation, gap equation q' = 2 - qS | classical (Csordas-Smith-Varga 1994; Polymath15 Prop. 3.1) | algebra re-derived |

## Visualisation (no theorem attached)

The torus, sphere, Klein and annulus renderings; projective, spinor, twistor and dual-conormal panels; Newton
fall lines; the coupling-network drawing; the Gaussian-damped display and the hole at infinity; the 723-frame
moving theta channels at radii 0.01, 1e-4, 1e-5 (floating point, labelled "candidates" by the repo); the
in-browser "complete count to height T" (floating point). The Klein phase-transport certificate of lane c15
is an inequality that is positive only at bounded height, on a hypothesis that already contains its conclusion
(the lane's own finding).

## Stress tests

1. Controls. The one-zero symmetric-disc test returns 2 on the Davenport-Heilbronn off-line pair
   (0.808517 + 85.699348 i, radius 0.35), 0 at radius 0.25, and 1 at an on-line Davenport-Heilbronn zero; the
   same pattern for Q_{a,T}. It is a per-zero check that behaves the same way for functions violating RH.
   The mode-transport law is identical for xi and the control. Nothing in the item distinguishes zeta.
2. Tuned parameters. In M2 the pair (radius 0.35, interval 0.05) lies inside the window where the chosen bound
   closes: it fails beyond |tau| = 0.0613, and at radius 0.1 or 0.2 it fails at 0.05. The zero itself stays in
   the disc at least for -1 <= tau <= 2 (heights 14.4256 to 13.5596). In M3 the endpoint 0.13 and radius 0.01
   are conveniences (the method reaches 0.13406 with radius 1e-4; the collision is at 0.134070).
   Height 2000 in M1 is the limit of the app's evaluator.
3. No circularity, normalisation slip or off-by-one found in M1-M3. The rigour of M1 and M2 rests on Arb and on
   about 700 lines of Python; nothing is formalised in Lean.
4. Wording. The README link "Certified quartet channels at tau = -0.13" concerns the toy quartic; the label can
   be read as a statement about zeta. "Zero channels" and "transport comparison" in the listed claim suggest
   structure specific to zeta; the supported statements are M2, M3 and M6 above.

## Literature

Finite-height verification: Platt-Trudgian 2021 (3e12), after Gram, Backlund, Titchmarsh, Turing, Lehmer and
others; M1 reproduces the first 1517 zeros. Heat flow: de Bruijn 1950, Newman 1976, Csordas-Smith-Varga 1994,
Rodgers-Tao 2018, Polymath15 2019. Klein surfaces: Alling-Greenleaf 1971. Flows and phase portraits of zeta:
Broughan-Barnett 2003, Neuberger et al. 2014, Steuding-Wegert 2012. Six web queries; I did not find the
specific elliptic double cover with its Klein quotient applied to xi, nor a published certificate of the
exact local statement M2. Both are assemblies of standard tools and neither yields a statement about zeros
beyond the disc or height certified.

## Scores

- Verification: confirmed, in the weaker form above (certificates of known or local facts plus pictures).
- Arbitrariness: 4 of 5. Parameters r, L, cut-offs, radius 0.35, interval 0.05, height 2000 and the toy quartic
  are choices; the canonical parts (M4, M6, M7) are classical.
- Importance: 1 of 5. No consequence for RH or for bounds on Lambda; no method is ruled out beyond the
  elementary observation M5 that symmetry and topology alone place no zero.

## One-line statement for a public page

An interactive display of zeta and its heat-flow family on a torus, a sphere and a Klein surface, with
interval-arithmetic checks that the zeros below height 2000 are on the critical line and that the first zero
stays on it for heat parameter between -0.05 and 0.05; the displays and checks apply equally to functions
that violate the Riemann hypothesis.
