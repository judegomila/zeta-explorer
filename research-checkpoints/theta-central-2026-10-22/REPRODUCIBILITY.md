# Standalone reproduction

This checkpoint was extracted from PR #15 at commit `7ba0b4d9a7f7ebe256030f829bed6c9c49e73052`. The mathematical notes, code, dependency pins, and recorded outputs are unchanged; README paths and packaging were adjusted for an independent directory. Neither PR #15 nor another research branch is required.

From the repository root, with Python 3.12 (originally checked with 3.12.14):

```sh
python3 -m venv .venv-theta-central-2026-10-22
. .venv-theta-central-2026-10-22/bin/activate
cd research-checkpoints/theta-central-2026-10-22
python -m pip install -r requirements.txt
python verify_manifest.py
python check_theta_horizon.py
python check_theta_horizon.py --bits 192 --cells 65536
```

Keep the virtual environment outside the checkpoint. The manifest checks every included file except itself and ignores Python bytecode caches. It does not verify omitted data. The checks need no network input after dependencies are installed.

Read the README for the exact claim boundaries. Successful computation is not formal proof-assistant verification, independent external peer review, or an RH proof. The split does not strengthen any mathematical claim.
