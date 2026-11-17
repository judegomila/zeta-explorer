import math, json
import scan_oval as so
y = math.sqrt(7); dt = 0.004
prev = so.F(0.0, y, 0.5, 1.0).real; n = 0; zs = []
t = 1.0
while t < 80.0 - 1e-9:
    t += dt
    v = so.F(0.0, y, 0.5, t).real
    if v * prev < 0: n += 1; zs.append(t - dt / 2)
    prev = v
gaps = sorted((zs[i + 1] - zs[i], zs[i]) for i in range(len(zs) - 1))[:4]
print(json.dumps(dict(y2=7, dt=dt, N_on=n, smallest_gaps=gaps)))
