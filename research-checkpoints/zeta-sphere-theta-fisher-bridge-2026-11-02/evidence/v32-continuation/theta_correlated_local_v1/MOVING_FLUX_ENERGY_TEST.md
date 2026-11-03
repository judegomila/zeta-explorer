# Actual moving-flux energy: failed unit compensation and a limited damped candidate

Let S(H) be the actual optimized core Schur remainder, z(H) its optimizer, and Phi(H,z) the reviewed full-line boundary flux. Write beta for the signed diagonal-derivative bulk density and r=Lz+l. On any interval where the actual old core matrix A is positive,
 (S-Phi)'=beta+g^T A^-1r, g=gradient_z Phi.              (1)
This is the reviewed chain rule, with the actual inverse retained. Define Er=r^TA^-1r and Eg=g^TA^-1g. Then the usual energy estimate is
 beta+g^TA^-1r>=beta-sqrt(Er Eg),                       (2)
and exactly
 g^TA^-1r=(||g+r||_(A^-1)^2-Eg-Er)/2.
Neither establishes a sign without a correlated theta-specific comparison. The following are actual theta tests, not generic surrogate profiles.

## 1. Rigorous input and interval procedure

`check_core_transport_moments.py` integrates only M0 through M6 on[0,1/8], with the full-line factor2, at192bits and1000 midpoint cells. Its width is1/(8N); the verified full-theta second-derivative enclosure supplies width^3 sup|density''|/24 per cell. The previously reviewed derivative16/orbit-tail implementation is reused unchanged. No odd7 target moment M7 is integrated. Even6 reads only M0 through M5; M6 is not used in its inverse calculation.

At1/2 the existing independently certified core old/cross moments are reused. For each of the intervals I0=[1/8,1/8+1e-8], I1=[1/2,1/2+1e-8], the same symmetric integrated-density enclosure as the reviewed nearby-flow test encloses all actual core moments. Interval LDL verifies A>0, and obtains z(H). Full-theta jets give beta and g directly from the exact flux polynomial.

If the lower triangular factor of A is L_D and y_r=L_D^-1r,y_g=L_D^-1g, the mixed quantity is evaluated as sum_j y_r,j y_g,j/d_j, retaining its sign. Positive energies are evaluated as the corresponding sums of squares. No target integral or target-pivot normalization is used. The checker also verifies the local old matrix for its stable evaluation of S'; this is a verified finite-interval fact, not a general premise.

## 2. Actual sign results in both parities

All numerical derivatives are in h/(4pi) per unit H, on the entire stated intervals.

Odd7 on I0:
- beta>92,738,555,715;
- mixed term>15,418,232,214,304;
- (S-Phi)'>15,510,970,767,579.

Even6 on I0:
- beta<-1,435,764,539;
- mixed term>1,880,636,213;
- (S-Phi)'>444,530,661, although S'<-1,401,604.
Here the correlated mixed term genuinely pays a negative bulk density.

Odd7 on I1:
- beta>4,024,019,834,882;
- mixed term<-239,459,867,518;
- (S-Phi)'>3,770,853,351,660.
Thus the actual mixed inverse term is NOT universally nonnegative, even in these small known degrees.

Even6 on I1:
- beta<-13,263,474,261;
- mixed term<888,416,675;
- (S-Phi)'<-12,375,057,587, although S'>174,964,721.
Thus the unit-flux compensated quantity is NOT universally increasing on actual theta positive-old regions. It reverses sign between these two windows. This excludes the simple unit-weight Lyapunov proposal, not an integrated compensation theorem.

The Cauchy lower estimate(2) cannot establish nonnegativity in the even cases, since beta is already negative. The first even case shows why replacing the actual mixed term by its worst-case absolute debit loses a real finite payment.

## 3. A damped candidate survives these tests only

For U_c=S-c Phi,
 U_c'=(1-c)S'+c(S-Phi)'.                               (3)
Taking c=1/100, the same rigorous interval data prove U_c'>0 in ALL FOUR tested windows. In particular the even6 lower bounds exceed2,987,000 on I0 and49,359,000 on I1. This retains both actual terms and does not assume their individual signs.

This is a limited constructive candidate, not a theorem across the whole recovery interval: the interiors between I0 and I1 have not been checked, other degrees have not been checked, and no degree-dependent choice of c or global derivative bound has been proved. The unit-weight counterexample does not disprove such a damped approach. A successful global argument would still need the actual mixed inverse term, bulk, endpoint terms, and any negative regions controlled together; checking selected windows does not suffice.

## 4. Scope

These are new local mechanism tests at existing finite rungs, not extensions of the verified ladder. A coarse exploratory calculation with the earlier wider eighth-core input intervals left the odd7 mixed quantity unresolved; it was not a negative counterexample. The finer old/cross integration resolves that uncertainty without introducing a target-norm input. All claims above are independently replayable from owned scripts and explicit full-theta bounds.
