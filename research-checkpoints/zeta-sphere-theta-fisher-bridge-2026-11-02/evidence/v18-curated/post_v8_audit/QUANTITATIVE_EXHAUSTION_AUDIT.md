# Unrestricted-node quantitative exhaustion: independent audit

2 November 2026. PASS, with additive-error and conditional-relative scope unchanged.

Checked the full-theta analytic strip bound: 5u²<=exp(2u), pi>3, the polynomial exponential majorant and geometric n sum give 6912 exp(-5u²/8). Analytic evenness, not reflection of a truncated series, handles negative u. The bridge weight and h integral give the uniform strip L1 bound below 3e8. Gaussian decay controls contour edges, so Fourier decay exp(-|k|/2) follows. With Fourier inversion 1/(2pi), the signed measure is dominated by M w_eta with eta=1/2 and M=3e8, as claimed.

The generating function recurrence and sec transform prove orthonormality with no missing normalization. Substitution t=i tanh(pi v/(2eta)) gives the exponential exactly; the square-summable orthogonal series converges in L2 and a pointwise-convergent subsequence identifies its generating-function limit. Thus the truncation is exactly the polynomial orthogonal projection, and its error is |q|^(m+1). Replayed the campaign-authored check_basis.py: all exact degree-nine orthogonality and constant checks pass. Floating examples remain illustrations only.

The signed quadratic-form difference bound uses total variation and Cauchy-Schwarz, hence does not assume positive spectrum. Midpoint translation gives q_D=tanh(pi D/2), and the l1-to-l2 inequality gives precisely the J factor. Origin jet PSD supplies polynomial positivity by phase congruence. At finite m the conclusion is only G>=-6e8 J q_D^(m+1) I, never exact positivity.

The exact remainder matrix is diag(q^(m+1)) W diag(q^(m+1)), including negative q. Its PSD and the relative bound gamma x-M(2 sqrt(xy)+y) check. For distinct finite nodes W_m is PD once m>=J-1; fixed-configuration tau tends to zero, but no lower bound on the actual gamma follows. Repeated-node inversion is explicitly excluded.

Section 8 is valid for approximating each individual exponential by degree-m polynomials in this reference norm. Projection optimality plus midpoint minimax gives the endpoint lower bound and large-D degree asymptotic (1/2)exp(pi D)log(1/epsilon), for fixed epsilon. It does not constrain arbitrary methods or special cancelling coefficient combinations. Separate centers introduce mixed Grams not implied positive by origin jets.

No RH closure or new all-order sign proof follows. v8 remains unchanged.
