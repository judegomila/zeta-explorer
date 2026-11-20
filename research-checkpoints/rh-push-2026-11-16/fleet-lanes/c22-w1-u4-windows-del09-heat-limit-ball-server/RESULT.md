# c22-w1-u4-windows-del09-heat-limit-ball-server: RESULT

Date 2026-11-20. Round 22, kind: compute (certified conversions, work item W1). No search for a device, no attack, no
requirement score. **No statement about zeros of zeta is made** (the zeta rows are control rows of the computation:
finite-rectangle cells and finite-window form values). Requirement flags R1 = R2 = R3 = R4 = false (section 6).
Pre-registration: `PREREG.md`, written before the first run. Labels: PROVED-1 (argument written here, one derivation) /
CLASSICAL (recalled, not opened) / CERTIFIED (Arb balls, python-flint 0.9.0) / CHECKED (mpmath, floating point) /
MEASURED (float64) / ARGUED / OPEN.

## 0. Verdict

1. **Part 1 (decisive first test): all six failing U4 windows of round 21 are certified.** For THIN b = 0.75 (two
   windows), DEL b = 0.55 (two) and DEL b = 0.75 (two) the band form is negative with the ball excluding 0 and
   Q_ctl + err < 0; radius at most 9.4e-30 (Table 1). Zeta on the same vector is above +err in every row. The rows
   THIN b = 0.75, DEL b = 0.55, DEL b = 0.75 of U4 relabel from CHECKED to CERTIFIED for these windows (given the error
   term err of the U4 lane, which is not re-proved here).
2. **Part 2: DEL b = 0.9 fails step S3 at explicit windows; the row is decided.** Range enlarged by the factor 100
   (t in [1e5, 2.001e8], step 0.1, 2.0e9 heights). Screen: 3872 heights below 0 (fraction 1.9e-6; 3846 below -err),
   minimum -1.98555. Verdict step: the eight lowest block minima are certified negative in balls; the lowest is
   **t = 101750922.75, P = 1013103: Q_DEL = -1.98569898983956709879981842 +- 2.5e-27**, err = 0.00115, zeta on the same
   vector +2.89379 (Table 2). The registered prediction (at least one negative height; minimum between -3 and -0.3;
   fraction between 1e-9 and 1e-5) holds on all three counts. Zeta: no height below 0 among the 2.0e9 (minimum
   +0.02578 at the round-21 window t = 1746644.65; MEASURED for the count, CERTIFIED for the four lowest windows).
3. **Part 3: the HEAT limit C_R -> 0 is decided by proof, not by cells.** Lemma H (section 4.1): H_{-tau} is entire of
   order at most 1 with a positive value at 0, so C_R = - sum over the zeros outside R of m_rho h(rho) and C_R -> 0
   along every exhaustion by rectangles (PROVED-1, with three recalled classical inputs). No finite set of cells
   can certify a limit; what is certified is the sequence: on eight nested rectangles (Y = 1 .. 128; the
   pre-registered six and two added) every cell Q_gen - W_R + C_R encloses 0 with radius below 6e-14, the zero list
   is complete by a contour count (243 zeros at Y = 128, 160 of them off the line), and abs(C_R) is certified
   non-increasing: 0.817, 0.817, 0.458, 0.241, 0.117, 0.0596, 0.0298, 0.0149 (row P8), with Y abs(C_R) -> 1.91
   (Table 3). The pre-registered criterion "strictly ordered for k = 1..6" fails at one step (Y = 1 to Y = 2: no
   zero enters, C_R is the same number); from Y = 2 on the order is strict. An explicit bound valid for every R
   beyond the range was not produced (section 4.4). The zeta row gives the same cells on the same rectangles.
4. Proposed relabels (for the record lane; this lane does not edit the record): U4 rows THIN, DEL 0.55, DEL 0.75:
   CHECKED -> CERTIFIED; U4 row DEL 0.9: "not decided" -> "fails S3 at explicit windows (CERTIFIED), 1.9e-6 of
   heights (MEASURED)"; Statement O line 11, clause "passage to the sum over all zeros for HEAT": ARGUED ->
   PROVED-1 (one derivation; a separate referee is owed before PROVED under the record's label rule), with the
   cells of Table 3 as CERTIFIED instances. Clauses L2, D7, Q25 of line 11: not touched, stay ARGUED.

## 1. Plan and what is new against the record

Order: Part 1 first (it decides whether the round-21 rows survive ball arithmetic), then the screen of Part 2 and
its verdict step, then Part 3. Everything on the server through `rhrun`; nothing killed by name.
New against the record: (i) the six round-21 windows as balls; (ii) a screen about 19 times faster than the round-21
one (non-uniform FFT over heights, checked against direct sums in every block), which made the factor 100
affordable in 65 minutes on 6 cores; (iii) the decision of DEL b = 0.9; (iv) Lemma H and the identification of C_R
with the tail of the zero sum; (v) cells for HEAT on rectangles 100 times taller than those of round 21, with the
zero census inside (counts on and off the line) and the zeta row on the same rectangles.
Not new: the forms, the error term err, the sets S, the HEAT quadrature (c20 lane), Lemma R (c21 lane).

## 2. Work

### 2.1 Objects

As fixed in `PREREG.md`. The band form: for a height t, P = floor(t^(3/4)), u = log P, Lg = log(t/(2 pi)), six sine
modes on [0, u], Q_w(t, c) = Lg - 2 Re(sum_{n = p^m < P} w(n) n^(-1/2) log p e^(-i t log n) c^* O_(log n) c)/(c^* c);
w = 1 (zeta), w = 0 on the powers of the primes of S (DEL), w(p^m) = (-1)^m for p in S (THIN). The overlap closed
form was compared with `acb.integral` of its defining integral at three triples (differences enclose 0, radius
below 6e-37). The sets S are the explicit lists in `sets_explicit.json` (sha256 in every output file); the greedy
rule in float64 gave the same lists on the server (x86-64) and on the Mac (arm64), and its first members and the
counts below P at the round-21 windows (58, 66, 244, 375, 1659, 1751, 195, 215) are reproduced.
floor(t^(3/4)) is decided in balls for every window.

### 2.2 Part 1

`u4_ball.py`, input `win_part1.json` (the vectors c_k of round 21 as exact float64 numbers), 128 bits; Table 1.
One deviation from the pre-registered agreement threshold, with its cause: for six of ten rows the ball at the
decimal t does not contain the 15 printed digits of round 21 (differences up to 9e-12). The round-21 script
evaluated at the float64 nearest the decimal (it converted a Python float to mpmath), and the form changes by about
1e-11 over that distance. Evaluated at that float64 (exact in Arb, 192 bits; Table 1b) all ten balls agree with the
15 printed digits. No sign or inequality depends on this.

### 2.3 Part 2

Screen (`u4_fftscan.py`; float64; not a verdict). B(t) on an arithmetic progression of heights is a non-uniform
discrete Fourier transform of the coefficients w_n O_(log n) at the frequencies log n; it is computed by Gaussian
gridding (21 taps, oversampling 2) and one FFT per matrix entry. P is frozen per block (2000 * 2^k long, k <= 4).
Checks: (a) on the round-21 range with blocks of 2000 the round-21 numbers are reproduced: minima zeta +0.0257825,
DEL 0.55 -2.8583551, DEL 0.75 -1.9210174, DEL 0.9 +0.1152516, THIN -7.8669227 (round 21: +0.0257825, -2.8583551,
-1.9210174, +0.1152516, -7.8669227) and the counts below -err 0, 25218, 6205, 0, 452856 (identical); 47 s against
892 s; (b) three direct sums per block and family: largest deviation 5.4e-9 on that range and 6.4e-7 on the large
range (threshold 1e-5); phases are reduced modulo 2 pi in 80-bit arithmetic.
Large range, 6404 blocks, 3875 s on 6 cores:

| family | heights | below 0 | below -err | minimum (screen) | mean lambda_min |
|---|---|---|---|---|---|
| zeta | 2.0e9 | 0 | 0 | +0.025902 | 6.474 |
| DEL b = 0.9 | 2.0e9 | 3872 (1.9e-6) | 3846 | -1.985550 | 9.959 |

Histogram of the DEL b = 0.9 screen below 0, bins of width 0.25 from -2: 28, 52, 151, 226, 319, 534, 924, 1638.
Zeta: 311561 heights in [0, 0.25), none below 0.
Verdict step (`u4_ball.py`, `win_part2.json`, 128 bits): Table 2. At each of the eight lowest block minima of
DEL b = 0.9 the exact P differs from the frozen one (for example 1013103 against 1012932), the float64 eigenvector
is recomputed at the exact P, and the ball of Q_DEL + err is below 0. The form values at exact P differ from the
screen by at most 3.5e-4.
Reading (ARGUED, not derived here): Q_DEL = Q_zeta + D_S with D_S the deleted prime part; at the certified windows
Q_zeta is between +1.6 and +4.7 on the same vector and D_S between -3.4 and -6.5, so the remaining primes alone
exceed the reserve Lg, which is the mechanism named by the round-21 referee. The failure is a size event of a
linear prime sum; nothing here bears on stage A of the U4 lane.

## 3. Tables (digits truncated, not rounded; full balls in the JSON files)

### Table 1. Part 1: the round-21 windows in balls (128 bits; t = the printed decimal, exact)

| family | t | P | primes of S below P | changed weight mass | Q_ctl (ball) | radius | Q_zeta, same vector | err | Q_ctl + err < 0 | Q_zeta - err > 0 |
|---|---|---|---|---|---|---|---|---|---|---|
| DEL b=0.55 | 633099.15 | 22444 | 58 | 13.60764 | -2.8604331386787624565484 | 3.1e-30 | 2.087742615967 | 0.027948 | yes | yes |
| DEL b=0.55 | 935352.75 | 30076 | 66 | 14.15046 | -2.7928457732363944839534 | 4.1e-30 | 1.469370852936 | 0.022540 | yes | yes |
| DEL b=0.75 | 431553.15 | 16837 | 244 | 42.87056 | -1.9242529140193790687315 | 1.4e-30 | 3.327789218319 | 0.036565 | yes | yes |
| DEL b=0.75 | 1078583.65 | 33468 | 375 | 51.51072 | -1.8064821802162817746817 | 3.9e-30 | 0.948516161892 | 0.016741 | yes | yes |
| DEL b=0.9 | 1371365.25 | 40074 | 1659 | 173.7691 | 0.1139769122908480279211 | 5.5e-30 | 5.290345491051 | 0.018767 | no | yes |
| DEL b=0.9 | 1501888.45 | 42902 | 1751 | 178.5720 | 0.7070696211069680474698 | 5.8e-30 | 4.236258948096 | 0.015123 | no | yes |
| THIN b=0.75 | 1177978.95 | 35756 | 195 | 25.87385 | -7.8690198408096813980729 | 6.9e-30 | 2.685807953014 | 0.016074 | yes | yes |
| THIN b=0.75 | 1440312.45 | 41575 | 215 | 26.97729 | -7.6987903873211859943216 | 9.4e-30 | 4.264573285724 | 0.014711 | yes | yes |
| zeta | 1746644.65 | 48045 | 0 | 0 | 0.0257783813798358947815 | 3.3e-30 | 0.025778381379 | 0.006101 | no | yes |
| zeta | 955947.35 | 30572 | 0 | 0 | 0.0464186014141301172384 | 2.3e-30 | 0.046418601414 | 0.010194 | no | yes |

### Table 1b. The same windows with t = the float64 nearest the decimal (the object evaluated by the round-21 script), 192 bits

| family | t (float64 nearest) | Q_ctl (ball) | radius | round-21 value (30-digit mpmath, 15 digits printed) | agrees to the printed digits |
|---|---|---|---|---|---|
| DEL b=0.55 | 633099.15 | -2.8604331386699911938569 | 1.4e-49 | -2.86043313866999 | yes |
| DEL b=0.55 | 935352.75 | -2.7928457732363944839534 | 2.2e-49 | -2.79284577323639 | yes |
| DEL b=0.75 | 431553.15 | -1.9242529140221219094977 | 7.0e-50 | -1.92425291402212 | yes |
| DEL b=0.75 | 1078583.65 | -1.8064821801903249151008 | 1.9e-49 | -1.80648218019032 | yes |
| DEL b=0.9 | 1371365.25 | 0.1139769122908480279211 | 3.0e-49 | 0.113976912290848 | yes |
| DEL b=0.9 | 1501888.45 | 0.7070696211143589059320 | 2.6e-49 | 0.707069621114359 | yes |
| THIN b=0.75 | 1177978.95 | -7.8690198408210093883127 | 3.0e-49 | -7.86901984082101 | yes |
| THIN b=0.75 | 1440312.45 | -7.6987903873585071756258 | 4.2e-49 | -7.69879038735851 | yes |
| zeta | 1746644.65 | 0.0257783813798783329873 | 1.6e-49 | 0.0257783813798783 | yes |
| zeta | 955947.35 | 0.0464186014140465670145 | 1.1e-49 | 0.0464186014140466 | yes |

### Table 2. Part 2: verdict step on the lowest block minima of the screen (128 bits; exact P; float64 eigenvector at exact P)

| family | t | P = floor(t^(3/4)) | prime powers below P | primes of S below P | deleted weight mass | screen value (P frozen) | Q_ctl (ball) | radius | Q_zeta, same vector | err | Q_ctl + err < 0 | Q_zeta - err > 0 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DEL b=0.9 | 101750922.75 | 1013103 | 79712 | 22426 | 632.6252 | -1.985550 | -1.98569898983956709879 | 2.1e-27 | 2.8937918885 | 0.0011526 | yes | yes |
| DEL b=0.9 | 32966257.05 | 435063 | 36748 | 11246 | 451.2919 | -1.978409 | -1.97874461484839107414 | 5.6e-28 | 3.9443431399 | 0.0018458 | yes | yes |
| DEL b=0.9 | 127604727.95 | 1200604 | 93228 | 25777 | 677.0441 | -1.938725 | -1.93889721945064714209 | 3.0e-27 | 3.8791715844 | 0.0007124 | yes | yes |
| DEL b=0.9 | 109555184.65 | 1070840 | 83855 | 23468 | 646.7964 | -1.839043 | -1.83930613474936718429 | 2.8e-27 | 4.2105787864 | 0.0008081 | yes | yes |
| DEL b=0.9 | 92605119.25 | 944009 | 74721 | 21165 | 615.0319 | -1.805690 | -1.80603188232296963590 | 1.8e-27 | 1.6409939306 | 0.0009258 | yes | yes |
| DEL b=0.9 | 114014393.15 | 1103366 | 86209 | 24051 | 654.5751 | -1.736379 | -1.73663419790770873902 | 2.3e-27 | 3.3071952657 | 0.0006685 | yes | yes |
| DEL b=0.9 | 186366488.45 | 1595055 | 121073 | 32553 | 758.4277 | -1.688510 | -1.68871346046506953069 | 5.4e-27 | 4.7473148057 | 0.0005363 | yes | yes |
| DEL b=0.9 | 137921985.35 | 1272697 | 98363 | 27041 | 693.0032 | -1.687252 | -1.68726729031718837648 | 3.6e-27 | 3.8432860982 | 0.0005786 | yes | yes |
| zeta | 1746644.65 | 48045 | 5032 | 0 | 0 | 0.025902 | 0.02577837170677820984 | 3.3e-30 | 0.0257783717 | 0.0061018 | no | yes |
| zeta | 119015924.55 | 1139472 | 88813 | 0 | 0 | 0.026829 | 0.02682820620296679257 | 1.1e-27 | 0.0268282062 | 0.0005776 | no | yes |
| zeta | 42792360.05 | 529084 | 43945 | 0 | 0 | 0.029247 | 0.02924037100056393442 | 3.4e-28 | 0.0292403710 | 0.0008536 | no | yes |
| zeta | 35343996.65 | 458391 | 38523 | 0 | 0 | 0.030755 | 0.03074390212173409240 | 3.0e-28 | 0.0307439021 | 0.0019506 | no | yes |

### Table 3. Part 3: cells on nested rectangles, tau = 1, abs(Re z) <= 3, abs(Im z - 2500.75) <= Y (128 bits)

**HEAT (H_{-tau}, tau = 1).** Q_gen(P8) = [-0.4897622353471303714729122 +/- 7.34e-26], Q_gen(P1) = [2.92235934059363905358 +/- 8.05e-21]; abs F (scaled) at the rate points >= 28, 28, 0.00015, 0.00015.

| Y | contour count | zeros enclosed (boxes meeting the line / off the line) | complete | P8: W_R | P8: C_R (contour integral) | Y abs(C_R) | P8 cell: radius, encloses 0 | P1: W_R | P1: C_R | P1 cell: radius, encloses 0 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 3 | 3 (1 / 2) | yes | -1.3067063745 | -0.816944139212561720 | 0.8169 | 2.2e-14, yes | 2.6576520678 | -0.264707272761517174 | 5.1e-14, yes |
| 2 | 3 | 3 (1 / 2) | yes | -1.3067063745 | -0.816944139212561720 | 1.6339 | 2.2e-14, yes | 2.6576520678 | -0.264707272761517174 | 5.1e-14, yes |
| 4 | 8 | 8 (2 / 6) | yes | -0.9481732518 | -0.458411016507222537 | 1.8336 | 2.2e-14, yes | 2.7700712389 | -0.152288101670777425 | 5.2e-14, yes |
| 8 | 15 | 15 (5 / 10) | yes | -0.7311777125 | -0.241415477241474021 | 1.9313 | 2.2e-14, yes | 2.8466732318 | -0.075686108718667743 | 5.2e-14, yes |
| 16 | 31 | 31 (7 / 24) | yes | -0.6066908440 | -0.116928608658070159 | 1.8709 | 2.2e-14, yes | 2.8858872251 | -0.036472115447421886 | 5.2e-14, yes |
| 32 | 61 | 61 (17 / 44) | yes | -0.5493264906 | -0.059564255351077586 | 1.9061 | 2.2e-14, yes | 2.9037364047 | -0.018622935857208561 | 5.2e-14, yes |
| 64 | 122 | 122 (40 / 82) | yes | -0.5195127694 | -0.029750534069111782 | 1.9040 | 2.2e-14, yes | 2.9130607565 | -0.009298584055854137 | 5.2e-14, yes |
| 128 | 243 | 243 (83 / 160) | yes | -0.5047053204 | -0.014943085128083078 | 1.9127 | 2.2e-14, yes | 2.9176896148 | -0.004669725777742726 | 5.2e-14, yes |

**zeta (xi(1/2 + z)).** Q_gen(P8) = [7.29060378574827883356442953861 +/- 4.61e-30], Q_gen(P1) = [5.61267762653167930339799747323 +/- 1.48e-32]; abs F (scaled) at the rate points >= 3.08, 3.08, 7.18, 7.18.

| Y | contour count | zeros enclosed (boxes meeting the line / off the line) | complete | P8: W_R | P8: C_R (contour integral) | Y abs(C_R) | P8 cell: radius, encloses 0 | P1: W_R | P1: C_R | P1 cell: radius, encloses 0 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 3 | 3 (3 / 0) | yes | 6.2686407312 | -1.021963054448352831 | 1.0220 | 3.1e-14, yes | 5.2811578429 | -0.331519783567539691 | 4.0e-14, yes |
| 2 | 3 | 3 (3 / 0) | yes | 6.2686407312 | -1.021963054448352831 | 2.0439 | 3.1e-14, yes | 5.2811578429 | -0.331519783567539691 | 4.0e-14, yes |
| 4 | 7 | 7 (7 / 0) | yes | 6.7670943383 | -0.523509447413063460 | 2.0940 | 3.1e-14, yes | 5.4460725648 | -0.166605061704162573 | 4.1e-14, yes |
| 8 | 15 | 15 (15 / 0) | yes | 7.0488538490 | -0.241749936673118810 | 1.9340 | 3.2e-14, yes | 5.5370429531 | -0.075634673407235247 | 4.1e-14, yes |
| 16 | 31 | 31 (31 / 0) | yes | 7.1733011051 | -0.117302680616487414 | 1.8768 | 3.2e-14, yes | 5.5759946226 | -0.036683003917851889 | 4.1e-14, yes |
| 32 | 61 | 61 (61 / 0) | yes | 7.2310505256 | -0.059553260140707412 | 1.9057 | 3.2e-14, yes | 5.5940648564 | -0.018612770107676686 | 4.1e-14, yes |


## 4. Part 3: the HEAT row of line 11

Notation of the round-21 lane: s = 1/2 + z, z = i w/2 (the real w-axis is the critical line), F(w) = H_{-tau}(w) =
(H_0 * G_tau)(w), H_0(w) = xi((1 + i w)/2)/8, G_tau the Gaussian of variance 2 tau; tau = 1. h = V V# is the rational
test function of Lemma R (poles at -z_i and conj z_j), L = F'/F, W_R = sum over the zeros in R of m_rho h(rho),
Q_gen as in Lemma R, C_R := (1/2 pi i) contour integral of h L over the boundary of R, cell := Q_gen - W_R + C_R.

### 4.1 Lemma H (the limit; PROVED-1 with recalled classical inputs)

**Lemma H.** Let tau >= 0 and F = H_{-tau}. (i) F is entire, even, real on the real axis, with
abs(F(w)) <= 2 H_0(i abs(Im w)) = xi((1 + abs(Im w))/2)/4 and F(0) > 0; hence F has order at most 1 and
sum over its zeros of abs(rho)^-2 is finite. (ii) For every rational h with h(w) = O(abs(w)^-2) at infinity and
every rectangle R that contains the poles of h in its interior and has no zero of F on its boundary,

    C_R = (1/2 pi i) contour integral over the boundary of R of h F'/F = - sum over the zeros rho outside R of m_rho h(rho),

the sum converging absolutely. (iii) Consequently C_R -> 0 along every sequence of such rectangles that exhausts
the plane, and the identity of Lemma R holds with the sum over all zeros: Q_gen = sum over all rho of m_rho h(rho).

Proof. (i) CLASSICAL input 1 (Riemann, Polya): H_0(w) = (1/8) integral over R of Phi(u) e^(i w u/2) du with Phi even,
positive, and decaying like exp(-pi e^(2 abs(u))). The Fourier transform of G_tau at frequency u/2 is e^(-tau u^2/4),
so by Fubini F(w) = (1/8) integral Phi(u) e^(-tau u^2/4) e^(i w u/2) du. This is entire, even, real for real w, and
abs(F(w)) <= (1/8) integral Phi(u) e^(abs(Im w) abs(u)/2) du <= (1/8) integral Phi(u) (e^(y u/2) + e^(-y u/2)) du =
2 H_0(i y), y = abs(Im w); F(0) = (1/8) integral Phi e^(-tau u^2/4) > 0. Since log xi(sigma) = O(sigma log sigma),
log max_{abs(w) = r} abs(F) = O(r log r): order at most 1. CLASSICAL input 2 (Jensen): n(r) <= log(max_{abs(w) = e r}
abs(F)/F(0)) = O(r log r), so sum abs(rho)^-2 < infinity.
(ii) CLASSICAL input 3 (Hadamard, order below 2): F'/F(w) = B + sum_rho m_rho (1/(w - rho) + 1/rho), the series
converging absolutely and uniformly on compact sets free of zeros (its terms are bounded by 2 abs(w)/abs(rho)^2 for
abs(rho) >= 2 abs(w)). Integrate term by term over the boundary of R. A rational function that is O(abs(w)^-2) at
infinity has residue sum 0 over the plane; so the integral of h is 0 (all poles inside R), the integral of
h(w)/(w - rho) is 0 for rho inside R (all poles inside, decay abs(w)^-3), and for rho outside R it is minus the
residue at rho, that is - h(rho). The series sum abs(h(rho)) converges because abs(h(rho)) <= c abs(rho)^-2 for large rho.
(iii) The tail of an absolutely convergent series tends to 0; combine with Lemma R (Q_gen - W_R + C_R = 0). ∎

Remarks. The statement and proof do not depend on where the zeros are; they hold verbatim for tau = 0 (zeta),
where the limit was labelled CLASSICAL. The lemma gives the rate only in the form abs(C_R) <= sum over rho outside R
of abs(h(rho)). In the variable z the function h(z(w)) is rational in w with the same decay, so the lemma applies
to the cells as computed. Poles of h for rows P8 and P1 are at Re z = -+3/8, -+5/8, heights 2500.921875 and 2500.625.

### 4.2 Evaluation and its error (CERTIFIED given the listed lemmas)

`heat_cells.py`. Values of F: the trapezoid representation of the c20 lane (`heat_c20.py`, unchanged; its Lemmas
S, T, Q, refereed there), with y0 = -1.6, a = 0.5, U = 48, one node set per slab of half-width 16 in Re w, validity
box abs(Re w - XC) <= 17.25, abs(Im w - y0) <= 5.25; upper half-plane by F(conj w) = conj F(w).
New in this lane, each one derivation:
- Windowed sum. Only the nodes with abs(t_j - Re w) <= 20 are summed. For a dropped node the Gaussian factor is at
  most exp(q b^2) exp(-q x^2), q = 1/(4 tau), b = abs(Im w - y0) <= 5.25, x = abs(Re(w) - t_j) >= 20 - 1 - h/2 (box
  radius at most 1); with the factor P = 4 d^2 q^2 + 2 q + 2 d q + 1 (d <= 70.5) covering the first two derivatives and
  h sum_j exp(-q x_j^2) <= integral, the dropped part of the sum and of its first and second derivative is at most
  c_max exp(q b^2) P erfc((20 - 1 - 2 h)/(2 sqrt(tau))) = 9.6e-27 to 3.1e-26 (scaled units, per slab), added to eps.
- Derivative: F' = (sum)' + e', abs(e') <= eps/r with r = 1/4 (Cauchy's estimate; eps holds on the box enlarged by r).
- Boxes: mean-value forms S'(box) in S'(m) + S''(box)(box - m), S(box) in S(m) + S'(box)(box - m).
Total eps <= 3.8e-26 (scaled; abs F at the rate points is at least 1.5e-4 in the same units).
Zeros: a float64 screen (winding of the phase on a grid of mesh 0.05), Newton, then for each candidate the winding
number of F around a square of half-width 1e-15 in balls (64 segments, each segment enclosure excluding 0); every
candidate has winding number exactly 1. Completeness: (1/2 pi i) contour integral of L encloses an integer equal to
the number of enclosed zeros, for each rectangle. Contour integrals by `acb.integral` on unit pieces, tolerance 2^-70.
The zeta row uses xi directly (Arb zeta, series of length 3 in s) with the same contour, zero and cell code.

### 4.3 Cells (Table 3) and the decision rule of PREREG

- Every cell of rows P8 and P1 encloses 0, radius 2.2e-14 to 5.2e-14 (threshold 1e-10), for HEAT at Y = 1 .. 128 and
  for zeta at Y = 1 .. 32. The radius is set by the zero boxes (1e-15); C_R itself has radius below 6e-19.
- Q_gen for HEAT equals the round-21 values to 20 digits or more (-0.48976223534713037147, 2.9223593405936390535);
  the off-line pair of round 21 (Re z = -+0.817574037648391, height 2500.823423924555) is in the list.
- No edge had to be moved (no zero within 0.02 of an edge in Re w).
- HEAT census inside abs(Im z - 2500.75) <= 128: 243 zeros, 83 boxes meeting the line, 160 zeros off the line
  (80 pairs), largest abs(Re z) of a zero 1.338; none near the sides Re z = -+3. Zeta on abs(Im z - 2500.75) <= 32:
  61 zeros, every box meets the line (no claim is made beyond the box statement).
- Not identically zero: abs W_R between 0.50 and 2.92 (HEAT) and 5.3 to 7.2 (zeta); abs C_R from 0.82 down to 0.015;
  abs F at the rate points bounded below (Table 3).
- (a) of PREREG: Lemma H is complete as a proof with three recalled inputs: the limit is PROVED-1.
- (b) "Decreasing on the range": abs(C_R) is the same number at Y = 1 and Y = 2 (the same three zeros are inside; by
  Lemma H (ii) the two contour integrals are equal, and the balls overlap), so the pre-registered strict order
  fails at k = 1 -> 2 and holds for k = 2 .. 6 and for the added k = 7, 8 (balls disjoint and ordered). Predicted
  ratios 0.3 to 0.8 for k >= 2: observed 0.561, 0.527, 0.484, 0.509, 0.500, 0.502 (P8). Predicted abs(C_R_6) < 0.3:
  observed 0.0596.
- Reading of the size (ARGUED): by Lemma H, C_R = - sum over zeros outside R of h(rho); for row P8 and zeros far from
  the rate, h(rho) is about 1/(gamma - 2500.92)^2, so abs(C_R) is about 2 (density)/Y = 2 (1/2 pi) log(2500.75/2 pi)/Y
  = 1.906/Y. Observed Y abs(C_R): 1.906, 1.904, 1.913 at Y = 32, 64, 128. Zeta and HEAT agree to 1.1e-5 at Y = 32
  (-0.0595533 against -0.0595643): the tails of the two zero sets have the same density.
- Round 21's rectangle (row k = 0, from file): X = 1.15625, Im z in [2499.875, 2501.140625], 2 zeros, C_R = -3.03057.

### 4.4 What is not established

- An explicit bound abs(C_R) <= B(R) for every R containing the last rectangle ((c) of PREREG) was not produced.
  Jensen's formula with the global bound of Lemma H (i) counts zeros in a disc around a point of the critical line
  at height T only up to a constant of size (pi/4) T (the bound ignores the decay of F along the line; about 1960 at
  T = 2500), which gives B(R) of order 2000/Y^2 + O(log Y/Y) (ARGUED, a paper estimate): above the observed size 1.9/Y for Y below about 1000. A
  usable bound needs an upper envelope for H_{-tau} in the critical strip and a lower bound at one point per
  height, which is the analysis of the escape-law lane, not a conversion.
- tau = 0.25 (height 5e5): not run. Statement O line 11 names tau = 1 and 0.25; Lemma H covers every tau >= 0, the
  cells of Table 3 are for tau = 1 only.
- The clauses L2, D7, Q25 of line 11: not touched.

## 5. Controls

This lane has no device; it converts control rows. What was run, with zeta alongside every row:

| part | control object | not identically zero | zeta alongside | outcome |
|---|---|---|---|---|
| 1 | THIN b = 0.75, zeta's Arch imposed | twisted weight mass 25.9, 27.0 | +2.686, +4.265 on the same vectors, above +err | fails S3 at two windows, CERTIFIED |
| 1 | DEL b = 0.55, b = 0.75 | deleted weight mass 13.6 to 51.5 | +0.949 to +3.328, above +err | fails S3 at two windows each, CERTIFIED |
| 2 | DEL b = 0.9 | deleted weight mass 451 to 758 (11246 to 32553 primes) | +1.641 to +4.747, above +err | fails S3 at eight windows, CERTIFIED; 1.9e-6 of heights MEASURED |
| 1, 2 | zeta (control of the computation) | - | - | no height below 0 in 2.0e9 (MEASURED); the four lowest windows above +err (CERTIFIED) |
| 3 | HEAT, tau = 1 | abs F at rates >= 1.5e-4 (scaled); 160 off-line zeros inside | same cells for xi on Y <= 32 | every cell encloses 0; limit by Lemma H |

Why each control fails or passes, by structure: DEL and THIN have no functional equation with zeta's Arch, and the
form is linear in the coefficients, so the failure is a size event (no multiplicative relation is tested: R1 is not
engaged). HEAT passes the identity of line 11 exactly as zeta does (Lemma H is blind to the location of zeros),
which is what line 11 states: the identity holds for the control and its sign reads the zeros.
Not run (not objects of this assignment): DH, sign twist, unimodular twist, E_a, T-NR, Beurling, phase-rotated
transfer operator, theta^w.
The zeta pass in Part 2 is consistent with the reading of the form as an explicit-formula sum over zeros weighted
by abs(h-hat)^2 (U4 lane); that reading is not derived or used here.

## 6. Requirement flags, with the evidence

- **R1 false.** Nothing here uses multiplicativity: the band forms are linear in Lambda, and Lemma H holds for any
  entire function of order below 2.
- **R2 false.** Every statement is about explicit windows or finite rectangles, or is a limit statement (Lemma H)
  that holds equally for the control. "No zeta height below 0" is a finite float64 scan.
- **R3 false.** The rows are existence of failing windows for two controls (a size event) and an identity that
  holds for HEAT; no device is separated from the control list.
- **R4 false.** Not addressed; Lemma H passes from finite rectangles to all zeros for an identity that carries no
  inequality.

## 7. Three weakest steps

1. **"Fails S3" rests on the error term of the U4 lane.** What is certified is the sign of an explicit finite sum
   and the value of the formula err; that err bounds the difference between the band form and step S3 is
   Proposition M of the U4 lane (re-derived by its second referee, with psi(x) < 1.04 x recalled), not re-proved
   here. Margins are 50 to 3100 times err. The sets S are defined by a float64 greedy rule (explicit lists
   recorded, same on two platforms); the test vectors live in a 6-mode space; the fraction 1.9e-6 and the zeta
   count are float64.
2. **Lemma H is one derivation with three recalled inputs** (the Phi representation with Phi > 0, Jensen, Hadamard),
   none opened; no separate referee has read it; it gives no explicit rate, and the explicit bound was not
   produced (4.4). Under the record's label rule the line-11 clause becomes PROVED only after a referee file.
3. **The HEAT cells are one code base and one execution above Y = 4.** They rest on the c20 quadrature lemmas
   (refereed there) plus three steps written here once (window truncation, Cauchy derivative, mean-value boxes).
   The floating-point recomputation with separate code covers the contour integrals at Y = 1 and 4, Q_gen, and
   the 40 zero representatives of the pre-registered run; the rows Y = 8 .. 128 were not recomputed
   independently (the Y = 1 .. 32 rows of the extension run repeat the first run bit for bit: same slabs, so no
   independent check). tau = 0.25 was not run.

## 8. Server use and files

Server through `rhrun` only, after `rhstatus` (rh.slice at 10 to 35 GB, other lanes included). Planned allocations were
printed by every job (largest: 0.9 GB per worker in the screen; observed job peak below the 10 GB limit). Units
(all listed in `units.txt`; logs copied to `logs/`): `rh-c22u4chk-1120145221` (screen on the round-21 range, 8 cores,
47 s), `rh-c22p1-1120145301` (Part 1), `rh-c22u4big-1120145631` (failed at start: argument quoting; no output),
`rh-c22p1f-1120145632` (Table 1b), `rh-c22ztest-*`, `rh-c22htest-*` (tests; the first pair failed on a string
conversion), `rh-c22u4big-1120145859` (the large screen, 6 cores, 10 GB limit, 3875 s), `rh-c22zeta-1120150114`
(first zeta cells; one contour piece did not finish in 16 minutes with the first evaluator; **stopped by this lane
by exact unit name**), `rh-c22heat-1120150115` (HEAT cells, pre-registered, 457 s), `rh-c22heatX-1120150910`
(extension to Y = 128, 1415 s), `rh-c22refh-1120150911`, `rh-c22refz-1120154517`, `rh-c22refu1-1120154449`,
`rh-c22refu2-1120160622` (referee recomputations), `rh-c22zeta-1120152001` (zeta cells with the series evaluator,
330 s), `rh-c22p2-1120160356` (Part 2 verdict, 8 cores). At most 9 cores were in use for a few minutes (6 + 1 + 1 + 1)
against the 8 of the assignment; otherwise 8 or fewer. No unit of this lane is left running; nothing was stopped
by name pattern; GPU not used. Local: `sets_dump.py` through `scripts/memcap.sh 8`.

Files: `PREREG.md`, `RESULT.md`, `REFEREE.md`, `lanes.jsonl`, `tables.md`; code `u4lib.py`, `u4_fftscan.py`,
`u4_ball.py`, `make_win2.py`, `sets_dump.py`, `heat_cells.py`, `heat_c20.py` (copy, unchanged), `ref_u4.py`,
`ref_heat.py`, `ref_zeta.py`, `rr.sh`; data `r21_u4_confirm.json` (copy of the round-21 file), `win_part1.json`,
`win_part1_float.json`, `win_part2.json`, `ball_part1_p128.json`, `ball_part1_float_p192.json`,
`ball_part2_p128.json`, `scan_r21range.json`, `scan_big.json`, `sets_explicit.json`, `cells_heat_p128.json`,
`cells_heat_ext128_p128.json`, `cells_zeta_p128.json`, `ref_heat.json`, `ref_zeta.json`, `ref_u4_part1.json`,
`ref_u4_part2.json`.
