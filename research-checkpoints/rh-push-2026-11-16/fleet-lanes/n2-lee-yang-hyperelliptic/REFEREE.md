# REFEREE: n2-lee-yang-hyperelliptic

Verdict: **holds** (precise-obstruction; the lane's own first lemma is false). No PROVED step failed. Five corrections, none changes the verdict.

Referee code was written from scratch (no import of lylib.py / schur.py), run through `scripts/memcap.sh 8 .venv-arb/bin/python`, single process, each run under 2 minutes, largest allocation 104 MB. No ssh. Scripts and logs: /tmp/ref_n2/ref.py, sd.py, ref.log, sd.log (not copied here; only this file is written).

## 1. PROVED steps re-derived

- **R1** confirmed. For k >= n evaluation of monic degree-k polynomials onto F_q^n is onto with fibres q^{k-n}; the weighted count of all-nonzero value tuples is ((q-1)/2)^n prod(1+z_i). Brute force at k = n and k = n+1 (q = 5, 7, 11; exact rationals) equals q^{k-n} C(z).
- **R2** confirmed. z^{[s=-1]} = (1+z)/2 + s(1-z)/2 for s = +-1; prod_{i in S} chi(D(e_i)) is the symbol (D / f_S); the coprimality to f removes the Euler factors at x - e_i, i not in S. Convention note: the character is D -> (D/f), which for q = 3 mod 4 and odd n is the L-function of y^2 = -f rather than y^2 = f (reciprocity). Harmless for every statement made.
- **R3** confirmed at all 2^n vertices for five curves (q = 5..17): every root of N lies on {1/q}, |u| = 1 or |u| = q^{-1/2}; N(u; 1) = (1-u)^n.
- **R4** confirmed (Fourier transform of a(1 - delta_0) + b chi; the C1 root moduli 0.4454, 0.7767, 1.7627 are not closed under r -> 1/r).
- **R5** confirmed by implicit differentiation (W affine in t_i, dt_i/dz_i = -1/2, L(u_j) = 0).
- **R6** confirmed by hand (u L' = q u^2 - 1 at a root; q u_0^2 - 1 = 2i sin(phi) e^{i phi}) and by central finite differences for all sets {0,1,e}, q = 5, 7, 11, 13, 17, 19: max |formula - finite difference| = 1.1e-9; the values of 4q Re rho are exactly {q-1, q+1}. The "rho real" curves need a = 0 and s_i = -1 at all three sites: true for the three a = 0 sets at q = 11 (and q = 19), false at q = 7 (a = 0 but some s_i = +1, Im rho = -1/(2 sqrt q)).
- **Section 5 structural step** (functional equation implies no polydisc stability) confirmed as stated.

## 2. Numerics rerun

- C1, C2, C3, C4 reproduced (coefficients and root moduli: 0.44544/0.77669/1.76265; 0.27751/0.46300; 0.845189109350817673; 0.80924607669). C3 polynomial 3 - 8u + 38u^2 + 64u^3 + 143u^4 and its mixture form (1/3) L_f + (2/3)(1-u^2)(1 - 6u + 13u^2), L_f = 1 + 4u + 14u^2 + 52u^3 + 169u^4, checked by hand.
- **Different case, n = 5 real cube, q = 17 and q = 19 (not in RESULT), all sets {0,1,a,b,c}, one coordinate moved on a 40-point grid:** a root inside |u| < q^{-1/2} occurs for 269 of 455 sets (q = 17) and 400 of 680 sets (q = 19). Minima: q = 17, e = {0,1,2,5,14}, z_2 = -1/5, W = (5 + 28u + 254u^2 + 540u^3 + 901u^4)/5, |u| sqrt 17 = 0.665276448; q = 19, e = {0,1,3,4,9}, z_5 = -1/10, |u| sqrt 19 = 0.769578261 (40-digit polyroots; not Schur-Cohn certified by me). The genus-2 real-cube failure is the typical case at these q, not an isolated one.
- **n = 3 real cube, 3000 random points per curve, all sets, q = 5..19:** at most one root in the disc at every point; minimum second-smallest |u| sqrt q = 1.018. Agrees with the MEASURED/grid claim; still not proved.
- **Self-dual family:** functional equation for E_k and N_sd reproduced to 1e-14 at random complex z (q = 13, 17, 29; n = 3, 5). C5 reproduced: roots 1, 1/13, +-0.6283922 i, +-0.1224125 i; moduli 0.441365, 2.2657. Random real cube, n = 5: all four nontrivial roots off the circle at 9.7%, 6.4%, 1.6% of 1500 samples on three curves.

## 3. Errors and corrections

1. **Section 5, "every vertex z in {+-1}^{n+1} has all nontrivial roots on the circle".** At vertices with an odd number of coordinates equal to -1, N_sd is identically zero (scaling D by c multiplies the weight by chi(c)^odd; measured: 8 of 16 vertices for n = 3, 32 of 64 for n = 5 are zero polynomials). The statement is true for the vertices with an even number of -1 (checked: 0 exceptions on three curves). The functional equation is vacuous on the other half.
2. **Section 5, labelling.** For generic real z the roots 1 and 1/q of N_sd do not stay at 1 and 1/q; they move as a real pair (u, 1/(qu)) (e.g. moduli 0.314/3.180 times q^{-1/2}). C5 has exact roots 1 and 1/13 only because of its z_i = -1 coordinates. The "circle statement" must be read as "all roots but one real reciprocal pair". The verdict is unaffected.
3. **"2-34% of samples for every one of 14 curves".** One of my three curves (q = 13, e = {0,1,2,3,4}) gave 1.6%. The range is sample-dependent; treat as MEASURED order of magnitude.
4. **Functional equation labelled MEASURED; it is provable in three lines.** Each w_i is an eigenvector of the v_i-twisted Fourier transform with eigenvalue eta_i sqrt q (both components), so Poisson on the extended Reed-Solomon code of dimension k+1 with dual of dimension n-k gives E_k = q^{k+1} q^{-(n+1)} q^{(n+1)/2} prod(eta_i) E_{n-1-k}, and prod_i chi(f'(e_i)) = chi((-1)^{n(n-1)/2}) = 1 for q = 1 mod 4. Direct check at k = n: sum_a w_i(a) = eta_i sqrt q w_i(0). The label can be raised to PROVED; weakest step 3 is weaker than stated.
5. **R6 "no uniform sector".** For fixed q the set of curves is finite, so the statement is about q -> infinity: it needs split-Legendre curves with trace near +-2 sqrt q (available by Deuring/Waterhouse with 4 | q+1-a). The result does not say this; label ARGUED for the uniformity clause, PROVED for the formulas.
6. **Section 7 extrapolation** ("a Lee-Yang proof would need ferromagnetic-type interaction") is an inference, not a proved statement; it should carry ARGUED.

## 4. Controls, RH-dependence, novelty

- DH, backward heat, sign twist: not applicable. The result claims no zeta-only mechanism; it refutes a lemma on function-field objects where RH is a theorem (Weil), so nothing assumes RH and nothing restates verified height. The function-field fake (1 - 5T + 5T^2) control is correctly reported as non-formulable.
- Novelty: the result claims only a finite calibration, not a theorem. Related prior art it should cite: Duursma's zeta functions of linear codes (functional equation from MacWilliams duality; the Riemann-hypothesis analogue fails for many self-dual weight enumerators), which is the same phenomenon as section 5. That a convex combination of polynomials with roots on or outside a circle can have roots inside is elementary. I did not run an online literature search.
- Not rerun by me: the exact Schur-Cohn counts, the 27 points of certify.json, the 13^3 grid, the two-path continuation. My reproduction of C1-C5 is by float64 and 40-digit root finding with margins of 15% or more from the circle.

## 5. Surviving claim

For split odd-degree f over F_q, (1-qu)W(u; z) is the multi-affine interpolation of the 2^n sub-curve L-functions (PROVED). Lee-Yang stability in z fails: in the open polydisc for n = 3, 5 (q = 5..13), and on the real cube for n = 5 at q = 11, 13, 17, 19 (most curves at q = 17, 19). For n = 3 the real cube is first-order stable (PROVED) and stable at all sampled points (MEASURED). The self-dual repair has a provable functional equation and still leaves the circle on real parameters for n = 5. No statement about zeta follows beyond: multi-affine interpolation between Euler products does not inherit their zero location.
