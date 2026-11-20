"""Run the exact algebra audits; no floating-point grid is used."""

import json
import runpy
from pathlib import Path


def run():
    root = Path(__file__).resolve().parent
    suites = {
        "fourth_stage": "theta_fourth_checks_20261109.py",
        "coupled_kernels": "theta_pair_checks_20261109.py",
        "rational_residuals": "theta_rational_residual_checks_20261109.py",
    }
    results = {}
    for name, filename in suites.items():
        results[name] = runpy.run_path(str(root / filename))["run"]()
        assert results[name]["status"] == "passed", name
    return {
        "status": "passed",
        "suites": results,
        "scope": "Exact formula and proof-constant audits. External finite-zero verification is imported. Arbitrary-order positivity and the next theta ratio signs remain unproved.",
    }


if __name__ == "__main__":
    print(json.dumps(run(), indent=2, sort_keys=True))
