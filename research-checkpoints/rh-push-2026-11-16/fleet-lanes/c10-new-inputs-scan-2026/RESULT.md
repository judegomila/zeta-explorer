# c10-new-inputs-scan-2026: scan of public results 2026-10-15 to 2026-11-18 against the reopening rule

Lane kind: explore (lead 28, STRATEGY section 3). Date of scan: 2026-11-18. No statement about zeros of zeta is made by this lane. No requirement flag can rise from it.

## 1. Plan

1. Decisive test first: does any result posted since 2026-10-15 supply (a) a signed sum over Kloosterman or Gauss-sum moduli, (b) a row family with a nontrivial weight-1 epsilon cocycle, (c) a normaliser without zeros in Re s > 1/2, or (d) an every-window statement from a family input?
2. Table every relevant result with status and the closed family, device or map row that names it as its missing tool.
3. At most three lanes for round 11, each with its control screen.

## 2. Work

Access: web search and arXiv pages were reachable. Sources used: two arXiv abstract-search listings sorted by announcement date (term sets: Gauss sums / Kubota / metaplectic / zero-free / quasi-Riemann / large sieve / spectral reciprocity; and Patterson / sextic / cubic characters / ratios conjecture / negative moments / zero density / Riemann hypothesis / theta coefficients / Mobius), the math.NT "recent" listing (13 to 19 Nov), and eleven topical web searches. Queries contained generic terms and public arXiv identifiers only. The repository's literature monitor (`scripts/logs/rh-lit-monitor.log`, read as text) has its last entry on 2026-10-22 and flagged only 2610.27343; it adds nothing for the window.

Depth of reading (this bounds every entry below):
- Opened in full text, partially: 2610.04045 (PDF pages 1 to 6, saved as `dl/2610.04045.p1-6.txt`); 2611.16665, 2610.26835, 2611.00924, 2611.12500 (HTML, read through a summarising fetch tool; the first 100k characters only for 2610.26835 and 2611.12500).
- Abstract only: all other entries.
- No proof was checked. Every mathematical claim attributed to a preprint below is **unverified** and is a report of what the preprint states. None is refereed; none is formalised except where stated by its authors (and those statements were not checked here).

Coverage gaps: both arXiv listings were cut by the fetch tool after 166 of 200 rows (the cut fell at May and September 2026 identifiers, so the window itself was covered for those term sets); math.RT, math.AG and math-ph were searched only through those term sets; the arXiv API returned HTTP 429.

One local computation: `density_table.py` (run through `scripts/memcap.sh 8`, exact rationals) evaluates the zero-density exponent of 2610.04045 Corollary 1.5 as transcribed from the PDF text; the transcription was checked by continuity at both breakpoints (values 1/n and 1 - 2/n) and by delta_n(1) = 1. The compute server was not used.

### 2.1 Decisive test

| Item | Outcome | Evidence |
|---|---|---|
| (a) signed sum over Kloosterman or Gauss-sum moduli | **Not supplied in the form the map needs.** One result has a signed modulus sum of a different kind. | Li-Zhong 2611.12500 states a power saving abs(T_C) << abs(R_C) C^(1 - delta_0) for T_C = sum over squarefree n of g(n/C) 2^(-omega(n)) S(1,1;n)/sqrt(n) W_C(n) with nonnegative sieve and Hecke-constraint weights. The modulus is n, the sign is kept. It concerns classical GL(2) Kloosterman sums S(1,1;n) with a fixed argument, a positive weight and no twist by theta coefficients or cubic rows; TRO6 (map row Z1 to Z8, section 6 item 4) needs the sign of beta_c against a varying row. Hong 2611.01452, 2611.01451 keep the Moebius coefficient in Gauss-sum generating series but bound the resulting quotient of L-functions under GRH: a conditional input, not usable. |
| (b) row family with a nontrivial weight-1 epsilon cocycle | **No new type.** One new instance of the known type at order 4. | Ji 2611.16665 uses quartic Kubota series "of angular weight 1" over Q(i) (cited from David-Dunn-Hamieh-Lin). "Angular weight" there is the weight of the angular Hecke character in the row, not a cocycle of the epsilon factor; the family is Gauss-sum (Jacobi) type of order 4, the same kind as the sextic rows. Its abscissa is 599/600, weaker than 11/12 and 7/8, consistent with map row Z14 (row order 3 only at r = 6). Karasiewicz 2611.13988 and Ahmad et al. 2611.18049 are local statements about covers (genericity; dualizing involutions on Kazhdan-Patterson covers) and give no global Whittaker constant of a genuine cusp form on a cover of GL(3) (pending item of `engine/curated/devices.json`, map 6.18). |
| (c) normaliser without zeros in Re s > 1/2 | **None found.** | The three architecture papers of the window (2610.26835 v2, 2611.00924, 2611.16665) keep the format of Proposition 2.1; 2611.16665 carries a ratio L(w, conj xi_u)/L(z, xi_u) and controls zeros of the family by a density bound, not by a zero-free normaliser. Map row Z24 (cap at abscissa 2/3) is not addressed by any of them. |
| (d) every-window statement from a family input | **No new mechanism; one new input of the known mechanism.** | The 7/8 architecture is already the one recorded case where a family average gives a height-uniform statement for one target. New within it: 2611.16665 consumes a family zero-density estimate (2610.04045 Cor. 1.5) directly as the input for nonprincipal characters. Outside the architecture: the negative-moment and minimum results (Bui-Florea-Heycock 2610.27591) are for almost all t or in mean, under RH; the ratios papers are conditional on the ratios conjecture. MV-CAP (row P29) is not escaped by any of them. |

Result of the decisive test: no result in the window reopens a closed family toward the critical line. Two results are named new inputs for part B (numbers inside [5/6, 7/8]) and for the stale frontier figures. No pivot taken: the assignment continues to the table and the lane proposals.

### 2.2 Table of results

Status column: P = preprint, unrefereed; "cond." = conditional on the named hypothesis. All claims unverified here.

| # | Result | One-line statement (as claimed) | Status | Names it as missing tool / nearest record |
|---|---|---|---|---|
| 1 | de Faveri, 2610.04045 (2 Oct 2026; outside the window by date, not on file in push/, campaign/ or engine/) | For n >= 3 and n-th-power-free families of n-th order Hecke characters: large sieve norm << (AB)^eps (A + B + A^(1-1/n) B^(2/n) + A^(2/n) B^(1-1/n)), stated unconditional; matching lower bounds known for n = 3, 4. Cor. 1.5: family zero density N^(1 - delta_n(sigma)) T^(1 + d(1-sigma)/(3-2 sigma)). Cubic second moment by conductor << X^(1+eps); cubic squarefree second moment with X^(5/6) secondary term and error X^(3/4+eps). | P | Row Z14 source note "open optimal quartic input; Framework A only" (`r2-zf-paired-rows`): this is that input. Rows Z12 and Z6 used the (KD)^(2/3) sextic sieve (0.7653 at the critical class; Q^0.8 in the Type I/II split): for n = 6 the off-diagonal term is A^(5/6) B^(1/3) + A^(1/3) B^(5/6), which exceeds A + B only for B^(4/5) < A < B^(5/4) and equals A^(7/6) at A = B (old: A^(4/3)). Row Z5 already records P^(1/12) as the best possible for an inequality valid for all c against a needed P^0: at A = B the new sieve attains that cap and does not pass it. Family 14 of STRATEGY 3.1 (part B only). |
| 2 | Ji, 2611.16665 v2 (12/15 Nov 2026) | zeta_{Q(i)}(s), hence zeta(s), has no zero in Re s > 599/600; quartic Gauss sums; two Poisson summations plus the functional equation of the quartic Kubota series of angular weight 1; nonprincipal characters through the density bound of item 1 (n = 4); main term from a residue and a lattice average over fourth powers. Author states the first draft was machine-produced and then checked by the author. | P, not formalised | Rows Z13 (changing field), Z14 (r = 4 rows), Z20 (number-field literature). Weaker than 11/12 and 7/8. New element: a three-proposition architecture with a density input and parameters H = X^(65/144), Y = X^(1/288); not replayed here. |
| 3 | Liu, 2610.26835 v2 (29 Oct 2026) | Every finite-order Hecke L-function over every number field has no zero in Re s > B_flat = 0.8748866470..., root of 133488 B^4 - 376596 B^3 + 384534 B^2 - 167541 B + 26231; cyclotomic fields containing mu_12, then descent. Abstract restricts descent to metabelian normal closure; Theorem 17.1 is reported as stated for all number fields (the two scopes were not reconciled here). Lean formalisation "in progress" per the paper. | P | Already on file as the 0.874887 follow-up (map section 3.5 header; rows Z9 to Z13). The v2 scope ("every number field") postdates what the brief records. B_flat is described as the exact infimum of its comparison system: agrees with row Z10. |
| 4 | Liu, "An improved zero-free half-plane for Hecke L-functions over number fields ...", cited in item 5 as "Hexagon 2610.00655v1" (29 Oct 2026) | Prior bound beta*(F) <= B* < 0.8745 (from item 5, B* = 0.87446205769353 + 1/160000 = 0.8744683...). | P; not located on arXiv; not opened | Would replace the frontier figure 0.874887 in the brief and scoreboard part B. Unlocated: treat as a citation inside another preprint. |
| 5 | Chang-Wang, 2611.00924 (31 Oct 2026) | "Exhaustion-aware" product moment: first-mean gain 1/20000 on the critical ordinary-length interval, endpoint B* - 1/160000 = 0.87446205769353 for fields containing mu_12, then descent; zero-free conclusion conditional on four cited theorems of items 3 and 4 in uniform form. | P, cond. on items 3, 4 | Family 14 (slot and moment refinements). Scalar-size change; the paper needs B > 437/500 at its Mellin step and a prime cap kappa = 749/1000 licensed by the prior bound (compare row Z19). No new arithmetic input reported. |
| 6 | Li-Zhong, 2611.12500 (9 Nov 2026) | Signed sum over squarefree moduli of S(1,1;n)/sqrt(n) with beta-sieve weights (dimension 4) and small-Hecke-eigenvalue constraints at marked primes has a power saving; both signs occur with at most R_0 prime factors in residue classes mod M <= C^delta. Explicit example (83 prime factors, M <= C^(11/200)) uses the 7/8 half-plane for Dirichlet L-functions. | P; example cond. on the 7/8 preprint | Test item (a): different object (see 2.1). It is a consumer of the 7/8 result (same class as row Z20 consumers). |
| 7 | Hong, 2611.01452 (31 Oct 2026) | First moments of primitive quartic and sextic Dirichlet L-functions: errors Q^(49/58+eps) and Q^(23/26+eps), under GRH; Moebius kept, giving a quotient of L-functions bounded under GRH; Gauss-sum generating series. | P, cond. GRH | Map section 6 item 4 (signed sum; Moebius kept) and lead 17 name this shape; the input is conditional, so it reopens nothing. |
| 8 | Hong, 2611.01451 v2 (1/7 Nov 2026) | Cubic first moment over Q: secondary term of order Q^(5/6) with strictly negative coefficient, error Q^(23/28+eps), under GRH. Stated unconditional part: squarefree cubic second moment over Q(sqrt(-3)) has a degree-one secondary polynomial with positive leading coefficient. | P; main part cond. GRH | Row Z3 (explicit Q^(5/6) polar term, constant K0 = 0.0206959, in the twisted first moment). Independent appearance of the Q^(5/6) term; a sign and size cross-check for Z3, not an input. |
| 9 | Hong, 2610.33505 (24 Oct 2026) | Over F_q(T), q = 2 mod 3: first moment of primitive cubic L-functions has an explicit term of order q^(5g/6), coefficient real and periodic in g mod 6, remainder q^((23/28+eps) g); unconditional. | P | Function-field transplant (map 3.7; lead 2; lanes `c10-ff-completed-rows-692`, `c9-mv6-ff-window-exact`). The mod-6 periodicity of the secondary coefficient is the function-field counterpart of the class dependence in row Z3. |
| 10 | Gou-Wang-Xu, 2611.18825 (13 Nov 2026) | Landau's four problems with power-saving errors under the ratios conjecture for zeta; unconditional Goldbach and prime-pair asymptotics over large fixed odd function fields (Sawin's estimates, discriminant cohomology). | P; number-field part cond. | "Mean values of 1/L over families" in the assignment. Conditional over Q; function-field part is a family statement with q large and fixed. No every-window output. |
| 11 | Lee, 2610.32672 (23 Oct 2026) | Hardy-Littlewood prime-pair asymptotic from a uniform zeta-ratios conjecture. | P, cond. | Same as item 10. Abstract not opened beyond the title and item 10's description. |
| 12 | Bui-Florea-Heycock, 2610.27591 (20 Oct 2026) | Under RH: negative moments of abs(zeta(1/2 + alpha + it)) of size alpha^(-k^2), 1/log T << alpha = o(1); M(x) << sqrt(x) exp(C sqrt(log x / log log x)); minima in windows of length 1 are alpha^(1+o(1)) in probability. | P, cond. RH | Family 4 and MV-CAP: conclusions are in mean or in probability, hypothesis is RH. No input. |
| 13 | Broucke-Revesz, 2611.03356 (2 Nov 2026) | Landau's local method in a general setting; zero-free region and prime number theorem for Beurling systems with well-behaved integers; zeros close to the 1-line occur in clusters; sharpness discussed. | P | Control B (Beurling). It supports the reading that classical-region tools hold for B; no change to the control table. Body not opened. |
| 14 | Weil's quadratic form on a finite interval, 2610.32704 (Oct 2026; authors not recorded by the fetch) | Under RH: a self-adjoint extension built from Weil's form with finitely many places has eigenvalues converging to zero ordinates; inverse of the local extension is a compression of the inverse of a global operator. | P, cond. RH | Family 3 (window forms) and the square-root lane. Conditional on RH; finitely many places. No input. |
| 15 | Karasiewicz, 2611.13988 (10 Nov 2026) | For tame n-fold Brylinski-Deligne covers of split p-adic groups with n large, every genuine irreducible Iwahori-spherical representation is generic (new proof). | P, local | Pending item "global Whittaker constants of a genuine cusp form on the double cover of GL(3)": not supplied (local, large n). |
| 16 | Ahmad et al., 2611.18049 (13 Nov 2026) | Dualizing involutions on Kazhdan-Patterson covers of GL(r). | P, local; title only | Same pending item: not supplied. |
| 17 | Not opened, listed for completeness | Ono 2610.38870 (asymptotic Jensen-Polya criterion for GRH); Danesh 2611.10726 (two-interval criterion for RH); Manzur-Quintero 2611.03924 (Hardy space approximation and zero-free half-planes); Yin 2610.37371 (zero density, symmetric square, weight aspect); Freire et al. 2610.27343 (de Bruijn-Newman bounds for real characters; the monitor's one HIGH hit); Nguyen 2611.20347; Molla 2611.00623 (alpha pi mod 1 in F_q(T)); Park 2611.19626 (Betti metaplectic Langlands). | P; titles only | Criterion papers fall under map 3.1 (positivity reformulations) unless they contain a multiplicative step; this was not checked. |
| 18 | Outside the window, on topic | de Faveri-Dunn-Hoffstein 2607.07911 (already on file in `r3-higher-rows-dual`); Ma 2606.26440 (Patterson-type bias bound over F_q[t], homological; cited only inside an unrelated packet under `verify-0107965`); 2608.23886 (Fourier spectral reciprocity, canonical Hecke L-functions). | P | 2606.26440 is the natural function-field source for row Z4's remark that the function-field model reduces to the target's Weil bound; not opened here. |

Nothing found in the window for: spectral reciprocity; Patterson's conjecture over number fields; correlations of sextic Kubota theta coefficients (TRO6 itself); global cusp forms on covers of GL(3).

### 2.3 Numbers computed here (from the transcribed formula of item 1; relative to that preprint)

Exponent 1 - delta_n(sigma) of N in the family zero-density bound (`density_table.py`):

| sigma | 2/3 | 3/4 | 5/6 | 7/8 | 9/10 | 11/12 |
|---|---|---|---|---|---|---|
| n = 3 | 0.8889 | 0.8000 | 0.6667 | 0.5385 | 0.4545 | 0.3939 |
| n = 4 | 0.8750 | 0.7500 | 0.6154 | 0.5000 | 0.4286 | 0.3750 |
| n = 6 | 0.8333 | 0.7273 | 0.5714 | 0.4661 | 0.3904 | 0.3333 |

These are not compared with the critical-class count R_c = 0.5903 of row Z11: that count has its own normalisation (class, length, moment), and the conversion was not derived here.

## 3. Controls

This lane makes no argument about zeros, so there is no step to fail on a control. What can be said for the inputs found:
- Item 1 (large sieve, density): an inequality valid for arbitrary coefficients lambda_b. It is blind to the target and holds for THIN, U and every sign twist as the b-sequence. By round-4 lesson 7 and family 14, it can move numbers inside the architecture and cannot supply R3; R3 stays where it is now (periodicity in the conductor aspect, Lemma 5.8).
- Item 2 (quartic rows): same architecture; THIN would have to fail at the Kubota functional-equation step (Poisson in the modulus), as in `c4-thin-twist-control-78`. Not checked for the quartic paper.
- Items 7, 8, 10 to 12, 14: conditional on GRH, RH or the ratios conjecture; the control question does not arise.
- EIS-w and thin prime deletion: no item of the window acts on automorphic resonance states or on a positivity statement, so neither control is exercised.

## 4. Proposed lanes for round 11 (at most three)

**Lane A (repair/deepen, part B only): rerun rows Z12, Z6 and the quartic line of Z14 with the n-th order sieve of item 1.** Named new input: 2610.04045 Theorem 1.1 and Corollary 1.5 (unrefereed). Tasks: (i) open the full PDF and confirm that the family of Example 2.2/2.3 type covers the sextic rows of the manuscript and that the theorem is unconditional; (ii) replace (KD)^(2/3) by K^(5/6) D^(1/3) + K^(1/3) D^(5/6) at the critical class of Z12 (0.7653 against 0.5903) and in the Type I/II range of Z6 (Q^0.8 against Q^(1/2 - eta)); (iii) Framework A abscissae for (4,4) with the quartic sieve. Pre-registered expectation: Z5's cap (P^(1/12) for any all-c inequality) is attained, not passed, so TRO6 stays open and the abscissa moves only inside [5/6, 7/8], if at all. Control screen: THIN passes (arbitrary coefficients) so the lane cannot raise R3; U passes; EIS-w not applicable (no automorphic resonance object); thin prime deletion passes (the sieve does not see the b-sequence). Exact LP at default size, local.

**Lane B (deepen, part B only): replay of the density-input architecture of item 2 and its transplant to r = 6.** Named new input: the three-proposition scheme of 2611.16665 with 2610.04045 Cor. 1.5. Tasks: (i) transcribe Propositions 2.1 to 2.3 and Lemma 4.3 and replay the exponent arithmetic exactly (does 599/600 follow from H = X^(65/144), Y = X^(1/288) and E(sigma)?); (ii) decide whether the scheme is an instance of the Proposition 2.1 format with h/r = 1/600 or a different format, and whether the exceptional term (P_a^(1/6) in the sextic case) appears in it at all; (iii) put n = 6 (delta_6, sextic Kubota series of the manuscript) into the same ledger and report the abscissa. Kill condition: if the transplant is above 7/8 the lane stops with the ledger as its record. Control screen: THIN must fail at the Kubota functional-equation step, to be located in the text; U same; EIS-w not applicable; thin prime deletion: check whether the main term (residue at w = 1 plus fourth-power lattice average) survives deletion of a thin prime set, which would mean the main-term step is not where arithmetic enters.

**Lane C (repair, records): frontier figures and cross-checks.** (i) Update part B of the scoreboard and the brief's frontier sentence: claimed abscissae now on public listings are 0.874886647 (item 3, all number fields), B* < 0.8745 (item 4, unlocated) and 0.874462058 (item 5, conditional on items 3 and 4); all unverified. (ii) Replay item 5's scalar step (first-mean gain 1/20000, length shift 1/40000, reserve > 7e-6) with exact rationals, and check it against row Z10 (K = (3R+1)/4 - theta/2 is the LP optimum of its system) and row Z19 (kappa cap). (iii) Cross-check row Z3's Q^(5/6) term (K0 = 0.0206959, class dependence) against the secondary terms of items 8 and 9, including the mod-6 periodicity in genus over F_q(T). Control screen: none needed for (i); for (ii) THIN, U and thin prime deletion pass a scalar optimisation by construction, so the result is a number, not a mechanism; EIS-w not applicable.

No lane toward the critical line is proposed: the decisive test found no named new input for families 1 to 13 of STRATEGY 3.1 or for the ORDER-2 lemma.

## 5. Verdict

**precise-obstruction** (for the reopening rule). As of 2026-11-18, the public listings searched contain no result that supplies items (a) to (d) in the form the closed families require. The 7/8 architecture has four further preprints in the window (items 2 to 5); each keeps the same format and the same normaliser, and the largest claimed movement is from 0.874887 to 0.874462. One result outside the architecture (item 1) is a named missing tool for three map rows, at part-B level.

## 6. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | Literature scan; no argument constructed. |
| R2 (height-uniform, every window) | false | No conclusion about zeros is drawn. |
| R3 (every control fails at a named step) | false | No mechanism to test; section 3 records only how the found inputs relate to controls. |
| R4 (reaches the critical line) | false | No result found moves a claimed abscissa below 0.8744; none addresses row Z24 or ORDER-2. |

## 7. Three weakest steps

1. **Depth of reading.** Entries rest on abstracts or on a summarising fetch tool that saw at most the first 100k characters of long HTML pages. Statements such as "no new estimate for sextic theta correlations in 2610.26835" or "2611.16665 uses no sign cancellation over moduli" are reports of what the tool returned, and a relevant lemma in an unread part would not have been seen. The scope of 2610.26835 Theorem 17.1 (all number fields against the abstract's metabelian condition) is unresolved.
2. **Coverage.** Two keyword listings, one five-day listing and eleven web searches; math.RT, math.AG, math-ph, non-arXiv venues and journal acceptances were not systematically scanned, and item 4 could not be located. "Nothing found" for spectral reciprocity, TRO6-type correlations and global cusp forms on covers of GL(3) means not found by these queries.
3. **Matching to map rows.** The assignment of item 1 to rows Z5, Z6, Z12, Z14 uses the row texts and a comparison of sieve terms only; the families and normalisations of 2610.04045 (n-th-power-free ideals, S-integers of class number 1) were not matched to the manuscript's sextic rows, and the density exponents of section 2.3 come from a formula transcribed from garbled PDF text (checked by continuity only).

## Files

- `RESULT.md` (this file)
- `density_table.py` (exact evaluation of the transcribed exponent)
- `dl/2610.04045.p1-6.txt` (text of pages 1 to 6 of the public PDF; untrusted download, read as text only)
