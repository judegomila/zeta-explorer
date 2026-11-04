# Mobius cancellation on exact-theta packets and the selection gap

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves nine frozen source files byte-for-byte, including their original checksum manifest. Working files are excluded. Earlier frozen payloads and checksums, the integrated paper, application code, CI workflows, and live 4CT work remain unchanged.

**Smooth compact packets are not algebraic polynomials, and fixing an arithmetic endpoint coefficient is not fixing a polynomial leading coefficient. Transfer to complete monic-polynomial selection remains open, as do actual selected h_n tending to zero, a_n(s_n)=1+o(s_n), and RH.**

## Positive result on its stated space

Read the [source summary](src/README.md), [full arithmetic correction and exact-theta packet proof](src/MOBIUS_TWIST_CORRECTION.md), [shifted-moment/reselection audit](src/SHIFTED_MOMENT_AND_RESELECTION_AUDIT.md), and [audit/scope record](src/AUDIT.md).

The proof retains the full ordinary arithmetic-log correction, complete cubic derivative correction, every arithmetic pair, the exact gamma-envelope derivative, and smooth-window derivative terms. Moment errors are controlled relative to the arithmetic energy on the whole growing coefficient space. Complete endpoint reselection is repeated after the theta/window perturbation; an independent source lower bound is retained.

For a fixed smooth real window eta supported in (1,2), normalized by integral eta squared equal to one, the packets are

    p_c(t)=a(t)^(-1) eta(t/T) sum_(j<=N)c_j(j/N)^(-it),

extended by zero, with a the exact positive gamma envelope. Minimizing the exact global theta source X over every coefficient vector with c_N=1 gives

    H[p]/X[p] <= C_eta (1+loglog(N+3))^2/(log T)^2

in the stated regime N<=T^(1/100). These are generally complex compactly supported smooth functions. No real-polynomial, fixed-parity, monic-degree, or original P_n conclusion is inferred. The conservative exponent 1/100 is not claimed optimal. The separate ordinary zeta-moment result has its own published range theta<17/53 and must not be substituted for the complete cubic packet range.

## Scoped obstructions to polynomial transfer

The [leading-constraint note](src/POLYNOMIAL_LEADING_CONSTRAINT_OBSTRUCTION.md) and [independent audit](src/INDEPENDENT_AUDIT_POLYNOMIAL_LEADING_CONSTRAINT.md) give a controlled common-degree Pollaczek approximation, but its leading functional approaches the first arithmetic coordinate rather than the last Mobius endpoint. Their exact arithmetic-energy squared overlap is at most 1/phi(N), and is zero for nonsquarefree N. Better approximation alone therefore does not repair this map's affine constraint. Its specified carrier recentering also incurs a non-negligible derivative cost in the stated reselected positive-sum GCD model. These results concern the specific map and model, not every possible transfer construction or an identification of actual exponential Gram matrices with the GCD kernel.

The [internal-theta map analysis](src/THETA_SELECTION_INTERTWINER.md) and [independent audit](src/INDEPENDENT_AUDIT_THETA_SELECTION_INTERTWINER.md) show that one differential polynomial applies a common polynomial to all internal summands. Complete-sum rigidity excludes independently varying Mobius weights under that map. Each fixed nonzero finite reflected-source target also has a target-dependent positive distance from actual polynomial sources. That floor may vanish along growing cutoffs, does not contradict the earlier finite-theta approximation, and does not apply indiscriminately to Fourier-modulation labels.

A full result still requires one controlled construction matching the whole lower-degree space, the monic affine functional, both source and derivative forms, and the growing arithmetic scale. This package does not supply it.

## Verification boundary

The proofs and separate audits are AI-assisted analytical work, not external peer review or machine formalization. This backup verifies preservation integrity and scope, not mathematical proofs or inherited primary-source inputs. No finite numerical scan supplies a sign or asymptotic conclusion. Working artifacts and acquired third-party material are not copied. Primary-source citations and historical sibling-folder references are retained unchanged. No literature-novelty claim is made.

MANIFEST.json records the exact nine-file source allowlist, byte lengths, and SHA-256 hashes. The preserved src/SHA256SUMS verifies eight Markdown payloads. The outer SHA256SUMS covers every package file except itself. Run `python3 verify_checkpoint.py` to verify exact coverage, both checksum layers, byte lengths, and scope labels. Preparation also compares every copied source with its frozen original. Only this new checkpoint directory is proposed for publication.
