"""wall abscissae at the centres of the largest gaps near the two ends of an isolated window; prints 'xw_left xw_right' as exact decimals."""
import sys, json
from decimal import Decimal, getcontext
getcontext().prec = 40
d = json.load(open(sys.argv[1])); X = Decimal(int(d['X']))
f = lambda g: X + Decimal(repr(g[0] + g[1]))      # x = X + 2 * (midpoint offset in gamma)
print(str(f(d['wall_gap_left'])), str(f(d['wall_gap_right'])))
