# aggregate.py rundir out.npz : merge per-window outputs
import sys, glob, numpy as np
fs=sorted(glob.glob(sys.argv[1]+"/w*.npz"))
hist=None; recs=[]; trip=[]; big=[]; rows=[]; unres=[]
for f in fs:
    z=np.load(f)
    hist=z["hist"].astype(np.int64) if hist is None else hist+z["hist"]
    if len(z["recs"]): recs.append(z["recs"])
    trip.append(z["trip"]); big.append(z["big"])
    if len(z["unres"]): unres.append(np.column_stack([np.full(len(z["unres"]),int(z["j"])),z["unres"]]))
    rows.append([int(z["j"]),int(z["T0"]),int(z["nown"]),float(z["expc"]),float(z["zmax"][0]),float(z["zmax"][1]),float(z["h"]),int(z["L"]),float(z["s2"]),float(z["timing"].sum()),int(z["over"])])
rows=np.array(rows,dtype=object)
recs=np.concatenate(recs); trip=np.concatenate(trip); big=np.concatenate(big)
unres=np.concatenate(unres) if unres else np.zeros((0,3))
np.savez(sys.argv[2],hist=hist,recs=recs,trip=trip,big=big,unres=unres,
         j=rows[:,0].astype(np.int64),T0=rows[:,1].astype(np.int64),nown=rows[:,2].astype(np.int64),expc=rows[:,3].astype(float),
         zmaxk=rows[:,4].astype(float),zmax=rows[:,5].astype(float),h=rows[:,6].astype(float),L=rows[:,7].astype(np.int64),s2=rows[:,8].astype(float),over=rows[:,10].astype(np.int64))
n=rows[:,2].astype(np.int64); d=n-rows[:,3].astype(float)
print("windows",len(fs),"zeros",n.sum(),"sum disc",d.sum(),"max|disc|",np.abs(d).max(),"unres",len(unres),"close recs",len(recs))
print("min gap",recs[:,4].min(),"min trip",trip[:,5].min(),"max gap",big[:,4].max(),"max|Z|",rows[:,5].astype(float).max())
