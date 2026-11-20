# mkcfg.py: registered boundaries (text processing only)
import math, json
def xt(T0, th):
    x = T0 ** th
    return int(round(x)) if abs(x - round(x)) < 1e-6 * x else int(math.floor(x))
cfg = {}
for tag, T0 in (("1e6", 1e6), ("1e9", 1e9), ("1e12", 1e12)):
    th = {str(t): xt(T0, t) for t in (0.75, 0.8, 0.85)}
    tp = {str(t): int(math.floor((T0 / (2 * math.pi)) ** t)) for t in (0.5, 0.6, 0.75, 0.8, 0.95, 1.0)}
    cfg[tag] = {"T0": T0, "theta": th, "thetap": tp, "cells": {str(v): int(math.floor(math.log(v) * 512)) for v in list(th.values()) + list(tp.values())}}
json.dump(cfg, open("bounds.json", "w"), indent=1)
print(json.dumps(cfg))
