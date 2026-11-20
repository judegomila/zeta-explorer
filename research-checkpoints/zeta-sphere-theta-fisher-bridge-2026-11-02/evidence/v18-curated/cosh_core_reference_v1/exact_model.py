import sympy as s
from math import comb
x=s.symbols('lambda');m=[s.Integer(1)]
for n in range(1,13):m.append(s.expand(x*sum((-1)**j*comb(2*n-1,2*j+1)*m[n-j-1] for j in range(n))))
for J in range(1,9):
 inds=list(range(J%2,J+1,2));G=s.Matrix([[m[(i+j)//2] for j in inds] for i in inds]);det=s.factor(G.det(method='domain-ge'))
 print('J',J,'det',det,flush=True)
