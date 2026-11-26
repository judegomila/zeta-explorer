"""Bounded-precision, fail-closed finite Gram certification."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping, Sequence

from flint import acb, acb_mat, arb, ctx, fmpq

from .errors import MatrixValidationError, NonFiniteError, ShearGramError
from .exact import ExactInputError, canonical_rational, exact_complex, parse_rational
from .gram import build_gram, is_exactly_hermitian

CERTIFIED_POSITIVE_FINITE_GRAM = "CERTIFIED-POSITIVE-FINITE-GRAM"
CERTIFIED_NEGATIVE_WITNESS = "CERTIFIED-NEGATIVE-WITNESS"
INCONCLUSIVE = "INCONCLUSIVE"

CASE_SCHEMA = "debranges-gram-case/v1"
CERTIFICATE_SCHEMA = "debranges-gram-certificate/v1"
EIGEN_ALGORITHM = "acb_mat.eig:rump"


@dataclass(frozen=True)
class CertifierConfig:
    """Resource bounds and, optionally, an explicit precision ladder."""

    precision_bits: tuple[int, ...] | None = None
    min_precision_bits: int = 64
    max_precision_bits: int = 4096
    max_precision_steps: int = 8
    max_nodes: int = 64
    default_precision_bits: tuple[int, ...] = (128, 256, 512, 1024)


@dataclass(frozen=True)
class ParsedNode:
    real: fmpq
    imag: fmpq

    def canonical(self) -> dict[str, str]:
        return {
            "re": canonical_rational(self.real),
            "im": canonical_rational(self.imag),
        }


@dataclass(frozen=True)
class ThetaCrosscheckRequest:
    enabled: bool
    cutoff_u: fmpq | None = None
    theta_terms: int | None = None

    def canonical(self) -> dict[str, Any]:
        result: dict[str, Any] = {"enabled": self.enabled}
        if self.enabled:
            assert self.cutoff_u is not None and self.theta_terms is not None
            result["cutoff_u"] = canonical_rational(self.cutoff_u)
            result["theta_terms"] = self.theta_terms
        return result


@dataclass(frozen=True)
class ParsedCase:
    identifier: str
    a: fmpq
    nodes: tuple[ParsedNode, ...]
    precision_bits: tuple[int, ...]
    theta_crosscheck: ThetaCrosscheckRequest

    def canonical(self) -> dict[str, Any]:
        return {
            "schemaVersion": CASE_SCHEMA,
            "id": self.identifier,
            "a": canonical_rational(self.a),
            "nodes": [node.canonical() for node in self.nodes],
            "precision_bits": list(self.precision_bits),
            "theta_crosscheck": self.theta_crosscheck.canonical(),
        }

    def acb_values(self) -> tuple[acb, list[acb]]:
        return (
            exact_complex(self.a),
            [exact_complex(node.real, node.imag) for node in self.nodes],
        )


@dataclass(frozen=True)
class Classification:
    """A three-way verdict and the ball data used to obtain it."""

    status: str
    reason: str
    finite_gram: bool
    precision_bits: int
    rho: arb | None = None
    midpoint_eigenvalues: tuple[acb, ...] = ()
    margins: tuple[arb, ...] = ()
    witness_index: int | None = None

    @property
    def finiteGramOnly(self) -> bool:  # JSON-compatible honesty spelling
        return True

    @property
    def rhClaim(self) -> bool:
        return False

    def __getitem__(self, key: str) -> Any:
        aliases = {
            "finiteGram": self.finite_gram,
            "finiteGramOnly": True,
            "rhClaim": False,
            "midpointEigenvalues": self.midpoint_eigenvalues,
            "precisionBits": self.precision_bits,
            "witnessIndex": self.witness_index,
        }
        if key in aliases:
            return aliases[key]
        return getattr(self, key)


def _require_exact_keys(
    value: Mapping[str, Any], allowed: set[str], required: set[str], name: str
) -> None:
    keys = set(value)
    missing = required - keys
    extra = keys - allowed
    if missing:
        raise ExactInputError(f"{name} is missing keys: {', '.join(sorted(missing))}")
    if extra:
        raise ExactInputError(f"{name} has unknown keys: {', '.join(sorted(extra))}")


def _validate_precision_ladder(
    raw: object, config: CertifierConfig, *, name: str = "precision_bits"
) -> tuple[int, ...]:
    if not isinstance(raw, (list, tuple)) or not raw:
        raise ExactInputError(f"{name} must be a nonempty list of integer bit counts")
    if len(raw) > config.max_precision_steps:
        raise ExactInputError(f"{name} exceeds the bounded ladder length")
    ladder: list[int] = []
    for index, bits in enumerate(raw):
        if type(bits) is not int:
            raise ExactInputError(f"{name}[{index}] must be an integer")
        if bits < config.min_precision_bits or bits > config.max_precision_bits:
            raise ExactInputError(f"{name}[{index}] is outside configured bounds")
        ladder.append(bits)
    if ladder != sorted(set(ladder)):
        raise ExactInputError(f"{name} must be strictly increasing without duplicates")
    return tuple(ladder)


def _parse_theta_crosscheck(raw: object) -> ThetaCrosscheckRequest:
    if raw is None:
        return ThetaCrosscheckRequest(False)
    if not isinstance(raw, Mapping):
        raise ExactInputError("theta_crosscheck must be an object")
    if raw.get("enabled") is False:
        _require_exact_keys(raw, {"enabled"}, {"enabled"}, "theta_crosscheck")
        return ThetaCrosscheckRequest(False)
    _require_exact_keys(
        raw,
        {"enabled", "cutoff_u", "theta_terms"},
        {"enabled", "cutoff_u", "theta_terms"},
        "theta_crosscheck",
    )
    if raw["enabled"] is not True:
        raise ExactInputError("theta_crosscheck.enabled must be boolean")
    cutoff = parse_rational(raw["cutoff_u"], name="theta_crosscheck.cutoff_u")
    if cutoff <= 0 or cutoff > 32:
        raise ExactInputError(
            "theta_crosscheck.cutoff_u must be an exact value in (0,32]"
        )
    terms = raw["theta_terms"]
    if type(terms) is not int or terms <= 0 or terms > 4096:
        raise ExactInputError("theta_crosscheck.theta_terms is outside safety bounds")
    return ThetaCrosscheckRequest(True, cutoff, terms)


def parse_case(
    spec: Mapping[str, Any], config: CertifierConfig | None = None
) -> ParsedCase:
    """Validate and normalize a case without performing numerical work."""

    config = config or CertifierConfig()
    if not isinstance(spec, Mapping):
        raise ExactInputError("case must be a JSON object")
    _require_exact_keys(
        spec,
        {
            "schemaVersion",
            "id",
            "a",
            "nodes",
            "precision_bits",
            "theta_crosscheck",
        },
        {"a", "nodes"},
        "case",
    )
    if spec.get("schemaVersion", CASE_SCHEMA) != CASE_SCHEMA:
        raise ExactInputError(f"schemaVersion must equal {CASE_SCHEMA!r}")
    identifier = spec.get("id", "unnamed-case")
    if type(identifier) is not str or not identifier or len(identifier) > 200:
        raise ExactInputError("id must be a nonempty bounded string")

    a = parse_rational(spec["a"], name="a")
    if a <= 0:
        raise ExactInputError("a must be strictly positive")

    raw_nodes = spec["nodes"]
    if not isinstance(raw_nodes, list) or not raw_nodes:
        raise ExactInputError("nodes must be a nonempty list")
    if len(raw_nodes) > config.max_nodes:
        raise ExactInputError("nodes exceeds the configured finite-matrix bound")
    nodes: list[ParsedNode] = []
    for index, raw_node in enumerate(raw_nodes):
        if not isinstance(raw_node, Mapping):
            raise ExactInputError(f"nodes[{index}] must be an object")
        _require_exact_keys(
            raw_node, {"re", "im"}, {"re", "im"}, f"nodes[{index}]"
        )
        real = parse_rational(raw_node["re"], name=f"nodes[{index}].re")
        imag = parse_rational(raw_node["im"], name=f"nodes[{index}].im")
        if imag <= 0:
            raise ExactInputError(f"nodes[{index}].im must be strictly positive")
        nodes.append(ParsedNode(real, imag))

    if config.precision_bits is not None:
        ladder_raw: Sequence[int] = config.precision_bits
    else:
        ladder_raw = spec.get("precision_bits", config.default_precision_bits)
    ladder = _validate_precision_ladder(ladder_raw, config)
    crosscheck = _parse_theta_crosscheck(spec.get("theta_crosscheck"))
    return ParsedCase(identifier, a, tuple(nodes), ladder, crosscheck)


def validate_case(
    spec: Mapping[str, Any], config: CertifierConfig | None = None
) -> dict[str, Any]:
    """Return the unique canonical input object for a valid case."""

    return parse_case(spec, config).canonical()


def _all_entries_finite(matrix: acb_mat) -> bool:
    return all(
        matrix[row, column].is_finite()
        for row in range(matrix.nrows())
        for column in range(matrix.ncols())
    )


def _midpoint_and_rho(matrix: acb_mat) -> tuple[acb_mat, arb]:
    size = matrix.nrows()
    midpoint = acb_mat(size, size)
    row_sums = [arb(0) for _ in range(size)]
    for row in range(size):
        for column in range(row, size):
            entry = matrix[row, column]
            mid = entry.mid()
            if row == column:
                mid = acb(mid.real, 0)
            midpoint[row, column] = mid
            if row != column:
                midpoint[column, row] = mid.conjugate(exact=True)

            radius = entry.rad()
            if not radius.is_finite():
                raise NonFiniteError(f"gram.radius[{row},{column}]")
            row_sums[row] += radius
            if column != row:
                row_sums[column] += radius

    rho = arb(0)
    for row_sum in row_sums:
        if not row_sum.is_finite():
            raise NonFiniteError("gram.row_radius_sum")
        rho = rho.max(row_sum)
    if not rho.is_finite():
        raise NonFiniteError("gram.rho")
    return midpoint, rho


def classify_hermitian_ball_matrix(
    matrix: acb_mat, precision_bits: int | None = None
) -> Classification:
    """Classify a finite Hermitian ball matrix using a Weyl perturbation.

    Let ``M`` be the exactly Hermitian midpoint matrix and let
    ``rho=max_i sum_j rad(G_ij)``.  Exact Hermitian mirroring makes this a
    certified spectral-norm bound for the true Hermitian matrix's displacement
    from ``M``.  Rump-certified eigenvalue balls for ``M`` then yield:

    * positive when every ``lambda(M)-rho`` is certainly positive;
    * negative when one ``lambda(M)+rho`` is certainly negative;
    * inconclusive otherwise.
    """

    bits = int(ctx.prec if precision_bits is None else precision_bits)
    if not isinstance(matrix, acb_mat):
        return Classification(INCONCLUSIVE, "not-an-acb-matrix", False, bits)
    if matrix.nrows() == 0 or matrix.nrows() != matrix.ncols():
        return Classification(INCONCLUSIVE, "matrix-not-nonempty-square", False, bits)
    if not _all_entries_finite(matrix):
        return Classification(INCONCLUSIVE, "non-finite-gram-entry", False, bits)
    if not is_exactly_hermitian(matrix):
        return Classification(INCONCLUSIVE, "matrix-not-exactly-hermitian", False, bits)

    try:
        midpoint, rho = _midpoint_and_rho(matrix)
        eigenvalues_raw = midpoint.eig(algorithm="rump")
    except Exception as error:  # every solver failure must become INCONCLUSIVE
        return Classification(
            INCONCLUSIVE,
            f"rump-eigensolver-failed:{type(error).__name__}",
            True,
            bits,
        )

    eigenvalues = tuple(eigenvalues_raw)
    if len(eigenvalues) != matrix.nrows() or not all(
        value.is_finite() for value in eigenvalues
    ):
        return Classification(
            INCONCLUSIVE,
            "non-finite-or-incomplete-rump-spectrum",
            True,
            bits,
            rho,
            eigenvalues,
        )

    positive_margins = tuple(value.real - rho for value in eigenvalues)
    if all(margin.is_finite() and margin > 0 for margin in positive_margins):
        return Classification(
            CERTIFIED_POSITIVE_FINITE_GRAM,
            "all-rump-midpoint-eigenvalues-exceed-rho",
            True,
            bits,
            rho,
            eigenvalues,
            positive_margins,
        )

    negative_margins = tuple(value.real + rho for value in eigenvalues)
    for index, margin in enumerate(negative_margins):
        if margin.is_finite() and margin < 0:
            return Classification(
                CERTIFIED_NEGATIVE_WITNESS,
                "a-rump-midpoint-eigenvalue-plus-rho-is-negative",
                True,
                bits,
                rho,
                eigenvalues,
                negative_margins,
                index,
            )

    return Classification(
        INCONCLUSIVE,
        "eigenvalue-balls-and-rho-do-not-separate-zero",
        True,
        bits,
        rho,
        eigenvalues,
        positive_margins,
    )


def _arb_record(value: arb, precision_bits: int) -> dict[str, str]:
    digits = max(25, int(precision_bits * 0.30103) + 12)
    return {
        "ball": value.str(digits, radius=True, more=True),
        "lowerEnclosure": value.lower().str(digits, radius=True, more=True),
        "upperEnclosure": value.upper().str(digits, radius=True, more=True),
    }


def _acb_record(value: acb, precision_bits: int) -> dict[str, Any]:
    return {
        "real": _arb_record(value.real, precision_bits),
        "imag": _arb_record(value.imag, precision_bits),
    }


def _matrix_record(matrix: acb_mat, precision_bits: int) -> dict[str, Any]:
    enclosure: dict[str, Any] = {
        "dimension": matrix.nrows(),
        "entryOrder": "row-major",
        "entries": [
            [
                _acb_record(matrix[row, column], precision_bits)
                for column in range(matrix.ncols())
            ]
            for row in range(matrix.nrows())
        ],
    }
    from .certificate import sha256_object

    enclosure["sha256"] = sha256_object(enclosure)
    return enclosure


def _classification_record(result: Classification) -> dict[str, Any]:
    record: dict[str, Any] = {
        "precisionBits": result.precision_bits,
        "status": result.status,
        "reason": result.reason,
        "finiteGram": result.finite_gram,
        "finiteGramOnly": True,
        "rhClaim": False,
        "eigenAlgorithm": EIGEN_ALGORITHM,
    }
    if result.rho is not None:
        record["rho"] = _arb_record(result.rho, result.precision_bits)
    if result.midpoint_eigenvalues:
        record["midpointEigenvalues"] = [
            _acb_record(value, result.precision_bits)
            for value in result.midpoint_eigenvalues
        ]
    if result.margins:
        record["weylMargins"] = [
            _arb_record(value, result.precision_bits) for value in result.margins
        ]
    if result.witness_index is not None:
        record["negativeWitness"] = {
            "midpointEigenvalueIndex": result.witness_index,
            "criterion": "lambda_upper(M)+rho_upper<0",
        }
    return record


def _theta_scaled_gram(
    nodes: Sequence[acb], components: Sequence[Any]
) -> acb_mat:
    r"""Build the cancellation-preserving theta diagnostic ``K_a/a``.

    With ``A=A_a`` and ``C=B_a/a``, the exact identity for ``a>0`` is

    .. math::
       K_a(w,z)/a =
       \frac{\overline{C_a(w)}A_a(z)-\overline{A_a(w)}C_a(z)}
       {\pi(\overline w-z)}.

    This matrix is deliberately evidence-only in the v1 certificate.  It is
    never substituted for the completed-Xi Gram matrix used by the top-level
    three-way verdict.
    """

    node_list = list(nodes)
    component_list = list(components)
    if not node_list or len(node_list) != len(component_list):
        raise MatrixValidationError(
            "theta scaled Gram requires one component enclosure per node"
        )
    matrix = acb_mat(len(node_list), len(node_list))
    for row in range(len(node_list)):
        for column in range(row, len(node_list)):
            w = node_list[row]
            z = node_list[column]
            A_w = component_list[row].A
            C_w = component_list[row].B_over_a
            A_z = component_list[column].A
            C_z = component_list[column].B_over_a
            values = (w, z, A_w, C_w, A_z, C_z)
            if not all(isinstance(value, acb) and value.is_finite() for value in values):
                raise NonFiniteError(
                    f"theta.scaled_gram.input[{row},{column}]"
                )
            numerator = C_w.conjugate(exact=True) * A_z - A_w.conjugate(
                exact=True
            ) * C_z
            denominator = acb.pi() * (w.conjugate(exact=True) - z)
            if not numerator.is_finite() or not denominator.is_finite():
                raise NonFiniteError(
                    f"theta.scaled_gram.arithmetic[{row},{column}]"
                )
            if denominator.contains(0):
                raise MatrixValidationError(
                    f"theta scaled Gram denominator contains zero at {row},{column}"
                )
            value = numerator / denominator
            if not value.is_finite():
                raise NonFiniteError(
                    f"theta.scaled_gram.result[{row},{column}]"
                )
            if row == column:
                if not value.imag.contains(0):
                    raise MatrixValidationError(
                        "theta scaled Gram diagonal enclosure does not contain a "
                        f"real value at {row}"
                    )
                value = acb(value.real, 0)
            matrix[row, column] = value
            if column != row:
                matrix[column, row] = value.conjugate(exact=True)
    return matrix


def _theta_crosscheck_record(parsed: ParsedCase, precision_bits: int) -> dict[str, Any]:
    """Run and serialize the optional verdict-neutral theta audit."""

    request = parsed.theta_crosscheck
    record: dict[str, Any] = {
        "requested": request.enabled,
        "performed": False,
        "usedForVerdict": False,
        "finiteGramOnly": True,
        "rhClaim": False,
        "rhSolved": False,
        "claimComplete": False,
    }
    if not request.enabled:
        record["reason"] = "theta-crosscheck-not-requested"
        return record

    assert request.cutoff_u is not None and request.theta_terms is not None
    record.update(
        {
            "selectedPrecisionBits": precision_bits,
            "parameters": {
                "cutoffU": canonical_rational(request.cutoff_u),
                "thetaTerms": request.theta_terms,
            },
        }
    )

    from .theta import theta_completed_xi_crosscheck

    checks = []
    components = []
    with ctx.workprec(precision_bits):
        _, acb_nodes = parsed.acb_values()
        for index, node in enumerate(parsed.nodes):
            try:
                result = theta_completed_xi_crosscheck(
                    node.real,
                    node.imag,
                    parsed.a,
                    request.cutoff_u,
                    request.theta_terms,
                )
                node_record = result.as_record(precision_bits)
                node_record["nodeIndex"] = index
                node_record["claimComplete"] = False
                checks.append(node_record)
                components.append(result.components)
            except Exception as error:
                checks.append(
                    {
                        "nodeIndex": index,
                        "performed": False,
                        "overlap": False,
                        "EOverlap": False,
                        "EsharpOverlap": False,
                        "reason": f"theta-crosscheck-failed:{type(error).__name__}",
                        "usedForVerdict": False,
                        "finitePointwiseOnly": True,
                        "rhClaim": False,
                        "rhSolved": False,
                        "claimComplete": False,
                    }
                )
                components.append(None)

        all_executed = all(check.get("performed") is True for check in checks)
        all_overlaps = all(check.get("overlap") is True for check in checks)
        # ``performed`` reports execution only.  Whether that completed check
        # passed is kept separately in ``allOverlaps`` so a genuine, fully
        # executed non-overlap can never be mislabeled as "not performed".
        record["performed"] = all_executed
        record["allNodeEvaluationsCompleted"] = all_executed
        record["allOverlaps"] = all_overlaps
        record["nodeChecks"] = checks
        if not all_executed:
            record["reason"] = "theta-crosscheck-incomplete"
        elif all_overlaps:
            record["reason"] = (
                "all-theta-and-completed-xi-enclosures-overlap"
            )
        else:
            record["reason"] = (
                "theta-crosscheck-completed-with-nonoverlap"
            )

        diagnostic: dict[str, Any] = {
            "label": "EVIDENCE-ONLY-THETA-SCALED-GRAM",
            "formula": (
                "K_a(w,z)/a=(conj(C_a(w))*A_a(z)-"
                "conj(A_a(w))*C_a(z))/(pi*(conj(w)-z))"
            ),
            "domain": "a>0 and the listed strict-upper-half-plane nodes",
            "performed": False,
            "usedForVerdict": False,
            "finiteGramOnly": True,
            "rhClaim": False,
            "rhSolved": False,
            "claimComplete": False,
        }
        components_available = all(
            component is not None for component in components
        )
        if all_executed and all_overlaps and components_available:
            try:
                scaled_gram = _theta_scaled_gram(acb_nodes, components)
                classification = classify_hermitian_ball_matrix(
                    scaled_gram, precision_bits
                )
                diagnostic["performed"] = True
                diagnostic["classification"] = _classification_record(
                    classification
                )
                diagnostic["gramEnclosure"] = _matrix_record(
                    scaled_gram, precision_bits
                )
            except Exception as error:
                diagnostic["reason"] = (
                    f"theta-scaled-gram-failed:{type(error).__name__}"
                )
        elif all_executed and not all_overlaps:
            diagnostic["reason"] = (
                "theta-crosscheck-nonoverlap-blocks-scaled-diagnostic"
            )
        elif not components_available:
            diagnostic["reason"] = "theta-components-unavailable"
        elif not all_executed:
            diagnostic["reason"] = (
                "theta-crosscheck-incomplete-blocks-scaled-diagnostic"
            )
        record["scaledGramDiagnostic"] = diagnostic
    return record


def certify_spec(
    spec: Mapping[str, Any], config: CertifierConfig | None = None
) -> dict[str, Any]:
    """Run the bounded precision ladder and return a canonicalizable payload."""

    parsed = parse_case(spec, config)
    attempts: list[dict[str, Any]] = []
    final_status = INCONCLUSIVE
    selected_precision: int | None = None

    for bits in parsed.precision_bits:
        gram_record: dict[str, Any] | None = None
        try:
            with ctx.workprec(bits):
                a, nodes = parsed.acb_values()
                gram = build_gram(a, nodes)
                result = classify_hermitian_ball_matrix(gram, bits)
                gram_record = _matrix_record(gram, bits)
        except Exception as error:  # validated inputs; every backend failure is unresolved
            result = Classification(
                INCONCLUSIVE,
                f"evaluation-failed:{type(error).__name__}",
                False,
                bits,
            )
        attempt = _classification_record(result)
        if gram_record is not None:
            attempt["gramEnclosure"] = gram_record
        attempts.append(attempt)
        final_status = result.status
        selected_precision = bits
        if result.status != INCONCLUSIVE:
            break

    assert selected_precision is not None
    theta_crosscheck = _theta_crosscheck_record(parsed, selected_precision)

    payload = {
        "schemaVersion": CERTIFICATE_SCHEMA,
        "input": parsed.canonical(),
        "status": final_status,
        "selectedPrecisionBits": selected_precision,
        "finiteGramOnly": True,
        "rhClaim": False,
        "rhSolved": False,
        "claimComplete": False,
        "scope": (
            "Only the finite sampled Gram matrix at the listed nodes is classified; "
            "this is not a proof or disproof of the Riemann hypothesis."
        ),
        "method": {
            "zetaDeflated": "zeta_deflated(s)=zeta(s)-1/(s-1)",
            "xi": (
                "xi(s)=pi^(-s/2)*Gamma(1+s/2)*"
                "(1+(s-1)*zeta_deflated(s)); reflect s->1-s when "
                "Re(s)<1/2 is certain"
            ),
            "Xi": "Xi(t)=xi(1/2+i*t)",
            "E": "E_a(z)=Xi(z+i*a)",
            "Esharp": "E_a#(z)=Xi(z-i*a)",
            "kernel": (
                "(conj(E(w))*E(z)-conj(E#(w))*E#(z))"
                "/(2*pi*i*(conj(w)-z))"
            ),
            "matrix": "upper triangle evaluated; lower triangle mirrored exactly",
            "perturbation": "rho=max_i sum_j rad(G_ij)",
            "eigenAlgorithm": EIGEN_ALGORITHM,
        },
        "thetaCrosscheck": theta_crosscheck,
        "attempts": attempts,
    }
    # Local import avoids a module cycle: certificate verification calls back
    # into this function to recompute the proof from the canonical input.
    from .certificate import finalize_certificate

    return finalize_certificate(payload)
