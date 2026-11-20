# REFEREE: g-odd-adversary (adversarial numerics, PR 56 target B)

Date 2026-11-16. Verdict under review: precise-obstruction. Referee outcome: **holds**, with four
wording corrections (section 4). No PROVED step failed. No RH assumption found. No claimed
cancellation, so the coordinate-change test applies only to section 6.2 of the result, which
already states that the spectral renormalization is a diagonal congruence and changes visibility,
not sign.

Referee code: independent mpmath implementation (no python-flint, no Hurwitz zeta): `f, f', f''`
from trapezoid quadrature of the theta-series kernels `kappa`, `kappa_DH` (step 0.01, 170 digits),
run on the motherbox in `~/rh-push/g-odd-adversary-referee/ref.py`. Arb reruns used the author's
`lib.py`/`nys.py` on windows the author did not use.

## 1. PROVED steps re-derived

| step | check | outcome |
|---|---|---|
| `c` trivial | PR 56 (C): `H_c(u,v)` depends on `|c-(u+v)/2|` and `u-v`, so `H_c(u,v)=H_0(u-c,v-c)`; translation is unitary and maps odd-about-`c` to odd-about-0 | confirmed |
| `alpha` trivial | (C) is `alpha` times an `alpha`-free kernel; `alpha>0` fixed in PR 56 | confirmed |
| spectral kernel (5),(7),(11) | re-derived: `d(t)=f-i alpha f'`, `conj(d(t))d(s)-d(t)conj(d(s)) = 2i alpha (f'(t)f(s)-f(t)f'(s))`, times `(i/2pi)/(t-s)` gives (5); `f` even, `f'` odd gives the `C(t,-s)` entry used in `lib.py`; diagonal limit gives (11) | confirmed |
| DH kernel | Mellin: `(5/pi)^{s/2} n^{-s} Gamma((s+1)/2) = sqrt(pi/5) n int x^{(s+1)/2} e^{-pi n^2 x/5} dx/x`, `x=e^u`, `s=1/2+z` gives `kappa_DH` as stated | confirmed; quadrature of `kappa_DH` equals the Hurwitz formula to 25 digits at `t=20` and `t=114.17` |
| heat normalization | `kappa_tau=e^{tau u^2/16}kappa`, `kappa(u)=Phi(u/4)` gives `e^{tau v^2}Phi(v)`: `tau` is de Bruijn time exactly | confirmed |
| one negative direction per off-line quartet | quartet gives a conjugate pair `lambda, conj(lambda)` of `G`; `1/((lambda-x)(lambda-y)) + c.c. = 2(a a' - b b')`: signature (1,1) | confirmed |
| heat family fails target B for all `tau<0` | needs only the direction "odd positivity implies real zeros" (Loewner plus `F_tau(r)>0`), which carries over to `kappa_tau` (positive, even, Schwartz, `F_tau(0)>0`); Rodgers-Tao gives non-real zeros for every `tau<0` | confirmed; see correction 3 |

## 2. Numeric reruns on different cases (all reproduce)

| claim | referee case | referee value | author value |
|---|---|---|---|
| Fourier normalization, x-space vs spectral | `xspace.py xi 260 9 9` (author grid differs) | `6.60764629e-4, 3.21046005e-6, 1.91650599e-8, 1.7993193e-10` | same |
| xi top spectrum | mpmath, theta-quadrature jets, GL-56 on `[0,48]` | `6.6076462918e-4, 3.2104600479e-6, 1.9165060062e-8, 1.7993203615e-10, 3.06560625e-12, 3.3067468778e-14, 5.1945342859e-16, 1.5901913907e-17, 3.169414981e-19, 6.61983557e-21` | agree to printed digits through n=9; n=10 differs in 8th digit (window truncation) |
| xi node Gram PD (Arb) | `nys.py xi 48 41 400` | LDL certified PD, last pivot `1e-97` | new window |
| xi packets positive | `t0=60, s=0.3`: `+1.17e-35`; `t0=112, s=0.2`: `+3.51e-70`; `t0=85.72, s=0.4`: `+6.2028e-52` | | `+6.2e-52` |
| DH off-line zero | findroot | `0.6508300806 + 114.1633427 i` | same |
| DH one-node sign | `R(114.17) = -86.309517`; `R(85.6)=-1.71`, `R(166.5)=-7.88`, `R(176.6)=-1.05`; `R(100)=+7.48`, `R(114.4)=+0.41`, `R(130.3)=+0.61` | | `-86.3`; windows consistent |
| DH packet | `t0=114.17, s=0.2`, GL-60: `-1.2603417e-77`; new `t0=114.15, s=0.3`: `-1.196e-77`; control `t0=100, s=0.3`: `+1.14e-66` | | `-1.2603e-77` |
| DH negative eigenvalue | GL-30 on `[83,89]`: one negative, `-2.127e-57`, top `6.0e-55` | | `-2.47e-57` on `[80,92]` (same order, window-dependent) |
| DH negative pivot (Arb) | `nys.py dh 84 66 700`: pivot 68 `= -1.0547e-47 +/- 9e-59`, Nystrom `lambda_min=-6.9e-93` | | new window; a window ending 20 below the off-line zero already fails |
| DH x-space top | `xspace.py dh 260 11 9` | `2.5969e-2, 6.7964e-4, 2.0646e-5, 6.0138e-7` | same |
| DH convexity | 10 new points `u=0.003..6.5`: indicator `4.6e-6 ... 0.73`, all positive; large-`u`: one-term asymptotic `0.75+(pi/5)e^u(u-1)>0` | | sampled only, as stated |
| heat | `tau=-1.8`: two real zeros at `49.44, 49.84`, `R>0`; `tau=-1.9`: no real zero in `[47,51]`, `R<0` on `[49.58,49.76]`; `tau=-2`: `R<0` on `[49.48,49.94]`; `tau=-3`: `R<0` on `[49.42,50.82]` | | collision bracket tightens to `(-1.9,-1.8)` |

DH control: run independently; the pipeline fails for DH at exactly the four known off-line zeros
and nowhere else tested. The result claims no zeta-only mechanism.

## 3. What was not re-verified

- The large Arb runs (GL-220 xi, GL-260 DH, the 150000-point scan to `t=3000`) were not repeated;
  only smaller Arb reruns on new windows. Certification depends on python-flint 0.9.0
  `acb_series` gamma/Hurwitz enclosures.
- The 62383-minor counts and the eigenfunction sign-change counts were not rerun.
- Sibling results (`g-odd-sign-tp`, `g-odd-sign-factor`) were taken as cited.

## 4. Errors and overstatements (none change the verdict)

1. Section 3.1: "these finite certificates restate that zeros below the verified height are on
   the line." Not a logical equivalence. A PD node Gram on `[0,170]` with pivots at `1e-310` is
   implied by RH; it is not derivable from verified height alone (a hypothetical off-line zero
   above `3e12` perturbs the Loewner matrix by a nonzero amount that has not been bounded against
   pivots this small). Correct statement: the certificates are finite facts consistent with RH
   that carry no information toward it.
2. Verdict item 4: "A proof by relative margin is impossible." What is shown is that `H_-` is
   compact with no gap, so no margin relative to the identity exists. A margin relative to another
   compact reference form is excluded by the cited eq48 result, not by this lane's data.
3. Section 5: "by Rodgers-Tao plus the PR 56 equivalence, for every `tau<0`." PR 56 states the
   equivalence for xi only. The needed direction does extend to `kappa_tau` (checked above), but
   this extension is the result's own step and should be labeled PROVED-here, not attributed.
   Also "the pair collides between -1.8 and -2" was inferred from the sign of `R` only; the
   referee's zero count confirms it and gives `(-1.9,-1.8)`.
4. Section 4.1 headline "PR 56's proved inputs are Euler-blind": for DH this rests on sampled
   convexity and sampled entry positivity (labeled MEASURED, correctly). The rigorous form of the
   blindness statement in this result is the heat family (flow-blindness), not DH. "Exactly on"
   for the DH windows means at grid step 0.01. "One negative eigenvalue each" holds for the
   stable four; windowed discretizations also show extra negative eigenvalues from off-line
   zeros beyond the window (`-7.9e-84`, `-8.1e-104`, `-2.6e-262`), which the text partly notes.

## 5. Surviving claim

No wrong-sign odd test for the theta kernel in any discretization tried (Arb-certified node Grams
to GL-220 on `[0,170]`; one-node sign positive on the 0.02 grid to `t=3000`). `c` and `alpha` are
trivial (proved). Top odd spectrum `lambda_1=6.6076462918e-4` etc. reproduced by an independent
method to 10 digits for `n<=9` (measured, not interval-certified). For DH the same pipeline gives
certified negative one-node signs and negative pivots, and measured negative eigenvalues of order
`e^{-pi gamma/2}`; `kappa_DH` is positive, even, and convex on all sampled points. For backward heat
the proved PR 56 inputs (F),(G),(H) persist while target B fails for every `tau<0` (Rodgers-Tao plus
the Loewner direction), with measured wrong-sign tests from `tau<=-1.9`. Conclusion: the inputs
proved so far in PR 56 cannot decide target B; this is an obstruction statement and gives no
progress toward RH.
