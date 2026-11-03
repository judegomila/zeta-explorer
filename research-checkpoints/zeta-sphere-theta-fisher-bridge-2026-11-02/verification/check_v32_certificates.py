#!/usr/bin/env python3
"""Dependency-light checks for the curated V32 continuation.

The large interval integrations are deliberately not rerun here. This checker
replays portable exact arithmetic, validates mirrors and checksum manifests,
and checks the frozen continuum-certificate summaries and their scope.
"""

from __future__ import annotations

from decimal import Decimal
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[1]
V31 = ROOT / "evidence" / "v31-continuation"
EVIDENCE = ROOT / "evidence" / "v32-continuation"
DYADIC = EVIDENCE / "divisor_cancellation_nov03"
INVERSE = EVIDENCE / "inverse_residual_audit"
INVERSE_AUTHOR = EVIDENCE / "inverse_residual_new"
MODULAR = EVIDENCE / "modular_kernel"
MODULAR_AUDIT = EVIDENCE / "modular_kernel_audit"
THETA = EVIDENCE / "theta_correlated_local_v1"
THETA_AUDIT = EVIDENCE / "theta_correlated_local_audit"
NUMBER = re.compile(r"[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fail(message: str) -> None:
    raise AssertionError(message)


def require_phrase(text: str, phrase: str, label: str) -> None:
    if " ".join(phrase.lower().split()) not in " ".join(text.lower().split()):
        fail(f"missing scope phrase {phrase!r} in {label}")


def interval_bounds(value: str) -> tuple[Decimal, Decimal]:
    """Read either ``[lo, hi]`` or Arb's ``[center +/- radius]`` text."""

    numbers = NUMBER.findall(value)
    if len(numbers) != 2:
        fail(f"unexpected interval: {value!r}")
    first, second = map(Decimal, numbers)
    return (first - second, first + second) if "+/-" in value else (first, second)


def run_python(script: Path, cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, script.name], cwd=cwd, text=True, capture_output=True, check=False
    )


def run_dyadic_replays() -> list[dict[str, object]]:
    results = []
    scripts = (
        ("author", "check_sharp_dyadic_threshold.py"),
        ("independent", "independent_threshold_check.py"),
    )
    with tempfile.TemporaryDirectory(prefix="zsv-v32-dyadic-") as temporary:
        target = Path(temporary)
        for label, name in scripts:
            shutil.copy2(DYADIC / name, target / name)
            completed = run_python(target / name, target)
            if completed.returncode != 0:
                fail(f"V32 dyadic {label} replay failed: {completed.stderr.strip()}")
            margins = [
                int(value)
                for value in re.findall(r"(?:margin|minimum):\s*(\d+)", completed.stdout)
            ]
            if margins != [11]:
                fail(f"V32 dyadic {label} replay did not retain minimum margin 11")
            if label == "independent" and completed.stdout != (
                DYADIC / "independent_threshold_result.txt"
            ).read_text():
                fail("independent dyadic replay differs from frozen output")
            results.append(
                {
                    "name": f"sharp-dyadic-{label}",
                    "returncode": completed.returncode,
                    "minimum_integer_margin": 11,
                    "temporary_copy": True,
                }
            )

    audit = (DYADIC / "SHARP_DYADIC_THRESHOLD_AUDIT.md").read_text()
    proof = (DYADIC / "SHARP_DYADIC_THRESHOLD.md").read_text()
    require_phrase(proof, "least integer T", "dyadic proof")
    require_phrase(proof, "T=107521", "dyadic proof")
    require_phrase(audit, "107520=2^10*3*5*7", "dyadic audit")
    require_phrase(audit, "Normalized a=0 even terms", "dyadic audit")
    require_phrase(audit, "No finite-core sign", "dyadic audit")
    return results


def run_inverse_residual_replays() -> list[dict[str, object]]:
    source_input = V31 / "theta_correlated_local_v1" / "degree7_regional_payment_4000.json"
    audit_input = THETA_AUDIT / "regional_metric_replay" / source_input.name
    if digest(source_input) != digest(audit_input):
        fail("inverse-residual source and independent moment inputs differ")

    with tempfile.TemporaryDirectory(prefix="zsv-v32-inverse-") as temporary:
        campaign = Path(temporary) / "campaign"
        for relative in (
            "theta_correlated_local_v1",
            "theta_correlated_local_audit/regional_metric_replay",
            "inverse_residual_new",
            "inverse_residual_audit",
        ):
            (campaign / relative).mkdir(parents=True)
        shutil.copy2(source_input, campaign / "theta_correlated_local_v1" / source_input.name)
        shutil.copy2(
            audit_input,
            campaign / "theta_correlated_local_audit/regional_metric_replay" / audit_input.name,
        )
        for source, relative in (
            (INVERSE_AUTHOR / "check_trial.py", "inverse_residual_new/check_trial.py"),
            (INVERSE / "author_check_trial.py", "inverse_residual_audit/author_check_trial.py"),
            (INVERSE / "check_exact.py", "inverse_residual_audit/check_exact.py"),
        ):
            (campaign / relative).write_text(
                source.read_text().replace(
                    "/workspace/shared/zeta_sphere_campaign", campaign.as_posix()
                )
            )

        author = run_python(
            campaign / "inverse_residual_audit/author_check_trial.py",
            campaign / "inverse_residual_audit",
        )
        if author.returncode != 0:
            fail(f"V32 inverse author replay failed: {author.stderr.strip()}")
        if author.stdout != (INVERSE / "author_replay.txt").read_text() or author.stdout != (
            INVERSE_AUTHOR / "result.txt"
        ).read_text():
            fail("V32 inverse author replay differs from frozen outputs")
        require_phrase(author.stdout, "schur lower 5028566847", "inverse author replay")

        exact = run_python(
            campaign / "inverse_residual_audit/check_exact.py",
            campaign / "inverse_residual_audit",
        )
        if exact.returncode != 0:
            fail(f"V32 inverse exact replay failed: {exact.stderr.strip()}")
        generated = json.loads(exact.stdout)
        if generated != json.loads((INVERSE / "exact_result.json").read_text()):
            fail("V32 inverse exact replay differs from frozen result")
        if generated.get("schur_lower_exact") != (
            "321828278269920397338311905333/64000000000000000000"
        ):
            fail("unexpected exact inverse-residual Schur lower bound")
        if generated.get("schur_lower_integer_floor") != 5028566847:
            fail("unexpected inverse-residual integer floor")
        if generated.get("lambda") != "2/25" or not generated.get(
            "strict_claim_gt_5028000000"
        ):
            fail("unexpected inverse-residual conditioning statement")

    if digest(INVERSE / "author_check_trial.py") != digest(INVERSE_AUTHOR / "check_trial.py"):
        fail("inverse-residual author source and retained source differ")
    audit = (INVERSE / "AUDIT.md").read_text()
    require_phrase(
        audit,
        "conditional on the previously independently certified input moment enclosures",
        "inverse audit",
    )
    require_phrase(audit, "small unweighted residual alone cannot certify", "inverse audit")
    require_phrase(audit, "not an eigenvalue, new degree, all-shift result", "inverse audit")
    return [
        {
            "name": "inverse-residual-author",
            "returncode": author.returncode,
            "frozen_output_match": True,
            "temporary_copy": True,
        },
        {
            "name": "inverse-residual-independent-exact",
            "returncode": exact.returncode,
            "frozen_summary_match": True,
            "schur_lower_integer_floor": 5028566847,
            "temporary_copy": True,
        },
    ]


def verify_internal_checksum_manifests() -> dict[str, int]:
    manifests = sorted(
        path
        for path in EVIDENCE.rglob("*")
        if path.is_file() and "SHA256" in path.name
    )
    if len(manifests) != 48:
        fail(f"expected 48 V32 internal checksum manifests, got {len(manifests)}")
    prior_hashes = {
        digest(path)
        for lane in (ROOT / "evidence").iterdir()
        if lane.is_dir() and lane != EVIDENCE
        for path in lane.rglob("*")
        if path.is_file()
    }
    entries = 0
    inherited_entries = 0
    for manifest in manifests:
        seen = set()
        for line in manifest.read_text().splitlines():
            if not line.strip():
                continue
            parts = line.split(None, 1)
            if len(parts) != 2:
                fail(f"invalid checksum row in {manifest.relative_to(EVIDENCE)}")
            expected_hash, relative = parts
            relative = relative.strip().lstrip("*")
            if relative in seen:
                fail(f"duplicate checksum path in {manifest.relative_to(EVIDENCE)}: {relative}")
            seen.add(relative)
            parsed = PurePosixPath(relative)
            local_path = manifest.parent / relative
            canonical_local = (
                not parsed.is_absolute()
                and ".." not in parsed.parts
                and str(parsed) == relative
                and local_path.is_file()
            )
            if canonical_local:
                if digest(local_path) != expected_hash:
                    fail(f"checksum mismatch: {local_path.relative_to(EVIDENCE)}")
            elif expected_hash in prior_hashes:
                # Several owned freeze manifests deliberately bind inherited v18/v31
                # dependencies that remain in their existing public evidence lanes.
                inherited_entries += 1
            else:
                fail(
                    "missing checksum dependency without a prior public hash: "
                    f"{manifest.relative_to(EVIDENCE)} -> {relative}"
                )
            entries += 1
    if entries != 400:
        fail(f"expected 400 V32 internal checksum entries, got {entries}")
    return {
        "manifests": len(manifests),
        "entries": entries,
        "inherited_public_dependencies": inherited_entries,
    }


def verify_modular_summaries() -> dict[str, object]:
    mirrors = (
        (MODULAR / "finite_moment_check.py", MODULAR_AUDIT / "finite_moment_check.py"),
        (MODULAR / "finite_moment_check.py", MODULAR_AUDIT / "finite_moment_final.py"),
        (MODULAR / "uniform_moment_check.py", MODULAR_AUDIT / "uniform_moment_check.py"),
        (MODULAR / "bessel_sign_check.py", MODULAR_AUDIT / "new_sign_checks/bessel_sign_check.py"),
        (MODULAR / "divisor_tail_check.py", MODULAR_AUDIT / "new_sign_checks/divisor_tail_check.py"),
        (MODULAR / "frequency12_check.py", MODULAR_AUDIT / "new_sign_checks/frequency12_check.py"),
        (MODULAR / "negative_slice_check.py", MODULAR_AUDIT / "new_sign_checks/negative_slice_check.py"),
    )
    for source, audit in mirrors:
        if digest(source) != digest(audit):
            fail(f"modular source/audit mirror mismatch: {source.name}")
    if (MODULAR_AUDIT / "finite_result.txt").read_bytes() != (
        MODULAR_AUDIT / "finite_final_result.txt"
    ).read_bytes():
        fail("modular finite replay outputs differ")

    finite = (MODULAR_AUDIT / "finite_final_result.txt").read_text()
    uniform = (MODULAR_AUDIT / "uniform_result.txt").read_text()
    signs = MODULAR_AUDIT / "new_sign_checks"
    bessel = (signs / "bessel_sign_check.out").read_text()
    frequency = (signs / "frequency12_check.out").read_text()
    negative = (signs / "negative_slice_check.out").read_text()
    tails = (signs / "divisor_tail_check.out").read_text()
    finite_criterion = interval_bounds(re.search(r"criterion (\[[^\]]+\])", finite).group(1))
    uniform_criterion = interval_bounds(
        re.search(r"Criterion divided by a: (\[[^\]]+\])", uniform).group(1)
    )
    bessel_interval = interval_bounds(re.search(r"enclosure: (\[[^\]]+\])", bessel).group(1))
    frequency_interval = interval_bounds(
        re.search(r"Fourier C:\n(\[[^\]]+\])", frequency).group(1)
    )
    negative_interval = interval_bounds(
        re.search(r"cross-section interval: (\[[^\]]+\])", negative).group(1)
    )
    if finite_criterion[0] <= Decimal("0.00133713258224149"):
        fail("unexpected finite modular criterion lower bound")
    if uniform_criterion[0] <= Decimal("0.000216065575352264"):
        fail("unexpected uniform modular criterion lower bound")
    if bessel_interval[1] >= 0 or negative_interval[1] >= 0 or frequency_interval[0] <= 0:
        fail("V32 modular signed-cancellation interval signs are inconsistent")

    absolute_l4 = re.search(r"L= 4 tail <= \[([^,]+), ([^\]]+)\]", tails)
    scaled_l4 = re.search(r"L= 4 tail / a <= \[([^,]+), ([^\]]+)\]", tails)
    if absolute_l4 is None or Decimal(absolute_l4.group(2)) >= Decimal("3.316e-9"):
        fail("absolute modular divisor tail exceeds frozen ceiling")
    if scaled_l4 is None or Decimal(scaled_l4.group(2)) >= Decimal("1.792e-9"):
        fail("a-scaled modular divisor tail exceeds frozen ceiling")

    audit = (MODULAR_AUDIT / "AUDIT.md").read_text()
    sign_audit = (signs / "AUDIT.md").read_text()
    require_phrase(audit, "identity is not a global sign proof", "modular audit")
    require_phrase(audit, "only its divided-by-a continuous limit is positive", "modular audit")
    require_phrase(sign_audit, "signed-piece versus positive-total examples", "modular sign audit")
    return {
        "mirrors": len(mirrors),
        "finite_criterion_lower": str(finite_criterion[0]),
        "uniform_criterion_lower": str(uniform_criterion[0]),
        "bessel_upper_negative": True,
        "slice_upper_negative": True,
        "full_frequency_lower_positive": True,
        "stored_outputs_only": True,
    }


def verify_full_shift_summaries() -> dict[str, object]:
    replay = THETA_AUDIT / "full_shift_slabs_replay"
    mirrors = (
        (THETA / "full_shift_slabs_16_4000_4000.json", replay / "full_shift_slabs_16_4000_4000.json"),
        (THETA / "full_shift_consequence.json", replay / "consequence.json"),
        (THETA / "shift_rational_basis.json", replay / "shift_rational_basis.json"),
    )
    for source, audit in mirrors:
        if digest(source) != digest(audit):
            fail(f"full-shift source/audit mirror mismatch: {source.name}")

    result = json.loads(mirrors[0][1].read_text())
    if (result.get("shift_slabs"), result.get("tail_cells"), result.get("cutoff_cells"), result.get("bits")) != (16, 4000, 4000, 192):
        fail("unexpected full-shift grid or precision")
    for parity in ("even8", "odd9"):
        block = result.get(parity, {})
        if not block.get("all_passed") or block.get("failed_slabs") != []:
            fail(f"full-shift {parity} did not retain all-pass status")
        slabs = block.get("slabs")
        if not isinstance(slabs, list) or len(slabs) != 16:
            fail(f"full-shift {parity} slab count mismatch")
        for index, slab in enumerate(slabs):
            if not slab.get("passed") or Decimal(slab["a_lo"]) != Decimal(index) / 32 or Decimal(slab["a_hi"]) != Decimal(index + 1) / 32:
                fail(f"full-shift {parity} slab {index} endpoint/pass mismatch")
            pivots = slab.get("pivot_lowers")
            if not isinstance(pivots, list) or len(pivots) != 5 or any(
                interval_bounds(value)[0] <= 0 for value in pivots
            ):
                fail(f"full-shift {parity} slab {index} pivot failure")

    consequence = json.loads(mirrors[1][1].read_text())
    for parity, lower_bound in (
        ("even8", Decimal("658509314218")),
        ("odd9", Decimal("82637820677424")),
    ):
        row = consequence[parity]
        if interval_bounds(row["uniform_monic_schur_lower"])[0] <= lower_bound:
            fail(f"full-shift {parity} monic Schur lower bound is too small")
        pivots = row.get("uniform_LDL_pivot_lowers")
        if not isinstance(pivots, list) or len(pivots) != 5 or any(
            interval_bounds(value)[0] <= 0 for value in pivots
        ):
            fail(f"full-shift {parity} consequence pivot failure")
        require_phrase(row["scope"], "LDL pivots not eigenvalues", f"{parity} scope")
        require_phrase(row["scope"], "GlobalH0 extension toalla>0", f"{parity} scope")

    basis = json.loads(mirrors[2][1].read_text())
    for parity, shift in (("even8", 0), ("odd9", 1)):
        row = basis[parity]
        coefficients = row.get("coefficients")
        if row.get("shift") != shift or not isinstance(coefficients, list) or len(coefficients) != 5:
            fail(f"unexpected rational-basis metadata for {parity}")
        for index, vector in enumerate(coefficients):
            if len(vector) != 5 or any(Decimal(vector[j]) != 0 for j in range(index)) or Decimal(vector[index]) == 0:
                fail(f"rational basis is not nonsingular upper triangular for {parity}")
        require_phrase(row["scope"], "exact interval Gram verification required", f"{parity} basis")

    compact = (THETA / "FULL_SHIFT_DEGREE9.md").read_text()
    require_phrase(compact, "not an all-degree result or RH proof", "full-shift theorem")
    require_phrase(compact, "large-a conclusion is only asserted at H=0", "full-shift theorem")

    cutoff = json.loads((THETA_AUDIT / "shift_cutoff_replay/consequence.json").read_text())
    for parity, endpoint, reserve in (
        ("even8", Decimal("0.25"), Decimal("0.5375032432940905")),
        ("odd9", Decimal("0.125"), Decimal("0.3809467133337588")),
    ):
        row = cutoff[parity]
        if Decimal(row["a_endpoint"]) != endpoint or interval_bounds(
            row["rational_basis_reserve_lower"]
        )[0] <= reserve:
            fail(f"unexpected perturbative cutoff consequence for {parity}")
        require_phrase(row["scope"], "actual normalized complete-theta block", f"{parity} cutoff scope")

    return {
        "shift_slabs": 16,
        "tail_cells": 4000,
        "cutoff_cells": 4000,
        "parity_blocks": 2,
        "all_slabs_passed": True,
        "even_monic_schur_gt": 658509314218,
        "odd_monic_schur_gt": 82637820677424,
        "large_interval_jobs_rerun_by_default": False,
    }


def main() -> int:
    result = {
        "status": "PASS",
        "dyadic_replays": run_dyadic_replays(),
        "inverse_residual_replays": run_inverse_residual_replays(),
        "internal_checksum_manifests": verify_internal_checksum_manifests(),
        "modular_signed_summaries": verify_modular_summaries(),
        "full_shift_degree9_summaries": verify_full_shift_summaries(),
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (AssertionError, OSError, ValueError, KeyError, json.JSONDecodeError) as error:
        print(json.dumps({"status": "FAIL", "error": str(error)}), file=sys.stderr)
        sys.exit(1)
