# Actual root-deletion frame and a rank-one obstruction to finite differential closure

Status: independent analytic review PASS. No new all-degree inequality is claimed.

## 1. Root-deletion costs in the actual prefix metric

Work at normalized shift a=0. Let L[r]=∫r(t)Λ_F(t)dt, Λ_F=F′²−FF″, with the original complete theta transform F. Assume only that L is positive definite on real polynomials of degree≤n−1. Let p_n be the actual monic polynomial orthogonal to that prefix, obtained using its actual inverse and the cross moments through degree 2n−1. No sign of L[p_n²] is assumed.

The usual finite Jacobi compression gives real simple roots r_1,…,r_n of p_n. Put q_j=p_n/(t−r_j). Then

L[q_j q_k]=0 for j≠k,   d_j=L[q_j²]>0.                            (1)

Indeed q_jq_k=p_n times a polynomial of degree n−2 when j≠k. The q_j are independent (evaluate at the distinct roots), so u_j=q_j/√d_j is an orthonormal basis of the actual prefix. This is not orthogonality in the auxiliary positive measure F²dt.

Define the full positive-parent Gram B_jk=∫u_j(t)u_k(t)F(t)²dt. The exact root-deletion/Bezout budget is

L[p_n²]=2||(p_nF)′||²−Σ_j d_j B_jj.                              (2)

Thus the combined deletion cost is the trace tr(diag(d_j)B) in the actual known prefix frame. The equivalently defined positive Gauss weights w_j=d_j/p_n′(r_j)² use only that prefix. There is no next-norm normalization in (1)–(2).

This compression does not establish the inequality required in (2). In particular, applying the prefix Gauss formula to degree 2n as though it were exact would force a false conclusion: Σ_jw_jp_n(r_j)²=0, whereas its true integral is exactly the unknown next value L[p_n²]. Gaussian exactness here stops at degree 2n−1. Neither positivity of B nor positivity of d_j controls the difference in (2).

## 2. Why a fixed rational differential closure is unavailable for the original theta

A possible analytic shortcut would reduce every higher signed Bezout symbol to a fixed finite system of theta derivatives with polynomial or rational coefficients in the physical coordinate u. Any such derivative closure containing ψ,ψ′,…,ψ^{(m−1)} and expressing ψ^{(m)} in their rational-coefficient span would imply a nonzero linear ODE

Σ_{j=0}^m a_j(u)ψ^{(j)}(u)=0,   a_j∈C[u], a_m not identically zero. (3)

For the original complete theta profile, (3) is impossible. This is an unconditional rank-one arithmetic obstruction, not a generic Gaussian counterexample.

Let Θ(q)=Σ_{n∈Z}exp(−πn²q), Re q>0. Exactly

ψ(u)=4e^{u/2}[q²Θ″(q)+(3/2)qΘ′(q)],  q=e^{2u}.

The original rank-one spectrum gives the imaginary period Θ(q+2ik)=Θ(q) for every integer k. Poisson modular inversion gives, for x↓0,

Θ(x)=x^{−1/2}(1+O(e^{−π/x})),
Θ′(x)=−(1/2)x^{−3/2}+exponentially small derivative error,
Θ″(x)=(3/4)x^{−5/2}+exponentially small derivative error.

Fix an integer k≥1, write q_k=2ik and u_k=(1/2)Log q_k=(1/2)log(2k)+iπ/4. Approach within the analytic strip along u(x)=(1/2)Log(q_k+x). Periodicity, with derivatives, gives

ψ(u(x)) ~ 3 e^{u_k/2} q_k² x^{−5/2}.                            (4)

The coefficient is nonzero. Hence every u_k is a genuine singular boundary point of the analytic theta profile. There are infinitely many distinct u_k.

If (3) held on the real axis, analyticity extends it throughout |Im u|<π/4. Every point where a_m is nonzero is an ordinary point of the ODE; its solutions extend holomorphically to a neighborhood of that point. Thus each u_k would have to be a zero of a_m, contradicting its being a nonzero polynomial. Clearing denominators proves the same impossibility for rational coefficients.

This rules out a fixed finite derivative closure of the stated rational type. It also rules out realizing ψ as a rational-coefficient finite differential operator applied to a Gaussian: such an output is meromorphic with only finitely many poles, unlike (4). It does NOT rule out infinite-dimensional systems, nonrational coefficients with infinitely many singularities, integral operators, or a new arithmetic estimate of (2).

## 3. Relation to the common-scale signed compensation

The all-degree common-scale Bezout identity remains exact, including the actual negative central first-odd contribution. The frame (1) avoids independently estimating arbitrarily many deletion polynomials in mismatched metrics, but supplies no correlated source lower bound. The arithmetic fact (4) shows why one particular proposed way of closing the k,k′,… derivative hierarchy cannot work: no fixed rational differential recurrence exists for the original theta.

Any derivative-closure approach must avoid the excluded fixed rational linear form; a direct arithmetic inequality remains possible. Such an inequality must control the source in (2), with actual prefix dependence and signed common-scale terms retained. Using the desired next value as a Gauss quadrature error lower bound would be circular. No such lower bound, all-shift statement or new finite degree is established in this packet.

Primary reference for the modular inversion used in (4): NIST DLMF §20.7(viii), equation 20.7.32, https://dlmf.nist.gov/20.7#E32, evaluated at theta argument zero and imaginary lattice parameter. The imaginary period in q follows directly from the defining rank-one series and needs no zero-location assumption.
