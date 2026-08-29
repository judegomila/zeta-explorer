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

## 28 August proof-reduction roots

The latest progress note is committed as Git blob
'0e67a3b65e7acff3f787b9c614c23fd9d84316a9'. The source packages remain
outside the app repository; their SHA-256 trust roots are:

| Workspace package or note | SHA-256 |
|---|---|
| early P97 event-DAG manifest | '9425c6de638f647960892c5f14c503f87ccc7f8042acf9894a2f76022e03399a' |
| directional-center v2 manifest | 'd2e0fc5215c0fa42cebadae84a5f59e72d2f37eabc8561ca6bd1496ea51c30d7' |
| vertical real-attenuation atlas manifest | 'af46389f3710e996ef13ac230931a21ba56e1dd9443e15b72f2d58887179b298' |
| complementary-terms theorem | '08704eb3833411a2e2d62be42ae9b4c41f5e1cad3385d95732af18cdcc3b1386' |
| directional-reduction adversarial audit | '49c8db1cd7e88c0ffb01bcdde9e6391a4a7e8b911a037531d9bb0f56b7f1e17e' |

The smooth-tail point atlases and the 398-cell endpoint planner are explicitly
diagnostic/design evidence. They are not listed as proof roots, because a
complete interval producer for the B-dual interior and both vertical faces
does not yet exist.

## 29 August long-window reduction roots

The repository note
[SMOOTH_TAIL_FEJER_REDUCTION_2026-08-29.md](./SMOOTH_TAIL_FEJER_REDUCTION_2026-08-29.md)
records the exact \(K=L\) Fejér reduction. The corresponding local replay
package remains outside the app repository. Its proof roots are:

| Workspace object | SHA-256 |
|---|---|
| smooth-tail theorem note | `2c6dd0102210672ff319b37fc7cdeea9ebcad91d3593b9517736c4d49736ed47` |
| directed coefficient-energy producer | `f00badb7a14c203383e7132c17402983c875bd2373f7f5b203dfc57e49c9d220` |
| fail-closed verifier | `bd6fdce788a9ac48a42c8410f5b617111951c5354eb965bdb2ba399abb98a6b9` |
| 160-bit transcript | `791b020bfc47daecd9538756400dd9c8e8cdb2593b4c44fd87b25937990da95f` |
| 192-bit transcript | `9a5d417c92050e254fa27ef6ccc83a05a518216216c2a2c39e22ddda5be6ffe5` |
| 256-bit transcript | `995aa519005dcfaf5046f80992f1ada5a98d20306d742363229f9d4ab80a4710` |

The energy and algebraic reduction are proof evidence. The resonance scans
remain diagnostic and are not proof roots. The inequality
`SIGNED_AUTOCORRELATION_LT_1_OVER_43` remains false.

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
