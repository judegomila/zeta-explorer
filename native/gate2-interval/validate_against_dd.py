#!/usr/bin/env python3
"""
W1-CERT validation driver: the Arb enclosures of cert_window must CONTAIN
the dd values of the validated gate2-lane-a evaluator at 20 points
(17 seeded-random + the two pilot sup witnesses + the seam), up to the dd
lane's own documented numeric error (DD_TOL below).

Containment semantics (honest): the Arb ball encloses the TRUE value of
the locked-convention expression with exact-rational chart constants; the
dd evaluator carries ~1e-14 measured error (imp-95205 mpmath audit:
<=1.3e-16 on |E97|, <=1.7e-14 on the pilot, <=1.3e-14 per defect) plus
double-rounded chart constants. So the check is
    |dd - mid(ball)| <= rad(ball) + DD_TOL,   DD_TOL = 1e-12,
i.e. containment in the ball inflated by the dd lane's error allowance.
The actual max deviation is reported; expect ~1e-14. Measurement of
agreement only: promotes no Lambda bound; NO QED.
"""
import json
import random
import subprocess
import sys
import os

HERE = os.path.dirname(os.path.abspath(__file__))
GATE2 = os.path.join(HERE, "..", "gate2-lane-a", "gate2")
CERT = os.path.join(HERE, "cert_window")
DD_TOL = 1e-12
PREC = 128

random.seed(95205)
points = [(0.0, 0), (0.5245, 0), (1.0, 1)]          # witnesses + seam
while len(points) < 20:
    points.append((random.random(), random.randint(0, 1)))

ptsfile = os.path.join(HERE, "validate_points.txt")
with open(ptsfile, "w") as f:
    for w, s in points:
        f.write("%.17g %d\n" % (w, s))

print("running cert_window validate (one table build, %d points, prec %d)..."
      % (len(points), PREC))
out = subprocess.run([CERT, "validate", ptsfile, str(PREC)],
                     capture_output=True, text=True, check=True)
cert = json.loads(out.stdout)

fails = 0
maxdev = {"absE97": 0.0, "pilot": 0.0, "D": 0.0}
minmargin = float("inf")
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
        minmargin = min(minmargin, (rad + DD_TOL) - dev)
        if dev > rad + DD_TOL:
            print("CONTAINMENT FAIL w=%.17g side=%d %s: dd=%.17e mid=%.17e "
                  "dev=%.3e rad=%.3e" % (w, side, name, ddv, mid, dev, rad))
            ok = False
            fails += 1
    print("w=%-22.17g side=%d %s  |E97| dd=%.16f ball=%.16f+-%.1e  "
          "pilot dd=%.16f ball=%.16f+-%.1e"
          % (w, side, "PASS" if ok else "FAIL",
             dd["E97"]["abs"], enc["absE97"]["mid"], enc["absE97"]["rad"],
             dd["pilot"], enc["pilot"]["mid"], enc["pilot"]["rad"]))

print()
print("points: %d   containment checks: %d   failures: %d"
      % (len(points), len(points) * 52, fails))
print("max |dd - mid| deviation: absE97 %.3e, pilot %.3e, defects %.3e"
      % (maxdev["absE97"], maxdev["pilot"], maxdev["D"]))
print("min containment margin (rad + DD_TOL - dev): %.3e" % minmargin)
print("DD_TOL (dd lane error allowance): %.1e" % DD_TOL)
print("VALIDATION %s" % ("PASS" if fails == 0 else "FAIL"))
sys.exit(1 if fails else 0)
