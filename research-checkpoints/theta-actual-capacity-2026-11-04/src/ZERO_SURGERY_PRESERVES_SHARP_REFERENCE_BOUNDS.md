# Sparse zero surgery preserves the sharp reference bounds

2026-11-04. A targeted structural countermodel, not a change to the actual theta problem. No RH assumption, target positivity, or selected localization is used. Existing frozen files and live 4CT are unchanged.

## 1. What this construction establishes

Starting from the actual theta transform F_0, construct an even real entire F_hat by replacing one copy of each of four real zeros ±a_j,±b_j by the near-real quartet ±c_j±iε_j, for a very sparse sequence of nearby real-zero pairs. The resulting model retains:

- order one, real symmetry, exponentially decaying fixed derivatives, infinitely many simple real zeros, and bounded real-zero cells;
- every baseline zero except the explicitly moved sparse copies;
- the critical-strip bound |Im z|<1/2 for every zero, and the coarse Riemann–von Mangoldt counting asymptotic (the count changes by at most O(log log T));
- the sharp pointwise majorant F_hat²+F_hat'²≤C W, W(t)=|Gamma(4+it/2)|²;
- the original all-degree inequalities

      exp[−C log²(n+2)] ||p||_W²
          ≤ X_hat[p] ≤ C(n+1)||p||_W²,                 (1)

  where T_hat p=F_hat p'+2F_hat' p and X_hat=||T_hat p||²;
- the uniform monic Pollaczek competitor estimate X_hat[M_n]≤C b_n, hence all exponential-scale monic asymptotics and quasi-polynomial Gram conditioning derived from those bounds;
- the generic source closure, exact selected cell Green kernel, and finite local positive traces.

Nevertheless the parameters ε_j can be chosen so that its escaping positive capacity constants B_(I_j)→∞. Thus even this stronger combination of inputs does not imply a bounded escaping positive operator.

The construction does NOT preserve the exact theta series/arithmetic or assert positivity of the inverse Fourier kernel. It also does not prove failure of positive diagonal decay or H/X→0 for the model's selected polynomials. It falsifies the stated operator-tail implication, not selected coherence or RH.

## 2. Choosing and moving sparse real-zero pairs

The supplied unconditional positive-proportion critical-line result gives arbitrarily many real zeros in large ranges, with total count bounded below by a positive multiple of T log T. Consequently there are infinitely many consecutive distinct real-zero pairs with gap at most 1/2. Otherwise the distinct real-zero count would be O(T), contradicting the supplied positive-proportion simple-zero count. Select such pairs at arbitrarily large heights, so that

    a_j<b_j,  b_j−a_j≤1/2,
    c_j=(a_j+b_j)/2,   h_j=(b_j−a_j)/2≤1/4,
    c_(j+1)≥c_j²,   c_j≥exp(exp j),   c_1>10.

Each pair is consecutive among distinct real zeros, so F_0 is nonzero on (a_j,b_j). Multiplicities at the endpoints need not be one: remove exactly one copy at each endpoint. Infinitely many baseline simple real zeros remain after this sparse removal.

Choose 0<ε_j<min(h_j,1/4). Define

    R_j(z) = [((z−c_j)²+ε_j²)((z+c_j)²+ε_j²)]
              / [((z−c_j)²−h_j²)((z+c_j)²−h_j²)],
    F_hat(z) = F_0(z) ∏_(j≥1) R_j(z).                  (2)

For one center d=±c_j, the local rational factor is

    R_(d)(z)=1+(h_j²+ε_j²)/((z−d)²−h_j²).             (3)

On compact sets avoiding its poles, the remote factors differ from one by O(c_j^(-2)); the product converges locally uniformly as a meromorphic function. Every pole is canceled by an existing zero of F_0. The product (2) is therefore entire. It is even and real on the real axis.

The only changed zero copies are the explicitly listed ones. Added zeros have imaginary parts ±ε_j with ε_j<1/4. The baseline zeros already lie in |Im z|<1/2. Real zeros after surgery remain unbounded in both directions. The number of affected pairs with c_j≤T+1 is O(log log(T+3)), so the vertical real-part zero count changes by at most that amount. In particular the leading Riemann–von Mangoldt count with its O(log T) error survives.

## 3. Uniform control away from and through the canceled poles

Use radius-two disks around all centers d=±c_j. They are disjoint. Outside these disks, (3), h_j≤1/4, and sparse separation imply

    Σ_d |R_(d)(z)−1| ≤ C,
    Σ_d |R_(d)'(z)| ≤ C,

and the product is bounded above and away from zero uniformly in every ε_j. The analogous bounds for finitely many higher derivatives also hold. A simple comparison with Σ_(k∈Z)(4+k²)^(-1) proves the uniform sum bound; the center spacing is bounded below by a fixed positive constant. Each individual deviation is small enough that logarithms cause no difficulty.

Inside one radius-two disk, all other factors retain these uniform bounds. For its two real zeros a,b, write

    G(z)=F_0(z)/[(z−a)(z−b)].

For real t in that disk, the divided-difference identity gives

    |G(t)| ≤ (1/2) sup_J |F_0''|,
    |G'(t)| ≤ C sup_J |F_0'''|,                        (4)

where J is a fixed-radius real interval about the center. These bounds are uniform as b−a shrinks. They follow from the Hermite–Genocchi integral formula for the second divided difference F_0[a,b,t]; differentiating under that simplex integral gives the second estimate. The vanishing values F_0(a)=F_0(b)=0 identify the divided difference with G(t). Repeated-node limits handle t=a,b.

The numerator (t−c_j)²+ε_j² and its derivative are uniformly bounded on the disk. Thus (4) controls F_hat,F_hat' there without any factor 1/h_j or 1/ε_j. The factor belonging to −c_j is among the harmless other factors.

For complex z in the disk, Cauchy's formula on a concentric fixed larger circle gives the analogous bound |G(z)|≤C max|F_0|. Consequently

    max_(|z|≤R)|F_hat(z)| ≤ C max_(|z|≤R+6)|F_0(z)|.   (5)

On the imaginary axis no center disk is met and the product in (2) is uniformly bounded above and away from zero. Since the actual F_0 attains order-one growth there, F_hat has order exactly one. This proves more than an at-most-order-one claim.

## 4. Retaining the sharp gamma envelope

The needed baseline derivative estimate is elementary and unconditional. Uniformly on a fixed-width complex strip about the real t axis, the exact xi gamma factor and Euler summation for ζ in a positive real-part strip give

    |F_0(t+iy)| ≤ C(1+|t|)^K exp(−π|t|/4),
                                                       |y|≤1/4,

with some fixed K<7/2. For example Euler summation gives |ζ(σ+it)|≤C(1+|t|)^(1−σ) uniformly for 1/4≤σ≤3/4. Combining the gamma factor and the quadratic xi prefactor gives a power at most 19/8 in this strip. Cauchy estimates on smaller fixed-radius disks give the same bound for each fixed derivative on the real axis, with a derivative-dependent constant. No RH or convexity estimate is needed.

In particular F_0,F_0',F_0'',F_0''' are all bounded by C sqrt(W) on the real axis. Shifting the argument by a bounded amount changes this envelope by only a fixed factor. Equations (3)–(4) and the global off-disk estimates therefore give, uniformly in every ε_j,

    F_hat(t)²+F_hat'(t)² ≤ C W(t).                     (6)

The same argument with further derivatives gives exponential decay of every fixed derivative. In particular all source-closure and polynomial completeness arguments remain applicable.

## 5. Retaining the actual lower comparison

Use the actual comparison proof's degree-sized interval |t|≤R_n=An+1 and exclusion radius δ_n=(n+2)^(-6), where A=16/c and c=π/2. Keep its original actual-zeta good-point exclusions and additionally exclude complex-distance δ_n neighborhoods of the new zeros ±c_j±iε_j with c_j≤2R_n. The added excluded length is O(δ_n log log(n+3)), still negligible compared with n^(-2).

At a retained point, each nearby rational quartet has absolute value at least

    |R_j(t)| ≥ δ_n^4/[C(R_n+1)^4].                   (7)

Indeed every numerator linear factor has modulus at least δ_n, and the denominator factors are each O(R_n+1). There are O(log log(n+3)) nearby quartets. For c_j>2R_n, each real rational factor (3) is at least one, since its denominator is positive. Hence

    |∏_j R_j(t)| ≥ exp[−C log²(n+2)]                  (8)

uniformly in all ε_j. The retained good point is not a baseline real zero, by the original exclusions; no quotient is evaluated at a zero.

Combine (8) with the actual-theta good-point lower bound for F_0^4 and the unchanged source tail furnished by (6). The exact identity

    (F_hat²p)'=F_hat T_hat p

and Cauchy–Schwarz give

    X_hat[p] ≥ exp[−C log²(n+2)] e^(−c|t|)|p(t)|²     (9)

at every retained good point. The weighted polynomial maximum is still attained in |t|≤An. Markov's inequality keeps it within a fixed factor on a length comparable to n^(-2), which cannot be covered by the exceptional set. The original weighted-maximum comparison then proves the lower half of (1).

The pointwise majorant (6) and the supplied Pollaczek derivative estimate give the upper half of (1) exactly as for F_0. The sharper single-Pollaczek derivative bound likewise gives X_hat[M_n]≤C b_n. Uniformity for finitely many small degrees follows by applying one sufficiently large fixed degree bound to all smaller-degree polynomials. No parameter-dependent positive-definiteness compactness argument is needed.

## 6. Escaping capacity still diverges

For each j, choose a closed symmetric neighborhood of c_j lying strictly inside (a_j,b_j). On it, F_0 is nonzero and the denominator (t−a_j)(t−b_j) never vanishes. Write x=t−c_j and factor

    F_hat(c_j+x)=(x²+ε_j²)b_j(x).

For each fixed j, |b_j| is bounded above and away from zero and |(log|b_j|)''| is bounded, uniformly in all the parameters. This follows from §3 and from the fixed nonvanishing baseline quotient on this small neighborhood. The constants may depend on j, which is harmless.

The real-zero cell of F_hat containing c_j contains (a_j,b_j), whether or not either endpoint survives with reduced multiplicity. The calculation from the earlier valley model applies verbatim:

    v_hat'(c_j+x)
       =4(ε_j²−x²)/(x²+ε_j²)²+2(log|b_j|)''(x).

On |x|≤ε_j/2, for sufficiently small ε_j, the positive target measure satisfies

    ∫_(c_j−ε_j/2)^(c_j+ε_j/2) (v_hat')_+/w_hat
         ≥ C_j ε_j^(-5).

The left and right cumulative cell masses are bounded below by integrals on fixed side windows contained in (a_j,b_j). Thus

    B_(I_j) ≥ C'_j ε_j^(-5),  C'_j>0.

All constants for a fixed j are uniform over the other parameters. Choose ε_j independently small enough that B_(I_j)≥j². The sharp capacity lower bound then forces unbounded positive operator norms on escaping cells, while all preceding uniform reference bounds continue to hold.

## 7. Exact limitation

This construction removes the escape-capacity implication even when the sharp upper gamma majorant, the original all-degree comparison, uniform Pollaczek competitor, ordinary zero-count asymptotic, critical-strip bound, and generic selected Green structure are retained together. Real-zero geometry is changed only at the stated sparse copies, so this is a different preservation statement from the earlier multiplier model, which retained every real zero but did not establish the sharp upper envelope.

A successful estimate for the actual theta capacity tail must use additional specific information, or it must bypass uniform block control and exploit the particular selected diagonal. No inference is made here about the actual capacities, selected H/X, the required negative-excess lower bound, or RH.
