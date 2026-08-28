"""Fail-closed error types used by the certifier."""


class ShearGramError(Exception):
    """Base class for expected, reportable certifier failures."""


class NonFiniteError(ShearGramError):
    """Raised when a required Arb/ACB enclosure is not finite."""

    def __init__(self, stage: str) -> None:
        super().__init__(f"non-finite ball at {stage}")
        self.stage = stage


class MatrixValidationError(ShearGramError):
    """Raised when a matrix is not exactly represented as Hermitian."""
