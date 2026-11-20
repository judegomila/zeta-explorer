# GATE: how to read N(theta) of c17-window-information-law-ctheta-u5 (second referee, 2026-11-20)

For lanes `c18-tz-one-sided-bound-fe-reserve-bridge` and `c18-tz-band-completion-controls-server`. Derived independently of the first referee. No statement about zeros of zeta.

## Theorem 1: HOLDS (one domain correction; no change of content)

Checked by own derivation: with g(z) = int_I h(s) e^(-isz) ds = <v_(conj z), h> and f = g g^#, f(z) = <h, v_z><v_(conj z), h>, so sum_Z f(z) = <h, T_Z h>, and int_R f = 2 pi norm(h)^2. Hence the device inequality (D) for f is <h, (T_Z + 2M) h> >= 0. Parts (b) (indicator vectors, int F_u = pi, norm(h)^2 = 1/2) and (c) (Fejer-modulated tests, int w = 1) check.

Correction (domain). T_Z is not a bounded operator on L^2(I) when Z has unbounded local density (C log(2 + abs(x)) points per unit length). "T_Z + 2M >= 0 on H" must be read as: the quadratic form is >= 0 on h in C_c^infinity(I) (equivalently, by dominated convergence with the O(x^-2) decay on the strip, on every h whose f = g g^# lies in K_u). With this reading (a) is an equivalence. The direction "form >= 0 implies every f in K_u passes" uses the factorisation f = g g^# (Akhiezer); see the source note below. The direction used for exclusion needs no source.

Use: any statement "the complete band-u device with tolerance M" may be replaced by "the form of T_Z + 2M is >= 0 on C_c^infinity of an interval of length u".

## Remark K: HOLDS for the unwindowed device only; its use for N(theta) is NOT established

(i) Unwindowed, fixed band u: the form of T_Z + 2M is >= 0 on C_c^infinity(I) if and only if the distribution k(s) = sum_Z e^(isz) + 2M delta on (-u, u) is positive definite there; by Krein's extension theorem in its distribution form and Bochner-Schwartz this holds if and only if k is the restriction of the Fourier transform of a positive tempered measure sigma on R, that is sum_Z f(z) + (M/pi) int f = int f d sigma for f = g g^#, h smooth. The passage to all f in K_u needs sigma([t, t+1]) = O(log t), which follows by testing one fixed smooth f translated. CLASSICAL at recalled level (Krein 1940 for continuous functions; the distribution form is recalled, not opened). Direction "sigma exists implies form >= 0" is trivial and is the only direction that is safe to use as PROVED.

(ii) N(theta) is a windowed statement ("h in L^2[0, u] concentrated at height t", u = theta log t). The set of such h is not a linear space invariant under modulation, and Theorem 1 (a) says the complete device at one band is the same at every height. So Remark K does not apply to N(theta) as written. The sentence of section 3, "N(theta) holds if and only if the truncated data extend to a function with positive real part (Remark K)", is ARGUED, not PROVED. No local (windowed) Krein extension statement is proved in the lane.

## Reading rule for the two gated lanes

1. N(theta) must be given a definition before use. Two definitions are covered by Theorem 1:
   - N_all(u, M): form of T_Z + 2M >= 0 on C_c^infinity of an interval of length u (all heights at once). Remark K (i) applies. For zeta this is, by the explicit formula (signs checked by this referee: sum_gamma f = <h, Arch h> - 2 Re <h, A h> + f(i/2) + f(-i/2), Arch = multiplication of g by Re psi(1/4 + ix/2) - log pi, A = sum_(n < e^u) Lambda(n) n^(-1/2) C_(log n)), the inequality 2 Re <h, A h> <= <h, (Arch + 2M) h> + pole terms for all h.
   - N_K(theta, t, M) for a named set K of vectors (for instance the indicators of C(theta), or the Fejer-modulated tests): a sub-device. Only "N_all implies N_K" is available. Remark K does not apply.
2. The pole terms f(i/2) + f(-i/2) are bounded by e^(u/2)/t^2 only for the indicator-type vectors of c15/c16; for a general h the bound depends on the smoothness of h. A lane that drops them must state the test class.
3. Lemma E (truncated Euler product in the truncated-shift algebra) HOLDS, for every completely multiplicative chain. It gives no inequality.
4. The Nyquist statements (Theorems 3, 4) are for a lattice or tight on-line background. They are not statements about zeta's zeros.
5. Control zeta(s+a) zeta(s-a) for any lane that runs it against N_all or a sub-device: its form is E_- T_Gamma E_+ + E_+ T_Gamma E_- (kernel 2 cosh(a (s - s')) k(s - s')). Lattice model: passes for every u <= Lg and every a. On zeta's ordinates at 1e6 (ball arithmetic, window model, this referee): passes for a <= 0.22, fails for a >= 0.24 at theta = 1/2, M = 0; passes for a <= 0.02, fails for a >= 0.05 at theta = 0.8, M = 0. So this control passes for small a and its failure for larger a is through coefficient size; it cannot be cited as failing at a structural step.

Source note: Akhiezer's factorisation (f entire of exponential type tau, f >= 0 on R, sum abs(Im 1/z_n) < infinity implies f = F F^# with F of type tau/2) was opened at secondary level (Wikipedia "Akhiezer's theorem", citing Boas, Entire Functions, 1954, pp. 124-132, and Akhiezer 1948); the zero condition holds for f in K_u because f is bounded on R (Cartwright class). The primary sources were not opened.

Server rerun: one-pair entries at T = 1e6 reproduced bit for bit by an independent inertia test (theta = 1/2, M = 0: 0.34566484374999995; theta = 2, M = 1: 0.0249923828125). See `REFEREE2.md` in the lane directory.
