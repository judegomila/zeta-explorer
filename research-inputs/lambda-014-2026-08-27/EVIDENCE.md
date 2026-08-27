# Evidence and provenance

This repository checkpoint intentionally contains only the compact theorem and
status notes needed to understand the `0.14` program. The full replay archive
is not committed here: it contains 1,089 files, is generated evidence rather
than app source, and `mathexplorer` already ignores `*.tar.gz` archives.

## Full replay archive

```text
filename: lambda_014_swept_tube_work_2026-08-27.tar.gz
size:     1,737,389 bytes
sha256:   be52c5e4b9a5e7e62f9a03f015a129d1409042171092a93fa13122642110df13
```

The archive should be attached to a dedicated GitHub release or another
immutable artifact store if the project wants public, one-click replay. It
should not be forced through the app repository's ignore rules.

## Included source-note hashes

These hashes bind the repository copies to the audited 27 August 2026
workspace versions.

| Repository file | SHA-256 |
|---|---|
| `EXECUTION_LEDGER.md` | `aa4b64d2591305d291fee2867c382ef984c9128daf4c6f49599ff15ab0babc9f` |
| `MOVING_CUTOFF_COMPLETION_THEOREM.md` | `4f8bf5e5d2f42d7621cf074871563ce25b1cba30c5bf439e87db26e282b063b1` |
| `P19_SWEPT_FAMILY_THEOREM.md` | `4ff06a12093279f1e7e1ab31fc6457c1e883d562f6358d988e843c6c5731a1c2` |
| `AIRY_ENDPOINT_KERNEL_THEOREM.md` | `81d35dc7bc9b0f62c4e9436bd7c67cdabf646353ab76573415b89521843dc749` |
| `VERTICAL_GAMMA_THEOREM.md` | `5aacc475419c7ea76db3415d88429a2ee5a1c84c3cd64882d99f3e76ff3254bc` |

## Replay contract

From an extracted full archive:

```bash
python3 lambda_014_parked_tube_v1/verify_contract.py
python3 lambda_014_parked_tube_v1/test_fail_closed.py
python3 p19_swept_family_v1/verify_p19_swept_family.py
python3 p19_swept_family_v1/verify_p19_swept_family.py --fresh --jobs 8
bash early_p97_strategy/verify.sh
bash optimized_mollifier_search/verify.sh
bash early_p97_packet_theory_v1/verify.sh
bash early_p97_airy_kernel_v1/verify.sh
bash early_p97_vertical_v1/verify.sh --replay
```

The expected global terminal state at this checkpoint is:

```text
P19_LATE_FAMILY_MANTLE_CERTIFIED true
CORRELATED_PREHANDOFF_MANTLE_CERTIFIED false
SWEPT_TUBE_NONVANISHING false
LAMBDA_LE_7_OVER_50 false
```

Any verifier or prose claiming otherwise does not match this checkpoint.
