#!/usr/bin/env python3
"""Lane c18-repair: the control-table entry 'ZQ (rational form) fails at S3/S4, ARGUED' of
c16-u6g-scattering-fe-rank2-bridge-stage-a/RESULT.md section 5 is wrong (c17-rank2-gram-symmetric-blaschke-closure
section 5.2 and 5.5, confirmed by its referee, section 6 'ZQ rational form passes'). The cell is kept and a bracket
added inside the status cell. Previous file: before/lanefiles/."""
import os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
rel = 'c16-u6g-scattering-fe-rank2-bridge-stage-a/RESULT.md'
p = os.path.normpath(os.path.join(HERE, '..', rel))
b = os.path.join(HERE, 'before', 'lanefiles', rel); os.makedirs(os.path.dirname(b), exist_ok=True)
if not os.path.exists(b): shutil.copy2(p, b)
s = open(p, encoding='utf-8').read()
a = ('the diagonal of (I2) tends to minus infinity there (rank-one argument) | ARGUED |')
assert s.count(a) == 1 and 'c18-repair' not in s
s = s.replace(a, 'the diagonal of (I2) tends to minus infinity there (rank-one argument) | ARGUED [Correction entered '
  '2026-11-19 by lane c18-repair-owed-record-r17-open-device-nodes: this entry is wrong. ZQ in the rational form '
  'passes (MEASURED: 3,360 certified positive Gram matrices, push/c17-rank2-gram-symmetric-blaschke-closure sections '
  '5.2 and 5.5; held by that lane\'s referee). It does not fail at S3/S4. Map row D10 and map section 7.] |')
open(p, 'w', encoding='utf-8').write(s); print('edited', rel)
