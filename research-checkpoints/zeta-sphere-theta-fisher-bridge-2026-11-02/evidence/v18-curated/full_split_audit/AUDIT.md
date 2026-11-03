# Complete odd degree-19 repair: independent audit

2 November 2026. PASS after replay using independently recomputed core and full moments. Scope is normalized a=0, odd channels 1,3,...,19. This does not establish the even block, full H19, nonzero shifts, or all-degree positivity.

The checker reads fixed rational diagonal scales and a fixed rational 8x8 U. Interval LDL of U*U proves invertibility without presuming exact eigenvectors. Decimal moment endpoints are padded outward by 1e-90(1+|lo|+|hi|), as in the independently reviewed projected repair. Rational-to-interval conversion safely encloses the exact candidates.

The positive first-two-channel core and actual-tail blocks are eliminated separately. The interval Gauss-Jordan routine asserts positive successive pivots; these certify the symmetric actual lower matrices' positivity, and interval arithmetic encloses their exact inverses. All later matrix products retain enclosing intervals even though common quantities are correlated.

For the core residual, U*ScU has a verified positive 5x5 complement P. With H=P^-1 Cpn, the triangular congruence gives diag(-N,P), where N=-Cnn+CnpH is verified positive. Together with the original positive two-channel block, this proves exact core inertia (3 negative,7 positive), with no zero eigenvalues.

The tail is transformed by the same U and same exact H. The formulas Tnn-H*Tpn-TnpH+H*TppH and Tnp-H*Tpp check. The full 8x8 tail residual is independently verified PD; neither that hypothesis nor complementary positivity is assumed from the earlier three-witness result.

Interval LDL verifies Tnn-600N>0 and .995Tnn-Tnp(P+Tpp)^-1Tpn>0. Thus the full residual Schur complement exceeds .005Tnn-N>2N>0. The original core/tail binary covariance is PSD and may be omitted for this sufficient argument. An additional direct LDL computation of the entire actual full 10x10 odd matrix verifies the conclusion separately.

Independent replay lower-pivot minima (rounded downward for display):
- coordinate U*U: >.999999;
- core positive complement: >.0001656894;
- core negative block N: >.0000044392894;
- full actual-tail residual: >.5299112;
- Tnn-600N: >.0040522008;
- .995 coupling allowance: >.0006427198;
- direct full odd matrix: >.5308742.

These are LDL pivots in specified coordinates, not invariant eigenvalue lower bounds. The κ and η conclusions are matrix inequalities justified by positive definiteness, not by interpreting pivots as eigenvalues. No numerical inertia probe is used as proof.

Dependencies are the independently replayed full-theta core Taylor/Cauchy certificate and full reflected-moment certificate in core_inertia_audit/ and actual_tail_repair_audit/, respectively. Replay files here use those independent outputs, not the author's copies. No acquired executable code was run.
