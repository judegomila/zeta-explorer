import numpy as np
q = 7
S = np.load('S.npy'); R = np.load('R.npy'); deg = (R != 0).cumsum(axis=1).argmax(axis=1)
print('p_n(r) = S_n(r) - q^4 S_{n-3}(r); table: max |p_n| / q^(3n/2) and max |S_n| / q^(4n/3) over monic r of each degree')
print('deg r | ' + ' | '.join(f'n={n}' for n in range(7)))
for k in range(5):
    sel = deg == k; row = []
    for n in range(7):
        p = S[n, sel] - (q ** 4 * S[n - 3, sel] if n >= 3 else 0)
        row.append(f'{np.abs(p).max() / q ** (1.5 * n):.3e}')
    print(f'{k}     | ' + ' | '.join(row))
print('max |S_n| / q^(4n/3):')
for k in range(5):
    sel = deg == k
    print(k, ' | '.join(f'{np.abs(S[n, sel]).max() / q ** (4 * n / 3):.4f}' for n in range(7)))
print('fraction of r with p_n != 0 (|p_n| > 1e-6 q^(3n/2)):')
for k in range(5):
    sel = deg == k
    print(k, ' | '.join(f'{np.mean(np.abs(S[n, sel] - (q ** 4 * S[n - 3, sel] if n >= 3 else 0)) > 1e-6 * q ** (1.5 * n)):.3f}' for n in range(7)))
print('zeta-normalised: a(u) = psi(r,u) (1 - q^4 u^3) / (1 - q^3 u^3); max |a_n| / q^(3n/2) by deg r (claim: a_n = 0 for n > deg r + 1)')
for k in range(5):
    sel = deg == k; a = []
    for n in range(7):
        p = S[n, sel] - (q ** 4 * S[n - 3, sel] if n >= 3 else 0)
        a.append(p + (q ** 3 * a[n - 3] if n >= 3 else 0))
    print(k, ' | '.join(f'{np.abs(x).max() / q ** (1.5 * n):.3e}' for n, x in enumerate(a)))
