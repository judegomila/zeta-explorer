import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pick import L_dh, L_zeta, nodes, ldl_min
def first_fail(L, a, b, Nlo, Nhi, extra=0):
    for N in range(Nlo, Nhi+1):
        mp.mp.dps = 30 + 3*N + extra
        fail, piv = ldl_min(nodes(N,mp.mpf(a),mp.mpf(b)), L)
        if fail: return N
    return None
for (a,b) in [(0.05,3),(0.05,1),(0.5,6),(1,12),(0.01,0.5)]:
    n1 = first_fail(L_dh,a,b,8,45)
    n2 = first_fail(L_dh,a,b,max(8,(n1 or 45)-3),45,extra=60) if n1 else None
    print("DH nodes [%s,%s]: first indefinite N=%s (dps+60 recheck: %s)"%(a,b,n1,n2), flush=True)
