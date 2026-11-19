import sys, json
from fractions import Fraction as F
from pathlib import Path
import mpmath as mp
W = Path(sys.argv[1])
hybrid = json.loads((W/'attack/latest_lambda_reconstructed/workspace/continuation_20261022e/probe_optimisation/SHARED_HYBRID_PLAN.json').read_text())['rows']
reports = {r['row']: r for r in json.loads((W/'corner_search/adversarial_joint_relation_source_receipt.json').read_text())['reports']}
for dps in (60, 250):
    mp.mp.dps = dps; worst = mp.inf; neg = 0; tot = 0
    for i, rp in reports.items():
        tl, th = map(F, hybrid[i]['time'])
        for rel in rp['relations']:
            lg = mp.log(mp.mpf(int(rel['ratio_numerator'])) / int(rel['ratio_denominator']))
            ph0 = (mp.mpf(6) * 10 ** 12 / 2 + mp.pi * tl.numerator / tl.denominator / 8) * lg
            ph1 = (mp.mpf(66) * 10 ** 11 / 2 + mp.pi * th.numerator / th.denominator / 8) * lg
            assert 0 < ph0 < ph1 < 2 * mp.pi
            dp = F(rel['angle_distance_paid']); sl = min(ph0, 2 * mp.pi - ph1) - mp.mpf(dp.numerator) / dp.denominator
            tot += 1; neg += sl < 0; worst = min(worst, sl)
    print('dps', dps, 'relations', tot, 'negative slack', neg, 'min slack', mp.nstr(worst, 5))
