# Independent audit: prior-derivative score repair

## Verdict

**PASS** for the stated finite-certificate scope.

For

\[
 V_N^{\rm prior}=\operatorname {span}\{q_N',tq_N,q_{N-1}'\},
\]

the frozen complete-theta verifier certifies a positive projected auxiliary on
all 13 claimed available rungs: even `kappa=4,6,...,14` and odd
`kappa=3,5,...,15`.  At the critical actual odd degree 15,

\[
 \mathcal H_{V_7^{\rm prior}}
 \in[
 6.6111654811703367056612234805806\,10^{25},
 6.6111722658068570958584714805807\,10^{25}
 ]>0.                                                     \tag{A1}
\]

The new signed moment `M_15` is absent.  The result therefore gives a
noncircular finite-rung repair of the failed dictionary
`span{q_N',tq_N,t^2q_N'}`.  It does not prove the prior-derivative inequality
at all degrees, any new signed pivot, a first Xi--Laguerre theorem, or RH.

During audit, the displayed upper endpoint in the primary note was found to
need one more outward-rounded digit.  Commit `27f6ec9` corrected it to
`6.611172265806858e25`.  The corrected primary note has SHA-256
`89099b009d4484b8aad3de1310a80ca972e8687ad8e13b5462f3c9c34c16d0cb`.
The frozen receipt and strict sign were always correct.

## Frozen sources and clean replays

The following SHA-256 values were checked before replay:

| artifact | SHA-256 |
|---|---|
| verifier source | `45467394a474ae3e53cda98d91eb6c4ebde62afe84d76264ed1cef1c72683aeb` |
| 800-bit receipt | `77cb034a3c488d77a3ec52ae9429a3f14b92ba8a796a15745b4c80248c92ddfe` |
| 900-bit receipt | `98b2090ee2ea53d6313e3f91209ea05fccfeb7a926f7b1ff5ed3379f9061b6ab` |
| signed-moment source | `dc5828f6ce61a461d5a881c08d0e4034dab473f85dabd20be488dd4b5f6ff178` |
| signed-moment receipt | `94d3741b7eabecf2f0f0ccc33a2786f8a4eaae752a98e1076fe08389828b1eff` |
| positive-moment engine | `5d86938507fe5bc78994cfd5658a0de745835f614534f98161083c2651a62536` |

A clean 800-bit run from the frozen source produced a byte-identical receipt,
including SHA-256

```text
77cb034a3c488d77a3ec52ae9429a3f14b92ba8a796a15745b4c80248c92ddfe
```

and canonical payload

```text
be6376819d0a5759b3e4474d7c3159e925b6d488743b06fd294ce2f02bf85f34.
```

A separate clean 900-bit run was also byte-identical to its frozen receipt,
SHA-256

```text
98b2090ee2ea53d6313e3f91209ea05fccfeb7a926f7b1ff5ed3379f9061b6ab,
```

with canonical payload

```text
9f9a2986e532535ab10c2dafada8a0ffc2285ce91f35d185d2225e0b1948ec85.
```

Both payload hashes were recomputed independently from compact sorted JSON
after removing only the `receipt_integrity` block.  All 13 rank, determinant,
cleared-numerator, and auxiliary signs pass at both precisions.

## Old-data and rank audit

For parity `epsilon` and order `N`, the monic residual has degree
`kappa=2N+epsilon`.  Its old Hankel matrix uses

\[
 M_{i+j+\epsilon},\qquad0\le i,j<N,
\]

and its target column uses

\[
 M_{i+N+\epsilon},\qquad0\le i<N.
\]

The largest signed index is therefore

\[
 (N-1)+N+\epsilon=\kappa-1.                              \tag{A2}
\]

The prior residual uses a strict subset.  Every receipt row records
`old_signed_moments_needed_through=kappa-1` and
`new_signed_target_absent=kappa`; these equalities were checked independently.
Thus the degree-15 calculation uses `M_0,...,M_14` and never reads `M_15`.

For every claimed `kappa>=3`, the basis polynomials have leading data

\[
 \begin{array}{c|ccc}
 &tq_N&q_N'&q_{N-1}'\\ \hline
 \deg&\kappa+1&\kappa-1&\kappa-3\\
 [t^{\deg}]&1&\kappa&\kappa-2.
 \end{array}                                               \tag{A3}
\]

The distinct degrees prove exact rank three without a numerical condition
number.  The verifier correctly starts the even ladder at `kappa=4`; at
`kappa=2`, the predecessor is constant and its derivative vanishes.

## Gram, score, and cleared-algebra audit

For any polynomial feature `p`, Schwartz decay gives

\[
 \langle-q'W-2qW',pW\rangle=\int q p'W^2.                \tag{A4}
\]

With `r=q_(N-1)'`, the verifier therefore uses

\[
 K_3=\begin{pmatrix}A&E&F\\E&D&G\\F&G&T\end{pmatrix},
 \qquad
 y_3=\begin{pmatrix}B\\C+E\\R\end{pmatrix},             \tag{A5}
\]

where

\[
 \begin{gathered}
 A=\langle q',q'\rangle,\quad
 B=\langle q,q''\rangle,\quad
 C=\langle q,q\rangle,\quad
 D=\langle tq,tq\rangle,\quad
 E=\langle q',tq\rangle,\\
 F=\langle q',r\rangle,\quad
 G=\langle tq,r\rangle,\quad
 T=\langle r,r\rangle,\quad
 R=\langle q,r'\rangle.
 \end{gathered}
\]

These entries and score signs are correct.  Direct block expansion gives

\[
 \begin{aligned}
 \Delta_2&=AD-E^2,\\
 H_{\rm num}&=DB^2-2EB(C+E)+A(C+E)^2-A\Delta_2,\\
 S_{\rm num}&=T\Delta_2-(DF^2-2EFG+AG^2)=\det K_3,\\
 D_{\rm num}&=R\Delta_2-(DF-EG)B-(AG-EF)(C+E),\\
 N_3&=D_{\rm num}^2+H_{\rm num}S_{\rm num}.
 \end{aligned}                                             \tag{A6}
\]

Consequently

\[
 \mathcal H_{V_N^{\rm prior}}
 ={N_3\over4\Delta_2S_{\rm num}},
 \qquad
 \det\begin{pmatrix}K_3&y_3\\y_3^T&A\end{pmatrix}
 =-{N_3\over\Delta_2}.                                   \tag{A7}
\]

The verifier cross-checks (A7) against a direct Arb solve and the one-feature
Schur gain.  At degree 15 it certifies

\[
 \begin{aligned}
 \Delta_2&>3.795179189770072\,10^{59},\\
 S_{\rm num}&>1.076481733039687\,10^{83},\\
 N_3&>1.080381572245252\,10^{169},\\
 \det\begin{pmatrix}K_3&y_3\\y_3^T&A\end{pmatrix}
 &<-2.846720398008033\,10^{109}.
 \end{aligned}                                             \tag{A8}
\]

Thus the sign in (A1) is inverse-free and far from zero.

## Complete positive-moment tail

The largest basis degree is `deg(tq_N)=kappa+1`; its Gram square therefore
needs positive moment index at most `kappa+1=16`.  No higher positive moment
enters the critical rung.

The frozen positive-moment engine assembles exact theta orbit pairs one
through eight and bounds every orbit `n>=9`.  At derivative order `j<=16`,
the largest monomial-envelope ratio is bounded by

\[
 (10/9)^{2j+3}e^{-19\pi}
 \le(10/9)^{35}e^{-19\pi}<1/2.                            \tag{A9}
\]

The square-root denominator factor in the norm bound decreases the
consecutive ratio.  Hence the engine's factor-two geometric tail remains
valid through order 16.  The serialized signed endpoints are padded outward
before division by `4^j`, and the omitted common positive scale
`m_j=4\pi n_j` cannot change any sign.

## Scope

The replay proves exactly a finite complete-theta statement for the 13 stored
rungs.  It makes the recurrence-aware old-data condition

\[
 N_3(N,\epsilon)>0
\]

a plausible theorem-shaped next target, but does not prove it uniformly.
Likewise, the Christoffel--Darboux interpretation identifies the predecessor
channel; no CD-kernel positivity theorem is inferred.  External peer review
and proof-assistant formalization have not occurred.
