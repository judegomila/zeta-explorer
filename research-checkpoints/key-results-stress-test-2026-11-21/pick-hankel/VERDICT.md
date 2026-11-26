# VERDICT: pick-hankel

Date: 2026-11-20. Stress test of the key result "Pick positivity for K <= 12 and the anchor Hankel-pair rule".
Details, run table and file list: `NOTES.md` in this folder.

## Statement that the material supports

Let F(x) = xi(1/2+x), L = F'/F, P = [(L(x_i)+L(x_j))/(x_i+x_j)] for distinct positive reals x_1..x_K.

1. For K <= 14 (the lane ran K <= 12; this replay adds 13 and 14) P is positive semidefinite for every node set, and
   positive definite once the auxiliary function h_7 is replaced by h_K (the lane's referee fix). The proof is an Arb
   certificate on top of: all zeros to height 3e12 on the line (Platt-Trudgian), Trudgian's 2014 bound on S(t),
   Dobsch-Donoghue and Loewner, and three lemmas written by the lane with one internal referee pass. It gives no
   information on zeros beyond the verified height.
2. For any real even entire F of order <= 1 with F(0) != 0 and mu_k = sum over zeros of lambda^{-k-1}: the Taylor
   matrix of the kernel at x = y = 0 is congruent to 2 H0_{ceil(N/2)} (+) 2 H1_{floor(N/2)} with H0 = [mu_{i+j}],
   H1 = [mu_{i+j+1}]. The first order at which this Taylor matrix is not positive definite is min(2K0-1, 2K1).
   The matrix statement is checked in Lean for an arbitrary real sequence; xi does not appear in the Lean file.
3. For the Davenport-Heilbronn function the pivots of H0 are negative exactly at 75 and 110 and those of H1 at 75 and
   109, among orders 1..116 (Arb, 40000 bits). The Taylor-matrix ladder therefore has negative pivots at 149, 150,
   218, 219 among orders 1..232. Node matrices on nested families inside [0.01, 4] show the same orders.

## What was replayed

- DH anchor pair recomputed with separate code, two orders further and at higher precision: same pivots (75, 110 / 75, 109);
  direct factorisation of the 232 x 232 Taylor matrix gives 149, 150, 218, 219.
- DH node ladder on family [0.01, 0.5] to 152 nodes: negative pivots at 149 and 150.
- Certificate for K = 12 rerun with two rigour repairs (ball comparison for the running maximum, wider hull): output identical.
- Lean file read: definitions match the lane formulas; no sorry, axiom or native_decide in the text; not recompiled here.

## What changed under perturbation

- K: the unchanged certificate passes K = 13 (worst ratio 0.13) and K = 14 (worst ratio 0.76). The number 12 is the
  point at which the lane stopped.
- Verified height: with T = 3e10 the K = 12 certificate fails (ratio 2.41). The reachable K is a function of T and of
  the node-selection constants in the script.
- Control function: 48 of 48 random 12-node Pick matrices of Davenport-Heilbronn are positive definite (certified
  signs), as are 48 of 48 for xi. Low-order Pick positivity does not separate zeta from a function with off-line zeros.
- Node placement for the DH failure orders: [0.28, 0.32] gives 149/150; [1, 100] gives 157/158; [10, 60] gives
  158/159. The orders 149/150 belong to the Taylor matrix at the centre and to node sets near it. They are not
  independent of the nodes. Whether 149 is the smallest failing order over all real node sets is not established.

## Errors and overstatements found

- "K <= 12" understates what the script certifies and reads as a threshold; it is not one.
- stack-antibridge section 5.2 reading 1 ("properties of the Taylor coefficients ... not of the nodes") holds only
  for nodes near the centre; two families further out fail at different orders.
- OBSTRUCTION_MAP row S9 "a moved zero of index n is seen at order 2n+1 to 2n+3" is specific to xi with displacement
  0.3; it does not hold for DH (index 44, order 75) or for displacement 0.03.
- The lane lists "negative pivots = number of off-line quartets" as not established; this is the Grommer-Chebotarev
  theorem in the variable x^2 (found through a secondary source; primary source not read).
- No error found in the K <= 12 proof at the steps re-derived (splitting identity, spectral forms, conditions (H) and
  (J), Markov constants, tail sum value). The proof has not been read by anyone outside the project.

## Literature

Statement 2 with "all orders iff all zeros on the line" is Grommer's Hankel criterion (1914) with Chebotarev's
count of non-real pairs, applied in the variable x^2 and split by parity. The Pick-kernel side is Lagarias (1999) and
Krein-Langer negative-square theory; the reduction to Hankel matrices at a point is Dobsch-Donoghue (Heinavaara
2018). Hankel matrices of Taylor coefficients as an RH criterion: Matiyasevich (2017). A November 2026 preprint
(arXiv:2611.02944, abstract only read) derives finite-order positivity (PF_k) of xi-related densities from the same
verified height up to k = 1.8e12. Not found in seven searches: the K-node Pick statement itself, and the DH orders.
The DH orders are numerical data about one function.

## Scores

- Arbitrariness 4 of 5. Statement 2 is canonical, but it is classical. The headline numbers are not: 12 is a stopping
  point (14 passes, the limit moves with T and with script constants), and 149/150/218/219 depend on node placement.
- Importance 2 of 5. Statement 1 is a corollary of verified height and says nothing new about zeros, about RH or
  about the de Bruijn-Newman constant. Statements 2 and 3 give a concrete case of the known fact that finite-order
  positivity tests see only finitely many low zeros (DH passes 148 orders). A specialist would regard statement 2 as
  known and statement 3 as a computed example.

## Suggested wording for the public page

"For K <= 14, every K-node real Pick matrix of xi'/xi(1/2+x) is positive definite; this follows from zero
verification to 3e12 and is not new information about zeros. The Taylor matrix of the kernel at the centre splits
into the two Hankel matrices of Grommer's criterion in the variable x^2. For Davenport-Heilbronn these Hankel
matrices first fail at order 75, so Pick matrices with nodes near the centre first fail at order 149; nodes further
out fail later (158 for nodes in [10, 60])."
