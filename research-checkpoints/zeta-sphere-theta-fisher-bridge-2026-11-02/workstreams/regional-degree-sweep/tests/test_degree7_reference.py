#!/usr/bin/env python3
"""Check that the generalized atlas reproduces the frozen degree-7 mechanism."""

from __future__ import annotations

import argparse
import json
import subprocess
import tempfile
from pathlib import Path


def left_number(text: str) -> float:
    return float(text.lstrip("[").split()[0])


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--python", type=Path, required=True)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    with tempfile.TemporaryDirectory(prefix="zsv-d7-replay-") as temporary:
        output = Path(temporary) / "atlas.json"
        subprocess.run(
            [
                str(args.python),
                str(root / "src" / "regional_atlas.py"),
                "--degree",
                "7",
                "--cells",
                "4000",
                "--bits",
                "192",
                "--splits",
                "1/8,1/2",
                "--output",
                str(output),
            ],
            check=True,
        )
        payload = json.loads(output.read_text(encoding="utf-8"))
    records = {row["split"]: row for row in payload["records"]}
    eighth = records["1/8"]
    half = records["1/2"]
    assert eighth["payment"]["signed_payment_certified"] is True
    assert eighth["payment"]["regional_global_overlap"] is True
    assert half["payment"]["signed_payment_certified"] is False
    assert half["payment"]["combined_positive_certified"] is True

    # Frozen v31 directed lower endpoints must lie inside or close to the
    # generalized checker's deliberately slightly wider enclosures.
    core_lo = left_number(eighth["core"]["regional_remainder"]["lo"])
    core_hi = left_number(eighth["core"]["regional_remainder"]["hi"])
    assert core_lo < -347_755_654 < core_hi
    direct_lo = left_number(payload["global"]["direct_remainder"]["lo"])
    direct_hi = left_number(payload["global"]["direct_remainder"]["hi"])
    assert direct_lo < 6_072_812_178 < direct_hi
    print("degree-7 frozen-mechanism replay: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
