"""Own-source symbolic smoke tests; proofs are in RELAXATION.md."""
import sympy as S
x,a,l,s=S.symbols('x a l s', real=True)
z=x+S.I*a
F=z*z+1-2*l
M=S.expand_complex(F*S.conjugate(F)).expand()
W=S.diff(M,a)/2
G=2*z
WG=S.diff(S.expand_complex(G*S.conjugate(G)),a)/2
assert S.simplify(S.diff(W,l)+S.diff(W,x,2)-2*WG)==0
Ms=S.exp(-2*s*(x*x-a*a))*M
assert S.simplify(S.diff(Ms,a)/2-S.exp(-2*s*(x*x-a*a))*(W+2*s*a*M))==0
print('PASS: polynomial Newman forcing and exact Gaussian multiplier bridge correction.')
