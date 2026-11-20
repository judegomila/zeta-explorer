# Second pass on the Newman-type multiplier: values outside the strip by the Laplace form only
# (the real-line integral for g has peak e^(Re z - 1) and is not usable for Re z > 5). Planned memory < 50 MB.
import json, os
from mpmath import mp, mpf, mpc, pi, exp, log, quad, sin, nstr, linspace, zeta, findroot
mp.dps = 40
kap = mpf(4)
pts = [mpf(v) for v in linspace(0, 40, 321)]
def Rlap(s):
    return 2*quad(lambda r: (sin(r*log(r)) if r > 0 else 0)*exp(pi*r/2 - kap*(s-mpf(1)/2)*r), pts)
def dRlap(s):
    return 2*quad(lambda r: (-kap*r*sin(r*log(r)) if r > 0 else 0)*exp(pi*r/2 - kap*(s-mpf(1)/2)*r), pts)
out = {}
sig = mpf('1.25')
out['bound 2/(kappa(sigma-1/2)-pi/2) at sigma=1.25'] = nstr(2/(kap*(sig-mpf(1)/2) - pi/2), 8)
out['|R(1.25+it)|, t=0,0.5,1,2,4,8'] = [nstr(abs(Rlap(mpc(sig, t))), 8) for t in [0, 0.5, 1, 2, 4, 8]]
import time; _t0 = time.time()
vals = [Rlap(mpc(sig, mpf(j)/4)) for j in range(81)]
out['seconds for 81 values'] = round(time.time()-_t0, 1)
out['max |R(1.25+it)| on t in [0,20] step 0.25'] = nstr(max(abs(v) for v in vals), 8)
out['min |1+R(1.25+it)| on t in [0,20] step 0.25'] = nstr(min(abs(1+v) for v in vals), 8)
# zeros right of the abscissa cannot be reached by the Laplace form at 0.9477 (abscissa 0.8927): check there
s2 = mpc('0.947668672027624543005373227121', '-0.78467556064668356072060760188')
out['1+R at 1-s_2 by the Laplace form (independent of the entire form)'] = nstr(abs(1 + Rlap(s2)), 5)
s3 = mpc(1 - mpf('0.0709394503552516570129859039476'), '-0.923959535323096040783715927556')
out['1+R at 1-s_3 by the Laplace form'] = nstr(abs(1 + Rlap(s3)), 5)
out['R\'(1-s_2) (simple zero if nonzero)'] = nstr(dRlap(s2), 12)
out['zeta(1-s_2)'] = nstr(zeta(s2), 12)
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'checks_newman.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
