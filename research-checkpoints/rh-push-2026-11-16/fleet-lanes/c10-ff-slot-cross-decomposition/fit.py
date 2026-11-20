"""fit.py : least-squares slopes used by PREREG.md and analyze.py."""
import math
def slope(xs, ys):
    n = len(xs)
    if n < 2 or len(set(xs)) < 2: return None
    mx = sum(xs)/n; my = sum(ys)/n
    return sum((x-mx)*(y-my) for x, y in zip(xs, ys)) / sum((x-mx)**2 for x in xs)
