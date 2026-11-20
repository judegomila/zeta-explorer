| family | read | nodes done (planned) | decided by the HEAT column before other columns | positives one-signed for some threshold | excluded | T-train (balls) | hold-out survivors, thresholds scanned | undecided | largest rung used |
|---|---|---|---|---|---|---|---|---|---|
| TM5 | K3 | 40,000 (40,000) | 35,000 | 14 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 4096 |
| TM5 | Kpol | 40,000 (40,000) | - | 0 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 2048 |
| TM6 | K3 | 40,000 (40,000) | 35,000 | 1 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 4096 |
| TM6 | Kpol | 40,000 (40,000) | - | 0 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 2048 |
| DM5 | K3 | 40,000 (40,000) | 35,000 | 0 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 8192 |
| DM5 | Kpol | 40,000 (40,000) | - | 1 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 2048 |
| DM6 | K3 | 40,000 (40,000) | 35,000 | 0 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 8192 |
| DM6 | Kpol | 38,500 (40,000) cut | - | 0 of the 5000 recount nodes | 38,500 | 0 | 0 | 0 | 2048 |
| TMt5 | K3 | 10,000 (10,000) | 2,268 (lazy exit) | 3,013 | 10,000 | 0 | 0 | 0 | 256 |
| TMt5 | Kpol | 10,000 (10,000) | 3,259 (lazy exit) | 3,628 | 10,000 | 0 | 0 | 0 | 128 |
| TMt6 | K3 | 9,900 (10,000) cut | 1,666 (lazy exit) | 2,469 | 9,900 | 0 | 0 | 0 | 1024 |
| TMt6 | Kpol | 10,000 (10,000) | 2,461 (lazy exit) | 2,732 | 10,000 | 0 | 0 | 0 | 128 |
| DMt5 | K3 | 10,000 (10,000) | 3,605 (lazy exit) | 4,021 | 10,000 | 0 | 0 | 0 | 512 |
| DMt5 | Kpol | 10,000 (10,000) | 3,758 (lazy exit) | 4,190 | 10,000 | 0 | 0 | 0 | 128 |
| DMt6 | K3 | 10,000 (10,000) | 2,405 (lazy exit) | 2,688 | 10,000 | 0 | 0 | 0 | 512 |
| DMt6 | Kpol | 10,000 (10,000) | 2,134 (lazy exit) | 2,347 | 10,000 | 0 | 0 | 0 | 128 |
| T3 | K3 | 646,920 (1,800,000) cut | - | 329,448 | 646,920 | 0 | 0 | 0 | 512 after the post-pass (56 nodes were left at 16384 by the search run) |
| T3 | Kpol | 180,000 (180,000) | - | 68,407 | 180,000 | 0 | 0 | 0 | 128 |
| T6 | K3 | 642,960 (1,800,000) cut | - | 328,950 | 642,960 | 0 | 0 | 0 | 512 after the post-pass (40 nodes were left at 16384 by the search run) |
| T6 | Kpol | 97,920 (180,000) cut | - | 41,780 | 96,862 | 1058 | 0 | 0 | 128 |
| total | | 1,966,200 | | | 1,965,142 | 1058 | 0 | 0 | |

Leave-one-class-out recount.

| family | read | scope of the recount | {T-NR, E_a}: T-train / hold-out | {T-NR, HEAT}: T-train / hold-out | {E_a, HEAT}: T-train / hold-out | best hold-out score of a two-class tier (23 needed) |
|---|---|---|---|---|---|---|
| TM5 | K3 | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| TM5 | Kpol | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| TM6 | K3 | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| TM6 | Kpol | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DM5 | K3 | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DM5 | Kpol | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DM6 | K3 | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DM6 | Kpol | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| TMt5 | K3 | first 1,000 nodes, balls; {T-NR, HEAT} also on all nodes (508 T-train, 0 hold-out) | 0 / 0 | 50 / 0 | 0 / 0 | 21.0 |
| TMt5 | Kpol | first 1,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| TMt6 | K3 | first 1,000 nodes, balls; {T-NR, HEAT} also on all nodes (580 T-train, 0 hold-out) | 0 / 0 | 51 / 0 | 0 / 0 | 24.0 |
| TMt6 | Kpol | first 1,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DMt5 | K3 | first 1,000 nodes, balls; {T-NR, HEAT} also on all nodes (1 T-train, 0 hold-out) | 0 / 0 | 0 / 0 | 0 / 0 | 21.0 |
| DMt5 | Kpol | first 1,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DMt6 | K3 | first 1,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DMt6 | Kpol | first 1,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| T3 | K3 | all 646,920 node-mu; float64 certified (+ float64-undecided, not converted unless the hold-out read was favourable) | 84,014 (+6,721) / 0 float64, 0 balls | 418 (+20,806) / 0 float64, 0 balls | 0 (+1,636) / 0 float64, 0 balls | - |
| T3 | Kpol | all 180,000 node-mu; float64 certified (+ float64-undecided, not converted unless the hold-out read was favourable) | 0 (+0) / 0 float64, 0 balls | 0 (+0) / 0 float64, 0 balls | 48 (+283) / 0 float64, 0 balls | - |
| T6 | K3 | all 642,960 node-mu; float64 certified (+ float64-undecided, not converted unless the hold-out read was favourable) | 98,719 (+7,495) / 0 float64, 0 balls | 565 (+20,004) / 0 float64, 0 balls | 0 (+1,536) / 0 float64, 0 balls | - |
| T6 | Kpol | all 97,920 node-mu; float64 certified (+ float64-undecided, not converted unless the hold-out read was favourable) | 1,079 (+512) / 0 float64, 0 balls | 398 (+1,382) / 0 float64, 0 balls | 543 (+1,708) / 0 float64, 0 balls | 17 |
