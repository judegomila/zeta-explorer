# Exact scalar extraction does not lower the missing signed pivot

New companion, separately awaiting audit. The positive-primitive main note is frozen. This note retains the actual signed moment functional and identifies one unconditional actual-theta scalar estimate.

## 1. The zero-tail subspace has the same top-moment debt

For fixed a let mathcal L_a be the actual signed bridge functional on real x=t²+a², with moments m_k. Use the precise normalization of the original bridge consistently; the following algebra is invariant under its positive scalar factors. Fix eta=a-1/4 and write p=p(eta)+(x-eta)q. If deg p<=N, the zero-tail subspace has basis(x-eta)x^j, j=0,...,N-1. Its Gram is
 C_ij=m_(i+j+2)-2eta m_(i+j+1)+eta²m_(i+j).
The highest entry C_(N-1,N-1) contains m_(2N) with coefficient1. This is the SAME unknown top moment appearing in the next signed pivot. Positivity of the known degree-(N-1) block does not establish C>=0. Eliminating the scalar tail with a Schur complement against C would first require this unpaid positivity and its actual inverse. Hence this extraction is a domain/tail reduction, not a degree-reducing positivity recurrence.

## 2. A genuinely positive scalar rational form for complete theta

At a=0 put F(t)=integral_R psi(u)exp(-itu)du, real and even, and
 Lambda(t)=F'(t)²-F(t)F''(t).
This is the normalized spectral bridge density up to the fixed positive convention factor. For any d>0 define
 J(d)=integral_R Lambda(t)/(t²+d²)dt.
All integrals converge absolutely. Symmetrizing the two Fourier variables gives
 Lambda(t)=(1/2)integral_R² (u-v)²psi(u)psi(v)exp[-it(u+v)]du dv.
The elementary Fourier transform of1/(t²+d²) therefore yields
 J(d)=pi/(2d) integral_R² (u-v)²psi(u)psi(v)exp[-d|u+v|]du dv >0. (1)
This is actual-theta positivity: psi is strictly positive and nondegenerate. It does not assume the pointwise sign of Lambda or RH.

There is an explicit lower bound from any R>0. Set M_j(R)=integral_(-R)^R u^j psi(u)du. Evenness cancels M_1, and restriction to this square gives
 J(d)>= (pi/d)exp(-2dR)M_0(R)M_2(R)>0.                 (2)
These are ordinary positive complete-theta moments; no signed target norm has been replaced.

## 3. Rational moment recurrence, with its missing positivity visible

Let mu_k=integral t^(2k)Lambda(t)dt and nu_k(d)=integral t^(2k)Lambda(t)/(t²+d²)dt. Exact polynomial division gives
 nu_0=J(d),
 nu_(k+1)=mu_k-d²nu_k,
 nu_k=sum_(j=0)^(k-1)(-d²)^j mu_(k-1-j)+(-d²)^k J(d).
Thus scalar positivity of J controls one datum of this rational hierarchy. The rest includes alternating combinations of actual signed moments. It does NOT establish PSD of the polynomial Gram(nu_(i+j)), nor its localizing matrix(nu_(i+j+1)). Recovering the original next degree needs
 mu_(2N)=nu_(2N+1)+d²nu_(2N),
and the first term still carries the original missing moment. No known lower block determines it.

The positive double-integral representation in(1) cannot simply be extended by inserting an arbitrary polynomial test as a positive multiplier: multiplication by t^(2k) differentiates the kernel exp(-d|u+v|), introducing signed terms and boundary distributions. Those terms must be kept. This is the exact place a scalar positive primitive fails to become an all-degree positive Gram for free.

## Conclusion

The actual scalar J has a proved positive lower bound, and the slow tail is exactly one scalar evaluation. Nevertheless the attempted lower-degree Schur recurrence remains blocked at the original top moment, with coefficient1. A new theta-specific estimate of the signed higher rational moments/localizing block would be needed. No claim of failure of RH, or of failure of every possible use of the filter, is made.
