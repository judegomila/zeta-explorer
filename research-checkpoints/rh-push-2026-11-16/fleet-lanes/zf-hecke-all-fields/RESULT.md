# zf-hecke-all-fields: what is extremal in Liu 2610.26835 (B_flat = 0.874886647...), and does zeta-only or extra averaging break it

Status: internal working note, unrefereed. Nothing here is a new zero-free region. RH open, no QED.
Source read: arXiv 2610.26835v2 (text copy in `../bypass-78/dl/2610.26835.txt`; line numbers below refer to it).
Script: `check.py`, log `check.log` (mpmath, 40 digits, < 1 min).

## 0. Plan; what is new relative to atlas and walls

Atlas section 10 and `zf-campaign-high-side.md` already have the closed-form Xu-Sang ceiling B*(kappa) and the
conditional feedback stall p_inf = 0.749773294. Not repeated. New here:

1. identification of the extremal configuration of Liu's Theorem 14.13 in arithmetic terms (which objects, which family);
2. a decoupled (target supremum vs moment-family supremum) version of the optimality statement, which answers the
   zeta-only question;
3. the kappa-floor value F_flat(13/18), which shows the output is insensitive to the true zeros of the family;
4. a first-order price for the one input that would move it.

## 1. What is extremal (read from the paper; CLASSICAL = as stated there, unrefereed)

- Target: one finite-order Hecke character eta over F containing mu_12. The zero of L_F(s, eta) enters only through
  Mellin continuation of H_eta(s)/L^S_F(s, eta) (Lemma 14.8, l.6839-6851).
- Rows: sixth-power-free u with norm ~ U = Z^d. Each row carries the twists X_u = { nu * chi(u)^{+-1} : nu in N },
  N a fixed finite group containing 1 and eta (Lemma 13.7, l.5706-5713).
- Row class (a, x): rows for which some psi in X_u has an actual zero with real part in [a, a+e) (l.5727-5729,
  5745-5748), delta = 2a-1, and prime-sum amplitude g = delta*x, 0 <= x <= 1/2.
- Count: #class <= U^{R_kappa(delta,x)+eps} from the moments M1, M2 (14.3). M2 for kappa < 1 needs
  beta_*(F) <= (1+kappa)/2, used in Lemma 12.7 (l.3992-4000) on log L of the row twists only.
- Binding inequality: E_{b,l,kappa}(delta,x) <= 0, (14.8), at row scale d = h.

Extremal point (MEASURED replay of Lemma 14.10/14.11, agrees with the paper to all printed digits):

| quantity | value |
|---|---|
| kappa_flat = 2 B_flat - 1 | 0.74977329407992826 |
| B_flat | 0.87488664703996413 |
| critical class delta_c, x | 0.46934485869814, 1/2 |
| zero real part of the critical twists a_c = (1+delta_c)/2 | 0.73467242934907 |
| l*, b*, h | 0.16712007850681, 0.08653495925584, 0.79394759738814 |
| count exponent R_c = R_kappa(delta_c, 1/2) | 0.59033235352636 |
| lambda = dE/dl at the class | 1.08900282326147 |
| max of E on [1/8,5/6]x[0,1/2] at tangent parameters (401x201 grid) | -1.2e-7, at delta = 0.4685, x = 0.5 |

So the extremal configuration is: about U^{0.590} sextic twists nu*chi(u), norm(u) ~ Z^{0.794}, each with a zero at
real part ~ 0.7347 and with prime sums at the maximal amplitude x = 1/2, together with the self-consistency
kappa = 2*beta_* - 1. It is a configuration of the twist family, not of the target.

## 2. Method or family

Method. Three independent reasons.

- (CLASSICAL, paper l.6954, 7262, Remark 14.14) Theorem 14.13 is a scalar statement about uniform estimates; the
  class x = 1/2 is "formal", its nonemptiness is not asserted.
- (MEASURED, check.py item 4) F_flat is increasing on all of [13/18, 1] (2001-point grid; the paper proves it on
  [0.7497, 1] only), with F_flat(13/18) = 0.874843412008. 13/18 is the lower end of the M2 range. So even with the
  hypothesis "the whole family is zero-free for Re s > 31/36 = 0.8611" (or GRH) fed in, the system returns 0.874843.
  Total sensitivity of the output to the truth about the family: B_flat - F_flat(13/18) = 4.32e-5.
- The critical zeros sit at 0.7347, where the count R_c is a large-values bound, not information about zeros.

## 3. Zeta only: the extremal configuration persists (PROVED as a scalar statement, relative to Lemma 14.10)

Decoupled setting. Let T be any set of targets (e.g. T = {1}, i.e. zeta_F, hence zeta_Q by factorization), beta_T the
supremum of their zeros. Let beta_M >= beta_T be the supremum over the characters that the moments and the detector
see for those targets (the twists nu*chi(u)^{+-1}; u = 1 gives the targets themselves). A decoupled refined step is
(b, l, kappa) with 13/18 <= kappa <= 1, kappa >= 2 beta_M - 1 when kappa < 1 (needed by Lemma 12.7), and
E_{b,l,kappa} <= 0 on all classes with a <= beta_M; it yields beta_T <= B(l).

Proposition. Assume 2 beta_M - 1 >= 12/25 (so the critical class is not excluded by the family bound) and beta_M <= B_flat. Then every decoupled
refined step yields B(l) >= beta_M >= beta_T. So no target, zeta included, receives a bound below the supremum of
the twist family, whatever that supremum is.

Proof. The critical class (delta_c(kappa), 1/2) has delta_c < 12/25 <= 2 beta_M - 1, so it is controlled.
Lemma 14.10(2): E there equals lambda*(l - l*(kappa)) with lambda >= 1, independent of b, hence l <= l*(kappa),
B(l) >= F_flat(kappa). Lemma 14.10(3): G(kappa) = (1+kappa)/2 - F_flat(kappa) is increasing on [13/18,1] with
unique zero kappa_flat. If kappa <= kappa_flat then G <= 0, so B(l) >= F_flat(kappa) >= (1+kappa)/2 >= beta_M
(the last inequality is the step condition kappa >= 2 beta_M - 1, in force since kappa < 1). If kappa > kappa_flat
then B(l) >= F_flat(kappa) > F_flat(kappa_flat) = B_flat >= beta_M. QED (scalar).

MEASURED table (check.py item 5), inf of F_flat over allowed kappa minus beta_M:
beta_M = 0.86: +1.48e-2; 0.87: +4.87e-3; 0.874: +8.8e-4; 0.8748: +8.6e-5; B_flat: 0 (3e-17); 0.875: -1.13e-4.
The sign changes exactly at B_flat: the method gains only while the family supremum is above B_flat.

Why the target cannot matter: in (14.8) the target eta appears in no exponent. It appears in N (a fixed finite
group), in constants, and in the location of the principal contour. The self-consistency kappa = 2 beta - 1 is
between the moment family and itself. For target zeta the moment family still contains all nu*chi(u); bounding
their zeros requires taking them as targets, which regenerates the same fixed point. Whether the family on which
the bootstrap closes is a proper subfamily of all finite-order characters (N is generated by eta, the Gauss-sum
character G_0 and the ray characters of the theta average, l.5700-5704) was not determined: OPEN, and irrelevant
to the value because the scalar system is identical.

Fields: the scalar inequalities are field independent (l.1043-1044, 1048), so averaging or varying F changes
nothing in the exponent system. PROVED in the same scalar sense.

## 4. Extra averaging over targets (characters): OPEN, outside the system

An average sum_eta c_eta f_eta(Z) still detects each pole of 1/L(s, eta) provided residues at a common rho do not
cancel, so a target average is a legitimate detector. It would change the min-max only if the eta-sum is carried
inside the absolute values of the row remainder, i.e. a hybrid (eta, u) mean value replacing count x sup at the
critical class. With eta ranging over a set of size Z^q, q > 0, the constants "depending on eta" (direct bound
(13.8), principal term (13.13), S, generators) become powers of Z; none of these dependencies is tracked in the
paper. No estimate was produced here. This is the one variation not covered by Theorem 14.13 or Remark 14.14.

Price list (MEASURED, first order at the fixed point): a saving U^{-tau} in the count at the critical class alone
moves the boundary by dB = -0.137 * tau (= -(3h/4)/(4 lambda)/(1 - 2 F_flat')). Example: tau = 0.01 gives
B ~ 0.87352. This ignores re-tangency at neighbouring classes, so it is an upper estimate of the gain.

## 5. DH control

The Davenport-Heilbronn function is not in the family and the argument fails for it at two named steps:
(i) the detector and Lemma 12.7 take the Euler branch of log L on disks centred at 2+iv (l.3998-4000, 5757-5760);
(ii) the inverse moment M1 uses 1/L as a Dirichlet series with multiplicative coefficients mu*psi and the Euler
identity relating M_1 to M_{a^6} (l.5694-5698). Neither exists for a linear combination of two L-functions.
The proposition of section 3 is scalar and makes no claim about zeros, so it has no DH content.

## 6. Verdict

Precise obstruction. B_flat is an infimum of the method (uniform count at a formal class of twists with zeros near
0.7347, plus the kappa = 2 beta - 1 self-consistency). Restricting the target to zeta, or varying the field, leaves
every exponent unchanged; the decoupled proposition shows no target gets below the twist-family supremum. No lower
abscissa for zeta alone is obtained. The only uncovered variation is a hybrid target-row mean value (section 4).

## 7. Three weakest steps

1. Everything is relative to an unrefereed preprint; Lemma 14.10(2),(3) were replayed numerically here (40 digits,
   grids), not by interval arithmetic, and the analytic parts (M1, M2, Prop. 14.3) were not audited.
2. Monotonicity of F_flat on [13/18, 0.7497] is MEASURED on a 2001-point grid only; the proposition needs only G
   increasing (paper, Lemma 14.10(3)), but the 0.874843 floor statement relies on the grid.
3. Section 4 is an unpriced idea: no hybrid large sieve was written down, and the eta-dependence of the paper's
   constants is unknown. The -0.137 slope is a fixed-class first-order figure.
