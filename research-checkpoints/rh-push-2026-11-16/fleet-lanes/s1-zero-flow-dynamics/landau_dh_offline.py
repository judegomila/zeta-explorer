"""Davenport-Heilbronn, T = 2000: Landau mean on the on-line ordinates alone and with the 84 off-line pairs of the battery table
(push/c12-control-battery-harness/tables/zeros_DH.json, read as data) added: M = (2 pi sqrt(n)/T) [ sum_on n^{i gamma} + sum_pairs (n^{beta-1/2} + n^{1/2-beta}) n^{i gamma} ]
against -Lambda_f(n) (coefficients of -f'/f)."""
import json, math, numpy as np
T = 2000.0
d = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
on_tab = np.array([float(v) for v in d['online']]); off = np.array([[float(a), float(b)] for a, b, _ in d['offline']])
g = np.load('data/dir2e5_dh.npy'); g = g[g <= T]
print('on-line ordinates below 2000: this lane %d, battery table %d ; max difference %.2e ; off-line pairs %d' % (len(g), len(on_tab), np.abs(g - on_tab[:len(g)]).max() if len(g) == len(on_tab) else float('nan'), len(off)))
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1); CHI = {0: 0, 1: 1, 2: 1j, 3: -1j, 4: -1}
a = [0] + [np.real(CHI[n % 5]) + KAPPA * np.imag(CHI[n % 5]) for n in range(1, 41)]; lam = [0] * 41
for n in range(2, 41): lam[n] = a[n] * math.log(n) - sum(lam[q] * a[n // q] for q in range(2, n) if n % q == 0)
print('   n   -Lambda_f(n)   on-line only        on-line + off-line pairs')
for n in (2, 3, 4, 6, 7, 9, 11, 13):
    ln = math.log(n); c = 2 * math.pi * math.sqrt(n) / T
    So = np.exp(1j * ln * g).sum(); Sf = ((n ** (off[:, 0] - 0.5) + n ** (0.5 - off[:, 0])) * np.exp(1j * ln * off[:, 1])).sum()
    print('  %2d   %+.4f     %+.4f%+.4fi   %+.4f%+.4fi' % (n, -lam[n], (c * So).real, (c * So).imag, (c * (So + Sf)).real, (c * (So + Sf)).imag))
