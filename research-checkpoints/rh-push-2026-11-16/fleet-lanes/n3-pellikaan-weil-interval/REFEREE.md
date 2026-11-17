# REFEREE: n3-pellikaan-weil-interval

Date: 2026-11-17. Adversarial referee (general). All runs local through `scripts/memcap.sh 8`, single process,
longest 16 s. No ssh. Referee scripts are independent of `pell.py` (kept outside the repo in `/tmp/ref-n3/`:
`scan.py`, `curves.py`, `formal.py`); only this file was written in the lane directory.

**Verdict: holds, as a function-field statement, with three corrections to labels and one to the scaling law.**
Every PROVED step in genus 2 was re-derived by hand and reproduced numerically from the definition. Nothing
assumes RH, nothing restates verified height, no statement about zeros of zeta is made. The transfer to zeta
(section 7, last paragraph) is an analogy and carries no weight.

## 1. PROVED steps re-derived

| Step | Check | Outcome |
|---|---|---|
| Genus-2 numerator | `Z = 1 + N_1 T + (h+u)T^2 + h sum_{n>=3} (1+..+u^{n-2}) T^n` (degree 2: canonical class has `h^0=2`, the other `h-1` have `h^0=1`; degree `>=3` non-special). Multiplying by `(1-T)(1-uT)`: `p_1 = N_1-1-u`, `p_2 = h-N_1+(2-N_1)u`, `p_3 = u p_1`, `p_4 = u^2`. `P(1,u) = h`. | confirmed |
| Depends only on `(N_1,h)` | immediate from the line above | confirmed |
| `m`-quadratic | `P = T^2 G(1/T+uT)`, `G = y^2 + p_1 y + p_2 - 2u`; `t_1+t_2 = 1+u-N_1`, `t_1 t_2 = h-N_1-N_1 u`; `m = 1+u-t` gives `m^2-(N_1+1+u)m+h` | confirmed |
| On-circle criterion | `t_i` real in `[-2 sqrt u, 2 sqrt u]` iff `m_i` real in `[(sqrt u-1)^2,(sqrt u+1)^2]` (`u>0`) | confirmed |
| Flow | implicit differentiation: `m_i' = m_i/(2m_i - s) = m_i/(m_i-m_j)` | confirmed |
| Collision endpoint | discriminant zero at `u_d = 2 sqrt h - N_1 - 1`; `q-u_d = m_1+m_2-2 sqrt(m_1 m_2)` at `u=q` | confirmed |
| Conditions 4(b) 1-4 | re-derived with `r = sqrt m_2`: 2 is `sqrt u <= 1+sqrt m_1`, 3 is `sqrt u >= abs(1-sqrt m_1)`, 4 is `sqrt u >= r-1`. Condition 3 on the side `m_1 >= 1` is not part of the definition but is implied by 4 (`sqrt m_1 <= sqrt m_2 <= sqrt u + 1`), so the set is unchanged. `psi`, `chi` increasing for `r >= h^{1/4}` (`r^3 >= sqrt h`), `phi` convex. | confirmed |
| 4(c) `I_C = J \ G` | `J` closed interval, `G` open interval by convexity of `phi` | confirmed |
| 4(d) interval for `h >= 65` | `psi <= phi` iff `(r^2-2r-sqrt h)(r^2+sqrt h) <= 0`; `h^{1/3} = 1+sqrt(1+sqrt h)` exactly at `h = 64`, strict for `h >= 65` | confirmed |
| 4(e) nine pairs, `h <= 49` | independent scan from the definition (float roots of the three critical polynomials in `sqrt u` and of their derivatives, membership tested between and at critical points): box `0<=N_1<=40`, `1<=h<=80`: 3280 pairs, 2546 empty, 9 disconnected, the same nine pairs with the same endpoints to 4 decimals. Extended box `N_1<=120`, `h<=400` (48400 pairs): the same nine, none with `h >= 50`; no non-empty `I_C` with `N_1 > 40`, `h <= 80`. | confirmed |
| `N_1 > 40`, `h <= 80` empty | `m_2 <= (w+1)^2` and `m_2 >= (N_1+1+u)/2` give `w^2+4w+1 >= 41`, `u >= 21.5`, so `(w-1)^2 >= 13.2` while `m_1 = h/m_2 <= 160/62.5 = 2.56` | confirmed |
| Realisations | independent enumeration of `y^2=f` over F_3 (1296 models, 50 tuples) and F_7 (230496 models, 192 tuples): (5,12) and (8,36) occur over F_3, (8,36) over F_7. (6,16), (9,49) over F_5 not rerun (F_25 not in the referee script). | confirmed for 3 of 5 |
| `prod m_i = h` | this is `P_C(1,u) = h` (Pellikaan), valid for every genus; `msym.py` rerun, output as stated for `g=2,3,4` including `W` for `g=3` | confirmed; label should be CLASSICAL, not PROVED |

## 2. Numeric check on a different case

The lane measured `q = 3,5,7`. Referee: genus 2, random samples of curves over F_11 (6000 models, 378 distinct
`(N_1,N_2)`) and F_19 (3000 models, 755 tuples), `N_2` counted over `F_q[i]`.

| q | q x median log-length | q x max | lower endpoint is `u_d` |
|---|---|---|---|
| 3 (full) | 2.5405 | 5.98 | 48/50 |
| 7 (full) | 2.6783 | 5.18 | 191/192 |
| 11 (sample) | 2.64 | 4.63 | 378/378 |
| 19 (sample) | 2.68 | 4.26 | 755/755 |

`c_2 = 2.7` and "typical lower endpoint is a collision" are reproduced on new fields. The samples are not the
full tuple sets, so medians at `q = 11, 19` carry sampling error of a few percent.

## 3. Controls

The result claims no zeta-only mechanism, so the three mandatory controls cannot be run against a step; they
were checked as stated.

- DH analogue 1: reproduced independently: 73/1225 (F_3) and 1343/18336 (F_7) midpoints leave the Weil region;
  `(3,7)` and `(-3,7)` are both realised over F_3; `1+7T^2+9T^4` has `T^2 = (-7 +- sqrt 13)/18`, modulus not 1/3.
- DH analogue 2: 1769 of 2500 formal pairs have empty `I_C`: reproduced.
- Heat flow: `dm_i/du = m_i/(m_i-m_j)` is a two-body repulsion with a factor `m_i`; "the same form as the
  heat-flow zero dynamics" is loose (the heat flow has constant numerator and a sum over all other zeros). The
  lane itself says `u` is not the heat axis. No conclusion depends on it.
- Sign twist: descriptive only. No test was possible or needed.

## 4. Errors and overstatements

1. **Scaling law is stated more strongly than measured.** `c_g q^{-g/2}` is supported in `q` only for `g = 1, 2`
   (referee extends `g = 2` to `q = 19`). For `g = 3` the table gives 1.86, 1.75, 1.64 at `q = 3, 5, 7`: the
   fitted exponent between `q = 3` and `q = 7` is `log(0.359/0.0887)/log(7/3) = 1.65`, not 1.5, and the
   normalised constant has not levelled off. For `g = 4, 5` there is one field (`q = 3`), so the `q`-exponent is
   untested and `c_4, c_5` are single numbers, not constants of a law. At `q = 3` the decrease per genus is
   2.43, 2.36, 2.22, 2.11, against `sqrt 3 = 1.73` from a fixed `q^{-1/2}` per genus; the difference is absorbed
   in the decreasing `c_g`. Supported statement: at `q = 3`, hyperelliptic curves, the median log-length falls
   by a factor between 2.1 and 2.4 per unit of genus for `g <= 5`. "Geometric at rate `q^{-1/2}`" is not
   established.
2. **Headline "interval for `h >= 50`"** is correct but is proved only for `h >= 65`; `50 <= h <= 64` is by the
   scan (the lane says so in 4(d)-(e); the summary line should carry the split).
3. **`prod m_i = h` labelled "PROVED, g<=4 symbolic"** is the classical `P_C(1,u) = h` for all `g`.
4. **"Arithmetic, not archimedean" loss of margin** and **"the analogue for infinitely many zeros is zero
   margin, matching Lambda >= 0"** are interpretation. No limit object is defined, and fixed `q`, `g -> infinity`
   is tested on hyperelliptic curves only (gonality 2, not typical). Should be labelled ARGUED/analogy
   throughout, as weakest step 3 already concedes.
5. **Hyperelliptic `b_{n,k}` input for `g >= 3`** was not verified by the referee (the lane's weakest step 2).
   All `g >= 3` numbers depend on it. Genus 2 does not.
6. **Novelty.** The genus-1 numerator `1+(N-1-u)T+uT^2` and `P(1,u)=h` are in Pellikaan (1996). The question
   "for which values of the second variable are all zeros on the line" is the question Lagarias and Rains
   studied for the number-field two-variable zeta (math/0104176); the lane does not cite it. Two web searches
   found no prior statement of the genus-2 classification (nine exceptional pairs); the search was short and
   does not establish novelty. The Hankel criterion is Hermite's and is labelled CLASSICAL.

## 5. What survives

Genus-2 Lemma 2 in full (numerator depends only on `(N_1,h)`; `I_C` = closed interval minus at most one open
interval; interval for `h >= 50`; exactly nine disconnected integer pairs; collision lower endpoint
`u_d = 2 sqrt h - N_1 - 1`; flow law), and `log-length ~ 2.7/q` in genus 2 for `q <= 19`. For `g >= 3`: a measured
decrease of the margin with genus at `q = 3`, conditional on the unverified hyperelliptic class-count formula.
As an obstruction it closes the `u`-family as a source of an open condition around `u = q` only at the level of
measurement; it gives no information about zeta.

Sources consulted: Naumann, arXiv math/0209092; Lagarias-Rains, arXiv math/0104176 and math/0210269;
van Frankenhuijsen, arXiv 0806.0044.
