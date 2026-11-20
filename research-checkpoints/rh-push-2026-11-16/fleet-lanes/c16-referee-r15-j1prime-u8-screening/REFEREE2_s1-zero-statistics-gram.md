# REFEREE2: s1-zero-statistics-gram (screening lane; first independent referee)

Lane `c16-referee-r15-j1prime-u8-screening`, 2026-11-19. The screening lane has no REFEREE.md; this is its first
independent pass, on a sample of its numeric claims and on its structural claim. Own code: `code/loc_screen.py`
(local, zeros table `scripts/.zeros-cache/zeros6` read as text), `code/srv2.py` (server, unit
`rh-c16ref2-1119214854`, 8 cores, 12 GB; four Hurwitz zeta values per point, python-flint 64 bits).
Nothing here is a statement about the location of zeros of zeta.

## Ruling: holds with corrections. No recomputed number failed. Verdict "no survivor" stands.

### Numeric claims recomputed

| claim of the lane | this pass | agrees |
|---|---|---|
| Lambda = 1.573151 (zeta), 2.220724 (q = 5) | 1.5731511, 2.2207237 (`gamma_0^2 + 2 gamma_1 + sum log^2 p/(p-1)^2`, primes to 1e7 plus tail; `+ log^2(5)/4`) | yes |
| GUE small-gap exponent by the Hill estimator, cut 0.2: 2.962 | 2.96247 (series of the GUE gap density to order s^7) | yes |
| zeta, first 2,001,052 zeros: k = 2.952 +- 0.025 | 2.9527 +- 0.0247 (14,280 gaps below 0.2; local mean over 2001 gaps) | yes |
| C(1) = -0.349 (first 2e6 zeros) | -0.34866 | yes |
| DH log-derivative coefficients c(2) = 0.19691, c(4) = -1.44223, c(6) = 1.93636; `c(4) log 2 - c(2)^2 = -1.0385` | 0.1969086, -1.4422320, 1.9363561; -1.0384520 (Dirichlet inverse of the period-5 coefficients) | yes |
| c^(n) from the ordinate list equals Lambda(n) (2e-5 in every block; 3e-7 for the first 2e6) and c^(6) is 0 | with a cos^4 window of my own and the pole term added: c^(2) = 0.69314965, c^(3) = 1.09861321, c^(7) = 1.94591030, c^(37) = 3.61091792 (Lambda: 0.69314718, 1.09861229, 1.94591015, 3.61091791); c^(6) = 2.1e-7, c^(10) = 7.5e-8. Without the pole term `n/((1/2 pi) int W)` the values are low by 1.5e-5 (n = 2) to 2.7e-4 (n = 37) | yes |
| T-NR lowest off-line zero 0.9038 + 2.86 i | 0.9037532 + 2.8596009 i (closed form) | yes |
| DH on-line zeros in [10, 2000): 1859; L(chi) counts against Riemann-von Mangoldt | DH: 1859 on-line zeros in [10, 2000), 1861 below 2000; L(chi): 2028 below 2000 (main term 2028.4), 12704 below 10000 (main term 12703.6) | yes (1859; counts equal to the main term within 1) |
| DH fraction of zeros on the line 0.9443 below 418, 0.918 below 3e3 | 302 of 319.8 = 0.9443 below 418; 2969 of 3236.2 = 0.9174 below 3000 | yes |
| DH small-gap exponent 1.68 +- 0.37 (3,000 zeros), 1.77 +- 0.20 (10,000), 2.00 +- 0.13 (30,000), 2.069 +- 0.017 (1.79e6); L(chi) 2.972 +- 0.025 (2e6) | to T = 10000 (server): DH 3000 zeros: 1.80 +- 0.38 (23 gaps below 0.2); 10000 zeros: 1.80 +- 0.20 (83 gaps below 0.2); 11570 zeros: 1.85 +- 0.19 (93 gaps below 0.2). L(chi): 3000 zeros: 2.98 +- 0.77 (15 gaps below 0.2); 10000 zeros: 3.03 +- 0.44 (48 gaps below 0.2); 12704 zeros: 2.88 +- 0.36 (63 gaps below 0.2). DH gaps below 0.025 / 0.05 of the local mean: 3 / 9; L(chi): 0 / 0 | yes at 3,000 and 10,000 zeros (at 10,000 zeros DH is 5.9 standard errors below the GUE value 2.962); the 30,000-zero and 1.79e6-zero values were not reached |
| C(1): DH -0.152, chi -0.383 (lists to T = 1e6) | to T = 10000: DH -0.165, chi -0.379 | yes (shorter lists) |

### The structural claim (section 2 of the lane)

"On Re s = 1/2 the T-NR factor is `1 + c w + w^2 = w (c + 2 cos(t log 3))`, no zero for c = 2.2; every functional
of the list of on-line ordinates takes the same value on zeta and on T-NR." Holds (PROVED, re-derived:
`abs w = 1`, `1 + c w + w^2 = w (conj w + c + w)`, minimum of the bracket 0.2). Scope lines to add:

1. "Functional of the list" means the list alone. A statistic that also takes the object's own counting
   function, conductor or gamma factor is not such a functional: T-NR has `T log 3/pi` further zeros below T, so
   unfolding by its own counting function rescales the gaps by `1 + 2 log 3/log(T/2 pi)`. The cell "=" for T-NR
   in row 1a holds for the unfolding by the density of the list (or by zeta's counting function) only; with
   T-NR's own count the cell is F, and that separation is a zero count.
2. "EA has no on-line zero" holds below the verified height; beyond it an on-line zero of
   `zeta(s+a) zeta(s-a)` is a zero of zeta at `Re s = 1/2 +- a`, which is not excluded for a < 1/2.
3. "LIOU =": `zeta(2s)/zeta(s)` has poles, not zeros, at the on-line zeros of zeta; its zeros are at `rho/2`,
   on `Re s = 1/4` if those of zeta are on the line. The cell is "N on Re s = 1/2; equal to zeta for scale-free
   statistics of the ordinates of its own zeros". Row 1a is not scale-free (N_eff contains `log T`).

### Do the separations fall under the four causes of STRATEGY section 0b?

| row | separation found | cause |
|---|---|---|
| 1a small-gap count, 2 box correlation | DH, HEAT, mixtures | count of on-line zeros against the counting function (kind 3) |
| 1b, 1c small-gap exponent, running minimum | DH, HEAT, mixtures, from about 3,000 on-line zeros | a proportion of close pairs in the on-line list over a long range. Not a count against N(T) and not a mean value of the function: kind 3 only if kind 3 is worded "a statistic of the on-line ordinate list over a long range" |
| 3a Verblunsky order | DH at order 149 to 152; T-NR, E_a at order 7 to 15 | the control's off-line zeros read by a finite positivity certificate whose order is set by their height (kind 1 with "cutoff" read as "order") |
| 3b coefficients from all zeros | DH: c(6) != 0 | a broken multiplicative relation of the coefficients: none of the four kinds as worded (input "not an Euler product"); from on-line zeros only: kind 3 |
| 4b Nyman-Beurling distance | T-NR, PER, DHALT (off-line zeros at low height); DH not detected | kind 1 |

So for this lane the sentence of section 0b needs a fifth kind and a wider wording of kinds 1 and 3; the
corrected sentence is in RESULT.md of this directory.

Weakest points of this pass: the HEAT lists, the 1e8 to 1e12 zeta blocks, the Vasyunin Gram and the Levinson
runs were not recomputed; DH was recomputed to T = 10000 only (the lane: 1e6).
