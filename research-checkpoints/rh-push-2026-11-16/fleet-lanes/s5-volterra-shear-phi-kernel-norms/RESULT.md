# s5-volterra-shear-phi-kernel-norms: RESULT

Date 2026-11-20. Kind: screening (compute). Four combinations screened. **Survivors: 0.**
Labels: PROVED / CLASSICAL / MEASURED (ball arithmetic encloses rounding only; quadrature truncation is checked by a second node count and is not enclosed; float64 where stated) / OPEN.
No statement about the zeros of zeta is made.

## 0. Verdict

| # | combination (nodes) | statistic | sizes reached | zeta | comparison L-functions | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | volterra-hankel-operator + hidden-square-volterra-collapse + link-a-schur + volterra-tail-transfer | a* = sup{a : norm V_{a,Phi} <= 1} (block [[I,V],[V*,I]] >= 0 iff a <= a*); exponent d log norm/da on a in [1e-3, 60] | Nystrom n = 1024..16384 on GPU 1 (float64, top singular value by power iteration); ball bracket a_G < a* < a_L at 256 bits for 28 kernels (a_G only for the two E_b); 30 kernels | a* = 31.621366469 (n = 16384; 31.621366470 at 8192); bracket (31.6213483, 31.6213840); exponent 0.157 (a = 10) to 0.415 (a = 60) | chi_-4: 8.667079; chi_5: 8.829226; chi_-3: 13.420567; chi_-7: 2.326294; chi_8: 4.398813 | DH 5.699060 (its n = 1 theta term alone: 5.880054, -3.1%; chi_5 against its n = 1 term: +5.0%; chi_-4: +0.10%); E_b = 0.125, 0.25: 30.968756, 30.962533; T-NR(1000003, c = 2.2 / 1.9): 0.506915 / 0.528271; T-NR(3, 2.2 / 1.9): 6.458759 / 6.708225; heat tau = -2..0.5: 32.2576 to 31.4612, linear through tau = 0; Liouville twist 48.207190; sign-flipped zeta kernel 31.621366469 (identical); unimodular twist identical (3e-16) | CLOSED. The operator is unitarily equivalent to one built from the measure Phi(t)^2 dt alone (PROVED); the threshold and the exponent are fixed by conductor, parity and the first one or two coefficients; no zero and no prime enters. Replays `b-volterra-norm` and `s1-kernel-shear-norms` at larger size with the T-NR, E_b, Liouville rows added |
| 2 | shear-wronskian-rank2 + rank2-antisymmetric-shear-kernel + shear-gram-hs-identity + scale-normalised-dbn-null + volterra-homogeneity | shear angle sin theta(a) = mu/(norm p norm q), a = 0, 0.3, ..., 60 (201 values) | 800-bit balls, 147 nodes per panel of width 1/8 (1764 to 5439 nodes); second size 400 bits, 85 nodes per panel: agreement to 1e-115.7 relative or better for every kernel and every a; at least 773 accurate bits in every value; 30 kernels | theta(0) = 0.63889706339300686163...; theta(3) = 0.61481; theta(9.9) = 0.39771; log10 sin theta(60) = -7.127 | theta(0): chi_-3 0.63433, chi_-4 0.62143, chi_5 0.63245, chi_-7 0.62261, chi_8 0.62433. Residual after the best conductor shift of zeta's curve: 0.068, 0.087, 0.092, 0.126, 0.121 | DH: theta(0) = 0.61264, residual 0.0998 (between chi_5 and chi_8); E_b: 0.056; T-NR(3): 0.27 / 0.22 (c = 2.2 / 1.9); T-NR(1000003): 0.46; Liouville 0.027; heat tau: residual 5.8e-3 abs(tau), odd in tau, no feature at tau = 0; sign-flipped zeta kernel: 0 | CLOSED. Degree 0 in Phi but still a function of the measure Phi^2 dt (three Laplace moments). The shift family from zeta does not contain the comparison L-functions (premise fails on the positive side); DH lies inside their range; heat is a smooth odd perturbation through tau = 0 |
| 3 | shear-pass-kernel-R + shear-obstruction-one-dimensional + shear-perron-monotone-ceiling + shear-perron-small-s-collapse + hankel-gap-aU-invariant + shear-decoupled-rate-lever | Perron value of R_Phi(a) on phi_j = Phi tau^j, j <= DEG; locus a_1(DEG): norm R_Phi = 1; gap norm - max R_jj | DEG = 2..60 (13 values); root search at 128 and 256 bits; Collatz-Wielandt enclosures at 1024 bits (local) and at 4000 bits (server; the two E_b at 600 bits); 31 kernels | a_1 = 3.33242, 1.55585, 0.43078, 0.15051, 0.07064 at DEG = 2, 4, 12, 30, 60; a_1 x DEG = 4.38, 4.29, 4.24 at DEG = 40, 50, 60 | DEG = 60: chi_-4 0.044763, chi_5 0.042634, chi_-3 0.049171, chi_-7 0.037772, chi_8 0.037198 | DH: 0.041751 at DEG = 60. Ratio to the n = 1 theta term of the same conductor and parity, DEG = 4, 12, 30, 60: DH 1.00511, 1.00071, 1.00003, 1.000001; chi_5 0.98870, 0.99853, 0.99993, 0.999998; chi_-4 0.99988, 0.99999, 1.00000, 1.00000; zeta 1.00006, 1.00000, 1.00000, 1.00000. Heat: zeta x (1 - 0.0056 tau) at DEG = 60, linear through 0. T-NR c = 2.2 against c = 1.9: 1.0160 to 1.00002 (q = 3). Sign-flipped zeta kernel: identical | CLOSED. The source matrix contains no Phi (checked). The Phi-weighted locus tends to 0 like C/DEG for every kernel (no positive limit), and at growing DEG it converges to the value of the leading theta term: a function of conductor and parity alone |
| 4 | autocorrelation-moment-ladder + polya-kernel-cosine-transform + overflow-onset-arcsinh1 + excess-fraction-onset-pole + bridge-sign-from-phi-positivity + passive-core-ceiling | sign of D_n = det[c_{i+j+s}], c_k = M_2k/(2k)!, s = 0, 1, against the Polya-frequency sign (-1)^{n(n-1)/2}; same for the transform itself ("lin"); sign of Phi | orders 1..160 for 27 kernels (6000-bit balls, windows extended by 1.0, moments to index 642); orders 1..320 for 12 kernels (12000 bits, moments to index 1282); orders 1..80 at 16000 bits and 1..40 at 4000 bits as second sizes; every sign decided | every order to 320 has the Polya-frequency sign, both sequences, both shifts; Phi > 0 | chi_-4, chi_5: same to 320; chi_-3, chi_-7, chi_8: same to 160 | DH, E_b = 0.25, T-NR(3, 2.2), T-NR(1000003, 2.2), heat tau = -2, -0.5, -0.1: all 320 orders pass; E_b = 0.125, T-NR with c = 1.9, heat tau = -0.2, -0.05, 0.05, 0.2, 0.5, the n = 1 term of zeta: all 160 orders pass; Phi > 0 in each. Fail: sign-flipped zeta kernel (Phi changes sign; first wrong sign at order 7, shifted 5; squared sequence 9 / 7); unimodular twist zeta(s + i) (order 19 / 17: transform not even). One-sided Liouville and one-sided zeta: pass to 160 (their sequences are not transforms of the L-function) | CLOSED. No control with a functional equation fails: DH passes to 2.2 times the round-4 rate (146), heat tau = -0.5 to 2.9 times (112), heat tau = -2 to 12 times (27), and E_b and T-NR, whose lowest zeros are off the line, pass at every order. D_n is, up to the fixed sign, a rectangular Schur function of the reciprocal squared zeros (PROVED for finite products); a conjugate pair of small argument does not change its sign. The object enters through all zeros at once, with no resolving power for pairs near the line |

Known pattern to beat: not beaten. Combinations 1 to 3 are functionals of the positive measure Phi(t)^2 dt on the half-line and are identical for a kernel whose transform has an off-line zero (sign-gauge twin); their values for every control follow from conductor, parity and the first coefficients. Combination 4 reads the zeros, and separates only the two controls that fail for a reason visible at the first few orders (a kernel that changes sign; a transform that is not even); DH, E_b, T-NR and backward heat pass at every order reached (320), which for DH and for heat tau = -0.5 and -2 is beyond the order at which a moment certificate resolves their first off-line pair.

## 1. Objects, code, validation

Convention x = e^{4u}; Xi_F(w) = int_R Phi_F(u) e^{iwu} du = Lambda_F(1/2 + i w/2). Kernels (`slib.py`, python-flint balls; formulas of `s1-kernel-shear-norms/klib.py` and `s3-shear-bridge-gram-forms/glib.py`):

| key | kernel on u >= 0 | window | role |
|---|---|---|---|
| zeta | Phi(u) = sum (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}) | [0, 1.5] | target |
| chi-3, chi-4, chi5, chi-7, chi8 | 4 e^{(1+2 delta)u} sum chi(n) n^delta exp(-pi n^2 e^{4u}/q) | [0, 1.5 + ceil(2 log q)/8] | positive comparison |
| DH | same with b = (1, kappa, -kappa, -1, 0) mod 5, delta = 1 | [0, 2] | control; off-line zeros from 0.8085 + 85.699i |
| E_b=0.125, E_b=0.25 | (Phi e^{2bu}) * (Phi e^{-2bu}): kernel of xi(s+b) xi(s-b) | [0, 3] | control; every zero at distance b from the line |
| NR(q,c) | c Phi(u) + Phi(u - l/2) + Phi(u + l/2), l = log q: xi(s)(2 cosh((s-1/2) l) + c) | q = 3: [0, 2.125]; q = 1000003: [0, 1.5] and [5.375, 8.5] | control for c = 2.2 (zeros at Re s = 1/2 +- arccosh(1.1)/log q from height pi/log q = 0.227 for q = 1000003, 2.86 for q = 3); c = 1.9 has all zeros on the line and is the matched on-line member |
| heat tau | e^{tau u^2} Phi(u), tau = -2, -0.5, -0.2, -0.1, -0.05, 0.05, 0.1, 0.2, 0.5 | [0, 1.5] | control for tau < 0 (first off-line pairs: tau = -0.1 at height 415.26, -0.5 at 111.69, -2 at 49.72) |
| liouville | 4 e^u sum lambda(n) exp(-pi n^2 e^{4u}) | [0, 1.5], u >= 0 only | sign-twisted primes (no functional equation) |
| unimodular twist | Phi(u) e^{2iu} (zeta(s + i)) | [0, 1.5] | combination 1 (identity) and 4 |
| gauge0.3 | Phi(u) for u <= 0.3, -Phi(u) for u > 0.3 | [0, 1.5] | sign-gauge twin (`b-volterra-norm` T2); transform has a zero on the imaginary axis at w = 33.31 i |
| zeta_lead, lead(q,delta), DH_lead | the n = 1 theta term alone | as the parent | "conductor and kernel decay alone" reference |
| zeta_repo | kernel as typed in the repo moment sources (prefactors e^{4u}, e^{2u}) | [0, 1.5] | replay of source numbers |
| flat | Phi = 1 on [0, 1] | [0, 1] | source object of combination 3 |

The task's window U <= 1.5 is used for zeta, heat and the Liouville twist; for the other kernels the window is extended so that the discarded tail is below 1e-220 of the kernel maximum (conductor shift (log q)/4; the T-NR bump at (log q)/2 = 6.91). By the tail-transfer node the finite window equals the half-line to that accuracy.

Quadrature: Gauss-Legendre on panels of width 1/8, prec/6.5 + 24 nodes per panel. E_b is evaluated by a convolution quadrature at every node (same panels).

Validation (`selftest.py`, `out_server/selftest.txt`; `out_local/`):
- Phi(0) = 0.44669690046712344409; int_0^inf Phi = xi(1/2)/8 to 35 digits at two node counts.
- G(0.5) = 4.67366009773e-4 (record 4.673660098e-4); G(31.6213) = 0.999986606889033, G(31.6214) = 1.00001430965 (`b-volterra-norm`: 0.99998660688903).
- Fourier identities: DH at t = 3.7, chi_-4 and chi_5 at t = 2.1 against Hurwitz-zeta values, 25 digits each.
- E_b: int_0^inf Phi_b = (xi(3/4)/4)^2/2 to 20 digits. T-NR: transform = xi-transform x (2 cos(w l/2) + c) to 17 digits (q = 3 and q = 1000003).
- Combination 1: zeta threshold 31.621366 (record 31.621366); zeta_repo 37.6621 (repo record 37.66).
- Combination 3: flat kernel at s = 3, DEG = 4: 4.617013675413618 (source 4.617013710: agreement to 3.5e-8, the source value is a float quadrature).
- Combination 4: M_0 = 7.67547043e-4, M_2 = 4.53721896e-6, M_4 = 9.62527666e-8 with the kernel as typed in the sources (targets 7.675e-4, 4.537e-6, 9.62528e-8). Synthetic sequences: all real zeros: correct sign at every order; one reciprocal root made negative at position 3: first wrong sign at order 5; conjugate pair at the first position with argument 1.4: order 2; argument 0.3 or 1.2: no wrong sign to order 16.

Compute. Local runs through `scripts/memcap.sh 8` (all four combinations at reduced size; combination 3 at 1024 bits in full). Server through `rhrun`: `rh-s5-gpu-1120075018` (2 cores, GPU 1, cupy pool limit 24 GB, 69 minutes), `rh-s5-cpu-1120075018` (6 cores: selftest, combination 1 brackets, 2, 4, 3), `rh-s5-gpu2-1120090203` (heat -0.5 rerun after one out-of-memory refusal by the shared card), `rh-s5-c4ext-1120100807` (6 cores, combination 4 to orders 160 and 320, 74 minutes), and three units stopped by this lane before completion (section 7). At most 8 cores in use at any time. Memory limits 8 to 12 GB per unit, use at most 2 GB each. Two first launch attempts (units `...074534`, `...074848`) exited at once because the code had not been copied (the first rsync commands wrote to a local path); nothing ran. All units stopped or finished.

## 2. Combination 1: norm of the Volterra shear operator

**Definition (sources `imp-1258`, `imp-linkA-schur-verification.js`, `b-volterra-norm`).** (V f)(t) = int_0^t Phi(t) Phi(s) sinh(a(t-s)) f(s) ds on L^2(0, inf). [[I, V],[V*, I]] >= 0 iff norm V <= 1 (Schur complement). The norm is nondecreasing in a (kernel nonnegative after the gauge below), so the block is positive exactly for a <= a*.

**Finite consequence tested.** a*(F) and the exponent d log norm/da for each control differ from the value given by the conductor and the decay of the kernel (its n = 1 theta term), at an a unrelated to the displacement of the control's off-line zeros. Survival would need that for every control, with zeta and the L-functions on the prediction.

**PROVED (where the object enters).** With m(dt) = Phi(t)^2 dt and U: L^2(m) -> L^2(dt), (U g)(t) = Phi(t) g(t) (an isometry onto the functions supported where Phi != 0), V = U W_a U* with (W_a g)(t) = int_0^t sinh(a(t-s)) g(s) m(ds). Hence the whole family {V_{a,Phi}}, its norms, singular values and every exponent are functions of the measure Phi^2 dt. Consequences: (i) Phi -> eps Phi for any sign function eps changes nothing (`b-volterra-norm` T2; the twin gauge0.3 below has the same numbers in all digits while its transform has an off-line zero); (ii) the unimodular twist Phi e^{2iu} gives a unitarily equivalent operator (measured: 4.874810667254181e-3 against 4.874810667254180e-3 at a = 5, n = 600, both the sesquilinear and the bilinear form); (iii) Phi -> c Phi multiplies the norm by c^2, so a* depends on the normalisation of the object (here: leading coefficient 1 and the completed kernel as written in section 1).

**Method.** Screen: Nystrom matrix on composite Gauss-Legendre nodes, entries formed in the log domain, largest singular value by power iteration (float64, GPU 1), sizes 1024 to 16384; a* by bisection of log norm = 0. The kernel has a kink on the diagonal, so the Nystrom error is algebraic: a*(zeta) = 31.621366504, ...478, ...471, ...470, ...469 at n = 1024, 2048, 4096, 8192, 16384. Check at higher precision (256-bit balls): norm <= G(a) = sqrt(E_+ E_- - I^2)/2 (Hilbert-Schmidt) and norm >= L(a) = <u, V w>/(norm u norm w) with the approximate top singular pair u = Phi e^{at}, w = Phi e^{-at}; a_G solves G = 1, a_L solves L = 1; signs of G - 1 at a_G(1 - 1e-9) and of L - 1 at a_L(1 + 1e-9) are decided by the balls for all 28 kernels with a pointwise formula. The Nystrom value lies inside (a_G, a_L) in every row.

**Results (MEASURED; `out_server/c1_gpu.json`, `c1_gpu_heat05.json`, `c1_arb.json`).**

| object | a* (n = 16384) | a* (n = 8192) | a_G (ball) | a_L (ball) | exponent at a = 1, 10, 30, 60 | norm/G at a = 0.001, 10 |
|---|---|---|---|---|---|---|
| zeta | 31.621366469 | 31.621366470 | 31.6213483 | 31.6213840 | 1.0050, 0.1573, 0.2664, 0.4154 | 0.97901, 0.98871 |
| zeta, n = 1 term | 31.626184198 | 31.626184198 | 31.6261661 | 31.6262017 | 1.0050, 0.1572, 0.2664, 0.4154 | 0.97899, 0.98870 |
| zeta, sign flipped for u > 0.3 | 31.621366469 | 31.621366469 | 31.6213483 | 31.6213840 | 1.0050, 0.1573, 0.2664, 0.4154 | 0.97901, 0.98871 |
| chi_-3 | 13.420567394 | 13.420567413 | 13.4178986 | 13.4256998 | 1.0124, 0.2549, 0.4922, 0.6654 | 0.97926, 0.99611 |
| chi_-4 | 8.667079197 | 8.667079249 | 8.6538677 | 8.7075990 | 1.0167, 0.3082, 0.5639, 0.7373 | 0.97944, 0.99797 |
| chi_-4, n = 1 term | 8.658591764 | 8.658591816 | 8.6453653 | 8.6993209 | 1.0167, 0.3083, 0.5639, 0.7373 | 0.97947, 0.99798 |
| chi_5 | 8.829225999 | 8.829226050 | 8.8180192 | 8.8636971 | 1.0171, 0.3218, 0.6036, 0.7849 | 0.97928, 0.99813 |
| chi_5, n = 1 term | 8.407184844 | 8.407184907 | 8.3939457 | 8.4574566 | 1.0171, 0.3229, 0.6043, 0.7851 | 0.98011, 0.99821 |
| chi_-7 | 2.326294312 | 2.326294378 | 2.2930981 | 2.6943363 | 1.0278, 0.4313, 0.7037, 0.8772 | 0.98041, 0.99961 |
| chi_8 | 4.398813218 | 4.398813304 | 4.3669481 | 4.5914802 | 1.0256, 0.4232, 0.7210, 0.9024 | 0.97965, 0.99948 |
| DH | 5.699060061 | 5.699060146 | 5.6704829 | 5.8357353 | 1.0208, 0.3548, 0.6196, 0.7931 | 0.97962, 0.99889 |
| DH, n = 1 term (= conductor 5, odd) | 5.880054374 | 5.880054456 | 5.8523806 | 6.0013356 | 1.0207, 0.3539, 0.6193, 0.7930 | 0.97918, 0.99885 |
| E_b = 0.125 | 30.968756097 | 30.968756097 | 30.9687561 | (Nystrom only) | 1.0101, 0.2314, 0.5418, 0.8354 | 0.97884, 0.99452 |
| E_b = 0.25 | 30.962532648 | 30.962532648 | 30.9625326 | (Nystrom only) | 1.0101, 0.2314, 0.5418, 0.8354 | 0.97884, 0.99451 |
| T-NR(1000003, 2.2) | 0.506914813 | 0.506914813 | 0.5069147 | 0.5071020 | 6.8613, 6.9908, 7.1741, 7.3232 | 0.99998, 1.00000 |
| T-NR(1000003, 1.9) | 0.528270514 | 0.528270514 | 0.5282704 | 0.5283864 | 6.8613, 6.9908, 7.1741, 7.3232 | 0.99998, 1.00000 |
| T-NR(3, 2.2) | 6.458758722 | 6.458758723 | 6.4586288 | 6.4599246 | 1.0895, 0.6323, 0.8156, 0.9647 | 0.99649, 1.00000 |
| T-NR(3, 1.9) | 6.708224845 | 6.708224846 | 6.7081284 | 6.7088960 | 1.0897, 0.6323, 0.8156, 0.9647 | 0.99654, 1.00000 |
| heat tau = -2 | 32.257572006 | 32.257572007 | 32.2575546 | 32.2575890 | 1.0048, 0.1548, 0.2596, 0.4093 | 0.97898, 0.98839 |
| heat tau = -0.5 | 31.781062228 | 31.781062228 | 31.7810443 | 31.7810797 | 1.0050, 0.1566, 0.2647, 0.4139 | 0.97900, 0.98863 |
| heat tau = -0.2, -0.1, -0.05 | 31.685296706, 31.653340257, 31.637355532 | | | | 1.0050, 0.1570..0.1572, 0.2657..0.2662, 0.4148..0.4153 | |
| heat tau = 0.05, 0.1, 0.2, 0.5 | 31.605373066, 31.589375320, 31.557366788, 31.461236680 | | | | 1.0050..1.0051, 0.1573..0.1579, 0.2666..0.2681, 0.4156..0.4169 | |
| Liouville twist (u >= 0) | 48.207190369 | 48.207190369 | 48.2071903 | 48.2071904 | 1.0027, 0.1306, 0.2076, 0.3839 | 0.98053, 0.98562 |
| zeta, kernel as typed in the sources | 37.662098876 | 37.662098877 | 37.6620947 | 37.6621058 | 1.0036, 0.1408, 0.2352, 0.3978 | 0.98020, 0.98700 |

Singular value ratios sigma_2/sigma_1 (full SVD, n = 2048): zeta 0.191 (a = 0.01), 0.138 (a = 10), 0.0042 (a = 30); chi_-4 0.189, 0.057, 5.5e-6; T-NR(1000003) 0.0052, 2e-15, 5e-15. The operator is close to rank one near a*, which is why the two bounds meet there.

**Reading.**
- Zeta: the block is positive for a <= a* = 31.62137 and not above. This is the certified statement of `b-volterra-norm` again; the premise "norm <= 1 on the stated range [1e-3, 60]" is false for zeta itself above 31.62.
- Conductor and kernel decay alone (the n = 1 theta term) give a* to -1.5e-4 (zeta), +9.8e-4 (chi_-4), +5.0e-2 (chi_5), -3.1e-2 (DH) relative. The departures have the sign and size of the second term of the theta series: b(2) 2^delta e^{-3 pi/q} = -0.152 (chi_5), +0.086 (DH), 0 (chi_-4; next term -0.0056), and e^{-3 pi} scale for zeta. DH departs less than the genuine L-function chi_5. The exponent agrees with that of the n = 1 term to 4e-3 relative at a = 10, 1.2e-3 at a = 30 and 3e-4 at a = 60 for every Dirichlet-type kernel tested against its leading term (zeta, chi_-4, chi_5, DH); the largest differences are those of chi_5, not of DH.
- T-NR at q = 1000003: the three moments of Phi^2 are the explicit combination I = (c^2 + 2) I_h, E_+- = c^2 E_+-^h + e^{+-a log q}(E_+^h + E_-^h) of zeta's half-line moments (`nr_closed_form.py`: agreement of G to 2e-75 at four values of a). The threshold depends on c through c^2 and passes smoothly from c = 1.9 (all zeros on the line) to c = 2.2 (zeros off the line): 0.52827 to 0.50691. Its exponent, 6.86 to 7.32, is the distance (log q)/2 = 6.908 between the two bumps of the kernel, corrected by the width of the zeta kernel.
- E_b: 30.9688 (b = 0.125) and 30.9625 (b = 0.25); the zeros move by b, the threshold by 2e-4 relative.
- Heat: a*(tau) = 31.62137 - 0.3198 tau + O(tau^2), tau from -0.2 to 0.2; no feature at tau = 0.
- Comparison with zero heights: DH's threshold 5.70 against its first off-line zero at height 85.7; heat tau = -0.1: 31.653 against 415.3; the sign-flipped zeta kernel has zeta's threshold with a zero at distance 33.3 from the line. No relation, as the proof above requires.

Classification: CLOSED. The object enters through the measure Phi^2 dt on the half-line (its coefficients, dominated by conductor, parity and b(2)); not through its zeros.

## 3. Combination 2: scale-free shear angle

**Definition (sources `imp-2668`, `imp-3343`, lean `shear_gram`, `imp-2451`).** p = Phi cosh(a.), q = Phi sinh(a.) in L^2(0, inf); V - V^# = p (x) q - q (x) p; mu^2 = norm p^2 norm q^2 - <p,q>^2; sin theta = mu/(norm p norm q), the angle between p and q. Degree 0 in Phi.

**Closed form (PROVED, elementary).** With I = int Phi^2, E_+- = int Phi^2 e^{+-2at}: norm p^2 = (E_+ + E_- + 2I)/4, norm q^2 = (E_+ + E_- - 2I)/4, <p,q> = (E_+ - E_-)/4, so

    sin^2 theta(a) = 4 (E_+ E_- - I^2) / ((E_+ + E_-)^2 - 4 I^2),   cos theta(0) = m_1/sqrt(m_0 m_2),  m_k = int t^k Phi^2.

theta is a function of the Laplace transform of the probability measure Phi^2 dt / I at the two points +-2a. The homogeneity obstruction is removed; the dependence on Phi^2 alone is not.

**Finite consequence tested.** The curve of a control leaves the one-parameter family obtained from zeta by a conductor shift, while the comparison L-functions stay in it. Two readings of the family were computed: (A) t -> Phi_zeta(t + c) on t >= 0 (full even kernel), c in [-8, 1], step 1/32 with linear interpolation; (B) t -> zeta's n = 1 theta term at t + c (not reflected), c in [-1, 0.5], step 1/64. Residual = min over c of sup over the 201 values of a of the difference of theta.

**Results (MEASURED; `out_server/c2.json`, `out_server/c2_fam_lead.json`).**

| object | theta(0) | theta(0.9) | theta(3) | theta(9.9) | theta(20.1) | log10 sin theta(60) | residual, family A (best c) | residual, family B (best c) | theta - theta of own n = 1 term, sup over a |
|---|---|---|---|---|---|---|---|---|---|
| zeta | 0.63890 | 0.63672 | 0.61481 | 0.39771 | 0.06861 | -7.127 | 0 | 3.2e-4 (0) | 3.2e-4 |
| chi_-3 | 0.63433 | 0.62882 | 0.57393 | 0.17328 | 0.00388 | -12.460 | 0.0680 (-0.066) | 0.0681 (-0.065) | |
| chi_-4 | 0.62143 | 0.61357 | 0.53656 | 0.10141 | 0.00105 | -14.276 | 0.0870 (-0.090) | 0.0867 (-0.086) | 7.8e-4 |
| chi_5 | 0.63245 | 0.62478 | 0.54899 | 0.10206 | 0.00083 | -15.115 | 0.0927 (-0.086) | 0.0917 (-0.082) | 3.0e-2 |
| chi_-7 | 0.62261 | 0.60907 | 0.48117 | 0.03471 | 0.00008 | -17.797 | 0.1230 (-0.113) | 0.1261 (-0.109) | |
| chi_8 | 0.62433 | 0.61233 | 0.49714 | 0.04189 | 0.00010 | -18.069 | 0.1188 (-0.109) | 0.1209 (-0.104) | |
| DH | 0.61264 | 0.60252 | 0.50520 | 0.06413 | 0.00037 | -15.698 | 0.0989 (-0.102) | 0.0998 (-0.100) | 1.4e-2 |
| E_b = 0.125 | 0.64376 | 0.63953 | 0.59697 | 0.23378 | 0.00683 | -13.799 | 0.0583 (-0.051) | | |
| E_b = 0.25 | 0.64377 | 0.63954 | 0.59699 | 0.23385 | 0.00684 | -13.799 | 0.0583 (-0.051) | 0.0564 (-0.047) | |
| T-NR(3, 2.2) | 0.83913 | 0.78988 | 0.40733 | 0.00475 | 2.4e-6 | -21.098 | 0.301 | 0.270 (-0.516) | |
| T-NR(3, 1.9) | 0.79389 | 0.74112 | 0.36174 | 0.00410 | 2.1e-6 | -21.162 | 0.277 | 0.225 (-0.516) | |
| T-NR(1000003, 2.2) | 0.98539 | 0.00585 | 2.5e-9 | 2.2e-30 | 7.7e-62 | -186.785 | 0.489 | 0.458 | |
| T-NR(1000003, 1.9) | 0.91878 | 0.00505 | 2.1e-9 | 1.9e-30 | 6.6e-62 | -186.848 | 0.455 | | |
| Liouville twist | 0.73352 | 0.73271 | 0.72449 | 0.62945 | 0.29485 | -5.511 | 0.0288 (+0.106) | 0.0266 (+0.107) | |
| zeta, sign flipped for u > 0.3 | 0.63890 | 0.63672 | 0.61481 | 0.39771 | 0.06861 | -7.127 | 0 (difference from zeta exactly 0 at every a) | | |
| zeta, kernel as typed in the sources | 0.70421 | 0.70297 | 0.69038 | 0.54926 | 0.17427 | -6.190 | 0.0199 | | |

Zeta at two sizes: 800 bits / 1764 nodes against 400 bits / 1020 nodes agree to 10^-116.1 relative at every a (the smaller run's full precision); theta(0) = 0.638897063393006861634800670711138543017142901459173500853077.

Heat family (theta_tau - theta_zeta):

| tau | a = 0 | a = 3 | a = 9.9 | a = 20.1 | a = 30 | residual after best shift (A) |
|---|---|---|---|---|---|---|
| -2 | +6.33e-4 | +7.27e-4 | +1.67e-3 | +9.36e-3 | +6.54e-3 | 2.5e-3 |
| -0.5 | +1.65e-4 | +1.89e-4 | +4.31e-4 | +2.39e-3 | +1.62e-3 | 2.86e-3 |
| -0.2 | +6.67e-5 | +7.64e-5 | +1.74e-4 | +9.62e-4 | +6.46e-4 | 1.15e-3 |
| -0.1 | +3.34e-5 | +3.83e-5 | +8.71e-5 | +4.82e-4 | +3.23e-4 | 5.7e-4 |
| -0.05 | +1.67e-5 | +1.92e-5 | +4.36e-5 | +2.41e-4 | +1.61e-4 | 2.9e-4 |
| +0.05 | -1.68e-5 | -1.92e-5 | -4.37e-5 | -2.42e-4 | -1.61e-4 | 2.9e-4 |
| +0.1 | -3.36e-5 | -3.85e-5 | -8.75e-5 | -4.83e-4 | -3.22e-4 | 5.8e-4 |
| +0.2 | -6.75e-5 | -7.73e-5 | -1.75e-4 | -9.68e-4 | -6.43e-4 | 1.15e-3 |
| +0.5 | -1.70e-4 | -1.95e-4 | -4.42e-4 | -2.43e-3 | -1.61e-3 | 2.89e-3 |

**Reading.**
- The premise fails on the positive side: no conductor shift of zeta's curve reproduces a Dirichlet L-function. The residual is 0.068 to 0.126 for the five comparison characters and grows with the conductor (the conductor moves the leading theta term against the fixed endpoint u = 0 of the half-line, which is not a shift of the even kernel). DH (0.099 to 0.100) lies between chi_5 and chi_8. E_b (0.056 to 0.058) is closer to zeta's family than any genuine L-function.
- Against the n = 1 theta term of its own conductor and parity, DH departs by 0.014, chi_-4 by 0.0008, chi_5 by 0.030: DH is again inside the range of the comparison L-functions. Per unit of the second theta coefficient b(2) 2^delta e^{-3 pi/q} (or the next nonzero term) the departure at a = 0 is 0.141 (DH), 0.137 (chi_-4), 0.167 (chi_5): the same first-order response.
- Heat: the difference is odd in tau and linear (ratio of the tau = -0.05 and +0.05 columns: -0.997 to -1.003), with no feature at tau = 0. This reproduces the null of the source node on both sides.
- T-NR at c = 2.2 and c = 1.9 differ smoothly; at q = 1000003 the angle collapses by a = 1 because the mass of Phi^2 sits in two bumps a distance 6.9 apart.
- The sign-flipped zeta kernel has zeta's curve exactly.

Classification: CLOSED. The object enters through Phi^2 dt (coefficients); the curve of each control follows from conductor, parity and the first coefficients; no control onset exists to compare with a zero height.

## 4. Combination 3: Phi-weighted shear/pass matrix

**Source object (`imp-33765`, kernel from `imp-3066`; nodes shear-pass-kernel-R, shear-obstruction-one-dimensional).** phi_j = (tau/U)^j, D_jj = int_0^U cosh(a tau) phi_j^2, H_jk = int_0^U sinh(a tau) phi_j phi_k, R = D^{-1/2} H D^{-1/2}. **Checked and recorded: it contains no Phi.** It is a function of s = aU and the degree. Replay (key `flat`): norm R = 4.617013675413618 at s = 3, DEG = 4 (source 4.617013710); 53.9201 at DEG = 60 (ceiling DEG + 1 = 61); locus norm R = 1 at s_1 = 0.52506, 0.27940, 0.09566, 0.03830, 0.01913 for DEG = 2, 4, 12, 30, 60 (s_1 x DEG = 1.148 at DEG = 40, 50, 60).

**Phi-weighted version (the task's).** phi_j = Phi(tau) tau^j on (0, inf): D_jj = int cosh(a tau) Phi^2 tau^{2j}, H_jk = int sinh(a tau) Phi^2 tau^{j+k}. H is the Hankel matrix of the measure sinh(a tau) Phi^2 d tau and D the diagonal of the Hankel matrix of cosh(a tau) Phi^2 d tau. Every entry of R is positive, so norm R is the Perron value; for any positive vector x, min (Rx)_i/x_i <= norm R <= max (Rx)_i/x_i (Collatz-Wielandt), which gives enclosures in ball arithmetic. Degree 0 in Phi; a function of Phi^2 dt.

**Finite consequence tested.** Zeta's locus a_1(DEG) converges as DEG grows, and a control's a_1(DEG) differs from zeta's by more than the DEG-to-DEG change in a way that is not a function of the conductor.

**Results (MEASURED; root search at 128 bits, enclosures at 1024 bits: `out_local/c3_1024.json`; root search at 256 bits, enclosures at 4000 bits with 5112 to 10224 nodes: `out_server/c3.json`).** In both runs and for all 31 kernels and 13 degrees the Perron enclosure is below 1 at a_1(1 - 1e-9) and above 1 at a_1(1 + 1e-9), all entries are positive, and the Collatz-Wielandt width at a_1 is below 1e-150 (it is set by the 400 power-iteration steps, not by the precision). The two runs give the same a_1 to 6.2e-14 relative (the tolerance of the root search).

| object | DEG = 2 | 4 | 12 | 30 | 60 | a_1 x DEG at 40, 50, 60 | gap norm - max R_jj at a_1, DEG = 4, 60 |
|---|---|---|---|---|---|---|---|
| zeta | 3.33242225 | 1.55584550 | 0.43077937 | 0.15050881 | 0.07064292 | 4.378, 4.293, 4.239 | 0.681, 0.961 |
| zeta, n = 1 term | 3.33187289 | 1.55575683 | 0.43077790 | 0.15050880 | 0.07064292 | same | 0.681, 0.961 |
| zeta, sign flipped for u > 0.3 | 3.33242225 | 1.55584550 | 0.43077937 | 0.15050881 | 0.07064292 | same | 0.681, 0.961 |
| chi_-3 | 2.10782073 | 0.99508717 | 0.28301119 | 0.10197555 | 0.04917075 | 2.999, 2.967, 2.950 | 0.688, 0.963 |
| chi_-4 | 1.77852771 | 0.85381050 | 0.24952554 | 0.09170918 | 0.04476341 | 2.711, 2.693, 2.686 | 0.695, 0.964 |
| chi_5 | 1.78804235 | 0.84643103 | 0.24209661 | 0.08780715 | 0.04263374 | 2.589, 2.567, 2.558 | 0.689, 0.964 |
| chi_-7 | 1.36729135 | 0.66418336 | 0.20005025 | 0.07579277 | 0.03777186 | 2.261, 2.261, 2.266 | 0.704, 0.966 |
| chi_8 | 1.44043074 | 0.69184419 | 0.20337888 | 0.07546851 | 0.03719839 | 2.240, 2.232, 2.232 | 0.697, 0.965 |
| DH | 1.57425814 | 0.76420022 | 0.22749545 | 0.08479040 | 0.04175134 | 2.517, 2.506, 2.505 | 0.700, 0.965 |
| conductor 5, odd, n = 1 term | 1.55728218 | 0.76031696 | 0.22733468 | 0.08478751 | 0.04175130 | 2.517, 2.506, 2.505 | 0.702, 0.965 |
| conductor 5, even, n = 1 term | 1.83327900 | 0.85610435 | 0.24245298 | 0.08781290 | 0.04263381 | 2.589, 2.567, 2.558 | 0.686, 0.964 |
| conductor 4, odd, n = 1 term | 1.77914704 | 0.85391495 | 0.24952771 | 0.09170920 | 0.04476341 | 2.711, 2.693, 2.686 | 0.695, 0.964 |
| E_b = 0.125 (600 bits) | 2.37364612 | 1.09675797 | 0.29640744 | 0.10077223 | 0.04621470 | 2.903, 2.826, 2.773 | 0.675, 0.959 |
| E_b = 0.25 (600 bits) | 2.37393678 | 1.09687623 | 0.29642971 | 0.10077650 | 0.04621571 | 2.904, 2.826, 2.773 | 0.675, 0.959 |
| T-NR(3, 2.2) | 0.81500049 | 0.41026953 | 0.13997027 | 0.06026785 | 0.03242034 | 1.863, 1.908, 1.945 | 0.748, 0.968 |
| T-NR(3, 1.9) | 0.78803155 | 0.40382794 | 0.13947313 | 0.06024343 | 0.03241962 | 1.863, 1.908, 1.945 | 0.752, 0.968 |
| T-NR(1000003, 2.2) | 0.06691150 | 0.03429373 | 0.01180222 | 0.00480785 | 0.00246985 | 0.145, 0.147, 0.148 | 0.767, 0.983 |
| T-NR(1000003, 1.9) | 0.06482648 | 0.03376737 | 0.01174088 | 0.00479791 | 0.00246743 | 0.145, 0.147, 0.148 | 0.771, 0.983 |
| heat tau = -2 | 3.40403695 | 1.58723147 | 0.43819586 | 0.15261372 | 0.07143718 | 4.434, 4.345, 4.286 | 0.680, 0.961 |
| heat tau = -0.5 | 3.35042590 | 1.56372860 | 0.43263888 | 0.15103572 | 0.07084152 | 4.392, 4.306, 4.251 | 0.681, 0.961 |
| heat tau = +0.5 | 3.31435128 | 1.54793789 | 0.42891630 | 0.14998145 | 0.07044429 | 4.364, 4.281, 4.227 | 0.681, 0.961 |
| Liouville twist | 5.05710216 | 2.12843140 | 0.51408623 | 0.16608907 | 0.07501470 | 4.745, 4.599, 4.501 | 0.645, 0.959 |

Ratios a_1(F)/a_1(reference) at DEG = 4, 12, 30, 60:

| F / reference | 4 | 12 | 30 | 60 |
|---|---|---|---|---|
| zeta / its n = 1 term | 1.000057 | 1.000003 | 1.000000 | 1.000000 |
| chi_-4 / conductor 4 odd n = 1 term | 0.999878 | 0.999991 | 1.000000 | 1.000000 |
| chi_5 / conductor 5 even n = 1 term | 0.988701 | 0.998530 | 0.999934 | 0.999998 |
| DH / conductor 5 odd n = 1 term | 1.005107 | 1.000707 | 1.000034 | 1.000001 |
| DH / chi_5 | 0.902850 | 0.939689 | 0.965644 | 0.979303 |
| heat -0.5 / zeta | 1.005067 | 1.004317 | 1.003501 | 1.002811 |
| heat +0.5 / zeta | 0.994917 | 0.995675 | 0.996496 | 0.997188 |
| heat -0.05 / zeta | 1.000507 | 1.000432 | 1.000350 | 1.000281 |
| heat +0.05 / zeta | 0.999492 | 0.999568 | 0.999650 | 0.999719 |
| E_b = 0.125 / E_b = 0.25 | 0.999892 | 0.999925 | 0.999958 | 0.999978 |
| T-NR(3): c = 2.2 / c = 1.9 | 1.015951 | 1.003564 | 1.000405 | 1.000022 |
| T-NR(1000003): c = 2.2 / c = 1.9 | 1.015588 | 1.005224 | 1.002071 | 1.000979 |

Norm at fixed a (DEG = 60): zeta 6.940, 13.117, 26.114 at a = 0.5, 1, 3; DH 11.435, 20.233, 31.361; chi_5 11.206, 19.858, 30.925; heat tau = -0.5: 6.921, 13.084, 26.071.

**Reading.**
- Zeta's locus does not converge to a positive value: a_1(DEG) decreases like C/DEG (a_1 x DEG = 4.38, 4.29, 4.24 at DEG = 40, 50, 60, still drifting), as the source object does (1.148/DEG). The norm exceeds 1 for zeta at every a > a_1(DEG) and grows with the degree: the diagonal-normalised Hankel form has no uniform bound, for any kernel. "Pass = convergence" holds only as a_1 -> 0, for every kernel alike.
- The difference between a control and zeta is a function of conductor and parity: DH's locus is the locus of the single theta term e^{3u} exp(-pi e^{4u}/5) to 5.1e-3 at DEG = 4 and to 1e-6 at DEG = 60, because high monomial weights move the mass of tau^{2j} Phi^2 to large tau, where the n >= 2 terms are smaller by exp(-3 pi e^{4 tau}/q). The comparison L-function chi_5 departs from its own leading term by more than DH does at every degree.
- Heat scales the locus by 1 - c(DEG) tau with c = 0.0101, 0.0086, 0.0070, 0.0056 at DEG = 4, 12, 30, 60; odd in tau; nothing at tau = 0.
- The matched T-NR pair (zeros on the line at c = 1.9, off the line at c = 2.2) differs by 1.6e-2 at DEG = 4 and 2e-5 (q = 3) or 1e-3 (q = 1000003) at DEG = 60.
- Gap norm - max R_jj at the locus: 0.68 to 0.77 at DEG = 4 and 0.96 to 0.98 at DEG = 60 for every kernel (the maximal diagonal entry tends to 0 with a_1); no kernel is distinguished.

Classification: CLOSED. Kernel-blind in the source form; in the Phi-weighted form a function of Phi^2 dt that converges, as the degree grows, to a function of conductor and parity alone.

Note on precision. The task's size is DEG 60 at 4000 bits and was run. The entries of R are quotients of integrals of positive functions and the Perron value of a positive matrix is well conditioned, so the result does not depend on it: the 1024-bit and 4000-bit runs agree to the root-search tolerance. The two E_b kernels were certified at 600 bits (their convolution table costs the cube of the precision).

## 5. Combination 4: autocorrelation moments and Hankel determinants

**Sources (`imp-3481`, `imp-3528`, `imp-3524`, `imp-3257`).** A(tau) = int Phi(s) Phi(s + tau) ds; M_n = int tau^n A. The source ladder uses the kernel as typed there, one-sided (s in [0, 7], tau in [0, 6]); with that kernel M_0 = 7.67547043140607e-4, M_2 = 4.53721896458077e-6, M_4 = 9.62527666466540e-8 (targets 7.675e-4, 4.537e-6, 9.62528e-8: reproduced). With the canonical Phi the one-sided values are 1.930695844582e-3, 1.564088594535e-5, 4.064861853147e-7.

**Identity used (PROVED).** For a kernel K with transform Xi(z) = sum x_n z^n, the two-sided autocorrelation has cosine transform G(z) = Xi(z) conj(Xi(conj z)) and M_2k/(2k)! = c_k = (-1)^k g_2k. For an even real kernel G = Xi^2. Two sequences: "sq" c_k from G (the task's), "lin" c_k = (-1)^k x_2k from Xi itself. If sum c_k y^k = prod (1 + x_j y) (x_j = 1/gamma_j^2 for the zeros gamma_j of Xi in z; each twice for G), then c_k = e_k(x) and by the dual Jacobi-Trudi formula

    D_n^(s) = det[c_{i+j+s}]_{i,j<n} = (-1)^{n(n-1)/2} s_lambda(x),   lambda = the rectangle with n - 1 + s rows of length n.

(Row reversal turns the Hankel matrix into det[e_{m-i+j}], m = n - 1 + s. Checked: D_2 = -(x_1^2 + x_1 x_2 + x_2^2) for two roots, defect 0.) If all x_j > 0 (all zeros real) the Schur function is positive, so sigma_n = (-1)^{n(n-1)/2} sign D_n = +1 for every n: a necessary condition for real zeros (a subset of the total-positivity minors of Aissen-Schoenberg-Whitney-Edrei; CLASSICAL). The sign law of the bridge node, sign Gshear(u, v) = sign(v - u), holds iff Phi has one sign on the window (PROVED there); recorded as "Phi sign" below.

**Finite consequence tested.** For each control: whether Phi changes sign, and the first order n with sigma_n = -1. A failure counts if n is below 3.4 x (number of on-line zeros below the first off-line zero). Rates: DH 43 on-line zeros below 85.70, so 146; heat tau = -0.5: 33 below 111.69, so 112; heat tau = -0.1: 211 below 415.26, so 717; heat tau = -2: about 8 below 49.72, so about 27; E_b and T-NR: 0 (every low zero, or the lowest zeros, are off the line).

**Runs (ball arithmetic; every sign decided, none undecided).**

| run | precision | orders | window | nodes | moments to index | kernels | file |
|---|---|---|---|---|---|---|---|
| A (server) | 16000 bits | 1..80 | as in section 1 | 29820 to 42245 | 322 | 27 | `out_server/c4.json` |
| B (local) | 4000 bits | 1..40 | as in section 1 | 7668, 10224 | 162 | zeta, DH | `out_local/out_local_c4b.json` |
| C (server) | 6000 bits | 1..160 | extended by 1.0 | 21080 to 26350 | 642 | 27 | `out_server/c4_ext_160.json` |
| D (server) | 12000 bits | 1..320 | extended by 1.125 | 43743 to 52075 | 1282 | 12 | `out_server/c4_ext_320.json` |
| E (local) | 3000 bits | 1..80 | extended by 0.75 | 9684 to 11836 | 322 | zeta, DH, sign-flipped zeta, T-NR(1000003, 2.2) | `out_local/c4_ext_80.json` |

Window. High moments need a longer tail than the window of section 1: for the moment of index n the integrand u^n Phi(u) at the edge u = 1.5 is e^{-967} (10^-420) of the moment for zeta at n = 322. Runs C, D, E use a window with pi e^{4W}/8 >= (prec + 200) log 2 + n_max log(4W) (beyond it the integrand is below 2^-(prec+200) of the moment for every conductor up to 8) and prec/6.5 + 24 + n_max/6 nodes per panel. Run A used the short window; run E repeats its orders 1..80 with the long window at another precision: the same sign at every order and the same log10 abs D_n to all 16 printed digits for the four kernels, so run A stands. Runs C and D agree with each other on orders 1..160 (same signs; log10 abs D_160 equal to the three decimals compared, for example -111664.458 for zeta and -101675.513 for DH) and with run A on orders 1..80. The precision needed is small (about 15 bits per order: order 40 is undecided at 400 bits and decided at 700; order 80 is decided at 1400).

**Results.** "none" = sigma_n = +1 at every order of the run.

| object | Phi sign on the window | largest order run | sq: first order with wrong sign (s = 0 / 1) | lin: first order with wrong sign (s = 0 / 1) | log10 abs D_n at n = 80, 160, 320 (sq, s = 0) |
|---|---|---|---|---|---|
| zeta | positive | 320 | none / none | none / none | -25250, -111664, -491013 |
| chi_-4 | positive | 320 | none / none | none / none | -22769, -102962, -460255 |
| chi_5 | positive | 320 | none / none | none / none | -22523, -101974, -456449 |
| chi_-3, chi_-7, chi_8 | positive | 160 | none / none | none / none | -23282, -104709; -21859, -99838; -21800, -99466 |
| DH | positive | 320 | none / none | none / none | -22393, -101676, -455773 |
| E_b = 0.25 | positive | 320 | none / none | none / none | -22999, -101702, -448206 |
| E_b = 0.125 | positive | 160 | none / none | none / none | -22999, -101702 |
| T-NR(1000003, 2.2) | positive | 320 | none / none | none / none | -9588, -53600, -275186 |
| T-NR(3, 2.2) | positive | 320 | none / none | none / none | -21278, -98010, -443468 |
| T-NR(1000003, 1.9), T-NR(3, 1.9) | positive | 160 | none / none | none / none | -9588, -53600; -21278, -98010 |
| heat tau = -2 | positive | 320 | none / none | none / none | -25305, -111823, -491450 |
| heat tau = -0.5 | positive | 320 | none / none | none / none | -25264, -111704, -491122 |
| heat tau = -0.1 | positive | 320 | none / none | none / none | -25253, -111672, -491035 |
| heat tau = -0.2, -0.05, 0.05, 0.2, 0.5 | positive | 160 | none / none | none / none | -25255..-25236, -111680..-111625 |
| zeta, n = 1 term | positive | 160 | none / none | none / none | -25250, -111664 |
| zeta, sign flipped for u > 0.3 | changes sign | 320 | 9 / 7 (20 wrong orders to 320 in each: 9, 32, 36, ... , 238; 7, 9, 31, ... , 234) | 7 / 5 (156 wrong orders to 320 in each, the last 317, 319) | -25214, -111646, -491013 |
| unimodular twist zeta(s + i) | positive modulus; complex | 320 | 19 / 17 (every odd order from there to 79; 151 and 152 wrong orders to 320, the last 317, 319) | not defined | -25251, -111657, -491007 |
| Liouville twist, one-sided | positive on the window | 160 | none / none | not defined | -28245, -123484 |
| zeta one-sided; zeta as typed in the sources, one-sided | positive | 160 | none / none | not defined | -27944, -122809; -28081, -123126 |

**Reading.**
- Zeta passes at every order to 320 and at every size, as RH requires; so do the comparison characters (chi_-4 and chi_5 to 320, the other three to 160).
- No control with a functional equation fails at any order up to 320 (160 for the members run only to 160). Against the round-4 rate: DH passes to 2.2 times its rate (146), heat tau = -0.5 to 2.9 times (112), heat tau = -2 to 12 times (about 27); heat tau = -0.1 has rate 717 and is not reached. For E_b and T-NR, whose lowest zeros are off the line, any order would have counted and none fails. The test therefore does not see an off-line pair even after a moment certificate of the same order would have resolved it.
- Why (from the identity): in s_lambda(x) the dominant monomials of the rectangle with n - 1 rows use the n - 1 largest variables, each to the power n. A conjugate pair x, conj x with small argument phi contributes |x|^{2n} when both members are among them, and (sin((n+1) phi)/sin phi) |x|^n when it is split; with x = 1/rho_z^2 and a zero at distance d from the line at height t the argument is about 2d/t (0.0072 for DH's first pair, 0.035 for E_b = 0.25 at the first zero), and the pair is split only at the one order n equal to its index, where (n + 1) phi stays far below pi. The sign cannot change unless a variable is far from the positive axis. This is ARGUED from the dominant terms, not proved for the full sum; the measured signs agree with it, and so do the synthetic cases (argument 0.3 and 1.2: no failure; 1.4: failure at order 2; a negative variable at position 3: failure at order 5).
- The two failures are of that kind: the sign-flipped kernel has a zero on the imaginary axis (a negative variable, second in size), and it is also the only kernel here that violates the sign law of the bridge node; the unimodular twist has a transform that is not even, so its cosine part has complex zeros of large argument. Neither failure uses a prime, and neither control has a functional equation with zeros near the line.
- The one-sided sequences (the source's ladder, and the only form available for the Liouville twist, whose two-sided kernel is not integrable) are coefficients of |h(z)|^2 for the half-line transform h; they pass for zeta and for the Liouville twist alike and say nothing about the zeros of the L-function.

Classification: CLOSED. The object enters through its zeros (symmetric functions of 1/gamma^2), and the statistic uses all of them; but it does not separate any control with a functional equation at the sizes reached, including controls whose off-line zeros are the lowest zeros. It is weaker than the verified-height pattern, not an exception to it.

## 6. Where each object enters, and control onsets against zero heights

| combination | zeta enters through | DH | heat tau < 0 | sign twist | unimodular twist | E_b | T-NR |
|---|---|---|---|---|---|---|---|
| 1 | Phi^2 dt (coefficients); normalisation-dependent | value of a conductor-5 odd kernel to 3%, remainder = b(2) term; no onset; first off-line zero at 85.7 plays no role | linear in tau through 0 | larger a* (narrower kernel); no onset | identical to zeta (unitary equivalence) | 2e-4 change between b = 0.125 and 0.25 | explicit in (q, c^2); smooth across c = 2 |
| 2 | Phi^2 dt | inside the range of the comparison L-functions | odd, linear in tau | outside zeta's family by 0.027 (less than any L-function) | identical | residual 0.056, below every L-function | smooth across c = 2 |
| 3 | not at all (source form); Phi^2 dt (weighted form) | equals its leading theta term to 1e-6 at DEG = 60 | 1 - 0.0056 tau at DEG = 60 | ratio to zeta 1.368 to 1.062, decreasing with DEG | identical | b-independent to 2e-5 | c-independent to 2e-5 (q = 3) at DEG = 60 |
| 4 | zeros (Schur functions of 1/gamma^2); sign of Phi | passes to order 320 (rate 146) | passes to order 320: tau = -2 (rate 27), tau = -0.5 (rate 112), tau = -0.1 (rate 717, not reached) | one-sided only: passes to 160; not a statement about its zeros | fails at order 19 (transform not even) | passes to order 320 (rate 0) | passes to order 320 (rate 0) |

No test here separates a control at a size below the height of its off-line zeros, and none separates DH, E_b, T-NR or backward heat at all.

## 7. Record of the runs after the first pass

- Combination 3 at the task's size (DEG 60, 4000 bits; `out_server/c3.json`): all 31 x 13 loci certified on both sides; a_1 equal to the 1024-bit local run to 6.2e-14 relative. No number of section 4 changed.
- Combination 4 beyond order 80: a first attempt (units `rh-s5-h160-1120092350`, `rh-s5-h160b-1120095344`, 40000 bits, short window) was stopped by this lane before completion (after about 40 and 12 minutes), for two reasons found while it ran: the precision was several times what the determinants need, and the short window is not long enough for moments of index 642 (for DH the integrand at the window edge is about 2^-2140 of the moment, which is not below the roughly 15 x 160 = 2400 bits that the order-160 determinants need). It produced no output and nothing from it is used. The replacement (unit `rh-s5-c4ext-1120100807`, runs C and D of section 5) uses the long window. A run to order 640 (unit `rh-s5-c4ext640-1120100807`, 26000 bits, DH and zeta) was stopped after 31 minutes when its projected time exceeded four hours; not run: orders above 320.
- GPU: one kernel (heat tau = -0.5) was refused memory on the shared card during the main run and was rerun alone (`out_server/c1_gpu_heat05.json`).

## 8. Weakest steps

1. Quadrature truncation is not enclosed. Every integral is a Gauss-Legendre sum whose rounding error is inside the ball; the truncation error is controlled by comparing two node counts (agreement to the full precision of the smaller run in combination 2; identical loci at 128, 256, 1024 and 4000 bits in combination 3; three precisions and two windows in combination 4) and by the validation identities of section 1. The window tails are bounded by hand (below 1e-220 in combinations 1 to 3; below 2^-(prec+200) of each moment in runs C, D, E of combination 4). The signs of combination 4 are therefore MEASURED with decided balls, not certified: a determinant of size 10^-491013 is the result of cancellation, and its sign is trusted because three precisions and two windows agree, not because the tail is enclosed.
2. The explanation of combination 4 (why conjugate pairs of small argument never change the sign of the rectangular Schur function) is argued from the dominant monomials. The determinant identity is proved for finite products; its use for the entire functions here is by continuity of the coefficients, and the measured signs do not depend on it.
3. Combination 1 above the screen: the lower bound L(a) uses a fixed analytic test pair, so the ball bracket (a_G, a_L) is wide for kernels with small a* (chi_-7: 2.293 to 2.694); the Nystrom value inside it is float64 with algebraic convergence in n (differences of 1e-9 to 3e-7 between n = 8192 and 16384). E_b has no ball lower bound (table kernel).
4. "Conductor and kernel decay alone" is implemented as the n = 1 theta term of the same conductor and parity. For E_b and T-NR, which have no single leading term of that form, the comparison is to the matched member (b = 0.125 against 0.25; c = 1.9 against 2.2) and, for T-NR at q = 1000003, to the closed form in zeta's moments.

## 9. Files

`slib.py` (kernels, quadrature), `keys.py`, `selftest.py`; `c1_gpu.py`, `c1_arb.py`, `nr_closed_form.py`; `c2.py`, `c2_fam.py`; `c3.py`; `c4.py`; `analyze.py` (tables); `run_cpu.sh`, `run_gpu.sh` (server launch scripts); `out_server/` (`selftest.txt`, `c1_gpu.json`, `c1_gpu_heat05.json`, `c1_arb.json`, `c2.json`, `c2_fam_lead.json` (computed locally), `c3.json`, `c4.json`, `c4_ext_160.json`, `c4_ext_320.json`); `run_c4ext.sh`, `run_c4ext640.sh`; `out_local/` (local runs: `c3_1024.json` = `c3.json`, `out_local_c1.json`, `out_local_c1arb.json`, `out_local_c2.json`, `out_local_c4*.json`, `c4_ext_80.json`, `c4_ext_160.json`, `c4_probe_*.json` (precision probes), `out_nr_closed_form.txt`).
