#!/usr/bin/env python3
"""Replay the core research checks in isolation against the imported evidence.

Decimal strings and table hashes must match exactly. Floating diagnostics allow
1e-12 absolute/relative variation across libm versions; their own assertions
also run. Only the certificate's elapsed_seconds field is excluded.
"""
import hashlib
import json
import math
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from time import monotonic

ROOT = Path(__file__).resolve().parent
COMMANDS = (
    ("check_interval_engine.py",),
    ("verify_reserve.py", "--limit", "1000000"),
    ("analyze_tail_budget.py",),
    ("window_audit.py",),
    ("block_audit.py",),
    ("prime_only_audit.py",),
    ("mobius_centering_probe.py",),
    ("check_mobius_interval.py",),
    ("mobius_interval_audit.py",),
)
SNAPSHOTS = (
    "certificate/certificate.json", "tail_budget.json", "window_audit.json",
    "block_audit.json", "prime_only_audit.json", "mobius_centering_probe.json",
    "mobius_interval_audit.json",
)


def compare(expected, actual, path):
    if type(expected) is not type(actual):
        raise AssertionError(f"Type mismatch at {path}")
    if isinstance(expected, dict):
        if expected.keys() != actual.keys():
            raise AssertionError(f"Key mismatch at {path}")
        for key in expected:
            compare(expected[key], actual[key], f"{path}.{key}")
    elif isinstance(expected, list):
        if len(expected) != len(actual):
            raise AssertionError(f"Length mismatch at {path}")
        for i, (left, right) in enumerate(zip(expected, actual)):
            compare(left, right, f"{path}[{i}]")
    elif isinstance(expected, float):
        if not math.isclose(expected, actual, rel_tol=1e-12, abs_tol=1e-12):
            raise AssertionError(f"Floating mismatch at {path}: {expected} != {actual}")
    elif expected != actual:
        raise AssertionError(f"Mismatch at {path}: {expected!r} != {actual!r}")


def main():
    started = monotonic()
    env = os.environ.copy()
    env.pop("PYTHONOPTIMIZE", None)
    with tempfile.TemporaryDirectory(prefix="vortex-reserve-") as directory:
        work = Path(directory)
        for source in ROOT.glob("*.py"):
            if source.name != Path(__file__).name:
                shutil.copy2(source, work / source.name)
        for command in COMMANDS:
            print(f"Running {' '.join(command)}", flush=True)
            result = subprocess.run(
                [sys.executable, "-B", *command], cwd=work, env=env,
                text=True, capture_output=True,
            )
            if result.returncode:
                print(result.stdout, end="")
                print(result.stderr, end="", file=sys.stderr)
                raise RuntimeError(f"Failed: {' '.join(command)}")
            print(f"PASS {command[0]}", flush=True)
        for name in SNAPSHOTS:
            expected = json.loads((ROOT / name).read_text())
            actual = json.loads((work / name).read_text())
            if name == "certificate/certificate.json":
                expected.pop("elapsed_seconds")
                actual.pop("elapsed_seconds")
            compare(expected, actual, name)
            print(f"MATCH {name}", flush=True)
        manifest = {}
        for line in (ROOT / "provenance/source-manifest.sha256").read_text().splitlines():
            digest, name = line.split(maxsplit=1)
            manifest[name] = digest
        for name in ("certificate/reserve_leaves.csv", "window_values.csv"):
            actual = hashlib.sha256((work / name).read_bytes()).hexdigest()
            if actual != manifest[name]:
                raise AssertionError(f"SHA-256 mismatch: {name}")
            print(f"HASH MATCH {name}", flush=True)
    print(f"PASS: {len(COMMANDS)} core checks, {len(SNAPSHOTS)} snapshots, "
          f"2 table hashes; {monotonic()-started:.1f}s")
    print("Finite certificates and diagnostics only; no infinite bound or RH proof.")


if __name__ == "__main__":
    main()
