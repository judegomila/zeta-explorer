# Opposite-parity raw cross-Grams are fixed by positive-parent derivatives

Status: exact auxiliary identity, separately awaiting review. This is not a PSD claim for the full raw signed Gram.

Let T_i,T_j be real polynomials with parity i,j, with i+j odd, and let g be the actual real decaying theta profile used in MODULAR_REFLECTION.md. Write F_i=T_i(D)g and K_i=T_i'(D)g. Then
 integral_R uF_iF_j
 =-(1/2)[<K_i,F_j>_L2+<F_i,K_j>_L2].
Proof: A=T_iT_j is odd, hence A(D)^*=-A(D). Thus2<g,uA(D)g>=-<g,A'(D)g>. Also T_i(D)^*=(-1)^iT_i(D), and commute T_i past u using [T_i(D),u]=T_i'(D). Substitution gives the formula.

After division by sqrt(s_i s_j), every mixed-parity raw signed cross entry is therefore a known positive-parent derivative pairing, rather than an independent reflected signed moment. This does NOT make the pairing positive: it is a signed cross product in a positive L2 space. It also does not replace actual pivot denominators.

Important convention: the full spectral bridge moment Gram has zero cross-parity entries because its weight is even. The raw real physical matrix integral uF_iF_j generally does NOT have zero mixed-parity entries; the Fourier phases and commutator terms distinguish the two. Applying a block-diagonal identity to the raw real matrix would be wrong. The invariant modular G-energy constrains this raw matrix, with these explicitly determined cross terms retained.
