"""Owned exact algebra smoke check; not a new theta quadrature certificate."""
import json
import sympy as s
A=s.Matrix([[3,1],[1,2]])
b=s.Matrix([2,-1]); c=s.Integer(6)
L=s.Matrix([[1,2],[2,-1]]); l=s.Matrix([3,1]); cp=s.Integer(-2)
z=-A.inv()*b; T=s.eye(3); T[:2,2]=z
B=A.row_join(b).col_join(b.T.row_join(s.Matrix([[c]])))
Bp=L.row_join(l).col_join(l.T.row_join(s.Matrix([[cp]])))
r=L*z+l; v=z.col_join(s.Matrix([1])); q=(v.T*Bp*v)[0]
pivot=c-(b.T*A.inv()*b)[0]
assert pivot>0 and A.det()>0
assert L.det()<0
assert T.T*B*T==s.diag(A,pivot)
assert T.T*Bp*T==L.row_join(r).col_join(r.T.row_join(s.Matrix([[q]])))
h=s.symbols('h')
Ah=A+h*L; bh=b+h*l; ch=c+h*cp
sh=ch-(bh.T*Ah.inv()*bh)[0]
assert s.simplify(s.diff(sh,h).subs(h,0)-q)==0
print(json.dumps({'status':'PASS','scope':'Exact finite rational congruence and envelope identity smoke test; local derivative indefinite. Theta endpoint premises are prior independent certificates.','known_pivot':str(pivot),'forcing_energy':str((r.T*A.inv()*r)[0]),'signed_source':str(q)},indent=2))
