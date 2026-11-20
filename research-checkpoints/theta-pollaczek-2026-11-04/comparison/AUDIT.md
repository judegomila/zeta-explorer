# Independent audit: Pollaczek monic comparison

2026-11-04. Verdict: the proposed all-degree true-theta upper bound and its stronger mesoscopic leverage consequence are sound. No normalization, derivative, or exponent defect was found. The arithmetic packet lower bound remains an inherited input, not independently reproved here.

## 1. Primary-source normalization

Checked the weight, squared norm, and leading coefficient in [DLMF 18.19.8–9](https://dlmf.nist.gov/18.19#E9), and the generating function in [DLMF 18.23.7](https://dlmf.nist.gov/18.23#E7).

At phi=pi/2 the x-variable weight is |Gamma(lambda+ix)|^2, its polynomial squared norm is 2pi Gamma(n+2lambda)/(2^(2lambda)n!), and its leading coefficient is 2^n/n!. Substitution x=t/2 contributes dt=2 dx and divides the leading coefficient by 2^n. Consequently the proposed t-variable formulas are correct:

    Q_n(t)=P_n^(lambda)(t/2;pi/2),
    h_n=(4pi/2^(2lambda))Gamma(n+2lambda)/n!,
    leading(Q_n)=1/n!.

The generating function can be written (1+z^2)^(-lambda) exp(t arctan z). Its even first factor and odd arctangent imply Q_n(-t)=(-1)^n Q_n(t). Therefore n!Q_n is monic and has the required parity, including n=0.

## 2. Derivative identity and uniform scalar norm

Differentiating the generating function in t multiplies it by arctan z, whose z^(2j+1) coefficient is (-1)^j/(2j+1). Coefficient extraction proves precisely

    Q_n' = sum_(odd k<=n) (-1)^((k-1)/2) Q_(n-k)/k.

Orthogonality removes cross terms exactly. Also

    h_m/h_(m-1)=(m+2lambda-1)/m >=1

when lambda>=1/2. It follows that

    ||Q_n'||_W^2/h_n
      =sum_(odd k<=n) h_(n-k)/(k^2 h_n) <= pi^2/8.

For fixed k, h_(n-k)/h_n tends to 1, so summable domination also justifies the stated limiting value pi^2/8. Multiplying by (n!)^2 preserves the ratio and gives both formulas (8) in the note. The proof controls the actual signed polynomial derivative through orthogonality, rather than estimating its coefficient l1 norm.

## 3. Elementary zeta and derivative growth

The needed Euler summation identity is [DLMF 25.2.8](https://dlmf.nist.gov/25.2#E8). For fixed positive integer N and Re(s)>0, its remainder is -s I_N(s), where

    I_N(s)=integral_N^infinity {x} x^(-s-1) dx.

At Re(s)=1/2,

    |I_N(s)| <= 2N^(-1/2),
    |I_N'(s)| <= N^(-1/2)(2log N+4).

Differentiation under the integral is justified locally in Re(s)>0 by absolute domination with the extra logarithm. Differentiate with N fixed; only after doing so choose N comparable to |t|. This avoids differentiating a discontinuous cutoff.

For |t|>=2 and s=1/2+it, the finite zeta sum is O(sqrt N), its derivative sum is O(sqrt N log N), and the remainder and differentiated remainder have orders O(|t|N^(-1/2)) and O(|t|N^(-1/2)log N). The elementary pole term N^(1-s)/(s-1) and its derivative are smaller. Thus

    zeta(1/2+it)=O(sqrt |t|),
    zeta'(1/2+it)=O(sqrt |t| log |t|).

For Z(t)=exp(i vartheta(t))zeta(1/2+it), the standard gamma phase has vartheta'(t)=O(log |t|), so

    |Z(t)|+|Z'(t)|=O(sqrt |t| log |t|)=O(1+|t|).

Compact intervals are handled by smoothness; negative t follows equally from conjugation. No RH or cancellation estimate for zeta is used.

## 4. True source domination

For the supplied amplitude a(t), gamma asymptotics give

    a(t)^2 comparable to (1+|t|)^(7/2) exp(-pi|t|/2).

Its logarithmic derivative is bounded: away from a compact interval this follows from the differentiated gamma asymptotic, and on the compact interval a is positive and smooth. Since F=aZ up to the fixed normalization, F'=a'Z+aZ'. The preceding coarse Z estimate therefore implies

    F^2+F'^2 <= C(1+|t|)^(11/2)exp(-pi|t|/2).

On the other hand |Gamma(4+it/2)|^2 is asymptotic to a positive constant times |t|^7 exp(-pi|t|/2). The ratio is bounded in the tails and on compact intervals, because Gamma has no zeros and no poles on this line. Thus C_0=sup_t (F^2+F'^2)/W_4 is finite, independent of n, and the note's pointwise majorization is valid. The stronger intermediate bound with |t|^(9/2)log^2|t| could also be retained but is unnecessary.

The optional fallback with a sufficiently large fixed lambda is valid provided its cited derivative envelope has the same exponential rate exp(-pi|t|/4) for F and F', with only polynomial losses. Exponential moments at beta<c alone would not establish pointwise domination at the endpoint rate. The main explicit lambda=4 argument above does establish it and does not rely on this fallback.

## 5. Actual X norm and asymptotic scale

Applying the positive-source square inequality and the scalar derivative estimate gives exactly

    A_n <= X[n!Q_n]
        <= C_0(8+pi^2/4)(4pi/2^8)n!Gamma(n+8).

All factors in the note are correct. The bound is valid also for n=0, when the derivative vanishes. Stirling gives, more specifically,

    log(n!Gamma(n+8))=2n log n-2n+8log n+O(1)

as n tends to infinity. Thus equation (3) and its O(log(n+2)) error are valid.

This is strictly an upper comparison on an admissible explicit polynomial. There is no scalar replacement of the true theta X Gram and no implied lower source bound.

## 6. Packet consequence and scope

Relative to 2n log(2n/c)-2n, the new monic upper scale gains 2n log(2/c)=2n log(4/pi). Combining it with the inherited packet coefficient and lower-norm estimates leaves exactly

    2j log(4/(cL))+2k log(n/k)-2j <=0.

Therefore equation (9), including its uniform O(log n) remainder, passes:

    log theta_n <= -2n log(4/pi)+O(log n).

This is stronger than merely a strict-exponent statement: theta_n is bounded by a fixed polynomial in n times exp(-2n log(4/pi)), uniformly in the fixed compact L range. For divergence and growth conclusions use 0<rho<2log(4/pi). The triangular inverse-Gram diagonal and condition number have lower exponential rate 2log(4/pi); the final synthesis coefficient and weighted absolute synthesis sum have lower rate log(4/pi), all measured per actual degree n.

The note correctly avoids claiming relative near-extremality, H[M_n]/X[M_n] tending to zero, selected derivative decay, or coherence. The Pollaczek scalar orthogonality does not imply theta-weighted derivative orthogonality. The claimed new trial family and one-sided selected norm upper bound are valid, while the needed relative arithmetic control remains open.

## Editorial suggestions

- Add the exact DLMF equation links above, particularly 25.2.8 for the elementary derivative estimate.
- State explicitly that N is held fixed when differentiating Euler summation.
- Where a consequence asserts growth or divergence, use 0<rho<2log(4/pi), rather than only rho<2log(4/pi).

These are clarifications rather than repairs to the central proof. No prior files were modified by this audit.
