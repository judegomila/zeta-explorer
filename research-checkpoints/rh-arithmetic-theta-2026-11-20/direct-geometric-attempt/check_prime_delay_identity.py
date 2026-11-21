"""Exact entrywise checks for the prime-delay Gram/counterterm identity.

The coefficient Lambda(n)/sqrt(n) is a common factor and is cancelled.
Rates are positive integers, a=1, and each delay is log(n), so every
remaining entry is rational. The universal proof is in the companion note.
"""
from fractions import Fraction
import json
from pathlib import Path


def main():
    count = 0
    nonzero_negative_counterterms = 0
    for n in (2, 3, 4, 5, 8, 9, 16):
        r = Fraction(1, n)
        for x in (1, 2, 3, 4):
            for y in (1, 2, 3, 4):
                qx, qy = Fraction(1, n**x), Fraction(1, n**y)
                gradient = (qx-r)*(qy-r)/(r*(x+y))
                potential = (qx*qy/r+r)/(x+y)
                signed = -(qx+qy)/(x+y)
                assert gradient-potential == signed
                if x == y:
                    assert potential > 0 and signed < 0
                    nonzero_negative_counterterms += 1
                if x == y == 1:
                    assert gradient == 0
                count += 1
    result = {
        'exact_entrywise_identities': count,
        'negative_counterterm_controls': nonzero_negative_counterterms,
        'status': 'passed',
        'scope': 'Finite exact arithmetic checks; no RH proof or infinite inequality verification.'
    }
    Path(__file__).with_name('prime_delay_identity_checks.json').write_text(
        json.dumps(result, indent=2)+'\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
