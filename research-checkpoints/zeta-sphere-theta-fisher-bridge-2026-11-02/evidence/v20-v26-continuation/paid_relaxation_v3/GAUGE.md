# Paid orthogonality gauge: retain negative forcing credit on the same interval

Status: exact identities plus labelled floating diagnostics; degree5 certificate in progress separately. No all-degree sign theorem.

## 1. Exact free gauge, with its only hypothesis explicit
At fixed a,lambda let p be the monic degree-n Schur residual for the actual signed bridge, with positive old same-parity block. Set g=e^{au+lambda u²}psi. Strip the common unit complex phase from p(-iD)g and write F=Tg, K=T'g. For every old same-parity physical feature v_j, actual stationarity says integral_R u F v_j=0.
The signed Newman forcing density is J=u³F²+2u²FK. Thus for ANY finite real coefficients gamma_j(lambda),
 integral J = integral [J+uF sum gamma_j v_j].
No derivative of gamma enters: this is a pointwise-in-lambda zero-integral identity, not a change to the evolving function or its zeros. Taking the reflected positive part only AFTER adding this gauge gives the safe upper budget
 B_gamma=(pi/2) integral_0^infinity [J(h)+J(-h)+h F(h)q(h)-h F(-h)q(-h)]_+ dh.
It pays the same original interval via S0>=S_Lambda-2 integral_0^Lambda B_gamma dlambda. Neither the local forcing nor the opposite-parity block is presumed positive.

## 2. Degree-scalable commutator choice
A natural zero-integral polynomial is q_spectral=-c_n p'', since p'' lies in the old parity span. The relative Fourier phase turns this into physical q=+c_n T''g. Thus the gauged density factorizes as
 J_c=u F [u²F+2uK+c_n L], L=T''g.
At c_n=1 the bracket is exactly T(D)(u²g), by the commutator formula. Consequently this is the local Newman energy derivative with all lower-feature pieces retained.
The rational degree-adapted candidate c_n=(n+1)/(n-1), n>1, matches the scale seen in fitted leading gauge coefficients and has a simple analytic definition. Its zero-integral validity is exact for every n; its budget success is NOT proved uniformly.

## 3. Actual theta diagnostics on the SAME lambda interval[0,1]
Self-authored optimize_gauge.py and test_universal_gauge.py use a=.25,800 spatial GL nodes, ten theta orbits, |u|<=3, and floating integration. Fits use old-feature zero-integral densities, then interpolate coefficients piecewise linearly from lambda0,.5,1. These are not interval certificates.
For n=5,6,7,8,9 the original paired cost/terminal ratios are about1.1643,1.4137,1.6871,1.9922,2.1808.
The fitted gauges reduce them to about .48544,.55066,.60788,.70315,.76004.
The explicit q_spectral=-(n+1)/(n-1)p'' gauges give about .50652,.56062,.61941,.72527,.80674.
Thus the degree5 positive-part obstruction is not invariant under paid integration-by-parts/orthogonality representations. A finite rigorous degree5 test is being developed; these growing-degree numbers do not establish all-order control.

## 4. Genuine positive conditional-variance formulation
For h>0 define the positive paired measure density
 P(h)=h[F(h)²+F(-h)²].
Set m(h)=[J(h)+J(-h)]/P(h) and z_j(h)=h[F(h)v_j(h)-F(-h)v_j(-h)]/P(h), with zero on any null set where P=0. The numerator vanishes wherever both F values vanish; all required moments are finite for finite derivative degree.
Then integral P z_j=0 EXACTLY by Schur stationarity. Therefore subtracting a linear projection of m on z does not change the source mean integral Pm=D/(pi/2).
Let A=integral P zz^T, b=integral P zm. If A is invertible, the canonical gauge gamma=-A^{-1}b minimizes the positive source second moment and gives
 integral P(m+gamma^Tz)²=integral Pm²-b^TA^{-1}b.
Use the pseudoinverse if needed after restricting to the nonzero feature span. This is a positive physical-space Gram identity, not assumed Fourier or bridge positivity.
The gauge removes explained conditional variance before any Cauchy estimate; its residual variance still must be compared with the actual signed Schur reserve. Floating paired-L2 gauges give cost ratios about .65531,.63866,.65055,.77962,.84441 at n5..9, again on lambda0..1.

The outstanding theorem is a theta-specific, degree-uniform bound on the residual source after these exact free gauges. A small variance in an unrelated metric, or orbit Fisher decay alone, cannot replace that comparison.
