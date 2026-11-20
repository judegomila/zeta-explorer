import numpy as np, json, glob, os
H=os.path.dirname(os.path.abspath(__file__))
for f in ["w_Z128000.npz","w_Z512000.npz","g_Z128000.npz","g_Z512000.npz","g_Z2048000.npz"]:
    d=np.load(os.path.join(H,f)); Np=d["Np"].astype(int)
    print(f, "N=",len(Np), {n:(int(Np[0]),int(Np[n-1])) for n in [8,12,16,24,32,48,80,120,121,160] if n<=len(Np)}, "last",Np[-1])
for f in sorted(glob.glob(os.path.join(H,"overlap_x_*.json"))):
    d=json.load(open(f)); nat={128000:10,512000:15,2048000:24}[int(d["Z"])]
    print(int(d["Z"]), {r["variant"]:round(r["kappa"],3) for r in d["rows"] if r["n"]==nat})
for f in sorted(glob.glob(os.path.join(H,"cert_g_*.json"))):
    d=json.load(open(f))
    print(int(d["Z"]), [(r["n"],r["tag"],round(r["ratio_lower"],4),round(r["ratio_upper"],4)) for r in d["runs"] if r["variant"]=="T6"])
    print(int(d["Z"]), "Q0", [(r["n"],round(r["ratio_upper"],3)) for r in d["runs"] if r["variant"]=="Q0"])
w=[]
for f in glob.glob(os.path.join(H,"cert_*.json")):
    for r in json.load(open(f))["runs"]:
        w.append((r["variant"], (r["ratio_upper"]-r["ratio_lower"])/r["ratio_upper"], r["certified"]))
import collections
dd=collections.defaultdict(list)
for v,x,c in w: dd[v].append(x)
print({v:(f"{min(x):.1e}",f"{max(x):.1e}",len(x)) for v,x in dd.items()}, "all certified", all(c for _,_,c in w), len(w))
