"""Rigorous finite de Branges shear-Gram certification.

This package proves statements only about the finite matrix at the supplied
sample nodes.  It deliberately makes no claim about the Riemann hypothesis.
"""

from .certify import (
    CERTIFIED_NEGATIVE_WITNESS,
    CERTIFIED_POSITIVE_FINITE_GRAM,
    INCONCLUSIVE,
    CertifierConfig,
    classify_hermitian_ball_matrix,
    certify_spec,
    parse_case,
    validate_case,
)
from .certificate import (
    canonical_json_bytes,
    canonical_json_text,
    verify_certificate,
    verify_hashes,
)
from .exact import ExactInputError, canonical_rational, parse_rational
from .gram import build_gram, de_branges_kernel, de_branges_kernel_from_values
from .theta import (
    ThetaComponents,
    ThetaCrosscheckResult,
    ThetaEvaluationError,
    ThetaInputError,
    ThetaTailBound,
    theta_completed_xi_crosscheck,
    theta_components,
)
from .xi import E_a, E_sharp_a, Xi, xi_completed, zeta_deflated

__all__ = [
    "CERTIFIED_NEGATIVE_WITNESS",
    "CERTIFIED_POSITIVE_FINITE_GRAM",
    "INCONCLUSIVE",
    "ThetaComponents",
    "ThetaCrosscheckResult",
    "ThetaEvaluationError",
    "ThetaInputError",
    "ThetaTailBound",
    "CertifierConfig",
    "E_a",
    "E_sharp_a",
    "ExactInputError",
    "Xi",
    "build_gram",
    "canonical_json_bytes",
    "canonical_json_text",
    "canonical_rational",
    "certify_spec",
    "classify_hermitian_ball_matrix",
    "de_branges_kernel",
    "de_branges_kernel_from_values",
    "parse_case",
    "parse_rational",
    "theta_completed_xi_crosscheck",
    "theta_components",
    "validate_case",
    "verify_certificate",
    "verify_hashes",
    "xi_completed",
    "zeta_deflated",
]

__version__ = "0.1.0"
