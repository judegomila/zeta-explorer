"""Canonical JSON, provenance, hashes, and independent recomputation."""

from __future__ import annotations

import copy
import hashlib
import json
import platform
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Mapping

import flint


def canonical_json_bytes(value: Any) -> bytes:
    """Serialize using the certificate's unique UTF-8 JSON representation."""

    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
        allow_nan=False,
    ).encode("utf-8")


def canonical_json_text(value: Any, *, trailing_newline: bool = False) -> str:
    text = canonical_json_bytes(value).decode("utf-8")
    return text + ("\n" if trailing_newline else "")


def sha256_object(value: Any) -> str:
    return hashlib.sha256(canonical_json_bytes(value)).hexdigest()


def runtime_provenance() -> dict[str, Any]:
    """Return deterministic arithmetic/runtime provenance (no wall-clock time)."""

    from . import __version__

    package_directory = Path(__file__).resolve().parent
    source_files = []
    for source_path in sorted(package_directory.glob("*.py"), key=lambda path: path.name):
        source_files.append(
            {
                "path": source_path.name,
                "sha256": hashlib.sha256(source_path.read_bytes()).hexdigest(),
            }
        )
    source_aggregate = sha256_object(source_files)

    return {
        "engine": "rigorous-shear-gram",
        "engineVersion": __version__,
        "pythonImplementation": platform.python_implementation(),
        "pythonVersion": platform.python_version(),
        "pythonFlintVersion": flint.__version__,
        "flintVersion": flint.__FLINT_VERSION__,
        "flintRelease": flint.__FLINT_RELEASE__,
        "arithmetic": "Arb/ACB midpoint-radius ball arithmetic",
        "eigenAlgorithm": "acb_mat.eig:rump",
        "executableMajorMinor": f"{sys.version_info.major}.{sys.version_info.minor}",
        "source": {
            "files": source_files,
            "aggregateSha256": source_aggregate,
        },
    }


def finalize_certificate(payload: Mapping[str, Any]) -> dict[str, Any]:
    """Attach provenance and the three precisely scoped SHA-256 digests.

    ``canonicalCertificateSha256`` is necessarily a self-excluding digest: it
    hashes the certificate containing the other hashes, but before the
    ``canonicalCertificateSha256`` field itself is inserted.
    """

    if not isinstance(payload, Mapping):
        raise ValueError("certificate payload must be an object")
    if not isinstance(payload.get("input"), Mapping) or not payload["input"]:
        raise ValueError("certificate payload requires a nonempty input object")
    if not isinstance(payload.get("method"), Mapping) or not payload["method"]:
        raise ValueError("certificate payload requires a nonempty method object")
    certificate = copy.deepcopy(dict(payload))
    certificate["provenance"] = runtime_provenance()
    certificate.pop("hashes", None)
    input_hash = sha256_object(certificate["input"])
    proof_hash = sha256_object(certificate)
    formula_hash = sha256_object(certificate["method"])
    source_hash = certificate["provenance"]["source"]["aggregateSha256"]
    certificate["hashes"] = {
        "inputSha256": input_hash,
        "caseSha256": input_hash,
        "formulaSha256": formula_hash,
        "sourceSha256": source_hash,
        "proofPayloadSha256": proof_hash,
    }
    certificate_hash = sha256_object(certificate)
    certificate["hashes"]["canonicalCertificateSha256"] = certificate_hash
    return certificate


def verify_hashes(certificate: Mapping[str, Any]) -> tuple[bool, str]:
    """Verify all digests without trusting any numerical assertion."""

    if not isinstance(certificate, Mapping):
        return False, "certificate-not-an-object"
    hashes = certificate.get("hashes")
    if not isinstance(hashes, Mapping):
        return False, "missing-hashes"
    expected_keys = {
        "inputSha256",
        "caseSha256",
        "formulaSha256",
        "sourceSha256",
        "proofPayloadSha256",
        "canonicalCertificateSha256",
    }
    if set(hashes) != expected_keys:
        return False, "wrong-hash-fields"
    if not all(
        type(hashes[key]) is str
        and len(hashes[key]) == 64
        and all(character in "0123456789abcdef" for character in hashes[key])
        for key in expected_keys
    ):
        return False, "malformed-hash"

    try:
        input_actual = sha256_object(certificate["input"])
    except (KeyError, TypeError, ValueError):
        return False, "missing-or-invalid-input"
    if hashes["inputSha256"] != input_actual:
        return False, "input-hash-mismatch"
    if hashes["caseSha256"] != input_actual:
        return False, "case-hash-mismatch"
    try:
        formula_actual = sha256_object(certificate["method"])
        source_actual = certificate["provenance"]["source"]["aggregateSha256"]
    except (KeyError, TypeError):
        return False, "missing-formula-or-source-provenance"
    if hashes["formulaSha256"] != formula_actual:
        return False, "formula-hash-mismatch"
    if hashes["sourceSha256"] != source_actual:
        return False, "source-hash-mismatch"

    proof_payload = copy.deepcopy(dict(certificate))
    proof_payload.pop("hashes", None)
    if hashes["proofPayloadSha256"] != sha256_object(proof_payload):
        return False, "proof-payload-hash-mismatch"

    certificate_payload = copy.deepcopy(dict(certificate))
    certificate_payload["hashes"] = dict(hashes)
    certificate_payload["hashes"].pop("canonicalCertificateSha256", None)
    if hashes["canonicalCertificateSha256"] != sha256_object(certificate_payload):
        return False, "canonical-certificate-hash-mismatch"

    attempts = certificate.get("attempts", [])
    if not isinstance(attempts, list):
        return False, "attempts-not-a-list"
    for attempt in attempts:
        if not isinstance(attempt, Mapping):
            return False, "attempt-not-an-object"
        enclosure = attempt.get("gramEnclosure")
        if enclosure is None:
            continue
        if not isinstance(enclosure, Mapping) or type(enclosure.get("sha256")) is not str:
            return False, "malformed-gram-enclosure-hash"
        enclosure_payload = copy.deepcopy(dict(enclosure))
        enclosure_hash = enclosure_payload.pop("sha256", None)
        if enclosure_hash != sha256_object(enclosure_payload):
            return False, "gram-enclosure-hash-mismatch"
    return True, "hashes-valid"


@dataclass(frozen=True)
class VerificationResult:
    valid: bool
    reason: str
    status: str | None = None
    recomputed_status: str | None = None
    canonical_certificate_sha256: str | None = None

    def as_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {
            "valid": self.valid,
            "reason": self.reason,
            "rhClaim": False,
            "rhSolved": False,
            "claimComplete": False,
        }
        if self.status is not None:
            result["status"] = self.status
        if self.recomputed_status is not None:
            result["recomputedStatus"] = self.recomputed_status
        if self.canonical_certificate_sha256 is not None:
            result["canonicalCertificateSha256"] = (
                self.canonical_certificate_sha256
            )
        return result


def verify_certificate(
    certificate: Mapping[str, Any], *, recompute: bool = True
) -> VerificationResult:
    """Check hashes/honesty flags, then rerun the ball proof by default."""

    from .certify import (
        CERTIFICATE_SCHEMA,
        CERTIFIED_NEGATIVE_WITNESS,
        CERTIFIED_POSITIVE_FINITE_GRAM,
        INCONCLUSIVE,
        certify_spec,
    )

    ok, reason = verify_hashes(certificate)
    if not ok:
        return VerificationResult(False, reason)
    digest = certificate["hashes"]["canonicalCertificateSha256"]

    if certificate.get("schemaVersion") != CERTIFICATE_SCHEMA:
        return VerificationResult(False, "wrong-certificate-schema", None, None, digest)
    if certificate.get("finiteGramOnly") is not True:
        return VerificationResult(False, "finiteGramOnly-must-be-true", None, None, digest)
    if certificate.get("rhClaim") is not False:
        return VerificationResult(False, "rhClaim-must-be-false", None, None, digest)
    if certificate.get("rhSolved") is not False:
        return VerificationResult(False, "rhSolved-must-be-false", None, None, digest)
    if certificate.get("claimComplete") is not False:
        return VerificationResult(False, "claimComplete-must-be-false", None, None, digest)

    status = certificate.get("status")
    allowed = {
        CERTIFIED_POSITIVE_FINITE_GRAM,
        CERTIFIED_NEGATIVE_WITNESS,
        INCONCLUSIVE,
    }
    if status not in allowed:
        return VerificationResult(False, "unknown-status", None, None, digest)
    if status != INCONCLUSIVE:
        attempts = certificate.get("attempts")
        if not isinstance(attempts, list) or not attempts:
            return VerificationResult(False, "decisive-certificate-has-no-attempt", status, None, digest)
        selected = [
            attempt
            for attempt in attempts
            if isinstance(attempt, Mapping)
            and attempt.get("precisionBits") == certificate.get("selectedPrecisionBits")
            and attempt.get("status") == status
        ]
        if not selected or not isinstance(selected[-1].get("gramEnclosure"), Mapping):
            return VerificationResult(False, "decisive-attempt-has-no-gram-enclosure", status, None, digest)

    provenance = certificate.get("provenance")
    if not isinstance(provenance, Mapping):
        return VerificationResult(False, "missing-provenance", status, None, digest)
    if provenance.get("pythonFlintVersion") != "0.9.0":
        return VerificationResult(
            False, "certificate-not-produced-with-python-flint-0.9.0", status, None, digest
        )
    if flint.__version__ != "0.9.0":
        return VerificationResult(
            False, "verifier-not-running-python-flint-0.9.0", status, None, digest
        )
    current_source = runtime_provenance()["source"]["aggregateSha256"]
    if provenance.get("source", {}).get("aggregateSha256") != current_source:
        return VerificationResult(
            False, "verifier-source-hash-mismatch", status, None, digest
        )

    if not recompute:
        return VerificationResult(True, "hashes-and-envelope-valid", status, None, digest)

    try:
        fresh = certify_spec(certificate["input"])
    except Exception as error:
        return VerificationResult(
            False,
            f"recomputation-failed:{type(error).__name__}",
            status,
            None,
            digest,
        )
    fresh_status = fresh.get("status")
    if fresh_status != status:
        return VerificationResult(
            False, "recomputed-status-mismatch", status, fresh_status, digest
        )
    if fresh.get("selectedPrecisionBits") != certificate.get("selectedPrecisionBits"):
        return VerificationResult(
            False, "recomputed-selected-precision-mismatch", status, fresh_status, digest
        )
    if fresh.get("hashes", {}).get("proofPayloadSha256") != certificate.get(
        "hashes", {}
    ).get("proofPayloadSha256"):
        return VerificationResult(
            False, "recomputed-proof-payload-mismatch", status, fresh_status, digest
        )
    return VerificationResult(
        True, "hashes-envelope-and-recomputation-valid", status, fresh_status, digest
    )


def _reject_duplicate_pairs(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"duplicate JSON key: {key}")
        result[key] = value
    return result


def _reject_nonfinite_json(token: str) -> None:
    raise ValueError(f"non-finite JSON token: {token}")


def loads_json_strict(text: str) -> Any:
    """Load JSON while rejecting duplicate keys and non-standard constants."""

    return json.loads(
        text,
        object_pairs_hook=_reject_duplicate_pairs,
        parse_constant=_reject_nonfinite_json,
    )
