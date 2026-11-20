from fl import *
import sys
which,t0,t1=sys.argv[1],float(sys.argv[2]),float(sys.argv[3])
xi = xi_z if which=='z' else xi_dh
zs=[(0.808517182456637,85.69934848537759),(0.650830080609737,114.16334273075698),(0.574356050450806,166.479305913168156),(0.72425769462681,176.702461242855825)]
n=0; neg=[]; mn=1e9
k=0
while True:
    t=t0+0.1*k; k+=1
    if t>t1: break
    for i in range(40):
        s0=0.51+0.02*i
        g=float(G(xi,acb(s0,t)).real.mid()); n+=1
        mn=min(mn,g)
        if g<0:
            ins=[j for j,(b0,g0) in enumerate(zs) if (s0-0.5)**2+(t-g0)**2 < (b0-0.5)**2]
            neg.append((round(s0,2),round(t,2),g,ins))
print(which,t0,t1,'points',n,'negative',len(neg),'neg outside half-disks',sum(1 for x in neg if not x[3]),'min Re xi\'/xi',mn)
for x in neg: print(x)
