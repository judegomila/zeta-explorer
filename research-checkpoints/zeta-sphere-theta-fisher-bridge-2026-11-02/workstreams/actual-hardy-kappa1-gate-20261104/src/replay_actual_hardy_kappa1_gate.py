#!/usr/bin/env python3
"""Replay the frozen Hardy checker across the known PR #40 whitespace cleanup.

The historical checker and receipts remain byte-for-byte unchanged.  This
wrapper constructs a temporary dependency overlay only when the shared Hardy
note has the single audited trailing-whitespace normalization made on PR #40.
"""
from __future__ import annotations

from contextlib import contextmanager
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
from types import ModuleType
from typing import Iterator


HERE = Path(__file__).resolve()
CHECKER_PATH = HERE.with_name("certify_actual_hardy_kappa1_gate.py")
HARDY_REL = (
    "workstreams/all-degree-analytic-search-next-v1/"
    "COMPLETE_ORBIT_HARDY_NEXT.md"
)
HISTORICAL_HARDY_SHA256 = (
    "ccebe64d3a1e5b864dbe3db0d5fd2a322ed462311d6ad3f03c459960fda80589"
)
PR40_HARDY_SHA256 = (
    "7adda8d65ac6ad28669dd595f6fa6d99120fd04ec33a3644ac93d613f4067fc3"
)
PR40_LINE = b" &=\\int(t-\\rho_j)^2H_j'(t)^2dt.\n"
HISTORICAL_LINE = b" &=\\int(t-\\rho_j)^2H_j'(t)^2dt." + b" " * 17 + b"\n"


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def load_checker() -> ModuleType:
    spec = importlib.util.spec_from_file_location(
        "actual_hardy_checker_replay", CHECKER_PATH
    )
    if spec is None or spec.loader is None:
        raise ImportError(CHECKER_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


@contextmanager
def frozen_checkpoint_overlay(
    checkpoint_root: Path,
) -> Iterator[tuple[Path, dict[str, object]]]:
    """Yield dependencies matching the historical checker's exact hashes."""

    checker = load_checker()
    root = checkpoint_root.resolve()
    observed_hardy = sha256(root / HARDY_REL)
    if observed_hardy == HISTORICAL_HARDY_SHA256:
        yield root, {
            "mode": "exact_live_match",
            "path": HARDY_REL,
            "historical_sha256": HISTORICAL_HARDY_SHA256,
            "live_sha256": observed_hardy,
        }
        return
    if observed_hardy != PR40_HARDY_SHA256:
        raise RuntimeError(
            f"unrecognized Hardy dependency hash: {observed_hardy}"
        )

    live = (root / HARDY_REL).read_bytes()
    if live.count(PR40_LINE) != 1:
        raise RuntimeError("PR #40 normalized line is not unique")
    reconstructed = live.replace(PR40_LINE, HISTORICAL_LINE, 1)
    reconstructed_sha = sha256_bytes(reconstructed)
    if reconstructed_sha != HISTORICAL_HARDY_SHA256:
        raise RuntimeError(
            "reconstructed Hardy dependency hash mismatch: "
            f"{reconstructed_sha} != {HISTORICAL_HARDY_SHA256}"
        )

    with tempfile.TemporaryDirectory(prefix="actual-hardy-frozen-") as temporary:
        overlay = Path(temporary)
        for relative, expected in checker.EXPECTED_SHA256.items():
            destination = overlay / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            source = root / relative
            if relative == HARDY_REL:
                destination.write_bytes(reconstructed)
                continue
            actual = sha256(source)
            if actual != expected:
                raise RuntimeError(
                    f"dependency hash mismatch for {relative}: {actual} != {expected}"
                )
            os.symlink(source, destination)
        yield overlay, {
            "mode": "known_pr40_whitespace_reconstruction",
            "path": HARDY_REL,
            "historical_sha256": HISTORICAL_HARDY_SHA256,
            "live_sha256": observed_hardy,
            "replacement_occurrences": 1,
            "inserted_ascii_spaces": 17,
            "reconstructed_sha256": reconstructed_sha,
        }


def main() -> int:
    checker = load_checker()
    args = checker.parse_args()
    with frozen_checkpoint_overlay(args.checkpoint_root) as (root, provenance):
        args.checkpoint_root = root
        try:
            payload = checker.build_receipt(args)
        except checker.BudgetExceeded as error:
            print(f"BUDGET_EXHAUSTED: {error}", file=sys.stderr)
            return 4
    checker.atomic_write_json(args.output, payload)
    print(json.dumps({
        "status": payload["status"],
        "output": str(args.output),
        "payload_sha256": payload["payload_sha256_before_self_hash"],
        "dependency_compatibility": provenance,
    }, sort_keys=True))
    return 0 if payload["status"].startswith("PASS_") else 3


if __name__ == "__main__":
    raise SystemExit(main())
