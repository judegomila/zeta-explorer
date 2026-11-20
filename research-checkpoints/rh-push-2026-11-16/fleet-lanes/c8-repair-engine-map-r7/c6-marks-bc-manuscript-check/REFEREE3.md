# REFEREE3 (third referee): Lemma H of `c6-marks-bc-manuscript-check` (MS Lemma 7.1 at j = 0)

2026-11-18, lane `c8-repair-engine-map-r7`. Written in this lane's directory; no file of
`push/c6-marks-bc-manuscript-check/` was edited. Source read as text: `~/lean-deps/qrh-verify/paper.txt` (unrefereed
manuscript "MS"), lines 3100-3125 ((7.6), lift formula), 3125-3213 ((7.7)-(7.9)), 3214-3365 ((7.10), Lemma 7.1, table
(7.16), proof). Script `ref3_lemmaH.py` + `ref3_lemmaH.log` (stdlib, one local run through `scripts/memcap.sh 8`, a
few seconds). No server use. Lemma H is an identity for a normaliser; it is not a statement about zeros of zeta.

## What the earlier passes did, and what this pass does differently

The first referee summed the rows of table (7.16); the second compared (7.11) with table (7.16). Both start from the
table. This pass starts one level lower: the series (7.10) with the coefficient C_p(t, k, j') of (7.8) and the lift
formula for g_{chi^r}(p^t, p^{j'}) printed before (7.7). It derives the j = 0 rows of the table and then Lemma H.

## Verdict: holds

**Lemma H holds as stated** (local formula, both factorisations, convergence abscissae 1/2 and 3/7, local
non-vanishing on Re s >= 1/2), relative to MS (7.8), (7.10) and the lift formula as printed. The derivation of (7.8)
itself from (7.1)-(7.7), and (7.9), were read and not replayed.

## 1. Derivation from (7.10) and (7.8), j = 0

Summand of (7.10): (-1)^e0 gamma_1^(-e0) eta(p)^e0 (a_p gamma_3)^l rho^(k-t) omega^(tk - e0 l - l(l-1)/2)
C_p(t, k, 6m) Q^(-(x+1/2) e0 - (1+3x) l - wk - 6zm), t = e0 + 3l, j' = 6m. Lift formula: for 6 not dividing r,
g_{chi^r}(p^t, p^{j'}) = Q^(t-1) G_r 1[j' = t-1]; for 6 | r, Q^t 1[j' >= t] - Q^(t-1) 1[j' >= t-1].

- t = 0: k = 0 gives sum_m V^m = 1/(1 - V); k >= 1 needs j' = 0, so m = 0: W_loc/(1 - W_loc).
- k = 0, t > 0. Non-principal character: 6m = t - 1 forces t = 6r + 1, so (e0, l) = (1, 2r), m = r. With
  gamma_1^(-1) G_1 = Q^(1/2), gamma_3^(2r) = omega^r, rho^(-t) = rho^(-1), omega-exponent r - 2r - r(2r-1) = -2r^2 (even):
  term -eta(p) rho^(-1) Q^(-x) R^r, R = a_p^2 Q^(4-6x-6z). Principal character: t = 6r + 6, (e0, l) = (0, 2r + 2),
  value Q^t (1 - 1/Q) for m >= r + 1 (for 6m = t - 1 there is no solution): term R^(r+1) (1 - 1/Q) V^(m-r-1).
- k = 1, t > 0, j' >= 1: omega^(-1) G_1 g_{chi^(t-1)}(p^t, p^(6m-1)). If 6 does not divide t - 1: 6m - 1 = t - 1, so
  t = 6r + 6, m = r + 1, character index 5, omega^(-1) G_1 G_5 Q^(t-1) = Q^t: term W_loc R^(r+1). If 6 | t - 1:
  t = 6r + 1, value Q^(t-1)(Q - 1) for m >= r + 1: term -eta(p)(Q - 1) Q^(-x-w) R^r V^(m-r).
- t = 3, 4 mod 6: no solution of the valuation conditions at j = 0. k >= 2: zero by (7.8).

These are rows 1, 3, 4, 6 of table (7.16) with j = 0, and summing r and m gives

    P* = (1/(1-R)) [ (R(1 - 1/Q) - eta(p)(Q-1) Q^(-x-w) V)/(1 - V) - eta(p) rho^(-1) Q^(-x) + W_loc R ],   P = 1/(1-V) + W_loc/(1-W_loc) + P*,

which is (7.11) with J_0. At u = 1 (rho = 1), (w, z) = (1, 1/6): V = W = q = 1/Q, D = eta(p) Q^(-s), R = a_p^2 Q^(3-6s),
P* = (1 + q)(R - D)/(1 - R), P = (1 + q)(1 - D(1 - q) - R q)/((1 - q)(1 - R)), and by (7.12)

    H_p = P (1 - q)^2/(1 - D) = (1 - q^2)(1 - D(1 - q) - R q)/((1 - R)(1 - D)),
    1 - D(1 - q) - R q = (1 - D)(1 - R q) + D q (1 - R).

Hence H_p = (1 - q^2)(1 - R)^(-1) [1 - q(R - D)/(1 - D)] = (1 - q^2)(1 - R q)(1 - R)^(-1) [1 + D q(1 - R)/((1 - D)(1 - R q))].
Product over p outside S: zeta_F^S(2)^(-1) L^S(6s - 3, psi_eta) E_eta, largest term of E_eta - 1 of size Q^(2 - 6 Re s)
(absolutely convergent for Re s > 1/2); second form with L^S(6s-3)/L^S(6s-2) and terms Q^(-1 - Re s), Q^(2 - 7 Re s)
(Re s > 3/7). On Re s >= 1/2: abs(D)(1 - q) + abs(R) q <= Q^(-1/2)(1 - 1/Q) + 1/Q <= 0.625 for Q >= 4, so the numerator
does not vanish. All as in the lane.

## 2. Numerical check (`ref3_lemmaH.log`)

- Series (7.10) with (7.8), truncated, against (7.11) at j = 0: 24 random points (Q = 4, 7, 13, 31; random unit phases
  for eta(p), a_p, G_1, G_2, G_4; rho any sixth root of unity; omega = +-1; gamma_3^2 = omega; G_1 G_5 = omega Q):
  largest relative difference 1.6e-15. G_2, G_3 (sign), G_4 are free in the test and do not affect the value at j = 0.
- H_p from the series against the closed form at (w, z) = (1, 1/6), rho = 1: 12 points with Re s in (0.75, 1.1):
  1.8e-15.

## 3. Scope notes (none changes the verdict)

1. **What the algebra uses.** eta enters (7.10) as eta(p)^e0 and through a_p; the identity needs complete
   multiplicativity (eta(c n^3) = eta(c) eta(n)^3) and nothing else. abs(eta(p)) = 1 is used for the convergence
   regions only. So the local formula and both factorisations hold for the Liouville twist, THIN and any unimodular
   completely multiplicative weight. The global statements (continuation of L(w, psi_eta), zeros in
   7/12 <= Re s < 2/3, Lemma S) need psi_eta = (alpha eta)^6 to be a Hecke character; this is correction E4 of the
   referee of `c7-repair-engine-map-r6` and is confirmed here.
2. **The Liouville twist at s = 1.** With eta(p) = -1: H_p(1) = (1 - q)(1 + q - q^2 - R q)/(1 - R) = 1 + O(Q^-2),
   abs(R) = Q^-3; least modulus over Q in {4, 7, 13, 19, 25, 31, 37} and all phases of a_p^2: 0.8798. The product
   converges absolutely and H_lambda(1) != 0 (PROVED given Lemma H). Used by Lemma A of `c7-probe-format-h-cap`.
3. **(7.6).** The printed line reads "ap = alpha(p) eta(p)3" with lost superscripts; b_p^3 = a_p^2 fixes
   a_p = (alpha(p) eta(p))^3 up to the conjugation convention, and only a_p^2 enters at j = 0. Same reading as the
   first referee.
4. **On Re s = 1/2** the local factor has a pole where R = 1; the product form of H_eta is a statement on Re s > 1/2
   (and Re s > 3/7 for the second form after the L-quotient is extracted). The lane's "holomorphic on Re s >= 1/2"
   refers to the global function through the entire L(6s - 3, psi_eta).
5. Not checked here: Corollary H1 (b)-(d), Lemma S, Theorem B1' (second referee; with the correction E1 of the
   referee of `c7-repair-engine-map-r6`: (2.2) holds iff sigma_0 > 2/3).

## 4. State

Lemma H: three referees hold (table-sum; table against (7.11); series (7.10) with (7.8)). It is a statement about the
normaliser of a probe in an unrefereed manuscript. It is not a statement about zeros of zeta, and the three-referee
rule for such statements is not what is met here.
