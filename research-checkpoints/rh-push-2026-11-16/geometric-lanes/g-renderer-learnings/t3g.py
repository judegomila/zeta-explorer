from fl import *
print('== axis Laguerre minimum on t in [1,200], step 0.02 ==')
for nm,xi in [('zeta',xi_z),('DH',xi_dh)]:
    vals=[(Gp_line(xi,1+0.02*k),1+0.02*k) for k in range(9951)]
    ng=[t for v,t in vals if v<0]
    print(nm,'min',min(vals),'negative samples',len(ng), 'range' , (min(ng),max(ng)) if ng else None)
    if ng:
        # cluster
        cl=[];
        for t in ng:
            if cl and t-cl[-1][1]<0.05: cl[-1][1]=t
            else: cl.append([t,t])
        print('  negative clusters',[(round(a,2),round(b,2)) for a,b in cl])
