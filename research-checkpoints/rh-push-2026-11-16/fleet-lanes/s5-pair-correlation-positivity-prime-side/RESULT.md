# s5-pair-correlation-positivity-prime-side: screening of four combinations (2026-11-20)

Screening arm, slug `s5-pair-correlation-positivity-prime-side`. Four combinations of idea-graph nodes were turned into finite tests and run on zeta, on Dirichlet L-functions (chi_-4, the real and the complex characters mod 5), and on the controls. Labels: PROVED (algebra in this file, checked numerically), CLASSICAL, MEASURED (float64; errors are standard errors over blocks or windows), HEURISTIC (formula from the ratios conjecture / Hardy-Littlewood). Nothing here is a statement about the location of the zeros of zeta.

**Verdict: 4 combinations tested, 0 survivors.**

- Combination 1 (band-limited proportion certificate c(lambda) = 2 - tr G^2 / tr G from the prime side, lambda up to 1.73 with primes to 1e11). The premise holds for zeta at both sizes and is reproduced from the zero side: c = 0.8950 +- 0.0009 (X = 1e9, T = 1e6, lambda = 1.73), 0.8905 +- 0.0010 (X = 1e11, T = 1.85e7, lambda = 1.70), below 1 everywhere. The certificate is a theorem for every object with the functional equation, so Davenport-Heilbronn, zeta(s+a)zeta(s-a) and T-NR cannot fail it and do not (c = -14.1, -0.14, -0.64 against true on-line fractions 0.90, 0, 0.35). Only the objects without functional equation give a number above their on-line fraction, because their matrix is not a sum over zeros (17% to 27% of its eigenvalues are negative).
- Combination 2 (variance of band-limited linear statistics against the prime-side prediction). Zeta and L(chi) follow the diagonal-plus-Conrey-Snaith prediction at every bandwidth W = 2/3 .. 3 at seven heights (residuals at most 2.7e-4, model precision about 1e-4). The source law exp(-4 pi W) is a property of the kernel: the measured tail follows it within 2% for every list, including the on-line lists of DH and of the heat family. No control has a residual that stops falling with W; the controls differ from zeta only at band positions below 1.25 (missing zeros).
- Combination 3 (HL*(k) as a coefficient statement, k = 2, 3, 4, shifts to 1e4, X to 1e11). Zeta: relative error against the singular series falls like X^(-0.44), rms error (0.71 .. 0.79) sqrt(X) log X over 5000 shifts. L(chi) passes in the form with conjugates. The Liouville sign twist has zeta's correlations for even k and their negatives for odd k; T-NR differs from zeta in O(1) terms; random sign and unimodular twists have no main term; DH has unbounded coefficients (max abs c(n) grows like n^0.78) and no power saving. T-NR and the Liouville twist are not separated.
- Combination 4 (lower tail of the Lehmer functional D^2 G and minimum gap). Zeta: exponent 1.47 .. 1.51 (3/2) and -0.32 .. -0.34 (-1/3) on 1.06e8 zeros; L(chi): the same. DH and the heat lists: 1.00 .. 1.07 and -0.48 .. -0.51, visible from about 1e4 zeros. Below 0.8 times the first off-line height the controls have 33, 158 and 25 zeros and no event in the tail; T-NR has zeta's on-line list.

Results that are new relative to the nodes are listed in section 6.

## 0. Objects, lists, code, server use

Objects. ZETA; CHI4 = L(s, chi_-4); CHI5R = L(s, (./5)); CHI, CHIBAR = complex characters mod 5 (zero lists); DH = Davenport-Heilbronn (coefficients 1, kappa, -kappa, -1, 0 mod 5; first off-line zero 0.8085 + 85.699i; on-line fraction 0.9023 below 7e4, 0.8940 below 1e6, s1 lane); HEAT = backward heat deformation (Riemann-Siegel model lists at T0 = 1e8, tau = -0.005, -0.02, -0.08; battery tables below 2000 for tau = -0.1, -0.5); EA:a = zeta(s+a) zeta(s-a), a = 0.02 and 0.1; TNR:q = zeta(s)(1 + 2.2 q^(1/2-s) + q^(1-2s)), q = 1000003 (pairs at depth 0.0321, spacing 0.4548 in height, first at height 0.227) and q = 3 (depth 0.404); LIOU = sign twist eps(p) = -1; RSGN = signs +-1 at the primes from a hash of p; UNI = unimodular phases at the primes from a hash of p.

Lists (compute server, read-only). Zeta: Z0 = first 2,000,403 zeros above 1000; blocks Z7 (4.02e6 zeros at 1e7), Z8 .. Z12 (2.0e7 zeros each at 1e8 .. 1e12): 1.06e8 zeros. The task names 1e8 zeros near 1e12; the list there holds 2.0e7, the other 8.6e7 are at lower heights. CHI, CHIBAR: 1.99e6 zeros each in [1e4, 1e6]. DH on-line: 1.78e6 in [1e4, 1e6] (1.79e6 from height 5). HEAT: 1.97e6, 1.80e6, 1.16e6 on-line zeros. No list of L(chi_-4) exists; chi_-4 and the real character mod 5 were run on the prime side, the complex characters mod 5 on the zero side.

Code (this directory; local runs through `scripts/memcap.sh 8`; server runs through `rhrun`).

| file | role | known-answer check |
|---|---|---|
| `ff.py`, `test_ff.py`, `summarize_ff.py` | tapered periodogram of a list of unfolded ordinates (cells 1/32, Taylor moments to order 9, FFT); kernel integrals Q_g = int g(alpha) I(alpha) = weighted pair sum; prediction from the Bogomolny-Keating / Conrey-Snaith two-point function (`rmt.py` of the s1/s3 lanes); Landau sums | FFT against the direct pair sum, 2048 points, 24 kernels: 5.6e-5 (periodisation at twice the block); Poisson points: R_lambda = 1/lambda + 1 within 1 se at 10 values; closed forms of the sine process; 199,351 zeta zeros: 24 kernels within 2.4 se of the prediction |
| `psnu.py`, `test_psnu.py` | E(nu_a) = sum_{n<=X} c(n) n^(-1/2 + i nu_a) and its log-weighted companion on the critical grid for several families in one pass over the primes (segmented sieve; cells of size 1/(16 n) in log n / log X, Taylor moments to order 10, FFT; phases reduced in 80-bit long double); DH coefficients by a block divisor recursion | against the direct sum (`w3.dirichlet_sums`), X = 2e5, 512 nodes, 8 families: 2e-11 .. 5e-11 at nu = 1234, 2e-7 at nu = 1e7 (the reference there uses float64 phases); DH recursion against `w3.dh_logder`: 1.4e-14; number of odd primes found below 1e11: 4,118,054,812 = pi(1e11) - 1 |
| `cert.py`, `test_cert.py`, `summarize_cert.py` | matrix G of the m23 certificate from E, D (formulas of `w3.py`, s3 lane), windows of 4096 nodes: tr G, tr G^2, eigenvalues; zero-side matrix from a list | prime side against zero side: zeta 7e-6 .. 1.2e-5 per entry at X = 3183 .. 1e6 (local) and at X = 1e9 and 1e11, T = 1e7 .. 1e11 (server; tr G^2 agrees to 2e-5 relative); EA with complex ordinates gamma -+ ia: 1.4e-5 .. 2.4e-5 |
| `hl.py`, `hl_analyse.py`, `test_hl.py`, `hl_dh.py` | C_k(H; X) by FFT cross-correlation per segment (k = 2, all even h <= 1e4) and by gathering (k = 3, 4); singular series; parts merged by checkpoint | FFT against the direct sum at h = 2, 6, 30, 210, 9998: differences 0 .. 2e-8 on sums of 4e7 .. 1.4e8; triple (0,2,6) identical; S(0,2,6) = 2.858249, S(0,2,6,8) = 4.151181 (literature 2.8582486, 4.1511809); two parts reproduce the full run exactly; DH: FFT against the direct sum to 16 digits |
| `lehmer.py`, `lehmer_local.py`, `summarize_lehmer.py` | D^2 G with 64 neighbours on each side plus the tail; Hill estimators; minimum-gap exponents; matched block sizes; control tables below 2000 | G against a brute-force sum: 1e-4 relative; Hill estimator on samples with exponents 3 and 2: 2.995, 2.001; independent gaps with the Wigner surmise: -0.325 +- 0.009 |

Server use. Units (all stopped): `rh-s5psA-1120075203` (4 workers, peak 6.9 GB, 65 min of sieve and 13 min of eigenvalues: all primes below 1e11, ten family / height combinations), `rh-s5psB-1120082139` (1 core, peak 3.9 GB: X = 1.2e7, X = 1e9, DH to 1e8), `rh-s5ffA-1120075203`, `rh-s5ffB-1120075203` (1 core each), `rh-s5hl0..5-*`, `rh-s5hq6,14,22,7,15,23-*` (1 core each, 0.8 GB: the 11,935 segments of the correlation run in 12 parts), `rh-s5hla-*` (merge; the first start failed on a file not yet written). Two units (`rh-s5hl0-1120075318`, `rh-s5hl1-1120075318`) were stopped after 8 minutes and one (`rh-s5hl6-1120090549`) after 1 minute and restarted with a reduced set of objects above 1e10 and with a finer split. At most 8 cores at one time; memory in use at most about 10 GB (limits requested: 7 + 3 + 3 + 2 x 2 at the start). Other lanes run units named `rh-s5-*`, `rh-s5c1-*`, `rh-s5g-*`, `rh-s5arbA-*`; they were not touched. GPU 1 was at 100% utilisation with 45 GB held by other jobs and was not used; everything is float64 on the CPU. No sign or inertia is reported as certified.

Reductions against the task text: the prime side reached 1e11 as asked; the list side has 1.06e8 zeta zeros in total (2.0e7 at 1e12); k = 2 correlations of the characters mod 5 and of the unimodular twist stop at X = 1e10 (zeta and the random sign twist go to 1e11); DH coefficients stop at 1e8 (all integers, 0.8 GB); the lower-order coefficients in the HL sums use odd primes only (prime powers change C_k by O(sqrt(X) log^k X), the size of the conjectured error).

## 1. Table

Cells: P = follows the family prediction within the stated error; F = differs; = means identical to zeta by construction; N = not formulable.

| # | combination | statistic | sizes reached | zeta | L-functions | zeta(s+a)zeta(s-a) | T-NR | DH | HEAT | sign twist | unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | m23-poisson-reproducing-identity + m23-real-u-positivity-certificate + m23-ceiling-68185 + m23-discontinuous-input-requirement | c(lambda) = 2 - tr G^2/tr G, G the bandwidth-lambda Gabor matrix built from the coefficients n <= X = (N (T/2 pi)^d)^lambda; zero side: 2 - (weighted pair sum of sinc^2(pi lambda x)) | prime side: X = 1e11 (4.118e9 primes), 32768 nodes per height, T = 1.4e4 .. 1e11; X = 1e9; X = 1.2e7; DH X = 4.3e4 .. 1e8. Zero side: 1.06e8 zeros to 1e12 | prime side: 0.8950 +- 0.0009 (lambda = 1.73, X = 1e9), 0.8905 +- 0.0010 (1.70, X = 1e11), 0.8622, 0.8169, 0.7684, 0.7195 at lambda = 1.53, 1.34, 1.19, 1.08; no negative eigenvalue in 74 windows. Zero side at 1e12, lambda = 1, 1.04, 1.26, 1.70: 0.67065, 0.69563, 0.79265, 0.88609 (+- 9e-5; sine process 0.66667, 0.69181, 0.79004, 0.88466). Below 1: P | CHI4, CHI5R, prime side X = 1e11: 0.8683 +- 0.0013 (lambda = 1.56), 0.8637 +- 0.0020 (1.54), no negative eigenvalue. CHI, CHIBAR zero side: 0.6873 / 0.6875, 0.7118 / 0.7119, 0.8041 / 0.8044, 0.8924 / 0.8925 (prediction 0.6874, 0.7119, 0.8043, 0.8925): P | a = 0.02: c = -0.141 (lambda = 1.65, X = 1e11) and -0.141 (1.34, X = 1e9); a = 0.1: -1.34. True fraction 0: no contradiction (theorem) | q = 1000003: c = -0.64 at its own lambda = 0.60 (X = 1e11), -0.82 at 0.52 (X = 1e9); true fraction 0.35, 0.30. lambda > 0.78 would need X > 1e11. q = 3: c = -661 at lambda = 1.68; true 0.77. No contradiction (theorem) | own coefficients, window [5e4, 5.8e4]: c = 0.293, 0.180, -0.716, -3.76, -14.1 at lambda = 1.00, 1.08, 1.30, 1.51, 1.73; true 0.90. No contradiction (theorem) | N on the prime side (no Dirichlet series); on-line lists: section 2.4 | LIOU: 0.8902 +- 0.0011 at lambda = 1.70 (zeta: 0.8905), 5931 negative eigenvalues of 32768; RSGN: 0.8516 +- 0.0029, 5606 negative. No functional equation: the number is not a count of zeros | 0.8561 +- 0.0027, 5620 negative | CLOSED. A theorem for every object with the functional equation; equal to a pair sum over zeros; certifies 1 - 1/(3 lambda^2) at the cost of primes to T^lambda |
| 2 | esy-variance-gap-law + esy-rigidity-psi-n + costin-lebowitz-variance + per-window-excess-gaussian | V_W = int (1 - abs(alpha)/W)^2 F(alpha) d alpha (variance of the Fejer linear statistic of bandwidth W), band tents of F, and the tail int_{abs(alpha) > W} e^(-4 pi abs(alpha)) F; residual against (i) GUE + diagonal prime term, (ii) + Conrey-Snaith term | 7 zeta lists (1.06e8 zeros), CHI, CHIBAR, DH on-line, 3 heat lists; blocks of 32768 zeros, alpha <= 3.6 | residual (ii) at W = 2/3, 1, 4/3, 2, 3: at most 2.7e-4 in absolute value at seven heights (errors 3e-6 .. 2.8e-4); residual (i) grows with W: +2.7e-4, +1.1e-3, +2.0e-3 at W = 4/3, 2, 3 at 1e12 (+6.9e-4, +4.9e-3, +1.0e-2 on the first 2e6 zeros). Tail over the F = 1 value: 1.0008, 1.013, 0.9989, 0.9995 at W = 2/3, 1, 4/3, 2 (1e12): P | CHI, CHIBAR: residual (ii) at most 3.2e-4 (errors 1.4e-4 .. 3.2e-4); (i): +1.2e-3, +6.2e-3, +1.2e-2. Tail ratios 0.999, 1.04, 1.00, 1.00: P | N for a list (no on-line zero); prime side: row 1 | on-line list = zeta's. Own coefficients predict an atom of weight 924.8/L^2 in F at alpha = log q / L; measured Landau amplitude at x = 1000003 and 999983: 0.973 +- 0.069 times Lambda(x) (T-NR: 2201 times): F at the single prime q | on-line list: residual (ii) +0.034 .. +0.075; band tents 0.0825, 0.1520, 0.2462, 0.4620 at 0.25, 0.5, 0.75, 1 (prediction 0.0731, 0.1637, 0.2493, 0.3408); tail ratios 1.000, 1.257, 0.989, 0.997: falls with W as for zeta | residual +0.011 .. +0.39; tail ratios 1.04 .. 1.20 at W = 2/3, 0.96 .. 1.005 at 1, 0.98 .. 0.997 at 4/3 and 2 | prime side (row 1): LIOU has zeta's second moment; RSGN lacks the off-diagonal term above band 1 | as RSGN | CLOSED. Below band 1 the statistic reads abs(c(n))^2, above 1 the correlations c(n) c(n+h) of row 3; the exp(-4 pi W) law holds for every list |
| 3 | af-hl-star-hierarchy + band-limited-amplitude-mismatch + triple-correlation-data + zpo-pair-correlation-gue | C_k(H; X) = sum_{n<=X} c(n) c*(n+h_1) ..., k = 2 (5000 even shifts to 1e4), k = 3 (12 triples), k = 4 (9 quadruples), 17 checkpoints | X = 1e11 (zeta, RSGN; k = 3, 4 all objects), 1e10 (characters mod 5, UNI, k = 2), 1e8 (DH) | k = 2: rms relative error 2.09e-3, 7.3e-4, 2.7e-4, 9.3e-5, 3.4e-5 at X = 8.4e6, 1e8, 1e9, 1e10, 1e11; exponent -0.440; rms error / (sqrt X log X) = 0.71 .. 0.79. k = 3: relative error 1.7e-5 .. 3.7e-4 at 1e11; k = 4: 4.0e-5 .. 7.9e-4: P | conjugate form, chi mod 5 complex: main term S(h) m_chi(h) X, exponent -0.439; real character -0.433; plain form: main term for h not divisible by 5, none for 5 dividing h (abs C = 22 sqrt X). chi_-4: (-1)^(h/2) times zeta for k = 2; no main term for k = 3; zeta's for k = 4: P with conjugates | main term S(h) int (x^a + x^-a)^2 by partial summation from zeta: P in its own form (not run separately) | = zeta up to the O(log^2 X) terms at n = q, q +- h | main-term-like values C_2(h; X)/X = 0.09, -1.6, 3.6, 7.2, 6.6 at h = 1, 2, 10, 30, 210 that move by 3% to 50% between X = 3.4e7 and 1e8; sum c(n)^2 grows like X^1.68, max abs c(n) like X^0.78: F (no power saving) | N (no coefficients) | LIOU: (-1)^k times zeta: P for every k. RSGN: no main term, rms abs C_2 / (sqrt X log X) = 1.31 .. 1.37 | no main term, rms abs C_2 = 20.8 .. 31.4 sqrt X | CLOSED. Separates DH (through the size of its coefficients) and the random twists (through the absence of a main term), not LIOU, T-NR, EA |
| 4 | min-gap-exponent + edge-statistics-deviation + local-count-extreme-value-tail + gue-spacing-fidelity-at-peak + csv-lehmer-criterion | Hill exponent of the lower tail of q = D^2 G (expected 3/2) and of the gaps (3); slope of mean log(minimum gap of a block) against log(block size) (-1/3); matched block sizes | 1.06e8 zeta zeros; CHI, CHIBAR; DH on-line; 3 heat lists; control tables below 2000 | q below 0.05: 1.505, 1.510, 1.495, 1.499, 1.511, 1.490, 1.500 (errors 0.010 .. 0.031); gaps below 0.2: 2.953 .. 2.979; block minimum-gap slope -0.339, -0.332, -0.334, -0.318, -0.335, -0.326, -0.320 (errors 0.004 .. 0.012); ladder slope of the node: -0.24 .. -0.39 on 15 to 18 rungs: P | 1.502 +- 0.032, 1.527 +- 0.032; 2.972, 2.974; -0.327 +- 0.007, -0.332 +- 0.009: P | N (no on-line zero) | on-line list = zeta's; with its pairs G changes by terms of the size of zeta's G (section 5.3) | 1.003 +- 0.016; gaps 2.07; slope -0.482 +- 0.010: F from about 1e4 zeros. Below 0.8 x 85.7: 33 zeros, minimum gap 0.263 (zeta blocks of 32 gaps: 0.098 .. 0.483), no event | 0.997, 0.998, 0.994; slopes -0.499, -0.479, -0.514: F. Tables below 0.8 x first off-line height: 158 and 25 zeros, no event below 0.2; gap variance 0.238 against 0.146 .. 0.182 for zeta blocks (tau = -0.1) | N (LIOU: rescaled list of zeta) | N | CLOSED. A statistic of the on-line list; the difference is the count of missing zeros (pattern 18) and needs about 300 times the number of zeros below the first off-line height |

Survivor criterion: zeta passes at every size; every control fails at a size much smaller than the height of its off-line zeros explains, or for a reason that does not use the resolution of zeros; all primes together. Row 1: no control with the functional equation can fail. Row 2: T-NR differs at one prime, DH and HEAT through missing zeros. Row 3: LIOU, T-NR and EA pass. Row 4: T-NR has zeta's list; DH and HEAT need thousands of zeros.

How the object enters. Row 1: through its coefficients n <= X, and the same number is a sum over pairs of zeros (identity, checked to 1e-5 per matrix entry at X = 1e11). Row 2: through its zeros (lists); the prediction through abs(c(n))^2 below band 1 and through c(n) c(n+h) above. Row 3: through its coefficients only. Row 4: through its on-line zeros only.

## 2. Combination 1: the proportion certificate at bandwidth above 1

### 2.1 Statement tested (PROVED, given the rank-trace lemma of the m23 source)
Box window on [-L/2, L/2], L = log X, nodes nu_a = nu_0 + 2 pi a / L. G = sum over all zeros of u_rho u_rho^T, u_rho(a) = sinc(pi(y_rho - a)), y_rho = (gamma_rho - nu_0) L / 2 pi with gamma_rho = (rho - 1/2)/i complex off the line. The reproducing identity sum_a sinc(pi(z - a)) sinc(pi(z' - a)) = sinc(pi(z - z')) holds for complex z, z' (node m23-poisson-reproducing-identity). Consequences on the infinite grid:
- an on-line zero contributes a rank-one positive block of trace 1; an off-line pair contributes 2 Re(u u^T) = 2(a a^T - b b^T) with trace 2 (abs(a)^2 - abs(b)^2 = Re sinc(0) = 1) and one positive direction;
- tr G = number of zeros; tr G^2 = sum over pairs of zeros of sinc^2(pi(y - y'));
- rank-trace lemma: rank P >= 2 tr P + 4 tr Q - 4 n_+(Q) - tr G^2 with P the on-line part and Q the off-line part, hence

  number of distinct on-line zeros >= 2 tr G - tr G^2, certified proportion c = 2 - tr G^2 / tr G.

The prime side gives G exactly from the coefficients n <= X (formulas of `w3.py`: POLE + ARCH - PRIME, a Loewner matrix in the values E(nu_a)). The bandwidth is lambda = L / log(N (T/2 pi)^d) for the family's own density. For the sine process tr G^2 / tr G = 1/lambda + lambda/3 (lambda <= 1) and 1 + 1/(3 lambda^2) (lambda >= 1); if the form factor continued as abs(alpha) past 1 (no cancellation from correlations of the coefficients at distinct integers) the value would be 1/lambda + lambda/3 at every lambda. So the test at lambda > 1 is: does the object's own prime sum, computed exactly to X, produce 1 + 1/(3 lambda^2).

The statement uses only the conjugation symmetry of the multiset of ordinates. It is a theorem for zeta, L(chi) with its conjugate pairing, DH, EA, T-NR. "Fail = certificate above the true on-line proportion" can therefore occur only for an object without functional equation, where G is not a sum over zeros.

### 2.2 Zeta: the premise at two sizes (MEASURED)

Prime side, windows of 4096 nodes (8 per height), error = standard error over the windows:

| X | T | lambda | tr G per node (1/lambda) | tr G^2 / tr G | c | sine value | no off-diagonal | negative eigenvalues | zero-side check |
|---|---|---|---|---|---|---|---|---|---|
| 1.2e7 | 1.16e4 | 2.169 | 0.4612 (0.4610) | 1.0632 +- 0.0012 | 0.9368 | 0.9291 | 0.8160 | 0 of 8192 | - |
| 1e9 | 1.005e6 | 1.729 | 0.5782 (0.5782) | 1.1050 +- 0.0009 | 0.8950 | 0.8886 | 0.8453 | 0 of 32768 | - |
| 1e9 | 1.001e7 | 1.451 | 0.6891 | 1.1520 +- 0.0012 | 0.8480 | 0.8417 | 0.8272 | 0 | list at 1e7: entries 9.3e-6, tr G^2 3256.720 / 3256.672 |
| 1e9 | 1e8 | 1.250 | 0.8002 | 1.2069 +- 0.0015 | 0.7931 | 0.7866 | 0.7832 | 0 | list at 1e8: 1.1e-5, 3967.103 / 3967.038 |
| 1e9 | 1e9 | 1.097 | 0.9113 | 1.2719 +- 0.0012 | 0.7281 | 0.7232 | 0.7229 | 0 | list at 1e9: 1.2e-5, 4741.662 / 4741.577 |
| 1e11 | 1.85e7 | 1.700 | 0.5881 (0.5881) | 1.1095 +- 0.0010 | 0.8905 | 0.8847 | 0.8451 | 0 of 32768 | - |
| 1e11 | 1e8 | 1.527 | 0.6547 | 1.1378 +- 0.0010 | 0.8622 | 0.8571 | 0.8362 | 0 | list at 1e8: 8.8e-6, 3062.960 / 3062.916 |
| 1e11 | 1e9 | 1.341 | 0.7456 | 1.1831 +- 0.0015 | 0.8169 | 0.8147 | 0.8073 | 0 | list at 1e9: 1.0e-5, 3613.153 / 3613.096 |
| 1e11 | 1e10 | 1.195 | 0.8365 | 1.2316 +- 0.0017 | 0.7684 | 0.7667 | 0.7650 | 0 | list at 1e10: 1.1e-5, 4236.850 / 4236.778 |
| 1e11 | 1e11 | 1.078 | 0.9274 | 1.2805 +- 0.0011 | 0.7195 | 0.7133 | 0.7131 | 0 | list at 1e11: 1.3e-5, 4876.151 / 4876.061 |

The smallest eigenvalues are -1e-11 .. -5e-8 (round-off of a matrix with entries of order 1 and dimension 4096; not certified). The zero-side matrices use the listed zeros within 6000 nodes of the window; the entry differences are the truncation of that sum.

Zero side, all lists (box window in u, Hann taper in height over blocks of 32768 zeros; `ff.py`), c(lambda) with its standard error, and the value predicted by the Bogomolny-Keating / Conrey-Snaith two-point function:

| list | L | lambda = 1 | 1.04 | 1.26 | 1.70 | 2 | 3 | largest abs(measured - predicted) over 10 values of lambda |
|---|---|---|---|---|---|---|---|---|
| first 2e6 | 11.19 | 0.68357 +- 0.00030 | 0.70831 | 0.80254 | 0.89154 | 0.92171 | 0.96517 | 1.1e-4 |
| 1e7 | 14.36 | 0.67800 +- 0.00011 | 0.70285 | 0.79820 | 0.88928 | 0.92003 | 0.96447 | 2.1e-4 |
| 1e8 | 16.62 | 0.67545 +- 0.00006 | 0.70035 | 0.79616 | 0.88805 | 0.91911 | 0.96404 | 5.2e-5 |
| 1e9 | 18.89 | 0.67382 +- 0.00007 | 0.69874 | 0.79498 | 0.88737 | 0.91866 | 0.96385 | 1.4e-4 |
| 1e10 | 21.19 | 0.67241 +- 0.00007 | 0.69737 | 0.79399 | 0.88681 | 0.91821 | 0.96365 | 6.1e-5 |
| 1e11 | 23.49 | 0.67158 +- 0.00008 | 0.69655 | 0.79338 | 0.88649 | 0.91797 | 0.96352 | 1.4e-4 |
| 1e12 | 25.79 | 0.67065 +- 0.00009 | 0.69563 | 0.79265 | 0.88609 | 0.91772 | 0.96347 | 1.0e-4 |
| sine process | | 0.66667 | 0.69181 | 0.79004 | 0.88466 | 0.91667 | 0.96296 | |

The certificate is below 1 at every size and equals the sine value plus a positive arithmetic term, 2.6/L^2 at lambda = 1 and 0.3/L^2 at lambda = 3 at 1e12 (2.1/L^2 and 0.3/L^2 on the first 2e6 zeros). The source values (0.70, 0.80, 0.90 at bandwidth 1.04, 1.26, 1.70; 0.6818287 at 1) are for the optimal window; the box window gives 0.6956, 0.7927, 0.8861 at 1e12 and 2/3 at lambda = 1 in the limit. The model reproduces the 70 measured values within 2.1e-4; the differences at lambda = 0.5 are 5e-5 to 1.4e-4 with standard errors of 2e-6 to 3e-5, which is the precision of the model as coded (prime products cut at 1e6, r-integral cut at 60), not a deviation of the zeros.

### 2.3 Controls on the prime side (MEASURED)

| object | X | T | lambda (own density) | tr G^2 / tr G | c | true on-line fraction | negative eigenvalues |
|---|---|---|---|---|---|---|---|
| CHI4 | 1e11 | 1.85e7 | 1.556 | 1.1317 +- 0.0013 | 0.8683 (sine 0.8623) | 1 | 0 of 32768 |
| CHI5R | 1e11 | 1.85e7 | 1.535 | 1.1363 +- 0.0020 | 0.8637 (sine 0.8585) | 1 | 0 |
| CHI4, CHI5R | 1e9 | 1.005e6 | 1.550, 1.525 | 1.1297, 1.1350 | 0.8703, 0.8650 | 1 | 0, 0 |
| EA:0.02 | 1e11 | 1.4e4 | 1.646 | 2.1411 +- 0.0025 | -0.141 | 0 | 9964 of 32768 |
| EA:0.02 | 1e9 | 1.5e4 | 1.337 | 2.1414 +- 0.0027 | -0.141 | 0 | 12268 |
| EA:0.1 | 1.2e7 | 1.16e4 | 1.084 | 3.3410 +- 0.0004 | -1.341 | 0 | 3778 of 8192 |
| TNR:1000003 | 1e11 | 1.85e7 | 0.596 | 2.6415 +- 0.0040 | -0.64 | 0.350 | 3376 of 32768 |
| TNR:1000003 | 1e9 | 1.005e6 | 0.523 | 2.8226 +- 0.0011 | -0.82 | 0.302 | 1954 |
| TNR:3 | 1.2e7 | 1.16e4 | 1.678 | 662.6 +- 3.3 | -661 | 0.774 | 561 of 8192 |
| DH | 4.3e4 | 5.4e4 | 1.001 | 1.707 +- 0.006 | 0.293 | 0.90 | 592 of 12288 |
| DH | 1e5 | 5.4e4 | 1.080 | 1.820 +- 0.017 | 0.180 | 0.90 | 545 |
| DH | 1e6 | 5.4e4 | 1.296 | 2.72 +- 0.12 | -0.72 | 0.90 | 611 of 16384 |
| DH | 1e7 | 5.4e4 | 1.511 | 5.76 +- 0.34 | -3.76 | 0.90 | 659 of 20480 |
| DH | 1e8 | 5.4e4 | 1.728 | 16.1 +- 1.3 | -14.1 | 0.90 | 579 of 20480 |
| LIOU | 1e11 | 1.85e7 | 1.700 | 1.1098 +- 0.0011 | 0.8902 | no zero on the line (poles there) | 5931 of 32768 |
| LIOU | 1e9 | 1.005e6 | 1.729 | 1.1048 +- 0.0009 | 0.8952 | same | 6214 |
| RSGN | 1e11 | 1.85e7 | 1.700 | 1.1484 +- 0.0029 | 0.8516 | no functional equation | 5606 |
| RSGN | 1e9 | 1.005e6 | 1.729 | 1.1435 +- 0.0025 | 0.8565 | same | 5737 |
| UNI | 1e11 | 1.85e7 | 1.700 | 1.1439 +- 0.0027 | 0.8561 | same | 5620 |
| UNI | 1e9 | 1.005e6 | 1.729 | 1.1444 +- 0.0023 | 0.8556 | same | 5715 |

Reading.
- Positive comparisons: chi_-4 and the real character mod 5 behave like zeta (value above the sine value by the arithmetic term, no negative eigenvalue).
- Controls with the functional equation: the certificate is far below the true fraction in every case, as the theorem requires. The deficit is the over-payment of the off-line pairs in tr G^2: a pair at depth beta contributes 2(1 + Phi(2 i beta)^2) with Phi(2 i beta) = sinh(beta L)/(beta L). For DH tr G^2/tr G grows like X^0.39 between 1e6 and 1e8 (2.7, 5.8, 16.1): the certificate moves away from the truth as the bandwidth grows. The quantity governing this is beta L, depth times log of the prime cutoff, for the pairs inside the window (545 to 659 negative directions in windows that hold about 680 pairs, from the on-line fraction 0.90: the count of negative directions follows the count of pairs): this is resolution of the off-line zeros in the depth direction, the mechanism measured in the s3 and s4 lanes at lambda <= 1.
- T-NR at q = 1000003: its own density is log(T/2 pi) + 2 log q, so primes to 1e11 reach only lambda = 0.60 at T = 1.85e7 and at most 0.78 at T = 1e3. The bandwidths 1.04, 1.26, 1.70 of the task are out of reach for this control (they need X = e^(1.7 x 43) at T = 1.85e7).
- Objects without functional equation: the number 2 - tr G^2/tr G is 0.85 to 0.89 at lambda = 1.7 (0.83 to 0.94 at lambda = 2.17, X = 1.2e7) although no zero of the object is on the line. This is the only "certificate above the truth" in the table and it has a trivial reason: G has 17% to 19% negative eigenvalues at lambda = 1.7 and 23% to 27% at lambda = 2.17 (min -1.0 .. -1.5), so it is not a sum of the blocks the lemma assumes. LIOU has zeta's tr G^2 to 3e-4 because c(p) c(p') is unchanged by a common sign; RSGN and UNI sit at 1.144 .. 1.148, between the sine value 1.115 and the value without off-diagonal correlations 1.155 minus the diagonal arithmetic term: the difference from zeta (0.039 +- 0.003 at X = 1e11, 0.039 +- 0.003 at X = 1e9) is the contribution of the correlations of Lambda at distinct integers (row 3) to the form factor between 1 and lambda.

### 2.4 On-line lists of DH and HEAT (zero side; not the certificate)
The pair sum over the on-line zeros alone, unfolded by the family's counting function, gives 2 - R = 0.762 (DH, lambda = 1), 0.912 (lambda = 1.7); HEAT: 0.663, 0.660, 0.755 at lambda = 1 for tau = -0.005, -0.02, -0.08. These are not certificates (the off-line zeros are left out of the sum), and they are above or below the zeta values without a rule; they are recorded for row 2.

### 2.5 Classification
CLOSED. (a) The inequality is unconditional for every object with the functional equation, so it cannot separate DH, EA, T-NR, HEAT from zeta by a contradiction. (b) For zeta it certifies 1 - 1/(3 lambda^2) + O(1/L^2) of the zeros in a window at height T from the primes below (T/2 pi)^lambda; a proportion p needs lambda = (3(1 - p))^(-1/2), for example lambda = 5.8 for 99%, against a cost T^(1+o(1)) for locating every zero in the window. (c) The number equals a pair sum over the zeros (checked to 2e-5 relative in tr G^2 at X = 1e11), so the object enters through its coefficients and through its zeros at once; no input discontinuous at depth 0 (node m23-discontinuous-input-requirement) appears: a pair at depth beta changes tr G^2 by 2(Phi(2 i beta)^2 - 1), continuous at beta = 0.

## 3. Combination 2: variance of band-limited linear statistics

### 3.1 Test
I(alpha) = abs(sum_j w_j e^(-2 pi i alpha x_j))^2 / sum w_j^2 on blocks of 32768 unfolded zeros (Hann taper), alpha <= 3.6. For an even kernel g, Q_g = int g I equals the weighted pair sum of r = transform of g (identity; it is the positivity int h abs(S_I)^2 >= 0 of the m23 source with h = g >= 0). Kernels: Fejer squared g = (1 - abs(alpha)/W)_+^2 (the variance of the linear statistic sum_j W sinc^2(pi W (x_j - y)) of bandwidth W, connected part); tents of half-width 1/6 centred at c = 0.25 .. 3; and e^(-4 pi abs(alpha)) restricted to abs(alpha) > W (the Poisson kernel at one mean spacing: the object of the source law). Prediction (HEURISTIC): Q_g = g(0) + int g min(abs(alpha), 1) + (2/(pi L)) int_0^60 r(L r / 2 pi) Re[D(r) + e^(-i r L) z(r)] dr, with D(r) = sum_n abs(c(n))^2 cos(r log n)/n + 1/r^2 (diagonal; depends on abs(c(n))^2 only) and z(r) = zeta(1+ir) zeta(1-ir) A(ir) - 1/r^2 (off-diagonal, from the Hardy-Littlewood correlations of the coefficients; conductor factors as in the s1 lane).

### 3.2 Zeta and L(chi) (MEASURED)

Fejer variance, residual = measured - predicted, (i) with the diagonal term only, (ii) with both terms; standard error in brackets:

| list | W = 2/3 (ii) | W = 1 (ii) | W = 4/3 (i) / (ii) | W = 2 (i) / (ii) | W = 3 (i) / (ii) |
|---|---|---|---|---|---|
| first 2e6 | +4e-6 (1e-4) | -7e-6 (1.8e-4) | +6.9e-4 / +4e-6 (2.4e-4) | +4.9e-3 / +7.5e-5 (2.8e-4) | +1.0e-2 / +5.7e-5 (2.8e-4) |
| 1e7 | +4e-7 (3e-6) | -3.6e-5 (3.6e-5) | +4.2e-4 / -8.2e-5 (8.1e-5) | +2.9e-3 / -2.1e-4 (1.3e-4) | +5.8e-3 / -2.7e-4 (1.4e-4) |
| 1e8 | +7e-7 (3e-6) | -2e-6 (2.3e-5) | +4.2e-4 / +1.8e-5 (4.4e-5) | +2.4e-3 / +1.2e-5 (6.6e-5) | +4.7e-3 / +2.4e-5 (7.2e-5) |
| 1e9 | -2.1e-5 (7e-6) | -6.3e-5 (3.0e-5) | +2.6e-4 / -7.9e-5 (5.0e-5) | +1.8e-3 / -7.6e-5 (6.9e-5) | +3.5e-3 / -9.8e-5 (7.3e-5) |
| 1e10 | -7e-7 (1e-5) | +9e-6 (3.4e-5) | +2.8e-4 / -2e-6 (5.4e-5) | +1.5e-3 / +1.0e-5 (7.2e-5) | +2.9e-3 / +2.5e-5 (7.8e-5) |
| 1e11 | -3.7e-5 (1.4e-5) | -6.6e-5 (4.1e-5) | +1.5e-4 / -9.4e-5 (6.1e-5) | +1.2e-3 / -9.1e-5 (7.7e-5) | +2.3e-3 / -3.1e-5 (8.0e-5) |
| 1e12 | +7e-6 (1.6e-5) | +3.0e-5 (4.3e-5) | +2.7e-4 / +6.5e-5 (6.3e-5) | +1.1e-3 / +8.8e-5 (7.8e-5) | +2.0e-3 / +1.5e-5 (8.0e-5) |
| CHI | +2e-6 (1.4e-4) | +2.6e-5 (2.3e-4) | +1.2e-3 / +9.7e-5 (3.0e-4) | +6.2e-3 / +2.1e-4 (3.2e-4) | +1.2e-2 / +3.2e-4 (3.1e-4) |
| CHIBAR | +2e-6 (1.4e-4) | -1.5e-5 (2.3e-4) | +1.1e-3 / -6.1e-5 (2.7e-4) | +6.0e-3 / -1.9e-5 (2.7e-4) | +1.2e-2 / +5.4e-5 (2.4e-4) |

- Up to W = 1 the diagonal term alone is the prediction and the residual is zero within the errors (largest 3 se at 1e9, 2.1e-5): the measured variance is sum abs(c(n))^2/n-weighted, the round-4 pattern 31.
- Past W = 1 the residual against the diagonal term alone does not fall with W; it grows (as 1/L^2 times a function of W) and is removed by the Conrey-Snaith term to within 3.2 se in every cell. That term is built from the correlations of the coefficients at distinct integers.
- Band tents (expected 1/3 past 1.5): at 1e12, 0.08190, 0.16656, 0.24995, 0.32757, 0.33337, 0.33306, 0.33328, 0.33335, 0.33333 at c = 0.25 .. 3 (prediction 0.08187, 0.16657, 0.24999, 0.32724, 0.33353, 0.33333, ...; errors 2e-5 .. 2.5e-4). Of the 63 zeta cells two exceed 3 se (c = 0.25 at 1e8 and 1e11, differences of at most 6e-5: the model precision).

Source law. The node's residual is the part of int e^(-4 pi abs(alpha)) min(abs(alpha), 1) beyond W: 2 e^(-4 pi W)/(4 pi) for W >= 1, a factor 4351 per step of 2/3. Measured tail over this value:

| list | W = 2/3 | 1 | 4/3 | 2 |
|---|---|---|---|---|
| zeta, seven lists | 0.9940 .. 1.0015 | 1.0133 .. 1.0281 (falling with height) | 0.9967 .. 1.0006 | 0.9993 .. 1.0028 |
| CHI, CHIBAR | 0.9989, 0.9986 | 1.042, 1.039 | 0.9995, 1.0073 | 0.9999, 1.0027 |
| DH on-line | 1.0003 | 1.257 | 0.989 | 0.997 |
| HEAT -0.005, -0.02, -0.08 | 1.043, 1.105, 1.204 | 1.005, 0.979, 0.963 | 0.997, 0.987, 0.980 | 0.995, 0.988, 0.987 |

The law is the decay of the kernel; it holds for every list because every measured form factor is within 2% of 1 past alpha = 4/3. The fail criterion of the task (a control residual that does not fall with W) is met by no control. A residual that does not fall would require a form factor growing like e^(4 pi alpha), that is zeros at depth of one mean spacing included in the sum with complex ordinates; the lists hold on-line zeros only.

### 3.3 Controls
- DH, on-line list in [1e4, 1e6]: Fejer residual (ii) +0.034, +0.034, +0.040, +0.058, +0.075 at W = 2/3 .. 3 (errors 2e-4 .. 4.5e-4); tents 0.0825, 0.1520, 0.2462, 0.4620, 0.3365, 0.3302 at c = 0.25, 0.5, 0.75, 1, 1.25, 1.5 against 0.0731, 0.1637, 0.2493, 0.3408, 0.3342, 0.3333. The deviations are at c <= 1; the range covered starts at 1e4, above the first off-line zero (85.7), and the 43 zeros below it give no test (s3 lane, row 1). F through missing zeros.
- HEAT: Fejer residual +0.011 .. +0.034 (tau = -0.005), +0.062 .. +0.13, +0.19 .. +0.39; tents at 0.25: 0.0870, 0.1164, 0.1998 against 0.0789; past c = 1.5 within 1% of 1/3.
- T-NR, q = 1000003: the on-line list is zeta's. Its own coefficient at q is log q (1 + 2.2 sqrt q) = 2201 Lambda(q), an atom of weight abs(c(q))^2/(q L^2) = 924.8/L^2 (1.39 at 1e12) in the form factor at alpha = log q/L = 0.536, inside the unconditional band. Measured on zeta's lists: the Landau amplitude (1/sum w) sum_gamma w e^(i gamma log x) in units of -Lambda(x)/(L sqrt x) is 0.973 +- 0.069 for x = 1000003 and 999983 combined (seven lists), and (-2.5 +- 6.6)e-5 per zero at x = 1000002; the tent at 0.5 at 1e12 is 0.16656 +- 0.00021 against 0.16657 (T-NR's own diagonal term would add 2.19). The mismatch is at the single prime q and states that the zeros of T-NR off the line (density log q/pi per unit height) are not in the list.
- Sign and unimodular twists: no list. On the prime side (section 2.3) LIOU has zeta's second moment at every bandwidth reached; RSGN and UNI have zeta's below 1 and lack the off-diagonal term above 1.

### 3.4 Classification
CLOSED. Dependence on abs(c(p))^2: complete for W <= 1 (pattern 31); for W > 1 the additional term is the two-point Hardy-Littlewood input of row 3, which the Liouville twist and T-NR (up to one atom) share with zeta. The statistic is a second moment of the list; DH and HEAT differ through the number of missing zeros above their first off-line zero.

## 4. Combination 3: HL*(k) as a coefficient statement

### 4.1 Test
C_k(H; X) = sum_{n <= X} c(n) c*(n + h_1) c(n + h_2) c*(n + h_3), c the coefficients of -F'/F restricted to odd primes, c* the conjugate (conjugate form) or c (plain form). Main term S(H) m(H) X with S the singular series and m the mean of the character product over the residues n mod q with every n + h_i coprime to q (m = 1 for zeta). Pass: relative error falling like X^(-1/2 + eps). k = 2: all 5000 even shifts h <= 1e4 at 17 checkpoints from 8.4e6 to 1e11. k = 3, 4: 12 triples and 9 quadruples, among them (0,2,6), (0,6,12), (0,30,60), (0,2310,4620), (0,1000,9000), (0,2,6,8), (0,30,60,90), (0,10,4002,9000) and the inadmissible (0,2,4), (0,8,22), (0,2,4,6).

### 4.2 Results (MEASURED)

k = 2, rms over the 5000 shifts:

| X | zeta: relative error | zeta: error / (sqrt X log X) | RSGN: abs C_2 / (sqrt X log X) | CHI5R: relative error | chi mod 5 complex, conjugate form | plain form, h not divisible by 5 (4000 shifts) | plain form, 5 dividing h: abs C_2/sqrt X | UNI, conjugate form: abs C_2/sqrt X |
|---|---|---|---|---|---|---|---|---|
| 8.4e6 | 2.09e-3 | 0.715 | 1.307 | 5.98e-3 | 6.44e-3 | 2.93e-3 | 14.0 | 20.8 |
| 1.0e8 | 7.29e-4 | 0.739 | 1.332 | 2.10e-3 | 2.21e-3 | 1.03e-3 | 16.5 | 24.6 |
| 1.0e9 | 2.68e-4 | 0.764 | 1.348 | 7.76e-4 | 8.22e-4 | 3.77e-4 | 18.9 | 27.7 |
| 1.0e10 | 9.25e-5 | 0.746 | 1.356 | 2.79e-4 | 2.87e-4 | 1.33e-4 | 22.3 | 31.4 |
| 1.0e11 | 3.42e-5 | 0.787 | 1.372 | - | - | - | - | - |
| fitted exponent of the relative error (or of abs C_2/X) | -0.440 (last decade -0.435) | | -0.446 | -0.433 | -0.439 | -0.436 | -0.436 | -0.443 |

- Zeta passes: the relative error falls by a factor 61 over four decades of X; the rms error is (0.71 .. 0.79) sqrt(X) log X, so the exponent is -1/2 up to the logarithm. Largest relative error over the 5000 shifts at 1e11: 1.4e-4. Mean over the shifts: -5.3e-6.
- L(chi) passes in the form with conjugates, with the local factor at 5 replaced by the character mean (m = 1 for 5 dividing h). In the plain form the complex character has a main term for h not divisible by 5 and none for 5 dividing h (the mean of chi^2 vanishes); the real character has one for every h. chi_-4: chi(n) chi(n + h) = (-1)^(h/2) on odd n, so C_2 is zeta's up to this sign.
- RSGN and UNI: no main term; abs C_2 is of the size of zeta's error term (1.7 times it).

k = 3 and k = 4 at X = 1e11 (relative error against S m X; "none" = no main term, value abs C / sqrt X):

| H | S(H) | zeta | exponent | CHI4 | CHI5R | chi mod 5 complex, conjugate form | RSGN | UNI |
|---|---|---|---|---|---|---|---|---|
| (0,2,6) | 2.85825 | 2.1e-4 | -0.39 | none, 91 | m = 1 | m = -1 | none, 162 | none, 164 |
| (0,6,12) | 5.71650 | 1.4e-4 | -0.46 | none, 156 | m = 1 | none, 188 | none, 633 | none, 400 |
| (0,30,60) | 11.43299 | 5.4e-5 | -0.44 | none, 382 | none, 206 | none, 527 | none, 356 | none, 634 |
| (0,2310,4620) | 21.43686 | 3.1e-5 | -0.42 | none, 171 | none, 1190 | none, 232 | none, 194 | none, 338 |
| (0,1000,9000) | 5.71650 | 1.2e-4 | -0.35 | none, 491 | none, 286 | none, 98 | none, 1022 | none, 302 |
| (0,2,4) | 0 | one term (3,5,7) | | | | | | |
| (0,2,6,8) | 4.15118 | 4.8e-4 | -0.49 | m = 1, = zeta | m = 1 | m = 1 | none, 939 | none, 542 |
| (0,4,6,10) | 8.30236 | 4.7e-5 | -0.51 | = zeta | m = -1 | none, 1495 | none, 4465 | none, 3316 |
| (0,30,60,90) | 33.20945 | 2.9e-4 | -0.50 | = zeta | m = 1 | m = 1 | none, 62 | none, 1224 |
| (0,10,4002,9000) | 21.12454 | 6.5e-4 | -0.36 | = zeta | m = -1/3, 2.4e-4 | m = -1/3, 1.6e-3 | none, 5132 | none, 3747 |
| (0,2310,4620,6930) | 94.88414 | 4.0e-5 | -0.36 | = zeta | m = 1 | m = 1 | none, 7857 | none, 3723 |

Single-tuple exponents are noisy (-0.26 .. -0.51 over the 18 admissible tuples; median -0.43). For chi_-4 and k = 3 the product is chi(n) times a sign fixed by H, the two classes mod 4 cancel and there is no main term; for k = 4 the product is identically 1 on the tuples listed. Where a character mean is +-1 the relative error equals zeta's.

Controls (PROVED where stated).
- LIOU: c(p) = -log p at every prime, so C_k = (-1)^k C_k(zeta) exactly on primes (PROVED). It passes HL*(k) for every k, with the sign of the main term reversed for odd k. A sign twist that is constant on the primes is invisible to every even correlation.
- T-NR: c differs from Lambda only at n = q^j. C_k changes by the terms with n or n + h_i in {q, q^2, ...}: at most k + 1 terms of size (log q)(1 + 2.2 sqrt q) log^(k-1) X = 3.0e4 log^(k-1) X against an error of 2e-5 X (PROVED). Identical to zeta at the scale of the test.
- EA: c(n) = Lambda(n)(n^a + n^-a); by partial summation C_2 = S(h)(X^(1+2a)/(1+2a) + 2X + X^(1-2a)/(1-2a)) with the same relative error. A main term exists in its own form.
- DH (all integers, X = 1e8, 10000 shifts; `hl_dh.py`): sum c(n)^2 = 984 X, 2501 X, 8605 X at X = 4.2e6, 1.7e7, 1.0e8 (exponent 1.68); max abs c(n) = 6133, 20371, 72993 (exponent 0.78); sum c(n) = -2264, 3753, 32447. C_2(h; X)/X at h = 1, 2, 6, 10, 30, 210, 1000, 10000: 0.21, -1.26, 1.53, 3.85, 7.21, 7.12, 3.45, 2.91 at 1.7e7 and 0.09, -1.60, 0.57, 3.57, 7.18, 6.63, 3.35, 3.12 at 1.0e8; rms over h of C_2/X: 2.15 .. 2.40 at six checkpoints, mean over h: 0.02. So C_2(h; X) is linear in X with a factor that depends on h (largest for h divisible by 10), and the values move by 3% to 60% per factor 6 in X (h = 30: 3%; h = 6: 63%; h = 1: 60%): no power saving. The reason is the size of single coefficients (one term can be of size X^0.78 times a typical coefficient), a consequence of the missing Euler product, not of any zero being resolved.
- HEAT: no Dirichlet series (N).

### 4.3 Classification
CLOSED. The statistic reads correlations of the coefficients at distinct integers and is the input of rows 1 and 2 above bandwidth 1. It separates DH and the random twists at small X. It does not separate the Liouville twist (for even k), T-NR (at any k) or EA (in its own form) from zeta, and for zeta the power saving is an open hypothesis whose known consequence is a proportion (map rows P27, P47), not a statement in every window.

## 5. Combination 4: Lehmer functional and minimum gap

### 5.1 Test
For consecutive ordinates, D = gap and G = sum over all other zeros of the inverse squared distances to the two members (64 neighbours on each side plus the tail at unit density), q = D^2 G (the quantity of the Csordas-Smith-Varga criterion, scale invariant). The small-gap law P(D < s) = pi^2 s^3/9 gives P(q < eps) ~ C eps^(3/2). Estimators: Hill exponent of the lower tail of q and of D; slope of mean log(minimum of a block of 2^j gaps) against log(2^j), j = 6 .. log2(n) - 5 (GUE: -1/3; exponent k of the gap law gives -1/k); the same for q (-2/3); the ladder of the node (minimum of the first 100 x 2^r gaps).

### 5.2 Results (MEASURED)

| list | pairs | min q | P(q < 0.8) | Hill q < 0.02 | q < 0.05 | q < 0.2 | Hill D < 0.2 | min-gap slope (blocks) | min-q slope | ladder slope |
|---|---|---|---|---|---|---|---|---|---|---|
| zeta first 2e6 | 2.00e6 | 8.7e-5 | 0.0629 | 1.464 +- 0.060 | 1.505 +- 0.031 | 1.481 +- 0.011 | 2.953 +- 0.025 | -0.339 +- 0.012 | -0.677 +- 0.022 | -0.351 |
| 1e7 | 4.02e6 | 2.6e-4 | 0.0646 | 1.489 +- 0.043 | 1.510 +- 0.022 | 1.472 +- 0.008 | 2.966 +- 0.017 | -0.332 +- 0.007 | -0.663 +- 0.012 | -0.239 |
| 1e8 | 2.00e7 | 2.3e-5 | 0.0653 | 1.510 +- 0.019 | 1.495 +- 0.010 | 1.473 +- 0.003 | 2.967 +- 0.007 | -0.334 +- 0.007 | -0.667 +- 0.013 | -0.392 |
| 1e9 | 2.00e7 | 1.7e-4 | 0.0657 | 1.513 +- 0.019 | 1.499 +- 0.010 | 1.474 +- 0.003 | 2.973 +- 0.007 | -0.318 +- 0.004 | -0.635 +- 0.008 | -0.349 |
| 1e10 | 2.00e7 | 2.9e-5 | 0.0659 | 1.515 +- 0.019 | 1.511 +- 0.010 | 1.477 +- 0.003 | 2.979 +- 0.007 | -0.335 +- 0.007 | -0.668 +- 0.013 | -0.323 |
| 1e11 | 2.00e7 | 3.9e-5 | 0.0660 | 1.501 +- 0.019 | 1.490 +- 0.009 | 1.473 +- 0.003 | 2.966 +- 0.007 | -0.326 +- 0.005 | -0.659 +- 0.011 | -0.338 |
| 1e12 | 2.00e7 | 8.7e-5 | 0.0662 | 1.537 +- 0.019 | 1.500 +- 0.010 | 1.472 +- 0.003 | 2.966 +- 0.007 | -0.320 +- 0.006 | -0.640 +- 0.013 | -0.270 |
| CHI | 1.99e6 | 3.1e-4 | 0.0634 | 1.517 +- 0.063 | 1.502 +- 0.032 | 1.477 +- 0.011 | 2.972 +- 0.025 | -0.327 +- 0.007 | -0.658 +- 0.012 | -0.366 |
| CHIBAR | 1.99e6 | 4.0e-4 | 0.0633 | 1.554 +- 0.064 | 1.527 +- 0.032 | 1.478 +- 0.011 | 2.974 +- 0.025 | -0.332 +- 0.009 | -0.665 +- 0.018 | -0.302 |
| DH on-line | 1.78e6 | 1.7e-5 | 0.0516 | 1.062 +- 0.027 | 1.003 +- 0.016 | 1.051 +- 0.008 | 2.069 +- 0.017 | -0.482 +- 0.010 | -0.963 +- 0.020 | -0.537 |
| HEAT -0.005 | 1.97e6 | 3.3e-6 | 0.0762 | 0.982 +- 0.019 | 0.997 +- 0.012 | 1.073 +- 0.006 | 2.160 +- 0.013 | -0.499 +- 0.012 | -1.001 +- 0.023 | -0.498 |
| HEAT -0.02 | 1.80e6 | 1.3e-5 | 0.0943 | 1.011 +- 0.016 | 0.998 +- 0.010 | 1.019 +- 0.005 | 2.047 +- 0.010 | -0.479 +- 0.010 | -0.964 +- 0.022 | -0.513 |
| HEAT -0.08 | 1.16e6 | 8.8e-7 | 0.1219 | 0.983 +- 0.016 | 0.994 +- 0.010 | 0.987 +- 0.005 | 1.981 +- 0.008 | -0.514 +- 0.017 | -1.035 +- 0.037 | -0.633 |

- Premise: the tail exponent of q is 3/2 (weighted mean of the seven values at q < 0.05: 1.499 +- 0.004) and the block minimum-gap slope is -1/3 within 1 se at four heights, 1.5 and 2.2 se at 1e11 and 1e12, 3.8 se at 1e9 (-0.318 +- 0.004). The node value -0.3953 is a ladder slope; the ladder slopes here range from -0.24 to -0.39 on 15 to 18 rungs, so the difference from -1/3 is the scatter of that estimator (same conclusion as the s1 lane).
- L(chi): as zeta.
- DH and HEAT: tail exponent 1 and gap exponent 2 (a pair of zeros about to leave or having left the line produces gaps with a linear density at 0), minimum-gap slope -1/2.

Matched sizes: distribution of the Hill exponent (q < 0.2) over disjoint blocks of n pairs, [2.5%, 50%, 97.5%]:

| n | zeta (1e8 .. 1e12, 2000 to 20000 blocks) | DH | HEAT -0.005 / -0.02 / -0.08 (medians) |
|---|---|---|---|
| 100 | defined in 6 to 7% of the blocks (fewer than 3 events otherwise) | - | - |
| 1000 | [0.83, 1.53, 3.38] | inside | inside |
| 1e4 | [1.21 .. 1.23, 1.48, 1.80 .. 1.84] | [0.89, 1.04, 1.28] | 1.08 / 1.02 / 1.00 |
| 1e5 | [1.38 .. 1.40, 1.47, 1.56 .. 1.57] | 17 blocks, quantiles not formed; whole list 1.051 +- 0.008 | 11 to 19 blocks; whole lists 1.073, 1.019, 0.987 |

A control block of 1e4 pairs lies below zeta's 2.5% point (1.21) in most blocks; at 1000 pairs the intervals overlap completely. The onset is about 1e4 zeros (height about 9e3 for DH), against 33 zeros below 0.8 times its first off-line height.

Below 0.8 times the first off-line height (`lehmer_local.py`, battery tables; zeta blocks of the same number of gaps from the first 2e5 zeros):

| object | first off-line height | on-line zeros below 0.8 x | minimum gap (zeta [2.5%, 50%, 97.5%]) | gaps below 0.2 | gap variance (zeta interval) | with the whole table below 2000 |
|---|---|---|---|---|---|---|
| DH | 85.70 | 33 | 0.263 ([0.098, 0.295, 0.483]) | 0 | 0.114 ([0.104, 0.230]) | 1861 zeros: min q = 6.8e-4 (zeta [4.2e-3, 7.9e-2]), Hill 0.82, gap variance 0.229 ([0.156, 0.165]) |
| HEAT -0.1 | 415.26 | 158 | 0.218 ([0.056, 0.175, 0.300]) | 0 | 0.238 ([0.146, 0.182]) | 1435 zeros: min q = 1.2e-3, Hill 0.96, variance 0.299 |
| HEAT -0.5 | 111.69 | 25 | 0.348 ([0.111, 0.323, 0.528]) | 0 | 0.220 ([0.093, 0.246]) | 929 zeros: min q = 1.1e-2, Hill 1.08, variance 0.548 |
| T-NR q = 1000003 | 0.227 | 0 | - | - | - | on-line list = zeta's |
| T-NR q = 3 | 2.86 | 0 | - | - | - | on-line list = zeta's |
| EA | every zero | 0 | - | - | - | - |

No control has an event in the lower tail below its off-line height, so the exponent is not defined there (for zeta itself blocks of 30 pairs have 3 events in fewer than 1% of the cases). One auxiliary statistic differs on that range for one control: the gap variance of the heat table at tau = -0.1 (0.238 on 157 gaps against 0.146 .. 0.182). It measures the deformation of the list as a whole, is inside the zeta interval for DH and for tau = -0.5 at their sizes, and is undefined for T-NR and EA.

### 5.3 T-NR with its pairs
For q = 1000003 the local factor has zeros at 1/2 +- 0.0321 + i (2k+1) pi/log q. Their contribution to G at a point gamma of the line is 2 Re (pi/P)^2 / sin^2(pi (gamma - t_0 - i beta)/P) with P = 0.4548, between 2 x 47.7 x (-20.0) at the ordinates of the pairs and 2 x 47.7 x 0.95 midway between them (per unit of t squared), against G of zeta of about 100 in the same units at 1e12. So D^2 G of T-NR with all its zeros differs from zeta's by terms of the size of zeta's own value (not computed on the lists); this enters through the off-line zeros, which start at height 0.227.

### 5.4 Classification
CLOSED. The statistic is a functional of the on-line list: identical for zeta and T-NR, undefined for EA, and for DH and HEAT the difference appears with about 1e4 zeros, 300 times the number available below the first off-line zero. It is the small-gap exponent of the s1 lane (row 1b there) read through D^2 G: the count of zeros that have left the line (pattern 18).

## 6. Measurements that are new relative to the nodes

1. Certificate at bandwidth above 1 from the prime side at scale: c = 0.8905 +- 0.0010 at lambda = 1.70 from all primes below 1e11 (T = 1.85e7), equal to the zero-side value; table of c(lambda) at seven heights with the arithmetic correction (+2.6/L^2 at lambda = 1).
2. The same matrix for the random sign and unimodular twists gives 0.852 .. 0.857: the difference 0.039 +- 0.003 from zeta at lambda = 1.7 is the measured contribution of the correlations of Lambda at distinct integers; the Liouville twist reproduces zeta's value to 3e-4.
3. DH from its own coefficients: tr G^2 / tr G = 1.71, 1.82, 2.72, 5.76, 16.1 at lambda = 1.00 .. 1.73 in a window with about 1000 off-line pairs; max abs c_DH(n) grows like n^0.78 and sum c_DH(n)^2 like X^1.68 up to 1e8; C_2(h; X)/X of DH has h-dependent values of order 1 to 7 without power saving.
4. Two-point Hardy-Littlewood sums for all 5000 even shifts up to 1e4 at X = 1e11: rms relative error 3.42e-5, rms error (0.71 .. 0.79) sqrt(X) log X at 17 checkpoints.
5. Fejer-statistic variance at bandwidth 4/3, 2, 3: the residual against the diagonal prime term is +2.7e-4, +1.1e-3, +2.0e-3 at 1e12 and is removed by the Conrey-Snaith term to within 9e-5.
6. Lower tail of D^2 G: exponent 1.499 +- 0.004 for zeta (seven heights), 1.50 .. 1.53 for L(chi), 1.00 for DH and the heat lists; block estimator of the minimum-gap exponent -0.318 .. -0.339 (zeta), -0.48 .. -0.51 (DH, HEAT).

## 7. Weakest points

1. Everything is float64 and statistical. The eigenvalue counts (no negative eigenvalue for zeta and L(chi) in 74 + 32 windows; 17% to 27% negative for the twists) are not certified; the s3 and s4 lanes certified the same matrix in Arb at smaller sizes. No classification depends on a sign near zero.
2. The Bogomolny-Keating / Conrey-Snaith prediction is heuristic and coded with prime products cut at 1e6 and the r-integral cut at 60; its precision, read from the cells with the smallest errors, is 5e-5 to 1.4e-4. Residuals below that are not resolved.
3. The on-line fraction of DH in the window [5e4, 5.8e4] (0.90) is taken from the s1 lane, not recomputed; the conclusion (certificate far below it) does not depend on its third digit. T-NR at q = 1000003 could not be brought to bandwidth above 0.78 with primes to 1e11, so for that control the bandwidths 1.04, 1.26, 1.70 are untested; the theorem of section 2.1 covers them.
