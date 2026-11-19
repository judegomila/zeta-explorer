# REFEREE3: c8-row-energy-squared-signal (third referee, lens: general)

Date 2026-11-18. Object: `RESULT.md` in this directory, in its state after `REFEREE.md` and `REFEREE2.md`.
File name: the assignment said `REFEREE.md`; that file already holds the first referee's report, which `RESULT.md`
cites by name, so this report is written as `REFEREE3.md` and the two earlier reports are untouched.
Claimed verdict: precise obstruction. Claimed flags: all false.

**Referee verdict: holds, with three small corrections (G1 to G3).** Every step labelled PROVED or PROVED-rel was
re-derived or recomputed and is confirmed. No statement about zeros. RH and GRH are not assumed. Bessel and
Cauchy-Schwarz are presented as classical. No restatement of verified height.

Scratch files: `/tmp/ref_c8c/own.py`, `ratio.py`. Local runs, single process, each under 1 minute and under 1 GB,
through `scripts/memcap.sh 8`. No server use. No repository data module imported.

## Re-derived

1. **(T), corrected form.** With u_j = conj(A_j), b_i = <B, u_i> = J_i, H_ij = <u_j, u_i> = conj(G_ij): projection
   energy = conj(J)^T conj(G)^(-1) J = J^T G^(-1) conj(J) (real). Agrees with the text after the first referee's E1.
2. **Probe norms in F_q[T].** Sum over monic m of degree d of e(m (x/c - x'/c')) vanishes for distinct reduced
   fractions with deg c + deg c' <= d (the difference has a nonzero coefficient at some T^(-j), 1 <= j <= d).
   Hence orthogonality for k, k' <= d/2 and ||c_k||^2 = q^d Sum_{deg c = k} phi(c) = q^(d+2k)(1 - 1/q), k >= 1.
3. **Manuscript quotes** read in `paper.txt`: Prop. 2.1 with (2.1) to (2.5) and its proof; (6.1), B_{m,sigma},
   A_{m,sigma,v}, (6.2); Lemma 6.2 with bound (Q + Y^2)/Y uniform in v; Prop. 6.3; (12.4), (12.5); section 15.1,
   B^J, (15.1), (15.2). As quoted. The J = empty summand of (12.5) has q_{p_J} = 1, so X, Y, Q are unchanged and
   the row is B^J with J empty: Lemma Z1 follows from the text.
4. **Theorem Z.** Cauchy-Schwarz in m for fixed (sigma, v) in Lemma Z1 gives
   |I_mark| << Q^(-1/2) ((Q + Y^2)/Y)^(1/2) max E^(1/2); QY/(Q + Y^2) = q_b XY/(q_b X + Y), of order min(X, Y).
5. **Corollary Z and (C1).** E = O(min(X,Y) Z^(2C(sigma_0) + 2 omega)) for all targets gives (2.4); with (HC),
   Prop. 2.1 contradicts beta* > sigma_0. Exponent at lx = ly = M/2: M/2 + 2 sigma_0 - 5/3 + M/3 + l/3
   = M + ksig(sigma_0); ksig has slope 2, so omega -> beta* - sigma_0 gives k >= ksig(beta*);
   1 - h_E/6 + ksig(s)/2 = s. Section 5 item 1: Q^(-1/2)(Q/Y)^(1/2) Z^((kappa + M)/2) = Z^(lx/2 + kappa/2),
   sigma_0 = 1 - h/r + kappa/2. All confirmed.
6. **Consistency with the manuscript's own vertex.** MS (15.2) at J empty (d = 0) gives E_mark << Z^(M + eps) at
   (12.4), that is k = 0; ksig(beta*) = 1/4 - 2(1 - beta*) <= 0 iff beta* <= 7/8. (C1) does not contradict a
   statement of MS.
7. **Worked numbers.** 7 * 7^8 * 861^2 = 29914976294847; 7^8 * 6/7 = 4941258; 147/2058 = 0.0714. Table of
   section 3: 12 of 14 rows have E - D - S < 0.

## Numeric check with own code and different cases

`own.py`: complex floats, resultants by the Euclidean algorithm, any q = 1 mod 6, continuous random phases for the
mark control. Not derived from `recheck.py`.

| q | weight | N | lam | d | E | S | Rem (residual norm) | S/D | (E-D-S)/D | signal law abs(J)^2 = q q^(2d) abs(S_cop)^2 |
|---|---|---|---|---|---|---|---|---|---|---|
| 7 | a | 1 | 2 | 3 | 9724050 | 907578 | 8816472 | 0.0625 | -0.393 | equal (reproduces the note's row) |
| 7 | a | 2 | 1 | 3 | 22298430 | 1977738 | 20320692 | 0.0985 | +0.012 | equal (reproduces the note's row) |
| 7 | a | 1 | 1 | 2 | 28812 | 7350 | 21462 | 0.116 | -0.662 | equal (new: d = 2) |
| 7 | a | 0 | 2 | 2 | 180075 | 176473.5 | 3601.5 | 3.573 | -0.927 | equal (new: N = 0) |
| 7 | mu | 2 | 0 | 2 | 533022 | 518616 | 14406 | 6.000 | -0.833 | equal (new) |
| 13 | a | 1 | 1 | 2 | 6696456 | 6134700 | 561756 | 1.500 | -0.863 | equal to 1e-12 relative (new: q = 13) |
| 13 | mu | 2 | 0 | 2 | 49696140 | 49353408 | 342732 | 12.000 | -0.917 | equal (new) |
| 13 | mu | 1 | 1 | 2 | 41813304 | 41470572 | 342732 | 5.462 | -0.955 | equal (new) |
| 13 | nu_a + nu_b (DH type) | 1 | 1 | 2 | 20722104 | 19876428 | 845676 | 2.618 | -0.889 | equal (new) |
| 13 | zeta_6^(coefficient sum), not multiplicative | 1 | 1 | 2 | 843648 | 245388 | 598260 | 0.070 | -0.829 | equal (new) |
| 13 | a, random continuous phases, seed 3 | 1 | 1 | 2 | 3973056.16 | 137317.32 | 3835738.84 | 0.035 | -0.023 | equal to 1e-12 relative (new) |

In all 11: E - S - Rem = 0 to float precision; Gram off-diagonal below 2e-13; ||c_1||^2 = q^(d+2)(1 - 1/q);
J(0) = 0 at dual length -1. Mean-signal ratio abs(Sum_P T_P)^2 / Sum_P abs(T_P)^2 (`ratio.py`, q = 7): 21 at
(a, 1, 2, k = 2); 6.82 and 6.85 for a at (2, 1) with k = 2, 1; 7 for mu; 2.526 for b at (2, 1, k = 2). Agrees with
"2.5 to 21".

## Controls

No zeta-only mechanism is claimed. The identities were run for a Davenport-Heilbronn-type sum of two weights, a
non-multiplicative weight, the aligned (Liouville-type) weight and random unimodular marks: all pass, as the note
says. Theorem Z uses no property of the coefficients. Backward heat, T-NR, Beurling, zeta(s+a)zeta(s-a),
phase-rotated transfer operator, theta^w: not applicable to a statement about row vectors; not run.

## Corrections

**G1 (verdict label).** The steps that are PROVED or PROVED-rel are a Cauchy-Schwarz inequality, an exact model
identity, and a conditional exponent (C1 relative to (HC)). The one statement that obstructs anything
(modulus-only proofs of the low input are excluded at every h_E > 0) is ARGUED over Z[omega] and a bounded
factor in the model; the note says so in items 5 and 9. "Precise obstruction" in the first bold line therefore
describes an ARGUED statement. Accurate label: "reduction and correction of record; obstruction ARGUED".
Nothing else changes.

**G2 (ranges are for q = 7 and the two cubic targets).** New data outside the note's cases: at q = 13,
(a, 1, 1, 2), the Weil target a has S/D = 1.50, and at q = 7, (a, 0, 2, 2), S/D = 3.57 with Rem/D = 0.073. The
sentence "for the two Weil targets a, b S/D is between 0.0098 and 0.56" is true of the 14 listed rows only; the
later sentence "no separation between Weil targets and mu is shown" is the correct reading and is confirmed.
"E >= D + S fails" is confirmed on 8 further cases, again all with d <= N' + 1.

**G3 (editorial).** First bold line: "its exponent the exponent of (C1) is recovered" has a duplicated phrase.
Header "22 of 22" is 14 coherent + 8 random-mark runs. "(2.2) fails for sigma_0 <= 2/3" is cited from map row Z24
and was not re-derived by any of the three referees; it should carry the label CITED where it is used to state
"only if beta* > 2/3".

## Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | identities hold for non-multiplicative and DH-type weights and for random marks (run here) |
| R2 | false | no statement about a function, a height or a window |
| R3 | false | no control fails; random marks change a size only |
| R4 | false | lower bound for a row energy inside an estimate format; (C1) needs the unproved (HC); no passage to the critical line |

## Surviving claim

Relative to MS (6.2), (12.5), section 15.1 and Lemma 6.2: max_sigma E_sigma(Z) >= c_0 min(X, Y) |I_mark(Z)|^2
(Cauchy-Schwarz; classical). Relative in addition to (HC) at one sigma_0 in (1/2, beta*) (unproved; by the cited
row Z24 possible only if beta* > 2/3): k >= (2 + 2l - M)/6 - 2(1 - beta*) for every true bound E << Z^(k+eps) K.
In the F_q[T] block model: E = S + Rem with Rem >= 0, S = wt^2 q^(d-2k) |S_cop|^2/(1 - 1/q) at dual length 0
(22 runs of the note at q = 7; 11 runs here including q = 13, d = 2); E >= D + S fails in the computed cases
(all d <= N' + 1). Not established: reading (b) of Lemma C, identity (3.2), threshold h_E > 3, the modulus-only
exclusion over Z[omega] (ARGUED). Marks branch reduced to (E-K), open. Nothing about zeros.
