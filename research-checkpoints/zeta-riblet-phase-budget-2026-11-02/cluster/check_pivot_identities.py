"""Exact polynomial controls for the zeta cluster sign tests. Requires SymPy."""
from sympy import Matrix, Poly, QQ, Rational, Symbol, integrate, prod, sign

x = Symbol('x')


def check_last_pivot(m, delta):
    # The pair at zero is real, double or nonreal according to the sign of delta.
    singles = range(1, m-1)
    polynomial = Poly((x**2-delta)*prod(x-a for a in singles), x, domain=QQ)
    moments = [sum(a**j for a in singles)+(2*delta**(j//2) if j % 2 == 0 else 0)
               for j in range(2*m-1)]

    def block(k):
        return Matrix(k, k, lambda i, j: moments[i+j])

    def monic(k):
        if k == 0:
            return Poly(1, x, domain=QQ)
        vector = block(k).inv()*Matrix([-moments[k+i] for i in range(k)])
        return Poly(x**k+sum(a*x**i for i, a in enumerate(vector)), x, domain=QQ)

    minors = [block(k).det() for k in range(m+1)]
    assert all(d > 0 for d in minors[:-1])
    last, previous = minors[m]/minors[m-1], minors[m-1]/minors[m-2]
    assert sign(last) == sign(delta)
    # Check the identity at every node simultaneously by exact polynomial division.
    assert (polynomial+(last/previous)*monic(m-2)).rem(monic(m-1)).is_zero


def check_critical_values(nodes):
    # Construct a monic primitive with these rational critical nodes.
    m = len(nodes)+1
    primitive = integrate(m*prod(x-c for c in nodes), x)
    critical = [primitive.subs(x, c) for c in nodes]
    lower = [v for j, v in enumerate(critical, 1) if (m-j) % 2 == 0]
    upper = [v for j, v in enumerate(critical, 1) if (m-j) % 2 == 1]
    levels = sorted(set(critical))
    shifts = [levels[0]-1, *levels, levels[-1]+1]
    shifts.extend((a+b)/2 for a, b in zip(levels, levels[1:]))
    for level in shifts:
        p = Poly(primitive-level, x, domain=QQ)
        predicted = (not lower or min(lower) >= level) and (not upper or max(upper) <= level)
        count_real = sum(multiplicity for _, multiplicity in p.intervals())
        assert predicted == (count_real == m)
        if predicted and level not in levels:
            assert p.gcd(p.diff()).degree() == 0
    return len(shifts)


if __name__ == '__main__':
    for degree in range(2, 9):
        for split in (-1, 0, 1):
            check_last_pivot(degree, Rational(split, 10**6))
    nodes_to_check = [(0,), (-2, 3), (-3, -1, 2), (-2, -1, 1, 4),
                      (-2, 0, 0, 3), (0, 0, 0), (-2, -2, 1, 1)]
    cases = sum(check_critical_values(nodes) for nodes in nodes_to_check)
    print(f"21 exact pivot identities and {cases} critical-value cases passed")
