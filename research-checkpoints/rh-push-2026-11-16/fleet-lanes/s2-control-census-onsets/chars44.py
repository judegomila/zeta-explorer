# Route 44: primitive Dirichlet characters mod q, Gauss sums, root numbers, DH-type twins.
import cmath, math
from math import gcd

def factor(n):
    f = {}; p = 2
    while p*p <= n:
        while n % p == 0: f[p] = f.get(p, 0) + 1; n //= p
        p += 1
    if n > 1: f[n] = f.get(n, 0) + 1
    return f

def cyclic_components(q):
    """list of (modulus m=p^k, generator g, order) for components of (Z/q)^*, via CRT."""
    comps = []
    for p, k in factor(q).items():
        m = p**k
        if p == 2:
            if k >= 2: comps.append((m, m-1, 2))          # -1
            if k >= 3: comps.append((m, 5, 2**(k-2)))
        else:
            phi = m//p*(p-1)
            for g in range(2, m):
                if gcd(g, m) != 1: continue
                o, x = 1, g % m
                while x != 1: x = x*g % m; o += 1
                if o == phi: break
            comps.append((m, g, phi))
    return comps

def characters(q):
    """all characters mod q as dicts n->complex (n in 0..q-1), with exponent tuple."""
    comps = cyclic_components(q)
    # discrete log tables per component; for 2^k use (-1)^e1 5^e2 decomposition
    logs = []
    fac = factor(q)
    tables = []
    for (m, g, o) in comps:
        tables.append((m, g, o))
    units = [n for n in range(q) if gcd(n, q) == 1]
    # brute force: for each unit, find exponent vector
    import itertools
    rep = {}
    for ev in itertools.product(*[range(o) for (_, _, o) in comps]):
        # build residue mod each prime power, then CRT
        parts = {}
        for (m, g, o), e in zip(comps, ev):
            parts.setdefault(m, 1)
            parts[m] = parts[m]*pow(g, e, m) % m
        # CRT
        x = 0; M = 1
        for m, r in parts.items():
            # solve x = r mod m
            while x % m != r: x += M
            M *= m
        x %= q
        rep[x] = ev
    if q == 1: rep = {0: ()}
    chars = []
    for cv in itertools.product(*[range(o) for (_, _, o) in comps]):
        chi = [0j]*q; phase = [None]*q
        for n, ev in rep.items():
            from fractions import Fraction
            ph = sum((Fraction(c*e, o) for c, e, (_, _, o) in zip(cv, ev, comps)), Fraction(0)) % 1
            chi[n] = cmath.exp(2j*math.pi*float(ph)); phase[n] = ph
        chars.append((cv, chi, phase))
    return chars

def is_primitive(q, chi):
    for p in factor(q):
        d = q//p
        for n in range(1, q):
            if gcd(n, q) == 1 and n % d == 1 % d and abs(chi[n]-1) > 1e-9:
                break
        else:
            return False
    return True

def gauss(q, chi):
    return sum(chi[n]*cmath.exp(2j*math.pi*n/q) for n in range(q))

def complex_pairs(q):
    """one representative per conjugate pair {chi, chibar} of primitive non-real characters mod q."""
    out = []; seen = []
    for cv, chi, phase in characters(q):
        if q > 1 and not is_primitive(q, chi): continue
        if max(abs(c.imag) for c in chi) < 1e-9: continue
        conj = [c.conjugate() for c in chi]
        if any(max(abs(a-b) for a, b in zip(conj, s)) < 1e-9 for s in seen): continue
        seen.append(chi)
        delta = 0 if abs(chi[q-1]-1) < 1e-9 else 1
        tau = gauss(q, chi)
        eps = tau/((1j)**delta*math.sqrt(q))
        out.append({'q': q, 'cv': cv, 'chi': chi, 'phase': phase, 'delta': delta, 'eps': eps,
                    'order': min(k for k in range(1, 2*q) if all(abs(c**k-1) < 1e-9 for c, n in zip(chi, range(q)) if gcd(n, q) == 1))})
    return out

def twins(pair):
    """the two real-coefficient same-gamma twins F_theta = Re(e^{i theta} chi(n)), root number +1 and -1."""
    th0 = -cmath.phase(pair['eps'])/2
    res = []
    for w, th in ((+1, th0), (-1, th0 + math.pi/2)):
        a = [(cmath.exp(1j*th)*c).real for c in pair['chi']]
        res.append({'omega': w, 'theta': th, 'a': a, 'a1': a[1]})
    return res

if __name__ == '__main__':
    tot = 0
    for q in range(3, 51):
        ps = complex_pairs(q)
        if ps:
            tot += len(ps)
            print(q, len(ps), [ (p['delta'], p['order'], round(abs(p['eps']),12)) for p in ps])
    print('total pairs', tot)
    # DH check q=5
    for p in complex_pairs(5):
        for t in twins(p):
            print('q=5 delta', p['delta'], 'omega', t['omega'], 'a(0..4)/a1', [round(x/t['a1'], 12) for x in t['a']])
