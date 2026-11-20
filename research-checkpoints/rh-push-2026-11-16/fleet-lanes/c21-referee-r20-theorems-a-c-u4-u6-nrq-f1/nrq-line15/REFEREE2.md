# REFEREE2: the NR-q construction (Statement O line 15; source `c15-control-with-zeta-fe-classes-u1-u2`, row F4; map row NR-q)

Second referee, lane `c21-referee-r20-theorems-a-c-u4-u6-nrq-f1`, 2026-11-20. Written from the map row NR-q, the
passages of `c15-.../RESULT.md` on F4, Lemma D and the companion paragraph, and item C of the line-4 lane's
RESULT; no `REFEREE.md` was opened. Numerics: `nrq_ref2.py` -> `nrq_ref2.json` (mpmath 30 digits; winding numbers
by quadrature of G'/G, not ball arithmetic; local, `scripts/memcap.sh 8`, seconds). The object is a control; no
statement about zeros of zeta.

## Verdict

**The construction holds, with two corrections of wording.** Every listed property of
G(s) = zeta(s)(q^(s-1/2) + c + q^(1/2-s)), q = 1 + sqrt 2, 2 < abs c < q^(1/2) + q^(-1/2), was re-derived.

## 1. Properties re-derived

| property (map row) | derivation | check (30 digits) | label |
|---|---|---|---|
| zeta's functional equation exactly | m(s) = q^(s-1/2) + c + q^(1/2-s) = m(1 - s), entire | relative defect of gam(s) G(s) - gam(1-s) G(1-s) at 0.3 + 4.7i and 0.9 + 21.5i: <= 1.2e-30 (c = 2.1, 2.05, 2.2, -2.1); abs G = 0.71, 2.27 there | PROVED-2 |
| no rational power of q | q^k = a_k + b_k sqrt 2 with (a, b) -> (a + 2b, a + b); b_k = 1, 2, 5, 12, 29, ... > 0 for k >= 1 (Pell numbers); q^-k = +-(a_k - b_k sqrt 2) | b_1..b_12 listed | PROVED-2 |
| discrete frequencies log n + j log q, j in {-1, 0, 1}; the three cosets are disjoint | n q^j = n' q^j' forces q^(j - j') rational, so j = j' | generalised series sum_n [q^(-1/2)(n/q)^-s + c n^-s + q^(1/2)(nq)^-s] against the product at s = 3: 1.6e-30 | PROVED-2 |
| integer-frequency part equal to c zeta; Hecke relation at every rational prime on each coset | each coset series is a constant times zeta | - | PROVED-2 |
| zeros of the factor on Re s = 1/2 +- b, b = arccosh(abs c/2)/log q | 2 cosh((s - 1/2) log q) = -c; for c > 0: (s - 1/2) log q = +-arccosh(c/2) + i pi (2k + 1) | c = 2.1: zero 0.857311316383780998955 + 3.564427956382738223549 i, abs G = 7e-32, abs zeta = 0.632 there, m' = 0.564 (simple), winding of G on radius 0.05: 1.000000000000, of zeta: 0. c = 2.05: 0.753177034801772327887 + 3.5644279563827382 i, winding 1 | PROVED-2; zeros CHECKED here and CERTIFIED by the line-4 lane (item C), same digits |
| inside the open strip iff abs c < q^(1/2) + q^(-1/2) = 2.19736822693562 | b < 1/2 iff abs(c)/2 < cosh(log q/2) | c = 2.2: zero at Re s = 1.00326928435 (outside), winding 1 | PROVED-2 |
| GEOM, SIZE, POS fail at the one added generalised prime | 1 + c y + y^2 = (1 - A y)(1 - y/A), y = q^(1/2) q^-s, A + 1/A = -c; parameter A q^(1/2) in q^-s | abs(A) q^(1/2) = 2.128913 at c = 2.1 (map: 2.129) against q^(1/2) = 1.553774; Re of the zero = 1/2 + log abs(A)/log q = 0.857311316 | PROVED-2 |
| Lemma D ratio | abs m >= abs c - (q^u + q^-u), u = abs(Re s - 1/2) <= 1/2: a zero in the closed strip needs (q^(1/2) + q^(-1/2))/abs c >= 1 | 1.0463658 (c = 2.1), 1.0718869 (2.05), 0.9988037 (2.2) | PROVED-2 |
| pole at 1 only, simple | m entire, m(1) = q^(1/2) + c + q^(-1/2) | m(1) = 4.297 (c = 2.1), 0.0974 (c = -2.1), non-zero | PROVED-2 |

## 2. Corrections of wording

1. **Sign of c.** The map row allows 2 < abs c. For c < 0 the factor's zeros are at 1/2 +- b + 2 pi i k/log q,
   so the lowest one is **real**, at 1/2 + b in (1/2, 1) (CHECKED at c = -2.1: G(0.8573113...) = 6e-31 with
   zeta = -6.44 there). The recorded complex zero 0.857311 + 3.564428 i belongs to c = +2.1. The row should say
   "c > 2: zeros at 1/2 +- b + (2k+1) pi i/log q; c < -2: at 1/2 +- b + 2k pi i/log q, the one with k = 0 real".
   For c < -2 the control then also has a real zero in (1/2, 1), like SG, and m(1) > 0 is small but non-zero.
2. **"Ordinary" normalisation.** G is a generalised Dirichlet series whose lowest frequency is -log q (coefficient
   q^(-1/2) at "n = 1/q"); it has no term normalised to 1 at frequency 0 with all others positive, and abs G grows
   like q^(sigma - 1/2) as sigma -> +infinity. A device step that requires a_1 = 1 with frequencies >= 0, or
   boundedness to the right, rejects NR-q at that hypothesis (as T-NR; row NR of the euler-shape lane's table says
   the same). The use sentence "kills steps that read the coefficients at integers only, or covariance at
   rational primes only, together with the functional equation" is correct as worded: the integer-frequency part
   is c zeta and passes any such read.

## 3. Line 15 as a statement

"A step that reads zeta's functional equation together with (a) the coefficients at integer frequencies only, or
(b) Hecke covariance at rational primes only, does not separate zeta from NR-q, which has zeros off the line
inside the strip." Holds as a statement about the object (PROVED-2). Whether a given device reads only (a) or (b)
is decided per device and stays ARGUED under the rule of Statement O.

## 4. Three weakest steps

1. The line is a statement about classes of device steps; the object-level facts are proved, the classification
   of a device's read set is argued case by case (twist convention "chi acts on the atoms, the multiplier is kept"
   is a choice of the source lane).
2. NR-q leaves the class of ordinary Dirichlet series with a_1 = 1 (correction 2): for devices in that class it is
   not a member, and the control with zeta's functional equation inside the class is HQ1 to HQ4 (pole clause).
3. The zero enclosures are certified by one derivation (line-4 lane item C) and checked here at 30 digits without
   ball arithmetic; the closed form makes this low risk.

## 5. Flags

Control statement. R1 to R4 false.
