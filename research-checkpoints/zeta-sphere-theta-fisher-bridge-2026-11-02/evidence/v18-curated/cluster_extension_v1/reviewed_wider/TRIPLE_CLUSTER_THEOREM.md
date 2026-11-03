# Uniform positivity for arbitrarily many collision-stable triple clusters

2 November 2026. New restricted-class extension, not unrestricted positive definiteness or RH.

## Statement

Let K_a=C_a/a with its continuous a=0 limit, for 0≤a≤1/2. Partition a real test configuration into finite or countably many clusters, each having at most three nodes. Each cluster is contained in [x_j−1/2000,x_j+1/2000], and distinct centers satisfy |x_j−x_l|≥5/2.

Within each cluster use factorial-scaled Newton channels

    T_(j,r) f = alpha_r r! [u_(j,0),...,u_(j,r)] f,
    alpha=(1,1/10,1/100), r=0,...,J_j−1.

Let B be the complete K_a Gram in these channels and D its exact block diagonal, retaining all within-cluster interactions. Then

    D >= (9/2000) I,
    ||D^(−1/2)(B−D)D^(−1/2)|| < 1/3000,
    B >= (2999/3000)D > (449/100000)I.

The bounds are independent of cluster count and minimum within-cluster separation. They hold for arbitrary complex coefficients, and for Hermite/confluent limits. Original evaluation Grams are positive by congruence for distinct nodes and semidefinite under repeated evaluation limits. A fixed coercivity constant is asserted in the normalized channel basis, not the ill-conditioned point basis.

Every coordinate Schur complement in the normalized basis is at least (449/100000)I. Finite node configurations may occupy arbitrarily large domains; their local cluster occupancy is restricted.

## Input already certified in this campaign

The full-kernel certificate in ../confluent_v4/CLUSTER_CERTIFICATE.md, Sections1–3, gives D_j>(9/2000)I for any at-most-three-node cluster of diameter ≤1/1000, uniformly 0≤a≤1/2. It uses certified full theta/spatial tails, not sampled values or global-PD assumptions. Its exact widened jet bounds are K(0)>.0314, −1.536<K''(0)<−1.477, K^(4)(0)>205; local derivative bounds are |K^(4)|<310 and |K^(6)|<101000. The statement at a=0 follows from the same weight enclosure used in that certificate.

The newer source's analytic H2 reserve is independently audited, but it is NOT needed as an unproved substitute for this input. The present extension adds explicit control between infinitely many such blocks.

## New global derivatives through order four

Write r_n=πn²e^(2u) for u≥0. Exact differentiation gives

    psi^(j)(u)=4e^(u/2) sum_(n≥1) p_j(r_n)e^(−r_n),
    p_0(r)=2r²−3r,
    p_(j+1)=(1/2−2r)p_j+2r p_j'.

For u≥0, 5u²≤e^(2u)≤r_n/3 (since π>3). Also e^(u/2)=(r_n/(πn²))^(1/4)≤n^(−1/2)r_n since r_n>1. Thus, writing p_j=Σ c_(j,k)r^k,

    e^(5u²)|psi^(j)(u)|
      ≤4 sum_(n,k) |c_(j,k)| n^(−1/2) r_n^(k+1)e^(−2r_n/3)
      ≤4 sum_k |c_(j,k)|3^(k+1)(k+1)!
          sum_n n^(−1/2)e^(−n²).

Here x^m e^(−x/3)≤3^m m! follows directly from the positive exponential series, and r_n/3≥n². The final index sum is less than Σe^(−n)=1/(e−1)<1. The five resulting exact constants for j=0,...,4 are

    1512, 41364, 1423386, 58969269, 5711288157/2.

Each is below 3×10^9. Full theta evenness gives the same bound for negative u, including odd derivative signs in absolute value. Consequently

    |psi^(j)(u)| < 3×10^9 e^(−5u²), j≤4, all real u.

For the continuous normalized bridge weight,

    h sinh(2ah)/a ≤ 2h² cosh h.

The Leibniz rule now gives, for r≤4,

    |K_a^(r)(v)| ≤ 2^r (3×10^9)² I e^(−10v²),
    I=2∫_0^∞ h² cosh(h)e^(−10h²)dh < 1/10.

For example cosh h≤exp(h)≤exp(h²+1/4) gives I≤exp(1/4)√π/54<1/10. Thus the deliberately rounded common bound is

    |K_a^(r)(v)| < M exp(−10v²), M=2×10^19, r=0,...,4. (1)

All differentiations and limits are dominated by these integrable estimates; no positive spectral density is presumed.

## Cross-block estimate without inverse node gaps

Hermite–Genocchi's simplex formula expresses an (r,s) cross-block entry as

    alpha_r alpha_s E[(-1)^s K_a^(r+s)(X_r−Y_s)],

where X_r and Y_s are convex combinations of the respective prefix nodes. If center separation is d, then |X_r−Y_s|≥d−1/1000. Since r+s≤4 and alpha≤1, (1) bounds every entry by M exp(−10(d−1/1000)²). A block has at most3 rows/columns, so its operator norm is at most three times that bound.

For a fixed center, the nth center to either side is at least5n/2 away. Therefore

    ||B−D|| ≤ 6M sum_(n≥1) exp(−10(5n/2−1/1000)²)
            < 6M sum_(n≥1) exp(−60n²).

Indeed 5n/2−1/1000≥(2499/1000)n and 10(2499/1000)²>60. Set q=20^(−20). Since e³>20, exp(−60)<q. Using n²≥3n−2,

    ||B−D|| < epsilon := 6M q/(1−q³)
                         < 12/10^7.

The exact rational check gives

    epsilon/(9/2000) < 1/3000,
    9/2000−epsilon > 449/100000.

Conjugation by D^(−1/2) establishes the claimed relative bound. The equivalent Loewner lower bound follows since −qD≤B−D≤qD.

## Countably infinite configurations and Schur complements

Start on finitely supported vectors in the Hilbert direct sum of cluster channel spaces (each dimension ≤3). The diagonal blocks are uniformly bounded above: the same simplex derivative formula and (1) give each entry at most M, hence ||D_j||≤3M. They are uniformly bounded below by9/2000. Thus D is a bounded positive invertible operator.

The symmetric block row/column sums above are uniform and summable. The block Schur test extends the off-diagonal matrix uniquely to a bounded self-adjoint operator of norm at most epsilon. Therefore B is bounded, self-adjoint and bounded below by449/100000. No unbounded inverse is introduced.

For any coordinate split B=[[A,F],[F*,E]], A remains boundedly invertible. Completion of the square gives

    <(E−F*A^(−1)F)y,y> = inf_x <B(x,y),(x,y)>
                       ≥(449/100000)||y||².

At collisions, Newton channels converge to Hermite channels by the simplex formula. The diagonal lower bounds and summable cross-block bounds survive. This does not require operator-norm convergence of arbitrary coordinatewise collision sequences. Repeated plain evaluation nodes may give null directions before normalization, as expected.

## Meaning and limitations

This theorem permits an unbounded total number of tests and arbitrary internal collisions in each triple, improving the previous at-most-three-total-tests result and the newer close-pair theorem in cluster occupancy. It does not permit an unbounded number of nodes in a single cluster or remove the center-separation condition. Thus it does not imply global kernel positivity or RH. The constants are conservative, not optimized.

The script check_constants.py is a newly written independent exact-rational verification of the polynomial derivative bounds and final comparisons. It does not execute the acquired source checker and does not by itself verify the preceding analytic argument or prior interval certificate.
