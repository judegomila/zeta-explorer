# Full recovery-interval signed compensation in both actual parity ladders

This note tests the complete recovery interval I=[1/8,1/2], rather than endpoint windows or a fixed-weight monotonicity claim. It establishes opposite whole-interval sign patterns in the actual moving bulk and mixed-inverse terms. It does not supply a degree-uniform bound or independently reprove the already-certified finite target gains.

## 1. Exact accounting and what is independently computed

Use the reviewed identity, with actual core optimizer z(H), actual old inverse A(H)^-1, and fixed flux convention:
 S(b)-S(a)=B+M+Phi(b,z(b))-Phi(a,z(a)),
 B=integral_I beta(H,z(H))dH,
 M=integral_I (gradient_z Phi)^T A^-1(Lz+l)dH.             (1)
The entire old-matrix path is verified positive below, so the moving-optimizer formula is valid throughout.

The bulk B is computed by fresh rigorous whole-interval quadrature, not inferred from a target Schur value. Endpoint fluxes are independently evaluated from complete-theta jets and actual old/cross moment inverses. For M and B+M, the exact identity(1) is combined with the independently certified earlier finite gain. Therefore the sign of M proved here is valid, but this is NOT an independent proof of that gain. It would be circular to present the inferred M lower bound as a new sufficient proof of the same target pivot.

## 2. Rigorous whole-path computation

The owned `check_integrated_bulk.py` starts with the independently replayed1000-cell old/cross moments on[0,1/8]. It propagates M0 through M6 over I with16000 cells of width3/128000. Each endpoint moment increment uses the full-theta midpoint enclosure plus width³ sup|density''|/24. Even6 reads only M0..M5; odd7 reads M1..M6. Neither respective top target integral is fed into its optimizer.

For every point in each cell, if a local moment density is enclosed by[qlo,qhi], its increment from the cell's left endpoint is enclosed by
 [width*min(0,qlo), width*max(0,qhi)].                    (2)
This signed hull preserves known sign information without assuming any local matrix positivity. Adding it to the certified endpoint moment intervals encloses the actual moments at every cutoff in the cell. Interval LDL then verifies the actual old matrix is positive and encloses its inverse-selected coefficients. All three pivots stay positive on every cell in both parities.

The complete-theta jets and the exact formula
 beta=2sum_j d_j(z)[H²(psi^(j))²-(j/2)(psi^(j-1))²]
enclose beta on the whole cell. Multiplying by its width and summing gives a rigorous rectangle enclosure for B, with no missing discretization error. The endpoint-moment midpoint errors, complete-orbit errors, and coefficient/inverse interval errors are retained. No infinite spatial tail is omitted: the present integration interval is the finite I, while each theta evaluation includes all arithmetic orbits.

## 3. Actual full-interval sign results

All units are h/(4pi). Conservative enclosures:

Odd7:
- B is between -200964962250 and -51057351625.
- M is between87271253451 and237617777868.
- B+M is between36213902044 and36652815401.
- The moving endpoint flux difference is negative, approximately -32.3 billion; it must still be paid before obtaining the known positive Schur gain of about4.09 billion.

Even6:
- B is between620648881 and900580612.
- M is between -378140802 and -98087665.
- B+M is between522439810 and522561217.
- The moving endpoint flux difference is negative, approximately -475.2 million; the known positive Schur gain is about47.3 million after that debit.

Hence the complete-theta moving bulk is NOT generally nonnegative even over the whole successful recovery interval (odd7). The integrated mixed actual-inverse term is NOT generally nonnegative even over that interval (even6). The successful finite recovery uses opposite signed compensation patterns in the two parity ladders, together with a substantial adverse endpoint debit in both.

These are stronger scope tests than pointwise sign failures: simply integrating across the entire previously successful region does not restore separate positivity. They do not refute a correlated all-degree estimate for the full sum in(1).

## 4. Inconclusive route preserved separately

The preceding `check_integrated_moving_energy.py` attempt directly enclosed both beta and the mixed inverse bilinear over16000 cells using symmetric moment-increment bounds. Its mixed-term intervals were too wide to prove the final gains. Those outputs are retained as inconclusive, not negative proofs. The tighter signed hull(2) resolves the bulk signs; the mixed signs in this final packet are obtained by the explicitly disclosed exact-identity method, not by claiming that the earlier wide mixed quadrature succeeded.

The present work supplies rigorous global-in-this-finite-interval obstructions to separate-sign shortcuts and exact finite compensation accounting. The unresolved degree-dependent requirement is a lower bound for B+M+DeltaPhi in the actual metrics, without borrowing the target gain being proved. No uniform theorem, new degree, or all-shift claim follows.
