# Independent referee: c13-fourier-interpolation-zero-nodes (kernel factorisation; orbit under symmetric multipliers)

Referee lane `c14-referee-r13-independent`, 2026-11-19. Written from the lane's RESULT.md and from the source text
`sources/brs.txt` (Bondarenko-Radchenko-Seip, arXiv:2005.02996v3; passages (4.1)-(4.10), Proposition 4.1 and its
Remark, sections 5.3.2, 5.3.3 read). The lane's REFEREE.md was not read. Own code: `items35.py` (block lane 3),
output `items35.log` (the script was stopped later, in the lane-5 block, before writing its JSON file). Nothing here is a statement about zeros of zeta.

## Verdicts

| statement | verdict | exact line / form |
|---|---|---|
| Factorisation "H(w,s) = (F*(s)/F*(w)) x A_k(w,s), A_k target-independent" (verdict item 2; section 2 display of BRS (4.6); section 4 "Consequence") | **HOLDS IN NARROWER FORM** | Exact for H_- (BRS (4.6), first line). For H_+ the source has a further term: H_+(w,s) = (zeta*(s)/2) [ A^+_(1/2)(w/2, s/2)/zeta*(w) - alpha^+_(1,1/2)(s/2) ] (BRS (4.6), second line; equivalently D_+ in section 4.3 and the convention h^+_1 := 0). The lane's display of (4.6) writes both kernels without the subtraction. Corrected form: H_+ = (zeta*(s)/zeta*(w)) x [A^+_(1/2)(w/2, s/2) - alpha^+_(1,1/2)(s/2) zeta*(w)]/2. The second factor contains the target additively. alpha^+_(1,1/2) is not identically zero: BRS (4.4) gives alpha^+_(1,1/2)(0) = -r_1(1) = -2. |
| Lemma M (i)-(iv): H^G := H G(s)/G(w) has the stated symmetries, Dirichlet expansion, poles and zeros | **HOLDS** | G(s)/G(w) equals 1 at w = s, is symmetric in each variable, and the product of two absolutely convergent general Dirichlet series is one. Holds for H_- and for H_+ as defined in the source. |
| "The bases form one orbit under multiplication of the kernel by G(s)/G(w)"; "H^F = H^zeta x G(s)/G(w)" (section 4, Consequence; map row) | **HOLDS IN NARROWER FORM** | True for the even kernel H_-. For H_+: H^zeta_+ G(s)/G(w) = (F*(s)/2)[A^+/F*(w) - alpha^+_1(s/2)/G(w)], while the kernel built for F = zeta G by the source's recipe (subtract the frequency-0 coefficient) is (F*(s)/2)[A^+/F*(w) - kappa alpha^+_1(s/2)], kappa the constant coefficient of 1/G. They differ by (F*(s)/2) alpha^+_1(s/2) (kappa - 1/G(w)), which has poles in w only at the zeros of G. Both are kernels of the class (target enters by division; poles at w = s, 1-s with residues 1, -1). So: "the orbit of a kernel is a family of kernels", yes; "the kernel of F is the orbit point", only for H_-. |
| Lemma T (T-NR basis) | **HOLDS IN NARROWER FORM** | Holds for the functions built from H_- (U^+_n = h^-_n). For those built from H_+ the terms with m/q^(2(j+1)) = 1 read h^+_1, which the source sets to 0: the orbit kernel has coefficient 0 at the lowest frequency m = q^2 in the "+" family. This agrees with BRS 5.3.3 ("both the negative and positive part of Lambda* are pushed away"): the frequency that zeta has once (0) is had once by T-NR (one of +-log q^2/(4 pi)), not twice. The lane's frequency set "{+-log m/(4 pi): m in q^2 N}" should be read with one sign at m = q^2. The alternative kernel with the alpha^+_1 term kept differs from it by a multiple of 1/G(w), which is the Poisson relation between the arithmetic progression of zeros of P and the frequencies (j+1) log q/(2 pi). |
| "The target enters by division only" (verdict item 2, last sentence; round-14 question Q-S) | **HOLDS** in the sense used by the filter | In both kernels F appears as F*(s)/F*(w) times a factor fixed for the orbit, plus (for H_+) a term F*(s) x (function of s) x (1/G(w) or a constant). No step reads F other than through F*(s) and 1/F*(w). A symmetric multiplier with zeros in the strip maps kernels to kernels. The filter stands. |
| Uniqueness of A_k "by Bochner's converse theorem" | **HOLDS as quoted** (PROVED-rel) | BRS Remark after (4.2) states it for nu_+- > 0 and for the first equation of (4.2) with the poles. Sources [2], [3] not opened by the lane or by this referee. For the "+" kernel the universal object is A^+ with its frequency-0 coefficient, not A^+ alone. |

No statement is BROKEN. The correction changes the display of (4.6), the wording of the orbit statement and one
frequency in Lemma T. It does not change the stage-A verdict (T-NR passes every step; the device is closed).

## Numeric instance (control not identically zero; identity reproduced)

T-NR multiplier G = P, P(w) = 2 cosh((w - 1/2) log q) + c, at (q, c) = (2, 2.05), (3, 2.2), (5, -2.2):
a = arccosh(abs(c)/2)/log q = 0.32193, 0.40375, 0.27560 (all < 1/2); the series sum g_j q^(-(j+1)(w-1/2)) times P(w)
minus 1 at w = 1.3 + 0.7i: 2.2e-57, 8.4e-58, 6.3e-58; G(s)/G(w) at s = 0.3 + 2.1i: 0.5384 - 0.1389i, 0.1531 - 0.1278i,
0.2860 + 1.3546i (not zero), symmetric under w -> 1-w and s -> 1-s to 1e-59; coefficient form of P x (1/P) = 1 in
exact rationals: (1, 0, 0, ..., 0) on the first 12 exponents; P on the critical line in [c - 2, c + 2] = [0.05, 4.05],
[0.2, 4.2], [-4.2, -0.2]. The subtracted term of H_+: alpha^+_(1,1/2)(0) = -2 from BRS (4.4) (text; not computed).

Not run: the modular integrals alpha_n(s) and the functions U_n, V_rho (the lane did not run them either). The
factorisation statement is therefore refereed against the source text and by algebra, not by a computed kernel.

## Labels to restrict

- Section 2, display "(BRS 4.6)": add the term - alpha^+_(1,1/2)(s/2) in H_+ and the convention h^+_1 := 0.
- Verdict item 2, map row (section 9) and `engine_device_proposal.json`: "the kernel is (F*(s)/F*(w)) x A_k" -> "for H_-; for H_+ the second factor is A^+ minus alpha^+_1(s/2) times the completed target"; "the bases form one orbit" -> "the kernels H G(s)/G(w) are kernels of the class; for H_- they are the kernels of the targets zeta G".
- Lemma T: label PROVED-rel stands for the H_- family; for the H_+ family add the remark on m = q^2.
- Section 3, T-NR bullet "H2 holds ... same edge": unchanged. Weakest step 1 of the lane (height selection, H4) is not refereed here.
