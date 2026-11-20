# job: for w in list, the midpoints between consecutive on-line zeros (double scan) up to 160, plus two points just outside; signs must alternate
import numpy as np, pickle, json, sys
P=pickle.load(open(sys.argv[1],'rb'))['res']; job=[]
for w in (0.8,0.9,1.0,1.1,1.25,2.0,1.5,3.0):
    z=P[w]['zeros']; z=z[z<160]
    pts=np.concatenate([[z[0]-0.5],(z[1:]+z[:-1])/2,[z[-1]+0.2]])
    for t in pts: job.append(dict(w=repr(float(w)),tau=repr(round(float(t),6)),kind='mid'))
    for t in P[w]['ext_tau']:
        if 10<t<160: job.append(dict(w=repr(float(w)),tau=repr(round(float(t),6)),kind='posmin'))
json.dump(job,open(sys.argv[2],'w'))
print(len(job))
