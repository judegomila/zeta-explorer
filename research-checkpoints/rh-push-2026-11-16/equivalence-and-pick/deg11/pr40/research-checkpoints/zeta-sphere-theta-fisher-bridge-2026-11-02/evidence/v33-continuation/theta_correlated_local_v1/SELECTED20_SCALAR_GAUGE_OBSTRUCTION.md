# Actual-theta obstruction to scalar coefficient gauges

Status: independent analytic and interval replay review PASS. This falsifies a natural restricted family of supporting planes, not the optimized dual.

## 1. The candidate payment mechanism

At the actual selected coefficient c=-A^-1b, write the full-theta local source and cross column as
f=d_loc+2c^T b_loc+c^T A_loc c,
z=b_loc+A_loc c.
The exact integral of z is zero. A tempting coefficient-only correction is v=theta c with theta>=0. The especially simple half-coefficient choice theta=1/2 removes the old quadratic local term:

f-c^T z=d_loc+c^T b_loc.                                  (1)

It retains the actual prefix inverse in c, and seems potentially useful because it involves only a linear local cross term. We test this candidate on an already available actual selected residual rather than extend a finite positivity ladder.

## 2. Certified actual residual and exact calculation

Reuse the independently reviewed SELECTED20_CANONICAL_OBSTRUCTION.md packet. The original complete theta is evaluated at u=14/25 and normalized shift a=0. The actual degree20 monic polynomial is selected using only the previously certified moments through index19. Both old parity blocks are independently checked positive. No degree20 target integral is read or assumed positive.

For numerical conditioning, the checker uses x=t^2/100 and the polynomial x^10+sum_(i<10)c_i x^i. Its local moment is g_j/100^j. This is a positive overall scaling of the actual physical monic residual, not a different polynomial selection. All inequalities below refer to this recorded scaling; signs are invariant.

The frozen original checker already encloses the complete local theta derivatives through order40 and all prefix-inverse uncertainty. In its rational congruence basis, write actual c=c_mid+P dy. Then (1) is evaluated linearly as

half=d_loc+c_mid^T b_loc+dy^T P^T b_loc.

The new owned replay obtains the directed bounds

f < -2697,
half < -419835,
c^T z=f-half >417138.                                     (2)

The last bound uses the full interval difference, without dropping shared-input uncertainty. Actual enclosures are approximately
f in (-2697.332632,-2697.175487),
half in (-419838.184381,-419835.430016),
c^Tz in (417138.097384,417141.008894).

The new checker verifies the SHA256 of its frozen owned dependency before running it. It performs no new moment quadrature and imports no acquired external code. The original full-orbit derivative tail, rational basis verification and endpoint inflation remain unchanged.

## 3. Entire scalar-gauge family fails

For every real theta>=0, equations (2) give exactly

f-2theta c^T z < -2697-834276 theta <0                     (3)

at this same actual theta point. In particular zero correction, half-coefficient correction and full-coefficient correction all fail. The result is stronger than evaluating a single arbitrary polynomial: c is the true inverse-selected residual and the old prefix remains positive.

Parity weighting does not alter this example because it belongs to the even ladder and g_0=1. Any additional positive coefficient normalization also preserves (3). Thus normalizing the dual cannot make this specific restricted gauge family feasible.

## 4. Positive-shift neighborhood and exact scope

The normalized old moment matrices and cross columns are analytic in a near zero, because sinhc(2au) has an even entire expansion and complete theta decay dominates every fixed derivative. Positive definiteness of the verified old blocks persists on some interval 0<=a<eta. The actual c(a), f(a,u_*) and c(a)^T z(a,u_*) are therefore continuous.

Since the two signs f<0 and c^Tz>0 in (2) are strict, some possibly smaller eta>0 preserves both signs. Accordingly every scalar gauge theta>=0 fails at u_*=14/25 throughout that small positive-shift interval as well. No explicit numerical eta is asserted. This conclusion uses only old-prefix continuity, not the unknown degree20 target sign.

The obstruction does NOT prove L<=0 or T<=0: a genuinely multidimensional optimized supporting vector may succeed, and a negative proportional coefficient theta is not covered. It does NOT prove a negative integrated target pivot. It rules out this concrete coefficient-only orthogonality-payment route, including any universal nonnegative choice of theta depending on degree or shift.

The still-missing step is an independently positive multidimensional weighted supporting-plane margin at fixed critical shift, or an actual feasible finite-atom witness showing that optimized margin fails. No such conclusion is supplied by (3).

Owned checker: check_selected20_scalar_gauge_obstruction.py.
Owned directed output: selected20_scalar_gauge_obstruction.json.
Frozen dependency: check_selected20_canonical_obstruction.py, SHA256 3afa31f2a6e79789c355f35f0b1e95da963353ebfdd0ca112888d1a47acb1936.
