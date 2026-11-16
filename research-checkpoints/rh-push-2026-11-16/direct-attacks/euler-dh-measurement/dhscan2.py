import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pick import L_dh, nodes, ldl_min
a,b = mp.mpf(sys.argv[1]), mp.mpf(sys.argv[2])
for N in [int(n) for n in sys.argv[3].split(",")]:
    mp.mp.dps = 40 + 8*N
    fail, piv = ldl_min(nodes(N,a,b), L_dh)
    print("DH [%s,%s] N=%d dps=%d"%(sys.argv[1],sys.argv[2],N,mp.mp.dps), "FAIL at %s"%fail if fail else "PD", "minpiv", mp.nstr(min(piv),4), flush=True)
