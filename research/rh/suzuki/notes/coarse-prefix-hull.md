# Exact coarse prefix-hull certificate: Suzuki scalar positivity through X=1000000

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

## Result

Both 192- and 256-bit Arb runs prove

\[
 \boxed{\quad\Psi(r)>1/100\qquad
                   (\log2\le r\le\log1000000).\quad}     \tag{1}
\]

The rational floor 1/100 was fixed before the run. All 78,734 distinct prime-power events at q<=1000000 were generated exactly, using all 78,498 primes in that range. No weight or event is replaced by a statistical estimate.

The proof uses 441 accepted coarse blocks, 442 distinct endpoint reserve evaluations, and 574 intersection evaluations, including rejected parent blocks that were bisected. It does **not** claim to avoid exact weighted prime accounting: all event weights and moments are accumulated with intervals. Its saving is in the nonlinear reserve tests, not in discovering primes or updating their weighted counts.

The last event is 999983. The lowest accepted **block lower bound**, not the actual minimum reserve, lies in

\[
 [0.01048536038807097491434351854858,\ 
   0.01048536038807097491434351854859].
\]

The receipts retain much tighter full interval enclosures. The scalar range corresponds to the constant-box direction through lambda=1000; it is not a whole-even-form positivity certificate at that support. The accepted whole-even endpoint remains unchanged.

## 1. Exact event notation

Use the already audited quantities

\[
 S_n=\sum_{q_j\le q_n}\Lambda(q_j)/\sqrt{q_j},\quad
 J_n=\sum_{q_j\le q_n}\Lambda(q_j)\log q_j/\sqrt{q_j},\quad
 H_n=S_n-b,
\]

\[
 F(H)=2H[\log(H/2)-1],\qquad
 R_n=J_n-F(H_n)-4+T_\infty.
\]

The accepted conjugate enclosure gives

\[
 M_n\ge R_n-\epsilon(H_n),\quad
 \epsilon(H)={4\over25}\frac{x_-(H)^{-5/2}}{1-x_-(H)^{-2}},
 \quad x_-(H)=((H-\delta_0)/2)^2,
 \quad\delta_0=(8/15)2^{-5/2}.
\]

The function epsilon decreases on the actual event range. Every between-event Psi cell is at least its exact event reserve M_n. Hence proving the event inequalities proves all real r in (1), including the remaining interval after the last event.

## 2. New block-prefix hull lemma

Fix actual event indices a<b, with a>=1. Set

\[
 D=S_b-S_a,\quad Q=J_b-J_a,\quad
 \ell=\log q_{a+1},\quad u=\log q_b.
\]

For any actual intermediate prefix a<=i<=b, put t=S_i-S_a. Since each included event log is at least ell and each remaining event log is at most u,

\[
 J_i-J_a\ge\ell t,
 \qquad J_i-J_a\ge Q-u(D-t).
\]

Thus

\[
 R_i\ge J_a+\max\{\ell t,Q-u(D-t)\}
                              -F(H_a+t)-4+T_\infty.       \tag{2}
\]

If b>=a+2, the two affine branches cross at

\[
 t_*={uD-Q\over u-\ell},\qquad0<t_*<D.                   \tag{3}
\]

Because \(F''(H)=2/H>0\), the right side of (2) is concave on each of [0,t_*] and [t_*,D]. Its minimum occurs at 0, t_*, or D. Therefore **every** intermediate reserve obeys

\[
 \boxed{\quad
 R_i\ge\min\left\{R_a,R_b,
       J_a+\ell t_*-F(H_a+t_*)-4+T_\infty\right\}.
 \quad}                                                   \tag{4}
\]

If b=a+1, the two endpoint values suffice and no division by u-ell is performed. The derivation uses the actual positive weights and actual event ordering; it is not a monotonicity assumption on reserves.

Since H_i>=H_a, subtracting epsilon(H_a) from each of the at most three values in (4) gives a common lower bound for all M_i in the block. This proves the exact coarse test used by the program.

## 3. Certified finite computation

The sieve enumerates integer primes and all their powers. Each record contains (q,p,k) with q=p^k. Arb computes log p once per prime; log q is the exact scalar multiple k log p, and the weight is log p/sqrt q. All S,J updates use interval arithmetic. The first-event root bracket and reserve are independently checked inside each run.

The initial proposed blocks have at most 256 events after their head. A block is accepted only if **all** interval lower bounds from (4), after subtraction of the common gamma enclosure, are strictly greater than the exact rational 1/100. Otherwise it is bisected. A failing singleton would abort rather than be silently skipped. In these runs every leaf passes; 133 parent blocks required splitting.

Both precision runs generate the same exact event digest:

`75a8304f17e1c2010108b3ebbfa15bf0fc1dfbaf007678ce5357c32c4d77b36a`

At the final event,

\[
 H=1999.59290052558258\ldots,\qquad
 R=0.0369120504142847773\ldots.
\]

The complete precision-dependent intervals and each accepted block are in `COARSE_RESERVE_192BIT.json` and `COARSE_RESERVE_256BIT.json`. The observed producer runtimes were approximately 0.3 seconds each in this environment; this is not a benchmark or optimality claim.

Commands:

```
python certify_coarse_reserve.py --limit 1000000 --bits 192 --output COARSE_RESERVE_192BIT.json
python certify_coarse_reserve.py --limit 1000000 --bits 256 --output COARSE_RESERVE_256BIT.json
```

## 4. Finite head versus all-future representation errors

At this cutoff the prior unconditional total **positive convexity-debt** bound is below 0.040903. The separate elementary-onset addendum gives a prime-only all-future block-freezing error below 0.801930 for its specified critical block rule. Neither quantity bounds future signed credits, and both exceed the finite floor in (1).

The correct conclusion is a rigorously verified finite scalar head plus an explicit coarse continuation whose representation errors have finite total. The infinite signed block sequence remains uncontrolled. No extrapolation from the finite run to RH is made.

The bundled finite-certificate review accepts these scoped results and records separate replays.
