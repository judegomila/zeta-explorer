"""Validate the qualitative fixed-index prolate-defect source lock.

The locked Slepian result is an asymptotic equivalence with no effective
threshold.  This module deliberately validates only the source bytes,
normalization dictionary, exact leading constants, and claim boundary.  It
does not turn the asymptotic into a finite numerical bound.
"""

from __future__ import annotations

import hashlib
import json
import math
from fractions import Fraction
from pathlib import Path
from typing import Any


LOCK_FILENAME = "PROLATE_DEFECT_SOURCE_LOCK.json"
LOCK_STATUS = "PINNED_QUALITATIVE_FIXED_INDEX_ASYMPTOTIC_ONLY"
SOURCE_ID = "SLEPIAN-PSWF-IV-1964"
SOURCE_PATH = "vendor/SLEPIAN-PSWF-IV-1964.pdf"
SOURCE_SHA256 = "86efb6b69f405a046914f19c07161329b3f455a93a58467cc8107cfa4a135351"
SOURCE_DOI = "10.1002/j.1538-7305.1964.tb01037.x"
SOURCE_SCAN_URL = "https://www.math.ucdavis.edu/~saito/data/ONR15/PSWF-IV.pdf"

EQUATION_MAP = {
    "finite_fourier": "page 3014, equation (8)",
    "concentration_composition": "pages 3014--3015, equations (12)--(14)",
    "fixed_index_eigenfunction_input": "pages 3027--3028, equations (67)--(68)",
    "normalized_endpoint_identity": "page 3032, equations (84)--(86)",
    "kappa_derivative_and_limit": "page 3033, equations (89)--(90)",
    "generalized_concentration_defect": "page 3033, equations (91)--(93)",
    "one_dimensional_even_odd_reduction": (
        "pages 3037--3039, equations (110)--(113) and following text"
    ),
}

C_MAP = "c=2*pi*lambda^2"
CONCENTRATION_MAP = "d_m(lambda)=1-chi_m(lambda)^2=1-Lambda_m(c)"
EVEN_LABEL_MAP = (
    "ordinary_even_label_m=2*n corresponds to source generalized_N=-1/2, "
    "radial_index=n"
)
ODD_LABEL_MAP = (
    "ordinary_odd_label_m=2*n+1 corresponds to source generalized_N=+1/2, "
    "radial_index=n"
)

SOURCE_EQ_93 = (
    "1-Lambda_(N,n)(c)=pi*2^(2*N+4*n+3)*c^(N+2*n+1)*exp(-2*c)/"
    "(Gamma(n+1)*Gamma(n+N+1))*(1+O(1/c)) for fixed N,n"
)
ORDINARY_ASYMPTOTIC = (
    "1-Lambda_m(c)~4*sqrt(pi)*8^m/m!*c^(m+1/2)*exp(-2*c) "
    "for each fixed integer m>=0"
)
RATIO_LIMIT = "c^4*d_4/d_8->105/256"
EVENTUAL_RATIO = (
    "there exists c_ratio such that c>=c_ratio implies "
    "d_4/d_8<=(105/128)*c^(-4)"
)
EVENTUAL_FLOOR = (
    "there exists c_floor such that c>=c_floor implies "
    "d_8>=(262144/315)*sqrt(pi)*c^(17/2)*exp(-2*c)"
)


class SourceLockError(ValueError):
    """The source lock or its vendored bytes fail closed."""


def ordinary_coefficient_sqrt_pi(label: int) -> Fraction:
    """Return the exact rational multiplying ``sqrt(pi)`` at label ``m``.

    Slepian's one-dimensional reduction gives

        1 - Lambda_m(c) ~ a_m sqrt(pi) c^(m+1/2) exp(-2c),
        a_m = 4*8^m/m!.

    The result is kept rational; no decimal or binary64 parsing is involved.
    """

    if isinstance(label, bool) or not isinstance(label, int) or label < 0:
        raise ValueError("label must be a nonnegative integer")
    return Fraction(4 * 8**label, math.factorial(label))


def fixed_label_ratio(left: int, right: int) -> Fraction:
    """Return the exact leading-coefficient ratio ``a_left/a_right``."""

    return ordinary_coefficient_sqrt_pi(left) / ordinary_coefficient_sqrt_pi(
        right
    )


def repo_ratio_limit_pi_minus_four() -> Fraction:
    """Return the rational in the repository-parameter ratio limit.

    Since ``c=2*pi*lambda^2``, the source limit is equivalently

        lambda^8 * d_4/d_8 -> (105/4096) * pi^(-4).
    """

    return fixed_label_ratio(4, 8) / 2**4


def repo_d8_over_d6_limit_pi_squared() -> Fraction:
    """Return the rational multiplying ``pi^2`` in the ``d_8/d_6`` limit.

    From the admitted fixed-index equivalence and ``c=2*pi*lambda^2``,

        lambda^(-4) * d_8/d_6 -> (32/7) * pi^2.

    Only the exact rational is returned.  This remains a qualitative limit;
    it does not manufacture an effective finite-``lambda`` threshold.
    """

    return 2**2 * fixed_label_ratio(8, 6)


def repo_d4_over_d6_limit_pi_minus_two() -> Fraction:
    """Return the rational multiplying ``pi^-2`` in the ``d_4/d_6`` limit.

    The repository normalization gives

        lambda^4 * d_4/d_6 -> (15/128) * pi^(-2).

    As above, this is exact asymptotic algebra, not a finite formula bound.
    """

    return fixed_label_ratio(4, 6) / 2**2


def repo_d0_over_d4_limit_pi_minus_four() -> Fraction:
    """Return the rational in ``lambda^8*d_0/d_4`` before ``pi^-4``.

    The qualitative fixed-index source formula gives

        lambda^8 * d_0/d_4 -> (3/8192) * pi^(-4).
    """

    return fixed_label_ratio(0, 4) / 2**4


def repo_d6_over_d4_limit_pi_squared() -> Fraction:
    """Return the rational in ``lambda^-4*d_6/d_4`` before ``pi^2``.

    In repository variables,

        lambda^(-4) * d_6/d_4 -> (128/15) * pi^2.
    """

    return 2**2 * fixed_label_ratio(6, 4)


def _require_equal(actual: Any, expected: Any, name: str) -> None:
    if actual != expected:
        raise SourceLockError(f"locked {name} differs from the admitted value")


def validate_payload(payload: dict[str, Any], repository_root: Path) -> None:
    """Validate a decoded lock and the source PDF under ``repository_root``."""

    _require_equal(payload.get("lock_version"), 1, "version")
    _require_equal(payload.get("lock_status"), LOCK_STATUS, "status")
    _require_equal(payload.get("terminal_state"), "P0_INVALIDATED", "terminal state")

    source = payload.get("binding_source")
    if not isinstance(source, dict):
        raise SourceLockError("binding_source is missing")
    _require_equal(source.get("id"), SOURCE_ID, "source id")
    _require_equal(source.get("doi"), SOURCE_DOI, "source DOI")
    _require_equal(source.get("lawful_scan_url"), SOURCE_SCAN_URL, "source URL")
    _require_equal(source.get("vendored_path"), SOURCE_PATH, "source path")
    _require_equal(source.get("vendored_sha256"), SOURCE_SHA256, "source hash")
    _require_equal(source.get("pdf_pages"), 50, "source page count")

    relative = Path(SOURCE_PATH)
    if relative.is_absolute() or ".." in relative.parts:
        raise SourceLockError("vendored source path escapes the repository")
    source_bytes = (repository_root / relative).read_bytes()
    digest = hashlib.sha256(source_bytes).hexdigest()
    _require_equal(digest, SOURCE_SHA256, "vendored PDF bytes")

    _require_equal(payload.get("source_equation_map"), EQUATION_MAP, "equation map")

    convention = payload.get("convention_map")
    if not isinstance(convention, dict):
        raise SourceLockError("convention_map is missing")
    _require_equal(convention.get("source_parameter"), C_MAP, "c normalization")
    _require_equal(
        convention.get("concentration_eigenvalue"),
        CONCENTRATION_MAP,
        "finite-Fourier/concentration square",
    )
    _require_equal(convention.get("even_label_map"), EVEN_LABEL_MAP, "even labels")
    _require_equal(convention.get("odd_label_map"), ODD_LABEL_MAP, "odd labels")

    formulas = payload.get("locked_formulas")
    if not isinstance(formulas, dict):
        raise SourceLockError("locked_formulas is missing")
    _require_equal(formulas.get("source_equation_93"), SOURCE_EQ_93, "equation (93)")
    _require_equal(
        formulas.get("ordinary_fixed_index"),
        ORDINARY_ASYMPTOTIC,
        "ordinary fixed-index asymptotic",
    )
    _require_equal(
        formulas.get("label_4"),
        "d_4~(2048/3)*sqrt(pi)*c^(9/2)*exp(-2*c)",
        "label-4 coefficient",
    )
    _require_equal(
        formulas.get("label_8"),
        "d_8~(524288/315)*sqrt(pi)*c^(17/2)*exp(-2*c)",
        "label-8 coefficient",
    )
    _require_equal(formulas.get("ratio_limit"), RATIO_LIMIT, "ratio limit")
    _require_equal(
        formulas.get("eventual_ratio_bound"), EVENTUAL_RATIO, "eventual ratio"
    )
    _require_equal(
        formulas.get("eventual_label_8_floor"), EVENTUAL_FLOOR, "eventual floor"
    )

    if ordinary_coefficient_sqrt_pi(4) != Fraction(2048, 3):
        raise SourceLockError("independent label-4 constant reconstruction failed")
    if ordinary_coefficient_sqrt_pi(8) != Fraction(524288, 315):
        raise SourceLockError("independent label-8 constant reconstruction failed")
    if fixed_label_ratio(4, 8) != Fraction(105, 256):
        raise SourceLockError("independent ratio reconstruction failed")
    if repo_ratio_limit_pi_minus_four() != Fraction(105, 4096):
        raise SourceLockError("independent repository-parameter ratio failed")

    boundary = payload.get("admission_boundary")
    if not isinstance(boundary, dict):
        raise SourceLockError("admission_boundary is missing")
    required = {
        "qualitative_fixed_index_equivalence": True,
        "qualitative_eventual_ratio_and_floor": True,
        "effective_threshold_c": None,
        "finite_formula_bound": False,
        "uniformity_for_growing_index": False,
        "signed_weil_floor": False,
        "equation_5_2": False,
        "locally_uniform_determinant_convergence": False,
        "global_weil_positivity": False,
        "zeta_zero_input": False,
    }
    for name, expected in required.items():
        _require_equal(boundary.get(name), expected, f"claim boundary {name}")


def load_and_validate(
    lock_path: Path, repository_root: Path | None = None
) -> dict[str, Any]:
    """Load the JSON lock, validate all pinned fields, and return its payload."""

    lock_path = Path(lock_path)
    root = lock_path.parent if repository_root is None else Path(repository_root)
    payload = json.loads(lock_path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise SourceLockError("source lock must decode to a JSON object")
    validate_payload(payload, root)
    return payload
