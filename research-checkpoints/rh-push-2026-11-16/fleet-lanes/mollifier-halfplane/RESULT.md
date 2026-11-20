# mollifier-halfplane: proportion of critical zeros vs. the 7/8 half-plane inputs

Verdict: **precise obstruction.** The 7/8 half-plane and its cubic-row inputs do not lengthen the Levinson mollifier
or improve its Kloosterman error terms; the unconditional proportion stays at the Pratt-Robles-Zaharescu-Zeindler
value 5/12. Reaching 100% inside the Levinson-Conrey functional needs mollifier length theta -> infinity, and that
hypothesis already implies RH (Bettin-Gonek). No new proportion is claimed. RH open, no QED.

Labels: PROVED (here), CLASSICAL (literature, recalled from memory, no web check in this run), MEASURED (numerics
here), OPEN.

## 0. Plan, and what is new against the atlas and walls

The atlas (PR #27 historical-routes.md) has no Levinson/mollifier section; `formalization/paper/mv-cap-theorem.md`
lists Levinson/Conrey/PRZZ counts as MV-CAP-blind and records the Bettin-Gonek loophole. Sibling `bootstrap`
(Lemma 1) shows that under ZF(theta) alone a mollifier of length X costs X^{2 theta - 1} on the critical line. Not
repeated here. New here:

1. A closed form for the one-piece Levinson-Conrey functional after optimising P, and the value it gives at every
   mollifier length theta (section 1).
2. A proved ceiling < 1 on that functional at every finite theta (section 2).
3. An account of which inputs fix the length 4/7 and why ZF(7/8) and the cubic rows do not enter (section 3).
4. The 100% question (section 4) and the DH control (section 5).

## 1. The functional and its value at each length

CLASSICAL (Conrey 1989; Bui-Conrey-Young 2011, one-piece case). Let P(0)=0, P(1)=1; Q real, Q(0)=1,
Q(x)+Q(1-x) constant; R>0; mollifier sum_{n<=T^theta} mu(n) P(log(y/n)/log y) n^{-s}. If the mollified mean-square
asymptotic holds at length theta, the proportion kappa of zeros on the line satisfies

    kappa >= 1 - (1/R) log c,   c = 1 + (1/theta) int_0^1 int_0^1 (P'(u) q(v) + theta P(u) q'(v))^2 du dv,
    q(v) = e^{Rv} Q(v).

The asymptotic is a theorem for theta < 4/7 (Conrey, via Deshouillers-Iwaniec) and is Farmer's conjecture for all
theta.

**Lemma 1 (PROVED; the sinh optimum is in Conrey).** With A = int q^2, C = int q'^2, q1 = q(1) = e^R Q(1):

    min over P of c  =  (1 + q1^2)/2 + sqrt(AC) coth(theta sqrt(C/A)),

attained at P(u) = sinh(lam u)/sinh(lam), lam = theta sqrt(C/A).
*Proof.* Expand the square. The cross term is 2 theta (int P P')(int q q') = theta (q1^2 - 1)/2. The rest is
(A/theta)(int P'^2 + lam^2 int P^2), minimised under the boundary conditions by the sinh profile with value
lam coth lam. ∎ (Check: closed form 2.3323413023 = direct double integral 2.3323413023 at Q=1-x, R=1.3, theta=1/2.)

MEASURED (`levinson.py`, `achieved.py`, `achieved.out`; Q of degree up to 9, R free; values converge in degree):

| theta | best one-piece kappa | linear Q (simple zeros) | note |
|---|---|---|---|
| 1/2 | 0.365816 | 0.356269 | reproduces Conrey 1983 0.3658 |
| 17/33 | 0.375374 | 0.366544 | BCR general-coefficient length |
| 6/11 | 0.393828 | 0.386210 | PRZZ second-piece length |
| 4/7 | 0.408959 | 0.402193 | reproduces Conrey 1989 0.4088 |
| 3/5 | 0.424899 | 0.418913 | |
| 2/3 | 0.459403 | 0.454780 | |
| 3/4 | 0.497784 | 0.494287 | |
| 7/8 | 0.547082 | 0.544620 | |
| 1 | 0.588407 | 0.586572 | |
| 2 | 0.770268 | 0.769851 | |
| 5 | 0.913004 | 0.912958 | |
| 10 | 0.963394 | 0.963387 | |
| 100 | 0.998835 | 0.998835 | |

One-piece length needed (MEASURED): kappa = 5/12 at theta ~ 0.585; 1/2 at ~ 0.755; 2/3 at ~ 1.31; 0.9 at ~ 4.43.
These are values of the functional. For theta >= 4/7 they are conditional on a mean-value asymptotic that is not
proved. The multi-piece mollifiers (BCY 0.4105, PRZZ 5/12 at lengths 4/7 and 6/11) are not modelled here.

## 2. Ceiling at finite length

**Proposition 2 (PROVED inequality; MEASURED evaluation).** For every finite theta the one-piece functional is
bounded by an explicit number < 1, uniformly in P, Q, R.

*Proof.* (i) h(r) = sqrt(r) coth(theta sqrt(r)) = (1/theta)(1 + sum_n 2 theta^2 r/(theta^2 r + n^2 pi^2)) is
concave and increasing with h(0) = 1/theta > 0. So A h(C/A) = inf over r0 > 0 of alpha(r0) A + beta(r0) C, with
beta = h'(r0) > 0 and alpha = h(r0) - r0 h'(r0) > 0.
(ii) The constraint Q(x)+Q(1-x) = 1+Q(1) fixes three values: q(0) = 1, q(1) = q1,
q(1/2) = (e^{R/2} + e^{-R/2} q1)/2.
(iii) For each r0, int (alpha q^2 + beta q'^2) over functions with those three values is at least the two-arc
minimum E(r0; R, q1) = beta om [ (a^2+b^2) coth(om/2) - 2ab/sinh(om/2) ] summed over (a,b) = (1, q(1/2)) and
(q(1/2), q1), om = sqrt(alpha/beta).
Hence c >= c_lb(R, q1, theta) = (1+q1^2)/2 + inf_{r0} E, and kappa <= sup_{R, q1} [1 - log(c_lb)/R].
(iv) c_lb > 1: equality c = max(1, q1^2) needs q' proportional to q, and e^{kv} violates (ii) unless q is constant,
where c = 1 + 1/theta. So kappa < 1 for each admissible (P, Q, R). That the sup over R is attained at interior R
(not at R -> 0 or R -> infinity) is MEASURED on the grid below, not proved. ∎

MEASURED evaluation of the sup on a grid (`ceiling.py`, `ceiling.out`; not interval-certified):

| theta | 1/2 | 4/7 | 2/3 | 3/4 | 7/8 | 1 | 2 | 5 | 10 | 30 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ceiling | 0.5675 | 0.5880 | 0.6148 | 0.6370 | 0.6672 | 0.6939 | 0.8220 | 0.9312 | 0.9709 | 0.99389 | 0.99906 |
| achieved (sec. 1) | 0.3658 | 0.4090 | 0.4594 | 0.4978 | 0.5471 | 0.5884 | 0.7703 | 0.9130 | 0.9634 | 0.99228 | 0.99884 |

The ceiling uses three point values of Q only, so it is loose at small theta and tight at large theta. Consequence:
in the one-piece class, 100% requires theta -> infinity; no finite length suffices. At theta = infinity the supremum
is 1 (PROVED: Q = 1 - Rx, R -> 0 gives c = 1 + (2/sqrt 3 - 1) R^2 + o(R^2), so log(c)/R -> 0).

## 3. Does ZF(7/8) or the cubic-row input lengthen the mollifier? No.

Where the length comes from (CLASSICAL). In int |zeta M|^2 the diagonal hm = kn gives the main term. The
off-diagonal hm - kn = r, after Poisson/Estermann, is a sum of Kloosterman sums S(m, n; c) over Z with trivial
multiplier, with moduli built from h, k <= y. The admissible length is fixed by the bound for that sum: trivial
y^2 (theta < 1/2, BCH), Weil y^{17/9} (9/17), Kuznetsov with the bilinear structure of mu (Deshouillers-Iwaniec:
y^{7/4}, theta < 4/7), general coefficients 17/33 (Bettin-Chandee-Radziwill), PRZZ second piece 6/11.

Obstruction, three parts:

1. **Input type mismatch.** ZF(Theta) is equivalent to sum_{n<=x} mu(n) n^{-it} << x^{Theta+eps}(1+|t|)^eps: it
   controls mu against archimedean characters only. In the off-diagonal, mu(h) is paired with e(a hbar/k) or with
   Dirichlet characters of modulus k ~ h ~ y. The trivial-character component is the diagonal main term, already
   extracted. ZF(Theta) says nothing about the rest. Even GRH for all Dirichlet L-functions gives
   sum_{h<=H, h=a (k)} mu(h) << H^{1/2+eps}, against the trivial H/k: nontrivial only for k < H^{1/2}, whereas the
   moduli here reach k ~ H. So full RH/GRH does not lengthen theta by this route either; ZF(7/8) is weaker.
2. **Half-plane-only bound is worse than trivial** (sibling `bootstrap`, Lemma 1): with ZF(Theta) as the only input,
   the mean square of zeta M_y on the critical line is bounded by T y^{2 Theta - 1 + eps}. The Levinson line
   sigma_0 = 1/2 - R/log T is left of the critical line; the method needs an asymptotic with O(1) constant there.
3. **The cubic rows live in a different spectral family.** The 7/8 proof's exponential-sum inputs are bilinear
   forms in cubic/sextic residue symbols over Z[omega] (Heath-Brown cubic large sieve; Kubota theta coefficients;
   exceptional term P_a^{1/6} = TRO6). The mollifier error is governed by the GL(2)/Q Kuznetsov spectrum with
   trivial nebentypus and integer-weight Kloosterman sums. Cubic residue symbols enter Kloosterman sums only on the
   cubic metaplectic cover over Q(omega), which does not occur in int |zeta M|^2 with coefficients mu. A full
   power-saving TRO6 would lower the zero-free abscissa below 7/8; by part 1 that still does not move theta.

Status: parts 1 and 3 are structural statements about where each input can be inserted; they are not a theorem
that no proof exists. Part 2 is proved in the sibling note. Resulting proportion with these inputs: unchanged,
kappa >= 5/12 (PRZZ, CLASSICAL). If some future input gave length theta, section 1 gives the one-piece number.

## 4. Can any proportion argument reach 100% with these inputs?

1. One-piece Levinson-Conrey: needs theta -> infinity (Proposition 2).
2. theta = infinity (Farmer's conjecture) implies RH (Bettin-Gonek 2017, CLASSICAL). So the only known route to
   100% through mollified second moments needs an input at least as strong as RH. The implication RH => theta =
   infinity is OPEN, so the hypothesis may be strictly stronger than RH.
3. theta = 1 is where the off-diagonal stops being an error term; the functional gives 0.5884 there (one piece).
   Every proved length is below 1.
4. A density-one statement is not RH. Proportion statements are averaged zero counts and fall under MV-CAP
   (`mv-cap-theorem.md`: critical-zero counts change by O(1) under a one-window counter-model).

## 5. DH control

The step that uses the Euler product is the existence of the mollifier: coefficients mu(n) of 1/zeta, bounded,
with 1/zeta analytic and bounded in sigma > 1 + delta, and the combinatorial (Vaughan/Heath-Brown) decomposition
of mu used by Conrey. For the Davenport-Heilbronn function f, 1/f has poles in sigma > 1, so no Dirichlet
polynomial approximates 1/f there and the functional of section 1 has no analogue with c near its value for zeta.
The argument fails for DH at that step, as required. In the other direction, the conclusion "positive proportion,
or 100%, on the line" does not separate zeta from DH-type combinations (Selberg: positive proportion; Bombieri-
Hejhal: 100% conditionally; both CLASSICAL, recalled). This is consistent with item 4 of section 4.

## 6. Verdict

Precise obstruction. Proved here: Lemma 1 (closed form), Proposition 2 (finite-length ceiling < 1; inequality
proved, table measured), sup = 1 at theta = infinity. Measured: the kappa(theta) table, matching the published
0.3658 and 0.4088. Not obtained: any longer mollifier, any better Kloosterman error term, any proportion above
5/12. No pivot taken: the adjacent idea (using TRO6-type cancellation in the mollifier off-diagonal) is excluded
by section 3 part 3.

## 7. Three weakest steps

1. The functional, its hypotheses on P and Q, and all literature attributions are recalled from memory without a
   source check in this run. The reproduction of 0.3658 and 0.4088 supports the formula, not the attributions.
2. Proposition 2's sup is evaluated on a finite grid (R in [0.01, 20], r0 in [1e-10, 1e10]), not with interval
   arithmetic, and it covers one-piece mollifiers only. Multi-piece mollifiers (BCY, Feng, PRZZ) are outside it.
3. Section 3 is an obstruction to inserting the inputs into the known proof architecture, not an impossibility
   theorem. A different treatment of the off-diagonal that used cancellation of mu in a new way is not excluded.

Files: `levinson.py`, `achieved.py`, `ceiling.py`, `achieved.out`, `ceiling.out`, `levinson.out` (sanity checks only; that run was cut short),
`ceiling_table.json`, `achieved_table.json`. Needs numpy + scipy (the venv used was removed after the run).
