"""Command-line entry points for certification and independent verification."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Any, Sequence

from .certificate import (
    canonical_json_text,
    loads_json_strict,
    verify_certificate,
)
from .certify import CertifierConfig, certify_spec


def _read_text(path: str) -> str:
    if path == "-":
        return sys.stdin.read()
    return Path(path).read_text(encoding="utf-8")


def _write_text(path: str, text: str) -> None:
    if path == "-":
        sys.stdout.write(text)
        return
    Path(path).write_text(text, encoding="utf-8")


def _precision_ladder(text: str) -> tuple[int, ...]:
    if not text or any(character.isspace() for character in text):
        raise argparse.ArgumentTypeError("use comma-separated integer bit counts")
    try:
        values = tuple(int(item, 10) for item in text.split(","))
    except ValueError as error:
        raise argparse.ArgumentTypeError("use comma-separated integer bit counts") from error
    if any(str(value) != item for value, item in zip(values, text.split(","))):
        raise argparse.ArgumentTypeError("precision counts must use canonical integers")
    return values


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="shear-gram",
        description="Finite Xi-shear de Branges Gram ball certifier (no RH claim)",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    certify = subparsers.add_parser("certify", help="compute a canonical JSON certificate")
    certify.add_argument("case", help="case JSON file, or - for stdin")
    certify.add_argument("-o", "--output", default="-", help="output file, or - for stdout")
    certify.add_argument(
        "--precisions",
        type=_precision_ladder,
        help="bounded comma-separated ladder overriding case precision_bits",
    )

    verify = subparsers.add_parser("verify", help="verify hashes and recompute the ball proof")
    verify.add_argument("certificate", help="certificate JSON file, or - for stdin")
    verify.add_argument("-o", "--output", default="-", help="result file, or - for stdout")
    return parser


def _error(message: str) -> int:
    sys.stderr.write(f"shear-gram: {message}\n")
    return 2


def main(argv: Sequence[str] | None = None) -> int:
    args = _parser().parse_args(argv)
    try:
        document: Any = loads_json_strict(_read_text(args.case if args.command == "certify" else args.certificate))
        if args.command == "certify":
            config = (
                CertifierConfig(precision_bits=args.precisions)
                if args.precisions is not None
                else None
            )
            certificate = certify_spec(document, config)
            _write_text(args.output, canonical_json_text(certificate, trailing_newline=True))
            return 0

        result = verify_certificate(document, recompute=True)
        _write_text(args.output, canonical_json_text(result.as_dict(), trailing_newline=True))
        return 0 if result.valid else 1
    except (OSError, ValueError, TypeError, ArithmeticError) as error:
        return _error(f"{type(error).__name__}: {error}")


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
