#!/usr/bin/env python3
"""Replay the complete-theta N=2 strong payment on 0<a<=1/4.

The checker binds four exact dependency commits and their artifact blobs,
reruns every dependency verifier into a temporary directory, requires the
new receipts to be byte-identical to the frozen receipts, and then checks the
final rational payment margin.  It performs no quadrature or parameter sweep.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile


CHECKPOINT = "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
WORKSTREAM = "workstreams/all-degree-analytic-search-next-v1"

DEPENDENCIES = {
    "exact_obligation": {
        "commit": "02d481a12da723b20b79f24891e89098ef26e24d",
        "tree": "c0124d757017f3c1c0f678e3553c3433c1204dd3",
        "note": f"{WORKSTREAM}/MODULAR_N2_CUBIC_RESERVE_PAYMENT_MAP_20261103.md",
        "source": f"{WORKSTREAM}/src/verify_modular_n2_cubic_reserve_payment_map_20261103.py",
        "result": f"{WORKSTREAM}/results/modular_n2_cubic_reserve_payment_map_20261103.json",
        "hashes": (
            "afb6431055e8167fdb9ef30e61e01195cfd557cfec91d2114d062f27daee9c93",
            "94081de4fb6926c4236d1f0fbf026a625e3fd26efe9d5a913cc8b97bcd68e8a6",
            "b79c5ce2cbebc04275cdfce717888669ff6109b9b93a38189614838f3fc4bfe3",
        ),
    },
    "sharp_cubic_reserve": {
        "commit": "00782310d3bc1c9b5f23119be5ecb5ded97f3099",
        "tree": "7fd8338a5d8cbc86bc3cb5d79bc6cd52a8be7980",
        "note": f"{WORKSTREAM}/MODULAR_N2_SHARP_CUBIC_TRANSPORT_20261103.md",
        "source": f"{WORKSTREAM}/src/verify_modular_n2_sharp_cubic_transport_20261103.py",
        "result": f"{WORKSTREAM}/results/modular_n2_sharp_cubic_transport_20261103.json",
        "hashes": (
            "cde23c97b17f3029621299b4ff0d99ff462b0c89ad6632ceade073922e172318",
            "9dc26bb32466bd62a30ed35984906762f105b0c69a9e94286dd1e7b6a506d9ae",
            "5b5118668f17f3067c63fbb357e7e0dcb088b8af6f9b37447e73a3b8237a8333",
        ),
    },
    "analytic_cost_envelope": {
        "commit": "d9ba9e6d57d3fa4c432cf44038e501a573c28d8e",
        "tree": "f297683b6c478742bed21d1ffd1dced87b13131c",
        "note": f"{WORKSTREAM}/MODULAR_N2_ANALYTIC_COST_ENVELOPE_20261103.md",
        "source": f"{WORKSTREAM}/src/verify_modular_n2_analytic_cost_envelope_20261103.py",
        "result": f"{WORKSTREAM}/results/modular_n2_analytic_cost_envelope_20261103.json",
        "hashes": (
            "976a9893becbe86e40322214ae9fac63293d860bdb3b1924881f0a603e9be326",
            "387b5e3953f1aa27315ad9ca814b42ea5c60536d3a3105c349e039ea47270073",
            "834b0d98a034fd48877fb0452492f7c465e38512c9b397ae473d4d53994d4722",
        ),
    },
    "uniform_prefix_caps": {
        "commit": "5df7934882cdd6850aeaedeeee4518c179ec2c16",
        "tree": "972dac116e69248bcc421b7bbf1e3572102b9736",
        "note": f"{WORKSTREAM}/MODULAR_N2_UNIFORM_PREFIX_CAPS_20261103.md",
        "source": f"{WORKSTREAM}/src/verify_modular_n2_uniform_prefix_caps_20261103.py",
        "result": f"{WORKSTREAM}/results/modular_n2_uniform_prefix_caps_20261103.json",
        "hashes": (
            "de6fb12c532e82234e0140f0190672203d47a5b9ce45db5e603ac43866b86f68",
            "f184e02ad922a72f488fccac8cb344b1d1c9a16e45b200ea515654139d38caae",
            "18311a3b8dc47035566812504386c10b0844160935aa3cf82b5686d5112fc698",
        ),
    },
}


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def run_git(repo: Path, *arguments: str, binary: bool = False) -> str | bytes:
    completed = subprocess.run(
        ["git", "-C", str(repo), *arguments],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=not binary,
    )
    return completed.stdout if binary else completed.stdout.strip()


def locate(root: Path) -> tuple[Path, Path]:
    nested = root / CHECKPOINT
    if nested.is_dir():
        checkpoint = nested
        repo = root
    elif (root / "evidence").is_dir() and (root / "workstreams").is_dir():
        checkpoint = root
        repo = root.parents[1]
    else:
        raise AssertionError("--root is neither repository nor checkpoint root")
    if not (repo / ".git").exists():
        raise AssertionError("the exact dependency-commit audit requires repository Git metadata")
    return repo, checkpoint


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    repo, checkpoint = locate(args.root.resolve())

    observed_commits: dict[str, dict[str, str]] = {}
    observed_artifacts: dict[str, str] = {}
    replay_hashes: dict[str, str] = {}
    dependency_results: dict[str, dict] = {}

    with tempfile.TemporaryDirectory(prefix="modular-n2-full-replay-") as temporary:
        temporary_root = Path(temporary)
        for name, dependency in DEPENDENCIES.items():
            commit = dependency["commit"]
            expected_tree = dependency["tree"]
            resolved = run_git(repo, "rev-parse", "--verify", f"{commit}^{{commit}}")
            if resolved != commit:
                raise AssertionError(f"dependency commit changed for {name}: {resolved}")
            observed_tree = run_git(repo, "show", "-s", "--format=%T", commit)
            if observed_tree != expected_tree:
                raise AssertionError(f"dependency tree changed for {name}: {observed_tree}")
            subprocess.run(
                ["git", "-C", str(repo), "merge-base", "--is-ancestor", commit, "HEAD"],
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            observed_commits[name] = {"commit": commit, "tree": observed_tree}

            paths = (dependency["note"], dependency["source"], dependency["result"])
            for relative, expected_hash in zip(paths, dependency["hashes"]):
                current_path = checkpoint / relative
                current_hash = sha256(current_path)
                if current_hash != expected_hash:
                    raise AssertionError(
                        f"working-tree artifact changed for {name}: {relative}: {current_hash}"
                    )
                repo_relative = f"{CHECKPOINT}/{relative}"
                committed_bytes = run_git(repo, "show", f"{commit}:{repo_relative}", binary=True)
                committed_hash = sha256_bytes(committed_bytes)
                if committed_hash != expected_hash:
                    raise AssertionError(
                        f"commit blob changed for {name}: {repo_relative}: {committed_hash}"
                    )
                observed_artifacts[relative] = current_hash

            frozen_result_path = checkpoint / dependency["result"]
            frozen_result = json.loads(frozen_result_path.read_text())
            if frozen_result.get("status") != "PASS":
                raise AssertionError(f"dependency result is not PASS: {name}")
            dependency_results[name] = frozen_result

            replay_path = temporary_root / f"{name}.json"
            completed = subprocess.run(
                [
                    sys.executable,
                    str(checkpoint / dependency["source"]),
                    "--root",
                    str(repo),
                    "--output",
                    str(replay_path),
                ],
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if not completed.stdout.strip():
                raise AssertionError(f"dependency replay produced no report: {name}")
            replay_bytes = replay_path.read_bytes()
            if replay_bytes != frozen_result_path.read_bytes():
                raise AssertionError(f"dependency replay is not byte-identical: {name}")
            replay_hashes[name] = sha256_bytes(replay_bytes)

    exact = dependency_results["exact_obligation"]
    sharp = dependency_results["sharp_cubic_reserve"]
    cost = dependency_results["analytic_cost_envelope"]
    caps = dependency_results["uniform_prefix_caps"]

    if exact["exact_formulas"]["payment"] != "s3 >= kappa2*Q2_minus":
        raise AssertionError("exact N=2 payment obligation changed")
    if sharp["exact_conclusion"]["divided_pivot"] != (
        "s3(a)/a >= sigma3 > 14487/25"
    ):
        raise AssertionError("sharp cubic reserve changed")
    if cost["conditional_inputs"] != ["b1(a)<=12", "b2(a)<=30", "0<a<=1/4"]:
        raise AssertionError("conditional cost inputs changed")
    if caps["rational_caps"]["b1_upper"] != "12":
        raise AssertionError("b1 cap no longer discharges the cost condition")
    if not Fraction(caps["rational_caps"]["b2_upper"]) < 30:
        raise AssertionError("b2 cap no longer discharges the cost condition")
    if cost["proved_bounds"]["Q2_minus"] != "<sqrt(3816)<62":
        raise AssertionError("Q2-minus envelope changed")
    if cost["proved_bounds"]["kappa2_over_a"] != "<9":
        raise AssertionError("reflection coefficient envelope changed")

    reserve = Fraction(14487, 25)
    cost_upper = Fraction(9 * 62)
    margin = reserve - cost_upper
    if reserve != Fraction(57948, 100):
        raise AssertionError("reserve decimal normalization changed")
    if cost_upper != 558:
        raise AssertionError("cost product changed")
    if margin != Fraction(537, 25) or not margin > 0:
        raise AssertionError("strict N=2 payment margin did not close")

    source = Path(__file__).resolve()
    note = source.parents[1] / "MODULAR_N2_FULL_INTERVAL_PAYMENT_20261103.md"
    result = {
        "schema_version": "zsv.modular_n2_full_interval_payment.20261103.v1",
        "status": "PASS",
        "scope": (
            "Actual complete-theta N=2 strong payment on 0<a<=1/4 only; "
            "not an equivalence to every full-conservation term, a higher-degree "
            "or all-degree theorem, or RH"
        ),
        "exact_conclusion": {
            "interval": "0<a<=1/4",
            "payment": "s3(a) > kappa2(a)*Q2_minus(a)",
            "normalized_payment": "s3(a)/s2(a) > kappa2(a)*mu2_minus(a)",
            "reserve_over_a": ">14487/25 = 579.48",
            "cost_over_a": "<558",
            "margin_over_a": ">537/25 = 21.48",
        },
        "dependency_commits": observed_commits,
        "frozen_artifacts": observed_artifacts,
        "dependency_replays": {
            name: {"status": "PASS", "receipt_sha256": digest, "byte_identical": True}
            for name, digest in replay_hashes.items()
        },
        "checks": [
            "four exact dependency commits and trees are ancestors of HEAD",
            "twelve dependency note/source/result blobs match commit and working tree",
            "all four dependency verifiers replay byte-identically",
            "uniform prefix caps discharge both analytic-cost conditions",
            "Q2-minus < 62 and kappa2/a < 9 give cost/a < 558",
            "sharp cubic transport gives s3/a > 14487/25",
            "exact strict margin 14487/25 - 558 = 537/25",
        ],
        "proof_note": {
            "path": str(note.relative_to(checkpoint)),
            "sha256": sha256(note),
            "binding": "recorded, not self-frozen by this replay",
        },
        "source_sha256": sha256(source),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
