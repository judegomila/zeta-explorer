"""Own check of the compact 128-bit margin transcript against the full exact witness transcript.
Usage: python -I check_compact.py <witness.jsonl.gz> <compact.jsonl.gz>
For every arc and each of the six fields: L >= 0 integer, L/2^128 <= exact < (L+1)/2^128 (floor = rounding toward the unsafe side is excluded)."""
import sys, gzip, json
from flint import fmpq as Q
w = gzip.open(sys.argv[1], 'rt'); c = gzip.open(sys.argv[2], 'rt')
head = json.loads(c.readline()); cols = head['columns']; assert head['denominator'] == str(1 << 128), head
n = bad = 0; S = 1 << 128; minL = [None] * 6
for line in c:
    row = json.loads(line); wr = json.loads(w.readline())
    assert row[0] == wr['arc'] == n and row[1] == wr['row']
    for j, k in enumerate(cols[2:]):
        L = row[2 + j]; e = Q(wr[k])
        if not (isinstance(L, int) and L >= 0 and Q(L, S) <= e < Q(L + 1, S)): bad += 1
        if k in ('whole_arc_positive_floor', 'cap_clearance') and L <= 0: bad += 1
        if minL[j] is None or L < minL[j]: minL[j] = L
    n += 1
assert w.readline() == ''
print(json.dumps({'arcs': n, 'fields': cols[2:], 'violations': bad, 'min_integer_per_field': [str(x) for x in minL]}))
sys.exit(1 if bad or n != 221010 else 0)
