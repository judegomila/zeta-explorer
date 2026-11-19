import json, sys
out, side = sys.argv[1], sys.argv[2]
L = open(out).read().split('\n'); s = json.load(open(side))
print(f"alpha={s['valpha']} G={s['vG']}: " + "; ".join("%s I=%+.5f%+.5fi P=%+.5f" % (s['weights'][w], float(L[3 + w].split()[3]), float(L[3 + w].split()[4]), s['P'][w][0]) for w in (0, 1, 2, 11, 13)))
