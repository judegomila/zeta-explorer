
## 5. Model against the Z[omega] screen

The caveat of round-9 lesson 1: the model has target excess up to 20.6; the Z[omega] float screen of
`c9-mv6-window-statement` (Z = 2000 to 16000, P about Z^(1/3), 5 or 6 slot primes) has none (THETA ratio at most
1.007), aligned +7 to +40 percent, Liouville +2 to +22 percent.

### 5.1 The two computations were at different geometries

The screen has marks P = Z^(1/3): lam = N/3 in model variables, and then every probe has dual length
r <= N + lam - 1 - d/2 < N in the window: h = r/N < 1. The model excess was found with lam >= 7 at N = 2, that is
P >= Z^(3.5), dual length 6 to 12 = 3N to 6N. In the long-mark runs of this lane the target a is below twice the
diagonal for every lam <= 5 at both q (Table 1 and `tables.md`).

### 5.2 The model at the screen's geometry (EXACT; `ffxs.c`, `short.py`, `results_short/`)

`ffxs.c` = copy of the round-8 kernel `ffx en` with per-prime histograms (short marks; a column may contain
several marked primes, so the cross term has a phase average, as in the screen). Its extra output equals `ffs ens`
on a long-mark configuration (SD, |J_0|^2, SB_0 at (2, 7, 2), two vectors) and its EN line equals `ffx en`. Statistics
as in the screen: ratio = E/D; sd = slot-diagonal part / its phase average; cr = (cross term - its phase average)/D.
Class U here: random multiplicative signs on the cofactor; class r: random phases on the columns; 4 seeds each.
Configurations inside the window N - lam < d < N + lam:

