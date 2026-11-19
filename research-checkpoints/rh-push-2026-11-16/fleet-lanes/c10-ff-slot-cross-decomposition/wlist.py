"""wlist.py q : the weight list of the pre-registered runs (name, 'mode p1 p2 p3 p4'), in kernel order."""
import sys
from plan import weights
NSEED = 8
def wlist(q):
    W = weights(q); out = []
    for name in ('one', 'a', 'b' if q == 7 else 'c4', 'mu', 'al'):
        m, p1, p2, p3 = W[name]; out.append((name, f'{m} {p1} {p2} {p3} 0'))
    for s in range(NSEED): out.append((f'U{s+1}', f'6 {31+s} 0 0 0'))          # random completely multiplicative signs on A' (the model's U class)
    for s in range(NSEED): out.append((f'r{s+1}', f'1 {11+s} 0 0 0'))          # random sixth roots on every column
    m, p1, p2, p3 = W['a']
    for s in range(NSEED): out.append((f'a*e{s+1}', f'{m} {p1} {p2} {p3} {s+1}'))  # target a with random signs on the marked primes
    for s in range(NSEED): out.append((f'mu*e{s+1}', f'4 0 0 0 {s+1}'))        # Liouville-twisted vector with random signs on the marked primes
    return out
if __name__ == '__main__': print(' '.join(w for _, w in wlist(int(sys.argv[1]))))
