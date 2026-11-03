# Independent exploratory ratio-kernel check — NOT CERTIFIED

55-digit mpmath direct quadrature, separate implementation in ratio_independent.py. The full even theta profile was evaluated using n=1,...,7; h integration used [0,3], quarter-point subdivisions and the point h=v. This differs from the hierarchy worker's scaled SciPy implementation.

For g(v)=M_5(v)/M_4(v), nodes v_j=j/10 for j=0,...,11, and
c=(-134,383,-230,-315,297,308,-308,-297,315,230,-383,134),
the result is

sum_jk c_j c_k g((j-k)/10)
 = -33.8276078994023710520309134827825418200891191.

This independently corroborates the negative candidate from SciPy (~-33.8276078989). The theta and integration truncations are extremely small at these parameters, but neither the mpmath quadrature nor the displayed decimal is a rigorous interval certificate. No theorem of non-positive-definiteness is claimed from these computations alone.

Environment check: python-flint and arb modules are absent; mpmath and scipy are present. No new dependency was installed. A certificate would require validated quadrature plus explicit theta/integration tail bounds and interval propagation through the ratios and quadratic form. Because c has large entries, individual ratio error must be propagated through sum |c_j c_k|, not judged by printed decimals.
