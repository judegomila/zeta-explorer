# Subdivision can make adaptation cheap without paying a signed loss

This is an actual-theta obstruction to using finer telescoping alone as a payment mechanism. It retains the actual inverse and both parity examples; it does not refute successful larger finite-width recovery.

## 1. A quantitative endpoint action bound

On an interval I=[a,b], suppose the actual old matrices A(H) admit one verified positive lower matrix P<=A(H). No positivity of local target densities or of signed shell target forms is assumed. Let L(u),l(u) denote old and cross boundary densities. If
 C>=sup_{H,u in I} (L(u)z(H)+l(u))^T P^-1(L(u)z(H)+l(u)),  (1)
then the exact reoptimization cost for any substep H to H+delta satisfies
 0<=K<=C delta^2.                                        (2)
Indeed r=integral_H^(H+delta)(L(u)z(H)+l(u))du, A(H+delta)^-1<=P^-1, and quadratic Jensen gives(2). Notice that the initial optimizer stays fixed inside this substep integral; it is not incorrectly replaced by z(u).

For any partition of I with mesh eta, the exact finite-width identities give
 sum K_i <= C eta(b-a),
 sum J_i = S(b)-S(a)+sum K_i.                            (3)
Thus making mesh small can make adaptation cost tend to zero, but changes the accumulated sources at the same time. Their limiting sum is the original signed gain. This fact alone cannot establish a positive gain.

## 2. Certified actual metrics, not a parent substitute

The owned `check_subdivision_action.py` uses I=[1/8,1/8+10^-8] and the same full-theta interval implementation and old/cross moment inputs as the reviewed nearby-flow certificate. Both local old matrices L(u) were proved positive throughout I. Therefore A(H)>=A(1/8) for this particular interval, and P is chosen to be the actual initial core old matrix. This local-old positivity is verified, not generalized to other degrees or intervals.

The interval enclosure for z(H) covers every H in I. Evaluate the three-vector R=L(u)z(H)+l(u) with independent intervals for u,H; then apply the actual P inverse using its LDL factors. If P=L_D diag(d1,d2,d3)L_D^T, the forward coordinates are y1=R1,y2=R2-l21*y1,y3=R3-l31*y1-l32*y2, and R^TP^-1R=sum yj^2/dj. No target integral is read. The resulting uniform action bounds are
 C_odd7<4,948,000,000,000,
 C_even6<75,443,742.                                    (4)
This proves(1) for all pairs(H,u), not merely along the diagonal.

## 3. Actual signed consequence for every subdivision

For odd7, the previously reviewed derivative bound gives
 S(b)-S(a)>95.84501356,
 while sum K_i<0.0004948 for every subdivision (eta<=b-a).

For even6, the reviewed derivative bound gives
 S(b)-S(a)<-0.0137396,
 while sum K_i<0.0000000075443742 for every subdivision.
Consequently, for every subdivision of this actual even6 interval,
                    sum J_i<-0.01373959.                (5)
There is no assumption about the signs of individual J_i in deriving this conclusion. The entire summed source remains negative even when the cost is tiny; refining cannot change the negative total gain. All values are in h/(4pi) units.

The much wider1/8-to1/2 interval has certified positive recovery in both parities. Hence (5) is not a no-go for nonmonotone integrated recovery. It specifically rules out the shortcut that many intermediate endpoints, by reducing the reoptimization debit, must turn an adverse interval into a positive payment. The degree-dependent theta-specific estimate must control the signed sources themselves across the entire recovery interval, retaining negative segments.

No new rung, global action bound, uniform-in-degree constant, or worst-loss bound over the larger interval is claimed.
