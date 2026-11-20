#!/usr/bin/env python3
"""Read status or request a graceful stop without signalling processes."""

from __future__ import annotations

import argparse
import json
import os
import time
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["status", "stop"])
    parser.add_argument("--run-dir", type=Path, required=True)
    args = parser.parse_args()
    if args.action == "stop":
        args.run_dir.mkdir(parents=True, exist_ok=True)
        stop = args.run_dir / "STOP"
        temporary = args.run_dir / f"STOP.tmp.{os.getpid()}"
        temporary.write_text(f"requested {time.time()}\n", encoding="utf-8")
        os.replace(temporary, stop)
        print(json.dumps({"status": "stop-requested", "path": str(stop)}))
        return 0
    heartbeat = args.run_dir / "heartbeat.json"
    if not heartbeat.is_file():
        print(json.dumps({"status": "no-heartbeat", "path": str(heartbeat)}))
        return 1
    print(heartbeat.read_text(encoding="utf-8"), end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
