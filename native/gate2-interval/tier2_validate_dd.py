#!/usr/bin/env python3
"""
imp-95214 tier-2 chirp-level validation driver: the RECONSTRUCTED
Taylor-panel Arb enclosures of tier_cert2 (super-panel envelope models +
Taylor shift + carrier convolution; panel AND super placement deliberately
off-center) must CONTAIN the dd values of the validated gate2-lane-a
evaluator at the SAME 30 seeded points as the level-1 suite (seed 95213),
up to the dd lane's documented error (DD_TOL = 1e-12). Containment check:
    |dd - mid(ball)| <= rad(ball) + DD_TOL.
Tier-2 radii are ~1.4e-12 (the chirp-level remainder), still far above dd
error, so this also checks the tier-2 remainder budget is honest.
Measurement of agreement only: promotes no Lambda bound; NO QED.
"""
import json
import random
import subprocess
import sys
import os

HERE = os.path.dirname(os.path.abspath(__file__))
GATE2 = os.path.join(HERE, "..", "gate2-lane-a", "gate2")
TIER2 = os.path.join(HERE, "tier_cert2")
DD_TOL = 1e-12
PREC = 128
DEGREE = 80
BINS = 64
EDEG = 33

random.seed(95213)                   # SAME points as the level-1 suite
points = [(0.52447003038, 0),        # pilot sup witness
          (0.053273326334, 1),       # |E97| sup witness (chart 690989)
          (1.0, 1)]                  # seam
while len(points) < 30:
    points.append((random.random(), random.randint(0, 1)))

ptsfile = os.path.join(HERE, "tier_validate_points.txt")
with open(ptsfile, "w") as f:
    for w, s in points:
        f.write("%.17g %d\n" % (w, s))

print("running tier_cert2 validatedd2 (one setup, %d points, prec %d, "
      "degree %d, bins %d, edeg %d)..." % (len(points), PREC, DEGREE, BINS, EDEG))
out = subprocess.run([TIER2, "validatedd2", ptsfile, str(PREC), str(DEGREE),
                      str(BINS), str(EDEG)],
                     capture_output=True, text=True, check=True)
cert = json.loads(out.stdout)

fails = 0
maxdev = {"absE97": 0.0, "pilot": 0.0, "D": 0.0}
maxrad = 0.0
for (w, side), enc in zip(points, cert):
    assert abs(enc["w"] - w) < 1e-16 and enc["side"] == side
    dd = json.loads(subprocess.run(
        [GATE2, "point", "%.17g" % w, str(side)],
        capture_output=True, text=True, check=True).stdout)
    checks = [("absE97", dd["E97"]["abs"], enc["absE97"]["mid"], enc["absE97"]["rad"]),
              ("pilot", dd["pilot"], enc["pilot"]["mid"], enc["pilot"]["rad"])]
    for j in range(25):
        checks.append(("D", dd["D"][j][0], enc["D"][j][0], enc["D"][j][2]))
        checks.append(("D", dd["D"][j][1], enc["D"][j][1], enc["D"][j][3]))
    ok = True
    for name, ddv, mid, rad in checks:
        dev = abs(ddv - mid)
        maxdev[name] = max(maxdev[name], dev)
        maxrad = max(maxrad, rad)
        if dev > rad + DD_TOL:
            ok = False
            print("  CONTAINMENT FAIL w=%.12f side=%d %s: dev %.3e > rad %.3e + %g"
                  % (w, side, name, dev, rad, DD_TOL))
    if not ok:
        fails += 1
    print("  [%s] w=%.12f side=%d  pilot dev %.2e  |E97| dev %.2e"
          % ("PASS" if ok else "FAIL", w, side,
             abs(dd["pilot"] - enc["pilot"]["mid"]),
             abs(dd["E97"]["abs"] - enc["absE97"]["mid"])))

print(json.dumps({"points": len(points), "failures": fails,
                  "maxDev": maxdev, "maxTier2Rad": maxrad,
                  "ddTol": DD_TOL}, indent=2))
sys.exit(1 if fails else 0)
