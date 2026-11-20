Proof obligations discharged by the run, per square: (a) every vertex enclosure and every segment enclosure excludes
0 (so F is not identically zero on the contour and has no zero on it); (b) the ball for the winding number contains
exactly one integer; (c) eps_trap + eps_tail is evaluated in balls and added to every enclosure as a box.

## 4. Items B and C: SG and NR-q

Definitions as in `push/c15-control-with-zeta-fe-classes-u1-u2/RESULT.md` (section on companions):

    SG_b(s)  = zeta(s) ((s - 1/2)^2 - b^2) / ((s - 1/2)^2 + g1^2)      (m = (t^2 + b^2)/(t^2 - g1^2), s = 1/2 + it),
    NRq_c(s) = zeta(s) (q^(s-1/2) + c + q^(1/2-s)),   q = 1 + sqrt 2.

g1 is the first zeta ordinate; it enters as the ball returned by Arb's `acb.zeta_zero(1)`
(14.13472514173469379045725198356247027078 +- 4.3e-39), so every enclosure holds for the true g1. The zeros are
known in closed form: s = 1/2 + b for SG (zeta(1/2 + b) is finite and non-zero for 0 < b < 1/2), and
s = 1/2 + (log w + i pi)/log q, w = (c + sqrt(c^2 - 4))/2, for NR-q. The certificate adds: exactly one zero, simple,
in each square, by direct ball evaluation on 64 segments (Lemma W; no quadrature).

