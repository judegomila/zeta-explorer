# Sign-twist control. L_eps(x) = G(x) - sum eps_n Lambda(n) n^{-1/2-x}, x > 1/2, G = gamma + pole part of xi'/xi.
# eps=1: zeta. eps=-1: G - zeta'/zeta. eps=0: G. eps_n = cos(t0 log n): G + Re-average of zeta'/zeta(s +- i t0).
# Sector matrices by the same formulas on nodes x in [0.6,4] (s = x^2 in [0.36,16]). Also identity checks.
import mpmath as mp, sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sectors import nodes, mats, first_fail
mp.mp.dps = 400; N = 14
def G(x):
    s = mp.mpf(1)/2 + x
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2, -1/s**2 - 1/(s-1)**2 + mp.polygamma(1,s/2)/4
def zl(s):   # zeta'/zeta and its derivative
    z,z1,z2 = mp.zeta(s), mp.zeta(s,1,1), mp.zeta(s,1,2)
    return z1/z, z2/z-(z1/z)**2
def Leps(kind, t0=None):
    def L(x):
        g,dg = G(x); s = mp.mpf(1)/2+x
        if kind=="zeta": a,b = zl(s)
        elif kind=="minus": a,b = zl(s); a,b = -a,-b
        elif kind=="zero": a,b = 0,0
        elif kind=="cos": a,b = zl(mp.mpc(s,t0)); a,b = mp.re(a), mp.re(b)   # (1/2)(f(s+it0)+f(s-it0)) = Re f(s+it0)
        return g+a, dg+b
    return L
xs = nodes(N, mp.mpf('0.6'), mp.mpf(4))
rows=[]
for name,L in [("eps=+1 (zeta)",Leps("zeta")),("eps=-1",Leps("minus")),("eps=0 (gamma+pole only)",Leps("zero")),
               ("eps_n=cos(5 log n)",Leps("cos",mp.mpf(5))),("eps_n=cos(14.1347 log n)",Leps("cos",mp.im(mp.zetazero(1)))),
               ("eps_n=cos(0.5 log n)",Leps("cos",mp.mpf('0.5')))]:
    J=[L(x) for x in xs]; P,Ke,Ko = mats(xs,[j[0] for j in J],[j[1] for j in J])
    r={"case":name}
    for nm,K in (("P",P),("Ke",Ke),("Ko",Ko)): r[nm]=first_fail(K)[0]
    print(r, flush=True); rows.append(r)
# identity check: e^{-c sqrt s}/sqrt s = int_0^inf cos(c sqrt r)/(pi sqrt r) dr/(s+r)  (substitute r=y^2)
mp.mp.dps = 30
chk=[]
for c,s in [(mp.log(2),mp.mpf('0.7')),(mp.log(7),mp.mpf(3))]:
    lhs = mp.exp(-c*mp.sqrt(s))/mp.sqrt(s)
    rhs = (2/mp.pi)*mp.quadosc(lambda y: mp.cos(c*y)/(s+y*y), [0, mp.inf], omega=c)
    chk.append(mp.nstr(abs(lhs-rhs),3))
print("signed Stieltjes density check |lhs-rhs|:", chk)
json.dump({"N":N,"nodes":"vdC log on [0.6,4]","rows":rows,"density_check":chk}, open("twist_control.json","w"), indent=1)
