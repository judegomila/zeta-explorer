import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dh import f
mp.mp.dps=30
print("f on real axis:", [(float(x), mp.nstr(mp.re(f(mp.mpf(x))),5)) for x in (0.5,0.6,0.8,1.0,1.5,2,3)])
def count(s0, s1, n=400):
    # argument principle on rectangle with corners s0 (lower-left), s1 (upper-right)
    pts = []
    a,b = mp.re(s0),mp.re(s1); c,d = mp.im(s0),mp.im(s1)
    for k in range(n): pts.append(mp.mpc(a+(b-a)*k/n, c))
    for k in range(n): pts.append(mp.mpc(b, c+(d-c)*k/n))
    for k in range(n): pts.append(mp.mpc(b-(b-a)*k/n, d))
    for k in range(n): pts.append(mp.mpc(a, d-(d-c)*k/n))
    pts.append(pts[0])
    tot = 0
    prev = f(pts[0])
    for p in pts[1:]:
        cur = f(p); dd = mp.arg(cur/prev); tot += dd; prev = cur
    return tot/(2*mp.pi)
for (lo,hi) in [(0.01,20),(20,40),(40,60),(60,84),(84,88)]:
    print("zeros with 0.52<Re s<3, %g<Im<%g:"%(lo,hi), mp.nstr(count(mp.mpc(0.52,lo), mp.mpc(3,hi), 600),4), flush=True)
