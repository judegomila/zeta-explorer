# REFEREE (adversarial, lens: general): c18-referee-r17-independent-sources

Date 2026-11-19 local (2026-11-20 UTC). Object: `RESULT.md`, `GATE.md` and the four `REFEREE2.md` files written by this lane. No statement about zeros of zeta is made by the lane or here.

## Verdict: HOLDS, with four minor corrections (none changes a verdict, a table entry or a flag)

The lane makes no attack and claims no requirement flag. Every statement it labels PROVED or "holds" that I re-derived is confirmed; every number I recomputed is reproduced by a different method. Flags: R1 false, R2 false, R3 false, R4 false (agree).

## 1. Re-derivations (by hand, independent of the lane's text)

- GATE, Theorem 1: g(z) = int h e^(-isz), f = g g^#, int_R f = 2 pi norm(h)^2, device inequality = form of T_Z + 2M. Confirmed. Domain correction (T_Z unbounded when the local density grows like log) confirmed: modulating a fixed h to height t gives a form value of order log t norm(h)^2.
- GATE, Remark K: the reading "holds for the unwindowed device, not for the windowed N(theta)" is correct. The trivial direction (measure exists implies form >= 0) is the only direction that is proved in the files; the other rests on the distribution form of Krein's extension theorem, recalled and not opened. The lane says this.
- Explicit formula signs (sum over zeros = Arch - 2 Re<h, A h> + f(i/2) + f(-i/2)): confirmed, pole at s = 1 is z = -i/2.
- E_a control form: pair kernel e^(-i(s-s')x)(e^(a(s-s')) + e^(-a(s-s'))) = 2 cosh(a(s-s')) e^(-i(s-s')x); lattice row of spacing 2 pi/Lg gives 2 Lg delta for u <= Lg. Confirmed. cosh is not positive definite. Confirmed.
- Inertia identity neg(T) = pos(K + G/c) - pos(K) from the two Schur complements of [[c, V],[V*, -K]], K = K^-1: confirmed; valid in infinite dimension because T - c Id has finite rank. Gram entry u sinc(u (z_j - conj z_i)/2) and the c, d combination |v_z><v_zbar| + h.c. = |c><c| - |d><d|: confirmed.
- Theorem 2 one-pair eigenvalues u(1 +- sinh(A)/A), roots 2.83844638 (sinh(A)/A = 3) and 2.177318985 (sinh(A)/A = 2): confirmed by hand.
- Theorem 4 (b): "lowest <= -abs(c)(N - u_1)" reduces to 2 u_1 (1 - cos phi)(u_1 - N) <= 0: confirmed.
- Corollary T' constants: min Re sinc^2 on abs(zeta) <= 1/2 is (sin(1/2)/(1/2))^2 = 0.919395; 0.919395/(2 pi) = 0.14633; doubled 0.2927; (6/5) log(48 e) = 5.84544. Confirmed.
- W5c (new in the lane's REFEREE2, no prior referee): -2 Re(a conj b) <= (1/2) abs(a - b)^2 is equivalent to abs(a + b)^2 >= 0; g(z) - g(conj z) = 2 G(x) with G the transform of h sinh(bs) (interval centred; f is invariant under the shift); Plancherel-Polya constant from sub-mean-value on disjoint discs of radius rho = min(D/2, 2/u): sum <= (2 e^(u rho)/(pi rho)) int abs(G)^2, which is the stated (2 e^2/pi) max(2/D, u/2). Confirmed. W5c now has one referee (this file). Its scope is as the lane states: one band, equal offsets.
- u6e Lemma T (b): log F_p = -(1/2) log(1 + y), y >= w = 2x(1 - cos) in [0, 4], concavity gives log(1 + w) >= (log 5/4) w, so log F_p <= -0.402 x (1 - cos). Confirmed. Divergence for beta <= 1 uses only an upper bound for abs(zeta(1 + eps + i tau)), tau != 0. Confirmed.
- u6f norm identity: c(m) = 2 sigma_-1(m) - 5 sigma_-1(m/2) + 2 sigma_-1(m/4), linear terms 10 - 2 - 8 = 0, Dirichlet factor 2 - 5 2^-u + 2 4^-u = (2 - 2^-u)(1 - 2^(1-u)); p^2 c(p^2 m) = (p^2 + p + 1) c(m) - (p + 1) c(m/p); the (p + 1) L(p tau) terms cancel; log N_p = (p^2 + p) L(x) - L(x/p^2) - L(p^2 x). Limit: (p^2 - p)/(p^2 + p - 2) = p/(p + 2). Confirmed.
- u3: kappa_0 = 1/2 - Si(2 pi)/pi by one integration by parts. Confirmed. Proposition W (b), (c): confirmed.

## 2. Numerics rerun, different method and different cases (local, memcap 8 GB, float64 / mpmath; scripts in /tmp/ref3c18, not kept in the lane directory)

**E_a table (the decisive item).** Independent method: Nystrom discretisation of T = (2 Lg + 2M) Id + kernel 2 cosh(a(s - s')) [sum_zeta e^(i(s-s')x) - sum_lattice e^(i(s-s')x)] on 700 Gauss-Legendre nodes of [-u/2, u/2] (same window model, same ordinate file), eigenvalues by numpy eigvalsh; negative count unchanged at 1000 nodes. This shares no code and no criterion with `ref2_ea.py` (finite Gram inertia in balls).

| theta, M, H | a: negative count (mine) | lane |
|---|---|---|
| 0.5, 0, 45 | 0.2: 0; 0.22: 0; 0.24: 1; 0.26: 3; 0.28: 5; 0.3: 8; 0.45: 18 | same in all 7 cells |
| 0.5, 1, 45 | 0.2: 0; 0.3: 6; 0.45: 16 | same |
| 0.8, 0, 45 | 0.005: 0; 0.02: 0; 0.05: 2; 0.1: 11; 0.2: 30; 0.3: 42 | same |
| 0.8, 1, 45 | 0.05: 0; 0.1: 6; 0.2: 26 | same |

New cases (not in the lane; float64, so MEASURED at screen level only):
- theta = 0.5, M = 0, H = 45: a = 0.225 and 0.228 pass (lowest eigenvalue 0.354, 0.093), a = 0.23 fails (-0.085). H = 38 (145 pairs): 0.23 passes (0.077), 0.24 fails (-0.854). Crossing near 0.229 to 0.231; the bracket [0.22, 0.24] is stable under the window.
- theta = 0.5, M = 1: 0.24 and 0.248 pass, 0.25 fails (-0.020). The lane's bracket (0.2, 0.3) narrows to about 0.249.
- theta = 0.8, M = 0: H = 30: 0.02, 0.03, 0.04 pass, 0.05 fails (1 direction), 0.1 fails (7). H = 38: 0.04 passes, 0.05 fails. H = 45: 0.03, 0.04 pass (0.176, 0.020). The lane varied the window only at theta = 0.5; the bracket [0.02, 0.05] at theta = 0.8 also survives the window change (crossing between 0.04 and 0.05).
- theta = 0.65, M = 0, H = 45 (new band): 0.1 passes (0.291), 0.15 fails (3 directions). Threshold decreases monotonically with the band: about 0.23, between 0.1 and 0.15, about 0.045 at theta = 0.5, 0.65, 0.8.
- Where the failing directions sit: at theta = 0.5, a = 0.24 the negative direction is concentrated at x = -20.25 (interior; next to a zeta gap of 1.012 at -20.77, mean spacing 0.525), with 6 per cent of its mass within 5 of the window edge. So the theta = 0.5 threshold is not an artefact of the zeta/lattice junction.

**Prime-side screen.** Rerun with step 0.004 instead of 0.01: max S_a = 18.561, 23.857, 40.347 (theta = 0.5; a = 0.2, 0.3, 0.45) and 23.250, 33.928, 70.401 (theta = 0.8; a = 0.1, 0.2, 0.3); violating fractions 0, 0, 0.0588 and 0, 0.0701, 0.1916. Reproduced.

**Epstein zeros.** Z_5 = zeta L(chi_-20) + L(chi_-4) L(chi_5), Z_6 = zeta L(chi_-24) + L(chi_-3) L(chi_8) checked against the double sum at s = 3 (not the lane's s = 4): agreement 4e-11 (truncation). Roots by mpmath findroot at 25 digits: 0.93296969748541 + 15.66824953127847 i, 0.69692704531229 + 36.37406368638513 i (Z_5); 0.80374912855615 + 15.11757853305720 i, 0.82561493132099 + 33.59233012593619 i (Z_6). Reproduced. Not enclosures (same status as the lane states).

**u6e product.** log(abs(zeta(1.5 + i))/zeta(1.5)) = -0.7342100. Partial product over p < 1e6: -0.7340399 (lane: -0.73401 at 2e5); the residual 1.7e-4 matches the tail size 2/(sqrt(N) log N). Different case beta = 2, tau = 3, p < 1e6: -0.71326338 against -0.71326344. Confirmed.

**kappa_0** = 0.04858833320986. Confirmed.

**Bisection rerun logs.** `logs/rh-c18ref-a-1120043109.log` read: on-line inertia (172, 171), 13 verdicts, final lower end 0.34566484374999995. Consistent with the RESULT.

## 3. Corrections (all minor)

C1. "Reproduced bit for bit" overstates what was tested. Both codes bisect the same interval [1e-4, 0.4999] for 11 steps, so equal floats mean equal pass/fail verdicts at the same 13 offsets. The established statement is: the two criteria agree at all 13 offsets, and the threshold lies in a bracket of width 2.4e-4 (theta = 1/2: between 0.345665 and 0.345909). The RESULT does print "all 13 bisection verdicts agree"; the phrase "bit for bit" should be dropped from the headline and from GATE.md.

C2. "Passes for a <= 0.22, fails for a >= 0.24" (and "<= 0.02", ">= 0.05") is certified at the tested offsets only (theta = 0.5: 0.005, 0.02, 0.05, 0.1, 0.2, 0.22 pass; 0.24, 0.26, 0.28, 0.3, 0.45 fail). Monotonicity of the lowest eigenvalue of T_a in a is not proved in the lane. My float64 fill-in (17 further offsets) found no exception. Wording: "passes at every tested a <= 0.22, fails at every tested a >= 0.24".

C3. "The root mean square agrees with sqrt(sum w_n^2/2) to 4 per cent" is wrong for the rows printed: theta = 0.8, a = 0.3 has 25.70 against 27.08 (5.1 per cent), a = 0.2 has 4.1 per cent; in `ref2_ea_prime.json` the row theta = 0.8, a = 0.45 has 5.7 per cent. Correct text: "to 6 per cent (to 1.5 per cent at theta = 0.5)".

C4. "The complete device fails earlier near the Nyquist band, where the on-line form has small eigenvalues": the smallest eigenvalue at theta = 0.8 (0.361 at a = 0.005 against c = 23.96) belongs to a direction with 99 per cent of its mass within 5 of the window edge (x = -42.5, at the zeta gap of 1.161 at -43.06, two units from the zeta/lattice junction). It is the second negative direction at a = 0.05 (count 2). The first negative direction at a = 0.05 (x = 19.7) is interior and has eigenvalue 0.90 at a = 0.005. So: the fail verdict at a = 0.05 and the pass at 0.02 do not depend on the edge (confirmed at H = 30 and 38), but one of the two directions counted at (0.8, 0, 0.05) and the smallest quoted eigenvalue are edge-adjacent in the window model. The counts at theta = 0.8 should carry the note "includes directions within 5 of the junction". The reading "failure through coefficient size, not a structural step" is an interpretation (ARGUED), which is how the lane uses it; the measured content is the table.

## 4. Checks required by the assignment

- Assumes RH: no. The E_a configuration puts zeta's ordinates on the line in abs(gamma - 1e6) <= 45; this is a model input taken from stored ordinates, stated as such, and the result is labelled as a window-model measurement at one height.
- Restates verified height: no.
- Known theorem presented as new: no. Lemma G is relabelled CLASSICAL by the lane; Kakutani type noted; Turan, Akhiezer, Krein, Plancherel-Polya are cited as recalled or secondary. The lane's own new item is W5c (elementary; confirmed above).
- Controls where a zeta-only mechanism is claimed: none is claimed. The lane's control finding is the opposite (E_a passes for small a), and I reproduced it.
- Server rules: units listed, all launched through rhrun, none left running according to the RESULT (not re-inspected on the server; this referee did not use the server).

## 5. What remains open in the lane (as the lane states; confirmed as open)

DH row not run. W4 density form and W5 height-coupled form ARGUED. "E_a fails at a positive proportion of large heights for fixed a, theta" ARGUED, not written out. Turan factor 2 unresolved at source level (effect: 0.2927 delta against 0.1463 delta). Krein extension in distribution form recalled, not opened. One height (1e6) only.

## 6. Flags set by this referee

R1 false. R2 false. R3 false. R4 false. holds = true.
