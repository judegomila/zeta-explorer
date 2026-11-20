### 4.1 S1: zeros of the lifted Dirichlet factor in the critical polydisc

Screen: GPU float64, Gauss-Newton on (x, phases) from B random starts, then climbing in x along the zero set (B = 50,000-200,000 starts, 500 iterations per object). Certificates: `s1zero` = a zero with all |w_p| < 1 isolated by `acb_poly.roots()` at 256 bits; `s1pass` = interval subdivision of the torus plus the diagonal slice (objects in at most 3 variables).

| object | input | sizes screened | first size with a zero in the polydisc | x_sup there | x_sup at largest size | certified zero (sizes) | certified zero-free (sizes) |
|---|---|---|---|---|---|---|---|
| AFE riesz1 | dh | 2..48 | 27 | 0.0001 | 0.1121 | 28..48 (21) | 2..10 (9) |
| AFE sharp | dh | 2..48 | 6 | 0.1779 | 0.4913 | 6..48 (43) | 2..5 (4) |
| AFE sharp | ea:0.25 | 2..48 | 2 | 0.5216 | 0.9278 | 2..48 (47) | - |
| AFE sharp | liou | 2..48 | 3 | 0.2879 | 0.4785 | 3..48 (46) | 2 |
| AFE sharp | tw2h | 2..48 | 5 | 0.2032 | 0.4041 | 5..48 (44) | 2,3,4 |
| AFE sharp | tw2m | 2..48 | 3 | 0.2879 | 0.4473 | 3..48 (46) | 2 |
| AFE riesz1 | zeta | 2..48 | 31 | 0.0040 | 0.0474 | 31..48 (18) | 2..6 (5) |
| AFE sharp | zeta | 2..48 | 3 | 0.2879 | 0.4960 | 3..48 (46) | 2 |
| Euler K=oo | dh | 2..47 | 7 | 0.1530 | 0.3806 | 7..47 (12) | 2,3 |
| Euler K=1 | dh | 2..47 | 7 | 0.1530 | 0.3823 | 7..47 (12) | 2,3 |
| Euler K=2 | dh | 2..23 | 3 | 0.2135 | 0.4799 | 3..23 (7) | 2 |
| Euler K=1 | liou | 2..23 | none | - | no zero | - | - |
| Euler K=2 | liou | 2..3 | none | - | no zero | - | - |
| Euler K=1 | tw2h | 2..23 | none | - | no zero | - | - |
| Euler K=2 | tw2h | 2..13 | none | - | no zero | - | - |
| Euler K=1 | tw2m | 2..23 | none | - | no zero | - | - |
| Euler K=2 | tw2m | 2..13 | none | - | no zero | - | - |
| Euler K=1 | zeta | 2..23 | none | - | no zero | - | - |
| Euler K=2 | zeta | 2..13 | none | - | no zero | - | - |

Notes. x_sup values from the screen are lower bounds (largest zero found). Larger sizes (`big_s1x.jsonl`, 40,000 starts each, N = 52, 56, ..., 128): a zero in the polydisc was found at every size for sharp zeta, sharp DH, sharp tw2h, Riesz zeta and Riesz DH (largest x found at N = 128: 0.408, 0.484, 0.373, 0.092, 0.222). The Euler rows for zeta, tw2m, tw2h, liou are sanity runs of the proved statement T4(i); the S1 unit was stopped before the liou K = 2 and E_a Euler rows completed (E_a Euler K = 1, 2 at P = 3, 5 were screened locally: x_sup = 0.5216, 0.3211; for K = 1 the zero is explicit, w_2 = -sqrt 2/(2^{1/4} + 2^{-1/4}) = -0.697).

### 4.2 Torus-uniform threshold t*(X) (T2)

Closed form (sum over primes of one-variable suprema, float64) for products; 2-variable grid for DH. X = 1/2 for K finite, 0.45 for K = oo. Adversarial check on the GPU (4,000,000 random torus points per x, then 300 ascent steps from the best 2,000): for products the largest value found never exceeds the closed form; for the two DH cases it exceeds the 400 x 400 grid value by at most 4e-6.

| P | zeta K=1 | zeta K=2 | zeta K=oo (X=0.45) | tw2h K=1 | DH K=1 | DH K=2 | DH K=oo |
|---|---|---|---|---|---|---|---|
| 2 | 11.17 | 18.46 | 2271 | 9.048 | 1.579 | 3.284 | 270.5 |
| 3 | 25.13 | 79.65 | 5.808e+05 | 20.36 | 4.105 | oo (S1 fails) | 8.819e+04 |
| 5 | 69.81 | 466.2 | 9.97e+07 | 56.55 | - | - | - |
| 7 | 213.8 | 3101 | 1.345e+10 | 173.2 | - | - | - |
| 11 | 718.6 | 2.31e+04 | 1.345e+12 | 582.1 | - | - | - |
| 13 | 2478 | 1.773e+05 | 1.212e+14 | 2008 | - | - | - |
| 17 | 8843 | 1.414e+06 | 9.323e+15 | 7163 | - | - | - |
| 19 | 3.192e+04 | 1.143e+07 | 6.729e+17 | 2.586e+04 | - | - | - |
| 23 | 1.173e+05 | 9.41e+07 | 4.37e+19 | 9.499e+04 | - | - | - |
| 29 | 4.383e+05 | 7.895e+08 | 2.511e+21 | 3.551e+05 | - | - | - |
| 37 | 6.24e+06 | 5.67e+10 | 7.087e+24 | 5.055e+06 | - | - | - |
| 47 | 3.485e+08 | 3.596e+13 | 7.34e+29 | 2.823e+08 | - | - | - |
| 97 | 2.761e+14 | 9.435e+22 | 4.025e+45 | 2.236e+14 | - | - | - |
| 199 | 9.073e+26 | 7.698e+42 | 1.117e+76 | 7.35e+26 | - | - | - |
| 997 | 1.56e+100 | oo (S1 fails) | oo (S1 fails) | 1.263e+100 | - | - | - |

(tw2m and liou have the same thresholds as zeta: T3. DH for P >= 7: no finite threshold, T5.)

GPU adversarial check (`hb` stage): object, sup found at x = 0.5, closed form, excess:

- zeta 11 1: 2.369724 vs 2.369724 (max excess over all x: -3.6e-09)
- zeta 11 2: 4.10482 vs 4.10482 (max excess over all x: -2.8e-08)
- zeta 23 1: 4.917191 vs 4.917194 (max excess over all x: -2.7e-07)
- zeta 23 2: 8.260964 vs 8.26097 (max excess over all x: -7.3e-07)
- zeta 47 1: 8.915574 vs 8.915618 (max excess over all x: -6.4e-06)
- zeta 47 2: 14.687635 vs 14.687765 (max excess over all x: -1.8e-05)
- zeta 97 1: 15.700754 vs 15.706938 (max excess over all x: -1.0e-03)
- zeta 97 2: 25.418753 vs 25.531708 (max excess over all x: -8.4e-03)
- tw2h 23 1: 4.811832 vs 4.811833 (max excess over all x: -2.3e-07)
- dh 3 1: 0.591893 vs 0.591889 (max excess over all x: 3.7e-06)
- dh 2 2: 0.480382 vs 0.480381 (max excess over all x: 2.3e-06)

### 4.3 Sections of Euler-type objects (c) and of the twin ladder (d): certified windows

Windows of length 50 from t = 3.0137, |Re s - 1/2| < 0.5 (0.45 for K = oo and for the ladder). PASS = every zero in the window certified on the line; FAIL = certified zero off the line.

| scheme | input | P | K | windows run (t up to) | PASS | FAIL | UNRES | last window with FAIL starts at | t* (T2) |
|---|---|---|---|---|---|---|---|---|---|
| euler | dh | 2 | 1 | 40 (2003) | 40 | 0 | 0 | - | 1.579 |
| euler | dh | 3 | 1 | 40 (2003) | 40 | 0 | 0 | - | 4.105 |
| euler | dh | 5 | 1 | 40 (2003) | 40 | 0 | 0 | - | 4.105 |
| euler | dh | 7 | 1 | 40 (2003) | 12 | 28 | 0 | 1953 | oo (S1 fails) |
| euler | dh | 11 | 1 | 40 (2003) | 14 | 26 | 0 | 1953 | oo (S1 fails) |
| euler | dh | 13 | 1 | 40 (2003) | 9 | 31 | 0 | 1953 | oo (S1 fails) |
| euler | dh | 17 | 1 | 8 (403) | 1 | 7 | 0 | 353 | oo (S1 fails) |
| euler | dh | 19 | 1 | 8 (403) | 1 | 7 | 0 | 353 | oo (S1 fails) |
| euler | dh | 23 | 1 | 8 (403) | 1 | 7 | 0 | 353 | oo (S1 fails) |
| euler | dh | 2 | 2 | 8 (403) | 8 | 0 | 0 | - | 3.284 |
| euler | dh | 3 | 2 | 8 (403) | 3 | 5 | 0 | 353 | oo (S1 fails) |
| euler | dh | 5 | 2 | 8 (403) | 3 | 5 | 0 | 353 | oo (S1 fails) |
| euler | dh | 7 | 2 | 8 (403) | 0 | 8 | 0 | 353 | oo (S1 fails) |
| euler | dh | 11 | 2 | 8 (403) | 0 | 8 | 0 | 353 | oo (S1 fails) |
| euler | dh | 2 | oo | 8 (403) | 5 | 3 | 0 | 153 | 270.5 |
| euler | dh | 3 | oo | 8 (403) | 3 | 5 | 0 | 303 | 8.819e+04 |
| euler | dh | 5 | oo | 8 (403) | 3 | 5 | 0 | 303 | 8.819e+04 |
| euler | ea:0.1 | 2 | 1 | 8 (403) | 2 | 6 | 0 | 353 |  |
| euler | ea:0.1 | 3 | 1 | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | ea:0.1 | 5 | 1 | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | ea:0.1 | 2 | oo | 8 (403) | 6 | 2 | 0 | 253 |  |
| euler | ea:0.1 | 3 | oo | 8 (403) | 6 | 2 | 0 | 103 |  |
| euler | ea:0.1 | 5 | oo | 8 (403) | 5 | 3 | 0 | 203 |  |
| euler | ea:0.25 | 2 | 1 | 40 (2003) | 35 | 5 | 0 | 353 |  |
| euler | ea:0.25 | 3 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | ea:0.25 | 5 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | ea:0.25 | 7 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | ea:0.25 | 11 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | ea:0.25 | 13 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | ea:0.4 | 2 | 1 | 8 (403) | 7 | 1 | 0 | 103 |  |
| euler | ea:0.4 | 3 | 1 | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | ea:0.4 | 5 | 1 | 8 (403) | 1 | 7 | 0 | 353 |  |
| euler | liou | 2 | 1 | 40 (2003) | 40 | 0 | 0 | - | 11.17 |
| euler | liou | 3 | 1 | 40 (2003) | 40 | 0 | 0 | - | 25.13 |
| euler | liou | 5 | 1 | 40 (2003) | 39 | 1 | 0 | 3 | 69.81 |
| euler | liou | 7 | 1 | 40 (2003) | 39 | 1 | 0 | 3 | 213.8 |
| euler | liou | 11 | 1 | 40 (2003) | 35 | 5 | 0 | 403 | 718.6 |
| euler | liou | 13 | 1 | 40 (2003) | 25 | 15 | 0 | 1153 | 2478 |
| euler | liou | 17 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 8843 |
| euler | liou | 19 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 3.192e+04 |
| euler | liou | 23 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 1.173e+05 |
| euler | liou | 2 | 2 | 8 (403) | 8 | 0 | 0 | - | 18.46 |
| euler | liou | 3 | 2 | 8 (403) | 7 | 1 | 0 | 3 | 79.65 |
| euler | liou | 5 | 2 | 8 (403) | 5 | 3 | 0 | 153 | 466.2 |
| euler | liou | 7 | 2 | 8 (403) | 2 | 6 | 0 | 303 | 3101 |
| euler | liou | 11 | 2 | 8 (403) | 0 | 8 | 0 | 353 | 2.31e+04 |
| euler | liou | 2 | oo | 8 (403) | 2 | 6 | 0 | 303 | 2271 |
| euler | liou | 3 | oo | 8 (403) | 1 | 7 | 0 | 303 | 5.808e+05 |
| euler | liou | 5 | oo | 8 (403) | 0 | 8 | 0 | 353 | 9.97e+07 |
| euler | nr:2:2.2 | 5 | 1 | 8 (403) | 8 | 0 | 0 | - |  |
| euler | nr:2:2.2 | 5 | oo | 8 (403) | 8 | 0 | 0 | - |  |
| euler | nr:3:2.01 | 5 | 1 | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | nr:3:2.01 | 5 | oo | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | nr:3:2.2 | 3 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | nr:3:2.2 | 5 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | nr:3:2.2 | 7 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | nr:3:2.2 | 11 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | nr:3:2.2 | 13 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | nr:3:3 | 5 | 1 | 8 (403) | 8 | 0 | 0 | - |  |
| euler | nr:3:3 | 5 | oo | 8 (403) | 8 | 0 | 0 | - |  |
| euler | nr:5:2.5 | 5 | 1 | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | nr:5:2.5 | 5 | oo | 8 (403) | 8 | 0 | 0 | - |  |
| euler | tw2h | 2 | 1 | 40 (2003) | 40 | 0 | 0 | - | 9.048 |
| euler | tw2h | 3 | 1 | 40 (2003) | 40 | 0 | 0 | - | 20.36 |
| euler | tw2h | 5 | 1 | 40 (2003) | 40 | 0 | 0 | - | 56.55 |
| euler | tw2h | 7 | 1 | 40 (2003) | 40 | 0 | 0 | - | 173.2 |
| euler | tw2h | 11 | 1 | 40 (2003) | 39 | 1 | 0 | 3 | 582.1 |
| euler | tw2h | 13 | 1 | 40 (2003) | 35 | 5 | 0 | 353 | 2008 |
| euler | tw2h | 17 | 1 | 8 (403) | 2 | 6 | 0 | 353 | 7163 |
| euler | tw2h | 19 | 1 | 8 (403) | 1 | 7 | 0 | 353 | 2.586e+04 |
| euler | tw2h | 23 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 9.499e+04 |
| euler | tw2h | 2 | 2 | 8 (403) | 8 | 0 | 0 | - | 11.17 |
| euler | tw2h | 3 | 2 | 8 (403) | 8 | 0 | 0 | - | 48.18 |
| euler | tw2h | 5 | 2 | 8 (403) | 8 | 0 | 0 | - | 282 |
| euler | tw2h | 7 | 2 | 8 (403) | 6 | 2 | 0 | 53 | 1876 |
| euler | tw2h | 11 | 2 | 8 (403) | 1 | 7 | 0 | 353 | 1.397e+04 |
| euler | tw2h | 2 | oo | 8 (403) | 8 | 0 | 0 | - | 13.99 |
| euler | tw2h | 3 | oo | 8 (403) | 3 | 5 | 0 | 353 | 3578 |
| euler | tw2h | 5 | oo | 8 (403) | 2 | 6 | 0 | 353 | 6.142e+05 |
| euler | tw2m | 2 | 1 | 40 (2003) | 40 | 0 | 0 | - | 11.17 |
| euler | tw2m | 3 | 1 | 40 (2003) | 40 | 0 | 0 | - | 25.13 |
| euler | tw2m | 5 | 1 | 40 (2003) | 39 | 1 | 0 | 3 | 69.81 |
| euler | tw2m | 7 | 1 | 40 (2003) | 38 | 2 | 0 | 53 | 213.8 |
| euler | tw2m | 11 | 1 | 40 (2003) | 34 | 6 | 0 | 253 | 718.6 |
| euler | tw2m | 13 | 1 | 40 (2003) | 25 | 15 | 0 | 953 | 2478 |
| euler | tw2m | 17 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 8843 |
| euler | tw2m | 19 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 3.192e+04 |
| euler | tw2m | 23 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 1.173e+05 |
| euler | tw2m | 2 | 2 | 8 (403) | 8 | 0 | 0 | - | 18.46 |
| euler | tw2m | 3 | 2 | 8 (403) | 7 | 1 | 0 | 3 | 79.65 |
| euler | tw2m | 5 | 2 | 8 (403) | 4 | 4 | 0 | 303 | 466.2 |
| euler | tw2m | 7 | 2 | 8 (403) | 1 | 7 | 0 | 303 | 3101 |
| euler | tw2m | 11 | 2 | 8 (403) | 0 | 8 | 0 | 353 | 2.31e+04 |
| euler | tw2m | 2 | oo | 8 (403) | 2 | 6 | 0 | 303 | 2271 |
| euler | tw2m | 3 | oo | 8 (403) | 0 | 8 | 0 | 353 | 5.808e+05 |
| euler | tw2m | 5 | oo | 8 (403) | 0 | 8 | 0 | 353 | 9.97e+07 |
| euler | zeta | 2 | 1 | 40 (2003) | 40 | 0 | 0 | - | 11.17 |
| euler | zeta | 3 | 1 | 40 (2003) | 40 | 0 | 0 | - | 25.13 |
| euler | zeta | 5 | 1 | 40 (2003) | 40 | 0 | 0 | - | 69.81 |
| euler | zeta | 7 | 1 | 40 (2003) | 40 | 0 | 0 | - | 213.8 |
| euler | zeta | 11 | 1 | 40 (2003) | 38 | 2 | 0 | 53 | 718.6 |
| euler | zeta | 13 | 1 | 60 (3003) | 57 | 3 | 0 | 303 | 2478 |
| euler | zeta | 17 | 1 | 114 (5703) | 94 | 20 | 0 | 2203 | 8843 |
| euler | zeta | 19 | 1 | 113 (5653) | 66 | 47 | 0 | 4653 | 3.192e+04 |
| euler | zeta | 23 | 1 | 113 (5653) | 32 | 81 | 0 | 5603 | 1.173e+05 |
| euler | zeta | 2 | 2 | 40 (2003) | 40 | 0 | 0 | - | 18.46 |
| euler | zeta | 3 | 2 | 40 (2003) | 40 | 0 | 0 | - | 79.65 |
| euler | zeta | 5 | 2 | 40 (2003) | 39 | 1 | 0 | 3 | 466.2 |
| euler | zeta | 7 | 2 | 40 (2003) | 36 | 4 | 0 | 303 | 3101 |
| euler | zeta | 11 | 2 | 40 (2003) | 20 | 20 | 0 | 1803 | 2.31e+04 |
| euler | zeta | 2 | oo | 20 (1003) | 7 | 13 | 0 | 953 | 2271 |
| euler | zeta | 3 | oo | 20 (1003) | 7 | 13 | 0 | 953 | 5.808e+05 |
| euler | zeta | 5 | oo | 20 (1003) | 7 | 13 | 0 | 953 | 9.97e+07 |
| ladder | zeta | 2 | 1 | 39 (1953) | 39 | 0 | 0 | - |  |
| ladder | zeta | 3 | 1 | 39 (1953) | 39 | 0 | 0 | - |  |
| ladder | zeta | 5 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 7 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 11 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 13 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 23 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 47 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 2 | 4 | 39 (1953) | 39 | 0 | 0 | - |  |
| ladder | zeta | 3 | 4 | 39 (1953) | 39 | 0 | 0 | - |  |
| ladder | zeta | 5 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 7 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 11 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 13 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 23 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 47 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 2 | oo | 39 (1953) | 17 | 22 | 0 | 1853 |  |
| ladder | zeta | 3 | oo | 39 (1953) | 26 | 13 | 0 | 853 |  |
| ladder | zeta | 5 | oo | 38 (1903) | 32 | 6 | 0 | 553 |  |
| ladder | zeta | 7 | oo | 38 (1903) | 35 | 3 | 0 | 153 |  |
| ladder | zeta | 11 | oo | 38 (1903) | 34 | 4 | 0 | 153 |  |
| ladder | zeta | 13 | oo | 38 (1903) | 35 | 3 | 0 | 153 |  |
| ladder | zeta | 23 | oo | 38 (1903) | 37 | 1 | 0 | 53 |  |
| ladder | zeta | 47 | oo | 38 (1903) | 38 | 0 | 0 | - |  |

**GPU screen of the same sections on 3 < t < 30003** (windows of length 1000, float64; "last" = start of the last window containing an off-line zero in |Re s - 1/2| < 0.5 (0.45 for K = oo)):

| input | K | P=2 | P=3 | P=5 | P=7 | P=11 | P=13 | P=17 | P=19 | P=23 | P=29 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| dh | oo | 16 off, last 3 | 146 off, last 28003 | 146 off, last 28003 | 1928 off, last 29003 | 2250 off, last 29003 (2 unres.) | 3124 off, last 29003 (7 unres.) | 4338 off, last 29003 (5 unres.) | 5164 off, last 29003 (6 unres.) | 6536 off, last 29003 (8 unres.) | 7552 off, last 29003 (15 unres.) |
| liou | oo | 82 off, last 2003 | 398 off, last 29003 (1 unres.) | 860 off, last 29003 (3 unres.) | 1524 off, last 29003 (2 unres.) | 2400 off, last 29003 (3 unres.) | 3246 off, last 29003 (5 unres.) | 4132 off, last 29003 (6 unres.) | 5374 off, last 29003 (11 unres.) | 6504 off, last 29003 (10 unres.) | 7588 off, last 29003 (12 unres.) |
| nr:3:2.2 | oo |  | 10708 off, last 29003 | 10996 off, last 29003 (2 unres.) | 11330 off, last 29003 (2 unres.) | 11904 off, last 29003 (5 unres.) | 12452 off, last 29003 (3 unres.) | 13180 off, last 29003 (5 unres.) | 14100 off, last 29003 (11 unres.) | 15018 off, last 29003 (15 unres.) | 16134 off, last 29003 (10 unres.) |
| tw2h | oo | none | 72 off, last 2003 | 334 off, last 29003 (1 unres.) | 742 off, last 29003 (5 unres.) | 1282 off, last 29003 (4 unres.) | 1868 off, last 29003 (3 unres.) | 2576 off, last 29003 (8 unres.) | 3526 off, last 29003 (9 unres.) | 4416 off, last 29003 (10 unres.) | 5640 off, last 29003 (16 unres.) |
| tw2m | oo | 82 off, last 2003 | 356 off, last 29003 | 964 off, last 29003 (2 unres.) | 1736 off, last 29003 (2 unres.) | 2618 off, last 29003 (1 unres.) | 3620 off, last 29003 (5 unres.) | 4902 off, last 29003 (8 unres.) | 6008 off, last 29003 (8 unres.) | 7346 off, last 29003 (7 unres.) | 8612 off, last 29003 (10 unres.) |
| zeta | oo | 58 off, last 2003 (1 unres.) | 218 off, last 29003 | 506 off, last 29003 (2 unres.) | 840 off, last 29003 (2 unres.) | 1414 off, last 29003 (5 unres.) | 1962 off, last 29003 (3 unres.) | 2690 off, last 29003 (5 unres.) | 3610 off, last 29003 (11 unres.) | 4528 off, last 29003 (15 unres.) | 5644 off, last 29003 (10 unres.) |
| dh | 1 | none | none | none | 1432 off, last 29003 | 1380 off, last 29003 | 1810 off, last 29003 | 2234 off, last 29003 | 2250 off, last 29003 | 2610 off, last 29003 | 2714 off, last 29003 |
| ea:0.25 | 1 | 12 off, last 3 | 10356 off, last 29003 | 10230 off, last 29003 | 10152 off, last 29003 (1 unres.) | 10356 off, last 29003 (5 unres.) | 11518 off, last 29003 (3 unres.) | 13540 off, last 29003 (4 unres.) | 18832 off, last 29003 (1 unres.) | 34896 off, last 29003 (9 unres.) | 75212 off, last 29003 (9 unres.) |
| liou | 1 | none | none | 2 off, last 3 | 4 off, last 3 | 32 off, last 3 | 90 off, last 1003 | 194 off, last 4003 | 468 off, last 14003 | 1078 off, last 28003 | 2292 off, last 29003 (1 unres.) |
| nr:3:2.2 | 1 |  | 10490 off, last 29003 | 10490 off, last 29003 | 10490 off, last 29003 | 10498 off, last 29003 | 10508 off, last 29003 | 10576 off, last 29003 | 10708 off, last 29003 | 11102 off, last 29003 (2 unres.) | 11904 off, last 29003 |
| tw2h | 1 | none | none | none | none | 4 off, last 3 | 12 off, last 3 (1 unres.) | 54 off, last 1003 | 172 off, last 6003 (1 unres.) | 452 off, last 24003 (1 unres.) | 1110 off, last 29003 (1 unres.) |
| tw2m | 1 | none | none | 2 off, last 3 | 12 off, last 3 | 44 off, last 3 | 86 off, last 3 | 234 off, last 3003 | 586 off, last 16003 | 1330 off, last 28003 (2 unres.) | 2646 off, last 29003 (2 unres.) |
| zeta | 1 | none | none | none | none | 8 off, last 3 | 18 off, last 3 | 86 off, last 2003 | 218 off, last 13003 | 612 off, last 29003 (2 unres.) | 1414 off, last 29003 |

### 4.4 Sharp AFE sections (a)

**Matched windows, certified** (each size N on its own window 2 pi N^2/q < t < 2 pi (N+1)^2/q, |Re s - 1/2| < 1):

| input | sizes run | PASS | FAIL | UNRES | first FAIL | zeros counted | certified off-line zeros |
|---|---|---|---|---|---|---|---|
| zeta | 1..50 (49) | 11 (N = 1,2,3,4,6,7,11,13,15,20,22) | 37 | 1 | N = 5 | 17079 | 206 |
| dh | 1..112 (112) | 10 (N = 1,2,3,4,5,6,7,10,12,14) | 102 | 0 | N = 8 | 21589 | 1952 |
| tw2m | 1..50 (48) | 2 (N = 1,2) | 46 | 0 | N = 3 | 16328 | 3592 |
| liou | 1..50 (50) | 2 (N = 1,2) | 48 | 0 | N = 3 | 17851 | 3882 |
| tw2h | 1..50 (50) | 8 (N = 1,2,3,4,5,6,8,9) | 42 | 0 | N = 7 | 17852 | 946 |

**Matched windows, GPU screen** (float64 winding and sign changes; fraction of zeros off the line by range of N):

| input | N range | max t | windows with off-line zeros | N 1-10 | 11-30 | 31-100 | 101-200 | 201-400 | 401-600 |
|---|---|---|---|---|---|---|---|---|---|
| zeta | 1..600 | 2.27e+06 | 589/600 | 0.0217 | 0.0127 | 0.0084 | 0.0052 | 0.0038 | 0.0028 |
| dh | 1..400 | 2.02e+05 | 390/400 | 0.0435 | 0.0658 | 0.0924 | 0.0991 | 0.1035 | - |
| tw2m | 1..150 | 1.43e+05 | 148/150 | 0.1304 | 0.2108 | 0.2399 | 0.2493 | - | - |
| liou | 1..150 | 1.43e+05 | 148/150 | 0.1525 | 0.2012 | 0.2341 | 0.2403 | - | - |
| tw2h | 1..150 | 1.43e+05 | 142/150 | 0.0087 | 0.0456 | 0.0659 | 0.0760 | - | - |

**Fixed N on 3 < t < 20003, GPU screen** (zeros in |Re s - 1/2| < 1; off = not on the line), and certified windows of length 50:

| input | N | S1 | zeros | off-line | windows (of 80, length 250) with off-line zeros | certified windows PASS/FAIL (t up to) |
|---|---|---|---|---|---|---|
| zeta | 1 | holds | 22495 | 0 | 0 | 40/0 (2003) |
| zeta | 2 | holds | 22498 | 2 | 1 | 39/1 (2003) |
| zeta | 3 | fails | 22498 | 1992 | 80 | 1/39 (2003) |
| zeta | 4 | fails | 22497 | 1620 | 80 | 5/17 (1103) |
| zeta | 5 | fails | 22497 | 2806 | 80 | 2/20 (1103) |
| zeta | 7 | fails | 22498 | 2888 | 80 | 2/20 (1103) |
| zeta | 10 | fails | 22501 | 3198 | 80 | 5/17 (1103) |
| zeta | 15 | fails | 22506 | 3892 | 80 | - |
| zeta | 20 | fails | 22508 | 4202 | 79 | 1/21 (1103) |
| zeta | 30 | fails | 22515 | 3996 | 80 | - |
| zeta | 50 | fails | 22521 | 4108 | 80 | - |
| dh | 1 | holds | 27618 | 0 | 0 | 40/0 (2003) |
| dh | 2 | holds | 27618 | 0 | 0 | 40/0 (2003) |
| dh | 3 | holds | 27618 | 0 | 0 | 40/0 (2003) |
| dh | 4 | holds | 27618 | 0 | 0 | 22/0 (1103) |
| dh | 5 | holds | 27618 | 0 | 0 | 22/0 (1103) |
| dh | 7 | fails | 27618 | 1550 | 80 | 3/19 (1103) |
| dh | 10 | fails | 27618 | 1900 | 80 | 1/21 (1103) |
| dh | 15 | fails | 27618 | 2312 | 80 | - |
| dh | 20 | fails | 27618 | 2718 | 80 | 3/19 (1103) |
| dh | 30 | fails | 27618 | 3216 | 80 | - |
| dh | 50 | fails | 27618 | 3452 | 80 | - |
| tw2m | 1 | holds | 22495 | 0 | 0 | - |
| tw2m | 2 | holds | 22495 | 0 | 0 | - |
| tw2m | 3 | fails | 22497 | 1942 | 80 | - |
| tw2m | 4 | fails | 22497 | 1596 | 80 | - |
| tw2m | 5 | fails | 22499 | 2796 | 80 | - |
| tw2m | 7 | fails | 22501 | 2886 | 80 | - |
| tw2m | 10 | fails | 22503 | 3204 | 80 | - |
| tw2m | 15 | fails | 22513 | 3792 | 80 | - |
| tw2m | 20 | fails | 22521 | 4232 | 80 | - |
| tw2m | 30 | fails | 22532 | 4712 | 80 | - |
| tw2m | 50 | fails | 22560 | 5392 | 80 | - |
| liou | 1 | holds | 22495 | 0 | 0 | - |
| liou | 2 | holds | 22495 | 0 | 0 | - |
| liou | 3 | fails | 22497 | 1992 | 80 | - |
| liou | 4 | fails | 22499 | 1640 | 80 | - |
| liou | 5 | fails | 22499 | 2810 | 80 | - |
| liou | 7 | fails | 22501 | 2860 | 80 | - |
| liou | 10 | fails | 22503 | 3196 | 80 | - |
| liou | 15 | fails | 22511 | 3902 | 80 | - |
| liou | 20 | fails | 22511 | 4432 | 80 | - |
| liou | 30 | fails | 22521 | 4770 | 80 | - |
| liou | 50 | fails | 22549 | 5272 | 80 | - |

### 4.5 Torus translates (TR)

**AFE, matched windows, certified.** For each N: 30 random torus points (independent uniform phases for all p <= N), 11 points on the line phi_2 = 2 pi k/12, and the single flips phi_p = pi.

| N | random: real-rooted / run | random: mean off-line zeros | line phi_2: real-rooted / run | diagonal verdict |
|---|---|---|---|---|
| 2 | 30/30 | 0.0 | 11/11 | PASS |
| 3 | 5/30 | 2.3 | 1/11 | PASS |
| 4 | 4/30 | 3.5 | 1/11 | PASS |
| 5 | 0/12 | 5.8 | 0/11 | FAIL |
| 6 | 0/12 | 5.8 | 0/11 | PASS |
| 7 | 0/12 | 10.2 | 0/11 | PASS |
| 8 | 0/12 | 13.3 | 0/11 | FAIL |
| 9 | 0/12 | 17.0 | 0/11 | FAIL |
| 10 | 0/12 | 14.8 | 0/11 | FAIL |
| 11 | 0/12 | 21.5 | 0/11 | PASS |
| 12 | 0/12 | 21.5 | 0/11 | FAIL |
| 13 | 0/12 | 30.7 | 0/11 | PASS |
| 14 | 0/2 | 25.0 | 0/0 | FAIL |

**AFE, matched windows, GPU screen** (60 random torus points per N; 24 points on the line phi_2):

| N | diagonal off/tot | random: fraction real-rooted | random: mean off / mean tot | line phi_2 = 2 pi k/24, off-line zeros for k = 0..23 |
|---|---|---|---|---|
| 2 | 0/8 | 1.00 | 0.0/9.4 | 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 |
| 3 | 0/17 | 0.13 | 2.7/17.4 | 0 0 0 2 2 4 4 4 4 4 2 2 2 4 4 4 4 4 6 4 4 4 2 2 |
| 4 | 0/27 | 0.18 | 2.7/27.1 | 0 2 2 2 6 2 0 2 2 4 2 4 4 4 2 0 2 2 2 4 4 4 2 0 |
| 5 | 2/38 | 0.00 | 5.8/37.7 | 2 0 4 4 4 8 12 10 10 8 8 8 10 12 10 10 6 6 4 6 8 12 12 8 |
| 6 | 0/49 | 0.03 | 6.6/48.6 | 0 0 8 8 8 8 6 2 4 6 8 6 4 4 6 4 6 6 8 8 8 10 10 0 |
| 8 | 2/73 | 0.00 | 12.8/72.7 | 2 4 6 8 12 14 12 14 16 14 20 16 14 16 10 14 12 10 8 10 12 14 10 2 |
| 10 | 4/100 | 0.00 | 16.9/98.8 | 4 4 14 16 18 12 14 12 20 20 14 8 4 14 10 12 12 14 12 18 12 16 10 8 |
| 15 | 0/170 | 0.00 | 32.5/170.1 | 0 16 22 30 36 30 30 42 38 34 38 36 30 40 34 40 38 34 28 24 32 34 30 12 |
| 20 | 0/248 | 0.00 | 49.0/247.7 | 0 26 52 54 46 44 50 56 60 52 54 58 54 58 50 58 60 46 48 48 56 50 38 14 |
| 25 | 2/331 | 0.00 | 68.0/330.4 | 2 34 48 60 64 72 62 58 72 68 78 74 72 76 66 70 72 62 60 58 66 56 52 26 |
| 30 | 2/417 | 0.00 | 86.3/417.1 | 2 40 64 82 72 90 80 82 84 84 82 92 86 84 80 72 70 84 82 80 82 78 76 44 |
| 35 | 8/507 | 0.00 | 110.5/506.9 | 8 44 78 94 100 112 116 120 106 108 114 104 116 108 116 112 128 124 112 102 72 62 70 58 |
| 40 | 6/600 | 0.00 | 128.1/599.7 | 6 66 92 102 106 102 78 112 116 128 140 140 134 122 124 136 136 126 126 110 110 102 86 40 |

**Near the diagonal, GPU screen** (off-line zeros in the matched window; phi_2 = e, phi_3 = e, and the time shift phi_p = e log p, i.e. Dirichlet part at t + e with the gamma phase at t):

- N = 10 (100 zeros): e=0.0: 4/4/4; e=0.001: 4/4/4; e=0.003: 4/4/4; e=0.01: 4/4/4; e=0.03: 2/2/2; e=0.1: 4/0/6; e=0.3: 8/4/16; e=1.0: 18/10/14; e=-0.001: 4/4/4; e=-0.01: 4/4/4; e=-0.1: 6/6/6; e=-1.0: 12/14/18
- N = 20 (248 zeros): e=0.0: 0/0/0; e=0.001: 0/0/0; e=0.003: 0/0/0; e=0.01: 0/0/4; e=0.03: 2/2/6; e=0.1: 4/4/18; e=0.3: 28/10/58; e=1.0: 44/38/6; e=-0.001: 2/0/2; e=-0.01: 2/2/2; e=-0.1: 4/2/14; e=-1.0: 56/24/6
- N = 40 (600 zeros): e=0.0: 6/6/6; e=0.001: 6/6/8; e=0.003: 6/6/8; e=0.01: 6/6/8; e=0.03: 6/6/20; e=0.1: 20/10/66; e=0.3: 70/34/168; e=1.0: 108/94/110; e=-0.001: 6/6/4; e=-0.01: 4/6/8; e=-0.1: 18/10/56; e=-1.0: 104/104/100
- N = 80 (1413 zeros): e=0.0: 8/8/8; e=0.001: 8/8/8; e=0.003: 8/8/10; e=0.01: 8/10/18; e=0.03: 16/16/54; e=0.1: 56/36/210; e=0.3: 164/92/450; e=1.0: 304/248/440; e=-0.001: 8/8/8; e=-0.01: 8/6/12; e=-0.1: 42/22/192; e=-1.0: 310/264/446
- N = 160 (3260 zeros): e=0.0: 10/10/10; e=0.001: 10/10/10; e=0.003: 10/10/10; e=0.01: 10/12/28; e=0.03: 24/18/154; e=0.1: 104/58/586; e=0.3: 400/226/1056; e=1.0: 676/596/1022; e=-0.001: 10/10/10; e=-0.01: 12/14/36; e=-0.1: 100/68/590; e=-1.0: 724/620/1006

**Euler K = 1 sections of zeta, 20-40 random torus points per P, certified windows of length 50** (T2 predicts PASS for every translate once the window lies above t*):

| P | t* | windows below t*: PASS/FAIL | windows entirely above t*: PASS/FAIL/UNRES |
|---|---|---|---|
| 3 | 25.13 | 29/11 | 40/0/0 |
| 5 | 69.81 | 51/29 | 40/0/0 |
| 7 | 213.8 | 108/72 | 40/0/0 |
| 11 | 718.6 | 190/170 | 100/0/0 |

### 4.6 Q(x0): zeros of the sharp main sum right of 1/2 + x0 in the matched window (certified argument principle)

Mean number of zeros of D_N with Re s > 1/2 + x0 per matched window, by range of N. "zeta+rand" = 10-20 random torus translates of the zeta main sum.

| input | x0 | N run | first N with a zero | N 1-5 | N 6-10 | N 11-20 | N 21-40 | N 41-70 | N 71-100 |
|---|---|---|---|---|---|---|---|---|---|
| zeta | 0.0 | 1..107 (50) | 3 | 2.60 | 9.80 | 27.60 | 70.85 | 106.33 | - |
| zeta | 0.05 | 1..107 (50) | 3 | 2.40 | 8.80 | 22.80 | 56.50 | 84.00 | - |
| zeta | 0.1 | 1..107 (50) | 3 | 2.40 | 7.80 | 18.90 | 43.55 | 60.67 | - |
| zeta | 0.2 | 1..107 (50) | 3 | 1.20 | 5.60 | 9.40 | 19.95 | 25.33 | - |
| zeta | 0.3 | 1..107 (50) | 5 | 0.40 | 2.00 | 3.40 | 4.20 | 5.67 | - |
| zeta | 0.4 | 1..107 (50) | 11 | 0.00 | 0.00 | 0.60 | 0.15 | 0.00 | - |
| zeta+rand | 0.0 | 2..40 (39) | 3 | 3.06 | 11.33 | 30.55 | 78.52 | - | - |
| zeta+rand | 0.1 | 2..40 (39) | 3 | 2.27 | 7.59 | 19.69 | 46.42 | - | - |
| zeta+rand | 0.2 | 2..40 (39) | 3 | 1.25 | 4.55 | 9.53 | 18.54 | - | - |
| zeta+rand | 0.3 | 2..40 (39) | 5 | 0.40 | 1.69 | 2.85 | 3.53 | - | - |
| tw2m | 0.0 | 1..107 (50) | 3 | 2.60 | 10.80 | 32.00 | 78.65 | 126.67 | - |
| tw2m | 0.05 | 1..107 (50) | 3 | 2.20 | 9.00 | 26.20 | 62.05 | 102.00 | - |
| tw2m | 0.1 | 1..107 (50) | 3 | 1.80 | 7.00 | 19.60 | 46.25 | 67.33 | - |
| tw2m | 0.2 | 1..107 (50) | 3 | 0.80 | 3.60 | 9.70 | 18.75 | 24.00 | - |
| tw2m | 0.3 | 1..107 (50) | 5 | 0.40 | 1.40 | 2.50 | 4.25 | 4.00 | - |
| tw2m | 0.4 | 1..107 (50) | 7 | 0.00 | 0.20 | 0.30 | 0.05 | 0.00 | - |
| liou | 0.0 | 1..106 (49) | 3 | 2.60 | 11.00 | 30.70 | 79.15 | 118.33 | - |
| liou | 0.05 | 1..106 (49) | 3 | 2.00 | 8.60 | 26.10 | 63.15 | 89.67 | - |
| liou | 0.1 | 1..106 (49) | 3 | 1.40 | 7.40 | 19.90 | 46.85 | 67.67 | - |
| liou | 0.2 | 1..106 (49) | 3 | 1.00 | 4.60 | 9.70 | 18.10 | 23.33 | - |
| liou | 0.3 | 1..106 (49) | 5 | 0.20 | 1.40 | 2.50 | 3.45 | 4.67 | - |
| liou | 0.4 | 1..106 (49) | 7 | 0.00 | 0.20 | 0.40 | 0.20 | 0.00 | - |
| tw2h | 0.0 | 1..106 (49) | 5 | 0.80 | 6.60 | 20.80 | 56.20 | 92.33 | - |
| tw2h | 0.05 | 1..106 (49) | 5 | 0.80 | 4.80 | 16.30 | 41.65 | 65.33 | - |
| tw2h | 0.1 | 1..106 (49) | 5 | 0.60 | 3.40 | 10.40 | 28.25 | 41.00 | - |
| tw2h | 0.2 | 1..106 (49) | 7 | 0.00 | 1.40 | 3.70 | 9.15 | 10.67 | - |
| tw2h | 0.3 | 1..106 (49) | 11 | 0.00 | 0.00 | 0.80 | 0.55 | 2.33 | - |
| tw2h | 0.4 | 1..106 (49) | 37 | 0.00 | 0.00 | 0.00 | 0.05 | 0.00 | - |
| dh | 0.0 | 1..239 (137) | 7 | 0.00 | 1.00 | 2.90 | 9.45 | 21.13 | 38.00 |
| dh | 0.05 | 1..239 (137) | 7 | 0.00 | 1.00 | 2.50 | 7.35 | 16.03 | 27.46 |
| dh | 0.1 | 1..239 (136) | 7 | 0.00 | 1.00 | 2.30 | 5.65 | 11.57 | 19.59 |
| dh | 0.2 | 1..239 (136) | 10 | 0.00 | 0.20 | 1.30 | 2.50 | 5.13 | 8.63 |
| dh | 0.3 | 1..239 (136) | 11 | 0.00 | 0.00 | 0.30 | 1.10 | 1.87 | 2.41 |
| dh | 0.4 | 1..239 (136) | 22 | 0.00 | 0.00 | 0.00 | 0.10 | 0.20 | 0.33 |

### 4.7 Theta form (b)

Zeros in the window (30 units of t, |Re s - 1/2| < 1): "total/real". Totals are point-sampled windings at 256-700 bits (not interval-certified); the real counts are certified sign changes. `true` rows are fully certified windows for the functions themselves (N = oo).

| input | N | point | t from 3 | t from 33 | t from 63 | t from 93 | t from 123 |
|---|---|---|---|---|---|---|---|
| dh | 1 | diag | 1/1 | 0/0 |  |  |  |
| dh | 2 | diag | 4/2 | 0/0 |  |  |  |
| dh | 3 | diag | 6/4 | 0/0 |  |  |  |
| dh | 4 | diag | 12/12 | 1/1 |  |  |  |
| dh | 6 | diag | 12/12 | 9/7 |  |  |  |
| dh | 14 | diag | 12/12 | 17/17 | 20/18 | 21/19 | 23/23 |
| liou | 2 | diag | 1/1 | 0/0 |  |  |  |
| liou | 3 | diag | 1/1 | 0/0 |  |  |  |
| liou | 4 | diag | 1/1 | 0/0 |  |  |  |
| liou | 10 | diag | 1/1 | 0/0 | 0/0 | 0/0 | 0/0 |
| tw2h | 2 | diag | 1/1 | 0/0 |  |  |  |
| tw2h | 3 | diag | 1/1 | 0/0 |  |  |  |
| tw2h | 4 | diag | 1/1 | 0/0 |  |  |  |
| tw2h | 10 | diag | 1/1 | 0/0 | 0/0 | 0/0 | 0/0 |
| tw2m | 1 | diag | 1/1 | 0/0 |  |  |  |
| tw2m | 2 | diag | 1/1 | 0/0 |  |  |  |
| tw2m | 3 | diag | 1/1 | 0/0 |  |  |  |
| tw2m | 4 | diag | 1/1 | 0/0 |  |  |  |
| tw2m | 10 | diag | 1/1 | 0/0 | 0/0 | 0/0 | 0/0 |
| zeta | 1 | diag | 1/1 | 0/0 |  |  |  |
| zeta | 2 | diag | 5/5 | 2/2 |  |  |  |
| zeta | 3 | diag | 5/5 | 9/9 |  |  |  |
| zeta | 4 | diag | 5/5 | 9/9 |  |  |  |
| zeta | 10 | diag | 5/5 | 9/9 | 12/12 | 14/14 | 14/14 |
| zeta | 4 | line2 | mean 1.3/1.3 (n=11) | mean 0.1/0.1 (n=11) |  |  |  |
| zeta | 10 | line2 | mean 1.5/1.5 (n=6) | mean 0.0/0.0 (n=6) | mean 0.0/0.0 (n=6) | 0/0 | 0/0 |
| zeta | 10 | near0.01 | 4/2 | 0/0 | 0/0 | 0/0 | 0/0 |
| zeta | 10 | near0.05 | 2/2 | 0/0 | 0/0 | 0/0 | 0/0 |
| zeta | 10 | near0.2 | 2/2 | 0/0 | 0/0 | 0/0 |  |
| zeta | 4 | rand | mean 1.3/1.2 (n=60) | mean 0.1/0.1 (n=60) |  |  |  |
| zeta | 10 | rand | mean 1.2/1.2 (n=20) | mean 0.1/0.1 (n=20) | mean 0.1/0.1 (n=20) | mean 0.0/0.0 (n=3) | mean 0.0/0.0 (n=2) |

- `true` zeta: 100 certified windows of length 50 up to t = 5003: PASS 100, FAIL 0, UNRES 0; zeros 4524, off-line 0; first FAIL window starts at -.
- `true` dh: 31 certified windows of length 50 up to t = 1553: PASS 3, FAIL 28, UNRES 0; zeros 1513, off-line 104; first FAIL window starts at 53.0137.

### 4.8 Circle property C, multi-affine symmetrisation MA, witnesses, cross-checks

**C** (numpy roots, 3000 random torus points per variable; fraction of points at which all zeros in w_q are on the circle). Prediction for a K = 1 product: 1 - (2/pi) arccos(eps_q q^{-1/2}) = 0.5, 0.392, 0.295, 0.247, 0.195, 0.179 for q = 2, 3, 5, 7, 11, 13.

| object | w_2 | w_3 | w_5 | w_7 | w_11 | w_13 |
|---|---|---|---|---|---|---|
| euler zeta P13 K1 | 0.493 | 0.395 | 0.299 | 0.238 | 0.187 | 0.165 |
| euler tw2m P13 K1 | 0.496 | 0.399 | 0.302 | 0.247 | 0.196 | 0.188 |
| euler tw2h P13 K1 | 0.236 | 0.381 | 0.292 | 0.246 | 0.196 | 0.179 |
| euler dh P13 K1 | 0.375 | 0.362 |  | 0.249 | 0.192 | 0.183 |
| afe zeta N2 | 0.496 |  |  |  |  |  |
| afe zeta N6 | 0.168 | 0.453 | 0.362 |  |  |  |
| afe zeta N20 | 0.002 | 0.059 | 0.332 | 0.295 | 0.246 | 0.221 |
| afe dh N6 | 0.159 | 0.316 |  |  |  |  |
| afe dh N20 | 0.000 | 0.063 |  | 0.214 | 0.231 | 0.060 |

**MA** (float64 search, 3000 starts each): object: zero in the polydisc before / after polarisation (variables after):

euler zeta P=3 K=2: none / none (4); euler zeta P=5 K=3: none / none (9); euler dh P=3 K=1: none / none (2); euler dh P=3 K=2: zero / zero (4); euler dh P=7 K=2: zero / zero (6); afe zeta N=2: none / none (1); afe zeta N=4: zero / zero (3); afe zeta N=9: zero / zero (7); afe dh N=4: none / none (3); afe dh N=9: zero / zero (6); afe tw2h N=4: none / none (3).

**Witnesses** (mpmath, 30 digits, residual |F|/|G| below 1e-29): explicit off-line zeros behind four certified FAIL verdicts:

- zeta afe N=5 matched: 0.609410680661 + 221.078884111 i
- zeta afe N=2 [3,53]: 1.47359593308 + 4.2592838852 i
- zeta euler P=11 K=1 [3,103]: 0.963445051189 + 14.9519433532 i; 0.972344194825 + 65.2567319151 i; 0.997968798697 + 7.93198443087 i
- tw2m afe N=3 matched: 1.07094604186 + 99.9482555945 i

**Cross-checks.** (i) GPU float counts against certified counts on identical windows (`xcheck.py`): 309 matched windows and 132 translate windows, identical (total, on-line) counts in all. (ii) T3: the translate phi_2 = pi of the zeta Euler P = 5 section and the tw2m section give the same certified counts (n_up = 1, n_tot = 18, n_real = 16 on 3.0137 < t < 53.0137). (iii) T5 (`dh_phase.py`): x_sup(P) from the closed form 0.153042 (P = 7), 0.269668 (13), 0.377424 (23), 0.433974 (47) against the GPU search, which gives lower bounds, 0.1530, 0.2681, 0.3714 and 0.3823 (the last with only 915 starts in 14 variables); all primes: 1/2 + x_sup = 1.12036249. (iv) Self-test of `bl.py` against mpmath: |F_float - F_mp| < 2e-14 at three points; DH poly against the product form: 7e-16.
