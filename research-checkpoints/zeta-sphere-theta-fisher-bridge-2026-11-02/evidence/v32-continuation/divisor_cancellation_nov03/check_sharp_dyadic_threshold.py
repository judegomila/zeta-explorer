import math
N=2**21
spf=list(range(N+1))
for p in range(2,math.isqrt(N)+1):
 if spf[p]==p:
  for n in range(p*p,N+1,p):
   if spf[n]==n: spf[n]=p
E=[0]*(N+1); V=[0]*(N+1); S=[0]*(N+1); failures=[]; margin=None
for n in range(2,N+1):
 p=spf[n]; m=n//p; e=E[m]+1 if m%p==0 else 1; E[n]=e;V[n]=V[m]+(p==2)
 q=(p**4).bit_length()-1
 S[n]=S[m]+(2*e+1)*q*q
 if n>=107521:
  gap=S[n]-48*(6+5*V[n]); margin=gap if margin is None else min(margin,gap)
  if gap<0:failures.append((n,gap))
assert not failures
assert 3**100<2**159 and 5**100<2**233 and 7**100<2**281
assert 159**2+233**2+281**2<16*100**2
print('exact rational bound checks passed; minimum scaled margin:',margin)
print('counterexample n=107520 certified via integer power comparisons')
