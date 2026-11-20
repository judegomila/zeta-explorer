#!/usr/bin/env python3
"""Exact rational coverage, sign and winding checks on saved interval boxes.
This validates finite certificate bookkeeping. Regeneration is still necessary
for checking genuine-function containment via analytic quadrature and remainders.
"""
import json,sys
from fractions import Fraction as Q

def box(s):
    b=[[Q(x) for x in s['box_exact'][name]] for name in ['real','imag']]
    assert all(lo<=hi for lo,hi in b)
    assert any(lo>0 or hi<0 for lo,hi in b),'Image rectangle fails origin exclusion'
    return b

def main(path):
    data=json.load(open(path)); segs=data['segments'];cells=data['interior_cells']
    expected=[('x=200',-Q(1,4),Q(1,4)),('t=1/2',Q(-10),Q(10)),('x=220',Q(1,4),-Q(1,4)),('t=0',Q(10),Q(-10))]
    i=0
    for name,start,end in expected:
        current=start;count=0
        while i<len(segs) and segs[i]['edge']==name:
            a,b=Q(segs[i]['a']),Q(segs[i]['b'])
            assert a==current and (b-a)*(end-start)>0
            current=b;count+=1;i+=1
        assert count and current==end
    assert i==len(segs)
    boxes=[box(s) for s in segs]
    # Choose an exact rational vertex in each consecutive-box intersection.
    # The actual shared field endpoint belongs to this intersection as well.
    vertices=[]
    for i,b in enumerate(boxes):
        prev=boxes[i-1];point=[]
        for axis in range(2):
            lo=max(prev[axis][0],b[axis][0]);hi=min(prev[axis][1],b[axis][1])
            assert lo<=hi,'Consecutive image boxes do not intersect'
            point.append((lo+hi)/2)
        vertices.append(point)
    winding=0
    for i,(x1,y1) in enumerate(vertices):
        x2,y2=vertices[(i+1)%len(vertices)]
        b=boxes[i]
        assert all(b[k][0]<=p[k]<=b[k][1] for p in [vertices[i],vertices[(i+1)%len(vertices)]] for k in range(2))
        cross=x1*y2-x2*y1
        if y1<=0<y2 and cross>0:winding+=1
        if y2<=0<y1 and cross<0:winding-=1
    assert winding==0
    rects=[];area=Q(0)
    for c in cells:
        box(c)
        a,b,e,f=(Q(c[k]) for k in ['dx_a','dx_b','dt_c','dt_d'])
        assert -10<=a<b<=10 and -Q(1,4)<=e<f<=Q(1,4)
        rects.append((a,b,e,f));area+=(b-a)*(f-e)
    for i,(a,b,c,d) in enumerate(rects):
        for e,f,g,h in rects[:i]:
            assert max(a,e)>=min(b,f) or max(c,g)>=min(d,h),'Interior overlap'
    assert area==Q(10)
    print('PASS:',path,len(segs),'continuous edge cells;',len(cells),'closed interior cells; exact polygon winding=0; area=10.')
    print('Scope: verifies saved enclosure geometry; analytic containment is checked by regenerating with certify_boundary.py and reviewing PROOF.md.')

if __name__=='__main__':
    for path in sys.argv[1:] or ['certificate_384.json','certificate_512.json']:main(path)
