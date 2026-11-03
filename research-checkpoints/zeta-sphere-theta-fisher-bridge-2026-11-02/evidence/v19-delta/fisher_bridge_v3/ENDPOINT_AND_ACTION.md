# Original-theta finite-rung regression action: endpoint tightness and numerical probes

2026-11-02. v18 files untouched. Analytic statements below exact; numerical component/action probes exploratory until independent interval certification.

## 1. The action bound is tight at the normalized endpoint

Use the audited v2 quantities, and set v(t)=α'(t), vbar=(2a)^-1∫_(−a)^a v(t)dt. The constant-endpoint-metric action bound has the exact nonnegative excess

E_action−E_exact
=2a∫_(−a)^a [v(t)−vbar]^T K(a)[v(t)−vbar]dt.             (1)

Here E_exact=Δ^TKΔ, E_action=2a∫v^TKv. This is elementary variance decomposition, not a new positivity assumption.

At an already-certified finite normalized rung let G0 be the positive parent old Gram, G1=G'(0)>0 the normalized target old block. Then

K(a)=(1/(2a))K0+O(a),    K0=G0 G1^-1G0,
v(t)=α'(0)+tα''(0)+O(t²).

The absence of a constant term in K follows from K(−a)=−K(a): the symmetric identity A_-A^-1A_+=A_+A^-1A_- proves this directly. Consequently

E_action−E_exact=(2a³/3)α''(0)^TK0α''(0)+O(a^5).          (2)

The exact difference Schur surplus is 2a S0+O(a³), where S0>0 is the existing normalized endpoint Schur residual. Thus

innovation_gain−E_action=2a S0+O(a³)>0

for all sufficiently small positive a, separately at each fixed certified rung. Since there are finitely many rungs through odd19, a common positive interval exists for those rungs. This is an analytical existence result, not an explicit numerical interval width and not uniform in ladder degree.

In particular, the action sufficient condition cannot be intrinsically too wasteful at the normalized a=0 test: it has exactly the same leading cost as the true mismatch. Failure, if any, occurs at nonzero shift or in a nonuniform degree limit.

## 2. Data and numerical method

`probe.py` is newly authored local numerical code, not acquired code. It evaluates the complete theta derivative recurrence P_(j+1)=2zP_j'+(1/2−2z)P_j through j=19, using 12 explicit orbits and high-precision tanh-sinh quadrature on 0<=h<=3. No rigorous tail/quadrature error bound is claimed for these exploratory component values. Mesh refinement checks numerical stability but is not interval certification.

The normalized target matrix reuses the midpoint of the existing certified moment intervals in `full_split_audit/actual_total_certificate.json`. For odd derivative indices i,j and k=(i+j)/2, its q(D)=D^j coordinates are (-1)^(1+k) μ_k/4^k. A fixed positive diagonal rescaling normalizes each target diagonal to one.

The parent G0_ij=∫h ψ^(i)ψ^(j) is separately quadrature-evaluated at the same existing degree, not a higher-degree extension. Its positive-parent regression gives the innovation derivative and coefficient-motion cost; their difference algebraically equals the pre-existing target Schur residual. Consequently agreement of this difference with that residual is not independent validation of the parent quadrature.

`action_probe.py` compares actual mismatch and the constant-metric action upper bound at a=1/64,1/8,1/4,0.49 using Gauss–Legendre quadrature of the regression-speed integral. These finite-shift results are numerical until independent error enclosure.

## 3. Endpoint result (mesh refinement pending)

At mesh1/64 and 70 decimal arithmetic precision, odd19 in target-unit-diagonal coordinates gives approximately

innovation derivative: 0.000252203721524327
coefficient-motion cost: 0.0000918765622810192
surplus: 0.000160327159243308
cost/gain: 0.364295029929433.

The finer mesh1/128 result and finite-shift values are in the JSON/log outputs as they complete. The useful conclusion at this stage is the exact endpoint-tightness theorem in Section1; component decimal values are exploratory evidence only.

## 4. Executed rigorous endpoint certificate

The interval method in INTERVAL_METHOD.md now completed with1000cells, midpoint Taylor19 and derivative20 remainder. Maximum scaled quadrature remainder is below3.446e−24. `certify_endpoint.py` then asserted strictly positive interval pivots/gains/costs/surpluses for every existing odd rung3..19. This is an executed interval certificate; independent review is requested.

For odd19, outward-rounded readable bounds are:

- innovation derivative: [0.0002522032922, 0.0002522041508];
- coefficient-motion cost: [0.0000918526128, 0.0000919005118];
- surplus: [0.0001603027805, 0.0001603515380];
- cost/gain: [0.3641994493, 0.3643906109].

Thus the endpoint action leaves more than63.56% of the innovation gain after paying its coefficient-motion cost. These are finite-rung quantities in the stated scaled basis, not probabilities, all-order constants, or a claim of nonzero-shift interval certification.

## 5. Finite-shift numerical action comparison

The doubled spatial mesh1/128 and12-point action quadrature reproduce the following exploratory results (old/full target LDL numerical checks positive at all four shifts):

| a | Innovation gain | Exact mismatch cost | Action upper-bound estimate | Action/gain |
|---|---:|---:|---:|---:|
|1/64|7.88197723305e−6|2.87128314648e−6|2.87149722629e−6|0.364311789|
|1/8|6.33642251251e−5|2.30412195773e−5|2.31510174509e−5|0.365364169|
|1/4|1.28620346599e−4|4.65174654618e−5|4.74004825487e−5|0.368530204|
|0.49|2.66472752574e−4|9.44732951267e−5|1.01256844873e−4|0.379989488|

The action's excess over the exact mismatch is tiny near zero and about7.18% of that mismatch at0.49. No metric adaptation is needed to make these numerical finite tests pass. This does not establish the sufficient action inequality over the entire interval, at larger degree, or as a certified inequality at these nonzero shifts: enclosing the regression-speed quadrature and its inverse metrics remains required for that stronger claim.
