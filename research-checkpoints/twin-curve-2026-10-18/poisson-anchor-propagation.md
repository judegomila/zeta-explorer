# Exact propagation from a good Poisson-moment anchor

18 October 2026. Separate companion to the good-height note. Independently checked in an internal mathematical review. This provides a valid conditional overlap mechanism, not all-height anchor coverage.

Let S be the actual fixed-cutoff first-prime sum, and let
J_x(T)=integral S(u)^2 x/[pi(x^2+(u-T)^2)]du, x>0.
For every real d,

J_x(T+d)<=H(d,x)J_x(T),
H(d,x)=[(sqrt(d^2+4x^2)+|d|)/(2x)]^2.                    (1)

Indeed the ratio of the shifted Poisson kernel to the original is
[x^2+(u-T)^2]/[x^2+(u-T-d)^2].
Its supremum over u is H(d,x), as follows by differentiating this rational function (or by the largest generalized eigenvalue of its two positive quadratic forms). Integration against S(u)^2>=0 gives (1). This uses no sign assertion about S and no pointwise upper bound on S itself.

If 0<j0<jstar and J_x(T)<=j0, then J_x(T+d)<=jstar throughout

|d|<=x[sqrt(jstar/j0)-sqrt(j0/jstar)].                    (2)

This is the exact solution of H(d,x)<=jstar/j0. For a strict certificate use a strict inequality in (2), or a strict initial margin. Such an anchor gives a genuine overlapping corridor for the arithmetic moment, provided the same polynomial/cutoff and the required analytic boundary margin apply throughout it. A nonzero finite polynomial gives J>0; the degenerate J=0 case is identically zero and can be treated separately.

The slabwise density estimate bounds the total measure where J exceeds a threshold, but does not provide a good anchor within the radius in (2) of every carrier. A gap may contain a cluster whose length is much larger than that radius. Consequently (1) supplies an actual propagation lemma while preserving the exact missing input: a sufficiently fine covering by good anchors, or an alternative certificate inside every uncovered gap. It is not valid to replace that covering requirement by a global almost-everywhere assertion.

If x varies over a target range, kernel comparison can first give J_x(T)<= (x_plus/x_minus)J_(x_minus)(T); this additional factor must be paid before applying a uniform moment threshold. No zero-free conclusion follows solely from (1) or (2).
