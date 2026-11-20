"""Independently authored exact symbolic Bell/determinant identities."""
import sympy as s
X,Y,Z,W,V,t=s.symbols('X Y Z W V t')
ells={1:-X,2:Y,3:-Z,4:W,5:-V}
a=[s.Integer(1)]
for n in range(1,6):
 a.append(s.expand(sum(j*(2*ells[j]/s.factorial(2*j))*a[n-j] for j in range(1,n+1))/n))
mu=[s.expand((-1)**j*s.factorial(2*j)*a[j]) for j in range(6)]
expected_mu5=2*V+180*X*W+840*Y*Z+5040*X**2*Z+12600*X*Y**2+50400*X**3*Y+30240*X**5
assert s.expand(mu[5]-expected_mu5)==0
O=s.Matrix([[mu[j+k+1] for k in range(3)] for j in range(3)])
expected=192*V*X**4+144*V*X**2*Y+8*V*X*Z-8*V*Y**2-8*W**2*X+9600*W*X**5+3360*W*X**3*Y-80*W*X**2*Z-1360*W*X*Y**2+16*W*Y*Z+368640*X**9+1198080*X**7*Y+168960*X**6*Z+867840*X**5*Y**2+115200*X**4*Y*Z+220800*X**3*Y**3-992*X**3*Z**2+53440*X**2*Y**2*Z-56000*X*Y**4+3536*X*Y*Z**2-2240*Y**3*Z-8*Z**3
assert s.expand(O.det()-expected)==0
E=s.Matrix([[mu[j+k] for k in range(3)] for j in range(3)])
expected4=4*(4*W*X**2+W*Y+768*X**6+1344*X**4*Y+128*X**3*Z+304*X**2*Y**2+68*Y**3-Z**2)
assert s.expand(E.det()-expected4)==0
print('Bell coefficient, H4 even determinant and H5 odd determinant identities PASS.')
