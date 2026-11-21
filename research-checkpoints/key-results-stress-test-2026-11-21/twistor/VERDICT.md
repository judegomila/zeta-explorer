# VERDICT: twistor ("Twistor duality and the dual intertwiner")

## What is actually established
1. Classical identity, restated in split-twistor language: on even functions on S^3 the normalised Fourier
   intertwiner of homogeneous distributions on R^4 has multipliers b_m(w)=prod_{j<=m}(w-2j)/(w+2j); with unramified
   p-adic factors and a chosen rational factor it is multiplied by xi(w-1)/xi(w+2), which is bounded by 1 on Re w>0
   by the known wide-shift inequality (a>=1/2). Value at w=2: 15/(2 pi^2) on constants. Checked to 1e-51.
2. Computer-assisted bound (mpmath interval arithmetic, not a proof assistant): for Suzuki's truncated Hankel
   operator H_{a,L} built from xi(z-a)/xi(z+a), ||H_{1/4,L}|| <= 49999/50000 for 1<L<=3/2; <= 99999/100000 for
   a in [0.24999998, 0.25000002]; and ||H_{a,L}|| <= 2^-a for 0<a<=1, L<=1.02259. No hypothesis on zeros.
3. Three scoped negative statements: no holomorphic operator q-th root of the bridge near w=2 on finitely many
   copies unless q divides the multiplicity; the kernel of xi(z-a)/xi(z+a) is negative on (log 3/2, log 2) for
   0<a<=1; the absolute-value kernel at a=1/4, L=3/2 has norm > 1.049.
4. Lean: a five-line diagram chase for linear maps over a commutative ring (three intertwining hypotheses imply a
   fourth on a range). No sorry in the source; not compiled locally (no Mathlib build present).
5. The original /twistor encoding and the 3D /viz-twistor-dual-intertwiner page are illustrations. The incidence
   2(sigma-1/2)cos(t log 2) vanishes on sigma=1/2 by construction for every t, zero or not.

## Replay
- test-rigorous-twistor.mjs: 2359 checks pass. certify_signed_window.py: re-certified, gaps 2.228e-5 and 1.741e-3.
  certify_absolute_obstruction.py: [1.04945, 1.06515]. verify_subdivision 2933/2933, verify_structure 11/11.
- Own code: Fourier coefficients lambda_0..16 agree with the certificate to 1.1e-15; own Galerkin gives
  0.9999617207765719 at N=1024 (report: 0.999961720777), 0.99996244 at N=4096, extrapolating to ~0.9999625,
  below 0.99998. Kernel Mellin identity confirmed to 4e-41 at six widths.

## Stress test
- The certified inequality is not specific to zeta's zeros. With each function's own gamma factor, at a=1/4:
  L(chi_3), L(chi_4), L(chi_5) and the Davenport-Heilbronn function all have norm < 1 at L=3/2 (DH: 0.880, zeta:
  0.99996). DH stays below 1 up to L=6 and exceeds 1 from L about 7 (1.049 at L=8, 1.091 at L=12), while zeta is
  0.99999992 at L=12. At a=1/3 (above 0.8085-1/2) DH is back below 1 at L=12. So Suzuki's global criterion
  separates DH, but only at windows about 5 times larger than the certified one; the certified window does not.
- The window does constrain the n=2 coefficient: with zeta's gamma factor fixed, contraction holds only for
  c(2) scaled by about 0.82 to 1.04. This tests the match between the Euler factor at 2 and the completion
  (unimodularity of the symbol), not zero locations.
- a=1/4, L=3/2, cutoff 16, delta=17/20 are choices. A sweep over a in {1, 1/2, 1/4, 1/10, 1/20} and L up to 5
  finds norm < 1 everywhere (uncertified), with 1-norm of order 1e-6 to 1e-7 for L>=2.
- Margin is thin: true top eigenvalue ~0.9999625 against the bound 0.99998.

## Errors found
- Illustration text on the working-branch TwistorPage.jsx: "|chi(s)|=1 happens exactly at sigma=1/2" is false
  (|chi(0.75+6.288173i)|=1; |chi(-16.406145)|=1). "Twistor norm vanishes on-shell" is false (norm >= 1).
  "Known zeta zeros sit precisely on this locus" is true of every point with sigma=1/2. The map Z -> chi Z does not
  give the dual W of the same encoding (mismatch 0.71 and 1.73 at the first zero). The "Penrose transform"
  correlation compares |Euler product| with a reweighted copy of itself. The branch
  codex/twistor-rigorous-model-2026-10-03 already demotes this layer to "Illustration / analogy".
- scripts/test-rigorous-twistor.mjs is not present on the working branch editorial-redesign; it lives on the codex
  branch (the research package is on the public clone's main).
- No mathematical error found in the report's certified statements. Rigour depends on mpmath.iv; not redone in Arb.

## Literature
Operator, kernel and RH criterion: Suzuki (arXiv:1204.1827; arXiv:1606.05726). Wide-shift inequality: Lagarias
(arXiv:math/0601653). Multipliers and local factors: classical (Gelfand-Shilov, Tate, Langlands constant term of
the 4-variable Epstein/Eisenstein series). The particular certified window and the root obstruction were not found
in four searches; the search was shallow and the package itself makes no priority claim. Classification: explicit
certificate at chosen parameters for an operator defined in the literature, plus a restatement of known identities.

## Scores
- Arbitrariness 4/5. The name-bearing "twistor" layer is either an encoding fixed by hand or a known intertwiner
  with a hand-chosen completion (only a=3/2 comes out of the 4-dimensional geometry). The certified statement is
  one point (a=1/4, L=3/2) of a two-parameter family in which nothing singles it out.
- Importance 2/5. No consequence for RH or for the de Bruijn-Newman constant; the certified window is passed by
  the Davenport-Heilbronn function. The negative statements rule out only strategies posed inside the project
  (identical-stage subdivision, positive scalar delay kernels, sign-discarding bounds). A specialist would
  recognise Suzuki's criterion and the classical intertwiner and would not learn a new fact about zeta.

## Wording for a public page
"Interval-arithmetic bound ||H_{1/4,L}|| <= 0.99998 (1<L<=3/2) for Suzuki's truncated Hankel operator, with a
split-twistor description of the classical width-3/2 xi-ratio intertwiner; the Davenport-Heilbronn function
satisfies the same bound, so it gives no zero information."
