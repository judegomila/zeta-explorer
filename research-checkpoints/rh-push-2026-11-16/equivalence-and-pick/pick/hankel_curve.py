import sys; sys.path.insert(0, '.')
import mpmath as mp
from hankel_probe import mats
K = int(sys.argv[1])
for e in [-6,-3,-1,0,1,1.5,2,2.3,2.6,3,3.5,4,5,6,8,10,15,20,25,30,40,60]:
    u = 10.0**e
    o = mats(u, K)
    print(e, mp.nstr(o['-h'][0], 4), mp.nstr(o['j'][0], 4))
