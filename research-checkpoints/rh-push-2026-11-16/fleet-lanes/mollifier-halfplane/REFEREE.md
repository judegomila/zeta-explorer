# REFEREE: mollifier-halfplane/RESULT.md

Verdict on the claimed verdict (precise-obstruction): **holds, with one wrong constant, one proof gap that the
referee closes below, and one overstated sentence in the obstruction.** No RH assumption found. No verified-height
input used. Nothing new is claimed about the proportion, and that is correct.

Labels as in the brief. "Referee" marks work done in this review (numpy, independent code, no reuse of the
author's scripts).

## 1. Lemma 1 (closed form) - CONFIRMED

Re-derived. With int_0^1 P P' = 1/2 and int_0^1 q q' = (q1^2 - 1)/2:

    c = 1 + (1/theta)[ A int P'^2 + theta (q1^2-1)/2 + theta^2 C int P^2 ]
      = (1 + q1^2)/2 + (A/theta)( int P'^2 + lam^2 int P^2 ),  lam = theta sqrt(C/A),

and the minimum of the bracket under P(0)=0, P(1)=1 is lam coth lam (Euler-Lagrange P'' = lam^2 P). Result:
(1+q1^2)/2 + sqrt(AC) coth(theta sqrt(C/A)). Correct.

The functional itself matches the Bui-Conrey-Young one-piece form: d/dx[e^{R theta x} P(x+u) Q(v+theta x)] at x=0,
times e^{Rv}, equals P'(u) q(v) + theta P(u) q'(v). Sanity anchor: P=x, Q=1-x, theta=1/2, R=1.3 gives 0.3427 in
`levinson.out`, which is Levinson's original 0.342.

Referee numeric test, different case (theta=0.8, R=0.9, Q = 1 - 1.1x + 0.2((2x-1)^3+1), which satisfies the
symmetry): closed form 2.048532304510, direct double integral with the sinh profile 2.048532304510. Non-optimal P
give larger values (P=u: 2.050837; P=u^2: 2.390998; sinh + 0.05 sin(pi u): 2.063299), as a minimum requires.

Independent optimisation (odd-power basis about 1/2, degree 7, coordinate search): theta=1/2 -> 0.365815
(R=1.4761); theta=4/7 -> 0.408959 (R=1.2916); theta=0.7 -> 0.475348 (sits between the tabulated 2/3 and 3/4
values). The table entries checked are reproduced.

## 2. Proposition 2 (ceiling) - inequality CONFIRMED; uniform statement NOT proved as written

Steps (i)-(iii) re-derived and correct: h(r) = 1/theta + sum 2 theta r/(theta^2 r + n^2 pi^2) is concave
increasing; the tangent-line representation gives alpha, beta > 0; q(1/2) = (e^{R/2} + e^{-R/2} q1)/2 follows from
Q(1/2) = (1+Q(1))/2; the two-arc minimum formula is right for arcs of length 1/2. The chain
c >= (1+q1^2)/2 + inf_{r0} E is valid (for each r0, alpha A + beta C >= E(r0)).

Referee grid (own code, coarser): 0.58795 at theta=4/7 (R=1.023, q1=-0.076), 0.69373 at theta=1 (R=0.742,
q1=0.109), 0.97073 at theta=10. Agrees with 0.5880 / 0.6939 / 0.9709. Extra probes outside the author's emphasis:
R in {8, 15, 30} gives at most 0.173; R in {0.001, 0.003} gives large negative values at theta <= 1.

Gap. The header says "bounded by an explicit number < 1, uniformly in P, Q, R" and is labelled PROVED. Step (iv)
proves only the pointwise statement kappa < 1 for each (P,Q,R). It also argues about c, not about c_lb, so it does
not show c_lb > 1. The author flags interior attainment as MEASURED, but the consequence drawn in the next
paragraph ("100% requires theta -> infinity; no finite length suffices") needs the uniform bound, not the
pointwise one.

The pointwise claim is correct and has a shorter proof than (iv): sqrt(AC) >= |int q q'| = |q1^2-1|/2 and
coth > 1, so c > max(1, q1^2) >= 1 when C > 0; C = 0 forces q = 1 and c = 1 + 1/theta.

Referee closure of the gap (sketch, not written out in full; label it PROVED only after someone writes it out).
Fix theta < infinity.
- Large R. Piecewise Cauchy-Schwarz gives sqrt(AC) >= (q(1/2)^2 - 1)/2. If |q1| >= e^R/4 then c >= q1^2/2 >=
  e^{2R}/32. Otherwise q(1/2) >= (3/8) e^{R/2} and c >= 9 e^R/128. Either way log c >= R - 2.66, so
  kappa <= 2.66/R, below 0.45 for R >= 6.
- R in (0, 6]. It suffices that c >= 1 + delta(theta) > 1 uniformly, since then kappa <= 1 - log(1+delta)/6.
  Take a minimising sequence with c <= 2, so AC <= 4 and A <= 2 theta. If A stays bounded below, C is bounded,
  the sequence is weakly compact in H^1, point values and the constraint pass to the limit (R = 0 included), c is
  lower semicontinuous, and the limit has c > 1 by the pointwise argument. If A -> 0, q is small off three boundary
  layers and piecewise Cauchy-Schwarz gives c >= 1 + q1^2 + q(1/2)^2 - o(1) >= 1 + 1/5 - o(1), because
  q1^2 + (e^{R/2} + e^{-R/2} q1)^2/4 >= e^R/(4 + e^{-R}) >= 1/5.
So the uniform ceiling is true at every finite theta, without the grid.

Remark worth adding to RESULT.md: the ceiling comes entirely from the constraint Q(x)+Q(1-x) = const. Without it,
q = e^{-kv} gives c = 1 + (1 - e^{-2k})(coth(theta k) - 1)/2 -> 1 as k -> infinity at fixed R, so the functional
would reach 1 at every finite theta. Any mis-recall of that constraint would change the conclusion; it is the
one hypothesis to source-check (Conrey 1989: Q(0)=1, Q'(x) = Q'(1-x)).

## 3. sup = 1 at theta = infinity - CONFIRMED, constant WRONG

With Q = 1 - Rx: q1^2 = e^{2R}(1-R)^2 = 1 - R^2 + O(R^3), A -> 1, C = R^4/3 + O(R^5). Hence

    c = 1 + (1/sqrt 3 - 1/2) R^2 + o(R^2) = 1 + 0.07735 R^2,

not (2/sqrt 3 - 1) R^2 = 0.1547 R^2 as stated (factor 2). Referee numerics: (c-1)/R^2 = 0.08827, 0.07836, 0.07745
at R = 0.1, 0.01, 0.001. The conclusion log(c)/R -> 0 is unaffected; kappa = 0.99992 at R = 0.001.

## 4. Obstruction (section 3) - real, one sentence overstated

The length 4/7 comes from Deshouillers-Iwaniec bounds for averages of Kloosterman sums, an input about the
GL(2)/Q spectrum, not about zeros of zeta. That part is right, and the author correctly labels the section as
structural, not a theorem.

Overstatement: "ZF(Theta) says nothing about the rest." After Kuznetsov, the off-diagonal splits into cuspidal and
Eisenstein parts. In the Eisenstein part mu is paired with n^{-it} sigma_{2it}(n), whose generating series is
1/(zeta(s+it) zeta(s-it)). A zero-free half-plane does bound that piece. It is not the binding piece: the cuspidal
part pairs mu with Hecke eigenvalues lambda_j(n), with generating series ~ 1/L(s, u_j), and ZF(7/8) for zeta gives
nothing there. So the obstruction survives, but the precise statement is "ZF(7/8) reaches only the continuous
spectrum; the cuspidal spectrum fixes the length."

The GRH remark (nontrivial only for k < H^{1/2}) is a pointwise-in-modulus heuristic. The actual proofs average
over moduli, so it does not show that GRH cannot help; "by this route" should stay attached to it.

One way around (not attempted by the author, not claimed to work): a zero-free half-plane for the family
L(s, u_j), uniform in the spectral parameter, would be an input of the right type for the cuspidal part. Whether
the openai/math method transfers to GL(2) twists is the question to ask; the cubic rows as they stand do not give
it. Second, weaker option: multi-piece mollifiers (Feng, BCY, PRZZ) are outside Proposition 2, so "no finite
length gives 100%" is established for one-piece only. The author says this in section 7.

## 5. DH control - adequate

The failing step is named: the mollifier is a truncation of 1/zeta, which needs 1/zeta analytic in sigma > 1; the
Davenport-Heilbronn function has zeros there. That is a use of the Euler product, as required. The note that the
conclusion (positive or full proportion) does not separate zeta from DH-type combinations is correct and is
consistent with MV-CAP. No RH claim is made, so the DH wall is not violated.

## 6. Other checks

- RH is not assumed anywhere. Values at theta >= 4/7 are stated as conditional on an unproved mean-value
  asymptotic. Bettin-Gonek (theta = infinity implies RH) is cited in the right direction.
- No verified-height statement is used or relabelled.
- `ceiling.out` at theta = 1000 reports its optimum at R = 0.0100, the edge of the R grid. The published table
  stops at theta = 100 (R = 0.025, interior), so the table is unaffected; the theta = 1000 line should not be
  quoted.
- `levinson.out` contains a stale line "ceiling=1.000000 at R=0.002" from an earlier, wrong ceiling routine. It is
  superseded by `ceiling.py`; delete or annotate it.
- Literature attributions are from memory (author's own caveat). Not source-checked here either.

## 7. Required corrections to RESULT.md

1. Section 2: replace (2/sqrt 3 - 1) by (1/sqrt 3 - 1/2).
2. Proposition 2: either relabel the uniform bound MEASURED, or include the compactness argument of section 2
   above and keep PROVED.
3. Section 3 part 1: replace "says nothing about the rest" by the continuous/cuspidal statement.

## 8. Surviving claim

No longer mollifier, no better Kloosterman error term, no proportion above 5/12. Proved: the closed form for the
one-piece functional after optimising P; kappa < 1 for each admissible (P,Q,R) at finite theta; supremum 1 as
theta -> infinity. Measured and reproduced: 0.3658 at 1/2, 0.4090 at 4/7; grid ceilings 0.588 at 4/7, 0.694 at 1.
Obstruction: structural, real, limited to one-piece mollifiers and the known Kuznetsov architecture. RH open.
