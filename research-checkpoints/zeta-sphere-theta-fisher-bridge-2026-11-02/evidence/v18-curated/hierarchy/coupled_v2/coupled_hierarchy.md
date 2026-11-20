# Coupled derivative/moment Gram hierarchy: exact signed state and minimal deficit

Status: scoped structural theorems and a usable correlated-tail certificate. No proof of RH or M_n positive definiteness. Prior certified outputs in the parent directory are unchanged.

## 1. A full matrix state which is unconditionally positive

Let q_j(u)=u^j psi(u), j=0,...,2n, on the whole line, and set

    J_n(v)_{jk}=integral_R q_j(u)q_k(u+2v)du.

This is a matrix-valued positive-definite stationary kernel. Indeed, each finite matrix-kernel quadratic form is an integral of the squared modulus of a sum of translated q_j. Its spectral matrix is the outer product of the vector of Fourier transforms of q_j, hence PSD and rank one pointwise in frequency. This last statement is an explicit transform of known theta data, not a square root of the unknown scalar spectral density.

A change of variables x=h-v, using evenness in h, yields the exact scalar contraction

    M_n(v)=tr(H_n J_n(v)),
    (H_n)_{jk}=binomial(2n,j)/2^(2n+1) if j+k=2n, else 0.    (1)

All cross terms are present. The central diagonal entry is positive; the remaining entries form n disjoint symmetric 2-by-2 off-diagonal blocks. Consequently

    inertia(H_n)=(n+1 positive, n negative, 0 zero).           (2)

Thus the enlarged matrix state is positive, but its required output functional is not a positive functional. No universal completely positive linear output can agree with this contraction on every PSD matrix input: testing a rank-one matrix on a negative eigenvector immediately contradicts positivity. Adding ancillary PSD blocks does not alter that elementary obstruction if the final map is required to agree on all inputs.

This is a statement about the explicit universal linear contraction, not a claim that every possible theta-specific enlargement or factorization is impossible. In particular, restricted theta spectral vectors might still obey a nontrivial sign inequality; that is precisely the missing information.

## 2. Minimal negative-channel mass, including explicit theta data

Write m_k=integral_0^infinity u^(2k)psi(u)^2du. The zero-lag state S=J_n(0) has entries

    S_jk=0 if j+k odd, and S_jk=2m_((j+k)/2) otherwise.

It is strictly positive definite: a nonzero polynomial cannot vanish almost everywhere against the strictly positive density psi(u)^2.

Consider all constant-matrix signed sum-of-squares decompositions of this fixed contraction,

    H_n=P−N,  P,N PSD.

The negative channel's total spectral mass equals its zero-lag value tr(NS). Its exact minimum is

    min tr(NS)=tr[(S^(1/2)H_n S^(1/2))_-] >0  (n>=1).        (3)

Here B_- denotes the positive-semidefinite negative part of a Hermitian matrix B. Proof: congruence sends the decomposition to B=Ptilde−Ntilde with PSD terms and objective tr(Ntilde). If Pi_- projects onto the negative spectral subspace of B, then

    tr(Ntilde)>=tr(Pi_- Ntilde)>=−tr(Pi_- B)=tr(B_-).

Equality is attained by Ptilde=B_+, Ntilde=B_-. Inertia is preserved under the invertible congruence, so the optimum is strictly positive for n>=1.

This quantifies the irreducible signed mass of **this fixed moment-coordinate contraction**, even after optimizing all constant matrix decompositions—not just independent pair scalings. It is not a bound on every conceivable alternative representation of M_n: adding an identity that vanishes on the particular theta curve or changing the state nonlinearly is outside the theorem.

### First nontrivial level

At n=1 the three eigenvalues of B=S^(1/2)H_1 S^(1/2) are

    m_1/2,  (m_1+sqrt(m_0m_2))/4,  (m_1−sqrt(m_0m_2))/4.

Therefore the minimum negative mass is

    delta_1=(sqrt(m_0m_2)−m_1)/4 >0.                         (4)

Strict positivity is strict Cauchy–Schwarz for 1 and u² in L²(psi²du). This does not say L_1[Xi] is negative anywhere: the positive channels may dominate the negative channels at every frequency. It says that enlarged-Gram positivity alone cannot discard the negative channels, even at the first level.

`certify_moments.py` computes validated enclosures of m_0,m_1,m_2 and delta_1/m_1 using the complete theta-index and integration tails from the reviewed earlier certificate. Numeric results will be appended after its run.

## 3. A genuinely usable coupled tail certificate

At a fixed frequency let x be the Fourier vector of a controlled head and y the Fourier vector of its exact residual tail, in the above q_j coordinates. Ignore an overall positive Fourier-normalization factor. The target scalar sign is

    (x+y)^* H_n (x+y)>=0.

Assume a proved **correlated** ellipsoidal enclosure y^*D^(-1)y<=1, D positive definite. For any lambda>=0, the finite block certificate

    [[H_n+lambda D^(-1), H_n x],
     [x^*H_n, x^*H_n x−lambda]] PSD                         (5)

is sufficient. Multiply (5) by (y,1) to obtain the target scalar minus lambda(1−y^*D^(-1)y), proving the implication directly. No global positivity hypothesis is used.

If the upper-left block is strictly positive definite, it suffices to verify the scalar Schur inequality

    x^*H_n x−lambda
      >=x^*H_n(H_n+lambda D^(-1))^(-1)H_n x.                (6)

All quantities concern a finite head and explicit residual enclosure; this can certify finite-frequency windows without circularly evaluating the desired unknown sign. Singular blocks use the usual range condition and pseudoinverse. We only need the proved sufficient direction here; no appeal to a lossless S-lemma is needed.

A simple valid D comes from a full-tail envelope: if p(u) is the vector of monomials, w(u)>0 and integral |r(u)|²/w(u)du<=epsilon², then

    D=epsilon² integral_R w(u)p(u)p(u)^*du

encloses y=integral r(u)p(u)exp(itu)du by matrix Cauchy–Schwarz. A small positive regularizer can make D invertible. This bound retains moment correlations but is phase-blind; it may be far too large in the cancellation regime.

## 4. Interaction with the coherent modular-tail certificate

The modular lane's outward-amplitude coordinates use F=H+R, q=H'/H,

    u=R/H, v=(R'−qR)/H,
    W/|H|²=Re(q)|1+u|²+Re(v conjugate(1+u)).

Its residual R'−qR is a triangular linear transformation of the tail vector (R,R'). The same construction applies to derivative jets here: choose a head-adapted triangular change of basis T and transform the state, metric and sign matrix together,

    x→Tx, y→Ty, D→TDT^*, H_n→T^(−*)H_nT^(−1).

Certificate (5) is invariant under this invertible coordinate change. Therefore **a basis change alone cannot tighten an already optimal full correlated ellipsoid**. Its practical gain comes from deriving a sharper enclosure for the transformed tail integral before discarding phase correlations—exactly the role of the modular lane's integral

    integral r_N(s)[s sinh(ws)−q cosh(ws)]ds.

A covariance Schur complement also identifies the irreducible tail-slope uncertainty after conditioning on tail amplitude. For a two-component covariance D, the best linear residual variance is D_22−|D_12|²/D_11; replacing this by D_22 throws away useful coupling. The minimizing regression coefficient need not equal the head logarithmic derivative q, so alignment to the head and covariance minimization are distinct optimization choices.

The useful next computational object is consequently an enlarged **correlated** defect enclosure in a head-adapted jet basis, passed into (5), not a claim that the enlarged Gram state or each derivative-profile kernel is positive enough by itself. This can provide scoped finite-window certificates. To reach all orders and heights requires new uniform estimates; none are claimed here.

## 5. Completed validated first-level deficit

The original local interval script `certify_moments.py` completed with 507 adaptive Simpson leaves. Outward-rounded enclosures are

    0.6395036239166254 < m_0 < 0.6395036239353165,
    0.0157190585222760 < m_1 < 0.0157190585324362,
    0.0011075375237668 < m_2 < 0.0011075375323954.

Thus

    0.0027235910055542 < delta_1 < 0.0027235910341089,
    0.1732668022 < delta_1/m_1 < 0.1732668042.

At least 17.32668% of the scalar zero-lag mass M_1(0) is an unavoidable **negative-channel mass** in any constant signed-SOS decomposition of the fixed three-coordinate moment contraction. Positive-channel mass exceeds total scalar mass accordingly; the statement does not say any scalar Fourier value is negative.

`moment_intervals.json` contains detailed interval endpoints. Its analytic tails are the same reviewed uniform bounds for psi derivatives through order four and h>=4 used by `../ratio_certificate_notes.md`; powers k=0,2,4 make the integration-tail bound only easier. The finite-interval Simpson error is bounded by the full fourth derivative and 10^-10 absolute tolerance per moment, with no numerical approximation used as a proof input. The lower negative-mass and fraction margins are much larger than endpoint display uncertainty.

The foundations lane independently reviewed the structural theorem and exact n=1 eigenvalues. This lane also independently reviewed and approved the foundation lane's explicit full-theta coherent certificate on 1/10<=a<=1/4, |t|<=1, recorded in `../../foundations/EXPLICIT_COHERENT_RECTANGLE.md`. That finite rectangle demonstrates a real application of coupled head–tail control; it is not a novel zero-free region or an all-height result.

## 6. Coupled-route ledger

- **Enlarged moment autocorrelation Gram is PSD:** true, but its scalar output has inertia (n+1,n), so Gram positivity alone does not finish the sign argument.
- **Constant signed-SOS rearrangement can eliminate all negative mass:** false for the fixed contraction; exact optimum (3), with validated 17.32668% lower fraction at n=1.
- **Invertible phase-aware coordinate change alone tightens an optimal correlated ellipsoid:** false; the robust certificate is congruence-invariant. Sharper bounds on the transformed integral can still help substantially.
- **Correlated tail Schur test gives an actual sufficient sign certificate:** true, proved in (5)–(6). A conservative explicit finite rectangle is independently verified by the foundations lane.
- **These finite/coupled certificates propagate globally through every level:** unproved. No universal positive transfer or uniform high-height bound has been obtained.
