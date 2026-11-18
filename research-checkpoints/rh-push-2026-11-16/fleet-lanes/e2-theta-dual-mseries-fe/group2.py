"""group2.py -- chart rule: pieces w(R_+) for w in W_D = <K6, Th3, g> (reflections of the low chart and the theta-dual chart),
plus the six pieces <K6, Pm>(R_+) of n1-tube-hull (high chart entered once, from the low chart). Exact arithmetic."""
import sys
sys.argv = ['x']
_src = open('tmp/research-2026-11-16/push/e2-theta-dual-mseries-fe/group.py').read()
exec(_src.split("W0, ok0")[0]); exec("h = Fr(1, 2)" + _src.split("h = Fr(1, 2)")[1].split("# true self-symmetries")[0])
gens = {'K': K6, 'T': TH, 'g': G}
seen = {I: ''}; frontier = [I]; byl = [1]
for L in range(1, 13):
    nxt = []
    for A_ in frontier:
        for nm, B in gens.items():
            C = mm(A_, B)                      # piece = A_ B (R_+): words read left to right from the low chart outward
            if C not in seen: seen[C] = seen[A_] + nm; nxt.append(C)
    frontier = nxt; byl.append(len(nxt))
print("W_D = <K6, Th3, g>: new elements by word length 0..12:", byl, " total", len(seen))
low = piece_low(); neg = 0; mn = None; hist = {}
for A_, wd in seen.items():
    f = rowm(X, A_)                           # x - 1/2 on the piece A_(R_+) as a functional of the octant coordinates
    if any(c < 0 for c in f): neg += 1; continue
    v = sum(f) * h + h                        # inf of x on the piece
    hist[v] = hist.get(v, 0) + 1
    if mn is None or v < mn[0]: mn = (v, wd)
print("pieces with a negative coefficient of X:", neg, "; smallest inf x over the", len(seen), "pieces:", mn)
print("number of pieces by inf x (smallest values):", [(str(k), hist[k]) for k in sorted(hist)[:8]])
# S3 = <K6, Pm> pieces with input theta in the high chart
W6, ok = closure({'K': K6, 'P': PM}, 100)
for theta in (Fr(1), Fr(7, 8), Fr(874886647, 10**9), Fr(13, 15), Fr(5, 6), Fr(1, 2)):
    vals = []
    for A_, wd in W6.items():
        f = rowm(X, A_)
        assert all(c >= 0 for c in f)
        vals.append(sum(f) * h + h)
    hv = inf_fun(X, piece_high(theta)) + h
    allmin = min([mn[0], hv] + vals)
    print(f"theta = {str(theta):>22s}: inf x over all pieces (W_D pieces: {mn[0]}; <K6,Pm> absolute pieces: {min(vals)}; high chart with input: {hv}) -> hull x_min = {allmin}")
# effect of g on a point: x' - x = 2T + V = 2x + z - 3/2
print("X o g - X =", [str(a - b) for a, b in zip(rowm(X, G), X)], "= 2T + V  (high coordinates: 2x + z - 3/2)")
# transport remark: K6 o AW applied to the theta-dual piece
f = rowm(rowm(X, K6), AW); print("X o K6 o AW =", [str(c) for c in f], "; on Th3(R_+) the coordinate T is < -1/2 and unbounded below")
