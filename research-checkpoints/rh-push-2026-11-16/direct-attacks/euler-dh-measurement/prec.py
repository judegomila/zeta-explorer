import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pick import L_zeta, L_dh, nodes, ldl_min
a,b = mp.mpf(sys.argv[1]), mp.mpf(sys.argv[2]); L = L_zeta if sys.argv[3]=="zeta" else L_dh
for N in [int(n) for n in sys.argv[4].split(",")]:
    for k in (3,6,9):
        mp.mp.dps = 40 + k*N
        fail, piv = ldl_min(nodes(N,a,b), L)
        print(sys.argv[3], N, "dps",mp.mp.dps, "fail",fail, "minpiv", mp.nstr(min(piv),4), flush=True)
