# Four-node clusters with explicit collision-stable global coupling

2 November 2026. Finite local occupancy extension; not unrestricted positivity or RH. This builds on the newly audited H3 theorem, but obtains the necessary quantitative eigenvalue margin from complete moment enclosures rather than from determinant positivity alone.

## Theorem

For 0≤a≤1/2 let K_a=C_a/a, continuously extended at a=0. Take any finite or countable collection of clusters, each containing at most four nodes in [x_j−1/2000,x_j+1/2000]. Distinct centers have separation at least 3.

Within each cluster use factorial-scaled Newton channels

    alpha_r r! [u_0,...,u_r], alpha=(1,1/10,1/100,1/1000), r=0,...,J−1.

Let B be the complete K_a Gram and D its exact within-cluster block diagonal. Then

    D > (13/5000)I,
    ||D^(−1/2)(B−D)D^(−1/2)|| < 1/10^7,
    B >= (1−10^(−7))D > (2599/10^6)I.

All coordinate Schur complements in this normalized basis exceed 2599/10^6 times identity. The result includes arbitrary internal collisions and Hermite derivative-channel limits, without inverse minimum-gap constants. Original point-evaluation matrices inherit positivity by congruence for distinct nodes and semidefiniteness at repeated evaluations.

## 1. Quantitative four-channel confluent margin

The earlier full-tail interval certificate provides

    K0>.0314,
    1.477<−K2<1.536,
    205<K4<214.382.

New complete-tail interval integration, uniform 0≤a≤.5, gives

    −49461.741419152489 < K6 < −47029.632147241367.

Thus −K6>47029. The scaled confluent matrix splits into two real symmetric 2×2 blocks. The even block is the prior H2 even block and exceeds.0095I. The odd block has diagonal lower bounds.01477,.047029 and off-diagonal absolute upper bound.0214382.

Subtracting .004I leaves positive diagonals, with exact determinant lower bound

    (.01477−.004)(.047029−.004)−.0214382²
      =95647769/25000000000000 >0.

Therefore the complete four-channel confluent matrix H>.004I. This establishes a concrete eigenvalue margin using upper as well as lower moments. The all-a H3 theorem by itself is not substituted for such a quantitative bound.

## 2. Interval construction and complete tails

The independently authored certify_four_channels.py uses the previously audited campaign theta interval routine, not downloaded research code. Its K6 enclosure uses adaptive Simpson intervals on h∈[0,4], with the exact fourth-h-derivative enclosure of the integrand and remainder d^5 sup|F''''|/2880. The theta routine constructs derivatives through 10 by the exact rational polynomial recurrence. The bridge weight is written

    w_a(h)=2h²∫_0^1 cosh(2ahs)ds,

and the same uniform derivative bounds from confluent_v4/CLUSTER_CERTIFICATE.md Section7 are used. The accumulated error target is .01, not an assumed convergence rate. Positive upper-sum intervals over 2048 cells of width 1/512 then enclose simultaneously all |v|≤.001:

    |K4(v)| <308.053128 <310,
    |K6(v)| <100324.722835 <101000,
    |K8(v)| <61972109.258597 <62000000.

These are interval enclosures of complete integrands, not sampling. The n>10 theta tail for derivatives≤10 is bounded by10^(−80)e^(u/2−r)(1+r)^12, r=πe^(2u). The h≥4 tail is bounded by10^100 exp(60h−5e^(2h)), whose integral is below 10^(−2500). The run includes the larger allowance 10^(−2400) and 10^(−30) serialization slack. Full-theta parity is retained across zero. Precision is 50 digits with 60-digit auxiliary endpoints. Numeric data, accepted Simpson leaf count and runtime are in four_channel_bounds.json.

## 3. Transfer to genuine four-node clusters

Let delta=.001. Evenness and the preceding bounds imply |K2(v)|<1.537. In factorial-scaled Newton coordinates, Hermite–Genocchi's formula expresses each Gram entry as an average of alpha_r alpha_s(−1)^s K^(r+s)(u), |u|≤delta. Taylor bounds yield the following entrywise perturbation from H:

    [[.0000007685, .0001537, .00000155, .00031],
     [.0001537, .00000155, .00031, .00000505],
     [.00000155, .00031, .00000505, .00101],
     [.00031, .00000505, .00101, .000031]].

The maximum row sum is.00135605. Hence

    D_j >(.004−.00135605)I=.00264395I >(13/5000)I.

The simplex integral representation remains valid at arbitrary collisions. No ill-conditioned subtraction of close evaluation values is used.

## 4. Global derivative envelope through order six

The elementary proof in cluster_extension_v1/TRIPLE_CLUSTER_THEOREM.md extends without alteration through derivative6. For

    p0(r)=2r²−3r,
    p_(j+1)=(1/2−2r)p_j+2r p_j',

it bounds e^(5u²)|psi^(j)(u)| by4Σ_k |[r^k]p_j|3^(k+1)(k+1)!. At orders5 and6 these exact constants are

    632934282501/4,
    78974750026413/8,

and all constants through6 are below 10^13. Therefore

    |psi^(j)(u)|<10^13 e^(−5u²), j≤6.

The bridge-weight integral I=2∫h²cosh(h)e^(−10h²)dh<.1 then gives

    |K_a^(r)(v)| ≤2^r10^26 I e^(−10v²)
                <10^27 e^(−10v²), r≤6.

This is an absolute envelope with no spectral-sign assumption.

## 5. Inter-cluster and infinite-dimensional bounds

Between centers distance d, each transformed entry averages a derivative of order at most6 over arguments of absolute value at least d−.001. Each cross block has size at most4×4, so its norm is bounded by 4×10^27 exp(−10(d−.001)²).

The nth center to either side is at least 3n away, and10(3n−.001)²≥10(2.999n)²>87n². Since e³>20 and n²≥3n−2,

    ||B−D|| < epsilon=8×10^27 q/(1−q³), q=20^(−29).

Exact arithmetic verifies epsilon/(13/5000)<10^(−7), and13/5000−epsilon>2599/10^6.

The exact diagonal blocks are uniformly bounded above by 4×10^27 and below 13/5000. The symmetric block row/column sums are summable. Hence D and B−D extend from finitely supported vectors to bounded operators on the Hilbert direct sum of cluster channel spaces, and D is boundedly invertible. Whitening proves the relative bound. Completion of the square proves the coordinate Schur lower bound. Uniform simplex limits and the same summable cross-block estimate cover countably many confluent clusters; operator-norm convergence of arbitrary coordinatewise node limits is not assumed.

## Scope and next obstruction

This adds the third-derivative channel and genuinely increases local occupancy from 3 to 4, while preserving unbounded total cardinality. It sacrifices some cluster width and center spacing relative to the wider triple theorem: occupancy 4 uses diameter .001 / spacing 3; occupancy 3 permits diameter .005 / spacing 2.5. Neither dominates the other. No claim covers arbitrary occupancy or unrestricted node geometry. The next occupancy step requires quantitative H4 control and derivatives through 10, not just another separation estimate.
