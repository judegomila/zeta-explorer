MOBIUS BRIDGE REDUCTION - 20 October 2026

RESULT
Exact numerical admissibility for the rational boundary 17497733/20000000
= 0.87488665 in the Xu-Sang arXiv:2610.15291v2 closure system.
This improves that source's stated 0.8748867 by 1/20000000 = 5e-8,
CONDITIONAL on the same imported analytic inputs and closure lemma.
The analytic source proof is not independently verified by this package.
No priority, external peer-review, or direct twin-ladder proof is claimed.

Run (Python 3, standard library only; do not use -O):
  python certify_parameters.py
  python verify_certificate.py

The independent verifier reads the JSON witness and recomputes the endpoint
identity, coefficient positivity, all scalar gates and licensing chain.
It also proves that B <= 0.8748 cannot satisfy the source's stated numerical
admissibility conditions. This obstruction does not exclude other methods.

Optional diagnostics (NumPy and SciPy):
  python mobius_sector_check.py
  python explore_endpoint.py

The Mobius script checks finite identities and pair partitions. It provides
no new asymptotic bound. The optimizer is exploratory and never supplies a
proof acceptance decision. A failed optimizer status is not used.

Mobius_Bridge_Reduction.pdf contains the mathematical arguments and scope.
build_report.py builds the PDF using ReportLab, Matplotlib and Pillow.

DIRECT BRIDGE STATUS
The energy-to-zero-free implication is proved, and pairs with sufficiently
large common divisor or sufficiently short additive separation satisfy the
0.7496 target energy exponent by elementary counting. The remaining signed
pair class is not controlled. The target zero-free boundary 0.8748 is unproved.

SOURCE
Yuanda Xu and Hejian Sang, Amplified moments and a refinement of the
quasi-Riemann hypothesis, arXiv:2610.15291v2, 15 October 2026.
https://arxiv.org/html/2610.15291v2
Imported interfaces: (10), (21), (28), Section 6.2, Lemma 8.1.
The original first-stage parameter certificate is rechecked to license the
retained kappa=29991/40000; the new stage increases ell slightly.

Internal packet reference: Jude Gomila, rh_global_bound_v3.pdf,
30 September 2026, retrieved in the preceding research turn.

CHECKING BOUNDARY
This is a Python exact-rational computation, not a Lean proof. The verifier
trusts Python integer/Fraction arithmetic and the displayed degree bound.
The source analytic assumptions are explicit mathematical dependencies.
