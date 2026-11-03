# Absolute curvature envelopes cannot prove the selected remainder criterion

Status: independent analytic audit PASS. This obstruction holds for the actual theta source under the positive old-prefix assumptions and in fact for any sufficiently regular signed source.

Let q_n be the actual monic λ-orthogonal selected polynomial, n≥1, let D_n=∫λ(q_n')²>0 be its already-positive opposite-parity old norm, and recall

 ∫λ'' q_n² = 2D_n.                                                   (1)

Suppose one attempts to certify the sufficient condition

 ∫(λ''−C_nλ)_+ q_n² ≤ D_n                                         (2)

by first replacing its integrand by any pointwise majorant H_n satisfying H_n≥(λ'')_+. This includes the common absolute-splitting bound H_n=|λ''|+C_n|λ| and any larger exponential/gamma envelope. Then necessarily

 ∫H_n q_n² ≥ ∫(λ'')_+q_n² ≥ ∫λ''q_n² = 2D_n > D_n.                (3)

Thus such an estimate can never prove (2), for any degree or C_n. A generic H_n≥(λ'')_+ does not automatically dominate the original positive part when λ has negative portions; (3) says that if one uses an H_n with this property as an upper bound, the resulting bound is unusable. The standard triangle majorant does dominate the positive part, and is therefore decisively too crude.

This is an exact selected-sequence obstruction: it retains the actual old inverse through q_n and does not assume the next pivot. It does not rule out (2), a pointwise majorant that preserves cancellation inside λ''−C_nλ, or any different correlated Schur estimate.

Writing H_±=∫(λ'')_±q_n² and P=∫λ_+q_n², N=∫λ_-q_n² gives H_+−H_-=2D_n. For N>0, the elementary positive-part inequalities imply any C_n satisfying (2) must obey

 (D_n+H_-)/P ≤ C_n ≤ (D_n+H_-)/N,                                (4)

where P>0 follows from D_n>0 and P≥0 if (2) holds. These necessary bounds are not asserted sufficient. They expose dependence on the selected polynomial's actual positive/negative source mass, rather than a free choice of arbitrarily large C_n.

The interval in (4) is nonempty exactly when P≥N, i.e. Q_n≥0. Thus eliminating C_n from these necessary conditions alone merely restates the desired sign and provides no independent positivity proof. A genuinely useful theta estimate must control how the signs of λ'' and λ correlate with the selected q_n, beyond their separate positive/negative masses.
