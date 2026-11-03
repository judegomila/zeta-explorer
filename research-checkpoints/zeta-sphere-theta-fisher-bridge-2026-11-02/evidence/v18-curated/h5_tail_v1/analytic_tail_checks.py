from fractions import Fraction as Q
from math import factorial
# Exact geometric sums from repeated t*d/dt applied to t/(1-t), t=3/64.
assert Q(14969856,13845841)<2
assert Q(487864086528,51520374361)<10
assert Q(32076531364970496,191707312997281)<168
assert Q(3679623694539785699328,713342911662882601)<5159
assert Q(7,8)*Q(127,128)>Q(55,64)
assert Q(factorial(10)*16**10,2**103)<1
assert Q(25,8)*Q(41,32)>4
# Each tuple: absolute coefficient, powers of X,Y,Z,W,V.
terms=[(192,4,0,0,0,1),(144,2,1,0,0,1),(8,1,0,1,0,1),(8,0,2,0,0,1),(8,1,0,0,2,0),(9600,5,0,0,1,0),(3360,3,1,0,1,0),(80,2,0,1,1,0),(1360,1,2,0,1,0),(16,0,1,1,1,0),(1198080,7,1,0,0,0),(168960,6,0,1,0,0),(867840,5,2,0,0,0),(115200,4,1,1,0,0),(220800,3,3,0,0,0),(992,3,0,2,0,0),(53440,2,2,1,0,0),(56000,1,4,0,0,0),(3536,1,1,2,0,0),(2240,0,3,1,0,0),(8,0,0,3,0,0)]
cost=sum(Q(c*5**y*17**z*90**w*300**v,127**(9-x-y-z-w-v)) for c,x,y,z,w,v in terms)
assert cost<68640
print('All analytic-tail exact rational checks passed.')
print('Exact cost =',cost)
