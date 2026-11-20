import json, math, random
from elib import *
for sg, t in [(0.65, 50.0), (0.8, 50.0)]:
    E = Eis(sg, t); Y = 3 + t / math.pi
    for n0, dm in [((24, 160, 4, 160), 0.6), ((96, 640, 8, 640), 0.3), ((384, 2560, 16, 2560), 0.15)]:
        W, mn, info, per = winding(E, Y, n0=n0, dmax=dm)
        print(sg, t, n0, dm, W, mn, info)
r = json.load(open('scan_main.json')); random.seed(1)
sub = random.sample(r, 240); bad = 0
for q in sub:
    E = Eis(q['sigma'], q['t']); W, mn, info, per = winding(E, 3 + q['t'] / math.pi, n0=(96, 640, 8, 640), dmax=0.3)
    if round(W) != round(q['W']):
        bad += 1; print("DIFF", q['sigma'], q['t'], q['W'], W, q['minF'], mn)
print("subsample 240, disagreements:", bad)
