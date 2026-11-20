import sys, json, math, time
from elib import *
sigmas = [float(a) for a in sys.argv[1].split(",")]
t0, t1, dt = float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
out = sys.argv[5]
n = int(round((t1 - t0) / dt))
print("planned rows:", len(sigmas) * (n + 1), "(small lists only)", flush=True)
rows = []; T0 = time.time()
for sg in sigmas:
    for k in range(n + 1):
        t = round(t0 + k * dt, 6)
        E = Eis(sg, t); Y = 3 + abs(t) / math.pi
        W, mn, info, per = winding(E, Y)
        rows.append({"sigma": sg, "t": t, "W": W, "minF": mn, "minAt": info, "per": per, "A": abs(E.A), "esc": E.nesc})
    print(sg, "done", round(time.time() - T0, 1), flush=True)
    json.dump(rows, open(out, "w"))
