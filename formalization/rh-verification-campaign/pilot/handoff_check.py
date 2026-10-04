#!/usr/bin/env python3
"""
Hand-off check: from a chain log + its zeros.bin, report the exact index of the
last certified zero with ordinate <= cut, and verify no isolating interval
straddles the cut.

Usage: handoff_check.py <log.jsonl> <zeros.bin> <cut> [expected_index]
PT (arXiv:2004.09765): RH to 3,000,175,332,800 with 12,363,153,437,138 zeros
(number as quoted in the s145 requirements map / PT abstract).
"""
import json
import struct
import sys
from fractions import Fraction

log, zbin, cut = sys.argv[1], sys.argv[2], Fraction(sys.argv[3])
exp = int(sys.argv[4]) if len(sys.argv) > 4 else None
L = [json.loads(l) for l in open(log) if '"OK"' in l]
data = open(zbin, "rb").read()
vals = struct.unpack("<%dd" % (len(data) // 8), data)
off, last_below, first_above, straddle = 0, None, None, []
for c in L:
    T, n0 = int(c["T"]), int(c["n_first"])
    for i in range(int(c["found"])):
        a, b = T + Fraction(vals[off]), T + Fraction(vals[off + 1])
        off += 2
        if b <= cut:
            last_below = (n0 + i, float(a), float(b))
        elif a > cut and first_above is None:
            first_above = (n0 + i, float(a), float(b))
        elif a <= cut < b:
            straddle.append(n0 + i)
assert off == len(vals), "zeros.bin length does not match log"
res = dict(cut=float(cut), last_index_below=last_below, first_index_above=first_above, straddle=straddle,
           expected=exp, PASS=(not straddle and last_below is not None and first_above is not None
                               and (exp is None or last_below[0] == exp)))
print(json.dumps(res))
sys.exit(0 if res["PASS"] else 1)
