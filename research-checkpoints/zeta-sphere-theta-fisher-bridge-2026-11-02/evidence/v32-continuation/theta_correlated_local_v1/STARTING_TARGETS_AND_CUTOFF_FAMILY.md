# Starting target reserves and a continuous finite spatial-cutoff family

The actual even8 and odd9 target values at H=1/8 can be bounded noncircularly. Combining those independently evaluated starting values with signed whole-cell flow bounds certifies positive five-channel tail matrices for EVERY spatial cutoff0<=H<=1/8. This is normalized a=0 finite-degree spatial coverage, not a new maximum degree, an all-shift theorem, or an all-order proof.

## 1. Evaluate the unknown starting target rather than assume it

Retain the original complete-theta moments m_j(H)=2 integral_H^infinity u²psi(u)²g_j(u)du. The old4x4 blocks and cross columns are as in NEXT_TARGET_SIGNED_TAIL_FLOW.md.

For even8, the freshly prepared corrected-midpoint m8(1/8) is now explicitly used as the target mass c. It was present as an odd9 cross moment in the earlier joint input file, but the even8 flow did not use it. Using it here is a new, declared target evaluation, not a retroactive assumption in that flow.

For odd9, `check_tail_target_m9.py` newly evaluates m9(1/8) by8000-cell midpoint quadrature on[1/8,2], with the complete second-derivative error w³ sup|density''|/24. The existing derivative20 implementation suffices because g9'' needs log derivatives only through20. The outer envelope
 (256/sqrt(pi))(18)!9^9 Z^(27/2)exp(-2Z), Z=pi exp4,
 is the same full-theta moment bound, now at index9. Its log-derivative tail integration has2-(27/2)/Z>1. The derivative20 coefficient bound already covers g9, so no further orbit or derivative truncation is introduced.

`check_starting_tail_targets.py` reads only those newly evaluated target masses and the previously evaluated actual old/cross moments. An interval LDL solve computes b^TA^-1b in the actual metric. No previous target Schur sign or prior global endpoint certificate is an input.

Conservative results in h/(4pi) units:
- Even8 mass between23,685,233,368,855 and23,685,233,390,836; feedback cost between23,022,958,234,103 and23,022,958,278,170. Starting tail Schur >662,275,090,686.
- Odd9 mass between5,275,735,063,317,991 and5,275,997,036,774,888; feedback cost between5,189,407,244,908,385 and5,189,407,300,915,478. Starting tail Schur >86,327,762,402,476.

The negative inverse costs are retained explicitly. Positivity is the result of enclosing their difference, not an assumption about a headline mass or a positive parent norm.

Adding the separately proved positive inward-flow differences reproduces normalized global endpoint bounds:
 even8 S(0)>683,064,657,698;
 odd9 S(0)>88,620,292,357,019.
These global signs were already covered by earlier work; their independent reconstruction is not a new degree result.

## 2. A full spatial-cutoff interval, not just two positive endpoints

Positive endpoints alone do not imply positive intermediate signed matrices. The new `check_target_cutoff_family.py` explicitly encloses them.

It starts from the independently computed starting Schur interval above and repeats the prior16000-cell correlated target-flow calculation. For a cell beginning at inward time t_i, let G_i enclose the cumulative integral of S' up to t_i, and let[qlo,qhi] enclose the actual signed source S' throughout that cell. For every0<=delta<=w,
 S(t_i+delta)>=lower(S_start+G_i)+w min(0,qlo).      (1)
This retains any possible negative partial-cell contribution. The sharper midpoint integral with its exact third-derivative remainder is used only to advance G_i to the next cell, not to replace the whole-cell lower bound(1).

The actual old4x4 block remains positive on every whole cell, as explicitly checked by interval LDL. Therefore the signed source and its inverse are defined throughout. The checker records the minimum of(1) across all cells, including the starting endpoint.

The resulting uniform lower bounds are:
 even8: S(H)>661,939,225,341 for every0<=H<=1/8;
 odd9: S(H)>85,750,382,533,241 for every0<=H<=1/8.  (2)

By Schur congruence with the verified positive old4x4 block, (2) proves that the corresponding entire5x5 tail matrix is positive for every such spatial cutoff. No monotonicity of S or local density is assumed. The known odd local-density negative direction near0 remains part of this interval; integration and the actual inverse are what are controlled.

## 3. Exact relation to previously certified scope

Three distinct variables must not be conflated:
- Polynomial degree: the present bases are0,2,4,6,8 and1,3,5,7,9.
- Spectral/bridge shift a: this calculation is only the normalized endpoint a=0.
- Spatial cutoff H: the newly explicit interval here is0<=H<=1/8.

Earlier independently reviewed `full_split_audit/AUDIT.md` already proves the global normalized a=0 odd channels1,3,...,19. It also proves a positive actual-tail residual at its separate cutoffH=1/16; its core/tail normalization is documented in `core_inertia_audit/AUDIT.md` and `actual_tail_repair_audit/AUDIT.md`. This does not automatically imply a continuous cutoff interval because local densities can be indefinite.

Earlier independently reviewed `source_0145_audit/EVEN_A4_AUDIT.md` proves the global even channels0,2,4,6,8 quantitatively for0<=a<=1/2, with the separately reviewed outer-strip sign for a>=1/2. Thus even8 already has stronger global spectral-shift coverage than the present normalized calculation. That global theorem does not by itself certify every spatially truncated tail.

The meaningful additional statement supplied by this packet is therefore explicit, continuous spatial-cutoff control for the two finite5x5 normalized matrices, together with independently evaluated starting reserves and correlated source transport. It does not extend the known global degree range or bridge-shift range. Because the normalized spectral signed form is even, its mixed-parity polynomial entries vanish. The two finite results therefore combine to normalized a=0 degree-at-most9 block-diagonal positivity on this spatial cutoff interval. This is distinct from the auxiliary physical positive-parent Gram, whose cross-parity entries need not vanish. No positive-shift full H9, all-shift odd9, arbitrary-cutoff tail positivity, or all-degree conclusion follows. In particular, it does not revive the already refuted universal-tail shortcut.
