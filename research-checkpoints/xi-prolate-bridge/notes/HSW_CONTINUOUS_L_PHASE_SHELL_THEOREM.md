# HSW continuous-L phase-shell theorem

## 0. Exact outcome and claim boundary

Let `mathcal N(T)` count positive zeta ordinates through height `T` with
algebraic multiplicity, and use exactly the frozen
Hasanalizade--Shen--Wong functions

\[
 \begin{aligned}
 \mathcal M(T)&={T\over2\pi}\log{T\over2\pi e},\\
 \mathcal R(T)&=0.103787\log T
       +0.257297\log\log T+9.367419,\\
 |\mathcal N(T)-\mathcal M(T)+1/8|&\leq\mathcal R(T)
 \qquad(T\geq30610046000).
 \end{aligned}                                      \tag{0.1}
\]

For every sufficiently large integer `T`, Section 2 selects one parity of
the unit bins in `(T,2T]`.  Let `Gamma_T` be the set of distinct selected
ordinates, each equipped with its algebraic weight `m_gamma`, and put

\[
 \begin{aligned}
 U_T&=\sum_{\gamma\in\Gamma_T}{m_\gamma\over\gamma^2},\\
 C_T(L)&=\sum_{\gamma\in\Gamma_T}
       {m_\gamma e^{i\gamma L}\over\gamma^2},\\
 W_T(L)&=\sum_{\gamma\in\Gamma_T}
       {m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
       ={U_T-\Re C_T(L)\over2}.
 \end{aligned}                                      \tag{0.2}
\]

The selection retains order `T*log(T)` multiplicity while different
selected bins are separated by more than one.  For every fixed interval
length `h>0`, uniformly in its left endpoint `A`,

\[
 \boxed{
 \int_A^{A+h}|C_T(L)|^2\,dL
 \ll_h{\log^3T\over T^3}.}                           \tag{0.3}
\]

At the same time,

\[
 U_T\gg{\log T\over T}.                              \tag{0.4}
\]

Consequently the bad set

\[
 \mathcal B_T(A,h)=
 \{L\in[A,A+h]:|C_T(L)|>U_T/2\}                     \tag{0.5}
\]

obeys

\[
 \boxed{
 |\mathcal B_T(A,h)|\ll_h{\log T\over T}=o(1),}     \tag{0.6}
\]

and every point outside it satisfies the optimal-order phase-shell lower
bound

\[
 \boxed{
 W_T(L)\geq{U_T\over4}gg{\log T\over T}.}          \tag{0.7}
\]

No simplicity assumption or individual zero-gap theorem is used.  Close
or repeated ordinates are handled inside one unit bin; the HSW local
multiplicity upper bound controls their complete cluster square.

Thus every cofinal sequence of fixed-length `L`-intervals contains a
source-defined cofinal sequence on which (0.7) holds.  Section 5 places a
common shell inside a fixed positive fraction of the locked carrier band

\[
 L=2\log\lambda,
 \qquad N(L)=\lceil e^{L/2}L^3\rceil,
 \qquad \Omega(L)={2\pi N(L)\over L}.                \tag{0.8}
\]

On the RH-conditional branch, these are actual positive zero rows.  If an
independent theorem also gives the joint amplitude lower bound

\[
 \left|H_{N(L)}\!\left({\gamma L\over2\pi}\right)\right|
 \geq\mathcal A_L
 \qquad(\gamma\in\Gamma_T),                          \tag{0.9}
\]

at the same `L`, then the exact endpoint denominator satisfies

\[
 \boxed{
 D_N\gg\mathcal A_L^2{\log T\over T},
 \qquad
 (\eta_N^{\rm pr})^2
 \ll {d_N^2T\over\mathcal A_L^2\log T}.}            \tag{0.10}
\]

Equation (0.10) is a conditional interface, not an amplitude theorem.
The actual projected coefficients, `H_N`, and `N` all move with `L`.
There is no inequality that replaces the average of their product by the
product of the separate phase and amplitude averages.  The frozen inputs
provide no uniform or positive-measure lower bound in (0.9).

This is an unbound theorem-only post-checkpoint-1.41 note/test pair.  It
adds no zero table, numerical phase sample, source lock, or serialized
artifact.  The standard eight are unchanged.  It proves no decay or
failure of `eta_N^pr`, no actual arithmetic sign, no even reserve, no new
zeta-zero theorem, no RH implication or converse, and no de
Bruijn--Newman `Lambda` bound.  The formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Only the following six frozen repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| notes/ACTUAL_ENDPOINT_RATIONAL_VARIANCE_FAR_TAIL_BARRIER.md | 88965c9926092be319f83014408b689622911b1d27b5e5f266e2d7fb74e92644 |
| tests/test_actual_endpoint_rational_variance_far_tail_barrier.py | bd993af601bcddbd48ad077bd9b9c64f0cfb34ba2354b617de94f66029d0716c |
| notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md | ceb3e7067ed9ef9f02f443b665a83f778500630ded912e60df128abc8c17514a |
| tests/test_anti_carrier_log_schedule.py | 304175ece40e36ae979dffa44c43009d1b796be2d72a820d7021758a34472a1b |
| ZERO_SAMPLING_SOURCE_LOCK.json | f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101 |
| DIRECT_RH_ATTACK.md | b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2 |

The endpoint-variance pair supplies `D_N`, `d_N`, `H_N`, the carrier
convention, and the exact eta quotient.  The anti-carrier pair and source
lock supply the multiplicity-aware HSW functions, the unit-bin upper
bound, and the existing coarse separated extraction.  The direct-attack
byte supplies only the statement that one explicit unbounded diagonal
sequence is enough for the final locally uniform limit bridge; estimates
for every `lambda` are unnecessary.  No external theorem is added: the
mean-square estimate below is proved directly.

## 2. Unit-bin parity selection with full multiplicity

For an integer `T` in the locked HSW range, define

\[
 \begin{aligned}
 Z(T)&=\mathcal M(2T)-\mathcal M(T)
       -\mathcal R(2T)-\mathcal R(T),\\
 B(T)&={1\over2\pi}\log{2T\over2\pi}+2\mathcal R(2T).
 \end{aligned}                                      \tag{2.1}
\]

Then

\[
 \mathcal N(2T)-\mathcal N(T)\geq Z(T),
 \qquad
 Z(T)=\left({1\over2\pi}+o(1)\right)T\log T,       \tag{2.2}
\]

and every unit bin `I_r=(T+r,T+r+1]`, `0<=r<T`, has

\[
 M_r:=\sum_{\gamma\in I_r}m_\gamma\leq B(T),
 \qquad
 B(T)=O(\log T).                                     \tag{2.3}
\]

Choose `epsilon_T` in `{0,1}` so that the parity class

\[
 \mathcal P_T=\{0\leq r<T:r\equiv\epsilon_T\pmod2\} \tag{2.4}
\]

carries at least half the shell multiplicity, and let `Gamma_T` be the set
of distinct ordinates in those bins, with weights `m_gamma`.  Thus

\[
 Q_T:=\sum_{r\in\mathcal P_T}M_r
 \geq{\mathcal N(2T)-\mathcal N(T)\over2}
 \geq{Z(T)\over2}.                                   \tag{2.5}
\]

Because `T<gamma<=2T`,

\[
 \boxed{
 U_T\geq{Q_T\over4T^2}\geq{Z(T)\over8T^2}
 =\left({1\over16\pi}+o(1)\right){\log T\over T}.} \tag{2.6}
\]

The parity choice is by total algebraic multiplicity, not by occupied-bin
count.  It therefore retains the full `log(T)` factor that is lost when one
keeps only one ordinate from each separated bin.

## 3. Direct cluster mean-square bound

For `r` in `mathcal P_T`, put

\[
 C_r(L)=\sum_{\gamma\in I_r}
 {m_\gamma e^{i\gamma L}\over\gamma^2},
 \qquad
 A_r=\sum_{\gamma\in I_r}{m_\gamma\over\gamma^2}.
                                                               \tag{3.1}
\]

Then `C_T=sum_(r in P_T) C_r` and

\[
 0\leq A_r\leq{M_r\over T^2}\leq{B(T)\over T^2}.    \tag{3.2}
\]

Inside one bin, no spacing is asserted.  The pointwise triangle inequality
gives

\[
 \sum_{r\in\mathcal P_T}
 \int_A^{A+h}|C_r(L)|^2\,dL
 \leq {hB(T)^2\over T^3}.                            \tag{3.3}
\]

For distinct selected bins `r<q`, one has `q-r>=2`, and any ordinates in
them obey

\[
 \nu-\gamma>q-r-1\geq{q-r\over2}.                   \tag{3.4}
\]

Hence

\[
 \left|\int_A^{A+h}e^{i(\gamma-\nu)L}\,dL\right|
 \leq{2\over|\gamma-\nu|}\leq{4\over q-r}.         \tag{3.5}
\]

After both cross orientations are included,

\[
 \begin{aligned}
 2\sum_{\substack{r<q\\r,q\in\mathcal P_T}}
 \left|\int_A^{A+h}C_r(L)\overline {C_q(L)}\,dL\right|
 &\leq8\sum_{r<q}{A_rA_q\over q-r}\\
 &\leq{8B(T)^2\{1+\log T\}\over T^3}.
 \end{aligned}                                      \tag{3.6}
\]

The last inequality uses at most `T` possible first bins and
`sum_(d<=T)1/d<=1+log(T)`.  Combining (3.3) and (3.6) proves the explicit
uniform estimate

\[
 \boxed{
 \int_A^{A+h}|C_T(L)|^2\,dL
 \leq E(T,h):={B(T)^2\over T^3}
 \{h+8(1+\log T)\}.}                                 \tag{3.7}
\]

Since `B(T)=O(log(T))`, equation (3.7) proves (0.3).  Repeated zeros are
already inside `M_r` and `A_r`; they do not create independent rows and are
not silently treated as simple.

## 4. Almost-full-measure phase lower bound

Chebyshev's inequality, (2.6), and (3.7) give

\[
 \begin{aligned}
 |\mathcal B_T(A,h)|
 &\leq {4E(T,h)\over U_T^2}\\
 &\leq {256B(T)^2T\{h+8(1+\log T)\}\over Z(T)^2}
 =O_h\!\left({\log T\over T}\right).
 \end{aligned}                                      \tag{4.1}
\]

This proves (0.6), uniformly in `A`.  On its complement,

\[
 W_T(L)={U_T-\Re C_T(L)\over2}
 \geq{U_T-|C_T(L)|\over2}
 \geq{U_T\over4}
 \geq{Z(T)\over32T^2}.                              \tag{4.2}
\]

In particular, every constant `c<1/(64*pi)` satisfies

\[
 W_T(L)\geq c{\log T\over T}                        \tag{4.3}
\]

for all sufficiently large `T` and every good `L`.

The order cannot be improved from counting information alone.  Indeed the
whole shell, before parity deletion, obeys

\[
 \sum_{T<\gamma\leq2T}{m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
 \leq{\mathcal N(2T)-\mathcal N(T)\over T^2}
 =O\!\left({\log T\over T}\right).                  \tag{4.4}
\]

Thus (4.3) has optimal shell order.  It is an almost-everywhere-in-`L`
theorem, not a pointwise theorem on a preassigned grid.  The HSW-compatible
carrier-lattice models in the frozen anti-carrier note show why the count
alone cannot give such a fixed-grid statement.  Qualitative simplicity
would not by itself provide quantitative inhomogeneous separation from the
carrier lattice.

## 5. Cofinal extraction on the locked moving carrier schedule

Fix `h>0` and let `I_j=[A_j,A_j+h]` with `A_j` tending to infinity.  Define

\[
 \Omega_j^-=\inf_{L\in I_j}\Omega(L),
 \qquad
 T_j=\left\lfloor{\Omega_j^-\over2}\right\rfloor.   \tag{5.1}
\]

Then `T_j` tends to infinity and

\[
 (T_j,2T_j]\subset(0,\Omega(L)]
 \qquad(L\in I_j)                                   \tag{5.2}
\]

for all sufficiently large `j`.  Moreover, uniformly on a fixed-length
interval,

\[
 \Omega(L)=2\pi e^{L/2}L^2\{1+o(1)\},              \tag{5.3}
\]

so the shell in (5.2) lies in a fixed positive-fraction high-carrier band;
the fraction may depend on `h` but not on `j`.

By (4.1), the good set in `I_j` has measure `h-o(1)`.  It is closed and
nonempty for large `j`.  Choose its least point `L_j`, and put

\[
 \lambda_j=e^{L_j/2},
 \qquad
 N_j=\lceil\lambda_jL_j^3\rceil.                    \tag{5.4}
\]

Then `lambda_j` is cofinal, the locked ceiling schedule is retained, and
the actual selected shell rows satisfy (4.3).  No averaging of `N` is used:
the common shell was placed below the minimum carrier edge before `L_j`
was selected.

The frozen final bridge needs only one explicit unbounded diagonal
sequence, so this source-defined sequence is sequentially admissible for
the phase component.  That statement is conditional in the precise sense
that every other finite strictness, amplitude, shifted-resolvent, and
convergence gate must hold on the same `L_j`.  A full-measure continuous
set need not contain a point of a prescribed countable grid, so (5.4) does
not transfer the theorem to half-integers or any other preassigned discrete
schedule.

## 6. Exact conditional amplitude interface

Assume RH in this section and use the actual endpoint quantities

\[
 \begin{aligned}
 w_\gamma(L)&={m_\gamma\sin^2(\gamma L/2)\over\gamma^2},\\
 D_N(L)&=\sum_{\gamma>0}w_\gamma(L)
 \left|H_N\!\left({\gamma L\over2\pi}\right)\right|^2,\\
 (\eta_N^{\rm pr})^2&={d_N^2S_0\over D_N},
 \qquad S_0=\sum_{\gamma>0}w_\gamma(L).
 \end{aligned}                                      \tag{6.1}
\]

Let `L` be good for the selected shell and suppose (0.9) holds on every
selected noncarrier row.  Exact carriers are interpreted continuously and
have zero right side in the phase-only lower bound, so they cause no loss.
Positivity gives

\[
 \boxed{
 D_N(L)\geq\mathcal A_L^2W_T(L)
 \geq{\mathcal A_L^2Z(T)\over32T^2}.}               \tag{6.2}
\]

The locked zero count also gives the finite constant

\[
 C_{\mathfrak Z}:=\sum_{\gamma>0}{m_\gamma\over\gamma^2}<\infty,
 \qquad S_0\leq C_{\mathfrak Z}.                    \tag{6.3}
\]

Consequently

\[
 \boxed{
 (\eta_N^{\rm pr})^2
 \leq{32C_{\mathfrak Z}d_N^2T^2
            \over\mathcal A_L^2Z(T)}
 \ll {d_N^2T\over\mathcal A_L^2\log T}.}           \tag{6.4}
\]

Thus this interface would imply `eta_N^pr=o(1)` only if an independent
amplitude theorem supplied

\[
 {\mathcal A_L\over|d_N|\sqrt{T/\log T}}
 \longrightarrow\infty                              \tag{6.5}
\]

on the same selected sequence.  At `T` comparable to the locked carrier
edge, `T/log(T)` is comparable to `lambda*L`, so the extra amplitude factor
is of order `sqrt(lambda*L)` relative to the endpoint.

An analogous variance interface follows if (0.9) is replaced by a lower
bound for

\[
 \left|H_N\!\left({\gamma L\over2\pi}\right)
       +{\sqrt L\,J_L\over4S_0}\right|,              \tag{6.6}
\]

because the exact endpoint identity makes the expression in (6.6) the
deviation from the weighted mean.  The current source-Cauchy theorem fixes
that mean but does not lower-bound these deviations.

The asymptotically full phase-good set does provide one precise joining
rule.  If a future amplitude theorem holds uniformly on `I_j`, or on a
measurable subset of `I_j` having a fixed positive measure, then it
intersects the phase-good set for all sufficiently large `j`.  An isolated
amplitude point with no quantitative `L`-stability need not intersect it.
The dependence of the actual prolate coefficients and `H_N` on `L`, and
the jumps of the ceiling cutoff, are exactly why separate averaging does
not prove (6.2).

## 7. Stopping point

The HSW input does supply an optimal-order continuous-parameter phase
lower bound and a cofinal locked-schedule extraction.  It does not supply
the actual high-row amplitude, an average of the phase-amplitude product,
or a pointwise theorem on a prescribed arithmetic schedule.  A successful
continuation needs a uniform or positive-measure Stokes/projection-tail
lower bound on the selected rows, strong enough for (6.5), or a direct
joint mean-square theorem for the complete products in `D_N`.  No such
statement is inferred here.
