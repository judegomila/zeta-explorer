# summarize a gates_arb json: per level, which gates fail (certified '-') / undecided ('?') at which t; first failing level >= kmin
import json, sys
G=["u>0","v>0","H'<0","B'>0","J'>0","HBconv","JBconv"]
res=json.load(open(sys.argv[1])); kmin=int(sys.argv[2]) if len(sys.argv)>2 else 1
R=res[0]; K=R["K"]
rs=R["r_sign"]; neg=[k for k,c in enumerate(rs) if c=='-']
print("# %s a=%s K=%d prec=%d t-grid=%s"%(R["name"],R["a"],K,R["prec"],",".join(x["t"] for x in res)))
print("  r_k: first negative k =",neg[0] if neg else None,"; undecided:",rs.count('?'))
first=None; und=0
for k in range(K+1):
    fails={}
    for x in res:
        s=x["rows"][k]["s"]
        for i,c in enumerate(s):
            if c=='-': fails.setdefault(G[i],[]).append(x["t"])
            if c=='?': und+=1
    if fails and k>=kmin and first is None: first=k
    if fails and (k<=1 or (first is not None and k<=first+4)):
        print("  level %3d FAIL: "%k+"; ".join("%s at t=%s"%(g,",".join(ts)) for g,ts in fails.items()))
print("  first level >= %d with a certified failing sign: %s ; undecided signs in table: %d ; worst rel radius at top level: 1e%d"%(kmin,first,und,max(x["rows"][K]["rel"] for x in res)))
