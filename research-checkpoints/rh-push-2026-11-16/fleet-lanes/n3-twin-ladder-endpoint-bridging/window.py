"""Window law near w=1 from the high scans: for each w, lowest height where the on-line count falls 2 short of w=1."""
import json, bisect, math
rows = {}
for fn in ("hi1.jsonl", "hi2.jsonl"):
    try:
        for l in open(fn):
            r = json.loads(l); rows[r["w"]] = r["zeros"]
    except FileNotFoundError: pass
ref = rows[1.0]
print("w=1: on-line zeros to 1000:", len(ref))
out = []
for w in sorted(rows):
    z = rows[w]
    # lowest T such that deficit N1(T')-Nw(T') >= 2 for all T' in [T, T+3]
    Toff = None
    grid = [x*0.25 for x in range(40, 3990)]
    d = [bisect.bisect_right(ref, T) - bisect.bisect_right(z, T) for T in grid]
    for i in range(len(grid)-12):
        if min(d[i:i+12]) >= 2: Toff = grid[i]; break
    out.append((w, len(z), (len(ref)-len(z))//2, Toff))
    print(f"w={w:.3f} on-line={len(z)} missing_pairs~{(len(ref)-len(z))/2:.1f} lowest_offline_height~{Toff}")
json.dump(out, open("window.json", "w"))
