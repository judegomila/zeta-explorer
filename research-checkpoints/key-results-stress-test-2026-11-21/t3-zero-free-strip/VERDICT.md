# VERDICT — t3-zero-free-strip

**Claim as listed.** "Twin-ladder T3 equals a zero-free-strip statement, with the dictionary verified numerically to 1e-30."

**What the material supports.**
1. Identity (exact, elementary): with the de Bruijn profile Phi, A_a(z) - i B_a(z) = Xi(z+ia) = xi(1/2 - a + iz). This is the
   repo's own definition E_a(z) = X(a - iz) written out, via the angle-addition formula.
2. Classical equivalence: for a real-even entire function of genus <= 1, the de Branges kernel of E_a = Xi(.+ia) is PSD on C+
   if Xi has no zeros with |Im| > a; conversely PSD implies no such zeros except in a degenerate configuration
   (off-strip zeros vertically aligned and mirror-symmetric about height a). For zeta: strip(a) => T3(a); T3 along a sequence
   a_n -> a0 implies zero-free for Re s > 1/2 + a' for every a' > a0; "T3(a) for all a > 0" <=> RH.
3. "T3" here means the ideal exact kernel. The repo's computed three-channel objects are at shift a/2 (factor 2) and use a
   cutoff-dependent pseudo-inverse; their equivalence with the ideal kernel is a sketch, not a checked statement.

**What "verified to 1e-30" is.** Rounding error of cos(2(z+ia)u) = cosh(2au)cos(2zu) - i sinh(2au)sin(2zu) at 40 digits.
It carries no information about zeta. The original full-identity check used Phi = exp(-u^2), not the zeta kernel (1.1e-15).

**Replay (this audit; mpmath; t3_check.py, run2.log).**
- Trig core: 2.8e-32 at 40 dps, 4.0e-92 at 100 dps (error tracks precision). Wrong-sign and factor-2 controls: 0.72, 0.26.
- Full identity with the actual Phi against xi from Gamma*zeta, 50 dps, 5 points: relative error 1.6e-51 to 6.4e-51. Normalising constant is 1.
- Zeta, a = 0.5, 0.25, 0.1, 0.02: grid sup|Theta_a| = 0.99908 .. 0.99996 < 1 on 0.37<=x<=60; 10-point Gram minimum eigenvalue positive.
- Davenport-Heilbronn control: off-line zero at 0.808517182456637 + 85.6993484853776i (b = 0.30852). Kernel fails for a = 0.20, 0.30
  (grid sup|Theta| 37.4, 11.0; Gram min -0.160, -0.0054; K(z0,z0) < 0) and passes locally for a = 0.31, 0.40. Threshold at a = b.
- Aligned-pair polynomial toy: kernel PSD at a = 0.3 although zeros with Im = 0.4 exist; fails at a = 0.28, 0.32.

**Findings against the popular wording.**
- The dictionary is not specific to zeta: it holds identically for Davenport-Heilbronn and for polynomials.
- "Equals"/"exactly" at fixed a is too strong; the exceptional case is real (toy E) and is recorded in the long verdict
  document but omitted in the one-line claim, the concept registry and the .tex.
- A finite numerical test of T3(a) cannot certify a strip: the DH window test passes at a = 0.31 and 0.40 although DH has
  zeros with Re s > 1 elsewhere.
- No Lean, no interval certificate; the page "assertions" are string checks.
- No circularity found: the statement is an equivalence and is used as a reclassification, not as progress toward a strip.

**Literature.** Known. Lagarias, Acta Arith. 120 (2005), arXiv:math/0601653, Lemma 6.1: E_h(z) = xi(1/2 + h - iz) is a de Branges
structure function for h >= 1/2 unconditionally and for all h != 0 under RH; the Hadamard-factor proof gives the strip version
unchanged and the converse is the definition of Hermite-Biehler. Background: de Branges 1968; de Bruijn 1950; Lagarias 2006
(Frontiers volume); Conrey-Li 2000.

**Scores.** Arbitrariness 2: the statement is canonical; the only choice-dependent parts are the 1e-30 figure (a precision
setting) and the a vs a/2 rung label. Importance 2: no new information about zeta, RH or Lambda; its use is internal — it
identifies the programme's "T3" frontier with a quasi-Riemann hypothesis, which rules out closing it by norm estimates on
that kernel. A specialist would recognise it as Lagarias's lemma.

**Status.** Classical fact, restated; proof sketch in notes, unrefereed. Verification: confirmed in a weaker form.

**Suggested public wording.** "The project's T3(a) positivity condition is the de Branges kernel condition for xi(1/2 + a - iz);
by a known lemma (Lagarias 2005) it holds when zeta has no zeros with Re s > 1/2 + a, and holding for all a > 0 is
equivalent to RH. It is a restatement, not a new result."
