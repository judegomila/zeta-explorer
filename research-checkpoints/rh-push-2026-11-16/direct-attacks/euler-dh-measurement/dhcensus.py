import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dh import f, Lam
from pick import L_dh
mp.mp.dps=60
for x in ('0.01','0.2','0.5'):
    x=mp.mpf(x); s=mp.mpf(1)/2+x
    print("L_dh check", mp.nstr(L_dh(x)-mp.diff(lambda t: mp.log(Lam(t)), s),5), "L_dh(-x)+L_dh(x)=", mp.nstr(mp.diff(lambda t: mp.log(Lam(t)), mp.mpf(1)/2-x)+L_dh(x),5))
mp.mp.dps=25
def count(a,b,c,d,n=300):
    pts=[mp.mpc(a+(b-a)*k/n,c) for k in range(n)]+[mp.mpc(b,c+(d-c)*k/n) for k in range(n)]+[mp.mpc(b-(b-a)*k/n,d) for k in range(n)]+[mp.mpc(a,d-(d-c)*k/n) for k in range(n)]
    pts.append(pts[0]); tot=0; prev=f(pts[0])
    for p in pts[1:]:
        cur=f(p); tot+=mp.arg(cur/prev); prev=cur
    return int(mp.nint(tot/(2*mp.pi)))
found=[]
for h in range(80,400,10):
    c = count(0.505,2.5,h,h+10)
    if c:
        # locate by gridded findroot
        for re0 in (0.55,0.65,0.75,0.85,1.0,1.2):
            for im0 in [h+0.5*k for k in range(21)]:
                try:
                    r=mp.findroot(f, mp.mpc(re0,im0))
                except Exception: continue
                if 0.505<mp.re(r)<2.5 and h<=mp.im(r)<h+10 and all(abs(r-q)>1e-8 for q in found): found.append(r)
        print(h, "count", c, "found so far", len(found), flush=True)
for r in found: print("offline", mp.nstr(r,15))
