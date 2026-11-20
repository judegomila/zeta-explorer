# A spatial-tail matrix criterion that propagates across all shifts

2026-11-02. Exact matrix lemma plus a finite-order theta application independently reviewed and replayed. This is not all-order closure.

## Matrix lemma

Let B(h) be a Hermitian matrix-valued integrable density on [0,∞), with superexponential decay, and define F(H)=∫_H∞B(h)dh. Suppose F(H)≽0 for every H≥0. For a≥0 set r_a(h)=sinh(2ah)/(2ah), using r_0=1 and the removable h=0 value. Then

J(a)=∫_0∞r_a(h)B(h)dh =F(0)+∫_0∞r_a′(H)F(H)dH ≽F(0).       (1)

Proof: on a finite interval integrate −r_a F′ by parts entrywise. The boundary term at0 is F(0), and r_a(R)F(R)→0 by superexponential decay. Derivatives and integrals converge absolutely, uniformly for a in any compact interval. The derivative r_a′≥0 follows directly from its positive even power series. Equation (1) preserves the full matrix order, not just scalar moments.

More strongly, for b≥a≥0,
J(b)−J(a)=∫_0∞(r_b′−r_a′)F(H)dH≽0,                       (2)
since every power-series coefficient of r_b−r_a is nonnegative. Thus this finite block is Loewner-monotone in normalized shift. Strict F(0)>0 supplies strict positivity for every finite a, even though no shift-independent pointwise positivity of B is assumed.

## Application to integrated odd H5

Let m_n(h)=(-1)^n ∂_v^(2n)[ψ(h−v)ψ(h+v)]_(v=0).
Use the odd3×3 matrix
B(h)=2h² [[m1,m2,m3],[m2,m3,m4],[m3,m4,m5]].
Its integral with weight r_a is exactly the sign-conjugated odd block of C_a/a. All entries and derivatives have the required superexponential decay by the full theta series.

The certificate in certify_tail_core.py bounds F(H) for every H∈[0,1/8], not just a grid. Its F(0) enclosure is taken from the first closed shift bin [0,1/24] in certificate.json; this legitimately contains the a=0 integral. Subdivide [0,1/8] into1024 exact dyadic cells. On each cell evaluate the full matrix density with complete theta-index tails. Accumulate interval rectangle integrals for whole preceding cells, and include [0,cellwidth] times the interval density for every possible partial cell. Therefore F(0) minus this accumulated core enclosure contains F(H) for every H in that cell. Interval LDL after fixed scaling diag(1,200,80000) checks the entire enclosure.

For H≥1/8, a separate certificate of pointwise oddH5 positivity for h≥1/8 implies F(H)≽0 by integration. Together these two covers establish the hypothesis for every H≥0. Both certificates and their independent checks have passed. Equations (1)–(2) prove the oddH5 block positive and normalized-shift-monotone for all a>0. Combine the separately established H4 even block to obtain full H5 positivity.

No claim is made that this tail criterion holds at every derivative order. It is a stronger sufficient property than positivity of only the full spatial integral and must be checked rather than assumed. Its concrete value here is to recover a finite-order all-shift theorem even after pointwise positivity has failed near the origin.
