# REFEREE (lens: general) for c2-euler-cone-fe-rigidity/RESULT.md

Date: 2026-11-18. Claimed verdict: precise-obstruction, no new result. Claimed flags: R1 R2 R3 R4 all false.

## Outcome

**The verdict holds.** Every PROVED step was re-derived and confirmed. The measured pattern was reproduced at a height the
lane did not use (T = 3e4). No step assumes RH, none restates verified height as a result, and Hamburger's theorem and
Bohr-Courant are labelled CLASSICAL, not new. No statement about zeros of zeta is made. Seven reporting errors and
overstatements are listed in section 4; none changes the verdict or a flag.

Referee flags: R1 false, R2 false, R3 false, R4 false.

## 1. PROVED steps, re-derived

**Lemma 1 (Hamburger; CLASSICAL).** For F in C the local factor is `exp(sum_k m_k x^k / k)` with `|m_k| <= 1`; its
coefficients are majorised by those of `(1-x)^{-1}`, so `|a(n)| <= 1` and F is an absolutely convergent Dirichlet series for
Re s > 1. With `(s-1)F` entire of finite order and the gamma factor of zeta on both sides, Hamburger gives `F = a(1) zeta`,
`a(1) = 1`. Confirmed. Neither the cone nor multiplicativity is used. Not presented as new.

**Lemma 1b (PROVED).** `chi(s) = pi^{s-1/2} Gamma((1-s)/2)/Gamma(s/2)`, so
`chi'/chi(s) = log pi - (1/2) psi(s/2) - (1/2) psi((1-s)/2)`: poles exactly at `s = -2n` and `s = 1+2n`, and the residue at
`s = -2n` is +1 (I computed it: `psi(z) ~ -1/(z+n)`, `z = s/2`). The mixture has poles at `-2n - i a_j` with residue `w_j`;
poles of the two families cannot cancel (real parts -2n and 1+2m differ). Equality with `chi'/chi` forces a single
`a_j = 0` with `w_j = 1`. Confirmed. For a general measure w the text says "same argument with the support of w"; that is
too short as written (an absolutely continuous w gives no poles at all). The correct one-line argument:
`lim_{x -> 0} x int dw(a)/(x + i a) = w({0})` by dominated convergence, and the residue 1 at `s = -2n` forces `w({0}) = 1`.
The conclusion stands. Lemma 1b is also a corollary of Lemma 1 for any F that lies in A's class; its content is only the
branch-point reading.

**Structural remark (section 1).** A is linear in `a(n)`, C is convex in the coefficients of `log F`. Confirmed.

**Lemma 2 (PROVED to leading order).** On `s = 1/2 + it`: `chi(s + i alpha)/chi(s) = exp(-2i[theta(t+alpha) - theta(t)])`,
`2[theta(t+alpha) - theta(t)] = alpha log(t/2 pi) + alpha^2/(2t) + ...`, and with `alpha log(Tc/2 pi) in 2 pi Z`,
`alpha log(t/2 pi) = alpha (t-Tc)/Tc + O(alpha H^2/T^2)` mod 2 pi. The stated expansion and the bound
`(|alpha| H/(2T) + alpha^2/(2T)) |zeta(1/2 + i(t+alpha))|` follow. Confirmed. The defect is
`|zeta(s + i alpha) - chi(s) zeta(1 - s - i alpha)|`, which I evaluated directly (next section).

**Lemma 3 (ARGUED).** Conductor matching `q (t + alpha)/2 pi = t/2 pi` at `t = Tc` and the second-order mismatch
`(q-1)(H/2)^2/(2T)` re-derived; correct. The measured residual is 25 times the prediction and the lane says so. Lemma 3
stays ARGUED/MEASURED; nothing in the verdict depends on it.

## 2. Numeric reruns (all local, `scripts/memcap.sh 8`, scratch directory /tmp/ref_c2_general, nothing written to the lane)

**(a) Lemma 2 independently of the lane's model** (mpmath, 30 digits, exact defect on 21 points of the window):

| T | H | k | alpha | max defect | leading bound x max abs zeta | ratio |
|---|---|---|---|---|---|---|
| 3e4 | 5 | 1 | 0.742 | 1.96e-4 | 6.64e-4 | 0.30 |
| 3e4 | 5 | -3 | -2.225 | 5.76e-4 | 1.14e-3 | 0.50 |
| 3e4 | 5 | 20 | 14.83 | 8.08e-3 | 9.81e-3 | 0.82 |
| 3e6 | 5 | 1 | 0.481 | 2.06e-6 | 2.51e-6 | 0.82 |
| 3e6 | 5 | 20 | 9.61 | 3.27e-4 | 3.51e-4 | 0.93 |
| 2e8 | 1 | 1 | 0.364 | 1.02e-8 | 2.19e-8 | 0.47 |
| 2e8 | 1 | 20 | 7.27 | 5.99e-7 | 6.82e-7 | 0.88 |
| 3e4, 3e6, 2e8 | | 0.5 (off lattice) | | 17.8, 11.6, 42.0 | | (control: fails) |

The bound holds in all 12 lattice cases (ratio 0.2 to 0.93). Half-lattice translates fail with defect of the size of
`2 |zeta|`. `|zeta(s0 + i alpha_k) - zeta(s0)|` at `s0 = 3/4 + i Tc` ranged from 0.44 to 4.1. Lemma 2 confirmed.

**(b) The lane's window model at a new height, T = 3e4, H = 2, N = 221, dense design.** The weights in `afe.py` reproduce
`mpmath.zeta` to 3.9e-11 (sigma = 1/2) and 7.3e-12 (sigma = 3/4) at X = 0.55, 1, 1.9.

- Window rank 30/440 (lane: 30 at every T). Relaxed width re 27.5, im 9.2.
- Slice through zeta: max deviation 0.65 (lane: 0.61 at 1e4, 2.83 at 1e5). Translate slices k = +1, -1, +3 feasible.
- Prescribed zero at `3/4 + i t0`, tolerance 1e-5: feasible in the k = -1 slice. `witness.py`: 41 free primes,
  `max |c_p| = 1 + 6e-12`, `|F(s0)| = 1.4e-5` (zeta: 0.466), design residual 1.06e-5, residual on the 4x finer grid 1.98e-5
  (median 8.6e-6). Not feasible in the k = 0 and k = +1 slices at this height.
- Tolerance 1e-7 at T = 3e4: k = 0 and k = +1 return HiGHS status 2 (infeasible); k = -1 did not finish in 20 minutes and
  I stopped it. So the lane's 1e-8 witness at T = 1e5 was not reproduced at a second height. It is one case.

**(c) Controls through the same model, T = 3e4** (max FE residual; zeta itself: 4e-11):

| coefficients | residual |
|---|---|
| lattice translates k = 1, 2, -3 | 8.1e-5, 1.6e-4, 2.4e-4 |
| off-lattice translates k = 0.5, 7.3 | 2.2, 1.4 |
| Liouville (point mass at -1 at every prime) | 1.4 |
| sign flip at p = 2 only | 0.76 |
| random unimodular completely multiplicative | 1.6 |
| chi_4 | 0.71 |
| Davenport-Heilbronn coefficients (period 5) | 0.70 |

The model separates zeta from every control at O(1) except the lattice translates, which pass at about `|alpha| H/T` as
claimed. This is the R3 failure the lane reports: a unimodular twist control passes the window version.

**(d) Cited number.** DH rung Toeplitz at p = 2, K = 2: I recomputed `m_1 = a(2) = 0.2841`, `m_2 = 2a(4) - a(2)^2 = -2.0807`,
eigenvalues -1.1556, 1.075, 3.081. The cited `lambda_min = -1.156` is correct.

**(e) Tables against stored records.** Table 5.1 (dense.log), 5.2 (coarse/nsweep.jsonl), 5.3 (witness.jsonl), 5.5
(multiwin.jsonl) match the files except as listed below.

## 3. Checks requested

- RH assumed anywhere: no.
- Verified height restated as a result: no. Section 5.5 says the pinned statement reduces to evaluating zeta in the window.
- Known theorem presented as new: no.
- Zeta-only mechanism claimed: none. The only pinning claim (all dyadic heights) is "F equals zeta to kappa eps"; controls
  run in (c).

## 4. Errors and overstatements (none changes the verdict)

1. **Verdict item 2, "values at 3/4 + i t0 differ from zeta's by O(1)".** For fixed k, `alpha_k = 2 pi k/log(T/2 pi) -> 0`,
   so the difference is `alpha_k |zeta'(s0)|` to first order and is not bounded below as T grows. The O(1) (and unbounded)
   deviation needs k growing with T, which the lemma allows (`|alpha| <~ eps T/H`). The statement is correct for the
   supremum over admissible k, not for "the translates alpha_k" at fixed k.
2. **Lemma 2, admissible range.** The defect bound carries the factor `|zeta(1/2 + i(t+alpha))|`, which is not bounded
   in T. The range of eps-feasible alpha is `eps T/(H max|zeta|)`, not `eps T/H`. The conclusion (range grows with T) is
   unchanged under any convexity bound. "Unbounded as T grows" takes a supremum over lattice points of spacing
   `2 pi/log T`, not over all alpha; that step is not proved (it is plausible and not needed for "does not tend to 0
   uniformly").
3. **Verdict item 3 quotes 4e-7 for T = 1e2 "at H = 2".** The H = 2 value is 1.6e-7; 4.0e-7 is the H = 20 value.
4. **kappa series (section 5.5).** `kappa = 2.0, 4.4, 15` takes the imaginary width at T = 1e3 and the real width at
   T = 1e4 and 1e5. By component: real 0.50, 4.4, 15; imaginary 2.0, 2.1, 5.4. The same mixing occurs in the tangent
   (3.9 im, 8.1 re, 31 re) and relaxed (127 im, 518 re) series. Growth with T is present in both components; "roughly
   T^{0.4}" is not supported by either one (real: 0.5 to 15 over two decades is about T^{0.74}; imaginary about T^{0.2}).
5. **"Pins a(p), p <= N, in the cone" (section 5.5).** The stored slice ranks at tolerance are 46/52 (T = 1e4) and 116/142
   (T = 1e5), smallest singular values 1.7e-9 and 3.6e-12. What is measured as pinned is the value `F(s0)`, in the slice
   through zeta and to first order; some coefficient directions are not pinned. The sentence should say `F(s0)`.
6. **"Constraint rank independent of T" and the extrapolation to H of order sqrt(T)/log T.** The rank is a count of
   singular values above eps = 1e-5 at fixed R = 2; the slope 0.3 per unit H comes from two values of H (2 and 20). It
   is a reading, as labelled, and the identification with the Riemann-Siegel length is not established.
7. **Zero witness at 1e-8.** Supported by one configuration (T = 1e5, k = +1). At T = 3e4 and 1e-7 two slices are
   infeasible and one is undecided (section 2b). "The freedom is not an effect of the tolerance" is established for that
   configuration only.

Remarks that are not errors: the pinned/unpinned transition between T = 1e3 and 1e4 is a dimension count in this model
(twice the free primes, 8 and 18, against rank 19 and 29; then 52 against 30); the lane says this. All LP results are
float64 without certificates; "not found" is not infeasibility; the lane says this as well.

## 5. Requirement flags (strict)

- **R1 false.** The exact statement is Hamburger's theorem, which does not use the Euler product. The finite-model
  difference between cone and relaxed sets is a count of unknowns.
- **R2 false.** One window: the feasible set at fixed tolerance contains lattice translates over a range that grows with T
  (confirmed to T = 2e8). All heights: the measured constant grows on three points, and a distance-to-zeta constant gives
  no every-window statement.
- **R3 false.** The unimodular lattice twist passes the window version (confirmed in 2a and 2c). At the exact level the
  exclusion is uniqueness, with no inequality.
- **R4 false.** Nothing passes to the critical line; a prescribed zero at 3/4 is feasible in the finite model at
  T = 3e4 (my run), 1e5 and 1e6 at tolerance 1e-5.

## 6. What survives

No new result. Confirmed content: (i) `C intersect A = {zeta}` is Hamburger's theorem and the cone adds nothing;
geometric means of translates fail A at the gamma-factor poles; (ii) lattice translates `zeta(s + 2 pi i k/log(Tc/2 pi))`
are unitary cone elements whose defect in zeta's functional equation on `[T, T+H]` is at most
`(|alpha| H + alpha^2)/(2T) |zeta|` to leading order (checked directly to T = 2e8); (iii) in the lane's float64 finite model
one window imposes about 30 real conditions and does not exclude a prescribed zero at 3/4 for T >= 3e4 at tolerance 1e-5.
