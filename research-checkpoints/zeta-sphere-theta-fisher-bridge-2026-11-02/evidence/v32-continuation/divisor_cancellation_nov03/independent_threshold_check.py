from array import array
N=2**21
S=array('q',[0])*(N+1); V=array('b',[0])*(N+1)
prime=bytearray(b'\1')*(N+1);prime[:2]=b'\0\0'
for p in range(2,N+1):
 if not prime[p]: continue
 if p*p<=N: prime[p*p:N+1:p]=b'\0'*((N-p*p)//p+1)
 q=(p**4).bit_length()-1
 power=p;a=1
 while power<=N:
  for n in range(power,N+1,power):
   S[n]+=(2*a+1)*q*q
   if p==2: V[n]+=1
  power*=p;a+=1
m=min(S[n]-48*(6+5*V[n]) for n in range(107521,N+1))
assert m==11
assert 107520==2**10*3*5*7
assert all(p**100<2**q for p,q in [(3,159),(5,233),(7,281)])
assert 159**2+233**2+281**2<160000
print('Independent prime-power accumulation PASS; exhaustive minimum:',m)
