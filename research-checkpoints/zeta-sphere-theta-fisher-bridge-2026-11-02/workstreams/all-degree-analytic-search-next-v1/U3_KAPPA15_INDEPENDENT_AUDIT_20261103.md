# Independent audit: actual complete-theta \(\kappa=15\) fixed-\(U_3\) obstruction

## Verdict

**DECISIVE PASS**, within the stated finite auxiliary scope.

For the actual odd monic complete-theta residual of degree \(\kappa=15\), the
fixed score dictionary

\[
 U_3=\operatorname{span}\{q',tq,t^2q'\}
\]

has certified rank three and certified negative projected auxiliary:

\[
 -9.886093182083536\times10^{24}
 < H_{U_3}
 < -9.886043195560485\times10^{24}.                         \tag{1}
\]

This single actual-theta rung refutes the proposed **uniform fixed-\(U_3\)
sufficient mechanism**.  It does not determine the new signed moment
\(M_{15}\), does not show that the true Sobolev target is negative, does not
rule out adaptive or growing score dictionaries, and is neither an RH proof
nor an RH counterexample.

## Frozen inputs and provenance

The following hashes were checked directly before replay:

| artifact | SHA-256 |
|---|---|
| tight signed-moment source `certify_u3_kappa15_signed_moments_20261103.py` | `dc5828f6ce61a461d5a881c08d0e4034dab473f85dabd20be488dd4b5f6ff178` |
| tight signed-moment receipt `u3_kappa15_signed_moments_20261103.json` | `94d3741b7eabecf2f0f0ccc33a2786f8a4eaae752a98e1076fe08389828b1eff` |
| signed-moment canonical payload | `924c7d10d504af4e09e1754b757bf187499d09dd1b53e743865b552e87686f25` |
| fixed-\(U_3\) verifier `verify_u3_kappa15_obstruction_20261103.py` | `568a6159b08563a9af938927dae0cf8f8458a1fc7dc562eb66d26f82b0612050` |
| primary fixed-\(U_3\) result `u3_kappa15_actual_obstruction_20261103.json` | `54a67b1978aaa0c9afc00df02e3e9549f064a54464d068a5540e5e157c0e6dad` |
| fixed-\(U_3\) canonical payload | `98fdae45f517af41716bf4cfde375f15358335ddd7c2eae1d0103802d68099f4` |
| positive-moment engine `audit_reverse_schur_actual_failure.py` | `5d86938507fe5bc78994cfd5658a0de745835f614534f98161083c2651a62536` |
| reflected-moment proof `ACTUAL_REPAIR_PROOF.md` | `f6b3d0d7b4322104bd68a2ad01a85039eeab40c1939c9dd9d2672a1bac9f7a06` |
| independent full-split audit `AUDIT.md` | `c0df6973d7186b53b30e0c47647fc71a3f90ce046cac1fa8c07697906a7d40a5` |
| frozen proof manifest `ACTUAL_REPAIR_FROZEN_SHA256.txt` | `373fe7b29163a876dfe25eb1493d30747f094524798d1e20f4998f948b3446ba` |

The signed-moment receipt's embedded source hash equals the frozen source
hash, and its canonical payload hash was recomputed independently.  The same
checks passed for the downstream result.

## Independent clean replay

The signed-moment generator was rerun once at 110 decimal digits from the
frozen source.  It completed all 3072 cells in 198.1 seconds and returned
`PASS`.  The primary and replay artifacts had different whole-file hashes,
as expected, because the receipt deliberately records PID, elapsed time, and
therefore a metadata-dependent payload hash:

```text
primary signed receipt   94d3741b7eabecf2f0f0ccc33a2786f8a4eaae752a98e1076fe08389828b1eff
replay signed receipt    cac36b252eedca4cbb5fdb0f970faa5ce6180bad72f6c249a289e911eef392e5
```

The substantive replay was exact:

- all 15 moment endpoint pairs were byte-for-byte equal;
- all Taylor and spatial remainder bounds were byte-for-byte equal;
- the provenance block was equal;
- after removing only `runtime.elapsed_seconds`, `runtime.pid`, and the
  consequent `receipt_integrity` block, the parsed JSON objects were equal.

The fixed-\(U_3\) verifier was then rerun at 800-bit Arb precision.  Its replay
was fully byte-identical to the primary result:

```text
54a67b1978aaa0c9afc00df02e3e9549f064a54464d068a5540e5e157c0e6dad
```

and independently recomputing the canonical compact JSON gave payload hash

```text
98fdae45f517af41716bf4cfde375f15358335ddd7c2eae1d0103802d68099f4
```

## Signed data, endpoint padding, and normalization

The tight source covers \([0,3]\) with 3072 midpoint cells of width
\(1/1024\), degree-20 even Taylor integration, Cauchy radius \(1/20\), and
ratio

\[
 q=\frac{1/2048}{1/20}=\frac5{512}.
\]

It retains theta orbits \(1,\ldots,16\), bounds every orbit \(n\ge17\), and
adds the complete \(h\ge3\) spatial tail.  The independently replayed source
reproduced all of these enclosures.

The stored signed moments obey

\[
 \mu_j=4^jM_j.
\]

Every serialized decimal interval is first enlarged by

\[
 10^{-90}(1+|L|+|U|)
\]

and only then divided exactly by \(4^j\).  The source serialized at 110
decimal digits, so this inherited padding dominates any endpoint conversion
rounding by many orders of magnitude.

The odd \(N=7\) residual solve uses old Hankel indices \(1,\ldots,13\) and old
target-column indices \(8,\ldots,14\).  Thus only old data are used.  The
receipt contains \(M_0,\ldots,M_{14}\), and contains no \(M_{15}\).  In
particular, the negative auxiliary sign is independent of the unknown new
signed pivot.

## Complete positive moments

The hash-bound positive-moment engine was extended from derivative order 11
to exactly the required order 16.  This is sufficient because the largest
generator degree is 16, so the largest Gram product degree is 32.  No higher
positive moment enters.

The engine assembles the exact orbit block \(1,\ldots,8\) and bounds every
orbit \(n\ge9\).  Its polynomial envelope assertions pass through order 16.
The generalized consecutive-tail ratio is

\[
 \left(\frac{10}{9}\right)^{35}e^{-19\pi}
 =4.768276670778354\ldots\times10^{-25}<\frac12,             \tag{2}
\]

so the engine's factor-two tail norm remains valid at the extended order.
The omitted common spectral factor \(4\pi>0\) scales \(K,y,A\) consistently
and cannot change any reported sign.

## Exact rank and inverse-free sign audit

Write

\[
 K_2=\begin{pmatrix}A&E\\E&D\end{pmatrix},
 \quad y_2=\binom{B}{Y},
 \quad
 K_3=\begin{pmatrix}A&E&F\\E&D&G\\F&G&T\end{pmatrix},
 \quad y_3=\begin{pmatrix}B\\Y\\R\end{pmatrix}.
\]

The coefficient minor on degrees \((16,14,12)\), with
\(a=[t^{13}]q\), \(b=[t^{11}]q\), is

\[
 2\{2\kappa b-(\kappa-2)a^2\}
 \in[-12555231.905680629,-12555231.905680627].               \tag{3}
\]

Thus the three polynomial generators have rank exactly three before any Gram
inversion.

Define the cleared quantities

\[
\begin{aligned}
 \Delta_2&=AD-E^2,\\
 H_{\rm num}&=DB^2-2EBY+AY^2-A\Delta_2,\\
 S_{\rm num}&=T\Delta_2-(DF^2-2EFG+AG^2)=\det K_3,\\
 D_{\rm num}&=R\Delta_2-(DF-EG)B-(AG-EF)Y,\\
 N_{\rm clear}&=D_{\rm num}^2+H_{\rm num}S_{\rm num}.
\end{aligned}                                               \tag{4}
\]

This is the denominator-free Schur identity

\[
 H_{U_3}=\frac{N_{\rm clear}}
                 {4\Delta_2S_{\rm num}}.                    \tag{5}
\]

It is also \(\Delta_2\) times the direct adjugate numerator
\(y_3^{\mathsf T}\operatorname{adj}(K_3)y_3-A\det K_3\); the
extra factor is strictly positive and does not change the sign.

The replay certifies

\[
\begin{aligned}
 \Delta_2&>3.795179189770072\times10^{59},\\
 S_{\rm num}&>3.980173147875899\times10^{92},\\
 N_{\rm clear}&<-5.973346107310686\times10^{177}<0.          \tag{6}
\end{aligned}
\]

Thus both Gram matrices are positive definite, while the fixed-\(U_3\)
margin is strictly negative.  Two independent algebraic cross-checks pass:

\[
 \det\begin{pmatrix}K_3&y_3\\y_3^{\mathsf T}&A\end{pmatrix}
 =-\frac{N_{\rm clear}}{\Delta_2}
 >1.573926750024524\times10^{118},                           \tag{7}
\]

and the Schur repair expression satisfies

\[
 \operatorname{innovation}^2+4H_{U_2}\sigma
 <-4.147179705516413\times10^{58}<0.                         \tag{8}
\]

Equations (6)--(8), rather than a midpoint matrix inverse, establish the
obstruction.

## Consequence

The earlier low-rung positive checks cannot extend to a uniform theorem for
this fixed three-generator dictionary: the actual complete-theta odd
\(\kappa=15\) rung is a certified counterexample to that auxiliary claim.

What remains viable is an old-data adaptive or growing dictionary.  Candidate
features may be chosen from \(q\), already-known recurrence coefficients, and
complete positive moments by maximizing their certified Schur gain.  Any such
replacement still needs a new all-degree analytic inequality; this finite
obstruction neither supplies nor rules out one.
