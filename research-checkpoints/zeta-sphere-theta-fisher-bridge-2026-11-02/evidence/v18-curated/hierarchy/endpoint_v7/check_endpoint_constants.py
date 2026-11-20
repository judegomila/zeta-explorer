"""Original rational checks of conservative Rosser local-count reduction."""
from fractions import Fraction as Q
# ell>=20; pi<22/7 for the positive slope, pi>3 for the negative constant.
slope=Q(35,11)-Q(274,1000)-Q(886,1000)/5-2
constant=Q(20,3)+Q(274,1000)*Q(1,1000)+Q(4926,1000)
assert slope>0 and slope*20>constant
# log(ell+.001)<=ell/5 at ell>=20: derivative 1/5-1/(ell+.001)>0,
# base follows exp(4)>21>20.001 using the positive series terms through degree4.
assert sum(Q(4)**j / __import__('math').factorial(j) for j in range(5))>Q(20001,1000)
assert Q(1,2)/(100+Q(9,4))>Q(1,205)
print('PASS: rational local-count margin at ell=20 =',float(slope*20-constant))
print('PASS: exp(4) lower series and uniform A zero contribution.')
