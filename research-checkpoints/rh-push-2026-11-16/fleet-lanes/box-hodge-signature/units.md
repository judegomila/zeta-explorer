| unit | what | cores / memory limit | start - end (UTC) | peak memory of the unit | outcome |
|---|---|---|---|---|---|
| rh-bhs-u1-1117083212 | first uniform batch, 47 tasks, pool of 10 | 10 / 45 GB | 08:32:12 - 08:41:55 | 24.76 GB | stopped by me to move to one memory-aware queue; 43 finished results kept |
| rh-bhs-q-1117084156 | queue (`runq.py queue.txt`): uniform, DH, controls, heat, prime powers | 10 / 45 GB | 08:41:56 - 09:25:09 | 19.81 GB | stopped by me to deploy the fix of 2.3 item 2 |
| rh-bhs-q2-1117092509 | same queue, resumed | 10 / 45 GB | 09:25:09 - 10:42:19 | 19.10 GB | stopped by me to reorder (long streamed prime sums were blocking short tasks) |
| rh-bhs-big-1117100248 | `run_big.py` zeta h = 0.03, n = 692, X = 1.0e9 | 6 / 14 GB | 10:02:48 - 10:28:01 | not read before exit; parent RSS 0.56 GB | completed |
| rh-bhs-big2-1117102857 | `run_big.py` zeta h = 0.03, n = 738, X = 4.0e9 | 6 / 14 GB | 10:28:57 - 10:54:00 | 0.56 GB | stopped by me (projected 3.7 h); no result |
| rh-bhs-q3-1117104219 | reordered queue | 10 / 45 GB | 10:42:19 - 10:51:58 | 45 GB (limit) | killed by its own memory limit; see incident below |
| rh-bhs-pp4-1117105411 | `run_pp.py`, all prime powers <= 10^4, zeta then DH, 6 row workers | 6 / 14 GB | 10:54:11 - 13:29:52 | 2.84 GB | zeta and DH completed; stopped by me after DH |
| rh-bhs-q4-1117105906 | remaining queue with real estimates and a table cap | 10 / 40 GB | 10:59:06 - 13:29:52 | 10.69 GB | 19 of 20 tasks completed; stopped by me (EA_0.01 at X = 10^4 unfinished) |

Total: 8 units, 08:32 to 13:30 UTC (4 h 58 min wall), at most 16 cores and 59 GB of limits at any time, measured peak
of any one unit 24.76 GB apart from the incident. All units are inactive (checked with `systemctl --user show` after
the last stop). Output volume: 590 result files (JSON), copied to `box/`.
