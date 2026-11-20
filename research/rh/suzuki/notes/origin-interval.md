# Origin interval: no missing 0 <= r <= log 2 segment

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

Before the first prime event, the actual normalized Suzuki function is exactly

\[
 \Psi(r)=C(r)=4e^{r/2}+br-4+T(r),\qquad
 T(r)=\sum_{k\ge1}{1-e^{-(2k+1/2)r}\over(2k+1/2)^2},
 \quad0\le r\le\log2.
\]

The q=2 hinge contribution is zero at r=log2, so the endpoint is included. Every T summand is nonnegative for r>=0. The series is uniformly dominated by a summable coefficient sequence, proving continuity at 0 and C(0)=0.

Set a=log(5/4). For 0<r<=a,

\[
 C''(r)=e^{r/2}-{e^{-5r/2}\over1-e^{-2r}}<0,
\]

because multiplying by a positive factor reduces its sign to that of \(e^{3r}-e^r-1\). The polynomial \(y^3-y-1\) increases on 1<=y<=5/4 and at 5/4 equals -19/64. Thus C is concave on [0,a], including the endpoint by continuity.

The 192- and 256-bit Arb checks retain the first 128 **positive** T terms and prove C(a)>1/100. Concavity yields

\[
 \boxed{\quad\Psi(r)\ge {r\over100\log(5/4)}\quad(0\le r\le a).\quad}
\]

On [a,log2] the program covers the entire closed interval by 256 overlapping-endpoint Arb cells. On each cell it evaluates

\[
 4e^{r/2}+br-4+
 \sum_{k=1}^{128}{1-e^{-(2k+1/2)r}\over(2k+1/2)^2}
\]

using an interval containing every real argument in the cell. Every computed interval is strictly above 1/100. The omitted T tail is positive; no finite tail estimate or point sampling is substituted for its sign. This proves

\[
 \boxed{\quad\Psi(r)>1/100\quad(a\le r\le\log2).\quad}
\]

Together with either coarse finite certificate, this covers the full initial segment: Psi(0)=0 and Psi(r)>0 for every 0<r<=log X, with the fixed positive floor applying only from a onward. This is still a finite scalar assertion, not RH or full-form positivity.

Evidence: `check_origin_interval.py`, `ORIGIN_INTERVAL_192_256BIT.json`. The interval enclosures, not their rounded display centers, are used for acceptance. See the bundled independent review.
