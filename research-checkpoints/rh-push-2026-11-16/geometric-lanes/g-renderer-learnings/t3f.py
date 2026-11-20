from fl import *
import math
zs=[(0.808517182456637385,85.699348485377592),(0.650830080609737082,114.163342730756981),(0.574356050450805991,166.479305913168156),(0.724257694626809780,176.702461242855825)]
print('== axis Laguerre witness at DH off-line feet: L1/Xi^2 = -2/b^2 + screening ==')
for be,ga in zs:
    b=be-0.5; v=Gp_line(xi_dh,ga)
    negs=[k/100 for k in range(-200,201) if Gp_line(xi_dh,ga+k*b/100)<0]
    print('gamma=%.4f b=%.5f pair=-2/b^2=%.3f measured=%.3f screening=%.3f  negative t-interval in units of b: [%s,%s]'%(ga,b,-2/b/b,v,v+2/b/b,min(negs) if negs else None,max(negs) if negs else None))
print('== radial shear profile from each foot (Re xi_DH\'/xi_DH), r in units of b ==')
for be,ga in zs:
    b=be-0.5
    for ang in [5,45,85]:
        row=[]
        for rr in [0.3,0.6,0.9,0.99,1.01,1.1,1.5]:
            x=rr*b*math.cos(math.radians(ang)); y=rr*b*math.sin(math.radians(ang))
            row.append('%.2f:%+.3f'%(rr,float(G(xi_dh,acb(0.5+x,ga+y)).real.mid())))
        print('gamma=%.2f ang=%2d '%(ga,ang),' '.join(row))
print('== finite bridge B_a near first DH pair; Theorem A\' radius^2=b^2-a^2 ==')
be,ga=zs[0]; b=be-0.5
for a in [0.1,0.2,0.3,0.31,0.4]:
    rad2=b*b-a*a; cnt=bad=negin=tot=0
    for i in range(1,41):
        for j in range(-40,41):
            x=i*0.01; y=j*0.01; s=acb(0.5+x,ga+y)
            d=float((abs(xi_dh(s+a)).log()-abs(xi_dh(s-a)).log()).mid())
            ins=x*x+y*y<rad2; tot+=ins
            if d<0: cnt+=1; bad+=(not ins); negin+=ins
    print('a=%.2f radius^2=%+.4f negative=%d outside-disk=%d inside-disk-pts=%d inside-negative=%d'%(a,rad2,cnt,bad,tot,negin))
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
