# Complete degree-seven regional signed payment

Independent analytic and4000-cell numerical replay PASS. This is an independent reproduction of an existing normalized finite rung, not a degree extension, an all-shift result or an all-order proof. Earlier `full_split_audit/actual_total_certificate.json` and the reviewed finite endpoint work in `fisher_bridge_v3/` already cover odd degrees through19. Those target certificates are not numerical inputs to this calculation.

Use exactly the two regions and positive old matrices established in REGIONAL_OLD_METRIC.md. The local odd block is still indefinite near0. The present calculation never inverts that local block. It computes only integrated regional old inverses and retains all target terms with their original signs.

## 1. Exact quantities and complete comparison

For each region i=C,T, compute the complete-theta moments M1_i,...,M7_i. Set
 A_i=[[M1,M2,M3],[M2,M3,M4],[M3,M4,M5]]_i,
 b_i=(M4,M5,M6)_i, c_i=M7_i,
 z_i=-A_i^-1b_i, s_i=c_i-b_i^T A_i^-1b_i.
The actual global coefficient vector is
 zbar=-(A_C+A_T)^-1(b_C+b_T).
The complete normalized remainder is
 S=s_C+s_T+V_C+V_T,
 V_i=(z_i-zbar)^T A_i(z_i-zbar)>=0.                 (1)
The variation is computed directly using the regional LDL factors, not by subtracting independently rounded S and s values. All unknown target moments are evaluated; no target pivot is an assumption or input.

The4000-cell run gives directed lower bounds:
 s_C>3,729,767,162,
 s_T>919,945,172,
 V_C>206,522,714,
 V_T>1,186,343,779,
 V_C+V_T>1,392,866,494,
 S>6,042,578,829.
All units are h/(4pi). The direct global-Schur evaluation, used as an additional consistency enclosure rather than a borrowed input, lies between6,072,812,186 and6,108,399,971. It overlaps the complete regional enclosure, whose upper endpoint is6,138,628,043.91796.

Negative feedback costs remain substantial and are not discarded:
- Central target mass is in (97,058,285,618,97,063,894,806); subtract an inverse-feedback cost in (93,299,945,653,93,334,127,643).
- Tail target mass is in (28,036,016,280,28,036,122,301); subtract a cost in (27,096,660,203,27,116,177,129).
These coarse cost bounds follow by interval subtraction of the displayed target-mass and regional-s ranges; the actual solve retains their correlation through interval LDL arithmetic.

Both regional target remainders happen to be positive for this split. Therefore this result does not demonstrate a negative target-region remainder being paid by the between-region term. What it does demonstrate is a valid regional computation despite the known negative *pointwise old* metric in the central region, and a quantitatively positive additional correction.

## 2. Midpoint rule with complete second-derivative error

The owned `check_degree7_regional_payment.py` uses192-bit Arb and4000 cells covering[0,2], with a split at1/2 on a cell boundary. It evaluates the midpoint source density and adds width^3 sup|density''|/24 on each cell. Full evenness supplies the factor2.

Let ell_j=ell^(j)(u)/j! and introduce the auxiliary shift variable r. Define
 Q0(r)=2 sum_(even j>=2)ell_j r^j,
 Q1(r)=2 sum_(even j>=2)(j+1)ell_(j+1)r^j,
 Q2(r)=2 sum_(even j>=2)(j+1)(j+2)ell_(j+2)r^j,
 E(r)=exp Q0(r).
Through j=7,
 gj=(-1)^j(2j)!4^-j [r^(2j)]E,
 gj'=same coefficient of E Q1,
 gj''=same coefficient of E(Q2+Q1²).
The missing constant terms in Q1,Q2 are intentional: the generating expression is normalized by psi(u)².

For w=2u²psi², with l=ell' and k=ell'',
 w'=(4u+4u²l)psi²,
 w''=(4+16ul+4u²(k+2l²))psi².
Therefore (w gj)''=w''gj+2w'gj'+w gj''. The implementation includes the otherwise irrelevant linear u/2 term in ell when forming l. This second-derivative formula uses complete log derivatives through16 and retains all signed terms.

## 3. All-orbit error through derivative sixteen

Continue the proven ratio method psi=f1(1+r), z=pi exp2u, r=sum_(n>=2)A_n exp(-(n²-1)z). On z>=pi,
 (1/2)(1-3/(2pi))^-17<2^19,
 |D^j A_n|<=2^20 n4 2^j j!, j<=16.
Combining this with the exponential Stirling/Leibniz bound gives
 |D^j r_n|<=C n36 z16 exp(-(n²-1)z),
 C=2^21*16!*4^16.
The ratio for n>=9 is <=(10/9)^36 exp(-19pi)<1/2. Thus the omitted complete-theta derivative tail is
              2C*9^36*z16 exp(-80z).               (2)
This is added to every derivative0..16 before forming log(1+r); no fixed-orbit high-jet limit is assumed.

## 4. Entire spatial tails

At z>=100, (1/2)(1-3/200)^-17<1 improves the A_n constant to2. The full ratio derivatives through16 obey
 epsilon(z)=8*16!*4^16*2^36*z16 exp(-3z)<1e-10.
The implementation also explicitly checks16!epsilon(1+epsilon)^15<1, rather than relying on the weaker small-epsilon statement alone. Hence logarithmic correction derivatives are below1. As before,
 |ell^(j)|<2^(j+2)j!z, j<=16,
 |gj|<=(2j)!(9z)^j, j<=7.
For each omitted full-line moment beyond|u|=2,
 error_j<=(256/sqrt(pi))(2j)!9^j Z^(9/2+j)exp(-2Z),
 Z=pi exp4.
All tail errors are included symmetrically. The largest, forM7, is below3.089e-104.

## 5. Actual inverse and numerical interpretation

Each regional solve uses its three actual positive LDL pivots. Forward elimination of b and division by those pivots computes the feedback cost; backward substitution computes z_i. The same procedure on summed moments computes zbar. For A=L diag(d)L^T, the correction is evaluated as sum d_j[(L^T(z_i-zbar))_j]^2, retaining the correct noncommuting matrix metric.

This independently verifies the normalized degree-seven regional payment. It does not extend the existing finite degree range, establish nonzero-shift bounds, or prove that a similar positive regional old partition exists uniformly as degree grows. No next-higher pivot is inferred.
