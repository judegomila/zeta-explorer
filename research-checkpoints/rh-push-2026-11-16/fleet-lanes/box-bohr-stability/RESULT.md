# box-bohr-stability: Bohr lifts of finite zeta-type objects and multivariate stability tests

Lane: compute arm of the stable-polynomial (multivariate Lee-Yang) line. Date: 2026-11-17.
Status labels: PROVED (argument given here), CLASSICAL, CERTIFIED (python-flint/Arb interval arithmetic), SCREENED (float64, GPU or CPU; never a verdict), OPEN.

## 0. Verdict

**No property separates zeta from every control.** One multivariate property separates zeta from the controls that are not products, and it is proved to be incapable of separating zeta from the sign twists:

1. **S1** (the lifted Dirichlet factor has no zero in the closed critical polydisc |w_p| <= 1) holds for the Euler lift of zeta at every size (PROVED for all P and K; screened to P = 23 for K = 1 and P = 13 for K = 2 with up to 50,000 adversarial starts and no zero found). It fails for Davenport-Heilbronn exactly from P = 7 (CERTIFIED zero in the open polydisc for P = 7..47; CERTIFIED zero-free for P = 2, 3; closed-form threshold in T5), for the T-NR twin at P = q (PROVED), and for the truncated E_a lifts at P = 2 (CERTIFIED for the AFE form; the full E_a Euler lift passes S1 and fails only the size condition S1'). Structural reason: a product over independent variables vanishes only on coordinate hypersurfaces; a sum of two products vanishes on a phase-matching set that enters the polydisc once sum 2 arctan(p^{-1/2}) over the primes with chi(p) = +-i exceeds pi - 2 arctan kappa.
2. S1 is equivalent to "the completed section of the fixed finite object is real-rooted above some height", uniformly over the torus (T2, T9). The threshold for the strip |Re s - 1/2| <= 1/2 (K = 1) is t* = 718.6 at P = 11, 1.17e5 at P = 23, 3.5e8 at P = 47, 2.8e14 at P = 97; even for an arbitrarily thin strip log(t*/2 pi) >= sum_{p<=P} 2 log p/(sqrt p + 1) = 4 sqrt P (1 + o(1)).
3. S1 and every other torus-uniform property hold verbatim for all unimodular sign twists (the twist is a translation of the torus: T3), for the eps_2 = 1/2 twist, for Beurling-type products, and for the additive twin ladder (T4 ii). So S1 does not see the functional equation and is not even specific to multiplicativity.
4. Every property that is specific to the diagonal fails for zeta itself at a finite size, except the theta form in its matched regime, which is the function itself (verified height restated): sharp AFE sections have certified off-line zeros from N = 5 in the matched window (first witness s = 0.60941 + 221.07888i, next to the close pair of zeta zeros at 220.71 and 221.43) and from N = 2 on fixed windows; Euler sections have certified off-line zeros from P = 11 (below t*); the per-variable circle property fails on half of the torus at P = 2; the sharp AFE lift fails S1 from N = 3.
5. What does distinguish the diagonal is quantitative and of density type (MEASURED, float64 screen): on matched windows the fraction of off-line zeros of the sharp AFE section of zeta falls from 2.2% (N <= 10) to 0.28% (N = 401..600, t up to 2.27e6), roughly like t^{-1/4}, while it settles at 10% for DH, 7.6% for tw2h, 24-25% for tw2m and liou and about 21% for random torus translates; a translation of the torus by 0.03-0.1 rad in one prime already multiplies the off-line count by 2-10 at N = 80-160. This is a statement about proportions, not about every zero.

The lane therefore ends at the wall already recorded in the obstruction map (section 5, parts 3-4), now in lifted form: the multiplicative input is a zero-free statement on the whole critical polydisc, it is translation-invariant, and it reaches the actual function only at heights above t*(P), i.e. for at most about (log t)^2/16 primes at height t.

## 0.1 Plan, and what is new relative to the atlas and the obstruction map

Plan: lift every finite zeta-type object to the polydisc, test one-variable sections on the diagonal and multivariate stability-type properties off it, on zeta and on the controls, with a float64 GPU screen and an Arb stage for every verdict; report the first size at which each property fails for each input.

Relation to earlier material. The atlas (PR 27, `historical-routes.md`) closes a Gibbs-weight Lee-Yang route and records as unresolved "ferromagnetic finite partition functions converging locally uniformly to the theta transform". The obstruction map has the prime chain on the Bohr torus (items 16-18: l^1/l^2 thresholds, coverage Q* = (log(t_0/2 pi))^2/16) but no multivariate stability test of lifted objects. New here: (i) the equivalence T9 between polydisc stability of the lifted Dirichlet factor (S1) and eventual real-rootedness of the completed section, with the explicit threshold; (ii) the translation statement T3, which removes every torus-uniform property as a separator from sign twists; (iii) the exact first failure P = 7 for Davenport-Heilbronn with its closed form (T5); (iv) certified first-failure sizes for zeta itself in each finite scheme; (v) the additive twin ladder passes S1 (T4 ii). Not new: T2 restricted to the diagonal is the coverage theorem of `sq-causal-cascade`; T6 is Grace-Walsh-Szego; the DH supremum 1.1203625 is known. On the atlas condition: the Euler K = 1 sections are exactly "ferromagnetic" finite objects (products of factors 1 + a_p w_p with a_p > 0), they are real-rooted only above t*(P), and at a fixed height the family leaves the real-rooted regime once P exceeds about (log t)^2/16 (certified examples: P = 11 at t < 103, P = 17 at t < 2253); so this family does not supply the missing convergent ferromagnetic approximants.

## 1. Definitions

**Inputs.** zeta; DH (Davenport-Heilbronn, a_n = (1, kappa, -kappa, -1, 0) mod 5, gamma factor (5/pi)^{s/2} Gamma((s+1)/2)); completely multiplicative twists of zeta with zeta's gamma factor: tw2m (eps_2 = -1), tw2h (eps_2 = 1/2), liou (eps_p = -1 for all p); EA = zeta(s+a) zeta(s-a) (a = 0.25, also 0.1, 0.4); NR = xi(s)(2 cosh((s-1/2) log q) + c) ((q,c) = (3,2.2) and four others); arbitrary unimodular completely multiplicative twists omega (torus translates, see T3). Backward heat is not a Dirichlet object and has no Bohr lift in the sense used here; it is not run (not formulable).

**Lift.** s = 1/2 + x + it. Each p^{-s} is replaced by z_p = p^{-1/2} w_p with w_p an independent complex variable; the critical polydisc is |w_p| <= 1, its distinguished boundary the torus |w_p| = 1; the point of the actual function is w_p = p^{-x-it} ("the diagonal"; radii p^{-x}, phases th_p = t log p). A finite Dirichlet object D(s) = sum_j c_j n_j^{-s} lifts to D(w) = sum_j c_j n_j^{-1/2} prod_p w_p^{v_p(n_j)}. The reflected factor D(1-s) lifts to D#(w) = D(1/w) (real coefficients); on the torus D#(w) = conj D(w).

**Lifted completed object.** M(u, w) = u D(w) + u^{-1} D#(w), where u stands for the archimedean phase (G(s)/G(1-s))^{1/2}; on the line |u| = 1, and for x > 0, |u|^2 = |G(s)/G(1-s)| = (t/2 pi)^x (1 + O(1/t)) for the zeta gamma factor ((5t/2 pi)^x for DH). The section along the diagonal is the completed finite object G(s) D(s) + G(1-s) D(1-s).

**Finite objects.**
- (a) AFE, size N: D = sum_{n<=N} a_n n^{-s} (sharp), or with Riesz weights (1 - log n/log(N+1)). "Matched window" of size N: 2 pi N^2/q < t < 2 pi (N+1)^2/q, q = conductor (1, or 5 for DH): the range of t where N is the Riemann-Siegel length.
- (b) Theta form, size N: F(z) = 2 int_0^oo Phi_N(u) cos(zu) du, Phi_N = N-term theta kernel with coefficients a_n (closed form by incomplete gamma functions; lylib `thalf`). The lift multiplies the n-th term by omega(n) in the direct part and conj omega(n) in the reflected part.
- (c) Euler, size P, depth K: D = prod_{p<=P} sum_{k<=K} (eps_p p^{-s})^k; K = oo is the full local factor. DH: c_1 prod_chi + c_2 prod_chibar (a sum of two products).
- (d) Twin ladder of PR 13 (`research-checkpoints/twin-ladder-physics-2026-10-19/sources/twin-ladder.js`, thermodynamic weights off): D = sum_{p<=P} sum_{m<=M} p^{-ms}: an additive sum over primes of one-variable ladders, not a product (the source file states this itself).

**Properties tested.**
- R (one-variable section, real-rootedness): in a window T1 < t < T2, |Re s - 1/2| < Y: n_tot zeros (argument principle), n_real sign changes on the line; PASS iff every zero in the window is on the line; the count n_tot is compared with the expected count from the gamma phase.
- S1 (zero-freeness of the lifted Dirichlet factor on the closed critical polydisc): D(w) != 0 for all |w_p| <= 1. Quantified by x_sup = sup{x : D has a zero on the polytorus |w_p| = p^{-x}}; S1 holds iff x_sup < 0 (Lemma L1).
- HB (torus-uniform Hermite-Biehler / Lee-Yang property with the archimedean variable): M has no zero with |w_p| = p^{-x}, 0 < x <= X, |u|^2 = |G(s)/G(1-s)| at height t, for every torus phase. Quantified by the threshold t*(X) above which it holds.
- C (Lee-Yang circle property in each variable separately): with u and all w_p (p != q) on their circles, all zeros of w_q -> M lie on |w_q| = 1.
- MA (multi-affine symmetrisation, then S1 for the symmetrised polynomial).
- Q(x0) (diagonal restriction of S1): the sharp main sum D_N(s) has no zero with Re s > 1/2 + x0 in its matched window.
- TR (torus translates): R for the section through a translated torus point omega instead of the diagonal.

## 2. Structural statements

**L1 (path lemma; PROVED from the CLASSICAL convexity of amoeba complements).** Let D be a polynomial in (w_p) with D(0) != 0 and let lambda_p > 0. D has no zero in the closed unit polydisc iff D has no zero on any polytorus |w_p| = e^{-x lambda_p}, x >= 0.
Proof. Only "if" needs an argument. Let A = Log|Z(D) ∩ (C*)^m| be the amoeba; every component of R^m \ A is open and convex (Gelfand-Kapranov-Zelevinsky). Since D(0) != 0 a translate of the negative orthant lies in one component E, so E + (-oo, 0]^m ⊂ E. By compactness the hypothesis extends to -eps <= x for some eps > 0; the ray {-x lambda : x >= -eps} is connected, misses A and ends in E, so eps lambda ∈ E and therefore every point with coordinates <= eps lambda_p is in E: no zero with 0 < |w_p| <= e^{eps lambda_p}. A zero with some coordinates equal to 0 would be a limit of zeros with all coordinates nonzero (no w_q divides D because D(0) != 0), which were just excluded. QED.
Use: S1 is decided by the single number x_sup (with lambda_p = log p the polytori are the Bohr images of the vertical lines Re s = 1/2 + x). The exact stage uses instead the DeCarlo-Murray-Saeks / Strintzis criterion (CLASSICAL): D != 0 on the closed polydisc iff D != 0 on the torus and D(lambda, ..., lambda) != 0 for |lambda| <= 1.

**T1 (the archimedean variable; PROVED).** On the torus M = 2 Re(u D(w)). For fixed w on the torus the zeros in u are u^2 = -D#(w)/D(w), and |D#| = |D| there: the Lee-Yang circle property in the archimedean variable holds for every input with real coefficients. It is the reflection symmetry built into the object and carries no arithmetic.

**T2 (torus-uniform Hermite-Biehler threshold; PROVED).** M vanishes at radii p^{-x} (x > 0), phases th and height t iff G(s) D(x, th) = -G(1-s) D(-x, -th), which forces |G(s)/G(1-s)| = |D(-x,-th)|/|D(x,th)|. Put S(x) = sup_th log(|D(-x,-th)|/|D(x,th)|). If log|G(s)/G(1-s)| > S(x) for all 0 < x <= X then no torus point gives a zero with 1/2 < Re s <= 1/2 + X at that height (nor, by reflection, on the left). For a polynomial D, S(x) < oo on (0, X] iff D has no zero on the polytori 0 < x <= X, and S(x)/x stays bounded as x -> 0 iff D has no zero on the torus x = 0 (the ratio is 1 at x = 0). Since log|G(s)/G(1-s)| = x log(t/2 pi) + O(x/t): **the threshold t*(X) = inf{t0 : HB at every t >= t0} is finite iff S1 holds on 0 <= x <= X.** HB is S1 made quantitative; it is not a second property.
For a product D = prod_p f_p(w_p) the supremum splits: S(x) = sum_p S_p(x), because the variables are independent. For K = 1: S_p(x) = log((1 + p^{-1/2+x})/(1 + p^{-1/2-x})), attained at th_p = 0 (all primes in phase: the torus point of t = 0). As x -> 0, S(x)/x -> sum_{p<=P} 2 log p/(sqrt p + 1) ~ 4 sqrt P, so for every X > 0, log(t*(X)/2 pi) >= sum_{p<=P} 2 log p/(sqrt p + 1) = 4 sqrt P (1 + o(1)) (the sum is 4.55 at P = 11 and 24.06 at P = 97). At the other end, S(1/2)/(1/2) = 2 sum_p log(2p/(p+1)), about 1.39 pi(P) (4.74 at P = 11, 31.41 at P = 97, 228.9 at P = 997), and this edge value is what determines t*(1/2) in the table of section 4.2: log(t*(1/2)/2 pi) = 4.74, 31.41, 228.9 at P = 11, 97, 997. In either form, at height t the torus-uniform property holds only for P <= about (log(t/2 pi))^2/16. This is the coverage bound Q*(t_0) = (log(t_0/2 pi))^2/16 of `sq-causal-cascade` (obstruction map, item 18), re-derived here in lifted form.

**T3 (translation; PROVED).** For a completely multiplicative omega with |omega(p)| = 1, the lift of sum a_n omega(n) n^{-s} is the lift of sum a_n n^{-s} evaluated at the translated torus point (omega(p) w_p). Hence every property of the zeta lift that is uniform over the torus (S1, HB with its threshold, C, MA, min-modulus statements) holds verbatim for every unimodular twist, in particular tw2m and liou. With 0 <= eps_p <= 1 the twist is the evaluation at a point of the closed polydisc, so every property uniform over the closed polydisc (S1) holds for tw2h. **No torus-uniform property of the lift can separate zeta from a sign twist.** Only a statement about the one-parameter curve t -> (p^{-it})_p coupled to the archimedean phase can, and that coupling is the functional equation. Check (CERTIFIED): the translate phi_2 = pi of the zeta Euler section and the tw2m section have identical certified counts in the same window.

**T4 (products and ladders; PROVED).** (i) Euler lifts: prod_p f(eps_p w_p/sqrt p) with f(y) = (1 - y^{K+1})/(1 - y) or 1/(1 - y) and |eps_p| <= 1 has neither zero nor pole in |w_p| <= 1 (the zeros and poles of f are on |y| = 1 and |y| <= 2^{-1/2}). So S1 holds for zeta, tw2m, tw2h, liou at every P and K. The zero set of a product is a union of coordinate hypersurfaces {w_p = const}; this is the whole structural reason. (ii) Twin ladder (d): each ladder sum has Re f(y) > 0 on |y| <= 2^{-1/2} (|arg(1 - y^{K+1})| + |arg(1 - y)| <= pi/6 + pi/4 for K >= 1; Re 1/(1-y) > 0 for K = oo), so the additive ladder sum over primes has positive real part and S1 holds at every (P, M). **S1 therefore does not characterise multiplicativity: an additive sum of positive-real one-variable functions passes as well.** (iii) EA: 1/((1 - p^{a-1/2} w)(1 - p^{-a-1/2} w)) is zero- and pole-free on |w_p| <= 1 for a < 1/2, so the full EA Euler lift passes S1; its poles lie at |z_p| = p^{-a} < 1, inside the unit polydisc of the unnormalised variables (S1': temperedness, fails at P = 2). Its finite truncations K = 1, 2 do have zeros in the critical polydisc (the linear coefficient (p^a + p^{-a})/sqrt p exceeds 1 at p = 2 for a = 0.25). (iv) NR: the extra factor c + w_q + 1/w_q vanishes at the real point |w_q| = (|c| - sqrt(c^2-4))/2 < 1: S1 fails at P = q, with x_sup = arccosh(|c|/2)/log q, the known zero abscissa.

**T5 (DH phase criterion; PROVED, value CLASSICAL).** The K = oo DH lift vanishes iff prod_p (1 - chibar(p) y_p)/(1 - chi(p) y_p) = -c_2/c_1 = -e^{2i arctan kappa}. Primes p = +-1 mod 5 contribute 1. For chi(p) = +-i the factor is a Moebius image of the disc |y_p| <= r_p: a disc with centre (1 + r^2)/(1 - r^2) and radius 2r/(1 - r^2), whose argument range is |arg| <= 2 arctan r_p, attained at real y_p where the factor is unimodular. So a zero with |y_p| <= r_p exists iff sum_{p = +-2 mod 5, p <= P} 2 arctan(r_p) >= pi - 2 arctan kappa = 2.588018. At r_p = p^{-1/2}: p in {2, 3} gives 2.278157 (no zero), p in {2, 3, 7} gives 3.000891 (zero): **S1 fails for DH exactly from P = 7 on**, and x_sup(P) is the root of sum 2 arctan(p^{-1/2-x}) = 2.588018: 0.153042 (P = 7), 0.269668 (13), 0.377424 (23), 0.433974 (47), 0.476774 (97), 0.5568 (997). With all primes the root is 1/2 + x = 1.12036249, which reproduces the known supremum 1.1203625 of real parts of DH zeros quoted in the obstruction map (primes to 2e7 plus an exponential-integral tail; float64). The failure is the phase-matching condition of a two-term sum; a single product has no such condition.

**T6 (multi-affine symmetrisation; CLASSICAL, Grace-Walsh-Szego).** Polarising each variable (w_p^k -> e_k(w_p1..w_pd)/C(d,k)) preserves zero-freeness on a closed disc in both directions for polynomials of exact degree d. So MA followed by a polydisc stability test is S1 again. Checked on 11 objects (section 4.6): the two verdicts agree in every case.

**T7 (per-variable circle property; PROVED for K = 1).** For D = prod (1 + a_p w_p), with B = u prod_{p != q}(1 + a_p w_p) = |B| e^{i beta}, the equation in w_q is a_q B w^2 + 2 Re(B) w + a_q conj(B) = 0, i.e. a_q y^2 + 2 cos(beta) y + a_q = 0 for y = e^{i beta} w: both roots are on the circle iff |cos beta| <= a_q. Property C therefore fails on the fraction (2/pi) arccos(a_q) of the torus: 1/2 for p = 2 and more for every larger prime. It fails for zeta at the smallest size.

**T8 (theta form; PROVED).** For F(z) = 2 int_0^oo Phi(u) cos(zu) du with Phi smooth and rapidly decaying, two integrations by parts give F(z) = -2 Phi'(0)/z^2 + 2 Phi'''(0)/z^4 - ... (asymptotic series in the odd derivatives at 0). If Phi is even (theta modularity, i.e. the functional equation) every term vanishes and F is exponentially small and oscillating; otherwise F(t) ~ -2 Phi'(0)/t^2 and the real zeros stop at a finite height. For the N-term truncation of the zeta kernel Phi_N'(0) is of size e^{-pi (N+1)^2}, so the zeros persist to t of order 4 (N+1)^2: the theta form has a matched regime too, N of order sqrt(t)/2. For a twisted kernel Phi'(0) is of size 1 and the zeros stop at once.

**T9 (S1 is equivalent to eventual real-rootedness of a fixed finite object; PROVED, using CLASSICAL Kronecker + Hurwitz).** Let D be a fixed Dirichlet polynomial with real coefficients and D(+oo) != 0, and F(s) = G(s) D(s) + G(1-s) D(1-s).
(i) If S1 holds (x_sup < 0), then by T2 there is t* such that every zero of F with |Re s - 1/2| <= X and |t| >= t* is on the critical line, and the same holds for every torus translate of F.
(ii) If x_sup > 0, F has off-line zeros at arbitrarily large height. Proof: take a zero of the lift at (x_0, th_0) with 0 < x_0 < x_sup; the one-variable function s -> D(s; th_0) is a nonzero Dirichlet polynomial, so the zero is isolated. By Kronecker there are t_k -> oo with (t_k log p) -> th_0 mod 2 pi, D(s + i t_k) converges locally uniformly to D(s; th_0), and Hurwitz gives zeros s_k of D near 1/2 + x_0 + i t_k. There F(s)/G(s) = D(s) + (G(1-s)/G(s)) D(1-s) with |G(1-s)/G(s)| = (t/2 pi)^{-x}(1+o(1)) -> 0 uniformly on the disc, so F has a zero near s_k for large k (Hurwitz again). QED.
So for a finite object of fixed size, "the section is real-rooted above some height" is the same statement as S1, and it is automatically torus-uniform. The data of section 4 agree row by row: every object that passes S1 has off-line zeros only below its threshold, every object that fails S1 has them in every window run. **Consequence for the programme:** real-rootedness of fixed-size truncations is a property of the lifted Dirichlet factor alone; it holds for the Euler truncations of zeta and equally for those of every sign twist and for the additive twin ladder, and it holds only above a height t*(P) with log(t*/2 pi) >= 4 sqrt P (1 + o(1)). The zeros of zeta at height t are governed by objects of size growing with t (N about sqrt(t/2 pi) in the AFE, or P far beyond (log t)^2/16 in the Euler form), where S1 fails for the AFE form (N >= 3) and the threshold exceeds t for the Euler form.

## 3. Table

Entries: sizes passed / first failure. (C) = CERTIFIED by Arb, (S) = SCREENED in float64, (P) = PROVED in section 2. "n/f" = not formulable. Sizes are P for Euler-type objects, N for AFE and theta objects.

| Property x object | zeta | DH | tw2m, liou (TW-) | tw2h (TW+) | E_a (a = 0.25) | T-NR (q=3, c=2.2) |
|---|---|---|---|---|---|---|
| **S1**, Euler lift (c), K = 1 and K = oo | holds, all P (P); no zero found P <= 23 (S) | holds P = 2, 3 (C); **fails P = 7** and every P >= 7 (C for 7..47; P by T5) | holds, all P (P, T3); no zero found P <= 23 (S) | holds, all P (P); P <= 23 (S) | K = oo: holds (P) but S1' fails at P = 2 (P); K = 1, 2: fails P = 2 (S, x_sup 0.52, 0.32) | **fails P = q** (P) |
| S1, Euler lift, K = 2 | holds (P) | holds P = 2 (C); fails P = 3 (C for 3..23) | holds (P) | holds (P) | fails P = 2 (S) | fails P = q (P) |
| S1, twin ladder (d), any M | holds, all P (P) | n/f | holds (P, T3) | holds (P) | n/f | n/f |
| S1, sharp AFE lift (a) | holds N = 2 (C); **fails N = 3** (C for 3..48; S to 128) | holds N <= 5 (C); fails N = 6 (C for 6..48) | holds N = 2 (C); fails N = 3 (C for 3..48) | holds N <= 4 (C); fails N = 5 (C for 5..48) | fails N = 2 (C for 2..48) | n/f |
| S1, Riesz-weighted AFE lift | no zero N <= 30 (C for N <= 6, S for 7..30); fails N = 31 (C for 31..48) | no zero N <= 26 (C for N <= 10, S for 11..26); N = 27 undecided (S: x_sup = 1e-4); fails N = 28 (C for 28..48) | not run | not run | not run | n/f |
| **HB** threshold t*(X = 1/2), Euler K = 1 | finite for every P (P): 11.2, 25.1, 69.8, 213.8, 718.6, 2478, 8843, 3.19e4, 1.17e5 for P = 2..23; 2.8e14 at P = 97 | 1.58 (P = 2), 4.11 (P = 3); none for P >= 7 | same values as zeta (T3) | 9.05 ... 9.5e4 (P = 2..23) | none for K = 1 (S1 fails) | none |
| **R**, Euler K = 1 section, certified windows of length 50 on 3 < t < 2003 | all windows PASS for P = 2, 3, 5, 7 (C); **first FAIL P = 11** (C: windows from 3 and 53); P = 13: last FAIL window 303; off-line zeros only below t* in every case, also on the GPU screen to t = 30003 (S) | PASS P = 2, 3 (C; S to 30003); **FAIL P = 7** in 28 of 40 windows, up to the last one (C); no end to 30003 (S) | PASS P = 2, 3 (C); FAIL P = 5 (first window) (C) | PASS P <= 7 (C); FAIL P = 11 (first window) (C) | FAIL P = 2 (windows 53..353) and P >= 3 in every window (C) | FAIL in every window, P = 3..13 (C) |
| **R**, sharp AFE section on its matched window | PASS N = 1, 2, 3, 4 (C); **first FAIL N = 5** (C; witness 0.609410680661 + 221.078884111 i); FAIL in 37 of the 49 sizes N = 1..50 run (C) | PASS N <= 7 (C); first FAIL N = 8 (C) | PASS N = 1, 2; first FAIL N = 3 (C) | PASS N <= 6; first FAIL N = 7 (C) | not run (degree 2) | n/f |
| R, sharp AFE section, fixed N, all heights | N = 1: all 22495 zeros below 20003 on the line (S), 40/40 windows to 2003 (C); N = 2: off-line pair only in the first window (C); N >= 3: FAIL in every range (C, S) = S1 fails | N <= 5: all 27618 zeros on the line (S; C to 2003 for N <= 3, to 953 for N = 4, 5); N >= 7 FAIL throughout | N <= 2 all on the line (S); N >= 3 FAIL throughout (S) | not run on fixed windows | not run | n/f |
| **R**, theta form (b) in its matched regime, and the function itself | PASS at every size run: N = 10 to t = 153 (real counts C, totals point-sampled); the function itself: 100/100 windows to t = 5003, 4524 zeros (C). This is verified height restated | function itself: PASS on (3, 53), **FAIL from the window (53, 103)** (C); 28 of 31 windows to 1553 FAIL, 104 off-line zeros of 1513; N = 14 theta truncation: 2 non-real zeros in each of (63, 93) and (93, 123) (point-sampled) | zero count collapses: 1 zero in (3, 33) and none above: none in (33, 63) for N = 2, 3, 4 and none in (33, 153) for N = 10 (zeta has 5, 9, 12, 14, 14 in these windows) | same as TW- | n/f in this library | the function has off-line zeros at every height (P) |
| **C**, circle property in each variable | fails at P = 2: holds on the fraction 1/2 of the torus for w_2, 0.39 for w_3, 0.18 for w_13 (P for K = 1, T7; S agrees to 0.015) | fails (S: 0.31-0.38) | same as zeta (T3) | fails (S: 0.24 for w_2) | not run | not run |
| MA, multi-affine symmetrisation then S1 | same verdict as S1 in all 11 cases run (S); equivalence is CLASSICAL (T6) | same | same | same | not run | not run |
| Q(x0), zeros of the main sum right of 1/2 + x0 in the matched window | zeros from N = 3 (x0 <= 0.2), N = 5 (0.3), N = 11 (0.4) (C); counts within 10% of random translates | zeros from N = 7 (C) | from N = 3 (C) | from N = 5 (C) | not run | n/f |
| TR, sections through translated torus points (AFE, matched) | 30/30 real-rooted at N = 2; 5/30 at N = 3; 0 of 12 for each N = 5..13 (C); about 21% of zeros off the line for random translates at N = 20..40 (S) | n/a | (these are translates of zeta) | n/a | n/a | n/a |

Reading the table against the task's target ("holds for the zeta lift at every size tested and fails for each control at a finite size"):
- S1 for the Euler lift meets it for DH (P = 7), T-NR (P = q) and truncated E_a (P = 2), and provably cannot meet it for TW-, TW+, Beurling products or the additive ladder.
- R for the theta form / the function itself meets it for DH (window (53, 103)) and for the twists (first window above t = 33), but for zeta it is the verified-height statement and has no multivariate content: a translation of the torus by 0.01 rad in the variable w_2 already removes every zero from (33, 153) (T8).
- Every other row fails for zeta at a finite size.

## 4. Data

### 4.1 S1: zeros of the lifted Dirichlet factor in the critical polydisc

Screen: GPU float64, Gauss-Newton on (x, phases) from B random starts, then climbing in x along the zero set (B = 50,000-200,000 starts, 500 iterations per object). Certificates: `s1zero` = a zero with all |w_p| < 1 isolated by `acb_poly.roots()` at 256 bits; `s1pass` = interval subdivision of the torus plus the diagonal slice (objects in at most 3 variables).

| object | input | sizes screened | first size with a zero in the polydisc | x_sup there | x_sup at largest size | certified zero (sizes) | certified zero-free (sizes) |
|---|---|---|---|---|---|---|---|
| AFE riesz1 | dh | 2..48 | 27 | 0.0001 | 0.1121 | 28..48 (21) | 2..10 (9) |
| AFE sharp | dh | 2..48 | 6 | 0.1779 | 0.4913 | 6..48 (43) | 2..5 (4) |
| AFE sharp | ea:0.25 | 2..48 | 2 | 0.5216 | 0.9278 | 2..48 (47) | - |
| AFE sharp | liou | 2..48 | 3 | 0.2879 | 0.4785 | 3..48 (46) | 2 |
| AFE sharp | tw2h | 2..48 | 5 | 0.2032 | 0.4041 | 5..48 (44) | 2,3,4 |
| AFE sharp | tw2m | 2..48 | 3 | 0.2879 | 0.4473 | 3..48 (46) | 2 |
| AFE riesz1 | zeta | 2..48 | 31 | 0.0040 | 0.0474 | 31..48 (18) | 2..6 (5) |
| AFE sharp | zeta | 2..48 | 3 | 0.2879 | 0.4960 | 3..48 (46) | 2 |
| Euler K=oo | dh | 2..47 | 7 | 0.1530 | 0.3806 | 7..47 (12) | 2,3 |
| Euler K=1 | dh | 2..47 | 7 | 0.1530 | 0.3823 | 7..47 (12) | 2,3 |
| Euler K=2 | dh | 2..23 | 3 | 0.2135 | 0.4799 | 3..23 (7) | 2 |
| Euler K=1 | liou | 2..23 | none | - | no zero | - | - |
| Euler K=2 | liou | 2..3 | none | - | no zero | - | - |
| Euler K=1 | tw2h | 2..23 | none | - | no zero | - | - |
| Euler K=2 | tw2h | 2..13 | none | - | no zero | - | - |
| Euler K=1 | tw2m | 2..23 | none | - | no zero | - | - |
| Euler K=2 | tw2m | 2..13 | none | - | no zero | - | - |
| Euler K=1 | zeta | 2..23 | none | - | no zero | - | - |
| Euler K=2 | zeta | 2..13 | none | - | no zero | - | - |

Notes. x_sup values from the screen are lower bounds (largest zero found). Larger sizes (`big_s1x.jsonl`, 40,000 starts each, N = 52, 56, ..., 128): a zero in the polydisc was found at every size for sharp zeta, sharp DH, sharp tw2h, Riesz zeta and Riesz DH (largest x found at N = 128: 0.408, 0.484, 0.373, 0.092, 0.222). The Euler rows for zeta, tw2m, tw2h, liou are sanity runs of the proved statement T4(i); the S1 unit was stopped before the liou K = 2 and E_a Euler rows completed (E_a Euler K = 1, 2 at P = 3, 5 were screened locally: x_sup = 0.5216, 0.3211; for K = 1 the zero is explicit, w_2 = -sqrt 2/(2^{1/4} + 2^{-1/4}) = -0.697).

### 4.2 Torus-uniform threshold t*(X) (T2)

Closed form (sum over primes of one-variable suprema, float64) for products; 2-variable grid for DH. X = 1/2 for K finite, 0.45 for K = oo. Adversarial check on the GPU (4,000,000 random torus points per x, then 300 ascent steps from the best 2,000): for products the largest value found never exceeds the closed form; for the two DH cases it exceeds the 400 x 400 grid value by at most 4e-6.

| P | zeta K=1 | zeta K=2 | zeta K=oo (X=0.45) | tw2h K=1 | DH K=1 | DH K=2 | DH K=oo |
|---|---|---|---|---|---|---|---|
| 2 | 11.17 | 18.46 | 2271 | 9.048 | 1.579 | 3.284 | 270.5 |
| 3 | 25.13 | 79.65 | 5.808e+05 | 20.36 | 4.105 | oo (S1 fails) | 8.819e+04 |
| 5 | 69.81 | 466.2 | 9.97e+07 | 56.55 | - | - | - |
| 7 | 213.8 | 3101 | 1.345e+10 | 173.2 | - | - | - |
| 11 | 718.6 | 2.31e+04 | 1.345e+12 | 582.1 | - | - | - |
| 13 | 2478 | 1.773e+05 | 1.212e+14 | 2008 | - | - | - |
| 17 | 8843 | 1.414e+06 | 9.323e+15 | 7163 | - | - | - |
| 19 | 3.192e+04 | 1.143e+07 | 6.729e+17 | 2.586e+04 | - | - | - |
| 23 | 1.173e+05 | 9.41e+07 | 4.37e+19 | 9.499e+04 | - | - | - |
| 29 | 4.383e+05 | 7.895e+08 | 2.511e+21 | 3.551e+05 | - | - | - |
| 37 | 6.24e+06 | 5.67e+10 | 7.087e+24 | 5.055e+06 | - | - | - |
| 47 | 3.485e+08 | 3.596e+13 | 7.34e+29 | 2.823e+08 | - | - | - |
| 97 | 2.761e+14 | 9.435e+22 | 4.025e+45 | 2.236e+14 | - | - | - |
| 199 | 9.073e+26 | 7.698e+42 | 1.117e+76 | 7.35e+26 | - | - | - |
| 997 | 1.56e+100 | oo (S1 fails) | oo (S1 fails) | 1.263e+100 | - | - | - |

(tw2m and liou have the same thresholds as zeta: T3. DH for P >= 7: no finite threshold, T5.)

GPU adversarial check (`hb` stage): object, sup found at x = 0.5, closed form, excess:

- zeta 11 1: 2.369724 vs 2.369724 (max excess over all x: -3.6e-09)
- zeta 11 2: 4.10482 vs 4.10482 (max excess over all x: -2.8e-08)
- zeta 23 1: 4.917191 vs 4.917194 (max excess over all x: -2.7e-07)
- zeta 23 2: 8.260964 vs 8.26097 (max excess over all x: -7.3e-07)
- zeta 47 1: 8.915574 vs 8.915618 (max excess over all x: -6.4e-06)
- zeta 47 2: 14.687635 vs 14.687765 (max excess over all x: -1.8e-05)
- zeta 97 1: 15.700754 vs 15.706938 (max excess over all x: -1.0e-03)
- zeta 97 2: 25.418753 vs 25.531708 (max excess over all x: -8.4e-03)
- tw2h 23 1: 4.811832 vs 4.811833 (max excess over all x: -2.3e-07)
- dh 3 1: 0.591893 vs 0.591889 (max excess over all x: 3.7e-06)
- dh 2 2: 0.480382 vs 0.480381 (max excess over all x: 2.3e-06)

### 4.3 Sections of Euler-type objects (c) and of the twin ladder (d): certified windows

Windows of length 50 from t = 3.0137, |Re s - 1/2| < 0.5 (0.45 for K = oo and for the ladder). PASS = every zero in the window certified on the line; FAIL = certified zero off the line.

| scheme | input | P | K | windows run (t up to) | PASS | FAIL | UNRES | last window with FAIL starts at | t* (T2) |
|---|---|---|---|---|---|---|---|---|---|
| euler | dh | 2 | 1 | 40 (2003) | 40 | 0 | 0 | - | 1.579 |
| euler | dh | 3 | 1 | 40 (2003) | 40 | 0 | 0 | - | 4.105 |
| euler | dh | 5 | 1 | 40 (2003) | 40 | 0 | 0 | - | 4.105 |
| euler | dh | 7 | 1 | 40 (2003) | 12 | 28 | 0 | 1953 | oo (S1 fails) |
| euler | dh | 11 | 1 | 40 (2003) | 14 | 26 | 0 | 1953 | oo (S1 fails) |
| euler | dh | 13 | 1 | 40 (2003) | 9 | 31 | 0 | 1953 | oo (S1 fails) |
| euler | dh | 17 | 1 | 8 (403) | 1 | 7 | 0 | 353 | oo (S1 fails) |
| euler | dh | 19 | 1 | 8 (403) | 1 | 7 | 0 | 353 | oo (S1 fails) |
| euler | dh | 23 | 1 | 8 (403) | 1 | 7 | 0 | 353 | oo (S1 fails) |
| euler | dh | 2 | 2 | 8 (403) | 8 | 0 | 0 | - | 3.284 |
| euler | dh | 3 | 2 | 8 (403) | 3 | 5 | 0 | 353 | oo (S1 fails) |
| euler | dh | 5 | 2 | 8 (403) | 3 | 5 | 0 | 353 | oo (S1 fails) |
| euler | dh | 7 | 2 | 8 (403) | 0 | 8 | 0 | 353 | oo (S1 fails) |
| euler | dh | 11 | 2 | 8 (403) | 0 | 8 | 0 | 353 | oo (S1 fails) |
| euler | dh | 2 | oo | 8 (403) | 5 | 3 | 0 | 153 | 270.5 |
| euler | dh | 3 | oo | 8 (403) | 3 | 5 | 0 | 303 | 8.819e+04 |
| euler | dh | 5 | oo | 8 (403) | 3 | 5 | 0 | 303 | 8.819e+04 |
| euler | ea:0.1 | 2 | 1 | 8 (403) | 2 | 6 | 0 | 353 |  |
| euler | ea:0.1 | 3 | 1 | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | ea:0.1 | 5 | 1 | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | ea:0.1 | 2 | oo | 8 (403) | 6 | 2 | 0 | 253 |  |
| euler | ea:0.1 | 3 | oo | 8 (403) | 6 | 2 | 0 | 103 |  |
| euler | ea:0.1 | 5 | oo | 8 (403) | 5 | 3 | 0 | 203 |  |
| euler | ea:0.25 | 2 | 1 | 40 (2003) | 35 | 5 | 0 | 353 |  |
| euler | ea:0.25 | 3 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | ea:0.25 | 5 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | ea:0.25 | 7 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | ea:0.25 | 11 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | ea:0.25 | 13 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | ea:0.4 | 2 | 1 | 8 (403) | 7 | 1 | 0 | 103 |  |
| euler | ea:0.4 | 3 | 1 | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | ea:0.4 | 5 | 1 | 8 (403) | 1 | 7 | 0 | 353 |  |
| euler | liou | 2 | 1 | 40 (2003) | 40 | 0 | 0 | - | 11.17 |
| euler | liou | 3 | 1 | 40 (2003) | 40 | 0 | 0 | - | 25.13 |
| euler | liou | 5 | 1 | 40 (2003) | 39 | 1 | 0 | 3 | 69.81 |
| euler | liou | 7 | 1 | 40 (2003) | 39 | 1 | 0 | 3 | 213.8 |
| euler | liou | 11 | 1 | 40 (2003) | 35 | 5 | 0 | 403 | 718.6 |
| euler | liou | 13 | 1 | 40 (2003) | 25 | 15 | 0 | 1153 | 2478 |
| euler | liou | 17 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 8843 |
| euler | liou | 19 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 3.192e+04 |
| euler | liou | 23 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 1.173e+05 |
| euler | liou | 2 | 2 | 8 (403) | 8 | 0 | 0 | - | 18.46 |
| euler | liou | 3 | 2 | 8 (403) | 7 | 1 | 0 | 3 | 79.65 |
| euler | liou | 5 | 2 | 8 (403) | 5 | 3 | 0 | 153 | 466.2 |
| euler | liou | 7 | 2 | 8 (403) | 2 | 6 | 0 | 303 | 3101 |
| euler | liou | 11 | 2 | 8 (403) | 0 | 8 | 0 | 353 | 2.31e+04 |
| euler | liou | 2 | oo | 8 (403) | 2 | 6 | 0 | 303 | 2271 |
| euler | liou | 3 | oo | 8 (403) | 1 | 7 | 0 | 303 | 5.808e+05 |
| euler | liou | 5 | oo | 8 (403) | 0 | 8 | 0 | 353 | 9.97e+07 |
| euler | nr:2:2.2 | 5 | 1 | 8 (403) | 8 | 0 | 0 | - |  |
| euler | nr:2:2.2 | 5 | oo | 8 (403) | 8 | 0 | 0 | - |  |
| euler | nr:3:2.01 | 5 | 1 | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | nr:3:2.01 | 5 | oo | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | nr:3:2.2 | 3 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | nr:3:2.2 | 5 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | nr:3:2.2 | 7 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | nr:3:2.2 | 11 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | nr:3:2.2 | 13 | 1 | 40 (2003) | 0 | 40 | 0 | 1953 |  |
| euler | nr:3:3 | 5 | 1 | 8 (403) | 8 | 0 | 0 | - |  |
| euler | nr:3:3 | 5 | oo | 8 (403) | 8 | 0 | 0 | - |  |
| euler | nr:5:2.5 | 5 | 1 | 8 (403) | 0 | 8 | 0 | 353 |  |
| euler | nr:5:2.5 | 5 | oo | 8 (403) | 8 | 0 | 0 | - |  |
| euler | tw2h | 2 | 1 | 40 (2003) | 40 | 0 | 0 | - | 9.048 |
| euler | tw2h | 3 | 1 | 40 (2003) | 40 | 0 | 0 | - | 20.36 |
| euler | tw2h | 5 | 1 | 40 (2003) | 40 | 0 | 0 | - | 56.55 |
| euler | tw2h | 7 | 1 | 40 (2003) | 40 | 0 | 0 | - | 173.2 |
| euler | tw2h | 11 | 1 | 40 (2003) | 39 | 1 | 0 | 3 | 582.1 |
| euler | tw2h | 13 | 1 | 40 (2003) | 35 | 5 | 0 | 353 | 2008 |
| euler | tw2h | 17 | 1 | 8 (403) | 2 | 6 | 0 | 353 | 7163 |
| euler | tw2h | 19 | 1 | 8 (403) | 1 | 7 | 0 | 353 | 2.586e+04 |
| euler | tw2h | 23 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 9.499e+04 |
| euler | tw2h | 2 | 2 | 8 (403) | 8 | 0 | 0 | - | 11.17 |
| euler | tw2h | 3 | 2 | 8 (403) | 8 | 0 | 0 | - | 48.18 |
| euler | tw2h | 5 | 2 | 8 (403) | 8 | 0 | 0 | - | 282 |
| euler | tw2h | 7 | 2 | 8 (403) | 6 | 2 | 0 | 53 | 1876 |
| euler | tw2h | 11 | 2 | 8 (403) | 1 | 7 | 0 | 353 | 1.397e+04 |
| euler | tw2h | 2 | oo | 8 (403) | 8 | 0 | 0 | - | 13.99 |
| euler | tw2h | 3 | oo | 8 (403) | 3 | 5 | 0 | 353 | 3578 |
| euler | tw2h | 5 | oo | 8 (403) | 2 | 6 | 0 | 353 | 6.142e+05 |
| euler | tw2m | 2 | 1 | 40 (2003) | 40 | 0 | 0 | - | 11.17 |
| euler | tw2m | 3 | 1 | 40 (2003) | 40 | 0 | 0 | - | 25.13 |
| euler | tw2m | 5 | 1 | 40 (2003) | 39 | 1 | 0 | 3 | 69.81 |
| euler | tw2m | 7 | 1 | 40 (2003) | 38 | 2 | 0 | 53 | 213.8 |
| euler | tw2m | 11 | 1 | 40 (2003) | 34 | 6 | 0 | 253 | 718.6 |
| euler | tw2m | 13 | 1 | 40 (2003) | 25 | 15 | 0 | 953 | 2478 |
| euler | tw2m | 17 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 8843 |
| euler | tw2m | 19 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 3.192e+04 |
| euler | tw2m | 23 | 1 | 8 (403) | 0 | 8 | 0 | 353 | 1.173e+05 |
| euler | tw2m | 2 | 2 | 8 (403) | 8 | 0 | 0 | - | 18.46 |
| euler | tw2m | 3 | 2 | 8 (403) | 7 | 1 | 0 | 3 | 79.65 |
| euler | tw2m | 5 | 2 | 8 (403) | 4 | 4 | 0 | 303 | 466.2 |
| euler | tw2m | 7 | 2 | 8 (403) | 1 | 7 | 0 | 303 | 3101 |
| euler | tw2m | 11 | 2 | 8 (403) | 0 | 8 | 0 | 353 | 2.31e+04 |
| euler | tw2m | 2 | oo | 8 (403) | 2 | 6 | 0 | 303 | 2271 |
| euler | tw2m | 3 | oo | 8 (403) | 0 | 8 | 0 | 353 | 5.808e+05 |
| euler | tw2m | 5 | oo | 8 (403) | 0 | 8 | 0 | 353 | 9.97e+07 |
| euler | zeta | 2 | 1 | 40 (2003) | 40 | 0 | 0 | - | 11.17 |
| euler | zeta | 3 | 1 | 40 (2003) | 40 | 0 | 0 | - | 25.13 |
| euler | zeta | 5 | 1 | 40 (2003) | 40 | 0 | 0 | - | 69.81 |
| euler | zeta | 7 | 1 | 40 (2003) | 40 | 0 | 0 | - | 213.8 |
| euler | zeta | 11 | 1 | 40 (2003) | 38 | 2 | 0 | 53 | 718.6 |
| euler | zeta | 13 | 1 | 60 (3003) | 57 | 3 | 0 | 303 | 2478 |
| euler | zeta | 17 | 1 | 114 (5703) | 94 | 20 | 0 | 2203 | 8843 |
| euler | zeta | 19 | 1 | 113 (5653) | 66 | 47 | 0 | 4653 | 3.192e+04 |
| euler | zeta | 23 | 1 | 113 (5653) | 32 | 81 | 0 | 5603 | 1.173e+05 |
| euler | zeta | 2 | 2 | 40 (2003) | 40 | 0 | 0 | - | 18.46 |
| euler | zeta | 3 | 2 | 40 (2003) | 40 | 0 | 0 | - | 79.65 |
| euler | zeta | 5 | 2 | 40 (2003) | 39 | 1 | 0 | 3 | 466.2 |
| euler | zeta | 7 | 2 | 40 (2003) | 36 | 4 | 0 | 303 | 3101 |
| euler | zeta | 11 | 2 | 40 (2003) | 20 | 20 | 0 | 1803 | 2.31e+04 |
| euler | zeta | 2 | oo | 20 (1003) | 7 | 13 | 0 | 953 | 2271 |
| euler | zeta | 3 | oo | 20 (1003) | 7 | 13 | 0 | 953 | 5.808e+05 |
| euler | zeta | 5 | oo | 20 (1003) | 7 | 13 | 0 | 953 | 9.97e+07 |
| ladder | zeta | 2 | 1 | 39 (1953) | 39 | 0 | 0 | - |  |
| ladder | zeta | 3 | 1 | 39 (1953) | 39 | 0 | 0 | - |  |
| ladder | zeta | 5 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 7 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 11 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 13 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 23 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 47 | 1 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 2 | 4 | 39 (1953) | 39 | 0 | 0 | - |  |
| ladder | zeta | 3 | 4 | 39 (1953) | 39 | 0 | 0 | - |  |
| ladder | zeta | 5 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 7 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 11 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 13 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 23 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 47 | 4 | 38 (1903) | 38 | 0 | 0 | - |  |
| ladder | zeta | 2 | oo | 39 (1953) | 17 | 22 | 0 | 1853 |  |
| ladder | zeta | 3 | oo | 39 (1953) | 26 | 13 | 0 | 853 |  |
| ladder | zeta | 5 | oo | 38 (1903) | 32 | 6 | 0 | 553 |  |
| ladder | zeta | 7 | oo | 38 (1903) | 35 | 3 | 0 | 153 |  |
| ladder | zeta | 11 | oo | 38 (1903) | 34 | 4 | 0 | 153 |  |
| ladder | zeta | 13 | oo | 38 (1903) | 35 | 3 | 0 | 153 |  |
| ladder | zeta | 23 | oo | 38 (1903) | 37 | 1 | 0 | 53 |  |
| ladder | zeta | 47 | oo | 38 (1903) | 38 | 0 | 0 | - |  |

**GPU screen of the same sections on 3 < t < 30003** (windows of length 1000, float64; "last" = start of the last window containing an off-line zero in |Re s - 1/2| < 0.5 (0.45 for K = oo)):

| input | K | P=2 | P=3 | P=5 | P=7 | P=11 | P=13 | P=17 | P=19 | P=23 | P=29 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| dh | oo | 16 off, last 3 | 146 off, last 28003 | 146 off, last 28003 | 1928 off, last 29003 | 2250 off, last 29003 (2 unres.) | 3124 off, last 29003 (7 unres.) | 4338 off, last 29003 (5 unres.) | 5164 off, last 29003 (6 unres.) | 6536 off, last 29003 (8 unres.) | 7552 off, last 29003 (15 unres.) |
| liou | oo | 82 off, last 2003 | 398 off, last 29003 (1 unres.) | 860 off, last 29003 (3 unres.) | 1524 off, last 29003 (2 unres.) | 2400 off, last 29003 (3 unres.) | 3246 off, last 29003 (5 unres.) | 4132 off, last 29003 (6 unres.) | 5374 off, last 29003 (11 unres.) | 6504 off, last 29003 (10 unres.) | 7588 off, last 29003 (12 unres.) |
| nr:3:2.2 | oo |  | 10708 off, last 29003 | 10996 off, last 29003 (2 unres.) | 11330 off, last 29003 (2 unres.) | 11904 off, last 29003 (5 unres.) | 12452 off, last 29003 (3 unres.) | 13180 off, last 29003 (5 unres.) | 14100 off, last 29003 (11 unres.) | 15018 off, last 29003 (15 unres.) | 16134 off, last 29003 (10 unres.) |
| tw2h | oo | none | 72 off, last 2003 | 334 off, last 29003 (1 unres.) | 742 off, last 29003 (5 unres.) | 1282 off, last 29003 (4 unres.) | 1868 off, last 29003 (3 unres.) | 2576 off, last 29003 (8 unres.) | 3526 off, last 29003 (9 unres.) | 4416 off, last 29003 (10 unres.) | 5640 off, last 29003 (16 unres.) |
| tw2m | oo | 82 off, last 2003 | 356 off, last 29003 | 964 off, last 29003 (2 unres.) | 1736 off, last 29003 (2 unres.) | 2618 off, last 29003 (1 unres.) | 3620 off, last 29003 (5 unres.) | 4902 off, last 29003 (8 unres.) | 6008 off, last 29003 (8 unres.) | 7346 off, last 29003 (7 unres.) | 8612 off, last 29003 (10 unres.) |
| zeta | oo | 58 off, last 2003 (1 unres.) | 218 off, last 29003 | 506 off, last 29003 (2 unres.) | 840 off, last 29003 (2 unres.) | 1414 off, last 29003 (5 unres.) | 1962 off, last 29003 (3 unres.) | 2690 off, last 29003 (5 unres.) | 3610 off, last 29003 (11 unres.) | 4528 off, last 29003 (15 unres.) | 5644 off, last 29003 (10 unres.) |
| dh | 1 | none | none | none | 1432 off, last 29003 | 1380 off, last 29003 | 1810 off, last 29003 | 2234 off, last 29003 | 2250 off, last 29003 | 2610 off, last 29003 | 2714 off, last 29003 |
| ea:0.25 | 1 | 12 off, last 3 | 10356 off, last 29003 | 10230 off, last 29003 | 10152 off, last 29003 (1 unres.) | 10356 off, last 29003 (5 unres.) | 11518 off, last 29003 (3 unres.) | 13540 off, last 29003 (4 unres.) | 18832 off, last 29003 (1 unres.) | 34896 off, last 29003 (9 unres.) | 75212 off, last 29003 (9 unres.) |
| liou | 1 | none | none | 2 off, last 3 | 4 off, last 3 | 32 off, last 3 | 90 off, last 1003 | 194 off, last 4003 | 468 off, last 14003 | 1078 off, last 28003 | 2292 off, last 29003 (1 unres.) |
| nr:3:2.2 | 1 |  | 10490 off, last 29003 | 10490 off, last 29003 | 10490 off, last 29003 | 10498 off, last 29003 | 10508 off, last 29003 | 10576 off, last 29003 | 10708 off, last 29003 | 11102 off, last 29003 (2 unres.) | 11904 off, last 29003 |
| tw2h | 1 | none | none | none | none | 4 off, last 3 | 12 off, last 3 (1 unres.) | 54 off, last 1003 | 172 off, last 6003 (1 unres.) | 452 off, last 24003 (1 unres.) | 1110 off, last 29003 (1 unres.) |
| tw2m | 1 | none | none | 2 off, last 3 | 12 off, last 3 | 44 off, last 3 | 86 off, last 3 | 234 off, last 3003 | 586 off, last 16003 | 1330 off, last 28003 (2 unres.) | 2646 off, last 29003 (2 unres.) |
| zeta | 1 | none | none | none | none | 8 off, last 3 | 18 off, last 3 | 86 off, last 2003 | 218 off, last 13003 | 612 off, last 29003 (2 unres.) | 1414 off, last 29003 |

### 4.4 Sharp AFE sections (a)

**Matched windows, certified** (each size N on its own window 2 pi N^2/q < t < 2 pi (N+1)^2/q, |Re s - 1/2| < 1):

| input | sizes run | PASS | FAIL | UNRES | first FAIL | zeros counted | certified off-line zeros |
|---|---|---|---|---|---|---|---|
| zeta | 1..50 (49) | 11 (N = 1,2,3,4,6,7,11,13,15,20,22) | 37 | 1 | N = 5 | 17079 | 206 |
| dh | 1..112 (112) | 10 (N = 1,2,3,4,5,6,7,10,12,14) | 102 | 0 | N = 8 | 21589 | 1952 |
| tw2m | 1..50 (48) | 2 (N = 1,2) | 46 | 0 | N = 3 | 16328 | 3592 |
| liou | 1..50 (50) | 2 (N = 1,2) | 48 | 0 | N = 3 | 17851 | 3882 |
| tw2h | 1..50 (50) | 8 (N = 1,2,3,4,5,6,8,9) | 42 | 0 | N = 7 | 17852 | 946 |

**Matched windows, GPU screen** (float64 winding and sign changes; fraction of zeros off the line by range of N):

| input | N range | max t | windows with off-line zeros | N 1-10 | 11-30 | 31-100 | 101-200 | 201-400 | 401-600 |
|---|---|---|---|---|---|---|---|---|---|
| zeta | 1..600 | 2.27e+06 | 589/600 | 0.0217 | 0.0127 | 0.0084 | 0.0052 | 0.0038 | 0.0028 |
| dh | 1..400 | 2.02e+05 | 390/400 | 0.0435 | 0.0658 | 0.0924 | 0.0991 | 0.1035 | - |
| tw2m | 1..150 | 1.43e+05 | 148/150 | 0.1304 | 0.2108 | 0.2399 | 0.2493 | - | - |
| liou | 1..150 | 1.43e+05 | 148/150 | 0.1525 | 0.2012 | 0.2341 | 0.2403 | - | - |
| tw2h | 1..150 | 1.43e+05 | 142/150 | 0.0087 | 0.0456 | 0.0659 | 0.0760 | - | - |

**Fixed N on 3 < t < 20003, GPU screen** (zeros in |Re s - 1/2| < 1; off = not on the line), and certified windows of length 50:

| input | N | S1 | zeros | off-line | windows (of 80, length 250) with off-line zeros | certified windows PASS/FAIL (t up to) |
|---|---|---|---|---|---|---|
| zeta | 1 | holds | 22495 | 0 | 0 | 40/0 (2003) |
| zeta | 2 | holds | 22498 | 2 | 1 | 39/1 (2003) |
| zeta | 3 | fails | 22498 | 1992 | 80 | 1/39 (2003) |
| zeta | 4 | fails | 22497 | 1620 | 80 | 5/17 (1103) |
| zeta | 5 | fails | 22497 | 2806 | 80 | 2/20 (1103) |
| zeta | 7 | fails | 22498 | 2888 | 80 | 2/20 (1103) |
| zeta | 10 | fails | 22501 | 3198 | 80 | 5/17 (1103) |
| zeta | 15 | fails | 22506 | 3892 | 80 | - |
| zeta | 20 | fails | 22508 | 4202 | 79 | 1/21 (1103) |
| zeta | 30 | fails | 22515 | 3996 | 80 | - |
| zeta | 50 | fails | 22521 | 4108 | 80 | - |
| dh | 1 | holds | 27618 | 0 | 0 | 40/0 (2003) |
| dh | 2 | holds | 27618 | 0 | 0 | 40/0 (2003) |
| dh | 3 | holds | 27618 | 0 | 0 | 40/0 (2003) |
| dh | 4 | holds | 27618 | 0 | 0 | 22/0 (1103) |
| dh | 5 | holds | 27618 | 0 | 0 | 22/0 (1103) |
| dh | 7 | fails | 27618 | 1550 | 80 | 3/19 (1103) |
| dh | 10 | fails | 27618 | 1900 | 80 | 1/21 (1103) |
| dh | 15 | fails | 27618 | 2312 | 80 | - |
| dh | 20 | fails | 27618 | 2718 | 80 | 3/19 (1103) |
| dh | 30 | fails | 27618 | 3216 | 80 | - |
| dh | 50 | fails | 27618 | 3452 | 80 | - |
| tw2m | 1 | holds | 22495 | 0 | 0 | - |
| tw2m | 2 | holds | 22495 | 0 | 0 | - |
| tw2m | 3 | fails | 22497 | 1942 | 80 | - |
| tw2m | 4 | fails | 22497 | 1596 | 80 | - |
| tw2m | 5 | fails | 22499 | 2796 | 80 | - |
| tw2m | 7 | fails | 22501 | 2886 | 80 | - |
| tw2m | 10 | fails | 22503 | 3204 | 80 | - |
| tw2m | 15 | fails | 22513 | 3792 | 80 | - |
| tw2m | 20 | fails | 22521 | 4232 | 80 | - |
| tw2m | 30 | fails | 22532 | 4712 | 80 | - |
| tw2m | 50 | fails | 22560 | 5392 | 80 | - |
| liou | 1 | holds | 22495 | 0 | 0 | - |
| liou | 2 | holds | 22495 | 0 | 0 | - |
| liou | 3 | fails | 22497 | 1992 | 80 | - |
| liou | 4 | fails | 22499 | 1640 | 80 | - |
| liou | 5 | fails | 22499 | 2810 | 80 | - |
| liou | 7 | fails | 22501 | 2860 | 80 | - |
| liou | 10 | fails | 22503 | 3196 | 80 | - |
| liou | 15 | fails | 22511 | 3902 | 80 | - |
| liou | 20 | fails | 22511 | 4432 | 80 | - |
| liou | 30 | fails | 22521 | 4770 | 80 | - |
| liou | 50 | fails | 22549 | 5272 | 80 | - |

### 4.5 Torus translates (TR)

**AFE, matched windows, certified.** For each N: 30 random torus points (independent uniform phases for all p <= N), 11 points on the line phi_2 = 2 pi k/12, and the single flips phi_p = pi.

| N | random: real-rooted / run | random: mean off-line zeros | line phi_2: real-rooted / run | diagonal verdict |
|---|---|---|---|---|
| 2 | 30/30 | 0.0 | 11/11 | PASS |
| 3 | 5/30 | 2.3 | 1/11 | PASS |
| 4 | 4/30 | 3.5 | 1/11 | PASS |
| 5 | 0/12 | 5.8 | 0/11 | FAIL |
| 6 | 0/12 | 5.8 | 0/11 | PASS |
| 7 | 0/12 | 10.2 | 0/11 | PASS |
| 8 | 0/12 | 13.3 | 0/11 | FAIL |
| 9 | 0/12 | 17.0 | 0/11 | FAIL |
| 10 | 0/12 | 14.8 | 0/11 | FAIL |
| 11 | 0/12 | 21.5 | 0/11 | PASS |
| 12 | 0/12 | 21.5 | 0/11 | FAIL |
| 13 | 0/12 | 30.7 | 0/11 | PASS |
| 14 | 0/2 | 25.0 | 0/0 | FAIL |

**AFE, matched windows, GPU screen** (60 random torus points per N; 24 points on the line phi_2):

| N | diagonal off/tot | random: fraction real-rooted | random: mean off / mean tot | line phi_2 = 2 pi k/24, off-line zeros for k = 0..23 |
|---|---|---|---|---|
| 2 | 0/8 | 1.00 | 0.0/9.4 | 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 |
| 3 | 0/17 | 0.13 | 2.7/17.4 | 0 0 0 2 2 4 4 4 4 4 2 2 2 4 4 4 4 4 6 4 4 4 2 2 |
| 4 | 0/27 | 0.18 | 2.7/27.1 | 0 2 2 2 6 2 0 2 2 4 2 4 4 4 2 0 2 2 2 4 4 4 2 0 |
| 5 | 2/38 | 0.00 | 5.8/37.7 | 2 0 4 4 4 8 12 10 10 8 8 8 10 12 10 10 6 6 4 6 8 12 12 8 |
| 6 | 0/49 | 0.03 | 6.6/48.6 | 0 0 8 8 8 8 6 2 4 6 8 6 4 4 6 4 6 6 8 8 8 10 10 0 |
| 8 | 2/73 | 0.00 | 12.8/72.7 | 2 4 6 8 12 14 12 14 16 14 20 16 14 16 10 14 12 10 8 10 12 14 10 2 |
| 10 | 4/100 | 0.00 | 16.9/98.8 | 4 4 14 16 18 12 14 12 20 20 14 8 4 14 10 12 12 14 12 18 12 16 10 8 |
| 15 | 0/170 | 0.00 | 32.5/170.1 | 0 16 22 30 36 30 30 42 38 34 38 36 30 40 34 40 38 34 28 24 32 34 30 12 |
| 20 | 0/248 | 0.00 | 49.0/247.7 | 0 26 52 54 46 44 50 56 60 52 54 58 54 58 50 58 60 46 48 48 56 50 38 14 |
| 25 | 2/331 | 0.00 | 68.0/330.4 | 2 34 48 60 64 72 62 58 72 68 78 74 72 76 66 70 72 62 60 58 66 56 52 26 |
| 30 | 2/417 | 0.00 | 86.3/417.1 | 2 40 64 82 72 90 80 82 84 84 82 92 86 84 80 72 70 84 82 80 82 78 76 44 |
| 35 | 8/507 | 0.00 | 110.5/506.9 | 8 44 78 94 100 112 116 120 106 108 114 104 116 108 116 112 128 124 112 102 72 62 70 58 |
| 40 | 6/600 | 0.00 | 128.1/599.7 | 6 66 92 102 106 102 78 112 116 128 140 140 134 122 124 136 136 126 126 110 110 102 86 40 |

**Near the diagonal, GPU screen** (off-line zeros in the matched window; phi_2 = e, phi_3 = e, and the time shift phi_p = e log p, i.e. Dirichlet part at t + e with the gamma phase at t):

- N = 10 (100 zeros): e=0.0: 4/4/4; e=0.001: 4/4/4; e=0.003: 4/4/4; e=0.01: 4/4/4; e=0.03: 2/2/2; e=0.1: 4/0/6; e=0.3: 8/4/16; e=1.0: 18/10/14; e=-0.001: 4/4/4; e=-0.01: 4/4/4; e=-0.1: 6/6/6; e=-1.0: 12/14/18
- N = 20 (248 zeros): e=0.0: 0/0/0; e=0.001: 0/0/0; e=0.003: 0/0/0; e=0.01: 0/0/4; e=0.03: 2/2/6; e=0.1: 4/4/18; e=0.3: 28/10/58; e=1.0: 44/38/6; e=-0.001: 2/0/2; e=-0.01: 2/2/2; e=-0.1: 4/2/14; e=-1.0: 56/24/6
- N = 40 (600 zeros): e=0.0: 6/6/6; e=0.001: 6/6/8; e=0.003: 6/6/8; e=0.01: 6/6/8; e=0.03: 6/6/20; e=0.1: 20/10/66; e=0.3: 70/34/168; e=1.0: 108/94/110; e=-0.001: 6/6/4; e=-0.01: 4/6/8; e=-0.1: 18/10/56; e=-1.0: 104/104/100
- N = 80 (1413 zeros): e=0.0: 8/8/8; e=0.001: 8/8/8; e=0.003: 8/8/10; e=0.01: 8/10/18; e=0.03: 16/16/54; e=0.1: 56/36/210; e=0.3: 164/92/450; e=1.0: 304/248/440; e=-0.001: 8/8/8; e=-0.01: 8/6/12; e=-0.1: 42/22/192; e=-1.0: 310/264/446
- N = 160 (3260 zeros): e=0.0: 10/10/10; e=0.001: 10/10/10; e=0.003: 10/10/10; e=0.01: 10/12/28; e=0.03: 24/18/154; e=0.1: 104/58/586; e=0.3: 400/226/1056; e=1.0: 676/596/1022; e=-0.001: 10/10/10; e=-0.01: 12/14/36; e=-0.1: 100/68/590; e=-1.0: 724/620/1006

**Euler K = 1 sections of zeta, 20-40 random torus points per P, certified windows of length 50** (T2 predicts PASS for every translate once the window lies above t*):

| P | t* | windows below t*: PASS/FAIL | windows entirely above t*: PASS/FAIL/UNRES |
|---|---|---|---|
| 3 | 25.13 | 29/11 | 40/0/0 |
| 5 | 69.81 | 51/29 | 40/0/0 |
| 7 | 213.8 | 108/72 | 40/0/0 |
| 11 | 718.6 | 190/170 | 100/0/0 |

### 4.6 Q(x0): zeros of the sharp main sum right of 1/2 + x0 in the matched window (certified argument principle)

Mean number of zeros of D_N with Re s > 1/2 + x0 per matched window, by range of N. "zeta+rand" = 10-20 random torus translates of the zeta main sum.

| input | x0 | N run | first N with a zero | N 1-5 | N 6-10 | N 11-20 | N 21-40 | N 41-70 | N 71-100 |
|---|---|---|---|---|---|---|---|---|---|
| zeta | 0.0 | 1..107 (50) | 3 | 2.60 | 9.80 | 27.60 | 70.85 | 106.33 | - |
| zeta | 0.05 | 1..107 (50) | 3 | 2.40 | 8.80 | 22.80 | 56.50 | 84.00 | - |
| zeta | 0.1 | 1..107 (50) | 3 | 2.40 | 7.80 | 18.90 | 43.55 | 60.67 | - |
| zeta | 0.2 | 1..107 (50) | 3 | 1.20 | 5.60 | 9.40 | 19.95 | 25.33 | - |
| zeta | 0.3 | 1..107 (50) | 5 | 0.40 | 2.00 | 3.40 | 4.20 | 5.67 | - |
| zeta | 0.4 | 1..107 (50) | 11 | 0.00 | 0.00 | 0.60 | 0.15 | 0.00 | - |
| zeta+rand | 0.0 | 2..40 (39) | 3 | 3.06 | 11.33 | 30.55 | 78.52 | - | - |
| zeta+rand | 0.1 | 2..40 (39) | 3 | 2.27 | 7.59 | 19.69 | 46.42 | - | - |
| zeta+rand | 0.2 | 2..40 (39) | 3 | 1.25 | 4.55 | 9.53 | 18.54 | - | - |
| zeta+rand | 0.3 | 2..40 (39) | 5 | 0.40 | 1.69 | 2.85 | 3.53 | - | - |
| tw2m | 0.0 | 1..107 (50) | 3 | 2.60 | 10.80 | 32.00 | 78.65 | 126.67 | - |
| tw2m | 0.05 | 1..107 (50) | 3 | 2.20 | 9.00 | 26.20 | 62.05 | 102.00 | - |
| tw2m | 0.1 | 1..107 (50) | 3 | 1.80 | 7.00 | 19.60 | 46.25 | 67.33 | - |
| tw2m | 0.2 | 1..107 (50) | 3 | 0.80 | 3.60 | 9.70 | 18.75 | 24.00 | - |
| tw2m | 0.3 | 1..107 (50) | 5 | 0.40 | 1.40 | 2.50 | 4.25 | 4.00 | - |
| tw2m | 0.4 | 1..107 (50) | 7 | 0.00 | 0.20 | 0.30 | 0.05 | 0.00 | - |
| liou | 0.0 | 1..106 (49) | 3 | 2.60 | 11.00 | 30.70 | 79.15 | 118.33 | - |
| liou | 0.05 | 1..106 (49) | 3 | 2.00 | 8.60 | 26.10 | 63.15 | 89.67 | - |
| liou | 0.1 | 1..106 (49) | 3 | 1.40 | 7.40 | 19.90 | 46.85 | 67.67 | - |
| liou | 0.2 | 1..106 (49) | 3 | 1.00 | 4.60 | 9.70 | 18.10 | 23.33 | - |
| liou | 0.3 | 1..106 (49) | 5 | 0.20 | 1.40 | 2.50 | 3.45 | 4.67 | - |
| liou | 0.4 | 1..106 (49) | 7 | 0.00 | 0.20 | 0.40 | 0.20 | 0.00 | - |
| tw2h | 0.0 | 1..106 (49) | 5 | 0.80 | 6.60 | 20.80 | 56.20 | 92.33 | - |
| tw2h | 0.05 | 1..106 (49) | 5 | 0.80 | 4.80 | 16.30 | 41.65 | 65.33 | - |
| tw2h | 0.1 | 1..106 (49) | 5 | 0.60 | 3.40 | 10.40 | 28.25 | 41.00 | - |
| tw2h | 0.2 | 1..106 (49) | 7 | 0.00 | 1.40 | 3.70 | 9.15 | 10.67 | - |
| tw2h | 0.3 | 1..106 (49) | 11 | 0.00 | 0.00 | 0.80 | 0.55 | 2.33 | - |
| tw2h | 0.4 | 1..106 (49) | 37 | 0.00 | 0.00 | 0.00 | 0.05 | 0.00 | - |
| dh | 0.0 | 1..239 (137) | 7 | 0.00 | 1.00 | 2.90 | 9.45 | 21.13 | 38.00 |
| dh | 0.05 | 1..239 (137) | 7 | 0.00 | 1.00 | 2.50 | 7.35 | 16.03 | 27.46 |
| dh | 0.1 | 1..239 (136) | 7 | 0.00 | 1.00 | 2.30 | 5.65 | 11.57 | 19.59 |
| dh | 0.2 | 1..239 (136) | 10 | 0.00 | 0.20 | 1.30 | 2.50 | 5.13 | 8.63 |
| dh | 0.3 | 1..239 (136) | 11 | 0.00 | 0.00 | 0.30 | 1.10 | 1.87 | 2.41 |
| dh | 0.4 | 1..239 (136) | 22 | 0.00 | 0.00 | 0.00 | 0.10 | 0.20 | 0.33 |

### 4.7 Theta form (b)

Zeros in the window (30 units of t, |Re s - 1/2| < 1): "total/real". Totals are point-sampled windings at 256-700 bits (not interval-certified); the real counts are certified sign changes. `true` rows are fully certified windows for the functions themselves (N = oo).

| input | N | point | t from 3 | t from 33 | t from 63 | t from 93 | t from 123 |
|---|---|---|---|---|---|---|---|
| dh | 1 | diag | 1/1 | 0/0 |  |  |  |
| dh | 2 | diag | 4/2 | 0/0 |  |  |  |
| dh | 3 | diag | 6/4 | 0/0 |  |  |  |
| dh | 4 | diag | 12/12 | 1/1 |  |  |  |
| dh | 6 | diag | 12/12 | 9/7 |  |  |  |
| dh | 14 | diag | 12/12 | 17/17 | 20/18 | 21/19 | 23/23 |
| liou | 2 | diag | 1/1 | 0/0 |  |  |  |
| liou | 3 | diag | 1/1 | 0/0 |  |  |  |
| liou | 4 | diag | 1/1 | 0/0 |  |  |  |
| liou | 10 | diag | 1/1 | 0/0 | 0/0 | 0/0 | 0/0 |
| tw2h | 2 | diag | 1/1 | 0/0 |  |  |  |
| tw2h | 3 | diag | 1/1 | 0/0 |  |  |  |
| tw2h | 4 | diag | 1/1 | 0/0 |  |  |  |
| tw2h | 10 | diag | 1/1 | 0/0 | 0/0 | 0/0 | 0/0 |
| tw2m | 1 | diag | 1/1 | 0/0 |  |  |  |
| tw2m | 2 | diag | 1/1 | 0/0 |  |  |  |
| tw2m | 3 | diag | 1/1 | 0/0 |  |  |  |
| tw2m | 4 | diag | 1/1 | 0/0 |  |  |  |
| tw2m | 10 | diag | 1/1 | 0/0 | 0/0 | 0/0 | 0/0 |
| zeta | 1 | diag | 1/1 | 0/0 |  |  |  |
| zeta | 2 | diag | 5/5 | 2/2 |  |  |  |
| zeta | 3 | diag | 5/5 | 9/9 |  |  |  |
| zeta | 4 | diag | 5/5 | 9/9 |  |  |  |
| zeta | 10 | diag | 5/5 | 9/9 | 12/12 | 14/14 | 14/14 |
| zeta | 4 | line2 | mean 1.3/1.3 (n=11) | mean 0.1/0.1 (n=11) |  |  |  |
| zeta | 10 | line2 | mean 1.5/1.5 (n=6) | mean 0.0/0.0 (n=6) | mean 0.0/0.0 (n=6) | 0/0 | 0/0 |
| zeta | 10 | near0.01 | 4/2 | 0/0 | 0/0 | 0/0 | 0/0 |
| zeta | 10 | near0.05 | 2/2 | 0/0 | 0/0 | 0/0 | 0/0 |
| zeta | 10 | near0.2 | 2/2 | 0/0 | 0/0 | 0/0 |  |
| zeta | 4 | rand | mean 1.3/1.2 (n=60) | mean 0.1/0.1 (n=60) |  |  |  |
| zeta | 10 | rand | mean 1.2/1.2 (n=20) | mean 0.1/0.1 (n=20) | mean 0.1/0.1 (n=20) | mean 0.0/0.0 (n=3) | mean 0.0/0.0 (n=2) |

- `true` zeta: 100 certified windows of length 50 up to t = 5003: PASS 100, FAIL 0, UNRES 0; zeros 4524, off-line 0; first FAIL window starts at -.
- `true` dh: 31 certified windows of length 50 up to t = 1553: PASS 3, FAIL 28, UNRES 0; zeros 1513, off-line 104; first FAIL window starts at 53.0137.

### 4.8 Circle property C, multi-affine symmetrisation MA, witnesses, cross-checks

**C** (numpy roots, 3000 random torus points per variable; fraction of points at which all zeros in w_q are on the circle). Prediction for a K = 1 product: 1 - (2/pi) arccos(eps_q q^{-1/2}) = 0.5, 0.392, 0.295, 0.247, 0.195, 0.179 for q = 2, 3, 5, 7, 11, 13.

| object | w_2 | w_3 | w_5 | w_7 | w_11 | w_13 |
|---|---|---|---|---|---|---|
| euler zeta P13 K1 | 0.493 | 0.395 | 0.299 | 0.238 | 0.187 | 0.165 |
| euler tw2m P13 K1 | 0.496 | 0.399 | 0.302 | 0.247 | 0.196 | 0.188 |
| euler tw2h P13 K1 | 0.236 | 0.381 | 0.292 | 0.246 | 0.196 | 0.179 |
| euler dh P13 K1 | 0.375 | 0.362 |  | 0.249 | 0.192 | 0.183 |
| afe zeta N2 | 0.496 |  |  |  |  |  |
| afe zeta N6 | 0.168 | 0.453 | 0.362 |  |  |  |
| afe zeta N20 | 0.002 | 0.059 | 0.332 | 0.295 | 0.246 | 0.221 |
| afe dh N6 | 0.159 | 0.316 |  |  |  |  |
| afe dh N20 | 0.000 | 0.063 |  | 0.214 | 0.231 | 0.060 |

**MA** (float64 search, 3000 starts each): object: zero in the polydisc before / after polarisation (variables after):

euler zeta P=3 K=2: none / none (4); euler zeta P=5 K=3: none / none (9); euler dh P=3 K=1: none / none (2); euler dh P=3 K=2: zero / zero (4); euler dh P=7 K=2: zero / zero (6); afe zeta N=2: none / none (1); afe zeta N=4: zero / zero (3); afe zeta N=9: zero / zero (7); afe dh N=4: none / none (3); afe dh N=9: zero / zero (6); afe tw2h N=4: none / none (3).

**Witnesses** (mpmath, 30 digits, residual |F|/|G| below 1e-29): explicit off-line zeros behind four certified FAIL verdicts:

- zeta afe N=5 matched: 0.609410680661 + 221.078884111 i
- zeta afe N=2 [3,53]: 1.47359593308 + 4.2592838852 i
- zeta euler P=11 K=1 [3,103]: 0.963445051189 + 14.9519433532 i; 0.972344194825 + 65.2567319151 i; 0.997968798697 + 7.93198443087 i
- tw2m afe N=3 matched: 1.07094604186 + 99.9482555945 i

**Cross-checks.** (i) GPU float counts against certified counts on identical windows (`xcheck.py`): 309 matched windows and 132 translate windows, identical (total, on-line) counts in all. (ii) T3: the translate phi_2 = pi of the zeta Euler P = 5 section and the tw2m section give the same certified counts (n_up = 1, n_tot = 18, n_real = 16 on 3.0137 < t < 53.0137). (iii) T5 (`dh_phase.py`): x_sup(P) from the closed form 0.153042 (P = 7), 0.269668 (13), 0.377424 (23), 0.433974 (47) against the GPU search, which gives lower bounds, 0.1530, 0.2681, 0.3714 and 0.3823 (the last with only 915 starts in 14 variables); all primes: 1/2 + x_sup = 1.12036249. (iv) Self-test of `bl.py` against mpmath: |F_float - F_mp| < 2e-14 at three points; DH poly against the product form: 7e-16.

## 5. Controls, by step

Which step of each property fails for each control (obstruction-map question Q1), and where multiplicativity enters (Q3).

| Control | S1 / HB (torus-uniform) | R on the diagonal (needs the functional equation of the true function) | Comment |
|---|---|---|---|
| DH | fails: zero in the open polydisc from P = 7 (Euler form, T5) and N = 6 (sharp AFE); the step that fails is "zero set of a product is a union of coordinate hypersurfaces" (DH is a sum of two products) | fails at finite size in every scheme (section 3) | the only control killed by a multivariate property |
| NR | fails at P = q: the non-spherical local factor c + w_q + 1/w_q has a zero at |w_q| < 1 (T4 iv) | fails in the first window | killed by S1 at one prime: the local factor is not zero-free on the disc |
| EA | full Euler lift passes S1; fails S1' (poles at |z_p| = p^{-a} inside the unit polydisc) at P = 2; its K-truncations fail S1 at P = 2 | fails in the first windows | separated only by the size normalisation (temperedness), as in the obstruction map |
| TW- (tw2m, liou, every unimodular twist) | passes everything torus-uniform, by T3 (same lifted function, translated) | fails at small size (section 3) | not separable by any torus-uniform property; only by the position of the diagonal |
| TW+ (tw2h) | passes S1 and HB (point of the closed polydisc) | fails at finite size | same |
| B (Beurling) | a Beurling Euler product is again a product of zero-free local factors: passes S1 (PROVED by T4 i; not run) | no functional equation: R not formulable | not separable |
| HEAT | no Dirichlet object; not formulable; not run | | |
| twin ladder (d) | passes S1 (additive positive-real sum, T4 ii) | M = 1, 4: every certified window run (t up to about 1900) is real-rooted for P = 2..47; M = oo: certified off-line zeros (last failing window starts at 1853 for P = 2 with windows run to 1953, at 53 for P = 23, none for P = 47; table 4.3) | shows S1 is not specific to multiplicativity |

Where multiplicativity enters: only in T4(i) and T2 (the supremum splits over primes because the lifted Euler factor is a product over independent variables). Both statements are uniform over the torus, so by T3 they hold for all sign twists, and both are statements at radii p^{-1/2-x} with a threshold t*(P) that is finite for each P and has log(t*/2 pi) >= 4 sqrt P (1 + o(1)) even for arbitrarily thin strips: at a fixed height they cover about (log t)^2/16 primes. This is the l^1/l^2 wall of the obstruction map (section 5, parts 3-4) seen on the polydisc: the lifted Euler factor is zero-free on the whole critical polydisc, and that fact transfers to the actual function only where the product converges.

## 6. What ran

Box: [compute-server], every job launched through `~/rh-push/bin/rhrun` from `~/rh-push/box-bohr-stability/`, never more than 10 cores requested in total, except for about 30 s at 09:10 UTC when a 1-core unit (`rh-bohrN`) was started while 10 cores were already allocated; it was stopped at once and rerun later inside the allowance. Largest memory request 16 GB; largest peak 3.0 GB. GPU 0 for the first two units, GPU 1 (`RH_GPU=1`) for all later GPU stages; cupy pool limit 24 GB, largest planned array 0.24 GB. All units were stopped with `systemctl --user stop <unit>` or ended by themselves; `systemctl --user list-units` shows no `rh-bohr*` unit at 09:58:54 UTC. No process or unit of another lane or of the user was touched. Total wall time on the box: 08:30 to 09:59 UTC (89 minutes).

| unit | request (GB, cores) | content | wall (approx.) | MemoryPeak (systemd, as last read) | CPU time (as last read) |
|---|---|---|---|---|---|
| rh-bohrA-1117083021 | 16, 2 | GPU 0: S1 screen (first 130 objects) | 9 min | 0.81 GB | not recorded |
| rh-bohrB-1117083021 | 16, 2 | GPU 0: matched AFE screen, zeta N <= 344 | 9 min | 0.25 GB | not recorded |
| rh-bohrX1-1117083248 | 12, 6 | exact queue 1 (matched and Euler windows) | 22 min | 0.10 GB | 3880 s at 08:46 |
| rh-bohrA-1117083956 | 12, 1 | GPU 1: S1 screen, remainder | 14 min | not recorded | 229 s at 08:46 |
| rh-bohrB-1117083956 | 12, 1 | GPU 1: matched AFE screen to N = 600 and controls | 35 min | 0.61 GB | 2080 s |
| rh-bohrX2-1117083956, rh-bohrXM-1117085149 | 10-12, 2 | exact queue 2, then merged queue | 12 + 3 min | 0.03 GB | 458 s at 08:46 |
| rh-bohrA2-1117085412 | 12, 1 | GPU 1: threshold check (4e6 torus points per x), fixed-N screen, translate screen | 12 min | 3.01 GB | 160 s at 08:56 |
| rh-bohrXA-1117085506 | 16, 8 | exact merged queue | 12 min | 0.11 GB | 5512 s |
| rh-bohrXP-1117090715 | 16, 9 | exact prioritised queue | 16 min | 0.18 GB | 7960 s |
| rh-bohrN-1117091017 | 12, 1 | (stopped after 30 s, see above) | 0.5 min | - | - |
| rh-bohrB2-1117091442 | 12, 1 | GPU 1: near-diagonal translates, Euler section screen to t = 30003 | 26 min | not recorded | not recorded |
| rh-bohrXQ-1117092315 | 16, 9 | exact prioritised queue (trimmed) | 36 min | 0.20 GB | 18950 s |
| rh-bohrR-1117094145 | 12, 1 | retry of one window with smaller eta; GPU 1: S1 screen N = 52..128 | 8 min | not recorded | not recorded |

Exact stage total: 10,596 certified or point-sampled tasks in `results/exactAll.jsonl` (+2 in `exactR.jsonl`); 3 UNRESOLVED, 0 errors: the zeta matched window N = 9 (resolved as FAIL by the retry with eta = 0.0008: the off-line pair has 0.0008 < |Re s - 1/2| < 0.004), the zeta matched window N = 48 (total 753, certified real 751, no zero with |Re s - 1/2| > 0.02; not retried), and one main-sum count whose contour passes within 1e-7 of a zero. The exact queue was stopped with about 5,600 lower-priority tasks unrun (larger N for the matched certificates, theta-form windows above t = 123, main-sum counts for N > 100). slice memory seen in `rhstatus` during the run: at most 27 GB of 150 (all lanes together).

Local runs (Mac, through `scripts/memcap.sh`, caps 4-6 GB): small-scale versions of every stage, `thresholds.py`, `circ.py`, `polar.py`, `dh_phase.py`, `witness.py`, `xcheck.py`. One local test was killed by the 6 GB cap (an unbounded grid refinement in the first version of `count_window`); the code was fixed by capping array sizes (3e6 points per chunk), not by raising the cap.

Files (all under `push/box-bohr-stability/`): `bl.py` (float64/cupy library), `run_screen.py` (GPU stages), `exact.py` (Arb stage), `lylib.py` (copied unchanged from the sibling lane `box-ly-search`; certified `darg`), `thresholds.py`, `circ.py`, `polar.py`, `dh_phase.py`, `witness.py`, `xcheck.py`, `tables.py`, `summarize.py`, task generators `mk_tasks*.py`, `prio.py`; `results/` (`big_*.jsonl` screens, `exactAll.jsonl`, `exactR.jsonl`, `thresholds.json`, `circ.json`, `polar.json`, `witness.json`, `tables.md`); `logs/` (unit logs copied from the box).

Sibling lanes: `ap-leeyang-ladder` and `ap-leeyang-structural` had code and logs but no RESULT.md when this lane ran; their Euler Hermite-Biehler truncation (`euler_hb.py`) is object (c) here, and their float64 thresholds for K = 1 (11.17, 69.81, 718.48 for P = 2, 5, 11) agree with section 4.2 (11.17, 69.81, 718.6).

## 7. Three weakest points

1. **Screened passes are not verdicts.** Zero-freeness of the Riesz-weighted AFE lifts for N = 7..30 (zeta) and 11..26 (DH), the "no zero found" entries for products (those are covered by the proof T4), the matched-window off-line fractions to N = 600 and all `big_*.jsonl` counts are float64. The float counts were compared with the certified ones on every window run by both stages: 309 matched windows and 132 translate windows, identical (total, on-line) counts in all 441 (`xcheck.py`). The theta-form totals are point-sampled windings at high precision, not interval certificates, because Arb's incomplete-gamma enclosures on wide inputs are too loose to subdivide; only the real-zero counts there are certified.
2. **The statements in section 2 are proved here and unrefereed.** T9(ii) uses Kronecker and Hurwitz in the standard Bohr way and does not cover the boundary case x_sup = 0; L1 relies on the convexity of amoeba complements; the thresholds t*(P) are closed forms evaluated in float64 (not interval arithmetic), checked by a GPU adversarial search that never exceeded them; the bound log(t*/2 pi) >= 4 sqrt P (1 + o(1)) is the leading term of sum 2 log p/(sqrt p + 1) (prime number theorem) and is used only as an order of magnitude; the tabulated values are the numbers to use. The DH criterion T5 reproduces the supremum 1.1203625 of the obstruction map to 8 digits, with a float64 prime sum to 2e7 and an exponential-integral tail.
3. **The density observation (verdict item 5) is a measurement with no theorem behind it.** The decay of the off-line fraction for zeta (0.0217, 0.0127, 0.0084, 0.0052, 0.0038, 0.0028 over six ranges of N) is compatible with t^{-1/4} but is fitted on six bins; the sharp cutoff is not the Riemann-Siegel formula with remainder terms, and no claim is made about what a smoothed or corrected main sum would give. Controls E_a and T-NR were not run in the AFE form (E_a has degree 2 and a different matched length), backward heat is not formulable, and Beurling products were treated by proof only.
