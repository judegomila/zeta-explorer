"""replan.py -- after stopping the first run: truncate partial files to whole records, read the last prime of x0, x1, x2 and
write run7b.sh covering the rest of (1e7, 2e7] with 7 processes of equal sum of p."""
import os, struct, math
segs = []
for i, (lo, hi) in enumerate(((10000001, 15231546), (15231547, 19078784), (19078785, 20000000))):
    f = f"data/split_x{i}.bin"; sz = os.path.getsize(f); n = sz // 144
    with open(f, 'r+b') as fh: fh.truncate(n * 144)
    with open(f, 'rb') as fh:
        fh.seek((n - 1) * 144); last = struct.unpack('<q', fh.read(8))[0]
    print(f, n, 'records, last p', last)
    segs.append((last + 1, hi))
tot = sum(b * b - a * a for a, b in segs); k = 7; per = tot / k
jobs = []
for a, b in segs:
    m = max(1, round((b * b - a * a) / per)); 
    cuts = [int(math.sqrt(a * a + j * (b * b - a * a) / m)) for j in range(m + 1)]; cuts[0] = a - 1; cuts[-1] = b
    jobs += [(cuts[j] + 1, cuts[j + 1]) for j in range(m)]
with open('run7b.sh', 'w') as fh:
    fh.write("#!/bin/bash\n")
    for j, (a, b) in enumerate(jobs):
        fh.write(f"( ./gauss6 split {a} {b} data/split_y{j}.bin 2> data/split_y{j}.log && touch data/split_y{j}.done ) &\n")
    fh.write("wait\necho ALLDONE\n")
print(open('run7b.sh').read())
