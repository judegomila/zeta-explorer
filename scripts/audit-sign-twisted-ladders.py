"""Exact finite algebra checks. No RH or infinite-convergence assertion."""
from fractions import Fraction as Q
from itertools import product
from math import prod

primes = (2, 3, 5, 7)
signs = list(product((-1, 1), repeat=len(primes)))


def zeta(s):
    return prod(1/(1-Q(1, p**s)) for p in primes)


def twisted(eps, s):
    return prod(1/(1-e*Q(1, p**s)) for e, p in zip(eps, primes))


def squarefree(eps, s):
    return prod(1+e*Q(1, p**s) for e, p in zip(eps, primes))


checks = 0
for eps in signs:
    assert twisted(eps, 2)*twisted(tuple(-e for e in eps), 2) == zeta(4)
    checks += 1
assert sum(twisted(eps, 2) for eps in signs)/len(signs) == zeta(4)
checks += 1
assert sum(prod(1+e for e in eps)*twisted(eps, 2) for eps in signs)/len(signs) == zeta(2)
checks += 1
assert sum(squarefree(eps, 2)*squarefree(eps, 3) for eps in signs)/len(signs) == zeta(5)/zeta(10)
checks += 1
assert twisted((-1,)*len(primes), 2) == zeta(4)/zeta(2)
checks += 1
for depth in range(5):
    hierarchy = prod(prod(1+Q(1, p**(2*2**j)) for p in primes) for j in range(depth+1))
    assert hierarchy == zeta(2)/zeta(2*2**(depth+1))
    checks += 1
assert sum(prod(1+e for e in eps)**2 for eps in signs)/len(signs) == 2**len(primes)
checks += 1
print(f'PASS: {checks} exact rational sign-twist checks; no RH or continuation claim.')
