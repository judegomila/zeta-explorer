# Independent audit of the exact-orbit Morse inequality

2026-11-03. Audit target: `EXACT_ORBIT_MORSE_ENERGY.md`.

## Verdict

The two stated inequalities, their constants and equality spaces, and the spectral formula (3) are valid. They are genuinely proved auxiliary inequalities. They do not establish the sign of the complete-theta paired density.

One expository correction was requested and has been implemented in the note: the left tail of a polynomial differential test is not literally a finite sum of exponentials. More precisely, with alpha = 1/2-a,

v(u) = exp(alpha u) exp(-x) P_q(x),

where P_q is a polynomial divisible by x. Thus v and each fixed derivative are O(exp((5/2-a)u)) as u tends to minus infinity. The leading term can vanish for particular q; for example q(t)=t^2+(5/2-a)^2 annihilates the first left-tail exponential. None of this affects form-domain membership.

## Checks

- Direct symbolic differentiation independently gives B*B=H+16, BB*=C*C+12, and CC*=J*J+4. The formal adjoint is -D plus the same real multiplication coefficient because the measure is du, not dx.
- All the first-order graph/form domains are H^1(R) intersect {xv in L^2}. This follows from their squared-norm identities and the bound of linear x by epsilon x^2 plus a constant. Compactly supported smooth functions give a common form core. The identities therefore extend to the closed realizations used in the proof.
- The polar correspondence is applicable: ker B* and ker C* vanish, whereas ker B and ker C are the stated one-dimensional spaces. On the orthogonal complement of ker C, C*C is unitarily equivalent to CC*, which is at least 4. Similarly, on g-perp, B*B is unitarily equivalent to BB*. Its eigenvalue 12 is simple and its remainder is at least 16.
- Independently checked Hg=-16g, Hphi=-4phi, B*(x exp(-x))=phi/2, and the exact integrals ||g||^2=3/16, ||phi||^2=6, and <g,phi>=0.
- In (1), testing g and phi proves respectively that 64 cannot be decreased with scalar correction 4 fixed, and that 4 cannot be decreased. In (2), testing g and phi separately proves sharpness of both rank-two coefficients.
- Equality in (1) is exactly span{g,phi}, since the remaining spectrum of the corrected form is at least 4. Equality in (2) has the same space: a further zero eigenvector would correspond to a zero vector of J*J, but Jv=0 gives exp(-x), which is not square-integrable at minus infinity. Zero is a spectral threshold, not an extra L^2 equality vector.
- With the positive-exponent Fourier convention, iD transforms to t. Multiplication by exp(bu) transforms the differential polynomial to q(t-ib), not q(t+ib). The signs and factors 4 pi^2 and -20 pi in (3) are correct by Plancherel and x=pi exp(2u).
- Mellin integration gives A(s)=s(s-1)pi^(-s/2)Gamma(s/2), with absolute convergence precisely for Re s>-2. The recurrence 2 pi (s-1)A(s+2)=(s+2)(s+1)A(s) is correct. Its stated quotient is safe on 0<Re s<1/2.

## Scope

No direct domination or identity connecting this Morse energy to the full paired phase-derivative form is supplied or follows from the audited proof. In particular, the original orbit's differential and gamma recurrences do not control the arithmetic cross terms of the full theta sum. The document accurately identifies this remaining gap. No claim of RH or of a selected-pivot sign follows.
