# Independent audit: collision-stable three-node framework

2 November 2026. Mathematical framework and the two interval implementations PASS. The worker's final prose artifact is pending a separate last read. No arbitrary-cardinality positivity is claimed.

## Analytic all-order equivalence: exact hypotheses

Let K be real and even on R and holomorphic on a connected strip |Im z|<r0, r0>0. All finite origin-jet matrices H_ij=(-1)^j K^(i+j)(0) being PSD is equivalent to global positive definiteness of K.

Indeed diagonal phase congruence converts H to the real Hamburger Hankel moment matrices for m_n=i^(-n)K^(n)(0). The Hamburger existence theorem supplies a positive measure mu with these moments. For any 0<R<r0, Cauchy's bound gives 0<=m_2n<=M_R(2n)!R^(-2n). Monotone convergence in cosh then gives integral cosh(epsilon t)dmu<infinity whenever epsilon<R. Thus mu has an absolute exponential moment; its Fourier transform is holomorphic on a smaller connected strip and has the same Taylor series as K. The identity theorem gives equality on the whole real line. No unsupported moment-determinacy assumption or separate Carleman step is required. Conversely PD and analytic regularity give PSD derivative Gram matrices by limits of divided differences (or the resulting moment representation).

Merely smooth origin jets do not suffice. Add an even smooth bump supported away from zero to exp(-v^2), with large enough amplitude that K(v)>K(0) somewhere. Every origin jet is unchanged and PSD, but the two-point PD inequality fails. Analyticity/exponential determinacy is substantive, not cosmetic.

For the actual full-theta C_a/a, the open strip |Im v|<pi/4 follows from cos(2Im v)>0 in the complex theta-product decay. Corrected Ewald D_(a,N)/a is holomorphic on that strip as C minus the normally convergent omitted nonaxis series. Do not infer this from an individually reflected half-line axis primitive.

## Divided differences and conditioning

For nodes x0,x1,x2 of diameter d, mixed Newton divided differences of K(x-y) equal simplex averages of (-1)^j K^(i+j)(x-y)/(i!j!). Multiplying Newton rows by i! alpha_i, alpha=(1,1/10,1/100), gives the collision limit H_ij=alpha_i alpha_j(-1)^j K^(i+j)(0). These are invertible congruences for distinct nodes and continuous confluent limits at collisions. They remove coordinate singularity, not a mathematical requirement for positivity in increasing dimension.

The reviewed interval data uniformly for 0<a<=1/2 give K0>.0314, -1.536<K2<-1.477 and K4>205, with K=C_a/a. Gershgorin then gives lambda_min(H)>.005 (limiting row: .0205-.01536=.00514).

On |v|<=.001, the independently verified envelopes |K4|<310, |K6|<101000 imply |K2|<1.537. Evenness gives even-order differences at most d^2 M_(r+2)/2 and odd-order values at most d M_(r+1). For d<=.001, the scaled Newton perturbation has maximum row sum below .0005; the largest row is bounded by .0001537+.00000155+.00031=.00046525. Hence the normalized Newton matrix of the full kernel is >.0045 I for every three-node cluster of that diameter, uniformly in shift. This covers arbitrary translations and arbitrarily close nodes, including derivative-observation confluent limits. The ordinary repeated-node Gram is instead singular PSD, as it should be.

## Corrected Ewald relative remainder

On |Im v|<=1/16, gamma=cos(1/8)>.99. Writing Q_real=n^2e^(-2Re v)+m^2e^(2Re v), one has Re Q=gamma Q_real and |Q|,|Q'|/2<=Q_real. The previously reviewed normalized 28-integral orbit estimate therefore remains valid with exponential exp(-gamma R), R=pi x Q_real. Since gamma*2pi>6, the same elementary x integration gives a uniform bound

(140/gamma)(2pi)^3 sum_(k>N) k^4 exp(-gamma*2pi k)
 <42500 sum_(k>N) k^4/300^k.

For N=12 the last expression is <10^-23 by its first term and a geometric ratio <.005. Cauchy's estimate gives remainder derivatives r!16^r 10^-23, <10^-12 through r=6. Simplex averaging transfers these derivative bounds to collision-stable Newton error entries, each <10^-12, hence operator norm <3*10^-12. Thus the corrected head has normalized lower margin >.004 and relative error <7.5*10^-10<10^-9 for these clusters. No minimum node separation is required.

## Interval implementation review and reruns

Read certify_confluent_jets.py and certify_local_derivative_bounds.py in confluent_v4. Independently checked exact rational derivative recurrence p_next=(1/2-2r)p+2rp', mixed h/v derivatives, reflection parity across zero, and Simpson remainder d^5 sup|f''''|/2880. The normalized weight is 2h^2 integral_0^1 cosh(2ash)ds. Differentiating this integral gives the script's factor 1/(k-l+1) and its uniform derivative bound, so the interval treatment is uniform in a rather than a sample at finitely many shifts.

The coefficient sum bound 10^30, derivative degree<=12 and n>=11 theta omission make the 10^-80 e^(u/2-r0)(1+r0)^12 tail conservative: 4*10^30 sum_(n>=11)n^24 exp(-pi(n^2-1)) is already below 10^-100. For h>=4 and |v|<=.001, the super-exponential product tail comfortably dominates all derivative polynomial factors, making 10^-2500 conservative. Local derivative bounds are interval upper sums over every cell and all |v|<=.001, not point samples.

Both scripts were rerun independently in foundations/confluent_recheck; all reported jet and derivative-envelope endpoints reproduce the originals. Rerun output and copied locally authored scripts are retained there. An execution-environment interruption occurred only after these runs completed; restored access confirmed their results. This is a mathematical/interval implementation audit, not a formal proof-assistant verification.

## Final companion/framework check

Read the completed NEWTON_NATIVE_FRAMEWORK.md and CLUSTER_CERTIFICATE.md line by line. Their spectral exponential-moment version of the all-order theorem agrees with the analytic/Hamburger argument above; the polynomial-density proof is valid. The extra C^(2J) regularity needed for the highest even Taylor improvement has been explicitly clarified. The companion uses the correct factorial-scaled alpha=(1,1/10,1/100) convention throughout.

Its slightly looser complex-strip orbit constant 170 is safe: gamma s>5.94, d=gamma s-A-7/2>1.94, and (1/d+2/d^3)gamma s<5. Hence 140/gamma<170, and 170(2pi)^3<42500. The series ratio, Cauchy estimates, complete theta omission and common spatial-tail majorant all check. Ran the locally authored exact-rational verifier independently; PASS, with output retained in confluent_recheck/rational_verifier_output.txt.

Final status: PASS for the stated continuum of at most three-node clusters and its relative grouped tail. This is a stronger scoped finite certificate than one fixed triple, but no all-cardinality or global positive-definiteness claim.
