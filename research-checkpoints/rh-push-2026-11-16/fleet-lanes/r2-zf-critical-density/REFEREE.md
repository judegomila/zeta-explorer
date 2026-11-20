# REFEREE report: r2-zf-critical-density

Adversarial referee, 2026-11-16. Scope: RESULT.md in this directory. Scripts rerun from /tmp/ref-r2zf (nothing
else written here). Source lines refer to `../bypass-78/dl/2610.26835.txt`. Everything remains relative to the
unrefereed Liu 2610.26835v2.

**Finding: holds = false as labelled (two PROVED steps do not survive as written); the verdict
"precise obstruction, tau = 0, B_flat = 0.874886647 unchanged" survives after the corrections below.**

## 1. PROVED steps, re-derived

### Lemma H (1.2): CONFIRMED, but it is not by itself an obstruction
Choosing phases gives Phi >= Sum |c||R|; taking N = conj D(eta_0) gives Lambda >= max_eta ||D(eta)||^2. Both
correct. Note what the first half says: any valid upper bound for Sum_eta |R_eta|^2 is at least the true
|R_{eta_0}|^2. That is true of every inequality and does not compare the hybrid with count x sup. All of the
content for the abscissa sits in Corollary H2.

### Corollary H2 (1.2): NOT CONFIRMED as written
H2 needs |D_u(eta)| >> U^{-eps} on B, with D_u = H_{eta,u,Z} / L^S(s, eta chi-bar_u). Corollary 13.8(2)
(l.5826) gives the lower bound for 1/L^S only. For the local correction the source states the opposite of what is
used: Lemma 13.10 (l.5941-5953) ends "Nonvanishing of the product is asserted and used only on the principal
region (13.12); on the contour region only holomorphy and boundedness are used." The factors with q_p >= Q_1,
p not dividing u, are within 1/2 of 1 and their product is bounded below; the factors at p | u and at q_p < Q_1
have upper bounds only. So Lambda >= #B * U^{-2 eps} is not established, and "returns exactly count x sup,
U^{(3R+1)/4}" is not proved.

What survives without the lower bound: Lambda >= max_eta Sum_{u in B} |D_u(eta)|^2, so an N-uniform hybrid l^2
inequality is never better than the single-target Cauchy-Schwarz bound
Omega (Sum_B |D_u(eta_0)|^2)^{1/2} (Sum_B |N_u|^2)^{1/2}. Any saving would be a single-target saving (smallness of
H on most rows of B), not a product of the target average. So "the target sum contributes no factor" stands;
"exactly count x sup" should be downgraded to PROVED-rel modulo a lower bound for H on the contour region (OPEN).

Second limit, partly stated in section 7: Lambda is required independent of N. An inequality that uses
N_u = q_u^{-z0} L^S(w, chi_u) as L-values is outside Lemma H. I checked the obvious dual form: after duality the
u-sum is positive and can be extended from B to all rows, which gives a constant of size U + ... >= U > #B = U^R,
so this does not beat #B. Agreed that it gives nothing, but that is an observation, not covered by the lemma.

The Hoelder bookkeeping is right: (#B)^{1/2} (#B)^{1/4} (Sum |N|^4)^{1/4} = (#B)^{3/4} (Sum |N|^4)^{1/4} =
(14.17) at z_p = 0 (l.6569).

### 2.3, (KD)^{2/3} term: proof wrong on part of its stated range; conclusion repaired
inf_Y [max(1, Y, 2(1+Y)/3) - delta Y] = 1 - delta/2 only for delta <= 2/3. For 2/3 < delta < 1 the slope
2/3 - delta is negative on [1/2, 2] and the infimum is 2 - 2 delta at Y = 2. For delta > 3/4 this is BELOW the
bound used in the proof: delta = 0.8 gives 0.400 < 1 - 2 delta/3 = 0.467. So the chain
"R_kappa <= 1 - 2 delta/3 < 1 - delta/2 for every delta > 0, hence never the smallest option at any class" fails
on (3/4, 5/6], and `density.py` part B (gap line on [1/8, 5/6]; `third=True` hard-codes 1 - d/2) tests the wrong
quantity there. Rerun (grid Y in [0,6], 6e5 points):

| delta | inf_Y | 1 - delta/2 | 1 - 2delta/3 | max_x R_kappa |
|---|---|---|---|---|
| 0.469345 | 0.765327 (Y = 1/2) | 0.765327 | 0.687103 | 0.614784 |
| 0.70 | 0.600000 (Y = 2) | 0.650 | 0.533 | 0.351852 |
| 0.76 | 0.480000 (Y = 2) | 0.620 | 0.493 | 0.272031 |
| 0.80 | 0.400000 (Y = 2) | 0.600 | 0.467 | 0.215686 |
| 0.83 | 0.340000 (Y = 2) | 0.585 | 0.447 | 0.171657 |

Repair: from (14.3), J >= delta P, so R_kappa <= 1 - delta + (5/6 - delta)/2, and
2 - 2 delta > 1 - delta + (5/6 - delta)/2 iff delta < 7/6. With that line the conclusion "never selected at any
class" holds on all of (0, 5/6]. At the critical class (delta_c < 2/3) the written proof is correct and
1 - delta_c/2 = 0.765328 > 0.590332 stands. The inequality itself (Heath-Brown / BGL shape) is quoted from memory
in RESULT and was not re-read by me either; the statement is "this inequality gives no less than", which is safe
in the direction used.

### 2.4, Halasz-Montgomery in the conductor aspect: CONFIRMED
Duality gives R <= ||a||^2 (K + R D_0), ||a||^2 = K^{-delta}; a bound needs K^{-delta} D_0 < 1. With
D_0 <= K^{1/2} U^{2 mu} this is K^{1/2 - delta} U^{2 mu} < 1, impossible for delta < 1/2, K >= 1, mu >= 0. For
K >= U^{2+eps}: R <= K^{1-delta} >= U^{1.0613}. a_c = 0.734672, distance 0.015328 to 3/4. Matches the classical
t-aspect threshold. Scope: this is the max-over-pairs form with the Mellin bound for D_0; pair-averaged
(Jutila-type) forms are not excluded (RESULT says so).

## 2. Numerics rerun with different test cases

* Count replay (2.1), finer grid (8001 x 16001) and four new classes/kappa: minmax - formula =
  +2.7e-6, +4.7e-6, +5.0e-6, +2.7e-8, -1.9e-6, +1.2e-6 at (delta, x, kappa) = (0.4693, .5, kf), (0.41, .33, .7497),
  (0.55, .5, .75), (0.2, .1, .73), (0.7, .5, kf), (0.8, .3, kf). Converging; replay confirmed.
* relax.py on a different class grid (524 x 57, critical class inserted) and different seeds: reference
  0.874886647040 (the refereed value to 12 digits); unequal lengths +4e-16; mixing 0; both 0; pointwise only
  0.874956924. Also kappa = 0.74 (not in RESULT): unequal + mixing differs from balanced by 6e-14. No gain;
  bypass-78 confirmed. Correction: the optimiser returned b = 0.08684 / 0.08640 here against 0.08611 in the log at
  the same value, so the "balanced tangent geometry (0.37339, 0.45949, 0.16712)" is not a unique point; only l is
  pinned.
* gates.py on a 997 x 61 grid: tau = 0: 0.874886644 (all modes); tau = 1/120: 0.873735363 / 0.873814927 / 0.874;
  tau = 0.03: 0.870659 / 0.873386040 / 0.874; new tau = 0.003: 0.874474 / 0.874484 / 0.874485. Reproduced.
  Minor: in gates.log the literal row tau = 1e-3 prints the (14.10)-1a flag False (value sits on the linearised
  gate). The docstring says the class range is [1/8, 2B-1]; the code uses [1/8, 5/6]. Neither changes a reported
  digit that I could detect.
* Not re-derived: the Ingham two-class formula in density.py part C (R2 = 1/3 + (2/3) De(x1) - (2/3) delta y).
  The 0.7956 and 0.6291 figures are MEASURED / MODEL and I leave them at that label; the closed form
  3(1-s)/(2-s) = 0.629072 is arithmetic-correct.
* I did not re-derive the E, low-majorant and gate formulas from the source; relax.py and gates.py agree with the
  refereed B_flat at tau = 0, which checks them at one point only.

## 3. DH control, RH, verified height
No zero statement is made. The count of section 2 uses the Euler product at the three places listed in section 5
(inverse witness with mu * psi, identity (10.16), log L on a zero-free disk); a Davenport-Heilbronn combination has
none, so the system does not start. The large sieve and Halasz-Montgomery steps are Euler-blind and give nothing,
consistent. No step assumes RH or GRH (Dunn-Radziwill is cited only for sharpness, a remark). Verified height is
not used.

## 4. Is the obstruction real or an artifact of a weak attempt?
Partly weak. Sections 2.3-2.5 test tools that the source itself states cannot reach its count (l.5037-5038,
Remark 12.18), so their failure is expected and does not show that 0.590332 is a floor. RESULT says this (section
7 item 2). Ways around that the note leaves open:
1. Jutila-type pair averaging in the Halasz-Montgomery step (average of D_0 over (u, u')). The critical class is
   only 0.0153 below the max-form threshold, the smallest distance in the table; this is the nearest untested
   outside method.
2. The two structure-specific inputs: e(r) below (1+5r)/6 on 1 <= r <= 1.26 for Moebius-type coefficients, or M2
   prime capacity above 6 kappa (2.6). Section 4 shows such a saving must be uniform in (delta, x) to realise
   -0.137 tau, and that the Remark 14.1 gates must be rewritten to pass 0.873386.
3. For section 1: a single-target estimate of Sum_{u in B} N_u D_u(eta_0) with cancellation in u, or smallness
   of H on B. Lemma H does not address either.

## 5. Corrected statement that survives
Relative to unrefereed Liu 2610.26835v2: no count saving tau > 0 is obtained and B_flat = 0.874886647 is
unchanged. PROVED: an N-uniform phase-blind hybrid inequality over a target set has constant at least
max_eta Sum_{u in B} |D_u(eta)|^2, so it gives no more than single-target Cauchy-Schwarz; that this equals
count x sup U^{(3R+1)/4} is PROVED-rel only modulo a lower bound for H_{eta,u,Z} on the contour region, which the
source does not assert. PROVED: the general (KD)^{2/3} large sieve gives at least min(1 - delta/2, 2 - 2 delta),
which is 0.7653 at the critical class and exceeds R_kappa at every class (with the repaired comparison).
PROVED: max-form Halasz-Montgomery gives nothing for delta < 1/2. MEASURED and MODEL items as in RESULT,
reproduced on different grids. Obstruction is for the named methods only; it is not a lower bound for the count.
