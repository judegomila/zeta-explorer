# A selected-residual curvature-remainder sufficient lemma

Status: independent analytic audit PASS. The identity and Gaussian calculation are elementary; the all-degree theta arithmetic hypothesis is unproved. This is not an RH proof.

Let F be the real even Fourier transform of the complete theta profile and define the exact paired density

 λ(t)=2[F'(t)²−F(t)F''(t)].                                         (1)

It is real even, smooth, rapidly decreasing; no pointwise sign is assumed. Fix n≥1 and assume the actual signed old parity blocks through degree n−1 are positive. Let q_n be the monic degree-n polynomial of the appropriate parity that is λ-orthogonal to all lower same-parity polynomials. This uses the actual old signed inverse, not a positive parent substitute. Put

 Q_n=∫_R λ q_n²,       D_n=∫_R λ(q_n')².                             (2)

The n−1 derivative belongs to the old opposite-parity block and is nonzero, so D_n>0 under precisely the current-prefix assumption. The target Q_n is not assumed positive.

Since q_n'' has the old same parity and degree at most n−2, selected orthogonality gives ∫λq_n q_n''=0 (trivially at n=1). Two integrations by parts yield the exact identity

 ∫_R λ'' q_n² = 2 D_n.                                              (3)

For any C>0 define the computable nonnegative source remainder

 r_C(t)=[λ''(t)−Cλ(t)]_+.

The pointwise inequality λ''≤Cλ+r_C and (3) imply the noncircular lower bound

 Q_n ≥ [2D_n−∫r_C q_n²]/C.                                         (4)

Thus the following is a precise, stronger-than-target sufficient arithmetic lemma:

 ∃ C_n>0 such that ∫_R [λ''−C_nλ]_+ q_n² ≤ D_n.                    (5)

If proved from complete-theta arithmetic and the existing positive prefix, (5) yields Q_n≥D_n/C_n>0. Every term of (5) uses the known source F and the current selected polynomial, with no next-pivot denominator or assumed next sign. The positive-part operation discards a favorable signed piece, so (5) is generally stronger than the desired sign and is not merely equality (3) rewritten as Q_n≥0. It does, however, retain the actual old inverse hidden in q_n, and its cost can reflect negative portions of λ; no estimate of (5) for all theta degrees is asserted.

The source is explicit in the complete Xi derivatives:

 λ''=2(F''²−F F'''').                                               (6)

Hence the proposed remainder is an explicit four-jet theta/arithmetic quantity, not an abstract spectral gap. Zeros of F do not require division or a log derivative.

## Gaussian baseline with an explicit degree scale

For λ(t)=exp(−t²/c), let q_n be monic Hermite polynomials for its positive measure and N_n=∫λq_n². Then

 D_n=(2n/c)N_n,
 ∫t⁴ λq_n²=(3c²/4)(2n²+2n+1)N_n.

Since r_C=(4t²/c²−2/c−C)_+ λ, the elementary indicator bound gives

 r_C ≤ 16 t⁴ λ/(c⁴ C).

Taking

 C_n=6(2n²+2n+1)/(cn) = O(n)                                       (7)

gives ∫r_(C_n)q_n²≤D_n, and (4) yields

 Q_n ≥ D_n/C_n = [n²/{3(2n²+2n+1)}]N_n >0.                         (8)

The true Gaussian Q_n=N_n, so the bound is non-sharp but keeps a fixed positive fraction asymptotically. This validates the proposed degree scale in the Gaussian model only; it gives no theta proof.
