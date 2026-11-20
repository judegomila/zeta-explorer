# Control battery (c12-control-battery-harness): interface, tables, checksums

Built 2026-11-19. Server copy: `~/rh-push/c12-control-battery-harness/` (complete: 107 files, 4.96 GB). Local mirror: this directory (code, zero tables, value tables, sets, device outputs, manifest; the coefficient arrays `coef_*.npy`, `local_U.npy` and `beu_integers.npy` stay on the server and are regenerated from seeds by `battery/tables.py`; their sha256 are in `tables/MANIFEST.json` and `tables/coef_manifest.json`). The parameter arrays and the integer-valued coefficient tables are bit-identical on the Mac and the server; the complex tables (`coef_U-*`, `coef_WT`) differ in the last bit between platforms, so their sha256 identify the server files only.

Nothing here is a statement about zeros of zeta. All numerics are MEASURED unless a line says "ball" (python-flint ball arithmetic, the ball contains the value).

## 1. Objects

| code | object | closed form | functional equation | value table |
|---|---|---|---|---|
| `ZETA` | zeta(s) | yes | s <-> 1-s | 30 digits, 13 x 4001 |
| `DH` | Davenport-Heilbronn, conductor 5, coefficients (1, kappa, -kappa, -1, 0) | yes (Hurwitz) | s <-> 1-s, gamma (5/pi)^(s/2) Gamma((s+1)/2) | 30 digits |
| `EA-1/8`, `EA-1/4`, `EA-1/2` | zeta(s+a) zeta(s-a) | yes | s <-> 1-s | 30 digits |
| `TNR` | zeta(s)(1 + c q^(1/2-s) + q^(1-2s)), q = 3, c = 2.2 | yes | s <-> 1-s, conductor 9 | 30 digits |
| `WT` (and `WT-CONJ`) | zeta(s + i alpha), alpha = 2 pi/log(1000/2 pi) = 1.2393168126993495 | yes | s <-> 1 - s - 2 i alpha | 30 digits; `WT-CONJ` = zeta(s - i alpha) for negative ordinates |
| `SGN-LIOU` | zeta(2s)/zeta(s) (eps(p) = -1 at every prime) | yes | none of the form s <-> 1-s for the series | 30 digits |
| `U-00` .. `U-23` | completely multiplicative, chi(p) = e(u_p), u_p uniform; numpy PCG64 seed 120000 + j, one draw per prime in increasing order | no | none | Re s > 1 only (8 abscissae), finite Euler product p <= 1e7, float64, tail radius; both signs of the ordinate |
| `SGN-00` .. `SGN-23` | completely multiplicative, eps(p) = +-1; numpy PCG64 seed 121000 + j, `1 - 2 * integers(0, 2)` | no | none | as U |
| `THIN-0.9` | eps(p) = -1 on the greedy floor set for L = (1/2)(Ei(b log x) - Ei(b log 2)), b = 0.9 (74363 primes below 1e7) | stage | none | zeta x finite product over the set (1e7 stage), 30 digits; tail radius for Re s > b |
| `DEL-0.75`, `DEL-0.9` | primes of the greedy floor set for L = Ei(b log x) - Ei(b log 2) deleted (16210 and 148727 primes below 1e7) | stage | none | as THIN |
| `HEAT--0.1`, `HEAT--0.5` | F_tau(z) = int e^(tau u^2/16) kappa(u) e^(zu/2) du, s = 1/2 + z | quadrature | z <-> -z | scaled mantissa + decimal exponent, 13 x 4001, at least 100 accurate bits (rounding only) |
| `BEU` | Beurling system with generalised primes q_n = p_n + 1/2; zeta_B = zeta H, H = prod (1 - p^-s)/(1 - (p+1/2)^-s) | stage | none | H_X (p <= 1e7, float64) to be multiplied by the ZETA table; tail radius |

Grid: Re s in {0.5, 0.625, ..., 2.0}; Im s in {0, 0.5, ..., 2000}. Negative ordinates: F(conj s) = conj F(s) for real coefficients; `WT-CONJ` and the `neg` array of U otherwise. Poles on the grid are stored as nan.

What "30 digits" means per kind:
- closed: 128-bit balls, stored as double-double (`re_hi + re_lo`, `im_hi + im_lo`) with the ball radius `rad`; a spot check of 300 random points per table against direct evaluation is in `tables/sanity.json`.
- stage (THIN, DEL): the table is the 1e7 stage to 30 digits (computed at 320 bits: at 128 bits the ball radius is inflated along the product at Re s <= 5/8). For Re s > b the object equals the stage times exp(e), |e| <= `tail_log_radius[sigma]` (meta; uses D <= 0, c10 Lemma 0). For Re s <= b the object is not determined by any finite table (c10 verdict item 3): the stage has no zero at b.
- product (U, SGN): no continuation exists on file. The value is the finite Euler product; the object equals it times exp(e), |e| <= `tail_log_radius[sigma]` = 1.25506 (sigma/(sigma-1)) X^(1-sigma)/log X: 0.093 at sigma = 1.125, 1.6e-8 at sigma = 2. Thirty digits are not attainable from a table to 1e7.
- BEU: H_X in float64; |log H - log H_X| <= `tail_log_radius[sigma, t]` (0.074 at sigma = 1/2, t = 2000; 1.6e-5 at sigma = 1, t = 2000; below 1e-9 at sigma = 2).
- HEAT: Gauss-Legendre quadrature of `heatlib.py` at 506 to 2605 bits depending on height; rounding error is enclosed, the truncation error of the quadrature is not. Check: at tau = 0 the same quadrature gives xi(1/2 + it)/2 to 30 digits at t = 499.7 and t = 1999.7.

## 2. Files (tables/)

| file | content |
|---|---|
| `values_<code>.npz` | `sigmas`, `t`, `re_hi`, `re_lo`, `im_hi`, `im_lo`, `rad`, `meta` (json: kind, poles, functional equation, local parameters, rule for negative ordinates) |
| `values_U.npz`, `values_SGN.npz` | `pos[j, sigma, t]` (and `neg` for U), `tail_log_radius`, `meta` |
| `values_BEU.npz` | `H[sigma, t]`, `tail_log_radius[sigma, t]` |
| `values_HEAT-<tau>.npz` | mantissas as above, `exp10`, `rel_accuracy_bits` |
| `zeros_ZETA.json` | 1517 ordinates below 2000 (Arb `zeta_zeros`, count = `zeta_nzeros(2000)`); `zeros_ZETA_2H.json`: 3474 below 4000 |
| `zeros_DH.json` | 1861 on-line ordinates and 84 off-line pairs below 2000; 200 boxes, winding count 2029 = 1861 + 2 x 84, every box closed |
| `zeros_EA-*.json`, `zeros_TNR.json`, `zeros_WT.json`, `zeros_SGN-LIOU.json` | derived from the zeta table by the stated rule, with residuals at sampled zeros |
| `zeros_THIN-0.9.json`, `zeros_DEL-*.json`, `zeros_BEU.json`, `zeros_U_SGN.json` | the rule (theorem), not data |
| `zeros_HEAT-<tau>.json` | on-line ordinates, off-line pairs, count diagnostic against the zeta count |
| `coef_<code>.npy` (server) | a[0..1e7], index = n: int8 (ZETA, SGN, THIN, DEL, SGN-LIOU), float64 (DH, EA, TNR), complex128 (U, WT) |
| `local_primes.npy`, `local_U.npy`, `local_SGN.npy`, `set_<code>.npy`, `beu_integers.npy` | local parameters: the 664579 primes, u_p (24 rows), eps(p) (24 rows), the deleted or flipped sets, the 7402977 generalised integers below 1e7 |
| `coef_manifest.json` | sha256, dtype and the consistency of every coefficient table: sum over n <= 1e7 of a(n) n^-s at s = 2, 3, 2 + 7i against the value interface |
| `sanity.json` | non-vanishing check (minimum of abs F on Re s = 2 against a proved lower bound), table spot check |
| `device_D1.json` .. `device_D5.json`, `device_D1_diagnostic.json` | the five replays, every check with the recorded number |
| `MANIFEST.json` | sha256 and size of every file, device summary |

Sizes and checksums of every file: `FILES.md` (generated from `MANIFEST.json`).

## 3. Use

```python
import sys; sys.path.insert(0, '<lane>/battery')
import load
B = load.Battery('<lane>/tables')
B.codes()
v = B.values('DH'); v['F'][0, 171]        # float64 view of F(0.5 + 85.5 i); v['ball'](0, 171) is the acb with radius
B.zeros('DH')['offline'][:2]              # [beta, gamma, residual]
B.obj('TNR').value(acb('0.7', '12.3'))    # direct evaluation at any point (closed-form objects), any precision
B.obj('DH').completed(s)                  # completed function; also accepts acb_series (derivatives)
B.coef('U-07')                            # memory-mapped coefficient array (server)
```

`battery/core.py`: objects, completed functions, `logder`, `deriv_completed`. `battery/coeffs.py`: coefficient generators by seed. `battery/sets.py`: greedy floor sets. `battery/zeros.py`: zeta and DH zero tables. `battery/heat.py`, `battery/heat_gaps.py`: heat tables. `battery/grid.py`: value tables. `battery/derive.py`: derived zero tables and sanity. `devices/d1..d5`: replays; each takes the tables directory and compares with the record files copied (as data) into `records/`.

Rebuild: `run_main.sh`, then `python battery/heat.py tables 2000 0.05 0.5`, then `run_final.sh`. On the server through `rhrun` only. Measured cost of the full build: see RESULT.md section 3.

## 4. Known limits

1. U, SGN (random), and the true THIN, DEL objects left of b have no values in the strip. A device that needs them on Re s = 1/2 is not formulable on these controls; the tables say so instead of supplying a finite product as if it were the object.
2. DH and HEAT zero tables are not interval certificates. DH: all 200 box counts close. HEAT: tau = -0.1 balances the zeta count (1435 on-line + 2 x 41 pairs = 1517); tau = -0.5 balances below height 500 and is short by 34 zeros (17 pairs) between 500 and 2000: its off-line list is incomplete there.
3. The Beurling system is one fixed choice (shift 1/2). Its zeros in Re s > 0 are zeta's; it is a control for arguments that use integer frequencies, not a source of off-line zeros.
4. T-NR is fixed at (q, c) = (3, 2.2); E_a at three shifts; WT at one translate.
5. Each table carries its own conjugation rule; U needs `neg`.
