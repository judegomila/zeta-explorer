import numpy as np, pickle, json, sys
P=pickle.load(open(sys.argv[1],'rb'))['res']; job=[]
for w in sorted(P):
    z=P[w]['zeros']; z=z[z<400]
    pts=np.concatenate([[z[0]-0.5],(z[1:]+z[:-1])/2,[z[-1]+0.004]])
    for t in pts: job.append(dict(w=repr(round(float(w),3)),tau=repr(round(float(t),6)),kind='mid'))
json.dump(job,open(sys.argv[2],'w')); print(len(job))
# rectangle job for a subset: bottom tau0=0.5 x 0->4, right x=4 tau 0.5->399.9, top tau=399.9 x 4->0   (399.9: no on-line zero within 0.05 for the subset)
job=[]
xs_b=np.arange(0,4.0001,0.1); tr=np.arange(0.5,399.9001,0.2); xs_t=np.concatenate([np.arange(4,1.5,-0.1),np.arange(1.5,-1e-9,-0.02)])
for w in (0.8,0.9,0.93,0.94,1.0,1.02,1.03,1.1,1.2,1.3):
    for i,x in enumerate(xs_b): job.append(dict(w=repr(w),x=repr(round(float(x),4)),tau='0.5',kind='rect',seq=i))
    n0=len(xs_b)
    for i,t in enumerate(tr): job.append(dict(w=repr(w),x='4',tau=repr(round(float(t),4)),kind='rect',seq=n0+i))
    n0+=len(tr)
    for i,x in enumerate(xs_t): job.append(dict(w=repr(w),x=repr(round(float(x),4)),tau='399.9',kind='rect',seq=n0+i))
json.dump(job,open(sys.argv[3],'w')); print(len(job))
