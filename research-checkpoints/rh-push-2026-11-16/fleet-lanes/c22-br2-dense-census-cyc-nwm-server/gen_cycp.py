from flint import fmpz
import json
out = []
for k in range(6):
    n = 3 ** (2 ** k)
    if fmpz(n).is_prime(): out.append(n); continue
    d = 1
    while True:
        if n - d >= 2 and fmpz(n - d).is_prime(): out.append(n - d); break
        if fmpz(n + d).is_prime(): out.append(n + d); break
        d += 1
json.dump([str(q) for q in out], open('cycp_primes.json', 'w'))
print(out)
