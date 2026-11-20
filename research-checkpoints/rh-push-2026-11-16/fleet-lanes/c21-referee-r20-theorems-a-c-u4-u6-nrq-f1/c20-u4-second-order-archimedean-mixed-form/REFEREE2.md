# REFEREE2: c20-u4-second-order-archimedean-mixed-form (Lemma S, K3-M; the DEL and THIN rows)

Second referee, lane `c21-referee-r20-theorems-a-c-u4-u6-nrq-f1`, 2026-11-20. Written from `RESULT.md` of the
refereed lane only; its `REFEREE.md` (same-session second pass) and scripts were not opened. Numerics:
`u4_ref2.py` -> `u4_ref2.json` (Lemma S and K3-M at 30 digits; a local float64 scan), `u4_scan.py` on the server
(unit `rh-c21u4scan-1120103045`, 8 cores, 10 GB limit, 14 minutes, finished; float64 screen of 2e7 heights,
`scan_1e5_2.1e6.json`, `scan.log`), `u4_confirm.py` -> `u4_confirm.json` (the selected windows re-evaluated with
mpmath at 30 digits, locally; not ball arithmetic). No statement about zeros of zeta.

## Verdict

**Lemma S: holds. Proposition M: holds. K3-M: holds, with one correction of wording (T-NR clause). The stage-A
stop stands** (it rests on K3-M and on the ZQ row; both unaffected).
**The two undecided rows are decided for the forms as written in the lane:**
- **THIN with zeta's Arch imposed fails step S3** at explicit windows (b = 0.75; 2.26 % of 2e7 scanned heights).
- **DEL with zeta's Arch imposed fails step S3** at explicit windows for b = 0.55 and b = 0.75 (0.126 % and
  0.031 % of the scanned heights). For b = 0.9 no failing window exists among the 2e7 scanned heights (least value
  +0.115): for that member the row stays **not decided**, and the reason is stated in section 3.
The failures are of the kind the lane predicted (a linear single-atom sum against the reserve, no relation
between different primes), so no requirement flag changes.

## 1. Lemma S and Proposition M, re-derived

| step | re-derivation | label |
|---|---|---|
| Plancherel reduction | h = e^(ist) k_0 has transform khat_0(x - t); norm((M_G - G_t) k)^2 = (1/2 pi) int abs(G(1/2 + ix) - G_t)^2 abs(khat_0(x - t))^2 dx and (1/2 pi) int (x - t)^2 abs(khat_0)^2 = norm(k_0')^2; so a pointwise bound abs(G(1/2 + ix) - G_t) <= c abs(x - t) gives norm <= c norm(k_0') | PROVED-2 |
| near zone abs(x - t) <= t/2 | G' = psi'(s/2)/4; abs psi'(z) <= sum 1/abs(z + n)^2 <= 1/abs(z)^2 + int_0^infinity dn/((Re z + n)^2 + (Im z)^2) <= 1/abs(z)^2 + pi/(2 abs(Im z)); with Im z >= t/4: abs G' <= 4/t^2 + pi/(2t) < 2/t for t >= 43 | PROVED-2; CHECKED: sup of abs(G(x) - G_t) t/abs(x - t) on the near zone is 0.6933, 0.6932, 0.6931, 0.6931 at t = 43, 1e2, 1e3, 1e5 (the limit is log 2 at x = t/2) |
| far zone abs(x - t) > t/2 | abs G(1/2 + ix) <= (1/2) log(2 + abs x) + 3 (value at x = 0 is 2.69); difference <= 2 log t + 6 + 3r, r = abs(x - t)/t >= 1/2, and 8 r log t - 3r - 2 log t - 6 is increasing in r and non-negative at r = 1/2 iff log t >= 3.75, t >= 42.6 | PROVED-2; CHECKED: sup of abs(G(x) - G_t) t/(log t abs(x - t)) over all sampled x (negative x and abs x up to 1e8 t included) is 0.993, 0.902, 0.764, 0.657: the constant 8 is safe and a constant 1 would do on these samples |
| values at t | 2 Re G_t - Lg = -1/(24 t^2)(1 + o(1)); Im G_t - pi/4 = 1/(4t)(1 + o(1)) | CHECKED: -2.25e-5, -4.17e-6, -4.17e-8, -4.17e-12 and 5.8e-3, 2.5e-3, 2.5e-4, 2.5e-6 |
| Corollary S' | (1 - P_u) M_G h = (1 - P_u)(M_G - G_t) h because h is supported in [0, u] | PROVED-2 |
| Proposition M | norm((Arch - A_P) h)^2 - norm(A_P h)^2 = norm(Arch h)^2 - 2 Re<Arch h, A_P h>; Arch h = 2 theta'(t) h + P_u e, norm(e) <= eps; expansion gives Lg <h, (Lg - 2 Re A_P) h> + E_M with abs(E_M) <= eps (2 Lg + 2 norm(A_P)) norm(h_0) + eps^2 + O(t^-2 Lg) norm(h_0)^2; norm(A_P) <= sum_{n<P} Lambda(n) n^(-1/2) <= 2.08 P^(1/2) by partial summation from psi(x) < 1.04 x | PROVED-2 (psi bound CLASSICAL) |
| Proposition C | each word with a letter Gamma is a pairing with one side P_u M_G h or P_u M_(conj G) h; replace by Lemma S | PROVED-2 |
| P3 | abs g_0(y)^2 = u/2 at abs y = pi/u and 8u/pi^2 at y = 0 for h_0 = (2/u)^(1/2) sin(pi s/u); count <= 2 (1 + 2 kappa) Lg/u | PROVED-2 (conditional, as labelled) |

Domain note (not an error): M_G is an unbounded multiplier (logarithmic growth); all statements are for
h_0 in H^1, as the lane says. "Causal" for G(1/2 + ix) holds because it is analytic in Im x < 1/2.

## 2. K3-M, re-derived

F = zeta f(y), y = q^(1/2 - s), f(0) = 1, f(y) = f(1/y), first non-constant term y^j0. Then
-F'/F + zeta'/zeta = sum_{k >= j0} k l_k log q q^(k/2) q^(-ks) (l_k the coefficients of log f), so
Lambda_F(n) = Lambda(n) unless n = q^k, k >= j0. A_P sums n < P, and C_a = 0 on L^2[0, u] for a >= u anyway. If
q^j0 >= P the operators A_P^F and A_P are equal; the gamma side is zeta's because the functional equation is the
same. So every expression in Gamma_c, Gamma_c*, A_P, A_P* on L^2[0, u] has the same value. PROVED-2.
CHECKED at 30 digits (q = 7): first index with a non-zero coefficient of log f is 1 for HQ1, HQ3, HQ4 and 2 for
HQ2; Lambda_F(7) - Lambda(7) = 0.5941 (HQ3) and 21.5788 (HQ4) at (a, b) = (0.1, 0.2), equal to
log q q^(1/2) 2 (cosh B -+ cosh A). (The lane's 2.9612 and 25.134 are the values of Lambda_F(7) itself at
(a, b) = (0.2, 0.3) by the same formula; parameters inferred, consistent.)
Zeros of the twins off the line: HQ2: (1 - y)^4/y^2 = (2 cos phi - 2)^2 >= 0 on abs y = 1, so (1 - y)^4 + eps y^2
has no zero there: PROVED-2.

**Correction 1 (T-NR clause).** "(M) holds for it whenever it holds for zeta" is true up to the error terms, not
identically: with Arch replaced by Arch + 2 log q the left side of Proposition M gains
4 log q Re<h, (Arch - A_P) h> + 4 log^2 q norm(h)^2, and Re<h, (Arch - A_P) h> >= (Lg/2) norm(h)^2 - (errors)
follows from (M) for zeta only on window vectors with norm(h_0') <= c (t/log t) norm(h_0) (the Lemma S error
must stay below Lg/2). On the vectors of Proposition C this holds for large t. Wording: "for window vectors with
norm(h_0') = o(t/log t) norm(h_0)".

**Correction 2 (2.5 (b), wording).** "sup over the torus of 2 Re<h, A_P^z h> = 2 sum Lambda(n) n^(-1/2)
abs(<h_0, C_(log n) h_0>)" is an equality for h_0 >= 0 (attained at z = 1); for general h_0 the right side is an
upper bound, since the phases at p^k are z_p^k and cannot be chosen independently. The use made of it (a fixed
non-negative profile) is unaffected.

## 3. The DEL and THIN rows: decided

Form as written in the lane (zeta's Arch imposed): by Proposition M, (M) for the control at (t, P) is
Lg Q(h) + E_M >= -E_0 norm(h_0') norm(h_0) with Q(h) = <h, (Lg - 2 Re A_P^ctl) h>, A_P^ctl the control's
prime operator (DEL: the powers of the primes of S removed; THIN: Lambda(p^k) multiplied by (-1)^k for p in S).
So step S3 fails at a window if Q(h)/norm(h)^2 < -err(h) with err(h) = (abs E_M + E_0 n')/Lg, n' = norm(h_0')/norm(h_0).
A failing window is a finite fact; passing at every height is not checkable by a scan.

Computation. P = floor(t^(3/4)), u = log P; h_0 in the span of the K = 6 modes (2/u)^(1/2) sin(k pi s/u);
<h, C_a h> = e^(-iat) c^* O_a c with closed-form overlaps O_a (checked against quadrature to 3e-31);
lambda_min of the 6 x 6 Hermitian matrix Lg - (B + B^*), B = sum_{n<P} w_n n^(-it) O_(log n).
S by the greedy floor rule of the map (DEL: c_n = min(c_(n-1) + 1, floor L(p_n)), L(x) = int_2^x t^(b-1) dt/log t;
THIN: the same with L/2). Scan: t in [1e5, 2.1e6], step 0.1, 2e7 heights (server, float64, screen). The two
lowest windows of each family were then re-evaluated at 30 digits with P = floor(t^(3/4)) at that height.

| family | heights below -err_K (of 2e7) | least lambda_min (float64) | 30-digit value at the least window: t, P, form for the control, form for zeta on the same vector, err(h) | S3 |
|---|---|---|---|---|
| zeta (control of the computation) | 0 (none below 0) | +0.0258 | t = 1746644.65, P = 48045: +0.025778; err 0.0061 | passes on every scanned window |
| DEL, b = 0.55 (S = 5, 7, 13, 29, 41, ...; 58 primes of S below P) | 25218 (0.126 %) | -2.858 | t = 633099.15, P = 22444: **-2.86043**, zeta +2.08774, err 0.028 | **fails** |
| DEL, b = 0.75 (S = 5, 7, 11, 13, 19, ...; 244 below P) | 6205 (0.031 %) | -1.921 | t = 431553.15, P = 16837: **-1.92425**, zeta +3.32779, err 0.037 | **fails** |
| DEL, b = 0.9 (S = 3, 5, 7, 11, 13, ...; 1659 below P) | 0 | +0.115 | t = 1371365.25, P = 40074: +0.11398, zeta +5.29035, err 0.019 | no failing window found; **not decided** |
| THIN, b = 0.75 (S = 7, 13, 29, 41, ...; 195 below P) | 452856 (2.26 %) | -7.867 | t = 1177978.95, P = 35756: **-7.86902**, zeta +2.68581, err 0.016 | **fails** |

(First members of each S are in `scan_1e5_2.1e6.json`. Second-lowest windows:
DEL 0.55: -2.79285 at t = 935352.75; DEL 0.75: -1.80648 at t = 1078583.65; THIN: -7.69879 at t = 1440312.45;
all re-evaluated, all below -err, zeta above +err on the same vectors. Local float64 scans of 4e4 heights at
t = 1e5 and 1e6 agree: THIN 1.8 % and 2.2 %, DEL 0.75 none in that short range.)

Labels: the failing windows are CHECKED (30 digits, mpmath, not ball arithmetic; margins 50 to 500 times the error
bound err(h), which uses the lane's constants). The percentages are MEASURED (float64).

Why DEL at b = 0.9 is not decided, and what the rows mean.
- For DEL the form is Q = Lg - 2 Re A_(P minus S): the deleted primes do not occur in it. It fails where the
  remaining primes alone exceed the reserve Lg. For zeta the full sum never exceeded the reserve on the scan
  (least value +0.026); for a subset of the primes no such cap is known, and the scan shows it is violated for
  b = 0.55 and 0.75. The more primes are deleted, the smaller the sum (mean lambda_min: zeta 4.46, DEL 5.26, 6.03,
  7.64 for b = 0.55, 0.75, 0.9), and with all primes deleted the form is the constant Lg. So passing or failing S3
  is a matter of size depending on b and on the height; it is not structural. For b = 0.9 a failure at some
  larger height is neither found nor excluded: excluding it is an every-height statement that no finite scan
  gives, and no theorem on file bounds the form of a prime subset by the reserve.
- For THIN the form is Q_zeta + 4 Re<h, A_(S, odd) h>; the twisted prime sum has no cap and exceeds Lg at about 2 %
  of the heights.
- In both families the failing quantity is linear in the coefficients (Proposition C); the failure is a size
  event of a linear prime sum against the reserve, not a relation between different primes. This is the lane's
  reading of the sign-chain row, now with explicit windows. With the lane's own step list the rows read:
  "DEL: fails S1 (no functional equation; PROVED-rel the map). With zeta's Arch imposed: fails S3 at explicit
  windows for b = 0.55, 0.75 (CHECKED); b = 0.9 no failure in 2e7 heights (MEASURED), not decided."
  "THIN: fails S1. With zeta's Arch imposed: fails S3 at explicit windows (CHECKED), about 2 % of heights (MEASURED)."
- Consequence for stage A: none. ZQ still passes every step and K3-M still makes the twins pass at each stage;
  the stop does not use these rows.

## 4. Corrections, collected

1. T-NR clause of K3-M: add the vector class (section 2).
2. 2.5 (b): "sup = " holds for h_0 >= 0; an upper bound in general.
3. Rows DEL and THIN of the stage-A table: replace "NOT DECIDED" by the entries of section 3.
4. Constant in Proposition M: 2.08 P^(1/2) (the lane's 2.1 is an upper rounding; nothing changes).

## 5. Three weakest steps (of the lane, after this pass)

1. The other stage-A failures (E_a, fixed-q twins, DH, HEAT) remain ARGUED: no explicit window or bound for
   <h, T_Z h> was produced for them, by the lane or here. The ZQ pass is relative to c18 Proposition Z in the
   lattice model.
2. Lemma S and Propositions M, C cover window vectors with bounded norm(h_0')/norm(h_0) and polynomial words.
   Inverses, determinants and the range theta' >= 1 are outside; a small eigenvalue of Arch - A_P can amplify the
   log t/t error (the lane says so).
3. The pivot (D_kappa) is closed by K3-M only; P3 is conditional and shows what (D_kappa) would imply, not that it
   fails. The DEL row at b = 0.9 stays undecided (section 3).

## 6. Flags

R1 false (linear in Lambda; no multiplicative step), R2 false, R3 false (ZQ passes; twins pass per stage),
R4 false. Agrees with the lane.
