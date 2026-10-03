#!/usr/bin/env python3
"""Check frozen research bytes; this is not a mathematical proof checker."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def check_file(path, expected):
    resolved = path.resolve()
    if not resolved.is_relative_to(ROOT):
        raise ValueError(f"Manifest path escapes package: {path}")
    data = resolved.read_bytes()
    if "bytes" in expected:
        assert len(data) == expected["bytes"], f"Byte count mismatch: {path}"
    assert hashlib.sha256(data).hexdigest() == expected["sha256"], f"SHA-256 mismatch: {path}"


source = json.loads((ROOT / "source-manifest.json").read_text())
assert len(source["files"]) == 25
assert len({item["path"] for item in source["files"]}) == 25
for item in source["files"]:
    check_file(ROOT / item["path"], item)

search = ROOT / "lambda_fiber_freeze"
run = json.loads((search / "run_manifest.json").read_text())
assert len(run["files"]) == 17
for item in run["files"]:
    check_file(search / item["path"], item)

heat = ROOT / "heat_twistor_completion"
review = json.loads((heat / "final_source_review.json").read_text())
for name, digest in review["reviewed_sha256"].items():
    folder = search if name == "certify_local_cell.py" else heat
    check_file(folder / name, {"sha256": digest})

replay = json.loads((search / "local_replay_comparison.json").read_text())
for item in replay["certificates"]:
    check_file(search / item["file"], item)
    certificate = json.loads((search / item["file"]).read_text())
    assert certificate["local_H_nonvanishing_certified"] is True
    assert certificate["local_P97_disk_certified"] is True
    assert certificate["global_coverage_certified"] is False
    assert certificate["lambda_lt_0145_proved"] is False

print("PASS: 25 frozen files, 17-file search manifest, final review hashes and local certificate scope flags.")
