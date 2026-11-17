import math
from elib import *
sig = [0.5005, 0.502, 0.505, 0.51, 0.52, 0.53]
print("sigma     " + " ".join("%6.4f" % s for s in sig))
for k in range(41):
    t = 20.982 + 0.002 * k; line = []
    for s in sig:
        E = Eis(s, t); W, mn, info, per = winding(E, 3 + t / math.pi, n0=(96, 640, 8, 640), dmax=0.3)
        line.append("%3d(%s %.3f)" % (round(W), info[0][0], loop_param(3 + t / math.pi)[["arc","half","top","imag"].index(info[0])][1](info[1])[1]))
    print("t=%.3f " % t + " ".join(line), flush=True)
