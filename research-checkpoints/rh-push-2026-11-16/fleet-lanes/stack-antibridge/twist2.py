# Twists that keep the pole at s=1 cancelled: eps_n = 1 except on powers of one prime p, where eps = e.
# L_eps = L_zeta + (1-e) log p /(p^s - 1), s = 1/2 + x.
import mpmath as mp, sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sectors import nodes, mats, first_fail, L_zeta
N = 40; mp.mp.dps = 80 + 18*N
xs = nodes(N, mp.mpf('0.6'), mp.mpf(4)); base = [L_zeta(x) for x in xs]
rows=[]
for p,e in [(2,-1),(2,mp.mpf('0.99')),(101,-1),(10007,-1),(1000003,-1),(10**9+7,-1),(10**12+39,-1)]:
    lp = mp.log(p); Lv=[]; dLv=[]
    for x,(v,dv) in zip(xs,base):
        s = mp.mpf(1)/2+x; q = mp.power(p,s)
        Lv.append(v + (1-e)*lp/(q-1)); dLv.append(dv - (1-e)*lp*lp*q/(q-1)**2)
    P,Ke,Ko = mats(xs,Lv,dLv); r={"p":p,"eps_p":mp.nstr(e,4)}
    for nm,K in (("P",P),("Ke",Ke),("Ko",Ko)): r[nm]=first_fail(K)[0]
    print(r, flush=True); rows.append(r)
json.dump({"N":N,"nodes":"vdC log on [0.6,4]","rows":rows}, open("twist2.json","w"), indent=1)
