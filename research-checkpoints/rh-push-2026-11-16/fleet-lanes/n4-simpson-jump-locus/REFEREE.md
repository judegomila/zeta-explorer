# REFEREE: n4-simpson-jump-locus

Referee verdict: **the negative verdict holds (precise obstruction, nothing about zeta zeros), with three corrections.** All PROVED computations were re-derived by hand and confirmed symbolically. One item labelled PROVED is a statement of the cited paper itself, and the paper's own repair of it was not examined; one paragraph has a sign error. Neither changes the conclusion.

Checks run: `/tmp/n4ref/referee_checks.py` through `scripts/memcap.sh 8` (sympy, 4x4 integer matrices and scalar symbolics, < 100 MB, < 60 s). Source checked: Connes-Consani arXiv:1805.10501, text extracted with pdftotext (sections 5.2, 5.3, 7).

## 1. Re-derivations

### Test 1 (pseudo-Anosov): confirmed
- Recomputed M from the twist formula x -> x + e*omega(x,v)v independently: same matrix, charpoly t^4-3t^3+5t^2-3t+1, irreducible over Q, Delta(1)=1, moduli 0.580692, 1.722084 (u = t+1/t solves u^2-3u+3=0, discriminant -3). Lefschetz numbers and the series identity to order 12 reproduce.
- Salem example reproduces (u^2-3u+1=0; moduli 0.464313, 1, 1, 2.153721).
- Different case (new): T_c1 T_c2 T_c3^-1 T_c4^-1 T_c5^2 gives t^4-5t^3+9t^2-5t+1, irreducible, Delta(1)=1, all four roots off the circle (moduli 0.422082, 2.369205), series identity holds. A second new word (c1 c2^-1 c3 c4^-1 c5) factors as (t^2-5t+1)(t^2-3t+1): reducible, so the irreducibility filter is doing work.
- Wang-sequence statement and Casson-Bleiler criterion are correctly quoted. The chain's homology classes need not be checked against a picture: any Sp(4,Z) element lifts to a mapping class and the criterion applies to every lift.
- Not new: non-unitary Alexander roots of fibred 3-manifolds with pseudo-Anosov monodromy are standard. The file labels this MEASURED+CLASSICAL, which is accurate.
- Wording defect: M_phi is a 3-manifold (and b_1=1), so it is not a candidate Kaehler manifold for a reason unrelated to holomorphy. The clean comparison is M_phi x S^1 (b_1=2; jump points (t,1), Delta(t)=0, isolated, non-unitary, hence not Kaehler by Arapura), against the periodic case where M_phi x S^1 is a quotient of Sigma x E. The conclusion "holomorphy of the monodromy is the separating step" is unaffected.

### Test 2 (C*/p^Z): confirmed
- d + s du splits as unitary part it du plus Hermitian part sigma du = theta + conj(theta), theta = (sigma/2)dz, holomorphic and nowhere zero for sigma != 0, so the Higgs complex is acyclic. Jump locus {sigma=0, p^{-it}=1}. This restates p^{-s}=1 => Re s=0; correctly described as carrying no information.
- E_a statement (rank 2, diag(a,-a)) follows per eigenline.

### Test 3 facts from [CC]: confirmed against the paper
Right action (y,x)(u,v)=(uy, x+vy) (Lemma 5.4 proof); X, Y, [Y,X]=X, dbar <=> X+iY, Laplacian (42) (Prop. 5.1); mapping torus, exceptional leaf p^Z\H, type III_{1/p} (Lemma 5.5, Thm 5.1); dm = dn(x)dy/y (46); alpha, beta, d alpha = alpha^beta; Prop. 5.2 and its algebra (finite q-support for each y, relation (47), orbit sectors = C_c^infty(R_+^*)); rational-lambda sentence (line before section 5.1). All as quoted.

### 4.2: confirmed (computation); sign error in the "location of 1/2" paragraph
- d(dz/(2iy)) = -(i/2) omega: confirmed symbolically.
- Y* = 1-Y, X* = -X for dx dy/y^2; d*(sigma beta + d phi) = sigma - Delta phi, Delta = X^2+Y^2-Y = y^2(d_x^2+d_y^2): confirmed.
- No solution on Gamma(p): for phi in the [CC] algebra, X phi has no q=0 component and Y phi integrates to zero over R_+/p^Z, so the dm-integral of Delta phi is 0 while that of sigma is sigma*log p. Correct. On a single leaf H the equation is solvable (phi = -sigma log y gives Delta phi = sigma; confirmed), so the obstruction is the compact quotient, as the file says.
- Chern curvature of h = y^{-2 sigma} is i sigma omega: confirmed. (L_s,h) = K_F^{-sigma} x unitary: correct.
- **Error (E1).** "s <-> 1-s is K_F^{-s} <-> K_F x (K_F^{-s})^{-1}, fixed point K_F^{1/2}." With L_s = K_F^{-s}, K_F x L_s^{-1} = K_F^{1+s} = L_{-1-s}: Serre duality is s <-> -1-s, centre s = -1/2. The bundle at the centre of the jump locus of 4.3 (sigma = +1/2) is K_F^{-1/2}, not K_F^{1/2}. Likewise Y+s (the operator in d_s) is skew for the leaf area iff Re s = -1/2, and skew for dm (the invariant finite measure on Gamma(p)) iff Re s = 0. In the file's own convention the value +1/2 arises only as the midpoint of the two de Rham lines Re s=0 (classes y^{-s}, y^{-s}beta) and Re s=1 (classes y^{1-s}alpha, y^{1-s}alpha^beta), i.e. from d alpha = alpha^beta, not from Serre duality of the family K_F^{-s}. The paragraph is interpretive and no later step uses it; the sentence should be corrected or removed.

### 4.3: confirmed
- d_s formulas re-derived by hand (d(g alpha) = -(Yg) alpha^beta + g alpha^beta; s beta ^ g alpha = -s g alpha^beta).
- Homotopy identity needs (Y+s)X^{-1} = X^{-1}(Y+s-1), which is [Y,X]=X conjugated by X^{-1}. Checked symbolically with arbitrary functions F(y)e^{2 pi i q x}, q = -3/11 (different sector from the file's 5/7) and symbolic s: residual 0 in degrees 0, 1, 2. This is the twisted form of the homotopy in the proof of [CC] Prop. 5.2; at s=0 the file's complex reduces to theirs.
- q=0 sector: ker(Y+s) and coker(Y+s) non-zero iff p^s=1; ker and coker of Y+s-1 iff p^{s-1}=1. Checked numerically at p=7 (file used 3): s = 2 pi i*3/log 7 and 1 + 2 pi i*2/log 7 are jump points; 1/2 + 2 pi i/log 7 and 1/2 + 14.134725i are not.
- Scope, correctly flagged in the file's weakest step 1: X^{-1} is multiplication by 1/(2 pi i q y) on C_c^infty(R_+^*), which is unbounded as y -> 0 (sup on [7^-10,1] is 1.6e8 for q=-3/11). In L^2(Gamma(p)) or any space allowing support accumulating at y=0 along the orbit, 0 is in the spectrum of X and acyclicity of the q != 0 sectors is not established. The statement is proved for the [CC] algebra only. The summary line "jump locus Re s in {0,1}" should carry that qualifier.

### 4.4: formal, labelled OPEN. Agreed.

## 2. Substantive corrections

**(C1) Section 4.1 is not a new result and the cited paper contains a repair that the lane did not examine.** [CC] section 7 states in so many words that the right action of R_+^* does not preserve the complex structure of Prop. 5.1, because it sends x+iy to x+i lambda y. The Beltrami value (1-lambda)/(1+lambda) is a one-line consequence. This should be labelled CLASSICAL ([CC] section 7), not PROVED here; RESULT.md cites only "formula (ii) before Prop. 5.1" and never mentions section 7.
More important: [CC] section 7.1 replaces C-valued functions by W-valued functions (W the characteristic-one Witt ring), defines holomorphy by (lambda X + iY) chi_lambda(f) = 0 for all lambda (93), and proves (Prop. 7.1) that Fra_mu = theta_mu o R(mu^{-1}) preserves this condition. So item 4.5(a), "the flow acts by stretches, fails by a proved computation", is true for C-coefficients and not shown for the W-coefficient lift, which is the version the authors propose for the Frobenius.
Referee's assessment of the gap (on paper, not a proof): chi_lambda(f) is holomorphic in x + i lambda y, so a W-holomorphic f is a compatible family over the whole Teichmueller ray of leaf structures, which the flow permutes. No single Kaehler structure is preserved; this is the structure of test 1 (the pseudo-Anosov flow also permutes the complex structures along its axis). An X-invariant W-holomorphic function is leafwise constant, so the s-family y^{-s} still has no holomorphic representative, and 4.2 (b), 4.3 (c), (d) do not involve the choice of coefficients. I therefore expect the obstruction to survive, through (b)-(d) alone. But "fails at three independent named points" should read "fails at (b)-(d); (a) fails for C-coefficients and is unexamined for the W-coefficient Frobenius of [CC] 7.1".

**(C2) Sign error E1** in 4.2 (above).

**(C3) Scope of 4.3** in the verdict line: [CC]-algebra only (above).

## 3. Controls
- The lane makes no zeta-specific claim, so there is no mechanism for Davenport-Heilbronn, backward heat or sign twist to break. Sections 4.1-4.3 involve only the lift and the character |x|^s; I confirm no Dirichlet series or prime-side input enters any step. DH non-multiplicativity quoted in section 5 checked: a(2)a(3) = -0.0807, a(6) = 1.
- The E_a remark (Gamma(p) returns the pattern of zeta(s)zeta(s-1)) is correct and is the informative control: the construction outputs a control-type locus.
- Selberg control: s(1-s) = lambda_j and existence of eigenvalues in (0,1/4) (Randol) are correctly quoted; not recomputed (as the file says).

## 4. Other checks
- No step assumes RH. Verified height is not used. "zeta has no zeros in (0,1)" in section 6 is classical and used only in an unpursued pivot.
- No known theorem is presented as new except 4.1 (C1). Section 4.3 is a direct twist of [CC] Prop. 5.2, and the file says so.
- OBSTRUCTION_MAP.md has no row matching Simpson, Arapura, the complex lift or Deninger (grep): the "no existing row" statement is accurate.
- Pivot (section 6): poles of the scattering coefficient xi(2s-1)/xi(2s) at s = rho/2: correct. Not run, no claim.

## 5. Surviving claim
On the Connes-Consani complex lift with C-coefficients: Re s enters as the exponent of the leafwise canonical bundle (curvature i sigma omega), d + s beta has no harmonic metric on Gamma(p) within the [CC] function algebra, and the s-twisted de Rham cohomology of Gamma(p) in that algebra is non-zero exactly for p^s = 1 or p^{s-1} = 1. The non-holomorphy of the scaling action is [CC]'s own statement; the W-coefficient Frobenius of [CC] 7.1 was not examined. The pseudo-Anosov control and the one-prime model are correct. No statement about zeta zeros.

Open items a follow-up could close in one page: (i) the W-coefficient version of 4.5(a); (ii) the q != 0 sectors in a function space allowing support down to y = 0 (weakest step 1 of the result).
